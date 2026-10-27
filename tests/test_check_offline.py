"""Runner regressions mock execution; never recursively execute the full suite."""
from collections import Counter
import contextlib
import importlib.util
import io
import os
from pathlib import Path
import signal
import subprocess
import tempfile
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
    self.assertIn('experiments/workflow-ablation/evaluator', checks[4][1])
    self.assertEqual(checks[4][1][-1], 'selftest.py')
    self.assertIn('experiments/context-results-audit', checks[5][1])
    self.assertIn('experiments/recovery-outcome', checks[6][1])
    self.assertEqual(checks[7][1][-1], 'scripts/check_public.py')
    self.assertEqual(checks[-1][1], ('bash', '-n', 'with spaces.sh'))

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
