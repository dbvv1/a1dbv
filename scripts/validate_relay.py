#!/usr/bin/env python3
"""Read-only relay record/snapshot checks; never dispatch or execute a payload."""

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import sys

from validate_task import (InvalidInput, enum_at, integer_at, list_at,
                           no_duplicate_keys, object_at, parse_spec,
                           reject_constant, string_at, unique_id, validate)

SCOPE = "record_consistency_and_selected_tree_integrity_only"
MAX_JSON = 1024 * 1024
MAX_FILE = 64 * 1024 * 1024
MAX_TOTAL = 256 * 1024 * 1024
MAX_ENTRIES = 10000


def digest(data):
  return hashlib.sha256(data).hexdigest()


def sha_at(value, path):
  if not isinstance(value, str) or re.fullmatch(r"[0-9a-f]{64}", value) is None:
    raise InvalidInput(f"{path}: expected lowercase SHA256")
  return value


def relative_path(value, path):
  string_at(value, path)
  parts = value.split("/")
  if (value != value.strip() or "\\" in value or ":" in value
      or any(ord(c) < 32 or ord(c) == 127 for c in value)
      or any(p in ("", ".", "..") for p in parts)
      or PurePosixPath(value).is_absolute()):
    raise InvalidInput(f"{path}: expected canonical relative POSIX file path")
  return value


def paths_at(value, path):
  result = set()
  for item in list_at(value, path):
    unique_id(relative_path(item, path), path, result)
  if not result:
    raise InvalidInput(f"{path}: must not be empty")
  return result


def manifest_at(value, path, allow_empty=False):
  result = {}
  for i, item in enumerate(list_at(value, path)):
    label = f"{path}[{i}]"
    object_at(item, label, ("path", "sha256"))
    name = relative_path(item["path"], f"{label}.path")
    if name in result:
      raise InvalidInput(f"{label}: duplicate file path")
    result[name] = sha_at(item["sha256"], f"{label}.sha256")
  if not result and not allow_empty:
    raise InvalidInput(f"{path}: must not be empty")
  return result


def manifest_sha(files):
  return digest(json.dumps(files, sort_keys=True, separators=(",", ":"),
                           ensure_ascii=True).encode("utf-8"))


def revision_at(value, path):
  string_at(value, path)
  if not (re.fullmatch(r"[0-9a-f]{40}|[0-9a-f]{64}", value)
          or re.fullmatch(r"synthetic-[A-Za-z0-9._-]+", value)):
    raise InvalidInput(f"{path}: expected full Git SHA or explicit synthetic- label")


def runtime_at(value, path):
  object_at(value, path, ("model", "tools"))
  def version(item, label):
    object_at(item, label, ("id", "version"))
    for key in ("id", "version"):
      string_at(item[key], f"{label}.{key}")
  version(value["model"], f"{path}.model")
  seen = set()
  tools = list_at(value["tools"], f"{path}.tools")
  if not tools:
    raise InvalidInput(f"{path}.tools: must not be empty")
  for item in tools:
    version(item, f"{path}.tools")
    unique_id(item["id"], f"{path}.tools.id", seen)
  return {"model": value["model"], "tools": sorted(tools, key=lambda x: x["id"])}


def texts_at(value, path):
  items = list_at(value, path)
  if not items:
    raise InvalidInput(f"{path}: must not be empty")
  for item in items:
    string_at(item, path)


def read_record(path):
  path = Path(path)
  if path.is_symlink() or not stat.S_ISREG(path.stat().st_mode):
    raise InvalidInput("JSON record must be a nonsymlink regular file")
  with path.open("rb") as stream:
    data = stream.read(MAX_JSON + 1)
  if len(data) > MAX_JSON:
    raise InvalidInput("JSON exceeds 1 MiB limit")
  return data


def decode_record(data):
  return json.loads(data.decode("utf-8"), object_pairs_hook=no_duplicate_keys,
                    parse_constant=reject_constant)


