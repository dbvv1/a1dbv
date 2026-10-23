#!/usr/bin/env python3
"""Replay a fixed upstream bug, patch, regression suite and real builder CLI.

No package installs, network requests, model calls or browser launch. Requires
Python 3.10+, Git, and Node for two existing upstream JavaScript unit tests.
The input checkout is read-only; all writes use a new temporary directory.
"""
import argparse
import base64
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

PIN = "7002e1a3b3e3bc19d4159e2a37917456dafd5ad4"
HERE = Path(__file__).resolve().parent
EXCLUDED = {
    "test_rendered_native_viewports_fit_cards_loupe_and_actual_size",
    "test_rendered_interfaces_do_not_mix_languages",
    "test_rendered_inlined_assets_and_completed_head_work_offline",
    "test_native_windows_resource_paths_accept_slashes_and_reserved_characters",
}


def run(args, cwd, log):
    result = subprocess.run(args, cwd=cwd, capture_output=True, text=True, encoding="utf-8", timeout=120)
    log.write_text(result.stdout + result.stderr, encoding="utf-8")
    return result


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("upstream", type=Path, help="Existing Oil UI Git checkout containing the pinned commit")
    args = parser.parse_args()
    require(shutil.which("node") is not None, "Node is required; do not count skipped upstream tests as passed")
    source = args.upstream.resolve(strict=True)
    require(source.is_dir(), "upstream must be an existing checkout directory")
    root = Path(tempfile.mkdtemp(prefix="oil-ui-css-replay-"))
    repo, evidence, case = root / "source", root / "evidence", root / "case"
    evidence.mkdir(); case.mkdir()
    print("Replay outputs:", root, flush=True)
    r = run(["git", "clone", "--no-hardlinks", "--no-checkout", str(source), str(repo)], root, evidence / "clone.txt")
    require(r.returncode == 0, "Local clone failed")
    r = run(["git", "checkout", "--detach", PIN], repo, evidence / "checkout.txt")
    require(r.returncode == 0, "Pinned upstream commit unavailable")
    # A small fixture exercises the real upstream builder, not a substitute implementation.
    (case / "image.png").write_bytes(base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5XkAAAAASUVORK5CYII="))
    continuation = "\\" + "\n"
    (case / "theme.css").write_text('.hero{background-image:url("im' + continuation + 'age.png");color:#123}', encoding="utf-8")
    html = '<!doctype html><html><head><title>CSS continuation acceptance</title><style>@import "th' + continuation + 'eme.css";</style></head><body><p class="hero">Portable candidate</p></body></html>'
    (case / "sample.html").write_text(html, encoding="utf-8")
    (case / "manifest.json").write_text(json.dumps({"candidates": [{"source": "sample.html"}]}), encoding="utf-8")
    output = case / "style-explorer.html"
    output.write_text("SENTINEL", encoding="utf-8")
    cli = [sys.executable, str(repo / "scripts/build_explorer.py")]
    command = cli + [str(case / "manifest.json"), "--output", str(output), "--force"]
    r = run(command, repo, evidence / "baseline-cli.txt")
    require(r.returncode == 1 and "找不到本地资源" in r.stderr and output.read_text() == "SENTINEL", "Expected baseline bug was not reproduced")
    for patch_name in ("oil-ui-css-continuation-tests.patch", "oil-ui-css-continuation.patch"):
        r = run(["git", "apply", str(HERE / patch_name)], repo, evidence / (patch_name + ".txt"))
        require(r.returncode == 0, "Patch application failed: " + patch_name)
        if patch_name.endswith("-tests.patch"):
            r = run([sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_build_explorer.py", "-k", "continuation"], repo, evidence / "red-tests.txt")
            require(r.returncode != 0 and "Ran 5 tests" in r.stderr and "FAILED" in r.stderr, "Negative regression did not fail as expected")
    spec = importlib.util.spec_from_file_location("oil_tests", repo / "tests/test_build_explorer.py")
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    names = unittest.defaultTestLoader.getTestCaseNames(module.ExplorerBuildTests)
    require(EXCLUDED <= set(names), "Upstream test inventory changed")
    with (evidence / "nonbrowser-tests.txt").open("w", encoding="utf-8") as stream:
        result = unittest.TextTestRunner(stream=stream, verbosity=2).run(unittest.TestSuite(module.ExplorerBuildTests(n) for n in names if n not in EXCLUDED))
    require(result.wasSuccessful() and not result.skipped and result.testsRun == 58, "Focused upstream suite failed or skipped tests")
    originals = {p: p.read_bytes() for p in case.iterdir() if p != output}
    r = run(command, repo, evidence / "patched-cli.txt")
    require(r.returncode == 0, "Patched CLI failed")
    page = output.read_text(encoding="utf-8")
    payload = json.loads(page.split("const DATA = ", 1)[1].split(";\n", 1)[0])
    content = payload["candidates"][0]["content"]
    require("data:image/png;base64," in content and "@import" not in content and "Portable candidate" in content, "Generated candidate was not fully embedded")
    require(all(p.read_bytes() == data for p, data in originals.items()), "Builder modified source inputs")
    r = run(command, repo, evidence / "repeat-cli.txt")
    require(r.returncode == 0 and output.read_text(encoding="utf-8") == page, "Rebuild was not deterministic")
    r = run(cli, repo, evidence / "no-input-cli.txt")
    require(r.returncode == 2 and output.read_text(encoding="utf-8") == page, "Missing CLI input was not rejected")
    (case / "image.png").unlink()
    r = run(command, repo, evidence / "missing-asset-cli.txt")
    require(r.returncode == 1 and "找不到本地资源 image.png" in r.stderr and output.read_text(encoding="utf-8") == page, "Missing asset did not preserve existing output")
    (case / "image.png").write_bytes(originals[case / "image.png"])
    summary = {"upstream": PIN, "baseline_cli": "expected failure; sentinel retained", "negative_regression": "5 regression methods run on baseline: 3 behavior cases and 1 new optional-argument contract fail; bare URL rejection passes", "nonbrowser_tests_passed": result.testsRun, "explicitly_not_run": sorted(EXCLUDED), "cli_acceptance": ["embedded import and PNG", "input preservation", "deterministic rebuild", "missing CLI input rejected", "missing asset preserves old output"], "browser_acceptance": "not run", "upstream_submission": "not submitted"}
    (evidence / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
