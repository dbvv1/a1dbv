"""P23 dev / focused-production 探针的可移植包装；不安装依赖。

python scripts/research/p23_runtime_probe.py --app APP --output EMPTY_OUTPUT
APP 必须先按研究记录从固定公开 tar + patch 准备。仅绑定 loopback。
默认 dev；--mode focused-production 仅构建博客／sitemap，不代表全站通过。
新包装仅离线验证，并非历史生产 driver 原字节；历史结果另有回执。
"""
import argparse
import datetime
import hashlib
import json
import os
import signal
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from p23_source_fixture import Scenario, long_body

ROOT = None
processes = []
CURRENT_STATE = None

class DOM(HTMLParser):
  def __init__(self, text):
    super().__init__();self.tags=[];self.text=[];self.skip=0;self.feed(text)
  def handle_starttag(self,t,a):
    self.tags.append((t,dict(a)))
    if t in ('script','style'):self.skip+=1
  def handle_endtag(self,t):
    if t in ('script','style'):self.skip-=1
  def handle_data(self,t):
    if not self.skip:self.text.append(t)
def own_resources():
  rows=[]
  for p in globals().get('processes',[]):
    try:
      status=Path(f'/proc/{p.pid}/status').read_text()
      rows.append({'pid':p.pid,'rss_kb':next((x.split()[1] for x in status.splitlines() if x.startswith('VmRSS:')),None),'returncode':p.poll()})
      children=Path(f'/proc/{p.pid}/task/{p.pid}/children').read_text().split()
      for child in children:
        cs=Path(f'/proc/{child}/status').read_text()
        rows.append({'pid':int(child),'parent':p.pid,'rss_kb':next((x.split()[1] for x in cs.splitlines() if x.startswith('VmRSS:')),None)})
    except (FileNotFoundError,ProcessLookupError):rows.append({'pid':p.pid,'returncode':p.poll()})
  return rows
