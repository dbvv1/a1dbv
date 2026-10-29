# 该装哪些 Skill 与插件

**🟡 先按当前任务调用项目已有 Skill，使用其中的项目配方与检查；缺领域知识再取作者 Skill，缺操作能力再补 MCP，插件按实际组件选择。** 主依据是 OpenAI Agents SDK、Next.js、Sentry 的项目配置与真实使用反馈；这条路线仍待本仓新读者完成真实任务验收。

## 第一轮怎么做

适用于已有 Codex／Claude Code 和项目工作区的开发者。先选一个正在做的功能、修复或文档同步任务，保留原验收；无需先安装整套扩展。把方括号替换后交给 Agent：

```text
完成 [真实任务]，保留 [行为／文件／权限边界]，用 [原测试命令或实际操作] 验收。
先按项目指令和当前启用能力，选择覆盖本任务的 Skill，按其允许的调用方式读取正文及必要引用，说明路径与选择理由。
已有配方匹配就执行；没有匹配项，先用现有资料和工具，只在具体缺口处建议一项补充并说明来源、版本与作用域。
按当前授权推进，报告实际产物、检查结果、未完成项和新增步骤。遵守当前项目与宿主权限，不额外复制外部配方的审批流程或发布权限。
```

要显式指定时，Claude Code 在消息开头用 `/技能名` 或 `/插件名:技能名`；Codex 本地用 `$技能名` 或 `/skills` 选择。只有一份文件时可明确要求读取完整路径，记录为手动加载；模板目录中的示例不自动成为当前项目指令。

<a id="先定位实际依赖再选文档或源码"></a>
<a id="领域配方先读安装包不为一项知识装整套流程"></a>

## 什么缺口，补什么

