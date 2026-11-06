// One shot, two independent contexts. Does not build, install, or edit game source.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join,isAbsolute} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {SOURCES,BUILDS,SHOTS,captureUrl,assertFrame,assertEquivalent,observeExit,cleanExit} from './contract.mjs';
assert.equal(Number(process.versions.node.split('.')[0]),24,'Existing Node 24 is required');
const [rootArg,outArg,shot,commit,...extra]=process.argv.slice(2);
assert(rootArg&&outArg&&Object.hasOwn(SHOTS,shot)&&Object.hasOwn(SOURCES,commit)&&!extra.length,'Usage: capture.mjs SOURCE NEW_OUTPUT SHOT FROZEN_COMMIT');
const root=resolve(rootArg),directory=resolve(outArg),executablePath=process.env.STAR_RUSH_CAPTURE_CHROMIUM;
assert(executablePath&&isAbsolute(executablePath),'Set verified existing Chromium path');
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true}).trim();
assert.equal(git('rev-parse','HEAD'),commit);assert.equal(git('rev-parse','HEAD^{tree}'),SOURCES[commit]);
// Only deterministic build output may differ. Never rewrite source or call it a clean whole tree.
const changed=git('diff','HEAD','--name-only').split('\n').filter(Boolean);
const untracked=git('ls-files','--others','--exclude-standard','-z').split('\0').filter(Boolean);
const generated=p=>p.startsWith('dist/')||p==='worker/index.js'||p.startsWith('experiments/rapier-road-comparison/dist/');
assert([...changed,...untracked].every(generated),'Non-generated source changed or untracked');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
assert.equal(hash(await readFile(join(root,'dist/client/road/game.js'))),BUILDS[commit].bundle,'Wrong or stale road build');
assert.equal(hash(await readFile(join(root,'dist/server/index.js'))),BUILDS[commit].worker,'Wrong or stale Worker build');
const require=createRequire(join(root,'package.json')),{chromium}=require('playwright'),{PNG}=require('pngjs');
const moduleAt=p=>import(pathToFileURL(join(root,p)).href);
const {smokeLaunchOptions,assertArgv,restrictCaseContext}=await moduleAt('tests/smoke-launch.mjs');
const {startSmokeServer}=await moduleAt('tests/smoke-server.mjs');
const {default:worker}=await moduleAt('dist/server/index.js');
await mkdir(directory,{recursive:false});
const report={passed:false,capturePassed:false,cleanExitBaseline:false,scope:'same-camera-software-comparison',commit,tree:SOURCES[commit],sourceUnchanged:true,generatedChanged:changed,generatedUntracked:untracked,wholeTreeDirty:changed.length+untracked.length>0,nodeVersion:process.version,shot,startedAt:new Date().toISOString(),runs:[],errors:[],parentExit:'requires receiver wait receipt'};
let preview,server,browser,observer,interrupted=null;
const save=()=>writeFile(join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');
const check=()=>{assert(!interrupted,'Interrupted: '+interrupted);};
for(const signal of ['SIGINT','SIGTERM','SIGHUP'])process.once(signal,()=>{interrupted=signal;process.exitCode=1;});
await save();
try{
 preview=await startSmokeServer(worker,join(root,'drizzle'));const url=captureUrl(preview.origin,shot);report.url=url.href;
 report.workerSha256=hash(await readFile(join(root,'dist/server/index.js')));report.bundleSha256=hash(await readFile(join(root,'dist/client/road/game.js')));
 const launch={...smokeLaunchOptions({...process.env,STAR_RUSH_SMOKE_CHROMIUM:executablePath}),headless:true,args:[...smokeLaunchOptions({}).args,'--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']};
 check();server=await chromium.launchServer(launch);observer=observeExit(server.process());report.browserProcess=observer.evidence;
 assertArgv(server.process().spawnargs.slice(1),{headless:true});browser=await chromium.connect(server.wsEndpoint());report.browser=browser.version();assert.equal(report.browser,'156.0.8078.4');
 const cdp=await browser.newBrowserCDPSession();const argv=(await cdp.send('Browser.getBrowserCommandLine')).arguments;assertArgv(argv,{headless:true});report.requiredArgs=launch.args.filter(a=>argv.includes(a));await cdp.detach();
 let first;
 for(let run=1;run<=2;run++){
  check();const errors=[],context=await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1,locale:'en-US',timezoneId:'UTC',serviceWorkers:'block'});
  try{
   const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
   await restrictCaseContext(context,url.href);await page.goto(url.href,{waitUntil:'domcontentloaded'});
   const src=await page.locator('script[src]').last().getAttribute('src'),bundle=new URL(src,url);assert.equal(bundle.origin,url.origin);
   const response=await page.request.get(bundle.href,{maxRedirects:0});assert.equal(response.status(),200);const served=hash(await response.body());assert.equal(served,report.bundleSha256);report.servedBundleSha256=served;
   await page.waitForFunction(()=>window.__shot?.ready||window.__shot?.error,null,{polling:100,timeout:120000});
   const sample=()=>page.evaluate(()=>({metadata:window.__shot,sideStatus:window.starSideStatus}));
   const a=await sample();report.lastObservation={...a,metadata:{...a.metadata,pngDataUrl:undefined}};await save();assertFrame(a,shot);
   await page.waitForTimeout(150);const b=await sample();assertFrame(b,shot);assertEquivalent(a,b,{pixels:true});
   const bytes=Buffer.from(a.metadata.pngDataUrl.split(',')[1],'base64'),png=PNG.sync.read(bytes);assert.equal(png.width,1280);assert.equal(png.height,720);
   const colors=new Map();for(let i=0;i<png.data.length;i+=4){const key=[png.data[i]>>3,png.data[i+1]>>3,png.data[i+2]>>3].join(',');colors.set(key,(colors.get(key)||0)+1);}assert(colors.size>100&&Math.max(...colors.values())/(1280*720)<.99,'Empty/background frame');
   assert.deepEqual(errors,[]);if(first)assertEquivalent(first,a,{pixels:true});else first=a;
   const stem=shot+'-run'+run;const record={metadata:{...a.metadata,pngDataUrl:undefined},sideStatus:a.sideStatus,png:stem+'.png',pngSha256:hash(bytes),rgbaSha256:hash(png.data)};
   await writeFile(join(directory,stem+'.png'),bytes,{flag:'wx'});await writeFile(join(directory,stem+'.json'),JSON.stringify(record,null,2)+'\n',{flag:'wx'});report.runs.push(record);await save();
  }finally{await context.close();}
 }
 check();report.capturePassed=true;
}catch(e){report.errors.push(e.stack||String(e));process.exitCode=1;}
finally{
 const attempt=async(fn)=>{try{await fn();}catch(e){report.errors.push(String(e));process.exitCode=1;}};
 if(browser)await attempt(()=>browser.close());if(server)await attempt(()=>server.close());
 if(observer){let timer;await Promise.race([observer.finished,new Promise(r=>{timer=setTimeout(r,10000);})]);clearTimeout(timer);}
 if(preview){await attempt(async()=>{preview.server.closeAllConnections();await new Promise((res,rej)=>preview.server.close(e=>e?rej(e):res()));report.previewClosed=!preview.server.listening;preview.db.close();});}
 report.interrupted=interrupted;report.cleanExitBaseline=cleanExit(observer?.evidence)&&report.previewClosed===true&&report.errors.length===0&&!interrupted;
 report.passed=report.capturePassed&&report.cleanExitBaseline;report.endedAt=new Date().toISOString();if(!report.passed)process.exitCode=1;await save();
 console.log(JSON.stringify({passed:report.passed,capturePassed:report.capturePassed,cleanExitBaseline:report.cleanExitBaseline,errors:report.errors}));
}
