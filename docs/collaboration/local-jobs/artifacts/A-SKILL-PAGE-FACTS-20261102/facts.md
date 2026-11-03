# A-SKILL-PAGE-FACTS-20261102 · 核心推荐事实核查

核对对象：`docs/decisions/skills-and-plugins.md@74be0d09b201cc0aacf925625899cf2d9bd03d3d`；核对时间 2026-11-03（UTC+8）。本单元只核任务限定的六处：“现在选什么”六行、Context7 精确版本入口、TanStack 作者窄 Skill、Serena 符号编辑前提、Superpowers local scope、已启用项目 Skill 的复用条件。页面仍为 🟡；事实核查不等于新读者采用通过。

## 会影响读者操作的差异

**未发现需要在页面改写推荐、版本号或作用域的公开事实错误。** 六处核心主张都有固定版本源码、官方文档或可读记录支持。需要负责人决定的是三处记录精度，而非推翻结论：

- **Context7 的 coverage 未收录是提交当时的时点结论，日期口径需注明。** 提交 `3228be41` 的作者日期是 2026-10-27T13:48-07:00（UTC+8 为 10-28），页面写“10-27”但未注时区；若页面统一按 UTC+8，应改为 10-28 或加时区。该提交说明和当时正文记录（`coverage 6.5.0／7.8.2／7.17.0` 均未出现在 `resolve-library-id` 返回的版本中）可支持当时的结论，但原始 resolve 返回未入库。读者不能据此推断 2026-11-03 仍未被收录；建议保留“复核当时”的时间限定，或补上原始返回。
- **V2EX 1227194 本轮未能重读原文。** 直连被 TLS 证书错误拒绝，未绕过。页面转述与仓内 2026-10-12 记录一致（API 核到第 7 条 deplives 报告卸载后完成小改动、第 10 条 1874w 描述 Codex 规划后交较低模型实施）；“认可”是仓内归纳，不作为本轮独立重读。保留链接与缺口。
- **两处版本／归属精度，不改变操作。** Serena 的“2.1.1.dev0 新配置默认 REPL”已对当前模板核实；符号编辑实试实际跑的是 2.1.0，两版模板都写 `agent_interface: REPL`。Context7 插件是 Anthropic 官方市场收录、Upstash 维护的外部插件；若“官方”要表达 Anthropic 自研，应改为“官方市场收录”。

## 核实表

