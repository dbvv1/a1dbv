#!/usr/bin/env bash
# Rerun the two-turn Chat Completions consumer for
# A-CONTEXT-CHAT-STREAM-READER-20261114.
#
# The recorded run used Python 3.13.5 on Windows 11 with the dependency set
# below. The pinned SDK is source only: install it from the fixed commit, then
# pin the three packages that the SDK's uv.lock pins at that commit.
#
# Setup (once):
#   python -m venv .venv
#   . .venv/bin/activate            # Windows Git Bash: . .venv/Scripts/activate
#   python -m pip install \
#     "openai-agents @ git+https://github.com/openai/openai-agents-python@64fbde5d02b42ae5f9db668eb0184cdb3fc9d775"
#   python -m pip install "openai==3.29.0" "httpx2==2.14.0" "pydantic==2.14.2"
#
# If an editable install of the pinned checkout is not possible on the host,
# put its src/ directory on PYTHONPATH instead:
#   export SDK_SRC=/path/to/openai-agents-python/src
#   PYTHONPATH="$SDK_SRC" python consumer.py --out-dir captures
#
# The script contacts no network endpoint: httpx2.MockTransport answers every
# Chat Completions request. It writes captures/streaming.json,
# captures/nonstreaming.json and captures/summary.json and exits non-zero if
# any assertion fails.

set -euo pipefail
cd "$(dirname "$0")"

python_bin="${PYTHON:-python}"
if [[ -n "${SDK_SRC:-}" ]]; then
  PYTHONPATH="$SDK_SRC" "$python_bin" consumer.py --out-dir captures
else
  "$python_bin" consumer.py --out-dir captures
fi
