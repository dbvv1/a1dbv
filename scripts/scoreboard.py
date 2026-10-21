#!/usr/bin/env python3
"""Report how far core pages are from the current state of the art.

Reads one machine marker per core page, placed in its "当前最高水平" section:

  <!-- frontier: status=已比较 gap=1 gen=2026-09 checked=2026-10-21 -->

status is 已比较／仅候选／未知, gap is 0-3 (0 = at the current best, 3 = missing
or outdated), gen is the model/tool generation the advice was checked against.
A page without a marker counts as unregistered. Also counts coverage-map
cells by level. Pages without a marker fall back to the independent audit
baseline in docs/collaboration/frontier-baseline.tsv. When an audit dated on or
after a page's own check scores it worse, the page is listed as disputed for
the executor to resolve; neither score overrides the other. Reporting only: it
never fails the offline checks.
"""
import argparse
from datetime import date
import json
from pathlib import Path
import re
import sys

CAMPAIGNS = {
  'C1 AI coding 主干': ['docs/0*.md', 'docs/1*.md', 'docs/2*.md', 'docs/01-agents/*.md'],
  'C2 游戏 G1': ['domains/game-dev/0*.md', 'domains/game-dev/assets/*.md'],
}
# Index and experiment-log pages carry no single reader choice to compare.
EXCLUDE = {'docs/12-resources.md', 'docs/19-experiments.md'}
STALE_DAYS = {'C1 AI coding 主干': 90, 'C2 游戏 G1': 365}
MARKER = re.compile(r'<!--\s*frontier:(.*?)-->', re.S)
PAIR = re.compile(r'(\w+)=(\S+)')
STATUSES = ('已比较', '仅候选', '未知')
BASELINE = 'docs/collaboration/frontier-baseline.tsv'
COVERAGE_ROW = re.compile(r'^\|\s*([^|]+?)\s*\|\s*(\d)')


def parse_marker(text):
  match = MARKER.search(text)
  if not match:
    return None
  fields = dict(PAIR.findall(match.group(1)))
  status = fields.get('status')
  gap = fields.get('gap', '')
  if status not in STATUSES or not gap.isdigit() or int(gap) > 3:
    return {'error': match.group(0).strip()}
  return {'status': status, 'gap': int(gap), 'gen': fields.get('gen', '?'),
          'checked': fields.get('checked', '?')}


def age_days(checked, today):
  try:
    return (today - date.fromisoformat(checked)).days
  except ValueError:
    return None


def load_baseline(root):
  path = root / BASELINE
  if not path.exists():
    return {}
  baseline = {}
  for line in path.read_text(encoding='utf-8').splitlines():
    parts = line.split('\t')
    if line.startswith('#') or len(parts) < 2 or not parts[1].isdigit():
      continue
    baseline[parts[0]] = (int(parts[1]), parts[2] if len(parts) > 2 else '')
  return baseline


def scan_pages(root, today):
  baseline = load_baseline(root)
  rows = []
  for campaign, patterns in CAMPAIGNS.items():
    paths = sorted({p for pattern in patterns for p in root.glob(pattern)})
    for path in paths:
      if path.relative_to(root).as_posix() in EXCLUDE:
        continue
      text = path.read_text(encoding='utf-8')
      marker = parse_marker(text)
      row = {'campaign': campaign, 'page': path.relative_to(root).as_posix(),
             'has_section': '当前最高水平' in text, 'marker': marker,
             'audit_gap': None, 'disputed': False}
      audit = baseline.get(row['page'])
      if audit:
        row['audit_gap'], row['audit_date'] = audit
        row['disputed'] = bool(marker and 'gap' in marker and audit[0] > marker['gap']
                               and audit[1] >= marker['checked'])
      if marker and 'checked' in marker:
        days = age_days(marker['checked'], today)
        row['stale'] = days is None or days > STALE_DAYS[campaign]
      rows.append(row)
  return rows


