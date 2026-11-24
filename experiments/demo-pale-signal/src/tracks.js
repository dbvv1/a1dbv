import * as T from 'three';
import { canvasTexture, noise, randomGen } from './visual.js';

const { clamp, smoothstep, lerp }=T.MathUtils;

export function sampleHeight(geometry,x0,x1,z0,z1) {
  const {widthSegments:columns,heightSegments:rows}=geometry.parameters;
  const position=geometry.attributes.position;
  return (x,z)=>{
    const px=clamp((x-x0)/(x1-x0)*columns,0,columns),pz=clamp((z-z0)/(z1-z0)*rows,0,rows);
    const ix=Math.min(Math.floor(px),columns-1),iz=Math.min(Math.floor(pz),rows-1);
    const u=px-ix,v=pz-iz,top=iz*(columns+1)+ix,bottom=top+columns+1;
    const a=position.getY(top),b=position.getY(top+1),c=position.getY(bottom),d=position.getY(bottom+1);
    // Match the diagonal of the terrain triangles so the stamp follows the visible floor.
    return u+v<=1?a+(b-a)*u+(c-a)*v:d+(c-d)*(1-u)+(b-d)*(1-v);
  };
}

function treadMap(){
  return canvasTexture(128,224,(c,w,h)=>{
    const rand=randomGen(9462);
    const sole=new Path2D('M 31 193 C 18 184 21 153 25 136 L 26 115 C 26 100 14 93 13 73 C 12 48 22 19 38 12 C 56 4 83 8 96 14 C 109 24 111 49 106 70 C 102 90 86 108 86 133 L 87 173 C 86 193 78 200 57 201 Z');
    c.save();
    c.filter='blur(2px)';
    c.lineWidth=7;c.strokeStyle='#e5f1f9c0';c.stroke(sole);
    c.translate(1,2);c.fillStyle='#536d83b1';c.fill(sole);
    c.restore();
    c.save();c.clip(sole);
    const packed=c.createLinearGradient(19,8,100,200);
    packed.addColorStop(0,'#6e8598a6');packed.addColorStop(.58,'#8f9dab56');packed.addColorStop(1,'#496078a0');
    c.fillStyle=packed;c.fillRect(0,0,w,h);
    for(let i=0;i<12;i++){
      const heel=i>7,y=20+i*14+(heel?8:0);
      const left=heel?28:18,right=heel?57:70,width=heel?26:38;
      const notch=(i%2)*5;
      for(const [x,s] of [[left,1],[right,-1]]){
        const groove=new Path2D();
        groove.moveTo(x+notch,y);groove.lineTo(x+width,y+s*5);
        groove.lineTo(x+width-3,y+7+s*5);groove.lineTo(x+notch,y+7);groove.closePath();
        c.fillStyle='#425c73be';c.fill(groove);
        c.translate(0,2);c.lineWidth=2;c.strokeStyle='#c2d4e084';c.stroke(groove);c.translate(0,-2);
      }
    }
    for(let i=0;i<530;i++){
      c.fillStyle=rand()<.55?'#d8e5ef69':'#526d8549';
      c.fillRect(rand()*w,rand()*h,1+rand()*3,1+rand()*2);
    }
    c.restore();
    for(let i=0;i<130;i++){
      const a=rand()*Math.PI*2,d=.80+rand()*.22;
      c.fillStyle=rand()<.49?'#d9e7f160':'#9bb1c343';
      c.fillRect(60+Math.cos(a)*51*d,103+Math.sin(a)*99*d,1+rand()*3,1+rand()*2);
    }
  });
}

export function makeTracks(scene,surfaceHeight){
  const columns=4,rows=8,perPrint=(columns+1)*(rows+1),limit=112;
  const positions=new Float32Array(limit*perPrint*3),uv=new Float32Array(limit*perPrint*2);
  const times=new Float32Array(limit*perPrint),coverage=new Float32Array(limit*perPrint),index=[];
  const clock={value:0};
  for(let n=0;n<limit;n++)for(let j=0;j<=rows;j++)for(let i=0;i<=columns;i++){
    const vertex=n*perPrint+j*(columns+1)+i;
    uv[vertex*2]=i/columns;uv[vertex*2+1]=j/rows;
    if(i<columns&&j<rows)index.push(vertex,vertex+1,vertex+columns+1,vertex+1,vertex+columns+2,vertex+columns+1);
  }
  const geometry=new T.BufferGeometry();
  geometry.setAttribute('position',new T.BufferAttribute(positions,3).setUsage(T.DynamicDrawUsage));
  geometry.setAttribute('uv',new T.BufferAttribute(uv,2));
  geometry.setAttribute('pressedAt',new T.BufferAttribute(times,1).setUsage(T.DynamicDrawUsage));
  geometry.setAttribute('snowCover',new T.BufferAttribute(coverage,1).setUsage(T.DynamicDrawUsage));
  geometry.setIndex(index);
  const material=new T.MeshBasicMaterial({map:treadMap(),transparent:true,depthWrite:false,
    polygonOffset:true,polygonOffsetFactor:-1,side:T.DoubleSide});
  material.onBeforeCompile=shader=>{
    shader.uniforms.trackClock=clock;
    shader.vertexShader=`attribute float pressedAt,snowCover;
      varying float trackAge,cover;
      uniform float trackClock;
    `+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntrackAge=trackClock-pressedAt;cover=snowCover;');
    shader.fragmentShader=`varying float trackAge,cover;
    `+shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\ndiffuseColor.a*=cover*(1.-smoothstep(8.,35.,trackAge));');
  };
  const mesh=new T.Mesh(geometry,material);
  mesh.name='Compacted snow tracks';mesh.frustumCulled=false;mesh.renderOrder=2;scene.add(mesh);
  const maxIndices=columns*rows*6;
  let count=0;
  geometry.setDrawRange(0,0);
  return {
    reset(){count=0;clock.value=0;geometry.setDrawRange(0,0);},
    update(dt){clock.value+=dt;},
    stamp(x,z,yaw,foot){
      const offset=count%limit*perPrint;
      const co=Math.cos(yaw),si=Math.sin(yaw);
      x-=si*.075;z-=co*.075;
      const access=z>-11.42&&z<32.6;
      for(let j=0;j<=rows;j++)for(let i=0;i<=columns;i++){
        const u=i/columns,v=j/rows,n=offset+j*(columns+1)+i;
        const across=(foot>0?u-.5:.5-u)*.265,forward=(v-.5)*.425;
        const px=x+co*across-si*forward,pz=z-si*across-co*forward;
        positions[n*3]=px;positions[n*3+1]=surfaceHeight(px,pz)+.005;positions[n*3+2]=pz;
        const powder=noise(px*4.38,pz*2.19);
        const lane=1-smoothstep(1.81,2.85,Math.abs(px)+(powder-.5)*.67);
        const packed=lane*(1-smoothstep(3.1,4.1,Math.abs(px)));
        const randomEdge=smoothstep(.25,.73,powder+noise(px*25.6,pz*26.1)*.28);
        coverage[n]=access?lerp(.53+powder*.37,(.037+powder*.081)*randomEdge,packed):.53+powder*.39;
        times[n]=clock.value;
      }
      for(const name of ['position','pressedAt','snowCover']) geometry.attributes[name].needsUpdate=true;
      count++;
      geometry.setDrawRange(0,Math.min(count,limit)*maxIndices);
    },
  };
}
