"""用临时目录内的模拟引擎验证退出码；不安装或运行真实 Unity / Unreal。"""

import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = {
  'unity': ROOT / 'domains/game-dev/unity/templates/.claude/skills/unity-run-tests/scripts/run_tests.sh',
  'unreal': ROOT / 'domains/game-dev/unreal/templates/.claude/skills/ue-run-tests/scripts/run_tests.sh',
}
MOCK_ENGINE = '''
import os
from pathlib import Path
import sys
args = sys.argv[1:]
if os.environ['MOCK_KIND'] == 'unity':
  flag = '--output' if '--output' in args else '-testResults'
  output = Path(args[args.index(flag) + 1])
else:
  output = Path(next(a.split('=', 1)[1] for a in args if a.startswith('-ReportExportPath='))) / 'index.json'
if os.environ['MOCK_WRITE'] == 'yes':
  output.parent.mkdir(parents=True, exist_ok=True)
  output.write_text(os.environ['MOCK_REPORT'], encoding='utf-8')
sys.exit(int(os.environ['MOCK_EXIT']))
'''


def unity_report(states=('Passed',), result=None):
  failed = states.count('Failed')
  passed = states.count('Passed')
  skipped = states.count('Skipped')
  result = result or ('Failed' if failed else 'Passed')
  cases = ''.join(f'<test-case fullname="Demo.Test{i}" result="{state}"/>'
                  for i, state in enumerate(states))
  return (f'<test-run result="{result}" total="{len(states)}" passed="{passed}" '
          f'failed="{failed}" skipped="{skipped}" duration="0.1">{cases}</test-run>')


def unreal_report(states=('Success',), **counts):
  data = {'tests': [{'fullTestPath': f'Demo.Test{i}', 'state': state}
                    for i, state in enumerate(states)]}
  data.update(counts)
  return json.dumps(data)


