#!/usr/bin/env python3
"""OpenSpec 1.14.3 two-change CLI trial. No model, global config or external project.
Requires Python 3.11+, Node >=20.19 and already installed OpenSpec 1.14.3.
Run: python3 replay_openspec_handoff.py /absolute/path/to/openspec
Does not install packages or intentionally use the network. Telemetry is disabled.
Uses a fresh temporary directory, preserves logs, and prints its location.
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import sys

if not __debug__:
    raise SystemExit('Run without -O: this experiment requires its assertions.')
if len(sys.argv) != 2 or not Path(sys.argv[1]).is_absolute() or not Path(sys.argv[1]).is_file():
    raise SystemExit('Usage: python3 replay_openspec_handoff.py /absolute/path/to/openspec (installed 1.14.3)')
cli = Path(sys.argv[1])

root = Path(tempfile.mkdtemp(prefix='openspec-two-change-'))
repo = root / 'repo'
repo.mkdir()
(root / 'home').mkdir()
(root / 'evidence').mkdir()
env = {'PATH': os.environ.get('PATH', os.defpath), 'HOME': str(root / 'home'),
       'LANG': 'C.UTF-8', 'LC_ALL': 'C.UTF-8',
       'OPENSPEC_TELEMETRY': '0', 'DO_NOT_TRACK': '1'}
sequence = 0

def command(args, cwd=repo, expected=0):
    global sequence
    p = subprocess.run([str(x) for x in args], cwd=cwd, env=env, text=True, capture_output=True, timeout=45)
    sequence += 1
    record = {'command': [str(x) for x in args], 'cwd': str(cwd), 'exit': p.returncode,
              'stdout': p.stdout, 'stderr': p.stderr}
    (root / 'evidence' / f'{sequence:02}.json').write_text(json.dumps(record, indent=2).replace(str(root), '<trial>').replace(str(cli), '<openspec-cli>')+'\n')
    assert p.returncode == expected, (args, p.returncode, p.stdout, p.stderr)
    return p.stdout


def op(*args, cwd=repo, expected=0):
    return command([cli, *args], cwd, expected)

def write(path, content, cwd=repo):
    p = cwd/path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content)

def change_file(change, name):
    return Path('openspec/changes') / change / name

first = 'add-json-export'
second = 'add-pretty-export'
cap = Path('openspec/specs/record-export/spec.md')
assert op('--version').strip() == '1.14.3'
op('init', '--tools', 'claude', '--profile', 'core', '--no-animation')
op('new', 'change', first)
s = json.loads(op('status', '--change', first, '--json'))
assert not s['isPlanningComplete'] and 'instructions proposal' in s['nextSteps'][0]
assert json.loads(op('instructions', 'apply', '--change', first, '--json'))['state'] == 'blocked'
# CLI only provides templates/instructions; fixture author supplies the artifacts.
proposal = '''# Proposal
## Why
Downstream consumers need stable JSON exports across two maintained changes.
## What Changes
- Add deterministic JSON serialization.
## Capabilities
### New Capabilities
- `record-export`: Serialize record arrays for consumers.
### Modified Capabilities
None.
## Impact
Only export.mjs and local node:test tests change.
'''
design = '''## Context
A synthetic package with no network or production data.
## Goals / Non-Goals
Preserve input ordering; no CSV or transport layer.
## Decisions
Use JSON.stringify for JSON-compatible input arrays.
## Risks / Trade-offs
Circular input values are outside the supported contract.
'''
old_scenarios = '''#### Scenario: Non-empty records
- **WHEN** records with ids 2 then 1 are exported
- **THEN** the JSON array contains ids 2 then 1
#### Scenario: Empty records
- **WHEN** no records are exported
- **THEN** the output is `[]`
'''
first_spec = '''## ADDED Requirements
### Requirement: JSON serialization
The exporter SHALL emit a JSON array of records in their input order.
''' + old_scenarios
tasks = '''## 1. Implementation
- [ ] 1.1 Implement the specified export behavior.
- [ ] 1.2 Verify all scenarios with node:test.
'''
for filename, body in [('proposal.md', proposal), ('design.md', design), ('specs/record-export/spec.md', first_spec), ('tasks.md', tasks)]:
    op('instructions', 'specs' if filename.startswith('specs/') else filename[:-3], '--change', first, '--json')
    write(change_file(first, filename), body)
s = json.loads(op('status', '--change', first, '--json'))
a = json.loads(op('instructions', 'apply', '--change', first, '--json'))
assert s['isPlanningComplete'] and s['isComplete'] and a['progress']['remaining'] == 2
assert not (repo/cap).exists()
op('validate', first, '--strict')
write(Path('export.mjs'), 'export function exportRecords(records) { return JSON.stringify(records); }\n')
tests = '''import test from 'node:test';
import assert from 'node:assert/strict';
import { exportRecords } from './export.mjs';
test('order', () => assert.equal(exportRecords([{id:2},{id:1}]), '[{"id":2},{"id":1}]'));
test('empty', () => assert.equal(exportRecords([]), '[]'));
'''
write(Path('export.test.mjs'), tests)
command(['node', '--test'])
write(change_file(first, 'tasks.md'), tasks.replace('[ ]', '[x]'))
r = json.loads(op('archive', first, '--yes', '--json'))
assert r['archive']['specsUpdated'] and r['archive']['totals']['added'] == 1
canonical = (repo/cap).read_text()
assert canonical.count('#### Scenario:') == 2
op('new', 'change', second)
new_spec = '''## MODIFIED Requirements
### Requirement: JSON serialization
The exporter SHALL emit a JSON array in input order, optionally with two-space indentation when pretty is true.
#### Scenario: Pretty records
- **WHEN** records are exported with pretty true
- **THEN** the JSON uses two-space indentation
'''
for filename, body in [('proposal.md', proposal.replace('Add deterministic JSON serialization.', 'Add opt-in pretty formatting.').replace('### New Capabilities\n- `record-export`: Serialize record arrays for consumers.\n### Modified Capabilities\nNone.', '### New Capabilities\nNone.\n### Modified Capabilities\n- `record-export`: Add pretty output while preserving old behavior.')), ('design.md', design), ('specs/record-export/spec.md', new_spec), ('tasks.md', tasks)]:
    write(change_file(second, filename), body)
loss = op('validate', second, '--strict', expected=1)
# Errors may be written to stderr; the complete command log is preserved.
r = json.loads(op('archive', second, '--yes', '--json', expected=1))
assert r['archive'] is None and r['status'][0]['code'] == 'archive_spec_update_failed'
assert (repo/cap).read_text() == canonical and (repo/change_file(second, 'tasks.md')).exists()
# Counterfactual: skip-specs archives this very same incomplete delta without updating current specs.
skip = root/'skip-specs'
shutil.copytree(repo, skip)
r = json.loads(op('archive', second, '--yes', '--skip-specs', '--json', cwd=skip))
assert not r['archive']['specsUpdated'] and (skip/cap).read_text() == canonical
# Copy the complete old requirement scenarios into the MODIFIED replacement block.
write(change_file(second, 'specs/record-export/spec.md'), new_spec + old_scenarios)
op('validate', second, '--strict')
# Without --yes incomplete tasks block archive; with --yes they do not.
incomplete = root/'incomplete-tasks'
shutil.copytree(repo, incomplete)
r = json.loads(op('archive', second, '--json', cwd=incomplete, expected=1))
assert r['status'][0]['code'] == 'archive_tasks_incomplete'
r = json.loads(op('archive', second, '--yes', '--json', cwd=incomplete))
assert r['archive']['specsUpdated']
# Same scenario identity does not protect its semantics.
semantic = root/'same-name-different-meaning'
shutil.copytree(repo, semantic)
write(change_file(second, 'specs/record-export/spec.md'), (new_spec+old_scenarios).replace('output is `[]`', 'output is `null`'), semantic)
op('validate', second, '--strict', cwd=semantic)
r = json.loads(op('archive', second, '--yes', '--json', cwd=semantic))
assert r['archive']['specsUpdated'] and 'output is `null`' in (semantic/cap).read_text()
# Real implementation acceptance remains independent: new test red, implementation green.
tests += '''test('pretty', () => assert.equal(exportRecords([{id:1}], {pretty:true}), '[\\n  {\\n    "id": 1\\n  }\\n]'));
test('empty pretty', () => assert.equal(exportRecords([], {pretty:true}), '[]'));
'''
write(Path('export.test.mjs'), tests)
command(['node', '--test'], expected=1)
write(Path('export.mjs'), 'export function exportRecords(records, options = {}) { return JSON.stringify(records, null, options.pretty ? 2 : undefined); }\n')
command(['node', '--test'])
write(change_file(second, 'tasks.md'), tasks.replace('[ ]', '[x]'))
assert json.loads(op('instructions', 'apply', '--change', second, '--json'))['progress']['remaining'] == 0
r = json.loads(op('archive', second, '--yes', '--json'))
assert r['archive']['specsUpdated'] and r['archive']['totals']['modified'] == 1
assert (repo/cap).read_text().count('#### Scenario:') == 3
# Generated Purpose is still a placeholder: strict validation catches it.
op('validate', '--specs', '--strict', expected=1)
write(cap, (repo/cap).read_text().replace('TBD - created by archiving change add-json-export. Update Purpose after archive.', 'Provide stable JSON exports for downstream consumers, preserving input order and supporting optional readable formatting.'))
op('validate', '--specs', '--strict')
op('list', '--specs')
op('show', 'record-export', '--type', 'spec')
print('PASS: two changes, scenario-loss block, skip-specs staleness, task bypass, semantic boundary, red/green tests and Purpose repair.')
print(f'Evidence retained at {root}')
