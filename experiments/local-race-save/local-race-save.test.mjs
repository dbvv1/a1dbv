import test from 'node:test';
import assert from 'node:assert/strict';
import {createLocalRaceSave, localRaceSaveMessage} from './local-race-save.mjs';

const trackIds = ['coast-reborn', 'sakura-reborn', 'academy-reborn'];
const runsKey = 'star-rush-runs-road-v2';
const ghostKey = 'star-rush-best-reborn-road-v2-coast-reborn';
const run = (id = 'run-1') => ({id, mode: 'circuit', track: 'coast-reborn', seed: 73121,
  distance: 4800, timeMs: 120000, score: 0});
const ghost = (time = 120) => ({time, points: Array.from({length: 12}, (_, i) =>
  [i * time / 12, i * 40, 0, i * .1, 0]), splits: [40, 80, time], laps: [time], date: 1});
function fixture(initial = [], options = {}) {
  const data = new Map(initial), writes = [];
  const port = {getItem(key) {if (options.readFails) throw Error('unavailable'); return data.get(key) ?? null;},
    setItem(key, value) {if (options.failKey === key || options.writeFails) throw Error('quota'); data.set(key, value); writes.push(key);}};
  const create = (extra = {}) => createLocalRaceSave({storage: () => {
    if (options.getterFails) throw Error('denied'); return port;
  }, roadDriving: true, trackIds, ...extra});
  return {data, writes, create, save: create(), options};
}

test('missing input and configuration fail without inventing storage or track IDs', () => {
  assert.throws(() => createLocalRaceSave({}), TypeError);
  const {save, writes} = fixture();
  assert.equal(save.readRuns().status, 'missing');
  assert.equal(save.readGhost('coast-reborn').value, null);
  assert.equal(save.appendRun(undefined, 'Driver').status, 'invalid-input');
  assert.equal(save.readGhost('new-track').status, 'invalid-input');
  assert.equal(save.saveBestGhost('new-track', ghost()).status, 'invalid-input');
  assert.deepEqual(writes, []);
});

test('existing wire format resumes, same namespace only, and a fresh owner can read new data', () => {
  const oldRun = {...run('old'), name: 'Old Driver'}, oldGhost = ghost(140);
  const untouched = [['star-rush-runs-reborn', 'legacy bytes'], ['star-rush-runs-road-v1', 'v1 bytes'],
    ['star-rush-best-reborn-coast-reborn', 'legacy ghost'], ['star-rush-settings-road-v2', 'settings'],
    ['star-rush-name', 'shared name']];
  const {save, data, create} = fixture([...untouched, [runsKey, JSON.stringify([oldRun])], [ghostKey, JSON.stringify(oldGhost)]]);
  assert.deepEqual(save.readRuns().value, [oldRun]);
  assert.deepEqual(save.readGhost('coast-reborn').value, oldGhost);
  const result = save.finish({run: run(), name: 'Driver', ghost: ghost()});
  assert.equal(result.record.status, 'saved'); assert.equal(result.ghost.status, 'saved');
  assert.equal(create().readRuns().value.length, 2);
  assert.equal(create().readGhost('coast-reborn').value.time, 120);
  for (const [key, value] of untouched) assert.equal(data.get(key), value);
});

test('legacy and road-v1 remain explicit profiles, not migrations or fallback data', () => {
  const f = fixture();
  for (const options of [{roadDriving: false}, {drivingRevision: 'road-v1'}, {}]) {
    const save = f.create(options); save.finish({run: run(), name: 'Driver', ghost: ghost()});
  }
  assert.equal(f.data.size, 6);
  assert(f.data.has('star-rush-best-reborn-coast-reborn'));
  assert(f.data.has('star-rush-best-reborn-road-v1-coast-reborn'));
  assert.equal(f.create({roadDriving: false}).appendRun({...run('endless'), mode: 'endless', track: 'endless-reborn'}, 'Driver').ok, true);
  assert.equal(f.save.appendRun({...run('endless'), mode: 'endless', track: 'endless-reborn'}, 'Driver').ok, false);
});

test('preserves the latest 100 records and retries one result without duplicating it', () => {
  const previous = Array.from({length: 100}, (_, i) => ({...run('old-' + i), name: 'Driver'}));
  const {save, writes} = fixture([[runsKey, JSON.stringify(previous)]]);
  save.appendRun(run(), 'Driver');
  assert.equal(save.readRuns().value.length, 100);
  assert.equal(save.readRuns().value[0].id, 'old-1');
  assert.equal(save.appendRun(run(), 'Changed name').status, 'already-saved');
  assert.equal(save.appendRun({...run(), timeMs: 12}, 'Driver').status, 'id-conflict');
  assert.equal(writes.length, 1);
});

test('slower or equal ghost preserves the existing best; tracks are independent', () => {
  const old = JSON.stringify(ghost(100));
  const {save, data} = fixture([[ghostKey, old]]);
  for (const time of [100, 120]) assert.equal(save.saveBestGhost('coast-reborn', ghost(time)).status, 'not-faster');
  assert.equal(data.get(ghostKey), old);
  assert.equal(save.saveBestGhost('sakura-reborn', ghost(130)).status, 'saved');
  assert.equal(save.readGhost('coast-reborn').value.time, 100);
});

