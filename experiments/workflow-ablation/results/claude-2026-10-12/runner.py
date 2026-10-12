"""Archived runner for the 2026-10-12 Claude Code pilot of workflow-ablation.

This is a record of exactly what was executed, not a maintained tool and not
part of the offline suite. It calls a paid model through the `claude` CLI.

Usage (from the repository root):
  python3 experiments/workflow-ablation/results/claude-2026-10-12/runner.py RUN_ROOT [attempt_id ...]

RUN_ROOT must be a directory whose path does not reveal this repository
(agent working directories are created inside it).
"""
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import uuid

HERE = Path(__file__).resolve().parent
PKG = HERE.parent.parent
REPO = PKG.parent.parent
TOOLS = "Read,Edit,Write,Bash,Glob,Grep"
DENY = [f"{tool}(//{root}/**)" for root in ("home/user", "tmp/claude-0", "root")
        for tool in ("Read", "Edit", "Write", "Grep", "Glob")]
SETTINGS = json.dumps({"permissions": {"deny": DENY}}, separators=(",", ":"))
CONDITION_FILE = {"A": "neutral.md", "B": "short.md", "C": "padded.md"}
# Env vars of the parent Claude Code session that must not leak into children.
DROP_ENV = """CLAUDE_CODE_SESSION_ID CLAUDE_CODE_REMOTE_SESSION_ID CLAUDE_CODE_MESSAGING_SOCKET
CLAUDE_CODE_MESSAGING_TOKEN CLAUDE_CODE_TEE_SDK_STDOUT CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2
CLAUDE_CODE_SYNC_SESSION_REFS CLAUDE_CODE_SYNC_SKILLS CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD
CLAUDE_ADDITIONAL_DIRECTORIES CLAUDE_CODE_CHILD_SESSION OLDPWD""".split()
LEAK_MARKERS = ("/home/user", "a1dbv", "workflow-ablation", "evaluator", "reference.patch",
                "held_out", "/tmp/claude-0")


def sha256(data):
  return hashlib.sha256(data if isinstance(data, bytes) else data.encode()).hexdigest()


def now():
  return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def prompt_for(cond):
  task = (PKG / "agent-input" / "task.md").read_text()
  extra = (PKG / "conditions" / CONDITION_FILE[cond]).read_text()
  return task.rstrip("\n") + ("\n\n" + extra if extra else "\n")


def run_unittest(cwd):
  proc = subprocess.run([sys.executable, "-I", "-B", "-m", "unittest", "discover", "-s", "tests", "-v"],
                        cwd=cwd, capture_output=True, text=True, timeout=60)
  return proc.returncode, proc.stdout + proc.stderr


def regression_check(workdir):
  """New tests must fail on the original defect for an assertion, and pass on the candidate."""
  base = PKG / "agent-input" / "baseline"
  orig_tests = (base / "tests" / "test_intervals.py").read_text()
  cand_tests = sorted(p.relative_to(workdir) for p in (workdir / "tests").rglob("*.py"))
  new_material = any((workdir / p).read_text() != orig_tests if p.name == "test_intervals.py" else True
                     for p in cand_tests)
  passes_rc, passes_out = run_unittest(workdir)
  with tempfile.TemporaryDirectory() as tmp:
    shutil.copy(base / "intervals.py", Path(tmp) / "intervals.py")
    shutil.copytree(workdir / "tests", Path(tmp) / "tests",
                    ignore=shutil.ignore_patterns("__pycache__"))
    fail_rc, fail_out = run_unittest(tmp)
  right_reason = fail_rc != 0 and "AssertionError" in fail_out and "ImportError" not in fail_out \
      and "ModuleNotFoundError" not in fail_out
  # Existing assertions must survive verbatim.
  kept = all(line.strip() in (workdir / "tests" / "test_intervals.py").read_text()
             for line in orig_tests.splitlines() if "assert" in line) \
      if (workdir / "tests" / "test_intervals.py").exists() else False
  return {"new_test_material": new_material,
          "regression_fails_baseline_for_right_reason": bool(new_material and right_reason),
          "regression_passes_candidate": passes_rc == 0,
          "tests_weakened": not kept,
          "baseline_run_tail": fail_out[-600:], "candidate_run_tail": passes_out[-300:]}


