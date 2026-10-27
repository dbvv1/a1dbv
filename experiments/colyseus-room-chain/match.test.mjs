import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {join} from 'node:path';
import {startService} from '../nakama-player-progress/service.mjs';
import {read,player} from '../nakama-player-progress/client.mjs';
import {setupMatch,state} from './match-harness.mjs';
import {waitFor} from './harness.mjs';
let service;
before(async()=>{service=await startService();});
after(async()=>{await service?.close();});
const phase=(peer,name)=>state(peer,s=>s.snapshot?.phase===name,name);
async function readyBoth(peers){await peers[0].call('ready');await peers[1].call('ready');}
async function assertNoProgress(run){for(const session of run.sessions)assert.equal(await read(run.backend,session,'progress','main'),undefined);}
async function assertProgress(run,winner){
  for(const [team,session] of run.sessions.entries()){
    const progress=(await read(run.backend,session,'progress','main')).value;
    assert.equal(progress.runs,1);assert.equal(progress.best,team===winner?100:0);
  }
}

test('authenticated configured seats and one ready barrier reach one real terminal result',{timeout:45000},async()=>{
  const run=await setupMatch(service);
  try{
    const a=run.client(),bad=run.client();
    await assert.rejects(bad.call('create'),/synthetic session required/);
    assert.equal((await run.server.call('stats')).created,0);
    const created=await a.call('create',{token:run.sessions[0].token});
    await assert.rejects(bad.call('join',{roomId:created.roomId,token:'not-a-session'}),/authentication failed/);
    await assert.rejects(bad.call('join',{roomId:created.roomId,token:run.sessions[0].token}),/seat already joined/);
    const outsider=await player(run.backend);
    await assert.rejects(bad.call('join',{roomId:created.roomId,token:outsider.token}),/not a configured synthetic seat/);
    await assert.rejects(bad.call('join',{roomId:created.roomId,token:run.sessions[1].token,extra:{userId:run.demoSeats[0].userId}}),/synthetic session required/);
    const b=run.client();await b.call('join',{roomId:created.roomId,token:run.sessions[1].token});
    await state(a,s=>Object.keys(s.snapshot?.players??{}).length===2,'two seats');
    await a.call('raw',{type:'ready',data:{ready:true,score:999}});
    await state(a,s=>s.trace.some(e=>e.kind==='rejected'),'result fields rejected');
    await a.call('ready');await a.call('ready');
    const first=await state(a,s=>Object.values(s.snapshot.players).some(p=>p.ready),'one ready');
    assert.equal(first.snapshot.phase,'lobby');assert.equal((await run.server.call('stats')).jobsStarted,0);
    await b.call('ready');await b.call('ready');
    const done=await phase(a,'completed'),peer=await phase(b,'completed');
    assert.equal(done.snapshot.matchId,peer.snapshot.matchId);assert.equal(done.snapshot.hash,peer.snapshot.hash);
    assert.equal(done.snapshot.tick,26794);assert.equal(done.snapshot.hash,'e92fbbda809dc635');
    assert.equal(done.snapshot.confirmed,2);assert.equal(done.snapshot.duplicates,0);
    await assertProgress(run,done.snapshot.winner);
    await a.call('retry');await state(a,s=>s.trace.some(e=>e.reason==='no-pending-result'),'completed retry rejected');
    const stats=await run.server.call('stats');assert.equal(stats.jobsStarted,1);assert.equal(stats.deliveries,1);
    await a.call('leave');await b.call('leave');
    await waitFor(async()=>{const s=await run.server.call('stats');return s.disposed===s.created&&s.listed===0;},'all rooms disposed');
  }finally{await run.close();}
});

test('room pending result survives sender failure and backend restart without another match or reward',{timeout:45000},async()=>{
  const run=await setupMatch(service,{crashAfterFirst:true});
  try{
    const {peers}=await run.joinPair();await readyBoth(peers);
    const pending=await phase(peers[0],'settlement-pending');
    assert.equal(pending.snapshot.confirmed,0);
    assert.equal((await read(run.backend,run.sessions[0],'progress','main')).value.runs,1);
    assert.equal(await read(run.backend,run.sessions[1],'progress','main'),undefined);
    const path=join(run.resultDir,pending.snapshot.matchId+'.json'),beforeBytes=await readFile(path);
    await service.restart();
    await Promise.all(peers.map(peer=>peer.call('retry')));
    const done=await phase(peers[0],'completed');await phase(peers[1],'completed');
    assert.equal(done.snapshot.matchId,pending.snapshot.matchId);assert.equal(done.snapshot.hash,pending.snapshot.hash);
    assert.equal(done.snapshot.duplicates,1);assert.equal(done.snapshot.confirmed,2);
    assert.deepEqual(await readFile(path),beforeBytes);await assertProgress(run,done.snapshot.winner);
    const stats=await run.server.call('stats');assert.equal(stats.jobsStarted,1);assert.equal(stats.deliveries,2);
    for(const [team,session] of run.sessions.entries()){
      const rank=await run.backend.rpc(session,'repair_my_rank',{});assert.equal(rank.payload.score,team===done.snapshot.winner?100:0);
    }
  }finally{await run.close();}
});

test('leaving an incomplete lobby never starts a simulation or grants progress',{timeout:15000},async()=>{
  const run=await setupMatch(service);
  try{
    const {peers}=await run.joinPair();await peers[0].call('ready');await peers[1].call('leave');
    const lobby=await state(peers[0],s=>Object.keys(s.snapshot?.players??{}).length===1,'departed lobby seat');
    assert.equal(lobby.snapshot.phase,'lobby');assert.equal(Object.values(lobby.snapshot.players)[0].ready,false);
    assert.equal((await run.server.call('stats')).jobsStarted,0);await assertNoProgress(run);
  }finally{await run.close();}
});

test('original simulation timeout reports failure rather than a winning result',{timeout:30000},async()=>{
  const run=await setupMatch(service,{maxMatchSeconds:0.1});
  try{
    const {peers}=await run.joinPair();await readyBoth(peers);
    const failed=await phase(peers[0],'failed');await phase(peers[1],'failed');
    assert.equal(failed.snapshot.reason,'simulation-failed');assert.equal(failed.snapshot.confirmed,0);
    const stats=await run.server.call('stats');assert.equal(stats.jobsStarted,1);assert.equal(stats.jobsFinished,1);assert.equal(stats.deliveries,0);
    await assert.rejects(access(join(run.resultDir,failed.snapshot.matchId+'.json')),/ENOENT/);await assertNoProgress(run);
  }finally{await run.close();}
});

test('leaving a running room discards the finite worker result before settlement',{timeout:45000},async()=>{
  const run=await setupMatch(service);
  try{
    const {peers}=await run.joinPair();await readyBoth(peers);await phase(peers[0],'running');
    await peers[0].call('leave');const aborted=await phase(peers[1],'aborted');
    assert.equal(aborted.snapshot.reason,'seat-left-before-result');
    await waitFor(async()=>{const s=await run.server.call('stats');return s.jobsFinished===1&&s.activeWork===0;},'finite worker drained',30000);
    const stats=await run.server.call('stats');assert.equal(stats.deliveries,0);
    await assert.rejects(access(join(run.resultDir,aborted.snapshot.matchId+'.json')),/ENOENT/);await assertNoProgress(run);
  }finally{await run.close();}
});
