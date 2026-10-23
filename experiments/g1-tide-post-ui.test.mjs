// Replayable fake DOM/Canvas/Image checks only. No real browser, layout, image
// decoding, network, focus engine, or performance is exercised by this file.
import test from 'node:test';
import assert from 'node:assert/strict';

const elements = new Map();
const draws = [], rectangles = [], requests = [];
const handlers = {};
const makeElement = id => ({
  id, textContent: '', value: '', dataset: {}, handlers: {},
  addEventListener(type, callback) { this.handlers[type] = callback; },
  setAttribute() {},
  removeAttribute(name) { delete this[name]; },
  closest() { return null; },
});
for (const id of ['board', 'tide', 'next-tide', 'turn', 'mail', 'position',
  'status', 'save-state', 'save-feedback', 'save', 'load', 'asset-status',
  'mail-icon', 'tide-icon', 'next-tide-icon', 'raft-icon', 'raft', 'level']) {
  elements.set(id, makeElement(id));
}
const el = id => elements.get(id);
Object.assign(el('board'), {
  width: 800, height: 600,
  getContext: () => new Proxy({
    drawImage: (...args) => draws.push(args),
    fillRect: (...args) => rectangles.push(args),
  }, {
    get: (object, key) => object[key] ?? (() => {}),
    set: (object, key, value) => { object[key] = value; return true; },
  }),
});
const buttons = ['up', 'down', 'left', 'right', 'wait', 'restart'].map(action =>
  Object.assign(makeElement(action), { dataset: { action } }));
globalThis.document = {
  getElementById: el,
  querySelectorAll: () => buttons,
  addEventListener: (type, callback) => { handlers[type] = callback; },
};
// The imported module uses file: URLs in this Node-only harness.
globalThis.location = { origin: 'null' };
let failVariant = false;
globalThis.Image = class FakeImage {
  naturalWidth = 1024;
  naturalHeight = 1024;
  set src(url) {
    this.url = url;
    requests.push(url);
    if (url.includes('postman')) this.naturalHeight = 1536;
    if (failVariant && url.includes('postman-raft')) this.onerror();
    else this.onload();
  }
  get src() { return this.url; }
};
const ui = await import('./g1-tide-post-ui.mjs');
const clearDrawing = () => { draws.length = 0; rectangles.length = 0; };
const click = action => {
  clearDrawing();
  buttons.find(button => button.dataset.action === action).handlers.click();
};
const chooseLevel = level => {
  el('level').value = level;
  clearDrawing();
  el('level').handlers.change();
};
const lastActor = () => draws.filter(args => args[0].src.includes('postman')).at(-1);
const hasFallbackRaft = () => rectangles.some(args => args[2] === 84 && args[3] === 18);
const snapshot = () => {
  el('save').handlers.click();
  return JSON.parse(el('save-state').value);
};
function key(keyValue, { target = makeElement('target'), repeat = false } = {}) {
  let prevented = false;
  handlers.keydown({ key: keyValue, target, repeat, preventDefault() { prevented = true; } });
  return prevented;
}

