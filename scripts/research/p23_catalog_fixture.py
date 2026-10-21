"""Explicit empty catalog input, not an error fallback. Standard library only."""
from copy import deepcopy
import json
from p23_source_fixture import Scenario

MODE = 'empty-products-and-collections'
FOUR = frozenset(('getCollections', 'getCollectionsWithFeaturedImage', 'searchProducts', 'searchFacets'))
FIFTH = 'collectionProducts'
PLACEHOLDER_COLLECTION = 'getCollection'
PLACEHOLDER_LOCALE = {'country': 'US', 'language': 'EN', 'locale': 'en-US'}
POLICIES = ('contactInformation', 'legalNotice', 'privacyPolicy', 'refundPolicy', 'shippingPolicy', 'termsOfSale', 'termsOfService')
LOCALES = (None, {'country': 'US', 'language': 'EN'}, {'country': 'US', 'language': 'EN', 'locale': 'en-US'})


def failure():
  return {'data': None, 'errors': [{'message': 'fixture unavailable', 'extensions': {'code': 'INTERNAL_SERVER_ERROR'}}]}


def empty_catalog_response(operation, variables, *, mode, enable_collection_products=False,
    enable_placeholder_get_collection=False, locale=None, unavailable=False):
  if mode != MODE:
    raise ValueError('explicit empty catalog mode required')
  if type(enable_collection_products) is not bool or type(enable_placeholder_get_collection) is not bool:
    raise ValueError('optional operation flag must be boolean')
  if type(operation) is not str:
    raise ValueError('operation must be a string')
  if operation == PLACEHOLDER_COLLECTION and enable_placeholder_get_collection:
    # Only the observed static metadata request; never fabricate a collection.
    if type(variables) is not dict or variables != {'handle': '__placeholder__'}:
      raise ValueError('unsupported placeholder collection variables')
    if type(locale) is not dict or locale != PLACEHOLDER_LOCALE:
      raise ValueError('unsupported placeholder collection locale')
    return failure() if unavailable else {'data': {'collection': None}}
  if operation not in FOUR and not (enable_collection_products and operation == FIFTH):
    raise ValueError('unknown or disabled operation: ' + str(operation))
  if type(variables) is not dict:
    raise ValueError('variables must be an object')
  required = {'first'} if operation.startswith('getCollections') else ({'query'} if operation == 'searchFacets' else {'handle', 'first'} if operation == FIFTH else {'query', 'first'})
  optional = {'country', 'language'}
  if operation in ('searchProducts', 'searchFacets'):
    optional |= {'productFilters'}
  if operation in ('searchProducts', FIFTH):
    optional |= {'after', 'sortKey', 'reverse'}
  if operation == FIFTH:
    optional |= {'filters'}
  if not required <= variables.keys() or variables.keys() - required - optional:
    raise ValueError('missing or unsupported variables')
  if 'first' in variables:
    allowed = {50, 250} if operation == 'getCollections' else {250} if operation == 'getCollectionsWithFeaturedImage' else {40} if operation == FIFTH else {1, 8, 40}
    if type(variables['first']) is not int or variables['first'] not in allowed:
      raise ValueError('unsupported fixture first')
  if 'query' in variables and variables['query'] != '*':
    raise ValueError('unsupported fixture query')
  if 'handle' in variables and variables['handle'] != '__placeholder__':
    raise ValueError('unsupported fixture handle')
  for key, expected in (('country', 'US'), ('language', 'EN')):
    if key in variables and variables[key] != expected:
      raise ValueError('unsupported fixture locale variable')
  if 'after' in variables and variables['after'] is not None:
    raise ValueError('unsupported fixture cursor')
  for key in ('filters', 'productFilters'):
    if key in variables and not (variables[key] is None or type(variables[key]) is list and len(variables[key]) == 0):
      raise ValueError('unsupported fixture filters')
  expected_sort = 'COLLECTION_DEFAULT' if operation == FIFTH else 'RELEVANCE'
  if 'sortKey' in variables and variables['sortKey'] != expected_sort:
    raise ValueError('unsupported fixture sort')
  if 'reverse' in variables and variables['reverse'] is not False:
    raise ValueError('unsupported fixture reverse')
  if unavailable:
    return failure()
  if operation.startswith('getCollections'):
    result = {'collections': {'edges': []}}
  elif operation == 'searchProducts':
    result = {'search': {'edges': [], 'pageInfo': {'hasNextPage': False, 'hasPreviousPage': False, 'startCursor': None, 'endCursor': None}, 'productFilters': []}}
  elif operation == 'searchFacets':
    result = {'search': {'totalCount': 0, 'nodes': [], 'productFilters': []}}
  else:
    result = {'collection': None}
  return deepcopy({'data': result})


class AuditFatalError(RuntimeError):
  """Permanent evidence loss; this attempt must fail, even if app catches it."""


