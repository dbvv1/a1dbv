#!/usr/bin/env bash
# 显式文件清单 → 仓库外暂存 → 人工审阅 → 显式提升；不读取默认用户目录。
set -euo pipefail
if ! command -v python3 >/dev/null 2>&1; then
  printf '%s\n' '错误：需要 Python 3；未写入任何导出文件。' >&2
  exit 2
fi
exec python3 "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/export_ai_config.py" "$@"
