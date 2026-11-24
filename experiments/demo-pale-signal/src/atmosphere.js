import * as T from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

const V = (x,y,z) => new T.Vector3(x,y,z);
const hue = hex => new T.Color(hex);
const beams = [
  [V(0,4.55,-10.84),V(.13,-.72,1),6.8,.78,0xffa365,1.05],
  [V(-4.25,4.11,-18.75),V(.24,-1,-.20),5.1,.86,0xfba760,.82],
  [V(-3.55,3.49,-24.18),V(.29,-.84,-.48),4.2,.78,0xffb479,.82],
  [V(5.15,3.90,-20.92),V(-.67,-.70,-.32),8.6,.81,0x9bc8ed,1.17],
  [V(-9.34,5.48,-40.8),V(.55,-.60,-.29),13,.83,0x9ecfff,.69],
  [V(11.55,6.19,-53.38),V(-.67,-.64,.39),14,.89,0xffba76,1.30],
  [V(-2.12,4.37,-63.68),V(.40,-.74,.59),9.7,.89,0xffac71,1.02],
  [V(1.91,3.85,-77.37),V(-.48,-.74,.39),6.7,.85,0xffb075,.22],
];
export function makeAtmosphere(camera,depth){
  const max=4;
  const vecs=()=>Array.from({length:max},()=>new T.Vector4());
  const uniforms={
    depth:{value:depth},projectionInverse:{value:camera.projectionMatrixInverse},
    cameraWorld:{value:camera.matrixWorld},elapsed:{value:0},clear:{value:0},wind:{value:0},storm:{value:0},motion:{value:1},
    lightPos: {value:vecs()}, lightAim:{value:vecs()}, lightHue:{value:vecs()},
  };
  const vertexShader=`varying vec2 screenUV;
    void main(){ screenUV=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
  const lighting = new T.ShaderMaterial({uniforms,depthTest:false,depthWrite:false,
    vertexShader,
    fragmentShader:`
      varying vec2 screenUV;
      uniform sampler2D depth;
      uniform mat4 projectionInverse,cameraWorld;
      uniform float elapsed,clear,wind,storm,motion;
      uniform vec4 lightPos[${max}],lightAim[${max}],lightHue[${max}];
      float noise(vec3 p){
        vec3 i=floor(p),u=fract(p);
        u=u*u*(3.-2.*u);
        vec4 a=fract(sin(dot(i,vec3(27.195,89.203,51.562))+vec4(0.,27.195,89.203,116.398))*43758.5453);
        vec4 b=fract(sin(dot(i,vec3(27.195,89.203,51.562))+vec4(51.562,78.757,140.765,167.96))*43758.5453);
        return mix(mix(mix(a.x,a.y,u.x),mix(a.z,a.w,u.x),u.y),mix(mix(b.x,b.y,u.x),mix(b.z,b.w,u.x),u.y),u.z);
      }
      vec3 viewPoint(vec2 uv,float d){
        vec4 p=projectionInverse*vec4(uv*2.-1.,d*2.-1.,1.);
        return p.xyz/p.w;
      }
      float valleyHaze(vec3 camera,vec3 ray,float solidDistance){
        float exitSpan=solidDistance;
        float enterSpan=0.;
        if(abs(ray.y)>.004){
          float a=(-62.-camera.y)/ray.y,b=(6.-camera.y)/ray.y;
          enterSpan=max(enterSpan,min(a,b));
          exitSpan=min(exitSpan,max(a,b));
        }else if(camera.y>6.||camera.y<-62.)return 0.;
        if(exitSpan<=enterSpan)return 0.;
        float lengthInFog=min(exitSpan-enterSpan,305.);
        float haze=0.;
        for(int i=0;i<13;i++){
          float k=(float(i)+.5)/13.;
          vec3 p=camera+ray*(enterSpan+k*lengthInFog);
          float z=-p.z;
          float reach=smoothstep(87.,119.,z)*(1.-smoothstep(251.,376.,z));
          float axis=(z-108.)*.168+4.*sin(z*.052);
          float across=(p.x-axis)/35.;
          float channel=exp(-across*across*.92);
          float billow=noise(vec3(p.x*.042+elapsed*.053*motion,p.y*.076,p.z*.041));
          float fleecy=noise(vec3(p.x*.081,p.y*.122+8.1,p.z*.055+elapsed*.016*motion));
          float top=-20.+8.5*billow;
          float strata=exp(-pow((p.y-top)/19.,2.));
          float ribbons=smoothstep(.32,.68,.74*billow+.26*fleecy);
          haze+=reach*channel*strata*(.0014+.0098*ribbons);
        }
        return (1.-exp(-haze*lengthInFog/13.))*.72;
      }
      void main(){
        float d=texture2D(depth,screenUV).r;
        vec3 local=viewPoint(screenUV,d);
        vec3 world=cameraWorld[3].xyz;
        vec3 ray=normalize(mat3(cameraWorld)*local);
        float solidDistance=length(local);
        float far=min(solidDistance,54.);
        vec3 inscatter=vec3(0.);
        float fog=0.;
        // March a staggered set of samples to the nearest opaque surface.
        float phase=.16+.66*fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))));
        for(int i=0;i<21;i++){
          float k=(float(i)+phase)/21.;
          float range=k*k*far;
          float stepSize=(k+.024)*far*(2./21.);
          vec3 p=world+ray*range;
          float wisp=noise(vec3(p.x*.30-elapsed*.22,p.y*1.01+elapsed*.06,p.z*.37));
          float drift=noise(vec3(p.x*.116-elapsed*.094,p.y*.45,p.z*.17));
          float veil=(.2+drift*.84)*(.50+.50*wisp);
          float low=exp(-abs(p.y-.75)*.58)*smoothstep(.38,.78,.30+wisp*.40+drift*.29);
          float outside=1.-step(-31.18,p.z)*(1.-step(-11.63,p.z))*(1.-step(9.72,abs(p.x)));
          float windClock=elapsed*(.16+wind*.27)*motion;
          vec3 gustP=vec3((p.x+p.z*.43)*.083-windClock,p.y*.91,(p.z-p.x*.27)*.24-windClock*.31);
          float strata=.65*noise(gustP)+.22*noise(gustP*2.21+9.1)+.13*wisp;
          float lane=exp(-abs(p.y-.15)*1.63);
          float field=smoothstep(-p.z,32.,38.)*(1.-smoothstep(-p.z,59.,65.));
          float roadside=smoothstep(1.85,5.8,abs(p.x))*(1.-smoothstep(13.0,19.0,abs(p.x)));
          float windSheet=smoothstep(.45,.76,strata)*lane*max(field*storm,roadside*.51);
          float airfield=field*storm*smoothstep(.43,.77,strata*.74+drift*.26)*exp(-abs(p.y-.95)*1.05);
          float density=(.0032+.011*low+(.075*windSheet+.020*airfield)*wind)*outside*(1.-clear*.31)+.0013;
          fog+=density*stepSize;
          for(int j=0;j<${max};j++){
            vec3 delta=p-lightPos[j].xyz;
            float forward=dot(delta,lightAim[j].xyz);
            float cone=forward*inversesqrt(max(dot(delta,delta),.001));
            float lobe=smoothstep(lightAim[j].w,min(1.,lightAim[j].w+.115),cone);
            float extent=smoothstep(.19,.91,forward)*(1.-smoothstep(lightPos[j].w*.44,lightPos[j].w,forward));
            inscatter+=lobe*extent*lightHue[j].rgb*lightHue[j].a*veil*stepSize/(5.5+dot(delta,delta)*2.7);
          }
        }
        float extinction=1.-exp(-fog);
        float horizonWarmth=pow(max(0.,dot(ray,normalize(vec3(-.41,.22,-.88)))),5.);
        vec3 fogColor=mix(vec3(.105,.151,.199),vec3(.164,.220,.262),clear);
        fogColor=mix(fogColor,vec3(.271,.190,.132),horizonWarmth*.57);
        float alpha=extinction*(1.-smoothstep(38.,58.,solidDistance)*.34);
        vec3 scatter=fogColor*alpha;
        if(world.z<-60.&&solidDistance>14.){
          float gorge=valleyHaze(world,ray,solidDistance);
          vec3 hazeTint=mix(vec3(.145,.204,.266),vec3(.293,.250,.228),horizonWarmth*(.42+clear*.38));
          scatter=mix(scatter,hazeTint,gorge);
          alpha=mix(alpha,1.,gorge);
        }
        scatter+=inscatter*(1.-.13*storm);
        gl_FragColor=vec4(scatter,alpha);
      }
    `,
  });
  const low=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,depthBuffer:false,magFilter:T.NearestFilter,minFilter:T.NearestFilter});
  low.texture.name='Atmospheric in-scatter';
  const composite=new T.ShaderMaterial({
    depthTest:false,depthWrite:false,vertexShader,
    uniforms:{colorInput:{value:null},scatterInput:{value:low.texture},depth:{value:depth},
      pixelSize:{value:new T.Vector2(1,1)},cameraRange:{value:new T.Vector2(camera.near,camera.far)}},
    fragmentShader:`
      uniform sampler2D colorInput,scatterInput,depth;
      uniform vec2 pixelSize,cameraRange;
      varying vec2 screenUV;
      float linearDepth(vec2 uv){
        float d=texture2D(depth,uv).r;
        return cameraRange.x/(1.-d*(1.-cameraRange.x/cameraRange.y));
      }
      void main(){
        vec4 src=texture2D(colorInput,screenUV);
        vec2 cell=screenUV/pixelSize-.5;
        vec2 base=(floor(cell)+.5)*pixelSize;
        vec2 fraction=fract(cell);
        float centre=linearDepth(screenUV);
        vec4 air=vec4(0.);
        float sum=0.;
        for(int y=0;y<2;y++)for(int x=0;x<2;x++){
          vec2 kernel=vec2(float(x),float(y));
          vec2 uv=clamp(base+pixelSize*kernel,pixelSize*.5,1.-pixelSize*.5);
          vec2 linear=mix(1.-fraction,fraction,kernel);
          float metres=linearDepth(uv);
          float difference=abs(log2(max(.043,metres))-log2(max(.043,centre)));
          float w=max(.00001,exp(-difference*5.9)*linear.x*linear.y);
          air+=texture2D(scatterInput,uv)*w;
          sum+=w;
        }
        air/=max(sum,.00001);
        // Thin first-person surfaces receive at most the air between the eye and the object.
        air*=smoothstep(.14,.84,centre);
        float edge=dot((screenUV-.5)*vec2(1.05,.92),(screenUV-.5)*vec2(1.05,.92));
        gl_FragColor=vec4((src.rgb*(1.-air.a)+air.rgb)*(1.-smoothstep(.08,.53,edge)*.16),src.a);
      }
    `,
  });
  const quad=new FullScreenQuad(lighting);
  class AtmospherePass extends Pass {
    setSize(width,height){
      low.setSize(Math.max(1,Math.ceil(width*.50)),Math.max(1,Math.ceil(height*.50)));
      composite.uniforms.pixelSize.value.set(1/low.width,1/low.height);
    }
    render(renderer,writeBuffer,readBuffer){
      quad.material=lighting;
      renderer.setRenderTarget(low);quad.render(renderer);
      composite.uniforms.colorInput.value=readBuffer.texture;
      quad.material=composite;
      renderer.setRenderTarget(this.renderToScreen?null:writeBuffer);quad.render(renderer);
    }
    dispose(){low.dispose();lighting.dispose();composite.dispose();quad.dispose();}
  }
  const pass=new AtmospherePass();
  let next=0;
  const order=[...beams];
  const euclidean=b=>b[0].distanceToSquared(camera.position);
  return {pass, update(time,weather,wind,storm,reduced) {
    const v=uniforms;
    if(time>=next){
      order.sort((a,b)=>euclidean(a)-euclidean(b));
      for(let i=0;i<max;i++){
        const [pos,dir,len,spread,tone,power]=order[i];
        dir.normalize();
        const col=hue(tone);
        v.lightPos.value[i].set(pos.x,pos.y,pos.z,len);
        v.lightAim.value[i].set(dir.x,dir.y,dir.z,spread);
        v.lightHue.value[i].set(col.r,col.g,col.b,power);
      }
      next=time+.25;
    }
    v.elapsed.value=time;
    v.clear.value=weather;
    v.wind.value=wind;
    v.storm.value=storm;
    v.motion.value=reduced?.35:1;
  }};
}
