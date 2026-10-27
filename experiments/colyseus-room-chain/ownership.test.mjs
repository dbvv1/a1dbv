import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@colyseus/sdk';
import { SessionOwner } from './session-owner.mjs';
import { setup, inspect, waitFor } from './harness.mjs';
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes,no) => { resolve = yes; reject = no; });
  return {promise,resolve,reject};
};
const state = (owner,predicate,label) => waitFor(() => {
  const current = owner.inspect();
  return predicate(current) ? current : false;
},label);
const disposed = h => waitFor(async () => {
  const s = await h.server.call('stats');
  return s.created === s.disposed && s.listed === 0 ? s : false;
},'all real rooms disposed');

test('same client switches a live duo to trio: old seat released, state and new input sequence owned by new room', {timeout:15000}, async () => {
  const h = await setup();
  try {
    const a=h.client(), b=h.client(), c=h.client(), d=h.client();
    await a.call('create',{name:'Alpha'});
    const old = await inspect(a,s=>s.initialized,'old room');
    await b.call('join',{name:'Bravo',roomId:old.roomId});
    await a.call('ready'); await b.call('ready');
    await inspect(a,s=>s.acceptedInput,'old playing');
    await a.call('activate'); await inspect(b,s=>s.snapshot.score===1,'old score 1');
    await a.call('create',{name:'AlphaNew',type:'trio'});
    const fresh = await inspect(a,s=>s.initialized && s.snapshot.capacity===3,'new room state');
    assert.notEqual(fresh.roomId,old.roomId);
    assert.notEqual(fresh.sessionId,old.sessionId);
    const left = await inspect(b,s=>s.snapshot.outcome==='peer-left','old session released');
    assert.equal(left.snapshot.score,1);
    assert.equal(Object.hasOwn(left.snapshot.players,old.sessionId),false);
    // A real message on the old round still arrives, but has no authority over a's new session.
    await b.call('activate',{raw:true,data:{seq:1,epoch:left.snapshot.epoch}});
    await inspect(b,s=>s.trace.some(e=>e.reason==='not-current-play'),'old round rejects gameplay');
    for (const [client,name] of [[c,'Charlie'],[d,'Delta']]) {
      await client.call('join',{name,roomId:fresh.roomId}); await client.call('ready');
    }
    await a.call('ready'); await inspect(a,s=>s.acceptedInput,'new trio playing');
    await Promise.all([a.call('activate'),a.call('activate')]);
    const two = await inspect(c,s=>s.snapshot.score===2,'two distinct new actions');
    assert.equal(two.snapshot.players[fresh.sessionId].lastSeq,2);
    assert.equal(Object.hasOwn(two.snapshot.players,old.sessionId),false);
    const current = await a.call('inspect');
    assert.equal(current.roomId,fresh.roomId);
    assert.equal(current.issuedSeq,2);
    assert.ok(current.trace.filter(e=>e.generation===fresh.generation).every(e=>e.roomId===fresh.roomId && e.sessionId===fresh.sessionId));
    await c.call('activate'); await inspect(a,s=>s.snapshot.outcome==='completed','new round result');
    for (const client of [a,b,c,d]) await client.call('leave');
    assert.equal((await disposed(h)).disposed,2);
  } finally { await h.close(); }
});

for (const retryDelay of [500,2500]) test(`leave during ${retryDelay} ms retry: late ${retryDelay===500?'success':'expiry'} preserves the new room and seq`, {timeout:15000}, async () => {
  const h = await setup();
  try {
    const a=h.client(), b=h.client();
    await a.call('create',{name:'Alpha'});
    const old = await inspect(a,s=>s.initialized,'old room');
    await b.call('join',{name:'Bravo',roomId:old.roomId});
    await a.call('ready'); await b.call('ready'); await inspect(a,s=>s.acceptedInput,'old playing');
    await a.call('drop',{retryDelay}); await inspect(a,s=>!s.initialized && s.trace.some(e=>e.kind==='drop'),'old retry scheduled');
    const leaving = a.call('leave');
    await a.call('create',{name:'AlphaNew'});
    const fresh = await inspect(a,s=>s.initialized && s.roomId!==old.roomId,'new room before old retry settles');
    assert.equal(fresh.retiring,1,'new room is current while old retry is still pending');
    await leaving;
    assert.equal((await h.server.call('stats')).reconnected,retryDelay===500?1:0);
    const peer = await inspect(b,s=>s.snapshot.outcome==='peer-left','old party ended');
    assert.equal(Object.hasOwn(peer.snapshot.players,old.sessionId),false);
    const c=h.client(); await c.call('join',{name:'Charlie',roomId:fresh.roomId});
    await a.call('ready'); await c.call('ready'); await inspect(a,s=>s.acceptedInput,'new playing');
    await a.call('activate');
    const one = await inspect(c,s=>s.snapshot.score===1,'new action confirmed');
    assert.equal(one.snapshot.players[fresh.sessionId].lastSeq,1);
    const current = await a.call('inspect');
    assert.equal(current.roomId,fresh.roomId); assert.equal(current.retiring,0);
    assert.ok(current.trace.filter(e=>e.generation===fresh.generation).every(e=>e.roomId===fresh.roomId));
    for (const client of [a,b,c]) await client.call('leave');
    await disposed(h);
  } finally { await h.close(); }
});

