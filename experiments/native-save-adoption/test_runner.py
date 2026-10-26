from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

from run import copy_fixed_source, extract_official, invoke


class RunnerTests(unittest.TestCase):
    def test_wrong_source_revision_fails_before_copy(self):
        with tempfile.TemporaryDirectory() as folder, patch("run.subprocess.check_output", return_value="wrong\n"):
            destination = Path(folder) / "out"
            with self.assertRaisesRegex(ValueError, "fixed SaveKit"):
                copy_fixed_source(Path(folder), destination)
            self.assertFalse(destination.exists())

    def test_wrong_official_archive_fails_before_extract(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            archive = root / "bad.zip"
            archive.write_bytes(b"fixture, not the official archive")
            with self.assertRaisesRegex(ValueError, "hash mismatch"):
                extract_official(archive, root / "out")
            self.assertFalse((root / "out").exists())

    def test_consumer_protocol_accepts_result_but_rejects_empty_or_error(self):
        # These exercise the process protocol only, not save logic or an engine.
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            log = root / "protocol.log"
            for output, accepted in (("SAVE_RESULT fixture", True), ("", False),
                                     ("ERROR: fixture\nSAVE_RESULT fixture", False)):
                command = [sys.executable, "-c", "print(" + repr(output) + ")"]
                if accepted:
                    invoke(command, root, None, log, marker="SAVE_RESULT")
                else:
                    with self.assertRaises(RuntimeError):
                        invoke(command, root, None, log, marker="SAVE_RESULT")
                self.assertEqual(log.read_text(), output + "\n")

    def test_unexpected_failure_is_not_expected_counterexample(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            command = [sys.executable, "-c", "print('SAVE_FAILED: unrelated'); raise SystemExit(1)"]
            with self.assertRaisesRegex(RuntimeError, "unexpected counterexample"):
                invoke(command, root, None, root / "failure.log", expected=1)


if __name__ == "__main__":
    unittest.main()
