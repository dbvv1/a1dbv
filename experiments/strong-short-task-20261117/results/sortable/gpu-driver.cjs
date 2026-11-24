// Real-GPU Sortable #2456 driver: node gpu-driver.cjs <url> <outDir> [--headed]
// Three rounds: reload, press Alpha centre, move +4/+4, capture; 10 steps to below Charlie, capture; release, capture.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [url, out] = process.argv.slice(2); const headed = process.argv.includes('--headed');
fs.mkdirSync(out, { recursive: true });
const snap = p => p.evaluate(() => ({ events: JSON.parse(JSON.stringify(window.events)),
  domOrder: [...document.querySelectorAll('#list li')].map(li => li.dataset.id), ghost: !!document.querySelector('.ghost') }));
(async () => {
  const browser = await chromium.launch({ headless: !headed, args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=d3d11'] });
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } }); const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 300))); page.on('console', m => m.type() === 'error' && errors.push(m.text().slice(0, 300)));
  const runs = [];
  for (let run = 1; run <= 3; run++) {
    await page.goto(url); await page.waitForFunction(() => window.events && window.events.length >= 1);
    const a = await page.locator('li[data-id=alpha]').boundingBox(), c = await page.locator('li[data-id=charlie]').boundingBox();
    const r = { run, before: await snap(page) };
    const x = a.x + a.width / 2, y = a.y + a.height / 2;
    await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 4, y + 4); await page.waitForTimeout(300);
    r.duringDrag = await snap(page); await page.screenshot({ path: path.join(out, `run${run}-drag.png`) });
    const tx = c.x + c.width / 2, ty = c.y + c.height + 15;
    for (let i = 1; i <= 10; i++) { await page.mouse.move(x + 4 + (tx - x - 4) * i / 10, y + 4 + (ty - y - 4) * i / 10); await page.waitForTimeout(40); }
    await page.waitForTimeout(300); r.beforeRelease = await snap(page); await page.screenshot({ path: path.join(out, `run${run}-release.png`) });
    await page.mouse.up(); await page.waitForTimeout(300); r.afterEnd = await snap(page); await page.screenshot({ path: path.join(out, `run${run}-final.png`) });
    runs.push(r);
  }
  const gpu = await page.evaluate(() => { const g = document.createElement('canvas').getContext('webgl2'); const e = g && g.getExtension('WEBGL_debug_renderer_info');
    return { renderer: e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'none', vendor: e ? g.getParameter(e.UNMASKED_VENDOR_WEBGL) : 'none' }; });
  const res = { browser: browser.version(), headless: !headed, gpu, url, errors, runs };
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify({ browser: res.browser, gpu, errors, starts: runs.map(r => r.duringDrag.events.find(e => e.event === 'start')?.array), ends: runs.map(r => r.afterEnd.events.filter(e => e.event !== 'initial').map(e => e.event + ':' + e.array.join(','))) }, null, 1));
  await browser.close();
})();
