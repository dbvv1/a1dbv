#!/usr/bin/env python3
"""Check MOBA baseline batch JSON, not the engine or the whole brief."""
import argparse
import json
import math
from pathlib import Path


def inspect(report, *, games, seed, version):
  """Require explicit batch identity and distinguish target failure from bad input."""
  if not isinstance(report, dict):
    raise ValueError('report must be an object')
  options = report['options']
  for key, expected in [('games', games), ('seed', seed), ('contentVersion', version)]:
    actual = options[key]
    if type(actual) is not int or actual != expected:
      raise ValueError(f'options.{key} does not match requested input')
  names = ['attempted', 'completed', 'errors', 'timeouts', 'blueWins', 'redWins',
           'stuckEvents', 'replayChecked', 'replayMismatches']
  for key in names:
    if type(report[key]) is not int or report[key] < 0:
      raise ValueError(f'{key} must be a nonnegative integer')
  if report['attempted'] != games:
    raise ValueError('attempted differs from requested games')
  if report['completed'] != report['blueWins'] + report['redWins']:
    raise ValueError('completed does not equal declared wins')
  if report['completed'] + report['errors'] + report['timeouts'] != games:
    raise ValueError('wins, errors and timeouts do not account for all attempts')
  if not 0 <= report['replayMismatches'] <= report['replayChecked'] <= games:
    raise ValueError('replay counts are inconsistent')
  median = report['durations']['median']
  if type(median) not in (int, float) or not math.isfinite(median) or median < 0:
    raise ValueError('duration median must be finite nonnegative seconds')
  checks = {
    'all_matches_finished': report['timeouts'] == 0 and report['completed'] == games,
    'no_errors': report['errors'] == 0,
    'no_stuck_events': report['stuckEvents'] == 0,
    'sampled_replays_match': report['replayChecked'] > 0 and report['replayMismatches'] == 0,
    'median_8_to_12_minutes': 480 <= median <= 720,
  }
  return {
    'result': 'passed' if all(checks.values()) else 'failed',
    'scope': 'requested_batch_only',
    'checks': checks,
    'attempted': games,
    'replay_checked': report['replayChecked'],
    'median_seconds': median,
    'not_checked': (['200-game baseline'] if games < 200 else []) + ['500-game multi-seed symmetry', 'high-vs-low win rate',
                    'per-ability statistics', 'independent engine replay'],
  }


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('report', type=Path, help='Pure JSON from the actual sim CLI')
  parser.add_argument('--games', type=int, required=True)
  parser.add_argument('--seed', type=int, required=True)
  parser.add_argument('--content-version', type=int, choices=(1, 2), required=True)
  args = parser.parse_args()
  if args.games < 1 or args.seed < 0:
    parser.error('games must be positive; seed must be nonnegative')
  try:
    report = json.loads(args.report.read_text(encoding='utf-8'))
    result = inspect(report, games=args.games, seed=args.seed, version=args.content_version)
  except (OSError, UnicodeError, ValueError, KeyError, TypeError) as error:
    print(json.dumps({'result': 'invalid', 'error': str(error)}, ensure_ascii=False))
    return 2
  print(json.dumps(result, ensure_ascii=False, indent=2))
  return 0 if result['result'] == 'passed' else 1


if __name__ == '__main__':
  raise SystemExit(main())
