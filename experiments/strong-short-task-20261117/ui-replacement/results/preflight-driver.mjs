import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = process.env.CHROME_PATH;
const userDataDir = process.env.CHROME_PROFILE;
const pageUrl = process.env.PAGE_URL || 'http://127.0.0.1:8765/preflight.html';
const outDir = process.env.OUT_DIR || '.';

const sleep = ms => new Promise(r => setTimeout(r, ms));

function waitForFile(file, timeoutMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      try {
        const text = fs.readFileSync(file, 'utf8').trim();
        if (text) return resolve(text);
      } catch {}
      if (Date.now() - start > timeoutMs) return reject(new Error('timeout waiting for ' + file));
      setTimeout(tick, 100);
    };
    tick();
  });
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = [];
    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.method + ': ' + JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const fn of this.listeners) fn(msg);
      }
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error('CDP timeout: ' + method));
        }
      }, 30000);
    });
  }
  on(fn) { this.listeners.push(fn); }
}

async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });
  return new Cdp(ws);
}

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-extensions',
  '--hide-scrollbars',
  '--window-size=1200,900',
  '--remote-debugging-port=0',
  '--user-data-dir=' + userDataDir,
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let chromeStderr = '';
chrome.stderr.on('data', d => { chromeStderr += d.toString(); });

try {
  const active = await waitForFile(path.join(userDataDir, 'DevToolsActivePort'), 20000);
  const [port, browserPath] = active.split(/\r?\n/);
  const browser = await connect('ws://127.0.0.1:' + port + browserPath);
  const version = await browser.send('Browser.getVersion');
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });

  const errors = [];
  let loadResolve;
  let loadPromise = new Promise(r => { loadResolve = r; });
  browser.on(msg => {
    if (msg.method === 'Page.loadEventFired' && msg.sessionId === sessionId) loadResolve();
    if (msg.method === 'Runtime.exceptionThrown') {
      errors.push({ type: 'exception', text: msg.params.exceptionDetails.text, detail: msg.params.exceptionDetails.exception?.description || '' });
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      errors.push({ type: 'console', text: msg.params.args.map(a => a.value ?? a.description).join(' ') });
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      errors.push({ type: 'log', text: msg.params.entry.text });
    }
  });

  await browser.send('Page.enable', {}, sessionId);
  await browser.send('Runtime.enable', {}, sessionId);
  await browser.send('Log.enable', {}, sessionId);

  async function navigate() {
    loadPromise = new Promise(r => { loadResolve = r; });
    await browser.send('Page.navigate', { url: pageUrl }, sessionId);
    await Promise.race([loadPromise, sleep(10000)]);
    await sleep(300);
  }

  async function evaluate(expression) {
    const res = await browser.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId);
    if (res.exceptionDetails) throw new Error('eval: ' + JSON.stringify(res.exceptionDetails));
    return res.result.value;
  }

  async function mouse(type, x, y, extra = {}) {
    await browser.send('Input.dispatchMouseEvent', {
      type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1, ...extra,
    }, sessionId);
  }

  async function screenshot(name) {
    const { data } = await browser.send('Page.captureScreenshot', { format: 'png' }, sessionId);
    fs.writeFileSync(path.join(outDir, name), Buffer.from(data, 'base64'));
    return name;
  }

  const stateExpr = `(() => {
    const rects = {};
    document.querySelectorAll('#list li').forEach(li => {
      const r = li.getBoundingClientRect();
      rects[li.dataset.id] = { x: r.x, y: r.y, w: r.width, h: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2, bottom: r.bottom };
    });
    return { events: window.events || [], rects, domOrder: [...document.querySelectorAll('#list > li')].map(li => li.dataset.id), ghost: !!document.querySelector('#list > li.ghost') };
  })()`;

  const runs = [];
  for (let run = 1; run <= 3; run++) {
    await navigate();
    const before = await evaluate(stateExpr);
    const alpha = before.rects.alpha;
    const charlie = before.rects.charlie;
    const startX = alpha.cx;
    const startY = alpha.cy;
    const midX = (startX + charlie.cx) / 2;
    const midY = (startY + charlie.cy) / 2;
    const endX = charlie.cx;
    const endY = charlie.bottom + 10;

    await mouse('mousePressed', startX, startY);
    await sleep(60);
    // First move crosses the (zero) fallback tolerance and triggers start + ghost.
    await mouse('mouseMoved', startX + 4, startY + 4);
    await sleep(120);
    const afterStart = await evaluate(stateExpr);
    const dragShot = await screenshot('fallback-run' + run + '-drag.png');

    // Move in small steps to below Charlie so Sortable reorders.
    for (let i = 1; i <= 10; i++) {
      const t = i / 10;
      await mouse('mouseMoved', midX + (endX - midX) * t, midY + (endY - midY) * t);
      await sleep(40);
    }
    await sleep(200);
    const beforeRelease = await evaluate(stateExpr);
    const releaseShot = await screenshot('fallback-run' + run + '-release.png');

    await mouse('mouseReleased', endX, endY);
    await sleep(300);
    const afterEnd = await evaluate(stateExpr);
    const finalShot = await screenshot('fallback-run' + run + '-final.png');

    runs.push({
      run,
      before: { events: before.events, domOrder: before.domOrder, ghost: before.ghost },
      duringDrag: { events: afterStart.events, domOrder: afterStart.domOrder, ghost: afterStart.ghost },
      beforeRelease: { events: beforeRelease.events, domOrder: beforeRelease.domOrder, ghost: beforeRelease.ghost },
      afterEnd: { events: afterEnd.events, domOrder: afterEnd.domOrder, ghost: afterEnd.ghost },
      screenshots: [dragShot, releaseShot, finalShot],
      errors: errors.splice(0),
    });
  }

  const result = {
    browser: version.product + ' / ' + version.userAgent,
    protocolVersion: version.protocolVersion,
    url: pageUrl,
    runs,
  };
  fs.writeFileSync(path.join(outDir, 'fallback-preflight-result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.send('Target.closeTarget', { targetId });
  chrome.kill();
} catch (err) {
  console.error('FAILED:', err && err.stack || err);
  console.error('chrome stderr tail:', chromeStderr.slice(-2000));
  chrome.kill();
  process.exitCode = 1;
}