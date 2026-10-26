import tempfile
import unittest
from pathlib import Path
import prepare


class PrepareTests(unittest.TestCase):
    def test_verified_official_source(self):
        source = Path(__file__).resolve().parent / ".work" / "ex_game.rs"
        self.assertTrue(source.is_file(), "run prepare.py first; missing fixture must fail")
        with tempfile.TemporaryDirectory(dir=source.parent) as directory:
            destination = Path(directory) / "out.rs"
            prepare.prepare(source, destination)
            self.assertEqual(source.read_bytes(), destination.read_bytes())

    def test_corrupt_source_preserves_previous(self):
        root = Path(__file__).resolve().parent / ".work"
        root.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(dir=root) as directory:
            source, destination = Path(directory) / "bad.rs", Path(directory) / "out.rs"
            source.write_text("not the official sample", encoding="utf-8")
            destination.write_text("previous", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "SHA-256 mismatch"):
                prepare.prepare(source, destination)
            self.assertEqual(destination.read_text(encoding="utf-8"), "previous")

    def test_missing_source(self):
        root = Path(__file__).resolve().parent / ".work"
        root.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(dir=root) as directory:
            with self.assertRaises(FileNotFoundError):
                prepare.prepare(Path(directory) / "missing.rs", Path(directory) / "out.rs")


if __name__ == "__main__":
    unittest.main()
