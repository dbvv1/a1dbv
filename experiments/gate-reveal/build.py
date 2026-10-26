"""Rebuild the original gate source, CPU frames and silent H264 delivery (MIT)."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent


def validate(recipe):
  required = {'fps', 'seconds', 'width', 'height', 'openingStart', 'openingEnd',
              'cameraStart', 'cameraEnd', 'lookAt'}
  if set(recipe) != required:
    raise ValueError('scene recipe keys do not match')
  for key in ['fps', 'width', 'height']:
    if type(recipe[key]) is not int or recipe[key] <= 0:
      raise ValueError(f'{key} must be a positive integer')
  if not (2 <= recipe['fps'] <= 30 and 32 <= recipe['width'] <= 1280 and 18 <= recipe['height'] <= 720):
    raise ValueError('example render budget exceeded')
  if recipe['width'] % 2 or recipe['height'] % 2:
    raise ValueError('H264 yuv420p requires even dimensions')
  for key in ['seconds', 'openingStart', 'openingEnd']:
    if type(recipe[key]) not in [int, float] or not math.isfinite(recipe[key]):
      raise ValueError(f'{key} must be finite')
  if not 0 <= recipe['openingStart'] < recipe['openingEnd'] < recipe['seconds'] <= 20:
    raise ValueError('invalid shot timing')
  if recipe['seconds'] * recipe['fps'] != round(recipe['seconds'] * recipe['fps']):
    raise ValueError('duration must contain a whole number of frames')
  for key in ['cameraStart', 'cameraEnd', 'lookAt']:
    p = recipe[key]
    if not isinstance(p, list) or len(p) != 3 or any(type(x) not in [int, float] or not math.isfinite(x) or abs(x) > 100 for x in p):
      raise ValueError(f'{key} must be three finite bounded coordinates')
  if any(recipe[key] == recipe['lookAt'] for key in ['cameraStart', 'cameraEnd']):
    raise ValueError('camera must differ from its target')


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--recipe', type=Path, default=ROOT / 'scene.json')
  parser.add_argument('--output', type=Path, default=ROOT / 'generated')
  parser.add_argument('--source-only', action='store_true')
  args = parser.parse_args()
  recipe = json.loads(args.recipe.read_text())
  validate(recipe)
  commands = ['blender'] + ([] if args.source_only else ['ffmpeg', 'ffprobe'])
  for command in commands:
    if not shutil.which(command):
      raise SystemExit(f'missing dependency: {command}')
  out = args.output.resolve()
  if out.exists():
    raise SystemExit('output already exists; use a new directory to preserve source edits')
  out.mkdir(parents=True)
  (out / 'frames').mkdir()
  (out / 'scene.json').write_text(json.dumps(recipe, indent=2) + '\n')
  command = ['blender', '-b', '--factory-startup', '--python-exit-code', '1', '--python', str(ROOT / 'author.py'), '--',
             '--recipe', str(out / 'scene.json'), '--output', str(out)]
  subprocess.run(command + ([] if args.source_only else ['--render']), check=True, timeout=3600)
  if args.source_only:
    return
  subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-framerate', str(recipe['fps']),
                  '-start_number', '1', '-i', str(out / 'frames' / 'frame-%04d.png'),
                  '-frames:v', str(round(recipe['seconds'] * recipe['fps'])), '-an',
                  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart',
                  str(out / 'gate.mp4')], check=True, timeout=120)
  metadata = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format',
                                                '-of', 'json', str(out / 'gate.mp4')]))
  streams = metadata['streams']
  assert len(streams) == 1 and streams[0]['codec_name'] == 'h264'
  assert int(streams[0]['nb_frames']) == round(recipe['seconds'] * recipe['fps'])
  print(json.dumps({'source': 'gate-reveal.blend', 'frames': int(streams[0]['nb_frames']),
                    'seconds': float(metadata['format']['duration']), 'bytes': (out / 'gate.mp4').stat().st_size,
                    'sha256': hashlib.sha256((out / 'gate.mp4').read_bytes()).hexdigest()}))


if __name__ == '__main__':
  main()
