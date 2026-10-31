#!/usr/bin/env python3
"""Compare submodule pin rebases in fresh, file-only Git fixtures.

Print normalized JSON to stdout and the retained raw-evidence directory to stderr.
No credentials, network remotes, existing repositories, or global config are used.
"""
import json
from pathlib import Path
import subprocess
import sys
import tempfile


root = Path(tempfile.mkdtemp(prefix="gh-pin-independent-"))
(root / "home").mkdir()
env = {
    "PATH": "/usr/bin:/bin",
    "HOME": str(root / "home"),
    "GIT_CONFIG_NOSYSTEM": "1",
    "GIT_CONFIG_GLOBAL": "/dev/null",
    "GIT_ALLOW_PROTOCOL": "file",
    "GIT_TERMINAL_PROMPT": "0",
    "GIT_EDITOR": "true",
    "LC_ALL": "C",
    "GIT_AUTHOR_NAME": "Fixture",
    "GIT_AUTHOR_EMAIL": "fixture@users.noreply.github.com",
    "GIT_COMMITTER_NAME": "Fixture",
    "GIT_COMMITTER_EMAIL": "fixture@users.noreply.github.com",
}
transcript = []


def git(cwd, *args, check=True, input_text=None):
    result = subprocess.run(
        ["git", *args], cwd=cwd, env=env, input=input_text,
        text=True, capture_output=True, timeout=30,
    )
    transcript.append({
        "cwd": str(cwd.relative_to(root)), "args": list(args),
        "exit": result.returncode, "stdout": result.stdout,
        "stderr": result.stderr,
    })
    # Keep command evidence even if a later assertion fails.
    (root / "transcript.json").write_text(json.dumps(transcript, indent=2) + "\n")
    if check and result.returncode:
        raise RuntimeError(transcript[-1])
    return result


def head(cwd):
    return git(cwd, "rev-parse", "HEAD").stdout.strip()


def main():
    version = git(root, "--version").stdout.strip()
    sub = root / "sub"
    sub.mkdir()
    git(sub, "init", "-b", "main")
    pins = []
    for number in range(3):
        (sub / "value").write_text(f"{number}\n")
        git(sub, "add", "value")
        git(sub, "commit", "-m", f"S{number}")
        pins.append(head(sub))

    repo = root / "seed"
    repo.mkdir()
    git(repo, "init", "-b", "main")
    git(repo, "submodule", "add", "--name", "dependency", str(sub), "dep")
    git(repo / "dep", "checkout", pins[0])
    git(repo, "add", ".")
    git(repo, "commit", "-m", "B")
    base = head(repo)

    git(repo / "dep", "checkout", pins[1])
    git(repo, "add", "dep")
    git(repo, "commit", "-m", "M pin S1")
    main_pin_commit = head(repo)

    git(repo, "checkout", "-b", "topic", base)
    git(repo / "dep", "checkout", pins[2])
    git(repo, "add", "dep")
    git(repo, "commit", "-m", "T pin S2")
    topic_pin_commit = head(repo)
    (repo / "control").write_text("preserve\n")
    git(repo, "add", "control")
    git(repo, "commit", "-m", "ordinary control")

    rows = []
    for mode in ("normal", "ignore_all"):
        cwd = root / mode
        git(root, "clone", "--no-hardlinks", str(repo), str(cwd))
        git(cwd, "branch", "main", "origin/main")
        git(cwd, "submodule", "update", "--init", "--checkout")
        options = [] if mode == "normal" else [
            "-c", "submodule.dependency.ignore=all",
        ]
        patch_ids = {}
        for label, sha in (("M", main_pin_commit), ("T", topic_pin_commit)):
            patch = git(cwd, *options, "show", "--format=medium", sha).stdout
            patch_ids[label] = git(
                cwd, "patch-id", "--stable", input_text=patch,
            ).stdout.strip()

        marked = git(
            cwd, *options, "log", "--cherry-mark", "--oneline", "--no-abbrev-commit",
            "main...topic",
        ).stdout
        marks = {line.split()[1]: line.split()[0] for line in marked.splitlines()}
        expected_mark = "+" if mode == "normal" else "="
        assert marks[main_pin_commit] == expected_mark
        assert marks[topic_pin_commit] == expected_mark

        before = git(cwd, "rev-parse", "HEAD:dep").stdout.strip()
        rebased = git(cwd, *options, "rebase", "main", check=False)
        after = git(cwd, "rev-parse", "HEAD:dep").stdout.strip()
        rows.append({
            "mode": mode, "patchIds": patch_ids, "cherryMark": marked,
            "beforePin": before, "afterPin": after,
            "rebaseExit": rebased.returncode,
            "rebaseStdout": rebased.stdout, "rebaseStderr": rebased.stderr,
            "pinPreserved": after == pins[2],
            "control": (cwd / "control").read_text(),
            "index": git(cwd, "ls-files", "--stage", "dep").stdout,
            "log": git(cwd, "log", "--oneline", "-4").stdout,
        })

    assert rows[0]["rebaseExit"] == rows[1]["rebaseExit"] == 0
    assert all(row["beforePin"] == pins[2] for row in rows)
    assert rows[0]["afterPin"] == pins[2]
    assert rows[1]["afterPin"] == pins[1]
    assert rows[0]["patchIds"]["M"].split()[0] != rows[0]["patchIds"]["T"].split()[0]
    assert rows[1]["patchIds"] == {"M": "", "T": ""}
    assert "skipped previously applied commit" in rows[1]["rebaseStderr"]
    assert all(row["control"] == "preserve\n" for row in rows)

    raw = {
        "git": version, "root": str(root), "submoduleCommits": pins,
        "base": base, "M": main_pin_commit, "T": topic_pin_commit, "rows": rows,
    }
    (root / "result.json").write_text(json.dumps(raw, indent=2) + "\n")
    normalized = {
        "git": version,
        "fixture": "fresh mkdtemp; local submodule S0 -> S1 -> S2; main pin S1; topic pin S2 plus ordinary control",
        "rows": [{
            "mode": row["mode"],
            "patchIdRelation": "different" if row["mode"] == "normal" else "both empty output",
            "cherryMarkRelation": "distinct" if row["mode"] == "normal" else "equivalent",
            "rebaseExit": row["rebaseExit"],
            "skippedCommitWarning": "skipped previously applied commit" in row["rebaseStderr"],
            "beforePin": "S2",
            "afterPin": "S2" if row["afterPin"] == pins[2] else "S1",
            "pinPreserved": row["pinPreserved"],
            "ordinaryControlPreserved": row["control"] == "preserve\n",
        } for row in rows],
    }
    print(json.dumps(normalized, indent=2))


if __name__ == "__main__":
    try:
        main()
    finally:
        print(f"Raw evidence: {root}", file=sys.stderr)
