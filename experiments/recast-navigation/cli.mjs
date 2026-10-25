import assert from 'node:assert/strict';
import { bake, simulate } from './navigation.mjs';

try {
  const [command, directory, variant, ...extra] = process.argv.slice(2);
  assert.ok(directory && extra.length === 0, 'usage: node cli.mjs bake DIRECTORY [open|split] | run DIRECTORY');
  assert.ok(command === 'bake' || command === 'run', 'unknown command');
  assert.ok(command === 'bake' || variant === undefined, 'run takes only DIRECTORY');
  const result = command === 'bake' ? await bake(directory, variant) : await simulate(directory);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
