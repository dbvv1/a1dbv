"""Portable regression checks for replay_polars_http; does not rerun its HTTP cases."""
import argparse
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--replay-script', type=Path, default=Path(__file__).with_name('replay_polars_http.py'))
    parser.add_argument('--python-new', required=True, help='Polars 2.0.0 / requests 2.32.5 interpreter')
    parser.add_argument('--successful-report', type=Path, required=True, help='A prior successful 24-case JSON report')
    args = parser.parse_args()
    script = args.replay_script.resolve()
    require(script.is_file(), 'Replay script is missing')
    spec = importlib.util.spec_from_file_location('polars_http_replay_under_test', script)
    require(spec is not None and spec.loader is not None, 'Cannot load replay script')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    report = json.loads(args.successful_report.read_text(encoding='utf-8'))
    require(report['status'] == 'passed' and report['errors'] == [], 'Input report did not pass')
    rows = report['cases']
    expected = {(env, mode, case) for env in module.VERSIONS for mode, case in module.CASES}
    actual = {(r['environment'], r['mode'], r['case']) for r in rows}
    require(len(rows) == len(expected) == 24 and actual == expected, 'Missing, duplicate or unexpected case')
    require(all(r.get('passed') is True for r in rows), 'A case was not accepted')
    for env, version in module.VERSIONS.items():
        meta = report['prerequisites'][env]
        require(meta['polars'] == version and meta['requests'] == '2.32.5', 'Report prerequisite mismatch')
    for row in rows:
        module.validate(row)
    print('PASS: prior report has all 24 expected cases, versions, exact data and protocol observations.')

    row = copy.deepcopy(next(r for r in rows if (r['environment'], r['mode'], r['case']) == ('new', 'fixed', 'normal')))
    payload = json.loads(row['result']['stdout'])
    payload['data']['UNRATE'][0] = 999.0
    row['result']['stdout'] = json.dumps(payload)
    try:
        module.validate(row)
    except ValueError as error:
        require(str(error) == 'frame schema or data differs', 'Unexpected reason for rejecting modified data')
    else:
        raise AssertionError('Validator accepted modified data')
    print('PASS: deliberately modified successful data is rejected.')

    with tempfile.TemporaryDirectory(prefix='polars-http-regression-') as directory:
        root = Path(directory)
        for label, old in [('missing', str(root / 'nonexistent-python')), ('wrong-version', args.python_new)]:
            path = root / (label + '.json')
            result = subprocess.run([sys.executable, str(script), '--python-old', old, '--python-new', args.python_new, '--report', str(path)], capture_output=True, text=True, timeout=15)
            require(result.returncode == 1 and not result.stderr, f'{label}: wrong exit or stderr: {result}')
            failure = json.loads(path.read_text(encoding='utf-8'))
            require(failure['status'] == 'failed' and failure['cases'] == [] and failure['errors'], f'{label}: diagnostic report missing or cases ran')
            if label == 'missing':
                require(failure['prerequisites'] == {} and 'FileNotFoundError' in failure['errors'][0], 'Missing interpreter was not diagnosed')
            else:
                require(failure['prerequisites']['old']['polars'] == '2.0.0', 'New interpreter is not Polars 2.0.0')
                require(failure['prerequisites']['old']['requests'] == '2.32.5', 'New interpreter requests version differs')
                require('requires polars 1.44.2 and requests 2.32.5' in failure['errors'][0], 'Wrong version not diagnosed')
            print(f'PASS: {label} prerequisite exits 1, preserves JSON and starts no cases.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
