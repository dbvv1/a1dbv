"""Synthetic CLI regressions; execute only this repository's verifier."""
import copy
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'scripts/research/verify-catalog-compare.py'
MODES = ('normal', '-O', 'PYTHONOPTIMIZE=1')


class VerifyCatalogCompareTests(unittest.TestCase):
  def setUp(self):
    self.temporary = tempfile.TemporaryDirectory()
    self.addCleanup(self.temporary.cleanup)
    self.root = Path(self.temporary.name)
    self.checkout = self.root / 'checkout'
    self.results = self.root / 'results'
    self.fixtures = self.checkout / 'tests/acceptance/fixtures'
    for folder in (self.fixtures, self.checkout / 'docs',
                   self.checkout / 'dist', self.results / 'reports'):
      folder.mkdir(parents=True)
    # More than the default Decimal precision, with comma normalization.
    self.before = '1.' + '0' * 59 + '1'
    self.after = '3.' + '0' * 59 + '2'
    self.delta = '2.' + '0' * 59 + '1'
    for side, value in (('before', self.before), ('after', self.after)):
      (self.fixtures / f'{side}.csv').write_text(
        'sku;value\nSYNTHETIC;' + value.replace('.', ',') + '\n', encoding='utf-8')
    self.case = {
      'id': 'synthetic', 'before': 'before.csv', 'after': 'after.csv',
      'options': {side + suffix: value for side in ('before', 'after')
                  for suffix, value in (('_value_column', 'value'), ('_decimal', 'comma'))},
      'expected': {'rows': [{'sku': 'SYNTHETIC', 'status': 'changed',
                            'before_numeric': self.before, 'after_numeric': self.after,
                            'delta': self.delta}]}}
    self.manifest = {'files': {side + '.csv': {'delimiter': ';'}
                              for side in ('before', 'after')},
                     'comparison_cases': [self.case]}
    self.row = {'key': 'SYNTHETIC', 'status': 'changed',
                'before': [{'record': 2}], 'after': [{'record': 2}],
                'beforeNumber': self.before, 'afterNumber': self.after, 'delta': self.delta}
    self.rows = [self.row]
    content = b'// synthetic fixture only\n'
    (self.checkout / 'dist/synthetic.js').write_bytes(content)
    (self.checkout / 'docs/browser-verification.json').write_text(json.dumps(
      {'source_sha256': {'synthetic.js': hashlib.sha256(content).hexdigest()}}))
    self.save()

  def save(self):
    (self.fixtures / 'expected-results.json').write_text(json.dumps(self.manifest))
    (self.results / 'reports/synthetic.json').write_text(json.dumps({'rows': self.rows}))

  def run_verifier(self, mode, arguments=None):
    env = os.environ.copy()
    env.pop('PYTHONOPTIMIZE', None)
    if mode == 'PYTHONOPTIMIZE=1':
      env['PYTHONOPTIMIZE'] = '1'
    command = [sys.executable] + (['-O'] if mode == '-O' else []) + [str(SCRIPT)]
    command += [str(self.checkout), str(self.results)] if arguments is None else arguments
    return subprocess.run(command, env=env, text=True, capture_output=True, timeout=10)

  def check_rejected(self, mode, error='ValueError'):
    result = self.run_verifier(mode)
    self.assertNotEqual(result.returncode, 0, result.stdout)
    self.assertEqual(result.stdout, '')
    self.assertIn(error, result.stderr)

  def test_valid_output_in_all_modes(self):
    outputs = []
    for mode in MODES:
      with self.subTest(mode=mode):
        result = self.run_verifier(mode)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stderr, '')
        self.assertEqual(json.loads(result.stdout), {
          'matched_rows_checked_against_source_csv': 1,
          'authored_matched_numeric_fields_checked': 3,
          'browser_receipt_source_hash_matches': {'synthetic.js': True},
          'scope': 'Synthetic matched numeric rows only; no UI, browser, model or deployment test.'})
        outputs.append(result.stdout)
    self.assertEqual(len(set(outputs)), 1)

  def test_tampered_report_in_all_modes(self):
    original = copy.deepcopy(self.row)
    mutations = [('beforeNumber', '999'), ('afterNumber', '999'), ('delta', '999'),
                 ('status', 'unchanged'), ('status', 'added'), ('status', 'removed'),
                 ('status', 'unknown'), ('before', [{'record': 2}, {'record': 2}]),
                 ('after', [{'record': 2}, {'record': 2}])]
    for field, value in mutations:
      self.row.clear()
      self.row.update(copy.deepcopy(original))
      self.row[field] = value
      self.save()
      for mode in MODES:
        with self.subTest(field=field, value=value, mode=mode):
          self.check_rejected(mode)

  def test_missing_or_duplicate_expected_match_in_all_modes(self):
    for rows in ([], [self.row, copy.deepcopy(self.row)],
                 [dict(self.row, status='added'), dict(self.row, status='added')]):
      self.rows = rows
      self.save()
      for mode in MODES:
        with self.subTest(row_count=len(rows), mode=mode):
          self.check_rejected(mode)

  def test_invalid_source_references_in_all_modes(self):
    for side in ('before', 'after'):
      original = self.row[side]
      for value in ([], None, {'record': 2}, [None], [{}],
                    *([{'record': record}] for record in (0, -1, 1, 3, True, 2.0, '2'))):
        self.row[side] = value
        self.save()
        for mode in MODES:
          with self.subTest(side=side, value=value, mode=mode):
            self.check_rejected(mode)
      self.row[side] = original

  def test_additional_matched_rows_are_checked_against_csv_in_all_modes(self):
    for side, value in (('before', self.before), ('after', self.after)):
      with (self.fixtures / f'{side}.csv').open('a', encoding='utf-8') as handle:
        handle.write('ADDITIONAL;' + value.replace('.', ',') + '\n')
    self.rows.append(dict(self.row, key='ADDITIONAL',
                          before=[{'record': 3}], after=[{'record': 3}]))
    self.save()
    for mode in MODES:
      with self.subTest(problem='partial authored expectations', mode=mode):
        result = self.run_verifier(mode)
        self.assertEqual(result.returncode, 0, result.stderr)
        output = json.loads(result.stdout)
        self.assertEqual(output['matched_rows_checked_against_source_csv'], 2)
        self.assertEqual(output['authored_matched_numeric_fields_checked'], 3)
    self.rows[1]['delta'] = '999'
    self.save()
    for mode in MODES:
      with self.subTest(problem='additional matched row tampered', mode=mode):
        self.check_rejected(mode)

  def test_valid_unchanged_and_unmatched_rows_in_all_modes(self):
    # Unmatched rows do not promise normalized Number fields.
    self.case['expected']['rows'][0].update(status='unchanged',
                                          after_numeric=self.before, delta='0')
    self.row.update(status='unchanged', afterNumber=self.before, delta='0')
    (self.fixtures / 'after.csv').write_bytes((self.fixtures / 'before.csv').read_bytes())
    for status in ('added', 'removed'):
      self.case['expected']['rows'].append({'sku': status.upper(), 'status': status})
      self.rows.append({'key': status.upper(), 'status': status})
    self.save()
    for mode in MODES:
      with self.subTest(mode=mode):
        result = self.run_verifier(mode)
        self.assertEqual(result.returncode, 0, result.stderr)
        output = json.loads(result.stdout)
        self.assertEqual(output['matched_rows_checked_against_source_csv'], 1)
        self.assertEqual(output['authored_matched_numeric_fields_checked'], 3)

  def test_self_consistent_numbers_cannot_override_expected_status_in_all_modes(self):
    self.row.update(status='unchanged', afterNumber=self.before, delta='0')
    (self.fixtures / 'after.csv').write_bytes((self.fixtures / 'before.csv').read_bytes())
    self.case['expected']['rows'][0].update(after_numeric=self.before, delta='0')
    self.save()
    for mode in MODES:
      with self.subTest(mode=mode):
        self.check_rejected(mode)

  def test_nonfinite_or_invalid_numbers_in_all_modes(self):
    for value in ('Infinity', '-Infinity', 'NaN', 'sNaN', 'not a number'):
      for field in ('beforeNumber', 'afterNumber', 'delta'):
        original = self.row[field]
        self.row[field] = value
        self.save()
        for mode in MODES:
          with self.subTest(value=value, field=field, mode=mode):
            self.check_rejected(mode)
        self.row[field] = original

  def test_authored_numeric_mismatch_in_all_modes(self):
    expected = self.case['expected']['rows'][0]
    for field in ('before_numeric', 'after_numeric', 'delta'):
      original = expected[field]
      expected[field] = '999'
      self.save()
      for mode in MODES:
        with self.subTest(field=field, mode=mode):
          self.check_rejected(mode)
      expected[field] = original

  def test_missing_inputs_in_all_modes(self):
    paths = [self.fixtures / 'expected-results.json', self.fixtures / 'before.csv',
             self.fixtures / 'after.csv', self.results / 'reports/synthetic.json',
             self.checkout / 'docs/browser-verification.json',
             self.checkout / 'dist/synthetic.js']
    for path in paths:
      content = path.read_bytes()
      path.unlink()
      try:
        for mode in MODES:
          with self.subTest(input=path.name, mode=mode):
            self.check_rejected(mode, 'FileNotFoundError')
      finally:
        path.write_bytes(content)

  def test_missing_arguments_in_all_modes(self):
    for arguments in ([], [str(self.checkout)]):
      for mode in MODES:
        with self.subTest(arguments=len(arguments), mode=mode):
          result = self.run_verifier(mode, arguments)
          self.assertNotEqual(result.returncode, 0)
          self.assertEqual(result.stdout, '')
          self.assertIn('ValueError', result.stderr)


if __name__ == '__main__':
  unittest.main()
