import assert from 'node:assert/strict';
import {setup,inspect,waitFor,delay} from './harness.mjs';
const mode=process.argv[2]??'normal';
if(!['normal','reconnect','restart','timeout','trio'].includes(mode))throw new Error('usage: node demo.mjs normal|reconnect|restart|timeout|trio');
const h=await setup();
try{
  const size=mode==='trio'?3:2,clients=[h.client()];
  await clients[0].call('create',{name:'Alpha',type:size===3?'trio':'duo'});
  let first=await inspect(clients[0],s=>s.initialized,'creator full state');
  console.log(`Created ${first.roomId}; server PID ${h.server.child.pid}, capacity ${size}`);
  for(let i=1;i<size;i++){const c=h.client();clients.push(c);await c.call('join',{roomId:first.roomId,name:`Guest${i}`});}
  for(const c of clients)await inspect(c,s=>s.snapshot && Object.keys(s.snapshot.players).length===size,'everyone joined');
  console.log(`Joined independent client PIDs: ${(await Promise.all(clients.map(c=>c.call('inspect')))).map(s=>s.pid).join(', ')}`);
  for(let i=0;i<size-1;i++)await clients[i].call('ready');await delay(60);
  assert.equal((await clients[0].call('inspect')).snapshot.phase,'lobby');console.log('One player still not ready: remains in lobby.');
  await clients.at(-1).call('ready');for(const c of clients)await inspect(c,s=>s.acceptedInput,'all ready');
  await clients[0].call('activate');await inspect(clients[1],s=>s.snapshot.score===1,'first shared switch');
  console.log('Playing: one server-confirmed activation, shared score 1/3.');
  if(['reconnect','restart','timeout'].includes(mode)){
    const before=await clients[0].call('inspect'),token=await clients[0].call('token');
    if(mode==='reconnect')await clients[0].call('drop');else clients[0].child.kill('SIGKILL');
    await inspect(clients[1],s=>s.snapshot.phase==='paused','server pause');console.log('Disconnected: server preserves seat and state, gameplay paused.');
    if(mode==='timeout'){
      const end=await inspect(clients[1],s=>s.snapshot.phase==='ended','timeout result');assert.equal(end.snapshot.outcome,'peer-left');
      const replacement=h.client();await assert.rejects(replacement.call('reconnect',{token}));
      console.log('Reservation expired: old round ended; old token fails, no new room silently created.');
    }else{
      if(mode==='restart'){clients[0]=h.client();await clients[0].call('reconnect',{token});}
      const resumed=await inspect(clients[0],s=>s.acceptedInput && s.snapshot.epoch>before.snapshot.epoch,'new authoritative state');
      assert.equal(resumed.sessionId,before.sessionId);assert.equal(resumed.snapshot.score,1);assert.notEqual(await clients[0].call('token'),token);
      console.log(`${mode==='restart'?'New process':'Same SDK room'} resumed original seat and score; token rotated, input opens only after state.`);
    }
  }
  if(mode!=='timeout'){
    for(const c of clients)await inspect(c,s=>s.acceptedInput,'every client sees resumed playing state');
    await clients[1].call('activate');await inspect(clients[0],s=>s.snapshot.score===2,'second switch');
    await clients[0].call('activate');for(const c of clients)await inspect(c,s=>s.snapshot.phase==='ended'&&s.snapshot.outcome==='completed','common completed result');
    console.log('Ended: every client sees completed, score 3/3.');
  }
  for(const c of clients)if(!c.child.killed)await c.call('leave');
  const disposed=await waitFor(async()=>{const s=await h.server.call('stats');return s.listed===0&&s.created===s.disposed?s:false;},'room cleaned');
  console.log(`Disposed: ${disposed.disposed}/${disposed.created}; listed rooms ${disposed.listed}.`);
}finally{await h.close();console.log('Closed server and all client processes.');}
