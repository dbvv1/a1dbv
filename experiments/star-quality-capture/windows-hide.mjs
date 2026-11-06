// Process-local preload; never changes system environment or installed binaries.
import cp from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
export function hiddenArguments(name,args){
 const a=[...args];let index;
 if(['spawn','spawnSync','fork','execFile','execFileSync'].includes(name))index=Array.isArray(a[1])?2:1;
 else if(['exec','execSync'].includes(name))index=1;else throw Error('Unsupported child_process operation');
 if(a[index]&&typeof a[index]==='object')a[index]={...a[index],windowsHide:true};else a.splice(index,0,{windowsHide:true});
 return a;
}
for(const name of ['spawn','spawnSync','fork','execFile','execFileSync','exec','execSync']){const original=cp[name];cp[name]=function(...args){return Reflect.apply(original,this,hiddenArguments(name,args));};}
syncBuiltinESMExports();
const preload='--import='+import.meta.url;
if(!(process.env.NODE_OPTIONS??'').includes(preload))process.env.NODE_OPTIONS=[process.env.NODE_OPTIONS,preload].filter(Boolean).join(' ');
