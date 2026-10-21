"""Grade a frozen trusted candidate offline; no client/model calls or sandbox."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent


def grade(candidate, round_name="r2", timeout=10):
  if round_name not in ("r1", "r2") or not math.isfinite(timeout) or timeout <= 0:
    raise ValueError("round must be r1/r2 and timeout finite and positive")
  candidate = Path(candidate).resolve()
  source = candidate / "stream_driver.py"
  try:
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
  except OSError as exc:
    return {"accepted": False, "status": "not_scoreable", "candidate_sha256": None,
      "suites": {}, "reason": "source_unreadable_before_grading", "error_type": type(exc).__name__}
  suites = {}
  counts = {"public_r1": 4, "inherited_r1": 4}
  counts.update({"r1_cancel": 1} if round_name == "r1" else {"public_r2": 1, "cancel_r2": 1})
  for name, expected in counts.items():
    with tempfile.TemporaryDirectory() as cwd:
      try:
        run = subprocess.run([sys.executable, "-I", "-B", str(HERE / "narrow_checks.py"),
          str(candidate), name], cwd=cwd, capture_output=True, text=True, timeout=timeout)
      except subprocess.TimeoutExpired:
        suites[name] = {"status": "timeout", "passed": False, "exit_code": None}
        continue
    try:
      report = json.loads(run.stdout.strip().splitlines()[-1])
      valid = (report["tests_run"] == expected and report["skipped"] == 0
        and isinstance(report["checks"], dict) and bool(report["checks"]))
      passed = valid and report["passed"] is True and run.returncode == 0
      suites[name] = {**report, "passed": passed,
        "status": "passed" if passed else "failed", "exit_code": run.returncode}
    except (ValueError, IndexError, KeyError, TypeError):
      suites[name] = {"status": "error", "passed": False, "exit_code": run.returncode}
  reason = None
  try:
    unchanged = hashlib.sha256(source.read_bytes()).hexdigest() == digest
    if not unchanged:
      reason = "source_changed_during_grading"
  except OSError as exc:
    unchanged = False
    reason = "source_unreadable_after_grading:" + type(exc).__name__
  accepted = unchanged and all(s["passed"] for s in suites.values())
  return {"accepted": accepted, "status": "passed" if accepted else "failed",
    "round": round_name, "reason": reason, "candidate_sha256": digest, "source_unchanged": unchanged, "suites": suites}


if __name__ == "__main__":
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("candidate", type=Path)
  parser.add_argument("--round", choices=["r1", "r2"], required=True)
  parser.add_argument("--timeout", type=float, default=10)
  args = parser.parse_args()
  try:
    result = grade(args.candidate, args.round, args.timeout)
  except ValueError as exc:
    parser.error(str(exc))
  print(json.dumps(result, indent=2))
  sys.exit(0 if result["accepted"] else 1)
