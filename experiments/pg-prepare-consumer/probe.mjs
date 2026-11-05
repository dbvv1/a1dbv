import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { createPgConfig } from '@electric-sql/pglite/node-postgres';
import pg from 'pg';
const results = [];
for (const scenario of ['named-default', 'named-prepare-false', 'unnamed-default', 'unnamed-prepare-false']) {
  const db = new PGlite();
  const config = createPgConfig(db);
  const parses = [];
  const originalParse = config.connection.parse.bind(config.connection);
  config.connection.parse = (message) => {
    parses.push({ name: message.name ?? '', text: message.text });
    return originalParse(message);
  };
  const client = new pg.Client({ ...config, ...(scenario.includes('prepare-false') ? { prepare: false } : {}) });
  try {
    await client.connect();
    const named = !scenario.startsWith('unnamed');
    const output = [];
    for (const value of [21, 22]) {
      const result = await client.query({
        text: 'select $1::integer as value', values: [value],
        ...(named ? { name: 'read_value' } : {}),
        ...(scenario.includes('prepare-false') ? { prepare: false } : {}),
      });
      output.push(result.rows[0].value);
    }
    const statements = (await client.query('select name, statement, from_sql from pg_prepared_statements order by name')).rows;
    assert.deepEqual(output, [21, 22]);
    assert.equal(parses.length, named ? 1 : 2);
    assert.deepEqual(parses.map(x => x.name), named ? ['read_value'] : ['', '']);
    assert.equal(statements.length, named ? 1 : 0);
    if (named) assert.deepEqual(statements[0], {name:'read_value', statement:'select $1::integer as value', from_sql:false});
    results.push({ scenario, output, parses, statements });
  } finally {
    await client.end();
    await db.close();
  }
}
console.log(JSON.stringify(results, null, 2));
