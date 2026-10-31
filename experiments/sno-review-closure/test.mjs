import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root=resolve(process.argv[2]??'');
assert.ok(process.argv[2],'usage: node test.mjs <pinned Sno Station checkout>');
const script=join(dirname(fileURLToPath(import.meta.url)),'run.mjs');
function invoke(args){return spawnSync(process.execPath,[script,...args],{encoding:'utf8',timeout:30000});}

test('real component probe reports two preservation failures, not a product pass',()=>{
  const result=invoke([root]);
  assert.equal(result.status,1,result.stderr);
  const report=JSON.parse(result.stdout);
  assert.equal(report.results.length,8);
  assert.deepEqual(report.acceptance,{preservationFailures:2,passed:false});
  assert.deepEqual(report.results.filter(row=>row.acceptedRowLost).map(row=>[row.kind,row.timing]),[
    ['ledger','after-final-check'],['audit','after-final-check'],
  ]);
  for(const row of report.results.filter(row=>row.childAppendsCompleted)) {
    assert.equal(row.appendReceipt.exitCode,0);
    assert.equal(row.appendReceipt.tailVisibleImmediatelyAfterAppend,true);
    assert.ok(row.appendReceipt.appendedBytes>0);
  }
});
test('missing checkout fails with usage, not a zero-test pass',()=>{
  const result=invoke([]);
  assert.notEqual(result.status,0);
  assert.match(result.stderr,/usage: node run.mjs/);
  assert.equal(result.stdout,'');
});
test('changed source is rejected before the probe runs',()=>{
  const copy=mkdtempSync(join(tmpdir(),'sno-source-guard-'));
  try{
    const file='packages/memory/src/engine/telemetry/observe-ledger.ts';
    mkdirSync(dirname(join(copy,file)),{recursive:true});
    writeFileSync(join(copy,file),readFileSync(join(root,file),'utf8')+'\n// source drift\n');
    const result=invoke([copy]);
    assert.notEqual(result.status,0);
    assert.match(result.stderr,/source changed:/);
    assert.equal(result.stdout,'');
  }finally{rmSync(copy,{recursive:true,force:true});}
});
