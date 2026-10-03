# 开源 Coding Agent

> 核实时间：2026-10-03。依据各项目仓库 README 与最近提交时间 **[一手]**，补充信息标注来源。

## 总览

| 项目 | 形态 | 亮点 | 最近提交 | 评级 |
|---|---|---|---|---|
| [OpenCode](https://github.com/anomalyco/opencode)（原 sst/opencode） | TUI + 桌面 App（Beta） | 模型无关；内置 `build`（全权限）和 `plan`（只读）两个 Agent，Tab 切换；`@general` 子 Agent；安装渠道多 | 2026-10 | 🧪 试用 |
| [Cline](https://github.com/cline/cline) | VS Code / JetBrains / CLI / 桌面 App | 每步人工审批；CLI 支持无头模式，可用于 CI；桌面版能定时运行 | 2026-10 | 🧪 试用 |
| [Kilo Code](https://github.com/Kilo-Org/kilocode) | VS Code / JetBrains / CLI | 开源，多种安装方式 | 2026-10 | 👀 评估 |
| [Goose](https://github.com/aaif-goose/goose) | 桌面 / CLI / API（Rust） | 通用 Agent（不限于编码）；15+ 服务商；可通过 ACP 使用 Claude/ChatGPT/Gemini 订阅；**已加入 Linux 基金会旗下 AAIF** | 2026-10 | 🧪 试用 |
| [Qwen Code](https://github.com/QwenLM/qwen-code) | 终端 / IDE / 桌面 / Web / 聊天软件 | 自带 auto memory、auto skills、子 Agent、Agent Teams；支持 OpenAI / Anthropic / Gemini / Qwen 协议，可接本地模型；集成钉钉、飞书、微信 | 2026-10 | 🧪 试用（国内团队友好） |
| [GitHub Copilot CLI](https://github.com/github/copilot-cli) | 终端 | 默认带 GitHub MCP；与 Issue / PR 深度集成；需要 Copilot 订阅 | 2026-10 | 🧪 试用（重度 GitHub 用户） |
| Pi（pi.dev） | 终端 | 只有 4 个工具（读、写、编辑、bash），其余靠 TypeScript 扩展；2026-05 移交 Earendil Works，已发布 1.0；**改变了此前“不支持 MCP”的立场**，MCP 通过 Codemode 接入 | — | 👀 评估 **[二手]** |
| [Aider](https://github.com/Aider-AI/aider) | 终端 | 老牌、git 友好、repo map | **2026-05-22** | ⛔ 暂缓：维护放缓，README 仍推荐 Claude 3.7 |

## 怎么选

- **想要 Claude Code 的体验，但希望换模型或接本地模型** → OpenCode。
- **团队在国内，需要接国产模型或用 Coding Plan** → Qwen Code / OpenCode（见 [02 模型与成本](../02-models-and-cost.md#4-国内-coding-plan)）。
- **主要在 IDE 里工作，希望每一步都审批** → Cline / Kilo Code。
- **想理解 Agent 原理、自己搭 harness** → Pi，并配合阅读 [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code)（拆解 Coding Agent 的组成部分）。

## 共同注意事项

1. 开源 Agent 的效果**强依赖所接的模型**：同一个 harness 接不同模型，差距可能很大。
2. 接本地模型时，留意工具调用的稳定性。很多小模型在多步工具调用上容易出错。
3. 安全默认值各不相同（是否默认沙箱、是否默认逐步审批），上手前先看配置。

## 来源

各项目 GitHub 仓库 README（2026-10-03 读取）；Pi 相关：[Pi Coding Agent Review（glukhov.org）](https://www.glukhov.org/ai-devtools/pi/pi-coding-agent-review/)、[npm @mariozechner/pi-coding-agent](https://www.npmjs.com/package/@mariozechner/pi-coding-agent)（二手）。
