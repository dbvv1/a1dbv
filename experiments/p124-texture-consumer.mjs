// Isolated replay only: see p124-texture-consumer.md. No renderer or GPU is created.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {PNG} from 'pngjs';
import {read as readKTX} from 'ktx-parse';
import * as THREE from 'three';

const [sourceDir,ktxPath]=process.argv.slice(2);
assert(sourceDir && ktxPath && existsSync(sourceDir) && existsSync(ktxPath),
  'Usage: node p124-texture-consumer.mjs SOURCE_DIRECTORY KTX_EXECUTABLE');
const hash=b=>createHash('sha256').update(b).digest('hex');
const round=x=>Math.round(x*1e6)/1e6;
const slots={
  diffuse:{hash:'903f042853052b3b4dcbf9a511d688b77983f5af641a3effbb2e130d159daed0',tf:'srgb'},
  nor_gl:{hash:'0b51c30896a1706d8a5bb24448bcff791ec2e51458a90fef9498e61f74de9efe',tf:'linear'},
  arm:{hash:'aa8a7f54060ea5d564c35b13956b6689e0b4e693a9bfd8f719dcf61db65e6795',tf:'linear'}
};
const commands=[];
function run(args,allowFailure=false){
  const p=spawnSync(resolve(ktxPath),args,{encoding:'utf8',timeout:120000});
  commands.push({args,status:p.status,stderr:p.stderr.trim()});
  if(!allowFailure) assert.equal(p.status,0,p.stderr||p.error?.message);
  return p;
}
assert.match(run(['--version']).stdout,/4\.4\.2/);
const require=createRequire(import.meta.url);
const basisDir=join(require.resolve('three').split('/build/')[0],'examples/jsm/libs/basis');
writeFileSync('basis_transcoder.cjs',readFileSync(join(basisDir,'basis_transcoder.js')));
const BASIS=await require(resolve('basis_transcoder.cjs'))({wasmBinary:readFileSync(join(basisDir,'basis_transcoder.wasm'))});
BASIS.initializeBasis();
const linear=c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4;
const srgb=c=>c<=0.0031308?12.92*c:1.055*c**(1/2.4)-0.055;
const byte=x=>Math.max(0,Math.min(255,Math.round(x*255)));
function downsample(p,slot){
  assert.equal(p.width,p.height); assert(p.width>=2 && p.width%2===0);
  const width=p.width/2,data=Buffer.alloc(width*width*4);
  for(let y=0;y<width;y++) for(let x=0;x<width;x++){
    let v=[0,0,0];
    for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)for(let c=0;c<3;c++){
      const s=p.data[((2*y+dy)*p.width+2*x+dx)*4+c]/255;
      v[c]+=(slot==='diffuse'?linear(s):slot==='nor_gl'?2*s-1:s)/4;
    }
    if(slot==='nor_gl'){
      const len=Math.hypot(...v); assert(len>1e-8,'Degenerate averaged normal');
      v=v.map(c=>(c/len+1)/2);
    }else if(slot==='diffuse')v=v.map(srgb);
    const i=(y*width+x)*4;
    for(let c=0;c<3;c++)data[i+c]=byte(v[c]);data[i+3]=255;
  }
  return {width,height:width,data};
}
function writePNG(file,p){writeFileSync(file,PNG.sync.write(p,{colorType:2,inputColorType:6}));}
const inputs={},mips={};
for(const [slot,meta]of Object.entries(slots)){
  const source=readFileSync(join(sourceDir,`brick_wall_001_${slot}_1k.png`));
  assert.equal(hash(source),meta.hash,`Wrong source: ${slot}`);
  const p=PNG.sync.read(source); assert.equal(p.width,1024);assert.equal(p.height,1024);
  // pngjs exposes stored sample values; do not call PNG.adjustGamma().
  inputs[slot]={sourceBytes:source.length,sha256:hash(source),pngGamma:p.gamma};
  mips[slot]=[downsample(p,slot)];
  while(mips[slot].at(-1).width>1)mips[slot].push(downsample(mips[slot].at(-1),slot));
  mips[slot].forEach((m,i)=>writePNG(`${slot}-mip-${i}.png`,m));
  inputs[slot].baselineBytes=readFileSync(`${slot}-mip-0.png`).length;
  inputs[slot].baselineSHA256=hash(readFileSync(`${slot}-mip-0.png`));
}
function decode(bytes,target=13){
  const f=new BASIS.KTX2File(new Uint8Array(bytes));
  try{
    assert(f.isValid(),'Invalid KTX2 in real WASM decoder');
    assert(f.startTranscoding(),'WASM startTranscoding failed');
    const levels=[];
    for(let i=0;i<f.getLevels();i++){
      const data=new Uint8Array(f.getImageTranscodedSizeInBytes(i,0,0,target));
      assert(f.transcodeImage(data,i,0,0,target,0,-1,-1),'WASM transcodeImage failed');
      levels.push({data,width:Math.max(1,f.getWidth()>>i),height:Math.max(1,f.getHeight()>>i)});
    }
    return levels;
  }finally{f.close();f.delete();}
}
function diagnostics(a,b,slot){
  assert.equal(a.length,b.length);let squared=[0,0,0],mae=[0,0,0],maximum=[0,0,0],angles=[];
  for(let i=0;i<a.length;i+=4){
    for(let c=0;c<3;c++){
      const v=slot==='diffuse'?linear(a[i+c]/255)-linear(b[i+c]/255):(a[i+c]-b[i+c])/255;
      squared[c]+=v*v;mae[c]+=Math.abs(v);maximum[c]=Math.max(maximum[c],Math.abs(v));
    }
    if(slot==='nor_gl'){
      const x=[0,1,2].map(c=>a[i+c]/127.5-1),y=[0,1,2].map(c=>b[i+c]/127.5-1);
      const cosine=x.reduce((s,v,c)=>s+v*y[c],0)/(Math.hypot(...x)*Math.hypot(...y));
      angles.push(Math.acos(Math.max(-1,Math.min(1,cosine)))*180/Math.PI);
    }
  }
  const n=a.length/4;
  const result={domain:slot==='diffuse'?'linear-light RGB':'linear data RGB',rmse:squared.map(s=>round(Math.sqrt(s/n))),mae:mae.map(s=>round(s/n)),maxAbs:maximum.map(round)};
  if(angles.length){angles.sort((a,b)=>a-b);result.normalDegrees={mean:round(angles.reduce((a,b)=>a+b,0)/n),p95:round(angles[Math.ceil(n*.95)-1]),max:round(angles.at(-1))};}
  return result;
}
const results={},textures={};
for(const slot of Object.keys(slots))for(const codec of slot==='diffuse'?['basis-lz']:['basis-lz','uastc']){
  const name=`${slot}-${codec}`,file=`${name}.ktx2`,meta=slots[slot];
  const args=['create','--format',meta.tf==='srgb'?'R8G8B8_SRGB':'R8G8B8_UNORM','--assign-tf',meta.tf,
    '--assign-primaries',meta.tf==='srgb'?'bt709':'none','--levels','10','--encode',codec,'--threads','1',
    ...(codec==='uastc'?['--uastc-quality','2','--zstd','18']:['--qlevel','128']),
    ...mips[slot].map((_,i)=>`${slot}-mip-${i}.png`),file];
  run(args);run(['validate',file]);
  const bytes=readFileSync(file),container=readKTX(new Uint8Array(bytes));
  assert.equal(container.pixelWidth,512);assert.equal(container.pixelHeight,512);assert.equal(container.levels.length,10);
  assert.equal(container.dataFormatDescriptor[0].transferFunction,meta.tf==='srgb'?2:1);
  const rgba=decode(bytes),bc7=decode(bytes,6);
  assert.equal(rgba.length,10);
  const mipDiagnostics=rgba.map((m,i)=>diagnostics(mips[slot][i].data,m.data,slot));
  run(['extract','--transcode','rgba8',file,`${name}-decoded.png`]);
  const cliPNG=PNG.sync.read(readFileSync(`${name}-decoded.png`));
  const cliDiff=diagnostics(rgba[0].data,cliPNG.data,slot);
  assert.deepEqual(Buffer.from(rgba[0].data),cliPNG.data,'Native and WASM base-level RGBA must match');
  const texture=new THREE.CompressedTexture(bc7,512,512,THREE.RGBA_BPTC_Format,THREE.UnsignedByteType);
  texture.colorSpace=meta.tf==='srgb'?THREE.SRGBColorSpace:THREE.NoColorSpace;
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(1,1);texture.updateMatrix();
  textures[name]=texture;
  results[name]={bytes:bytes.length,sha256:hash(bytes),codec,transferFunction:meta.tf,levels:10,
    rgbaBytes:rgba.reduce((s,m)=>s+m.data.length,0),bc7BlockBytes:bc7.reduce((s,m)=>s+m.data.length,0),
    mipDiagnostics,cliVersusWasmBaseLevel:cliDiff};
}
// A real source-metadata hazard, isolated from lossy codecs and resizing.
const rawArm=join(sourceDir,'brick_wall_001_arm_1k.png');
const rawPixels=PNG.sync.read(readFileSync(rawArm)).data,metadataProbe={};
for(const [name,flags]of [['implicit',[]],['assigned',['--assign-tf','linear']],['converted',['--convert-tf','linear']]]){
  const file=`arm-metadata-${name}.ktx2`;
  const p=run(['create','--format','R8G8B8_UNORM',...flags,rawArm,file]);
  run(['extract',file,`arm-metadata-${name}.png`]);
  const actual=PNG.sync.read(readFileSync(`arm-metadata-${name}.png`)).data;
  metadataProbe[name]={diagnostics:diagnostics(rawPixels,actual,'arm'),stderr:p.stderr.trim(),
    transferFunction:readKTX(new Uint8Array(readFileSync(file))).dataFormatDescriptor[0].transferFunction};
}
assert.deepEqual(metadataProbe.assigned.diagnostics.maxAbs,[0,0,0],'Assignment must preserve actual stored data');
assert(metadataProbe.converted.diagnostics.maxAbs.some(v=>v>0.01),'Conversion must differ on this source');
// ktx 4.4.2 normal-mode is a packing operation, not a free quality switch.
run(['create','--format','R8G8B8_UNORM','--assign-tf','linear','--normal-mode','--encode','uastc',
  '--uastc-quality','2','--threads','1','nor_gl-mip-0.png','normal-mode.ktx2']);
