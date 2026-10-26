"""Real Blender exporter regressions. Requires BLENDER and staged ENCOUNTER_SOURCE."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent
BLENDER = os.environ.get('BLENDER', '/usr/bin/blender')
SOURCES = Path(os.environ['ENCOUNTER_SOURCE'])

class FbxTests(unittest.TestCase):
  def setUp(self):
    self.temp = tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
    self.root = Path(self.temp.name)
  def blender(self, *args):
    env = dict(os.environ, XDG_CONFIG_HOME=str(self.root / 'config'))
    return subprocess.run([BLENDER, '-b', '--factory-startup', '--disable-autoexec', '--threads', '2',
      '--python-exit-code', '1', *args], env=env, capture_output=True, text=True, timeout=90)
  def export(self, source, output):
    return self.blender('--python', str(ROOT / 'export_fbx.py'), '--', '--input', str(source), '--output', str(output))
  def verify_export(self, name, count):
    out = self.root / 'export'
    result = self.export(SOURCES / (name + '.blend'), out)
    self.assertEqual(0, result.returncode, result.stdout + result.stderr)
    self.assertGreater((out / (name + '.fbx')).stat().st_size, 0)
    data = json.loads((out / (name + '.source.json')).read_text())
    self.assertEqual('scene-linear', data['colorSpace'])
    self.assertTrue(all(len(m['color']) == 4 and m['color'][3] == 1 for m in data['materials']))
    self.assertEqual(count, len(data['actions'])); self.assertEqual(6, len(data['materials']))
  def test_blue_five_actions(self): self.verify_export('blue-reactions', 5)
  def test_amber_three_actions(self): self.verify_export('amber', 3)
  def test_long_three_actions(self): self.verify_export('blue-long', 3)
  def test_missing_source(self):
    out = self.root / 'export'; result = self.export(self.root / 'absent.blend', out)
    self.assertNotEqual(0, result.returncode); self.assertFalse(out.exists())
  def test_existing_output_preserved(self):
    out = self.root / 'export'; out.mkdir(); sentinel = out / 'keep'; sentinel.write_text('keep')
    result = self.export(SOURCES / 'blue-reactions.blend', out)
    self.assertNotEqual(0, result.returncode); self.assertEqual('keep', sentinel.read_text())
  def test_invalid_rig_no_output(self):
    source = self.root / 'no-rig.blend'; out = self.root / 'export'
    result = self.blender('--python-expr', 'import bpy; bpy.ops.wm.save_as_mainfile(filepath=' + repr(str(source)) + ')')
    self.assertEqual(0, result.returncode)
    result = self.export(source, out)
    self.assertNotEqual(0, result.returncode); self.assertFalse(out.exists())
  def test_canonical_name_counterexample(self):
    script = self.root / 'check.py'
    script.write_text('import sys\nsys.path.insert(0, ' + repr(str(ROOT)) + ')\nfrom verify_fbx import canonical\n'
      'assert canonical("GuardRig|GuardRig|death") == "death"\n'
      'try: canonical("GuardRig|missing")\nexcept ValueError: pass\nelse: raise AssertionError("must reject unknown take")\n')
    result = self.blender('--python', str(script))
    self.assertEqual(0, result.returncode, result.stdout + result.stderr)

  def test_verify_missing_input_no_report(self):
    report = self.root / 'report.json'
    result = self.blender('--python', str(ROOT / 'verify_fbx.py'), '--', '--source', str(SOURCES / 'blue-reactions.blend'),
      '--fbx', str(self.root / 'absent.fbx'), '--report', str(report))
    self.assertNotEqual(0, result.returncode); self.assertFalse(report.exists())
  def test_verify_corrupt_fbx_no_report(self):
    bad = self.root / 'corrupt.fbx'; bad.write_bytes(b'not an FBX file')
    report = self.root / 'report.json'
    result = self.blender('--python', str(ROOT / 'verify_fbx.py'), '--', '--source', str(SOURCES / 'blue-reactions.blend'),
      '--fbx', str(bad), '--report', str(report))
    self.assertNotEqual(0, result.returncode); self.assertFalse(report.exists())

if __name__ == '__main__': unittest.main()
