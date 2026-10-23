"""Replay a fixed xarray MultiIndex collision and patch, without installing packages.

Requires Python 3.12+, git, and the sibling requirements.txt in this interpreter.
Creates a fresh temporary checkout and retains all evidence. No upstream writes.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

BASE = 'fbc4cf19b919ce23fd0f7d419e9c141f046788a9'
PATCH_SHA256 = '942f024884deb567e49ef563fce76a92fe0401f638da31f6cf25f03045777533'
HERE = Path(__file__).resolve().parent


def run(command: list[str], cwd: Path, log: Path, expected: int = 0) -> str:
    env = {**os.environ, 'PYTHONPATH': str(cwd),
           'PYTEST_DISABLE_PLUGIN_AUTOLOAD': '1'}
    env.pop('PYTEST_ADDOPTS', None)
    env.pop('PYTEST_PLUGINS', None)
    try:
        proc = subprocess.run(command, cwd=cwd, text=True, stdout=subprocess.PIPE,
                              stderr=subprocess.STDOUT, timeout=180, env=env)
    except subprocess.TimeoutExpired as error:
        output = error.stdout or ''
        if isinstance(output, bytes):
            output = output.decode(errors='replace')
        log.write_text(output + '\nReplay command timed out after 180 seconds.\n')
        raise
    log.write_text(proc.stdout)
    if proc.returncode != expected:
        raise RuntimeError(f'{log.name}: exit {proc.returncode}, expected {expected}')
    return proc.stdout


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check-only', action='store_true')
    args = parser.parse_args()
    if sys.version_info < (3, 12):
        raise RuntimeError('Python 3.12+ required')
    if not shutil.which('git'):
        raise RuntimeError('git is required')
    for filename in ('fix.patch', 'test_collision.py', 'requirements.txt'):
        if not (HERE / filename).is_file():
            raise RuntimeError(f'missing sibling input: {filename}')
    if hashlib.sha256((HERE / 'fix.patch').read_bytes()).hexdigest() != PATCH_SHA256:
        raise RuntimeError('patch SHA-256 mismatch')
    for line in (HERE / 'requirements.txt').read_text().splitlines():
        if not line.strip() or line.startswith('#'):
            continue
        name, expected = line.split('==')
        actual = importlib.metadata.version(name)
        if actual != expected:
            raise RuntimeError(f'{name}: need {expected}, found {actual}')
    if args.check_only:
        print('Prerequisites and sibling inputs verified; no checkout or tests run.')
        return
    work = Path(tempfile.mkdtemp(prefix='xarray-collision-'))
    print(f'Evidence directory: {work}', flush=True)
    source = work / 'source'
    run(['git', 'clone', '--quiet', 'https://github.com/pydata/xarray.git', str(source)], work, work / 'clone.txt')
    run(['git', 'checkout', '--detach', BASE], source, work / 'checkout.txt')
    head = run(['git', 'rev-parse', 'HEAD'], source, work / 'head.txt').strip()
    if head != BASE:
        raise RuntimeError('source revision mismatch')
    consumer = work / 'test_collision.py'
    shutil.copyfile(HERE / 'test_collision.py', consumer)
    command = [sys.executable, '-m', 'pytest', '-q', '-o', 'addopts=', str(consumer)]
    before = run(command, source, work / 'before.txt', expected=1)
    if '21 failed, 7 passed' not in before:
        raise RuntimeError('baseline did not reproduce the expected collision family')
    run(['git', 'apply', '--check', str(HERE / 'fix.patch')], source, work / 'patch-check.txt')
    run(['git', 'apply', str(HERE / 'fix.patch')], source, work / 'patch-apply.txt')
    after = run(command, source, work / 'after.txt')
    if '28 passed' not in after:
        raise RuntimeError('consumer regression count mismatch')
    for label, target, selection in [
        ('upstream', 'xarray/tests/test_dataarray.py', 'from_series or to_series'),
        ('properties', 'properties/test_pandas_roundtrip.py', 'multiindex_series_temporary_names or roundtrip_pandas_series'),
    ]:
        output = run([sys.executable, '-m', 'pytest', '-q', '-o', 'addopts=', target, '-k', selection], source, work / f'{label}.txt')
        expected_count = '20 passed' if label == 'upstream' else '2 passed'
        if expected_count not in output or ' skipped' in output:
            raise RuntimeError(f'{label}: unexpected test count or skips')
    run(['git', 'diff', '--check'], source, work / 'diff-check.txt')
    result = {'source': BASE, 'patch_sha256': hashlib.sha256((HERE / 'fix.patch').read_bytes()).hexdigest(),
              'baseline': '21 failed, 7 passed', 'patched_consumer': '28 passed',
              'scope': 'Full Cartesian named MultiIndex; focused tests, not complete CI.'}
    (work / 'result.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, ValueError, OSError, subprocess.TimeoutExpired, importlib.metadata.PackageNotFoundError) as error:
        print(f'Replay failed: {error}', file=sys.stderr)
        sys.exit(1)
