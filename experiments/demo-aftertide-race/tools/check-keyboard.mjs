import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const args=new Set(process.argv.slice(2));
const option=(name,fallback)=>Number(process.argv.find(x=>x.startsWith('--'+name+'='))?.split('=')[1]??fallback);
const driftOnly=args.has('--drift-only');
const results={};
const host=spawn(process.execPath,['tools/serve.mjs','--port','0'],{stdio:['ignore','pipe','inherit'],windowsHide:true});
const url=await new Promise((done,fail)=>{
  host.stdout.on('data',data=>{const address=String(data).match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0];if(address)done(address);});
  host.on('error',fail);host.on('exit',code=>fail(new Error('HTTP server exited '+code)));
});
let browser;
try {
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-gpu','--ignore-gpu-blocklist','--use-angle=d3d11','--disable-software-rasterizer']});
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(url+'?qa=1');
  await page.waitForFunction(()=>window.__aftertide?.ready);
  const renderer=await page.evaluate(()=>{
    const gl=document.querySelector('#drive canvas').getContext('webgl2');
    return gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL);
  });
  assert.doesNotMatch(renderer,/unknown|SwiftShader|WARP|llvmpipe/i);

  async function run(id,setup,drive) {
    await page.evaluate(data=>window.__aftertide.prepareKeyboardLab(data),setup);
    await page.locator('#start').click();
    await page.waitForFunction(()=>window.__aftertide.keyboardLog().rows.length>=3);
    await drive();
    const data=await page.evaluate(()=>window.__aftertide.keyboardLog());
    assert(data.keys.length>=2&&data.keys.every(k=>k.trusted));
    const first=data.keys[0], t0=first.time;
    const pre=data.rows.filter(r=>r.time<t0).at(-1)?.screenNose??0;
    const rows=data.rows.map(r=>({...r,time:r.time-t0,screenNose:r.screenNose-pre}));
    const keys=data.keys.map(k=>({...k,time:k.time-t0,ms:k.wall-first.wall}));
    results[id]={setup,rows,keys};
    return results[id];
  }
  const pause=(ms)=>page.waitForTimeout(ms);
  async function tap(key,ms) {
    if(ms!==150){await page.keyboard.press(key,{delay:ms});return;}
    await page.keyboard.down(key);
    // Use the browser's own keydown timestamp so CDP dispatch time is measured.
    await page.waitForFunction(delay=>performance.now()>=window.__aftertide.keyboardLog().keys.at(-1).wall+delay,
      ms-6,{polling:4});
    await page.keyboard.up(key);
  }
  const steerCase=(id,key,kmh,ms,after)=>run(id,{kmh},async()=>{await tap(key,ms);await pause(after);});
  if(!driftOnly) {
    await steerCase('right-100','d',100,1000,800);
    await steerCase('left-100','a',100,1000,800);
    await steerCase('arrow-right-100','ArrowRight',100,1000,650);
    await steerCase('arrow-left-100','ArrowLeft',100,1000,650);
    await steerCase('tap-100','d',100,150,1250);
    await steerCase('tap-140','d',140,150,1250);
    await steerCase('hold-100','d',100,3000,1100);
    await run('power-high-140',{kmh:140},async()=>{
      await page.keyboard.down('w');await tap('d',2100);
      await page.keyboard.up('w');await pause(1050);
    });
    await run('power-kick-40',{kmh:40},async()=>{
      await page.keyboard.down('d');await pause(340);
      await page.keyboard.down('w');await pause(950);
      await page.keyboard.up('w');await page.keyboard.up('d');
      await tap('a',270);await pause(1300);
    });
  }
  const driftSetup={kind:'hairpin',kmh:80,s:option('entry',329),d:option('offset',-.6)};
  const hand=option('hand',700), lead=option('lead',190), counter=option('counter',280);
  await run('hairpin-80',driftSetup,async()=>{
    await page.keyboard.down('d');await pause(lead);
    await page.keyboard.down('Space');await pause(hand);
    await page.keyboard.up('Space');await page.keyboard.up('d');
    await tap('a',counter);
    await pause(2050);
  });
  if(!driftOnly)await run('pedals',{},async()=>{
    await page.keyboard.down('w');
    await page.waitForFunction(()=>window.__aftertide.state().motion.speed>=105);
    await page.keyboard.up('w');
    await pause(240);
    await tap('s',1350);
    await pause(550);
  });
  assert.deepEqual(errors,[]);

  const max=(rows,k)=>Math.max(...rows.map(r=>Math.abs(r[k])));
  const maxSigned=(rows,k)=>rows.reduce((a,r)=>Math.abs(r[k])>Math.abs(a)?r[k]:a,0);
  const average=(rows,k)=>rows.reduce((a,r)=>a+r[k],0)/rows.length;
  const digest={renderer,errors};
  for(const [id,{keys,rows}] of Object.entries(results)){
    const first=keys[0], up=keys.find(k=>k.code===first.code&&k.type==='up');
    const released=rows.find(r=>r.time>=up.time)??rows.at(-1);
    const held=rows.filter(r=>r.time>=0&&r.time<=up.time);
    const m={initialKmh:rows.find(r=>r.time>=0).speed,keyMs:up.ms,maxYawRate:max(rows,'yawRate'),maxBeta:max(rows,'beta'),
      maxRoll:max(rows,'roll'),rightHeading:released.rightHeading,rightM:released.rightM,screenNosePx:maxSigned(held,'screenNose'),
      finalYawRate:rows.at(-1).yawRate,finalBeta:rows.at(-1).beta,finalRack:rows.at(-1).steer,
      finalRightM:rows.at(-1).rightM,finalRightHeading:rows.at(-1).rightHeading,maxImpact:max(rows,'impact'),
      peakIntent:max(rows,'driftIntent'),maxCameraLag:max(rows,'cameraYawLag'),
      maxTireRms:max(rows,'tireRms')};
    if(id==='hold-100'){
      const steady=held.filter(r=>r.time>up.time-.6);
      m.steadyYawRate=average(steady,'yawRate');
      m.steadyLatG=average(steady,'latG');
      m.peakLatG=max(rows,'latG');
      m.maxRack=max(rows,'steer');
      m.endRack=released.steer;
      m.outsideFrontN=Math.max(...held.map(r=>r.wheels[0].load));
      m.insideFrontN=Math.min(...held.map(r=>r.wheels[1].load));
    }
    if(id==='hairpin-80'){
      const flip=keys.find(k=>k.code==='KeyA'&&k.type==='down').time;
      const handAt=keys.find(k=>k.code==='Space'&&k.type==='down').time;
      m.handStartKmh=rows.find(r=>r.time>=handAt).speed;
      m.handStartS=rows.find(r=>r.time>=handAt).routeS;
      const peak=rows.reduce((a,r)=>Math.abs(r.beta)>Math.abs(a.beta)?r:a,rows[0]);
      const recovered=rows.find((r,i)=>r.time>=flip&&r.time>=peak.time&&Math.abs(r.beta)<=3&&Math.abs(r.yawRate)<=8&&
        rows.at(-1).time>=r.time+.3&&rows.slice(i).filter(next=>next.time<r.time+.3).every(next=>Math.abs(next.beta)<=3&&Math.abs(next.yawRate)<=8));
      m.slidePeakAt=peak.time;m.recoverAfterCounter=recovered?recovered.time-flip:null;
      m.recoverAtTrackS=recovered?.routeS??null;m.endTrackS=rows.at(-1).routeS;m.maxOffset=max(rows,'offset');
      m.counterRack=max(rows,'counterAssist');
      m.keys=keys.map(k=>[k.code,k.type,Number(k.time.toFixed(3))]);
    }
    if(id==='pedals'){
      m.shifts=rows.filter((r,i)=>i&&r.gear>rows[i-1].gear).map(r=>({
        time:r.time,gear:r.gear,rpm:r.rpm,
        dip:r.rpm-Math.min(...rows.filter(n=>n.time>=r.time&&n.time<r.time+.40).map(n=>n.rpm))
      }));
      m.downshifts=rows.filter((r,i)=>i&&r.gear<rows[i-1].gear).map(r=>r.time);
      m.idleEngineRms=average(rows.filter(r=>r.time<0),'engineRms');
      m.loadedEngineRms=average(rows.filter(r=>r.time>.25&&r.time<1.5),'engineRms');
      m.maxEngineRms=max(rows,'engineRms'); m.maxBrakeRms=max(rows,'brakeRms'); m.maxShiftRms=max(rows,'shiftRms');
      m.maxMixRms=max(rows,'mixRms'); m.maxCameraLaunch=max(rows,'cameraLaunch');m.maxCameraBrake=max(rows,'cameraBrake');
      m.maxCameraShift=max(rows,'cameraShift');
    }
    digest[id]=JSON.parse(JSON.stringify(m,(_key,v)=>typeof v==='number'?Number(v.toFixed(3)):v));
  }
  console.log(JSON.stringify(digest,null,2));
  const dest=new URL('../telemetry/',import.meta.url);
  await mkdir(dest,{recursive:true});
  if(!driftOnly){
    await writeFile(new URL('keyboard-summary.json',dest),JSON.stringify(digest,null,2)+'\n');
    await writeFile(new URL('keyboard-samples.json',dest),JSON.stringify(results)+'\n');
  }
  if(!driftOnly&&!args.has('--measure')) {
    for(const id of ['right-100','left-100','arrow-right-100','arrow-left-100']){
      const m=digest[id], sign=id.includes('right')?1:-1;
      assert(m.rightM*sign>.2&&m.rightHeading*sign>3&&m.screenNosePx*sign>5,id+' direction');
    }
    for(const id of ['tap-100','tap-140']){
      const m=digest[id];
      assert(m.keyMs>=137&&m.keyMs<=163&&m.maxYawRate<9&&m.maxBeta<3&&Math.abs(m.finalYawRate)<1&&
        Math.abs(m.finalBeta)<1&&m.finalRightM>0,id+' stability');
    }
    const held=digest['hold-100'];
    assert(held.maxImpact===0&&held.maxBeta<4&&held.steadyYawRate< -8&&held.steadyYawRate> -26&&held.peakLatG<1.12&&
      held.maxTireRms>.008&&held.outsideFrontN>held.insideFrontN+2000,'held steer');
    const high=digest['power-high-140'];
    assert(high.maxBeta<4&&high.peakIntent===0&&Math.abs(high.finalYawRate)<1,'high speed full throttle');
    const kick=digest['power-kick-40'];
    assert(kick.maxBeta>8&&kick.maxBeta<37&&kick.peakIntent>.4&&Math.abs(kick.finalBeta)<2,'intentional low speed throttle kick');
    const drift=digest['hairpin-80'];
    assert(drift.maxBeta>=10&&drift.maxBeta<=37&&drift.recoverAfterCounter!==null&&drift.recoverAfterCounter<2&&
      drift.maxImpact===0&&Math.abs(drift.finalYawRate)<2,'drift / recovery');
    const p=digest.pedals;
    assert(p.shifts.length>=2&&p.downshifts.length>=1&&p.shifts.every(s=>s.dip>1200)&&p.loadedEngineRms>p.idleEngineRms*1.45&&
      p.maxBrakeRms>.012&&p.maxShiftRms>.01&&p.maxMixRms>.026,'audible pedal and shift cues');
    assert(p.maxCameraLaunch>=.10&&p.maxCameraBrake>=.12&&p.maxCameraShift>=.02,'camera cues');
  }
} finally {
  if(browser) await browser.close();
  host.kill();
}
