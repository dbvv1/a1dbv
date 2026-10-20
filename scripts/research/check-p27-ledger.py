#!/usr/bin/env python3
"""Check two supplied P27 C1 records, not the application or evidence authenticity.

Usage: python3 scripts/research/check-p27-ledger.py BASELINE.json CANDIDATE.json
Exit 0: record conditions satisfied; 1: inconsistent/unsafe preview records;
2: invalid input (including missing files, duplicate JSON keys and unknown fields).

Exact JSON contract (no optional fields; all IDs/UUIDs/timestamps are opaque,
nonempty strings except the eight subscriber IDs 10,20,30,40,50,60,70,80):
  {"schema": 1, "provenance": "synthetic_expected" | "runtime_observed",
   "branch": "source" | "preview",
   "campaign": {"id": string, "uuid": string, "started_at": string},
   "subscribers": [{"id": integer, "uuid": string}, ...],
   "attempts": [{"subscriber_id": integer, "attempt": positive integer,
     "version": "V1" | "V2", "payload_sha256": lowercase 64-digit hex,
     "state": "pending" | "skipped" | "failed" | "unknown" | "accepted" |
              "rejected", "transport_attempts": 0 | 1}, ...],
   "events": [{"id": string, "kind": "sender_call" | "evidence" | "note",
     "subscriber_id": integer | null, "attempt": positive integer | null,
     "payload_sha256": hash | null, "result": "accepted" | "rejected" | null,
     "evidence_ref": nonempty string | null}, ...],
   "actions": [{"subscriber_id": integer,
                "action": "hold" | "reconcile" | "suppress" | "send"}, ...]}
Every subscriber appears once. Source actions must be empty; preview actions
cover every subscriber once. Each sender_call/evidence references one attempt
and its hash; sender_call result is null, evidence result is accepted/rejected.
Evidence requires a nonempty opaque evidence_ref; sender_call/note use null.
A note has all four attempt reference/result fields null. Event IDs are globally
unique within a record. Events are chronological, append-only; sender_call count
for an attempt equals transport_attempts. Each accepted/rejected state has
matching evidence; unknown requires a sender call. Transport-zero failed means
render failure; skipped means before Push. Multiple transports per app attempt
are NOT supported: transport_attempts > 1 is invalid input, not recovery success.
Attempts are contiguous per subscriber.

Both files are independent static snapshots. Baseline MUST be source and may
contain native repeats; candidate MUST be preview, preserving identities, old
attempt immutable fields, sender calls and the exact event prefix. Unknown can
remain unknown; only newly appended evidence for the SAME attempt/hash, with an
evidence_ref not already present in baseline, resolves it. A later a2 acceptance
does not resolve a1. Prior accepted states remain accepted. Preview must not send
to any subscriber with accepted or unresolved unknown attempts. 60/a1 is V1;
any later 60 attempt is V2. 70 starts a1/V2. These are checked in existing source
history; preview cannot add actual attempts. Planned sends belong only in
actions. No resume history is invented or required for a preview to pass.

Hashes are supplied labels, NOT verified payload bytes. No reference is opened,
input is never executed, and no SMTP/DB/network/application is invoked. Together
fabricated baseline/candidate can pass: this is neither cryptographic provenance
nor a sandbox, and exit 0 is NOT application recovery or P27 acceptance. Even
runtime_observed is an unverified input label. Tests use synthetic records only.
"""
import hashlib
import json
from pathlib import Path
import re
import sys


class InvalidInput(ValueError):
  pass


def require(ok, message):
  if not ok:
    raise InvalidInput(message)


def fields(value, names, where):
  require(type(value) is dict and set(value) == set(names.split()),
          where + ': expected exactly ' + names)


def string(value):
  return type(value) is str and bool(value.strip())


def integer(value, minimum=0):
  return type(value) is int and value >= minimum


def digest(value):
  return type(value) is str and re.fullmatch('[0-9a-f]{64}', value) is not None


def unique_pairs(pairs):
  result = {}
  for key, value in pairs:
    require(key not in result, 'duplicate JSON key: ' + key)
    result[key] = value
  return result


