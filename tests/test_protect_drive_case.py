"""Subprocess tests for drive-letter case compatibility in the protect-paths Hook.

Each case runs the real Bash Hook and reads its JSON stdout, so the tests
exercise the consumer entry point instead of a copy of the implementation.
Only the absolute drive letter may be case-folded: directory names, file names,
rule globs and POSIX paths keep their original case.
"""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

try:
  import hook_test_support as support
except ImportError:  # imported as tests.test_protect_drive_case
  from tests import hook_test_support as support

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
HOOK = support.hook_under_test()
BASH = support.resolve_bash()


class DriveCaseTests(unittest.TestCase):
  def setUp(self):
    self.tmp = tempfile.TemporaryDirectory()
    self.addCleanup(self.tmp.cleanup)
    self.base = Path(self.tmp.name)
    self.rules = self.base / 'rules'
    self.rules.write_text('deny dist/* generated\n', encoding='utf-8')
    # Reuse the shared Hook-test mechanism: an isolated PATH containing only
    # cat and the requested parser pins the backend. Do not report an ambient
    # PATH fallback as a successfully pinned parser on native Windows.
    self.bin, self.parser, self.parser_target = support.isolated_bin(
        self.base, os.environ.get('TEST_PARSER'))
    support.verify_isolated_bin(BASH, self.bin, self.base)
    self.env = support.hook_env(self.bin, 'C:/Project', self.rules)

  def run_hook(self, event=None, raw=None):
    if raw is None:
      raw = json.dumps(event)
    return subprocess.run([BASH, str(HOOK)], input=raw, text=True, encoding='utf-8',
                          capture_output=True, env=self.env, cwd=str(self.base), timeout=30)

  def assert_deny(self, path, **extra):
    p = self.run_hook({'tool_input': {'file_path': path}, **extra})
    self.assertEqual(p.returncode, 0, p.stderr)
    self.assertEqual(p.stderr, '')
    self.assertTrue(p.stdout, 'expected a deny decision')
    data = json.loads(p.stdout)['hookSpecificOutput']
    self.assertEqual(data['hookEventName'], 'PreToolUse')
    self.assertEqual(data['permissionDecision'], 'deny')
    self.assertEqual(data['permissionDecisionReason'], 'generated')

  def assert_no_decision(self, path, **extra):
    p = self.run_hook({'tool_input': {'file_path': path}, **extra})
    self.assertEqual((p.returncode, p.stdout, p.stderr), (0, '', ''))

  def test_drive_letter_case_both_directions(self):
    for root, path in [('C:/Project', 'c:/Project/dist/a.js'),
                       ('c:/Project', 'C:/Project/dist/a.js'),
                       ('C:/Project', 'C:/Project/dist/a.js')]:
      with self.subTest(root=root, path=path):
        self.env['CLAUDE_PROJECT_DIR'] = root
        self.assert_deny(path)

  def test_drive_letter_case_in_cwd(self):
    for root, path, cwd in [('C:/Project', 'dist/a.js', 'c:/Project'),
                            ('c:/Project', 'dist/a.js', 'C:/Project'),
                            ('C:/Project', '../dist/a.js', 'c:/Project/src')]:
      with self.subTest(root=root, path=path, cwd=cwd):
        self.env['CLAUDE_PROJECT_DIR'] = root
        self.assert_deny(path, cwd=cwd)

  def test_backslash_variants(self):
    for root, path in [(r'C:\Project', r'c:\Project\dist\a.js'),
                       ('c:/Project', r'C:\Project\dist\a.js'),
                       (r'c:\Project', 'C:/Project/dist/a.js'),
                       (r'C:\Project', r'c:/Project\dist/a.js')]:
      with self.subTest(root=root, path=path):
        self.env['CLAUDE_PROJECT_DIR'] = root
        self.assert_deny(path)

  def test_drive_root(self):
    for root, path in [('C:/', 'c:/dist/a.js'),
                       ('c:/', 'C:/dist/a.js'),
                       ('C:/', 'dist/a.js')]:
      with self.subTest(root=root, path=path):
        self.env['CLAUDE_PROJECT_DIR'] = root
        self.assert_deny(path)

  def test_cross_drive_does_not_match(self):
    for root, path, cwd in [('C:/Project', 'd:/Project/dist/a.js', None),
                            ('c:/Project', 'D:/Project/dist/a.js', None),
                            ('C:/Project', 'dist/a.js', 'd:/Project')]:
      with self.subTest(root=root, path=path, cwd=cwd):
        self.env['CLAUDE_PROJECT_DIR'] = root
        extra = {} if cwd is None else {'cwd': cwd}
        self.assert_no_decision(path, **extra)

  def test_directory_case_is_not_relaxed(self):
    for root, path in [('C:/Project', 'c:/project/dist/a.js'),
                       ('C:/Project', 'c:/PROJECT/dist/a.js'),
                       ('c:/Project', 'C:/Project/Dist/a.js')]:
      with self.subTest(root=root, path=path):
        self.env['CLAUDE_PROJECT_DIR'] = root
        self.assert_no_decision(path)

  def test_posix_paths_remain_case_sensitive(self):
    self.env['CLAUDE_PROJECT_DIR'] = '/project'
    self.assert_deny('/project/dist/a.js')
    for path in ['/Project/dist/a.js', '/project/Dist/a.js']:
      with self.subTest(path=path):
        self.assert_no_decision(path)
    self.env['CLAUDE_PROJECT_DIR'] = '/Project'
    self.assert_no_decision('/project/dist/a.js')

  def test_invalid_and_missing_paths_preserved(self):
    for raw in ['{', '', '{} {}', '[1, 2]', 'null']:
      with self.subTest(raw=raw):
        p = self.run_hook(raw=raw)
        self.assertEqual((p.returncode, p.stdout), (1, ''))
        self.assertTrue(p.stderr)
    for event in [{}, {'tool_input': {}}, {'tool_input': {'file_path': None}},
                  {'tool_input': {'file_path': ''}}]:
      with self.subTest(event=event):
        p = self.run_hook(event)
        self.assertEqual((p.returncode, p.stdout, p.stderr), (0, '', ''))
    p = self.run_hook({'tool_input': {'file_path': 'c:/Project/dist/a\x1fb.js'}})
    self.assertEqual((p.returncode, p.stdout), (1, ''))
    self.assertTrue(p.stderr)


if __name__ == '__main__':
  unittest.main(verbosity=2)
