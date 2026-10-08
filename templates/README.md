# 配置模板

> 所有模板都依据 [docs/](../docs/) 中整理的最佳实践编写，并经过测试（Hook 和脚本用伪造的输入实际跑过）。

| 目录 | 用途 | 拷贝到 |
|---|---|---|
| [`generic/`](generic/) | **任意项目通用**的 AI 协作配置 | 项目根目录 |
| [`global/`](global/) | 个人全局偏好 | `~/.claude/CLAUDE.md` |
| [`../domains/game-dev/unity/templates/`](../domains/game-dev/unity/templates/) | Unity 项目（在 generic 基础上增加的部分） | Unity 项目根目录 |
| [`../domains/game-dev/unreal/templates/`](../domains/game-dev/unreal/templates/) | Unreal 项目（在 generic 基础上增加的部分） | UE 项目根目录（`.uproject` 所在目录） |

## generic 内容

```
generic/
├── AGENTS.md                      # 跨工具项目指令骨架（填 TODO）
├── CLAUDE.md                      # 导入 AGENTS.md，加上 Claude Code 专属约定
├── .mcp.json.example              # 项目级 MCP 示例（Context7、Playwright）
└── .claude/
    ├── settings.json              # 权限（只读 git 命令放行；push 需确认；不读密钥和生成物）+ Hook 注册
    ├── protected-paths.txt        # 受保护路径规则：deny / ask + glob + 原因
    ├── hooks/protect-paths.sh     # PreToolUse Hook：按规则拦截编辑（依赖 jq 或 python3）
    ├── agents/
    │   ├── code-reviewer.md       # 只报告正确性问题的评审者（避免过度挑刺）
    │   └── verifier.md            # 尝试推翻“已完成”的独立验证者
    └── skills/
        ├── spec-interview/        # /spec-interview：访谈式整理需求，输出 SPEC.md
        └── handoff/               # /handoff：写 PROGRESS.md，方便清空上下文后继续
```

每个组件对应的依据：

| 组件 | 依据 |
|---|---|
| AGENTS.md 写短、人工写 | [03 上下文工程](../docs/03-context-engineering.md#22-指令文件到底有没有用研究证据) |
| 受保护路径用 Hook 而不是写在指令里 | [06 Hooks](../docs/06-hooks-and-guardrails.md) |
| code-reviewer 只报正确性问题 | 官方最佳实践：被要求找问题的评审者会过度报告 |
| verifier 独立核对 | 长时任务研究：做事和评判要分开 |
| spec-interview | 官方最佳实践：“让 Claude 采访你”，然后开新会话实现 |
| handoff | 长时任务 harness 的进度文件做法；HN 上比 `/compact` 更受推荐 |
| CLAUDE.md 的停止规则、TASKS.md、Blocked on me / Changed / Found | Anthropic《Getting the most out of Opus 5.5》 |
| AGENTS.md 不写概览和 lint 规则 | 2026 年的研究：概览没用；62% 的文件有 Lint 泄漏（[03](../docs/03-context-engineering.md)） |
| 评审只报会拒绝合并的问题，并说明如何证明它会出错 | Anthropic 官方评审提示 |

## 使用步骤

```bash
cp -r templates/generic/{AGENTS.md,CLAUDE.md,.claude} <你的项目>/
chmod +x <你的项目>/.claude/hooks/*.sh
```
1. 填好 `AGENTS.md` 里的所有 TODO，删掉注释。
2. 按项目调整 `.claude/protected-paths.txt` 和 `settings.json` 的 deny 规则。
3. 装对应语言的 LSP 插件，例如 `/plugin install typescript-lsp@claude-plugins-official`。
4. 启动 `claude`，运行 `/context` 确认指令、Skills、Agents 都已加载。
5. 用几周后，用 `/skill-doctor`、`/doctor prompt-audit` 检查，删掉没用的东西。

> 只用 Codex 或其他工具：只需要 `AGENTS.md`；Skills 目录也可以复用（Agent Skills 是开放标准），Hooks 和 settings 是 Claude Code 专用的。
