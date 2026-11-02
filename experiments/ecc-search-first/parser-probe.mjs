// Fixed upstream, extracted pure function only; no installation or transport.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';

const commit = '4fe3d9cc5db17367e9e645ee05f707daf154267e';
const path = 'core/mcp/node/config.ts';
const sourceHash = '87973b193a3251ed824c65461854fdbddedf5818c56489d2738f464b19a5af23';
const repo = process.argv[2];
if (!repo || process.argv.length !== 3) {
  console.error('Usage: node parser-probe.mjs <existing-Inspector-clone>');
  process.exit(2);
}

try {
  const source = execFileSync('git', ['--no-lazy-fetch', '-C', repo, 'show', `${commit}:${path}`], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 10000,
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_NO_REPLACE_OBJECTS: '1', GIT_TERMINAL_PROMPT: '0' },
  });
  if (createHash('sha256').update(source).digest('hex') !== sourceHash) {
    throw new Error('Fixed source hash mismatch');
  }
  // Delimiters are specific to the verified source, not a general TS parser.
  const start = source.indexOf('export function parseKeyValuePair(');
  const end = source.indexOf('\n}\n', start);
  if (start < 0 || end < 0) throw new Error('Fixed declaration missing');
  const declaration = source.slice(start, end + 2).replace(/^export /, '');
  const js = stripTypeScriptTypes(declaration);
  const context = vm.createContext({});
  vm.runInContext(`${js}\nglobalThis.invoke = parseKeyValuePair;`, context, { timeout: 1000 });

  const values = ['1.50', '0.10', '1e3', '9007199254740993', '1e400', '-0', 'true', 'null', '{ "a": 1 }', '[1, 2]', '"quoted"', '', '  spaced  ', '城市=東京'];
  const cases = [
    ...values.map(value => ({ id: `value:${JSON.stringify(value)}`, args: [`price=${value}`], expected: { price: value } })),
    { id: 'repeat_key_and_equals', args: ['price=first', 'state=sentinel', 'price=a=b=c'], expected: { price: 'a=b=c', state: 'sentinel' } },
    { id: 'missing_separator', args: ['missing-separator'], rejects: true },
    { id: 'empty_key', args: ['=empty-key'], rejects: true },
  ];
  const observations = cases.map(test => {
    let actual = {}, error = null;
    try {
      for (const input of test.args) {
        context.input = input;
        context.previous = actual;
        actual = vm.runInContext('invoke(input, previous)', context, { timeout: 1000 });
      }
    } catch (e) { error = String(e.message); }
    const pass = test.rejects ? error !== null : error === null && JSON.stringify(actual) === JSON.stringify(test.expected);
    return { ...test, actual: error ? null : actual, error, pass };
  });
  const mismatches = observations.filter(item => !item.pass).map(item => item.id);
  console.log(JSON.stringify({
    node: process.version, commit, path, source_sha256: sourceHash,
    scope: 'Extracted upstream environment parser against prompt-string requirements; not module, CLI, wire or model validation.',
    total: observations.length, passed: observations.length - mismatches.length, mismatches, observations,
  }, null, 2));
  // Success means the documented one-case incompatibility was reproduced.
  if (JSON.stringify(mismatches) !== JSON.stringify(['value:""'])) process.exitCode = 1;
} catch {
  console.error('Probe input unavailable or incompatible; no fetch/install attempted. Require the fixed Git object, Node 24 and Git supporting --no-lazy-fetch.');
  process.exitCode = 2;
}