class Router:
  """One retained Scenario. Every request, including failures, is audited.

    Audit contains synthetic request payloads only; never headers/environment.
    Use only with this synthetic task. Sink failures propagate (fail closed).
    """
  def __init__(self, *, mode, enable_collection_products=False,
      enable_placeholder_get_collection=False, audit_sink):
    if mode != MODE:
      raise ValueError('explicit empty catalog mode required')
    if type(enable_collection_products) is not bool or type(enable_placeholder_get_collection) is not bool:
      raise ValueError('optional operation flag must be boolean')
    self.mode = mode
    self.enable_collection_products = enable_collection_products
    self.enable_placeholder_get_collection = enable_placeholder_get_collection
    self.source = Scenario()
    self.audit_sink = audit_sink
    self._audit_fatal = None

  @property
  def audit_fatal(self):
    """Independent in-memory evidence. Does NOT assert durable log delivery."""
    return deepcopy(self._audit_fatal)

  def require_healthy(self):
    if self._audit_fatal is not None:
      raise AuditFatalError('fixture audit failed permanently; attempt invalid')

  def audit(self, record):
    self.require_healthy()
    try:
      self.audit_sink(record)
    except Exception as exc:
      # Preserve the failed record and its original outcome/exception, without
      # rolling back a source event that may already have committed.
      self._audit_fatal = {
        'outcome': 'audit_fatal', 'durable_log_confirmed': False,
        'sink_error_type': type(exc).__name__,
        'failed_record': deepcopy(record), 'state': self.source.state,
      }
      raise AuditFatalError('fixture audit failed permanently; attempt invalid') from exc

  def handle(self, endpoint, payload, *, unavailable=False):
    self.require_healthy()
    record = {'endpoint': endpoint, 'payload': deepcopy(payload), 'state_before': self.source.state}
    try:
      if type(payload) is not dict:
        raise ValueError('payload must be an object')
      if endpoint == '/event':
        if set(payload) != {'event'}:
          raise ValueError('unsupported event payload')
        result = {'state': self.source.apply(payload['event'])}
      elif endpoint == '/request':
        if set(payload) - {'operation', 'variables', 'locale'} or 'operation' not in payload:
          raise ValueError('unsupported request payload')
        operation = payload['operation']
        if type(operation) is not str:
          raise ValueError('operation must be a string')
        variables = payload.get('variables', {})
        if payload.get('locale') not in LOCALES:
          raise ValueError('unsupported locale')
        if operation in FOUR or operation in (FIFTH, PLACEHOLDER_COLLECTION):
          result = empty_catalog_response(operation, variables, mode=self.mode, enable_collection_products=self.enable_collection_products,
            enable_placeholder_get_collection=self.enable_placeholder_get_collection,
            locale=payload.get('locale'), unavailable=unavailable)
        elif operation == 'getShopPolicies':
          if type(variables) is not dict or variables:
            raise ValueError('unsupported policy variables')
          result = failure() if unavailable else {'data': {'shop': {key: None for key in POLICIES}}}
        else:
          result = self.source.respond(operation, variables, unavailable=unavailable)
      else:
        raise ValueError('unknown endpoint')
      record['outcome'] = 'graphql_error' if result.get('errors') else 'success'
      return result
    except Exception as exc:
      record.update(outcome='rejected', error_type=type(exc).__name__, error=str(exc))
      raise
    finally:
      record['state_after'] = self.source.state
      self.audit(record)


def http_result(router, endpoint, payload):
  """Pure transport mapping; exercised offline without opening a socket."""
  try:
    return 200, router.handle(endpoint, payload)
  except AuditFatalError:
    return 503, {'error': 'fixture audit fatal; attempt invalid'}
  except Exception as exc:
    return 400, {'error': str(exc)}


def main():
  """Future opt-in loopback service. Not started by imports/offline tests."""
  import argparse
  from http.server import BaseHTTPRequestHandler, HTTPServer
  parser = argparse.ArgumentParser()
  parser.add_argument('--mode', required=True, choices=[MODE])
  parser.add_argument('--enable-collection-products', action='store_true')
  parser.add_argument('--enable-placeholder-get-collection', action='store_true')
  parser.add_argument('--port', type=int, default=8766)
  args = parser.parse_args()
  router = Router(mode=args.mode, enable_collection_products=args.enable_collection_products,
          enable_placeholder_get_collection=args.enable_placeholder_get_collection,
          audit_sink=lambda entry: print(json.dumps(entry, ensure_ascii=False), flush=True))

  class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
      try:
        router.require_healthy()
        payload = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
      except AuditFatalError:
        status, result = 503, {'error': 'fixture audit fatal; attempt invalid'}
      except Exception as exc:
        try:
          router.audit({'endpoint': self.path, 'outcome': 'parse_rejected',
                 'error_type': type(exc).__name__})
          status, result = 400, {'error': 'invalid JSON request'}
        except AuditFatalError:
          status, result = 503, {'error': 'fixture audit fatal; attempt invalid'}
      else:
        status, result = http_result(router, self.path, payload)
      body = json.dumps(result, ensure_ascii=False).encode()
      self.send_response(status)
      self.send_header('Content-Type', 'application/json')
      self.send_header('Content-Length', str(len(body)))
      self.end_headers()
      self.wfile.write(body)

  # Do not keep serving after audit loss, even if a consumer catches HTTP 503.
  # handle_request returns after a handler failure (including broken client pipe).
  server = HTTPServer(('127.0.0.1', args.port), Handler)
  try:
    while router.audit_fatal is None:
      server.handle_request()
  finally:
    server.server_close()
  if router.audit_fatal is not None:
    import sys
    try:
      print('P23_FIXTURE_AUDIT_FATAL: attempt invalid; durable audit not confirmed',
         file=sys.stderr, flush=True)
    except Exception:
      pass  # No claim that this fallback message was delivered.
    return 2
  return 0


if __name__ == '__main__':
  raise SystemExit(main())
