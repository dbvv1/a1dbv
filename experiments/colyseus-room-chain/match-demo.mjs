import assert from 'node:assert/strict';
import {startService} from '../nakama-player-progress/service.mjs';
import {read} from '../nakama-player-progress/client.mjs';
import {setupMatch,state} from './match-harness.mjs';
const mode=process.argv[2]??'normal';
if(!['normal','retry'].includes(mode))throw Error('usage: node match-demo.mjs normal|retry');
let service,run;
try{
  service=await startService();run=await setupMatch(service,{crashAfterFirst:mode==='retry'});
  const {peers,roomId}=await run.joinPair();
  await peers[0].call('ready');
  const lobby=await state(peers[0],s=>Object.values(s.snapshot.players).some(p=>p.ready),'first ready');
  assert.equal(lobby.snapshot.phase,'lobby');assert.equal((await run.server.call('stats')).jobsStarted,0);
  console.log('Two authenticated synthetic seats joined; one ready does not start a job.');
  await peers[1].call('ready');
  if(mode==='retry'){
    await state(peers[0],s=>s.snapshot?.phase==='settlement-pending','pending result');
    console.log('Sender exited after first database commit; room does not report completed.');
    await service.restart();await peers[0].call('retry');
  }
  const a=await state(peers[0],s=>s.snapshot?.phase==='completed','confirmed result');
  const b=await state(peers[1],s=>s.snapshot?.phase==='completed','peer confirmed result');
  assert.equal(a.snapshot.matchId,b.snapshot.matchId);assert.equal(a.snapshot.hash,b.snapshot.hash);
  console.log('Shared server result:',{roomId,matchId:a.snapshot.matchId,winner:a.snapshot.winner,tick:a.snapshot.tick,
    hash:a.snapshot.hash,confirmed:a.snapshot.confirmed,duplicateReceipts:a.snapshot.duplicates});
  for(const [team,session] of run.sessions.entries()){
    const progress=(await read(run.backend,session,'progress','main')).value;
    assert.equal(progress.runs,1);
    const rank=await run.backend.rpc(session,'repair_my_rank',{});
    console.log('Synthetic seat',team,'confirmed progress',progress,'rank',rank.payload.score);
  }
  await Promise.all(peers.map(peer=>peer.call('leave')));
  const stats=await import('./harness.mjs').then(({waitFor})=>waitFor(async()=>{
    const value=await run.server.call('stats');return value.listed===0&&value.disposed===value.created?value:false;
  },'room disposal'));
  console.log('Room disposed:',{jobs:stats.jobsStarted,deliveries:stats.deliveries,disposed:stats.disposed});
  console.log('Loopback synthetic test only: room readiness starts an existing bot simulation, not human gameplay or spectator reward policy.');
}finally{await run?.close();await service?.close();}
