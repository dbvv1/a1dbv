"""Actual Blend extension/reopen/export and negative subprocess paths; outputs stay temporary."""

import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

HERE = Path(__file__).resolve().parent
SOURCE = Path(
    os.environ.get("CHARACTER_BLEND_SOURCE", HERE / "inputs" / "blue.blend")
).resolve()


class AuthorTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix="character-reactions-")
        cls.root = Path(cls.temp.name)
        cls.env = dict(
            os.environ,
            XDG_CONFIG_HOME=str(cls.root / "config"),
            XDG_CACHE_HOME=str(cls.root / "cache"),
        )

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def run_author(self, source, output, frames=24, success=True):
        result = subprocess.run(
            [
                "blender",
                "-b",
                "--factory-startup",
                "--disable-autoexec",
                "--threads",
                "2",
                "--python-exit-code",
                "1",
                "--python",
                str(HERE / "author_reactions.py"),
                "--",
                "--input",
                str(source),
                "--output",
                str(output),
                "--fall-frames",
                str(frames),
            ],
            cwd=HERE,
            env=self.env,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            timeout=60,
        )
        self.assertEqual(result.returncode == 0, success, result.stdout[-3000:])
        return result

    def test_real_source_reopen_export_revision_and_three_consumer(self):
        a, b = self.root / "normal", self.root / "slow"
        for out, frames in [(a, 24), (b, 36)]:
            r = self.run_author(SOURCE, out, frames)
            self.assertIn("REACTION_SOURCE_SAVED", r.stdout)
            self.assertEqual((out / "blue-reactions.glb").read_bytes()[:4], b"glTF")
        x, y = [json.loads((out / "recipe.json").read_text()) for out in [a, b]]
        self.assertEqual(x["original_actions"], y["original_actions"])
        self.assertEqual(x["original_structure"], y["original_structure"])
        env = dict(
            self.env,
            CHARACTER_REACTION_FILE=str(a / "blue-reactions.glb"),
            CHARACTER_REACTION_SLOW_FILE=str(b / "blue-reactions.glb"),
        )
        r = subprocess.run(
            ["node", "--test", "test_reactions.mjs"],
            cwd=HERE,
            env=env,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            timeout=30,
        )
        self.assertEqual(r.returncode, 0, r.stdout)
        self.assertIn("pass 6", r.stdout)
        self.assertIn("skipped 0", r.stdout)

    def test_changed_source_fails_before_output(self):
        p = self.root / "changed.blend"
        p.write_bytes(SOURCE.read_bytes() + b"x")
        out = self.root / "bad"
        r = self.run_author(p, out, success=False)
        self.assertIn("source hash mismatch", r.stdout)
        self.assertFalse(out.exists())

    def test_missing_source_fails_before_output(self):
        out = self.root / "missing-output"
        self.run_author(self.root / "missing.blend", out, success=False)
        self.assertFalse(out.exists())

    def test_invalid_recipe_fails_before_output(self):
        out = self.root / "bad-frames"
        self.run_author(SOURCE, out, 100, False)
        self.assertFalse(out.exists())

    def test_existing_delivery_is_not_overwritten(self):
        out = self.root / "keep"
        out.mkdir()
        (out / "keep.txt").write_text("keep")
        self.run_author(SOURCE, out, success=False)
        self.assertEqual(list(out.iterdir()), [out / "keep.txt"])
        self.assertEqual((out / "keep.txt").read_text(), "keep")


if __name__ == "__main__":
    unittest.main()
