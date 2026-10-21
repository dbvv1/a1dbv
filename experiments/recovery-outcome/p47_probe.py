"""P47 bounded excerpt probe, NOT an SDK/provider/business-tool test.

Requires existing anyio and pydantic; never installs dependencies. Run manually:
  timeout 10s python3 experiments/recovery-outcome/p47_probe.py
Source-integrity tests in test_p47_sources.py remain standard-library-only.
"""
from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager
import dataclasses
import sys
from types import ModuleType, SimpleNamespace
from typing import Any, Callable, Generic, TypeVar
import unittest

import anyio
from pydantic import Field, TypeAdapter
from pydantic.dataclasses import dataclass as pydantic_dataclass

from test_p47_sources import read_sources


def load_excerpt_host():
  """Explicit names only; no SDK imports, autoload, network, or deadline claims."""
  bundle = read_sources()
  module = ModuleType('p47_excerpt_host')
  sys.modules[module.__name__] = module
  env = module.__dict__
  env.update(dict(anyio=anyio, Any=Any,
             Callable=Callable, Generic=Generic, T=TypeVar('T'),
             SourceT=TypeVar('SourceT'), dataclasses=dataclasses,
             Field=Field, pydantic_dataclass=pydantic_dataclass))
  # Deferred annotations avoid importing SDK types; these runtime aliases are
  # needed by the exact Pydantic dataclass definitions, not model adapters.
  for source in bundle['sources']:
    for item in source['excerpts']:
      name = item['name']
      if name == '_request_stream_until_first_event':
        continue  # Needs the explicit no-deadline host installed below.
      code = compile('from __future__ import annotations\n' + item['source'],
                     source['url'] + '#' + name, 'exec')
      exec(code, env)
      if name == 'Unset':
        env['UNSET'] = env['Unset']()
      if name == 'ModelRetryBackoffSettings':
        env['ModelRetryBackoffInput'] = env[name] | dict[str, Any]
  env['stream_under_deadline'] = no_deadline
  env['asynccontextmanager'] = asynccontextmanager
  item = next(e for s in bundle['sources'] for e in s['excerpts']
              if e['name'] == '_request_stream_until_first_event')
  exec(compile('from __future__ import annotations\n' + item['source'],
               'pydantic-ai-v2.58.0-first-event-excerpt', 'exec'), env)
  return env


@asynccontextmanager
async def no_deadline(deadline, manager):
  if deadline is not None:
    raise ValueError('This probe cannot test deadline behavior')
  async with manager as response:
    yield response


class FakeResponse:
  def __init__(self, events):
    self._event_iterator = self.events(events)

  async def events(self, values):
    for value in values:
      if isinstance(value, Exception):
        raise value
      yield value

  def __aiter__(self):
    return self._event_iterator


class FakeModel:
  def __init__(self, events):
    self.response = FakeResponse(events)
    self.closed = False

  @asynccontextmanager
  async def request_stream(self, *args):
    try:
      yield self.response
    finally:
      self.closed = True


