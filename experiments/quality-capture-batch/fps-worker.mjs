// Standalone consumer of the game's existing qualityCapture fixed-step interface.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const [root,moba,out]=process.argv.slice(2);
const require=createRequire(join(root,'package.json'));
const {chromium}=require('playwright'),{preview}=await import(pathToFileURL(require.resolve('vite')).href),{PNG}=require('pngjs');
const {observeCaptureProcess,createCaptureBrowserCloser,captureBrowserExitState,captureSpawnEvidence,closeCapturePreview,captureBundleIdentity,verifyServedCaptureBundle}=await import(pathToFileURL(join(moba,'tools/capture-output.ts')).href);
const h=b=>createHash('sha256').update(b).digest('hex');
await mkdir(out,{recursive:false});
const report={passed:false,shots:[],errors:[],scope:'fixed current offline quality frames; not sound or player-input acceptance'};
let browser,browserServer,server,port,processEvidence,interrupted=null;
const checkInterrupted=()=>{if(interrupted)throw Error('Interrupted: '+interrupted);};
const close=createCaptureBrowserCloser(()=>({browser,server:browserServer}));
for(const signal of ['SIGINT','SIGTERM','SIGHUP'])process.once(signal,()=>{interrupted=signal;process.exitCode=1;report.passed=false;report.interrupted=signal;void close();});
try{
 assert.ok(process.env.FPS_CAPTURE_CHROMIUM,'Verified full Chromium path required before launch');
 report.bundle=await captureBundleIdentity(join(root,'web-dist'));
 server=await preview({configFile:false,root,build:{outDir:'web-dist'},preview:{host:'127.0.0.1',port:0,open:false}});port=server.httpServer.address().port;
 const base=`http://127.0.0.1:${port}`;
 report.launch={headless:true,chromiumSandbox:true,ignoreDefaultArgs:['--enable-unsafe-swiftshader'],args:['--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows'],executablePath:process.env.FPS_CAPTURE_CHROMIUM};
 checkInterrupted();browserServer=await chromium.launchServer(report.launch);processEvidence=observeCaptureProcess(browserServer.process());checkInterrupted();
 report.actualSpawn=captureSpawnEvidence(browserServer.process(),chromium.executablePath(),process.env.FPS_CAPTURE_CHROMIUM);
 assert.equal(report.actualSpawn.noSandbox,false);assert.equal(report.actualSpawn.disableSetuidSandbox,false);assert.equal(report.actualSpawn.unsafeSwiftshader,false);assert.equal(report.actualSpawn.headless,true);
 browser=await chromium.connect(browserServer.wsEndpoint());report.browserVersion=browser.version();
 const context=await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1,locale:'en-US',timezoneId:'UTC'});
 await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort('blockedbyclient'));
 await verifyServedCaptureBundle(report.bundle,async f=>{const r=await context.request.get(base+'/'+f,{maxRedirects:0});assert.equal(r.status(),200);return r.body();});
 for(const shot of ['gameplay','courtyard-gap','cross-lane']){
 let previous;
 for(let repeat=1;repeat<=2;repeat++){
 const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('requestfailed',r=>errors.push(r.failure()?.errorText));
 const query='?gameplay=offline-training-v1&match=complete-v1&squads=offline-v1&environment=courtyard-v1&art=standards-v1&qualityCapture='+shot;
 await page.goto(base+'/'+query,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__shot?.ready||window.__shot?.error,null,{timeout:120000});await page.locator('#boot').waitFor({state:'hidden'});
 const meta=await page.evaluate(()=>window.__shot);
 const stem=shot+'-r'+repeat;await writeFile(join(out,stem+'.json'),JSON.stringify(meta,null,2),{flag:'wx'});
 assert.equal(meta.error,undefined);assert.equal(meta.ready,true);assert.equal(meta.frame,0);assert.equal(meta.t,2);
 assert.equal(meta.rendererEvidence.rendererClass,'gpu');assert.equal(meta.rendererEvidence.unmasked,true);assert.ok(meta.renderer);
 assert.equal(meta.state.actors.length,10);assert.equal(meta.state.tick,120);assert.equal(meta.commands.length,120);
 assert.equal(meta.viewport.width,1280);assert.equal(meta.viewport.height,720);
 assert.equal(meta.renderInfo.environment.active,true);assert.equal(meta.renderInfo.art.active,true);
 await page.waitForTimeout(150);assert.deepEqual(await page.evaluate(()=>window.__shot),meta);
 const bytes=await page.screenshot({animations:'disabled'}),png=PNG.sync.read(bytes);assert.equal(png.width,1280);assert.equal(png.height,720);const colors=new Set();for(let i=0;i<png.data.length;i+=16)colors.add(`${png.data[i]>>3},${png.data[i+1]>>3},${png.data[i+2]>>3}`);assert.ok(colors.size>32,'Blank/loading frame');
 await writeFile(join(out,stem+'.png'),bytes,{flag:'wx'});
 const entry={shot,repeat,query,metadata:meta,pngSha256:h(bytes),rgbaSha256:h(png.data),inputCommandsSha256:h(JSON.stringify(meta.commands))};
 const comparable={rgba:entry.rgbaSha256,commands:entry.inputCommandsSha256,state:meta.stateHash,camera:meta.camera,renderer:meta.renderer,t:meta.t};
 if(previous)assert.deepEqual(comparable,previous);else previous=comparable;
 if(report.shots.length)assert.equal(meta.renderer,report.shots[0].metadata.renderer);
 report.shots.push(entry);assert.deepEqual(errors,[]);await page.close();
 }}
 await verifyServedCaptureBundle(report.bundle,async f=>{const r=await context.request.get(base+'/'+f,{maxRedirects:0});assert.equal(r.status(),200);return r.body();});
 assert.deepEqual(await captureBundleIdentity(join(root,'web-dist')),report.bundle);await context.close();checkInterrupted();report.passed=true;
}catch(e){report.errors.push(String(e.stack||e));}
finally{
 if(interrupted){report.passed=false;report.interrupted=interrupted;}
 const closed=await close();report.browserCleanup={...closed,process:processEvidence};
 if(captureBrowserExitState(!!browserServer,closed.serverClosed,closed.connectionClosed,processEvidence)!=='owned-handles-closed'){report.passed=false;report.errors.push('Browser exit not proved');}
 if(server)try{report.previewCleanup=await closeCapturePreview(server.httpServer,port);assert.equal(report.previewCleanup.exitProven,true);}catch(e){report.passed=false;report.errors.push(String(e));}
 if(interrupted){report.passed=false;report.interrupted=interrupted;}
 await writeFile(join(out,'report.json'),JSON.stringify(report,null,2),{flag:'wx'});if(!report.passed)process.exitCode=1;
}
