import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest


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

  def test_commit_identity(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      (root / "a.md").write_text("ok", encoding="utf-8")
      for email in ("1+bot@users.noreply.github.com", FAKE_EMAIL):
        subprocess.run(["git", "-C", str(root), "-c", "user.name=t", "-c", f"user.email={email}",
                        "commit", "-q", "--allow-empty", "-m", "x"], check=True)
      findings = module.scan_commits(root, "HEAD")
      self.assertEqual(2, len(findings))
      self.assertTrue(all(f["kind"] == "commit-email" for f in findings))
      self.assertNotIn(FAKE_EMAIL, str(findings))
      with self.assertRaises(ValueError):
        module.scan_commits(root, "no-such-ref")


if __name__ == "__main__":
  unittest.main()
