import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { init, exportNavMesh, importNavMesh, NavMeshQuery, Crowd } from 'recast-navigation';
import { generateSoloNavMesh } from 'recast-navigation/generators';

export const version = '0.43.1';
export const config = Object.freeze({
  cs: 0.2, ch: 0.2, walkableRadius: 2, walkableHeight: 10, walkableClimb: 2,
  minRegionArea: 0, mergeRegionArea: 0,
});
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const ready = init();

// Original walkable floor, metres/Y-up; split is a new authored no-walk strip,
// not a moving collider or a runtime TileCache obstacle.
export function floorGeometry(variant) {
  assert.ok(['open', 'split'].includes(variant), 'unknown geometry variant');
  const positions = [], indices = [];
  for (const [left, right] of variant === 'open' ? [[-30, 30]] : [[-30, -1], [1, 30]]) {
    const first = positions.length / 3;
    positions.push(left, 0, -5, right, 0, -5, right, 0, 5, left, 0, 5);
    indices.push(first, first + 2, first + 1, first, first + 3, first + 2);
  }
  return { positions, indices };
}

export async function bake(directory, variant = 'open') {
  await ready;
  const geometry = floorGeometry(variant);
  const result = generateSoloNavMesh(geometry.positions, geometry.indices, config);
  assert.ok(result.success, result.error);
  let bytes;
  try { bytes = exportNavMesh(result.navMesh); }
  finally { result.navMesh.destroy(); }
  const manifest = {
    schema: 1, packageVersion: version, geometry: variant,
    geometryHash: digest(JSON.stringify(geometry)), config,
    byteLength: bytes.length, sha256: digest(bytes),
  };
  // Each version gets a new directory; never overwrite an old replay's data.
  mkdirSync(dirname(directory), { recursive: true });
  mkdirSync(directory);
  writeFileSync(join(directory, 'navmesh.bin'), bytes, { flag: 'wx' });
  writeFileSync(join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  return manifest;
}

export async function load(directory) {
  const manifest = JSON.parse(readFileSync(join(directory, 'manifest.json'), 'utf8'));
  const bytes = readFileSync(join(directory, 'navmesh.bin'));
  assert.equal(manifest.schema, 1, 'unsupported manifest');
  assert.equal(manifest.packageVersion, version, 'package version mismatch');
  assert.deepEqual(manifest.config, config, 'bake configuration mismatch');
  assert.equal(manifest.geometryHash, digest(JSON.stringify(floorGeometry(manifest.geometry))), 'geometry mismatch');
  assert.ok(bytes.length > 0 && bytes.length === manifest.byteLength, 'length mismatch');
  assert.equal(digest(bytes), manifest.sha256, 'hash mismatch');
  // Integrity against our trusted build manifest, NOT a hostile-WASM-input sandbox.
  await ready;
  const { navMesh } = importNavMesh(new Uint8Array(bytes));
  return { navMesh, manifest };
}

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
export function project(query, point) {
  assert.ok(['x', 'y', 'z'].every(k => Number.isFinite(point[k])), 'non-finite point');
  const result = query.findClosestPoint(point, { halfExtents: { x: 0.5, y: 0.5, z: 0.5 } });
  assert.ok(result.success && result.polyRef && distance(point, result.point) < 0.5, 'point off navigation surface');
  return result;
}

export function route(query, start, end) {
  const a = project(query, start), b = project(query, end);
  const result = query.findPath(a.polyRef, b.polyRef, a.point, b.point);
  try {
    // A non-empty corridor can be partial. Require its last polygon to reach b.
    const complete = result.success && result.polys.size > 0
      && result.polys.get(result.polys.size - 1) === b.polyRef;
    return { complete, start: a.point, end: b.point };
  } finally { result.polys.destroy(); }
}

export function addMovingAgent(crowd, path) {
  assert.ok(path.complete, 'target unreachable');
  assert.ok(crowd.getAgents().filter(a => a.agentIndex >= 0).length < crowd.getAgentCount(), 'crowd capacity or spawn failure');
  const agent = crowd.addAgent(path.start, {
    radius: 0.4, height: 1.8, maxAcceleration: 8, maxSpeed: 3,
    collisionQueryRange: 2.4, pathOptimizationRange: 12, separationWeight: 2,
  });
  // 0.43.1 returns a truthy wrapper with index -1 when the capacity is exhausted.
  assert.ok(agent && agent.agentIndex >= 0, 'crowd capacity or spawn failure');
  assert.ok(agent.requestMoveTarget(path.end), 'move request rejected');
  return agent;
}

export async function simulate(directory) {
  const { navMesh, manifest } = await load(directory);
  const query = new NavMeshQuery(navMesh);
  let crowd;
  try {
    const routes = Array.from({ length: 8 }, (_, i) => {
      const side = i % 2 ? 1 : -1, z = (Math.floor(i / 2) - 1.5) * 1.2;
      return route(query, { x: side * 25, y: 0, z }, { x: -side * 25, y: 0, z });
    });
    assert.ok(routes.every(r => r.complete), 'target unreachable: no movement request submitted');
    crowd = new Crowd(navMesh, { maxAgents: 16, maxAgentRadius: 0.5 });
    const agents = routes.map(r => addMovingAgent(crowd, r));
    const samples = [];
    let minSeparation = Infinity;
    for (let tick = 0; tick < 900; tick++) {
      crowd.update(1 / 30);
      // The movement consumer owns these transforms; do not integrate velocity again.
      const positions = agents.map(a => a.position());
      assert.ok(positions.every(p => Object.values(p).every(Number.isFinite)));
      samples.push(positions);
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          minSeparation = Math.min(minSeparation, distance(positions[i], positions[j]));
        }
      }
    }
    const final = samples.at(-1);
    assert.ok(final.every((p, i) => distance(p, routes[i].end) < 1), 'arrival deadline exceeded');
    const result = { packageVersion: version, navHash: manifest.sha256, ticks: 900, hz: 30,
      agents: agents.length, traceHash: digest(JSON.stringify(samples)), minSeparation, final };
    for (const agent of agents) crowd.removeAgent(agent);
    assert.equal(crowd.getAgents().length, 0);
    return result;
  } finally { crowd?.destroy(); query.destroy(); navMesh.destroy(); }
}
