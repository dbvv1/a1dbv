#!/usr/bin/env python3
"""Check an explicit work snapshot; never execute, schedule, or approve work."""
import argparse
from datetime import datetime
import json
from pathlib import Path
import re
from validate_task import list_at, integer_at, no_duplicate_keys, reject_constant
from validate_relay import relative_path

LINES = {'core', 'production', 'cases', 'scout'}
STATES = {'ready', 'queued', 'running', 'blocked', 'done'}
PHASES = {'implement', 'review', 'rework', 'publish', 'verify'}
UNKNOWN_REFS = {'unknown', 'n/a', 'none', 'null', 'tbd', 'todo', 'pending', '?', '未知', '待核', '未核', '待确认', '未确认', '不可读取'}
SHA = re.compile(r'^[0-9a-f]{40}$|^[0-9a-f]{64}$')


def timestamp(value):
  if not isinstance(value, str):
    raise ValueError('timestamps must be explicit ISO 8601 strings')
  try:
    parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
  except ValueError as exc:
    raise ValueError('invalid timestamp') from exc
  if parsed.tzinfo is None:
    raise ValueError('timestamps require an explicit UTC offset')
  return parsed


def nonempty(value):
  return isinstance(value, str) and bool(value.strip())


def repository_identity(value):
  # Reuse local-jobs target_repo URL identity, not a checkout/worktree path.
  if not isinstance(value, str) or not re.fullmatch(
      r'https://github\.com/[A-Za-z0-9][A-Za-z0-9-]*/[A-Za-z0-9_.-]+', value, re.IGNORECASE):
    raise ValueError('target_repo requires https://github.com/owner/repo without suffix, query or fragment')
  if value.lower().endswith('.git') or value.rsplit('/', 1)[-1] in {'.', '..'}:
    raise ValueError('target_repo must use the canonical repository URL, without .git')
  return value.lower()


