import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const output=resolve(process.argv[2]??'shots');
const driftTime=process.argv[3]??'3.525';
await mkdir(output,{recursive:true});
const host=spawn(process.execPath,['tools/serve.mjs','--port','0'],{stdio:['ignore','pipe','inherit'],windowsHide:true});
const base=await new Promise((done,fail)=>{
  host.stdout.on('data',chunk=>{const url=String(chunk).match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0];if(url)done(url);});
  host.on('error',fail);host.on('exit',code=>fail(new Error('Server exited '+code)));
});
const chrome=await chromium.launch({channel:'chrome',headless:true,args:['--enable-gpu','--ignore-gpu-blocklist','--use-angle=d3d11','--disable-software-rasterizer','--autoplay-policy=no-user-gesture-required']});
const errors=[],results=[];
const width=1600,height=900;
const close={x:196,y:95,width:1208,height:710};
const frames=[
  ['chase','01-chase',null],['drift','02-hairpin-drift',null],['front','03-front-1x',close],
  ['wheel','04-wheel-1x',{x:405,y:93,width:790,height:714}],['road','05-road-rail-1x',close],['coast','06-coast',null],
  ['','00-ready',null],
].filter(f=>f[0]||output.endsWith('.review')||output.includes('.review'));
try {
  const page=await chrome.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  for(const [view,name,clip] of frames) {
    errors.length=0;
    const url=base+'?'+(view?'shot='+view+'&t='+driftTime:'');
    await page.goto(url);
    await page.waitForFunction(()=>window.__aftertide?.ready||document.body.dataset.phase==='error');
    await page.waitForTimeout(1250);
    const stats=await page.evaluate(async()=>{
      const canvas=document.querySelector('#drive canvas'), gl=canvas?.getContext('webgl2');
      const e=gl?.getExtension('WEBGL_debug_renderer_info');
      const renderer=e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):'unknown';
      let count=0,start=0,prev=0;const intervals=[];
      const elapsed=await new Promise(res=>{
        const frame=t=>{
          if(!start)start=t;
          if(prev)intervals.push(t-prev);
          prev=t;count++;if(t-start<1900)requestAnimationFrame(frame);else res(t-start);
        };
        requestAnimationFrame(frame);
      });
      intervals.sort((a,b)=>a-b);
      return {renderer,fps:+((count-1)/elapsed*1000).toFixed(1),p95ms:+intervals[Math.floor(intervals.length*.95)].toFixed(1),
        buffer:[canvas.width,canvas.height],state:window.__aftertide?.state()};
    });
    if(!stats.state||/unknown|SwiftShader|WARP|llvmpipe/i.test(stats.renderer)||errors.length)throw Error(JSON.stringify({view,stats,errors}));
    const path=resolve(output,name+'.png');
    await page.screenshot({path,clip:clip??undefined,scale:'device'});
    const {state,...gpu}=stats;
    results.push({view,name,...gpu,errors:[...errors],world:{sky:state.sky,kmh:state.motion.speed,beta:state.motion.beta,s:state.route.s}});
    console.log(JSON.stringify(results.at(-1)));
  }
  const metrics=output===resolve('shots')?resolve('telemetry/capture-metrics.json'):resolve(output,'capture-metrics.json');
  await writeFile(metrics,JSON.stringify(results,null,2)+'\n');
} finally {
  await chrome.close();host.kill();
}
