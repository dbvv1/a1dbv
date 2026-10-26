// Official fixed Linux x64 releases; download/unpack only into this example.
import { mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
if (process.platform !== 'linux' || process.arch !== 'x64') throw new Error('this preparation entry is Linux x64 only; use official releases for other systems');
const root = fileURLToPath(new URL('.', import.meta.url));
const items = [
  ['goff', 'https://github.com/thomaspoignant/go-feature-flag/releases/download/v1.57.2/go-feature-flag-relay-proxy_1.57.2_Linux_x86_64.tar.gz', 'ad09a90ecb93900c3cf1f0d4c9c144c5d454286727ff9c516c0a59b56debfb6a'],
  ['prometheus', 'https://github.com/prometheus/prometheus/releases/download/v3.15.1/prometheus-3.15.1.linux-amd64.tar.gz', '6a726885328ad9efebbf36e876ce2fb6225468a71fd1e7ce3ba666d5f4d97a84'],
];
await mkdir(resolve(root, '.local'), { recursive: true });
for (const [name, url, expected] of items) {
  const archive = resolve(root, `.local/${name}.tar.gz`);
  execFileSync('curl', ['--fail', '--location', '--silent', '--show-error', url, '--output', archive], { stdio: 'inherit' });
  const hash = createHash('sha256').update(await readFile(archive)).digest('hex');
  if (hash !== expected) throw new Error(`${name} archive SHA256 mismatch; not extracting`);
  const destination = resolve(root, name === 'goff' ? '.local/goff' : '.local');
  await mkdir(destination, { recursive: true });
  execFileSync('tar', ['-xzf', archive, '-C', destination]);
  console.log(`${name}: official fixed archive SHA256 verified`);
}
