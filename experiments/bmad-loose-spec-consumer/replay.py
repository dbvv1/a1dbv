#!/usr/bin/env python3
"""Replay BMAD #3143 and check the real ticket consumer; no model or installation."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import sys

COMMIT = '7687d077f8457bb34a23a6bfa2cc797c0f23b16f'


def command(args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=30)
    if result.returncode:
        raise RuntimeError(result.stderr)
    return json.loads(result.stdout)


def run(source, work):
    source = source.resolve()
    version = subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD'], text=True).strip()
    assert version == COMMIT, 'use the documented fixed source'
    assert not subprocess.check_output(['git', '-C', str(source), 'diff', 'HEAD', '--', 'skills'], text=True)
    work = work.resolve()
    if work.is_relative_to(source) or work.exists():
        raise ValueError('work must be new and outside source')
    work.mkdir(parents=True)
    project = work / 'original'
    store = project / '_bmad-output'
    for name in ('pay', 'ship'):
        folder = store / f'spec-{name}'
        folder.mkdir(parents=True)
        (folder / f'spec-{name}.md').write_text(
            f'---\ncompanions: [DESIGN.md]\nsources: []\n---\n\n# {name}\n\n## Capabilities\n\n- **CAP-1** {name} things\n', encoding='utf-8')
        (folder / '.memlog.md').write_text(f'---\ntopic: {name}\n---\n- (idea) {name} history\n', encoding='utf-8')
        (folder / 'DESIGN.md').write_text(f'# {name} design\n', encoding='utf-8')
    migrate = source / 'skills/bmad/scripts/migrate_v6.py'
    tickets = source / 'skills/bmad-agent-po/scripts/tickets.py'
    args = [sys.executable, str(migrate), '--project-root', str(project), '--skill', str(source / 'skills/bmad'), '--fold-specs', str(store)]
    first = command(args)
    assert len(first['folded']) == 1 and len(first['problems']) == 1
    assert 'DESIGN.md already exist(s)' in first['problems'][0]['problem']
    ship = store / 'spec-ship'
    (ship / 'DESIGN.md').rename(ship / 'SHIP-DESIGN.md')
    spec = ship / 'spec-ship.md'
    spec.write_text(spec.read_text(encoding='utf-8').replace('DESIGN.md', 'SHIP-DESIGN.md'), encoding='utf-8')
    second = command(args)
    assert len(second['folded']) == 1 and second['problems'] == []
    shared_log = (store / 'backlog/.memlog.md').read_text(encoding='utf-8')
    assert 'topic: pay' in shared_log and 'pay history' in shared_log and 'ship history' in shared_log
    assert 'topic: ship' not in shared_log

    # Compare equal project/backlog layouts. Only story file placement changes;
    # moving each whole story into a directory is an unadopted proposal, not a patch.
    flat = work / 'flat'
    nested = work / 'nested'
    shutil.copytree(project, flat)
    shutil.copytree(project, nested)
    for name in ('pay', 'ship'):
        backlog = nested / '_bmad-output/backlog'
        folder = backlog / f'story-{name}'
        folder.mkdir()
        (backlog / f'story-{name}.md').rename(folder / f'story-{name}.md')
    summaries = {}
    for label, root in [('flat', flat), ('nested', nested)]:
        report = command([sys.executable, str(tickets), '--project-root', str(root), 'status', str(root / '_bmad-output/backlog')])
        summaries[label] = {'exit_code': 0, 'total': report['counts']['total'], 'files': [row['file'] for row in report['tickets']]}
    assert summaries['flat']['total'] == 2
    assert summaries['nested']['total'] == 0
    # The nested files were not deleted; they simply are not discovered.
    assert all((nested / f'_bmad-output/backlog/story-{name}/story-{name}.md').is_file() for name in ('pay', 'ship'))
    result = {'source_commit': COMMIT, 'python': sys.version.split()[0],
              'first_fold': {'exit_code': 0, 'folded': len(first['folded']), 'problems': first['problems']},
              'renamed_companion_fold': {'exit_code': 0, 'folded': len(second['folded']), 'problems': second['problems']},
              'shared_log': shared_log, 'consumer_layout': summaries,
              'scope': 'unchanged source, synthetic public issue input, real migration and tickets CLI; no model, production data or accepted layout change'}
    (work / 'results.json').write_text(json.dumps(result, ensure_ascii=True, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(result, ensure_ascii=True, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--work', type=Path, required=True)
    options = parser.parse_args()
    run(options.source, options.work)
