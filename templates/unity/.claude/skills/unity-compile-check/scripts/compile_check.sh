#!/usr/bin/env bash
# Unity 编译检查：dotnet build（快）或 Unity batchmode（完整）。
# 用法：compile_check.sh [--dotnet | --unity]
# 环境变量：UNITY_EDITOR（可选，Unity 可执行文件路径）、UNITY_PROJECT（可选，默认当前目录）

set -uo pipefail

PROJECT="${UNITY_PROJECT:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"
MODE="${1:-auto}"
LOG_DIR="$PROJECT/Logs"
mkdir -p "$LOG_DIR"

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

extract_errors() {
  # 去重输出 C# 编译错误
  grep -E 'error CS[0-9]{4}' "$1" | sed -E 's/^[[:space:]]+//' | sort -u
}

run_dotnet() {
  local sln
  sln="$(find "$PROJECT" -maxdepth 1 -name '*.sln' | head -n1)"
  if [ -z "$sln" ]; then
    echo "未找到 .sln。请在 Unity 中 Preferences → External Tools → Regenerate project files。" >&2
    return 2
  fi
  command -v dotnet >/dev/null 2>&1 || { echo "未安装 dotnet SDK。" >&2; return 2; }
  local log="$LOG_DIR/ai-dotnet-build.log"
  echo "→ dotnet build $(basename "$sln")"
  dotnet build "$sln" -nologo -v q -clp:NoSummary >"$log" 2>&1
  local code=$?
  local errors; errors="$(extract_errors "$log")"
  if [ -n "$errors" ]; then
    echo "$errors"
    echo "✗ 编译失败（$(echo "$errors" | wc -l | tr -d ' ') 个错误），完整日志：$log"
    return 1
  fi
  if [ $code -ne 0 ]; then
    tail -n 30 "$log"
    echo "✗ dotnet build 失败（非 C# 编译错误），完整日志：$log"
    return 1
  fi
  echo "✓ dotnet build 通过"
}

run_unity() {
  if [ -f "$PROJECT/Temp/UnityLockfile" ]; then
    echo "项目可能已被 Unity 编辑器打开（存在 Temp/UnityLockfile）。" >&2
    echo "请改用 Unity MCP / Unity CLI 读取编辑器 Console，或使用 --dotnet，或关闭编辑器后重试。" >&2
    echo "（若编辑器确已关闭，可能是崩溃残留的锁文件，删除 Temp/UnityLockfile 后重试。）" >&2
    return 2
  fi
  local unity
  unity="$(find_unity)" || { echo "找不到 Unity 可执行文件，请设置 UNITY_EDITOR。" >&2; return 2; }
  local log="$LOG_DIR/ai-unity-compile.log"
  echo "→ Unity batchmode 编译（可能需要几分钟）"
  "$unity" -batchmode -nographics -quit -projectPath "$PROJECT" -logFile "$log" >/dev/null 2>&1
  local code=$?
  local errors; errors="$(extract_errors "$log")"
  if [ -n "$errors" ]; then
    echo "$errors"
    echo "✗ 编译失败（$(echo "$errors" | wc -l | tr -d ' ') 个错误），完整日志：$log"
    return 1
  fi
  if [ $code -ne 0 ]; then
    tail -n 30 "$log"
    echo "✗ Unity 退出码 $code，完整日志：$log"
    return 1
  fi
  echo "✓ Unity 编译通过"
}

case "$MODE" in
  --dotnet) run_dotnet ;;
  --unity)  run_unity ;;
  auto)
    if find "$PROJECT" -maxdepth 1 -name '*.sln' | grep -q .; then run_dotnet; else run_unity; fi ;;
  *) echo "用法：$0 [--dotnet | --unity]" >&2; exit 2 ;;
esac
