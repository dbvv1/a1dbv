import {spawn, spawnSync} from 'node:child_process';
import {mkdir, mkdtemp, copyFile, open} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {createServer} from 'node:net';
import {fileURLToPath} from 'node:url';
import {resolve,join} from 'node:path';
const home=fileURLToPath(new URL('.',import.meta.url));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
function command(bin,args,env){const r=spawnSync(bin,args,{env,encoding:'utf8'});if(r.error||r.status!==0)throw Error(`${bin}: ${r.error?.message??r.stderr}`);return r.stdout}
async function freePort(){const s=createServer();await new Promise((r,j)=>{s.once('error',j);s.listen(0,'127.0.0.1',r)});const port=s.address().port;await new Promise(r=>s.close(r));return port}
async function block(){for(let n=0;n<20;n++){const p=18000+Math.floor(Math.random()*20000);const held=[];try{for(let i=0;i<4;i++){const s=createServer();held.push(s);await new Promise((r,j)=>{s.once('error',j);s.listen(p+i,'127.0.0.1',r)})}return p+2}catch{}finally{await Promise.all(held.map(s=>new Promise(r=>s.listening?s.close(r):r())))}}throw Error('No local port block available')}
async function waitFor(child,predicate,label){for(let i=0;i<300;i++){if(child.exitCode!==null||child.signalCode!==null)throw Error(`${label} exited before ready; inspect local service.log`);if(await predicate())return;await delay(50)}throw Error(`${label} readiness timed out`)}
async function terminate(child){if(child.exitCode!==null||child.signalCode!==null)return;const done=new Promise(r=>child.once('exit',r));child.kill('SIGTERM');const timer=setTimeout(()=>child.kill('SIGKILL'),5000);try{await done}finally{clearTimeout(timer)}}
export async function startService(){
 const pg=resolve(process.env.PG_BIN??join(home,'.local/pg/usr/lib/postgresql/17/bin'));
 const share=resolve(process.env.PG_SHARE??join(home,'.local/pg/usr/share/postgresql/17'));
 const nakama=resolve(process.env.NAKAMA_BIN??join(home,'.local/nakama/nakama'));
 const env={...process.env,NAKAMA_TELEMETRY:'0',TZ:'UTC',LD_LIBRARY_PATH:[process.env.PG_LIB??join(home,'.local/pg/usr/lib/x86_64-linux-gnu'),process.env.LD_LIBRARY_PATH].filter(Boolean).join(':')};
 const pgVersion=command(join(pg,'postgres'),['--version'],env).trim();
 const nakamaVersion=command(nakama,['--version'],env).trim();
 if(!pgVersion.includes('17.11')||!nakamaVersion.startsWith('3.41.0+'))throw Error('This verified example requires PostgreSQL17.11 and Nakama3.41.0; review other versions separately.');
 await mkdir(join(home,'.local/runs'),{recursive:true});
 const dir=await mkdtemp(join(home,'.local/runs/run-')), modules=join(dir,'modules');
 await mkdir(modules);await copyFile(join(home,'runtime.js'),join(modules,'runtime.js'));
 const log=await open(join(dir,'service.log'),'a',0o600),children=[];
 function child(bin,args){const p=spawn(bin,args,{env,stdio:['ignore',log.fd,log.fd]});children.push(p);return p}
 let server=null,db=null,closed=false;
 const onInterrupt=()=>void close().then(()=>process.exit(130));
 const onTerminate=()=>void close().then(()=>process.exit(143));
 process.once('SIGINT',onInterrupt);process.once('SIGTERM',onTerminate);
 async function close(){if(closed)return;closed=true;process.removeListener('SIGINT',onInterrupt);process.removeListener('SIGTERM',onTerminate);for(const p of children.toReversed())await terminate(p);await log.close()}
 try{
  command(join(pg,'initdb'),['-D',join(dir,'db'),'-L',share,'--auth=trust','--username=probe','--no-locale','-E','UTF8'],env);
  const dbPort=await freePort(),port=await block();
  // No Unix-domain socket; the isolated demo uses loopback TCP only.
  db=child(join(pg,'postgres'),['-D',join(dir,'db'),'-h','127.0.0.1','-p',String(dbPort),'-k','']);
  await waitFor(db,async()=>spawnSync(join(pg,'pg_isready'),['-h','127.0.0.1','-p',String(dbPort),'-U','probe','-d','postgres'],{env}).status===0,'PostgreSQL');
  command(join(pg,'createdb'),['-h','127.0.0.1','-p',String(dbPort),'-U','probe','nakama'],env);
  const database=`probe@127.0.0.1:${dbPort}/nakama`;
  command(nakama,['migrate','up','--database.address',database],env);
  const serverKey=randomBytes(24).toString('hex'),httpKey=randomBytes(32).toString('hex');
  // Generated for this disposable service only; never persisted or printed.
  const args=['--database.address',database,'--data_dir',join(dir,'nakama'),'--runtime.path',modules,'--runtime.js_entrypoint','runtime.js',
   '--runtime.http_key',httpKey,'--socket.server_key',serverKey,'--socket.address','127.0.0.1','--socket.port',String(port),
   '--console.address','127.0.0.1','--console.port',String(port+1),'--session.token_expiry_sec','7200','--session.refresh_token_expiry_sec','86400',
   '--session.encryption_key',randomBytes(32).toString('hex'),'--session.refresh_encryption_key',randomBytes(32).toString('hex'),
   '--console.signing_key',randomBytes(32).toString('hex'),'--console.password',randomBytes(24).toString('hex')];
  const endpoint=`http://127.0.0.1:${port}`;
  async function launch(){server=child(nakama,args);await waitFor(server,async()=>{try{return (await fetch(endpoint+'/healthcheck',{signal:AbortSignal.timeout(500)})).ok}catch{return false}},'Nakama')}
  await launch();
  return {endpoint,port,serverKey,httpKey,dir,versions:{postgres:pgVersion,nakama:nakamaVersion},
   ownedPids:()=>children.map(p=>p.pid),async restart(){await terminate(server);await launch()},close};
 }catch(e){await close();throw e}
}
