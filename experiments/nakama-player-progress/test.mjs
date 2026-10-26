import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {startService} from './service.mjs';
import {makeClient,player,identity,slot,read,settle,failure} from './client.mjs';
let service,client;
before(async()=>{service=await startService();client=makeClient(service)},{timeout:30000});
after(async()=>{const pids=service?.ownedPids()??[];await service?.close();for(const pid of pids)assert.throws(()=>process.kill(pid,0),e=>e.code==='ESRCH','owned service child still exists')});
const result=(session,id,score,rule=1)=>({userId:session.user_id,matchId:id,score,rule});
const ranks=async session=>(await client.listLeaderboardRecords(session,'best_run_v1',[session.user_id],100)).owner_records;

test('device identity is not cross-device recovery; linking then logging in preserves the original account',async()=>{
 const id=randomUUID(),first=await client.authenticateDevice(id,true);
 assert.equal((await client.authenticateDevice(id,false)).user_id,first.user_id);
 const credentials=identity();await client.linkEmail(first,credentials);
 const other=makeClient(service),restored=await other.authenticateEmail(credentials.email,credentials.password,false);
 assert.equal(restored.user_id,first.user_id);
 const guest=await player(other);assert.notEqual(guest.user_id,first.user_id);
 assert.equal((await failure(other.linkEmail(guest,credentials))).code,6);
 assert.notEqual((await other.getAccount(guest)).user.id,first.user_id);
});

test('private cloud save requires a version; stale writes conflict rather than replace newer data',async()=>{
 const a=await player(client),b=makeClient(service),other=await player(b);
 await client.writeStorageObjects(a,[slot(1)]);
 const old=await read(b,a,'save','slot_main');assert.equal(old.value.chapter,1);
 assert.equal((await b.readStorageObjects(other,{object_ids:[{collection:'save',key:'slot_main',user_id:a.user_id}]})).objects.length,0);
 await client.writeStorageObjects(a,[slot(2,old.version)]);
 const conflict=await failure(b.writeStorageObjects(a,[slot(3,old.version)]));
 assert.equal(conflict.code,9);assert.equal((await read(b,a,'save','slot_main')).value.chapter,2);
 const fresh=await read(b,a,'save','slot_main');await b.writeStorageObjects(a,[slot(3,fresh.version)]);
 assert.equal((await read(client,a,'save','slot_main')).value.chapter,3);
 assert.equal((await failure(client.writeStorageObjects(a,[slot(9,'')]))).code,3);
});

test('native storage batch is all-or-nothing when one conditional write conflicts',async()=>{
 const p=await player(client);await client.writeStorageObjects(p,[slot(1)]);
 const v=await read(client,p,'save','slot_main');await client.writeStorageObjects(p,[slot(2,v.version)]);
 await failure(client.writeStorageObjects(p,[slot(4,'*','slot_new'),slot(3,v.version)]));
 assert.equal(await read(client,p,'save','slot_new'),undefined);
 assert.equal((await read(client,p,'save','slot_main')).value.chapter,2);
});

test('clients cannot pre-create protected progress, expose saves, settle results or write authoritative scores',async()=>{
 const p=await player(client);
 assert.equal((await failure(client.writeStorageObjects(p,[{...slot(1),collection:'progress',key:'main',value:{xp:999}}]))).code,7);
 assert.equal((await failure(client.writeStorageObjects(p,[{...slot(1),permission_read:2}]))).code,7);
 assert.equal((await failure(client.rpc(p,'settle_demo_result',result(p,'forged',999)))).code,7);
 assert.equal((await failure(client.writeLeaderboardRecord(p,'best_run_v1',{score:'999999'}))).code,7);
 assert.equal(await read(client,p,'progress','main'),undefined);
});

