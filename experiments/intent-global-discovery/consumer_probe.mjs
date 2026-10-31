#!/usr/bin/env node
// Fixed-version regression probe. Does not install packages or execute their skills.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';

const [cwdArg, cliArg] = process.argv.slice(2);
if (!cwdArg || !cliArg || process.argv.length !== 4) {
  console.error('Usage: node consumer_probe.mjs <prepared-project-dir> <installed-intent-cli.mjs>');
  process.exit(2);
}
const cwd = path.resolve(cwdArg);
const cli = path.resolve(cliArg);
if (!existsSync(path.join(cwd, 'package.json')) || !existsSync(cli)) {
  console.error('Missing prepared project package.json or installed Intent CLI; nothing was installed.');
  process.exit(2);
}
const env = { ...process.env };
delete env.INTENT_GLOBAL_NODE_MODULES;
const digest = (text) => createHash('sha256').update(text).digest('hex');
function run(command, args, extra = {}) {
  const result = spawnSync(command, args, {
    cwd, env: { ...env, ...extra }, encoding: 'utf8', timeout: 30000,
    maxBuffer: 8 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  assert.equal(result.signal, null, 'Command terminated by signal');
  return result;
}
function json(command, args, extra) {
  const result = run(command, args, extra);
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}
function intent(args, root) {
  return json(process.execPath, [cli, ...args], root === undefined ? {} : {
    INTENT_GLOBAL_NODE_MODULES: root,
  });
}
function counts(result) {
  return { packages: result.packages.length, skills: result.skills.length };
}
const manifest = JSON.parse(readFileSync(path.join(cwd, 'package.json'), 'utf8'));
assert.equal(manifest.packageManager, 'pnpm@11.17.0', 'Use the documented isolated pnpm project');
assert.equal(manifest.intent, undefined, 'Probe expects no allowlist/exclude policy');
const pnpmVersion = run('pnpm', ['--version']);
assert.equal(pnpmVersion.status, 0, pnpmVersion.stderr);
assert.equal(pnpmVersion.stdout.trim(), '11.17.0');
const entries = json('pnpm', ['ls', '-g', '--json', '--depth', '0']);
const wanted = new Map([['@playwright/cli', ['0.1.22', 1]], ['@tanstack/cli', ['0.70.0', 5]]]);
const consumers = [];
for (const [name, [version, skillCount]] of wanted) {
  const found = entries.flatMap((entry) => Object.entries(entry.dependencies ?? {}))
    .filter(([key]) => key === name).map(([, item]) => item);
  assert.equal(found.length, 1, `Expected one installed ${name}`);
  const item = found[0];
  const suffix = `${path.sep}node_modules${path.sep}${name.split('/').join(path.sep)}`;
  assert.equal(item.path.endsWith(suffix), true, `Unexpected package layout for ${name}`);
  const packageRoot = item.path;
  const root = packageRoot.slice(0, -name.split('/').join(path.sep).length - 1);
  const pkg = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  assert.equal(pkg.name, name);
  assert.equal(pkg.version, version);
  consumers.push({ name, version, skillCount, packageRoot, root });
}
assert.equal(new Set(consumers.map((p) => p.root)).size, 2, 'Requires two actual isolated roots');
const listArgs = ['list', '--global-only', '--json'];
const baseline = counts(intent(listArgs));
assert.deepEqual(baseline, { packages: 0, skills: 0 });
const observations = [];
for (const pkg of consumers) {
  const listed = intent(listArgs, pkg.root);
  const matched = listed.packages.find((item) => item.name === pkg.name);
  assert.ok(matched, `${pkg.name} absent from its explicit root`);
  assert.equal(matched.version, pkg.version);
  assert.equal(matched.source, 'global');
  assert.equal(matched.packageRoot, pkg.packageRoot);
  const skills = listed.skills.filter((item) => item.packageName === pkg.name);
  assert.equal(skills.length, pkg.skillCount);
  const loadedSkills = [];
  for (const skill of skills) {
    const resolved = run(process.execPath, [cli, 'load', skill.use, '--global-only', '--path'], { INTENT_GLOBAL_NODE_MODULES: pkg.root });
    assert.equal(resolved.status, 0, resolved.stderr);
    const resolvedPath = resolved.stdout.trim();
    const before = readFileSync(resolvedPath);
    const loaded = intent(['load', skill.use, '--global-only', '--json'], pkg.root);
    assert.equal(loaded.path, resolvedPath);
    assert.equal(loaded.package, pkg.name);
    assert.equal(loaded.version, pkg.version);
    assert.equal(loaded.skill, skill.skillName);
    assert.equal(loaded.source, 'global');
    assert.equal(loaded.packageRoot, pkg.packageRoot);
    const relative = path.relative(pkg.packageRoot, loaded.path);
    assert.ok(relative && !relative.startsWith('..') && !path.isAbsolute(relative));
    const raw = readFileSync(loaded.path);
    assert.ok(raw.length > 0 && loaded.content.trim().length > 0);
    // Intent may rewrite relative Markdown destinations. Do not equate raw and returned hashes.
    const normalized = [pkg.packageRoot, realpathSync(pkg.packageRoot)].reduce(
      (text, root) => text.split(root).join('<PACKAGE_ROOT>'), loaded.content);
    loadedSkills.push({ use: skill.use, pathWithinPackage: relative,
      sourceBytes: raw.length, sourceSha256: digest(raw),
      normalizedLoadedBytes: Buffer.byteLength(normalized), normalizedLoadedSha256: digest(normalized) });
    assert.equal(digest(raw), digest(before), 'Skill source changed during load');
  }
  observations.push({ package: pkg.name, version: pkg.version, source: 'global',
    listed: counts(listed), loadedSkills });
}
const joined = counts(intent(listArgs, consumers.map((pkg) => pkg.root).join(path.delimiter)));
const nonexistent = counts(intent(listArgs, path.join(cwd, 'nonexistent-global-root')));
assert.deepEqual(joined, { packages: 0, skills: 0 });
assert.deepEqual(nonexistent, { packages: 0, skills: 0 });
const failures = {
  loadWithoutOverride: run(process.execPath, [cli, 'load', '@playwright/cli#playwright-cli', '--global-only', '--json']).status,
  unknownSkill: run(process.execPath, [cli, 'load', '@playwright/cli#not-a-real-skill', '--global-only', '--json'], { INTENT_GLOBAL_NODE_MODULES: consumers[0].root }).status,
  missingSkillArgument: run(process.execPath, [cli, 'load', '--global-only']).status,
};
for (const status of Object.values(failures)) assert.ok(Number.isInteger(status) && status !== 0);
const intentPkg = JSON.parse(readFileSync(path.join(path.dirname(cli), '..', 'package.json'), 'utf8'));
console.log(JSON.stringify({ node: process.version, platform: process.platform,
  pnpm: pnpmVersion.stdout.trim(), intent: intentPkg.version,
  baseline, singleRoot: observations, delimiterJoinedRoots: joined,
  nonexistentOverride: nonexistent, expectedNonzero: failures }, null, 2));