const packed=decode(readFileSync('normal-mode.ktx2'))[0].data,normal=mips.nor_gl[0].data;
const packing={defaultRGB:diagnostics(normal,packed,'nor_gl')};
let x=0,y=0,replicate=0,rgbToX=0,rgbToXYZ=0,alphaToOpaque=0;
for(let i=0;i<packed.length;i+=4){for(let c=0;c<3;c++){rgbToX+=Math.abs(packed[i+c]-normal[i]);rgbToXYZ+=Math.abs(packed[i+c]-normal[i+c]);}alphaToOpaque+=Math.abs(packed[i+3]-255);x+=Math.abs(packed[i]-normal[i]);y+=Math.abs(packed[i+3]-normal[i+1]);replicate=Math.max(replicate,Math.abs(packed[i]-packed[i+1]),Math.abs(packed[i]-packed[i+2]));}
packing.meanXByteError=round(x/(packed.length/4));packing.meanYInAlphaByteError=round(y/(packed.length/4));packing.maxRGBReplicationError=replicate;
packing.layoutHypothesis={meanRGBToX:round(rgbToX/(packed.length/4*3)),meanRGBToXYZ:round(rgbToXYZ/(packed.length/4*3)),meanAlphaToOpaque:round(alphaToOpaque/(packed.length/4))};
assert(rgbToX<rgbToXYZ,'Packed RGB fits X better than original XYZ');
assert(y<alphaToOpaque,'Packed alpha fits original Y better than opaque alpha');
// Real Three CPU material objects only. No renderer, detectSupport, upload or draw call.
function material(){const m=new THREE.MeshStandardMaterial({roughness:1,metalness:0});
  m.map=textures['diffuse-basis-lz'];m.normalMap=textures['nor_gl-uastc'];
  m.aoMap=m.roughnessMap=m.metalnessMap=textures['arm-uastc'];return m;}
