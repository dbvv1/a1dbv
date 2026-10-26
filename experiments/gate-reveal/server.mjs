// Small loopback-only static preview, MIT. Explicit files, range delivery, no browser launch.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('.', import.meta.url));
export function createGateServer({ mediaFile = resolve(root, 'generated/gate.mp4') } = {}) {
  const files = new Map([
    ['/', [resolve(root, 'index.html'), 'text/html; charset=utf-8']],
    ['/index.html', [resolve(root, 'index.html'), 'text/html; charset=utf-8']],
    ['/app.mjs', [resolve(root, 'app.mjs'), 'text/javascript; charset=utf-8']],
    ['/controller.mjs', [resolve(root, 'controller.mjs'), 'text/javascript; charset=utf-8']],
    ['/generated/gate.mp4', [mediaFile, 'video/mp4']],
  ]);
  return createServer(async (req, res) => {
    try {
      const entry = files.get(new URL(req.url, 'http://127.0.0.1').pathname);
      if (!entry || !['GET', 'HEAD'].includes(req.method)) { res.writeHead(404).end(); return; }
      const [path, type] = entry;
      const { size } = await stat(path);
      let start = 0, end = size - 1, status = 200;
      if (req.headers.range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        let valid = Boolean(match && (match[1] || match[2]));
        if (valid && match[1]) {
          start = Number(match[1]);
          end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
        } else if (valid) {
          const suffix = Number(match[2]);
          valid = Number.isSafeInteger(suffix) && suffix > 0;
          start = Math.max(0, size - suffix);
        }
        if (!valid || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) {
          res.writeHead(416, { 'Content-Range': `bytes */${size}` }).end(); return;
        }
        status = 206;
      }
      const headers = { 'Content-Type': type, 'Content-Length': Math.max(0, end - start + 1),
        'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' };
      if (status === 206) headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
      res.writeHead(status, headers);
      if (req.method === 'HEAD' || size === 0) { res.end(); return; }
      const stream = createReadStream(path, { start, end });
      stream.on('error', () => res.destroy());
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    } catch (error) {
      if (!res.headersSent) res.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
      else res.destroy();
    }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createGateServer();
  server.listen(0, '127.0.0.1', () => console.log(`GATE_REVEAL http://127.0.0.1:${server.address().port}/`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
    server.closeAllConnections();
    server.close(() => console.log('GATE_REVEAL_CLOSED'));
  });
}