def inspect(data):
  if not isinstance(data, dict) or data.get('schema') != 1:
    raise ValueError('expected snapshot object with schema=1')
  integer_at(data['schema'], 'schema', 1)
  if not nonempty(data.get('queue_basis')):
    raise ValueError('queue_basis must reference actual map/inbox/returned-result inspection')
  observed = timestamp(data.get('observed_at'))
  if data.get('intent') not in {'continue', 'wait'}:
    raise ValueError('intent must be continue or wait')
  units, lines = data.get('units'), data.get('lines')
  if not isinstance(units, list) or not isinstance(lines, dict) or set(lines) != LINES:
    raise ValueError('units must be a list; lines must cover core/production/cases/scout')
  findings = []
  evidence_checks = []

  def flag(code, unit=None):
    findings.append({'code': code, **({'unit': unit} if unit else {})})

  ids = set()
  for unit in units:
    if not isinstance(unit, dict) or not nonempty(unit.get('id')) or unit['id'] in ids:
      raise ValueError('each unit needs a unique nonempty id')
    ids.add(unit['id'])
    if unit.get('kind') not in {'game', 'knowledge'} or unit.get('line') not in LINES or unit.get('state') not in STATES or unit.get('phase') not in PHASES:
      raise ValueError('invalid unit kind/line/state/phase')
    if not nonempty(unit.get('outcome')) or not nonempty(unit.get('next_action')):
      raise ValueError('unit needs a concrete outcome and next_action')
    if not isinstance(unit.get('writes'), list) or not all(nonempty(x) for x in unit['writes']):
      raise ValueError('writes must list exact repository paths; read-only may use []')
    for path in unit['writes']:
      relative_path(path, 'writes')
    repository_identity(unit.get('target_repo'))
    uid = unit['id']
    if unit['state'] == 'running':
      evidence_checks.append({'unit': uid, 'status': 'unknown',
                              'required': 'verify_original_tool_process_or_artifact_source'})
      evidence = unit.get('execution')
      if (not isinstance(evidence, dict) or evidence.get('kind') not in {'process', 'tool_result', 'artifact_delta'}
          or not nonempty(evidence.get('ref'))):
        flag('running_without_observation', uid)
      else:
        # A non-placeholder reference still requires reading the original source.
        # This offline checker has no source access and accepts no trust-me bypass.
        if evidence['ref'].strip().casefold() in UNKNOWN_REFS:
          flag('running_unknown_reference', uid)
        if evidence['kind'] == 'artifact_delta' and (not SHA.fullmatch(str(evidence.get('before', ''))) or not SHA.fullmatch(str(evidence.get('after', ''))) or evidence['before'] == evidence['after']):
          flag('static_artifact_is_not_execution', uid)
        at = timestamp(evidence.get('at'))
        if at > observed:
          raise ValueError('execution observation cannot be in the future')
        if (observed - at).total_seconds() > 1800:
          flag('execution_needs_recheck_not_restart', uid)
    if unit['state'] == 'blocked':
      blocker = unit.get('blocker')
      if not isinstance(blocker, dict) or not all(nonempty(blocker.get(k)) for k in ('action', 'reason', 'resume')):
        flag('blocker_missing_action_or_resume', uid)
    # Reuse the existing task/relay receipt; do not create another acceptance schema.
    if unit['state'] == 'done' and not nonempty(unit.get('receipt_ref')):
      flag('done_without_existing_receipt', uid)
    if unit['state'] == 'ready' and unit['phase'] in {'review', 'rework', 'publish', 'verify'}:
      flag('returned_work_needs_reception', uid)

  for line, choice in lines.items():
    if not isinstance(choice, dict):
      raise ValueError('each line needs a next unit or a bounded blocker')
    if choice.get('next') not in ids:
      if not nonempty(choice.get('reason')) or not nonempty(choice.get('resume')):
        flag('line_without_next_or_blocker:' + line)
    elif not any(u['id'] == choice['next'] and u['line'] == line for u in units):
      raise ValueError('line next points to a different line')
    elif any(u['id'] == choice['next'] and u['state'] == 'done' for u in units):
      flag('line_next_already_done:' + line)
  owners = {}
  for unit in units:
    if unit['state'] == 'running':
      for path in unit['writes']:
        key = (repository_identity(unit['target_repo']), path)
        if key in owners:
          flag('concurrent_write_conflict', unit['id'])
        owners[key] = unit['id']
  ready = [u['id'] for u in units if u['state'] == 'ready']
  if data['intent'] == 'wait' and ready:
    flag('wait_with_declared_ready_work')
  if data['intent'] == 'wait' and not nonempty(data.get('wait_reason')):
    flag('wait_without_reason')
  if any(u['state'] == 'ready' and u['phase'] == 'review' for u in units) and not any(
      u['state'] == 'running' and u['phase'] == 'review' for u in units):
    flag('review_capacity_needs_attention')

  # These are *explicitly recorded waits*, not idle CPU or all-agent inactivity.
  intervals = []
  for wait in list_at(data.get('waits', []), 'waits'):
    if not isinstance(wait, dict) or not nonempty(wait.get('ref')):
      raise ValueError('wait interval needs its observation reference')
    start, end = timestamp(wait.get('start')), timestamp(wait.get('end'))
    if start >= end or end > observed:
      raise ValueError('wait intervals require start < end <= observed_at')
    intervals.append((start, end))
  merged = []
  for start, end in sorted(intervals):
    if merged and start <= merged[-1][1]:
      merged[-1] = (merged[-1][0], max(end, merged[-1][1]))
    else:
      merged.append((start, end))
  return {'status': 'needs_review' if findings else 'no_inconsistency_found',
          'findings': findings, 'declared_ready_units': ready,
          'execution_evidence_status': 'unknown' if evidence_checks else 'not_assessed',
          'source_verification_required': evidence_checks,
          'recorded_wait_seconds': sum((end-start).total_seconds() for start, end in merged),
          'recorded_wait_scope': 'recorder only, not global idle',
          'net_execution_seconds': None, 'parallel_utilization': None,
          'limits': 'Input assertions are not independently verified. No quality, permission, process exit, or continuous execution is inferred.'}


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('snapshot', type=Path)
  args = parser.parse_args()
  try:
    result = inspect(json.loads(args.snapshot.read_text(encoding='utf-8'), object_pairs_hook=no_duplicate_keys, parse_constant=reject_constant))
  except (OSError, ValueError, TypeError, AttributeError) as exc:
    print(json.dumps({'status': 'invalid_input', 'error': str(exc)}, ensure_ascii=False))
    return 2
  print(json.dumps(result, ensure_ascii=False, indent=2))
  return 1 if result['findings'] else 0


if __name__ == '__main__':
  raise SystemExit(main())
