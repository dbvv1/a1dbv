# IDE 类工具与其他

> 核实时间：2026-10-08。Cursor 和 GitHub Copilot 部分直接读取了官方 changelog；其余未标注的为 **[二手]**。

## Cursor

| 项 | 内容 |
|---|---|
| 形态 | VS Code 分支。**Cursor 3** 是重新打造的、以 Agent 为中心的界面：多仓库工作区、所有本地和云端 Agent 集中在侧栏（包括从手机、Web、Slack、GitHub、Linear 发起的）、本地和云端之间**快速交接**、云端 Agent 会附上演示和截图供你核验、完整的 LSP、内置浏览器、**插件市场**（MCP、Skills、子 Agent，支持团队私有市场）**[一手]** |
| 自研模型 | **Composer 2**（官方称“自家的前沿编码模型，额度高”）**[一手]** |
| 2026-10 新功能 | **Remote Control**：在 Cursor iOS 应用里查看并回复电脑上运行的本地 Agent（Agent 仍在你的电脑上运行；企业版默认关闭）**[一手：changelog 10-06]** |
| 2026-09 新功能 | **Rollouts** 机器人：为每个 PR 写监控计划，按环境跟踪部署健康度，发现回归后可以开回滚 PR；**Security Review** 机器人；Cursor Projects；自托管机器；`/goal`；云端子 Agent 各自运行在独立机器上 **[一手：changelog]** |
| **公司变动** | 2026-06 **SpaceX 宣布以 600 亿美元收购 Cursor**；2026-08 **OpenAI 停止向 Cursor 提供模型**（此前 Anthropic 已因违反服务条款封禁 xAI）；Cursor 推出 GitHub 替代品 **Origin** **[社区：HN 原帖 + 官方公告标题]** |
| 社区反馈 | 定价长期有争议：Bugbot 改为按次计费；2026-08 从用量页面和 CSV 导出里移除了费用信息。HN 上很多人已转向 Claude Code 或 Codex；仍在用 Cursor 的人看重的是：代码已经索引好，在编辑器内审阅改动很方便，以及可以在多个模型之间切换（如今少了 OpenAI）**[社区]** |
| 评级 | 👀 **评估**（上一版是“试用”）：产品力仍强，但**模型供应和公司归属都不确定**。新项目不建议把它作为唯一依赖；已经在用的话，配置尽量用开放格式（AGENTS.md、Skills、MCP），方便迁移 |

## JetBrains（IntelliJ / Rider / PyCharm…）

- 2026 版 AI Chat 可以选择 **Junie、Claude Agent、Codex、Copilot、Cursor** 等，并通过 **ACP（Agent Client Protocol）Registry** 一键接入外部 Agent **[二手]**。
- **Junie** 于 2026-06-17 结束 Beta；Junie CLI 与 IDE 之间也走 ACP **[二手]**。
- ReSharper 2026.2 把 ACP 带进了 Visual Studio **[二手]**。
- 评级：🧪 **试用**。主力 IDE 是 JetBrains 的话，用 ACP 接 Claude Code 或 Codex，比换 IDE 更合适。
- C# / Unity 开发者的首选 IDE 仍是 Rider（见 [domains/game-dev/unity](../../domains/game-dev/unity/README.md)）。

## VS Code + GitHub Copilot（CLI / App / VS Code）

形态：Copilot 现在有 **Copilot CLI、GitHub Copilot 桌面应用、VS Code、JetBrains** 等多个入口，以及把 Issue 指派给 Copilot 的云端 coding agent；指令文件支持 `.github/copilot-instructions.md` 和 AGENTS.md；VS Code 原生支持 Agent Skills。

2026-09 到 10 月的重要更新 **[一手：GitHub Changelog]**：

| 更新 | 说明 |
|---|---|
| **本地沙箱正式可用**（10-07） | Copilot CLI、Copilot 应用和 VS Code 中，Agent 执行的命令受限于开发者或组织定义的策略：可读写的目录、网络、Git 和 GitHub CLI 凭证；基于微软的 MXC，在 Windows、macOS、Linux 上转换为系统原生控制；**企业可以强制开启、开发者无法放宽** |
| **Dynamic workflows**（10-01） | 用代码定义编排：哪些步骤自动执行、哪些交给 Agent、哪些并行，结构化结果在阶段间传递；在 Copilot CLI、Copilot 应用和 Copilot SDK 中可用。和 Claude Code 的 Dynamic Workflows 思路相同 |
| **Computer use**（10-01，公开预览） | 在 macOS 和 Windows 上操作桌面应用（读取界面、点击、输入），用于没有 API、CLI 或 MCP 的旧软件；每个应用都要先批准，组织可以禁用 |
| **HydraFusion**（研究预览） | 出现在模型选择器里，但不是单一模型，而是**编排多个模型**：单模型直接做、便宜模型先做再由质量门决定是否升级到强模型、或者由另一家族的模型做只读评审后修改一次 |
| 模型 | Claude Opus 5.5、Sonnet 5.5、Haiku 5.5，GPT-6 Sol / Luna、GPT-6.1 Sol，Grok 4.7 都已接入 |
| 治理 | 企业托管设置的校验器、用量指标 API（含 PR 评审阶段、CLI 定制）、影响力仪表盘、预算提额申请、OpenTelemetry |

评级：✅ **采用**（VS Code 作为承载各家 Agent 的编辑器）；Copilot 本身 🧪 **试用**，重度 GitHub 用户和需要强企业治理的团队尤其值得看。

**观察**：本地沙箱、动态工作流、多模型编排这三项，Claude Code、Codex 和 Copilot 在两个月内都做了类似的东西，**功能趋同还在继续**（见 [00](../00-state-of-ai-coding.md)）。

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

- [Meet the new Cursor（Cursor 3）](https://cursor.com/blog/cursor-3)、[Cursor changelog](https://cursor.com/changelog)、HN：[SpaceX 收购 Cursor](https://news.ycombinator.com/item?id=48553224)、[OpenAI 对 Cursor 的决定](https://news.ycombinator.com/item?id=49486172)、[Cursor Origin](https://news.ycombinator.com/item?id=49334209)、[Updates to Bugbot（2026-05）](https://cursor.com/blog/may-2026-bugbot-changes)、[论坛：Bugbot 按量计费的讨论](https://forum.cursor.com/t/the-new-usage-based-bugbot-pricing-punishes-iterative-workflows-and-power-users/161134)、[论坛：成本上涨的讨论](https://forum.cursor.com/t/cursor-costs-are-climbing-without-a-clear-reason/157233)
- GitHub Changelog：[本地沙箱 GA](https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available)、[Dynamic workflows](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app)、[Computer use](https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps)、[HydraFusion](https://github.blog/changelog/2026-09-30-hydrafusion-in-vs-code-and-the-github-copilot-app)
- [What's New in Rider 2026.1](https://www.jetbrains.com/rider/whatsnew/2026-1/)、[Junie 结束 Beta](https://blog.jetbrains.com/junie/2026/06/junie-coding-agent-out-of-beta/)
- [Martin Fowler：Understanding SDD（Kiro、spec-kit、Tessl）](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- 国内工具：[CSDN：2026 年 7 月国内 Coding Plan 对比](https://blog.csdn.net/zhangay1998/article/details/162555439)、[CSDN：TRAE / Kimi Code / Qoder 实测](https://www.csdn.net/article/2026-08-24/164033550)、[codingplan.org](https://codingplan.org/en)
