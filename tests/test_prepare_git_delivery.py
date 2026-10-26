import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest import mock


SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/prepare_git_delivery.py'
spec = importlib.util.spec_from_file_location('prepare_git_delivery', SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class DeliveryManifestTests(unittest.TestCase):
  """Synthetic local Git fixtures, not reconstructed API error logs."""

  def setUp(self):
    self.tmp = tempfile.TemporaryDirectory()
    self.addCleanup(self.tmp.cleanup)
    self.root = Path(self.tmp.name)
    self.git('init', '-q', '--initial-branch=main')
    self.write('tasks.md', ''.join(f'line {i}\n' for i in range(40)))
    self.write('old.txt', 'original\n')
    self.base = self.commit('base')

  def git(self, *args, input=None):
    env = {k: v for k, v in os.environ.items() if not k.startswith('GIT_')}
    env.update(GIT_CONFIG_NOSYSTEM='1', GIT_CONFIG_GLOBAL=os.devnull)
    return subprocess.check_output(
      ['git', '-C', str(self.root), '-c', 'user.name=Fixture', '-c',
       'user.email=fixture@users.noreply.github.com', *args],
      input=input, stderr=subprocess.PIPE, env=env)

  def write(self, path, data):
    target = self.root / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(data, encoding='utf-8')

  def commit(self, message):
    self.git('add', '-A')
    self.git('commit', '-qm', message)
    return self.git('rev-parse', 'HEAD').decode().strip()

  def prepare(self, head='HEAD', known=()):
    return module.prepare(self.root, self.base, head, known, full=True)

  def cli(self, *args):
    return subprocess.run([sys.executable, str(SCRIPT), '--repo', str(self.root),
                           *args], capture_output=True, text=True)

  def test_noop_has_complete_tree_and_no_changes(self):
    result = self.prepare()
    self.assertEqual([], result['changes'])
    self.assertEqual([], result['changed_blobs'])
    self.assertEqual(self.git('rev-parse', 'HEAD^{tree}').decode().strip(), result['head']['tree'])
    self.assertEqual({'old.txt', 'tasks.md'}, {e['path'] for e in result['entries']})
    self.assertTrue(result['base_is_ancestor'])
    self.assertFalse(result['remote_presence_checked'])

  def test_changes_include_delete_binary_modes_and_unusual_paths(self):
    self.git('rm', '-q', 'old.txt')
    (self.root / 'binary.dat').write_bytes(b'\x00\xff\x01\r\n')
    name = '目录/tab\tand\nline.txt'
    self.write(name, 'retained exactly\n')
    self.write('run.sh', '#!/bin/sh\nexit 0\n')
    (self.root / 'run.sh').chmod(0o755)
    (self.root / 'link').symlink_to('../not-read.txt')
    head = self.commit('modes and names')
    result = self.prepare(head)
    by_path = {e['path']: e for e in result['entries']}
    self.assertEqual('100755', by_path['run.sh']['mode'])
    self.assertEqual('120000', by_path['link']['mode'])
    self.assertEqual(len('../not-read.txt'), by_path['link']['size'])
    self.assertEqual(5, by_path['binary.dat']['size'])
    self.assertIn(name, by_path)
    self.assertEqual('tree', by_path['目录']['type'])
    deleted = next(c for c in result['changes'] if c['path'] == 'old.txt')
    self.assertIsNone(deleted['after'])
    self.assertEqual(result, json.loads(json.dumps(result, ensure_ascii=False)))
    # Independent native tree enumeration, not this helper's parser.
    native = self.git('ls-tree', '-rz', '--full-tree', head).split(b'\0')
    expected = {}
    for line in filter(None, native):
      header, path = line.split(b'\t', 1)
      mode, kind, sha = header.decode().split()
      expected[path.decode()] = (mode, kind, sha)
    self.assertEqual(expected, {p: (e['mode'], e['type'], e['sha'])
                              for p, e in by_path.items() if e['type'] != 'tree'})

  def test_same_blob_reused_by_identity_not_name(self):
    self.write('renamed.txt', 'original\n')
    self.git('rm', '-q', 'old.txt')
    self.commit('same bytes new path')
    result = self.prepare()
    blob = result['changed_blobs'][0]
    self.assertEqual(['renamed.txt'], blob['paths'])
    self.assertEqual([result['base']['tree']], blob['same_object_in_trees'])

  def test_merge_new_content_is_not_old_prepared_blob(self):
    self.git('checkout', '-qb', 'candidate')
    self.write('tasks.md', 'candidate\n' + ''.join(f'line {i}\n' for i in range(1, 40)))
    self.write('new.md', 'prepared body\n')
    prepared = self.commit('prepared candidate')
    old_blob = self.git('rev-parse', prepared + ':tasks.md').decode().strip()
    self.git('checkout', '-q', 'main')
    self.write('tasks.md', ''.join(f'line {i}\n' for i in range(39)) + 'main advance\n')
    current_main = self.commit('other author advance')
    self.git('checkout', '-q', 'candidate')
    self.git('merge', '-qm', 'merge current main', 'main')
    result = module.prepare(self.root, current_main, 'HEAD', [prepared])
    blobs = {p: b for b in result['changed_blobs'] for p in b['paths']}
    self.assertNotEqual(old_blob, blobs['tasks.md']['sha'])
    self.assertEqual([], blobs['tasks.md']['same_object_in_trees'])
    self.assertEqual([self.git('rev-parse', prepared + '^{tree}').decode().strip()],
                     blobs['new.md']['same_object_in_trees'])
    self.assertTrue(result['base_is_ancestor'])

  def test_mode_only_change_preserves_blob_identity(self):
    (self.root / 'old.txt').chmod(0o755)
    self.commit('executable')
    result = self.prepare()
    self.assertEqual('100755', result['changes'][0]['after']['mode'])
    self.assertEqual([result['base']['tree']], result['changed_blobs'][0]['same_object_in_trees'])

  def test_reads_commits_not_dirty_worktree_and_does_not_mutate_index(self):
    expected = self.prepare()
    self.write('tasks.md', 'unstaged must not be read\n')
    self.write('untracked.md', 'not in commit\n')
    watched = ['.git/HEAD', '.git/index', '.git/refs/heads/main']
    before = {p: (self.root / p).read_bytes() for p in watched}
    self.assertEqual(expected, self.prepare())
    self.assertEqual(before, {p: (self.root / p).read_bytes() for p in watched})
    self.assertEqual('unstaged must not be read\n', (self.root / 'tasks.md').read_text())

  def test_gitlink_and_empty_tree_remain_in_complete_inventory(self):
    empty = self.git('mktree', input=b'').decode().strip()
    lines = self.git('ls-tree', 'HEAD')
    lines += f'040000 tree {empty}\tempty\n160000 commit {"a" * 40}\tsubmodule\n'.encode()
    tree = self.git('mktree', input=lines).decode().strip()
    head = self.git('commit-tree', tree, '-p', self.base, '-m', 'special trees').decode().strip()
    result = self.prepare(head)
    by_path = {e['path']: e for e in result['entries']}
    self.assertEqual('040000', by_path['empty']['mode'])
    self.assertEqual('commit', by_path['submodule']['type'])
    self.assertIsNone(by_path['submodule']['size'])
    self.assertEqual(tree, result['head']['tree'])

  def test_non_ancestor_is_reported_not_assumed_fast_forward(self):
    self.write('new.md', 'new\n')
    newer = self.commit('advance')
    result = module.prepare(self.root, newer, self.base)
    self.assertFalse(result['base_is_ancestor'])

  def test_invalid_or_missing_reference_has_no_partial_json(self):
    for args in ([], ['--base', 'missing'], ['--base', self.base, '--known-ref', '-bad'],
                 ['--base', self.base, '--head', 'HEAD:tasks.md']):
      with self.subTest(args=args):
        result = self.cli(*args)
        self.assertEqual(2, result.returncode)
        self.assertEqual('', result.stdout)
        self.assertTrue(result.stderr)

  def test_non_utf8_path_fails_explicitly_without_partial_output(self):
    name = os.fsencode(self.root) + b'/bad-\xff'
    with open(name, 'wb') as target:
      target.write(b'fixture')
    self.commit('non utf8')
    result = self.cli('--base', self.base)
    self.assertEqual(2, result.returncode)
    self.assertEqual('', result.stdout)
    self.assertIn('non-UTF-8', result.stderr)

  def test_unavailable_git_and_missing_repository_fail(self):
    with mock.patch.object(module.subprocess, 'run', side_effect=FileNotFoundError('git')):
      with self.assertRaises(module.InvalidInput):
        self.prepare()
    with self.assertRaises(module.InvalidInput):
      module.prepare(self.root / 'absent', 'HEAD', 'HEAD')

  def test_cli_json_and_duplicate_known_refs_are_deterministic(self):
    result = self.cli('--base', self.base, '--known-ref', self.base, '--known-ref', self.base)
    self.assertEqual(0, result.returncode, result.stderr)
    manifest = json.loads(result.stdout)
    self.assertNotIn('entries', manifest)
    self.assertEqual(2, manifest['target_entry_count'])
    self.assertEqual(module.prepare(self.root, self.base, 'HEAD'), manifest)
    full = self.cli('--base', self.base, '--full')
    self.assertEqual(0, full.returncode, full.stderr)
    self.assertEqual(self.prepare(), json.loads(full.stdout))


if __name__ == '__main__':
  unittest.main()
