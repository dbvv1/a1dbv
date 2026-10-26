from pathlib import Path
import tempfile
import unittest

from run import copy_application, copy_notices, digest, write_preset, require_script_profile


class PackageTests(unittest.TestCase):
    def test_copy_preserves_both_artifact_bytes(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            source = root / "source"
            source.mkdir()
            for name in ("game.x86_64", "game.pck"):
                (source / name).write_bytes(b"file-copy fixture, not an engine")
            copied = root / "delivery"
            receipt = copy_application(source, copied)
            self.assertEqual(set(receipt), {"game.x86_64", "game.pck"})
            self.assertTrue(all(digest(copied / name) == value for name, value in receipt.items()))

    def test_missing_data_rejects_before_copy(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            source = root / "source"
            source.mkdir()
            (source / "game.x86_64").write_bytes(b"executable fixture")
            with self.assertRaisesRegex(ValueError, "executable AND PCK"):
                copy_application(source, root / "delivery")
            self.assertFalse((root / "delivery").exists())

    def test_notices_keep_attribution_and_font_license_path(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            project, delivery = root / "project", root / "delivery"
            (project / "fonts").mkdir(parents=True)
            delivery.mkdir()
            (project / "LICENSE.md").write_text("MIT fixture")
            (project / "fonts/LICENSE.txt").write_text("OFL fixture")
            (project / "README.md").write_text("![preview](missing.png)\n## Copying\nCredit fixture; fonts/LICENSE.txt\n")
            copy_notices(project, delivery)
            self.assertEqual((delivery / "fonts/LICENSE.txt").read_text(), "OFL fixture")
            notices = (delivery / "ASSET-NOTICES.txt").read_text()
            self.assertIn("Credit fixture", notices)
            self.assertNotIn("missing.png", notices)

    def test_filters_are_explicit(self):
        with tempfile.TemporaryDirectory() as folder:
            project = Path(folder)
            write_preset(project, project / "templates", False)
            self.assertIn('include_filter=""', (project / "export_presets.cfg").read_text())
            write_preset(project, project / "templates", True)
            preset = (project / "export_presets.cfg").read_text()
            self.assertIn('include_filter="*.txt"', preset)
            self.assertIn('exclude_filter="unreleased/*"', preset)
            self.assertIn('binary_format/embed_pck=false', preset)


class ProfileTests(unittest.TestCase):
    # Parser fixtures only. Real engine output is validated by run.py --profile.
    SAMPLE = ("BEGIN PROFILING\nACCUMULATED: total: 0.001\n"
              "0:res://player.gd::14::_process\n\ttotal: 0.001 self: 0.001 tcalls: 406\n"
              "1:res://main.gd::26::_on_MobTimer_timeout\n\ttotal: 0.001 self: 0.001 tcalls: 2\n")

    def test_positive_gameplay_samples(self):
        self.assertEqual(require_script_profile(self.SAMPLE)["_on_MobTimer_timeout"], 2)

    def test_no_input_fails(self):
        with self.assertRaises(RuntimeError):
            require_script_profile("")

    def test_successful_but_empty_capture_fails(self):
        with self.assertRaises(RuntimeError):
            require_script_profile("BEGIN PROFILING\nACCUMULATED: total: 0.0\nDELIVERY_RESULT failed=false")

    def test_zero_calls_fail(self):
        with self.assertRaises(RuntimeError):
            require_script_profile(self.SAMPLE.replace("tcalls: 406", "tcalls: 0"))

    def test_missing_enable_or_zero_total_fails(self):
        for text in (self.SAMPLE.replace("BEGIN PROFILING", ""),
                     self.SAMPLE.replace("total: 0.001\n", "total: 0.0\n")):
            with self.subTest(text=text), self.assertRaises(RuntimeError):
                require_script_profile(text)


if __name__ == "__main__":
    unittest.main()
