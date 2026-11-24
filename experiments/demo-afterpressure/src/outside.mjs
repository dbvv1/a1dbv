import * as T from 'three';
import { batches, random } from './art.mjs';
import { makeMillrace } from './millrace.mjs';
import { nearFirs } from './firs.mjs';

export const noiseSeed = 16039;
function downstreamAxis(z) {
  return 10.6*T.MathUtils.smoothstep(-z,64,103)-3.1*T.MathUtils.smoothstep(-z,98,133);
}
function terrain(x, z, seed) {
  const ridge=(ax,az,length,width,angle,height)=>{
    const dx=x-ax,dz=z-az,c=Math.cos(angle),s=Math.sin(angle);
    const u=(dx*c+dz*s)/length;
    const v=(-dx*s+dz*c)/width;
    const radius=Math.sqrt(u*u+v*v+.023)-.15;
    return height*Math.exp(-radius*2.13);
  };
  const noise = (a, b, s) => Math.sin(x * a + Math.cos(z * b) * 1.72 + seed) *
    Math.sin(z * b * 1.39 + Math.sin(x * a * .9) * 1.37 + seed * .68) * s;
  const many=ridge(-41,-51,44,18,-.51,29)+ridge(-45,-73,39,24,.52,25)
    +ridge(-66,0,53,26,.99,21)+ridge(34,-53,45,19,-.72,25)
    +ridge(30,-84,48,18,.46,28)+ridge(-8,-104,40,13,-.43,21)
    +ridge(-25,-98,25,12,.32,17)+ridge(11,-121,37,21,-.47,25)+ridge(-16,-142,32,17,.84,17)
    +ridge(-14,-57,15,4.3,.98,8.4)+ridge(22,-80,19,5.8,-.24,9.1)
    +ridge(-33,-44,20,5.7,.84,5.4)+noise(.15,.17,2.50)+noise(.37,.39,1.26)+noise(.93,.81,.62);
  const river=x-downstreamAxis(z)+Math.sin(z*.056)*3.15;
  const riverCut=Math.exp(-(Math.sqrt(river*river+.64)-.8)*.157);
  const cuts=riverCut*(.16+.84*T.MathUtils.smoothstep(z,-106,-71));
  const floor = Math.max(0, many * (1 - cuts * .97));
  const building = 1 - Math.max(0, 1 - Math.max(Math.abs(x) / 12, Math.abs(z + 6) / 24));
  const side=T.MathUtils.smoothstep(Math.abs(river),4.3,12.5);
  const drift=x*.82+z*.33+noise(.19,.21,2.15);
  const layer=.68*Math.sin(drift)+.29*Math.sin(drift*2.19+.3);
  const erosion=noise(.24,.26,1.74)+noise(.51,.58,.85);
  const erodedShelf=layer*T.MathUtils.smoothstep(erosion,-.45,.8);
  const outcrop=erosion+erodedShelf+noise(1.31,.97,.24);
  const level=-3.2+(floor+side*outcrop)*T.MathUtils.smoothstep(building,.67,.97);
  // Keep the excavated channel and the inspection deck supports above the valley skin.
  const abutment=6.09+Math.max(0,-z-29)*.045;
  const far=T.MathUtils.smoothstep(-z,75,110);
  const width=T.MathUtils.lerp(abutment,4.02,far);
  const channel=T.MathUtils.smoothstep(Math.abs(x-downstreamAxis(z)),width,width+4.7);
  const ridgesBehind=T.MathUtils.smoothstep(-z,104,126);
  const fromBank=T.MathUtils.smoothstep(z,-24.8,-22.5);
  return T.MathUtils.lerp(Math.min(level,-2.62),level,Math.max(fromBank,channel,ridgesBehind));
}

