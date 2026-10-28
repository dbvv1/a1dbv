import importlib.util
import json
import os
import shutil
import signal
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
    with mock.patch.object(trial, 'run_process',
                           return_value=subprocess.CompletedProcess([], 0, 'abc\n', '')), \
         mock.patch.object(trial, 'schedule') as schedule:
      marker = self.root / 'keep.txt'
      marker.write_text('keep')
      with self.assertRaises(FileExistsError):
        trial.run(self.root, self.root, 1)
      self.assertEqual(marker.read_text(), 'keep')
      schedule.assert_not_called()


  def test_cancel_before_launch_and_signal_handlers_restored(self):
    cancel = trial.Cancellation()
    before = {sig: signal.getsignal(sig) for sig in (signal.SIGINT, signal.SIGTERM)}
    with cancel.signals():
      cancel.receive(signal.SIGTERM, None)
      cancel.receive(signal.SIGINT, None)
      with mock.patch.object(trial.subprocess, 'Popen') as popen:
        with self.assertRaises(trial.Interrupted) as caught:
          trial.run_process(self.command('pass'), cancel=cancel)
        self.assertEqual(caught.exception.signum, signal.SIGTERM)
        popen.assert_not_called()
    self.assertEqual(before, {sig: signal.getsignal(sig) for sig in before})

  def test_interrupt_before_output_creation_preserves_existing_report(self):
    report = self.root / 'result.json'
    report.write_text('keep')
    with mock.patch.object(trial, 'run', side_effect=trial.Interrupted(signal.SIGTERM)):
      code = trial.main(['--repo', str(self.root), '--jobs', '1',
                         '--output', str(self.root)])
    self.assertEqual(code, 143)
    self.assertEqual(report.read_text(), 'keep')


