"""Pack rendered frames and consume their actual times/foot pivots, with Pillow."""
import argparse
from bisect import bisect_right
import hashlib
import json
import math
from pathlib import Path

from PIL import Image


def pack(rendered, output):
    frames = json.loads((rendered / 'frames.json').read_text(encoding='utf-8'))
    size = frames['size']; names = []
    for clip in frames['clips'].values():
        for direction in clip['directions'].values():
            names.extend(direction)
    if len(set(names)) != len(names):
        raise ValueError('duplicate frame identity')
    images = {}
    for name in names:
        if Path(name).name != name:
            raise ValueError('frames must be local basenames')
        with Image.open(rendered / name) as source:
            source.load()
            if source.size != (size, size) or source.mode != 'RGBA':
                raise ValueError('frame size or alpha format mismatch')
            alpha = source.getchannel('A'); bounds = alpha.getbbox()
            if bounds is None or min(bounds[0], bounds[1], size-bounds[2], size-bounds[3]) < 2:
                raise ValueError('empty or clipped frame')
            images[name] = source.copy()
    columns = 16; stride = size + 4
    sheet = Image.new('RGBA', (columns * stride, math.ceil(len(names) / columns) * stride))
    rectangles = {}
    for index, name in enumerate(names):
        x, y = (index % columns) * stride + 2, (index // columns) * stride + 2
        sheet.paste(images[name], (x, y))
        rectangles[name] = [x, y, size, size]
    output.mkdir(parents=True, exist_ok=False)
    sheet.save(output / 'atlas.png')
    frames['atlas'] = {'file': 'atlas.png', 'size': list(sheet.size), 'sha256': hashlib.sha256((output / 'atlas.png').read_bytes()).hexdigest()}
    frames['rectangles'] = rectangles
    (output / 'sprites.json').write_text(json.dumps(frames, indent=2) + '\n', encoding='utf-8')
    print('SPRITE_PACK_OK', frames['variant'], len(names))


class SpritePackage:
    def __init__(self, directory):
        self.metadata = json.loads((directory / 'sprites.json').read_text(encoding='utf-8'))
        if self.metadata['schema'] != 1 or self.metadata['atlas']['file'] != 'atlas.png':
            raise ValueError('unsupported sprite package')
        info = self.metadata['atlas']
        path = directory / info['file']
        if hashlib.sha256(path.read_bytes()).hexdigest() != info['sha256']:
            raise ValueError('atlas bytes do not match metadata')
        with Image.open(path) as image:
            if image.mode != 'RGBA' or list(image.size) != info['size']:
                raise ValueError('atlas format/size mismatch')
            self.image = image.copy()
        self.pivot = self.metadata['pivot_px']
        if self.metadata['pivot_origin'] != 'top-left':
            raise ValueError('unexpected pivot origin')
        for clip in self.metadata['clips'].values():
            times = clip['times']; duration = clip['duration']
            if not math.isfinite(duration) or duration <= 0 or not times or times[0] != 0 or any(not math.isfinite(t) for t in times) or any(a >= b for a,b in zip(times,times[1:])):
                raise ValueError('invalid clip clock')
            if (clip['loop'] and times[-1] >= duration) or (not clip['loop'] and times[-1] != duration):
                raise ValueError('loop/terminal sample contract mismatch')
            for names in clip['directions'].values():
                if len(names) != len(times):
                    raise ValueError('frame count does not match clock')
                for name in names:
                    x,y,w,h = self.metadata['rectangles'][name]
                    if w != self.metadata['size'] or h != w or min(x,y) < 0 or x+w > self.image.width or y+h > self.image.height:
                        raise ValueError('invalid frame rectangle')

    def sample(self, clip_name, direction, elapsed):
        if not math.isfinite(elapsed) or elapsed < 0:
            raise ValueError('elapsed must be finite and nonnegative')
        clip = self.metadata['clips'][clip_name]
        clock = elapsed if clip['loop'] else min(elapsed, clip['duration'])
        tolerance = 2 * max(math.ulp(clock), math.ulp(clip['duration']))
        if clip['loop'] and tolerance >= clip['duration'] / len(clip['times']):
            raise ValueError('elapsed has lost frame precision; use a per-clip clock')
        time = clock % clip['duration'] if clip['loop'] else clock
        # Normalize only floating-point rounding, not a gameplay-sized grace window.
        if clip['loop'] and (time <= tolerance or clip['duration'] - time <= tolerance):
            time = 0
        index = bisect_right(clip['times'], time + tolerance) - 1
        name = clip['directions'][direction][index]
        x,y,w,h = self.metadata['rectangles'][name]
        return name, self.image.crop((x,y,x+w,y+h))

    def draw(self, canvas, anchor, clip, direction, elapsed):
        name, image = self.sample(clip, direction, elapsed)
        position = tuple(round(a-p) for a,p in zip(anchor, self.pivot))
        canvas.alpha_composite(image, position)
        return name


def preview(base, revised, output):
    packages = [SpritePackage(base), SpritePackage(revised)]
    images = []
    for index in range(18):
        canvas = Image.new('RGBA', (256, 128), (35, 41, 48, 255))
        for package, x in zip(packages, (64, 192)):
            package.draw(canvas, (x, 112), 'attack', 'right', index / 12)
        images.append(canvas)
    images[0].save(output, save_all=True, append_images=images[1:], duration=1000/12, loop=0, lossless=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest='command', required=True)
    p = sub.add_parser('pack'); p.add_argument('rendered', type=Path); p.add_argument('output', type=Path)
    p = sub.add_parser('preview'); p.add_argument('base', type=Path); p.add_argument('revised', type=Path); p.add_argument('output', type=Path)
    args = parser.parse_args()
    if args.command == 'pack':
        pack(args.rendered, args.output)
    else:
        preview(args.base, args.revised, args.output)
