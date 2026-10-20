#!/usr/bin/env python3
"""Pinned local QA/export contract probe; not a model or engine quality test.

Supply original qa_metrics.py and export_tiled.py from the documented fixed
commit. No downloads, dependency installation or provider/engine invocation.
Pillow is needed only for the explicit probe, not module import/unit tests.
Exit 0: all task assertions passed; 1: probe failed; 2: invalid input/dependency.
Default artifacts are temporary; --artifacts requires a new or empty directory.
Caller-created R1/R2 preserve IDs, not an upstream migration implementation.
"""
import argparse
import copy
import hashlib
import json
from pathlib import Path
import platform
import sys
import tempfile
import types
import xml.etree.ElementTree as ET

COMMIT = '19dbb4d5b655f8c4c0c8f979dd89baeb10237b0a'
PINS = {
  'qa': '739738107dc579553a23023796b5dfa0330d3360b302312bfb5cafd67a76812d',
  'export': '19e88de9cbb19a41a9ec3a2c46a27d85eb5e0260a6bbd164f95c5f2144aeaac2'}
SCOPE = ('Synthetic local functions only; caller preserves IDs/pixels. '
         'TMJ is a uniform firstgid=1 example, not existing-map migration. '
         'No model, provider, Tiled editor or engine execution; not quality ranking.')


class InvalidInput(ValueError):
  pass


def verify_source(path, expected_hash):
  """Return checked bytes; execution uses these bytes, not a second file read."""
  try:
    data = Path(path).read_bytes()
  except OSError as error:
    raise InvalidInput('source unreadable: ' + type(error).__name__) from None
  if hashlib.sha256(data).hexdigest() != expected_hash:
    raise InvalidInput('source SHA-256 mismatch')
  return data


def load_verified(data, name):
  module = types.ModuleType(name)
  sys.modules[name] = module  # Required by upstream dataclasses.
  exec(compile(data, name + '.py', 'exec'), module.__dict__)
  return module


def report_base():
  return {'schema': 1, 'commit': COMMIT, 'source_sha256': dict(PINS),
          'scope': SCOPE, 'python': platform.python_version(),
          'upstream_reports': {}, 'task_assertions': []}


def semantic(element):
  """Ignore formatting-only tail whitespace, not XML attributes/children."""
  text = element.text or ''
  tail = element.tail or ''
  return (element.tag, element.attrib, text if text.strip() else '',
          [semantic(child) for child in element], tail if tail.strip() else '')


