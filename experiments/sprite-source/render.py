"""Render the fixed CC0 Beacon Guard GLBs to consistently anchored sprite frames."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector


def read_inputs(source, recipe_path, variant):
    recipe = json.loads(recipe_path.read_text(encoding='utf-8'))
    expected = recipe['sources'][variant]
    if hashlib.sha256(source.read_bytes()).hexdigest() != expected:
        raise ValueError('source SHA-256 does not match the locked author asset')
    if type(recipe['size']) is not int or not 32 <= recipe['size'] <= 256:
        raise ValueError('size must be an integer between 32 and 256')
    if type(recipe['sample_fps']) not in (int, float) or not math.isfinite(recipe['sample_fps']) or not 1 <= recipe['sample_fps'] <= 60:
        raise ValueError('sample_fps must be in [1, 60]')
    if set(recipe['clips']) != {'idle', 'walk', 'attack'} or len(recipe['directions']) != 4:
        raise ValueError('this example needs the three source clips and four directions')
    return recipe


def scene_for(source, recipe):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'; scene.cycles.device = 'CPU'
    scene.cycles.samples = 16; scene.cycles.use_denoising = False; scene.cycles.seed = 42
    scene.render.resolution_x = scene.render.resolution_y = recipe['size']
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'; scene.render.image_settings.color_mode = 'RGBA'
    scene.render.film_transparent = True; scene.render.fps = 30
    scene.world = bpy.data.worlds.new('Fixed studio')
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value = (0.18, 0.21, 0.25, 1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value = 0.7
    bpy.ops.import_scene.gltf(filepath=str(source), disable_bone_shape=True)
    imported = set(scene.objects)
    rigs = [obj for obj in imported if obj.type == 'ARMATURE']
    if len(rigs) != 1 or len(rigs[0].data.bones) != 15:
        raise ValueError('expected the fixed 15-bone source')
    rig = rigs[0]; rig.animation_data.use_nla = False
    actions = {action.name.removesuffix('_GuardRig'): action for action in bpy.data.actions}
    if set(actions) != set(recipe['clips']):
        raise ValueError('source actions do not match the delivery contract')
    heading = bpy.data.objects.new('Sprite heading', None); scene.collection.objects.link(heading)
    for obj in imported:
        if obj.parent not in imported:
            matrix = obj.matrix_world.copy(); obj.parent = heading; obj.matrix_world = matrix
    spec = recipe['camera']
    bpy.ops.object.camera_add(location=spec['position'])
    camera = bpy.context.object
    camera.rotation_euler = (Vector(spec['target']) - camera.location).to_track_quat('-Z', 'Y').to_euler()
    camera.data.type = 'ORTHO'; camera.data.ortho_scale = spec['ortho_scale']; scene.camera = camera
    bpy.ops.object.light_add(type='AREA', location=(-3, -4, 7))
    light = bpy.context.object; light.data.energy = 600; light.data.size = 5
    light.rotation_euler = (Vector(spec['target']) - light.location).to_track_quat('-Z', 'Y').to_euler()
    bpy.context.view_layer.update()
    point = world_to_camera_view(scene, camera, Vector((0, 0, 0)))
    pivot = [point.x * recipe['size'], (1 - point.y) * recipe['size']]
    return scene, rig, actions, heading, imported, pivot


def check_frame_bounds(scene, objects, size):
    # Reject clipping instead of recentering every pose and destroying the foot anchor.
    deps = bpy.context.evaluated_depsgraph_get()
    for obj in objects:
        if obj.type != 'MESH':
            continue
        evaluated = obj.evaluated_get(deps)
        for vertex in evaluated.data.vertices:
            p = world_to_camera_view(scene, scene.camera, evaluated.matrix_world @ vertex.co)
            if not (2 / size <= p.x <= 1 - 2 / size and 2 / size <= p.y <= 1 - 2 / size and p.z > 0):
                raise ValueError(f'{obj.name} exceeds fixed canvas at frame {scene.frame_current_final}: ({p.x:.4f}, {p.y:.4f}); enlarge the common camera budget, not one frame')


def render(source, recipe, variant, output):
    scene, rig, actions, heading, objects, pivot = scene_for(source, recipe)
    output.mkdir(parents=True, exist_ok=False)
    manifest = {'schema': 1, 'variant': variant, 'source_sha256': recipe['sources'][variant],
                'size': recipe['size'], 'pivot_px': pivot, 'pivot_origin': 'top-left',
                'source_fps': 30, 'sample_fps_target': recipe['sample_fps'], 'clips': {}}
    for clip, settings in recipe['clips'].items():
        rig.animation_data.action = actions[clip]
        first, last = map(float, actions[clip].frame_range)
        duration = (last - first) / scene.render.fps
        if duration <= 0:
            raise ValueError('clip has no duration')
        intervals = max(1, math.ceil(duration * recipe['sample_fps']))
        count = intervals if settings['loop'] else intervals + 1
        times = [index * duration / intervals for index in range(count)]
        clip_data = {'duration': duration, 'loop': settings['loop'], 'times': times, 'directions': {}}
        for direction, degrees in recipe['directions'].items():
            heading.rotation_euler[2] = math.radians(degrees)
            frames = []
            for index, time in enumerate(times):
                frame = first + time * scene.render.fps
                scene.frame_set(math.floor(frame), subframe=frame % 1)
                check_frame_bounds(scene, objects, recipe['size'])
                name = f'{clip}-{direction}-{index:03}.png'
                scene.render.filepath = str(output / name)
                bpy.ops.render.render(write_still=True)
                frames.append(name)
            clip_data['directions'][direction] = frames
        manifest['clips'][clip] = clip_data
    (output / 'frames.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    print('SPRITE_RENDER_OK', variant, sum(len(v) for c in manifest['clips'].values() for v in c['directions'].values()), flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-dir', type=Path, required=True)
    parser.add_argument('--variant', choices=['blue', 'blue-long'], required=True)
    parser.add_argument('--recipe', type=Path, default=Path(__file__).with_name('recipe.json'))
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
    source = (args.source_dir / (args.variant + '.glb')).resolve()
    recipe = read_inputs(source, args.recipe, args.variant)
    render(source, recipe, args.variant, args.output.resolve())


if __name__ == '__main__':
    main()
