#!/usr/bin/env python3
"""Observe cold uvx environment duplication and a serial warm-up control."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('uv', type=Path, help='Installed uv 0.13.7 executable')
    args = parser.parse_args()
    if not __debug__:
        parser.error('Assertions required; do not use -O')
    uv = args.uv.resolve()
    if not uv.is_file():
        parser.error('uv executable must exist')
    root = Path(tempfile.mkdtemp(prefix='uvx-cold-cache-'))
    (root / 'home').mkdir()
    env = {'PATH': os.environ.get('PATH', os.defpath), 'HOME': str(root / 'home'),
           'UV_PYTHON_DOWNLOADS': 'never', 'UV_NO_PROGRESS': '1', 'UV_NO_CONFIG': 'true'}
    # Preserve the host's network route without recording proxy values.
    for key in ('HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'NO_PROXY', 'http_proxy', 'https_proxy', 'all_proxy', 'no_proxy', 'SSL_CERT_FILE', 'SSL_CERT_DIR'):
        if key in os.environ:
            env[key] = os.environ[key]
    version = subprocess.run([str(uv), '--version'], env=env, text=True, capture_output=True, timeout=15)
    assert version.returncode == 0 and version.stdout.startswith('uv 0.13.7 '), version.stdout

    def trial(name, warm):
        cache = root / name
        local_env = dict(env, UV_CACHE_DIR=str(cache), UV_TOOL_DIR=str(root / (name + '-tools')))
        command = [str(uv), 'tool', 'run', '--python', sys.executable,
                   '--default-index', 'https://pypi.org/simple', '--from', 'pycowsay==0.0.0.2', 'pycowsay', '--help']

        def run(label):
            p = subprocess.run(command, env=local_env, text=True, capture_output=True, timeout=90)
            record = dict(args=command, exit=p.returncode, stdout=p.stdout, stderr=p.stderr)
            raw = json.dumps(record, indent=2).replace(str(root), '<trial>').replace(str(uv), '<uv>').replace(sys.executable, '<python>')
            (root / f'{name}-{label}.json').write_text(raw + '\n')
            assert p.returncode == 0 and p.stdout.strip() == 'cowsay MESSAGE [MESSAGE]', record
            return p.returncode

        def inspect():
            environments = sorted(cache.glob('archive-v0/*/pyvenv.cfg'))
            links = [p for p in (cache / 'environments-v2').rglob('*') if p.is_symlink()]
            targets = {p.resolve() for p in links}
            fingerprints = set()
            for config in environments:
                site = next(config.parent.glob('lib/python*/site-packages'))
                packages = sorted((d.metadata['Name'], d.version) for d in importlib.metadata.distributions(path=[str(site)]))
                assert packages == [('pycowsay', '0.0.0.2')], packages
                code = {str(p.relative_to(site)): hashlib.sha256(p.read_bytes()).hexdigest()
                        for p in sorted((site / 'pycowsay').glob('*.py'))}
                assert code
                fingerprints.add(hashlib.sha256(json.dumps(code, sort_keys=True).encode()).hexdigest())
            assert len(fingerprints) == 1
            return dict(environments=len(environments), indexLinks=len(links),
                        unreferencedEnvironments=sum(p.parent not in targets for p in environments),
                        distinctPackageCodeHashes=len(fingerprints))

        if warm:
            run('warm')
        with ThreadPoolExecutor(max_workers=8) as pool:
            exits = list(pool.map(run, range(8)))
        before = inspect()
        sequential = [run('sequential-' + str(i)) for i in range(3)]
        after = inspect()
        return dict(concurrentExits=exits, afterConcurrent=before, sequentialExits=sequential, afterSequential=after)

    results = {'uv': '0.13.7', 'tool': 'pycowsay==0.0.0.2', 'cold': trial('cold', False), 'warmed': trial('warmed', True)}
    results['coldDuplicationObserved'] = results['cold']['afterConcurrent']['unreferencedEnvironments'] > 0
    results['warmControlSingleEnvironment'] = results['warmed']['afterSequential']['environments'] == 1
    print(json.dumps(results, indent=2))
    print(f'Evidence: {root}', file=sys.stderr)


if __name__ == '__main__':
    main()