class EngineTestRunners(unittest.TestCase):
  def run_mock(self, kind, report, code=0, cli=False, stale=False, python=True):
    with tempfile.TemporaryDirectory(prefix='engine-runner-test-') as directory:
      project = Path(directory) / 'project with spaces'
      project.mkdir()
      binary_dir = Path(directory) / 'bin'
      binary_dir.mkdir()
      # 隔离 PATH，避免测试意外启动已安装的 unity CLI。
      commands = ['mkdir', 'rm', 'grep', 'sort', 'head', 'sed', 'dirname', 'basename', 'awk']
      for command in commands:
        source = shutil.which(command)
        if source is None:
          self.skipTest(f'需要 {command}')
        (binary_dir / command).symlink_to(source)
      if python:
        (binary_dir / 'python3').symlink_to(sys.executable)
      engine = binary_dir / ('unity' if cli else 'mock-editor')
      engine.write_text(f'#!{sys.executable}\n{MOCK_ENGINE}', encoding='utf-8')
      engine.chmod(0o755)
      uproject = project / 'Demo.uproject'
      uproject.write_text('{}', encoding='utf-8')
      if stale:
        output = (project / 'Logs/ai-test-results-EditMode.xml' if kind == 'unity'
                  else project / 'Saved/Automation/ai-report/index.json')
        output.parent.mkdir(parents=True)
        output.write_text(unity_report() if kind == 'unity' else unreal_report(), encoding='utf-8')
      env = dict(os.environ, PATH=str(binary_dir), UNITY_PROJECT=str(project),
                 UNITY_EDITOR=str(engine), UE_PROJECT=str(uproject), UE_EDITOR=str(engine),
                 UE_TEST_EXTRA_ARGS='', MOCK_KIND=kind, MOCK_REPORT=report or '',
                 MOCK_WRITE='yes' if report is not None else 'no', MOCK_EXIT=str(code))
      return subprocess.run([shutil.which('bash'), str(SCRIPTS[kind])],
                            cwd=project, env=env, capture_output=True, text=True, timeout=10)

  def check(self, expected, *args, **kwargs):
    completed = self.run_mock(*args, **kwargs)
    self.assertEqual(completed.returncode, expected, completed.stdout + completed.stderr)
    return completed

  def test_unity_reports_editor_and_cli(self):
    cases = [
      ('missing', None, 2),
      ('malformed', '<test-run', 2),
      ('wrong-root', '<results/>', 2),
      ('missing-counters', '<test-run result="Passed"/>', 2),
      ('no-tests', unity_report(()), 2),
      ('all-pass', unity_report(('Passed', 'Passed')), 0),
      ('failure', unity_report(('Passed', 'Failed')), 1),
      ('skipped', unity_report(('Passed', 'Skipped')), 2),
      ('inconclusive', unity_report(('Inconclusive',)), 2),
      ('unknown', unity_report(('FutureState',)), 2),
      ('root-incomplete', unity_report(result='Inconclusive'), 2),
      ('summary-inconclusive', unity_report().replace('duration=', 'inconclusive="1" duration='), 2),
      ('inconsistent-counts', unity_report().replace('total="1"', 'total="2"'), 2),
    ]
    for cli in (False, True):
      for label, report, status in cases:
        with self.subTest(cli=cli, report=label):
          self.check(status, 'unity', report, cli=cli)

  def test_unity_process_exit_codes(self):
    for cli, failed_code in ((False, 2), (True, 8)):
      with self.subTest(cli=cli):
        self.check(1, 'unity', unity_report(), code=failed_code, cli=cli)
        self.check(2, 'unity', unity_report(), code=17, cli=cli)
        self.check(2, 'unity', '<broken', code=failed_code, cli=cli)

  def test_unreal_reports(self):
    cases = [
      ('missing', None, 2),
      ('malformed', '{broken', 2),
      ('wrong-root', '[]', 2),
      ('missing-tests', '{}', 2),
      ('wrong-tests', '{"tests": {}}', 2),
      ('bad-test', '{"tests": [null]}', 2),
      ('no-tests', unreal_report(()), 2),
      ('all-pass', unreal_report(('Success', 'Success')), 0),
      ('warnings', unreal_report(succeeded=0, succeededWithWarnings=1), 0),
      ('failure', unreal_report(('Success', 'Fail')), 1),
      ('failed-alias', unreal_report(('Failed',)), 1),
      ('not-run', unreal_report(('NotRun',)), 2),
      ('in-process', unreal_report(('InProcess',)), 2),
      ('skipped', unreal_report(('Skipped',)), 2),
      ('unknown', unreal_report(('FutureState',)), 2),
      ('missing-state', '{"tests": [{}]}', 2),
      ('summary-failed', unreal_report(failed=1), 1),
      ('summary-incomplete', unreal_report(notRun=1), 2),
      ('summary-inconsistent', unreal_report(succeeded=2, succeededWithWarnings=0), 2),
      ('summary-invalid', unreal_report(failed='zero'), 2),
      ('single-success-count-invalid', unreal_report(succeeded=999), 2),
      ('single-warning-count-invalid', unreal_report(succeededWithWarnings=999), 2),
      ('single-success-count-valid', unreal_report(succeeded=1), 0),
      ('single-warning-count-valid', unreal_report(succeededWithWarnings=1), 0),
      ('single-success-count-zero', unreal_report(succeeded=0), 2),
      ('duplicate-failed-count', '{"tests": [{"state": "Success"}], "failed": 1, "failed": 0}', 2),
      ('duplicate-state', '{"tests": [{"state": "Fail", "state": "Success"}]}', 2),
      ('invalid-entries', '{"tests": [{"state": "Fail", "entries": null}]}', 2),
    ]
    for label, report, status in cases:
      with self.subTest(report=label):
        self.check(status, 'unreal', report)

  def test_unreal_process_failure_with_report(self):
    self.check(2, 'unreal', unreal_report(), code=17)
    self.check(2, 'unreal', unreal_report(('Fail',)), code=17)

  def test_stale_reports_cannot_pass(self):
    for kind in SCRIPTS:
      with self.subTest(kind=kind):
        self.check(2, kind, None, stale=True)

  def test_missing_python_fails_closed(self):
    for kind in SCRIPTS:
      with self.subTest(kind=kind):
        self.check(2, kind, None, python=False)


if __name__ == '__main__':
  unittest.main()
