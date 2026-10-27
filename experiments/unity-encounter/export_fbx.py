"""Blender-side export of the fixed original source; no Unity or importer claims."""
import argparse
import json
from pathlib import Path
import sys
import bpy

ACTIONS = {'idle', 'walk', 'attack', 'hurt', 'death'}


def describe():
  rigs = [o for o in bpy.context.scene.objects if o.type == 'ARMATURE']
  if len(rigs) != 1 or len(rigs[0].data.bones) != 15:
    raise ValueError('expected the fixed 15-bone source rig')
  names = {a.name for a in bpy.data.actions}
  if not {'idle', 'walk', 'attack'} <= names or not names <= ACTIONS:
    raise ValueError('unexpected or missing source actions')
  mats = []
  for m in bpy.data.materials:
    nodes = [n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'] if m.use_nodes else []
    if len(nodes) != 1 or any(n.type == 'TEX_IMAGE' for n in m.node_tree.nodes):
      raise ValueError('this exporter expects the fixed constant Principled materials')
    n = nodes[0]
    for key in ('Base Color', 'Roughness', 'Metallic'):
      if n.inputs[key].is_linked:
        raise ValueError('linked material inputs need a separate bake, not a guessed FBX transfer')
    mats.append({'name':m.name, 'color':list(n.inputs['Base Color'].default_value),
                 'roughness':n.inputs['Roughness'].default_value, 'metallic':n.inputs['Metallic'].default_value})
  return {'colorSpace':'scene-linear', 'fps':bpy.context.scene.render.fps / bpy.context.scene.render.fps_base,
    'materials':mats,
    'meshes':[{'name':o.name, 'materials':[s.material.name for s in o.material_slots]}
              for o in bpy.context.scene.objects if o.type == 'MESH'],
    'actions':[{'name':a.name,'firstFrame':float(a.frame_range[0]),'lastFrame':float(a.frame_range[1])}
               for a in bpy.data.actions]}


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument('--input', type=Path, required=True)
  parser.add_argument('--output', type=Path, required=True)
  args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
  if not args.input.is_file(): raise FileNotFoundError(args.input)
  if args.output.exists(): raise FileExistsError('use a fresh export directory')
  bpy.ops.wm.open_mainfile(filepath=str(args.input.resolve()))
  data = describe()  # Complete source checks before output is created.
  args.output.mkdir(parents=True)
  destination = args.output / (args.input.stem + '.fbx')
  bpy.ops.export_scene.fbx(filepath=str(destination.resolve()), object_types={'ARMATURE','MESH'},
    add_leaf_bones=False, bake_anim=True, bake_anim_use_all_actions=True,
    bake_anim_use_nla_strips=False, bake_anim_step=1, bake_anim_simplify_factor=0,
    axis_forward='-Z', axis_up='Y', apply_unit_scale=True)
  (args.output / (args.input.stem + '.source.json')).write_text(json.dumps(data, indent=2)+'\n')
  print('FBX_SOURCE_EXPORTED', destination.name, 'Blender', bpy.app.version_string)


if __name__ == '__main__': main()
