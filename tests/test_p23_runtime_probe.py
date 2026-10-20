"""Portable probe regressions only; these tests never start Next or a server."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

DIRECTORY = Path(__file__).resolve().parents[1] / 'scripts/research'
sys.path.insert(0, str(DIRECTORY))
try:
  SPEC = importlib.util.spec_from_file_location('p23_probe', DIRECTORY / 'p23_runtime_probe.py')
  PROBE = importlib.util.module_from_spec(SPEC)
  SPEC.loader.exec_module(PROBE)
finally:
  sys.path.pop(0)


def synthetic_http(state):
  """Hand-built consumer fixtures exercise assertions, not upstream transforms."""
  version = {'S0': 'v1', 'S1a': 'v2', 'S1b': 'v2', 'S1': 'v2', 'S2': 'v3'}[state]
  title = 'Care guide ' + version
  description = {'v1': 'Care guide v1 summary', 'v2': 'Wash cold and air dry.',
                 'v3': 'A detailed care guide. Wash cold and air dry.'}[version]
  body = PROBE.long_body() if state == 'S2' else '<p>Wash cold.</p>'
  article = f'<meta name="description" content="{description}"><h1>{title}</h1><time datetime="2026-01-02T00:00:00Z"></time>{body}'
  excerpt = 'Long-form care guide; cold wash, air dry.' if state == 'S2' else 'Cold wash and air dry.'
  listing = '<h2>' + title + '</h2>' + '<h2>archive</h2>' * 49 + excerpt
  if state in ('S1b', 'S1', 'S2'):
    listing += 'Size guide'
  if state not in ('S1', 'S2'):
    listing += 'Retired guide'
  tails = {'S0': ['care-guide', 'retired-guide'], 'S1a': ['retired-guide', 'care-guide'],
    'S1b': ['retired-guide', 'care-guide'], 'S1': ['care-guide', 'size-guide'], 'S2': ['size-guide', 'care-guide']}[state]
  def urls(handles):
    return '<urlset>' + ''.join(f'<url><loc>https://shop.example.test/blogs/guides/{h}</loc><lastmod>2026-01-02T00:00:00Z</lastmod></url>' for h in handles) + '</urlset>'
  index_ids = ['static', 'blogs-1', 'articles-1'] + (['articles-2'] if state == 'S1b' else [])
  routes = {
    '/blogs/guides/care-guide': article,
    '/blogs/guides': listing,
    '/blogs/guides/retired-guide': '<meta name="robots" content="noindex">Not found' if state in ('S1', 'S2') else 'Retired guide',
    '/blogs/guides/size-guide': '<h2 id="measure">Size</h2>',
    '/sitemap.xml': '<sitemapindex>' + ''.join(f'<sitemap><loc>https://shop.example.test/sitemap/{x}.xml</loc></sitemap>' for x in index_ids) + '</sitemapindex>',
    '/sitemap/articles-1.xml': urls([f'archive-{i:03}' for i in range(1, 249)] + tails),
    '/sitemap/articles-2.xml': urls(['size-guide'] if state == 'S1b' else []),
    '/sitemap/blogs-1.xml': '<urlset><url><loc>https://shop.example.test/blogs/guides</loc><lastmod>2026-01-01T00:00:00Z</lastmod></url></urlset>',
  }
  def request(path, payload=None, rsc=False):
    return 200, (title + (' END-08192' if state == 'S2' else '')) if rsc else routes[path]
  return routes, request


class ProbeTests(unittest.TestCase):
  def test_bridge_same_source_all_events_and_unknowns(self):
    source = PROBE.Scenario()
    with contextlib.redirect_stdout(io.StringIO()):
      for event, state in zip(('e1', 'e2', 'e3', 'e4'), ('S1a', 'S1b', 'S1', 'S2')):
        self.assertEqual(PROBE.dispatch(source, '/event', {'event': event}), {'state': state})
      self.assertIsNone(PROBE.dispatch(source, '/request', {'operation': 'getBlogArticle',
        'variables': {'blogHandle': 'guides', 'articleHandle': 'retired-guide'}})['data']['blog']['articleByHandle'])
      for payload in ({}, {'operation': 'unknown'}, {'operation': 'getBlog', 'locale': {'country': 'CA'}},
                      {'operation': 'getShopPolicies', 'variables': {'unexpected': True}}):
        with self.assertRaises((ValueError, KeyError)):
          PROBE.dispatch(source, '/request', payload)
      with self.assertRaises(ValueError):
        PROBE.dispatch(source, '/unknown', {})
      with self.assertRaises(ValueError):
        PROBE.dispatch(source, '/request', None)
      self.assertEqual(source.state, 'S2')

  def test_explicit_empty_policies(self):
    with contextlib.redirect_stdout(io.StringIO()):
      response = PROBE.dispatch(PROBE.Scenario(), '/request', {'operation': 'getShopPolicies'})
    self.assertEqual(len(response['data']['shop']), 7)
    self.assertEqual(set(response['data']['shop'].values()), {None})

  def test_all_checkpoint_assertions_accept_synthetic_consumers(self):
    with tempfile.TemporaryDirectory() as tmp, patch.object(PROBE, 'ROOT', Path(tmp)):
      for state in ('S0', 'S1a', 'S1b', 'S1', 'S2'):
        _, request = synthetic_http(state)
        with patch.object(PROBE, 'request', request):
          result = PROBE.check(state)
        self.assertEqual(result['state'], state)
        self.assertEqual(result['page2_count'], int(state == 'S1b'))

  def test_stale_title_missing_metadata_and_old_second_page_fail(self):
    for state, route, bad in (
      ('S1a', '/blogs/guides/care-guide', 'Care guide v1'),
      ('S0', '/blogs/guides/care-guide', '<h1>Care guide v1</h1>'),
      ('S1', '/sitemap/articles-2.xml', '<urlset><url><loc>unexpected</loc></url></urlset>')):
      routes, request = synthetic_http(state)
      routes[route] = bad
      with patch.object(PROBE, 'request', request), self.assertRaises(AssertionError):
        PROBE.check(state)

  def test_error_status_and_wrong_or_duplicate_index_rejected(self):
    routes, good = synthetic_http('S1')
    for route in routes:
      def bad(path, payload=None, rsc=False):
        status, body = good(path, payload, rsc)
        return (500 if path == route else status), body
      with self.subTest(route=route), patch.object(PROBE, 'request', bad), self.assertRaises(AssertionError):
        PROBE.check('S1')
    def bad_rsc(path, payload=None, rsc=False):
      status, body = good(path, payload, rsc)
      return (500 if rsc else status), body
    with patch.object(PROBE, 'request', bad_rsc), self.assertRaises(AssertionError):
      PROBE.check('S1')
    for bad in ('<sitemapindex>' + '<sitemap><loc>https://wrong.example/x</loc></sitemap>' * 3 + '</sitemapindex>',
                routes['/sitemap.xml'].replace('articles-1.xml', 'blogs-1.xml'),
                routes['/sitemap.xml'].replace('articles-1.xml', 'articles-9.xml')):
      routes['/sitemap.xml'] = bad
      with patch.object(PROBE, 'request', good), self.assertRaises(AssertionError):
        PROBE.check('S1')

  def test_body_complete_tokens_and_middle_corruption(self):
    body = PROBE.long_body()
    result = PROBE.verify_body('<html><script>ignore</script>' + body + '</html>')
    self.assertEqual(result['token_count'], 57353)
    self.assertEqual(result['source_sha256'], '1df175722789cacbed2f17d84258a4f00445b9c3b0226a06dea881c27b8d66c0')
    for bad in ('', body.replace('第04096节', 'corrupted', 1), body.replace('END-08192', 'missing')):
      with self.assertRaises(AssertionError):
        PROBE.verify_body(bad)

  def test_http_requires_actual_rsc_mime_and_clears_deadline(self):
    class Response:
      status = 200
      headers = {'Content-Type': 'text/html'}
      def read(self):
        return b'Care guide v1'
    with patch.object(PROBE.urllib.request, 'urlopen', return_value=Response()), \
        patch.object(PROBE.signal, 'alarm') as alarm, contextlib.redirect_stdout(io.StringIO()):
      with self.assertRaisesRegex(AssertionError, 'RSC MIME'):
        PROBE.request('/blogs/guides/care-guide', rsc=True)
      self.assertEqual(alarm.call_args_list[-1].args, (0,))

  def test_missing_cli_input_and_unsafe_baseline_rejected(self):
    with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as exc:
      PROBE.main([])
    self.assertEqual(exc.exception.code, 2)
    with tempfile.TemporaryDirectory() as tmp:
      app = Path(tmp)
      with self.assertRaises(FileNotFoundError):
        PROBE.validate_app(app)
      (app / 'package.json').write_text(json.dumps({'dependencies': {'next': '16.4.0'}}))
      with self.assertRaisesRegex(ValueError, 'baseline'):
        PROBE.validate_app(app)

  def test_prepared_manifest_and_nonempty_output_guard(self):
    with tempfile.TemporaryDirectory() as tmp:
      app = Path(tmp) / 'app'
      app.mkdir()
      (app / 'package.json').write_text(json.dumps({'dependencies': {'next': '16.4.1'}}))
      for rel in ('node_modules/next/dist/bin/next', 'pnpm-lock.yaml', 'lib/shopify/storefront/server.ts'):
        target = app / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text('http://127.0.0.1:8766/request' if rel.endswith('server.ts') else '')
      installed = app / 'node_modules/next/package.json'
      installed.write_text(json.dumps({'version': '16.4.0'}))
      with self.assertRaisesRegex(ValueError, 'installed Next'):
        PROBE.validate_app(app)
      installed.write_text(json.dumps({'version': '16.4.1'}))
      PROBE.validate_app(app)
      output = Path(tmp) / 'output'
      output.mkdir()
      (output / 'prior-result.json').write_text('{}')
      with patch.object(PROBE.subprocess, 'Popen') as spawn, self.assertRaisesRegex(ValueError, 'empty'):
        PROBE.run(app, output)
      spawn.assert_not_called()

  def test_import_has_no_server_side_effects(self):
    self.assertEqual(PROBE.processes, [])
    self.assertIsNone(PROBE.ROOT)


if __name__ == '__main__':
  unittest.main()
