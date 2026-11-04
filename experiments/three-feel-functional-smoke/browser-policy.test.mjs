import test from 'node:test';
import assert from 'node:assert/strict';
import {launch,browserLaunch,gpuBrowserArgs,assertRendererProfile,assertWebGL,requiredBrowserArgs,caseOrigins,assertArgv,assertCaseUrl,restrictCaseContext} from './checks.mjs';
test('required launch flags retain all Playwright defaults',()=>{
 assert.equal(launch.chromiumSandbox,false);assert.equal(launch.ignoreDefaultArgs,undefined);
 assert.deepEqual(launch.args,requiredBrowserArgs);assertArgv(['--headless=new',...launch.args]);
 for(const flag of requiredBrowserArgs)assert.throws(()=>assertArgv(['--headless',...launch.args.filter(a=>a!==flag)]));
 for(const argv of [null,[],[null],launch.args,['--headless',...launch.args,'--use-angle=gl']])assert.throws(()=>assertArgv(argv));
});
test('only exact case origins and HTTP loopback previews are accepted',()=>{
 for(const base of ['http://127.0.0.1:1234','http://localhost:1234','http://[::1]:1234',...caseOrigins])assertCaseUrl(base+'/road/?shot=coast-chase');
 for(const url of ['', 'not a URL','file:///tmp/test','data:text/html,test','https://example.com','http://192.168.1.1','http://127.0.0.2','https://localhost','http://localhost.example.com',caseOrigins[0]+'.example.com',caseOrigins[0]+':444','http://user:password@localhost:1',caseOrigins[0].replace('https:','http:')])assert.throws(()=>assertCaseUrl(url));
});
test('context guard permits only selected origin and blocks external, other local ports and websockets',async()=>{
 let route,websocket;await restrictCaseContext({route:async(_,fn)=>{route=fn;},routeWebSocket:async(_,fn)=>{websocket=fn;}},'http://127.0.0.1:1234');
 const visit=async(url,status=200)=>{let result;await route({request:()=>({url:()=>url}),fetch:async options=>{assert.deepEqual(options,{maxRedirects:0});return {status:()=>status};},fulfill:()=>{result='allow';},abort:()=>{result='block';}});return result;};
 assert.equal(await visit('http://127.0.0.1:1234/road/game.js'),'allow');
 for(const url of ['https://example.com/','http://127.0.0.1:9999/','http://user:pw@127.0.0.1:1234/',caseOrigins[0]])assert.equal(await visit(url),'block');
 for(const status of [301,302,303,307,308])assert.equal(await visit('http://127.0.0.1:1234/redirect',status),'block');
 let closed=false;websocket({close:()=>{closed=true;}});assert.equal(closed,true);
 await assert.rejects(restrictCaseContext({},'https://example.com/'));
});

test('D3D11 is an explicit isolated headless profile, not a changed software default',()=>{
 const gpu=browserLaunch('d3d11');
 assert.deepEqual(gpu.args,['--enable-gpu','--use-angle=d3d11','--enable-automation']);assert.deepEqual(gpu.args,gpuBrowserArgs);
 assert.equal(gpu.headless,true);assert.equal(gpu.chromiumSandbox,true);
 assert.deepEqual(gpu.ignoreDefaultArgs,['--enable-unsafe-swiftshader']);
 assertArgv(['--headless=new',...gpu.args],{profile:'d3d11'});
 assert.deepEqual(browserLaunch().args,requiredBrowserArgs);assert.deepEqual(launch.args,requiredBrowserArgs);
 gpu.args.push('--bad');assert.deepEqual(browserLaunch('d3d11').args,gpuBrowserArgs);
 for(const profile of ['',null,'gpu','D3D11','metal'])assert.throws(()=>browserLaunch(profile));
});
test('profile argv rejects missing flags, mixed backends, sandbox weakening and software fallback',()=>{
 for(const profile of ['swiftshader','d3d11']){
  const args=browserLaunch(profile).args,valid=['--headless',...args];
  for(const flag of args)assert.throws(()=>assertArgv(valid.filter(a=>a!==flag),{profile}));
  for(const extra of ['--headless=false','--headed','--use-angle=gl','--use-angle','--disable-gpu','--use-gl=swiftshader'])assert.throws(()=>assertArgv([...valid,extra],{profile}));
  for(const flag of args)assert.throws(()=>assertArgv([...valid,flag.split('=')[0]+'=false'],{profile}));
 }
 const gpu=['--headless',...gpuBrowserArgs];
 for(const extra of ['--no-sandbox','--no-sandbox=true','--disable-setuid-sandbox','--enable-unsafe-swiftshader','--software','--use-angle=swiftshader'])assert.throws(()=>assertArgv([...gpu,extra],{profile:'d3d11'}));
 assert.throws(()=>assertArgv(['--headless',...launch.args],{profile:'d3d11'}));
 assert.throws(()=>assertArgv(gpu));
 assert.throws(()=>assertArgv(gpu,{profile:'invalid'}));
});
test('requested D3D11 is not proof of GPU; keep raw renderer and reject fallback or wrong backend',()=>{
 const renderer='ANGLE (Example, Example GPU Direct3D11 vs_5_0 ps_5_0, D3D11)';
 const info={webgl2:true,renderer};
 assert.equal(assertRendererProfile(info,'d3d11'),'unknown');assert.equal(info.renderer,renderer);
 assert.equal(assertRendererProfile({webgl2:true,renderer:'ANGLE SwiftShader'}),'software');
 for(const raw of ['ANGLE SwiftShader','llvmpipe','ANGLE (Microsoft Basic Render Driver Direct3D11)','ANGLE (WARP D3D11)','ANGLE (Example Vulkan)','WebKit WebGL'])assert.throws(()=>assertRendererProfile({webgl2:true,renderer:raw},'d3d11'));
 for(const info of [null,{webgl2:false,renderer},{webgl2:true,maskedRenderer:'WebKit WebGL'}])assert.throws(()=>assertRendererProfile(info,'d3d11'));
 assert.throws(()=>assertRendererProfile(info));
});

