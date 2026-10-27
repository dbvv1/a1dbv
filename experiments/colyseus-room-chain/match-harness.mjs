import {mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {actor,waitFor} from './harness.mjs';
import {makeClient,player} from '../nakama-player-progress/client.mjs';
export async function setupMatch(service,{source=process.env.MOBA_SOURCE,crashAfterFirst=false,maxMatchSeconds}={}){
  if(!source)throw Error('MOBA_SOURCE must name the fixed clean MOBA checkout');
  const backend=makeClient(service),sessions=[await player(backend),await player(backend)];
  const demoSeats=[];
  for(const [team,session] of sessions.entries())demoSeats.push({team,userId:(await backend.getAccount(session)).user.id});
  const resultDir=join(service.dir,'room-results');await mkdir(resultDir,{recursive:true});
  const server=actor('./match-server.mjs'),clients=[];
  let endpoint;
  try{
    ({endpoint}=await server.call('init',{config:{source:resolve(source),resultDir,demoSeats,
      service:{endpoint:service.endpoint,httpKey:service.httpKey},crashAfterFirst,maxMatchSeconds}}));
  }catch(error){server.child.kill('SIGTERM');throw error;}
  const client=()=>{const value=actor('./match-client.mjs',[endpoint]);clients.push(value);return value;};
  return {server,backend,sessions,demoSeats,resultDir,client,
    async joinPair(){
      const peers=[client(),client()];
      const created=await peers[0].call('create',{token:sessions[0].token});
      await peers[1].call('join',{roomId:created.roomId,token:sessions[1].token});
      await state(peers[0],s=>Object.keys(s.snapshot?.players??{}).length===2,'both seats');
      return {peers,roomId:created.roomId};
    },
    async close(){
      for(const peer of clients)if(peer.child.exitCode===null&&!peer.child.killed){try{await peer.call('shutdown');}catch{peer.child.kill('SIGTERM');}}
      if(server.child.exitCode===null){
        try{await waitFor(async()=>!(await server.call('stats')).activeWork,'owned job drain',30000);await server.call('shutdown');}
        catch{server.child.kill('SIGTERM');}
      }
      await waitFor(()=>clients.every(p=>p.child.exitCode!==null||p.child.signalCode!==null)&&
        (server.child.exitCode!==null||server.child.signalCode!==null),'match processes exit',5000);
    }};
}
export const state=(peer,predicate,label,limit=30000)=>waitFor(async()=>{const value=await peer.call('inspect');return predicate(value)?value:false;},label,limit);
