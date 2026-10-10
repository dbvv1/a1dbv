"""Synthetic record tests; no model, network, or evidence commands are used."""

import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
MODULE = importlib.util.spec_from_file_location("validate_task", ROOT / "scripts/validate_task.py")
validator = importlib.util.module_from_spec(MODULE)
MODULE.loader.exec_module(validator)
FIXTURES = ROOT / "templates/long-task"


class ValidationTests(unittest.TestCase):
  def setUp(self):
    self.spec = validator.read_json(FIXTURES / "task.example.json")
    self.report = validator.read_json(FIXTURES / "fixtures/report.passing.json")

  def codes(self):
    return {item["code"] for item in validator.validate(self.spec, self.report)["issues"]}

  def test_passing_and_at_budget_boundary(self):
    self.assertEqual(self.report["steps_used"], self.spec["max_steps"])
    self.assertEqual(validator.validate(self.spec, self.report)["result"], "complete")

  def test_false_completion_fixture(self):
    self.report = validator.read_json(FIXTURES / "fixtures/report.false-complete.json")
    self.assertEqual(self.codes(), {"stop_not_completion", "stale_evidence",
                                  "check_not_passed", "missing_check", "unfinished_item"})

  def test_missing_acceptance_and_check(self):
    self.report["checks"] = self.report["checks"][:1]
    issues = validator.validate(self.spec, self.report)["issues"]
    self.assertEqual(sum(i["code"] == "missing_check" for i in issues), 2)
    self.assertTrue(any("AC-2" in i["message"] for i in issues))

  def test_cannot_move_check_to_other_acceptance(self):
    self.report["checks"][0]["acceptance_id"] = "AC-2"
    self.assertIn("acceptance_mismatch", self.codes())

  def test_duplicate_ids(self):
    for area in ("acceptance", "checks", "workers", "checkpoints"):
      with self.subTest(area=area):
        spec, report = copy.deepcopy(self.spec), copy.deepcopy(self.report)
        target = spec if area == "acceptance" else report
        target[area].append(copy.deepcopy(target[area][0]))
        with self.assertRaises(validator.InvalidInput):
          validator.validate(spec, report)
    self.spec["acceptance"][1]["checks"].append("empty-page")
    with self.assertRaises(validator.InvalidInput):
      validator.validate(self.spec, self.report)

  def test_every_nonpass_check_status(self):
    for status in ("failed", "blocked", "not_run"):
      with self.subTest(status=status):
        self.report["checks"][0]["status"] = status
        self.assertIn("check_not_passed", self.codes())

  def test_unknown_status_and_malformed_types(self):
    cases = [
      ("checks", None), ("checks", {}), ("workers", "none"),
      ("checkpoints", [False]), ("steps_used", True), ("steps_used", -1),
      ("steps_used", 1.5), ("status", "success"), ("status", []),
      ("stop_reason", "done"), ("revision", " ")
    ]
    for key, value in cases:
      with self.subTest(key=key, value=value):
        report = copy.deepcopy(self.report)
        report[key] = value
        with self.assertRaises(validator.InvalidInput):
          validator.validate(self.spec, report)
    for key, value in [("status", "skipped"), ("evidence", None),
                       ("id", []), ("acceptance_id", 1)]:
      with self.subTest(check_key=key):
        report = copy.deepcopy(self.report)
        report["checks"][0][key] = value
        with self.assertRaises(validator.InvalidInput):
          validator.validate(self.spec, report)

  def test_malformed_spec(self):
    for key, value in [("acceptance", []), ("acceptance", {}), ("workers", None),
                       ("max_steps", True), ("max_steps", 0)]:
      with self.subTest(key=key):
        spec = copy.deepcopy(self.spec)
        spec[key] = value
        with self.assertRaises(validator.InvalidInput):
          validator.validate(spec, self.report)
    self.spec["acceptance"][0]["checks"] = []
    with self.assertRaises(validator.InvalidInput):
      validator.validate(self.spec, self.report)

  def test_missing_and_stale_evidence(self):
    del self.report["checks"][0]["evidence"]
    self.report["checks"][1]["evidence"]["revision"] = "old"
    self.assertEqual(self.codes(), {"missing_evidence", "stale_evidence"})

  def test_run_and_contract_mismatch(self):
    self.report.update(task_id="another", spec_revision="old", status="running")
    self.assertEqual(self.codes(), {"spec_mismatch", "run_incomplete"})

  def test_workers_checkpoints_omitted_or_unfinished(self):
    for key in ("workers", "checkpoints"):
      for status in ("running", "blocked", "failed", "not_run"):
        with self.subTest(key=key, status=status):
          self.report[key][0]["status"] = status
          self.assertIn("unfinished_item", self.codes())
      del self.report[key]
      self.assertIn("missing_item", self.codes())

  def test_unregistered_ids(self):
    self.report["workers"].append({"id": "new-worker", "status": "complete"})
    self.report["checks"][0]["id"] = "invented-check"
    self.assertEqual(self.codes(), {"unregistered_item", "unknown_check", "missing_check"})

  def test_budget_stop_not_completion_and_overrun(self):
    self.report["stop_reason"] = "budget_exhausted"
    self.assertEqual(self.codes(), {"stop_not_completion"})
    self.report["steps_used"] += 1
    self.assertIn("budget_exceeded", self.codes())
    del self.report["steps_used"]
    with self.assertRaises(validator.InvalidInput):
      self.codes()

  def test_optional_ceremony_and_reference_not_executed(self):
    for key in ("workers", "checkpoints"):
      del self.spec[key]
      del self.report[key]
    del self.spec["max_steps"]
    del self.report["steps_used"]
    self.report["checks"][0]["evidence"]["ref"] = "$(this-is-not-a-command)"
    self.assertEqual(self.codes(), set())

  def test_unknown_fields_rejected(self):
    self.report["command"] = "do not execute"
    with self.assertRaises(validator.InvalidInput):
      self.codes()

  def test_cli_exit_codes_and_json(self):
    for name, code, result in [("report.passing.json", 0, "complete"),
                               ("report.false-complete.json", 1, "incomplete")]:
      proc = subprocess.run([sys.executable, str(ROOT / "scripts/validate_task.py"),
                             str(FIXTURES / "task.example.json"),
                             str(FIXTURES / "fixtures" / name)],
                            capture_output=True, text=True, check=False)
      self.assertEqual(proc.returncode, code, proc.stderr)
      self.assertEqual(json.loads(proc.stdout)["result"], result)
    with tempfile.TemporaryDirectory() as tmp:
      path = Path(tmp) / "bad.json"
      for content in ('{"x":1,"x":2}', '{"x":NaN}', '[', 'null', '\xff'):
        path.write_bytes(content.encode("latin-1"))
        proc = subprocess.run([sys.executable, str(ROOT / "scripts/validate_task.py"),
                               str(FIXTURES / "task.example.json"), str(path)],
                              capture_output=True, text=True, check=False)
        self.assertEqual(proc.returncode, 2, proc.stderr)
        self.assertEqual(json.loads(proc.stdout)["result"], "invalid")


if __name__ == "__main__":
  unittest.main()
