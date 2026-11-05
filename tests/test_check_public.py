from contextlib import redirect_stderr, redirect_stdout
import io
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest
from unittest import mock


SCRIPT = Path(__file__).resolve().parents[1] / "scripts/check_public.py"
spec = importlib.util.spec_from_file_location("check_public", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

# Built at runtime so this file never contains a literal that the scanner flags.
FAKE_KEY = "sk-" + "A1b2C3d4" * 4
FAKE_HOME = "/Users/" + "alice" + "/project"
FAKE_EMAIL = "alice" + "@" + "gmail.com"
WORKSPACE_PREFIX = "/workspace/" + "scratch/"
FAKE_WORKSPACE = WORKSPACE_PREFIX + "ab12" * 3


def fake_provider_keys():
  """Deterministic shape fixtures, never issued or sent to a provider."""
  keys = ["sk-" + "A1" * 10 + "T3BlbkFJ" + "b2" * 10]
  for scope in ("proj", "svcacct", "admin"):
    for left, right in ((58, 58), (74, 74), (58, 74), (74, 58)):
      keys.append("sk-" + scope + "-" + "A1" * (left // 2)
                  + "T3BlbkFJ" + "b2" * (right // 2))
  for scope in ("api03", "admin01"):
    keys.append("sk-ant-" + scope + "-" + "A1_" * 31 + "AA")
  return keys


class PublicScanTests(unittest.TestCase):
  def setUp(self):
    # Receivers may place TEMP inside a checkout. All fixture roots below this
    # boundary must discover only their own .git, never the enclosing checkout.
    directory = self.enterContext(tempfile.TemporaryDirectory())
    self.enterContext(mock.patch.object(tempfile, "tempdir", directory))
    self.enterContext(mock.patch.dict(os.environ, {"GIT_CEILING_DIRECTORIES": directory}))

  def run_cli(self, root, *args):
    # Pin both sides of the pipe, independent of the host locale or Python alias.
    env = dict(os.environ, PYTHONIOENCODING="utf-8")
    return subprocess.run([sys.executable, str(SCRIPT), "--root", str(root), *args],
                          capture_output=True, text=True, encoding="utf-8", env=env)

  def run_cli_bytes(self, root, io_encoding):
    # Keep the child's stdout encoding as the condition under test and read the
    # pipe as raw bytes; run_cli above pins UTF-8 and would hide the failure.
    env = dict(os.environ, PYTHONIOENCODING=io_encoding)
    return subprocess.run([sys.executable, str(SCRIPT), "--root", str(root)],
                          capture_output=True, env=env)

  def run_fixture(self, files, git=False):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      for name, content in files.items():
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
      if git:
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
      return module.scan_files(root)

  def kinds(self, files):
    return sorted(f["kind"] for f in self.run_fixture(files)[1])

  def test_clean_and_placeholder_content_passes(self):
    text = ("Use noreply@anthropic.com, dev@example.com, x@users.noreply.github.com.\n"
            "Paths: /Users/Shared/Epic Games/, /home/user/repo, C:\\Users\\foo\\x, ~/.claude\n"
            "Words: task-gpu-exclusive-capture-window, desk-gpu-exclusive-render-lock\n")
    count, findings = self.run_fixture({"a.md": text})
    self.assertEqual((1, []), (count, findings))

  def test_flags_credential_key_path_and_email(self):
    files = {"a.md": f"token {FAKE_KEY}\n{FAKE_HOME}\nmail {FAKE_EMAIL}\n",
             "b.txt": "-----BEGIN RSA " + "PRIVATE KEY-----\n"}
    self.assertEqual(["credential", "email", "local-path", "private-key"], self.kinds(files))

  def test_flags_cloud_instance_root_and_descendants(self):
    for path in (FAKE_WORKSPACE, FAKE_WORKSPACE + "/", FAKE_WORKSPACE + "/repo/report.md",
                 FAKE_WORKSPACE + "/shared/result.json", WORKSPACE_PREFIX + "AB12" * 3):
      with self.subTest(path=path):
        count, findings = self.run_fixture({"a.md": f"Evidence: `{path}`\n"})
        self.assertEqual(1, count)
        self.assertEqual([{"kind": "local-path", "file": "a.md", "line": 1,
                           "match": path[:len(FAKE_WORKSPACE)]}], findings)

  def test_workspace_examples_and_non_instance_segments_pass(self):
    paths = ("/workspace/repo", "/workspace/shared/repo", WORKSPACE_PREFIX.rstrip("/"),
             WORKSPACE_PREFIX + "<instance-id>/repo", WORKSPACE_PREFIX + "${INSTANCE}/repo",
             WORKSPACE_PREFIX + "example/repo", "/tmp/example/repo",
             FAKE_WORKSPACE.lstrip("/"), "docs" + FAKE_WORKSPACE,
             "https://example.com" + FAKE_WORKSPACE,
             FAKE_WORKSPACE[:-1] + "/repo", FAKE_WORKSPACE + "0/repo",
             FAKE_WORKSPACE + "-example/repo", FAKE_WORKSPACE + ".example/repo",
             WORKSPACE_PREFIX + "gh12" * 3 + "/repo")
    for path in paths:
      with self.subTest(path=path):
        self.assertEqual((1, []), self.run_fixture({"a.md": path}))

  def test_cli_rejects_tracked_cloud_instance_path(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / "evidence.md").write_text(f"Evidence: `{FAKE_WORKSPACE}/report.md`\n", encoding="utf-8")
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      subprocess.run(["git", "-C", str(root), "add", "evidence.md"], check=True)
      result = self.run_cli(root)
      self.assertEqual(1, result.returncode)
      report = json.loads(result.stdout)
      self.assertEqual(1, report["checked_files"])
      self.assertEqual([{"kind": "local-path", "file": "evidence.md", "line": 1,
                         "match": FAKE_WORKSPACE}], report["findings"])
      self.assertEqual("", result.stderr)

  def test_credential_is_redacted_in_output(self):
    findings = self.run_fixture({"a.md": FAKE_KEY})[1]
    self.assertNotIn(FAKE_KEY, str(findings))

  def test_provider_shapes_detected_after_all_ascii_letters_and_digits(self):
    prefixes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    keys = fake_provider_keys()
    text = "\n".join(prefix + key for prefix in prefixes for key in keys)
    count, findings = self.run_fixture({"a.md": text})
    self.assertEqual(1, count)
    self.assertEqual(len(prefixes) * len(keys), len(findings))
    self.assertTrue(all(f["kind"] == "credential" for f in findings))
    self.assertEqual(list(range(1, len(findings) + 1)), [f["line"] for f in findings])
    for key in keys:
      self.assertNotIn(key, str(findings))

  def test_cli_rejects_adjacent_provider_shapes_and_redacts_output(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      keys = fake_provider_keys()
      text = "\n".join("https://example.com/x" + key + "suffix" for key in keys)
      (root / "synthetic.txt").write_text(text, encoding="utf-8")
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      subprocess.run(["git", "-C", str(root), "add", "synthetic.txt"], check=True)
      result = self.run_cli(root)
      self.assertEqual(1, result.returncode)
      report = json.loads(result.stdout)
      self.assertEqual(1, report["checked_files"])
      self.assertEqual(len(keys), len(report["findings"]))
      self.assertTrue(all(f["kind"] == "credential" and len(f["match"]) == 13
                          and f["match"].endswith("…") for f in report["findings"]))
      self.assertEqual("", result.stderr)
      for key in keys:
        self.assertNotIn(key, result.stdout + result.stderr)

  def test_weak_sk_shape_still_requires_word_edge(self):
    # Unknown embedded sk- strings remain ambiguous with ordinary hyphenated words.
    self.assertEqual((1, []), self.run_fixture({"a.md": "x" + FAKE_KEY + "\n1" + FAKE_KEY}))

  def test_provider_cli_output_encoding_is_independent_of_parent(self):
    with mock.patch.dict(os.environ, {"PYTHONIOENCODING": "gbk"}):
      self.test_cli_rejects_adjacent_provider_shapes_and_redacts_output()

  def test_embedded_provider_shapes_require_their_distinguishing_structure(self):
    variants = []
    for key in fake_provider_keys():
      variants.append("x" + key.replace("sk-", "zz-", 1))
      if "T3BlbkFJ" in key:
        variants.append("x" + key.replace("T3BlbkFJ", "T3BlbkF0"))
      else:
        variants.append("x" + key[:-2] + "BB")
    self.assertEqual((1, []), self.run_fixture({"a.md": "\n".join(variants)}))

  def test_allowlist_needs_exact_file_and_match(self):
    allow = f"# reviewed\na.md\t{FAKE_EMAIL}\n"
    files = {"a.md": FAKE_EMAIL, "b.md": FAKE_EMAIL, module.ALLOW_FILE: allow}
    self.assertEqual(["b.md"], [f["file"] for f in self.run_fixture(files)[1]])

  def index_fixture(self):
    root = Path(self.enterContext(tempfile.TemporaryDirectory()))
    subprocess.run(['git', 'init', '-q', str(root)], check=True)
    return root

  def index_add(self, root, *names):
    subprocess.run(['git', '-C', str(root), 'add', '--', *names], check=True)

  def test_staged_scan_uses_index_bytes_in_both_directions(self):
    for staged, worktree, expected in [(FAKE_KEY, 'clean', 1), ('clean', FAKE_KEY, 0)]:
      with self.subTest(staged_sensitive=expected):
        root = self.index_fixture()
        path = root / 'delivery.txt'
        path.write_text(staged, encoding='utf-8')
        self.index_add(root, 'delivery.txt')
        path.write_text(worktree, encoding='utf-8')
        index = (root / '.git/index').read_bytes()
        result = self.run_cli(root, '--staged')
        self.assertEqual(result.returncode, expected, result.stderr)
        report = json.loads(result.stdout)
        self.assertEqual(report['scope'], 'normal_git_index_blobs_only')
        self.assertEqual(report['skipped_entries'], [])
        self.assertEqual(report['checked_files'], 1)
        self.assertNotIn(FAKE_KEY, result.stdout)
        self.assertEqual(len(report['findings']), expected)
        self.assertEqual(self.run_cli(root).returncode, 1 - expected)
        self.assertEqual(path.read_text(encoding='utf-8'), worktree)
        self.assertEqual((root / '.git/index').read_bytes(), index)

  def test_staged_allowlist_comes_from_same_index(self):
    root = self.index_fixture()
    (root / 'scripts').mkdir()
    path = root / 'delivery.txt'
    path.write_text(FAKE_EMAIL, encoding='utf-8')
    allow = root / module.ALLOW_FILE
    allow.write_text('# no exemption\n', encoding='utf-8')
    self.index_add(root, 'delivery.txt', module.ALLOW_FILE)
    allow.write_text('delivery.txt\t' + FAKE_EMAIL + '\n', encoding='utf-8')
    self.assertEqual(self.run_cli(root, '--staged').returncode, 1)
    self.assertEqual(self.run_cli(root).returncode, 0)
    self.index_add(root, module.ALLOW_FILE)
    allow.write_text('# removed only in worktree\n', encoding='utf-8')
    self.assertEqual(self.run_cli(root, '--staged').returncode, 0)
    self.assertEqual(self.run_cli(root).returncode, 1)

  @unittest.skipUnless(hasattr(os, 'symlink'), 'requires symlink support')
  def test_staged_symlink_reads_original_link_not_worktree_target(self):
    root = self.index_fixture()
    path = root / 'link'
    path.symlink_to(FAKE_KEY)
    self.index_add(root, 'link')
    path.unlink()
    path.write_text('now clean', encoding='utf-8')
    result = self.run_cli(root, '--staged')
    self.assertEqual(result.returncode, 1, result.stderr)
    self.assertEqual(json.loads(result.stdout)['findings'][0]['file'], 'link')
    self.assertNotIn(FAKE_KEY, result.stdout)
    # A clean staged regular file must not follow its replacement symlink.
    self.index_add(root, 'link')
    target = root / 'untracked.txt'
    target.write_text(FAKE_KEY, encoding='utf-8')
    path.unlink()
    path.symlink_to(target)
    self.assertEqual(self.run_cli(root, '--staged').returncode, 0)
    self.assertEqual(target.read_text(encoding='utf-8'), FAKE_KEY)

  def test_staged_deletion_excludes_surviving_worktree_file(self):
    root = self.index_fixture()
    (root / 'removed.txt').write_text(FAKE_KEY, encoding='utf-8')
    self.index_add(root, 'removed.txt')
    subprocess.run(['git', '-C', str(root), 'update-index', '--force-remove', 'removed.txt'], check=True)
    result = self.run_cli(root, '--staged')
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertEqual(json.loads(result.stdout)['checked_files'], 0)
    self.assertTrue((root / 'removed.txt').exists())

  def test_staged_merge_stages_and_missing_objects_fail(self):
    root = self.index_fixture()
    oid = subprocess.run(['git', '-C', str(root), 'hash-object', '-w', '--stdin'],
                         input=b'clean', capture_output=True, check=True).stdout.strip().decode()
    for stage in ('1', '2', '3'):
      subprocess.run(['git', '-C', str(root), 'update-index', '--index-info'],
                     input=f'100644 {oid} {stage}\tconflict.txt\n'.encode(), check=True)
    result = self.run_cli(root, '--staged')
    self.assertEqual(result.returncode, 2)
    self.assertIn('unresolved merge entries', result.stderr)
    self.assertEqual(result.stdout, '')
    root = self.index_fixture()
    subprocess.run(['git', '-C', str(root), 'update-index', '--add', '--cacheinfo',
                    '100644', 'a' * 40, 'missing.txt'], check=True)
    result = self.run_cli(root, '--staged')
    self.assertEqual(result.returncode, 2)
    self.assertIn('cannot read selected Git index or local object', result.stderr)
    self.assertEqual(result.stdout, '')

  def test_staged_reports_non_utf8_and_gitlink_without_clearing_them(self):
    root = self.index_fixture()
    (root / 'encoded.txt').write_bytes(b'\xff' + FAKE_KEY.encode())
    self.index_add(root, 'encoded.txt')
    subprocess.run(['git', '-C', str(root), 'update-index', '--add', '--cacheinfo',
                    '160000', 'b' * 40, 'submodule'], check=True)
    result = self.run_cli(root, '--staged')
    self.assertEqual(result.returncode, 2, result.stderr)
    report = json.loads(result.stdout)
    self.assertEqual(report['status'], 'incomplete')
    self.assertEqual(report['checked_files'], 0)
    self.assertEqual(report['skipped_entries'], [
      {'file': 'encoded.txt', 'reason': 'unsupported_or_malformed_text'},
      {'file': 'submodule', 'reason': 'gitlink_target_not_scanned'}])
    self.assertIn('skipped entries are not cleared', ' '.join(report['limits']))

  def test_object_bom_encodings_scan_exact_blob_and_redact_matches(self):
    cases = [('utf-8-sig', b''), ('utf-16-le', b'\xff\xfe'),
             ('utf-16-be', b'\xfe\xff'), ('utf-32-le', b'\xff\xfe\x00\x00'),
             ('utf-32-be', b'\x00\x00\xfe\xff')]
    for encoding, bom in cases:
      for content, expected in [('文档\nclean\n', 0), ('文档\n' + FAKE_KEY + '\n', 1)]:
        with self.subTest(encoding=encoding, expected=expected):
          root = self.index_fixture()
          path = root / 'export.txt'
          path.write_bytes(bom + content.encode(encoding))
          self.index_add(root, 'export.txt')
          tree = self.index_tree(root)
          path.write_text('different worktree', encoding='utf-8')
          for args in [('--staged',), ('--tree', tree)]:
            result = self.run_cli(root, *args)
            self.assertEqual(result.returncode, expected, result.stderr)
            report = json.loads(result.stdout)
            self.assertEqual(report['checked_files'], 1)
            self.assertEqual(report['skipped_entries'], [])
            if expected:
              self.assertEqual(report['findings'][0]['line'], 2)
            self.assertNotIn(FAKE_KEY, result.stdout + result.stderr)

  def test_object_malformed_and_ambiguous_text_is_incomplete(self):
    cases = [b'\xff\xfe\x00', b'\xfe\xff\x00', b'\xff\xfe\x00\x00x',
             b'\x00\x00\xfe\xffx', b'\xef\xbb\xbf\xff',
             b'\xff' + FAKE_KEY.encode(),
             ('prefix' + FAKE_KEY).encode('utf-16-le'),
             FAKE_KEY.encode('utf-16-be'), FAKE_KEY.encode('utf-32-le'),
             b'prefix\x00' + FAKE_KEY.encode(),
             b'\xff\xfe' + b'\x00\xd8', b'\xff\xfe\x00\x00\x00\x00\x11\x00']
    for data in cases:
      with self.subTest(data=data[:8]):
        root = self.index_fixture()
        name = 'export-' + FAKE_KEY + '.txt'
        (root / name).write_bytes(data)
        self.index_add(root, name)
        tree = self.index_tree(root)
        for args in [('--staged',), ('--tree', tree)]:
          result = self.run_cli(root, *args)
          self.assertEqual(result.returncode, 2, result.stderr)
          report = json.loads(result.stdout)
          self.assertEqual(report['status'], 'incomplete')
          self.assertEqual(report['checked_files'], 0)
          self.assertEqual(len(report['skipped_entries']), 1)
          self.assertNotIn(FAKE_KEY, result.stdout + result.stderr)

  def test_object_bom_allowlist_uses_same_view_and_malformed_is_not_cleared(self):
    root = self.index_fixture()
    (root / 'scripts').mkdir()
    (root / 'delivery.txt').write_text(FAKE_KEY, encoding='utf-8')
    allow = root / module.ALLOW_FILE
    allow.write_bytes(('delivery.txt\t' + FAKE_KEY + '\n').encode('utf-16'))
    self.index_add(root, 'delivery.txt', module.ALLOW_FILE)
    allowed = self.index_tree(root)
    allow.write_bytes(b'\xff\xfe\x00')
    self.index_add(root, module.ALLOW_FILE)
    malformed = self.index_tree(root)
    for args, expected in [(('--tree', allowed), 0), (('--tree', malformed), 2),
                           (('--staged',), 2)]:
      result = self.run_cli(root, *args)
      self.assertEqual(result.returncode, expected, result.stderr)
      report = json.loads(result.stdout)
      if expected:
        self.assertEqual(report['status'], 'incomplete')
        self.assertEqual(len(report['findings']), 1)
        self.assertEqual(report['skipped_entries'][0]['file'], module.ALLOW_FILE)
      self.assertNotIn(FAKE_KEY, result.stdout + result.stderr)

  def test_staged_ignores_ambient_git_redirect_and_preserves_path_bytes(self):
    root = self.index_fixture()
    other = self.index_fixture()
    (other / 'secret.txt').write_text(FAKE_KEY, encoding='utf-8')
    self.index_add(other, 'secret.txt')
    name = 'odd\nname with spaces.txt'
    (root / name).write_text(FAKE_KEY, encoding='utf-8')
    self.index_add(root, name)
    with mock.patch.dict(os.environ, {'GIT_DIR': str(other / '.git'),
                                      'GIT_INDEX_FILE': str(other / '.git/index')}):
      result = self.run_cli(root, '--staged')
    self.assertEqual(result.returncode, 1, result.stderr)
    self.assertEqual(json.loads(result.stdout)['findings'][0]['file'], name)
    self.assertNotIn(FAKE_KEY, result.stdout)

  def index_tree(self, root):
    return subprocess.run(['git', '-C', str(root), 'write-tree'],
                          capture_output=True, text=True, check=True).stdout.strip()

  def test_fixed_tree_and_commit_do_not_follow_dirty_index_or_worktree(self):
    root = self.index_fixture()
    path = root / 'delivery.txt'
    path.write_text(FAKE_KEY, encoding='utf-8')
    self.index_add(root, 'delivery.txt')
    sensitive_tree = self.index_tree(root)
    path.write_text('clean', encoding='utf-8')
    self.index_add(root, 'delivery.txt')
    clean_tree = self.index_tree(root)
    commit = subprocess.run(['git', '-C', str(root), '-c', 'user.name=Fixture',
      '-c', 'user.email=fixture@example.com', 'commit-tree', clean_tree, '-m', 'fixture'],
      capture_output=True, text=True, check=True).stdout.strip()
    path.write_text(FAKE_KEY, encoding='utf-8')
    index = (root / '.git/index').read_bytes()
    for ref, tree, expected in [(sensitive_tree, sensitive_tree, 1),
                                (clean_tree, clean_tree, 0), (commit, clean_tree, 0)]:
      with self.subTest(ref=ref):
        result = self.run_cli(root, '--tree', ref)
        self.assertEqual(result.returncode, expected, result.stderr)
        report = json.loads(result.stdout)
        self.assertEqual(report['tree'], tree)
        self.assertEqual(report['scope'], 'git_tree_blobs_only')
        self.assertEqual(report['status'], 'findings' if expected else 'no_findings')
        self.assertEqual(report['skipped_entries'], [])
        self.assertNotIn(FAKE_KEY, result.stdout)
    self.assertEqual(self.run_cli(root, '--staged').returncode, 0)
    self.assertEqual(self.run_cli(root).returncode, 1)
    self.assertEqual((root / '.git/index').read_bytes(), index)
    self.assertEqual(path.read_text(encoding='utf-8'), FAKE_KEY)

  def test_tree_allowlist_is_fixed_and_symlink_is_not_configuration(self):
    root = self.index_fixture()
    (root / 'scripts').mkdir()
    (root / 'delivery.txt').write_text(FAKE_EMAIL, encoding='utf-8')
    allow = root / module.ALLOW_FILE
    allow.write_text('# no exemption\n', encoding='utf-8')
    self.index_add(root, 'delivery.txt', module.ALLOW_FILE)
    strict = self.index_tree(root)
    allow.write_text('delivery.txt\t' + FAKE_EMAIL + '\n', encoding='utf-8')
    self.index_add(root, module.ALLOW_FILE)
    relaxed = self.index_tree(root)
    for ref, expected in [(strict, 1), (relaxed, 0)]:
      result = self.run_cli(root, '--tree', ref)
      self.assertEqual(result.returncode, expected, result.stderr)
    allow.unlink()
    allow.symlink_to(FAKE_KEY)
    self.index_add(root, module.ALLOW_FILE)
    linked = self.index_tree(root)
    result = self.run_cli(root, '--tree', linked)
    self.assertEqual(result.returncode, 1, result.stderr)
    self.assertEqual(sorted(f['kind'] for f in json.loads(result.stdout)['findings']),
                     ['credential', 'email'])
    self.assertNotIn(FAKE_KEY, result.stdout)

  def test_object_modes_never_clear_skips_or_expose_sensitive_path_values(self):
    for data in [FAKE_KEY.encode(), b'\xff' + FAKE_KEY.encode(),
                 FAKE_KEY.encode('utf-16'), b'\xff\xfe\x00']:
      with self.subTest(data_kind=len(data)):
        root = self.index_fixture()
        name = 'export-' + FAKE_KEY + '.txt'
        (root / name).write_bytes(data)
        self.index_add(root, name)
        tree = self.index_tree(root)
        for args in [('--staged',), ('--tree', tree)]:
          result = self.run_cli(root, *args)
          self.assertEqual(result.returncode, 1 if data in (FAKE_KEY.encode(), FAKE_KEY.encode('utf-16')) else 2)
          self.assertNotIn(FAKE_KEY, result.stdout + result.stderr)
          report = json.loads(result.stdout)
          records = report['findings'] or report['skipped_entries']
          self.assertTrue(records[0]['file'].startswith('[redacted path sha256:'))
    root = self.index_fixture()
    subprocess.run(['git', '-C', str(root), 'update-index', '--add', '--cacheinfo',
                    '160000', 'b' * 40, FAKE_KEY], check=True)
    tree = self.index_tree(root)
    for args in [('--staged',), ('--tree', tree)]:
      result = self.run_cli(root, *args)
      self.assertEqual(result.returncode, 2)
      self.assertNotIn(FAKE_KEY, result.stdout + result.stderr)
      self.assertEqual(json.loads(result.stdout)['status'], 'incomplete')

  def test_tree_invalid_refs_modes_and_missing_repository_fail(self):
    root = self.index_fixture()
    for args in [('--tree', ''), ('--tree', 'missing'), ('--tree=--help',),
                 ('--tree', 'a' * 40), ('--staged', '--tree', 'HEAD')]:
      with self.subTest(args=args):
        result = self.run_cli(root, *args)
        self.assertEqual(result.returncode, 2)
        self.assertEqual(result.stdout, '')
    empty = Path(self.enterContext(tempfile.TemporaryDirectory()))
    self.assertEqual(self.run_cli(empty, '--staged').returncode, 2)
    self.assertEqual(self.run_cli(empty, '--tree', 'HEAD').returncode, 2)

  def test_staged_from_subdirectory_still_checks_complete_index(self):
    root = self.index_fixture()
    (root / 'sub').mkdir()
    (root / 'root.txt').write_text(FAKE_KEY, encoding='utf-8')
    (root / 'sub/child.txt').write_text('clean', encoding='utf-8')
    self.index_add(root, 'root.txt', 'sub/child.txt')
    result = self.run_cli(root / 'sub', '--staged')
    self.assertEqual(result.returncode, 1, result.stderr)
    report = json.loads(result.stdout)
    self.assertEqual(report['checked_files'], 2)
    self.assertEqual(report['findings'][0]['file'], 'root.txt')

  def test_object_modes_keep_identity_checks_in_the_same_repository(self):
    repos = []
    for email in ['fixture@example.com', 'fixture@users.noreply.github.com']:
      root = self.index_fixture()
      (root / 'clean.txt').write_text('clean', encoding='utf-8')
      self.index_add(root, 'clean.txt')
      subprocess.run(['git', '-C', str(root), '-c', 'user.name=Fixture',
                      '-c', 'user.email=' + email, 'commit', '-qm', 'fixture'], check=True)
      repos.append(root)
    for selected, foreign, expected in [(repos[0], repos[1], 1), (repos[1], repos[0], 0)]:
      for args in [('--staged',), ('--tree', 'HEAD')]:
        with self.subTest(selected=expected, args=args), mock.patch.dict(
            os.environ, {'GIT_DIR': str(foreign / '.git'),
                         'GIT_INDEX_FILE': str(foreign / '.git/index')}):
          result = self.run_cli(selected, *args, '--commits', 'HEAD')
        self.assertEqual(result.returncode, expected, result.stderr)
        report = json.loads(result.stdout)
        self.assertEqual(len(report['findings']), 2 if expected else 0)
        self.assertTrue(all(f['kind'] == 'commit-email' for f in report['findings']))

  def test_object_mode_identity_checks_ignore_replacement_commits(self):
    root = self.index_fixture()
    (root / 'clean.txt').write_text('clean', encoding='utf-8')
    self.index_add(root, 'clean.txt')
    tree = self.index_tree(root)
    commits = []
    for email in ['fixture@example.com', 'fixture@users.noreply.github.com']:
      commits.append(subprocess.run(['git', '-C', str(root), '-c', 'user.name=Fixture',
        '-c', 'user.email=' + email, 'commit-tree', tree, '-m', 'fixture'],
        capture_output=True, text=True, check=True).stdout.strip())
    subprocess.run(['git', '-C', str(root), 'replace', commits[0], commits[1]], check=True)
    for args in [('--staged',), ('--tree', commits[0])]:
      result = self.run_cli(root, *args, '--commits', commits[0])
      self.assertEqual(result.returncode, 1, result.stderr)
      findings = json.loads(result.stdout)['findings']
      self.assertEqual(len(findings), 2)
      self.assertTrue(all(f['kind'] == 'commit-email' for f in findings))

  def test_object_mode_commit_range_cannot_override_options_or_be_a_path(self):
    root = self.index_fixture()
    (root / 'clean.txt').write_text('clean', encoding='utf-8')
    self.index_add(root, 'clean.txt')
    subprocess.run(['git', '-C', str(root), '-c', 'user.name=Fixture',
                    '-c', 'user.email=fixture@example.com', 'commit', '-qm', 'fixture'], check=True)
    for args in [('--staged',), ('--tree', 'HEAD')]:
      for revisions in ['--format=', '--max-count=0', '--all', 'clean.txt', 'missing-ref',
                        'HEAD^{tree}', 'HEAD:clean.txt', '^HEAD', 'HEAD^!',
                        'HEAD...', 'HEAD...HEAD', '..HEAD', 'HEAD..', 'HEAD..^HEAD']:
        with self.subTest(args=args, revisions=revisions):
          result = self.run_cli(root, *args, '--commits=' + revisions)
          self.assertEqual(result.returncode, 2)
          self.assertEqual(result.stdout, '')
      for revisions, expected in [('HEAD', 1), ('HEAD..HEAD', 0)]:
        with self.subTest(args=args, revisions=revisions):
          result = self.run_cli(root, *args, '--commits', revisions)
          self.assertEqual(result.returncode, expected, result.stderr)
          report = json.loads(result.stdout)
          self.assertEqual(len(report['findings']), 2 if expected else 0)
          self.assertEqual(report['identity_check']['checked_commits'], 1 if expected else 0)
          self.assertIn('selected commit set only', report['identity_check']['scope'])
          self.assertRegex(report['identity_check']['selection'],
                           r'^[0-9a-f]{40}(?:\.\.[0-9a-f]{40})?$')

  def test_untracked_files_are_ignored_in_git_checkout(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      (root / "tracked.md").write_text("ok", encoding="utf-8")
      subprocess.run(["git", "-C", str(root), "add", "tracked.md"], check=True)
      (root / "scratch.md").write_text(FAKE_EMAIL, encoding="utf-8")
      self.assertEqual((1, []), module.scan_files(root))

  def test_fixture_suite_under_parent_git_keeps_its_own_scan_scope(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      (root / "parent.txt").write_text("keep the enclosing checkout unchanged\n", encoding="utf-8")
      subprocess.run(["git", "-C", str(root), "add", "parent.txt"], check=True)
      index = (root / ".git/index").read_bytes()
      scratch = root / "scratch"
      scratch.mkdir()
      env = dict(os.environ, TMPDIR=str(scratch), TEMP=str(scratch), TMP=str(scratch),
                 PYTHONIOENCODING="utf-8")
      env.pop("GIT_CEILING_DIRECTORIES", None)
      cases = ("test_clean_and_placeholder_content_passes", "test_flags_credential_key_path_and_email",
               "test_dangling_and_directory_symlinks_scan_link_text", "test_cli_unicode_output_ignores_parent_locale",
               "test_untracked_files_are_ignored_in_git_checkout")
      result = subprocess.run([sys.executable, str(Path(__file__)), *[f"PublicScanTests.{name}" for name in cases]],
                              env=env, capture_output=True, text=True, encoding="utf-8")
      self.assertEqual(0, result.returncode, result.stdout + result.stderr)
      self.assertIn("Ran 5 tests", result.stderr)
      self.assertNotIn("skipped", result.stderr)
      self.assertEqual(index, (root / ".git/index").read_bytes())
      self.assertEqual([], list(scratch.iterdir()))

  def test_tracked_symlink_scans_link_text_not_target_content(self):
    with tempfile.TemporaryDirectory() as directory:
      fixture = Path(directory)
      root = fixture / "repo"
      root.mkdir()
      target = fixture / FAKE_KEY
      target.write_text("clean target", encoding="utf-8")
      (root / "flagged-link").symlink_to(Path("..") / target.name)
      content_target = fixture / "content-target"
      content_target.write_text(FAKE_KEY, encoding="utf-8")
      (root / "clean-link").symlink_to(Path("..") / content_target.name)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
      with mock.patch.object(Path, "read_text", side_effect=AssertionError("symlink target read")):
        count, findings = module.scan_files(root)
      self.assertEqual(2, count)
      self.assertEqual([("credential", "flagged-link")],
                       [(f["kind"], f["file"]) for f in findings])
      self.assertNotIn(FAKE_KEY, str(findings))

  def test_dangling_and_directory_symlinks_scan_link_text(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / "dangling").symlink_to(FAKE_KEY)
      (root / "directory").symlink_to(".", target_is_directory=True)
      count, findings = module.scan_files(root)
      self.assertEqual(2, count)
      self.assertEqual([("credential", "dangling")],
                       [(f["kind"], f["file"]) for f in findings])

  def test_symlink_text_is_not_normalized(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      target = "./missing//child"
      (root / "link").symlink_to(target)
      with mock.patch.object(module, "PATTERNS", [("link-text", re.compile(re.escape(target)))]):
        self.assertEqual((1, [{"kind": "link-text", "file": "link", "line": 1,
                              "match": target}]), module.scan_files(root))

  def test_symlink_fixtures_do_not_leak_the_temporary_parent(self):
    with tempfile.TemporaryDirectory() as directory:
      # Detect accidental absolute fixture paths without needing a real home
      # directory or a Windows-shaped filename on the host filesystem.
      patterns = module.PATTERNS + [("local-path", re.compile(re.escape(directory)))]
      with mock.patch.object(tempfile, "tempdir", directory), \
           mock.patch.object(module, "PATTERNS", patterns):
        self.test_tracked_symlink_scans_link_text_not_target_content()
        self.test_dangling_and_directory_symlinks_scan_link_text()
        self.test_symlink_allowlist_is_scanned_not_loaded()

  def test_core_symlinks_false_scans_plain_link_file(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / "link").symlink_to(FAKE_KEY)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      subprocess.run(["git", "-C", str(root), "add", "link"], check=True)
      (root / "link").unlink()
      subprocess.run(["git", "-C", str(root), "-c", "core.symlinks=false",
                      "checkout-index", "-f", "link"], check=True)
      self.assertFalse((root / "link").is_symlink())
      self.assertEqual(FAKE_KEY, (root / "link").read_text(encoding="utf-8"))
      count, findings = module.scan_files(root)
      self.assertEqual(1, count)
      self.assertEqual(["credential"], [f["kind"] for f in findings])

  def test_symlink_allowlist_is_scanned_not_loaded(self):
    with tempfile.TemporaryDirectory() as directory:
      fixture = Path(directory)
      root = fixture / "repo"
      (root / "scripts").mkdir(parents=True)
      (root / "tracked.txt").write_text(FAKE_KEY, encoding="utf-8")
      target = fixture / FAKE_KEY
      target.write_text(f"tracked.txt\t{FAKE_KEY}\n", encoding="utf-8")
      (root / module.ALLOW_FILE).symlink_to(Path("../..") / target.name)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
      self.assertEqual(set(), module.load_allow(root))
      count, findings = module.scan_files(root)
      self.assertEqual(2, count)
      self.assertEqual([module.ALLOW_FILE, "tracked.txt"], [f["file"] for f in findings])

  def test_core_symlinks_false_allowlist_text_is_scanned_not_loaded(self):
    for target_text in (FAKE_KEY, f"tracked.txt\t{FAKE_KEY}"):
      with self.subTest(target_text=target_text), tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / "scripts").mkdir()
        (root / "tracked.txt").write_text(FAKE_KEY, encoding="utf-8")
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        subprocess.run(["git", "-C", str(root), "add", "tracked.txt"], check=True)
        # Model a real 120000 index entry without creating a tab-containing
        # target filename, which native Windows cannot represent.
        blob = subprocess.run(["git", "-C", str(root), "hash-object", "-w", "--stdin"],
                              input=target_text.encode("utf-8"), capture_output=True, check=True)
        subprocess.run(["git", "-C", str(root), "update-index", "--add", "--cacheinfo",
                        "120000", blob.stdout.decode("ascii").strip(), module.ALLOW_FILE], check=True)
        subprocess.run(["git", "-C", str(root), "-c", "core.symlinks=false",
                        "checkout-index", "-f", module.ALLOW_FILE], check=True)
        self.assertFalse((root / module.ALLOW_FILE).is_symlink())
        self.assertEqual(target_text, (root / module.ALLOW_FILE).read_text(encoding="utf-8"))
        self.assertEqual(set(), module.load_allow(root))
        count, findings = module.scan_files(root)
        self.assertEqual(2, count)
        self.assertEqual([module.ALLOW_FILE, "tracked.txt"], [f["file"] for f in findings])

  def test_tracked_path_and_allowlist_beneath_symlink_fail_without_reading(self):
    with tempfile.TemporaryDirectory() as directory:
      fixture = Path(directory)
      root = fixture / "repo"
      (root / "nested").mkdir(parents=True)
      (root / "nested/tracked.txt").write_text("clean original", encoding="utf-8")
      (root / "scripts").mkdir()
      (root / module.ALLOW_FILE).write_text("# clean original\n", encoding="utf-8")
      (root / "tracked.txt").write_text(FAKE_KEY, encoding="utf-8")
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
      target = fixture / "new-target"
      target.mkdir()
      (target / "tracked.txt").write_text(FAKE_KEY, encoding="utf-8")
      (target / "public-scan-allow.txt").write_text(f"tracked.txt\t{FAKE_KEY}\n", encoding="utf-8")
      for name in ("nested", "scripts"):
        (root / name).rename(fixture / ("original-" + name))
        (root / name).symlink_to(target, target_is_directory=True)
      self.assertEqual(set(), module.load_allow(root))
      result = self.run_cli(root)
      self.assertEqual(1, result.returncode)
      report = json.loads(result.stdout)
      self.assertEqual(1, report["checked_files"])
      self.assertEqual([("symlink-parent", "nested/tracked.txt"),
                        ("symlink-parent", module.ALLOW_FILE), ("credential", "tracked.txt")],
                       [(f["kind"], f["file"]) for f in report["findings"]])
      self.assertEqual("", result.stderr)

  def test_index_symlink_fixture_needs_no_control_character_filename(self):
    write_text = Path.write_text

    def reject_tab_filename(path, *args, **kwargs):
      if "\t" in path.name:
        raise OSError("control character in filename is not supported")
      return write_text(path, *args, **kwargs)

    with mock.patch.object(Path, "write_text", reject_tab_filename):
      self.test_core_symlinks_false_allowlist_text_is_scanned_not_loaded()

  def test_binary_and_missing_root(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      (root / "x.bin").write_bytes(b"\xff\xfe\x00")
      self.assertEqual((0, []), module.scan_files(root))
    result = self.run_cli("/nonexistent-root-for-test")
    self.assertEqual(2, result.returncode)

  def scan_identity(self, author, committer):
    result = subprocess.CompletedProcess([], 0, f"abc123\t{author}\t{committer}\n", "")
    with mock.patch.object(module.subprocess, "run", return_value=result):
      return module.scan_commits(Path("."), "HEAD")

  def test_github_commit_identities_pass_for_both_roles(self):
    for email in ("example@users.noreply.github.com",
                  "1+example-user@users.noreply.github.com",
                  "1+example[bot]@users.noreply.github.com",
                  "1+example_org@users.noreply.github.com", "noreply@github.com"):
      with self.subTest(email=email):
        self.assertEqual([], self.scan_identity(email, email))

  def test_agent_platform_noreply_is_exact_match(self):
    self.assertEqual([], self.scan_identity("noreply@anthropic.com", "noreply@anthropic.com"))
    for email in ("Noreply@anthropic.com", "noreply@anthropic.com.invalid", "dev" + "@" + "anthropic.com"):
      with self.subTest(email=email):
        self.assertEqual(2, len(self.scan_identity(email, email)))

  def test_other_and_malformed_commit_identities_fail_for_each_role(self):
    invalid = ("dev@example.com", "noreply@example.com", "dev@invalid.example",
               "example@users.noreply.github.com.invalid", "noreply@github.com.invalid",
               "example@" + "notusers.noreply.github.com", "@users.noreply.github.com",
               "a@@users.noreply.github.com", "a b@users.noreply.github.com",
               "+example@users.noreply.github.com", "1+@users.noreply.github.com",
               "example+other@users.noreply.github.com", "-example@users.noreply.github.com",
               "\u0131@users.noreply.github.com",
               "", "invalid", " noreply@github.com", "noreply@github.com ")
    good = "noreply@github.com"
    for email in invalid:
      for role in ("author", "committer"):
        with self.subTest(email=email, role=role):
          findings = self.scan_identity(email if role == "author" else good,
                                        email if role == "committer" else good)
          self.assertEqual([role], [f["role"] for f in findings])
          self.assertEqual("commit-email", findings[0]["kind"])

  def test_non_email_commit_identity_is_not_disclosed(self):
    for email in ("", "invalid-identity-example"):
      with self.subTest(email=email):
        findings = self.scan_identity(email, email)
        self.assertEqual(["[non-email]", "[non-email]"], [f["match"] for f in findings])
        if email:
          self.assertNotIn(email, str(findings))

  def test_cli_rejects_explicit_empty_commit_range(self):
    with tempfile.TemporaryDirectory() as directory:
      omitted = self.run_cli(directory)
      self.assertEqual(0, omitted.returncode)
      empty = self.run_cli(directory, "--commits", "")
      self.assertEqual(2, empty.returncode)
      self.assertIn("--commits must not be empty", empty.stderr)
      self.assertEqual("", empty.stdout)

  def test_cli_unicode_output_ignores_parent_locale(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      name = "测试-🧪.txt"
      (root / name).write_text(FAKE_KEY, encoding="utf-8")
      with mock.patch.object(subprocess, "_text_encoding", return_value="gbk"), \
           mock.patch.dict(os.environ, {"PYTHONIOENCODING": "gbk"}):
        result = self.run_cli(root)
      self.assertEqual(1, result.returncode)
      report = json.loads(result.stdout)
      self.assertEqual(1, report["checked_files"])
      self.assertEqual([(name, "credential")], [(f["file"], f["kind"]) for f in report["findings"]])
      self.assertNotIn(FAKE_KEY, result.stdout + result.stderr)
      self.assertEqual("", result.stderr)

  def test_cli_clean_unicode_file_output_parses_in_any_stdout_encoding(self):
    name = "测试-🧪.txt"
    for io_encoding in ("utf-8", "gbk", "ascii"):
      with self.subTest(io_encoding=io_encoding), tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / name).write_text("clean documentation\n", encoding="utf-8")
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
        result = self.run_cli_bytes(root, io_encoding)
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertEqual(b"", result.stderr)
        report = json.loads(result.stdout.decode("utf-8"))
        self.assertEqual(1, report["checked_files"])
        self.assertEqual([], report["findings"])

  def test_cli_unicode_finding_output_parses_in_any_stdout_encoding(self):
    name = "测试-🧪.txt"
    for io_encoding in ("utf-8", "gbk", "ascii"):
      with self.subTest(io_encoding=io_encoding), tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / name).write_text(f"token {FAKE_KEY}\n", encoding="utf-8")
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
        result = self.run_cli_bytes(root, io_encoding)
        self.assertEqual(1, result.returncode, result.stderr)
        self.assertNotIn(b"Traceback", result.stderr)
        self.assertEqual(b"", result.stderr)
        report = json.loads(result.stdout.decode("utf-8"))
        self.assertEqual(1, report["checked_files"])
        self.assertEqual([{"kind": "credential", "file": name, "line": 1,
                           "match": FAKE_KEY[:12] + "…"}], report["findings"])
        self.assertNotIn(FAKE_KEY.encode("utf-8"), result.stdout + result.stderr)

  def test_main_supports_text_only_stdout_with_unicode_findings(self):
    name = "测试-🧪.txt"
    for content, expected_code in (("clean documentation\n", 0), (FAKE_KEY, 1)):
      with self.subTest(expected_code=expected_code), tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / name).write_text(content, encoding="utf-8")
        subprocess.run(["git", "init", "-q", str(root)], check=True)
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
        stdout, stderr = io.StringIO(), io.StringIO()
        with mock.patch.object(sys, "argv", [str(SCRIPT), "--root", str(root)]), \
             redirect_stdout(stdout), redirect_stderr(stderr):
          code = module.main()
        self.assertEqual(expected_code, code)
        self.assertEqual("", stderr.getvalue())
        report = json.loads(stdout.getvalue())
        self.assertEqual(1, report["checked_files"])
        expected = [{"kind": "credential", "file": name, "line": 1,
                     "match": FAKE_KEY[:12] + "…"}] if expected_code else []
        self.assertEqual(expected, report["findings"])
        self.assertNotIn(FAKE_KEY, stdout.getvalue() + stderr.getvalue())

  def test_cli_usage_error_keeps_exit_2_in_any_stdout_encoding(self):
    for io_encoding in ("utf-8", "gbk", "ascii"):
      with self.subTest(io_encoding=io_encoding):
        result = self.run_cli_bytes("/nonexistent-root-for-test", io_encoding)
        self.assertEqual(2, result.returncode)
        self.assertEqual(b"", result.stdout)
        self.assertIn(b"--root must be an existing directory", result.stderr)

  def test_commit_identity(self):
    with tempfile.TemporaryDirectory() as directory:
      root = Path(directory)
      subprocess.run(["git", "init", "-q", str(root)], check=True)
      for email in ("1+example@users.noreply.github.com", "dev@example.com"):
        subprocess.run(["git", "-C", str(root), "-c", "user.name=t", "-c", f"user.email={email}",
                        "commit", "-q", "--allow-empty", "-m", "x"], check=True)
      findings = module.scan_commits(root, "HEAD")
      self.assertEqual(["author", "committer"], [f["role"] for f in findings])
      self.assertTrue(all(f["kind"] == "commit-email" for f in findings))
      self.assertNotIn("dev@example.com", str(findings))
      self.assertEqual([], module.scan_commits(root, "HEAD..HEAD"))
      for revisions in ("", "no-such-ref"):
        with self.subTest(revisions=revisions), self.assertRaises(ValueError):
          module.scan_commits(root, revisions)


if __name__ == "__main__":
  unittest.main()