def run_probe(qa, exporter, output):
  try:
    from PIL import Image, ImageDraw, __version__ as pillow_version
  except ImportError:
    raise InvalidInput('Pillow is required for the explicit probe; not installed automatically') from None
  report = report_base()
  report['pillow'] = pillow_version
  checks = report['task_assertions']
  observations = report['upstream_reports']

  def check(name, condition):
    checks.append({'name': name, 'pass': bool(condition)})

  def observe(name, action):
    try:
      value = {'result': action()}
    except Exception as error:
      value = {'exception': type(error).__name__}  # Never expose absolute paths.
    observations[name] = value
    return value

  def save(name, image):
    image.save(output / name)
    with Image.open(output / name) as loaded:
      return loaded.copy()

  def rect(box):
    image = Image.new('RGBA', (16, 16), (0, 0, 0, 0))
    ImageDraw.Draw(image).rectangle(box, fill=(0, 0, 0, 255))
    return image

  def sheet(images):
    image = Image.new('RGBA', (16 * len(images), 16))
    for i, frame in enumerate(images):
      image.paste(frame, (16 * i, 0))
    return image

  palette = ['#000000', '#ffffff', '#ff0000', '#00ff00']
  black = save('black.png', Image.new('RGBA', (16, 16), (0, 0, 0, 255)))
  white = save('white.png', Image.new('RGBA', (16, 16), (255, 255, 255, 255)))
  bad = black.copy()
  ImageDraw.Draw(bad).rectangle((8, 0, 15, 15), fill=(255, 255, 255, 255))
  bad = save('bad.png', bad)
  alpha = black.copy()
  ImageDraw.Draw(alpha).rectangle((8, 0, 15, 15), fill=(0, 0, 0, 0))
  alpha = save('alpha.png', alpha)
  blank = save('blank.png', Image.new('RGBA', (16, 16)))
  normal = save('normal.png', rect((6, 4, 9, 11)))
  bob = save('bob.png', rect((6, 5, 9, 12)))
  narrow = save('narrow.png', rect((7, 4, 8, 11)))
  wide = save('wide.png', rect((0, 4, 15, 11)))
  for name, images, expected_fail in [
      ('tile_normal', [black], False), ('tile_bad', [bad], True),
      ('cross_tile_unchecked', [black, white], False),
      ('alpha_edge_unchecked', [alpha], False),
      ('mean_dilution', [bad] + [black] * 19, False)]:
    image = save(name + '.png', sheet(images))
    value = observe(name, lambda: qa.evaluate_tileset(image, palette, 16, len(images), len(images)))
    check(name + '_expected_gate', value['result']['hard_fail'] == expected_fail)
  for name, images, expected_fail in [
      ('animation_bob', [normal, bob, normal, bob], False),
      ('animation_duplicate', [narrow] * 4, False),
      ('animation_wide_f2', [narrow, narrow, wide, narrow], True),
      ('animation_wide_f1', [narrow, wide, narrow, narrow], True),
      ('animation_blank', [blank] * 4, False),
      ('animation_single', [normal], False)]:
    image = save(name + '.png', sheet(images))
    value = observe(name, lambda: qa.evaluate_animation(image, palette, 16, len(images)))
    check(name + '_expected_gate', value['result']['hard_fail'] == expected_fail)
  for name, image, expected_fail in [('sprite_normal', normal, False),
                                    ('sprite_narrow_baseline_fail', narrow, True)]:
    value = observe(name, lambda: qa.evaluate_sprite(image, palette))
    check(name + '_expected_gate', value['result']['hard_fail'] == expected_fail)
  check('normal_sprite_no_soft_fail', not observations['sprite_normal']['result']['soft_fail'])
  check('bob_drift_one', observations['animation_bob']['result']['metrics']['bbox_drift_y']['value'] == 1)
  check('cross_tile_seams_zero', observations['cross_tile_unchecked']['result']['metrics']['tile_seam_diffs_per_tile']['value'] == [0, 0])
  check('alpha_edge_seam_zero', observations['alpha_edge_unchecked']['result']['metrics']['tile_seam_diff_mean']['value'] == 0)
  dilution = observations['mean_dilution']['result']['metrics']
  check('bad_tile_diluted', dilution['tile_seam_diffs_per_tile']['value'][0] > 12 and dilution['tile_seam_diff_mean']['value'] <= 12)
  undersized = save('undersized.png', Image.new('RGBA', (1, 1)))
  for name, image, columns, count in [
      ('transparent_tile', blank, 1, 1), ('zero_tile_count', black, 1, 0),
      ('undersized_sheet', undersized, 2, 2)]:
    value = observe(name, lambda: qa.evaluate_tileset(image, palette, 16, columns, count))
    check(name + '_accepted_by_module', value['result']['hard_fail'] is False)
  for name, colour, metric in [
      ('out_of_palette_image', (0, 0, 255, 255), 'palette_fidelity'),
      ('semitransparent_image', (0, 0, 0, 128), 'alpha_crispness')]:
    image = save(name + '.png', Image.new('RGBA', (16, 16), colour))
    value = observe(name, lambda: qa.evaluate_sprite(image, palette))
    check(name + '_hard_fail', value['result']['hard_fail'] is True
          and value['result']['metrics'][metric]['value'] == 0)
  (output / 'malformed.png').write_bytes(b'not a PNG\n')
  for name, action, expected in [
      ('zero_frames', lambda: qa.evaluate_animation(normal, palette, 16, 0), 'IndexError'),
      ('zero_columns', lambda: qa.evaluate_tileset(black, palette, 16, 0, 1), 'ZeroDivisionError'),
      ('missing_image_argument', lambda: qa.evaluate_sprite(None, palette), 'AttributeError'),
      ('invalid_palette', lambda: qa.evaluate_sprite(normal, ['#zzzzzz']), 'ValueError'),
      ('missing_png', lambda: Image.open(output / 'missing.png'), 'FileNotFoundError'),
      ('malformed_png', lambda: Image.open(output / 'malformed.png'), 'UnidentifiedImageError')]:
    value = observe(name, action)
    check(name + '_expected_exception', value.get('exception') == expected)
  for name, values in {'tile_seam_diff_mean': (12, 12.0001),
                       'silhouette_iou_f0_f2': (.85, .8499),
                       'bbox_drift_x': (6, 7), 'bbox_drift_y': (3, 4),
                       'alpha_crispness': (.999, .9989)}.items():
    value = observe('boundary_' + name, lambda: [qa._check_gate(name, v) for v in values])
    check('boundary_' + name, value['result'] == [(True, 'hard'), (False, 'hard')])

  def export_round(label, tileset):
    tsx = output / (label + '.tsx')
    tmj = output / (label + '.tmj')
    exporter.write_tsx(tileset, tsx)
    exporter.write_tmj(exporter.build_tmj_example(tileset, tsx.name, 2, 2), tmj)
    root = ET.parse(tsx).getroot()
    data = json.loads(tmj.read_text())
    image = root.find('image')
    check(label + '_relative_image_exists', not Path(image.get('source')).is_absolute()
          and (output / image.get('source')).is_file())
    check(label + '_relative_tsx_resolves', data['tilesets'][0]['source'] == tsx.name)
    with Image.open(output / image.get('source')) as loaded:
      check(label + '_image_dimensions', loaded.size == (int(image.get('width')), int(image.get('height'))))
    check(label + '_map_example', data['tilesets'][0]['firstgid'] == 1
          and data['layers'][0]['data'] == [1] * 4)
    return root, data

  original = save('r0.png', sheet([normal, bob, normal, bob]))
  entries = [exporter.TileEntry(i, 'pose-' + str(i)) for i in range(4)]
  entries[0].animation = [exporter.AnimationFrame(i, 100) for i in range(4)]
  r0 = exporter.Tileset('fixture', 16, 4, 4, 'r0.png', 64, 16, entries)
  x0, m0 = export_round('r0', r0)
  r1 = copy.deepcopy(r0)
  r1.columns = r1.tile_count = 5
  r1.image_width = 80
  r1.image_filename = 'r1.png'
  r1.tiles.append(exporter.TileEntry(4, 'new-black'))
  expanded = Image.new('RGBA', (80, 16), (0, 0, 0, 255))
  expanded.paste(original, (0, 0))
  expanded = save('r1.png', expanded)
  x1, m1 = export_round('r1', r1)
  check('R1_old_pixels', expanded.crop((0, 0, 64, 16)).tobytes() == original.tobytes())
  check('R1_old_ids_properties_animation', [semantic(t) for t in x0.findall('tile')]
        == [semantic(t) for t in x1.findall('tile')[:4]])
  check('R1_appended_id', x1.get('tilecount') == '5'
        and x1.find("tile[@id='4']/properties/property").get('value') == 'new-black')
  check('R1_map_layer', m0['layers'] == m1['layers'])
  r2 = copy.deepcopy(r1)
  r2.tiles[0].animation[1].duration_ms = 175
  x2, m2 = export_round('r2', r2)
  check('R2_frame_ids', [f.get('tileid') for f in x2.findall('tile/animation/frame')] == ['0', '1', '2', '3'])
  check('R2_duration', [f.get('duration') for f in x2.findall('tile/animation/frame')] == ['100', '175', '100', '100'])
  check('R2_map_layer', m1['layers'] == m2['layers'])
  x2.find('tile/animation/frame[@tileid="1"]').set('duration', '100')
  check('R2_all_other_xml_retained', semantic(x2) == semantic(x1))
  for name, mutation, expected in [
      ('duplicate_id', lambda t: t.tiles.append(exporter.TileEntry(0, 'dup')), 'ValueError'),
      ('bad_dimensions', lambda t: setattr(t, 'image_width', 81), 'ValueError'),
      ('out_of_range_entry', lambda t: t.tiles.append(exporter.TileEntry(99, 'bad')), 'ValueError'),
      ('bad_animation_accepted', lambda t: setattr(t.tiles[0], 'animation', [exporter.AnimationFrame(99, -10)]), None),
      ('missing_image_accepted', lambda t: setattr(t, 'image_filename', 'missing.png'), None)]:
    candidate = copy.deepcopy(r2)
    mutation(candidate)
    value = observe(name, lambda: ET.tostring(exporter.build_tsx_tree(candidate).getroot(), encoding='unicode'))
    check(name + '_expected', value.get('exception') == expected and ('result' in value or expected is not None))
  check('bad_animation_serialized', 'tileid="99" duration="-10"' in observations['bad_animation_accepted']['result'])
  report['artifacts'] = {p.name: hashlib.sha256(p.read_bytes()).hexdigest()
                         for p in sorted(output.iterdir()) if p.is_file()}
  report['assertions_run'] = len(checks)
  report['passed'] = all(c['pass'] for c in checks)
  return report


