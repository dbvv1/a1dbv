import * as T from 'three';

// Distance covered since the head of the release reached this section of channel.
const advection=`
  float currentAge(float reach) { return max(0., (travel-reach)/5.9); }
  float currentDistance(float reach) {
    float age=currentAge(reach);
    return age-(1.-exp(-age*.96))/.96;
  }
  float wash(float reach) { return smoothstep(-1.6,4.1,travel-reach)*flow; }
`;

const vertex=`
  uniform float time,flow,surge,travel;
  varying vec2 section;
  varying vec3 waterPoint, waterNormal;
  ${advection}
  float level(vec2 p) {
    float reach=max(0.,p.y);
    float local=wash(reach);
    float drift=currentDistance(reach);
    float x=p.x-.25*sin(reach*.16);
    float center=1.-smoothstep(.7,4.5,abs(x));
    float drag=1.-.88*smoothstep(3.91,5.2,abs(x));
    float momentum=1.-.80*smoothstep(13.,47.,reach);
    float formed=local*(.55+.45*center)*momentum*drag;
    float a=(reach-drift*4.43)*3.27-x*1.87+.89*sin(x*1.51+reach*.29);
    float b=(reach-drift*3.26)*5.41+x*2.28+sin(x*2.34);
    float c=(reach-drift*1.72)*10.8-x*2.36;
    float swell=pow(.5+.5*sin(a),2.9)*.145-.040;
    swell+=sin(b)*.052+sin(c)*.020;
    float nose=travel-reach-1.85*sin(x*.63);
    float bore=exp(-nose*nose*.131)*smoothstep(.04,2.85,travel)*
      (1.-smoothstep(27.,68.,travel));
    float sill=exp(-reach*.67)*local*(.24+.13*sin(x*5.6-time*11.4));
    float jet=surge*local*exp(-reach*.20)*center;
    return sin(reach*2.2-x*3.28-time*1.7)*.013*drag + formed*swell + bore*.31*center
      + center*sill+jet*(.13+.12*sin(a*.91));
  }
  void main() {
    section=position.xy+vec2(0.,40.5);
    vec3 q=position;
    q.x+=10.6*smoothstep(36.4,75.4,section.y)-3.1*smoothstep(70.4,105.4,section.y);
    q.z=level(section);
    float across=(level(section+vec2(.015,0))-q.z)/.015;
    float along=(level(section+vec2(0,.015))-q.z)/.015;
    waterNormal=normalize(mat3(modelMatrix)*vec3(-across,-along,1.));
    waterPoint=(modelMatrix*vec4(q,1.)).xyz;
    gl_Position=projectionMatrix*viewMatrix*vec4(waterPoint,1.);
  }
`;

