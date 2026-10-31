import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).with_name("run.py")
spec = importlib.util.spec_from_file_location("probe", SCRIPT)
probe = importlib.util.module_from_spec(spec)
spec.loader.exec_module(probe)


class ProbeTests(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    # Missing real dependencies fail setup rather than silently skipping proof.
    cls.inputs = [os.environ[key] for key in
                  ["DRIZZLE_REPRO", "DRIZZLE_RC4", "DRIZZLE_RC5"]]

  def test_real_cli_transitions(self):
    with tempfile.TemporaryDirectory() as parent:
      output = Path(parent) / "trial"
      with contextlib.redirect_stdout(io.StringIO()):
        status = probe.main([*self.inputs, str(output)])
      report = json.loads((output / "result.json").read_text())
      self.assertEqual(status, 1)
      self.assertEqual(report["acceptance"], {"noChangeUpgradeFailures": 2, "passed": False})
      for result, version in zip(report["results"], ["8", "9"]):
        self.assertEqual(result["upSnapshotVersions"], [version])
        self.assertEqual(result["cliExitCodes"], [0, 0, 0])
        self.assertEqual(result["firstGenerate"], {"newMigrations": 1, "statements": 4,
          "typeAlter": 1, "indexDrop": 1, "indexCreate": 1, "checkReplace": 1, "viewDDL": 0})
        self.assertTrue(result["schemaAndConfigUnchanged"])
        self.assertTrue(result["historicalSqlPreserved"])
        self.assertTrue(result["secondGenerateUnchanged"])

  def test_missing_arguments(self):
    child = subprocess.run([sys.executable, str(SCRIPT)], capture_output=True, text=True)
    self.assertEqual(child.returncode, 2)
    self.assertIn("required", child.stderr)

  def test_missing_source(self):
    with tempfile.TemporaryDirectory() as parent:
      output = Path(parent) / "trial"
      with self.assertRaises(subprocess.CalledProcessError):
        probe.main([str(Path(parent) / "missing"), *self.inputs[1:], str(output)])
      self.assertFalse(output.exists())

  def test_wrong_dependency_version(self):
    with tempfile.TemporaryDirectory() as parent:
      output = Path(parent) / "trial"
      with self.assertRaisesRegex(ValueError, "unexpected drizzle-kit version"):
        probe.main([self.inputs[0], self.inputs[2], self.inputs[1], str(output)])
      self.assertFalse(output.exists())

  def test_changed_source_hash(self):
    with tempfile.TemporaryDirectory() as parent:
      output = Path(parent) / "trial"
      with patch.dict(probe.INPUTS, {"schema.ts": "0" * 64}):
        with self.assertRaisesRegex(ValueError, "source mismatch"):
          probe.main([*self.inputs, str(output)])
      self.assertFalse(output.exists())

  def test_existing_output_untouched(self):
    with tempfile.TemporaryDirectory() as parent:
      marker = Path(parent) / "keep.txt"
      marker.write_text("existing work")
      with self.assertRaisesRegex(ValueError, "output already exists"):
        probe.main([*self.inputs, parent])
      self.assertEqual(marker.read_text(), "existing work")

  def test_malformed_metadata_is_setup_failure_not_drift(self):
    for metadata in [{}, [], {"version": 5}]:
      with self.subTest(metadata=metadata), tempfile.TemporaryDirectory() as parent:
        prefix = Path(parent) / "dependency"
        package = prefix / "node_modules/drizzle-kit"
        package.mkdir(parents=True)
        (package / "package.json").write_text(json.dumps(metadata))
        output = Path(parent) / "trial"
        child = subprocess.run([sys.executable, str(SCRIPT), self.inputs[0],
          str(prefix), self.inputs[2], str(output)], capture_output=True, text=True)
        self.assertEqual(child.returncode, 2)
        self.assertIn("invalid drizzle-kit metadata", child.stderr)
        self.assertFalse(output.exists())


if __name__ == "__main__":
  unittest.main()
