"""Reproduce uv lock revision loss on a fixed, real Spec Kit checkout."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tomllib

BASE = "ec9a6f3b94c0aa856f77e550785a1ddde1993de1"
parser = argparse.ArgumentParser(description=__doc__)
for name in ("source", "old-uv", "new-uv", "python", "cache", "work"):
    parser.add_argument("--" + name, required=True, type=Path)
parser.add_argument("--offline", action="store_true")
args = parser.parse_args()
work = args.work.resolve()
work.mkdir(exist_ok=False)
repo = work / "spec-kit"
subprocess.run(
    [
        "git",
        "clone",
        "--quiet",
        "--no-hardlinks",
        str(args.source.resolve()),
        str(repo),
    ],
    check=True,
)
subprocess.run(
    ["git", "-C", str(repo), "checkout", "--quiet", "--detach", BASE], check=True
)
env = {
    **os.environ,
    "UV_CACHE_DIR": str(args.cache.resolve()),
    "UV_PYTHON_DOWNLOADS": "never",
}
records = []
old, new = str(args.old_uv.resolve()), str(args.new_uv.resolve())
python_args = ["--python", str(args.python.resolve())]
network = ["--offline"] if args.offline else []
lock = repo / "uv.lock"
baseline = Path(__file__).with_name("baseline.lock").read_bytes()
lock.write_bytes(baseline)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def run(
    label, executable, command, *, cwd=repo, expected=0, extra_env=None, diagnostic=None
):
    result = subprocess.run(
        [executable, *command],
        cwd=cwd,
        env={**env, **(extra_env or {})},
        text=True,
        capture_output=True,
        timeout=180,
    )
    (work / (label + ".log")).write_text(result.stdout + result.stderr)
    record = {"step": label, "exit": result.returncode}
    if diagnostic:
        record["diagnostic_matched"] = diagnostic in result.stderr
        assert record["diagnostic_matched"], (label, result.stderr)
    records.append(record)
    assert result.returncode == expected, (label, result.stderr)
    return result


assert run("old-version", old, ["--version"]).stdout.startswith("uv 0.12.10 ")
assert run("new-version", new, ["--version"]).stdout.startswith("uv 0.13.7 ")
run("plain-old-lock", old, ["lock", *python_args, *network])
assert lock.read_bytes() == baseline
run(
    "old-relock",
    old,
    ["lock", "--upgrade-package", "typer==0.27.3", *python_args, *network],
)
downgraded = lock.read_bytes()
assert tomllib.loads(downgraded.decode())["revision"] == 3
identities = lambda data: [
    (p["name"], p["version"], p["source"])
    for p in tomllib.loads(data.decode())["package"]
]
assert identities(downgraded) == identities(baseline)
run(
    "normal-frozen-with-manifest",
    new,
    ["sync", "--frozen", "--no-dev", *python_args, *network],
)
for name, data, expected in [("good", baseline, 0), ("downgraded", downgraded, 2)]:
    layer = work / ("layer-" + name)
    layer.mkdir()
    (layer / "uv.lock").write_bytes(data)
    run(
        "lock-only-" + name,
        new,
        [
            "sync",
            "--frozen",
            "--no-install-project",
            "--no-dev",
            *python_args,
            *network,
        ],
        cwd=layer,
        expected=expected,
        diagnostic="Frozen lockfile discovery requires a lockfile with revision 5 or later"
        if expected
        else None,
    )
    assert (layer / "uv.lock").read_bytes() == data
run("modern-plain-lock", new, ["lock", *python_args, *network])
assert lock.read_bytes() == downgraded
manifest = repo / "pyproject.toml"
manifest.write_text(
    manifest.read_text() + '\n[tool.uv]\nrequired-version = ">=0.13.7"\n'
)
run(
    "guard-old-relock",
    old,
    ["lock", "--upgrade-package", "typer==0.27.3", *python_args, *network],
    expected=2,
    diagnostic="Required uv version `>=0.13.7` does not match the running version `0.12.10`",
)
assert lock.read_bytes() == downgraded
run(
    "modern-relock",
    new,
    ["lock", "--upgrade-package", "typer==0.27.3", *python_args, *network],
)
assert lock.read_bytes() == baseline
layer = work / "layer-downgraded"
(layer / "uv.lock").write_bytes(lock.read_bytes())
run(
    "lock-only-recovered",
    new,
    ["sync", "--frozen", "--no-install-project", "--no-dev", *python_args, *network],
    cwd=layer,
)
run(
    "recovered-full-sync",
    new,
    ["sync", "--frozen", "--no-dev", *python_args, *network],
    extra_env={"UV_PROJECT_ENVIRONMENT": str(work / "recovered-env")},
)
run(
    "real-specify-init",
    str(work / "recovered-env/bin/specify"),
    [
        "init",
        str(work / "reader-project"),
        "--non-interactive",
        "--integration",
        "codex",
        "--ignore-agent-tools",
        "--script",
        "sh",
    ],
)
assert (work / "reader-project/.specify/templates/spec-template.md").is_file()
assert any((work / "reader-project/.agents/skills").glob("*/SKILL.md"))
result = {
    "source_commit": BASE,
    "baseline_lock_sha256": sha(baseline),
    "downgraded_lock_sha256": sha(downgraded),
    "recovered_lock_sha256": sha(lock.read_bytes()),
    "package_identities": len(identities(baseline)),
    "package_identities_unchanged": True,
    "steps": records,
    "limits": [
        "Linux CLI only; no Docker, Windows or macOS runtime",
        "No model invocation or second unread native reader",
        "Project version constraint is absent from lock-only staging directories",
    ],
}
(work / "results.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