function cliffMaterial(maps) {
  const material=new T.MeshStandardMaterial({vertexColors:true,map:maps.map,roughness:.84,metalness:0});
  material.userData.surfaceTextures=[maps.normal,maps.arm];
  material.customProgramCacheKey=()=> 'photographic-cliff';
  material.onBeforeCompile=shader=>{
    shader.uniforms.cliffNormal={value:maps.normal};
    shader.uniforms.cliffARM={value:maps.arm};
    shader.vertexShader='varying vec3 rockPoint, rockSlope;\n'+shader.vertexShader.replace('#include <begin_vertex>',`
      #include <begin_vertex>
      rockPoint=(modelMatrix*vec4(position,1.)).xyz;
      rockSlope=mat3(modelMatrix)*normal;
    `);
    shader.fragmentShader=`
      uniform sampler2D cliffNormal,cliffARM;
      varying vec3 rockPoint,rockSlope;
      float hrock(vec2 p) {return fract(sin(dot(p,vec2(41.73,108.9)))*43758.54);}
      float field(vec2 p) {
        vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(hrock(i),hrock(i+vec2(1,0)),f.x),mix(hrock(i+vec2(0,1)),hrock(i+1.),f.x),f.y);
      }
    `+shader.fragmentShader.replace('#include <map_fragment>','').replace('#include <color_fragment>',`
      #include <color_fragment>
      vec3 P=rockPoint, face=normalize(rockSlope);
      vec3 w=pow(abs(face),vec3(5.));
      w/=dot(w,vec3(1.))+1e-5;
      float basin=field(P.xz*.18);
      float fold=field(P.xz*.32+7.2);
      vec2 uvX=vec2(P.z*.42+P.y*.052,P.y*.47)+vec2(basin*.42,fold*.31);
      vec2 uvY=P.xz*.48+vec2(basin*.34,.16);
      vec2 uvZ=vec2(P.x*.40-P.y*.085,P.y*.51)+vec2(fold*.35,basin*.26);
      vec3 sampleX=texture2D(map,uvX).rgb;
      vec3 sampleY=texture2D(map,uvY).rgb;
      vec3 sampleZ=texture2D(map,uvZ).rgb;
      vec3 stone=sampleX*w.x+sampleY*w.y+sampleZ*w.z;
      float streak=field(vec2((P.x+P.z*.86)*1.11,P.y*.19));
      float seep=smoothstep(.39,.80,basin*.38+streak*.62);
      vec3 arm=texture2D(cliffARM,uvX).rgb*w.x+texture2D(cliffARM,uvY).rgb*w.y+texture2D(cliffARM,uvZ).rgb*w.z;
      float soil=smoothstep(.45,.85,face.y)*smoothstep(.59,.82,field(P.xz*.87)*.53+basin*.47);
      float bedding=field(vec2((P.x+P.z)*.28,P.y*.71+basin*.24));
      float lamina=field(vec2((P.x+P.z*.78)*.72,P.y*2.21+P.z*.31+.31*basin));
      float faceOxide=smoothstep(.61,.86,lamina)*smoothstep(.36,.75,basin);
      stone=mix(stone*vec3(1.24,1.19,1.18),stone*.68,seep);
      stone*=.78+.50*smoothstep(.29,.74,bedding);
      stone*=mix(vec3(.97,1.02,1.03),vec3(1.38,1.06,.77),faceOxide*.56);
      stone=mix(stone,stone*vec3(.77,.86,.51),soil*.88);
      diffuseColor.rgb*=stone*(1.7-basin*.29)*mix(.55,1.,arm.r);
    `).replace('#include <roughnessmap_fragment>',`
      #include <roughnessmap_fragment>
      roughnessFactor=clamp(mix(arm.g+.16,.38,seep*.77),.35,.97);
    `).replace('#include <normal_fragment_maps>',`
      #include <normal_fragment_maps>
      vec2 ax=texture2D(cliffNormal,uvX).xy*2.-1.;
      vec2 ay=texture2D(cliffNormal,uvY).xy*2.-1.;
      vec2 az=texture2D(cliffNormal,uvZ).xy*2.-1.;
      vec3 bump=vec3(0,ax.y,ax.x)*w.x+vec3(ay.x,0,ay.y)*w.y+vec3(az.x,az.y,0)*w.z;
      normal=normalize(normal+mat3(viewMatrix)*(bump-face*dot(face,bump))*.70);
    `);
  };
  return material;
}

