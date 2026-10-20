"""Standard-library wrapper tests only: never Pillow or upstream execution."""
import contextlib
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/research/check-pixel-qa-contract.py'
SPEC = importlib.util.spec_from_file_location('pixel_contract', SCRIPT)
PROBE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PROBE)


class PixelContractWrapperTests(unittest.TestCase):
  def test_verify_exact_bytes(self):
    with tempfile.TemporaryDirectory() as directory:
      path = Path(directory) / 'source.py'
      data = b'not executed\n'
      path.write_bytes(data)
      self.assertEqual(PROBE.verify_source(path, hashlib.sha256(data).hexdigest()), data)

  def test_verify_rejects_changed_bytes(self):
    with tempfile.TemporaryDirectory() as directory:
      path = Path(directory) / 'source.py'
      path.write_bytes(b'not executed')
      with self.assertRaisesRegex(PROBE.InvalidInput, 'mismatch'):
        PROBE.verify_source(path, '0' * 64)

  def test_verify_missing(self):
    with tempfile.TemporaryDirectory() as directory:
      with self.assertRaisesRegex(PROBE.InvalidInput, 'unreadable'):
        PROBE.verify_source(Path(directory) / 'missing.py', PROBE.PINS['qa'])

  def test_cli_requires_both_sources(self):
    result = subprocess.run([sys.executable, '-S', str(SCRIPT)], capture_output=True, text=True)
    self.assertEqual(result.returncode, 2)
    self.assertIn('--qa-source', result.stderr)

  def test_cli_rejects_unpinned_without_execution(self):
    with tempfile.TemporaryDirectory() as directory:
      path = Path(directory) / 'source.py'
      path.write_text('raise RuntimeError("must not execute")')
      result = subprocess.run([sys.executable, '-S', str(SCRIPT), '--qa-source', str(path),
                               '--export-source', str(path)], capture_output=True, text=True)
      self.assertEqual(result.returncode, 2)
      self.assertEqual(json.loads(result.stdout)['error'], 'source SHA-256 mismatch')
      self.assertNotIn(directory, result.stdout)

  def test_cli_missing_no_path_disclosure(self):
    with tempfile.TemporaryDirectory() as directory:
      missing = str(Path(directory) / 'missing.py')
      output = io.StringIO()
      with contextlib.redirect_stdout(output), patch.object(PROBE, 'load_verified') as loader:
        code = PROBE.main(['--qa-source', missing, '--export-source', missing])
      self.assertEqual(code, 2)
      loader.assert_not_called()
      self.assertNotIn(directory, output.getvalue())
      self.assertFalse(json.loads(output.getvalue())['passed'])

  def test_missing_pillow_is_explicit_without_install(self):
    with patch.dict(sys.modules, {'PIL': None}):
      with self.assertRaisesRegex(PROBE.InvalidInput, 'Pillow is required'):
        PROBE.run_probe(None, None, Path('.'))

  def test_nonempty_artifacts_rejected_before_execution(self):
    with tempfile.TemporaryDirectory() as directory:
      sentinel = Path(directory) / 'keep.txt'
      sentinel.write_text('unchanged')
      output = io.StringIO()
      with patch.object(PROBE, 'verify_source', return_value=b'not executed'), \
           patch.object(PROBE, 'load_verified') as loader, \
           contextlib.redirect_stdout(output):
        code = PROBE.main(['--qa-source', 'unused', '--export-source', 'unused',
                           '--artifacts', directory])
      self.assertEqual(code, 2)
      loader.assert_not_called()
      self.assertEqual(sentinel.read_text(), 'unchanged')
      self.assertNotIn(directory, output.getvalue())

  def test_report_base_is_unexecuted_not_pass(self):
    report = PROBE.report_base()
    self.assertEqual(report['schema'], 1)
    self.assertEqual(report['source_sha256'], PROBE.PINS)
    self.assertEqual(report['task_assertions'], [])
    self.assertEqual(report['upstream_reports'], {})
    self.assertNotIn('passed', report)
    report['source_sha256']['qa'] = 'changed'
    self.assertNotEqual(report['source_sha256'], PROBE.PINS)

  def test_xml_comparison_preserves_fields_not_indent(self):
    a = PROBE.ET.fromstring('<tile id="0">\n <frame duration="100"/>\n</tile>')
    b = PROBE.ET.fromstring('<tile id="0"><frame duration="100"/></tile>')
    self.assertEqual(PROBE.semantic(a), PROBE.semantic(b))
    b.find('frame').set('duration', '175')
    self.assertNotEqual(PROBE.semantic(a), PROBE.semantic(b))

  def test_xml_comparison_keeps_meaningful_text_whitespace(self):
    a = PROBE.ET.fromstring('<property> value </property>')
    b = PROBE.ET.fromstring('<property>value</property>')
    self.assertNotEqual(PROBE.semantic(a), PROBE.semantic(b))


if __name__ == '__main__':
  unittest.main()
