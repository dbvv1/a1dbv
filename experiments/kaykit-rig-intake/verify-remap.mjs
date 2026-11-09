// Check the narrow adapter with real GLTFLoader and AnimationMixer.
import { remapParent } from './remap.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const [sample, dependencies] = process.argv.slice(2);
if (!sample || !dependencies) {
  console.error('Usage: node verify-remap.mjs <sample/kaykit> <node_modules>');
  process.exit(2);
}
const pins = {
  Knight: '60428e3abc09ba83e595d256e3af8c5c976b46cdae599f0802fc82b4a3445168',
  Med_CombatRanged: '08de5a5fd14dcc7c404b14f7c6ff962f8959503bf70bc00cbf258dbd0187c48d',
};
const buffers = Object.fromEntries(Object.entries(pins).map(([name, hash]) => {
  const bytes = fs.readFileSync(path.join(sample, name + '.glb'));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, `${name} fixed sample`);
  return [name, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)];
}));
const moduleURL = file => pathToFileURL(path.resolve(dependencies, 'three', file)).href;
const version = JSON.parse(fs.readFileSync(path.resolve(dependencies, 'three/package.json'))).version;
assert.equal(version, '0.186.1', 'use the consumer version');
const THREE = await import(moduleURL('build/three.module.js'));
const { GLTFLoader } = await import(moduleURL('examples/jsm/loaders/GLTFLoader.js'));
async function load(name) {
  // CPU-only: image decoding is deliberately omitted, not claimed as validated.
  return new GLTFLoader().register(() => ({
    name: 'cpu-texture-omission', loadTexture: () => Promise.resolve(new THREE.Texture()),
  })).parseAsync(buffers[name], '');
}
const results = [];
let negativeCases = 0;
for (const suffix of ['Ranged_1H_Reload', 'Ranged_2H_Reload']) {
  const target = await load('Knight'), source = await load('Med_CombatRanged');
  const clip = source.animations.find(a => a.name === `Rig_Medium|${suffix}`);
  const before = JSON.stringify(THREE.AnimationClip.toJSON(clip));
  const adapted = remapParent(THREE, source.scene, target.scene, clip);
  assert.equal(JSON.stringify(THREE.AnimationClip.toJSON(clip)), before, 'source unchanged');
  assert.equal(adapted.tracks.length, clip.tracks.length);
  adapted.tracks.forEach((t,i) => {
    assert.deepEqual(t.values, clip.tracks[i].values); assert.deepEqual(t.times, clip.tracks[i].times);
    assert.equal(t.getInterpolation(), clip.tracks[i].getInterpolation());
    assert.notEqual(t.values, clip.tracks[i].values, 'independent clone');
  });
  const nodes = [...new Set(clip.tracks.map(t => THREE.PropertyBinding.parseTrackName(t.name).nodeName))];
  const meshes = []; target.scene.traverse(n => { if (n.isSkinnedMesh) meshes.push(n); });
  assert.equal(meshes.length, 6);
  const mixers = [new THREE.AnimationMixer(target.scene), new THREE.AnimationMixer(source.scene)];
  [adapted, clip].forEach((c,i) => { const action=mixers[i].clipAction(c); action.setLoop(THREE.LoopOnce,1); action.clampWhenFinished=true; action.play(); });
  // All source keys, interval midpoints and a 60 Hz grid, including the endpoint.
  const keys = [...new Set(clip.tracks.flatMap(t => Array.from(t.times)))].sort((a,b)=>a-b);
  const times = [...new Set([...keys, ...keys.slice(1).map((t,i)=>(t+keys[i])/2), ...Array.from({length:Math.ceil(clip.duration*60)+1},(_,i)=>Math.min(i/60,clip.duration))])].sort((a,b)=>a-b);
  console.error('Verifying', suffix, times.length, 'samples');
  let maxMatrixError=0, maxSkinError=0, verticesChecked=0;
  for (const time of times) {
    mixers.forEach(m=>m.setTime(time)); target.scene.updateMatrixWorld(true); source.scene.updateMatrixWorld(true);
    for (const name of nodes) {
      const a=source.scene.getObjectByName(name), b=target.scene.getObjectByName(name==='Rig_Medium'?'Rig':name);
      for(let i=0;i<16;i++) maxMatrixError=Math.max(maxMatrixError,Math.abs(a.matrixWorld.elements[i]-b.matrixWorld.elements[i]));
    }
    for (const mesh of meshes) {
      mesh.skeleton.update();
      const {position,skinIndex,skinWeight}=mesh.geometry.attributes;
      for(let i=0;i<position.count;i++) {
        const actual=new THREE.Vector3().fromBufferAttribute(position,i);
        mesh.applyBoneTransform(i,actual); actual.applyMatrix4(mesh.matrixWorld);
        const base=new THREE.Vector3().fromBufferAttribute(position,i).applyMatrix4(mesh.bindMatrix);
        const expected=new THREE.Vector3();
        for(let j=0;j<4;j++) {
          const weight=skinWeight.getComponent(i,j); if(!weight) continue;
          const index=skinIndex.getComponent(i,j), bone=mesh.skeleton.bones[index];
          const reference=source.scene.getObjectByName(bone.name);
          assert.ok(reference, 'every weighted bone exists in source');
          expected.addScaledVector(base.clone().applyMatrix4(mesh.skeleton.boneInverses[index]).applyMatrix4(reference.matrixWorld),weight);
        }
        const error=actual.distanceTo(expected); assert.ok(Number.isFinite(error));
        maxSkinError=Math.max(maxSkinError,error); verticesChecked++;
      }
    }
  }
  assert.ok(maxMatrixError<1e-6, `world matrix error ${maxMatrixError}`);
  assert.ok(maxSkinError<1e-6, `skin error ${maxSkinError}`);
  mixers.forEach(m=>{m.stopAllAction();m.uncacheRoot(m.getRoot());});
  function reject(fn,pattern){assert.throws(fn,pattern);negativeCases++;}
  reject(()=>remapParent(THREE,null,target.scene,clip),/required/);
  const omitted=clip.clone();omitted.tracks=omitted.tracks.filter(t=>t.name!=='Rig_Medium.quaternion');
  reject(()=>remapParent(THREE,source.scene,target.scene,omitted),/channels|parent track/);
  const root=target.scene.getObjectByName('root'), rig=root.parent; target.scene.add(root);
  reject(()=>remapParent(THREE,source.scene,target.scene,clip),/root parent/);rig.add(root);
  const head=target.scene.getObjectByName('head');head.name='missing-head';
  reject(()=>remapParent(THREE,source.scene,target.scene,clip),/unique node/);head.name='head';
  const duplicate=new THREE.Object3D();duplicate.name='head';target.scene.add(duplicate);
  reject(()=>remapParent(THREE,source.scene,target.scene,clip),/unique node/);target.scene.remove(duplicate);
  target.scene.position.x=1;
  reject(()=>remapParent(THREE,source.scene,target.scene,clip),/identity/);target.scene.position.x=0;
  results.push({clip:clip.name,duration:clip.duration,nodes:nodes.length,samples:times.length,meshes:meshes.length,verticesChecked,maxMatrixError,maxSkinError});
}
console.log(JSON.stringify({version,textureDecoded:false,negativeCases,results},null,2));