function treeline(b,seed,atlas) {
  const breeze={value:0};
  const pine=new T.MeshBasicMaterial({map:atlas,vertexColors:true,side:T.DoubleSide,
    alphaTest:.30,alphaToCoverage:true});
  pine.onBeforeCompile=shader=>{
    shader.uniforms.breeze=breeze;
    shader.vertexShader='uniform float breeze; attribute float crown;\n'+shader.vertexShader.replace('#include <begin_vertex>',`
      #include <begin_vertex>
      float bend=crown*crown*(sin(breeze*1.43+position.x*.36+position.z*.14)*.042+
        sin(breeze*2.38+position.x*.91-position.z*.31)*.023);
      transformed.x+=bend;
      transformed.z+=bend*.56;
    `);
  };
  const rand=random(seed+51), tint=new T.Color();
  const positions=[],colors=[],uvs=[],flex=[];
  const tree=(x,y,z,height,j)=>{
    const yaw=rand()*Math.PI, width=height*(.80+rand()*.39);
    const tone=1.07+rand()*.44;
    for(let view=0;view<2;view++) {
      const angle=yaw+view*Math.PI/2, dx=Math.cos(angle)*width*.5,dz=Math.sin(angle)*width*.5;
      const verts=[[x-dx,y,z-dz],[x+dx,y,z+dz],[x+dx,y+height,z+dz],[x-dx,y+height,z-dz]];
      const left=j/3+.0018,right=(j+1)/3-.0018,top=1-view*.5-.002,bottom=.5-view*.5+.002;
      const tex=[[left,bottom],[right,bottom],[right,top],[left,top]];
      for(const k of [0,1,2,0,2,3]) {
        positions.push(...verts[k]);uvs.push(...tex[k]);flex.push(k>=2?1:0);
        tint.setRGB(tone*(.84+k*.044),tone*(.87+k*.036),tone*(.91+k*.028)).toArray(colors,colors.length);
      }
    }
  };
  const stands=[[-20,-49,17,13,55],[-29,-66,12,18,55],[-10,-87,10,16,45],
    [19,-48,10,14,48],[23,-65,11,22,49],[12,-82,8,17,36],[-17,6,8,23,42],[26,4,14,18,35]];
  for(const [cx,cz,rx,rz,count] of stands)for(let n=0;n<count;n++) {
    const a=rand()*Math.PI*2,r=Math.sqrt(rand());
    const x=cx+Math.cos(a)*rx*r,z=cz+Math.sin(a)*rz*r;
    const y=terrain(x,z,seed/1000);
    if((Math.abs(x)<10&&z>-55)||y<-.5||y>29)continue;
    const dx=terrain(x+.52,z,seed/1000)-terrain(x-.52,z,seed/1000);
    if(Math.abs(dx)>1.86)continue;
    tree(x,y-.17,z,1.8+rand()**.83*5.6,Math.floor(rand()*3));
  }
  const crowns=new T.BufferGeometry();
  crowns.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  crowns.setAttribute('normal',new T.Float32BufferAttribute(new Float32Array(positions.length),3));
  crowns.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  crowns.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));
  crowns.setAttribute('crown',new T.Float32BufferAttribute(flex,1));
  b.add(crowns,pine,null,null,false);
  return breeze;
}

function rockOutcrops(scene,seed,cliff,stone) {
  function instances(source,placements) {
    const mesh=new T.InstancedMesh(source.geometry,source.material,placements.length);
    const pose=new T.Object3D();
    placements.forEach(([x,y,z,sx,sy,sz,rx,ry,rz],i)=>{
      pose.position.set(x,y,z);pose.scale.set(sx,sy,sz);pose.rotation.set(rx,ry,rz);
      pose.updateMatrix();mesh.setMatrixAt(i,pose.matrix);
    });
    mesh.computeBoundingSphere();scene.add(mesh);
  }
  // The surveyed rock face forms the bank, with roots embedded behind the visible strata.
  instances(cliff,[
    [11.9,-2.16,-42.35,.77,.84,1.02,.16,-1.55,-.18],
    [14.63,2.05,-51.2,.68,1.12,.99,-.104,-2.10,.242],
    [17.7,4.19,-61.83,1.12,1.28,1.12,-.07,-1.28,.079],
    [-14.1,-1.26,-49.3,1.17,.99,1.13,.055,1.66,-.055],
    [-20.4,3.23,-67.9,1.18,1.20,1.16,-.059,1.32,.16],
    [20.2,4.80,-76.0,1.43,1.30,1.24,-.045,-1.91,.12]
  ]);
  const rand=random(seed+415),rocks=[];
  for(let i=0;i<29;i++){
    const z=-32.5-rand()*55, x=(i%3===0?-1:1)*(9.58+rand()*17.5);
    const level=terrain(x,z,seed/1000);
    const span=.43+rand()**2*1.64, scale=span/.145;
    rocks.push([x,level-span*.17,z,scale*1.2,scale*(1.1+rand()*.69),scale,.18+rand()*.34,rand()*6.28,.10-rand()*.22]);
  }
  instances(stone,rocks);
}

