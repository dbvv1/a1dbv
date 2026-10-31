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
| 跨客户端共用 Skill，安装成功却读不到 | 🧪 先核目标路径；dotfiles 父链接断链时，对单个 Skill 用 copy | 健康链接不改；copy 副本须另行更新 |

**第一步先查已有能力，避免重复安装。** 把方括号换成当前任务：

```text
为 [具体任务] 检查当前已启用的相关 Skill／MCP 与实际依赖版本。
已有能力够用就沿用；否则只建议一项补充，说明理由、来源、作用域及新增 MCP／Hook，先不安装。
确定采用后，用 [项目原测试命令或操作] 验收任务结果。
```

团队流程借用 OpenAI Agents SDK 的按改动触发和 Sentry JavaScript 的入 Git 共享，不复制整包。跨客户端分发确有维护负担，再看 [dotagents 候选](../collaboration/inbox.md#2026-10-27dotagents-的项目级-skill-分发)。

**依据**：[一手项目配置] [OpenAI Agents SDK](https://github.com/openai/openai-agents-python/blob/cd26bbbc52847845fde73b9952b51e62e2bcbdc0/AGENTS.md)、[Sentry JavaScript](https://github.com/getsentry/sentry-javascript/blob/c125a5da2e6b7d916a5880f65876cddfee96c56d/agents.toml)；2026-10-28 核实，这两套项目流程未在本仓试用。

<a id="skills-linked-parent"></a>
## 共用 Skill：安装成功，还要读到客户端那份

**🧪 用 dotfiles 链接管理 `~/.claude/skills`、同时给 Claude Code 与 Codex 安装时，先核目标文件；确认断链后，对该 Skill 改用 `--copy`。** 不整目录替换，不靠重复安装求恢复；先保留自定义内容及来源版本。

在已有可信 `skills` CLI 上，将已审阅的单个本地 Skill 目录传给 `skills add <该Skill目录> --global --agent claude-code codex --copy`，保留交互确认。随后用 `skills use <实际Claude安装路径>` 对照完整正文，并在 `skills list --global --agent claude-code --json` 中核 Claude 关联；最后回客户端验实际任务。**copy 会留下独立副本，继续只维护一个源，再显式更新各副本。** 健康链接不必改成 copy。

[正式包 1.7.4 实跑](../../experiments/skills-linked-parent/README.md)中，双客户端＋深层 dotfiles 父链接的安装、原命令重装都 exit 0，却留下悬空子链接，实际 `use` exit 1；加 copy 后正文恢复。列表三次都有名称，但失败时 `agents` 为空。普通目录、仅装 Claude（自动 copy）、父链接直指共享根三个对照都成功，故不是“所有软链接坏了”。此处验文件资源消费，尚未验 Claude／Codex 模型采用。

**依据**：[真实使用者 #481](https://github.com/vercel-labs/skills/issues/481)、[官方固定版用法与安装模式](https://github.com/vercel-labs/skills/blob/a80e4c9d12d607631249d4d7d059f835d4b2f13a/README.md)、[既有修复 PR #2283](https://github.com/vercel-labs/skills/pull/2283)。2026-10-31 Linux CLI 实跑及非作者新目录复跑；PR 仍未合并，未验原生 Windows／macOS。本页采用评级不变。

<a id="cursor-synced-skill-owner"></a>
## Cursor 云端 Skill：同步会搬位置，Automation 是另一入口

**👀 同一份 Skill 还要供 Claude 使用时，先保现有本地来源；需要项目云任务的部分可放项目 `.cursor/skills/<名称>/SKILL.md`，不要把个人同步当作原目录的镜像。** 入库前检查权限与内容，项目成员会读到它，且作用域只在该项目。本项未试用，仅据当前官方说明与真实用户回执。

个人同步开启后，Cursor 将内容迁入 synced storage，使用的是那里的一份；完成后从 `Customize → Skills` 打开并编辑。继续编辑原同名目录可能不生效，原目录被迁走也会让指向它的 Claude 链接失效。**已卡住且改过文件时，先保全现存副本并比较，不通过反复开关恢复。** 关闭会把存储中的版本搬回，不只是停止上传。原报告中 macOS Trash 留有被替换版本，用户据此补齐恢复；这不是产品已修复或通用云备份保证。

**Automation 不加载个人 synced Skills，即使选 `Run as Me`。** 为 Automation 提供 Skill，应把它放在该任务选定仓库的 `.cursor/skills/`，再在实际运行中验证。手输名称或等 `/` 菜单显示不能补上运行时缺失；官方帖先前“只是自动补全”的回答已撤回。

**依据**：[官方同步与 Automation 契约](https://cursor.com/docs/skills)、[十月共享 Skill／覆盖旧副本报告及员工澄清](https://forum.cursor.com/t/sync-skills-for-cloud-agents-overwrote-local-cursor-skills-with-an-old-snapshot-then-hung-at-50-of-50/174945)、[Automation 原反馈与纠正](https://forum.cursor.com/t/cursor-automations-dont-see-custom-user-skills/174578)。2026-10-31 核原文；覆盖报告为 Cursor 3.24.18／macOS 15.7.9，未找到已修版本，不据单例断言所有版本都会覆盖。

<a id="openspec-pi-discovery"></a>
## Pi 与 Codex 共用 OpenSpec：保留生成文件，只限定 Pi 的加载

**🧪 已同时配置 Pi 与 Codex、启动时出现 OpenSpec 同名 Skill 警告，在 Pi 的项目设置里只排除共享副本。** 保留 `.pi/skills` 的 Pi 版和 `.pi/prompts` 命令模板，`.agents/skills` 继续供其他客户端使用；两份都由 OpenSpec 更新。先确认它们是同一安装生成的副本，自定义过的同名内容须先比较取舍。

将这一项合并到项目 `.pi/settings.json` 的既有 `skills` 数组，不覆盖其他设置：

```json
{
  "skills": ["!**/.agents/skills/openspec-*/SKILL.md"]
}
```

**重新加载后，同时核有效 Skill 与 `/opsx-*` prompts，不能只看警告消失。** OpenSpec 1.15.0／1.16.0＋Pi 1.4.0 的[实际生成、加载与更新](../../experiments/openspec-pi-discovery/README.md)均保留 6 个原生 Skill、6 个 prompts，冲突从 6 降为 0，更新后内容与设置不变。宽排除 `!skills/openspec-*` 却把两目录的 OpenSpec Skill 全排掉；仅装共享目标又不生成 Pi prompts。`disable-model-invocation` 只隐藏自动描述，冲突仍在。这里验证资源加载，未测模型采用或工作流收益；本页评级不变。

**依据**：[真实使用者 #2180](https://github.com/Fission-AI/OpenSpec/issues/2180)、[维护者迁移计划](https://github.com/Fission-AI/OpenSpec/issues/2180#issuecomment-6535807358)、[Pi 资源配置](https://pi.dev/docs/latest/settings#resources)与[Skill 加载约定](https://pi.dev/docs/latest/skills)。本仓 Linux CLI／SDK 实跑及非作者独立复跑：2026-10-31；macOS 原报告与原生 Windows 未复现。此配置只适用于上述重复安装场景，不是通用禁用共享 Skills 的规则。

<a id="intent-pnpm-global"></a>
## pnpm 全局装过 CLI，Intent 却找不到 Skill

**🧪 已用 pnpm 11 全局包时，先核真实安装根，再让 Intent 一次读取一根；空列表不等于包里没有 Skill。** 只用项目依赖的读者仍沿用下文的本地解析，不需要改成全局安装。项目已有 `intent.skills`／exclude 策略时也先核策略，不为试通删除它们。

在现有 pnpm 项目、已安装的 `intent` 可执行文件所在环境，用 Bash／Zsh 获取目标包的实际根。下面选 Playwright；换包时同时更换包名和 load 的 Skill 标识：

```sh
(
set -eu
ROOT=$(pnpm ls -g --json --depth 0 | node -e '
const fs = require("node:fs"), path = require("node:path");
const name = process.argv[1];
const entries = JSON.parse(fs.readFileSync(0, "utf8"));
const paths = [...new Set(entries.flatMap(e =>
  Object.entries(e.dependencies ?? {}).filter(([n]) => n === name).map(([, p]) => p.path)))];
const suffix = path.sep + "node_modules" + path.sep + name.split("/").join(path.sep);
if (paths.length !== 1 || !paths[0]?.endsWith(suffix)) {
  console.error("未找到唯一的目标安装路径；先核 pnpm 全局包列表。"); process.exit(2);
}
console.log(paths[0].slice(0, -name.split("/").join(path.sep).length - 1));
' '@playwright/cli')
INTENT_GLOBAL_NODE_MODULES="$ROOT" intent list --global-only --json
INTENT_GLOBAL_NODE_MODULES="$ROOT" intent load '@playwright/cli#playwright-cli' --global-only --json
)
```

先核列表中的包名、版本和 `source=global`，再核 load 的路径与非空正文。**每次 load 都带相同的单根覆盖，不把两根用冒号拼在一起。** [真实 pnpm 11.17.0 安装](../../experiments/intent-global-discovery/README.md)中，Intent 0.3.6／0.5.6 默认均为零；逐根找到 TanStack CLI 的五个和 Playwright CLI 的一个 Skill，六份正文均能加载，拼根仍为零。这里只恢复当前命令读取，不持久修改配置或保证 Agent 自动发现已恢复。

**依据**：[Intent 全局扫描契约](https://tanstack.com/intent/latest/docs/overview)、[使用者 #206](https://github.com/TanStack/intent/issues/206)、[单根检测源码](https://github.com/TanStack/intent/blob/248c6f02605b12f9a31be069fabd945361f701bf/packages/intent/src/shared/utils.ts#L294-L342)。2026-10-31 Linux 正式包实跑及非作者复跑；[多根修复 PR #207](https://github.com/TanStack/intent/pull/207)仍未合并。未执行两个 CLI 的工作流或模型，不据此上调 Skill 采用评级。

## 先定位实际依赖，再选文档或源码

**✅ 查实际行为，从调用方追到已解析包、项目补丁和具体模块；查版本用法，再看官方文档或 Context7。** Zed 的 `reqwest` 实际是重命名 fork，Vite 也有依赖 alias／patch，同名版本不能替代实现定位。

在已准备依赖的 opensrc 根目录，用 Bash、Cargo、jq、realpath 沿消费包的普通直接依赖边查询。换项目时改前三项，并给 metadata 带上与构建相同的 feature 参数：

```bash
set -o pipefail
manifest=packages/opensrc/cli/Cargo.toml
dep=reqwest
target=x86_64-unknown-linux-gnu
cargo metadata --format-version 1 --locked --offline \
  --manifest-path "$manifest" --filter-platform "$target" |
  jq -e --arg manifest "$(realpath "$manifest")" --arg dep "$dep" '
    . as $m
    | $m.packages[] | select(.manifest_path == $manifest)
    | .id as $consumer
    | $m.resolve.nodes[] | select(.id == $consumer)
    | .deps[] | select(.name == $dep)
    | select(any(.dep_kinds[]; .kind == null))
    | .pkg as $id
    | $m.packages[] | select(.id == $id)
    | {name, version, source, manifest_path,
       lib_src: [.targets[] | select(.kind | index("lib")) | .src_path]}
  '
```

读取返回的 `manifest_path`、`lib_src`，沿调用进入实际模块。缺包先补齐锁定依赖；无结果先查消费包与依赖类别。本仓 opensrc 0.7.3 修复中定位到 reqwest 0.12.28，发现 blocking 与异步客户端的同名 `timeout` 签名不同。API 接收仍跑消费包当前 target／feature 的检查；metadata 可能合并其他工作区成员的 feature。

**依据**：[Cargo metadata](https://doc.rust-lang.org/cargo/commands/cargo-metadata.html)、[Zed fork](https://github.com/zed-industries/zed/blob/57c7b10ece671185a8863515667ee5248c6f0d53/Cargo.toml#L864-L872)、[Vite alias／patch](https://github.com/vitejs/vite/blob/e954a9cda0b5254be495a937333a0be1b8503d8f/pnpm-workspace.yaml#L13-L22)、[feature 合并反馈](https://github.com/rust-lang/cargo/issues/7754)；[本仓 opensrc 入口](../../experiments/opensrc-ref-integrity/README.md)。原核实 2026-10-26，验证范围为离线定位与源码阅读。

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

## 符号编辑与完整流程：只为实际增量留下它们

**Serena 只在宿主缺所需符号操作时试。** 按[实试入口](../../experiments/serena-symbol-edit.md#研究记录固定环境与执行细节)配置项目与语言，先读 `initial_instructions`；2.1.1.dev0 新配置默认 REPL，独立符号工具需 `--agent-interface tools`。读当前正文再替换、审 diff、跑测试；同方法并发先协调，旧正文可能覆盖新修改。Vue 接口的实试范围另见[专门记录](../../experiments/serena-vue-implementation/README.md#真实-mcp-stdio-入口)，模型／IDE 客户端及业务收益待验。原核实 2026-10-24～27。

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

**依据**：[Claude 调用与生命周期](https://code.claude.com/docs/en/skills#where-you-write-the-skills-name)、[动态命令失败](https://code.claude.com/docs/en/skills#when-an-injected-command-fails)、[OpenAI 客户端与发现](https://learn.chatgpt.com/docs/build-skills)、[插件范围](https://learn.chatgpt.com/docs/plugins)、[Codex 发现接口](https://learn.chatgpt.com/docs/app-server#skills)；2026-10-28 核实。Codex CLI 0.164.0 隔离探针仅验发现、元数据／文件缺失和刷新恢复；各 GUI／CLI 完整任务调用待验。Claude IDE [修复](https://github.com/anthropics/claude-code/blob/08c6a4f5121ae140d3c1b5c96e3e5ae53587b54b/CHANGELOG.md#L83)与[用户对照](https://github.com/anthropics/claude-code/issues/102799)原核实 2026-10-27，未实跑。

Skill 提供做法，MCP 提供能力，插件打包分发。更多宿主差异看 [05](../05-skills-and-plugins.md)，浏览器、数据和运行能力看 [04](../04-mcp.md)。
