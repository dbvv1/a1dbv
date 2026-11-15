#!/usr/bin/env python3
"""Run only local plugin management, with synthetic content and a fresh HOME."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import tempfile


def run_probe(binary):
  results = []
  for scope in ('local', 'project'):
    with tempfile.TemporaryDirectory(prefix='plugin-version-') as directory:
      root = Path(directory)
      home = root / 'home'
      config = home / 'config'
      home.mkdir()
      env = {'PATH': os.defpath, 'HOME': str(home), 'CLAUDE_CONFIG_DIR': str(config),
             'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC': '1',
             'GIT_CONFIG_NOSYSTEM': '1', 'GIT_CONFIG_GLOBAL': os.devnull,
             'GIT_TERMINAL_PROMPT': '0'}

      def run(argv, cwd):
        result = subprocess.run(argv, cwd=cwd, env=env, text=True,
                                capture_output=True, timeout=60)
        if result.returncode:
          raise RuntimeError(f'{argv[0]} failed ({result.returncode}): {result.stderr}')
        return result.stdout

      def git(cwd, *args):
        return run(['git', '-c', 'user.name=Fixture', '-c',
                    'user.email=41898282+github-actions[bot]@users.noreply.github.com', *args], cwd)

      def cli(cwd, *args):
        return json.loads(run([str(binary), 'plugin', *args, '--json'], cwd))

      def write(path, value):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(value, encoding='utf-8')

      market = root / 'market'
      def release(version, marker):
        write(market / '.claude-plugin/marketplace.json', json.dumps({
          'name': 'probe-market', 'owner': {'name': 'Fixture'},
          'plugins': [{'name': 'probe', 'source': './plugins/probe', 'version': version}]}))
        write(market / 'plugins/probe/.claude-plugin/plugin.json', json.dumps({
          'name': 'probe', 'version': version, 'description': 'Synthetic marker only'}))
        write(market / 'plugins/probe/commands/marker.md', '# Marker\n\n' + marker + '\n')

      release('1.0.0', 'ONE')
      repo, wt, other = (root / name for name in ('repo', 'wt', 'other'))
      for path in (repo, other):
        path.mkdir()
        git(path, 'init', '-q')
        git(path, 'commit', '--allow-empty', '-qm', 'fixture')
      git(repo, 'worktree', 'add', str(wt), '-b', 'fixture-wt')
      version = run([str(binary), '--version'], repo).strip()
      cli(repo, 'marketplace', 'add', str(market))
      for path in (repo, wt, other):
        cli(path, 'install', 'probe@probe-market', '--scope', scope)

      def records():
        entries = json.loads((config / 'plugins/installed_plugins.json').read_text())['plugins']['probe@probe-market']
        selected = {}
        for label, path in (('repo', repo), ('worktree', wt), ('independent_repo', other)):
          entry = next(x for x in entries if x['scope'] == scope and x['projectPath'] == str(path))
          marker = (Path(entry['installPath']) / 'commands/marker.md').read_text().splitlines()[-1]
          selected[label] = {'version': entry['version'], 'marker': marker}
        return selected

      initial = records()
      assert all(x == {'version': '1.0.0', 'marker': 'ONE'} for x in initial.values())
      release('1.1.0', 'TWO')
      outcomes = {}
      for label, path in (('repo', repo), ('worktree', wt), ('independent_repo', other)):
        value = cli(path, 'update', 'probe@probe-market', '--scope', scope)
        outcomes[label] = {k: value[k] for k in ('outcome', 'updateOutcome', 'oldVersion', 'newVersion')}
      after_update = records()
      assert after_update['repo'] == after_update['independent_repo'] == {'version': '1.1.0', 'marker': 'TWO'}
      assert outcomes['worktree']['updateOutcome'] == 'up_to_date'
      assert after_update['worktree'] == {'version': '1.0.0', 'marker': 'ONE'}
      reinstall = cli(wt, 'install', 'probe@probe-market', '--scope', scope)
      after_reinstall = records()
      results.append({'scope': scope, 'cli_version': version, 'initial': initial,
                      'update_responses': outcomes, 'after_update': after_update,
                      'worktree_install_response': {k: reinstall[k] for k in ('outcome', 'scope')},
                      'after_worktree_install': after_reinstall})
  return results


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--claude', type=Path, required=True,
                      help='absolute path to an already-installed official native CLI')
  args = parser.parse_args()
  if not args.claude.is_absolute() or not args.claude.is_file() or not os.access(args.claude, os.X_OK):
    parser.error('--claude must name an existing absolute executable path')
  print(json.dumps(run_probe(args.claude), ensure_ascii=True, indent=2))