function bankGrowth(b,seed) {
  const rng=random(seed+992);
  const palette=[0x36351e,0x454d2b,0x68723d,0x374327,0x756b42].map(hex=>new T.Color(hex));
  const leaf=new T.MeshStandardMaterial({vertexColors:true,roughness:.86,side:T.DoubleSide});
  const XYZ=[],RGB=[],UV=[];
  const tint=new T.Color();
  // Ground cover grows in groups on benches where the slope is shallow enough for soil.
  for(let cluster=0;cluster<205;cluster++) {
    const side=cluster%4===0?-1:1;
    const x=side*(9.45+rng()**1.6*24),z=-31.2-rng()*51;
    const y=terrain(x,z,seed/1000);
    const sx=(terrain(x+.38,z,seed/1000)-terrain(x-.38,z,seed/1000))/.76;
    const sz=(terrain(x,z+.38,seed/1000)-terrain(x,z-.38,seed/1000))/.76;
    if(y<-.65||Math.hypot(sx,sz)>1.48)continue;
    const height=.13+rng()**1.54*.54;
    for(let j=0;j<18;j++) {
      const theta=rng()*Math.PI*2;
      const spread=(rng()-.31)*height*.58;
      const ax=x+Math.sin(theta)*spread,az=z+Math.cos(theta)*spread;
      const ay=terrain(ax,az,seed/1000)-.05;
      const lift=height*(.38+rng()*.62), reach=lift*(.30+rng()*.99);
      const dx=Math.sin(theta),dz=Math.cos(theta);
      const skin=palette[Math.floor(rng()*palette.length)];
      const bow=lift*(rng()-.55)*.40;
      const ribbon=(t,side)=>{
        const sway=reach*t*t,width=lift*(.016+.032*Math.sin(t*Math.PI))*Math.sqrt(1-t);
        const twist=side*width;
        XYZ.push(ax+dx*sway-dz*twist,ay+lift*Math.sin(t*1.58)+bow*t*t+side*width*.51*t,az+dz*sway+dx*twist);
        UV.push(side*.5+.5,t);
        tint.copy(skin).multiplyScalar(.43+t*.53+side*.047).toArray(RGB,RGB.length);
      };
      for(let k=0;k<4;k++) {
        const a=k*.25,c=(k+1)*.25;
        ribbon(a,-1);ribbon(a,1);ribbon(c,-1);
        ribbon(a,1);ribbon(c,1);ribbon(c,-1);
      }
    }
  }
  const shrubs=new T.BufferGeometry();
  shrubs.setAttribute('position',new T.Float32BufferAttribute(XYZ,3));
  shrubs.setAttribute('color',new T.Float32BufferAttribute(RGB,3));
  shrubs.setAttribute('uv',new T.Float32BufferAttribute(UV,2));
  shrubs.computeVertexNormals();
  b.add(shrubs,leaf,null,null,false);
}

