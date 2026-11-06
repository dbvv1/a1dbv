// Read-only comparison of completed captures. Writes only the requested new summary.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {SOURCES,BUILDS,SHOTS,cleanExit,assertFrame,assertEquivalent} from './contract.mjs';
const [sourceArg,rootArg,outputArg,...extra]=process.argv.slice(2);assert(sourceArg&&rootArg&&outputArg&&!extra.length,'Usage: compare.mjs STAR_SOURCE CAPTURE_ROOT NEW_SUMMARY');
const {PNG}=createRequire(join(resolve(sourceArg),'package.json'))('pngjs');
const root=resolve(rootArg),sources=Object.keys(SOURCES),pairs=[],hash=b=>createHash('sha256').update(b).digest('hex');
const json=async p=>JSON.parse(await readFile(p,'utf8'));
for(const shot of Object.keys(SHOTS)){
 const groups=[];
 for(const commit of sources){
  const dir=join(root,commit.slice(0,8),shot),report=await json(join(dir,'report.json')),exit=await json(join(dir,'receiver-exit.json'));
  assert.equal(report.commit,commit);assert(cleanExit(report.browserProcess),'Browser exit not verified');assert.equal(report.previewClosed,true);assert.equal(report.bundleSha256,BUILDS[commit].bundle);assert.equal(report.workerSha256,BUILDS[commit].worker);assert.equal(report.servedBundleSha256,report.bundleSha256);assert.equal(report.tree,SOURCES[commit]);assert.equal(report.passed,true);assert.equal(report.capturePassed,true);assert.equal(report.cleanExitBaseline,true);assert.deepEqual(report.errors,[]);assert.equal(report.runs.length,2);
  assert.equal(exit.exitCode,0);assert.equal(exit.signal,null);assert.equal(exit.waited,true);assert(exit.startedAt&&exit.endedAt,'Missing receiver wait times');
  const records=[];
  for(let run=1;run<=2;run++){
   const record=await json(join(dir,shot+'-run'+run+'.json'));assert.deepEqual(record,report.runs[run-1]);
   assert.equal(record.png,shot+'-run'+run+'.png');const bytes=await readFile(join(dir,record.png));assert.equal(hash(bytes),record.pngSha256);const png=PNG.sync.read(bytes);assert.equal(png.width,1280);assert.equal(png.height,720);assert.equal(hash(png.data),record.rgbaSha256);
   const observation={metadata:{...record.metadata,pngDataUrl:'data:image/png;base64,'+bytes.toString('base64')},sideStatus:record.sideStatus};assertFrame(observation,shot);records.push(observation);
  }
  assertEquivalent(records[0],records[1],{pixels:true});groups.push({records,report});
 }
 assert.equal(groups[0].report.browser,groups[1].report.browser);assertEquivalent(groups[0].records[0],groups[1].records[0]);
 const before=groups[0].report.runs[0],after=groups[1].report.runs[0];
 if(shot==='academy-depth')assertEquivalent(groups[0].records[0],groups[1].records[0],{pixels:true});
 pairs.push({shot,before:sources[0],after:sources[1],stateEqual:true,pixelsEqual:before.pngSha256===after.pngSha256,beforePng:before.pngSha256,afterPng:after.pngSha256});
}
await writeFile(resolve(outputArg),JSON.stringify({comparisonPassed:true,pairs,qualityScore:'pending independent blind review'},null,2)+'\n',{flag:'wx'});
