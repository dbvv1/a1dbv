"""Replay fixed-source Decimal regression, patch and scoped upstream tests."""

import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import platform
import subprocess
import sys
import tarfile
import xml.etree.ElementTree as ET

PIN = "bde101a5a67997c61a3ee0e971386a82fe141d4e"
HERE = Path(__file__).resolve().parent


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def run(args, cwd=None, env=None, expected=0):
    result = subprocess.run(args, cwd=cwd, env=env, text=True, capture_output=True)
    require(
        result.returncode == expected,
        f"{args[0]} exit {result.returncode}, expected {expected}:\n{result.stdout}\n{result.stderr}",
    )
    return result.stdout


def pytest(
    source, output, names, expected_failures=0, expected_passes=None, selection=None
):
    env = os.environ.copy()
    env["PYTHONPATH"] = str(source / "src")
    env["HYPOTHESIS_STORAGE_DIRECTORY"] = str(output / "hypothesis")
    cmd = [
        sys.executable,
        "-m",
        "pytest",
        "-q",
        "-c",
        str(HERE / "pytest.ini"),
        "-o",
        "cache_dir=" + str(output / "pytest-cache"),
        "--junitxml=" + str(output / "results.xml"),
        *names,
    ]
    if selection:
        cmd += ["-k", selection]
    result = subprocess.run(cmd, cwd=source, env=env, text=True, capture_output=True)
    (output / "pytest.txt").write_text(result.stdout + result.stderr)
    suites = ET.parse(output / "results.xml").getroot()
    cases = suites.findall(".//testcase")
    failures = sum(c.find("failure") is not None for c in cases)
    errors = sum(c.find("error") is not None for c in cases)
    skipped = sum(c.find("skipped") is not None for c in cases)
    passes = len(cases) - failures - errors - skipped
    require(
        result.returncode == (1 if expected_failures else 0),
        "Unexpected pytest exit; see " + str(output / "pytest.txt"),
    )
    require(
        cases and not errors and not skipped and failures == expected_failures,
        f"Bad test result: {passes=} {failures=} {errors=} {skipped=}",
    )
    require(
        expected_passes is None or passes == expected_passes,
        f"Wrong pass count: {passes}",
    )
    return {"passed": passes, "failed": failures, "skipped": skipped, "errors": errors}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        type=Path,
        required=True,
        help="Local clone of official cattrs containing the fixed commit; never modified",
    )
    parser.add_argument(
        "--workdir", type=Path, required=True, help="New directory, must not exist"
    )
    args = parser.parse_args()
    require(not sys.flags.optimize, "Optimized Python is not supported; run without -O")
    require(
        platform.python_implementation() == "CPython"
        and sys.version_info[:2] == (3, 12),
        "This replay is validated on CPython 3.12",
    )
    from importlib.metadata import version

    for line in (HERE / "requirements.lock").read_text().splitlines():
        if not line or line.startswith("#"):
            continue
        name, wanted = line.split("==")
        require(version(name) == wanted, f"Install locked dependency {line}")
    require(args.source.is_dir(), "Missing source directory")
    source = args.source.resolve()
    require(
        run(["git", "rev-parse", PIN + "^{commit}"], cwd=source).strip() == PIN,
        "Wrong source commit",
    )
    require(
        not args.workdir.exists(),
        "Work directory already exists; choose a new directory",
    )
    archive = subprocess.run(
        ["git", "archive", "--format=tar", PIN],
        cwd=source,
        capture_output=True,
        check=True,
    ).stdout
    work = args.workdir.resolve()
    work.mkdir(parents=True)
    checkout = work / "source"
    checkout.mkdir()
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
        tar.extractall(checkout, filter="data")
    (checkout / "tests/test_decimal_preconf.py").write_bytes(
        (HERE / "test_decimal_preconf.py").read_bytes()
    )
    for stage in ["baseline", "patched", "upstream"]:
        (work / stage).mkdir()
    report = {"source_commit": PIN, "python": platform.python_version()}
    report["baseline"] = pytest(
        checkout,
        work / "baseline",
        ["tests/test_decimal_preconf.py"],
        expected_failures=104,
        expected_passes=12,
    )
    run(["git", "init", "-q"], cwd=checkout)
    patch = str(HERE / "decimal-preconf.patch")
    run(["git", "apply", "--check", patch], cwd=checkout)
    run(["git", "apply", patch], cwd=checkout)
    manifest = json.loads((HERE / "patched-sha256.json").read_text())
    require(bool(manifest), "Empty patch manifest")
    for name, expected in manifest.items():
        require(
            hashlib.sha256((checkout / name).read_bytes()).hexdigest() == expected,
            "Patched bytes differ: " + name,
        )
    report["patched"] = pytest(
        checkout,
        work / "patched",
        ["tests/test_decimal_preconf.py"],
        expected_passes=116,
    )
    report["upstream"] = pytest(
        checkout,
        work / "upstream",
        ["tests/test_preconf.py", "tests/preconf/test_msgspec_cpython.py"],
        selection="not test_sentinels",
        expected_passes=73,
    )
    (work / "report.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
