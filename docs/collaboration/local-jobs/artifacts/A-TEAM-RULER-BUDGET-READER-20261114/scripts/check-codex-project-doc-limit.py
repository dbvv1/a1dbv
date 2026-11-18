#!/usr/bin/env python3
"""Report how much of a generated AGENTS.md Codex actually sees offline.

Runs `codex debug prompt-input` with a throwaway CODEX_HOME, extracts the
model-visible project instructions, and reports the byte cutoff plus which
section markers survived. It never calls a model or a network service.

Usage:
  python scripts/check-codex-project-doc-limit.py --project-root <dir>
  python scripts/check-codex-project-doc-limit.py --project-root <dir> \
      --marker-template "# Rules for part {n}" --parts 6

Output is JSON on stdout. Absolute paths are not included in the report.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

INSTRUCTIONS_OPEN = "<INSTRUCTIONS>\n"
INSTRUCTIONS_CLOSE = "\n</INSTRUCTIONS>"


def extract_instructions(prompt_items: list[dict]) -> str:
    for item in prompt_items:
        content = item.get("content")
        if not isinstance(content, list):
            continue
        for block in content:
            text = block.get("text") if isinstance(block, dict) else None
            if not isinstance(text, str):
                continue
            start = text.find(INSTRUCTIONS_OPEN)
            end = text.rfind(INSTRUCTIONS_CLOSE)
            if start != -1 and end != -1 and end > start:
                return text[start + len(INSTRUCTIONS_OPEN) : end]
    raise ValueError("no project instructions found in prompt input")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project-root", required=True)
    parser.add_argument("--marker-template", default="# Rules for part {n}")
    parser.add_argument("--parts", type=int, default=6)
    parser.add_argument("--codex", default="codex")
    args = parser.parse_args()

    project_root = Path(args.project_root).resolve()
    generated_path = project_root / "AGENTS.md"
    if not generated_path.is_file():
        print(
            json.dumps(
                {"error": "AGENTS.md not found in project root"},
                ensure_ascii=False,
            )
        )
        return 1

    env = os.environ.copy()
    with tempfile.TemporaryDirectory(prefix="codex-offline-home-") as codex_home:
        env["CODEX_HOME"] = codex_home
        completed = subprocess.run(
            [args.codex, "debug", "prompt-input", "project-doc-limit-check"],
            cwd=str(project_root),
            env=env,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        if completed.returncode != 0:
            detail = (completed.stderr or "").replace(str(project_root), "<project>")
            detail = detail.replace(codex_home, "<codex-home>").strip()
            print(
                json.dumps(
                    {
                        "error": "codex debug prompt-input failed",
                        "exit_code": completed.returncode,
                        "detail": detail[-400:],
                    },
                    ensure_ascii=False,
                )
            )
            return 1

    try:
        prompt_items = json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        print(json.dumps({"error": f"invalid prompt JSON: {exc}"}))
        return 1

    try:
        visible = extract_instructions(prompt_items)
    except ValueError as exc:
        print(json.dumps({"error": str(exc)}))
        return 1

    generated_bytes = generated_path.stat().st_size
    visible_bytes = len(visible.encode("utf-8"))
    markers = {
        f"part{n}": (args.marker_template.format(n=n) in visible)
        for n in range(1, args.parts + 1)
    }
    print(
        json.dumps(
            {
                "generated_agents_md_bytes": generated_bytes,
                "codex_visible_instructions_bytes": visible_bytes,
                "truncated": visible_bytes < generated_bytes,
                "markers": markers,
                "cutoff_tail": visible[-80:],
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())