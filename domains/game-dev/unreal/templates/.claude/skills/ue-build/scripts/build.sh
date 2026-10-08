#!/usr/bin/env bash
# Unreal C++ 编译检查（UnrealBuildTool 命令行）。stdout 输出去重后的编译错误与结论；stderr 输出过程信息。
#
# 用法：build.sh [Target] [Configuration] | --help
#   Target         默认 <项目名>Editor
#   Configuration  默认 Development
#   编辑器开着并启用了 Live Coding 时，UBT 会拒绝编译：只改了 .cpp 函数体时请改用 MCP 的 Live Coding；
#   改了头文件、UPROPERTY/UFUNCTION 或新增类时，先关闭编辑器再运行本脚本。
#
# 退出码：0 通过；1 有编译错误；2 环境问题（找不到引擎或 .uproject、参数错误）；3 编辑器的 Live Coding 正在运行
# 环境变量：UE_PROJECT（.uproject 路径，默认在项目根目录查找）、UE_ENGINE_ROOT（引擎根目录，其下有 Engine/）、
#           UE_BUILD_SCRIPT（直接指定 Build.bat / Build.sh）

set -uo pipefail

case "${1:-}" in -h|--help) sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;; esac

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

# 引擎根目录：UE_ENGINE_ROOT → 项目所在源码工作区 → .uproject 的 EngineAssociation 对应的启动器安装目录
find_engine_root() {
  if [ -n "${UE_ENGINE_ROOT:-}" ]; then echo "$UE_ENGINE_ROOT"; return; fi
  local d="$ROOT"
  while [ "$d" != "/" ] && [ -n "$d" ]; do
    [ -d "$d/Engine/Build/BatchFiles" ] && { echo "$d"; return; }
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
    [ -d "$c/Engine/Build/BatchFiles" ] && { echo "$c"; return; }
  done
  return 1
}

# 提取去重后的编译错误（MSVC、clang、链接器、UHT），最多 50 行
report_errors() {
  grep -E '(error C[0-9]{4}|fatal error|: error:|error LNK[0-9]{4}|undefined reference|\): [Ee]rror:|^ERROR: )' "$1" \
    | sed 's/^[[:space:]]*//' | awk '!seen[$0]++' | head -n 50
}

UPROJECT="$(find_uproject)" || { log "找不到 .uproject：在项目根目录运行，或设置 UE_PROJECT。"; exit 2; }
[ -f "$UPROJECT" ] || { log ".uproject 不存在：$UPROJECT"; exit 2; }
PROJECT_DIR="$(cd "$(dirname "$UPROJECT")" && pwd)"
PROJECT_NAME="$(basename "$UPROJECT" .uproject)"
TARGET="${1:-${PROJECT_NAME}Editor}"
CONFIG="${2:-Development}"
PLATFORM="$(host_platform)"

case "$CONFIG" in
  Debug|DebugGame|Development|Test|Shipping) ;;
  *) log "未知的编译配置：$CONFIG（可选 Debug、DebugGame、Development、Test、Shipping）"; exit 2 ;;
esac

if [ -n "${UE_BUILD_SCRIPT:-}" ]; then
  BUILD="$UE_BUILD_SCRIPT"
else
  ENGINE="$(find_engine_root)" || { log "找不到引擎：设置 UE_ENGINE_ROOT（其下应有 Engine/Build/BatchFiles），或设置 UE_BUILD_SCRIPT。"; exit 2; }
  case "$PLATFORM" in
    Win64) BUILD="$ENGINE/Engine/Build/BatchFiles/Build.bat" ;;
    Mac)   BUILD="$ENGINE/Engine/Build/BatchFiles/Mac/Build.sh" ;;
    *)     BUILD="$ENGINE/Engine/Build/BatchFiles/Linux/Build.sh" ;;
  esac
fi
[ -f "$BUILD" ] || { log "找不到编译脚本：$BUILD"; exit 2; }

LOG_DIR="$PROJECT_DIR/Saved/Logs"
LOG="$LOG_DIR/ai-build-$TARGET-$CONFIG.log"
mkdir -p "$LOG_DIR"

log "→ $TARGET $PLATFORM $CONFIG（$PROJECT_NAME），可能需要几分钟…"
"$BUILD" "$TARGET" "$PLATFORM" "$CONFIG" -Project="$UPROJECT" -WaitMutex >"$LOG" 2>&1
code=$?

if grep -qi 'Live Coding is active' "$LOG"; then
  echo "✗ 编辑器的 Live Coding 正在运行，UBT 拒绝编译。"
  echo "  只改了 .cpp 函数体 → 通过 Unreal MCP 调用 LiveCodingToolset.CompileLiveCoding。"
  echo "  改了头文件、UPROPERTY/UFUNCTION 或新增类 → 先关闭编辑器，再重新运行本脚本。"
  exit 3
fi

if [ "$code" -eq 0 ]; then
  echo "✓ 编译通过：$TARGET $PLATFORM $CONFIG"
  exit 0
fi

errors="$(report_errors "$LOG")"
if [ -n "$errors" ]; then
  echo "$errors"
  echo
  echo "✗ 编译失败（退出码 $code），完整日志：$LOG"
  exit 1
fi

tail -n 20 "$LOG"
echo
echo "✗ 编译失败但没有识别出编译错误（退出码 $code），可能是环境问题。完整日志：$LOG"
exit 2