| 当前任务 | 选择与具体动作 | 何时不用 |
|---|---|---|
| 项目检查、文档同步、迁移或发布准备 | 复用项目 Skill 的任务入口、资源和真命令；例如审计只报，已授权修改直接完成 | 外部配方的审批、发布或环境约定不匹配；只取适用部分 |
| 不清楚库 API 怎么组合 | 取对应库作者的任务配方；已有 TanStack Router 可读包内 `search-params`，按[消费包解析命令](../05-skills-and-plugins.md#领域配方先读安装包不为一项知识装整套流程)加载 | 没用该库，或对应版文档／现成实现已够用 |
| 总写旧 API | 试 Context7：实际依赖版本 → `resolve-library-id` → 列表中的精确版本 ID → `query-docs` → Source 原文 | 目标版未收录就查官方原文／安装源码；有 alias／patch 时先[定位实际依赖](../05-skills-and-plugins.md#先定位实际依赖再选文档或源码)，不上传专有代码 |
| 宿主缺所需符号编辑 | 试 Serena：先读当前方法，再按文件＋符号编辑、审 diff、跑测试 | 原生 IDE／LSP 已够用，或同一方法正被并发修改 |
| 需求未决或已有计划需要持续执行 | 试 Superpowers 对应 Skill；设计、当前会话执行、逐任务子代理按需要选择 | 清楚的小修不新装整套；不要全局强制完整流程 |
| 多人／多客户端复用同一配方 | 先将选定 Skill 与资源入 Git；有分发维护负担再评估插件／管理器 | 一份资料无需引入额外 Hook、服务和版本维护 |

**分开检查调用和任务结果。** 名称可见先记发现成功；本轮正文返回或客户端明确记录才确认加载，手动读文件按手动加载记录。随后核产物与原测试，记录采用的配方、漏项和新增等待、人工处理；只多了步骤、错误审批或漏改，就缩窄触发或退回原做法。证据不可见就记加载未确认，任务通过不反推自动触发或净收益。

## 安装或加载卡住时

Claude Code 首次试用可在目标仓库交互终端运行 `/plugin install context7@claude-plugins-official` 或 `/plugin install superpowers@claude-plugins-official`，先核组件，再选 **Install for you, in this repo only（local scope）**。project scope 是供协作者共享的配置。Context7 官方包使用远程 HTTP MCP，无需本地 Node.js；已有同名 MCP 就沿用。按安装摘要完成加载，普通终端以 `claude plugin list` 核版本、作用域和启用状态。

Codex 官方扩展从 CLI `/plugins` 或桌面 Plugins → OpenAI 查看，安装后开新会话；IDE 当前支持本地 Skill、尚不支持插件。其他宿主分别按 [Context7](https://github.com/upstash/context7)／[Superpowers](https://github.com/obra/superpowers/blob/v7.0.1/README.md#installation) 官方入口，不套用 Claude 命令。

ChatGPT 桌面用 `@` 选择独立或插件 Skill；网页／手机用 `@` 选择启用插件中的 Skill，排除 `Desktop only`。只有本机独立文件时改用桌面端，或打包成支持目标客户端的插件。

Serena 2.1.1.dev0 新配置默认 REPL，独立符号工具需 `--agent-interface tools`；先读 `initial_instructions`，入口见[符号编辑记录](../../experiments/serena-symbol-edit.md#研究记录固定环境与执行细节)。Superpowers 7.0.1 从 `using-superpowers` 分流：清楚小任务可走适用调试／测试，未定需求走 `brainstorming`，已有计划且不需逐任务独审走 `executing-plans`；完整分支见 [24](../24-community-workflows.md#2-superpowers重点看-skill-之间怎样衔接)。

加载失败先核客户端、名称、元数据和作用域：Codex 核当前目录到仓库根的 `.agents/skills` 与 `name`／`description`；Claude 的 `Shell command failed for pattern "..."` 要查注入命令，正文尚未加载。权限拒绝停对应动作，写入结果不明先核副作用，不靠重装或扩权修复。跨客户端路径与权限边界见 [05](../05-skills-and-plugins.md#能加载不等于权限语义可移植)。

**入口依据**：[Claude 安装与作用域](https://code.claude.com/docs/en/discover-plugins)、[Skill 调用与注入失败](https://code.claude.com/docs/en/skills)、[OpenAI 客户端与发现](https://learn.chatgpt.com/docs/build-skills)、[插件范围](https://learn.chatgpt.com/docs/plugins)、[Context7 固定配置](https://raw.githubusercontent.com/anthropics/claude-plugins-official/ab024cdcfa7ca80be204acd4907656ba5a968589/external_plugins/context7/.mcp.json)、[Superpowers 7.0.1](https://github.com/obra/superpowers/blob/v7.0.1/skills/using-superpowers/SKILL.md)；原核实 2026-10-28，Serena 2026-10-24～27。安装界面及各客户端完整任务调用待验。

## 推荐依据与本仓试用范围

**项目主依据**：[OpenAI Agents SDK 的按改动触发](https://github.com/openai/openai-agents-python/blob/cd26bbbc52847845fde73b9952b51e62e2bcbdc0/AGENTS.md#L25-L34)、[Next.js 的任务型 Skill](https://github.com/vercel/next.js/blob/7fd2d0a69534e26cfa10c7c11acc7c8450bf7cd5/.agents/skills/README.md#L5-L17)、[Sentry 的入 Git 共享](https://github.com/getsentry/sentry-javascript/blob/b722d3cfde2f4484ff8928bdd166f7afc3cadb25/agents.toml#L1-L19)。这是项目配置与工作方式证据，非通用提效排名；选择理由与移植反例见 [05 首屏](../05-skills-and-plugins.md#主依据项目怎样用而不是装了多少)。核实 2026-10-29。

**使用者正反反馈**：[Luca 9 月 iOS 实践](https://www.lucavallin.com/blog/how-i-actually-use-claude-code)报告用 Superpowers 完成真实功能，并按任务分流；[V2EX 7 月讨论](https://v2ex.com/t/1227194)既有小改动被流程拖慢，也认可详细计划便于交给另一模型。[Supabase #83](https://github.com/supabase/agent-skills/issues/83)是采用者转贴的自动审查报告；其中驱动选项与约束检查两项已对照[固定源码](../collaboration/inbox.md)，其余待核。保留有用步骤，逐项核实际接口；个人耗时仅作选择线索。原文核实 2026-10-29。

**本仓只作佐证**：下列已记录的是窄能力，而非整套推荐收益。Context7 [精确版本查询](../research/2026-10-22-frontier-trials.md#context7精确版本查询实试)通过；10-27 复核所需 coverage 6.5.0／7.8.2／7.17.0 未收录，沿用源码。TanStack 为手动加载后的功能验证；Serena 为直接 MCP 操作，模型／IDE 客户端业务效果待验。Codex CLI 0.164.0 隔离探针只验发现、元数据／文件缺失和刷新恢复。主推荐保留 🟡，不以这些结果替代新的真实读者任务。
