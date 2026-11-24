import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { skin } from './cinematic-assets.js';

const {lerp,clamp,smoothstep}=T.MathUtils;
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const UP=V(0,1,0);

function skinTube(parent,material,rows,sides=16){
  const geometry=new T.BufferGeometry();
  const position=new T.BufferAttribute(new Float32Array((rows+1)*(sides+1)*3),3);
  position.setUsage(T.DynamicDrawUsage);
  const uv=[],index=[];
  for(let row=0;row<=rows;row++)for(let i=0;i<=sides;i++){
    const a=row*(sides+1)+i,b=a+sides+1;
    uv.push(i/sides,row/rows);
    if(row<rows&&i<sides)index.push(a,a+1,b,a+1,b+1,b);
  }
  geometry.setAttribute('position',position);
  geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  geometry.setIndex(index);
  const object=new T.Mesh(geometry,material);
  object.frustumCulled=false;
  parent.add(object);
  const cosine=Array.from({length:sides+1},(_,i)=>Math.cos(i/sides*2*Math.PI));
  const sine=cosine.map((_,i)=>Math.sin(i/sides*2*Math.PI));
  return {ring(row,center,a,b,width,height,ripple){
    for(let i=0;i<=sides;i++){
      const shape=ripple?ripple(i/sides*2*Math.PI):1;
      const x=width*cosine[i]*shape,y=height*sine[i]*shape;
      position.setXYZ(row*(sides+1)+i,center.x+a.x*x+b.x*y,center.y+a.y*x+b.y*y,center.z+a.z*x+b.z*y);
    }
  },flush(){
    position.needsUpdate=true;
    geometry.computeVertexNormals();
    // Both UV edges share a single surface normal.
    const n=geometry.attributes.normal;
    for(let j=0;j<=rows;j++){
      const i=j*(sides+1),end=i+sides;
      const x=n.getX(i)+n.getX(end),y=n.getY(i)+n.getY(end),z=n.getZ(i)+n.getZ(end);
      const scale=1/(Math.hypot(x,y,z)||1);
      n.setXYZ(i,x*scale,y*scale,z*scale);n.setXYZ(end,x*scale,y*scale,z*scale);
    }
    n.needsUpdate=true;
  }};
}

function inset(parent,material,xyz,scale,rotation){
  const panel=new T.Mesh(new T.SphereGeometry(1,20,12),material);
  panel.position.fromArray(xyz);panel.scale.fromArray(scale);
  if(rotation)panel.rotation.set(...rotation);
  parent.add(panel);return panel;
}

