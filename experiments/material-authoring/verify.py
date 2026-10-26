"""Reopen the saved author and consumer files with Blender; validate the contract."""
import argparse
import json
from pathlib import Path
import sys

import bpy


def verify(directory):
    recipe = json.loads((directory / 'recipe.json').read_text(encoding='utf-8'))
    bpy.ops.wm.open_mainfile(filepath=str(directory / 'author.blend'))
    for name in ('base', 'changed'):
        material = bpy.data.objects[f'author_{name}'].data.materials[0]
        nodes = material.node_tree.nodes
        brick = nodes['Shared brick structure']
        rough = nodes['Region roughness']
        assert abs(brick.inputs['Mortar Smooth'].default_value - 1.0) < 1e-6
        bump = next(n for n in nodes if n.type == 'BUMP')
        assert abs(bump.inputs['Distance'].default_value - 0.005) < 1e-6
        assert abs(brick.inputs['Mortar Size'].default_value - recipe[name]['mortar']) < 1e-6
        assert abs(rough.inputs['To Min'].default_value - recipe[name]['roughness']) < 1e-6
        assert rough.inputs['Value'].links[0].from_socket == brick.outputs['Fac']
        assert len(brick.outputs['Fac'].links) == 2  # Roughness and inverted height.
    assert bpy.data.objects['author_base'].data.materials[0] != bpy.data.objects['author_changed'].data.materials[0]
    pixels = {}
    for name in ('base', 'changed'):
        for channel in ('color', 'roughness', 'normal'):
            image = bpy.data.images.load(str(directory / f'{name}_{channel}.png'), check_existing=False)
            image.colorspace_settings.name = 'sRGB' if channel == 'color' else 'Non-Color'
            assert tuple(image.size) == (recipe['resolution'], recipe['resolution'])
            values = list(image.pixels)
            assert len(values) == recipe['resolution'] ** 2 * 4
            pixels[name, channel] = values
            if channel == 'roughness':
                gray = values[0::4]
                # The source uses only two region values, before texture filtering.
                low, high = sorted((recipe[name]['roughness'], 0.9))
                assert min(gray) >= low - 1 / 255 and max(gray) <= high + 1 / 255
                assert any(abs(value - recipe[name]['roughness']) <= 1 / 255 for value in gray)
                assert all(abs(r-g) < 1e-6 and abs(r-b) < 1e-6 for r,g,b in zip(values[0::4],values[1::4],values[2::4]))
            if channel == 'normal':
                x, y, z = [values[offset::4] for offset in range(3)]
                assert max(x) - min(x) > 0.1 and max(y) - min(y) > 0.1
                # A unit-length normal can still omit one side of every brick edge.
                assert all(min(axis) < 0.48 and max(axis) > 0.52 for axis in (x, y)), 'normal must retain both slopes on X and Y'
                assert min(z) >= 0.5
                assert all(abs((2*a-1)**2 + (2*b-1)**2 + (2*c-1)**2 - 1) < 0.025 for a,b,c in zip(x,y,z))
    structure_changed = recipe['base']['mortar'] != recipe['changed']['mortar']
    if not structure_changed:
        for channel in ('color', 'normal'):
            assert pixels['base', channel] == pixels['changed', channel]
    bpy.ops.wm.open_mainfile(filepath=str(directory / 'consumer.blend'))
    for object_name, preset in [('control', 'base'), ('target', 'changed')]:
        material = bpy.data.objects[object_name].data.materials[0]
        assert material.name == f'consumer_{preset}'
        textures = [n for n in material.node_tree.nodes if n.type == 'TEX_IMAGE']
        assert len(textures) == 3
        for texture in textures:
            image = texture.image
            assert image.filepath.startswith('//')
            assert Path(bpy.path.abspath(image.filepath)).is_file()
            assert Path(image.filepath).name.startswith(preset + '_')
            color = image.filepath.endswith('_color.png')
            assert image.colorspace_settings.name == ('sRGB' if color else 'Non-Color')
    for name in ('before', 'after', 'source'):
        image = bpy.data.images.load(str(directory / f'{name}.png'), check_existing=False)
        assert tuple(image.size) == (640, 320)
        rgb = list(image.pixels)[0::4]
        assert max(rgb) - min(rgb) > 0.1
    print('MATERIAL_VERIFY_OK', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
    verify(args.output.resolve())
