"""Check the public replay's missing, incompatible and normal inputs."""
import json
from pathlib import Path
import subprocess
import sys

base, head = sys.argv[1:]
script = Path(__file__).with_name('cli_consumer.py')

def run(args):
  return subprocess.run([sys.executable, str(script), *args], capture_output=True, text=True, timeout=90)

missing = run([])
assert missing.returncode == 2 and 'usage:' in missing.stderr
wrong_revision = run([head, head])
assert wrong_revision.returncode == 2 and 'exact fixed revisions' in wrong_revision.stderr
normal = run([base, head])
assert normal.returncode == 0, normal.stderr
result = json.loads(normal.stdout)
assert result['passed'] == 26 and len(result['results']) == 26
assert all(item['passed'] for item in result['results'])
print('3 replay regressions passed: missing input, wrong revision, 26 real CLI observations.')
