import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {SOURCES,BUILDS,SHOTS} from './contract.mjs';
const source=process.env.STAR_CAPTURE_SOURCE;assert(source,'Set STAR_CAPTURE_SOURCE to a frozen source with existing pngjs');
const {PNG}=createRequire(join(resolve(source),'package.json'))('pngjs'),hash=b=>createHash('sha256').update(b).digest('hex');
const script=fileURLToPath(new URL('compare.mjs',import.meta.url));
function fixture(t){
 const root=mkdtempSync(join(tmpdir(),'star-capture-compare-'));t.after(()=>rmSync(root,{recursive:true,force:true}));
 for(const [i,commit] of Object.keys(SOURCES).entries())for(const [shot,p] of Object.entries(SHOTS)){
  const dir=join(root,commit.slice(0,8),shot);mkdirSync(dir,{recursive:true});
  const png=new PNG({width:1280,height:720});png.data.fill(shot==='academy-depth'?55:40+i);const bytes=PNG.sync.write(png),runs=[];
  for(let run=1;run<=2;run++){
   const record={metadata:{...p,ready:true,backend:'webgl2',renderer:'ANGLE SwiftShader',rendererInfo:{api:'webgl2',classification:'software'},shot,camera:{eye:[1,2,3],target:[0,0,0],origin:[0,0,0],fov:p.fov},input:'road-tour',frame:0,frames:1,done:true,warmupFrames:12,dt:1/60,drivingRevision:'road-v2',quality:'high',audio:'disabled',sky:'ready',image:{width:1280,height:720,dpr:1},viewport:{width:1280,height:720,dpr:1},player:{s:479,l:0,yaw:0,speed:20}},sideStatus:{space:true,power:false,warnings:[],backend:'webgl2',ticks:1682},png:shot+'-run'+run+'.png',pngSha256:hash(bytes),rgbaSha256:hash(png.data)};
   writeFileSync(join(dir,record.png),bytes);writeFileSync(join(dir,shot+'-run'+run+'.json'),JSON.stringify(record));runs.push(record);
  }
  writeFileSync(join(dir,'report.json'),JSON.stringify({commit,tree:SOURCES[commit],passed:true,capturePassed:true,cleanExitBaseline:true,errors:[],runs,browser:'156.0.8078.4',browserProcess:{exited:true,exitCode:0,signal:null},previewClosed:true,bundleSha256:BUILDS[commit].bundle,servedBundleSha256:BUILDS[commit].bundle,workerSha256:BUILDS[commit].worker}));
  writeFileSync(join(dir,'receiver-exit.json'),JSON.stringify({waited:true,exitCode:0,signal:null,startedAt:'2026-11-06T00:00:00Z',endedAt:'2026-11-06T00:01:00Z'}));
 }
 return root;
}
const run=root=>spawnSync(process.execPath,[script,source,root,join(root,'comparison.json')],{encoding:'utf8',windowsHide:true});
function edit(file,fn){const value=JSON.parse(readFileSync(file));fn(value);writeFileSync(file,JSON.stringify(value));}
const first=root=>join(root,Object.keys(SOURCES)[0].slice(0,8),'coast-chase');
test('actual comparator accepts twelve consistent PNGs and exits zero',t=>{const root=fixture(t),r=run(root);assert.equal(r.status,0,r.stderr);const result=JSON.parse(readFileSync(join(root,'comparison.json')));assert.equal(result.comparisonPassed,true);assert.deepEqual(result.pairs.map(x=>x.pixelsEqual),[false,false,true]);assert.notEqual(run(root).status,0,'Existing comparison must not overwrite');});
for(const [name,modify] of [
 ['missing parent exit',dir=>rmSync(join(dir,'receiver-exit.json'))],
 ['nonzero parent exit',dir=>edit(join(dir,'receiver-exit.json'),x=>x.exitCode=1)],
 ['unobserved browser exit',dir=>edit(join(dir,'report.json'),x=>x.browserProcess.exited=false)],
 ['stale build',dir=>edit(join(dir,'report.json'),x=>x.bundleSha256='stale')],
 ['modified PNG bytes',dir=>writeFileSync(join(dir,'coast-chase-run1.png'),'not a PNG')],
 ['forged RGBA hash',dir=>{edit(join(dir,'coast-chase-run1.json'),x=>x.rgbaSha256='false');edit(join(dir,'report.json'),x=>x.runs[0].rgbaSha256='false');}],
 ['candidate fallback',dir=>{edit(join(dir,'coast-chase-run1.json'),x=>x.sideStatus.space=false);edit(join(dir,'report.json'),x=>x.runs[0].sideStatus.space=false);}],
 ])test('actual comparator rejects '+name,t=>{const root=fixture(t);modify(first(root));const r=run(root);assert.notEqual(r.status,0);});
test('actual comparator rejects missing CLI arguments before outputs',()=>{const r=spawnSync(process.execPath,[script],{encoding:'utf8',windowsHide:true});assert.notEqual(r.status,0);assert.match(r.stderr,/Usage:/);});
