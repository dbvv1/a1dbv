"""Synthetic P27 record checks, never a real listmonk/SMTP recovery test."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/research/check-p27-ledger.py'
SPEC = importlib.util.spec_from_file_location('p27_ledger', SCRIPT)
LEDGER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(LEDGER)


def fixture():
  """D-like small synthetic cut; native repeats can be added independently."""
  baseline = {
    'schema': 1, 'provenance': 'synthetic_expected', 'branch': 'source',
    'campaign': {'id': 'C1', 'uuid': 'campaign-one', 'started_at': 'synthetic-start'},
    'subscribers': [{'id': n, 'uuid': 'subscriber-' + str(n)} for n in range(10, 81, 10)],
    'attempts': [], 'events': [], 'actions': []}
  for sid, state in ((10, 'accepted'), (20, 'unknown'), (30, 'unknown'),
                     (40, 'rejected'), (50, 'accepted'), (60, 'skipped')):
    add_attempt(baseline, sid, 1, 'V1', state)
  candidate = copy.deepcopy(baseline)
  candidate['branch'] = 'preview'
  candidate['actions'] = [{'subscriber_id': n, 'action': 'hold'} for n in range(10, 81, 10)]
  return baseline, candidate


def add_event(record, sid, number, kind, result=None):
  attempt = next(a for a in record['attempts'] if (a['subscriber_id'], a['attempt']) == (sid, number))
  record['events'].append({'id': 'e' + str(len(record['events']) + 1), 'kind': kind,
                          'subscriber_id': sid, 'attempt': number,
                          'payload_sha256': attempt['payload_sha256'], 'result': result,
                          'evidence_ref': ('synthetic-evidence-' + str(len(record['events']) + 1))
                          if kind == 'evidence' else None})


def add_attempt(record, sid, number, version, state):
  sent = state in ('accepted', 'rejected', 'unknown')
  record['attempts'].append({'subscriber_id': sid, 'attempt': number, 'version': version,
                            'payload_sha256': f'{sid * 100 + number:064x}', 'state': state,
                            'transport_attempts': int(sent)})
  if sent:
    add_event(record, sid, number, 'sender_call')
  if state in ('accepted', 'rejected'):
    add_event(record, sid, number, 'evidence', state)


class P27LedgerTests(unittest.TestCase):
  def setUp(self):
    self.before, self.after = fixture()

  def fails(self, text):
    self.assertTrue(any(text in e for e in LEDGER.check(self.before, self.after)))

  def test_unchanged_unknown_passes(self):
    self.assertEqual(LEDGER.check(self.before, self.after), [])

  def test_new_same_attempt_evidence_resolves_unknown(self):
    self.after['attempts'][1]['state'] = 'accepted'
    add_event(self.after, 20, 1, 'evidence', 'accepted')
    self.assertEqual(LEDGER.check(self.before, self.after), [])

  def test_reused_old_evidence_ref_cannot_resolve_unknown(self):
    self.after['attempts'][1]['state'] = 'accepted'
    add_event(self.after, 20, 1, 'evidence', 'accepted')
    self.after['events'][-1]['evidence_ref'] = self.before['events'][1]['evidence_ref']
    self.fails('unknown resolved without')

  def test_multiple_transports_rejected_at_cli(self):
    self.after['attempts'][1]['transport_attempts'] = 2
    code, report = self.cli(self.before, self.after)
    self.assertEqual(code, 2)
    self.assertIn('multiple transports unsupported', report['errors'][0])

  def test_unknown_cannot_be_whitened(self):
    for state in ('pending', 'accepted', 'rejected', 'failed', 'skipped'):
      with self.subTest(state=state):
        self.after['attempts'][1]['state'] = state
        self.fails('unknown resolved without')

  def test_a2_acceptance_does_not_resolve_a1(self):
    add_attempt(self.before, 20, 2, 'V2', 'accepted')
    self.after = copy.deepcopy(self.before)
    self.after['branch'] = 'preview'
    self.after['actions'] = fixture()[1]['actions']
    self.assertEqual(LEDGER.check(self.before, self.after), [])
    self.after['attempts'][1]['state'] = 'accepted'
    self.fails('unknown resolved without')

  def test_wrong_attempt_or_hash_evidence(self):
    self.after['attempts'][1]['state'] = 'accepted'
    add_event(self.after, 30, 1, 'evidence', 'accepted')
    self.fails('unknown resolved without')
    self.after['events'][-1]['subscriber_id'] = 20
    self.fails('unknown resolved without')

  def test_identity_changes(self):
    self.after['campaign']['started_at'] = 'reseeded'
    self.fails('identity changed')
    self.after = fixture()[1]
    self.after['subscribers'][0]['uuid'] = 'reseeded'
    self.fails('identity changed')

  def test_lost_attempt(self):
    self.after['attempts'].pop(0)
    self.fails('old attempt lost')

  def test_modified_old_hash(self):
    self.after['attempts'][-1]['payload_sha256'] = 'a' * 64
    self.fails('old attempt payload')

  def test_prefix_loss_or_edit(self):
    self.after['events'].pop(0)
    self.fails('event prefix changed')
    self.after = fixture()[1]
    self.after['events'][0]['id'] = 'rewritten'
    self.fails('event prefix changed')

  def test_new_sender_call(self):
    add_event(self.after, 20, 1, 'sender_call')
    self.fails('preview added sender')

  def test_protected_actions(self):
    for sid in (10, 20, 30, 50):
      with self.subTest(sid=sid):
        self.after = fixture()[1]
        self.after['actions'][sid // 10 - 1]['action'] = 'send'
        self.fails('automatic send')

  def test_terminal_states_cannot_change(self):
    for index in (0, 3):
      self.after = fixture()[1]
      self.after['attempts'][index]['state'] = 'pending'
      self.fails('old state changed')

  def test_60_70_existing_resume_continuity(self):
    for record in (self.before, self.after):
      add_attempt(record, 60, 2, 'V2', 'accepted')
      add_attempt(record, 70, 1, 'V2', 'failed')
    self.assertEqual(LEDGER.check(self.before, self.after), [])
    self.after['attempts'][-1]['version'] = 'V1'
    self.fails('60/70 version continuity')
    self.after['attempts'][-1]['version'] = 'V2'
    self.after['attempts'][-2]['attempt'] = 3
    self.fails('noncontiguous attempts')

  def test_preview_cannot_invent_actual_attempt(self):
    add_attempt(self.after, 70, 1, 'V2', 'failed')
    self.fails('preview added actual attempts')

  def test_source_repeats_cannot_pass_as_preview(self):
    add_attempt(self.before, 50, 2, 'V2', 'accepted')
    self.after = copy.deepcopy(self.before)
    self.fails('native source branch')
    self.after['branch'] = 'preview'
    self.after['actions'] = fixture()[1]['actions']
    self.assertEqual(LEDGER.check(self.before, self.after), [])
    self.after['actions'][4]['action'] = 'send'
    self.fails('automatic send')

  def test_preview_cannot_be_its_own_source_baseline(self):
    self.before = copy.deepcopy(self.after)
    self.fails('baseline must be independent')

  def test_provenance_cannot_be_upgraded(self):
    self.after['provenance'] = 'runtime_observed'
    self.fails('provenance relabeled')

  def test_unknown_requires_push(self):
    self.after['attempts'][-1]['state'] = 'unknown'
    self.fails('unknown before Push')

  def test_missing_60_and_first_70_number(self):
    for record in (self.before, self.after):
      record['attempts'].pop()
    self.fails('missing original 60/a1')
    self.before, self.after = fixture()
    for record in (self.before, self.after):
      add_attempt(record, 70, 2, 'V2', 'failed')
    self.fails('noncontiguous attempts')

  def test_render_failure_cannot_claim_transport(self):
    for record in (self.before, self.after):
      add_attempt(record, 70, 1, 'V2', 'failed')
      add_event(record, 70, 1, 'sender_call')
      record['attempts'][-1]['transport_attempts'] = 1
    self.fails('unsent state has sender call')

  def test_transport_counts_and_evidence_references(self):
    self.after['attempts'][0]['transport_attempts'] = 0
    self.fails('transport count mismatch')
    self.after = fixture()[1]
    self.after['events'][0]['attempt'] = 7
    self.fails('event references missing/mismatched attempt')

  def test_evidence_before_call_and_conflicting_result(self):
    self.after['events'][0], self.after['events'][1] = self.after['events'][1], self.after['events'][0]
    self.fails('evidence before sender call')
    self.after = fixture()[1]
    add_event(self.after, 10, 1, 'evidence', 'rejected')
    self.fails('missing/conflicting evidence')

  def test_appended_note_does_not_execute_or_resolve(self):
    self.after['events'].append({'id': 'opaque-note-not-a-path', 'kind': 'note',
                                 'subscriber_id': None, 'attempt': None,
                                 'payload_sha256': None, 'result': None, 'evidence_ref': None})
    self.assertEqual(LEDGER.check(self.before, self.after), [])

  def test_fabricated_evidence_is_only_consistency_checked(self):
    for record in (self.before, self.after):
      record['provenance'] = 'runtime_observed'
    self.assertEqual(LEDGER.check(self.before, self.after), [])

  def test_invalid_input_shapes(self):
    changes = [lambda r: r.pop('events'), lambda r: r.update(extra=True),
               lambda r: r.update(schema=True), lambda r: r.update(attempts={}),
               lambda r: r['attempts'][0].update(state='delivered'),
               lambda r: r['attempts'][0].update(transport_attempts=True),
               lambda r: r['attempts'][0].update(transport_attempts=2),
               lambda r: r['events'][1].update(evidence_ref=''),
               lambda r: r['events'][0].update(evidence_ref='not-null'),
               lambda r: r['attempts'][0].update(payload_sha256='not-a-hash'),
               lambda r: r['subscribers'].append(r['subscribers'][0]),
               lambda r: r['attempts'].append(r['attempts'][0]),
               lambda r: r['events'].append(r['events'][0]),
               lambda r: r['actions'].pop(),
               lambda r: r['campaign'].update(path='ignored')]
    for mutate in changes:
      with self.subTest(mutate=mutate):
        record = fixture()[1]
        mutate(record)
        with self.assertRaises(LEDGER.InvalidInput):
          LEDGER.check(self.before, record)

  def cli(self, left=None, right=None, args=None):
    with tempfile.TemporaryDirectory() as directory:
      paths = [Path(directory) / name for name in ('baseline.json', 'candidate.json')]
      for path, data in zip(paths, (left, right)):
        if data is not None:
          path.write_text(data if isinstance(data, str) else json.dumps(data), encoding='utf-8')
      result = subprocess.run([sys.executable, str(SCRIPT)] + (args if args is not None else list(map(str, paths))),
                              text=True, capture_output=True, check=False)
      self.assertEqual(result.stderr, '')
      return result.returncode, json.loads(result.stdout)

  def test_cli_minimal_reproduction(self):
    code, report = self.cli(self.before, self.after)
    self.assertEqual(code, 0)
    self.assertEqual(report['scope'], 'record_consistency_only')
    self.assertFalse(report['runtime_verified'])
    self.assertFalse(report['application_recovery_verified'])
    self.assertEqual(report['input_provenance'], ['synthetic_expected'] * 2)
    self.after['attempts'].pop()
    self.assertEqual(self.cli(self.before, self.after)[0], 1)

  def test_cli_escaped_surrogate_duplicate_key_returns_json(self):
    code, report = self.cli(r'{"\ud800":1,"\ud800":2}', self.after)
    self.assertEqual(code, 2)
    self.assertEqual(report['status'], 'invalid_input')
    self.assertIn('duplicate JSON key', report['errors'][0])

  def test_cli_read_error_does_not_echo_input_path(self):
    code, report = self.cli()
    self.assertEqual(code, 2)
    self.assertEqual(report['errors'], ['input 0 cannot be read'])

  def test_cli_invalid_missing_duplicate_keys_and_types(self):
    for left, right, args in ((None, None, []), (None, None, None),
                              ('{"schema":1,"schema":1}', self.after, None),
                              ('[]', self.after, None), ('null', self.after, None),
                              ('{"schema": NaN}', self.after, None),
                              ('{', self.after, None)):
      with self.subTest(left=left):
        code, report = self.cli(left, right, args)
        self.assertEqual(code, 2)
        self.assertEqual(report['status'], 'invalid_input')


if __name__ == '__main__':
  unittest.main()
