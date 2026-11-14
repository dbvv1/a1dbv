"""Check the recorded public SDK consumer matrix, not a live model or server."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent
for name in ('baseline', 'candidate', 'release'):
  rows = json.loads((root / f'{name}.json').read_text())
  assert len(rows) == 8
  expected = {(mode, stream) for stream in (False, True) for mode in (
    'direct-limited', 'wrapped-hidden-limit', 'wrapped-explicit-limit', 'wrapped-unlimited')}
  assert {(r['mode'], r['stream']) for r in rows} == expected
  for row in rows:
    assert row['final_output'] == 'ok'
    assert row['stored_items'] == 6 and row['stored_call_preserved']
    orphan_expected = row['mode'] == 'wrapped-hidden-limit' and name != 'candidate'
    assert row['orphan_outputs'] == (['call_1'] if orphan_expected else [])
    expected_types = ['assistant', 'user']
    if row['mode'] == 'wrapped-unlimited':
      expected_types = ['user', 'function_call', 'function_call_output', 'assistant', 'user']
    elif orphan_expected:
      expected_types = ['function_call_output', 'assistant', 'user']
    assert row['input_types'] == expected_types
  print(f'{name}: 8 recorded cases match expected request and storage contracts')