| 页面原句／位置 | 对应原始来源（固定版本／日期） | 确认或更正 | 仍缺什么 |
|---|---|---|---|
| “现在选什么”第 1 行：“🧪 Context7：先确认实际依赖，再查返回列表中的精确版本” | 官方市场固定配置 `.mcp.json` 与 `plugin.json`，`anthropics/claude-plugins-official@ab024cdc`；插件 README 同 commit。2026-11-03 重核 | 确认。插件工具为 `resolve-library-id`（返回可用版本）→ `query-docs`；页面顺序与官方 README 一致 | 版本覆盖随时间变化；某版本当前是否收录仍需实际查询 |
| Context7 安装与作用域：“/plugin install context7@claude-plugins-official”“选择仅自己、仅当前仓库的 local scope”“project scope 写入供协作者共享的仓库配置”“claude plugin list 核版本、作用域与启用状态” | Claude Code 官方文档“Install and manage plugins”：`local` 为“Install for you, in this repo only”，写入 `.claude/settings.local.json`；`project` 写入提交的 `.claude/settings.json`；`claude plugin list` 打印 `Version`／`Scope`／`Status`。2026-11-03 读当前页 | 确认。安装摘要的 “Active now”／“Run /reload-plugins” 也与页面“按安装摘要完成加载”一致 | 安装界面未实跑；本次只核文档，未安装插件 |
| Context7：“官方配置是远程 HTTP MCP，无需本地 Node.js；只传通用问题、库名和版本” | `plugin.json` 描述：“hosted remote MCP server … no local Node.js or npx required”；`.mcp.json` 为 `"type": "http"`、`https://mcp.context7.com/mcp?client=claude-code-plugin`，同 `ab024cdc` | 确认。限定在 Claude 插件入口；Context7 的 `ctx7` CLI 路径另要求 Node.js 22.13+，不能据此推断所有入口都不要 Node | “只传通用问题、库名和版本”是使用边界建议，官方插件页没有同等措辞；按本仓既有隐私边界保留 |
| “本仓 10-23 精确版本查询通过” | `docs/research/2026-10-22-frontier-trials.md#context7精确版本查询实试`：10-22 19:40–19:43 UTC（UTC+8 为 10-23）向 `mcp.context7.com/mcp` 发 5 次匿名 JSON-RPC，均 HTTP 200；Pydantic v1.10.18／v2.9.2 的 `dict()`／`model_dump()` 与源链接一致 | 确认。日期按 UTC+8 表述无冲突 | 未重跑；匿名限额、长期新鲜度与模型收益仍未知 |
| “10-27 用已完成的 testmon 任务复核时，所需 coverage 6.5.0／7.8.2／7.17.0 未收录，沿用对应版源码” | 提交 `3228be41`（作者日期 2026-10-27T13:48-07:00；UTC+8 为 10-28）说明与当次页面正文：三个版本“均未出现在 `resolve-library-id` 返回的可选版本中”；testmon 任务本身见 `experiments/testmon-outer-coverage/README.md` | 确认结论；日期口径见“会影响读者操作的差异”一节。`experiments/testmon-outer-coverage/README.md` 只记录这些版本用于跑回归，不记录 Context7 查询 | 原始 `resolve-library-id` 返回未入库；无法复核今天是否已收录，也不应把时点结论写成长期事实 |
| “现在选什么”第 2 行：“已有 TanStack Router 就读下方 `search-params`，无需另装插件” | `TanStack/router@6b9fe6d2` 的 `packages/router-core/skills/router-core/search-params/SKILL.md`；同 commit `package.json` 的 `files` 含 `skills`，版本 `1.171.39` | 确认。包内确有该 Skill；页面给出的解析路径与包布局一致 | Skill 元数据 `library_version` 仍为 `1.171.15`，与包版本 `1.171.39` 不一致；页面已如实保留此限制 |
| TanStack：“pnpm list 默认只列直接依赖……加 `--depth Infinity`（或改用 `pnpm why @tanstack/router-core`）”；Node 从消费包解析，不假设顶层 hoist；退出码 2／3／4 分别表示缺 Router／缺 core／包内无 Skill | pnpm 官方 `pnpm ls` 文档：默认 `--depth 0`，只列直接依赖；`A-SKILL-PACKAGE-ENTRY-20261030` 的 pnpm 11.21.0 实跑与合成布局分支记录 | 确认。pnpm 默认深度和回退命令均与官方文档、仓内实跑一致；退出码分支与脚本实现一致 | pnpm 的新版本未逐版重跑；脚本读取成功只代表正文进入终端，不代表 agent 自动加载 |
| “本仓 10-23～24 手动加载 core 1.171.39 的配方……通过测试、构建与真实 Chrome 操作”“本次入口独立复核覆盖合成提升、嵌套、符号链接布局和缺失分支；真实 pnpm 安装未独立复验” | `experiments/tanstack-url-state/README.md`、`verification.json`、`browser-acceptance.json`；`A-SKILL-PACKAGE-ENTRY-20261030` 的缺失分支记录（缺 Router／core／Skill 分别退出 2／3／4） | 确认。版本 `@tanstack/react-router@1.170.46`、`@tanstack/router-core@1.171.39`，测试／构建与真实 Chrome 记录齐全；“缺失分支”有独立复核记录 | 未做模型有无 Skill 对照；真实 pnpm 下 Intent 分支未单独实测 |
| “现在选什么”第 3 行与 Serena 段：“2.1.1.dev0 新配置默认 REPL，独立符号工具需 `--agent-interface tools`”“先读 `initial_instructions`” | Serena `main@ede329aa`（`pyproject.toml` 为 `2.1.1.dev0`）：`src/serena/resources/serena_config.template.yml` 的 `agent_interface: REPL`；`src/serena/cli.py` 的 `--agent-interface` 帮助；`system_prompt.yml` 要求先调 `initial_instructions`。v2.1.0 tag 模板同为 REPL | 确认。“新配置”指模板生成的新配置；旧配置缺字段时 `serena_config.py` 仍回退 `TOOLS`，页面没有把旧配置说成 REPL。`--agent-interface tools` 确为一工具一操作入口 | 符号编辑实试跑的是 `2.1.0`（`experiments/serena-symbol-edit.md`），不是 `2.1.1.dev0`；建议句末标出这一版本差。模型／IDE 客户端与业务收益未验 |
| “现在选什么”第 4 行：“🧪 Superpowers：Claude Code 按下文 local scope 在当前仓库试用；已装者按任务分流” | Superpowers `v7.0.1` 的 `README.md`、`skills/using-superpowers/SKILL.md`；Claude 官方插件作用域文档（2026-11-03 当前页） | 确认。`/plugin install superpowers@claude-plugins-official` 是官方市场入口；local scope 是“个人＋当前仓库”，project scope 才写共享仓库配置 | 安装界面未实跑；本次未安装或运行 Superpowers。project scope 只写共享 `.claude/settings.json`，不会替协作者下载插件；官方文档要求各协作者再执行一次 `claude plugin install ... --scope project`，页面未展开，但不影响个人试用选 local scope 的建议 |
| “已装 Superpowers，先经 `using-superpowers` 选择适用 Skill：清楚的小 bug 不必进入完整设计流程……需求未决用 `brainstorming` 设计并取得批准；已有计划且不需逐任务独审，用 `executing-plans` 在当前会话实施，保留整分支审查与测试” | 同 `v7.0.1`：`brainstorming/SKILL.md` 明写“Get their approval of that doc”；`executing-plans/SKILL.md` 明写“no implementer subagent per task, no reviewer per task. One fresh-context review of the whole branch at the end”；`using-superpowers/SKILL.md` 的 “Fix this bug” 路由到调试 Skill | 确认。三条路由与各自 Skill 正文一致；“不需访谈时明确退出问答”对应 `brainstorming` 的 “If they opted out of the questions, the skill is done” | 当前版模型效果未试用；页面已如实标注 |
| “Luca 9 月 iOS 实践保留 Superpowers、Context7、Serena，也清理闲置扩展” | Luca Cavallin 博客，发布日期 `2026-09-16`；正文保留三者并删除未用插件包、闲置框架 Skill 等 | 确认。三项保留与“清理闲置扩展”都能在原文找到 | 个人实践，未隔离插件净收益；不能替代本仓试验 |
| “V2EX 使用者既报告小改动被流程拖慢，也认可详细计划便于交给另一模型实施” | `https://v2ex.com/t/1227194`；本轮直连被 TLS 证书错误拒绝。仓内记录见 `docs/research/2026-10-12-community-source-records.md`（API 核第 7 条 deplives 报告卸载后完成小改动、第 10 条 Codex 规划后交较低模型）与 `docs/research/2026-10-22-frontier-trials.md` 的“认可计划交接者”归纳 | 部分确认。仓内记录支持“小改动流程成本”和“计划交接”两类声音；“认可”是归纳词，本轮未读原帖原句 | 原帖当前内容未重读；不能用一条自述换算好评率或当前版本胜负 |
| “现在选什么”第 5 行与依据：“先复用项目 Skill：按 `AGENTS.md` 的触发条件读对应 `SKILL.md`，选定流程入 Git”；“团队流程借用 OpenAI Agents SDK 的按改动触发和 Sentry JavaScript 的入 Git 共享，不复制整包” | OpenAI Agents SDK `AGENTS.md@cd26bbbc`：“Repository skills are stored under `.agents/skills/` … Read the selected `SKILL.md`”，并按 runtime／docs-only 等改动条件限定；Sentry JavaScript `agents.toml@c125a5da`：`gitignore = false`，注释“Check skills into git so collaborators get them without running 'dotagents install'” | 确认。两套样本分别支持“按改动触发”和“入 Git 共享”；页面没有把整套流程说成已在本仓采用 | 本仓未试用这两套项目流程；OpenAI Agents SDK 的本仓运行证据按任务边界留给负责人回核 |
| “现在选什么”第 6 行与共用 Skill 段：“先核目标路径；dotfiles 父链接断链时，对单个 Skill 用 copy”“`skills add <该Skill目录> --global --agent claude-code codex --copy`”“`skills list --global --agent claude-code --json`” | `vercel-labs/skills@a80e4c9` 的 `README.md`、`docs/commands.md`、`package.json`（版本 `1.7.4`）；`#481` 标题确认父目录为链接时断链；`#2283` 仍为 Open。仓内 `experiments/skills-linked-parent/README.md` 与 `results.json` | 确认。`--global`、多 `--agent`、`--copy`、`list --json` 与 `agents` 字段都有文档或源码依据；1.7.4 实跑记录与页面数字一致；PR #2283 未合并 | 未验原生 Windows／macOS；未启动 Claude／Codex 模型，文件可读不等于客户端采用 |

