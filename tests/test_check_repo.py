import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


spec = importlib.util.spec_from_file_location("check_repo", Path(__file__).resolve().parents[1] / "scripts/check_repo.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class RepoCheckTests(unittest.TestCase):
  def run_fixture(self, files):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      for name, content in files.items():
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
      return module.check(root)

  def test_existing_and_external_links(self):
    self.assertEqual([], self.run_fixture({"README.md": "[a](docs/a.md#missing-anchor) [web](https://example.com/x)\n", "docs/a.md": "ok"})["errors"])

  def test_missing_and_escape(self):
    result = self.run_fixture({"a.md": "[a](missing.md) [b](../outside.md)"})
    self.assertEqual(2, len(result["errors"]))

  def test_fences_are_not_links(self):
    self.assertEqual([], self.run_fixture({"a.md": "```md\n[x](no.md)\n```\n~~~\n[x](no.md)\n~~~"})["errors"])

  def test_invalid_json_and_toml(self):
    self.assertEqual(2, len(self.run_fixture({"a.json": "{", "b.toml": "x = ["})["errors"]))

  def test_json_rejects_nonstandard_numeric_constants(self):
    for name in ("data.json", "data.json.example"):
      for constant in ("NaN", "Infinity", "-Infinity"):
        for text in (constant, '{"nested": {"value": %s}}' % constant):
          with self.subTest(name=name, constant=constant, text=text):
            result = self.run_fixture({name: text})
            self.assertEqual(1, result["checked_files"])
            self.assertEqual(1, len(result["errors"]))
            self.assertTrue(result["errors"][0].startswith(f"{name}: "), result["errors"])

  def test_json_keeps_legal_values(self):
    files = {
      "empty.json": "{}",
      "strings.json.example": '{"nan": "NaN", "infinity": "Infinity"}',
      "numbers.json": '{"zero": 0, "negative": -1.5, "integer": 42, "large": 1e999}',
    }
    result = self.run_fixture(files)
    self.assertEqual(3, result["checked_files"])
    self.assertEqual([], result["errors"])

  def test_encoded_target(self):
    self.assertEqual([], self.run_fixture({"a.md": "[a](some%20file.md)", "some file.md": "ok"})["errors"])

  def test_example_config_syntax(self):
    result = self.run_fixture({"config.toml.example": "x = [", "mcp.json.example": "{"})
    self.assertEqual(2, result["checked_files"])
    self.assertEqual(2, len(result["errors"]))

  def test_record_limits(self):
    job = "docs/collaboration/local-jobs/X-001.md"
    long_body = "\n".join(f"line {i}" for i in range(90))
    self.assertEqual(1, len(self.run_fixture({job: "status: running\n" + long_body})["errors"]))
    self.assertEqual([], self.run_fixture({job: "status: accepted\n" + long_body})["errors"])
    self.assertEqual([], self.run_fixture({job: "status: running\nshort\n"})["errors"])
    self.assertEqual([], self.run_fixture({"docs/collaboration/local-jobs/README.md": long_body})["errors"])
    self.assertEqual(1, len(self.run_fixture({"docs/collaboration/TASKS.md": "x" * 11000})["errors"]))
    self.assertEqual([], self.run_fixture({"docs/collaboration/TASKS.md": "x" * 9000})["errors"])


class RepoCheckCLITests(unittest.TestCase):
  def run_cli(self, *args, encoding="gbk"):
    # Exercise redirected stdout encoding, not a native Windows filesystem.
    return subprocess.run([sys.executable, str(Path(module.__file__)), *map(str, args)],
                          env=dict(os.environ, PYTHONIOENCODING=f"{encoding}:strict"),
                          capture_output=True)

  def assert_report(self, root, code):
    expected = module.check(root)
    for encoding in ("utf-8", "gbk", "ascii"):
      with self.subTest(encoding=encoding):
        result = self.run_cli("--root", root, encoding=encoding)
        self.assertEqual(code, result.returncode)
        self.assertEqual(b"", result.stderr)
        self.assertEqual(expected, json.loads(result.stdout.decode("ascii")))

  def test_clean_root_retains_success(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / "clean-\uf03a.md").write_text("普通文本\n", encoding="utf-8")
      self.assert_report(root, 0)

  def test_unicode_errors_survive_legacy_stdout_encoding(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / "C\uf03a").mkdir()
      (root / "C\uf03a/README.md").write_text("[link](missing-\U0001f9ea.md)\n", encoding="utf-8")
      (root / "中文.json").write_text("{", encoding="utf-8")
      (root / "bad-\uf03a.md").write_bytes(b"\xff")
      self.assertEqual(3, len(module.check(root)["errors"]))
      self.assert_report(root, 1)

  def test_missing_root_and_argument_remain_usage_errors(self):
    with tempfile.TemporaryDirectory() as directory:
      for args in (("--root", Path(directory) / "missing"), ("--root",)):
        with self.subTest(args=args):
          result = self.run_cli(*args)
          self.assertEqual(2, result.returncode)
          self.assertEqual(b"", result.stdout)
          self.assertIn(b"error:", result.stderr)
          self.assertNotIn(b"Traceback", result.stderr)


if __name__ == "__main__":
  unittest.main()
