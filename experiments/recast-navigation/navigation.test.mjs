import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { NavMeshQuery, Crowd, setRandomSeed } from 'recast-navigation';
import { bake, load, route, project, simulate, addMovingAgent } from './navigation.mjs';

const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url));
function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'a1-nav-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}
function command(...args) {
  const result = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', timeout: 20000 });
  assert.ifError(result.error);
  return result;
}

test('offline export/import and eight-agent fixed-step replay match a new process', async t => {
  const directory = join(fixture(t), 'v1');
  const manifest = await bake(directory);
  assert.equal(manifest.byteLength, 6132);
  const a = await simulate(directory), b = await simulate(directory);
  assert.equal(a.traceHash, b.traceHash);
  const child = command('run', directory);
  assert.equal(child.status, 0, child.stderr);
  assert.equal(JSON.parse(child.stdout).traceHash, a.traceHash);
  assert.equal(a.agents, 8);
  assert.ok(a.minSeparation > 0.79 && a.minSeparation < 0.8,
    'fixed sample has a small overlap: do not label crowd as collision-free');
});

test('geometry second change disconnects route; v1 remains usable', async t => {
  const root = fixture(t), first = join(root, 'v1'), second = join(root, 'v2');
  const a = await bake(first), b = await bake(second, 'split');
  assert.notEqual(a.sha256, b.sha256);
  assert.notEqual(a.geometryHash, b.geometryHash);
  const { navMesh } = await load(second), query = new NavMeshQuery(navMesh);
  try {
    const start = { x: -25, y: 0.2, z: 0 }, end = { x: 25, y: 0.2, z: 0 };
    assert.equal(query.computePath(start, end).success, true, 'native helper returns a usable partial path');
    assert.equal(route(query, start, end).complete, false);
  } finally { query.destroy(); navMesh.destroy(); }
  await assert.rejects(simulate(second), /target unreachable/);
  assert.equal(command('run', second).status, 1);
  assert.equal((await simulate(first)).navHash, a.sha256);
  await assert.rejects(bake(first), /EEXIST/);
});

test('missing, modified or incompatible published input rejects before import', async t => {
  const root = fixture(t), original = join(root, 'v1');
  await bake(original);
  await assert.rejects(load(join(root, 'absent')), /ENOENT/);
  for (const kind of ['missing', 'bytes', 'version']) {
    const directory = join(root, kind);
    cpSync(original, directory, { recursive: true });
    if (kind === 'missing') rmSync(join(directory, 'navmesh.bin'));
    if (kind === 'bytes') {
      const bytes = readFileSync(join(directory, 'navmesh.bin'));
      bytes[bytes.length - 1] ^= 1;
      writeFileSync(join(directory, 'navmesh.bin'), bytes);
    }
    if (kind === 'version') {
      const file = join(directory, 'manifest.json'), data = JSON.parse(readFileSync(file));
      data.packageVersion = 'different';
      writeFileSync(file, JSON.stringify(data));
    }
    await assert.rejects(load(directory), /ENOENT|hash mismatch|package version mismatch/);
    assert.equal(command('run', directory).status, 1);
  }
});

test('invalid author input and off-surface goals fail instead of inventing a route', async t => {
  const root = fixture(t), invalid = join(root, 'invalid'), directory = join(root, 'v1');
  assert.equal(command('bake', invalid, 'typo').status, 1);
  assert.equal(existsSync(invalid), false);
  assert.equal(command().status, 1);
  await bake(directory);
  const { navMesh } = await load(directory), query = new NavMeshQuery(navMesh);
  try {
    assert.throws(() => project(query, { x: NaN, y: 0, z: 0 }), /non-finite/);
    assert.throws(() => project(query, { x: 200, y: 0, z: 0 }), /off navigation/);
  } finally { query.destroy(); navMesh.destroy(); }
});

test('random queries share WASM state across query instances', async t => {
  const directory = join(fixture(t), 'v1');
  await bake(directory);
  const { navMesh } = await load(directory), a = new NavMeshQuery(navMesh), b = new NavMeshQuery(navMesh);
  const random = query => {
    const result = query.findRandomPointAroundCircle({ x: 0, y: 0.2, z: 0 }, 10);
    assert.ok(result.success);
    return result.randomPoint;
  };
  try {
    setRandomSeed(42); const first = random(a), second = random(a);
    setRandomSeed(42); assert.deepEqual(random(b), first); assert.deepEqual(random(b), second);
    setRandomSeed(42); assert.deepEqual(random(a), first); random(b);
    assert.notDeepEqual(random(a), second, 'other match consumed shared random stream');
  } finally { a.destroy(); b.destroy(); navMesh.destroy(); }
});


test('crowd capacity failure rejects before allocating another wrapper', async t => {
  const directory = join(fixture(t), 'v1');
  await bake(directory);
  const { navMesh } = await load(directory), query = new NavMeshQuery(navMesh);
  const crowd = new Crowd(navMesh, { maxAgents: 1, maxAgentRadius: 0.5 });
  try {
    const path = route(query, { x: -25, y: 0, z: 0 }, { x: 25, y: 0, z: 0 });
    const first = addMovingAgent(crowd, path);
    assert.ok(first.agentIndex >= 0);
    assert.throws(() => addMovingAgent(crowd, path), /crowd capacity or spawn failure/);
    assert.equal(crowd.getAgents().length, 1);
    crowd.removeAgent(first);
    assert.equal(crowd.getAgents().length, 0);
  } finally { crowd.destroy(); query.destroy(); navMesh.destroy(); }
});
