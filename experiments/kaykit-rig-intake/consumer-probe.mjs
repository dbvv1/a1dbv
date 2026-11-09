// Run with the FPS checkout's tsx loader; this checks the real rigid consumer.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const [fps, sample] = process.argv.slice(2);
if (!fps || !sample) {
  console.error('Usage: node --import <tsx-loader> consumer-probe.mjs <FPS-checkout> <sample/kaykit>');
  process.exit(2);
}
const url = file => pathToFileURL(path.resolve(fps, file)).href;
const THREE = await import(url('node_modules/three/build/three.module.js'));
const { GLTFLoader } = await import(url('node_modules/three/examples/jsm/loaders/GLTFLoader.js'));
const { ContentOpponent, ContentSetAssets } = await import(url('src/render/content-set-assets.ts'));
const knightBytes = fs.readFileSync(path.join(sample, 'Knight.glb'));
assert.equal(createHash('sha256').update(knightBytes).digest('hex'), '60428e3abc09ba83e595d256e3af8c5c976b46cdae599f0802fc82b4a3445168');
async function load(bytes) {
  return new GLTFLoader().register(() => ({ name: 'cpu-no-images',
    loadTexture: () => Promise.resolve(new THREE.Texture()),
  })).parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
}
const knight = await load(knightBytes);
assert.throws(() => new ContentOpponent(knight), /Content node enemy-root: expected one, got 0/);
// Explicit parsed-asset injection isolates the adapter contract. It is not
// the production fetch/hash path, and does not grant Knight a production pin.
const owner = new ContentSetAssets(async id => load(id === 'fp-arms-rx24'
  ? fs.readFileSync(path.resolve(fps, 'assets/content-set/fp-arms-rx24.glb')) : knightBytes));
await owner.start();
assert.equal(owner.status, 'fallback');
assert.equal(owner.rifle, null);
assert.equal(owner.actor('bot'), null);
assert.match(owner.error, /Content node enemy-root: expected one, got 0/);
owner.dispose();
assert.equal(owner.status, 'disposed');
console.log(JSON.stringify({ directConsumerRejected: true, actualAssetOwnerFallback: true,
  error: 'Content node enemy-root: expected one, got 0', disposed: true, textureDecoded: false }));
