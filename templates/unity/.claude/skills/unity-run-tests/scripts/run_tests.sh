#!/usr/bin/env bash
# 运行 Unity Test Runner（batchmode）并汇总结果。
# 用法：run_tests.sh [EditMode|PlayMode] [testFilter]
# 环境变量：UNITY_EDITOR（可选）、UNITY_PROJECT（可选，默认当前目录）

set -uo pipefail

PROJECT="${UNITY_PROJECT:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"
PLATFORM="${1:-EditMode}"
FILTER="${2:-}"
LOG_DIR="$PROJECT/Logs"
RESULTS="$LOG_DIR/ai-test-results-$PLATFORM.xml"
LOG="$LOG_DIR/ai-test-$PLATFORM.log"
mkdir -p "$LOG_DIR"

case "$PLATFORM" in
  EditMode|PlayMode) ;;
  *) echo "用法：$0 [EditMode|PlayMode] [testFilter]" >&2; exit 2 ;;
esac

find_unity() {
  if [ -n "${UNITY_EDITOR:-}" ]; then echo "$UNITY_EDITOR"; return; fi
  local ver
  ver="$(sed -n 's/^m_EditorVersion: //p' "$PROJECT/ProjectSettings/ProjectVersion.txt" 2>/dev/null | tr -d '\r')"
  [ -z "$ver" ] && return 1
  local candidates=(
    "/Applications/Unity/Hub/Editor/$ver/Unity.app/Contents/MacOS/Unity"
    "/c/Program Files/Unity/Hub/Editor/$ver/Editor/Unity.exe"
    "/mnt/c/Program Files/Unity/Hub/Editor/$ver/Editor/Unity.exe"
    "$HOME/Unity/Hub/Editor/$ver/Editor/Unity"
  )
  for c in "${candidates[@]}"; do
    [ -x "$c" ] && { echo "$c"; return; }
  done
  return 1
}

summarize() {
  # 解析 NUnit3 XML：汇总 + 失败用例详情
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
    grep -o '<test-case[^>]*result="Failed"[^>]*>' "$1" | grep -o 'fullname="[^"]*"'
  fi
}

if [ -f "$PROJECT/Temp/UnityLockfile" ]; then
  echo "项目可能已被 Unity 编辑器打开（存在 Temp/UnityLockfile）。请用 Unity MCP / Unity CLI 运行测试，或关闭编辑器后重试。" >&2
  exit 2
fi

UNITY="$(find_unity)" || { echo "找不到 Unity 可执行文件，请设置 UNITY_EDITOR。" >&2; exit 2; }

rm -f "$RESULTS"
args=(-batchmode -nographics -projectPath "$PROJECT" -runTests -testPlatform "$PLATFORM" -testResults "$RESULTS" -logFile "$LOG")
[ -n "$FILTER" ] && args+=(-testFilter "$FILTER")

echo "→ 运行 $PLATFORM 测试${FILTER:+（过滤：$FILTER）}，可能需要几分钟…"
"$UNITY" "${args[@]}" >/dev/null 2>&1
code=$?

if [ ! -f "$RESULTS" ]; then
  grep -E 'error CS[0-9]{4}' "$LOG" | sort -u | head -n 30
  echo "✗ 未生成测试结果（Unity 退出码 $code）。可能是编译错误或启动失败，日志：$LOG" >&2
  exit 2
fi

summarize "$RESULTS"
echo
echo "结果文件：$RESULTS"
# Unity 约定：0 = 全部通过，2 = 有测试失败，其他 = 运行错误
case $code in
  0) exit 0 ;;
  2) exit 1 ;;
  *) exit 2 ;;
esac
