import asyncio
import argparse
import json
import os
parser = argparse.ArgumentParser(description='Replay the public compaction-window SDK consumer.')
parser.add_argument('--expect', choices=('hidden-orphan', 'clean'), required=True)
args = parser.parse_args()
os.environ['OPENAI_AGENTS_DISABLE_TRACING'] = '1'
from openai import AsyncOpenAI
import httpx2
network_requests = []
def unexpected_request(request):
 network_requests.append(str(request.url))
 raise AssertionError("Unexpected API request")
from agents import Agent, Runner, SQLiteSession, RunConfig, set_tracing_disabled
from agents.memory import OpenAIResponsesCompactionSession, SessionSettings
from agents.testing import ScriptedModel, assistant_message
set_tracing_disabled(True)
HISTORY = [
 {'role':'user','content':'weather?'},
 {'type':'function_call','call_id':'call_1','name':'weather','arguments':'{}'},
 {'type':'function_call_output','call_id':'call_1','output':'sunny'},
 {'role':'assistant','content':'It is sunny.'},
]
async def run(mode, stream):
 store=SQLiteSession('public-demo',session_settings=SessionSettings(limit=2) if mode!='wrapped-unlimited' else None)
 await store.add_items(HISTORY)
 session=store
 client=None
 if mode!='direct-limited':
  client=AsyncOpenAI(api_key='unused-public-placeholder', http_client=httpx2.AsyncClient(transport=httpx2.MockTransport(unexpected_request)))
  session=OpenAIResponsesCompactionSession('public-demo',store,client=client,should_trigger_compaction=lambda ctx:False)
 model=ScriptedModel([[assistant_message('ok')]])
 config=RunConfig(tracing_disabled=True,session_settings=SessionSettings(limit=2) if mode=='wrapped-explicit-limit' else None)
 kwargs=dict(session=session,run_config=config)
 if stream:
  result=Runner.run_streamed(Agent(name='probe',model=model),'tomorrow?',**kwargs)
  async for _ in result.stream_events(): pass
 else:
  result=await Runner.run(Agent(name='probe',model=model),'tomorrow?',**kwargs)
 items=model.calls[-1].input
 calls={x.get('call_id') for x in items if x.get('type')=='function_call'}
 orphans=[x['call_id'] for x in items if x.get('type')=='function_call_output' and x.get('call_id') not in calls]
 stored = await store.get_items(limit=100)
 if client: await client.close()
 store.close()
 return {'mode':mode,'stream':stream,'input_types':[x.get('type') or x.get('role') for x in items],'orphan_outputs':orphans,'final_output':result.final_output,'stored_items':len(stored),'stored_call_preserved':any(x.get('type')=='function_call' for x in stored)}
async def main():
 rows = [await run(mode,stream) for stream in [False,True] for mode in ['direct-limited','wrapped-hidden-limit','wrapped-explicit-limit','wrapped-unlimited']]
 assert len(rows) == 8
 for row in rows:
  orphan_expected = args.expect == 'hidden-orphan' and row['mode'] == 'wrapped-hidden-limit'
  assert row['orphan_outputs'] == (['call_1'] if orphan_expected else [])
  expected_types = ['assistant','user']
  if row['mode'] == 'wrapped-unlimited':
   expected_types = ['user','function_call','function_call_output','assistant','user']
  elif orphan_expected:
   expected_types = ['function_call_output','assistant','user']
  assert row['input_types'] == expected_types
  assert row['stored_items'] == 6 and row['stored_call_preserved']
  assert row['final_output'] == 'ok'
 assert not network_requests
 print(json.dumps(rows,indent=2))
asyncio.run(main())
assert not network_requests
