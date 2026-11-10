"""Run three isolated CLI MCP checks against a built Qwen checkout (POSIX)."""
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import tempfile

if len(sys.argv) != 2:
    raise SystemExit('Usage: python3 reproduce.py /path/to/built/qwen-code')
cli = Path(sys.argv[1]).resolve() / 'packages/cli/dist/index.js'
node = shutil.which('node')
if not cli.is_file() or not node:
    raise SystemExit('Missing compiled CLI or node; build Qwen first.')
server = Path(__file__).with_name('server.mjs').resolve()
if not server.is_file():
    raise SystemExit('Missing server.mjs fixture.')
root = Path(tempfile.mkdtemp(prefix='qwen-discovery-'))
print(f'Isolated outputs retained at {root}')
for mode, expected_code, expected_text in [
    ('failure', 1, 'DIAGNOSTIC_FIXTURE: tool catalog unavailable'),
    ('empty', 1, 'No prompts, tools, or resources found on the server.'),
    ('healthy', 0, 'Reconnected successfully'),
]:
    home = root / mode / 'home'
    work = root / mode / 'work'
    config = home / '.qwen'
    config.mkdir(parents=True)
    work.mkdir()
    (config / 'settings.json').write_text(json.dumps({
        'mcpServers': {'diagnostic': {'command': node, 'args': [str(server), mode]}},
        'privacy': {'usageStatisticsEnabled': False},
        'telemetry': {'enabled': False},
        'model': {'catalogRefresh': False},
    }))
    env = {'PATH': os.environ.get('PATH', ''), 'HOME': str(home),
           'QWEN_HOME': str(config), 'XDG_CONFIG_HOME': str(home / '.config'),
           'QWEN_USAGE_STATISTICS_ENABLED': 'false', 'QWEN_DEBUG_LOG_FILE': '0'}
    process = subprocess.Popen([node, str(cli), 'mcp', 'reconnect', '--all'],
                               cwd=work, env=env, stdout=subprocess.PIPE,
                               stderr=subprocess.STDOUT, text=True, start_new_session=True)
    try:
        output, _ = process.communicate(timeout=45)
    except subprocess.TimeoutExpired:
        os.killpg(process.pid, signal.SIGKILL)
        output, _ = process.communicate()
        (root / f'{mode}.log').write_text(output)
        raise SystemExit(f'{mode}: timeout; process group stopped, output retained')
    (root / f'{mode}.log').write_text(output)
    final_lines = [line for line in output.splitlines() if 'diagnostic:' in line and ('Failed -' in line or 'Reconnected successfully' in line)]
    matched = len(final_lines) == 1 and expected_text in final_lines[0]
    if mode == 'failure' and final_lines:
        matched = matched and 'No prompts, tools, or resources found' not in final_lines[0]
    if process.returncode != expected_code or not matched:
        raise SystemExit(f'{mode}: FAIL exit={process.returncode}; inspect retained output')
    print(f'{mode}: PASS exit={process.returncode}; expected message present')
