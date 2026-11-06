#!/usr/bin/env python3
"""Regression tests for verify_audition_pack.py.

The tests use only the Python standard library. They copy the pack into a
temporary directory, introduce one defect at a time, and assert that the
verifier reports it. No audio device, GUI, browser or network is used.
"""

from __future__ import annotations

import contextlib
import hashlib
import io
import json
import math
import re
import shutil
import struct
import sys
import tempfile
import unittest
import wave
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import verify_audition_pack as verifier  # noqa: E402


def _copy_pack(tmp: str) -> Path:
  destination = Path(tmp) / "pack"
  shutil.copytree(
    HERE,
    destination,
    ignore=shutil.ignore_patterns("__pycache__", "*.pyc"),
  )
  return destination


def _load_manifest(root: Path) -> dict:
  return json.loads((root / "manifest.json").read_text(encoding="utf-8"))


def _save_manifest(root: Path, manifest: dict) -> None:
  (root / "manifest.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
    newline="\n",
  )


def _cue(manifest: dict, cue_id: str) -> dict:
  return next(cue for cue in manifest["cues"] if cue["id"] == cue_id)


def _sync_raw_only(root: Path, cue_id: str) -> None:
  """Update bytes/SHA-256 after replacing a file with an unreadable payload."""
  manifest = _load_manifest(root)
  cue = _cue(manifest, cue_id)
  data = (root / cue["file"]).read_bytes()
  cue["bytes"] = len(data)
  cue["sha256"] = hashlib.sha256(data).hexdigest()
  _save_manifest(root, manifest)


def _sync_readable_wav(root: Path, cue_id: str) -> None:
  """Update the manifest from a readable but possibly wrongly formatted WAV."""
  manifest = _load_manifest(root)
  cue = _cue(manifest, cue_id)
  path = root / cue["file"]
  data = path.read_bytes()
  cue["bytes"] = len(data)
  cue["sha256"] = hashlib.sha256(data).hexdigest()
  with wave.open(str(path), "rb") as wav:
    nchannels = wav.getnchannels()
    sampwidth = wav.getsampwidth()
    framerate = wav.getframerate()
    nframes = wav.getnframes()
    frames = wav.readframes(nframes)
  cue["frames"] = nframes
  cue["durationSeconds"] = nframes / framerate
  # The format contract (48 kHz / mono / PCM16) stays in the manifest so the
  # verifier can catch a file that no longer matches it.
  if nchannels == 1 and sampwidth == 2:
    samples = struct.unpack("<" + "h" * nframes, frames)
    cue["firstSample"] = samples[0]
    cue["lastSample"] = samples[-1]
    cue["peakSample"] = max(abs(sample) for sample in samples)
    peak = cue["peakSample"]
    cue["peakDbfs"] = round(20 * math.log10(peak / 32768), 4) if peak else 0.0
  _save_manifest(root, manifest)


def _write_wav(path: Path, rate: int, channels: int, nframes: int) -> None:
  with wave.open(str(path), "wb") as wav:
    wav.setnchannels(channels)
    wav.setsampwidth(2)
    wav.setframerate(rate)
    wav.writeframes(b"\x00\x00" * nframes * channels)


def _join(errors: list[str]) -> str:
  return "\n".join(errors)


class CurrentPackTests(unittest.TestCase):
  def test_current_pack_passes(self):
    self.assertEqual(verifier.verify(HERE), [])

  def test_main_reports_ok_and_returns_zero(self):
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
      code = verifier.main(["--root", str(HERE)])
    self.assertEqual(code, 0)
    self.assertIn("OK:", output.getvalue())

  def test_eight_fixed_tags_appear_once_in_order(self):
    manifest = _load_manifest(HERE)
    self.assertEqual(manifest["tags"], list(verifier.REQUIRED_TAGS))
    ids = [cue["id"] for cue in manifest["cues"]]
    self.assertEqual(ids, list(verifier.REQUIRED_TAGS))
    self.assertEqual(len(set(ids)), 8)

  def test_each_cue_records_required_provenance(self):
    manifest = _load_manifest(HERE)
    for cue in manifest["cues"]:
      with self.subTest(cue=cue["id"]):
        self.assertRegex(cue["sha256"], r"^[0-9a-f]{64}$")
        self.assertEqual(cue["sampleRate"], 48000)
        self.assertEqual(cue["pcmBitDepth"], 16)
        self.assertEqual(cue["license"], "CC0-1.0")
        self.assertEqual(cue["sourceCommit"], verifier.EXPECTED_COMMITS[cue["source"]])
        self.assertTrue(cue["sourceRelativePath"].endswith(cue["id"] + ".wav"))
        self.assertTrue((HERE / cue["file"]).is_file())


