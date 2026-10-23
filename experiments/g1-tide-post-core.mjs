// Offline, dependency-free rules. No model, engine, assets or telemetry.
const tiles = Object.freeze([
  'DDDDDDDD',
  'DLLLLLLD',
  'DLDDDDLD',
  'DLLSSLLD',
  'DLDDDDLD',
  'DDDDDDDD',
]);
const point = (x, y) => Object.freeze({ x, y });
const makeLevel = (id, initialRaft) => Object.freeze({
  id, width: 8, height: 6, tiles, initialRaft,
  start: point(1, 3), mail: point(2, 3), lighthouse: point(6, 3),
});
export const levels = Object.freeze({
  baseline: makeLevel('baseline', false),
  raft: makeLevel('raft', true),
});
const actions = Object.freeze({ up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0], wait: [0, 0] });
const keys = ['schemaVersion', 'levelId', 'x', 'y', 'turn', 'hasMail', 'raftAvailable', 'raftActive', 'status'];
export function getTide(turn) {
  if (!Number.isSafeInteger(turn) || turn < 0) throw new Error('Invalid turn');
  return turn % 4 < 2 ? 'low' : 'high';
}
const at = (state, p) => state.x === p.x && state.y === p.y;
function validate(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) throw new Error('Invalid state');
  if (Object.keys(state).length !== keys.length || keys.some(k => !Object.hasOwn(state, k))) throw new Error('Invalid state fields');
  if (state.schemaVersion !== 2 || typeof state.levelId !== 'string' || !Object.hasOwn(levels, state.levelId)) throw new Error('Invalid schema or level');
  const level = levels[state.levelId];
  if (!Number.isInteger(state.x) || !Number.isInteger(state.y) || state.x < 0 || state.y < 0 || state.x >= level.width || state.y >= level.height) throw new Error('Invalid position');
  const tile = level.tiles[state.y][state.x];
  if (tile === 'D') throw new Error('Deep water state');
  const tide = getTide(state.turn);
  for (const k of ['hasMail', 'raftAvailable', 'raftActive']) if (typeof state[k] !== 'boolean') throw new Error('Invalid flag');
  if (!['playing', 'won', 'lost'].includes(state.status)) throw new Error('Invalid status');
  if (!level.initialRaft && (state.raftAvailable || state.raftActive)) throw new Error('Baseline cannot have raft');
  if (state.raftActive && (!state.raftAvailable || tile !== 'S')) throw new Error('Invalid active raft');
  if (tile === 'S' && tide === 'high' && state.raftAvailable && !state.raftActive) throw new Error('Raft must deploy in high tide');
  const drowned = tile === 'S' && tide === 'high' && !state.raftActive;
  if (drowned !== (state.status === 'lost')) throw new Error('Inconsistent loss');
  const delivered = state.hasMail && at(state, level.lighthouse);
  if (delivered !== (state.status === 'won')) throw new Error('Inconsistent delivery');
  if (at(state, level.mail) && !state.hasMail) throw new Error('Uncollected mail');
  return { ...state };
}
export function newGame(levelId = 'baseline') {
  if (typeof levelId !== 'string' || !Object.hasOwn(levels, levelId)) throw new Error('Unknown level');
  const level = levels[levelId];
  return { schemaVersion: 2, levelId, ...level.start, turn: 0, hasMail: false,
    raftAvailable: level.initialRaft, raftActive: false,
    status: 'playing' };
}
export function transition(state, action) {
  const next = validate(state);
  if (typeof action !== 'string') throw new TypeError('Action must be a string');
  if (action === 'restart') return newGame(next.levelId);
  if (!Object.hasOwn(actions, action)) throw new Error('Unknown action');
  if (next.status !== 'playing') return next;
  const [dx, dy] = actions[action];
  const level = levels[next.levelId];
  const x = next.x + dx, y = next.y + dy;
  const tile = level.tiles[y]?.[x];
  if (!tile || tile === 'D') return next;
  if (next.turn === Number.MAX_SAFE_INTEGER) throw new Error('Turn overflow');
  next.x = x; next.y = y; next.turn += 1;
  // Carry the folded raft through low water; deploy when the new tide is high.
  // Once deployed it stays active across contiguous shallows, even at low tide.
  // Landing consumes the entire crossing, not each individual shallow tile.
  if (tile === 'S' && getTide(next.turn) === 'high' && next.raftAvailable) next.raftActive = true;
  if (tile === 'L' && next.raftActive) {
    next.raftAvailable = false;
    next.raftActive = false;
  }
  if (tile === 'S' && getTide(next.turn) === 'high' && !next.raftActive) next.status = 'lost';
  if (next.status === 'playing' && at(next, level.mail)) next.hasMail = true;
  if (next.status === 'playing' && next.hasMail && at(next, level.lighthouse)) next.status = 'won';
  return validate(next);
}
export function saveGame(state) { return JSON.stringify(validate(state)); }
export function loadGame(input) {
  const source = typeof input === 'string' ? JSON.parse(input) : input;
  if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('Invalid save');
  let state = { ...source };
  if (state.schemaVersion === 1) {
    // Version 1 only shipped baseline; new mechanics must not be smuggled in.
    if (state.levelId !== 'baseline' || Object.hasOwn(state, 'raftAvailable') || Object.hasOwn(state, 'raftActive')) throw new Error('Invalid legacy save');
    state = { ...state, schemaVersion: 2, raftAvailable: false, raftActive: false };
  }
  return validate(state);
}
