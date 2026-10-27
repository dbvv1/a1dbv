import { fork } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function waitFor(fn,label,limit=5000){
  const end=Date.now()+limit;
  while(Date.now()<end){const value=await fn();if(value)return value;await delay(20);}
  throw new Error(`Timed out: ${label}`);
}
export function actor(file,args=[]){
  const child=fork(fileURLToPath(new URL(file,import.meta.url)),args,{stdio:['ignore','pipe','pipe','ipc'],execArgv:[]});
  let id=0,log='';const pending=new Map();
  child.stdout.on('data',data=>{log+=data;});child.stderr.on('data',data=>{log+=data;});
  child.on('message',m=>{if(!m.id)return;const p=pending.get(m.id);if(!p)return;pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(new Error(m.error)):p.resolve(m.value);});
  child.on('exit',(code)=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(new Error(`child exited ${code}: ${log}`));}pending.clear();});
  return {child,get log(){return log;},call(op,options={}){return new Promise((resolve,reject)=>{const key=++id;const timer=setTimeout(()=>{pending.delete(key);reject(new Error(`RPC timeout ${op}: ${log}`));},6000);pending.set(key,{resolve,reject,timer});child.send({id:key,op,...options});});}};
}
export async function setup(){
  const server=actor('./server.mjs');const clients=[];
  const endpoint=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>(server.child.kill('SIGTERM'),reject(new Error(server.log||'server did not start'))),5000);server.child.on('message',m=>{if(m.kind==='ready'){clearTimeout(timer);resolve(m.endpoint);}});});
  return {server,endpoint,client(){const c=actor('./client.mjs',[endpoint]);clients.push(c);return c;},async close(){
    for(const c of clients)if(c.child.exitCode===null && !c.child.killed){try{await c.call('shutdown');}catch{c.child.kill('SIGTERM');}}
    if(server.child.exitCode===null){try{await server.call('shutdown');}catch{server.child.kill('SIGTERM');}}
    await waitFor(()=>clients.every(c=>c.child.exitCode!==null||c.child.signalCode!==null) && (server.child.exitCode!==null||server.child.signalCode!==null),'all child exits',3000);
  }};
}
export async function inspect(c,predicate,label){return waitFor(async()=>{const s=await c.call('inspect');return predicate(s)?s:false;},label);}