function serviceBridge(b,m) {
  const z=-48.2,y=2.19;
  b.box(m.edge,0,y,z,13.60,.19,1.16,.041);
  for(const d of [-.54,.54]) {
    const zz=z+d;
    b.box(m.iron,0,y-.19,zz,13.8,.31,.13,.011);
    b.pipe(m.iron,[-6.73,y+.92,zz],[6.73,y+.92,zz],.027,8,.027,false);
    b.pipe(m.iron,[-6.71,y+.47,zz],[6.71,y+.47,zz],.015,8,.015,false);
    for(let x=-6.53;x<6.71;x+=.81) b.pipe(m.iron,[x,y+.08,zz],[x,y+.92,zz],.022,8,.022,false);
  }
  for(const x of [-6.76,6.76]) {
    b.box(m.wall,x,.42,z,1.25,3.61,1.95,.078);
    b.pipe(m.black,[x,y,z+.21],[x,y+2.9,z+.21],.032,12,.032,false);
    b.pipe(m.iron,[x,y+2.9,z+.21],[x-Math.sign(x)*.39,y+2.9,z+.21],.022,8,.022,false);
    b.box(m.amber,x-Math.sign(x)*.39,y+2.86,z+.21,.11,.040,.072,.008,undefined,false);
  }
  // The downstream gauging bridge stands higher than the headrace railings.
  // Web members finish at gussets so the underside reads from the inspection deck.
  const depth=[-.58,.58],nodes=[-6.74,-4.76,-2.40,0,2.40,4.76,6.74];
  const top=[y+.14,y+2.12,y+2.39,y+2.46,y+2.39,y+2.12,y+.14];
  for(let i=0;i<nodes.length;i++) {
    const x=nodes[i], lower=y-.273;
    b.box(m.iron,x,lower,z,.111,.19,1.36,.016);
    if(i===0)continue;
    b.pipe(m.rust,[nodes[i-1],lower,z-.59],[x,lower,z+.59],.033,8);
    b.pipe(m.iron,[nodes[i-1],lower-.03,z+.59],[x,lower-.03,z-.59],.033,8);
  }
  for(const dz of depth) {
    const zz=z+dz;
    b.box(m.black,0,y-.075,zz,13.75,.28,.185,.022);
    b.box(m.rust,0,y+.107,zz,13.67,.102,.253,.010);
    for(let i=1;i<nodes.length;i++) {
      const a=nodes[i-1],x=nodes[i];
      b.pipe(m.rust,[a,top[i-1],zz],[x,top[i],zz],.104,8);
      if(i<nodes.length-1)b.pipe(m.iron,[x,y+.035,zz],[x,top[i],zz],.060,8);
      if(i>1&&i<nodes.length-1) {
        const inner=Math.abs(x)<Math.abs(a);
        b.pipe(m.iron,[a,inner?y+.07:top[i-1],zz],[x,inner?top[i]:y+.07,zz],.052,8);
      }
      for(const yy of [y+.075,top[i]]) {
        b.box(m.rust,x,yy,zz,.29,.22,.047,.011);
        for(const dx of [-.068,.061])
          b.pipe(m.iron,[x+dx,yy,zz+.024],[x+dx,yy,zz+.045],.021,7,.021,false);
      }
    }
  }
  for(let i=1;i<nodes.length-1;i++) {
    b.pipe(m.iron,[nodes[i],top[i],z-.60],[nodes[i],top[i],z+.60],.063,8);
    if(i<nodes.length-2)
      b.pipe(m.black,[nodes[i],top[i],z-.61],[nodes[i+1],top[i+1],z+.61],.040,8);
  }
  for(const s of [-1,1]) {
    const x=s*6.62;
    b.box(m.cast,x,-.81,z,1.89,3.36,2.05,.095);
    b.box(m.edge,x,.42,z,2.05,.39,2.31,.055);
    b.box(m.iron,x,1.91,z,1.57,.22,1.39,.021);
    b.pipe(m.gunMetal,[x,y+.18,z+.61],[x,y+.80,z+.61],.041,10);
    b.box(m.amber,x,y+.73,z+.67,.10,.098,.077,.011);
  }
}

