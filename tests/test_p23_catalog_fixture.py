import hashlib
from pathlib import Path
from copy import deepcopy
import unittest
import sys

SCRIPT_DIR = Path(__file__).resolve().parents[1] / 'scripts/research'
sys.path.insert(0, str(SCRIPT_DIR))
from p23_catalog_fixture import MODE, FOUR, Router, AuditFatalError, http_result, empty_catalog_response
from p23_source_fixture import Scenario, STATES, EVENTS

DEFAULTS = {'getCollections': {'first': 250}, 'getCollectionsWithFeaturedImage': {'first': 250}, 'searchProducts': {'query': '*', 'first': 40}, 'searchFacets': {'query': '*'}}

def response(op, variables=None, **kwargs):
  return empty_catalog_response(op, deepcopy(DEFAULTS[op] if variables is None else variables), mode=MODE, **kwargs)


def assert_shape(op, result):
  # Explicit structural oracle: not merely HTTP success or truthiness.
  if set(result) != {'data'}:
    raise AssertionError('unexpected envelope')
  data = result['data']
  if op.startswith('getCollections'):
    assert data == {'collections': {'edges': []}}
  elif op == 'searchProducts':
    assert data == {'search': {'edges': [], 'pageInfo': {'hasNextPage': False, 'hasPreviousPage': False, 'startCursor': None, 'endCursor': None}, 'productFilters': []}}
  elif op == 'searchFacets':
    assert data == {'search': {'totalCount': 0, 'nodes': [], 'productFilters': []}}
    assert type(data['search']['totalCount']) is int


