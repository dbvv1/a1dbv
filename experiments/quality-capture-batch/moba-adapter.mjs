// Consumer-only adapter: retain fixed executable policy + lease/lifecycle, stop at first non-GPU.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const [root,destination]=process.argv.slice(2).map(x=>resolve(x));
const require=createRequire(join(root,'package.json'));
let source=readFileSync(join(root,'tools/capture.mjs'),'utf8');
source=source.replace(/from '([^']+)'/g,(whole,s)=>s.startsWith('node:')?whole:`from ${JSON.stringify(pathToFileURL(s.startsWith('.')?resolve(root,'tools',s):require.resolve(s)).href)}`);
source=source.replace("const root=fileURLToPath(new URL('..',import.meta.url));",`const root=${JSON.stringify(root)};`);
if(!source.includes("if(values['require-gpu']){assert.equal(meta.rendererClass"))throw Error('Native consumer contract changed');
source=source.replace("if(values['require-gpu']){assert.equal(meta.rendererClass","{assert.equal(meta.rendererClass");
source=source.replace('const onInterrupt=signal=>{interrupted=signal;void closeOwnedBrowser();};','const onInterrupt=signal=>{interrupted=signal;process.exitCode=1;report.passed=false;report.interrupted=signal;void closeOwnedBrowser();};');
writeFileSync(destination,source,{flag:'wx'});
