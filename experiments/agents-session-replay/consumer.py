"""Wire-level consumer of openai-agents-python #5454, without network calls."""
import asyncio
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

import httpx2
from openai import AsyncOpenAI
from agents import Agent, OpenAIChatCompletionsModel, Runner, RunConfig, SQLiteSession
from agents.decorators import tool
from agents.tracing.provider import DefaultTraceProvider
from agents.tracing.setup import set_trace_provider

# A processor-free provider keeps this wire fixture completely offline.
set_trace_provider(DefaultTraceProvider())

@tool
def lookup() -> str:
    """Return the synthetic contract value."""
    return "blue"

async def child(mode, db):
    requests = []
    def handler(request):
        payload = json.loads(request.content)
        requests.append(payload["messages"])
        message = {"role": "assistant", "content": "colour noted"}
        finish = "stop"
        if mode != "resume" and len(requests) == 1:
            message = {"role": "assistant", "content": None, "tool_calls": [{"id": "call_fixture", "type": "function", "function": {"name": "lookup", "arguments": "{}"}}]}
            finish = "tool_calls"
        return httpx2.Response(200, json={"id": "chat_fixture", "created": 0, "model": "fixture", "object": "chat.completion", "choices": [{"index":0, "finish_reason":finish, "message":message}]})
    async with AsyncOpenAI(api_key="test-placeholder", base_url="https://provider.example/v1", max_retries=0, http_client=httpx2.AsyncClient(transport=httpx2.MockTransport(handler))) as client:
        agent = Agent(name="consumer", model=OpenAIChatCompletionsModel("fixture", client), tools=[lookup])
        kwargs = {"previous_response_id": "resp_fixture"} if mode == "broken" else {"session": SQLiteSession("contract", db)}
        result = await Runner.run(agent, "Recall the colour" if mode == "resume" else "Remember the lookup colour", run_config=RunConfig(tracing_disabled=True), **kwargs)
        print(json.dumps({"pid":os.getpid(), "mode":mode, "requests":requests, "final":result.final_output}))

if len(sys.argv) > 1:
    asyncio.run(child(*sys.argv[1:]))
else:
    with tempfile.TemporaryDirectory() as td:
        db = str(Path(td)/"history.db")
        results = []
        for mode in ["broken", "persist", "resume"]:
            p = subprocess.run([sys.executable, __file__, mode, db], capture_output=True, text=True, check=True)
            results.append(json.loads(p.stdout))
        broken, persist, resume = results
        assert [m['role'] for m in broken['requests'][1]] == ['tool']
        assert [m['role'] for m in persist['requests'][1]] == ['user', 'assistant', 'tool']
        assert persist['pid'] != resume['pid']
        messages = resume['requests'][0]
        assert [m['role'] for m in messages] == ['user', 'assistant', 'tool', 'assistant', 'user']
        assert messages[1]['tool_calls'][0]['id'] == messages[2]['tool_call_id'] == 'call_fixture'
        assert messages[2]['content'] == 'blue'
        assert messages[0]['content'] == 'Remember the lookup colour'
        assert messages[-1]['content'] == 'Recall the colour'
        print(json.dumps({"results":results,"assertions":"PASS: broken reproduces; session restores matching tool history across two processes"}, indent=2))
