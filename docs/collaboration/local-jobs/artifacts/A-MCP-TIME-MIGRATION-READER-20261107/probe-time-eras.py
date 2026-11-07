#!/usr/bin/env python3
"""Probe a time MCP server over real stdio in two pinned protocol eras.

The probe starts the server as a child process with `python -m mcp_server_time`
and talks JSON-RPC over its stdin/stdout. It never uses the in-process memory
transport and never calls a handler directly.

Usage:
  python probe-time-eras.py --project-root /path/to/src/time [--json-out FILE]

`--project-root` is the directory holding `src/mcp_server_time`. The server's
distribution metadata (`mcp-server-time`) must already be importable, and the
`mcp` SDK must be importable by the interpreter running this script; the same
PYTHONPATH is inherited by the child process.

Output is one JSON document on stdout with, per pinned era, the negotiated
protocol version, tool list, convert_time values, failure paths, ping and
resources/list outcomes, plus a fresh-connection check.
"""

import argparse
import asyncio
import json
import os
import sys
from typing import Any

from mcp import Client
from mcp.client.stdio import StdioServerParameters
from mcp.shared.exceptions import MCPError

MODERN = "2026-07-28"
LEGACY = "2025-11-25"  # the version a `legacy` client negotiates
ERAS = [("legacy", "legacy"), ("modern", MODERN)]
TIMEOUT = 45.0


def text_of(result: Any) -> str:
    blocks = getattr(result, "content", None) or []
    return "".join(
        getattr(b, "text", "") for b in blocks if getattr(b, "type", None) == "text"
    )


def err_fields(exc: BaseException) -> dict[str, Any]:
    out: dict[str, Any] = {"exception": type(exc).__name__, "message": str(exc)[:500]}
    err = getattr(exc, "error", None)
    if err is not None:
        out["jsonrpc_code"] = getattr(err, "code", None)
        out["jsonrpc_message"] = getattr(err, "message", None)
    subs = list(getattr(exc, "exceptions", ()) or ())
    if subs:
        out["sub_exceptions"] = [err_fields(s) for s in subs]
    return out


async def call(client: Client, name: str, args: dict[str, Any]) -> dict[str, Any]:
    try:
        result = await client.call_tool(name, args)
        return {
            "is_error": result.is_error,
            "result_type": getattr(result, "result_type", None),
            "text": text_of(result),
        }
    except Exception as exc:  # noqa: BLE001 - the probe records the failure shape
        return {"raised": err_fields(exc)}


async def probe_era(
    label: str, mode: str, command: str, args: list[str], env: dict[str, str]
) -> dict[str, Any]:
    out: dict[str, Any] = {"client_mode": mode, "ok": False, "steps": {}}
    params = StdioServerParameters(command=command, args=args, env=env)
    try:
        async with Client(params, mode=mode, read_timeout_seconds=20) as client:
            out["negotiated_version"] = client.session.protocol_version
            try:
                tools = await client.list_tools()
                out["steps"]["tools"] = [t.name for t in tools.tools]
                out["steps"]["tools_wire"] = [
                    t.model_dump(by_alias=True, mode="json", exclude_none=True)
                    for t in tools.tools
                ]
            except Exception as exc:  # noqa: BLE001 - baseline must report why it refused
                out["steps"]["tools"] = {"raised": err_fields(exc)}
            out["steps"]["convert"] = await call(
                client,
                "convert_time",
                {
                    "source_timezone": "UTC",
                    "time": "12:00",
                    "target_timezone": "Etc/GMT-5",
                },
            )
            out["steps"]["invalid_timezone"] = await call(
                client, "get_current_time", {"timezone": "Nope/Nowhere"}
            )
            out["steps"]["missing_argument"] = await call(
                client, "convert_time", {"source_timezone": "UTC", "time": "12:00"}
            )
            out["steps"]["unknown_tool"] = await call(client, "no_such_tool", {})
            try:
                await client.session.send_ping()
                out["steps"]["ping"] = {"ok": True}
            except MCPError as exc:
                out["steps"]["ping"] = {"ok": False, **err_fields(exc)}
            try:
                await client.list_resources()
                out["steps"]["resources_list"] = {"ok": True}
            except MCPError as exc:
                out["steps"]["resources_list"] = {"ok": False, **err_fields(exc)}
            out["ok"] = isinstance(out["steps"].get("tools"), list)
    except Exception as exc:  # noqa: BLE001 - pin which era the baseline refuses
        out["connection_error"] = err_fields(exc)
    return out


async def probe_reconnect(
    command: str, args: list[str], env: dict[str, str], cwd: str
) -> dict[str, Any]:
    """Close one connection, then open a fresh one and list tools again."""
    params = StdioServerParameters(command=command, args=args, env=env, cwd=cwd)
    out: dict[str, Any] = {}
    for mode in ("legacy", MODERN):
        try:
            async with Client(params, mode=mode, read_timeout_seconds=20) as client:
                tools = await client.list_tools()
                out[mode] = {
                    "ok": True,
                    "tools": [t.name for t in tools.tools],
                    "protocol_version": client.session.protocol_version,
                }
        except Exception as exc:  # noqa: BLE001
            out[mode] = {"ok": False, **err_fields(exc)}
    return out


