#!/usr/bin/env python3
"""Verify installed skills CLI output against its actual installed Skill path."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys


SKILL_SHA256 = "c00eeea0e13e74fe4a9d84ba0a8542205a1b736d65f13134fe1a6647eb14976f"


def require(condition, message):
  if not condition:
    raise ValueError(message)


def sha(path):
  return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("--package-root", type=Path, required=True, help="installed skills package directory")
  parser.add_argument("--skill-dir", type=Path, required=True, help="fixed official find-skills directory")
  parser.add_argument("--root", type=Path, required=True, help="new absolute result directory")
  args = parser.parse_args()
  require(args.root.is_absolute(), "--root must be absolute")
  require(not args.root.exists() and not args.root.is_symlink(), "--root must not exist")
  require(args.root.parent.is_dir(), "--root parent must exist")
  package = args.package_root.resolve()
  source = args.skill_dir.resolve()
  require((package / "package.json").is_file(), "missing package")
  require((package / "bin/cli.mjs").is_file(), "missing CLI")
  require((source / "SKILL.md").is_file(), "missing source Skill")
  require(sha(source / "SKILL.md") == SKILL_SHA256, "source Skill differs from fixed upstream file")
  metadata = json.loads((package / "package.json").read_text(encoding="utf-8"))
  require(metadata["name"] == "skills" and metadata["version"] == "1.7.4", "expected official skills 1.7.4")
  node_cmd = shutil.which("node")
  require(node_cmd is not None, "node is missing")
  node = Path(node_cmd).resolve()
  args.root.mkdir()
  runtime_env = {"PATH": str(node.parent) + os.pathsep + os.defpath,
                 "HOME": str(args.root), "CI": "1", "NO_COLOR": "1",
                 "DISABLE_TELEMETRY": "1", "DO_NOT_TRACK": "1"}
  node_version = subprocess.check_output([str(node), "--version"], env=runtime_env, text=True).strip()
  result = {"schema": 1, "skills": metadata["version"], "node": node_version,
            "skillSha256": SKILL_SHA256, "scope": "local-file-resource-consumer-no-model", "cases": []}
  expected_body = (source / "SKILL.md").read_text(encoding="utf-8").strip()

  for layout, agents in [("ordinary", ["claude-code", "codex"]),
                         ("dotfiles", ["claude-code", "codex"]),
                         ("dotfiles-single", ["claude-code"]),
                         ("canonical-alias", ["claude-code", "codex"])]:
    directory = args.root / layout
    directory.mkdir()
    home = directory / "home"
    home.mkdir()
    cwd = directory / "cwd"
    cwd.mkdir()
    agent_dir = home / ".claude/skills"
    agent_dir.parent.mkdir()
    canonical = home / ".agents/skills/find-skills"
    if layout.startswith("dotfiles"):
      real_dir = home / "dotfiles/config/claude/skills"
      real_dir.mkdir(parents=True)
      agent_dir.symlink_to(real_dir, target_is_directory=True)
    elif layout == "canonical-alias":
      real_dir = canonical.parent
      real_dir.mkdir(parents=True)
      agent_dir.symlink_to(real_dir, target_is_directory=True)
    else:
      agent_dir.mkdir()
    (agent_dir / "KEEP.txt").write_text("unrelated fixture file\n", encoding="utf-8")
    keep_hash = sha(agent_dir / "KEEP.txt")
    parent_link = os.readlink(agent_dir) if agent_dir.is_symlink() else None
    env = {**runtime_env, "HOME": str(home), "XDG_CONFIG_HOME": str(home / ".config"),
           "XDG_CACHE_HOME": str(home / ".cache"), "TMPDIR": str(directory)}
    calls = []

    def run(label, cli_args):
      proc = subprocess.run([str(node), str(package / "bin/cli.mjs"), *cli_args],
                            cwd=cwd, env=env, text=True, capture_output=True, timeout=45)
      (directory / f"{label}.stdout").write_text(proc.stdout, encoding="utf-8")
      (directory / f"{label}.stderr").write_text(proc.stderr, encoding="utf-8")
      return proc

    install_args = ["add", str(source), "--global", "--agent", *agents, "--yes", "--json"]
    steps = ["install", "reinstall", "copy-repair"] if layout == "dotfiles" else ["install"]
    for step in steps:
      proc = run(step, install_args + (["--copy"] if step == "copy-repair" else []))
      require(proc.returncode == 0, f"{layout}/{step}: install CLI failed")
      installs = json.loads(proc.stdout)
      require(len(installs) == 1 and installs[0]["name"] == "find-skills"
              and installs[0]["status"] == "installed", f"{layout}/{step}: unexpected install report")
      dest = agent_dir / "find-skills"
      readable = (dest / "SKILL.md").is_file()
      expected_readable = layout != "dotfiles" or step == "copy-repair"
      expected_mode = "copy" if layout == "dotfiles-single" or step == "copy-repair" else "symlink"
      require(installs[0]["mode"] == expected_mode, f"{layout}/{step}: unexpected installation mode")
      require(readable == expected_readable, f"{layout}/{step}: behavior differs from pinned comparison")
      if readable:
        require(sha(dest / "SKILL.md") == SKILL_SHA256, f"{layout}/{step}: installed content differs")
      else:
        require(dest.is_symlink() and not dest.exists(), f"{layout}/{step}: expected dangling link")
        require((canonical / "SKILL.md").is_file(), f"{layout}/{step}: canonical source missing")
      use = run(step + "-use", ["use", str(dest)])
      require(use.returncode == (0 if readable else 1), f"{layout}/{step}: unexpected use exit")
      require((expected_body in use.stdout) == readable, f"{layout}/{step}: consumer body mismatch")
      listing = run(step + "-list", ["list", "--global", "--agent", "claude-code", "--json"])
      require(listing.returncode == 0, f"{layout}/{step}: listing failed")
      listed = [x for x in json.loads(listing.stdout) if x["name"] == "find-skills"]
      require(len(listed) == 1, f"{layout}/{step}: expected one named listing")
      require(("Claude Code" in listed[0]["agents"]) == readable, f"{layout}/{step}: agent association mismatch")
      require(sha(agent_dir / "KEEP.txt") == keep_hash, f"{layout}/{step}: unrelated file changed")
      require((os.readlink(agent_dir) if agent_dir.is_symlink() else None) == parent_link,
              f"{layout}/{step}: parent link changed")
      require(sha(source / "SKILL.md") == SKILL_SHA256, f"{layout}/{step}: source changed")
      if (canonical / "SKILL.md").is_file():
        require(sha(canonical / "SKILL.md") == SKILL_SHA256, f"{layout}/{step}: canonical content changed")
      calls.append({"step": step, "installExit": proc.returncode, "reportedMode": installs[0]["mode"],
                    "installedSkillReadable": readable, "useExit": use.returncode,
                    "useHasFullSkill": expected_body in use.stdout,
                    "filteredListEntries": len(listed), "listedAgents": listed[0]["agents"],
                    "parentAndUnrelatedFilePreserved": True})
      print(f"{layout}/{step}: mode={installs[0]['mode']} readable={readable} use={use.returncode}", flush=True)
    result["cases"].append({"layout": layout, "agents": agents, "steps": calls})
    (args.root / "results.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
  return 0


if __name__ == "__main__":
  try:
    sys.exit(main())
  except (ValueError, OSError, subprocess.SubprocessError) as exc:
    print(f"probe failed: {exc}", file=sys.stderr)
    sys.exit(2)