class ProcessTests(unittest.TestCase):
  """Run a real CLI against a tiny committed repository, never the whole suite."""
  def setUp(self):
    self.tmp = tempfile.TemporaryDirectory()
    self.addCleanup(self.tmp.cleanup)
    self.root = Path(self.tmp.name)
    self.repo = self.root / 'repo'
    self.repo.mkdir()
    self.tmpdir = self.root / 'temporary'
    self.tmpdir.mkdir()
    self.markers = self.root / 'markers'
    self.markers.mkdir()
    self.output = self.root / 'output'
    self.env = {**os.environ, 'TMPDIR': str(self.tmpdir),
                'TRIAL_MARKERS': str(self.markers)}
    self.process = None
    self.addCleanup(self.stop_processes)
    self.git('init', '--quiet')
    self.git('config', 'user.name', 'Regression fixture')
    self.git('config', 'user.email', 'fixture@users.noreply.github.com')

  def git(self, *args):
    return subprocess.run(['git', '-C', str(self.repo), *args], check=True,
                          capture_output=True, text=True)

  def fixture(self, mode='running', timeout=20):
    (self.repo / 'scripts').mkdir()
    (self.repo / 'scripts/check_offline.py').write_text(
      'import os, sys\n'
      f'TIMEOUT = {timeout!r}\n'
      'def preflight(): return []\n'
      'def phases(root):\n'
      f'  return [(str(i), (sys.executable, "phase.py", str(i), {mode!r}), {{}}) '
      'for i in range(3)]\n')
    (self.repo / 'phase.py').write_text(
      'import json, os, subprocess, sys, time\n'
      'from pathlib import Path\n'
      'mode = sys.argv[2]\n'
      'if mode in ("success", "failure"):\n'
      '  raise SystemExit(7 if mode == "failure" else 0)\n'
      'child = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(60)"])\n'
      'marker = Path(os.environ["TRIAL_MARKERS"]) / (sys.argv[1] + ".json")\n'
      'marker.write_text(json.dumps({"pid": os.getpid(), "child": child.pid, '
      '"cwd": os.getcwd(), "tmp": os.environ["TMPDIR"]}))\n'
      'child.wait()\n')
    self.git('add', '.')
    self.git('commit', '--quiet', '-m', 'Synthetic process cleanup fixture')

  def start(self, script=None):
    script = script or Path(trial.__file__)
    self.process = subprocess.Popen(
      [sys.executable, str(script), '--repo', str(self.repo), '--jobs', '2',
       '--output', str(self.output)], env=self.env, start_new_session=True,
      stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return self.process

  def wait_markers(self, count=2):
    deadline = time.monotonic() + 8
    while time.monotonic() < deadline:
      try:
        markers = [json.loads(p.read_text()) for p in self.markers.glob('*.json')]
      except json.JSONDecodeError:
        markers = []
      if len(markers) >= count:
        return markers
      if self.process.poll() is not None:
        self.fail('CLI exited before fixture became ready: ' + repr(self.process.communicate()))
      time.sleep(0.01)
    self.fail('Fixture did not become ready')

  @staticmethod
  def running(pid):
    # A killed orphan may await init reaping; a zombie is not a running child.
    stat = Path(f'/proc/{pid}/stat')
    try:
      if stat.exists():
        return stat.read_text().split(') ', 1)[1].split()[0] != 'Z'
      os.kill(pid, 0)
      return True
    except ProcessLookupError:
      return False
    except FileNotFoundError:
      return False

  def stop_processes(self):
    # Also bounds failures against the pre-fix implementation.
    if self.process is not None:
      if self.process.poll() is None:
        os.killpg(self.process.pid, signal.SIGKILL)
      self.process.communicate(timeout=5)
    for marker in self.markers.glob('*.json'):
      data = json.loads(marker.read_text())
      try:
        os.killpg(data['pid'], signal.SIGKILL)
      except ProcessLookupError:
        pass

  def assert_clean(self, markers):
    self.assertEqual(list(self.tmpdir.iterdir()), [])
    deadline = time.monotonic() + 3
    pids = [p for marker in markers for p in (marker['pid'], marker['child'])]
    while any(self.running(pid) for pid in pids) and time.monotonic() < deadline:
      time.sleep(0.01)
    self.assertFalse([pid for pid in pids if self.running(pid)])
    for marker in markers:
      self.assertFalse(Path(marker['cwd']).exists())
      self.assertFalse(Path(marker['tmp']).exists())

  def interrupted(self, sig):
    self.fixture()
    process = self.start()
    markers = self.wait_markers()
    process.send_signal(sig)
    stdout, stderr = process.communicate(timeout=5)
    self.assertEqual(process.returncode, 128 + sig, (stdout, stderr))
    self.assertIn('INTERRUPTED:', stderr)
    self.assertFalse((self.output / 'result.json').exists())
    self.assertFalse((self.markers / '2.json').exists())
    self.assertEqual(len(list(self.output.glob('phase-*.log'))), 2)
    self.assert_clean(markers)

  def test_signal_at_result_write_cannot_leave_passed_report(self):
    self.fixture('success')
    original = Path.write_text
    original_unlink = Path.unlink
    for timing in ('before', 'after'):
      with self.subTest(timing=timing):
        output = self.root / timing
        def write(path, *args, **kwargs):
          is_result = path == output / 'result.json'
          if is_result and timing == 'before':
            os.kill(os.getpid(), signal.SIGTERM)
          result = original(path, *args, **kwargs)
          if is_result and timing == 'after':
            os.kill(os.getpid(), signal.SIGTERM)
          return result
        def unlink(path, *args, **kwargs):
          if path == output / 'result.json':
            self.assertIsInstance(signal.getsignal(signal.SIGTERM).__self__,
                                  trial.Cancellation)
            os.kill(os.getpid(), signal.SIGTERM)
          return original_unlink(path, *args, **kwargs)
        with mock.patch.object(Path, 'write_text', write), \
             mock.patch.object(Path, 'unlink', unlink):
          code = trial.main(['--repo', str(self.repo), '--jobs', '2',
                             '--output', str(output)])
        self.assertEqual(code, 143)
        self.assertFalse((output / 'result.json').exists())

  def test_external_sigterm_stops_two_workers_and_children(self):
    self.interrupted(signal.SIGTERM)

  def test_external_sigint_stops_two_workers_and_children(self):
    self.interrupted(signal.SIGINT)

  def test_external_sigterm_during_clone_cleans_setup_group(self):
    self.fixture()
    real_git = shutil.which('git')
    wrappers = self.root / 'bin'
    wrappers.mkdir()
    wrapper = wrappers / 'git'
    wrapper.write_text(f'#!{sys.executable}\n'
      'import os, subprocess, sys\n'
      'if sys.argv[1] == "clone":\n'
      '  from pathlib import Path\n'
      '  target = Path(sys.argv[-1])\n'
      '  target.mkdir(parents=True)\n'
      '  os.chdir(target)\n'
      '  sys.argv = ["phase.py", "setup", "running"]\n'
      f'  exec(Path({str(self.repo / "phase.py")!r}).read_text())\n'
      f'else: os.execv({real_git!r}, [{real_git!r}, *sys.argv[1:]])\n')
    wrapper.chmod(0o755)
    self.env['PATH'] = str(wrappers) + os.pathsep + os.environ['PATH']
    process = self.start()
    markers = self.wait_markers(1)
    process.send_signal(signal.SIGTERM)
    stdout, stderr = process.communicate(timeout=5)
    self.assertEqual(process.returncode, 143, (stdout, stderr))
    self.assertEqual(list(self.tmpdir.iterdir()), [])
    self.assertFalse(self.running(markers[0]['pid']))
    self.assertFalse(self.running(markers[0]['child']))
    self.assertFalse(Path(markers[0]['cwd']).exists())

  def test_timeout_stops_children_and_cleans_copies(self):
    self.fixture(timeout=1)
    process = self.start()
    markers = self.wait_markers()
    stdout, stderr = process.communicate(timeout=5)
    self.assertEqual(process.returncode, 1, (stdout, stderr))
    result = json.loads((self.output / 'result.json').read_text())
    self.assertEqual(result['status'], 'failed')
    self.assertEqual(result['not_run_phases'], [3])
    self.assertTrue(all(p['status'] == 'timeout' for p in result['phases']))
    self.assert_clean(markers)

  def test_success_and_failure_clean_copies(self):
    self.fixture('success')
    process = self.start()
    stdout, stderr = process.communicate(timeout=5)
    self.assertEqual(process.returncode, 0, (stdout, stderr))
    self.assertEqual(list(self.tmpdir.iterdir()), [])
    result = json.loads((self.output / 'result.json').read_text())
    self.assertEqual((result['status'], len(result['phases'])), ('passed', 3))
    self.output = self.root / 'failed-output'
    path = self.repo / 'scripts/check_offline.py'
    path.write_text(path.read_text().replace("'success'", "'failure'"))
    self.git('add', '.')
    self.git('commit', '--quiet', '-m', 'Fail synthetic phases')
    process = self.start()
    stdout, stderr = process.communicate(timeout=5)
    self.assertEqual(process.returncode, 1, (stdout, stderr))
    self.assertEqual(list(self.tmpdir.iterdir()), [])
    result = json.loads((self.output / 'result.json').read_text())
    self.assertEqual(result['status'], 'failed')
    self.assertTrue(result['not_run_phases'])


if __name__ == '__main__':
  unittest.main()
