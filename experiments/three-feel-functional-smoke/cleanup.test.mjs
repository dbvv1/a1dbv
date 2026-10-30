import test from 'node:test';import assert from 'node:assert/strict';import {closeOwned} from './cleanup.mjs';
const base=()=>({launchRequested:true,server:{},port:1,processEvidence:{exit:{code:0,signal:null}},closeBrowser:async()=>({serverClosed:true,connectionClosed:true}),browserExitState:(_l,s,c,p)=>s&&c&&p?.exit?.code===0?'owned-handles-closed':'unknown',closePreview:async()=>({exitProven:true,portState:'refused'})});
test('normal owned exit requires browser process event and refused preview port',async()=>assert.equal((await closeOwned(base())).proven,true));
test('browser failure still closes preview and cannot pass',async()=>{let preview=0;const x=base();x.closeBrowser=async()=>{throw Error('failure')};x.closePreview=async()=>{preview++;return {exitProven:true}};assert.equal((await closeOwned(x)).proven,false);assert.equal(preview,1);});
test('browser close timeout never releases serial successor',async()=>{const x=base();x.closeBrowser=async()=>({serverClosed:null,connectionClosed:false,errors:['timeout']});assert.equal((await closeOwned(x)).proven,false);});
test('closed handles without actual child exit remain unknown',async()=>{const x=base();x.processEvidence={exit:null};assert.equal((await closeOwned(x)).proven,false);});
test('preview failure or still listening cannot pass',async()=>{for(const closePreview of [async()=>{throw Error('timeout')},async()=>({exitProven:false,portState:'listening'})])assert.equal((await closeOwned({...base(),closePreview})).proven,false);});

test('reviewed browser closer timeout and server close run independently',async()=>{
 const {createCaptureBrowserCloser,captureBrowserExitState}=await import((await import('node:url')).pathToFileURL(process.env.MOBA_SMOKE_SOURCE+'/tools/capture-output.ts').href);
 let serverClosed=0;const close=createCaptureBrowserCloser(()=>({browser:{close:()=>new Promise(()=>{}),isConnected:()=>true},server:{close:async()=>{serverClosed++;}}}),5);
 const result=await close();assert.equal(serverClosed,1);assert.equal(result.serverClosed,null);assert.match(result.errors.join(' '),/timeout/);assert.equal(captureBrowserExitState(true,result.serverClosed,result.connectionClosed,{exit:null}),'unknown');
});
test('reviewed process observer uses exit event, not PID label',async()=>{
 const {EventEmitter}=await import('node:events');const {observeCaptureProcess,captureBrowserExitState}=await import((await import('node:url')).pathToFileURL(process.env.MOBA_SMOKE_SOURCE+'/tools/capture-output.ts').href);
 const p=new EventEmitter();Object.assign(p,{pid:123,exitCode:null,signalCode:null});const evidence=observeCaptureProcess(p);assert.equal(captureBrowserExitState(true,true,true,evidence),'unknown');p.emit('exit',0,null);assert.equal(captureBrowserExitState(true,true,true,evidence),'owned-handles-closed');
});
