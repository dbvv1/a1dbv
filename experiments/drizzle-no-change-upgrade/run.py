"""Run the author's unchanged schema through two installed Drizzle CLI versions."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys

BASE = "f82ce2201728d56b34cbf43cd21c88b6b001da02"
INPUTS = {
  "schema.ts": "c21b32de5702bf85640acc48ca82c1adfebda1d7ea8e5e144be20b3d5a27f7be",
  "drizzle.config.ts": "4706ee54b3b357f6a72b3e39777a7054c3b43cc4ea3a44c924b777c82db97a6c",
  "package.json": "16abd3f9546fb71ff4c0b99cb912ba231ff292ba13cf23a441d99c888345a9b8",
  "drizzle/0000_flippant_lockjaw.sql": "5d5d4835f1f3e1fa9568aaf3f6ce3123230ef6155eee4ba2b6bf99310147a697",
  "drizzle/meta/0000_snapshot.json": "9589a9e73c6e42cc7e0f1a5310eee40956f198e4877d8ff86b0735d1e1d968a6",
  "drizzle/meta/_journal.json": "d1475af77bcb37ae96487c6b1ba2840e31420b998b77b69a4ba0070423f7d53d",
}


def sha(data):
  return hashlib.sha256(data).hexdigest()


def require(condition, message):
  if not condition:
    raise ValueError(message)


def inventory(root):
  return {str(p.relative_to(root)): p.read_bytes()
          for p in sorted(root.rglob("*")) if p.is_file()}


def main(argv=None):
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("source", type=Path, help="public reproduction Git checkout")
  parser.add_argument("rc4", type=Path, help="directory containing installed node_modules")
  parser.add_argument("rc5", type=Path, help="directory containing installed node_modules")
  parser.add_argument("output", type=Path, help="new, nonexistent local output directory")
  args = parser.parse_args(argv)
  node = shutil.which("node")
  require(node, "Node.js is required")
  require(not os.path.lexists(args.output), "output already exists; use a new directory")
  # Read only fixed files from the fixed commit, not the checkout's current worktree.
  inputs = {}
  for name, expected in INPUTS.items():
    data = subprocess.check_output(["git", "-C", str(args.source), "show", f"{BASE}:{name}"])
    require(sha(data) == expected, f"source mismatch: {name}")
    inputs[name] = data
  dependencies = []
  for rc, prefix in [(4, args.rc4), (5, args.rc5)]:
    modules = (prefix / "node_modules").resolve(strict=True)
    for package in ["drizzle-kit", "drizzle-orm"]:
      metadata = json.loads((modules / package / "package.json").read_text())
      require(isinstance(metadata, dict) and isinstance(metadata.get("version"), str),
              f"invalid {package} metadata: version missing or not a string")
      version = metadata["version"]
      require(version == f"1.0.0-rc.{rc}", f"unexpected {package} version for rc{rc}")
    require((modules / "drizzle-kit/bin.cjs").is_file(), "installed CLI missing")
    dependencies.append((rc, modules))

  args.output.mkdir()
  results = []
  for rc, modules in dependencies:
    root = (args.output / f"rc{rc}").resolve()
    for name, data in inputs.items():
      target = root / name
      target.parent.mkdir(parents=True, exist_ok=True)
      target.write_bytes(data)
    package = json.loads(inputs["package.json"])
    package["dependencies"]["drizzle-orm"] = f"1.0.0-rc.{rc}"
    package["devDependencies"]["drizzle-kit"] = f"1.0.0-rc.{rc}"
    (root / "package.json").write_text(json.dumps(package, indent=2) + "\n")
    (root / "node_modules").symlink_to(modules, target_is_directory=True)
    home = root / "isolated-home"
    home.mkdir()
    env = {"PATH": str(Path(node).parent) + os.pathsep + os.defpath,
           "HOME": str(home), "TMPDIR": str(home), "LANG": "C.UTF-8",
           "NO_COLOR": "1", "CI": "1"}
    cli = modules / "drizzle-kit/bin.cjs"
    states, exits = [], []
    for stage, command in [("up", "up"), ("first-generate", "generate"),
                           ("second-generate", "generate")]:
      child = subprocess.run([node, str(cli), command, "--config=drizzle.config.ts"],
                             cwd=root, env=env, stdin=subprocess.DEVNULL,
                             capture_output=True, timeout=90)
      (root / f"{stage}.stdout.txt").write_bytes(child.stdout)
      (root / f"{stage}.stderr.txt").write_bytes(child.stderr)
      require(child.returncode == 0, f"rc{rc} {stage} failed; inspect local logs")
      exits.append(child.returncode)
      state = inventory(root / "drizzle")
      # Preserve each transition, including the first SQL, not just the stable end.
      (root / f"{stage}.files.json").write_text(json.dumps(
        {name: data.decode("utf-8") for name, data in state.items()}, indent=2))
      states.append(state)
    up, first, second = states
    new_sql = [data.decode("utf-8") for name, data in first.items()
               if name.endswith(".sql") and name not in up]
    statements = [part.strip() for sql in new_sql
                  for part in sql.split("--> statement-breakpoint") if part.strip()]
    # Classification is specific to this public fixture, not a general SQL parser.
    counts = {"statements": len(statements), "typeAlter": 0, "indexDrop": 0,
              "indexCreate": 0, "checkReplace": 0, "viewDDL": 0}
    for statement in statements:
      counts["typeAlter"] += "SET DATA TYPE" in statement
      counts["indexDrop"] += statement.startswith("DROP INDEX")
      counts["indexCreate"] += statement.startswith("CREATE INDEX")
      counts["checkReplace"] += "DROP CONSTRAINT" in statement and "CHECK (" in statement
      counts["viewDDL"] += bool(re.search(r"\b(?:CREATE|ALTER|DROP) VIEW\b", statement))
    unchanged = all((root / name).read_bytes() == inputs[name]
                    for name in ["schema.ts", "drizzle.config.ts"])
    preserved = all(inputs["drizzle/0000_flippant_lockjaw.sql"] in
                    [data for name, data in state.items() if name.endswith(".sql")]
                    for state in states)
    require(unchanged and preserved and first == second,
            f"rc{rc} input/history preservation or second-run stability failed")
    versions = set()
    for name, data in up.items():
      if name.endswith("snapshot.json"):
        snapshot = json.loads(data)
        require(isinstance(snapshot, dict) and isinstance(snapshot.get("version"), str),
                f"rc{rc} invalid snapshot version")
        versions.add(snapshot["version"])
    require(versions, f"rc{rc} no converted snapshot")
    results.append({"version": f"1.0.0-rc.{rc}", "cliSha256": sha(cli.read_bytes()),
                    "cliExitCodes": exits, "schemaAndConfigUnchanged": unchanged,
                    "historicalSqlPreserved": preserved,
                    "upSnapshotVersions": sorted(versions),
                    "firstGenerate": {"newMigrations": len(new_sql), **counts},
                    "secondGenerateUnchanged": first == second})
  failures = sum(item["firstGenerate"]["newMigrations"] != 0 for item in results)
  report = {"sourceCommit": BASE, "node": subprocess.check_output([node, "--version"],
            text=True, env=env).strip(), "platform": sys.platform,
            "schemaSha256": INPUTS["schema.ts"],
            "configSha256": INPUTS["drizzle.config.ts"], "results": results,
            "acceptance": {"noChangeUpgradeFailures": failures, "passed": failures == 0}}
  text = json.dumps(report, indent=2) + "\n"
  (args.output / "result.json").write_text(text)
  print(text, end="")
  return 1 if failures else 0


if __name__ == "__main__":
  try:
    sys.exit(main())
  except (OSError, ValueError, subprocess.SubprocessError) as error:
    print(f"Probe setup/runtime error: {error}", file=sys.stderr)
    sys.exit(2)
