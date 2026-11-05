#!/usr/bin/env python3
"""Replay Knip #2298 and a manual export-only repair in fresh temporary files."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import tempfile

ORIGINAL = '''const values = { localOnly: 40, publicValue: 2 };
export const { localOnly, publicValue } = values;
export function read() {
  return localOnly + publicValue;
}
'''
REPAIRED = ORIGINAL.replace('export const { localOnly, publicValue } = values;',
                            'const { localOnly, publicValue } = values;\nexport { publicValue };')
MAIN = "import { read, publicValue } from './values.js';\nconsole.log(read() + publicValue);\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('cli', type=Path, help='Installed knip/bin/knip.js')
    args = parser.parse_args()
    if not __debug__:
        parser.error('Assertions required; do not use -O')
    cli = args.cli.resolve()
    if not cli.is_file():
        parser.error('CLI file must exist')
    root = Path(tempfile.mkdtemp(prefix='knip-export-consumer-'))
    evidence = root / 'evidence'
    evidence.mkdir()
    env = dict(os.environ, NO_COLOR='1', FORCE_COLOR='0')
    counter = 0

    def run(command, project, expected):
        nonlocal counter
        p = subprocess.run(command, cwd=project, env=env, capture_output=True, text=True, timeout=60)
        counter += 1
        record = dict(args=command, exit=p.returncode, stdout=p.stdout, stderr=p.stderr)
        raw = json.dumps(record, indent=2).replace(str(root), '<trial>').replace(str(cli), '<knip-cli>')
        (evidence / f'{counter:02}.json').write_text(raw + '\n')
        assert p.returncode == expected, record
        return p

    assert run(['node', str(cli), '--version'], root, 0).stdout.strip() == '6.44.1'
    results = {'version': '6.44.1'}
    for name, source in [('automatic', ORIGINAL), ('manual', REPAIRED)]:
        project = root / name
        (project / 'src').mkdir(parents=True)
        (project / 'package.json').write_text('{"private":true,"type":"module"}\n')
        (project / 'knip.json').write_text('{"entry":["src/main.js"],"project":["src/**/*.js"]}\n')
        (project / 'src/main.js').write_text(MAIN)
        values = project / 'src/values.js'
        values.write_text(source)
        app = ['node', 'src/main.js']
        check = ['node', str(cli), '--include', 'exports', '--reporter', 'json', '--no-progress']
        assert run(app, project, 0).stdout == '44\n'
        report = json.loads(run(check, project, 1 if name == 'automatic' else 0).stdout)
        if name == 'automatic':
            assert [x['name'] for x in report['issues'][0]['exports']] == ['localOnly']
            run(check + ['--fix', '--fix-type', 'exports'], project, 0)
            assert values.read_text() == ORIGINAL.replace('localOnly,', '')
            assert json.loads(run(check, project, 0).stdout) == {'issues': []}
            failed = run(app, project, 1)
            assert 'ReferenceError: localOnly is not defined' in failed.stderr
            results[name] = dict(beforeOutput='44', reportExit=1, fixExit=0, recheckExit=0,
                                 remainingIssues=0, consumerExit=1, error='ReferenceError: localOnly is not defined')
        else:
            assert report == {'issues': []} and values.read_text() == REPAIRED
            assert run(app, project, 0).stdout == '44\n'
            results[name] = dict(consumerExit=0, consumerOutput='44', reportExit=0, remainingIssues=0)
    print(json.dumps(results, indent=2))
    print(f'Evidence: {root}', file=__import__('sys').stderr)


if __name__ == '__main__':
    main()
