"""Offline consumer probe for microsoft/agent-framework#9454.

Use real Agent/function-loop code, scripted model responses, and an in-memory
proxy recorder. This does not contact a model, network service, or real user data.
"""

import asyncio
import hashlib
import importlib.metadata
import json
import platform
import warnings
from pathlib import Path

import agent_framework
from agent_framework import (
    Agent,
    BaseChatClient,
    ChatMiddlewareLayer,
    ChatResponse,
    ChatResponseUpdate,
    Content,
    FunctionInvocationContext,
    FunctionInvocationLayer,
    FunctionMiddleware,
    Message,
    ResponseStream,
    tool,
)


def require_context_call_id(context):
    """Check metadata presence, not provider provenance (see README)."""
    value = context.metadata.get("call_id")
    if not isinstance(value, str) or not value:
        raise RuntimeError("No context call_id: do not dispatch")
    return value


class PassThrough(FunctionMiddleware):
    async def process(self, context, call_next):
        await call_next()


class PairClient(FunctionInvocationLayer, ChatMiddlewareLayer, BaseChatClient):
    """Two identical tool calls, then inspect what the real loop sends back."""

    def __init__(self, provider_ids=("call-a", "call-b"), **kwargs):
        super().__init__(**kwargs)
        self.provider_ids = provider_ids
        self.requests = 0
        self.returned = []

    def next_turn(self, messages):
        self.requests += 1
        if self.requests == 1:
            return [
                Content.from_function_call(cid, "lookup", arguments={"q": "same"})
                for cid in self.provider_ids
            ], "tool_calls"
        assert self.requests == 2, "Unexpected extra model iteration"
        self.returned = [
            {"call_id": item.call_id, "result": item.result}
            for msg in messages
            for item in msg.contents
            if item.type == "function_result"
        ]
        return [Content.from_text("done")], "stop"

    def _inner_get_response(self, *, messages, stream, options, **kwargs):
        if stream:

            async def updates():
                await self._validate_options(options)
                contents, reason = self.next_turn(messages)
                yield ChatResponseUpdate(
                    role="assistant", contents=contents, finish_reason=reason
                )

            return ResponseStream(updates(), finalizer=ChatResponse.from_updates)

        async def response():
            await self._validate_options(options)
            contents, reason = self.next_turn(messages)
            return ChatResponse(
                messages=[Message("assistant", contents)], finish_reason=reason
            )

        return response()


async def check_pair(scope, stream):
    dispatches, completions = [], []
    second_finished = asyncio.Event()

    @tool(name="lookup", description="Look up a value in the synthetic proxy")
    async def lookup(context: FunctionInvocationContext, q: str) -> str:
        # Entry ordinal only schedules reversed completion and labels receipts.
        # It is deliberately NOT used to infer a provider call id.
        ordinal = len(dispatches) + 1
        cid = context.metadata.get("call_id")
        if scope != "none":
            cid = require_context_call_id(context)
        receipt = f"receipt-{ordinal}"
        dispatches.append({"call_id": cid, "q": q, "receipt": receipt})
        if ordinal == 1:
            await asyncio.wait_for(second_finished.wait(), timeout=5)
        completions.append(receipt)
        if ordinal == 2:
            second_finished.set()
        return receipt

    client = PairClient(
        **({"middleware": [PassThrough()]} if scope == "client" else {})
    )
    agent = Agent(
        client,
        "Use the synthetic lookup tool.",
        tools=[lookup],
        **({"middleware": [PassThrough()]} if scope == "agent" else {}),
    )
    schema = lookup.parameters()
    assert set(schema["properties"]) == {"q"}, schema
    assert schema["required"] == ["q"], schema
    if stream:
        async for _ in agent.run("go", stream=True):
            pass
    else:
        await agent.run("go")
    assert client.requests == 2
    assert len(dispatches) == len(client.returned) == 2
    assert completions == ["receipt-2", "receipt-1"], completions
    assert [d["q"] for d in dispatches] == ["same", "same"]
    assert sorted(r["call_id"] for r in client.returned) == ["call-a", "call-b"]
    assert sorted(r["result"] for r in client.returned) == ["receipt-1", "receipt-2"]
    external_ids = [d["call_id"] for d in dispatches]
    if scope == "none":
        assert external_ids == [None, None], external_ids
    else:
        assert sorted(external_ids) == ["call-a", "call-b"], external_ids
        assert {d["call_id"]: d["receipt"] for d in dispatches} == {
            r["call_id"]: r["result"] for r in client.returned
        }
    return {
        "middleware_scope": scope,
        "stream": stream,
        "schema_properties": sorted(schema["properties"]),
        "dispatches": dispatches,
        "completion_order": completions,
        "next_model_request_results": client.returned,
        "assertions": "passed",
    }


