#!/usr/bin/env python3
"""Lightweight input/error regression checks; does not run Go or download code."""
import pathlib
import runpy
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = pathlib.Path(__file__).with_name("replay_ocr_matcher.py")


class ReplayInputTests(unittest.TestCase):
  def run_script(self, *args):
    return subprocess.run([sys.executable, str(SCRIPT), *args],
                          capture_output=True, text=True, timeout=10)

  def test_help(self):
    result = self.run_script("--help")
    self.assertEqual(result.returncode, 0)
    self.assertIn("isolated", result.stdout)

  def test_missing_arguments(self):
    result = self.run_script()
    self.assertEqual(result.returncode, 2)
    self.assertIn("required", result.stderr)
    self.assertNotIn("Traceback", result.stderr)

  def test_missing_source_does_not_create_output(self):
    with tempfile.TemporaryDirectory() as directory:
      source = pathlib.Path(directory) / "missing"
      output = pathlib.Path(directory) / "output"
      result = self.run_script(str(source), str(output))
      self.assertNotEqual(result.returncode, 0)
      self.assertNotIn("Traceback", result.stderr)
      self.assertFalse(output.exists())

  def test_git_timeout_reports_error(self):
    with tempfile.TemporaryDirectory() as directory:
      argv = [str(SCRIPT), str(pathlib.Path(directory) / "source"),
              str(pathlib.Path(directory) / "output")]
      with patch.object(sys, "argv", argv), patch("subprocess.check_output",
           side_effect=subprocess.TimeoutExpired("git", 30)):
        with self.assertRaises(SystemExit) as caught:
          runpy.run_path(str(SCRIPT), run_name="__main__")
      self.assertIn("timed out", str(caught.exception))
      self.assertFalse((pathlib.Path(directory) / "output").exists())

  def test_invalid_timeout(self):
    for timeout in ("0", "-1", "nan", "inf"):
      with self.subTest(timeout=timeout):
        result = self.run_script("source", "output", "--timeout", timeout)
        self.assertEqual(result.returncode, 2)
        self.assertIn("finite and greater than zero", result.stderr)

  def test_output_inside_source_rejected(self):
    with tempfile.TemporaryDirectory() as directory:
      result = self.run_script(directory, str(pathlib.Path(directory) / "output"))
      self.assertNotEqual(result.returncode, 0)
      self.assertIn("outside", result.stderr)
      self.assertNotIn("Traceback", result.stderr)


if __name__ == "__main__":
  unittest.main()
