"""Real author import/render -> atlas -> clock/anchor consumer regression."""
import hashlib
import json
import math
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

from PIL import Image
from atlas import SpritePackage, pack

HERE = Path(__file__).resolve().parent
SOURCES = Path(os.environ.get('SPRITE_SOURCE_DIR', str(HERE / 'inputs'))).resolve()


def hashes(directory):
    return {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in directory.iterdir() if p.is_file()}


class SpriteSourceTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temporary = tempfile.TemporaryDirectory(prefix='sprite-source-')
        cls.root = Path(cls.temporary.name)
        cls.env = dict(os.environ, XDG_CONFIG_HOME=str(cls.root / 'config'), XDG_CACHE_HOME=str(cls.root / 'cache'))
        cls.source_hashes = hashes(SOURCES)
        cls.rendered = {}; cls.packages = {}
        for variant in ('blue', 'blue-long'):
            rendered = cls.root / (variant + '-frames')
            cls.run_render(variant, rendered)
            destination = cls.root / (variant + '-package')
            pack(rendered, destination)
            cls.rendered[variant] = rendered; cls.packages[variant] = destination
            if variant == 'blue':
                cls.base_before_revision = hashes(destination)

    @classmethod
    def tearDownClass(cls):
        cls.temporary.cleanup()

    @classmethod
    def run_render(cls, variant, output, *, source_dir=SOURCES, recipe=HERE / 'recipe.json', succeeds=True):
        result = subprocess.run(['blender', '--background', '--factory-startup', '--disable-autoexec', '--threads', '2', '--python-exit-code', '1', '--python', str(HERE / 'render.py'), '--', '--source-dir', str(source_dir), '--variant', variant, '--recipe', str(recipe), '--output', str(output)], env=cls.env, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=120)
        if (result.returncode == 0) != succeeds:
            raise AssertionError(f'Unexpected Blender exit {result.returncode}:\n{result.stdout[-4000:]}')
        return result

    def test_real_two_variants_keep_clock_pivot_ids_and_old_package(self):
        base, revised = [SpritePackage(self.packages[name]) for name in ('blue', 'blue-long')]
        self.assertEqual(base.pivot, revised.pivot)
        self.assertEqual(base.metadata['clips'], revised.metadata['clips'])
        self.assertEqual(base.metadata['rectangles'], revised.metadata['rectangles'])
        self.assertEqual(hashes(self.packages['blue']), self.base_before_revision)
        self.assertEqual(hashes(SOURCES), self.source_hashes)
        self.assertNotEqual(base.image.tobytes(), revised.image.tobytes())
        self.assertEqual({name: len(c['times']) for name,c in base.metadata['clips'].items()}, {'idle':12, 'walk':13, 'attack':15})
        self.assertEqual(len(base.metadata['rectangles']), 160)
        for name, package in [('blue', base), ('blue-long', revised)]:
            for clip in package.metadata['clips'].values():
                self.assertGreater(len({hashlib.sha256((self.rendered[name] / frame).read_bytes()).hexdigest() for frame in clip['directions']['right']}), 1)
                for direction in clip['directions'].values():
                    for frame in direction:
                        x,y,w,h = package.metadata['rectangles'][frame]
                        with Image.open(self.rendered[name] / frame) as original:
                            self.assertEqual(package.image.crop((x,y,x+w,y+h)).tobytes(), original.tobytes())

    def test_actual_consumer_clock_and_anchor(self):
        package = SpritePackage(self.packages['blue'])
        walk = package.metadata['clips']['walk']; attack = package.metadata['clips']['attack']
        self.assertEqual(package.sample('walk', 'down', 0)[0], package.sample('walk', 'down', walk['duration'])[0])
        self.assertEqual(package.sample('walk','down',walk['duration']-1e-8)[0], walk['directions']['down'][-1])
        for cycles in (0, 1, 2, 5, 9, 10, 11, 100, 1000):
            for index, time in enumerate(walk['times']):
                elapsed = cycles * walk['duration'] + time
                self.assertEqual(package.sample('walk','right',elapsed)[0], walk['directions']['right'][index])
                self.assertEqual(package.sample('walk','right',elapsed + 1e-8)[0], walk['directions']['right'][index])
                if elapsed > 0:
                    self.assertEqual(package.sample('walk','right',elapsed - 1e-8)[0], walk['directions']['right'][index-1])
        self.assertEqual(package.sample('walk','down',320/60)[0], walk['directions']['down'][0])
        self.assertEqual(package.sample('attack','left',attack['duration'])[0], attack['directions']['left'][-1])
        self.assertEqual(package.sample('attack','left',100)[0], attack['directions']['left'][-1])
        self.assertEqual(package.sample('attack','left',1e308)[0], attack['directions']['left'][-1])
        canvas = Image.new('RGBA',(256,128))
        selected = package.draw(canvas,(80,112),'attack','right',.42)
        position = tuple(round(a-p) for a,p in zip((80,112),package.pivot))
        x,y,w,h = package.metadata['rectangles'][selected]
        expected_alpha = package.image.crop((x,y,x+w,y+h)).getchannel('A')
        self.assertEqual(canvas.crop((position[0],position[1],position[0]+w,position[1]+h)).getchannel('A').tobytes(),expected_alpha.tobytes())
        for value in (-1, math.inf, math.nan, 1e308):
            with self.assertRaises(ValueError):
                package.sample('walk','down',value)

    def test_missing_or_changed_source_fails_before_output(self):
        inputs = self.root / 'bad-inputs'; inputs.mkdir()
        for name in ('missing','changed'):
            if name == 'changed':
                (inputs / 'blue.glb').write_bytes(b'not the locked source')
            out = self.root / ('bad-source-' + name)
            self.run_render('blue',out,source_dir=inputs,succeeds=False)
            self.assertFalse(out.exists())

    def test_clipping_does_not_emit_completion_manifest(self):
        recipe = json.loads((HERE/'recipe.json').read_text())
        recipe['camera']['ortho_scale'] = 1
        path = self.root/'clipping.json'; path.write_text(json.dumps(recipe))
        out = self.root/'clipped'
        result = self.run_render('blue',out,recipe=path,succeeds=False)
        self.assertIn('exceeds fixed canvas',result.stdout)
        self.assertFalse((out/'frames.json').exists())

    def test_missing_frame_refuses_pack(self):
        rendered = self.root/'incomplete'; shutil.copytree(self.rendered['blue'],rendered)
        next(rendered.glob('*.png')).unlink()
        out = self.root/'incomplete-package'
        with self.assertRaises(FileNotFoundError):
            pack(rendered,out)
        self.assertFalse(out.exists())

    def test_corrupt_atlas_clock_and_rectangle_refuse_consumption(self):
        for case in ('atlas','clock','rectangle','schema'):
            with self.subTest(case=case):
                out=self.root/('bad-package-'+case); shutil.copytree(self.packages['blue'],out)
                metadata=json.loads((out/'sprites.json').read_text())
                if case=='atlas':
                    (out/'atlas.png').write_bytes(b'broken')
                elif case=='clock':
                    metadata['clips']['walk']['times'][1]=0
                elif case=='rectangle':
                    next(iter(metadata['rectangles'].values()))[0]=-1
                else:
                    metadata['schema']=99
                (out/'sprites.json').write_text(json.dumps(metadata))
                with self.assertRaises(ValueError):
                    SpritePackage(out)

    def test_finite_outside_canvas_pivot_remains_supported(self):
        out = self.root / 'outside-pivot'
        shutil.copytree(self.packages['blue'], out)
        metadata = json.loads((out / 'sprites.json').read_text())
        metadata['pivot_px'] = [-8, 100]
        (out / 'sprites.json').write_text(json.dumps(metadata))
        package = SpritePackage(out)
        canvas = Image.new('RGBA', (256, 256))
        package.draw(canvas, (80, 160), 'walk', 'right', .42)
        self.assertIsNotNone(canvas.getbbox())
        self.assertEqual(package.pivot, [-8, 100])

    def test_bad_pivot_and_missing_actions_refuse_loading(self):
        cases = {
            'nan-pivot': lambda m: m.update(pivot_px=[math.nan, 83]),
            'short-pivot': lambda m: m.update(pivot_px=[48]),
            'bool-pivot': lambda m: m.update(pivot_px=[True, 83]),
            'bad-size': lambda m: m.update(size=0),
            'empty-clips': lambda m: m.update(clips={}),
            'missing-direction': lambda m: m['clips']['walk']['directions'].pop('right'),
        }
        for name, mutate in cases.items():
            with self.subTest(name=name):
                out = self.root / name
                shutil.copytree(self.packages['blue'], out)
                metadata = json.loads((out / 'sprites.json').read_text())
                mutate(metadata)
                (out / 'sprites.json').write_text(json.dumps(metadata))
                with self.assertRaises(ValueError):
                    SpritePackage(out)

    def test_existing_outputs_are_not_overwritten(self):
        out = self.root/'preserved'; out.mkdir(); (out/'keep.txt').write_text('keep')
        before = hashes(out)
        self.run_render('blue',out,succeeds=False)
        with self.assertRaises(FileExistsError):
            pack(self.rendered['blue'],out)
        self.assertEqual(hashes(out),before)


if __name__ == '__main__':
    unittest.main()
