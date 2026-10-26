# 该装哪些 Skill 与插件

**✅ 按当前任务只补一项：库 API 总写错版本，试 Context7；缺具体领域做法，先读依赖包自带的窄 Skill；需要整方法编辑而宿主没有符号接口，再试 Serena。** 普通修错沿用现有搜索、文档和测试。先查 lockfile 与已启用工具，避免把已有能力再装一遍。

## 现在选什么

| 你要解决的问题 | 当前推荐与第一步 | 何时不适用 |
|---|---|---|
| 库升级快，Agent 反复写出旧 API | 🧪 **Context7**：按 lockfile 查目标版文档；检索仍费力时接入下方官方插件 | 官方版本文档、类型定义已能稳定回答；或查询需要上传专有代码 |
| 库能用，但不知道某类功能该怎样组合 API | 🧪 **库作者的窄 Skill**：已有 TanStack Router、要做可分享筛选时，读取包内 `search-params` | 没用这个库；单条官方示例已经足够；本地包没有该 Skill 时回对应版本指南 |
| 经常替换完整方法或在方法旁插入定义 | 🧪 **Serena**：先读当前符号正文，再按文件＋符号名编辑 | 只改几行文本、原生 IDE／LSP 已够用，或多人同时写同一方法 |
| 需求未定，确实需要访谈、设计和计划衔接 | 🧪 **Superpowers 按项目试用**；小 bug 直做、未决架构先设计、已定计划按下方 inline 执行 | 清楚的小修复无需整包；⛔ 暂缓全局强制，完整设计路径有人工批准关口 |

Skill 提供做法，MCP 提供调用能力，插件把它们打包分发；选的是缺口，不是文件形式。跨任务、跨当前模型的整体最高水平仍未知，这里给的是已有源码、使用反馈与实试支持的条件选择。要查宿主差异看 [05](../05-skills-and-plugins.md)，缺浏览器、数据或运行能力看 [04](../04-mcp.md)。

## 版本 API：用官方 Context7 插件，明确选版本

