# Unreal AI 工具链

> 核实时间：2026-10-08。
> 依据 **[一手]**：
> - Epic 官方文档 [MCP in Unreal Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor)（UE 5.8）、[UE 5.8 发布说明](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes)、[5.8 发布帖](https://forums.unrealengine.com/t/unreal-engine-5-8-released/2729274)（含 5.8.1 修复记录）；
> - 克隆阅读了 Epic 的 [unreal-engine-skills-for-claude-code-plugin](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin)（3 个 Skill + SessionStart Hook）。
>
> 社区项目为直接克隆查看的最近提交日期和 README。

## 1. 官方：Unreal MCP（UE 5.8，实验性）🧪

UE 5.8（2026-06-17）在编辑器进程里内置了一个 MCP 服务器。插件在源码、`.uplugin` 和控制台命令里的名字是 `ModelContextProtocol`，插件浏览器里显示为 **Unreal MCP**。官方提醒：**实验性功能，很多特性不完整，API 和数据格式随时可能变化** **[一手]**。

### 1.1 架构

```
Claude Code / Codex / Cursor / Gemini CLI / VS Code
        │  HTTP + SSE（默认 127.0.0.1:8000/mcp，无认证）
        ▼
Unreal MCP（ModelContextProtocol 插件，在编辑器进程内）
        │  所有工具调用都在游戏线程上**串行**执行
        ▼
Toolset Registry ← AllToolsets（或只启用需要的工具集插件）
        │
        ├── 引擎自带工具集：SceneTools、ActorTools、MaterialInstanceTools、ObjectTools、
        │   蓝图、Niagara、Sequencer、Control Rig、GAS、自动化测试、Live Coding、
        │   MetaHuman Generator（5.8 新增）、动画助手工具集（5.8 新增）……
        └── 你自己写的工具集（Python 或 C++）
```

- **必须同时启用 `AllToolsets`**（或单独的工具集插件），否则服务器能启动但没有任何工具。
- **工具搜索默认开启**：`tools/list` 只返回 `list_toolsets`、`describe_toolset`、`call_tool` 三个元工具，Agent 按需发现。关掉后会一次性公开所有工具，“初始 schema 体积会大得多”。
- **客户端不应该发出重叠的工具调用**（游戏线程串行执行）。
- 默认开启遥测：`ModelContextProtocol.EnableAnalytics` 默认为 `true`，需要的话可以关掉。

### 1.2 配置步骤
1. 插件浏览器中启用 **Unreal MCP** 和 **All Toolsets**（会自动启用依赖的 Toolset Registry），重启编辑器。
2. Editor Preferences → General → Model Context Protocol → 打开 **Auto Start Server**，或在控制台执行 `ModelContextProtocol.StartServer [port]`。命令行参数也可以：`-ModelContextProtocolStartServer`、`-ModelContextProtocolPort=N`。
3. 在控制台执行 `ModelContextProtocol.GenerateClientConfig ClaudeCode`，会在项目根目录写入 `.mcp.json`：
   ```json
   { "mcpServers": { "unreal-mcp": { "type": "http", "url": "http://127.0.0.1:8000/mcp" } } }
   ```
   - 支持的客户端名：`ClaudeCode`、`Cursor`、`VSCode`、`Gemini`、`Codex`、`All`；
   - JSON 配置会合并已有条目；**Codex 的 TOML 配置只写一次**，不会覆盖已有文件。
4. 在项目根目录启动 Agent。可选：用 5.8 的 **Terminal 插件**在编辑器里直接开终端跑 `claude`，需要先 `export TERM=xterm-256color`（Windows 用 `set`），否则输出会退化。

### 1.3 写自己的工具
- **Python**（推荐，大部分内置工具集就是 Python 写的）：在任意插件的 `Content/Python/` 下写一个继承 `unreal.ToolsetDefinition` 的类，用 `@unreal.uclass()` 装饰类，用 `@toolset_registry.tool_call` 装饰静态方法。**类型标注生成 JSON Schema，Google 风格的 docstring 成为工具描述**。
- **C++**：继承 `UToolsetDefinition`，类标 `UCLASS(BlueprintType, Hidden)`，方法标 `UFUNCTION(meta = (AICallable))`；不想公开的方法加 `meta = (AIIgnore)`。适合用到 Python 没暴露的功能、复杂的 `USTRUCT` 类型，或者调用很频繁的工具。
- 写完执行 `ModelContextProtocol.RefreshTools`，客户端重连。**Live Coding 不会传播新增的 `UFUNCTION`，新增工具要重启编辑器。**
- 官方建议：一个工具只做一件事；返回结构化类型而不是自由文本。
- Epic 插件里的 `create-toolset` Skill 能生成脚手架，并给出四条设计原则（Clean、Complete、Composable、DRY，见 [02 引擎对比](../02-engines-and-agent-tooling.md#22-unreal几百个工具藏在工具搜索后面)）。

### 1.4 一个容易被忽略的能力：打包后的游戏也能跑 MCP
插件分三个模块，其中 `ModelContextProtocol` 和 `ModelContextProtocolEngine` 是**运行时模块**。**打包（cooked / shipping）后的游戏可以在启动时调用 `IModelContextProtocolModule::StartServer()` 托管 MCP 服务器**。工具要用 `IModelContextProtocolModule::AddTool()` 显式注册，这种情况下工具不经过工具搜索，会直接全部公开 **[一手]**。

**这对游戏验证意义很大**：可以在开发版或测试版里注册“导出游戏状态、注入玩家动作、加载测试场景”这类工具，让 Agent **直接玩打包后的游戏**，而不只是编辑器里的 PIE（Play-in-Editor）。这正是 [03 验证与试玩](../03-verification-and-playtesting.md) 里 L3/L4 需要的接口。⚠️ 不要把它打进正式发行版：没有认证。

### 1.5 已知限制（官方）
- 只支持 HTTP 和 SSE，**不支持 stdio 和 WebSocket**；
- 默认只接受本机连接，拒绝非回环的 Origin，**没有认证层**；
- 内置工具集没有提供 MCP 的 Resources 和 Prompts；
- 5.8.1 修复了 `tools/call` 响应分帧的问题，并在工具脚本执行期间禁用事务 **[一手：5.8.1 修复记录]**。**请用 5.8.1 及以上。**

### 1.6 调试
- Output Log 里的 `LogModelContextProtocol`（`Log LogModelContextProtocol Verbose` 提高详细程度）；
- 用官方的 MCP Inspector（`npx @modelcontextprotocol/inspector`）直连 `http://127.0.0.1:8000/mcp`，绕过 Agent 检查工具 schema 和返回值。

## 2. 官方：Epic 的 Claude Code 插件 ✅（配合 Unreal MCP 使用）

```
/plugin install unreal-engine-skills-for-claude-code@claude-plugins-official
```
团队可以在 `.claude/settings.json` 里写 `"enabledPlugins": {"unreal-engine-skills-for-claude-code@claude-plugins-official": true}`，信任项目的成员会被提示自动安装 **[一手]**。

| 组成 | 作用 |
|---|---|
| `unreal-mcp` Skill | 发现工具 → `describe_toolset` → `call_tool` 的流程；五条安全规则（先存盘、等编译、串行修改、检查结果、留意 PIE）；先查项目注册的 Agent Skill |
| `create-toolset` Skill | 写新工具集（C++ 或 Python）的规范和测试要求 |
| `unreal-skill` Skill | 写**引擎内的 Agent Skill**（UAsset 或 Python 类），供编辑器里的 Agent 通过 `AgentSkillToolset` 加载 |
| SessionStart Hook | 从当前目录向上找 `.uproject`，注入“这是 UE 项目，遵循 UE 约定”的提示，并提醒是否需要生成 `.mcp.json`；需要 bash（Windows 用 Git Bash 或 WSL） |

可选的**代理**（`Engine/Plugins/Experimental/ModelContextProtocol/Extras/Proxy`）：编辑器重启时保持客户端会话不断开。注意：代理在线不代表 Unreal 可达，要用只读工具调用确认 **[一手]**。

## 3. 5.8 里其他和 AI 工作流相关的功能

| 功能 | 状态 | 和 AI 的关系 |
|---|---|---|
| **Sandboxes** | 5.8 新增 | 隔离的工作区：在里面随便改，只把想保留的改动合回项目，可以导出给同事。**很适合让 Agent 做探索性修改**，不污染主项目和版本控制 **[一手：发布说明]** |
| Terminal 插件 | 5.8 | 编辑器内终端，可以直接跑 Claude Code |
| Editor Python 脚本 | 成熟 | MCP 工具集和批处理的基础；5.8 新增 `CreateAsset` 的 `bOverwriteExisting` 等**方便自动化**的选项 |
| Learning Agents | 持续更新 | 用强化学习或模仿学习训练 NPC（运行时 AI，不是编码辅助） |
| NNE（Neural Network Engine） | 5.8 升级到 ONNX Runtime 1.24.3 | 在游戏里运行 ONNX 模型（比如本地的决策模型，见 [05](../05-runtime-ai-and-world-models.md)） |
| MetaHuman Animator | 5.8 支持单个摄像头的无标记全身和面部动捕 | 资产管线 |
| MetaHuman Generator 工具集 | 5.8 新增 | Agent 可以通过 MCP 创建 MetaHuman、调肤色、眼睛颜色和体型 |

## 4. Epic 在 UEFN（堡垒之夜创作）上的 AI 功能

**和 UE 主线不是同一条产品线，但代表 Epic 的方向** **[二手]**：
- **Conversations**（原名 Persona device，2026-04 的 v40.20 作为实验功能上线）：玩家可以用麦克风和 NPC 实时对话。报道称角色逻辑由 Google 的模型驱动、语音用 ElevenLabs，Verse API 可以让 AI 角色记住玩家行为、按语音指令开门、动态调整难度。
- **Epic Developer Assistant**：帮助编写 Verse 代码的助手（2025 年 Beta），当前状态未确认。

## 5. 社区方案

| 项目 | 最近提交 | 说明 | 评级 |
|---|---|---|---|
| [Natfii/UnrealClaude](https://github.com/Natfii/UnrealClaude) | 2026-06 | 面向 UE 5.7：把 Claude Code CLI 嵌进编辑器面板，并提供 20 多个 MCP 工具（Actor、蓝图、关卡、材质、资产依赖），能通过 Live Coding 编译；作者自己说蓝图编辑“还有 bug，别完全依赖” | 🧪 **5.7 及以下的首选** |
| [maystudios/claude-skills](https://github.com/maystudios/claude-skills) | 2026-08 | 作者在发行 UE 5.7 游戏的过程中积累的 Skill：GAS、UE5 最佳实践（Enhanced Input、StateTree、PCG、CommonUI、World Partition）、第三方库集成、PCG Python、从 C++ 生成蓝图 `.uasset` | 🧪 当作参考读，挑需要的 |
| [flopperam/unreal-engine-mcp](https://github.com/flopperam/unreal-engine-mcp) | 2026-06 | 团队已被 Aura 收购，后续更新转到 Aura | 👀 |
| [chongdashu/unreal-mcp](https://github.com/chongdashu/unreal-mcp) | **2025-04** | 早期最流行的方案之一，已停止更新 | ⛔ 有官方 MCP 后不建议新用 |
| [boocs/unreal-clangd](https://github.com/boocs/unreal-clangd) | 2026-06 | VS Code 的 clangd 配置扩展；作者提到 **5.8 预编译版不再附带引擎源码的 response 文件**，影响对引擎源码的支持 | 🧪 用 VS Code 时参考 |

## 6. IDE 和代码智能

| 方案 | 说明 |
|---|---|
| **JetBrains Rider** | 理解 UBT、反射宏，和 Live Coding 配合好；社区常见组合是“Rider 负责调试和导航，Claude Code 在终端里写代码” **[社区]** |
| Visual Studio + Visual Assist | 传统方案 |
| VS Code / Neovim + clangd | 用 UBT 的 `GenerateClangDatabase` 模式生成 `compile_commands.json`；需要先完整编译一次（否则缺少 UHT 生成的头文件）；clangd 版本要和引擎要求的 LLVM 版本对应 **[社区]** |

**对 Agent 最重要的一点**：Claude Code 的 LSP 插件能否正确解析 UE 代码，取决于 `compile_commands.json` 是否正确。如果解析不了，**退而求其次的可靠方法是让 Agent 直接 grep 引擎头文件**（安装版在 `Engine/Source` 下有头文件）确认 API。

## 7. 选型建议

| 场景 | 推荐 |
|---|---|
| UE 5.8+，用 Claude Code / Codex | **Unreal MCP（5.8.1+）+ Epic 插件** + 本目录 templates；编辑器里勤存盘，用 Sandboxes 做探索性修改 |
| UE 5.5–5.7 | UnrealClaude，或只用通用编码工作流（C++）+ 命令行编译和测试（见 [02](02-large-project-guide.md)） |
| 需要 Agent 测打包后的游戏 | 在开发版里用 `IModelContextProtocolModule` 注册测试工具（见 1.4 节） |
| CI | `RunUAT BuildCookRun` + 命令行自动化测试（见 [02](02-large-project-guide.md#4-测试)） |

> ⚠️ 不要同时启用多个连接同一个编辑器的 MCP（官方 + 社区）：工具重复，Agent 容易选错，上下文也会膨胀。
