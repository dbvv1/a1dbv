"""Gateway serialization control only, NOT validation of any gateway server contract."""
import copy
import pytest
from tests.agent.test_sdk_migration_independent import adapter, capture, kwargs, isolated, KEY, MODEL

@pytest.mark.parametrize('temperature', [None, 0.3])
def test_gateway_retains_sampling_body(temperature):
    from agent.auxiliary_client import _AnthropicCompletionsAdapter
    seen = []
    client = capture(adapter.build_anthropic_client(KEY, base_url='https://gateway.invalid'), seen)
    wrapper = _AnthropicCompletionsAdapter(client, MODEL, base_url='https://gateway.invalid')
    wrapper.create(model=MODEL, messages=[{'role':'user','content':'hi'}], max_tokens=4096,
        temperature=temperature, _reasoning_config={'enabled':True,'budget_tokens':1024})
    headers, body = seen[0]
    assert body['temperature'] == (temperature if temperature is not None else 1)
    assert headers['anthropic-version'] == '2026-10-21'
    assert len(seen) == 1
    client.close()

def test_gateway_retains_citations_without_mutation():
    data = [{'role':'user','content':[{'type':'text','text':'question','citations':[{'type':'char_location','cited_text':'s','document_index':0,'document_title':'d','start_char_index':0,'end_char_index':1}]}]}]
    frozen = copy.deepcopy(data)
    seen = []
    client = capture(adapter.build_anthropic_client(KEY, base_url='https://gateway.invalid'), seen)
    adapter.create_anthropic_message(client, kwargs(data), prefer_stream=False)
    assert seen[0][1]['messages'][0]['content'][0]['citations'] == data[0]['content'][0]['citations']
    assert data == frozen
    client.close()
