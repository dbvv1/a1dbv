# 16 · 自建 Agent：什么时候值得、用什么搭

> 核实日期：2026-10-22。整页比较复用、改造与自建，依据为官方契约、团队复盘与独立研究；[比较证据](research/2026-10-12-long-task-evidence.md#p83整页构建agent的选择)、[既有核查范围](research/2026-10-12-long-task-evidence.md#16-页历史页头)。

> 前面的章节讲“怎么用现成的 Coding Agent”。这一篇讲**什么时候该自己搭**，以及各家的搭建方式。

## 1. 先问：真的需要自建吗？

**✅ 重复代码／CI／依赖维护，先复用现成 Agent 循环；产品化也可以复用，不必重写 harness。** 单次修改从 CLI／编码 SDK 起步，批量任务先用原生委派。按下面的路径选入口，再看第 2 节的 harness／部署对照。

```
先用 CLI／编码 SDK 完成同一维护请求
├─ 批量目标 → 先核原生委派能否完整接收
├─ 要嵌入产品 → 现成编码能力用编码 SDK；业务工具先 Tool Runner／Agents SDK，工作区也核 SandboxAgent
├─ 愿意交出循环与会话运行 → 比较 Managed Agents／Agents API 的部署与数据边界
└─ 仍缺控制责任 → 只补缺口；重写循环须另证其必要性
```

**有明确质量、成本或时延目标时，比较成熟替代与自建；把环境、适配和人的接收一起计入。** 目标枚举、版本、审批、交付状态或领域验收缺什么，就只补对应薄层。额外层没有改善结果，或下一次修改的维护负担抵消收益时，撤掉该层、保留验收边界。

**任何一条答案为“否”，就停在更简单的方案（单次调用或固定工作流）；四条检查来自 Anthropic 官方 Skill**：

1. **复杂度**：任务是否多步骤、难以事先完全写清？
2. **价值**：结果是否值得更高的成本和延迟？
3. **可行性**：模型是否擅长这类任务？
4. **出错代价**：错误能否被发现和恢复（测试、评审、回滚）？

**依据**：四问来自 Anthropic 官方 Skill（入口见[页末来源](#来源)）；复用、改造与自建的比较见下节。核实 2026-10-22。

### 当前最高水平

<!-- frontier: status=已比较 gap=1 gen=2026-10 checked=2026-10-22 -->

**跨产品控制、模型接入或可观测性确有缺口，且愿承担平台维护，才借鉴自建路线。** Ramp／Sam Kronick 的 10月20日 Laminar 复盘是领先工程参照：团队尝试多种路线后，选择自己控制跨产品交互、模型选择／接入与观测，自建后仍承担升级、人审和值班。独立于它的 Spotify 6月3日复盘继续复用 Agent SDK。两者代表不同约束下的选择，本仓据此给条件默认，不把它们当统一成本竞赛。

| 主要选择 | 领先替代／反例 | 本仓决定 |
|---|---|---|
| 代码维护循环 | 现成原生／通用 harness、自建平台；Databricks同模型比较与9月独立研究并未确立通用冠军 | 先复用；明确质量／成本目标时先比较另一成熟实现，保审批、工具与历史契约 |
| 产品控制与二改 | Ramp统一平台、Spotify编码SDK、Shopify领域证明链 | 先保留现有循环，只补缺失的版本、权限、接收或产品行为；无独特收益或现成能力追上就删重复责任 |
| 业务工具与工作区 | 普通SDK runner＋服务端工具、编码SDK、应用内SandboxAgent | 按需要的工具／工作区选，不因需要文件就从零写循环 |
| 托管还是自运维 | Managed／Agents API、自托管执行面、应用内SDK | 先核控制面数据和运行责任，再选部署；自托管沙箱不等于数据不出网 |
| 工具、上下文与批量调用 | 当前工具搜索／压缩／程序化调用；受限窗口改造与宽窗反例 | 先复用已有机制，只有实际失败仍在才改该部分，按任务形状决定是否批处理 |
| 权限、凭证与外部写入 | 宿主审批／vault与应用执行的自定义函数 | 宿主覆盖的复用；应用保授权、结果记录和未知结果对账，不把隐藏密钥当授权限制 |
| 验收、结束与成本 | outcomes、测试／人审；正确补丁但运行超时的反例 | 同时报是否达标、是否结束、真实成本与下一次修改；不以循环返回或API成功判完成 |

整体质量／总投入冠军与主流采用比例仍未知；完整人工成本和当前最高端模型的二改对照还缺，以上条件默认不是效果排名。当前工程取舍、旧代独立实验与当前接口契约的区分见[研究记录](research/2026-10-12-long-task-evidence.md#p83整页构建agent的选择)。

**依据**：[一手：团队自报] [Ramp Laminar 复盘（10-20）](https://builders.ramp.com/post/building-laminar)、[Spotify 6月3日复盘](https://engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint)；[研究] [研究记录](research/2026-10-12-long-task-evidence.md#p83整页构建agent的选择)、本节同题比较；核实 2026-10-22。

### 同一个维护请求，三种实现怎么接收

**先复用现成 CLI／编码 SDK；只有跨次目标、版本或接收责任确有缺口，才在编码 SDK 上补薄控制层。** 比较固定题目：修复 CI 或升级依赖，审查期间主干又有改动，下一轮仍须保住新代码并交付。三条路线交同样的当前版本修改、全部目标处置和检查结果；不是用单次 CLI 对比整个平台的功能数量。

| 路线 | Agent 做什么 | 跨次责任由谁承担／何时采用 |
|---|---|---|
| 现成 CLI／编码 SDK | 找代码、修改、运行检查 | 人与已有 CI／任务系统核当前版本和接收；任务已可完整交付时保留 |
| 原生委派 | 拆分批量目标，回收子任务结果 | 先核原生接口能否列全目标、报告失败并保留人工接管；已覆盖就不另建调度层 |
| 编码 SDK＋自有薄控制层 | 同样的读改测，不重写模型推理步骤 | 程序只补缺失的目标清单、版本绑定、审批、交付记录与领域验收；这些责任确有缺口或有可验收益才加 |

**复用不等于绑定模型厂商的原生 harness。** Databricks 的生产代码库历史任务比较给另一成熟实现留下选择空间；独立原生／通用框架研究也未确立平均优势。换实现时，Agent 运行同类任务并交结果，人核质量、完成行为及维护投入；未保住所需契约就退回原组合。

**把准备和再改也算进去。** Spotify 的数据迁移复盘（Devon Edwards Joseph，2026-04-22）在当时不能外取 schema／文档的受限入口下，因全量提示难维护而放弃 Scio 分支。若新需求持续膨胀提示／映射，先收窄覆盖或改善接口。Agent 查当前代码并验证，人决定业务语义、风险和接收；继续的 dbt／BigQuery 路线因缺构建时单测，仍由下游团队手测。

**依据**：[一手] [Databricks 生产代码库历史任务比较](https://www.databricks.com/blog/benchmarking-coding-agents-databricks-multi-million-line-codebase)、[Spotify 数据迁移复盘（2026-04-22）](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4)、[Ramp Laminar 复盘（10-20）](https://builders.ramp.com/post/building-laminar)；[研究] [独立原生／通用框架研究](https://arxiv.org/html/2609.11987)、同题比较口径；核实 2026-10-22。

### 专用维护：先现成入口，再补领域证明链

**✅ 先核现成入口是否已经覆盖扫描与接收状态。** 当前 Claude Security 支持持续扫描、发现状态和修复跟踪；Codex Security 支持整仓／提交扫描、可编辑威胁模型、隔离验证及待人审补丁。满足组织验收时不重复自建平台；资格、数据和费用条件须分别核对，功能文档不证明哪家效果最好。

**保留任务自己的证明条件，而不是固定角色数。** Shopify 的生产实践要求验证经过真实应用入口，并因共享端口、数据库和 fixtures 而顺序运行 Verifier；Anthropic 参考方法则强调独立验证环境。Agent 可生成候选、测试和修补，人定实际部署边界与有效影响；能隔离目标资源再考虑并发，不能靠增加 reviewer 弥补共享状态污染。

**⛔ 不把官方参考仓当作有人维护的生产依赖。** Anthropic 固定参考版本已声明不再维护，其 C/C++ ASAN 验证也不能原样替代 Web 应用验收。值得借的是验证边界；源码的总 passed 仍允许部分检查缺测，接收必须消费分项。现成入口已满足要求就撤掉重复编排，确有领域缺口才保留适配，详见[固定源码与比较](research/2026-10-12-long-task-evidence.md#p57续补专用入口与领域证明链)。

内网工具优先接已有 MCP／CLI（见 [04](04-mcp.md)）；若工具输入输出也不得出网，先排除不符合数据边界的路线，细节见 §4.5。

**依据**：[一手] [Claude Security 文档](https://support.claude.com/en/articles/14661296-use-claude-security)、[Codex Security 文档](https://help.openai.com/en/articles/20001107-codex-security)、[Anthropic 固定参考版本](https://github.com/anthropics/defending-code-reference-harness/tree/d3bea6b5793b5f3d59a75ebe69a58efa88383145)、Shopify／Anthropic 团队原文；[经验] 团队分工取舍；[研究] [固定源码与比较](research/2026-10-12-long-task-evidence.md#p57续补专用入口与领域证明链)；核实 2026-10-22。

## 2. 两个关键问题：谁提供 harness，谁提供部署

**harness 管循环与上下文，部署管运行位置；分别选择谁提供。** 下面沿 Anthropic 的划分列出两层责任，再对照 OpenAI 的入口。

| 方案 | 你写什么 | harness | 部署 | 自带的工具 | 适用 |
|---|---|---|---|---|---|
| **Claude API 手写循环** | 请求、client-tool执行与续接 | 自己写 | 自己托管 | 自定义 client tools＋可选服务端工具 | 要完全掌控循环 |
| **Claude API Tool Runner** | 只写工具函数 | SDK 提供循环；应用在迭代／工具执行边界加控制，续接按语言与版本核对 | 自己托管 | 自定义 client tools＋可选服务端工具 | 仅调用业务工具、无需编码环境时的起点 |
| **Claude Agent SDK** | 提示词 + 选项 | **就是 Claude Code 的 harness**（内置读写、编辑、Bash、搜索、子 Agent、Hook、权限、会话） | 自己托管 | 内置文件和 Bash 工具 + MCP | 要在自己的基础设施上跑一个“现成的编码 Agent” |
| **Claude Managed Agents**（beta） | Agent 配置 + 你的工具结果 | Anthropic 运行循环 | **Anthropic 为每个会话提供容器**（也可以自托管沙箱） | 容器内的 Bash、文件、代码执行 + Skill + MCP | 长时间运行、需要工作区、定时运行、需要按明确 rubric 迭代的任务 |

OpenAI 的对应划分（developers.openai.com）：

| 方案 | 说明 | 对应 Anthropic 的 |
|---|---|---|
| **Agents API** | OpenAI 托管的 **Codex harness**，自动压缩上下文、多 Agent 编排、程序化工具调用、MCP；沙箱可以是 OpenAI 托管、自托管或不用 | Managed Agents |
| **Agents SDK** | 在你的应用里运行 Agent 循环和交接（handoff）；开源，可接不同模型；也有应用内 SandboxAgent 工作区路径 | 业务工具循环＋应用自管编排／沙箱 |
| **Responses API** | 直接调模型，从零搭 | 手写循环 |
| **Codex SDK**（TypeScript / Python） | 程序化控制**本地的 Codex**（启动、继续、恢复线程），用于 CI 和内部工具 | Claude Agent SDK |
| **Codex app-server** | Codex 给 VS Code 扩展等富客户端用的接口（认证、会话历史、审批、事件流），开源；`codex mcp-server` 已被移除，迁移到这里 | — |

**依据**：[一手] Anthropic 官方文档（harness／部署划分）、[OpenAI Agents 文档](https://developers.openai.com/api/docs/guides/agents)；核实 2026-10-22。

<a id="3-怎么选"></a>

## 3. 选定 SDK 后，固定运行契约

**两个容易混淆的点**：
- **Tool Runner 不等于 Claude Agent SDK。** 前者不自带 Claude Code 的本地读改测环境，但可接自定义工具和服务端搜索／代码执行；后者提供现成编码 harness。截至 2026-10-10，Python 版 Agent SDK 的官方发行包已捆绑 Claude Code CLI，默认无需另外安装；可用 `ClaudeAgentOptions(cli_path=...)` 指定其他 CLI。见[官方 README 固定来源 S6](research/2026-10-10-audit.md)；安装文档未运行验证。
- **Agent Skills 不等于 Managed Agents。** 前者是给模型加载的知识包，后者是托管的运行环境。

**需要自管工作区，先核现成 SDK 的沙箱接口。** OpenAI SandboxAgent 把应用内 harness 与文件／命令执行环境分开；已有编码 SDK 足够时不换，仅缺计算面的提供方或生命周期控制时先比较这一现成路径。

**应用仍负责自己执行的业务动作。** Agents API Functions 不会因挂载了 environment 就自动在其中执行函数。保留授权与执行结果，断线先查 pending actions、复用原调用结果；动作结果未知先对账，细节归[20 §9](20-codex-long-horizon.md#9-超时后动作究竟发生了吗)。

**复用 SDK 时，先固定运行契约，不急着重写循环（2026-10-15）**：
- Claude Python SDK 优先使用捆绑 CLI；显式 `cli_path` 会改用另一套运行时。当前文档和固定源码支持省略 `setting_sources` 时继承文件配置，`[]` 关闭 user／project／local 来源；产品或 CI 应显式选择来源与 `cwd`，但空列表不关闭 managed policy、全局配置及独立的自动记忆。
- Codex Python SDK 的发行包带固定 CLI runtime，通过本地 app-server 通信；需要自定义客户端的认证、审批和事件交互时选 app-server，普通自动编码仍用 CLI／SDK。
- CLI／SDK 更新会带来默认模型和环境行为变化。Anthropic 自己的 issue-triage 因默认模型改变而失败，维护者用显式模型修正；这支持锁定可用的模型与运行时组合，不支持为了防升级就自建 harness。

- 先核所用版本，再保留教程兼容层。Python Tool Runner当前固定源码已自动续接`pause_turn`，旧官方Skill仍指导另套重启循环；迭代到上限仍可能返回暂停态。Agent交停止原因与结果，人按任务接收，见[版本反例](research/2026-10-12-long-task-evidence.md#p83整页构建agent的选择)。
- app-server 是自定义客户端接口，不是现成公网托管服务；当前 WebSocket 仍实验性，非 loopback 默认可能无认证，不能直接暴露。普通自动编码保 CLI／SDK，远程产品另核受支持部署与认证。

固定实现、测试定义及维护者原帖见 [S6a 选型补核](research/2026-10-10-audit.md#s6a--2026-10-15-sdk托管选型补核)；源码和当前文档不证明读者已经安装对应版本。

**依据**：[一手] [OpenAI SandboxAgent](https://developers.openai.com/api/docs/guides/agents/sandboxes)、[Agents API Functions](https://developers.openai.com/api/docs/guides/agents-api/tools/functions)、[app-server 当前契约](https://learn.chatgpt.com/docs/app-server)、Claude／Codex SDK 固定文档、Claude Agent SDK 安装文档（未运行验证）；[研究] [S6a 选型补核](research/2026-10-10-audit.md#s6a--2026-10-15-sdk托管选型补核)；核实 2026-10-22。

## 4. 设计要点（不管用哪家）

**先按工具面、上下文、组合调用、质量评判、安全与成本的顺序补缺口，每一层都先复用现成机制。**

### 4.1 工具面：先用 Bash 求广度，再把关键动作提升为专用工具
**先核宿主与已有 CLI；缺少下列可识别、可执行的契约时，再把动作提升为专用工具。** Anthropic 的 Agent 设计指南强调专用工具便于表达操作契约。

| 情况 | 原因 |
|---|---|
| **需要把关** | 难以撤销的动作（调外部 API、发消息、删数据）适合放在确认之后。`send_email` 工具容易拦截，`bash -c "curl -X POST …"` 不容易 |
| **需要防过期** | 带版本检查的 edit 工具可拒绝覆盖读取后的新改动；Bash 调用也可实现此检查，但通用命令入口不自动提供该契约 |
| **需要渲染** | 比如把“向用户提问”做成工具，才能弹出选项并阻塞循环 |
| **需要并行** | `grep`、`glob` 等专用工具便于声明并发安全性；Bash 中独立读取也可并行，但须由宿主或调度方判断依赖与副作用，不能仅凭工具名决定 |

这和 [10 安全](10-security.md) 的结论一致：**关键动作要有明确的权限和执行边界，不能只审命令字符串**；相关审批案例和样本局限统一在 10 维护。

**先复用审批，但核清实际执行者。** Managed Agents 内置 toolset 默认 `always_allow`，MCP 默认 `always_ask`；必须人工把关的动作明确设为 `always_ask`，`auto` 不是固定人工检查点。应用自定义工具不归该策略管，在实际工具执行前做授权检查，不能把生成工具结果当审批。

**依据**：[一手] Anthropic Agent 设计指南、[Managed Agents 权限契约](https://platform.claude.com/docs/en/managed-agents/permission-policies)；[研究] [10 安全](10-security.md)、采用建议；[经验] 采用判断；核实 2026-10-22。

### 4.2 上下文：先复用按需加载，再按 API 契约保缓存
**先复用按需加载与缓存契约，再补自己的上下文逻辑。**
- 多工具先试宿主已有的工具搜索和 Skill，不因“工具多”就手写循环。Anthropic 的 deferred tool search 把定义通过引用加入对话、保持前缀；普通增删顶层 `tools` 不自动享有这个性质，也不能把同一保证套给任意 MCP 元工具。
- 需要中途改变业务工具时，先查目标模型／平台支持的追加接口：Claude 支持的模型可追加 system 消息，inline-tools beta 可追加工具定义；不要改写旧前缀，也不要为保缓存拒绝必要的模型或权限调整。顶层工具、系统、消息与 effort 的分层规则统一见 [02 缓存边界](02-models-and-cost.md#2-价格快照api-美元百万-token)。
- 长任务先用现成 harness 的上下文编辑、压缩与跨会话记录；只有所需状态或控制流无法表达时，才补自己的逻辑。

**出现容量或停滞问题，先改对应机制，不直接换整套循环。** Lewis 的 8月同模型对照在紧窗口有效、宽窗不保持同样优势；对照是满窗即停的顺序记录，不是已有压缩的当前 CLI。Agent 保留原始记录并交接收结果，人核干预是否真的触发、是否改善任务；原缺陷消失就撤重复逻辑。

这些是特定 API 的契约，不代表 CLI／SDK 已暴露每个 beta 开关；具体反例和适用模型见 [S6a](research/2026-10-10-audit.md#s6a--2026-10-15-sdk托管选型补核)。

**依据**：[一手] [工具搜索契约](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)、[中途变更契约](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages)；[研究] [Lewis 8月同模型对照](https://arxiv.org/html/2608.26218)、[S6a 选型补核](research/2026-10-10-audit.md#s6a--2026-10-15-sdk托管选型补核)；核实 2026-10-22。

### 4.3 组合工具调用：程序化工具调用
**🧪 只在代码能替代中间判断时采用**：批量独立查询、大结果过滤／聚合，或后续参数可由代码直接算出的依赖调用，先试现成 API／harness 的程序化工具调用；每步都要模型重新判断、用户审批或保留原生引用／文件时，默认直接调用，不因“调用多”就改写循环。Anthropic 与 OpenAI 当前文档均按任务形状区分；前者还报告过顺序单调用评测成本上升、质量未变的反例。

**先验适配层，再启用**：API 支持不等于所用框架已支持。OpenAI Responses 路径须保留程序事件、原始调用来源 `caller` 和结果关联；缺失时留在直接调用或换已支持该契约的接口，不能只加一个开关。普通业务工具仍先用 Tool Runner／Agents SDK，不新增自建 harness。限制：节省与兼容性都依赖具体任务、版本和执行路径，真实失败及固定源码详见 [S6b](research/2026-10-10-audit.md#s6b--2026-10-15-程序化工具调用的采用边界)。


**依据**：[一手] [Claude 程序化工具调用](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)、[OpenAI 程序化工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)、固定源码；[研究] [S6b 采用边界](research/2026-10-10-audit.md#s6b--2026-10-15-程序化工具调用的采用边界)、采用判断；核实 2026-10-22。

### 4.4 质量：把“完成标准”交给独立的评判者
**把完成标准交给独立评判者，并读取 outcome result 判断是否达标。**
- Managed Agents 的 **outcomes** 用独立上下文的 grader，按明确 rubric 在迭代上限内反馈。应用应读取 outcome result：`satisfied` 才表示 rubric 满足，迭代耗尽、失败或中断须另行处理；转为 `idle` 不等于达标。模型评分不替代测试或人工验收，见 [22](22-agent-evaluation.md)。
- 这正是 [14 规律一](14-synthesis.md#1-规律一验证覆盖与自主权分开判断) 的落地：能锐化的验证器就锐化，干活的和评判的分开。

### 4.5 安全与成本
**先复用现成执行环境的安全、预算与停止机制，再补自己的控制；数据边界不合格的路线直接排除。**
- **请求超时不等于整项任务截止时间**：先核实际 SDK／传输版本的 `timeout` 限制连接、读写等待还是整次请求，再核 SDK 与应用各自的重试、退避及流读取范围。需要限制整项任务耗时时，优先用现有执行环境的总时限与取消机制，确认覆盖重试等待和工具步骤；仅调小 `timeout` 或设置 `max_retries` 不足以保证按时停止。OpenAI Python SDK 的 HTTPX2 读超时与 Go 的整次请求超时提供不同契约，详见[固定证据](research/2026-10-12-long-task-evidence.md#请求超时重试与整项任务截止时间)。**局限**：这些普通 API SDK／HTTP 客户端契约不代表 Codex／dot 的停止行为；动作结果未知仍按 [20 §9](20-codex-long-horizon.md#9-超时后动作究竟发生了吗)对账。
- **长期凭证尽量留在执行环境外**：Managed Agents 云沙箱 vault 可在出口替换占位符；限制目标 host，支持时优先只在请求 header 注入。隐藏密钥不等于限制其使用权限；自托管沙箱需自己的凭证处理。
- **先选预算范围**：Claude CLI／Agent SDK 的运行预算按客户端 API 费用估算，恢复历史费用不纳入本次上限；Managed Agents 则按会话累计公开标价，达到后暂停新增模型请求并保留历史与沙箱。托管仍允许执行中的请求及其工具完成并超额，不能当作总账绝不超支。跨任务额度需应用另行累计。
- **内网工具不必等于自建循环**：Managed Agents 可自托管沙箱，让执行、文件和网络出口留在己方；但工具输入输出仍发送到 Anthropic 控制面。若要求这些内容也不得出网，这条路径不合适，换 SDK 也不自动改变云模型的数据边界。
- **先按数据硬约束排除部署路线**：当前 OpenAI Agents API 仅支持美国数据驻留、不支持 ZDR，自托管沙箱也不改变；不符合要求就不采用该服务，换 SDK 仍须另核模型服务的数据边界。
- **只开启需要的联网工具**：Managed Agents 的 `limited` 云环境 `allowed_hosts` 也约束 `web_search`／`web_fetch`，工具与环境的域名名单须匹配；自托管沙箱的防火墙不限制这类服务端工具，仍需单独约束。
- **有限选项判断有缺口才试决策接口**：反复出现的语义路由、分类或检查项预筛，现有规则／模型在质量、等待或成本上不足时，再比较 OpenAI Decisions API 或开源决策模型；不把开放式规划整体改成选项打分。误报、漏报、复核和升级计入总成本，无净收益就撤回。阈值须按目标任务校准，回退与权限由程序守住，详见 [02](02-models-and-cost.md#21-新类别决策模型2026-09-起)及[原始契约与比较范围](research/2026-10-10-audit.md#s1d--2026-10-16-决策接口的评分与执行边界)。

**依据**：[一手] [outcomes 契约](https://platform.claude.com/docs/en/managed-agents/define-outcomes)（2026-10-15 UTC+8）、[vault 与适配范围](https://platform.claude.com/docs/en/managed-agents/vaults)、[CLI reference](https://code.claude.com/docs/en/cli-reference)、[Session budgets](https://platform.claude.com/docs/en/managed-agents/budgets)、[Self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes)、[Agents API 概览](https://developers.openai.com/api/docs/guides/agents-api/overview)、[web 工具限制](https://platform.claude.com/docs/en/managed-agents/tools-web-restrictions)、固定证据；[研究] [22 评估](22-agent-evaluation.md)、[14 规律一](14-synthesis.md#1-规律一验证覆盖与自主权分开判断)、[20 §9](20-codex-long-horizon.md#9-超时后动作究竟发生了吗)、[02](02-models-and-cost.md#21-新类别决策模型2026-09-起)、[S1d](research/2026-10-10-audit.md#s1d--2026-10-16-决策接口的评分与执行边界)；核实 2026-10-22。

## 5. 成本参考

**按“完成一个任务的成本”衡量，而不是按单次请求；已有方案够用就保留。** 等待或预算受限时，按模型支持与任务需要试较低 effort 或轻量执行者，把检查与返工计入。质量变差或返工抵消节省就撤回，不统一规定先降 effort；采用条件见 [02](02-models-and-cost.md#1-原则按任务分档而不是追榜单)。

| 项目 | 价格 | 来源 |
|---|---|---|
| Managed Agents 会话运行时间 | $0.08 / 小时（另加模型 token 和工具费用） | [当前会话预算文档](https://platform.claude.com/docs/en/managed-agents/budgets)（公开标价，2026-10-15） |
| 网页搜索 | $10 / 1000 次 | 同上 |
| 子 Agent 的候选轻量模型 | 先核任务能力、长输入分档与缓存口径，不在这里重复维护模型价表 | [02 模型与成本](02-models-and-cost.md#2-价格快照api-美元百万-token) |

**依据**：[一手] [当前会话预算文档](https://platform.claude.com/docs/en/managed-agents/budgets)（公开标价，2026-10-15）；[研究] [02 模型与成本](02-models-and-cost.md#2-价格快照api-美元百万-token)、采用判断；核实 2026-10-22。

## 6. 评级

**按成熟度从高到低选：优先现成入口，自有基础设施与托管运行次之，从零手写循环最后。**

| 方案 | 评级 | 说明 |
|---|---|---|
| 现成 Agent 的非交互模式（`claude -p`、`codex exec`） | ✅ | 可完整接收的单次代码／CI 维护起点 |
| Claude API Tool Runner / OpenAI Agents SDK | ✅ | 业务工具起点；有工作区需求也核现成沙箱能力 |
| Claude Agent SDK / Codex SDK | 🧪 | 在自己的基础设施上跑编码 Agent；注意它们依赖对应 CLI 的版本 |
| Managed Agents / OpenAI Agents API | 🧪 | 托管运行，长时间、定时、需要工作区的任务；都还是较新的产品 |
| 从零手写 Agent 循环 | 👀 | 现成循环无法表达所需能力，且同题结果值得承担持续适配时再选；产品控制层可独立建设 |

未实测 SDK 或模型效果。

## 来源

- Anthropic：Claude API 官方 Skill（`shared/agent-design.md`、`shared/managed-agents-*.md`）；[Claude Agent SDK 文档](https://code.claude.com/docs/en/agent-sdk)；[claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)
- OpenAI：[Agents](https://developers.openai.com/api/docs/guides/agents)、[Decisions](https://developers.openai.com/api/docs/guides/decisions)、[Codex SDK](https://learn.chatgpt.com/docs/codex-sdk)、[Codex app-server](https://learn.chatgpt.com/docs/app-server)、[Non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode)、[openai-agents-python](https://github.com/openai/openai-agents-python)
- [google/adk-python](https://github.com/google/adk-python)、[strands-agents/sdk-python](https://github.com/strands-agents/sdk-python)
