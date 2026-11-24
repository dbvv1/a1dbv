export const hallBandGLSL=`
  float hallBand(float z) {
    return smoothstep(-21.1,-20.55,z)*(1.-smoothstep(7.62,8.21,z));
  }
`;

const finishNoise=`
  float finishHash(vec2 p) {
    vec3 v=fract(p.xyx*.1031);
    v+=dot(v,v.yzx+33.33);
    return fract((v.x+v.y)*v.z);
  }
  float finishField(vec2 p) {
    vec2 i=floor(p), f=fract(p);
    f=f*f*(3.-2.*f);
    return mix(mix(finishHash(i),finishHash(i+vec2(1,0)),f.x),
      mix(finishHash(i+vec2(0,1)),finishHash(i+1.),f.x),f.y);
  }
`;

export const slabFilmGLSL=finishNoise+hallBandGLSL+`
  vec2 slabFilm(vec2 p) {
    vec2 s=(p-vec2(1.61,8.74))/vec2(3.22,3.92);
    vec2 seam=abs(fract(s+.5)-.5)*vec2(3.22,3.92);
    float run=smoothstep(.57,.87,finishField(p*vec2(1.59,.32)+11.));
    float underPipe=exp(-abs(p.x+5.48)*.57)*.23+exp(-abs(p.x-4.93)*.74)*.17;
    float basin=finishField(p*.58+vec2(8,13))*.68+finishField(p*1.53-vec2(7,2))*.32;
    float tooth=finishField(p*vec2(11.2,15.1));
    float graded=basin+underPipe+pow(run,2.)*.16;
    float seep=exp(-min(seam.x,seam.y)*13.)*smoothstep(.30,.61,graded);
    float filmAmount=graded+seep*.15+(tooth-.5)*.063;
    return vec2(smoothstep(.34,.68,filmAmount),smoothstep(.53,.78,filmAmount));
  }
`;

function worldPoint(shader) {
  shader.vertexShader='varying vec3 finishPoint;\n'+shader.vertexShader.replace(
    '#include <begin_vertex>','#include <begin_vertex>\nfinishPoint=(modelMatrix*vec4(position,1.)).xyz;'
  );
}

function floorFinish(material,cement) {
  const finish=material.clone();
  finish.customProgramCacheKey=()=> 'hall-slabs';
  finish.userData.surfaceTextures=[cement.map,cement.normalMap];
  finish.onBeforeCompile=shader=>{
    shader.uniforms.floorCement={value:cement.map};
    shader.uniforms.floorRelief={value:cement.normalMap};
    worldPoint(shader);
    shader.fragmentShader='varying vec3 finishPoint; uniform sampler2D floorCement,floorRelief;\n'+
      slabFilmGLSL+shader.fragmentShader.replace('#include <color_fragment>',`
        #include <color_fragment>
        vec2 p=finishPoint.xz;
        vec2 film=slabFilm(p);
        float hall=hallBand(p.y);
        vec2 movement=vec2(p.x*2.3,p.y*.29);
        float scuff=smoothstep(.46,.86,finishField(movement+3.))*
          smoothstep(.25,.77,finishField(p*1.6+4.));
        float traffic=(1.-smoothstep(1.4,2.6,abs(p.x+.20)));
        scuff*=traffic*hall;
        vec2 cementUV=vec2(p.x*.54+p.y*.12,p.y*.55-p.x*.12);
        vec3 aggregate=texture2D(floorCement,cementUV).rgb;
        float pores=texture2D(floorCement,cementUV*2.13+vec2(.37,.16)).r;
        vec3 base=diffuseColor.rgb;
        vec3 binder=aggregate*.45+vec3(.020,.018,.015);
        vec3 matrix=mix(base,binder,.42+traffic*.09)*(.88+.45*pores);
        matrix+=vec3(.048,.040,.032)*scuff;
        diffuseColor.rgb=mix(base,matrix*(1.-film.x*.28),hall);
      `).replace('#include <roughnessmap_fragment>',`
        #include <roughnessmap_fragment>
        float porosity=clamp(.84-aggregate.r*.16-scuff*.24,.49,.93);
        roughnessFactor=mix(roughnessFactor,mix(porosity,.29,film.x*.81),hall);
      `).replace('#include <normal_fragment_maps>',`
        #include <normal_fragment_maps>
        vec2 aggregateMap=texture2D(floorRelief,cementUV*1.87).xy*2.-1.;
        mat3 cementBasis=getTangentFrame(-vViewPosition,normal,cementUV);
        normal=normalize(normal+cementBasis*vec3(aggregateMap*(.73-film.y*.41)*hall,0.));
      `);
  };
  return finish;
}

