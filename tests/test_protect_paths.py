"""Synthetic subprocess tests; no Claude installation or real project writes."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

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
                    PROTECTED_PATHS_FILE=str(self.rules), PYTHONIOENCODING="utf-8")

  def run_hook(self, event=None, raw=None):
    if raw is None:
      raw = json.dumps(event)
    return subprocess.run(['/bin/bash', str(HOOK)], input=raw, text=True, encoding="utf-8",
                          capture_output=True, env=self.env, cwd=self.root, timeout=10)

  def event(self, path, **extra):
    return dict(tool_input={'file_path': path}, **extra)

  def trace_parser(self):
    # Keep the isolated PATH; delegate to the same actual CLI, not a JSON mock.
    parser = self.bin / PARSER
    self.env['REAL_PARSER'] = str(parser.resolve())
    calls = self.base / 'parser-calls'
    self.env['PARSER_CALLS'] = str(calls)
    parser.unlink()
    parser.write_text('''#!/bin/bash
printf 'call\\n' >> "$PARSER_CALLS"
if [ "${PARSER_FAIL_AFTER_OUTPUT:-0}" = 1 ]; then
  "$REAL_PARSER" "$@"
  status=$?
  [ "$status" -eq 0 ] || exit "$status"
  exit 23
fi
exec "$REAL_PARSER" "$@"
''', encoding='utf-8')
    parser.chmod(0o755)
    return calls

  def decision(self, path, expected='deny', **extra):
    p = self.run_hook(self.event(path, **extra))
    self.assertEqual(p.returncode, 0, p.stderr)
    data = json.loads(p.stdout)['hookSpecificOutput']
    self.assertEqual(data['hookEventName'], 'PreToolUse')
    self.assertEqual(data['permissionDecision'], expected)
    return data

  def test_utf8_subprocess_protocol_ignores_locale_default(self):
    # Keep the parent environment untouched and pin only child Python pipes.
    parent_encoding = os.environ.get("PYTHONIOENCODING")
    self.assertEqual("utf-8", self.env["PYTHONIOENCODING"])
    with patch("subprocess._text_encoding", return_value="gbk"):
      self.rules.write_text("deny dist/* 中文原因\n", encoding="utf-8")
      raw = json.dumps(self.event("dist/文件.txt"), ensure_ascii=False)
      result = self.run_hook(raw=raw)
      self.assertEqual(0, result.returncode, result.stderr)
      self.assertEqual("中文原因", json.loads(result.stdout)["hookSpecificOutput"]["permissionDecisionReason"])
      (self.bin / PARSER).unlink()
      result = self.run_hook(raw=raw)
      self.assertEqual(1, result.returncode)
      self.assertEqual("", result.stdout)
      self.assertIn("需要 jq 或 python3", result.stderr)
    self.assertEqual(parent_encoding, os.environ.get("PYTHONIOENCODING"))

  def test_missing_bash_is_an_error_not_a_skip(self):
    with patch("subprocess.Popen", side_effect=FileNotFoundError("/bin/bash unavailable")) as launch:
      with self.assertRaisesRegex(FileNotFoundError, "/bin/bash unavailable"):
        self.run_hook(self.event("dist/x"))
      self.assertEqual("/bin/bash", launch.call_args.args[0][0])

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
    for file_path in [None, '']:
      with self.subTest(file_path=file_path):
        p = self.run_hook({'tool_input': {'file_path': file_path, 'notebook_path': 'dist/x.ipynb'}})
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertEqual(json.loads(p.stdout)['hookSpecificOutput']['permissionDecision'], 'deny')
    p = self.run_hook({'tool_input': {'file_path': 'src/x', 'notebook_path': 'dist/x.ipynb'}})
    self.assertEqual((p.returncode, p.stdout, p.stderr), (0, '', ''))

  def test_missing_path(self):
    for event in [{}, {'tool_input': {}}, {'tool_input': {'file_path': None}},
                  self.event('', cwd=str(self.root)), self.event('', cwd='relative')]:
      with self.subTest(event=event):
        p = self.run_hook(event)
        self.assertEqual((p.returncode, p.stdout, p.stderr), (0, '', ''))

  def test_input_parser_called_once(self):
    calls = self.trace_parser()
    for event, expected in [(self.event('src/x'), 1), ({}, 1),
                            (self.event('dist/x', cwd=str(self.root)), 2)]:
      with self.subTest(event=event):
        calls.write_text('', encoding='utf-8')
        p = self.run_hook(event)
        self.assertEqual(p.returncode, 0, p.stderr)
        # Matching rules retain one additional CLI call to serialize decide().
        self.assertEqual(calls.read_text(encoding='utf-8').splitlines(), ['call'] * expected)
        if expected == 2:
          self.assertEqual(json.loads(p.stdout)['hookSpecificOutput']['permissionDecision'], 'deny')
        else:
          self.assertEqual(p.stdout, '')

  def test_parser_failure_after_output_is_not_swallowed(self):
    calls = self.trace_parser()
    self.env['PARSER_FAIL_AFTER_OUTPUT'] = '1'
    p = self.run_hook(self.event('dist/x', cwd=str(self.root)))
    self.assertEqual(p.returncode, 1)
    self.assertEqual(p.stdout, '')
    self.assertIn('无效 Hook 输入', p.stderr)
    self.assertEqual(calls.read_text(encoding='utf-8').splitlines(), ['call'])

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

  def test_empty_cwd_falls_back_to_root(self):
    for cwd in [None, '']:
      with self.subTest(cwd=cwd):
        self.decision('dist/x', cwd=cwd)

  def test_path_and_cwd_fields_are_lossless(self):
    self.rules.write_text('deny *\n', encoding='utf-8')
    directory = '  目录 " $() ;  '
    path = r'  文件 " $() ; \child  '
    result = self.decision(path, cwd=str(self.root / directory))
    relative = directory + '/' + path.replace('\\', '/')
    self.assertEqual(result['permissionDecisionReason'], f'{relative} 受保护（规则：deny *）')

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
                  self.event(42), self.event(False), self.event('dist/x', cwd=10),
                  {'cwd': 10}, {'tool_input': {'notebook_path': False}},
                  {'tool_input': {'file_path': 'dist/x', 'notebook_path': []}}]:
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

  def test_separator_and_controls_in_all_fields_are_errors(self):
    for field in ['file_path', 'notebook_path', 'cwd']:
      for char in ['\x1f', '\n', '\t']:
        with self.subTest(field=field, char=repr(char)):
          event = self.event('dist/x')
          if field == 'cwd':
            event[field] = str(self.root) + char
          else:
            event['tool_input'][field] = 'dist/x' + char
          p = self.run_hook(event)
          self.assertEqual(p.returncode, 1)
          self.assertEqual(p.stdout, '')
          self.assertIn('无效 Hook 输入', p.stderr)

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
