import unittest
from analyze_context_results import analyze_bytes

HEADER = 'agent,strategy,task_id,repeat_index,run_id,created_at,task_passed,model\n'
ROW = 'codex,none,t1,0,r1,2026-01-01 00:00:00,0,m\n'
class AuditTests(unittest.TestCase):
  def test_normal(self):
    r = analyze_bytes((HEADER+ROW).encode())
    self.assertEqual(r['raw_rows'], 1)
    self.assertEqual(r['unique_cells'], 1)
  def test_exact_duplicate(self):
    r = analyze_bytes((HEADER+ROW+ROW).encode())
    self.assertEqual(r['exact_duplicate_extra_rows'], 1)
    self.assertEqual(r['repeated_cells'][0]['exact_unique_rows'], 1)
  def test_repeated_cell_with_changed_outcome(self):
    changed = 'codex,none,t1,0,r2,2026-01-02 00:00:00,1,m\n'
    r = analyze_bytes((HEADER+ROW+changed).encode())
    self.assertEqual(r['exact_duplicate_extra_rows'], 0)
    self.assertTrue(r['repeated_cells'][0]['conflicting_pass_labels'])
    self.assertEqual(r['earliest_per_cell_summary'][0]['passes'], 0)
    self.assertEqual(r['latest_per_cell_summary'][0]['passes'], 1)
  def test_missing_run_id_is_reported(self):
    r = analyze_bytes((HEADER+ROW.replace(',r1,', ',,')).encode())
    self.assertEqual(r['missing_run_ids'], 1)
  def test_missing_columns(self):
    with self.assertRaises(ValueError): analyze_bytes(b'x\ny\n')
  def test_empty_observations(self):
    with self.assertRaises(ValueError): analyze_bytes(HEADER.encode())
  def test_invalid_outcome(self):
    with self.assertRaises(ValueError): analyze_bytes((HEADER+ROW.replace(',0,m', ',2,m')).encode())

  def test_duplicate_headers_rejected(self):
    with self.assertRaisesRegex(ValueError, 'Duplicate CSV'):
      analyze_bytes((HEADER.rstrip() + ',model\n' + ROW.rstrip() + ',m\n').encode())
  def test_timezone_mixing_rejected(self):
    other = ROW.replace(',r1,', ',r2,').replace('2026-01-01 00:00:00', '2026-01-02T00:00:00+00:00')
    with self.assertRaisesRegex(ValueError, 'Timestamp'):
      analyze_bytes((HEADER+ROW+other).encode())
  def test_conflicting_tie_rejected(self):
    with self.assertRaisesRegex(ValueError, 'Conflicting outcomes'):
      analyze_bytes((HEADER+ROW+ROW.replace(',0,m', ',1,m')).encode())

  def test_unterminated_quote_rejected(self):
    with self.assertRaisesRegex(ValueError, 'Malformed CSV'):
      analyze_bytes((HEADER+ROW.replace(',0,m\n', ',1,"m\n')).encode())
  def test_junk_after_closing_quote_rejected(self):
    with self.assertRaisesRegex(ValueError, 'Malformed CSV'):
      analyze_bytes((HEADER+ROW.replace(',0,m\n', ',1,"m"junk\n')).encode())
  def test_missing_trailing_run_id_rejected(self):
    header = 'agent,strategy,task_id,repeat_index,created_at,task_passed,model,run_id\n'
    row = 'codex,none,t1,0,2026-01-01 00:00:00,1,m'
    with self.assertRaisesRegex(ValueError, 'Malformed row'):
      analyze_bytes((header+row+'\n').encode())
    result = analyze_bytes((header+row+',\n').encode())
    self.assertEqual(result['missing_run_ids'], 1)

if __name__ == '__main__': unittest.main()
