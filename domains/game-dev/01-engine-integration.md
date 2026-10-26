# 引擎接入：让 Agent 操作游戏引擎

> 最近核实：2026-10-22（UTC+8）。本页为资料与接口核查，未运行引擎／模型，也未复验全部外链；各节原始核实日期与验证范围见节末。

## 30 秒结论：先用已有入口

先按任务在下表找到入口：能沿用项目已有的编译／测试、Editor 脚本或导入器，就不为接入再装一层。

| 要做什么 | 优先入口 | 先确认什么 |
|---|---|---|
| 判断共享改动的影响 | 文件搜索＋已有原生引用查询；反复追踪才评估只读索引 | 查询方向、扫描／导入状态、变体和动态加载盲区；零结果不等于未使用 |
| 改代码、跑测试 | 项目已有编译／测试命令；互相依赖的新文件按完整编译批次处理 | 目标工程、最终编译结果及现有组件的序列化值；改源码默认值不等于更新旧场景 |
| 改场景、资产或引用 | 已有 Editor API／脚本；Unity 需补入口时，能可靠用 shell 选官方 CLI，否则选其 MCP | 目标实例、实际命令 schema、读取／修改／回读能力；连不上时先诊断，不轮换包装层 |
| 修改后接收／恢复 | 回读当前对象与消费者，再核任务相关画面／运行结果 | 修改后状态、保存重开与恢复范围；恢复一个对象不等于恢复外部引用 |
| 第二次生成替换旧资产 | 原有导入策略或原生替换操作；源节点增删／重排时，再选层级联动或组件保留 | 用户资产是否保留、导入器可替换／删除哪些对象，再核子资产、pivot、材质与下游引用 |
| 在 Unity 内试少量占位资源 | 条款允许时比较原生生成器 | 版本、credits、许可与原型用途 |

没有相应入口就报告具体缺口，不自行安装一套工具，也不绕过资产格式限制。

**✅ 资产修改默认用引擎 Editor API，不要求专用 Agent 接口。** C#／C++ 源码可直接编辑；Unity 的 Force Text 只决定序列化格式，GUID／fileID 与 Prefab 关系仍须保持完整，直接文本修改仅作经项目验证的受限例外；Unreal 的 `.uasset`／`.umap` 不做文本补丁。Unity 官方文档对外部 YAML 编辑的表述存在冲突，因此不承诺直改安全；结果仍须在目标版本引擎加载并检查引用。

Unity 的细节见 [unity/01-toolchain.md](unity/01-toolchain.md)，Unreal 的细节见 [unreal/01-toolchain.md](unreal/01-toolchain.md)，本页做横向比较。

**本节来源与范围**：入口表归纳自 §1–§6；资产编辑边界与 WP9 接入契约于 2026-10-14（UTC+8）单独复核，资产格式判断为一手文档＋经验，官方表述冲突与真实失败反例见 [资产编辑边界研究](../../docs/research/2026-10-13-game-asset-editing-boundary.md)。未运行引擎。

## 1. 总览

**先按引擎看官方入口的成熟度：有正式内置或官方插件的优先沿用，只有社区项目的先按任务评估。**

| 引擎 / 工具 | 官方 Agent 接入 | 形态 | 关键能力 | 成熟度 | 评级 |
|---|---|---|---|---|---|
| **Unity 6+** | Unity CLI + 官方插件；`unity mcp` | CLI／MCP 共用项目 Pipeline，按客户端能力选择入口 | 驱动打开的编辑器、`unity test` / `build`、Play 模式帧数检查 | CLI 实验性／1.0 beta；缺入口时评估 | 🧪 |
| **Unreal 5.8** | 引擎内置的 **ModelContextProtocol** 插件 + Epic 的 Claude Code 插件 | 编辑器内的 HTTP MCP 服务器（默认 `127.0.0.1:8000/mcp`）+ 工具搜索 | 30 多个工具集、数百个工具：Actor、蓝图、材质、Niagara、Sequencer、Control Rig、GAS、自动化测试、Live Coding 编译 | 插件位于 `Engine/Plugins/Experimental`，**实验性** | 🧪 |
| **Roblox Studio** | **内置**在 Studio 中的 MCP 服务器 | stdio；一键连接 Claude Code、Codex CLI、Cursor、Gemini CLI、Antigravity、VS Code | 脚本读写、执行 Luau、**AI 生成网格和材质**、**内置的 explore / playtest 子 Agent**、**模拟玩家键鼠输入**、截图 | 正式功能，持续更新 | ✅ |
| **Godot 4** | 无官方 Agent 接入 | 社区 MCP，分“文件级”和“连接运行中编辑器”两类 | 场景树、脚本、运行项目 | 社区项目质量参差不齐 | 👀 |
| **Blender 5.1+** | Blender Lab 官方 MCP | 插件 + MCP 服务器，可接 llama.cpp 等本地客户端 | 偏**场景分析和文档查询**（比如找出“屏幕占比小但面数高”的物体） | 官方声明执行 LLM 代码**没有任何防护**，建议在虚拟机里用 | 🧪（在隔离环境里用） |
| Blender（社区） | [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)（2026-10 仍在更新） | MCP | 偏**资产获取和生成**，教程最多 | 同样直接执行任意 Python | 🧪（在隔离环境里用） |
| Bevy / Web 等代码优先项目 | 依具体框架 | 代码与运行时工具 | 文件可读不等于运行状态、资产和平台行为已可验证 | 按项目核查 | 🧪 按需求评估，不为 Agent 迁移（见第 3 节） |

