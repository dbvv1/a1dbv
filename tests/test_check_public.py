import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest
from unittest import mock


SCRIPT = Path(__file__).resolve().parents[1] / "scripts/check_public.py"
spec = importlib.util.spec_from_file_location("check_public", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

# Built at runtime so this file never contains a literal that the scanner flags.
FAKE_KEY = "sk-" + "A1b2C3d4" * 4
FAKE_HOME = "/Users/" + "alice" + "/project"
FAKE_EMAIL = "alice" + "@" + "gmail.com"
WORKSPACE_PREFIX = "/workspace/" + "scratch/"
FAKE_WORKSPACE = WORKSPACE_PREFIX + "ab12" * 3


class PublicScanTests(unittest.TestCase):
  def run_cli(self, root, *args):
    # Pin both sides of the pipe, independent of the host locale or Python alias.
    env = dict(os.environ, PYTHONIOENCODING="utf-8")
    return subprocess.run([sys.executable, str(SCRIPT), "--root", str(root), *args],
                          capture_output=True, text=True, encoding="utf-8", env=env)

  def run_fixture(self, files, git=False):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      for name, content in files.items():
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
      if git:
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
      return module.scan_files(root)

  def kinds(self, files):
    return sorted(f["kind"] for f in self.run_fixture(files)[1])

  def test_clean_and_placeholder_content_passes(self):
    text = ("Use noreply@anthropic.com, dev@example.com, x@users.noreply.github.com.\n"
            "Paths: /Users/Shared/Epic Games/, /home/user/repo, C:\\Users\\foo\\x, ~/.claude\n"
            "Words: task-gpu-exclusive-capture-window, desk-gpu-exclusive-render-lock\n")
    count, findings = self.run_fixture({"a.md": text})
    self.assertEqual((1, []), (count, findings))

  def test_flags_credential_key_path_and_email(self):
    files = {"a.md": f"token {FAKE_KEY}\n{FAKE_HOME}\nmail {FAKE_EMAIL}\n",
             "b.txt": "-----BEGIN RSA " + "PRIVATE KEY-----\n"}
    self.assertEqual(["credential", "email", "local-path", "private-key"], self.kinds(files))

  def test_flags_cloud_instance_root_and_descendants(self):
    for path in (FAKE_WORKSPACE, FAKE_WORKSPACE + "/", FAKE_WORKSPACE + "/repo/report.md",
                 FAKE_WORKSPACE + "/shared/result.json", WORKSPACE_PREFIX + "AB12" * 3):
      with self.subTest(path=path):
        count, findings = self.run_fixture({"a.md": f"Evidence: `{path}`\n"})
        self.assertEqual(1, count)
        self.assertEqual([{"kind": "local-path", "file": "a.md", "line": 1,
                           "match": path[:len(FAKE_WORKSPACE)]}], findings)

  def test_workspace_examples_and_non_instance_segments_pass(self):
    paths = ("/workspace/repo", "/workspace/shared/repo", WORKSPACE_PREFIX.rstrip("/"),
             WORKSPACE_PREFIX + "<instance-id>/repo", WORKSPACE_PREFIX + "${INSTANCE}/repo",
             WORKSPACE_PREFIX + "example/repo", "/tmp/example/repo",
             FAKE_WORKSPACE.lstrip("/"), "docs" + FAKE_WORKSPACE,
             "https://example.com" + FAKE_WORKSPACE,
             FAKE_WORKSPACE[:-1] + "/repo", FAKE_WORKSPACE + "0/repo",
             FAKE_WORKSPACE + "-example/repo", FAKE_WORKSPACE + ".example/repo",
             WORKSPACE_PREFIX + "gh12" * 3 + "/repo")
    for path in paths:
      with self.subTest(path=path):
        self.assertEqual((1, []), self.run_fixture({"a.md": path}))

  def test_cli_rejects_tracked_cloud_instance_path(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / "evidence.md").write_text(f"Evidence: `{FAKE_WORKSPACE}/report.md`\n", encoding="utf-8")
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      subprocess.run(["git", "-C", str(root), "add", "evidence.md"], check=True)
      result = self.run_cli(root)
      self.assertEqual(1, result.returncode)
      report = json.loads(result.stdout)
      self.assertEqual(1, report["checked_files"])
      self.assertEqual([{"kind": "local-path", "file": "evidence.md", "line": 1,
                         "match": FAKE_WORKSPACE}], report["findings"])
      self.assertEqual("", result.stderr)

  def test_credential_is_redacted_in_output(self):
    findings = self.run_fixture({"a.md": FAKE_KEY})[1]
    self.assertNotIn(FAKE_KEY, str(findings))

  def test_allowlist_needs_exact_file_and_match(self):
    allow = f"# reviewed\na.md\t{FAKE_EMAIL}\n"
    files = {"a.md": FAKE_EMAIL, "b.md": FAKE_EMAIL, module.ALLOW_FILE: allow}
    self.assertEqual(["b.md"], [f["file"] for f in self.run_fixture(files)[1]])

  def test_untracked_files_are_ignored_in_git_checkout(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      (root / "tracked.md").write_text("ok", encoding="utf-8")
      subprocess.run(["git", "-C", str(root), "add", "tracked.md"], check=True)
      (root / "scratch.md").write_text(FAKE_EMAIL, encoding="utf-8")
      self.assertEqual((1, []), module.scan_files(root))

  def test_tracked_symlink_scans_link_text_not_target_content(self):
    with tempfile.TemporaryDirectory() as directory:
      fixture = Path(directory)
      root = fixture / "repo"
      root.mkdir()
      target = fixture / FAKE_KEY
      target.write_text("clean target", encoding="utf-8")
      (root / "flagged-link").symlink_to(Path("..") / target.name)
      content_target = fixture / "content-target"
      content_target.write_text(FAKE_KEY, encoding="utf-8")
      (root / "clean-link").symlink_to(Path("..") / content_target.name)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
      with mock.patch.object(Path, "read_text", side_effect=AssertionError("symlink target read")):
        count, findings = module.scan_files(root)
      self.assertEqual(2, count)
      self.assertEqual([("credential", "flagged-link")],
                       [(f["kind"], f["file"]) for f in findings])
      self.assertNotIn(FAKE_KEY, str(findings))

  def test_dangling_and_directory_symlinks_scan_link_text(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / "dangling").symlink_to(FAKE_KEY)
      (root / "directory").symlink_to(".", target_is_directory=True)
      count, findings = module.scan_files(root)
      self.assertEqual(2, count)
      self.assertEqual([("credential", "dangling")],
                       [(f["kind"], f["file"]) for f in findings])

  def test_symlink_text_is_not_normalized(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      target = "./missing//child"
      (root / "link").symlink_to(target)
      with mock.patch.object(module, "PATTERNS", [("link-text", re.compile(re.escape(target)))]):
        self.assertEqual((1, [{"kind": "link-text", "file": "link", "line": 1,
                              "match": target}]), module.scan_files(root))

  def test_symlink_fixtures_do_not_leak_the_temporary_parent(self):
    with tempfile.TemporaryDirectory() as directory:
      # Detect accidental absolute fixture paths without needing a real home
      # directory or a Windows-shaped filename on the host filesystem.
      patterns = module.PATTERNS + [("local-path", re.compile(re.escape(directory)))]
      with mock.patch.object(tempfile, "tempdir", directory), \
           mock.patch.object(module, "PATTERNS", patterns):
        self.test_tracked_symlink_scans_link_text_not_target_content()
        self.test_dangling_and_directory_symlinks_scan_link_text()
        self.test_symlink_allowlist_is_scanned_not_loaded()

  def test_core_symlinks_false_scans_plain_link_file(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / "link").symlink_to(FAKE_KEY)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      subprocess.run(["git", "-C", str(root), "add", "link"], check=True)
      (root / "link").unlink()
      subprocess.run(["git", "-C", str(root), "-c", "core.symlinks=false",
                      "checkout-index", "-f", "link"], check=True)
      self.assertFalse((root / "link").is_symlink())
      self.assertEqual(FAKE_KEY, (root / "link").read_text(encoding="utf-8"))
      count, findings = module.scan_files(root)
      self.assertEqual(1, count)
      self.assertEqual(["credential"], [f["kind"] for f in findings])

  def test_symlink_allowlist_is_scanned_not_loaded(self):
    with tempfile.TemporaryDirectory() as directory:
      fixture = Path(directory)
      root = fixture / "repo"
      (root / "scripts").mkdir(parents=True)
      (root / "tracked.txt").write_text(FAKE_KEY, encoding="utf-8")
      target = fixture / FAKE_KEY
      target.write_text(f"tracked.txt\t{FAKE_KEY}\n", encoding="utf-8")
      (root / module.ALLOW_FILE).symlink_to(Path("../..") / target.name)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
      self.assertEqual(set(), module.load_allow(root))
      count, findings = module.scan_files(root)
      self.assertEqual(2, count)
      self.assertEqual([module.ALLOW_FILE, "tracked.txt"], [f["file"] for f in findings])

  def test_core_symlinks_false_allowlist_text_is_scanned_not_loaded(self):
    for target_text in (FAKE_KEY, f"tracked.txt\t{FAKE_KEY}"):
      with self.subTest(target_text=target_text), tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / "scripts").mkdir()
        (root / "tracked.txt").write_text(FAKE_KEY, encoding="utf-8")
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        subprocess.run(["git", "-C", str(root), "add", "tracked.txt"], check=True)
        # Model a real 120000 index entry without creating a tab-containing
        # target filename, which native Windows cannot represent.
        blob = subprocess.run(["git", "-C", str(root), "hash-object", "-w", "--stdin"],
                              input=target_text.encode("utf-8"), capture_output=True, check=True)
        subprocess.run(["git", "-C", str(root), "update-index", "--add", "--cacheinfo",
                        "120000", blob.stdout.decode("ascii").strip(), module.ALLOW_FILE], check=True)
        subprocess.run(["git", "-C", str(root), "-c", "core.symlinks=false",
                        "checkout-index", "-f", module.ALLOW_FILE], check=True)
        self.assertFalse((root / module.ALLOW_FILE).is_symlink())
        self.assertEqual(target_text, (root / module.ALLOW_FILE).read_text(encoding="utf-8"))
        self.assertEqual(set(), module.load_allow(root))
        count, findings = module.scan_files(root)
        self.assertEqual(2, count)
        self.assertEqual([module.ALLOW_FILE, "tracked.txt"], [f["file"] for f in findings])

  def test_tracked_path_and_allowlist_beneath_symlink_fail_without_reading(self):
    with tempfile.TemporaryDirectory() as directory:
      fixture = Path(directory)
      root = fixture / "repo"
      (root / "nested").mkdir(parents=True)
      (root / "nested/tracked.txt").write_text("clean original", encoding="utf-8")
      (root / "scripts").mkdir()
      (root / module.ALLOW_FILE).write_text("# clean original\n", encoding="utf-8")
      (root / "tracked.txt").write_text(FAKE_KEY, encoding="utf-8")
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
      target = fixture / "new-target"
      target.mkdir()
      (target / "tracked.txt").write_text(FAKE_KEY, encoding="utf-8")
      (target / "public-scan-allow.txt").write_text(f"tracked.txt\t{FAKE_KEY}\n", encoding="utf-8")
      for name in ("nested", "scripts"):
        (root / name).rename(fixture / ("original-" + name))
        (root / name).symlink_to(target, target_is_directory=True)
      self.assertEqual(set(), module.load_allow(root))
      result = self.run_cli(root)
      self.assertEqual(1, result.returncode)
      report = json.loads(result.stdout)
      self.assertEqual(1, report["checked_files"])
      self.assertEqual([("symlink-parent", "nested/tracked.txt"),
                        ("symlink-parent", module.ALLOW_FILE), ("credential", "tracked.txt")],
                       [(f["kind"], f["file"]) for f in report["findings"]])
      self.assertEqual("", result.stderr)

  def test_index_symlink_fixture_needs_no_control_character_filename(self):
    write_text = Path.write_text

    def reject_tab_filename(path, *args, **kwargs):
      if "\t" in path.name:
        raise OSError("control character in filename is not supported")
      return write_text(path, *args, **kwargs)

    with mock.patch.object(Path, "write_text", reject_tab_filename):
      self.test_core_symlinks_false_allowlist_text_is_scanned_not_loaded()

  def test_binary_and_missing_root(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / "x.bin").write_bytes(b"\xff\xfe\x00")
      self.assertEqual((0, []), module.scan_files(root))
    result = self.run_cli("/nonexistent-root-for-test")
    self.assertEqual(2, result.returncode)

  def scan_identity(self, author, committer):
    result = subprocess.CompletedProcess([], 0, f"abc123\t{author}\t{committer}\n", "")
    with mock.patch.object(module.subprocess, "run", return_value=result):
      return module.scan_commits(Path("."), "HEAD")

  def test_github_commit_identities_pass_for_both_roles(self):
    for email in ("example@users.noreply.github.com",
                  "1+example-user@users.noreply.github.com",
                  "1+example[bot]@users.noreply.github.com",
                  "1+example_org@users.noreply.github.com", "noreply@github.com"):
      with self.subTest(email=email):
        self.assertEqual([], self.scan_identity(email, email))

  def test_agent_platform_noreply_is_exact_match(self):
    self.assertEqual([], self.scan_identity("noreply@anthropic.com", "noreply@anthropic.com"))
    for email in ("Noreply@anthropic.com", "noreply@anthropic.com.invalid", "dev" + "@" + "anthropic.com"):
      with self.subTest(email=email):
        self.assertEqual(2, len(self.scan_identity(email, email)))

  def test_other_and_malformed_commit_identities_fail_for_each_role(self):
    invalid = ("dev@example.com", "noreply@example.com", "dev@invalid.example",
               "example@users.noreply.github.com.invalid", "noreply@github.com.invalid",
               "example@" + "notusers.noreply.github.com", "@users.noreply.github.com",
               "a@@users.noreply.github.com", "a b@users.noreply.github.com",
               "+example@users.noreply.github.com", "1+@users.noreply.github.com",
               "example+other@users.noreply.github.com", "-example@users.noreply.github.com",
               "\u0131@users.noreply.github.com",
               "", "invalid", " noreply@github.com", "noreply@github.com ")
    good = "noreply@github.com"
    for email in invalid:
      for role in ("author", "committer"):
        with self.subTest(email=email, role=role):
          findings = self.scan_identity(email if role == "author" else good,
                                        email if role == "committer" else good)
          self.assertEqual([role], [f["role"] for f in findings])
          self.assertEqual("commit-email", findings[0]["kind"])

  def test_non_email_commit_identity_is_not_disclosed(self):
    for email in ("", "invalid-identity-example"):
      with self.subTest(email=email):
        findings = self.scan_identity(email, email)
        self.assertEqual(["[non-email]", "[non-email]"], [f["match"] for f in findings])
        if email:
          self.assertNotIn(email, str(findings))

  def test_cli_rejects_explicit_empty_commit_range(self):
    with tempfile.TemporaryDirectory() as directory:
      omitted = self.run_cli(directory)
      self.assertEqual(0, omitted.returncode)
      empty = self.run_cli(directory, "--commits", "")
      self.assertEqual(2, empty.returncode)
      self.assertIn("--commits must not be empty", empty.stderr)
      self.assertEqual("", empty.stdout)

  def test_cli_unicode_output_ignores_parent_locale(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      name = "测试-🧪.txt"
      (root / name).write_text(FAKE_KEY, encoding="utf-8")
      with mock.patch.object(subprocess, "_text_encoding", return_value="gbk"), \
           mock.patch.dict(os.environ, {"PYTHONIOENCODING": "gbk"}):
        result = self.run_cli(root)
      self.assertEqual(1, result.returncode)
      report = json.loads(result.stdout)
      self.assertEqual(1, report["checked_files"])
      self.assertEqual([(name, "credential")], [(f["file"], f["kind"]) for f in report["findings"]])
      self.assertNotIn(FAKE_KEY, result.stdout + result.stderr)
      self.assertEqual("", result.stderr)

  def test_commit_identity(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      for email in ("1+example@users.noreply.github.com", "dev@example.com"):
        subprocess.run(["git", "-C", str(root), "-c", "user.name=t", "-c", f"user.email={email}",
                        "commit", "-q", "--allow-empty", "-m", "x"], check=True)
      findings = module.scan_commits(root, "HEAD")
      self.assertEqual(["author", "committer"], [f["role"] for f in findings])
      self.assertTrue(all(f["kind"] == "commit-email" for f in findings))
      self.assertNotIn("dev@example.com", str(findings))
      self.assertEqual([], module.scan_commits(root, "HEAD..HEAD"))
      for revisions in ("", "no-such-ref"):
        with self.subTest(revisions=revisions), self.assertRaises(ValueError):
          module.scan_commits(root, revisions)


if __name__ == "__main__":
  unittest.main()
