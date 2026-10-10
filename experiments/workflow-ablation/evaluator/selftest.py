"""Prove harness polarity offline; reference changes only a temporary copy."""
from pathlib import Path
import hashlib
import json
import sys
sys.dont_write_bytecode = True
import shutil
import tempfile
import unittest
from grade import grade

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / "agent-input/baseline"


class HarnessTests(unittest.TestCase):
  def test_manifest(self):
    manifest = json.loads((ROOT / "manifest.json").read_text())
    for relative, expected in manifest["sha256"].items():
      self.assertEqual(hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), expected, relative)

  def test_empty_template(self):
    template = json.loads((ROOT / "results/run.template.json").read_text())
    self.assertEqual(template["record_kind"], "template")
    self.assertEqual(template["status"], "not_run")
    self.assertTrue(all(value is None for value in template["quality"].values()))
    self.assertTrue(all(value is None for value in template["usage"].values()))
    self.assertTrue(all(value is None for value in template["cost"].values()))

  def test_baseline_false_green(self):
    result = grade(BASELINE)
    self.assertTrue(result["suites"]["public"]["passed"])
    self.assertFalse(result["suites"]["held_out"]["passed"])
    self.assertFalse(result["accepted"])

  def test_reference_patch(self):
    original = (BASELINE / "intervals.py").read_bytes()
    lines = (ROOT / "evaluator/reference.patch").read_text().splitlines()
    old = next(line[1:] for line in lines if line.startswith("-") and not line.startswith("---"))
    new = next(line[1:] for line in lines if line.startswith("+") and not line.startswith("+++"))
    with tempfile.TemporaryDirectory() as temporary:
      candidate = Path(temporary) / "candidate"
      shutil.copytree(BASELINE, candidate)
      text = (candidate / "intervals.py").read_text()
      self.assertEqual(text.count(old), 1)
      (candidate / "intervals.py").write_text(text.replace(old, new, 1))
      self.assertTrue(grade(candidate)["accepted"])
    self.assertEqual((BASELINE / "intervals.py").read_bytes(), original)

  def test_dataclass_forward_annotation(self):
    source = (BASELINE / "intervals.py").read_text().replace(
      "(result[-1][0], end)", "(result[-1][0], max(result[-1][1], end))")
    prefix = ("from __future__ import annotations\nfrom dataclasses import dataclass\n"
      "@dataclass\nclass Node:\n  child: Node | None = None\n")
    with tempfile.TemporaryDirectory() as temporary:
      (Path(temporary) / "intervals.py").write_text(prefix + source)
      self.assertTrue(grade(temporary)["accepted"])

  def test_forged_json_then_system_exit(self):
    source = ('import json, sys\n'
      'print(json.dumps({"tests_run": 4 if sys.argv[-1] == "public" else 7, '
      '"failures": 0, "errors": 0, "skipped": 0, "passed": True}))\n'
      'raise SystemExit(0)\n')
    with tempfile.TemporaryDirectory() as temporary:
      (Path(temporary) / "intervals.py").write_text(source)
      result = grade(temporary)
      self.assertFalse(result["accepted"])
      self.assertTrue(all(not suite["passed"] for suite in result["suites"].values()))

  def test_missing_input(self):
    with tempfile.TemporaryDirectory() as temporary:
      with self.assertRaises(ValueError):
        grade(temporary)

  def test_syntax_error_and_zero_test_exit(self):
    with tempfile.TemporaryDirectory() as temporary:
      file = Path(temporary) / "intervals.py"
      for source in ["this is invalid python!", "raise SystemExit(0)"]:
        file.write_text(source)
        result = grade(temporary)
        self.assertFalse(result["accepted"])
        self.assertEqual(result["suites"]["held_out"]["status"], "error")

  def test_timeout(self):
    with tempfile.TemporaryDirectory() as temporary:
      (Path(temporary) / "intervals.py").write_text("import time\ntime.sleep(60)\n")
      result = grade(temporary, timeout=0.2)
      self.assertFalse(result["accepted"])
      self.assertEqual(result["suites"]["held_out"]["status"], "timeout")

  def test_conditions_identical_useful_prefix(self):
    short = (ROOT / "conditions/short.md").read_bytes()
    padded = (ROOT / "conditions/padded.md").read_bytes()
    self.assertTrue(padded.startswith(short))
    self.assertGreater(len(padded), len(short) * 10)
    self.assertEqual((ROOT / "conditions/neutral.md").read_bytes(), b"")


if __name__ == "__main__":
  unittest.main(verbosity=2)
