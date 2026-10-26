// Resolve the fixed MOBA source's existing tsx loader rather than copy its TS code.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const mode = process.argv[2];
if (!['demo', 'test'].includes(mode)) throw new Error('usage: node run.mjs demo|test');
if (!process.env.MOBA_SOURCE) throw new Error('set MOBA_SOURCE to the clean fixed checkout from ../server-lockstep/README.md');
const source = resolve(process.env.MOBA_SOURCE);
const loader = createRequire(resolve(source, 'package.json')).resolve('tsx');
const target = fileURLToPath(new URL(mode === 'demo' ? './demo.mjs' : './test.mjs', import.meta.url));
const child = spawn(process.execPath, ['--import', loader, ...(mode === 'test' ? ['--test', '--test-concurrency=1'] : []), target],
  { cwd: source, env: { ...process.env, MOBA_SOURCE: source }, stdio: 'inherit' });
const interrupt = () => child.kill('SIGTERM');
process.once('SIGINT', interrupt); process.once('SIGTERM', interrupt);
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', (code, signal) => { process.off('SIGINT', interrupt); process.off('SIGTERM', interrupt); process.exitCode = code ?? (signal ? 130 : 1); });
