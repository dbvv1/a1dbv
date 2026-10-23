'use strict';
// Isolated, engine-free inkjs probe. Dependency directory is supplied by the caller.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const dependencyRoot = path.resolve(process.argv[2] || '.');
const externalRequire = createRequire(path.join(dependencyRoot, 'package.json'));
const { Compiler, Story } = externalRequire('inkjs/full');
const pkg = JSON.parse(fs.readFileSync(path.join(dependencyRoot, 'node_modules/inkjs/package.json'), 'utf8'));
assert.equal(pkg.version, '2.4.0', 'This receipt applies only to inkjs 2.4.0');
const source = fs.readFileSync(path.join(__dirname, 'game_adventure_state.ink'), 'utf8');
const compiled = new Compiler(source).Compile().ToJson();
const checks = [];
const controls = [];
function check(name, fn) { fn(); checks.push({ name, passed: true }); }
function bind(code, world, commits = []) {
  const story = new Story(code);
  story.BindExternalFunction('has_item', () => world.items > 0, true);
  story.BindExternalFunction('is_done', () => world.done, true);
  story.BindExternalFunction('is_accepted', () => world.accepted, true);
  story.BindExternalFunction('accept', () => { world.accepted = true; });
  story.BindExternalFunction('deliver', () => {
    if (world.done || !world.accepted || world.items < 1) return false;
    world.items--; world.done = true; world.reward++;
    commits.push('archive.seal'); // Diagnostic only: not a persistence layer.
    return true;
  });
  return { story, world, commits };
}
const fresh = (patch = {}, code = compiled) => bind(code, { items: 0, accepted: false, done: false, reward: 0, ...patch });
function drain(s) { let text = ''; while (s.story.canContinue) text += s.story.Continue(); return text; }
function choose(s, text) {
  const choice = s.story.currentChoices.find(c => c.text === text);
  assert.ok(choice, `Missing choice: ${text}`);
  s.story.ChooseChoiceIndex(choice.index);
}
// JSON serialization is a coherent in-memory snapshot, not a crash-safe file write.
function save(s) { return JSON.stringify({ schema: 1, content: 'gate-v1', world: s.world, ink: s.story.state.ToJson() }); }
function load(text, code = compiled, commits = []) {
  const x = JSON.parse(text);
  const s = bind(code, x.world, commits);
  s.story.state.LoadJson(x.ink);
  return s;
}
function revisit(s) { s.story.ChoosePathString('npc'); return drain(s); }
let a = fresh({ items: 1 }); drain(a); choose(a, 'Accept'); drain(a);
check('pre-collected item requires no second pickup', () => assert.ok(a.story.currentChoices.some(c => c.text === 'Deliver')));
const atOffer = save(a);
let b = load(atOffer);
check('outstanding choices survive restore', () => assert.deepEqual(b.story.currentChoices.map(x => x.text), ['Deliver', 'Leave']));
choose(b, 'Deliver'); b = load(save(b)); drain(b);
check('selection-before-Continue restore commits once', () => assert.deepEqual(b.world, { items: 0, accepted: true, done: true, reward: 1 }));
let c = load(save(b));
check('completed revisit after restore does not reaward', () => { assert.match(revisit(c), /archive is open/); assert.equal(c.world.reward, 1); assert.equal(c.story.currentChoices.length, 0); });
let d = load(atOffer); d.world.items = 0; choose(d, 'Deliver'); const stale = drain(d);
check('commit rechecks item removed after option display', () => { assert.match(stale, /no longer/); assert.equal(d.world.done, false); assert.equal(d.world.reward, 0); });
d.world.items = 1; revisit(d);
check('failed delivery can be retried after item returns', () => assert.ok(d.story.currentChoices.some(c => c.text === 'Deliver')));
let e = fresh(); drain(e); choose(e, 'Leave'); drain(e);
check('leave before acceptance does not accept quest', () => assert.equal(e.world.accepted, false));
let f = fresh({ accepted: true }); drain(f);
check('missing current item does not complete quest', () => { assert.equal(f.story.currentChoices.length, 0); assert.equal(f.world.done, false); assert.equal(f.world.reward, 0); });
check('repeated query/revisit leaves world unchanged', () => {
  const q = fresh({ items: 1, accepted: true }); const before = JSON.stringify(q.world);
  for (let i = 0; i < 20; i++) revisit(q);
  assert.equal(JSON.stringify(q.world), before);
});
const revised = new Compiler(source.replace('Hand it over?', 'The archive now accepts this seal. Hand it over?')).Compile().ToJson();
const r = load(atOffer, revised); choose(r, 'Deliver'); drain(r);
check('text-only revision resumes this saved choice', () => assert.equal(r.world.reward, 1));
check('missing save input rejects', () => assert.throws(() => load('')));
check('invalid ink fails compilation', () => assert.throws(() => new Compiler('-> missing_knot').Compile()));

// Negative control 1: choosing a once-only option is not a successful world commit.
const onceCode = new Compiler(source.replaceAll('+ [', '* [')).Compile().ToJson();
const once = fresh({ items: 1, accepted: true }, onceCode); drain(once); once.world.items = 0;
choose(once, 'Deliver'); drain(once); once.world.items = 1; revisit(once);
assert.equal(once.world.done, false);
assert.equal(once.story.currentChoices.some(c => c.text === 'Deliver'), false);
controls.push({ name: 'once-only choice consumes failed delivery', observed: true, authoring_error_not_library_bug: true });

// Negative control 2: mix current story with old world; count successful callbacks.
const mixed = fresh({ items: 1, accepted: true }); drain(mixed);
const oldWorld = structuredClone(mixed.world); choose(mixed, 'Deliver'); drain(mixed);
const split = JSON.parse(save(mixed)); split.world = oldWorld;
const broken = load(JSON.stringify(split), compiled, mixed.commits);
revisit(broken); choose(broken, 'Deliver'); drain(broken);
assert.deepEqual(mixed.commits, ['archive.seal', 'archive.seal']);
controls.push({ name: 'split snapshot permits same quest commit callback twice', successful_callbacks: mixed.commits.length, persistent_external_reward_tested: false });

// Negative control 3: content path compatibility must be tested, not assumed.
const renamed = new Compiler(source.replaceAll('deliver_offer', 'handover_v2')).Compile().ToJson();
let renameError = null;
try {
  const s = load(atOffer, renamed);
  choose(s, 'Deliver'); drain(s);
} catch (error) { renameError = String(error); }
assert.match(renameError || '', /Failed to find content at path/);
controls.push({ name: 'renamed node rejects this old save', error: renameError });

console.log(JSON.stringify({
  runtime: `inkjs@${pkg.version}`, source_tag: 'v2.4.0',
  source_commit: 'edccead8700e9f21be9825d87d8645d8c82a9936', license: pkg.license,
  node: process.version, checks, negative_controls: controls,
  scope: 'Compiler and JS runtime, synthetic world; no engine, player, C# equivalence or disk-crash test'
}, null, 2));
