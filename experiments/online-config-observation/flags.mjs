// Application-owned schema and revisions, not provider assignment IDs.
export const BASELINE = Object.freeze({ schema: 1, revision: 'r1', contentVersion: 8, heroesPerTeam: 1 });
export function definition(revision = 'r1', canary = false) {
  const base = { ...BASELINE, revision };
  return { 'match-rules': {
    variations: { stable: base, canary: { ...base, heroesPerTeam: 2 } },
    targeting: canary ? [{ name: 'test-cohort', query: 'cohort eq "canary"', variation: 'canary' }] : [],
    defaultRule: { variation: 'stable' },
    trackEvents: false,
  } };
}
export function validRules(value) {
  return value && value.schema === 1 && typeof value.revision === 'string' && /^r[1-9][0-9]{0,3}$/.test(value.revision) &&
    value.contentVersion === 8 && [1, 2].includes(value.heroesPerTeam) &&
    Object.keys(value).sort().join(',') === 'contentVersion,heroesPerTeam,revision,schema';
}
