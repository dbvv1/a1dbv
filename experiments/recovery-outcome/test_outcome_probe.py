"""Deterministic contract tests for an original failure model, not OpenHands."""
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from outcome_probe import CRASH_EXIT, Evidence, decide, demo, effects, initialize, run_worker


class RecoveryProbeTests(unittest.TestCase):
  def setUp(self):
    self.temp = tempfile.TemporaryDirectory()
    self.addCleanup(self.temp.cleanup)
    self.root = Path(self.temp.name)
    initialize(self.root)

  def evidence(self, authoritative=True, quiescent=True):
    return Evidence(tuple(effects(self.root)), authoritative, quiescent)

  def decide(self, evidence, authorized=True):
    return decide("op-1", "release-note-A", evidence, authorized)

  def test_demo_exposes_duplicate_and_prevents_it(self):
    report = demo()["scenarios"]
    self.assertEqual(report["blind_retry"]["provider_effects"], 2)
    self.assertEqual(report["reconcile"]["provider_effects"], 1)

  def test_cli_retains_effects_with_optimization(self):
    script = Path(__file__).with_name("outcome_probe.py")
    reports = []
    for flags, optimize in [((), None), (("-O",), None), (("-OO",), None), ((), "1")]:
      with self.subTest(flags=flags, optimize=optimize):
        env = dict(os.environ)
        env.pop("PYTHONOPTIMIZE", None)
        if optimize is not None:
          env["PYTHONOPTIMIZE"] = optimize
        result = subprocess.run([sys.executable, *flags, str(script)],
                                env=env, capture_output=True, text=True, timeout=20)
        self.assertEqual(result.returncode, 0, result.stderr)
        report = json.loads(result.stdout)
        self.assertEqual(report["scenarios"]["blind_retry"]["provider_effects"], 2)
        self.assertEqual(report["scenarios"]["reconcile"]["provider_effects"], 1)
        reports.append(report)
    self.assertTrue(all(report == reports[0] for report in reports))

  def test_optimized_demo_rejects_invalid_worker_outcomes(self):
    # Patch only the worker boundary in a fresh interpreter; the demo's own
    # checks must survive optimization. No assert statement in this harness.
    harness = r"""
import sys
from unittest.mock import patch
import outcome_probe as probe
mode = sys.argv[1]
real = probe.run_worker
def worker(root, **kwargs):
  if mode == 'wrong-crash':
    return 0
  if mode == 'unexpected-receipt':
    (root / 'receipt.json').write_text('{}')
    return probe.CRASH_EXIT
  if not kwargs:
    return 1
  return real(root, **kwargs)
with patch.object(probe, 'run_worker', side_effect=worker):
  try:
    probe.demo()
  except RuntimeError as exc:
    print(str(exc))
  else:
    sys.exit(9)
"""
    for mode, message in [("wrong-crash", "post-commit crash"),
                          ("unexpected-receipt", "post-commit crash"),
                          ("retry-failed", "Blind retry worker failed")]:
      with self.subTest(mode=mode):
        result = subprocess.run([sys.executable, "-O", "-c", harness, mode],
                                cwd=Path(__file__).parent, capture_output=True,
                                text=True, timeout=20)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn(message, result.stdout)

  def test_crash_before_send_has_no_effect_and_can_retry_when_quiescent(self):
    self.assertEqual(run_worker(self.root, crash="before_send"), CRASH_EXIT)
    self.assertTrue((self.root / "intent.json").exists())
    self.assertFalse((self.root / "receipt.json").exists())
    self.assertEqual(self.decide(self.evidence()), "retry_eligible")
    self.assertEqual(run_worker(self.root), 0)
    self.assertEqual(len(effects(self.root)), 1)

  def test_crash_after_commit_without_receipt_records_existing(self):
    self.assertEqual(run_worker(self.root, crash="after_commit"), CRASH_EXIT)
    self.assertFalse((self.root / "receipt.json").exists())
    self.assertEqual(self.decide(self.evidence()), "record_existing")
    self.assertEqual(len(effects(self.root)), 1)

  def test_crash_after_receipt_is_also_existing(self):
    self.assertEqual(run_worker(self.root, crash="after_receipt"), CRASH_EXIT)
    self.assertTrue((self.root / "receipt.json").exists())
    self.assertEqual(self.decide(self.evidence()), "record_existing")

  def test_timeout_or_missing_query_is_unknown(self):
    self.assertEqual(self.decide(None), "hold_unknown")
    self.assertEqual(effects(self.root), [])

  def test_cached_empty_is_not_confirmed_absence(self):
    self.assertEqual(run_worker(self.root), 0)
    stale_empty = Evidence((), False, True)
    self.assertEqual(self.decide(stale_empty), "hold_unknown")
    self.assertEqual(len(effects(self.root)), 1)

  def test_in_flight_empty_query_does_not_allow_late_commit_race(self):
    self.assertEqual(self.decide(self.evidence(quiescent=False)), "hold_in_flight")

  def test_revoked_permission_blocks_retry_after_confirmed_absence(self):
    self.assertEqual(self.decide(self.evidence(), authorized=False), "hold_authorization")

  def test_existing_result_is_not_new_write_even_without_permission(self):
    self.assertEqual(run_worker(self.root), 0)
    self.assertEqual(self.decide(self.evidence(), authorized=False), "record_existing")

  def test_same_operation_different_payload_is_conflict(self):
    self.assertEqual(run_worker(self.root, payload="different"), 0)
    self.assertEqual(self.decide(self.evidence()), "hold_conflict")

  def test_duplicate_provider_results_require_investigation(self):
    self.assertEqual(run_worker(self.root), 0)
    self.assertEqual(run_worker(self.root), 0)
    self.assertEqual(self.decide(self.evidence()), "hold_conflict")

  def test_other_operation_does_not_establish_this_operation(self):
    self.assertEqual(run_worker(self.root, operation="another-op"), 0)
    self.assertEqual(self.decide(self.evidence()), "retry_eligible")

  def test_lookup_then_retry_has_no_atomicity_guarantee(self):
    # A truthful empty query is still only a snapshot. Another writer can
    # commit after the gate. This deliberately proves a remaining limit.
    self.assertEqual(self.decide(self.evidence()), "retry_eligible")
    self.assertEqual(run_worker(self.root), 0)  # concurrent actor wins
    self.assertEqual(run_worker(self.root), 0)  # stale decision used
    self.assertEqual(len(effects(self.root)), 2)

  def test_repeated_reconciliation_is_read_only(self):
    self.assertEqual(run_worker(self.root, crash="after_commit"), CRASH_EXIT)
    for _ in range(3):
      self.assertEqual(self.decide(self.evidence()), "record_existing")
    self.assertEqual(len(effects(self.root)), 1)
    self.assertFalse((self.root / "receipt.json").exists())


if __name__ == "__main__":
  unittest.main()
