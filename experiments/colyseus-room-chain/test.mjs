import test from 'node:test';
import assert from 'node:assert/strict';
import {setup,inspect,waitFor,delay} from './harness.mjs';

async function party(h,type='duo',size=2){
  const clients=[h.client()];await clients[0].call('create',{name:'Alpha',type});
  const first=await inspect(clients[0],s=>s.initialized,'creator state');
  for(let n=1;n<size;n++){const c=h.client();clients.push(c);await c.call('join',{roomId:first.roomId,name:`Guest${n}`});}
  for(const c of clients)await inspect(c,s=>s.initialized && Object.keys(s.snapshot.players).length===size,'party state');
  return clients;
}
async function start(clients){for(const c of clients)await c.call('ready');for(const c of clients)await inspect(c,s=>s.acceptedInput,'playing ready');}
async function score(c,n){return inspect(c,s=>s.snapshot?.score===n,'authoritative score');}
async function cleaned(h){return waitFor(async()=>{const s=await h.server.call('stats');return s.listed===0 && s.created===s.disposed?s:false;},'room disposal');}

test('two independent clients: create/join, both ready, authoritative work, one result and empty-room disposal',{timeout:15000},async()=>{
  const h=await setup();try{
    const [a,b]=await party(h);await a.call('ready');await delay(60);
    assert.equal((await a.call('inspect')).snapshot.phase,'lobby');
    await a.call('activate',{raw:true,data:{seq:1,epoch:0}});
    await inspect(a,s=>s.trace.some(e=>e.reason==='not-current-play'),'reject early action');
    await b.call('ready');await inspect(a,s=>s.acceptedInput,'both ready');
    const before=await b.call('inspect');assert.equal(new Set([before.pid,(await a.call('inspect')).pid,h.server.child.pid]).size,3);
    await a.call('activate');await score(b,1);
    await a.call('activate',{raw:true,data:{seq:1,epoch:1}});await inspect(a,s=>s.trace.some(e=>e.reason==='already-seen'),'retry deduplicated');
    assert.equal((await b.call('inspect')).snapshot.score,1);
    await b.call('activate');await score(a,2);await a.call('activate');
    for(const c of [a,b]){const end=await inspect(c,s=>s.snapshot.phase==='ended','joint result');assert.equal(end.snapshot.outcome,'completed');assert.equal(end.snapshot.score,3);}
    await a.call('leave');await b.call('leave');assert.equal((await cleaned(h)).disposed,1);
  }finally{await h.close();}
});

test('matchmaking uses native room type; bad protocol, missing room and full party do not become successful joins',{timeout:15000},async()=>{
  const h=await setup();try{
    const a=h.client(),b=h.client(),c=h.client();
    await assert.rejects(a.call('create',{name:'Alpha',protocol:99}),/protocol/);
    await a.call('match',{name:'Alpha'});await b.call('match',{name:'Bravo'});
    const x=await inspect(a,s=>s.snapshot?.players && Object.keys(s.snapshot.players).length===2,'matched same room');
    assert.equal((await b.call('inspect')).roomId,x.roomId);
    await assert.rejects(c.call('join',{name:'Charlie',roomId:x.roomId}),/locked|full|seat/i);
    await assert.rejects(c.call('join',{name:'Charlie',roomId:'missing-room'}),/not found|does not exist|invalid/i);
    await c.call('match',{name:'Charlie',type:'trio'});await inspect(c,s=>s.initialized,'separate mode');assert.notEqual((await c.call('inspect')).roomId,x.roomId);
  }finally{await h.close();}
});

test('automatic reconnection keeps seat and score but stale queued gameplay input is rejected',{timeout:15000},async()=>{
  const h=await setup();try{
    const [a,b]=await party(h);await start([a,b]);await a.call('activate');await score(b,1);
    const prior=await a.call('inspect'),token=await a.call('token');
    await a.call('drop');await inspect(b,s=>s.snapshot.phase==='paused','server pauses while disconnected');
    await inspect(a,s=>s.trace.some(e=>e.kind==='drop'),'SDK observes drop');
    await a.call('activate',{raw:true,data:{seq:2,epoch:prior.snapshot.epoch}});
    const after=await inspect(a,s=>s.acceptedInput && s.trace.some(e=>e.kind==='reconnected-before-state'),'state restored after reconnect');
    assert.equal(after.sessionId,prior.sessionId);assert.equal(after.snapshot.score,1);assert.ok(after.snapshot.epoch>prior.snapshot.epoch);
    assert.notEqual(await a.call('token'),token);
    await inspect(a,s=>s.trace.some(e=>e.reason==='not-current-play'),'stale buffered command rejected');
    await a.call('activate');await score(b,2);await inspect(b,s=>s.acceptedInput,'peer sees resumed state');await b.call('activate');await score(a,3);assert.equal((await h.server.call('stats')).reconnected,1);
  }finally{await h.close();}
});

