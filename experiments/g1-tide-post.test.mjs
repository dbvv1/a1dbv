import test from 'node:test';
import assert from 'node:assert/strict';
import { levels, newGame, transition, getTide, saveGame, loadGame } from './g1-tide-post-core.mjs';

const play = (moves, state = newGame()) => moves.reduce(transition, state);
// Finite abstraction: only tide phase, position, mail and terminal status
// influence future rules. Absolute turn counts are retained for shortest paths.
function solve(levelId, landOnly = false) {
  const queue = [{ state: newGame(levelId), path: [] }];
  const seen = new Set();
  for (let i = 0; i < queue.length; i += 1) {
    const { state, path } = queue[i];
    if (state.status === 'won') return { state, path, visited: seen.size };
    if (state.status !== 'playing') continue;
    const key = [state.x, state.y, state.turn % 4, state.hasMail].join(':');
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

test('v1 level contract and low-low-high-high tide', () => {
  assert.deepEqual(Object.keys(levels), ['baseline']);
  assert.equal(levels.baseline.tiles.length, 6);
  assert.ok(levels.baseline.tiles.every(row => row.length === 8));
  assert.deepEqual(Array.from({ length: 8 }, (_, i) => getTide(i)), ['low', 'low', 'high', 'high', 'low', 'low', 'high', 'high']);
  assert.equal(newGame().schemaVersion, 1);
  assert.equal('raftAvailable' in newGame(), false);
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

test('real v1 save round trips and does not share object identity', () => {
  const state = play(['right']);
  const saved = saveGame(state);
  assert.equal(saved, '{"schemaVersion":1,"levelId":"baseline","x":2,"y":3,"turn":1,"hasMail":true,"status":"playing"}');
  assert.deepEqual(loadGame(saved), state);
  assert.deepEqual(loadGame(state), state);
  assert.notEqual(loadGame(state), state);
  assert.deepEqual(loadGame(saveGame(solve('baseline').state)), solve('baseline').state);
  assert.deepEqual(loadGame(saveGame(play(['right', 'right']))), play(['right', 'right']));
});

test('invalid and missing input fails rather than silently repairing saves', () => {
  for (const bad of [undefined, null, [], '{', '{}', { ...newGame(), schemaVersion: 2 },
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
  assert.throws(() => newGame('raft'));
  assert.throws(() => getTide(NaN));
  assert.throws(() => transition({ ...newGame(), turn: Number.MAX_SAFE_INTEGER }, 'wait'));
});

test('level IDs cannot coerce non-string inputs into valid names', () => {
  for (const levelId of [['baseline'], new String('baseline'), { toString: () => 'baseline' }, null, 0]) {
    assert.throws(() => newGame(levelId));
    assert.throws(() => loadGame({ ...newGame(), levelId }));
  }
});