async function mountainScene(scene, seed, materials, nextPaint) {
  // Bias the mesh toward both visible banks and keep a coarser skirt on the horizon.
  const columns=366,rows=390;
  const land=new T.PlaneGeometry(166,140,columns,rows);
  const pos = land.attributes.position;
  const rgb = new Float32Array(pos.count * 3);
  const color = new T.Color();
  const colorA = new T.Color(0x979088), colorB = new T.Color(0xc9c7bd), colorC = new T.Color(0xa3a4ad);
  for (let i = 0; i < pos.count; i++) {
    const u=2*(i%(columns+1))/columns-1;
    const x=Math.sign(u)*(Math.abs(u)*43+Math.abs(u)**2.17*48)-4;
    const v=Math.floor(i/(columns+1))/rows;
    const z=-150+v*187+Math.sin(Math.PI*v)*10;
    const y=terrain(x,z,seed/1000);
    pos.setXYZ(i,x,y,z);
    const band=.5+.5*Math.sin(y*2.23+x*.29+Math.cos(z*.28)*.8);
    const n=.5+.5*Math.sin(x*.35+Math.cos(z*.21)*1.2)*Math.cos(z*.22);
    color.copy(colorA).lerp(colorB,band*.15+n*.38).lerp(colorC,Math.max(0,Math.min(.56,y*.041)));
    color.toArray(rgb,i*3);
    if(i>0&&i%16000===0)await nextPaint();
  }
  land.setAttribute('color', new T.BufferAttribute(rgb, 3));
  land.computeVertexNormals();
  await nextPaint();
  const mesh = new T.Mesh(land, cliffMaterial(materials.rock));
  scene.add(mesh);

  const b=batches(scene);
  rockOutcrops(scene,seed,materials.cliffScan,materials.stoneScan);
  const cement = materials.cast;
  const steel = materials.iron;
  for (const x of [-4.7,4.7]) {
    const east=x>0;
    const crown=east?-.27:2.20;
    const angle=[0,east?.058:-.058,0];
    b.box(cement,x,(crown-2.72)*.5,-33.7,1.28,crown+2.72,13.1,.09,angle);
    b.box(cement,x*1.14,east?-.64:-.17,-45.87,1.59,east?1.33:2.1,13,.081,[0,east?.061:-.061,0]);
    b.box(materials.edge,x,crown,-33.62,1.38,.15,12.92,.028,angle);
    for(let zz=-29;zz>-51;zz-=2.78) {
      const h=east?1.32:2.71;
      const inboard=x-Math.sign(x)*(.62-(zz+29)*.019);
      b.box(materials.edge,inboard,crown-h*.5-.16-Math.max(0,-zz-40)*.083,zz,.09,h,.14,.017);
      b.pipe(materials.black,[inboard,crown-.31,zz-.22],
        [inboard-Math.sign(x)*.08,crown-.326,zz-.22],.037,12);
      b.pipe(steel,[inboard,crown-.31,zz-.22],
        [inboard-Math.sign(x)*.032,crown-.319,zz-.22],.049,12);
    }
    if(!east) {
      b.pipe(steel,[x,3.02,-27.8],[x*1.07,3.02,-40.02],.034,9);
      for(let z=-28;z>-40;z-=1.25) {
        const xx=x*(1+(z+28)*-.0055);
        b.pipe(steel,[xx,2.10,z],[xx,3.04,z],.036,8);
      }
    }
  }
  b.box(cement,0,-.37,-27.71,9.2,.56,.81,.05);
  for (const z of [-43.1,-51.2]) b.box(cement,0,-1.5,z,10.5,.96,1.13,.053);
  serviceBridge(b,materials);
  await nextPaint();
  const breeze=treeline(b,seed,materials.trees);
  nearFirs(b,seed,(x,z)=>terrain(x,z,seed/1000),breeze);
  bankGrowth(b,seed);
  await b.finishAsync(nextPaint);

  const water=makeMillrace(scene,materials);
  return {water,breeze};
}

function shower(scene, seed) {
  const rnd = random(seed);
  const count = 1540;
  const g = new T.BufferGeometry();
  const pos = new Float32Array(count * 6);
  const attr = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) {
    const strip=i<485?i%4:i<910?4:5;
    const z = strip === 5 ? 13.64 + rnd() * 15 : strip === 4 ? -27.65 - rnd() * 13 : 7.45 - strip * 8.1 + (rnd() - .5) * 2.05;
    const x = strip === 5 ? -8.72 + rnd() * 16 : strip === 4 ? (rnd() - .45) * 17 : -6.12 + rnd() * 5.9;
    const y = rnd() * 9;
    pos.set([x,y,z,x,y,z], i * 6);
    const r = rnd();
    attr.set([r,0,strip,r,1,strip],i * 6);
  }
  g.setAttribute('position',new T.BufferAttribute(pos,3));
  g.setAttribute('drop',new T.BufferAttribute(attr,3));
  const m = new T.ShaderMaterial({
    transparent:true, depthWrite:false, blending:T.AdditiveBlending, uniforms:{time:{value:0}},
    vertexShader:`
      uniform float time;
      attribute vec3 drop;
      varying float a;
      void main() {
        float fall = mod(position.y - time * (6.7 + drop.x * 4.),8.8);
        vec3 q = vec3(position.x + fall * .034,fall,position.z + .017 * fall) -
          vec3(drop.y * .011,drop.y * (.10 + drop.x * .18),0.);
        float roof=step(13.63,q.z)*step(q.z,19.58)*step(-4.14,q.x)*step(q.x,3.10);
        if(drop.z>4.5&&roof>.5&&q.y<4.72) q.y-=10.;
        float practical=exp(-abs(q.z-14.02)*.29-abs(q.x+.37)*.57);
        a=smoothstep(.06,.95,fall)*(1.-smoothstep(7.4,8.9,fall))*(.025+drop.x*.078)
          *(drop.z>3.5?1.17+practical*.94:1.);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(q,1.);
      }`,
    fragmentShader:`
      varying float a;
      void main() {
        gl_FragColor = vec4(vec3(.53,.72,.80),a);
      }`
  });
  const rain = new T.LineSegments(g,m);
  rain.frustumCulled = false;
  rain.renderOrder = 2;
  scene.add(rain);
  return rain;
}