def scan_coverage(root):
  path = root / 'docs/collaboration/coverage-map.md'
  levels = {}
  section = None
  for line in path.read_text(encoding='utf-8').splitlines():
    if line.startswith('## '):
      section = line[3:].strip()
    match = COVERAGE_ROW.match(line)
    if section and match and not section.startswith('深度'):
      levels.setdefault(section, []).append(int(match.group(2)))
  return {name: {str(n): values.count(n) for n in range(5) if values.count(n)}
          for name, values in levels.items()}


def summarize(rows):
  out = {}
  for campaign in CAMPAIGNS:
    mine = [r for r in rows if r['campaign'] == campaign]
    ok = [r for r in mine if r['marker'] and 'gap' in r['marker']]
    out[campaign] = {
      'pages': len(mine),
      'registered': len(ok),
      'gap_le_1': sum(r['marker']['gap'] <= 1 for r in ok),
      'compared': sum(r['marker']['status'] == '已比较' for r in ok),
      'stale': sum(bool(r.get('stale')) for r in ok),
      'no_section': sum(not r['has_section'] for r in mine),
      'bad_marker': sum(bool(r['marker'] and 'error' in r['marker']) for r in mine),
      'audit_gap': {str(g): sum(r['audit_gap'] == g for r in mine)
                    for g in range(4) if any(r['audit_gap'] == g for r in mine)},
      'unaudited': sum(r['audit_gap'] is None and not r['marker'] for r in mine),
      'disputed': [r['page'] for r in mine if r['disputed']],
    }
  return out


def priority(row):
  marker = row['marker']
  if not marker or 'error' in marker:
    # Unaudited pages rank with gap 2: unknown is not assumed to be good.
    gap = 2 if row['audit_gap'] is None else row['audit_gap']
    return (0, -gap, row['audit_gap'] is not None, row['page'])
  if row['disputed']:
    return (1, -row['audit_gap'], row['page'])
  return (2, -marker['gap'], not row.get('stale'), row['page'])


def main(argv=None):
  parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
  parser.add_argument('--root', default=Path(__file__).resolve().parent.parent, type=Path)
  parser.add_argument('--json', action='store_true')
  parser.add_argument('--today', default=date.today().isoformat())
  args = parser.parse_args(argv)
  rows = scan_pages(args.root, date.fromisoformat(args.today))
  report = {'summary': summarize(rows), 'coverage': scan_coverage(args.root),
            'queue': sorted(rows, key=priority)}
  if args.json:
    json.dump(report, sys.stdout, ensure_ascii=False, indent=2)
    print()
    return 0
  for campaign, s in report['summary'].items():
    print(f"{campaign}: {s['registered']}/{s['pages']} 已登记，差距≤1 {s['gap_le_1']}，"
          f"已比较 {s['compared']}，过期 {s['stale']}，无最高水平节 {s['no_section']}，"
          f"标记错误 {s['bad_marker']}")
    print(f"  审计基线差距分布 {s['audit_gap']}，未审计且未登记 {s['unaudited']}")
    if s['disputed']:
      print(f"  审计比自评差（待执行者按证据处理）：{'、'.join(s['disputed'])}")
  for section, counts in report['coverage'].items():
    print(f"覆盖地图 {section}: " + '，'.join(f'{k}级 {v}' for k, v in counts.items()))
  print('\n待推进（未登记优先，其次审计分歧、差距大、已过期）：')
  for row in report['queue'][:15]:
    m = row['marker']
    base = '' if row['audit_gap'] is None else f"（审计差距{row['audit_gap']}）"
    state = f'未登记{base}' if not m else ('标记错误' if 'error' in m else
             f"{m['status']}／差距{m['gap']}／{m['gen']}／{m['checked']}"
             + ('／过期' if row.get('stale') else '')
             + (f"／审计{row['audit_gap']}待处理" if row['disputed'] else ''))
    print(f"  {row['page']}: {state}")
  return 0


if __name__ == '__main__':
  sys.exit(main())
