#!/usr/bin/env python3
"""Independent end-to-end consumer; no fd formatter internals imported."""
import argparse, json, os, pathlib, stat, subprocess, sys, tempfile
if not __debug__:
    sys.exit("ERROR: optimized Python (-O) disables assertions; run without -O")
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('binary', help='executable fd binary')
parser.add_argument('mode', choices=['baseline', 'patched'])
args = parser.parse_args()
binary = str(pathlib.Path(args.binary).resolve())
if not pathlib.Path(binary).is_file() or not os.access(binary, os.X_OK):
    parser.error('binary must be an existing executable file')
mode = args.mode
try:
    (pathlib.Path(__file__).parent / 'tmp').mkdir(exist_ok=True)
except OSError as exc:
    parser.error(f'cannot prepare fixture directory: {exc}')
root = pathlib.Path(tempfile.mkdtemp(prefix='accept-', dir=pathlib.Path(__file__).parent / 'tmp'))
for name, data in [('plain', b'abcdef'), ('empty', b''), ('space name', b'x'), ('tab\tname', b'xy'), ('line\nname', b'xyz'), ('back\\slash', b'xxxx'), ('braces{%s}', b'12345')]:
    (root / name).write_bytes(data)
os.mkfifo(root / 'pipe')
(root / 'folder').mkdir()
(root / 'folder' / 'nested').write_bytes(b'payload')
(root / 'link').symlink_to('plain')
(root / 'dirlink').symlink_to('folder', target_is_directory=True)
(root / 'broken').symlink_to('absent')

def run(args):
    p = subprocess.run([binary, '--color=never', '--hidden', '--no-ignore', *args], cwd=root, capture_output=True, timeout=15)
    assert p.returncode == 0, (args, p.returncode, p.stderr)
    assert p.stderr == b'', p.stderr
    return p.stdout

def records(data):
    assert data.endswith(b'\0'), repr(data)
    return data[:-1].split(b'\0')

fmt = '{%y}\t{%s}\t{}'  # actual tabs; fd does not expand backslash escapes
if mode == 'baseline':
    rows = records(run(['--print0', '--format', fmt]))
    assert all(row.startswith(b'{%y}\t{%s}\t') for row in rows)
    print(json.dumps({'mode': mode, 'feature_missing': True, 'rows': len(rows)}))
    sys.exit(0)

for template, expected in [('{%y}', b'file'), ('{%s}', b'6'), ('{%s}|{%y}|{%s}|{/}|{.}|{%t}', b'6|file|6|plain|plain|{%t}')]:
    assert records(run(['^plain$', '--print0', '--format', template])) == [expected]

counts = {}
for follow in [False, True]:
    flags = ['--follow'] if follow else []
    data = records(run([*flags, '--print0', '--format', fmt]))
    paths = set(records(run([*flags, '--print0'])))
    seen = set()
    for record in data:
        kind, size, name = record.split(b'\t', 2)
        assert name not in seen
        seen.add(name)
        p = root / os.fsdecode(name)
        try:
            metadata = p.stat() if follow else p.lstat()
        except FileNotFoundError:
            metadata = p.lstat()  # fd retains broken symlinks with --follow
        expected_kind = b'file' if stat.S_ISREG(metadata.st_mode) else b'dir' if stat.S_ISDIR(metadata.st_mode) else b'symlink' if stat.S_ISLNK(metadata.st_mode) else b'other'
        assert kind == expected_kind, (name, kind, expected_kind)
        assert int(size) == metadata.st_size, (name, size, metadata.st_size)
    # Ordinary fd output appends '/' to directories; formatted paths do not.
    assert {x[:-1] if x.endswith(b'/') else x for x in paths} == seen, (paths, seen)
    expected_names = {b'./' + os.fsencode(name) for name in ['plain', 'empty', 'space name', 'tab\tname', 'line\nname', 'back\\slash', 'braces{%s}', 'pipe', 'folder', 'folder/nested', 'link', 'dirlink', 'broken']}
    if follow:
        expected_names.add(b'./dirlink/nested')
    assert seen == expected_names, (seen, expected_names)
    counts['follow' if follow else 'no_follow'] = len(data)

# Explicit base directory and path transformation must not become metadata lookup paths.
base = run(['--base-directory', 'folder', '--print0', '--format', fmt])
assert records(base) == [b'file\t7\t./nested'], base
separator = run(['nested', '--print0', '--format', fmt, '--path-separator', '#'])
assert records(separator) == [b'file\t7\t.#folder#nested'], separator
print(json.dumps({'mode': mode, 'metadata_matches_filesystem': True, 'single_and_repeated_token_cli_cases': 3, 'counts': counts, 'base_directory': True, 'path_separator': True}))
