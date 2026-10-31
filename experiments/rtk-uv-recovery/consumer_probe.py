#!/usr/bin/env python3
"""Run the public RTK uv failure reproducer in new isolated Linux directories."""
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys

if len(sys.argv) != 3 or not Path(sys.argv[1]).is_file() or Path(sys.argv[2]).exists():
  print('Usage: python3 consumer_probe.py <installed-rtk-binary> <new-evidence-directory>', file=sys.stderr)
  sys.exit(2)
rtk = str(Path(sys.argv[1]).resolve())
root = Path(sys.argv[2]).resolve()
uv = shutil.which('uv')
if not uv or sys.platform != 'linux':
  print('Needs existing uv and Linux; no installation was attempted.', file=sys.stderr)
  sys.exit(2)
root.mkdir(parents=True)
base_env = {k: v for k, v in os.environ.items() if not k.startswith(('RTK_', 'UV_', 'CLAUDE_'))}
def environment(home):
  return base_env | {'HOME': str(home), 'XDG_CONFIG_HOME': str(home / '.config'),
    'XDG_DATA_HOME': str(home / '.local/share'), 'XDG_CACHE_HOME': str(home / '.cache'),
    'CLAUDE_CONFIG_DIR': str(home / '.claude'), 'RTK_TELEMETRY_DISABLED': '1',
    'RTK_SUPPRESS_HOOK_WARNING': '1', 'DO_NOT_TRACK': '1',
    'UV_OFFLINE': '1', 'UV_PYTHON_DOWNLOADS': 'never', 'NO_COLOR': '1'}
def call(args, cwd, env, label, stdin=None):
  result = subprocess.run(args, cwd=cwd, env=env, input=stdin, capture_output=True,
                          timeout=30)
  (cwd / (label + '.stdout')).write_bytes(result.stdout)
  (cwd / (label + '.stderr')).write_bytes(result.stderr)
  return result

def settings(home, mode, exclude=False):
  directory = home / '.config/rtk'
  directory.mkdir(parents=True)
  text = '[display]\ncolors = false\nemoji = false\nmax_width = 120\n[telemetry]\nenabled = false\n'
  text += '[tee]\nenabled = true\nmode = "always"\n' if mode == 'tee' else '[retriever]\nmode = "sqlite"\n'
  if exclude:
    text += '[hooks]\nexclude_commands = ["uv"]\n'
  (directory / 'config.toml').write_text(text)

counter = '''from pathlib import Path
p = Path('executions.txt')
p.write_text(str(int(p.read_text()) + 1) if p.exists() else '1')
'''
partial = 'partial result: 17\n'
warn = 'warn\n'
cases = {
  'short_warning': ('import sys\nprint("partial result: 17", flush=True)\nprint("warn", file=sys.stderr, flush=True)\nsys.exit(3)\n', 3),
  'stdout_only': ('import sys\nprint("partial result: 17", flush=True)\nsys.exit(3)\n', 3),
  'success': ('import sys\nprint("partial result: 17", flush=True)\nprint("warn", file=sys.stderr, flush=True)\n', 0),
  'traceback': ('print("partial result: 17", flush=True)\n1/0\n', 1),
}
for size in (499, 500):
  stdout = partial + 'x' * (size - len(partial) - len(warn) - 1) + '\n'
  cases['bytes_' + str(size)] = (f'import sys\nsys.stdout.write({stdout!r})\nsys.stdout.flush()\nsys.stderr.write("warn\\n")\nsys.stderr.flush()\nsys.exit(3)\n', 3)
