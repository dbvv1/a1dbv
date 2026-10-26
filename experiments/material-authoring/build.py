"""Original brick node graph -> PBR maps -> two independent consumer panels."""
import argparse
import json
import math
import shutil
from pathlib import Path
import sys

import bpy
from mathutils import Vector


# This example deliberately uses a broad, shallow bevel that survives its bake budget.
BRICK_SCALE = 4.0
MORTAR_SMOOTH = 1.0
BUMP_DISTANCE = 0.005
MIN_EDGE_TEXELS = 2.0


def read_recipe(path):
    recipe = json.loads(path.read_text(encoding='utf-8'))
    if set(recipe) != {'resolution', 'base', 'changed'}:
        raise ValueError('recipe must contain resolution, base, changed')
    if type(recipe['resolution']) is not int or recipe['resolution'] not in (128, 256, 512):
        raise ValueError('resolution must be 128, 256 or 512')
    for name in ('base', 'changed'):
        values = recipe[name]
        if set(values) != {'mortar', 'roughness'}:
            raise ValueError('each preset must contain mortar and roughness')
        for key, bounds in [('mortar', (0.005, 0.08)), ('roughness', (0.05, 0.95))]:
            value = values[key]
            if type(value) not in (float, int) or not math.isfinite(value) or not bounds[0] <= value <= bounds[1]:
                raise ValueError(f'invalid {name}.{key}')
        edge_texels = values['mortar'] * MORTAR_SMOOTH / BRICK_SCALE * recipe['resolution']
        if edge_texels < MIN_EDGE_TEXELS:
            raise ValueError(f'{name}: bevel spans {edge_texels:.3f} texels; use at least {MIN_EDGE_TEXELS:g} by widening mortar or increasing resolution')
    return recipe


def blank_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = 16
    scene.cycles.use_denoising = False
    scene.cycles.seed = 42
    return scene


def source_material(name, preset):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes, links = material.node_tree.nodes, material.node_tree.links
    nodes.clear()
    uv = nodes.new('ShaderNodeTexCoord')
    brick = nodes.new('ShaderNodeTexBrick')
    brick.name = 'Shared brick structure'
    brick.inputs['Scale'].default_value = BRICK_SCALE
    brick.inputs['Brick Width'].default_value = 0.5
    brick.inputs['Row Height'].default_value = 0.25
    brick.inputs['Mortar Size'].default_value = preset['mortar']
    brick.inputs['Mortar Smooth'].default_value = MORTAR_SMOOTH
    brick.inputs['Color1'].default_value = (0.32, 0.075, 0.035, 1)
    brick.inputs['Color2'].default_value = (0.22, 0.04, 0.018, 1)
    brick.inputs['Mortar'].default_value = (0.13, 0.12, 0.10, 1)
    links.new(uv.outputs['UV'], brick.inputs['Vector'])
    # Brick Fac is mortar coverage: the same structure drives height and roughness.
    height = nodes.new('ShaderNodeMath'); height.operation = 'SUBTRACT'
    height.inputs[0].default_value = 1
    links.new(brick.outputs['Fac'], height.inputs[1])
    roughness = nodes.new('ShaderNodeMapRange'); roughness.name = 'Region roughness'
    roughness.inputs['From Min'].default_value = 0
    roughness.inputs['From Max'].default_value = 1
    roughness.inputs['To Min'].default_value = preset['roughness']
    roughness.inputs['To Max'].default_value = 0.9
    links.new(brick.outputs['Fac'], roughness.inputs['Value'])
    bump = nodes.new('ShaderNodeBump')
    bump.inputs['Distance'].default_value = BUMP_DISTANCE
    links.new(height.outputs[0], bump.inputs['Height'])
    shader = nodes.new('ShaderNodeBsdfPrincipled')
    shader.inputs['Metallic'].default_value = 0
    links.new(brick.outputs['Color'], shader.inputs['Base Color'])
    links.new(roughness.outputs['Result'], shader.inputs['Roughness'])
    links.new(bump.outputs['Normal'], shader.inputs['Normal'])
    output = nodes.new('ShaderNodeOutputMaterial')
    links.new(shader.outputs[0], output.inputs['Surface'])
    for node, location in [(uv, (-800, 100)), (brick, (-550, 100)), (height, (-300, -160)), (roughness, (-300, 160)), (bump, (-80, -160)), (shader, (160, 120)), (output, (470, 120))]:
        node.location = location
    material['mortar'] = preset['mortar']
    material['roughness'] = preset['roughness']
    return material, brick.outputs['Color'], roughness.outputs['Result'], shader, output


