#!/usr/bin/env python3
"""Small, conservative export workflow. Detection never replaces human review."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import sys
import tempfile

MAX_FILE = 1024 * 1024
MAX_TOTAL = 10 * MAX_FILE
MANIFEST = "export-manifest.json"
PATTERNS = [
  ("credential", re.compile(r"sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[abprs]-[A-Za-z0-9-]{10,}|(?:AKIA|ASIA)[A-Z0-9]{16}|AIza[A-Za-z0-9_-]{35}")),
  ("private-key", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
  ("secret-assignment", re.compile(r'''["']?(?:api[_-]?key|access[_-]?token|token|secret|password)["']?\s*[:=]\s*["']?[^\s"'$}{,;]+''', re.I)),
  ("local-path", re.compile(r"/(?:Users|home|root|workspace|private)/[^\s]+")),
]


class ExportError(Exception):
  pass


def fail(message):
  raise ExportError(message)


def digest(data):
  return hashlib.sha256(data).hexdigest()


def canonical(data):
  return (json.dumps(data, ensure_ascii=True, sort_keys=True, indent=2) + "\n").encode()


def path_checked(value):
  path = Path(os.path.abspath(value))
  # Check every component before resolve: symlinks are never followed.
  for part in [path, *path.parents]:
    if part.is_symlink():
      fail("符号链接路径不受支持。")
  return path


def overlaps(a, b):
  return a == b or a in b.parents or b in a.parents


def destination(value, outside_git=False):
  path = path_checked(value)
  if path.exists() or not path.parent.is_dir():
    fail("输出必须是尚不存在的目录，且父目录必须已存在；不会覆盖旧快照。")
  if outside_git and any(
      (p / ".git").is_file() or (p / ".git").is_symlink() or (p / ".git/HEAD").exists()
      for p in [path.parent, *path.parent.parents]):
    fail("暂存目录必须在 Git 工作树之外。")
  return path


def allowed(name):
  if not isinstance(name, str) or "\\" in name or any(ord(c) < 32 for c in name):
    return False
  p = PurePosixPath(name)
  if p.is_absolute() or str(p) != name or any(x in (".", "..") or x.startswith(".") for x in p.parts):
    return False
  if name in ("claude/CLAUDE.md", "claude/settings.json", "codex/AGENTS.md", "gemini/GEMINI.md"):
    return True
  return (len(p.parts) >= 3 and p.parts[0] == "claude" and
          ((p.parts[1] in ("agents", "commands", "output-styles") and p.suffix == ".md") or
           (p.parts[1] == "skills" and p.suffix in (".md", ".sh", ".py")) or
           (p.parts[1] == "hooks" and p.suffix in (".sh", ".py"))))


def read_text(path):
  path = path_checked(path)
  if not path.is_file() or not stat.S_ISREG(path.stat().st_mode):
    fail("清单中的源文件不存在或不是普通文件。")
  if path.stat().st_size > MAX_FILE:
    fail("文件超过 1 MiB 限制。")
  data = path.read_bytes()
  if len(data) > MAX_FILE:
    fail("文件超过 1 MiB 限制。")
  text = data.decode("utf-8")
  if any(ord(c) < 32 and c not in "\n\r\t" for c in text):
    fail("不支持二进制或含控制字符的文件。")
  return text


def parse_json(text):
  def pairs(items):
    result = {}
    for key, value in items:
      if key in result:
        fail("JSON 含重复字段。")
      result[key] = value
    return result
  return json.loads(text, object_pairs_hook=pairs)


def filter_settings(text):
  settings = parse_json(text)
  if not isinstance(settings, dict):
    fail("settings.json 必须是对象。")
  result = {}
  for key in ("alwaysThinkingEnabled", "includeCoAuthoredBy", "cleanupPeriodDays"):
    if key not in settings:
      continue
    value = settings[key]
    valid = (type(value) is int and 0 <= value <= 3650) if key == "cleanupPeriodDays" else type(value) is bool
    if not valid:
      fail("允许的 settings 字段类型或范围无效。")
    result[key] = value
  return canonical(result).decode()


def scan(name, text, index):
  for category, pattern in PATTERNS:
    if pattern.search(name):
      fail("文件 #%d：文件名含疑似敏感信息（%s）。" % (index, category))
    for line, value in enumerate(text.splitlines(), 1):
      if pattern.search(value):
        fail("文件 #%d 第 %d 行：疑似敏感信息（%s）；内容未输出。" % (index, line, category))


def validate_files(files):
  if not files or sum(len(data) for data in files.values()) > MAX_TOTAL:
    fail("快照为空或超过 10 MiB 限制。")
  for index, (name, data) in enumerate(sorted(files.items()), 1):
    if not allowed(name):
      fail("清单含不受支持的文件路径或类型。")
    scan(name, data.decode("utf-8"), index)


def write_snapshot(output, files, manifest):
  # No source bytes reach the output parent until all validation has passed.
  temporary = Path(tempfile.mkdtemp(prefix=".ai-export-", dir=output.parent))
  try:
    for name, data in files.items():
      target = temporary / name
      target.parent.mkdir(parents=True, exist_ok=True)
      target.write_bytes(data)
      target.chmod(0o600)
    (temporary / MANIFEST).write_bytes(canonical(manifest))
    (temporary / MANIFEST).chmod(0o600)
    # Reserve the destination exclusively: no existing directory is replaced.
    output.mkdir(mode=0o700)
    try:
      for child in temporary.iterdir():
        child.rename(output / child.name)
    except BaseException:
      shutil.rmtree(output)
      raise
  finally:
    shutil.rmtree(temporary)


def stage(args):
  output = destination(args.output, outside_git=True)
  sources = {}
  for spec in args.source:
    tool, separator, value = spec.partition("=")
    if not separator or tool not in ("claude", "codex", "gemini") or tool in sources or not value:
      fail("源参数应为唯一的 claude=目录、codex=目录或 gemini=目录。")
    source = path_checked(value)
    if not source.is_dir() or overlaps(source, output):
      fail("源目录不存在或与输出路径重叠。")
    sources[tool] = source
  files = {}
  for name in args.include:
    if not allowed(name) or name in files:
      fail("文件清单包含重复项或不受支持的路径。")
    tool, relative = name.split("/", 1)
    if tool not in sources:
      fail("清单文件没有对应的显式源目录。")
    text = read_text(sources[tool] / relative)
    if name == "claude/settings.json":
      text = filter_settings(text)
    files[name] = text.encode("utf-8")
  validate_files(files)
  manifest = {"version": 1, "files": {name: digest(data) for name, data in sorted(files.items())}}
  write_snapshot(output, files, manifest)
  print("暂存完成；尚未发布。请人工审阅所有清单文件。")
  print("审阅标识（manifest SHA-256）：" + digest(canonical(manifest)))


def promote(args):
  source = path_checked(args.stage)
  output = destination(args.output)
  if not source.is_dir() or overlaps(source, output):
    fail("暂存目录不存在或与输出路径重叠。")
  manifest_text = read_text(source / MANIFEST)
  if digest(manifest_text.encode()) != args.reviewed:
    fail("审阅标识不匹配。")
  manifest = parse_json(manifest_text)
  if (not isinstance(manifest, dict) or set(manifest) != {"version", "files"} or
      manifest["version"] != 1 or not isinstance(manifest["files"], dict)):
    fail("暂存清单格式无效。")
  files = {}
  for name, expected in manifest["files"].items():
    if not allowed(name):
      fail("暂存清单含不受支持的路径。")
    text = read_text(source / name)
    data = text.encode()
    if digest(data) != expected:
      fail("文件在审阅清单生成后发生变化；请重新暂存和审阅。")
    if name == "claude/settings.json" and filter_settings(text) != text:
      fail("暂存 settings 不符合字段白名单。")
    files[name] = data
  actual = set()
  for directory, dirs, names in os.walk(source, followlinks=False):
    for name in dirs + names:
      path = path_checked(Path(directory) / name)
      if path.is_file():
        actual.add(path.relative_to(source).as_posix())
      elif not path.is_dir():
        fail("暂存目录含非普通文件。")
  if actual != set(files) | {MANIFEST}:
    fail("暂存目录含清单外文件或缺失文件。")
  validate_files(files)
  write_snapshot(output, files, manifest)
  print("已提升为新快照；未执行 git add、commit 或 push。仍需检查发布差异。")


def main():
  parser = argparse.ArgumentParser(description="显式文件清单导出；不读取默认个人目录，不自动发布。")
  sub = parser.add_subparsers(dest="command", required=True)
  staging = sub.add_parser("stage", help="仅暂存到 Git 工作树之外")
  staging.add_argument("--source", action="append", required=True, metavar="TOOL=DIR")
  staging.add_argument("--include", action="append", required=True, metavar="TOOL/FILE")
  staging.add_argument("--output", required=True)
  promotion = sub.add_parser("promote", help="人工审阅后显式提升至一个新目录")
  promotion.add_argument("--stage", required=True)
  promotion.add_argument("--output", required=True)
  promotion.add_argument("--reviewed", required=True, metavar="MANIFEST_SHA256")
  args = parser.parse_args()
  try:
    (stage if args.command == "stage" else promote)(args)
  except ExportError as exc:
    print("错误：" + str(exc), file=sys.stderr)
    return 1
  except (OSError, ValueError, UnicodeError, RecursionError):
    # Library exception messages can contain source paths, JSON values, or secrets.
    print("错误：无法安全读取、解析或写入快照；未输出源内容。", file=sys.stderr)
    return 1
  return 0


if __name__ == "__main__":
  sys.exit(main())