def raw_discover(
    command: str, args: list[str], env: dict[str, str], cwd: str
) -> dict[str, Any]:
    """Send one raw `server/discover` line and read the raw JSON-RPC answer.

    This bypasses the SDK client model, so the fields the 2026-07-28 spec
    requires on a result (`resultType`, `ttlMs`, `cacheScope`) are pinned as
    the server sends them.
    """
    import subprocess

    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "server/discover",
        "params": {
            "_meta": {
                "io.modelcontextprotocol/protocolVersion": MODERN,
                "io.modelcontextprotocol/clientInfo": {"name": "probe", "version": "0"},
                "io.modelcontextprotocol/clientCapabilities": {},
            }
        },
    }
    proc = subprocess.Popen(
        [command] + args,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        env=env,
        cwd=cwd,
    )
    try:
        out, err = proc.communicate(json.dumps(payload) + "\n", timeout=20)
    except subprocess.TimeoutExpired:
        proc.kill()
        out, err = proc.communicate()
        return {"ok": False, "error": "timeout", "stdout": out[-500:]}
    lines = [line for line in out.splitlines() if line.strip()]
    if not lines:
        return {"ok": False, "error": "no response", "stderr": err[-500:]}
    try:
        response = json.loads(lines[0])
    except ValueError:
        return {"ok": False, "error": "non-JSON response", "stdout": lines[0][:500]}
    return {"ok": True, "process_returncode": proc.returncode, "response": response}


async def main_async(args: argparse.Namespace) -> dict[str, Any]:
    project_root = os.path.abspath(args.project_root)
    env = dict(os.environ)
    src = os.path.join(project_root, "src")
    env["PYTHONPATH"] = src + (os.pathsep + env["PYTHONPATH"] if env.get("PYTHONPATH") else "")
    env["PYTHONIOENCODING"] = "utf-8"
    command = args.python
    child_args = ["-m", "mcp_server_time", "--local-timezone", "UTC"]

    import importlib.metadata as md

    report: dict[str, Any] = {
        "python": sys.version.split()[0],
        "interpreter": os.path.basename(sys.executable),
        "mcp_version": md.version("mcp"),
        "child_command": [os.path.basename(command)] + child_args,
        "eras": {},
        "reconnect": None,
        "raw_discover": None,
    }
    for label, mode in ERAS:
        report["eras"][label] = await asyncio.wait_for(
            probe_era(label, mode, command, child_args, env), TIMEOUT
        )
    report["reconnect"] = await asyncio.wait_for(
        probe_reconnect(command, child_args, env, project_root), TIMEOUT * 2
    )
    report["raw_discover"] = await asyncio.to_thread(
        raw_discover, command, child_args, env, project_root
    )
    report["summary"] = summarize(report)
    report["exit_code"] = 0 if report["summary"]["all_ok"] else 1
    return report


def summarize(report: dict[str, Any]) -> dict[str, Any]:
    eras = report["eras"]
    modern = eras.get("modern", {})
    legacy = eras.get("legacy", {})
    convert = (
        modern.get("steps", {}).get("convert", {})
        if modern.get("ok")
        else {}
    )
    try:
        data = json.loads(convert.get("text", ""))
    except Exception:  # noqa: BLE001
        data = {}
    reconnect = report.get("reconnect") or {}
    checks = {
        "modern_era_served": bool(modern.get("ok"))
        and modern.get("negotiated_version") == MODERN,
        "legacy_era_served": bool(legacy.get("ok"))
        and legacy.get("negotiated_version") == LEGACY,
        "convert_17_00_plus5": data.get("target", {}).get("datetime", "").endswith(
            "T17:00:00+05:00"
        )
        and data.get("time_difference") == "+5.0h",
        "invalid_timezone_is_error": modern.get("steps", {})
        .get("invalid_timezone", {})
        .get("is_error")
        is True,
        "missing_argument_is_error": modern.get("steps", {})
        .get("missing_argument", {})
        .get("is_error")
        is True,
        "ping_legacy_only": legacy.get("steps", {}).get("ping", {}).get("ok") is True
        and modern.get("steps", {}).get("ping", {}).get("ok") is False,
        "tools_identical_across_eras": legacy.get("steps", {}).get("tools_wire")
        == modern.get("steps", {}).get("tools_wire")
        and bool(modern.get("steps", {}).get("tools_wire")),
        "reconnect_works": bool(reconnect.get("legacy", {}).get("ok"))
        and bool(reconnect.get(MODERN, {}).get("ok")),
        "raw_discover_answers_modern": raw_discover_ok(report.get("raw_discover")),
    }
    return {"checks": checks, "all_ok": all(checks.values())}


def raw_discover_ok(raw: Any) -> bool:
    if not isinstance(raw, dict) or not raw.get("ok"):
        return False
    result = (raw.get("response") or {}).get("result") or {}
    return (
        result.get("supportedVersions") == [MODERN]
        and result.get("resultType") == "complete"
        and result.get("ttlMs") == 0
        and result.get("cacheScope") == "private"
        and result.get("capabilities", {}).get("tools", {}).get("listChanged") is False
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project-root", required=True)
    parser.add_argument("--python", default=sys.executable)
    parser.add_argument("--json-out")
    args = parser.parse_args()
    report = asyncio.run(main_async(args))
    text = json.dumps(report, indent=2, ensure_ascii=False, sort_keys=True)
    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as fh:
            fh.write(text + "\n")
    print(text)
    return report["exit_code"]


if __name__ == "__main__":
    raise SystemExit(main())
