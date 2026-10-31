#!/usr/bin/env python3
"""Reproduce #556 only in newly created synthetic repositories; not a repair tool."""
import argparse
import hashlib
import json
import pathlib
import subprocess

BINARY_SHA256 = '957e822cfa7e435cd84a297cd96c419b58e51e3ac58be249762c24bd9e45099b'


def digest(data):
    return hashlib.sha256(data).hexdigest()


class Fixture:
    def __init__(self, root, binary):
        self.root, self.binary = root, binary
        root.mkdir()
        for name in ('home', 'tmp'):
            (root / name).mkdir()
        home = root / 'home'
        self.env = {
            'PATH': '/usr/bin:/bin', 'HOME': str(home),
            'GH_CONFIG_DIR': str(home / 'gh'), 'XDG_CONFIG_HOME': str(home / 'config'),
            'XDG_STATE_HOME': str(home / 'state'), 'TMPDIR': str(root / 'tmp'),
            'GIT_CONFIG_NOSYSTEM': '1', 'GIT_CONFIG_GLOBAL': '/dev/null',
            'GIT_ALLOW_PROTOCOL': 'file', 'GIT_TERMINAL_PROMPT': '0',
            'GIT_ASKPASS': '/bin/false', 'GIT_EDITOR': 'true', 'GIT_SEQUENCE_EDITOR': 'true',
            'GH_PROMPT_DISABLED': '1', 'GH_STACK_NO_UPDATE_NOTIFIER': '1',
            'GH_NO_UPDATE_NOTIFIER': '1', 'LC_ALL': 'C.UTF-8',
            'HTTPS_PROXY': 'http://127.0.0.1:9', 'HTTP_PROXY': 'http://127.0.0.1:9',
            'NO_PROXY': '',
            'GIT_AUTHOR_DATE': '2026-10-31T00:00:00+00:00',
            'GIT_COMMITTER_DATE': '2026-10-31T00:00:00+00:00',
        }
        self.log = []
        self.repo = root / 'repo'
        self.sub = self.repo / 'vendor/lib'
        self.journal = self.repo / '.git/gh-stack-rebase-state'

    def run(self, args, cwd=None, expected=0):
        cwd = cwd or self.repo
        p = subprocess.run([str(x) for x in args], cwd=cwd, env=self.env,
                           text=True, capture_output=True, timeout=30)
        self.log.append({'args': [str(x) for x in args], 'cwd': str(cwd),
                         'exit': p.returncode, 'stdout': p.stdout, 'stderr': p.stderr})
        (self.root / 'transcript.json').write_text(json.dumps(self.log, indent=2))
        if expected is not None and p.returncode != expected:
            raise AssertionError(self.log[-1])
        return p

    def git(self, *args, cwd=None):
        return self.run(['git', *args], cwd).stdout.strip()

    def init(self, path):
        path.mkdir()
        self.git('init', '-b', 'main', cwd=path)
        self.git('config', 'user.name', 'Synthetic submodule trial', cwd=path)
        self.git('config', 'user.email', 'trial@users.noreply.github.com', cwd=path)
        self.git('config', 'rerere.enabled', 'true', cwd=path)

    def setup(self):
        seed = self.root / 'sub-seed'
        self.init(seed)
        self.pins = []
        for value in ('A', 'B', 'C'):
            (seed / 'version.txt').write_text(value + '\n')
            self.git('add', '.', cwd=seed)
            self.git('commit', '-m', 'submodule ' + value, cwd=seed)
            self.pins.append(self.git('rev-parse', 'HEAD', cwd=seed))
        self.git('clone', '--bare', seed, self.root / 'sub-origin.git', cwd=self.root)
        self.init(self.repo)
        self.git('submodule', 'add', self.root / 'sub-origin.git', 'vendor/lib')
        self.git('checkout', self.pins[0], cwd=self.sub)
        (self.repo / 'base.txt').write_text('baseline\n')
        self.git('add', '.')
        self.git('commit', '-m', 'baseline submodule A')
        self.git('clone', '--bare', self.repo, self.root / 'origin.git', cwd=self.root)
        self.git('remote', 'add', 'origin', self.root / 'origin.git')
        for branch in ('branch1', 'branch2'):
            self.git('switch', '-c', branch)
            (self.repo / (branch + '.txt')).write_text(branch + '\n')
            self.git('add', '.')
            self.git('commit', '-m', branch + ' feature')
        self.git('push', 'origin', 'main', 'branch1', 'branch2')
        self.run([self.binary, 'init', '--base', 'main', 'branch1', 'branch2'])
        self.git('switch', 'main')
        self.git('checkout', self.pins[1], cwd=self.sub)
        self.git('add', 'vendor/lib')
        self.git('commit', '-m', 'trunk pin B')
        self.git('push', 'origin', 'main')
        self.git('switch', 'branch2')
        self.git('checkout', self.pins[0], cwd=self.sub)
        self.before = self.snapshot()
        assert not self.before['status'] and not self.before['sub_status']
        assert self.before['sub_head'] == self.before['index_pin'] == self.pins[0]
        p = self.run([self.binary, 'rebase', '--remote', 'origin'], expected=1)
        self.failed = self.snapshot()
        assert self.failed['refs']['branch1'] != self.before['refs']['branch1']
        assert self.failed['refs']['branch2'] == self.before['refs']['branch2']
        assert self.failed['index_pin'] == self.pins[1]
        assert self.failed['sub_head'] == self.pins[0] and self.failed['phase'] == 'restoring'
        assert 'recovery state was retained' in p.stderr

    def snapshot(self):
        journal = self.journal.read_bytes() if self.journal.exists() else b''
        index = self.git('ls-files', '--stage', 'vendor/lib').split()
        assert len(index) == 4 and index[0] == '160000' and index[2] == '0'
        files = {str(p.relative_to(self.sub)): digest(p.read_bytes())
                 for p in self.sub.rglob('*') if p.is_file() and p.name != '.git'}
        return {
            'refs': {b: self.git('rev-parse', b) for b in ('main', 'branch1', 'branch2')},
            'branch': self.git('branch', '--show-current'), 'index_pin': index[1],
            'sub_head': self.git('rev-parse', 'HEAD', cwd=self.sub),
            'status': self.git('status', '--porcelain', '--untracked-files=all', '--ignore-submodules=none'),
            'sub_status': self.git('status', '--porcelain', '--untracked-files=all', cwd=self.sub),
            'ignored': self.git('ls-files', '--others', '--ignored', '--exclude-standard', cwd=self.sub),
            'files': files, 'journal_sha256': digest(journal) if journal else None,
            'phase': json.loads(journal)['phase'] if journal else None,
        }

    def eligible(self, expected_checkout):
        """Narrow fixture guard, deliberately not a general production recovery algorithm."""
        now = self.snapshot()
        if self.before['sub_head'] != self.before['index_pin'] or self.before['sub_status']:
            return False, 'unproven_pre_operation_state'
        if now['sub_status']:
            return False, 'submodule_work_present'
        if now['ignored']:
            return False, 'ignored_files_present'
        if now['sub_head'] != expected_checkout:
            return False, 'unrecognized_submodule_head'
        if now['index_pin'] == now['sub_head'] or now['phase'] != 'restoring':
            return False, 'not_expected_checkout_drift'
        p = self.run(['git', 'cat-file', '-e', now['index_pin'] + '^{commit}'],
                     self.sub, expected=None)
        return (p.returncode == 0, 'eligible' if p.returncode == 0 else 'object_missing')

    def align(self, expected_checkout):
        ok, reason = self.eligible(expected_checkout)
        assert ok, reason
        target = self.snapshot()['index_pin']
        self.git('submodule', 'update', '--checkout', '--no-fetch', '--', 'vendor/lib')
        assert self.snapshot()['sub_head'] == target


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--gh-stack', type=pathlib.Path, required=True)
    p.add_argument('--root', type=pathlib.Path, required=True, help='must not already exist')
    args = p.parse_args()
    binary, root = args.gh_stack.resolve(), args.root.resolve()
    if root.exists():
        p.error('--root must not exist; never point this probe at an existing repository')
    if digest(binary.read_bytes()) != BINARY_SHA256:
        p.error('expected official v0.3.0 linux-amd64 release digest')
    root.mkdir()
    f = Fixture(root / 'recovery', binary)
    f.setup()
    f.run([binary, 'rebase', '--abort'], expected=1)
    assert f.snapshot() == f.failed
    f.align(f.pins[0])
    f.run([binary, 'rebase', '--abort'], expected=1)
    partial = f.snapshot()
    assert partial['refs'] == f.before['refs']
    assert partial['index_pin'] == f.pins[0] and partial['sub_head'] == f.pins[1]
    assert partial['phase'] == 'restoring' and partial['branch'] == 'branch1'
    f.align(f.pins[1])  # only our preceding, recorded alignment authorizes this expected HEAD
    f.run([binary, 'rebase', '--abort'])
    end = f.snapshot()
    assert end['refs'] == f.before['refs'] and end['branch'] == 'branch2'
    assert end['sub_head'] == end['index_pin'] == f.pins[0]
    assert not end['status'] and not end['sub_status'] and end['phase'] is None
    rows = []
    for name in ('tracked_edit', 'untracked_file', 'local_commit', 'ignored_file'):
        c = Fixture(root / name, binary)
        c.setup()
        if name == 'tracked_edit':
            (c.sub / 'version.txt').write_text('KEEP UNCOMMITTED\n')
        elif name == 'untracked_file':
            (c.sub / 'work.txt').write_text('KEEP UNTRACKED\n')
        elif name == 'local_commit':
            c.git('config', 'user.name', 'Synthetic local work', cwd=c.sub)
            c.git('config', 'user.email', 'trial@users.noreply.github.com', cwd=c.sub)
            (c.sub / 'version.txt').write_text('KEEP LOCAL COMMIT\n')
            c.git('add', 'version.txt', cwd=c.sub)
            c.git('commit', '-m', 'unrecorded local work', cwd=c.sub)
        else:
            gitdir = pathlib.Path(c.git('rev-parse', '--absolute-git-dir', cwd=c.sub))
            with (gitdir / 'info/exclude').open('a') as fp:
                fp.write('\nignored.txt\n')
            (c.sub / 'ignored.txt').write_text('KEEP IGNORED\n')
        before = c.snapshot()
        allowed, reason = c.eligible(c.pins[0])
        after = c.snapshot()
        assert not allowed and before == after
        rows.append({'case': name, 'alignment_allowed': allowed, 'reason': reason,
                     'content_head_refs_journal_preserved': before == after,
                     'submodule_status_clean': not bool(before['sub_status'])})
    result = {
        'schema': 1, 'scope': 'synthetic issue-driven local CLI/Git; not production recovery acceptance',
        'gh_stack': '0.3.0', 'binary_sha256': BINARY_SHA256,
        'source_commit': '2a49e6751238633db504655d8a8eba3e433e827d',
        'git': f.git('--version'), 'rebase_exit': 1,
        'first_layer_changed_on_failure': True, 'second_layer_unchanged': True,
        'initial_abort_exit': 1, 'initial_abort_snapshot_unchanged': True,
        'after_first_alignment_abort_exit': 1, 'refs_restored_but_checkout_still_mismatched': True,
        'after_second_alignment_abort_exit': 0, 'original_layers_and_branch_restored': True,
        'submodule_matches_index_and_clean': True, 'journal_removed': True,
        'trunk_stays_advanced': True, 'guards': rows,
        'network_observation': 'not dynamically verified; isolated config, local remotes, file-only Git and fail-closed proxy are preventive controls',
    }
    (root / 'results.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
