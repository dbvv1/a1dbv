# 该装哪些 Skill 与插件

**🟡 API 总写错版本，试 Context7；缺库的具体做法，读作者窄 Skill；需要按符号替换完整方法，试 Serena；需求未定才试 Superpowers。** 已有工具够用就不装，项目已有 Skill 就复用。本页核心推荐仍待新读者在真实任务上完成验收。

## 现在选什么

| 当前任务 | 推荐与第一步 | 何时不适用 |
|---|---|---|
| Agent 总写旧 API | 🧪 Context7：先确认实际依赖，再查返回列表中的精确版本 | 目标版未收录，或查询要上传专有代码 |
| 不知道怎样组合库 API 做功能 | 🧪 库作者的窄 Skill；已有 TanStack Router 就读下方 `search-params`，无需另装插件 | 没用该库，或对应版本官方示例已够用 |
| 经常替换完整方法，宿主没有符号编辑 | 🧪 Serena：读取当前方法，再按文件＋符号编辑 | 原生 IDE／LSP 已够用，或多人同时写同一方法 |
| 需求或架构未定 | 🧪 Superpowers：Claude Code 按下文 local scope 在当前仓库试用；已装者按任务分流 | 别只为清楚的小 bug 新装整套；⛔ 暂缓全局强制完整流程 |
| 团队反复做项目检查、发布准备或迁移 | 先复用项目 Skill：按 `AGENTS.md` 的触发条件读对应 `SKILL.md`，选定流程入 Git | 一次性小修；别照搬其他项目整套规则 |
| 跨客户端共用 Skill，安装成功却读不到 | 🧪 先核版本与实际路径；旧版父链接断链先试 1.9.0 修复 | 健康链接不改；copy 副本须另行更新 |

**第一步先查已有能力，避免重复安装。** 把方括号换成当前任务：

```text
为 [具体任务] 检查当前已启用的相关 Skill／MCP 与实际依赖版本。
已有能力够用就沿用；否则只建议一项补充，说明理由、来源、作用域及新增 MCP／Hook，先不安装。
确定采用后，用 [项目原测试命令或操作] 验收任务结果。
```

