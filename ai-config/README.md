# 个人 AI 配置导出区

把本地电脑上**通用、可公开**的 AI coding 配置备份到这里，换机器时可以一键恢复。

> ⚠️ 本仓库是 **public**。导出内容必须脱敏：不含密钥、token、内部域名、公司项目名、本机绝对路径。

## 目录约定

```
ai-config/
├── claude/            # ~/.claude 下的通用内容
│   ├── CLAUDE.md
│   ├── settings.json  # 已移除 env / apiKeyHelper 等敏感字段
│   ├── agents/
│   ├── skills/
│   ├── commands/
│   └── hooks/
├── codex/             # ~/.codex/AGENTS.md
└── gemini/            # ~/.gemini/GEMINI.md
```

## 导出（在你本机运行）

```bash
git clone https://github.com/dbvv1/a1dbv.git && cd a1dbv
./scripts/export-ai-config.sh          # 导出到 ai-config/，并自动扫描疑似密钥
git diff --stat ai-config/             # 逐个检查导出内容
```

脚本会：
1. 按**白名单**复制文件（不会碰 `~/.claude.json`、`settings.local.json`、会话历史、凭证）。
2. 用 `jq` 删除 `settings.json` 中的 `env`、`apiKeyHelper`、`awsAuthRefresh` 等敏感字段。
3. 扫描疑似密钥/token/本机路径，发现则提示并以非 0 退出。

**脚本只是第一道防线**，提交前请人工过一遍 `git diff`。

也可以让本机的 Claude Code 来做：在仓库目录运行 `claude`，让它执行导出脚本并帮你审查脱敏结果。

## 恢复（新机器）

```bash
# 建议用软链接，方便以后在仓库里统一修改
ln -s "$PWD/ai-config/claude/CLAUDE.md" ~/.claude/CLAUDE.md
ln -s "$PWD/ai-config/claude/agents"    ~/.claude/agents
ln -s "$PWD/ai-config/claude/skills"    ~/.claude/skills
# settings.json 建议手动合并（本机可能有额外的私有字段）
```

## 不要导出的内容

| 文件 | 原因 |
|---|---|
| `~/.claude.json` | 登录凭证、OAuth、项目历史与路径 |
| `~/.claude/settings.local.json`、项目 `.claude/settings.local.json` | 个人/本机私有设置 |
| `~/.claude/projects/`、`history.jsonl`、`todos/`、`shell-snapshots/` | 会话记录，可能含代码与敏感信息 |
| `~/.codex/auth.json`、`~/.codex/config.toml` 中的 token | 凭证 |
| 任何 MCP 配置中的 `env` / `headers` 值 | 常含 API Key |