def validate(record):
  fields(record, 'schema provenance branch campaign subscribers attempts events actions', 'record')
  require(type(record['schema']) is int and record['schema'] == 1, 'schema must be 1')
  require(record['provenance'] in ('synthetic_expected', 'runtime_observed'), 'invalid provenance')
  require(record['branch'] in ('source', 'preview'), 'invalid branch')
  fields(record['campaign'], 'id uuid started_at', 'campaign')
  require(all(string(v) for v in record['campaign'].values()), 'invalid campaign identity')
  for name in ('subscribers', 'attempts', 'events', 'actions'):
    require(type(record[name]) is list, name + ' must be an array')
  subscribers = {}
  for row in record['subscribers']:
    fields(row, 'id uuid', 'subscriber')
    require(integer(row['id'], 1) and string(row['uuid']), 'invalid subscriber')
    require(row['id'] not in subscribers, 'duplicate subscriber ID')
    subscribers[row['id']] = row['uuid']
  require(set(subscribers) == set(range(10, 81, 10)), 'expected eight C1 subscriber IDs')
  require(len(set(subscribers.values())) == 8, 'duplicate subscriber UUID')
  attempts = {}
  for row in record['attempts']:
    fields(row, 'subscriber_id attempt version payload_sha256 state transport_attempts', 'attempt')
    require(integer(row['subscriber_id'], 1) and row['subscriber_id'] in subscribers,
            'invalid attempt subscriber')
    require(integer(row['attempt'], 1), 'invalid attempt number')
    require(row['version'] in ('V1', 'V2') and digest(row['payload_sha256']), 'invalid payload')
    require(row['state'] in ('pending', 'skipped', 'failed', 'unknown', 'accepted', 'rejected'),
            'invalid attempt state')
    require(integer(row['transport_attempts']) and row['transport_attempts'] <= 1,
            'transport_attempts must be 0 or 1; multiple transports unsupported')
    key = (row['subscriber_id'], row['attempt'])
    require(key not in attempts, 'duplicate attempt ID')
    attempts[key] = row
  ids = set()
  for row in record['events']:
    fields(row, 'id kind subscriber_id attempt payload_sha256 result evidence_ref', 'event')
    require(string(row['id']) and row['id'] not in ids, 'invalid/duplicate event ID')
    ids.add(row['id'])
    require(row['kind'] in ('sender_call', 'evidence', 'note'), 'invalid event kind')
    require(string(row['evidence_ref']) if row['kind'] == 'evidence'
            else row['evidence_ref'] is None, 'invalid evidence_ref')
    if row['kind'] == 'note':
      require(all(row[k] is None for k in ('subscriber_id', 'attempt', 'payload_sha256', 'result')),
              'note references must be null')
    else:
      require(integer(row['subscriber_id'], 1) and integer(row['attempt'], 1)
              and digest(row['payload_sha256']), 'invalid event reference')
      require(row['result'] in ('accepted', 'rejected') if row['kind'] == 'evidence'
              else row['result'] is None, 'invalid event result')
  ids = set()
  for row in record['actions']:
    fields(row, 'subscriber_id action', 'action')
    require(integer(row['subscriber_id'], 1) and row['subscriber_id'] in subscribers
            and row['subscriber_id'] not in ids, 'invalid/duplicate action subscriber')
    ids.add(row['subscriber_id'])
    require(row['action'] in ('hold', 'reconcile', 'suppress', 'send'), 'invalid action')
  require(not ids if record['branch'] == 'source' else ids == set(subscribers),
          'source has no actions; preview must cover eight subscribers')
  return subscribers, attempts


