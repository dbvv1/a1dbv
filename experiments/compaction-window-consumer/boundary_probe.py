import argparse
import asyncio, copy, json, os
parser = argparse.ArgumentParser()
parser.add_argument("--expect", choices=("hidden-id", "clean"), required=True)
args = parser.parse_args()
os.environ['OPENAI_AGENTS_DISABLE_TRACING']='1'
from agents import Agent, Runner, SQLiteSession, RunConfig, set_tracing_disabled
from agents.memory import OpenAIResponsesCompactionSession, SessionSettings
from agents.testing import ScriptedModel, assistant_message
from openai import AsyncOpenAI
import httpx2
set_tracing_disabled(True)
def forbidden(request):
 raise AssertionError('network request forbidden')
MSG={'type':'message','role':'assistant','id':'msg_public_fixture','status':'completed','content':[{'type':'output_text','text':'answer','annotations':[]}]}
USER={'role':'user','content':'question'}
REASON={'type':'reasoning','id':'rs_public_fixture','summary':[]}
CASES={'exact-full':([MSG],1),'cut-message':([USER,REASON,MSG],1),'whole-short':([USER,MSG],10),'user-boundary':([REASON,USER,MSG],2),'reasoning-boundary':([USER,REASON,MSG],2)}
async def one(case, explicit, stream):
 history,limit=CASES[case]
 store=SQLiteSession('fixture',session_settings=SessionSettings(limit=limit))
 await store.add_items(copy.deepcopy(history))
 client=AsyncOpenAI(api_key='unused-public-placeholder',http_client=httpx2.AsyncClient(transport=httpx2.MockTransport(forbidden)))
 session=OpenAIResponsesCompactionSession('fixture',store,client=client,should_trigger_compaction=lambda ctx:False)
 model=ScriptedModel([[assistant_message('ok')]])
 config=RunConfig(tracing_disabled=True,session_settings=SessionSettings(limit=limit) if explicit else None)
 try:
  if stream:
   result=Runner.run_streamed(Agent(name='probe',model=model),'next',session=session,run_config=config)
   async for _ in result.stream_events():pass
  else: result=await Runner.run(Agent(name='probe',model=model),'next',session=session,run_config=config)
  items=model.calls[-1].input
  stored=await store.get_items(limit=100)
  assert stored[:len(history)]==history, 'stored history changed'
  assert len(stored)==len(history)+2
  ids=[x.get('id') for x in items if x.get('type')=='message' and x.get('role')=='assistant']
  assert len(ids)==1
  omit = case in ('cut-message', 'exact-full') and (explicit or args.expect == 'clean')
  assert ids == ([None] if omit else ['msg_public_fixture']), (case, explicit, stream, ids)
  return {'case':case,'explicit_limit':explicit,'stream':stream,'assistant_ids':ids,'stored_prefix_exact':True,'input_types':[x.get('type') or x.get('role') for x in items]}
 finally:
  await client.close();store.close()
async def main():
 rows=[await one(case,explicit,stream) for case in CASES for explicit in (False,True) for stream in (False,True)]
 print(json.dumps(rows,indent=2))
asyncio.run(main())
