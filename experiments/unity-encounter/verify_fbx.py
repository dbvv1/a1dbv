"""Blender source/FBX bounds comparison, not Unity import, pose quality or build proof."""
import argparse
import json
from pathlib import Path
import sys
import bpy

EXPECTED = {'idle', 'walk', 'attack', 'hurt', 'death'}


def canonical(name):
  result = name.split('|')[-1]
  if result not in EXPECTED:
    raise ValueError('unrecognized action/take: ' + name)
  return result


def collect():
  rigs = [o for o in bpy.context.scene.objects if o.type == 'ARMATURE']
  if len(rigs) != 1: raise ValueError('expected one rig')
  rig = rigs[0]
  bones = {b.name:[v for row in b.matrix_local for v in row] for b in rig.data.bones}
  result = {}
  for action in bpy.data.actions:
    name = canonical(action.name)
    if name in result: raise ValueError('duplicate canonical action: ' + name)
    rig.animation_data.action = action
    frames = {}
    for frame in range(int(action.frame_range[0]), int(action.frame_range[1]) + 1):
      bpy.context.scene.frame_set(frame); bpy.context.view_layer.update()
      deps = bpy.context.evaluated_depsgraph_get(); objects = {}
      for obj in bpy.context.scene.objects:
        if obj.type != 'MESH': continue
        evaluated = obj.evaluated_get(deps); mesh = evaluated.to_mesh()
        try:
          vertices = [evaluated.matrix_world @ v.co for v in mesh.vertices]
          objects[obj.name] = [min(v[i] for v in vertices) for i in range(3)] + [max(v[i] for v in vertices) for i in range(3)]
        finally: evaluated.to_mesh_clear()
      frames[frame] = objects
    result[name] = frames
  return result, bones


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument('--source', type=Path, required=True)
  parser.add_argument('--fbx', type=Path, required=True)
  parser.add_argument('--report', type=Path, required=True)
  parser.add_argument('--amber', type=Path)
  args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
  if args.report.exists(): raise FileExistsError('report exists')
  for path in (args.source, args.fbx):
    if not path.is_file(): raise FileNotFoundError(path)
  bpy.ops.wm.open_mainfile(filepath=str(args.source.resolve()))
  source, bones = collect()
  bpy.ops.wm.read_factory_settings(use_empty=True)
  bpy.ops.import_scene.fbx(filepath=str(args.fbx.resolve()))
  imported_names = [a.name for a in bpy.data.actions]
  imported, imported_bones = collect()
  if set(source) != set(imported) or set(bones) != set(imported_bones): raise ValueError('actions/bones changed')
  errors = {}
  for name, frames in source.items():
    if set(frames) != set(imported[name]): raise ValueError('frame range changed: ' + name)
    for frame, objects in frames.items():
      if set(objects) != set(imported[name][frame]): raise ValueError('mesh identity changed')
    errors[name] = max(abs(v - w) for frame, objects in frames.items() for obj, values in objects.items()
                       for v, w in zip(values, imported[name][frame][obj]))
  if max(errors.values()) > 1e-5: raise ValueError('world bounds exceed fixed-source tolerance')
  report = {'blender':bpy.app.version_string,'bone_count':len(bones),
    'source_actions':list(source),'roundtrip_action_names':imported_names,
    'sample_count':sum(len(frames) for frames in source.values()),'max_world_bounds_error_m':errors,
    'scope':'Blender source/FBX bounds only; not exact surface equivalence or Unity import/render/Player proof'}
  if args.amber:
    bpy.ops.wm.open_mainfile(filepath=str(args.amber.resolve()))
    _, amber = collect()
    if bones != amber: raise ValueError('blue/amber rest matrices differ')
    report['blue_amber_rest_matrices_exact'] = True
  args.report.write_text(json.dumps(report, indent=2)+'\n')
  print('FBX_SOURCE_ROUNDTRIP_OK', json.dumps(report))


if __name__ == '__main__': main()
