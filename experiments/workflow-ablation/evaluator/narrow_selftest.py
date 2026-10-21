"""Offline positive/negative controls; no experimental model observations."""
import hashlib
import json
from pathlib import Path
import sys
sys.dont_write_bytecode = True
import tempfile
import unittest
from narrow_grade import grade

ROOT = Path(__file__).resolve().parents[1]
REFERENCE = (ROOT / "evaluator/narrow_reference.py").read_text()


class SelfTest(unittest.TestCase):
  def score(self, source, round_name="r2", timeout=5):
    with tempfile.TemporaryDirectory() as directory:
      (Path(directory) / "stream_driver.py").write_text(source)
      return grade(directory, round_name, timeout)

  def test_positive_both_rounds(self):
    self.assertTrue(self.score(REFERENCE)["accepted"])
    r1 = REFERENCE.replace("except Cancel:", "except ():")
    self.assertTrue(self.score(r1, "r1")["accepted"])
    self.assertFalse(self.score(r1)["suites"]["cancel_r2"]["passed"])

  def test_handler_stop_iteration_not_swallowed(self):
    bad = REFERENCE.replace("except Cancel:", "except (Cancel, StopIteration):")
    result = self.score(bad)
    self.assertFalse(result["accepted"])
    self.assertFalse(result["suites"]["inherited_r1"]["passed"])

  def test_repeated_normal_eof_is_valid(self):
    source = REFERENCE.replace("      if exhausted:\n        raise StopIteration\n", "")
    source = source.replace("    for _ in stream:\n      pass",
      "    for _ in stream:\n      pass\n    try:\n      next(stream)\n    except StopIteration:\n      pass")
    self.assertTrue(self.score(source)["accepted"])
    self.assertTrue(self.score(source.replace("except Cancel:", "except ():"), "r1")["accepted"])

  def test_no_drain(self):
    bad = REFERENCE.replace("for _ in stream:\n      pass", "pass")
    result = self.score(bad)
    self.assertFalse(result["accepted"])
    self.assertFalse(result["suites"]["inherited_r1"]["passed"])
    self.assertTrue(result["suites"]["cancel_r2"]["passed"])

  def test_drain_after_cancel(self):
    bad = REFERENCE.replace("except Cancel:\n      return values", "except Cancel:\n      pass")
    result = self.score(bad)
    self.assertTrue(result["suites"]["inherited_r1"]["passed"])
    self.assertFalse(result["suites"]["cancel_r2"]["passed"])

  def test_close_and_error_mutations(self):
    for old, new in [("source.close()", "pass"),
        ("source.close()", "source.close(); source.close()"),
        ("except Cancel:", "except BaseException:"),
        ("values.append(value)", "values.insert(0, value)")]:
      with self.subTest(new=new):
        self.assertFalse(self.score(REFERENCE.replace(old, new))["accepted"])

  def test_missing_syntax_exit_timeout(self):
    with tempfile.TemporaryDirectory() as directory:
      result = grade(directory)
      self.assertFalse(result["accepted"])
      self.assertIsNone(result["candidate_sha256"])
    for source in ["invalid python!", "raise SystemExit(0)"]:
      result = self.score(source)
      self.assertTrue(all(s["status"] == "error" for s in result["suites"].values()))
    result = self.score("import time; time.sleep(60)", timeout=0.1)
    self.assertTrue(all(s["status"] == "timeout" for s in result["suites"].values()))
    for timeout in [0, -1, float("nan"), float("inf")]:
      with self.assertRaises(ValueError):
        self.score(REFERENCE, timeout=timeout)

  def test_unreadable_or_removed_source_preserves_results(self):
    with tempfile.TemporaryDirectory() as directory:
      (Path(directory) / "stream_driver.py").mkdir()
      result = grade(directory)
      self.assertEqual(result["status"], "not_scoreable")
      self.assertIsNone(result["candidate_sha256"])
    for mutation in ["path.unlink()", "path.unlink(); path.mkdir()"]:
      source = ("from pathlib import Path\npath = Path(__file__)\n" + mutation + "\n" + REFERENCE)
      with self.subTest(mutation=mutation):
        result = self.score(source)
        self.assertFalse(result["accepted"])
        self.assertFalse(result["source_unchanged"])
        self.assertEqual(result["candidate_sha256"], hashlib.sha256(source.encode()).hexdigest())
        self.assertTrue(result["reason"].startswith("source_unreadable_after_grading:"))
        self.assertEqual(len(result["suites"]), 4)
        self.assertTrue(result["suites"]["public_r1"]["passed"])
        self.assertEqual(result["suites"]["cancel_r2"]["status"], "error")

  def test_manifest_and_condition(self):
    manifest = json.loads((ROOT / "narrow-manifest.json").read_text())
    for relative, digest in manifest["sha256"].items():
      self.assertEqual(hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), digest, relative)
    self.assertEqual((ROOT / "conditions/narrow-a.md").read_bytes(), b"")
    self.assertEqual((ROOT / "conditions/narrow-b.md").read_text(),
      "修改前列出本轮改变的退出路径与相邻必须保留的路径，为后者补回归，并报告未覆盖处。\n")
    self.assertEqual(manifest["pair_order"], ["AB", "BA", "AB"])
    self.assertEqual(manifest["model_status"], "not_run")


if __name__ == "__main__":
  unittest.main(verbosity=2)