class CatalogTests(unittest.TestCase):
  def test_01_collections(self):
    for op, sizes in [('getCollections', (50, 250)), ('getCollectionsWithFeaturedImage', (250,))]:
      for size in sizes:
        assert_shape(op, response(op, {'first': size}))

  def test_02_products(self):
    for size in (1, 8, 40):
      for extras in ({}, {'after': None, 'productFilters': None}, {'productFilters': []}, {'sortKey': 'RELEVANCE', 'reverse': False, 'country': 'US', 'language': 'EN'}):
        assert_shape('searchProducts', response('searchProducts', {'query': '*', 'first': size, **extras}))

  def test_03_facets(self):
    for extra in ({}, {'productFilters': None}, {'productFilters': []}):
      assert_shape('searchFacets', response('searchFacets', {'query': '*', **extra}))

  def test_04_original_five_stages(self):
    logs = []
    router = Router(mode=MODE, audit_sink=logs.append)
    oracle = Scenario()
    queries = [('getBlog', {'handle': 'guides', 'first': 50}), ('getBlogArticle', {'blogHandle': 'guides', 'articleHandle': 'care-guide'}), ('getBlogArticle', {'blogHandle': 'guides', 'articleHandle': 'size-guide'}), ('getBlogArticle', {'blogHandle': 'guides', 'articleHandle': 'retired-guide'}), ('getSitemapPagesCount', {'type': 'ARTICLE'}), ('getArticleSitemapPage', {'first': 250, 'after': None}), ('getArticleSitemapPage', {'first': 250, 'after': 'p23:250'}), ('getSitemapPage', {'type': 'BLOG', 'page': 1})]
    source_id = id(router.source)
    published = oracle.records['care-guide']['publishedAt']
    for index, state in enumerate(STATES):
      self.assertEqual(router.source.state, state)
      before = router.source.records
      for op, variables in DEFAULTS.items():
        assert_shape(op, router.handle('/request', {'operation': op, 'variables': variables}))
      self.assertEqual(router.source.records, before)
      for op, variables in queries:
        self.assertEqual(router.handle('/request', {'operation': op, 'variables': variables}), oracle.respond(op, variables))
      records = router.source.records
      self.assertEqual(len(records), (250, 250, 251, 250, 250)[index])
      self.assertEqual(records['care-guide']['publishedAt'], published)
      self.assertEqual(records['care-guide']['sourceRevision'], (1, 2, 2, 2, 3)[index])
      self.assertEqual('size-guide' in records, index >= 2)
      self.assertEqual('retired-guide' in records, index < 3)
      if state == 'S2':
        self.assertEqual(records['care-guide']['body'].count('<p data-section='), 8192)
        self.assertIn('END-08192', records['care-guide']['body'])
      self.assertEqual(id(router.source), source_id)
      if index < 4:
        self.assertEqual(router.handle('/event', {'event': EVENTS[index]}), {'state': oracle.apply(EVENTS[index])})
    self.assertTrue(all(row['outcome'] == 'success' for row in logs))

  def test_05_unknown_and_caught_failures_logged(self):
    logs = []
    router = Router(mode=MODE, audit_sink=logs.append)
    for op in ('getCollection', 'getProductByHandle', 'cartCreate', 'unknown', 'collectionProducts'):
      for down in (False, True):
        try:
          router.handle('/request', {'operation': op, 'variables': {}}, unavailable=down)
        except ValueError:
          pass  # Simulates an app catch; audit must survive it.
        else:
          self.fail('unknown operation accepted')
        self.assertEqual(logs[-1]['payload']['operation'], op)
        self.assertEqual(logs[-1]['outcome'], 'rejected')
        self.assertEqual(logs[-1]['state_before'], logs[-1]['state_after'])
    self.assertEqual(len(logs), 10)

  def test_06_bad_variables(self):
    for op in FOUR:
      for bad in (None, [], 'x', {}, {**DEFAULTS[op], 'unexpected': 1}):
        with self.subTest(op=op, bad=bad), self.assertRaises(ValueError):
          empty_catalog_response(op, bad, mode=MODE)
    for bad in (True, False, 0, -1, '40', 1.5, 50):
      with self.subTest(first=bad), self.assertRaises(ValueError):
        response('searchProducts', {'query': '*', 'first': bad})
    for op, extra in [('getCollections', {'after': None}), ('searchFacets', {'first': 1}), ('searchFacets', {'sortKey': 'RELEVANCE'})]:
      with self.assertRaises(ValueError):
        response(op, {**DEFAULTS[op], **extra})

  def test_07_unsupported_defaults_and_mode_locale(self):
    extras = [{'after': 'cursor-x'}, {'after': ''}, {'sortKey': 'PRICE'}, {'reverse': True}, {'reverse': 0}, {'query': 'shirt'}, {'country': 'CA'}, {'language': 'FR'}]
    extras += [{'productFilters': v} for v in (False, 0, {}, '', [{'available': True}])]
    for extra in extras:
      with self.subTest(extra=extra), self.assertRaises(ValueError):
        response('searchProducts', {**DEFAULTS['searchProducts'], **extra})
    for mode in (None, '', 'fallback'):
      with self.assertRaises(ValueError):
        empty_catalog_response('searchFacets', {'query': '*'}, mode=mode)
      with self.assertRaises(ValueError):
        Router(mode=mode, audit_sink=lambda r: None)
    with self.assertRaises(TypeError):
      empty_catalog_response('searchFacets', {'query': '*'})
    logs = []
    router = Router(mode=MODE, audit_sink=logs.append)
    for locale in (None, {'country': 'US', 'language': 'EN'}, {'country': 'US', 'language': 'EN', 'locale': 'en-US'}):
      assert_shape('searchFacets', router.handle('/request', {'operation': 'searchFacets', 'variables': {'query': '*'}, 'locale': locale}))
    for locale in ({}, 'en-US', {'country': 'CA', 'language': 'EN'}):
      with self.assertRaises(ValueError):
        router.handle('/request', {'operation': 'searchFacets', 'variables': {'query': '*'}, 'locale': locale})
      self.assertEqual(logs[-1]['outcome'], 'rejected')

  def test_08_shape_counterexamples(self):
    bad = [('getCollections', {'data': {'collections': {'nodes': []}}}), ('searchProducts', {'data': {'search': {'edges': None}}}), ('searchProducts', {'data': {'search': {'edges': [], 'productFilters': []}}}), ('searchFacets', {'data': {'search': {'totalCount': 0, 'productFilters': []}}}), ('searchFacets', {'data': {'search': {'totalCount': 1, 'nodes': [], 'productFilters': []}}})]
    for op, result in bad:
      with self.assertRaises(AssertionError):
        assert_shape(op, result)

  def test_09_unavailable_not_empty(self):
    logs = []
    router = Router(mode=MODE, audit_sink=logs.append)
    for op, variables in DEFAULTS.items():
      result = router.handle('/request', {'operation': op, 'variables': variables}, unavailable=True)
      self.assertIsNone(result['data'])
      self.assertEqual(result['errors'][0]['extensions']['code'], 'INTERNAL_SERVER_ERROR')
      self.assertEqual(logs[-1]['outcome'], 'graphql_error')
    with self.assertRaises(ValueError):
      response('searchProducts', {}, unavailable=True)

  def test_10_snapshots_and_event_order(self):
    logs = []
    router = Router(mode=MODE, audit_sink=logs.append)
    before = router.source.records
    changed = response('searchProducts')
    changed['data']['search']['edges'].append({'fake': 1})
    changed['data']['search']['pageInfo']['hasNextPage'] = True
    assert_shape('searchProducts', response('searchProducts'))
    changed = response('getCollections')
    changed['data']['collections']['edges'].append({'fake': 1})
    assert_shape('getCollections', response('getCollections'))
    self.assertEqual(router.source.records, before)
    for event in ('e2', 'e3'):
      with self.assertRaises(ValueError):
        router.handle('/event', {'event': event})
      self.assertEqual(router.source.state, 'S0')
      self.assertEqual(router.source.records, before)
    router.handle('/event', {'event': 'e1'})
    for event in ('e1', 'e3'):
      with self.assertRaises(ValueError):
        router.handle('/event', {'event': event})
    router.handle('/event', {'event': 'e2'})
    with self.assertRaises(ValueError):
      router.handle('/event', {'event': 'e2'})
    router.handle('/event', {'event': 'e3'})
    with self.assertRaises(ValueError):
      router.handle('/event', {'event': 'e3'})

  def test_optional_fifth_explicit_only(self):
    variables = {'handle': '__placeholder__', 'first': 40, 'sortKey': 'COLLECTION_DEFAULT', 'reverse': False}
    with self.assertRaises(ValueError):
      empty_catalog_response('collectionProducts', variables, mode=MODE)
    for extra in ({}, {'after': None, 'filters': []}, {'filters': None}):
      self.assertEqual(empty_catalog_response('collectionProducts', {**variables, **extra}, mode=MODE, enable_collection_products=True), {'data': {'collection': None}})
    for extra in ({'handle': 'real'}, {'filters': False}, {'filters': [{}]}, {'first': 8}, {'sortKey': 'RELEVANCE'}, {'productFilters': []}):
      with self.assertRaises(ValueError):
        empty_catalog_response('collectionProducts', {**variables, **extra}, mode=MODE, enable_collection_products=True)
    router = Router(mode=MODE, enable_collection_products=True, audit_sink=lambda r: None)
    self.assertEqual(router.handle('/request', {'operation': 'collectionProducts', 'variables': variables}), {'data': {'collection': None}})

  def test_audit_sink_first_unknown_is_permanently_fatal(self):
    delivered = []
    calls = []
    def sink(record):
      calls.append(record)
      if len(calls) == 1:
        raise OSError('simulated output loss')
      delivered.append(record)
    router = Router(mode=MODE, audit_sink=sink)
    status, result = http_result(router, '/request', {'operation': 'unknown0'})
    self.assertEqual(status, 503)
    self.assertEqual(delivered, [])
    fatal = router.audit_fatal
    self.assertFalse(fatal['durable_log_confirmed'])
    self.assertEqual(fatal['failed_record']['error_type'], 'ValueError')
    self.assertIn('unknown0', fatal['failed_record']['error'])
    self.assertEqual(fatal['state'], 'S0')
    fatal['state'] = 'tampered'
    self.assertEqual(router.audit_fatal['state'], 'S0')
    for endpoint, payload in [('/request', {'operation': 'searchFacets', 'variables': {'query': '*'}}), ('/event', {'event': 'e1'})]:
      with self.assertRaises(AuditFatalError):
        router.handle(endpoint, payload)
      self.assertEqual(http_result(router, endpoint, payload)[0], 503)
    self.assertEqual(len(calls), 1)
    self.assertEqual(router.source.state, 'S0')

  def test_audit_sink_event_commit_is_not_rolled_back(self):
    calls = []
    def sink(record):
      calls.append(record)
      raise OSError('simulated output loss')
    router = Router(mode=MODE, audit_sink=sink)
    with self.assertRaises(AuditFatalError):
      router.handle('/event', {'event': 'e1'})
    self.assertEqual(router.source.state, 'S1a')
    self.assertEqual(router.source.records['care-guide']['sourceRevision'], 2)
    fatal = router.audit_fatal
    self.assertEqual(fatal['failed_record']['state_before'], 'S0')
    self.assertEqual(fatal['failed_record']['state_after'], 'S1a')
    self.assertEqual(fatal['failed_record']['outcome'], 'success')
    self.assertFalse(fatal['durable_log_confirmed'])
    for endpoint, payload in [('/event', {'event': 'e2'}), ('/request', {'operation': 'getBlog', 'variables': {'handle': 'guides', 'first': 50}})]:
      self.assertEqual(http_result(router, endpoint, payload)[0], 503)
    self.assertEqual(router.source.state, 'S1a')
    self.assertEqual(len(calls), 1)

  def test_main_exits_nonzero_after_fatal_without_socket(self):
    from unittest.mock import patch
    import p23_catalog_fixture
    def sink(record):
      raise OSError('simulated sink loss')
    router = Router(mode=MODE, audit_sink=sink)
    class FakeServer:
      calls = 0
      closed = False
      def handle_request(self):
        self.calls += 1
        self_result = http_result(router, '/event', {'event': 'e1'})
        assert self_result[0] == 503
      def server_close(self):
        self.closed = True
    server = FakeServer()
    with patch('sys.argv', ['p23_catalog_fixture.py', '--mode', MODE]), patch('p23_catalog_fixture.Router', return_value=router), patch('http.server.HTTPServer', return_value=server), patch('sys.stderr'):
      self.assertEqual(p23_catalog_fixture.main(), 2)
    self.assertEqual(server.calls, 1)
    self.assertTrue(server.closed)
    self.assertEqual(router.source.state, 'S1a')

  def test_source_identity_and_policies(self):
    source = (SCRIPT_DIR / 'p23_source_fixture.py').read_bytes()
    self.assertEqual(hashlib.sha256(source).hexdigest(), 'e7de286caca02e6d0fb5444fb167d12d970010cd1acf755189781d990c593757')
    router = Router(mode=MODE, audit_sink=lambda r: None)
    self.assertEqual(len(router.handle('/request', {'operation': 'getShopPolicies', 'variables': {}})['data']['shop']), 7)
    self.assertTrue(all(v is None for v in router.handle('/request', {'operation': 'getShopPolicies'})['data']['shop'].values()))

if __name__ == '__main__':
  unittest.main(verbosity=2)
