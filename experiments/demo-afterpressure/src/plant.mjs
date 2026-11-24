import * as T from 'three';
import { canvasMap, cylGeo, decal, place, stenciled } from './art.mjs';
import { overlook } from './layout.mjs';

export function exhaustGallery(b,m) {
  // A separate ventilation train stands on wall brackets between the access bay and the main windows.
  const x=-8.53,z=10.02;
  b.box(m.edge,x,3.86,z,.68,.41,4.64,.05);
  b.box(m.gunMetal,x-.45,4.09,z,1.05,.16,4.67,.016);
  for(let zz=z-2.21;zz<z+2.26;zz+=.134)
    b.box(m.iron,x-.45,4.184,zz,1.02,.035,.062,.008,undefined,false);
  for(const dz of [-2.05,-.62,.82,2.06]) {
    b.box(m.iron,x-.34,3.96,z+dz,1.31,.15,.15,.019);
    b.pipe(m.rust,[x-.89,3.90,z+dz],[-8.00,2.92,z+dz],.074,10);
    b.box(m.edge,-8.05,2.95,z+dz,.31,.48,.37,.029);
    b.pipe(m.iron,[x-.96,4.17,z+dz],[x-.96,5.20,z+dz],.028,12);
  }
  for(const yy of [4.68,5.21])
    b.pipe(m.gunMetal,[x-.96,yy,z-2.10],[x-.96,yy,z+2.12],.026,11);
  for(const dz of [-2.11,2.12])for(const yy of [4.68,5.21])
    b.pipe(m.iron,[x-.95,yy,z+dz],[-8.03,yy,z+dz],.026,11);
  for(const dz of [-1.05,1.20]) {
    const zz=z+dz;
    b.box(m.iron,x,4.24,zz,.84,.18,1.49,.021);
    b.box(m.gunMetal,x,5.38,zz,.91,2.22,1.57,.063);
    b.box(m.black,x-.475,5.43,zz,.067,1.77,1.22,.033);
    b.box(m.iron,x-.503,5.42,zz,.056,1.66,1.10,.029);
    for(let row=0;row<12;row++)
      b.box(m.gunMetal,x-.539,4.72+row*.125,zz,.122,.053,1.07,.008,[0,0,-.52],false);
    for(const side of [-1,1]) {
      b.box(m.bronze,x-.513,5.43,zz+side*.572,.041,1.69,.040,.008);
      b.box(m.iron,x-.04,6.54,zz+side*.633,.94,.15,.15,.029);
    }
    b.tube(m.iron,[[x,6.54,zz],[x,7.20,zz],[x-.015,7.91,zz],[x+.13,8.47,zz],
      [x+.64,8.84,zz],[x+1.05,8.89,zz]],.237,30,24);
    for(const yy of [6.83,7.76]) {
      b.pipe(m.black,[x,yy-.037,zz],[x,yy+.037,zz],.275,24);
      b.box(m.gunMetal,x+.36,yy,zz,.65,.069,.13,.013);
    }
  }
  const plate=decal(stenciled('VENT. 02',{ink:'#e1cba2',sub:'LOCK OUT BEFORE SERVICE',aspect:2.88,seed:294}),.96,true);
  b.add(new T.PlaneGeometry(1.15,.41),plate,[x-.463,6.27,z+1.20],[0,-Math.PI/2,0],false);
  const ladderZ=z+2.05;
  for(const dz of [-.23,.23]){
    b.pipe(m.iron,[x-.76,4.18,ladderZ+dz],[x-.76,8.79,ladderZ+dz],.037,11);
    b.tube(m.iron,[[x-.76,8.77,ladderZ+dz],[x-.74,9.10,ladderZ+dz],[x-.46,9.30,ladderZ+dz],
      [x+.18,9.29,ladderZ+dz],[x+.39,8.97,ladderZ+dz]],.037,16,11);
  }
  for(let y=4.39;y<9.0;y+=.291)
    b.pipe(m.iron,[x-.75,y,ladderZ-.23],[x-.75,y,ladderZ+.23],.024,10);
  for(const y of [4.48,6.11,7.93])
    b.pipe(m.rust,[x-.74,y,ladderZ],[-7.96,y,ladderZ],.043,10);
}