def main(argv=None):
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--qa-source', required=True)
  parser.add_argument('--export-source', required=True)
  parser.add_argument('--artifacts', type=Path)
  args = parser.parse_args(argv)
  try:
    sources = {name: verify_source(path, PINS[name]) for name, path in
               [('qa', args.qa_source), ('export', args.export_source)]}
    if args.artifacts and args.artifacts.exists() and (not args.artifacts.is_dir() or any(args.artifacts.iterdir())):
      raise InvalidInput('artifacts directory must be new or empty')
    qa = load_verified(sources['qa'], 'pixel_contract_qa')
    exporter = load_verified(sources['export'], 'pixel_contract_export')
    if args.artifacts:
      args.artifacts.mkdir(parents=True, exist_ok=True)
      report = run_probe(qa, exporter, args.artifacts)
      (args.artifacts / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    else:
      with tempfile.TemporaryDirectory(prefix='pixel-contract-') as temp:
        report = run_probe(qa, exporter, Path(temp))
  except InvalidInput as error:
    print(json.dumps({'passed': False, 'error': str(error)}))
    return 2
  except Exception as error:
    print(json.dumps({'passed': False, 'error': 'probe failed: ' + type(error).__name__}))
    return 1
  print(json.dumps(report, indent=2))
  return 0 if report['passed'] else 1


if __name__ == '__main__':
  sys.exit(main())
