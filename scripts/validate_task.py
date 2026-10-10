#!/usr/bin/env python3
"""Validate long-task records, never execute checks or verify their truth."""

import argparse
import json
from pathlib import Path
import sys


class InvalidInput(ValueError):
  """Input does not follow the documented record format."""


def object_at(value, path, required, optional=()):
  if not isinstance(value, dict):
    raise InvalidInput(f"{path}: expected object")
  missing = set(required) - value.keys()
  extra = value.keys() - set(required) - set(optional)
  if missing:
    raise InvalidInput(f"{path}: missing fields {', '.join(sorted(missing))}")
  if extra:
    raise InvalidInput(f"{path}: unknown fields {', '.join(sorted(extra))}")
  return value


def string_at(value, path):
  if not isinstance(value, str) or not value.strip():
    raise InvalidInput(f"{path}: expected nonempty string")
  return value


def integer_at(value, path, minimum=0):
  if type(value) is not int or value < minimum:
    raise InvalidInput(f"{path}: expected integer >= {minimum}")
  return value


def list_at(value, path):
  if not isinstance(value, list):
    raise InvalidInput(f"{path}: expected array")
  return value


def unique_id(value, path, seen):
  value = string_at(value, path)
  if value in seen:
    raise InvalidInput(f"{path}: duplicate ID {value!r}")
  seen.add(value)
  return value


def enum_at(value, path, choices):
  string_at(value, path)
  if value not in choices:
    raise InvalidInput(f"{path}: unknown value {value!r}; expected {', '.join(choices)}")
  return value


def parse_spec(spec):
  object_at(spec, "spec", ("task_id", "spec_revision", "acceptance"),
            ("checkpoints", "workers", "max_steps"))
  for key in ("task_id", "spec_revision"):
    string_at(spec[key], f"spec.{key}")
  acceptance_ids, check_ids, checks = set(), set(), {}
  for index, item in enumerate(list_at(spec["acceptance"], "spec.acceptance")):
    path = f"spec.acceptance[{index}]"
    object_at(item, path, ("id", "description", "checks"))
    aid = unique_id(item["id"], f"{path}.id", acceptance_ids)
    string_at(item["description"], f"{path}.description")
    required = list_at(item["checks"], f"{path}.checks")
    if not required:
      raise InvalidInput(f"{path}.checks: must not be empty")
    for check in required:
      cid = unique_id(check, f"{path}.checks", check_ids)
      checks[cid] = aid
  if not acceptance_ids:
    raise InvalidInput("spec.acceptance: must not be empty")
  expected = {}
  for key in ("checkpoints", "workers"):
    ids = set()
    for item in list_at(spec.get(key, []), f"spec.{key}"):
      unique_id(item, f"spec.{key}", ids)
    expected[key] = ids
  if "max_steps" in spec:
    integer_at(spec["max_steps"], "spec.max_steps", 1)
  return checks, expected


