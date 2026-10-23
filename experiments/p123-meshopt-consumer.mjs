// Run only in an isolated directory with the accompanying locked dependencies.
import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {NodeIO} from '@gltf-transform/core';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {GLTFLoader as OldLoader} from 'three-old/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'meshoptimizer';

const input = process.argv[2];
assert(input && existsSync(input), 'Provide the fixed RiggedSimple.glb input');
const hash = b => createHash('sha256').update(b).digest('hex');
const original = readFileSync(input);
assert.equal(original.length, 15104);
assert.equal(hash(original), '3a79dabb67bb0cd598a18d08b954d9d357c27c30672f82ef5d3f4e7fe6ca3401');
const io = new NodeIO();
const require = createRequire(import.meta.url);
const oldRequire = createRequire(require.resolve('three-old/addons/loaders/GLTFLoader.js'));
assert.match(oldRequire.resolve('three'), /three-old/);
const cli = require.resolve('gltfpack').replace('library.js', 'cli.js');
const metadata = file => {
  const bytes = readFileSync(file);
  const j = JSON.parse(bytes.subarray(20,20 + bytes.readUInt32LE(12)).toString());
  assert(!j.images?.length && !j.textures?.length, 'No image adapters permitted');
  return {bytes:bytes.length, sha256:hash(bytes), extensionsUsed:j.extensionsUsed || [],
    extensionsRequired:j.extensionsRequired || [], buffers:j.buffers};
};
// GLB metadata is inspected only; geometry/animation decoding belongs to GLTFLoader.
const outputs = {};
function pack(source, target, flags) {
  const p = spawnSync(process.execPath, [cli, '-i', source, '-o', target,
    ...flags, '-kn', '-km', '-ke'], {encoding:'utf8', timeout:30000});
  assert.equal(p.status, 0, p.stderr || p.error?.message);
  assert(existsSync(target), 'Processor must write an asset');
  outputs[target] = {...metadata(target), args:flags};
}
const sourceDoc = await io.read(input);
assert.equal(sourceDoc.getRoot().listMaterials().length,1);
assert.equal(sourceDoc.getRoot().listAnimations().length,1);
sourceDoc.getRoot().listMaterials()[0].setBaseColorFactor([0.8,0.1,0.2,1]);
await io.write('r1-source.glb',sourceDoc);
const times = new Set(sourceDoc.getRoot().listAnimations()[0].listSamplers().map(s=>s.getInput()));
for (const accessor of times) accessor.setArray(accessor.getArray().map(v=>v*0.8));
await io.write('r2-source.glb',sourceDoc);
for (const [stage, source] of [['r0',input],['r1','r1-source.glb'],['r2','r2-source.glb']]) {
  pack(source, `${stage}-ext.glb`, ['-cc']);
  pack(source, `${stage}-khr.glb`, ['-cz']);
}
// One bounded recovery: preserve source animation key times, keeping other settings.
for (const [stage,source] of [['r0',input],['r1','r1-source.glb'],['r2','r2-source.glb']]) {
  pack(source, `${stage}-ext-preserve-time.glb`, ['-cc','-af','0']);
}
pack(input,'r0-khr-preserve-time.glb',['-cz','-af','0']);
pack(input, 'r0-fallback.glb', ['-ce','khr','-cf']);
for (const buffer of outputs['r0-fallback.glb'].buffers) {
  if (buffer.uri) {
    const bytes=readFileSync(buffer.uri);
    outputs[buffer.uri]={bytes:bytes.length,sha256:hash(bytes)};
  }
}
// Node has no browser ProgressEvent; this adapter carries progress metadata only.
if (typeof globalThis.ProgressEvent === 'undefined') {
  globalThis.ProgressEvent = class extends Event {
    constructor(type, init) { super(type); Object.assign(this, init); }
  };
}
async function load(file, old=false, decoder=true) {
  const manager = new THREE.LoadingManager();
  manager.setURLModifier(url => {
    // Actual tool-produced external fallback bytes; no fabricated geometry or image.
    if (url === '') return url; // Let FileLoader report the real missing-fallback URL error.
    assert.equal(url, 'r0-fallback.fallback.bin', 'Unexpected external resource');
    return `data:application/octet-stream;base64,${readFileSync(url).toString('base64')}`;
  });
  const warnings=[];
  const warn=console.warn;
  console.warn=(...args)=>warnings.push(args.join(' '));
  try {
    const loader = new (old ? OldLoader : GLTFLoader)(manager);
    if(decoder) loader.setMeshoptDecoder(MeshoptDecoder);
    const bytes=readFileSync(file);
    const gltf=await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
    return {gltf,warnings};
  } catch(e) { e.consumerWarnings=warnings; throw e; } finally { console.warn=warn; }
}
function snapshot(gltf, sampleDuration) {
  assert.equal(gltf.animations.length,1);
  const meshes=[]; gltf.scene.traverse(n=>{if(n.isSkinnedMesh) meshes.push(n);});
  assert.equal(meshes.length,1);
  const mesh=meshes[0], clip=gltf.animations[0];
  assert.equal(mesh.skeleton.bones.length,2);
  const mixer=new THREE.AnimationMixer(gltf.scene);
  const action=mixer.clipAction(clip); action.setLoop(THREE.LoopOnce,1); action.clampWhenFinished=true;
  const frames=[];
  for(let i=0;i<=60;i++) {
    action.reset().play(); mixer.setTime((sampleDuration ?? clip.duration)*i/60); gltf.scene.updateMatrixWorld(true);
    const points=[];
    for(let v=0;v<mesh.geometry.attributes.position.count;v++) {
      const p=mesh.getVertexPosition(v,new THREE.Vector3()).applyMatrix4(mesh.matrixWorld);
      assert(p.toArray().every(Number.isFinite)); points.push(p.toArray());
    }
    frames.push(points);
  }
  mixer.stopAllAction(); mixer.uncacheRoot(gltf.scene);
  return {duration:clip.duration, tracks:clip.tracks.length,
    triangles:mesh.geometry.index.count/3, vertices:mesh.geometry.attributes.position.count,
    boneNames:mesh.skeleton.bones.map(b=>b.name), color:mesh.material.color.toArray(),
    metallic:mesh.material.metalness, frames};
}
function distance(a,b) {
  let maximum=0;
  for(const p of a) {
    let nearest=Infinity;
    for(const q of b) nearest=Math.min(nearest,(p[0]-q[0])**2+(p[1]-q[1])**2+(p[2]-q[2])**2);
    maximum=Math.max(maximum,Math.sqrt(nearest));
  }
  return maximum;
}
function compare(a,b) {
  assert.equal(a.triangles,b.triangles); assert.deepEqual(a.boneNames,b.boneNames);
  let max=0;
  for(let i=0;i<a.frames.length;i++) max=Math.max(max,distance(a.frames[i],b.frames[i]),distance(b.frames[i],a.frames[i]));
  // Predeclared fixture-scale CPU tolerance: 0.01 world units, not a visual threshold.
  // Return the measured maximum even when the diagnostic threshold is exceeded.
  assert(Math.max(...a.color.map((x,i)=>Math.abs(x-b.color[i])))<1e-6);
  assert.equal(a.metallic,b.metallic);
  return max;
}
const compact = s => {const {frames,...rest}=s; return rest;};
const baselines={};
for(const [stage,file] of [['r0',input],['r1','r1-source.glb'],['r2','r2-source.glb']]) {
  const loaded=await load(file); assert.deepEqual(loaded.warnings,[]);
  baselines[stage]=snapshot(loaded.gltf);
}
// R1 must change color and nothing in the sampled motion; R2 retains R1 at equal clip phase.
assert.notDeepEqual(baselines.r0.color,baselines.r1.color);
const r0WithNewColor={...baselines.r0,color:baselines.r1.color};
assert(compare(r0WithNewColor,baselines.r1)<1e-6);
assert(compare(baselines.r1,baselines.r2)<1e-5);
assert(Math.abs(baselines.r2.duration/baselines.r1.duration-0.8)<1e-6);
const cases=[];
for(const stage of ['r0','r1','r2']) {
  for(const format of ['ext','khr']) {
    const file=`${stage}-${format}.glb`;
    const loaded=await load(file); assert.deepEqual(loaded.warnings,[]);
    const actual=snapshot(loaded.gltf);
    const drift=compare(baselines[stage],actual);
    const durationDrift=Math.abs(actual.duration-baselines[stage].duration);
    const absoluteTimeDistance=compare(baselines[stage],snapshot(loaded.gltf,baselines[stage].duration));
    cases.push({file,consumer:'three-0.186.0',decoder:true,result:'loaded-and-compared',
      maxBidirectionalSampleDistance:drift,absoluteTimeDistance,durationDrift,
      diagnosticPass:drift<=0.01&&durationDrift<1e-5,...compact(actual)});
  }
}
for(const [stage,format] of [['r0','ext'],['r1','ext'],['r2','ext'],['r0','khr']]) {
  const file=`${stage}-${format}-preserve-time.glb`;
  const loaded=await load(file); assert.deepEqual(loaded.warnings,[]);
  const actual=snapshot(loaded.gltf);
  const drift=compare(baselines[stage],actual);
  const durationDrift=Math.abs(actual.duration-baselines[stage].duration);
  const absoluteTimeDistance=compare(baselines[stage],snapshot(loaded.gltf,baselines[stage].duration));
  cases.push({file,consumer:'three-0.186.0',decoder:true,result:'loaded-and-compared',
    maxBidirectionalSampleDistance:drift,absoluteTimeDistance,durationDrift,diagnosticPass:drift<=0.01&&durationDrift<1e-5,...compact(actual)});
  assert(drift<=0.01&&durationDrift<1e-5, 'Preserve-time recovery failed diagnostic gate');
}
// Compatibility negatives are observed, not required to throw at a particular layer.
for(const [file,old,decoder] of [
  ['r0-ext.glb',true,true],['r0-khr.glb',true,true],
  ['r0-ext.glb',false,false],['r0-khr.glb',false,false],
  ['r0-fallback.glb',false,false],['r0-fallback.glb',true,false]
]) {
  const row={file,consumer:old?'three-0.182.0':'three-0.186.0',decoder};
  let phase='load';
  try {
    const loaded=await load(file,old,decoder); row.warnings=loaded.warnings;
    row.result='resolved'; phase='semantic'; const actual=snapshot(loaded.gltf);
    row.maxBidirectionalSampleDistance=compare(baselines.r0,actual);
    row.durationDrift=Math.abs(actual.duration-baselines.r0.duration);
    row.diagnosticPass=row.maxBidirectionalSampleDistance<=0.01&&row.durationDrift<1e-5;
    row.result='loaded-and-compared';
  } catch(e) { row.result='rejected-or-semantic-failure'; row.failurePhase=phase; row.error=e.message; row.errorType=e.name; row.warnings=e.consumerWarnings||row.warnings||[]; }
  cases.push(row);
}
assert.equal(cases.find(c=>c.consumer==='three-0.182.0'&&c.file==='r0-ext.glb').result,'loaded-and-compared');
for(const file of ['r0-ext.glb','r0-khr.glb']) {
  const negative=cases.find(c=>c.file===file&&!c.decoder&&c.consumer==='three-0.186.0');
  assert.equal(negative.result,'rejected-or-semantic-failure');
  assert.equal(negative.failurePhase,'load');
  assert.match(negative.error,/setMeshoptDecoder/);
}
for(const c of cases.filter(c=>c.file==='r0-fallback.glb')) assert.equal(c.result,'loaded-and-compared');
const result={schema:1,date:'2026-10-23',node:process.version,
  input:{bytes:original.length,sha256:hash(original),repositoryCommit:'15cd02d304e54cb42a4db4eefe719f76190f4b68',
    license:'Cesium, CC-BY-4.0; local derivatives change color and animation timing'},
  versions:{gltfpack:'1.3.0',meshoptimizer:'1.3.0',three:'0.186.0',threeOld:'0.182.0',gltfTransformCore:'4.5.1'},
  tolerance:{worldDistance:0.01,normalizedTimeSamples:61,color:1e-6,duration:1e-5},
  baselines:Object.fromEntries(Object.entries(baselines).map(([k,v])=>[k,compact(v)])),outputs,cases,
  initialFailure:{worldDistance:0.06399862632316246,diagnosticThreshold:0.01,classification:'Normalized-phase distance exceeded probe threshold; duration drift measured separately; -af 0 is a single-setting recovery, not proof that all residual error is quantization'},
  limitations:['CPU only, no browser/GPU/engine or visual acceptance','Finite bidirectional vertex samples, not complete surface or motion proof','No textures, morph targets, LOD or runtime performance test','GLB graph master, not original DCC source']};
writeFileSync('p123-meshopt-results.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({cases:cases.length,results:cases.map(c=>[c.file,c.consumer,c.decoder,c.result,c.maxBidirectionalSampleDistance,c.error])},null,2));
