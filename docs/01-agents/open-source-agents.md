# 开源 Coding Agent

> 核实时间：2026-10-08；2026-10-15 补核 Pi／Aider，其余未全量重核。依据各项目仓库 README、最近提交时间 **[一手]**，以及 HN 原帖 **[社区]**。

## 总览

| 项目 | 形态 | 亮点 | 最近提交 | 评级 |
|---|---|---|---|---|
| [OpenCode](https://github.com/anomalyco/opencode)（原 sst/opencode） | TUI + 桌面 App（Beta） | 模型无关；内置 `build`（全权限）和 `plan`（只读）两个 Agent，Tab 切换；`@general` 子 Agent；安装渠道多 | 2026-10 | 🧪 试用 |
| [Cline](https://github.com/cline/cline) | VS Code / JetBrains / CLI / 桌面 App | 每步人工审批；CLI 支持无头模式，可用于 CI；桌面版能定时运行 | 2026-10 | 🧪 试用 |
| [Kilo Code](https://github.com/Kilo-Org/kilocode) | VS Code / JetBrains / CLI | 开源，多种安装方式 | 2026-10 | 👀 评估 |
| [Goose](https://github.com/aaif-goose/goose) | 桌面 / CLI / API（Rust） | 通用 Agent（不限于编码）；15+ 服务商；可通过 ACP 使用 Claude/ChatGPT/Gemini 订阅；**已加入 Linux 基金会旗下 AAIF** | 2026-10 | 🧪 试用 |
| [Qwen Code](https://github.com/QwenLM/qwen-code) | 终端 / IDE / 桌面 / Web / 聊天软件 | 自带 auto memory、auto skills、子 Agent、Agent Teams；支持 OpenAI / Anthropic / Gemini / Qwen 协议，可接本地模型；集成钉钉、飞书、微信 | 2026-10 | 🧪 试用（国内团队友好） |
| [GitHub Copilot CLI](https://github.com/github/copilot-cli) | 终端 | 默认带 GitHub MCP；与 Issue / PR 深度集成；需要 Copilot 订阅 | 2026-10 | 🧪 试用（重度 GitHub 用户） |
| [Pi](https://pi.dev)（Earendil Works） | 终端 / SDK / RPC | 默认启用 4 个工具，可扩展 MCP／codemode；不内置子 Agent/plan mode；按进程权限运行，工具少不证明净成本低 | 2026-10-15 读取固定 main | 🧪 适合愿意定制并维护隔离的人；见 [固定来源与边界](../research/2026-10-12-community-source-records.md#2026-10-15-选型补核默认工具不是成本或隔离边界) |
| [DeepSeek Harness](https://www.deepseek.com/en/harness/) | 桌面 App（macOS、Windows）+ Web UI | 2026-10-02 公开预览并开源；基于 Cordis 的“一切皆插件”架构，可以在“Creator 模式”里让它自己写插件；实验性功能包括 Agent Teams、自动审批评审、定时任务 | 2026-10 | 👀 评估：**桌面版默认开启遥测**（HN 用户给出了关闭方法），数据合规需要自行评估 **[一手：官网；社区：HN]** |
| [Aider](https://github.com/Aider-AI/aider) | 终端 | 老牌、git 友好、repo map | **2026-05-22** | ⛔ 依赖持续模型／接口适配的新项目暂缓；已有稳定工作流不据此迁移 |

**本轮补核（2026-10-15，仅 Pi／Aider）**：机制与范围见 [24](../24-community-workflows.md)。Aider main 末次提交仍为 2026-05-22；同一 HEAD 已有较新 Claude 与 GPT-5.5 配置，不能由旧 README 推断模型兼容停在 Claude 3.7，也不能把 main 配置当成稳定版已发布，见[固定证据](../research/2026-10-12-community-source-records.md#2026-10-15-aider维护节奏与模型兼容分开判断)。**[一手；研究：边界]**

## 怎么选

- **想要 Claude Code 的体验，但希望换模型或接本地模型** → OpenCode。
- **团队在国内，需要接国产模型或用 Coding Plan** → Qwen Code / OpenCode（见 [02 模型与成本](../02-models-and-cost.md#4-国内-coding-plan)）。
- **主要在 IDE 里工作，希望每一步都审批** → Cline / Kilo Code。
- **想要“一切皆插件”、让 Agent 自己扩展界面和工具** → DeepSeek Harness（先评估数据合规）。
- **想自己搭 harness，且愿意维护扩展与运行隔离** → 🧪 Pi；仅为省 token 不足以支持迁移。理解原理可配合阅读 [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code)（拆解 Coding Agent 的组成部分）。

## 开源 Agent 的采用理由与成本边界

| 优势 | 证据 |
|---|---|
| **可以接任何模型**，包括本地和国产 | HN“有人用本地模型做日常编码吗”（1318 票）的常见组合：Pi 或 OpenCode + llama.cpp / unsloth；Qwen Code 原生支持国产模型和钉钉、飞书 **[社区]** |
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