def validate(spec, report):
  """Return consistency findings; malformed input raises InvalidInput."""
  required_checks, expected = parse_spec(spec)
  object_at(report, "report", ("task_id", "spec_revision", "revision", "status",
                              "stop_reason", "checks"),
            ("checkpoints", "workers", "steps_used"))
  for key in ("task_id", "spec_revision", "revision"):
    string_at(report[key], f"report.{key}")
  enum_at(report["status"], "report.status", ("complete", "running", "blocked", "failed"))
  enum_at(report["stop_reason"], "report.stop_reason",
          ("completed", "in_progress", "blocked", "failed", "budget_exhausted"))
  issues = []

  def issue(code, path, message):
    issues.append({"code": code, "path": path, "message": message})

  for key in ("task_id", "spec_revision"):
    if report[key] != spec[key]:
      issue("spec_mismatch", f"report.{key}", "Does not match the supplied task spec")
  if report["status"] != "complete":
    issue("run_incomplete", "report.status", f"Run is {report['status']}")
  if report["stop_reason"] != "completed":
    issue("stop_not_completion", "report.stop_reason", report["stop_reason"])
  if "steps_used" in report:
    integer_at(report["steps_used"], "report.steps_used")
  if "max_steps" in spec:
    if "steps_used" not in report:
      raise InvalidInput("report.steps_used: required when spec.max_steps is set")
    if report["steps_used"] > spec["max_steps"]:
      issue("budget_exceeded", "report.steps_used", "Recorded steps exceed the approved budget")

  seen = set()
  for index, check in enumerate(list_at(report["checks"], "report.checks")):
    path = f"report.checks[{index}]"
    object_at(check, path, ("id", "acceptance_id", "status"), ("evidence",))
    cid = unique_id(check["id"], f"{path}.id", seen)
    aid = string_at(check["acceptance_id"], f"{path}.acceptance_id")
    status = enum_at(check["status"], f"{path}.status",
                     ("passed", "failed", "blocked", "not_run"))
    if cid not in required_checks:
      issue("unknown_check", f"{path}.id", "Check is absent from the supplied spec")
    elif required_checks[cid] != aid:
      issue("acceptance_mismatch", f"{path}.acceptance_id", "Check belongs to another acceptance ID")
    if status != "passed":
      issue("check_not_passed", f"{path}.status", f"Check {cid} is {status}")
    evidence = check.get("evidence")
    if "evidence" in check:
      object_at(evidence, f"{path}.evidence", ("revision", "ref"))
      for key in ("revision", "ref"):
        string_at(evidence[key], f"{path}.evidence.{key}")
      if evidence["revision"] != report["revision"]:
        issue("stale_evidence", f"{path}.evidence.revision", "Evidence is for a different work revision")
    elif status == "passed":
      issue("missing_evidence", f"{path}.evidence", "Passed check needs an evidence reference")
  for cid in sorted(required_checks.keys() - seen):
    issue("missing_check", "report.checks", f"Missing {cid} for acceptance {required_checks[cid]}")

  for key in ("checkpoints", "workers"):
    seen = set()
    for index, item in enumerate(list_at(report.get(key, []), f"report.{key}")):
      path = f"report.{key}[{index}]"
      object_at(item, path, ("id", "status"))
      ident = unique_id(item["id"], f"{path}.id", seen)
      status = enum_at(item["status"], f"{path}.status",
                       ("complete", "running", "blocked", "failed", "not_run"))
      if ident not in expected[key]:
        issue("unregistered_item", f"{path}.id", f"Register {ident} in spec.{key} before closing")
      if status != "complete":
        issue("unfinished_item", f"{path}.status", f"{key}: {ident} is {status}")
    for ident in sorted(expected[key] - seen):
      issue("missing_item", f"report.{key}", f"Missing registered {key} ID {ident}")
  return {"result": "incomplete" if issues else "complete", "issues": issues,
          "scope": "record_consistency_only"}


def no_duplicate_keys(pairs):
  result = {}
  for key, value in pairs:
    if key in result:
      raise InvalidInput(f"JSON: duplicate object key {key!r}")
    result[key] = value
  return result


def reject_constant(value):
  raise InvalidInput(f"JSON: invalid numeric constant {value}")


def read_json(path):
  with Path(path).open(encoding="utf-8") as stream:
    return json.load(stream, object_pairs_hook=no_duplicate_keys, parse_constant=reject_constant)


def main(argv=None):
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("spec", help="Reviewed task spec JSON (separate from the run report)")
  parser.add_argument("report", help="Run report JSON; no commands or references are executed")
  args = parser.parse_args(argv)
  try:
    result = validate(read_json(args.spec), read_json(args.report))
  except (InvalidInput, OSError, UnicodeError, ValueError, RecursionError) as exc:
    result = {"result": "invalid", "issues": [
      {"code": "invalid_input", "path": "input", "message": str(exc)}],
      "scope": "record_consistency_only"}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 2
  print(json.dumps(result, ensure_ascii=False, indent=2))
  return 0 if result["result"] == "complete" else 1


if __name__ == "__main__":
  sys.exit(main())
