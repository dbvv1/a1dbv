#!/usr/bin/env python3
"""Measure existing offline phases in isolated committed-tree copies; not CI policy."""
import argparse
import concurrent.futures
from contextlib import contextmanager
from functools import partial
import importlib.util
import json
import os
from pathlib import Path
import queue
import re
import signal
import subprocess
import sys
import tempfile
import threading
import time
from datetime import datetime, timezone


def utc():
  return datetime.now(timezone.utc).isoformat(timespec='milliseconds')


def load_runner(root):
  spec = importlib.util.spec_from_file_location('offline_trial_source', root / 'scripts/check_offline.py')
  module = importlib.util.module_from_spec(spec)
  spec.loader.exec_module(module)
  return module


class Interrupted(Exception):
  def __init__(self, signum):
    self.signum = signum
    super().__init__(signal.Signals(signum).name)


class Cancellation:
  def __init__(self):
    self.signum = None
    self.result_path = None

  def receive(self, signum, frame):
    # A handler must not acquire worker locks or raise through resource setup.
    if self.signum is None:
      self.signum = signum

  def check(self):
    if self.signum is not None:
      raise Interrupted(self.signum)

  @contextmanager
  def signals(self):
    previous = {sig: signal.signal(sig, self.receive)
                for sig in (signal.SIGINT, signal.SIGTERM)}
    try:
      yield
    finally:
      for sig, handler in previous.items():
        signal.signal(sig, handler)


def run_process(command, *, cancel, timeout=None, **kwargs):
  cancel.check()
  deadline = None if timeout is None else time.monotonic() + timeout
  with subprocess.Popen(command, start_new_session=True, **kwargs) as process:
    try:
      while True:
        cancel.check()
        remaining = None if deadline is None else deadline - time.monotonic()
        if remaining is not None and remaining <= 0:
          raise subprocess.TimeoutExpired(command, timeout)
        try:
          stdout, stderr = process.communicate(timeout=min(0.1, remaining)
                                              if remaining is not None else 0.1)
          cancel.check()
          return subprocess.CompletedProcess(command, process.returncode, stdout, stderr)
        except subprocess.TimeoutExpired:
          if deadline is not None and time.monotonic() >= deadline:
            raise
    except BaseException:
      # Kill the group even if its leader exited while children still run.
      try:
        os.killpg(process.pid, signal.SIGKILL)
      except ProcessLookupError:
        pass
      process.wait()
      raise


def execute(command, root, env, timeout, log, *, cancel=None):
  cancel = cancel or Cancellation()
  started = time.perf_counter()
  status = 'passed'
  with log.open('wb') as output:
    try:
      code = run_process(command, cancel=cancel, timeout=timeout, cwd=root, env=env,
                         stdout=output, stderr=subprocess.STDOUT).returncode
    except subprocess.TimeoutExpired:
      code, status = 124, 'timeout'
    except OSError as exc:
      output.write(str(exc).encode('utf-8'))
      code, status = 127, 'launch_error'
  if code and status == 'passed':
    status = 'failed'
  text = log.read_text(encoding='utf-8', errors='replace')
  summaries = re.findall(r'^Ran (\d+) tests? in ', text, flags=re.MULTILINE)
  tests = int(summaries[-1]) if summaries else None
  # Keep strict suite acceptance and make missing result summaries visible.
  if code == 0 and '--suite' in command and (
      not tests or re.search(r'^OK \(skipped=', text, re.MULTILINE)):
    code, status = 1, 'invalid_suite_result'
  return {'returncode': code, 'status': status, 'tests': tests,
          'seconds': round(time.perf_counter() - started, 4)}


def schedule(checks, roots, temp_roots, output, timeout, execute_fn=None, *, cancel=None):
  cancel = cancel or Cancellation()
  execute_fn = execute_fn or partial(execute, cancel=cancel)
  pending = queue.Queue()
  for index, check in enumerate(checks):
    pending.put((index, check))
  stopped = threading.Event()
  lock = threading.Lock()
  results = []
  def worker(worker_id):
    env = dict(os.environ)
    env.pop('HOOK_UNDER_TEST', None)
    env['TMPDIR'] = str(temp_roots[worker_id])
    while True:
      with lock:
        if stopped.is_set() or cancel.signum is not None:
          return
        try:
          index, (name, command, overrides) = pending.get_nowait()
        except queue.Empty:
          return
      log_name = f'phase-{index + 1:02d}.log'
      result = execute_fn(command, roots[worker_id], {**env, **overrides},
                          timeout, output / log_name)
      result.update(index=index + 1, name=name, worker=worker_id + 1, log=log_name)
      with lock:
        results.append(result)
        if result['returncode']:
          stopped.set()
  with concurrent.futures.ThreadPoolExecutor(max_workers=len(roots)) as pool:
    list(pool.map(worker, range(len(roots))))
  cancel.check()
  results.sort(key=lambda result: result['index'])
  return results


