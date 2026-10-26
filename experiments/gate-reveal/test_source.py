"""Real Blender save/reopen + FFmpeg delivery, and input failures (no skipped prerequisites)."""
import copy
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent
INSPECT = r'''
import bpy,json,hashlib
from pathlib import Path
s=bpy.context.scene
mesh={o.name: {'vertices':[list(v.co) for v in o.data.vertices], 'faces':[list(p.vertices) for p in o.data.polygons], 'materials':[m.name for m in o.data.materials]} for o in bpy.data.objects if o.type=='MESH'}
curves={o.name:[(fc.data_path,fc.array_index,[(list(k.co),list(k.handle_left),list(k.handle_right)) for k in fc.keyframe_points]) for fc in o.animation_data.action.fcurves] for o in bpy.data.objects if o.animation_data and o.animation_data.action and o.type!='CAMERA'}
s.frame_set(1)
first={n:list(bpy.data.objects[n].location) for n in ['Gate leaf -1','Gate leaf 1','Gate reveal camera']}
s.frame_set(s.frame_end)
last={n:list(bpy.data.objects[n].location) for n in first}
print('SOURCE_INSPECT='+json.dumps({'mesh':mesh,'curves':curves,'first':first,'last':last,'frames':s.frame_end,'license':s['source_license']}))
'''


def run(*args):
  return subprocess.run(args, capture_output=True, text=True, timeout=90)


class SourceTests(unittest.TestCase):
  def setUp(self):
    self.temp = tempfile.TemporaryDirectory(prefix='gate-source-')
    self.root = Path(self.temp.name)
    self.recipe = json.loads((ROOT / 'scene.json').read_text())
    self.recipe.update(width=32, height=18, fps=2, seconds=2, openingStart=.25, openingEnd=1.25)
    self.config = self.root / 'scene.json'
    self.config.write_text(json.dumps(self.recipe))

  def tearDown(self):
    self.temp.cleanup()

  def build(self, output, *extra):
    return run(sys.executable, str(ROOT / 'build.py'), '--recipe', str(self.config), '--output', str(output), *extra)

  def inspect(self, source):
    result = run('blender', '-b', str(source), '--python-exit-code', '1', '--python-expr', INSPECT)
    self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
    return json.loads(next(line[len('SOURCE_INSPECT='):] for line in result.stdout.splitlines() if line.startswith('SOURCE_INSPECT=')))

  def test_render_reopen_decode_and_camera_only_source_edit(self):
    base = self.root / 'base'
    result = self.build(base)
    self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
    self.assertEqual(len(list((base / 'frames').glob('*.png'))), 4)
    movie = base / 'gate.mp4'
    self.assertTrue(movie.stat().st_size > 0)
    self.assertEqual(run('ffmpeg', '-v', 'error', '-i', str(movie), '-f', 'null', '-').returncode, 0)
    original_hash = hashlib.sha256(movie.read_bytes()).hexdigest()
    before = self.inspect(base / 'gate-reveal.blend')
    self.assertAlmostEqual(before['first']['Gate leaf 1'][0], .8, places=5)
    self.assertAlmostEqual(before['last']['Gate leaf 1'][0], 2.45, places=5)
    self.assertIn('CC0-1.0', before['license'])
    revised = copy.deepcopy(self.recipe)
    revised['cameraEnd'][0] += 1
    self.config.write_text(json.dumps(revised))
    edited = self.root / 'edited'
    result = self.build(edited, '--source-only')
    self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
    after = self.inspect(edited / 'gate-reveal.blend')
    self.assertEqual(before['mesh'], after['mesh'])
    self.assertEqual(before['curves'], after['curves'])
    self.assertEqual(before['first'], after['first'])
    self.assertAlmostEqual(after['last']['Gate reveal camera'][0] - before['last']['Gate reveal camera'][0], 1)
    self.assertEqual(hashlib.sha256(movie.read_bytes()).hexdigest(), original_hash)

  def test_missing_recipe_fails_without_creating_output(self):
    self.config.unlink()
    output = self.root / 'missing'
    self.assertNotEqual(self.build(output).returncode, 0)
    self.assertFalse(output.exists())

  def test_invalid_recipe_fails_before_blender(self):
    for change in [{'width':31}, {'fps':True}, {'seconds':float('nan')}, {'openingEnd':3},
                   {'cameraStart':[0, 3, 1]}, {'lookAt':[float('inf'), 0, 0]}]:
      with self.subTest(change=change):
        self.config.write_text(json.dumps(self.recipe | change))
        output = self.root / 'invalid'
        result = self.build(output)
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(output.exists())

  def test_existing_output_is_preserved(self):
    output = self.root / 'existing'; output.mkdir()
    note = output / 'author-edit'; note.write_text('keep')
    self.assertNotEqual(self.build(output).returncode, 0)
    self.assertEqual(note.read_text(), 'keep')


if __name__ == '__main__':
  unittest.main()
