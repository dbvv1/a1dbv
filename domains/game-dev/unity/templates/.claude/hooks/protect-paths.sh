#!/usr/bin/env bash
# PreToolUse Hook：按 .claude/protected-paths.txt 中的规则拦截文件编辑。
#
# 规则文件格式（每行一条，# 开头为注释）：
#   <deny|ask> <glob> [原因]
#   deny  dist/*          构建产物，请修改源文件
#   ask   *.lock          锁文件通常由包管理器生成
# glob 相对项目根目录，用 bash 模式匹配；* 可以跨目录匹配。按顺序匹配，第一条命中的规则生效。
#
# 依赖：jq 或 python3（二选一），用于解析 Hook 输入的 JSON。

set -uo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
RULES="${PROTECTED_PATHS_FILE:-$ROOT/.claude/protected-paths.txt}"
[ -f "$RULES" ] || exit 0

input="$(cat)"

json_get() {
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$input" | jq -r "$1 // empty"
  elif command -v python3 >/dev/null 2>&1; then
    printf '%s' "$input" | python3 -c '
import json, sys
data = json.load(sys.stdin)
for key in sys.argv[1].lstrip(".").split("."):
    data = data.get(key) if isinstance(data, dict) else None
print("" if data is None else data)
' "$1"
  else
    echo "protect-paths: 需要 jq 或 python3" >&2
    exit 1  # 非阻塞错误：走正常权限流程
  fi
}

decide() {
  # $1 = deny|ask，$2 = 原因
  local reason="${2//\\/\\\\}"
  reason="${reason//\"/\\\"}"
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"%s","permissionDecisionReason":"%s"}}\n' "$1" "$reason"
  exit 0
}

file_path="$(json_get .tool_input.file_path)"
[ -z "$file_path" ] && file_path="$(json_get .tool_input.notebook_path)"
[ -z "$file_path" ] && exit 0

# 统一为正斜杠，转成相对项目根目录的路径
path="${file_path//\\//}"
root="${ROOT//\\//}"
rel="${path#"$root"/}"

while IFS= read -r line || [ -n "$line" ]; do
  line="${line%$'\r'}"
  case "$line" in ''|'#'*) continue ;; esac
  read -r action glob reason <<<"$line"
  case "$action" in deny|ask) ;; *) continue ;; esac
  # shellcheck disable=SC2053  # 有意使用 glob 匹配
  if [[ "$rel" == $glob ]]; then
    decide "$action" "${reason:-$rel 受保护（规则：$action $glob）}"
  fi
done < "$RULES"

exit 0
