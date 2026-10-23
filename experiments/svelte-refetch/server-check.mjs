import {checkPrerequisites,newTrialDirectory} from './preflight.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
checkPrerequisites(process.cwd(),undefined,false);
const {compile}=await import('svelte/compiler');
const {build}=await import('esbuild');
const trialDir=newTrialDirectory(process.cwd());
const captured=await build({entryPoints:['src/lib/data.remote.ts'],bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'capture-query-contract',setup(b){b.onResolve({filter:/^\$app\/server$/},()=>({path:'query',namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:'export function query(schema,fn){return {schema,fn}}'}));}}]});
fs.writeFileSync(trialDir+'/server-contract.mjs',captured.outputFiles[0].text);
const {getPosts}=await import(trialDir+'/server-contract.mjs');
assert.deepEqual(getPosts.schema.parse({}),{page:1,limit:10});
assert.equal(getPosts.schema.safeParse(undefined).success,false);
assert.equal(getPosts.schema.safeParse({page:0,limit:5}).success,false);
const result=await getPosts.fn(getPosts.schema.parse({page:2,limit:5}));
assert.deepEqual(result.data.map(p=>p.id),[6,7,8,9,10]);
console.log('PASS actual server handler page 2; missing fields default; missing object and invalid page rejected');
for(const name of ['Pagination','Data','+page']){
 const source=fs.readFileSync('src/routes/'+name+'.svelte','utf8').replace('"runed/kit"','"./ssr-state.js"').replace('"$app/state"','"./ssr-state.js"').replace('"$lib/data.remote"','"./ssr-remote.js"');
 const out=compile(source,{filename:name+'.svelte',generate:'server',dev:false,experimental:{async:true}}).js.code.replaceAll('./Pagination.svelte','./ssr-Pagination.js').replaceAll('./Data.svelte','./ssr-Data.js');fs.writeFileSync(trialDir+'/ssr-'+name+'.js',out);
}
fs.writeFileSync(trialDir+'/ssr-state.js','export const navigating={to:null};export function useSearchParams(){return {page:1,limit:5}}');
fs.writeFileSync(trialDir+'/ssr-remote.js','export function getPosts(){return Promise.resolve({data:[],pagination:{totalPages:0}})}');
fs.writeFileSync(trialDir+'/ssr-entry.js',"import {render} from 'svelte/server';import App from './ssr-+page.js';export const html=(await render(App)).body;");
const ssr=await build({entryPoints:[trialDir+'/ssr-entry.js'],bundle:true,write:false,platform:'node',format:'esm',conditions:['node']});fs.writeFileSync(trialDir+'/ssr-bundle.mjs',ssr.outputFiles[0].text);
const {html}=await import(trialDir+'/ssr-bundle.mjs');assert.match(html,/Initial loading provided by boundary/);assert.equal(html.includes('<table'),false);console.log('PASS server render preserves existing initial pending markup (not initial rows)');
