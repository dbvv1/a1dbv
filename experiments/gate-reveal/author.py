"""Original CC0 scene and shot; script MIT. Run through build.py, not a template."""
import argparse
import json
from pathlib import Path
import sys
import bpy
from mathutils import Vector


def material(name, color, metallic=0):
  mat = bpy.data.materials.new(name)
  mat.diffuse_color = (*color, 1)
  mat.use_nodes = True
  node = mat.node_tree.nodes.get('Principled BSDF')
  node.inputs['Base Color'].default_value = (*color, 1)
  node.inputs['Metallic'].default_value = metallic
  node.inputs['Roughness'].default_value = .65
  return mat


def cube(name, location, size, mat, bevel=.08):
  bpy.ops.mesh.primitive_cube_add(size=1, location=location)
  obj = bpy.context.object
  obj.name = name
  obj.dimensions = size
  bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
  obj.data.materials.append(mat)
  if bevel:
    mod = obj.modifiers.new('Editable edge bevel', 'BEVEL')
    mod.width = bevel
    mod.segments = 2
    obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
  return obj


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument('--recipe', required=True)
  parser.add_argument('--output', required=True)
  parser.add_argument('--render', action='store_true')
  args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
  recipe = json.loads(Path(args.recipe).read_text())
  out = Path(args.output)
  bpy.ops.wm.read_factory_settings(use_empty=True)
  scene = bpy.context.scene
  scene.render.engine = 'CYCLES'
  scene.cycles.device = 'CPU'
  scene.cycles.samples = 24
  scene.cycles.use_denoising = False  # Some official builds lack OpenImageDenoise.
  scene.render.threads_mode = 'FIXED'
  scene.render.threads = 4
  scene.render.resolution_x = recipe['width']
  scene.render.resolution_y = recipe['height']
  scene.render.resolution_percentage = 100
  scene.render.fps = recipe['fps']
  scene.frame_start = 1
  scene.frame_end = round(recipe['seconds'] * recipe['fps'])
  scene.render.image_settings.file_format = 'PNG'
  scene.render.filepath = str(out / 'frames' / 'frame-')
  scene.view_settings.view_transform = 'AgX'
  scene.world = bpy.data.worlds.new('Dusk sky')
  scene.world.use_nodes = True
  scene.world.node_tree.nodes['Background'].inputs[0].default_value = (.17, .23, .35, 1)
  scene.world.node_tree.nodes['Background'].inputs[1].default_value = .55
  stone = material('Slate stone', (.15, .22, .28))
  trim = material('Warm gate trim', (.58, .39, .18), .3)
  ground = material('Moss ground', (.12, .22, .20))
  path = material('Sandstone route', (.43, .47, .38))
  door = material('Teal door', (.06, .30, .34), .25)
  glow = material('Route beacon', (.85, .42, .08), .15)
  cube('Ground', (0, 3, -.3), (22, 32, .6), ground)
  cube('Walkable route', (0, 3, .015), (3.2, 28, .03), path, 0)
  for side in [-1, 1]:
    cube(f'Wall {side}', (side * 5, 0, 2.0), (6.8, 1, 4), stone)
    cube(f'Tower {side}', (side * 2.1, 0, 2.5), (1, 1.6, 5), stone)
    cube(f'Tower cap {side}', (side * 2.1, 0, 5.1), (1.3, 1.9, .25), trim)
    gate = cube(f'Gate leaf {side}', (side * .8, 0, 1.8), (1.6, .38, 3.6), door)
    for sec, x in [(0, side * .8), (recipe['openingStart'], side * .8),
                   (recipe['openingEnd'], side * 2.45), (recipe['seconds'], side * 2.45)]:
      gate.location.x = x
      gate.keyframe_insert('location', frame=1 + sec * recipe['fps'])
    for row in range(6):
      cube(f'Route marker {side} {row}', (side * 2, row * 2 + 1.5, .2), (.35, .45, .4), trim)
  cube('Lintel', (0, 0, 4.2), (3.3, .9, .55), trim)
  cube('Beacon plinth', (0, 11, .3), (1.6, 1.6, .6), stone)
  bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=.7, location=(0, 11, 1.6))
  bpy.context.object.name = 'Destination crystal'
  bpy.context.object.scale = (.7, .7, 1.5)
  bpy.context.object.data.materials.append(glow)
  for x, y, scale in [(-6, 10, 3), (7, 13, 4), (-7, 18, 4.5)]:
    bpy.ops.mesh.primitive_cone_add(vertices=5, radius1=scale, depth=scale * 2, location=(x, y, scale))
    bpy.context.object.name = 'Background rock'
    bpy.context.object.data.materials.append(stone)
  bpy.ops.object.light_add(type='AREA', location=(-3, -4, 10))
  bpy.context.object.name = 'Key light'
  bpy.context.object.data.energy = 1800
  bpy.context.object.data.shape = 'DISK'
  bpy.context.object.data.size = 8
  bpy.ops.object.camera_add()
  camera = bpy.context.object
  camera.name = 'Gate reveal camera'
  camera.data.type = 'ORTHO'
  camera.data.ortho_scale = 15
  scene.camera = camera
  for frame, pos in [(1, recipe['cameraStart']), (scene.frame_end, recipe['cameraEnd'])]:
    camera.location = pos
    camera.rotation_euler = (Vector(recipe['lookAt']) - camera.location).to_track_quat('-Z', 'Y').to_euler()
    camera.keyframe_insert('location', frame=frame)
    camera.keyframe_insert('rotation_euler', frame=frame)
  # Keep an editable source with explicit shot metadata; generated output is not the source.
  scene['source_license'] = 'CC0-1.0; original procedural geometry/materials/camera/animation'
  scene['shot_id'] = 'gate-reveal-B'
  scene['recipe_json'] = json.dumps(recipe, sort_keys=True)
  scene.frame_set(1)
  bpy.ops.wm.save_as_mainfile(filepath=str(out / 'gate-reveal.blend'))
  # Verify the saved file, not just the live construction state.
  bpy.ops.wm.open_mainfile(filepath=str(out / 'gate-reveal.blend'))
  assert bpy.context.scene.frame_end == round(recipe['seconds'] * recipe['fps'])
  assert {'Gate leaf -1', 'Gate leaf 1', 'Gate reveal camera'} <= set(bpy.data.objects.keys())
  if args.render:
    bpy.ops.render.render(animation=True)
  print('GATE_SOURCE_REOPEN_PASS')


if __name__ == '__main__':
  main()
