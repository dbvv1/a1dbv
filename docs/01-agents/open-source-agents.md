# 开源 Coding Agent

> 编辑更新：2026-10-21（UTC+8）；本次补模型与 harness 的比较，产品事实保留分项核实日期与范围：[OpenCode及历史基线](../research/2026-10-12-community-source-records.md#opencode规划权限与文件恢复分开选择)、[Pi](../research/2026-10-12-community-source-records.md#2026-10-15-选型补核默认工具不是成本或隔离边界)、[Aider](../research/2026-10-12-community-source-records.md#2026-10-15-aider维护节奏与模型兼容分开判断)、[Cline](../research/2026-10-12-community-source-records.md#cline审批按宿主与有效设置判断)、[Goose](../research/2026-10-12-community-source-records.md#goose订阅接入先核适配器身份与资格)、[Qwen Code](../research/2026-10-12-community-source-records.md#qwen-code内置不等于默认启用)、[Copilot CLI](../research/2026-10-12-community-source-records.md#copilot-cli接入与治理范围)；项目文档与源码 **[一手]**，HN 原帖 **[社区]**。

## 30 秒结论

**✅ 有明确质量目标或能力缺口时，把开源 harness 列入比较。** 例如自选服务商、私有部署、改工具循环，或希望提高修改质量；先核现有入口能否满足，只缺会话整理可保留 CLI 并换[界面承载](ide-and-others.md#zed)。[研究：2026-10代际条件默认]

**⛔ 开源不自动带来更强模型或更低总成本。** 比较单位是模型、harness 与有效配置的组合：Agent 做同一修改并运行原验收，人核结果、后续修改和维护投入；协议、审批或恢复不兼容就撤回。[研究]

## 当前最高水平

<!-- frontier: status=仅候选 gap=2 gen=2026-10 checked=2026-10-21 -->

**当前面向持续仓库修改的最佳开源组合未知。** [Zed 当前外部 Agent 契约](https://zed.dev/docs/ai/external-agents)将 OpenCode／Pi 的认证、模型选择与宿主界面分开；结合[终端承载](ide-and-others.md#zed)，可确认开源 harness、IDE 和原生 CLI 不是互斥路线。这是接入机制证据，尚非领先维护成果。[一手；研究]

**本页采用“按质量目标或能力缺口试换”的可行默认，差距仍2。** 同题迁移的主流做法与净收益仍未知；本轮查到的跨 harness 论文有报表口径待核，未作为采用依据。候选与排除理由见[研究记录](../research/2026-10-12-community-source-records.md#p54入口选择先分界面harness与执行环境)，比较步骤见[总览](README.md#当前最高水平先分层再决定迁移)。[研究]

## 总览

| 项目 | 形态 | 亮点 | 最近提交 | 评级 |
|---|---|---|---|---|
| [OpenCode](https://github.com/anomalyco/opencode)（原 sst/opencode） | TUI + 桌面 App（Beta） | 模型无关；内置 `build`（全权限）和 `plan`（规划，权限边界见下）两个 Agent，Tab 切换；`@general` 子 Agent；安装渠道多 | 2026-10 | 🧪 试用 |
| [Cline](https://github.com/cline/cline) | VS Code / JetBrains / CLI / 桌面 App | IDE 可按工具类别配置审批；CLI 支持无头模式，但审批默认值须单独核对，见下；桌面版能定时运行 | 2026-10 | 🧪 试用 |
| [Kilo Code](https://github.com/Kilo-Org/kilocode) | VS Code / JetBrains / CLI | 开源，多种安装方式 | 2026-10 | 👀 评估 |
| [Goose](https://github.com/aaif-goose/goose) | 桌面 / CLI / API（Rust） | 通用 Agent；Claude／Codex ACP 先核适配器、认证及资格；Gemini 旧订阅入口已弃用，改核 API key／Vertex AI（[接入条件](../research/2026-10-12-community-source-records.md#goose订阅接入先核适配器身份与资格)）**[一手；研究]**；已加入 AAIF | 2026-10 | 🧪 试用 |
| [Qwen Code](https://github.com/QwenLM/qwen-code) | 终端 / IDE / 桌面 / Web / 聊天软件 | 内置 auto memory、子 Agent；auto skills 与实验性 Agent Teams 需启用；聊天渠道需配置机器人／账号（[采用前提](../research/2026-10-12-community-source-records.md#qwen-code内置不等于默认启用)）；支持多模型协议与本地模型 | 2026-10 | 🧪 试用（国内团队友好） |
| [GitHub Copilot CLI](https://github.com/github/copilot-cli) | 终端 | Copilot Free 也含 CLI；本地 BYOK 可免 GitHub 登录，未登录时缺 GitHub MCP／云端委派等能力，受管设备另核组织限制，见[接入与治理边界](ide-and-others.md#copilot接入与治理边界) | 2026-10-16 定点核查 | 🧪 试用（重度 GitHub 用户先核所需认证与能力） |
| [Pi](https://pi.dev)（Earendil Works） | 终端 / SDK / RPC | 默认启用 4 个工具，可扩展 MCP／codemode；不内置子 Agent/plan mode；按进程权限运行，工具少不证明净成本低 | 2026-10-15 读取固定 main | 🧪 适合愿意定制并维护隔离的人；见 [固定来源与边界](../research/2026-10-12-community-source-records.md#2026-10-15-选型补核默认工具不是成本或隔离边界) |
| [DeepSeek Harness](https://www.deepseek.com/en/harness/) | 桌面 App（macOS、Windows）+ Web UI | 2026-10-02 公开预览并开源；基于 Cordis 的“一切皆插件”架构，可以在“Creator 模式”里让它自己写插件；实验性功能包括 Agent Teams、自动审批评审、定时任务 | 2026-10 | 👀 评估：**桌面版默认开启遥测**（HN 用户给出了关闭方法），数据合规需要自行评估 **[一手：官网；社区：HN]** |
| [Aider](https://github.com/Aider-AI/aider) | 终端 | 老牌、git 友好、repo map | **2026-05-22** | ⛔ 依赖持续模型／接口适配的新项目暂缓；已有稳定工作流不据此迁移 |

**本轮补核（2026-10-15，仅 Pi／Aider）**：机制与范围见 [24](../24-community-workflows.md)。Aider main 末次提交仍为 2026-05-22；同一 HEAD 已有较新 Claude 与 GPT-5.5 配置，不能由旧 README 推断模型兼容停在 Claude 3.7，也不能把 main 配置当成稳定版已发布，见[固定证据](../research/2026-10-12-community-source-records.md#2026-10-15-aider维护节奏与模型兼容分开判断)。**[一手；研究：边界]**

## 怎么选

- **需要自选服务商或本地模型** → 🧪 OpenCode 可列候选；先核所需模型的工具调用与原验收，不承诺复制 Claude Code 的体验。
- **团队在国内，需要接国产模型或用 Coding Plan** → Qwen Code / OpenCode（见 [02 模型与成本](../02-models-and-cost.md#4-国内-coding-plan)）。
- **主要在 IDE 里工作，希望保留操作前审批** → Cline 可列入候选，先关闭需人工确认类别的自动批准并核对有效设置；不能把产品名当成“每步必审”的保证，见下。
- **想要“一切皆插件”、让 Agent 自己扩展界面和工具** → DeepSeek Harness（先评估数据合规）。
- **想自己搭 harness，且愿意维护扩展与运行隔离** → 🧪 Pi；仅为省 token 不足以支持迁移。理解原理可配合阅读 [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code)（拆解 Coding Agent 的组成部分）。

## Cline：先选宿主，再核有效审批

🧪 **希望在 IDE 中审查文件修改与命令时，可以试用 Cline，但先检查 Auto Approve。** 它支持按工具类别自动批准，不能笼统称为“每步人工审批”。普通 CLI 的当前文档及固定源码以工具自动批准为内置默认；显式参数、已保存设置和 ACP 接入另有优先级或例外，不能直接套用 IDE 的设置。关闭 CLI 的自动批准也不等于所有入口、所有工具都逐次询问。**[一手：官方文档与固定源码]**

**需要审批才继续的任务，先核实际版本、启动方式及有效设置；无人值守则先隔离环境。** 自动批准开关控制是否询问，不证明目录、凭证或出网已受操作系统限制；仍采用 [10 的最小权限与隔离建议](../10-security.md#30-秒结论)。当前 IDE 文档的旧命令分类与固定 main 实现有差异，不把旧菜单说明当成现行保证；[固定来源与宿主边界](../research/2026-10-12-community-source-records.md#cline审批按宿主与有效设置判断)记录差异。未运行客户端、验证实际安装默认值或比较安全效果。**[研究：采用边界]**

## OpenCode：规划与撤回边界

🧪 **需要在终端撤回一轮编辑时，OpenCode 仍可列入候选。** TUI 的 `/undo` 撤回最近用户消息及后续回复，并恢复相关文件；`/redo` 可重做被撤回的消息及相关文件变更。文件恢复依赖 Git 项目及可用快照；只恢复会话记录关联的文件，不等于撤销外部操作。若同一文件后来又有人修改，先保留这些改动，再核对恢复后的 diff，不能把它当自动合并。**[一手：官方文档与固定源码；研究：采用判断]**

**只做规划时选 Plan，但不要把模式名当成绝对禁止写入。** 固定 v2.0.30 的内置 Plan 插件默认禁止常规文件编辑，却允许专用计划目录，并通过提示约束只在用户要求时写计划。官方 Agents 页仍把编辑／bash 描述成默认 `ask`，与该实现不同；依赖严格只读时，核对实际版本、有效权限及扩展工具，不照搬该默认值。详见[固定来源与差异](../research/2026-10-12-community-source-records.md#opencode规划权限与文件恢复分开选择)。未运行客户端或验证跨平台恢复。**[一手；研究：采用边界]**

## 开源 Agent 的采用理由与成本边界

| 优势 | 证据 |
|---|---|
| **可选择支持的模型端点**，包括部分本地与国产模型 | HN“有人用本地模型做日常编码吗”（1318 票）给出 Pi 或 OpenCode + llama.cpp / unsloth 等组合；协议接通后仍须核工具调用和任务质量，不能概括为任何模型都适用 **[社区；研究]** |
| **能读源码、能改** | 出了问题可以看实现；DeepSeek Harness、Pi 都可以用插件或扩展改造界面和工具 |

**不把旧输入量当当前成本优势**：Systima 在 2026-07、Claude Code 2.1.207／OpenCode 1.17.18 的隔离代理实验中测得首轮约 33k／7k 输入及不同缓存重写行为；这不是当前默认开销排名。是否迁移应比较实际完整任务的质量、返工与含缓存的总成本，先检查当前工具负担和缓存状态，见 [S1c 的范围与诊断入口](../research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)。**[社区：历史实验；研究：采用边界]**

**本地模型按任务与配置评估**：不把家用模型统一对标 Haiku，也不以总参数量断言能否运行。先固定量化、上下文、并发与 CPU／GPU 卸载条件，再比较任务质量、延迟和含返工的总成本；可加载不等于性能满足需求，见 [02 本地模型选择](../02-models-and-cost.md#5-本地--开源权重模型)。**[研究：采用边界]**

## 评估一个开源 Agent 的清单

1. **维护状态**：最近提交、发版节奏、issue 响应（Aider 已经明显放缓）；
2. **安全默认值**：默认是否沙箱、是否逐步审批、是否默认开启遥测（DeepSeek Harness 桌面版默认开启）；
3. **开放格式支持**：AGENTS.md、Agent Skills、MCP，决定你的配置能不能带走；
4. **非交互模式**：能否在 CI 里无头运行并返回清楚的退出码；
5. **用你自己的 5–10 个真实任务试**：同一个模型在不同 harness 里的表现差距可能很大，只有自己的任务能说明问题（方法见 [09 第 3 节](../09-review-and-quality.md#3-给自己的-ai-配置做评估)）。

## 共同注意事项

1. 开源 Agent 的效果**强依赖所接的模型**：同一个 harness 接不同模型，差距可能很大。
2. 接本地模型时，留意工具调用的稳定性。很多小模型在多步工具调用上容易出错。
3. 安全默认值各不相同（是否默认沙箱、是否默认逐步审批），上手前先看配置。

## 来源

各项目 GitHub 仓库 README（2026-10-03 读取）；Pi 相关：[Earendil：You said no MCP](https://earendil.com/posts/you-said-no-mcp/)、[Latent Space：Pi 1.0, Pi Durable](https://www.latent.space/p/ainews-pi-10-pi-durable-and-aie-nyc)、HN：[Ask HN：本地模型](https://news.ycombinator.com/item?id=48542100)；[Systima token 开销实测](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)；DeepSeek Harness：[官网](https://www.deepseek.com/en/harness/)、[HN 讨论](https://news.ycombinator.com/item?id=49929489)。
