# Claude Code

> 核实时间：2026-10-03（最新版本 v2.1.288）。主要依据：[CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)、[官方文档](https://code.claude.com/docs)、[Anthropic 工程博客](https://www.anthropic.com/engineering) **[一手]**。
> 评级：✅ **采用**（主力 Agent 首选之一）

## 1. 定位

Anthropic 的 Agent 式编程环境：能读代码、改文件、跑命令、多步自主完成任务。可在终端、VS Code、JetBrains、桌面 App、Web（claude.ai/code，云端容器）、手机 App 上使用。它的扩展体系（CLAUDE.md、Skills、Hooks、Subagents、MCP、插件、LSP、Mods）是目前最完整的。

## 2. 模型与价格（v2.1.280–2.1.284 changelog）

| 模型 | ID | 上下文 | 价格（输入/输出，每百万 token） | 缓存读取 |
|---|---|---|---|---|
| Fable 5.1 | `claude-fable-5-1` | 1M | $10 / $50 | $0.25 |
| Opus 5.5（默认 Opus） | `claude-opus-5-5` | 1M | $4 / $20 | $0.20 |
| Sonnet 5.5（默认 Sonnet） | `claude-sonnet-5-5` | 1M | $2 / $10 | $0.20 |

- `/model` 切换模型，`/effort` 调推理强度（low → max），`maxEffortLevel` 可设上限。
- 订阅用户（Pro/Max）受 5 小时与每周额度限制，这是社区头号痛点（见 [11](../11-community-pulse.md)）。
- `/cost` 能看到 prompt cache 命中率和缓存未命中的可能原因（v2.1.260）；`promptCacheTtl` 可设为 1 小时。

## 3. 能力全景

### 3.1 指令与记忆
| 机制 | 说明 |
|---|---|
| `CLAUDE.md` | 托管策略 / 用户（`~/.claude/CLAUDE.md`）/ 项目（`./CLAUDE.md` 或 `./.claude/CLAUDE.md`）/ 本地（`CLAUDE.local.md`）四层；支持 `@path` 导入 |
| **AGENTS.md** | v2.1.277 起：项目**没有** CLAUDE.md 时读取 AGENTS.md；两者都有时默认只读 CLAUDE.md。可在 `/config` → Project instructions 改为 `claude-md-and-agents-md` |
| `.claude/rules/*.md` | 用 `paths:` glob 让规则只在处理匹配文件时加载 |
| 子目录 CLAUDE.md | Claude 读到该目录文件时按需加载；`claudeMdExcludes` 可排除不相关的 |
| Auto memory | Claude 自己记录的经验（按仓库存储，worktree 间共享），每次加载前 200 行或 25KB |

### 3.2 扩展
| 机制 | 何时用 | 上下文成本 |
|---|---|---|
| Skills | 可复用的流程、领域知识 | 低：常驻的只有描述 |
| Subagents | 隔离大量中间结果（检索、评审） | 与主会话隔离 |
| Hooks | 必须每次执行的规则 | 零（除非返回内容） |
| MCP | 连接外部系统 | 低：启动时只加载工具名，schema 按需加载 |
| LSP 插件 | 跳转定义、查引用、编辑后诊断 | 低，而且能减少文件读取 |
| 插件 | 打包分发以上所有东西 | 取决于内容 |
| Output style | 全局改变语气、长度、格式 | 每次请求都有 |
| Mods（v2.1.287） | 用 TypeScript 改界面（面板、按钮）和更深层的行为 | — |

### 3.3 并行与自动化（5 种并行方式）
| 方式 | 一句话 | 状态 |
|---|---|---|
| Subagents | 会话内委派，返回摘要 | 稳定 |
| Agent View（`claude agents`） | 一个界面派发、监控多个后台会话 | 研究预览 |
| Agent Teams | Lead 分配任务，队员互发消息、共享任务列表 | 实验，默认关闭；**不自动用 worktree 隔离** |
| Dynamic Workflows | Claude 写脚本编排大量子 Agent，并交叉验证结果 | 稳定（`/workflows`） |
| Projects | claude.ai/code 或桌面 App 里的长期对话，在云端开并行线程 | 公测（Pro/Max） |

配套：`--worktree`（`-w`）、`worktree.sparsePaths`（大仓库稀疏检出）、跨会话消息、`/batch`（把一个大改动拆给 5–30 个 worktree 子 Agent）、`/loop` 与 Routines（定时）、`/goal`（设完成条件，由独立评估器每轮检查）、Monitor 工具（订阅后台脚本事件）。

### 3.4 评审与安全
- `/code-review`（新鲜上下文找 bug，`--max-findings` 控制数量）、`/code-review ultra` 和 `claude ultrareview`（云端多 Agent 深度评审，可在 CI 里跑）、`/security-review`、`/simplify`。
- **Auto mode**（v2.1.283 起为交互会话默认）：分类器代替人工审批，详见 [06](../06-hooks-and-guardrails.md#4-auto-mode实测数据)。
- 沙箱：macOS Seatbelt / Linux bubblewrap，可设网络白名单（`sandbox.network.strictAllowlist`），可屏蔽凭证（`sandbox.credentials`）。
- `--safe-mode`：禁用所有自定义内容排查问题；`--restricted`：去掉执行类工具；`--bare`：脚本调用时跳过 hooks、LSP、插件。

### 3.5 诊断与维护
| 命令 | 用途 |
|---|---|
| `/context` | 看上下文各部分占用 |
| `/doctor prompt-audit` | 检查 CLAUDE.md、Skills、Agents 中“为旧模型写的”提示写法（v2.1.283） |
| `/skill-doctor` | 找出没用到的 Skill 及其上下文成本 |
| `/insights` | 回顾近期会话，估算 auto mode 能省掉多少次确认 |
| `/fewer-permission-prompts` | 扫描历史，生成只读命令白名单 |
| `claude plugin validate / eval` | 校验插件，并对插件跑评测打分 |

## 4. 用法要点（官方最佳实践精华）

1. **给它一个能自己跑的检查**：测试、构建退出码、截图对比。约束力从弱到强：写在提示里 → `/goal` → Stop hook → 独立验证子 Agent。
2. **探索 → 计划 → 实现 → 提交**。一句话能说清的改动就跳过计划。`Ctrl+G` 可以在编辑器里直接改计划。
3. **大功能先让它采访你**：“用 AskUserQuestion 详细采访我……最后写成 SPEC.md”，然后**开新会话**按 Spec 实现。
4. **积极管理上下文**：不相关的任务之间 `/clear`；同一问题纠正两次还错，就 `/clear` 后用更好的提示重来；`/btw` 问的问题不进入上下文。
5. **CLAUDE.md 逐行问自己**：“删掉这行会不会出错？”不会就删。规则被忽略往往说明文件太长。
6. **优先用 CLI**（`gh`、`aws`……），这是最省上下文的接外部服务方式。
7. **Writer / Reviewer 分离**：一个会话写，另一个新会话审；评审子 Agent 要告诉它“只报影响正确性的问题”，否则会过度挑刺。
8. **批量改动**：先让 Claude 列出文件清单，用 `claude -p` 循环处理；在前 2–3 个文件上调好提示词再全量跑。

## 5. 已知问题与社区反馈

- **额度**：Max 订阅“几天就用完周额度”是 issue 区点赞最高的问题（1498 个赞）；2026-05 到 09 的 +50% 周额度促销结束后争议持续 **[社区]**。
- **质量波动**：“2 月更新后无法胜任复杂工程任务”（583 个赞），以及对“You're absolutely right!”式附和、口头禅的抱怨 **[社区]**。
- **终端体验**：滚动跳动、闪烁类 issue 长期高票（后来推出 fullscreen 渲染器缓解）**[社区]**。
- **checkpoint 不跟踪 Bash 造成的文件改动**，它不能代替 git **[一手]**。

## 6. 推荐起步配置

```bash
# 1. 项目里生成 CLAUDE.md 初稿，再人工删减
/init
# 2. 装对应语言的 LSP 插件（以 TypeScript 为例）
/plugin install typescript-lsp@claude-plugins-official
# 3. 常用官方插件
/plugin install code-review@claude-plugins-official
/plugin install claude-md-management@claude-plugins-official
# 4. 让 Claude 推荐本项目适合的自动化
/plugin install claude-code-setup@claude-plugins-official
```

模板见 [templates/generic](../../templates/generic/)。

## 来源

- [anthropics/claude-code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- 官方文档：[Best practices](https://code.claude.com/docs/en/best-practices)、[Run agents in parallel](https://code.claude.com/docs/en/agents)、[Memory](https://code.claude.com/docs/en/memory)、[Extend Claude Code](https://code.claude.com/docs/en/features-overview)、[Large codebases](https://code.claude.com/docs/en/large-codebases)
- [Mods 源码](https://github.com/anthropics/claude-code/tree/main/mods)
- [GitHub issues（按点赞排序）](https://github.com/anthropics/claude-code/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)
