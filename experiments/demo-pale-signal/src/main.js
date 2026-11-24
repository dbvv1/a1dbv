import * as T from 'three';
import { createVisual, lit, loadStone } from './visual.js';
import { loadRanges } from './alpine.js';
import { loadCinematicAssets } from './cinematic-assets.js';
import { createWorld } from './world.js';
import { controlContact, createCableRider, createEffects, createEnemyModels, createWeapon } from './actors.js';
import { createCombat, floorAt, moveOnFloor, rayWorld } from './combat.js';
import { createAudio, loadFootsteps } from './audio.js';
import { playerBody } from './first-person.js';

const $=selector=>document.querySelector(selector);
const {clamp,damp,lerp,smoothstep}=T.MathUtils;
const V=(x,y,z)=>new T.Vector3(x,y,z);
const MAG=24, MAX_RESERVE=216, RELOAD=1.56, LOOK_SCALE=.00215;
const modeElements={title:'#start',pause:'#resume',won:'#retry',dead:'#retry'};
const phaseCards=[
  ['01 / 接近','进入 07 号中继站','沿橙色灯标前往入口'],
  ['02 / 恢复','恢复中继站供电','到值班机房启动旁路终端'],
  ['03 / 上传','发送救援坐标','使用天线场的上传终端'],
  ['03 / 上传','守住天线场',''],
  ['04 / 撤离','搭乘缆车撤离','穿过北侧闸门，前往返回平台'],
];
const words={
  start:['山下调度','这里是山下调度。沿着橙色灯标走，你的任务是带回救援坐标。'],
  threat:['山下调度','站里的巡检机还在运行。它们的核心亮起来时，就要放电了。'],
  hall:['山下调度','到机房了。找标着 BYPASS 的终端，北侧闸门接的是备用电路。'],
  relay:['值班录音','07 号站，最后一次值班记录。队伍到了冰川北缘，我把坐标存进了备用机。'],
  power:['山下调度','闸门开了。到天线下面，把那份坐标发给我。'],
  yard:['山下调度','上传会叫醒天线场的巡检机。利用货箱掩护，别一直站在终端旁边。'],
  defence:['山下调度','我收到开头了。保持天线在线，别让它们拖住你。'],
  second:['山下调度','两侧又有巡检机。注意地面，来的是双发型。'],
  third:['山下调度','只差最后一段。屋檐侧也有动静。'],
  extract:['山下调度','全收到了。搜救已经改航向。现在去缆车，我在山下等你。'],
  car:['山下调度','07 号站可以离线了。下山吧。'],
  checkpoint:['山下调度','备用电路已接通。从北门出去，坐标还在天线场的终端里。'],
};
let visual;
try{
  const [stone,art,ranges,footsteps] = await Promise.all([loadStone(),loadCinematicAssets(),loadRanges(),loadFootsteps()]);
  $('#boot-label').textContent='正在构建中继站';
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  visual=createVisual($('#viewport'),art);
  await startGame(visual,stone,art,ranges,footsteps);
}catch(error){
  console.error(error);
  document.body.dataset.mode='loading';
  $('#boot-label').textContent='无法启动雪线回波';
  $('#boot-progress').hidden=true;
  $('#boot-note').textContent='请使用支持 WebGL 2 的桌面浏览器，通过本地服务器打开游戏。'+(error.message?' '+error.message:'');
}