const fragment=`
  uniform float time,flow,surge,travel;
  uniform sampler2D panorama,bubbles;
  varying vec2 section;
  varying vec3 waterPoint,waterNormal;
  ${advection}
  float hash(vec2 p) {
    vec3 q=fract(vec3(p.xyx)*.1031);
    q+=dot(q,q.yzx+33.33);
    return fract((q.x+q.y)*q.z);
  }
  float noise(vec2 p) {
    vec2 i=floor(p),f=fract(p);
    f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);
  }
  void main() {
    float reach=section.y;
    float local=wash(reach);
    float x=section.x-.27*sin(reach*.24);
    float bank=smoothstep(3.08,4.92,abs(x));
    float core=1.-smoothstep(1.19,4.12,abs(x));
    float current=currentDistance(reach);
    float winding=noise(vec2(x*.42,reach*.26))-.5;
    float speed=mix(4.64,1.68,bank);
    vec2 stream=vec2(x+winding*.72,reach-current*speed-time*.19);
    vec2 quay=vec2(x*1.65,reach*.81+current*.91+time*.29);
    float eddy=noise(quay*vec2(.97,.74)+3.);
    float broken=noise(stream*vec2(.69,.53)+vec2(5.2,3.5));
    float channels=noise(stream*vec2(2.85,.44)+winding);
    float wrinkle=noise(stream*vec2(3.14,2.15)+broken);
    float footprint=length(fwidth(section));
    float shear=noise(stream*vec2(1.10,1.34)+vec2(wrinkle*.53,-channels*.37));
    vec2 foamUV=stream*vec2(.69,.35)+vec2(wrinkle*.11,channels*.14);
    vec3 foamTex=texture2D(bubbles,foamUV).rgb;
    vec3 chop=texture2D(bubbles,stream*vec2(1.67,.93)+vec2(.21,.73)).rgb;
    float stipple=mix(chop.r,.52,smoothstep(.042,.184,footprint));
    float bubbleRim=smoothstep(.30,.71,foamTex.r*.53+stipple*.46+wrinkle*.24);
    float ribbon=smoothstep(.33,.71,channels*.47+broken*.41+shear*.21);
    float spill=exp(-reach*.22)*core;
    float crest=.5+.5*sin((reach-current*4.43)*3.27-x*1.87+.89*sin(x*1.51+reach*.29));
    float cap=smoothstep(.69,.91,crest)*smoothstep(.36,.71,channels+stipple*.24);
    float swept=local*(bubbleRim*ribbon*(.50+.33*core)+cap*(.23+.24*broken));
    float banks=local*bank*smoothstep(.57,.81,eddy+wrinkle*.22)*(.21+.69*bubbleRim);
    float front=exp(-pow((reach-travel+1.85*sin(x*.63))*.29,2.))*core*
      smoothstep(.15,2.8,travel)*(1.-smoothstep(26.,69.,travel));
    float aeration=spill*local*(.18+surge*.36)*(.22+.78*stipple);
    float edge=1.-.77*smoothstep(4.05,5.15,abs(section.x));
    // Coherent crests give way to patches of surface foam deeper in the ravine.
    float settled=smoothstep(14.,47.,reach);
    float remnants=noise(vec2(x*.42,reach*.11-current*.43));
    float carry=smoothstep(.37,.67,remnants*.59+broken*.28+wrinkle*.19);
    float drifted=local*(.24+.28*core)*carry*bubbleRim+local*banks*.49;
    float white=clamp(mix(swept+banks+front*.73*bubbleRim+aeration,drifted,settled)*edge,0.,1.);

    vec2 normalMap=(foamTex.gb-.5)*.28+(chop.gb-.5)*.21;
    normalMap*=1.-.60*smoothstep(.036,.21,footprint);
    vec3 normal=normalize(waterNormal+vec3(normalMap.x,0,normalMap.y));
    vec3 eye=normalize(cameraPosition-waterPoint);
    vec3 glance=reflect(-eye,normal);
    float cosView=max(.0,dot(eye,normal));
    float fresnel=.021+.979*pow(1.-cosView,5.);
    vec2 uv=vec2(atan(glance.z,glance.x)*.15915494+.204,
      asin(clamp(glance.y,-.18,1.))*.31830989+.52);
    vec3 sky=texture2D(panorama,uv).rgb;
    sky=sky/(1.+max(sky.r,max(sky.g,sky.b))*.62);
    vec3 body=mix(vec3(.009,.026,.030),vec3(.032,.088,.084),.29+.42*eddy+.20*spill);
    body*=mix(.81,1.26,shear);
    float specular=pow(max(0.,dot(glance,normalize(vec3(-.76,.565,-.345)))),39.);
    vec3 openWater=body*(1.-fresnel)+sky*vec3(.63,.76,.86)*fresnel+vec3(.48,.60,.68)*specular*.39;
    float foamSkin=.51+.18*wrinkle+.25*stipple;
    vec3 foam=mix(vec3(.18,.28,.282),vec3(.78,.83,.80),foamSkin)*(.85+.16*crest);
    vec3 color=mix(openWater,foam,smoothstep(.028,.74,white));
    color+=vec3(.16,.21,.215)*max(0.,white-.58)*(.63+.37*foamTex.r);
    float shoal=smoothstep(4.12,5.18,abs(x+winding*.32));
    vec3 margin=body*1.35+sky*vec3(.09,.13,.14)*(.36+.39*eddy);
    color=mix(color,margin,shoal*.86);
    gl_FragColor=vec4(color,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function makeMillrace(scene,materials) {
  const uniforms={time:{value:0},flow:{value:0},surge:{value:0},travel:{value:0},
    panorama:{value:materials.sky},bubbles:{value:materials.foam}};
  const surface=new T.Mesh(new T.PlaneGeometry(10.4,81,72,238),
    new T.ShaderMaterial({uniforms,side:T.DoubleSide,vertexShader:vertex,fragmentShader:fragment}));
  surface.rotation.x=-Math.PI/2-.028;
  surface.position.set(0,-1.626,-68.13);
  scene.add(surface);
  return (time,release)=>{
    uniforms.time.value=time;
    uniforms.flow.value=release.discharge;
    uniforms.surge.value=release.surge;
    uniforms.travel.value=release.travel;
  };
}
