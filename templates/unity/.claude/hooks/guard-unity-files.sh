#!/usr/bin/env bash
# PreToolUse Hook：拦截对 Unity 生成目录、.meta、场景/Prefab 等的危险编辑。
#   - 生成目录 / .meta           → deny（直接阻止）
#   - 场景 / Prefab / 资源 YAML  → ask（交给用户确认）
#   - 其他                       → 不做决定，走正常权限流程
# 依赖：jq 或 python3（二选一）

set -euo pipefail

input="$(cat)"

json_get() {
  # $1 = jq 路径（如 .tool_input.file_path）
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
    echo "guard-unity-files: 需要 jq 或 python3" >&2
    exit 1  # 非阻塞错误：放行并走正常权限流程
  fi
}

decide() {
  # $1 = allow|deny|ask，$2 = 原因
  local reason="${2//\"/\\\"}"
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"%s","permissionDecisionReason":"%s"}}\n' "$1" "$reason"
  exit 0
}

file_path="$(json_get .tool_input.file_path)"
[ -z "$file_path" ] && file_path="$(json_get .tool_input.notebook_path)"
[ -z "$file_path" ] && exit 0

# 统一为正斜杠，并转换成相对项目根目录的路径
path="${file_path//\\//}"
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
root="${root//\\//}"
rel="${path#"$root"/}"

case "$rel" in
  Library/*|Temp/*|obj/*|Logs/*|UserSettings/*|Build/*|Builds/*)
    decide deny "$rel 位于 Unity 生成目录，禁止编辑。"
    ;;
esac

case "$rel" in
  *.meta)
    decide deny "禁止直接编辑 .meta（GUID 损坏会导致引用丢失）。新文件让 Unity 生成 meta；移动文件请用 git mv 连同 .meta 一起移动。"
    ;;
  *.unity|*.prefab|*.asset|*.mat|*.controller|*.anim|*.overrideController|*.playable|*.lighting)
    decide ask "$rel 是 Unity 序列化资源（YAML，含 fileID/GUID 引用）。手改风险高，建议改用编辑器 API / Unity MCP。确认要直接编辑吗？"
    ;;
esac

exit 0