const snapshot=m=>({roughness:m.roughness,metalness:m.metalness,normalScale:m.normalScale.toArray(),normalMapType:m.normalMapType,maps:['map','normalMap','aoMap','roughnessMap','metalnessMap'].map(k=>({slot:k,repeat:m[k].repeat.toArray(),offset:m[k].offset.toArray(),rotation:m[k].rotation,channel:m[k].channel,wrap:[m[k].wrapS,m[k].wrapT],colorSpace:m[k].colorSpace,data:hash(Buffer.concat(m[k].mipmaps.map(x=>Buffer.from(x.data))))}))});
const control=material(),target=material(),before=snapshot(control);
function forkMaps(m){const cache=new Map();for(const k of ['map','normalMap','aoMap','roughnessMap','metalnessMap']){const t=m[k];if(!cache.has(t))cache.set(t,t.clone());m[k]=cache.get(t);}}
forkMaps(target);
for(const t of new Set([target.map,target.normalMap,target.aoMap,target.roughnessMap,target.metalnessMap])){t.repeat.set(2,2);t.updateMatrix();}
const r1=snapshot(target);for(const map of r1.maps)assert.deepEqual(map.repeat,[2,2]);
const expectedR1=structuredClone(before);expectedR1.maps.forEach(m=>m.repeat=[2,2]);assert.deepEqual(r1,expectedR1,'R1 changes only repeats');
target.roughness=.65;const r2=snapshot(target);
assert.deepEqual(snapshot(control),before,'Untargeted material must not change');
const expectedR2=structuredClone(r1);expectedR2.roughness=.65;assert.deepEqual(r2,expectedR2,'R2 changes only roughness factor');
assert.strictEqual(target.aoMap,target.roughnessMap);assert.notStrictEqual(target.map,control.map);
const negatives=[];
function mustReject(name,fn){assert.throws(fn);negatives.push({name,expectedRejection:true});}
mustReject('truncated KTX2 payload',()=>decode(readFileSync('nor_gl-uastc.ktx2').subarray(0,48)));
function sameLayout(m){const expected=m.map.repeat.toArray();for(const k of ['normalMap','aoMap','roughnessMap','metalnessMap'])assert.deepEqual(m[k].repeat.toArray(),expected);}
sameLayout(target);
const mismatched=material();forkMaps(mismatched);mismatched.map.repeat.set(2,2);
mustReject('designed: only base color repeat changed',()=>sameLayout(mismatched));
const wrongSpace=material();forkMaps(wrongSpace);wrongSpace.roughnessMap.colorSpace=THREE.SRGBColorSpace;
mustReject('designed: data slot tagged sRGB',()=>assert.equal(wrongSpace.roughnessMap.colorSpace,THREE.NoColorSpace));
const sharedA=material(),sharedB=material();const previous=sharedB.map.repeat.toArray();sharedA.map.repeat.set(3,3);
mustReject('designed: shared texture mutated without clone',()=>assert.deepEqual(sharedB.map.repeat.toArray(),previous));
const missing=run(['create','--format','R8G8B8_UNORM','no-such-input.png','missing.ktx2'],true);
assert(Number.isInteger(missing.status)&&missing.status!==0,'Missing-file result must be an actual nonzero exit, not timeout');
assert.match(missing.stderr,/no-such-input\.png/,'Missing-file diagnostic must identify the requested file');negatives.push({name:'missing source file',expectedRejection:true,exitCode:missing.status});
for(const [slot,meta]of Object.entries(slots))assert.equal(hash(readFileSync(join(sourceDir,`brick_wall_001_${slot}_1k.png`))),meta.hash,'Source must remain unchanged');
const raw={scope:'Actual KTX 4.4.2 encoding; official native extraction and Three-bundled WASM CPU transcoding; Three CPU material revision only. No browser/GPU/visual acceptance.',
  versions:{ktx:'4.4.2',three:THREE.REVISION,pngjs:'7.0.0',ktxParse:'2.0.0'},
  inputs,results,metadataProbe,normalMode:packing,revisions:{controlUnchanged:true,r1,r2},negatives,
  commands:commands.map(c=>({...c,args:c.args.map(a=>a.startsWith(resolve(sourceDir))?a.replace(resolve(sourceDir),'SOURCE'):a)}))};
