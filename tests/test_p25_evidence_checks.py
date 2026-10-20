"""P25 fixed-case grader regressions; never reads real task artifacts."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
MODULES = {"p25_mail_check": 25, "p25_state_matrix": 12}


def module(name):
  path = ROOT / "scripts/research" / (name + ".py")
  spec = importlib.util.spec_from_file_location(name, path)
  result = importlib.util.module_from_spec(spec)
  spec.loader.exec_module(result)
  return result


class P25EvidenceChecks(unittest.TestCase):
  def test_mail_regressions(self):
    outcomes = module("p25_mail_check").regressions()
    self.assertEqual(len(outcomes), 25)
    for name, case in outcomes.items():
      with self.subTest(name=name):
        self.assertEqual(case["expectedPass"], case["actualPass"])

  def test_matrix_regressions(self):
    self.assertEqual(len(module("p25_state_matrix").regressions()), 12)

  def test_synthetic_cli_needs_no_private_input(self):
    for name, count in MODULES.items():
      with self.subTest(module=name), tempfile.TemporaryDirectory() as tmp:
        result = subprocess.run(
          [sys.executable, str(ROOT / "scripts/research" / (name + ".py")), "--synthetic-only"],
          cwd=tmp, env=dict(os.environ, P25_ARTIFACT_DIR=str(Path(tmp) / "absent")),
          text=True, encoding="utf-8", capture_output=True, timeout=10)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(json.loads(result.stdout)), count)
        self.assertEqual(list(Path(tmp).iterdir()), [])

  def test_real_cli_rejects_missing_input(self):
    for name in MODULES:
      with self.subTest(module=name), tempfile.TemporaryDirectory() as tmp:
        result = subprocess.run(
          [sys.executable, str(ROOT / "scripts/research" / (name + ".py"))],
          cwd=tmp, env=dict(os.environ, P25_ARTIFACT_DIR=tmp),
          text=True, encoding="utf-8", capture_output=True, timeout=10)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(list(Path(tmp).iterdir()), [])


if __name__ == "__main__":
  unittest.main()
