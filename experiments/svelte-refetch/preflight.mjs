import fs from 'node:fs';
import path from 'node:path';
export function checkPrerequisites(root,tools,client=true){
 const need=(file)=>{if(!fs.existsSync(file))throw new Error('Missing required file: '+file);};
 const json=(file)=>{need(file);return JSON.parse(fs.readFileSync(file,'utf8'));};
 for(const [name,version] of [['svelte','5.43.10'],['@sveltejs/kit','2.48.5']]){
  const found=json(path.join(root,'node_modules',name,'package.json')).version;
  if(found!==version)throw new Error(`Expected ${name} ${version}, found ${found}; restore the fixed lockfile with npm ci`);
 }
 for(const file of ['src/routes/Data.svelte','src/routes/Pagination.svelte','src/routes/+page.svelte','src/lib/data.remote.ts','node_modules/esbuild/package.json'])need(path.join(root,file));
 const queryFile=path.join(root,'node_modules/@sveltejs/kit/src/runtime/client/remote-functions/query.svelte.js');need(queryFile);
 const query=fs.readFileSync(queryFile,'utf8');
 if(!query.includes('export class Query {'))throw new Error('Expected Query extraction marker is missing; do not use a different runtime version');
 if(client){
  if(!tools)throw new Error('Set SVELTE_TEST_TOOLS to the separate tools package directory');
  need(path.join(tools,'package.json'));
  if(json(path.join(tools,'node_modules/jsdom/package.json')).version!=='26.1.0')throw new Error('Expected isolated jsdom 26.1.0');
 }
 return query;
}
export function newTrialDirectory(root){return fs.mkdtempSync(path.join(root,'.svelte-refetch-trial-'));}