def request(path, payload=None, rsc=False):
  base='http://127.0.0.1:8766' if payload is not None else 'http://127.0.0.1:3086'
  headers={'Content-Type':'application/json'} if payload is not None else ({'RSC':'1'} if rsc else {})
  req=urllib.request.Request(base+path,data=json.dumps(payload).encode() if payload is not None else None,headers=headers)
  started=time.monotonic();signal.alarm(90)
  try:
    try:r=urllib.request.urlopen(req,timeout=90)
    except urllib.error.HTTPError as e:r=e
    body=r.read().decode()
    mime=r.headers.get('Content-Type','')
    print(json.dumps({'request':path,'rsc_header':rsc,'status':r.status,'mime':mime,'elapsed_seconds':round(time.monotonic()-started,3),'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'own_processes':own_resources()}),flush=True)
    if ROOT is not None and (path.startswith('/sitemap') or path.endswith('/retired-guide')):
      folder = ROOT / 'responses'
      folder.mkdir(exist_ok=True)
      name = path.strip('/').replace('/', '_')
      target = folder / f'{CURRENT_STATE}-{len(list(folder.iterdir())):04d}-{name}.txt'
      target.write_text(body, encoding='utf-8')
    if rsc:assert 'text/x-component' in mime,('RSC MIME',mime)
    return r.status,body
  finally:signal.alarm(0)
def xml_items(text, kind='urlset'):
  """仅接受本实验预注册的 sitemap XML 子集，不能覆盖重复字段。"""
  namespace = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
  entry, fields = {'sitemapindex': ('sitemap', {'loc'}),
                   'urlset': ('url', {'loc', 'lastmod'})}[kind]
  try:
    root = ET.fromstring(text)
  except ET.ParseError as exc:
    raise AssertionError('invalid sitemap XML') from exc
  assert root.tag == namespace + kind, 'wrong sitemap root or namespace'
  assert not root.attrib and not (root.text or '').strip(), 'extra root structure'
  rows = []
  for node in root:
    assert node.tag == namespace + entry, 'wrong sitemap entry or namespace'
    assert not node.attrib and not (node.text or '').strip(), 'extra entry structure'
    assert not (node.tail or '').strip(), 'extra entry text'
    row = {}
    for field in node:
      assert field.tag in {namespace + name for name in fields}, 'unknown sitemap field or namespace'
      name = field.tag[len(namespace):]
      assert name not in row, 'duplicate sitemap field'
      assert not field.attrib and len(field) == 0, 'extra field structure'
      assert not (field.tail or '').strip(), 'extra field text'
      assert field.text and field.text.strip(), 'empty sitemap field'
      row[name] = field.text
    assert row.keys() == fields, 'missing sitemap field'
    rows.append(row)
  return rows
def expected_sitemaps(state):
  """预注册字面 oracle：不读取实际响应、不调用 Scenario 或应用转换。"""
  tails = {
    'S0': ['care-guide', 'retired-guide'],
    'S1a': ['retired-guide', 'care-guide'],
    'S1b': ['retired-guide', 'care-guide', 'size-guide'],
    'S1': ['care-guide', 'size-guide'],
    'S2': ['size-guide', 'care-guide'],
  }[state]
  # 固定源 archive-001…248：1月1日00:01…04:08，publishedAt不随编辑变。
  articles = [{'loc': f'https://shop.example.test/blogs/guides/archive-{i:03}',
    'lastmod': f'2026-01-01T{i // 60:02}:{i % 60:02}:00Z'} for i in range(1, 249)]
  published = {'care-guide': '2026-01-02T00:00:00Z',
    'retired-guide': '2026-01-03T00:00:00Z', 'size-guide': '2026-10-20T10:01:00Z'}
  articles += [{'loc': 'https://shop.example.test/blogs/guides/' + handle,
    'lastmod': published[handle]} for handle in tails]
  return {'articles-1': articles[:250], 'articles-2': articles[250:],
    'blogs-1': [{'loc': 'https://shop.example.test/blogs/guides',
                 'lastmod': '2026-01-01T00:00:00Z'}]}


def check(state):
  def ok(path, rsc=False):
    status, body = request(path, rsc=rsc)
    assert status == 200, (state, path, status)
    return status, body
  version={'S0':'v1','S1a':'v2','S1b':'v2','S1':'v2','S2':'v3'}[state]
  status,a=ok('/blogs/guides/care-guide'); assert status==200,(state,status)
  d=DOM(a);visible=''.join(d.text); assert 'Care guide '+version in visible,(state,'title')
  assert any(t=='time' and x.get('datetime')=='2026-01-02T00:00:00Z' for t,x in d.tags)
  assert any(t=='meta' and x.get('name')=='description' and x.get('content')=={'v1':'Care guide v1 summary','v2':'Wash cold and air dry.','v3':'A detailed care guide. Wash cold and air dry.'}[version] for t,x in d.tags),(state,'metadata')
  _,listing=ok('/blogs/guides');ld=DOM(listing);lt=''.join(ld.text)
  assert 'Care guide '+version in lt
  assert sum(t=='h2' for t,x in ld.tags)==50,(state,'list length')
  if state!='S0':assert ('Cold wash and air dry.' if state!='S2' else 'Long-form care guide; cold wash, air dry.') in lt
  _,index=ok('/sitemap.xml'); ids=[x['loc'] for x in xml_items(index, 'sitemapindex')]
  expected_ids = ['static', 'blogs-1', 'articles-1'] + (['articles-2'] if state == 'S1b' else [])
  expected_locs = {'https://shop.example.test/sitemap/' + key + '.xml' for key in expected_ids}
  assert len(ids) == len(set(ids)) and set(ids) == expected_locs, (state, ids)
  expected = expected_sitemaps(state)
  pages = {}
  for key, wanted in expected.items():
    _, body = ok('/sitemap/' + key + '.xml')
    pages[key] = xml_items(body)
    assert pages[key] == wanted, (state, key, 'full ordered loc/lastmod mismatch')
    locs = [item['loc'] for item in pages[key]]
    assert len(locs) == len(set(locs)), (state, key, 'duplicate loc')
  items, two = pages['articles-1'], pages['articles-2']
  cs,c=request('/blogs/guides/retired-guide');cd=DOM(c)
  assert cs in ((200, 404) if state in ('S1','S2') else (200,)), (state, 'retired status', cs)
  if state in ('S1','S2'):
    assert 'Retired guide' not in ''.join(cd.text)
    assert any(t=='meta' and x.get('name')=='robots' and 'noindex' in x.get('content','') for t,x in cd.tags)
    assert 'Retired guide' not in lt
  else:assert 'Retired guide' in ''.join(cd.text)
  if state in ('S1b','S1','S2'):
    _,b=ok('/blogs/guides/size-guide');bd=DOM(b);assert any(t=='h2' and x.get('id')=='measure' for t,x in bd.tags);assert 'Size guide' in lt
  _,rsc=ok('/blogs/guides/care-guide',rsc=True);assert 'Care guide '+version in rsc
  if state=='S2':
    assert sum(t=='p' and 'data-section' in x for t,x in d.tags)==8192
    assert sum(t=='a' and x.get('href')=='/blogs/guides/size-guide#measure' for t,x in d.tags)==8192
    assert '完整结束。END-08192' in visible and 'Café naïve — 日本語と絵文字 🧵🧼' in visible
    assert 'END-08192' in rsc
  (ROOT/f'{state}-article.html').write_text(a, encoding='utf-8')
  return {'state':state,'article_status':status,'retired_status':cs,'list_count':50,'sitemap_count':len(items),'page2_count':len(two),'rsc_bytes':len(rsc.encode()),'long_body_sections':8192 if state=='S2' else None}
def request_timeout(signum,frame):
  raise TimeoutError('90-second total request deadline exceeded')

class BodyTokens(HTMLParser):
  def __init__(self,text):
    super().__init__(convert_charrefs=True);self.active=False;self.done=False;self.tokens=[];self.depth=0;self.feed(text)
  def handle_starttag(self,t,a):
    if not self.active and not self.done and t=='h2' and dict(a).get('id')=='care':self.active=True
    if self.active:self.tokens.append(['start',t,sorted(a)])
  def handle_endtag(self,t):
    if self.active:
      self.tokens.append(['end',t])
      if t=='p' and any(x==['text','完整结束。END-08192'] for x in self.tokens[-3:]):self.active=False;self.done=True
  def handle_data(self,d):
    if self.active:self.tokens.append(['text',d])

def dispatch(source, path, payload):
  """同一 Scenario 的纯分派；未知操作无真实商店回退。"""
  if not isinstance(payload, dict):
    raise ValueError("payload must be an object")
  if path == '/event':
    return {'state': source.apply(payload['event'])}
  if path != '/request':
    raise ValueError('unknown endpoint')
  op = payload['operation']
  variables = payload.get('variables', {})
  if payload.get('locale') not in (None, {'country': 'US', 'language': 'EN'},
      {'country': 'US', 'language': 'EN', 'locale': 'en-US'}):
    raise ValueError('unsupported locale')
  if op == 'getShopPolicies':
    if variables:
      raise ValueError('policies accepts no variables')
    result = {'data': {'shop': {key: None for key in (
      'contactInformation', 'legalNotice', 'privacyPolicy', 'refundPolicy',
      'shippingPolicy', 'termsOfSale', 'termsOfService')}}}
  else:
    result = source.respond(op, variables)
  print(json.dumps({'state': source.state, 'operation': op,
                   'variables': variables}), flush=True)
  return result


def serve_source():
  source = Scenario()
  class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
      try:
        payload = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        result = dispatch(source, self.path, payload)
        code = 200
      except (KeyError, TypeError, ValueError) as exc:
        result, code = {'error': str(exc)}, 400
      body = json.dumps(result, ensure_ascii=False).encode()
      self.send_response(code)
      self.send_header('Content-Type', 'application/json')
      self.send_header('Content-Length', str(len(body)))
      self.end_headers()
      self.wfile.write(body)
  HTTPServer(('127.0.0.1', 8766), Handler).serve_forever()


def verify_body(html):
  expected = long_body()
  a, b = BodyTokens(expected), BodyTokens(html)
  assert a.done and b.done, 'missing body boundary'
  assert a.tokens == b.tokens, 'Normalized long-body tokens differ'
  return {'status': 'pass', 'scope': 'saved HTML tokens, not browser DOM',
    'token_count': len(a.tokens), 'source_utf8_bytes': len(expected.encode()),
    'source_sha256': hashlib.sha256(expected.encode()).hexdigest(),
    'normalized_sha256': hashlib.sha256(json.dumps(a.tokens, ensure_ascii=False,
      separators=(',', ':')).encode()).hexdigest()}


def validate_app(app):
  manifest = json.loads((app / 'package.json').read_text())
  if manifest['dependencies'].get('next') != '16.4.1':
    raise ValueError('prepared Next 16.4.1 baseline required; recheck security before running')
  if 'devEngines' in manifest:
    raise ValueError('unexpected runtime auto-download configuration')
  for name in ('node_modules/next/dist/bin/next', 'pnpm-lock.yaml'):
    if not (app / name).is_file():
      raise ValueError('missing prepared application dependency or lock')
  installed = json.loads((app / 'node_modules/next/package.json').read_text())
  if installed.get('version') != '16.4.1':
    raise ValueError('installed Next differs from prepared 16.4.1 baseline')
  seam = (app / 'lib/shopify/storefront/server.ts').read_text()
  if 'http://127.0.0.1:8766/request' not in seam:
    raise ValueError('loopback fixture patch is missing')


def wait_ready(servers, ports):
  deadline = time.monotonic() + 90
  while True:
    if any(p.poll() is not None for p in servers):
      raise RuntimeError('Owned server exited before readiness')
    try:
      for port in ports:
        with socket.create_connection(('127.0.0.1', port), timeout=1):
          pass
      return
    except OSError:
      if time.monotonic() > deadline:
        raise TimeoutError('Server not ready within 90 seconds')
      time.sleep(1)


def cleanup_owned(owned, term_grace=10, kill_grace=2):
  """只处理本次 start_new_session 创建的组；leader退出不等于组已退出。"""
  rows = [{'pgid': p.pid, 'term_sent': False, 'kill_sent': False} for p in owned]
  def exists(row):
    try:
      os.killpg(row['pgid'], 0)
      return True
    except ProcessLookupError:
      return False
    except OSError as exc:
      row['probe_error'] = type(exc).__name__
      return None
  def send(row, sig, key):
    try:
      os.killpg(row['pgid'], sig)
      row[key] = True
    except ProcessLookupError:
      pass
    except OSError as exc:
      row[key + '_error'] = type(exc).__name__
  for row in rows:
    send(row, signal.SIGTERM, 'term_sent')
  def wait_groups(seconds):
    deadline = time.monotonic() + seconds
    while True:
      for process in owned:
        process.poll()  # 回收自己的leader；不据此判定子进程组已清理。
      remaining = [row for row in rows if exists(row) is not False]
      if not remaining or time.monotonic() >= deadline:
        return remaining
      time.sleep(0.1)
  for row in wait_groups(term_grace):
    send(row, signal.SIGKILL, 'kill_sent')
  wait_groups(kill_grace)
  for process, row in zip(owned, rows):
    row['leader_returncode'] = process.poll()
    row['group_exists_at_end'] = exists(row)
    row['status'] = 'group_absent' if row['group_exists_at_end'] is False else 'unconfirmed'
  return rows


def run(app, output, mode='dev'):
  global ROOT, processes, CURRENT_STATE
  if mode not in ('dev', 'focused-production'):
    raise ValueError('unknown probe mode')
  validate_app(app)
  if not output.is_dir() or any(output.iterdir()):
    raise ValueError('output must be an existing empty directory; never overwrite prior attempts')
  version = subprocess.run(['node', '--version'], check=True, capture_output=True, text=True).stdout.strip()
  if not version.startswith('v24.'):
    raise ValueError('existing Node 24 required; no runtime is downloaded')
  # Refuse occupied ports before starting; do not send synthetic events to another service.
  reservations = []
  try:
    for port in (3086, 8766):
      reservation = socket.socket()
      reservations.append(reservation)
      reservation.bind(('127.0.0.1', port))
  finally:
    for reservation in reservations:
      reservation.close()
  ROOT = output
  processes = []
  results = []
  signal.signal(signal.SIGALRM, request_timeout)
  env = {**os.environ, 'NEXT_TELEMETRY_DISABLED': '1',
    'NEXT_PUBLIC_SHOPIFY_SHOP_ID': 'synthetic',
    'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN': 'synthetic-not-a-token',
    'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN': 'shop.example.test',
    'VERCEL_PROJECT_PRODUCTION_URL': 'shop.example.test', 'TZ': 'UTC'}
  if mode == 'focused-production':
    # 与历史生产启动器相同的代理／证书继承边界；仅原样继承，不打印其值。
    inherited = ('PATH', 'HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'NO_PROXY',
      'http_proxy', 'https_proxy', 'all_proxy', 'no_proxy', 'SSL_CERT_FILE',
      'SSL_CERT_DIR', 'NODE_EXTRA_CA_CERTS')
    env = {key: value for key, value in env.items() if key in inherited or
      key in ('NEXT_PUBLIC_SHOPIFY_SHOP_ID', 'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN',
        'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN', 'NEXT_TELEMETRY_DISABLED',
        'VERCEL_PROJECT_PRODUCTION_URL', 'TZ')}
    (ROOT / 'home').mkdir()
    env.update(HOME=str(ROOT / 'home'), CI='1', GOMAXPROCS='2', GOMEMLIMIT='1024MiB')
  logs = [open(ROOT / 'continuity-fixture.log', 'w', encoding='utf-8'),
          open(ROOT / 'continuity-next.log', 'w', encoding='utf-8')]
  record = {'kind': 'new portable-wrapper attempt from S0; not a historical driver replay',
            'mode': mode, 'status': 'running', 'results': results,
            'scope': 'direct HTTP/RSC consumers only; not full-site production or browser navigation'}
  def save():
    (ROOT / 'continuity-result.json').write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
  try:
    processes.append(subprocess.Popen([sys.executable, str(Path(__file__).resolve()),
      '--source'], stdout=logs[0], stderr=subprocess.STDOUT, env=env, start_new_session=True))
    save()
    wait_ready(processes, (8766,))
    source = processes[0]
    if mode == 'focused-production':
      command = ['node', 'node_modules/next/dist/bin/next', 'build',
        '--debug-build-paths=app/blogs/**/page.tsx,app/sitemap*/**/route.ts']
      # 原 build 保留完整项目 typecheck；不传跳过参数，不更改配置。
      started = time.monotonic()
      record['build'] = {'command': command, 'timeout_seconds': 600, 'status': 'running'}
      save()
      with open(ROOT / 'build.log', 'w', encoding='utf-8') as buildlog:
        build = subprocess.Popen(command, cwd=app, stdout=buildlog,
          stderr=subprocess.STDOUT, env=env, start_new_session=True)
        processes.append(build)
        try:
          code = build.wait(timeout=600)
        except subprocess.TimeoutExpired:
          record['build']['status'] = 'timeout'
          raise TimeoutError('Production build exceeded 600 seconds; start prohibited')
        finally:
          record['build']['elapsed_seconds'] = round(time.monotonic() - started, 3)
        record['build'].update(exit_code=code, status='passed' if code == 0 else 'failed')
        save()
        if code:
          raise RuntimeError('Production build failed; start prohibited; inspect build.log')
    processes.append(subprocess.Popen(['node', 'node_modules/next/dist/bin/next',
      'start' if mode == 'focused-production' else 'dev',
      '--hostname', '127.0.0.1', '--port', '3086'], cwd=app,
      stdout=logs[1], stderr=subprocess.STDOUT, env=env, start_new_session=True))
    wait_ready([source, processes[-1]], (3086, 8766))
    for state, event in [('S0', None), ('S1a', 'e1'), ('S1b', 'e2'), ('S1', 'e3'), ('S2', 'e4')]:
      CURRENT_STATE = state
      if event:
        status, response = request('/event', {'event': event})
        assert status == 200, response
        print(json.dumps({'applied': event, 'waiting_seconds': 62}), flush=True)
        time.sleep(62)
      deadline = time.monotonic() + 90
      while True:
        try:
          result = check(state)
          break
        except AssertionError as exc:
          if time.monotonic() > deadline:
            raise
          print(json.dumps({'state': state, 'converging': str(exc)}), flush=True)
          time.sleep(3)
      results.append(result)
      print(json.dumps(result), flush=True)
      save()
    record['rendered_body'] = verify_body((ROOT / 'S2-article.html').read_text(encoding='utf-8'))
    record['status'] = ('passed_focused_production_HTTP_consumers_only' if mode == 'focused-production'
      else 'passed_development_HTTP_consumers_only')
    save()
  except BaseException as exc:
    record['status'] = 'incomplete'
    record['failure_type'] = type(exc).__name__
    save()
    raise
  finally:
    cleanup = cleanup_owned(processes)
    record['cleanup_groups'] = cleanup
    record['cleanup_returncodes'] = [row['leader_returncode'] for row in cleanup]
    cleanup_failed = any(row['status'] != 'group_absent' for row in cleanup)
    if cleanup_failed:
      record['status'] = 'incomplete_cleanup'
    print(json.dumps({'cleanup_groups': cleanup}), flush=True)
    save()
    for log in logs:
      log.close()
    ROOT, CURRENT_STATE, processes = None, None, []
    if cleanup_failed and sys.exc_info()[0] is None:
      raise RuntimeError('Owned process group cleanup unconfirmed; inspect receipt')



def main(argv=None):
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--app', type=Path)
  parser.add_argument('--output', type=Path)
  parser.add_argument('--mode', choices=('dev', 'focused-production'), default='dev')
  parser.add_argument('--source', action='store_true', help=argparse.SUPPRESS)
  args = parser.parse_args(argv)
  if not __debug__:
    parser.error('Do not run assertion probes with Python -O')
  if args.source:
    if args.app or args.output or args.mode != 'dev':
      parser.error('--source cannot be combined with run arguments')
    serve_source()
    return 0
  if args.app is None or args.output is None:
    parser.error('--app and --output are required')
  try:
    run(args.app.resolve(), args.output.resolve(), args.mode)
  except (ValueError, FileNotFoundError, KeyError) as exc:
    parser.error(str(exc))
  return 0


if __name__ == '__main__':
  sys.exit(main())
