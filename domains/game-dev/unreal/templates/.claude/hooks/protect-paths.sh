#!/usr/bin/env bash
# 编辑工具辅助 Hook；不是 Bash/MCP 或文件系统安全边界。
# 规则：<deny|ask> <bash-glob> [原因]，相对项目根目录，第一条匹配生效。
# 依赖 jq 或 python3。路径仅做词法规范化，保留盘符形式，不解析符号链接。
# 解析/依赖错误返回 1；默认运行时策略下仍不是阻止操作。
set -uo pipefail
ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
RULES="${PROTECTED_PATHS_FILE:-$ROOT/.claude/protected-paths.txt}"
[ -f "$RULES" ] || exit 0

fail() { printf 'protect-paths: %s\n' "$1" >&2; exit 1; }
if command -v jq >/dev/null 2>&1; then
  parser=jq
elif command -v python3 >/dev/null 2>&1; then
  parser=python3
else
  fail '需要 jq 或 python3'
fi
input="$(cat)" || fail '无法读取输入'

# 校验完整事件；允许缺失/null 路径，拒绝非字符串及控制字符。
# jq -s 同时拒绝空输入与多个 JSON 文档，和 json.load 保持一致。
json_get() {
  if [ "$parser" = jq ]; then
    printf '%s' "$input" | jq -ser --arg field "$1" '
      def path_value: . == null or (type == "string" and (test("[\u0000-\u001f\u007f]") | not));
      if length != 1 then error("expected one JSON event") else .[0] end |
      if type != "object" then error("event must be an object") else . end |
      if has("tool_input") and (.tool_input | type) != "object" then error("tool_input must be an object") else . end |
      if ([.tool_input.file_path, .tool_input.notebook_path, .cwd] | all(path_value)) | not
        then error("paths and cwd must be strings without control characters") else . end |
      if $field == "path" then (.tool_input.file_path // "") as $p |
        if $p == "" then (.tool_input.notebook_path // "") else $p end
      else (.cwd // "") end'
  else
    printf '%s' "$input" | python3 -c '
import json, sys
data = json.load(sys.stdin)
if not isinstance(data, dict):
    raise ValueError("event must be an object")
tool = data.get("tool_input", {})
if not isinstance(tool, dict):
    raise ValueError("tool_input must be an object")
values = [tool.get("file_path"), tool.get("notebook_path"), data.get("cwd")]
for value in values:
    if value is not None and (not isinstance(value, str) or any(ord(c) < 32 or ord(c) == 127 for c in value)):
        raise ValueError("paths and cwd must be strings without control characters")
print((tool.get("file_path") or tool.get("notebook_path") or "") if sys.argv[1] == "path" else (data.get("cwd") or ""))
' "$1"
  fi
}

file_path="$(json_get path)" || fail '无效 Hook 输入'
[ -n "$file_path" ] || exit 0
cwd="$(json_get cwd)" || fail '无效 Hook 输入'

# 不读取目标文件，也不使用 realpath；.. 仅在无符号链接前提下等价。
normalize_path() {
  local part result='' prefix='' path="${1//\\//}"
  case "$path" in
    [a-zA-Z]:/*) prefix="${path:0:2}"; path="${path:2}" ;;
    /*) ;;
    *) return 1 ;;
  esac
  [[ ! "$path" =~ [[:cntrl:]] ]] || return 1
  path="$path/"
  while [ -n "$path" ]; do
    part="${path%%/*}"
    path="${path#*/}"
    case "$part" in
      ''|.) ;;
      ..) result="${result%/*}" ;;
      *) result="$result/$part" ;;
    esac
  done
  printf '%s' "$prefix${result:-/}"
}
root="$(normalize_path "$ROOT")" || fail '项目根目录必须是绝对路径'
cwd="${cwd:-$root}"
cwd="$(normalize_path "$cwd")" || fail 'cwd 必须是绝对路径'
file_path="${file_path//\\//}"
case "$file_path" in
  /*|[a-zA-Z]:/*) ;;
  *) file_path="$cwd/$file_path" ;;
esac
path="$(normalize_path "$file_path")" || fail '无效文件路径'
root_prefix="${root%/}/"
if [[ "$path" == "$root_prefix"* ]]; then
  rel="${path#"$root_prefix"}"
else
  exit 0 # 根目录之外的路径不在此项目相对规则示例的范围内。
fi

decide() {
  if [ "$parser" = jq ]; then
    jq -n --arg action "$1" --arg reason "$2" \
      '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:$action,permissionDecisionReason:$reason}}'
  else
    python3 -c 'import json,sys; print(json.dumps({"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":sys.argv[1],"permissionDecisionReason":sys.argv[2]}}, ensure_ascii=True))' "$1" "$2"
  fi
}
while IFS= read -r line || [ -n "$line" ]; do
  line="${line%$'\r'}"
  case "$line" in ''|'#'*) continue ;; esac
  read -r action glob reason <<< "$line"
  case "$action" in deny|ask) ;; *) continue ;; esac
  # shellcheck disable=SC2053
  if [[ "$rel" == $glob ]]; then
    decide "$action" "${reason:-$rel 受保护（规则：$action $glob）}" || fail '无法序列化决定'
    exit 0
  fi
done < "$RULES"
exit 0
