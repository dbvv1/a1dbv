"""Exercise the README's empty-project recipe, never a user's configuration."""
import io
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import unittest
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "templates/generic"
DOMAINS = ("unity", "unreal")


def rules(path):
  return [tuple(line.split()[:2]) for line in path.read_text(encoding="utf-8").splitlines()
          if line.strip() and not line.lstrip().startswith("#")]


def snapshot(path):
  return {str(file.relative_to(path)): file.read_bytes()
          for file in path.rglob("*") if file.is_file()}


class TemplateOverlayTests(unittest.TestCase):
  def domain(self, name):
    return ROOT / "domains/game-dev" / name / "templates"

  def recipe(self, name):
    text = (self.domain(name) / "README.md").read_text(encoding="utf-8")
    match = re.search(r"<!-- empty-project-recipe -->\s*```bash\n(.*?)\n```", text, re.S)
    self.assertIsNotNone(match, "README must expose the tested empty-project recipe")
    return match.group(1)

  def install(self, name, target):
    env = dict(os.environ, TARGET=str(target))
    return subprocess.run(["bash", "-c", self.recipe(name)], cwd=ROOT,
                          env=env, capture_output=True, text=True, encoding="utf-8")

  def test_utf8_files_and_output_ignore_locale_default(self):
    # Simulate a GBK text default on Linux; this is not a native Windows test.
    original_open = io.open

    def gbk_open(file, mode="r", buffering=-1, encoding=None, *args, **kwargs):
      if "b" not in mode and encoding in (None, "locale"):
        encoding = "gbk"
      return original_open(file, mode, buffering, encoding, *args, **kwargs)

    with patch("io.open", gbk_open), patch("subprocess._text_encoding", return_value="gbk"):
      self.test_domain_configs_retain_exact_baseline()
      self.test_empty_project_composes_instructions_review_and_rules()
      with tempfile.TemporaryDirectory() as directory:
        target = Path(directory)
        (target / "existing.txt").write_text("保留\n", encoding="utf-8")
        result = self.install("unity", target)
        self.assertNotEqual(0, result.returncode)
        self.assertIn("目标非空", result.stderr)
        self.assertEqual("保留\n", (target / "existing.txt").read_text(encoding="utf-8"))

  def test_domain_configs_retain_exact_baseline(self):
    base = json.loads((BASE / ".claude/settings.json").read_text(encoding="utf-8"))
    base_rules = rules(BASE / ".claude/protected-paths.txt")
    for name in DOMAINS:
      with self.subTest(domain=name):
        config = json.loads((self.domain(name) / ".claude/settings.json").read_text(encoding="utf-8"))
        for mode, entries in base["permissions"].items():
          self.assertTrue(set(entries) <= set(config["permissions"][mode]), mode)
        self.assertEqual(base["hooks"], config["hooks"])
        self.assertEqual(base_rules, rules(self.domain(name) / ".claude/protected-paths.txt")[:len(base_rules)])

  def test_copy_does_not_enable_plugins_or_mcp(self):
    for name in DOMAINS:
      with self.subTest(domain=name):
        config = json.loads((self.domain(name) / ".claude/settings.json").read_text(encoding="utf-8"))
        self.assertNotIn("enabledPlugins", config)

  def test_empty_project_composes_instructions_review_and_rules(self):
    examples = {"unity": ("deny", "Library/*"), "unreal": ("deny", "*.uasset")}
    for name in DOMAINS:
      with self.subTest(domain=name), tempfile.TemporaryDirectory() as directory:
        target = Path(directory) / "new project with spaces"
        target.mkdir()
        result = self.install(name, target)
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertEqual((BASE / "REVIEW.md").read_bytes(), (target / "REVIEW.md").read_bytes())
        self.assertFalse((target / ".mcp.json").exists())
        self.assertEqual((self.domain(name) / ".claude/settings.json").read_bytes(),
                         (target / ".claude/settings.json").read_bytes())
        base_rules = rules(BASE / ".claude/protected-paths.txt")
        self.assertEqual(base_rules, rules(target / ".claude/protected-paths.txt")[:len(base_rules)])
        for file in ("AGENTS.md", "CLAUDE.md"):
          content = (target / file).read_text(encoding="utf-8")
          for source in (BASE, self.domain(name)):
            for line in (source / file).read_text(encoding="utf-8").splitlines():
              if line.strip():
                self.assertIn(line, content)
        self.assertIn(examples[name], rules(target / ".claude/protected-paths.txt"))
        for source in (BASE, self.domain(name)):
          for file in (source / ".claude").rglob("*"):
            if file.is_file():
              self.assertTrue((target / file.relative_to(source)).is_file())
        before = snapshot(target)
        self.assertNotEqual(0, self.install(name, target).returncode)
        self.assertEqual(before, snapshot(target), "Repeated install must leave files unchanged")

  def test_existing_project_is_rejected_without_any_changes(self):
    for name in DOMAINS:
      for existing in ("AGENTS.md", "CLAUDE.md", "REVIEW.md", ".claude/settings.json", ".mcp.json", "unrelated.txt"):
        with self.subTest(domain=name, existing=existing), tempfile.TemporaryDirectory() as directory:
          target = Path(directory)
          file = target / existing
          file.parent.mkdir(parents=True, exist_ok=True)
          file.write_text("custom settings must survive\n", encoding="utf-8")
          before = snapshot(target)
          self.assertNotEqual(0, self.install(name, target).returncode)
          self.assertEqual(before, snapshot(target))

  def test_symlink_target_is_rejected(self):
    for name in DOMAINS:
      for suffix in ("", "/", "//", "/./", "/child", "/child/"):
        with self.subTest(domain=name, suffix=suffix), tempfile.TemporaryDirectory() as directory:
          real = Path(directory) / "real"
          real.mkdir()
          target = Path(directory) / "link"
          target.symlink_to(real, target_is_directory=True)
          # Keep the raw string: Path would discard the trailing separators.
          self.assertNotEqual(0, self.install(name, str(target) + suffix).returncode)
          self.assertEqual([], list(real.iterdir()), "Do not even create directories through the link")

  def test_failed_directory_check_stops_before_copy(self):
    for name in DOMAINS:
      with self.subTest(domain=name), tempfile.TemporaryDirectory() as directory:
        env = dict(os.environ, TARGET=directory)
        result = subprocess.run(["bash", "-c", "find() { return 1; };\n" + self.recipe(name)],
                                cwd=ROOT, env=env, capture_output=True, text=True, encoding="utf-8")
        self.assertNotEqual(0, result.returncode)
        self.assertEqual({}, snapshot(Path(directory)))

  def test_unset_target_is_rejected(self):
    for name in DOMAINS:
      with self.subTest(domain=name):
        env = {key: value for key, value in os.environ.items() if key != "TARGET"}
        result = subprocess.run(["bash", "-c", self.recipe(name)], cwd=ROOT,
                                env=env, capture_output=True, text=True, encoding="utf-8")
        self.assertNotEqual(0, result.returncode)


if __name__ == "__main__":
  unittest.main()
