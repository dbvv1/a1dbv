import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { serve } from '../serve.mjs';

function playwright() {
  const roots=[
    import.meta.url,
    process.env.PLAYWRIGHT_ROOT && resolve(process.env.PLAYWRIGHT_ROOT,'package.json'),
  ].filter(Boolean);
  for(const root of roots) {
    try { return createRequire(root)('playwright'); }
    catch(error) { if(error.code!=='MODULE_NOT_FOUND')throw error; }
  }
  throw new Error('Playwright was not found. Set PLAYWRIGHT_ROOT to a local project with Playwright installed.');
}

export async function openBrowser({root, width=1920, height=1080, video}={}) {
  const {chromium}=playwright();
  const {server,url}=await serve(root);
  let browser;
  try {
    browser=await chromium.launch({
      headless:true, ignoreDefaultArgs:['--enable-unsafe-swiftshader'],
      args:['--enable-gpu','--ignore-gpu-blocklist','--use-angle=d3d11','--disable-background-networking']
    });
    if(video)await mkdir(dirname(video),{recursive:true});
    const recordVideo=video?{dir:dirname(video),size:{width:1280,height:720}}:undefined;
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,recordVideo});
    const errors=[], foreign=[];
    page.on('pageerror',error=>errors.push(String(error)));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.route('**/*',route=>{
      const address=route.request().url();
      if(address.startsWith(url)||address.startsWith('data:'))return route.continue();
      foreign.push(address);
      return route.abort();
    });
    return {page,url,errors,foreign,async close(){
      try {
        if(video) {
          await page.close();
          await page.video().saveAs(video);
          await page.video().delete();
        }
      } finally {
        await browser.close();
        server.close();
      }
    }};
  } catch(error) {
    if(browser)await browser.close();
    server.close();
    throw error;
  }
}

export async function gpuName(page) {
  return page.evaluate(()=>{
    const gl=document.createElement('canvas').getContext('webgl2');
    if(!gl)return 'WebGL 2 unavailable';
    const ext=gl.getExtension('WEBGL_debug_renderer_info');
    return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);
  });
}

export async function frameStats(page,ms=3000) {
  return page.evaluate(duration=>new Promise(resolve=>{
    const intervals=[];
    let first,last;
    function frame(now) {
      if(first===undefined)first=last=now;
      else {
        intervals.push(now-last);
        last=now;
      }
      if(now-first<duration)requestAnimationFrame(frame);
      else {
        intervals.sort((a,b)=>a-b);
        resolve({fps:Math.round(intervals.length*1000/(now-first)),p95ms:Number(intervals[Math.floor(intervals.length*.95)].toFixed(2)),frames:intervals.length});
      }
    }
    requestAnimationFrame(frame);
  }),ms);
}



export async function installFrameTrace(page) {
  await page.addInitScript(()=>{
    const startup=[], frames=[], restart=[];
    const tasks=[], paints=[];
    let previous, phase, completed=false, ready, started;
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('#start');
      if(ready&&!started&&button?.closest('[data-mode="menu"]'))started=performance.now();
    },true);
    new PerformanceObserver(list=>tasks.push(...list.getEntries().map(e=>({at:e.startTime,duration:e.duration}))))
      .observe({type:'longtask',buffered:true});
    new PerformanceObserver(list=>paints.push(...list.getEntries().map(e=>({name:e.name,at:e.startTime}))))
      .observe({type:'paint',buffered:true});
    const round=n=>Math.round(n*100)/100;
    const read=()=>{
      const status=window.gameStatus;
      if(!status) return {label:'loading',screen:'loading'};
      const label=status.sequence||status.objective;
      return {label,action:status.action||undefined,screen:status.screen,shot:status.shot,time:round(status.time),position:status.position?.map(round)};
    };
    requestAnimationFrame(function sample(now){
      const next=read();
      if(!ready && next.screen==='menu'&&document.querySelector('#start:enabled'))ready=now;
      if(previous!==undefined) {
        const item={at:round(now),ms:round(now-previous),...phase};
        if(phase.label!==next.label)item.to=next.label;
        if(phase.screen!==next.screen)item.toScreen=next.screen;
        if(!started||now<started) startup.push(item);
        else if(completed) restart.push(item);
        else frames.push(item);
      }
      if(next.screen==='won')completed=true;
      previous=now;phase=next;
      requestAnimationFrame(sample);
    });
    const stats=items=>{
      const sorted=[...items].sort((a,b)=>b.ms-a.ms);
      return {samples:items.length,max:sorted[0],over50:sorted.filter(f=>f.ms>50)};
    };
    window.frameTrace=()=>({
      ready:round(ready),paints,loadingTasks:tasks.filter(t=>t.at<ready).sort((a,b)=>b.duration-a.duration),
      gameplayTasks:tasks.filter(t=>t.at>=started),
      startup:stats(startup),mission:stats(frames),retry:stats(restart),
      handoff:stats(frames.filter(f=>f.label==='arrival'&&f.to==='entry'||f.label==='entry'&&f.time<7.4)),
      frames:{startup,mission:frames,retry:restart}
    });
  });
}
