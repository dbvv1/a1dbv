#!/usr/bin/env python3
"""Run this repository's bounded offline checks, never model or native-engine tests."""
import os
from pathlib import Path
import shlex
import shutil
import signal
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
TIMEOUT = 120  # Per phase, including its subprocesses; CI retains its job limit.
REQUIRED = ('bash', 'python3', 'jq', 'cat', 'mkdir', 'rm', 'grep', 'sort',
            'head', 'sed', 'dirname', 'basename', 'awk', 'find', 'cp')


def phases(root):
  python = sys.executable
  unit = (python, 'scripts/check_offline.py', '--suite')
  checks = [
    ('Local document targets and config syntax', (python, 'scripts/check_repo.py'), {}),
    ('Deterministic tests (Python Hook backend)', (*unit, 'tests', 'test*.py'),
     {'TEST_PARSER': 'python3'}),
    ('Hook jq backend regressions', (*unit, 'tests', 'test_protect_paths.py'),
     {'TEST_PARSER': 'jq'}),
    ('Evaluation fixtures (no models)',
     (*unit, 'experiments/workflow-ablation/evaluator', 'selftest.py'), {}),
    ('Public result audit (synthetic data)',
     (*unit, 'experiments/context-results-audit', 'test*.py'), {}),
    ('Recovery outcome probe (no services)',
     (*unit, 'experiments/recovery-outcome', 'test*.py'), {}),
  ]
  for path in sorted(root.rglob('*.sh')):
    relative = path.relative_to(root)
    if '.git' not in relative.parts:
      checks.append((f'Shell syntax: {relative}', ('bash', '-n', str(relative)), {}))
  return checks


def preflight():
  errors = []
  if sys.version_info < (3, 11):
    errors.append('Python 3.11+ is required')
  if os.name != 'posix' or not os.access('/bin/bash', os.X_OK):
    errors.append('POSIX with /bin/bash is required by existing fixture tests')
  missing = [name for name in REQUIRED if shutil.which(name) is None]
  if missing:
    errors.append('missing required commands: ' + ', '.join(missing))
  return errors


def run_process(command, *, cwd, env, timeout):
  # A timed-out test may own children. Kill the entire phase process group.
  with subprocess.Popen(command, cwd=cwd, env=env, start_new_session=True) as process:
    try:
      return process.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
      try:
        os.killpg(process.pid, signal.SIGKILL)
      except ProcessLookupError:
        pass
      process.wait()
      raise


def run_suite(directory, pattern):
  """Internal phase adapter: unittest's ordinary success includes skips/zero tests."""
  suite = unittest.TestLoader().discover(directory, pattern=pattern)
  result = unittest.TextTestRunner(verbosity=2).run(suite)
  if not result.testsRun or result.skipped:
    print(f'FAILED: strict suite requires tests and no skips '
          f'(ran={result.testsRun}, skipped={len(result.skipped)}).',
          file=sys.stderr, flush=True)
    return 1
  return 0 if result.wasSuccessful() else 1


def main():
  # Internal subprocess mode executes one suite, never the aggregate entry.
  if len(sys.argv) == 4 and sys.argv[1] == '--suite':
    return run_suite(sys.argv[2], sys.argv[3])
  if len(sys.argv) != 1:
    print('Usage: python3 scripts/check_offline.py', file=sys.stderr)
    return 2
  errors = preflight()
  if errors:
    for error in errors:
      print('BLOCKED: ' + error, file=sys.stderr)
    print('No phases ran; install nothing automatically.', file=sys.stderr)
    return 2
  checks = phases(ROOT)
  env = dict(os.environ)
  # Always check the repository Hook, even if a caller configured a test override.
  env.pop('HOOK_UNDER_TEST', None)
  for index, (name, command, overrides) in enumerate(checks, 1):
    print(f'[{index}/{len(checks)}] {name}\n$ {shlex.join(command)}', flush=True)
    try:
      code = run_process(command, cwd=ROOT, env={**env, **overrides}, timeout=TIMEOUT)
    except subprocess.TimeoutExpired:
      print(f'FAILED: {name} timed out after {TIMEOUT}s; later phases not run.', flush=True)
      return 1
    except OSError as exc:
      print(f'FAILED: {name}: {exc}; later phases not run.', flush=True)
      return 1
    if code:
      print(f'FAILED: {name} exited {code}; later phases not run.', flush=True)
      return 1
    print(f'PASSED: {name}', flush=True)
  print('Offline commands passed (nonempty suites, no skips). This is not model, '
        'native-engine, native-OS, or hosted-CI validation.', flush=True)
  return 0


if __name__ == '__main__':
  raise SystemExit(main())
