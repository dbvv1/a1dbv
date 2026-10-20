"""Synthetic relay checks only; no model/tool payload is executed."""

import copy
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
MODULE = importlib.util.spec_from_file_location("validate_relay", ROOT / "scripts/validate_relay.py")
validator = importlib.util.module_from_spec(MODULE)
MODULE.loader.exec_module(validator)
FIXTURES = ROOT / "templates/long-task"


class RelayTests(unittest.TestCase):
  def setUp(self):
    self.tmp = tempfile.TemporaryDirectory()
    self.addCleanup(self.tmp.cleanup)
    self.root = Path(self.tmp.name)
    self.inputs = self.root / "inputs"
    self.outputs = self.root / "outputs"
    self.inputs.mkdir()
    self.outputs.mkdir()
    shutil.copyfile(FIXTURES / "fixtures/relay-input.txt", self.inputs / "relay-input.txt")
    shutil.copyfile(FIXTURES / "fixtures/relay-input.txt", self.outputs / "relay-input.txt")
    shutil.copyfile(FIXTURES / "fixtures/relay-output.txt", self.outputs / "relay-output.txt")
    self.task = json.loads((FIXTURES / "relay-task.example.json").read_text())
    self.report = json.loads((FIXTURES / "relay-return.example.json").read_text())
    self.task_path = self.root / "task.json"
    self.report_path = self.root / "return.json"
    self.save()

  def save(self):
    self.task_path.write_text(json.dumps(self.task))
    self.anchor = validator.digest(self.task_path.read_bytes())
    self.report["task_sha256"] = self.anchor
    self.report_path.write_text(json.dumps(self.report))

  def result(self, dispatch=False):
    self.save()
    return validator.check(self.task_path, self.anchor, self.inputs,
                           None if dispatch else self.report_path,
                           None if dispatch else self.outputs,
                           None if dispatch else "baseline")

  def codes(self, dispatch=False):
    return {i["code"] for i in self.result(dispatch)["issues"]}

  def sync_outputs(self):
    self.report["output_manifest"] = [{"path": name, "sha256": sha}
                                      for name, sha in validator.snapshot(
                                        self.outputs, {p.relative_to(self.outputs).as_posix()
                                                       for p in self.outputs.rglob("*") if p.is_file()}).items()]

  def test_passing_both_modes_and_fixture_anchor(self):
    self.assertEqual(self.result(True)["result"], "complete")
    self.assertEqual(self.result()["result"], "complete")
    example = json.loads((FIXTURES / "relay-return.example.json").read_text())
    self.assertEqual(example["task_sha256"], validator.digest((FIXTURES / "relay-task.example.json").read_bytes()))

  def test_each_required_field_missing(self):
    for target in ("task", "report"):
      original = copy.deepcopy(getattr(self, target))
      for key in original:
        with self.subTest(target=target, key=key):
          setattr(self, target, copy.deepcopy(original))
          del getattr(self, target)[key]
          # save() binds the report hash; remove that field after save separately.
          if target == "report" and key == "task_sha256":
            self.save()
            report = copy.deepcopy(self.report)
            del report[key]
            self.report_path.write_text(json.dumps(report))
            with self.assertRaises(validator.InvalidInput):
              validator.check(self.task_path, self.anchor, self.inputs, self.report_path, self.outputs, "baseline")
          else:
            with self.assertRaises(validator.InvalidInput):
              self.result()
      setattr(self, target, original)

  def test_strict_json_and_types(self):
    for raw in ('{"a":1,"a":2}', '{"a":NaN}', '[', 'null', '\xff'):
      with self.subTest(raw=raw):
        self.report_path.write_bytes(raw.encode("latin-1"))
        with self.assertRaises((ValueError, UnicodeError)):
          validator.check(self.task_path, self.anchor, self.inputs, self.report_path, self.outputs, "baseline")
    for key, value in [("schema_version", True), ("max_steps", True), ("read_scope", {}),
                       ("input_manifest", []), ("input_sha256", "A" * 64),
                       ("runtime", {"model": "wrong", "tools": []}), ("input_revision", "short")]:
      original = copy.deepcopy(self.task)
      self.task[key] = value
      with self.subTest(key=key), self.assertRaises(validator.InvalidInput):
        self.result()
      self.task = original
    self.report["schema_version"] = True
    with self.assertRaises(validator.InvalidInput):
      self.result()

  def test_changed_inputs_missing_added_and_digest(self):
    (self.inputs / "relay-input.txt").write_text("changed")
    self.assertIn("hash_mismatch", self.codes(True))
    (self.inputs / "relay-input.txt").unlink()
    self.assertIn("missing_file", self.codes(True))
    (self.inputs / "extra.txt").write_text("extra")
    self.assertIn("unexpected_file", self.codes(True))

  def test_double_tamper_cannot_replace_independent_anchor(self):
    old_anchor = self.anchor
    (self.inputs / "relay-input.txt").write_text("changed")
    self.task["input_manifest"][0]["sha256"] = validator.digest(b"changed")
    self.task["input_sha256"] = validator.manifest_sha({"relay-input.txt": validator.digest(b"changed")})
    self.report["input_manifest"] = self.task["input_manifest"]
    self.report["input_sha256"] = self.task["input_sha256"]
    self.save()
    with self.assertRaises(validator.InvalidInput):
      validator.check(self.task_path, old_anchor, self.inputs, self.report_path, self.outputs, "baseline")

  def test_binding_arm_runtime_revision_and_manifest(self):
    original = copy.deepcopy(self.report)
    cases = [("arm", "optimized"), ("task_id", "other"), ("input_revision", "synthetic-other"),
             ("input_sha256", "0" * 64), ("input_manifest", [{"path": "relay-input.txt", "sha256": "0" * 64}])]
    for key, value in cases:
      self.report = copy.deepcopy(original)
      self.report[key] = value
      with self.subTest(key=key):
        self.assertIn("binding_mismatch", self.codes())
    for area in ("model", "tools"):
      self.report = copy.deepcopy(original)
      item = self.report["runtime"][area]
      (item[0] if isinstance(item, list) else item)["version"] = "wrong"
      self.assertIn("binding_mismatch", self.codes())
    self.save()
    raw = json.loads(self.report_path.read_text())
    raw["task_sha256"] = "0" * 64
    self.report_path.write_text(json.dumps(raw))
    result = validator.check(self.task_path, self.anchor, self.inputs, self.report_path, self.outputs, "baseline")
    self.assertIn("binding_mismatch", {i["code"] for i in result["issues"]})

  def test_unexpected_contents_are_never_opened(self):
    extra_input = self.inputs / "private-extra.txt"
    extra_output = self.outputs / "private-extra.txt"
    extra_input.write_text("must not read input")
    extra_output.write_text("must not read output")
    original_open = Path.open
    opened = []
    def guarded_open(path, *args, **kwargs):
      if path in (extra_input, extra_output):
        self.fail("Attempted to open unauthorized file content")
      opened.append(path)
      return original_open(path, *args, **kwargs)
    with mock.patch.object(Path, "open", guarded_open):
      self.assertIn("unexpected_file", self.codes(True))
      # Both trees may contain the same forbidden name; neither is opened.
      self.assertIn("unexpected_file", self.codes())
    self.assertIn(self.inputs / "relay-input.txt", opened)
    extra_input.unlink()
    self.report["output_manifest"].append({"path": "private-extra.txt", "sha256": "0" * 64})
    with mock.patch.object(Path, "open", guarded_open):
      # A declaration in the untrusted return cannot expand the reviewed scope.
      self.assertIn("write_scope_mismatch", self.codes())

  def test_output_integrity_missing_unlisted_and_tampered(self):
    (self.outputs / "relay-output.txt").write_text("tampered")
    self.assertIn("hash_mismatch", self.codes())
    (self.outputs / "relay-output.txt").unlink()
    self.assertIn("missing_file", self.codes())
    (self.outputs / "unlisted.txt").write_text("unlisted")
    self.assertTrue({"unexpected_file", "write_scope_mismatch"} <= self.codes())

  def test_readonly_modified_deleted_and_sibling_prefix_rejected(self):
    (self.outputs / "relay-input.txt").write_text("modified")
    self.sync_outputs()
    self.assertIn("write_scope_mismatch", self.codes())
    (self.outputs / "relay-input.txt").unlink()
    self.sync_outputs()
    self.assertIn("write_scope_mismatch", self.codes())
    shutil.copyfile(self.inputs / "relay-input.txt", self.outputs / "relay-input.txt")
    (self.outputs / "relay-output.txt-evil").write_text("sibling")
    self.sync_outputs()
    self.assertIn("write_scope_mismatch", self.codes())

  def test_allowed_modification_deletion_and_no_change(self):
    self.task["write_scope"].append("relay-input.txt")
    (self.outputs / "relay-input.txt").write_text("permitted")
    self.sync_outputs()
    self.assertEqual(self.result()["result"], "complete")
    (self.outputs / "relay-input.txt").unlink()
    self.sync_outputs()
    self.assertEqual(self.result()["result"], "complete")
    shutil.copyfile(self.inputs / "relay-input.txt", self.outputs / "relay-input.txt")
    (self.outputs / "relay-output.txt").unlink()
    self.report["verification"]["checks"][0]["evidence"]["ref"] = "relay-input.txt"
    self.sync_outputs()
    self.assertEqual(self.result()["result"], "complete")

  def test_paths_and_duplicate_manifest_rejected(self):
    for path in ("/outside", "../outside", "a/../b", "a//b", "./a", "a/", "C:/escape", "C:escape", "\\\\host\\share", "a\\b", "a\x00b"):
      for area in ("read_scope", "write_scope"):
        original = self.task[area]
        self.task[area] = [path]
        with self.subTest(path=path, area=area), self.assertRaises(validator.InvalidInput):
          self.result()
        self.task[area] = original
      self.report["output_manifest"][0]["path"] = path
      with self.assertRaises(validator.InvalidInput):
        self.result()
    self.report = json.loads((FIXTURES / "relay-return.example.json").read_text())
    self.task["input_manifest"].append(copy.deepcopy(self.task["input_manifest"][0]))
    with self.assertRaises(validator.InvalidInput):
      self.result()

  def test_symlinks_inside_outside_directory_and_root(self):
    outside = self.root / "outside.txt"
    outside.write_text("outside")
    for target in (outside, self.inputs / "relay-input.txt", self.inputs):
      link = self.outputs / "link"
      link.symlink_to(target)
      with self.subTest(target=target.name), self.assertRaises(validator.InvalidInput):
        self.result()
      link.unlink()
    root_link = self.root / "linked-root"
    root_link.symlink_to(self.inputs, target_is_directory=True)
    with self.assertRaises(validator.InvalidInput):
      validator.check(self.task_path, self.anchor, root_link)
    with self.assertRaises(validator.InvalidInput):
      validator.check(self.task_path, self.anchor, self.inputs, self.report_path, self.inputs, "baseline")

  def test_input_symlink_nested_root_and_special_files(self):
    source = self.inputs / "relay-input.txt"
    source.unlink()
    source.symlink_to(self.outputs / "relay-input.txt")
    with self.assertRaises(validator.InvalidInput):
      self.result(True)
    source.unlink()
    shutil.copyfile(self.outputs / "relay-input.txt", source)
    nested = self.outputs / "nested"
    nested.mkdir()
    with self.assertRaises(validator.InvalidInput):
      validator.check(self.task_path, self.anchor, self.outputs, self.report_path, nested, "baseline")
    fifo = self.outputs / "fifo"
    os.mkfifo(fifo)
    with self.assertRaises(validator.InvalidInput):
      self.result()
    fifo.unlink()
    os.mkfifo(self.root / "record-fifo")
    with self.assertRaises(validator.InvalidInput):
      validator.read_record(self.root / "record-fifo")

  def test_malformed_nested_fields_and_duplicate_scope(self):
    original = copy.deepcopy(self.task)
    mutations = [
      lambda t: t["read_scope"].append(t["read_scope"][0]),
      lambda t: t["write_scope"].append(t["write_scope"][0]),
      lambda t: t["runtime"]["tools"].append(copy.deepcopy(t["runtime"]["tools"][0])),
      lambda t: t["input_manifest"][0].update(path="../escape"),
      lambda t: t["comparison"].update(same_conditions=[]),
      lambda t: t.update(stop_conditions=[]),
      lambda t: t.update(input_sha256="0" * 64),
      lambda t: t["acceptance"][0].update(checks=[]),
    ]
    for i, mutate in enumerate(mutations):
      self.task = copy.deepcopy(original)
      mutate(self.task)
      with self.subTest(mutation=i), self.assertRaises(validator.InvalidInput):
        self.result()
    self.task = original
    self.report["output_manifest"].append(copy.deepcopy(self.report["output_manifest"][0]))
    with self.assertRaises(validator.InvalidInput):
      self.result()

  def test_failed_check_unknown_fields_and_scope(self):
    self.report["verification"]["checks"][0]["status"] = "failed"
    self.assertIn("check_not_passed", self.codes())
    self.assertEqual(self.result()["scope"], validator.SCOPE)
    self.task["enable"] = True
    with self.assertRaises(validator.InvalidInput):
      self.result()

  def test_evidence_ref_is_existing_relative_output_artifact(self):
    record = self.report["verification"]["checks"][0]
    for ref in ("/outside", "../escape", "C:/outside", "https://example.invalid/evidence"):
      record["evidence"]["ref"] = ref
      with self.subTest(ref=ref), self.assertRaises(validator.InvalidInput):
        self.result()
    record["evidence"]["ref"] = "missing.txt"
    self.assertIn("missing_evidence_artifact", self.codes())
    record["evidence"]["ref"] = "relay-output.txt"
    self.assertEqual(self.result()["result"], "complete")
    # Existing but undeclared does not qualify; declared but absent fails too.
    original = copy.deepcopy(self.report["output_manifest"])
    self.report["output_manifest"] = [item for item in original if item["path"] != "relay-output.txt"]
    self.assertIn("missing_evidence_artifact", self.codes())
    self.report["output_manifest"] = original
    (self.outputs / "relay-output.txt").unlink()
    self.assertIn("missing_evidence_artifact", self.codes())
    for status in ("failed", "not_run"):
      record["status"] = status
      record.pop("evidence", None)
      self.assertNotIn("missing_evidence_artifact", self.codes())
      record["evidence"] = {"revision": "synthetic-output-v1", "ref": "../escape"}
      with self.subTest(status=status), self.assertRaises(validator.InvalidInput):
        self.result()

  def test_cli_unpaired_surrogate_always_emits_json(self):
    self.report["verification"]["checks"][0].update(id="\ud800", status="failed")
    self.save()
    proc = subprocess.run([
      sys.executable, str(ROOT / "scripts/validate_relay.py"), "return-check",
      str(self.task_path), str(self.report_path), "--task-sha256", self.anchor,
      "--input-root", str(self.inputs), "--output-root", str(self.outputs),
      "--arm", "baseline"], capture_output=True, text=True, check=False)
    self.assertEqual(proc.returncode, 1, proc.stderr)
    result = json.loads(proc.stdout)
    self.assertEqual(result["result"], "incomplete")
    self.assertIn("check_not_passed", {i["code"] for i in result["issues"]})

  def test_cli_codes_and_no_payload_execution(self):
    marker = self.root / "MUST_NOT_EXIST"
    payload = f"$(touch {marker})"
    self.task["comparison"]["optimized"] = payload
    (self.outputs / "relay-output.txt").write_text(payload)
    self.sync_outputs()
    self.save()
    base = [sys.executable, str(ROOT / "scripts/validate_relay.py")]
    args = [str(self.task_path), "--task-sha256", self.anchor, "--input-root", str(self.inputs)]
    for mode in ("dispatch-check", "return-check"):
      extra = [] if mode == "dispatch-check" else [str(self.report_path), "--output-root", str(self.outputs), "--arm", "baseline"]
      proc = subprocess.run(base + [mode] + args + extra, capture_output=True, text=True, check=False)
      self.assertEqual(proc.returncode, 0, proc.stderr + proc.stdout)
      self.assertEqual(json.loads(proc.stdout)["result"], "complete")
    self.assertFalse(marker.exists())
    (self.inputs / "relay-input.txt").write_text("tampered")
    proc = subprocess.run(base + ["dispatch-check"] + args, capture_output=True, text=True, check=False)
    self.assertEqual(proc.returncode, 1)
    self.assertEqual(json.loads(proc.stdout)["result"], "incomplete")
    self.task_path.unlink()
    proc = subprocess.run(base + ["dispatch-check"] + args, capture_output=True, text=True, check=False)
    self.assertEqual(proc.returncode, 2)
    self.assertEqual(json.loads(proc.stdout)["result"], "invalid")


if __name__ == "__main__":
  unittest.main()