test('runner retains raw failed renderer evidence before profile rejection',async()=>{
 const {readFileSync}=await import('node:fs');
 const source=readFileSync(new URL('./runner.mjs',import.meta.url),'utf8');
 const start=source.indexOf('const renderer=await page.evaluate('),end=source.indexOf('const bytes=await page.locator',start);
 assert(start>=0&&end>start);
 const evaluate=Object.getPrototypeOf(async()=>{}).constructor('page','routeEvidence','assertWebGL','assertRendererProfile','renderProfile','row','assert',source.slice(start,end));
 for(const info of [{webgl2:true,renderer:'ANGLE SwiftShader',vendor:'test',version:'WebGL 2.0'},{webgl2:true,renderer:'ANGLE (Example Vulkan)'},{webgl2:false}]){
  const row={renderer:null};
  await assert.rejects(evaluate({evaluate:async()=>info},row,assertWebGL,assertRendererProfile,'d3d11',{routes:[]},assert));
  assert.equal(row.renderer.webgl2,info.webgl2);assert.equal(row.renderer.renderer,info.renderer);
  if(info.renderer==='ANGLE SwiftShader')assert.equal(row.renderer.class,'software');
 }
 const info={webgl2:true,renderer:'ANGLE (Example Direct3D11)'};
 await evaluate({evaluate:async()=>info},{},assertWebGL,assertRendererProfile,'d3d11',{routes:[{renderer:info},{}]},assert);
 const failed={};await assert.rejects(evaluate({evaluate:async()=>info},failed,assertWebGL,assertRendererProfile,'d3d11',{routes:[{renderer:{...info,renderer:'ANGLE (Other Direct3D11)'}},{}]},assert),/same renderer/);
 assert.equal(failed.renderer.renderer,info.renderer);
});

test('smoke config selects D3D11 or the existing software default before creating output',async t=>{
 const {readFileSync,mkdtempSync,writeFileSync,existsSync,rmSync}=await import('node:fs');
 const {join}=await import('node:path'),{tmpdir}=await import('node:os'),{fileURLToPath}=await import('node:url'),{spawnSync}=await import('node:child_process');
 const runner=fileURLToPath(new URL('./runner.mjs',import.meta.url)),source=readFileSync(runner,'utf8');
 const start=source.indexOf("const {renderProfile='swiftshader'}=cfg;"),end=source.indexOf('const out=',start);assert(start>=0&&end>start);
 const select=Function('cfg','browserLaunch',source.slice(start,end)+'return {renderProfile,launch};');
 for(const profile of [undefined,'swiftshader','d3d11']){const result=select(profile===undefined?{}:{renderProfile:profile},browserLaunch);assert.equal(result.renderProfile,profile??'swiftshader');assertArgv(['--headless',...result.launch.args],{profile:result.renderProfile});}
 const dir=mkdtempSync(join(tmpdir(),'smoke-profile-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 for(const profile of ['',null,'invalid']){
  const output=join(dir,'must-not-exist'),config=join(dir,'config.json');
  writeFileSync(config,JSON.stringify({approved:true,blockers:[],renderProfile:profile,output}));
  const result=spawnSync(process.execPath,[runner,config],{encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/Unknown render profile/);assert.equal(existsSync(output),false);
 }
});

test('both profiles and FPS capture assembly explicitly enable CDP argv inspection',async()=>{
 const {readFileSync}=await import('node:fs');
 const source=readFileSync(new URL('../quality-capture-batch/fps-worker.mjs',import.meta.url),'utf8');
 const start=source.indexOf('report.launch='),end=source.indexOf('checkInterrupted();',start);
 assert(start>=0&&end>start);
 // Only assemble the existing options; no module imports or browser launch.
 const assemble=Function('report','launch','process',source.slice(start,end)+'return report.launch;');
 for(const profile of ['swiftshader','d3d11']){
  const launch=browserLaunch(profile),fps=assemble({},launch,{env:{FPS_CAPTURE_CHROMIUM:'/usr/bin/chromium'}});
  for(const options of [launch,fps]){
   assert(options.args.includes('--enable-automation'),'CDP command-line inspection must be enabled explicitly');
   assertArgv(['--headless',...options.args],{profile});
   assert.throws(()=>assertArgv(['--headless',...options.args.filter(a=>a!=='--enable-automation')],{profile}),/enable-automation/);
  }
  assert.equal(fps.executablePath,'/usr/bin/chromium');assert.equal(fps.chromiumSandbox,launch.chromiumSandbox);
  assert.deepEqual(fps.ignoreDefaultArgs,launch.ignoreDefaultArgs);
  for(const flag of ['--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows'])assert(fps.args.includes(flag));
 }
 const runner=readFileSync(new URL('./runner.mjs',import.meta.url),'utf8');
 assert.match(runner,/session\.send\('Browser\.getBrowserCommandLine'\)/);
});
