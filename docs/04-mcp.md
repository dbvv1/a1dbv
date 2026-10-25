# 04 · MCP（Model Context Protocol）

> 核实时间：2026-10-21；新增证据见[P55统一研究](research/2026-10-13-context-tool-choice.md#p55能力接入纠偏与授权边界)；服务未安装实测。

## 1. 先决定是否需要新增连接

**✅ 先选所需动作与权限，再选接入方式：已有文件、CLI 或有效的 typed 工具能完成任务，就沿用。** 可隔离且已授权的开放执行用 shell；只允许固定业务动作时用窄接口；确有当前数据／应用状态缺口，或有依据预期改善质量与总投入时，再试新增。⛔ 不为“强模型只需 Bash”删工具，也不把 MCP 当沙箱。

插件打包同一 MCP 时不重复接入；带 Skills、Hook 或 LSP 时按[组件与权限](https://code.claude.com/docs/en/plugins-reference#mcpservers)评审；任务选择见第 3 节。

2026-07-28 规范影响新接入，不是升级理由：协议取消初始化握手和协议级会话，业务状态改用显式句柄；HTTP 用 [`Mcp-Method`／`Mcp-Name`](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http) 路由，服务端仍须校验与请求体一致，这些头不提供认证、权限或注入防护。[授权规范](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)面向 HTTP；stdio 从环境取凭证；CIMD 推荐、DCR 兼容，按支持选择；切换前核实客户端支持，见[固定规范](research/2026-10-10-audit.md#s5--mcp-2026-07-28-规范)。

**依据**：[一手] [Claude 插件清单](https://code.claude.com/docs/en/plugins-reference#mcpservers)、[固定规范](research/2026-10-10-audit.md#s5--mcp-2026-07-28-规范)、[传输规范](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)、[授权规范](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)；[经验：采用判断／边界] 插件组件评审、认证与注入头边界；[研究：采用判断] 动作与接入选择；核实 2026-10-21。

## 当前最高水平：先比较能力面，再决定接口

<!-- frontier: status=已比较 gap=1 gen=2026-10 checked=2026-10-21 -->

**按任务和权威状态选接口，不统一换成一种协议。** OpenAI／Jeremy Lewi 的 [8-25 Runme 复盘](https://developers.openai.com/blog/automating-repetitive-work-at-openai-with-codex)接已有 notebook；Ramp 的 [10-20 Laminar 系列](https://builders.ramp.com/post/building-laminar)把工具发现与凭证／动作控制分开。本仓只在补缺口或改善质量与总投入时借用，不复制整套平台。

Microsoft／CMU 的 [9-10 企业任务研究](https://arxiv.org/html/2609.11999v1)支持在获准的开放任务中保留 shell；[9-17 消融](https://arxiv.org/html/2609.20804v1)显示删工具的结果随模型和任务反转。默认保留有效原生能力，按状态、权限与组合需求补接口。

**差距**：以上为近期机制比较，缺当前模型实测；变更后按同任务产物与失败去留。

**依据**：[一手：团队自述] [8-25 Runme 复盘](https://developers.openai.com/blog/automating-repetitive-work-at-openai-with-codex)、[10-20 Laminar 系列](https://builders.ramp.com/post/building-laminar)；[研究：作者实验，未复现] [9-10 企业任务研究](https://arxiv.org/html/2609.11999v1)、[9-17 coding harness 消融](https://arxiv.org/html/2609.20804v1)；[研究：采用判断] 比较方法与差距边界；核实 2026-10-21。

## 2. MCP vs CLI：按任务与调用路径选择

**按任务和调用路径选 MCP 或 shell，两者不互斥。** MCP 既承载 typed 工具，也承载代码执行；先分四层。

| 要决定的层 | 当前默认与新增条件 |
|---|---|
| 动作表达 | 已授权、可隔离的开放执行用现有 shell；业务只准固定操作时用 typed 目录，组合调用过碎才试受目录限制的代码编排（PTC） |
| 工具发现 | 小工具集与常用工具直供；大量低频 schema 有上下文负担时再按需发现 |
| 接入位置 | 复用数据／应用当前状态所在层的受控入口，再核 MCP、CLI 或浏览器接口兼容性；不为换协议新建后端 |
| 授权与执行 | 在调用端限制身份、资源、动作及凭证；隐藏工具、schema 校验和提示词都不等于撤销权限，见 [10](10-security.md) |

Ramp 的 [Tools](https://builders.ramp.com/post/building-laminar/tools) 从预装工具 schema 改为按需搜索，常用工具直供；[Connectors](https://builders.ramp.com/post/building-laminar/connectors) 另管凭证、权限和上游变化。

代码侧过滤也能减少输入，[Anthropic 的 MCP 代码执行方案](https://www.anthropic.com/engineering/code-execution-with-mcp)是例子。参数 schema 只校验形状，CLI 同样须核参数、结构化输出和退出码；都不要把秘密拼入命令或返回值。

**本仓库的判断**：
- ✅ 强模型已有 shell 且任务在授权范围内：先缩小查询、分块返回或合并读取，原生能力够用就不追加 Skill。验收要区分裁剪与丢失：先存完整报告和退出码，再提取字段；提高显示预算不能恢复已丢内容。无完整报告且重跑有副作用时先查权威结果。见[固定输出链路与回归](research/2026-10-13-context-tool-choice.md#工具输出显示裁剪与采集丢失)。
- 🧪 原生调用仍有可测重复开销时再试批处理或结果过滤接口；比较通过情况、计价成本、总等待与人的投入。
- 🧪 当前接口拿不到状态，或只该暴露窄操作时，试仍在维护的兼容接口；已有 typed 工具有效就保留。小模型／本地模型也要验证实际调用。MCP 不是沙箱；Claude Code 的本地 MCP 进程在 Bash 沙箱外运行（[官方沙箱范围](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox)），需要进程级隔离时按[客户端安全边界](01-agents/claude-code.md)选宿主。

### 只有 shell 时，临时使用一个公开 MCP 动作

**🧪 没有原生 MCP 入口但要用已授权的公开资料工具时，可试 MCPorter 一次性调用；已有有效入口就不加这层。** 本仓用 0.16.0 匿名读取 DeepWiki 目录与正文，落盘后只提取 Search Parameters 章；[可复制命令与条件](../experiments/mcporter-public-read.md)。

临时配置关闭自动导入、隔离 HOME／XDG 并禁用 OAuth，只点名只读工具，不带入日常配置。正文近 893KB，先在代码侧选目标章；wiki 仍须回源码核实。

### 应用状态在浏览器里，不必先造后端

**✅ 先接已有状态与执行入口；🧪 当前浏览器／宿主支持时才试浏览器侧接口。** OpenAI 的 Runme 案例用 [WebMCP](https://github.com/runmedev/web/blob/4a74e79efa18d78d63930112818b560bb10a0bb3/app/src/components/WebMcp/WebMcpToolRegistrationHost.tsx) 让 Agent 操作现有 notebook，避免给静态客户端加后端；人仍审核系统与已批准资源。注册实现先查宿主入口，ExecuteCode 非只读。

入口不存在、状态回读不准或执行边界不清，就保留原应用／CLI 路径；sandbox 选项不证明隔离全链成立。Agent 可整理和执行已授权步骤，人保留资源与高后果动作的决定权。

### 成本下降，不等于多获得一种能力

**接口成本下降不等于多获得能力；原生查询已够短且成功，就不加新层。** [onlycodes 的历史对照](research/2026-10-13-context-tool-choice.md#工具接口先缩小原生查询再判断是否补接口)比较 Codex CLI 0.130.0 / GPT-5.5 的原生、受限 shell 与单一代码接口：代码接口成本低 19.91%、通过 140 对 139 次，但墙钟多 1.62%；只减少原生工具的 shell 臂更贵。

不用“CLI 最低、Code Mode 固定更慢／更贵”的通用排名；增加等待、失败或人工处理就缩减或撤回。研究替换工具面，成本为估算，不能外推当前版本；权限、凭证隔离与沙箱要求不随成本结论放宽。

### 从规范到可运行实现

**升级前固定客户端/SDK/服务端版本，验证能力发现、`input_required`、断流恢复与参数错误处理。** 规范确认了会话、MRTR 和结果字段变化；读写工具还要定义业务幂等性，见 [20](20-codex-long-horizon.md) 和 [S5 来源](research/2026-10-10-audit.md)。

### 异步工具：完成的是哪一层

**🧪 只有操作需要后台执行，且客户端／服务端支持同一版 Tasks 时才接入；先复用兼容 SDK 的轮询，不另造 Agent 循环。** Tasks 是可选扩展，调用可能直接返回结果或任务句柄。任务 `completed` 仍可能带 `isError: true`；官方 TypeScript 的 `resultFromTaskOutcome` 与 C# 的 `CallToolWithPollingAsync` 不替调用者升级任务失败。验收至少覆盖“任务完成但工具失败”，并检查业务结果。

若工具只返回 `queued`，外层调用完成只证明入队；要能用返回身份查到最终结果，否则不承担无人值守承诺。旧版 Tasks 归类不同，SDK 辅助方法也不保证业务副作用完成；结果未知时沿用 [20 的对账与重试原则](20-codex-long-horizon.md#9-超时后动作究竟发生了吗)。

**依据**：[一手：团队自述] [Ramp Tools](https://builders.ramp.com/post/building-laminar/tools)、[Ramp Connectors](https://builders.ramp.com/post/building-laminar/connectors)；[一手] [Anthropic MCP 代码执行方案](https://www.anthropic.com/engineering/code-execution-with-mcp)、[官方沙箱范围](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox)、[固定注册实现](https://github.com/runmedev/web/blob/4a74e79efa18d78d63930112818b560bb10a0bb3/app/src/components/WebMcp/WebMcpToolRegistrationHost.tsx)；[本仓实试／经验] MCPorter 一次性调用；[研究：只读复算] onlycodes 历史对照；[一手：固定规范、实现与测试] [异步工具任务终态与业务结果](research/2026-10-13-context-tool-choice.md#异步工具任务终态与业务结果)；[研究：采用与撤回] 浏览器侧接口与成本判断；核实 2026-10-21。

## 3. 按任务选择服务与权限

> 先复用已有能力；新增时固定可核查版本，托管服务核官方端点与权限。

| 当前任务 | 先用什么；何时新增 | 接入后最重要的边界 |
|---|---|---|
| 查 Issue、PR、CI | ✅ 已有 `gh` 能查就沿用；🧪 无 shell 或需受限远程接口时用 GitHub MCP | 只读工具面、窄凭证；lockdown 不缩小凭证 |
| 查数据库／线上异常 | ✅ 已有查询、导出或监控够用就不加；🧪 需连续查询时接服务 | 按项目与角色限权；日志／工单是外部内容，不直接授权命令 |
| 浏览器探索、运行诊断 | ✅ 先复用项目测试；🧪 只有观察／诊断缺口时加 Playwright MCP 或 DevTools MCP | 登录态、网页内容与执行边界按 [23](23-browser-verification.md#诊断缺口chrome-devtools-mcp)选择 |
| 库版本与 API 检索 | ✅ lockfile、目标版文档、类型定义；🧪 查找反复失败再试 Context7 | 生成摘要不证明兼容 |
| 跨文件符号修改 | ✅ 原生 LSP 加文本搜索；🧪 语义缺口再试 Serena | 先核语言／会话支持；语义查询为空时查项目导入，核验定义与调用点后编辑，见 [03](03-context-engineering.md#25-跨文件符号检索何时补-serena) |
| 设计还原 | ✅ 截图、组件示例与源码；🧪 缺结构／组件契约再用 Figma | 映射跟随组件 API，最终做运行验收 |
| 跨会话查事实 | ✅ 最新任务记录；👀 找不到跨任务事实才评估记忆服务 | 可检索不等于事实仍有效 |
| 编辑器对象操作 | ✅ 已有脚本／测试接口；🧪 需当前场景、资产或对象操作再选引擎插件／MCP | 查操作覆盖、版本及结果回读，见[引擎接入](../domains/game-dev/01-engine-integration.md) |

### GitHub 与数据库：只读具体限制哪一层

**🧪 PR／CI 排障只读时，GitHub MCP 选只读工具和必要工具组，底层凭证仅覆盖目标仓库与所需权限。** `--read-only` 过滤写工具，远程端有 `/readonly`；`--lockdown-mode` 按作者过滤公共内容，不改凭证权限，也不保证内容可信。读取不全时不要直接开 `all` 或扩大 token；自托管多人 HTTP + lockdown 在 `>=0.22.0, <1.1.2` 时升级到至少 `1.1.2`。

**🧪 数据库诊断先用最窄查询；选 [Supabase MCP](https://supabase.com/docs/guides/ai-tools/mcp#security-risks) 时同时限定 `project_ref`、`read_only=true` 与所需 `features`。** 官方开发者 MCP 用开发者权限，不能当终端用户的逐用户数据接口；后者复用应用已有鉴权／RLS。改 schema 走开发环境与迁移／评审，不为诊断开生产写权限。只读仍可读取敏感数据；见[固定记录](research/2026-10-13-context-tool-choice.md#服务接入工具面凭证与外部内容)。

**依据**：[一手] [Supabase 官方契约](https://supabase.com/docs/guides/ai-tools/mcp#security-risks)；[经验：采用判断／撤回判断] GitHub 三层限制与数据库只读；固定实现见正文记录；核实 2026-10-21。

### 日志与工单：读取可信服务不等于相信内容

**✅ 先查询和定位源码；执行日志建议的命令要另核来源、用途与批准范围，不能把“读取错误”延伸为“安装其推荐软件”。** Tenet 的 [2026-06 原始研究](https://tenetsecurity.ai/blog/agentjacking-coding-agents-with-fake-sentry-errors/)（受控测试）记录了此类注入。同类内容同样处理；隔离不了执行权限就只辅助诊断，不交付自动修复闭环。

### 文档检索：Context7 不替代版本判断

**🧪 频繁用错库 API、检索不可靠时再试 [Context7](https://github.com/upstash/context7/blob/master/README.md)。** 基线是 lockfile、该版官方文档与类型定义；MCP 或 CLI + Skills 辅助查找，按[官方 Skill](https://github.com/upstash/context7/blob/master/skills/find-docs/SKILL.md) 解析 ID，只传通用问题与库/版本，不传秘密、个人数据或专有代码。closest match、无版本 ID 与生成摘要不能证明兼容，精确版本缺失就回官方并编译；见[固定查询链](research/2026-10-13-context-tool-choice.md#文档检索版本选择与生成内容刷新)。

### 设计上下文：先判断缺的是外观还是组件契约

**🧪 先用目标截图、现有设计系统示例与当前源码；仍无法确定布局约束、token 或组件复用时，再按小区域读取 Figma 结构。** 已知组件和 props 的局部样式修改不必新增。反复把设计 variant 翻译成代码 props 时才考虑 [Code Connect](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/)：官方区分 UI 关联与 CLI 映射，“已连接”不等于属性正确。

只保留能补缺口的连接；返回仍是通用布局、映射过时，或维护负担超过省下的查找，就退回组件示例与源码。空结果先核范围／权限／框架，不据此重造组件。官方方向见[核实记录](research/2026-10-13-context-tool-choice.md#设计上下文结构输入与组件契约)。模板片段可能脱离源码类型检查，结构输入不能替代[运行验收](23-browser-verification.md#2-mcpcli-与测试代码各做什么)。

### 跨会话记忆：先区分检索与当前状态

**✅ 已知任务／仓库、能直接定位最新需求与决定时，沿用 [20 的版本化恢复记录](20-codex-long-horizon.md#4-恢复包必须包含最新任务而非最长历史)，不为“跨会话”增加服务。👀 多个历史任务确实难找回相关事实，且需按项目、实体或时间检索时，才评估记忆 MCP。** 官方 reference memory 以 name 判重，追加“改用 B”不会撤销“使用 A”，同名也不等于同项目对象。

候选要能在所需范围内追溯来源、区分对象、处理被取代事实，并核对纠正／删除后的检索结果；能查到旧经验后，仍回当前需求和代码确认是否适用。Graphiti 有分组与来源字段，但冲突判别涉及模型推断。若反复召回过期决定、混淆项目，或成本超过减少的查找，就缩减或撤回。持久化、时态字段和检索命中都不保证事实正确。

**工具返回成功后，回读真正要改变的业务状态。** 例如 PostHog 生成 schema 漏掉刷新周期，200 返回仍无修改，修复落在源 serializer。Agent 交参数、状态与复现，人核业务契约及回归；结果不符先暂停该路径，保留可靠原入口。见[实际维护链](research/2026-10-12-community-source-records.md#p82独立层的采用与维护责任)。

**依据**：[一手] [Tenet 2026-06 原始研究](https://tenetsecurity.ai/blog/agentjacking-coding-agents-with-fake-sentry-errors/)、[Context7 README](https://github.com/upstash/context7/blob/master/README.md)、[Context7 官方 Skill](https://github.com/upstash/context7/blob/master/skills/find-docs/SKILL.md)、[Figma 官方契约](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/)、[固定实现与对照](research/2026-10-13-context-tool-choice.md#跨会话记忆追加观察与事实失效)、[实际维护链](research/2026-10-12-community-source-records.md#p82独立层的采用与维护责任)；[一手／研究] PostHog 业务状态回读；[经验：采用判断／撤回判断] 日志内容边界；设计映射撤回（2026-10-15，未接入或实测收益）；跨会话记忆（2026-10-15（UTC+8），未安装或实测）；Context7（2026-10-13，未安装）；核实 2026-10-21。

## 4. 写好给 Agent 用的工具

**写工具先照六条。** 摘自 [Anthropic《Writing effective tools for agents》（2025-09）](https://www.anthropic.com/engineering/writing-tools-for-agents)：

1. **少而精**：把常用工作流合成一个工具（如 `schedule_event`）。
2. **命名空间**：用 `asana_projects_search`、`asana_users_search`。
3. **返回有意义的内容**：用可读标识代替 UUID；提供 `response_format`（简洁 / 详细）。
4. **控制 token**：默认分页、过滤、截断；**错误信息要告诉模型下一步**。
5. **工具描述就是提示词**：像给新同事写文档一样写清楚。
6. **评估驱动**：用真实任务跑评估，读执行记录并改进工具。

**大型工具集的范例：[Epic 的 Unreal MCP](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin)**：
- 服务器用 **3 个元工具**（`list_toolsets`、`describe_toolset`、`call_tool`）公开入口，具体工具服务端分发，不进 `tools/list`，以保持**提示缓存命中**。
- Epic 的四条原则：**Clean**（比 API 简单）、**Complete**（CRUD 对称）、**Composable**（同类操作用一致类型）、**DRY**（不重复通用工具）。
- 工具失败往往只返回状态，Skill 要求“**不是明确的成功，就当作失败**”。
- 详见 [game-dev/01](../domains/game-dev/01-engine-integration.md#22-unreal几百个工具藏在工具搜索后面)。

新建服务优先复用兼容 SDK，按目标协议处理显式业务句柄、结果与错误；HTTP 授权按双方支持选注册方式。异步沿用第 2 节判据，不把连接成功当成业务完成。

**依据**：[一手] Anthropic《Writing effective tools for agents》（2025-09）、[Epic 官方插件](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin)、[引擎侧核实与局限](../domains/game-dev/01-engine-integration.md#22-unreal几百个工具藏在工具搜索后面)；[经验：采用判断] 新建服务的接入顺序；核实 2026-10-21。

## 5. 在 Claude Code 中接入与撤回

**✅ 先在 `/mcp` 看已有连接；已有插件提供同一服务时不要再手工加一份。** 确有缺口再按[官方 MCP 配置](https://code.claude.com/docs/en/mcp)选择远程 HTTP 或本地 stdio。项目级 `.mcp.json` 可共享，但只提交环境变量引用，不提交 token；安装命令、服务器地址和工具权限都要评审。插件能自启它打包的服务器，不能只看名称。

接入后用窄任务确认拿到所需数据、范围正确、结果与权威来源相符；后续仍反复越权、结果不完整或维护负担超过省下的查找，就在 `/mcp` 禁用连接并回到已有 CLI／资料。交互/非交互审批不同，不能依赖“启动时总会弹确认”；按[项目审批与托管配置](https://code.claude.com/docs/en/mcp#project-server-approvals-and-workspace-trust)核对。未报告端到端实测收益。

**依据**：[一手] [官方 MCP 配置](https://code.claude.com/docs/en/mcp)、[项目审批与托管配置](https://code.claude.com/docs/en/mcp#project-server-approvals-and-workspace-trust)；[经验：采用顺序／撤回判断] 接入与撤回条件；核实 2026-10-21。

## 来源

- [P55 同题比较](research/2026-10-13-context-tool-choice.md#p55能力接入纠偏与授权边界)
- [服务权限与注入反例](research/2026-10-13-context-tool-choice.md#服务接入工具面凭证与外部内容)
- [MCP 固定规范](research/2026-10-10-audit.md#s5--mcp-2026-07-28-规范)、[授权规范](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- Anthropic：[Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)、[Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Epic 官方插件](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin)；[引擎侧核实与局限](../domains/game-dev/01-engine-integration.md#22-unreal几百个工具藏在工具搜索后面)
