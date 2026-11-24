import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {openBrowser,gpuName} from './local-browser.mjs';
import {entry} from '../src/layout.mjs';

const [root='.',out='r8-review/route',motion]=process.argv.slice(2);
await mkdir(out,{recursive:true});
if(motion)await mkdir(motion,{recursive:true});
const {page,url,errors,foreign,close}=await openBrowser({root,width:1920,height:1080});
const step=async count=>{
  for(let n=count;n>0;n-=12)await page.evaluate(n=>hallReplay.step(n),Math.min(n,12));
};
const status=()=>page.evaluate(()=>gameStatus);
const observations={};
async function shot(name) {
  const state=await status();
  assert.equal(state.screen,'play',JSON.stringify({name,state}));
  observations[name]=await page.evaluate(()=>hallReplay.observe());
  await page.screenshot({path:join(out,name+'.png')});
}
async function aim(x,y,z,ads=false) {
  const s=await status(),[px,py,pz]=s.position;
  const yaw=Math.atan2(px-x,pz-z),pitch=Math.atan2(y-py,Math.hypot(x-px,z-pz));
  const angle=s.aim[0]-yaw,scale=ads?.00155:.00248;
  const dx=Math.round(Math.atan2(Math.sin(angle),Math.cos(angle))/scale),dy=Math.round((s.aim[1]-pitch)/scale);
  await page.evaluate(([movementX,movementY])=>document.querySelector('canvas').dispatchEvent(
    new MouseEvent('mousemove',{movementX,movementY,buttons:2,bubbles:true})
  ),[dx,dy]);
  await step(2);
}
async function hold(code,n) {
  await page.keyboard.down(code);
  try {await step(n);} finally { await page.keyboard.up(code); }
}
async function go(x,z,tolerance=.16) {
  for(let i=0;i<4;i++){
    const {position:[px,py,pz]}=await status();
    const distance=Math.hypot(px-x,pz-z);
    if(distance<tolerance)return;
    await aim(x,py,z);
    await hold('KeyW',Math.max(1,Math.round(distance*60/3.86)));
    await step(11);
  }
  const {position}=await status();
  assert.ok(Math.hypot(position[0]-x,position[2]-z)<tolerance,JSON.stringify({x,z,position}));
}
async function target(index,ads=true) {
  const d=(await status()).drones[index],r=index===2?1.16:1;
  const [x,y,z]=d.position;
  await aim(x+Math.sin(d.yaw)*.37*r,y+.03,z+Math.cos(d.yaw)*.37*r,ads);
}
async function fight(index,captureName) {
  await page.mouse.down({button:'right'});
  try {
    await step(9);
    if(captureName) {
      await target(index);
      await shot(captureName);
    }
    for(let i=0;i<22&&(await status()).drones[index].health;i++) {
      await target(index);
      await page.mouse.down({button:'left'});
      try {
        await step(2);
        if(captureName&&i===0)await shot('combat-impact');
      } finally {await page.mouse.up({button:'left'});}
      await step(10);
    }
  } finally {await page.mouse.up({button:'right'});}
  assert.equal((await status()).drones[index].health,0);
}
try {
  // Drive the normal frame loop at a fixed cadence. Neither simulation state nor camera is written by the harness.
  await page.route('**/src/main.mjs',async route=>{
    const response=await route.fetch();
    const source=await response.text();
    const at=source.lastIndexOf('  requestAnimationFrame(frame);');
    assert.ok(at>0);
    const body=source.slice(0,at).replace('    requestAnimationFrame(frame);','')+`
      window.hallReplay={
        step(n) {while(n-- > 0)frame((then??0)+1000/60);},
        observe() {
          return {
            position:camera.position.toArray(),rotation:camera.quaternion.toArray(),fov:camera.fov,
            controller:[run.player.x,run.player.y,run.player.z,run.player.yaw,run.player.pitch],
            time:run.time,moving:run.player.moving,objective:objectiveFor(run),health:run.player.armor,ammo:run.ammo
          };
        }
      };
    `+source.slice(at+'  requestAnimationFrame(frame);'.length);
    await route.fulfill({response,body});
  });
  await page.goto(url);
  await page.waitForFunction(()=>window.hallReplay&&!document.querySelector('#start').disabled,undefined,{timeout:45000});
  await page.getByRole('button',{name:'进入闸站'}).click();
  await page.waitForFunction(()=>gameStatus.pointerLocked);
  await page.keyboard.press('Space');
  await step(2);
  await go(-2.46,14.78);
  await aim(entry.x,entry.y,entry.z);
  await hold('KeyE',63);
  await step(12);
  assert.ok((await status()).entry);
  await go(-1.26,14.85);
  await go(-1.24,9.30);
  await aim(.25,1.78,-12.7);
  await page.keyboard.down('KeyW');
  try {
    const keyframes=new Map([[25,'walk-01-portal'],[53,'walk-02-threshold'],[82,'walk-03-hall']]);
    const motionFrames=motion?Array.from({length:20},(_,i)=>4*(i+1)):[];
    const frames=[...keyframes.keys(),...motionFrames].sort((a,b)=>a-b);
    let previous=0;
    for(const tick of frames) {
      await step(tick-previous);
      if(keyframes.has(tick))await shot(keyframes.get(tick));
      else await page.screenshot({path:join(motion,String(tick).padStart(3,'0')+'.png')});
      previous=tick;
    }
  } finally { await page.keyboard.up('KeyW'); }
  await step(10);
  await aim(.10,2.28,-12.8);
  await shot('hall');
  await fight(0,'combat');
  await go(2.64,4.79);
  await aim(4.43,1.58,3.55);
  await shot('turbine');
  await go(-3.76,2.28);
  await aim(-2.41,.05,.73);
  await shot('floor');
  await go(-6.14,2.41);
  await aim(-7.60,1.85,1.52);
  await shot('wall');
  await go(-2.31,-2.15);
  await fight(1);
  await go(.29,-3.99);
  await aim(1.55,1.31,-5.42);
  await shot('switchgear');
  assert.deepEqual(errors,[]);
  assert.deepEqual(foreign,[]);
  const renderer=await gpuName(page);
  assert.match(renderer,/NVIDIA|AMD|Intel/i);
  await writeFile(join(out,'observations.json'),JSON.stringify({renderer,viewport:[1920,1080],shots:observations},null,2));
  console.log(JSON.stringify({renderer,shots:Object.keys(observations)}));
} catch(error) {
  console.error(await status().catch(()=>null),errors,foreign);
  throw error;
} finally {await close();}