export function sleeve(parent,side,material){
  const rows=32,tube=skinTube(parent,material,rows,24);
  const wrist=V(),back=V(),elbow=V(),shoulder=V(),point=V(),tangent=V(),reference=V(),a=V(),b=V();
  const cuffX=V(),cuffY=V(),across=V(),elbowDown=V(),line=V(),forearm=V(),join=V();
  return {pose(hand,anchor,reach,body){
    wrist.set(side*.004,-.004,.105).applyQuaternion(hand.quaternion).add(hand.position);
    cuffX.set(1,0,0).applyQuaternion(hand.quaternion);
    cuffY.set(0,1,0).applyQuaternion(hand.quaternion);
    back.set(0,0,1).applyQuaternion(hand.quaternion);
    shoulder.copy(anchor);
    line.copy(shoulder).sub(wrist);
    const dist=line.length();line.multiplyScalar(1/Math.max(.01,dist));
    elbowDown.set(side*(.66+body*.15),-1,.12);
    elbowDown.addScaledVector(line,-elbowDown.dot(line)).normalize();
    const bend=Math.sqrt(Math.max(.011,(.49+reach*.08)**2-(dist*.55)**2));
    elbow.copy(wrist).lerp(shoulder,.53).addScaledVector(elbowDown,bend*.76);
    forearm.copy(elbow).sub(wrist).normalize();
    across.copy(shoulder).sub(elbow).normalize();
    join.copy(across).add(forearm).normalize();
    for(let j=0;j<=rows;j++){
      const t=j/rows,blend=smoothstep(t,0,.18);
      const lower=t<.55,f=lower?t/.55:(t-.55)/.45;
      point.copy(lower?wrist:elbow).lerp(lower?elbow:shoulder,f);
      point.addScaledVector(elbowDown,.027*Math.sin(Math.PI*f));
      // Hold the first few millimetres in the wrist frame and open into the sleeve.
      point.lerp(reference.copy(wrist).addScaledVector(back,.55*t),1-blend);
      tangent.copy(lower?forearm:across).lerp(join,1-smoothstep(Math.abs(t-.55),0,.17)).normalize();
      a.crossVectors(UP,tangent).normalize().lerp(cuffX,1-blend).normalize();
      b.crossVectors(tangent,a).normalize().lerp(cuffY,1-blend).normalize();
      const band=Math.exp(-((t-.083)**2)*1670),roll=Math.exp(-((t-.125)**2)*810);
      const bulk=smoothstep(t,.075,.48);
      const width=lerp(.033,.072,bulk)+band*.007+roll*.004+smoothstep(t,.62,1)*.026;
      const height=lerp(.025,.055,bulk)+band*.006+roll*.005+smoothstep(t,.60,1)*.025;
      tube.ring(j,point,a,b,width,height,theta=>{
        const wristFold=Math.exp(-((t-.21)**2)*48)*(1-.63*reach);
        const elbowFold=Math.exp(-((t-.54)**2)*41);
        return 1+.19*wristFold*Math.cos(44*t+theta*2+.9*Math.sin(theta))+
          .13*elbowFold*Math.cos(33*t-theta*3)+.055*blend*Math.sin(theta*5+t*10);
      });
    }
    tube.flush();
  }};
}

export function handOrientation(forward,dorsal){
  const z=V().copy(forward).normalize().negate();
  const x=V().crossVectors(dorsal,z).normalize();
  const y=V().crossVectors(z,x).normalize();
  return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z));
}

