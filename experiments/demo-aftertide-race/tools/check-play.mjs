import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const host=spawn(process.execPath,['tools/serve.mjs','--port','0'],{stdio:['ignore','pipe','inherit'],windowsHide:true});
const url=await new Promise((done,fail)=>{
  host.stdout.on('data',data=>{const address=String(data).match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0];if(address)done(address);});
  host.on('error',fail);host.on('exit',code=>fail(new Error('HTTP server exited '+code)));
});
let browser;
try {
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-gpu','--ignore-gpu-blocklist','--use-angle=d3d11','--disable-software-rasterizer']});
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const state=()=>page.evaluate(()=>window.__aftertide.state());
  await page.goto(url+'?qa=1');
  await page.waitForFunction(()=>window.__aftertide?.ready);
  assert.equal((await state()).phase,'ready');
  await page.keyboard.down('w');
  await page.waitForFunction(()=>window.__aftertide.state().motion.speed>55);
  await page.keyboard.up('w');
  let moving=await state();
  assert.equal(moving.phase,'drive');
  assert(moving.running&&moving.time>0);
  await page.keyboard.down('d');
  await page.waitForFunction(()=>window.__aftertide.state().motion.steer< -2);
  await page.keyboard.down('Space');
  await page.waitForFunction(()=>window.__aftertide.state().motion.hand>.8);
  await page.keyboard.up('Space');await page.keyboard.up('d');
  await page.keyboard.press('t');
  await page.waitForFunction(()=>document.getElementById('telemetry').textContent.includes('load N'));
  assert.match(await page.locator('#telemetry').innerText(),/slip °.+load N/s);
  await page.keyboard.press('v');
  await page.keyboard.press('p');
  const paused=await state();
  assert.equal(paused.phase,'photo');
  await page.waitForTimeout(200);
  assert.equal((await state()).time,paused.time);
  const frozen=await state();
  assert.equal(frozen.motion.x,paused.motion.x);
  await page.mouse.move(800,450);
  await page.mouse.down();await page.mouse.move(930,420,{steps:6});await page.mouse.up();
  await page.mouse.wheel(0,-144);
  await page.keyboard.press('h');assert(await page.locator('#hud').evaluate(e=>e.classList.contains('hidden')));
  await page.keyboard.press('h');await page.keyboard.press('p');
  assert.equal((await state()).phase,'drive');
  await page.keyboard.press('m');assert.equal(await page.locator('#btn-audio').getAttribute('aria-pressed'),'true');
  await page.keyboard.press('r');
  assert.equal((await state()).phase,'ready');
  assert.equal((await state()).time,0);
  await page.locator('#btn-help').click();
  await page.locator('#driving-assist').uncheck();
  assert.equal((await state()).assist,false);
  await page.reload();
  await page.waitForFunction(()=>window.__aftertide?.ready);
  assert.equal((await state()).assist,false);
  await page.locator('#btn-help').click();
  await page.locator('#driving-assist').check();
  assert.equal((await state()).assist,true);
  await page.locator('#close-help').click();
  await page.locator('#start').click();
  // Simulate in the browser using the production car, timer and finish UI.
  const complete=await page.evaluate(()=>window.__aftertide.step(120*75));
  assert.equal(complete.phase,'done');
  assert(complete.record&&complete.time>40&&complete.time<61);
  assert.equal(complete.checkpoint,3);
  assert.equal(await page.locator('#result').isVisible(),true);
  await page.locator('#restart').click();
  const restart=await state();
  assert.equal(restart.phase,'ready');assert.equal(restart.time,0);assert.equal(restart.best,complete.time);
  await page.reload();
  await page.waitForFunction(()=>window.__aftertide?.ready);
  assert.equal((await state()).best,complete.time);

  await page.locator('#start').click();
  await page.evaluate(()=>window.__aftertide.pilot());
  await page.waitForFunction(()=>window.__aftertide.state().motion.speed>73);
  const performance=await page.evaluate(async()=>{
    const intervals=[];let start,previous;
    await new Promise(done=>{
      const frame=t=>{
        start??=t;
        if(previous)intervals.push(t-previous);
        previous=t;
        if(t-start<3000)requestAnimationFrame(frame);else done();
      };requestAnimationFrame(frame);
    });
    intervals.sort((a,b)=>a-b);
    const gl=document.querySelector('canvas').getContext('webgl2');
    const ext=gl.getExtension('WEBGL_debug_renderer_info');
    return {fps:+(1000*intervals.length/intervals.reduce((a,b)=>a+b,0)).toFixed(1),
      p95ms:intervals[Math.floor(intervals.length*.95)],renderer:gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)};
  });
  assert.doesNotMatch(performance.renderer,/unknown|SwiftShader|WARP|llvmpipe/i);
  let liveLap=null;
  if(process.argv.includes('--live')){
    await page.waitForFunction(()=>window.__aftertide.state().phase==='done',{},{timeout:68000});
    liveLap=(await state()).time;
    assert(Math.abs(liveLap-complete.time)<.003);
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({lapSeconds:complete.time,checkpoints:3,storedBest:complete.best,
    keyboardKmh:moving.motion.speed,liveLap,liveDrive:performance,errors},null,2));
} finally {
  if(browser) await browser.close();
  host.kill();
}
