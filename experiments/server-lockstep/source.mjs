// Read an unmodified, public fixed MOBA source; never alter its production tree.
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export const SOURCE_SHA = '3bcda00fb35361cc5a25ee74e3768a2f3678c563';
export const SOURCE_URL = 'https://github.com/dbvv1/MOBA-Like';
const sha256 = data => createHash('sha256').update(data).digest('hex');
export async function loadSource(directory, { heroesPerTeam = 1 } = {}) {
  if (![1, 2].includes(heroesPerTeam)) throw new Error("example supports one or two heroes per team");
  const root = resolve(directory);
  const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  if (head !== SOURCE_SHA) throw new Error('source checkout is not the fixed accepted MOBA commit');
  const dirty = execFileSync('git', ['status', '--porcelain', '--untracked-files=no', '--',
    'src/sim', 'src/content', 'package.json', 'package-lock.json'], { cwd: root, encoding: 'utf8' });
  if (dirty.trim()) throw new Error('simulation source or locked dependencies have local edits');
  const bytes = await readFile(resolve(root, 'src/sim/nav/lane.navmesh'));
  const lock = await readFile(resolve(root, 'package-lock.json'));
  const api = await import(pathToFileURL(resolve(root, 'src/sim/index.ts')).href);
  const navigation = await api.createDetourNavigation(bytes);
  const simulation = new api.Simulation({ seed: 901, contentVersion: 8, navigation, heroesPerTeam });
  return { simulation, navigation, manifest: { source: SOURCE_SHA, node: process.version,
    dependencies: sha256(lock), navigation: sha256(bytes), seed: 901, contentVersion: 8, heroesPerTeam,
    tickRate: simulation.tickRateHz, initialHash: simulation.finalHash() } };
}