def changed_files(workdir):
  base = PKG / "agent-input" / "baseline"
  out = []
  for p in sorted(workdir.rglob("*")):
    if p.is_dir() or "__pycache__" in p.parts or p.suffix == ".pyc":
      continue
    rel = p.relative_to(workdir)
    orig = base / rel
    if not orig.exists() or orig.read_bytes() != p.read_bytes():
      out.append(str(rel))
  return out


def sanitize(text, workdir):
  return str(text).replace(str(workdir), "<work>")


def main(run_root, only):
  run_root = Path(run_root).resolve()
  sched = json.loads((HERE / "schedule.json").read_text())["schedule"]
  revision = subprocess.run(["git", "rev-parse", "HEAD"], cwd=REPO, capture_output=True, text=True).stdout.strip()
  dirty = subprocess.run(["git", "diff", "HEAD"], cwd=REPO, capture_output=True).stdout
  manifest_sha = sha256((PKG / "manifest.json").read_bytes())
  out_dir = HERE / "runs"
  out_dir.mkdir(exist_ok=True)
  env = {k: v for k, v in os.environ.items() if k not in DROP_ENV}
  for item in sched:
    aid = item["attempt_id"]
    if only and aid not in only:
      continue
    if (out_dir / f"{aid}.json").exists():
      print("skip existing", aid)
      continue
    workdir = run_root / uuid.uuid4().hex[:12]
    shutil.copytree(PKG / "agent-input" / "baseline", workdir)
    prompt = prompt_for(item["condition"])
    cmd = ["claude", "-p", "--no-session-persistence", "--session-id", str(uuid.uuid4()),
           "--output-format", "stream-json", "--verbose", "--model", item["model"],
           f"--tools={TOOLS}", f"--allowedTools={TOOLS}", "--settings", SETTINGS,
           "--max-budget-usd", "1.00", prompt]
    env["PWD"] = str(workdir)
    started, t0 = now(), datetime.datetime.now().timestamp()
    status, failure = "completed", None
    try:
      proc = subprocess.run(cmd, cwd=workdir, env=env, stdin=subprocess.DEVNULL,
                            capture_output=True, text=True, timeout=900)
      stream = proc.stdout
    except subprocess.TimeoutExpired as exc:
      stream, status, failure = (exc.stdout or b"").decode() if isinstance(exc.stdout, bytes) else (exc.stdout or ""), "timeout", "timeout"
    wall = round(datetime.datetime.now().timestamp() - t0, 1)
    events = []
    for line in stream.splitlines():
      try:
        events.append(json.loads(line))
      except ValueError:
        pass
    init = next((e for e in events if e.get("type") == "system" and e.get("subtype") == "init"), {})
    result = next((e for e in events if e.get("type") == "result"), None)
    if result is None and status == "completed":
      status, failure = "failed", "no_result_event"
    tool_calls, commands, leaks = 0, [], []
    for e in events:
      if e.get("type") == "assistant":
        for c in e["message"].get("content", []):
          if c.get("type") == "tool_use":
            tool_calls += 1
            blob = json.dumps(c["input"], ensure_ascii=False)
            commands.append({"tool": c["name"], "input": sanitize(blob, workdir)[:2000]})
            leaks += [m for m in LEAK_MARKERS if m in blob]
    # Freeze candidate, then grade in the trusted evaluator.
    cand_hash = sha256(b"".join((workdir / f).read_bytes() for f in changed_files(workdir)) or b"")
    grade = subprocess.run([sys.executable, str(PKG / "evaluator" / "grade.py"), str(workdir), "--timeout", "20"],
                           capture_output=True, text=True)
    try:
      grade_json = json.loads(grade.stdout)
    except ValueError:
      grade_json = {"accepted": False, "error": grade.stdout[-500:] + grade.stderr[-500:]}
    reg = regression_check(workdir)
    changed = changed_files(workdir)
    scope_ok = all(f == "intervals.py" or f.startswith("tests/") for f in changed)
    diff = subprocess.run(["diff", "-ruN", "-x", "__pycache__", str(PKG / "agent-input" / "baseline"), str(workdir)],
                          capture_output=True, text=True).stdout
    diff = diff.replace(str(PKG / "agent-input" / "baseline"), "a").replace(str(workdir), "b")
    usage = (result or {}).get("usage", {})
    model_usage = (result or {}).get("modelUsage", {})
    record = json.loads((PKG / "results" / "run.template.json").read_text())
    record.update({
      "record_kind": "run", "experiment_id": "wfa-claude-pilot-2026-10-12",
      "pair_id": item["pair_id"], "attempt_id": aid, "condition": item["condition"],
      "order_index": item["order_index"], "status": status,
      "started_at_utc": started, "finished_at_utc": now(), "failure_category": failure,
      "notes": "Pilot run by Claude Code (claude -p). Bash is not sandboxed; see leak_markers."})
    record["pins"].update({
      "revision": revision, "dirty_diff_sha256": sha256(dirty), "manifest_sha256": manifest_sha,
      "environment_digest": None, "python": sys.version.split()[0],
      "client_version": init.get("claude_code_version"),
      "model_snapshot": ",".join(model_usage) or item["model"], "effort": "client default",
      "seed": None, "prompt_sha256": sha256(prompt),
      "tool_config_sha256": sha256(TOOLS + SETTINGS)})
    record["quality"].update({
      "public_pass": grade_json.get("suites", {}).get("public", {}).get("passed"),
      "held_out_pass": grade_json.get("suites", {}).get("held_out", {}).get("passed"),
      "accepted_behavior": grade_json.get("accepted"),
      "agent_claimed_success": None,
      "regression_fails_baseline_for_right_reason": reg["regression_fails_baseline_for_right_reason"],
      "regression_passes_candidate": reg["regression_passes_candidate"],
      "scope_compliant": scope_ok, "tests_weakened": reg["tests_weakened"]})
    record["time_seconds"]["wall"] = wall
    record["usage"].update({
      "uncached_input_tokens": usage.get("input_tokens"),
      "cache_read_tokens": usage.get("cache_read_input_tokens"),
      "cache_write_tokens": usage.get("cache_creation_input_tokens"),
      "output_tokens": usage.get("output_tokens"), "reasoning_tokens": None,
      "reasoning_is_output_subset": None, "requests": None, "retries": None,
      "subagent_requests": 0, "tool_calls": tool_calls, "includes_subagents": True,
      "provider_field_definitions": "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"})
    record["cost"].update({
      "currency": "USD", "api_estimate": (result or {}).get("total_cost_usd"),
      "price_as_of": "2026-10-12", "billing_source": None})
    record["evidence"].update({
      "candidate_sha256": cand_hash, "diff_path": f"runs/{aid}.diff",
      "transcript_path": f"runs/{aid}.commands.json", "grader_json_path": f"runs/{aid}.json#grader",
      "commands_and_exit_codes_path": f"runs/{aid}.commands.json", "billing_source": "client total_cost_usd (API-equivalent estimate)"})
    record["extra"] = {
      "model": item["model"], "repeat": item["repeat"], "num_turns": (result or {}).get("num_turns"),
      "is_error": (result or {}).get("is_error"), "changed_files": changed,
      "leak_markers": sorted(set(leaks)), "regression_detail": reg, "grader": grade_json,
      "final_message": sanitize((result or {}).get("result", ""), workdir)[:3000]}
    (out_dir / f"{aid}.json").write_text(json.dumps(record, ensure_ascii=False, indent=1) + "\n")
    (out_dir / f"{aid}.diff").write_text(diff)
    (out_dir / f"{aid}.commands.json").write_text(json.dumps(commands, ensure_ascii=False, indent=1) + "\n")
    print(json.dumps({"attempt": aid, "status": status, "accepted": grade_json.get("accepted"),
                      "reg_ok": reg["regression_fails_baseline_for_right_reason"],
                      "scope": scope_ok, "cost": record["cost"]["api_estimate"], "wall": wall,
                      "leaks": record["extra"]["leak_markers"]}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
  if len(sys.argv) < 2:
    sys.exit(__doc__)
  main(sys.argv[1], set(sys.argv[2:]))
