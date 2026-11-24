import * as T from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makeAtmosphere } from './atmosphere.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';

const clamp = T.MathUtils.clamp;
export const sunDirection = new T.Vector3(-.41,.22,-.88).normalize();
export const colors = {
  steel: 0x475052, edge: 0x222625, blue: 0x697575, graphite: 0x2f3434,
  oxide: 0x85533a, orange: 0xbd713d, pale: 0xb9b5a1, rubber: 0x1c2325,
};
export function randomGen(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
export function noise(x, y) {
  const hash = (a, b) => {
    let v = Math.imul(a, 0x119de1f3) ^ Math.imul(b, 0x344b534b);
    v = Math.imul(v ^ v >>> 16, 0x45d9f3b);
    return ((v ^ v >>> 16) >>> 0) / 4294967295;
  };
  const ix = Math.floor(x), iy = Math.floor(y);
  const a = x - ix, b = y - iy;
  const u = a * a * (3 - 2 * a), v = b * b * (3 - 2 * b);
  return T.MathUtils.lerp(T.MathUtils.lerp(hash(ix,iy), hash(ix+1,iy),u), T.MathUtils.lerp(hash(ix,iy+1),hash(ix+1,iy+1),u),v);
}
const noise3 = `
float hash31(vec3 p) {
  p = fract(p * .1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x+p.y)*p.z);
}
float value3(vec3 p) {
  vec3 i=floor(p), u=fract(p);
  u=u*u*(3.-2.*u);
  return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),u.x), mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),u.x),u.y),
    mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),u.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),u.x),u.y),u.z);
}
`;
export async function loadStone(){
  const loader=new T.TextureLoader();
  const [color,detail]=await Promise.all([
    loader.loadAsync(new URL('../assets/Rock010_1K-JPG_Color.jpg',import.meta.url).href),
    loader.loadAsync(new URL('../assets/Rock010_1K-JPG_Displacement.jpg',import.meta.url).href),
  ]);
  color.colorSpace=T.SRGBColorSpace;
  for(const tex of [color,detail]){
    tex.wrapS=tex.wrapT=T.RepeatWrapping;
    tex.anisotropy=8;
  }
  return {color,detail};
}
export function surface(color, kind = 'paint', options = {}, stone = null) {
  const mat = new T.MeshStandardMaterial({ color, roughness:.82, metalness:.16, ...options });
  mat.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec3 surfP; varying vec3 surfN;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <worldpos_vertex>', `
    #include <worldpos_vertex>
    vec4 surfPosition=vec4(transformed,1.0);
    #ifdef USE_INSTANCING
      surfPosition=instanceMatrix*surfPosition;
    #endif
    surfP=(modelMatrix*surfPosition).xyz;
    surfN=inverseTransformDirection(transformedNormal,viewMatrix);
    `);
    shader.fragmentShader = noise3 + '\nvarying vec3 surfP; varying vec3 surfN;\n' + shader.fragmentShader;
    if(stone){
      shader.uniforms.stoneColor={value:stone.color};
      shader.uniforms.stoneDetail={value:stone.detail};
      shader.fragmentShader=`
        uniform sampler2D stoneColor;
        uniform sampler2D stoneDetail;
        vec3 projectStone(sampler2D map,vec3 p,vec3 n){
          vec3 w=pow(abs(n),vec3(3.65));
          w/=max(w.x+w.y+w.z,.0001);
          return texture2D(map,p.zy).rgb*w.x+texture2D(map,p.xz).rgb*w.y+texture2D(map,p.xy).rgb*w.z;
        }
      `+shader.fragmentShader;
    }
    const samples = `
      vec3 sp = surfP;
      vec3 sn = normalize(surfN);
      float microHeight=0.;
      float n0 = value3(sp * .49);
      float n1 = value3(sp * 2.37 + 16.);
      float grit = value3(sp * 42.);
      float fGrain = mix(grit, .5, smoothstep(.10,.53,length(fwidth(sp))*20.));
    `;
    const treatments = {
      snow: `
        float deposited=value3(vec3(sp.x*.21,sp.y*.29,sp.z*.135));
        float windTurn=mix(.23,.78,value3(vec3(sp.x*.077,1.6,sp.z*.061)));
        float across=sp.z*cos(windTurn)+sp.x*sin(windTurn);
        float downwind=sp.x*cos(windTurn)-sp.z*sin(windTurn);
        float meander=value3(vec3(sp.x*.197,sp.y*.23,sp.z*.12));
        vec3 streak=vec3(downwind,sp.y,across);
        vec3 bend=streak+vec3((n0-.5)*2.11,0.,(meander-.5)*2.29);
        float curves=value3(bend*vec3(.52,2.6,3.04)+n0*.91)*.56+value3(bend*vec3(1.49,2.5,6.68))*.26+value3(sp*5.69+meander*.81)*.18;
        float loose=smoothstep(.37,.68,deposited+(n0-.5)*.32);
        float drift=pow(max(curves,0.),1.38)*loose;
        float rime=value3(streak*vec3(2.4,1.2,11.4)+curves*2.9);
        float clumps=smoothstep(.44,.73,value3(sp*5.7+11.)*.73+n1*.27);
        float slope=1.-clamp(sn.y,0.,1.);
        float bare=smoothstep(.27,.73,slope+(n0-.53)*.62+(n1-.49)*.17);
        float layer=value3(sp*vec3(.34,1.75,.34)+n0*2.);
        vec3 snowCol=diffuseColor.rgb*(.71+.20*n0+.21*drift+.099*n1+.071*fGrain+.091*clumps+.070*deposited);
        snowCol*=mix(vec3(.92,.97,1.04),vec3(1.022,1.010,.978),smoothstep(.29,.66,curves));
        float grainHeight=(fGrain-.5)*.0028;
        microHeight=(.013*curves*loose+.0056*rime+.013*clumps+grainHeight)*mix(1.,.16,smoothstep(.037,.25,length(fwidth(sp))));
        vec3 rockCol=vec3(.103,.122,.15)*(.55+.54*n0+.37*layer+.15*n1);
        diffuseColor.rgb=mix(snowCol,rockCol,bare);
      `,
      alpine: `
        vec2 mapPoint=(sp.xz+vec2(2010.,2316.))/vec2(4020.,4380.);
        vec3 photo=texture2D(alpineColor,mapPoint).rgb;
        float aerial=dot(photo,vec3(.2126,.7152,.0722));
        vec3 axis=vec3(sp.x*.884+sp.z*.468,sp.y,sp.z*.884-sp.x*.468);
        float large=value3(axis*vec3(.030,.047,.039));
        float bent=axis.y+.31*axis.x-.19*axis.z+(large-.5)*3.6;
        float strata=value3(vec3(axis.x*.084,bent*.380,axis.z*.106));
        float fractured=value3(vec3(axis.x*.29+axis.y*.026,axis.y*.13,axis.z*.27)+large*.4);
        float broad=value3(vec3(axis.x*.051+axis.z*.029,axis.y*.073,axis.z*.087));
        float windFace=dot(sn,normalize(vec3(.61,.13,.61)));
        float horizontal=clamp(sn.y,0.,1.);
        float flank=1.-smoothstep(.32,.83,horizontal);
        float lee=clamp((.57-windFace)*.60,0.,1.);
        float basin=bakedRangeShade.y-.50;
        float joints=bakedRangeShade.z-.50;
        float bench=value3(vec3(axis.x*.118,bent*.52+fractured*.18,axis.z*.16));
        float shelf=1.-smoothstep(.06,.24,abs(bench-.49));
        float exposed=(1.-horizontal)*.87+windFace*.10+(broad-.50)*.27-basin*.25-joints*.12;
        float runoff=smoothstep(.41,.67,fractured+(strata-.50)*.20)*flank;
        float regional=1.-smoothstep(100.,586.,length(sp.xz*vec2(1.,.69)));
        float deepSnow=1.-smoothstep(.22,.61,exposed+runoff*.103-shelf*.113);
        float deposits=smoothstep(.19,.73,aerial)*(.58+.40*horizontal);
        float snow=clamp(mix(deposits,deepSnow,regional),0.,1.);
        vec3 rockImage=projectStone(stoneColor,sp*.13+large*.12,sn);
        float rockSample=dot(rockImage,vec3(.2126,.7152,.0722));
        float rockEdges=projectStone(stoneDetail,sp*.192+large*.23,sn).r;
        float shade=max(.1, .66+strata*.57+fractured*.21);
        vec3 baseRock=mix(vec3(.046,.061,.076),vec3(.235,.169,.114),large);
        baseRock*=shade*(.55+rockSample*1.61)*mix(.75,1.15,shelf);
        float powder=value3(vec3(axis.x*.128,axis.y*.475,axis.z*.59)+broad*.54);
        vec3 baseSnow=mix(vec3(.39,.505,.63),vec3(.87,.86,.79),.52+powder*.17+lee*.16+basin*.21);
        float dust=runoff*(1.-smoothstep(.16,.57,abs(snow-.44)));
        vec3 physical=mix(baseRock,baseSnow,snow);
        physical=mix(physical,vec3(.32,.324,.29),dust*.14);
        vec3 satellite=mix(vec3(.061,.076,.099),photo*vec3(.78,.88,1.03),.80);
        physical=mix(satellite,physical,.52+regional*.47);
        float side=sp.x-(-sp.z-142.)*.16-4.8-5.1*sin((-sp.z-99.)*.022);
        float ice=(1.-smoothstep(8.,23.,abs(side)+(broad-.50)*6.))*smoothstep(-sp.z,107.,151.)*(1.-smoothstep(-sp.z,280.,353.));
        ice*=smoothstep(.37,.75,horizontal)*(1.-smoothstep(-58.,-24.,sp.y));
        float iceFold=value3(vec3((sp.x+sp.z*.35)*.25,sp.y*.21,(sp.z-sp.x*.15)*.149));
        float blueCuts=1.-smoothstep(.039,.196,abs(iceFold-.47));
        vec3 glacier=mix(vec3(.094,.223,.275),vec3(.45,.65,.70),clamp(.36+broad*.56-blueCuts*.29,0.,1.));
        diffuseColor.rgb=mix(physical,glacier,ice*.79);
        float footprint=length(fwidth(sp));
        float relief=(strata*.20+fractured*.14+rockEdges*.097-shelf*.032)*(1.-smoothstep(.43,2.45,footprint));
        microHeight=mix(relief,(powder*.036+rockEdges*.019)*(1.-smoothstep(.35,1.8,footprint)),snow);
      `,
      road: `
        float width=1.91+value3(vec3(sp.z*.17,0.,7.))*1.06;
        float ruts=1.-smoothstep(.19,.60,abs(abs(sp.x+sin(sp.z*.24)*.08)-.89));
        float drift=smoothstep(width-.19,width+.26,abs(sp.x)+(n1-.5)*.53);
        float crust=smoothstep(.64,.94,n0*.54+n1*.46)*(1.-ruts*.76);
        diffuseColor.rgb=mix(diffuseColor.rgb*(.86+n1*.29),vec3(.46,.54,.62),crust*.65);
        diffuseColor.a*=1.-drift;
        microHeight=(n1-.5)*.003;
      `,
      rock: `
        float layers=value3(sp*vec3(1.38,7.8,1.55)+n0*1.9);
        vec3 bed=diffuseColor.rgb*(.50+.44*n0+.28*n1+.28*layers+.07*fGrain);
        float bank=smoothstep(.49,.88,sn.y+n0*.27+(n1-.5)*.12);
        diffuseColor.rgb=mix(bed,vec3(.50,.59,.67)*(.8+.23*layers),bank*.88);
        microHeight=(layers*.064+n1*.046+grit*.003)*(1.-smoothstep(.06,.31,length(fwidth(sp))));
      `,
      grating: `
        float gx=abs(fract(sp.x*10.)-.5);
        float gz=abs(fract(sp.z*3.5)-.5);
        float aa=max(fwidth(sp.x*10.),fwidth(sp.z*3.5));
        float slot=smoothstep(.30-aa,.36+aa,gx)*smoothstep(.27-aa,.34+aa,gz);
        float ribs=smoothstep(.34-aa,.48+aa,abs(fract((sp.x+sp.z)*14.)-.5));
        diffuseColor.rgb*=.78+n0*.35+ribs*.15+fGrain*.11-slot*.52;
      `,
      fabric: `
        float weave=value3(sp*vec3(125.,78.,125.));
        diffuseColor.rgb*=.80+.25*n1+.10*mix(weave,.5,smoothstep(.25,.85,length(fwidth(sp))*105.));
      `,
      hallFloor: `
        float direction=value3(vec3(sp.x*.45,3.,sp.z*.13));
        float aggregate=value3(vec3(sp.x*36.,4.11,sp.z*38.));
        float wake=value3(vec3(sp.x*.62,11.9,sp.z*1.73));
        float cold=smoothstep(.38,.75,direction*.75+wake*.25);
        float lane=1.-smoothstep(1.32,2.25,abs(sp.x+.4*sin(sp.z*.39)));
        float oldCoat=smoothstep(.31,.69,wake+lane*.17);
        float rub=smoothstep(.56,.80,aggregate*.63+value3(sp*9.4)*.37);
        float cracks=abs(value3(vec3(sp.x*.61,7.,sp.z*.59))-.54);
        float chipped=(1.-smoothstep(.007,.026,cracks))*smoothstep(.40,.78,n1)*.27;
        float grain=1.-smoothstep(.06,.28,length(fwidth(sp)));
        diffuseColor.rgb*=mix(.64,1.10,oldCoat)*mix(.89,1.10,cold);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.025,.022,.020),chipped);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.27,.248,.221),rub*.13*grain);
        microHeight=(aggregate*.00143+chipped*.007+rub*.0017)*grain;
      `,
      plaster: `
        float water=value3(sp*vec3(6.9,.55,6.9)+n0*.57);
        float mold=value3(sp*vec3(3.4,1.8,3.4)+14.2);
        float seam=1.-smoothstep(.010,.042,abs(mod(sp.y+.17,1.10)-.52)+n1*.009);
        float pitting=smoothstep(.63,.92,value3(sp*52.0)*.70+grit*.30);
        float wet=smoothstep(.43,.77,n0*.60+water*.40)*(.89-.74*smoothstep(.25,3.45,sp.y));
        diffuseColor.rgb*=.77+n0*.31+mold*.14-seam*.20-wet*.38-pitting*.24;
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.055,.062,.059),wet*.26);
        microHeight=(pitting*.0031+seam*.007+grit*.00092)*(1.-smoothstep(.05,.25,length(fwidth(sp))));
      `,
      paint: `
        float drip=value3(sp*vec3(13.,.43,13.)+n0*1.4);
        float chip=smoothstep(.70,.94,n1*.38+value3(sp*12.5)*.62)*.56;
        diffuseColor.rgb*=.77+.21*n0+.14*n1+.13*fGrain;
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.10,.12,.13)*(1.+.9*fGrain),chip*.78);
        diffuseColor.rgb*=1.-.20*smoothstep(.60,.91,drip)*(.69-.56*max(sn.y,0.));
        microHeight=((fGrain-.5)*.0009+chip*.004+n1*.0025)*(1.-smoothstep(.048,.26,length(fwidth(sp))));
      `,
    };
    let treatment=treatments[kind];
    if(stone&&kind==='rock'){
      treatment=treatment.replace('float bank=',`
        vec3 measured=projectStone(stoneColor,sp*.71,sn);
        float sampleGray=dot(measured,vec3(.2126,.7152,.0722));
        bed=mix(bed,vec3(.72,.78,.86)*sampleGray,.66);
        float scan=projectStone(stoneDetail,sp*.71,sn).r;
        float bank=`)
        .replace('microHeight=','microHeight=scan*(1.-bank)*.028+');
    }
    if(kind==='alpine'){
      shader.uniforms.alpineColor={value:stone.ortho};
      shader.uniforms.terrainClock=stone.terrainClock;
      shader.uniforms.terrainClear=stone.terrainClear;
      shader.vertexShader='attribute vec3 rangeShade; varying vec3 bakedRangeShade;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('surfP=(modelMatrix*surfPosition).xyz;', 'surfP=(modelMatrix*surfPosition).xyz; bakedRangeShade=rangeShade;');
      shader.fragmentShader='uniform sampler2D alpineColor; uniform float terrainClock,terrainClear; varying vec3 bakedRangeShade;\n'+shader.fragmentShader;
    }
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + samples + treatment);
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
      #include <normal_fragment_maps>
      vec3 sx=dFdx(-vViewPosition), sy=dFdy(-vViewPosition);
      vec3 rx=cross(sy,normal), ry=cross(normal,sx);
      float jac=dot(sx,rx)*faceDirection;
      vec3 grad=sign(jac)*(dFdx(microHeight)*rx+dFdy(microHeight)*ry);
      normal=normalize(normal*max(abs(jac),.00000001)-grad);
    `);
    if (kind === 'alpine') {
      shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`
        #include <lights_fragment_end>
        float sunThrough=mix(1.,.22,bakedRangeShade.x);
        float skyPocket=1.-smoothstep(.57,.98,bakedRangeShade.y)*.28;
        float movingCover=value3(vec3(surfP.x*.0083+surfP.z*.0046-terrainClock*.043,surfP.z*.011+terrainClock*.012,3.91));
        float openSky=mix(.59,1.11,smoothstep(.29,.70,movingCover+terrainClear*.15));
        reflectedLight.directDiffuse*=vec3(sunThrough*openSky);
        reflectedLight.directSpecular*=sunThrough*openSky;
        reflectedLight.indirectDiffuse*=skyPocket*mix(vec3(1.),vec3(.68,.83,1.08),bakedRangeShade.x*.72);
      `);
      shader.fragmentShader = shader.fragmentShader.replace('#include <fog_fragment>', `
        float range=length(cameraPosition-surfP);
        float horizon=1.-exp(-range*.00042);
        float veil=exp(-max(surfP.y+57.,0.)*.027);
        float valleyVeil=value3(vec3(surfP.x*.007,surfP.y*.022,surfP.z*.006));
        float depthMist=veil*mix(.025,.21,smoothstep(105.,850.,range))*mix(.81,1.15,valleyVeil);
        float western=pow(max(dot(normalize(surfP-cameraPosition),vec3(-.41,.22,-.88)),0.),3.6);
        vec3 haze=mix(vec3(.145,.218,.304),vec3(.347,.305,.272),western*.78);
        gl_FragColor.rgb=mix(gl_FragColor.rgb,haze,clamp(horizon*.75+depthMist,0.,.92));
      `);
    }
  };
  mat.customProgramCacheKey = () => kind+(stone?'-stone':'');
  return mat;
}
export function lit(color, intensity = 2.5) {
  return new T.MeshStandardMaterial({ color, emissive:color, emissiveIntensity:intensity, roughness:.39 });
}
export function canvasTexture(w,h,paint) {
  const canvas = document.createElement('canvas');
  canvas.width=w; canvas.height=h;
  paint(canvas.getContext('2d'),w,h);
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace=T.SRGBColorSpace;
  texture.anisotropy=8;
  return texture;
}
function makeSky(scene, panorama) {
  const sky = new T.Mesh(new T.SphereGeometry(3000,32,18),new T.ShaderMaterial({
    side:T.BackSide, depthWrite:false, fog:false,
    uniforms:{ sun:{ value:sunDirection }, weather:{ value:0 }, t:{value:0}, panorama:{value:panorama} },
    vertexShader:`
      varying vec3 skyP;
      void main(){ skyP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
    `,
    fragmentShader:noise3+`
      uniform vec3 sun;
      uniform sampler2D panorama;
      uniform float weather;
      uniform float t;
      varying vec3 skyP;
      float cloudBody(vec3 q){
        vec3 p=vec3((q.x+q.z*.28)*.00205,q.y*.0067,q.z*.00335)+vec3(-t*.014,18.1,7.2);
        float belt=value3(p*.45);
        vec3 curve=vec3(belt-.5,value3(p*.82+8.4)-.5,0.)*.91;
        float core=value3(p+curve);
        float curl=value3(p*2.11+curve*2.01+vec3(7.3,2.2,3.8));
        float edge=value3(p*5.12+curve*2.71+17.);
        float fray=value3(p*10.3+vec3(.5,0.,4.8));
        return belt*.36+core*.32+curl*.19+edge*.088+fray*.042;
      }

      void main(){
        vec3 d=normalize(skyP);
        float sd=max(dot(d,sun),0.);
        // Keep the sky-only panorama in angular coordinates through the zenith.
        float azimuth=atan(d.z,d.x);
        float heading=atan(sun.z,sun.x);
        float az=fract((azimuth-heading)*.15915494+.6118);
        float angle=asin(clamp(d.y,0.,1.));
        float v=.503+angle*(.088+angle*.143);
        vec3 photograph=texture2D(panorama,vec2(az,v)).rgb;
        float intensity=dot(photograph,vec3(.2126,.7152,.0722));
        float warm=pow(sd,3.9);
        vec3 measured=photograph/(.75+pow(max(0.,intensity),.62)*.81);
        float gray=dot(measured,vec3(.2126,.7152,.0722));
        measured=mix(vec3(gray),measured,.55+weather*.10);
        vec3 cold=vec3(.36,.55,.84), hot=vec3(1.07,.79,.47);
        vec3 lightTint=mix(cold,hot,warm*(.53+weather*.39));
        vec3 blue=mix(vec3(.151,.285,.51),vec3(.072,.159,.329),smoothstep(.05,.88,d.y));
        vec3 photo=pow(max(measured,vec3(.0001))*lightTint,vec3(1.15));
        vec3 color=mix(blue,photo,.77)*(1.+weather*.20);
        float skyDip=smoothstep(-.035,.15,d.y);
        vec3 horizon=mix(vec3(.164,.274,.394),vec3(.63,.425,.262),pow(sd,5.1));
        color=mix(horizon,color,skyDip);
        if(d.y>-.021){
          float elev=max(.072,d.y);
          float depthSpan=mix(153.,228.,smoothstep(.04,.59,d.y));
          float cover=.503+weather*pow(sd,5.8)*.119;
          vec3 base=d*(422./elev);
          vec3 drift=d*depthSpan/elev;
          float transmittance=1.;
          vec3 scatter=vec3(0.);
          for(int i=0;i<13;i++){
            float k=(float(i)+.46)/13.;
            vec3 q=base+drift*k;
            float shape=cloudBody(q);
            float profile=smoothstep(.02,.32,k)*(1.-smoothstep(.57,1.,k));
            float mass=smoothstep(cover-.037,cover+.128,shape)*profile;
            float shadow=cloudBody(q+sun*123.+vec3(0.,66.,0.));
            float bright=smoothstep(-.038,.165,shape-shadow+.017);
            float forward=pow(sd,11.);
            vec3 under=mix(vec3(.095,.126,.182),vec3(.172,.148,.145),warm*.72);
            vec3 rim=mix(vec3(.62,.73,.89),vec3(1.65,1.05,.57),forward*(.66+.29*weather));
            float alpha=mass*.34*skyDip*smoothstep(.058,.32,d.y);
            scatter+=transmittance*alpha*mix(under,rim,bright*(.49+.23*k)+forward*.20);
            transmittance*=1.-alpha;
          }
          color=color*transmittance+scatter;
        }
        float backlight=pow(max(0.,sd),17.)*exp(-d.y*.9);
        color+=vec3(.177,.114,.078)*backlight*(.25+weather*.89);
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `
  }));
  sky.frustumCulled=false;
  sky.renderOrder=-10;
  sky.userData.skipOcclusion=true;
  scene.add(sky);
  return sky;
}

