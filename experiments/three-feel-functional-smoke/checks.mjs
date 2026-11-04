import assert from 'node:assert/strict';
import {resolve,sep} from 'node:path';
export function staticPath(root,request){root=resolve(root);const pathname=decodeURIComponent(new URL(request,'http://localhost').pathname);let path=resolve(root,'.'+pathname);if(path===root||pathname.endsWith('/'))path=resolve(path,'index.html');assert(path.startsWith(root+sep));return path;}
export function fpsPair(routes){assert.equal(routes.length,2);assert.notEqual(routes[0].observation.state.smoke.runs[0].hash,routes[1].observation.state.smoke.runs[0].hash,'Candidate movement must differ from baseline on fixed tape');}


// Dedicated case-only browsers. The outer execution sandbox remains unchanged.
export const requiredBrowserArgs=Object.freeze(['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']);
export const gpuBrowserArgs=Object.freeze(['--enable-gpu','--use-angle=d3d11']);
export function browserLaunch(profile='swiftshader'){
 assert(['swiftshader','d3d11'].includes(profile),'Unknown render profile: '+profile);
 // D3D11 keeps the browser sandbox. Exclude only Playwright's software fallback
 // opt-in; all other defaults remain. Never retry with a different profile.
 return profile==='swiftshader'
  ?{headless:true,chromiumSandbox:false,args:[...requiredBrowserArgs],timeout:30000}
  :{headless:true,chromiumSandbox:true,ignoreDefaultArgs:['--enable-unsafe-swiftshader'],args:[...gpuBrowserArgs],timeout:30000};
}
export const caseOrigins=Object.freeze([
 'https://dbvv1-moba-like.pretty-llama-9945.chatgpt.site',
 'https://dbvv1-fps-like.pretty-llama-9945.chatgpt.site',
 'https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site',
]);
export function assertCaseUrl(value){
 const url=new URL(value);
 assert(!url.username&&!url.password,'Credentials are not allowed in capture URLs');
 const loopback=url.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(url.hostname);
 assert(loopback||caseOrigins.includes(url.origin),'Only local previews or the three case sites are allowed');
 return url;
}
export function assertArgv(argv,{headless=true,profile='swiftshader'}={}){
 const launch=browserLaunch(profile);
 assert(Array.isArray(argv)&&argv.every(a=>typeof a==='string'),'Actual Chromium argv required');
 if(headless){
  const flags=argv.filter(a=>/^--headless(?:=|$)/.test(a));
  assert(flags.length&&flags.every(a=>/^--headless(?:=(?:new|old|true))?$/.test(a))&&!argv.includes('--headed'),'Headless Chromium required');
 }
 for(const flag of launch.args){
  assert(argv.includes(flag),'Missing required browser argument: '+flag);
  const key=flag.split('=')[0];
  assert(argv.filter(a=>a===key||a.startsWith(key+'=')).every(a=>a===flag),'Conflicting browser argument: '+key);
 }
 assert(argv.filter(a=>/^--use-angle(?:=|$)/.test(a)).every(a=>a==='--use-angle='+profile),'Conflicting ANGLE backend');
 const forbidden=profile==='d3d11'
  ?['--no-sandbox','--disable-setuid-sandbox','--enable-unsafe-swiftshader','--disable-gpu','--use-gl','--software']
  :['--enable-gpu','--disable-gpu','--use-gl'];
 for(const flag of forbidden)assert(!argv.some(a=>a===flag||a.startsWith(flag+'=')),'Conflicting browser argument: '+flag);
}
// A requested profile is not hardware evidence. Non-software remains unknown
// unless the existing consumer supplies its own hardware classification.
export function assertRendererProfile(info,profile='swiftshader'){
 browserLaunch(profile);
 const classification=assertWebGL(info);
 if(profile==='swiftshader')assert.equal(classification,'software','SwiftShader profile requires software renderer evidence');
 else{
  assert.notEqual(classification,'software','D3D11 profile fell back to software');
  assert(info.renderer,'D3D11 requires an unmasked renderer');
  assert.match(info.renderer,/Direct3D11|D3D11/i,'D3D11 renderer not observed');
 }
 return classification;
}
export async function restrictCaseContext(context,base){
 const origin=assertCaseUrl(base).origin;
 // Context routing includes popups; service workers must be blocked at creation.
 await context.route('**/*',async route=>{
  try{
   assert.equal(assertCaseUrl(route.request().url()).origin,origin);
   // Playwright only routes the first URL in a redirect chain. Never follow it.
   const response=await route.fetch({maxRedirects:0});
   if(response.status()>=300&&response.status()<400)return route.abort('blockedbyclient');
   return route.fulfill({response});
  }catch{return route.abort('blockedbyclient');}
 });
 // Fixed captures do not need WebSocket services, even on the preview origin.
 await context.routeWebSocket('**/*',socket=>socket.close());
}

export const launch=browserLaunch();
export function assertWebGL(info){assert.equal(info?.webgl2,true);assert(info.renderer||info.maskedRenderer);return /swiftshader|llvmpipe|softpipe|software|lavapipe|\bwarp\b|microsoft basic render/i.test(info.renderer||info.maskedRenderer)?'software':'unknown';}
export function mobaProgress(a,b,version){assert.equal(a.snapshot.contentVersion,version);assert.equal(b.snapshot.contentVersion,version);assert.equal(a.state.backend,'three-webgl2');assert(a.state.ready&&b.state.ready);assert(b.snapshot.tick>a.snapshot.tick);}
export function starProgress(a,b,revision){assert(a.ready&&b.ready&&!a.error&&!b.error);assert.equal(a.drivingRevision,revision);assert.equal(b.drivingRevision,revision);assert.equal(b.frame,a.frame+1);assert.equal(b.tick,a.tick+1);assert.equal(a.input,'accelerate-brake');assert(b.player.s>a.player.s);assert.equal(b.rendererInfo.api,'webgl2');}
export function fpsProgress(a){assert(a.state.ready);assert.equal(a.state.backend,'three-webgl2');const s=a.state.smoke;assert.equal(s?.version,'ground-v1');assert.equal(s.pass,1);assert.equal(s.steps,144);assert.equal(s.complete,true);assert.equal(a.state.locked,false);assert.equal(a.state.running,false);assert.equal(s.runs.length,2);for(const run of s.runs){assert.equal(run.ticks,144);assert.equal(typeof run.hash,'string');assert(run.hash.length>0);}assert.equal(s.runs[0].hash,s.runs[1].hash);}
