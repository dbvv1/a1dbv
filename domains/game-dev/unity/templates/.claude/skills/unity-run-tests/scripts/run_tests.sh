#!/usr/bin/env bash
# 运行 Unity EditMode/PlayMode 测试并汇总失败用例。stdout 输出汇总；stderr 输出过程信息。
#
# 用法：run_tests.sh [EditMode|PlayMode] [testFilter] | --help
#   有 Unity CLI（unity）时使用 `unity test`，否则使用编辑器 batchmode（-runTests）。
#   编辑器必须未打开该项目（否则请通过 Unity CLI/MCP 在编辑器内运行 Test Runner）。
#
# 退出码：0 全部通过；1 有测试失败；2 环境问题（找不到 Unity、项目被锁、编译错误、无结果文件）
# 环境变量：UNITY_PROJECT（默认当前目录）、UNITY_EDITOR（无 Unity CLI 时的编辑器路径）

set -uo pipefail

case "${1:-}" in -h|--help) sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;; esac

PROJECT="${UNITY_PROJECT:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"
PLATFORM="${1:-EditMode}"
FILTER="${2:-}"
LOG_DIR="$PROJECT/Logs"
RESULTS="$LOG_DIR/ai-test-results-$PLATFORM.xml"
LOG="$LOG_DIR/ai-test-$PLATFORM.log"

log() { echo "$*" >&2; }

case "$PLATFORM" in
  EditMode|PlayMode) ;;
  *) log "平台必须是 EditMode 或 PlayMode：$PLATFORM"; exit 2 ;;
esac

find_unity_editor() {
  if [ -n "${UNITY_EDITOR:-}" ]; then echo "$UNITY_EDITOR"; return; fi
  local ver
  ver="$(sed -n 's/^m_EditorVersion: //p' "$PROJECT/ProjectSettings/ProjectVersion.txt" 2>/dev/null | tr -d '\r')"
  [ -z "$ver" ] && return 1
  local c
  for c in \
    "/Applications/Unity/Hub/Editor/$ver/Unity.app/Contents/MacOS/Unity" \
    "/c/Program Files/Unity/Hub/Editor/$ver/Editor/Unity.exe" \
    "/mnt/c/Program Files/Unity/Hub/Editor/$ver/Editor/Unity.exe" \
    "$HOME/Unity/Hub/Editor/$ver/Editor/Unity"; do
    [ -x "$c" ] && { echo "$c"; return; }
  done
  return 1
}

# 解析 NUnit3 XML：汇总 + 至多 30 个失败用例（消息与前 5 行堆栈）
summarize() {
  if command -v python3 >/dev/null 2>&1; then
    python3 - "$1" <<'PY'
import sys, xml.etree.ElementTree as ET
root = ET.parse(sys.argv[1]).getroot()
a = root.attrib
print(f"结果：{a.get('result')}  总数 {a.get('total')} | 通过 {a.get('passed')} | 失败 {a.get('failed')} | 跳过 {a.get('skipped')}  耗时 {a.get('duration')}s")
failed = [tc for tc in root.iter('test-case') if tc.get('result') == 'Failed']
for tc in failed[:30]:
    msg = (tc.findtext('failure/message') or '').strip()
    stack = (tc.findtext('failure/stack-trace') or '').strip().splitlines()[:5]
    print(f"\n✗ {tc.get('fullname')}")
    if msg:
        print("  " + msg.replace("\n", "\n  "))
    for line in stack:
        print("    " + line.strip())
if len(failed) > 30:
    print(f"\n…另有 {len(failed) - 30} 个失败用例，见结果文件。")
PY
  else
    grep -o '<test-run[^>]*>' "$1" | head -n1
    grep -o '<test-case[^>]*result="Failed"[^>]*>' "$1" | grep -o 'fullname="[^"]*"' | head -n 30
  fi
}

if [ -f "$PROJECT/Temp/UnityLockfile" ]; then
  log "项目可能已被 Unity 编辑器打开（存在 Temp/UnityLockfile）。请通过 Unity CLI/MCP 在编辑器内运行测试，或关闭编辑器后重试。"
  exit 2
fi

mkdir -p "$LOG_DIR"
rm -f "$RESULTS"

if command -v unity >/dev/null 2>&1; then
  args=(test "$PROJECT" --mode "$PLATFORM" --output "$RESULTS" --log-file "$LOG")
  [ -n "$FILTER" ] && args+=(--filter "$FILTER")
  log "→ unity ${args[*]}"
  unity "${args[@]}" >/dev/null 2>&1; code=$?
  # Unity CLI 约定：0 通过；8 有测试失败；6 基础设施问题（编译错误、License、崩溃、超时）
  case $code in 0) status=0 ;; 8) status=1 ;; *) status=2 ;; esac
else
  UNITY="$(find_unity_editor)" || { log "找不到 Unity：安装 Unity CLI，或设置 UNITY_EDITOR。"; exit 2; }
  args=(-batchmode -nographics -projectPath "$PROJECT" -runTests -testPlatform "$PLATFORM" -testResults "$RESULTS" -logFile "$LOG")
  [ -n "$FILTER" ] && args+=(-testFilter "$FILTER")
  log "→ Unity batchmode 运行 $PLATFORM 测试${FILTER:+（过滤：$FILTER）}，可能需要几分钟…"
  "$UNITY" "${args[@]}" >/dev/null 2>&1; code=$?
  # 编辑器 -runTests 约定：0 通过；2 有测试失败；其他为运行错误
  case $code in 0) status=0 ;; 2) status=1 ;; *) status=2 ;; esac
fi

if [ ! -f "$RESULTS" ]; then
  grep -E 'error CS[0-9]{4}' "$LOG" 2>/dev/null | sort -u | head -n 30
  echo "✗ 未生成测试结果（退出码 $code）。可能是编译错误或启动失败，日志：$LOG"
  exit 2
fi

summarize "$RESULTS"
echo
echo "结果文件：$RESULTS"
exit "$status"
