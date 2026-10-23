import test from 'node:test';
import assert from 'node:assert/strict';
import { levels, newGame, transition, getTide, saveGame, loadGame } from './g1-tide-post-core.mjs';

const play = (moves, state = newGame()) => moves.reduce(transition, state);
// Captured from the real v1 save produced at frozen commit c7d4c321e26a6cd982a7b44574a2d18d4530797c.
// The original bytes were read before this migration implementation was written.
const legacySave = '{"schemaVersion":1,"levelId":"baseline","x":2,"y":3,"turn":1,"hasMail":true,"status":"playing"}';
// Finite abstraction: only tide phase, position, mail, raft and terminal status
// influence future rules. Absolute turn counts are retained for shortest paths.
function solve(levelId, landOnly = false) {
  const queue = [{ state: newGame(levelId), path: [] }];
  const seen = new Set();
  for (let i = 0; i < queue.length; i += 1) {
    const { state, path } = queue[i];
    if (state.status === 'won') return { state, path, visited: seen.size };
    if (state.status !== 'playing') continue;
    const key = [state.x, state.y, state.turn % 4, state.hasMail, state.raftAvailable, state.raftActive].join(':');
    if (seen.has(key)) continue;
    seen.add(key);
    for (const action of ['up', 'down', 'left', 'right', 'wait']) {
      const next = transition(state, action);
      if (next.turn === state.turn || (landOnly && levels[levelId].tiles[next.y][next.x] !== 'L')) continue;
      queue.push({ state: next, path: [...path, action] });
    }
  }
  return null;
}

test('v2 retains baseline map and low-low-high-high tide, explicitly adds raft level', () => {
  assert.deepEqual(Object.keys(levels), ['baseline', 'raft']);
  assert.deepEqual(levels.baseline.tiles, ['DDDDDDDD', 'DLLLLLLD', 'DLDDDDLD', 'DLLSSLLD', 'DLDDDDLD', 'DDDDDDDD']);
  assert.equal(levels.baseline.tiles.length, 6);
  assert.ok(levels.baseline.tiles.every(row => row.length === 8));
  assert.deepEqual(Array.from({ length: 8 }, (_, i) => getTide(i)), ['low', 'low', 'high', 'high', 'low', 'low', 'high', 'high']);
  assert.equal(newGame().schemaVersion, 2);
  assert.equal(newGame().raftAvailable, false);
  assert.equal(newGame().raftActive, false);
  assert.equal(newGame('raft').raftAvailable, true);
  assert.equal(newGame('raft').raftActive, false);
});

test('moves collect mail without mutating old snapshots', () => {
  const state = Object.freeze(newGame());
  const next = transition(state, 'right');
  assert.equal(next.x, 2);
  assert.equal(next.turn, 1);
  assert.equal(next.hasMail, true);
  assert.equal(state.hasMail, false);
  assert.equal(state.turn, 0);
});

test('deep water and out-of-board directions never spend turns', () => {
  const state = newGame();
  const blocked = transition(state, 'left');
  assert.deepEqual(blocked, state);
  assert.notEqual(blocked, state);
  assert.deepEqual(transition(transition(state, 'right'), 'up'), transition(state, 'right'));
});

test('entering shallow water on rising tide loses immediately', () => {
  const lost = play(['right', 'right']);
  assert.equal(lost.turn, 2);
  assert.equal(lost.status, 'lost');
  assert.deepEqual(transition(lost, 'left'), lost);
  assert.deepEqual(transition(lost, 'wait'), lost);
});

test('waiting in shallow water also checks new tide', () => {
  const shallow = play(['right', 'wait', 'wait', 'right', 'wait']);
  assert.equal(shallow.turn, 5);
  assert.equal(shallow.status, 'playing');
  assert.equal(transition(shallow, 'wait').status, 'lost');
});

test('finite BFS proves both short timed route and longer safe land route', () => {
  const short = solve('baseline');
  const safe = solve('baseline', true);
  assert.ok(short && safe);
  assert.equal(short.path.length, 7);
  assert.equal(safe.path.length, 11);
  assert.ok(short.visited <= 8 * 6 * 4 * 2);
  assert.ok(safe.visited <= 8 * 6 * 4 * 2);
  assert.deepEqual(play(short.path), short.state);
  assert.deepEqual(transition(short.state, 'left'), short.state);
});

test('restart clears mail and turns after win, loss and active play', () => {
  for (const state of [solve('baseline').state, play(['right', 'right']), play(['right'])]) {
    assert.deepEqual(transition(state, 'restart'), newGame());
  }
});

test('v2 save round trips and does not share object identity', () => {
  const state = play(['right']);
  const saved = saveGame(state);
  assert.equal(JSON.parse(saved).schemaVersion, 2);
  assert.deepEqual(loadGame(saved), state);
  assert.deepEqual(loadGame(state), state);
  assert.notEqual(loadGame(state), state);
  assert.deepEqual(loadGame(saveGame(solve('baseline').state)), solve('baseline').state);
  assert.deepEqual(loadGame(saveGame(play(['right', 'right']))), play(['right', 'right']));
});

