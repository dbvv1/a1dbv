#!/usr/bin/env python3
"""Compare a historical Turbo affected query across two clean checkouts."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import tempfile

BASE = 'fa9e9c1b923a08d5eaa1391fee2ee5708113d16d'
A = 'cf6fceaab02b590bbe02643a458e0add356b37d4'
B = '5436b2d652edbd0827cfd92b22462c69b370669e'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path, help='Local clone of hamidelgendy/turbo-affected-head-lockfile')
    parser.add_argument('stable', type=Path, help='Installed turbo 2.11.10 bin/turbo')
    parser.add_argument('canary', type=Path, help='Installed turbo 2.11.11-canary.1 bin/turbo')
    args = parser.parse_args()
    if not __debug__:
        parser.error('Assertions required; do not use -O')
    source = args.source.resolve()
    clis = [('2.11.10', args.stable.resolve()), ('2.11.11-canary.1', args.canary.resolve())]
    if not source.is_dir() or not all(p.is_file() for _, p in clis):
        parser.error('Source directory and both CLI files must exist')
    root = Path(tempfile.mkdtemp(prefix='turbo-head-replay-'))
    evidence = root / 'evidence'
    evidence.mkdir()
    (root / 'home').mkdir()
    env = {'PATH': os.environ.get('PATH', os.defpath), 'HOME': str(root / 'home'),
           'TURBO_TELEMETRY_DISABLED': '1', 'DO_NOT_TRACK': '1',
           'TURBO_SCM_BASE': BASE, 'TURBO_SCM_HEAD': A, 'CI': '1'}
    counter = 0

    def run(command, cwd):
        nonlocal counter
        p = subprocess.run(command, cwd=cwd, env=env, text=True, capture_output=True, timeout=60)
        counter += 1
        record = dict(args=command, exit=p.returncode, stdout=p.stdout, stderr=p.stderr)
        raw = json.dumps(record, indent=2).replace(str(root), '<trial>').replace(str(source), '<source>')
        for version, cli in clis:
            raw = raw.replace(str(cli), '<turbo-' + version + '>')
        (evidence / f'{counter:02}.json').write_text(raw + '\n')
        assert p.returncode == 0, record
        return p.stdout

    results = {}
    for version, cli in clis:
        assert run(['node', str(cli), '--version'], root).strip() == version
        results[version] = {}
        for label, ref in [('B', B), ('A', A)]:
            project = root / (version + '-' + label)
            run(['git', 'clone', '--no-hardlinks', '--no-checkout', str(source), str(project)], root)
            run(['git', 'checkout', '--detach', ref], project)
            assert run(['git', 'rev-parse', 'HEAD'], project).strip() == ref
            assert not run(['git', 'status', '--porcelain'], project).strip()
            query = json.loads(run(['node', str(cli), 'query', 'affected', '--packages', '--base', BASE, '--head', A], project))
            dry = json.loads(run(['node', str(cli), 'run', 'build', '--affected', '--dry=json'], project))
            assert not run(['git', 'status', '--porcelain'], project).strip()
            packages = [(p['name'], p['reason']['__typename']) for p in query['data']['affectedPackages']['items']]
            tasks = [t['taskId'] for t in dry['tasks']]
            expected = [('//', 'ConservativeRootLockfileChanged'), ('app-a', 'DependencyChanged'), ('pkg-a', 'FileChanged')]
            if label == 'B':
                expected.append(('pkg-b', 'LockfileChanged'))
            assert packages == expected, packages
            expected_tasks = ['app-a#build', 'app-a#prebuild', 'pkg-a#build', 'pkg-a#prebuild']
            if label == 'B':
                expected_tasks += ['pkg-b#build', 'pkg-b#prebuild']
            expected_tasks += ['tooling-config#build', 'tooling-config#prebuild']
            assert tasks == expected_tasks, tasks
            results[version][label] = dict(packages=packages, tasks=tasks)
    print(json.dumps(results, indent=2))
    print(f'Evidence: {root}', file=__import__('sys').stderr)


if __name__ == '__main__':
    main()