export function playerBody(scene,art,groundAt){
  const root=new T.Group();scene.add(root);
  const fabric=skin(new T.MeshStandardMaterial({color:0x758784,roughness:.88}),art.fabric,{detail:1.05,color:.25,uv:true});
  const canvas=skin(new T.MeshPhysicalMaterial({color:0x7a8f8c,roughness:.86,sheen:.66,sheenColor:0x77918b}),art.fabric,{detail:1.24,color:.25,uv:true});
  canvas.onBeforeCompile=shader=>{
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`
      #include <color_fragment>
      vec2 uv=vMapUv;
      float quilt=abs(fract(uv.y*4.6+.16*abs(sin(uv.x*6.283)))-.5);
      float welt=smoothstep(.392,.476,quilt);
      float binding=1.-smoothstep(.013,.025,abs(uv.x-.25));
      diffuseColor.rgb*=1.-welt*.27-binding*.24;
    `);
  };
  const kneePad=new T.MeshStandardMaterial({color:0x3a4140,roughness:.74});
  const sole=new T.MeshStandardMaterial({color:0x202822,roughness:.94});
  const bootShell=new T.MeshStandardMaterial({color:0x6d6550,roughness:.69});
  const webbing=new T.MeshStandardMaterial({color:0x827862,roughness:.80});
  function box(parent,material,x,y,z,w,h,d,r){
    const piece=new T.Mesh(new RoundedBoxGeometry(w,h,d,2,r),material);
    parent.add(piece);piece.position.set(x,y,z);return piece;
  }
  const coat=skinTube(root,canvas,20,24),cross=V(1,0,0),depthAxis=V(0,0,-1),coatPoint=V();
  for(let row=0;row<=20;row++){
    const t=row/20,y=.81+t*.57;
    const cap=Math.max(.009,1-smoothstep(t,.84,1));
    const front=(.111+.037*smoothstep(t,.23,.57))*cap,w=(.174+.053*smoothstep(t,.20,.85))*cap;
    coat.ring(row,coatPoint.set(0,y,.165+t*.022),cross,depthAxis,w,front,theta=>{
      const ease=smoothstep(t,.08,.34)*(1-smoothstep(t,.75,1));
      return 1+ease*(.075*Math.sin(theta*6+t*13)+.032*Math.sin(theta*3-t*20));
    });
  }
  coat.flush();
  inset(root,fabric,[0,.924,.160],[.192,.095,.134]);
  box(root,kneePad,0,.936,.025,.299,.037,.048,.013);
  box(root,webbing,0,.936,-.006,.069,.037,.025,.007);
  const ankle=V(),hip=V(),knee=V(),point=V(),tangent=V(),a=V(),b=V(),joint=V();
  const axis=V(1,0,0),front=V(0,0,-1),local=V(),world=V(),travel=V(),pole=V();
  const count=23;
  const legs=[-1,1].map(side=>{
    const boot=new T.Group();root.add(boot);
    box(boot,sole,0,.039,-.083,.144,.077,.299,.037);
    box(boot,bootShell,0,.089,-.086,.132,.089,.272,.038);
    inset(boot,bootShell,[0,.152,.019],[.063,.116,.079],[-.12,0,0]);
    inset(boot,kneePad,[0,.075,-.183],[.061,.023,.045],[-.23,0,0]);
    for(let i=0;i<4;i++){
      const laces=box(boot,webbing,0,.135+i*.013,-.084+i*.022,.082,.008,.013,.003);
      laces.rotation.z=i%2?.17:-.17;
    }
    for(const sh of [-1,1])for(let i=0;i<5;i++)box(boot,kneePad,sh*.062,.034,.021-i*.045,.024,.035,.025,.004);
    const pad=new T.Group();root.add(pad);
    inset(pad,kneePad,[0,0,0],[.075,.101,.038]);
    inset(pad,sole,[0,.012,-.017],[.060,.087,.028],[-.10,0,side*.16]);
    inset(pad,webbing,[side*.047,.024,-.015],[.016,.044,.022],[0,side*.105,-side*.31]);
    return {side,boot,pad,surface:skinTube(root,fabric,count,20),foot:V(),from:V(),to:V(),yaw:0,fromYaw:0,toYaw:0};
  });
  root.traverse(object=>object.layers.set(1));
  let initialized=false,swinging=null,progress=0,air=0,turn=0,duration=.17,settle=0,pelvis=0,stance=0,next=0;
  const contact=V();
  function footTarget(leg,p,yaw,advance=0){
    const lateral=leg.side*.122;
    world.set(p.x+Math.cos(yaw)*lateral-Math.sin(yaw)*advance,0,
      p.z-Math.sin(yaw)*lateral-Math.cos(yaw)*advance);
    world.y=groundAt(world.x,world.z,p.y);return world;
  }
  function plant(leg,p,yaw,advance){
    leg.foot.copy(footTarget(leg,p,yaw,advance));leg.yaw=yaw;
  }
  const sample={foot:0,contact,yaw:0,weight:0,compression:0};
  return {root,reset(){initialized=false;swinging=null;air=settle=pelvis=stance=0;next=0;},update(dt,player,pace,sprint,landing){
    const {p,yaw,grounded}=player;
    sample.foot=0;
    const speed=Math.hypot(player.vx,player.vz);
    travel.set(player.vx,0,player.vz);
    root.position.copy(p);
    if(!initialized){
      for(const leg of legs)plant(leg,p,yaw,leg.side*.056);
      turn=yaw;
      initialized=true;
    }
    turn+=Math.atan2(Math.sin(yaw-turn),Math.cos(yaw-turn))*(1-Math.exp(-dt*(speed>2?13:8)));
    root.rotation.y=turn;
    if(!grounded){
      swinging=null;air+=dt;
      for(const leg of legs){
        const target=footTarget(leg,p,turn,-.11+leg.side*.116);
        target.y=p.y+.12*smoothstep(air,.03,.19)+leg.side*.038;
        leg.foot.lerp(target,1-Math.exp(-dt*20));leg.yaw=turn;
      }
    }else{
      if(air>0){
        for(const leg of legs)plant(leg,p,turn,.12+leg.side*.092);
        settle=.083;
        air=0;
      }
      if(swinging){
        progress=Math.min(1,progress+dt/duration);
        swinging.foot.copy(swinging.from).lerp(swinging.to,smoothstep(progress,0,1));
        swinging.foot.y+=Math.sin(progress*Math.PI)**1.38*(sprint?.169:.115);
        swinging.yaw=swinging.fromYaw+Math.atan2(Math.sin(swinging.toYaw-swinging.fromYaw),Math.cos(swinging.toYaw-swinging.fromYaw))*progress;
        if(progress===1){
          if(speed>.36){
            sample.foot=swinging.side;sample.yaw=swinging.yaw-swinging.side*.11;
            contact.copy(swinging.foot);
          }
          stance=swinging.side;
          next=swinging.side<0?1:0;
          swinging=null;
        }
      }else{
        const preferred=legs[next];
        let largest=speed>.38?(sprint?.37:.25):.31;
        for(const leg of legs){
          const target=footTarget(leg,p,turn,leg.side*.044);
          const shift=Math.hypot(target.x-leg.foot.x,target.z-leg.foot.z)+(leg===preferred&&speed>.38?.096:0);
          if(shift>largest){largest=shift;swinging=leg;}
        }
        if(swinging){
          duration=lerp(.275,.151,smoothstep(speed,.40,6.6));
          swinging.from.copy(swinging.foot);swinging.fromYaw=swinging.yaw;
          swinging.to.copy(footTarget(swinging,p,turn,swinging.side*.064));
          swinging.to.addScaledVector(travel,duration+.058);
          swinging.to.y=groundAt(swinging.to.x,swinging.to.z,p.y);
          swinging.toYaw=turn;progress=0;
        }
      }
    }
    settle*=Math.exp(-dt*13);
    pelvis+=(stance*pace-pelvis)*(1-Math.exp(-dt*13));
    const compression=Math.max(settle,landing*.72);
    sample.weight=pelvis;sample.compression=compression;
    root.position.y-=compression;
    for(const leg of legs){
      local.copy(leg.foot).sub(root.position).applyAxisAngle(UP,-turn);
      const long=Math.hypot(local.x-leg.side*.12,local.z);
      if(long>.70){local.x=lerp(leg.side*.12,local.x,.70/long);local.z*=.70/long;}
      leg.boot.position.copy(local);
      leg.boot.rotation.set(leg===swinging?Math.sin(progress*Math.PI*2)*.27:0,leg.yaw-turn-leg.side*.11,0);
      ankle.copy(local);ankle.y+=.146;ankle.z+=.027;
      hip.set(leg.side*.122+pelvis*.023,.922,.129);
      joint.copy(ankle).sub(hip);
      const reach=Math.min(.892,joint.length());joint.normalize();
      pole.set(leg.side*.28,.02,-1).addScaledVector(joint,-joint.dot(pole)).normalize();
      const thigh=.462,shank=.438;
      const middle=clamp((thigh*thigh-shank*shank+reach*reach)/(2*reach),.06,.461);
      knee.copy(hip).addScaledVector(joint,middle).addScaledVector(pole,Math.sqrt(thigh*thigh-middle*middle));
      leg.pad.position.copy(knee).addScaledVector(front,.066);
      leg.pad.rotation.x=-.07+(ankle.z-knee.z)*.81;
      for(let row=0;row<=count;row++){
        const t=row/count;
        const u=t<.48?t/.48:(t-.48)/.52;
        const lo=t<.48?ankle:knee,hi=t<.48?knee:hip;
        point.copy(lo).lerp(hi,u);
        tangent.copy(hi).sub(lo).normalize();
        a.copy(axis).addScaledVector(tangent,-axis.dot(tangent)).normalize();b.crossVectors(tangent,a).normalize();
        const width=lerp(.054,.089,smoothstep(t,.11,.96));
        const depth=lerp(.051,.093,smoothstep(t,.11,.97));
        const folds=.15*Math.exp(-((t-.47)**2)*68);
        leg.surface.ring(row,point,a,b,width,depth,theta=>1+folds*Math.sin(t*68+theta*2)+.035*Math.sin(t*20-theta*4));
      }
      leg.surface.flush();
    }
    return sample;
  }};
}

