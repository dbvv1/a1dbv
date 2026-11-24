import * as T from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const base=new URL('../assets/polyhaven/',import.meta.url);
const images=new T.TextureLoader();
const meshes=new GLTFLoader();

async function texture(file,color,folder=base) {
  const map=await images.loadAsync(new URL(file,folder).href);
  map.colorSpace=color?T.SRGBColorSpace:T.NoColorSpace;
  map.wrapS=map.wrapT=T.RepeatWrapping;
  map.anisotropy=8;
  return map;
}

async function pbr(name,report) {
  const result=await Promise.all(['color','normal','arm'].map(async kind=>{
    const map=await texture(name+'-'+kind+'.webp',kind==='color');
    report();
    return map;
  }));
  return {map:result[0],normal:result[1],arm:result[2]};
}

function standard(pbr,options={}) {
  return new T.MeshStandardMaterial({
    map:pbr.map,normalMap:pbr.normal,roughnessMap:pbr.arm,aoMap:pbr.arm,
    normalScale:new T.Vector2(.81,.81),metalness:0,roughness:1,aoMapIntensity:.75,
    ...options
  });
}

async function scan(name,report) {
  const [maps,object]=await Promise.all([
    pbr(name,report),
    meshes.loadAsync(new URL(name+'.glb',base).href).then(data=>{report();return data.scene.children[0];})
  ]);
  for(const map of Object.values(maps))map.flipY=false;
  object.material.dispose();
  object.material=standard(maps,{color:0x999598,normalScale:new T.Vector2(1,1),roughness:.83});
  return object;
}

export async function siteAssets(progress) {
  let done=0;
  const report=()=>progress(++done/20);
  const [oxide,concrete,rock,cliffScan,stoneScan,trees,sky,foam]=await Promise.all([
    pbr('rusty_metal_02',report),pbr('concrete_wall_009',report),pbr('rock_face_04',report),
    scan('namaqualand_cliff_02',report),scan('rock_09',report),
    texture('fir-sapling-atlas.webp',true).then(map=>{report();return map;}),
    new RGBELoader().loadAsync(new URL('kloppenheim_01_puresky_2k.hdr',base).href).then(map=>{
      map.wrapS=T.RepeatWrapping;report();return map;
    }),
    texture('foam003-detail.webp',false,new URL('../ambientcg/',base)).then(map=>{report();return map;})
  ]);
  const cast=standard(concrete,{color:0xc9c7bc});
  for(const map of Object.values(concrete))map.repeat.set(1.14,1.14);
  return {oxide,cast,rock,cliffScan,stoneScan,trees,sky,foam};
}


export function blendConcrete(cast,aged) {
  cast.userData.surfaceTextures=[aged.map,aged.normalMap];
  cast.customProgramCacheKey=()=> 'rain-cast';
  cast.onBeforeCompile=shader=>{
    shader.uniforms.castAging={value:aged.map};
    shader.uniforms.castMicro={value:aged.normalMap};
    shader.vertexShader='varying vec3 castPoint;\n'+shader.vertexShader.replace('#include <begin_vertex>',`
      #include <begin_vertex>
      castPoint=(modelMatrix*vec4(position,1.)).xyz;
    `);
    shader.fragmentShader=`
      uniform sampler2D castAging,castMicro;
      varying vec3 castPoint;
    `+shader.fragmentShader.replace('#include <color_fragment>',`
      #include <color_fragment>
      vec2 drip=vec2(castPoint.x*.64+castPoint.z*.61,castPoint.y*.53);
      vec3 age=texture2D(castAging,drip+vec2(.148,.09)).rgb;
      vec3 pores=texture2D(castAging,vMapUv*2.3+vec2(.42,.74)).rgb;
      float tide=(1.-smoothstep(.15,1.61,castPoint.y))*(.43+.57*age.r);
      diffuseColor.rgb*=mix(vec3(.47,.52,.61),vec3(1.20,1.17,1.09),smoothstep(.08,.32,age.r));
      diffuseColor.rgb*=.78+pores.r*.89-tide*.26;
    `).replace('#include <normal_fragment_maps>',`
      #include <normal_fragment_maps>
      vec2 grain=texture2D(castMicro,vMapUv*2.3+vec2(.42,.74)).xy*2.-1.;
      mat3 local=getTangentFrame(-vViewPosition,normal,vMapUv);
      normal=normalize(normal+local*vec3(grain*.63,0.));
    `);
  };
}
