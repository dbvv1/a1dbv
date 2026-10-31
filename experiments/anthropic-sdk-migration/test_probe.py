"""python3 test_probe.py <Hermes checkout> <old Python> <new Python>"""

import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

if len(sys.argv) != 4:
  raise SystemExit(__doc__)
ROOT = str(Path(sys.argv[1]).resolve())
# Do not resolve interpreter symlinks: that would escape the chosen virtualenv.
OLD, NEW = (str(Path(p).absolute()) for p in sys.argv[2:])
sys.argv[1:] = []
PROBE = Path(__file__).with_name("probe.py")


class ContractTests(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    cls.runs = {label: subprocess.run([python, str(PROBE), ROOT], text=True,
      capture_output=True, encoding="utf-8", timeout=60)
      for label, python in (("old", OLD), ("new", NEW))}
    cls.results = {label: json.loads(run.stdout) for label, run in cls.runs.items()}

  def test_old_runtime_is_a_passing_control(self):
    run = self.runs["old"]
    self.assertEqual(run.returncode, 0, run.stderr)
    self.assertEqual(self.results["old"]["sdk"], "0.125.0")
    stages = self.results["old"]["stages"]
    self.assertTrue(stages["full_builder"]["constructed"])
    self.assertTrue(stages["hermes_original_payload"]["request"]["x_api_key"])
    self.assertIn("temperature", stages["hermes_original_payload"]["request"]["body_keys"])

  def test_new_full_builder_fails_on_real_http_type(self):
    self.assertEqual(self.results["new"]["sdk"], "2.3.0")
    self.assertEqual(self.runs["new"].returncode, 1)
    stage = self.results["new"]["stages"]["full_builder"]
    self.assertFalse(stage["constructed"])
    self.assertIn("httpx2", stage["error"])

  def test_sampling_fails_before_any_transport_call(self):
    for maker in ("sdk", "hermes"):
      stage = self.results["new"]["stages"][maker + "_original_payload"]
      self.assertEqual(stage["transport_calls"], 0)
      self.assertIn("temperature", stage["error"])

  def test_real_outbound_auth_and_copy_not_mock_success(self):
    stages = self.results["new"]["stages"]
    for suffix in ("without_sampling", "copied_without_sampling"):
      sdk = stages["sdk_" + suffix]["request"]
      hermes = stages["hermes_" + suffix]["request"]
      self.assertTrue(sdk["authorization"])
      self.assertFalse(hermes["authorization"])
      self.assertFalse(hermes["x_api_key"])
      self.assertEqual(hermes["api_version"], "2026-10-21")

  def test_positive_header_controls_and_zero_network(self):
    for result in self.results.values():
      self.assertEqual(result["network_socket_calls"], 0)
      stages = result["stages"]
      key = stages["explicit_key_header_control"]["request"]
      token = stages["token_header_control"]["request"]
      self.assertEqual((key["x_api_key"], key["authorization"]), (True, False))
      self.assertEqual((token["x_api_key"], token["authorization"]), (False, True))

  def test_missing_arguments_fail(self):
    result = subprocess.run([OLD, str(PROBE)], capture_output=True, text=True, timeout=30)
    self.assertEqual(result.returncode, 2)

  def test_changed_source_stops_before_importing_hermes(self):
    with tempfile.TemporaryDirectory() as root:
      target = Path(root) / "agent/anthropic_adapter.py"
      target.parent.mkdir()
      target.write_text("raise RuntimeError('must not import')\n", encoding="utf-8")
      result = subprocess.run([OLD, str(PROBE), root], capture_output=True, text=True, timeout=30)
    self.assertEqual(result.returncode, 2)
    self.assertIn("differs from pinned", result.stderr)
    self.assertNotIn("must not import", result.stderr)


if __name__ == "__main__":
  unittest.main(verbosity=2)
