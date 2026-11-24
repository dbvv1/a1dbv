import * as T from 'three';
import { lookVector, sequenceDurations } from './sim.mjs';

const vec=values=>new T.Vector3(...values);
const shot=(at,name,caption,position,end,focus,fov,aimEnd=focus)=>({
  at,name,caption,position:vec(position),end:vec(end),focus:vec(focus),aimEnd:vec(aimEnd),fov
});
const sequences={
  arrival:[
    shot(0,'北岬水电站','07 号泄洪闸卡在关闭位。下面的水位还在涨。',[-21.1,7.65,24.4],[-15.85,6.18,24.48],[-3.52,4.15,10.87],51,[-2.08,3.60,11.63]),
    shot(3.38,'检修栈桥','就近刷开检修门。去找机组旁路。',[-2.10,2.06,23.88],[-1.60,1.74,22.72],[-1.23,2.64,13.45],59,[-1.06,1.95,13.54])
  ],
  opening:[
    shot(.55,'07 号主闸','机械锁释放。闸板开始抬升。',[-3.34,1.38,-24.12],[-2.61,1.12,-25.21],[.28,1.50,-27.25],67,[.38,.46,-27.79]),
    shot(3.26,'下游泄槽','水头已过闸。等观测台确认下游流量。',[4.83,2.57,-35.58],[5.12,3.89,-38.14],[.04,-.32,-29.24],61,[.13,-.51,-29.71])
  ],
  confirmation:[
    shot(.48,'下游观测台','观测台回传正常。读数已写入值班记录。',[6.79,2.38,-33.41],[6.55,2.85,-34.63],[2.42,-.37,-43.92],62,[2.34,-.37,-44.21]),
    shot(3.04,'北岬峡谷','流量稳定。主闸切回自动控制。',[8.93,6.8,-42.92],[7.20,8.49,-45.58],[-1.58,3.35,-62.32],55,[-1.94,5.01,-69.88])
  ]
};
const smooth=T.MathUtils.smoothstep;
const target=new T.Vector3(),eye=new T.Vector3(),railEye=new T.Vector3(),playerAim=new T.Vector3();

export function sequenceCamera(camera,run,reduce,holdEnd=false) {
  const id=holdEnd?'confirmation':run.sequence;
  if(!id)return null;
  const age=holdEnd?sequenceDurations.confirmation:run.time-run.sequenceAt;
  const shots=sequences[id], length=sequenceDurations[id];
  const first=shots[0];
  const index=age>=shots[1].at?1:0;
  const current=shots[index];
  const until=index===0?shots[1].at:length;
  const p=run.player;
  let fov;
  const setPlayer=()=>{
    const v=lookVector(p.yaw,p.pitch);
    eye.set(p.x,p.y,p.z);
    playerAim.set(p.x+v.x*9,p.y+v.y*9,p.z+v.z*9);
  };
  if(age<first.at) {
    setPlayer();target.copy(playerAim);
    target.y+=reduce?0:smooth(age,0,first.at)*.20;
    fov=64;
  } else {
    const t=smooth(age,current.at,until);
    eye.copy(current.position).lerp(current.end,reduce?.12:t);
    target.copy(current.focus).lerp(current.aimEnd,reduce?.12:t);
    fov=current.fov;
    if(id==='arrival'&&index===1) {
      railEye.copy(eye);
      setPlayer();
      const land=smooth(age,5.0,6.85);
      eye.lerp(railEye,1-land);
      target.lerp(playerAim,land);
      fov=T.MathUtils.lerp(fov,64,land);
    }
  }
  const cut=reduce?0:1-smooth(Math.abs(age-shots[1].at),0,.16);
  const firstCut=first.at>0&&!reduce?1-smooth(Math.abs(age-first.at),0,.13):0;
  const returnCut=id==='opening'&&!reduce?smooth(age,length-.28,length-.035):0;
  const fadeIn=id==='arrival'&&!reduce?1-smooth(age,0,.38):0;
  camera.position.copy(eye);
  camera.lookAt(target);
  const focus=eye.distanceTo(target);
  const aperture=reduce||age<first.at?0:id==='opening'&&index===0?.88:id==='confirmation'?.30:.38;
  return { name:current.name,caption:current.caption,id,index,age,fov,focus,aperture,dip:Math.max(cut,firstCut,returnCut,fadeIn)*.94 };
}
