#!/usr/bin/env bash
# 在命令行运行 Unreal 自动化测试并汇总失败用例。stdout 输出汇总；stderr 输出过程信息。
#
# 用法：run_tests.sh [测试过滤] | --help
#   测试过滤：默认为项目名。写法同 Epic 文档：Test1+Test2、前缀 MySet.MySubSet、分组 Group:MyGroup
#   使用 UnrealEditor-Cmd -ExecCmds="Automation RunTest <过滤>;Quit" -ReportExportPath=<目录>，并解析 index.json。
#   编辑器开着时也可以运行（会另起一个无界面进程），但会更慢；改了 C++ 后先用 ue-build 编译。
#
# 退出码：0 全部通过；1 有测试失败；2 环境问题（找不到引擎、没有生成报告、没有匹配的测试）
# 环境变量：UE_PROJECT（.uproject 路径）、UE_ENGINE_ROOT（引擎根目录）、UE_EDITOR（直接指定编辑器可执行文件）、
#           UE_TEST_EXTRA_ARGS（附加参数）

set -uo pipefail

case "${1:-}" in -h|--help) sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;; esac

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"

log() { echo "$*" >&2; }

find_uproject() {
  if [ -n "${UE_PROJECT:-}" ]; then echo "$UE_PROJECT"; return; fi
  local f
  for f in "$ROOT"/*.uproject; do
    [ -e "$f" ] && { echo "$f"; return; }
  done
  return 1
}

host_platform() {
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*) echo Win64 ;;
    Darwin) echo Mac ;;
    *) echo Linux ;;
  esac
}

find_engine_root() {
  if [ -n "${UE_ENGINE_ROOT:-}" ]; then echo "$UE_ENGINE_ROOT"; return; fi
  local d="$ROOT"
  while [ "$d" != "/" ] && [ -n "$d" ]; do
    [ -d "$d/Engine/Binaries" ] && { echo "$d"; return; }
    d="$(dirname "$d")"
  done
  local assoc
  assoc="$(sed -n 's/.*"EngineAssociation"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$UPROJECT" | head -n1)"
  [ -z "$assoc" ] && return 1
  local c
  for c in \
    "/c/Program Files/Epic Games/UE_$assoc" \
    "/mnt/c/Program Files/Epic Games/UE_$assoc" \
    "/Users/Shared/Epic Games/UE_$assoc" \
    "$HOME/UnrealEngine/UE_$assoc"; do
    [ -d "$c/Engine/Binaries" ] && { echo "$c"; return; }
  done
  return 1
}

find_editor() {
  if [ -n "${UE_EDITOR:-}" ]; then echo "$UE_EDITOR"; return; fi
  local engine
  engine="$(find_engine_root)" || return 1
  case "$(host_platform)" in
    Win64) echo "$engine/Engine/Binaries/Win64/UnrealEditor-Cmd.exe" ;;
    Mac)   echo "$engine/Engine/Binaries/Mac/UnrealEditor.app/Contents/MacOS/UnrealEditor" ;;
    *)     echo "$engine/Engine/Binaries/Linux/UnrealEditor" ;;
  esac
}

# 解析 -ReportExportPath 生成的 index.json：汇总 + 至多 30 个失败用例（每个最多 5 条错误）
summarize() {
  python3 - "$1" <<'PY'
import json, sys
with open(sys.argv[1], encoding="utf-8-sig") as f:
    data = json.load(f)
tests = data.get("tests", [])
def state(t):
    return str(t.get("state", "")).lower()
failed = [t for t in tests if state(t) in ("fail", "failed")]
print(f"结果：总数 {len(tests)} | 通过 {data.get('succeeded', '?')} | 通过但有警告 {data.get('succeededWithWarnings', '?')} | "
      f"失败 {data.get('failed', len(failed))} | 未运行 {data.get('notRun', '?')}  耗时 {data.get('totalDuration', '?')}s")
for t in failed[:30]:
    print(f"\n✗ {t.get('fullTestPath') or t.get('testDisplayName')}")
    errors = [e.get("event", {}) for e in t.get("entries", []) if str(e.get("event", {}).get("type", "")).lower() == "error"]
    for ev in errors[:5]:
        print("  " + str(ev.get("message", "")).strip().replace("\n", "\n  "))
if len(failed) > 30:
    print(f"\n…另有 {len(failed) - 30} 个失败用例，见报告目录。")
sys.exit(3 if not tests else (1 if failed else 0))
PY
}

UPROJECT="$(find_uproject)" || { log "找不到 .uproject：在项目根目录运行，或设置 UE_PROJECT。"; exit 2; }
[ -f "$UPROJECT" ] || { log ".uproject 不存在：$UPROJECT"; exit 2; }
command -v python3 >/dev/null 2>&1 || { log "需要 python3 解析测试报告。"; exit 2; }
PROJECT_DIR="$(cd "$(dirname "$UPROJECT")" && pwd)"
PROJECT_NAME="$(basename "$UPROJECT" .uproject)"
FILTER="${1:-$PROJECT_NAME}"

EDITOR="$(find_editor)" || { log "找不到引擎：设置 UE_ENGINE_ROOT 或 UE_EDITOR。"; exit 2; }
[ -x "$EDITOR" ] || [ -f "$EDITOR" ] || { log "找不到编辑器可执行文件：$EDITOR"; exit 2; }

REPORT_DIR="$PROJECT_DIR/Saved/Automation/ai-report"
LOG="$PROJECT_DIR/Saved/Logs/ai-test.log"
mkdir -p "$PROJECT_DIR/Saved/Logs"
rm -rf "$REPORT_DIR"

# shellcheck disable=SC2206  # 有意按空格拆分附加参数
extra=(${UE_TEST_EXTRA_ARGS:-})
log "→ 运行自动化测试（过滤：$FILTER），首次启动可能需要几分钟…"
"$EDITOR" "$UPROJECT" -ExecCmds="Automation RunTest $FILTER;Quit" \
  -unattended -nopause -NullRHI -NoSound -nosplash -log -abslog="$LOG" \
  -ReportExportPath="$REPORT_DIR" ${extra[@]+"${extra[@]}"} >/dev/null 2>&1
code=$?

INDEX="$REPORT_DIR/index.json"
if [ ! -f "$INDEX" ]; then
  grep -E 'Error|Fatal' "$LOG" 2>/dev/null | awk '!seen[$0]++' | head -n 30
  echo "✗ 没有生成测试报告（编辑器退出码 $code）。可能是启动失败、编译未完成或崩溃，日志：$LOG"
  exit 2
fi

summarize "$INDEX"
status=$?
echo
echo "报告：$INDEX"
if [ "$status" -eq 3 ]; then
  echo "✗ 没有匹配“$FILTER”的测试。用 -ExecCmds=\"Automation List;Quit\" 查看可用的测试名。"
  exit 2
fi
exit "$status"
