"""Regressions for the shared Bash/backend launch helpers.

These use the same real executables the Hook tests use; no JSON is simulated.
They cover startup selection, missing or failed dependencies, backend pinning,
UTF-8 JSON, and a working directory whose name contains spaces.
"""
import json
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import tempfile
import unittest
from unittest import mock

try:
  import hook_test_support as support
except ImportError:  # imported as tests.test_hook_test_support
  from tests import hook_test_support as support


def write_trace_wrapper(path, target, marker):
  """Wrapper that records one call and delegates to the same real CLI."""
  script = ('#!/bin/bash\nprintf \'call\\n\' >> %s\nexec %s "$@"\n'
            % (shlex.quote(support.shell_path(marker)),
               shlex.quote(support.shell_path(target))))
  Path(path).write_text(script, encoding='utf-8', newline='\n')
  Path(path).chmod(0o755)


class BashSelectionTests(unittest.TestCase):
  def setUp(self):
    self.tmp = tempfile.TemporaryDirectory()
    self.addCleanup(self.tmp.cleanup)
    self.base = Path(self.tmp.name)

  def test_explicit_bash_is_selected_over_path(self):
    real = support.select_bash()
    self.assertEqual(Path(support.select_bash(real)).resolve(), Path(real).resolve())

  def test_missing_bash_on_path_is_a_clear_error(self):
    with mock.patch.object(support.shutil, 'which', return_value=None), \
         mock.patch.dict(os.environ, {'BASH_UNDER_TEST': ''}):
      with self.assertRaises(support.HookTestEnvironmentError) as raised:
        support.select_bash()
    self.assertIn('bash', str(raised.exception).lower())

  def test_missing_explicit_bash_is_a_clear_error(self):
    missing = str(self.base / 'no-such-bash')
    with self.assertRaises(support.HookTestEnvironmentError) as raised:
      support.select_bash(missing)
    self.assertIn('BASH_UNDER_TEST', str(raised.exception))

  def test_directory_as_explicit_bash_is_a_clear_error(self):
    with self.assertRaises(support.HookTestEnvironmentError):
      support.select_bash(str(self.base))

  def test_bash_startup_failure_is_a_clear_error(self):
    fake = self.base / 'bash-stub'
    fake.write_text('#!/bin/sh\nexit 7\n', encoding='utf-8', newline='\n')
    fake.chmod(0o755)
    # On native Windows no shebang script is executable, so the launch itself
    # fails; either way the selected Bash is not silently replaced.
    with self.assertRaises(support.HookTestEnvironmentError) as raised:
      support.select_bash(str(fake))
    self.assertIn('bash', str(raised.exception).lower())


class ParserSelectionTests(unittest.TestCase):
  def test_unknown_parser_is_rejected(self):
    with self.assertRaises(support.HookTestEnvironmentError):
      support.select_parser('node')

  def test_missing_requested_parser_is_a_clear_error(self):
    with mock.patch.object(support.shutil, 'which', return_value=None):
      with self.assertRaises(support.HookTestEnvironmentError) as raised:
        support.select_parser('jq')
    self.assertIn('jq', str(raised.exception))


