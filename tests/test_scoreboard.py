import contextlib
from datetime import date
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'scripts'))
import scoreboard  # noqa: E402


def write(root, rel, text):
  path = root / rel
  path.parent.mkdir(parents=True, exist_ok=True)
  path.write_text(text, encoding='utf-8')


class ScoreboardTest(unittest.TestCase):
  def setUp(self):
    self.tmp = tempfile.TemporaryDirectory()
    self.root = Path(self.tmp.name)
    write(self.root, 'docs/02-models.md',
          '## 当前最高水平\n<!-- frontier: status=已比较 gap=1 gen=2026-09 checked=2026-10-21 -->\n')
    write(self.root, 'docs/03-context.md',
          '## 当前最高水平\n<!-- frontier: status=仅候选 gap=2 gen=2026-03 checked=2026-05-01 -->\n')
    write(self.root, 'docs/04-mcp.md', '# MCP\n')
    write(self.root, 'docs/05-bad.md', '<!-- frontier: status=最好 gap=9 -->\n')
    write(self.root, 'domains/game-dev/01-engine.md', '## 当前最高水平\n')
    write(self.root, 'docs/collaboration/frontier-baseline.tsv',
          '# note\npage\tgap\taudit\ndocs/04-mcp.md\t1\t2026-10-21\ndocs/02-models.md\t2\t2026-10-21\n')
    write(self.root, 'docs/collaboration/coverage-map.md',
          '## 深度等级\n| 0 | 未覆盖 |\n## 二、机制\n| 镜头 | 2–3 |\n| 瞄准 | 1 |\n| 存档 | 2 |\n')

  def tearDown(self):
    self.tmp.cleanup()

  def run_json(self):
    out = io.StringIO()
    with contextlib.redirect_stdout(out):
      scoreboard.main(['--root', str(self.root), '--json', '--today', '2026-10-21'])
    return json.loads(out.getvalue())

  def test_summary_counts_registered_gap_and_stale(self):
    summary = self.run_json()['summary']['C1 AI coding 主干']
    self.assertEqual(summary['pages'], 4)
    self.assertEqual(summary['registered'], 2)
    self.assertEqual(summary['gap_le_1'], 1)
    self.assertEqual(summary['compared'], 1)
    self.assertEqual(summary['stale'], 1)
    self.assertEqual(summary['no_section'], 2)
    self.assertEqual(summary['bad_marker'], 1)

  def test_queue_puts_unregistered_and_bad_markers_first(self):
    pages = [row['page'] for row in self.run_json()['queue']]
    # Unaudited unknowns rank as gap 2, ahead of an audited gap 1.
    self.assertEqual(pages[:3], ['docs/05-bad.md', 'domains/game-dev/01-engine.md',
                                 'docs/04-mcp.md'])
    # The fixture audit (same day, gap 2) disputes 02's self-score of 1.
    self.assertEqual(pages[3:5], ['docs/02-models.md', 'docs/03-context.md'])

  def test_page_marker_overrides_audit_baseline(self):
    summary = self.run_json()['summary']['C1 AI coding 主干']
    self.assertEqual(summary['audit_gap'], {'1': 1, '2': 1})
    self.assertEqual(summary['unaudited'], 0)
    self.assertEqual(self.run_json()['summary']['C2 游戏 G1']['unaudited'], 1)
    rows = {r['page']: r for r in self.run_json()['queue']}
    self.assertEqual(rows['docs/02-models.md']['marker']['gap'], 1)

  def test_later_worse_audit_marks_page_disputed(self):
    write(self.root, 'docs/collaboration/frontier-baseline.tsv',
          'page\tgap\taudit\ndocs/02-models.md\t2\t2026-10-22\n'
          'docs/03-context.md\t3\t2026-04-01\n')
    report = self.run_json()
    self.assertEqual(report['summary']['C1 AI coding 主干']['disputed'], ['docs/02-models.md'])
    pages = [row['page'] for row in report['queue']]
    # Disputed pages follow unregistered ones and precede ordinary gaps.
    self.assertLess(pages.index('docs/02-models.md'), pages.index('docs/03-context.md'))
    # An audit older than the page's own check does not dispute it.
    rows = {r['page']: r for r in report['queue']}
    self.assertFalse(rows['docs/03-context.md']['disputed'])

  def test_answered_audit_clears_dispute_until_newer_audit(self):
    write(self.root, 'docs/02-models.md',
          '<!-- frontier: status=已比较 gap=1 gen=2026-10 checked=2026-10-22 audit=2026-10-22 -->\n')
    write(self.root, 'docs/collaboration/frontier-baseline.tsv',
          'page\tgap\taudit\ndocs/02-models.md\t2\t2026-10-22\n')
    self.assertEqual(self.run_json()['summary']['C1 AI coding 主干']['disputed'], [])
    write(self.root, 'docs/collaboration/frontier-baseline.tsv',
          'page\tgap\taudit\ndocs/02-models.md\t2\t2026-11-05\n')
    self.assertEqual(self.run_json()['summary']['C1 AI coding 主干']['disputed'],
                     ['docs/02-models.md'])

  def test_secondary_pages_sink_once_gap_is_two(self):
    write(self.root, 'docs/04-mcp.md',
          '<!-- frontier: status=已比较 gap=2 gen=2026-10 checked=2026-10-21 -->\n')
    write(self.root, 'docs/07-workflows.md',
          '<!-- frontier: status=已比较 gap=1 gen=2026-10 checked=2026-10-21 -->\n')
    report = self.run_json()
    pages = [row['page'] for row in report['queue']]
    self.assertEqual(pages[-1], 'docs/04-mcp.md')
    summary = report['summary']['C1 AI coding 主干']
    self.assertEqual(summary['core_pages'], 4)
    self.assertEqual(summary['core_gap_le_1'], 2)

  def test_coverage_levels_skip_level_definitions(self):
    coverage = self.run_json()['coverage']
    self.assertEqual(coverage, {'二、机制': {'1': 1, '2': 2}})

  def test_stale_window_is_longer_for_games(self):
    write(self.root, 'domains/game-dev/02-verify.md',
          '<!-- frontier: status=已比较 gap=0 gen=UE5.6 checked=2026-01-01 -->\n')
    rows = scoreboard.scan_pages(self.root, date(2026, 10, 21))
    game = [r for r in rows if r['page'].endswith('02-verify.md')][0]
    self.assertFalse(game['stale'])

  def test_text_report_runs_on_repository(self):
    out = io.StringIO()
    with contextlib.redirect_stdout(out):
      self.assertEqual(scoreboard.main([]), 0)
    self.assertIn('C1 AI coding 主干', out.getvalue())


if __name__ == '__main__':
  unittest.main()
