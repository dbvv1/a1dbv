import { skin } from './cinematic-assets.js';
import { sleeve, handOrientation } from './first-person.js';
import { gloveMaterial, makeGlove } from './glove-rig.js';
import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { canvasTexture, lit, randomGen, surface } from './visual.js';

const { clamp,damp,lerp }=T.MathUtils;
const V=(x,y,z)=>new T.Vector3(x,y,z);
const Y=V(0,1,0), Z=V(0,0,1);
const box=new T.BoxGeometry();
const cylinder=new T.CylinderGeometry(1,1,1,12);
const hex=new T.CylinderGeometry(1,1,1,6);
const orb=new T.SphereGeometry(1,24,16);
const shardGeo=new T.IcosahedronGeometry(1,0);
const rounded=new Map();
export const controlContact=.245;
function mesh(parent,geometry,material,x,y,z,sx=1,sy=1,sz=1,shadow=true){
  const obj=new T.Mesh(geometry,material);
  obj.position.set(x,y,z); obj.scale.set(sx,sy,sz);
  obj.castShadow=shadow; obj.receiveShadow=shadow; parent.add(obj);
  return obj;
}
function casePiece(parent,mat,x,y,z,w,h,d,r=.02){
  if(r===0)return mesh(parent,box,mat,x,y,z,w,h,d);
  const key=[w,h,d,r].join();
  if(!rounded.has(key))rounded.set(key,new RoundedBoxGeometry(w,h,d,3,r));
  return mesh(parent,rounded.get(key),mat,x,y,z);
}
function part(parent,mat,a,b,r,geo=cylinder){
  const delta=b.clone().sub(a), mid=a.clone().lerp(b,.5);
  const obj=mesh(parent,geo,mat,mid.x,mid.y,mid.z,r,delta.length(),r);
  obj.quaternion.setFromUnitVectors(Y,delta.normalize());return obj;
}
function ring(parent,mat,x,y,z,r,thick,hor=false){
  const obj=mesh(parent,new T.TorusGeometry(r,thick,8,24),mat,x,y,z);
  if(hor)obj.rotation.x=Math.PI/2;
  return obj;
}
function panelLabel(top,bottom,bg='#293b40',fg='#b4e0dc'){
  return new T.MeshBasicMaterial({map:canvasTexture(256,128,(c,w,h)=>{
    c.fillStyle=bg;c.fillRect(0,0,w,h);
    c.fillStyle='#78d9cd';c.fillRect(11,11,4,100);
    c.fillStyle=fg;c.font='800 63px Consolas';c.fillText(top,25,69,211);
    c.fillStyle='#8ca6ac';c.font='700 17px Consolas';c.fillText(bottom,26,102,211);
  })});
}
function bevelProfile(parent,mat,points,depth,x,y,z){
  const shape=new T.Shape();
  points.forEach(([a,b],i)=>i===0?shape.moveTo(a,b):shape.lineTo(a,b)); shape.closePath();
  const geo=new T.ExtrudeGeometry(shape,{depth,curveSegments:1,bevelEnabled:true,steps:1,bevelSize:.006,bevelThickness:.007,bevelSegments:2});
  geo.translate(0,0,-depth*.5);geo.rotateY(Math.PI/2);
  return mesh(parent,geo,mat,x,y,z);
}
function receiverShell(parent,material){
  const ribs=[[-.427,.021,-.061,.043],[-.405,.051,-.072,.072],[-.370,.061,-.081,.091],
    [-.215,.067,-.088,.091],[-.055,.070,-.092,.091],[.038,.063,-.084,.084],
    [.091,.048,-.044,.061],[.128,.042,-.035,.040],[.139,.023,-.023,.029]];
  const vertices=[],indices=[];
  for(const [z,w,lo,hi] of ribs){
    const chamfer=w*.21;
    for(const [x,y] of [[w,lo+chamfer],[w-chamfer,lo],[-w+chamfer,lo],[-w,lo+chamfer],
      [-w,hi-chamfer],[-w+chamfer,hi],[w-chamfer,hi],[w,hi-chamfer]])vertices.push(x,y,z);
  }
  for(let i=0;i<ribs.length-1;i++)for(let j=0;j<8;j++){
    const a=i*8+j,b=i*8+(j+1)%8;
    indices.push(a,a+8,b,b,a+8,b+8);
  }
  const end=(ribs.length-1)*8;
  for(let i=1;i<7;i++)indices.push(0,i,i+1,end,end+i+1,end+i);
  const geo=new T.BufferGeometry();
  geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setIndex(indices);
  const facets=geo.toNonIndexed();facets.computeVertexNormals();geo.dispose();
  return mesh(parent,facets,material,0,0,0);
}
export function createWeapon(camera,art){
  const rig=new T.Group(), core=new T.Group(), handL=new T.Group(), handR=new T.Group();
  camera.add(rig); rig.add(core,handL,handR);
  rig.scale.set(.80,.84,.92);
  const graphite=new T.MeshPhysicalMaterial({color:0x465254,roughness:.40,metalness:.58,clearcoat:.22,clearcoatRoughness:.45});
  const ceramic=new T.MeshPhysicalMaterial({color:0x827457,roughness:.57,metalness:.12,clearcoat:.27,clearcoatRoughness:.50});
  const back=new T.MeshStandardMaterial({color:0x536360,roughness:.46,metalness:.29});
  const steel=new T.MeshStandardMaterial({color:0x869491,roughness:.44,metalness:.71});
  const burnt=new T.MeshStandardMaterial({color:0x745745,roughness:.52,metalness:.36});
  const rubber=new T.MeshStandardMaterial({color:0x161e25,roughness:.91});
  const cloth=new T.MeshPhysicalMaterial({color:0x657775,roughness:.87,sheen:.72,sheenRoughness:.86,sheenColor:0x819597});
  const finish=canvasTexture(512,512,(c,w,h)=>{
    const image=c.createImageData(w,h),pixels=image.data;
    const random=randomGen(1238);
    for(let i=0;i<pixels.length;i+=4){
      const value=123+random()*9;
      pixels[i]=pixels[i+1]=pixels[i+2]=value;pixels[i+3]=255;
    }
    c.putImageData(image,0,0);
    c.strokeStyle='#a9a9a9';c.globalAlpha=.46;
    for(let j=0;j<320;j++){
      const x=random()*w,y=random()*h,len=random()*8.5;
      c.beginPath();c.moveTo(x,y);c.lineTo(x+len,y-len*.271);c.stroke();
    }
  });
  finish.colorSpace=T.NoColorSpace;
  for(const material of [graphite,ceramic,back,steel,burnt,rubber,cloth]){
    material.bumpMap=finish;
    material.bumpScale=material===cloth?.008:.0017;
  }

  skin(cloth,art.fabric,{detail:1.23,color:.37,uv:true});
  cloth.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec2 cuffUV;\n'+shader.vertexShader.replace('#include <uv_vertex>',`
      #include <uv_vertex>
      cuffUV=uv;
    `);
    shader.fragmentShader='varying vec2 cuffUV;\n'+shader.fragmentShader.replace('#include <color_fragment>',`
      #include <color_fragment>
      float path=abs(fract(cuffUV.x+.008*sin(cuffUV.y*17.)+.26)-.5);
      float join=1.-smoothstep(.001,.014,path);
      float seam=1.-smoothstep(.002,.008,abs(path-.022));
      float stitch=smoothstep(.12,.30,abs(fract(cuffUV.y*63.)-.5));
      float yoke=smoothstep(.39,.57,cuffUV.y+.08*sin(cuffUV.x*6.28));
      float cuff=1.-smoothstep(.073,.16,cuffUV.y);
      float edgeBand=1.-smoothstep(.008,.023,abs(cuffUV.y-.124));
      diffuseColor.rgb*=mix(vec3(1.07,1.03,.95),vec3(.71,.81,.83),yoke)*(1.-join*.32-cuff*.36-edgeBand*.16);
      diffuseColor.rgb+=seam*stitch*vec3(.014,.012,.009);
    `);
  };
  finish.wrapS=finish.wrapT=T.RepeatWrapping;
  // Fixed, part-local projections prevent stretched wear on the extruded receiver bevels.
  for(const material of [graphite,ceramic,back,steel,burnt]){
    const edgeExposesMetal=material===graphite||material===steel;
    material.bumpMap=null;
    material.customProgramCacheKey=()=>edgeExposesMetal?'receiver-metal':'receiver-coated';
    material.onBeforeCompile=shader=>{
      shader.uniforms.coating={value:art.paint[0]};
      shader.uniforms.coatingNormal={value:art.paint[1]};
      shader.uniforms.fineScuffs={value:finish};
      shader.vertexShader=`varying vec3 partP,partN; varying mat3 partBasis;\n`+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <defaultnormal_vertex>',`
        #include <defaultnormal_vertex>
        partP=position*vec3(length(modelMatrix[0].xyz),length(modelMatrix[1].xyz),length(modelMatrix[2].xyz));
        partN=objectNormal;
        partBasis=mat3(normalize(modelViewMatrix[0].xyz),normalize(modelViewMatrix[1].xyz),normalize(modelViewMatrix[2].xyz));
      `);
      shader.fragmentShader=`
        varying vec3 partP,partN;
        varying mat3 partBasis;
        uniform sampler2D coating,coatingNormal,fineScuffs;
        vec3 fromSurfaces(sampler2D map,vec3 p,vec3 w){
          return texture2D(map,p.zy).rgb*w.x+texture2D(map,p.xz).rgb*w.y+texture2D(map,p.xy).rgb*w.z;
        }
      `+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`
        #include <color_fragment>
        vec3 weights=pow(abs(normalize(partN)),vec3(7.));
        weights/=dot(weights,vec3(1.));
        vec3 projected=partP*3.75+vec3(.24,.53,.29);
        vec3 pigment=fromSurfaces(coating,projected,weights);
        float abrasion=dot(pigment,vec3(.2126,.7152,.0722));
        float scratches=fromSurfaces(fineScuffs,projected*5.82,weights).r;
        float flecks=fromSurfaces(fineScuffs,projected*13.6+vec3(.27,.23,.09),weights).r;
        vec3 faces=abs(normalize(partN));
        float corner=smoothstep(.09,.41,1.-max(faces.x,max(faces.y,faces.z)));
        float chipped=smoothstep(.60,.82,scratches*.68+abrasion*.43+corner*.28)*(.27+.44*corner);
        float grit=clamp((flecks-.49)*3.3,-.21,.28);
        float wear=.72+.36*smoothstep(.060,.63,abrasion)+(scratches-.48)*.73+grit*.33;
        diffuseColor.rgb*=wear;
        diffuseColor.rgb=mix(diffuseColor.rgb,${edgeExposesMetal?'vec3(.30,.35,.36)':'vec3(.32,.31,.25)'},chipped*.50);
      `).replace('#include <roughnessmap_fragment>',`
        #include <roughnessmap_fragment>
        roughnessFactor=clamp(roughnessFactor+(abrasion-.23)*.22-(scratches-.48)*.45-chipped*.28+grit*.48,.25,.94);
      `).replace('#include <normal_fragment_maps>',`
        #include <normal_fragment_maps>
        vec2 bx=(texture2D(coatingNormal,projected.zy).xy-.5)*weights.x;
        vec2 by=(texture2D(coatingNormal,projected.xz).xy-.5)*weights.y;
        vec2 bz=(texture2D(coatingNormal,projected.xy).xy-.5)*weights.z;
        vec3 tangent=normalize(partBasis*vec3(by.x+bz.x,bx.y+bz.y,bx.x+by.y)+vec3(.0001));
        float abrasionNormal=clamp(length(vec2(dFdx(flecks),dFdy(flecks)))*1.8,0.,.089);
        normal=normalize(normal+partBasis*vec3(by.x+bz.x,bx.y+bz.y,bx.x+by.y)*.23+tangent*abrasionNormal);
      `).replace('#include <lights_fragment_end>',`
        #include <lights_fragment_end>
        reflectedLight.directSpecular/=1.+max(0.,max(reflectedLight.directSpecular.r,reflectedLight.directSpecular.g)-.43)*.67;
      `);
    };
  }
  const recess=new T.MeshStandardMaterial({color:0x0d1010,roughness:.54,metalness:.28});
  const copper=new T.MeshStandardMaterial({color:0x856143,roughness:.40,metalness:.64});
  const indicator=lit(0x64dcd4,1.1);
  const redLaser=new T.MeshBasicMaterial({color:0xff8461});
  const forward=new T.Group();core.add(forward);

  // The pressure chamber hangs below a narrow receiver. The rear frame is open over the hand.
  receiverShell(core,graphite);
  bevelProfile(core,ceramic,[[-.163,-.078],[.022,-.076],[.154,-.038],[.112,.035],[-.154,.047],[-.188,.025]],.146,0,.014,-.150);
  bevelProfile(core,back,[[-.145,-.041],[.114,-.047],[.143,.008],[.121,.052],[-.10,.044],[-.15,.021]],.115,0,.011,-.422);
  bevelProfile(core,back,[[-.063,-.040],[.119,-.018],[.136,.009],[.070,.038],[-.049,.04]],.100,0,.009,.125);
  for(const side of [-1,1]){
    part(core,graphite,V(side*.044,.015,.144),V(side*.033,-.006,.280),.012);
    part(core,steel,V(side*.044,.014,.153),V(side*.035,.005,.244),.0075,hex);
    part(core,back,V(side*.041,-.059,.237),V(side*.044,-.011,.149),.012);
  }
  const heel=casePiece(core,rubber,0,-.018,.270,.080,.062,.028,.011);
  heel.rotation.x=-.23;
  for(let i=0;i<3;i++)casePiece(heel,back,0,-.016+i*.014,.014,.069,.004,.006,.002);
  casePiece(core,steel,0,.083,-.157,.111,.022,.48,.006);
  const guard=bevelProfile(core,graphite,[[-.196,-.034],[.127,-.039],[.147,-.020],[.105,.020],[-.155,.028],[-.214,.008]],.112,0,-.078,-.385);
  guard.rotation.x=.040;
  for(const side of [-1,1]){
    const gripGuard=bevelProfile(core,rubber,[[-.143,-.018],[.111,-.018],[.104,.018],[-.128,.024]],.011,side*.061,-.088,-.407);
    gripGuard.rotation.x=.03;
    for(let i=0;i<7;i++)casePiece(core,back,side*.068,-.102,-.519+i*.026,.008,.019,.011,.002).rotation.x=.28;
    const serviceCover=bevelProfile(core,graphite,[[-.070,-.028],[.093,-.028],[.079,.018],[-.064,.026]],.019,side*.069,.043,-.032);
    serviceCover.rotation.x=.031;
    for(const z of [-.084,.040])mesh(core,hex,steel,side*.083,.041,z,.007,.008,.007).rotation.z=Math.PI/2;
  }
  const upperService=new T.Group();
  upperService.position.set(0,.086,-.027);core.add(upperService);
  casePiece(upperService,back,0,.005,0,.106,.020,.173,.008);
  casePiece(upperService,recess,0,.016,.015,.073,.011,.092,.004);
  casePiece(upperService,steel,-.030,.018,.015,.008,.007,.088,.003);
  casePiece(upperService,steel,.030,.018,.015,.008,.007,.088,.003);
  for(let i=0;i<5;i++){
    casePiece(upperService,copper,0,.018,-.017+i*.015,.047,.006,.007,.002);
    casePiece(upperService,graphite,0,.019,-.013+i*.015,.033,.006,.004,.001);
  }
  for(const side of [-1,1])for(const z of [-.061,.077]){
    mesh(upperService,hex,steel,side*.043,.016,z,.006,.009,.006);
    mesh(upperService,hex,recess,side*.043,.022,z,.0032,.005,.0032);
  }
  for(let i=0;i<13;i++)casePiece(core,graphite,0,.097,-.374+i*.031,.12,.017,.015,.003);
  for(const side of [-1,1]){
    for(let i=0;i<7;i++){
      casePiece(core,graphite,side*.072,.011,-.338+i*.027,.020,.025,.014,.005);
      mesh(core,hex,steel,side*.083,-.044,-.326+i*.026,.006,.008,.006).rotation.z=Math.PI/2;
    }
    casePiece(core,steel,side*.068,-.066,-.344,.019,.041,.165,.006);
    casePiece(core,back,side*.057,-.051,.076,.028,.028,.054,.007);
    casePiece(core,indicator,side*.071,-.040,.077,.004,.003,.040,.001);
  }
  const receiverMark=panelLabel('K–07','BOREAL   KESTREL','#252f31','#aaaf9c');
  for(const side of [-1,1]){
    const label=mesh(core,new T.PlaneGeometry(.096,.039),receiverMark,side*.079,.015,-.219);
    label.rotation.y=side*Math.PI/2;
    const latch=casePiece(core,back,side*.069,-.015,.058,.030,.027,.068,.006);
    latch.rotation.x=-.27;
    mesh(core,hex,steel,side*.086,-.014,.048,.007,.006,.007).rotation.z=Math.PI/2;
  }
  casePiece(core,burnt,.080,-.032,-.085,.018,.008,.088,.002);

  part(forward,steel,V(0,.004,-.43),V(0,.004,-.68),.045);
  for(let i=0;i<4;i++) part(forward,graphite,V(0,.004,-.48-i*.033),V(0,.004,-.495-i*.033),.055,hex);
  part(forward,graphite,V(0,.004,-.651),V(0,.004,-.744),.062,hex);
  part(forward,burnt,V(0,.004,-.680),V(0,.004,-.704),.065,hex);
  ring(forward,steel,0,.004,-.745,.045,.007);
  mesh(forward,orb,rubber,0,.004,-.739,.037,.037,.015);
  const muzzle=new T.Object3D();muzzle.position.set(0,.004,-.767);forward.add(muzzle);

  // Recessed emitter cage, seals and isolated fasteners reveal the assembled silhouette.
  for(const side of [-1,1]){
    for(let i=0;i<13;i++){
      const z=-.386+i*.036;
      if(i<7 || i>8){
        casePiece(core,recess,side*.072,.042,z,.019,.015,.023,.003).rotation.x=-.11;
        casePiece(core,steel,side*.084,.039,z,.007,.007,.018,.002).rotation.x=-.11;
      }
    }
    casePiece(core,back,side*.073,-.011,-.008,.030,.051,.151,.008);
    casePiece(core,recess,side*.089,-.012,-.008,.007,.037,.113,.004);
    for(let i=0;i<9;i++)casePiece(core,copper,side*.094,-.013,-.05+i*.010,.004,.022,.004,.001);
    part(forward,copper,V(side*.071,.021,-.407),V(side*.071,.021,-.617),.0066);
    part(forward,back,V(side*.069,.043,-.422),V(side*.069,.043,-.65),.0126);
    part(forward,back,V(side*.069,-.039,-.422),V(side*.069,-.039,-.65),.0126);
  }
  const cellOn=lit(0x65e0da,1.26),cellLow=lit(0xff8352,1.42);
  casePiece(core,recess,0,.063,.089,.080,.014,.034,.006);
  const cells=[];
  for(let i=0;i<6;i++)cells.push(casePiece(core,cellOn,-.029+i*.0116,.071,.089,.006,.004,.017,.002));
  let lastLoaded=24;

  const grip=casePiece(core,rubber,0,-.158,.110,.076,.179,.095,.023);grip.rotation.x=-.28;
  for(let i=0;i<4;i++)casePiece(core,back,0,-.141-i*.022,.147+i*.006,.069,.006,.020,.003);
  const bow=[V(0,-.096,-.142),V(0,-.176,-.109),V(0,-.191,-.014),V(0,-.166,.066)];
  for(let i=1;i<bow.length;i++)part(core,graphite,bow[i-1],bow[i],.009);
  const trigger=part(core,steel,V(0,-.095,.035),V(0,-.144,.012),.010);
  const mag=new T.Group();mag.position.set(0,-.109,-.186);core.add(mag);
  casePiece(mag,graphite,0,-.072,0,.111,.16,.128,.015);
  casePiece(mag,back,0,-.064,0,.113,.079,.133,.009);
  casePiece(mag,burnt,0,-.152,0,.13,.028,.147,.008);
  for(let i=0;i<4;i++)casePiece(mag,rubber,.059,-.036-i*.022,.009,.01,.007,.091,.002);
  casePiece(mag,recess,0,.013,0,.088,.020,.096,.004);
  for(const x of [-.027,0,.027])casePiece(mag,copper,x,.025,.004,.012,.009,.046,.002);
  casePiece(mag,indicator,-.057,-.068,.043,.004,.009,.031,.002);
  const exhausted=mag.clone(true);
  exhausted.visible=false;core.add(exhausted);
  exhausted.children.at(-1).material=cellLow;
  const dropped=exhausted.clone(true),dropVelocity=V(),dropPoint=V(),dropSpin=V(.75,-1.28,.87);
  camera.parent.add(dropped);
  let dropAge=-1,lastReload=-1;

  const sight=new T.Group(); sight.position.set(0,.110,-.131); core.add(sight);
  casePiece(sight,graphite,0,.015,0,.122,.037,.108,.009);
  for(const side of [-1,1]){
    const leg=casePiece(sight,back,side*.054,.060,.002,.022,.089,.052,.008);
    leg.rotation.z=side*.128;
    casePiece(sight,steel,side*.041,.102,.002,.022,.018,.052,.006);
    casePiece(sight,burnt,side*.067,.046,.004,.009,.031,.056,.003);
  }
  casePiece(sight,graphite,0,.106,0,.098,.022,.059,.010);
  for(const side of [-1,1]){
    casePiece(sight,rubber,side*.043,.063,.018,.006,.062,.008,.002).rotation.z=side*.128;
    mesh(sight,hex,steel,side*.064,.061,.022,.006,.008,.006).rotation.z=Math.PI/2;
  }
  casePiece(sight,rubber,0,.093,.018,.081,.006,.009,.002);
  const glass=new T.MeshPhysicalMaterial({color:0x87bcb1,metalness:.23,roughness:.135,clearcoat:1,
    iridescence:.21,iridescenceIOR:1.32,iridescenceThicknessRange:[250,342],transparent:true,opacity:.29,
    side:T.DoubleSide,depthWrite:false});
  const lens=new T.PlaneGeometry(.083,.066,18,14);
  const lensPoints=lens.attributes.position;
  for(let i=0;i<lensPoints.count;i++){
    const u=lensPoints.getX(i)/.042,v=lensPoints.getY(i)/.033;
    lensPoints.setXYZ(i,.042*u*(1-.13*v),lensPoints.getY(i),-.007*(u*u+v*v)+v*.007);
  }
  lens.computeVertexNormals();
  mesh(sight,lens,glass,0,.061,.017,1,1,1,false);
  const dot=mesh(sight,orb,redLaser,0,.064,.022,.0026,.0026,.001);
  dot.visible=false;

  const glove=gloveMaterial(art);
  const supportGrip=makeGlove(handL,-1,glove,art.gloves[0]);
  const firingGrip=makeGlove(handR,1,glove,art.gloves[1]);
  const forearmL=sleeve(rig,-1,cloth),forearmR=sleeve(rig,1,cloth);
  const firingRotation=handOrientation(V(.04,.37,-.93),V(.96,.19,.04));
  const carryRotation=handOrientation(V(.05,.06,-.98),V(-.89,-.46,.02));
  const reloadRotation=handOrientation(V(-.10,.32,-.95),V(-.87,-.13,-.32));
  const flash=new T.Group();
  flash.position.copy(muzzle.position);
  const flashSeed={value:0},flashPower={value:0};
  const flashMat=new T.ShaderMaterial({
    uniforms:{flashSeed,flashPower},transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,
    vertexShader:`varying vec2 point;
      void main(){point=uv*2.-1.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 point;uniform float flashSeed,flashPower;
      void main(){
        float t=point.y*.5+.5;
        float edge=.052+.36*pow(t,.54)*pow(1.-t,.62);
        edge*=.88+.28*sin(t*36.+flashSeed)+.09*sin(t*63.+flashSeed*.38);
        float plasma=exp(-pow(abs(point.x)/edge,1.48))*pow(1.-t,.68);
        float kernel=exp(-pow(abs(point.x)*10.,1.7)-pow(t*4.8,1.3));
        vec3 heat=mix(vec3(2.15,.50,.090),vec3(4.4,2.71,1.33),smoothstep(.07,.63,kernel));
        gl_FragColor=vec4(heat*(kernel*.42+plasma*.72),flashPower*smoothstep(.0,.08,t));
      }`,
  });
  const sheet=new T.PlaneGeometry(.155,.32);
  for(let i=0;i<3;i++){
    const spoke=new T.Group();spoke.rotation.z=i*Math.PI/3;flash.add(spoke);
    const flame=mesh(spoke,sheet,flashMat,0,0,-.132,1,1,1,false);
    flame.rotation.x=-Math.PI/2;
  }
  const light=new T.PointLight(0xff904f,0,7);
  // Reflections omit the held mesh but keep the muzzle flash light in the room.
  camera.parent.add(light);core.add(flash);flash.visible=false;
  rig.traverse(child=>{if(child.isMesh){child.castShadow=false;child.receiveShadow=false;}});
  const defaultL=V(-.068,-.133,-.415), lockedGrip=V(-.068,-.133,-.416);
  const holdRight=V(.061,-.162,.112);
  const magWell=V(0,-.109,-.186), freshFrom=V(-.29,-.49,.061);
  const palmLink=V(-.038,-.056,.019), reachBelt=V(-.322,-.538,.09);
  const baseL=V(),switchTarget=V(),reachAim=V(),fingerAt=V(),reachForward=V(),approach=V(),upAt=V(),guide=V();
  const shoulderL=V(),shoulderR=V(),inverseHand=new T.Quaternion();
  const foreGrip=[V(-.033,-.107,-.479),V(-.020,-.108,-.463),V(-.013,-.113,-.439),V(-.006,-.118,-.417),V(-.056,-.077,-.432)];
  const rearGrip=[V(.009,-.128,.026),V(-.038,-.152,.082),V(-.035,-.176,.092),V(-.035,-.197,.100),V(.023,-.098,.118)];
  const magGrip=[V(-.021,-.038,.068),V(-.040,-.071,.074),V(-.035,-.098,.069),V(-.029,-.123,.065),V(-.039,-.058,-.029)];
  const pointingPose=[null,V(.012,-.026,-.024),V(-.013,-.022,-.016),V(-.028,-.018,-.009),V(.031,-.025,.030)];
  const leftFingers=foreGrip.map(()=>V()),rightFingers=rearGrip.map(()=>V());
  const reachRotate=new T.Quaternion(), leftMount=new T.Quaternion();
  let kick=0, recoilSpeed=0, roll=0, shoot=0, ads=0, run=0, swayX=0,swayY=0,inspect=-1,control=null;
  function update(dt,s){
    if(s.loaded!==lastLoaded){
      for(let i=0;i<cells.length;i++)cells[i].material=s.loaded<=i*4?rubber:s.loaded<7?cellLow:cellOn;
      lastLoaded=s.loaded;
    }
    const motion=s.reduced?.22:1;
    ads=damp(ads,s.ads?1:0,s.ads?14:20,dt);
    run=damp(run,s.sprint?1:0,s.sprint?8.8:11,dt);
    const passes=Math.max(1,Math.ceil(dt/.009)),integration=dt/passes;
    for(let pass=0;pass<passes;pass++){
      recoilSpeed+=(-kick*306-recoilSpeed*23)*integration;
      kick+=recoilSpeed*integration;
    }
    roll=damp(roll,0,11,dt);
    shoot=Math.max(0,shoot-dt);
    swayX=damp(swayX,clamp(s.lookX*.00066,-.032,.032),16,dt);
    swayY=damp(swayY,clamp(s.lookY*.00058,-.026,.026),16,dt);
    const step=s.pace*motion;
    const bobX=s.weight*.020*step*(1-ads*.88);
    const bobY=-s.plant*.026*motion*(1-ads*.63);
    const stance=(1-ads*.82)*motion;
    const recoil=Math.max(0,kick);
    const slide=clamp(Math.abs(s.bodyX)*.045+Math.abs(s.bodyZ)*.048,0,.073);
    const squeeze=s.obstruction*(1-ads*.68);
    const lowAim=T.MathUtils.smoothstep(-s.pitch,.74,1.30)*(1-ads);
    rig.position.set(lerp(.263,0,ads)-bobX-swayX*stance+run*.081-s.bodyX*.061*stance+lowAim*.095,
      lerp(-.238,-.146,ads)+bobY+swayY*stance-run*.102-s.drop*.15-s.landing*.49-s.flight*.062-s.fireHeat*.011-squeeze*.13,
      lerp(-.704,-.744,ads)+recoil*.064+run*.092+s.bodyZ*.042*stance+s.landing*.11+slide*.14+squeeze*.25);
    rig.rotation.set(.001+recoil*.067*(1-ads*.82)+swayY*.83*(1-ads*.73)-run*.20-s.flight*.043+s.landing*.50-squeeze*.23,
      lerp(.132,0,ads)+swayX*.94*(1-ads*.83)-run*.274-s.bodyX*.043*stance-lowAim*.09,
      lerp(-.109,0,ads)+roll*.039*(1-ads*.88)-run*.39-s.bodyX*.089*stance+s.weight*.019*step);
    core.position.set(0,0,recoil*.013);
    core.rotation.set(0,0,0);
    upperService.position.z=-.027+recoil*.017;
    trigger.position.z=.0235+(s.trigger?.009:0);
    handR.position.copy(holdRight).add(core.position);
    handR.quaternion.copy(firingRotation);
    if(dropAge>=0){
      dropAge+=dt;
      dropVelocity.y-=dt*8.9;
      dropped.position.addScaledVector(dropVelocity,dt);
      const floor=s.floor(dropped.position.x,dropped.position.z)+.064;
      if(dropped.position.y<floor){
        dropped.position.y=floor;dropVelocity.x*=.52;dropVelocity.z*=.52;dropVelocity.y*=-.27;
      }
      if(dropAge<.78){dropped.rotation.x+=dropSpin.x*dt;dropped.rotation.y+=dropSpin.y*dt;dropped.rotation.z+=dropSpin.z*dt;}
      if(dropAge>3.1){dropAge=-1;dropped.visible=false;}
    }
    mag.position.copy(magWell);mag.rotation.set(0,0,0);
    mag.visible=true;exhausted.visible=false;
    baseL.copy(defaultL).lerp(lockedGrip,ads).add(core.position);
    leftMount.copy(carryRotation);
    let grip=.77, spread=.13, reachAmount=0, pointing=0, magazine=null, contactWeight=1;
    if(s.reload>=0){
      const ease=T.MathUtils.smoothstep,t=s.reload;
      const turn=ease(t,0,.18)*(1-ease(t,.74,.99));
      const detach=ease(t,.18,.34),release=ease(t,.34,.49);
      const seat=ease(t,.51,.716),recover=ease(t,.754,.994);
      rig.position.x+=turn*.028;
      rig.position.y+=turn*.089;
      rig.position.z-=turn*.084;
      rig.rotation.z+=turn*.46;
      rig.rotation.x+=turn*.18;
      rig.rotation.y+=turn*.14;
      exhausted.visible=t>=.18&&t<.34;
      exhausted.position.copy(magWell);
      exhausted.position.x-=detach*.029;
      exhausted.position.y-=detach*.162;
      exhausted.position.z+=detach*.020;
      exhausted.rotation.set(detach*.11,0,-detach*.22);
      if(lastReload>=0&&lastReload<.34&&t>=.34){
        exhausted.getWorldPosition(dropped.position);
        exhausted.getWorldQuaternion(dropped.quaternion);
        exhausted.getWorldScale(dropped.scale);
        camera.getWorldQuaternion(reachRotate);
        dropVelocity.set(-.43,-.72,-.10).applyQuaternion(reachRotate);
        dropAge=0;dropped.visible=true;
      }
      mag.visible=t<.18||t>=.48;
      if(t<.48){
        const reach=ease(t,0,.16);
        fingerAt.copy(palmLink).applyQuaternion(exhausted.quaternion).add(exhausted.position);
        baseL.lerp(fingerAt,reach).lerp(reachBelt,ease(t,.34,.49));
        leftMount.slerp(reloadRotation,reach);
        grip=lerp(.77,.32,reach)+.44*ease(t,.09,.17)-.52*release;
        spread=lerp(.13,.24,release);
        magazine=exhausted;contactWeight=ease(t,.12,.18)*(1-release);
      }else{
        mag.position.copy(freshFrom).lerp(magWell,seat);
        mag.rotation.set((1-seat)*.69,(1-seat)*-.34,(1-seat)*.64);
        fingerAt.copy(palmLink).applyQuaternion(mag.quaternion).add(mag.position);
        baseL.copy(reachBelt).lerp(fingerAt,ease(t,.48,.54)).lerp(defaultL,recover);
        leftMount.copy(reloadRotation).slerp(carryRotation,recover);
        grip=lerp(.31,.77,ease(t,.47,.55))-.40*ease(t,.75,.84)*(1-ease(t,.87,.99));
        magazine=mag;contactWeight=ease(t,.49,.54)*(1-recover);
        rig.position.y+=Math.sin(Math.PI*ease(t,.69,.78))*.015;
        rig.rotation.x-=Math.sin(Math.PI*ease(t,.70,.79))*.027;
      }
    }
    lastReload=s.reload;
    if(inspect>=0){
      inspect+=dt;
      control.getWorldPosition(switchTarget);switchTarget.y+=.013;
      const touch=T.MathUtils.smoothstep(inspect,.02,controlContact)*(1-T.MathUtils.smoothstep(inspect,.33,.74));
      rig.position.x+=touch*.038;
      rig.position.y-=touch*.124;
      rig.rotation.x-=touch*.17;
      rig.rotation.z-=touch*.085;
      if(s.reload<0&&touch>0){
        reachAim.copy(switchTarget);
        camera.worldToLocal(reachAim);
        if(reachAim.z<-.2){
          rig.worldToLocal(reachAim.copy(switchTarget));
          approach.copy(camera.position).sub(switchTarget);approach.y=0;approach.normalize();
          guide.copy(switchTarget).addScaledVector(approach,.105);guide.y+=.119;
          guide.x-=approach.z*.073;guide.z+=approach.x*.073;
          rig.worldToLocal(guide);
          upAt.copy(switchTarget);upAt.y+=.22;
          rig.worldToLocal(upAt).sub(reachAim).normalize();
          reachForward.copy(reachAim).sub(guide).normalize();
          reachRotate.copy(handOrientation(reachForward,upAt));
          pointing=touch;
          grip=lerp(grip,.39,touch);spread=lerp(spread,.09,touch);
          supportGrip.pose(grip,spread,-.62*pointing,pointingPose,pointing);
          fingerAt.copy(supportGrip.index).applyQuaternion(reachRotate);
          const lean=1-T.MathUtils.smoothstep(touch,.66,1);
          reachAim.sub(fingerAt).addScaledVector(upAt,.148*lean);
          baseL.lerp(reachAim,touch).addScaledVector(upAt,.10*Math.sin(Math.PI*touch));
          leftMount.slerp(reachRotate,touch);
          reachAmount=touch;
        }
      }
      if(inspect>.74){inspect=-1;control=null;}
    }
    handL.position.copy(baseL);
    handL.quaternion.copy(leftMount);
    rig.worldToLocal(camera.localToWorld(shoulderL.set(-.205,-.275,.055)));
    rig.worldToLocal(camera.localToWorld(shoulderR.set(.250,-.290,.092)));
    forearmL.pose(handL,shoulderL,Math.max(reachAmount,s.reload>=0?.25:0),s.bodyX);
    forearmR.pose(handR,shoulderR,.13+run*.25,s.bodyX);
    if(pointing>.001)supportGrip.pose(grip,spread,-.62*pointing,pointingPose,pointing);
    else{
      inverseHand.copy(handL.quaternion).invert();
      const anchors=magazine?magGrip:foreGrip;
      leftFingers.forEach((p,i)=>{
        p.copy(anchors[i]);
        if(magazine)p.applyQuaternion(magazine.quaternion).add(magazine.position);
        p.add(core.position).sub(handL.position).applyQuaternion(inverseHand);
      });
      supportGrip.pose(grip,spread,0,leftFingers,contactWeight);
    }
    inverseHand.copy(handR.quaternion).invert();
    rightFingers.forEach((p,i)=>{
      p.copy(rearGrip[i]);
      if(i===0){p.z+=s.trigger?.014:-.010;p.x+=s.trigger?0:.029;p.y+=s.trigger?0:.013;}
      p.add(core.position).sub(handR.position).applyQuaternion(inverseHand);
    });
    firingGrip.pose(.85,.09,s.trigger?-.32+recoil*.09:-.60,rightFingers,1);
    dot.visible=ads>.49;
    flash.visible=shoot>0;
    if(flash.visible){
      flash.scale.setScalar((s.reduced?.61:1)*(.55+shoot*20));flash.rotation.z+=2.9;
      flashPower.value=shoot*(s.reduced?7:18);
      muzzle.getWorldPosition(light.position);
    }
    light.intensity=shoot*(s.reduced?210:650);
  }
  return {rig,muzzle,update,
    fire(heat){
      recoilSpeed+=17+heat*13;kick=Math.min(1.38,kick+.29);roll=(Math.random()-.50)*(.65+heat*.62);shoot=.039;
      flash.visible=true;flash.scale.setScalar(1.04);flashPower.value=.82;
      flashSeed.value=Math.random()*10;
      muzzle.getWorldPosition(light.position);light.intensity=22;
    },
    pressControl(button){control=button;inspect=0;},
    releaseControl(){inspect=Math.max(.34,inspect);},
    controlProgress:()=>inspect,
    reset(){kick=recoilSpeed=roll=shoot=ads=run=swayX=swayY=0;inspect=-1;control=null;dropAge=lastReload=-1;dropped.visible=flash.visible=false;light.intensity=0;},
  };
}

export function createCableRider(art){
  const rider=new T.Group();
  rider.position.set(-.86,1.43,-.55);
  rider.rotation.y=Math.PI*.5;
  const coat=new T.MeshPhysicalMaterial({color:0x666f65,roughness:.89,sheen:.64,sheenColor:0x798273});
  const lining=new T.MeshStandardMaterial({color:0x283330,roughness:.91});
  const trim=new T.MeshStandardMaterial({color:0x9c5331,roughness:.83});
  const shell=new T.MeshPhysicalMaterial({color:0x394947,roughness:.55,clearcoat:.24});
  const lens=new T.MeshPhysicalMaterial({color:0x26363a,metalness:.61,roughness:.27,clearcoat:.7});
  skin(coat,art.fabric,{uv:true,detail:.9,color:.32});
  skin(lining,art.fabric,{uv:true,detail:.81,color:.23});
  const lumbar=mesh(rider,orb,coat,0,.24,-.026,.207,.307,.132);
  lumbar.rotation.x=.10;
  mesh(rider,orb,coat,0,.47,-.021,.258,.16,.13);
  casePiece(rider,lining,0,.29,-.158,.345,.405,.147,.055).rotation.x=.13;
  const hood=new T.Group();hood.position.set(0,.688,-.02);rider.add(hood);
  mesh(hood,orb,coat,0,0,-.017,.135,.165,.138);
  mesh(hood,orb,lining,0,-.034,.071,.111,.117,.058);
  const respirator=casePiece(hood,shell,0,-.058,.104,.147,.093,.067,.027);
  respirator.rotation.x=.16;
  casePiece(hood,lens,0,.027,.105,.196,.058,.061,.022);
  casePiece(hood,trim,0,.062,.102,.185,.018,.053,.009);
  const forearms=[];
  for(const side of [-1,1]){
    const x=side*.16;
    part(rider,trim,V(x,.492,-.11),V(side*.124,.349,.132),.022);
    mesh(rider,orb,coat,side*.236,.429,.015,.102,.145,.103).rotation.z=side*.37;
    part(rider,coat,V(side*.244,.427,.027),V(side*.244,.185,.110),.079);
    const forearm=new T.Group();
    forearm.position.set(side*.242,.196,.101);
    rider.add(forearm);
    part(forearm,coat,V(0,0,0),V(-side*.127,-.053,.151),.066);
    mesh(forearm,orb,lining,-side*.140,-.048,.175,.057,.035,.073).rotation.y=side*.46;
    forearms.push(forearm);
    part(rider,lining,V(x,.079,-.023),V(side*.152,.047,.342),.092);
    part(rider,lining,V(side*.152,.05,.33),V(side*.159,-.373,.284),.078);
    casePiece(rider,shell,side*.158,-.43,.345,.163,.153,.258,.042);
  }
  const receiver=casePiece(rider,shell,.100,.361,.126,.076,.118,.043,.014);
  receiver.rotation.z=-.19;
  part(rider,lining,V(.097,.410,.14),V(.084,.508,.135),.011);
  rider.visible=false;
  return {root:rider,update(t){
    rider.visible=t>=2.72;
    const brace=T.MathUtils.smoothstep(t,3.75,4.75)*(1-T.MathUtils.smoothstep(t,5.47,6.96));
    const look=T.MathUtils.smoothstep(t,4.8,6.7);
    lumbar.rotation.x=.10+Math.sin(t*1.29)*.023+brace*.034;
    hood.rotation.set(.07+Math.sin(t*.57)*.042+brace*.11,-.33-.45*look,-.06-.05*brace);
    forearms[0].rotation.set(-brace*.58,brace*.34,brace*.21);
    forearms[1].rotation.set(brace*.11,-brace*.13,-brace*.08);
  }};
}

export function createEnemyModels(art){
  const shell=surface(0x878c83,'paint',{metalness:.26,roughness:.61});
  const armor=surface(0x405c63,'paint',{metalness:.27,roughness:.60});
  const dark=surface(0x26343d,'paint',{metalness:.30,roughness:.68});
  const metal=surface(0x77808a,'paint',{metalness:.44,roughness:.57});
  const rust=surface(0xbc583d,'paint',{metalness:.19,roughness:.63});
  const low=lit(0xe23823,1.90);
  const wing=lit(0xe94f29,1.13);
  for(const [mat,scale] of [[shell,1.42],[armor,1.85],[rust,2.11]])skin(mat,art.paint,{scale,detail:.55,color:.54,rough:.43});
  skin(metal,art.deck,{scale:1.81,detail:.41,color:.50,rough:.45});
  const shroud=new T.SphereGeometry(1,24,15);
  const hardware=new T.CylinderGeometry(1,1,1,24);
  const serial=panelLabel('07','AIR SAMPLER','#282e2b','#e0cc9b');
  const serialRover=panelLabel('NORD','SURVEY UNIT','#222b30','#d5d8cd');
  function drone(){
    const root=new T.Group(), tilt=new T.Group();root.add(tilt);
    const eye=lit(0xff4b30,2.7), fans=[];
    mesh(tilt,shroud,shell,0,.022,-.023,.52,.273,.51);
    casePiece(tilt,armor,0,-.020,-.251,.45,.29,.48,.100);
    const tag=mesh(tilt,new T.PlaneGeometry(.171,.083),serial,.260,.181,.352);
    tag.rotation.set(-.34,.43,0);
    for(let i=0;i<6;i++){
      casePiece(tilt,dark,.178+i*.033,.177-i*.012,.322,.020,.017,.104,.005).rotation.y=-.14;
      casePiece(tilt,dark,-.178-i*.033,.177-i*.012,.322,.020,.017,.104,.005).rotation.y=.14;
    }
    casePiece(tilt,dark,0,.118,.155,.51,.18,.50,.052);
    casePiece(tilt,rust,0,.238,-.052,.34,.086,.51,.023);
    casePiece(tilt,armor,0,-.19,-.027,.42,.19,.49,.032);
    part(tilt,metal,V(0,-.22,.19),V(0,-.22,.47),.092,hex);
    ring(tilt,dark,0,-.22,.472,.082,.018);
    mesh(tilt,orb,low,0,-.22,.468,.052,.052,.025);
    part(tilt,dark,V(0,.026,.35),V(0,.026,.505),.178,hex);
    ring(tilt,metal,0,.026,.510,.139,.018);
    mesh(tilt,orb,eye,0,.026,.505,.103,.103,.044);
    for(const side of [-1,1]){
      const a=side*.77;
      part(tilt,armor,V(side*.25,.059,-.22),V(a,.051,-.064),.123,hex);
      part(tilt,metal,V(side*.32,-.11,.23),V(a,-.041,-.04),.062);
      part(tilt,dark,V(side*.36,.17,.028),V(a,.109,-.04),.053);
      mesh(tilt,new T.CylinderGeometry(.98,1,1,32,1,true),armor,a,-.04,-.07,.309,.157,.309);
      for(let i=0;i<8;i++){
        const theta=i*Math.PI/4;
        const x=a+.305*Math.cos(theta),z=-.07+.305*Math.sin(theta);
        part(tilt,i%4===0?rust:dark,V(x,-.113,z),V(x,.038,z),.018,hex);
      }
      for(const q of [-1,1])part(tilt,dark,V(a+q*.23,-.090,-.07),V(a,-.058,-.07+q*.17),.022);

      ring(tilt,metal,a,.035,-.07,.285,.033,true);
      ring(tilt,dark,a,-.109,-.07,.263,.019,true);
      ring(tilt,wing,a,-.114,-.07,.235,.011,true);
      const fan=new T.Group();fan.position.set(a,.051,-.07);tilt.add(fan);fans.push(fan);
      mesh(fan,hardware,dark,0,0,0,.074,.043,.074);
      for(let i=0;i<5;i++){
        const bladeGroup=new T.Group();bladeGroup.rotation.y=i*Math.PI*2/5;fan.add(bladeGroup);
        const blade=casePiece(bladeGroup,metal,.137,0,0,.223,.015,.080,.004);blade.rotation.y=.44;
      }
      casePiece(tilt,wing,a,.046,.197,.112,.035,.045,.008);
      casePiece(tilt,rust,a+side*.27,-.006,-.05,.05,.096,.129,.015);
    }
    part(tilt,metal,V(-.26,.145,-.31),V(-.35,.43,-.49),.015);
    mesh(tilt,orb,wing,-.35,.43,-.49,.032,.026,.032);
    return {root,tilt,eye,animate(t,dt,moving,charge){
      tilt.rotation.z=damp(tilt.rotation.z,Math.sin(t*2.6)*.127+moving*.073,6,dt);
      tilt.rotation.x=damp(tilt.rotation.x,-moving*.09-.12*charge,7,dt);
      for(let i=0;i<fans.length;i++)fans[i].rotation.y+=(i?1:-1)*dt*(29+charge*26);
      eye.emissiveIntensity=2.8+charge*6.2;
    }};
  }
  function stalker(){
    const root=new T.Group(), tilt=new T.Group(), legs=[];root.add(tilt);
    const eye=lit(0xff442c,2.13);
    mesh(tilt,shroud,armor,0,-.054,-.017,.59,.295,.50);
    casePiece(tilt,rust,0,.127,.286,.65,.121,.38,.051);
    const serialPlate=mesh(tilt,new T.PlaneGeometry(.37,.13),serialRover,0,.171,.413);
    serialPlate.rotation.x=-.37;
    for(const side of [-1,1]){
      casePiece(tilt,shell,side*.462,.063,-.1,.203,.219,.459,.050);
      for(let i=0;i<6;i++)casePiece(tilt,dark,side*.570,.032,-.282+i*.059,.034,.10,.024,.009);
      casePiece(tilt,metal,side*.46,.087,-.364,.219,.17,.142,.046);
    }
    casePiece(tilt,shell,0,.168,-.075,.72,.19,.63,.076);
    casePiece(tilt,rust,0,.252,-.116,.43,.073,.35,.019);
    casePiece(tilt,dark,0,-.195,.053,.41,.17,.64,.031);
    const visor=casePiece(tilt,dark,0,.064,.420,.59,.227,.192,.041);
    casePiece(tilt,eye,0,.096,.523,.402,.047,.036,.017);
    for(const side of [-1,1]){
      const x=side*.33;
      part(tilt,dark,V(x,-.10,.288),V(x,-.10,.587),.086,hex);
      ring(tilt,metal,x,-.10,.590,.068,.015);
      mesh(tilt,orb,low,x,-.10,.586,.043,.043,.020);
      for(const front of [-1,1]){
        const hip=V(side*.42,-.09,front*.281);
        const knee=V(side*.69,-.36,front*.51);
        const ankle=V(side*.75,-.79,front*.64);
        const upper=part(root,armor,hip,knee,.100,hex);
        const lower=part(root,metal,knee,ankle,.073,hex);
        mesh(tilt,orb,rust,hip.x,hip.y,hip.z,.104,.107,.105);
        const piston=part(root,dark,knee,ankle,.031);
        const ram=part(root,metal,knee,ankle,.021);
        const pivot=mesh(root,hardware,dark,knee.x,knee.y,knee.z,.106,.118,.112);
        pivot.rotation.z=Math.PI/2;
        mesh(pivot,hex,metal,0,-side*.56,0,.56,.26,.56);
        const foot=casePiece(root,dark,ankle.x,ankle.y,ankle.z,.202,.110,.269,.030);
        for(let i=0;i<4;i++)casePiece(foot,dark,0,-.049,-.077+i*.049,.182,.032,.034,.005);
        casePiece(foot,wing,0,.046,.092,.107,.017,.034,.006);
        legs.push({hip,knee,ankle,upper,lower,piston,ram,pivot,foot,side,front,
          planted:V(),origin:V(),goal:V(),swing:1,initialized:false});
      }
    }
    const a=V(),b=V(),c=V(),d=V(),cross=V(),localMotion=V(),worldFoot=V(),offset=V(),jointFace=V();
    const error=[0,0];
    const {smoothstep}=T.MathUtils;
    let nextPair=0;
    function pose(part,head,tail){
      d.copy(tail).sub(head);part.scale.y=d.length();
      part.position.copy(head).lerp(tail,.5);
      part.quaternion.setFromUnitVectors(Y,d.normalize());
    }
    function stepAt(leg,terrain,lead,out) {
      out.copy(leg.ankle).add(lead);
      root.localToWorld(out);
      out.y=terrain(out.x,out.z)+.068;
      return out;
    }
    function animate(t,dt,moving,charge,velocity,terrain){
      const walk=clamp(Math.abs(moving)*1.2,0,1);
      tilt.position.y=Math.sin(t*13)*.019*walk-charge*.069;
      tilt.rotation.z=damp(tilt.rotation.z,clamp(velocity.x*.018,-.050,.050),4.3,dt);
      root.updateMatrixWorld(true);
      localMotion.set(velocity.x,0,velocity.z).applyAxisAngle(Y,-root.rotation.y);
      const stride=Math.min(.37,localMotion.length()*.105);
      if(stride>0)localMotion.setLength(stride);
      const targetReady=legs.every(leg=>leg.swing>=1);
      error.fill(0);
      for(const leg of legs){
        stepAt(leg,terrain,localMotion,worldFoot);
        if(!leg.initialized){
          leg.planted.copy(worldFoot);
          leg.initialized=true;
        }
        const pair=leg.front*leg.side>0?0:1;
        error[pair]=Math.max(error[pair],worldFoot.distanceTo(leg.planted));
      }
      const threshold=.24+charge*.04;
      if(targetReady){
        const pair=error[nextPair]>threshold?nextPair:1-nextPair;
        if(error[pair]>threshold){
          for(const leg of legs){
            if((leg.front*leg.side>0?0:1)!==pair)continue;
            leg.origin.copy(leg.planted);
            stepAt(leg,terrain,localMotion,leg.goal);
            leg.swing=0;
          }
          nextPair=1-pair;
        }
      }
      for(const leg of legs){
        if(leg.swing<1){
          leg.swing=Math.min(1,leg.swing+dt/(.24-.09*walk));
          const phase=smoothstep(leg.swing,0,1);
          leg.planted.copy(leg.origin).lerp(leg.goal,phase);
          leg.planted.y+=Math.sin(Math.PI*leg.swing)*(.092+stride*.21);
        }
        b.copy(leg.planted);root.worldToLocal(b);
        a.copy(leg.hip).applyEuler(tilt.rotation).add(tilt.position);
        c.copy(a).lerp(b,.48);
        c.x+=leg.side*.12;c.z+=leg.front*.089;c.y+=.047;
        pose(leg.upper,a,c);
        pose(leg.lower,c,b);
        cross.set(leg.side*.050,.006,0);
        offset.copy(c).lerp(b,.53).add(cross);
        pose(leg.piston,jointFace.copy(c).add(cross),offset);
        pose(leg.ram,offset,jointFace.copy(b).add(cross));
        leg.pivot.position.copy(c);
        leg.foot.position.copy(b);
        leg.foot.rotation.x=-Math.sin(Math.PI*leg.swing)*.17;
      }
      visor.position.y=.064-charge*.018;
      eye.emissiveIntensity=2.4+charge*7.1;
    }
    return {root,tilt,eye,animate};
  }
  return { drone,stalker, debris:[shell,dark,metal,rust] };
}


export function createEffects(scene, materials){
  const nodes=[];
  const direction=V(), mid=V(), axis=V(1,0,0);
  const tracerGeo=new T.CylinderGeometry(1,1,1,5);
  const warm=new T.MeshBasicMaterial({color:new T.Color(2.3,1.21,.66),transparent:true,opacity:.88});
  const thin=new T.MeshBasicMaterial({color:new T.Color(1.56,.51,.18),transparent:true,opacity:.37});
  const hostile=new T.MeshBasicMaterial({color:new T.Color(3.9,.356,.112)});
  const halo=new T.MeshBasicMaterial({color:new T.Color(1.82,.235,.119),transparent:true,opacity:.34,blending:T.AdditiveBlending,depthWrite:false});
  const spark=new T.MeshBasicMaterial({color:new T.Color(3.1,1.33,.51)});
  const frost=new T.MeshBasicMaterial({color:0xcbe2eb,transparent:true,opacity:.57,depthWrite:false});
  const detonation=new T.MeshBasicMaterial({color:new T.Color(2.8,.63,.19),transparent:true,opacity:.52,depthWrite:false,blending:T.AdditiveBlending});
  const vaporTexture=canvasTexture(128,128,(c,w,h)=>{
    const random=randomGen(4762);
    for(let i=0;i<39;i++){
      const th=random()*Math.PI*2,d=Math.sqrt(random())*34, r=13+random()*19;
      const x=64+Math.cos(th)*d,y=64+Math.sin(th)*d;
      const plume=c.createRadialGradient(x,y,0,x,y,r);
      plume.addColorStop(0,'#e1edf5bd');plume.addColorStop(.49,'#aeccdf43');
      plume.addColorStop(1,'#9ab7cb00');c.globalAlpha=.37;c.fillStyle=plume;
      c.fillRect(x-r,y-r,r*2,r*2);
    }
  });
  const vapor=new T.SpriteMaterial({map:vaporTexture,color:0xacc1cb,transparent:true,opacity:.29,depthWrite:false});
  function vent(from,i){
    const material=vapor.clone();material.rotation=Math.random()*6.28;
    const sprite=new T.Sprite(material);
    sprite.position.copy(from).add(V((Math.random()-.5)*.45,.04+i*.076,(Math.random()-.5)*.44));
    sprite.scale.setScalar(.39+i*.13);
    scene.add(sprite);
    const total=.82+i*.31;
    nodes.push({mesh:sprite,left:total,total,velocity:V(.48+Math.random()*.45,.33+i*.19,-.17),gravity:0,speed:0,
      fade:true,opacity:.31,vapor:true,size:.39+i*.13});
  }

  const impactGeo=new T.PlaneGeometry(1,1);
  const decals=[];
  function impactMaterial(type,seed){
    return new T.MeshBasicMaterial({
      map:canvasTexture(128,128,(ctx,w,h)=>{
        const rand=randomGen(seed),cx=w*.5,cy=h*.5,isMetal=type==='metal';
        const halo=ctx.createRadialGradient(cx,cy,4,cx,cy,59);
        halo.addColorStop(0,'#151714cb');
        halo.addColorStop(.57,isMetal?'#362a2341':'#2c27213c');
        halo.addColorStop(1,'#14171600');
        ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
        for(let i=0;i<90;i++){
          const a=rand()*Math.PI*2,r=6+Math.pow(rand(),1.55)*51;
          const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;
          ctx.fillStyle=i%3?'#1f211b5a':isMetal?'#ddc1a5a1':'#d0ba94a1';
          ctx.fillRect(x,y,1.5+rand()*3,1+rand()*2);
        }
        const gaps=Array.from({length:21},()=>.83+rand()*.25);
        function outline(radius,x=cx,y=cy){
          ctx.beginPath();
          gaps.forEach((f,i)=>{
            const angle=i*Math.PI*2/gaps.length;
            const px=x+Math.cos(angle)*radius*f,py=y+Math.sin(angle)*radius*f;
            if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
          });
          ctx.closePath();
        }
        outline(isMetal?26:31);ctx.fillStyle=isMetal?'#8b8072':'#9f8e78';ctx.fill();
        outline(isMetal?19:23,cx+1.5,cy+2);ctx.fillStyle=isMetal?'#bcad96':'#c2b094';ctx.fill();
        outline(isMetal?15:17,cx+1.5,cy+.5);ctx.fillStyle='#131415';ctx.fill();
        outline(8,cx+2.9,cy-1);ctx.fillStyle='#080b0e';ctx.fill();
      }),
      transparent:true,depthWrite:false,
      polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-2,
    });
  }
  const marks=Object.fromEntries(['metal','concrete','rock','wood'].map((type,i)=>[type,Array.from({length:3},(_,j)=>impactMaterial(type,1291+51*i+203*j))]));
  const impactWarmup=new T.Group();
  for(const z of [25.0,-21.0])for(const material of Object.values(marks).flat()){
    const seed=new T.Mesh(impactGeo,material);
    seed.position.set(0,1.75,z);
    seed.scale.setScalar(.0025);
    impactWarmup.add(seed);
  }
  scene.add(impactWarmup);
  function stamp(at,normal,type,parent){
    const mat=marks[type][decals.length%3];
    const mark=new T.Mesh(impactGeo,mat);
    mark.position.copy(at).addScaledVector(normal,.0065);
    mark.quaternion.setFromUnitVectors(Z,normal);
    mark.rotateZ(Math.random()*Math.PI*2);
    const size=(type==='metal'?.234:.294)*(.94+Math.random()*.22);
    mark.scale.set(size,size,1);
    mark.renderOrder=3;
    scene.add(mark);
    if(parent)parent.attach(mark);
    decals.push(mark);
    if(decals.length>180)decals.shift().removeFromParent();
  }
  const sparksPool=Array.from({length:1},()=>{
    const light=new T.PointLight(0xffac65,0,2.4,2);
    scene.add(light);return {light,left:0,power:0};
  });
  let sparkIndex=0;
  function shimmer(at,normal,power){
    const pulse=sparksPool[sparkIndex++%sparksPool.length];
    pulse.light.position.copy(at).addScaledVector(normal,.17);
    pulse.power=power;pulse.left=.074;
    pulse.light.intensity=power;
  }
  const grit=new T.MeshStandardMaterial({color:0xa59a83,roughness:.83});
  function spawn(geo,mat,at,seconds,velocity=null,gravity=0,fade=false){
    const mesh=new T.Mesh(geo,fade?mat.clone():mat);
    mesh.position.copy(at);scene.add(mesh);
    nodes.push({mesh,left:seconds,total:seconds,velocity,gravity,speed:velocity?.length()||0,fade,opacity:mat.opacity});
    if(nodes.length>350)drop(0);
    return mesh;
  }
  function drop(i){
    const [{mesh,fade}]=nodes.splice(i,1);
    scene.remove(mesh);
    if(fade)mesh.material.dispose();
  }
  function span(mesh,start,end,width){
    direction.copy(end).sub(start);
    mid.copy(start).addScaledVector(direction,.5);
    mesh.position.copy(mid);
    mesh.scale.set(width,direction.length(),width);
    mesh.quaternion.setFromUnitVectors(Y,direction.normalize());
  }
  function tracer(a,b){
    const end=b.clone().lerp(a,.019);
    const start=a.clone().lerp(b,.065);
    span(spawn(tracerGeo,thin,start,.060,null,0,true),start,end,.013);
    span(spawn(tracerGeo,warm,start,.041,null,0,true),start,end,.004);
    const tail=a.clone().lerp(b,.09);
    const puff=new T.Sprite(vapor.clone());
    puff.material.opacity=.24;puff.material.rotation=Math.random()*6.28;
    puff.position.copy(tail);puff.scale.setScalar(.081);
    scene.add(puff);
    const velocity=b.clone().sub(a).setLength(.43);velocity.y+=.31;
    nodes.push({mesh:puff,left:.41,total:.41,velocity,gravity:0,speed:0,fade:true,opacity:.24,vapor:true,size:.081});
  }
  function burst(at,count,energy,material,gravity,life,normal=null){
    for(let i=0;i<count;i++){
      const v=V(Math.random()*2-1,.2+Math.random()*.83,Math.random()*2-1);
      if(normal)v.addScaledVector(normal,1.48);
      v.multiplyScalar(energy*(.37+Math.random()*.64));
      const hot=material===spark;
      const node=spawn(hot?tracerGeo:shardGeo,material,at,life*(.43+Math.random()*.74),v,gravity,material===frost);
      const r=hot?.008+Math.random()*.014:.018+Math.random()*.031;
      node.scale.set(r,hot?.068+v.length()*.014:r*1.07,r);
      if(hot)node.quaternion.setFromUnitVectors(Y,v.clone().normalize());
      else node.rotation.set(Math.random()*7,Math.random()*7,Math.random()*7);
    }
  }
  function impact(at,normal,type='metal',parent=null,confirmed=false){
    const snow=type==='snow',metal=type==='metal';
    if(metal){
      burst(at,11,5.6,spark,9.4,.24,normal);
      shimmer(at,normal,3.4);
    }else{
      burst(at,snow?10:9,snow?2.9:3.9,snow?frost:grit,snow?4.7:8.2,snow?.41:.27,normal);
      if(confirmed)vent(at.clone().addScaledVector(normal,.07),0);
    }
    if(confirmed&&!snow)stamp(at,normal,type,parent);
  }
  function hit(at,heavy=false){
    burst(at,heavy?17:10,heavy?6.5:5.1,spark,9,.31);
    shimmer(at,Y,heavy?5.5:2.1);
  }
  function destroy(at){
    hit(at,true);
    for(let i=0;i<12;i++){
      const velocity=V(Math.random()*2-1,.45+Math.random()*.89,Math.random()*2-1).multiplyScalar(3.0+Math.random()*2.9);
      const p=spawn(shardGeo,materials[i%materials.length],at,1.05+Math.random(),velocity,9.4);
      const size=.061+Math.random()*.105;
      p.scale.set(size,size*.62,size*.8);
    }
    for(let i=0;i<4;i++)vent(at,i);
    burst(at,8,3.3,frost,1.2,.76);
    spawn(orb,detonation,at,.20,null,0,true).scale.setScalar(.49);
  }
  function bolt(){
    const head=new T.Group(), tail=new T.Mesh(tracerGeo,hostile), haze=new T.Mesh(tracerGeo,halo);
    head.add(haze,tail);
    tail.scale.set(.045,.52,.045);haze.scale.set(.089,.78,.089);
    const eye=new T.Mesh(orb,hostile);eye.position.y=.24;eye.scale.setScalar(.052);head.add(eye);
    scene.add(head);return head;
  }
  function update(dt,ground){
    for(const pulse of sparksPool){
      pulse.left=Math.max(0,pulse.left-dt);
      pulse.light.intensity=pulse.power*(pulse.left/.074)**2;
    }
    for(let i=nodes.length-1;i>=0;i--){
      const n=nodes[i];n.left-=dt;
      if(n.left<=0){drop(i);continue;}
      const {mesh,velocity}=n;
      if(n.fade){
        mesh.material.opacity=n.opacity*clamp(n.left/(n.total*.67),0,1);
        if(mesh.geometry===orb)mesh.scale.addScaledVector(V(1,1,1),dt*3.8);
        if(n.vapor){mesh.scale.setScalar(n.size+(n.total-n.left)*.69);mesh.material.rotation+=dt*.22;}
      }
      if(velocity){
        velocity.y-=dt*n.gravity;
        mesh.position.addScaledVector(velocity,dt);
        mesh.rotateOnAxis(axis,dt*(n.speed+1.2));
        const floor=ground(mesh.position.x,mesh.position.z)+.035;
        if(mesh.position.y<floor){
          mesh.position.y=floor;
          velocity.y=Math.abs(velocity.y)*.39;
          velocity.x*=.62;velocity.z*=.62;
        }
      }
    }
  }
  function crash(at){
    burst(at,12,2.63,frost,6.2,.49);
    for(let i=0;i<2;i++)vent(at,i);
  }
  return {tracer,impact,hit,destroy,crash,bolt,update,finishWarmup(){impactWarmup.removeFromParent();},impactCount:()=>decals.length,reset(){
    while(nodes.length)drop(nodes.length-1);
    while(decals.length)decals.pop().removeFromParent();
    for(const pulse of sparksPool){pulse.left=0;pulse.light.intensity=0;}
  }};
}



