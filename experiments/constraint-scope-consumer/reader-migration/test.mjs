import assert from 'node:assert/strict';
import { readFile, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const root = resolve(import.meta.dirname);
const original = await readFile(`${root}/original.sql`, 'utf8');
const migration = await readFile(`${root}/corrected.sql`, 'utf8');
await mkdir(`${root}/runs`, { recursive: true });
const run = await mkdtemp(`${root}/runs/run-`);
const results = [];
const pass = name => { results.push(name); console.log(`PASS ${name}`); };
const setup = `
CREATE TABLE public.users (id integer PRIMARY KEY, age integer, note text);
CREATE TABLE public.birthcharts (id integer PRIMARY KEY, note text);
CREATE TABLE public.profiles (id integer PRIMARY KEY, birthchart_id integer, note text);
CREATE TABLE public.other_users (id integer PRIMARY KEY, age integer,
  CONSTRAINT check_age_positive CHECK (age > 0));
CREATE TABLE public.other_profiles (id integer PRIMARY KEY, birthchart_id integer,
  CONSTRAINT profiles_birthchart_id_fkey FOREIGN KEY (birthchart_id) REFERENCES public.birthcharts(id));
INSERT INTO public.users VALUES (1, 32, 'keep user'), (2, NULL, 'nullable age');
INSERT INTO public.birthcharts VALUES (10, 'keep chart');
INSERT INTO public.profiles VALUES (1, 10, 'keep profile'), (2, NULL, 'nullable reference');
INSERT INTO public.other_users VALUES (1, 3);
INSERT INTO public.other_profiles VALUES (1, 10);
`;
const constraintsSQL = `SELECT c.conname, c.contype, c.convalidated,
  c.conrelid::regclass::text AS relation, pg_get_constraintdef(c.oid) AS definition
  FROM pg_catalog.pg_constraint c JOIN pg_catalog.pg_namespace n ON n.oid=c.connamespace
  WHERE n.nspname='public' ORDER BY relation, c.conname`;
async function snapshot(db) {
  const data = {};
  for (const t of ['users', 'profiles', 'birthcharts', 'other_users', 'other_profiles'])
    data[t] = (await db.query(`SELECT * FROM public.${t} ORDER BY id`)).rows;
  return { data, constraints: (await db.query(constraintsSQL)).rows };
}
async function expectError(db, sql, code, label) {
  await assert.rejects(() => db.exec(sql), e => { assert.equal(e.code, code); return true; });
  pass(label);
}
async function reopen(db, path) { await db.close(); return new PGlite(path); }

// Baseline consumer: both wrong-table names suppress the original migration.
let path = `${run}/baseline`;
let db = new PGlite(path);
await db.exec(setup);
const version = (await db.query('SELECT version() AS version')).rows[0].version;
const before = await snapshot(db);
await db.exec(original);
assert.deepEqual(await snapshot(db), before);
pass('original reports success yet creates neither target constraint');
await db.exec("INSERT INTO public.users VALUES (3, -7, 'baseline invalid age'); INSERT INTO public.profiles VALUES (3, 999, 'baseline orphan');");
pass('original false success allows both invalid age and orphan reference');
const badBaseline = await snapshot(db);
db = await reopen(db, path);
assert.deepEqual(await snapshot(db), badBaseline);
pass('original false success and bad rows survive close/reopen');
await db.close();

// Page-prescribed failure recovery before accepting the successful migration.
for (const scenario of ['check', 'foreign-key']) {
  path = `${run}/failure-${scenario}`;
  db = new PGlite(path);
  await db.exec(setup);
  await db.exec(scenario === 'check'
    ? "INSERT INTO public.users VALUES (3, 0, 'existing bad age');"
    : "INSERT INTO public.profiles VALUES (3, 999, 'existing orphan');");
  const preFailure = await snapshot(db);
  await expectError(db, migration, scenario === 'check' ? '23514' : '23503', `${scenario}: existing invalid row rejects migration`);
  // PostgreSQL leaves an explicit failed transaction open: runner must roll back.
  await expectError(db, 'SELECT 1;', '25P02', `${scenario}: failed transaction requires rollback`);
  await db.exec('ROLLBACK;');
  assert.deepEqual(await snapshot(db), preFailure);
  pass(`${scenario}: rollback preserves every business row and original schema`);
  db = await reopen(db, path);
  assert.deepEqual(await snapshot(db), preFailure);
  pass(`${scenario}: rollback preserved on close/reopen (no partial CHECK in FK case)`);
  await db.exec("INSERT INTO public.users VALUES (4, 42, 'write after rollback'); INSERT INTO public.profiles VALUES (4, 10, 'write after rollback');");
  assert.equal((await db.query('SELECT count(*)::int AS n FROM public.users WHERE id=4')).rows[0].n, 1);
  pass(`${scenario}: legal reads/writes continue after rollback`);
  await db.close();
}

// Missing required relation must not mutate unrelated existing data.
path = `${run}/missing-table`;
db = new PGlite(path);
await db.exec(setup);
await db.exec('DROP TABLE public.profiles;');
const unrelatedSQL = `SELECT 'users' AS relation, to_jsonb(t) AS row FROM public.users t UNION ALL SELECT 'birthcharts', to_jsonb(t) FROM public.birthcharts t UNION ALL SELECT 'other_users', to_jsonb(t) FROM public.other_users t UNION ALL SELECT 'other_profiles', to_jsonb(t) FROM public.other_profiles t ORDER BY 1, 2`;
const unrelatedBefore = (await db.query(unrelatedSQL)).rows;
const schemaBeforeMissing = (await db.query(constraintsSQL)).rows;
await expectError(db, migration, '42P01', 'missing profiles table causes controlled failure');
await db.exec('ROLLBACK;');
assert.deepEqual((await db.query(unrelatedSQL)).rows, unrelatedBefore);
assert.deepEqual((await db.query(constraintsSQL)).rows, schemaBeforeMissing);
db = await reopen(db, path);
assert.deepEqual((await db.query(unrelatedSQL)).rows, unrelatedBefore);
assert.deepEqual((await db.query(constraintsSQL)).rows, schemaBeforeMissing);
pass('missing-table failure preserves unrelated data/schema through rollback and reopen');
await db.close();

path = `${run}/success`;
db = new PGlite(path);
await db.exec(setup);
const preSuccess = await snapshot(db);
await db.exec(migration);
let after = await snapshot(db);
assert.deepEqual(after.data, preSuccess.data);
for (const [relation, name, type] of [['users', 'check_age_positive', 'c'], ['profiles', 'profiles_birthchart_id_fkey', 'f']]) {
  const matching = after.constraints.filter(c => c.relation === relation && c.conname === name);
  assert.equal(matching.length, 1);
  assert.equal(matching[0].contype, type);
  assert.equal(matching[0].convalidated, true);
}
assert.equal(after.constraints.length, preSuccess.constraints.length + 2);
for (const prior of preSuccess.constraints) assert.ok(after.constraints.some(c => JSON.stringify(c) === JSON.stringify(prior)));
pass('corrected migration adds both validated target constraints and preserves rows/decoys');
db = await reopen(db, path);
assert.deepEqual(await snapshot(db), after);
pass('successful rows and exact constraint definitions persist on close/reopen');
await db.exec(migration);
assert.deepEqual(await snapshot(db), after);
pass('idempotent rerun after reopen preserves rows and exact schema');
await db.exec("INSERT INTO public.users VALUES (3, 21, 'new user'); UPDATE public.users SET age=33 WHERE id=1; INSERT INTO public.birthcharts VALUES (11, 'new chart'); INSERT INTO public.profiles VALUES (3, 11, 'new profile'); UPDATE public.profiles SET birthchart_id=11 WHERE id=1;");
pass('legal inserts and updates work after migration');
const beforeRejections = await snapshot(db);
for (const [sql, code, label] of [
  ["INSERT INTO public.users VALUES (4, 0, 'invalid');", '23514', 'zero age insert'],
  ['UPDATE public.users SET age=-1 WHERE id=1;', '23514', 'negative age update'],
  ["INSERT INTO public.profiles VALUES (4, 999, 'invalid');", '23503', 'orphan insert'],
  ['UPDATE public.profiles SET birthchart_id=999 WHERE id=1;', '23503', 'orphan update'],
  ['DELETE FROM public.birthcharts WHERE id=11;', '23503', 'referenced parent delete']
]) await expectError(db, sql, code, `${label} rejected`);
assert.deepEqual(await snapshot(db), beforeRejections);
pass('all failed writes leave existing rows and schema unchanged');
db = await reopen(db, path);
assert.deepEqual(await snapshot(db), beforeRejections);
pass('continued writes and failed-write preservation survive second close/reopen');
await db.exec(migration);
assert.deepEqual(await snapshot(db), beforeRejections);
pass('rerun after continued writes remains idempotent');
await db.close();
const summary = { status: 'passed', checks: results.length, results, version, node: process.version, pglite: '0.5.15', run: relative(root, run) };
await writeFile(`${root}/result.json`, JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
