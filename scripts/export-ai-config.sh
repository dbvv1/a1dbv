#!/usr/bin/env bash
# 将本机通用 AI coding 配置导出到仓库 ai-config/（白名单 + 脱敏 + 密钥扫描）。
# 在你自己的电脑上、仓库根目录运行：./scripts/export-ai-config.sh
# 依赖：bash、jq（脱敏 settings.json 用；没有 jq 时跳过 settings.json）

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$REPO_ROOT/ai-config"
CLAUDE_HOME="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"

copy_if_exists() {
  # $1 源路径  $2 目标路径
  if [ -e "$1" ]; then
    mkdir -p "$(dirname "$2")"
    rm -rf "$2"
    cp -R "$1" "$2"
    echo "  ✓ ${1/#"$HOME"/\~}"
  fi
}

echo "→ 导出 Claude Code 配置（$CLAUDE_HOME）"
copy_if_exists "$CLAUDE_HOME/CLAUDE.md" "$OUT/claude/CLAUDE.md"
for dir in agents skills commands hooks output-styles; do
  copy_if_exists "$CLAUDE_HOME/$dir" "$OUT/claude/$dir"
done

if [ -f "$CLAUDE_HOME/settings.json" ]; then
  if command -v jq >/dev/null 2>&1; then
    mkdir -p "$OUT/claude"
    jq 'del(.env, .apiKeyHelper, .awsAuthRefresh, .awsCredentialExport, .otelHeadersHelper, .forceLoginOrgUUID)' \
      "$CLAUDE_HOME/settings.json" > "$OUT/claude/settings.json"
    echo "  ✓ ~/.claude/settings.json（已移除 env 等敏感字段）"
  else
    echo "  ! 未安装 jq，跳过 settings.json（请手动脱敏后复制）"
  fi
fi

echo "→ 导出其他工具的全局指令"
copy_if_exists "$HOME/.codex/AGENTS.md"  "$OUT/codex/AGENTS.md"
copy_if_exists "$HOME/.gemini/GEMINI.md" "$OUT/gemini/GEMINI.md"

echo "→ 扫描疑似敏感信息"
patterns=(
  'sk-[A-Za-z0-9_-]{20,}'          # OpenAI / Anthropic 风格密钥
  'ghp_[A-Za-z0-9]{30,}'           # GitHub PAT
  'github_pat_[A-Za-z0-9_]{30,}'
  'xox[abprs]-[A-Za-z0-9-]{10,}'   # Slack
  'AKIA[0-9A-Z]{16}'               # AWS Access Key
  'AIza[0-9A-Za-z_-]{35}'          # Google API Key
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'
  '"(api[_-]?key|token|secret|password)"[[:space:]]*:[[:space:]]*"[^"$]+'
)
found=0
for p in "${patterns[@]}"; do
  if grep -rInE --exclude=README.md -e "$p" "$OUT" 2>/dev/null; then found=1; fi
done
# 本机绝对路径（可能暴露用户名/公司目录结构）
if grep -rInF --exclude=README.md -e "$HOME" "$OUT" 2>/dev/null; then
  echo "  ! 发现本机绝对路径，建议替换为 ~ 或环境变量"
  found=1
fi

if [ "$found" -ne 0 ]; then
  echo "✗ 发现疑似敏感信息（见上），请处理后再提交。"
  exit 1
fi
echo "✓ 未发现明显敏感信息。提交前请再人工检查：git diff ai-config/"
