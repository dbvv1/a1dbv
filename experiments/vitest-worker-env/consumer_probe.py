#!/usr/bin/env python3
"""Run installed official Vitest releases against local string-only fixtures."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys


CASES = [
  ("4.1.11", "reuse", 8, 2, False),
  ("5.0.5", "reuse", 8, 2, True),
  ("5.0.5", "setup", 8, 2, False),
  ("5.0.5", "unstub", 8, 2, True),
  ("5.0.5", "default-isolation", 8, 2, False),
  ("4.1.11", "reuse", 2, 1, True),
  ("5.0.5", "reuse", 2, 1, True),
]


def require(condition, message):
  if not condition:
    raise ValueError(message)


def clean_env(node, home):
  return {
    "PATH": str(node.parent) + os.pathsep + os.defpath,
    "HOME": str(home), "CI": "1", "NO_COLOR": "1", "LC_ALL": "C.UTF-8",
  }


def installed_versions(node, install):
  package = install / "node_modules/vitest/package.json"
  require(package.is_file(), "Vitest installation is missing")
  require((package.parent / "vitest.mjs").is_file(), "Vitest CLI is missing")
  js = """const {createRequire} = require('node:module');
const req = createRequire(process.argv[1]);
console.log(JSON.stringify({node:process.version,
  vitest:req('./package.json').version, vite:req('vite/package.json').version}));"""
  proc = subprocess.run(
    [str(node), "-e", js, str(package)], env=clean_env(node, install),
    text=True, capture_output=True, timeout=15, check=True,
  )
  return json.loads(proc.stdout)


def run_case(node, install, root, version, mode, count, workers, expect_leak):
  name = f"{version}-{mode}-{count}-{workers}"
  directory = root / name
  directory.mkdir()
  (directory / "home").mkdir()
  (directory / "receipts").mkdir()
  (directory / "node_modules").symlink_to(install / "node_modules", target_is_directory=True)
  test = {
    "include": ["f*.test.mjs"], "pool": "forks", "maxWorkers": workers,
    "env": {"TRIAL_TARGET": "shared-sentinel"},
    "reporters": ["json"], "outputFile": str(directory / "report.json"),
  }
  if mode != "default-isolation":
    test["isolate"] = False
  if mode == "unstub":
    test["unstubEnvs"] = True
  if mode == "setup":
    (directory / "setup.mjs").write_text(
      "process.env.TRIAL_TARGET = 'shared-sentinel';\n", encoding="utf-8",
    )
    test["setupFiles"] = ["./setup.mjs"]
  (directory / "vitest.config.mjs").write_text(
    "export default " + json.dumps({"test": test}) + ";\n", encoding="utf-8",
  )
  expected_files = {f"f{i + 1:02d}" for i in range(count)}
  for file in sorted(expected_files):
    (directory / f"{file}.test.mjs").write_text(f"""import {{ expect, it }} from 'vitest';
import {{ writeFileSync }} from 'node:fs';
const seen = process.env.TRIAL_TARGET;
process.env.TRIAL_TARGET = 'private-sentinel-{file}';
writeFileSync(new URL('./receipts/{file}.json', import.meta.url),
  JSON.stringify({{file:'{file}', pid:process.pid, seen}}));
