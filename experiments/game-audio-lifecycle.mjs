// A deliberately small policy fixture, not a game audio manager.
// No assets, network, devices, timers, engine APIs, or listening claims.
export const events = [
  { t: 0, type: 'user', gain: 0.5 },
  { t: 0.25, type: 'begin', id: 'dialogue:A:1', gain: 0.5 },
  { t: 0.5, type: 'begin', id: 'warning:B:1', gain: 0.25 },
  { t: 0.75, type: 'end', id: 'dialogue:A:1' },
  { t: 1, type: 'user', gain: 0.8 },
  { t: 1.25, type: 'end', id: 'dialogue:A:1' },
  { t: 1.5, type: 'begin', id: 'dialogue:A:2', gain: 0.5 },
  { t: 1.75, type: 'end', id: 'warning:B:1' },
  { t: 2, type: 'end', id: 'dialogue:A:1' },
  { t: 2.25, type: 'end', id: 'dialogue:A:2' },
  { t: 2.5, type: 'begin', id: 'loop:C:1', gain: 0.25 },
  { t: 2.75, type: 'clear' },
];

const expected = [0.5, 0.25, 0.125, 0.125, 0.2, 0.2, 0.2, 0.4, 0.4, 0.8, 0.2, 0.8];
const close = (a, b) => Math.abs(a - b) < 1e-6;
const assert = (ok, message) => { if (!ok) throw new Error(message); };

function apply(state, event) {
  if (!event || !['user', 'begin', 'end', 'clear'].includes(event.type)) {
    throw new Error('Unknown or missing event');
  }
  if (['begin', 'end'].includes(event.type) &&
      (typeof event.id !== 'string' || !event.id)) throw new Error('Missing instance ID');
  if (['user', 'begin'].includes(event.type) &&
      (!Number.isFinite(event.gain) || event.gain < 0 || event.gain > 1)) {
    throw new Error('Gain must be finite and within [0, 1]');
  }
  if (event.type === 'user') state.user = event.gain;
  // A duplicate begin for this exact instance does not allocate again.
  if (event.type === 'begin' && !state.active.has(event.id)) state.active.set(event.id, event.gain);
  if (event.type === 'end') state.active.delete(event.id);
  if (event.type === 'clear') state.active.clear();
  // Example policy: strongest active reduction wins; reductions do NOT stack.
  const focus = Math.min(1, ...state.active.values());
  return { user: state.user, focus, output: state.user * focus, active: [...state.active.keys()] };
}

export function runControlCases() {
  const state = { user: 1, active: new Map() };
  let naive = 1;
  const saved = new Map();
  const trace = events.map((event, index) => {
    const value = apply(state, event);
    // Intentionally broken: one fader, save on begin, restore on end.
    if (event.type === 'user') naive = event.gain;
    if (event.type === 'begin') {
      saved.set(event.id, naive);
      naive = state.user * event.gain;
    }
    if (event.type === 'end' && saved.has(event.id)) {
      naive = saved.get(event.id);
      saved.delete(event.id);
    }
    if (event.type === 'clear') { saved.clear(); naive = state.user; }
    assert(close(value.output, expected[index]), `Control mismatch at ${event.t}`);
    return { ...event, ...value, naive, expected: expected[index] };
  });
  assert(!close(trace[3].naive, trace[3].expected), 'Counterexample: A ends before B');
  assert(!close(trace[4].naive, trace[4].expected), 'Counterexample: user changes gain');
  assert(state.active.size === 0, 'Scene cleanup left an active request');

  let invalidRejected = 0;
  for (const bad of [undefined, {}, { type: 'begin', gain: 0.5 },
    { type: 'user', gain: NaN }, { type: 'begin', id: 'bad', gain: -1 }]) {
    try { apply(state, bad); } catch { invalidRejected++; }
  }
  assert(invalidRejected === 5, 'Invalid input was accepted');
  assert(state.active.size === 0 && state.user === 0.8, 'Invalid input mutated state');
  apply(state, { type: 'begin', id: 'repeat:1', gain: 0.5 });
  apply(state, { type: 'begin', id: 'repeat:1', gain: 0.5 });
  assert(state.active.size === 1, 'Duplicate begin allocated twice');
  apply(state, { type: 'end', id: 'repeat:1' });
  assert(state.active.size === 0, 'Duplicate begin requires a second end');
  return { control: 'PASS', invalidRejected, trace };
}

export async function renderOffline(OfflineContext) {
  const control = runControlCases();
  const sampleRate = 48000;
  const context = new OfflineContext(2, sampleRate * 3, sampleRate);
  // A constant synthetic buffer makes gain arithmetic observable, not listenable.
  const buffer = context.createBuffer(1, 480, sampleRate);
  buffer.getChannelData(0).fill(0.1);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const user = context.createGain();
  const focus = context.createGain();
  const broken = context.createGain();
  const merger = context.createChannelMerger(2);
  source.connect(user).connect(focus).connect(merger, 0, 0);
  source.connect(broken).connect(merger, 0, 1);
  merger.connect(context.destination);
  for (const row of control.trace) {
    user.gain.setValueAtTime(row.user, row.t);
    focus.gain.setValueAtTime(row.focus, row.t);
    broken.gain.setValueAtTime(row.naive, row.t);
  }
  source.start(0);
  source.stop(3);
  const output = await context.startRendering();
  const measurements = control.trace.map(row => {
    const frame = Math.round((row.t + 0.1) * sampleRate);
    const actual = output.getChannelData(0)[frame];
    const naive = output.getChannelData(1)[frame];
    assert(close(actual, row.expected * 0.1), `Offline mismatch at ${row.t}`);
    assert(close(naive, row.naive * 0.1), `Broken-path render mismatch at ${row.t}`);
    return { t: row.t, expected: row.expected * 0.1, actual, naive };
  });
  source.disconnect(); user.disconnect(); focus.disconnect(); broken.disconnect(); merger.disconnect();
  return { control: control.control, offline: 'PASS', sampleRate, channels: 2,
    frames: output.length, checkpoints: measurements.length,
    invalidRejected: control.invalidRejected, measurements,
    scope: 'Synthetic control and OfflineAudioContext render only; no listening or engine validation.' };
}

if (typeof process !== 'undefined' && process.versions?.node) {
  console.log(JSON.stringify(runControlCases(), null, 2));
}
