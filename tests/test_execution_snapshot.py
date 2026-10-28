import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
spec = importlib.util.spec_from_file_location('snapshot', ROOT / 'scripts/check_execution_snapshot.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
SHA = 'a' * 40


def sample():
  return {'schema': 1, 'observed_at': '2026-10-28T08:00:00Z', 'intent': 'continue', 'queue_basis': 'synthetic-map-inbox-review',
          'lines': {line: {'reason': 'Current action needs an authorized input', 'resume': 'Input supplied'} for line in module.LINES},
          'units': []}


def unit(**overrides):
  return {'id': 'one', 'target_repo': 'https://github.com/dbvv1/a1dbv', 'line': 'core', 'kind': 'knowledge', 'state': 'ready',
          'phase': 'implement', 'outcome': 'Correct the existing consumer',
          'next_action': 'Run its regression', 'writes': ['example/src/consumer.py'], **overrides}


class SnapshotTests(unittest.TestCase):
  def codes(self, data):
    return [x['code'] for x in module.inspect(data)['findings']]

  def test_empty_is_not_proof_of_execution_or_quality(self):
    result = module.inspect(sample())
    self.assertEqual(result['status'], 'no_inconsistency_found')
    self.assertIsNone(result['net_execution_seconds'])
    self.assertIsNone(result['parallel_utilization'])

  def test_declared_running_requires_observation_not_label(self):
    data = sample(); data['units'] = [unit(state='running')]
    self.assertIn('running_without_observation', self.codes(data))
    data['units'][0]['execution'] = {'kind': 'tool_result', 'ref': 'test-result-1', 'at': '2026-10-28T07:59:00Z'}
    self.assertNotIn('running_without_observation', self.codes(data))

  def test_old_observation_requests_recheck_not_kill(self):
    data = sample(); data['units'] = [unit(state='running', execution={'kind': 'process', 'ref': 'observed-run-1', 'at': '2026-10-28T07:00:00Z'})]
    self.assertIn('execution_needs_recheck_not_restart', self.codes(data))

  def test_static_artifact_does_not_establish_activity(self):
    data = sample(); data['units'] = [unit(state='running', execution={'kind': 'artifact_delta', 'ref': 'delta-1', 'at': '2026-10-28T07:59:00Z', 'before': SHA, 'after': SHA})]
    self.assertIn('static_artifact_is_not_execution', self.codes(data))

  def test_queue_is_not_active_and_wait_requires_readiness_check(self):
    data = sample(); data.update(intent='wait', wait_reason='awaiting dependent input')
    data['units'] = [unit(state='queued')]
    self.assertNotIn('running_without_observation', self.codes(data))
    data['units'][0]['state'] = 'ready'
    self.assertIn('wait_with_declared_ready_work', self.codes(data))

  def test_blocker_and_four_line_coverage(self):
    data = sample(); data['lines']['core'] = {}; data['units'] = [unit(state='blocked')]
    self.assertIn('line_without_next_or_blocker:core', self.codes(data))
    self.assertIn('blocker_missing_action_or_resume', self.codes(data))

  def test_finished_unit_is_not_a_next_unit(self):
    data=sample();data['units']=[unit(state='done')];data['lines']['core']={'next':'one'}
    self.assertIn('done_without_existing_receipt',self.codes(data))
    self.assertIn('line_next_already_done:core',self.codes(data))

  def test_reception_and_review_capacity_are_visible(self):
    data = sample(); data['units'] = [unit(phase='review')]
    self.assertIn('returned_work_needs_reception', self.codes(data))
    self.assertIn('review_capacity_needs_attention', self.codes(data))

  def test_conflicting_writers(self):
    data = sample(); data['units'] = [unit(state='running'), unit(id='two', state='running')]
    self.assertIn('concurrent_write_conflict', self.codes(data))

  def test_repository_namespace_distinguishes_same_file_names(self):
    data=sample();data['units']=[unit(state='running'),unit(id='two',state='running',target_repo='https://github.com/dbvv1/MOBA-Like')]
    self.assertNotIn('concurrent_write_conflict',self.codes(data))
    data['units'][1]['target_repo']='HTTPS://GitHub.COM/DBVV1/A1DBV'
    self.assertIn('concurrent_write_conflict',self.codes(data))

  def test_repository_identity_rejects_checkout_paths_and_url_aliases(self):
    for repo in [None,'a1dbv','/tmp/worktree','https://github.com/dbvv1/a1dbv.git','https://github.com/dbvv1/a1dbv/','https://github.com/dbvv1/a1dbv?branch=next','https://github.com/dbvv1/a1dbv#next']:
      data=sample();data['units']=[unit(target_repo=repo)]
      with self.subTest(repo=repo), self.assertRaises(ValueError):module.inspect(data)

  def test_existing_receipt_is_only_a_reference_not_acceptance(self):
    data=sample();data['units']=[unit(state='done',receipt_ref='existing-task-report')]
    self.assertNotIn('done_without_existing_receipt',self.codes(data))
    self.assertIsNone(module.inspect(data)['parallel_utilization'])

  def test_noncanonical_write_paths_are_rejected(self):
    for path in ['./src/game.py','src//game.py','src/../game.py','/tmp/game.py','src\\game.py']:
      data=sample();data['units']=[unit(writes=[path])]
      with self.subTest(path=path), self.assertRaises(ValueError):module.inspect(data)

  def test_invalid_wait_container_schema_and_missing_queue_basis(self):
    for change in [{'waits':{}},{'waits':''},{'schema':True},{'queue_basis':''}]:
      with self.subTest(change=change),self.assertRaises(ValueError):module.inspect({**sample(),**change})

  def test_recorded_waits_union_without_extrapolating_gaps(self):
    data = sample(); data['waits'] = [{'start':'2026-10-28T07:00:00Z','end':'2026-10-28T07:10:00Z','ref':'wait-1'}, {'start':'2026-10-28T07:05:00Z','end':'2026-10-28T07:15:00Z','ref':'wait-2'}]
    self.assertEqual(module.inspect(data)['recorded_wait_seconds'],900)
    self.assertIsNone(module.inspect(data)['net_execution_seconds'])

  def test_invalid_and_missing_inputs_fail_closed(self):
    for data in [None, {}, {**sample(), 'observed_at':'2026-10-28T08:00:00'}, {**sample(), 'units':[unit(),unit()]}]:
      with self.subTest(data=data), self.assertRaises(ValueError): module.inspect(data)
    data=sample();data['waits']=[{'start':'2026-10-28T08:01:00Z','end':'2026-10-28T08:02:00Z','ref':'future'}]
    with self.assertRaises(ValueError):module.inspect(data)

  def test_cli_does_not_create_outputs_or_execute_actions(self):
    with tempfile.TemporaryDirectory() as folder:
      path=Path(folder)/'snapshot.json';path.write_text(json.dumps(sample()))
      result=subprocess.run([sys.executable,str(ROOT/'scripts/check_execution_snapshot.py'),str(path)],capture_output=True,text=True)
      self.assertEqual(result.returncode,0);self.assertEqual(json.loads(result.stdout)['status'],'no_inconsistency_found')
      self.assertEqual([p.name for p in Path(folder).iterdir()],['snapshot.json'])
      path.write_text('{broken')
      bad=subprocess.run([sys.executable,str(ROOT/'scripts/check_execution_snapshot.py'),str(path)],capture_output=True,text=True)
      self.assertEqual(bad.returncode,2);self.assertEqual(json.loads(bad.stdout)['status'],'invalid_input')


if __name__ == '__main__':
  unittest.main()
