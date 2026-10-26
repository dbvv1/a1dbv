import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { EventEmitter } from 'node:events';
import { validateInput, canonicalInput, frameCommands, wire, MAX_LINE } from './protocol.mjs';
const source = process.env.MOBA_SOURCE;
if (!source) throw new Error('set MOBA_SOURCE to the fixed clean source with npm ci completed');
const runner = fileURLToPath(new URL('./run.mjs', import.meta.url));
async function execute(frames, mode, directory = source) {
  return new Promise((resolveResult, reject) => {
    const child = spawn(process.execPath, ['--import', 'tsx', runner, resolve(directory), String(frames), mode], {cwd: source, stdio:['ignore','pipe','pipe']});
    let out = '', err = '', timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; child.kill('SIGTERM'); }, 25000);
    child.stdout.on('data', data => { out += data; }); child.stderr.on('data', data => { err += data; });
    child.once('error', error => { clearTimeout(timeout); reject(error); });
    child.once('exit', code => { clearTimeout(timeout); resolveResult({code, out, err, timedOut}); });
  });
}
test('real server + two independent processes: 300 input frames, reordered arrivals/retries agree', {timeout:55000}, async () => {
  const normal = await execute(300, 'normal');
  const jitter = await execute(300, 'jitter');
  for (const result of [normal, jitter]) {
    assert.equal(result.timedOut, false); assert.equal(result.code, 0, result.err);
  }
  const read = result => JSON.parse(result.out.split('\n').find(line => line.startsWith('{"manifest"')));
  const a = read(normal), b = read(jitter);
  assert.ok(a.acceptedCommands > 0); assert.equal(a.acceptedCommands, b.acceptedCommands);
  assert.ok(a.heroes.every(hero => Math.abs(hero.position.x) < 90));
  assert.equal(a.hash, b.hash); assert.equal(a.tick, 300); assert.equal(b.tick, 300);
  assert.deepEqual(a.verifiedClientAcks, [300, 300]); assert.deepEqual(b.verifiedClientAcks, [300, 300]);
  assert.equal(new Set([a.serverPid, ...a.clientPids]).size, 3);
  assert.equal(new Set([b.serverPid, ...b.clientPids]).size, 3);
  assert.ok(b.retries >= 2); assert.equal(a.retries, 0);
  for (const result of [normal, jitter]) {
    const clients = result.out.split('\n').filter(line => line.startsWith('CLIENT {')).map(line => JSON.parse(line.slice(7)));
    assert.equal(clients.length, 2);
    assert.ok(clients.every(client => client.hash === a.hash && client.tick === 300));
  }
  console.log(JSON.stringify({normalHash:a.hash,jitterHash:b.hash,retries:b.retries,normalArrival:a.arrivalOrder,jitterArrival:b.arrivalOrder}));
});
test('real disconnect ends session instead of silently supplying another player input', {timeout:12000}, async () => {
  const result = await execute(60, 'disconnect');
  assert.equal(result.timedOut, false); assert.notEqual(result.code, 0);
  assert.match(result.err, /disconnected|client exited/);
  assert.doesNotMatch(result.out, /verifiedClientAcks/);
});
test('incorrect hash stops both consumers at the mismatching frame', {timeout:12000}, async () => {
  const result = await execute(60, 'desync');
  assert.equal(result.timedOut, false); assert.notEqual(result.code, 0);
  assert.match(result.err, /state disagreement at tick 20/);
  assert.doesNotMatch(result.out, /verifiedClientAcks/);
});
test('missing source is an error, not a skipped or toy-simulation fallback', async () => {
  const result = await execute(30, 'normal', resolve(source, 'not-present'));
  assert.notEqual(result.code, 0); assert.doesNotMatch(result.out, /verifiedClientAcks/);
});
test('bounded input schema enforces hero ownership and finite data', () => {
  const valid = {kind:'input',tick:1,commands:[{type:'move',heroId:9,point:{x:0,z:0}},{type:'stop',heroId:9}]};
  assert.equal(validateInput(valid, 9), valid);
  assert.equal(canonicalInput(valid), canonicalInput(structuredClone(valid)));
  assert.equal(canonicalInput(valid), canonicalInput({commands:[{point:{z:0,x:0},heroId:9,type:'move'},{heroId:9,type:'stop'}],tick:1,kind:'input'}));
  assert.deepEqual(frameCommands([{commands:[]},valid]), valid.commands);
  for (const invalid of [null, {...valid,tick:0}, {...valid,tick:1.5}, {...valid,extra:true},
    {...valid,commands:[{type:'stop',heroId:10}]}, {...valid,commands:[{type:'move',heroId:9,point:{x:Infinity,z:0}}]},
    {...valid,commands:[{type:'stop',heroId:9,hp:9999}]}, {...valid,commands:Array(9).fill({type:'stop',heroId:9})}])
    assert.throws(() => validateInput(invalid, 9));
});
test('JSON wire handles fragmented/coalesced messages and rejects malformed/oversized lines', () => {
  class Socket extends EventEmitter { setEncoding() {} setNoDelay() {} }
  const socket = new Socket(), received = [], errors = [];
  wire(socket, message => received.push(message), error => errors.push(error));
  socket.emit('data','{"kind":'); socket.emit('data','"one"}\n{"kind":"two"}\n');
  assert.deepEqual(received,[{kind:'one'},{kind:'two'}]); assert.equal(errors.length,0);
  socket.emit('data','not-json\n'); assert.equal(errors.length,1);
  const huge = new Socket(); wire(huge, () => assert.fail(), error => errors.push(error));
  huge.emit('data','x'.repeat(MAX_LINE+1)); assert.match(errors.at(-1).message,/too large/);
});

test('actual simulation changes when same-frame order or input tick changes; coordinates alone are insufficient', () => {
  const probe = fileURLToPath(new URL('./order-probe.mjs', import.meta.url));
  const result = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', probe, resolve(source)], {cwd:source,encoding:'utf8',timeout:10000}));
  assert.equal(new Set(result.map(r => r.hash)).size, 3);
  assert.deepEqual(result[0].position, result[2].position);
  console.log(JSON.stringify({orderProbe:result}));
});
