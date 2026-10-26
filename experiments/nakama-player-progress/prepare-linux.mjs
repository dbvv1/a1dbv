// Optional isolated tool download for the tested Debian 13 / Linux x64 route.
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
process.chdir(fileURLToPath(new URL('.', import.meta.url)));
if(process.platform!=='linux'||process.arch!=='x64')throw Error('This helper is only tested on Linux x64. Use official Nakama/PostgreSQL binaries instead.');
const os=await readFile('/etc/os-release','utf8');
if(!/^ID=debian$/m.test(os)||!/^VERSION_ID="13"$/m.test(os))throw Error('This Debian package helper requires Debian 13; do not replace system libraries.');
function command(name,args){const r=spawnSync(name,args,{stdio:'inherit'});if(r.error||r.status!==0)throw Error(`${name} failed: ${r.error?.message??r.status}`)}
await mkdir('.local/downloads',{recursive:true});
const packages=[
 ['nakama.tar.gz','https://github.com/heroiclabs/nakama/releases/download/v3.41.0/nakama-3.41.0-linux-amd64.tar.gz','71aea14384b097e043917d0b1e8c3799594064acbab01853e71ea10d80624ce2'],
 ['postgresql-17_17.11-0+deb13u1_amd64.deb','https://deb.debian.org/debian/pool/main/p/postgresql-17/postgresql-17_17.11-0+deb13u1_amd64.deb','d2ce1ddffafa783f9acda4c92c86fc21e8288bff3782d739294f14fa797d7886'],
 ['postgresql-client-17_17.11-0+deb13u1_amd64.deb','https://deb.debian.org/debian/pool/main/p/postgresql-17/postgresql-client-17_17.11-0+deb13u1_amd64.deb','9d8558f8dd57c8e92e218a20698383575d53742ca3f9e7c2b7fe5f246d5216ae'],
 ['libpq5_17.11-0+deb13u1_amd64.deb','https://deb.debian.org/debian/pool/main/p/postgresql-17/libpq5_17.11-0+deb13u1_amd64.deb','20a4c9ef58b4baf90deda67cfb2cc062871c062830dddc234d28f5ac7931b86b']
];
for(const [name,url,hash] of packages){
 const path=resolve('.local/downloads',name);
 let bytes;try{bytes=await readFile(path)}catch{command('curl',['--fail','--location','--connect-timeout','15','--max-time','120','--output',path,url]);bytes=await readFile(path)}
 if(createHash('sha256').update(bytes).digest('hex')!==hash)throw Error(`checksum mismatch: ${name}; no extraction performed`);
 if(name.endsWith('.deb')){await mkdir('.local/pg',{recursive:true});command('dpkg-deb',['-x',path,resolve('.local/pg')])}
 else{await mkdir('.local/nakama',{recursive:true});command('tar',['-xzf',path,'-C',resolve('.local/nakama')])}
}
console.log('Verified local binaries prepared. No system package installation or account changes.');
