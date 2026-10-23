"""Reaccept upstream python-dotenv PR 717 in a disposable directory, not a new fix."""

import argparse
import json
import os
import shlex
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

BASE = "0b2880591780a426b0551436f47a17e7a76d954f"
HEAD = "15bb04fd15f91b48e81c2683fcab802165a889f3"
URL = "https://github.com/theskumar/python-dotenv.git"
SELECTION = (
    "rewrite_syncs_flushed_contents_before_replace or "
    "rewrite_fsync_failure_preserves_target or rewrite_does_not_sync_failed_writes"
)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--python",
        default=sys.executable,
        help="Existing Python with pytest, click, IPython. Never installs.",
    )
    args = parser.parse_args()
    if os.name != "posix":
        parser.error(
            "This acceptance recipe currently targets POSIX file-mode semantics."
        )
    acceptance_source = Path(__file__).with_name("test_dotenv_acceptance.py")
    if not acceptance_source.is_file():
        parser.error("Keep test_dotenv_acceptance.py beside this replay script.")
    root = Path(tempfile.mkdtemp(prefix="dotenv-717-replay-"))
    repo = root / "source"
    home = root / "home"
    home.mkdir()
    print(f"Replay output: {root}", flush=True)

    def run(command, *, cwd=root, env=None, name=None, expected=0):
        result = subprocess.run(
            command,
            check=False,
            cwd=cwd,
            env=env,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            timeout=180,
        )
        if name:
            (root / (name + ".txt")).write_text(result.stdout)
        if result.returncode != expected:
            raise RuntimeError(
                f"{name or command[0]} returned {result.returncode}, "
                f"expected {expected}:\n{result.stdout}"
            )
        return result.stdout

    run(["git", "clone", "--quiet", "--no-checkout", URL, str(repo)])
    run(["git", "fetch", "--quiet", "origin", "pull/717/head"], cwd=repo)
    actual = run(["git", "rev-parse", "FETCH_HEAD"], cwd=repo).strip()
    if actual != HEAD:
        raise RuntimeError(
            "Upstream PR moved; re-review before updating the pinned commit."
        )
    run(["git", "checkout", "--quiet", BASE], cwd=repo)
    (root / "upstream-LICENSE").write_text((repo / "LICENSE").read_text())
    # Preserve the venv executable path: resolving symlinks loses venv isolation.
    python = os.path.abspath(args.python)
    run([python, "-c", "import pytest, click, IPython"], name="dependency-preflight")
    # Match the upstream console entry without installing into the supplied Python.
    # This verifies source CLI behavior, not wheel/console-script packaging.
    bin_dir = root / "bin"
    bin_dir.mkdir()
    launcher = bin_dir / "dotenv"
    entry_code = 'from dotenv.__main__ import cli; cli(prog_name="dotenv")'
    launcher.write_text(
        "#!/bin/sh\nexec "
        + shlex.quote(python)
        + " -c "
        + shlex.quote(entry_code)
        + ' "$@"\n'
    )
    launcher.chmod(0o755)
    env = {
        "PATH": str(bin_dir)
        + os.pathsep
        + str(Path(python).parent)
        + os.pathsep
        + os.defpath,
        "HOME": str(home),
        "LANG": "C.UTF-8",
        "PYTHONPATH": str(repo / "src"),
        "PYTEST_DISABLE_PLUGIN_AUTOLOAD": "1",
    }
    for key in ("SYSTEMROOT", "WINDIR"):
        if key in os.environ:
            env[key] = os.environ[key]

    def pytest(name, test_args, expected):
        xml_path = root / (name + ".xml")
        run(
            [
                python,
                "-m",
                "pytest",
                "-q",
                "-rs",
                "--junitxml=" + str(xml_path),
                *test_args,
            ],
            cwd=repo,
            env=env,
            name=name,
            expected=expected,
        )
        suites = ET.parse(xml_path).getroot().iter("testsuite")
        result = {key: 0 for key in ("tests", "failures", "errors", "skipped")}
        for suite in suites:
            for key in result:
                result[key] += int(suite.attrib.get(key, 0))
        return result

    # Only transplant the upstream tests first, never the implementation.
    test_content = run(["git", "show", HEAD + ":tests/test_main.py"], cwd=repo)
    (repo / "tests/test_main.py").write_text(test_content)
    baseline = pytest("baseline", ["tests/test_main.py", "-k", SELECTION], 1)
    if baseline != {"tests": 7, "failures": 6, "errors": 0, "skipped": 0}:
        raise RuntimeError(f"Unexpected baseline: {baseline}")
    run(["git", "restore", "tests/test_main.py"], cwd=repo)
    run(["git", "checkout", "--quiet", HEAD], cwd=repo)
    full = pytest("patched-suite", [], 0)
    if full != {"tests": 295, "failures": 0, "errors": 0, "skipped": 0}:
        raise RuntimeError(f"Unexpected full-suite coverage: {full}")
    shutil.copyfile(acceptance_source, root / "test_acceptance.py")
    acceptance = pytest("acceptance", [str(root / "test_acceptance.py"), "-s"], 0)
    if acceptance != {"tests": 7, "failures": 0, "errors": 0, "skipped": 0}:
        raise RuntimeError(f"Unexpected independent coverage: {acceptance}")
    versions = run(
        [
            python,
            "-c",
            "import sys, importlib.metadata as m; print(sys.version); "
            'print({n:m.version(n) for n in ("pytest", "click", "ipython")})',
        ],
        env=env,
    )
    results = {
        "base": BASE,
        "head": HEAD,
        "baseline": baseline,
        "patched_suite": full,
        "independent_acceptance": acceptance,
        "runtime": versions,
        "limits": [
            "No power-loss or directory-fsync proof.",
            "No multi-writer or cross-device durability proof.",
            "All file contents synthetic; no upstream write performed.",
        ],
    }
    (root / "results.json").write_text(json.dumps(results, indent=2))
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
