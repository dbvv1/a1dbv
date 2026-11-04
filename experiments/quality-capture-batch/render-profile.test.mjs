// CPU-only preparation against the batch's actual frozen source. Never import a worker.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdtempSync,mkdirSync,writeFileSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync,spawnSync} from 'node:child_process';
import {browserLaunch,assertArgv} from '../three-feel-functional-smoke/checks.mjs';
const here=fileURLToPath(new URL('.',import.meta.url));
function sourceRoot(name){const root=process.env[name];assert(root,'Set '+name+' to the batch frozen source with existing dependencies');return resolve(root);}
function prepare(t,game,{corrupt=false}={}){
 const dir=mkdtempSync(join(tmpdir(),'capture-profile-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const moba=sourceRoot('MOBA_CAPTURE_SOURCE'),star=sourceRoot('STAR_CAPTURE_SOURCE');
 let root=game==='moba'?moba:star;
 if(corrupt){
  root=join(dir,'changed-source');mkdirSync(join(root,game==='moba'?'tools':'tests'),{recursive:true});
  writeFileSync(join(root,'package.json'),'{}');
  if(game==='moba')symlinkSync(join(moba,'node_modules'),join(root,'node_modules'),'junction');
  const path=game==='moba'?'tools/capture.mjs':'tests/capture.mjs';
  const source=readFileSync(join(game==='moba'?moba:star,path),'utf8');
  writeFileSync(join(root,path),source.replace(game==='moba'?'const launch={host:':'const launchOptions={headless:','const unexpectedLaunch={headless:'));
 }
 const output=join(dir,game+'-worker.mjs');
 const args=[join(here,game+'-adapter.mjs'),root,...(game==='star'?[moba]:[]),output];
 return {args,output,dir};
}
for(const game of ['moba','star']){
 test(game+' frozen consumer generates syntactically valid D3D11 launch and evidence checks',t=>{
  const {args,output}=prepare(t,game);execFileSync(process.execPath,args);execFileSync(process.execPath,['--check',output]);
  const source=readFileSync(output,'utf8');
  assert.match(source,/CAPTURE_RENDER_PROFILE\?\?'d3d11'/);assert.match(source,/Frozen quality batch requires d3d11 profile/);
  assert.match(source,/assertArgv\([^\n]+profile:renderProfile/);assert.match(source,/assertRendererProfile\(/);
  assert.match(source,/renderProfile[,:=]/);
  const name=game==='moba'?'launch':'launchOptions';
  const expression=source.match(new RegExp('const '+name+'=(\\{[\\s\\S]*?\\});'))?.[1];assert(expression);
  const launch=Function('browserLaunch','renderProfile','values','executablePath','process','return ('+expression+')')(browserLaunch,'d3d11',{headed:false,software:false},undefined,{env:{}});
  assert.equal(launch.headless,true);assert.equal(launch.chromiumSandbox,true);assert.deepEqual(launch.ignoreDefaultArgs,['--enable-unsafe-swiftshader']);
  assertArgv(['--headless',...launch.args],{profile:'d3d11'});
  assert(!launch.args.includes('--use-angle=swiftshader'));
  if(game==='star')assert.match(source,/assert.equal\(classification,'gpu'/);else assert.match(source,/assert.equal\(meta.rendererClass,'gpu'/);
 });
 test(game+' changed launch contract fails preparation instead of leaving a legacy launch',t=>{
  const {args,output}=prepare(t,game,{corrupt:true});const result=spawnSync(process.execPath,args,{encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/Native GPU profile contract changed/);
  assert.equal(existsSync(output),false);
 });
}
test('FPS invalid or empty profile fails before dependencies, output or browser initialization',t=>{
 const dir=mkdtempSync(join(tmpdir(),'fps-profile-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 for(const profile of ['invalid','']){
  const output=join(dir,'must-not-exist');
  const result=spawnSync(process.execPath,[join(here,'fps-worker.mjs'),'missing-fps','missing-moba',output],{env:{...process.env,CAPTURE_RENDER_PROFILE:profile},encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/Unknown render profile/);assert.equal(existsSync(output),false);
 }
});

test('FPS actual launch expression uses selected profile and preserves the software default',()=>{
 const source=readFileSync(join(here,'fps-worker.mjs'),'utf8');
 const declaration=source.match(/const renderProfile=([^;]+);/)?.[0];assert(declaration);
 const expression=source.match(/report.launch=(\{[^;]+\});/)?.[1];assert(expression);
 for(const profile of [undefined,'swiftshader','d3d11']){
  const env={FPS_CAPTURE_CHROMIUM:'VERIFIED_BROWSER'};if(profile!==undefined)env.CAPTURE_RENDER_PROFILE=profile;
  const result=Function('process','browserLaunch',declaration+'return {profile:renderProfile,launch:'+expression+'};')({env},browserLaunch);
  assert.equal(result.profile,profile??'swiftshader');assert.equal(result.launch.executablePath,'VERIFIED_BROWSER');
  assertArgv(['--headless',...result.launch.args],{profile:result.profile});
 }
});

test('Star preserves actual renderer before exact hardware-evidence mismatch rejects a frame',async t=>{
 const {args,output}=prepare(t,'star');execFileSync(process.execPath,args);
 const source=readFileSync(output,'utf8');
 const start=source.indexOf('const metadata=await page.evaluate('),end=source.indexOf('const stem=',start);assert(start>=0&&end>start);
 const evaluate=Object.getPrototypeOf(async()=>{}).constructor('page','report','preset','frame','evidence','assert',source.slice(start,end));
 for(const renderer of ['ANGLE (Different Direct3D11)','ANGLE SwiftShader']){
  const meta={frame:0,viewport:{width:1280,height:720,dpr:1},renderer,rendererInfo:{api:'webgl2'}},report={};
  await assert.rejects(evaluate({evaluate:async()=>meta},report,{width:1280,height:720},0,{renderer:'Original exact GPU'},assert),/hardware evidence renderer must match/);
  assert.deepEqual(report.lastRenderer,{renderer,rendererInfo:meta.rendererInfo});
 }
});