test('a late successful real SDK reconnect is released, not adopted over the newer room', {timeout:15000}, async () => {
  const h = await setup(), owner = new SessionOwner();
  const sdk = new Client(h.endpoint), delivered = deferred(), release = deferred();
  let pending;
  try {
    const original=h.client(), oldPeer=h.client();
    await original.call('create',{name:'Original'});
    const old=await inspect(original,s=>s.initialized,'original state');
    await oldPeer.call('join',{name:'OldPeer',roomId:old.roomId});
    await original.call('ready'); await oldPeer.call('ready');
    await inspect(original,s=>s.acceptedInput,'original playing');
    await original.call('activate'); await inspect(oldPeer,s=>s.snapshot.score===1,'original score');
    const token=await original.call('token');
    original.child.kill('SIGKILL'); await inspect(oldPeer,s=>s.snapshot.phase==='paused','original disconnected');
    // Hold only delivery to the application. Server, SDK handshake and restored state are real.
    pending = owner.connect(async () => {
      const room = await sdk.reconnect(token);
      delivered.resolve(room);
      await release.promise;
      return room;
    });
    const late = await delivered.promise;
    assert.equal(late.sessionId,old.sessionId);
    await owner.connect(() => sdk.create('duo',{name:'Current',protocol:1}));
    const fresh = await state(owner,s=>s.initialized,'current state');
    const peer=h.client(); await peer.call('join',{name:'Peer',roomId:fresh.roomId});
    owner.ready(); await peer.call('ready'); await state(owner,s=>s.acceptedInput,'current playing');
    release.resolve(); assert.deepEqual(await pending,{status:'superseded'});
    assert.equal(late.connection.isOpen,false);
    const oldEnd=await inspect(oldPeer,s=>s.snapshot.outcome==='peer-left','obsolete resumed seat released');
    assert.equal(oldEnd.snapshot.score,1);
    assert.equal(Object.hasOwn(oldEnd.snapshot.players,old.sessionId),false);
    assert.equal(owner.inspect().roomId,fresh.roomId);
    owner.activate(); owner.activate();
    const two = await inspect(peer,s=>s.snapshot.score===2,'current sequence');
    assert.equal(two.snapshot.players[fresh.sessionId].lastSeq,2);
    assert.equal(Object.hasOwn(two.snapshot.players,late.sessionId),false);
    assert.ok(owner.trace.every(e=>e.roomId===fresh.roomId));
    await owner.leave(); await peer.call('leave'); await oldPeer.call('leave');
    assert.equal((await disposed(h)).disposed,2);
  } finally { release.resolve(); await pending; await owner.leave(); await h.close(); }
});

test('cancel before a real join resolves leaves no current snapshot, input, token or orphaned room', {timeout:15000}, async () => {
  const h=await setup(), owner=new SessionOwner(), sdk=new Client(h.endpoint);
  const delivered=deferred(), release=deferred(); let pending;
  try {
    pending=owner.connect(async()=>{
      const room=await sdk.create('duo',{name:'Cancelled',protocol:1});
      delivered.resolve(room); await release.promise; return room;
    });
    const late=await delivered.promise;
    await owner.leave();
    assert.equal(owner.inspect().status,'idle'); assert.equal(owner.inspect().snapshot,null);
    assert.throws(()=>owner.activate(),/no current session/);
    assert.throws(()=>owner.token(),/no current session/);
    release.resolve(); assert.deepEqual(await pending,{status:'superseded'});
    assert.equal(late.connection.isOpen,false);
    assert.equal(owner.inspect().roomId,undefined); assert.equal(owner.trace.length,0);
    await disposed(h);
  } finally { release.resolve(); await pending; await owner.leave(); await h.close(); }
});

test('late failure cannot overwrite a newer successful session; current missing-room failure remains visible', {timeout:15000}, async () => {
  const h=await setup(), owner=new SessionOwner(), sdk=new Client(h.endpoint);
  const failed=deferred(), release=deferred(); let pending;
  try {
    pending=owner.connect(async()=>{
      try { return await sdk.joinById('missing-room',{name:'Missing',protocol:1}); }
      catch(error) { failed.resolve(); await release.promise; throw error; }
    });
    await failed.promise;
    await owner.connect(()=>sdk.create('duo',{name:'Current',protocol:1}));
    const fresh=await state(owner,s=>s.initialized,'fresh state after failure');
    release.resolve(); assert.deepEqual(await pending,{status:'superseded'});
    assert.equal(owner.inspect().roomId,fresh.roomId); assert.equal(owner.inspect().error,null);
    await assert.rejects(owner.connect(()=>sdk.joinById('missing-room',{name:'Missing',protocol:1})),/not found|does not exist|invalid/i);
    assert.equal(owner.inspect().status,'failed'); assert.equal(owner.inspect().snapshot,null);
    assert.match(owner.inspect().error,/not found|does not exist|invalid/i);
    assert.throws(()=>owner.ready(),/no current session/);
    await disposed(h);
  } finally { release.resolve(); await pending; await owner.leave(); await h.close(); }
});
