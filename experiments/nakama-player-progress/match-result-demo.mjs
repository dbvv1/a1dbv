import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join,resolve} from 'node:path';
import {startService} from './service.mjs';
import {makeClient,player,read} from './client.mjs';
import {produce,deliver} from './match-process.mjs';
const source=process.env.MOBA_SOURCE;
if (!source) throw new Error('set MOBA_SOURCE to the fixed clean MOBA checkout with npm ci completed');
let service;
try {
  service=await startService();const client=makeClient(service),sessions=[await player(client),await player(client)];
  const players=[];
  for (const [team,session] of sessions.entries()) players.push({team,userId:(await client.getAccount(session)).user.id});
  const path=join(service.dir,'completed-match.json');
  const run=await produce({source:resolve(source),path,matchId:randomUUID(),players});
  console.log('Original MOBA authority ended:',run.response.result);
  const interrupted=await deliver(service,path,{crashAfterFirst:true});
  assert.equal(interrupted.code,17);assert.equal(interrupted.response,undefined);
  console.log('Delivery process exited after first database commit, before acknowledgement. Result file retained.');
  await service.restart();
  const retry=await deliver(service,path);
  assert.equal(retry.code,0,retry.response?.error??retry.log);
  assert.deepEqual(retry.response.result,[{team:0,duplicate:true},{team:1,duplicate:false}]);
  console.log('New delivery process after Nakama restart:',retry.response.result);
  for (const [team,session] of sessions.entries()) {
    const progress=(await read(client,session,'progress','main')).value;
    assert.equal(progress.runs,1);
    const before=await client.listLeaderboardRecords(session,'best_run_v1',[session.user_id],100);
    assert.equal(before.owner_records.length,0);
    const rank=await client.rpc(session,'repair_my_rank',{});
    console.log('Team',team,'confirmed progress',progress,'repaired best',rank.payload.score);
  }
  console.log('Two original simulated teams, synthetic accounts, loopback services; no product integration or power-loss recovery claim.');
} finally { await service?.close(); }
