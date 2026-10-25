"""Synthetic receiver regressions plus one explicitly identified actual batch capture."""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts' / 'check_moba_batch.py'
spec = importlib.util.spec_from_file_location('check_moba_batch', SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def fixture():
  return {
    'options': {'games': 200, 'seed': 1, 'contentVersion': 2},
    'attempted': 200, 'completed': 200, 'errors': 0, 'timeouts': 0,
    'blueWins': 104, 'redWins': 96, 'stuckEvents': 0,
    'replayChecked': 3, 'replayMismatches': 0, 'durations': {'median': 600},
  }


class IntakeTests(unittest.TestCase):
  def run_cli(self, data):
    with tempfile.TemporaryDirectory() as directory:
      report = Path(directory) / 'report.json'
      if data is not None:
        report.write_text(json.dumps(data), encoding='utf-8')
      return subprocess.run([sys.executable, str(SCRIPT), str(report), '--games', '200',
                             '--seed', '1', '--content-version', '2'], capture_output=True, text=True)

  def test_existing_b_batch_fails_on_real_timeout(self):
    report = json.loads((SCRIPT.parents[1] / 'docs/collaboration/local-jobs/artifacts/B-MOBA-SIMULATION-001/v2-200-seed1.json').read_text())
    result = self.run_cli(report)
    self.assertEqual(result.returncode, 1)
    self.assertFalse(json.loads(result.stdout)['checks']['all_matches_finished'])
    self.assertEqual(report['failureSamples'][0]['seed'], 136)

  def test_normal_cli_is_limited_to_baseline(self):
    result = self.run_cli(fixture())
    self.assertEqual(result.returncode, 0, result.stdout)
    self.assertIn('500-game multi-seed symmetry', json.loads(result.stdout)['not_checked'])

  def test_timeout_fails_even_when_sampled_replay_matches(self):
    report = fixture()
    report.update(completed=199, redWins=95, timeouts=1)
    result = self.run_cli(report)
    self.assertEqual(result.returncode, 1)
    self.assertFalse(json.loads(result.stdout)['checks']['all_matches_finished'])

  def test_missing_file_and_missing_field_are_invalid(self):
    self.assertEqual(self.run_cli(None).returncode, 2)
    report = fixture()
    del report['timeouts']
    self.assertEqual(self.run_cli(report).returncode, 2)

  def test_wrong_version_bool_count_and_bad_denominator_rejected(self):
    for change in ({'options': {'games': 200, 'seed': 1, 'contentVersion': 1}},
                   {'errors': False}, {'attempted': 199}, {'replayChecked': 201},
                   {'completed': 199}, {'durations': {'median': float('nan')}}):
      with self.subTest(change=change):
        report = fixture()
        report.update(change)
        self.assertEqual(self.run_cli(report).returncode, 2)

  def test_no_replay_errors_stuck_and_duration_fail(self):
    for change in ({'replayChecked': 0}, {'replayMismatches': 1}, {'stuckEvents': 1},
                   {'durations': {'median': 900}},
                   {'errors': 1, 'completed': 199, 'redWins': 95}):
      with self.subTest(change=change):
        report = fixture()
        report.update(change)
        self.assertEqual(self.run_cli(report).returncode, 1)


if __name__ == '__main__':
  unittest.main()
