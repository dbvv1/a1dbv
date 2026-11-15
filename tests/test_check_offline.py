"""Runner regressions, including real short-lived children; never recurse the suite."""
from collections import Counter
import contextlib
import importlib.util
import io
import os
from pathlib import Path
import signal
import subprocess
import tempfile
import time
import unittest
from unittest import mock

SPEC = importlib.util.spec_from_file_location(
  'check_offline', Path(__file__).resolve().parents[1] / 'scripts/check_offline.py')
runner = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(runner)


class OfflineChecksTests(unittest.TestCase):
  def invoke(self, result=0, errors=()):
    output = io.StringIO()
    checks = [('first', ('python', 'one.py'), {'TEST_PARSER': 'python3'}),
              ('second', ('python', 'two.py'), {'TEST_PARSER': 'jq'})]
    with mock.patch.object(runner.sys, 'argv', ['check_offline.py']), \
         mock.patch.object(runner, 'preflight', return_value=errors), \
         mock.patch.object(runner, 'phases', return_value=checks), \
         mock.patch.object(runner, 'run_process') as run, \
         mock.patch.dict(os.environ, {'HOOK_UNDER_TEST': '/external/hook'}), \
         contextlib.redirect_stdout(output), contextlib.redirect_stderr(output):
      if isinstance(result, Exception):
        run.side_effect = result
      else:
        run.return_value = result
      code = runner.main()
    return code, run, output.getvalue()

  def test_success_streams_commands_and_scopes_backends(self):
    code, run, output = self.invoke()
    self.assertEqual(code, 0)
    self.assertEqual(run.call_count, 2)
    for call, backend in zip(run.call_args_list, ['python3', 'jq']):
      self.assertEqual(call.kwargs['env']['TEST_PARSER'], backend)
      self.assertNotIn('HOOK_UNDER_TEST', call.kwargs['env'])
      self.assertEqual(call.kwargs['timeout'], runner.TIMEOUT)
      self.assertEqual(call.kwargs['cwd'], runner.ROOT)
    self.assertIn('$ python one.py', output)
    self.assertIn('not model', output)

  def test_failure_stops_later_phases(self):
    for result in [7, -9, OSError('unavailable'), subprocess.TimeoutExpired('cmd', 120)]:
      with self.subTest(result=result):
        code, run, output = self.invoke(result)
        self.assertEqual(code, 1)
        self.assertEqual(run.call_count, 1)
        self.assertIn('later phases not run', output)
        self.assertNotIn('Offline commands passed', output)

  def test_preflight_blocks_without_running(self):
    code, run, output = self.invoke(errors=['missing required commands: jq'])
    self.assertEqual(code, 2)
    run.assert_not_called()
    self.assertIn('BLOCKED', output)

  def test_each_required_dependency_is_checked(self):
    for command in runner.REQUIRED:
      with self.subTest(command=command), mock.patch.object(
          runner.shutil, 'which', side_effect=lambda name: None if name == command else '/bin/tool'):
        self.assertTrue(any(command in error for error in runner.preflight()))

  def test_old_python_and_unsupported_platform_block(self):
    with mock.patch.object(runner.sys, 'version_info', (3, 10)), \
         mock.patch.object(runner.os, 'name', 'nt'), \
         mock.patch.object(runner.shutil, 'which', return_value='/bin/tool'):
      self.assertEqual(len(runner.preflight()), 2)

  def test_explicit_phase_scope_and_shell_discovery(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / '.git').mkdir()
      (root / '.git/ignored.sh').touch()
      (root / 'with spaces.sh').touch()
      checks = runner.phases(root)
    self.assertEqual(len(checks), 9)
    self.assertEqual(runner.TIMEOUT, 120)
    for check, group in zip(checks[1:3], ('general', 'catalog-compare')):
      self.assertEqual(check[1], (runner.sys.executable, 'scripts/check_offline.py',
                                 '--suite', 'tests', 'test*.py', group))
      self.assertEqual(check[2], {'TEST_PARSER': 'python3'})
    self.assertEqual(checks[3][2], {'TEST_PARSER': 'jq'})
    self.assertEqual(checks[3][1][-1], 'test_protect*.py')
    self.assertIn('experiments/workflow-ablation/evaluator', checks[4][1])
    self.assertEqual(checks[4][1][-1], 'selftest.py')
    self.assertIn('experiments/context-results-audit', checks[5][1])
    self.assertIn('experiments/recovery-outcome', checks[6][1])
    self.assertEqual(checks[7][1][-1], 'scripts/check_public.py')
    self.assertEqual(checks[-1][1], ('bash', '-n', 'with spaces.sh'))

  def test_installed_dependency_shell_scripts_are_excluded(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      for relative in ('node_modules/pkg/inc-version.sh',
                       'app/node_modules/pkg/test/ts/transpile.sh',
                       'node_modules-guide/example.sh',
                       'scripts/own.sh',
                       'node_modules.sh'):
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.touch()
      checks = runner.phases(root)
    shell = [Path(check[1][-1]) for check in checks[8:]]
    self.assertEqual(shell, [Path('node_modules-guide/example.sh'),
                             Path('node_modules.sh'),
                             Path('scripts/own.sh')])
    self.assertEqual(len(checks), 11)

  def test_git_still_excluded_from_shell_discovery(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / '.git/hooks').mkdir(parents=True)
      (root / '.git/hooks/sample.sh').touch()
      (root / 'nested/.git/keep.sh').parent.mkdir(parents=True)
      (root / 'nested/.git/keep.sh').touch()
      checks = runner.phases(root)
    self.assertEqual(len(checks), 8)

  def test_no_shell_files_still_returns_base_phases(self):
    with tempfile.TemporaryDirectory() as directory:
      checks = runner.phases(Path(directory))
    self.assertEqual(len(checks), 8)
    self.assertEqual(checks[7][1][-1], 'scripts/check_public.py')

  def test_process_output_is_inherited_and_timeout_kills_group(self):
    with mock.patch.object(runner.subprocess, 'Popen') as popen, \
         mock.patch.object(runner.os, 'killpg') as kill:
      process = popen.return_value.__enter__.return_value
      process.pid = 12345
      process.wait.side_effect = [subprocess.TimeoutExpired('cmd', 5), 0]
      with self.assertRaises(subprocess.TimeoutExpired):
        runner.run_process(('cmd',), cwd=runner.ROOT, env={}, timeout=5)
      kill.assert_called_once_with(12345, signal.SIGKILL)
      self.assertEqual(process.wait.call_count, 2)
      self.assertEqual(popen.call_args.kwargs,
                       {'cwd': runner.ROOT, 'env': {}, 'start_new_session': True})


  def test_real_process_exit_codes_and_missing_command(self):
    with tempfile.TemporaryDirectory() as directory:
      for code in (0, 7):
        with self.subTest(code=code):
          self.assertEqual(runner.run_process(
            (runner.sys.executable, '-c', f'raise SystemExit({code})'),
            cwd=directory, env=dict(os.environ), timeout=2), code)
      with self.assertRaises(FileNotFoundError):
        runner.run_process((str(Path(directory) / 'missing-executable'),),
                           cwd=directory, env=dict(os.environ), timeout=2)

  def test_real_timeout_closes_same_group_child_descriptor(self):
    self.assert_real_group_descriptor_closes(interrupt=False)

  def test_real_interrupt_closes_same_group_child_descriptor(self):
    self.assert_real_group_descriptor_closes(interrupt=True)

  def assert_real_group_descriptor_closes(self, *, interrupt):
    # EOF proves that no process retains the child's write descriptor. Merely
    # checking the leader exit code misses surviving children. EOF does not
    # establish reaping: a killed child may still be a zombie.
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      fifo = root / 'child-output'
      os.mkfifo(fifo)
      child = root / 'child.py'
      child.write_text(r"""import os, sys, time
from pathlib import Path
root = Path(sys.argv[1])
descriptor = os.open(root / 'child-output', os.O_WRONLY | os.O_NONBLOCK)
with os.fdopen(descriptor, 'wb', buffering=0) as output:
  output.write(b'child-ready\n')
  (root / 'ready').write_text(str(os.getpgrp()))
  deadline = time.monotonic() + 30
  while time.monotonic() < deadline and root.exists() and not (root / 'stop').exists():
    time.sleep(0.02)
""")
      parent = root / 'parent.py'
      parent.write_text("""import os, subprocess, sys
from pathlib import Path
root = Path(sys.argv[1])
(root / 'group').write_text(str(os.getpgrp()))
subprocess.run([sys.executable, str(root / 'child.py'), str(root)], check=True)
""")
      descriptor = os.open(fifo, os.O_RDONLY | os.O_NONBLOCK)
      try:
        started = time.monotonic()
        if interrupt:
          wrapper = root / 'wrapper.py'
          wrapper.write_text("""import importlib.util, os, sys
from pathlib import Path
spec = importlib.util.spec_from_file_location('runner', sys.argv[1])
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
root = Path(sys.argv[2])
try:
  runner.run_process((sys.executable, str(root / 'parent.py'), str(root)),
                     cwd=root, env=dict(os.environ), timeout=20)
except KeyboardInterrupt:
  (root / 'interrupted').touch()
  raise SystemExit(130)
""")
          with subprocess.Popen(
              (runner.sys.executable, str(wrapper), runner.__file__, str(root)),
              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) as process:
            try:
              deadline = time.monotonic() + 5
              while not (root / 'ready').exists():
                if process.poll() is not None or time.monotonic() >= deadline:
                  self.fail('child did not become ready before interrupt')
                time.sleep(0.01)
              process.send_signal(signal.SIGINT)
              self.assertEqual(process.wait(timeout=2), 130)
              self.assertTrue((root / 'interrupted').exists())
            finally:
              if process.poll() is None:
                process.kill()
                process.wait()

        else:
          with self.assertRaises(subprocess.TimeoutExpired):
            runner.run_process((runner.sys.executable, str(parent), str(root)),
                               cwd=root, env=dict(os.environ), timeout=2)
        # A startup failure must not be mistaken for successful cleanup.
        self.assertEqual((root / 'ready').read_text(), (root / 'group').read_text())
        self.assertEqual(os.read(descriptor, 4096), b'child-ready\n')
        deadline = time.monotonic() + 1
        while True:
          try:
            self.assertEqual(os.read(descriptor, 4096), b'')
            # Reject a delayed observation that could be the child's own exit.
            self.assertLess(time.monotonic() - started, 10)
            break
          except BlockingIOError:
            if time.monotonic() >= deadline:
              self.fail('child still owns output descriptor after phase termination')
            time.sleep(0.01)
      finally:
        # Also bounds the child if a future regression kills only the leader.
        (root / 'stop').touch()
        os.close(descriptor)


  def suite_ids(self, suite):
    return [test_id for test in suite for test_id in
            (self.suite_ids(test) if isinstance(test, unittest.TestSuite) else [test.id()])]

  def case(self, module, body=lambda self: None):
    return type('SyntheticCase', (unittest.TestCase,),
                {'__module__': module, 'test_case': body})('test_case')

  def assert_partition(self, suite):
    original = Counter(self.suite_ids(suite))
    general = runner.select_tests(suite, catalog_compare=False)
    catalog = runner.select_tests(suite, catalog_compare=True)
    general_ids, catalog_ids = Counter(self.suite_ids(general)), Counter(self.suite_ids(catalog))
    self.assertEqual(general_ids + catalog_ids, original)
    self.assertFalse(general_ids & catalog_ids)
    return general, catalog

  def test_nested_partition_is_exhaustive_disjoint_and_exact_module(self):
    general_case = self.case('test_general')
    catalog_case = self.case('test_verify_catalog_compare')
    similar_case = self.case('test_verify_catalog_compare_extra')
    suite = unittest.TestSuite([unittest.TestSuite(), general_case, unittest.TestSuite([
      unittest.TestSuite([catalog_case, similar_case])])])
    general, catalog = self.assert_partition(suite)
    self.assertEqual(self.suite_ids(general), [general_case.id(), similar_case.id()])
    self.assertEqual(self.suite_ids(catalog), [catalog_case.id()])

  def test_repository_discovery_is_exhaustive_disjoint_and_nonempty(self):
    suite = unittest.TestLoader().discover(str(runner.ROOT / 'tests'), pattern='test*.py')
    general, catalog = self.assert_partition(suite)
    self.assertTrue(general.countTestCases())
    self.assertTrue(catalog.countTestCases())
    self.assertEqual(len(set(self.suite_ids(suite))), suite.countTestCases())
    self.assertTrue(all(test_id.startswith('test_verify_catalog_compare.')
                        for test_id in self.suite_ids(catalog)))

  def test_catalog_import_failure_remains_visible_in_general_phase(self):
    with tempfile.TemporaryDirectory() as directory, \
         mock.patch.dict(runner.sys.modules), \
         mock.patch.object(runner.sys, 'path', list(runner.sys.path)):
      runner.sys.modules.pop('test_verify_catalog_compare', None)
      (Path(directory) / 'test_verify_catalog_compare.py').write_text(
        "raise ImportError('synthetic catalog import failure')\n", encoding='utf-8')
      suite = unittest.TestLoader().discover(directory, pattern='test*.py')
      general, catalog = self.assert_partition(suite)
      self.assertEqual(general.countTestCases(), 1)
      self.assertEqual(catalog.countTestCases(), 0)
      self.assert_strict_result(suite, 1, 'synthetic catalog import failure', group='general')

  def test_each_partition_rejects_zero_skip_and_failure_and_accepts_success(self):
    def skipped(self):
      raise unittest.SkipTest('synthetic missing input')
    def failed(self):
      raise AssertionError('synthetic failure')
    for group, module in [('general', 'test_general'),
                          ('catalog-compare', 'test_verify_catalog_compare')]:
      for body, code, output in [(None, 0, 'OK'), (skipped, 1, 'skipped=1'),
                                 (failed, 1, 'synthetic failure')]:
        with self.subTest(group=group, body=body):
          case = self.case(module) if body is None else self.case(module, body)
          self.assert_strict_result(unittest.TestSuite([case]), code, output, group=group)
      with self.subTest(group=group, empty=True):
        other_module = 'test_general' if group == 'catalog-compare' else 'test_verify_catalog_compare'
        self.assert_strict_result(unittest.TestSuite([self.case(other_module)]),
                                  1, 'ran=0', group=group)

  def test_strict_suite_rejects_zero_tests(self):
    self.assert_strict_result(unittest.TestSuite(), 1, 'ran=0')

  def test_strict_suite_rejects_skip(self):
    def skipped():
      raise unittest.SkipTest('synthetic missing input')
    self.assert_strict_result(unittest.TestSuite([unittest.FunctionTestCase(skipped)]),
                              1, 'skipped=1')

  def test_strict_suite_preserves_failure_and_success(self):
    def failed():
      raise AssertionError('synthetic failure')
    self.assert_strict_result(unittest.TestSuite([unittest.FunctionTestCase(failed)]),
                              1, 'synthetic failure')
    self.assert_strict_result(unittest.TestSuite([unittest.FunctionTestCase(lambda: None)]),
                              0, 'OK')

  def assert_strict_result(self, suite, expected_code, expected_output, group=None):
    output = io.StringIO()
    with mock.patch.object(runner.unittest.TestLoader, 'discover', return_value=suite) as discover, \
         contextlib.redirect_stderr(output):
      code = runner.run_suite('synthetic-directory', 'test*.py', group)
    self.assertEqual(code, expected_code)
    discover.assert_called_once_with('synthetic-directory', pattern='test*.py')
    self.assertIn(expected_output, output.getvalue())

  def test_internal_suite_mode_does_not_run_aggregate(self):
    with mock.patch.object(runner.sys, 'argv', ['check_offline.py', '--suite', 'tests', 'test*.py']), \
         mock.patch.object(runner, 'run_suite', return_value=1) as run_suite, \
         mock.patch.object(runner, 'preflight') as preflight:
      self.assertEqual(runner.main(), 1)
      run_suite.assert_called_once_with('tests', 'test*.py')
      preflight.assert_not_called()

  def test_partition_modes_do_not_run_aggregate(self):
    for group in ('general', 'catalog-compare'):
      with self.subTest(group=group), \
           mock.patch.object(runner.sys, 'argv', ['check_offline.py', '--suite', 'tests',
                                                 'test*.py', group]), \
           mock.patch.object(runner, 'run_suite', return_value=1) as run_suite, \
           mock.patch.object(runner, 'preflight') as preflight:
        self.assertEqual(runner.main(), 1)
        run_suite.assert_called_once_with('tests', 'test*.py', group)
        preflight.assert_not_called()

  def test_unknown_partition_does_not_run(self):
    with mock.patch.object(runner.sys, 'argv', ['check_offline.py', '--suite', 'tests',
                                              'test*.py', 'unknown']), \
         mock.patch.object(runner, 'run_suite') as run_suite, \
         mock.patch.object(runner, 'preflight') as preflight, \
         contextlib.redirect_stderr(io.StringIO()):
      self.assertEqual(runner.main(), 2)
      run_suite.assert_not_called()
      preflight.assert_not_called()

  def test_usage_does_not_run(self):
    with mock.patch.object(runner.sys, 'argv', ['check_offline.py', '--unknown']), \
         mock.patch.object(runner, 'preflight') as preflight, \
         contextlib.redirect_stderr(io.StringIO()):
      self.assertEqual(runner.main(), 2)
      preflight.assert_not_called()


if __name__ == '__main__':
  unittest.main()
