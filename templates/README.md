# 配置模板

**已有配置先保留，只合并当前任务缺少的入口或组件。** 新项目从 `generic/AGENTS.md` 填真实命令与边界开始；只缺决策建议时，直接用[核心决策最小包](#核心决策最小包)。需要中断恢复或多项验收，再选 Codex Skill 或 long-task 示例。各目录都是供目标项目审查采用的示例，依据见 [docs/](../docs/)。

| 目录 | 用途 | 拷贝到 |
|---|---|---|
| [`generic/`](generic/) | **任意项目通用**的 AI 协作配置 | 项目根目录 |
| [`global/`](global/) | 个人全局偏好 | `~/.claude/CLAUDE.md` |
| [`codex/`](codex/README.md) | Codex 配置、角色与两项窄触发 Skill；运行时未实测 | 按需合并，不覆盖已有配置 |
| [`long-task/`](long-task/README.md) | 独立验收 spec、执行报告与合成正反例 | 需要恢复/多项验收的任务目录 |
| [`../domains/game-dev/unity/templates/`](../domains/game-dev/unity/templates/) | Unity 项目（在 generic 基础上增加的部分） | Unity 项目根目录 |
| [`../domains/game-dev/unreal/templates/`](../domains/game-dev/unreal/templates/) | Unreal 项目（在 generic 基础上增加的部分） | UE 项目根目录（`.uproject` 所在目录） |

## 使用步骤

1. **先看目标项目已有配置**。已有 `AGENTS.md`、`CLAUDE.md`、`.claude/settings.json` 时逐项合并；不要整包复制覆盖。旧版 `cp -r` 用法已在临时项目复现会丢失原指令与拒绝规则，见[审计](../docs/collaboration/reviews/2026-10-13-331e093.md)。
2. **从一个指令入口开始**。按 [generic/AGENTS.md](generic/AGENTS.md) 填项目特有命令和约定，删除 TODO；Claude Code 用户按需加导入入口。不默认复制整套 `.claude`。
3. **出现具体缺口再加组件**。需要事件路径检查才审查、合并 Hook 注册与规则，并给已选择的脚本执行权限；需要独立验收才加 reviewer/verifier；现有搜索不足再评估 LSP。角色默认 `inherit`，不因复制模板静默改成 Sonnet。
4. 在目标客户端确认实际加载的指令、所选 Skill/角色及有效权限；再用该组件针对的任务验证允许、拒绝和失败情况。只在列表中看见名称不代表行为已经有效。
5. 保留能改善任务的内容，删除重复或无收益配置。独立审查和访谈都是可选组件，不是采用本模板的前提。

> 只用 Codex 可先采用 `AGENTS.md`，再按需读 [Codex 适配说明](codex/README.md)。Skill 核心格式可移植，不代表 `.claude/skills` 发现路径、扩展字段、工具名和权限行为都相同；Hooks 和 settings 也需按运行时验证。

## 核心决策最小包

已有工作流只缺决策建议时，不用复制整个 `generic/`。最小完整包是以下三个文件，无脚本、Hook、MCP 或模型配置依赖：

| 来源 → 目标项目相对路径 | 采用方式 |
|---|---|
| `generic/AGENTS.md` → `AGENTS.md` | 空项目填真实命令与边界、删除注释和 TODO；已有项目只合并缺少的条件建议，保留原约束 |
| `generic/CLAUDE.md` → `CLAUDE.md` | Claude Code 按需合并 `@AGENTS.md` 与专属增量；已有导入不重复添加，其他客户端无需此入口 |
| `generic/.claude/skills/task-decisions/SKILL.md` → `.claude/skills/task-decisions/SKILL.md` | 保留相对路径以匹配 AGENTS 链接；同名 Skill 已存在时先比差异，不覆盖 |

只用 Codex 可省去 CLAUDE.md：用户需要调整工作方式时显式指定读取 Skill 正文，不假定 Codex 会发现 `.claude/skills`。Claude Code 的 `/task-decisions` 也仅由用户显式调用；普通明确修改直接做。正文自包含，不需要把本知识库一起放入项目。

采用后在目标客户端核实际加载，再用一个原有任务确认检查和权限没有退步；未试运行就标“未验证”。要判断是否比原配置好，另做有／无包成对任务并记录返工，不能拿复制成功或下方离线回归当模型收益。原配置保留可恢复副本，无净收益或必要行为退步就撤回新增内容。

## generic 内容

```
generic/
├── AGENTS.md                      # 跨工具项目指令骨架（填 TODO）
├── CLAUDE.md                      # 导入 AGENTS.md，加上 Claude Code 专属约定
├── REVIEW.md                      # 给 AI 评审者的规则：严重度、证据门槛、Nit 上限、复审收敛
├── .mcp.json.example              # 项目级 MCP 示例（Context7、Playwright）
└── .claude/
    ├── settings.json              # 权限（push 需确认；受覆盖入口拒读密钥和生成物）+ 编辑 Hook 注册
    ├── protected-paths.txt        # 受保护路径规则：deny / ask + glob + 原因
    ├── hooks/protect-paths.sh     # PreToolUse Hook：按规则拦截编辑（依赖 jq 或 python3）
    ├── agents/
    │   ├── code-reviewer.md       # 只报告正确性问题的评审者（避免过度挑刺）
    │   └── verifier.md            # 尝试推翻“已完成”的独立验证者
    └── skills/
        ├── spec-interview/        # /spec-interview：访谈式整理需求，输出 SPEC.md
        ├── task-decisions/        # /task-decisions：按当前缺口选择默认与撤回点（显式调用）
        ├── handoff/               # /handoff：写 PROGRESS.md，方便清空上下文后继续
        └── explore-frontier/      # /explore-frontier：先写决定，去最强做法所在处找，再转化成可用做法
```

每个组件对应的依据：

| 组件 | 依据 |
|---|---|
| AGENTS.md 保留任务有用的信息，审查生成内容 | [03 上下文工程](../docs/03-context-engineering.md#22-指令文件到底有没有用研究证据) |
| 对指定编辑事件增加路径检查 | [06 Hooks](../docs/06-hooks-and-guardrails.md)；访问控制仍需运行环境权限 |
| code-reviewer 只报正确性问题 | 官方最佳实践：被要求找问题的评审者会过度报告 |
| verifier 可选独立核对 | 复杂验收时检查当前目标和独立反例；不强制每项任务增加会话 |
| spec-interview | 关键需求不清时借鉴访谈；是否换会话取决于上下文与交接需要，见 [07](../docs/07-workflows.md) |
| task-decisions | 核心12页的条件选择；[最小包](#核心决策最小包)用于按需采用，模型净收益未验证 |
| explore-frontier | 本仓 M6 探索方法的可复用版，两个 dot 与其他会话共用 |
| handoff | 跨会话交接时保存必要进度；同任务腾空间与跨会话恢复的选择见 [03 会话动作分流](../docs/03-context-engineering.md#3-会话层面的上下文管理) |
| CLAUDE.md 的停止规则、TASKS.md、Blocked on me / Changed / Found | Anthropic《Getting the most out of Opus 5.5》 |
| AGENTS.md 不堆重复概览和 lint 规则 | 所引研究在指定样本中未见概览可靠收益；避免复制可由代码获得的信息，不禁止有任务价值的架构地图（[03](../docs/03-context-engineering.md)） |
| 评审只报会拒绝合并的问题，并说明如何证明它会出错 | Anthropic 官方评审提示 |
| REVIEW.md 的结构（严重度、证据门槛、Nit 上限、复审收敛） | Claude Code Review 文档（[09](../docs/09-review-and-quality.md#用-reviewmd-调教评审)） |

## 采用组件前，核对它实际保护什么

**指令与编辑 Hook 只覆盖各自入口；需要硬隔离时，由运行环境落实权限。** 按所选组件核对下表，不因复制模板而扩大授权。

| 所选组件 | 采用前要核对的边界 |
|---|---|
| `settings.json` 与 Git 命令 | 模板不预授权宽泛的 Git 命令模式：例如 `git diff --output=路径` 可以写文件。Git 命令沿用宿主的有效权限 |
| `protect-paths.sh` 与 `Read(...)` 拒绝规则 | Hook 只覆盖所注册的编辑工具；编辑 Hook 与拒绝规则都不覆盖任意 Bash 子进程，不能限制 Bash 写入，也不构成安全沙箱 |
| code-reviewer／verifier | 提示词中的“只读”不是操作系统级只读权限；允许 Bash 的验证过程可能产生构建或临时文件 |
| 路径 Hook 的失败处理 | 无效输入返回状态 1 只是错误报告，默认失败策略不保证阻止操作；须在目标客户端核实际处理 |

路径 Hook 已补充双解析器回归及三份副本一致性检查；盘符与 UNC 仅做合成字符串测试，符号链接和真实客户端仍需目标环境验证。历史“经过测试”指模拟输入，不代表真实引擎、所有操作系统或所有绕过路径均已验证。脚本通过也不证明指令的模型效果或客户端加载有效。复测见 [E6](../docs/19-experiments.md#10-e6路径-hook-的确定性回归)。

## 本仓库验证

完整离线入口需要 Python 3.11+、POSIX、`/bin/bash`、jq 和常用 shell 工具；入口先预检依赖，不自动安装，也不调用模型或游戏引擎：

```bash
python3 scripts/check_offline.py
git diff --check
```

这些检查覆盖文档/config、基础测试、Python/jq Hook、三个实验套件及 shell 语法，补丁空白由 `git diff --check` 检查；不覆盖外链可达性、全部 Markdown 锚点、真实客户端技能加载或真实引擎运行。任一套件零测试、skip、失败或超时均不能完整通过。
