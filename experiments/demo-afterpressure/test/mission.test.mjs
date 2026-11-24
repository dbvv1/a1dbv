import test from 'node:test';
import assert from 'node:assert/strict';
import { advance, createRun, droneOptic, hydraulicState, interactionFor, objectiveFor, reloadDuration, sequenceDurations, tick, traceSurface } from '../src/sim.mjs';
import { equipment, gatePanel, portal, relay, cache, entry, overlook, threshold, bulkhead, walkout } from '../src/layout.mjs';

const command={moveX:0,moveZ:0,yaw:0,pitch:0};
function moment(run,override={},seconds=tick) {
  for(let i=0;i<Math.max(1,Math.floor(seconds/tick));i++) advance(run,{...command,...override});
}
function look(run,x,y,z,input) {
  const p=run.player;
  const yaw=Math.atan2(p.x-x,p.z-z)-p.yaw;
  moment(run,{yaw:Math.atan2(Math.sin(yaw),Math.cos(yaw)),pitch:Math.atan2(y-p.y,Math.hypot(x-p.x,z-p.z))-p.pitch,...input});
}
function walk(run,x,z) {
  const p=run.player;
  const distance=Math.hypot(x-p.x,z-p.z);
  look(run,x,p.y,z);
  moment(run,{moveZ:1},distance/3.86);
}
function fight(run,index) {
  const d=run.drones[index];
  for(let i=0;i<12&&d.health;i++) {
    const target=droneOptic(d);
    look(run,target.x,target.y,target.z,{ads:true,fire:true});
    moment(run,{ads:true},.185);
  }
  assert.equal(d.health,0,'surveyor '+index+' was not stopped');
}

test('entry, staged encounters, reload, bypass hold, and sluice opening complete the mission', () => {
  const run=createRun();
  assert.equal(run.sequence,'arrival');
  assert.equal(objectiveFor(run),'entry');
  assert.equal(run.drones[1].state,'docked');
  moment(run,{moveZ:1,fire:true},1);
  assert.equal(run.shots,0);
  assert.ok(run.player.z>22);
  moment(run,{skip:true,fire:true});
  assert.equal(run.sequence,null);
  assert.equal(run.shots,0);
  walk(run,-2.49,14.80);
  look(run,entry.x,entry.y,entry.z);
  moment(run,{use:true},.88);
  assert.equal(objectiveFor(run),'approach');
  moment(run,{},1.8);
  walk(run,-1.29,14.68);
  walk(run,-1.24,5.43);
  assert.equal(objectiveFor(run),'engage');
  fight(run,0);
  assert.ok(run.checkpointReady);
  assert.equal(run.drones[1].state,'alert');
  walk(run,-2.32,-2.25);
  fight(run,1);
  assert.notEqual(run.drones[2].state,'docked');
  walk(run,-1.18,-13.4);
  fight(run,2);
  assert.equal(objectiveFor(run),'relay');
  assert.ok(run.optics>=2 && run.ammo<12);
  const spent=12-run.ammo;
  moment(run,{reload:true});
  const cues=[];
  for(let i=0;i<=Math.ceil(reloadDuration/tick);i++){
    moment(run);
    cues.push(...run.events.map(e=>e.kind).filter(kind=>['cell-out','cell-in','latch','loaded'].includes(kind)));
  }
  assert.deepEqual(cues,['cell-out','cell-in','latch','loaded']);
  assert.equal(run.reserve,48-spent);
  walk(run,-4.62,-15.9);
  look(run,relay.x,relay.y,relay.z);
  assert.equal(interactionFor(run)?.id,'relay');
  moment(run,{use:true},.57);
  assert.equal(run.relayOn,false);
  moment(run);
  assert.equal(run.actionTime,0);
  moment(run,{use:true},1.35);
  assert.equal(objectiveFor(run),'control');
  moment(run,{},2.8);
  walk(run,-1.22,-20.38);
  walk(run,-1.22,-22.27);
  assert.equal(objectiveFor(run),'gate');
  walk(run,1.79,-22.27);
  look(run,gatePanel.x,gatePanel.y,gatePanel.z);
  assert.equal(interactionFor(run)?.id,'gate');
  moment(run,{use:true},.91);
  assert.equal(run.sequence,'opening');
  const before={x:run.player.x,z:run.player.z,shots:run.shots};
  for(let i=0;i<Math.ceil(sequenceDurations.opening/tick)&&run.sequence;i++) moment(run,{moveZ:1,fire:true,skip:true});
  assert.equal(run.outcome,'active');
  assert.equal(objectiveFor(run),'overlook');
  assert.equal(run.player.x,before.x);
  assert.equal(run.player.z,before.z);
  assert.equal(run.shots,before.shots);
  walk(run,6.16,-22.28);
  walk(run,6.16,-33.03);
  look(run,overlook.x,overlook.y,overlook.z);
  moment(run,{use:true},.65);
  assert.equal(run.sequence,'confirmation');
  moment(run,{},sequenceDurations.confirmation+.02);
  assert.equal(run.outcome,'won');
});

test('portal and switchgear occlude movement and pulses and crouch lowers the eye', () => {
  const run=createRun(true), p=run.player;
  p.x=portal.x1+1;
  p.yaw=0;
  moment(run,{moveZ:1},2.5);
  assert.ok(p.z>=portal.z1+.26);
  const wall=traceSurface(p,{x:0,y:0,z:-1});
  assert.equal(wall.material,'concrete');
  assert.equal(wall.normal.z,1);
  assert.ok(wall.depth<.5);
  moment(run,{crouch:true},.42);
  assert.ok(p.y>1.16&&p.y<1.22);
  const gear=traceSurface({x:1.45,y:1.5,z:-4.83},{x:0,y:0,z:-1});
  assert.equal(gear.material,'metal');
  assert.ok(Math.abs(gear.depth-(-4.83-equipment.z1))<1e-7);
});

