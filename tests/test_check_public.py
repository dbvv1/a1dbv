import importlib.util
from pathlib import Path
import subprocess
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


class PublicScanTests(unittest.TestCase):
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
            "Paths: /Users/Shared/Epic Games/, /home/user/repo, C:\\Users\\foo\\x, ~/.claude\n")
    count, findings = self.run_fixture({"a.md": text})
    self.assertEqual((1, []), (count, findings))

  def test_flags_credential_key_path_and_email(self):
    files = {"a.md": f"token {FAKE_KEY}\n{FAKE_HOME}\nmail {FAKE_EMAIL}\n",
             "b.txt": "-----BEGIN RSA " + "PRIVATE KEY-----\n"}
    self.assertEqual(["credential", "email", "local-path", "private-key"], self.kinds(files))

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

  def test_binary_and_missing_root(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / "x.bin").write_bytes(b"\xff\xfe\x00")
      self.assertEqual((0, []), module.scan_files(root))
    result = subprocess.run(["python3", str(SCRIPT), "--root", "/nonexistent-root-for-test"],
                            capture_output=True, text=True)
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
      command = ["python3", str(SCRIPT), "--root", directory]
      omitted = subprocess.run(command, capture_output=True, text=True)
      self.assertEqual(0, omitted.returncode)
      empty = subprocess.run(command + ["--commits", ""], capture_output=True, text=True)
      self.assertEqual(2, empty.returncode)
      self.assertIn("--commits must not be empty", empty.stderr)
      self.assertEqual("", empty.stdout)

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