async function startGame({scene,camera,renderer,prepareScene,draw,terrainClock,terrainClear},stone,art,ranges,footsteps){
  scene.add(camera);
  const world=createWorld(scene,{...stone,terrainClock,terrainClear},art,ranges);
  const weapon=createWeapon(camera,art);
  const body=playerBody(scene,art,(x,z,y)=>floorAt(world,x,z,y+.15));
  body.root.visible=false;
  const rider=createCableRider(art);
  world.tram.add(rider.root);
  const models=createEnemyModels(art);
  const effects=createEffects(scene,models.debris);
  const audio=createAudio(footsteps);
  const buttons={
    start:$('#start'),retry:$('#retry'),resume:$('#resume'),
    title:$('#to-title'),pauseTitle:$('#pause-title'),settings:$('#settings'),
  };
  const ui={
    objective:$('#objective'),sub:$('#objective-sub'),act:$('#act'),marker:$('#marker'),distance:$('#distance'),
    reticle:$('#reticle'),hit:$('#hit'),incoming:$('#incoming'),interaction:$('#interaction'),radio:$('#radio'),hint:$('#hint'),
    health:$('#health'),vitals:$('#vitals'),loaded:$('#loaded'),reserve:$('#reserve'),ammo:$('#ammo'),ammoNote:$('#ammo-note'),
    toast:$('#stage-toast'),transmit:$('#transmit'),tape:$('#compass-tape'),bearing:$('#bearing'),edge:$('#edge'),
    blackout:$('#blackout'),letterbox:$('#letterbox'),
  };
  const settings={volume:75,sensitivity:100,voices:false,motion:matchMedia('(prefers-reduced-motion: reduce)').matches};
  try{
    const stored=JSON.parse(localStorage.getItem('pale-signal-settings'));
    if(stored){
      settings.volume=clamp(Number(stored.volume)||0,0,100);
      settings.sensitivity=clamp(Number(stored.sensitivity)||100,25,175);
      settings.motion=Boolean(stored.motion);
      settings.voices=Boolean(stored.voices);
    }
  }catch{}
  const synthesis='speechSynthesis' in window?window.speechSynthesis:null;
  const localVoices=()=>synthesis?.getVoices().filter(voice=>voice.localService&&voice.lang.toLowerCase().startsWith('zh'))||[];
  const radioLines={
    start:'这里是山下调度。沿橙色灯标前往七号站。',
    threat:'还有巡检机在线。注意亮起的核心。',
    hall:'找到旁路终端，恢复北门的电源。',
    relay:'七号站最后记录。坐标留在备用机里。队伍到了冰川北缘。',
    power:'北门开了。去天线下面，把坐标发给我。',
    yard:'上传会唤醒巡检机。用货箱找掩护。',
    defence:'收到开头了。保持天线在线。',
    second:'注意两侧。来的是双发型。',
    third:'只剩最后一段。',
    extract:'全收到了。去缆车。我在山下等你。',
    car:'七号站可以离线了。下山吧。',
    checkpoint:'从北门出去。坐标还在天线场。',
  };
  function speak(key){
    if(!settings.voices||!settings.volume)return;
    const list=localVoices(),voice=list.find(v=>key==='relay'?/Kangkang/i.test(v.name):/Huihui/i.test(v.name))||list[0];
    if(!voice)return;
    synthesis.cancel();
    const line=new SpeechSynthesisUtterance(radioLines[key]);
    line.voice=voice;line.lang=voice.lang;
    line.volume=settings.volume*.0073;line.rate=1.06;
    line.pitch=key==='relay'?.81:.91;
    synthesis.speak(line);
  }

  const form={
    volume:$('#volume'),sensitivity:$('#sensitivity'),motion:$('#motion'),voices:$('#voices'),
    volumeOutput:$('output[for=volume]'),mouseOutput:$('output[for=sensitivity]'),voicesOutput:$('output[for=voices]'),
  };
  function syncForm(){
    form.volume.value=settings.volume;form.sensitivity.value=settings.sensitivity;form.motion.checked=settings.motion;
    form.volumeOutput.value=settings.volume+'%';form.mouseOutput.value=settings.sensitivity+'%';
    form.voices.checked=settings.voices;form.voices.disabled=localVoices().length===0;
    form.voicesOutput.value=form.voices.disabled?"不可用":"";
    audio.volume(settings.volume/100);
  }
  const settingsReturn={el:null};
  function openSettings(e){
    settingsReturn.el=e.currentTarget;buttons.settings.hidden=false;
    document.querySelectorAll('#title-screen,#pause-screen').forEach(el=>el.inert=true);
    form.volume.focus();
  }
  function closeSettings(){
    buttons.settings.hidden=true;
    document.querySelectorAll('#title-screen,#pause-screen').forEach(el=>el.inert=false);
    settingsReturn.el?.focus();
  }
  $('#open-settings').addEventListener('click',openSettings);
  $('#pause-settings').addEventListener('click',openSettings);
  $('#close-settings').addEventListener('click',closeSettings);
  synthesis?.addEventListener('voiceschanged',syncForm);
  for(const key of ['volume','sensitivity','motion','voices']){
    form[key].addEventListener('input',()=>{
      settings[key]=form[key].type==='checkbox'?form[key].checked:+form[key].value;
      if(!settings.voices||!settings.volume)synthesis?.cancel();
      syncForm();
      try{ localStorage.setItem('pale-signal-settings',JSON.stringify(settings)); }catch{}
    });
  }
  buttons.settings.addEventListener('keydown',e=>{
    if(e.code!=='Tab')return;
    const elements=[form.volume,form.sensitivity,form.voices,form.motion,$('#close-settings')];
    const end=e.shiftKey?elements[0]:elements.at(-1);
    if(document.activeElement===end){
      e.preventDefault();(e.shiftKey?elements.at(-1):elements[0]).focus();
    }
  });
  syncForm();
  const compass=document.createDocumentFragment();
  const cardinals={0:'N',45:'NE',90:'E',135:'SE',180:'S',225:'SW',270:'W',315:'NW'};
  for(let i=-9;i<=33;i++){
    const mark=document.createElement('span'),degree=(i*15+360)%360;
    mark.textContent=cardinals[degree]||degree.toString().padStart(3,'0');
    compass.appendChild(mark);
  }
  ui.tape.appendChild(compass);

  const keys=new Set(), mouse={left:false,right:false,dx:0,dy:0};
  const player={p:V(),vx:0,vy:0,vz:0,grounded:true,yaw:0,pitch:0,health:100};
  const worldPosition=V(), movement=V(), aimPoint=V(), cameraDir=V(), right=V(), impactDir=V(), smoothCam=V();
  const cameraAim=V(), cameraFrom=V(), target=V(), targetPoint=V(), board=V();

  let mode='title',stage=0,time=0,runTime=0,startFade=0,timeSinceLock=0;
  let wake=0,loaded=MAG,reserve=168,reload=-1,nextShot=0,emptyTimer=0,kick=0,yawKick=0;
  let damageEffect=0,hitFx=0,hitColor='',hurtAngle=0,damageFree=10,damageSound=0;
  let sprint=false,ads=false,landing=0,lookX=0,lookY=0,pace=0;
  let sustained=0,settled=0,releaseTime=0,bodyX=0,bodyZ=0,flight=0,obstruction=0;
  let kickVelocity=0,yawVelocity=0,plant=0,strideSway=0;
  let recoilPeak=0;
  let radioExpire=0,toastExpire=0,hintUntil=0,hintId='',prompt='',interactRequest=false,jumpRequest=false;
  let deviceAction=null,boardingReady=false;
  let powered=false,uplink=false,extraction=false,activeWave=0,waveDelay=0,pct=0,givenThreat=false,heardLog=false,seenYard=false,cinema=-1;
  let checkpointStats=null,stats={},threats=0,fall=-1;
  let lockedIntent=false,lockErrorTimer=0,hasRun=false;
  const worldState={powered:false,uplink:false,extraction:false,cinematic:-1};
  const qa=new URLSearchParams(location.search).get('qa')==='1';
  let startPressedAt=0,requestLockAt=0,lockEnteredAt=0,firstPlayRenderAt=0;
  const frames=[],cinemaFrames=[],longFrames=[];
  const pickups=makePickups();

  const combat=createCombat(scene,world,models,effects,audio,{
    hit(crit,killed,zone){
      stats.hits++;if(crit)stats.critical++;
      hitColor=killed?'#ff9b67':crit?'#ffe2a2':'#eef6ef';
      hitFx=killed?.27:.12;
      audio.play('hit',{gain:killed?.88:.67});
      if(killed){stats.kills++;if(zone==='approach')stats.front++;}
    },
    damage(amount,source){
      if(mode!=='play')return;
      player.health=Math.max(0,player.health-amount);
      damageFree=0;damageEffect=Math.min(.88,damageEffect+.43);
      impactDir.copy(source).sub(player.p);
      hurtAngle=Math.atan2(impactDir.x,-impactDir.z)+player.yaw;
      if(damageSound<=0){audio.play('hurt',{gain:.8});damageSound=.17;}
      if(player.health<=0)beginFall();
    },
    soundAt,
  });

  function inside(){return player.p.z<-11.92&&player.p.z>-31.42;}
  function soundAt(kind,x,gain){
    const dx=x.x-player.p.x,dz=x.z-player.p.z;
    const len=Math.hypot(dx,dz);
    if(len>46)return;
    right.set(Math.cos(player.yaw),0,-Math.sin(player.yaw));
    const pan=(right.x*dx+right.z*dz)/Math.max(3,len);
    audio.play(kind,{pan,gain:gain/(1+len*.057),inside:inside()});
  }
  function makePickups(){
    const items=[];
    const carcass=new T.MeshStandardMaterial({color:0x344854,metalness:.19,roughness:.62});
    const shell=new T.MeshStandardMaterial({color:0xccd7d1,metalness:.11,roughness:.64});
    const orange=lit(0xff7f3c,1.74),green=lit(0x62edd4,1.7),bodyG=new T.BoxGeometry(),ringG=new T.TorusGeometry(.32,.011,6,28);
    const rim=new T.MeshBasicMaterial({color:0x84bbbc,transparent:true,opacity:.44,depthWrite:false});
    function add(x,z,which){
      const root=new T.Group(),main=new T.Group();
      root.position.set(x,world.groundAt(x,z)+.13,z);
      scene.add(root);root.add(main);
      const tint=which==='health'?green:orange;
      const put=(x,y,z,w,h,d,mat)=>{
        const m=new T.Mesh(bodyG,mat);
        m.position.set(x,y,z);m.scale.set(w,h,d);main.add(m);
      };
      put(0,.048,0,.46,.29,.33,carcass);put(0,.18,0,.47,.041,.337,shell);
      put(0,-.08,0,.46,.042,.337,shell);
      for(const x of [-.15,.15])put(x,.06,.17,.037,.14,.019,tint);
      if(which==='health'){
        put(0,.063,.175,.105,.030,.018,tint);put(0,.063,.175,.031,.11,.018,tint);
      }else{
        for(let i=0;i<3;i++)put(-.045+i*.045,.063,.175,.018,.064,.016,tint);
      }
      const ring=new T.Mesh(ringG,rim);
      ring.rotation.x=-Math.PI/2;ring.position.y=-.091;root.add(ring);
      items.push({root,main,x,z,which,taken:false});
    }
    add(-7.08,2.43,'ammo');add(-7.70,2.72,'health');
    add(-5.95,-36.6,'health');add(5.60,-40.99,'ammo');add(-6.8,-54.2,'health');add(5.18,-58.31,'ammo');
    return items;
  }
  function tickPickups(dt){
    for(const item of pickups){
      if(item.taken)continue;
      item.main.position.y=.11+Math.sin(time*2+item.x)*.045;
      item.main.rotation.y+=dt*.94;
      if((item.x-player.p.x)**2+(item.z-player.p.z)**2>1.05||player.p.y>1.05)continue;
      if(item.which==='health'){
        if(player.health>90)continue;
        player.health=Math.min(100,player.health+46);hint('health',2.0);
      }else{
        if(reserve>MAX_RESERVE-18)continue;
        reserve=Math.min(MAX_RESERVE,reserve+60);hint('supply',2.0);
      }
      item.root.visible=false;item.taken=true;audio.play('supply');
    }
  }
  function setMode(next,focus=true){
    mode=next;document.body.dataset.mode=next;
    if(next==='pause'||next==='dead'||next==='dying'||next==='title')synthesis?.cancel();
    if(focus&&modeElements[next])$(modeElements[next]).focus({preventScroll:true});
    weapon.rig.visible=next==='play'||next==='pause';
    body.root.visible=weapon.rig.visible;
  }
  function pauseInput(){
    keys.clear();mouse.left=mouse.right=false;mouse.dx=mouse.dy=0;
    interactRequest=jumpRequest=false;
  }
  function lock(){
    if(lockedIntent||document.pointerLockElement===renderer.domElement)return;
    audio.init();
    lockedIntent=true;
    buttons.resume.querySelector('span').textContent='继续任务';
    clearTimeout(lockErrorTimer);
    lockErrorTimer=setTimeout(()=>{if(lockedIntent)lockFailed();},1600);
    if(qa&&startPressedAt&&!requestLockAt)requestLockAt=performance.now();
    try{
      const result=renderer.domElement.requestPointerLock();
      if(result&&result.catch)result.catch(lockFailed);
    }catch{lockFailed();}
  }
  function lockFailed(){
    if(!lockedIntent)return;
    lockedIntent=false;clearTimeout(lockErrorTimer);pauseInput();
    buttons.resume.querySelector('span').textContent='重新锁定鼠标';
    buttons.resume.setAttribute('aria-label','鼠标锁定失败，请点击继续重试。');
    setMode('pause');
  }
  function leaveLock(){
    lockedIntent=false;clearTimeout(lockErrorTimer);
    if(document.pointerLockElement)document.exitPointerLock();
  }
  document.addEventListener('pointerlockchange',()=>{
    clearTimeout(lockErrorTimer);
    if(document.pointerLockElement===renderer.domElement){
      if(!lockedIntent){leaveLock();return;}
      lockedIntent=false;timeSinceLock=0;
      if(qa&&startPressedAt&&!lockEnteredAt)lockEnteredAt=performance.now();
      buttons.resume.removeAttribute('aria-label');
      setMode('play',false);
    }else if(mode==='play'){
      pauseInput();setMode('pause');
    }
  });
  document.addEventListener('pointerlockerror',lockFailed);
  window.addEventListener('blur',()=>{
    if(mode==='play'){pauseInput();setMode('pause');leaveLock();}
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&mode==='play'){pauseInput();setMode('pause');leaveLock();}
  });
  document.addEventListener('keydown',e=>{
    if(!buttons.settings.hidden){
      if(e.code==='Escape'){e.preventDefault();closeSettings();}
      return;
    }
    if(mode==='cinema'&&e.code==='Escape'){finish(true);return;}
    if(mode!=='play')return;
    if(['KeyW','KeyA','KeyS','KeyD','KeyR','KeyE','Space','ShiftLeft','ShiftRight','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
    if(e.code==='Escape'){
      pauseInput();setMode('pause');leaveLock();return;
    }
    keys.add(e.code);
    if(e.repeat)return;
    if(e.code==='KeyR')startReload();
    if(e.code==='KeyE')interactRequest=true;
    if(e.code==='Space')jumpRequest=true;
  });
  document.addEventListener('keyup',e=>keys.delete(e.code));
  document.addEventListener('mousemove',e=>{
    if(mode!=='play'||timeSinceLock<.045)return;
    mouse.dx+=e.movementX;mouse.dy+=e.movementY;
    const ratio=ads?.64:1,sensitivity=settings.sensitivity*.01*LOOK_SCALE*ratio;
    player.yaw-=e.movementX*sensitivity;
    player.pitch=clamp(player.pitch-e.movementY*sensitivity,-1.37,1.38);
  });
  document.addEventListener('mousedown',e=>{
    if(mode!=='play'||timeSinceLock<.06)return;
    if(e.button===0){mouse.left=true;e.preventDefault();}
    if(e.button===2){mouse.right=true;e.preventDefault();}
  });
  document.addEventListener('mouseup',e=>{
    if(e.button===0)mouse.left=false;
    if(e.button===2)mouse.right=false;
  });
  document.addEventListener('contextmenu',e=>{if(mode==='play')e.preventDefault();});
  buttons.start.addEventListener('click',()=>{
    if(qa){startPressedAt=performance.now();requestLockAt=lockEnteredAt=firstPlayRenderAt=0;}
    reset(false);lock();
  });
  buttons.resume.addEventListener('click',lock);
  buttons.retry.addEventListener('click',()=>{reset(mode==='dead'&&powered);lock();});
  buttons.title.addEventListener('click',toTitle);
  buttons.pauseTitle.addEventListener('click',toTitle);
  $('#pause-restart').addEventListener('click',()=>{reset(powered);lock();});
  function toTitle(){
    pauseInput();leaveLock();combat.reset(true);effects.reset();world.reset();
    powered=uplink=extraction=false;cinema=fall=-1;
    ui.blackout.style.opacity=0;ui.letterbox.style.opacity=0;ui.edge.style.opacity=0;
    for(const item of pickups)item.root.visible=true;
    setMode('title');
  }

  function announce(key,seconds=5.35){
    const [from,line]=words[key];
    ui.radio.querySelector('b').textContent=from;
    ui.radio.querySelector('p').textContent=line;
    ui.radio.classList.add('show');
    speak(key);
    radioExpire=runTime+seconds;
    audio.play(key==='relay'?'record':'radio',{gain:.76});
  }
  const hintText={
    move:'<kbd>W A S D</kbd> 移动 <kbd>Shift</kbd> 奔跑',
    fight:'<kbd>左键</kbd> 射击 <kbd>右键</kbd> 瞄准',
    reload:'<kbd>R</kbd> 装填新电池',
    health:'防寒服已修复',
    supply:'已补充脉冲弹药',
  };
  function hint(name,seconds){
    if(hintId!==name){ui.hint.innerHTML=hintText[name];hintId=name;}
    hintUntil=runTime+seconds;
  }
  function toast(kicker,title,seconds=2.4){
    ui.toast.querySelector('span').textContent=kicker;
    ui.toast.querySelector('strong').textContent=title;
    ui.toast.classList.add('show');toastExpire=runTime+seconds;
  }
  function mission(next){
    stage=next;
    const [act,objective,sub]=phaseCards[stage];
    ui.act.textContent=act;ui.objective.textContent=objective;ui.sub.textContent=sub;
    ui.transmit.hidden=stage!==3;
  }
  function reset(checkpoint){
    hasRun=true;
    pauseInput();
    if(checkpoint&&checkpointStats)stats={...checkpointStats,retries:stats.retries+1};
    else stats={shots:0,hits:0,kills:0,front:0,critical:0,retries:0};
    if(!checkpoint){runTime=0;checkpointStats=null;frames.length=0;cinemaFrames.length=0;longFrames.length=0;}
    powered=checkpoint;uplink=extraction=false;cinema=fall=-1;
    world.reset(checkpoint);combat.reset(checkpoint);effects.reset();weapon.reset();body.reset();
    deviceAction=null;boardingReady=false;
    for(const item of pickups){
      item.taken=checkpoint&&item.z>-30;item.root.visible=!item.taken;
    }
    player.p.set(0,0,checkpoint?-29.4:28.5);
    player.p.y=world.groundAt(player.p.x,player.p.z);
    player.vx=player.vy=player.vz=0;player.health=100;
    player.yaw=0;player.pitch=checkpoint?.011:.018;player.grounded=true;
    loaded=MAG;reserve=checkpoint?MAX_RESERVE:168;
    reload=-1;nextShot=0;emptyTimer=0;kick=yawKick=0;wake=.73;startFade=.71;
    damageEffect=hitFx=landing=pace=lookX=lookY=0;
    sustained=settled=releaseTime=bodyX=bodyZ=flight=obstruction=0;
    kickVelocity=yawVelocity=plant=strideSway=recoilPeak=0;
    damageFree=9;damageSound=0;radioExpire=toastExpire=hintUntil=0;
    activeWave=0;waveDelay=0;pct=0;givenThreat=checkpoint;heardLog=checkpoint;seenYard=false;
    threats=0;
    sprint=ads=false;
    ui.hint.textContent='';hintId='';prompt='';ui.interaction.hidden=true;
    ui.radio.classList.remove('show');ui.toast.classList.remove('show');
    ui.edge.style.opacity=0;ui.letterbox.style.opacity=0;
    smoothCam.set(player.p.x,player.p.y+1.65,player.p.z);
    camera.position.copy(smoothCam);
    camera.rotation.set(player.pitch,player.yaw,0,'YXZ');
    mission(checkpoint?2:0);
    audio.init();
    if(checkpoint){announce('checkpoint');toast('读取存档','天线场');}
    else {announce('start');hint('move',6.4);}
  }


  function startReload(){
    if(mode!=='play'||reload>=0||loaded===MAG||reserve<=0||deviceAction||weapon.controlProgress()>=0)return;
    reload=0;
  }
  function fire(){
    if(!loaded){
      if(emptyTimer<=0){audio.play('empty',{gain:.72,inside:inside()});emptyTimer=.29;}
      startReload();return;
    }
    loaded--;stats.shots++;
    if(qa&&releaseTime===0)recoilPeak=0;
    nextShot=.118;
    camera.updateMatrixWorld();
    camera.getWorldDirection(aimPoint);
    const heat=sustained*sustained;
    const dispersion=(ads?.00112:lerp(.0033,.010,pace))+(ads?.0064:.0108)*heat;
    aimPoint.addScaledVector(right.set(Math.cos(player.yaw),0,-Math.sin(player.yaw)),(Math.random()-.5)*dispersion);
    aimPoint.y+=(Math.random()-.5)*dispersion;
    aimPoint.normalize();
    weapon.muzzle.getWorldPosition(worldPosition);
    const impact=combat.shoot(camera.position,aimPoint,ads);
    effects.tracer(worldPosition,impact);
    audio.play('shot',{gain:.86,inside:inside(),heat:sustained});
    weapon.fire(sustained);
    sustained=clamp(sustained+.185,0,1);
    releaseTime=.16;
    kick=Math.min(.058,kick+(ads?.0045:.0064)+heat*.005);
    kickVelocity+=.17+heat*.58;
    const rhythm=Math.sin(stats.shots*1.81)*(.046+heat*.122);
    yawVelocity+=rhythm*(ads?.74:1);
    if(!loaded&&reserve>0)hint('reload',2.85);
  }
  function movementTick(dt){
    timeSinceLock+=dt;runTime+=dt;wake=Math.max(0,wake-dt);
    if(keys.has('ArrowLeft'))player.yaw+=dt*1.17;
    if(keys.has('ArrowRight'))player.yaw-=dt*1.17;
    player.yaw=Math.atan2(Math.sin(player.yaw),Math.cos(player.yaw));
    const forward=+(keys.has('KeyW')||keys.has('ArrowUp'))-+(keys.has('KeyS')||keys.has('ArrowDown'));
    const lateral=+keys.has('KeyD')-+keys.has('KeyA');
    sprint=(keys.has('ShiftLeft')||keys.has('ShiftRight'))&&forward>0&&player.grounded&&!mouse.right&&!mouse.left&&reload<0;
    ads=mouse.right&&!sprint&&reload<0&&wake<.25;
    const speed=ads?2.75:sprint?7.20:4.40;
    const sin=Math.sin(player.yaw),cos=Math.cos(player.yaw);
    movement.set(-sin*forward+cos*lateral,0,-cos*forward-sin*lateral);
    const moving=movement.lengthSq()>0;
    if(moving)movement.normalize().multiplyScalar(speed);
    const crossing=movement.x*player.vx+movement.z*player.vz<-.24;
    const response=player.grounded?moving?crossing?23:sprint?8.1:13.5:22:3.5;
    const previousX=player.vx,previousZ=player.vz;
    const beforeX=player.p.x,beforeZ=player.p.z;
    player.vx=damp(player.vx,movement.x,response,dt);
    player.vz=damp(player.vz,movement.z,response,dt);
    for(let i=0;i<2;i++)moveOnFloor(world,player.p,player.vx*dt*.5,player.vz*dt*.5,.32,1.69);
    if(dt>0){player.vx=(player.p.x-beforeX)/dt;player.vz=(player.p.z-beforeZ)/dt;}
    const accelerationX=(player.vx-previousX)*cos-(player.vz-previousZ)*sin;
    const accelerationZ=-(player.vx-previousX)*sin-(player.vz-previousZ)*cos;
    bodyX=damp(bodyX,clamp(accelerationX/Math.max(dt,.002)*.017,-1,1),14,dt);
    bodyZ=damp(bodyZ,clamp(accelerationZ/Math.max(dt,.002)*.015,-1,1),13,dt);
    if(jumpRequest&&player.grounded){player.vy=5.15;player.grounded=false;}
    jumpRequest=false;
    const floor=floorAt(world,player.p.x,player.p.z,player.p.y);
    if(!player.grounded||player.p.y>floor+.055)player.vy-=13.9*dt;
    else player.vy=0;
    player.p.y+=player.vy*dt;
    if(player.p.y<=floor+(player.grounded?.055:.013)&&player.vy<=0){
      if(!player.grounded&&player.vy<-1.9){
        landing=Math.min(.109,-player.vy*.014);plant=1;audio.play('land',{gain:.72,inside:inside()});
      }
      player.p.y=floor;player.grounded=true;player.vy=0;
    }else player.grounded=false;
    pace=damp(pace,clamp(Math.hypot(player.vx,player.vz)/6,0,1.16),9,dt);
    const gait=body.update(dt,player,pace,sprint,landing);
    if(gait.foot){
      plant=clamp(.33+pace*.71,0,1);
      const {x,z}=gait.contact;
      const surface=world.footSurface(x,z);
      audio.play('step',{inside:inside(),surface,gain:sprint?1:ads?.61:.84,pan:gait.foot*.11});
      if(surface==='snow')world.print(x,z,gait.yaw,gait.foot);
    }
    flight=damp(flight,player.grounded?0:clamp(player.vy*.15,-.75,.70),10,dt);
    landing=damp(landing,0,10.4,dt);plant=damp(plant,0,13,dt);
    strideSway=gait.weight;
    const sections=Math.max(1,Math.ceil(dt/.010)),step=dt/sections;
    for(let i=0;i<sections;i++){
      kickVelocity+=(-kick*237-kickVelocity*24)*step;kick+=kickVelocity*step;
      yawVelocity+=(-yawKick*264-yawVelocity*26)*step;yawKick+=yawVelocity*step;
    }
    if(qa)recoilPeak=Math.max(recoilPeak,kick);
    const motion=settings.motion?.15:1;
    const eye=1.65-(plant*(sprint?.021:.011)+gait.compression*.71)*motion;
    smoothCam.set(player.p.x,player.p.y+eye,player.p.z);
    camera.position.x=smoothCam.x;camera.position.z=smoothCam.z;
    camera.position.y=damp(camera.position.y,smoothCam.y,player.grounded?30:24,dt);
    camera.rotation.set(player.pitch+kick*(settings.motion?.40:1),player.yaw+yawKick,
      (strideSway*.0032-bodyX*.0066)*motion,'YXZ');
    const fov=damp(camera.fov,ads?49:sprint?73:68,ads?15:9,dt);
    if(Math.abs(fov-camera.fov)>.012){camera.fov=fov;camera.updateProjectionMatrix();}
    const mouseScale=.0167/Math.max(.006,dt);
    lookX=damp(lookX,mouse.dx*mouseScale,17,dt);lookY=damp(lookY,mouse.dy*mouseScale,17,dt);
    mouse.dx=mouse.dy=0;
  }
  function gunTick(dt){
    nextShot=Math.max(0,nextShot-dt);emptyTimer=Math.max(0,emptyTimer-dt);
    releaseTime=Math.max(0,releaseTime-dt);
    if(releaseTime===0)sustained=damp(sustained,0,6.8,dt);
    settled=damp(settled,sustained,12,dt);
    targetPoint.copy(camera.position);
    targetPoint.y-=.30;
    cameraDir.set(-Math.sin(player.yaw),Math.min(0,player.pitch*.55),-Math.cos(player.yaw)).normalize();
    const wall=rayWorld(world,targetPoint,cameraDir,1.14,false);
    obstruction=damp(obstruction,wall?1-smoothstep(wall.t,.33,1.12):0,wall?15:10,dt);
    if(reload>=0){
      const old=reload;
      reload+=dt/RELOAD;
      if(old<.18&&reload>=.18)audio.play('release',{gain:.86,inside:inside()});
      if(old<.716&&reload>=.716)audio.play('insert',{gain:.83,inside:inside()});
      if(old<.785&&reload>=.785)audio.play('rack',{gain:.68,inside:inside()});
      if(reload>=1){
        const transfer=Math.min(MAG-loaded,reserve);
        loaded+=transfer;reserve-=transfer;reload=-1;
      }
    }
    weapon.update(dt,{ads,sprint,pace,lookX,lookY,reload,loaded,plant,weight:strideSway,pitch:player.pitch,floor:world.groundAt,
      bodyX,bodyZ,flight,landing,obstruction,fireHeat:settled,trigger:mouse.left,reduced:settings.motion,drop:wake/.73});
    if(mouse.left&&nextShot<=0&&reload<0&&!sprint&&wake<.39&&weapon.controlProgress()<0)fire();
  }
  function distanceTo(p){
    return Math.hypot(player.p.x-p.x,player.p.z-p.z);
  }
  function interactable(p,range=2.48){
    if(distanceTo(p)>range)return false;
    camera.getWorldDirection(cameraDir);
    targetPoint.copy(p).sub(camera.position).normalize();
    return cameraDir.dot(targetPoint)>.24;
  }
  const logPoint=V(-6.17,1.36,-27.39);
  function setTerminalPrompt(text){
    if(prompt===text)return;
    prompt=text;ui.interaction.hidden=!text;
    if(text)ui.interaction.querySelector('span').textContent=text;
  }
  function pressControl(panel,commit){
    deviceAction={panel,commit};
    if(reload<0)weapon.pressControl(panel.control);
  }
  function advance(dt){
    if(boardingReady){
      if(weapon.controlProgress()<0){
        boardingReady=false;
        if(distanceTo(world.evacPanel.travel)<1.72)beginCinema();
      }
      return;
    }
    if(deviceAction){
      interactRequest=false;
      setTerminalPrompt('');
      if(reload>=0)return;
      const {panel,commit}=deviceAction;
      const progress=weapon.controlProgress();
      if(progress<0){
        if(!interactable(panel.travel,1.45)){deviceAction=null;return;}
        weapon.pressControl(panel.control);
      }else if(!interactable(panel.travel,1.54)){
        deviceAction=null;weapon.releaseControl();
      }else if(progress>=controlContact){
        deviceAction=null;
        world.pressPanel(panel);
        audio.play('switch',{gain:.80,inside:inside()});
        commit();
      }
      return;
    }
    let action='';
    if(stage===0){
      if(!givenThreat&&player.p.z<13){givenThreat=true;announce('threat');hint('fight',6);}
      if(player.p.z<-12.38&&Math.abs(player.p.x)<2.3){
        mission(1);announce('hall');toast('BOREAL / 07','值班机房',2.06);
      }
    }else if(stage===1){
      if(interactable(world.relayPanel.travel,1.36))action='启动备用电源';
      else if(!heardLog&&interactable(logPoint,2.37))action='读取值班记录';
      if(interactRequest&&action==='启动备用电源'){
        pressControl(world.relayPanel,()=>{
          powered=true;checkpointStats={...stats};
          world.panelState(world.relayPanel,'ONLINE','POWER RESTORED',true);
          audio.play('power',{inside:true,gain:.9});announce('power');
          mission(2);
        });
      }else if(interactRequest&&action==='读取值班记录'){
        heardLog=true;announce('relay',7.8);action='';
      }
    }else if(stage===2){
      if(!seenYard&&player.p.z<-34.3){seenYard=true;announce('yard',6.5);toast('BOREAL / 07','天线场',2.1);}
      if(interactable(world.uplinkPanel.travel,1.36))action='发送救援坐标';
      if(interactRequest&&action){
        pressControl(world.uplinkPanel,()=>{
          reserve=Math.min(MAX_RESERVE,reserve+48);
          mission(3);uplink=true;activeWave=0;waveDelay=.97;pct=0;
          world.panelState(world.uplinkPanel,'SENDING','KEEP CHANNEL CLEAR',true);
          audio.play('power',{gain:.85});announce('defence');toast('第一次握手','正在上传',1.7);
        });
      }
    }else if(stage===3){
      const alive=combat.remaining('yard'), waves=[2,3,3];
      if(loaded+reserve<24&&interactable(world.uplink))action='提取备用电池';
      if(action&&interactRequest){reserve+=48;hint('supply',2);audio.play('supply');}
      if(alive===0){
        waveDelay-=dt;
        if(activeWave===3){
          pct=damp(pct,1,3.4,dt);
          if(waveDelay<=0){
            pct=1;uplink=false;extraction=true;
            world.panelState(world.uplinkPanel,'DELIVERED','RESCUE FIX RECEIVED',true);
            world.panelState(world.evacPanel,'RETURN','BOARDING READY  /  E',true);
            mission(4);announce('extract',7.8);toast('上传完成','信号已送达',3.35);audio.play('complete',{gain:.83});
          }
        }else if(waveDelay<=0){
          activeWave++;
          combat.activateWave(activeWave);
          audio.play('wave',{gain:.70});
          if(activeWave>1){
            announce(activeWave===2?'second':'third');
            toast('上传进行中',activeWave===2?'两侧来敌':'最后一波',1.65);
          }
        }
      }else{
        const goal=.065+(activeWave-1)*.32+.30*((waves[activeWave-1]-alive)/waves[activeWave-1]);
        pct=damp(pct,goal,2.8,dt);waveDelay=activeWave===3?1.38:2.14;
      }
      if(stage===3)ui.sub.textContent=activeWave===0?'正在建立链路':alive===0?'链路同步中':`巡检机 ${alive} 台 · 第 ${activeWave} 波 / 共 3 波`;
      ui.transmit.querySelector('b').textContent=clamp(Math.round(pct*100),0,100)+'%';
      ui.transmit.querySelector('.transmit-track i').style.transform='scaleX('+pct.toFixed(3)+')';
    }else if(stage===4){
      if(interactable(world.evacPanel.travel,1.36))action='登上返回缆车';
      if(interactRequest&&action){
        pressControl(world.evacPanel,()=>{boardingReady=true;});
      }
    }
    setTerminalPrompt(interactRequest&&stage!==1?'':action);
    interactRequest=false;
  }
  function beginCinema(){
    cameraFrom.copy(camera.position);camera.getWorldDirection(cameraAim);
    cameraAim.multiplyScalar(9).add(cameraFrom);
    cinema=0;
    pauseInput();setMode('cinema',false);leaveLock();combat.clearBolts();
    audio.play('servo',{gain:.72});audio.play('complete',{gain:.55});
    announce('car',3.9);
    document.body.classList.add('departing');
    ui.hint.textContent='';ui.toast.classList.remove('show');
  }
  function cutscene(dt){
    cinema+=dt;
    const t=cinema;
    if(t>=2.58&&t-dt<2.58)audio.play('depart',{gain:.87});
    if(t<2.72){
      const turn=smoothstep(t,.10,.54), walk=smoothstep(t,.44,1.83);
      world.tram.localToWorld(board.set(.27,2.30,.56));
      camera.position.copy(cameraFrom).lerp(board,walk);
      camera.position.x=lerp(lerp(cameraFrom.x,board.x,turn),board.x,walk);
      let landing=0,boot=0;
      for(const [i,beat] of [.62,.88,1.15,1.45,1.71].entries()){
        const elapsed=t-beat;
        if(elapsed>=0){
          landing+=Math.exp(-elapsed*18)*.017;boot=i%2?.7:-.7;
          if(elapsed<dt)audio.play('step',{surface:'metal',gain:i===4?.47:.67,pan:boot*.14});
        }
      }
      camera.position.y-=landing*(settings.motion?.24:1)*smoothstep(t,.45,.61);
      world.tram.localToWorld(target.set(-3.15,1.71,-10));
      target.lerp(cameraAim,1-turn);
      camera.lookAt(target);
      camera.fov=lerp(68,62,turn);
      weapon.rig.visible=t<1.88;
      if(weapon.rig.visible){
        const lower=smoothstep(t,.09,.66);
        weapon.update(dt,{ads:false,sprint:false,pace:(1-walk)*.49,lookX:0,lookY:0,reload:-1,loaded,
          plant:landing*23,weight:boot,pitch:camera.rotation.x,floor:world.groundAt,bodyX:0,bodyZ:0,
          flight:0,landing:0,obstruction:0,fireHeat:0,trigger:false,reduced:settings.motion,drop:lower*.82});
        weapon.rig.position.y-=lower*.24;
        weapon.rig.rotation.x-=lower*.24;
      }
    }else{
      weapon.rig.visible=false;
      const drift=smoothstep(t,2.72,8.27);
      const lift=smoothstep(t,4.71,8.18);
      camera.position.set(-6.85-drift*6.5,2.89+drift*3.45+lift*2.10,-79.4-drift*7.70);
      target.copy(world.tram.position);
      target.x-=1.22+drift*3.48;
      target.y+=2.52+drift*2.42+lift*2.84;
      target.z-=1.86+drift*5.4;
      camera.lookAt(target);
      camera.fov=lerp(54,60,drift)+lift*3.7;
    }
    camera.updateProjectionMatrix();
    ui.blackout.style.opacity=t<2.72?smoothstep(t,2.51,2.72):1-smoothstep(t,2.72,3.03);
    ui.letterbox.style.opacity=smoothstep(t,0,.44);
    if(t>3.38)ui.radio.classList.remove('show');
    if(t>8.72)finish(true);
  }
  function beginFall(){
    if(mode!=='play')return;
    cameraFrom.copy(camera.position);
    cameraAim.set(camera.rotation.x,camera.rotation.y,camera.rotation.z);
    fall=0;
    pauseInput();setMode('dying',false);leaveLock();
  }
  function fallFrame(dt){
    fall+=dt;
    const force=settings.motion?.21:1,drop=smoothstep(fall,.12,.82);
    camera.position.y=cameraFrom.y-drop*.61*force;
    camera.rotation.set(cameraAim.x+drop*.11*force,cameraAim.y,cameraAim.z-drop*.155*force,'YXZ');
    ui.edge.style.opacity=(1-drop)*.58*force;
    ui.blackout.style.opacity=drop*.37;
    if(fall>.89)finish(false);
  }
  function finish(won){
    if(mode!=='dying'&&mode!=='cinema')return;
    pauseInput();leaveLock();
    ui.edge.style.opacity=0;ui.letterbox.style.opacity=0;ui.blackout.style.opacity=0;
    document.body.classList.remove('departing');
    ui.radio.classList.remove('show');
    const valid=stats.shots?Math.round(stats.hits/stats.shots*100):0;
    const duration=Math.floor(runTime),min=Math.floor(duration/60),seconds=(duration%60).toString().padStart(2,'0');
    $('#end-kicker').lastChild.textContent=won?' 任务报告 / 07':' 信号丢失 / 07';
    $('#end-title').textContent=won?'信号已送达':'任务中断';
    $('#end-copy').textContent=won?'山下已确认收到坐标，搜救队正在飞往冰川北缘。07 号站，任务结束。':powered?'防寒服失效。备用电源已接通，可以从中继站北门恢复任务。':'防寒服失效。搜救仍在等待坐标，可以从雪脊重新布置路线。';
    $('#stats').innerHTML=`<div><small>任务耗时</small><b>${min}:${seconds}</b></div><div><small>击毁巡检机</small><b>${stats.kills}</b></div><div><small>命中率</small><b>${valid}%</b></div>`;
    buttons.retry.querySelector('span').textContent=won?'重新游玩':powered?'从北门重试':'重新出发';
    setMode(won?'won':'dead');if(!won)audio.play('wave',{gain:.78});
  }
  function placeMarker(){
    const heading=(360-player.yaw*180/Math.PI+360)%360;
    ui.tape.style.transform='translateX('+(-342-heading/15*36).toFixed(1)+'px)';
    ui.bearing.textContent=(Math.round(heading)%360).toString().padStart(3,'0');
    if(stage===3||prompt){ui.marker.style.display='none';return;}
    const gatePoint=V(0,1.58,-32.15),exGate=V(0,1.55,-64.28);
    const point=stage===0?world.front:stage===1?world.relay:stage===2?player.p.z>-30?gatePoint:world.uplink:player.p.z>-64.6?exGate:world.evac;
    const dist=distanceTo(point);
    if(dist<1.65){ui.marker.style.display='none';return;}
    targetPoint.copy(point);targetPoint.y+=.58;
    camera.getWorldDirection(cameraDir);
    const behind=target.copy(targetPoint).sub(camera.position).dot(cameraDir)<0;
    targetPoint.project(camera);
    if(behind){
      right.set(Math.cos(player.yaw),0,-Math.sin(player.yaw));
      targetPoint.x=target.dot(right)>0?.95:-.95;targetPoint.y=-.16;
    }
    const off=behind||Math.abs(targetPoint.x)>.91||Math.abs(targetPoint.y)>.81;
    ui.marker.style.display='block';
    ui.marker.classList.toggle('off',off);
    ui.marker.style.left=((clamp(targetPoint.x,-.91,.91)*.5+.5)*100).toFixed(2)+'%';
    ui.marker.style.top=((.5-clamp(targetPoint.y,-.79,.77)*.5)*100).toFixed(2)+'%';
    ui.distance.textContent=Math.round(dist)+' m';
  }
  function updateHUD(){
    const hp=Math.ceil(player.health);
    if(ui.health.textContent!==String(hp)){
      ui.health.textContent=hp;
      [...$('#health-segments').children].forEach((el,i)=>el.style.setProperty('--filled',clamp((hp-i*20)/20,0,1)));
    }
    ui.vitals.classList.toggle('low',hp<33);
    ui.loaded.textContent=String(loaded).padStart(2,'0');ui.reserve.textContent=reserve;
    ui.ammo.classList.toggle('low',loaded<5);
    ui.ammoNote.textContent=reload>=0?'正在装填':loaded<5?reserve?'R 装填':'弹药耗尽':'';
    ui.reticle.style.opacity=ads?0:sprint?.24:.85;
    ui.reticle.style.setProperty('--gap',(6.5+pace*5.1+kick*115+settled*9.1).toFixed(1)+'px');
    ui.hit.style.opacity=clamp(hitFx*7.8,0,1);ui.hit.style.setProperty('--hit',hitColor);
    ui.incoming.style.transform='rotate('+hurtAngle+'rad)';
    ui.incoming.style.opacity=Math.min(1,damageEffect*1.65);
    ui.edge.style.opacity=Math.max(hp<31?.145:0,damageEffect)*(settings.motion?.48:.79);
    if(runTime>radioExpire)ui.radio.classList.remove('show');
    if(runTime>toastExpire)ui.toast.classList.remove('show');
    if(runTime>hintUntil&&hintId){ui.hint.textContent='';hintId='';}
    placeMarker();
  }
  function play(dt){
    startFade=Math.max(0,startFade-dt);
    ui.blackout.style.opacity=smoothstep(startFade,0,.71);
    damageFree+=dt;damageSound-=dt;hitFx=Math.max(0,hitFx-dt);
    damageEffect=damp(damageEffect,0,2.5,dt);
    movementTick(dt);
    advance(dt);
    if(mode!=='play')return;
    gunTick(dt);
    threats=combat.update(dt,time,player,stage);
    if(mode!=='play')return;
    if(damageFree>3.8&&player.health<72)player.health=Math.min(72,player.health+dt*17);
    tickPickups(dt);
    updateHUD();
  }
  function titleFrame(t){
    camera.position.set(-10.8+Math.sin(t*.13)*.87,5.19+Math.sin(t*.14)*.26,-34.0-Math.sin(t*.095)*.61);
    camera.lookAt(1.4,4.21,-57.4);
    if(camera.fov!==68){camera.fov=68;camera.updateProjectionMatrix();}
  }
  const instrument=qa&&renderer.getContext().getExtension('WEBGL_debug_renderer_info');
  let previousFrame;
  if(qa)Object.defineProperty(window,'signalQA',{value:Object.freeze({
    snapshot(benchmark=false){
      const p=player.p;
      return {mode,stage,runTime,view:[camera.position.x,camera.position.y,camera.position.z],pos:[p.x,p.y,p.z],
        yaw:player.yaw,pitch:player.pitch,aimYaw:camera.rotation.y,aimPitch:camera.rotation.x,fov:camera.fov,ads,
        locked:document.pointerLockElement===renderer.domElement,prompt,loaded,reserve,reload,pct,wave:activeWave,controlProgress:weapon.controlProgress(),
        health:player.health,stats:{...stats},bots:combat.snapshot(),wrecks:combat.wreckSnapshot(),inside:inside(),audio:audio.level(),recordedFootsteps:audio.footstepCount(),surfaceMarks:effects.impactCount(),fireHeat:settled,
        movement:{speed:Math.hypot(player.vx,player.vz),grounded:player.grounded,sprint},recoilPeak,
        boxes:world.colliders.filter(c=>c.active&&c.kind!=='bounds').map(c=>[c.minX,c.maxX,c.minY,c.maxY,c.minZ,c.maxZ]),
        render:instrument?renderer.getContext().getParameter(instrument.UNMASKED_RENDERER_WEBGL):'unavailable',
        activation:lockEnteredAt?{prepareInputMs:requestLockAt-startPressedAt,pointerLockMs:lockEnteredAt-startPressedAt,
          firstDrawMs:firstPlayRenderAt?firstPlayRenderAt-startPressedAt:null}:null,
        frames:benchmark?frames.slice():undefined,cinemaFrames:benchmark?cinemaFrames.slice():undefined,
        longFrames:benchmark?longFrames.slice():undefined,settings:{...settings}};
    },
  })});
  let last=performance.now();
  function frame(ms){
    const elapsed=(ms-last)*.001;
    last=ms;const dt=clamp(elapsed,0,.070);
    time+=dt;
    const timeFrame=qa&&mode==='play';
    if(qa&&mode==='cinema'&&elapsed>0)cinemaFrames.push(elapsed*1000);
    const startFrame=timeFrame?performance.now():0;
    if(timeFrame&&elapsed>0&&frames.length<60000){
      frames.push(elapsed*1000);
      if(elapsed>.050)longFrames.push({ms:Math.round(elapsed*1000),seconds:+runTime.toFixed(2),stage,z:+player.p.z.toFixed(1),preceding:previousFrame});
    }
    if(mode==='title')titleFrame(time);
    if(mode==='play'){play(dt);effects.update(dt,world.groundAt);}
    if(mode==='cinema')cutscene(dt);
    if(mode==='dying'){fallFrame(dt);effects.update(dt,world.groundAt);}
    if(mode!=='pause'&&mode!=='dead'||!hasRun){
      worldState.powered=powered;worldState.uplink=uplink;worldState.extraction=extraction;worldState.cinematic=cinema;
      world.update(time,dt,camera.position,worldState);
      rider.update(cinema);
    }
    const isInside=(mode==='play'||mode==='pause'||mode==='dead'||mode==='dying')&&inside();
    const blowing=(.50+Math.sin(time*.72)*.31+Math.sin(time*.34)*.19);
    const wind=isInside?.05:extraction?.16:uplink?.54+blowing*.39:.21+blowing*.24;
    const weather=extraction?.86:mode==='title'?.26:isInside?.14:uplink?.04:.12;
    const squall=mode==='play'&&stage===3?.54+blowing*.43:mode==='title'?.28:0;
    audio.update(time,mode,{inside:isInside,combat:mode==='play'&&threats>0,pace,wind});
    const startDraw=timeFrame?performance.now():0;
    const programCount=timeFrame?renderer.info.programs.length:0;
    draw(time,dt,{inside:isInside,weather,wind,squall,reduced:settings.motion,focusZ:camera.position.z});
    if(timeFrame&&lockEnteredAt&&!firstPlayRenderAt)firstPlayRenderAt=performance.now();
    if(timeFrame)previousFrame={logicMs:+(startDraw-startFrame).toFixed(1),drawMs:+(performance.now()-startDraw).toFixed(1),
      newPrograms:renderer.info.programs.length-programCount,heading:+player.yaw.toFixed(2),
      compiled:renderer.info.programs.length>programCount?renderer.info.programs.slice(programCount).map(program=>program.type):undefined};
    requestAnimationFrame(frame);
  }
  // Fill the shader cache under the loading screen before accepting player input.
  $('#boot-label').textContent='正在准备灯光与材质';
  audio.prepare();
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const previewDrone=models.drone().root, previewRover=models.stalker().root;
  previewDrone.position.set(-2,1.4,20);previewRover.position.set(2,.17,20);
  scene.add(previewDrone,previewRover);
  weapon.update(.016,{ads:false,sprint:false,pace:0,lookX:0,lookY:0,reload:-1,loaded:MAG,plant:0,weight:0,pitch:0,bodyX:0,bodyZ:0,flight:0,landing:0,obstruction:0,fireHeat:0,trigger:false,reduced:true,drop:0});
  weapon.rig.visible=true;
  camera.position.set(0,1.80,28.5);camera.lookAt(0,2.28,-11.5);
  world.update(0,.016,camera.position,worldState);
  await prepareScene();
  draw(0,.016,{focusZ:28.5});
  scene.remove(previewDrone,previewRover);
  camera.position.set(0,1.72,-18.1);camera.lookAt(-.5,2.07,-29.0);
  world.update(.20,.016,camera.position,worldState);
  draw(.20,.016,{inside:true,focusZ:-18.1});
  // A backward glance brings the exterior materials into the hall's reflection pass.
  camera.fov=115;camera.updateProjectionMatrix();
  camera.position.set(-.01,1.719,-24.97);
  camera.rotation.set(.013,-3.09,0,'YXZ');
  world.update(.39,.17,camera.position,worldState);
  draw(.39,.17,{inside:true,focusZ:-24.97});
  await prepareScene();
  draw(.42,.22,{focusZ:-24.97});
  camera.rotation.set(-.24,.49,0,'YXZ');
  draw(.59,.17,{inside:true,focusZ:-24.97});
  camera.position.set(-10.8,5.19,-34.0);camera.lookAt(1.4,4.21,-57.4);
  camera.fov=68;camera.updateProjectionMatrix();
  world.update(.59,.20,camera.position,worldState);
  draw(.59,.20,{focusZ:-34.0});
  effects.finishWarmup();
  time=.59;
  toTitle();
  buttons.start.blur();
  titleFrame(time);
  draw(time,.016);
  last=performance.now();
  requestAnimationFrame(frame);

}









