// Run from a1dbv: node experiments/local-race-save/probe-star.mjs <Star checkout>
// Evaluates the real fixed finish/render consumers with the documented wiring
// applied in memory. No case files, browser, build output or storage are modified.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {createLocalRaceSave, localRaceSaveMessage} from './local-race-save.mjs';

const checkout = process.argv[2];
if (!checkout) throw Error('Pass a readable Star-Rush-Reborn checkout');
const revision = '997d0a83b1d25adff9fff2f71826486d21d4df97';
const read = file => execFileSync('git', ['-C', checkout, 'show', revision + ':' + file], {encoding: 'utf8'});
const between = (source, begin, end) => {
  const a = source.indexOf(begin), b = source.indexOf(end, a + begin.length);
  assert(a >= 0 && b > a, 'fixed source boundary changed'); return source.slice(a, b);
};
const replaceOnce = (source, before, after) => {
  assert.equal(source.split(before).length, 2, 'fixed source seam changed'); return source.replace(before, after);
};
const features = read('race-features.js');
const originalFinish = between(read('race.js'), 'function finish(){', 'function emit(');
const originalComplete = between(features, 'function completeRaceFeatures(){', '// Shared renderer cue:');
let finish = originalFinish;
finish = replaceOnce(finish, 'if(!raceDNF)saveLocalRun(pendingRun)', `receipt=raceSave.finish({
  run:pendingRun,name:profile.name,dnf:raceDNF,
  ghost:!net.room&&raceMode==='circuit'&&ghostPoints.length>10
    ?{time:raceClock(),points:ghostPoints,splits:raceSplits,laps:lapTimes,date:Date.now()}:null
})`);
finish = replaceOnce(finish, 'tone(1100,.3);', "$('resultNote').textContent+=' '+localRaceSaveMessage(receipt);tone(1100,.3);");
finish = replaceOnce(finish, '公路成绩与幽灵仅保存在本机，不参与旧版街机在线榜单。', '公路记录不参与旧版街机在线榜单。');
let complete = originalComplete;
const oldGhostWrite = complete.split('\n').find(line => line.startsWith(' else if(!net.room&&raceMode'));
assert(oldGhostWrite?.includes('localStorage.setItem'));
complete = replaceOnce(complete, oldGhostWrite, '');
const render = between(features, 'function renderRaceFeatures(', 'let frameDurations=');
const runsKey = 'star-rush-runs-road-v2', ghostKey = 'star-rush-best-reborn-road-v2-coast-reborn';
const ghost = {time: 140, points: [[0, 0, 0, 0, 0], [130, 4800, 0, 0, 0]], splits: [40, 80, 140], laps: [140], date: 1};
const run = {id: 'previous', mode: 'circuit', track: 'coast-reborn', seed: 73121, distance: 4800, timeMs: 140000, score: 0, name: 'Driver'};
const reports = [];
let counterexample;
for (const scenario of ['normal', 'record-fails', 'ghost-fails', 'both-fail', 'dnf']) {
  const data = new Map([[runsKey, JSON.stringify([run])], [ghostKey, JSON.stringify(ghost)],
    ['star-rush-runs-reborn', 'legacy untouched'], ['star-rush-runs-road-v1', 'v1 untouched']]);
  const storage = {getItem: key => data.get(key) ?? null, setItem(key, value) {
    if ((scenario === 'record-fails' || scenario === 'both-fail') && key === runsKey ||
        (scenario === 'ghost-fails' || scenario === 'both-fail') && key === ghostKey) throw Error('quota');
    data.set(key, value);
  }};
  const raceSave = createLocalRaceSave({storage: () => storage, roadDriving: true, trackIds: ['coast-reborn']});
  const nodes = new Map(), $ = id => {
    if (!nodes.has(id)) nodes.set(id, {textContent: '', classList: {add() {}}}); return nodes.get(id);
  };
  const context = {raceSave, localRaceSaveMessage, receipt: null, $, state: 'running', clearKeys() {},
    highScore: 0, bestScore: 0, player: {s: 4800, score: 0, coins: 0}, localStorage: storage,
    roadDriving: true, drivingRevision: 'road-v2', raceMode: 'circuit', raceClock: () => 120,
    formatTime: String, trackInfo: () => ({laps: 1}), game: {classList: {add() {}}},
    pendingRun: null, crypto: {randomUUID: () => 'new-result'}, CIRCUIT_ID: 'coast-reborn', routeSeed: 73121,
    raceDNF: scenario === 'dnf', profile: {name: 'Driver'}, net: {room: null},
    ghostPoints: Array.from({length: 12}, (_, i) => [i * 10, i * 400, 0, 0, 0]), raceSplits: [40, 80, 120], lapTimes: [120],
    demoDriving: true, drawRaceResults() {}, updateLocalPosition() {}, tone() {},
  };
  vm.createContext(context); vm.runInContext(finish + '\n' + complete, context);
  context.finish();
  assert.equal(context.state, 'finished'); assert.equal(context.pendingRun, null, 'road upload remains disabled');
  assert.equal($('submitRun').disabled, true);
  const recordSaved = ['normal', 'ghost-fails'].includes(scenario), ghostSaved = ['normal', 'record-fails'].includes(scenario);
  assert.equal(raceSave.readRuns().value.length, recordSaved ? 2 : 1);
  assert.equal(raceSave.readGhost('coast-reborn').value.time, ghostSaved ? 120 : 140);
  if (scenario.includes('fail')) assert.match($('resultNote').textContent, /未保存/);
  if (scenario === 'dnf') assert.doesNotMatch($('resultNote').textContent, /已保存/);
  const once = [...data]; context.finish(); assert.deepEqual([...data], once, 'original finish guard remains effective');
  assert.equal(data.get('star-rush-runs-reborn'), 'legacy untouched');
  assert.equal(data.get('star-rush-runs-road-v1'), 'v1 untouched');

  // A fresh module owner loads the same persisted bytes into the unchanged
  // actual ghost interpolation consumer, not just a JSON round-trip assertion.
  const fresh = createLocalRaceSave({storage: () => storage, roadDriving: true, trackIds: ['coast-reborn']});
  const renderContext = {raceBots: [], ghostPose: null, ghostNode: {}, ghostRun: fresh.readGhost('coast-reborn').value,
    state: 'running', ghostCursor: 0, raceClock: () => 5, settings: {line: false}, world: {add() {}},
    clamp: (x, a, b) => Math.max(a, Math.min(b, x)), mix: (a, b, t) => a + (b - a) * t,
    wrapAngle: x => Math.atan2(Math.sin(x), Math.cos(x)), road: () => ({h: 0}), atRoad: (s, l, y) => [s, y, l],
    sub: (a, b) => a.map((v, i) => v - b[i]), trs: position => ({position})};
  vm.createContext(renderContext); vm.runInContext(render, renderContext);
  renderContext.renderRaceFeatures([0, 0, 0], 1 / 60);
  assert(Object.values(renderContext.ghostPose).every(Number.isFinite));
  assert(Math.abs(renderContext.ghostPose.s - (ghostSaved ? 200 : 4800 * 5 / 130)) < 1e-8);
  if (scenario === 'both-fail') {
    // One regression witness from unmodified source, not a second implementation
    // or performance comparison: both writes fail but the original copy implies save.
    const originalData = new Map([[runsKey, JSON.stringify([run])], [ghostKey, JSON.stringify(ghost)]]);
    const originalNodes = new Map();
    const original = {...context, state: 'running', pendingRun: null, ghostRun: ghost,
      $: id => {if (!originalNodes.has(id)) originalNodes.set(id, {textContent: ''}); return originalNodes.get(id);},
      localStorage: {getItem: key => originalData.get(key) ?? null, setItem(key, value) {
        if ([runsKey, ghostKey].includes(key)) throw Error('quota'); originalData.set(key, value);
      }}, ghostKey: () => ghostKey};
    const ranking = read('ranking.js');
    const originalReaders = ['localRuns', 'saveLocalRun'].map(name => {
      const line = ranking.split('\n').find(value => value.startsWith('function ' + name + '('));
      assert(line, 'fixed original function missing'); return line;
    }).join('\n');
    vm.createContext(original); vm.runInContext(originalReaders + '\n' + originalFinish + '\n' + originalComplete, original);
    original.finish();
    assert.equal(originalData.get(runsKey), JSON.stringify([run]));
    assert.equal(originalData.get(ghostKey), JSON.stringify(ghost));
    counterexample = original.$('resultNote').textContent;
    assert.match(counterexample, /公路成绩与幽灵仅保存在本机/);
    assert.doesNotMatch(counterexample, /未保存|失败/);
  }
  reports.push({scenario, recordSaved, ghostSaved, text: $('resultNote').textContent});
}
console.log(JSON.stringify({revision, originalFailedWritesCopy: counterexample, scenarios: reports,
  scope: 'fixed source finish and ghost interpolation; DOM/drawing are stubs, not browser adoption'}, null, 2));
