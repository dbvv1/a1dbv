"""Bounded browserless MCP demonstration. Raw heaps stay local."""
import json
import os
import pathlib
import re
import select
import shutil
import signal
import subprocess
import time

root = pathlib.Path(__file__).resolve().parent
node = shutil.which('node')
if not node:
  raise RuntimeError('Node.js is required')
env = {
  'PATH': str(pathlib.Path(node).parent) + ':/usr/bin:/bin',
  'HOME': str(root / 'home'),
  'CI': '1',
  'CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS': '1',
  'CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS': '1',
}
args = [node, '--max-old-space-size=512',
        str(root / 'package/build/src/bin/chrome-devtools-mcp.js'),
        '--memoryDebugging', '--no-usage-statistics', '--no-performance-crux',
        '--executablePath=' + str(root / 'NO_BROWSER_EXECUTABLE')]
results, loaded = [], set()
sequence = 0
interrupted = False


def on_signal(signum, frame):
  global interrupted
  interrupted = True
  raise InterruptedError('Trial interrupted; cleaning up its server process group')


signal.signal(signal.SIGTERM, on_signal)
signal.signal(signal.SIGINT, on_signal)
log = open(root / 'server-stderr.log', 'w')
p = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                     stderr=log, text=True, env=env, cwd=root, start_new_session=True)


def rpc(method, params):
  global sequence
  sequence += 1
  p.stdin.write(json.dumps({'jsonrpc': '2.0', 'id': sequence,
                           'method': method, 'params': params}) + '\n')
  p.stdin.flush()
  end = time.monotonic() + 30
  while time.monotonic() < end:
    ready = select.select([p.stdout], [], [], max(0, end - time.monotonic()))[0]
    if not ready:
      raise TimeoutError(method)
    line = p.stdout.readline()
    if not line:
      raise RuntimeError('Server exited: ' + str(p.poll()))
    data = json.loads(line)
    if data.get('id') == sequence:
      results.append({'method': method, 'params': params, 'response': data})
      (root / 'responses.json').write_text(
        json.dumps(results, indent=2).replace(str(root), '<trial-dir>'))
      if 'error' in data:
        raise RuntimeError(str(data).replace(str(root), '<trial-dir>'))
      return data.get('result', {})
  raise TimeoutError(method)


def call(name, arguments):
  result = rpc('tools/call', {'name': name, 'arguments': arguments})
  print(name, json.dumps(result).replace(str(root), '<trial-dir>'), flush=True)
  if result.get('isError'):
    raise RuntimeError(name + ' error')
  if name != 'close_heapsnapshot':
    loaded.update(arguments[key] for key in
                  ['filePath', 'baseFilePath', 'currentFilePath'] if key in arguments)
  return result


def signal_group(sig):
  # Only the process group created by this client, never unrelated Node processes.
  try:
    os.killpg(p.pid, sig)
  except ProcessLookupError:
    pass


def shutdown():
  # Further termination signals must not interrupt the bounded kill fallback.
  signal.signal(signal.SIGTERM, signal.SIG_IGN)
  signal.signal(signal.SIGINT, signal.SIG_IGN)
  try:
    p.stdin.close()
  except (BrokenPipeError, OSError):
    pass
  try:
    p.wait(timeout=2)
  except subprocess.TimeoutExpired:
    signal_group(signal.SIGTERM)
    try:
      p.wait(timeout=2)
    except subprocess.TimeoutExpired:
      signal_group(signal.SIGKILL)
      p.wait(timeout=2)
  # Reap any helper left in this owned process group, even if its leader exited.
  signal_group(signal.SIGTERM)
  signal_group(signal.SIGKILL)
  log.close()
  print('SERVER_EXIT', p.returncode, flush=True)


completed = False
try:
  rpc('initialize', {'protocolVersion': '2025-11-25', 'capabilities': {},
                    'clientInfo': {'name': 'bounded-heap-trial', 'version': '1'}})
  p.stdin.write(json.dumps({'jsonrpc': '2.0', 'method': 'notifications/initialized'}) + '\n')
  p.stdin.flush()
  rpc('tools/list', {})
  for stage in ['baseline', 'loaded', 'disposed']:
    call('get_heapsnapshot_summary', {'filePath': str(root / (stage + '.heapsnapshot'))})
  for base in ['baseline', 'loaded']:
    call('compare_heapsnapshots', {
      'baseFilePath': str(root / (base + '.heapsnapshot')),
      'currentFilePath': str(root / 'disposed.heapsnapshot'), 'pageSize': 10})
  result = call('query_heapsnapshot_objects', {
    'filePath': str(root / 'disposed.heapsnapshot'),
    'className': 'RetainedPluginPayload', 'nodeType': 'object', 'pageSize': 10})
  text = '\n'.join(part.get('text', '') for part in result.get('content', []))
  ids = re.findall(r'^(\d+),RetainedPluginPayload,object,', text, re.M)
  if not ids:
    raise RuntimeError('No object node ID found; inspect the tool output schema')
  result = call('get_heapsnapshot_retaining_paths', {
    'filePath': str(root / 'disposed.heapsnapshot'), 'nodeId': int(ids[0]),
    'maxDepth': 25, 'maxNodes': 50, 'maxSiblings': 2})
  if not all(name in json.dumps(result) for name in ['LoadCache', 'ModuleLoader', 'SourceTextModule']):
    raise RuntimeError('Module-cache segment not established; do not claim success')
  for file in sorted(loaded):
    call('close_heapsnapshot', {'filePath': file})
  completed = True
finally:
  # Normal completion closes each loaded snapshot above. Failure/interruption
  # destroys the bounded server group instead of issuing more possibly hung RPCs.
  shutdown()
if not completed or p.returncode != 0:
  raise RuntimeError('Trial did not complete cleanly')
