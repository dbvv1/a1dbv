import assert from 'node:assert/strict';
import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { openBrowser } from './local-browser.mjs';

const [folder,root,reference]=process.argv.slice(2);
assert.ok(folder,'Usage: node tools/compare-shots.mjs output [project root] [camera-pose JSON]');
const locked=reference?JSON.parse(await readFile(reference)):{};
await mkdir(folder,{recursive:true});
const {page,url,errors,foreign,close}=await openBrowser({root});
try {
  // Install the frozen-frame hook only in the capture browser, including for the old build.
  await page.route('**/src/main.mjs',async route=>{
    const response=await route.fetch();
    const source=(await response.text())
      .replace('  function frame(now) {','  let frozen=false, frozenPose;\n  function frame(now) {\n    if(frozen&&now!==then)return;')
      .replace('    cameraPose(motionDt);','    cameraPose(motionDt);\n    if(frozenPose) { camera.position.fromArray(frozenPose.eye); camera.quaternion.fromArray(frozenPose.rotation); camera.fov=frozenPose.fov;camera.updateProjectionMatrix(); }');
    const start=source.lastIndexOf('  requestAnimationFrame(frame);');
    assert.ok(start>0);
    const hook=`
      window.freezeShot=({time,sequence,sequenceAt,eye,look,entryAt,relayAt,gateAt,pose})=>{
        frozen=true;frozenPose=pose;
        mode='play';
        run=createRun();
        run.time=worldTime=time;
        run.sequence=sequence??null;
        run.sequenceAt=sequenceAt??0;
        run.entered=eye&&eye[2]<7.5;
        run.relayAt=relayAt??null;run.relayOn=relayAt!=null;
        if(run.relayOn) {run.kills=3;run.controlEntered=true;for(const d of run.drones)d.health=0;}
        run.gateAt=gateAt??0;
        run.entryAt=entryAt??null;
        if(eye) {
          Object.assign(run.player,{x:eye[0],y:eye[1],z:eye[2]});
          run.player.yaw=Math.atan2(eye[0]-look[0],eye[2]-look[2]);
          run.player.pitch=Math.atan2(look[1]-eye[1],Math.hypot(eye[0]-look[0],eye[2]-look[2]));
        }
        photo=true;
        then=performance.now();
        show('play');
        frame(then);
        return {eye:camera.position.toArray(),rotation:camera.quaternion.toArray(),fov:camera.fov};
      };
    `;
    await route.fulfill({response,body:source.slice(0,start)+hook+source.slice(start)});
  });
  const shots={
    facade:{time:1.65,sequence:'arrival'},
    intake:{time:4.85,sequence:'arrival'},
    approach:{time:9.22,eye:[-3.08,1.66,18.45],look:[-1.74,2.32,13.56]},
    shutter:{time:12,entryAt:11.65,eye:[-.94,1.66,14.47],look:[-1.10,1.60,13.21]},
    isolation:{time:34,entryAt:10,relayAt:33.52,eye:[-2.35,1.66,-18.44],look:[-1.55,2.14,-21.30]},
    control:{time:39,entryAt:10,relayAt:33,eye:[1.47,1.66,-22.49],look:[3.39,1.82,-25.68]},
    instruments:{time:39,entryAt:10,relayAt:33,eye:[3.95,1.66,-22.74],look:[4.12,1.72,-24.23]},
    gate:{time:41.68,sequenceAt:40,sequence:'opening',entryAt:10,relayAt:33,gateAt:40},
    spillway:{time:45.38,sequenceAt:40,sequence:'opening',entryAt:10,relayAt:33,gateAt:40},
    inspection:{time:52.05,sequenceAt:50,sequence:'confirmation',entryAt:10,relayAt:33,gateAt:40},
    gorge:{time:53.98,sequenceAt:50,sequence:'confirmation',entryAt:10,relayAt:33,gateAt:40},
    canyon:{time:48,entryAt:10,relayAt:33,gateAt:40,eye:[6.39,1.66,-32.0],look:[4.11,1.09,-47.97]},
    hall:{time:15,entryAt:10,eye:[-1.19,1.66,5.65],look:[.2,1.65,-14.18]}
  };
  await page.goto(url);
  await page.waitForFunction(()=>window.freezeShot&&!document.querySelector('#start').disabled,undefined,{timeout:45000});
  const poses={};
  for(const [name,state] of Object.entries(shots)) {
    poses[name]=await page.evaluate(state=>freezeShot(state),{...state,pose:locked[name]});
    await page.screenshot({path:join(folder,name+'.png')});
  }
  await writeFile(join(folder,'poses.json'),JSON.stringify(poses,null,2));
  assert.deepEqual(errors,[]);
  assert.deepEqual(foreign,[]);
}finally {await close();}
