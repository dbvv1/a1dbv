import assert from 'node:assert/strict';
import { readFile, mkdir, mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
const input = import.meta.dirname;
const migration = await readFile(join(input, 'corrected.sql'), 'utf8');
await mkdir(join(input, 'runs'), {recursive:true});
const dir = await mkdtemp(join(input, 'runs', 'schema-'));
let db = new PGlite(dir);
await db.exec(`
CREATE SCHEMA shadow;
CREATE TABLE public.users(id integer PRIMARY KEY, age integer);
CREATE TABLE public.birthcharts(id integer PRIMARY KEY);
CREATE TABLE public.profiles(id integer PRIMARY KEY, birthchart_id integer);
CREATE TABLE shadow.users(id integer PRIMARY KEY, age integer, CONSTRAINT check_age_positive CHECK(age > 0));
CREATE TABLE shadow.birthcharts(id integer PRIMARY KEY);
CREATE TABLE shadow.profiles(id integer PRIMARY KEY, birthchart_id integer, CONSTRAINT profiles_birthchart_id_fkey FOREIGN KEY(birthchart_id) REFERENCES shadow.birthcharts(id));
INSERT INTO public.users VALUES(7,45),(8,NULL);
INSERT INTO public.birthcharts VALUES(41),(42);
INSERT INTO public.profiles VALUES(11,41),(12,NULL);
INSERT INTO shadow.users VALUES(70,50);
INSERT INTO shadow.birthcharts VALUES(99);
INSERT INTO shadow.profiles VALUES(110,99);
SET search_path=shadow,public;
`);
const select = async () => ({
  publicUsers: (await db.query('SELECT * FROM public.users ORDER BY id')).rows,
  publicBirthcharts: (await db.query('SELECT * FROM public.birthcharts ORDER BY id')).rows,
  publicProfiles: (await db.query('SELECT * FROM public.profiles ORDER BY id')).rows,
  shadowUsers: (await db.query('SELECT * FROM shadow.users ORDER BY id')).rows,
  shadowBirthcharts: (await db.query('SELECT * FROM shadow.birthcharts ORDER BY id')).rows,
  shadowProfiles: (await db.query('SELECT * FROM shadow.profiles ORDER BY id')).rows,
});
const before = await select();
await db.exec(migration);
assert.deepEqual(await select(), before);
const constraints = (await db.query(`SELECT conname, conrelid::oid::int AS target, confrelid::oid::int AS parent, convalidated FROM pg_catalog.pg_constraint WHERE conrelid IN ('public.users'::regclass,'public.profiles'::regclass) AND contype IN ('c','f') ORDER BY conname`)).rows;
assert.equal(constraints.length,2);
assert.equal(constraints[1].parent, (await db.query("SELECT 'public.birthcharts'::regclass::oid::int AS parent")).rows[0].parent);
await assert.rejects(db.exec('INSERT INTO public.users VALUES(9,-1)'), e=>e.code==='23514');
await assert.rejects(db.exec('INSERT INTO public.profiles VALUES(13,99)'), e=>e.code==='23503');
await db.exec('INSERT INTO public.users VALUES(9,22); INSERT INTO public.profiles VALUES(13,42);');
const after = await select();
await db.close(); db = new PGlite(dir);
assert.deepEqual(await select(),after);
await db.exec('SET search_path=shadow,public;');
await db.exec(migration);
assert.deepEqual(await select(),after);
await db.close();
console.log(JSON.stringify({status:'passed', checks:['non-default search_path preserves public and shadow rows','target CHECK rejects invalid value','FK points to public parent, rejects shadow-only parent','legal writes persist on close/reopen','rerun under shadow search_path is idempotent']}));