function spray(scene,seed) {
  const rand=random(seed), count=2280;
  const geometry=new T.BufferGeometry();
  const seedValues=new Float32Array(count*3);
  for(let i=0;i<seedValues.length;i++) seedValues[i]=rand();
  geometry.setAttribute('position',new T.BufferAttribute(seedValues,3));
  const material=new T.ShaderMaterial({
    transparent:true,depthWrite:false,blending:T.AdditiveBlending,
    uniforms:{time:{value:0},flow:{value:0},surge:{value:0}},
    vertexShader:`
      uniform float time, flow, surge;
      varying float alpha;
      varying vec2 sprayAxis;
      varying float stretch;
      void main() {
        float age=fract(position.z+time*(.61+position.y*.84));
        float head=smoothstep(.08,.64,flow);
        float wall=step(.77,position.y), side=sign(position.x-.5);
        float pulse=.75+.25*sin(position.z*26.+position.x*16.+time*8.);
        float spread=mix(sin(position.z*29.1)*.77,-side*.88,wall);
        float start=mix((position.x-.5)*7.57,side*3.97,wall);
        float rush=mix(2.91+position.y*6.5+surge*3.6,1.42+position.z*2.8,wall);
        float height=(.16+position.y*.48+surge*(.36+position.y*1.63))*head*pulse;
        float x=start+spread*age;
        float z=mix(-28.05,-30.35-position.x*9.1,wall)-rush*age;
        float y=-.52+4.*age*(1.-age)*height;
        vec4 mv=modelViewMatrix*vec4(x,y,z,1.);
        gl_Position=projectionMatrix*mv;
        sprayAxis=normalize((mat3(modelViewMatrix)*vec3(spread,4.*height*(1.-2.*age),-rush)).xy+vec2(.001));
        stretch=.32+position.z*.34+surge*.20;
        gl_PointSize=clamp((8.+position.y*23.+16.*surge)/max(1.,-mv.z*.63),1.,12.5);
        alpha=head*smoothstep(0.,.11,age)*(1.-smoothstep(.36,1.,age))*(.23+surge*.29)*pulse;
      }`,
    fragmentShader:`
      varying float alpha;
      varying vec2 sprayAxis;
      varying float stretch;
      void main() {
        vec2 p=gl_PointCoord-.5;
        vec2 q=vec2(dot(p,sprayAxis),dot(p,vec2(-sprayAxis.y,sprayAxis.x)));
        float streak=exp(-dot(q*vec2(2.9,2.9+stretch*11.),q*vec2(2.9,2.9+stretch*11.))*2.4);
        float body=1.-smoothstep(.09,.46,length(p));
        gl_FragColor=vec4(vec3(.51,.71,.76)+streak*.28,alpha*(.30*body+.85*streak));
      }`
  });
  const particles=new T.Points(geometry,material);
  particles.frustumCulled=false;
  particles.renderOrder=4;
  scene.add(particles);
  return particles;
}

export async function makeExterior(scene, seed, materials, nextPaint) {
  const {water,breeze}=await mountainScene(scene,seed,materials,nextPaint);
  const rain = shower(scene, seed);
  const mist = spray(scene, seed+40);
  return {
    update(t, release) {
      water(t,release);
      breeze.value=t;
      rain.material.uniforms.time.value = t;
      mist.material.uniforms.time.value = t;
      mist.material.uniforms.flow.value = release.discharge;
      mist.material.uniforms.surge.value = release.surge;
      mist.visible = release.discharge>.02;
    }
  };
}

