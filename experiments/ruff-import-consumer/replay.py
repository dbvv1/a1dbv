"""Run a released Ruff against isolated copies of a released SDK module. No API calls."""
import hashlib
import importlib.metadata
import json
from pathlib import Path
import subprocess
import sys
import tempfile

import openai

SOURCE = 'types/live/decision_item_create_event.py'
SOURCE_SHA = '12d31779732644e4cea1c2b50e268d4efca2f0c17020455c7428d3926af57d03'
CONSUMER = '''import importlib.util, json, sys
import openai.types.live
name = "openai.types.live._f401_consumer"
spec = importlib.util.spec_from_file_location(name, sys.argv[1])
module = importlib.util.module_from_spec(spec)
sys.modules[name] = module
try:
  spec.loader.exec_module(module)
  event = module.DecisionItemCreateEvent.model_validate({
    "type": "decision.item.create", "item": {
      "type": "function_call", "arguments": "{}",
      "call_id": "synthetic-call", "name": "example"}})
except Exception as exc:
  print(json.dumps({"error": type(exc).__name__, "message": str(exc)}, sort_keys=True))
  sys.exit(1)
print(json.dumps(event.model_dump(exclude_none=True), sort_keys=True))
'''


def require(condition, message):
  if not condition:
    raise RuntimeError(message)


def run(args, root):
  result = subprocess.run(args, cwd=root, capture_output=True, text=True, timeout=30)
  return {'exit': result.returncode, 'stdout': result.stdout, 'stderr': result.stderr}


def replay():
  versions = {name: importlib.metadata.version(name) for name in ('ruff', 'openai', 'pydantic')}
  require(versions == {'ruff': '0.17.3', 'openai': '3.46.0', 'pydantic': '2.14.3'},
          'Install the pinned requirements in an isolated environment')
  original = Path(openai.__file__).parent / SOURCE
  data = original.read_bytes()
  require(hashlib.sha256(data).hexdigest() == SOURCE_SHA, 'Installed SDK source differs')
  source = data.decode('utf-8')
  require(source.count('    "Item",\n') == 1, 'Expected one alias export')
  removed = source.replace('    "Item",\n', '')
  split = removed.replace('    DecisionUserMessage as Item,\n', '').replace(
    'from .decision_user_message import (',
    'from .decision_user_message import DecisionUserMessage as Item\n'
    'from .decision_user_message import (')
  cases = {}
  with tempfile.TemporaryDirectory(prefix='ruff-import-consumer-') as temporary:
    root = Path(temporary)
    for name, text in [('untouched', source), ('alias_removed_from_all', removed),
                       ('separate_import_workaround', split)]:
      path = root / (name + '.py')
      path.write_text(text, encoding='utf-8')
      before = run([sys.executable, '-c', CONSUMER, path.name], root)
      fix = run([sys.executable, '-m', 'ruff', 'check', '--isolated',
                 '--select', 'F401', '--fix', path.name], root)
      after = run([sys.executable, '-c', CONSUMER, path.name], root)
      undefined = run([sys.executable, '-m', 'ruff', 'check', '--isolated',
                       '--select', 'F821', path.name], root)
      broken = name == 'alias_removed_from_all'
      require(before['exit'] == fix['exit'] == 0, name + ': setup/fix failed')
      require(after['exit'] == undefined['exit'] == int(broken), name + ': wrong polarity')
      if broken:
        require(json.loads(after['stdout']) == {
          'error': 'NameError',
          'message': "name 'DecisionUserMessage' is not defined"}, name + ': wrong failure')
      else:
        require(before['stdout'] == after['stdout'], name + ': consumer output changed')
      cases[name] = {'before': before, 'fix': fix, 'after': after,
                     'undefined_name_check': undefined,
                     'after_sha256': hashlib.sha256(path.read_bytes()).hexdigest()}
    require(original.read_bytes() == data, 'Installed SDK was modified')
  return {'versions': versions, 'source_path': 'openai/' + SOURCE,
          'source_sha256': SOURCE_SHA, 'scope': 'modified_sdk_copy_import_and_model_validation_only',
          'cases': cases}


if __name__ == '__main__':
  print(json.dumps(replay(), indent=2))
