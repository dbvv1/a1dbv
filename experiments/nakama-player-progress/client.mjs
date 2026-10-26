import {Client} from '@heroiclabs/nakama-js';
import {randomBytes,randomUUID} from 'node:crypto';
export const makeClient=service=>new Client(service.serverKey,'127.0.0.1',String(service.port),false);
export async function player(client){const id=randomUUID();return client.authenticateDevice(id,true,'p'+id.slice(0,12))}
export const identity=()=>({email:randomUUID()+'@example.invalid',password:randomBytes(24).toString('hex')});
export const slot=(chapter,version='*',key='slot_main')=>({collection:'save',key,value:{schema:1,chapter},permission_read:1,permission_write:1,version});
export async function read(client,session,collection,key){const r=await client.readStorageObjects(session,{object_ids:[{collection,key,user_id:session.user_id}]});return r.objects[0]}
export async function settle(service,request){
 // Fixed SDK2.8.0 rpcHttpKey uses GET, but this server consumes RPC payload from
 // POST. Use the official HTTP endpoint; no private SDK internals or new server.
 const r=await fetch(service.endpoint+'/v2/rpc/settle_demo_result?http_key='+encodeURIComponent(service.httpKey),{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(JSON.stringify(request))});
 const value=await r.json();if(!r.ok)throw Object.assign(Error(value.message),{code:value.code,status:r.status});
 return JSON.parse(value.payload);
}
export async function failure(promise){try{await promise}catch(e){if(e instanceof Response)return {...await e.json(),status:e.status};return e}throw Error('Expected operation to fail')}