**本节来源与范围**：各引擎官方文档、官方插件与社区项目页面（一手／社区）；核实 2026-10-08，细节与限制见 §2–§6；未运行引擎。

## 2. 三种官方设计思路

**三家官方方案分别用 CLI、元工具搜索和内置子 Agent 解决“Agent 怎么操作编辑器”；先看它们把能力放在哪，再决定自己接哪条路或借鉴哪些机制。**

### 2.1 Unity：CLI 优先，Skill 承载知识

**Agent 要操作 Unity，先看项目有没有可用的 CLI／Pipeline；有就沿用。需要补编辑器入口时，能可靠用 shell 操作就选官方 CLI，否则选适配客户端的 `unity mcp`。**

- 核心是一个**命令行工具**（`unity status / command / test / build`），MCP 只是把同样的能力再包一层。
- 领域知识写在按需加载的 Skill 里（UI、2D、URP、服务接入等）。
- **优点**：同一套命令既给人用，也给 Agent 和 CI 用；退出码设计清楚（8 表示测试失败，6 表示基础设施问题），天然适合自动化。
- **代价**：Skill 偏重“功能搭建”，大型项目的架构知识仍要自己写。

**✅ 选传输方式，不把换包装当故障恢复。** 官方 `unity command` 与 `unity mcp` 的运行中 Editor 操作都依赖项目的 `com.unity.pipeline`（Unity 6.0 LTS+）；MCP 能启动／列工具不等于目标 Editor 可执行。先锁定工程并读取当前命令 schema；已有 Editor 脚本满足读写与验收就沿用，不为工具数量再装桥。

| 失败发生在哪 | 继续／退回到哪里 |
|---|---|
| 官方 Pipeline 因 Safe Mode 未加载 | 暂停资产操作；操作者或已有文件工具按目标工程编译日志修 `.cs`，恢复 Editor 后重新发现工具。换成同一官方 CLI 的 MCP 模式无效 |
| 编译／domain reload、阻塞对话框或疑似沙箱不可达 | 先核实际状态与权限；不静默启动另一 Editor、不绕过沙箱，也不退成盲改场景 YAML |
| 所需能力没有 schema、只能写却不能读取结果 | 沿用可回读的原生 Editor API／脚本；同样缺能力就只交付可验证部分，停止该资产自动修改 |

**宿主和传输是两个选择。** Unity [AI gateway 2.20.0-pre.2](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/integration/ai-gateway-intro.html)把第三方Agent放进Assistant窗口，且捆绑的Codex／Gemini版本可能不同于本机安装版。已有终端工作流先保留；确实需要编辑器内交互时再核宿主版本、权限和任务能力，不把换宿主当作免费继承原会话／配置或修好Editor连接。

**验证边界**：异步测试的启动成功不是通过，须取得最终结果并核对实际执行范围；`unity mcp` 截图可能回退为整个桌面，需检查返回说明，既不能当指定 Game View 证据，也要避免把其他窗口内容传出。beta.13 已声明修正异步启动时误显示“0/0 passed”，不是仍在发生的已复现故障。