class FailureModeTests(unittest.TestCase):
  def test_missing_wav_fails_clearly(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      (root / "audio/moba-like/purchase-ok.wav").unlink()
      text = _join(verifier.verify(root))
      self.assertIn("missing WAV file", text)
      self.assertIn("purchase-ok", text)

  def test_unreadable_wav_payload_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      (root / "audio/fps-like/menu-confirm.wav").write_bytes(b"not a wav file")
      _sync_raw_only(root, "menu-confirm")
      text = _join(verifier.verify(root))
      self.assertIn("not a readable PCM WAV", text)
      self.assertIn("menu-confirm", text)

  def test_wrong_sample_rate_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      path = root / "audio/moba-like/level-up.wav"
      _write_wav(path, rate=44100, channels=1, nframes=4410)
      _sync_readable_wav(root, "level-up")
      text = _join(verifier.verify(root))
      self.assertIn("sample rate 44100", text)

  def test_wrong_channel_count_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      path = root / "audio/fps-like/round-win.wav"
      _write_wav(path, rate=48000, channels=2, nframes=4800)
      _sync_readable_wav(root, "round-win")
      text = _join(verifier.verify(root))
      self.assertIn("2 channels", text)

  def test_manifest_hash_tamper_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      manifest = _load_manifest(root)
      cue = _cue(manifest, "respawn-ready")
      cue["sha256"] = ("0" if cue["sha256"][0] != "0" else "1") + cue["sha256"][1:]
      _save_manifest(root, manifest)
      text = _join(verifier.verify(root))
      self.assertIn("SHA-256", text)
      self.assertIn("respawn-ready", text)

  def test_extra_wav_file_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      shutil.copyfile(
        root / "audio/fps-like/round-loss.wav",
        root / "audio/fps-like/extra-copy.wav",
      )
      text = _join(verifier.verify(root))
      self.assertIn("unexpected WAV files", text)
      self.assertIn("extra-copy.wav", text)

  def test_html_autoplay_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      path = root / "audition.html"
      html = path.read_text(encoding="utf-8").replace(
        "<audio controls", "<audio autoplay controls", 1
      )
      path.write_text(html, encoding="utf-8", newline="\n")
      text = _join(verifier.verify(root))
      self.assertIn("autoplay", text)

  def test_html_remote_script_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      path = root / "audition.html"
      html = path.read_text(encoding="utf-8").replace(
        "</body>", '<script src="https://example.com/x.js"></script></body>'
      )
      path.write_text(html, encoding="utf-8", newline="\n")
      text = _join(verifier.verify(root))
      self.assertTrue("script tag" in text or "remote URL" in text)

  def test_html_missing_audio_source_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      path = root / "audition.html"
      html = path.read_text(encoding="utf-8").replace(
        'src="audio/moba-like/purchase-ok.wav"',
        'src="audio/moba-like/missing.wav"',
      )
      path.write_text(html, encoding="utf-8", newline="\n")
      text = _join(verifier.verify(root))
      self.assertIn("missing file", text)

  def test_html_unfolded_character_description_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      path = root / "audition.html"
      html = path.read_text(encoding="utf-8").replace("<details>", "<details open>", 1)
      path.write_text(html, encoding="utf-8", newline="\n")
      text = _join(verifier.verify(root))
      self.assertIn("collapsed by default", text)

  def test_html_character_description_outside_details_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      path = root / "audition.html"
      html = path.read_text(encoding="utf-8")
      html = re.sub(
        r"<details>\s*<summary>[^<]*听后对照[^<]*</summary>\s*",
        "",
        html,
        count=1,
      )
      html = html.replace("</details>", "", 1)
      path.write_text(html, encoding="utf-8", newline="\n")
      text = _join(verifier.verify(root))
      self.assertIn("must stay inside", text)

  def test_html_questions_after_cue_cards_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      path = root / "audition.html"
      html = path.read_text(encoding="utf-8")
      match = re.search(
        r'  <section id="questions">.*?\n  </section>\n', html, re.DOTALL
      )
      self.assertIsNotNone(match)
      block = match.group(0)
      html = html.replace(block, "", 1).replace("</main>", block + "</main>", 1)
      path.write_text(html, encoding="utf-8", newline="\n")
      text = _join(verifier.verify(root))
      self.assertIn("before the cue cards", text)

  def test_missing_license_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      (root / "LICENSE.txt").unlink()
      text = _join(verifier.verify(root))
      self.assertIn("missing LICENSE.txt", text)

  def test_missing_readme_fails(self):
    with tempfile.TemporaryDirectory() as tmp:
      root = _copy_pack(tmp)
      (root / "README.md").unlink()
      text = _join(verifier.verify(root))
      self.assertIn("missing README.md", text)


if __name__ == "__main__":
  unittest.main(verbosity=2)
