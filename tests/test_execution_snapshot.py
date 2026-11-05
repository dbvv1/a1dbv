import copy
import importlib.util
import json
import os
import io
from contextlib import redirect_stdout
from unittest.mock import patch
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

  def test_placeholder_reference_does_not_establish_observation(self):
    for ref in ['UNKNOWN',' unknown ','N/A','TBD','未知','待核']:
      data=sample();data['units']=[unit(state='running',execution={'kind':'tool_result','ref':ref,'at':'2026-10-28T07:59:00Z'})]
      with self.subTest(ref=ref):
        self.assertIn('running_unknown_reference',self.codes(data))
        self.assertEqual(module.inspect(data)['status'],'needs_review')

  def test_plausible_or_unreadable_reference_still_needs_source_verification(self):
    for ref in ['original-tool-result-1','unreadable-result-2']:
      data=sample();data['units']=[unit(state='running',execution={'kind':'tool_result','ref':ref,'at':'2026-10-28T07:59:00Z','verified':True})]
      with self.subTest(ref=ref):
        result=module.inspect(data)
        self.assertEqual(result['status'],'no_inconsistency_found')
        self.assertEqual(result['execution_evidence_status'],'unknown')
        self.assertEqual(result['source_verification_required'][0]['status'],'unknown')
        self.assertIsNone(module.inspect(data)['net_execution_seconds'])

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

  def test_repeated_write_paths_count_distinct_units_not_declarations(self):
    path = 'example/src/consumer.py'
    execution = {'kind': 'tool_result', 'ref': 'synthetic-result',
                 'at': '2026-10-28T07:59:00Z'}
    for count in (1, 2, 3):
      with self.subTest(writers=count):
        data = sample()
        data['units'] = [unit(id=str(i), state='running', writes=[path, path],
                              execution=execution) for i in range(count)]
        before = copy.deepcopy(data)
        result = module.inspect(data)
        conflicts = [item['unit'] for item in result['findings']
                     if item['code'] == 'concurrent_write_conflict']
        self.assertEqual(conflicts, [str(i) for i in range(1, count)])
        self.assertEqual(data, before)
        self.assertEqual(result['execution_evidence_status'], 'unknown')
        self.assertEqual(len(result['source_verification_required']), count)
        self.assertIsNone(result['net_execution_seconds'])

  def test_cli_repeated_write_declarations_preserve_real_conflicts(self):
    execution = {'kind': 'tool_result', 'ref': 'synthetic-result',
                 'at': '2026-10-28T07:59:00Z'}
    path = 'example/src/consumer.py'
    with tempfile.TemporaryDirectory() as folder:
      snapshot = Path(folder) / 'snapshot.json'
      for second_repo, expected in [(None, 0),
          ('https://github.com/dbvv1/a1dbv', 1),
          ('https://github.com/dbvv1/MOBA-Like', 0)]:
        with self.subTest(second_repo=second_repo):
          data = sample()
          data['units'] = [unit(state='running', writes=[path, path], execution=execution)]
          if second_repo:
            data['units'].append(unit(id='two', state='running', target_repo=second_repo,
                                      writes=[path, path], execution=execution))
          snapshot.write_text(json.dumps(data), encoding='utf-8')
          original = snapshot.read_bytes()
          result = subprocess.run([sys.executable,
            str(ROOT / 'scripts/check_execution_snapshot.py'), str(snapshot)],
            capture_output=True, text=True, timeout=10)
          self.assertEqual(result.returncode, expected, result.stderr)
          self.assertEqual(result.stderr, '')
          parsed = json.loads(result.stdout)
          self.assertEqual(parsed['findings'],
            [{'code': 'concurrent_write_conflict', 'unit': 'two'}] if expected else [])
          self.assertEqual(parsed['execution_evidence_status'], 'unknown')
          self.assertEqual(snapshot.read_bytes(), original)
          self.assertEqual(list(Path(folder).iterdir()), [snapshot])

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

  def test_cli_json_roundtrips_unicode_under_output_encodings(self):
    name = '任务📦'
    valid = sample(); valid['units'] = [unit(id=name)]
    review = sample(); review['units'] = [unit(id=name, state='running')]
    with tempfile.TemporaryDirectory() as folder:
      path = Path(folder) / '快照📦.json'
      for encoding in ['ascii', 'gbk', 'utf-8']:
        for data, expected_code, expected_status in [
            (valid, 0, 'no_inconsistency_found'),
            (review, 1, 'needs_review'),
            (None, 2, 'invalid_input')]:
          with self.subTest(encoding=encoding, status=expected_status):
            if data is None:
              if path.exists(): path.unlink()
            else:
              path.write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
            result = subprocess.run(
              [sys.executable, str(ROOT / 'scripts/check_execution_snapshot.py'), str(path)],
              env={**os.environ, 'PYTHONIOENCODING': encoding + ':strict'},
              capture_output=True)
            self.assertEqual(result.returncode, expected_code, result.stderr)
            self.assertEqual(result.stderr, b'')
            self.assertTrue(result.stdout.isascii())
            parsed = json.loads(result.stdout)
            self.assertEqual(parsed['status'], expected_status)
            if expected_code == 0:
              self.assertEqual(parsed['declared_ready_units'], [name])
            elif expected_code == 1:
              self.assertEqual(parsed['findings'][0]['unit'], name)
              self.assertEqual(parsed['execution_evidence_status'], 'unknown')
            else:
              self.assertIn(path.name, parsed['error'])

  def test_main_preserves_text_only_stdout(self):
    with tempfile.TemporaryDirectory() as folder:
      path = Path(folder) / 'snapshot.json'
      data = sample(); data['units'] = [unit(id='任务📦')]
      path.write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
      output = io.StringIO()
      with patch.object(sys, 'argv', ['check_execution_snapshot.py', str(path)]), redirect_stdout(output):
        self.assertEqual(module.main(), 0)
      self.assertTrue(output.getvalue().isascii())
      self.assertEqual(json.loads(output.getvalue())['declared_ready_units'], ['任务📦'])

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
