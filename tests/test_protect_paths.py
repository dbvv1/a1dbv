"""Synthetic subprocess tests; no Claude installation or real project writes."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
HOOK = Path(os.environ.get('HOOK_UNDER_TEST', REPO / 'templates/generic/.claude/hooks/protect-paths.sh'))
PARSER = os.environ.get('TEST_PARSER', 'python3')


class HookTests(unittest.TestCase):
  def setUp(self):
    self.tmp = tempfile.TemporaryDirectory()
    self.addCleanup(self.tmp.cleanup)
    self.base = Path(self.tmp.name)
    self.root = self.base / 'project'
    self.root.mkdir()
    self.rules = self.base / 'rules'
    self.rules.write_text('deny dist/* generated\nask *.lock package lock\n', encoding='utf-8')
    self.bin = self.base / 'bin'
    self.bin.mkdir()
    for name in ['cat', PARSER]:
      binary = shutil.which(name)
      if not binary:
        self.skipTest(f'{name} unavailable')
      (self.bin / name).symlink_to(binary)
    self.env = dict(os.environ, PATH=str(self.bin), CLAUDE_PROJECT_DIR=str(self.root),
                    PROTECTED_PATHS_FILE=str(self.rules))

  def run_hook(self, event=None, raw=None):
    if raw is None:
      raw = json.dumps(event)
    return subprocess.run(['/bin/bash', str(HOOK)], input=raw, text=True,
                          capture_output=True, env=self.env, cwd=self.root, timeout=10)

  def event(self, path, **extra):
    return dict(tool_input={'file_path': path}, **extra)

  def decision(self, path, expected='deny', **extra):
    p = self.run_hook(self.event(path, **extra))
    self.assertEqual(p.returncode, 0, p.stderr)
    data = json.loads(p.stdout)['hookSpecificOutput']
    self.assertEqual(data['hookEventName'], 'PreToolUse')
    self.assertEqual(data['permissionDecision'], expected)
    return data

  def test_template_copies_identical(self):
    generic = (REPO / 'templates/generic/.claude/hooks/protect-paths.sh').read_bytes()
    for domain in ['unity', 'unreal']:
      with self.subTest(domain=domain):
        self.assertEqual(generic, (REPO / 'domains/game-dev' / domain /
                                  'templates/.claude/hooks/protect-paths.sh').read_bytes())

  def test_canonical_absolute(self):
    self.decision(str(self.root / 'dist' / 'x'))

  def test_relative(self):
    self.decision('dist/x')

  def test_ask(self):
    self.decision('package.lock', 'ask')

  def test_unmatched(self):
    p = self.run_hook(self.event('src/x'))
    self.assertEqual((p.returncode, p.stdout, p.stderr), (0, '', ''))

  def test_notebook_fallback(self):
    p = self.run_hook({'tool_input': {'notebook_path': 'dist/x.ipynb'}})
    self.assertEqual(json.loads(p.stdout)['hookSpecificOutput']['permissionDecision'], 'deny')

  def test_missing_path(self):
    for event in [{}, {'tool_input': {}}, {'tool_input': {'file_path': None}}]:
      with self.subTest(event=event):
        p = self.run_hook(event)
        self.assertEqual((p.returncode, p.stdout, p.stderr), (0, '', ''))

  def test_missing_rules(self):
    self.rules.unlink()
    p = self.run_hook(raw='{')
    self.assertEqual((p.returncode, p.stdout, p.stderr), (0, '', ''))

  def test_first_match_and_final_line(self):
    self.rules.write_text('# comment\r\n\nask dist/* first\ndeny dist/* second', encoding='utf-8')
    self.decision('dist/x', 'ask')

  def test_lexical_aliases(self):
    for path in ['./dist/x', 'src/../dist/x', 'dist//x',
                 str(self.root) + '/./dist/x', str(self.root) + '/src/../dist/x']:
      with self.subTest(path=path):
        self.decision(path)

  def test_trailing_root_slash(self):
    self.env['CLAUDE_PROJECT_DIR'] += '/'
    self.decision(str(self.root / 'dist' / 'x'))

  def test_relative_event_cwd(self):
    self.decision('../dist/x', cwd=str(self.root / 'src'))

  def test_root_sibling_unmatched(self):
    p = self.run_hook(self.event(str(self.root) + '-other/dist/x'))
    self.assertEqual((p.returncode, p.stdout), (0, ''))

  def test_invalid_json(self):
    for raw in ['{', '', '{} {}', '[1, 2]', 'null', '42']:
      with self.subTest(raw=raw):
        p = self.run_hook(raw=raw)
        self.assertEqual(p.returncode, 1)
        self.assertEqual(p.stdout, '')
        self.assertTrue(p.stderr)

  def test_invalid_field_types(self):
    for event in [{'tool_input': []}, {'tool_input': None},
                  self.event(['dist/x']), self.event({'path': 'dist/x'}),
                  self.event(42), self.event(False), self.event('dist/x', cwd=10)]:
      with self.subTest(event=event):
        p = self.run_hook(event)
        self.assertEqual(p.returncode, 1)
        self.assertEqual(p.stdout, '')
        self.assertTrue(p.stderr)

  def test_control_in_path_is_explicit_error(self):
    for c in ['\x00', '\n', '\t', '\x7f']:
      with self.subTest(char=repr(c)):
        p = self.run_hook(self.event('dist/a' + c + 'b'))
        self.assertEqual(p.returncode, 1)
        self.assertEqual(p.stdout, '')

  def test_output_json_escaping(self):
    for reason in ['tab\there', 'control\x01here', 'carriage\rreturn', 'quote" and \\ slash']:
      with self.subTest(reason=repr(reason)):
        self.rules.write_text('deny dist/* ' + reason + '\n', encoding='utf-8')
        self.assertEqual(self.decision('dist/x')['permissionDecisionReason'], reason)

  def test_unicode_and_spaces(self):
    self.decision('dist/文件 with spaces.txt')

  def test_repeated_parent_components(self):
    self.decision('a/b/../../dist/x')

  def test_project_root_slash(self):
    self.env['CLAUDE_PROJECT_DIR'] = '/'
    self.decision('/dist/x')

  def test_final_rule_without_newline(self):
    self.rules.write_text('deny dist/* final', encoding='utf-8')
    self.assertEqual(self.decision('dist/x')['permissionDecisionReason'], 'final')

  def test_drive_absolute_compatibility(self):
    for root, path in [('C:/project', 'C:/project/dist/x'),
                       (r'C:\project', r'C:\project\dist\x')]:
      with self.subTest(root=root):
        self.env['CLAUDE_PROJECT_DIR'] = root
        self.decision(path)

  def test_drive_relative_and_aliases(self):
    self.env['CLAUDE_PROJECT_DIR'] = 'C:/project'
    self.decision('dist/x')
    self.decision('../dist/x', cwd='C:/project/src')
    self.decision('C:/project/src/../dist/x')
    p = self.run_hook(self.event('D:/project/dist/x'))
    self.assertEqual((p.returncode, p.stdout), (0, ''))

  def test_drive_root(self):
    self.env['CLAUDE_PROJECT_DIR'] = 'C:/'
    self.decision('C:/dist/x')
    self.decision('dist/x')

  def test_unc_absolute_compatibility(self):
    for root, path in [('//server/share/project', '//server/share/project/dist/x'),
                       (r'\\server\share\project', r'\\server\share\project\dist\x')]:
      with self.subTest(root=root):
        self.env['CLAUDE_PROJECT_DIR'] = root
        self.decision(path)

  def test_no_parser_is_explicit_error(self):
    (self.bin / PARSER).unlink()
    p = self.run_hook(self.event('dist/x'))
    self.assertEqual(p.returncode, 1)
    self.assertEqual(p.stdout, '')
    self.assertIn('jq', p.stderr)


if __name__ == '__main__':
  unittest.main(verbosity=2)