rows = []
for mode in ('tee', 'sqlite'):
  for label, (body, code) in cases.items():
    cwd = root / (mode + '-' + label)
    cwd.mkdir()
    home = cwd / 'home'
    settings(home, mode)
    env = environment(home)
    valid = call([rtk, 'config'], cwd, env, 'config')
    assert valid.returncode == 0, valid.stderr
    path = cwd / 'reproducer.py'
    if label == 'traceback':
      path = cwd / ('long_source_directory_' + 'x' * 100) / 'reproducer.py'
      path.parent.mkdir()
    path.write_text(counter + body)
    args = ['run', '--offline', '--no-project', '--python', sys.executable, 'python', str(path)]
    native = call([uv, *args], cwd, env, 'native')
    filtered = call([rtk, 'uv', *args], cwd, env, 'filtered')
    assert native.returncode == filtered.returncode == code
    assert partial.encode() in native.stdout
    assert (cwd / 'executions.txt').read_text() == '2'
    raw_size = len(native.stdout) + len(native.stderr)
    if label.startswith('bytes_'):
      assert raw_size == int(label.split('_')[1])
    stdout = filtered.stdout.decode()
    logs = list((home / '.local/share/rtk/tee').glob('*.log'))
    recall_db = home / '.local/share/rtk/recall.db'
    recall = re.search(r'rtk recall ([a-f0-9]{16})', stdout)
    recovered = b''
    if logs:
      assert len(logs) == 1
      recovered = logs[0].read_bytes()
    if recall:
      recovered_run = call([rtk, 'recall', recall.group(1), '--full'], cwd, env, 'recall')
      assert recovered_run.returncode == 0
      recovered = recovered_run.stdout
    assert (cwd / 'executions.txt').read_text() == '2', 'Recovery reran the script'
    expected_loss = label in ('short_warning', 'bytes_499', 'bytes_500', 'traceback')
    assert (partial in stdout) == (not expected_loss)
    if label == 'bytes_500':
      assert recovered in (native.stdout + native.stderr, native.stderr + native.stdout)
      assert len(recovered) == 500
    else:
      assert not logs and not recall and not recall_db.exists()
    bypass = None
    if label in ('short_warning', 'traceback'):
      bypass = call([rtk, 'bypass', uv, *args], cwd, env, 'bypass')
      assert bypass.returncode == code and partial.encode() in bypass.stdout
      assert (cwd / 'executions.txt').read_text() == '3'
      if label == 'traceback':
        assert b'1/0' in native.stderr and b'1/0' not in filtered.stdout
        assert b'1/0' in bypass.stdout + bypass.stderr
        assert raw_size < 500
    rows.append({'mode': mode, 'case': label, 'exit': code, 'nativeCombinedBytes': raw_size,
      'nativeStdoutMarker': True, 'filteredStdoutMarker': partial in stdout,
      'filteredStderrBytes': len(filtered.stderr), 'teeFiles': len(logs),
      'recallHint': bool(recall), 'recallDatabaseExists': recall_db.exists(), 'recoveredMarker': partial.encode() in recovered,
      'recoveryDidNotRerun': True if recovered else None,
      'recoveredBytes': len(recovered),
      'bypassPreservedMarker': None if bypass is None else partial.encode() in bypass.stdout,
      'tracebackSourceLost': label == 'traceback' and b'1/0' not in filtered.stdout})

# Only transform synthetic hook payloads. Do not install a hook or execute rewritten commands.
hooks = []
for exclude in (False, True):
  cwd = root / ('hook-excluded' if exclude else 'hook-default')
  (cwd / '.claude').mkdir(parents=True)
  home = cwd / 'home'
  settings(home, 'sqlite', exclude)
  env = environment(home)
  for i, command in enumerate(('uv run script.py', 'PYTHONUTF8=1 uv run script.py', 'uv run pytest tests/test_sample.py')):
    payload = json.dumps({'hook_event_name': 'PreToolUse', 'tool_name': 'Bash',
      'cwd': str(cwd), 'tool_input': {'command': command}}).encode()
    result = call([rtk, 'hook', 'claude'], cwd, env, str(i), payload)
    assert result.returncode == 0, result.stderr
    data = json.loads(result.stdout) if result.stdout.strip() else {}
    output = data.get('hookSpecificOutput', {}).get('updatedInput', {}).get('command', command)
    assert (not data or 'permissionDecision' not in data.get('hookSpecificOutput', {}))
    hooks.append({'excludeUv': exclude, 'input': command, 'output': output})
assert hooks[0]['output'] == 'rtk uv run script.py'
assert hooks[3]['output'] == 'uv run script.py'
assert hooks[4]['output'] == 'PYTHONUTF8=1 uv run script.py'
assert hooks[5]['output'] == 'uv run rtk pytest tests/test_sample.py'
meta_env = environment(root / 'metadata-home')
result = {'rtk': subprocess.check_output([rtk, '--version'], env=meta_env, text=True).strip(),
  'uv': subprocess.check_output([uv, '--version'], env=meta_env, text=True).strip(),
  'python': sys.version.split()[0], 'platform': sys.platform,
  'binarySha256': hashlib.sha256(Path(rtk).read_bytes()).hexdigest(), 'rows': rows, 'hookTransforms': hooks}
(root / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result, ensure_ascii=False, indent=2))
