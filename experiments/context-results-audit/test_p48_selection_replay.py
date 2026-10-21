"""只验证合成账本机制；不验证模型、上游runner/report或统计结论。"""
import copy
import json
import subprocess
import sys
import tempfile
from pathlib import Path
import unittest

from p48_selection_replay import independent_path, replay, selection_projection


class SelectionReplayTests(unittest.TestCase):
  def setUp(self):
    self.data = json.loads(Path(__file__).with_name('p48-selection-fixture.json').read_text())

  def test_nonobject_cli_fails_without_traceback(self):
    with tempfile.TemporaryDirectory() as temp:
      path = Path(temp) / 'bad.json'
      path.write_text('[]')
      result = subprocess.run([sys.executable, str(Path(__file__).with_name('p48_selection_replay.py')), str(path)], capture_output=True, text=True, timeout=10)
      self.assertEqual(result.returncode, 2)
      self.assertEqual(result.stdout, '')
      self.assertIn('ledger must be a JSON object', result.stderr)
      self.assertNotIn('Traceback', result.stderr)

  def test_three_roles_same_candidates_and_complete_inputs(self):
    result = replay(self.data)
    self.assertEqual(result['evidence'], 'synthetic_not_model_result')
    self.assertEqual(result['candidate_count'], 3)
    self.assertEqual(result['candidate_ids'], ['baseline', 'v1', 'v2'])
    self.assertEqual(result['A']['winner_id'], 'v2')
    self.assertEqual(result['A']['decision'], 'selection_only')
    self.assertFalse(result['A']['independent_final_evaluation'])
    self.assertEqual([x['winner_id'] for x in result['A']['selection_trace']],
                     ['baseline', 'baseline', 'v2'])
    self.assertEqual(result['B']['frozen_winner_id'], 'v1')
    self.assertEqual(result['B']['final']['decision'], 'reject')
    self.assertEqual(set(result['B']['final']['scores']), {'baseline', 'v1'})
    self.assertEqual(result['C']['decision'], 'defer')
    self.assertEqual(result['C']['old_test_role'], 'development_evidence')
    self.assertEqual(result['inputs']['all_candidate_totals'],
                     {'proposal': 5, 'evaluation': 9, 'human_review': 5})

  def test_val_projection_contains_no_test_or_description(self):
    projected = selection_projection(self.data['candidates'], 'val')
    self.assertTrue(all(set(r) == {'id', 'score'} for r in projected))
    self.assertEqual(projected[1], {'id': 'v1', 'score': 0.9})

  def test_b_never_reads_nonselected_test_or_reselects(self):
    class NoTestRead(dict):
      def get(self, key, *args):
        if key == 'test':
          raise AssertionError('nonselected test was accessed')
        return super().get(key, *args)
    self.data['candidates'][2] = NoTestRead(self.data['candidates'][2])
    result = independent_path(self.data['candidates'], 'baseline', self.data['preregistered'])
    self.assertEqual(result['final']['winner_id'], 'v1')
    self.assertEqual(result['final']['decision'], 'reject')
    self.assertFalse(result['reselection_after_test'])

  def test_test_changes_cannot_change_b_winner(self):
    for baseline, v1, v2 in ((0.5, 0.95, 1), (0.5, 0.1, 100)):
      for row, score in zip(self.data['candidates'], (baseline, v1, v2)):
        row['test'] = score
      result = replay(self.data)['B']
      self.assertEqual(result['frozen_winner_id'], 'v1')
      self.assertEqual(result['final']['winner_id'], 'v1')
      self.assertEqual(result['final']['decision'], 'accept' if v1 > baseline else 'reject')

  def test_exact_preregistered_threshold(self):
    self.data['candidates'][0]['test'] = 0.55
    self.data['candidates'][1]['test'] = 0.6
    self.assertEqual(replay(self.data)['B']['final']['decision'], 'accept')

  def test_preregistered_tie_break_earliest_round(self):
    self.data['candidates'][2]['val'] = 0.9
    self.assertEqual(replay(self.data)['B']['frozen_winner_id'], 'v1')
    self.data['preregistered']['tie_break'] = 'highest_test'
    with self.assertRaises(ValueError):
      replay(self.data)

  def test_minimize_goal_and_baseline_winner(self):
    self.data['preregistered']['goal'] = 'minimize'
    self.data['candidates'][1]['val'] = 0.1
    result = replay(self.data)
    self.assertEqual(result['B']['final']['decision'], 'accept')
    self.assertEqual(result['A']['winner_id'], 'v1')
    self.data['candidates'][1]['val'] = 0.9
    result = replay(self.data)['B']
    self.assertEqual(result['frozen_winner_id'], 'baseline')
    self.assertEqual(result['final']['decision'], 'reject')
    self.assertEqual(result['final']['scores'], {'baseline': 0.5})

  def test_missing_nonfinite_and_boolean_scores_not_zero_filled(self):
    for field in ('val', 'test'):
      for bad in (None, float('nan'), float('inf'), -float('inf'), True):
        data = copy.deepcopy(self.data)
        data['candidates'][1][field] = bad
        with self.subTest(field=field, bad=bad), self.assertRaises(ValueError):
          replay(data)
      data = copy.deepcopy(self.data)
      del data['candidates'][1][field]
      with self.assertRaises(ValueError):
        replay(data)

  def test_duplicate_ids_and_split_overlap_rejected(self):
    self.data['candidates'][2]['id'] = 'v1'
    with self.assertRaises(ValueError):
      replay(self.data)
    self.setUp()
    self.data['split_ids']['test'] = ['val_01']
    with self.assertRaises(ValueError):
      replay(self.data)

  def test_missing_cost_and_invalid_policy_rejected(self):
    del self.data['candidates'][2]['synthetic_inputs']['proposal']
    with self.assertRaises(ValueError):
      replay(self.data)
    for key, value in (('goal', 'unknown'), ('minimum_improvement', 0),
                       ('minimum_improvement', float('nan'))):
      self.setUp()
      self.data['preregistered'][key] = value
      with self.assertRaises(ValueError):
        replay(self.data)

  def test_revision_with_high_old_score_still_defers(self):
    self.data['candidates'][2]['test'] = 999
    self.assertEqual(replay(self.data)['C']['decision'], 'defer')
    self.data['post_final_revision']['fresh_eval'] = {'score': 1}
    with self.assertRaisesRegex(ValueError, 'evaluate separately'):
      replay(self.data)

  def test_deterministic_and_input_unchanged(self):
    before = copy.deepcopy(self.data)
    self.assertEqual(replay(self.data), replay(self.data))
    self.assertEqual(self.data, before)


if __name__ == '__main__':
  unittest.main()