export function buildPlant(scene,b,m) {
  const amber=new T.Color(2.15,.53,.098), fault=new T.Color(1.83,.105,.032);
  const ready=new T.Color(.20,1.28,.91), idle=new T.Color(.15,.19,.16);
  const indicators=[];
  function stack(x,y,z,side,zone) {
    b.box(m.iron,x,y-.20,z,.25,.13,.24,.020);
    b.box(m.black,x,y,z,.161,.36,.14,.019);
    b.box(m.gunMetal,x,y+.185,z,.187,.062,.20,.012);
    for(const offset of [-.047,.047]) {
      b.pipe(m.rubber,[x+offset,y-.19,z],[x+offset,y-.39,z],.014,8);
      b.pipe(m.iron,[x+offset,y-.395,z],[x+offset,y-.53,z],.013,8);
    }
    const mat=new T.MeshBasicMaterial();
    place(scene,new T.BoxGeometry(.103,.255,.069),mat,x,y,z+side*.066);
    for(const yy of [-.119,-.049,.049,.119])
      b.box(m.black,x,y+yy,z+side*.105,.156,.016,.025,.004,undefined,false);
    let light=null;
    if(zone===1&&(z===2.85||z===-14.88)||zone===2&&x>0) {
      light=new T.PointLight(0xff5324,0,5.8,2);
      light.position.set(x-.19,y-.08,z+.21);
      scene.add(light);
    }
    indicators.push({mat,zone,z,light});
  }
  stack(-3.93,2.49,16.78,1,0);
  stack(.67,2.33,13.78,1,0);
  for(const [x,y,z] of [[-2.91,3.12,8.57],[3.19,2.91,2.85],[3.32,2.91,-6.03],[-6.58,2.68,-9.64],[3.35,2.91,-14.88],[-1.47,4.27,-20.77]])
    stack(x,y,z,1,1);
  for(const [x,y,z] of [[4.54,2.65,-26.72],[-4.40,2.65,-26.72],[7.36,2.31,-28.15],[overlook.x,1.55,overlook.z-.11]])
    stack(x,y,z,1,z<-27?3:2);

  // Overhead service crane: runway, split box girders, trolley and parked sling.
  const z=-5.86;
  for(const x of [-7.02,5.62]) {
    b.box(m.iron,x,5.95,-6.78,.22,.33,31.1,.019);
    b.box(m.rust,x,6.14,-6.78,.09,.072,31.1,.012);
    for(let dz=7.38;dz>-20.6;dz-=4.6) {
      b.box(m.gunMetal,x,5.86,dz,.37,.28,.64,.024);
      b.pipe(m.iron,[x,5.69,dz],[x+Math.sign(x)*.44,5.41,dz],.073,8);
    }
  }
  for(const dz of [-.47,.47]) {
    const zz=z+dz;
    b.box(m.orange,-.70,6.39,zz,12.79,.52,.24,.033);
    for(const yy of [6.124,6.655]) b.box(m.iron,-.70,yy,zz,12.85,.086,.39,.014);
    for(let x=-6.84;x<5.63;x+=.89) {
      b.box(m.iron,x,6.39,zz,.071,.52,.27,.009,undefined,false);
      b.pipe(m.iron,[x+.10,6.44,zz+.12],[x+.10,6.44,zz+.15],.025,8,.025,false);
    }
  }
  for(const x of [-6.91,5.43]) {
    b.box(m.gunMetal,x,6.21,z,.43,.32,1.66,.041);
    for(const dz of [-.51,.51]) b.pipe(m.iron,[x-.30,6.14,z+dz],[x+.30,6.14,z+dz],.18,17);
  }
  b.box(m.iron,-3.62,6.74,z,1.60,.24,1.44,.039);
  b.box(m.gunMetal,-3.62,6.60,z,.83,.38,1.02,.035);
  b.pipe(m.iron,[-4.24,6.73,z],[-3.51,6.73,z],.199,21);
  for(const dx of [-.13,.13])
    b.pipe(m.black,[-3.63+dx,6.46,z],[-3.62+dx,4.82,z+.044],.014,8);
  b.box(m.orange,-3.62,4.78,z+.044,.38,.215,.29,.026);
  b.add(new T.TorusGeometry(.126,.026,10,32,Math.PI*1.50),m.iron,[-3.62,4.61,z+.04],[0,0,-.70]);
  const id=decal(stenciled('MK 02',{ink:'#e1bf84',sub:'RUNWAY 18 t',aspect:3.5,seed:602}),1,true);
  b.add(new T.PlaneGeometry(1.54,.36),id,[1.10,6.378,z+.606],undefined,false);

  // Gauge facing the operator. The pressure needle uses the same state as the gate.
  const x=-3.76,y=2.03,gz=-25.54;
  b.box(m.iron,x,y,gz,.52,.56,.24,.031);
  b.pipe(m.gunMetal,[x,y,gz+.105],[x,y,gz+.217],.223,36,.235);
  const dial=canvasMap(384,384,(ctx,w,h)=>{
    ctx.fillStyle='#c3c0a7';ctx.fillRect(0,0,w,h);
    ctx.translate(w*.5,h*.5);
    for(let k=0;k<=30;k++) {
      const a=(-135+k*9)*Math.PI/180;
      const dx=Math.sin(a),dy=-Math.cos(a);
      ctx.strokeStyle=k>=24?'#8a331f':'#26302b';
      ctx.lineWidth=k%5===0?5:2;
      ctx.beginPath();ctx.moveTo(dx*174,dy*174);ctx.lineTo(dx*(k%5===0?145:157),dy*(k%5===0?145:157));ctx.stroke();
      if(k%5!==0)continue;
      ctx.font='bold 22px monospace';ctx.fillStyle='#28322b';ctx.textAlign='center';
      ctx.fillText(String(k),dx*121,dy*121+8);
    }
    ctx.font='bold 20px monospace';ctx.fillText('MPa',0,78);
  });
  b.add(new T.CircleGeometry(.204,44),new T.MeshStandardMaterial({map:dial,roughness:.79}),[x,y,gz+.220],undefined,false);
  const needle=new T.Group();
  needle.position.set(x,y,gz+.225);
  place(needle,new T.BoxGeometry(.013,.165,.008),m.rust,0,.063,0);
  place(needle,cylGeo(.025,.018,18),m.iron,0,0,.003).rotation.x=Math.PI/2;
  scene.add(needle);
  b.tube(m.bronze,[[x,y-.25,gz+.071],[x,y-.56,gz+.071],[x+.09,y-.69,gz+.064],
    [x+.27,y-.72,gz+.046],[x+.42,y-.86,gz+.011],[x+.42,.77,gz-.06]],.026,24,9);

  return function update(run,state,motion) {
    const warning=run.entered&&run.kills<run.drones.length;
    for(const {mat,zone,z,light} of indicators) {
      const pulse=motion?.84:.49+.51*(.5+.5*Math.cos((run.time+z*.019)*6.4))**2;
      if(zone===0) mat.color.copy(run.entryAt===null?amber:ready).multiplyScalar(run.entryAt===null?pulse:1);
      if(zone===1) mat.color.copy(warning?fault:run.relayOn?ready:idle).multiplyScalar(warning?pulse:1);
      if(zone===2) mat.color.copy(state.surge>.04?amber:run.relief?ready:idle).multiplyScalar(state.surge>.04?pulse:1);
      if(zone===3) mat.color.copy(run.relief?ready:idle);
      if(light) {
        const active=zone===1?warning:state.surge>.04;
        light.color.setHex(active?0xff471e:0x6dd6b5);
        light.intensity=active?(zone===1?13:22)*pulse:run.relayOn?2.1:0;
      }
    }
    const p=T.MathUtils.clamp(.07+state.pressure*.83,0,1);
    needle.rotation.z=(135-270*p)*Math.PI/180+state.surge*Math.sin(run.time*23)*.09;
  };
}
