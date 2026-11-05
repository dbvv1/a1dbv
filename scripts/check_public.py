#!/usr/bin/env python3
"""Scan files and commit identities for content that must not enter this public repository.

Default: scan tracked working-tree files and symlink text, never targets.
Explicit --staged/--tree scan fixed local Git blobs and the same-view allowlist.
Those modes decode UTF-8 or BOM-marked UTF-16/32 strictly, rejecting NUL.
They return 2 for skipped entries; they are not complete binary scanners.
--commits adds identity checks only, not history content scanning.
High-precision patterns only: credentials, private keys, personal home and cloud
instance paths, and non-placeholder email addresses. A pass does not replace
reading the diff; it cannot recognise company code, private conversations or internal hostnames.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys

PATTERNS = [
  ("credential", re.compile(
    # Recognizable provider shapes survive concatenation; the broad sk- fallback
    # keeps its word edge to avoid task-/desk- false positives. Shape, not validity.
    # Formats: gitleaks/gitleaks@5f6ec56c, cmd/generate/config/rules/{openai,anthropic}.go.
    r"sk-(?:proj|svcacct|admin)-(?:[A-Za-z0-9_-]{74}|[A-Za-z0-9_-]{58})"
    r"T3BlbkFJ(?:[A-Za-z0-9_-]{74}|[A-Za-z0-9_-]{58})"
    r"|sk-[A-Za-z0-9]{20}T3BlbkFJ[A-Za-z0-9]{20}"
    r"|sk-ant-(?:api03|admin01)-[A-Za-z0-9_-]{93}AA|"
    r"(?<![A-Za-z0-9])sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}"
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


def symlink_parent(root, path):
  """Find a linked parent without traversing it."""
  parent = root
  for part in path.relative_to(root).parts[:-1]:
    parent = parent / part
    if parent.is_symlink():
      return parent
  return None


def allow_is_tracked_symlink(root):
  # core.symlinks=false checks out link text as a regular file, not configuration.
  result = subprocess.run(["git", "-C", str(root), "ls-files", "--stage", "-z", "--", ALLOW_FILE],
                          capture_output=True)
  return result.returncode == 0 and any(
    entry.startswith(b"120000 ") for entry in result.stdout.split(b"\0"))


def load_allow(root):
  allow = set()
  path = root / ALLOW_FILE
  if (symlink_parent(root, path) is None and not path.is_symlink()
      and path.is_file() and not allow_is_tracked_symlink(root)):
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


def safe_path_label(path):
  # Paths are data too. Preserve useful safe names, never print sensitive matches.
  if any(not safe(kind, match.group(0)) for kind, pattern in PATTERNS
         for match in pattern.finditer(path)):
    return "[redacted path sha256:" + hashlib.sha256(path.encode("utf-8")).hexdigest() + "]"
  return path


def scan_text(relative, text, allow):
  findings = []
  for number, line in enumerate(text.splitlines(), 1):
    for kind, pattern in PATTERNS:
      for match in pattern.finditer(line):
        value = match.group(0)
        if safe(kind, value) or (relative, value) in allow:
          continue
        findings.append({"kind": kind, "file": relative, "line": number,
                         "match": value[:12] + "…" if kind == "credential" else value})
  return findings


def index_git(root, *args, input_data=None):
  # Inspect this repository's normal index and original local objects only.
  env = {key: value for key, value in os.environ.items() if not key.startswith("GIT_")}
  env.update(GIT_CONFIG_NOSYSTEM="1", GIT_CONFIG_GLOBAL=os.devnull,
             GIT_NO_REPLACE_OBJECTS="1", GIT_NO_LAZY_FETCH="1",
             GIT_OPTIONAL_LOCKS="0", GIT_TERMINAL_PROMPT="0")
  try:
    result = subprocess.run(["git", "-C", str(root), *args], env=env,
                            capture_output=True, input=input_data, timeout=30)
  except (OSError, subprocess.TimeoutExpired) as exc:
    raise ValueError("cannot read selected Git index or local object") from exc
  if result.returncode:
    raise ValueError("cannot read selected Git index or local object")
  return result.stdout


BLOB_BATCH_BYTES = 4 * 1024 * 1024


def blob_size(header, oid):
  parts = header.split(b" ")
  if (len(parts) != 3 or parts[0] != oid.encode("ascii")
      or parts[1] != b"blob" or not parts[2].isdigit() or len(parts[2]) > 20):
    raise ValueError("cannot read selected Git index or local object")
  return int(parts[2])


def read_blobs(root, object_ids):
  """Batch fixed IDs within a body-byte budget; oversized single blobs stay whole."""
  for start in range(0, len(object_ids), 128):
    chunk = object_ids[start:start + 128]
    if any(re.fullmatch(r"[0-9a-f]{40}|[0-9a-f]{64}", oid) is None for oid in chunk):
      raise ValueError("invalid Git blob object ID")
    metadata = index_git(root, "cat-file", "--batch-check",
                         input_data=("\n".join(chunk) + "\n").encode("ascii"))
    lines = metadata.split(b"\n")
    if len(lines) != len(chunk) + 1 or lines[-1] != b"":
      raise ValueError("cannot read selected Git index or local object")
    sizes = [blob_size(line, oid) for line, oid in zip(lines[:-1], chunk)]
    batches, batch, total = [], [], 0
    for oid, size in zip(chunk, sizes):
      if batch and total + size > BLOB_BATCH_BYTES:
        batches.append(batch)
        batch, total = [], 0
      batch.append((oid, size))
      total += size
    if batch:
      batches.append(batch)
    for batch in batches:
      response = index_git(root, "cat-file", "--batch",
                           input_data=("\n".join(oid for oid, _ in batch) + "\n").encode("ascii"))
      offset, blobs = 0, []
      for oid, size in batch:
        end = response.find(b"\n", offset)
        if end < offset or blob_size(response[offset:end], oid) != size:
          raise ValueError("cannot read selected Git index or local object")
        offset = end + 1
        stop = offset + size
        if stop >= len(response) or response[stop:stop + 1] != b"\n":
          raise ValueError("cannot read selected Git index or local object")
        blobs.append(response[offset:stop])
        offset = stop + 1
      if offset != len(response):
        raise ValueError("cannot read selected Git index or local object")
      # Validate every frame before exposing a body. The budget bounds combined
      # body bytes, not total process RSS; one large blob is never silently skipped.
      yield from blobs
      del response, blobs


def scan_index(root):
  # Freeze the stage-0 path/object list once. Later worktree edits are irrelevant.
  # The caller must keep the index stable until the reviewed commit is created.
  entries = []
  for record in index_git(root, "ls-files", "--stage", "-z", "--full-name", "--", ":/").split(b"\0"):
    if not record:
      continue
    header, name = record.split(b"\t", 1)
    mode, oid, stage = header.split()
    if stage != b"0":
      raise ValueError("index has unresolved merge entries; resolve before scanning")
    if mode not in (b"100644", b"100755", b"120000", b"160000"):
      raise ValueError("unsupported index entry mode")
    entries.append((name.decode("utf-8"), mode, oid.decode("ascii")))
  return scan_objects(root, entries)


def scan_tree(root, ref):
  tree = index_git(root, "rev-parse", "--verify", "--end-of-options",
                   ref + "^{tree}").decode("ascii").strip()
  entries = []
  for record in index_git(root, "ls-tree", "-r", "-z", "--full-tree", tree).split(b"\0"):
    if not record:
      continue
    header, name = record.split(b"\t", 1)
    mode, kind, oid = header.split()
    if ((mode in (b"100644", b"100755", b"120000") and kind != b"blob")
        or (mode == b"160000" and kind != b"commit")
        or mode not in (b"100644", b"100755", b"120000", b"160000")):
      raise ValueError("unsupported tree entry")
    entries.append((name.decode("utf-8"), mode, oid.decode("ascii")))
  return tree, scan_objects(root, entries)


def decode_object_text(data):
  """Strict text decoding, never guess legacy or BOM-less wide encodings."""
  # UTF-32 LE shares UTF-16 LE's prefix, so check the longer BOM first.
  if data.startswith((b"\xff\xfe\x00\x00", b"\x00\x00\xfe\xff")):
    encoding = "utf-32"
  elif data.startswith((b"\xff\xfe", b"\xfe\xff")):
    encoding = "utf-16"
  else:
    encoding = "utf-8-sig"
  text = data.decode(encoding, errors="strict")
  if "\x00" in text:
    # NUL-interleaved ASCII can decode as UTF-8 while hiding a wide-text key.
    # Binary or ambiguous text is incomplete, not cleared by a missing match.
    raise ValueError("decoded_text_contains_nul")
  return text


def scan_objects(root, entries):
  texts, skipped = {}, []
  blobs = iter(read_blobs(root, [oid for _, mode, oid in entries if mode != b"160000"]))
  for name, mode, oid in entries:
    if mode == b"160000":
      skipped.append({"file": name, "reason": "gitlink_target_not_scanned"})
      continue
    data = next(blobs)
    try:
      texts[name] = (mode, decode_object_text(data))
    except UnicodeError:
      skipped.append({"file": name, "reason": "unsupported_or_malformed_text"})
    except ValueError:
      skipped.append({"file": name, "reason": "decoded_text_contains_nul"})
  allow = set()
  entry = texts.get(ALLOW_FILE)
  if entry and entry[0] in (b"100644", b"100755"):
    for line in entry[1].splitlines():
      if line.strip() and not line.startswith("#"):
        file, _, literal = line.partition("\t")
        allow.add((file.strip(), literal.strip()))
  count, findings = 0, []
  for name, (mode, text) in texts.items():
    if name == ALLOW_FILE and mode != b"120000":
      continue
    count += 1
    findings.extend(scan_text(name, text, allow))
  return count, findings, skipped


def scan_files(root):
  allow = load_allow(root)
  findings = []
  count = 0
  for path in tracked_files(root):
    relative = path.relative_to(root).as_posix()
    parent = symlink_parent(root, path)
    if parent is not None:
      findings.append({"kind": "symlink-parent", "file": relative,
                       "match": parent.relative_to(root).as_posix()})
      continue
    try:
      if path.is_symlink():
        # Git stores the link text, including for dangling links. Keep it verbatim.
        text = os.readlink(path)
      elif path.is_file() and (relative != ALLOW_FILE or allow_is_tracked_symlink(root)):
        text = path.read_text(encoding="utf-8")
      else:
        continue
    except (UnicodeError, OSError):
      continue
    count += 1
    findings.extend(scan_text(relative, text, allow))
  return count, findings


def commit_selection(root, value):
  # Object modes accept one positive commit-ish or an explicit A..B range,
  # not git-log options, path filters, exclusion sets, or arbitrary rev syntax.
  if "..." in value or value.count("..") > 1:
    raise ValueError("use one commit endpoint or an explicit A..B commit range")
  endpoints = value.split("..")
  selected = []
  for endpoint in endpoints:
    if not endpoint or endpoint.startswith(("-", "^")):
      raise ValueError("commit endpoints must be nonempty positive selections")
    oid = index_git(root, "rev-parse", "--verify", "--end-of-options",
                    endpoint + "^{commit}").decode("ascii").strip()
    if re.fullmatch(r"[0-9a-f]{40}|[0-9a-f]{64}", oid) is None:
      raise ValueError("endpoint did not resolve to exactly one commit")
    selected.append(oid)
  return "..".join(selected)


def scan_commits(root, revisions, *, isolated=False, details=None):
  if isolated:
    revisions = commit_selection(root, revisions)
    output = index_git(root, "log", "--format=%h%x09%ae%x09%ce",
                       "--end-of-options", revisions, "--").decode("utf-8")
  else:
    result = subprocess.run(["git", "-C", str(root), "log", "--format=%h%x09%ae%x09%ce", revisions],
                            capture_output=True, text=True)
    if result.returncode != 0:
      raise ValueError(result.stderr.strip() or f"cannot read commits: {revisions}")
    output = result.stdout
  lines = output.splitlines()
  if details is not None:
    details.update(selection=revisions, checked_commits=len(lines),
                   scope="selected commit set only; empty ranges check no identities")
  findings = []
  for line in lines:
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
                      help="also require noreply identities; object modes accept one commit or explicit A..B, including an empty range")
  source = parser.add_mutually_exclusive_group()
  source.add_argument("--staged", action="store_true",
                      help="scan normal Git index blobs and its allowlist, not worktree bytes; conflicts/skipped entries fail")
  source.add_argument("--tree", metavar="REF",
                      help="scan this local commit/tree and its allowlist; report its SHA; skipped entries fail; no fetch/history scan")
  args = parser.parse_args()
  if not args.root.is_dir():
    parser.error("--root must be an existing directory")
  if args.tree == "":
    parser.error("--tree must not be empty")
  if args.commits == "":
    parser.error("--commits must not be empty")
  root = args.root.resolve()
  skipped = []
  tree = None
  if args.tree is not None:
    try:
      tree, (count, findings, skipped) = scan_tree(root, args.tree)
    except UnicodeError:
      parser.error("object paths must be valid UTF-8")
    except ValueError as exc:
      parser.error(str(exc))
  elif args.staged:
    try:
      count, findings, skipped = scan_index(root)
    except UnicodeError:
      parser.error("object paths must be valid UTF-8")
    except ValueError as exc:
      parser.error(str(exc))
  else:
    count, findings = scan_files(root)
  identity_details = {}
  if args.commits is not None:
    try:
      findings += scan_commits(root, args.commits, isolated=args.staged or args.tree is not None,
                               details=identity_details if args.staged or args.tree is not None else None)
    except ValueError as exc:
      parser.error(str(exc))
  # ASCII JSON preserves Unicode values after parsing and works with both
  # legacy stdout encodings and text-only streams such as io.StringIO.
  report = {"checked_files": count, "findings": findings,
                    "limits": ["pattern scan only; read the diff before publishing",
                               "does not detect company code, private text or internal hosts"]}
  if args.staged or args.tree is not None:
    for item in findings + skipped:
      if "file" in item:
        item["file"] = safe_path_label(item["file"])
    report.update(status="incomplete" if skipped else ("findings" if findings else "no_findings"),
                  scope="git_tree_blobs_only" if tree else "normal_git_index_blobs_only",
                  skipped_entries=skipped)
    if tree:
      report["tree"] = tree
    if identity_details:
      report["identity_check"] = identity_details
    report["limits"].append("UTF-8 or BOM-marked UTF-16/32 text only, NUL rejected; skipped entries are not cleared; worktree, other trees and later index changes not checked")
  print(json.dumps(report, ensure_ascii=True, indent=2))
  return 2 if skipped else bool(findings)


if __name__ == "__main__":
  sys.exit(main())