**Claude Code 交互终端里先打开插件详情，试用选“仅自己、仅当前仓库”的 local scope。** 已有同名 MCP 就沿用，不重复安装；其他客户端按 [Context7 官方入口](https://github.com/upstash/context7)接入。

```text
/plugin install context7@claude-plugins-official
```

这条命令先打开详情；确认新增组件、选择作用域后才安装。它使用远程 MCP，无需本地 Node.js。官方市场实际分发的配置如下，供核对连接目标；已装插件时不用再手写一份：

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp?client=claude-code-plugin"
    }
  }
}
```

接好后用当前需求查一次：`resolve-library-id` → 从返回版本列表选完整 ID → `query-docs` → 核对 Source 原文与版本 → 编译／测试。只传通用问题、库名与版本；缺目标版本就回官方文档，不以“最接近版本”接收改动。

**已经试到哪一步**：本仓 10-23 的匿名远程 MCP 实试，服务自报 4.4.3；同一个 Pydantic 导出字典问题分别查两版，得到对应版本的方法与原文。这里推荐的是精确版本查询链，当前插件的安装界面未实跑。

**依据**：[一手] [Claude Code 安装与作用域](https://code.claude.com/docs/en/discover-plugins)、[官方市场固定配置](https://raw.githubusercontent.com/anthropics/claude-plugins-official/ab024cdcfa7ca80be204acd4907656ba5a968589/external_plugins/context7/.mcp.json)与[当前插件入口](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/context7)；当前核实 2026-10-26。[本仓实试] [双版本查询与结果](../research/2026-10-22-frontier-trials.md#context7精确版本查询实试)，原核实 2026-10-23。

## 领域配方：先读安装包，不为一项知识装整套流程

**已有 TanStack Router、要做“筛选后看详情，返回或分享链接仍保留条件”，先读安装包里的 search-params Skill。** 在声明 `@tanstack/react-router` 依赖的应用目录运行（如工作区里的 `packages/web`）。下面从该应用的 Router 定位它实际使用的 core，npm 与 pnpm 都可用；不扫描缓存，也不要求传递依赖提升到工作区根：

```sh
node --input-type=commonjs <<'NODE'
const { createRequire } = require('node:module')
const { dirname, join } = require('node:path')
const { readFileSync, existsSync } = require('node:fs')
const router = createRequire(require.resolve('@tanstack/react-router'))
const core = router.resolve('@tanstack/router-core/package.json')
const file = join(dirname(core), 'skills/router-core/search-params/SKILL.md')
console.log('router-core', JSON.parse(readFileSync(core, 'utf8')).version)
console.log(existsSync(file) ? readFileSync(file, 'utf8') : '该版本未附此 Skill，请查对应版本官方指南。')
NODE
```

这里通过包已导出的 `package.json` 找目录，再读文件；不把未导出的 Skill 子路径当模块导入。若找不到 Router，先确认当前目录就是安装过依赖的消费包；该版本没有 Skill 就回对应版本官方指南，不为获得它更换路由库。

官方 Skill 的真实配方摘录同时处理“保留条件”和“省略默认值”，不是只教把字段塞进 URL：

```ts
retainSearchParams(['retainMe']),
stripSearchParams({ arrayWithDefaults: ['foo', 'bar'] }),
```

换成项目字段后，沿用现有路由：已应用状态从 URL 读取，未提交的输入另存为草稿；显式清空默认值，再验详情／返回／清空／前进后退／复制链接恢复。可直接复制[本仓任务与实现](../../experiments/tanstack-url-state/README.md#窄-skill-的复制入口)，无需额外 schema 库或全局 hooks。

**已经试到哪一步**：本仓用 router-core 1.171.39、Intent 0.5.6 手动加载配方，在官方示例做成可分享筛选；修订版 8 项组件／路由测试、构建及真实 Chrome 操作通过。Skill 元数据仍标 1.171.15，随包交付只解决定位，兼容性仍由当前代码和测试接收；自动触发与有／无 Skill 的收益对照未测。

**依据**：[一手] [TanStack 固定 Skill](https://github.com/TanStack/router/blob/6b9fe6d29552270836c511bc9b343d73541f4424/packages/router-core/skills/router-core/search-params/SKILL.md)，[当前文件](https://github.com/TanStack/router/blob/main/packages/router-core/skills/router-core/search-params/SKILL.md)核实 2026-10-26；[本仓实试] [实现、版本与浏览器结果](../../experiments/tanstack-url-state/README.md)，原核实 2026-10-23～24。

## 符号编辑与完整流程：只为实际增量留下它们

**Serena 值得借的是“按方法改”，不是要求所有查找都换工具。** 首次接入按[固定实试入口](../../experiments/serena-symbol-edit.md#研究记录固定环境与执行细节)配置项目与语言后端，再走 `initial_instructions` → `find_symbol(include_body=true)` → `replace_symbol_body` → 审 diff、跑相关测试。本仓 Serena 2.1.0／Python-Jedi 五场景中，插行后仍命中方法，歧义和不存在的符号拒绝写入；但旧正文可覆盖别人刚改的方法，因此同方法并发编辑先协调归属。这是公开夹具实试，业务任务收益未测。

**已装 Superpowers，按任务选三条路：**

- **清楚的小 bug → 直做**：目标与验收已定就直接修、跑回归；若自动开始不需要的访谈，明确要求跳过问答并继续。
- **架构或需求未决 → 设计**：用 `brainstorming` 读项目、比较方案、写设计，获得批准后再实现。
- **已有计划，且不需逐任务独立评审 → inline**：选择 `executing-plans`，在当前会话按计划实现和测试；这是执行方式，不是关闭验证。有子 Agent 工具时仍做整分支独审，没有则说明自审并交用户决定。需要逐任务接收门槛才选 `subagent-driven-development`。

Luca Cavallin 的 9 月 iOS 实践仍保留 Superpowers、Context7、Serena，却清理长期不用的扩展；V2EX 7 月原帖同时有“小改动被流程拖慢”的卸载自述和“详细计划利于交给另一模型实施”的正面反馈。Superpowers 7.0.1 已据用户反馈调整问答，详细入口见[任务分流](../24-community-workflows.md#2-superpowers重点看-skill-之间怎样衔接)。尚未安装且原生能完成的小任务，直接做。当前版模型效果未试用，不沿用旧版体验给它判胜负。

**依据**：[本仓实试] [Serena 五场景与编辑边界](../../experiments/serena-symbol-edit.md)，原核实 2026-10-24；[社区原文] [Luca 实际配置](https://www.lucavallin.com/blog/how-i-actually-use-claude-code)、[V2EX 正反使用反馈](https://v2ex.com/t/1227194)；[一手] [Superpowers 7.0.1 修订](https://github.com/obra/superpowers/releases/tag/v7.0.1)、[设计批准入口](https://github.com/obra/superpowers/blob/v7.0.1/skills/brainstorming/SKILL.md)与[inline 执行入口](https://github.com/obra/superpowers/blob/v7.0.1/skills/executing-plans/SKILL.md)，原文重核 2026-10-26。

**保留标准很简单：拿眼前任务验一次。** 是否真正查到了正确版本、做成了功能或改准了方法？若只多了阅读、问答和文件，缩小或移除这项补充；已有测试、验收标准和权限边界照常保留。
