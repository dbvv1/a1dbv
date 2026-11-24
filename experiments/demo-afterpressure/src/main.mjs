import * as T from 'three';
import { blendConcrete, siteAssets } from './site-assets.mjs';
import { applySiteCoatings, materials, v3 } from './art.mjs';
import { effects } from './actors.mjs';
import { weapon } from './viewmodel.mjs';
import { surveyors } from './surveyors.mjs';
import { makeAudio } from './audio.mjs';
import { createRenderer } from './render.mjs';
import { buildStation } from './station.mjs';
import { gatePanel, relay, droneSites, entry, overlook, bulkhead, threshold } from './layout.mjs';
import { sequenceCamera } from './cinematics.mjs';
import { advance, createRun, doorLift, flowReading, hydraulicState, interactionFor, lookVector, objectiveFor, panelDistance, reloadDuration, tick, traceWorld } from './sim.mjs';

const el=id=>document.getElementById(id);
const ui=Object.fromEntries([
  'loading','loadingStage','loadingPercent','loadingProgress','menuActions','view','hud','menu','title','english','description','results','start','restart','settings','quickControls',
  'sensitivity','sensLabel','volume','volumeLabel','motion','phaseIndex','phaseZone','objective','objectiveDetail','pips',
  'telemetry','telemetryLabel','telemetryValue','telemetryUnit','telemetryFill',
  'marker','markerDetail','reticle','prompt','promptText','useKey','holdTrack','holdFill','radio',
  'radioFrom','radioText','health','healthFill','mag','reserve','weaponStatus','reloadTrack','reloadFill',
  'damage','damageDirection','chapter','chapterLabel','chapterTitle','cinema','cinemaPlace','cinemaSkip','cinemaText','cutFade'
].map(id=>[id,el(id)]));
const params=new URLSearchParams(location.search);
const phaseCopy={
  entry:['01','检修栈桥','开启检修卷闸','栈桥尽头 · ACCESS'],
  approach:['01','检修栈桥','进入涡轮大厅','穿过标有 TURBINE HALL 的检修门'],
  engage:['02','涡轮大厅','停用失控巡检机',''],
  relay:['02','涡轮大厅','接通液压旁路','大厅左侧 · BYPASS'],
  control:['03','主闸控制','进入主闸控制室','穿过液压隔离门'],
  gate:['03','主闸控制','开启 07 号主闸','控制室右侧 · GATE'],
  opening:['03','主闸控制','主闸抬升中','泄水槽已接通'],
  overlook:['04','下游峡谷','确认下游水情','沿 WALKOUT 通道前往观测台']
};
const interactionCopy={entry:'刷通行证',relay:'接通液压旁路',gate:'拉下主闸手柄',cache:'补充护甲与电芯',overlook:'回报下游流量'};
const controlMarker={x:(bulkhead.x0+bulkhead.x1)*.5,y:1.95,z:bulkhead.z1};
const walkoutMarker={x:6.24,y:2.15,z:-27.02};
const terminal={entry,relay,gate:gatePanel,overlook};
const contactPoint={
  entry:[entry.x,entry.y-.125,entry.z+.201],
  relay:[relay.x+.310,1.625,relay.z+.430],
  overlook:[overlook.x,overlook.y-.125,overlook.z+.201]
};
const lockCopy={combat:'先停用大厅内的巡检机',pressure:'先接通液压旁路'};

