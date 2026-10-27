"""Export reviewed public Git blobs; no network, Unity invocation or project overwrite."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess


def prepare(checkout, destination, manifest):
  if destination.exists():
    raise ValueError('destination must not exist; use a new staging directory')
  items = json.loads(manifest.read_text(encoding='utf-8'))
  staged = []
  names = set()
  for item in items['files']:
    name = item['destination']
    if not name or Path(name).name != name or name in ('.', '..') or name in names:
      raise ValueError('destination must be a unique filename')
    names.add(name)
    data = subprocess.check_output(['git', '-C', str(checkout), 'show',
                                    items['commit'] + ':' + item['path']])
    if hashlib.sha256(data).hexdigest() != item['sha256']:
      raise ValueError('source hash mismatch: ' + item['path'])
    staged.append((name, data))
  destination.mkdir(parents=True)
  for name, data in staged:
    (destination / name).write_bytes(data)
  return len(staged)


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--checkout', required=True, type=Path)
  parser.add_argument('--output', required=True, type=Path)
  args = parser.parse_args()
  print('staged', prepare(args.checkout, args.output, Path(__file__).with_name('sources.json')))
