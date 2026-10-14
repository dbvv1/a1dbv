# 大型 Unreal 项目 × AI 落地指南

> 核实时间：2026-10-08；Live Coding 状态契约补核：2026-10-15（UTC+8）。
> 目标和 Unity 指南一样：让 Agent 在大型 UE 项目里**看得见、改得对、验得了、回得去**。通用方法见主干 [07 工作流](../../../docs/07-workflows.md)，这里只写 UE 特有的部分。
> 命令行用法来自 Epic 官方文档 **[一手]**；Build.bat 的参数和目录约定属于 UE 开发的通用做法 **[经验]**，请以你的引擎版本为准。

## 0. UE 和 Unity 在 AI 落地上的三个根本差异

1. **资产是二进制的**：`.uasset` / `.umap` 无法用文本工具读改，只能通过编辑器（MCP、Editor Python、编辑器工具）操作。
2. **逻辑分散在 C++ 和蓝图里**：源码可直接检索；蓝图需要核对已配置工具能读取的图、属性和编译结果，不能由二进制格式推定不可见。
3. **本指南的保守编译循环分两档**：
   - 只改 `.cpp` 函数体：Live Coding，秒级；
   - 改头文件、反射宏（`UPROPERTY`、`UFUNCTION`）、新增类或模块：完整编译并重启编辑器，分钟级。

