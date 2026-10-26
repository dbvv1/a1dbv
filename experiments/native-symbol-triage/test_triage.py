#!/usr/bin/env python3
"""Offline ELF identity / symbolization example, not an engine crash harness."""
import argparse
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent
CLI = None


def run(*args, cwd=None):
  env = {key: value for key, value in os.environ.items() if not key.startswith("SENTRY_")}
  if cwd is not None:
    home = Path(cwd) / "isolated-home"
    home.mkdir(exist_ok=True)
    env.update(HOME=str(home), XDG_CONFIG_HOME=str(home))
  env.update(LC_ALL="C", SENTRY_DISABLE_UPDATE_CHECK="1")
  return subprocess.run(args, cwd=cwd, text=True, capture_output=True, env=env, timeout=30)


def ok(*args, cwd=None):
  result = run(*args, cwd=cwd)
  if result.returncode:
    raise AssertionError(f"{args[0]} failed: {result.stderr}")
  return result.stdout


class SymbolTriage(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    for tool in ("gcc", "objcopy", "strip", "readelf", "addr2line"):
      if not shutil.which(tool):
        raise RuntimeError(f"Required tool missing: {tool}; no tests may be called passed")
    work = ROOT / ".work"
    work.mkdir(exist_ok=True)
    cls.work = Path(tempfile.mkdtemp(prefix="run-", dir=work))
    shutil.copy2(ROOT / "room.c", cls.work / "room.c")
    for version in (1, 2):
      (cls.work / f"v{version}").mkdir()
      full = f"v{version}/room.full"
      ok("gcc", "-g", "-O0", "-fno-inline", "-no-pie", f"-DFIXED={version-1}",
         "-Wl,--build-id=sha1", f"-fdebug-prefix-map={cls.work}=.", "room.c", "-o", full,
         cwd=cls.work)
      ok("objcopy", "--only-keep-debug", full, f"v{version}/room.debug", cwd=cls.work)
      shutil.copy2(cls.work / full, cls.work / f"v{version}/room")
      ok("strip", "--strip-all", f"v{version}/room", cwd=cls.work)
    (cls.work / "wrong-only").mkdir()
    (cls.work / "empty").mkdir()
    shutil.copy2(cls.work / "v2/room.debug", cls.work / "wrong-only/room.debug")
    cls.failure = run("./v1/room", "absent", cwd=cls.work)
    (cls.work / "original-error.txt").write_text(cls.failure.stderr)
    address = re.search(r"\[(0x[0-9a-f]+)\]", cls.failure.stderr)
    if not address:
      raise AssertionError("No actual backtrace address captured")
    cls.address = address.group(1)

  def build_id(self, file):
    text = ok("readelf", "-n", file, cwd=self.work)
    return re.search(r"Build ID: (\w+)", text).group(1)

  def test_normal_and_missing_input(self):
    for version in (1, 2):
      self.assertEqual(run(f"./v{version}/room", "courtyard", cwd=self.work).returncode, 0)
      missing = run(f"./v{version}/room", cwd=self.work)
      self.assertEqual(missing.returncode, 64)
      self.assertIn("usage:", missing.stderr)

  def test_error_and_fixed_path(self):
    self.assertEqual(self.failure.returncode, 2)
    self.assertIn("requested room absent", self.failure.stderr)
    fixed = run("./v2/room", "absent", cwd=self.work)
    self.assertEqual(fixed.returncode, 0)
    self.assertIn("remain in menu with retry available", fixed.stdout)

  def test_matching_symbol_identity_and_line(self):
    self.assertEqual(self.build_id("v1/room"), self.build_id("v1/room.debug"))
    resolved = ok("addr2line", "-f", "-e", "v1/room.debug", self.address, cwd=self.work)
    self.assertIn("open_room", resolved)
    self.assertRegex(resolved, r"room\.c:\d+")
    (self.work / "matched-resolution.txt").write_text(resolved)

  def test_wrong_symbols_can_look_plausible(self):
    self.assertNotEqual(self.build_id("v1/room"), self.build_id("v2/room.debug"))
    wrong = ok("addr2line", "-f", "-e", "v2/room.debug", self.address, cwd=self.work)
    correct = ok("addr2line", "-f", "-e", "v1/room.debug", self.address, cwd=self.work)
    # This fixed no-PIE GCC fixture demonstrates a misleading readable result.
    # A toolchain that does not reproduce it must fail, not silently count as evidence.
    self.assertRegex(wrong, r"room\.c:\d+")
    self.assertNotEqual(wrong, correct)
    (self.work / "wrong-resolution.txt").write_text(wrong)

  def test_absent_debug_information(self):
    stripped = ok("addr2line", "-f", "-e", "v1/room", self.address, cwd=self.work)
    self.assertIn("??", stripped)
    missing = run("addr2line", "-e", "absent.debug", self.address, cwd=self.work)
    self.assertNotEqual(missing.returncode, 0)

  def sentry_identity_check(self):
    def check(file):
      return json.loads(ok(CLI, "debug-files", "check", "--json", file, cwd=self.work))
    binary, right, wrong = [check(p) for p in ("v1/room", "v1/room.debug", "v2/room.debug")]
    self.assertTrue(right["is_usable"])
    self.assertTrue(wrong["is_usable"])
    identity = binary["variants"][0]["debug_id"]
    self.assertEqual(identity, right["variants"][0]["debug_id"])
    self.assertNotEqual(identity, wrong["variants"][0]["debug_id"])
    for directory, expected in (("v1", 0), ("wrong-only", 1), ("empty", 1)):
      found = run(CLI, "debug-files", "find", "--no-well-known", "--no-cwd", "--json",
                  "--path", directory, identity, cwd=self.work)
      self.assertEqual(found.returncode, expected)
      self.assertEqual(bool(json.loads(found.stdout)), expected == 0)
    self.assertNotEqual(run(CLI, "debug-files", "check", "absent.debug", cwd=self.work).returncode, 0)
    (self.work / "sentry-checks.json").write_text(json.dumps([binary, right, wrong], indent=2))


if __name__ == "__main__":
  parser = argparse.ArgumentParser()
  parser.add_argument("--sentry-cli", help="Optional already-installed CLI path; never installed or uploaded here")
  options = parser.parse_args()
  if options.sentry_cli:
    CLI = str(Path(options.sentry_cli).resolve())
  suite = unittest.defaultTestLoader.loadTestsFromTestCase(SymbolTriage)
  if CLI:
    suite.addTest(SymbolTriage("sentry_identity_check"))
  result = unittest.TextTestRunner(verbosity=2).run(suite)
  print("Scope: offline Linux ELF only; Unity/UE/IL2CPP/remote ingestion not run.")
  print("Sentry CLI checks:", "requested" if CLI else "not requested (not part of default five tests)")
  raise SystemExit(not result.wasSuccessful())