writeFileSync('p124-texture-raw.json',JSON.stringify(raw,null,2)+'\n');
const summary={
  scope:raw.scope,versions:raw.versions,inputs,
  results:Object.fromEntries(Object.entries(results).map(([name,r])=>[name,{
    bytes:r.bytes,sha256:r.sha256,transferFunction:r.transferFunction,
    allMipCPUChecks:{levels:r.levels,rgbaAndBC7Transcoded:true,rgbaBytes:r.rgbaBytes,bc7BlockBytes:r.bc7BlockBytes},
    level0RGBA8:r.mipDiagnostics[0],nativeAndWasmBaseRGBAEqual:true
  }])),
  metadataProbe:Object.fromEntries(Object.entries(metadataProbe).map(([name,r])=>[name,{
    transferFunction:r.transferFunction,mae:r.diagnostics.mae,maxAbs:r.diagnostics.maxAbs,
    gammaConversionWarning:r.stderr.includes('Converting gamma')
  }])),
  normalMode:{defaultXYZMeanDegrees:packing.defaultRGB.normalDegrees.mean,
    meanXByteError:packing.meanXByteError,meanYInAlphaByteError:packing.meanYInAlphaByteError,
    maxRGBReplicationError:packing.maxRGBReplicationError,layoutHypothesis:packing.layoutHypothesis},
  revisions:{r1OnlyAllSlotRepeatChangedTo:[2,2],r2OnlyRoughnessFactorChangedTo:.65,
    controlUnchanged:true,sourceHashesUnchanged:true,ARMTextureObjectStillSharedWithinTarget:true,
    retained:['colorSpace','wrapS/T','offset','rotation','UV channel','metalness','normalScale','normalMapType','all mip block bytes']},
  negatives,
  rawDetails:'Generated locally as p124-texture-raw.json; per-mip diagnostics, snapshots and full commands are intentionally not committed.'
};
writeFileSync('p124-texture-results.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({encoded:Object.keys(results).length,negativeChecks:negatives.length,bytes:Object.fromEntries(Object.entries(results).map(([k,v])=>[k,v.bytes])),metadataProbe,packing},null,2));