async def check_guarded_dispatch(scope):
    dispatched = []

    @tool(name="lookup", description="Refuse dispatch without a context call ID")
    def guarded_lookup(context: FunctionInvocationContext, q: str) -> str:
        cid = require_context_call_id(context)
        dispatched.append({"call_id": cid, "q": q})
        return f"accepted:{cid}"

    client = PairClient()
    agent = Agent(
        client,
        "Use the synthetic lookup tool.",
        tools=[guarded_lookup],
        **({"middleware": [PassThrough()]} if scope == "agent" else {}),
    )
    await agent.run("go")
    assert client.requests == 2
    assert sorted(r["call_id"] for r in client.returned) == ["call-a", "call-b"]
    if scope == "none":
        assert dispatched == [], dispatched
        assert all(r["result"] == "Error: Function failed." for r in client.returned)
    else:
        assert sorted(d["call_id"] for d in dispatched) == ["call-a", "call-b"]
        assert all(r["result"] == f"accepted:{r['call_id']}" for r in client.returned)
    return {
        "middleware_scope": scope,
        "dispatches": dispatched,
        "next_model_request_results": client.returned,
        "assertions": "passed",
    }


async def check_empty_provider_ids():
    observed = []

    @tool(name="lookup", description="Observe generated fallback correlation")
    def lookup(context: FunctionInvocationContext, q: str) -> str:
        cid = require_context_call_id(context)
        observed.append((cid, context.metadata.get("function_call_occurrence_id")))
        return "synthetic only"

    client = PairClient(provider_ids=("", ""))
    agent = Agent(client, tools=[lookup], middleware=[PassThrough()])
    with warnings.catch_warnings(record=True) as captured:
        warnings.simplefilter("always", FutureWarning)
        await agent.run("go")
    assert len(observed) == 2
    assert all(cid and cid == occurrence for cid, occurrence in observed)
    fallback_warnings = [
        w
        for w in captured
        if w.category is FutureWarning and "empty call_id" in str(w.message)
    ]
    assert len(fallback_warnings) == 2
    assert len({cid for cid, _ in observed}) == 2
    return {
        "raw_provider_ids": ["", ""],
        "nonempty_metadata_guard_accepted": len(observed),
        "metadata_ids_equal_generated_occurrence_ids": True,
        "fallback_warnings": len(fallback_warnings),
        "assertions": "passed",
    }


async def check_manual_invoke():
    observed = []

    @tool(name="manual", description="Observe direct invocation context")
    def manual(context: FunctionInvocationContext, q: str) -> str:
        observed.append(context.metadata.get("call_id"))
        return q

    await manual.invoke(arguments={"q": "same"}, tool_call_id="call-manual")
    assert observed == [None], observed
    # No external action occurs after the guard rejects missing/invalid IDs.
    rejected = 0
    for metadata in ({}, {"call_id": None}, {"call_id": ""}, {"call_id": 1}):
        context = FunctionInvocationContext(
            function=manual, arguments={}, metadata=metadata
        )
        try:
            require_context_call_id(context)
        except RuntimeError:
            rejected += 1
        else:
            raise AssertionError("Invalid call_id was accepted")
    valid = FunctionInvocationContext(
        function=manual, arguments={}, metadata={"call_id": "call-valid"}
    )
    assert require_context_call_id(valid) == "call-valid"
    return {
        "invoke_tool_call_id_visible": observed[0],
        "invalid_ids_rejected": rejected,
    }


async def main():
    root = Path(agent_framework.__file__).parent
    rows = [
        await check_pair(scope, stream)
        for stream in (False, True)
        for scope in ("none", "client", "agent")
    ]
    output = {
        "python": platform.python_version(),
        "platform": platform.system(),
        "installed_distribution_version": importlib.metadata.version(
            "agent-framework-core"
        ),
        "imported_source_sha256": {
            name: hashlib.sha256((root / name).read_bytes()).hexdigest()
            for name in ("_tools.py", "_middleware.py", "_clients.py", "_types.py")
        },
        "pair_scenarios": rows,
        "guarded_dispatch_scenarios": [
            await check_guarded_dispatch(scope) for scope in ("none", "agent")
        ],
        "empty_provider_id_counterexample": await check_empty_provider_ids(),
        "manual_and_guard": await check_manual_invoke(),
        "all_assertions": "passed",
    }
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
