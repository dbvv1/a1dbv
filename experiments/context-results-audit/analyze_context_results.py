#!/usr/bin/env python3
"""Offline stdlib audit of a supplied public CSV; no network or model calls.

Emits JSON to stdout. Latest-per-cell is a diagnostic sensitivity policy, not
an assertion about which attempt the original authors intended to include.
"""
import argparse
import collections
import csv
import datetime
import hashlib
import io
import json
import re
from pathlib import Path

KEY = ('agent', 'strategy', 'task_id', 'repeat_index')
REQUIRED = set(KEY) | {'run_id', 'created_at', 'task_passed', 'model'}
EXPECTED_SHA256 = '96809726f635925bfe7cc0f91cbfea85d2b5ff7fc116a5934e168e2e280505f9'
COMMIT = '084c40708e7211b0e6a0fe8d74337b2e048a832c'
REPO = 'codeprakhar25/context-files-coding-agents'
SOURCE_PATH = 'data/results_summary.csv'

def summarize(rows):
  groups = collections.defaultdict(list)
  for row in rows:
    groups[row['agent'], row['strategy']].append(row)
  return [dict(agent=agent, strategy=strategy, rows=len(rs),
        unique_tasks=len({r['task_id'] for r in rs}),
        passes=sum(int(r['task_passed']) for r in rs),
        pass_rate_pct=100 * sum(int(r['task_passed']) for r in rs) / len(rs))
      for (agent, strategy), rs in sorted(groups.items())]

def parse_timestamp(value):
  # Reject timezone-aware or alternate encodings instead of mixing comparisons.
  if not re.fullmatch(r'\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}', value):
    raise ValueError('Timestamp must use naive YYYY-MM-DD HH:MM:SS')
  return datetime.datetime.strptime(value, '%Y-%m-%d %H:%M:%S')

def analyze_bytes(data):
  reader = csv.DictReader(io.StringIO(data.decode('utf-8'), newline=''), strict=True)
  try:
    if reader.fieldnames and len(set(reader.fieldnames)) != len(reader.fieldnames):
      raise ValueError('Duplicate CSV header names')
    if reader.fieldnames is None or not REQUIRED.issubset(reader.fieldnames):
      raise ValueError('Missing required CSV columns')
    rows = list(reader)
  except csv.Error as exc:
    raise ValueError(f'Malformed CSV: {exc}') from exc
  if not rows:
    raise ValueError('CSV has no observations')
  cells = collections.defaultdict(list)
  for row in rows:
    if None in row or any(value is None for value in row.values()) or any(row[k] == '' for k in REQUIRED - {'run_id'}):
      raise ValueError('Malformed row or missing required value')
    if row['task_passed'] not in {'0', '1'}:
      raise ValueError('Outcome must be binary 0/1')
    parse_timestamp(row['created_at'])
    cells[tuple(row[k] for k in KEY)].append(row)
  earliest, latest, duplicates = [], [], []
  for key, rs in sorted(cells.items()):
    ties = collections.defaultdict(set)
    for row in rs:
      ties[row['created_at'], row['run_id']].add(row['task_passed'])
    if any(len(labels) > 1 for labels in ties.values()):
      raise ValueError('Conflicting outcomes for identical timestamp and run_id in one cell')
    ordered = sorted(rs, key=lambda r: (parse_timestamp(r['created_at']), r['run_id']))
    earliest.append(ordered[0]); latest.append(ordered[-1])
    if len(rs) > 1:
      duplicates.append(dict(
        cell=dict(zip(KEY, key)),
        rows=len(rs),
        exact_unique_rows=len({json.dumps(r, sort_keys=True) for r in rs}),
        conflicting_pass_labels=len({r['task_passed'] for r in rs}) > 1,
        differing_columns=[k for k in reader.fieldnames if len({r[k] for r in rs}) > 1],
        records=[{k: r[k] for k in ('run_id', 'created_at', 'task_passed', 'total_duration_s', 'total_tool_calls') if k in r} for r in ordered]))
  counts = collections.Counter(json.dumps(r, sort_keys=True) for r in rows)
  return dict(
    input_sha256=hashlib.sha256(data).hexdigest(),
    input_git_blob_sha1=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest(),
    input_bytes=len(data), raw_rows=len(rows), unique_cells=len(cells),
    exact_duplicate_extra_rows=sum(n-1 for n in counts.values()),
    repeated_cell_count=len(duplicates),
    repeated_cell_extra_rows=len(rows)-len(cells),
    models=sorted({r['model'] for r in rows}),
    missing_run_ids=sum(not r['run_id'] for r in rows),
    raw_summary=summarize(rows),
    earliest_per_cell_summary=summarize(earliest),
    latest_per_cell_summary=summarize(latest),
    repeated_cells=duplicates,
    policy={'key': list(KEY), 'latest': 'maximum parsed created_at, then lexicographic run_id for ties',
        'earliest': 'minimum parsed created_at, then lexicographic run_id for ties',
        'interpretation': 'Sensitivity checks, not a reconstruction of author-intended retries or exclusions'})

def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('csv_path', type=Path)
  parser.add_argument('--require-source-hash', action='store_true', help='Fail if bytes differ from the audited pinned source')
  args = parser.parse_args()
  data = args.csv_path.read_bytes()
  if args.require_source_hash and hashlib.sha256(data).hexdigest() != EXPECTED_SHA256:
    parser.error('Input SHA256 differs from pinned source')
  try:
    report = analyze_bytes(data)
  except (ValueError, UnicodeDecodeError) as exc:
    parser.error(str(exc))
  report['audited_reference'] = {'repository': REPO, 'commit': COMMIT, 'path': SOURCE_PATH,
    'url': f'https://github.com/{REPO}/blob/{COMMIT}/{SOURCE_PATH}',
    'expected_sha256': EXPECTED_SHA256,
    'input_matches_reference': report['input_sha256'] == EXPECTED_SHA256}
  print(json.dumps(report, indent=2, sort_keys=True))

if __name__ == '__main__':
  main()