class ExcerptProbe(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    cls.host = load_excerpt_host()

  def test_litellm_lifecycle_frame_is_not_generated_content(self):
    f = self.host['_stream_chunks_have_generated_content']
    self.assertFalse(f([]))
    self.assertFalse(f([SimpleNamespace(choices=[])]))
    self.assertFalse(f([SimpleNamespace(choices=[SimpleNamespace(delta={'role': 'assistant'})])]))

  def test_litellm_tool_fragment_and_other_content_commit(self):
    f = self.host['_stream_chunks_have_generated_content']
    for key, value in [('content', 'x'), ('tool_calls', [{'index': 0}]),
                       ('function_call', {'name': 'write'}), ('reasoning_content', 'x'),
                       ('thinking_blocks', [{}]), ('reasoning_items', [{}]),
                       ('audio', {'id': 'a'}), ('images', [{}]), ('annotations', [{}])]:
      with self.subTest(key=key):
        self.assertTrue(f([SimpleNamespace(choices=[SimpleNamespace(delta={key: value})])]))

  def test_litellm_missing_chunk_contract_is_error(self):
    with self.assertRaises(AttributeError):
      self.host['_stream_chunks_have_generated_content']([object()])

  def test_litellm_anthropic_no_fallback_after_commit(self):
    f = self.host['_anthropic_stream_should_decline_fallback']
    for generated, pre_first, expected in [(False, True, False), (True, True, True),
                                           (False, False, True), (True, False, True)]:
      self.assertEqual(f(generated, SimpleNamespace(is_pre_first_chunk=pre_first)), expected)

  def test_negative_text_only_detector_misses_tool_fragment(self):
    chunk = SimpleNamespace(choices=[SimpleNamespace(delta={'tool_calls': [{'index': 0}]})])
    self.assertTrue(self.host['_stream_chunks_have_generated_content']([chunk]))
    text_only_mutant = lambda chunks: any(c.choices[0].delta.get('content') for c in chunks)
    self.assertFalse(text_only_mutant([chunk]))

  def test_pydantic_first_event_before_handover(self):
    async def run():
      model = FakeModel([RuntimeError('before-first')])
      handed_over = False
      with self.assertRaisesRegex(RuntimeError, 'before-first'):
        async with self.host['_request_stream_until_first_event'](model, None, [], None, None, None):
          handed_over = True
      self.assertFalse(handed_over)
      self.assertTrue(model.closed)
    asyncio.run(run())

  def test_pydantic_first_event_is_not_lost(self):
    async def run():
      model = FakeModel(['first', 'second'])
      async with self.host['_request_stream_until_first_event'](model, None, [], None, None, None) as response:
        self.assertEqual([e async for e in response], ['first', 'second'])
      self.assertTrue(model.closed)
    asyncio.run(run())

  def test_pydantic_after_first_error_reaches_consumer(self):
    async def run():
      model = FakeModel(['first', RuntimeError('after-first')])
      seen = []
      with self.assertRaisesRegex(RuntimeError, 'after-first'):
        async with self.host['_request_stream_until_first_event'](model, None, [], None, None, None) as response:
          async for event in response:
            seen.append(event)
      self.assertEqual(seen, ['first'])
      self.assertTrue(model.closed)
    asyncio.run(run())

  def test_pydantic_empty_stream_handed_over(self):
    async def run():
      model = FakeModel([])
      async with self.host['_request_stream_until_first_event'](model, None, [], None, None, None) as response:
        self.assertEqual([e async for e in response], [])
    asyncio.run(run())

  def test_pydantic_nonzero_deadline_not_simulated(self):
    async def run():
      with self.assertRaisesRegex(ValueError, 'cannot test deadline'):
        async with self.host['_request_stream_until_first_event'](FakeModel([]), object(), [], None, None, None):
          self.fail('Unsupported deadline must not be accepted')
    asyncio.run(run())

  def test_openai_two_configuration_round_trips(self):
    settings = self.host['ModelRetrySettings']
    original = settings(max_retries=1, backoff={'initial_delay': 0.1}, policy=lambda context: True)
    adapter = TypeAdapter(settings)
    b1 = adapter.validate_json(adapter.dump_json(original))
    self.assertEqual(b1.max_retries, 1)
    self.assertEqual(b1.backoff.initial_delay, 0.1)
    self.assertIsNone(b1.policy)
    # Second config edit: changing retry count does not restore runtime behavior.
    b1.max_retries = 2
    b2 = adapter.validate_json(adapter.dump_json(b1))
    self.assertEqual(b2.max_retries, 2)
    self.assertIsNone(b2.policy)
    rebound = settings(max_retries=b2.max_retries, backoff=b2.backoff, policy=original.policy)
    self.assertIs(rebound.policy, original.policy)
    self.assertNotIn('policy', original.to_json_dict())

  def test_negative_policy_survival_assumption_fails(self):
    settings = self.host['ModelRetrySettings']
    adapter = TypeAdapter(settings)
    before = settings(policy=lambda context: False)
    after = adapter.validate_json(adapter.dump_json(before))
    with self.assertRaises(AssertionError):
      self.assertIs(after.policy, before.policy)

  def test_openai_missing_config_fields_are_explicit_defaults(self):
    value = TypeAdapter(self.host['ModelRetrySettings']).validate_json('{}')
    self.assertIsNone(value.policy)
    self.assertIsNone(value.max_retries)
    self.assertIsNone(value.backoff)


if __name__ == '__main__':
  unittest.main(verbosity=2)
