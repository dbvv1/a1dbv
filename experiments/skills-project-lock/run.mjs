import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {installSkills,version} from 'skills';
const root=resolve(import.meta.dirname);
const names=['explore-frontier','write-task-guide'];
const digest=s=>createHash('sha256').update(s).digest('hex');
const all=[];
for (const mode of ['parallel','serial']) for(let n=1;n<=3;n++) {
  const cwd=join(root,`${mode}-${n}`); await mkdir(cwd);
  const install=name=>installSkills(join(root,'sources',name),{cwd,agents:['codex'],mode:'copy',telemetry:false,config:{telemetry:false}});
  const results=mode==='parallel'?await Promise.allSettled(names.map(install)):[];
  if(mode==='serial')for(const name of names){try{results.push({status:'fulfilled',value:await install(name)});}catch(reason){results.push({status:'rejected',reason});}}
  const directories=await readdir(join(cwd,'.agents','skills'));
  const bytes=await Promise.all(names.map(async name=>({name,identical:digest(await readFile(join(root,'sources',name,'SKILL.md')))===digest(await readFile(join(cwd,'.agents','skills',name,'SKILL.md')))})));
  const lock=await readFile(join(cwd,'skills-lock.json'),'utf8');
  let keys,parseError;try{keys=Object.keys(JSON.parse(lock).skills).sort();}catch(e){parseError=e.name;}
  all.push({mode,n,results:results.map(r=>r.status==='fulfilled'?{status:r.status,failed:r.value.failed}:{status:r.status,code:r.reason.code}),directories,bytes,keys,parseError});
}
const report={version,node:process.version,platform:process.platform,names,runs:all};
await writeFile(join(root,'result.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
