import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, writeFile, rename, access } from 'node:fs/promises';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { definition } from './flags.mjs';
const root = fileURLToPath(new URL('.', import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));
export async function until(check, label, ms = 10000) {
  const end = Date.now() + ms;
  while (Date.now() < end) { if (await check()) return; await sleep(80); }
  throw new Error(`timeout: ${label}`);
}
export async function listen(server) {
  server.listen(0, '127.0.0.1'); await once(server, 'listening'); return server.address().port;
}
async function freePort() {
  const s = createServer(); const p = await listen(s); await new Promise(r => s.close(r)); return p;
}
export async function startServices(metricsRegistry, { goffBinary, prometheusBinary } = {}) {
  const goff = goffBinary ?? resolve(root, '.local/goff/go-feature-flag-relay-proxy');
  const prom = prometheusBinary ?? resolve(root, '.local/prometheus-3.15.1.linux-amd64/prometheus');
  await access(goff); await access(prom); // Missing installation fails, never skips.
  await mkdir(resolve(root, '.local/runs'), { recursive: true });
  const dir = await mkdtemp(resolve(root, '.local/runs/run-'));
  const children = []; const ownedPids = []; let metricsServer; let closed = false;
  async function stop(child) {
    if (!child || child.exitCode !== null || child.signalCode !== null) return;
    child.kill('SIGTERM');
    const exited = once(child, 'exit');
    const timer = setTimeout(() => child.kill('SIGKILL'), 5000);
    try { await exited; } finally { clearTimeout(timer); }
  }
  async function close() {
    if (closed) return; closed = true;
    process.off('SIGINT', onSignal); process.off('SIGTERM', onSignal);
    await Promise.all(children.map(stop));
    if (metricsServer) await new Promise(r => metricsServer.close(r));
  }
  const onSignal = () => { void close().then(() => { process.exitCode = 130; }); };
  process.once('SIGINT', onSignal); process.once('SIGTERM', onSignal);
  function launch(binary, args) {
    // No inherited telemetry destinations, no external exporters or collectors.
    const child = spawn(binary, args, { cwd: dir, env: { PATH: process.env.PATH, OTEL_SDK_DISABLED: 'true' }, stdio: ['ignore','pipe','pipe'] });
    children.push(child); ownedPids.push(child.pid);
    let output = ''; child.stdout.on('data', b => { output = (output + b).slice(-12000); });
    child.stderr.on('data', b => { output = (output + b).slice(-12000); });
    child.on('error', e => { output += e.message; });
    child.diagnostic = () => output;
    return child;
  }
  try {
    const port = await freePort(), promPort = await freePort();
    const flags = resolve(dir, 'flags.json');
    async function publish(value) {
      await writeFile(flags + '.next', JSON.stringify(value)); await rename(flags + '.next', flags);
    }
    await publish(definition());
    await writeFile(resolve(dir, 'goff.yaml'), `server:\n  host: 127.0.0.1\n  port: ${port}\nlogLevel: error\nfileFormat: json\npollingInterval: 1000\nretrievers:\n  - kind: file\n    path: ${JSON.stringify(flags)}\notel:\n  sdk:\n    disabled: true\nexporters: []\nnotifiers: []\n`);
    const goffProcess = launch(goff, ['--config', resolve(dir, 'goff.yaml')]);
    const endpoint = `http://127.0.0.1:${port}`;
    await until(async () => { try { return (await fetch(endpoint + '/health', { signal: AbortSignal.timeout(300) })).ok; } catch { if (goffProcess.exitCode !== null) throw new Error(goffProcess.diagnostic()); return false; } }, 'GO Feature Flag readiness');
    metricsServer = createServer(async (req, res) => {
      if (req.url !== '/metrics') { res.writeHead(404).end(); return; }
      try { res.setHeader('Content-Type', metricsRegistry.contentType); res.end(await metricsRegistry.metrics()); }
      catch { res.writeHead(500).end(); }
    });
    const metricsPort = await listen(metricsServer);
    await writeFile(resolve(dir, 'prometheus.yml'), `global:\n  scrape_interval: 1s\nscrape_configs:\n  - job_name: moba-config-example\n    static_configs:\n      - targets: ['127.0.0.1:${metricsPort}']\n`);
    const promProcess = launch(prom, ['--config.file=' + resolve(dir, 'prometheus.yml'), '--storage.tsdb.path=' + resolve(dir, 'tsdb'), '--storage.tsdb.retention.time=1h', '--web.listen-address=127.0.0.1:' + promPort, '--log.level=error']);
    const prometheus = `http://127.0.0.1:${promPort}`;
    await until(async () => { try { return (await fetch(prometheus + '/-/ready', { signal: AbortSignal.timeout(300) })).ok; } catch { if (promProcess.exitCode !== null) throw new Error(promProcess.diagnostic()); return false; } }, 'Prometheus readiness');
    return { endpoint, prometheus, publish, close, ownedPids, stopFlags: () => stop(goffProcess),
      async query(expr) { const r = await fetch(prometheus + '/api/v1/query?query=' + encodeURIComponent(expr)); if (!r.ok) throw new Error(`query HTTP ${r.status}`); const data = await r.json(); if (data.status !== 'success') throw new Error('PromQL query failed'); return data.data.result; } };
  } catch (error) { await close(); throw error; }
}