const nextPaint=()=>new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));
function loadProgress(percent,label) {
  if(ui.loadingStage.textContent!==label)ui.loadingStage.textContent=label;
  ui.loadingProgress.value=percent;
  ui.loadingPercent.textContent=percent+'%';
}
async function boot() {
  await nextPaint();
  loadProgress(4,'生成混凝土、涂层与金属表面');
  let generated=0,imported=0;
  const report=()=>loadProgress(4+Math.round(generated*24+imported*13),'生成表面并读取本地材质');
  const [material,assets]=await Promise.all([
    materials(value=>{generated=value;report();}),
    siteAssets(value=>{imported=value;report();})
  ]);
  Object.assign(material,assets);
  applySiteCoatings(material);
  blendConcrete(material.cast,material.wall);
  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(64,innerWidth/innerHeight,.046,180);
  camera.rotation.order='YXZ';
  scene.add(camera);
  loadProgress(43,'构造峡谷与水电站');
  await nextPaint();
  const screen=await createRenderer(ui.view,scene,camera,material,params.get('quality')==='low',nextPaint);
  loadProgress(57,'装配机组、卷闸和检修栈桥');
  await nextPaint();
  const station=await buildStation(scene,material,nextPaint);
  loadProgress(70,'装配巡检机和第一人称视图');
  await nextPaint();
  const gun=weapon(camera,material);
  await nextPaint();
  const enemies=surveyors(scene,material);
  const fx=effects(scene,material);
  const audio=makeAudio();
  screen.renderer.shadowMap.needsUpdate=true;
  const canvas=screen.renderer.domElement;
  const keys=new Set();
  const muzzle=v3(),projected=v3(), direction=v3();
  const pips=[...ui.pips.children];
  const lerp=T.MathUtils.lerp, smooth=T.MathUtils.smoothstep, clamp=T.MathUtils.clamp;
  const damp=(current,target,rate,dt)=>lerp(current,target,1-Math.exp(-rate*dt));

  let run=createRun(), mode='menu', recaptured=false;
  let photo=params.get('hud')==='0';
  let fire=false, aim=false, tapped=false, reload=false, skip=false, lookX=0, lookY=0;
  let bump=0, ads=0, gait=0, stride=0, weaponRoll=0, weaponYaw=0, injury=0, hitTime=0, hitType=null, damagePoint;
  let message=null, chapter=null, shotInfo=null, returnFade=0, cameraSettle=0, operate=0, proximity=0, then, showTime=0, worldTime=0, acc=0, lastHud='', audioAt=0;
  let operated=null, operationProgress=0;
  let options={sense:100,volume:72,motion:matchMedia('(prefers-reduced-motion: reduce)').matches};
  try {
    const saved=JSON.parse(localStorage.getItem('afterpressure.settings')||'null');
    if(saved) options={
      sense:clamp(Number(saved.sense)||100,35,180),
      volume:Number.isFinite(saved.volume)?clamp(saved.volume,0,100):72,
      motion:Boolean(saved.motion)
    };
  } catch {}
  ui.sensitivity.value=options.sense;
  ui.volume.value=options.volume;
  ui.motion.checked=options.motion;
  function applyOptions(save) {
    options={sense:Number(ui.sensitivity.value),volume:Number(ui.volume.value),motion:ui.motion.checked};
    ui.sensLabel.value=options.sense+'%';
    ui.volumeLabel.value=options.volume+'%';
    audio.volume(options.volume*.01);
    if(save) {
      try {localStorage.setItem('afterpressure.settings',JSON.stringify(options));} catch {}
    }
  }
  applyOptions(false);
  for(const input of [ui.sensitivity,ui.volume,ui.motion]) input.addEventListener('input',()=>applyOptions(true));

  function say(text,duration=3.7,from='调度') {
    message={text,from,until:run.time+duration};
  }

  function announce(label,title) {
    chapter={at:run.time};
    ui.chapterLabel.textContent=label;
    ui.chapterTitle.textContent=title;
  }

  function updateResults(next) {
    const done=next==='won'||next==='lost';
    ui.results.hidden=!done;
    if(!done) return;
    const seconds=Math.floor(run.time), time=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
    const stats=next==='won'
      ? [['下游流量',flowReading(hydraulicState(run))+' m³/s'],['本段用时',time],['命中率',run.shots?Math.round(run.hits/run.shots*100)+'%':'0%'],['剩余护甲',run.player.armor]]
      : [['已停用',run.kills+' / '+droneSites.length],['有效命中',run.hits],['本段用时',time]];
    ui.results.replaceChildren(...stats.map(([label,value])=>{
      const group=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
      dt.textContent=label;dd.textContent=value;group.append(dt,dd);
      return group;
    }));
  }

  function show(next) {
    mode=next;
    ui.menu.dataset.mode=mode;
    ui.menu.hidden=mode==='play';
    ui.hud.hidden=mode!=='play'||photo||Boolean(run.sequence);
    ui.cinema.hidden=true;
    if(mode==='play') return;
    const copy={
      menu:['余压','AFTERPRESSURE','主闸液压失联。从检修栈桥进入北岬水电站，恢复泄洪，并确认下游流量。','进入闸站'],
      paused:['已暂停','AFTERPRESSURE','继续当前任务，或从入口开始新的一局。','继续'],
      lost:['信号中断','任务失败',run.checkpointReady?'入口检查点已保留。重试会补充电芯和护甲。':'巡检机会在发射前蓄能。横移或利用掩体，它的脉冲会被挡住。',run.checkpointReady?'从检查点重试':'重新进入'],
      won:['泄洪成功','任务完成','主闸已开启，下游观测台确认流量，电站压力已回落。','再玩一次']
    }[mode];
    ui.title.textContent=copy[0];
    ui.english.textContent=copy[1];
    ui.description.textContent=copy[2];
    ui.start.textContent=copy[3];
    ui.start.disabled=false;
    ui.restart.hidden=mode!=='paused'&&!(mode==='lost'&&run.checkpointReady);
    ui.quickControls.hidden=mode!=='menu';
    ui.settings.open=false;
    updateResults(mode);
    if(mode!=='menu') ui.start.focus({preventScroll:true});
  }

  function release() {
    keys.clear();
    fire=aim=tapped=reload=skip=false;
    lookX=lookY=0;
    acc=0;
  }

  function start(lock, fresh=false) {
    const resume=mode==='paused'&&!fresh;
    const checkpoint=mode==='lost'&&run.checkpointReady&&!fresh;
    release();
    if(!resume) {
      if(run.entryAt!==null||run.relayAt!==null||run.gateAt)screen.renderer.shadowMap.needsUpdate=true;
      run=createRun(checkpoint);
      bump=ads=gait=stride=weaponRoll=weaponYaw=injury=hitTime=0;
      hitType=damagePoint=null;
      enemies.reset();
      fx.reset();
      audio.reset();
      lastHud='';
      chapter=shotInfo=null;
      returnFade=cameraSettle=operate=proximity=0;
      operated=null;
      if(checkpoint) {say('检查点已恢复。注意配电柜后方。',4);announce('02  /  TURBINE HALL','涡轮大厅');}
    }
    show('play');
    audio.quiet(false);
    if(lock) {
      const audioReady=audio.wake();
      canvas.focus({preventScroll:true});
      if(document.pointerLockElement!==canvas) {
        try {canvas.requestPointerLock()?.catch(()=>{});} catch {}
      }
      audioReady.then(()=>{if(!resume&&!checkpoint)audio.play('arrival');}).catch(()=>{});
    }
  }

  function stop(next) {
    show(next);
    release();
    audio.quiet(true);
    if(document.pointerLockElement===canvas) document.exitPointerLock();
  }

  ui.start.addEventListener('click',()=>start(true));
  ui.restart.addEventListener('click',()=>start(true,true));
  document.addEventListener('pointerlockerror',()=>{
    if(mode==='play') say('按住右键拖动视角，也可用方向键转向。',5,'操作提示');
  });
  document.addEventListener('pointerlockchange',()=>{
    const locked=document.pointerLockElement===canvas;
    if(!locked&&recaptured&&mode==='play')stop('paused');
    recaptured=locked;
  });
  const pause=()=>{if(mode==='play')stop('paused');};
  window.addEventListener('blur',pause);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();
    stop('paused');
    ui.description.textContent='图形设备连接已中断，恢复后可继续。';
    ui.start.disabled=true;
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    screen.renderer.shadowMap.needsUpdate=true;
    show('paused');
  });
  canvas.tabIndex=0;
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  document.addEventListener('mousedown',e=>{
    if(mode!=='play'||e.target!==canvas&&document.pointerLockElement!==canvas)return;
    if(e.button===0)fire=tapped=true;
    if(e.button===2)aim=true;
    audio.wake().catch(()=>{});
  });
  document.addEventListener('mouseup',e=>{
    if(e.button===0)fire=false;
    if(e.button===2)aim=false;
  });
  document.addEventListener('mousemove',e=>{
    if(mode!=='play'||document.pointerLockElement!==canvas&&!(e.buttons&2))return;
    lookX+=e.movementX;
    lookY+=e.movementY;
  });
  document.addEventListener('keydown',e=>{
    if(mode!=='play') {
      if(e.code==='Enter'&&!e.repeat&&e.target===document.body&&!ui.start.disabled) {
        e.preventDefault();start(true);
      }
      return;
    }
    if(e.code==='Escape'&&!e.repeat) {stop('paused');return;}
    if(e.code.startsWith('Arrow')||e.code==='Space') e.preventDefault();
    if(run.sequence==='arrival'&&!e.repeat&&(e.code==='Space'||e.code==='Enter')) {skip=true;return;}
    keys.add(e.code);
    if(e.repeat)return;
    if(e.code==='KeyR')reload=true;
    if(e.code==='Space')tapped=true;
    if(e.code==='KeyH') {
      photo=!photo;
      ui.hud.hidden=photo||Boolean(run.sequence);
    }
  });
  document.addEventListener('keyup',e=>keys.delete(e.code));

  function receive(events) {
    const p=run.player;
    for(const e of events) {
      const enemy=run.drones[e.id], source=e.from||enemy||e.end;
      const pan=source?clamp(((source.x-p.x)*Math.cos(p.yaw)-(source.z-p.z)*Math.sin(p.yaw))*(e.kind==='near-miss'?.80:.15),-.9,.9):0;
      const distance=source?Math.hypot(source.x-p.x,source.z-p.z):0;
      audio.play(e.kind,pan,e,distance);
      switch(e.kind) {
        case 'shot':
          bump=Math.min(1.4,bump+.93);
          gun.muzzle.getWorldPosition(muzzle);
          fx.flashAt(muzzle);fx.beam(muzzle,e.end);
          if(!e.hit)fx.impact(e.end,e.surface,e.normal,e.ray);
          break;
        case 'impact':
          fx.impact(e.end,e.surface,e.normal,e.ray,e.power);
          break;
        case 'hit':
        case 'kill':
          hitTime=e.kind==='kill'?.32:.18;
          hitType=e.kind==='kill'?'kill':e.part;
          enemies.contact(e,run);
          fx.contact(e);
          break;
        case 'damage':
          damagePoint={x:enemy.x,z:enemy.z};
          injury=1;
          break;
        case 'entry':
          say('门锁已解除。穿过检修通道进入机组区。',3.3);
          break;
        case 'control-enter':
          announce('03  /  CONTROL','主闸控制室');
          say('在这里启动 07 号主闸。',3);
          break;
        case 'sequence-end':
          if(e.id==='arrival') {
            cameraSettle=1;
            announce('01  /  SERVICE INTAKE','检修栈桥');
          }
          if(e.id==='opening') {
            returnFade=1;cameraSettle=1;
            announce('04  /  INSPECTION','下游观测台');
            say('水头过闸。沿 WALKOUT 到观测台，等流量回传。',4.5);
          }
          break;
        case 'enter':
          announce('02  /  TURBINE HALL','涡轮大厅');
          say('发射前镜头会亮起。横移，或让机组挡住脉冲。',4.3);
          break;
        case 'checkpoint':
          say('前哨已停机，入口检查点已记录。',2.7,'系统');
          break;
        case 'detect':
          if(e.id===1) say('第二台在配电柜后。它会从两侧换位。',3.8);
          if(e.id===2) say('重型机正在压近。等镜头亮起来再打。',4.7);
          break;
        case 'cache':
          say('护甲和备用电芯已补充。',2.4,'系统');
          break;
        case 'clear':
          say('控制区已清空。左侧 BYPASS 控制台可接通旁路。',4.2);
          break;
        case 'relay':
          say('旁路压力已建立。等隔离门升起，进入控制室。',3.9);
          break;
        case 'gate':
          say('闸门开始抬升，压力正在回落。',3.6);
          break;
      }
    }
  }

  function move(dt) {
    acc+=dt;
    const forward=Number(keys.has('KeyW'))-Number(keys.has('KeyS'));
    const lateral=Number(keys.has('KeyD'))-Number(keys.has('KeyA'));
    const ax=Number(keys.has('ArrowLeft'))-Number(keys.has('ArrowRight'));
    const ay=Number(keys.has('ArrowUp'))-Number(keys.has('ArrowDown'));
    const speed=(aim?.00155:.00248)*options.sense*.01;
    while(acc>=tick) {
      const wasSequence=run.sequence;
      advance(run,{
        moveX:lateral,moveZ:forward,yaw:ax*tick*1.5-lookX*speed,pitch:ay*tick*1.34-lookY*speed,
        fire:fire||tapped||keys.has('Space'),ads:aim,sprint:keys.has('ShiftLeft')||keys.has('ShiftRight'),
        crouch:keys.has('KeyC')||keys.has('ControlLeft')||keys.has('ControlRight'),use:keys.has('KeyE'),reload,skip
      });
      receive(run.events);
      acc-=tick;
      lookX=lookY=0;
      tapped=reload=skip=false;
      if(wasSequence&&!run.sequence) {fire=aim=false;keys.delete('Space');keys.delete('KeyE');}
      if(run.outcome==='lost'||run.outcome==='won') {
        stop(run.outcome);
        break;
      }
    }
  }

  function updateMarker(phase) {
    const prop=phase==='control'?controlMarker:phase==='overlook'&&run.player.z>-27.9?walkoutMarker:terminal[phase];
    if(!prop||photo) {ui.marker.hidden=true;return;}
    const p=run.player,dist=panelDistance(p,prop);
    projected.set(prop.x,prop.y+.44,prop.z).project(camera);
    direction.set(prop.x,prop.y+.44,prop.z).sub(camera.position).transformDirection(camera.matrixWorldInverse);
    const visible=direction.z<0&&dist>2.7&&Math.abs(projected.x)<.92&&Math.abs(projected.y)<.79;
    ui.marker.hidden=!visible;
    if(visible) {
      ui.marker.style.transform='translate('+Math.round((projected.x*.5+.5)*innerWidth)+'px,'+Math.round((.5-projected.y*.5)*innerHeight)+'px) translate(-50%,-50%)';
      const label=({entry:'检修门',relay:'旁路',control:'隔离门',gate:'主闸',overlook:'观测台'})[phase]+' · '+Math.round(dist)+' m';
      if(ui.markerDetail.textContent!==label)ui.markerDetail.textContent=label;
    }
  }

  function updateHud(state) {
    const p=run.player, phase=objectiveFor(run);
    const [number,zone,title,detail]=phaseCopy[phase];
    const desc=detail||(droneSites.length-run.kills)+' 台仍活动';
    const action=run.outcome==='active'?interactionFor(run):null;
    const radio=message&&run.time<=message.until?message:null;
    const key=[phase,p.armor,run.ammo,run.reserve,run.kills,run.reloadAt,action?.id,action?.reason,radio?.text].join('|');
    if(key!==lastHud) {
      lastHud=key;
      ui.phaseIndex.textContent=number;
      ui.phaseZone.textContent=zone;
      ui.objective.textContent=title;
      ui.objectiveDetail.textContent=desc;
      ui.health.textContent=p.armor;
      ui.health.parentElement.dataset.low=String(p.armor<=33);
      ui.healthFill.style.transform='scaleX('+p.armor*.01+')';
      ui.mag.parentElement.parentElement.dataset.low=String(run.ammo<=2);
      ui.mag.textContent=String(run.ammo).padStart(2,'0');
      ui.reserve.textContent='/ '+String(run.reserve).padStart(2,'0');
      ui.weaponStatus.textContent=run.reloadAt?'更换电芯':run.ammo<=2&&run.reserve?'R 换弹':!run.ammo&&!run.reserve?'电芯耗尽':'AP–07';
      ui.reloadTrack.hidden=!run.reloadAt;
      ui.pips.hidden=phase!=='engage';
      for(const [i,pip] of pips.entries()) pip.classList.toggle('down',!run.drones[i].health);
      ui.pips.setAttribute('aria-label',run.kills+' 台巡检机已停用');
      ui.prompt.hidden=!action;
      ui.promptText.textContent=action?lockCopy[action.reason]||'长按 · '+interactionCopy[action.id]:'';
      ui.useKey.hidden=Boolean(action?.reason);
      ui.holdTrack.hidden=!action||Boolean(action.reason);
      ui.radio.hidden=!radio;
      ui.radioText.textContent=radio?.text||'';
      ui.radioFrom.textContent=radio?.from||'';
    }
    const pulling=String(run.action==='gate');
    if(ui.prompt.dataset.active!==pulling)ui.prompt.dataset.active=pulling;
    const downstream=phase==='overlook';
    ui.telemetry.hidden=!downstream&&phase!=='control'&&phase!=='gate'&&run.action!=='relay';
    if(!ui.telemetry.hidden) {
      const value=downstream?state.discharge:state.pressure;
      const label=downstream?'下游流量':'旁路压力', unit=downstream?'m³/s':'MPa';
      const reading=downstream?String(flowReading(state)):(2.1+24.9*value).toFixed(1);
      if(ui.telemetryLabel.textContent!==label)ui.telemetryLabel.textContent=label;
      if(ui.telemetryUnit.textContent!==unit)ui.telemetryUnit.textContent=unit;
      if(ui.telemetryValue.textContent!==reading)ui.telemetryValue.textContent=reading;
      ui.telemetryFill.style.transform='scaleX('+value+')';
    }
    ui.holdFill.style.transform='scaleX('+(action&&run.action===action.id?clamp(run.actionTime/action.seconds,0,1):0)+')';
    if(run.reloadAt)ui.reloadFill.style.transform='scaleX('+clamp((run.time-run.reloadStart)/reloadDuration,0,1)+')';
    ui.reticle.hidden=phase==='opening';
    ui.reticle.classList.toggle('aim',ads*(1-proximity)>.84);
    if(hitTime>0)ui.reticle.dataset.hit=hitType;else delete ui.reticle.dataset.hit;
    ui.reticle.style.setProperty('--gap',Math.round(7+p.recoil*2+gait*3)+'px');
    ui.damage.style.opacity=(injury*.84).toFixed(3);
    ui.damageDirection.hidden=!damagePoint||injury<.095;
    if(!ui.damageDirection.hidden) {
      const x=damagePoint.x-p.x,z=damagePoint.z-p.z;
      const angle=Math.atan2(x*Math.cos(p.yaw)-z*Math.sin(p.yaw),-x*Math.sin(p.yaw)-z*Math.cos(p.yaw));
      ui.damageDirection.style.transform='rotate('+angle+'rad)';
      ui.damageDirection.style.opacity=String(clamp(injury*1.78,0,1));
    }
    updateMarker(phase);
  }

  function deviceReach(id,weight,progress) {
    if(id==='gate') station.gateGrip.getWorldPosition(direction);
    else direction.fromArray(contactPoint[id]);
    direction.applyMatrix4(camera.matrixWorldInverse);
    const scale=.72/Math.max(.40,-direction.z);
    gun.reach(weight,clamp(direction.x*scale,-.38,.38),clamp(direction.y*scale,-.30,.22),progress,id);
  }

  function cameraPose(dt,preparing=false) {
    const p=run.player;
    const lens=fov=>{
      if(Math.abs(camera.fov-fov)>.017) {camera.fov=fov;camera.updateProjectionMatrix();}
    };
    shotInfo=mode==='menu'?null:sequenceCamera(camera,run,options.motion,mode==='won');
    if(shotInfo) {
      lens(shotInfo.fov);
      gun.root.visible=false;
      if(run.sequence==='opening'&&shotInfo.age<.50) {
        camera.updateMatrixWorld();
        deviceReach('gate',1-smooth(shotInfo.age,.04,.48),1);
      } else gun.reach(0);
      return;
    }
    if(mode==='menu') {
      const sway=options.motion?0:Math.sin(showTime*.23)*.26;
      camera.position.set(-3.92+sway,2.10,21.2-sway*.4);
      camera.lookAt(.51,2.71,13.67);
      lens(63);
      gun.root.visible=false;
      gun.reach(0);
      return;
    }
    const speed=p.moving?Math.hypot(p.vx,p.vz)/3.86:0;
    gait=damp(gait,options.motion?0:clamp(speed,0,1.5),10,dt);
    ads=damp(ads,p.ads&&!run.reloadAt?1:0,14,dt);
    stride+=dt*(2+speed*8.3);
    const bob=(Math.cos(stride*2)*.011+Math.sin(stride)*.003)*gait;
    const slide=Math.sin(stride)*.016*gait;
    const localX=p.vx*Math.cos(p.yaw)-p.vz*Math.sin(p.yaw);
    const localZ=-p.vz*Math.cos(p.yaw)-p.vx*Math.sin(p.yaw);
    const swayGain=options.motion?0:1-ads*.83;
    weaponRoll=damp(weaponRoll,clamp(localX*.024,-.110,.110)*swayGain,7.8,dt);
    weaponYaw=damp(weaponYaw,clamp(localX*.009,-.045,.045)*swayGain,9.2,dt);
    // Use the same solid geometry that stops shots to keep the muzzle out of a nearby wall.
    const wall=traceWorld(p,lookVector(p.yaw,p.pitch),1.19,run);
    proximity=damp(proximity,1-smooth(wall,.32,1.18),13.5,dt);
    const sight=ads*(1-proximity);
    const target=p.crouch?62:64;
    const fov=target-16*sight+(p.sprint?1.2:0);
    lens(fov);
    const kick=options.motion?0:bump*.012;
    camera.position.set(p.x,p.y+bob,p.z);
    camera.rotation.set(p.pitch+p.recoil*.006+kick,p.yaw,-slide*.33,'YXZ');
    camera.updateMatrixWorld();
    const reloading=run.reloadAt?clamp((run.time-run.reloadStart)/reloadDuration,0,1):0;
    const action=Math.sin(Math.PI*reloading);
    const consoleTarget=terminal[run.action];
    operate=damp(operate,consoleTarget?1:0,10.5,dt);
    cameraSettle=Math.max(0,cameraSettle-dt*1.9);
    const lower=Math.max(cameraSettle,operate*.63);
    if(consoleTarget) {
      operated=run.action;
      operationProgress=run.actionTime/consoleTarget.hold;
    }
    if(operated&&operate>.045) deviceReach(operated,operate,operationProgress);
    else gun.reach(0);
    gun.root.visible=(preparing||mode==='play'||mode==='paused')&&lower<.999;
    gun.root.position.set(lerp(.254,0,sight)+slide*.51-action*.046-weaponRoll*.15,
      lerp(-.269,-.125,sight)+bob*.60+action*.088-(p.sprint?.054:0)-lower*.84-proximity*.095,
      -.619+bump*.083-action*.085+swayGain*localZ*.0045+proximity*.124);
    gun.root.rotation.set(-.019+bump*.089+action*.39+lower*.54+(p.sprint?.10:0)-proximity*.26,
      .026*(1-ads)+action*.30+weaponYaw-proximity*.16,
      -.061*(1-ads)-action*.39+slide*.48+weaponRoll-(p.sprint?.083:0));
    gun.pose(reloading,sight,options.motion?0:bump);
    gun.display(run.ammo,Boolean(run.reloadAt));
  }

  function cinematicHud(dt) {
    const visible=mode==='play'&&Boolean(shotInfo)&&!photo;
    ui.hud.hidden=mode!=='play'||photo||Boolean(shotInfo);
    ui.cinema.hidden=!visible;
    if(visible) {
      if(ui.cinemaText.textContent!==shotInfo.caption) {
        ui.cinemaPlace.textContent=shotInfo.name;
        ui.cinemaText.textContent=shotInfo.caption;
      }
      ui.cinemaSkip.hidden=shotInfo.id!=='arrival';
    }
    returnFade=Math.max(0,returnFade-dt*3.6);
    ui.cutFade.style.opacity=String(mode==='play'&&!options.motion?Math.max(returnFade,shotInfo?.dip??0):0);
    const age=chapter?run.time-chapter.at:0;
    ui.chapter.style.opacity=String(mode==='play'&&!photo&&!shotInfo&&chapter?
      smooth(age,0,.35)*(1-smooth(age,2.0,2.8)):0);
  }

  function crash(point) {
    fx.burst(point,23,1,3.2);
    fx.smoke(point,.22,.80);
    const p=run.player,dx=point.x-p.x,dz=point.z-p.z;
    audio.play('crash',clamp((dx*Math.cos(p.yaw)-dz*Math.sin(p.yaw))*.18,-.85,.85),{},Math.hypot(dx,dz));
  }

  function frame(now) {
    const dt=then===undefined?0:clamp((now-then)*.001,0,.14);
    then=now;
    showTime+=dt;
    if(mode==='play')move(dt);
    const motionDt=mode==='paused'?0:Math.min(.046,dt);
    worldTime+=motionDt;
    bump*=Math.exp(-18.5*motionDt);
    injury*=Math.exp(-4.5*motionDt);
    hitTime=Math.max(0,hitTime-motionDt);
    const state=hydraulicState(run);
    if(Math.abs(station.slab.position.y-state.lift*6.25)>.001)screen.renderer.shadowMap.needsUpdate=true;
    station.updateGate(run,state);
    station.controls.update(run);
    station.plant(run,state,options.motion);
    if(station.transitions(run,state))screen.renderer.shadowMap.needsUpdate=true;
    cameraPose(motionDt);
    camera.updateMatrixWorld();
    enemies.update(run,motionDt,mode==='play'?crash:null);
    const flash=fx.update(motionDt);
    cinematicHud(motionDt);
    if(mode==='play'&&!shotInfo)updateHud(state);
    if(showTime>=audioAt) {
      audioAt=showTime+.055;
      audio.listen(run,state,mode!=='play',shotInfo?camera.position:run.player);
    }
    screen.draw(worldTime,state,flash,shotInfo);
    requestAnimationFrame(frame);
  }

  Object.defineProperty(window,'gameStatus',{get:()=>({
    screen:mode,phase:run.outcome,objective:objectiveFor(run),sequence:run.sequence,shot:shotInfo?.index,doors:[doorLift(run,threshold),doorLift(run,bulkhead)],entry:run.entryAt!==null,relief:run.relief,kills:run.kills,ammo:run.ammo,
    reserve:run.reserve,health:run.player.armor,shots:run.shots,hits:run.hits,optics:run.optics,bolts:run.bolts.length,
    time:run.time,position:[run.player.x,run.player.y,run.player.z],aim:[run.player.yaw,run.player.pitch],
    drones:run.drones.map(d=>({id:d.id,health:d.health,state:d.state,yaw:d.yaw,position:[d.x,d.y,d.z],charge:d.charge})),
    pointerLocked:document.pointerLockElement===canvas,reloading:Boolean(run.reloadAt),
    reloadProgress:run.reloadAt?(run.time-run.reloadStart)/reloadDuration:0,gate:station.slab.position.y,
    checkpoint:run.checkpointReady,relay:run.relayOn,cache:run.cacheUsed,action:run.action,actionTime:run.actionTime
  })});
  loadProgress(77,'准备风雨、机组与脉冲声音');
  await nextPaint();
  audio.prepare();
  loadProgress(81,'编译光照、阴影与设备材质');
  await nextPaint();
  await screen.prepare();
  loadProgress(91,'预热演出与第一人称画面');
  await nextPaint();
  // Exercise real render targets, reflection and camera-layer variants before accepting input.
  const startup=[
    {sequence:'arrival',time:1.65},{sequence:'arrival',time:6.4},
    {sequence:null,time:7.4},
    {sequence:null,time:10,action:'entry',actionTime:.49,eye:[-2.46,1.66,14.78],look:[entry.x,entry.y,entry.z]},
    {sequence:null,time:18,action:null,entryAt:10,warmImpact:true,eye:[-1.24,1.66,5.55],look:[-1.12,1.84,1.6]},
    {sequence:null,time:26,action:'relay',actionTime:.54,eye:[-4.62,1.66,-15.90],look:[relay.x,relay.y,relay.z]},
    {sequence:null,time:28,action:null,relayOn:true,relayAt:27,eye:[-2.3,1.66,-18.7],look:[-1.35,2.2,-21.3]},
    {sequence:null,time:32.6,action:'gate',actionTime:.56,eye:[1.78,1.66,-22.07],look:[gatePanel.x,gatePanel.y,gatePanel.z]},
    {sequence:'opening',time:33.21,sequenceAt:33,gateAt:33,action:null},
    {sequence:'opening',time:35.1,sequenceAt:33,gateAt:33},
    {sequence:'opening',time:37.2,sequenceAt:33,gateAt:33},
    {sequence:null,time:45,relief:true,action:'overlook',actionTime:.37,
      eye:[6.24,1.66,-33.12],look:[overlook.x,overlook.y,overlook.z]},
    {sequence:'confirmation',time:48,sequenceAt:44,gateAt:33,relief:true,action:null}
  ];
  mode='loading';
  gun.display(run.ammo,false);
  for(const [i,{eye,look,warmImpact,...pose}] of startup.entries()) {
    Object.assign(run,pose);
    if(eye) {
      const [x,y,z]=eye,[tx,ty,tz]=look;
      Object.assign(run.player,{x,y,z,yaw:Math.atan2(x-tx,z-tz),pitch:Math.atan2(ty-y,Math.hypot(x-tx,z-tz))});
    }
    const state=hydraulicState(run);
    station.updateGate(run,state);
    station.controls.update(run);
    station.plant(run,state,options.motion);
    station.transitions(run,state);
    cameraPose(.016,true);
    camera.updateMatrixWorld();
    enemies.update(run,0);
    if(warmImpact) {
      fx.contact({kind:'kill',part:'optic',end:{x:-1.12,y:1.84,z:1.6},ray:{x:0,y:0,z:-1}});
      fx.update(.016);
    }
    await screen.prime(run.time,state,nextPaint,shotInfo);
    if(warmImpact)fx.reset();
    loadProgress(91+Math.floor(8*(i+1)/startup.length),'预热演出与第一人称画面');
    await nextPaint();
  }
  run=createRun();
  station.controls.update(run);
  operate=proximity=0;
  operated=null;
  screen.renderer.shadowMap.needsUpdate=true;
  mode='menu';
  cameraPose(0);
  const state=hydraulicState(run);
  station.transitions(run,state);
  station.updateGate(run,state);
  station.plant(run,state,options.motion);
  await screen.prime(0,state,nextPaint);
  loadProgress(100,'闸站已就绪');
  await nextPaint();
  ui.loading.hidden=true;
  ui.menuActions.hidden=false;
  ui.settings.hidden=false;
  show('menu');
  if(params.get('play')==='1')start(false);
  requestAnimationFrame(frame);
}

boot().catch(error=>{
  ui.loadingStage.textContent='加载失败 · 请重载页面';
  ui.loadingPercent.textContent='';
  ui.loadingProgress.hidden=true;
  ui.description.textContent='无法加载闸站。请检查桌面浏览器的 WebGL 2 支持。';
  throw error;
});