**装扩展前核分发来源，不能只看同名插件或版本号。** 保存取得包的市场／官方入口、版本与可核验标识，更新时也检查来源；遇到安全公告再比对其准确范围。已命中事故的机器不以“升级／卸载成功”结案，先按[分发事故核查](../10-security.md#extension-distribution-incident)处理。这个门槛不要求没有缺口的项目另装扫描器，也不把扫描无报警当安装许可。

团队流程借用 OpenAI Agents SDK 的按改动触发和 Sentry JavaScript 的入 Git 共享，不复制整包。跨客户端分发确有维护负担，再看 [dotagents 候选](../collaboration/inbox.md#2026-10-27dotagents-的项目级-skill-分发)。

**依据**：[一手项目配置] [OpenAI Agents SDK](https://github.com/openai/openai-agents-python/blob/cd26bbbc52847845fde73b9952b51e62e2bcbdc0/AGENTS.md)、[Sentry JavaScript](https://github.com/getsentry/sentry-javascript/blob/c125a5da2e6b7d916a5880f65876cddfee96c56d/agents.toml)；2026-10-28 核实，这两套项目流程未在本仓试用。

<a id="ecc-search-first"></a>
## ECC search-first：复用提醒，不是整包安装理由

**已有项目方法能先查复用，就不为 search-first 装整套 ECC。** [Inspector 同题事后对照](../../experiments/ecc-search-first/README.md)两路都找到现成解析器，也都因空值契约不兼容而不采用；没发现新增可用候选，未测前瞻效率或模型收益。

<a id="skills-linked-parent"></a>
## 共用 Skill：安装成功，还要读到客户端那份

**已知父目录软链接导致断链，先试包含修复的 `skills` 1.9.0，再考虑复制。** 先看 `skills --version`，用 `skills use <实际 Claude 安装路径>` 读正文；仅 `list` 有名字不算成功。对单个已审阅的 Skill 重装后再读，健康链接不必改。

同一隔离 Linux HOME，1.7.4 双客户端安装退出 0，实际 `use` 退出 1；用 1.9.0 原地重装，保留父子链接，`use` 退出 0，正文逐字节一致。暂不能升级且确认是旧版断链，再对单项用 `--copy`；独立副本要显式更新。见 [v1.9.0 修复](https://github.com/vercel-labs/skills/releases/tag/v1.9.0)与[完整旧版对照及新版复验](../../experiments/skills-linked-parent/README.md)。未跑模型采用。

**Codex 已启用 Skill，不等于看到了它声明的 MCP 依赖。** 保留 `SKILL.md` 的名称、描述与共享正文，把 Codex 的 `dependencies.tools` 放到同一 Skill 目录下的 `agents/openai.yaml`。已有获准的 app-server 时，用项目真实目录调用 `skills/list`（`cwds` 指向该目录，`forceReload: true`），核实际 Skill 的 `dependencies.tools`，别只看 `enabled`。Linux 官方 0.171.0 用同名 Skill 前后对照：两次都启用且无发现错误，依赖从 frontmatter 挪到 YAML 后才出现。依据：[官方文件格式](https://learn.chatgpt.com/docs/build-skills#optional-metadata)、[真实缺依赖反馈](https://github.com/openai/codex/issues/62717)；2026-11-21 复跑，只验声明被宿主读到，未发模型轮次或连接 MCP。

<a id="cursor-synced-skill-owner"></a>
## Cursor 云端 Skill：同步会搬位置，Automation 是另一入口

**👀 同一份 Skill 还要供 Claude 使用时，先保现有本地来源；需要项目云任务的部分可放项目 `.cursor/skills/<名称>/SKILL.md`，不要把个人同步当作原目录的镜像。** 入库前检查权限与内容，项目成员会读到它，且作用域只在该项目。本项未试用，仅据当前官方说明与真实用户回执。

个人同步开启后，Cursor 将内容迁入 synced storage，使用的是那里的一份；完成后从 `Customize → Skills` 打开并编辑。继续编辑原同名目录可能不生效，原目录被迁走也会让指向它的 Claude 链接失效。**已卡住且改过文件时，先保全现存副本并比较，不通过反复开关恢复。** 关闭会把存储中的版本搬回，不只是停止上传。原报告中 macOS Trash 留有被替换版本，用户据此补齐恢复；这不是产品已修复或通用云备份保证。

**Automation 不加载个人 synced Skills，即使选 `Run as Me`。** 为 Automation 提供 Skill，应把它放在该任务选定仓库的 `.cursor/skills/`，再在实际运行中验证。手输名称或等 `/` 菜单显示不能补上运行时缺失；官方帖先前“只是自动补全”的回答已撤回。

**依据**：[官方同步与 Automation 契约](https://cursor.com/docs/skills)、[十月共享 Skill／覆盖旧副本报告及员工澄清](https://forum.cursor.com/t/sync-skills-for-cloud-agents-overwrote-local-cursor-skills-with-an-old-snapshot-then-hung-at-50-of-50/174945)、[Automation 原反馈与纠正](https://forum.cursor.com/t/cursor-automations-dont-see-custom-user-skills/174578)。2026-10-31 核原文；覆盖报告为 Cursor 3.24.18／macOS 15.7.9，未找到已修版本，不据单例断言所有版本都会覆盖。

<a id="openspec-pi-discovery"></a>
<a id="pi-与-codex-共用-openspec保留生成文件只限定-pi-的加载"></a>
## Pi 与 Codex 共用 OpenSpec：升级后先撤旧排除

**OpenSpec 2.x 不沿用 Pi 的旧排除。** 2.0 起的项目安装统一用 `.agents/skills/`，不再生成 `/opsx:*`。从 1.x 升级先保全改过的内建 Skill 和附加文件，跑 `openspec update --dry-run` 看将改什么；需要两个客户端从项目读取就用 project scope。用实际客户端核 `openspec-propose`：Pi 用 `/skill:openspec-propose`，Codex 用 `$openspec-propose`。

OpenSpec 1.16.0 → 2.1.1 的真实临时迁移保留 6 个共享 Skill，移除 6 个旧 Pi 命令与 6 个旧 Pi 技能副本。Pi 1.4.0 的 SDK 实际读取：留着旧排除是 0 个，撤掉后 6 个，冲突 0。仅仍用 1.15／1.16 且确认是同名双份的项目，保留[旧版窄排除](../../experiments/openspec-pi-discovery/README.md#哪种选择保留原入口)。见[升级边界](https://openspec.dev/docs/upgrade-to-2)、[2.1.1](https://github.com/Fission-AI/OpenSpec/releases/tag/v2.1.1)及[迁移实测](../../experiments/openspec-pi-discovery/README.md#openspec-2-upgrade-recheck)。未执行模型工作流或 Codex 客户端。

<a id="intent-pnpm-global"></a>
## pnpm 全局装过 CLI，Intent 却找不到 Skill

**Intent 0.3.6／0.5.6 在 pnpm 11 全局列表为空时，先查 `pnpm ls -g` 指到的实际包根。** 每次 `list`／`load` 都用同一个 `INTENT_GLOBAL_NODE_MODULES`；两个根分别查，不拼接，也不改来源限制。[复制命令与实测](../../experiments/intent-global-discovery/README.md#reader-single-root-intent)在实验页，项目依赖不走这个兜底。

## 先定位实际依赖，再选文档或源码

**✅ 查实际行为，从调用方追到已解析包、项目补丁和具体模块；查版本用法，再看官方文档或 Context7。** Zed 的 `reqwest` 实际是重命名 fork，Vite 也有依赖 alias／patch，同名版本不能替代实现定位。

手上已有可构建项目时，沿消费者的实际依赖边核包名、版本、来源和补丁；要判断行为，再读实现并跑当前 target／feature 的消费者检查。[Cargo／jq 离线定位命令与 opensrc 实例](../../experiments/opensrc-ref-integrity/README.md#cargo-resolved-dependency)区分了同名的 blocking／异步 `timeout`。其他生态用项目自己的解析入口。依据：[Zed fork](https://github.com/zed-industries/zed/blob/57c7b10ece671185a8863515667ee5248c6f0d53/Cargo.toml#L864-L872)、[Vite alias／patch](https://github.com/vitejs/vite/blob/e954a9cda0b5254be495a937333a0be1b8503d8f/pnpm-workspace.yaml#L13-L22)。

## 版本 API：用官方 Context7 插件，明确选版本

**查版本文档仍费力时，Claude Code 交互终端打开官方插件详情，选择仅自己、仅当前仓库的 local scope。** 已有同名 MCP 就沿用；其他客户端看 [Context7 官方入口](https://github.com/upstash/context7)。

```text
/plugin install context7@claude-plugins-official
```

确认新增组件后再安装。官方配置是远程 HTTP MCP，无需本地 Node.js；只传通用问题、库名和版本。沿 `resolve-library-id` → 返回列表中的完整版本 ID → `query-docs` → 核对 Source 原文 → 编译／测试；缺目标版就回官方原文或已安装源码。

**依据**：[官方安装与作用域](https://code.claude.com/docs/en/discover-plugins)、[市场固定配置](https://raw.githubusercontent.com/anthropics/claude-plugins-official/ab024cdcfa7ca80be204acd4907656ba5a968589/external_plugins/context7/.mcp.json)，2026-10-28 重核。本仓 [10-23 精确版本查询](../research/2026-10-22-frontier-trials.md#context7精确版本查询实试)通过；10-27 用已完成的 [testmon 任务](../../experiments/testmon-outer-coverage/README.md)复核时，所需 coverage 6.5.0／7.8.2／7.17.0 未收录，沿用对应版源码。安装界面未实跑。

## 领域配方：先读安装包，不为一项知识装整套流程

**已有 TanStack Router，要让筛选在详情、返回和分享链接后保留，先读包内 `search-params`。** 以下 Bash／Zsh 命令都在你自己的应用目录执行：该目录的 `package.json` 声明了 `@tanstack/react-router` 且已安装依赖，不是本仓的 `experiments/tanstack-url-state`。Node 解析从消费包出发，不要求传递依赖提升到根目录。

先在应用目录确认实际安装版本，只读、不安装。`pnpm list` 默认只列直接依赖，看不到传递依赖 `router-core`，pnpm 项目要加 `--depth Infinity`（或改用 `pnpm why @tanstack/router-core`）：

```sh
# npm 项目
npm ls @tanstack/react-router @tanstack/router-core
# pnpm 项目
pnpm list --depth Infinity @tanstack/react-router @tanstack/router-core
```

再从消费包解析传递依赖并只读配方。Node 从 `@tanstack/react-router` 自身的安装位置解析 `@tanstack/router-core`，不假设顶层 hoist：

```sh
node --input-type=commonjs <<'NODE'
const { createRequire } = require('node:module')
const { dirname, join } = require('node:path')
const { existsSync, readFileSync } = require('node:fs')

let routerPkg
try {
  routerPkg = require.resolve('@tanstack/react-router/package.json')
} catch {
  console.error('缺依赖：当前目录解析不到 @tanstack/react-router；按项目原方式安装后再读取，本入口不下载。')
  process.exit(2)
}

const routerVersion = JSON.parse(readFileSync(routerPkg, 'utf8')).version
const router = createRequire(routerPkg)
let corePkg
try {
  corePkg = router.resolve('@tanstack/router-core/package.json')
} catch {
  console.error(`已安装 @tanstack/react-router@${routerVersion}，但解析不到它声明的 @tanstack/router-core。`)
  process.exit(3)
}

const coreVersion = JSON.parse(readFileSync(corePkg, 'utf8')).version
const skill = join(dirname(corePkg), 'skills/router-core/search-params/SKILL.md')
console.log(`@tanstack/react-router ${routerVersion}`)
console.log(`@tanstack/router-core ${coreVersion}: ${corePkg}`)
if (!existsSync(skill)) {
  console.error('已安装该版本，但包内未附 search-params Skill；按对应版本的官方指南或源码核对。')
  process.exit(4)
}
process.stdout.write(readFileSync(skill, 'utf8'))
NODE
```

按退出码区分：`2` 是应用目录缺 Router，先按项目原方式安装，读取入口不下载；`3` 是 Router 已安装但解析不到它声明的 router-core，核对版本与依赖声明；`4` 是该版本包内未附此 Skill，改读对应版本的官方指南或源码；`0` 且输出正文才是读到。读取成功只说明正文进了终端，不等于 agent 自动加载或模型遵守，也不会触发下载或执行配方。

配方组合 `retainSearchParams` 与 `stripSearchParams`：已应用条件从 URL 读，未提交输入另存草稿，清空时显式给默认值。沿应用原有的测试／构建命令验收详情／返回／清空／历史前进后退／分享恢复；本仓同题的[可复制任务与实现](../../experiments/tanstack-url-state/README.md#窄-skill-的复制入口)无需新增 schema 库或全局 hooks。

**依据**：[TanStack 作者 Skill](https://github.com/TanStack/router/blob/6b9fe6d29552270836c511bc9b343d73541f4424/packages/router-core/skills/router-core/search-params/SKILL.md)，2026-10-28 重核固定源码。本仓 10-23～24 手动加载 core 1.171.39 的配方，在上述示例通过测试、构建与真实 Chrome 操作；Skill 元数据仍标 1.171.15，兼容性按当前源码和测试接收。本次入口独立复核覆盖合成提升、嵌套、符号链接布局和缺失分支；真实 pnpm 安装未独立复验。自动触发与收益对照未测。

**官方示例仍让 Agent 漏掉必做项，再单独对照厂商提供的领域能力。** [Stripe 自评](https://stripe.dev/blog/stripe-integration-evals-methodology#detailed-results)用 69 个集成场景、每组重复两次；同题固定首条消息、模型和客户端，两组都可搜网页。Codex GPT-6.1 Sol 加上 Stripe 的 Skill＋MCP 后，所有必做项均通过的比例从 39.0% 升至 50.7%，但每次评估从 6.1 增至 6.5 分钟、$0.51 增至 $0.61，即使网页搜索几乎消失。它只评对话和生成文件，未运行生成的集成，超时不计入评分，也不能分辨 Skill 和 MCP 各自的作用。自己采纳前，先列必须通过的业务行为，用同题两组跑项目的真实流程，把超时、耗时和总成本都记下来；别用少搜网页代替验收。

## 符号编辑与完整流程：只为实际增量留下它们

**Serena 只在宿主缺所需符号操作时试。** 按[实试入口](../../experiments/serena-symbol-edit.md#研究记录固定环境与执行细节)配置项目与语言，先读 `initial_instructions`；2.1.1.dev0 新配置默认 REPL，独立符号工具需 `--agent-interface tools`。读当前正文再替换、审 diff、跑测试；同方法并发先协调，旧正文可能覆盖新修改。原核实 2026-10-24～27。

**Vue 接口查询报 LSP `-32601` 时，先核 Serena 版本。** 上游 [#2242](https://github.com/oraios/serena/pull/2242) 已修，包含该提交的版本不再叠加本仓旧补丁；截至 11-20，最新稳定版 v2.1.0 还不含修复。能用已有 IDE／TS 查询就先沿用，按[Vue 实试](../../experiments/serena-vue-implementation/README.md)核一条真实接口查询；11-20 合并提交定向复跑 55/55，未验模型或 IDE 客户端。

**首次在 Claude Code 试 Superpowers：** 在目标仓库启动 `claude`，用官方入口 `/plugin install superpowers@claude-plugins-official` 打开详情，核新增组件后选 **Install for you, in this repo only（local scope）**。project scope 写入供协作者共享的仓库配置，不是个人试用。按安装摘要完成加载，再在普通终端运行 `claude plugin list` 核版本、作用域与启用状态。其他宿主按[官方安装入口](https://github.com/obra/superpowers/blob/v7.0.1/README.md#installation)，勿套用 [Claude 的作用域](https://code.claude.com/docs/en/discover-plugins#choose-an-install-scope)。

**已装 Superpowers，先经 `using-superpowers` 选择适用 Skill：** 清楚的小 bug 不必进入完整设计流程，但仍按适用的调试、测试 Skill 修复并回归；需求未决用 `brainstorming` 设计并取得批准；已有计划且不需逐任务独审，用 `executing-plans` 在当前会话实施，保留整分支审查与测试。需要逐任务接收才选子代理流程；不需访谈时明确退出问答。

Luca 9 月 iOS 实践保留 Superpowers、Context7、Serena，也清理闲置扩展；V2EX 使用者既报告小改动被流程拖慢，也认可详细计划便于交给另一模型实施。取其任务分流，不把个人耗时当通用收益；当前版模型效果未试用。

**依据**：[Superpowers 7.0.1 适用 Skill 入口](https://github.com/obra/superpowers/blob/v7.0.1/skills/using-superpowers/SKILL.md)、[设计入口](https://github.com/obra/superpowers/blob/v7.0.1/skills/brainstorming/SKILL.md)、[inline 执行](https://github.com/obra/superpowers/blob/v7.0.1/skills/executing-plans/SKILL.md)、[Luca 配置](https://www.lucavallin.com/blog/how-i-actually-use-claude-code)、[V2EX 正反反馈](https://v2ex.com/t/1227194)；2026-10-28 重核安装／作用域、适用 Skill／设计入口与反馈；安装界面未实跑，inline 原核实 2026-10-26。详细分流见 [24](../24-community-workflows.md#2-superpowers重点看-skill-之间怎样衔接)。

## 已安装却没用起来：先分客户端，再核正文

| 客户端 | 显式入口与先查项 |
|---|---|
| Claude Code | `/` 菜单选完整名称并放消息开头，如 `/插件名:技能名 @path/to/file`；核项目作用域、启用状态、是否允许手动调用 |
| Codex CLI／IDE 本地 Skill | `/skills` 或 `$` 选择；核当前目录到仓库根的 `.agents/skills`、元数据和启用状态 |
| ChatGPT 桌面 | `@` 选择独立或插件 Skill，核对应来源是否可用 |
| ChatGPT 网页／手机 | `@` 选择启用插件内的 Skill，排除 `Desktop only`；只有本机独立文件则用桌面端，或打包为支持该客户端的插件 |

Codex 官方扩展从 CLI `/plugins` 或桌面 Plugins → OpenAI 查详情，安装后开新会话；IDE 当前支持本地 Skill、尚不支持插件。Claude Code IDE 审文件时显式给文件与选区；2.1.311 修复过面板漏带输入，旧版尤其要核实际传入内容。

**依次确认发现、正文加载、任务结果。** 名称只说明发现；本轮成功返回的正文或客户端明确加载记录才确认加载，证据不可见就记“加载未确认”；最后按原任务产物和测试接收。失败保留客户端／版本、技能名、来源／作用域与原始错误：缺 `description` 修元数据；Claude 的 `Shell command failed for pattern "..."` 表示该次正文未进入上下文，先查命令输出。写入失败先核副作用，权限拒绝先停该动作；修对应原因后再试，不先重装整包。

**Claude Code 的 linked worktree 更新报最新，分开核安装和使用。** 先核目标路径与 scope 对应的[登记和缓存中的变更文件](../../experiments/claude-plugin-worktree-update/README.md#核对自己的目标目录只读)，再在目标会话验原任务。不要靠 `plugin update` 或 `plugin details` 单独判定：2.1.330 只更新主 checkout，连未更新的独立仓库也能列出新版组件，登记和缓存仍旧。[实跑对照](../../experiments/claude-plugin-worktree-update/README.md#21330复验)核实 2026-11-22，未跑模型。

**依据**：[Claude 调用与生命周期](https://code.claude.com/docs/en/skills#where-you-write-the-skills-name)、[动态命令失败](https://code.claude.com/docs/en/skills#when-an-injected-command-fails)、[OpenAI 客户端与发现](https://learn.chatgpt.com/docs/build-skills)、[插件范围](https://learn.chatgpt.com/docs/plugins)、[Codex 发现接口](https://learn.chatgpt.com/docs/app-server#skills)；2026-10-28 核实。Codex CLI 0.164.0 隔离探针仅验发现、元数据／文件缺失和刷新恢复；各 GUI／CLI 完整任务调用待验。Claude IDE [修复](https://github.com/anthropics/claude-code/blob/08c6a4f5121ae140d3c1b5c96e3e5ae53587b54b/CHANGELOG.md#L83)与[用户对照](https://github.com/anthropics/claude-code/issues/102799)原核实 2026-10-27，未实跑。

Skill 提供做法，MCP 提供能力，插件打包分发。更多宿主差异看 [05](../05-skills-and-plugins.md)，浏览器、数据和运行能力看 [04](../04-mcp.md)。
