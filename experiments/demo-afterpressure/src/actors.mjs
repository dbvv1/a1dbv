import * as T from 'three';
import { canvasMap, place, random, v3 } from './art.mjs';

export function effects(scene,materials) {
  const rng = random(68836);
  const limit = 320;
  const positions = new Float32Array(limit * 3);
  const tint = new Float32Array(limit * 3);
  const sizes = new Float32Array(limit);
  const velocities=new Float32Array(limit*3);
  const particles = Array.from({length:limit},() => ({ p:v3(), v:v3(), life:0, start:0, warm:0 }));
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position',new T.BufferAttribute(positions,3).setUsage(T.DynamicDrawUsage));
  geometry.setAttribute('velocity',new T.BufferAttribute(velocities,3).setUsage(T.DynamicDrawUsage));
  geometry.setAttribute('tint',new T.BufferAttribute(tint,3).setUsage(T.DynamicDrawUsage));
  geometry.setAttribute('pointSize',new T.BufferAttribute(sizes,1).setUsage(T.DynamicDrawUsage));
  const material = new T.ShaderMaterial({
    transparent:true, blending:T.AdditiveBlending, depthWrite:false,
    vertexShader:`
      attribute float pointSize;
      attribute vec3 velocity;
      varying vec2 axis;
      attribute vec3 tint;
      varying vec3 col;
      void main() {
        vec4 p = modelViewMatrix * vec4(position,1.);
        gl_Position = projectionMatrix * p;
        gl_PointSize = max(0.,pointSize / max(.1,-p.z));
        col = tint;
        vec2 delta=(mat3(modelViewMatrix)*velocity).xy;
        axis=normalize(delta+vec2(.00001));
      }`,
    fragmentShader:`
      varying vec3 col;
      varying vec2 axis;
      void main() {
        vec2 xy=gl_PointCoord-.5;
        vec2 q=vec2(dot(xy,axis),dot(xy,vec2(-axis.y,axis.x)));
        float head=length(xy*2.5);
        float trail=length(q*vec2(2.90,11.8));
        float w=exp(-trail*trail*3.3)*exp(-abs(q.x)*3.2);
        gl_FragColor=vec4(col,exp(-head*head*9.)*.67+w*.66);
      }`
  });
  const sparks = new T.Points(geometry,material);
  sparks.frustumCulled = false;
  scene.add(sparks);

  const cool = new T.MeshBasicMaterial({ color: new T.Color(2.2,6.2,5.1), transparent: true, depthWrite:false, blending:T.AdditiveBlending });
  const rods = Array.from({length:16},(_,i) => {
    const g = new T.Mesh(new T.CylinderGeometry(.013,.009,1,6), cool.clone());
    g.visible = false;
    scene.add(g);
    return {mesh:g,life:0,from:v3(),direction:v3(),length:0};
  });
  let next = 0, nextTrace = 0, nextPrint = 0, nextSmoke = 0;
  const axis = v3(0,1,0);
  const muzzle = new T.PointLight(0xffb475,0,5.1,2);
  const strike=new T.PointLight(0xff8847,0,3.25,2);
  scene.add(muzzle,strike);
  const flare=canvasMap(128,128,(c,w,h)=>{
    const glow=c.createRadialGradient(64,64,3,64,64,64);
    for(const [at,color] of [[0,'#fffefa'],[.12,'#ffeac7d9'],[.40,'#ffc98160'],[1,'#e17e3800']])
      glow.addColorStop(at,color);
    c.fillStyle=glow;c.fillRect(0,0,w,h);
  });
  const aura=new T.Sprite(new T.SpriteMaterial({map:flare,color:new T.Color(5.1,4.3,3.0),
    transparent:true,depthWrite:false,blending:T.AdditiveBlending}));
  scene.add(aura);
  aura.visible=false;
  const smokeMap=canvasMap(128,128,(c,w,h)=>{
    const fog=c.createRadialGradient(w*.47,h*.48,3,w*.50,h*.51,w*.48);
    fog.addColorStop(0,'#e5d9cd88');fog.addColorStop(.39,'#bbaca178');fog.addColorStop(1,'#919a8d00');
    c.fillStyle=fog;c.fillRect(0,0,w,h);
    c.globalCompositeOperation='destination-out';
    for(let i=0;i<380;i++){
      const s=1.5+rng()*5.5;c.fillStyle='rgba(0,0,0,.085)';
      c.beginPath();c.arc(rng()*w,rng()*h,s,0,Math.PI*2);c.fill();
    }
  });
  const scorchMap=canvasMap(128,128,(c,w,h)=>{
    const g=c.createRadialGradient(w*.50,h*.49,2,w*.50,h*.50,w*.47);
    g.addColorStop(0,'#100d0ef5');g.addColorStop(.34,'#211a17c5');g.addColorStop(.51,'#46302170');g.addColorStop(1,'#472e2400');
    c.fillStyle=g;c.fillRect(0,0,w,h);
    c.globalCompositeOperation='destination-out';
    for(let i=0;i<1300;i++) c.fillRect(rng()*w,rng()*h,1+rng()**4*5,1+rng()**4*5);
  });
  const printMesh=new T.PlaneGeometry(1,1);
  const printNormal=v3(0,0,1);
  const marks=Array.from({length:32},()=>{
    const mesh=place(scene,printMesh,new T.MeshBasicMaterial({map:scorchMap,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));
    mesh.visible=false;
    return mesh;
  });
  const vapors=Array.from({length:21},()=>{
    const sprite=new T.Sprite(new T.SpriteMaterial({map:smokeMap,transparent:true,depthWrite:false}));
    sprite.visible=false;
    scene.add(sprite);
    return {sprite,life:0,max:0,size:0};
  });
  const chipCount=56;
  const chips=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),materials.gunMetal,chipCount);
  chips.instanceMatrix.setUsage(T.DynamicDrawUsage);
  chips.frustumCulled=false;
  chips.visible=false;
  scene.add(chips);
  const debris=Array.from({length:chipCount},()=>({position:v3(),velocity:v3(),rotation:v3(),size:0,life:0}));
  const chipPose=new T.Object3D(),bounce=v3();
  let flash=0,strikeTime=0,strikePower=0,nextChip=0;
  function throwChips(point,count,direction,energy,scale) {
    chips.visible=true;
    for(let i=0;i<count;i++) {
      const part=debris[nextChip++%chipCount];
      part.position.set(point.x,point.y+.026,point.z);
      part.velocity.set((rng()-.5)*energy,1+rng()*energy*.65,(rng()-.5)*energy)
        .addScaledVector(direction,energy*(.19+.20*rng()));
      part.rotation.set(rng()*6.3,rng()*6.3,rng()*6.3);
      part.size=(.011+rng()**2*.031)*scale;
      part.life=.72+rng()*.66;
    }
  }
  function light(point,color,power) {
    strike.position.set(point.x,point.y,point.z);
    strike.color.setHex(color);
    strikePower=power;
    strikeTime=.124;
  }
  return {
    impact(end,surface,normal,ray,power=0) {
      if(surface==='air')return;
      const stain=marks[nextPrint++%marks.length];
      const n=v3(normal.x,normal.y,normal.z);
      stain.position.set(end.x,end.y,end.z).addScaledVector(n,.006);
      stain.quaternion.setFromUnitVectors(printNormal,n);
      stain.rotateZ(rng()*6.283);
      stain.visible=surface!=='water';
      stain.scale.setScalar((surface==='concrete'?.22:.125)*(power>25?1.25:1));
      const metal=surface==='metal';
      bounce.copy(n);
      if(metal&&ray)bounce.set(ray.x,ray.y,ray.z).reflect(n).lerp(n,.27).normalize();
      this.burst(stain.position,metal?28:14,metal?1:0,surface==='water'?2.6:6.2,bounce);
      this.smoke(stain.position,surface==='water'?.31:metal?.14:.36,metal?.31:.67);
      if(metal) light(stain.position,0xf79042,power>25?16:8);
    },
    contact(event) {
      const {end,part,kind,ray}=event;
      const failed=kind==='kill',optic=part==='optic';
      bounce.set(ray.x,ray.y,ray.z).multiplyScalar(failed?.88:-1);
      this.burst(end,failed?47:optic?31:16,optic?0:1,failed?8.3:7.0,bounce);
      light(end,optic?0x7adfeb:0xff8c44,failed?23:optic?17:7);
      if(failed) {
        throwChips(end,15,bounce,7.8,1);
        this.smoke(end,.56,1.38);
      } else if(optic) {
        this.smoke(end,.17,.43);
      }
    },
    smoke(p,size,length) {
      const o=vapors[nextSmoke++%vapors.length];
      o.life=o.max=length;
      o.size=size;
      o.sprite.position.set(p.x,p.y,p.z);
      o.sprite.visible=true;
      o.sprite.material.rotation=rng()*6.28;
    },
    flashAt(p) {
      flash = .064;
      muzzle.position.copy(p);
      aura.position.copy(p);
      aura.material.rotation=rng()*Math.PI;
      this.burst(p,8,1,3.8);
    },
    burst(p, count, heat, energy, direction) {
      for (let i = 0; i < count; i++) {
        const dot = particles[next++ % limit];
        dot.p.set(p.x,p.y,p.z);
        dot.v.set((rng() - .5) * energy, rng() * energy * .67, (rng() - .5) * energy);
        if(direction)dot.v.addScaledVector(direction,energy*(.36+rng()*.54));
        dot.life = dot.start = .12 + rng() * .64;
        dot.warm = heat;
      }
    },
    beam(from, to) {
      const r = rods[nextTrace++ % rods.length];
      r.from.copy(from);
      r.direction.set(to.x-from.x,to.y-from.y,to.z-from.z);
      r.length=r.direction.length();
      r.mesh.quaternion.setFromUnitVectors(axis,r.direction.normalize());
      r.life=.073;
    },
    update(dt) {
      flash = Math.max(0, flash - dt);
      strikeTime=Math.max(0,strikeTime-dt);
      strike.intensity=(strikeTime/.124)**2*strikePower;
      muzzle.intensity = (flash/.064)**2*56;
      aura.visible = Boolean(flash);
      aura.material.opacity = Math.min(1, flash * 18);
      aura.scale.setScalar(.23+flash*2.48);
      for (const r of rods) {
        if (!r.life) continue;
        r.life = Math.max(0, r.life-dt);
        const tip=(.073-r.life)*231+1.46;
        const start=Math.max(0,tip-4.6), end=Math.min(tip,r.length);
        r.mesh.visible=Boolean(r.life&&end>start);
        r.mesh.material.opacity=.69*(r.life/.073);
        r.mesh.position.copy(r.from).addScaledVector(r.direction,(start+end)*.5);
        r.mesh.scale.set(.66,Math.max(.001,end-start),.66);
      }
      for (let i = 0; i < limit; i++) {
        const dot = particles[i];
        dot.life = Math.max(0,dot.life-dt);
        if (dot.life) {
          dot.p.addScaledVector(dot.v,dt);
          dot.v.y -= 8.45 * dt;
          if (dot.p.y < .024) {
            dot.p.y = .025;
            dot.v.multiplyScalar(.56);
            dot.v.y *= -1;
          }
        }
        const q = dot.life / Math.max(.001,dot.start);
        const k=i*3;
        positions[k]=dot.p.x;positions[k+1]=dot.p.y;positions[k+2]=dot.p.z;
        velocities[k]=dot.v.x;velocities[k+1]=dot.v.y;velocities[k+2]=dot.v.z;
        tint[k]=q*(dot.warm?4.5:.9);tint[k+1]=q*(dot.warm?1.4:2.65);tint[k+2]=q*(dot.warm?.26:3.3);
        sizes[i] = dot.life ? 16 + 26*q : 0;
      }
      for (const v of vapors) {
        if (!v.life) continue;
        v.life = Math.max(0,v.life-dt);
        const age = 1-v.life/v.max;
        v.sprite.visible=Boolean(v.life);
        v.sprite.position.y += dt*.31;
        v.sprite.position.x += dt*.12;
        v.sprite.scale.setScalar(v.size*(.46+age*2.28));
        v.sprite.material.opacity = Math.sin(Math.PI*age)*.56;
      }
      let chipsActive=false;
      for(let i=0;chips.visible&&i<chipCount;i++) {
        const piece=debris[i];
        if(piece.life) {
          piece.life=Math.max(0,piece.life-dt);
          piece.velocity.y-=dt*9.81;
          piece.position.addScaledVector(piece.velocity,dt);
          if(piece.position.y<.035) {
            piece.position.y=.035;
            piece.velocity.multiplyScalar(.57);
            piece.velocity.y*=-.58;
          }
          piece.rotation.y+=dt*9;piece.rotation.x+=dt*6.1;
        }
        if(piece.life)chipsActive=true;
        chipPose.position.copy(piece.position);
        chipPose.rotation.setFromVector3(piece.rotation);
        const size=piece.size*Math.min(1,piece.life*8);
        chipPose.scale.set(size*.63,size,size*.43);
        chipPose.updateMatrix();
        chips.setMatrixAt(i,chipPose.matrix);
      }
      if(chipsActive)chips.instanceMatrix.needsUpdate=true;
      chips.visible=chipsActive;
      for (const attribute of Object.values(geometry.attributes)) attribute.needsUpdate = true;
      return flash * 10;
    },
    reset() {
      flash = 0;
      strikeTime=0;
      muzzle.intensity=strike.intensity=0;
      aura.visible=false;
      for(const part of debris)part.life=0;
      chips.visible=false;
      for (const particle of particles) particle.life = 0;
      for (const mark of marks) mark.visible = false;
      for (const v of vapors) { v.life = 0; v.sprite.visible = false; }
      for (const r of rods) {
        r.life = 0;
        r.mesh.visible = false;
      }
    }
  };
}

