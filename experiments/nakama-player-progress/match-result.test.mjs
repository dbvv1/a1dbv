import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile,writeFile,access} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {startService} from './service.mjs';
import {makeClient,player,read,failure} from './client.mjs';
import {settle} from './trusted-backend.mjs';
import {readResult} from './match-result.mjs';
import {produce,deliver} from './match-process.mjs';
const source=process.env.MOBA_SOURCE;
if (!source) throw new Error('set MOBA_SOURCE to the fixed clean MOBA checkout with npm ci completed');
let service,client,sessions,path,produced;
before(async()=>{
  service=await startService();client=makeClient(service);
  sessions=[await player(client),await player(client)];
  const players=[];
  for (const [team,session] of sessions.entries()) players.push({team,userId:(await client.getAccount(session)).user.id});
  path=join(service.dir,'completed-match.json');
  produced=await produce({source:resolve(source),path,matchId:randomUUID(),players});
},{timeout:40000});
after(async()=>{
  const pids=service?.ownedPids()??[];await service?.close();
  for (const pid of pids) assert.throws(()=>process.kill(pid,0),e=>e.code==='ESRCH');
});
const ranks=async session=>(await client.listLeaderboardRecords(session,'best_run_v1',[session.user_id],100)).owner_records;

test('real authority ends and replays; sender dies after one commit, a new process resumes without duplicate rewards',async()=>{
  const actual=produced.response.result;
  assert.equal(actual.source,'3bcda00fb35361cc5a25ee74e3768a2f3678c563');
  assert.equal(actual.status,'redWin');assert.equal(actual.winner,1);
  assert.equal(actual.hash,'e92fbbda809dc635');assert.equal(actual.replayHash,actual.hash);
  assert.equal(actual.tick,26794);assert.equal(actual.endReason,'blueBaseDestroyed');
  const bytes=await readFile(path),first=await deliver(service,path,{crashAfterFirst:true});
  assert.equal(first.code,17);assert.equal(first.response,undefined);
  assert.equal((await read(client,sessions[0],'progress','main')).value.runs,1);
  assert.equal(await read(client,sessions[1],'progress','main'),undefined);
  await service.restart();
  const retry=await deliver(service,path);
  assert.equal(retry.code,0,retry.response?.error??retry.log);
  assert.deepEqual(retry.response.result,[{team:0,duplicate:true},{team:1,duplicate:false}]);
  assert.notEqual(first.pid,retry.pid);assert.notEqual(produced.pid,retry.pid);
  assert.deepEqual(await readFile(path),bytes);
  for (const [team,session] of sessions.entries()) {
    const score=team===actual.winner?100:0;
    assert.deepEqual((await read(client,session,'progress','main')).value,{schema:1,xp:score/10,best:score,runs:1});
    assert.equal((await ranks(session)).length,0);
    await client.rpc(session,'repair_my_rank',{});await client.rpc(session,'repair_my_rank',{});
    assert.equal((await ranks(session))[0].score,score);
  }
  const again=await deliver(service,path);
  assert.equal(again.code,0);assert.ok(again.response.result.every(r=>r.duplicate));
  for (const session of sessions) assert.equal((await read(client,session,'progress','main')).value.runs,1);
});

test('same match and score with changed evidence conflicts; clients still cannot submit the actual server result',async()=>{
  const {requests}=await readResult(path);
  assert.equal((await failure(settle(service,{...requests[0],resultFingerprint:'0'.repeat(64)}))).code,9);
  assert.equal((await failure(client.rpc(sessions[1],'settle_demo_result',requests[1]))).code,7);
  assert.equal((await failure(settle(service,{...requests[1],resultFingerprint:'invalid'}))).code,3);
  for (const session of sessions) assert.equal((await read(client,session,'progress','main')).value.runs,1);
});

test('timeout is complete but not a victory: real original simulation produces no settlement file',async()=>{
  const {record}=await readResult(path),failedPath=join(service.dir,'timeout-result.json');
  await assert.rejects(produce({source:resolve(source),path:failedPath,matchId:randomUUID(),players:record.players,maxMatchSeconds:1}),/no winning terminal result: timeout/);
  await assert.rejects(access(failedPath),e=>e.code==='ENOENT');
  for (const session of sessions) assert.equal((await read(client,session,'progress','main')).value.runs,1);
});

test('missing source or malformed/missing result fails rather than falling back to a synthetic score',async()=>{
  const {record}=await readResult(path),badPath=join(service.dir,'bad-result.json');
  await assert.rejects(produce({source:join(resolve(source),'not-present'),path:badPath,matchId:randomUUID(),players:record.players}),/ENOENT/);
  await writeFile(badPath,JSON.stringify({...record,result:{...record.result,winner:null}}));
  const malformed=await deliver(service,badPath);assert.equal(malformed.code,1);assert.match(malformed.response.error,/invalid completed match/);
  const missing=await deliver(service,join(service.dir,'missing-result.json'));assert.equal(missing.code,1);assert.match(missing.response.error,/ENOENT/);
  for (const session of sessions) assert.equal((await read(client,session,'progress','main')).value.runs,1);
});
