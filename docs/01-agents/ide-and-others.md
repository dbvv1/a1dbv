# IDE 类工具与其他

> 核实时间：2026-10-03。这一类大多闭源，本仓库主要依据官方博客和论坛摘要 **[二手]**，有一手来源的会标出。

## Cursor

| 项 | 内容 |
|---|---|
| 形态 | VS Code 分支 + 自研模型 **Composer**（2.x / 2.5） |
| 2026 重点 | **Cursor 3**：统一的 Agent 工作区（Agents Window）、多仓库布局；Agent 可以在本地、worktree、云端、远程 SSH 运行，并在本地和云端之间交接；Cloud / Background Agents 在云端 VM 里工作，最后提 PR；Bugbot 做 PR 评审 |
| 社区反馈 | Cursor 3 新界面褒贬不一，有人反馈功能变少、看不到上下文占用 **[社区]**；**定价争议持续**：Bugbot 在 2026-05 从每席位 40 美元改为按用量计费（约 1–1.5 美元/次），论坛多帖抗议；“成本莫名上涨”“新定价太离谱”等帖子很多 **[社区]** |
| 评级 | 🧪 **试用**：IDE 体验好，但成本不透明。适合偏好图形界面、以 Web/TS 为主的团队 |

## JetBrains（IntelliJ / Rider / PyCharm…）

- 2026 版 AI Chat 可以选择 **Junie、Claude Agent、Codex、Copilot、Cursor** 等，并通过 **ACP（Agent Client Protocol）Registry** 一键接入外部 Agent **[二手]**。
- **Junie** 于 2026-06-17 结束 Beta；Junie CLI 与 IDE 之间也走 ACP **[二手]**。
- ReSharper 2026.2 把 ACP 带进了 Visual Studio **[二手]**。
- 评级：🧪 **试用**。主力 IDE 是 JetBrains 的话，用 ACP 接 Claude Code 或 Codex，比换 IDE 更合适。
- C# / Unity 开发者的首选 IDE 仍是 Rider（见 [domains/game-dev-unity](../../domains/game-dev-unity/README.md)）。

## VS Code + GitHub Copilot

- VS Code 原生支持 Agent Skills（[文档](https://code.visualstudio.com/docs/agent-customization/agent-skills)）**[二手]**。
- Claude Code、Codex、Cline、Kilo 等都提供 VS Code 扩展，VS Code 已经成了“Agent 的容器”。
- Copilot：`.github/copilot-instructions.md`、AGENTS.md，以及 Copilot 云端 coding agent（把 Issue 指派给 Copilot）**[经验]**。
- 评级：✅ **采用**（作为承载 Agent 的编辑器）。

## Kiro（AWS）

- Spec 驱动 IDE：把需求写成 EARS 格式的 `requirements.md`，再生成 `design.md` 和任务清单 **[二手]**。
- 批评：任务拆得过细（12 个以上任务，每个再拆 4 个以上子任务）；**规格漂移**（实现中发现的约束不会自动回写到需求和设计文档）**[社区]**。
- 评级：👀 **评估**。适合学习 SDD 思路，详见 [07 工作流](../07-workflows.md#5-spec-驱动开发sdd)。

## Zed

ACP 的发起方，原生支持外部 Agent 接入，适合追求编辑器性能的人 **[经验]**。

## 国内工具（面向中文开发者）

| 工具 | 厂商 | 要点 **[二手]** |
|---|---|---|
| Trae | 字节跳动 | 国内版核心功能免费；国际版每月 3 美元起 |
| Qoder | 阿里巴巴 | 国际版 Pro 每月 20 美元起，国内个人专业版每月 59 元起 |
| 通义灵码 | 阿里巴巴 | 与阿里云生态整合 |
| CodeBuddy | 腾讯 | Craft / Ask / Plan 三种模式；可选 GLM、Kimi、DeepSeek、混元模型 |
| Kimi Code | 月之暗面 | 2026-01 发布；订阅档每月 49 元 / 99 元 |
| Qwen Code | 阿里通义 | 开源，见 [open-source-agents](open-source-agents.md) |

> 国内另一条常见路线是：**Claude Code / OpenCode 这类 harness + 国产模型的 Coding Plan**（GLM、Kimi、MiniMax 等提供与 Anthropic 兼容的接口）。见 [02 模型与成本](../02-models-and-cost.md#4-国内-coding-plan)。

## 来源

- [Meet the new Cursor（Cursor 3）](https://cursor.com/blog/cursor-3)、[Updates to Bugbot（2026-05）](https://cursor.com/blog/may-2026-bugbot-changes)、[论坛：Bugbot 按量计费的讨论](https://forum.cursor.com/t/the-new-usage-based-bugbot-pricing-punishes-iterative-workflows-and-power-users/161134)、[论坛：成本上涨的讨论](https://forum.cursor.com/t/cursor-costs-are-climbing-without-a-clear-reason/157233)
- [What's New in Rider 2026.1](https://www.jetbrains.com/rider/whatsnew/2026-1/)、[Junie 结束 Beta](https://blog.jetbrains.com/junie/2026/06/junie-coding-agent-out-of-beta/)
- [Martin Fowler：Understanding SDD（Kiro、spec-kit、Tessl）](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- 国内工具：[CSDN：2026 年 7 月国内 Coding Plan 对比](https://blog.csdn.net/zhangay1998/article/details/162555439)、[CSDN：TRAE / Kimi Code / Qoder 实测](https://www.csdn.net/article/2026-08-24/164033550)、[codingplan.org](https://codingplan.org/en)
