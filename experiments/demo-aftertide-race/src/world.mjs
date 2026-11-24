import * as T from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { frame, length, roadPoint, nearest, roadHalf, railOffset, smooth, lerp, wrap } from './track.mjs';

const TAU=Math.PI*2;
const asset=(p)=>new URL('../assets/'+p,import.meta.url).href;
const sunDir=new T.Vector3(-.61,.067,-.79).normalize();
const soil=new T.Color(0xb49871), grass=new T.Color(0x7a8247), stone=new T.Color(0xc5b092);
const maps=new Map(), pending=[];
export function rng(seed) {
  return () => { seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296; };
}
export function textureCanvas(w,h,draw) {
  const c=document.createElement('canvas');
  c.width=w; c.height=h; draw(c.getContext('2d'),w,h);
  const t=new T.CanvasTexture(c); t.colorSpace=T.SRGBColorSpace; t.anisotropy=8;
  return t;
}
function texture(name,srgb=false) {
  if(maps.has(name))return maps.get(name);
  let t;
  pending.push(new Promise((resolve,reject)=>{t=new T.TextureLoader().load(asset(name+'.jpg'),resolve,undefined,reject);}));
  t.wrapS=t.wrapT=T.RepeatWrapping; t.anisotropy=12;
  if(srgb) t.colorSpace=T.SRGBColorSpace;
  maps.set(name,t);
  return t;
}
function groundMat(key,color,normal=.6,roughness=.92) {
  return new T.MeshStandardMaterial({map:texture(key+'_diff',true),normalMap:texture(key+'_nor_gl'),
    normalScale:new T.Vector2(normal,normal),color,roughness});
}
function mesh(g,m,group) {
  const o=new T.Mesh(g,m); if(group) group.add(o); return o;
}
function buffer(vertices,uv,indices,colors) {
  const g=new T.BufferGeometry();
  g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
  if(uv) g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  if(colors) g.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  if(indices) g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}
