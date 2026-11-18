#!/usr/bin/env python3
"""Two-turn Chat Completions consumer for the manual-history branch of the page.

Pinned SDK: openai-agents-python 64fbde5d02b42ae5f9db668eb0184cdb3fc9d775
(model version string is 0.24.0; openai 3.29.0; httpx2 2.14.0).

The page says: with ``OpenAIChatCompletionsModel`` and a full local history,
drop ``conversation_id``/``previous_response_id``, keep
``auto_previous_response_id=False``, do not attach a session, and feed the next
turn ``result.to_input_list()`` plus the new user message. Streaming runs must
consume ``result.stream_events()`` before reading history.

This script exercises exactly that with a ``httpx2.MockTransport``. It never
contacts a real API: every request body is captured in memory and answered with
a synthetic Chat Completions payload. Two scenarios run the same agent twice
each (round 1: user -> synthetic tool call -> synthetic tool result -> final
answer; round 2: full history + new user message):

  streaming      streaming turns through ``Runner.run_streamed``
  non-streaming  non-streaming turns through ``Runner.run``

Outputs are written as JSON under ``--out-dir`` (default ``captures`` next to
this file). The text is synthetic and contains no credentials or local paths.

Usage:
  PYTHONPATH=/path/to/openai-agents-python/src python consumer.py --out-dir captures
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path
from typing import Any

import httpx2
from openai import AsyncOpenAI

from agents import Agent, OpenAIChatCompletionsModel, RunConfig, Runner, function_tool

MODEL = "gpt-4.1-mock"
BASE_URL = "https://api.openai.com/v1"
MOCK_API_KEY = "sk-test-not-a-real-key"
CREATED = 1760000000

INITIAL_USER = "Find order 1234 and tell me its status."
NEW_USER = "Is there anything else I need to do for that order?"
TOOL_CALL_ID = "call_order_1234"
TOOL_NAME = "lookup_order"
TOOL_ARGUMENTS = '{"order_id":"1234"}'
TOOL_RESULT = "order 1234: shipped, arriving in 2 days"
ROUND1_ANSWER = "Order 1234 shipped and should arrive in 2 days."
ROUND2_ANSWER = "Nothing else is needed; the shipment is already on its way."


@function_tool
def lookup_order(order_id: str) -> str:
    """Return the synthetic fulfillment status for an order id."""
    return f"order {order_id}: shipped, arriving in 2 days"


def _stream_chunk(delta: dict[str, Any], finish_reason: str | None = None) -> dict[str, Any]:
    return {
        "id": "chatcmpl-mock-1",
        "object": "chat.completion.chunk",
        "created": CREATED,
        "model": MODEL,
        "choices": [{"index": 0, "delta": delta, "finish_reason": finish_reason}],
    }


def _usage_chunk() -> dict[str, Any]:
    return {
        "id": "chatcmpl-mock-1",
        "object": "chat.completion.chunk",
        "created": CREATED,
        "model": MODEL,
        "choices": [],
        "usage": {"prompt_tokens": 32, "completion_tokens": 12, "total_tokens": 44},
    }


def _tool_call_chunks() -> list[dict[str, Any]]:
    return [
        _stream_chunk(
            {
                "role": "assistant",
                "content": None,
                "tool_calls": [
                    {
                        "index": 0,
                        "id": TOOL_CALL_ID,
                        "type": "function",
                        "function": {"name": TOOL_NAME, "arguments": ""},
                    }
                ],
            }
        ),
        _stream_chunk(
            {
                "tool_calls": [
                    {"index": 0, "function": {"arguments": TOOL_ARGUMENTS}},
                ]
            }
        ),
        _stream_chunk({}, finish_reason="tool_calls"),
        _usage_chunk(),
    ]


def _text_chunks(text: str) -> list[dict[str, Any]]:
    return [
        _stream_chunk({"role": "assistant", "content": text}),
        _stream_chunk({}, finish_reason="stop"),
        _usage_chunk(),
    ]


def _sse(chunks: list[dict[str, Any]]) -> bytes:
    body = "".join(f"data: {json.dumps(chunk, separators=(',', ':'))}\n\n" for chunk in chunks)
    body += "data: [DONE]\n\n"
    return body.encode("utf-8")


def _chat_completion(message: dict[str, Any], finish_reason: str) -> dict[str, Any]:
    return {
        "id": "chatcmpl-mock-1",
        "object": "chat.completion",
        "created": CREATED,
        "model": MODEL,
        "choices": [
            {
                "index": 0,
                "message": message,
                "finish_reason": finish_reason,
                "logprobs": None,
            }
        ],
        "usage": {"prompt_tokens": 32, "completion_tokens": 12, "total_tokens": 44},
    }


class MockChatCompletions:
    """Deterministic three-request transcript (two requests in round 1, one in round 2)."""

    def __init__(self, *, stream: bool) -> None:
        self.stream = stream
        self.requests: list[dict[str, Any]] = []

    async def handler(self, request: httpx2.Request) -> httpx2.Response:
        body = json.loads(request.content.decode("utf-8"))
        self.requests.append(body)
        index = len(self.requests)

        if index == 1:
            payload = self._tool_call_payload()
        elif index == 2:
            payload = self._text_payload(ROUND1_ANSWER)
        elif index == 3:
            payload = self._text_payload(ROUND2_ANSWER)
        else:
            raise AssertionError(f"unexpected request #{index}")
        return payload

    def _tool_call_payload(self) -> httpx2.Response:
        tool_call = {
            "id": TOOL_CALL_ID,
            "type": "function",
            "function": {"name": TOOL_NAME, "arguments": TOOL_ARGUMENTS},
        }
        if self.stream:
            return httpx2.Response(
                200,
                headers={"content-type": "text/event-stream"},
                content=_sse(_tool_call_chunks()),
            )
        return httpx2.Response(
            200,
            json=_chat_completion(
                {"role": "assistant", "content": None, "tool_calls": [tool_call]},
                "tool_calls",
            ),
        )

    def _text_payload(self, text: str) -> httpx2.Response:
        if self.stream:
            return httpx2.Response(
                200,
                headers={"content-type": "text/event-stream"},
                content=_sse(_text_chunks(text)),
            )
        return httpx2.Response(
            200,
            json=_chat_completion({"role": "assistant", "content": text}, "stop"),
        )


def _sanitized_request(index: int, body: dict[str, Any]) -> dict[str, Any]:
    """Keep only the fields this reader test asserts on; no headers or URLs."""
    return {
        "index": index,
        "round": 1 if index <= 2 else 2,
        "model": body.get("model"),
        "stream": body.get("stream", False),
        "stream_field_present": "stream" in body,
        "store": body.get("store"),
        "stream_options": body.get("stream_options"),
        "has_tools": "tools" in body,
        "server_state_fields": {
            "previous_response_id": body.get("previous_response_id"),
            "conversation_id": body.get("conversation_id"),
        },
        "messages": body.get("messages", []),
    }


def _message_roles(body: dict[str, Any]) -> list[str]:
    return [message.get("role") for message in body.get("messages", [])]


def _find_messages(body: dict[str, Any], role: str) -> list[dict[str, Any]]:
    return [message for message in body.get("messages", []) if message.get("role") == role]


def _tool_messages(body: dict[str, Any]) -> list[dict[str, Any]]:
    return [message for message in body.get("messages", []) if message.get("role") == "tool"]


def _assistant_tool_calls(body: dict[str, Any]) -> list[dict[str, Any]]:
    calls: list[dict[str, Any]] = []
    for message in _find_messages(body, "assistant"):
        calls.extend(message.get("tool_calls") or [])
    return calls


def _assert_initial_request(body: dict[str, Any]) -> dict[str, bool]:
    users = _find_messages(body, "user")
    return {
        "request_has_one_user": len(users) == 1,
        "first_user_is_initial": bool(users) and users[0].get("content") == INITIAL_USER,
        "no_tool_messages_yet": len(_tool_messages(body)) == 0,
        "message_order": _message_roles(body) == ["system", "user"],
        "no_server_state": body.get("previous_response_id") is None
        and body.get("conversation_id") is None,
    }


def _assert_tool_result_request(body: dict[str, Any]) -> dict[str, bool]:
    users = _find_messages(body, "user")
    tool_calls = _assistant_tool_calls(body)
    tools = _tool_messages(body)
    call = tool_calls[0] if tool_calls else {}
    function = call.get("function") or {}
    tool = tools[0] if tools else {}
    return {
        "request_has_one_user": len(users) == 1,
        "first_user_is_initial": bool(users) and users[0].get("content") == INITIAL_USER,
        "message_order": _message_roles(body) == ["system", "user", "assistant", "tool"],
        "assistant_has_one_tool_call": len(tool_calls) == 1,
        "tool_call_id_matches": call.get("id") == TOOL_CALL_ID,
        "tool_call_name_matches": function.get("name") == TOOL_NAME,
        "tool_arguments_match": function.get("arguments") == TOOL_ARGUMENTS,
        "tool_message_id_matches": tool.get("tool_call_id") == TOOL_CALL_ID,
        "tool_message_value_matches": tool.get("content") == TOOL_RESULT,
        "no_server_state": body.get("previous_response_id") is None
        and body.get("conversation_id") is None,
    }


def _assert_round2_history_request(body: dict[str, Any]) -> dict[str, bool]:
    users = _find_messages(body, "user")
    tool_calls = _assistant_tool_calls(body)
    tools = _tool_messages(body)
    assistants = _find_messages(body, "assistant")
    final_assistant = assistants[-1] if assistants else {}
    return {
        "request_has_two_users": len(users) == 2,
        "initial_user_once": [m.get("content") for m in users].count(INITIAL_USER) == 1,
        "new_user_once_and_last": bool(users)
        and users[-1].get("content") == NEW_USER
        and [m.get("content") for m in users].count(NEW_USER) == 1,
        "assistant_tool_calls_kept_once": len(tool_calls) == 1
        and tool_calls[0].get("id") == TOOL_CALL_ID,
        "tool_result_kept_once": len(tools) == 1
        and tools[0].get("tool_call_id") == TOOL_CALL_ID
        and tools[0].get("content") == TOOL_RESULT,
        "previous_final_answer_kept": final_assistant.get("content") == ROUND1_ANSWER,
        "no_server_state": body.get("previous_response_id") is None
        and body.get("conversation_id") is None,
        "message_order": _message_roles(body)
        == ["system", "user", "assistant", "tool", "assistant", "user"],
    }


async def _run_turn(
    mode: str, agent: Agent[Any], input_items: Any, run_config: RunConfig
) -> dict[str, Any]:
    if mode == "streaming":
        result = Runner.run_streamed(agent, input_items, run_config=run_config)
        event_types: list[str] = []
        async for event in result.stream_events():
            event_types.append(event.type)
        # History and final output are read only after the stream is exhausted.
        output = {
            "event_types": event_types,
            "final_output": result.final_output,
            "last_response_id": result.last_response_id,
            "to_input_list": _jsonable(result.to_input_list()),
        }
        return output
    result = await Runner.run(agent, input_items, run_config=run_config)
    return {
        "event_types": [],
        "final_output": result.final_output,
        "last_response_id": result.last_response_id,
        "to_input_list": _jsonable(result.to_input_list()),
    }


def _jsonable(value: Any) -> Any:
    """Convert SDK item objects (pydantic / dataclasses) into plain JSON values."""
    return json.loads(json.dumps(value, default=_to_plain))


def _to_plain(obj: Any) -> Any:
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    if hasattr(obj, "to_dict"):
        return obj.to_dict()
    if hasattr(obj, "__dict__"):
        return {key: value for key, value in vars(obj).items() if not key.startswith("_")}
    return str(obj)


async def run_scenario(mode: str) -> dict[str, Any]:
    server = MockChatCompletions(stream=(mode == "streaming"))
    http_client = httpx2.AsyncClient(transport=httpx2.MockTransport(server.handler))
    client = AsyncOpenAI(
        api_key=MOCK_API_KEY,
        base_url=BASE_URL,
        http_client=http_client,
        max_retries=0,
    )
    model = OpenAIChatCompletionsModel(model=MODEL, openai_client=client)
    agent: Agent[Any] = Agent(
        name="Order status agent",
        instructions="Use the lookup_order tool whenever the user asks about an order.",
        tools=[lookup_order],
        model=model,
    )
    run_config = RunConfig(tracing_disabled=True)

    try:
        round1 = await _run_turn(mode, agent, INITIAL_USER, run_config)
        next_input = json.loads(json.dumps(round1["to_input_list"]))
        next_input.append({"role": "user", "content": NEW_USER})
        round2 = await _run_turn(mode, agent, next_input, run_config)
    finally:
        await client.close()
        await http_client.aclose()

    requests = server.requests
    if len(requests) != 3:
        raise AssertionError(f"expected 3 Chat Completions requests, got {len(requests)}")

    checks: dict[str, dict[str, bool]] = {
        "round1_request_1_initial": _assert_initial_request(requests[0]),
        "round1_request_2_tool_result": _assert_tool_result_request(requests[1]),
        "round2_request_full_history": _assert_round2_history_request(requests[2]),
    }

    all_ok = all(value for group in checks.values() for value in group.values())
    return {
        "mode": mode,
        "sdk": {
            "commit": "64fbde5d02b42ae5f9db668eb0184cdb3fc9d775",
            "package_version": "0.24.0",
        },
        "requests": [_sanitized_request(i + 1, body) for i, body in enumerate(requests)],
        "rounds": [
            {
                "label": "round 1 (initial user, synthetic tool call, tool return, final answer)",
                "final_output": round1["final_output"],
                "last_response_id": round1["last_response_id"],
                "event_types": round1["event_types"],
                "to_input_list": round1["to_input_list"],
            },
            {
                "label": "round 2 (to_input_list + new user message)",
                "final_output": round2["final_output"],
                "last_response_id": round2["last_response_id"],
                "event_types": round2["event_types"],
                "to_input_list": round2["to_input_list"],
            },
        ],
        "checks": checks,
        "all_checks_pass": all_ok,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--out-dir",
        default=str(Path(__file__).resolve().parent / "captures"),
        help="directory for streaming.json, nonstreaming.json and summary.json",
    )
    parser.add_argument(
        "--mode",
        choices=["streaming", "non-streaming", "both"],
        default="both",
        help="run one scenario or both (default: both)",
    )
    args = parser.parse_args(argv)

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    modes = ["streaming", "non-streaming"] if args.mode == "both" else [args.mode]

    results = []
    for mode in modes:
        result = asyncio.run(run_scenario(mode))
        filename = f"{mode.replace('-', '')}.json"
        (out_dir / filename).write_text(
            json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        results.append(result)
        print(
            f"{mode}: requests={len(result['requests'])} "
            f"last_response_id={result['rounds'][0]['last_response_id']!r} "
            f"checks_pass={result['all_checks_pass']}"
        )

    summary = {
        "sdk_commit": "64fbde5d02b42ae5f9db668eb0184cdb3fc9d775",
        "modes": [
            {
                "mode": result["mode"],
                "all_checks_pass": result["all_checks_pass"],
                "round1_last_response_id": result["rounds"][0]["last_response_id"],
                "round2_last_response_id": result["rounds"][1]["last_response_id"],
                "request_count": len(result["requests"]),
                "failed_checks": [
                    f"{group}.{name}"
                    for group, checks in result["checks"].items()
                    for name, ok in checks.items()
                    if not ok
                ],
            }
            for result in results
        ],
    }
    if len(results) == 2:
        streaming, non_streaming = results
        summary["comparison"] = {
            "messages_identical_per_request": all(
                streaming["requests"][index]["messages"]
                == non_streaming["requests"][index]["messages"]
                for index in range(len(streaming["requests"]))
            ),
            "streaming_request_stream_field": [
                request["stream"] for request in streaming["requests"]
            ],
            "non_streaming_request_stream_field": [
                request["stream"] for request in non_streaming["requests"]
            ],
            "non_streaming_stream_field_present": [
                request["stream_field_present"] for request in non_streaming["requests"]
            ],
            "round1_last_response_id": {
                "streaming": streaming["rounds"][0]["last_response_id"],
                "non_streaming": non_streaming["rounds"][0]["last_response_id"],
            },
            "round2_last_response_id": {
                "streaming": streaming["rounds"][1]["last_response_id"],
                "non_streaming": non_streaming["rounds"][1]["last_response_id"],
            },
            "server_state_fields_all_none": all(
                request["server_state_fields"]["previous_response_id"] is None
                and request["server_state_fields"]["conversation_id"] is None
                for result in results
                for request in result["requests"]
            ),
        }
    (out_dir / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return 0 if all(result["all_checks_pass"] for result in results) else 1


if __name__ == "__main__":
    sys.exit(main())
