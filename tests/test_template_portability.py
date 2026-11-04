"""Copy documented standalone bundles; check local links, not client loading."""
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
GENERIC_FILES = (
  "AGENTS.md", "CLAUDE.md", ".claude/skills/task-decisions/SKILL.md",
)


class TemplatePortabilityTests(unittest.TestCase):
  def copy_minimal(self, target):
    for relative in GENERIC_FILES:
      destination = target / relative
      destination.parent.mkdir(parents=True, exist_ok=True)
      shutil.copy2(ROOT / "templates/generic" / relative, destination)

  def check(self, target):
    result = subprocess.run(
      [sys.executable, str(ROOT / "scripts/check_repo.py"), "--root", str(target)],
      cwd=target, capture_output=True, text=True, encoding="utf-8",
    )
    return result.returncode, json.loads(result.stdout)

  def test_generic_minimal_bundle_in_empty_project(self):
    with tempfile.TemporaryDirectory() as directory:
      target = Path(directory)
      self.copy_minimal(target)
      self.assertEqual(set(GENERIC_FILES), {
        str(p.relative_to(target)) for p in target.rglob("*") if p.is_file()
      })
      code, report = self.check(target)
      self.assertEqual(0, code, report)
      self.assertEqual(3, report["checked_files"])
      self.assertEqual([], report["errors"])

  def test_missing_minimal_skill_is_rejected(self):
    with tempfile.TemporaryDirectory() as directory:
      target = Path(directory)
      self.copy_minimal(target)
      (target / GENERIC_FILES[2]).unlink()
      code, report = self.check(target)
      self.assertEqual(1, code, report)
      self.assertTrue(any("missing link target" in e and "task-decisions" in e
                          for e in report["errors"]), report)

  def test_each_codex_skill_is_independently_copyable(self):
    for name in ("checkpoint-resume", "verify-completion"):
      with self.subTest(skill=name), tempfile.TemporaryDirectory() as directory:
        target = Path(directory)
        destination = target / ".agents/skills" / name
        shutil.copytree(ROOT / "templates/codex/.agents/skills" / name, destination)
        code, report = self.check(target)
        self.assertEqual(0, code, report)
        self.assertGreater(report["checked_files"], 0)
        self.assertEqual([], report["errors"])

  def test_repository_relative_reference_is_rejected_after_copy(self):
    with tempfile.TemporaryDirectory() as directory:
      target = Path(directory)
      destination = target / ".agents/skills/verify-completion"
      shutil.copytree(ROOT / "templates/codex/.agents/skills/verify-completion", destination)
      skill = destination / "SKILL.md"
      with skill.open("a", encoding="utf-8") as stream:
        stream.write("\n[repository-only reference](../../../../../experiments/release-title-roundtrip/README.md)\n")
      code, report = self.check(target)
      self.assertEqual(1, code, report)
      self.assertTrue(any("link escapes repository" in e and "release-title-roundtrip" in e
                          for e in report["errors"]), report)


if __name__ == "__main__":
  unittest.main()