function wallFinish(material,cement) {
  const finish=material.clone();
  finish.customProgramCacheKey=()=> 'hall-formwork';
  finish.userData.surfaceTextures=[cement.map,cement.normalMap,cement.roughnessMap];
  finish.onBeforeCompile=shader=>{
    material.onBeforeCompile(shader);
    shader.uniforms.castColor={value:cement.map};
    shader.uniforms.castNormal={value:cement.normalMap};
    shader.uniforms.castARM={value:cement.roughnessMap};
    worldPoint(shader);
    shader.fragmentShader='varying vec3 finishPoint; uniform sampler2D castColor,castNormal,castARM;\n'+
      finishNoise+hallBandGLSL+shader.fragmentShader.replace('#include <color_fragment>',`
        #include <color_fragment>
        vec3 p=finishPoint;
        float insideHall=hallBand(p.z)*step(abs(p.x),7.693)*step(p.y,7.63);
        vec2 boardUV=vec2((p.z+p.x*.05)*.57,p.y*.57)+vec2(.13,.09);
        vec3 stone=texture2D(castColor,boardUV).rgb;
        float oldRough=texture2D(castARM,boardUV).g;
        vec2 bay=vec2(floor((p.z+.32)/3.59),floor((p.y+.02)/1.05));
        float panel=finishHash(bay);
        float seep=finishField(vec2(p.z*1.32,p.y*.22))*finishField(vec2(p.z*4.2,p.y*.62)+8.0);
        float tide=(1.-smoothstep(.21,1.08,p.y))*(.56+.44*finishField(vec2(p.z*.75,p.y)));
        float salt=smoothstep(.52,.79,seep+finishField(boardUV*3.48)*.19);
        vec3 coat=mix(diffuseColor.rgb,stone*.78,.49);
        coat*=.91+.20*panel-.24*tide-.34*seep;
        coat=mix(coat,vec3(.203,.179,.140),salt*.28);
        diffuseColor.rgb=mix(diffuseColor.rgb,coat,insideHall);
      `).replace('#include <roughnessmap_fragment>',`
        #include <roughnessmap_fragment>
        roughnessFactor=mix(roughnessFactor,clamp(oldRough*.93+.15-seep*.32,.48,1.),insideHall);
      `).replace('#include <normal_fragment_maps>',`
        #include <normal_fragment_maps>
        vec2 grit=texture2D(castNormal,boardUV).xy*2.-1.;
        mat3 wallFrame=getTangentFrame(-vViewPosition,normal,boardUV);
        normal=normalize(normal+wallFrame*vec3(grit*insideHall*.69,0.));
      `);
  };
  return finish;
}

function flangeFinish(material,maps,cap) {
  const finish=material.clone();
  finish.customProgramCacheKey=()=>cap?'hall-flange-cap':'hall-flange-rim';
  finish.userData.surfaceTextures=Object.values(maps);
  finish.onBeforeCompile=shader=>{
    shader.uniforms.corrosion={value:maps.map};
    shader.uniforms.corrosionNormal={value:maps.normal};
    shader.uniforms.corrosionARM={value:maps.arm};
    worldPoint(shader);
    shader.fragmentShader='varying vec3 finishPoint; uniform sampler2D corrosion,corrosionNormal,corrosionARM;\n'+
      finishNoise+shader.fragmentShader.replace('#include <color_fragment>',`
        #include <color_fragment>
        vec3 P=finishPoint;
        float unit=floor((3.2-P.z)/8.85+.50);
        vec2 face=vec2(P.z-(3.2-unit*8.85),P.y-1.51);
        float radius=length(face);
        float theta=atan(face.y,face.x);
        float angle=(floor(theta*1.909859+.5))/1.909859;
        vec2 fastener=vec2(cos(angle),sin(angle))*.82;
        vec2 local=face-fastener;
        float washer=exp(-length(local)*18.);
        float seep=exp(-abs(local.x)*21.)*smoothstep(.025,.138,-local.y)*exp(-max(0.,-local.y)*7.6);
        float seam=${cap?'exp(-abs(radius-.405)*36.)*.33':'exp(-abs(radius-.922)*37.)*.38+exp(-abs(radius-.716)*32.)*.23'};
        vec2 rustUV=vec2(face.x,face.y)*1.27+vec2(unit*.271,unit*.673);
        vec3 oxide=texture2D(corrosion,rustUV).rgb;
        vec3 arm=texture2D(corrosionARM,rustUV).rgb;
        float chips=finishField(face*vec2(29.,47.)+unit*3.3);
        float trace=finishField(face*vec2(5.6,2.6)+unit*1.09);
        float corrosionDepth=(seam+washer*.58+seep*.66)*(.62+trace*.64);
        corrosionDepth+=chips*.21+smoothstep(.09,.30,oxide.r-oxide.b)*.17;
        float coatLoss=smoothstep(.35,.68,corrosionDepth);
        float scaledOxide=smoothstep(.47,.88,corrosionDepth);
        float brushed=.82+.18*finishField(vec2(radius*310.,theta*2.4));
        vec3 enamel=${cap?'vec3(.061,.119,.124)':'vec3(.390,.356,.268)'};
        vec3 bare=vec3(.103,.117,.120)*brushed;
        diffuseColor.rgb=mix(enamel*(.78+.41*trace),bare,coatLoss);
        diffuseColor.rgb=mix(diffuseColor.rgb,oxide*vec3(.72,.51,.40),scaledOxide*.9);
      `).replace('#include <roughnessmap_fragment>',`
        #include <roughnessmap_fragment>
        roughnessFactor=mix(.63,.31,coatLoss*(1.-scaledOxide));
        roughnessFactor=mix(roughnessFactor,clamp(arm.g+.12,.4,.97),scaledOxide);
      `).replace('#include <metalnessmap_fragment>',`
        #include <metalnessmap_fragment>
        metalnessFactor=mix(.21,.81,coatLoss*(1.-scaledOxide));
      `).replace('#include <normal_fragment_maps>',`
        #include <normal_fragment_maps>
        vec3 p=texture2D(corrosionNormal,rustUV).xyz*2.-1.;
        mat3 faceFrame=getTangentFrame(-vViewPosition,normal,rustUV);
        normal=normalize(mix(normal,faceFrame*normalize(vec3(p.xy*.77,p.z)),coatLoss*.68));
      `);
  };
  return finish;
}

export function makeHallFinishes(m) {
  return {
    slabs:floorFinish(m.floor,m.cast),
    concrete:wallFinish(m.wall,m.cast),
    flange:flangeFinish(m.cream,m.oxide,false),
    caps:flangeFinish(m.green,m.oxide,true),
    paint:m.doorGreen,
    panel:m.doorBlue
  };
}
