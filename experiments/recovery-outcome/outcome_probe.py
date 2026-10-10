"""Original offline recovery probe. No SDK, network, model, or real publication.

Separate stores model an external service and a caller's receipt across
process exits only (JSON writes have no fsync; no power-loss guarantee). A
worker exits abruptly in a chosen crash window. The provider is intentionally NOT
idempotent; the recovery gate makes a decision but never executes an action.
"""
from __future__ import annotations

import argparse
from dataclasses import dataclass
import json
import os
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile

CRASH_EXIT = 71


def initialize(root: Path) -> None:
  with sqlite3.connect(root / "provider.sqlite") as db:
    db.execute("CREATE TABLE effects (operation TEXT NOT NULL, payload TEXT NOT NULL)")


def effects(root: Path) -> list[tuple[str, str]]:
  with sqlite3.connect(root / "provider.sqlite") as db:
    return db.execute("SELECT operation, payload FROM effects ORDER BY rowid").fetchall()


def execute_worker(root: Path, operation: str, payload: str, crash: str) -> None:
  # Caller JSON writes survive these process exits, not necessarily power loss.
  # Provider SQLite commit is independent of the caller receipt.
  (root / "intent.json").write_text(json.dumps({"operation": operation, "payload": payload}))
  if crash == "before_send":
    os._exit(CRASH_EXIT)
  with sqlite3.connect(root / "provider.sqlite") as db:
    db.execute("INSERT INTO effects VALUES (?, ?)", (operation, payload))
  if crash == "after_commit":
    os._exit(CRASH_EXIT)
  (root / "receipt.json").write_text(json.dumps({"operation": operation, "payload": payload}))
  if crash == "after_receipt":
    os._exit(CRASH_EXIT)


def run_worker(root: Path, operation="op-1", payload="release-note-A", crash="none") -> int:
  return subprocess.run(
    [sys.executable, str(Path(__file__).resolve()), "--worker", str(root),
    "--operation", operation, "--payload", payload, "--crash", crash],
    check=False,
  ).returncode


@dataclass(frozen=True)
class Evidence:
  # authoritative means exact, complete, current provider query, not a search
  # index, cached empty result, or model claim. quiescent excludes late commits.
  rows: tuple[tuple[str, str], ...]
  authoritative: bool
  quiescent: bool


def decide(operation: str, payload: str, evidence: Evidence | None,
     authorized_now: bool) -> str:
  """Pure gate for this probe, not a production authorization system."""
  if evidence is None or not evidence.authoritative:
    return "hold_unknown"
  matches = [value for key, value in evidence.rows if key == operation]
  if matches:
    if len(matches) != 1 or matches[0] != payload:
      return "hold_conflict"
    # Reading an existing result is not permission to perform another write.
    return "record_existing"
  if not evidence.quiescent:
    return "hold_in_flight"
  if not authorized_now:
    return "hold_authorization"
  return "retry_eligible"


def demo() -> dict:
  results = {}
  for policy in ("blind_retry", "reconcile"):
    with tempfile.TemporaryDirectory() as temp:
      root = Path(temp)
      initialize(root)
      code = run_worker(root, crash="after_commit")
      assert code == CRASH_EXIT and not (root / "receipt.json").exists()
      # This probe models business effects, not SDK tool-call matching.
      # Closing an old call does not deduplicate a new business retry.
      decision = "retry" if policy == "blind_retry" else decide(
        "op-1", "release-note-A", Evidence(tuple(effects(root)), True, True), True)
      if decision == "retry":
        assert run_worker(root) == 0
      results[policy] = {"decision": decision, "provider_effects": len(effects(root))}
  return {"scope": "synthetic_failure_model_only", "scenarios": results}


if __name__ == "__main__":
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("--worker", type=Path)
  parser.add_argument("--operation", default="op-1")
  parser.add_argument("--payload", default="release-note-A")
  parser.add_argument("--crash", choices=["none", "before_send", "after_commit", "after_receipt"], default="none")
  args = parser.parse_args()
  if args.worker:
    execute_worker(args.worker, args.operation, args.payload, args.crash)
  else:
    print(json.dumps(demo(), indent=2))
