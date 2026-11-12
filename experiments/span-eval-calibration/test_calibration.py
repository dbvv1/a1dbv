"""Exercise the runnable calibration, suppressed tracing, and missing fixture."""
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

HERE = Path(__file__).resolve().parent


class CalibrationTests(unittest.TestCase):
  def run_script(self, path=HERE, sampler=None):
    env = os.environ.copy()
    env.pop('OTEL_TRACES_SAMPLER', None)
    env.pop('OTEL_TRACES_SAMPLER_ARG', None)
    if sampler:
      env['OTEL_TRACES_SAMPLER'] = sampler
    return subprocess.run([sys.executable, str(path / 'calibrate.py')],
                          env=env, capture_output=True, text=True, timeout=30)

  def test_normal_and_violating_shapes(self):
    result = self.run_script()
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertIn('6 cases, 12 score checks, 0 skipped', result.stdout)

  def test_missing_telemetry_fails(self):
    result = self.run_script(sampler='always_off')
    self.assertEqual(result.returncode, 1, result.stderr)
    self.assertIn('NO_SPANS', result.stderr)
    self.assertNotIn('PASS total', result.stdout)

  def test_missing_fixture_fails(self):
    with tempfile.TemporaryDirectory(prefix='.check-', dir=HERE) as directory:
      destination = Path(directory)
      for name in ('calibrate.py', 'upstream_evaluators.py'):
        shutil.copyfile(HERE / name, destination / name)
      result = self.run_script(destination)
      self.assertEqual(result.returncode, 1, result.stderr)
      self.assertIn('MISSING_INPUT', result.stderr)


if __name__ == '__main__':
  unittest.main()
