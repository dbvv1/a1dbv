import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from unittest import mock

SPEC = importlib.util.spec_from_file_location('trial', Path(__file__).with_name('trial.py'))
trial = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(trial)


class TrialTests(unittest.TestCase):
  def setUp(self):
    self.tmp = tempfile.TemporaryDirectory()
    self.addCleanup(self.tmp.cleanup)
    self.root = Path(self.tmp.name)

  def command(self, body):
    return (sys.executable, '-c', body)

  def execute(self, body, timeout=3):
    return trial.execute(self.command(body), self.root, dict(os.environ),
                         timeout, self.root / 'command.log')

  def test_real_success_failure_and_timeout(self):
    self.assertEqual(self.execute('print("ok")')['status'], 'passed')
    self.assertEqual(self.execute('raise SystemExit(7)')['returncode'], 7)
    self.assertEqual(self.execute('import time; time.sleep(5)', 0.05)['status'], 'timeout')

  def test_missing_executable_is_a_failure(self):
    result = trial.execute((str(self.root / 'absent'),), self.root, dict(os.environ),
                           1, self.root / 'missing.log')
    self.assertEqual(result['status'], 'launch_error')

  def test_suite_timeout_and_launch_error_keep_original_diagnosis(self):
    timeout = trial.execute((*self.command('import time; time.sleep(5)'), '--suite'),
                            self.root, dict(os.environ), 0.05, self.root / 'timeout.log')
    self.assertEqual((timeout['status'], timeout['returncode']), ('timeout', 124))
    missing = trial.execute((str(self.root / 'absent'), '--suite'), self.root,
                            dict(os.environ), 1, self.root / 'missing-suite.log')
    self.assertEqual((missing['status'], missing['returncode']), ('launch_error', 127))

  def test_strict_suite_summary_missing_zero_or_skipped_rejected(self):
    for text in ('', 'Ran 0 tests in 0.00s\nOK', 'Ran 1 test in 0.00s\nOK (skipped=1)'):
      command = (*self.command(f'print({text!r})'), '--suite')
      result = trial.execute(command, self.root, dict(os.environ), 1, self.root / 'suite.log')
      self.assertEqual(result['status'], 'invalid_suite_result')
    command = (*self.command('print("Ran 3 tests in 0.01s\\nOK")'), '--suite')
    self.assertEqual(trial.execute(command, self.root, dict(os.environ), 1,
                                  self.root / 'suite.log')['tests'], 3)

  def test_bounded_parallel_all_phases_once_and_separate_temp_roots(self):
    lock = threading.Lock()
    barrier = threading.Barrier(2)
    active = 0
    peak = 0
    seen = []
    roots = [self.root / 'a', self.root / 'b']
    temps = [self.root / 'tmp-a', self.root / 'tmp-b']
    def fake(command, root, env, timeout, log):
      nonlocal active, peak
      with lock:
        active += 1
        peak = max(peak, active)
        seen.append((command, root, env['TMPDIR'], env.get('HOOK_UNDER_TEST')))
      barrier.wait(timeout=3)
      with lock:
        active -= 1
      return {'returncode': 0, 'tests': 1, 'status': 'passed', 'seconds': 0}
    checks = [(str(i), (str(i),), {}) for i in range(4)]
    with mock.patch.dict(os.environ, {'HOOK_UNDER_TEST': '/example/hook'}):
      results = trial.schedule(checks, roots, temps, self.root, 1, fake)
    self.assertEqual(peak, 2)
    self.assertEqual([r['index'] for r in results], [1, 2, 3, 4])
    self.assertEqual(len({entry[0] for entry in seen}), 4)
    for _, root, temp, hook in seen:
      self.assertEqual(temp, str(temps[roots.index(root)]))
      self.assertIsNone(hook)

  def test_failure_stops_pending_but_collects_inflight(self):
    running = threading.Event()
    release = threading.Event()
    def fake(command, root, env, timeout, log):
      if command == ('fail',):
        running.wait(3)
        release.set()
        return {'returncode': 1, 'tests': 1, 'status': 'failed', 'seconds': 0}
      running.set()
      release.wait(3)
      time.sleep(0.02)
      return {'returncode': 0, 'tests': 1, 'status': 'passed', 'seconds': 0}
    results = trial.schedule([('failure', ('fail',), {}), ('inflight', ('pass',), {}),
                              ('pending', ('not-run',), {})],
                             [self.root, self.root], [self.root, self.root], self.root, 1, fake)
    self.assertEqual([r['name'] for r in results], ['failure', 'inflight'])

  def test_missing_repo_and_existing_output_do_not_run(self):
    with mock.patch.object(trial, 'schedule') as schedule:
      self.assertEqual(trial.main(['--repo', str(self.root / 'absent'), '--jobs', '1',
                                   '--output', str(self.root / 'output')]), 2)
      schedule.assert_not_called()

  def test_existing_output_is_not_overwritten(self):
    with mock.patch.object(trial.subprocess, 'check_output', return_value='abc\n'), \
         mock.patch.object(trial, 'schedule') as schedule:
      marker = self.root / 'keep.txt'
      marker.write_text('keep')
      with self.assertRaises(FileExistsError):
        trial.run(self.root, self.root, 1)
      self.assertEqual(marker.read_text(), 'keep')
      schedule.assert_not_called()


if __name__ == '__main__':
  unittest.main()