test('trusted fixture commits once, rejects conflicting result identity and protects established progress',async()=>{
 const p=await player(client),input=result(p,'once',120);
 assert.equal((await settle(service,input)).duplicate,false);assert.equal((await settle(service,input)).duplicate,true);
 assert.equal((await failure(settle(service,{...input,score:130}))).code,9);
 assert.deepEqual((await read(client,p,'progress','main')).value,{schema:1,xp:12,best:120,runs:1});
 assert.equal((await failure(client.deleteStorageObjects(p,{object_ids:[{collection:'progress',key:'main'}]}))).code,7);
 assert.equal((await client.readStorageObjects(p,{object_ids:[{collection:'settlement',key:'once',user_id:p.user_id}]})).objects.length,0);
});

test('rank is a repairable projection: confirmed progress survives absent rank and retries do not add score',async()=>{
 const p=await player(client);await settle(service,result(p,'first',120));assert.equal((await ranks(p)).length,0);
 await client.rpc(p,'repair_my_rank',{});assert.equal((await ranks(p))[0].score,120);
 await settle(service,result(p,'second',80));await client.rpc(p,'repair_my_rank',{});await client.rpc(p,'repair_my_rank',{});
 assert.equal((await ranks(p))[0].score,120);assert.deepEqual((await read(client,p,'progress','main')).value,{schema:1,xp:20,best:120,runs:2});
});

test('rule two upgrades confirmed progress while preserving old XP/best and earlier rule compatibility',async()=>{
 const p=await player(client);await settle(service,result(p,'v1',180));
 assert.deepEqual((await settle(service,result(p,'v2',40,2))).progress,{schema:2,xp:22,best:180,runs:2,dashUnlocked:true});
 assert.deepEqual((await settle(service,result(p,'old-worker',10,1))).progress,{schema:2,xp:23,best:180,runs:3,dashUnlocked:true});
 assert.equal((await failure(settle(service,result(p,'unknown',1,3)))).code,3);
});

test('parallel settlements keep atomic receipts; conflicted results retry with the same identity',async()=>{
 const p=await player(client),inputs=Array.from({length:6},(_,i)=>result(p,'concurrent-'+i,100));
 const first=await Promise.allSettled(inputs.map(r=>settle(service,r)));
 for(let i=0;i<first.length;i++)if(first[i].status==='rejected')await settle(service,inputs[i]);
 for(const input of inputs)assert.equal((await settle(service,input)).duplicate,true);
 assert.deepEqual((await read(client,p,'progress','main')).value,{schema:1,xp:60,best:100,runs:6});
});

test('missing input/wrong key fail; SDK GET payload mismatch is not treated as a successful result',async()=>{
 const p=await player(client);assert.equal((await failure(client.rpc(p,'repair_my_rank',{}))).code,5);
 assert.equal((await failure(settle(service,{userId:p.user_id}))).code,3);
 assert.equal((await failure(settle({...service,httpKey:'not-the-service-key'},result(p,'bad-key',1)))).status,401);
 assert.equal((await failure(client.rpcHttpKey(service.httpKey,'settle_demo_result',result(p,'get-payload',10)))).code,3);
 assert.equal(await read(client,p,'progress','main'),undefined);
});

test('server restart retains linked identity, cloud save and result; rank repairs after login',async()=>{
 const p=await player(client),credentials=identity();await client.linkEmail(p,credentials);
 await client.writeStorageObjects(p,[slot(5)]);await settle(service,result(p,'before-restart',140));
 await service.restart();const second=makeClient(service),restored=await second.authenticateEmail(credentials.email,credentials.password,false);
 assert.equal(restored.user_id,p.user_id);assert.equal((await read(second,restored,'save','slot_main')).value.chapter,5);
 assert.equal((await read(second,restored,'progress','main')).value.xp,14);
 await second.rpc(restored,'repair_my_rank',{});assert.equal((await ranks(restored))[0].score,140);
});

 test('missing executable fails instead of silently substituting a fake backend',()=>{
 const run=spawnSync(process.execPath,['--input-type=module','-e',"import {startService} from './service.mjs'; await startService()"],{cwd:import.meta.dirname,env:{...process.env,NAKAMA_BIN:'.local/definitely-missing-nakama'},encoding:'utf8'});
 assert.notEqual(run.status,0);assert.match(run.stderr,/ENOENT/);
 });
