import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const {addSkillToLocalLock}=await import(pathToFileURL(join(resolve(process.argv[2]),'src/local-lock.ts')));
const cwd=await mkdtemp(join(tmpdir(),'skills-serial-control-'));
try {
 for(const name of ['alpha','beta']) await addSkillToLocalLock(name,{source:'example/skills',sourceType:'github',computedHash:name},cwd);
 const final=JSON.parse(await readFile(join(cwd,'skills-lock.json'),'utf8'));
 console.log(JSON.stringify({final:Object.keys(final.skills)}));
 assert.deepEqual(Object.keys(final.skills),['alpha','beta']);
} finally {await rm(cwd,{recursive:true,force:true});}
