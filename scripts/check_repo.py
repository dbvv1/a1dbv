#!/usr/bin/env python3
"""Check local Markdown link targets and JSON/TOML syntax without network access.

This is a deliberately small repository check, not a complete Markdown parser,
source-fact verifier, security scanner, or external-link availability test.
"""
import argparse
import json
from pathlib import Path
import re
import sys
import tomllib
from urllib.parse import unquote, urlsplit


# Coordination records stay short: they grew into process logs that crowded out reader content.
TASKS_FILE = Path("docs/collaboration/TASKS.md")
TASKS_MAX_BYTES = 10 * 1024
JOB_DIR = Path("docs/collaboration/local-jobs")
JOB_MAX_LINES = 80
JOB_FINAL = {"accepted", "cancelled"}


def reject_json_constant(value):
  raise ValueError(f"invalid JSON numeric constant: {value}")


def record_limits(root, relative, text):
  if relative == TASKS_FILE and len(text.encode("utf-8")) > TASKS_MAX_BYTES:
    return [f"{relative}: over {TASKS_MAX_BYTES // 1024} KB; move finished rows to archive/"]
  if relative.parent == JOB_DIR and relative.name != "README.md":
    status = re.search(r"^status\s*[:：]\s*(\S+)", text, re.M)
    lines = len(text.splitlines())
    if lines > JOB_MAX_LINES and not (status and status.group(1) in JOB_FINAL):
      return [f"{relative}: active job file has {lines} lines (max {JOB_MAX_LINES}); keep current state and next step, move process detail to commit messages"]
  return []


def check(root):
  errors = []
  count = 0
  for path in sorted(root.rglob("*")):
    relative = path.relative_to(root)
    if any(part in {".git", "__pycache__", ".cache", ".venv"} for part in relative.parts):
      continue
    if not path.is_file() or path.is_symlink():
      continue
    kind = path.suffix
    if path.name.endswith((".json.example", ".toml.example")):
      kind = Path(path.stem).suffix
    if kind not in {".md", ".json", ".toml"}:
      continue
    count += 1
    try:
      text = path.read_text(encoding="utf-8")
      if kind == ".json":
        json.loads(text, parse_constant=reject_json_constant)
      elif kind == ".toml":
        tomllib.loads(text)
    except (UnicodeError, ValueError) as exc:
      errors.append(f"{relative}: {exc}")
      continue
    if kind != ".md":
      continue
    errors.extend(record_limits(root, relative, text))
    fence = None
    for line_number, line in enumerate(text.splitlines(), 1):
      start = re.match(r"^\s*(`{3,}|~{3,})", line)
      if start:
        marker = start.group(1)
        if fence is None:
          fence = marker
        elif marker[0] == fence[0] and len(marker) >= len(fence):
          fence = None
        continue
      if fence:
        continue
      # Inline links only. Reference definitions, HTML and fragment existence
      # require separate review; do not advertise them as validated here.
      for match in re.finditer(r"\[[^\]\n]*\]\(([^\s)]+)(?:\s+\"[^\"]*\")?\)", line):
        target = match.group(1).strip("<>")
        parsed = urlsplit(target)
        if parsed.scheme or parsed.netloc or not parsed.path:
          continue
        target_path = (path.parent / unquote(parsed.path)).resolve()
        if not target_path.is_relative_to(root.resolve()):
          errors.append(f"{relative}:{line_number}: link escapes repository: {target}")
        elif not target_path.exists():
          errors.append(f"{relative}:{line_number}: missing link target: {target}")
  return {"checked_files": count, "errors": errors,
          "limits": ["inline local link targets only; fragments not checked",
                     "JSON/TOML syntax only; no runtime schema validation",
                     "no external links or factual claims verified"]}


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
  args = parser.parse_args()
  if not args.root.is_dir():
    parser.error("--root must be an existing directory")
  result = check(args.root)
  print(json.dumps(result, ensure_ascii=False, indent=2))
  return bool(result["errors"])


if __name__ == "__main__":
  sys.exit(main())
