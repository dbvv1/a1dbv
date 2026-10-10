import importlib.util
from pathlib import Path
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

  def test_encoded_target(self):
    self.assertEqual([], self.run_fixture({"a.md": "[a](some%20file.md)", "some file.md": "ok"})["errors"])

  def test_example_config_syntax(self):
    result = self.run_fixture({"config.toml.example": "x = [", "mcp.json.example": "{"})
    self.assertEqual(2, result["checked_files"])
    self.assertEqual(2, len(result["errors"]))


if __name__ == "__main__":
  unittest.main()
