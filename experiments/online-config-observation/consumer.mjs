import { OpenFeature, NOOP_PROVIDER } from '@openfeature/server-sdk';
import { GoFeatureFlagProvider, EvaluationType } from '@openfeature/go-feature-flag-provider';
import { Registry, Counter } from '@prometheus-io/client';
import { randomUUID } from 'node:crypto';
import { loadSource } from '../server-lockstep/source.mjs';
import { BASELINE, validRules } from './flags.mjs';
export function observation() {
  const registry = new Registry();
  const adopted = new Counter({ name: 'moba_config_adoptions_total', help: 'Rules actually used to create a Simulation.', labelNames: ['revision', 'mode', 'source'], registers: [registry] });
  const completed = new Counter({ name: 'moba_simulation_slices_total', help: 'Completed bounded simulation slices, not finished matches.', labelNames: ['revision', 'mode', 'source'], registers: [registry] });
  return { registry, adopted, completed };
}
export async function createConsumer(endpoint, sourceDirectory, metrics) {
  if (new URL(endpoint).hostname !== '127.0.0.1') throw new Error('example only permits loopback evaluation');
  const domain = randomUUID();
  await OpenFeature.setProviderAndWait(domain, new GoFeatureFlagProvider({ endpoint, evaluationType: EvaluationType.Remote,
    disableDataCollection: true, timeout: 500 }));
  const client = OpenFeature.getClient(domain); let closed = false; const active = new Set();
  async function candidate(cohort = 'stable', key = 'match-rules') {
    if (closed) throw new Error('consumer closed');
    const result = await client.getObjectDetails(key, BASELINE, { targetingKey: 'synthetic-room', cohort });
    if (closed) throw new Error('consumer closed while evaluating');
    const valid = !result.errorCode && validRules(result.value);
    // Deliberately use the built-in baseline on failure; no undocumented stale cache.
    return Object.freeze({ rules: Object.freeze(structuredClone(valid ? result.value : BASELINE)),
      source: valid ? 'remote' : 'default', reason: valid ? result.reason : (result.errorCode ?? 'INVALID_SCHEMA'), variant: valid ? result.variant : 'builtin' });
  }
  async function begin(cohort = 'stable') {
    const chosen = await candidate(cohort);
    const loaded = await loadSource(sourceDirectory, { heroesPerTeam: chosen.rules.heroesPerTeam });
    if (closed) { loaded.navigation.destroy(); throw new Error('consumer closed while loading source'); }
    const labels = { revision: chosen.rules.revision, mode: `${chosen.rules.heroesPerTeam}v${chosen.rules.heroesPerTeam}` };
    metrics.adopted.inc({ ...labels, source: chosen.source });
    let disposed = false, ran = false;
    const run = { ...loaded, chosen,
      advance(ticks = 60) {
        if (disposed || ran) throw new Error('slice already consumed or disposed');
        if (!Number.isInteger(ticks) || ticks < 1 || ticks > 900) throw new Error('slice tick budget must be 1..900');
        for (let i = 0; i < ticks; i++) loaded.simulation.step([]);
        ran = true; metrics.completed.inc({ ...labels, source: chosen.source });
        return { tick: loaded.simulation.snapshot().tick, hash: loaded.simulation.finalHash(), heroes: loaded.simulation.snapshot().heroes.length };
      },
      close() { if (!disposed) { disposed = true; loaded.navigation.destroy(); active.delete(run); } }
    };
    active.add(run); return run;
  }
  return { candidate, begin, async close() { if (closed) return; closed = true; for (const run of active) run.close(); await OpenFeature.setProviderAndWait(domain, NOOP_PROVIDER); } };
}
