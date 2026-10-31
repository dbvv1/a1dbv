const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const path = require('node:path');
const test = require('node:test');
const {titleImplementation} = require('./run.cjs');

const roots = ['RELEASE_PLEASE_OLD_ROOT', 'RELEASE_PLEASE_NEW_ROOT', 'RELEASE_PLEASE_ACTION_ROOT']
  .map(name => {
    assert.ok(process.env[name], `Missing ${name}; these tests must not silently skip`);
    return process.env[name];
  });
const run = args => spawnSync(process.execPath, [path.join(__dirname, 'run.cjs'), ...args], {
  encoding: 'utf8', timeout: 15000,
});

test('real published modules expose the original failure and preserve the two controls', () => {
  const child = run(roots);
  assert.equal(child.status, 1, child.stderr);
  const result = JSON.parse(child.stdout);
  assert.equal(result.rows.length, 6);
  assert.equal(result.roundTripFailures, 1);
  assert.deepEqual(result.rows.map(row => row.roundTrip), [true, true, false, true, true, true]);
  assert.equal(result.rows[2].generated, 'chore: release site 7.2.0 [skip unit] [skip e2e]');
  assert.equal(result.rows[2].decoded, null);
  assert.deepEqual(result.rows[5].decoded, {component: 'site', version: '7.2.0'});
});

test('missing input fails before loading packages', () => {
  const child = run([]);
  assert.equal(child.status, 2);
  assert.match(child.stderr, /Usage:/);
});

test('wrong package version fails instead of silently testing another release', () => {
  const child = run([roots[1], roots[1], roots[2]]);
  assert.equal(child.status, 2);
  assert.match(child.stderr, /Expected release-please 17\.6\.0/);
});

test('missing or duplicate implementation markers are rejected', () => {
  assert.throws(() => titleImplementation('unrelated source'), /exactly one/);
  const body = "const DEFAULT_PR_TITLE_PATTERN = 'chore${scope}: release${component} ${version}';\nexports.PullRequestTitle = PullRequestTitle;";
  assert.equal(titleImplementation(body), body);
  assert.throws(() => titleImplementation(body + body), /exactly one/);
});
