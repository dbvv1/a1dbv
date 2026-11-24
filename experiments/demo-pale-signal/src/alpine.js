import * as T from 'three';
import { noise, surface } from './visual.js';

const { smoothstep, lerp, clamp } = T.MathUtils;

function landform(x,z,base){
  const north=-z;
  const channel=4.8+(north-142)*.16+5.1*Math.sin((north-99)*.022);
  const across=x-channel;
  const east=smoothstep(across,-7,18);
  const along=north+(x-10)*.23;
  const broad=noise(x*.039+9.4,z*.031);
  const broken=noise(x*.17+z*.097,z*.158+x*.041);
  const grain=noise(x*.59-z*.14,z*.54);
  // The east wall has one broken promontory. The opposite shoulder broadens uphill.
  const flank=smoothstep(north,91,117)*(1-smoothstep(north,285,376));
  const ramp=34+11*Math.sin((along-148)*.019)+Math.max(0,along-194)*.18;
  const foot=lerp(17.8,17.6+(broad-.5)*7,east);
  const fault=lerp(21,18+(along-162)*.069,east)+(broad-.5)*8;
  const body=smoothstep(Math.abs(across),foot-10,foot+5)*lerp(6.5,7,east)+
    smoothstep(Math.abs(across),fault, fault+lerp(26,16,east))*lerp(22,36,east);
  const brow=(1-smoothstep(Math.abs(across),ramp+8,ramp+65));
  const structure=smoothstep(Math.abs(across),17,35)*(1-smoothstep(Math.abs(across),51,78));
  const twoCuts=Math.exp(-(((along-146+across*.22)/9.2)**2))*7.1+
    Math.exp(-(((along-199-across*.20)/14.5)**2))*5.3;
  const tilted=(along*.179+across*.246+base*.125+(broad-.5)*1.45);
  const strata=(1-smoothstep(Math.abs(Math.sin(tilted)),.05,.64))-.37;
  const fissure=1-smoothstep(Math.abs(noise(along*.064-across*.069,across*.073+broad*.61)-.49),.018,.148);
  const shelf=structure*(strata*.91+(broken-.52)*2.91+(grain-.5)*.61-fissure*1.09);
  const embankment=flank*(body*brow+structure*(shelf-twoCuts*lerp(.46,1,east)));
  const river=(1-smoothstep(Math.abs(across),7,27))*smoothstep(north,94,155)*(1-smoothstep(north,280,378));
  const distance=x-(136+Math.sin((z+148)*.022)*12+z*.12);
  const rib=smoothstep(distance,-17,29)*(1-smoothstep(distance,55,152));
  const ridge=rib*Math.exp(-(((z+175)/140)**2))*(1-smoothstep(z,-79,-25));
  const secondBank=ridge*(16+(broad-.47)*10+(broken-.49)*4);
  const south=smoothstep(z,47,145)*(1-smoothstep(z,370,690));
  const ledge=south*Math.exp(-(((x+69+(z-130)*.22)/80)**2))*(14+(broad-.42)*9+(broken-.48)*2);
  const farFold=(x-134)+(north-825)*.19;
  const highShoulder=Math.exp(-((farFold/199)**2)-(((north-845)/255)**2));
  const westernSide=Math.exp(-(((x+230+(north-660)*.22)/181)**2)-(((north-760)/280)**2));
  const existingRock=smoothstep(base,35,169);
  const highCountry=existingRock*(highShoulder*39+westernSide*22);
  return base+embankment+secondBank+ledge+highCountry-river*(7.8+broad*3.6);
}

export async function loadRanges() {
  const [response,ortho]=await Promise.all([
    fetch(new URL('../assets/alpine.r16',import.meta.url)),
    new T.TextureLoader().loadAsync(new URL('../assets/alpine-ortho.jpg',import.meta.url).href),
  ]);
  if(!response.ok)throw new Error('Alpine terrain unavailable');
  ortho.flipY=false;
  ortho.colorSpace=T.SRGBColorSpace;
  ortho.anisotropy=8;
  return {data:await response.arrayBuffer(),ortho};
}

// Subdivide the authored ravine before adding cuts to the geographic heightfield.
function terrainAxis(source,min,max){
  const position=[],cell=[],weight=[];
  for(let i=0;i<source.length-1;i++){
    const divisions=source[i+1]>min&&source[i]<max?Math.max(1,Math.ceil((source[i+1]-source[i])*1.12)):1;
    for(let j=0;j<divisions;j++){
      const f=j/divisions;
      position.push(lerp(source[i],source[i+1],f));
      cell.push(i);
      weight.push(f);
    }
  }
  position.push(source.at(-1));cell.push(source.length-2);weight.push(1);
  return {position,cell,weight};
}

