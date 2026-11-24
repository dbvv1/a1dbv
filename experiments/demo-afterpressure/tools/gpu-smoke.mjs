import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openBrowser,gpuName,installFrameTrace } from './local-browser.mjs';

const width=1920,height=1080;
const flag=name=>{ const i=process.argv.indexOf(name); return i<0?undefined:process.argv[i+1]; };
const root=flag('--root');
const {gatePanel,relay,entry,overlook}=await import(root?pathToFileURL(resolve(root,'src/layout.mjs')).href:'../src/layout.mjs');
const audioFile=flag('--audio');
const videoFile=flag('--video');
const details=flag('--details');
if(details)await mkdir(details,{recursive:true});
const capture=await openBrowser({width,height,root,video:videoFile});
const {page,url,errors,foreign}=capture;
const save=process.argv.includes('--screenshots');
const snap=name=>save?page.screenshot({path:name}):undefined;
const detail=name=>details?page.screenshot({path:join(details,name)}):undefined;
const status=()=>page.evaluate(()=>gameStatus);
const wait=(fn,arg,timeout=5500)=>page.waitForFunction(fn,arg,{timeout});
const hold=async(key,ms)=>{
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
};
const mousePause=()=>page.waitForTimeout(37);
const aim=async(x,y,z,ads=false)=>{
  const s=await status(),[px,py,pz]=s.position;
  const yaw=Math.atan2(px-x,pz-z),pitch=Math.atan2(y-py,Math.hypot(x-px,z-pz));
  const difference=s.aim[0]-yaw,sense=ads?.00155:.00248;
  const dx=Math.round(Math.atan2(Math.sin(difference),Math.cos(difference))/sense);
  const dy=Math.round((s.aim[1]-pitch)/sense);
  await page.evaluate(([movementX,movementY])=>{
    document.querySelector('canvas').dispatchEvent(new MouseEvent('mousemove',{movementX,movementY,buttons:2,bubbles:true}));
  },[dx,dy]);
  await mousePause();
};
const walk=async(x,z,epsilon=.26)=>{
  for(let n=0;n<4;n++){
    const {position:[px,py,pz]}=await status();
    const distance=Math.hypot(px-x,pz-z);
    if(distance<epsilon)return;
    await aim(x,py,z);
    await hold('KeyW',Math.round(distance*1000/3.86));
    await page.waitForTimeout(155);
  }
  const {position}=await status();
  assert.ok(Math.hypot(position[0]-x,position[2]-z)<epsilon,JSON.stringify({waypoint:[x,z],position}));
};
const target=async(index,ads=true)=>{
  const {drones}=await status();
  const d=drones[index],s=index===2?1.16:1;
  const [x,y,z]=d.position;
  await aim(x+Math.sin(d.yaw)*.37*s,y+.03,z+Math.cos(d.yaw)*.37*s,ads);
};
let capturedContact=false;
const fight=async(index)=>{
  await page.mouse.down({button:'right'});
  await mousePause();
  for(let i=0;i<24;i++){
    if(!(await status()).drones[index].health)break;
    await target(index);
    await page.mouse.down({button:'left'});
    if(details&&!capturedContact&&index===0&&i===0) {
      await wait(()=>gameStatus.shots>0);
      await detail('contact.png');
      capturedContact=true;
    } else await page.waitForTimeout(39);
    await page.mouse.up({button:'left'});
    await page.waitForTimeout(152);
  }
  await page.mouse.up({button:'right'});
  const last=await status();
  assert.equal(last.drones[index].health,0,JSON.stringify({fight:index,last}));
};

