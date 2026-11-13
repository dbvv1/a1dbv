"""Independent fixed-baseline consumer assertions for the SDK migration candidate."""
import copy
import json
import socket

import anthropic
import pytest

from agent import anthropic_adapter as adapter

NEW = int(anthropic.__version__.split('.')[0]) >= 2
KEY = 'synthetic-provider-key'
TOKEN = 'synthetic-provider-token'
MODEL = 'claude-sonnet-4-20250514'


@pytest.fixture(autouse=True)
def isolated(monkeypatch):
    adapter._anthropic_sdk = anthropic
    monkeypatch.setattr(adapter, '_claude_code_version_cache', 'test')
    monkeypatch.setattr(adapter, '_custom_provider_extra_headers', lambda _: {})
    for name in ('connect', 'connect_ex', 'bind', 'listen'):
        monkeypatch.setattr(socket.socket, name, lambda *a, **k: pytest.fail('real network forbidden'))


def capture(client, seen, status=200):
    import httpx
    wire = __import__('httpx2') if NEW else httpx
    def handler(request):
        body = json.loads(request.content)
        seen.append((dict(request.headers), body))
        if status != 200:
            return wire.Response(status, json={'type': 'error', 'error': {'type': 'invalid_request_error', 'message': 'synthetic rejection'}})
        message = {'id': 'msg_test', 'type': 'message', 'role': 'assistant', 'model': MODEL,
                   'content': [{'type': 'text', 'text': 'ok'}], 'stop_reason': 'end_turn',
                   'usage': {'input_tokens': 1, 'output_tokens': 1}}
        if not body.get('stream'):
            return wire.Response(200, json=message)
        start = {**message, 'content': [], 'stop_reason': None}
        events = [('message_start', {'type': 'message_start', 'message': start}),
                  ('content_block_start', {'type': 'content_block_start', 'index': 0, 'content_block': {'type': 'text', 'text': ''}}),
                  ('content_block_delta', {'type': 'content_block_delta', 'index': 0, 'delta': {'type': 'text_delta', 'text': 'ok'}}),
                  ('content_block_stop', {'type': 'content_block_stop', 'index': 0}),
                  ('message_delta', {'type': 'message_delta', 'delta': {'stop_reason': 'end_turn', 'stop_sequence': None}, 'usage': {'output_tokens': 1}}),
                  ('message_stop', {'type': 'message_stop'})]
        text = ''.join('event: '+name+'\ndata: '+json.dumps(data)+'\n\n' for name, data in events)
        return wire.Response(200, text=text, headers={'content-type': 'text/event-stream'})
    # Keep real client construction, hooks/auth and copy semantics; replace only external I/O.
    client._client._transport = wire.MockTransport(handler)
    client._client._mounts = {}
    return client


def kwargs(messages=None):
    return adapter.build_anthropic_kwargs(MODEL, messages or [{'role': 'user', 'content': 'hi'}],
        tools=None, max_tokens=4096, reasoning_config={'enabled': True, 'budget_tokens': 1024})


@pytest.mark.parametrize('style', ['key', 'token'])
def test_auth_copy_and_constructor_contract(monkeypatch, style):
    monkeypatch.setenv('ANTHROPIC_API_KEY', 'synthetic-env-key')
    monkeypatch.setenv('ANTHROPIC_AUTH_TOKEN', 'synthetic-env-token')
    monkeypatch.setattr(adapter, '_auth_style', lambda *a: 'api_key' if style == 'key' else 'bearer')
    credential = KEY if style == 'key' else TOKEN
    seen = []
    client = capture(adapter.build_anthropic_client(credential, base_url='https://gateway.invalid', timeout=31), seen)
    assert client.timeout.read == 31 and client.timeout.connect == 10
    assert client.max_retries == 0
    for current in (client, client.with_options(timeout=17)):
        current.messages.create(model=MODEL, max_tokens=8, messages=[{'role': 'user', 'content': 'hi'}])
    assert len(seen) == 2
    for headers, _ in seen:
        assert (headers.get('x-api-key') == KEY) is (style == 'key')
        assert (headers.get('authorization') == 'Bearer '+TOKEN) is (style == 'token')
        assert ('authorization' not in headers) if style == 'key' else ('x-api-key' not in headers)
    client.close()


@pytest.mark.parametrize('aux,temperature', [(False, None), (True, None), (True, 0.3)])
def test_actual_main_and_auxiliary_request_sampling(aux, temperature, monkeypatch):
    seen = []
    client = capture(adapter.build_anthropic_client(KEY, base_url='https://gateway.invalid'), seen)
    if aux:
        from agent.auxiliary_client import _AnthropicCompletionsAdapter
        wrapper = _AnthropicCompletionsAdapter(client, MODEL, base_url='https://gateway.invalid')
        call = dict(model=MODEL, messages=[{'role': 'user', 'content': 'hi'}],
            max_tokens=4096, temperature=temperature, _reasoning_config={'enabled': True, 'budget_tokens': 1024})
        if NEW and temperature is not None:
            with pytest.raises(ValueError, match='(?i)temperature|sampling'):
                wrapper.create(**call)
            assert seen == []
            client.close()
            return
        answer = wrapper.create(**call)
        assert answer.choices[0].message.content == 'ok'
    else:
        answer = adapter.create_anthropic_message(client, kwargs())
        assert answer.content[0].text == 'ok'
    assert len(seen) == 1
    body = seen[0][1]
    assert body['max_tokens'] == 12096  # Fixed baseline adds default thinking budget to requested output.
    assert body['thinking']['type'] == 'enabled'
    if NEW:
        assert not {'temperature', 'top_p', 'top_k'} & body.keys()
    else:
        assert body['temperature'] == (temperature if temperature is not None else 1)
    client.close()


def test_user_citations_assistant_provenance_and_input_immutable():
    citation = {'type': 'char_location', 'cited_text': 'source', 'document_index': 0,
                'document_title': 'doc', 'start_char_index': 0, 'end_char_index': 6}
    user = {'type': 'text', 'text': 'question', 'citations': [citation]}
    assistant = {'type': 'text', 'text': 'answer', 'citations': [citation], 'cache_control': {'type': 'ephemeral'}}
    messages = [{'role': 'user', 'content': [user]}, {'role': 'assistant', 'content': [assistant]},
                {'role': 'user', 'content': 'continue'}]
    frozen = copy.deepcopy(messages)
    seen = []
    client = capture(adapter.build_anthropic_client(KEY, base_url='https://gateway.invalid'), seen)
    adapter.create_anthropic_message(client, kwargs(messages), prefer_stream=False)
    body = seen[0][1]
    users = [b for m in body['messages'] if m['role']=='user' for b in m['content'] if isinstance(b, dict)]
    first = next(b for b in users if b.get('text')=='question')
    assert ('citations' not in first) if NEW else (first['citations']==[citation])
    replies = [b for m in body['messages'] if m['role']=='assistant' for b in m['content']]
    reply = next(b for b in replies if b.get('text')=='answer')
    assert reply['citations'] == [citation]
    assert reply['cache_control'] == {'type':'ephemeral'}
    assert messages == frozen
    client.close()


def test_http_failure_is_not_stream_fallback():
    seen = []
    client = capture(adapter.build_anthropic_client(KEY, base_url='https://gateway.invalid'), seen, status=400)
    with pytest.raises(anthropic.BadRequestError):
        adapter.create_anthropic_message(client, kwargs())
    assert len(seen) == 1
    client.close()
