import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = process.argv[2];
assert.ok(repo, 'Pass an existing Inspector clone containing the fixed commit');
const probe = fileURLToPath(new URL('./parser-probe.mjs', import.meta.url));
const run = args => spawnSync(process.execPath, [probe, ...args], { encoding: 'utf8', timeout: 15000 });
const missing = run([]);
assert.equal(missing.status, 2);
assert.match(missing.stderr, /Usage:/);
const invalid = run([probe]); // An existing regular file cannot be a Git directory.
assert.equal(invalid.status, 2);
assert.match(invalid.stderr, /no fetch\/install attempted/);
const actual = run([repo]);
assert.equal(actual.status, 0, actual.stderr);
const result = JSON.parse(actual.stdout);
assert.equal(result.total, 17);
assert.equal(result.passed, 16);
assert.deepEqual(result.mismatches, ['value:""']);
assert.equal(result.observations.find(item => item.id === 'missing_separator').pass, true);
assert.equal(result.observations.find(item => item.id === 'empty_key').pass, true);
console.log('3 probe regressions passed: missing input, invalid repository, fixed-source counterexample.');
