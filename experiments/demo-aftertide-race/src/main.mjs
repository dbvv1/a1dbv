import * as T from 'three';
import { Car, STEP, emptyInput } from './vehicle.mjs';
import { angle, clamp, smooth, frame, nearest, roadPoint, surface, length, course } from './track.mjs';
import { makeWorld } from './world.mjs';
import { createCar } from './car.mjs';
import { makeEffects } from './effects.mjs';
import { onTrack, lapInput, testCases } from './maneuvers.mjs';
import { LapTimer, formatTime } from './timer.mjs';
import { DriveAudio } from './audio.mjs';

const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const hook=params.has('qa');
const preset=params.get('shot');
const scene=new T.Scene(), camera=new T.PerspectiveCamera(57,1,.062,2400);
const controls=new Set();
const driveKeys=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space']);
const car=new Car(surface);
const audio=new DriveAudio();
const assistKey='aftertide.driving.assist';
let assist=localStorage.getItem(assistKey)!=='off';
const saved=Number(localStorage.getItem('aftertide.cove.best'));
const timer=new LapTimer(0,saved>0?saved:Infinity);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let phase='loading',muted=false,hidden=false,cameraMode=0;
let photoYaw=0,photoPitch=.29,photoDistance=6,drag=null;
let renderer,world,model,effects,previous=0,clock=0,carry=0,hudClock=0,qaPilot=false,qaPhaseTime=0;
let seenSlide=0;
let keyboardLab=null,labPad=null;
const camPos=new T.Vector3(), camTarget=new T.Vector3(), camForward=new T.Vector3(), look=new T.Vector3();
const cameraCue={launch:0,brake:0,shift:0,roll:0};
let snap=true,drivePhase='ready';