**本节来源与范围**：官方 Unity CLI／Pipeline 与 AI gateway 文档、社区实现／测试对照及作者经验（一手／经验／研究）；故障回退与验证边界的固定来源及限制见 [WP9 §10](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#10-入口可调用不等于编辑与验证闭环)。官方 Unity 入口的故障回退与验证边界于 2026-10-14 UTC 补核（非全表重核）；未运行引擎。

### 2.2 Unreal：几百个工具，藏在“工具搜索”后面

**Unreal 用 3 个元工具加工具搜索控制上下文；项目要接编辑器自动化，先发现现有工具集能读哪些状态，再按官方安全规则存盘、等编译、串行修改并回读结果。**

Epic 的 `unreal-mcp` Skill 原文：

- 工具搜索默认开启，MCP 服务器整个会话**只公开 3 个元工具**：`list_toolsets`、`describe_toolset`、`call_tool`。像 `BlueprintTools.create` 这样的具体工具**不在 `tools/list` 里**，而是通过 `call_tool` 在服务端分发。官方的理由：“这样能让上下文窗口保持很小，**提示缓存保持命中**。”
- **引擎内也有一套 Agent Skills**：项目或插件可以把“本项目的做法”注册成 Skill（用 Python 类或 UAsset 实现），Agent 通过 `AgentSkillToolset.ListSkills` / `GetSkills` 发现，并且**项目 Skill 的优先级高于通用默认做法**。
- 官方安全规则（值得照搬到任何“驱动有状态编辑器”的场景）：
  1. **改之前存盘，改完再存一次**：MCP 修改不一定能撤销，涉及多个资产就当作破坏性操作；
  2. **等编译结束再调工具**：C++ 用 `LiveCodingToolset.CompileLiveCoding`，它会阻塞到编译完成并返回 MSVC 诊断；
  3. **有依赖或同资产的修改要串行**：2026-09-17 官方 Skill 允许工具支持时的独立并发，异步操作可以重叠，执行与完成顺序不保证；多个 Agent 共用编辑器时仍须避免状态冲突；
  4. **一定要检查返回结果**：很多工具失败时不会抛异常，只是返回状态变了；结果不明确时先回读实际状态，不把返回失败当成没有发生修改；
  5. **留意 PIE**（Play-in-Editor）：运行时很多编辑器工具的行为会变。
- Epic 给“写工具集”定的原则（`create-toolset` Skill）也很通用：**Clean**（API 比 Unreal 原生 API 更简单，“技术美术不看实现也能懂”）、**Complete**（CRUD 对称：能 set 就要能 get，能 create 就要能 delete）、**Composable**（同类操作用一致的类型）、**DRY**（通用的属性读写已经有 `ObjectTools`，不要重复造）。
- 已知限制：HTTP 服务器**没有认证**，默认只监听本机；工具调用经游戏线程同步分发；官方文档仍不建议重叠请求，但较新的 Skill 允许安全独立并发，不能把分发串行理解成异步作业不会重叠。
- **打包后的游戏也能托管 MCP 服务器**（运行时模块 + `IModelContextProtocolModule::AddTool()`），这让 Agent 可以直接测试打包版。详见 [unreal/01](unreal/01-toolchain.md#14-一个容易被忽略的能力打包后的游戏也能跑-mcp)。

**本节来源与范围**：Epic 官方 `unreal-mcp`／`create-toolset`／`unreal-skill` Skill、插件 setup／operations 文档与 SessionStart Hook（一手）；契约对照见 [WP9](../../docs/research/2026-10-14-game-wp9-engine-handoff.md)。2026-10-08 核实；未运行引擎。

### 2.3 Roblox：把 Agent 能力直接做进编辑器

**Roblox 把子 Agent、玩家输入模拟和内容生成直接做进 Studio，需要自动玩测时优先用它；只连接可信客户端，并注意 `execute_luau` 的特权。**

官方文档列出的工具里有几项是其他引擎没有的：

- `subagent`：服务器**自己**提供子 Agent，类型有 `explore`（查代码和游戏状态）和 **`playtest`（跑玩法场景并验证结果）**；
- **模拟玩家输入**：`character_navigation`（移动角色到指定位置）、`user_keyboard_input`、`user_mouse_input`；
- `screen_capture`：可以指定相机位置截图；
- 内容生成：`generate_mesh`、`generate_material`、`generate_procedural_model`；
- 多实例：每次调用都带 `studio_id`，**显式指定**要操作的 Studio 实例，不依赖会话状态，所以多个 Agent、多个窗口也不会串。
- 官方提醒：连接的客户端可以读写你打开的 place，只连接你信任的客户端。社区指南还提醒 `execute_luau` 是特权操作，可以发布 place、写 DataStore。

**本节来源与范围**：Roblox 官方 Studio MCP 文档（一手，2026-10-07 更新）；`execute_luau` 特权提醒来自社区指南（二手）。2026-10-08 核实；未运行 Studio。

### 2.4 共同规律（对写自己的工具也适用）

**写自己的编辑器工具时，按这五条取舍：工具按需发现、显式指定实例、区分连接与运行、把验证做成工具、保留恢复点。**

| 规律 | Unity | Unreal | Roblox | 背后的原因 |
|---|---|---|---|---|
| **按需发现，不一次性塞满工具** | Skill 按需加载 | 3 个元工具 + `describe_toolset` | 工具数适中，用 `skill` 工具提供参考资料 | 工具定义占上下文，还会破坏提示缓存（见主干 [03](../../docs/03-context-engineering.md)、[04](../../docs/04-mcp.md)） |
| **显式指定目标实例** | `--project-path` | 端口和 URL | `studio_id` | 编辑器是有状态的，多开时不能靠“当前会话” |
| **区分“连上了”和“真的在运行”** | 当前 Pipeline 提供的 `frameCount`／`playerLoopTicking`；缺字段须换观测或标未验证 | 代理在线不代表 Unreal 可达，要用只读调用确认 | `get_studio_state` | 编辑器可能卡住、在编译、在 PIE |
| **把验证做成工具** | `unity test`、Play 模式检查 | 自动化测试工具集、Live Coding 诊断 | `playtest` 子 Agent、输入模拟、控制台输出 | Agent 能自己验证，才能放手（见 [02 验证与试玩](02-verification-and-playtesting.md)） |
| **修改有风险，要有恢复点** | 版本控制是前提 | 先存盘 | 只连信任的客户端 | 编辑器修改不一定能撤销 |

**本节来源与范围**：由 §2.1–§2.3 的官方方案归纳（一手／社区），采用判断为经验；未运行引擎。

### 2.5 编译、保存与恢复：接收的是当前编辑器状态

**✅ 互相依赖的新脚本一起编译，已有组件的值另外迁移。** 若桥逐文件预编译，两个新类互相引用时，先写哪一个都可能失败；优先使用按assembly处理的批量入口，或已有项目文件／编译流程，保留最终编译检查。编译后再回读应变对象，不能用改C#默认值替代修改已序列化字段。Agent列目标实例、原值、预期值与保留覆盖；人决定改Prefab源还是局部实例，避免自动覆盖其他关卡调整。第三方桥厂商的近期自测复盘与采用顺序见本节末来源。

**Unity实例修改优先走能记录override的原生接口。** 官方推荐SerializedObject／SerializedProperty；直接改Prefab实例时还须正确记录修改并保存。接收时重新打开目标场景核值与引用，避免只验证内存中已经变化。不说明任何桥已经完整实现，也不要求把合法实例覆盖应用到整个Prefab。

**✅ 版本变了先重读，恢复还须找回消费者。** 已有可靠的revision检查／只读preview可用于防止覆盖后来修改；没有就保持同资产串行、缩小批次并用恢复点。结果不明先查已执行部分，不能直接重复create或批量重试。近期UE候选虽提供actor计划恢复，却明确不恢复运行时组件层级与其他actor持有的引用；因此还原对象的外观和属性后，仍须核外部引用和行为。此为接入能力的比较条件，不推荐因此替换现有桥。作者自报与范围见本节末来源。

**画面相关改动，要看完成修改后的画面。** Agent先等编译／异步操作完成，再取得目标面板或Game View的新帧；UI布局、材质外观和运动问题不能只看属性回读。现有截图／视频入口足够就复用，不为此换harness。当前GameDevBench提供独立的视觉反馈比较，但旧代同模型收益不能外推当前模型幅度；结构、画面与实际游玩仍按[02](02-verification-and-playtesting.md)分验，人保留可读性和手感判断。

**本节来源与范围**：第三方桥厂商自测（作者自报）、[Unity 6.3 官方契约](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/PrefabUtility.RecordPrefabInstancePropertyModifications.html)与 GameDevBench 当前代比较（一手／研究）；固定条件与范围见 [WP9 §15.1](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#151-整页比较与来源角色)、[§15.2](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#152-编译批次与序列化状态必须一起接收)、[§15.3](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#153-修改后画面和恢复范围不是一个成功状态)。2026-10-22（UTC+8）整页比较复核编译批次、序列化状态、视觉回读与恢复范围；未运行引擎。

## 3. 引擎选择对 AI coding 的影响

**✅ 已有 Unity／Unreal／Godot 工程先维持引擎，补当前任务缺少的读取、修改或验证能力；不因“模型熟悉某语言”或“场景是文本”迁移。** 本页撤回模型熟悉度排名和“纯代码最省事”的普遍结论：现有材料没有同任务、同模型、同质量门槛的跨引擎维护成本比较。选型反证见本节末来源。

| 已有工程 | 采用／维持 | 何时收窄 Agent 范围 |
|---|---|---|
| Unity | 沿用已验证的 C#、场景／Prefab 和 importer；可独立的规则适合单独测试，不为可读性重写全部 MonoBehaviour 或资产 | 只能读代码却读不到序列化字段、对象引用或 Play 状态时，只交付代码层结果，补 Editor API 回读后再改资产 |
| Unreal | 保留现有 C++／Blueprint 分工；代码 API 查项目对应版本头文件，蓝图任务先发现现有工具能读哪些图、属性和编译结果 | 二进制文件不能靠文本搜索读懂，但不等于接入工具后仍不可见；读不到任务所需状态时停止该部分自动修改，不默认把蓝图迁成 C++ |
| Godot | 沿用项目版本与 GDScript／C#；文本场景便于差异检查，先用已有 CLI、脚本和项目测试 | 官方已有 headless、场景运行、脚本及导出入口，不必先装 MCP；解析成功仍不足以证明导入、碰撞、UI 或目标平台正确 |
| Bevy／Web 等代码优先项目 | 已有工具链满足玩法、资产及发布需求时沿用；逐框架核对运行观测与升级契约 | 没有编辑器桥不代表没有维护成本；例如 Bevy 0.16→0.17 的 Entity 序列化变化需要迁移，但不能外推所有框架 |

**🧪 新项目才把引擎作为候选比较；已有项目只有具体阻塞才重新评估。** 先看玩法与目标平台、现成资产／中间件、维护者能力，再比较 Agent 完成同一变更所需的连接和反馈。迁移理由可以是原引擎无法满足的平台、许可或必要能力；“Agent 写得顺”本身不足以抵偿资产、UI、物理、存档与发布路径重做。先在副本核查受影响的代表性流程，再决定迁移。

Mega Crit 的历史选型重视授权信任、平台与现成引擎服务；Road to Vostok 的 Unity→Godot 迁移遇到资产管线和控制器差异；White Giant 的 Godot 3→4 也在自动转换后手修菜单。这些不同作者的具体反例见本节末来源，支持检查迁移代价，不能证明哪个引擎的 AI 效率更高。**关键局限：这里是来源与接口核查，没有本仓库跨引擎迁移、当前模型或长期工时实测。**

**本节来源与范围**：接口边界依据 [Unity CLI／Pipeline](https://docs.unity.com/en-us/unity-cli)、[Epic 官方技能](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin/blob/a6aa73ada02a9fb1f5415bec491f9942c519b297/skills/unreal-mcp/SKILL.md)、[Godot 4.5 CLI](https://docs.godotengine.org/en/4.5/tutorials/editor/command_line_tutorial.html)与 [Bevy 指定版本迁移指南](https://bevy.org/learn/migration-guides/0-16-to-0-17/)；表中采用与停止条件是本仓库判断。 各引擎官方接口文档（一手）、不同项目的迁移反例（一手／研究）与作者采用经验（经验）；选型反证与具体反例见 [WP9 §9](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#9-引擎选择补核可读代码不等于值得迁移)、[§9.1](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#91-不同项目的迁移理由与代价)。§3 引擎选择于 2026-10-14 UTC 重新核实；2026-10-15（UTC+8）独立审阅全文核心选择与相关入口并撤回跨引擎验证排名；未运行引擎。

## 4. 选型建议

**✅ 先只读核对已有能力，再补所缺组件。** Skill／客户端插件已加载、引擎桥已安装、目标实例能执行，以及结果通过检查，是四件不同的事。Unity 的插件不等于项目已有 Pipeline；Unreal 的 Claude 插件也不替代引擎 MCP 与工具集。安装包、启用工具集、写客户端配置或放宽执行权限都不是只读检查，不把“接入 Agent”理解为默认授权整栈。接入采用门槛见本节末来源。

| 你的情况 | 建议 |
|---|---|
| Unity 6+ | 先沿用现有编译／测试及 Editor API；缺运行中编辑器连接时，再选官方 CLI 或适配客户端的 `unity mcp`，官方插件按知识／连接缺口添加（见 [unity/](unity/README.md)） |
| Unity 2021 / 2022 LTS | 先用已有 batchmode／Editor 脚本；确需实时桥时再评估固定版本 CoplayDev/unity-mcp，逐工具核对导入／移动契约（见 Unity 工具页） |
| Unreal 5.8+ | 代码／测试沿用既有流程；资产批处理可用已有 Editor Python。确需交互式编辑器入口时，再启用 Unreal MCP 和任务所需工具集，先满足 [5.8.1+ 修复前提](unreal/01-toolchain.md#15-已知限制官方)，不默认 `AllToolsets`；**版本控制并勤存盘，端口只限本机**（见 [unreal/](unreal/README.md)） |
| Unreal 5.8 以下 | 先沿用 Editor Python 与既有编译／测试；仅在缺交互入口时核查社区桥。UnrealClaude 当前声明 UE 5.7，不能外推 5.5／5.6；还须接受源码构建和权限审查成本（见 Unreal 工具页） |
| Roblox | 直接用 Studio 内置 MCP；内置 `playtest` 子 Agent、输入模拟与截图，仍按任务核对结果和覆盖范围 |
| Godot | 先沿用官方 CLI、脚本与项目测试；确缺运行中场景读取／操作时再评估兼容版本的社区桥，不把文件可读当运行行为已验证 |
| Blender | 官方 MCP 用于场景分析，社区 MCP 用于资产获取；**都放在虚拟机或无敏感数据的机器上** |

> ⚠️ 不要同时装多个连接同一个编辑器的 MCP：工具重复，Agent 容易选错，上下文也会膨胀。

**本节来源与范围**：各引擎官方入口与安装文档、权限边界及作者经验（一手／经验）；接入采用门槛见 [WP9 §11](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#11-接入采用门槛版本安装与权限分别确认)。采用入口、安装与权限分层于 2026-10-14 UTC 补核；未运行引擎，也未实际安装或放宽权限。

## 5. 第二次重生成：更新已有对象，保留正确含义

**✅ 先复用引擎导入器，Agent 入口只负责发起与回读。** Unity 6+ 缺运行中 Editor 连接时再选官方 CLI/Pipeline；AI Assistant 包内旧 MCP 已被[官方弃用](https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli)，`unity mcp` 继续支持。批量规格先用 Unity Presets/AssetPostprocessor，或 Unreal Editor Python 与适配格式的 Interchange pipeline；不用新建导入服务，也不必为了批处理强升到支持 MCP 的引擎版本。

**Unity 批量写入与消费新资产分两段。** [Unity 6.3 批量契约](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetDatabase.StartAssetEditing.html)要求 scope 内只做不依赖完整导入结果的操作；用 `AssetEditingScope`／`using` 或 `try/finally` 配对释放，最外层暂停结束且相关导入完成后，再加载新资产并更新下游引用。批量控制未承诺原子回滚；异常或单项失败后，先核各项返回值、日志与实际资产，不因 scope 已退出就宣称整批成功或已恢复。证据与回调边界见本节末来源。

| 第二次修改 | 最小采用规格 | 失败时停止什么 |
|---|---|---|
| 原位替换像素／网格 | 记录已有 GUID/对象路径、语义名称、单位与 pivot 坐标约定；保留已有目标 | 出现额外 `_1` 资产或旧使用点仍指旧内容，不能宣告替换完成 |
| 新增／重排子资产 | 从源身份映射旧 Sprite、动画、材质槽，分清生成字段与程序员调整 | 对应关系不唯一，停止自动重排，转明确迁移 |
| 修改导入规则 | 复用预设／pipeline，明确哪些属性重应用、哪些保留，以及哪些资产可清理 | 用户资产被删或未声明字段被覆盖，先恢复并查导入器责任 |
| 更新下游使用 | 回读 Prefab/Blueprint、动画、挂点及运行时加载键 | 无 Missing 但换错动作或锚点移位，仍算失败 |

依据是官方 Sprite Smart 的空间匹配、Prefab 名称匹配与 Interchange 显式覆盖策略；具体采用／改造／不用、固定源码及反例见本节末来源。

**Unity FBX 新增动作与保留旧设置分开验收。** 改过 clip 的循环、裁剪等属性后，原位替换 FBX 可能保留旧列表；源文件含新 take 不等于新 clip 已导入。对照预期动作、Source Take 与实际 clips，只补需要的新条目并保留旧设置，不以删除 `.meta` 或整体重置列表找回动作。**局限：UUM-130850 的 Fixed 对应遗漏 take 的 UI 通知，不是自动合并保证**；目标版本仍须核新增 clip、旧事件与使用点，见本节末来源。

**UnityGLTF 跨资产材质 remap 还要验冷导入。** 后续获准实测时，在保留源文件与 `.meta` 的干净工程副本中全量导入，核对旧 Renderer 各材质槽实际指向的资产／子资产；Inspector 映射正确、暖缓存下单文件重导入成功都不足以放行。回落到内部同名材质仍算失败，不以删除工作工程 `Library` 作为修复步骤。该历史故障已由 UnityGLTF 2.22.0 纳入修复，固定版本与证据见本节末来源。

**自定义材质被删时，先保资产，再修导入器。** 暂停重复重导入，从恢复点找回用户材质，核目标包的替换／清理逻辑及对应修复；单纯重绑引用无法找回已删除的实体。Spine 历史修复选择保留自定义材质列表，但 atlas 页数变化需手动同步，说明保留用户调整可能牺牲自动更新；固定补丁与同用户回执见本节末来源。

**UE旧骨骼资产升级后重导失败，先核导入路线，不先重做骨架。** 命中UE-325794这类legacy首导、切Interchange后新增骨骼失败时，可仅关闭FBX feature flag回到旧入口，不必禁整个Interchange插件；已有修复的版本先验修复路径。回退也不是永久默认：5.7旧入口另有重导错乱，官方列5.7.2修复。保留旧资产并核同源二改后的层级及动画使用点，不能把弹窗确认或重导完成当正确。官方复现、原报告者有限回执及版本反例见本节末来源。

**源文件增删／重排节点时，先选谁维护结构。** Unity 的 Model Prefab 联动适合源层级仍是权威的视觉内容；要保住引擎内组件结构，可比较完全解包后的普通 Prefab，但新增节点、改名和材质引用改为显式迁移。稳定外层并不会解除内部 Model Prefab 的联动，普通 Unpack 也未必解除嵌套／基类关系。UE 5.8 的 **FBX Scene Import** 开启 Reimport Hierarchy 会覆盖 Blueprint Components 编辑，保留 node graph 并不等于保住组件。纯源驱动装饰件不必解耦；已有组件必须保留时，不盲开层级重建。来源与路径限制见本节末来源。

**关键局限**：GUID/路径存在或接口返回成功都不证明语义正确，仍须在目标版本引擎检验第二次修改后的真实引用与行为。

换装导入还须核身体覆盖、绑定矩阵与配套版本；保住引用不等于新衣合身。先按[3D衣橱选择](assets/3d.md#角色换装先开放已配套组合)确定完整供给，再做本节身份与二改检查；同骨名或自动绑定不替代运动／LOD验收。

**整组地图二改先交消费者清单，不只交新图或成功导入日志。** 已有Tiled源可试现成导入器＋窄项目语义，原生制作已满足就保原生；共享TSX变更要核所有使用图及不应改变的局部覆盖。视觉源、生成纹理与TMX／TSX不是同一层，导航、圈进度、图标和旧记录也不会因此自动正确。Agent可清点依赖与拟回归，人验驾驶／玩法；反复手补生成物则缩转换范围。同作两轮继承包见本节末来源，含固定源码与九图静态复算，未运行游戏／引擎，不替代本节原通用检查。

**本节来源与范围**：Unity 6.3 官方批量与 Prefab 契约（一手）；第三方桥自测、UnityGLTF／Spine／UE 修复记录及同作继承包（一手／社区／研究）；固定源码、条件与反例见 [WP9 §12](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#12-批量写入与消费新资产分两段)、[§3.4](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#34-unitygltf材质映射设置正确不代表冷导入结果正确)、[§3.5](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#35-fbx保留旧-clip-设置不代表发现新增动作)、[§3.6](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#36-spine先保用户材质再查导入器清理责任)、[§3.2／§4.2](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#32-prefab-的官方-api-也不是任意重建无损)、[§4.3](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#43-修复链与反例不能抹平到最新版已好)、[§13](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#13-整组赛道二改共享源变了哪些消费者必须一起验)。基础核实 2026-10-08；Spine 与源节点迁移于 2026-10-17（UTC+8）补核，UE 修复链于 2026-10-20 补核；未运行引擎／游戏。

## 6. Unity 内生成器：少量原型资产的候选入口

**🧪 已有 Unity 项目只缺少量占位图标或环境音时，对照原生生成器；正式批量生产先沿用已清权的资产管线。** 原生 Object Picker 可生成并赋到当前字段，Promote 可替换当前资产，`UnityAI` 标签帮助找回生成内容；价值假设是减少衔接步骤。生成器补核的固定条件见本节末来源。

**Assistant 2.20.0-pre.2** 的[安装文档](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/install/install-chat.html)要求 Unity **6000.0.76f1、6.3 或更新**，并须接受适用条款、连接 Unity Cloud。能力包括 Sprite／贴图／材质／Cubemap、简单单部件 3D、音效与动画；3D 生成物没有独立活动部件、绑定或动画，不能直接承担角色生产。

| 当前任务 | 采用条件 | 何时撤回 |
|---|---|---|
| 小批原型占位 | 🧪 已有兼容包、云连接、可用 credits；Unity 点击条款及实际模型允许该用途 | 为几个占位资产必须升级工程／开新订阅，或需要手绘 mask、逐帧修补才能合格 |
| 替换旧 Sprite／AudioClip | 🧪 用对应 Promote 操作，再回读旧使用点、子资产、pivot 与导入设置 | 把 Object Picker 的新建／赋值当全项目替换，或二改改变了既有语义 |
| 正式生产／跨引擎复用 | 👀 分别核 Unity 生产资格、供应商／模型输出许可、输入权利与渠道披露；两轮质量和总成本合格后再采用 | 任何一层未清楚放行，继续用已有合规管线 |

**预算先看账户额度与续费。** Personal 的公开试用为 14 天／1,000 credits，FAQ 写期后转 **US$10/月**；不外推到其他套餐。批量变体按各 generation job 累加，月度余额不结转；CLI／MCP 免费不代表生成免费。不要用示例 credits 保证每件合格资产的美元成本。

Unity 的 Sprite 原型定位影响质量选型，不是独立法律禁商用条款；beta 生产资格仍取决于具体点击条款及供应商／模型。**关键局限：公开文档没有证明原生替换可完整保持 GUID／fileID 等身份，本轮也未测零手修质量、引用保持率或工时收益。** 许可反证、动态复核及 G2 开测前置见本节末来源。

**本节来源与范围**：Unity 官方安装、能力、[入门](https://unity.com/blog/unity-ai-how-to-get-started)／[FAQ](https://unity.com/features/ai)／[计量](https://docs.unity.com/en-us/ai/credits/credits-about)文档（一手）；生成器补核、能力边界及 G2 开测前置见 [WP9 §8](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#8-unity-原生生成器补核原型集成不等于发行管线)、[§8.1](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#81-何时值得加入原生流程)、[WP12 G2](../../docs/research/2026-10-14-game-wp12-indie-roadmap.md#g2-开测前置原生生成器与外部导入)。原生生成器与条件入口于 2026-10-14 UTC 补核；实际验证范围为公开文档与 WP9 补核，未运行生成实验。

<a id="当前最高水平先查影响再加索引"></a>

## 当前最高水平：接通、改对与恢复分开选择

**当前最优整套接入仍未知，但不必等到工具排名确定才工作。** 近期领先候选把编辑器上下文、引用图、带版本的修改和修改后视觉／运行证据连起来；Unity Insight（2026-09）、StraySpark 的 UE 接入设计（09-12）与 Unity 失败复盘（10-21）、GameDevBench 当前代结果分别覆盖其中一部分，没有一项证明全链最佳。主流参照是成熟 Editor API、编译测试与人审，不据此声称团队采用率。完整条件与原文见本节末来源。

| 主要选择 | 领先替代／同题比较 | 当前决定与撤回 |
|---|---|---|
| 已有工程是否换引擎 | Godot代码／文本路线、UE原生PCG与现有Unity／UE工程 | **保留**原引擎，按玩法、平台与迁移代价选择；跨引擎当前模型维护成本排名未覆盖，不因benchmark较高就迁移（§3） |
| 在哪里运行Agent、怎样连引擎 | 外部CLI／MCP、Unity内嵌AI gateway、社区桥 | **保留**已用宿主与入口；缺编辑器能力才补桥。内嵌宿主是另一种版本／权限环境，不是同一Pipeline故障的替代修复（§2.1） |
| 读什么状态、如何找工具 | 版本schema、编辑器面板／运行画面、静态代码与引用图 | **采用**按任务补观察；只读代码不够时先补状态与画面，不靠增加工具数。看不到修改后的对象／画面则收窄交付（§2.4–2.5） |
| 相互依赖的代码与旧组件一起改 | 逐文件预检 versus 完整编译批次；源码初始化值 versus 已序列化值 | **采用**依赖批次＋明确实例迁移；保编译门及非目标覆盖，不用删组件或重置全部Prefab掩盖不同步（§2.5） |
| 共享改动是否需要索引 | 原生查询 versus Unity Insight／Hades增量图 | **保留**文件搜索＋已有查询，重复追踪才试索引；零结果、过期或漏消费者不能放行破坏性修改（下文） |
| 并发、重试与恢复 | 存盘串行 versus revision检查、只读preview、可回读计划 | **保留**恢复点和同资产串行；有可靠版本检查才扩大独立操作。恢复缺组件／消费者，仍视为未恢复（§2.5） |
| 二次生成如何接到旧对象 | 原生importer／替换 versus 新建导入；源层级联动 versus 引擎组件保留 | **保留**已有导入策略并明确身份与权威层；源身份不唯一时转显式迁移，不盲重建（§5） |
| 是否使用原生生成器 | 原生少量原型替换 versus 现有已清权供给 | **保留**原型条件试用与正式生产分开；许可、身份保持或总成本不合格就退回现有供给，不为占位升级工程（§6） |

表中是资料比较后的默认，不是本仓实测。StraySpark独立于引擎厂商但售卖自己的桥；其Unity案例是预写脚本调用、不是模型自主建关卡。GameDevBench的当前代榜单也不是Unity／UE迁移对照。**主要接入选择已完成整页比较，登记差距 1**；当前代真实工程二改、完整恢复及全投入效果仍未知，不把条件选择写成整套效果领先。

### 共享影响：先查消费者，再加索引

近期 Unity Insight 未评分查询正确率且建库不计时；Hades 对照是旧版v1.2、Opus4.8的单题构造工程，不代表当前v2或生产改动质量。

**✅ 保留文件搜索＋已有 Editor API，补一份消费者清单；👀 索引只补重复追踪的瓶颈。** 修改共享脚本／资产前，Agent 列出直接及继承消费者、查询范围与未知项，人确认动态加载和验收范围。Unity 的 GetDependencies 是正向依赖，找消费者须在明确范围反查；UE 的 Get Referencers 只查磁盘引用，还须等资产扫描完成。语义搜索用来发现相似资产，不作为引用穷尽检查。

构建归因工具的引用链不能直接当编辑器消费者全集。先核数据库类型、链端点与对象身份；零链可能是查询不覆盖而非资产未使用。UnityDataTools v2.1.0 的具体问题报告及未复现范围见本节末来源。

试用索引时，对照同一工程的基类／变体／嵌套引用，以及一次改名或替换后的结果，计入初建、刷新和人工核漏成本。当前 Hades 限制明确 v2 不再输出旧版置信／健康字段；零引用只能当静态未发现。索引状态无法对齐工程、漏关键消费者或总投入不优于基线时，退回原生查询；不为索引迁移工程。这是资料推导的采用条件；原文、生产条件和回执见本节末来源。

**本节来源与范围**：领先候选比较见 [Unity Insight](https://arxiv.org/html/2609.27585v1)、[Hades 对照](https://github.com/TheArcForge/Hades/blob/main/Documentation/comparison.md)、[Hades 限制](https://github.com/TheArcForge/Hades/blob/main/LIMITATIONS.md)、GameDevBench 当前代结果与 StraySpark／Unity 失败复盘（一手／研究）；完整条件、生产条件与回执见 [WP9 §15](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#15-整页接入比较从改代码到接收当前编辑器状态)、[§14](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#14-p53改共享资产前先查消费者)，构建引用链补查阅 [WP9 P53 补查](../../docs/research/2026-10-14-game-wp9-engine-handoff.md#p53补查构建引用链不能替代完整消费者查询)。2026-10-22（UTC+8）整页接入选择比较（宿主、编译批次、序列化状态、视觉回读与恢复范围）；整页独立复评登记差距 1；未运行引擎／模型。

## 来源

- [EpicGames/unreal-engine-skills-for-claude-code-plugin](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin)（克隆后读了全部 3 个 Skill、`setup` 与 `operations` 文档、SessionStart Hook；最近提交 2026-09-17。文件为 `skills/unreal-mcp/SKILL.md`、`skills/create-toolset/SKILL.md`、`skills/unreal-skill/SKILL.md`、`references/setup.md`、`hooks/unreal-context.sh`）
- [Epic：Unreal MCP in Unreal Editor](https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor)（插件主页）；UE 5.8 实验性 MCP 的社区指南：[DEV Community](https://dev.to/gamedevtoollab/using-unreal-mcp-in-ue-58-from-codex-setup-toolsets-and-safe-editor-automation-4pon)（二手）
- [Roblox：Connect to the Roblox Studio MCP server](https://create.roblox.com/docs/en-us/studio/mcp)（2026-10-07 更新）
- [Blender Lab：MCP Server](https://www.blender.org/lab/mcp-server/)；[ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)（`marketplace.json`，共 315 个插件；游戏相关的只有 Unity 和 Unreal 两个官方插件）
- HN：[Godot 不再接受 AI 代码](https://news.ycombinator.com/item?id=48743472)（关于 Godot 文本场景格式的评论）
- 引擎份额：[VG Insights：The Big Game Engine Report of 2025（PDF）](https://app.sensortower.com/vgi/assets/reports/The_Big_Game_Engines_Report_of_2025.pdf)、[GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/)
