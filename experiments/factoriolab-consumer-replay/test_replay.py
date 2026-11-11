"""Offline regressions: python3 experiments/factoriolab-consumer-replay/test_replay.py.

Uses only stdlib, Bash and Node; never installs dependencies or runs replay setup.
"""
import copy
import json
import os
from pathlib import Path
import shlex
import subprocess
import sys
import tempfile
import unittest

HERE = Path(__file__).resolve().parent


class ReplayTests(unittest.TestCase):
  def setUp(self):
    self.temp = tempfile.TemporaryDirectory(prefix='replay-unit-')
    self.addCleanup(self.temp.cleanup)
    self.root = Path(self.temp.name)

  def script(self, name, *args):
    return subprocess.run(
      [sys.executable, str(HERE / name), *map(str, args)],
      env={**os.environ, 'PYTHONOPTIMIZE': '1', 'PYTHONDONTWRITEBYTECODE': '1'},
      capture_output=True, text=True, timeout=10,
    )

  def report(self):
    return {
      'success': True, 'numTotalTests': 29, 'numPassedTests': 29,
      'numFailedTests': 0, 'numPendingTests': 0, 'numTodoTests': 0,
      'testResults': [
        {'name': '/fixture/src/components/button/button.spec.ts',
        'status': 'passed', 'assertionResults': [{'status': 'passed'}]},
        {'name': '/fixture/src/state/router/migration.spec.ts',
        'status': 'passed',
        'assertionResults': [{'status': 'passed'} for _ in range(28)]},
      ],
    }

  def verify(self, report):
    path = self.root / 'results.json'
    path.write_text(json.dumps(report), encoding='utf-8')
    return self.script('verify-results.py', path)

  def test_verify_normal(self):
    result = self.verify(self.report())
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertIn('CONSUMER_JSON_OK', result.stdout)

  def test_verify_rejects_nonpassing_reports(self):
    mutations = {
      'runner failure': lambda r: r.update(success=False),
      'count mismatch': lambda r: r.update(numPassedTests=28),
      'failed counter': lambda r: r.update(numFailedTests=1),
      'pending counter': lambda r: r.update(numPendingTests=1),
      'todo counter': lambda r: r.update(numTodoTests=1),
      'wrong consumer': lambda r: r['testResults'][0].update(name='wrong.spec.ts'),
      'failed file': lambda r: r['testResults'][0].update(status='failed'),
      'missing assertions': lambda r: r['testResults'][0].update(assertionResults=[]),
      'skipped assertion': lambda r: r['testResults'][0]['assertionResults'][0].update(status='pending'),
    }
    for label, mutate in mutations.items():
      with self.subTest(label=label):
        report = copy.deepcopy(self.report())
        mutate(report)
        self.assertNotEqual(self.verify(report).returncode, 0)

  def test_verify_missing_and_malformed_input(self):
    bad = self.root / 'bad.json'
    bad.write_text('{', encoding='utf-8')
    for args in [(), (self.root / 'missing.json',), (bad,)]:
      with self.subTest(args=args):
        self.assertNotEqual(self.script('verify-results.py', *args).returncode, 0)

  def test_configure_preserves_existing_target(self):
    angular = self.root / 'angular.json'
    old_target = {'builder': '@angular/build:karma', 'options': {'watch': True}}
    angular.write_text(json.dumps({'projects': {'factoriolab': {
      'architect': {'test': old_target}}}}), encoding='utf-8')
    result = self.script('configure.py', self.root)
    self.assertEqual(result.returncode, 0, result.stderr)
    targets = json.loads(angular.read_text())['projects']['factoriolab']['architect']
    self.assertEqual(targets['test'], old_target)
    self.assertEqual(targets['test-node']['builder'], '@angular/build:unit-test')
    options = targets['test-node']['options']
    self.assertEqual(options['include'], [
      'components/button/button.spec.ts', 'state/router/migration.spec.ts'])
    self.assertIn(['json', {'outputFile': 'consumer-results.json'}], options['reporters'])
    before = angular.read_bytes()
    result = self.script('configure.py', self.root)
    self.assertNotEqual(result.returncode, 0)
    self.assertIn('Refusing to replace', result.stderr)
    self.assertEqual(angular.read_bytes(), before)

  def test_configure_missing_and_malformed_input(self):
    for args in [(), (self.root,)]:
      with self.subTest(args=args):
        self.assertNotEqual(self.script('configure.py', *args).returncode, 0)
    angular = self.root / 'angular.json'
    for content in ['{', '{}']:
      with self.subTest(content=content):
        angular.write_text(content, encoding='utf-8')
        self.assertNotEqual(self.script('configure.py', self.root).returncode, 0)
        self.assertEqual(angular.read_text(), content)

  def test_actual_node_preflight_versions(self):
    lines = [line for line in (HERE / 'run.sh').read_text().splitlines()
        if line.startswith('node -e ')]
    self.assertEqual(len(lines), 1)
    command = shlex.split(lines[0])
    self.assertEqual(command[:2], ['node', '-e'])
    self.assertEqual(len(command), 3)
    # Execute the actual gate, substituting only Node's version in a VM.
    harness = "require('node:vm').runInNewContext(process.argv[1], {process: {versions: {node: process.argv[2]}}})"
    for version, accepted in [('24.14.0', False), ('24.15.0', True),
                 ('24.22.1', True), ('22.22.2', False),
                 ('25.0.0', False), ('26.0.0', False)]:
      with self.subTest(version=version):
        result = subprocess.run(['node', '-e', harness, command[2], version],
                    capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode == 0, accepted, result.stderr)

  def test_invalid_arguments_stop_before_tools(self):
    existing = self.root / 'existing'
    existing.mkdir()
    dangling = self.root / 'dangling'
    dangling.symlink_to(self.root / 'absent')
    # Empty PATH is a second safety boundary: no git/npm/node can execute.
    # dirname may fail, but argument validation must still explicitly exit 2.
    for args in [[], [str(existing)], ['relative-path'],
          [str(self.root / 'has space')], [str(dangling)], ['one', 'two']]:
      with self.subTest(args=args):
        result = subprocess.run(['/bin/bash', str(HERE / 'run.sh'), *args],
                    env={**os.environ, 'PATH': ''},
                    capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, 2, result.stderr)
    self.assertEqual(set(p.name for p in self.root.iterdir()), {'existing', 'dangling'})


if __name__ == '__main__':
  unittest.main(verbosity=2)
