import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { loadGloves } from './glove-rig.js';

const chips = ['asphalt_snow','metal_plate','rusty_painted_metal','concrete_wall_006','snow_04','denim_fabric_04'];
export async function loadCinematicAssets() {
  const loader = new T.TextureLoader();
  const root = new URL('../assets/pbr/', import.meta.url);
  const gltf = new GLTFLoader();
  const propIds = ['portable_generator', 'metal_office_desk', 'tool_cart',
    'old_military_crate', 'utility_box_02', 'concrete_road_barrier_02'];
  const propLoads = Promise.all(propIds.map(async id => {
    const {scene} = await gltf.loadAsync(new URL(`../assets/props/${id}/${id}_1k.gltf`, import.meta.url).href);
    if (id === 'old_military_crate') {
      for (const child of [...scene.children]) {
        if (child.name.endsWith('_b')) scene.remove(child);
      }
    }
    return [id, scene];
  }));
  const mapLoads = Promise.all(chips.map(async id => {
    const textures = await Promise.all(['Diffuse','nor_gl','Rough'].map(key => loader.loadAsync(new URL(`${id}-${key}.jpg`,root).href)));
    textures[0].colorSpace = T.SRGBColorSpace;
    for (const tex of textures) {
      tex.wrapS = tex.wrapT = T.RepeatWrapping;
      tex.anisotropy = 8;
    }
    return textures;
  }));
  const hdr=new RGBELoader();
  const [boulder, field, winter, dawn, workshop, maps, propEntries, gloves] = await Promise.all([
    gltf.loadAsync(new URL('../assets/boulder/boulder-near.gltf', import.meta.url).href),
    gltf.loadAsync(new URL('../assets/boulder/boulder-field.gltf', import.meta.url).href),
    hdr.loadAsync(new URL('winter_lake_01.hdr',root).href),
    hdr.loadAsync(new URL('kloppenheim_06_puresky.hdr',root).href),
    hdr.loadAsync(new URL('workshop.hdr',root).href),
    mapLoads,
    propLoads,
    loadGloves(),
  ]);
  winter.mapping = workshop.mapping = T.EquirectangularReflectionMapping;
  const rock = boulder.scene.getObjectByProperty('isMesh',true);
  boulder.scene.updateMatrixWorld(true);
  const rockGeometry = rock.geometry.clone().applyMatrix4(rock.matrixWorld);
  rockGeometry.computeBoundingBox();
  const size = rockGeometry.boundingBox.getSize(new T.Vector3());
  const center = rockGeometry.boundingBox.getCenter(new T.Vector3());
  rockGeometry.translate(-center.x,-center.y,-center.z);
  rockGeometry.scale(2/size.x,2/size.y,2/size.z);
  const fieldGeometry=field.scene.getObjectByProperty('isMesh',true).geometry;
  fieldGeometry.translate(-center.x,-center.y,-center.z);
  fieldGeometry.scale(2/size.x,2/size.y,2/size.z);
  const rockMaterial = rock.material.clone();
  rockMaterial.color.setHex(0xa8aeb8);
  rockMaterial.roughness = .94;
  rockMaterial.metalness = 0;
  rockMaterial.normalScale.set(1.0,1.0);
  rockMaterial.onBeforeCompile = shader => {
    shader.uniforms.snowGrain={value:maps[4][1]};
    shader.uniforms.rockGrain={value:maps[3][1]};
    shader.vertexShader = 'varying vec3 worldFace; varying vec3 worldRock;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <worldpos_vertex>',`
      #include <worldpos_vertex>
      worldFace = inverseTransformDirection(transformedNormal, viewMatrix);
      vec4 wp = vec4(transformed, 1.);
      #ifdef USE_INSTANCING
        wp = instanceMatrix * wp;
      #endif
      worldRock = (modelMatrix * wp).xyz;
    `);
    shader.fragmentShader = `
      varying vec3 worldFace,worldRock;
      uniform sampler2D snowGrain,rockGrain;
      float mineralRelief(sampler2D tex,vec3 p,vec3 w){
        return texture2D(tex,p.zy).r*w.x+texture2D(tex,p.xz).r*w.y+texture2D(tex,p.xy).r*w.z;
      }
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>',`
      #include <color_fragment>
      vec3 rockP=worldRock;
      vec3 n=normalize(worldFace);
      vec3 weights=pow(abs(n),vec3(5.));
      weights/=dot(weights,vec3(1.));
      float chip=mineralRelief(rockGrain,rockP*.52,weights);
      float grit=mineralRelief(rockGrain,rockP*1.66+vec3(.05,.65,.21),weights);
      float crystals=mineralRelief(snowGrain,rockP*.95+vec3(.17,.07,.72),weights);
      float glaze=clamp(crystals*.64+chip*.36,0.,1.);
      float cohesion=.073*sin(rockP.y*5.8+rockP.x*1.4+rockP.z*1.9+chip*.92);
      float snow=smoothstep(.48,.77,n.y+cohesion+(glaze-.5)*.38);
      vec3 frosted=mix(vec3(.35,.424,.51),vec3(.70,.75,.80),smoothstep(.16,.69,diffuseColor.r+.27+(glaze-.5)*.24));
      vec3 bed=diffuseColor.rgb*vec3(.73,.77,.82)*(.66+chip*.52+grit*.26);
      diffuseColor.rgb=mix(bed,frosted,snow);
    `).replace('#include <normal_fragment_maps>',`
      #include <normal_fragment_maps>
      vec3 p=rockP*.69;
      vec2 x=(mix(texture2D(rockGrain,p.zy).rg,texture2D(snowGrain,p.zy).rg,snow)-.5)*weights.x;
      vec2 y=(mix(texture2D(rockGrain,p.xz).rg,texture2D(snowGrain,p.xz).rg,snow)-.5)*weights.y;
      vec2 z=(mix(texture2D(rockGrain,p.xy).rg,texture2D(snowGrain,p.xy).rg,snow)-.5)*weights.z;
      vec3 sand=vec3(y.x+z.x,x.y+z.y,x.x+y.y);
      float closeRelief=1.-smoothstep(.045,.20,length(fwidth(rockP)));
      normal=normalize(normal+mat3(viewMatrix)*sand*closeRelief*.50);
    `);
  };
  return {road:maps[0],deck:maps[1],paint:maps[2],concrete:maps[3],snow:maps[4],fabric:maps[5],winter,dawn,workshop,rockMaterial,rockGeometry,fieldGeometry,gloves,props:Object.fromEntries(propEntries)};
}

// Planar projections share a metre scale across modular meshes. The viewmodel uses part-local UVs.
export function skin(material, maps, {scale=1, detail=.68, color=.65, rough=.65, uv=false}={}) {
  if(uv) {
    material.normalMap=maps[1];
    material.normalScale.setScalar(detail);
    if(color>.1) material.map=maps[0];
    return material;
  }
  const previous = material.onBeforeCompile;
  const cache = material.customProgramCacheKey;
  material.customProgramCacheKey = () => `${cache.call(material)}-scan-${scale}-${detail}-${color}-${rough}`;
  material.onBeforeCompile = shader => {
    previous.call(material,shader);
    Object.assign(shader.uniforms,{scanDiffuse:{value:maps[0]},scanNormal:{value:maps[1]},scanRough:{value:maps[2]}});
    shader.fragmentShader=`
      uniform sampler2D scanDiffuse,scanNormal,scanRough;
      vec3 triScan(sampler2D tex,vec3 p,vec3 weight){
        return texture2D(tex,p.zy).rgb*weight.x+texture2D(tex,p.xz).rgb*weight.y+texture2D(tex,p.xy).rgb*weight.z;
      }
      vec3 triNormal(sampler2D tex,vec3 p,vec3 n,vec3 weight){
        vec3 a=texture2D(tex,p.zy).rgb*2.-1.;
        vec3 b=texture2D(tex,p.xz).rgb*2.-1.;
        vec3 c=texture2D(tex,p.xy).rgb*2.-1.;
        return vec3(0.,a.y,a.x)*weight.x+vec3(b.x,0.,b.y)*weight.y+vec3(c.x,c.y,0.)*weight.z;
      }
    `+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <alphamap_fragment>',`
      vec3 triPos=surfP*${scale.toFixed(4)};
      vec3 triWeights=pow(abs(sn),vec3(6.));
      triWeights/=max(dot(triWeights,vec3(1.)),.00001);
      vec3 measured=triScan(scanDiffuse,triPos,triWeights);
      float luminance=dot(measured,vec3(.2126,.7152,.0722));
      diffuseColor.rgb*=mix(1.,clamp(.22+luminance*2.45,.23,1.43),${color.toFixed(4)});
      #include <alphamap_fragment>
    `);
    shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`
      #include <roughnessmap_fragment>
      roughnessFactor=mix(roughnessFactor,clamp(triScan(scanRough,triPos,triWeights).r,.24,1.),${rough.toFixed(4)});
    `);
    shader.fragmentShader=shader.fragmentShader.replace('normal=normalize(normal*max(abs(jac),.00000001)-grad);',`
      normal=normalize(normal*max(abs(jac),.00000001)-grad);
      vec3 scanN=triNormal(scanNormal,triPos,sn,triWeights);
      normal=normalize(normal + mat3(viewMatrix)*scanN*${detail.toFixed(4)});
    `);
  };
  return material;
}
