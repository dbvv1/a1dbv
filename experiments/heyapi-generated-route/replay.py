#!/usr/bin/env python3
"""Reproduce issue #4382 using pinned npm generators and no network transport."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent

def command(args, cwd, name):
  result = subprocess.run(args, cwd=cwd, capture_output=True, text=True)
  (cwd / f"{name}-output.txt").write_text(result.stdout + result.stderr)
  if result.returncode:
    raise RuntimeError(f"{name} exited {result.returncode}; inspect output in the run directory")
  return result.stdout

def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--workdir', type=Path)
  args = parser.parse_args()
  work = args.workdir or Path(tempfile.mkdtemp(prefix='heyapi-route-'))
  work.mkdir(parents=True, exist_ok=True)
  results = {}
  for label, version in [('old', '0.98.2'), ('new', '0.99.0')]:
    target = work / label
    target.mkdir(exist_ok=False)
    for name in ['package.json', 'package-lock.json']:
      shutil.copyfile(ROOT / label / name, target / name)
    for name in ['openapi.json', 'probe.ts', 'tsconfig.json']:
      shutil.copyfile(ROOT / name, target / name)
    command(['npm', 'ci', '--ignore-scripts', '--no-audit', '--no-fund', '--cache', str((work / 'npm-cache').resolve())], target, 'install')
    target.joinpath('generate.mjs').write_text("""import {createClient} from '@hey-api/openapi-ts';
for (const disable of [false,true]) {
 await createClient({input:'./openapi.json',output:disable?'generated-no-base':'generated',
 plugins:['@hey-api/typescript','@hey-api/schemas','@hey-api/sdk',
 disable?{name:'@hey-api/client-axios',baseUrl:false}:'@hey-api/client-axios','@pinia/colada']});
}
""")
    command(['node', 'generate.mjs'], target, 'generate')
    baseline = json.loads(command(['node', '--import', 'tsx', 'probe.ts'], target, 'probe'))
    no_base = ROOT.joinpath('probe.ts').read_text().replace('./generated/', './generated-no-base/')
    target.joinpath('probe-no-base.ts').write_text(no_base)
    disabled = json.loads(command(['node', '--import', 'tsx', 'probe-no-base.ts'], target, 'probe-no-base'))
    if label == 'new':
      config = json.loads(target.joinpath('tsconfig.json').read_text())
      config['files'].append('probe-no-base.ts')
      target.joinpath('tsconfig.json').write_text(json.dumps(config))
      command(['node','node_modules/typescript/bin/tsc','--pretty','false'],target,'typecheck')
    initial = '//api/auth/login' if label == 'new' else '/api/auth/login'
    assert [x['url'] for x in baseline['captured']] == [initial,initial,'/api/auth/login']
    assert [x['url'] for x in disabled['captured']] == ['/api/auth/login'] * 3
    assert baseline['captured'][0]['resolved'] == ('https://api/auth/login' if label=='new' else 'https://app.example/api/auth/login')
    assert all(x['resolved']=='https://app.example/api/auth/login' for x in disabled['captured'])
    results[label] = {'generator': version, 'default': baseline, 'baseUrlFalse': disabled,
      'newConsumerTypecheck': 'exit 0' if label=='new' else 'not run',
      'clientGenSha256': hashlib.sha256(target.joinpath('generated/client.gen.ts').read_bytes()).hexdigest()}
  print(json.dumps(results, indent=2))
  work.joinpath('result.json').write_text(json.dumps(results,indent=2)+'\n')

if __name__ == '__main__':
  main()