function ribbon(mat,scene,profile,from=0,to=length,spacing=1,tile=2) {
  const vertices=[],uv=[],indices=[];
  const n=Math.ceil((to-from)/spacing), cols=profile.length;
  for(let i=0;i<=n;i++) {
    const s=lerp(from,to,i/n);
    for(const [d,h] of profile) {
      const p=roadPoint(s,d,h);
      vertices.push(p.x,p.y,p.z); uv.push(d/tile,s/tile);
    }
    if(i>0) for(let j=0;j<cols-1;j++){
      const a=(i-1)*cols+j,b=i*cols+j;
      indices.push(a,b,a+1,a+1,b,b+1);
    }
  }
  const o=mesh(buffer(vertices,uv,indices),mat,scene); o.receiveShadow=true;
  return o;
}
const coastX=z=>-57+z*.23+5*Math.sin(z*.052)+7*Math.sin(z*.019)+1.8*Math.sin(z*.30);
const coastZ=x=>-234-5*Math.sin(x*.06)-9*Math.sin(x*.02)+1.6*Math.sin(x*.24);
function landDistance(x,z) { return Math.min(x-coastX(z),z-coastZ(x)); }
function relief(x,z) {
  return 1.62*Math.sin(x*.086+z*.033)+1.08*Math.sin(x*.173-z*.14+Math.sin(z*.105))+
    .52*Math.sin(x*.43+z*.37)+.39*Math.sin(x*.63-z*.52);
}
export function terrainHeight(x,z,p=nearest(x,z,true)) {
  const land=landDistance(x,z);
  const n=relief(x,z);
  const shoulder=p?.height??0;
  const ridge=17+6*Math.sin(z*.018)+9*Math.sin(z*.008+x*.017)+12*smooth(-10,100,x);
  const hills=35*Math.exp(-(((x-171)/95)**2)-(((z-2)/167)**2))+24*Math.exp(-(((x-307)/104)**2)-(((z+169)/153)**2));
  const cliff=smooth(-3,27,land);
  let general=lerp(Math.min(-.60,land*.225),ridge+hills+n*1.36,cliff)+n*smooth(-3,9,land)*.46;
  if(land>1.2)general=Math.max(general,(land-1.2)*.15);
  if(!p) return general;
  const d=p.distance;
  if(land<landDistance(p.x,p.z)-.7) {
    const lip=shoulder+Math.max(0,d-7)*.12;
    general=Math.min(general,lerp(-1,lip,smooth(-3,15,land))+n*.62);
  } else if(d<70) {
    const rise=5+(.62+.32*Math.sin(p.s*.035))*Math.max(0,d-7);
    general=lerp(Math.min(general,shoulder+rise+n),general,smooth(22,70,d));
  }
  const near=shoulder-.14+smooth(6.5,12,d)*n*.25;
  return lerp(near,general,smooth(6.65,23,d));
}
function terrain(scene) {
  const vertices=[], uv=[], indices=[], colors=[];
  const m=groundMat('rock_3',0xe6ded4,.46,1);
  const cliffMap=texture('cliff_side_diff',true), fieldMap=texture('aerial_grass_rock_diff',true);
  m.vertexColors=true;
  m.onBeforeCompile=shader=>{
    shader.uniforms.cliffMap={value:cliffMap};shader.uniforms.fieldMap={value:fieldMap};
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 terrainP;varying vec3 terrainN;')
      .replace('#include <begin_vertex>','#include <begin_vertex>\nterrainP=position;terrainN=normal;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
      varying vec3 terrainP;varying vec3 terrainN;uniform sampler2D cliffMap;uniform sampler2D fieldMap;
      vec3 cliffTex(vec2 p,vec2 q){
        vec3 a=texture2D(cliffMap,p).rgb;
        return mix(a,texture2D(cliffMap,q).rgb,.40);
      }`).replace('#include <map_fragment>',`
      vec3 p=terrainP;vec3 n=abs(normalize(terrainN));vec3 axis=pow(n,vec3(6.));axis/=axis.x+axis.y+axis.z;
      vec3 rock=axis.x*cliffTex(p.zy*.139+vec2(.07,-.015)*p.x,p.zy*.263+1.7)
        +axis.y*cliffTex(p.xz*.165,p.xz*.295+4.)
        +axis.z*cliffTex(p.xy*.149+vec2(-.032,.011)*p.z,p.xy*.225+3.);
      vec3 stone=texture2D(map,p.xz*.247+p.y*vec2(.026,.047)).rgb;
      rock=mix(rock,stone,.41)*vec3(.81,1.01,1.14);
      vec3 field=mix(texture2D(fieldMap,p.xz*.111).rgb,texture2D(fieldMap,p.xz*.323+.55).rgb,.39);
      float patches=.50+.21*sin(p.x*.123+p.z*.067)+.15*sin(p.x*.392-p.z*.132)+.14*sin(p.z*.288+p.x*.097);
      float lawn=smoothstep(.66,.90,n.y)*smoothstep(.25,.72,patches+.2*vColor.g);
      diffuseColor.rgb*=mix(rock,field*vec3(1.13,1.21,.96),lawn*.91);
      `);
  };
  const nx=213,nz=218, step=2.8, x0=-160,z0=-307, cols=nx+1;
  const total=cols*(nz+1), distances=new Float32Array(total);
  let heights=new Float32Array(total);
  for(let j=0;j<=nz;j++) for(let i=0;i<=nx;i++){
    const x=x0+i*step,z=z0+j*step,p=nearest(x,z,true), index=j*cols+i;
    heights[index]=terrainHeight(x,z,p);
    distances[index]=p?.distance??100;
  }
  for(let pass=0;pass<2;pass++){
    const blended=heights.slice();
    for(let j=1;j<nz;j++)for(let i=1;i<nx;i++){
      const k=j*cols+i,w=smooth(8,14,distances[k]);
      const avg=(heights[k-1]+heights[k+1]+heights[k-cols]+heights[k+cols])/4;
      blended[k]=lerp(heights[k],avg,w*.60);
    }
    heights=blended;
  }
  for(let j=0;j<=nz;j++) for(let i=0;i<=nx;i++) {
    const x=x0+i*step,z=z0+j*step;
    const k=j*cols+i,y=heights[k],near=distances[k];
    const cover=smooth(13,27,landDistance(x,z))*smooth(-.45,.5,Math.sin(x*.037+z*.055)*.6+Math.sin(z*.12)*.36+Math.sin((x+z)*.083)*.22);
    const col=stone.clone().lerp(grass,cover*.87).lerp(soil,(1-smooth(7,19,near))*.33);
    const stripe=.94+Math.sin(y*1.01+x*.087+Math.sin(z*.055)*1.8)*.035+Math.sin(x*.45+z*.6)*.066;
    col.multiplyScalar(stripe);
    vertices.push(x,y,z); uv.push((x+y*.58)/3.6,(z+y*.68)/3.6); colors.push(col.r,col.g,col.b);
    if(i<nx && j<nz) {
      const a=j*(nx+1)+i,b=a+nx+1;
      indices.push(a,b,a+1,a+1,b,b+1);
    }
  }
  const o=mesh(buffer(vertices,uv,indices,colors),m,scene);
  o.receiveShadow=true;
  return (x,z)=>{
    const i=(x-x0)/step,j=(z-z0)/step,a=Math.floor(i),b=Math.floor(j);
    if(a<0||b<0||a>=nx||b>=nz)return terrainHeight(x,z);
    const k=b*cols+a,u=i-a,v=j-b;
    if(u+v<1)return heights[k]+(heights[k+1]-heights[k])*u+(heights[k+cols]-heights[k])*v;
    return heights[k+cols+1]+(heights[k+cols]-heights[k+cols+1])*(1-u)+(heights[k+1]-heights[k+cols+1])*(1-v);
  };
}
function batch(scene,geometry,material,items,shadow=false) {
  const o=new T.InstancedMesh(geometry,material,items.length), dummy=new T.Object3D();
  for(let i=0;i<items.length;i++) {
    const [x,y,z,rx,ry,rz,sx,sy,sz,c]=items[i];
    dummy.position.set(x,y,z); dummy.rotation.set(rx,ry,rz);
    dummy.scale.set(sx,sy,sz); dummy.updateMatrix(); o.setMatrixAt(i,dummy.matrix);
    if(c) o.setColorAt(i,c);
  }
  o.castShadow=shadow; o.receiveShadow=true;
  o.computeBoundingSphere(); scene.add(o); return o;
}
function place(list,p,rx,ry,rz,sx,sy,sz,c) { list.push([p.x,p.y,p.z,rx,ry,rz,sx,sy,sz,c]); }

function infrastructure(scene) {
  const asphalt=groundMat('asphalt_track',0xf4eee6,.68,.94);
  asphalt.roughnessMap=texture('asphalt_track_rough');
  asphalt.onBeforeCompile= shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 roadUV;')
      .replace('#include <uv_vertex>','#include <uv_vertex>\nroadUV=uv;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 roadUV;')
      .replace('#include <color_fragment>',`#include <color_fragment>
       float x=roadUV.x*2.,z=roadUV.y*2.;
       float wheelBand=exp(-pow((abs(x)-1.16)/.64,2.))+exp(-pow((abs(x)-3.08)/.54,2.));
       float oldRepair=smoothstep(.45,.63,sin(z*.33 + sin(x*.74)*1.99)*.52+sin(z*.61+x*.72)*.31+sin(z*.82-x*3.1)*.17);
       float sealed=1.-smoothstep(.011,.029,abs(x-0.11-sin(z*.19)*.07-sin(z*.55)*.029));
       float patchEdge=smoothstep(3.35,4.55,abs(x)+.16*sin(z*.33)+.11*sin(z*.77+x*.9));
       float broken=sin(z*1.25+x*.93)+.29*sin(z*4.43-x*2.17)+.13*sin(z*21.35+x*12.8);
       float crack=(1.-smoothstep(.009,.035,abs(broken+x*.13)))*smoothstep(.20,.75,sin(z*.17)+.66*sin(x*2.04+z*.1));
       diffuseColor.rgb*=1.01-.18*wheelBand-.25*oldRepair-.27*sealed-.27*crack+.22*patchEdge;`);
  };
  ribbon(asphalt,scene,[[-roadHalf-.12,0],[-roadHalf,0],[-2.8,0],[0,0],[2.8,0],[roadHalf,0],[roadHalf+.12,0]]);
  const gravel=groundMat('gravel_floor',0xaaa08a,.87,1);
  ribbon(gravel,scene,[[-7.15,-.09],[-5.8,-.015],[-4.46,-.006]],0,length,.85,1.8);
  ribbon(gravel,scene,[[4.46,-.006],[5.8,-.015],[7.15,-.09]],0,length,.85,1.8);

  const rnd=rng(17);
  const stripMap=textureCanvas(128,512,(ctx,w,h)=>{
    ctx.fillStyle='#e2ded0';ctx.fillRect(0,0,w,h);
    for(let i=0;i<6300;i++) {
      ctx.fillStyle=rnd()<.6?'#50483b55':'#fcf3e467';
      ctx.fillRect(rnd()*w,rnd()*h,rnd()*3+.6,rnd()*3+.6);
    }
  });
  stripMap.wrapS=stripMap.wrapT=T.RepeatWrapping;
  const paint=new T.MeshStandardMaterial({map:stripMap,roughness:.76,polygonOffset:true,polygonOffsetFactor:-1});
  const middle=paint.clone();middle.color.setHex(0xddb67a);
  for(const side of [-1,1]) {
    const x=side*4.14;
    ribbon(paint,scene,[[x-.062,.009],[x+.062,.009]],0,length,1.2,1.15);
  }
  const lineParts=[];
  for(let s=0;s<length-4;s+=8.6) {
    lineParts.push(ribbon(middle,null,[[-.061,.013],[.061,.013]],s,s+3.65,1.6,1.15).geometry);
  }
  const dash=mesh(mergeGeometries(lineParts),middle,scene); dash.receiveShadow=true;
  const stripeParts=[];
  for(let row=0;row<2;row++) for(let i=0;i<29;i++) if((i+row)%2===0) {
    const d=-4.22+i*.291;
    stripeParts.push(ribbon(paint,null,[[d,.016],[d+.29,.016]],6+row*.28,6+(row+1)*.28,.4,1.15).geometry);
  }
  mesh(mergeGeometries(stripeParts),paint,scene).receiveShadow=true;

  const railTex=textureCanvas(256,512,(ctx,w,h)=>{
    const grad=ctx.createLinearGradient(0,0,w,0);
    grad.addColorStop(0,'#92918a');grad.addColorStop(.4,'#b6b8b3');grad.addColorStop(1,'#969991');
    ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    for(let i=0;i<5300;i++) {
      ctx.fillStyle=['#e7e7d324','#282e2625','#888b7a31','#b2a79634'][Math.floor(rnd()*4)];
      const x=rnd()*w,y=rnd()*h,d=1+rnd()*6;
      ctx.beginPath();ctx.moveTo(x,y); ctx.lineTo(x+d,y-2);ctx.lineTo(x+d*1.4,y+d*.58);ctx.lineTo(x-1,y+d*.36);ctx.fill();
    }
  });
  railTex.wrapS=railTex.wrapT=T.RepeatWrapping;
  const zinc=new T.MeshStandardMaterial({map:railTex,color:0xbdbeb6,metalness:.60,roughness:.53,side:T.DoubleSide});
  const postMat=new T.MeshStandardMaterial({color:0x686c64,metalness:.58,roughness:.66});
  const whiteMat=new T.MeshStandardMaterial({color:0xf0ecdd,roughness:.55,emissive:0x66451b,emissiveIntensity:.16});
  const redMat=new T.MeshStandardMaterial({color:0xb73426,emissive:0x6b1005,emissiveIntensity:.25,roughness:.47});
  const posts=[],feet=[],flanges=[],bolts=[],reflectors=[],red=[],seams=[];
  const profile=[[.017,.49],[-.028,.51],[-.085,.553],[-.099,.61],[-.045,.645],[.007,.674],[-.048,.707],[-.1,.741],[-.082,.794],[-.026,.821],[.017,.837]];
  for(const side of [-1,1]) {
    const rail=ribbon(zinc,scene,profile.map(([d,y])=>[side*(railOffset+d),y]),0,length,.92,.36);
    rail.castShadow=true;
    // The W profile needs its vertical UV span rather than its lateral depth.
    const uv=rail.geometry.attributes.uv;
    for(let i=0;i<uv.count;i++) uv.setX(i,profile[i%profile.length][1]*3.05);
    uv.needsUpdate=true;
    const count=Math.round(length/3.15);
    for(let i=0;i<count;i++) {
      const s=i*length/count, f=frame(s), yaw=Math.atan2(f.tx,f.tz);
      place(posts,roadPoint(s,side*(railOffset+.105),.36),0,yaw,0,.075,.82,.092);
      place(feet,roadPoint(s,side*(railOffset+.10),.028),0,yaw,0,.16,.049,.14);
      place(flanges,roadPoint(s,side*(railOffset+.095),.71),0,yaw,0,.24,.145,.17);
      place(bolts,roadPoint(s,side*(railOffset-.029),.669),0,yaw,Math.PI/2,.016,.021,.016);
      if(i%3===1) {
        place(reflectors,roadPoint(s,side*(railOffset+.025),.895),0,yaw,0,.06,.113,.09);
        place(side>0?red:reflectors,roadPoint(s-.05,side*(railOffset+.022),.912),0,yaw,0,.047,.058,.012);
      }
      if(i%2===0) place(seams,roadPoint(s+.72,side*(railOffset-.035),.672),0,yaw,0,.107,.322,.014);
    }
  }
  const box=new T.BoxGeometry(1,1,1);
  batch(scene,box,postMat,posts,true);batch(scene,box,postMat,feet);batch(scene,box,postMat,flanges);
  batch(scene,new T.CylinderGeometry(1,1,.8,6),whiteMat,bolts);
  batch(scene,box,whiteMat,reflectors);batch(scene,box,redMat,red);
  batch(scene,box,zinc,seams);

  function sign(s,d,width,height,draw,reverse=false) {
    const p=frame(s), g=new T.Group();
    const base=roadPoint(s,d);
    g.position.copy(base);g.rotation.y=Math.atan2(-p.tx,-p.tz)+(reverse?Math.PI:0);
    const pillar=mesh(new T.BoxGeometry(.075,2.16,.067),postMat,g);pillar.position.y=1.01;
    const plate=mesh(new T.BoxGeometry(width,height,.043),postMat,g);plate.position.y=1.9;
    const t=textureCanvas(512,Math.round(512*height/width),draw);
    const face=mesh(new T.PlaneGeometry(width-.025,height-.022),new T.MeshStandardMaterial({map:t,roughness:.63,emissive:0x423a26,emissiveIntensity:.25}),g);
    face.position.set(0,1.9,.025);scene.add(g);
  }
  for(let i=0;i<6;i++){
    sign(382+i*8,5.96,1.08,.65,(ctx,w,h)=>{
      ctx.fillStyle='#231e1b';ctx.fillRect(0,0,w,h);
      ctx.fillStyle='#e3aa50';ctx.fillRect(10,10,w-20,h-20);
      ctx.fillStyle='#22201b';ctx.beginPath();
      for(const [x,y] of [[.32,.50],[.57,.13],[.7,.13],[.47,.5],[.7,.87],[.57,.87]])ctx.lineTo(x*w,y*h);
      ctx.fill();
    });
  }
  sign(39,5.98,2.25,.96,(ctx,w,h)=>{
    ctx.fillStyle='#cbbfa5';ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#223234';ctx.fillRect(9,9,w-18,h-18);
    ctx.fillStyle='#f7e5c6';ctx.font='bold 54px Arial';ctx.fillText('COVE ROAD',38,91);
    ctx.font='25px Arial';ctx.fillText('DESCENT   /   KEEP CLEAR',39,151);
    ctx.fillStyle='#dd9f4b';ctx.fillRect(38,177,w-76,7);
  });
  sign(334,5.95,.79,.89,(ctx,w,h)=>{
    ctx.fillStyle='#d9a258';ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#262321';ctx.fillRect(23,22,w-46,h-44);
    ctx.fillStyle='#e6b35e';ctx.textAlign='center';ctx.font='bold 170px Arial';ctx.fillText('↰',w/2,Math.round(h*.48));
    ctx.font='bold 97px Arial';ctx.fillText('45',w/2,Math.round(h*.75));
  });
}
function foliage(scene,heightAt,rocks,shrubs) {
  const rnd=rng(93);
  const rockMat=groundMat('rock_3',0xd4c1a8,.79,1);
  const rockGeo=new T.IcosahedronGeometry(1,2);
  const pos=rockGeo.attributes.position;
  for(let i=0;i<pos.count;i++) {
    const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
    const f=1+.17*Math.sin(x*11+z*8)*Math.sin(y*13-z*7)+.075*Math.sin(x*23+z*14+y*29);
    pos.setXYZ(i,x*f,y*f,z*f);
  }
  rockGeo.computeVertexNormals();
  const stones=[],pebbles=[],tufts=[],scrub=[],pine=[],trunks=[];
  const rockSets=rocks.map(()=>[]), shrubSets=shrubs.map(()=>[]);
  const colors=[0x8b9154,0x747846,0x999656,0x5a673d,0xa7975c].map(c=>new T.Color(c));
  const pines=[0x6a7544,0x4e6243,0x5e6d46,0x798051].map(c=>new T.Color(c));
  const at=(x,z)=>new T.Vector3(x,heightAt(x,z),z);
  function boulder(p,r) {
    const set=Math.min(rocks.length-1,Math.floor(rnd()*rocks.length));
    const q=p.clone();q.y-=r*.18;
    const shape=r*(.58+rnd()*.49);
    place(rockSets[set],q,(rnd()-.5)*.40,rnd()*TAU,(rnd()-.5)*.27,r,shape,r*(.86+rnd()*.46));
  }
  function shrub(p,scale) {
    const set=Math.floor(rnd()*shrubs.length);
    const s=scale*(.80+.30*rnd()),q=p.clone();q.y-=s*.055;
    place(shrubSets[set],q,(rnd()-.5)*.15,rnd()*TAU,(rnd()-.5)*.17,s,s,s);
  }
  function makeScrub(p,scale) {
    const col=colors[Math.floor(rnd()*colors.length)];
    for(let j=0;j<8;j++){
      const theta=rnd()*TAU, a=scale*(.12+rnd()*.62);
      const q=p.clone().add(new T.Vector3(Math.sin(theta)*a,scale*(.16+rnd()*.29),Math.cos(theta)*a));
      place(scrub,q,rnd()*.7,theta,rnd()*.7,scale*(.32+rnd()*.27),scale*(.26+rnd()*.22),scale*(.3+rnd()*.25),col);
    }
  }
  function makeTree(p,scale) {
    const a=rnd()*TAU,bend=new T.Vector3(Math.sin(a),0,Math.cos(a));
    const offsets=[new T.Vector3(),bend.clone().multiplyScalar(.3*scale).setY(2.7*scale),bend.clone().multiplyScalar(1.05*scale).setY(5*scale),bend.clone().multiplyScalar(1.6*scale).setY(6.8*scale)];
    function branch(a,b,thick) {
      const d=b.clone().sub(a), q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize());
      const e=new T.Euler().setFromQuaternion(q);
      place(trunks,a.clone().lerp(b,.5).add(p),e.x,e.y,e.z,thick,d.length(),thick);
    }
    for(let i=0;i<3;i++) branch(offsets[i],offsets[i+1],scale*(.20-i*.037));
    for(let j=0;j<10;j++) {
      const u=rnd()*TAU, radius=scale*(.7+rnd()*2.3);
      const q=offsets[2].clone().add(new T.Vector3(Math.sin(u)*radius,scale*(.12+rnd()*2.2),Math.cos(u)*radius));
      branch(offsets[j%2+1],q,scale*(.06+rnd()*.07));
      for(let k=0;k<4;k++) {
        const w=q.clone().add(new T.Vector3((rnd()-.5)*scale*1.7,rnd()*scale*.52,(rnd()-.5)*scale*1.7)).add(p);
        place(pine,w,rnd()*.12,rnd()*TAU,rnd()*.13,scale*(.95+rnd()*.95),scale*(.34+rnd()*.55),scale*(.85+rnd()*1.35),pines[Math.floor(rnd()*4)]);
      }
    }
  }
  for(let i=0;i<4740;i++){
    const s=rnd()*length, side=rnd()<.53?-1:1, d=side*(5.91+rnd()**1.8*17);
    const p=roadPoint(s,d), f=nearest(p.x,p.z);
    if(f && Math.abs(f.d)<5.72) continue;
    p.y=Math.abs(d)<6.94?p.y-.025:heightAt(p.x,p.z);
    if(p.y<.62) continue;
    if(i<4000) {
      const h=.13+rnd()**2*.53;
      place(tufts,p,0,rnd()*TAU,0,.33+rnd()*.82,h,.33+rnd()*.82,colors[Math.floor(rnd()*5)]);
      if(i%8===0 && Math.abs(d)>6.6) {
        const scale=.29+rnd()*.85;
        if(i%32===0&&Math.abs(d)<12)shrub(p,scale*1.48);else makeScrub(p,scale);
      }
    } else {
      const r=.07+rnd()**2*(Math.abs(d)>8?2.15:.29);
      if(r>.68&&i%3===0)boulder(p,r);
      else place(stones,p,rnd()*.5,rnd()*TAU,rnd()*.7,r,r*(.32+rnd()*.67),r*(.63+rnd()*.8));
    }
  }
  for(let i=0;i<3400;i++){
    const s=rnd()*length, d=(rnd()<.5?-1:1)*(4.5+rnd()**1.25*2.22);
    const p=roadPoint(s,d,-.021),r=.014+rnd()**3*.103;
    place(pebbles,p,rnd()*1.8,rnd()*TAU,rnd(),r*(.7+rnd()*.5),r*(.23+rnd()*.40),r*(.53+rnd()*.75));
  }
  for(let i=0;i<690;i++) {
    const x=-119+rnd()*434,z=-257+rnd()*509;
    const n=nearest(x,z,true), p=at(x,z);
    if(n.distance<10 || p.y<.17) continue;
    if(i<230 && n.distance>15 && p.y>6) makeTree(p,.48+rnd()*.72);
    else if(i%4===0) makeScrub(p,.9+rnd()*1.4);
    else {
      const r=.4+rnd()**1.7*(p.y<7?5.7:3.8);
      p.y-=r*.16;
      if(r>1.9&&i%5===0)boulder(p,r*1.21);
      else place(stones,p,rnd()*.7,rnd()*TAU,rnd()*.7,r,r*(.40+rnd()*.65),r*(.8+rnd()*.65));
    }
  }
  for(let i=0;i<53;i++) {
    const z=-231+rnd()*450,x=coastX(z)+(rnd()-.46)*17,p=at(x,z);
    const distance=nearest(x,z,true).distance;
    if(distance<10 || p.y>13) continue;
    const r=1.0+rnd()**1.18*5.8;
    p.y=Math.max(-.65,p.y)-r*.12;
    if(!(distance<18&&z<-186))boulder(p,r*1.21);
  }
  const v=[],c=[],indices=[];
  for(let i=0;i<28;i++){
    const az=rnd()*TAU, x=(rnd()-.5)*.66,z=(rnd()-.5)*.67;
    const h=.22+rnd()*.78, wide=.009+rnd()*.024, lean=.10+rnd()*.36;
    const dx=Math.sin(az),dz=Math.cos(az);
    const a=v.length/3;
    v.push(x-wide*dz,0,z+wide*dx, x+wide*dz,0,z-wide*dx, x+dx*lean*.5-wide*dz*.7,h*.58,z+dz*lean*.5+wide*dx*.7,
      x+dx*lean*.5+wide*dz*.7,h*.58,z+dz*lean*.5-wide*dx*.7,x+dx*lean,h,z+dz*lean);
    indices.push(a,a+1,a+2,a+1,a+3,a+2,a+2,a+3,a+4);
    c.push(.31,.33,.20,.31,.33,.20,.70,.68,.43,.70,.68,.43,1,.95,.60);
  }
  const bladeMat=new T.MeshStandardMaterial({color:0xfff4d9,side:T.DoubleSide,roughness:.95,vertexColors:true});
  batch(scene,buffer(v,null,indices,c),bladeMat,tufts);
  function leafVolume(seed,count,pine=false){
    const random=rng(seed), vs=[], cs=[];
    for(let i=0;i<count;i++){
      const y=random()*2-1, a=random()*TAU, r=Math.sqrt(1-y*y);
      const center=new T.Vector3(r*Math.cos(a),y*.9,r*Math.sin(a)).multiplyScalar(.47+.53*random()**.5);
      const e=new T.Euler(random()*Math.PI,random()*TAU,random()*Math.PI);
      const l=pine?.16+random()*.37:.09+random()*.2, w=pine?.055+random()*.15:.068+random()*.12;
      const color=.37+random()*.63;
      for(const [x,y,z] of [[-l,0,0],[0,.06,w],[l,0,0],[-l,0,0],[l,0,0],[0,.06,-w]]){
        const p=new T.Vector3(x,y,z).applyEuler(e).add(center);
        vs.push(p.x,p.y,p.z); cs.push(color*1.08,color,color*.72);
      }
    }
    return buffer(vs,null,null,cs);
  }
  const leaves=new T.MeshStandardMaterial({color:0xdadea8,side:T.DoubleSide,roughness:1,vertexColors:true});
  batch(scene,leafVolume(16,76),leaves,scrub);
  batch(scene,leafVolume(27,105,true),leaves,pine);
  batch(scene,new T.CylinderGeometry(.56,1,1,7),new T.MeshStandardMaterial({color:0x493a2b,roughness:.99}),trunks);
  batch(scene,rockGeo,rockMat,stones,true);
  batch(scene,new T.IcosahedronGeometry(1,0),new T.MeshStandardMaterial({color:0x827971,roughness:1}),pebbles);
  rocks.forEach(({geometry,material},i)=>{if(rockSets[i].length)batch(scene,geometry,material,rockSets[i],true);});
  shrubs.forEach(({geometry,material},i)=>{if(shrubSets[i].length)batch(scene,geometry,material,shrubSets[i]);});
}

async function scannedParts(name,normalize) {
  const gltf=await new GLTFLoader().loadAsync(asset(name+'/'+name+'_1k.gltf'));
  const parts=[];
  gltf.scene.traverse(o=>{
    if(!o.isMesh)return;
    const geometry=o.geometry;
    geometry.computeBoundingBox();
    const box=geometry.boundingBox,size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
    if(normalize){
      geometry.translate(-center.x,-box.min.y,-center.z);
      const scale=2/Math.max(size.x,size.z);
      geometry.scale(scale,scale,scale);
    }
    for(const tex of [o.material.map,o.material.normalMap,o.material.roughnessMap])if(tex)tex.anisotropy=8;
    parts.push({geometry,material:o.material});
  });
  return parts;
}
function water(scene) {
  const g=new T.PlaneGeometry(4800,4800);
  g.rotateX(-Math.PI/2);
  const m=new T.ShaderMaterial({
    uniforms:{time:{value:0},sun:{value:sunDir}},
    vertexShader:`varying vec3 p; void main(){p=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`
      uniform float time; uniform vec3 sun; varying vec3 p;
      float coastX(float z){return -57.+z*.23+5.*sin(z*.052)+7.*sin(z*.019)+1.8*sin(z*.30);}
      float coastZ(float x){return -234.-5.*sin(x*.06)-9.*sin(x*.02)+1.6*sin(x*.24);}
      float wave(float value){return cos(value)*exp(-.34*pow(fwidth(value),2.));}
      void main(){
        vec2 q=p.xz; vec3 V=normalize(cameraPosition-p);
        vec2 a=vec2(.91,.41), b=vec2(-.38,.92), c=normalize(vec2(.23,-.88));
        float distanceView=distance(cameraPosition.xz,q);
        vec2 gust=vec2(sin(q.y*.091+q.x*.047)+.45*sin(q.x*.31+q.y*.22),sin(q.x*.079-q.y*.032+sin(q.x*.19)))*3.5;
        vec2 wq=q+gust;
        float w1=dot(wq,a)*.42+time*.75,w2=dot(wq,b)*.79-time*.63,w3=dot(wq,c)*1.43+time*1.09;
        float taper=1.-smoothstep(94.,690.,distanceView);
        vec2 slope=(.037*wave(w1)*a+.043*wave(w2)*b+.034*wave(w3)*c)*(.52+.48*taper);
        slope+=taper*(.054*wave(dot(wq,a)*3.7+time*1.9)*a+.032*wave(dot(wq,b)*7.4-time*.9)*b);
        vec3 N=normalize(vec3(slope.x,1.,slope.y));
        float nv=max(0.,dot(N,V)); vec3 R=reflect(-V,N);
        float f=.025+.76*pow(1.-nv,4.8);
        vec3 deep=vec3(.019,.089,.126);
        float land=min(q.x-coastX(q.y),q.y-coastZ(q.x));
        deep=mix(deep,vec3(.069,.225,.192),.54*smoothstep(-22.,.8,land));
        vec3 sky=mix(vec3(.256,.264,.304),vec3(.072,.153,.231),smoothstep(-.018,.39,R.y));
        float glow=pow(max(0.,dot(normalize(vec3(R.x,0.,R.z)),normalize(vec3(sun.x,0.,sun.z)))),11.);
        sky+=vec3(.46,.18,.073)*glow*(1.-smoothstep(0.,.4,R.y));
        float rDot=max(0.,dot(R,sun));
        float glint=pow(rDot,390.)*.57*taper+pow(rDot,109.)*(.086+.092*taper);
        vec3 col=mix(deep,sky,f)+vec3(1.9,1.13,.61)*glint;
        float shoal=1.-smoothstep(1.0,12.,abs(land-1.7));
        float breaker=pow(.5+.5*sin(land*1.52+w2*.33+time*1.19+sin(w1*.88)*.8),12.);
        float lace=smoothstep(.11,.79,sin(w2*3.+w3)*sin(w1*3.-w3*2.));
        float breaking=smoothstep(-.56,.18,sin(q.y*.32+q.x*.19)+.47*sin(q.x*.80-q.y*.291));
        col+=vec3(.31,.36,.32)*shoal*breaker*(.17+.83*lace)*(.48+.52*taper)*breaking;
        vec3 horizon=vec3(.262,.282,.330)+vec3(.33,.116,.037)*glow;
        col=mix(col,horizon,smoothstep(430.,1850.,distanceView));
        gl_FragColor=vec4(col,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const o=mesh(g,m,scene);o.position.y=-.23;o.renderOrder=-1;
  return m.uniforms.time;
}

function mountains(scene) {
  const random=rng(86);
  const items=[
    [-527,-649,269,52,113,0x435665],[-654,-797,272,68,107,0x4f606d],[-780,-942,329,73,117,0x64717a],
    [142,-559,294,70,149,0x4d574f],[352,-662,342,91,155,0x505c56],[537,-804,361,106,152,0x5c6570],
    [-543,256,158,38,93,0x464f52],[-688,377,257,59,118,0x525a61]
  ];
  for(const [x,z,w,h,d,color] of items){
    const v=[],uv=[],ix=[],col=[],base=new T.Color(color), rows=13, cols=44;
    const ridge=Array.from({length:cols+1},(_,i)=>Math.sin(Math.PI*i/cols)**.93*(.70+.22*Math.sin(i*.23)**2+.09*Math.sin(i*1.15)+.046*random()));
    for(let j=0;j<=rows;j++) for(let i=0;i<=cols;i++){
      const y=j/rows, p=i/cols, peak=Math.sin(Math.PI*y)**.65*ridge[i];
      v.push(x+(p-.5)*w+Math.sin(y*4+i*.3)*5,peak*h-1+(random()-.5)*3,z+(y-.5)*d+Math.sin(i*.21)*d*.18);
      uv.push(p,y);
      const c=base.clone().multiplyScalar(.84+random()*.28);col.push(c.r,c.g,c.b);
      if(j<rows&&i<cols){const a=j*(cols+1)+i,b=a+cols+1;ix.push(a,b,a+1,a+1,b,b+1);}
    }
    mesh(buffer(v,uv,ix,col),new T.MeshStandardMaterial({vertexColors:true,roughness:1,color:0xaeb6b6,emissive:0x4b5863,emissiveIntensity:.43}),scene);
  }
}
export async function makeWorld(scene,renderer) {
  scene.fog=new T.FogExp2(0xa8a9ad,.00154);
  const [sky,rocks,shrubs]=await Promise.all([new RGBELoader().loadAsync(asset('evening.hdr')),
    scannedParts('rock_moss_set_01',true),scannedParts('shrub_02',false)]);
  sky.mapping=T.EquirectangularReflectionMapping;
  let sx=0,sy=0,max=0;
  const data=sky.image.data, w=sky.image.width,h=sky.image.height;
  for(let y=Math.floor(h*.12);y<h*.61;y++) for(let x=0;x<w;x++){
    const i=(x+w*y)*4, value=data[i]+data[i+1];
    if(value>max){max=value;sx=x;sy=y;}
  }
  const sunAz=Math.atan2(sunDir.z,sunDir.x);
  const mapAz=TAU*((sx+.5)/w-.5);
  const rotation=mapAz-sunAz;
  const mapEl=Math.PI*(.5-(sy+.5)/h);
  const skyDome=mesh(new T.SphereGeometry(1,36,24),new T.ShaderMaterial({
    uniforms:{map:{value:sky},rotation:{value:rotation},sun:{value:sunDir},lift:{value:mapEl-Math.asin(sunDir.y)}},
    side:T.BackSide,depthWrite:false,
    vertexShader:`varying vec3 ray;void main(){
      ray=position;
      vec4 p=projectionMatrix*vec4(mat3(viewMatrix)*position,1.);
      gl_Position=p.xyww;
    }`,
    fragmentShader:`uniform sampler2D map;uniform float rotation;uniform float lift;uniform vec3 sun;varying vec3 ray;
      void main(){
        vec3 n=normalize(ray);
        float az=atan(n.z,n.x);
        float altitude=asin(clamp(n.y,-1.,1.));
        vec2 uv=vec2(fract((az+rotation)/6.2831853+.5),clamp((altitude+lift)/3.14159265+.5,0.,1.));
        vec3 hdr=texture2D(map,uv).rgb;
        float margin=1.-smoothstep(-.015,.31,n.y);
        float toward=max(0.,dot(normalize(n.xz),normalize(sun.xz)));
        float warm=pow(toward,2.2)*margin;
        float alignment=max(0.,dot(n,sun));
        float light=pow(alignment,38.);
        float disk=smoothstep(.999927,.999965,alignment);
        vec3 col=hdr*mix(vec3(.33,.37,.47),vec3(.55,.34,.212),warm*.96);
        col=mix(col,vec3(.262,.282,.330)+vec3(.33,.116,.037)*pow(toward,6.),
          (1.-smoothstep(-.070,.036,n.y))*.87);
        col+=(light*vec3(.55,.202,.068)+disk*vec3(2.9,1.8,.76))*(.76+.24*warm);
        gl_FragColor=vec4(col,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  }),scene);
  skyDome.frustumCulled=false;skyDome.renderOrder=-100;
  // The low sun drives the road shadow. The HDR sky supplies broad reflections.
  const pmrem=new T.PMREMGenerator(renderer);
  const env=pmrem.fromEquirectangular(sky);
  scene.environment=env.texture;
  scene.environmentRotation.y=rotation;
  scene.environmentIntensity=.54;
  pmrem.dispose();
  scene.add(new T.HemisphereLight(0xbdd5f5,0xa08058,.56));
  const fill=new T.DirectionalLight(0xbacfe6,.32);
  fill.position.set(4,6,6);
  scene.add(fill);
  const light=new T.DirectionalLight(0xffb776,1.86);
  light.castShadow=true; light.shadow.mapSize.set(2048,2048);
  light.shadow.camera.left=-23;light.shadow.camera.right=23;
  light.shadow.camera.top=23;light.shadow.camera.bottom=-23;
  light.shadow.camera.near=1;light.shadow.camera.far=154;
  light.shadow.bias=-.00027;light.shadow.normalBias=.055;light.shadow.radius=2.6;
  scene.add(light,light.target);
  mountains(scene);
  const heightAt=terrain(scene);
  infrastructure(scene);
  foliage(scene,heightAt,rocks,shrubs);
  const waveTime=water(scene);
  await Promise.all(pending);
  const target=new T.WebGLCubeRenderTarget(192,{type:T.HalfFloatType});
  const cube=new T.CubeCamera(.11,1350,target);
  cube.position.copy(roadPoint(111,-.5,1.15));
  light.target.position.copy(cube.position);
  light.position.copy(cube.position).addScaledVector(sunDir,74).add(new T.Vector3(0,5,0));
  cube.update(renderer,scene);
  const carPMREM=new T.PMREMGenerator(renderer);
  const carEnvironment=carPMREM.fromCubemap(target.texture).texture;
  carPMREM.dispose();
  target.dispose();
  return {update(time,target){
    waveTime.value=time;
    light.target.position.copy(target);
    light.position.copy(target).addScaledVector(sunDir,74).add(new T.Vector3(0,5,0));
  },carEnvironment,skySource:{sx,sy,w,h,rotation}};
}
