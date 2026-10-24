import { mkdir, mkdtemp, readFile, writeFile, readdir, symlink, cp } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { compile } from '@mdx-js/mdx';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const args=process.argv.slice(2);
if(!args[0] || !([1,3].includes(args.length)) || (args.length===3 && args[1]!=='--output-parent')) {
  console.error('Usage: node acceptance.mjs /path/to/built/openspec/bin/openspec.js [--output-parent /path/to/results]');
  process.exit(2);
}
const cli = resolve(args[0]);
const root = fileURLToPath(new URL('.', import.meta.url));
const outputParent=resolve(args[2] ?? tmpdir());
await mkdir(outputParent,{recursive:true});
const runRoot=await mkdtemp(join(outputParent,'openspec-mdx-acceptance-'));
// Compiled fixture modules resolve the exact consumer dependencies installed here.
await symlink(join(root,'node_modules'),join(runRoot,'node_modules'),'junction');
const observations = [];
async function buildDigest() {
  const files=[];
  async function walk(dir) { for(const entry of await readdir(dir,{withFileTypes:true})) {const p=join(dir,entry.name); if(entry.isDirectory()) await walk(p); else if(entry.name.endsWith('.js')) files.push(p);} }
  await walk(resolve(cli,'../../dist'));
  const digest=createHash('sha256');
  for(const file of files.sort()) {digest.update(file.replace(resolve(cli,'../../dist'),''));digest.update(await readFile(file));}
  return {sha256:digest.digest('hex'),javascriptFiles:files.length};
}
async function put(file, content) { await mkdir(resolve(file, '..'), {recursive:true}); await writeFile(file, content); }
function command(cwd, ...args) { return invoke(cwd,args,false); }
function commandFail(cwd, ...args) { return invoke(cwd,args,true); }
function invoke(cwd,args,expectFailure) {
  const result = spawnSync(process.execPath, [cli, ...args], {cwd, encoding:'utf8', env:{...process.env, OPENSPEC_TELEMETRY:'0', DO_NOT_TRACK:'1', NO_COLOR:'1', XDG_CONFIG_HOME:join(runRoot,'config')}});
  observations.push({cwd, args,expectFailure, status:result.status, stdout:result.stdout, stderr:result.stderr});
  if(expectFailure) assert(result.status !== null && result.status !== 0, `CLI ${args.join(' ')} should reject this invalid input`);
  else assert.equal(result.status,0, `CLI ${args.join(' ')} failed: ${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
const stable = `### Requirement: Delivery promise
The storefront SHALL display a three-business-day delivery promise.

#### Scenario: Shopper checks delivery
- **WHEN** a shopper reviews shipping options
- **THEN** a three-business-day delivery promise is displayed

<PolicyCard kind="delivery" value="3 business days" />`;
function threshold(amount) { return `### Requirement: Free shipping threshold
The storefront SHALL offer free shipping for orders totaling at least ${amount} dollars.

#### Scenario: Eligible basket
- **WHEN** a basket totals ${amount} dollars
- **THEN** shipping is free

<PolicyCard kind="threshold" value={${amount}} />`; }
const preamble = `import { PolicyCard } from '#policy-card'

export const policy = {currency: 'USD', market: 'US'}

# Shipping policy

## Purpose

Help shoppers understand the shipping costs and delivery promises before they place an order.

<PolicyCard kind="market" value={policy.market} />`;
async function consumer(cwd, phase, amount) {
  const specPath = join(cwd,'openspec/specs/shipping/spec.mdx');
  const content = await readFile(specPath,'utf8');
  assert(content.includes("import { PolicyCard } from '#policy-card'"), 'MDX import preserved');
  assert(content.includes("export const policy = {currency: 'USD', market: 'US'}"), 'MDX export preserved');
  assert(content.includes(stable), 'Untouched requirement preserved byte-for-byte');
  assert(content.includes(threshold(amount)), 'Changed requirement is exact expected complete block');
  const compiled = await compile({path:specPath,value:content},{format:'mdx'});
  const modulePath=join(cwd,'openspec/specs/shipping',`${phase}.mjs`);
  await writeFile(modulePath,String(compiled));
  const mod=await import(pathToFileURL(modulePath).href);
  assert.deepEqual(mod.policy,{currency:'USD',market:'US'});
  const html=renderToStaticMarkup(React.createElement(mod.default));
  assert(html.includes(`data-kind="threshold">${amount}</aside>`), 'Threshold React component renders expected value');
  assert(html.includes('data-kind="delivery">3 business days</aside>'), 'Unchanged React component renders');
  assert(html.includes('data-kind="market">US</aside>'), 'Purpose component and export expression render');
  assert(!html.includes('ADDED Requirements') && !html.includes('MODIFIED Requirements'), 'Canonical document has no delta headings');
  if(amount !== 50) assert(!html.includes('data-kind="threshold">50</aside>'), 'Old value removed');
  await put(join(runRoot,`${phase}.html`),html);
  await put(join(runRoot,`${phase}.mdx`),content);
  return {phase,amount,mdxBytes:content.length,htmlBytes:html.length,importPreserved:true,exportPreserved:true,unchangedRequirementExact:true,compiled:true,serverRendered:true};
}
try {
  const buildBefore=await buildDigest();
  const cwd=join(runRoot,'mdx-project');
  await put(join(cwd,'package.json'),JSON.stringify({type:'module',imports:{'#policy-card':'./policy-card.mjs'}}));
  await put(join(cwd,'policy-card.mjs'),`import {createElement} from 'react';\nexport function PolicyCard({kind,value}) { return createElement('aside',{'data-kind':kind},String(value)); }\n`);
  await put(join(cwd,'openspec/config.yaml'),'schema: mdx-consumer\nspecFormat: mdx\n');
  await put(join(cwd,'openspec/schemas/mdx-consumer/schema.yaml'),`name: mdx-consumer
version: 1
description: Consumer acceptance for MDX shipping-policy specifications
artifacts:
  - id: specs
    generates: "specs/**/spec.mdx"
    description: MDX specification deltas
    template: spec.mdx
    instruction: Preserve MDX imports and use Markdown requirement delta headings.
    requires: []
  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [specs]
apply:
  requires: [tasks]
  tracks: tasks.md
  instruction: Read the MDX specifications and verify the rendered policy.
`);
  await put(join(cwd,'openspec/schemas/mdx-consumer/templates/spec.mdx'),'## ADDED Requirements\n\n### Requirement: Name\nThe system SHALL behave as specified.\n\n#### Scenario: Example\n- **WHEN** invoked\n- **THEN** it works\n');
  await put(join(cwd,'openspec/schemas/mdx-consumer/templates/tasks.md'),'## 1. Implement\n- [ ] 1.1 Verify rendering\n');
  const results=[];
  for(const [phase,amount] of [['initial-policy',50],['raise-threshold',75]]) {
    command(cwd,'new','change',phase,'--schema','mdx-consumer','--json');
    const instruction=command(cwd,'instructions','specs','--change',phase,'--json');
    assert(instruction.includes('spec.mdx'), 'Instructions name MDX output');
    const delta=phase==='initial-policy'?`${preamble}\n\n## ADDED Requirements\n\n${threshold(amount)}\n\n${stable}\n`:`## MODIFIED Requirements\n\n${threshold(amount)}\n`;
    await put(join(cwd,'openspec/changes',phase,'specs/shipping/spec.mdx'),delta);
    await compile({path:join(cwd,'openspec/changes',phase,'specs/shipping/spec.mdx'),value:delta},{format:'mdx'});
    await put(join(cwd,'openspec/changes',phase,'tasks.md'),'## 1. Policy\n- [x] 1.1 Author full shipping requirement delta and verify MDX compilation\n');
    const status=command(cwd,'status','--change',phase,'--json');
    assert(status.includes('"done"'), 'Schema discovers authored MDX artifact');
    const apply=command(cwd,'instructions','apply','--change',phase,'--json');
    assert(apply.includes('spec.mdx') || apply.includes('*.mdx'), 'Apply context includes MDX specification');
    command(cwd,'validate',phase,'--type','change','--strict','--json');
    command(cwd,'archive',phase,'--yes','--json');
    command(cwd,'list','--specs','--json');
    const shown=command(cwd,'show','shipping','--type','spec','--json');
    assert(shown.includes('Free shipping threshold')&&shown.includes('Delivery promise'), 'Canonical discovery and show include both requirements');
    command(cwd,'validate','shipping','--type','spec','--strict','--json');
    results.push(await consumer(cwd,phase,amount));
    const archived=await readdir(join(cwd,'openspec/changes/archive'));
    assert(archived.some(n=>n.endsWith(phase)), 'Change archived');
  }
  const baseline=join(runRoot,'markdown-project');
  await put(join(baseline,'openspec/config.yaml'),'schema: spec-driven\n');
  await put(join(baseline,'openspec/changes/markdown-baseline/.openspec.yaml'),'schema: spec-driven\n');
  await put(join(baseline,'openspec/changes/markdown-baseline/specs/status/spec.md'),`# Status delta\n\n## Purpose\n\nExpose a reliable service status message to operators checking service availability.\n\n## ADDED Requirements\n\n### Requirement: Service status\nThe system SHALL report ready when available.\n\n#### Scenario: Ready status\n- **WHEN** status is requested\n- **THEN** ready is returned\n`);
  await put(join(baseline,'openspec/changes/markdown-baseline/tasks.md'),'## 1. Status\n- [x] 1.1 Implement status\n');
  command(baseline,'validate','markdown-baseline','--type','change','--strict','--json');
  command(baseline,'archive','markdown-baseline','--yes','--json');
  command(baseline,'validate','status','--type','spec','--strict','--json');
  assert((await readFile(join(baseline,'openspec/specs/status/spec.md'),'utf8')).includes('Service status'));

  const negativeResults=[];
  async function snapshot(dir) {
    const files={};
    async function walk(p) { for(const entry of await readdir(p,{withFileTypes:true})) {const full=join(p,entry.name);if(entry.isDirectory()) await walk(full);else files[full.slice(dir.length+1)]=createHash('sha256').update(await readFile(full)).digest('hex');} }
    await walk(dir);return files;
  }
  for(const negative of ['invalid-mdx','opposite-format-collision']) {
    const project=join(runRoot,negative);
    await cp(cwd,project,{recursive:true});
    command(project,'new','change',negative,'--schema','mdx-consumer','--json');
    const delta=`## MODIFIED Requirements\n\n${threshold(100)}\n`+(negative==='invalid-mdx'?'\n<PolicyCard value={\n':'');
    await put(join(project,'openspec/changes',negative,'specs/shipping/spec.mdx'),delta);
    await put(join(project,'openspec/changes',negative,'tasks.md'),'## 1. Negative fixture\n- [x] 1.1 Author a deliberately invalid fixture\n');
    if(negative==='opposite-format-collision') await put(join(project,'openspec/specs/shipping/spec.md'),await readFile(join(project,'openspec/specs/shipping/spec.mdx'),'utf8'));
    const before=await snapshot(join(project,'openspec'));
    const validation=commandFail(project,'validate',negative,'--type','change','--strict','--json');
    const archive=commandFail(project,'archive',negative,'--yes','--json');
    const validationResult=JSON.parse(validation);
    const archiveResult=JSON.parse(archive);
    assert.equal(archiveResult.archive,null,'Rejected archive returns no archive result');
    if(negative==='invalid-mdx') {
      assert(validationResult.items?.some(item=>item.issues?.some(issue=>issue.path==='shipping/spec.mdx' && /expression|brace/i.test(issue.message))),'Malformed MDX reports its actual syntax error');
      assert(archiveResult.status?.some(status=>status.code==='archive_validation_failed'),'Archive fails validation rather than an unrelated error');
    } else {
      assert(validationResult.status?.some(status=>/spec\.md/.test(status.message) && /spec\.mdx/.test(status.message)),'Validation diagnoses the opposite-format collision');
      assert(archiveResult.status?.some(status=>/mixed canonical formats/.test(status.message)),'Archive diagnoses the opposite-format collision');
    }
    assert.deepEqual(await snapshot(join(project,'openspec')),before,`${negative}: failed validation/archive must not mutate specs or changes`);
    negativeResults.push({case:negative,validationRejected:true,archiveRejected:true,noMutation:true});
  }

  const buildAfter=await buildDigest();
  assert.deepEqual(buildAfter,buildBefore,'CLI build must remain unchanged during acceptance');
  const summary={passed:true,nodeVersion:process.version,buildDigest:buildAfter,consumerVersions:JSON.parse(await readFile(join(root,'package.json'),'utf8')).dependencies,results,negativeResults,markdownBaseline:true,limitations:['Synthetic shipping-policy fixture, not a production integration','React server rendering, not browser visual or interaction QA','Independent consumer acceptance, not an independent coding-agent control']};
  await put(join(runRoot,'summary.json'),JSON.stringify(summary,null,2));
  console.log(JSON.stringify(summary,null,2));
} catch(error) {
  await put(join(runRoot,'failure.txt'),error.stack??String(error));
  console.error(error); process.exitCode=1;
} finally { await put(join(runRoot,'cli-transcript.json'),JSON.stringify(observations,null,2).replaceAll(runRoot,'$OUTPUT').replaceAll(resolve(cli,'../..'),'$OPENSPEC')); console.log(`Evidence: ${runRoot}`); }
