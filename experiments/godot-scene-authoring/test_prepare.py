import hashlib
import io
from pathlib import Path
import tempfile
import unittest
import zipfile

from prepare import extract_verified, prepare


class ArchiveTests(unittest.TestCase):
    def archive(self, extra=None, missing=False):
        result = io.BytesIO()
        with zipfile.ZipFile(result, "w") as archive:
            for name in ("project.godot", "main.gd", "player.gd", "LICENSE.md", "fonts/LICENSE.txt"):
                if missing and name == "project.godot":
                    continue
                archive.writestr("dodge_the_creeps/" + name, "fixture")
            if extra:
                archive.writestr(extra, "must not escape")
        return result.getvalue()

    def test_normal_preserves_license(self):
        data = self.archive()
        with tempfile.TemporaryDirectory() as folder:
            result = extract_verified(data, Path(folder), hashlib.sha256(data).hexdigest())
            self.assertEqual((result / "LICENSE.md").read_text(), "fixture")
            self.assertTrue((result / "fonts/LICENSE.txt").is_file())

    def test_bad_digest(self):
        with tempfile.TemporaryDirectory() as folder:
            with self.assertRaisesRegex(ValueError, "checksum"):
                extract_verified(self.archive(), Path(folder))

    def test_missing_input(self):
        with tempfile.TemporaryDirectory() as folder:
            with self.assertRaises(FileNotFoundError):
                prepare(Path(folder), Path(folder) / "absent.zip")
            data = self.archive(missing=True)
            with self.assertRaisesRegex(ValueError, "Missing official"):
                extract_verified(data, Path(folder), hashlib.sha256(data).hexdigest())

    def test_traversal(self):
        data = self.archive("dodge_the_creeps/../escaped")
        with tempfile.TemporaryDirectory() as folder:
            with self.assertRaisesRegex(ValueError, "Unsafe"):
                extract_verified(data, Path(folder), hashlib.sha256(data).hexdigest())
            self.assertFalse((Path(folder) / "escaped").exists())


if __name__ == "__main__":
    unittest.main()
