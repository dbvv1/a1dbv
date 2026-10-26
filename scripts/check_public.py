#!/usr/bin/env python3
"""Scan files and commit identities for content that must not enter this public repository.

High-precision patterns only: credentials, private keys, personal home and cloud
instance paths, and non-placeholder email addresses. A pass does not replace
reading the diff; it cannot recognise company code, private conversations or internal hostnames.
"""
import argparse
import json
from pathlib import Path
import re
import subprocess
import sys

PATTERNS = [
  ("credential", re.compile(
    r"sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}"
    r"|glpat-[A-Za-z0-9_-]{20,}|xox[abprs]-[A-Za-z0-9-]{10,}|(?:AKIA|ASIA)[A-Z0-9]{16}"
    r"|AIza[A-Za-z0-9_-]{35}|eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}")),
  ("private-key", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
  ("local-path", re.compile(r"/(?:Users|home)/[A-Za-z0-9._-]+/|[A-Za-z]:\\{1,2}Users\\{1,2}[A-Za-z0-9._-]+")),
  # Concrete 12-hex instance segments, not generic workspace examples or relative paths.
  ("local-path", re.compile(r"(?<![\w./-])/workspace/scratch/[0-9a-fA-F]{12}(?![\w.-])")),
  ("email", re.compile(r"\b[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")),
]
# Placeholders and machine identities that are safe to publish.
SAFE_EMAIL = re.compile(
  r"@(?:[A-Za-z0-9-]+\.)*(?:example\.(?:com|org|net)|invalid|example|test|localhost)$"
  r"|@users\.noreply\.github\.com$|^noreply@", re.I)
# Commit identities are stricter than publishable examples in file contents.
GITHUB_NOREPLY = re.compile(
  r"(?:[0-9]+\+)?[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*(?:\[bot\])?@users\.noreply\.github\.com"
  r"|noreply@github\.com", re.I | re.ASCII)
# Machine identities of agent platforms that commit here; exact match only.
AGENT_NOREPLY = {"noreply@anthropic.com"}
# Generic install locations, sandboxes and documentation placeholders, not a person's machine.
SAFE_HOME_NAMES = {"shared", "user", "username", "runner", "foo", "bar", "example", "you", "me", "name"}
ALLOW_FILE = "scripts/public-scan-allow.txt"
SKIP_PARTS = {".git", "__pycache__", ".cache", ".venv", "node_modules"}


def load_allow(root):
  allow = set()
  path = root / ALLOW_FILE
  if path.is_file():
    for line in path.read_text(encoding="utf-8").splitlines():
      if line.strip() and not line.startswith("#"):
        file, _, literal = line.partition("\t")
        allow.add((file.strip(), literal.strip()))
  return allow


def tracked_files(root):
  result = subprocess.run(["git", "-C", str(root), "ls-files", "-z"], capture_output=True)
  if result.returncode == 0:
    return [root / name for name in result.stdout.decode("utf-8").split("\0") if name]
  return [p for p in sorted(root.rglob("*"))
          if not SKIP_PARTS.intersection(p.relative_to(root).parts)]


def safe(kind, text):
  if kind == "email":
    return bool(SAFE_EMAIL.search(text))
  if kind == "local-path":
    return re.split(r"[/\\]+", text.rstrip("/\\"))[-1].lower() in SAFE_HOME_NAMES
  return False


def scan_files(root):
  allow = load_allow(root)
  findings = []
  count = 0
  for path in tracked_files(root):
    if not path.is_file() or path.is_symlink():
      continue
    relative = path.relative_to(root).as_posix()
    if relative == ALLOW_FILE:
      continue
    try:
      text = path.read_text(encoding="utf-8")
    except (UnicodeError, OSError):
      continue
    count += 1
    for number, line in enumerate(text.splitlines(), 1):
      for kind, pattern in PATTERNS:
        for match in pattern.finditer(line):
          value = match.group(0)
          if safe(kind, value) or (relative, value) in allow:
            continue
          findings.append({"kind": kind, "file": relative, "line": number,
                           "match": value[:12] + "…" if kind == "credential" else value})
  return count, findings


def scan_commits(root, revisions):
  result = subprocess.run(["git", "-C", str(root), "log", "--format=%h%x09%ae%x09%ce", revisions],
                          capture_output=True, text=True)
  if result.returncode != 0:
    raise ValueError(result.stderr.strip() or f"cannot read commits: {revisions}")
  findings = []
  for line in result.stdout.splitlines():
    sha, author, committer = line.split("\t")
    for role, email in (("author", author), ("committer", committer)):
      if not GITHUB_NOREPLY.fullmatch(email) and email not in AGENT_NOREPLY:
        findings.append({"kind": "commit-email", "commit": sha, "role": role,
                         "match": (email.split("@")[0][:2] + "…@" + email.split("@")[-1]
                                   if "@" in email else "[non-email]")})
  return findings


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
  parser.add_argument("--commits", metavar="RANGE",
                      help="also require noreply identities in this range, e.g. origin/main..HEAD")
  args = parser.parse_args()
  if not args.root.is_dir():
    parser.error("--root must be an existing directory")
  if args.commits == "":
    parser.error("--commits must not be empty")
  root = args.root.resolve()
  count, findings = scan_files(root)
  if args.commits is not None:
    try:
      findings += scan_commits(root, args.commits)
    except ValueError as exc:
      parser.error(str(exc))
  print(json.dumps({"checked_files": count, "findings": findings,
                    "limits": ["pattern scan only; read the diff before publishing",
                               "does not detect company code, private text or internal hosts"]},
                   ensure_ascii=False, indent=2))
  return bool(findings)


if __name__ == "__main__":
  sys.exit(main())
