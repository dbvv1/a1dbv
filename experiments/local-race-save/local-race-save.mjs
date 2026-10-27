// Extracted from Star-Rush-Reborn 997d0a83b1d25adff9fff2f71826486d21d4df97:
// ranking.js (last 100 runs), race-features.js (per-track fastest ghost).
// Keep those wire formats and keys. No new game/save schema or storage backend.
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const number = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const integer = value => number(value) && Number.isSafeInteger(value);
const skipped = () => ({ok: true, status: 'skipped'});
const failure = (status, key) => ({ok: false, status, key});

/** Single active writer, synchronous Web Storage. storage is lazy: its getter can throw. */
export function createLocalRaceSave({storage, roadDriving, drivingRevision = 'road-v2', trackIds}) {
  if (typeof storage !== 'function' || typeof roadDriving !== 'boolean' ||
      !/^road-v[1-9][0-9]*$/.test(drivingRevision) || !Array.isArray(trackIds) ||
      !trackIds.length || !trackIds.every(id => typeof id === 'string' && id.length > 0)) {
    throw new TypeError('Expected storage getter, driving profile and existing track IDs');
  }
  const tracks = new Set(trackIds);
  const runsKey = roadDriving ? 'star-rush-runs-' + drivingRevision : 'star-rush-runs-reborn';
  const ghostKey = track => 'star-rush-best-reborn-' + (roadDriving ? drivingRevision + '-' : '') + track;
  const validRun = run => object(run) && typeof run.id === 'string' && run.id.length > 0 &&
    (run.mode === 'circuit' && tracks.has(run.track) ||
      !roadDriving && run.mode === 'endless' && run.track === 'endless-reborn') &&
    integer(run.seed) && integer(run.distance) && integer(run.timeMs) && integer(run.score) &&
    typeof run.name === 'string';
  const validGhost = ghost => object(ghost) && number(ghost.time) && ghost.time > 0 &&
    Array.isArray(ghost.points) && ghost.points.length >= 2 &&
    ghost.points.every((point, index, all) => Array.isArray(point) && point.length === 5 &&
      point.every(value => typeof value === 'number' && Number.isFinite(value)) && point[0] >= 0 &&
      point[0] <= ghost.time + .001 && (index === 0 || point[0] > all[index - 1][0])) &&
    Array.isArray(ghost.splits) && ghost.splits.every(number) &&
    Array.isArray(ghost.laps) && ghost.laps.every(number) && number(ghost.date);

  function read(key, valid, empty) {
    let raw;
    try { raw = storage().getItem(key); }
    catch { return {...failure('read-failed', key), value: empty}; }
    if (raw === null) return {ok: true, status: 'missing', key, value: empty};
    try {
      const value = JSON.parse(raw);
      if (!valid(value)) throw new TypeError('Invalid saved value');
      return {ok: true, status: 'loaded', key, value};
    } catch { return {...failure('invalid-data', key), value: empty}; }
  }

  function write(key, value) {
    let encoded;
    try { encoded = JSON.stringify(value); }
    catch { return failure('invalid-input', key); }
    try { storage().setItem(key, encoded); }
    catch { return failure('write-failed', key); }
    // This is a successful Storage call, not a disk-flush or cross-key transaction.
    return {ok: true, status: 'saved', key};
  }

  function readRuns() {
    return read(runsKey, value => Array.isArray(value) && value.every(validRun), []);
  }

  function readGhost(track) {
    if (!tracks.has(track)) return {...failure('invalid-input'), value: null};
    return read(ghostKey(track), validGhost, null);
  }

  function appendRun(run, name) {
    const candidate = {...run, name};
    if (!validRun(candidate)) return failure('invalid-input', runsKey);
    const previous = readRuns();
    if (!previous.ok) return failure(previous.status, runsKey);
    const existing = previous.value.find(value => value.id === candidate.id);
    if (existing) {
      const same = ['mode', 'track', 'seed', 'distance', 'timeMs', 'score']
        .every(key => existing[key] === candidate[key]);
      return same ? {ok: true, status: 'already-saved', key: runsKey} : failure('id-conflict', runsKey);
    }
    // Original retention policy; never clear/delete a key to make room after failure.
    return write(runsKey, [...previous.value, candidate].slice(-100));
  }

  function saveBestGhost(track, ghost) {
    if (!tracks.has(track) || !validGhost(ghost)) return failure('invalid-input');
    const previous = readGhost(track);
    if (!previous.ok) return failure(previous.status, previous.key);
    if (previous.value && previous.value.time <= ghost.time) {
      return {ok: true, status: 'not-faster', key: previous.key};
    }
    return write(previous.key, ghost);
  }

  function finish({run, name, ghost = null, dnf = false}) {
    if (dnf) return {record: skipped(), ghost: skipped()};
    const record = appendRun(run, name);
    // Independent receipts intentionally expose partial success. Do not roll back
    // the successful key, or overwrite a prior record to pretend atomicity.
    const ghostResult = ghost === null ? skipped() : saveBestGhost(run?.track, ghost);
    return {record, ghost: ghostResult};
  }

  return Object.freeze({readRuns, readGhost, appendRun, saveBestGhost, finish});
}

/** Result-panel copy; callers must retain the receipt, not infer success from gameplay. */
export function localRaceSaveMessage(receipt) {
  const describe = (result, label) => {
    if (!result?.ok) {
      if (result?.status === 'invalid-data') return label + '未保存（现有数据异常，未覆盖）';
      if (result?.status === 'id-conflict') return label + '未保存（结果 ID 冲突，未覆盖）';
      if (result?.status === 'invalid-input') return label + '未保存（本次数据异常）';
      return label + '未保存（存储不可用，可重试；旧数据保留）';
    }
    if (result.status === 'skipped') return label + '本次不保存';
    if (result.status === 'not-faster') return '幽灵保留原最佳';
    return label + '已保存至本浏览器';
  };
  return describe(receipt.record, '成绩') + '；' + describe(receipt.ghost, '幽灵') + '。';
}