function phaseTo(value) {
  phase=value;document.body.dataset.phase=value;
  $('result').hidden=value!=='done';$('photo-guide').hidden=value!=='photo';
}
function reset(go=false) {
  controls.clear();qaPilot=false;qaPhaseTime=0;seenSlide=0;
  keyboardLab=null;car.ground=surface;
  if(labPad)labPad.visible=false;
  onTrack(car,course.start-11,0,-.64);
  timer.reset(nearest(car.x,car.z).s);
  effects.clear();snap=true;carry=0;
  for(const k of Object.keys(cameraCue))cameraCue[k]=0;
  phaseTo(go?'drive':'ready');
  $('clock').textContent=formatTime(0);
}
function start() {
  if(phase!=='ready')return;
  audio.start();
  if(keyboardLab)audio.enableMeter?.();
  phaseTo('drive');
}
function setPhoto() {
  if(phase==='photo') {phaseTo(drivePhase);snap=true;drag=null;return;}
  if(!['ready','drive','done'].includes(phase))return;
  drivePhase=phase;controls.clear();
  phaseTo('photo');
  photoYaw=Math.PI-.18;photoPitch=.23;photoDistance=6.2;
}
function toggleHud(){hidden=!hidden;$('hud').classList.toggle('hidden',hidden);}
function toggleSound(){
  muted=!muted;audio.setMuted(muted);$('btn-audio').setAttribute('aria-pressed',String(muted));
  $('btn-audio').innerHTML=muted?'<kbd>M</kbd> 静音':'<kbd>M</kbd> 声音';
}
function input() {
  const any=(...keys)=>keys.some(k=>controls.has(k));
  // The car's local +X is screen-left when the chase camera looks along +Z.
  return {gas:+any('KeyW','ArrowUp'),brake:+any('KeyS','ArrowDown'),
    steer:+any('KeyA','ArrowLeft')- +any('KeyD','ArrowRight'),hand:+any('Space'),keyboard:true,assist};
}
function keyboard() {
  addEventListener('keydown',e=>{
    if(e.ctrlKey||e.altKey||e.metaKey)return;
    if(driveKeys.has(e.code)){
      if(e.target.tagName==='BUTTON' && e.code==='Space')return;
      e.preventDefault();
      if(!e.repeat&&phase==='ready'&&['KeyW','ArrowUp'].includes(e.code))start();
      if(!e.repeat&&(phase==='ready'||phase==='drive'))controls.add(e.code);
      if(!e.repeat&&keyboardLab)labKey(e,'down');
      return;
    }
    if(e.repeat)return;
    if(e.code==='KeyR'&&model){reset();$('drive').querySelector('canvas').focus();}
    if(e.code==='KeyV'){cameraMode=(cameraMode+1)%2;}
    if(e.code==='KeyM')toggleSound();
    if(e.code==='KeyP')setPhoto();
    if(e.code==='KeyH')toggleHud();
    if(e.code==='KeyT'){$('telemetry').hidden=!$('telemetry').hidden;ui();}
    if(e.key==='?')$('help').hidden=!$('help').hidden;
    if(e.code==='Escape') {
      if(!$('help').hidden)$('help').hidden=true;
      else if(hidden)toggleHud();
      else if(phase==='photo')setPhoto();
    }
  });
  addEventListener('keyup',e=>{
    controls.delete(e.code);
    if(driveKeys.has(e.code)&&keyboardLab)labKey(e,'up');
  });
  addEventListener('blur',()=>controls.clear());
  $('start').onclick=()=>{start();renderer.domElement.focus();};
  $('restart').onclick=$('btn-restart').onclick=()=>{reset();renderer.domElement.focus();};
  $('btn-camera').onclick=()=>{cameraMode=(cameraMode+1)%2;renderer.domElement.focus();};
  $('btn-photo').onclick=()=>{setPhoto();renderer.domElement.focus();};
  $('btn-audio').onclick=()=>{toggleSound();renderer.domElement.focus();};
  $('btn-help').onclick=()=>{$('help').hidden=!$('help').hidden;};
  $('close-help').onclick=()=>{$('help').hidden=true;renderer.domElement.focus();};
  $('driving-assist').checked=assist;
  $('driving-assist').onchange=event=>{
    assist=event.target.checked;
    localStorage.setItem(assistKey,assist?'on':'off');
  };
  const canvas=renderer.domElement;
  canvas.tabIndex=0;
  canvas.addEventListener('pointerdown',e=>{
    if(phase!=='photo')return;
    drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove',e=>{
    if(!drag)return;
    photoYaw-=(e.clientX-drag.x)*.007;photoPitch=clamp(photoPitch+(e.clientY-drag.y)*.006,-.05,1.41);
    drag={x:e.clientX,y:e.clientY};
  });
  for(const key of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(key,()=>{drag=null;});
  canvas.addEventListener('wheel',e=>{
    if(phase!=='photo')return;
    e.preventDefault();photoDistance=clamp(photoDistance*Math.exp(e.deltaY*.001),1.43,23);
  },{passive:false});
}
const mapM=new T.Vector2();
let mapInfo;
function mapPoint(x,z) {
  const {minX,minZ,scale,x0}=mapInfo;
  return mapM.set(x0+(x-minX)*scale,11+(z-minZ)*scale);
}
function makeMap() {
  const points=Array.from({length:270},(_,i)=>frame(i*length/270));
  const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x));
  const minZ=Math.min(...points.map(p=>p.z)),maxZ=Math.max(...points.map(p=>p.z));
  const scale=120/(maxZ-minZ);
  mapInfo={minX,minZ,scale,x0:68-(maxX-minX)*scale*.5};
  const p=points.map((f,i)=>{
    const v=mapPoint(f.x,f.z);
    return (i?'L':'M')+v.x.toFixed(2)+' '+v.y.toFixed(2);
  }).join(' ')+'Z';
  $('map-course').setAttribute('d',p);$('map-shadow').setAttribute('d',p);
  const s=frame(course.start);
  const a=mapPoint(s.x-s.nx*11,s.z-s.nz*11).clone(), b=mapPoint(s.x+s.nx*11,s.z+s.nz*11);
  $('map-start').setAttribute('d',`M${a.x} ${a.y}L${b.x} ${b.y}`);
}
function ui() {
  const f=nearest(car.x,car.z);
  if(f){
    const map=mapPoint(car.x,car.z);
    $('map-car').setAttribute('cx',map.x.toFixed(1));$('map-car').setAttribute('cy',map.y.toFixed(1));
    $('section').textContent=f.s<94||f.s>940?'海岬公路':f.s<273?'下坡连弯':f.s<339?'海湾入口':f.s<450?'发卡弯':f.s<619?'回程爬坡':'山脊回程';
  }
  $('clock').textContent=formatTime(timer.elapsed);
  $('clock-label').textContent=timer.complete?'单圈完成':timer.running?'计时中':'单圈计时';
  $('best').textContent=formatTime(timer.best);
  const count=timer.complete?4:timer.checkpoint;
  document.querySelectorAll('.sectors i').forEach((x,i)=>x.classList.toggle('done',i<count));
  $('speed').textContent=String(Math.round(car.speed*3.6)).padStart(3,'0');
  $('gear').textContent=car.u<-.4?'R':car.gear;
  $('rpm-bar').style.transform=`scaleX(${clamp(car.rpm/7760,0,1)})`;
  $('gas').style.transform=`scaleX(${Math.abs(car.throttle)})`;
  $('brake').style.transform=`scaleX(${Math.max(car.brake,car.hand)})`;
  if(!$('telemetry').hidden){
    const t=car.telemetry(), one=x=>x.toFixed(1).padStart(6);
    $('telemetry').textContent=`${one(t.speed)} km/h    ${one(t.latG*100)} cG lat\n${one(t.yawRate)} °/s yaw   ${one(t.beta)} ° body slip\n\n       slip °       load N\n`+
      t.wheels.map(w=>`${w.id} ${one(w.slip)}        ${one(w.load)}`).join('\n');
  }
}
function finish() {
  if(timer.record)localStorage.setItem('aftertide.cove.best',String(timer.best));
  $('record').textContent=timer.record?'新的最佳纪录':'单圈完成';
  $('finish-time').textContent=formatTime(timer.elapsed);
  phaseTo('done');
}
function local(x,y,z) {
  const c=Math.cos(car.yaw),s=Math.sin(car.yaw);
  return new T.Vector3(car.x+x*c+z*s,car.height+y,car.z-x*s+z*c);
}
function presetCamera(which) {
  switch(which){
    case 'front':
      camera.fov=32;
      camera.position.copy(local(-3.89,1.63,5.24));look.copy(local(0,.56,.24));break;
    case 'wheel':
      camera.fov=40;
      camera.position.copy(local(2.32,.52,1.79));look.copy(local(.89,.403,1.27));break;
    case 'road':
      camera.fov=53;
      camera.position.copy(roadPoint(113,3.8,.55));look.copy(roadPoint(132,4.95,.31));break;
    case 'coast':
      camera.fov=53;
      camera.position.set(-148,81,-304);look.set(-9,17,-133);break;
    case 'drift':
      camera.fov=38;
      camera.position.copy(local(-6.35,2.37,6.86));look.copy(local(.18,.58,-1.33));break;
    default:return false;
  }
  camera.lookAt(look);camera.updateProjectionMatrix();return true;
}
function chase(dt) {
  const speed=car.speed;
  if(preset && presetCamera(preset))return;
  if(phase==='photo'){
    camera.fov=44;const a=photoYaw+car.yaw;
    const bodyRadius=1/Math.hypot(Math.sin(photoYaw)/1.27,Math.cos(photoYaw)/2.57);
    const distance=Math.max(photoDistance,bodyRadius/Math.cos(photoPitch));
    camera.position.set(car.x+Math.sin(a)*Math.cos(photoPitch)*distance,
      car.height+.55+Math.sin(photoPitch)*distance,car.z+Math.cos(a)*Math.cos(photoPitch)*distance);
    camera.lookAt(car.x,car.height+.65,car.z);camera.updateProjectionMatrix();return;
  }
  const normal=new T.Vector3(Math.sin(car.yaw),0,Math.cos(car.yaw));
  const side=new T.Vector3(normal.z,0,-normal.x);
  const vel=car.worldV;
  const desired=normal.clone();
  const followSlip=(.18+.31*smooth(.065,.30,Math.abs(car.beta)))*smooth(4,15,speed);
  if(speed>4)desired.lerp(new T.Vector3(vel.x,0,vel.z).normalize(),followSlip).normalize();
  if(snap)camForward.copy(desired);
  else camForward.lerp(desired,1-Math.exp(-dt*(cameraMode===0?5.5:7))).normalize();
  const d=cameraMode===0?7.2:5.95;
  const height=cameraMode===0?2.45:1.75;
  const isReady=phase==='ready'&&!preset&&!keyboardLab;
  const cueScale=reduced?.32:1;
  const load=car.transferY/9.80665;
  const damp=1-Math.exp(-dt*13);
  const cueTargets={
    launch:cueScale*.54*clamp(load,0,1),
    brake:cueScale*.59*clamp(-load,0,1)*smooth(2,8,speed),
    shift:cueScale*.27*car.shiftCue,
    roll:cueScale*clamp(car.roll*.36+car.yawRate*.011,-.023,.023)
  };
  for(const k of Object.keys(cameraCue))cameraCue[k]+=(cueTargets[k]-cameraCue[k])*damp;
  const travel=cameraCue.launch-cameraCue.brake-cameraCue.shift;
  const pos=local(0,height+smooth(0,44,speed)*.26+travel*.21,0)
    .addScaledVector(camForward,-d-.92*smooth(0,44,speed)-travel);
  if(isReady)pos.addScaledVector(side,1.28);
  if(!reduced) {
    pos.x+=Math.sin(clock*64)*car.impact*.085;
    pos.y+=Math.sin(clock*77)*car.impact*.083+Math.sin(clock*54)*speed*.00024;
  }
  const floor=nearest(pos.x,pos.z);
  if(floor)pos.y=Math.max(pos.y,floor.height+.73);
  let target=local(0,.82,0).addScaledVector(camForward,5.4+speed*.085);
  target.y-=car.pitch*(4.3+speed*.12);
  target.y+=cameraCue.launch*.38-cameraCue.brake*.47-cameraCue.shift*.47;
  if(isReady)target.addScaledVector(side,-.38);
  if(snap){camPos.copy(pos);camTarget.copy(target);snap=false;}
  else {
    camPos.lerp(pos,1-Math.exp(-dt*8.2));camTarget.lerp(target,1-Math.exp(-dt*7.0));
  }
  camera.position.copy(camPos);
  camera.lookAt(camTarget);
  camera.rotateZ(cameraCue.roll);
  camera.fov+=(57+(cameraMode?3:0)+smooth(3,47,speed)*(reduced?4:12)-camera.fov)*(1-Math.exp(-dt*4.4));
  camera.updateProjectionMatrix();
}
function loop(at) {
  if(previous===0)previous=at;
  const dt=Math.min(.066,(at-previous)/1000);previous=at;
  clock+=dt;hudClock+=dt;
  if(phase==='drive'||phase==='done') {
    carry+=dt;
    while(carry>=STEP) {
      const command=phase==='done'?{...emptyInput(),brake:car.speed>1?.37:0}:qaPilot?lapInput(car):input();
      car.step(command);
      if(phase==='drive'&&!keyboardLab){
        timer.update(nearest(car.x,car.z).s,STEP);
        if(timer.complete)finish();
      }
      qaPhaseTime+=STEP;seenSlide=Math.max(seenSlide,Math.abs(car.beta));
      carry-=STEP;
    }
    effects.update(car,dt,renderer.domElement.height);
  }
  if(hudClock>.048){ui();hudClock=0;}
  audio.update(car,phase==='drive'||phase==='done');
  model.update(car);
  world.update(clock,new T.Vector3(car.x,car.height,car.z));
  chase(dt);
  renderer.render(scene,camera);
  if(keyboardLab&&phase==='drive')labSample();
  requestAnimationFrame(loop);
}
const degrees=180/Math.PI;
function labKey(event,type) {
  keyboardLab.keys.push({code:event.code,type,trusted:event.isTrusted,time:car.time,wall:performance.now()});
}
function prepareKeyboardLab({kind='pad',kmh=0,s=361,d=0}={}) {
  reset();
  const onRoad=kind==='hairpin';
  if(onRoad)onTrack(car,s,kmh/3.6,d);
  else {
    car.ground={sample:()=>({height:2,grade:0,grip:1})};
    car.reset(-400,0,0,kmh/3.6);
    for(const w of car.wheels)w.height=2;
    if(!labPad){
      labPad=new T.Mesh(new T.PlaneGeometry(315,650),new T.MeshStandardMaterial({color:0x41444a,roughness:1}));
      labPad.rotation.x=-Math.PI/2;
      labPad.position.set(-400,2,140);
      labPad.receiveShadow=true;
      scene.add(labPad);
    }
    labPad.visible=true;
  }
  keyboardLab={kind,rows:[],keys:[],x:car.x,z:car.z,yaw:car.yaw};
}
function labSample() {
  const {yaw,x,z,kind,rows}=keyboardLab;
  const t=car.telemetry();
  const front=local(0,.59,1.60).project(camera), rear=local(0,.59,-1.60).project(camera);
  const velocity=car.worldV;
  const route=kind==='hairpin'?nearest(car.x,car.z):null;
  const feedback=audio.measure?.()??{};
  rows.push({...t,input:input(),rightM:-(t.x-x)*Math.cos(yaw)+(t.z-z)*Math.sin(yaw),
    rightHeading:-angle(car.yaw-yaw)*degrees,screenNose:(front.x-rear.x)*innerWidth/2,
    velocityYaw:-angle(Math.atan2(velocity.x,velocity.z)-yaw)*degrees,
    cameraYawLag:-angle(car.yaw-Math.atan2(camForward.x,camForward.z))*degrees,
    routeS:route?.s??0,offset:route?.d??0,gear:car.gear,rpm:car.rpm,shift:car.shift,
    roll:car.roll*degrees,bodyPitch:car.pitch*degrees,fov:camera.fov,wall:performance.now(),
    cameraLaunch:cameraCue.launch,cameraBrake:cameraCue.brake,cameraShift:cameraCue.shift,...feedback});
}
function resize() {
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.setSize(innerWidth,innerHeight,false);
}
function setupShot() {
  if(!preset)return;
  $('hud').classList.toggle('hidden',preset!=='chase');
  if(preset==='chase'){
    for(let i=0;i<1300;i++) {
      car.step(lapInput(car));
      const f=nearest(car.x,car.z);
      timer.update(f.s,STEP);
      if(i%4===0)chase(4*STEP);
      if(f.s>119&&f.s<121)break;
    }
    phaseTo('ready');document.body.dataset.phase='showcase';
  } else {
    phaseTo('photo');
    onTrack(car,preset==='coast'?390:preset==='road'?275:104,0,preset==='front'?.2:-1.78);
  }
  if(preset==='drift'){
    const test=testCases.find(t=>t.id==='drift-recovery');
    const target=Number(params.get('t')||3.525);
    test.setup(car);
    for(let i=0;i<target/STEP;i++){
      car.step(test.input(car,i*STEP));
      effects.update(car,STEP,renderer.domElement.height);
    }
  }
  ui();
}
async function boot() {
  renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  $('drive').append(renderer.domElement);resize();
  world=await makeWorld(scene,renderer);
  model=createCar(scene,world.carEnvironment);effects=makeEffects(scene);
  makeMap();keyboard();reset();setupShot();
  addEventListener('resize',resize);
  window.__aftertide={
    ready:true, shot:preset, state:()=>({phase,assist,paused:phase==='photo',time:timer.elapsed,best:timer.best,
      record:timer.record,checkpoint:timer.checkpoint,running:timer.running,route:nearest(car.x,car.z),
      motion:car.telemetry(),maxBeta:seenSlide*180/Math.PI,qaPhaseTime,sky:world.skySource}),
    ...(hook?{prepareKeyboardLab,keyboardLog:()=>keyboardLab,pilot(){start();qaPilot=true;},step(count){
      if(phase==='ready')start();
      for(let i=0;i<count && phase==='drive';i++){
        car.step(lapInput(car));timer.update(nearest(car.x,car.z).s,STEP);
        if(timer.complete)finish();
      }
      ui();return this.state();
    }}:{})
  };
  requestAnimationFrame(loop);
}
boot().catch(err=>{
  console.error(err);phaseTo('error');
  $('load-message').textContent='场景加载失败。请用 PLAY.cmd 打开，并检查浏览器的 WebGL 2 硬件加速。';
});
