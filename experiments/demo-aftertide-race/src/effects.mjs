import * as T from 'three';
import { nearest, smooth } from './track.mjs';
import { rng } from './world.mjs';

const LIMIT=1800;
const DUST=160;
export function makeEffects(scene) {
  const random=rng(975), marks=new Float32Array(LIMIT*18), ink=new Float32Array(LIMIT*6);
  const geom=new T.BufferGeometry();
  geom.setAttribute('position',new T.BufferAttribute(marks,3).setUsage(T.DynamicDrawUsage));
  geom.setAttribute('ink',new T.BufferAttribute(ink,1).setUsage(T.DynamicDrawUsage));
  const mat=new T.ShaderMaterial({
    transparent:true,side:T.DoubleSide,depthWrite:false,
    polygonOffset:true,polygonOffsetFactor:-2,
    vertexShader:`attribute float ink;varying float a;void main(){a=ink;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying float a;void main(){if(a<0.001) discard;gl_FragColor=vec4(.049,.041,.037,a);}`
  });
  const smear=new T.Mesh(geom,mat);smear.frustumCulled=false;scene.add(smear);
  const dg=new T.BufferGeometry(), xyz=new Float32Array(DUST*3), alpha=new Float32Array(DUST), size=new Float32Array(DUST), dirt=new Float32Array(DUST);
  for(const [key,a,n] of [['position',xyz,3],['alpha',alpha,1],['size',size,1],['dirt',dirt,1]]) dg.setAttribute(key,new T.BufferAttribute(a,n).setUsage(T.DynamicDrawUsage));
  const dust=new T.Points(dg,new T.ShaderMaterial({
    transparent:true,depthWrite:false,
    uniforms:{screen:{value:900}},
    vertexShader:`attribute float alpha; attribute float size; attribute float dirt; uniform float screen; varying float a; varying float d;void main(){vec4 p=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(screen*size/max(1.,-p.z),1.,154.);gl_Position=projectionMatrix*p;a=alpha;d=dirt;}`,
    fragmentShader:`varying float a;varying float d;void main(){vec2 p=gl_PointCoord-.5;float j=sin(p.x*20.+sin(p.y*17.)*2.)*sin(p.y*28.)*.13;float r=clamp(1.-length(p)*2.+j,0.,1.);if(a<.001||r<.005)discard;vec3 c=mix(vec3(.76,.77,.75),vec3(.67,.54,.37),d);gl_FragColor=vec4(c,r*r*a);}`
  }));
  dust.frustumCulled=false;scene.add(dust);
  const particles=Array.from({length:DUST},()=>({life:0})), prev=[null,null,null,null];
  let cursor=0,dc=0,age=0;
  function update(c,dt,pixels=900) {
    age+=dt; dust.material.uniforms.screen.value=pixels;
    if(age%0.032<dt && c.speed>2) {
      const sn=Math.sin(c.yaw),cs=Math.cos(c.yaw);
      for(let i=0;i<4;i++) {
        const w=c.wheels[i], x=c.x+w.x*cs+w.z*sn,z=c.z-w.x*sn+w.z*cs;
        const off=1-w.grip;
        const amount=Math.max(i>1?c.hand*.83:0,smooth(.078,.24,Math.abs(w.slip))*smooth(.61,.98,w.utilization));
        const signal=amount*smooth(2,12,c.speed);
        if(signal>.22) {
          const p={x,z,y:nearest(x,z)?.height??c.height,cs,sn};
          const a=prev[i];
          if(a && Math.hypot(x-a.x,z-a.z)<3.5) {
            const k=cursor*18, wd=i>1?.107:.090;
            const l=[a.x-a.cs*wd,a.y+.018,a.z+a.sn*wd],r=[a.x+a.cs*wd,a.y+.018,a.z-a.sn*wd];
            const ll=[p.x-p.cs*wd,p.y+.018,p.z+p.sn*wd],rr=[p.x+p.cs*wd,p.y+.018,p.z-p.sn*wd];
            marks.set([...l,...r,...ll,...ll,...r,...rr],k);
            ink.fill(signal*.53,cursor*6,cursor*6+6);
            cursor=(cursor+1)%LIMIT;
            geom.attributes.position.needsUpdate=geom.attributes.ink.needsUpdate=true;
          }
          prev[i]=p;
        } else prev[i]=null;
        if((signal>.24||off>.10) && i>1 && random()<.86) {
          let p=particles[dc];dc=(dc+1)%DUST;
          p.total=.78+random()*.72;p.life=p.total;p.x=x;p.y=w.height+.12;p.z=z;
          p.dx=(random()-.5)*2.3+c.worldV.x*.105;p.dz=(random()-.5)*2.3+c.worldV.z*.105;
          p.a=Math.max(off*.42,signal*.38);p.dirt=smooth(.05,.25,off);p.size=.28+random()*.18;
        }
      }
    } else if(c.speed<1) prev.fill(null);
    for(let i=0;i<DUST;i++){
      const p=particles[i];
      if(p.life<=0){alpha[i]=0;continue;}
      p.life-=dt;
      p.x+=p.dx*dt;p.z+=p.dz*dt;p.y+=dt*.34;
      xyz.set([p.x,p.y,p.z],i*3);alpha[i]=p.a*Math.max(0,p.life/p.total);size[i]=p.size+(1-p.life/p.total)*.87;dirt[i]=p.dirt;
    }
    for(const attribute of Object.values(dg.attributes)) attribute.needsUpdate=true;
  }
  return {update,clear(){
    ink.fill(0);geom.attributes.ink.needsUpdate=true;
    for(const p of particles)p.life=0;
    alpha.fill(0);dg.attributes.alpha.needsUpdate=true;prev.fill(null);
  }};
}
