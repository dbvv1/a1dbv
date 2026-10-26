import test from 'node:test';
import assert from 'node:assert/strict';
import { observation, createConsumer } from './consumer.mjs';
import { startServices, until } from './service.mjs';
import { definition, validRules, BASELINE } from './flags.mjs';
import { loadSource } from '../server-lockstep/source.mjs';
const source = process.env.MOBA_SOURCE;
if (!source) throw new Error('MOBA_SOURCE is required; no fake simulation or skip');
test('official service → fixed real simulation → Prometheus → rollback', async t => {
  const metrics = observation(); const service = await startServices(metrics.registry); let consumer;
  try {
    consumer = await createConsumer(service.endpoint, source, metrics);
    let original;
    await t.test('normal r1 creates real 1v1; reading candidates is not adoption', async () => {
      await consumer.candidate(); await consumer.candidate();
      assert.equal((await metrics.registry.getMetricsAsJSON())[0].values.length, 0);
      original = await consumer.begin('canary');
      assert.equal(original.simulation.snapshot().heroes.length, 2);
      assert.equal(original.chosen.source, 'remote'); assert.equal(original.manifest.source, '3bcda00fb35361cc5a25ee74e3768a2f3678c563');
    });
    await t.test('hot r2 targets new canary 2v2; old run and stable group retain 1v1', async () => {
      await service.publish(definition('r2', true));
      await until(async () => (await consumer.candidate('canary')).rules.revision === 'r2', 'r2');
      const canary = await consumer.begin('canary'), stable = await consumer.begin('stable');
      assert.equal(canary.simulation.snapshot().heroes.length, 4); assert.equal(stable.simulation.snapshot().heroes.length, 2);
      assert.equal(original.chosen.rules.revision, 'r1'); assert.equal(original.simulation.snapshot().heroes.length, 2);
      assert.throws(() => { original.chosen.rules.heroesPerTeam = 2; }, TypeError);
      assert.equal(original.advance().hash, '1131636eda1a1a34');
      assert.equal(canary.advance().hash, '50211eb8bd38bb6f');
      assert.equal(stable.advance().hash, '1131636eda1a1a34');
      assert.throws(() => original.advance(), /already consumed/);
    });
    await t.test('r3 rollback restores future runs, not mutable active rules', async () => {
      await service.publish(definition('r3', false));
      await until(async () => (await consumer.candidate('canary')).rules.revision === 'r3', 'r3');
      const run = await consumer.begin('canary'); assert.equal(run.advance().heroes, 2);
      assert.equal(original.chosen.rules.revision, 'r1');
    });
    await t.test('real scrape/query identifies the rules actually consumed, no player ID labels', async () => {
      await until(async () => (await service.query('sum(moba_simulation_slices_total)'))[0]?.value[1] === '4', 'four actual slices scraped');
      const values = await service.query('moba_config_adoptions_total');
      assert.equal(values.length, 4);
      assert.deepEqual(values.map(x => [x.metric.revision, x.metric.mode, x.metric.source]).sort(), [
        ['r1','1v1','remote'], ['r2','1v1','remote'], ['r2','2v2','remote'], ['r3','1v1','remote']]);
      assert.ok(values.every(x => !('playerId' in x.metric) && !('targetingKey' in x.metric)));
    });
    await t.test('closing one provider does not clear another live remote consumer', async () => {
      const other = await createConsumer(service.endpoint, source, metrics);
      await consumer.close(); consumer = other;
      const selected = await other.candidate();
      assert.equal(selected.source, 'remote'); assert.equal(selected.rules.revision, 'r3');
    });
    await t.test('JSON array revision is rejected before adoption, not coerced into a label', async () => {
      const invalid = definition('r4'); invalid['match-rules'].variations.stable.revision = ['r4'];
      assert.equal(validRules(invalid['match-rules'].variations.stable), false);
      await service.publish(invalid);
      await until(async () => (await consumer.candidate()).reason === 'INVALID_SCHEMA', 'array revision visible');
      const chosen = await consumer.candidate(); assert.equal(chosen.source, 'default'); assert.equal(chosen.rules.revision, 'r1');
      await service.publish(definition('r4'));
      await until(async () => (await consumer.candidate()).rules.revision === 'r4', 'valid r4 restored');
    });
    await t.test('provider-success with incompatible config is not accepted; missing flag also falls back', async () => {
      const invalid = definition('r4'); invalid['match-rules'].variations.stable.heroesPerTeam = 50;
      await service.publish(invalid);
      await until(async () => (await consumer.candidate()).reason === 'INVALID_SCHEMA', 'invalid app schema visible');
      const fallback = await consumer.begin(); assert.deepEqual(fallback.chosen.rules, BASELINE); assert.equal(fallback.chosen.source, 'default');
      assert.equal(fallback.advance().heroes, 2);
      const missing = await consumer.candidate('stable', 'absent-rule'); assert.equal(missing.source, 'default'); assert.equal(missing.reason, 'FLAG_NOT_FOUND');
    });
    await t.test('configuration service outage chooses built-in next-run default', async () => {
      await service.stopFlags(); const run = await consumer.begin();
      assert.equal(run.chosen.source, 'default'); assert.equal(run.chosen.rules.revision, 'r1');
      assert.equal(run.advance().hash, '1131636eda1a1a34');
    });
    await t.test('pending begin cannot adopt or return a live run after close', async () => {
      const other = await createConsumer(service.endpoint, source, metrics);
      const count = async () => (await metrics.registry.getMetricsAsJSON()).find(m => m.name === 'moba_config_adoptions_total').values.reduce((sum, value) => sum + value.value, 0);
      const before = await count();
      const pending = other.begin(); const rejected = assert.rejects(pending, /closed/);
      await other.close(); await rejected;
      assert.equal(await count(), before); await other.close();
    });
    await t.test('schema/unsupported source options and out-of-scope endpoints fail explicitly', async () => {
      assert.equal(validRules({ ...BASELINE, contentVersion: 9 }), false);
      assert.equal(validRules({ ...BASELINE, schema: 2 }), false);
      assert.equal(validRules({ ...BASELINE, revision: 'player-123' }), false);
      await assert.rejects(loadSource(source, { heroesPerTeam: 3 }), /one or two/);
      await assert.rejects(createConsumer('https://example.com', source, metrics), /loopback/);
      await assert.rejects(startServices(metrics.registry, { goffBinary: '/missing-example-binary' }), /ENOENT/);
    });
  } finally { await consumer?.close(); await service.close(); }
  await t.test('close releases real children and refuses new work', async () => {
    for (const pid of service.ownedPids) assert.throws(() => process.kill(pid, 0), { code: 'ESRCH' });
    await assert.rejects(consumer.begin(), /closed/); await consumer.close(); await service.close();
  });
});