class IsolationTests(unittest.TestCase):
  def setUp(self):
    self.tmp = tempfile.TemporaryDirectory()
    self.addCleanup(self.tmp.cleanup)
    # Deliberately build the fixture under a path with spaces.
    self.base = Path(self.tmp.name) / 'dir with spaces'
    self.root = self.base / 'project'
    self.root.mkdir(parents=True)
    self.rules = self.base / 'rules'
    self.rules.write_text('deny dist/*\n', encoding='utf-8')

  def test_wrappers_run_real_cat_and_parser(self):
    bin_dir, parser, _ = support.isolated_bin(self.base, 'python3')
    env = support.hook_env(bin_dir, self.root, self.rules)
    cat = subprocess.run([support.resolve_bash(), '-c', 'printf "x y" | cat'],
                         text=True, encoding='utf-8', capture_output=True,
                         env=env, cwd=str(self.root), timeout=30)
    self.assertEqual((cat.returncode, cat.stdout), (0, 'x y'), cat.stderr)
    parsed = subprocess.run(
        [support.resolve_bash(), '-c', 'python3 -c "import sys;print(sys.argv[1])" "a b"'],
        text=True, encoding='utf-8', capture_output=True, env=env,
        cwd=str(self.root), timeout=30)
    self.assertEqual((parsed.returncode, parsed.stdout), (0, 'a b\n'), parsed.stderr)
    self.assertEqual(parser, 'python3')

  def test_isolated_path_hides_the_other_backend(self):
    bin_dir, _, _ = support.isolated_bin(self.base, 'python3')
    env = support.hook_env(bin_dir, self.root, self.rules)
    bash = support.resolve_bash()
    found = subprocess.run([bash, '-c', 'command -v jq'], text=True,
                           encoding='utf-8', capture_output=True, env=env,
                           cwd=str(self.root), timeout=30)
    self.assertNotEqual(found.returncode, 0)
    self.assertEqual(found.stdout, '')
    pinned = subprocess.run([bash, '-c', 'command -v python3'], text=True,
                            encoding='utf-8', capture_output=True, env=env,
                            cwd=str(self.root), timeout=30)
    self.assertEqual(pinned.returncode, 0)


class HookBackendIntegrationTests(unittest.TestCase):
  def setUp(self):
    self.tmp = tempfile.TemporaryDirectory()
    self.addCleanup(self.tmp.cleanup)
    self.base = Path(self.tmp.name) / 'dir with spaces'
    self.root = self.base / '项目 目录'
    self.root.mkdir(parents=True)
    self.rules = self.base / 'rules'
    self.rules.write_text('deny dist/* 中文原因\n', encoding='utf-8')

  def launch(self, bin_dir, event):
    env = support.hook_env(bin_dir, self.root, self.rules)
    raw = json.dumps(event, ensure_ascii=False)
    return subprocess.run([support.resolve_bash(), str(support.hook_under_test())],
                          input=raw, text=True, encoding='utf-8',
                          capture_output=True, env=env, cwd=str(self.root), timeout=30)

  def test_utf8_json_in_directory_with_spaces(self):
    bin_dir, _, _ = support.isolated_bin(self.base, 'python3')
    result = self.launch(bin_dir, {'tool_input': {'file_path': 'dist/文件 with spaces.txt'}})
    self.assertEqual((result.returncode, result.stderr), (0, ''))
    decision = json.loads(result.stdout)['hookSpecificOutput']
    self.assertEqual(decision['permissionDecision'], 'deny')
    self.assertEqual(decision['permissionDecisionReason'], '中文原因')

  def test_requested_python3_backend_is_the_one_called(self):
    bin_dir, _, target = support.isolated_bin(self.base, 'python3')
    marker = self.base / 'calls'
    write_trace_wrapper(bin_dir / 'python3', target, marker)
    result = self.launch(bin_dir, {'tool_input': {'file_path': 'dist/x'}})
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertTrue(marker.read_text(encoding='utf-8').splitlines())

  @unittest.skipUnless(shutil.which('jq'), 'jq is not installed; the jq backend was not run')
  def test_jq_is_preferred_when_both_backends_are_visible(self):
    bin_dir, _, jq_target = support.isolated_bin(self.base, 'jq')
    python_target = shutil.which('python3')
    self.assertIsNotNone(python_target)
    support.write_wrapper(bin_dir / 'python3', python_target)
    jq_marker = self.base / 'jq-calls'
    python_marker = self.base / 'python-calls'
    write_trace_wrapper(bin_dir / 'jq', jq_target, jq_marker)
    write_trace_wrapper(bin_dir / 'python3', python_target, python_marker)
    result = self.launch(bin_dir, {'tool_input': {'file_path': 'dist/x'}})
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertTrue(jq_marker.read_text(encoding='utf-8').splitlines())
    self.assertFalse(python_marker.exists())


if __name__ == '__main__':
  unittest.main(verbosity=2)
