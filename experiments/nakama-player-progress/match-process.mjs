import {fork} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
// Local test/demo orchestration, not a match allocator or production worker supervisor.
export function worker(file,message,{source}={}) {
  return new Promise((resolveResult,reject)=>{
    const child=fork(fileURLToPath(new URL(file,import.meta.url)),[],{
      ...(source ? {cwd:resolve(source)} : {}),execArgv:source?['--import','tsx']:[],
      stdio:['ignore','pipe','pipe','ipc']});
    let response,log='';
    const timer=setTimeout(()=>child.kill('SIGKILL'),25000);
    child.stdout.on('data',data=>{log+=data;});child.stderr.on('data',data=>{log+=data;});
    child.on('message',value=>{response=value;});
    child.once('error',error=>{clearTimeout(timer);reject(error);});
    child.once('exit',(code,signal)=>{clearTimeout(timer);resolveResult({code,signal,response,log,pid:child.pid});});
    child.once('spawn',()=>child.send(message,error=>{
      if (error) { clearTimeout(timer); child.kill('SIGTERM'); reject(error); }
    }));
  });
}
export async function produce(options) {
  const result=await worker('./match-source.mjs',options,{source:options.source});
  if (result.code!==0 || !result.response?.result) throw new Error(result.response?.error || result.log || `match source failed: exit ${result.code}, signal ${result.signal}`);
  return result;
}
export async function deliver(service,path,{crashAfterFirst=false}={}) {
  return worker('./match-delivery.mjs',{service:{endpoint:service.endpoint,httpKey:service.httpKey},path,crashAfterFirst});
}