## 固定来源

- Context7 插件：[.mcp.json](https://github.com/anthropics/claude-plugins-official/blob/ab024cdcfa7ca80be204acd4907656ba5a968589/external_plugins/context7/.mcp.json)、[plugin.json](https://github.com/anthropics/claude-plugins-official/blob/ab024cdcfa7ca80be204acd4907656ba5a968589/external_plugins/context7/.claude-plugin/plugin.json)、[插件 README](https://github.com/anthropics/claude-plugins-official/blob/ab024cdcfa7ca80be204acd4907656ba5a968589/external_plugins/context7/README.md)；[Claude 插件作用域](https://code.claude.com/docs/en/discover-plugins)，2026-11-03 读当前页。
- TanStack：[search-params/SKILL.md](https://github.com/TanStack/router/blob/6b9fe6d29552270836c511bc9b343d73541f4424/packages/router-core/skills/router-core/search-params/SKILL.md)、[router-core/package.json](https://github.com/TanStack/router/blob/6b9fe6d29552270836c511bc9b343d73541f4424/packages/router-core/package.json)；[pnpm ls](https://pnpm.io/cli/list)。
- Serena：[2.1.1.dev0 配置模板](https://github.com/oraios/serena/blob/ede329aaf0c824bea75455a2926f01420d7aa620/src/serena/resources/serena_config.template.yml)、[cli.py](https://github.com/oraios/serena/blob/ede329aaf0c824bea75455a2926f01420d7aa620/src/serena/cli.py)、[system_prompt.yml](https://github.com/oraios/serena/blob/ede329aaf0c824bea75455a2926f01420d7aa620/src/serena/resources/config/prompt_templates/system_prompt.yml)；[v2.1.0 模板](https://github.com/oraios/serena/blob/v2.1.0/src/serena/resources/serena_config.template.yml)。
- Superpowers：[v7.0.1 README](https://github.com/obra/superpowers/blob/v7.0.1/README.md)、[using-superpowers](https://github.com/obra/superpowers/blob/v7.0.1/skills/using-superpowers/SKILL.md)、[brainstorming](https://github.com/obra/superpowers/blob/v7.0.1/skills/brainstorming/SKILL.md)、[executing-plans](https://github.com/obra/superpowers/blob/v7.0.1/skills/executing-plans/SKILL.md)；[官方市场固定清单](https://github.com/anthropics/claude-plugins-official/blob/ab024cdcfa7ca80be204acd4907656ba5a968589/.claude-plugin/marketplace.json)。
- 项目 Skill 复用：[OpenAI Agents SDK AGENTS.md](https://github.com/openai/openai-agents-python/blob/cd26bbbc52847845fde73b9952b51e62e2bcbdc0/AGENTS.md)、[Sentry JavaScript agents.toml](https://github.com/getsentry/sentry-javascript/blob/c125a5da2e6b7d916a5880f65876cddfee96c56d/agents.toml)。
- skills CLI：[1.7.4 README](https://github.com/vercel-labs/skills/blob/a80e4c9d12d607631249d4d7d059f835d4b2f13a/README.md)、[commands](https://github.com/vercel-labs/skills/blob/a80e4c9d12d607631249d4d7d059f835d4b2f13a/docs/commands.md)、[#481](https://github.com/vercel-labs/skills/issues/481)、[#2283](https://github.com/vercel-labs/skills/pull/2283)。
- 第三方与社区：[Luca Cavallin，2026-09-16](https://www.lucavallin.com/blog/how-i-actually-use-claude-code)、[V2EX 1227194](https://v2ex.com/t/1227194)（本轮直连受阻）。

## 未核范围

- 任务限定之外的页面段落未逐项重核：ECC search-first、Cursor 云端 Skill、OpenSpec／Pi、Intent 全局发现、opensrc 依赖定位，以及“已安装却没用起来”的客户端调用表。它们不进入本轮结论，也不因本轮通过而升级评级。
- 未安装或运行任何插件、MCP、Hook、客户端或嵌套模型；未访问凭据、私人会话或账号用量；未绕过 V2EX 等受限来源的拦截。
- 未重跑 TanStack 实验、Serena 符号编辑实验或 skills-linked-parent 实验；相关结论沿用仓内既有实跑记录，只补核版本与来源文本。

## 检查

- `python3 scripts/check_repo.py`：exit 0，709 个文件，`errors: []`。
- `python3 scripts/check_public.py`：exit 0，1170 个已跟踪文件，`findings: []`。新产物在检查时还未被 Git 跟踪；另用同一组模式单独扫描 `facts.md`，无命中。接收端 `git add` 后应再跑一次。
- `git diff --check`：新文件用 `git diff --no-index --check /dev/null <facts.md>` 检查，无空白错误；文件为 UTF-8、LF、无 BOM。
- 提交身份：`python3 scripts/check_public.py --commits origin/main..HEAD` exit 0；当前分支相对 `origin/main` 还没有新提交。
- 提交与推送由接收端执行；本单元只改文件，不提交、不推送。
