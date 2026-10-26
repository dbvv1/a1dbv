#!/usr/bin/env python3
"""Inventory fixed Git objects for a reviewed delivery; never publish or mutate Git."""

import argparse
import json
import os
from pathlib import Path
import subprocess
import sys


class InvalidInput(ValueError):
  pass


def git(repo, *args, allow_one=False):
  # Inspect only the selected repository. Do not inherit another Git directory,
  # load global credentials/config, replace objects, or lazily fetch missing data.
  env = {key: value for key, value in os.environ.items() if not key.startswith('GIT_')}
  env.update(GIT_CONFIG_NOSYSTEM='1', GIT_CONFIG_GLOBAL=os.devnull,
             GIT_NO_REPLACE_OBJECTS='1', GIT_NO_LAZY_FETCH='1',
             GIT_OPTIONAL_LOCKS='0', GIT_TERMINAL_PROMPT='0')
  try:
    result = subprocess.run(['git', '-C', str(repo), *args], env=env,
                            capture_output=True, timeout=30)
  except (OSError, subprocess.TimeoutExpired) as exc:
    raise InvalidInput(f'cannot read Git objects: {exc}') from exc
  if result.returncode not in ((0, 1) if allow_one else (0,)):
    detail = result.stderr.decode('utf-8', errors='replace').strip()
    raise InvalidInput(f'git {args[0]} failed: {detail}')
  return result


def snapshot(repo, ref):
  commit = git(repo, 'rev-parse', '--verify', '--end-of-options',
               ref + '^{commit}').stdout.decode('ascii').strip()
  tree = git(repo, 'rev-parse', '--verify', commit + '^{tree}').stdout.decode('ascii').strip()
  return {'commit': commit, 'tree': tree}


def entries(repo, tree):
  raw = git(repo, 'ls-tree', '-r', '-t', '-l', '-z', '--full-tree', tree).stdout
  result = {}
  for record in raw.split(b'\0'):
    if not record:
      continue
    header, path_bytes = record.split(b'\t', 1)
    mode, kind, sha, size = header.decode('ascii').split()
    try:
      path = path_bytes.decode('utf-8')
    except UnicodeDecodeError as exc:
      raise InvalidInput('non-UTF-8 Git path cannot be represented for JSON API delivery') from exc
    if path.startswith('/') or any(part in ('', '.', '..') for part in path.split('/')):
      raise InvalidInput('non-relative Git path')
    if kind not in ('blob', 'tree', 'commit') or (kind == 'blob' and not size.isdecimal()):
      raise InvalidInput(f'missing or invalid object for {path!r}')
    result[path] = {'path': path, 'mode': mode, 'type': kind, 'sha': sha,
                    'size': int(size) if kind == 'blob' else None}
  return result


def prepare(repo, base_ref, head_ref, known_refs=(), full=False):
  base = snapshot(repo, base_ref)
  head = snapshot(repo, head_ref)
  known = [base]
  for ref in known_refs:
    item = snapshot(repo, ref)
    if item not in known:
      known.append(item)
  cache = {}

  def tree_entries(tree):
    if tree not in cache:
      cache[tree] = entries(repo, tree)
    return cache[tree]

  old = tree_entries(base['tree'])
  new = tree_entries(head['tree'])
  locations = {}
  for item in known:
    for entry in tree_entries(item['tree']).values():
      key = (entry['type'], entry['sha'])
      locations.setdefault(key, set()).add(item['tree'])

  changes = []
  blobs = {}
  for path in sorted(old.keys() | new.keys()):
    before, after = old.get(path), new.get(path)
    if before == after:
      continue
    changes.append({'path': path, 'before': before, 'after': after})
    if after and after['type'] == 'blob':
      sha = after['sha']
      if sha not in blobs:
        blobs[sha] = {'sha': sha, 'size': after['size'], 'paths': [],
                      'same_object_in_trees': sorted(locations.get(('blob', sha), ()))}
      blobs[sha]['paths'].append(path)

  relation = git(repo, 'merge-base', '--is-ancestor', base['commit'], head['commit'], allow_one=True)
  manifest = {
    'schema_version': 1,
    'base': base,
    'head': head,
    'base_is_ancestor': relation.returncode == 0,
    'known_snapshots': known,
    'remote_presence_checked': False,
    'target_entry_count': len(new),
    'changes': changes,
    'changed_blobs': [blobs[sha] for sha in sorted(blobs)],
  }
  if full:
    manifest['entries'] = [new[path] for path in sorted(new)]
  return manifest


def main(argv=None):
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--repo', type=Path, default=Path('.'))
  parser.add_argument('--base', required=True, help='base commit/ref, resolved once')
  parser.add_argument('--head', default='HEAD', help='target commit/ref, resolved once')
  parser.add_argument('--known-ref', action='append', default=[],
                      help='additional previously prepared snapshot; not proof of remote presence')
  parser.add_argument('--full', action='store_true',
                      help='also include every target tree entry; redirect the JSON to a file')
  args = parser.parse_args(argv)
  try:
    manifest = prepare(args.repo, args.base, args.head, args.known_ref, args.full)
  except (InvalidInput, ValueError) as exc:
    print(f'error: {exc}', file=sys.stderr)
    return 2
  # Emit only after every object has been read; errors never leave partial JSON.
  print(json.dumps(manifest, ensure_ascii=False, indent=2))
  return 0


if __name__ == '__main__':
  raise SystemExit(main())