function makeSnow(scene) {
  const r = randomGen(87123);
  const data = new Float32Array(4600*3);
  for (let i=0;i<data.length;i++) data[i]=r();
  const g=new T.BufferGeometry();
  g.setAttribute('position',new T.BufferAttribute(data,3));
  const mat = new T.ShaderMaterial({
    transparent:true, depthWrite:false,
    uniforms:{t:{value:0},travel:{value:0},gust:{value:0},center:{value:new T.Vector3()},viewport:{value:900}, indoor:{value:0}, reduced:{value:0}},
    vertexShader:`
      uniform float t,travel,gust,viewport,indoor,reduced;
      uniform vec3 center;
      varying float opacity;
      varying float slope;
      void main(){
        vec3 seed=position;
        float pace=.65+seed.x*1.45;
        vec3 drift=vec3(travel*pace,-t*.030*pace,t*.007+sin(t*.67+seed.y*30.)*.024);
        vec3 p=(fract(seed+drift-center/vec3(45.,19.,52.))-.5)*vec3(45.,19.,52.)+center;
        vec4 mv=viewMatrix*vec4(p,1.);
        float depth=-mv.z;
        float size=(.012+seed.z*.033)*viewport/max(depth,.3);
        gl_PointSize=clamp(size*1.63,1.1,16.);
        opacity=smoothstep(.42,2.25,depth)*(1.-smoothstep(15.,29.,depth))*(.16+seed.y*.5)*(1.-indoor);
        opacity*=smoothstep(.16,.39,seed.x+gust*.49)*(1.-reduced*.38);
        slope=(seed.x-.5)*.38+.24+gust*.32;
        gl_Position=projectionMatrix*mv;
      }
    `,
    fragmentShader:`
      varying float opacity;
      varying float slope;
      void main(){
        vec2 p=gl_PointCoord-.5;
        p.y-=p.x*slope;
        float a=exp(-dot(p*vec2(1.5,3.7),p*vec2(1.5,3.7))*5.3);
        if(a<.018 || opacity<.008) discard;
        gl_FragColor=vec4(.73,.85,1.,a*opacity);
      }
    ` });
  const particles=new T.Points(g,mat);
  particles.frustumCulled=false;
  particles.layers.set(1);
  particles.renderOrder=12;
  scene.add(particles);
  return mat.uniforms;
}
class WorldOcclusionPass extends GTAOPass {
  overrideVisibility() {
    super.overrideVisibility();
    // The normal-material override removes alpha and billboard orientation.
    // Keep transparent effects and cutouts out of the opaque depth used by the fog.
    this.scene.traverseVisible(object=>{
      if(object.userData.skipOcclusion || object.isSprite || (object.isMesh && !Array.isArray(object.material) &&
        (object.material.transparent || object.material.alphaTest>0 || !object.material.depthWrite))) object.visible=false;
    });
  }
}