def task_at(task):
  object_at(task, "task", ("schema_version", "task_id", "spec_revision",
                          "input_manifest", "input_sha256", "input_revision", "read_scope", "write_scope",
                          "runtime", "comparison", "acceptance", "max_steps",
                          "stop_conditions"))
  integer_at(task["schema_version"], "task.schema_version", 1)
  if task["schema_version"] != 1:
    raise InvalidInput("task.schema_version: unsupported version")
  inputs = manifest_at(task["input_manifest"], "task.input_manifest")
  sha_at(task["input_sha256"], "task.input_sha256")
  revision_at(task["input_revision"], "task.input_revision")
  if manifest_sha(inputs) != task["input_sha256"]:
    raise InvalidInput("task.input_sha256: differs from canonical input manifest digest")
  reads = paths_at(task["read_scope"], "task.read_scope")
  writes = paths_at(task["write_scope"], "task.write_scope")
  if reads != inputs.keys():
    raise InvalidInput("task.read_scope: must exactly equal input manifest paths")
  runtime_at(task["runtime"], "task.runtime")
  comparison = object_at(task["comparison"], "task.comparison",
                         ("baseline", "optimized", "same_conditions"))
  for key in ("baseline", "optimized"):
    string_at(comparison[key], f"task.comparison.{key}")
  texts_at(comparison["same_conditions"], "task.comparison.same_conditions")
  texts_at(task["stop_conditions"], "task.stop_conditions")
  spec = {key: task[key] for key in ("task_id", "spec_revision", "acceptance", "max_steps")}
  parse_spec(spec)
  return inputs, writes, spec


def root_at(path):
  root = Path(path)
  if root.is_symlink() or not root.is_dir():
    raise InvalidInput("Selected tree root must be an existing nonsymlink directory")
  return root.resolve(strict=True)


def snapshot(root, allowed_paths):
  """Inventory a caller-selected dedicated tree; no symlink traversal.

  Requires a quiescent trusted filesystem. Not an adversarial race-proof sandbox.
  Empty directories are irrelevant; every file and every symlink is inspected.
  Enumerate first; forbidden file names get a None sentinel, never a content read.
  """
  files, regular, total, entries = {}, {}, 0, 0
  pending = [root]
  while pending:
    directory = pending.pop()
    with os.scandir(directory) as children:
      for child in children:
        entries += 1
        if entries > MAX_ENTRIES:
          raise InvalidInput("Selected tree exceeds entry limit")
        path = Path(child.path)
        name = relative_path(path.relative_to(root).as_posix(), "tree.path")
        mode = child.stat(follow_symlinks=False).st_mode
        if stat.S_ISLNK(mode):
          raise InvalidInput(f"tree: symlink prohibited: {name}")
        if not path.resolve(strict=True).is_relative_to(root):
          raise InvalidInput(f"tree: path outside selected root: {name}")
        if stat.S_ISDIR(mode):
          pending.append(path)
        elif stat.S_ISREG(mode):
          regular[name] = path
        else:
          raise InvalidInput(f"tree: nonregular file prohibited: {name}")
  # Inventory/type checks finish before any content reads. An unexpected file
  # remains visible to set/difference checks, but its contents are never opened.
  for name, path in regular.items():
    if name not in allowed_paths:
      files[name] = None
      continue
    # Limits bound reading. No shell, model, network, or evidence execution.
    with path.open("rb") as stream:
      data = stream.read(min(MAX_FILE, MAX_TOTAL - total) + 1)
    total += len(data)
    if len(data) > MAX_FILE or total > MAX_TOTAL:
      raise InvalidInput("Selected tree exceeds byte limit")
    files[name] = digest(data)
  return files


