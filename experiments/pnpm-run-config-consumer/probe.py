#!/usr/bin/env python3
"""Use installed public pnpm CLIs and a synthetic local dependency; no registry deps."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

p = argparse.ArgumentParser()
p.add_argument('--old', required=True, type=Path)
p.add_argument('--before', required=True, type=Path)
p.add_argument('--after', required=True, type=Path)
a = p.parse_args()
clis = [x.resolve() for x in (a.old, a.before, a.after)]
assert all(x.is_file() for x in clis)

def invoke(cli, args, cwd):
  r = subprocess.run(['node', str(cli), *args], cwd=cwd,
                     capture_output=True, text=True, timeout=90)
  return r

with tempfile.TemporaryDirectory(prefix='pnpm-config-consumer-') as tmp:
  root = Path(tmp)
  base = root / 'base'
  (base / 'dep').mkdir(parents=True)
  (base / 'dep/package.json').write_text(json.dumps({'name': 'fixture-dep', 'version': '1.0.0'}))
  (base / 'package.json').write_text(json.dumps({
    'name': 'fixture', 'private': True,
    'dependencies': {'fixture-dep': 'file:./dep'},
    'pnpm': {'overrides': {'uuid': '>=11.1.1'}},
    'scripts': {'test': "node -e \"require('fs').writeFileSync('ran.txt', 'yes')\""}}))
  versions = [invoke(c, ['--version'], root).stdout.strip() for c in clis]
  assert versions == ['10.12.1', '12.6.0', '12.18.0'], versions
  r = invoke(clis[0], ['install', '--ignore-scripts', '--offline', '--store-dir', str(root / 'store')], base)
  assert r.returncode == 0, r.stderr
  original = (base / 'pnpm-lock.yaml').read_bytes()
  assert b'overrides:' in original
  results = []
  for label, cli in zip(('before', 'after'), clis[1:]):
    dest = root / label
    shutil.copytree(base, dest, symlinks=True)
    r = invoke(cli, ['run', 'test'], dest)
    lock = (dest / 'pnpm-lock.yaml').read_bytes()
    row = {'case': label, 'exit': r.returncode,
           'script_ran': (dest / 'ran.txt').exists() and (dest / 'ran.txt').read_text() == 'yes',
           'override_retained': b'overrides:' in lock,
           'lock_unchanged': original == lock,
           'guard_error': 'ERR_PNPM_VERIFY_DEPS_BEFORE_RUN' in r.stdout + r.stderr}
    if label == 'before':
      assert row['exit'] == 0 and row['script_ran'] and not row['override_retained'] and not row['lock_unchanged'], row
    else:
      assert row['exit'] != 0 and not row['script_ran'] and row['override_retained'] and row['lock_unchanged'] and row['guard_error'], row
    results.append(row)
  print(json.dumps({'versions': versions, 'cases': results}, indent=2))
