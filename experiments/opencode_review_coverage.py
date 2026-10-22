#!/usr/bin/env python3
"""Compare a saved OCR range preview to Git, without invoking OCR or a model.
Usage: python3 experiments/opencode_review_coverage.py REPO BASE HEAD PREVIEW_JSON
Exit 0: inventories match; 1: mismatch; other errors are not a pass.
"""
import json, pathlib, subprocess, sys
ENV = {"PATH": "/usr/bin:/bin", "HOME": "/nonexistent", "LANG": "C.UTF-8",
       "GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": "/dev/null"}
repo, base, head, preview = sys.argv[1:]
def git(*args):
    return subprocess.check_output(['git', '--no-pager', '-C', repo, *args], env=ENV)
mb = git('merge-base', base, head).decode().strip()
p = json.loads(pathlib.Path(preview).read_text())
if p['schema_version'] != '1' or p['mode'] != 'range':
    raise ValueError('Expected schema 1 range preview')
for key in ('total_files', 'reviewable_count', 'excluded_count'):
    if type(p[key]) is not int or p[key] < 0:
        raise ValueError('Invalid count: ' + key)
for key in ('reviewable_files', 'excluded_files'):
    if not isinstance(p[key], list):
        raise ValueError('Invalid file list: ' + key)
    for entry in p[key]:
        if not isinstance(entry['path'], str) or not entry['path']:
            raise ValueError('Invalid path')
        if entry['status'] not in ('added', 'modified', 'deleted', 'renamed', 'binary'):
            raise ValueError('Unknown status')
# -z preserves whitespace/newlines. Default rename detection emits old + new path.
tokens = git('diff', '--no-ext-diff', '--no-textconv', '--no-color',
             '--name-status', '-z', mb + '..' + head, '--').split(b'\0')
expected = []; i = 0
while i < len(tokens) and tokens[i]:
    status = tokens[i].decode('ascii'); i += 1
    old = tokens[i]; i += 1
    if status[0] in 'RC':
        path = tokens[i]; i += 1
    else:
        path = old
    expected.append(path.decode('utf-8', errors='strict'))
entries = p['reviewable_files'] + p['excluded_files']
actual = [x['path'] for x in entries]
missing = sorted(set(expected) - set(actual)); extra = sorted(set(actual) - set(expected))
refs_ok = p.get('from') == base and p.get('to') == head and p.get('merge_base') == mb
counts_ok = (len(expected) == p['total_files'] == len(actual) == len(set(actual))
             and p['reviewable_count'] == len(p['reviewable_files'])
             and p['excluded_count'] == len(p['excluded_files']))
result = {'refs_ok': refs_ok, 'counts_ok': counts_ok, 'git_entries': len(expected),
          'ocr_entries': len(actual), 'missing': missing, 'extra': extra}
print(json.dumps(result, ensure_ascii=True, indent=2))
sys.exit(0 if refs_ok and counts_ok and not missing and not extra else 1)
