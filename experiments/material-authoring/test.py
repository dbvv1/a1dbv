"""Real Blender CPU regression: no mocked bpy, renderer, or output maps."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

HERE = Path(__file__).resolve().parent


class MaterialProductionTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temporary = tempfile.TemporaryDirectory(prefix='material-authoring-')
        cls.root = Path(cls.temporary.name)
        cls.output = cls.root / 'normal'
        cls.env = dict(os.environ, XDG_CONFIG_HOME=str(cls.root / 'config'), XDG_CACHE_HOME=str(cls.root / 'cache'))
        cls.env['BLENDER_USER_CONFIG'] = str(cls.root / 'config' / 'blender')
        cls.run_blender('build.py', '--recipe', HERE / 'recipe.json', '--output', cls.output)

    @classmethod
    def tearDownClass(cls):
        cls.temporary.cleanup()

    @classmethod
    def run_blender(cls, script, *args, succeeds=True):
        result = subprocess.run(['blender', '--background', '--factory-startup', '--threads', '2', '--python-exit-code', '1', '--python', str(HERE / script), '--', *map(str, args)], env=cls.env, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=120)
        if (result.returncode == 0) != succeeds:
            raise AssertionError(f'Unexpected Blender exit {result.returncode}:\n{result.stdout[-5000:]}')
        return result

    def test_saved_graph_maps_consumer_and_images(self):
        result = self.run_blender('verify.py', '--output', self.output)
        self.assertIn('MATERIAL_VERIFY_OK', result.stdout)
        for channel in ('color', 'normal', 'roughness'):
            self.assertNotEqual((self.output / f'base_{channel}.png').read_bytes(), (self.output / f'changed_{channel}.png').read_bytes())

    def test_roughness_only_preserves_color_and_normal(self):
        for size, mortar in [(256, 0.018), (64, 0.005)]:
            with self.subTest(size=size, mortar=mortar):
                recipe = json.loads((HERE / 'recipe.json').read_text())
                recipe['resolution'] = size
                recipe['base']['mortar'] = mortar
                recipe['changed'] = dict(recipe['base'], roughness=0.95)
                path = self.root / f'roughness-only-{size}.json'; path.write_text(json.dumps(recipe))
                out = self.root / f'roughness-only-{size}'
                self.run_blender('build.py', '--recipe', path, '--output', out)
                self.run_blender('verify.py', '--output', out)
                for channel in ('color', 'normal'):
                    self.assertEqual((out / f'base_{channel}.png').read_bytes(), (out / f'changed_{channel}.png').read_bytes())

    def test_missing_input_does_not_create_output(self):
        out = self.root / 'missing'
        self.run_blender('build.py', '--recipe', self.root / 'absent.json', '--output', out, succeeds=False)
        self.assertFalse(out.exists())

    def test_invalid_recipe_does_not_create_output(self):
        for value in (-0.1, float('nan'), True):
            with self.subTest(value=value):
                recipe = json.loads((HERE / 'recipe.json').read_text())
                recipe['changed']['roughness'] = value
                path = self.root / 'bad.json'; path.write_text(json.dumps(recipe))
                out = self.root / 'bad-output'
                self.run_blender('build.py', '--recipe', path, '--output', out, succeeds=False)
                self.assertFalse(out.exists())

    def test_existing_output_is_preserved(self):
        out = self.root / 'preserved'; out.mkdir()
        marker = out / 'keep.txt'; marker.write_text('keep')
        self.run_blender('build.py', '--recipe', HERE / 'recipe.json', '--output', out, succeeds=False)
        self.assertEqual(marker.read_text(), 'keep')
        self.assertEqual(list(out.iterdir()), [marker])

    def test_missing_map_fails_actual_consumer_verification(self):
        out = self.root / 'missing-map'; shutil.copytree(self.output, out)
        (out / 'changed_normal.png').unlink()
        self.run_blender('verify.py', '--output', out, succeeds=False)


if __name__ == '__main__':
    unittest.main()
