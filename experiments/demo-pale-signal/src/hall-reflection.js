import * as T from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { noise } from './visual.js';

export function addHallReflection(scene, roughness) {
  const positions=[],uv=[],indices=[];
  const centerZ=-22.8;
  for(const [x,z,width,depth,seed] of [[-.94,-17.32,.66,1.93,9],[.32,-21.36,1.0,2.08,13],
    [-1.23,-24.2,.65,1.63,17],[1.30,-26.82,.80,1.57,28],[-.42,-29.15,.88,.82,32]]){
    const origin=positions.length/3;
    positions.push(x,centerZ-z,0);uv.push(.5,.5);
    const segments=48;
    for(let i=0;i<segments;i++){
      const a=i*Math.PI*2/segments;
      const ripple=.82+noise(Math.cos(a)*3.48+seed,Math.sin(a)*4.8+seed)*.31;
      positions.push(x+Math.cos(a)*width*ripple,centerZ-z+Math.sin(a)*depth*ripple,0);
      uv.push(.5+Math.cos(a)*.5,.5+Math.sin(a)*.5);
      indices.push(origin,origin+1+i,origin+1+(i+1)%segments);
    }
  }
  const shape=new T.BufferGeometry();
  shape.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  shape.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  shape.setIndex(indices);
  const shader={
    name:'DampConcrete',
    uniforms:{...Reflector.ReflectorShader.uniforms,roughnessMap:{value:null}},
    vertexShader:`
      uniform mat4 textureMatrix;
      varying vec4 reflected;
      varying vec3 floorPos;
      varying vec2 patchUv;
      void main(){
        reflected=textureMatrix*vec4(position,1.);
        floorPos=(modelMatrix*vec4(position,1.)).xyz;
        patchUv=uv;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
      }`,
    fragmentShader:`
      uniform sampler2D tDiffuse,roughnessMap;
      varying vec4 reflected;
      varying vec3 floorPos;
      varying vec2 patchUv;
      void main(){
        vec2 surface=vec2(floorPos.x,floorPos.z);
        float film=texture2D(roughnessMap,surface*.72).r;
        float noise=texture2D(roughnessMap,surface*.197+film*.13).r;
        float edge=length(patchUv*2.-1.);
        float wet=(1.-smoothstep(.58,1.,edge))*(.48+.52*smoothstep(.30,.76,film*.52+noise*.48));
        vec2 skew=(vec2(film,noise)-.5)*.012;
        vec2 screen=reflected.xy/reflected.w+skew;
        vec2 delta=vec2(.0016,.0028)*(1.+film*2.4);
        vec3 image=texture2D(tDiffuse,screen).rgb*.40;
        image+=(texture2D(tDiffuse,screen+delta).rgb+texture2D(tDiffuse,screen-delta).rgb)*.15;
        image+=(texture2D(tDiffuse,screen+vec2(-delta.x,delta.y)).rgb+texture2D(tDiffuse,screen+vec2(delta.x,-delta.y)).rgb)*.15;
        vec3 eye=cameraPosition-floorPos;
        float angle=abs(eye.y)/length(eye);
        float glancing=pow(1.-angle,2.8);
        vec3 water=mix(vec3(.024,.029,.031),min(image,vec3(1.34))*.86,.19+glancing*.72);
        gl_FragColor=vec4(water,wet*(.41+glancing*.38));
      }`,
  };
  const film=new Reflector(shape,{shader,textureWidth:768,textureHeight:480,multisample:0,clipBias:.002});
  film.material.uniforms.roughnessMap.value=roughness;
  film.material.transparent=true;
  film.material.depthWrite=false;
  film.position.set(0,.076,centerZ);
  film.rotation.x=-Math.PI*.5;
  film.renderOrder=1;
  film.visible=false;
  scene.add(film);

  const reflect=film.onBeforeRender;
  film.onBeforeRender=function(renderer,world,camera){
    const original=[];
    // Keep the held weapon and airborne snow out of puddle reflections.
    for(const child of camera.children){
      if(!child.visible)continue;
      original.push(child);child.visible=false;
    }
    film.camera.layers.mask=camera.layers.mask;
    film.camera.layers.disable(1);
    try{reflect.call(this,renderer,world,camera);}
    finally{
      film.visible=true;
      for(const child of original)child.visible=true;
    }
  };
  return film;
}
