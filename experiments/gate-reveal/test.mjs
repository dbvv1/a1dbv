import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { GateReveal, PROFILES } from './controller.mjs';
import { createGateServer } from './server.mjs';

class Media extends EventTarget {
  currentTime = 0;
  playCalls = 0;
  pauseCalls = 0;
  removed = false;
  play() { this.playCalls++; return this.promise ?? Promise.resolve(); }
  pause() { this.pauseCalls++; }
  removeAttribute(name) { assert.equal(name, 'src'); this.sourceRemoved = true; }
  load() { this.loaded = true; }
  remove() { this.removed = true; }
}
const flush = () => new Promise(resolve => setImmediate(resolve));
const setup = profile => { const media = new Media(); const game = new GateReveal(() => media, profile); return {game, media}; };
const beginB = game => { assert.equal(game.start(), true); game.tick(4); assert.equal(game.stage, 'B'); };

test('normal A → actual-media boundary B → C → world; only interaction commits door', async () => {
  const { game, media } = setup();
  assert.equal(game.world.unlocked, false);
  beginB(game); await flush();
  assert.equal(media.playCalls, 1); assert.equal(game.world.unlocked, true);
  game.tick(90); assert.equal(game.stage, 'B'); // no wall-clock substitute for media completion
  media.currentTime = 8.25; assert.equal(game.shotTime, 8.25);
  media.dispatchEvent(new Event('ended'));
  assert.equal(game.stage, 'C'); assert.equal(game.controlsEnabled, false);
  game.tick(5); assert.equal(game.controlsEnabled, true);
  for (let n = 0; n < 8; n++) game.move(0, 1, .25);
  assert.equal(game.world.crossed, true);
  assert.deepEqual(game.transitions, ['game', 'A', 'B', 'C', 'game']);
  assert.equal(media.sourceRemoved && media.loaded && media.removed, true);
});
test('pause holds A/C clock; B reads media time and coordinates pause/resume', async () => {
  const { game, media } = setup(); game.start(); game.tick(1); game.setPaused(true); game.tick(20);
  assert.equal(game.shotTime, 1); game.setPaused(false); game.tick(3); await flush();
  media.currentTime = 2; game.setPaused(true); game.tick(30);
  assert.equal(game.stage, 'B'); assert.equal(game.shotTime, 2);
  media.dispatchEvent(new Event('ended')); assert.equal(game.stage, 'B');
  game.setPaused(false); assert.equal(game.stage, 'C');
  game.setPaused(true); game.tick(6); assert.equal(game.stage, 'C');
  game.setPaused(false); game.tick(5); assert.equal(game.stage, 'game');
});
test('skip in each segment and repeated skip have same traversable authoritative world', () => {
  for (const stage of ['A', 'B', 'C']) {
    const {game, media} = setup(); game.start();
    if (stage !== 'A') game.tick(4);
    if (stage === 'C') media.dispatchEvent(new Event('ended'));
    game.setPaused(true); game.skip(); game.skip();
    assert.equal(game.world.unlocked && game.controlsEnabled, true);
    assert.equal(game.paused, false); assert.equal(game.media, null);
    media.dispatchEvent(new Event('ended')); assert.equal(game.stage, 'game');
  }
});
test('late play resolve/error/ended after skip cannot reactivate old or new sequence', async () => {
  const media = new Media(); let resolve; media.promise = new Promise(r => { resolve = r; });
  const next = new Media(); let count = 0;
  const game = new GateReveal(() => count++ ? next : media);
  beginB(game); await flush(); game.skip(); game.reset(); beginB(game); await flush();
  resolve(); media.dispatchEvent(new Event('error')); media.dispatchEvent(new Event('ended')); await flush();
  assert.equal(game.media, next); assert.equal(game.stage, 'B'); assert.equal(next.pauseCalls, 0);
  game.dispose(); assert.equal(next.removed, true); assert.equal(game.controlsEnabled, false);
});
test('play rejection and missing-media event return through C, not a reward or closed gate', async () => {
  const {game, media} = setup(); media.promise = Promise.reject(new Error('decode failed'));
  beginB(game); await flush(); assert.equal(game.stage, 'C'); assert.equal(game.reason, 'play rejected');
  game.tick(5); assert.equal(game.world.unlocked, true);
  const other = setup(); beginB(other.game); other.media.dispatchEvent(new Event('error'));
  assert.equal(other.game.stage, 'C'); assert.equal(other.game.controlsEnabled, false);
});
test('pause-induced rejected play is stale; current resume rejection is not hidden', async () => {
  const {game, media} = setup(); let reject; media.promise = new Promise((_, r) => { reject = r; });
  beginB(game); await flush(); game.setPaused(true); reject(new Error('pause aborted')); await flush();
  assert.equal(game.stage, 'B');
  media.promise = Promise.reject(new Error('resume failed')); game.setPaused(false); await flush();
  assert.equal(game.stage, 'C');
});
test('legal interaction range, collision wall, no movement during shots, invalid inputs', () => {
  const {game} = setup();
  for (let n = 0; n < 10; n++) game.move(0, 1, .25);
  assert.ok(game.world.player.z < -.5); // closed door
  game.world.player = { x: 7, z: -4 }; assert.equal(game.start(), false);
  game.reset(); game.start(); const before = {...game.world.player};
  game.move(1, 1, .2); assert.deepEqual(game.world.player, before); game.skip();
  game.world.player = {x: 6, z: -1}; game.move(0, 1, .25); assert.equal(game.world.player.z, -1);
  assert.throws(() => game.tick(NaN)); assert.throws(() => game.move(1, 1, Infinity));
  assert.throws(() => game.reset('unknown')); assert.throws(() => new GateReveal(null));
});
test('second edit changes live equipment and C only, preserving A/B/exit', () => {
  const {game, media} = setup('revised'); beginB(game); media.dispatchEvent(new Event('ended'));
  game.tick(5); assert.equal(game.stage, 'C'); game.tick(1.5); assert.equal(game.stage, 'game');
  assert.equal(PROFILES.revised.weapon, 1.05); assert.equal(PROFILES.base.weapon, .75);
  assert.equal(PROFILES.revised.returnSeconds / PROFILES.base.returnSeconds, 1.3);
});
test('real HTTP full/partial/HEAD delivery, missing asset, traversal and invalid range', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'gate-server-'));
  const file = join(dir, 'media.mp4'); await writeFile(file, Buffer.from([0, 1, 2, 3, 4]));
  const server = createGateServer({mediaFile: file});
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(url)).status, 200);
    const partial = await fetch(`${url}/generated/gate.mp4`, {headers:{Range:'bytes=1-3'}});
    assert.equal(partial.status, 206); assert.equal(partial.headers.get('content-range'), 'bytes 1-3/5');
    assert.deepEqual([...new Uint8Array(await partial.arrayBuffer())], [1, 2, 3]);
    const suffix = await fetch(`${url}/generated/gate.mp4`, {headers:{Range:'bytes=-2'}});
    assert.equal(suffix.status, 206); assert.equal(suffix.headers.get('content-range'), 'bytes 3-4/5');
    assert.deepEqual([...new Uint8Array(await suffix.arrayBuffer())], [3, 4]);
    const fullSuffix = await fetch(`${url}/generated/gate.mp4`, {headers:{Range:'bytes=-100'}});
    assert.equal(fullSuffix.status, 206); assert.equal(fullSuffix.headers.get('content-range'), 'bytes 0-4/5');
    const head = await fetch(`${url}/generated/gate.mp4`, {method:'HEAD'});
    assert.equal(head.headers.get('content-length'), '5'); assert.equal((await head.text()).length, 0);
    assert.equal((await fetch(`${url}/scene.json`)).status, 404);
    assert.equal((await fetch(`${url}/../controller.mjs/../../scene.json`)).status, 404);
    for (const range of ['bytes=9-', 'bytes=3-1', 'bytes=a-', 'bytes=0-1,3-4', 'bytes=-0', 'bytes=-'])
      assert.equal((await fetch(`${url}/generated/gate.mp4`, {headers:{Range:range}})).status, 416);
    await rm(file); assert.equal((await fetch(`${url}/generated/gate.mp4`)).status, 404);
  } finally { server.closeAllConnections(); await new Promise(r => server.close(r)); await rm(dir, {recursive:true, force:true}); }
});
