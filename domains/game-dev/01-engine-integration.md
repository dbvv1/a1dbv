# 引擎接入：让 Agent 操作游戏引擎

> 核实时间：2026-10-08。
> 依据 **[一手]**：
> - Epic 官方插件 [unreal-engine-skills-for-claude-code-plugin](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin)：克隆后读了全部 3 个 Skill、setup 和 operations 文档、SessionStart Hook，最近提交 2026-09-17；
> - Roblox 官方文档 [Connect to the Roblox Studio MCP server](https://create.roblox.com/docs/en-us/studio/mcp)（2026-10-07 更新）；
> - Blender Lab 的 [MCP Server 页面](https://www.blender.org/lab/mcp-server/)；
> - Claude 官方插件市场的 `marketplace.json`（共 315 个插件，游戏相关的只有 Unity 和 Unreal 两个官方插件）。
>
> 为什么需要专门的接入：游戏的场景和资产不是纯文本（Unity 是引用脆弱的 YAML，Unreal 是二进制），Agent 不能手改，只能通过引擎的接口操作。
> Unity 的细节见 [unity/01-toolchain.md](unity/01-toolchain.md)，Unreal 的细节见 [unreal/01-toolchain.md](unreal/01-toolchain.md)，本页做横向比较。

## 1. 总览

| 引擎 / 工具 | 官方 Agent 接入 | 形态 | 关键能力 | 成熟度 | 评级 |
|---|---|---|---|---|---|
| **Unity 6+** | Unity CLI + 官方插件（33 个 Skill）；`unity mcp` | **CLI 优先**，MCP 只是 CLI 的一种暴露方式 | 驱动打开的编辑器、`unity test` / `build`、Play 模式帧数检查 | CLI 1.0 beta，插件 2026-09 发布 | ✅ |
| **Unreal 5.8** | 引擎内置的 **ModelContextProtocol** 插件 + Epic 的 Claude Code 插件 | 编辑器内的 HTTP MCP 服务器（默认 `127.0.0.1:8000/mcp`）+ 工具搜索 | 30 多个工具集、数百个工具：Actor、蓝图、材质、Niagara、Sequencer、Control Rig、GAS、自动化测试、Live Coding 编译 | 插件位于 `Engine/Plugins/Experimental`，**实验性** **[一手]** | 🧪 |
| **Roblox Studio** | **内置**在 Studio 中的 MCP 服务器 | stdio；一键连接 Claude Code、Codex CLI、Cursor、Gemini CLI、Antigravity、VS Code | 脚本读写、执行 Luau、**AI 生成网格和材质**、**内置的 explore / playtest 子 Agent**、**模拟玩家键鼠输入**、截图 | 正式功能，持续更新 | ✅ |
| **Godot 4** | 无官方 Agent 接入 | 社区 MCP，分“文件级”和“连接运行中编辑器”两类 | 场景树、脚本、运行项目 | 社区项目质量参差不齐 | 👀 |
| **Blender 5.1+** | Blender Lab 官方 MCP | 插件 + MCP 服务器，可接 llama.cpp 等本地客户端 | 偏**场景分析和文档查询**（比如找出“屏幕占比小但面数高”的物体） | 官方声明执行 LLM 代码**没有任何防护**，建议在虚拟机里用 | 🧪（在隔离环境里用） |
| Blender（社区） | [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)（2026-10 仍在更新） | MCP | 偏**资产获取和生成**，教程最多 | 同样直接执行任意 Python | 🧪（在隔离环境里用） |
| 自研引擎 / Bevy / Web 游戏 | — | 纯代码 | 一切能力都来自代码和测试 | — | ✅ 最适合 Agent（见第 4 节） |

## 2. 三种官方设计思路

三家主流引擎的官方方案走了三条不同的路。看懂它们的取舍，有助于判断自己项目该怎么接 Agent，也能直接借鉴到写自己的 MCP 或 Skill 上。

### 2.1 Unity：CLI 优先，Skill 承载知识
- 核心是一个**命令行工具**（`unity status / command / test / build`），MCP 只是把同样的能力再包一层。
- 领域知识写在 33 个 Skill 里（UI、2D、URP、服务接入等），按需加载。
- **优点**：同一套命令既给人用，也给 Agent 和 CI 用；退出码设计清楚（8 表示测试失败，6 表示基础设施问题），天然适合自动化。
- **代价**：Skill 偏重“功能搭建”，大型项目的架构知识仍要自己写。

### 2.2 Unreal：几百个工具，藏在“工具搜索”后面
Epic 的 `unreal-mcp` Skill 原文 **[一手]**：
- 工具搜索默认开启，MCP 服务器整个会话**只公开 3 个元工具**：`list_toolsets`、`describe_toolset`、`call_tool`。像 `BlueprintTools.create` 这样的具体工具**不在 `tools/list` 里**，而是通过 `call_tool` 在服务端分发。官方的理由：“这样能让上下文窗口保持很小，**提示缓存保持命中**。”
- **引擎内也有一套 Agent Skills**：项目或插件可以把“本项目的做法”注册成 Skill（用 Python 类或 UAsset 实现），Agent 通过 `AgentSkillToolset.ListSkills` / `GetSkills` 发现，并且**项目 Skill 的优先级高于通用默认做法**。
- 官方安全规则（值得照搬到任何“驱动有状态编辑器”的场景）：
  1. **改之前存盘，改完再存一次**：MCP 修改不一定能撤销，涉及多个资产就当作破坏性操作；
  2. **等编译结束再调工具**：C++ 用 `LiveCodingToolset.CompileLiveCoding`，它会阻塞到编译完成并返回 MSVC 诊断；
  3. **有依赖的修改要串行**：MCP 接受并发请求，但执行顺序不保证；多个 Agent 可以共用一个编辑器，但改动冲突会出问题；
  4. **一定要检查返回结果**：很多工具失败时不会抛异常，只是返回状态变了；不是明确的成功，就当失败处理；
  5. **留意 PIE**（Play-in-Editor）：运行时很多编辑器工具的行为会变。
- Epic 给“写工具集”定的原则（`create-toolset` Skill）也很通用：**Clean**（API 比 Unreal 原生 API 更简单，“技术美术不看实现也能懂”）、**Complete**（CRUD 对称：能 set 就要能 get，能 create 就要能 delete）、**Composable**（同类操作用一致的类型）、**DRY**（通用的属性读写已经有 `ObjectTools`，不要重复造）。
- 已知限制：HTTP 服务器**没有认证**，默认只监听本机；工具调用在游戏线程上**串行执行** **[一手：Epic 文档]**。
- **打包后的游戏也能托管 MCP 服务器**（运行时模块 + `IModelContextProtocolModule::AddTool()`），这让 Agent 可以直接测试打包版 **[一手]**。详见 [unreal/01](unreal/01-toolchain.md#14-一个容易被忽略的能力打包后的游戏也能跑-mcp)。

### 2.3 Roblox：把 Agent 能力直接做进编辑器
官方文档列出的工具里有几项是其他引擎没有的 **[一手]**：
- `subagent`：服务器**自己**提供子 Agent，类型有 `explore`（查代码和游戏状态）和 **`playtest`（跑玩法场景并验证结果）**；
- **模拟玩家输入**：`character_navigation`（移动角色到指定位置）、`user_keyboard_input`、`user_mouse_input`；
- `screen_capture`：可以指定相机位置截图；
- 内容生成：`generate_mesh`、`generate_material`、`generate_procedural_model`；
- 多实例：每次调用都带 `studio_id`，**显式指定**要操作的 Studio 实例，不依赖会话状态，所以多个 Agent、多个窗口也不会串。
- 官方提醒：连接的客户端可以读写你打开的 place，只连接你信任的客户端。社区指南还提醒 `execute_luau` 是特权操作，可以发布 place、写 DataStore **[二手]**。

### 2.4 共同规律（对写自己的工具也适用）

| 规律 | Unity | Unreal | Roblox | 背后的原因 |
|---|---|---|---|---|
| **按需发现，不一次性塞满工具** | Skill 按需加载 | 3 个元工具 + `describe_toolset` | 工具数适中，用 `skill` 工具提供参考资料 | 工具定义占上下文，还会破坏提示缓存（见主干 [03](../../docs/03-context-engineering.md)、[04](../../docs/04-mcp.md)） |
| **显式指定目标实例** | `--project-path` | 端口和 URL | `studio_id` | 编辑器是有状态的，多开时不能靠“当前会话” |
| **区分“连上了”和“真的在运行”** | `frameCount` 和 `playerLoopTicking` | 代理在线不代表 Unreal 可达，要用只读调用确认 | `get_studio_state` | 编辑器可能卡住、在编译、在 PIE |
| **把验证做成工具** | `unity test`、Play 模式检查 | 自动化测试工具集、Live Coding 诊断 | `playtest` 子 Agent、输入模拟、控制台输出 | Agent 能自己验证，才能放手（见 [02 验证与试玩](02-verification-and-playtesting.md)） |
| **修改有风险，要有恢复点** | 版本控制是前提 | 先存盘 | 只连信任的客户端 | 编辑器修改不一定能撤销 |

## 3. 引擎选择对 AI coding 的影响

同样的模型，在不同引擎里效果差很多。原因主要是结构性的，不是模型的问题 **[经验：综合官方文档和社区反馈]**：

| 因素 | Unity | Unreal | Godot | 自研 / Bevy / Web |
|---|---|---|---|---|
| 模型熟悉程度 | **高**：C# 和 Unity 的代码语料极多 | 中：宏多（`UCLASS`、`UPROPERTY`），**版本间 API 变化大**，模型容易写出旧 API | 中低：GDScript 语料少，Godot 3 → 4 变化大，常被混用 | 取决于语言 |
| API 的“真相来源” | 引擎闭源，只有 C# 参考源码 | **安装版自带引擎头文件**，让 Agent grep 头文件是对付 API 幻觉最有效的手段 | 开源 | 自己的代码 |
| 场景和资产格式 | YAML 文本，但 fileID / GUID 引用脆弱 → 禁止手改 | **二进制** → 只能通过编辑器工具 | `.tscn` 纯文本，最友好（社区评价 **[社区]**） | 通常是代码或文本 |
| 逻辑在哪里 | C# 为主 | **C++ 和蓝图混合**，蓝图逻辑对通用编码 Agent 不可见 | GDScript / C# | 代码 |
| 编译反馈 | `unity recompile` 秒级；domain reload | Live Coding 秒级（只限函数体）；改头文件要完整编译，分钟级 | 脚本即改即用 | 取决于工具链 |
| 无头测试 | `unity test`，退出码清楚 | `UnrealEditor-Cmd` 加自动化测试，JSON 报告 | 社区方案 | 通常最容易 |
| 官方 Agent 接入 | Unity CLI + 33 个 Skill | 编辑器内置 MCP（实验性），**打包版也能托管** | 无 | — |

**推论**：
- **UE 项目的 AI 化程度，取决于“逻辑有多少在 C++ 里”**。蓝图越重，越依赖官方 MCP；C++ 越多，通用编码 Agent 越能发挥。
- **Unity 项目要坚持“逻辑写在纯 C# 里”**：这一条同时提高可测试性和 Agent 的效率（见 [unity/02](unity/02-large-project-guide.md#4-测试)）。
- **UE 项目要在 AGENTS.md 里写明引擎源码位置**，并要求“不确定的 API 先查头文件”。
- **自研引擎和纯代码框架（Bevy、Web 游戏）反而最省事**：一切都是代码，难点从“怎么接编辑器”变成“怎么验证运行时行为”。

## 4. 选型建议

| 你的情况 | 建议 |
|---|---|
| Unity 6+ | 官方插件 + Unity CLI（见 [unity/](unity/README.md)） |
| Unity 2021 / 2022 LTS | CoplayDev/unity-mcp + batchmode 脚本 |
| Unreal 5.8+ | 见 [unreal/](unreal/README.md)：启用 Unreal MCP + `AllToolsets`（或只启用需要的工具集），安装 Epic 的插件；**用版本控制并且勤存盘**；不要把端口暴露到本机以外 |
| Unreal 5.8 以下 | 社区方案（如 UnrealClaude）**[二手]**；或者等升级。C++ 部分照常用通用编码工作流 |
| Roblox | 直接用 Studio 内置 MCP；`playtest` 子 Agent 和输入模拟是目前**官方支持最完整的游戏验证能力** |
| Godot | 社区 MCP 选“连接运行中编辑器”的一类，确认支持你的 Godot 版本；纯代码工作用文件级就够 |
| Blender | 官方 MCP 用于场景分析，社区 MCP 用于资产获取；**都放在虚拟机或无敏感数据的机器上** |

> ⚠️ 不要同时装多个连接同一个编辑器的 MCP：工具重复，Agent 容易选错，上下文也会膨胀。

## 来源

- [EpicGames/unreal-engine-skills-for-claude-code-plugin](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin)（`skills/unreal-mcp/SKILL.md`、`skills/create-toolset/SKILL.md`、`skills/unreal-skill/SKILL.md`、`references/setup.md`、`hooks/unreal-context.sh`）
- [Epic：Unreal MCP in Unreal Editor](https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor)（插件主页）；UE 5.8 实验性 MCP 的社区指南：[DEV Community](https://dev.to/gamedevtoollab/using-unreal-mcp-in-ue-58-from-codex-setup-toolsets-and-safe-editor-automation-4pon)（二手）
- [Roblox：Connect to the Roblox Studio MCP server](https://create.roblox.com/docs/en-us/studio/mcp)
- [Blender Lab：MCP Server](https://www.blender.org/lab/mcp-server/)；[ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)（`marketplace.json`）
- HN：[Godot 不再接受 AI 代码](https://news.ycombinator.com/item?id=48743472)（关于 Godot 文本场景格式的评论）
- 引擎份额：[VG Insights：The Big Game Engine Report of 2025（PDF）](https://app.sensortower.com/vgi/assets/reports/The_Big_Game_Engines_Report_of_2025.pdf)、[GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/)
