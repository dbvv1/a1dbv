import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { canvasTexture, colors, lit, noise, randomGen, surface } from './visual.js';
import { skin } from './cinematic-assets.js';
import { alpineRanges } from './alpine.js';
import { buildStation } from './station.js';
import { addHallReflection } from './hall-reflection.js';
import { makeTracks, sampleHeight } from './tracks.js';

const { clamp, lerp, smoothstep } = T.MathUtils;
const V = (x,y,z) => new T.Vector3(x,y,z);
const Y = V(0,1,0);
const boxGeo = new T.BoxGeometry();
const cylGeo = new T.CylinderGeometry(1,1,1,10);
const hexGeo = new T.CylinderGeometry(1,1,1,6);
const planeGeo = new T.PlaneGeometry(1,1);
const rockGeo = new T.IcosahedronGeometry(1,1);
const rounded = new Map();

export function groundAt(x,z) {
  if (z<-65 && Math.abs(x)<3.4) return .117;
  if (z <= -11.6 && z >= -31.6 && Math.abs(x)<10.2) return .069;
  const path=smoothstep(Math.abs(x),3.2,11.7);
  const rut=Math.sin(z*.37+x*.39)*.02;
  const drift=(noise(x*.31,z*.24)-.41)*.58+(noise(x*.73,z*.61)-.50)*.22;
  const lane=Math.abs(x+(noise(z*.35,103)-.5)*.45);
  const byRoad=smoothstep(z,-11.6,-8.7)*(1-smoothstep(z,28,32));
  const bank=(1-smoothstep(Math.abs(lane-3.27),.15,1.14))*(.034+noise(x*1.11,z*.69)*.134)*byRoad;
  return (z>22 ? .022*(z-22) : 0)+rut+path*drift+bank;
}
function shelfHeight(x,z) {
  const h=groundAt(x,z)-(z<-65 && Math.abs(x)<3.4 ? .22 : z<=-11.6 && z>=-31.6 && Math.abs(x)<10.2 ? .14 : 0);
  const edge=(z<-64?lerp(15.8,1.65,smoothstep(-z,64,72)):13.9+(z<-29?2.65:0))+noise(z*.12,65)*1.48;
  const side=smoothstep(Math.abs(x),edge,edge+13.1);
  const nose=smoothstep(-z,66.8,83);
  const drop=Math.max(side,nose);
  const talus=(noise(x*.25,z*.22)-.45)*3.2+(noise(x*.58,z*.52)-.44)*1.4;
  return lerp(h,-62.5+talus*3.4+noise(x*.09,z*.093)*25.2,drop)+talus*smoothstep(Math.abs(x),11.8,19.9)*(1-drop)*.57;
}
function terrain(x0,x1,z0,z1,xsteps,zsteps,height) {
  const geometry=new T.PlaneGeometry(x1-x0,z1-z0,xsteps,zsteps);
  geometry.rotateX(-Math.PI/2);
  geometry.translate((x1+x0)/2,0,(z1+z0)/2);
  const pts=geometry.attributes.position;
  for(let i=0;i<pts.count;i++) pts.setY(i,height(pts.getX(i),pts.getZ(i)));
  geometry.computeVertexNormals();
  return geometry;
}
function signTexture(text,sub,{bg='#25343e', fg='#f1e9d7', stripe='#ff8058', layout='sign'}={}) {
  const width=layout==='floor'?512:768, height=layout==='floor'?512:256;
  return canvasTexture(width,height,(c,w,h)=>{
    const r=randomGen(717);
    if(layout==='floor'){
      c.strokeStyle=fg; c.lineWidth=11;
      c.beginPath(); c.arc(256,256,206,0,Math.PI*2); c.stroke();
      c.lineWidth=5; c.strokeRect(102,102,308,308);
      for(let i=0;i<4;i++){c.save(); c.translate(256,256); c.rotate(i*Math.PI/2); c.fillStyle=stripe; c.fillRect(-37,-241,74,14); c.restore();}
      c.font='900 166px Segoe UI'; c.textAlign='center'; c.textBaseline='middle';
      c.fillStyle=fg; c.fillText(text,256,245);
      c.globalAlpha=.76; c.font='600 20px Consolas'; c.fillText(sub,256,348);
      c.globalAlpha=1; c.globalCompositeOperation='destination-out';
      for(let i=0;i<1100;i++){c.globalAlpha=r()*.7; c.fillRect(r()*w,r()*h,1+r()*9,1+r()*3);}
      return;
    }
    c.fillStyle=bg; c.fillRect(0,0,w,h);
    c.fillStyle=stripe; c.fillRect(19,20,10,h-40); c.fillRect(44,h-38,w-68,2);
    if(layout==='terminal'){
      for(let i=0;i<32;i++){c.fillStyle=i%2?'#a6e2df0b':'#abd7dd13'; c.fillRect(0,i*8,w,2);}
      c.strokeStyle=stripe; c.lineWidth=2; c.beginPath();
      for(let i=0;i<110;i++){const y=h-48-Math.sin(i*.53)*Math.sin(i*.136)*12; if(i===0)c.moveTo(491,y);else c.lineTo(491+i*2.24,y);}
      c.stroke(); c.fillStyle=stripe; c.fillRect(713,30,15,15);
    }
    c.fillStyle=fg; c.textAlign='left'; c.textBaseline='alphabetic';
    c.font=(text.length>13?'700 78px':'850 105px')+' Segoe UI'; c.fillText(text,50,132,676);
    c.font='600 27px Consolas'; c.fillText(sub,54,186,655);
    for(let i=0;i<570;i++){c.globalAlpha=r()*.22; c.fillStyle=r()<.52?'#1c282c':'#c3bdb0'; c.fillRect(r()*w,r()*h,1+r()*12,1+r()*2);}
  });
}
function stripesTexture() {
  return canvasTexture(512,128,(c,w,h)=>{
    c.fillStyle='#ae5636'; c.fillRect(0,0,w,h);
    c.fillStyle='#2c3237';
    for(let x=-96;x<w;x+=104){c.beginPath(); c.moveTo(x,0); c.lineTo(x+46,0); c.lineTo(x+107,h); c.lineTo(x+61,h); c.closePath(); c.fill();}
    const r=randomGen(833);
    for(let i=0;i<900;i++){c.fillStyle=r()<.5?'#26373b44':'#eddfc338'; c.fillRect(r()*w,r()*h,1+r()*13,1+r()*3);}
  });
}
export function createWorld(scene,stone,art,ranges) {
  const colliders=[], batches=new Map(), lights=[], trackedLights=[];
  const coldFeeds=[0,0,0], lightSlots=[];
  const coldTubes=coldFeeds.map(()=>lit(0xb1dfff,.04));
  let switchAge=0;
  const staticGroup=new T.Group();
  scene.add(staticGroup);
  const rand=randomGen(172981);
  const mat={
    steel:surface(colors.steel), edge:surface(colors.edge), blue:surface(colors.blue), graphite:surface(colors.graphite),
    oxide:surface(colors.oxide), orange:surface(colors.orange), pale:surface(colors.pale),
    rubber:surface(colors.rubber,'paint',{metalness:0}),
    plate:surface(0x85949c,'paint',{metalness:.40,roughness:.54}),
    zinc:surface(0x50646d,'paint',{metalness:.43,roughness:.61}),
    white:surface(0xc7ced0,'paint',{metalness:.20}),
    deck:surface(0x58636c,'grating',{roughness:.72,metalness:.28}),
    rock:surface(0x636d77,'rock',{roughness:.97,metalness:0},stone),
    snow:surface(0xc7d9ec,'snow',{roughness:.88,metalness:0}),
    orangeLight:lit(0xff893b,2.9), redLight:lit(0xff4228,3.1), whiteLight:lit(0xc6edff,2.04),
    aquaLight:lit(0x55e4e6,2.5), lowLight:lit(0x548c9e,.35),
    stripe:new T.MeshStandardMaterial({map:stripesTexture(),roughness:.86,metalness:.08}),
  };
  mat.concrete=skin(surface(0x928c7b,'paint',{roughness:.96,metalness:0}),art.concrete,{scale:.43,color:.85,detail:.76});
  mat.hallFloor=skin(surface(0x6b6b60,'hallFloor',{metalness:.04,roughness:.88}),art.concrete,{scale:.89,color:.80,detail:.40,rough:.33});
  mat.plaster=skin(surface(0x6c746e,'plaster',{metalness:.01,roughness:.93}),art.concrete,{scale:.73,color:.80,detail:.40});
  mat.road=skin(surface(0x717774,'road',{roughness:.84,metalness:.02,transparent:true,depthWrite:false}),art.road,{scale:.76,color:.84,detail:.78});
  skin(mat.steel,art.paint,{scale:1.00,detail:.56,color:.78,rough:.53});
  skin(mat.oxide,art.paint,{scale:.72,detail:.64,color:.78,rough:.57});
  skin(mat.blue,art.paint,{scale:.91,detail:.51,color:.67,rough:.63});
  skin(mat.zinc,art.deck,{scale:1.05,detail:.27,color:.45,rough:.41});
  skin(mat.deck,art.deck,{scale:.73,detail:.30,color:.80,rough:.54});
  skin(mat.snow,art.snow,{scale:.38,detail:.47,color:.34,rough:.28});
  const {mountain,elevation}=alpineRanges(ranges,stone);
  scene.add(mountain);
  const shelf=new T.Mesh(terrain(-62,62,-109,48,166,212,(x,z)=>{
    const edge=smoothstep(Math.abs(x),42,61);
    const join=Math.max(edge,1-smoothstep(z,-108,-94),smoothstep(z,36.8,47));
    const backLip=36.45+noise(x*.27,33.)*.55;
    const rearFall=smoothstep(z,backLip,backLip+5.8)*(1-smoothstep(Math.abs(x),12,22));
    return lerp(shelfHeight(x,z)-rearFall*(9.8+noise(x*.19,z*.31)*5.4),elevation(x,z)-1.45,join);
  }),mat.snow);
  shelf.receiveShadow=true; shelf.castShadow=true; scene.add(shelf);
  const rockUnits=[];
  const tempQ=new T.Quaternion(), m=new T.Matrix4(), o=new T.Object3D();
  const boltRot=new T.Euler(Math.PI/2,0,0);
  function batch(geo,material,pos,scale,rotation,shadow=true) {
    const zone=pos.z>-11?'entry':pos.z>-31?'relay':pos.z>-64?'yard':'spur';
    const key=material.id+':'+zone+':'+shadow;
    if(!batches.has(key)) batches.set(key,{material,shadow,parts:[]});
    if(rotation?.isQuaternion) tempQ.copy(rotation);
    else if(rotation) tempQ.setFromEuler(rotation);
    else tempQ.identity();
    const copy=geo.index?geo.toNonIndexed():geo.clone();
    copy.applyMatrix4(m.compose(pos,tempQ,scale)); batches.get(key).parts.push(copy);
  }
  function box(x,y,z,w,h,d,material=mat.steel,rot=0,bevel=0) {
    let geo=boxGeo, scale=V(w,h,d);
    if(bevel){
      const key=[w,h,d,bevel].join();
      if(!rounded.has(key)) rounded.set(key,new RoundedBoxGeometry(w,h,d,1,bevel));
      geo=rounded.get(key); scale=V(1,1,1);
    }
    batch(geo,material,V(x,y,z),scale,rot?new T.Euler(0,rot,0):null);
  }
  function attachProp(id, x,y,z,w,h,d, rotation=0) {
    const model=art.props[id].clone(true);
    const bounds=new T.Box3().setFromObject(model);
    const size=bounds.getSize(new T.Vector3());
    const center=bounds.getCenter(new T.Vector3());
    model.scale.set(w/size.x,h/size.y,d/size.z);
    model.position.set(-center.x*model.scale.x,-bounds.min.y*model.scale.y,-center.z*model.scale.z);
    model.traverse(object=>{
      if(!object.isMesh)return;
      object.castShadow=true;
      object.receiveShadow=true;
      if(id==='concrete_road_barrier_02')object.userData.receiver='concrete';
      if(id==='old_military_crate')object.userData.receiver='wood';
    });
    const anchor=new T.Group();
    anchor.position.set(x,y,z);
    anchor.rotation.y=rotation;
    anchor.add(model);
    staticGroup.add(anchor);
  }
  function boxObject(group,x,y,z,w,h,d,material=mat.steel,rot=0) {
    const mesh=new T.Mesh(boxGeo,material);
    mesh.position.set(x,y,z); mesh.scale.set(w,h,d); mesh.rotation.y=rot;
    mesh.castShadow=true; mesh.receiveShadow=true; group.add(mesh);
    return mesh;
  }
  function block(x,y,z,w,h,d,kind='wall') {
    const c={minX:x-w/2,maxX:x+w/2,minY:y-h/2,maxY:y+h/2,minZ:z-d/2,maxZ:z+d/2,active:true,kind};
    colliders.push(c); return c;
  }
  function wall(x,y,z,w,h,d,material=mat.steel,bevel=0) {
    box(x,y,z,w,h,d,material,0,bevel); return block(x,y,z,w,h,d);
  }
  function bar(a,b,r,material=mat.plate,geo=cylGeo) {
    const span=b.clone().sub(a);
    const q=new T.Quaternion().setFromUnitVectors(Y,span.clone().normalize());
    batch(geo,material,a.clone().lerp(b,.5),V(r,span.length(),r),q);
  }
  function decal(x,y,z,w,h,texture,rotation,opts={}) {
    const mesh=new T.Mesh(planeGeo,opts.light?
      new T.MeshBasicMaterial({map:texture,transparent:!!opts.alpha,depthWrite:!opts.alpha}):
      new T.MeshStandardMaterial({map:texture,transparent:!!opts.alpha,depthWrite:!opts.alpha,roughness:.89,metalness:0,polygonOffset:true,polygonOffsetFactor:-1}));
    mesh.position.set(x,y,z); if(rotation)mesh.rotation.copy(rotation); mesh.scale.set(w,h,1);
    mesh.receiveShadow=!opts.light; mesh.material.userData.noImpact=Boolean(opts.alpha); staticGroup.add(mesh); return mesh;
  }
  function sign(text,sub,x,y,z,w,h,rotation,opts) {
    return decal(x,y,z,w,h,signTexture(text,sub,opts),rotation,opts);
  }
  function point(x,y,z,color,intensity,range,feed=null) {
    trackedLights.push({x,y,z,color,intensity,range,feed});
  }
  function fixedSpot(origin,target,{color,power,range,angle,penumbra=.45}){
    const light=new T.SpotLight(color,power,range,angle,penumbra,2);
    light.position.copy(origin);
    light.target.position.copy(target);
    light.castShadow=true;
    light.shadow.mapSize.set(1024,1024);
    light.shadow.camera.near=.30;
    light.shadow.camera.far=range;
    light.shadow.bias=-.00027;
    light.shadow.normalBias=.029;
    light.shadow.autoUpdate=false;
    light.shadow.needsUpdate=true;
    scene.add(light,light.target);
  }
  function lamp(x,y,z,rot=0,cold=false) {
    box(x,y,z,.46,.20,.15,mat.edge,rot,.035);
    const facing=V(Math.sin(rot),0,Math.cos(rot));
    box(x+facing.x*.08,y-.016,z+facing.z*.08,.35,.095,.025,cold?mat.whiteLight:mat.orangeLight,rot);
    point(x+facing.x*.36,y-.25,z+facing.z*.36,cold?0x96d7ff:0xff8b5a,cold?13:19,7);
  }
  function bolt(x,y,z,r=.044,rot=boltRot) {
    batch(hexGeo,mat.plate,V(x,y,z),V(r,.041,r),rot);
  }
  function cable(points,r,material=mat.rubber) {
    const path=new T.CatmullRomCurve3(points), center=path.getPoint(.5);
    const tube=new T.TubeGeometry(path,Math.min(64,points.length*8),r,6,false);
    tube.translate(-center.x,-center.y,-center.z);
    batch(tube,material,center,V(1,1,1)); tube.dispose();
  }
  function rails(x,a,b,material=mat.oxide) {
    const n=Math.ceil(Math.abs(b-a)/3.2);
    const y=z=>groundAt(x,z)+.10;
    for(let i=0;i<=n;i++){
      const z=lerp(a,b,i/n);
      box(x,y(z)+.54,z,.11,1.09,.13,mat.edge);
      box(x,y(z)+1.07,z,.16,.07,.15,material);
      box(x,y(z)+.04,z,.29,.12,.26,mat.graphite);
    }
    bar(V(x,y(a)+1.06,a),V(x,y(b)+1.06,b),.052,material);
    bar(V(x,y(a)+.68,a),V(x,y(b)+.68,b),.022,mat.zinc);
    bar(V(x,y(a)+.35,a),V(x,y(b)+.35,b),.021,mat.zinc);
    block(x,.64,(a+b)/2,.14,1.3,Math.abs(b-a),'rail');
  }
  function grate(x,z,w,d,pitch=.012) {
    const y=groundAt(x,z)+pitch;
    box(x,y,z,w,.055,d,mat.deck);
    for(const side of [-1,1]) box(x+side*w/2,y+.024,z,.055,.025,d,mat.plate);
  }
  function bollard(x,z) {
    const y=groundAt(x,z);
    box(x,y+.34,z,.18,.71,.21,mat.edge,0,.026);
    box(x,y+.57,z+.043,.12,.14,.133,mat.orangeLight,0,.016);
    box(x,y+.687,z,.24,.07,.25,mat.edge,0,.017);
    box(x,y+.07,z,.36,.12,.37,mat.zinc,0,.025);
  }
  const fenceMesh=new T.MeshStandardMaterial({
    map:canvasTexture(128,128,(c,w,h)=>{
      c.strokeStyle='#9aafb5'; c.lineWidth=1.7;
      for(let i=-128;i<256;i+=11){c.beginPath(); c.moveTo(i,0);c.lineTo(i+128,128);c.stroke(); c.beginPath();c.moveTo(i,0);c.lineTo(i-128,128);c.stroke();}
    }),
    alphaTest:.33,color:0x7b909b,roughness:.8,metalness:.25,
  });
  function fence(x,a,b) {
    const n=Math.ceil(Math.abs(b-a)/3.25);
    for(let i=0;i<=n;i++){
      const z=lerp(a,b,i/n), y=groundAt(x,z);
      box(x,y+1.12,z,.16,2.28,.18,mat.steel);
      box(x,y+.18,z,.43,.41,.42,mat.graphite,0,.03);
      if(i===n) continue;
      const next=lerp(a,b,(i+1)/n);
      box(x,y+1.54,(z+next)/2,.039,1.30,Math.abs(next-z),fenceMesh);
      bar(V(x,y+2.18,z),V(x,groundAt(x,next)+2.18,next),.035,mat.zinc);
      bar(V(x,y+.76,z),V(x,groundAt(x,next)+.76,next),.025,mat.edge);
    }
    block(x,1.0,(a+b)/2,.23,2.35,Math.abs(b-a),'rail');
  }
  function crate(x,z,w=1.62,h=1.19,d=1.16,isOrange=false,stack=0,label=null,weathered=false) {
    const y=groundAt(x,z)+stack;
    block(x,y+h/2,z,w,h,d,'cover');
    if(weathered){
      const pallet=.16*h;
      attachProp('old_military_crate',x,y+pallet,z,w,h-pallet,d);
      for(const offset of [-.36,0,.36]){
        box(x+w*offset,y+pallet*.32,z,w*.12,pallet*.64,d*.94,mat.graphite,0,.018);
        bolt(x+w*offset,y+pallet*.66,z+d*.42,.028);
      }
      for(const offset of [-.32,-.12,.12,.32]){
        box(x+w*offset,y+pallet*.79,z,w*.16,pallet*.37,d*.96,mat.plate,0,.012);
      }
      return;
    }
    box(x,y+h/2,z,w,h,d,isOrange?mat.oxide:mat.blue,0,.055);
    box(x,y+h-.066,z,w+.038,.15,d+.042,mat.edge,0,.023);
    box(x,y+.072,z,w+.022,.16,d+.032,mat.graphite,0,.026);
    for(const f of [-1,1]){
      for(const q of [-1,1]){
        box(x+q*w*.399,y+h*.50,z+f*(d*.502),.104,h*.72,.043,mat.edge,0,.012);
        box(x+q*w*.5,y+h*.52,z+f*d*.353,.038,h*.72,.110,mat.edge,0,.012);
        box(x+q*w*.400,y+h+.017,z+f*d*.347,.22,.041,.22,mat.plate,0,.012);
      }
      box(x,y+h*.69,z+f*d*.52,w*.27,.12,.045,mat.graphite,0,.012);
    }
    if(label) sign(label,'CANISTER / BOREAL',x,y+h*.43,z+d*.527,w*.48,h*.31,null,{bg:isOrange?'#873e2a':'#293c47'});
    for(const edge of [-1,1]){
      const crust=(noise(x*.91+edge,z*.83)-.29)*.21;
      if(crust>0)batch(rockGeo,mat.snow,V(x+edge*w*.31,y+h-.006,z+d*.20),
        V(w*.17,crust,d*.34),new T.Euler(0,edge*.04,0));
    }
  }
  function rock(x,z,w,h,d,y=null,solid=false) {
    const ground=y??shelfHeight(x,z);
    const rot=new T.Euler((rand()-.5)*.62,rand()*6.283,(rand()-.5)*.60);
    if(w>.49){
      const q=new T.Quaternion().setFromEuler(rot);
      const geometry=solid||Math.abs(x)<13?art.rockGeometry:art.fieldGeometry;
      const sector=Math.floor(x/20)+':'+Math.floor(z/22);
      rockUnits.push({geometry,sector,matrix:new T.Matrix4().compose(V(x,ground+h*.19,z),q,V(w,h,d))});
    }else batch(rockGeo,mat.rock,V(x,ground+h*.19,z),V(w,h,d),rot);
    if(solid) block(x,ground+.40*h,z,w*1.32,h*.96,d*1.24,'rock');
  }

  // Compacted access track drifts into its banks over a continuously graded surface.
  const road=new T.Mesh(terrain(-3.42,3.42,-11.42,32.6,36,168,
    (x,z)=>shelfHeight(x,z)+.035-Math.pow(Math.abs(x)/3.42,6)*.019+noise(x*6.0,z*6.0)*.011),mat.road);
  road.receiveShadow=true;
  staticGroup.add(road);
  // Snow anchors, trail furniture and the front service landing.
  for(let i=0;i<270;i++){
    const z=40-rand()*121, x=(rand()<.5?-1:1)*(3.6+rand()*30);
    if(z<-11 && z>-32 && Math.abs(x)<11 || z<-65 && Math.abs(x)<4.2) continue;
    const size=rand(); if(Math.abs(x)<12 && size>.90) continue;
    const w=.10+size*size*(Math.abs(x)>11?2.6:.61);
    rock(x,z,w,w*(.4+rand()*.6),w*(.66+rand()*.55));
  }
  for(const [x,z,w,h,d] of [[-9,25,4.6,4.4,3.3],[9,28,4.1,2.6,4.1],[-10,18,2.3,2.4,3.9],[-8.9,17,2.8,1.7,2.5],[10,18,3.2,3.1,4.7],[-10.5,-4,2.6,1.5,2.4],[13,-38,3.5,2,4],[-14,-46,3,2.5,3.8],[-16,-60,3.6,2.9,5.0]]) rock(x,z,w,h,d,null,true);
  for(let i=0;i<8;i++){
    const z=26-i*3.5; bollard(i%2?-2.2:2.2,z);
  }
  for(const z of [21.8,8.9,-6.4,-10.38])grate(0,z,4.8,.42,.042);
  rails(-3.5,22,11); rails(3.5,18,12);
  fence(-12.8,11,-12); fence(12.4,10,-12);
  for(const x of [-4.2,4.2]){
    const z=8.4;
    box(x,.27,z,.88,.54,.94,mat.graphite,0,.049);
    box(x,2.48,z,.31,4.43,.32,mat.oxide,0,.034);
    for(const q of [-1,1]) bar(V(x,.25,z+.42*q),V(x,2.11,z),.049,mat.plate);
    block(x,1.9,z,.54,4,.58); lamp(x,3.65,z+.216);
  }
  box(0,4.33,8.4,8.8,.28,.28,mat.oxide);
  box(0,4.58,8.4,8.41,.075,.18,mat.edge);
  sign('BOREAL 07','INLET  /  4182 M',0,3.99,8.62,2.4,.64,null,{bg:'#202d36',stripe:'#ed764d'});
  for(const q of [-1,1]){
    box(q*2.95,4.1,8.54,1.1,.19,.034,mat.stripe);
    box(q*2.95,4.1,8.26,1.1,.19,.034,mat.stripe);
  }
  const shedX=-8.1,shedZ=2.2;
  wall(shedX,1.37,shedZ-2.1,4.5,2.74,.22,mat.blue,.03);
  wall(shedX-2.15,1.37,shedZ,.20,2.74,4.3,mat.blue,.03);
  box(shedX,2.78,shedZ,4.65,.24,4.67,mat.graphite,0,.045);
  box(shedX,2.95,shedZ-.12,4.43,.11,4.22,mat.white,0,.035);
  for(let i=0;i<21;i++) box(shedX-2.03+i*.205,2.80,shedZ+2.29,.043,.31,.10,mat.plate);
  for(const x of [shedX+2.15,shedX-2.11]){
    box(x,1.35,shedZ+2.04,.13,2.72,.13,mat.oxide); block(x,1.33,shedZ+2.04,.19,2.75,.19);
  }
  lamp(shedX,2.61,shedZ+2.04);
  sign('CACHE','FIELD SUPPLIES',shedX,2.33,shedZ+2.29,1.64,.39,null,{bg:'#313f46'});
  crate(-8.8,1.02,1.13,.71,.91,true,0,'03',true); crate(-9.6,2.01,.94,.55,.91);
  crate(-3.98,-1.6,2.4,1.0,1.14,true,0,'BNR'); crate(-4.16,-1.71,1.29,.73,1.04,false,1,'06');
  crate(4.3,-5.7,2.58,1.10,1.33,false,0,'07'); crate(7.0,-6.63,1.37,.81,1.34,true);
  crate(6.91,-6.70,1.12,.58,1.08,false,.81,null,true); crate(7.9,1.18,1.02,.89,.89);
  attachProp('utility_box_02',5.99,groundAt(5.99,-7.67),-7.67,1.03,1.32,.64,-.24);
  block(5.99,.66,-7.67,1.02,1.32,.68,'cover');
  cable([V(5.68,.44,-7.94),V(5.38,.14,-8.02),V(5.26,.05,-8.49),V(5.52,.052,-9.04),V(5.93,.34,-9.74)],.035);
  for(let k=0;k<4;k++){
    const x=8.1+k*.68;
    bar(V(x,.14,-8.5),V(x,2.4,-8.5),.22,mat.edge);
    bar(V(x,2.42,-8.5),V(x,2.53,-8.5),.12,mat.plate);
    bar(V(x,.51,-8.5),V(x,1.95,-8.5),.23,k%2===0?mat.oxide:mat.zinc);
  }
  block(9.1,1.09,-8.5,2.67,2.2,.62,'cover');
  box(9.14,1.72,-8.28,2.75,.12,.13,mat.orange);
  for(let i=0;i<5;i++) grate(0,-5.7-i*1.2,2.9,1.19,.08);
  for(const z of [-10.5,-7.85,-5.8]){bollard(-1.75,z);bollard(1.75,z);}


  // Relay hall exterior and overhead structure.
  wall(0,-.17,-21.8,20.6,.40,20.3,mat.edge);
  box(0,.021,-21.7,19.6,.093,19.9,mat.hallFloor);
  for(const x of [-2.68,2.68]){
    box(x,.079,-21.55,.055,.020,18.39,mat.edge);
    for(let i=0;i<6;i++){
      const z=-13.8-i*2.96;
      box(x,.092,z,.054,.009,2.55,mat.oxide);
    }
  }
  for(const z of [-13.19,-16.87,-20.55,-24.23,-27.91,-30.18]){
    box(0,.071,z,17.9,.008,.021,mat.graphite);
  }
  for(const z of [-12.27,-30.96]){
    box(0,.073,z,4.37,.021,.85,mat.deck);
    box(0,.092,z+.38,4.38,.023,.078,mat.zinc);
  }
  for(const side of [-1,1]){
    const x=side*4.14;
    box(x,.068,-21.82,1.15,.019,17.9,mat.deck);
    for(let i=0;i<8;i++){
      const z=-13.93-i*2.25;
      box(x,.089,z,1.16,.043,.039,mat.edge);
      for(const q of [-1,1])bolt(x+q*.484,.114,z+.13,.026,new T.Euler(0,0,0));
    }
  }
  const hallFilm=addHallReflection(scene,art.concrete[2]);
  for(const x of [-10.15,10.15]){
    wall(x,2.48,-21.8,.51,5,20.4,mat.plaster,.055);
    for(let j=0;j<10;j++){
      const z=-12.9-j*1.94;
      box(x+Math.sign(x)*.275,2.39,z,.095,4.63,1.80,j%3===0?mat.blue:mat.steel,0,.021);
      box(x-Math.sign(x)*.269,.351,z,.07,.55,1.80,mat.oxide);
      box(x-Math.sign(x)*.317,4.46,z,.10,.24,1.82,mat.plate);
    }
  }
  for(const x of [-6.14,6.14]){
    wall(x,2.50,-11.78,8.02,5.03,.58,mat.oxide,.042);
    wall(x,2.50,-31.72,8.02,5.03,.58,mat.plaster,.042);
    box(x,.235,-11.47,8.05,.41,.15,mat.graphite);
    box(x,.235,-32.03,8.05,.41,.15,mat.graphite);
  }
  wall(0,4.36,-11.78,4.46,1.35,.58,mat.oxide); wall(0,4.21,-31.72,4.46,1.72,.58,mat.blue);
  box(0,5.03,-21.72,20.8,.27,20.7,mat.graphite,0,.045);
  box(0,5.24,-21.79,20.44,.17,20.5,mat.white,0,.057);
  for(let j=0;j<10;j++){
    const x=-9.49+j*2.1;
    box(x,5.34,-21.79,.075,.10,20.4,mat.zinc);
    if(Math.abs(x)>2.25){
      box(x,2.50,-11.42,.16,4.89,.18,mat.edge,0,.025);
      box(x,2.50,-32.08,.16,4.89,.18,mat.graphite,0,.025);
    }
  }
  box(0,4.93,-11.31,20.83,.24,.22,mat.edge); box(0,4.93,-32.15,20.83,.24,.22,mat.edge);
  sign('RELAY 07','BOREAL / TRANSMISSION CONTROL',-5.72,3.5,-11.434,4.94,1.18,null,{bg:'#7d3c2c',fg:'#f3e9d6',stripe:'#ffc189'});
  sign('07','NORTH SERVICE YARD',5.73,3.19,-32.14,3.10,.95,new T.Euler(0,Math.PI,0),{bg:'#304551'});
  for(const x of [-2.14,2.14]){
    box(x,1.87,-11.64,.33,3.93,.96,mat.graphite,0,.040);
    box(x,1.86,-32.03,.29,3.89,.92,mat.graphite,0,.046);
    for(const y of [.38,1.64,3.11]){
      box(x,y,-11.135,.175,.28,.038,mat.stripe); bolt(x,y+.20,-11.13);
    }
    box(x,1.81,-11.10,.09,.53,.057,mat.orangeLight,0,.017);
  }
  box(0,3.74,-11.44,4.25,.24,.56,mat.edge,0,.032); box(0,3.61,-11.44,3.51,.075,.15,mat.whiteLight);
  lamp(0,3.52,-11.10);
  const glass=surface(0x304451,'paint',{roughness:.31,metalness:.54});
  for(const x of [-7.9,-6.4,5.05,6.54,8.04]){
    box(x,2.09,-11.442,1.32,.87,.17,mat.graphite,0,.067);
    box(x,2.15,-11.331,1.12,.65,.062,glass,0,.026);
    for(let p=0;p<5;p++)box(x-.436+p*.218,2.14,-11.288,.019,.62,.058,mat.zinc,0,.004);
    box(x,1.78,-11.26,1.27,.090,.28,mat.edge,0,.017);
  }
  for(const x of [3.75,9.60]){
    bar(V(x,1.17,-11.25),V(x,4.70,-11.25),.074,mat.zinc);
    for(const y of [1.23,2.32,3.58,4.60])box(x,y,-11.261,.21,.101,.19,mat.edge,0,.023);
  }
  box(0,3.93,-10.97,4.88,.17,.91,mat.edge,0,.037);
  box(0,4.035,-10.97,4.83,.060,.88,mat.white,0,.030);
  for(const x of [-2.24,2.24])bar(V(x,3.88,-10.60),V(x,3.05,-11.25),.041,mat.plate);

  const roofZ=-21;
  box(5.25,5.62,roofZ,3.7,.59,3.6,mat.blue,0,.06);
  box(5.25,6.0,roofZ,3.92,.29,3.8,mat.edge,0,.04);
  for(let j=0;j<12;j++) box(3.55+j*.3,5.71,roofZ+1.83,.13,.38,.11,mat.graphite);
  for(const [x,z] of [[-7,-19],[7.64,-25],[-4.6,-18]]){
    bar(V(x,5.22,z),V(x,8.3,z),.065,mat.zinc);
    bar(V(x-.47,7.45,z),V(x+.47,7.45,z),.045,mat.oxide);
    bar(V(x-.32,7.91,z),V(x+.32,7.91,z),.034,mat.plate);
    bar(V(x,8.3,z),V(x,8.45,z),.08,mat.redLight);
  }

  // Side column pairs support the overhead service gallery.
  for(const z of [-14.00,-20.59,-29.83]){
    for(const x of [-9.48,9.48]){
      box(x,2.44,z,.44,4.50,.42,mat.graphite,0,.034);
      box(x,3.18,z,.61,.59,.62,mat.steel,0,.029);
      bar(V(x-Math.sign(x)*2.20,4.55,z),V(x,3.22,z),.091,mat.zinc,hexGeo);
    }
  }
  for(const x of [-7.71,7.71]){
    cable([V(x,4.40,-12.3),V(x,4.31,-16.8),V(x,4.39,-20.4),V(x,4.29,-26.1),V(x,4.40,-30.94)],.076);
    cable([V(x+.22,4.39,-12.3),V(x+.22,4.27,-17.2),V(x+.22,4.39,-22.9),V(x+.22,4.23,-27.6),V(x+.22,4.43,-30.94)],.065,mat.oxide);
  }
  bar(V(-8.78,4.35,-12.12),V(-8.78,4.35,-30.94),.213,mat.zinc);
  for(const z of [-14,-18,-22,-26,-30]){
    bar(V(-8.78,4.35,z-.13),V(-8.78,4.35,z+.13),.255,mat.graphite);
    bar(V(9.7,.14,z),V(9.7,4.3,z),.081,mat.zinc);
  }
  const turnR=new T.Euler(0,Math.PI/2,0),turnL=new T.Euler(0,-Math.PI/2,0);
  for(let j=0;j<3;j++){
    const z=-16.4-j*3.1;
    wall(-8.38,.56,z,1.92,1.12,2.03,mat.edge,.05);
    box(-8.33,1.12,z,2.06,.121,2.14,mat.zinc,0,.035);
    box(-8.78,1.49,z,.28,.69,1.29,mat.graphite,0,.053);
    sign(j===0?'WEATHER':j===1?'OUTBOUND':'RECEIVE','N / 46.01 / S07',-8.625,1.5,z,1.19,.57,turnR,{bg:'#153640',fg:'#a9e6e9',stripe:'#54dbd9',layout:'terminal',light:true});
    box(-7.55,1.1,z-.56,.27,.071,.35,mat.oxide,0,.016);
    for(let x=0;x<5;x++) for(let k=0;k<5;k++) box(-7.88+x*.086,1.19,z-.35+k*.10,.052,.022,.061,k%4===0?mat.pale:mat.graphite,0,.004);
  }
  wall(-6.18,1.25,-27.9,3.6,2.50,.35,mat.edge,.044);
  box(-6.20,1.64,-27.69,3.09,1.36,.18,mat.blue,0,.034);
  sign('BAND IV','COORDINATES / LAST FIX STORED',-6.22,1.66,-27.576,2.88,1.16,null,{bg:'#193a42',fg:'#a6eced',stripe:'#f7844d',layout:'terminal',light:true});
  point(-6.3,1.45,-26.9,0x4bd2e5,11,5.6);
  // The glacial fix is mapped at the rear wall. The left bench still carries the previous shift's kit.
  const mapTex=canvasTexture(1024,512,(c,w,h)=>{
    c.fillStyle='#122b35';c.fillRect(0,0,w,h);
    c.strokeStyle='#6aa6af36';c.lineWidth=1;
    for(let i=16;i<w;i+=28){c.beginPath();c.moveTo(i,142);c.lineTo(i,h-31);c.stroke();}
    for(let i=156;i<h;i+=24){c.beginPath();c.moveTo(17,i);c.lineTo(w-23,i);c.stroke();}
    c.save();c.beginPath();c.rect(17,142,w-43,h-175);c.clip();
    for(let j=0;j<21;j++){
      const rx=45+j*22,ry=20+j*11;
      c.strokeStyle=j%5===0?'#93cfd2a2':'#527f88a1';c.lineWidth=j%5===0?2.5:1.4;
      c.beginPath();
      for(let k=0;k<=172;k++){
        const a=k*Math.PI/86;
        const n=1+.18*Math.sin(a*3+j*.099)+.145*Math.cos(a*5-j*.073)+.075*Math.sin(a*10+j*.08);
        const x=689+Math.cos(a)*rx*n+Math.sin(a)*65,y=303+Math.sin(a)*ry*n+Math.cos(a)*60;
        if(k===0)c.moveTo(x,y);else c.lineTo(x,y);
      }
      c.stroke();
    }
    c.restore();
    c.fillStyle='#ffa379';c.fillRect(26,28,6,84);
    c.fillStyle='#b9dedf';c.font='800 61px Segoe UI';c.fillText('GLACIER / NORTH',51,80);
    c.fillStyle='#85bbbe';c.font='600 20px Consolas';c.fillText('LAST FIX · BOREAL RESCUE NETWORK',55,112);
    c.setLineDash([8,7]);c.strokeStyle='#fa9c6e';c.lineWidth=3;
    c.beginPath();c.moveTo(257,416);c.lineTo(425,396);c.lineTo(469,324);c.lineTo(668,266);c.stroke();c.setLineDash([]);
    c.strokeStyle='#ffd39e';c.beginPath();c.arc(668,266,20,0,Math.PI*2);c.stroke();
    c.fillStyle='#edb68c';c.fillText('FIX 07',704,260);
    c.fillStyle='#7da3ae';c.font='16px Consolas';c.fillText('46.01 N     04.182 KM',42,486);
  });
  box(-5.54,2.61,-31.382,5.76,2.90,.207,mat.graphite,0,.081);
  box(-5.54,2.6,-31.252,5.60,2.73,.092,mat.zinc,0,.041);
  decal(-5.54,2.59,-31.188,5.39,2.61,mapTex,null,{light:true});
  box(-5.56,1.23,-31.15,5.77,.082,.30,mat.oxide,0,.02);
  point(-5.44,2.6,-30.34,0x77c7d1,13.2,8.4);
  wall(-6.83,.48,-20.6,1.9,.96,2.40,mat.blue,.065);
  box(-6.80,1.005,-20.6,2.14,.131,2.53,mat.zinc,0,.045);
  for(const z of [-21.31,-20.93,-20.48,-20.03]){
    box(-5.91,.54,z,.117,.36,.295,mat.steel,0,.016);
    box(-5.84,.61,z,.039,.059,.172,mat.graphite,0,.012);
  }
  box(-7.48,1.105,-20.02,.471,.071,.66,mat.oxide,-.11,.019);
  box(-7.48,1.147,-20.03,.416,.017,.59,mat.pale,-.11,.006);
  bar(V(-6.11,1.06,-20.43),V(-6.11,1.31,-20.43),.091,mat.white);
  bar(V(-6.11,1.276,-20.43),V(-6.11,1.322,-20.43),.092,mat.edge);
  bar(V(-6.54,1.065,-19.82),V(-6.54,1.37,-19.82),.087,mat.oxide);
  bar(V(-6.54,1.34,-19.82),V(-6.54,1.405,-19.82),.09,mat.edge);
  box(-6.87,1.18,-21.31,.39,.226,.49,mat.graphite,0,.028);
  box(-6.86,1.28,-21.31,.31,.038,.34,mat.blue,0,.012);
  bar(V(-6.89,1.29,-21.35),V(-6.89,1.72,-21.35),.019,mat.zinc);
  box(-6.77,1.26,-21.035,.123,.049,.026,mat.aquaLight,0,.010);
  wall(5.75,1.01,-23.42,1.42,2.01,2.65,mat.graphite,.064);
  for(const z of [-24.28,-23.41,-22.53]){
    box(5.01,1.49,z,.120,.744,.776,mat.blue,0,.037);
    box(4.94,1.72,z,.036,.082,.286,mat.orangeLight,0,.009);
    for(let k=0;k<6;k++)box(4.93,.91-k*.088,z,.030,.021,.58,mat.edge);
  }

  const relay=V(-3.45,1.18,-25.12),uplink=V(.15,1.25,-53.7),evac=V(1.35,1.01,-79.15),front=V(0,1.38,-11.45);
  const consoleBevel=new RoundedBoxGeometry(1,1,1,2,.10);
  const panelTilt=new T.Euler(-.16,0,0);
  const consoleTilt=new T.Euler(-.43,0,0);
  function terminal(pos,word,sub){
    const {x,z}=pos;
    const trim=(u,y,v,w,h,d,material,rotation=null)=>batch(consoleBevel,material,V(x+u,y,z+v),V(w,h,d),rotation);
    trim(0,.153,0,1.41,.25,1.00,mat.edge);
    trim(0,.30,-.04,1.14,.17,.79,mat.zinc);
    trim(0,.65,-.11,.91,.79,.63,mat.steel);
    trim(0,.68,.214,.76,.51,.069,mat.edge);
    trim(0,1.15,-.18,.82,.37,.48,mat.blue);
    block(x,.70,z,1.05,1.39,.68);
    trim(0,1.48,-.027,1.27,.64,.205,mat.graphite,panelTilt);
    trim(0,1.481,.077,1.174,.550,.061,mat.zinc,panelTilt);
    trim(0,1.486,.105,1.107,.477,.042,mat.edge,panelTilt);
    const screen=sign(word,sub,x,1.489,z+.13,1.040,.411,panelTilt,{layout:'terminal',light:true});
    trim(0,1.015,.30,1.21,.231,.36,mat.oxide,consoleTilt);
    trim(0,1.105,.337,1.08,.065,.235,mat.graphite,consoleTilt);
    for(let i=0;i<7;i++){
      const u=-.405+i*.097;
      trim(u,1.151,.344,.055,.031,.081,i===4?mat.aquaLight:mat.zinc,consoleTilt);
      trim(u,1.184,.309,.034,.014,.016,mat.lowLight,consoleTilt);
    }
    trim(.335,1.158,.356,.169,.046,.120,mat.stripe,consoleTilt);
    const control=new T.Group();
    const travel=V(x+.335,1.19,z+.35);
    control.position.copy(travel);control.rotation.copy(consoleTilt);
    const button=new T.Mesh(new RoundedBoxGeometry(.075,.027,.071,3,.009),mat.orangeLight);
    button.castShadow=true;control.add(button);scene.add(control);
    trim(.335,1.16,.35,.101,.014,.086,mat.graphite,consoleTilt);
    for(const side of [-1,1]){
      const u=.335+side*.084;
      trim(u,1.183,.349,.023,.059,.125,mat.plate,consoleTilt);
      trim(u,1.208,.378,.023,.020,.063,mat.oxide,consoleTilt);
    }
    for(const q of [-1,1]){
      trim(q*.499,.618,.057,.096,.623,.375,mat.blue);
      bar(V(x+q*.496,.35,z-.149),V(x+q*.496,.881,z+.220),.031,mat.edge);
      bolt(x+q*.546,1.007,z+.49,.023);
      bolt(x+q*.314,.779,z+.258,.018);
      bolt(x+q*.314,.5,z+.258,.018);
    }
    sign('BOREAL','FIELD INTERLOCK    PS–07',x,.644,z+.254,.461,.128,null,{bg:'#2e3334',fg:'#e4c6a0',stripe:'#bd7c60'});
    for(let i=0;i<4;i++)trim(0,.391+i*.024,.255,.421,.011,.024,mat.rubber);
    return {screen,control,travel,button,pressed:-1};
  }
  const relayPanel=terminal(relay,'BYPASS','MANUAL POWER  /  E');
  const uplinkPanel=terminal(uplink,'UPLINK','SEND RESCUE FIX  /  E');
  const evacPanel=terminal(evac,'CABLE','RETURN CAR  /  E');
  for(let j=0;j<3;j++)for(let i=0;i<3;i++) box(-3.47+i*.14,.104,-26.0-j*.83,.08,.042,.63,mat.oxide,0,.009);
  function gate(z,label){
    const group=new T.Group();
    group.position.set(0,0,z); scene.add(group);
    const obstruction=block(0,1.62,z,4.25,3.3,.40);
    boxObject(group,0,1.62,0,4.20,3.24,.37,mat.graphite);
    boxObject(group,0,.20,0,4.22,.35,.41,mat.stripe);
    for(let i=0;i<6;i++){
      boxObject(group,0,.59+i*.42,0,3.98,.36,.42,i%3?mat.steel:mat.blue);
      boxObject(group,0,.735+i*.42,.222,4.09,.040,.047,mat.zinc);
    }
    boxObject(group,0,1.79,.280,1.87,.46,.055,mat.edge);
    const plate=new T.Mesh(planeGeo,new T.MeshStandardMaterial({map:signTexture(label,'BOREAL / INTERLOCK'),roughness:.95}));
    plate.position.set(0,1.79,.311); plate.scale.set(1.78,.40,1); group.add(plate);
    const frontRay=boxObject(group,0,3.12,.237,.83,.074,.071,mat.redLight);
    const backRay=boxObject(group,0,3.12,-.237,.83,.074,.071,mat.redLight);
    return {group,obstruction,frontRay,backRay,amount:0};
  }
  const serviceGate=gate(-31.70,'SERVICE'),extractGate=gate(-64,'RETURN');

  const isApronGrate=i=>i<3||i>19||(i>=9&&i<16);
  function footSurface(x,z){
    const ax=Math.abs(x);
    if(z<-64.64)return 'metal';
    if(z<-32&&ax<1.67)return isApronGrate(Math.round((-z-32.78)/1.38))?'metal':'solid';
    if(z>-31.7&&z<-11.6){
      return (Math.abs(ax-4.14)<.56||ax<2.18&&(Math.abs(z+12.27)<.425||Math.abs(z+30.96)<.425))?'metal':'solid';
    }
    return 'snow';
  }
  // Steel landings link two hardened stretches of the apron.
  const apronTrack=terrain(-1.67,1.67,-63.65,-32.0,14,98,(x,z)=>shelfHeight(x,z)+.033);
  const apronMat=skin(surface(0x565a55,'hallFloor',{metalness:.02,roughness:.94}),art.concrete,
    {scale:.51,color:.72,detail:.52,rough:.23});
  const apron=new T.Mesh(apronTrack,apronMat);
  apron.receiveShadow=true;staticGroup.add(apron);
  for(let i=0;i<22;i++){
    const z=-32.78-i*1.38;
    if(isApronGrate(i)){
      grate(0,z,3.35,1.34,.039);
      for(const x of [-1.53,1.53])box(x,.107,z-.16,.054,.023,.12,mat.oxide,0,.006);
    }else if(i%2===0){
      box(0,groundAt(0,z)+.048,z,3.36,.015,.035,mat.graphite);
    }
    if(i%4===1){bollard(-1.88,z);bollard(1.88,z);}
  }
  for(const x of [-1.57,1.57]){
    for(const [z,length] of [[-37.25,3.51],[-45.67,2.42],[-56.4,3.14],[-59.88,1.93]]){
      box(x,groundAt(x,z)+.034,z,.067,.024,length,mat.oxide,0,.007);
    }
  }
  for(const x of [-2.25,2.39]){
    const z=-47.12;
    box(x,.13,z,.38,.26,.42,mat.graphite,0,.028);
    box(x,.51,z,.113,.82,.112,mat.oxide,0,.014);
    box(x,.86,z-.023,.173,.14,.17,mat.zinc,0,.016);
  }
  fence(-15.2,-32.1,-63.7); fence(15.1,-32.1,-63.7);
  wall(-12.7,1.9,-31.8,5.3,4.0,.26,mat.graphite); wall(12.7,1.9,-31.8,5.3,4.0,.26,mat.graphite);
  for(const q of [-1,1]){
    wall(q*8.76,1.04,-64.0,13.3,2.08,.31,mat.graphite,.023);
    box(q*8.76,2.06,-64,13.31,.14,.38,mat.zinc);
    sign('EXIT','CABLE RETURN',q*4.69,1.31,-63.81,2.12,.49,null,{bg:'#30424a'});
    box(q*2.15,1.89,-64.0,.31,3.80,.69,mat.oxide,0,.034);
  }
  box(0,3.58,-64.0,4.54,.36,.40,mat.oxide); lamp(0,3.38,-63.7);
  for(const [x,z,w,h,d,orange,stack,label,weathered] of [
    [-4.05,-38.4,2.65,1.21,1.57,true,0,'A2'],[-4.08,-38.48,1.72,.66,1.12,false,1.21,'',true],
    [4.12,-39.91,2.5,1.03,1.19,false,0,'D1',true],[-8.32,-47.2,2.3,1.14,1.41,false,0,'C4',true],
    [-8.35,-47.26,1.30,.73,1.10,true,1.14,''],[3.43,-49.65,1.84,1.17,1.44,true,0,'07'],
    [10.95,-58.70,1.56,1.05,1.25,false,0,''],[-4.90,-57.13,2.10,1.14,1.19,true,0,'B2'],
    [-9.24,-59.01,1.34,1.19,1.32,false,0,'',true],[6.35,-60.75,1.11,.64,1.1,false,0,''],
  ]) crate(x,z,w,h,d,orange,stack,label,weathered);
  for(const [x,z,stretch] of [[-11.3,-40,4.8],[9.9,-40,5.0],[-11.2,-53,4.4]]){
    const unit=stretch/2;
    for(const side of [-1,1]){
      const offset=z+side*unit*.5;
      attachProp('concrete_road_barrier_02',x,groundAt(x,offset)-.04,offset,unit-.047,1.31,1.15,Math.PI*side*.5);
      for(const end of [-1,1]){
        const hit=offset+end*unit*.28, edge=x+(x<0?.439:-.439);
        box(edge,.83,hit,.026,.156,.25,mat.stripe,0,.008);
      }
    }
    block(x,.65,z,1.15,1.30,stretch,'cover');
  }
  attachProp('utility_box_02',10.4,groundAt(10.4,-48.5),-48.5,1.14,1.39,.74,-Math.PI*.53);
  block(10.4,.70,-48.5,.80,1.43,1.17,'cover');
  for(const offset of [0,.12,.24]){
    cable([V(10.11,.095,-48.67+offset),V(9.7,.085,-48.81+offset),V(9.18,.092,-49.54+offset),V(8.91,.115,-50.94+offset)],.025);
  }
  for(const x of [-11.8,11.7])for(const z of [-36.25,-57.9]){
    box(x,2.69,z,.11,5.39,.13,mat.edge);
    box(x,.24,z,.51,.48,.51,mat.steel,0,.061); block(x,.25,z,.54,.54,.54,'cover');
    box(x,5.35,z,.84,.23,.29,mat.plate,0,.05);
    box(x,5.29,z+(z<-50?.17:-.17),.72,.106,.045,mat.whiteLight,0,.015);
    point(x,4.91,z+(z<-50?.45:-.45),0xa5d7ff,25,15);
  }
  for(let j=0;j<3;j++){
    const x=-10.4+j*1.67,z=-55.7;
    bar(V(x,.48,z),V(x,1.6,z),.46,mat.oxide);
    bar(V(x,1.64,z),V(x,1.79,z),.19,mat.plate);
    box(x,.24,z,.89,.48,1.04,mat.graphite,0,.043);
  }
  block(-8.75,.75,-55.7,4.34,1.57,1.17,'cover');
  bar(V(-11.2,1.91,-55.72),V(-6.43,1.91,-55.72),.077,mat.zinc);
  decal(-5.2,.103,-49.7,5.4,5.4,signTexture('07','UPLINK APRON',{layout:'floor',fg:'#d6dfdf',stripe:'#be603d'}),new T.Euler(-Math.PI/2,0,0),{alpha:true});
  point(.14,1.0,-53.0,0xff9b58,14,5.1);
  const dishX=8.55,dishZ=-53.15;
  wall(dishX,.31,dishZ,4.70,.66,4.45,mat.graphite,.075);
  box(dishX,.65,dishZ,4.18,.19,3.90,mat.oxide,0,.06);
  bar(V(dishX,.69,dishZ),V(dishX,3.56,dishZ),.84,mat.steel);
  bar(V(dishX,2.04,dishZ),V(dishX,2.41,dishZ),1.04,mat.zinc);
  bar(V(dishX,3.38,dishZ),V(dishX,3.59,dishZ),1.29,mat.oxide);
  const turntable=V(dishX,2.21,dishZ);
  for(const [lowY,highY,radius,matId] of [[.72,1.03,1.39,'edge'],[1.93,2.08,1.21,'oxide'],
    [2.08,2.32,1.07,'graphite'],[2.32,2.54,1.04,'zinc'],[3.30,3.54,1.36,'oxide']]){
    bar(V(dishX,lowY,dishZ),V(dishX,highY,dishZ),radius,mat[matId]);
  }
  for(let j=0;j<16;j++){
    const a=j*Math.PI/8,x=dishX+Math.cos(a)*1.30,z=dishZ+Math.sin(a)*1.30;
    box(x,.79,z,.19,.136,.19,mat.zinc,0,.021);
    bar(V(x,.72,z),V(x,1.84,z),.047,j%4===0?mat.oxide:mat.plate);
    const u=dishX+Math.cos(a)*1.21,v=dishZ+Math.sin(a)*1.21;
    box(u,2.15,v,.118,.166,.141,mat.edge,-a,.004);
  }
  for(const q of [-1,1]){
    const foot=V(dishX+q*1.20,3.55,dishZ-.43);
    const pin=V(dishX+q*1.72,5.34,dishZ+.03);
    bar(foot,pin,.213,mat.oxide,hexGeo);
    bar(V(dishX+q*.58,3.48,dishZ-.75),V(dishX+q*1.72,5.34,dishZ-.28),.141,mat.plate,hexGeo);
    const axisA=pin.clone().add(V(q*.28,0,0)),axisB=pin.clone().add(V(q*.58,0,0));
    bar(pin,axisA,.53,mat.graphite);
    bar(axisA,axisB,.39,mat.zinc);
    bar(axisB,axisB.clone().add(V(q*.042,0,0)),.27,mat.oxide);
    for(const z of [-.48,.48])box(dishX+q*1.64,5.31,dishZ+z,.36,.69,.128,mat.edge,0,.05);
  }
  for(const z of [dishZ-1.74,dishZ+1.74]){
    box(dishX,1.87,z,3.8,.072,.082,mat.zinc,0,.023);
    for(let j=0;j<6;j++){
      const x=dishX-1.84+j*.72;
      bar(V(x,.71,z),V(x,1.91,z),.035,mat.oxide);
      box(x,.76,z,.131,.094,.15,mat.plate,0,.011);
    }
  }
  box(dishX,.805,dishZ+1.12,4.08,.077,1.18,mat.deck,0,.026);
  sign('ANT 07','ROTATION DRIVE',dishX-1.18,.98,dishZ+1.755,1.14,.34,null,
    {bg:'#38382c',stripe:'#ba8954'});
  const wrap=[V(turntable.x-1.11,2.14,dishZ+.13),V(turntable.x-1.39,1.71,dishZ+.34),
    V(turntable.x-1.38,1.02,dishZ+.82),V(turntable.x-.76,.86,dishZ+1.26)];
  cable(wrap,.057,mat.rubber);
  cable(wrap.map(p=>p.clone().add(V(-.096,.034,-.06))),.039,mat.oxide);

  const trayPath=[V(.94,.11,-54.09),V(1.72,.09,-54.39),V(3.92,.12,-55.12),V(5.40,.11,-54.68),V(6.24,.61,-53.78)];
  cable(trayPath,.043,mat.oxide);
  cable(trayPath.map(p=>p.clone().add(V(0,.009,.124))),.036,mat.rubber);
  for(const [x,z] of [[1.62,-54.37],[2.51,-54.69],[3.6,-54.94],[4.52,-55.02],[5.41,-54.67]]){
    box(x,.10,z,.141,.073,.41,mat.plate,0,.012);
    box(x,.155,z,.089,.044,.28,mat.edge,0,.008);
  }
  for(const q of [-1,1]){
    const x=8.55+q*.61;
    bar(V(x,.83,-50.92),V(x,2.91,-51.31),.037,mat.oxide);
  }
  for(let step=0;step<7;step++){
    const y=.93+step*.30,z=lerp(-50.94,-51.30,step/7);
    bar(V(7.97,y,z),V(9.13,y,z),.025,mat.zinc);
  }
  box(10.34,1.087,-54.27,.93,.94,.42,mat.blue,0,.035);
  box(10.34,1.35,-54.03,.78,.183,.063,mat.edge,0,.022);
  for(let k=0;k<5;k++)box(10.02+k*.151,1.37,-53.989,.071,.039,.025,k<2?mat.aquaLight:mat.lowLight,0,.008);

  const dish=new T.Group();
  dish.position.set(dishX,6.0,dishZ); dish.rotation.set(-.67,-.52,.15,'YXZ'); scene.add(dish);
  const dishRadius=5.10;
  const dishPoint=(a,r)=>V(Math.cos(a)*r,Math.sin(a)*r,(r*r)*.070);
  const dishMaterials=[0xbac5c1,0xa6b1b8,0x9da9af,0xc0c3b9].map(col=>
    skin(surface(col,'paint',{roughness:.63,metalness:.29,side:T.DoubleSide}),art.paint,{scale:.66,detail:.20,color:.52,rough:.42}));
  for(let panel=0;panel<16;panel++){
    const vertices=[],indices=[];
    const a0=panel*Math.PI/8+.007,a1=(panel+1)*Math.PI/8-.007;
    for(let v=0;v<=13;v++)for(let j=0;j<=5;j++){
      const p=dishPoint(lerp(a0,a1,j/5),lerp(.65,dishRadius,v/13));
      vertices.push(p.x,p.y,p.z);
    }
    for(let v=0;v<13;v++)for(let j=0;j<5;j++){
      const id=v*6+j; indices.push(id,id+6,id+1,id+1,id+6,id+7);
    }
    const g=new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(vertices,3));
    g.setIndex(indices);g.computeVertexNormals();
    const mesh=new T.Mesh(g,dishMaterials[(panel*7+Math.floor(panel/3))%dishMaterials.length]);
    mesh.castShadow=true;mesh.receiveShadow=true;dish.add(mesh);
    const points=[];
    for(let k=0;k<=7;k++){
      const p=dishPoint(panel*Math.PI/8,lerp(.40,dishRadius,k/7));p.z-=.051;points.push(p);
    }
    const ribs=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),9,.043,5,false),mat.edge);
    ribs.castShadow=true;dish.add(ribs);
    for(const r of [1.46,2.70,3.87,4.93]){
      const mount=dishPoint(panel*Math.PI/8+.025,r);
      const fastener=new T.Mesh(hexGeo,mat.zinc);
      fastener.position.copy(mount);
      fastener.scale.set(.054,.045,.054);
      fastener.rotation.x=Math.PI/2;
      dish.add(fastener);
    }
  }
  function dishTube(a,b,r,material){
    const delta=b.clone().sub(a),mesh=new T.Mesh(cylGeo,material);
    mesh.scale.set(r,delta.length(),r); mesh.position.copy(a).lerp(b,.5);
    mesh.quaternion.setFromUnitVectors(Y,delta.normalize()); mesh.castShadow=true;dish.add(mesh);
  }
  for(const r of [1.47,3.88,dishRadius]){
    const rim=new T.Mesh(new T.TorusGeometry(r,r===dishRadius?.068:.028,7,96),r===dishRadius?mat.oxide:mat.zinc);
    rim.position.z=r*r*.070-.026; rim.castShadow=true;dish.add(rim);
  }
  const feed=V(.02,-.03,3.46);
  for(const q of [0,1,2]){
    const a=q*Math.PI*2/3+.21;
    dishTube(dishPoint(a,4.86),feed,.068,mat.edge);
    dishTube(dishPoint(a+.12,4.27),feed.clone().multiplyScalar(.83),.034,mat.zinc);
  }
  dishTube(V(0,0,.12),V(0,0,3.48),.153,mat.oxide);
  dishTube(V(0,0,3.27),V(0,0,3.77),.315,mat.graphite);
  const dishLight=lit(0xff6330,2.7);
  dishTube(V(0,0,3.73),V(0,0,3.82),.228,dishLight);
  dishTube(V(0,0,-.53),V(0,0,.12),.77,mat.blue);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4+.18;
    const rim=dishPoint(a,4.76),knee=dishPoint(a,2.72);
    rim.z-=.19;knee.z-=.50;
    const hub=V(Math.cos(a)*.67,Math.sin(a)*.67,-.65);
    dishTube(hub,knee,.092,mat.oxide);
    dishTube(knee,rim,.067,mat.zinc);
    const cross=dishPoint(a+.43,3.90);
    cross.z-=.21;
    dishTube(knee,cross,.039,mat.plate);
  }
  const centralHub=new T.Mesh(new T.TorusGeometry(.812,.073,8,36),mat.zinc);
  centralHub.position.z=-.48;centralHub.castShadow=true;dish.add(centralHub);
  const innerFeed=new T.Mesh(new T.TorusGeometry(.245,.032,6,24),mat.plate);
  innerFeed.position.set(0,0,3.71);dish.add(innerFeed);

  // The bridge drops away from the glacier and carries the return car.
  rails(-2.2,-64.65,-81.8); rails(2.2,-64.65,-81.8);
  for(let j=0;j<22;j++){
    const z=-64.65-j*.82;
    box(0,.070,z,4.46,.097,.811,mat.deck);
    box(0,.118,z-.396,4.50,.044,.059,mat.plate);
    if(j%4===1){
      box(0,-.18,z,4.71,.26,.22,mat.oxide);
      bollard(-2.13,z); bollard(2.13,z);
    }
  }
  for(const x of [-1.76,1.76]){
    bar(V(x,-.35,-64.8),V(x,-.35,-82.05),.13,mat.edge);
    bar(V(x,-.53,-67.0),V(x,-2.2,-75.0),.095,mat.oxide);
    bar(V(x,-2.2,-75.0),V(x,-.45,-81.2),.095,mat.oxide);
  }
  for(const q of [-1,1]){
    const x=q*2.25;
    box(x,2.9,-78,.27,5.86,.34,mat.oxide,0,.036);
    box(x,.24,-78,.46,.49,.55,mat.steel,0,.03);
    bar(V(x,4.89,-78),V(x,3.08,-75.64),.063,mat.zinc);
  }
  box(0,5.67,-78,4.82,.34,.42,mat.oxide,0,.04);
  sign('RETURN','AERIAL CABLE / PLATFORM',0,5.21,-77.74,2.21,.55,null,{bg:'#303d41'});

  // Open transfer gantry. The canopy and cable guides are carried by the two frames.
  const transferZ=-78.0;
  for(const side of [-1,1]){
    const x=side*2.25;
    box(x,2.60,-81.24,.22,5.22,.27,mat.zinc,0,.026);
    box(x,5.58,-79.62,.23,.27,3.62,mat.edge,0,.025);
    box(x,3.56,-79.62,.17,.13,3.36,mat.zinc,0,.016);
    bar(V(x,3.62,-81.16),V(x,5.28,-78.12),.049,mat.oxide,hexGeo);
    bar(V(x,3.62,-78.13),V(x,5.28,-81.20),.049,mat.oxide,hexGeo);
    for(const z of [transferZ,-81.24]){
      box(x,.168,z,.44,.17,.45,mat.steel,0,.037);
      box(x,3.52,z,.33,.28,.31,mat.oxide,0,.019);
      box(x,4.97,z,.31,.22,.32,mat.zinc,0,.014);
      for(const bolt of [-1,1]){
        batch(hexGeo,mat.edge,V(x+bolt*.087,3.52,z+.174),V(.029,.045,.029),boltRot);
        batch(hexGeo,mat.oxide,V(x+bolt*.113,.274,z+.17),V(.029,.034,.029),null);
      }
    }
    for(let j=0;j<7;j++){
      const z=-78.29-j*.407;
      const cover=1.09-j*.045;
      box(side*1.73,5.77,z,cover,.064,.397,mat.plate,0,.016);
      box(side*1.91,5.82,z-.024,cover*.68,.057,.358,mat.snow,0,.026);
    }
    box(x,1.81,-80.46,.091,.097,2.79,mat.zinc,0,.021);
    box(x,1.33,-80.52,.088,.71,.47,mat.oxide,0,.026);
    sign(side===1?'BRAKE':'GEAR','LOCK BEFORE SERVICE',x-side*.052,1.43,-80.50,.392,.21,
      new T.Euler(0,-side*Math.PI/2,0),{bg:'#423f33',fg:'#e6c394',stripe:'#f3ae66'});
    box(x-side*.052,1.13,-80.51,.029,.060,.087,side===1?mat.redLight:mat.lowLight,0,.012);
    cable([V(x-side*.045,.91,-80.49),V(x-side*.252,.69,-80.61),V(x-side*.051,.25,-80.85),V(x,.149,-81.19)],.024,mat.rubber);
  }
  box(0,5.54,-81.24,4.73,.25,.29,mat.oxide,0,.033);
  for(const x of [-.59,.59]){
    box(x,5.31,-81.23,.18,.23,.36,mat.zinc,0,.022);
    box(x,5.21,-81.08,.117,.060,.10,mat.edge,0,.015);
  }
  box(0,5.26,-81.04,.296,.098,.101,mat.whiteLight,0,.023);
  point(0,4.94,-81.11,0xc4dbff,24,7.8);
  const line=[V(0,5.49,-68),V(0,5.64,-78),V(0,5.43,-88),V(.24,5.02,-102),V(1,3.94,-118),V(9,-2.6,-180),V(27,17,-244),V(33,25,-271)];
  const track=new T.CatmullRomCurve3(line);
  for(const x of [-.31,.31])cable(line.map(p=>p.clone().add(V(x,0,0))),.039,mat.edge);
  for(const t of [.325,.713]){
    const {x,y,z}=track.getPointAt(t);
    const head=y-.24;
    const widthAt=t=>lerp(2.63,.72,t), depthAt=t=>lerp(1.01,.32,t);
    const base=Math.min(head-3.1,elevation(x,z)+.15);
    const tiers=Math.ceil((head-base)/5.6);
    for(const q of [-1,1])for(const side of [-1,1]){
      const px=x+q*widthAt(0),pz=z+side*depthAt(0);
      const footing=elevation(px,pz);
      box(px,footing+.25,pz,.87,.94,.75,mat.concrete,0,.06);
      box(px,footing+.80,pz,.54,.22,.54,mat.plate,0,.026);
      bar(V(px,footing+.87,pz),V(x+q*widthAt(1),head,z+side*depthAt(1)),.149,mat.steel,hexGeo);
    }
    for(let j=0;j<tiers;j++){
      const p0=j/tiers,p1=(j+1)/tiers;
      const lo=lerp(base+1.02,head,p0),hi=lerp(base+1.02,head,p1);
      const wide=widthAt(p0),narrow=widthAt(p1);
      const depth=depthAt(p0),nextDepth=depthAt(p1);
      for(const q of [-1,1]){
        bar(V(x-q*wide,lo,z+q*depth),V(x+q*narrow,hi,z+q*nextDepth),.064,mat.zinc);
        bar(V(x-wide,lo,z+q*depth),V(x+wide,lo,z+q*depth),.079,mat.steel);
        bar(V(x+q*wide,lo,z-depth),V(x+q*narrow,hi,z+nextDepth),.057,mat.zinc);
      }
    }
    box(x,head,z,2.91,.39,.97,mat.oxide,0,.042);
    for(const q of [-1,1]){
      const rail=x+q*.76;
      bar(V(rail,head-.33,z-.51),V(rail,head-.33,z+.58),.038,mat.zinc);
      bar(V(rail,head-.33,z+.47),V(rail,head+.68,z+.47),.025,mat.edge);
      box(x+q*.31,head+.19,z,.225,.23,1.16,mat.edge,0,.034);
      box(x+q*.31,head+.33,z,.117,.14,.30,mat.graphite,0,.041);
      box(x+q*1.24,head+.30,z,.144,.17,.194,mat.redLight,0,.035);
    }
  }
  const tram=new T.Group();
  scene.add(tram);
  function tramShell(x,y,z,w,h,d,material,r=.065,parent=tram){
    const mesh=new T.Mesh(new RoundedBoxGeometry(w,h,d,3,r),material);
    mesh.position.set(x,y,z);mesh.castShadow=!material.transparent;mesh.receiveShadow=true;parent.add(mesh);
    return mesh;
  }
  const windowGlass=new T.MeshPhysicalMaterial({color:0x9ab7b6,metalness:.13,roughness:.31,envMapIntensity:.51,
    clearcoat:.38,clearcoatRoughness:.41,transparent:true,opacity:.16,depthWrite:false,side:T.DoubleSide});
  windowGlass.defines.USE_UV='';
  windowGlass.onBeforeCompile=shader=>{
    shader.uniforms.frostMap={value:art.snow[0]};
    shader.fragmentShader='uniform sampler2D frostMap;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`
      #include <color_fragment>
      vec2 border=min(vUv,1.-vUv);
      float crystals=texture2D(frostMap,vUv*vec2(1.51,1.79)+vec2(.67,.37)).r;
      float runoff=texture2D(frostMap,vUv*vec2(4.48,.16)+vec2(.39,.14)).r;
      float rim=1.-smoothstep(.006,.115,min(border.x,border.y)+crystals*.043);
      float fogged=rim*smoothstep(.13,.46,.13+crystals*.45+runoff*.21);
      float frostThreads=smoothstep(.48,.84,crystals*.58+runoff*.42);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.43,.54,.58),fogged*.65);
      diffuseColor.a+=fogged*.39+frostThreads*.075;
    `);
  };
  const headLight=lit(0xffce98,5.1), cabinLight=lit(0xffe0b4,.72);
  const cabPaint=skin(surface(0xb9693b,'paint',{metalness:.16,roughness:.45}),art.paint,{detail:.52,color:.63,scale:1.38});
  const trimPaint=skin(surface(0xa69e86,'paint',{metalness:.32,roughness:.43}),art.paint,{detail:.42,color:.51,scale:1.62});
  const insidePaint=skin(surface(0x6e5d4a,'paint',{roughness:.82,emissive:0x473624,emissiveIntensity:.13}),art.paint,{detail:.28,color:.41,scale:1.05});
  const cabinRoof=skin(surface(0x585b56,'paint',{metalness:.21,roughness:.61,emissive:0x332d22,emissiveIntensity:.08}),art.paint,{detail:.24,color:.38,scale:1.29});
  const upholstery=new T.MeshPhysicalMaterial({color:0x4f665f,roughness:.91,sheen:.81,sheenColor:0x728272,sheenRoughness:.88});
  const binding=new T.MeshPhysicalMaterial({color:0x294442,roughness:.84,sheen:.48,sheenColor:0x52646c});
  skin(upholstery,art.fabric,{uv:true,detail:.80,color:.82});
  skin(binding,art.fabric,{uv:true,detail:.67,color:.38});
  const cabinSeam=new T.MeshStandardMaterial({color:0xa28a63,roughness:.86});
  const stitches=new T.InstancedMesh(boxGeo,cabinSeam,176);
  const stitchTransform=new T.Object3D();
  let stitchIndex=0;
  function seatStitch(x,y,z,w,h,d){
    stitchTransform.position.set(x,y,z);
    stitchTransform.scale.set(w,h,d);
    stitchTransform.updateMatrix();
    stitches.setMatrixAt(stitchIndex++,stitchTransform.matrix);
  }
  stitches.receiveShadow=true;
  tram.add(stitches);
  tramShell(0,.296,0,2.72,.43,3.02,mat.edge,.143);
  tramShell(0,.506,0,2.76,.15,3.02,trimPaint,.072);
  tramShell(0,.744,0,2.70,.51,2.98,cabPaint,.16);
  tramShell(0,1.005,0,2.71,.075,2.983,trimPaint,.030);
  tramShell(0,3.048,0,2.72,.28,2.97,cabPaint,.116);
  tramShell(0,3.199,0,2.63,.17,2.88,mat.graphite,.071);
  tramShell(0,3.274,-.088,2.30,.052,2.55,mat.snow,.025);
  tramShell(0,2.869,0,2.13,.12,2.37,cabinRoof,.04);
  for(const z of [-.71,.06,.82]){
    tramShell(0,2.803,z,2.044,.026,.084,mat.graphite,.011);
    for(const x of [-.87,.87])tramShell(x,2.782,z,.069,.032,.097,trimPaint,.014);
  }
  for (const x of [-.72,.72]) {
    tramShell(x,2.797,.14,.18,.042,1.66,mat.edge,.012);
    tramShell(x,2.77,.14,.113,.023,1.61,cabinLight,.01);
  }
  for(const sx of [-1,1]){
    for(const sz of [-1,1]){
      const corner=tramShell(sx*1.202,1.941,sz*1.328,.153,1.94,.21,cabPaint,.057);
      corner.rotation.y=sx*sz*.69;
    }
    tramShell(sx*1.342,1.941,0,.114,1.94,.096,mat.graphite,.033);
    tramShell(sx*1.316,1.504,0,.083,.077,2.64,mat.graphite,.027);
    for(const z of [-.668,.668]){
      tramShell(sx*1.322,2.188,z,.039,1.390,1.29,windowGlass,.013);
      tramShell(sx*.95,1.177,z,.52,.20,1.22,insidePaint,.041);
      tramShell(sx*.92,1.326,z,.51,.164,1.20,upholstery,.058);
      const backrest=tramShell(sx*1.123,1.514,z,.169,.377,1.20,upholstery,.064);
      backrest.rotation.z=-sx*.116;
      tramShell(sx*.683,1.319,z,.045,.049,1.144,binding,.022);
      tramShell(sx*1.043,1.660,z,.035,.037,1.145,binding,.015);
      for(let j=0;j<22;j++){
        const along=z-.526+j*.050;
        seatStitch(sx*.715,1.402,along,.011,.003,.019);
        seatStitch(sx*1.037,1.568,along,.004,.012,.015);
      }
    }
    tramShell(sx*1.061,.78,1.477,.293,.229,.16,mat.graphite,.055);
    tramShell(sx*1.061,.78,1.56,.187,.132,.034,headLight,.027);
    tramShell(sx*1.061,.78,-1.48,.25,.17,.12,mat.edge,.030);
    tramShell(sx*1.061,.78,-1.549,.15,.087,.031,mat.redLight,.017);
    tramShell(sx*1.367,1.167,.33,.085,.094,.421,mat.zinc,.023);
    const suspension=tramShell(sx*.39,4.776,0,.16,2.76,.22,mat.zinc,.051);
    suspension.rotation.z=sx*.071;
    tramShell(sx*.31,6.26,0,.34,.283,.55,mat.edge,.051);
    for(const z of [-.18,.18]){
      const pulley=new T.Mesh(cylGeo,mat.plate);
      pulley.position.set(sx*.32,6.34,z);pulley.scale.set(.141,.164,.141);pulley.rotation.z=Math.PI/2;tram.add(pulley);
    }
  }
  for(const side of [-1,1]){
    const x=side*1.358;
    for(const [z,len] of [[-.89,.80],[.57,1.12]]){
      tramShell(x,.74,z,.048,.298,len,mat.edge,.032);
      tramShell(x+side*.027,.74,z,.031,.230,len-.067,trimPaint,.029);
      for(let j=0;j<5;j++)tramShell(x+side*.050,.674+j*.032,z,.018,.012,len-.206,mat.graphite,.005);
    }
    tramShell(side*.38,5.92,0,.212,.318,.59,mat.graphite,.034);
    for(const z of [-.18,.18]){
      const hub=new T.Mesh(hexGeo,mat.edge);
      hub.position.set(side*.415,6.34,z);hub.scale.set(.053,.07,.053);
      hub.rotation.z=Math.PI/2;tram.add(hub);
    }
    for(const z of [-1.02,1.02]){
      tramShell(side*1.155,1.89,z,.123,.065,.37,mat.zinc,.028);
      tramShell(side*1.11,1.89,z,.037,.059,.46,trimPaint,.016);
      tramShell(side*.89,1.423,z,.36,.031,.044,mat.graphite,.015);
    }
  }
  tramShell(0,6.12,0,.82,.079,.32,mat.zinc,.021);
  tramShell(0,3.84,0,1.09,.248,.64,mat.edge,.057);
  const doors=[];
  tramShell(0,1.29,-1.484,2.38,.61,.07,cabPaint,.044);
  for(const side of [-1,1]){
    const x=side*.73;
    tramShell(x,1.337,-1.424,.75,.47,.069,insidePaint,.049);
    tramShell(x,1.246,-1.375,.52,.205,.028,mat.edge,.013);
    for(let n=0;n<7;n++)tramShell(x-.201+n*.067,1.246,-1.357,.027,.137,.014,mat.zinc,.007);
    for(const end of [-1,1])tramShell(x+end*.31,1.466,-1.381,.023,.023,.020,mat.plate,.005);
  }
  const emergencyCard=new T.Mesh(planeGeo,new T.MeshStandardMaterial({
    map:signTexture('STOP','EMERGENCY / INTERCOM',{bg:'#413331',fg:'#e4c6a6',stripe:'#e87857'}),roughness:.85,
  }));
  emergencyCard.position.set(.792,1.437,-1.371);emergencyCard.scale.set(.408,.122,1);tram.add(emergencyCard);
  tramShell(-.851,1.407,-1.365,.32,.125,.057,mat.graphite,.025);
  tramShell(-.958,1.401,-1.330,.041,.042,.024,mat.orangeLight,.011);
  tramShell(0,2.23,-1.484,.057,1.37,.080,trimPaint,.019);
  for(const side of [-1,1]){
    tramShell(side*.6,2.23,-1.484,1.151,1.30,.030,windowGlass,.014);
    const sliding=new T.Group();tram.add(sliding);doors.push(sliding);
    sliding.position.set(side*.58,0,1.492);
    tramShell(0,1.295,0,1.12,.61,.09,cabPaint,.038,sliding);
    tramShell(0,2.21,0,1.025,1.21,.034,windowGlass,.015,sliding);
    for(const edge of [-1,1]){
      tramShell(0,2.21+edge*.631,0,1.12,.072,.085,trimPaint,.026,sliding);
      tramShell(edge*.544,1.962,0,.075,1.93,.085,mat.graphite,.026,sliding);
    }
    const pull=tramShell(-side*.381,1.73,.065,.17,.059,.060,mat.zinc,.015,sliding);
    pull.rotation.z=side*.16;
    const wiper=tramShell(side*.23,1.93,.043,.026,.39,.032,mat.graphite,.010,sliding);
    wiper.rotation.z=-.67;
  }
  tramShell(0,.976,1.483,2.34,.070,.13,mat.deck,.023);
  tramShell(0,2.904,1.504,2.39,.088,.11,mat.graphite,.022);
  const insignia=new T.Mesh(planeGeo,new T.MeshStandardMaterial({
    map:signTexture('03','BOREAL / RETURN',{bg:'#51423a',stripe:'#f4bc76'}),roughness:.65,
  }));
  insignia.position.set(0,.805,1.498);insignia.scale.set(.66,.223,1);tram.add(insignia);
  tramShell(0,3.461,0,1.68,.302,1.43,mat.graphite,.087);
  tramShell(0,3.621,0,1.33,.17,.98,trimPaint,.047);
  const cabin=new T.PointLight(0xffddba,4.1,3.5,2);
  cabin.position.set(.23,2.63,.34);tram.add(cabin);
  const tangent=new T.Vector3();
  function parkCar(t){
    const departure=Math.max(0,t-2.58);
    const p=clamp(.069+(.0066*departure+.00327*departure**2),.069,.58);
    track.getPointAt(p,tram.position);
    track.getTangentAt(p,tangent);
    tram.position.y-=6.45;
    tram.rotation.set(tangent.y*.21,Math.atan2(-tangent.x,-tangent.z),Math.sin(departure*2.44)*.043*Math.exp(-.33*departure));
    const opening=smoothstep(t,.07,.53)*(1-smoothstep(t,1.98,2.53));
    doors.forEach((door,i)=>{
      const side=i===0?-1:1;
      door.position.x=side*(.58+opening*.97);
      door.position.z=1.492-opening*.223;
      door.rotation.y=side*opening*.79;
    });
  }

  block(0,1.02,-82.16,4.54,2.10,.24,'rail');

  for(let i=0;i<85;i++){
    const z=28-rand()*91,x=(rand()<.5?1:-1)*(3.5+rand()*10.1);
    if(z>-31.9 && z<-11.5) continue;
    const size=.21+rand()*.82;
    batch(rockGeo,mat.snow,V(x,shelfHeight(x,z)-.030,z),V(size,.08+rand()*.10,size*(.35+rand()*.45)),new T.Euler(0,rand()*6,0));
  }
  block(-22.2,2,-13,12.65,13,110,'bounds');
  block(22.2,2,-13,12.65,13,110,'bounds');
  // The access shelf ends at an avalanche drop. A visible barrier occupies its collision line.
  const dropZ=36.19;
  for(let i=-5;i<=5;i++){
    const x=i*2.88,y=groundAt(x,dropZ);
    box(x,y+.089,dropZ,.46,.25,.51,mat.concrete,0,.038);
    box(x,y+.75,dropZ,.112,1.42,.13,mat.oxide,0,.018);
    box(x,y+1.45,dropZ,.142,.083,.163,mat.plate,0,.019);
    for(const level of [.44,.86,1.40]){
      if(i<5)bar(V(x,y+level,dropZ),V(x+2.88,groundAt(x+2.88,dropZ)+level,dropZ),level>1?.058:.034,level>1?mat.oxide:mat.zinc);
    }
    if(i%2===0)box(x+.11,y+1.06,dropZ-.089,.32,.094,.025,mat.stripe,0,.01);
  }
  sign('落差 / DROP','维护道路止于此处',-.71,1.36,dropZ-.101,1.35,.48,new T.Euler(0,Math.PI,0),
    {bg:'#352c25',fg:'#f3ddba',stripe:'#db8b4b'});
  sign('07','中继站 / RELAY  →',3.33,1.19,dropZ-.11,1.03,.34,new T.Euler(0,Math.PI,0),
    {bg:'#313d43',stripe:'#e89b63'});
  for(const [x,z,w,h,d] of [[-15.8,34.1,2.9,2.45,4.8],[-16,37.4,4.8,3.2,3.8],[17.5,34.7,4.7,3.6,5.4],[15.8,37.8,3.5,2.7,4.5],[-12.1,40.1,4.3,2.4,4.2],[11.3,39.7,3.6,1.3,5.2]]){
    rock(x,z,w,h,d);
  }
  block(0,2.1,36.60,35,8,1.0,'bounds');
  block(0,1.03,dropZ,29.1,1.54,.11,'rail');
  block(-12.67,2.0,-21.75,4.83,8,20.1,'bounds');
  block(12.67,2.0,-21.75,4.83,8,20.1,'bounds');
  block(-7.73,1.9,-75,10.90,8,19.45,'bounds');
  block(7.73,1.9,-75,10.90,8,19.45,'bounds');
  block(0,1.9,-86,33,8,1,'bounds');
  buildStation({box,wall,block,bar,cable,batch,point,sign,mat,groundAt,attachProp,coldTubes});
  // Fixed fixtures fill shadow atlases once during scene setup.
  fixedSpot(V(-4.31,3.67,-23.47),V(-6.15,.10,-25.36),
    {color:0xffc899,power:124,range:9.6,angle:.65,penumbra:.69});
  fixedSpot(V(5.15,3.90,-20.92),V(1.55,.16,-23.27),
    {color:0x89bded,power:220,range:12,angle:.54,penumbra:.64});
  fixedSpot(V(11.29,5.74,-53.17),V(4.9,.58,-48.4),
    {color:0xffb980,power:328,range:16.8,angle:.55,penumbra:.63});
  const rockSectors=new Map();
  for(const {geometry,sector,matrix} of rockUnits){
    const key=sector+':'+geometry.id;
    if(!rockSectors.has(key))rockSectors.set(key,{geometry,matrices:[]});
    rockSectors.get(key).matrices.push(matrix);
  }
  for(const {geometry,matrices} of rockSectors.values()){
    const boulders=new T.InstancedMesh(geometry,art.rockMaterial,matrices.length);
    matrices.forEach((matrix,index)=>boulders.setMatrixAt(index,matrix));
    boulders.computeBoundingSphere();
    boulders.castShadow=true;boulders.receiveShadow=true;
    staticGroup.add(boulders);
  }
  for(const {material,shadow,parts} of batches.values()){
    const merged=mergeGeometries(parts);
    for(const part of parts)part.dispose();
    const mesh=new T.Mesh(merged,material);
    mesh.receiveShadow=true; mesh.castShadow=shadow; staticGroup.add(mesh);
  }
  batches.clear();
  for(let i=0;i<5;i++){
    const light=new T.PointLight(0xffffff,0,0,2);
    scene.add(light);lights.push(light);lightSlots.push({fixture:null,weight:0});
  }
  // Shots use the render triangles for contacts. Movement and navigation keep their broad colliders.
  const receivers=[];
  const categories=new Map([
    [mat.snow,'snow'],[mat.rock,'rock'],[mat.hallFloor,'concrete'],[mat.plaster,'concrete'],
    [mat.concrete,'concrete'],[mat.road,'rock'],[apronMat,'concrete'],
  ]);
  function registerReceiver(mesh, moving=null){
    if(!mesh.isMesh||mesh.isInstancedMesh||mesh.material.alphaTest>0||mesh.material.userData.noImpact)return;
    const {material}=mesh;
    if(material.transparent&&material!==mat.road)return;
    const type=mesh.userData.receiver||categories.get(material)||'metal';
    mesh.geometry.computeBoundingBox();
    receivers.push({mesh,type,moving,bounds:new T.Box3().copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld)});
  }
  scene.updateMatrixWorld(true);
  staticGroup.traverse(mesh=>registerReceiver(mesh));
  const rockReceivers=new Map([art.rockGeometry,art.fieldGeometry].map(geometry=>{
    geometry.computeBoundingBox();
    return [geometry,new T.Mesh(geometry,art.rockMaterial)];
  }));
  for(const {matrix,geometry} of rockUnits){
    receivers.push({mesh:rockReceivers.get(geometry),type:'rock',matrix,bounds:geometry.boundingBox.clone().applyMatrix4(matrix)});
  }
  for(const gate of [serviceGate,extractGate])gate.group.traverse(mesh=>registerReceiver(mesh,gate.group));
  const impactRay=new T.Raycaster();
  const normalMatrix=new T.Matrix3();
  const boundsPoint=V(),rayHit=[];
  function traceVisible(origin,direction,limit){
    impactRay.set(origin,direction);
    impactRay.near=.04;
    impactRay.far=limit;
    let chosen=null;
    for(const {mesh,type,moving,bounds,matrix} of receivers){
      if(!moving&&(!impactRay.ray.intersectBox(bounds,boundsPoint)||boundsPoint.distanceToSquared(origin)>impactRay.far**2&& !bounds.containsPoint(origin)))continue;
      if(matrix)mesh.matrixWorld.copy(matrix);
      rayHit.length=0;
      impactRay.intersectObject(mesh,false,rayHit);
      const hit=rayHit[0];
      if(!hit||hit.distance>=impactRay.far)continue;
      const normal=hit.face.normal.clone().applyNormalMatrix(normalMatrix.getNormalMatrix(mesh.matrixWorld));
      if(normal.dot(direction)>0)normal.negate();
      impactRay.far=hit.distance;
      chosen={t:hit.distance,point:hit.point,normal,type:matrix&&normal.y>.76?'snow':type,parent:moving};
    }
    return chosen;
  }
  const readSnow=sampleHeight(shelf.geometry,-62,62,-109,48);
  const readRoad=sampleHeight(road.geometry,-3.42,3.42,-11.42,32.6);
  const tracks=makeTracks(scene,(x,z)=>{
    const y=readSnow(x,z);
    return z>-11.42&&z<32.6&&Math.abs(x)<3.42?Math.max(y,readRoad(x,z)):y;
  });
  function print(x,z,yaw,foot){
    if(z<-11.5 && z>-32.2 || z<-64.8) return;
    tracks.stamp(x,z,yaw,foot);
  }
  const updatedTracks=new Map();
  const panels=[relayPanel,uplinkPanel,evacPanel];
  function pressPanel(panel) {
    panel.pressed=0;
  }
  function updatePanels(dt) {
    for(const p of panels){
      if(p.pressed<0)continue;
      p.pressed+=dt;
      const depth=smoothstep(p.pressed,0,.093)*(1-smoothstep(p.pressed,.15,.34));
      p.control.position.set(p.travel.x,p.travel.y-depth*.024,p.travel.z+depth*.012);
      if(p.pressed>.34)p.pressed=-1;
    }
  }
  function panelState(p,text,sub,active=false){
    const {screen}=p,key=text+sub;
    if(!updatedTracks.has(key)) updatedTracks.set(key,signTexture(text,sub,{bg:active?'#173739':'#192f38',fg:active?'#d2fff1':'#a8e3e3',stripe:active?'#6affdc':'#ff976b',layout:'terminal'}));
    screen.material.map=updatedTracks.get(key); screen.material.needsUpdate=true;
    p.button.material=active?mat.aquaLight:mat.orangeLight;
  }
  function moveGate(g,open,dt){
    g.amount=lerp(g.amount,open?1:0,1-Math.exp(-3.88*dt));
    g.group.position.y=g.amount*3.44;
    g.obstruction.active=g.amount<.72;
    g.frontRay.material=g.backRay.material=open?mat.aquaLight:mat.redLight;
  }
  function reset(checkpoint=false){
    for(const [g,state] of [[serviceGate,checkpoint],[extractGate,false]]){
      g.amount=state?1:0; moveGate(g,state,0);
    }
    tracks.reset();
    for(const p of panels){p.pressed=-1;p.control.position.copy(p.travel);}
    switchAge=checkpoint?3:0;
    coldFeeds.fill(checkpoint?1:0);
    panelState(relayPanel,checkpoint?'ONLINE':'BYPASS',checkpoint?'POWER RESTORED':'MANUAL POWER  /  E',checkpoint);
    panelState(uplinkPanel,'UPLINK','SEND RESCUE FIX  /  E');
    panelState(evacPanel,'CABLE','RETURN CAR  /  E');
    parkCar(0);
  }
  const lightDistance=p=>(p.x-o.position.x)**2+(p.y-o.position.y)**2+(p.z-o.position.z)**2
    +(p.feed!==null&&coldFeeds[p.feed]<.09?10000:0);
  let lastLightingTime=-1;
  let nearbyFixtures=[];
  function update(time,dt,cam,state){
    tracks.update(dt);
    hallFilm.visible=cam.z<-11.0&&cam.z>-32.2&&cam.y>0.17;
    updatePanels(dt);
    moveGate(serviceGate,state.powered,dt); moveGate(extractGate,state.extraction,dt);
    switchAge=state.powered?Math.min(3,switchAge+dt):0;
    for(let i=0;i<coldFeeds.length;i++){
      const afterSwitch=switchAge-i*.28;
      const striking=smoothstep(afterSwitch,.12,.79);
      const warmth=1-.32*Math.exp(-Math.max(0,afterSwitch)*5.)*(1+Math.sin(afterSwitch*38.));
      coldFeeds[i]=striking*warmth;
      coldTubes[i].emissiveIntensity=.035+2.5*coldFeeds[i];
    }
    const target=state.extraction?-.34:state.uplink?-.49+Math.sin(time*.56)*.082:-.67;
    dish.rotation.x=lerp(dish.rotation.x,target,1-Math.exp(-.53*dt));
    const heading=state.extraction?-.31:state.uplink?-.39+Math.sin(time*.39)*.11:-.52;
    dish.rotation.y=lerp(dish.rotation.y,heading,1-Math.exp(-.53*dt));
    dishLight.emissiveIntensity=state.uplink?3.2+(Math.sin(time*7.5)*.5+.5)*1.83:1.33+Math.sin(time*2.4)*.36;
    dishLight.emissive.setHex(state.extraction?0x45ebd9:0xff6330);
    if(time-lastLightingTime>.12){
      o.position.copy(cam);
      trackedLights.sort((a,b)=>lightDistance(a)-lightDistance(b));
      nearbyFixtures=trackedLights.slice(0,lights.length);
      lastLightingTime=time;
    }
    // Fade out a departing fixture before moving its light to the next one.
    for(let i=0;i<lights.length;i++){
      const slot=lightSlots[i],dst=lights[i];
      if(!slot.fixture||slot.weight<.019&&!nearbyFixtures.includes(slot.fixture)){
        const next=nearbyFixtures.find(f=>!lightSlots.some(s=>s.fixture===f));
        if(next){
          slot.fixture=next;
          dst.position.set(next.x,next.y,next.z);
          dst.color.setHex(next.color);
          dst.distance=next.range;
        }
      }
      const src=slot.fixture;
      if(!src)continue;
      slot.weight=lerp(slot.weight,nearbyFixtures.includes(src)?1:0,1-Math.exp(-dt*18));
      dst.intensity=src.intensity*slot.weight*(src.feed===null?1:coldFeeds[src.feed]);
    }
    if(state.cinematic>=0)parkCar(state.cinematic);
  }
  reset();
  return {colliders,traceVisible,relay,uplink,evac,front,groundAt,footSurface,mat,print,update,reset,panelState,pressPanel,relayPanel,uplinkPanel,evacPanel,tram,dish};
}