def bake_maps(obj, material_parts, destination, name, size, channels):
    material, color, roughness, shader, output = material_parts
    nodes, links = material.node_tree.nodes, material.node_tree.links
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True); bpy.context.view_layer.objects.active = obj
    target = nodes.new('ShaderNodeTexImage')
    emission = nodes.new('ShaderNodeEmission')
    for channel in channels:
        image = bpy.data.images.new(f'{name}_{channel}', width=size, height=size, alpha=False)
        image.colorspace_settings.name = 'sRGB' if channel == 'color' else 'Non-Color'
        target.image = image
        nodes.active = target
        if channel == 'normal':
            links.new(shader.outputs[0], output.inputs['Surface'])
            bpy.ops.object.bake(type='NORMAL', normal_space='TANGENT', margin=0)
        else:
            links.new(color if channel == 'color' else roughness, emission.inputs['Color'])
            links.new(emission.outputs[0], output.inputs['Surface'])
            bpy.ops.object.bake(type='EMIT', margin=0)
        image.filepath_raw = str(destination / f'{name}_{channel}.png')
        image.file_format = 'PNG'
        image.save()
    links.new(shader.outputs[0], output.inputs['Surface'])
    nodes.remove(emission); nodes.remove(target)


def consumer_material(directory, name):
    material = bpy.data.materials.new(f'consumer_{name}')
    material.use_nodes = True
    nodes, links = material.node_tree.nodes, material.node_tree.links
    shader = nodes.get('Principled BSDF')
    shader.inputs['Metallic'].default_value = 0
    for channel in ('color', 'roughness', 'normal'):
        texture = nodes.new('ShaderNodeTexImage')
        texture.image = bpy.data.images.load(str(directory / f'{name}_{channel}.png'))
        texture.image.colorspace_settings.name = 'sRGB' if channel == 'color' else 'Non-Color'
        texture.extension = 'REPEAT'
        if channel == 'normal':
            normal = nodes.new('ShaderNodeNormalMap')
            links.new(texture.outputs['Color'], normal.inputs['Color'])
            links.new(normal.outputs['Normal'], shader.inputs['Normal'])
        else:
            links.new(texture.outputs['Color'], shader.inputs['Base Color' if channel == 'color' else 'Roughness'])
    return material


def consumer_scene(directory, recipe):
    scene = blank_scene()
    scene.world = bpy.data.worlds.new('Fixed lighting')
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.05, 0.05, 0.05, 1)
    base, changed = [consumer_material(directory, n) for n in ('base', 'changed')]
    panels = []
    for name, x in [('control', -1.1), ('target', 1.1)]:
        bpy.ops.mesh.primitive_plane_add(size=2, location=(x, 0, 1), rotation=(math.pi / 2, 0, 0))
        obj = bpy.context.object; obj.name = name
        obj.data.materials.append(base); panels.append(obj)
    bpy.ops.object.camera_add(location=(0, -6.5, 2.4))
    camera = bpy.context.object
    camera.rotation_euler = (Vector((0, 0, 1)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
    camera.data.lens = 45; scene.camera = camera
    bpy.ops.object.light_add(type='AREA', location=(-2, -3, 4))
    light = bpy.context.object; light.data.energy = 450; light.data.shape = 'DISK'; light.data.size = 2
    light.rotation_euler = (Vector((0, 0, 1)) - light.location).to_track_quat('-Z', 'Y').to_euler()
    scene.render.resolution_x = 640; scene.render.resolution_y = 320; scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    for name in ('before', 'after'):
        if name == 'after':
            panels[1].data.materials[0] = changed
        scene.render.filepath = str(directory / f'{name}.png')
        bpy.ops.render.render(write_still=True)
    # Save portable references; generated files stay together.
    for image in bpy.data.images:
        if image.source == 'FILE':
            image.filepath = '//' + Path(image.filepath).name
    bpy.ops.wm.save_as_mainfile(filepath=str(directory / 'consumer.blend'))
    # Same camera, lights and objects: compare the authored surface to the PNG consumer.
    # Do not save this temporary source replacement into consumer.blend.
    for panel, preset in zip(panels, ('base', 'changed')):
        panel.data.materials[0] = source_material(f'preview_{preset}', recipe[preset])[0]
    scene.render.filepath = str(directory / 'source.png')
    bpy.ops.render.render(write_still=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--recipe', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
    recipe = read_recipe(args.recipe)  # Reject bad/missing inputs before creating output.
    output = args.output.resolve(); output.mkdir(parents=True, exist_ok=False)
    blank_scene()
    for index, name in enumerate(('base', 'changed')):
        bpy.ops.mesh.primitive_plane_add(size=2, location=(index * 3, 0, 0))
        obj = bpy.context.object; obj.name = f'author_{name}'
        parts = source_material(f'author_{name}', recipe[name]); obj.data.materials.append(parts[0])
        channels = ('color', 'roughness', 'normal')
        if name == 'changed' and recipe['changed']['mortar'] == recipe['base']['mortar']:
            # A roughness-only edit does not affect these source branches.
            channels = ('roughness',)
            for channel in ('color', 'normal'):
                shutil.copyfile(output / f'base_{channel}.png', output / f'changed_{channel}.png')
        bake_maps(obj, parts, output, name, recipe['resolution'], channels)
    bpy.ops.wm.save_as_mainfile(filepath=str(output / 'author.blend'))
    (output / 'recipe.json').write_text(json.dumps(recipe, indent=2) + '\n', encoding='utf-8')
    consumer_scene(output, recipe)
    print('MATERIAL_PRODUCTION_OK', bpy.app.version_string, flush=True)


if __name__ == '__main__':
    main()
