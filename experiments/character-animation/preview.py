"""Render Three's already-skinned vertices; never replay the source animation in Blender."""
import argparse
import json
import math
from pathlib import Path
import sys

import bpy
from mathutils import Vector

parser = argparse.ArgumentParser()
parser.add_argument('--input', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
data = json.loads(args.input.read_text())
if data.get('version') != 1 or data.get('columns') != 4 or data.get('rows') != 4 or len(data.get('poses', [])) != 16:
    raise ValueError('expected the fixed 4x4 pose delivery')
if args.output.exists():
    raise FileExistsError('refuse to overwrite preview')
# Validate all geometry before creating a scene or an output.
for pose in data['poses']:
    for mesh in pose['meshes']:
        points, indices = mesh['positions'], mesh['indices']
        if not points or any(len(p) != 3 or not all(isinstance(x, (int, float)) and math.isfinite(x) for x in p) for p in points):
            raise ValueError('invalid positions')
        if len(indices) % 3 or any(type(i) is not int or not 0 <= i < len(points) for i in indices):
            raise ValueError('invalid triangle indices')
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 32
scene.cycles.use_denoising = False
scene.cycles.seed = 42
scene.world = bpy.data.worlds.new('Background')
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.12, 0.12, 0.12, 1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.7
materials = {}
for pose in data['poses']:
    offset = Vector(((pose['column'] - 1.5) * 2.25, 0, (3 - pose['row']) * 2.65))
    for source in pose['meshes']:
        # glTF/Three Y-up -> Blender Z-up, retaining the actual deformed mesh.
        points = [Vector((x, -z, y)) + offset for x, y, z in source['positions']]
        triangles = [source['indices'][i:i+3] for i in range(0, len(source['indices']), 3)]
        mesh = bpy.data.meshes.new(source['name']); mesh.from_pydata(points, [], triangles); mesh.update()
        obj = bpy.data.objects.new(source['name'], mesh); scene.collection.objects.link(obj)
        key = tuple(source['color']) + (source['roughness'], source['metalness'])
        if key not in materials:
            mat = bpy.data.materials.new('Source surface'); mat.use_nodes = True
            shader = mat.node_tree.nodes['Principled BSDF']
            shader.inputs['Base Color'].default_value = (*source['color'], 1)
            shader.inputs['Roughness'].default_value = source['roughness']
            shader.inputs['Metallic'].default_value = source['metalness']
            materials[key] = mat
        obj.data.materials.append(materials[key])
    curve = bpy.data.curves.new('Label', 'FONT'); curve.body = pose['label']; curve.align_x = 'CENTER'; curve.size = 0.16
    label = bpy.data.objects.new('Label', curve); scene.collection.objects.link(label)
    label.location = offset + Vector((0, -0.1, -0.3)); label.rotation_euler.x = math.pi / 2
bpy.ops.object.camera_add(location=(4, -18, 8))
camera = bpy.context.object; camera.rotation_euler = (Vector((0, 0, 5)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
camera.data.type = 'ORTHO'; camera.data.ortho_scale = 11.8; scene.camera = camera
bpy.ops.object.light_add(type='AREA', location=(-3, -6, 12))
light = bpy.context.object; light.data.energy = 1800; light.data.size = 10
light.rotation_euler = (Vector((0, 0, 5)) - light.location).to_track_quat('-Z', 'Y').to_euler()
scene.render.resolution_x = 1024; scene.render.resolution_y = 1152; scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'; scene.render.filepath = str(args.output.resolve())
bpy.ops.render.render(write_still=True)
print('THREE_POSE_PREVIEW_OK', flush=True)