test('invalid and missing input fails rather than silently repairing saves', () => {
  for (const bad of [undefined, null, [], '{', '{}', { ...newGame(), schemaVersion: 3 },
    { ...newGame(), x: 0 }, { ...newGame(), y: -1 }, { ...newGame(), x: 1.5 },
    { ...newGame(), turn: -1 }, { ...newGame(), turn: Infinity },
    { ...newGame(), hasMail: 1 }, { ...newGame(), status: 'won' },
    { ...newGame(), status: 'lost' }, { ...newGame(), levelId: '__proto__' },
    { ...newGame(), extra: true }, { ...newGame(), x: 2 }]) assert.throws(() => loadGame(bad));
  assert.throws(() => saveGame(null));
  assert.throws(() => transition(undefined, 'wait'));
  assert.throws(() => transition(newGame(), 'jump'));
  assert.throws(() => transition(newGame(), {}), TypeError);
  assert.throws(() => transition(newGame(), undefined), TypeError);
  assert.throws(() => newGame('unknown'));
  assert.throws(() => getTide(NaN));
  assert.throws(() => transition({ ...newGame(), turn: Number.MAX_SAFE_INTEGER }, 'wait'));
});

test('real frozen v1 save migrates without granting a raft and still wins', () => {
  const migrated = loadGame(legacySave);
  assert.deepEqual(migrated, play(['right']));
  assert.equal(migrated.raftAvailable, false);
  assert.equal(migrated.raftActive, false);
  assert.equal(play(['wait', 'wait', 'right', 'right', 'right', 'right'], migrated).status, 'won');
  assert.deepEqual(loadGame(saveGame(migrated)), migrated);
  assert.equal(JSON.parse(legacySave).schemaVersion, 1);
});

test('raft crosses continuous shallows, remains active at low tide, then consumes on land', () => {
  const start = newGame('raft');
  const active = play(['right', 'right'], start);
  assert.equal(active.status, 'playing');
  assert.equal(active.raftAvailable, true);
  assert.equal(active.raftActive, true);
  const secondTile = transition(active, 'right');
  assert.equal(secondTile.x, 4);
  assert.equal(secondTile.raftActive, true);
  const lowWater = transition(secondTile, 'wait');
  assert.equal(getTide(lowWater.turn), 'low');
  assert.equal(lowWater.raftActive, true);
  const landed = transition(lowWater, 'right');
  assert.equal(landed.raftAvailable, false);
  assert.equal(landed.raftActive, false);
  assert.equal(transition(landed, 'left').status, 'lost');
  assert.equal(active.raftActive, true); // Previous snapshot was not changed.
  assert.deepEqual(loadGame(saveGame(active)), active);
});

test('folded raft only deploys when a legal action leaves its carrier in high shallows', () => {
  const lowEntry = play(['right', 'wait', 'wait', 'right'], newGame('raft'));
  assert.equal(getTide(lowEntry.turn), 'low');
  assert.equal(lowEntry.raftActive, false);
  assert.equal(lowEntry.raftAvailable, true);
  const lowWait = transition(lowEntry, 'wait');
  assert.equal(lowWait.raftActive, false);
  const highWait = transition(lowWait, 'wait');
  assert.equal(highWait.raftActive, true);
  assert.equal(highWait.status, 'playing');
  const backOnLand = transition(lowEntry, 'left');
  assert.equal(backOnLand.raftAvailable, true); // No deployment: nothing consumed.
  assert.equal(backOnLand.raftActive, false);
});

test('raft never permits deep water, blocked moves do not change tide or deployment', () => {
  for (const state of [newGame('raft'), play(['right', 'right'], newGame('raft'))]) {
    const action = state.x === 1 ? 'left' : 'up';
    assert.deepEqual(transition(state, action), state);
  }
});

test('raft win, death, carried and active states restart to explicit level defaults', () => {
  const win = play(['right', 'right', 'right', 'right', 'right'], newGame('raft'));
  assert.equal(win.status, 'won');
  assert.deepEqual(transition(win, 'wait'), win);
  const consumed = play(['right', 'right', 'right', 'right'], newGame('raft'));
  const death = play(['wait', 'left'], consumed);
  assert.equal(death.status, 'lost');
  assert.deepEqual(transition(death, 'right'), death);
  for (const state of [win, death, newGame('raft'), play(['right', 'right'], newGame('raft'))]) {
    assert.deepEqual(transition(state, 'restart'), newGame('raft'));
    assert.deepEqual(loadGame(saveGame(state)), state);
  }
});

test('finite BFS proves raft route in five actions and preserves eleven-action land alternative', () => {
  const fast = solve('raft');
  const safe = solve('raft', true);
  assert.ok(fast && safe);
  assert.equal(fast.path.length, 5);
  assert.equal(safe.path.length, 11);
  assert.ok(fast.visited <= 8 * 6 * 4 * 2 * 3);
  assert.equal(fast.state.raftAvailable, false);
  assert.equal(safe.state.raftAvailable, true);
});

test('reject malformed raft flags, impossible combinations and forged legacy fields', () => {
  const active = play(['right', 'right'], newGame('raft'));
  const legacy = JSON.parse(legacySave);
  const missingFlag = newGame('raft');
  delete missingFlag.raftActive;
  for (const bad of [
    missingFlag, { ...newGame('raft'), raftAvailable: 1 }, { ...newGame('raft'), raftActive: 'false' },
    { ...newGame(), raftAvailable: true }, { ...newGame('raft'), raftActive: true },
    { ...active, raftAvailable: false }, { ...active, raftActive: false },
    { ...active, status: 'lost' }, { ...legacy, levelId: 'raft' },
    { ...legacy, raftAvailable: false }, { ...legacy, raftActive: false },
  ]) assert.throws(() => loadGame(bad));
});

test('level IDs cannot coerce non-string inputs into valid names', () => {
  for (const levelId of [['baseline'], new String('baseline'), { toString: () => 'baseline' }, null, 0]) {
    assert.throws(() => newGame(levelId));
    assert.throws(() => loadGame({ ...newGame(), levelId }));
  }
});