test('invalid JSON and parseable wrong shapes preserve the original bytes on attempted save', () => {
  for (const raw of ['{broken', 'null', '{}', '[{}]', JSON.stringify([{...run(), name: 'Driver', timeMs: '120'}])]) {
    const f = fixture([[runsKey, raw]]);
    assert.equal(f.save.readRuns().status, 'invalid-data');
    assert.equal(f.save.appendRun(run(), 'Driver').status, 'invalid-data');
    assert.equal(f.data.get(runsKey), raw); assert.deepEqual(f.writes, []);
  }
  for (const value of [null, {}, {...ghost(), points: [[0, 0, 0, 0, 0]]},
    {...ghost(), points: [[1, 0, 0, 0, 0], [1, 0, 0, 0, 0]]}]) {
    const raw = JSON.stringify(value), f = fixture([[ghostKey, raw]]);
    assert.equal(f.save.saveBestGhost('coast-reborn', ghost()).status, 'invalid-data');
    assert.equal(f.data.get(ghostKey), raw); assert.deepEqual(f.writes, []);
  }
});

test('non-finite or invalid snapshots are rejected before writes', () => {
  const f = fixture();
  for (const value of [NaN, Infinity, -1, '20']) assert.equal(f.save.appendRun({...run(), timeMs: value}, 'Driver').ok, false);
  for (const candidate of [{...ghost(), time: 0}, {...ghost(), date: Infinity},
    {...ghost(), points: [[0, NaN, 0, 0, 0], [1, 0, 0, 0, 0]]}]) {
    assert.equal(f.save.saveBestGhost('coast-reborn', candidate).ok, false);
  }
  const cyclic = run(); cyclic.self = cyclic;
  assert.equal(f.save.appendRun(cyclic, 'Driver').status, 'invalid-input');
  assert.deepEqual(f.writes, []);
});

test('storage getter, reads and writes can each fail without clearing prior valid records', () => {
  for (const option of ['getterFails', 'readFails', 'writeFails']) {
    const original = JSON.stringify([{...run('old'), name: 'Driver'}]);
    const f = fixture([[runsKey, original]], {[option]: true});
    const result = f.save.appendRun(run(), 'Driver');
    assert.equal(result.status, option === 'writeFails' ? 'write-failed' : 'read-failed');
    assert.equal(f.data.get(runsKey), original); assert.deepEqual(f.writes, []);
  }
});

test('partial success is visible and retry keeps the successful key instead of rolling it back', () => {
  for (const failKey of [runsKey, ghostKey]) {
    const f = fixture([], {failKey});
    const input = {run: run(), name: 'Driver', ghost: ghost()};
    const result = f.save.finish(input);
    assert.equal(result.record.ok, failKey !== runsKey);
    assert.equal(result.ghost.ok, failKey !== ghostKey);
    const message = localRaceSaveMessage(result);
    assert.match(message, /未保存/); assert.match(message, /已保存至本浏览器/);
    delete f.options.failKey;
    const retry = f.save.finish(input);
    assert(retry.record.ok && retry.ghost.ok);
    assert.equal(f.save.readRuns().value.length, 1);
    assert.equal(f.save.readGhost('coast-reborn').value.time, 120);
  }
});

test('DNF writes neither key; ineligible ghost does not become a saved-ghost claim', () => {
  const f = fixture();
  const dnf = f.save.finish({run: run(), name: 'Driver', ghost: ghost(), dnf: true});
  assert.deepEqual(f.writes, []); assert.doesNotMatch(localRaceSaveMessage(dnf), /已保存/);
  const recordOnly = f.save.finish({run: run(), name: 'Driver'});
  assert.equal(recordOnly.record.status, 'saved'); assert.equal(recordOnly.ghost.status, 'skipped');
  assert.match(localRaceSaveMessage(recordOnly), /幽灵本次不保存/);
});

test('bad data and conflicting IDs do not tell players that repeating the write will fix them', () => {
  for (const status of ['invalid-data', 'id-conflict', 'invalid-input']) {
    const message = localRaceSaveMessage({record: {ok: false, status}, ghost: {ok: true, status: 'skipped'}});
    assert.doesNotMatch(message, /可重试/); assert.match(message, /未保存/);
  }
});

test('capture and reload do not expose mutable storage aliases', () => {
  const f = fixture(), input = {run: run(), name: 'Driver', ghost: ghost()};
  f.save.finish(input); input.ghost.points[0][1] = 999;
  const loaded = f.save.readGhost('coast-reborn'); loaded.value.points[0][1] = 888;
  assert.equal(f.save.readGhost('coast-reborn').value.points[0][1], 0);
  const runs = f.save.readRuns(); runs.value[0].timeMs = 1;
  assert.equal(f.save.readRuns().value[0].timeMs, 120000);
});
