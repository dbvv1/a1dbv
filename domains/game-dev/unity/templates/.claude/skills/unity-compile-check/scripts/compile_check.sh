#!/usr/bin/env bash
# Unity 编译检查。stdout 输出去重后的编译错误与结论；stderr 输出过程信息。
#
# 用法：compile_check.sh [--editor | --dotnet | --batch | --help]
#   --editor  通过 Unity CLI 让“已打开的编辑器”重新编译（Unity 6+，需 com.unity.pipeline）
#   --dotnet  dotnet build 已生成的 .sln（快，不需要 Unity；新增/删除文件后需重新生成 csproj）
#   --batch   无头完整编译（编辑器必须未打开该项目；有 Unity CLI 时用 `unity run`）
#   默认      有 .sln 且装了 dotnet → --dotnet；否则 → --batch
#
# 退出码：0 通过；1 有编译错误；2 环境问题（找不到工具、项目被锁、参数错误）
# 环境变量：UNITY_PROJECT（默认当前目录）、UNITY_EDITOR（无 Unity CLI 时的编辑器路径）

set -uo pipefail

PROJECT="${UNITY_PROJECT:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"
MODE="${1:-auto}"
LOG_DIR="$PROJECT/Logs"

log() { echo "$*" >&2; }

usage() { sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'; }

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

# 从日志中提取去重后的 C# 编译错误，最多 50 行，避免撑爆上下文
report_errors() {
  local log_file="$1" errors count
  errors="$(grep -E 'error CS[0-9]{4}' "$log_file" | sed -E 's/^[[:space:]]+//' | sort -u)"
  [ -z "$errors" ] && return 1
  count="$(printf '%s\n' "$errors" | wc -l | tr -d ' ')"
  printf '%s\n' "$errors" | head -n 50
  [ "$count" -gt 50 ] && echo "…（共 $count 条，仅显示前 50 条）"
  echo "✗ 编译失败：$count 个错误。完整日志：$log_file"
  return 0
}

editor_locked() { [ -f "$PROJECT/Temp/UnityLockfile" ]; }

run_editor() {
  command -v unity >/dev/null 2>&1 || { log "未安装 Unity CLI（unity）。"; return 2; }
  log "→ unity recompile（使用已打开的编辑器）"
  local out code errors
  out="$(unity recompile --project-path "$PROJECT" 2>&1)"; code=$?
  errors="$(printf '%s\n' "$out" | grep -E 'error CS[0-9]{4}' | sort -u)"
  case $code in
    0) echo "✓ 编辑器编译通过" ;;
    7) echo "✗ 编辑器处于 Safe Mode（启动时已有编译错误），CLI 无法连接。"
       echo "  请改用 --dotnet，或从 Editor.log 过滤 'error CS' 修复后重启编辑器。"
       return 1 ;;
    *) if [ -n "$errors" ]; then
         printf '%s\n' "$errors" | head -n 50
         echo "✗ 编译失败：$(printf '%s\n' "$errors" | wc -l | tr -d ' ') 个错误"
       else
         printf '%s\n' "$out" | tail -n 20
         echo "✗ unity recompile 退出码 $code"
       fi
       return 1 ;;
  esac
}

run_dotnet() {
  local sln
  sln="$(find "$PROJECT" -maxdepth 1 -name '*.sln' | head -n1)"
  [ -z "$sln" ] && { log "未找到 .sln：在 Unity 中 Preferences → External Tools → Regenerate project files。"; return 2; }
  command -v dotnet >/dev/null 2>&1 || { log "未安装 dotnet SDK。"; return 2; }
  mkdir -p "$LOG_DIR"
  local log_file="$LOG_DIR/ai-dotnet-build.log" code
  log "→ dotnet build $(basename "$sln")"
  dotnet build "$sln" -nologo -v q -clp:NoSummary >"$log_file" 2>&1; code=$?
  report_errors "$log_file" && return 1
  if [ $code -ne 0 ]; then
    tail -n 30 "$log_file"
    echo "✗ dotnet build 失败（非 C# 编译错误）。完整日志：$log_file"
    return 1
  fi
  echo "✓ dotnet build 通过（新增/删除 .cs 文件时，最终以 Unity 编译为准）"
}

run_batch() {
  if editor_locked; then
    log "项目可能已被 Unity 编辑器打开（存在 Temp/UnityLockfile）。"
    log "请改用 --editor 或 --dotnet；若编辑器确已关闭，可能是崩溃残留的锁文件，删除 Temp/UnityLockfile 后重试。"
    return 2
  fi
  mkdir -p "$LOG_DIR"
  local log_file="$LOG_DIR/ai-unity-compile.log" code
  if command -v unity >/dev/null 2>&1; then
    log "→ unity run（无头编译，可能需要几分钟）"
    unity run "$PROJECT" --log-file "$log_file" --no-tail -- -nographics >/dev/null 2>&1; code=$?
  else
    local editor
    editor="$(find_unity_editor)" || { log "找不到 Unity：安装 Unity CLI，或设置 UNITY_EDITOR。"; return 2; }
    log "→ Unity batchmode 编译（可能需要几分钟）"
    "$editor" -batchmode -nographics -quit -projectPath "$PROJECT" -logFile "$log_file" >/dev/null 2>&1; code=$?
  fi
  report_errors "$log_file" && return 1
  if [ $code -ne 0 ]; then
    tail -n 30 "$log_file"
    echo "✗ Unity 退出码 $code。完整日志：$log_file"
    return 1
  fi
  echo "✓ Unity 编译通过"
}

case "$MODE" in
  -h|--help) usage ;;
  --editor)  run_editor ;;
  --dotnet)  run_dotnet ;;
  --batch)   run_batch ;;
  auto)
    if find "$PROJECT" -maxdepth 1 -name '*.sln' | grep -q . && command -v dotnet >/dev/null 2>&1; then
      run_dotnet
    else
      run_batch
    fi ;;
  *) log "未知参数：$MODE"; usage >&2; exit 2 ;;
esac