export function createVisual(view, {winter,dawn,workshop}) {
  const scene = new T.Scene();
  const terrainClock={value:0},terrainClear={value:0};
  scene.fog = new T.FogExp2(0x515f68,.0076);
  const camera = new T.PerspectiveCamera(68,innerWidth/innerHeight,.043,3200);
  camera.rotation.order='YXZ';
  camera.layers.enable(1);
  const renderer = new T.WebGLRenderer({ antialias:false, powerPreference:'high-performance' });
  renderer.setClearColor(0x546579);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate=true;
  renderer.domElement.setAttribute('aria-hidden','true');
  view.appendChild(renderer.domElement);

  const hemi = new T.HemisphereLight(0xb4cce9,0x44403c,0.70);
  const sun = new T.DirectionalLight(0xffbb8c,1.35);
  sun.position.copy(sunDirection).multiplyScalar(100).add(new T.Vector3(0,0,-22));
  sun.target.position.set(0,0,-22);
  sun.castShadow=true;
  sun.shadow.mapSize.set(3072,3072);
  sun.shadow.camera.left=-30; sun.shadow.camera.right=30;
  sun.shadow.camera.top=38; sun.shadow.camera.bottom=-36;
  sun.shadow.camera.near=25; sun.shadow.camera.far=190;
  sun.shadow.bias=-.00020; sun.shadow.normalBias=.055;
  scene.add(hemi,sun,sun.target);

  const target = new T.WebGLRenderTarget(1,1,{ type:T.HalfFloatType, samples:2 });
  const composer=new EffectComposer(renderer,target);
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.addPass(new RenderPass(scene,camera));
  const occlusion=new WorldOcclusionPass(scene,camera,innerWidth,innerHeight,{},
    {radius:.57,thickness:.86,distanceFallOff:.94,samples:12,scale:1},
    {radius:4.9,rings:2,samples:10,lumaPhi:10,depthPhi:3.8,normalPhi:5});
  occlusion.blendIntensity=.79;
  composer.addPass(occlusion);
  const atmosphere=makeAtmosphere(camera,occlusion.depthTexture);
  composer.addPass(atmosphere.pass);
  const bloom = new UnrealBloomPass(new T.Vector2(500,300),.285,.51,.91);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const sky=makeSky(scene,dawn);
  const irradiance=new T.PMREMGenerator(renderer);
  const environment=irradiance.fromEquirectangular(winter);
  const interior=irradiance.fromEquirectangular(workshop);
  scene.environment=environment.texture;
  scene.environmentRotation.y=.64;
  scene.environmentIntensity=.48;
  irradiance.dispose();
  const snow=makeSnow(scene);
  const streak=new T.Vector3();
  let indoorBlend=0, skyBreak=0, gust=0, squall=0, windTravel=0;
  const resize=()=>{
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
    composer.setSize(innerWidth,innerHeight);
    snow.viewport.value=innerHeight*renderer.getPixelRatio();
  };
  window.addEventListener('resize',resize); resize();
  return {
    scene,camera,renderer,terrainClock,terrainClear,
    async prepareScene(){
      renderer.setRenderTarget(target);
      try{await renderer.compileAsync(scene,camera);}
      finally{renderer.setRenderTarget(null);}
    },
    draw(time,dt, disposition={}) {
      const inside=disposition.inside ? 1 : 0;
      indoorBlend=T.MathUtils.damp(indoorBlend,inside,11,dt);
      skyBreak=T.MathUtils.damp(skyBreak,disposition.weather||0,.87,dt);
      gust=T.MathUtils.damp(gust,disposition.wind||0,2.1,dt);
      squall=T.MathUtils.damp(squall,disposition.squall||0,.91,dt);
      windTravel+=(.025+.044*gust)*dt;
      sun.color.setRGB(1,.72-skyBreak*.10,.56-skyBreak*.11);
      sun.intensity=1.62+skyBreak*3.09-indoorBlend*.63;
      hemi.intensity=.44+skyBreak*.30-indoorBlend*.04;
      scene.environment=indoorBlend>.59?interior.texture:environment.texture;
      scene.environmentRotation.y=indoorBlend>.59?-.68:.64;
      const probeTransition=T.MathUtils.smoothstep(Math.abs(indoorBlend-.59),0,.24);
      const indirect=indoorBlend>.59?.31:.38+skyBreak*.19;
      scene.environmentIntensity=indirect*probeTransition;
      sky.position.copy(camera.position);
      sky.material.uniforms.t.value=time;
      sky.material.uniforms.weather.value=skyBreak;
      terrainClock.value=time;terrainClear.value=skyBreak;
      snow.t.value=time; snow.indoor.value=indoorBlend;
      snow.travel.value=windTravel; snow.gust.value=gust;
      snow.reduced.value=disposition.reduced ? 1 : 0;
      streak.copy(camera.position);
      snow.center.value.copy(streak);
      if (disposition.focusZ !== undefined) {
        const z=clamp(disposition.focusZ,-54,17);
        sun.target.position.z=z;
        sun.position.copy(sunDirection).multiplyScalar(100);
        sun.position.z+=z;
      }
      atmosphere.update(time,skyBreak,gust,squall,Boolean(disposition.reduced));
      composer.render(dt);
    },
  };
}




