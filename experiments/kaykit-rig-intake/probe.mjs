// Reproduce the fixed sample's cross-export rig mismatch without rendering.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const [sample, dependencies] = process.argv.slice(2);
if (!sample || !dependencies) {
  console.error('Usage: node probe.mjs <sample/kaykit> <node_modules>');
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
for (const suffix of ['Ranged_1H_Reload', 'Ranged_2H_Reload']) {
  const target = await load('Knight'), source = await load('Med_CombatRanged');
  const clip = source.animations.find(a => a.name === `Rig_Medium|${suffix}`);
  assert.ok(clip, 'source clip exists');
  const missing = clip.tracks.filter(track => {
    const parsed = THREE.PropertyBinding.parseTrackName(track.name);
    return !THREE.PropertyBinding.findNode(target.scene, parsed.nodeName);
  }).map(track => track.name);
  assert.deepEqual(missing, ['Rig_Medium.position', 'Rig_Medium.quaternion', 'Rig_Medium.scale']);
  const heads = [];
  for (const model of [target, source]) {
    const mixer = new THREE.AnimationMixer(model.scene);
    mixer.clipAction(clip).play(); mixer.setTime(clip.duration / 2);
    model.scene.updateMatrixWorld(true);
    heads.push(model.scene.getObjectByName('head').getWorldPosition(new THREE.Vector3()).toArray());
    mixer.stopAllAction(); mixer.uncacheRoot(model.scene);
  }
  assert.ok(Math.abs(heads[0][1]) < 0.2 && heads[1][1] > 1, 'direct target loses upright head height');
  results.push({ clip: clip.name, duration: clip.duration, missing, targetHead: heads[0], sourceHead: heads[1] });
}
console.log(JSON.stringify({ version, textureDecoded: false, results }, null, 2));
