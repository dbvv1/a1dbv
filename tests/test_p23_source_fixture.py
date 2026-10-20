"""P23 合成源契约回归；未运行 Shop、Next、模型或真实缓存。"""
import hashlib
from html.parser import HTMLParser
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/research/p23_source_fixture.py'
SPEC = importlib.util.spec_from_file_location('p23_source_fixture', SCRIPT)
FIXTURE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(FIXTURE)


class Tags(HTMLParser):
  def __init__(self):
    super().__init__()
    self.tags = []

  def handle_starttag(self, tag, attrs):
    self.tags.append((tag, dict(attrs)))


class P23SourceFixtureTests(unittest.TestCase):
  def setUp(self):
    self.source = FIXTURE.Scenario()

  def blog(self, first=50):
    return self.source.respond('getBlog', {'handle': 'guides', 'first': first})['data']['blog']

  def detail(self, handle):
    return self.source.respond('getBlogArticle', {
      'blogHandle': 'guides', 'articleHandle': handle})['data']['blog']['articleByHandle']

  def article_page(self, after=None):
    return self.source.respond('getArticleSitemapPage', {
      'first': 250, 'after': after})['data']['articles']

  def count(self, kind='ARTICLE'):
    return self.source.respond('getSitemapPagesCount', {'type': kind})['data']['sitemap']['pagesCount']['count']

  def test_exact_initial_summary_detail_and_limits(self):
    expected = {'handle': 'care-guide', 'title': 'Care guide v1',
      'publishedAt': '2026-01-02T00:00:00Z', 'excerpt': 'Care guide v1 excerpt',
      'image': None, 'authorV2': None, 'content': 'Care guide v1 excerpt'}
    nodes = self.blog()['articles']['nodes']
    self.assertEqual(len(nodes), 50)
    self.assertEqual(nodes[1], expected)
    self.assertEqual(nodes[0]['handle'], 'retired-guide')
    self.assertEqual(nodes[-1]['handle'], 'archive-201')
    self.assertEqual(self.blog(1)['articles']['nodes'], [nodes[0]])
    self.assertEqual(self.detail('care-guide'), {**expected,
      'contentHtml': '<h2>Care</h2><p>Wash cold.</p>',
      'seo': {'title': 'Care guide v1 | Fixture Shop', 'description': 'Care guide v1 summary'}})
    for node in nodes:
      self.assertEqual(set(node), {'handle', 'title', 'publishedAt', 'excerpt', 'image', 'authorV2', 'content'})
    self.assertEqual(self.source.records['archive-001']['publishedAt'], '2026-01-01T00:01:00Z')
    self.assertEqual(self.source.records['archive-248']['publishedAt'], '2026-01-01T04:08:00Z')

  def test_same_source_four_events_pages_counts_and_history(self):
    archives = {k: v for k, v in self.source.records.items() if k.startswith('archive-')}
    expected_rows = (
      ('S0', None, 1, ['care-guide', 'retired-guide'], ['retired-guide', 'care-guide', 'archive-248'], 'archive-201'),
      ('S1a', 'e1', 1, ['retired-guide', 'care-guide'], ['retired-guide', 'care-guide', 'archive-248'], 'archive-201'),
      ('S1b', 'e2', 2, ['retired-guide', 'care-guide'], ['size-guide', 'retired-guide', 'care-guide'], 'archive-202'),
      ('S1', 'e3', 1, ['care-guide', 'size-guide'], ['size-guide', 'care-guide', 'archive-248'], 'archive-201'),
      ('S2', 'e4', 1, ['size-guide', 'care-guide'], ['size-guide', 'care-guide', 'archive-248'], 'archive-201'),
    )
    saved_b = None
    for state, event, count, tail, head, last in expected_rows:
      with self.subTest(state=state):
        if event:
          self.assertEqual(self.source.apply(event), state)
        self.assertEqual(self.source.state, state)
        self.assertEqual(self.count(), count)
        page = self.article_page()
        self.assertEqual(len(page['nodes']), 250)
        self.assertEqual([r['handle'] for r in page['nodes'][:248]],
                         [f'archive-{i:03}' for i in range(1, 249)])
        self.assertEqual([r['handle'] for r in page['nodes'][-2:]], tail)
        self.assertEqual(page['pageInfo'], {'endCursor': 'p23:250', 'hasNextPage': state == 'S1b'})
        # 使用返回游标，而不是把逻辑 page=2 直接映射为 B。
        second = self.article_page(page['pageInfo']['endCursor'])
        if state == 'S1b':
          self.assertEqual(second, {'nodes': [{'blog': {'handle': 'guides'},
            'handle': 'size-guide', 'publishedAt': '2026-10-20T10:01:00Z'}],
            'pageInfo': {'endCursor': 'p23:251', 'hasNextPage': False}})
          saved_b = self.detail('size-guide')
        else:
          self.assertEqual(second, {'nodes': [], 'pageInfo': {'endCursor': None, 'hasNextPage': False}})
        nodes = self.blog()['articles']['nodes']
        self.assertEqual(len(nodes), 50)
        self.assertEqual([n['handle'] for n in nodes[:3]], head)
        self.assertEqual(nodes[-1]['handle'], last)
        self.assertEqual(self.blog(1)['articles']['nodes'][0]['handle'], head[0])
        self.assertEqual(self.detail('care-guide')['publishedAt'], '2026-01-02T00:00:00Z')
        self.assertEqual({k: v for k, v in self.source.records.items() if k.startswith('archive-')}, archives)
        if state in ('S1', 'S2'):
          self.assertIsNone(self.detail('retired-guide'))
          self.assertNotIn('retired-guide', [n['handle'] for n in nodes])
          self.assertEqual(self.detail('size-guide'), saved_b)
    self.assertIn('id="measure"', saved_b['contentHtml'])
    self.assertEqual(self.source.records['care-guide']['sourceRevision'], 3)
    self.assertEqual(self.source.records['care-guide']['sourceUpdatedAt'], '2026-10-20T11:00:00Z')
    self.assertEqual(self.detail('care-guide')['seo'], {
      'title': 'Care guide v3 | Fixture Shop',
      'description': 'A detailed care guide. Wash cold and air dry.'})

  def test_r1_exact_mutation_and_published_date_not_last_edit(self):
    before = self.source.records
    self.source.apply('e1')
    after = self.source.records
    self.assertEqual({k: v for k, v in before.items() if k != 'care-guide'},
                     {k: v for k, v in after.items() if k != 'care-guide'})
    self.assertEqual(self.detail('care-guide')['contentHtml'], '<h2>Care</h2><p>Wash cold. Air dry.</p>')
    self.assertEqual(self.detail('care-guide')['excerpt'], 'Cold wash and air dry.')
    self.assertEqual(self.article_page()['nodes'][-1], {'blog': {'handle': 'guides'},
      'handle': 'care-guide', 'publishedAt': '2026-01-02T00:00:00Z'})

  def test_long_body_literal_hash_structure_and_unicode(self):
    for event in ('e1', 'e2', 'e3', 'e4'):
      self.source.apply(event)
    body = self.detail('care-guide')['contentHtml']
    self.assertEqual(len(body.encode('utf-8')), 1679444)
    self.assertEqual(hashlib.sha256(body.encode('utf-8')).hexdigest(),
                     '1df175722789cacbed2f17d84258a4f00445b9c3b0226a06dea881c27b8d66c0')
    parser = Tags()
    parser.feed(body)
    self.assertEqual(sum(t == 'p' for t, _ in parser.tags), 8193)
    self.assertEqual([a for t, a in parser.tags if t == 'h2'], [{'id': 'care'}, {'id': 'end'}])
    self.assertEqual([a for t, a in parser.tags if t == 'p'][-2:], [{'data-section': '08192'}, {}])
    self.assertEqual(sum(t == 'a' and a == {'href': '/blogs/guides/size-guide#measure'} for t, a in parser.tags), 8192)
    self.assertIn('Café naïve — 日本語と絵文字 🧵🧼', body)
    self.assertTrue(body.endswith('<p>完整结束。END-08192</p>'))
    self.assertNotIn('contentHtml', self.blog()['articles']['nodes'][1])

  def test_blog_nonarticle_shapes_and_nulls(self):
    self.assertEqual(self.source.respond('getSitemapPage', {'type': 'BLOG', 'page': 1}),
      {'data': {'sitemap': {'resources': {'items': [{'handle': 'guides', 'updatedAt': '2026-01-01T00:00:00Z'}]}}}})
    for kind in ('BLOG', 'PRODUCT', 'COLLECTION', 'PAGE'):
      self.assertEqual(self.count(kind), 1 if kind == 'BLOG' else 0)
      self.assertEqual(self.source.respond('getSitemapPage', {'type': kind, 'page': 2}),
                       {'data': {'sitemap': {'resources': {'items': []}}}})
    self.assertEqual(self.source.respond('getBlog', {'handle': 'missing', 'first': 50}), {'data': {'blog': None}})
    self.assertEqual(self.source.respond('getBlogArticle', {'blogHandle': 'missing', 'articleHandle': 'care-guide'}), {'data': {'blog': None}})
    self.assertIsNone(self.detail('missing'))
    self.assertIsNone(self.detail('size-guide'))
    self.assertEqual(self.blog()['seo'], {'title': 'Fixture Guides | Fixture Shop', 'description': 'Synthetic guides.'})

  def test_success_omits_errors_and_failure_is_nonmutating(self):
    before = self.source.records
    for _ in range(2):
      self.assertEqual(self.source.respond('getBlog', {'handle': 'guides', 'first': 50}, unavailable=True),
        {'data': None, 'errors': [{'message': 'fixture unavailable', 'extensions': {'code': 'INTERNAL_SERVER_ERROR'}}]})
    self.assertEqual(self.source.state, 'S0')
    self.assertEqual(self.source.records, before)
    self.assertNotIn('errors', self.source.respond('getBlog', {'handle': 'guides', 'first': 50}))
    self.source.apply('e1')
    self.assertEqual(self.detail('care-guide')['title'], 'Care guide v2')

  def test_wrong_order_unknown_request_and_missing_input_do_not_advance(self):
    before = self.source.records
    for event in ('e2', 'e4', 'unknown', None):
      with self.assertRaises(ValueError):
        self.source.apply(event)
    bad = [('unknown', {}), ('getBlog', {}), ('getBlog', None),
      ('getBlog', {'handle': 'guides', 'first': True}),
      ('getBlog', {'handle': 'guides', 'first': 0}),
      ('getBlog', {'handle': 'guides', 'first': 50, 'country': 'CA'}),
      ('getSitemapPagesCount', {'type': 'invented'}),
      ('getSitemapPage', {'type': 'ARTICLE', 'page': 1}),
      ('getArticleSitemapPage', {'first': 250, 'after': 'p23:251'}),
      ('getArticleSitemapPage', {'first': 1, 'after': None})]
    for operation, variables in bad:
      with self.subTest(operation=operation, variables=variables), self.assertRaises(ValueError):
        self.source.respond(operation, variables)
    self.assertEqual(self.source.state, 'S0')
    self.assertEqual(self.source.records, before)
    self.source.apply('e1')
    with self.assertRaises(ValueError):
      self.source.apply('e1')
    self.assertEqual(self.source.state, 'S1a')

  def test_failed_event_construction_is_atomic(self):
    for event in ('e1', 'e2', 'e3'):
      self.source.apply(event)
    before = self.source.records
    with patch.object(FIXTURE, 'long_body', side_effect=ValueError('synthetic failure')):
      with self.assertRaises(ValueError):
        self.source.apply('e4')
    self.assertEqual(self.source.state, 'S1')
    self.assertEqual(self.source.records, before)

  def test_response_and_ledger_mutation_cannot_change_source(self):
    self.detail('care-guide')['seo']['title'] = 'tampered'
    self.blog()['seo']['title'] = 'tampered'
    self.source.records['care-guide']['body'] = 'tampered'
    self.article_page()['nodes'][0]['blog']['handle'] = 'tampered'
    self.assertEqual(self.detail('care-guide')['seo']['title'], 'Care guide v1 | Fixture Shop')
    self.assertEqual(self.blog()['seo']['title'], 'Fixture Guides | Fixture Shop')
    self.assertEqual(self.detail('care-guide')['contentHtml'], '<h2>Care</h2><p>Wash cold.</p>')
    self.assertEqual(self.article_page()['nodes'][0]['blog']['handle'], 'guides')

  def test_count_is_independent_of_record_cardinality(self):
    # 故意破坏私有数据以区分固定 count 与 ceil(len/250)，非公共用法。
    self.source._records.clear()
    self.assertEqual(self.count(), 1)
    other = FIXTURE.Scenario()
    other.apply('e1')
    other.apply('e2')
    other._records.clear()
    self.assertEqual(other.respond('getSitemapPagesCount', {'type': 'ARTICLE'}),
                     {'data': {'sitemap': {'pagesCount': {'count': 2}}}})

  def test_cli_exports_and_rejects_invalid_json(self):
    args = [sys.executable, '-B', str(SCRIPT), '--state', 'S1b',
            '--operation', 'getSitemapPagesCount', '--variables', '{"type":"ARTICLE"}']
    result = subprocess.run(args, capture_output=True, text=True, check=False)
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertEqual(json.loads(result.stdout), {'data': {'sitemap': {'pagesCount': {'count': 2}}}})
    result = subprocess.run(args[:-1] + ['{'], capture_output=True, text=True, check=False)
    self.assertEqual(result.returncode, 2)
    self.assertEqual(result.stdout, '')


if __name__ == '__main__':
  unittest.main()
