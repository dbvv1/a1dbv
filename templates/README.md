# 配置模板

> 所有模板都依据 [docs/](../docs/) 中整理的最佳实践编写，并经过测试（Hook 和脚本用伪造的输入实际跑过）。

> 验证边界：历史“经过测试”指模拟输入，不代表真实引擎、所有操作系统或所有绕过路径均已验证。`protect-paths.sh` 只覆盖所注册的编辑工具，不能限制 Bash 写入，也不构成安全沙箱。评审角色中的“只读”若仅写在提示词中，也不是操作系统级只读权限；允许 Bash 的验证过程可能产生构建或临时文件。

| 目录 | 用途 | 拷贝到 |
|---|---|---|
| [`generic/`](generic/) | **任意项目通用**的 AI 协作配置 | 项目根目录 |
| [`global/`](global/) | 个人全局偏好 | `~/.claude/CLAUDE.md` |
| [`codex/`](codex/README.md) | Codex 配置、角色与两项窄触发 Skill；运行时未实测 | 按需合并，不覆盖已有配置 |
| [`long-task/`](long-task/README.md) | 独立验收 spec、执行报告与合成正反例 | 需要恢复/多项验收的任务目录 |
| [`../domains/game-dev/unity/templates/`](../domains/game-dev/unity/templates/) | Unity 项目（在 generic 基础上增加的部分） | Unity 项目根目录 |
| [`../domains/game-dev/unreal/templates/`](../domains/game-dev/unreal/templates/) | Unreal 项目（在 generic 基础上增加的部分） | UE 项目根目录（`.uproject` 所在目录） |

## generic 内容

```
generic/
├── AGENTS.md                      # 跨工具项目指令骨架（填 TODO）
├── CLAUDE.md                      # 导入 AGENTS.md，加上 Claude Code 专属约定
├── REVIEW.md                      # 给 AI 评审者的规则：严重度、证据门槛、Nit 上限、复审收敛
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
| AGENTS.md 不堆重复概览和 lint 规则 | 所引研究在指定样本中未见概览可靠收益；避免复制可由代码获得的信息，不禁止有任务价值的架构地图（[03](../docs/03-context-engineering.md)） |
| 评审只报会拒绝合并的问题，并说明如何证明它会出错 | Anthropic 官方评审提示 |
| REVIEW.md 的结构（严重度、证据门槛、Nit 上限、复审收敛） | Claude Code Review 文档（[09](../docs/09-review-and-quality.md#用-reviewmd-调教评审)） |

## 使用步骤

```bash
cp -r templates/generic/{AGENTS.md,CLAUDE.md,REVIEW.md,.claude} <你的项目>/
chmod +x <你的项目>/.claude/hooks/*.sh
```
1. 填好 `AGENTS.md` 里的所有 TODO，删掉注释。
2. 按项目调整 `.claude/protected-paths.txt` 和 `settings.json` 的 deny 规则。
3. 装对应语言的 LSP 插件，例如 `/plugin install typescript-lsp@claude-plugins-official`。
4. 启动 `claude`，运行 `/context` 确认指令、Skills、Agents 都已加载。
5. 用几周后，用 `/skill-doctor`、`/doctor prompt-audit` 检查，删掉没用的东西。

> 只用 Codex 可先采用 `AGENTS.md`，再按需读 [Codex 适配说明](codex/README.md)。Skill 核心格式可移植，不代表 `.claude/skills` 发现路径、扩展字段、工具名和权限行为都相同；Hooks 和 settings 也需按运行时验证。

## 本仓库验证

Python 3.11+（`tomllib`）和 Bash；不需要调用模型或安装游戏引擎：

```bash
python3 scripts/check_repo.py
python3 -m unittest discover -s tests -v
git diff --check
```

这些检查覆盖本地链接目标、部分文件语法、记录校验及模拟引擎/安装流程；不覆盖外链可达性、全部 Markdown 锚点、真实客户端技能加载或真实引擎运行。
