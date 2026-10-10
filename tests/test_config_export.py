"""Offline tests: all configuration roots are synthetic temporary fixtures."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/export-ai-config.sh"
SECRET = "sk-SYNTHETIC_TEST_SENTINEL_12345678901234567890"


class ConfigExportTests(unittest.TestCase):
  def setUp(self):
    self.temp = tempfile.TemporaryDirectory(prefix="export-fixture-")
    self.addCleanup(self.temp.cleanup)
    self.root = Path(self.temp.name).resolve()
    self.source = self.root / "synthetic-claude"
    self.source.mkdir()
    self.stage = self.root / "stage"
    self.output = self.root / "public-snapshot"

  def put(self, name, text):
    path = self.source / name
    path.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(text, bytes):
      path.write_bytes(text)
    else:
      path.write_text(text, encoding="utf-8")
    return path

  def run_export(self, *args, env=None):
    result = subprocess.run(["/bin/bash", str(SCRIPT), *map(str, args)],
                            text=True, capture_output=True, env=env)
    self.assertNotIn(SECRET, result.stdout + result.stderr)
    return result

  def stage_files(self, *names, output=None):
    args = ["stage", "--source", "claude=" + str(self.source), "--output", output or self.stage]
    for name in names:
      args += ["--include", "claude/" + name]
    return self.run_export(*args)

  def promote(self, reviewed=None):
    manifest = (self.stage / "export-manifest.json").read_bytes()
    return self.run_export("promote", "--stage", self.stage, "--output", self.output,
                           "--reviewed", reviewed or hashlib.sha256(manifest).hexdigest())

  def test_explicit_stage_then_promote_exact_snapshot(self):
    self.put("CLAUDE.md", "Public instructions\n")
    self.put("skills/example/README.md", "Public readme\n")
    self.put("skills/example/scripts/run.py", "print('ok')\n")
    self.put("skills/example/ignored.md", SECRET)
    result = self.stage_files("CLAUDE.md", "skills/example/README.md", "skills/example/scripts/run.py")
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertFalse(self.output.exists())
    manifest = json.loads((self.stage / "export-manifest.json").read_text())
    self.assertEqual(len(manifest["files"]), 3)
    self.assertNotIn(str(self.source), json.dumps(manifest))
    result = self.promote()
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertEqual((self.output / "claude/CLAUDE.md").read_text(), "Public instructions\n")
    self.assertFalse((self.output / "claude/skills/example/ignored.md").exists())

  def test_secrets_in_every_supported_text_location_fail_before_write(self):
    for name in ("CLAUDE.md", "skills/nested/README.md", "skills/nested/SKILL.md", "hooks/run.sh"):
      with self.subTest(name=name):
        self.put(name, "prefix\n" + SECRET + "\n")
        result = self.stage_files(name)
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.stage.exists())
        self.assertFalse(self.output.exists())
        self.assertNotIn(str(self.source), result.stdout + result.stderr)

  def test_late_scan_failure_leaves_no_partial_snapshot_or_temporary_files(self):
    self.put("CLAUDE.md", "public first file")
    self.put("skills/nested/README.md", SECRET)
    before = set(self.root.iterdir())
    result = self.stage_files("CLAUDE.md", "skills/nested/README.md")
    self.assertNotEqual(result.returncode, 0)
    self.assertEqual(set(self.root.iterdir()), before)

  def test_sensitive_filename_and_local_path_are_not_logged(self):
    name = "skills/" + SECRET + ".md"
    self.put(name, "public")
    self.assertNotEqual(self.stage_files(name).returncode, 0)
    local_path = "/home/synthetic-person/private-project"
    self.put("CLAUDE.md", local_path)
    result = self.stage_files("CLAUDE.md")
    self.assertNotEqual(result.returncode, 0)
    self.assertNotIn(local_path, result.stdout + result.stderr)
    self.assertFalse(self.stage.exists())

  def test_total_size_limit_fails_before_write(self):
    names = ["skills/file%d.md" % n for n in range(11)]
    for name in names:
      self.put(name, "a" * (1024 * 1024))
    self.assertNotEqual(self.stage_files(*names).returncode, 0)
    self.assertFalse(self.stage.exists())

  def test_settings_is_constructed_from_allowlist(self):
    self.put("settings.json", json.dumps({"env": {"API_KEY": SECRET}, "mcpServers": {"secret": SECRET},
             "permissions": {"allow": ["Bash(*)"]}, "alwaysThinkingEnabled": True,
             "includeCoAuthoredBy": False, "cleanupPeriodDays": 15}))
    result = self.stage_files("settings.json")
    self.assertEqual(result.returncode, 0, result.stderr)
    settings = json.loads((self.stage / "claude/settings.json").read_text())
    self.assertEqual(settings, {"alwaysThinkingEnabled": True, "includeCoAuthoredBy": False, "cleanupPeriodDays": 15})
    self.assertEqual(self.promote().returncode, 0)

  def test_invalid_settings_are_rejected_without_values_in_log(self):
    for text in ("[", "[]", '{"alwaysThinkingEnabled":"' + SECRET + '"}',
                 '{"cleanupPeriodDays":true}', '{"cleanupPeriodDays":-1}',
                 '{"alwaysThinkingEnabled":true,"alwaysThinkingEnabled":false}'):
      with self.subTest(text=text[:20]):
        self.put("settings.json", text)
        self.assertNotEqual(self.stage_files("settings.json").returncode, 0)
        self.assertFalse(self.stage.exists())

  def test_missing_and_deleted_sources_do_not_reuse_old_snapshot(self):
    source_file = self.put("CLAUDE.md", "old instructions")
    self.assertEqual(self.stage_files("CLAUDE.md").returncode, 0)
    source_file.unlink()
    self.assertNotEqual(self.stage_files("CLAUDE.md").returncode, 0)
    self.assertNotEqual(self.stage_files("CLAUDE.md", output=self.root / "new-stage").returncode, 0)
    self.assertEqual((self.stage / "claude/CLAUDE.md").read_text(), "old instructions")

  def test_existing_destination_is_never_overwritten_or_merged(self):
    self.put("CLAUDE.md", "public")
    self.assertEqual(self.stage_files("CLAUDE.md").returncode, 0)
    self.output.mkdir()
    stale = self.output / "stale.txt"
    stale.write_text("existing data")
    self.assertNotEqual(self.promote().returncode, 0)
    self.assertEqual(list(self.output.iterdir()), [stale])
    self.assertEqual(stale.read_text(), "existing data")

  def test_repeated_promotion_does_not_replace(self):
    self.put("CLAUDE.md", "public")
    self.assertEqual(self.stage_files("CLAUDE.md").returncode, 0)
    self.assertEqual(self.promote().returncode, 0)
    self.assertNotEqual(self.promote().returncode, 0)

  def test_symlink_file_directory_and_source_are_rejected(self):
    outside = self.root / "outside.md"
    outside.write_text(SECRET)
    self.put("CLAUDE.md", "public").unlink()
    (self.source / "CLAUDE.md").symlink_to(outside)
    self.assertNotEqual(self.stage_files("CLAUDE.md").returncode, 0)
    (self.source / "skills").symlink_to(self.root, target_is_directory=True)
    self.assertNotEqual(self.stage_files("skills/outside.md").returncode, 0)
    alias = self.root / "alias"
    alias.symlink_to(self.source, target_is_directory=True)
    result = self.run_export("stage", "--source", "claude=" + str(alias), "--include", "claude/CLAUDE.md", "--output", self.stage)
    self.assertNotEqual(result.returncode, 0)
    self.assertFalse(self.stage.exists())

  def test_output_symlink_ancestor_and_collision_are_rejected(self):
    self.put("CLAUDE.md", "public")
    alias = self.root / "alias"
    alias.symlink_to(self.root, target_is_directory=True)
    self.assertNotEqual(self.stage_files("CLAUDE.md", output=alias / "new").returncode, 0)
    self.assertNotEqual(self.stage_files("CLAUDE.md", output=self.source / "new").returncode, 0)
    self.assertNotEqual(self.stage_files("CLAUDE.md", output=self.source).returncode, 0)

  def test_stage_in_git_tree_rejected(self):
    repository = self.root / "public-repo"
    repository.mkdir()
    (repository / ".git").write_text("gitdir: synthetic")
    self.put("CLAUDE.md", "public")
    self.assertNotEqual(self.stage_files("CLAUDE.md", output=repository / "new").returncode, 0)

  def test_path_traversal_duplicate_and_unknown_types_are_rejected(self):
    self.put("CLAUDE.md", "public")
    for names in (("../outside.md",), ("skills/../CLAUDE.md",), ("CLAUDE.md", "CLAUDE.md"),
                  ("skills/model.bin",), ("skills/config.json",), ("settings.local.json",)):
      with self.subTest(names=names):
        self.assertNotEqual(self.stage_files(*names).returncode, 0)
        self.assertFalse(self.stage.exists())

  def test_binary_invalid_utf8_and_oversize_rejected(self):
    for content in (b"\x00data", b"\xff", b"a" * (1024 * 1024 + 1)):
      self.put("CLAUDE.md", content)
      self.assertNotEqual(self.stage_files("CLAUDE.md").returncode, 0)
      self.assertFalse(self.stage.exists())

  def test_promote_rescans_and_detects_added_modified_symlink(self):
    self.put("CLAUDE.md", "public")
    self.assertEqual(self.stage_files("CLAUDE.md").returncode, 0)
    self.assertNotEqual(self.promote(reviewed="0" * 64).returncode, 0)
    extra = self.stage / "extra.md"
    extra.write_text(SECRET)
    self.assertNotEqual(self.promote().returncode, 0)
    extra.unlink()
    extra.symlink_to(self.source, target_is_directory=True)
    self.assertNotEqual(self.promote().returncode, 0)
    extra.unlink()
    (self.stage / "claude/CLAUDE.md").write_text(SECRET)
    self.assertNotEqual(self.promote().returncode, 0)
    manifest = json.loads((self.stage / "export-manifest.json").read_text())
    manifest["files"]["claude/CLAUDE.md"] = hashlib.sha256(SECRET.encode()).hexdigest()
    (self.stage / "export-manifest.json").write_text(json.dumps(manifest))
    self.assertNotEqual(self.promote().returncode, 0)
    self.assertFalse(self.output.exists())

  def test_no_default_source_and_no_python_fails_closed(self):
    self.assertNotEqual(self.run_export().returncode, 0)
    env = os.environ.copy()
    empty_path = self.root / "empty-bin"
    empty_path.mkdir()
    env["PATH"] = str(empty_path)
    result = self.run_export("stage", env=env)
    self.assertEqual(result.returncode, 2)
    self.assertIn("Python", result.stderr)
    self.assertFalse(self.stage.exists())

  def test_missing_source_directory_and_include_are_required(self):
    result = self.run_export("stage", "--source", "claude=" + str(self.root / "absent"),
                             "--include", "claude/CLAUDE.md", "--output", self.stage)
    self.assertNotEqual(result.returncode, 0)
    self.assertFalse(self.stage.exists())
    self.assertNotEqual(self.run_export("stage", "--output", self.stage).returncode, 0)


if __name__ == "__main__":
  unittest.main()
