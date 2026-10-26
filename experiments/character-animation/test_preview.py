"""Real Node sample output -> Blender CPU preview, including failure and missing inputs."""
import json
import os
from pathlib import Path
import struct
import subprocess
import tempfile
import unittest

HERE = Path(__file__).resolve().parent

class PreviewTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temporary = tempfile.TemporaryDirectory(prefix='character-preview-')
        cls.root = Path(cls.temporary.name)
        cls.delivery = cls.root / 'poses'
        subprocess.run(['node', str(HERE / 'sample.mjs'), str(cls.delivery)], cwd=HERE, check=True, timeout=30)
        cls.env = dict(os.environ, XDG_CONFIG_HOME=str(cls.root / 'config'), XDG_CACHE_HOME=str(cls.root / 'cache'))

    @classmethod
    def tearDownClass(cls):
        cls.temporary.cleanup()

    def run_preview(self, source, output, succeeds):
        result = subprocess.run(['blender', '--background', '--factory-startup', '--disable-autoexec', '--threads', '2', '--python-exit-code', '1', '--python', str(HERE / 'preview.py'), '--', '--input', str(source), '--output', str(output)], env=self.env, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=120)
        self.assertEqual(result.returncode == 0, succeeds, result.stdout[-2500:])
        return result

    def test_real_skinned_delivery_renders_cpu_image(self):
        output = self.root / 'render.png'
        result = self.run_preview(self.delivery / 'poses.json', output, True)
        self.assertIn('THREE_POSE_PREVIEW_OK', result.stdout)
        raw = output.read_bytes()
        self.assertEqual(raw[:8], b'\x89PNG\r\n\x1a\n')
        self.assertEqual(struct.unpack('>II', raw[16:24]), (1024, 1152))

    def test_missing_input_fails_without_output(self):
        output = self.root / 'missing.png'
        self.run_preview(self.root / 'absent.json', output, False)
        self.assertFalse(output.exists())

    def test_bad_mesh_fails_without_output(self):
        data = json.loads((self.delivery / 'poses.json').read_text())
        data['poses'][0]['meshes'][0]['indices'][0] = -1
        source = self.root / 'bad.json'; source.write_text(json.dumps(data))
        output = self.root / 'bad.png'
        result = self.run_preview(source, output, False)
        self.assertIn('invalid triangle indices', result.stdout)
        self.assertFalse(output.exists())

    def test_existing_image_and_sample_directory_are_preserved(self):
        output = self.root / 'keep.png'; output.write_bytes(b'keep')
        self.run_preview(self.delivery / 'poses.json', output, False)
        self.assertEqual(output.read_bytes(), b'keep')
        before = (self.delivery / 'poses.json').read_bytes()
        result = subprocess.run(['node', str(HERE / 'sample.mjs'), str(self.delivery)], text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=30)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual((self.delivery / 'poses.json').read_bytes(), before)

if __name__ == '__main__':
    unittest.main()
