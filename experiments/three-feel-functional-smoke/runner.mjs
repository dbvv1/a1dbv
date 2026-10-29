// Not released for execution. No installation, keyboard/mouse events, external state writes or fallback launch.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {closeOwned} from './cleanup.mjs';
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import {resolve,sep,extname} from 'node:path';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {staticPath,fpsPair,launch,assertArgv,assertWebGL,mobaProgress,starProgress,fpsProgress} from './checks.mjs';
const cfg=JSON.parse(readFileSync(process.argv[2],'utf8'));
assert.equal(cfg.approved,true,'UNRELEASED/BLOCKED: parent must approve exact revised plan after original Star42 and all prior browser/service exit receipts');
assert.deepEqual(cfg.blockers,[],'Unresolved serial/identity/interface prerequisites');
const out=resolve(cfg.output);mkdirSync(out,{recursive:false});
const require=createRequire(resolve(cfg.installedDependencyRoot,'package.json'));
const {chromium}=require('playwright'),{PNG}=require('pngjs');
assert.equal(createHash('sha256').update(readFileSync(resolve(cfg.mobaToolsRoot,'tools/capture-output.ts'))).digest('hex'),'a4fa548e05c97c5871a01dbf33d47d385a1d6aa0af93eb788bda9c575d66fb03');
const {observeCaptureProcess,createCaptureBrowserCloser,captureBrowserExitState,closeCapturePreview}=await import(pathToFileURL(resolve(cfg.mobaToolsRoot,'tools/capture-output.ts')).href);
let cancelCurrent=()=>{},interrupted=null;
process.stdin.setEncoding('utf8');let stdinBuffer='';process.stdin.on('data',chunk=>{stdinBuffer+=chunk;let at;while((at=stdinBuffer.indexOf('\n'))>=0){const line=stdinBuffer.slice(0,at);stdinBuffer=stdinBuffer.slice(at+1);try{if(JSON.parse(line).action==='cancel'){interrupted='outer-timeout';cancelCurrent();}}catch{interrupted='invalid-control-message';cancelCurrent();}}});
for(const signal of ['SIGINT','SIGTERM','SIGHUP'])process.on(signal,()=>{interrupted=signal;cancelCurrent();});
const manifest={status:'running',started:new Date().toISOString(),jobs:[],qualityAcceptance:false};
const save=()=>writeFileSync(resolve(out,'manifest.json'),JSON.stringify(manifest,null,2));save();
function staticServer(root){return createServer((req,res)=>{try{const path=staticPath(root,req.url);const bytes=readFileSync(path);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.wasm':'application/wasm','.png':'image/png','.webp':'image/webp','.glb':'model/gltf-binary','.svg':'image/svg+xml'})[extname(path)]||'application/octet-stream');res.end(bytes);}catch{res.statusCode=404;res.end('not found');}});}
for(const job of cfg.jobs){
 const row={name:job.name,source:job.source,tree:job.tree,status:'running',errors:[],cleanup:{}};manifest.jobs.push(row);save();
 let server,browserServer,browser,child,port,processEvidence,launchRequested=false;
 const closeBrowser=createCaptureBrowserCloser(()=>({browser,server:browserServer}));
 cancelCurrent=()=>{void closeBrowser();};
 const timer=setTimeout(()=>{interrupted='job-timeout';void closeBrowser();},180000);
 const check=()=>{if(interrupted)throw Error(interrupted);};
 row.owner={pid:process.pid,parentPid:process.ppid,registeredAt:new Date().toISOString()};
 try{
  const git=(...a)=>execFileSync('git',['-C',job.repo,...a],{encoding:'utf8'}).trim();assert.equal(git('rev-parse','HEAD'),job.source);assert.equal(git('rev-parse','HEAD^{tree}'),job.tree);assert.equal(git('status','--porcelain'),'');
  // Independently supplied full build manifest must be validated before this runner; record it, do not infer from source SHA.
  const build=JSON.parse(readFileSync(job.buildManifest,'utf8'));assert.equal(build.source,job.source);assert.equal(build.tree,job.tree);assert(Object.keys(build.files).length);
  for(const [path,hash] of (Array.isArray(build.files)?build.files.map(f=>[f.path,f.sha256]):Object.entries(build.files)))assert.equal(createHash('sha256').update(readFileSync(resolve(job.root,path))).digest('hex'),hash);
  row.build=build;
  server=staticServer(resolve(job.root));server.listen(0,'127.0.0.1');await once(server,'listening');port=server.address().port;row.preview={pid:process.pid,parentPid:process.ppid,port,kind:'owned-in-process-http-server'};save();check();
  launchRequested=true;browserServer=await chromium.launchServer({...launch,...(cfg.executablePath?{executablePath:cfg.executablePath}:{})});child=browserServer.process();processEvidence=observeCaptureProcess(child);row.browserProcess=processEvidence;save();check();
  browser=await chromium.connect(browserServer.wsEndpoint());const session=await browser.newBrowserCDPSession();const argv=(await session.send('Browser.getBrowserCommandLine')).arguments;assertArgv(argv);row.launchVerified=true; // raw DEBUG=pw:browser log remains local, never expose private argv.
  for(const route of job.routes){check();const routeEvidence={route:route.path,label:route.label,observation:null,renderer:null,screenshot:null,errors:[]};row.routes??=[];row.routes.push(routeEvidence);
   const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   try{
    await page.goto('http://127.0.0.1:'+port+route.path,{waitUntil:'networkidle',timeout:60000});
    if(job.name==='moba'){
     await page.waitForFunction(()=>window.mobaClient?.state().ready,null,{timeout:60000});const a=await page.evaluate(()=>({snapshot:window.mobaClient.snapshot(),state:window.mobaClient.state()}));await page.waitForFunction(t=>window.mobaClient.snapshot().tick>t,a.snapshot.tick,{timeout:15000});const b=await page.evaluate(()=>({snapshot:window.mobaClient.snapshot(),state:window.mobaClient.state()}));mobaProgress(a,b,route.version);routeEvidence.observation={a,b};
    }else if(job.name==='star'){
     await page.waitForFunction(()=>window.__shot?.ready||window.__shot?.error,null,{timeout:90000});const a=await page.evaluate(()=>window.__shot);const b=await page.evaluate(()=>window.__shotNext());starProgress(a,b,route.revision);routeEvidence.observation={a,b};
    }else{await page.waitForFunction(()=>window.fpsClient?.state().smoke?.complete,null,{timeout:90000});const result=await page.evaluate(()=>({state:window.fpsClient.state(),snapshot:window.fpsClient.snapshot()}));fpsProgress(result);routeEvidence.observation=result;}
    const renderer=await page.evaluate(()=>{for(const c of document.querySelectorAll('canvas')){const gl=c.getContext('webgl2');if(gl){const e=gl.getExtension('WEBGL_debug_renderer_info');return {webgl2:true,maskedRenderer:gl.getParameter(gl.RENDERER),version:gl.getParameter(gl.VERSION),renderer:e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):null,vendor:e?gl.getParameter(e.UNMASKED_VENDOR_WEBGL):gl.getParameter(gl.VENDOR)};}}return {webgl2:false};});routeEvidence.renderer={...renderer,class:assertWebGL(renderer)};
    const bytes=await page.locator('canvas').first().screenshot(),png=PNG.sync.read(bytes),colors=new Set();for(let i=0;i<png.data.length;i+=64)colors.add(png.data.subarray(i,i+3).toString('hex'));assert(colors.size>16,'No non-background canvas');const filename=job.name+'-'+route.label+'.png';writeFileSync(resolve(out,filename),bytes);routeEvidence.screenshot={path:filename,sha256:createHash('sha256').update(bytes).digest('hex')};assert.deepEqual(errors,[]);
   }finally{routeEvidence.errors=[...errors];row.errors.push(...errors);save();await context.close();}
  }
  for(const [path,hash] of (Array.isArray(build.files)?build.files.map(f=>[f.path,f.sha256]):Object.entries(build.files)))assert.equal(createHash('sha256').update(readFileSync(resolve(job.root,path))).digest('hex'),hash);
  if(job.name==='fps')fpsPair(row.routes);
  assert.equal(git('rev-parse','HEAD'),job.source);assert.equal(git('status','--porcelain'),'');
  check();row.status='passed-functional-scope-only';
 }catch(error){row.status='failed';row.error=String(error);manifest.status='failed';throw error;}
 finally{
  clearTimeout(timer);
  row.cleanup=await closeOwned({closeBrowser,browserExitState:captureBrowserExitState,processEvidence,launchRequested,server,port,closePreview:closeCapturePreview});
  if(!row.cleanup.proven){row.status='cleanup-unknown';manifest.status='blocked-cleanup';save();throw Error('Owned resource exit unproved; no next job');}
  if(interrupted){row.status='interrupted';manifest.status='failed';save();throw Error(interrupted);}save();

 }
}
process.stdin.pause();manifest.status='passed-functional-scope-only';manifest.finished=new Date().toISOString();save();
