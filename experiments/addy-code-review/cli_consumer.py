"""Real subprocess CLI consumers for the public option-error change; no model call."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
from datetime import datetime, timezone

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('baseline', help='Existing clean LLM checkout at the fixed base')
parser.add_argument('candidate', help='Existing clean LLM checkout at the fixed PR head')
args = parser.parse_args()
python, baseline, candidate = sys.executable, args.baseline, args.candidate
for repo, expected in [(baseline, 'aebaca27f9acb6cc56ba4b33ab81e08d6dcb3bc3'), (candidate, 'ecfd202adad3e448df2ccc56a99278358df670dc')]:
  try:
    env = {**os.environ, 'GIT_NO_REPLACE_OBJECTS': '1', 'GIT_NO_LAZY_FETCH': '1', 'GIT_TERMINAL_PROMPT': '0', 'GIT_OPTIONAL_LOCKS': '0'}
    actual = subprocess.check_output(['git', '--no-lazy-fetch', '-C', repo, 'rev-parse', 'HEAD'], env=env, stderr=subprocess.DEVNULL, text=True, timeout=10).strip()
    dirty = subprocess.check_output(['git', '--no-lazy-fetch', '-C', repo, 'status', '--porcelain', '--untracked-files=no'], env=env, stderr=subprocess.DEVNULL, text=True, timeout=10)
    if actual != expected or dirty:
      parser.error('Require the exact fixed revisions and clean tracked files; no fetch or checkout attempted.')
  except (subprocess.SubprocessError, OSError):
    parser.error('Existing Git checkout unavailable; no fetch or checkout attempted.')
started = datetime.now(timezone.utc).isoformat()
cases = []
for option, value in [('max_token', '100'), ('banana', '100'), ('temperature', 'bad')]:
  cases.extend([
    ('prompt', option, ['-m', 'gpt-4o-mini', '-o', option, value, 'hi']),
    ('chat', option, ['chat', '-m', 'gpt-4o-mini', '-o', option, value]),
    ('save', option, ['-m', 'gpt-4o-mini', '-o', option, value, '--save', 'review-example', 'hi']),
    ('defaults', option, ['models', 'options', 'set', 'gpt-4o-mini', option, value]),
  ])
results = []
for label, repo in [('base', baseline), ('candidate', candidate)]:
  with tempfile.TemporaryDirectory(prefix='cli-consumer-', dir=Path(__file__).parent) as temp:
    env = {
      'PATH': os.defpath, 'HOME': temp, 'LANG': 'C.UTF-8',
      'PYTHONPATH': str(Path(repo).resolve()), 'LLM_USER_PATH': temp,
      'LLM_LOAD_PLUGINS': '', 'PYTHONIOENCODING': 'utf-8',
    }
    imported = subprocess.check_output([python, '-c', 'import llm; print(llm.__file__)'], cwd=repo, env=env, text=True).strip()
    assert Path(imported).resolve() == Path(repo).resolve() / 'llm/__init__.py'
    for entry, option, args in cases:
      run = subprocess.run([python, '-m', 'llm', *args], cwd=repo, env=env, text=True, input='', capture_output=True, timeout=30)
      out = run.stdout + run.stderr
      assert run.returncode == 1, (label, entry, option, run.returncode, out)
      if option == 'temperature':
        assert 'Input should be a valid number' in out and 'Did you mean' not in out
      elif label == 'base':
        assert 'Extra inputs are not permitted' in out and 'Did you mean' not in out
      else:
        assert f"'{option}' is not a valid option for model 'gpt-4o-mini'" in out
        assert "Run 'llm models --options -m gpt-4o-mini'" in out
        assert ('Did you mean' in out) == (option == 'max_token')
      assert not (Path(temp) / 'model_options.json').exists()
      assert not (Path(temp) / 'templates/review-example.yaml').exists()
      results.append({'version': label, 'entry': entry, 'option': option, 'argv': args, 'exit': run.returncode, 'output': out, 'passed': True})
    run = subprocess.run([python, '-m', 'llm', 'models', '--options', '-m', 'gpt-4o-mini'], cwd=repo, env=env, text=True, capture_output=True, timeout=30)
    assert run.returncode == 0 and 'max_tokens' in run.stdout
    results.append({'version': label, 'entry': 'suggested-help', 'exit': run.returncode, 'supported_max_tokens': True, 'passed': True})
print(json.dumps({'started_utc': started, 'ended_utc': datetime.now(timezone.utc).isoformat(), 'consumer': 'real python -m llm subprocess; no model response or API used; temporary user directory and explicit plugin isolation', 'passed': len(results), 'results': results}, ensure_ascii=False, indent=2))