test('new client process manually resumes the reserved session and reattaches state listeners',{timeout:15000},async()=>{
  const h=await setup();try{
    const [a,b]=await party(h);await start([a,b]);await a.call('activate');await score(b,1);
    const old=await a.call('inspect'),token=await a.call('token');
    a.child.kill('SIGKILL');await inspect(b,s=>s.snapshot.phase==='paused','socket loss pauses');
    const replacement=h.client();await replacement.call('reconnect',{token});
    const restored=await inspect(replacement,s=>s.acceptedInput,'new process full state');
    assert.notEqual(restored.pid,old.pid);assert.equal(restored.sessionId,old.sessionId);assert.equal(restored.snapshot.score,1);
    assert.equal(restored.snapshot.players[old.sessionId].lastSeq,1);assert.notEqual(await replacement.call('token'),token);
    await replacement.call('activate');await score(b,2);await inspect(b,s=>s.acceptedInput,'peer sees resumed state');await b.call('activate');await score(replacement,3);
  }finally{await h.close();}
});

test('expired reservation ends the old round; reconnect does not silently create a new one',{timeout:15000},async()=>{
  const h=await setup();try{
    const [a,b]=await party(h);await start([a,b]);const token=await a.call('token');
    a.child.kill('SIGKILL');const ended=await inspect(b,s=>s.snapshot.phase==='ended','reconnect timeout');assert.equal(ended.snapshot.outcome,'peer-left');
    const replacement=h.client();await assert.rejects(replacement.call('reconnect',{token}),/reconnect|expired|seat|session/i);
    await b.call('leave');await cleaned(h);
  }finally{await h.close();}
});

test('second requirement: server-owned three-player party cannot start with only two ready',{timeout:15000},async()=>{
  const h=await setup();try{
    const [a,b,c]=await party(h,'trio',3);await a.call('ready');await b.call('ready');await delay(60);
    assert.equal((await a.call('inspect')).snapshot.phase,'lobby');await c.call('ready');
    for(const client of [a,b,c])await inspect(client,s=>s.acceptedInput,'three ready');
    for(let i=0;i<3;i++){await [a,b,c][i].call('activate');await score(a,i+1);}
    for(const client of [a,b,c]){assert.equal((await inspect(client,s=>s.snapshot.phase==='ended','trio result')).snapshot.score,3);await client.call('leave');}
    await cleaned(h);
  }finally{await h.close();}
});

test('consented lobby departure frees the automatic capacity lock; replacement must become ready',{timeout:15000},async()=>{
  const h=await setup();try{
    const [a,b]=await party(h);await a.call('ready');const id=(await a.call('inspect')).roomId;
    await b.call('leave');await inspect(a,s=>Object.keys(s.snapshot.players).length===1,'consented removal');
    const c=h.client();await c.call('join',{name:'Replacement',roomId:id});
    await inspect(a,s=>Object.keys(s.snapshot.players).length===2,'replacement joined');assert.equal((await a.call('inspect')).snapshot.phase,'lobby');
    await c.call('ready');await inspect(a,s=>s.acceptedInput,'replacement ready');
    await c.call('leave');assert.equal((await inspect(a,s=>s.snapshot.phase==='ended','active departure ends')).snapshot.outcome,'peer-left');
    assert.equal((await h.server.call('stats')).drops,0);
  }finally{await h.close();}
});


test('distinct fast operations get distinct local sequence numbers, including after full-state reconnection',{timeout:15000},async()=>{
  const h=await setup();try{
    const [a,b]=await party(h);await start([a,b]);
    await Promise.all([a.call('activate'),a.call('activate')]);
    const two=await score(b,2);const id=(await a.call('inspect')).sessionId;
    assert.equal(two.snapshot.players[id].lastSeq,2);
    assert.equal((await a.call('inspect')).trace.filter(e=>e.reason==='already-seen').length,0);
    await a.call('drop');await inspect(b,s=>s.snapshot.phase==='paused','paused fast-input round');
    await inspect(a,s=>s.acceptedInput&&s.snapshot.epoch>two.snapshot.epoch,'restored fast-input state');
    await a.call('activate');const final=await score(b,3);
    assert.equal(final.snapshot.players[id].lastSeq,3);assert.equal(final.snapshot.outcome,'completed');
  }finally{await h.close();}
});
