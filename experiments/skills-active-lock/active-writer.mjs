// Reproduce PR 2750 stealing a still-active lock after 30 seconds.
// Run with the absolute repository root as argv[2]; no global skill state is used.
import fsp from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { fork } from 'node:child_process';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
const repo = resolve(process.argv[2]);
const sleep = ms => new Promise(r=>setTimeout(r,ms));
if (process.argv[3] === 'writer') {
  const [cwd,name] = process.argv.slice(4);
  const readFile = fsp.readFile;
  if (name === 'alpha') {
    fsp.readFile = async (...args) => {
      const value = await readFile(...args);
      if (String(args[0]) === join(cwd, 'skills-lock.json')) {
        process.send({event:'snapshot-read',pid:process.pid});
        await new Promise(resolve=>process.once('message',resolve));
      }
      return value;
    };
    syncBuiltinESMExports();
  }
  const {addSkillToLocalLock} = await import(pathToFileURL(join(repo,'src/local-lock.ts')));
  await addSkillToLocalLock(name,{source:'example/skills',sourceType:'github',computedHash:name},cwd);
  process.send({event:'success',name});
  process.disconnect();
} else {
  const cwd = await fsp.mkdtemp(join(tmpdir(),'skills-active-writer-'));
  await fsp.writeFile(join(cwd,'skills-lock.json'),JSON.stringify({version:2,skills:{}}));
  const events=[];
  const start=(name)=> {
    const child=fork(fileURLToPath(import.meta.url),[repo,'writer',cwd,name],{stdio:['ignore','pipe','pipe','ipc']});
    let stderr='';child.stderr.on('data',d=>stderr+=d);
    child.on('message',msg=>events.push({...msg,at:Date.now()}));
    child.done=new Promise((res,rej)=>{child.on('error',rej);child.on('exit',code=>code===0?res():rej(new Error(`${name} exit ${code}: ${stderr}`)));});
    return child;
  };
  const alpha=start('alpha');
  const deadline=Date.now()+10000;
  while(!events.some(e=>e.event==='snapshot-read')){if(Date.now()>deadline)throw new Error('snapshot timeout');await sleep(10);}
  const locked=Date.now();
  await sleep(31_000); // real elapsed time; alpha is alive, waiting at its lock-protected read.
  process.kill(alpha.pid,0);
  const beta=start('beta');await beta.done;
  const afterBeta=JSON.parse(await fsp.readFile(join(cwd,'skills-lock.json'),'utf8'));
  alpha.send('resume');await alpha.done;
  const final=JSON.parse(await fsp.readFile(join(cwd,'skills-lock.json'),'utf8'));
  console.log(JSON.stringify({heldMs:Date.now()-locked,events,afterBeta:Object.keys(afterBeta.skills),final:Object.keys(final.skills)},null,2));
  assert.deepEqual(Object.keys(final.skills).sort(),['alpha','beta'],'Both successful writes must survive');
}
