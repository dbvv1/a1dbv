"""Isolated local plugin management only; never renders a prompt or invokes a model."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
import tomllib

PLUGIN = 'visibility-probe@synthetic-visibility'


def require(condition, message):
  if not condition:
    raise RuntimeError(message)


def run(binary):
  with tempfile.TemporaryDirectory(prefix='codex-management-') as temporary:
    root = Path(temporary)
    market = root / 'market'
    plugin = market / 'plugins/visibility-probe'
    for path in (market / '.agents/plugins', plugin / '.codex-plugin',
                 plugin / 'skills/visibility-probe', root / 'project', root / 'home', root / 'codex'):
      path.mkdir(parents=True)
    (market / '.agents/plugins/marketplace.json').write_text(json.dumps({
      'name': 'synthetic-visibility', 'plugins': [{'name': 'visibility-probe',
      'source': {'source': 'local', 'path': './plugins/visibility-probe'}}]}), encoding='utf-8')
    (plugin / '.codex-plugin/plugin.json').write_text(json.dumps({
      'name': 'visibility-probe', 'version': '1.0.0', 'description': 'Synthetic management fixture'}), encoding='utf-8')
    (plugin / 'skills/visibility-probe/SKILL.md').write_text(
      '---\nname: visibility-probe\ndescription: Synthetic local management fixture\n---\nNo actions.\n', encoding='utf-8')
    env = {key: os.environ[key] for key in ('PATH', 'TMPDIR', 'LANG', 'LC_ALL') if key in os.environ}
    env.update(HOME=str(root / 'home'), CODEX_HOME=str(root / 'codex'),
               XDG_CONFIG_HOME=str(root / 'home/config'), XDG_DATA_HOME=str(root / 'home/data'),
               XDG_CACHE_HOME=str(root / 'home/cache'))
    rows = []

    def command(name, args, structured=True):
      result = subprocess.run([str(binary), *args], cwd=root / 'project', env=env,
                              capture_output=True, text=True, timeout=40)
      require(result.returncode == 0, f'{name}: nonzero exit {result.returncode}; stopped')
      if name != 'version':
        rows.append({'step': name, 'exit': result.returncode})
      return json.loads(result.stdout) if structured else result.stdout.strip()

    def state(listing):
      config = root / 'codex/config.toml'
      data = tomllib.loads(config.read_text(encoding='utf-8')) if config.exists() else {}
      plugins = data.get('plugins', {})
      cached = root / 'codex/plugins/cache/synthetic-visibility/visibility-probe'
      return {
        'listed': any(item.get('pluginId') == PLUGIN for item in listing['installed']),
        'config_entry': PLUGIN in plugins,
        'config_enabled': plugins.get(PLUGIN, {}).get('enabled', False),
        'cached_skill_files': len(list(cached.rglob('SKILL.md'))),
      }

    version = command('version', ['--version'], structured=False)
    command('market-add', ['plugin', 'marketplace', 'add', str(market), '--json'])
    command('plugin-add', ['plugin', 'add', PLUGIN, '--json'])
    before = state(command('list-before', ['plugin', 'list', '--json']))
    require(before == {'listed': True, 'config_entry': True, 'config_enabled': True, 'cached_skill_files': 1},
            'install control did not establish the expected isolated state')
    command('market-remove', ['plugin', 'marketplace', 'remove', 'synthetic-visibility', '--json'])
    after = state(command('list-after', ['plugin', 'list', '--json']))
    # Observe the management behavior rather than requiring future versions to retain this bug.
    command('plugin-remove', ['plugin', 'remove', PLUGIN, '--json'])
    cleaned = state(command('list-cleanup', ['plugin', 'list', '--json']))
    require(cleaned == {'listed': False, 'config_entry': False, 'config_enabled': False, 'cached_skill_files': 0},
            'explicit uninstall control left synthetic plugin state')
    return {'version': version, 'binary_sha256': hashlib.sha256(binary.read_bytes()).hexdigest(),
            'commands': rows, 'installed': before, 'marketplace_removed': after, 'plugin_removed': cleaned,
            'prompt_or_model_invoked': False}


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--codex', type=Path, required=True, help='Existing trusted Codex executable; nothing is installed')
  args = parser.parse_args()
  binary = args.codex.absolute()
  require(binary.is_file(), 'Codex executable is missing')
  print(json.dumps(run(binary), indent=2, ensure_ascii=True))


if __name__ == '__main__':
  main()
