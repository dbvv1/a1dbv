"""Shared launch helpers for the real subprocess Hook tests.

The tests need one Bash and exactly one JSON backend visible on ``PATH``.
Native Windows Git Bash can run the Hook, but native Python cannot launch
``/bin/bash`` and usually cannot create symlinks. Build the isolated ``PATH``
from small exec wrappers that delegate to the same real binaries instead.
"""
import functools
import os
from pathlib import Path
import re
import shlex
import shutil
import subprocess

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
DEFAULT_HOOK = REPO / 'templates/generic/.claude/hooks/protect-paths.sh'
PARSERS = ('jq', 'python3')


class HookTestEnvironmentError(RuntimeError):
  """The host cannot provide a real dependency the Hook tests require."""


def hook_under_test():
  return Path(os.environ.get('HOOK_UNDER_TEST', DEFAULT_HOOK))


def shell_path(path):
  """Absolute host path as the selected Bash sees it.

  Git Bash accepts POSIX drive paths (``/c/...``); passing one avoids
  backslash escaping inside the exec wrappers.
  """
  value = str(Path(path).resolve()).replace('\\', '/')
  if os.name == 'nt' and len(value) > 1 and value[1] == ':':
    value = '/' + value[0].lower() + value[2:]
  return value


def write_wrapper(path, target):
  """Write an executable Bash wrapper that runs the real binary at target."""
  script = '#!/bin/bash\nexec %s "$@"\n' % shlex.quote(shell_path(target))
  path = Path(path)
  path.write_text(script, encoding='utf-8', newline='\n')
  path.chmod(0o755)


def select_bash(explicit=None):
  """Return a working Bash, or raise instead of skipping or passing.

  Selection order is an explicit argument, ``BASH_UNDER_TEST``, then the
  existing ``bash`` on ``PATH``. A configured value that is missing or cannot
  start is an error; it never falls back to a different Bash.
  """
  configured = explicit if explicit is not None else os.environ.get('BASH_UNDER_TEST')
  if configured:
    if Path(configured).is_file():
      bash, source = configured, 'BASH_UNDER_TEST'
    elif shutil.which(configured):
      bash, source = shutil.which(configured), 'BASH_UNDER_TEST'
    else:
      raise HookTestEnvironmentError(
          f'BASH_UNDER_TEST is not an executable file: {configured!r}')
  else:
    bash = shutil.which('bash')
    if not bash:
      raise HookTestEnvironmentError(
          'bash was not found on PATH; set BASH_UNDER_TEST to a Bash executable')
    source = 'PATH'
  try:
    probe = subprocess.run([bash, '-c', 'exit 0'], capture_output=True,
                           text=True, encoding='utf-8', timeout=30)
  except (OSError, subprocess.SubprocessError) as exc:
    raise HookTestEnvironmentError(
        f'bash from {source} could not start: {exc}') from exc
  if probe.returncode:
    raise HookTestEnvironmentError(
        f'bash from {source} failed its startup probe with exit '
        f'{probe.returncode}: {probe.stderr.strip()}')
  return bash


@functools.lru_cache(maxsize=1)
def resolve_bash():
  return select_bash()


def select_parser(explicit=None):
  """Return (name, real path) for the requested JSON backend.

  Only the two backends the Hook supports are accepted; a missing executable
  fails clearly so a mixed or ambient PATH cannot stand in for it.
  """
  parser = explicit if explicit is not None else os.environ.get('TEST_PARSER', 'python3')
  if parser not in PARSERS:
    raise HookTestEnvironmentError(
        f'TEST_PARSER must be one of {", ".join(PARSERS)}, got {parser!r}')
  binary = shutil.which(parser)
  if binary is None:
    raise HookTestEnvironmentError(
        f'{parser} was not found on PATH; TEST_PARSER={parser} cannot run')
  return parser, binary


def isolated_bin(base, parser=None):
  """Create a PATH directory with only cat and the requested parser.

  Returns ``(bin_dir, parser_name, parser_target)``. Wrappers delegate to the
  same real executables the Hook would otherwise find, so no JSON mock is
  introduced. Raises instead of skipping when a dependency is unavailable.
  """
  parser, parser_target = select_parser(parser)
  cat = shutil.which('cat')
  if cat is None:
    raise HookTestEnvironmentError('cat was not found on PATH; the Hook tests need it')
  bin_dir = Path(base) / 'hook-bin'
  bin_dir.mkdir()
  write_wrapper(bin_dir / 'cat', cat)
  write_wrapper(bin_dir / parser, parser_target)
  return bin_dir, parser, parser_target


def hook_env(bin_dir, project_dir, rules_file):
  """Environment for one real Hook launch with an isolated backend PATH."""
  env = dict(os.environ, PATH=str(bin_dir), CLAUDE_PROJECT_DIR=str(project_dir),
             PROTECTED_PATHS_FILE=str(rules_file), PYTHONIOENCODING='utf-8')
  # Git Bash starts without LANG/LC_*; Bash then matches high bytes with
  # [[:cntrl:]] and rejects valid UTF-8 paths. Pin a UTF-8 locale for the child.
  locale = env.get('LC_ALL') or env.get('LC_CTYPE') or env.get('LANG') or ''
  if os.name == 'nt' and not re.search(r'utf-?8', locale, re.I):
    env['LC_ALL'] = 'C.UTF-8'
  return env


def verify_isolated_bin(bash, bin_dir, cwd):
  """Prove the isolated PATH really runs cat; raise with the observed result."""
  probe = subprocess.run([bash, '-c', 'printf x | cat'], text=True,
                         encoding='utf-8', capture_output=True,
                         env=dict(os.environ, PATH=str(bin_dir)),
                         cwd=str(cwd), timeout=30)
  if (probe.returncode, probe.stdout) != (0, 'x'):
    raise HookTestEnvironmentError(
        'isolated PATH cannot run cat: '
        f'exit={probe.returncode} stdout={probe.stdout!r} stderr={probe.stderr!r}')
  return probe
