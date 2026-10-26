#!/usr/bin/env python3
"""Run the real pinned Luban generator and its generated TypeScript loader."""
import copy
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent
DOTNET = os.environ.get("DOTNET", "dotnet")
LUBAN = os.environ.get("LUBAN_DLL", "")
PIN = "5.1.0+df34215d2e22035073d1af83d44e3ac0744dc3b3"


def run(command):
  return subprocess.run(command, text=True, capture_output=True, timeout=60)


class ProductionChain(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    if not LUBAN or not Path(LUBAN).is_file():
      raise RuntimeError("Set LUBAN_DLL to the official Luban 5.1.0 Luban.dll")
    if not shutil.which(DOTNET):
      raise RuntimeError("DOTNET executable is missing")
    cls.tsc = ROOT / "node_modules/typescript/bin/tsc"
    if not cls.tsc.is_file() or not shutil.which("node"):
      raise RuntimeError("Run npm ci with Node available")
    version = run([DOTNET, LUBAN, "--version"])
    if version.returncode not in (0, 1) or (version.stdout + version.stderr).strip() != "Luban " + PIN:
      raise RuntimeError("Unexpected generator version: " + version.stdout + version.stderr)
    (ROOT / ".work").mkdir(exist_ok=True)
    cls.temp = tempfile.TemporaryDirectory(prefix="verify-", dir=ROOT / ".work")
    cls.work = Path(cls.temp.name)

  @classmethod
  def tearDownClass(cls):
    cls.temp.cleanup()

  def fixture(self, name):
    case = self.work / name
    shutil.copytree(ROOT / "source", case)
    return case

  def generate(self, case):
    result = run([DOTNET, LUBAN, "--conf", str(case / "luban.conf"), "-t", "client",
      "-c", "typescript-json", "-d", "json", "--strict", "--errorFormat", "json",
      "-l", str(ROOT / "nlog.xml"), "-x", "outputCodeDir=" + str(case / "gen"),
      "-x", "outputDataDir=" + str(case / "output")])
    report = json.loads(result.stderr)  # Luban 5.1 reports JSON on stderr; NLog stays on stdout.
    self.assertEqual(report["exitCode"], result.returncode)
    # The generator can write files even when strict validation fails.
    # Only accept a complete successful run; do not infer success from file existence.
    if result.returncode == 0 and report["ok"]:
      shutil.copytree(case / "output", case / "generated_validated", dirs_exist_ok=True)
    return result, report

  def consume(self, case, evolved=False):
    source = (ROOT / "consumer.ts").read_text(encoding="utf-8")
    if evolved:
      source = source.replace("count: tables.", "armor: definition.armor,\n  count: tables.")
    (case / "consumer.ts").write_text(source, encoding="utf-8")
    compiled = run(["node", str(self.tsc), "--strict", "--target", "ES2020", "--module",
      "commonjs", "--rootDir", str(case), "--outDir", str(case / "dist"), str(case / "consumer.ts")])
    self.assertEqual(compiled.returncode, 0, compiled.stdout + compiled.stderr)
    result = run(["node", str(case / "dist/consumer.js"), str(case / "generated_validated")])
    self.assertEqual(result.returncode, 0, result.stderr)
    return json.loads(result.stdout)

  def test_normal_and_second_change(self):
    base = self.fixture("base")
    result, report = self.generate(base)
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertTrue(report["ok"])
    baseline = self.consume(base)
    self.assertEqual(baseline, {"id": "scout", "displayName": "Scout", "maxHp": 80,
      "hpAfterHit": 70, "skillId": "hit", "skillDamage": 10, "count": 2})
    old_hash = hashlib.sha256((base / "output/tbenemy.json").read_bytes()).hexdigest()
    changed = self.fixture("second-change")
    path = changed / "Data/enemies.json"
    enemies = json.loads(path.read_text())
    enemies[0].update(displayName="Armored scout", maxHp=100, skillId="heavy")
    for enemy in enemies:
      enemy["armor"] = 6 if enemy["id"] == "scout" else 12
    path.write_text(json.dumps(enemies), encoding="utf-8")
    schema = changed / "Defines/schema.xml"
    schema.write_text(schema.read_text().replace('<var name="maxHp"',
      '<var name="armor" type="int#range=[0,100]"/>\n    <var name="maxHp"'), encoding="utf-8")
    result, report = self.generate(changed)
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertEqual(self.consume(changed, evolved=True), {"id": "scout", "displayName": "Armored scout",
      "maxHp": 100, "hpAfterHit": 90, "skillId": "heavy", "skillDamage": 25, "armor": 6, "count": 2})
    self.assertEqual(hashlib.sha256((base / "output/tbenemy.json").read_bytes()).hexdigest(), old_hash)
    self.assertEqual(self.consume(base), baseline)

  def test_invalid_content(self):
    previous = self.fixture("previous-generated_validated")
    self.assertEqual(self.generate(previous)[0].returncode, 0)
    old_data = (previous / "generated_validated/tbenemy.json").read_bytes()
    for kind in ("reference", "range", "duplicate", "missing_field", "missing_input"):
      with self.subTest(kind=kind):
        case = self.fixture(kind)
        path = case / "Data/enemies.json"
        enemies = json.loads(path.read_text())
        if kind == "reference":
          enemies[0]["skillId"] = "missing-skill"
        elif kind == "range":
          enemies[0]["maxHp"] = -1
        elif kind == "duplicate":
          enemies.append(copy.deepcopy(enemies[0]))
        elif kind == "missing_field":
          del enemies[0]["speed"]
        path.write_text(json.dumps(enemies), encoding="utf-8")
        if kind == "missing_input":
          path.unlink()
        result, report = self.generate(case)
        self.assertNotEqual(result.returncode, 0, kind)
        self.assertFalse(report["ok"], kind)
        self.assertTrue(report["errors"], kind)
        self.assertFalse((case / "generated_validated").exists(), kind)
        self.assertEqual((previous / "generated_validated/tbenemy.json").read_bytes(), old_data)
        if kind in ("reference", "range"):
          self.assertTrue((case / "output/tbenemy.json").exists(), kind)

  def test_repeat_generation_is_stable(self):
    case = self.fixture("repeat")
    self.assertEqual(self.generate(case)[0].returncode, 0)
    before = {p.name: p.read_bytes() for p in (case / "output").glob("*.json")}
    self.assertEqual(self.generate(case)[0].returncode, 0)
    self.assertEqual(before, {p.name: p.read_bytes() for p in (case / "output").glob("*.json")})


if __name__ == "__main__":
  unittest.main(verbosity=2)