def run(repo, output, jobs, revision='HEAD', *, cancel=None):
  cancel = cancel or Cancellation()
  def git(*args):
    result = run_process(['git', *map(str, args)], cancel=cancel,
                         stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    result.check_returncode()
    return result.stdout
  # Resolve before any checkout; never run against a moving shared working tree.
  sha = git('-C', repo, 'rev-parse', '--verify', revision + '^{commit}').strip()
  output.mkdir(parents=True, exist_ok=False)
  cancel.result_path = output / 'result.json'
  started_at, started = utc(), time.perf_counter()
  with tempfile.TemporaryDirectory(prefix='offline-trial-') as temporary:
    temporary = Path(temporary)
    roots, temp_roots = [], []
    for worker in range(jobs):
      root = temporary / f'worker-{worker}'
      git('clone', '--quiet', '--no-hardlinks', '--no-checkout', repo, root)
      git('-C', root, 'checkout', '--quiet', '--detach', sha)
      roots.append(root)
      temp_root = temporary / f'tmp-{worker}'
      temp_root.mkdir()
      temp_roots.append(temp_root)
    setup_seconds = time.perf_counter() - started
    cancel.check()
    runner = load_runner(roots[0])
    errors = runner.preflight()
    if errors:
      report = {'source_sha': sha, 'status': 'blocked', 'preflight_errors': errors,
                'phases': [], 'jobs': jobs, 'started_utc': started_at}
    else:
      checks = runner.phases(roots[0])
      results = schedule(checks, roots, temp_roots, output, runner.TIMEOUT, cancel=cancel)
      dirty = []
      for index, root in enumerate(roots):
        # Tracked-file mutation would invalidate comparisons against the named commit.
        if git('-C', root, 'status', '--porcelain', '--untracked-files=no'):
          dirty.append(index + 1)
      complete = len(results) == len(checks)
      passed = complete and not dirty and all(p['returncode'] == 0 for p in results)
      report = {'source_sha': sha, 'status': 'passed' if passed else 'failed',
                'jobs': jobs, 'started_utc': started_at, 'expected_phases': len(checks),
                'not_run_phases': sorted(set(range(1, len(checks) + 1)) -
                                         {p['index'] for p in results}),
                'mutated_workers': dirty, 'tests': sum(p['tests'] or 0 for p in results),
                'phases': results}
  cancel.check()
  report.update(finished_utc=utc(), setup_seconds=round(setup_seconds, 4),
                total_seconds=round(time.perf_counter() - started, 4))
  (output / 'result.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
  return report


def main(argv=None):
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--repo', type=Path, default=Path(__file__).resolve().parents[2])
  parser.add_argument('--output', type=Path, required=True)
  parser.add_argument('--jobs', type=int, choices=(1, 2), required=True)
  parser.add_argument('--revision', default='HEAD')
  args = parser.parse_args(argv)
  cancel = Cancellation()
  with cancel.signals():
    try:
      report = run(args.repo.resolve(), args.output.resolve(), args.jobs, args.revision,
                   cancel=cancel)
      cancel.check()
    except Interrupted as exc:
      # Only this invocation's newly created output is ours to invalidate.
      if cancel.result_path is not None:
        cancel.result_path.unlink(missing_ok=True)
      print(f'INTERRUPTED: {exc}; active process groups stopped, temporary copies removed',
            file=sys.stderr)
      return 128 + exc.signum
    except (OSError, subprocess.SubprocessError, ImportError) as exc:
      print(f'BLOCKED: {exc}', file=sys.stderr)
      return 2
  print(json.dumps({key: value for key, value in report.items() if key != 'phases'}, indent=2))
  return 0 if report['status'] == 'passed' else 1


if __name__ == '__main__':
  raise SystemExit(main())
