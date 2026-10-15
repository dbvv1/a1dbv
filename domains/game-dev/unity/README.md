# 游戏开发 / Unity

> 核实时间：2026-10-15 UTC（入口全文复核；帧字段能力条件与资产修改边界补核，未运行引擎）。上级目录：[游戏开发分支](../README.md)（AI 与游戏开发的结合全景、引擎接入对比、验证与试玩、游戏中的生成式 AI）。
> 前置阅读：主干的 [07 工作流](../../../docs/07-workflows.md)（验证闭环）和 [03 上下文工程](../../../docs/03-context-engineering.md)。

| 文档 | 内容 |
|---|---|
| [01-toolchain.md](01-toolchain.md) | Unity 官方（Unity CLI、官方插件、Unity AI）与社区 MCP 的对比和选型 |
| [02-large-project-guide.md](02-large-project-guide.md) | 大型项目落地：禁区、编译和测试闭环、Play 模式验证、大仓库 |
| [**03-engine-fundamentals.md**](03-engine-fundamentals.md) | **Unity 基础知识**：对象模型、生命周期、序列化、程序集与 Domain Reload、null 语义、资源、渲染管线、输入和 UI、性能、测试、版本路线；每节附“AI 要点” |
| [../03 游戏中的生成式 AI](../03-generative-ai-in-games.md#1-资产管线agent-负责搬运和规范) | AI 生成 3D、2D、音频、动画资源（跨引擎，已上移） |
| [Unreal 分支](../unreal/README.md) | 对照阅读：两个引擎在 AI 接入上的差异 |
| [templates/](templates/) | 可以拷进 Unity 项目的配置（在 [templates/generic](../../../templates/generic/) 基础上增加 Unity 专用部分） |

## 一页纸推荐（2026-10）

**先沿用项目已有的编译、测试和编辑器入口；能完成当前任务，就不增加接口。** Claude Code / Codex 都按同一条边界选择。**[经验]**

| 当前任务或缺口 | 建议 |
|---|---|
| 只改 C#，已有编译和测试脚本 | ✅ 沿用现有命令；已有 `.sln` + dotnet 可做快速检查，最终仍以 Unity 编译和相关测试为准，不为此先装 MCP 或 LSP |
| 修改场景、Prefab、导入设置或资产引用 | ✅ 使用已经配置的 Editor 脚本、CLI 或 MCP；先确认目标工程与工具能力，再经 Editor API 修改并回读结果 |
| 确实缺少操作运行中编辑器的入口 | 🧪 Unity 6.0 LTS+ 可评估官方 CLI/Pipeline：能可靠执行 shell 就直接调用，需要 MCP 的客户端再选 `unity mcp`；Unity 2021.3 / 2022 LTS 先沿用兼容脚本，确有缺口才评估社区 MCP |
| 现有搜索、编译诊断不足以定位跨文件符号或引用 | 🧪 再评估 C# LSP；它不代替 Unity 编译、序列化和运行时验证 |
| 想复用本目录模板 | 🧪 只合并适用的项目规则、已审阅脚本和检查；填写现有入口，删去不适用的命令。保留项目安全限制，不把整套 Skill、reviewer、Hook 或插件当作前置条件 |

表中为采用判断 **[经验]**；CLI/Pipeline 的版本与直接命令/MCP 分工见[官方迁移说明](https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli) **[一手]**。插件选型见 [01 工具链](01-toolchain.md)，模板合并边界见 [templates](templates/README.md)；没有安全的资产操作入口时报告具体缺口，不改写 YAML 绕过、不自行安装。当前仅完成两种接口配置的[文档走查](../../../docs/research/2026-10-14-game-wp13-agent-config.md#4-f1-复核入口必须按已配置能力分支)，未证明真实 Agent 或引擎效果。**[研究]**

## 三个最重要的认识

1. **场景和 Prefab 默认经 Editor API 修改；文本修改只保留项目已验证的受限例外，保留 GUID／fileID 并核引用。** Unity 官方 Skill 原话：“有编辑器可用时，驱动它，而不是手工编辑场景或资源文件” **[一手]**。
2. **进入 Play 模式不等于验证通过。** 已配置 Unity CLI 且当前 Pipeline 提供帧字段时，用 `unity status --format json` 的 `frameCount` / `playerLoopTicking` 确认帧确实在推进，再读 Console、截图（[官方字段条件](https://github.com/Unity-Technologies/unity-agent-plugin/blob/cf6b2da24e424b0a60d560a57f39f676cb6f79f3/skills/unity-cli/references/integration-advanced.md#L580)）**[一手]**。字段缺失不等于停帧；字段缺失或没有 CLI 时，沿用已有带时间／帧进度的状态观测，并按任务核测试报告；缺失观测就标明运行状态未验证，不为一条命令强装 CLI **[经验]**。
3. **Safe Mode 下不要反复重试编辑器连接。** 已有 CLI 若因 Safe Mode 不可达，先从项目允许读取的 Editor.log 中过滤 `error CS####` 或沿用现有编译入口定位源码错误，修正后按项目流程重启、复验 **[一手＋经验]**。
