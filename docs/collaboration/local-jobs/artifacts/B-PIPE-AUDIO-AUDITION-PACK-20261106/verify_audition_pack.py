#!/usr/bin/env python3
"""Verify the two-case audition pack without opening any device or browser.

The pack is a listening-only copy of eight cue WAVs from two fixed source
commits. This script checks the things a reader can check offline:

- ``manifest.json`` declares the eight fixed tags exactly once, in order.
- Every WAV exists, and its byte length and full SHA-256 match the manifest.
- Every WAV is RIFF/WAVE, 48 kHz, mono, PCM16, with the declared frame count.
- First and last PCM samples are 0, matching the source edge-envelope contract.
- Sample peak and peak dBFS match the manifest.
- No extra WAV files are present in ``audio/``.
- ``audition.html`` contains exactly one audio control per cue, each pointing
  at an existing local relative WAV, with no autoplay, script, remote URL or
  other external dependency.
- Source descriptions stay inside default-collapsed ``听后对照`` details, and
  the judgement questions appear before the cue cards, so a listener can
  answer blind before reading the labels.
- ``README.md`` and ``LICENSE.txt`` exist and keep the required provenance.

Only the Python standard library is used. The script does not open a sound
card, audio device, GUI, browser or network connection.

Usage:
  python3 verify_audition_pack.py [--root DIR] [--json]
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import struct
import sys
import wave
from pathlib import Path

PACK_ID = "B-PIPE-AUDIO-AUDITION-PACK-20261106"
REQUIRED_TAGS = (
  "purchase-ok",
  "purchase-denied",
  "level-up",
  "respawn-ready",
  "weapon-switch",
  "menu-confirm",
  "round-win",
  "round-loss",
)
EXPECTED_COMMITS = {
  "MOBA-Like": "0b3d85d47b184ac48450e0a9d039fd3e0143c273",
  "FPS-Like": "ecb53c7464e4ccb8daba4353b94fc5bc9b8ef94a",
}
EXPECTED_CUES = {
  "purchase-ok": (
    "MOBA-Like",
    "asset-pipeline/ui-event-audio/purchase-ok.wav",
    "audio/moba-like/purchase-ok.wav",
  ),
  "purchase-denied": (
    "MOBA-Like",
    "asset-pipeline/ui-event-audio/purchase-denied.wav",
    "audio/moba-like/purchase-denied.wav",
  ),
  "level-up": (
    "MOBA-Like",
    "asset-pipeline/ui-event-audio/level-up.wav",
    "audio/moba-like/level-up.wav",
  ),
  "respawn-ready": (
    "MOBA-Like",
    "asset-pipeline/ui-event-audio/respawn-ready.wav",
    "audio/moba-like/respawn-ready.wav",
  ),
  "weapon-switch": (
    "FPS-Like",
    "asset-pipeline/match-cues/weapon-switch.wav",
    "audio/fps-like/weapon-switch.wav",
  ),
  "menu-confirm": (
    "FPS-Like",
    "asset-pipeline/match-cues/menu-confirm.wav",
    "audio/fps-like/menu-confirm.wav",
  ),
  "round-win": (
    "FPS-Like",
    "asset-pipeline/match-cues/round-win.wav",
    "audio/fps-like/round-win.wav",
  ),
  "round-loss": (
    "FPS-Like",
    "asset-pipeline/match-cues/round-loss.wav",
    "audio/fps-like/round-loss.wav",
  ),
}
REQUIRED_CUE_FIELDS = (
  "id",
  "label",
  "source",
  "sourceRepo",
  "sourceCommit",
  "sourceRelativePath",
  "file",
  "bytes",
  "sha256",
  "frames",
  "durationSeconds",
  "sampleRate",
  "channels",
  "pcmBitDepth",
  "firstSample",
  "lastSample",
  "peakSample",
  "peakDbfs",
  "license",
)
HEX64 = re.compile(r"^[0-9a-f]{64}$")
EXPECTED_FORMAT = {"sampleRate": 48000, "channels": 1, "pcmBitDepth": 16}
SRC_RE = re.compile(r'src\s*=\s*"([^"]*)"')
AUDIO_TAG_RE = re.compile(r"<audio\b", re.IGNORECASE)
FORBIDDEN_HTML = (
  ("autoplay", re.compile(r"autoplay", re.IGNORECASE)),
  ("script tag", re.compile(r"<\s*/?\s*script\b", re.IGNORECASE)),
  ("link tag", re.compile(r"<\s*link\b", re.IGNORECASE)),
  ("iframe/embed/object", re.compile(r"<\s*(?:iframe|embed|object)\b", re.IGNORECASE)),
  ("remote URL", re.compile(r"https?://", re.IGNORECASE)),
  ("CSS @import", re.compile(r"@import", re.IGNORECASE)),
  ("CSS url()", re.compile(r"url\s*\(", re.IGNORECASE)),
  ("preload auto", re.compile(r'preload\s*=\s*["\']auto["\']', re.IGNORECASE)),
)


def _is_number(value):
  return isinstance(value, (int, float)) and not isinstance(value, bool)


def verify(root: Path) -> list[str]:
  """Return a list of human-readable verification errors (empty on success)."""
  root = Path(root)
  errors: list[str] = []

  manifest_path = root / "manifest.json"
  if not manifest_path.is_file():
    return [f"missing manifest: {manifest_path}"]
  try:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
  except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
    return [f"cannot read manifest.json: {exc}"]
  if not isinstance(manifest, dict):
    return ["manifest.json must be a JSON object"]

  if manifest.get("packId") != PACK_ID:
    errors.append(f"manifest packId is {manifest.get('packId')!r}, expected {PACK_ID!r}")

  tags = manifest.get("tags")
  if tags != list(REQUIRED_TAGS):
    errors.append(f"manifest tags must be the eight fixed tags in order, got {tags!r}")

  batches = manifest.get("sourceBatches")
  if not isinstance(batches, list) or len(batches) != 2:
    errors.append("manifest sourceBatches must list the two fixed source batches")
    batches = []
  batch_by_source = {}
  for batch in batches:
    if not isinstance(batch, dict):
      errors.append("each sourceBatches entry must be an object")
      continue
    source = batch.get("source")
    batch_by_source[source] = batch
    expected_commit = EXPECTED_COMMITS.get(source)
    if expected_commit is None:
      errors.append(f"unexpected source batch {source!r}")
    elif batch.get("commit") != expected_commit:
      errors.append(
        f"{source}: commit {batch.get('commit')!r} does not match fixed commit {expected_commit}"
      )
    if batch.get("license") != "CC0-1.0":
      errors.append(f"{source}: license must be CC0-1.0, got {batch.get('license')!r}")

  licenses = manifest.get("licenses")
  if not isinstance(licenses, dict):
    errors.append("manifest licenses must be an object")
  else:
    for source in EXPECTED_COMMITS:
      entry = licenses.get(source)
      if not isinstance(entry, dict) or entry.get("id") != "CC0-1.0":
        errors.append(f"manifest licenses.{source} must declare CC0-1.0")

  cues = manifest.get("cues")
  if not isinstance(cues, list) or len(cues) != len(REQUIRED_TAGS):
    errors.append(f"manifest must declare exactly {len(REQUIRED_TAGS)} cues")
    cues = []
  cue_by_id = {}
  for index, cue in enumerate(cues):
    if not isinstance(cue, dict):
      errors.append(f"cue #{index} must be an object")
      continue
    missing = [field for field in REQUIRED_CUE_FIELDS if field not in cue]
    if missing:
      errors.append(f"cue #{index} missing fields: {', '.join(missing)}")
      continue
    cid = cue["id"]
    if cid in cue_by_id:
      errors.append(f"duplicate cue id {cid!r}")
      continue
    cue_by_id[cid] = cue

  declared_order = [cue.get("id") for cue in cues if isinstance(cue, dict)]
  if declared_order != list(REQUIRED_TAGS):
    errors.append(f"cue order must be the eight fixed tags, got {declared_order!r}")

  expected_wavs = {cue["file"] for cue in cue_by_id.values()}
  audio_dir = root / "audio"
  actual_wavs = set()
  if audio_dir.is_dir():
    actual_wavs = {
      str(path.relative_to(root)).replace("\\", "/")
      for path in audio_dir.rglob("*.wav")
    }
  extra = sorted(actual_wavs - expected_wavs)
  if extra:
    errors.append(f"unexpected WAV files in audio/: {', '.join(extra)}")

  for cid in REQUIRED_TAGS:
    cue = cue_by_id.get(cid)
    if cue is None:
      errors.append(f"missing cue {cid!r}")
      continue
    expected_source, expected_source_rel, expected_local_rel = EXPECTED_CUES[cid]
    if cue["label"] != cid:
      errors.append(f"{cid}: label {cue['label']!r} must equal the id")
    if cue["source"] != expected_source:
      errors.append(f"{cid}: source {cue['source']!r}, expected {expected_source!r}")
    if cue["sourceRelativePath"] != expected_source_rel:
      errors.append(
        f"{cid}: sourceRelativePath {cue['sourceRelativePath']!r}, expected {expected_source_rel!r}"
      )
    if cue["file"] != expected_local_rel:
      errors.append(f"{cid}: local file {cue['file']!r}, expected {expected_local_rel!r}")
    batch = batch_by_source.get(cue["source"], {})
    if cue["sourceCommit"] != batch.get("commit"):
      errors.append(f"{cid}: sourceCommit does not match its source batch")
    if cue["license"] != "CC0-1.0":
      errors.append(f"{cid}: license must be CC0-1.0, got {cue['license']!r}")

    if not HEX64.match(str(cue["sha256"])):
      errors.append(f"{cid}: sha256 must be 64 lowercase hex characters")
    for field, expected in EXPECTED_FORMAT.items():
      if cue[field] != expected:
        errors.append(
          f"{cid}: manifest {field} is {cue[field]!r}, expected {expected}"
        )

    path = root / cue["file"]
    if not path.is_file():
      errors.append(f"{cid}: missing WAV file {cue['file']}")
      continue
    data = path.read_bytes()
    if len(data) != cue["bytes"]:
      errors.append(f"{cid}: byte length {len(data)} != manifest {cue['bytes']}")
    actual_sha = hashlib.sha256(data).hexdigest()
    if actual_sha != cue["sha256"]:
      errors.append(
        f"{cid}: SHA-256 {actual_sha} != manifest {cue['sha256']}"
      )

    try:
      with wave.open(str(path), "rb") as wav:
        nchannels = wav.getnchannels()
        sampwidth = wav.getsampwidth()
        framerate = wav.getframerate()
        nframes = wav.getnframes()
        comptype = wav.getcomptype()
        frames = wav.readframes(nframes)
    except (wave.Error, EOFError, OSError) as exc:
      errors.append(f"{cid}: not a readable PCM WAV ({exc})")
      continue

    fmt_problems = []
    if comptype != "NONE":
      fmt_problems.append(f"compression {comptype!r}, expected PCM")
    if nchannels != EXPECTED_FORMAT["channels"]:
      fmt_problems.append(
        f"{nchannels} channels, expected {EXPECTED_FORMAT['channels']}"
      )
    if sampwidth * 8 != EXPECTED_FORMAT["pcmBitDepth"]:
      fmt_problems.append(
        f"{sampwidth * 8}-bit samples, expected {EXPECTED_FORMAT['pcmBitDepth']}-bit"
      )
    if framerate != EXPECTED_FORMAT["sampleRate"]:
      fmt_problems.append(
        f"sample rate {framerate} Hz, expected {EXPECTED_FORMAT['sampleRate']} Hz"
      )
    if fmt_problems:
      errors.append(f"{cid}: wrong WAV format: {'; '.join(fmt_problems)}")
      continue

    if nframes != cue["frames"]:
      errors.append(f"{cid}: {nframes} frames != manifest {cue['frames']}")
      continue
    duration = nframes / framerate
    if not _is_number(cue["durationSeconds"]) or abs(duration - cue["durationSeconds"]) > 1e-9:
      errors.append(
        f"{cid}: duration {duration:.9f} s != manifest {cue['durationSeconds']!r}"
      )
      continue
    if len(frames) != nframes * nchannels * sampwidth:
      errors.append(f"{cid}: truncated PCM payload")
      continue

    samples = struct.unpack("<" + "h" * nframes, frames)
    first = samples[0]
    last = samples[-1]
    peak = max(abs(sample) for sample in samples)
    if first != cue["firstSample"]:
      errors.append(f"{cid}: first sample {first} != manifest {cue['firstSample']}")
    if last != cue["lastSample"]:
      errors.append(f"{cid}: last sample {last} != manifest {cue['lastSample']}")
    if peak != cue["peakSample"]:
      errors.append(f"{cid}: peak sample {peak} != manifest {cue['peakSample']}")
    if peak <= 0:
      errors.append(f"{cid}: silent file")
    else:
      peak_dbfs = round(20 * math.log10(peak / 32768), 4)
      if not _is_number(cue["peakDbfs"]) or abs(peak_dbfs - cue["peakDbfs"]) > 1e-9:
        errors.append(f"{cid}: peak {peak_dbfs} dBFS != manifest {cue['peakDbfs']!r}")

  errors.extend(_verify_html(root, expected_wavs))
  errors.extend(_verify_text_files(root))
  return errors


def _verify_html(root: Path, expected_wavs: set[str]) -> list[str]:
  errors: list[str] = []
  path = root / "audition.html"
  if not path.is_file():
    return ["missing audition.html"]
  try:
    html = path.read_text(encoding="utf-8")
  except (OSError, UnicodeDecodeError) as exc:
    return [f"cannot read audition.html as UTF-8: {exc}"]

  for label, pattern in FORBIDDEN_HTML:
    if pattern.search(html):
      errors.append(f"audition.html contains forbidden {label}")

  audio_tags = AUDIO_TAG_RE.findall(html)
  if len(audio_tags) != len(REQUIRED_TAGS):
    errors.append(
      f"audition.html has {len(audio_tags)} audio controls, expected {len(REQUIRED_TAGS)}"
    )
  for opening in re.findall(r"<audio\b[^>]*>", html, re.IGNORECASE):
    if not re.search(r"\bcontrols\b", opening, re.IGNORECASE):
      errors.append(f"audition.html audio control without controls attribute: {opening}")

  sources = SRC_RE.findall(html)
  if len(sources) != len(REQUIRED_TAGS):
    errors.append(
      f"audition.html has {len(sources)} src attributes, expected {len(REQUIRED_TAGS)}"
    )
  if set(sources) != expected_wavs:
    errors.append(
      "audition.html src values must be exactly the eight local WAV paths; "
      f"got {sorted(set(sources))!r}"
    )
  for src in sources:
    if ":" in src or src.startswith("/") or ".." in Path(src).parts:
      errors.append(f"audition.html src is not a local relative path: {src!r}")
      continue
    if not (root / src).is_file():
      errors.append(f"audition.html references missing file: {src}")

  for tag in REQUIRED_TAGS:
    if tag not in html:
      errors.append(f"audition.html does not mention tag {tag!r}")

  details_open = re.findall(r"<details\b([^>]*)>", html, re.IGNORECASE)
  details_blocks = re.findall(
    r"<details\b[^>]*>(.*?)</details>", html, re.IGNORECASE | re.DOTALL
  )
  if len(details_open) != len(REQUIRED_TAGS) or len(details_blocks) != len(REQUIRED_TAGS):
    errors.append(
      f"audition.html needs one collapsed 听后对照 details per cue, "
      f"got {len(details_open)}"
    )
  for attrs in details_open:
    if re.search(r"\bopen\b", attrs, re.IGNORECASE):
      errors.append("audition.html 听后对照 details must be collapsed by default")
  if len(details_blocks) == len(details_open):
    all_character = len(
      re.findall(r'class\s*=\s*"character"', html, re.IGNORECASE)
    )
    inside_character = sum(
      len(re.findall(r'class\s*=\s*"character"', block, re.IGNORECASE))
      for block in details_blocks
    )
    if all_character != len(REQUIRED_TAGS) or inside_character != all_character:
      errors.append(
        "audition.html source descriptions must stay inside the collapsed "
        "听后对照 details"
      )
    for block in details_blocks:
      if not re.search(r"<summary>[^<]*听后对照", block):
        errors.append("audition.html 听后对照 details must use the labelled summary")
        break

  questions_at = html.find('id="questions"')
  first_cue_at = html.find('<article class="cue"')
  if questions_at < 0 or first_cue_at < 0 or questions_at > first_cue_at:
    errors.append("audition.html 判断项 must appear before the cue cards")
  return errors


def _verify_text_files(root: Path) -> list[str]:
  errors: list[str] = []
  readme = root / "README.md"
  if not readme.is_file():
    errors.append("missing README.md")
  else:
    text = readme.read_text(encoding="utf-8", errors="replace")
    for needle in ("audition.html", "verify_audition_pack.py", "manifest.json"):
      if needle not in text:
        errors.append(f"README.md does not mention {needle}")

  license_path = root / "LICENSE.txt"
  if not license_path.is_file():
    errors.append("missing LICENSE.txt")
  else:
    text = license_path.read_text(encoding="utf-8", errors="replace")
    if "CC0-1.0" not in text:
      errors.append("LICENSE.txt does not state CC0-1.0")
    for source, commit in EXPECTED_COMMITS.items():
      if source not in text:
        errors.append(f"LICENSE.txt does not attribute {source}")
      if commit not in text:
        errors.append(f"LICENSE.txt does not record {source} commit {commit}")
  return errors


def main(argv=None) -> int:
  parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
  parser.add_argument(
    "--root",
    type=Path,
    default=Path(__file__).resolve().parent,
    help="pack directory (default: the directory containing this script)",
  )
  parser.add_argument("--json", action="store_true", help="print a JSON report")
  args = parser.parse_args(argv)

  try:
    errors = verify(args.root)
  except Exception as exc:  # noqa: BLE001 - a verifier must fail closed
    errors = [f"verification raised {type(exc).__name__}: {exc}"]

  if args.json:
    print(json.dumps({"ok": not errors, "errors": errors}, ensure_ascii=False, indent=2))
  elif errors:
    print(f"FAIL: {len(errors)} problem(s) in {args.root}")
    for error in errors:
      print(f" - {error}")
  else:
    print(f"OK: {PACK_ID} verified at {args.root}")
    print(
      f"    {len(REQUIRED_TAGS)} WAVs: 48 kHz mono PCM16, "
      "hashes/bytes/frames/first-last samples/peaks match manifest"
    )
    print(
      f"    {len(REQUIRED_TAGS)} local audio controls in audition.html; "
      "no autoplay, script, remote URL or external dependency"
    )
  return 0 if not errors else 1


if __name__ == "__main__":
  sys.exit(main())