def check(baseline, candidate):
  before_ids, before = validate(baseline)
  after_ids, after = validate(candidate)
  errors = []

  def test(ok, message):
    if not ok:
      errors.append(message)

  for label, record, attempts in (('baseline', baseline, before), ('candidate', candidate, after)):
    calls = {key: 0 for key in attempts}
    evidence = {key: [] for key in attempts}
    for event in record['events']:
      if event['kind'] == 'note':
        continue
      key = (event['subscriber_id'], event['attempt'])
      matched = key in attempts and event['payload_sha256'] == attempts[key]['payload_sha256']
      test(matched, label + ': event references missing/mismatched attempt')
      if not matched:
        continue
      if event['kind'] == 'sender_call':
        calls[key] += 1
      else:
        test(calls[key] > 0, label + ': evidence before sender call')
        evidence[key].append(event['result'])
    for key, row in attempts.items():
      prefix = label + ': ' + str(key)
      test(calls[key] == row['transport_attempts'], prefix + ' transport count mismatch')
      if row['state'] in ('accepted', 'rejected'):
        test(evidence[key] and set(evidence[key]) == {row['state']}, prefix + ' missing/conflicting evidence')
      else:
        test(not evidence[key], prefix + ' evidence contradicts state')
      if row['state'] == 'unknown':
        test(calls[key] > 0, prefix + ' unknown before Push')
      if row['state'] in ('pending', 'skipped', 'failed'):
        test(calls[key] == 0, prefix + ' unsent state has sender call')
    for sid in before_ids:
      numbers = sorted(n for s, n in attempts if s == sid)
      test(numbers == list(range(1, len(numbers) + 1)), label + ': noncontiguous attempts')
    test((60, 1) in attempts, label + ': missing original 60/a1')
    for (sid, number), row in attempts.items():
      if sid in (60, 70):
        test(row['version'] == ('V1' if sid == 60 and number == 1 else 'V2'),
             label + ': 60/70 version continuity')

  test(baseline['branch'] == 'source', 'baseline must be independent R1 source history')
  test(candidate['branch'] == 'preview', 'candidate is not a safe preview (native source branch)')
  test(baseline['campaign'] == candidate['campaign'] and before_ids == after_ids, 'identity changed')
  test(baseline['provenance'] == candidate['provenance'], 'provenance relabeled')
  old_events = baseline['events']
  test(candidate['events'][:len(old_events)] == old_events, 'event prefix changed/lost')
  new_events = candidate['events'][len(old_events):]
  old_refs = {e['evidence_ref'] for e in old_events if e['kind'] == 'evidence'}
  test(not any(e['kind'] == 'sender_call' for e in new_events), 'preview added sender calls')
  for key, old in before.items():
    new = after.get(key)
    test(new is not None, 'old attempt lost: ' + str(key))
    if new is None:
      continue
    test(all(old[k] == new[k] for k in old if k != 'state'), 'old attempt payload/identity/count changed: ' + str(key))
    if old['state'] == 'unknown' and new['state'] != 'unknown':
      matching = [e for e in new_events if e['kind'] == 'evidence'
                  and (e['subscriber_id'], e['attempt']) == key
                  and e['payload_sha256'] == old['payload_sha256']
                  and e['result'] == new['state'] and e['evidence_ref'] not in old_refs]
      test(new['state'] in ('accepted', 'rejected') and bool(matching),
           'unknown resolved without new same-attempt evidence: ' + str(key))
    else:
      test(new['state'] == old['state'], 'old state changed: ' + str(key))
  test(not (after.keys() - before.keys()), 'preview added actual attempts')
  protected = {sid for (sid, _), row in after.items() if row['state'] in ('accepted', 'unknown')}
  for action in candidate['actions']:
    test(action['action'] != 'send' or action['subscriber_id'] not in protected,
         'automatic send for accepted/unknown: ' + str(action['subscriber_id']))
  return errors


def main(argv=None):
  argv = sys.argv[1:] if argv is None else argv
  report = {'scope': 'record_consistency_only', 'runtime_verified': False,
            'authenticity_verified': False, 'application_recovery_verified': False}
  try:
    require(len(argv) == 2, 'usage: check-p27-ledger.py BASELINE.json CANDIDATE.json')
    raw = []
    for index, path in enumerate(argv):
      try:
        raw.append(Path(path).read_bytes())
      except OSError as error:
        raise InvalidInput('input ' + str(index) + ' cannot be read') from error
    records = [json.loads(data.decode('utf-8'), object_pairs_hook=unique_pairs,
                          parse_constant=lambda x: (_ for _ in ()).throw(InvalidInput('nonfinite JSON')))
               for data in raw]
    errors = check(*records)
    report.update(status='conditions_not_met' if errors else 'record_conditions_satisfied',
                  errors=errors, input_provenance=[r['provenance'] for r in records],
                  input_sha256=[hashlib.sha256(data).hexdigest() for data in raw])
    code = int(bool(errors))
  except (InvalidInput, OSError, UnicodeError, ValueError, RecursionError) as error:
    report.update(status='invalid_input', errors=[str(error)])
    code = 2
  print(json.dumps(report, ensure_ascii=True, sort_keys=True))
  return code


if __name__ == '__main__':
  sys.exit(main())