所以 UE 项目的 AI 化，先**保留现有 C++／蓝图分工，沿用已有读改与验证入口，缺能力时收窄任务**，不默认迁移逻辑。蓝图工具的依据与覆盖局限见 [03 第 6 节](03-engine-fundamentals.md#6-蓝图与-c-的分工)（2026-10-14 核实）。**[一手／经验]**

## 1. 项目前置条件（一次性设置）

| 设置 | 原因 |
|---|---|
| **写明现有 C++／蓝图职责及验证入口** | 蓝图修改前核对具体工具 schema、状态回读与编译能力；入口不足时停下相关自动修改，不为 Agent 可读性重写工程 |
| 数据用 **DataTable（可导入导出 CSV / JSON）** 和 Data Asset | 文本格式的数据源 Agent 能直接读改，导入步骤可以脚本化 |
| 按功能拆**模块**（`.Build.cs`）和插件 | 缩短编译时间；给 Agent 清晰的边界和依赖方向 |
| 生成 IDE 项目文件和 `compile_commands.json` | 让 LSP / clangd 能分析代码（见 [01 第 6 节](01-toolchain.md#6-ide-和代码智能)） |
| **告诉 Agent 引擎源码在哪里** | UE API 版本间变化大，模型常写出旧 API；“不确定就去 grep 引擎头文件”是最有效的防幻觉手段 |
| 沿用已有 Editor Python／项目接口；确有缺口再评估 Unreal MCP | 按 [01 工具链](01-toolchain.md)核对版本，只启用任务所需工具集，不默认 All Toolsets 或安装插件 |
| 版本控制：Perforce 或 Git + LFS | UE 团队普遍用 Perforce；Git 需要 LFS 管理 `.uasset` |

## 2. 禁区与规则

| 对象 | 规则 |
|---|---|
| `Binaries/`、`Intermediate/`、`DerivedDataCache/`、`Saved/`（日志除外）、插件下的 `Binaries/`、`Intermediate/` | **禁止读写**（生成物，体积很大）。`Saved/Logs/` 可以读 |
| `*.uasset`、`*.umap` | **禁止用文本工具编辑**（二进制，会直接损坏）。通过 MCP 或 Editor Python 修改 |
| `Config/*.ini`、`*.uproject`、`*.uplugin`、`*.Target.cs` | 修改前必须询问（影响整个项目、所有平台或构建） |
| 第三方代码（`Plugins/` 下的商城插件、`ThirdParty/`） | 只读；需要改时加包装层 |
| 引擎源码（源码版） | 默认只读；改引擎是单独的决策 |

模板中的 Hook 会按 [`protected-paths.txt`](templates/.claude/protected-paths.txt) 自动拦截。

## 3. 编译验证

按速度从快到慢：

| 方式 | 速度 | 适用 | 说明 |
|---|---|---|---|
| LSP / clangd 诊断 | 秒级 | 有正确的 `compile_commands.json` | 宏多，误报不少，仅作参考 |
| **Live Coding**（编辑器开着） | 秒级到十几秒 | **只改了 `.cpp` 函数体** | 通过 MCP 调用 `LiveCodingToolset.CompileLiveCoding`，它会阻塞到编译完成并返回 MSVC 诊断 **[一手：Epic 插件 Skill]** |
| **UBT 命令行编译**（编辑器关着） | 分钟级 | 改了头文件、反射宏，新增类、模块，或者在 CI 里 | 模板脚本 [`ue-build`](templates/.claude/skills/ue-build/) |
| 完整打包（BuildCookRun） | 十几分钟到小时级 | 发布前、CI | 包括 Build、Cook、Stage、Package、Deploy、Run 几个阶段 **[一手]** |

**两个常见的坑**：
- **Live Coding 开着时，命令行 UBT 会拒绝编译**（提示 Live Coding 处于活动状态）。模板脚本会识别这种情况，提示 Agent 改用 MCP 的 Live Coding，或者先关掉编辑器。
- **反射声明／类布局改变时，本指南采用完整编译并重启的保守路径，不是声称引擎绝对不支持热更。** [UE 5.8 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-live-coding-to-recompile-unreal-engine-applications-at-runtime)说明 Object Reinstancing 可替换含反射宏的对象；维护者仍须通过重载完成委托更新指针或使缓存失效。没有这项维护契约时，不把热编译成功当验收。新增 MCP C++ 工具的 `UFUNCTION` 仍须按[工具注册的专门限制](01-toolchain.md#13-写自己的工具)重启，不能用一般重实例化能力代替。**[一手／研究]**

## 4. 测试

UE 自带 Automation Test Framework（推荐用 Automation Spec 写 BDD 风格的测试）。Epic 文档给出的命令行用法 **[一手]**：

```bash
# Windows：UnrealEditor-Cmd.exe；macOS / Linux：UnrealEditor
UnrealEditor-Cmd.exe MyGame.uproject \
  -ExecCmds="Automation RunTest MyGame.Combat;Quit" \
  -unattended -nopause -NullRHI -log \
  -ReportExportPath="Saved/Automation/Reports"     # 生成 JSON（index.json）和 HTML 报告
# 过滤方式：Test1+Test2；前缀 MySet.MySubSet；分组 Group:MyGroup
# -ResumeRunTest：配合 -ReportExportPath，从第一个未运行的测试继续（崩溃后恢复）
```

模板脚本 [`ue-run-tests`](templates/.claude/skills/ue-run-tests/) 会运行上面的命令，并从 `index.json` 中提取失败用例。

**为可测试性设计**：
- 已采用 C++ 的独立游戏规则可写成**不依赖 World 的类或函数**，便于 Automation Spec 直接测试；不据此要求现有蓝图迁移；
- 需要 World 的测试用 Functional Test（在测试关卡里放置测试 Actor），成本更高，用于关键流程。

## 5. 运行时验证（PIE 与打包版）

按 [02 验证与试玩](../02-verification-and-playtesting.md) 的待证事实选路；优先已有测试与调试入口，缺少必要观察时再选下列能力：

| 所需观察 | UE 中的做法 |
|---|---|
| 状态导出 / 输入注入 | 写一个**测试工具集**（Python 或 C++ `AICallable`）：`GetGameState`、`PerformAction`、`LoadScenario`；也可以用 `Exec` 函数或控制台命令 |
| 编辑器内试玩 | 通过 MCP 启动和停止 PIE。注意 **PIE 运行时很多编辑器工具的行为会变**（官方安全规则） |
| **打包版试玩** | 在开发版里用 `IModelContextProtocolModule::StartServer()` 托管 MCP，用 `AddTool()` 注册测试工具，让 Agent 直接玩打包后的游戏 **[一手]**。**不要带进正式发行版** |
| 大规模自动化 | Gauntlet（UE 的自动化测试编排框架），适合 CI 中跑多客户端、多平台 |
| 性能 | Unreal Insights 采集 trace，让 Agent 读导出的统计，而不是读截图 |

**`.cpp` 构造默认值修改例外**：已有实例不会因 Live Coding 自动取得新值；先查当前实例和资产覆盖，再用完整构建后的新进程复核初始化，别继续改业务函数迁就旧对象。涉及重实例化的缓存还要核退出路径，详见 [重复 Play 与新进程](../02-verification-and-playtesting.md#重复-play-与新进程先核实这次从什么状态开始)。普通函数体改动仍可沿用已有测试，无须一律打包。**[一手／研究：同上 Live Coding 契约]**

## 6. 日志

- 项目日志：`Saved/Logs/<项目名>.log`；
- **让 Agent 过滤着读**：`grep -E "Error|Warning: .*Ensure|Fatal"`，不要把整个日志读进上下文；
- MCP 自身的日志在 `LogModelContextProtocol` 分类下。

## 7. 大仓库与版本控制

- **上下文**：每个大模块（`Source/MyGame/Combat/` 等）放一个 `AGENTS.md`，写这个模块的约定和禁区；
- **Perforce**：文件默认只读，Agent 编辑会失败。可以加 `PreToolUse` Hook 在编辑前自动 `p4 edit`；Claude Code 也提供 `WorktreeCreate` / `WorktreeRemove` Hook 支持非 git 的版本控制；
- **并行**：每个工作副本都要编译一遍 C++ 并构建 DDC（派生数据缓存）。共享 DDC（Zen 或云端 DDC）能大幅缓解；纯 C++ 任务适合并行，需要编辑器的任务串行；
- **Sandboxes（5.8）**：在编辑器里做探索性修改的隔离区，适合让 Agent 试错，再挑选要保留的改动 **[一手]**。

## 8. 代码质量与评审

- UE 的命名前缀（`A`、`U`、`F`、`E`、`I`、`T`）和反射宏由 UHT 强制检查，**不需要写进 AGENTS.md**（避免“Lint 泄漏”）；
- **需要写进去、或交给评审子 Agent 检查的**是 UE 特有的正确性问题：
  - 指向 `UObject` 的成员必须有 `UPROPERTY`（或 `TObjectPtr` 加 `UPROPERTY`），否则会被 GC 回收，留下悬空指针；
  - `UObject` 用 `NewObject` / `CreateDefaultSubobject` 创建，不要 `new`；构造函数里不要访问 World；
  - 判空用 `IsValid()`；
  - 网络同步：`Replicated` 属性要在 `GetLifetimeReplicatedProps` 里注册，RPC 要做服务端校验；
  - Tick 默认关掉，需要时再开；热路径不要用 `GetAllActorsOfClass`、动态 `Cast` 循环；
  - 头文件遵循 IWYU，前向声明优先，避免让编译时间膨胀。
- 模板里的 [`ue-code-reviewer`](templates/.claude/agents/ue-code-reviewer.md) 子 Agent 按以上清单评审。

## 9. 哪些任务适合交给 AI

| 很适合 ✅ | 需要人盯 ⚠️ | 不建议 ❌ |
|---|---|---|
| 纯 C++ 游戏逻辑、数据结构、工具类 | 跨模块重构、改公共头文件（编译影响面大） | 手工“编辑” `.uasset` / `.umap` |
| 编辑器工具、Editor Python 批处理、MCP 工具集 | GAS、网络同步 | 改引擎源码（除非这就是任务本身） |
| Automation Spec 测试 | 渲染、材质、Niagara 的性能调优（要有 Insights 数据） | 平台认证、商店配置 |
| DataTable 数据的批量生成和校验 | 蓝图逻辑修改（先核对工具 schema、回读及编译，再评审相关行为） | 没有测试的战斗手感调参 |
| 日志、崩溃堆栈分析 | 动画蓝图、Control Rig | 美术风格一致性 |

## 10. 推荐的单次任务流程

```
1. /clear，开新会话
2. “阅读 Source/MyGame/Combat，说明数据流和涉及的蓝图类，不要改代码”   ← 探索
3. Plan 模式：说明需求、验收标准、要改哪些头文件                       ← 计划
4. 审阅计划；涉及头文件或反射宏 → 计划中要包含“关编辑器 + 完整编译”     ← 人工把关
5. 实现：只改 .cpp → MCP Live Coding；改了头文件 → /ue-build            ← 实现
6. /ue-run-tests MyGame.Combat                                           ← 验证
7. PIE 或打包版试玩（测试工具集 + 人工试玩手感）                         ← 验收
8. ue-code-reviewer 子 Agent 评审 → 提交                                  ← 评审
```
