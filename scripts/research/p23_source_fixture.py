"""P23 合成 Storefront 输入，不运行应用、网络或 Next 缓存。

用法：python3 scripts/research/p23_source_fixture.py --state S1b \
  --operation getArticleSitemapPage --variables '{"first":250,"after":null}'
每次 CLI 从 S0 重放只是准备材料；连续测试必须复用同一个 Scenario，
依次 apply('e1')…apply('e4')，不能重建实例冒充缓存／消费者继承验证。
成功 JSON 省略 errors（对应 JS undefined），不是 errors:null；故障返回
既定 data:null/errors。仅覆盖研究表五个 operation，并非全站 mock。
源事件时间不代表请求／刷新排程；无 HTTP 服务、转换层或缓存实现。
"""

import argparse
from copy import deepcopy
from datetime import datetime, timedelta, timezone
import json
import sys

STATES = ('S0', 'S1a', 'S1b', 'S1', 'S2')
EVENTS = ('e1', 'e2', 'e3', 'e4')
# 独立于记录数量：这是固定响应，不是对真实 API 计数一致性的证明。
ARTICLE_COUNTS = {'S0': 1, 'S1a': 1, 'S1b': 2, 'S1': 1, 'S2': 1}
TYPES = ('ARTICLE', 'BLOG', 'PRODUCT', 'COLLECTION', 'PAGE')
OPERATIONS = ('getBlog', 'getBlogArticle', 'getSitemapPagesCount',
              'getArticleSitemapPage', 'getSitemapPage')
BLOG = {'handle': 'guides', 'title': 'Fixture Guides',
        'seo': {'title': 'Fixture Guides | Fixture Shop',
                'description': 'Synthetic guides.'}}


def long_body():
  """按已发布算法生成；不保存约 1.7 MB 的生成文件。"""
  return '<h2 id="care">Care guide v3</h2>' + ''.join(
    f'<p data-section="{i:05}">第{i:05}节：冷水清洗，阴凉晾干。Café naïve — 日本語と絵文字 🧵🧼。Read <a href="/blogs/guides/size-guide#measure">size advice</a>; do not tumble dry.</p>'
    for i in range(1, 8193)) + '<h2 id="end">End</h2><p>完整结束。END-08192</p>'


def _record(handle, title, published, body):
  return {'handle': handle, 'title': title, 'publishedAt': published,
          'sourceUpdatedAt': published, 'sourceRevision': 1, 'body': body,
          'excerpt': title + ' excerpt', 'image': None, 'authorV2': None,
          'seo': {'title': title + ' | Fixture Shop',
                  'description': title + ' summary'}}


def _initial_records():
  start = datetime(2026, 1, 1, tzinfo=timezone.utc)
  records = {}
  for i in range(1, 249):
    published = (start + timedelta(minutes=i)).isoformat().replace('+00:00', 'Z')
    r = _record(f'archive-{i:03}', f'Archive {i:03}', published,
                f'<p>Archive record {i:03}.</p>')
    records[r['handle']] = r
  records['care-guide'] = _record('care-guide', 'Care guide v1',
    '2026-01-02T00:00:00Z', '<h2>Care</h2><p>Wash cold.</p>')
  records['retired-guide'] = _record('retired-guide', 'Retired guide',
    '2026-01-03T00:00:00Z', '<p>Retired instructions.</p>')
  return records


def _summary(r):
  return {**{key: r[key] for key in
             ('handle', 'title', 'publishedAt', 'excerpt', 'image', 'authorV2')},
          'content': r['excerpt']}


def _validate(operation, variables):
  if operation not in OPERATIONS:
    raise ValueError('unknown operation: ' + str(operation))
  if not isinstance(variables, dict):
    raise ValueError('variables must be an object')
  required = {
    'getBlog': {'handle', 'first'},
    'getBlogArticle': {'blogHandle', 'articleHandle'},
    'getSitemapPagesCount': {'type'},
    'getArticleSitemapPage': {'first', 'after'},
    'getSitemapPage': {'type', 'page'},
  }[operation]
  optional = {'country', 'language'} if operation in ('getBlog', 'getBlogArticle') else set()
  if not required <= variables.keys() or variables.keys() - required - optional:
    raise ValueError('missing or unsupported variables for ' + operation)
  for key in ('handle', 'blogHandle', 'articleHandle'):
    if key in variables and not isinstance(variables[key], str):
      raise ValueError(key + ' must be a string')
  for key in ('first', 'page'):
    if key in variables and (type(variables[key]) is not int or variables[key] < 1):
      raise ValueError(key + ' must be a positive integer')
  if 'type' in variables and variables['type'] not in TYPES:
    raise ValueError('unsupported resource type')
  for key, expected in (('country', 'US'), ('language', 'EN')):
    if key in variables and variables[key] != expected:
      raise ValueError('fixture locale requires ' + key + '=' + expected)
  if operation == 'getArticleSitemapPage':
    if variables['first'] != 250:
      raise ValueError('ARTICLE first must be 250')
    if variables['after'] not in (None, 'p23:250'):
      raise ValueError('unknown cursor')
  if operation == 'getSitemapPage' and variables['type'] == 'ARTICLE':
    raise ValueError('ARTICLE requires getArticleSitemapPage')


