#!/usr/bin/env python3
"""Replay one pinned public migration rule; requires ast-grep 0.51.0 and Node 24+.
No installation, network, project code execution or upstream modifications.
Usage: python3 replay_astgrep_migration.py --source PATH --ast-grep PATH
"""
# Upstream example attribution: https://github.com/posva/pinia-colada
# The MIT License (MIT)
#
# Copyright (c) 2023-present Eduardo San Martin Morote
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import argparse
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile

SHA = 'e79a039e1c236747e8551a6eec0524613e76d01e'
RULE = 'codemods/rules/migration-0-21-to-1-0.yaml'
TEST = 'codemods/rule-tests/migration-0-21-to-1-0-test.yaml'
# Synthetic boundary fixture based on upstream migration examples, not an app.
FIXTURE = '''// P1: upstream example
useQuery(documentDetailsQuery, () => route.params.id);
// P2: equivalent spacing
useQuery ( documentDetailsQuery , () => route.params.id );
// P3: equivalent multiline
useQuery(
  documentDetailsQuery,
  () => route.params.id
);
// P4: upstream return block
useQuery(documentDetailsQuery, () => { return route.params.id });
// P5: upstream ordinary function
useQuery(documentDetailsQuery, function () { return route.params.id });
// P6: upstream useQueryState example
useQueryState(documentDetailsQuery, () => route.params.id);
// N1: already migrated
useQuery(() => documentDetailsQuery(route.params.id));
// N2: upstream intended negative: effect-only arrow
useQuery(documentDetailsQuery, () => { sideEffect() });
// N3: upstream intended negative: effect-only function
useQuery(documentDetailsQuery, function () { sideEffect() });
// N4: same text in a comment: useQuery(documentDetailsQuery, () => route.params.id)
const example = "useQuery(documentDetailsQuery, () => route.params.id)"; // N5
// N6: other member receiver
other.useQuery(documentDetailsQuery, () => route.params.id);
'''


def run(args, cwd, expected=0):
  result = subprocess.run(args, cwd=cwd, capture_output=True, text=True, timeout=45)
  if expected is not None and result.returncode != expected:
    raise RuntimeError(f'Unexpected exit {result.returncode}: {args}\n{result.stdout}{result.stderr}')
  return result


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--source', required=True, type=Path)
  parser.add_argument('--ast-grep', required=True, type=Path)
  args = parser.parse_args()
  source, sg = args.source.resolve(), str(args.ast_grep.resolve())
  for command in ('git', 'node'):
    if not shutil.which(command):
      parser.error(f'Missing prerequisite: {command}')
  if not source.is_dir() or not Path(sg).is_file():
    parser.error('Source directory or ast-grep executable is missing')
  if run(['git', 'rev-parse', 'HEAD'], source).stdout.strip() != SHA:
    parser.error(f'Source must be pinned at {SHA}')
  run(['git', 'diff', '--exit-code', 'HEAD', '--', 'codemods', 'sgconfig.yml'], source)
  if run([sg, '--version'], source).stdout.strip() != 'ast-grep 0.51.0':
    parser.error('This replay requires ast-grep 0.51.0')
  if int(run(['node', '--version'], source).stdout.strip().lstrip('v').split('.')[0]) < 24:
    parser.error('This replay requires Node 24+ for .ts syntax checks')
  work = Path(tempfile.mkdtemp(prefix='astgrep-migration-'))
  # Copy only tracked upstream inputs, ignoring untracked files.
  tracked = run(['git', 'ls-files', 'codemods', 'sgconfig.yml'], source).stdout.splitlines()
  for name in tracked:
    target = work / name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source / name, target)
  rule, tests = work / RULE, work / TEST
  original_rule = rule.read_text()
  for stage in ('upstream', 'corrected-key-only', 'narrowed'):
    if stage == 'corrected-key-only':
      tests.write_text(tests.read_text().replace('\nvaild:', '\nvalid:'))
    if stage == 'narrowed':
      rule.write_text(original_rule.replace('fix: ', 'constraints:\n  PARAMS:\n    not: { kind: statement_block }\nfix: '))
    result = run([sg, 'test'], work, expected=4 if stage == 'corrected-key-only' else 0)
    (work / (stage + '-tests.log')).write_text(result.stdout + result.stderr)
    if (result.returncode == 0) != (stage != 'corrected-key-only'):
      raise RuntimeError(f'Unexpected {stage} test result; see {work}')
  (work / 'original.ts').write_text(FIXTURE)
  (work / 'upstream.yaml').write_text(original_rule)
  expected = {2, 4, 6, 11, 13, 15}
  summary = {}
  for name, selected in [('upstream', work / 'upstream.yaml'), ('narrowed', rule)]:
    matches = json.loads(run([sg, 'scan', '-r', str(selected), 'original.ts', '--json'], work).stdout)
    lines = {m['range']['start']['line'] + 1 for m in matches}
    summary[name] = dict(TP=len(lines & expected), FP=len(lines - expected), FN=len(expected - lines))
    if lines != (expected | {19} if name == 'upstream' else expected):
      raise RuntimeError(f'Unexpected {name} match set: {lines}')
    output = work / (name + '-output.ts')
    output.write_text(FIXTURE)
    run([sg, 'scan', '-r', str(selected), str(output), '--update-all'], work)
    syntax = run(['node', '--check', str(output)], work, expected=None)
    (work / (name + '-syntax.log')).write_text(syntax.stdout + syntax.stderr)
    if (syntax.returncode == 0) != (name == 'narrowed'):
      raise RuntimeError(f'Unexpected {name} syntax result')
    if name == 'narrowed':
      before = output.read_text()
      run([sg, 'scan', '-r', str(selected), str(output), '--update-all'], work)
      if output.read_text() != before:
        raise RuntimeError('Rewrite was not idempotent')
  lines = {FIXTURE.count('\n', 0, m.start()) + 1 for m in re.finditer(re.escape('useQuery(documentDetailsQuery,'), FIXTURE)}
  summary['literal'] = dict(TP=len(lines & expected), FP=len(lines - expected), FN=len(expected - lines))
  (work / 'scope-negative.ts').write_text('function unrelated(useQuery) { return useQuery(documentDetailsQuery, () => route.params.id) }')
  scope = json.loads(run([sg, 'scan', '-r', str(rule), 'scope-negative.ts', '--json'], work).stdout)
  if len(scope) != 1:
    raise RuntimeError('Known shadowed-function boundary changed')
  summary['known_shadowed_function_false_positive'] = True
  (work / 'binding-negative.ts').write_text('useQuery(documentDetailsQuery, function () { return this.value })')
  binding = json.loads(run([sg, 'scan', '-r', str(rule), 'binding-negative.ts', '--json'], work).stdout)
  if len(binding) != 1 or binding[0].get('replacement') != 'useQuery(() => documentDetailsQuery(this.value))':
    raise RuntimeError('Known callback-binding boundary changed')
  summary['known_ordinary_function_this_to_arrow_rewrite'] = True
  (work / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
  print(json.dumps(summary, indent=2))
  print(f'PASS fixture checks; inspect retained artifacts: {work}')


if __name__ == '__main__':
  main()