it('{file} sees configured entry value', () => expect(seen).toBe('shared-sentinel'));
""", encoding="utf-8")
  proc = subprocess.run(
    [str(node), str(install / "node_modules/vitest/vitest.mjs"), "run"],
    cwd=directory, env=clean_env(node, directory / "home"),
    text=True, capture_output=True, timeout=90,
  )
  (directory / "stdout.txt").write_text(proc.stdout, encoding="utf-8")
  (directory / "stderr.txt").write_text(proc.stderr, encoding="utf-8")
  require((directory / "report.json").is_file(), f"{name}: no test report")
  report = json.loads((directory / "report.json").read_text(encoding="utf-8"))
  receipts = [json.loads(p.read_text(encoding="utf-8"))
              for p in sorted((directory / "receipts").glob("*.json"))]
  require(len(receipts) == count, f"{name}: missing/extra receipts")
  require({r["file"] for r in receipts} == expected_files, f"{name}: wrong receipt identities")
  require(report["numTotalTests"] == count, f"{name}: wrong test count")
  require(report["numTotalTestSuites"] == count, f"{name}: wrong suite count")
  require(all(report[k] == 0 for k in ("numPendingTests", "numTodoTests", "numPendingTestSuites")),
          f"{name}: skipped/pending tests")
  require(len(report["testResults"]) == count, f"{name}: missing/extra file results")
  seen_files = set()
  for result in report["testResults"]:
    file = Path(result["name"]).name.removesuffix(".test.mjs")
    seen_files.add(file)
    assertions = result["assertionResults"]
    require(len(assertions) == 1, f"{name}: collection failure or extra assertions")
    receipt = next((r for r in receipts if r["file"] == file), None)
    require(receipt is not None, f"{name}: assertion without receipt")
    expected_status = "passed" if receipt["seen"] == "shared-sentinel" else "failed"
    require(assertions[0]["status"] == expected_status, f"{name}: unrelated failure")
    require(result["status"] == expected_status, f"{name}: suite failure outside assertion")
  require(seen_files == expected_files, f"{name}: wrong file results")
  require(all(isinstance(r["pid"], int) and r["pid"] > 0 for r in receipts), f"{name}: missing PID")
  pids = {r["pid"] for r in receipts}
  if mode != "default-isolation":
    require(len(pids) <= workers and len(pids) < count, f"{name}: no verified worker reuse")
  leaked = sum(r["seen"] != "shared-sentinel" for r in receipts)
  allowed_values = {"shared-sentinel"} | {f"private-sentinel-{f}" for f in expected_files}
  require(all(r["seen"] in allowed_values for r in receipts), f"{name}: unexpected environment value")
  for receipt in receipts:
    if receipt["seen"] != "shared-sentinel":
      source = receipt["seen"].removeprefix("private-sentinel-")
      require(any(r["file"] == source and r["pid"] == receipt["pid"] and r["file"] != receipt["file"]
                  for r in receipts), f"{name}: value not written by another file in same worker")
  require(report["numFailedTests"] == leaked and report["numPassedTests"] == count - leaked,
          f"{name}: report disagrees with observations")
  require(proc.returncode == (1 if leaked else 0), f"{name}: unexpected CLI exit")
  require(report["success"] == (leaked == 0), f"{name}: report not successful as expected")
  # These expectations apply only to the pinned releases and this fixture.
  require((leaked > 0) == expect_leak, f"{name}: behavior differs from recorded comparison")
  labels = {}
  observations = []
  for receipt in receipts:
    worker = labels.setdefault(receipt["pid"], f"worker-{len(labels) + 1}")
    observations.append({"file": receipt["file"], "worker": worker, "seen": receipt["seen"]})
  return {
    "vitest": version, "mode": mode, "files": count, "maxWorkers": workers,
    "actualWorkers": len(pids), "exit": proc.returncode,
    "passed": count - leaked, "failed": leaked,
    "receiptCoverageValid": True, "observations": observations,
  }


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("--vitest4", type=Path, required=True, help="install directory containing node_modules")
  parser.add_argument("--vitest5", type=Path, required=True, help="install directory containing node_modules")
  parser.add_argument("--root", type=Path, required=True, help="new absolute output directory; must not exist")
  args = parser.parse_args()
  require(args.root.is_absolute(), "--root must be absolute")
  require(not args.root.exists() and not args.root.is_symlink(), "--root must not already exist")
  require(args.root.parent.is_dir(), "--root parent must exist")
  node_path = shutil.which("node")
  require(node_path is not None, "node is missing")
  node = Path(node_path).resolve()
  installs = {"4.1.11": args.vitest4.resolve(), "5.0.5": args.vitest5.resolve()}
  versions = {v: installed_versions(node, p) for v, p in installs.items()}
  require(all(m["vitest"] == v for v, m in versions.items()), "installed Vitest version differs")
  require(len({m["vite"] for m in versions.values()}) == 1, "Vite versions must match")
  args.root.mkdir()
  output = {"schema": 1, "scope": "synthetic-string-only-forks", "runtime": versions, "cases": []}
  for version, mode, count, workers, leak in CASES:
    row = run_case(node, installs[version], args.root, version, mode, count, workers, leak)
    output["cases"].append(row)
    (args.root / "results.json").write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
    print(f"{version} {mode} {count}/{workers}: {row['passed']} pass, {row['failed']} fail; "
          f"{row['actualWorkers']} actual workers", flush=True)
  return 0


if __name__ == "__main__":
  try:
    sys.exit(main())
  except (ValueError, OSError, subprocess.SubprocessError) as exc:
    print(f"probe failed: {exc}", file=sys.stderr)
    sys.exit(2)