def check(task_path, task_sha256, input_root, report_path=None, output_root=None, arm=None):
  """Anchor before parsing. Findings never attest runtime identity or real execution."""
  sha_at(task_sha256, "trusted_task_sha256")
  data = read_record(task_path)
  if digest(data) != task_sha256:
    raise InvalidInput("Task bytes differ from independently supplied reviewed SHA256")
  task = decode_record(data)
  expected_inputs, writes, spec = task_at(task)
  input_tree = root_at(input_root)
  issues = []
  def issue(code, path, message):
    issues.append({"code": code, "path": path, "message": message})
  def compare_files(expected, actual, label):
    for name in sorted(expected.keys() - actual.keys()):
      issue("missing_file", label, name)
    for name in sorted(actual.keys() - expected.keys()):
      issue("unexpected_file", label, name)
    for name in sorted(expected.keys() & actual.keys()):
      if expected[name] != actual[name]:
        issue("hash_mismatch", label, name)
  actual_inputs = snapshot(input_tree, expected_inputs.keys())
  compare_files(expected_inputs, actual_inputs, "input_tree")
  if manifest_sha(actual_inputs) != task["input_sha256"]:
    issue("hash_mismatch", "input_sha256", "Actual input tree differs from frozen snapshot digest")
  if report_path is not None:
    enum_at(arm, "selected_arm", ("baseline", "optimized"))
    output_tree = root_at(output_root)
    if input_tree.is_relative_to(output_tree) or output_tree.is_relative_to(input_tree):
      raise InvalidInput("Input and output trees must be separate, nonnested directories")
    report = decode_record(read_record(report_path))
    object_at(report, "return", ("schema_version", "task_id", "task_sha256", "arm",
                                  "input_manifest", "input_sha256", "input_revision", "runtime", "output_manifest", "verification"))
    integer_at(report["schema_version"], "return.schema_version", 1)
    string_at(report["task_id"], "return.task_id")
    sha_at(report["task_sha256"], "return.task_sha256")
    enum_at(report["arm"], "return.arm", ("baseline", "optimized"))
    sha_at(report["input_sha256"], "return.input_sha256")
    revision_at(report["input_revision"], "return.input_revision")
    for key, expected in (("schema_version", 1), ("task_id", task["task_id"]),
                          ("task_sha256", task_sha256), ("arm", arm),
                          ("input_sha256", task["input_sha256"]),
                          ("input_revision", task["input_revision"])):
      if report[key] != expected:
        issue("binding_mismatch", f"return.{key}", "Does not match reviewed task/selected arm")
    if manifest_at(report["input_manifest"], "return.input_manifest") != expected_inputs:
      issue("binding_mismatch", "return.input_manifest", "Different input manifest")
    if runtime_at(report["runtime"], "return.runtime") != runtime_at(task["runtime"], "task.runtime"):
      issue("binding_mismatch", "return.runtime", "Different declared model/tool versions")
    outputs = manifest_at(report["output_manifest"], "return.output_manifest", allow_empty=True)
    actual_outputs = snapshot(output_tree, expected_inputs.keys() | writes)
    compare_files(outputs, actual_outputs, "output_tree")
    changed = {name for name in actual_inputs.keys() | actual_outputs.keys()
               if (name not in actual_inputs or name not in actual_outputs
                   or actual_inputs[name] != actual_outputs[name])}
    for name in sorted(changed - writes):
      issue("write_scope_mismatch", "output_tree", f"Actual added/deleted/modified path outside write_scope: {name}")
    issues.extend(validate(spec, report["verification"])["issues"])
    # Legacy validate_task leaves refs opaque. Relay refs are local artifacts,
    # never commands/URLs; require both a declaration and an actual hashed file.
    for index, check_record in enumerate(report["verification"]["checks"]):
      if "evidence" not in check_record:
        continue
      label = f"return.verification.checks[{index}].evidence.ref"
      ref = relative_path(check_record["evidence"]["ref"], label)
      if ref not in outputs or actual_outputs.get(ref) is None:
        issue("missing_evidence_artifact", label,
              "Evidence ref must name a declared, present, allowed output file")
  return {"result": "incomplete" if issues else "complete", "issues": issues, "scope": SCOPE}


def main(argv=None):
  parser = argparse.ArgumentParser(description=__doc__)
  sub = parser.add_subparsers(dest="command", required=True)
  for name in ("dispatch-check", "return-check"):
    command = sub.add_parser(name)
    command.add_argument("task")
    command.add_argument("--task-sha256", required=True, help="Independent reviewed task byte SHA256; not from the return")
    command.add_argument("--input-root", required=True, help="Dedicated immutable input tree, inventoried in full")
    if name == "return-check":
      command.add_argument("report")
      command.add_argument("--output-root", required=True, help="Dedicated complete output tree, inventoried in full")
      command.add_argument("--arm", choices=("baseline", "optimized"), required=True)
  args = parser.parse_args(argv)
  try:
    result = check(args.task, args.task_sha256, args.input_root,
                   getattr(args, "report", None), getattr(args, "output_root", None),
                   getattr(args, "arm", None))
  except (InvalidInput, OSError, UnicodeError, ValueError, RecursionError, RuntimeError) as exc:
    result = {"result": "invalid", "issues": [{"code": "invalid_input", "path": "input", "message": str(exc)}], "scope": SCOPE}
  print(json.dumps(result, ensure_ascii=True, indent=2))
  return {"complete": 0, "incomplete": 1, "invalid": 2}[result["result"]]


if __name__ == "__main__":
  sys.exit(main())