test('the bypass primes before opening and the water front keeps travelling after the surge', () => {
  const run=createRun();
  assert.deepEqual(hydraulicState(run),{lift:0,pressure:0,surge:0,discharge:0,travel:0});
  run.action='relay';
  run.actionTime=relay.hold*.5;
  assert.equal(hydraulicState(run).pressure,.5);
  Object.assign(run,{action:null,relayOn:true,relayAt:10,gateAt:15,time:16.70});
  const surge=hydraulicState(run);
  assert.ok(surge.lift>0&&surge.discharge>0&&surge.lift<1);
  assert.ok(surge.surge>.97&&surge.travel>5);
  run.time+=sequenceDurations.opening;
  const settled=hydraulicState(run);
  assert.equal(settled.lift,1);
  assert.equal(settled.discharge,1);
  assert.equal(settled.surge,0);
  assert.ok(settled.pressure<surge.pressure&&settled.travel>surge.travel);
});

test('a traveling bolt reaches a stationary player and is intercepted by solid equipment', () => {
  const run=createRun(true),p=run.player;
  const bolt=(x,z)=>({x,y:1.41,z,dx:0,dy:0,dz:1,speed:20,age:0,source:1,power:21});
  p.x=1.48;p.z=-4.40;
  run.bolts.push(bolt(p.x,-7.46));
  moment(run,{},.29);
  assert.equal(run.bolts.length,0);
  assert.equal(p.armor,100);
  p.x=-1.48;
  run.bolts.push(bolt(p.x,-7.46));
  moment(run,{},.065);
  assert.equal(p.armor,100);
  assert.ok(run.bolts.length>0);
  moment(run,{},.13);
  assert.equal(p.armor,79);
});

test('a pulse passing the shoulder reports one near miss without taking armor', () => {
  const run=createRun(true),p=run.player;
  Object.assign(p,{x:-1.27,z:5.61});
  run.bolts.push({x:p.x+.76,y:p.y-.18,z:p.z-.07,dx:0,dy:0,dz:1,speed:24,age:0,source:0,power:17});
  moment(run);
  assert.equal(run.events.filter(event=>event.kind==='near-miss').length,1);
  assert.equal(p.armor,100);
  moment(run);
  assert.equal(run.events.some(event=>event.kind==='near-miss'),false);
});

test('the warden deflects a front pulse and an exposed optic interrupts charging', () => {
  const run=createRun(true),p=run.player,d=run.drones[2];
  Object.assign(p,{x:-1.38,z:-14.14});
  Object.assign(d,{x:-1.38,y:1.65,z:-19.8,yaw:0,state:'track',nextAt:99});
  look(run,d.x,d.y,d.z,{ads:true,fire:true});
  assert.equal(run.events.find(e=>e.kind==='hit')?.part,'armor');
  assert.ok(d.health>6&&d.health<7);
  moment(run,{},.19);
  Object.assign(d,{x:-1.38,y:1.65,z:-19.8,yaw:0,state:'charge',startedAt:run.time-.33,charge:.35,target:{x:p.x,y:p.y-.15,z:p.z}});
  const optic=droneOptic(d);
  look(run,optic.x,optic.y,optic.z,{ads:true,fire:true});
  assert.equal(run.events.find(e=>e.kind==='hit')?.part,'optic');
  assert.equal(d.state,'recover');
  assert.equal(d.target,null);
});

test('locked controls, one-use supply, and checkpoint restart have clean state', () => {
  const run=createRun(true),p=run.player;
  Object.assign(p,{x:gatePanel.x,z:gatePanel.z+1.36,yaw:0});
  assert.equal(interactionFor(run)?.reason,'combat');
  moment(run,{use:true},1.8);
  assert.equal(run.gateAt,0);
  Object.assign(p,{x:cache.x,z:cache.z+1.38,yaw:0,armor:59});
  run.reserve=25;
  moment(run,{use:true},.35);
  assert.ok(run.cacheUsed);
  assert.equal(p.armor,99);
  assert.equal(run.reserve,49);
  assert.notEqual(interactionFor(run)?.id,'cache');
  const retry=createRun(true);
  assert.equal(retry.outcome,'active');
  assert.equal(retry.player.armor,100);
  assert.equal(retry.kills,1);
  assert.equal(retry.drones[0].state,'dead');
  assert.equal(retry.bolts.length,0);
  assert.equal(retry.relayOn,false);
});



test('route shutters share their lift geometry with movement and raycasts', () => {
  const run=createRun();
  moment(run,{skip:true});
  const p=run.player;
  for(const d of run.drones) d.health=0;
  for(const door of [threshold,bulkhead,walkout]) {
    const x=(door.x0+door.x1)/2;
    Object.assign(p,{x,z:door.z1+1.60,yaw:0});
    moment(run,{moveZ:1},.78);
    assert.ok(p.z>=door.z1+.26);
    assert.equal(traceSurface(p,{x:0,y:0,z:-1},.4,run).material,'metal');
    if(door===threshold) run.entryAt=run.time;
    if(door===bulkhead) {run.relayOn=true;run.relayAt=run.time;}
    if(door===walkout) run.gateAt=run.time;
    moment(run,{},6.5);
    assert.equal(traceSurface(p,{x:0,y:0,z:-1},.4,run).material,'air');
    moment(run,{moveZ:1},.73);
    assert.ok(p.z<door.z0,JSON.stringify({door,p,outcome:run.outcome}));
  }
});
