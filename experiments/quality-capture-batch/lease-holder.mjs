// Owns the existing shared capture.lock across FPS + Star. EOF never clears a lock.
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
import {createInterface} from 'node:readline';
const [moba,root,task,runId]=process.argv.slice(2);
const {acquireCaptureLease}=await import(pathToFileURL(join(moba,'tools/capture-output.ts')).href);
let lease;
try{
 lease=await acquireCaptureLease(root,task,runId);
 console.log(JSON.stringify({event:'acquired',owner:lease.owner}));
 const lines=createInterface({input:process.stdin});
 let command;
 for await(const line of lines){command=JSON.parse(line);break;}
 if(command?.action!=='release')throw Error('Lease retained: owner received no explicit verified release');
 const result=await lease.release(command.evidence);
 console.log(JSON.stringify({event:'release',...result}));
 if(!result.released)process.exitCode=1;
}catch(e){console.log(JSON.stringify({event:'retained-or-not-acquired',error:String(e)}));process.exitCode=1;}