class Scenario:
  """单一源：顺序应用四事件。返回值为脱离源的快照，不允许消费者改源。"""

  def __init__(self):
    self._step = 0
    self._records = _initial_records()

  @property
  def state(self):
    return STATES[self._step]

  @property
  def records(self):
    """只读用途的账本副本；source 字段不进入 GraphQL 节点。"""
    return deepcopy(self._records)

  def apply(self, event):
    if self._step >= len(EVENTS) or event != EVENTS[self._step]:
      raise ValueError('expected next event for ' + self.state)
    # 全部变更准备完成后才提交；失败不推进状态。
    records = deepcopy(self._records)
    if event in ('e1', 'e4'):
      r = records['care-guide']
      is_long = event == 'e4'
      r.update(title='Care guide v3' if is_long else 'Care guide v2',
        sourceRevision=3 if is_long else 2,
        sourceUpdatedAt='2026-10-20T11:00:00Z' if is_long else '2026-10-20T10:00:00Z',
        body=long_body() if is_long else '<h2>Care</h2><p>Wash cold. Air dry.</p>',
        excerpt='Long-form care guide; cold wash, air dry.' if is_long else 'Cold wash and air dry.',
        seo={'title': 'Care guide v3 | Fixture Shop' if is_long else 'Care guide v2 | Fixture Shop',
             'description': 'A detailed care guide. Wash cold and air dry.' if is_long else 'Wash cold and air dry.'})
    elif event == 'e2':
      records['size-guide'] = _record('size-guide', 'Size guide',
        '2026-10-20T10:01:00Z', '<h2 id="measure">Size</h2><p>Measure before choosing.</p>')
    else:
      del records['retired-guide']
    self._records = records
    self._step += 1
    return self.state

  def respond(self, operation, variables, *, unavailable=False):
    """对应 storefront.request(operation, {variables}) 的合成返回值。

    unavailable 仅模拟此次源失败，不修改源、不推进事件；未知操作仍拒绝。
    成功省略 errors，JSON 没有 undefined；JS 替身可直接读取缺失属性。
    """
    _validate(operation, variables)
    if unavailable:
      return {'data': None, 'errors': [{'message': 'fixture unavailable',
        'extensions': {'code': 'INTERNAL_SERVER_ERROR'}}]}
    records = self.records
    blog = deepcopy(BLOG)
    if operation == 'getBlog':
      nodes = sorted(records.values(), key=lambda r: r['publishedAt'], reverse=True)
      data = {'blog': {**blog, 'articles': {'nodes': [
        _summary(r) for r in nodes[:variables['first']]]}}
              if variables['handle'] == 'guides' else None}
    elif operation == 'getBlogArticle':
      r = records.get(variables['articleHandle'])
      detail = {**_summary(r), 'contentHtml': r['body'], 'seo': r['seo']} if r else None
      data = {'blog': {**blog, 'articleByHandle': detail}
              if variables['blogHandle'] == 'guides' else None}
    elif operation == 'getSitemapPagesCount':
      count = ARTICLE_COUNTS[self.state] if variables['type'] == 'ARTICLE' else int(variables['type'] == 'BLOG')
      data = {'sitemap': {'pagesCount': {'count': count}}}
    elif operation == 'getArticleSitemapPage':
      rows = sorted(records.values(), key=lambda r: r['sourceUpdatedAt'])
      start = 0 if variables['after'] is None else 250
      page = rows[start:start + 250]
      end = start + len(page)
      data = {'articles': {'nodes': [{'blog': {'handle': 'guides'},
        'handle': r['handle'], 'publishedAt': r['publishedAt']} for r in page],
        'pageInfo': {'endCursor': f'p23:{end}' if page else None,
                     'hasNextPage': end < len(rows)}}}
    else:
      items = [{'handle': 'guides', 'updatedAt': '2026-01-01T00:00:00Z'}] if (
        variables['type'] == 'BLOG' and variables['page'] == 1) else []
      data = {'sitemap': {'resources': {'items': items}}}
    return {'data': data}


def main(argv=None):
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--state', choices=STATES, required=True)
  parser.add_argument('--operation', choices=OPERATIONS, required=True)
  parser.add_argument('--variables', required=True, help='JSON object')
  parser.add_argument('--unavailable', action='store_true')
  args = parser.parse_args(argv)
  try:
    variables = json.loads(args.variables)
    scenario = Scenario()
    for event in EVENTS[:STATES.index(args.state)]:
      scenario.apply(event)
    response = scenario.respond(args.operation, variables, unavailable=args.unavailable)
  except (ValueError, TypeError) as exc:
    parser.error(str(exc))
  print(json.dumps(response, ensure_ascii=False, separators=(',', ':')))
  return 0


if __name__ == '__main__':
  sys.exit(main())
