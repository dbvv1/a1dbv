#!/usr/bin/env bash
# 运行 Unity EditMode/PlayMode 测试并汇总失败用例。stdout 输出汇总；stderr 输出过程信息。
#
# 用法：run_tests.sh [EditMode|PlayMode] [testFilter] | --help
#   有 Unity CLI（unity）时使用 `unity test`，否则使用编辑器 batchmode（-runTests）。
#   编辑器必须未打开该项目（否则请通过 Unity CLI/MCP 在编辑器内运行 Test Runner）。
#
# 退出码：0 全部通过；1 有测试失败；2 环境问题（找不到 Unity、项目被锁、编译错误、报告无效或测试未完成）
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
  python3 - "$1" <<'PY'
import sys, xml.etree.ElementTree as ET
try:
  root = ET.parse(sys.argv[1]).getroot()
  if root.tag != 'test-run':
    raise ValueError('缺少 NUnit3 test-run 根节点')
  a = root.attrib
  counts = {key: int(a[key]) for key in ('total', 'passed', 'failed', 'skipped')}
  counts['inconclusive'] = int(a.get('inconclusive', '0'))
  if any(value < 0 for value in counts.values()):
    raise ValueError('测试计数不能为负数')
except (OSError, ET.ParseError, KeyError, ValueError) as exc:
  print(f'✗ 无法解析测试报告：{exc}', file=sys.stderr)
  sys.exit(2)
print(f"结果：{a.get('result')}  总数 {a.get('total')} | 通过 {a.get('passed')} | 失败 {a.get('failed')} | 跳过 {a.get('skipped')}  耗时 {a.get('duration')}s")
tests = list(root.iter('test-case'))
failed = [tc for tc in tests if tc.get('result') == 'Failed']
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
if failed or counts['failed'] or a.get('result') == 'Failed':
  sys.exit(1)
if (not tests or counts['total'] != len(tests)
    or counts['passed'] != len(tests) or counts['skipped'] or counts['inconclusive']
    or a.get('result') != 'Passed'
    or any(tc.get('result') != 'Passed' for tc in tests)):
  print('✗ 没有匹配的测试，或报告包含跳过、未完成或不一致的结果。', file=sys.stderr)
  sys.exit(2)
PY
}

if [ -f "$PROJECT/Temp/UnityLockfile" ]; then
  log "项目可能已被 Unity 编辑器打开（存在 Temp/UnityLockfile）。请通过 Unity CLI/MCP 在编辑器内运行测试，或关闭编辑器后重试。"
  exit 2
fi

command -v python3 >/dev/null 2>&1 || { log "需要 python3 解析测试报告。"; exit 2; }

mkdir -p "$LOG_DIR" && rm -f "$RESULTS" || { log "无法准备新的测试结果路径：$RESULTS"; exit 2; }

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
report_status=$?
# 仅当进程和报告都成功时返回 0；解析失败不能被进程退出码掩盖。
case "$report_status" in
  0) ;;
  1) [ "$status" -eq 0 ] && status=1 ;;
  *) status=2 ;;
esac
echo
echo "结果文件：$RESULTS"
[ "$code" -eq 0 ] || log "Unity 进程退出码：$code；日志：$LOG"
exit "$status"
