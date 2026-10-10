"""Run fixed suites against a trusted local candidate; no model calls."""
import argparse
import json
from pathlib import Path
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent


def grade(candidate, timeout=10):
  candidate = Path(candidate).resolve()
  if not (candidate / "intervals.py").is_file():
    raise ValueError("candidate must contain intervals.py")
  suites = {}
  for name, expected in [("public", 4), ("held_out", 7)]:
    with tempfile.TemporaryDirectory() as cwd:
      try:
        run = subprocess.run([sys.executable, "-I", "-B", str(HERE / "checks.py"),
          str(candidate), name], cwd=cwd, capture_output=True, text=True, timeout=timeout)
      except subprocess.TimeoutExpired:
        suites[name] = {"status": "timeout", "passed": False}
        continue
    try:
      report = json.loads(run.stdout.strip().splitlines()[-1])
      valid = report["tests_run"] == expected and report["skipped"] == 0
      passed = valid and report["passed"] is True and run.returncode == 0
      suites[name] = {**report, "passed": passed,
        "status": "passed" if passed else "failed", "exit_code": run.returncode}
    except (ValueError, IndexError, KeyError, TypeError):
      suites[name] = {"status": "error", "passed": False, "exit_code": run.returncode}
  return {"accepted": all(s["passed"] for s in suites.values()), "suites": suites}


if __name__ == "__main__":
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("candidate", type=Path)
  parser.add_argument("--timeout", type=float, default=10)
  args = parser.parse_args()
  if args.timeout <= 0:
    parser.error("timeout must be positive")
  try:
    result = grade(args.candidate, args.timeout)
  except ValueError as exc:
    parser.error(str(exc))
  print(json.dumps(result, indent=2))
  sys.exit(0 if result["accepted"] else 1)
