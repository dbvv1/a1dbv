import assert from 'node:assert/strict';
import {startService} from './service.mjs';
import {makeClient,player,identity,slot,read,settle,failure} from './client.mjs';
let service;
try{
 service=await startService();const first=makeClient(service),second=makeClient(service);
 console.log('Local backend ready:',service.versions);
 const a=await player(first),credentials=identity();await first.linkEmail(a,credentials);await first.writeStorageObjects(a,[slot(1)]);
 const b=await second.authenticateEmail(credentials.email,credentials.password,false);assert.equal(a.user_id,b.user_id);
 console.log('Linked identity restored by a second SDK client; chapter',(await read(second,b,'save','slot_main')).value.chapter);
 const old=await read(second,b,'save','slot_main');await first.writeStorageObjects(a,[slot(2,old.version)]);
 const conflict=await failure(second.writeStorageObjects(b,[slot(3,old.version)]));assert.equal(conflict.code,9);
 console.log('Stale save rejected; current chapter',(await read(second,b,'save','slot_main')).value.chapter);
 const input={userId:a.user_id,matchId:'round-1',score:120,rule:1};
 const committed=await settle(service,input);assert.equal(committed.progress.xp,12);assert.equal((await settle(service,input)).duplicate,true);
 console.log('Trusted synthetic result confirmed once:',committed.progress);
 await service.restart();console.log('Restarted Nakama; database retained.');
 const c=await second.authenticateEmail(credentials.email,credentials.password,false);assert.equal((await read(second,c,'progress','main')).value.xp,12);
 const upgraded=await settle(service,{...input,matchId:'round-2',score:100,rule:2});assert.equal(upgraded.progress.dashUnlocked,true);
 const rank=await second.rpc(c,'repair_my_rank',{});assert.equal(rank.payload.score,120);
 console.log('Second rule preserves progress and unlocks dash:',upgraded.progress);
 console.log('Authoritative best-score projection:',rank.payload.score);
 console.log('No real identity provider, production match, payment or deployment was used.');
}catch(e){console.error(e instanceof Response?await e.text():e);process.exitCode=1}
finally{await service?.close();console.log('Owned backend and database processes closed.');}
