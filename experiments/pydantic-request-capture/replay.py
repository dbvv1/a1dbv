#!/usr/bin/env python3
"""Replay two real upstream tests and their request-vs-recording negative controls."""
import argparse
import json
import os
from pathlib import Path
import re
import subprocess

HEAD = 'be329c694aef8be4f55952315611305b06c42c94'
PROVIDER = 'pydantic_ai_slim/pydantic_ai/providers/cerebras.py'
TEST_FILE = 'tests/models/test_cerebras.py'
TESTS = [TEST_FILE + '::' + name for name in (
  'test_cerebras_forwards_settings_the_api_honors',
  'test_cerebras_accepts_every_service_tier')]


def git(source, *args):
  return subprocess.check_output(['git', '-C', str(source), *args], text=True).strip()


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--source', type=Path, required=True)
  parser.add_argument('--python', type=Path, required=True)
  parser.add_argument('--work', type=Path, required=True, help='New directory, outside source')
  args = parser.parse_args()
  source, python, work = args.source.resolve(), args.python.absolute(), args.work.resolve()
  if git(source, 'rev-parse', 'HEAD') != HEAD or git(source, 'status', '--porcelain', '--untracked-files=no'):
    raise SystemExit('Source must have the exact clean tracked upstream HEAD')
  if work == source or source in work.parents:
    raise SystemExit('Work must be outside the source tree')
  work.mkdir(parents=True, exist_ok=False)
  home = work / 'home'
  home.mkdir()
  guard = Path(__file__).with_name('offline_guard.py').resolve()
  guard_env = {'PATH': str(python.parent), 'HOME': str(home), 'PYTHONPATH': str(guard.parent)}
  subprocess.run([str(python), '-c', '''import offline_guard, socket
for call in (lambda: socket.socket().connect(('127.0.0.1', 9)),
             lambda: socket.getaddrinfo('offline.invalid', 80)):
    try:
        call()
    except RuntimeError as exc:
        assert str(exc) == 'offline replay prohibits real socket connections'
    else:
        raise AssertionError('network guard did not reject the probe')
assert len(offline_guard.attempts) == 2
'''], env=guard_env, check=True)
  versions = json.loads(subprocess.check_output([str(python), '-c', '''import json, sys
from importlib.metadata import version
print(json.dumps({'python': sys.version.split()[0], **{name: version(name) for name in
    ('pytest', 'pytest-recording', 'vcrpy', 'httpx2', 'openai', 'inline-snapshot', 'ruff')}}))
'''], text=True, env=guard_env))
  old_provider = subprocess.check_output(['git', '-C', str(source), 'show', HEAD + '^:' + PROVIDER])
  results = []
  for arm in ('fixed_capture', 'old_capture', 'old_recording'):
    repo = work / arm
    subprocess.run(['git', 'clone', '--shared', '--no-hardlinks', str(source), str(repo)], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    if arm != 'fixed_capture':
      (repo / PROVIDER).write_bytes(old_provider)
    if arm == 'old_recording':
      path = repo / TEST_FILE
      content = path.read_text()
      replacements = [
        ('allow_model_requests: None, cerebras_api_key: str, request_capture: RequestCapture\n)',
         'allow_model_requests: None, cerebras_api_key: str, request_capture: RequestCapture, vcr: Cassette\n)'),
        ("body = request_capture.body('/chat/completions')", 'body = json.loads(vcr.requests[0].body)'),
        ("request_capture.body('/chat/completions', index=1)['service_tier']", "json.loads(vcr.requests[1].body)['service_tier']"),
        ("sent = [body.get('service_tier') for body in request_capture.bodies('/chat/completions')]",
         "sent = [json.loads(request.body).get('service_tier') for request in vcr.requests]"),
      ]
      for before, after in replacements:
        assert content.count(before) == 1, before
        content = content.replace(before, after)
      path.write_text(content)
    env = {'PATH': str(python.parent) + os.pathsep + os.environ.get('PATH', ''),
           'HOME': str(home), 'LANG': 'C.UTF-8', 'CEREBRAS_API_KEY': 'mock-api-key',
           'LOGFIRE_SEND_TO_LOGFIRE': 'false',
           'PYTHONPATH': str(repo / 'pydantic_ai_slim') + os.pathsep + str(guard.parent)}
    # Confirm editable metadata does not redirect production imports to the fixed source.
    actual = subprocess.check_output([str(python), '-c',
      'import pydantic_ai.providers.cerebras as m; print(m.__file__)'], cwd=repo, env=env, text=True).strip()
    assert Path(actual).resolve() == (repo / PROVIDER).resolve(), actual
    run = subprocess.run([str(python), '-m', 'pytest', '-p', 'offline_guard', '--record-mode=none',
                          '--strict-vcr-cassette-usage', '-q', *TESTS], cwd=repo, env=env,
                         capture_output=True, text=True, timeout=120)
    text = run.stdout + run.stderr
    (work / (arm + '.log')).write_text(text)
    counts = {key: int(matches[-1]) if (matches := re.findall(r'(\d+) ' + key + r'\b', text)) else 0
              for key in ('passed', 'failed', 'error', 'skipped')}
    expected = {'passed': 0, 'failed': 2, 'error': 1, 'skipped': 0} if arm == 'old_capture' else {
      'passed': 2, 'failed': 0, 'error': 0, 'skipped': 0}
    assert counts == expected and run.returncode == (1 if arm == 'old_capture' else 0), (arm, counts, text)
    if arm == 'old_capture':
      assert "'frequency_penalty': '<stripped>'" in text and '[None, None, None, None]' in text
    results.append({'arm': arm, 'exit': run.returncode, **counts})
  report = {'environment': versions, 'guard_rejection_probes': 2, 'upstream': HEAD, 'old_provider_commit': git(source, 'rev-parse', HEAD + '^'),
            'scope': 'offline current request construction versus prerecorded request data', 'results': results}
  (work / 'results.json').write_text(json.dumps(report, indent=2) + '\n')
  print(json.dumps(report, indent=2))


if __name__ == '__main__':
  main()
