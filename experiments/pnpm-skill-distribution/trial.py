#!/usr/bin/env python3
"""Offline pnpm distribution probe. Uses an existing verified binary; no downloads.

Only writes a NEW output directory. No model, client activation, package scripts,
registry publication, global configuration, or repository edits are performed.
The source must be the fixed public a1dbv Skill; its instructions are never run.
"""
import argparse
import gzip
import hashlib
import io
import json
import os
import re
from pathlib import Path
import subprocess
import tarfile
from datetime import datetime, timezone

SOURCE_COMMIT = "cf1bacf6daaab1211231bd4cb4a59351aaabfff9"
SOURCE_PATH = "templates/generic/.claude/skills/task-decisions/SKILL.md"
SOURCE_SHA256 = "c11c13e9d5890e2c44bf147fbc195996f069561f2ff093a924720c6bbb813d1f"
BINARY_SHA256 = "79957904276d2e00848c6ce8c875c472b465c6bdc6454a65469162b9b85f1dde"
SKILL_LINK = "pnpm-a1dbv-template-trial-task-decisions"
DIRS = [".claude/skills", ".agents/skills"]
INSTALL = ["install", "--offline", "--ignore-scripts", "--ignore-pnpmfile", "--reporter", "append-only"]


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pnpm", type=Path, required=True)
    parser.add_argument("--source-skill", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    binary = args.pnpm.resolve(strict=True)
    source = args.source_skill.read_bytes()
    if digest(binary.read_bytes()) != BINARY_SHA256:
        raise SystemExit("This receipt requires the verified Linux x64 pnpm 12.11.0 binary.")
    if digest(source) != SOURCE_SHA256:
        raise SystemExit("Source differs from the fixed public Skill. Do not silently substitute it.")
    root = args.output.absolute()
    root.mkdir(exist_ok=False)
    for name in ["home", "config", "cache", "data", "tmp", "pnpm-home", "store", "package"]:
        (root / name).mkdir()
    env = {
        "PATH": "/usr/bin:/bin", "HOME": str(root / "home"),
        "XDG_CONFIG_HOME": str(root / "config"), "XDG_CACHE_HOME": str(root / "cache"),
        "XDG_DATA_HOME": str(root / "data"), "TMPDIR": str(root / "tmp"),
        "PNPM_HOME": str(root / "pnpm-home"), "CI": "true", "LANG": "C.UTF-8",
        "NO_UPDATE_NOTIFIER": "1", "PNPM_CONFIG_UPDATE_NOTIFIER": "false",
        "COREPACK_ENABLE_NETWORK": "0",
    }
    receipt = {
        "started_utc": datetime.now(timezone.utc).isoformat(),
        "source": {"repo": "dbvv1/a1dbv", "commit": SOURCE_COMMIT, "path": SOURCE_PATH, "sha256": SOURCE_SHA256},
        "runtime": {"package": "@pnpm/exe.linux-x64", "version": "12.11.0", "binary_sha256": BINARY_SHA256},
        "script_sha256": digest(Path(__file__).read_bytes()),
        "normalization": "Only the scratch-root path (including diagnostic line wrapping within it) and binary path are replaced with <TRIAL_ROOT> and pnpm. Outputs otherwise retained.",
        "scope": "Synthetic local package and consumers; real pnpm commands and filesystem results. No client or model adoption.",
        "runs": [],
    }

    def normalized(text):
        text = text.replace(str(root), "<TRIAL_ROOT>").replace(str(binary), "pnpm")
        wrapped_root = "".join(re.escape(char) + r"(?:\n[ \t]*[│|][ \t]*)?" for char in str(root))
        return re.sub(wrapped_root, "<TRIAL_ROOT>", text)

    def save():
        (root / "receipt.json").write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n")

    def state(cwd):
        entries = {}
        for name in DIRS:
            link = cwd / name / SKILL_LINK
            body = link / "SKILL.md"
            entries[name] = {
                "directory_exists": (cwd / name).exists(), "link_exists": link.exists(),
                "symlink": link.is_symlink(), "body_sha256": digest(body.read_bytes()) if body.is_file() else None,
                "target": os.readlink(link) if link.is_symlink() else None,
            }
        policy = cwd / "pnpm-workspace.yaml"
        lock = cwd / "pnpm-lock.yaml"
        return {"entries": entries,
                "policy": normalized(policy.read_text()) if policy.exists() else None,
                "lock_sha256": digest(lock.read_bytes()) if lock.exists() else None}

    def run(label, cwd, command, expected=0, error=None):
        result = subprocess.run([str(binary)] + command, cwd=cwd, env=env, text=True, capture_output=True, timeout=60)
        observation = {"label": label, "command": ["pnpm"] + command,
                       "exit_code": result.returncode, "stdout": normalized(result.stdout),
                       "stderr": normalized(result.stderr), "state": state(cwd)}
        receipt["runs"].append(observation)
        save()
        assert result.returncode == expected, (label, result.returncode, result.stderr)
        if error:
            assert error in result.stderr, label
        return observation["state"]

    run("version", root, ["--version"])
    assert receipt["runs"][0]["stdout"].strip() == "12.11.0"
    hashes = {}
    for version in (1, 2):
        body = source + (b"\n<!-- Distribution fixture v2; not activated. -->\n" if version == 2 else b"")
        hashes[version] = digest(body)
        files = {
            "package/package.json": json.dumps({"name": "a1dbv-template-trial", "version": f"{version}.0.0", "private": True}).encode(),
            "package/skills/task-decisions/SKILL.md": body,
        }
        # pnpm expects gzip tarballs. Fix gzip/tar metadata for reproducibility.
        with (root / "package" / f"template-v{version}.tgz").open("wb") as raw:
            with gzip.GzipFile(filename="", mode="wb", fileobj=raw, mtime=0) as compressed:
                with tarfile.open(fileobj=compressed, mode="w") as archive:
                    for name, data in files.items():
                        info = tarfile.TarInfo(name)
                        info.size, info.mode, info.mtime = len(data), 0o644, 0
                        archive.addfile(info, io.BytesIO(data))

    def source_id(version):
        return f"a1dbv-template-trial@file:../package/template-v{version}.tgz"

    def manifest(cwd, version):
        (cwd / "package.json").write_text(json.dumps({"name": "a1dbv-skill-consumer", "version": "1.0.0", "private": True,
            "dependencies": {"a1dbv-template-trial": f"file:../package/template-v{version}.tgz"}}, indent=2) + "\n")

    def consumer(name, dirs):
        cwd = root / name
        cwd.mkdir()
        manifest(cwd, 1)
        (cwd / "pnpm-workspace.yaml").write_text("ignoreScripts: true\nignorePnpmfile: true\nupdateNotifier: false\nstoreDir: " + json.dumps(str(root / "store")) + "\n")
        for directory in dirs:
            (cwd / directory).mkdir(parents=True)
        return cwd

    def linked(snapshot, version):
        return all(snapshot["entries"][d]["symlink"] and snapshot["entries"][d]["body_sha256"] == hashes[version] for d in DIRS)

    def unlinked(snapshot):
        return all(not snapshot["entries"][d]["link_exists"] for d in DIRS)

    cwd = consumer("consumer", DIRS)
    sentinel = cwd / ".claude/skills/manual-skill/SKILL.md"
    sentinel.parent.mkdir()
    sentinel.write_text("Manual sentinel, must remain unchanged.\n")
    assert unlinked(run("unapproved", cwd, INSTALL))
    approved = run("approved", cwd, ["approve", source_id(1)])
    assert linked(approved, 1)
    for directory in DIRS:
        assert (cwd / directory / ".gitignore").read_text() == "pnpm-*\n"
    repeated = run("frozen-repeat", cwd, INSTALL + ["--frozen-lockfile"])
    assert linked(repeated, 1) and repeated["lock_sha256"] == approved["lock_sha256"]
    manifest(cwd, 2)
    assert unlinked(run("new-tar-source-awaits-approval", cwd, INSTALL + ["--no-frozen-lockfile"]))
    assert linked(run("approve-new-source", cwd, ["approve", source_id(2)]), 2)
    denied = run("revoke-new-source", cwd, ["approve", "!" + source_id(2)])
    assert unlinked(denied) and "skills: false" in denied["policy"]
    assert sentinel.read_text() == "Manual sentinel, must remain unchanged.\n"

    for case, error in [("conflict", "ERR_PNPM_AGENT_SKILL_PATH_OCCUPIED"), ("no-target-dirs", "ERR_PNPM_NO_AGENT_SKILLS_DIR")]:
        cwd = consumer("consumer-" + case, DIRS if case == "conflict" else [])
        manual = cwd / ".claude/skills" / SKILL_LINK / "SKILL.md"
        if case == "conflict":
            manual.parent.mkdir()
            manual.write_text("Existing manual entry. Do not overwrite.\n")
        run(case + "-install", cwd, INSTALL)
        failed = run(case + "-approve", cwd, ["approve", source_id(1)], expected=1, error=error)
        assert "skills: true" in failed["policy"], "Approval was expected to persist before the link error"
        if case == "conflict":
            assert manual.read_text() == "Existing manual entry. Do not overwrite.\n"
        with (cwd / "pnpm-workspace.yaml").open("a") as file:
            file.write("skills:\n  dirs:\n    - .agents/skills\n")
        recovered = run(case + "-explicit-target", cwd, INSTALL + ["--frozen-lockfile"])
        assert recovered["entries"][".agents/skills"]["body_sha256"] == hashes[1]
        if case == "conflict":
            assert manual.read_text() == "Existing manual entry. Do not overwrite.\n"

    receipt["completed_utc"] = datetime.now(timezone.utc).isoformat()
    receipt["assertions"] = "All specified distribution assertions passed, including two expected error exits and preserved approval state."
    receipt["unverified"] = ["Client discovery/loading", "Model behavior or benefit", "Windows/macOS", "Registry-version upgrade approval", "monorepos/multiple package versions", "prod/dev filtering"]
    save()
    print(json.dumps({"runs": len(receipt["runs"]), "expected_error_exits": 2, "result": receipt["assertions"]}))


if __name__ == "__main__":
    main()
