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


test('real skill inputs consume original dash/mana/cooldown once; current and old retries match committed prefix replay', {timeout:45000}, async () => {
  const runs = [await execute(270,'cast'),await execute(270,'cast-jitter')];
  const receipts = runs.map(result => {
    assert.equal(result.timedOut,false);assert.equal(result.code,0,result.err);
    return JSON.parse(result.out.split('\n').find(line => line.startsWith('{"manifest"')));
  });
  const [normal,jitter] = receipts;
  assert.equal(normal.hash,jitter.hash);assert.equal(normal.acceptedCommands,4);
  assert.equal(normal.retries,0);assert.equal(jitter.retries,49);
  assert.deepEqual(normal.casts,jitter.casts);assert.deepEqual(normal.heroState,jitter.heroState);
  const close = (a,b) => assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
  for (const [index,receipt] of receipts.entries()) {
    assert.equal(receipt.hash,receipt.replayHash);assert.deepEqual(receipt.verifiedClientAcks,[270,270]);
    assert.equal(new Set([receipt.serverPid,...receipt.clientPids]).size,3);
    const clients = runs[index].out.split('\n').filter(line => line.startsWith('CLIENT {')).map(line=>JSON.parse(line.slice(7)));
    assert.equal(clients.length,2);assert.ok(clients.every(client=>client.hash===receipt.hash));
    assert.deepEqual(receipt.casts.map(frame=>frame.tick),[1,11,12,253]);
    const [invalid,first,cooldown,second] = receipt.casts;
    assert.ok(invalid.results.every(result=>!result.accepted && result.reason==='directionRequired'));
    assert.ok(cooldown.results.every(result=>!result.accepted && result.reason==='cooldown'));
    for (const cast of [first,second]) {
      assert.ok(cast.results.every(result=>result.accepted && result.reason===null));
      for (let seat=0;seat<2;seat++) {
        close(cast.after[seat].position.x-cast.before[seat].position.x,seat ? -7 : 7);
        close(cast.after[seat].mana,cast.before[seat].mana-30+8/30);
        assert.equal(cast.before[seat].cooldowns.W,0);assert.equal(cast.after[seat].cooldowns.W,239);
      }
    }
    for (let seat=0;seat<2;seat++) {
      assert.equal(invalid.after[seat].mana,invalid.before[seat].mana);
      assert.deepEqual(invalid.after[seat].position,invalid.before[seat].position);
      assert.deepEqual(cooldown.after[seat].position,cooldown.before[seat].position);
      close(cooldown.after[seat].mana,cooldown.before[seat].mana+8/30);
      assert.equal(cooldown.after[seat].cooldowns.W,238);
      close(receipt.heroState[seat].mana,304.8);assert.equal(receipt.heroState[seat].cooldowns.W,222);
    }
  }
  console.log(JSON.stringify({skillHash:normal.hash,replayHash:normal.replayHash,retries:jitter.retries,
    accepted:normal.acceptedCommands,finalMana:normal.heroState.map(hero=>hero.mana)}));
});

for (const [mode,reason] of [['cast-forged','input does not own this hero'],['cast-malformed','unsupported or malformed command'],
  ['cast-future','input is not for the open frame'],['cast-conflict','conflicting retry for committed input']]) {
  test(`real ${mode} is a protocol abort, not a gameplay cooldown rejection`,{timeout:12000},async()=>{
    const result=await execute(270,mode);
    assert.equal(result.timedOut,false);assert.notEqual(result.code,0);assert.ok(result.err.includes(reason),result.err);
    assert.doesNotMatch(result.out,/verifiedClientAcks/);
    const state=JSON.parse(result.err.split('\n').find(line=>line.startsWith('CAST_ABORT_STATE ')).slice(17));
    assert.equal(state.tick,mode==='cast-conflict'?19:10);
    const accepted=state.casts.flatMap(frame=>frame.results).filter(result=>result.accepted).length;
    assert.equal(accepted,mode==='cast-conflict'?2:0);
    if (mode!=='cast-conflict') assert.ok(state.heroes.every(hero=>hero.mana===330 && hero.cooldowns.W===0));
  });
}

test('cast schema checks connection ownership and shape while preserving all intent fields for retry identity',()=>{
  const cast={type:'cast',heroId:9,slot:'W',targetId:null,direction:{x:1,z:0},point:null};
  const input={kind:'input',tick:11,commands:[cast]};
  assert.equal(validateInput(input,9),input);
  const reordered={commands:[{point:null,direction:{z:0,x:1},targetId:null,slot:'W',heroId:9,type:'cast'}],tick:11,kind:'input'};
  assert.equal(canonicalInput(input),canonicalInput(validateInput(reordered,9)));
  // Zero direction is finite/valid wire data; the original ability decides whether it can be cast.
  assert.doesNotThrow(()=>validateInput({...input,commands:[{...cast,direction:{x:0,z:0}}]},9));
  for (const change of [{slot:'Q'},{targetId:10},{direction:{x:-1,z:0}},{point:{x:0,z:0}}])
    assert.notEqual(canonicalInput(input),canonicalInput(validateInput({...input,commands:[{...cast,...change}]},9)));
  for (const change of [{heroId:10},{slot:'X'},{targetId:-1},{targetId:1.5},{direction:{x:Infinity,z:0}},
    {direction:{x:1,z:0,y:0}},{point:{x:201,z:0}},{mana:9999},{cooldowns:{W:0}}])
    assert.throws(()=>validateInput({...input,commands:[{...cast,...change}]},9));
  const missing={...cast};delete missing.point;assert.throws(()=>validateInput({...input,commands:[missing]},9));
  assert.notEqual(canonicalInput({...input,commands:[cast,{type:'stop',heroId:9}]}),
    canonicalInput({...input,commands:[{type:'stop',heroId:9},cast]}));
});
