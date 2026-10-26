import assert from 'node:assert/strict';
import { observation, createConsumer } from './consumer.mjs';
import { startServices, until } from './service.mjs';
import { definition } from './flags.mjs';
const source = process.env.MOBA_SOURCE;
if (!source) throw new Error('MOBA_SOURCE must point to the fixed source from ../server-lockstep/README.md');
const metrics = observation(); const service = await startServices(metrics.registry); let consumer;
try {
  consumer = await createConsumer(service.endpoint, source, metrics);
  const old = await consumer.begin('canary');
  console.log('r1 actual MOBA created:', old.manifest, old.chosen);
  await service.publish(definition('r2', true));
  await until(async () => (await consumer.candidate('canary')).rules.revision === 'r2', 'r2 becomes visible');
  const canary = await consumer.begin('canary'); const stable = await consumer.begin('stable');
  assert.equal(old.chosen.rules.heroesPerTeam, 1);
  assert.equal(canary.chosen.rules.heroesPerTeam, 2); assert.equal(stable.chosen.rules.heroesPerTeam, 1);
  console.log('existing r1, new r2 canary, r2 stable:', [old.advance(), canary.advance(), stable.advance()]);
  await service.publish(definition('r3', false));
  await until(async () => (await consumer.candidate('canary')).rules.revision === 'r3', 'rollback becomes visible');
  const rollback = await consumer.begin('canary'); assert.equal(rollback.chosen.rules.heroesPerTeam, 1);
  console.log('rollback r3 actual MOBA:', rollback.advance());
  await until(async () => (await service.query('sum(moba_simulation_slices_total)'))[0]?.value[1] === '4', 'Prometheus scrapes all four actual slices');
  console.log('Prometheus actual adoption:', await service.query('moba_config_adoptions_total'));
  console.log('Prometheus actual slices:', await service.query('moba_simulation_slices_total'));
  await service.stopFlags();
  const fallback = await consumer.begin('canary'); assert.equal(fallback.chosen.source, 'default');
  console.log('service unavailable: explicit built-in r1 next run', fallback.advance());
} finally { await consumer?.close(); await service.close(); }
console.log('closed owned services and Detour instances');
