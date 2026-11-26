"""Unit tests for visual_pregate pixel distribution and pitch-sweep SSR checks."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "domains/game-dev/templates/.claude/skills/game-quality-pass/scripts/visual_pregate.py"


def save_rgb(path: Path, arr: np.ndarray) -> Path:
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), mode="RGB").save(path)
    return path


class VisualPregateTests(unittest.TestCase):
    def run_cli(self, *cli_args: str) -> tuple[int, dict | None, str]:
        res = subprocess.run(
            [sys.executable, str(SCRIPT), *cli_args],
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        payload = json.loads(res.stdout) if res.stdout.strip().startswith("{") else None
        return res.returncode, payload, res.stderr

    def test_clean_pair_passes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            grad = np.zeros((100, 120, 3), dtype=np.float32)
            grad[:, :, 0] = np.linspace(12, 220, 100)[:, None]
            grad[:, :, 1] = np.linspace(16, 180, 100)[:, None]
            grad[:, :, 2] = np.linspace(24, 240, 100)[:, None]
            b = save_rgb(p / "base.png", grad)
            c = save_rgb(p / "cand.png", grad * 1.02)
            code, out, err = self.run_cli("--baseline", str(b), "--candidate", str(c))
            self.assertEqual(0, code, err)
            self.assertEqual("PASS", out["verdict"])

    def test_washed_out_shadow_lift_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            base = np.zeros((100, 120, 3), dtype=np.float32)
            base[:30] = [10, 12, 15]
            base[30:] = [180, 190, 200]
            cand = base * 0.45 + 75.0
            b = save_rgb(p / "base.png", base)
            c = save_rgb(p / "cand.png", cand)
            code, out, _ = self.run_cli("--baseline", str(b), "--candidate", str(c))
            self.assertEqual(1, code)
            self.assertEqual("FAIL", out["verdict"])
            self.assertTrue(any("p5_shadow_floor_lift" in r for r in out["reasons"]))

    def test_pitch_sweep_rejects_sliding_horizontal_ssr_cutoff(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            cutoff_paths = []
            for idx, y_cut in enumerate((105, 130, 155)):
                arr = np.full((180, 200, 3), 45.0, dtype=np.float32)
                arr[y_cut:, :] = 195.0
                cutoff_paths.append(str(save_rgb(p / f"cut_{idx}.png", arr)))

            code, out, _ = self.run_cli("--pitch-sweep", *cutoff_paths)
            self.assertEqual(1, code)
            self.assertEqual("FAIL", out["verdict"])
            self.assertGreaterEqual(out["slide_px"], 12)
            self.assertGreater(out["max_band_step"], 0.16)

            smooth_paths = []
            for idx, shift in enumerate((0.0, 6.0, 12.0)):
                y = np.linspace(35.0, 95.0 + shift, 180, dtype=np.float32)[:, None, None]
                arr = np.repeat(np.repeat(y, 200, axis=1), 3, axis=2)
                smooth_paths.append(str(save_rgb(p / f"smooth_{idx}.png", arr)))

            code2, out2, err2 = self.run_cli("--pitch-sweep", *smooth_paths)
            self.assertEqual(0, code2, err2)
            self.assertEqual("PASS", out2["verdict"])

    def test_missing_file_returns_error_exit_2(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            missing = p / "does_not_exist.png"
            code, out, err = self.run_cli("--baseline", str(missing), "--candidate", str(missing))
            self.assertEqual(2, code)
            self.assertIsNone(out)
            self.assertIn("Error:", err)

            single = save_rgb(p / "single.png", np.full((60, 80, 3), 64.0, dtype=np.float32))
            code2, out2, err2 = self.run_cli("--pitch-sweep", str(single))
            self.assertEqual(2, code2)
            self.assertIsNone(out2)
            self.assertIn("--pitch-sweep requires at least 2 images", err2)

    def test_side_by_side_split_passes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            left = np.full((100, 120, 3), 40.0, dtype=np.float32)
            left[50:, :] = 190.0
            gap = np.zeros((100, 4, 3), dtype=np.float32)
            sbs = save_rgb(p / "sbs.png", np.concatenate([left, gap, left * 1.02], axis=1))
            code, out, err = self.run_cli("--side-by-side", str(sbs), "--center-gap", "4")
            self.assertEqual(0, code, err)
            self.assertEqual("PASS", out["verdict"])


if __name__ == "__main__":
    unittest.main()
