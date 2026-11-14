"""Read public Ruler-generated MCP config with the real Codex CLI; no network call."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tomllib

ruler = Path(sys.argv[1]).resolve()
output = Path(sys.argv[2]).resolve()
output.mkdir()  # Never overwrite an earlier run.
project = output / 'project'
(project / '.ruler').mkdir(parents=True)
(project / '.codex').mkdir()
home = output / 'home'
home.mkdir()
(project / '.ruler/AGENTS.md').write_text('# Public fixture\nKeep public sample values.\n')
(project / '.ruler/ruler.toml').write_text('''[mcp_servers.catalog]
url = "https://example.com/mcp"
[mcp_servers.catalog.headers]
"X-API-Version" = "public-fixture-v1"
"X-Client-Name" = "ruler-consumer-probe"
[mcp_servers.anonymous]
url = "https://example.com/anonymous"
[mcp_servers.local]
command = "node"
args = ["public-fixture.js"]
''')
config = project / '.codex/config.toml'
config.write_text('''model = "fixture-not-invoked"
[mcp_servers.native]
url = "https://example.com/native"
[mcp_servers.native.http_headers]
"X-Native" = "keep"
''')
env = dict(os.environ, HOME=str(home), XDG_CONFIG_HOME=str(home / '.config'),
           CODEX_HOME=str(project / '.codex'))

def run(name, argv):
    result = subprocess.run(argv, cwd=project, env=env, text=True,
                            capture_output=True, timeout=30)
    (output / (name + '.stdout')).write_text(result.stdout)
    (output / (name + '.stderr')).write_text(result.stderr)
    assert result.returncode == 0, (name, result.returncode, result.stderr)
    return result.stdout

def apply(name, *extra):
    run(name, ['node', str(ruler), 'apply', '--agents', 'codex', '--local-only',
               '--no-skills', '--no-subagents', *extra])

def get(name):
    return json.loads(run('get-' + name, ['codex', 'mcp', 'get', name, '--json']))

apply('first-apply')
raw = tomllib.loads(config.read_text())
assert raw['model'] == 'fixture-not-invoked'
headers = {'X-API-Version': 'public-fixture-v1', 'X-Client-Name': 'ruler-consumer-probe'}
assert get('catalog')['transport']['http_headers'] == headers
assert get('anonymous')['transport']['http_headers'] is None
assert get('local')['transport']['type'] == 'stdio'
assert get('native')['transport']['http_headers'] == {'X-Native': 'keep'}
for server in raw['mcp_servers'].values():
    assert 'headers' not in server and 'type' not in server
first = config.read_bytes()
apply('repeat-apply')
assert config.read_bytes() == first
apply('overwrite-apply', '--mcp-overwrite')
raw = tomllib.loads(config.read_text())
assert 'native' not in raw['mcp_servers'] and raw['model'] == 'fixture-not-invoked'
assert get('catalog')['transport']['http_headers'] == headers
print('PASS: real CLI headers, anonymous, stdio, native preservation, no legacy keys, idempotence, overwrite, top-level preservation')
