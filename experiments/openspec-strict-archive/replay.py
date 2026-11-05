#!/usr/bin/env python3
"""Run pinned OpenSpec 1.16.0 in disposable projects; no model or application code."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile

MIXED = '''## ADDED Requirements

### Requirement: Probe requirement

The probe SHALL exist.

#### Scenario: The probe holds

- **WHEN** the probe runs
- **THEN** it holds

## DEPRECATED Requirements

### Requirement: Ignored requirement

This requirement sits under a section the CLI does not recognise.
'''
DELTA = Path('openspec/changes/probe/specs/probe/spec.md')
SPEC = Path('openspec/specs/probe/spec.md')

def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('cli', type=Path, help='Installed package bin/openspec.js')
  args = parser.parse_args()
  if not __debug__:
    parser.error('Assertions are required; do not use Python -O')
  cli = args.cli.resolve()
  if not cli.is_file():
    parser.error('cli must be an existing file')
  root = Path(tempfile.mkdtemp(prefix='openspec-strict-archive-'))
  (root/'home').mkdir()
  evidence = root/'evidence'
  evidence.mkdir()
  env = {'PATH':os.environ.get('PATH',os.defpath), 'HOME':str(root/'home'),
         'XDG_CONFIG_HOME':str(root/'home/config'), 'XDG_CACHE_HOME':str(root/'home/cache'),
         'LANG':'C.UTF-8','LC_ALL':'C.UTF-8','OPENSPEC_TELEMETRY':'0','DO_NOT_TRACK':'1',
         'CI':'1','OPENSPEC_CLI':str(cli)}
  sequence = 0
  def command(argv, cwd, expected):
    nonlocal sequence
    p = subprocess.run(argv,cwd=cwd,env=env,capture_output=True,text=True,timeout=45)
    sequence += 1
    record={'args':argv,'exit':p.returncode,'stdout':p.stdout,'stderr':p.stderr}
    raw=json.dumps(record,ensure_ascii=False,indent=2).replace(str(root),'<trial>').replace(str(cli),'<openspec-cli>')
    (evidence/f'{sequence:02}.json').write_text(raw+'\n')
    assert p.returncode==expected,(argv,p.returncode,p.stdout,p.stderr)
    return p
  assert command(['node',str(cli),'--version'],root,0).stdout.strip()=='1.16.0'
  def setup(name,text):
    target=root/name
    (target/DELTA).parent.mkdir(parents=True)
    (target/DELTA).write_text(text)
    return target
  def hashes(target):
    return {str(p.relative_to(target)):hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(target.rglob('*')) if p.is_file()}
  baseline=setup('baseline',MIXED)
  report=json.loads(command(['node',str(cli),'validate','--all','--json'],baseline,0).stdout)
  item=report['items'][0]
  assert item['valid'] and len(item['issues'])==2 and all(i['level']=='WARNING' for i in item['issues'])
  command(['node',str(cli),'archive','probe','--yes'],baseline,0)
  main_spec=(baseline/SPEC).read_text()
  archived=list((baseline/'openspec/changes/archive').glob('*/specs/probe/spec.md'))
  assert len(archived)==1 and archived[0].read_text()==MIXED
  assert '### Requirement: Probe requirement' in main_spec and 'Ignored requirement' not in main_spec
  results={'version':'1.16.0','plain':{'validateExit':0,'warnings':2,'archiveExit':0,
    'recognizedRequirementInMain':True,'ignoredRequirementInMain':False,'archivedDeltaUnchanged':True}}
  gate='node "$OPENSPEC_CLI" validate probe --type change --strict --no-interactive && node "$OPENSPEC_CLI" archive probe --yes'
  for name,text,exit_code in [('mixed',MIXED,1),('clean',MIXED.split('## DEPRECATED Requirements')[0],0)]:
    target=setup(name,text)
    before=hashes(target)
    command(['bash','-c',gate],target,exit_code)
    unchanged=before==hashes(target)
    active=(target/DELTA).exists()
    exists=(target/SPEC).exists()
    assert (unchanged,active,exists)==((True,True,False) if name=='mixed' else (False,False,True))
    if name=='clean': assert '### Requirement: Probe requirement' in (target/SPEC).read_text()
    results[name]={'gateExit':exit_code,'filesUnchanged':unchanged,'activeDeltaExists':active,'mainSpecExists':exists}
  (root/'result.json').write_text(json.dumps(results,indent=2)+'\n')
  print(json.dumps(results,indent=2))
  print(f'Evidence: {root}',file=__import__('sys').stderr)

if __name__=='__main__':
  main()
