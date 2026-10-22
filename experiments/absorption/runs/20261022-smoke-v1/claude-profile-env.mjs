import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const input = process.argv.slice(2);
const separator = input.indexOf('--');
const options = new Map();
let auditFile;
let phase = 'arguments';
let child;

function saveAudit(record) {
  if (auditFile) writeFileSync(auditFile, JSON.stringify(record, null, 2) + '\n', { mode: 0o600 });
}

try {
  if (separator < 0 || separator % 2 !== 0) throw new Error('invalid_arguments');
  const allowed = new Set(['--profiles-module', '--home', '--cwd', '--audit-file']);
  for (let i = 0; i < separator; i += 2) {
    if (!allowed.has(input[i]) || options.has(input[i]) || !input[i + 1]) throw new Error('invalid_option');
    options.set(input[i], input[i + 1]);
  }
  for (const key of ['--profiles-module', '--home', '--cwd']) {
    if (!options.has(key)) throw new Error('missing_option');
  }
  auditFile = options.has('--audit-file') ? resolve(options.get('--audit-file')) : undefined;
  const [executable, ...cliArgs] = input.slice(separator + 1);
  if (!executable) throw new Error('missing_executable');
  const home = resolve(options.get('--home'));
  const cwd = resolve(options.get('--cwd'));
  mkdirSync(home, { recursive: true });
  mkdirSync(cwd, { recursive: true });
  const parentBefore = { ...process.env };

  phase = 'profile';
  const { resolveProfile, profileProcessEnv } = await import(pathToFileURL(resolve(options.get('--profiles-module'))).href);
  const binding = resolveProfile('current');
  const profileEnv = profileProcessEnv(binding, process.env);

  // Apply attempt-local paths last, including Windows and Claude config roots.
  const isolation = {
    HOME: home,
    USERPROFILE: home,
    APPDATA: join(home, 'AppData', 'Roaming'),
    LOCALAPPDATA: join(home, 'AppData', 'Local'),
    XDG_CONFIG_HOME: join(home, '.config'),
    XDG_CACHE_HOME: join(home, '.cache'),
    XDG_DATA_HOME: join(home, '.local', 'share'),
    XDG_STATE_HOME: join(home, '.local', 'state'),
    CLAUDE_CONFIG_DIR: join(home, '.claude'),
    TEMP: join(home, 'tmp'),
    TMP: join(home, 'tmp'),
    TMPDIR: join(home, 'tmp'),
    PWD: cwd,
  };
  const isolationKeys = new Set([...Object.keys(isolation), 'HOMEDRIVE', 'HOMEPATH']);
  const env = { ...profileEnv };
  for (const key of Object.keys(env)) {
    if (isolationKeys.has(key.toUpperCase())) delete env[key];
  }
  Object.assign(env, isolation);
  for (const [key, directory] of Object.entries(isolation)) {
    if (key !== 'PWD') mkdirSync(directory, { recursive: true });
  }

  const audit = {
    argvCount: cliArgs.length,
    argvVerbatim: JSON.stringify(cliArgs) === JSON.stringify(input.slice(separator + 2)),
    cwdMatchesRequested: cwd === resolve(options.get('--cwd')),
    homeMatchesRequested: env.HOME === home,
    isolationPathsAppliedLast: Object.entries(isolation).every(([key, value]) => env[key] === value),
    legacyHomePathsRemoved: !Object.keys(env).some(key => ['HOMEDRIVE', 'HOMEPATH'].includes(key.toUpperCase())),
    tmpdirMatchesAttempt: env.TMPDIR === join(home, 'tmp'),
    stateHomeMatchesAttempt: env.XDG_STATE_HOME === join(home, '.local', 'state'),
    pwdMatchesRequested: env.PWD === cwd,
    profileEnvPreserved: Object.entries(profileEnv).every(([key, value]) => isolationKeys.has(key.toUpperCase()) || env[key] === value),
    parentEnvUnchanged: JSON.stringify(process.env) === JSON.stringify(parentBefore),
    toolsEmptyPreserved: cliArgs.some((value, i) => value === '--tools' && cliArgs[i + 1] === ''),
    disallowedStarPreserved: cliArgs.some((value, i) => value === '--disallowedTools' && cliArgs[i + 1] === '*'),
    strictMcpPreserved: cliArgs.includes('--strict-mcp-config'),
    mcpConfigArgumentPreserved: cliArgs.includes('--mcp-config'),
    streamJsonPreserved: cliArgs.some((value, i) => value === '--output-format' && cliArgs[i + 1] === 'stream-json'),
    barePreserved: cliArgs.includes('--bare'),
    restrictedPreserved: cliArgs.includes('--restricted'),
    skillsDisabledPreserved: cliArgs.includes('--disable-slash-commands'),
  };

  phase = 'spawn';
  // No shell: preserve empty arguments and literal wildcards, and pass streams through.
  child = spawn(executable, cliArgs, { cwd, env, stdio: 'inherit', windowsHide: true });
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
  child.on('error', error => {
    saveAudit({ ...audit, phase, spawned: false, errorCode: error.code || 'spawn_error' });
    process.stderr.write('adapter_spawn_error\n');
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    saveAudit({ ...audit, phase: 'exited', spawned: Boolean(child.pid), exitCode: code, signaled: Boolean(signal) });
    process.exitCode = Number.isInteger(code) ? code : 1;
  });
} catch (error) {
  saveAudit({ phase, spawned: false, errorType: error.name, errorCode: error.code || null });
  process.stderr.write('adapter_setup_error:' + phase + '\n');
  process.exitCode = 1;
}
