import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';

const combined = readFileSync(new URL('./source.sql', import.meta.url), 'utf8');
const [checkSql, foreignSql] = combined.split('-- Foreign keys\n');
const cases = [
  {
    name: 'check', table: 'users', constraint: 'check_age_positive', sql: checkSql,
    setup: 'create table users (age int); insert into users values (5);',
    collision: 'create table other_users (age int constraint check_age_positive check(age > 0));',
    invalid: 'insert into users values (-1);', code: '23514',
  },
  {
    name: 'foreign key', table: 'profiles', constraint: 'profiles_birthchart_id_fkey', sql: foreignSql,
    setup: 'create table birthcharts (id int primary key); insert into birthcharts values (1); create table profiles (birthchart_id int); insert into profiles values (1);',
    collision: 'create table other_profiles (birthchart_id int constraint profiles_birthchart_id_fkey references birthcharts(id));',
    invalid: 'insert into profiles values (2);', code: '23503',
  },
];

for (const item of cases) {
  for (const collision of [false, true]) {
    for (const fixed of [false, true]) {
      test(`${item.name}: collision=${collision}, table_scoped=${fixed}`, async () => {
        const db = new PGlite();
        try {
          await db.exec('set search_path to public;');
          await db.exec(item.setup);
          if (collision) await db.exec(item.collision);
          const sql = fixed ? item.sql.replace(`where conname = '${item.constraint}'`, `where conname = '${item.constraint}'\n    and conrelid = 'public.${item.table}'::regclass`) : item.sql;
          await db.exec(sql);
          await db.exec(sql); // Same migration must remain repeatable.
          const rows = (await db.query('select conname from pg_constraint where conrelid = $1::regclass and conname = $2', [`public.${item.table}`, item.constraint])).rows;
          const missing = collision && !fixed;
          assert.equal(rows.length, missing ? 0 : 1);
          if (missing) {
            await db.exec(item.invalid);
            assert.equal((await db.query(`select count(*)::int as count from ${item.table}`)).rows[0].count, 2);
          } else {
            await assert.rejects(db.exec(item.invalid), (error) => error.code === item.code);
            assert.equal((await db.query(`select count(*)::int as count from ${item.table}`)).rows[0].count, 1);
          }
        } finally {
          await db.close();
        }
      });
    }
  }
}