try {
  await page.addInitScript(recordAudio=>{
    const create=AudioContext.prototype.createDynamicsCompressor;
    AudioContext.prototype.createDynamicsCompressor=function() {
      const compressor=create.call(this);
      const meter=this.createAnalyser();
      meter.fftSize=1024;
      compressor.connect(meter);
      window.audioProbe=()=>{
        const samples=new Float32Array(meter.fftSize);
        meter.getFloatTimeDomainData(samples);
        return {state:this.state,rms:Math.sqrt(samples.reduce((sum,v)=>sum+v*v,0)/samples.length)};
      };
      if(recordAudio) {
        const stream=this.createMediaStreamDestination();
        const recorder=new MediaRecorder(stream.stream,{mimeType:'audio/webm;codecs=opus'});
        const chunks=[];
        compressor.connect(stream);
        recorder.ondataavailable=event=>chunks.push(event.data);
        document.querySelector('#start').addEventListener('click',()=>recorder.start(),{once:true});
        window.finishAudio=()=>new Promise(resolve=>{
          recorder.onstop=()=>{
            const reader=new FileReader();
            reader.onload=()=>resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(new Blob(chunks,{type:recorder.mimeType}));
          };
          recorder.stop();
        });
      }
      return compressor;
    };
  },Boolean(audioFile));
  await installFrameTrace(page);
  await page.goto(url);
  await wait(()=>!document.querySelector('#start').disabled&&window.gameStatus,undefined,45000);
  await snap('afterpressure-title.png');
  await page.getByText('设置与按键').click();
  await page.locator('#volume').fill('79');
  assert.equal(await page.locator('#volumeLabel').textContent(),'79%');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('afterpressure.settings')).volume),79);
  await page.getByRole('button',{name:'进入闸站'}).click();
  await wait(()=>gameStatus.pointerLocked&&audioProbe().state==='running');
  await page.keyboard.press('Escape');
  await wait(()=>gameStatus.screen==='paused');
  const paused=await status();
  await page.waitForTimeout(140);
  assert.equal((await status()).time,paused.time);
  await page.getByRole('button',{name:'继续',exact:true}).click();
  await wait(()=>gameStatus.pointerLocked);
  await wait(()=>gameStatus.sequence==='arrival'&&gameStatus.shot===0&&gameStatus.time>1.2);
  await snap('afterpressure-01-arrival.png');
  await wait(()=>gameStatus.sequence==='arrival'&&gameStatus.shot===1&&gameStatus.time>4.1);
  await snap('afterpressure-02-intake.png');
  await wait(()=>gameStatus.sequence===null&&gameStatus.objective==='entry');
  await walk(-2.46,14.78);
  await aim(entry.x,entry.y,entry.z);
  if(details) {
    await page.keyboard.down('KeyE');
    await wait(()=>gameStatus.action==='entry'&&gameStatus.actionTime>.39);
    await detail('access.png');
    await wait(()=>gameStatus.entry);
    await page.keyboard.up('KeyE');
  } else await hold('KeyE',825);
  await wait(()=>gameStatus.entry);
  if(save) {
    await aim(-1.04,1.85,12.85);
    await wait(()=>gameStatus.doors[0]>1.15);
    await snap('afterpressure-03-entry.png');
  }
  await walk(-1.26,14.85);
  await walk(-1.24,5.55);
  await wait(()=>gameStatus.objective==='engage');
  await snap('afterpressure.png');
  if(save) {
    await target(0,false);
    await wait(()=>gameStatus.drones[0].state==='charge'&&gameStatus.drones[0].charge>.37);
    await snap('afterpressure-charge.png');
  }
  await page.keyboard.down('KeyC');
  try {
    await wait(()=>gameStatus.position[1]<1.25);
    assert.ok((await status()).position[1]<1.25);
  } finally {
    await page.keyboard.up('KeyC');
  }
  await page.waitForTimeout(220);
  if(save){
    await page.mouse.down({button:'right'});
    await target(0);
    await page.waitForTimeout(130);
    await snap('afterpressure-aim.png');
    await page.mouse.up({button:'right'});
  }
  await fight(0);
  assert.ok((await status()).checkpoint);
  const rms=await page.evaluate(()=>audioProbe().rms);
  assert.ok(rms>0);
  await walk(-2.32,-2.25);
  await fight(1);
  await walk(-1.18,-13.4);
  await fight(2);
  await page.keyboard.press('KeyR');
  await wait(()=>gameStatus.reloading);
  if(save){
    await wait(()=>gameStatus.reloadProgress>.352);
    await snap('afterpressure-reload.png');
  }
  await wait(()=>gameStatus.ammo===12&&!gameStatus.reloading);
  await walk(-4.62,-15.90);
  await aim(relay.x,relay.y,relay.z);
  await wait(()=>document.querySelector('#promptText').textContent.includes('液压旁路'));
  await hold('KeyE',540);
  assert.equal((await status()).relay,false);
  await page.keyboard.down('KeyE');
  await wait(()=>gameStatus.action==='relay'&&gameStatus.actionTime>.44);
  await snap('afterpressure-bypass.png');
  await wait(()=>gameStatus.relay);
  await page.keyboard.up('KeyE');
  if(save) {
    await walk(-1.43,-18.98);
    await aim(-1.43,2.83,-21.21);
    await wait(()=>gameStatus.doors[1]>.65);
    await snap('afterpressure-04-isolation.png');
  }
  await walk(-1.43,-20.31);
  await walk(-1.40,-22.18);
  await wait(()=>gameStatus.objective==='gate');
  await walk(1.78,-22.07);
  if(save) {
    await aim(3.67,1.85,-24.57);
    await snap('afterpressure-04-control.png');
  }
  await aim(gatePanel.x,gatePanel.y,gatePanel.z);
  if(details) {
    await page.keyboard.down('KeyE');
    await wait(()=>gameStatus.action==='gate'&&gameStatus.actionTime>.44);
    await detail('actuator.png');
    await wait(()=>gameStatus.sequence==='opening');
    await page.keyboard.up('KeyE');
  } else await hold('KeyE',820);
  await wait(()=>gameStatus.sequence==='opening'&&gameStatus.shot===0&&gameStatus.gate>1.10);
  await snap('afterpressure-05-gate.png');
  await wait(()=>gameStatus.sequence==='opening'&&gameStatus.shot===1&&gameStatus.gate>=6.20);
  await snap('afterpressure-sluice.png');
  await wait(()=>gameStatus.relief&&gameStatus.sequence===null);
  await walk(6.24,-22.08);
  await walk(6.24,-30.92);
  await aim(3.70,.18,-37.7);
  await snap('afterpressure-06-walkout.png');
  if(details) {
    await aim(11.90,2.36,-39.2);
    await detail('slope.png');
  }
  await walk(6.24,-33.12);
  await aim(overlook.x,overlook.y,overlook.z);
  await hold('KeyE',700);
  await wait(()=>gameStatus.sequence==='confirmation'&&gameStatus.shot===0);
  await page.waitForTimeout(520);
  await snap('afterpressure-07-inspection.png');
  await wait(()=>gameStatus.sequence==='confirmation'&&gameStatus.shot===1);
  await page.waitForTimeout(730);
  await snap('afterpressure-08-gorge.png');
  await wait(()=>gameStatus.screen==='won');
  await snap('afterpressure-09-debrief.png');
  const won=await status();
  assert.equal(won.kills,3);
  assert.ok(won.relay&&won.gate>=6.2);
  if(videoFile)await page.waitForTimeout(1200);
  if(audioFile)await writeFile(audioFile,Buffer.from(await page.evaluate(()=>finishAudio()),'base64'));
  await page.getByRole('button',{name:'再玩一次'}).click();
  await wait(()=>gameStatus.pointerLocked&&gameStatus.health===100&&gameStatus.kills===0);
  await wait(()=>gameStatus.sequence==='arrival');
  await page.keyboard.press('Space');
  await wait(()=>gameStatus.sequence===null&&gameStatus.shots===0);
  await walk(-2.46,14.78);
  await aim(entry.x,entry.y,entry.z);
  await hold('KeyE',1020);
  await wait(()=>gameStatus.entry);
  await walk(-1.26,14.85);
  await walk(-1.24,5.55);
  await fight(0);
  await walk(-1.98,-11.30);
  await wait(()=>gameStatus.screen==='lost',undefined,32500);
  await snap('afterpressure-failure.png');
  await page.getByRole('button',{name:'从检查点重试'}).click();
  await wait(()=>gameStatus.pointerLocked&&gameStatus.health===100&&gameStatus.kills===1);
  const checkpoint=await status();
  assert.equal(checkpoint.drones[0].state,'dead');
  assert.ok(checkpoint.entry&&checkpoint.sequence===null);
  await page.keyboard.press('Escape');
  await wait(()=>gameStatus.screen==='paused');
  await page.getByRole('button',{name:'从头开始'}).click();
  await wait(()=>gameStatus.pointerLocked&&gameStatus.health===100&&gameStatus.kills===0);
  const renderer=await gpuName(page);
  assert.doesNotMatch(renderer,/swiftshader|unavailable/i);
  assert.deepEqual(errors,[]);
  assert.deepEqual(foreign,[]);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
  const timing=await page.evaluate(()=>window.frameTrace());
  const {frames, ...summary}=timing;
  if(flag('--trace')) await writeFile(flag('--trace'),JSON.stringify({renderer,...timing},null,2));
  console.log(JSON.stringify({
    renderer,timing:summary,
    mission:{kills:won.kills,shots:won.shots,hits:won.hits,weakPoints:won.optics,armor:won.health,time:won.time,gateHeight:won.gate},
    checkpoint:{kills:checkpoint.kills,armor:checkpoint.health},audioRms:rms,errors,foreign
  },null,2));
} catch(error) {
  const diagnostic=await status().catch(()=>null);
  console.error(JSON.stringify({diagnostic,errors,foreign}));
  if(save)await page.screenshot({path:'smoke-failure.png'});
  throw error;
} finally {
  await capture.close();
}

