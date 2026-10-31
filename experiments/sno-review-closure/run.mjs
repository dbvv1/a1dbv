// Component proof: exact pinned functions, real files and a separate append process.
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { stripTypeScriptTypes } from 'node:module';
import { StringDecoder } from 'node:string_decoder';
import vm from 'node:vm';

const SOURCE_COMMIT = 'd80696aa854803f6224f2da7cf6eebb6de8f09ad';
const specs = {
  ledger: { path: 'packages/memory/src/engine/telemetry/observe-ledger.ts', sha256: '749d13cc84a3adc40b3d67707ac6cc7552fd25c984fbddc48d51a766157b3939', ranges: [[41,67],[84,140]], exports: ['consumeRows','appendObserveLedgerRows'] },
  audit: { path: 'packages/memory/src/engine/operations/runtime-audit-log.ts', sha256: '07418176e3bf3f2379bc58bd9c34962cec64eea73d9c48c7008223e9d111b08e', ranges: [[341,404],[412,414]], exports: ['compactAuditFile'] },
};
const hash = value => createHash('sha256').update(value).digest('hex');
const source = resolve(process.argv[2] ?? '');
assert.ok(process.argv[2], 'usage: node run.mjs <pinned Sno Station checkout>');
const fragments = {};
for (const [key,spec] of Object.entries(specs)) {
  const text = fs.readFileSync(join(source,spec.path),'utf8');
  assert.equal(hash(text),spec.sha256,`source changed: ${spec.path}`);
  const lines = text.split('\n');
  fragments[key] = spec.ranges.map(([first,last])=>lines.slice(first-1,last).join('\n')).join('\n');
}
function load(key, overrides={}) {
  // No algorithm rewrite. Remove only ESM export markers and TypeScript types.
  const code = stripTypeScriptTypes(fragments[key].replace(/^export /gm,''),{mode:'strip'});
  const unexpectedLog = {warn(){throw Error('unexpected warning');}};
  return vm.runInNewContext(`${code}\n({${specs[key].exports.join(',')}})`, {
    ...fs, ...overrides, Buffer, join, dirname, randomUUID, StringDecoder, log:unexpectedLog,
  }, {timeout:5000});
}
const marker = 'late-accepted-row';
function ledgerRow(id, padding='') {
  return {ts_ms:1,event_type:'skill.run',lane:'skill',payload:{id,padding}};
}
if (process.argv[3] === 'writer') {
  const kind=process.argv[4], target=process.argv[5];
  if(kind==='ledger') load('ledger').appendObserveLedgerRows(target,[ledgerRow(marker)]);
  else fs.appendFileSync(target,JSON.stringify({timestamp:new Date().toISOString(),event:'rem_completed',details:{id:marker}})+'\n');
  const file=kind==='ledger'?join(target,'observe','ledger.jsonl'):target;
  const text=fs.readFileSync(file,'utf8');
  const tail=text.trimEnd().split('\n').at(-1);
  assert.ok(tail.includes(marker));
  process.stdout.write(JSON.stringify({marker,appendedBytes:Buffer.byteLength(tail)+1,fileBytes:fs.statSync(file).size})+'\n');
} else {
  const root=fs.mkdtempSync(join(tmpdir(),'sno-compaction-proof-'));
  const results=[];
  const writer=(kind,target)=>{
    const child=spawnSync(process.execPath,[fileURLToPath(import.meta.url),source,'writer',kind,target],{
      encoding:'utf8',timeout:10000,env:{...process.env,HOME:join(root,'home'),TMPDIR:root},
    });
    assert.equal(child.status,0,child.error?.message??child.stderr);
    const receipt=JSON.parse(child.stdout);
    assert.equal(receipt.marker,marker);
    assert.ok(receipt.appendedBytes>0);
    const file=kind==='ledger'?join(target,'observe','ledger.jsonl'):target;
    assert.equal(fs.statSync(file).size,receipt.fileBytes);
    assert.ok(fs.readFileSync(file,'utf8').trimEnd().split('\n').at(-1).includes(marker),'actual appended tail visible before destructive operation');
    return {exitCode:child.status,appendedBytes:receipt.appendedBytes,tailVisibleImmediatelyAfterAppend:true};
  };
  try {
    fs.mkdirSync(join(root,'home'));
    for(const kind of ['ledger','audit']) for(const timing of ['none','before-final-check','after-final-check','after-operation']) {
      const directory=join(root,`${kind}-${timing}`);fs.mkdirSync(directory);
      let injected=0,checks=0,appendReceipt=null,returnedIds=[];
      let path,target, operation, nextRead;
      if(kind==='ledger') {
        path=join(directory,'observe','ledger.jsonl');target=directory;
        fs.mkdirSync(dirname(path));
        const consumed=(JSON.stringify(ledgerRow('old','x'.repeat(1024)))+'\n').repeat(1024);
        fs.writeFileSync(path,consumed+JSON.stringify(ledgerRow('current'))+'\n');
        fs.writeFileSync(join(directory,'observe','ledger.synced'),String(Buffer.byteLength(consumed)));
        const api=load(kind,{fstatSync(fd,...args){
          checks++;
          if(checks===2&&timing==='before-final-check'){appendReceipt=writer(kind,target);injected++;}
          const result=fs.fstatSync(fd,...args);
          if(checks===2&&timing==='after-final-check'){appendReceipt=writer(kind,target);injected++;}
          return result;
        }});
        const observe={logger:{warn(message){throw Error(message);}}};
        operation=()=>{
          const consumed=api.consumeRows(directory,observe,50);
          returnedIds=Array.from(consumed.rows,row=>JSON.parse(row.text).payload.id);
          assert.deepEqual(returnedIds,['current']);
        };
        nextRead=()=>Array.from(load(kind).consumeRows(directory,observe,50).rows,row=>JSON.parse(row.text).payload.id);
      } else {
        path=join(directory,'audit.jsonl');target=path;
        const old=JSON.stringify({timestamp:'2020-01-01T00:00:00.000Z',event:'startup',details:{padding:'x'.repeat(1024)}})+'\n';
        fs.writeFileSync(path,old.repeat(Math.ceil(17*1024*1024/Buffer.byteLength(old))));
        const api=load(kind,{statSync(file,...args){
          if(file===path)checks++;
          if(file===path&&checks===3&&timing==='before-final-check'){appendReceipt=writer(kind,target);injected++;}
          const result=fs.statSync(file,...args);
          if(file===path&&checks===3&&timing==='after-final-check'){appendReceipt=writer(kind,target);injected++;}
          return result;
        }});
        operation=()=>api.compactAuditFile(path);
        nextRead=()=>fs.readFileSync(path,'utf8').trim().split('\n').map(line=>JSON.parse(line).details?.id).filter(Boolean);
      }
      operation();
      if(timing==='after-operation'){appendReceipt=writer(kind,target);injected++;}
      assert.equal(injected,timing==='none'?0:1,'writer must actually complete');
      const markerOnDisk=fs.readFileSync(path,'utf8').includes(marker);
      const readIds=nextRead();
      const expectedSurvival=timing==='before-final-check'||timing==='after-operation';
      if(timing!=='after-final-check') assert.equal(markerOnDisk,expectedSurvival);
      assert.equal(readIds.includes(marker),markerOnDisk);
      results.push({kind,timing,childAppendsCompleted:injected,appendReceipt,statCallCount:checks,markerReturnedByCompactor:returnedIds.includes(marker),markerOnDisk,markerReadableNext:readIds.includes(marker),acceptedRowLost:injected===1&&!returnedIds.includes(marker)&&!markerOnDisk});
    }
    const preservationFailures=results.filter(result=>result.acceptedRowLost).length;
    console.log(JSON.stringify({acceptance:{preservationFailures,passed:preservationFailures===0},sourceCommit:SOURCE_COMMIT,node:process.version,platform:process.platform,sources:Object.fromEntries(Object.entries(specs).map(([key,s])=>[key,{path:s.path,sha256:s.sha256,ranges:s.ranges,functionTextSha256:hash(fragments[key])}])),scope:'exact extracted production functions; controlled separate-process append schedule; no full plugin, sidecar, model or network',results},null,2));
    if(preservationFailures) process.exitCode=1;
  } finally {
    // Only this newly-created synthetic fixture tree is removed.
    fs.rmSync(root,{recursive:true,force:true});
  }
}
