"""Replay the actual Hermes adapter against two pinned SDK contracts, without network IO."""

import argparse
from contextlib import ExitStack
import hashlib
import json
import os
from pathlib import Path
import socket
import subprocess
import sys
import tempfile
from unittest.mock import patch

REVISION = "fe53d0152d1c37f36d44970b094cfb0e7305c2e5"
HASHES = {
  "agent/anthropic_adapter.py": "2ab888cbf50a190d09f85a395755b25e8cbbbd98a333360cee50457ec678a6e5",
  "agent/anthropic_message_convert.py": "141c5aae18d9d20647910b24cf0a19e2e3c767b03e9d355ab9c6b6cbd011dd4e",
}


def exercise(root):
  import anthropic
  if anthropic.__version__ == "0.125.0":
    import httpx as wire
  elif anthropic.__version__ == "2.3.0":
    import httpx2 as wire
  else:
    raise ValueError("Use the pinned old/new requirements; unsupported SDK version")
  sys.path.insert(0, str(root))
  with ExitStack() as stack:
    # These are test guards, not an OS sandbox. Every HTTP request uses MockTransport.
    guards = [stack.enter_context(patch.object(socket.socket, name,
      side_effect=AssertionError("Network/socket operations are outside this trial")))
      for name in ("connect", "connect_ex", "bind", "listen")]
    from agent import anthropic_adapter as adapter
    adapter._anthropic_sdk = anthropic  # Already installed; never invoke PM lazy installation.
    result = {"sdk": anthropic.__version__, "hermes": REVISION, "stages": {}}
    try:
      client = adapter.build_anthropic_client("synthetic-migration-key", timeout=10)
      client.close()
      result["stages"]["full_builder"] = {"constructed": True}
    except TypeError as error:
      result["stages"]["full_builder"] = {"constructed": False, "error": str(error)}

    seen = []
    def capture(request):
      body = json.loads(request.content)
      seen.append({"x_api_key": bool(request.headers.get("x-api-key")),
        "authorization": bool(request.headers.get("authorization")),
        "api_version": request.headers.get("anthropic-version"),
        "body_keys": sorted(body)})
      return wire.Response(200, json={"id": "msg_synthetic", "type": "message",
        "role": "assistant", "model": body["model"],
        "content": [{"type": "text", "text": "synthetic transport response"}],
        "stop_reason": "end_turn", "stop_sequence": None,
        "usage": {"input_tokens": 1, "output_tokens": 1}})

    def call(client, params):
      before = len(seen)
      try:
        response = adapter.create_anthropic_message(client, dict(params), prefer_stream=False)
      except TypeError as error:
        return {"transport_calls": len(seen) - before, "error": str(error)}
      assert response.content[0].text == "synthetic transport response"
      assert len(seen) == before + 1
      return {"transport_calls": 1, "request": seen[-1]}

    params = adapter.build_anthropic_kwargs("claude-sonnet-4-5",
      [{"role": "user", "content": "Synthetic migration check"}], None, 8192,
      {"enabled": True, "effort": "low"})
    clean = {key: value for key, value in params.items() if key not in ("temperature", "top_p", "top_k")}
    assert params["temperature"] == 1 and "temperature" not in clean
    for maker in ("sdk", "hermes"):
      http = anthropic.DefaultHttpxClient(transport=wire.MockTransport(capture), trust_env=False)
      kwargs = {"api_key": "synthetic-migration-key", "base_url": "https://gateway.invalid/anthropic",
        "http_client": http, "max_retries": 0}
      client = (anthropic.Anthropic(**kwargs) if maker == "sdk"
        else adapter._new_sdk_client(anthropic, kwargs, {}))
      try:
        result["stages"][maker + "_original_payload"] = call(client, params)
        result["stages"][maker + "_without_sampling"] = call(client, clean)
        # Repeat with the real SDK's copy constructor: legacy Omit survives copy too.
        copied = client.with_options()
        try:
          result["stages"][maker + "_copied_without_sampling"] = call(copied, clean)
        finally:
          copied.close()
      finally:
        client.close()

    # Positive control from the vendor migration guide: explicit API-key wire mapping.
    # It is NOT a patch to Hermes or proof that its other provider paths migrated.
    def send_x_api_key(request):
      if request.headers.get("Authorization") == "Bearer synthetic-migration-key":
        del request.headers["Authorization"]
        request.headers["X-Api-Key"] = "synthetic-migration-key"
      return request
    http = anthropic.DefaultHttpxClient(transport=wire.MockTransport(capture),
      trust_env=False, auth=send_x_api_key)
    with anthropic.Anthropic(api_key="synthetic-migration-key", max_retries=0,
      http_client=http, base_url="https://gateway.invalid/anthropic") as client:
      result["stages"]["explicit_key_header_control"] = call(client, clean)

    # A real token-style Hermes constructor is an unaffected contrast; no OAuth lookup.
    http = anthropic.DefaultHttpxClient(transport=wire.MockTransport(capture), trust_env=False)
    client = adapter._new_sdk_client(anthropic, {"auth_token": "synthetic-token",
      "base_url": "https://gateway.invalid/anthropic", "http_client": http, "max_retries": 0}, {})
    try:
      result["stages"]["token_header_control"] = call(client, clean)
    finally:
      client.close()
    assert all(guard.call_count == 0 for guard in guards)
    result["network_socket_calls"] = 0
    return result


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument("hermes", type=Path)
  args = parser.parse_args()
  root = args.hermes.resolve()
  for name, expected in HASHES.items():
    if hashlib.sha256((root / name).read_bytes()).hexdigest() != expected:
      parser.error(f"{name}: differs from pinned Hermes source")
  def git(*args):
    return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()
  if git("rev-parse", "HEAD") != REVISION or git("status", "--porcelain", "--untracked-files=no"):
    parser.error("Use a clean checkout of the pinned Hermes revision")
  # The child process uses only synthetic state; never load the operator's config/keys.
  path = os.environ.get("PATH", "")
  os.environ.clear()
  with tempfile.TemporaryDirectory(prefix="sdk-contract-") as home:
    os.environ.update({"PATH": path, "HOME": home, "HERMES_HOME": str(Path(home) / "hermes"),
      "HERMES_RUNTIME_DIR": str(Path(home) / "runtime"), "TZ": "UTC"})
    result = exercise(root)
  print(json.dumps(result, indent=2))
  stages = result["stages"]
  control = stages["explicit_key_header_control"]["request"]
  assert control["x_api_key"] and not control["authorization"]
  token = stages["token_header_control"]["request"]
  assert token["authorization"] and not token["x_api_key"]
  original = stages["hermes_original_payload"]
  routed = stages["hermes_without_sampling"].get("request", {})
  ready = stages["full_builder"]["constructed"] and "error" not in original and routed.get("x_api_key")
  if not ready:
    raise SystemExit("NOT READY: the unchanged adapter does not satisfy its SDK/client/request contract")


if __name__ == "__main__":
  main()
