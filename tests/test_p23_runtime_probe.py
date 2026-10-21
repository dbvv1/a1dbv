"""Portable probe regressions only; these tests never start Next or a server."""
import contextlib
import fcntl
import os
import signal
import subprocess
import time
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch

DIRECTORY = Path(__file__).resolve().parents[1] / 'scripts/research'
sys.path.insert(0, str(DIRECTORY))
try:
  SPEC = importlib.util.spec_from_file_location('p23_probe', DIRECTORY / 'p23_runtime_probe.py')
  PROBE = importlib.util.module_from_spec(SPEC)
  SPEC.loader.exec_module(PROBE)
  from p23_catalog_fixture import Router, MODE as CATALOG_MODE
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
    def published(handle):
      if handle.startswith('archive-'):
        minutes = int(handle.split('-')[1])
        hour, minute = divmod(minutes, 60)
        return f'2026-01-01T{hour:02}:{minute:02}:00Z'
      return {'care-guide': '2026-01-02T00:00:00Z',
        'retired-guide': '2026-01-03T00:00:00Z',
        'size-guide': '2026-10-20T10:01:00Z'}[handle]
    return '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join(f'<url><loc>https://shop.example.test/blogs/guides/{h}</loc><lastmod>{published(h)}</lastmod></url>' for h in handles) + '</urlset>'
  index_ids = ['static', 'blogs-1', 'articles-1'] + (['articles-2'] if state == 'S1b' else [])
  routes = {
    '/blogs/guides/care-guide': article,
    '/blogs/guides': listing,
    '/blogs/guides/retired-guide': '<meta name="robots" content="noindex">Not found' if state in ('S1', 'S2') else 'Retired guide',
    '/blogs/guides/size-guide': '<h2 id="measure">Size</h2>',
    '/sitemap.xml': '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join(f'<sitemap><loc>https://shop.example.test/sitemap/{x}.xml</loc></sitemap>' for x in index_ids) + '</sitemapindex>',
    '/sitemap/articles-1.xml': urls([f'archive-{i:03}' for i in range(1, 249)] + tails),
    '/sitemap/articles-2.xml': urls(['size-guide'] if state == 'S1b' else []),
    '/sitemap/blogs-1.xml': '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://shop.example.test/blogs/guides</loc><lastmod>2026-01-01T00:00:00Z</lastmod></url></urlset>',
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
    for bad in ('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + '<sitemap><loc>https://wrong.example/x</loc></sitemap>' * 3 + '</sitemapindex>',
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

  def test_full_sitemap_middle_duplicate_lastmod_missing_and_order_fail(self):
    routes, request = synthetic_http('S1b')
    original = routes['/sitemap/articles-1.xml']
    middle = '<url><loc>https://shop.example.test/blogs/guides/archive-125</loc><lastmod>2026-01-01T02:05:00Z</lastmod></url>'
    mutations = [original.replace('archive-125', 'wrong-middle'),
      original.replace('archive-125', 'archive-124'),
      original.replace('2026-01-01T02:05:00Z', '2026-01-01T02:06:00Z'),
      original.replace(middle, ''),
      original.replace('archive-125', 'TEMP').replace('archive-124', 'archive-125').replace('TEMP', 'archive-124')]
    for bad in mutations:
      routes['/sitemap/articles-1.xml'] = bad
      with self.subTest(bad=bad[:60]), patch.object(PROBE, 'request', request), self.assertRaises(AssertionError):
        PROBE.check('S1b')
    routes['/sitemap/articles-1.xml'] = original
    for key in ('articles-2', 'blogs-1'):
      route = '/sitemap/' + key + '.xml'
      original_page = routes[route]
      for bad in (original_page.replace('2026-', '2025-'), '<urlset></urlset>',
                  original_page.replace('</urlset>', original_page[8:])):
        routes[route] = bad
        with patch.object(PROBE, 'request', request), self.assertRaises(AssertionError):
          PROBE.check('S1b')
      routes[route] = original_page

  def test_cli_modes_and_missing_production_inputs(self):
    with patch.object(PROBE, 'run') as run:
      PROBE.main(['--app', 'app', '--output', 'out'])
      self.assertEqual(run.call_args.args[-1], 'dev')
      PROBE.main(['--app', 'app', '--output', 'out', '--mode', 'focused-production'])
      self.assertEqual(run.call_args.args[-1], 'focused-production')
    for args in (['--mode', 'focused-production'], ['--app', 'app'],
                 ['--source', '--mode', 'focused-production'], ['--mode', 'production']):
      with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
        PROBE.main(args)

  def test_capture_xml_and_deleted_html_preserves_unicode_and_attempts(self):
    class Response:
      status = 404
      headers = {'Content-Type': 'text/html; charset=utf-8'}
      def read(self):
        return '日本語 🧵 Café'.encode('utf-8')
    with tempfile.TemporaryDirectory() as tmp, patch.object(PROBE, 'ROOT', Path(tmp)), \
        patch.object(PROBE, 'CURRENT_STATE', 'S2'), patch.object(PROBE.signal, 'alarm'), \
        patch.object(PROBE.urllib.request, 'urlopen', return_value=Response()), \
        contextlib.redirect_stdout(io.StringIO()):
      for route in ('/sitemap/articles-1.xml', '/blogs/guides/retired-guide', '/blogs/guides/retired-guide'):
        self.assertEqual(PROBE.request(route)[0], 404)
      captures = list((Path(tmp) / 'responses').iterdir())
      self.assertEqual(len(captures), 3)
      self.assertTrue(all(p.read_text(encoding='utf-8') == '日本語 🧵 Café' for p in captures))

  def exercise_run(self, mode, build_outcome=0, wrong_event=False, source_exits=False, late_source_exit=False, audit_failure=False, **contract):
    """Mock every process/socket/wait: no Next, build, source server or real sleep."""
    with tempfile.TemporaryDirectory() as tmp, contextlib.ExitStack() as stack:
      output = Path(tmp)
      spawned = []
      def spawn(command, **kwargs):
        process = Mock(pid=1000 + len(spawned), returncode=None)
        process.poll.return_value = None
        if source_exits and not spawned:
          process.poll.side_effect = lambda: 2 if router.source.state != 'S0' else None
        is_build = 'build' in command
        waited = False
        def wait(timeout=None):
          nonlocal waited
          if is_build and not waited:
            waited = True
            if build_outcome == 'timeout':
              raise PROBE.subprocess.TimeoutExpired(command, timeout)
            process.returncode = build_outcome
          else:
            process.returncode = 0
          return process.returncode
        process.wait.side_effect = wait
        spawned.append((command, kwargs, process))
        return process
      def audit(entry):
        with (output / 'continuity-fixture.log').open('a', encoding='utf-8') as stream:
          stream.write(json.dumps(entry) + '\n')
      router = Router(mode=CATALOG_MODE, audit_sink=audit, **contract)
      source_identity = id(router.source)
      def check(state):
        self.assertEqual(router.source.state, state)
        self.assertEqual(id(router.source), source_identity)
        router.handle('/request', {'operation': 'searchFacets', 'variables': {'query': '*'}})
        if contract.get('enable_placeholder_get_collection'):
          self.assertEqual(router.handle('/request', {'operation': 'getCollection',
            'variables': {'handle': '__placeholder__'},
            'locale': {'country': 'US', 'language': 'EN', 'locale': 'en-US'}}),
            {'data': {'collection': None}})
        if state == 'S2':
          (output / 'S2-article.html').write_text('日本語 🧵', encoding='utf-8')
        return {'state': state}
      events = []
      def request(path, payload=None, rsc=False):
        self.assertEqual(path, '/event')
        events.append(payload['event'])
        return 200, json.dumps({'state': 'S0'} if wrong_event else router.handle(path, payload))
      def killpg(pid, sig):
        if sig == 0:
          raise ProcessLookupError()
        process = next(p for _, _, p in spawned if p.pid == pid)
        process.poll.return_value = 2 if late_source_exit and process is spawned[0][2] else -sig
      for owner, attr, value in ((PROBE, 'validate_app', Mock()),
          (PROBE, 'validate_existing', Mock(return_value={'build_id': 'synthetic-build', 'build_performed': False})),
          (PROBE.subprocess, 'run', Mock(return_value=Mock(stdout='v24.19.0'))),
          (PROBE.subprocess, 'Popen', Mock(side_effect=spawn)),
          (PROBE.socket, 'socket', Mock()), (PROBE, 'wait_ready', Mock()),
          (PROBE.signal, 'signal', Mock()),
          (PROBE.os, 'killpg', Mock(side_effect=killpg)),
          (PROBE.time, 'sleep', Mock()), (PROBE, 'check', Mock(side_effect=check)),
          (PROBE, 'request', Mock(side_effect=request)),
          (PROBE, 'verify_body', Mock(return_value={'status': 'pass'}))):
        stack.enter_context(patch.object(owner, attr, value))
      stack.enter_context(patch.dict(PROBE.os.environ, {'HTTPS_PROXY': 'test-proxy-not-logged',
        'UNRELATED_SECRET': 'not-inherited', 'GOMAXPROCS': '99'}))
      stack.enter_context(contextlib.redirect_stdout(io.StringIO()))
      if mode == 'focused-production' and build_outcome != 0:
        with self.assertRaises((RuntimeError, TimeoutError)):
          PROBE.run(output, output, mode)
      elif audit_failure:
        with self.assertRaisesRegex(RuntimeError, 'fixture audit failed'):
          PROBE.run(output, output, mode, 'synthetic-build', **contract)
      elif late_source_exit:
        with self.assertRaisesRegex(RuntimeError, 'during cleanup'):
          PROBE.run(output, output, mode, 'synthetic-build', **contract)
      elif source_exits:
        with self.assertRaisesRegex(RuntimeError, 'fixture exited'):
          PROBE.run(output, output, mode, 'synthetic-build', **contract)
      elif wrong_event:
        with self.assertRaisesRegex(AssertionError, 'event state mismatch'):
          PROBE.run(output, output, mode, 'synthetic-build', **contract)
      else:
        PROBE.run(output, output, mode, 'synthetic-build' if mode == 'existing-production' else None, **contract)
        self.assertEqual(events, ['e1', 'e2', 'e3', 'e4'])
      record = json.loads((output / 'continuity-result.json').read_text())
      self.assertEqual(PROBE.processes, [])
      self.assertIsNone(PROBE.ROOT)
      self.assertNotIn('test-proxy-not-logged', json.dumps(record))
      self.assertIn('cleanup_returncodes', record)
      return record, spawned

  def test_mock_production_build_start_same_source_and_env(self):
    record, spawned = self.exercise_run('focused-production')
    self.assertEqual(len(spawned), 3)
    self.assertIn('--source', spawned[0][0])
    self.assertEqual(spawned[1][0][2:], ['build',
      '--debug-build-paths=app/blogs/**/page.tsx,app/sitemap*/**/route.ts'])
    self.assertEqual(spawned[1][2].wait.call_args_list[0].kwargs, {'timeout': 600})
    self.assertIn('start', spawned[2][0])
    for _, kwargs, _ in spawned:
      self.assertEqual(kwargs['env']['GOMAXPROCS'], '2')
      self.assertEqual(kwargs['env']['GOMEMLIMIT'], '1024MiB')
      self.assertEqual(kwargs['env']['HTTPS_PROXY'], 'test-proxy-not-logged')
      self.assertNotIn('UNRELATED_SECRET', kwargs['env'])
      self.assertTrue(kwargs['start_new_session'])
    self.assertEqual(record['status'], 'passed_focused_production_HTTP_consumers_only')
    self.assertEqual([row['state'] for row in record['results']], ['S0', 'S1a', 'S1b', 'S1', 'S2'])

  def test_existing_artifact_runs_one_catalog_source_and_start_without_build(self):
    record, spawned = self.exercise_run('existing-production')
    self.assertEqual(len(spawned), 2)
    self.assertTrue(spawned[0][0][1].endswith('p23_catalog_fixture.py'))
    self.assertEqual(spawned[0][0][2:], ['--mode', 'empty-products-and-collections'])
    self.assertEqual(spawned[1][0][2:], ['start', '--hostname', '127.0.0.1', '--port', '3086'])
    self.assertFalse(any('build' in command or '--source' in command for command, _, _ in spawned))
    self.assertEqual([row['state'] for row in record['results']], ['S0', 'S1a', 'S1b', 'S1', 'S2'])
    self.assertNotIn('build', record)
    self.assertFalse(record['existing_artifact']['build_performed'])
    self.assertEqual(record['status'], 'passed_existing_artifact_HTTP_consumers_only')

  def test_existing_optional_contract_flags_forward_independently_without_build(self):
    for fifth, sixth in ((False, False), (True, False), (False, True), (True, True)):
      with self.subTest(fifth=fifth, sixth=sixth):
        record, spawned = self.exercise_run('existing-production',
          enable_collection_products=fifth, enable_placeholder_get_collection=sixth)
        self.assertEqual(len(spawned), 2)
        self.assertEqual(spawned[0][0].count('--enable-collection-products'), int(fifth))
        self.assertEqual(spawned[0][0].count('--enable-placeholder-get-collection'), int(sixth))
        self.assertEqual(spawned[1][0][2], 'start')
        self.assertFalse(any('build' in command for command, _, _ in spawned))
        self.assertNotIn('build', record)
        self.assertEqual(record['catalog_contract'], {
          'mode': 'empty-products-and-collections', 'enable_collection_products': fifth,
          'enable_placeholder_get_collection': sixth,
          'scope': 'explicit runtime inputs only; correspondence to existing build inputs unverified'})
        self.assertEqual(record['status'], 'passed_existing_artifact_HTTP_consumers_only')

  def test_contract_flags_invalid_mode_and_non_boolean_fail_before_spawning(self):
    with patch.object(PROBE, 'validate_app') as validate, \
        patch.object(PROBE.subprocess, 'run') as node, patch.object(PROBE.subprocess, 'Popen') as spawn:
      for flag in ('enable_collection_products', 'enable_placeholder_get_collection'):
        for mode in ('dev', 'focused-production'):
          with self.assertRaisesRegex(ValueError, 'only valid'):
            PROBE.run(Path('unused'), Path('unused'), mode, **{flag: True})
        for bad in (None, 0, 1, 'true', [], {}):
          with self.assertRaisesRegex(ValueError, 'boolean'):
            PROBE.run(Path('unused'), Path('unused'), 'existing-production', 'synthetic-build', **{flag: bad})
      validate.assert_not_called()
      node.assert_not_called()
      spawn.assert_not_called()

  def test_existing_cli_explicit_contract_and_default_flags(self):
    base = ['--app', 'app', '--output', 'out', '--mode', 'existing-production', '--build-id', 'synthetic-build']
    for fifth, sixth in ((False, False), (True, False), (False, True), (True, True)):
      flags = (['--enable-collection-products'] if fifth else []) + (['--enable-placeholder-get-collection'] if sixth else [])
      with patch.object(PROBE, 'run') as run:
        PROBE.main(base + flags)
        self.assertEqual(run.call_args.kwargs, {'enable_collection_products': fifth,
          'enable_placeholder_get_collection': sixth})
    with patch.object(PROBE, 'run') as run:
      for flag in ('--enable-collection-products', '--enable-placeholder-get-collection'):
        for args in (['--source'], ['--app', 'app', '--output', 'out'],
            ['--app', 'app', '--output', 'out', '--mode', 'focused-production']):
          with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
            PROBE.main(args + [flag])
      run.assert_not_called()

  def test_existing_late_fixture_fatal_exit_cannot_be_cleaned_into_pass(self):
    record, _ = self.exercise_run('existing-production', late_source_exit=True)
    self.assertEqual(record['status'], 'incomplete')
    self.assertEqual(record['cleanup_returncodes'], [2, -PROBE.signal.SIGTERM])
    self.assertTrue(all(row['status'] == 'group_absent' for row in record['cleanup_groups']))
    self.assertEqual(len(record['results']), 5)
    self.assertIn('fixture_failure', record)

  def test_existing_forced_kill_is_not_normal_fixture_completion(self):
    cleanup = [{'pgid': 1000 + index, 'term_sent': True, 'kill_sent': index == 0,
      'leader_returncode': -PROBE.signal.SIGKILL if index == 0 else -PROBE.signal.SIGTERM,
      'group_exists_at_end': False, 'status': 'group_absent'} for index in range(2)]
    with patch.object(PROBE, 'cleanup_owned', return_value=cleanup):
      record, _ = self.exercise_run('existing-production', late_source_exit=True)
    self.assertEqual(record['status'], 'incomplete')
    self.assertIn('fixture_failure', record)

  def test_existing_fixture_exit_invalidates_cached_consumer_success(self):
    record, spawned = self.exercise_run('existing-production', source_exits=True,
      enable_collection_products=True, enable_placeholder_get_collection=True)
    self.assertEqual(record['status'], 'incomplete')
    self.assertEqual(record['failure_type'], 'RuntimeError')
    self.assertEqual([row['state'] for row in record['results']], ['S0'])
    self.assertEqual(record['cleanup_returncodes'][0], 2)

  def test_existing_wrong_event_state_stops_chain_and_cleans_up(self):
    record, spawned = self.exercise_run('existing-production', wrong_event=True)
    self.assertEqual(len(spawned), 2)
    self.assertEqual(record['status'], 'incomplete')
    self.assertEqual(record['failure_type'], 'AssertionError')
    self.assertEqual([row['state'] for row in record['results']], ['S0'])
    self.assertEqual(len(record['cleanup_groups']), 2)

  def test_existing_artifact_validation_and_pre_spawn_rejections(self):
    with tempfile.TemporaryDirectory() as tmp:
      app = Path(tmp) / 'app'
      server = app / '.next/server'
      server.mkdir(parents=True)
      identity = app / '.next/BUILD_ID'
      manifest = server / 'app-paths-manifest.json'
      route = server / 'app/page.js'
      route.parent.mkdir()
      route.write_text('// synthetic artifact, never executed')
      identity.write_text('synthetic-build\n')
      manifest.write_text(json.dumps({'/page': 'app/page.js'}))
      result = PROBE.validate_existing(app, 'synthetic-build')
      self.assertIn('unverified', result['provenance'])
      self.assertFalse(result['build_performed'])
      with patch.object(PROBE.subprocess, 'Popen') as spawn, \
          patch.object(PROBE.subprocess, 'run') as node:
        for build_id in (None, '', ' ', 'wrong', ' synthetic-build'):
          with self.subTest(build_id=build_id), self.assertRaises(ValueError):
            PROBE.run(app, Path(tmp), 'existing-production', build_id,
              enable_collection_products=True, enable_placeholder_get_collection=True)
        identity.unlink()
        with self.assertRaises(FileNotFoundError):
          PROBE.run(app, Path(tmp), 'existing-production', 'synthetic-build')
        identity.write_text('synthetic-build')
        for bad in ({}, [], {'/page': '../outside.js'}, {'/page': 'missing.js'}, {'/page': None}):
          manifest.write_text(json.dumps(bad))
          with self.subTest(manifest=bad), self.assertRaises(ValueError):
            PROBE.run(app, Path(tmp), 'existing-production', 'synthetic-build')
        manifest.write_text('{')
        with self.assertRaises(ValueError):
          PROBE.run(app, Path(tmp), 'existing-production', 'synthetic-build')
        manifest.unlink()
        with self.assertRaises(FileNotFoundError):
          PROBE.run(app, Path(tmp), 'existing-production', 'synthetic-build')
        spawn.assert_not_called()
        node.assert_not_called()

  def test_existing_artifact_symlinks_outside_copy_are_rejected_before_read(self):
    with tempfile.TemporaryDirectory() as tmp:
      app = Path(tmp) / 'app'
      build = app / '.next'
      build.mkdir(parents=True)
      outside = Path(tmp) / 'outside'
      outside.write_text('synthetic-build')
      identity = build / 'BUILD_ID'
      identity.symlink_to(outside)
      with patch.object(Path, 'read_text', side_effect=AssertionError('must not read')):
        with self.assertRaisesRegex(ValueError, 'inside'):
          PROBE.validate_existing(app, 'synthetic-build')
      identity.unlink()
      identity.write_text('synthetic-build')
      server = build / 'server'
      server.mkdir()
      (server / 'app-paths-manifest.json').write_text(json.dumps({'/page': 'route.js'}))
      (server / 'route.js').symlink_to(outside)
      with self.assertRaisesRegex(ValueError, 'unsafe'):
        PROBE.validate_existing(app, 'synthetic-build')

  def test_existing_external_server_with_manifest_link_back_is_rejected_before_read(self):
    with tempfile.TemporaryDirectory() as tmp:
      app = Path(tmp) / 'app'
      build = app / '.next'
      build.mkdir(parents=True)
      outside = Path(tmp) / 'outside'
      outside.mkdir()
      (build / 'BUILD_ID').write_text('synthetic-build')
      manifest = app / 'manifest.json'
      manifest.write_text(json.dumps({'/page': 'route.js'}))
      (outside / 'app-paths-manifest.json').symlink_to(manifest)
      (outside / 'route.js').write_text('// must not accept external code')
      (build / 'server').symlink_to(outside, target_is_directory=True)
      with patch.object(Path, 'read_text', side_effect=AssertionError('must not read')):
        with self.assertRaisesRegex(ValueError, 'inside'):
          PROBE.validate_existing(app, 'synthetic-build')

  def test_existing_audit_rejects_swallowed_errors_missing_and_corrupt_logs(self):
    with tempfile.TemporaryDirectory() as tmp:
      path = Path(tmp) / 'audit.log'
      rows = []
      router = Router(mode=CATALOG_MODE, audit_sink=rows.append)
      router.handle('/request', {'operation': 'searchFacets', 'variables': {'query': '*'}})
      for event in ('e1', 'e2', 'e3', 'e4'):
        router.handle('/event', {'event': event})
      def write(items):
        path.write_text('\n'.join(json.dumps(item) for item in items), encoding='utf-8')
      write(rows)
      self.assertEqual(PROBE.validate_fixture_audit(path)['events'], ['e1', 'e2', 'e3', 'e4'])
      for bad in ([], rows[:-1], rows[1:], [rows[0], rows[2], rows[1], *rows[3:]]):
        write(bad)
        with self.assertRaises(ValueError):
          PROBE.validate_fixture_audit(path)
      with self.assertRaises(ValueError):
        router.handle('/request', {'operation': 'unknown-operation'})
      write(rows)
      with self.assertRaises(ValueError):
        PROBE.validate_fixture_audit(path)
      for bad in ('broken', '{}', '[]', 'null', '127.0.0.1 - - [date] "POST /request HTTP/1.1" 400 -'):
        write(rows[:-1])
        with path.open('a') as stream:
          stream.write('\n' + bad)
        with self.assertRaises(ValueError):
          PROBE.validate_fixture_audit(path)
      path.unlink()
      with self.assertRaises(FileNotFoundError):
        PROBE.validate_fixture_audit(path)

  def test_existing_swallowed_router_rejection_never_publishes_passed(self):
    original = Router.handle
    def rejected(router, endpoint, payload, **kwargs):
      if endpoint == '/event' and payload['event'] == 'e4':
        try:
          original(router, '/request', {'operation': 'unknown-operation'})
        except ValueError:
          pass  # Simulate an application swallowing the source HTTP 400.
      return original(router, endpoint, payload, **kwargs)
    with patch.object(Router, 'handle', rejected):
      record, _ = self.exercise_run('existing-production', audit_failure=True,
        enable_collection_products=True, enable_placeholder_get_collection=True)
    self.assertEqual(record['status'], 'incomplete')
    self.assertEqual(record['fixture_audit']['status'], 'failed')
    self.assertEqual(len(record['results']), 5)

  def test_existing_audit_io_error_receipt_does_not_copy_exception_text(self):
    marker = 'private-path-or-invalid-byte-marker'
    for error in (OSError(marker), UnicodeError(marker)):
      with patch.object(PROBE, 'validate_fixture_audit', side_effect=error):
        record, _ = self.exercise_run('existing-production', audit_failure=True)
      self.assertNotIn(marker, json.dumps(record))
      self.assertEqual(record['fixture_audit']['error_type'], type(error).__name__)

  def test_existing_cli_requires_identity_and_rejects_unrelated_modes(self):
    with patch.object(PROBE, 'run') as run:
      PROBE.main(['--app', 'app', '--output', 'out', '--mode', 'existing-production',
        '--build-id', 'synthetic-build'])
      self.assertEqual(run.call_args.args[-2:], ('existing-production', 'synthetic-build'))
      for args in (['--app', 'app', '--output', 'out', '--mode', 'existing-production'],
                   ['--app', 'app', '--output', 'out', '--build-id', 'synthetic-build'],
                   ['--source', '--build-id', 'synthetic-build']):
        with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
          PROBE.main(args)

  def test_mock_build_nonzero_and_timeout_never_start(self):
    for outcome in (1, 'timeout'):
      record, spawned = self.exercise_run('focused-production', outcome)
      self.assertEqual(len(spawned), 2)
      self.assertFalse(any('start' in command for command, _, _ in spawned))
      self.assertEqual(record['status'], 'incomplete')
      self.assertEqual(record['build']['status'], 'timeout' if outcome == 'timeout' else 'failed')
      self.assertEqual(record['results'], [])

  def test_mock_dev_has_no_build(self):
    record, spawned = self.exercise_run('dev')
    self.assertEqual(len(spawned), 2)
    self.assertIn('dev', spawned[1][0])
    self.assertNotIn('build', record)
    self.assertEqual(record['status'], 'passed_development_HTTP_consumers_only')

  def test_occupied_port_closes_reservation_without_starting(self):
    reservation = Mock()
    reservation.bind.side_effect = OSError('occupied')
    with tempfile.TemporaryDirectory() as tmp, patch.object(PROBE, 'validate_app'), \
        patch.object(PROBE.subprocess, 'run', return_value=Mock(stdout='v24.19.0')), \
        patch.object(PROBE.socket, 'socket', return_value=reservation), \
        patch.object(PROBE.subprocess, 'Popen') as spawn:
      with self.assertRaises(OSError):
        PROBE.run(Path(tmp), Path(tmp), 'focused-production')
      spawn.assert_not_called()
      reservation.close.assert_called_once()

  def test_readiness_exit_and_timeout(self):
    dead = Mock()
    dead.poll.return_value = 1
    with self.assertRaisesRegex(RuntimeError, 'exited'):
      PROBE.wait_ready([dead], (8766,))
    live = Mock()
    live.poll.return_value = None
    with patch.object(PROBE.socket, 'create_connection', side_effect=OSError()), \
        patch.object(PROBE.time, 'monotonic', side_effect=[0, 91]), \
        self.assertRaisesRegex(TimeoutError, '90 seconds'):
      PROBE.wait_ready([live], (8766,))

  def test_xml_rejects_duplicate_fields_roots_namespaces_and_structure(self):
    routes, _ = synthetic_http('S0')
    for route, kind, entry in (('/sitemap.xml', 'sitemapindex', 'sitemap'),
                              ('/sitemap/articles-1.xml', 'urlset', 'url')):
      good = routes[route]
      self.assertTrue(PROBE.xml_items(good, kind))
      bad_xml = [good.replace(kind, 'not-a-sitemap'),
        good.replace('http://www.sitemaps.org/schemas/sitemap/0.9', 'urn:wrong'),
        good.replace(' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"', ''),
        good.replace('<' + entry + '>', '<wrong>').replace('</' + entry + '>', '</wrong>'),
        good.replace('<loc>', '<loc xmlns="urn:wrong">'),
        good.replace('<loc>', '<loc extra="1">'),
        good.replace('<loc>', '<extra/> <loc>'),
        good.replace('<loc>', '<loc><nested/></loc><loc>'),
        good.replace('<loc>', '<loc>wrong</loc><loc>'),
        good.replace('<loc>', '<loc>https://shop.example.test/sitemap/static.xml</loc><loc>'),
        good.replace('</loc>', '</loc>unexpected'),
        good.replace('<' + entry + '>', '<' + entry + ' extra="1">')]
      if kind == 'urlset':
        bad_xml += [good.replace('<lastmod>', '<lastmod>wrong</lastmod><lastmod>'),
          good.replace('<lastmod>', '<lastmod>2026-01-01T00:01:00Z</lastmod><lastmod>')]
      for bad in bad_xml:
        with self.subTest(kind=kind, bad=bad[:100]), self.assertRaises(AssertionError):
          PROBE.xml_items(bad, kind)

  def test_cleanup_kills_surviving_group_after_leader_exit(self):
    leader = Mock(pid=12345)
    leader.poll.return_value = 0
    alive = True
    def killpg(pgid, sig):
      nonlocal alive
      self.assertEqual(pgid, leader.pid)
      if not alive:
        raise ProcessLookupError()
      if sig == PROBE.signal.SIGKILL:
        alive = False
    with patch.object(PROBE.os, 'killpg', side_effect=killpg) as signals, \
        patch.object(PROBE.time, 'monotonic', side_effect=range(0, 200, 11)), \
        patch.object(PROBE.time, 'sleep'):
      result = PROBE.cleanup_owned([leader])
    self.assertTrue(result[0]['kill_sent'])
    self.assertEqual(result[0]['leader_returncode'], 0)
    self.assertEqual(result[0]['status'], 'group_absent')
    self.assertIn((12345, PROBE.signal.SIGKILL), [call.args for call in signals.call_args_list])

  def test_cleanup_does_not_claim_success_for_remaining_group(self):
    leader = Mock(pid=12345)
    leader.poll.return_value = 0
    with patch.object(PROBE.os, 'killpg'), \
        patch.object(PROBE.time, 'monotonic', side_effect=range(0, 200, 11)), \
        patch.object(PROBE.time, 'sleep'):
      result = PROBE.cleanup_owned([leader])
    self.assertTrue(result[0]['kill_sent'])
    self.assertTrue(result[0]['group_exists_at_end'])
    self.assertEqual(result[0]['status'], 'unconfirmed')

  def test_cleanup_real_orphan_ignores_term_after_leader_exit(self):
    # 仅标准库临时进程，不运行应用；锁释放证明child已死亡（zombie不算运行）。
    script = """import fcntl, os, signal, sys, time
if os.fork() == 0:
  signal.signal(signal.SIGTERM, signal.SIG_IGN)
  with open(sys.argv[1], 'w') as lock:
    fcntl.flock(lock, fcntl.LOCK_EX)
    lock.write('ready')
    lock.flush()
    while True:
      time.sleep(1)
os._exit(0)
"""
    with tempfile.TemporaryDirectory() as tmp:
      lockpath = Path(tmp) / 'child-lock'
      leader = subprocess.Popen([sys.executable, '-c', script, str(lockpath)],
        start_new_session=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
      try:
        leader.wait(timeout=5)
        deadline = time.monotonic() + 5
        while not lockpath.exists() or lockpath.read_text() != 'ready':
          if time.monotonic() >= deadline:
            self.fail('owned test child did not become ready')
          time.sleep(0.01)
        with lockpath.open() as lock:
          with self.assertRaises(BlockingIOError):
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
          result = PROBE.cleanup_owned([leader], term_grace=0.1, kill_grace=0.5)
          self.assertTrue(result[0]['kill_sent'])
          self.assertEqual(result[0]['leader_returncode'], 0)
          fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
          self.assertEqual(result[0]['status'],
            'unconfirmed' if result[0]['group_exists_at_end'] else 'group_absent')
      finally:
        try:
          os.killpg(leader.pid, signal.SIGKILL)
        except ProcessLookupError:
          pass
        leader.wait(timeout=5)

  def test_cleanup_permission_error_is_unknown_not_clean(self):
    leader = Mock(pid=12345)
    leader.poll.return_value = 0
    with patch.object(PROBE.os, 'killpg', side_effect=PermissionError()), \
        patch.object(PROBE.time, 'monotonic', side_effect=range(0, 200, 11)):
      result = PROBE.cleanup_owned([leader])
    self.assertEqual(result[0]['status'], 'unconfirmed')
    self.assertIsNone(result[0]['group_exists_at_end'])
    self.assertEqual(result[0]['probe_error'], 'PermissionError')

  def test_import_has_no_server_side_effects(self):
    self.assertEqual(PROBE.processes, [])
    self.assertIsNone(PROBE.ROOT)


if __name__ == '__main__':
  unittest.main()
