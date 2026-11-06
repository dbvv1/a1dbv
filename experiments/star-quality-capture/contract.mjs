import assert from 'node:assert/strict';
export const SOURCES=Object.freeze({
 '811646e8a69bf9803a1de2218b882ab28b4b1f42':'f11e318d3fc19785db094fd18b4e3160f22c6827',
 '7e87d4c32d5014612fcb7a8af8bc49d266d7238c':'66fe4f58e9c69e8a7a511ec888e4243e197d9681',
});
export const BUILDS=Object.freeze({
 '811646e8a69bf9803a1de2218b882ab28b4b1f42':{bundle:'25b2ce33b6867bd75d098d84a9abc9f9655c52543dfc466e0021e62de2f72a94',worker:'132dd430016081c3bfd176ffee4af082fa024d1b9aba38fbc8954f61b000e86f'},
 '7e87d4c32d5014612fcb7a8af8bc49d266d7238c':{bundle:'9768d3fd6dd9bc529c45c5c53d7ccca68b0204e9ad136ca8137d21a6e0125259',worker:'6be5af90f6c97b34c44f804e5e94ba3c4d53c335bf2398001d02842bac389132'},
});
export const SHOTS=Object.freeze({
 'coast-chase':{seed:73121,t:28,tick:1680,fov:62,track:'coast-reborn'},
 'coast-full-bend':{seed:73121,t:28,tick:1680,fov:58,track:'coast-reborn'},
 'academy-depth':{seed:95276,t:14,tick:840,fov:62,track:'academy-reborn'},
});
export function captureUrl(origin,shot){
 assert(Object.hasOwn(SHOTS,shot),'Unknown shot');
 const url=new URL('/road',origin);assert.equal(url.protocol,'http:');assert.equal(url.hostname,'127.0.0.1');
 const p=SHOTS[shot];for(const [k,v] of Object.entries({environment:'coast-space-v1',shot,seed:p.seed,t:p.t,frames:1,input:'road-tour'}))url.searchParams.set(k,String(v));return url;
}
export function assertFrame({metadata:m,sideStatus:s},shot){
 const p=SHOTS[shot];assert(p,'Unknown shot');assert(m&&s,'Missing frame or side status');
 assert.equal(s.space,true,'Candidate fell back or was not enabled');assert.equal(s.power,false);assert.deepEqual(s.warnings,[]);assert.equal(s.backend,'webgl2');assert(Number.isSafeInteger(s.ticks)&&s.ticks>0);
 assert.equal(m.ready,true);assert(!m.error);assert.equal(m.backend,'webgl2');assert.equal(m.rendererInfo?.api,'webgl2');assert.equal(m.rendererInfo?.classification,'software');assert.match(m.renderer??'',/SwiftShader/i);
 for(const k of ['seed','t','tick','track'])assert.equal(m[k],p[k],k);assert.equal(m.shot,shot);assert.equal(m.camera?.fov,p.fov);assert.equal(m.input,'road-tour');
 assert.equal(m.frame,0);assert.equal(m.frames,1);assert.equal(m.done,true);assert.equal(m.warmupFrames,12);assert.equal(m.dt,1/60);assert.equal(m.drivingRevision,'road-v2');assert.equal(m.quality,'high');assert.equal(m.audio,'disabled');assert.equal(m.sky,'ready');
 assert.deepEqual(m.image,{width:1280,height:720,dpr:1});assert.deepEqual(m.viewport,{width:1280,height:720,dpr:1});
 for(const key of ['s','l','yaw','speed'])assert(Number.isFinite(m.player?.[key]),'Missing player '+key);
 for(const key of ['eye','target','origin'])assert(Array.isArray(m.camera?.[key])&&m.camera[key].length===3&&m.camera[key].every(Number.isFinite),'Missing camera '+key);
 assert.match(m.pngDataUrl??'',/^data:image\/png;base64,/);
}
export function stateProjection({metadata:m,sideStatus:s}){
 return Object.fromEntries([...['player','camera','seed','t','tick','input','track','drivingRevision','state','elapsed','dt','warmupFrames','renderer','rendererInfo','quality','image','viewport','audio','sky'].map(k=>[k,m[k]]),['sideStatus',s]]);
}
export function assertEquivalent(a,b,{pixels=false}={}){assert.deepEqual(stateProjection(a),stateProjection(b),'Vehicle/camera/clock/render state differs');if(pixels)assert.equal(a.metadata.pngDataUrl,b.metadata.pngDataUrl,'Repeated PNG differs');}
export function observeExit(child){
 assert(child&&typeof child.once==='function','Missing owned process handle');
 const evidence={pid:child.pid,observedAt:new Date().toISOString(),exitCode:null,signal:null,exited:false};
 const finished=new Promise(resolve=>{const record=(code,signal)=>{Object.assign(evidence,{exitCode:code,signal,exited:true,endedAt:new Date().toISOString()});resolve(evidence);};
 if(child.exitCode!==null&&child.exitCode!==undefined)record(child.exitCode,child.signalCode??null);else if(child.signalCode)record(null,child.signalCode);else child.once('exit',record);});return {evidence,finished};
}
export function cleanExit(e){return e?.exited===true&&e.exitCode===0&&e.signal===null;}
