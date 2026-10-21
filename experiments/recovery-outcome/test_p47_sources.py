"""Standard-library integrity checks only; never execute upstream excerpts."""
import ast
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

SOURCE = Path(__file__).with_name('p47_sources.json')
PINS = {
  'lite': ('978b4d1e4e91cdaaab2e16fbd02d855439e143c1', '7d1616fc9678d86acdf60b05f296a7c2b52fd718'),
  'pyd': ('b40096c4c91e4db361ee3f23b0e3f6b85569faa2', '47d243e3b7dc626f822c921d7dcde010787c1773'),
  'pydutils': ('b40096c4c91e4db361ee3f23b0e3f6b85569faa2', '54f666713695ed9fb566e7afe03afb9e473b5dcb'),
  'oairetry': ('17d994bd3045dae71acda676a4ef4762ed8ecd94', '5ad40f68ac781608664ae276f652df970d2c5dfd'),
}
NAMES = {
  '_stream_chunks_have_generated_content', '_anthropic_stream_should_decline_fallback',
  '_request_stream_until_first_event', 'Unset', 'PeekableAsyncStream', 'aclose_if_supported',
  'ModelRetryBackoffSettings', '_coerce_backoff_settings', 'ModelRetrySettings',
}

def ast_fingerprint(tree):
  # Python 3.13 changes ast.dump's empty-field rendering. Canonicalize the
  # actual node fields, omitting only absent/empty optional fields.
  def canonical(value):
    if isinstance(value, ast.AST):
      return [type(value).__name__, {key: canonical(item) for key, item in ast.iter_fields(value)
                                   if item is not None and item != []}]
    if isinstance(value, list):
      return [canonical(item) for item in value]
    if value is Ellipsis:
      return {'constant': 'Ellipsis'}
    return value
  return hashlib.sha256(json.dumps(canonical(tree), sort_keys=True).encode()).hexdigest()

AST_PINS = {
  "_stream_chunks_have_generated_content": "4cc0bb092c75e97f02d86b68c462f4978ad889c0881c61c80ebee3c0070f7c66",
  "_anthropic_stream_should_decline_fallback": "15613581f093cbcc80421294bfba529b965caa42ba54ca7ba762e753ea3d783f",
  "_request_stream_until_first_event": "e868317c2853cb22906da251e6f27017c34abdf1ffc37e4f27fab71d32447d76",
  "Unset": "792c88a0ddd3ac5c6d1da9a7535464c2662274b7a9c615f01bd90a7eb3afb178",
  "PeekableAsyncStream": "787e7b553077e33e7d800ac16a7a5427e891df5caa3dc92981d41c9c16d38068",
  "aclose_if_supported": "e58fbf74d2945599dec28d90cb9b99d542815e5cfe3b35fb05a6bde45aae3f53",
  "ModelRetryBackoffSettings": "dc7521d2e6146694b9e6ef950c94fafb2c42e6753fd48e0e04ad11090ba66192",
  "_coerce_backoff_settings": "2327717128b3f96d511502a974f535326be2c78d542df046ea1c5aa376ca2993",
  "ModelRetrySettings": "b15957e90ad349dfa341c839e06c81220573668cf06c0a334aded32b048fa0c9"
}

def read_sources(path=SOURCE):
  value = json.loads(Path(path).read_text(encoding='utf-8'))
  if {s['key'] for s in value['sources']} != set(PINS):
    raise ValueError('Unexpected source set')
  names = []
  for source in value['sources']:
    if (source['commit'], source['blob_sha']) != PINS[source['key']]:
      raise ValueError('Source pin mismatch')
    for item in source['excerpts']:
      names.append(item['name'])
      if hashlib.sha256(item['source'].encode()).hexdigest() != item['sha256']:
        raise ValueError('Excerpt digest mismatch')
      tree = ast.parse(item['source'])
      fingerprint = ast_fingerprint(tree)
      if fingerprint != AST_PINS.get(item['name']):
        raise ValueError('Definition AST mismatch')
      if len(tree.body) != 1 or not isinstance(tree.body[0], (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
        raise ValueError('Only one explicit definition is permitted per excerpt')
      if tree.body[0].name != item['name'] or any(isinstance(n, (ast.Import, ast.ImportFrom)) for n in ast.walk(tree)):
        raise ValueError('Unexpected name or imports')
      if len(item['source'].splitlines()) != item['end_line'] - item['start_line'] + 1:
        raise ValueError('Source range mismatch')
  if set(names) != NAMES or len(names) != len(NAMES):
    raise ValueError('Unexpected excerpt set')
  return value


class SourceIntegrityTests(unittest.TestCase):
  def test_exact_definition_set_and_licenses(self):
    value = read_sources()
    self.assertEqual(len(value['licenses']), 3)
    for license in value['licenses']:
      self.assertIn('Permission is hereby granted', license['text'])

  def test_missing_input_fails(self):
    with tempfile.TemporaryDirectory() as directory:
      with self.assertRaises(FileNotFoundError):
        read_sources(Path(directory) / 'absent.json')

  def test_modified_excerpt_fails_closed(self):
    value = read_sources()
    value['sources'][0]['excerpts'][0]['source'] += '# mutation\n'
    with tempfile.TemporaryDirectory() as directory:
      path = Path(directory) / 'changed.json'
      path.write_text(json.dumps(value))
      with self.assertRaisesRegex(ValueError, 'digest'):
        read_sources(path)

  def test_unknown_source_pin_fails(self):
    value = read_sources()
    value['sources'][0]['commit'] = 'main'
    with tempfile.TemporaryDirectory() as directory:
      path = Path(directory) / 'changed.json'
      path.write_text(json.dumps(value))
      with self.assertRaisesRegex(ValueError, 'pin'):
        read_sources(path)

  def test_modified_body_with_rehashed_text_fails_ast_check(self):
    value = read_sources()
    item = value['sources'][0]['excerpts'][0]
    item['source'] = item['source'].replace('return False', 'return True')
    item['sha256'] = hashlib.sha256(item['source'].encode()).hexdigest()
    with tempfile.TemporaryDirectory() as directory:
      path = Path(directory) / 'changed.json'
      path.write_text(json.dumps(value))
      with self.assertRaisesRegex(ValueError, 'AST'):
        read_sources(path)


if __name__ == '__main__':
  unittest.main()