export function alpineRanges({data,ortho}, stone) {
  const n=new Uint32Array(data,0,1)[0];
  const sourceX=new Float32Array(data,4,n),sourceZ=new Float32Array(data,4+n*4,n);
  const xAxis=terrainAxis(sourceX,-95,124);
  const zAxis=terrainAxis(sourceZ,-276,-83);
  const xs=xAxis.position,zs=zAxis.position,nx=xs.length,nz=zs.length;
  const heights=new Int16Array(data,4+8*n);
  const geometry=new T.PlaneGeometry(1,1,nx-1,nz-1);
  const vertices=geometry.attributes.position;
  const shade=new Float32Array(nx*nz*3);
  const relief=new Float32Array(nx*nz);
  const horizons=[2.8,5.6,10.8,21.4,39.2,71.3,132,258,480];
  function cell(axis,value){
    let lo=0,hi=axis.length-1;
    while(hi-lo>1){
      const mid=(lo+hi)>>1;
      if(axis[mid]>value)hi=mid;
      else lo=mid;
    }
    return lo;
  }
  function slopeLimited(p0,p1,p2,p3,step0,step1,step2,u){
    const chord=(p2-p1)/step1;
    if(chord===0)return p1;
    const first=(p1-p0)/step0,last=(p3-p2)/step2;
    const inT=first*chord<=0?0:2*first*chord/(first+chord);
    const outT=last*chord<=0?0:2*last*chord/(last+chord);
    const uu=u*u, curve=uu*(3-2*u);
    return lerp(p1,p2,curve)+step1*uu*(u-1)*outT+step1*u*(1-u)*(1-u)*inT;
  }
  function alongX(row,col,u){
    const first=row*n,lo=Math.max(0,col-1),hi=Math.min(n-1,col+2);
    const before=sourceX[col]-sourceX[lo], width=sourceX[col+1]-sourceX[col], after=sourceX[hi]-sourceX[col+1];
    return slopeLimited(heights[first+lo],heights[first+col],heights[first+col+1],heights[first+hi],before||width,width,after||width,u);
  }
  for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){
    const i=xAxis.cell[x],j=zAxis.cell[z],u=xAxis.weight[x],v=zAxis.weight[z];
    const lo=Math.max(0,j-1),hi=Math.min(n-1,j+2);
    const before=sourceZ[j]-sourceZ[lo],depth=sourceZ[j+1]-sourceZ[j],after=sourceZ[hi]-sourceZ[j+1];
    const y0=alongX(j,i,u),y1=alongX(j+1,i,u);
    const y=v===0?y0:v===1?y1:slopeLimited(alongX(lo,i,u),y0,y1,alongX(hi,i,u),before||depth,depth,after||depth,v);
    const original=y/32;
    const xw=xs[x],zw=zs[z];
    relief[z*nx+x]=landform(xw,zw,original);
  }
  function height(x,z){return relief[z*nx+x];}
  function elevation(x,z){
    const i=cell(xs,x),j=cell(zs,z);
    const u=clamp((x-xs[i])/(xs[i+1]-xs[i]),0,1);
    const v=clamp((z-zs[j])/(zs[j+1]-zs[j]),0,1);
    const a=height(i,j),b=height(i+1,j),c=height(i,j+1),d=height(i+1,j+1);
    return u+v<=1?a+(b-a)*u+(c-a)*v:d+(c-d)*(1-u)+(b-d)*(1-v);
  }
  for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){
    const i=z*nx+x,y=height(x,z),px=xs[x],pz=zs[z];
    vertices.setXYZ(i,px,y,pz);
    let sunHorizon=0;
    for(const d of horizons)sunHorizon=Math.max(sunHorizon,(elevation(px-d*.424,pz-d*.906)-y)/d);
    const broad=(elevation(px-9,pz)+elevation(px+9,pz)+elevation(px,pz-9)+elevation(px,pz+9))*.25-y;
    const fine=(elevation(px-2,pz)+elevation(px+2,pz)+elevation(px,pz-2)+elevation(px,pz+2))*.25-y;
    shade[i*3]=smoothstep(sunHorizon,.14,.35);
    shade[i*3+1]=clamp(.50+broad*.192+fine*.28,0,1);
    shade[i*3+2]=clamp(.50+fine*.97,0,1);
  }
  geometry.setAttribute('rangeShade',new T.BufferAttribute(shade,3));
  geometry.computeVertexNormals();
  const material=surface(0xffffff,'alpine',{metalness:0,roughness:.89},{...stone,ortho});
  const mountain=new T.Mesh(geometry,material);
  mountain.name='Southern Alps relief';
  return {mountain,elevation};
}
