# Agent Skills 与插件

> 核实时间：2026-10。

## Agent Skills 是什么

一个 Skill = 一个目录 + `SKILL.md`（YAML frontmatter + Markdown 指令），可附带脚本、参考文档、资源文件。

```
my-skill/
├── SKILL.md          # 必需：name + description + 指令
├── reference.md      # 可选：详细资料（按需加载）
└── scripts/
    └── helper.sh     # 可选：可执行脚本
```

**核心机制：渐进式加载**——平时只有 `name + description` 常驻上下文；被触发时才加载正文；正文里引用的文件再按需读取。所以 Skill 可以很多而不撑爆上下文。

- 2025-12 Anthropic 将其开放为标准：<https://agentskills.io>
- 支持方：Claude / Claude Code、ChatGPT / Codex、Gemini CLI、Cursor、GitHub Copilot / VS Code、OpenCode、Amp、Goose、Junie、Roo、Kiro、Trae 等 40+ 工具。

## Skill vs MCP vs Subagent vs Hook 怎么选

| 需求 | 用什么 |
|---|---|
| 教 Agent **怎么做**一件事（流程、规范、领域知识） | **Skill** |
| 让 Agent **能访问**一个外部系统（API、编辑器、数据库） | **MCP** |
| 把一类任务**隔离上下文**交给专门角色（评审、检索） | **Subagent** |
| **无论 Agent 怎么想都必须执行**的规则（格式化、禁止改某目录） | **Hook** |
| 把以上打包分发给团队/多个项目 | **Plugin** |

## 写好一个 Skill

1. **description 是灵魂**：写清“做什么 + 什么时候用”，把触发关键词放前面（Claude Code 中 description + when_to_use 合计会被截断到约 1536 字符）。
2. **正文聚焦**：SKILL.md 建议 < 500 行；细节拆到 reference 文件。
3. **能用脚本就用脚本**：确定性的步骤写成脚本，比让模型每次即兴发挥更可靠。
4. **副作用操作手动触发**：部署、发消息、删除类 Skill 设 `disable-model-invocation: true`。
5. **预授权工具**：`allowed-tools: Bash(git *) Read` 减少确认弹窗。
6. **评估**：Claude Code 的 `/skill-doctor` 查看上下文成本；`claude plugin eval` 对插件跑测试用例打分。

Claude Code 常用 frontmatter：

```yaml
---
name: unity-run-tests
description: 运行 Unity EditMode/PlayMode 测试并解析结果。用于改完 C# 代码后验证、或用户要求跑测试时。
allowed-tools: Bash(./scripts/*) Read
argument-hint: [EditMode|PlayMode] [filter]
# disable-model-invocation: true   # 仅允许手动 /name 调用
# context: fork                     # 在独立子 Agent 中运行
# paths: "Assets/**/*.cs"           # 只在相关文件场景下自动激活
---
```

正文中可用 `$ARGUMENTS` / `$0` / `${CLAUDE_SKILL_DIR}`，以及 `` !`命令` `` 动态注入命令输出。

本仓库示例：[`templates/unity/.claude/skills/`](../templates/unity/.claude/skills/)

## 插件（Plugins）

插件 = Skills + Subagents + Hooks + MCP 配置 +（可选）LSP 的打包，通过“市场（marketplace）”分发。

```bash
# Claude Code
/plugin marketplace add <owner>/<repo>
/plugin install <plugin>@<marketplace>

# Codex
codex plugin marketplace add <owner>/<repo>
codex plugin add <plugin>@<marketplace>
```

## 值得关注的 Skill / 插件来源

| 来源 | 说明 |
|---|---|
| [anthropics/skills](https://github.com/anthropics/skills) | Anthropic 官方示例 Skills（文档处理、前端设计、Skill 创作等） |
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Claude Code 官方插件目录（含 LSP 插件如 `csharp-lsp`） |
| [Unity-Technologies/unity-agent-plugin](https://github.com/Unity-Technologies/unity-agent-plugin) | **Unity 官方插件**（Claude Code / Codex） |
| [Unity-Technologies/skills](https://github.com/Unity-Technologies/skills) | Unity 官方 Skills，`npx skills add Unity-Technologies/skills` 安装到 50+ 种 Agent |
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | 300+ 社区/厂商 Skills 汇总 |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 最大的 Claude Code 资源清单 |

> ⚠️ 第三方 Skill/插件本质是“给 Agent 的可执行指令 + 脚本”，安装前**务必读一遍内容**（见 [08-security](08-security.md)）。