// Sequential subtests deliberately share the lightweight fake document; every
// flow resets its relevant game/asset state rather than introducing a framework.
test('UI regression with fake DOM, Canvas and Image (NOT browser QA)', async t => {
  await t.test('manifest loads 11 mappings from 9 files; terrain fills and actor contains', () => {
    assert.equal(requests.length, 9);
    assert.equal(Object.keys(ui.assetManifest).length, 11);
    assert.match(el('asset-status').textContent, /11 个映射.*9 个唯一文件/);
    assert(draws.some(args => args[0].src.includes('land') && args[3] === 100 && args[4] === 100));
    assert.equal(lastActor()[3], 60);
    assert.equal(lastActor()[4], 90);
    assert.equal(el('mail-icon').hidden, false);
  });
  await t.test('carry uses v1, active uses v2, landing uses v1 without duplicate raft', () => {
    chooseLevel('raft');
    assert.match(lastActor()[0].src, /postman-v1/);
    click('right');
    assert.match(lastActor()[0].src, /postman-v1/);
    click('right');
    assert.match(lastActor()[0].src, /postman-raft-v2/);
    assert.equal(hasFallbackRaft(), false);
    click('wait');
    assert.match(el('raft').textContent, /展开/);
    click('right');
    assert.match(lastActor()[0].src, /postman-raft-v2/);
    click('right');
    assert.match(lastActor()[0].src, /postman-v1/);
    assert.match(el('raft').textContent, /消耗/);
  });
  await t.test('Image error is visible; only missing active variant draws fallback raft', async () => {
    failVariant = true;
    const result = await ui.loadLocalAssets(ui.assetManifest);
    assert.equal(result.failures.length, 1);
    assert.match(el('asset-status').textContent, /加载错误.*actor.postman.raft/);
    assert.equal(el('asset-status').dataset.error, 'true');
    chooseLevel('raft');
    assert.equal(hasFallbackRaft(), false);
    click('right'); click('right');
    assert.equal(hasFallbackRaft(), true);
    failVariant = false;
    await ui.loadLocalAssets(ui.assetManifest);
  });
  await t.test('v1 migration grants no raft; malformed restore preserves game and input', () => {
    const oldSave = { schemaVersion: 1, levelId: 'baseline', x: 2, y: 3,
      turn: 1, hasMail: true, status: 'playing' };
    const input = JSON.stringify(oldSave);
    el('save-state').value = input;
    el('load').handlers.click();
    assert.equal(el('save-state').value, input);
    assert.match(el('save-feedback').textContent, /旧档已迁移.*不赠送/);
    assert.equal(el('level').value, 'baseline');
    const before = snapshot();
    assert.equal(before.schemaVersion, 2);
    assert.equal(before.raftAvailable, false);
    assert.equal(before.raftActive, false);
    for (const bad of ['', '{broken', '{}']) {
      el('save-state').value = bad;
      el('load').handlers.click();
      assert.equal(el('save-state').value, bad);
      assert.match(el('save-feedback').textContent, /恢复失败/);
      assert.deepEqual(snapshot(), before);
    }
  });
  await t.test('editable focus, repeat and native Space are guarded; ordinary Space waits', () => {
    chooseLevel('baseline');
    const editable = { closest: selector => selector.includes('textarea') ? {} : null };
    assert.equal(key('r', { target: editable }), false);
    assert.equal(key(' ', { target: editable }), false);
    assert.equal(key('ArrowRight', { repeat: true }), false);
    const button = { closest: selector => selector === 'button,summary' ? {} : null };
    assert.equal(key(' ', { target: button }), false);
    assert.equal(snapshot().turn, 0);
    assert.equal(key(' '), true);
    assert.equal(snapshot().turn, 1);
    assert.equal(key('R'), true);
    assert.equal(snapshot().turn, 0);
  });
  await t.test('blocked and terminal moves do not advance; win/loss restart cleanly', () => {
    chooseLevel('baseline');
    click('left'); assert.equal(snapshot().turn, 0);
    click('right'); click('right');
    assert.match(el('status').textContent, /失败/);
    assert(buttons.filter(button => button.dataset.action !== 'restart').every(button => button.disabled));
    const lost = snapshot(); click('wait'); assert.deepEqual(snapshot(), lost);
    click('restart'); assert.equal(snapshot().turn, 0);
    for (const action of ['right', 'wait', 'wait', 'right', 'right', 'right', 'right']) click(action);
    assert.match(el('status').textContent, /成功/);
    const won = snapshot(); click('right'); assert.deepEqual(snapshot(), won);
    click('restart'); assert.equal(snapshot().status, 'playing');
    assert(buttons.every(button => !button.disabled));
  });
  await t.test('remote/traversal paths rejected before Image; null resets to placeholder', async () => {
    const count = requests.length;
    for (const path of ['https://example.com/a.png', '../docs/img/other.png',
      '../other/g1-tide-land.png', './x/../secret.png']) {
      const result = await ui.loadLocalAssets({ 'terrain.land': path });
      assert.equal(result.loaded, 0);
      assert.equal(result.failures.length, 1);
      assert.match(el('asset-status').textContent, /加载错误/);
    }
    assert.equal(requests.length, count);
    const result = await ui.loadLocalAssets(Object.fromEntries(Object.keys(ui.assetManifest).map(id => [id, null])));
    assert.equal(result.loaded, 0);
    assert.equal(result.uniqueFiles, 0);
    assert.match(el('asset-status').textContent, /未配置/);
    assert.equal(el('mail-icon').hidden, true);
  });
});
