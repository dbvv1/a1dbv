# 大型 Unity 项目 × AI 落地指南

> 核实时间：2026-10-08。
> 目标：让 Agent 在大型 Unity 项目里**看得见、改得对、验得了、回得去**。通用方法见主干 [07 工作流](../../../docs/07-workflows.md)，这里只写 Unity 特有的部分。

## 1. 项目前置条件（一次性设置）

| 设置 | 位置 | 原因 |
|---|---|---|
| Asset Serialization = **Force Text** | Project Settings → Editor | 场景、Prefab、ScriptableObject 存成可读的 YAML，AI 和 diff 才看得懂 |
| Version Control Mode = **Visible Meta Files** | Project Settings → Version Control | `.meta` 纳入版本控制，GUID 不会丢 |
| 用 `.asmdef` 拆分程序集 | `Assets/**` | 缩短编译时间；给 AI 清晰的模块边界和依赖方向 |
| 生成 `.sln` / `.csproj` | Preferences → External Tools → Regenerate project files | 让 LSP 和 `dotnet build` 能在编辑器外分析代码 |
| Unity 模板的 `.gitignore` | 仓库根 | 排除 `Library/ Temp/ Logs/ obj/ Build/ UserSettings/` |
| Unity 6+：安装 Pipeline 包 | `unity pipeline install`（新项目可用 `unity projects create --with-pipeline`） | 让 Agent 能通过 Unity CLI 驱动编辑器 |
| `permissions.deny` 加上 `Read(Library/**)` 等规则 | `.claude/settings.json` | 官方大仓库指南的做法：不让 Agent 读生成物（见 templates） |

## 2. 禁区与规则

| 对象 | 规则 |
|---|---|
| `Library/`、`Temp/`、`obj/`、`Logs/` | **禁止读写**（生成物，体积很大） |
| `*.meta` | **禁止删除或手写 GUID**。新建脚本让 Unity 生成 meta；移动或重命名时 `.meta` 必须一起 `git mv` |
| `*.unity`、`*.prefab`、`*.asset`（YAML） | **不要手改**：fileID 和 GUID 引用很容易被弄坏。用编辑器 API 修改：`unity command eval`、MCP，或编辑器脚本 |
| `ProjectSettings/`、`Packages/manifest.json` | 修改前必须询问（影响整个项目和所有平台） |
| 第三方插件目录（`Assets/Plugins/`、Asset Store 包） | 只读；需要改时加一层包装或 fork |

模板中的 Hook 会按 [`protected-paths.txt`](templates/.claude/protected-paths.txt) 自动拦截以上大部分操作。

## 3. 编译验证（最重要的反馈回路）

按速度从快到慢：

| 方式 | 速度 | 前提 | 说明 |
|---|---|---|---|
| **LSP 诊断**（`csharp-lsp` 插件） | 秒级 | 已生成 sln/csproj | 每次编辑后自动给出诊断 |
| **`unity recompile`**（编辑器打开时） | 秒级 | Unity 6+，装了 Pipeline 包 | 让运行中的编辑器重编译并返回错误 **[一手]** |
| **`dotnet build <sln>`** | 十几秒 | 已生成 sln/csproj | 新增或删除 `.cs` 后 csproj 不会自动更新，**最终以 Unity 编译为准** |
| **batchmode / `unity run`** | 分钟级 | **编辑器没有打开该项目** | 完整编译 |

模板 Skill [`unity-compile-check`](templates/.claude/skills/unity-compile-check/) 按以上顺序自动选择方式。

**Safe Mode 陷阱** **[一手]**：如果编辑器**启动时**项目就有编译错误，编辑器会进入 Safe Mode，Pipeline 包不加载，CLI 连不上（`unity recompile` 退出码为 7）。处理方法：从 Editor.log 里过滤出 `error CS####` → 修正源码 → 重启编辑器。

## 4. 测试

```bash
# 推荐：Unity CLI（退出码 8 = 测试失败，6 = 基础设施问题）
unity test . --mode EditMode --filter "MyGame.Combat" --output Logs/editmode.xml
unity test . --affected --since origin/main          # 只跑受改动影响的测试

# 没有 Unity CLI 时：原生 batchmode（注意 -runTests 不要加 -quit）
"$UNITY_EDITOR" -batchmode -nographics -projectPath . -runTests \
  -testPlatform EditMode -testResults Logs/editmode.xml -testFilter "MyGame.Combat" -logFile -
```

- 结果是 NUnit XML，模板 Skill [`unity-run-tests`](templates/.claude/skills/unity-run-tests/) 会解析出失败用例。
- **为可测试性设计**：业务逻辑写在纯 C# 类里（不继承 MonoBehaviour），MonoBehaviour 只做胶水层。这样 AI 写测试、改逻辑都会容易得多，EditMode 测试也快。

## 5. Play 模式验证（运行时行为）

官方 `playmode-verification-loop` 的要点 **[一手]**：
1. 进入 Play 模式只是准备工作，**不算验证**；
2. 确认游戏**确实在推进**：失去焦点的编辑器可能停在第 1 帧，`unity status` 仍显示 playing。Unity CLI beta.12 起，`unity status --format json` 会返回 `frameCount` 和 `playerLoopTicking`：**隔几秒查两次，帧数增加了才算在运行**；
3. 截图（注意截到的可能是冻结的画面），并读 Console；
4. 用 `unity command eval` 实时读取或调整状态。

社区实测的结论：AI 能写出“看起来正确但实际不可玩”的游戏 **[二手]**；Simon Willison 也观察到，vibe 出来的游戏“看起来像游戏，但大约只好玩 75 秒”，好玩的玩法循环仍然超出 Agent 的能力 **[社区：原文]**。**手感、玩法和美术一致性必须由人来验收。**

更系统的做法（验证阶梯 L0–L6、把游戏改造成“Agent 能玩”的形态）见 [03 验证与试玩](../03-verification-and-playtesting.md)。

## 6. 日志位置

| 平台 | Editor.log |
|---|---|
| Windows | `%LOCALAPPDATA%\Unity\Editor\Editor.log` |
| macOS | `~/Library/Logs/Unity/Editor.log` |
| Linux | `~/.config/unity3d/Editor.log` |

**让 Agent 过滤着读**（`grep 'error CS'`），不要把整个日志读进上下文。Unity CLI 也提供了 `unity logs --follow`。

## 7. 大仓库与版本控制

- **上下文**：每个大模块放一个子目录 `CLAUDE.md` 或 `AGENTS.md`（如 `Assets/_Project/Scripts/Network/`），只在进入该模块时加载；或者用 `.claude/rules/` 加 `paths:`。
- **Git + LFS**：二进制资源走 LFS。
- **Perforce**：文件默认只读，Agent 编辑会失败。可以加 `PreToolUse` Hook 在 Edit/Write 前自动 `p4 edit`；Claude Code 也提供 `WorktreeCreate` / `WorktreeRemove` Hook 支持非 git 版本控制。
- **并行**：每个 worktree 都有独立的 `Library/`（首次导入很慢、占空间大）。纯代码任务适合并行，需要编辑器的任务串行；可以用 `worktree.sparsePaths` 只检出代码目录。

## 8. 代码质量与规范

- `.editorconfig` 加上 [Microsoft.Unity.Analyzers](https://github.com/microsoft/Microsoft.Unity.Analyzers)（Unity 专用的 Roslyn 分析器）。
- 团队约定写进 AGENTS.md：命名规则、`[SerializeField] private` 优先于 public 字段、事件机制、对象池、异步方案（UniTask 或 Awaitable 统一用一种）。
- 评审子 Agent：`unity-code-reviewer`（生命周期、序列化、Unity 的 null 语义）、`unity-perf-auditor`（热路径分配、`GetComponent` 和 `Find`、装箱）。

## 9. 哪些任务适合交给 AI

| 很适合 ✅ | 需要人盯 ⚠️ | 不建议 ❌ |
|---|---|---|
| 纯 C# 逻辑、数据结构、工具类 | 跨模块重构（先出计划） | 手改大型场景或 Prefab 的 YAML |
| 编辑器扩展、批处理脚本、导入后处理 | Shader 和渲染管线修改 | 平台签名、商店发布配置 |
| 补单元测试 | 网络同步、存档格式迁移 | 没有测试覆盖的战斗手感调参 |
| 配置表解析、代码生成 | 性能优化（要有 Profiler 数据佐证） | 美术风格一致性 |
| 日志和崩溃堆栈分析 | UI 布局（配合截图） | |

## 10. 推荐的单次任务流程

```
1. /clear，开新会话
2. “阅读 Assets/_Project/Scripts/Inventory，说明数据流，不要改代码”   ← 探索
3. Shift+Tab 进入 Plan 模式，说明需求和验收标准                     ← 计划
4. 审阅计划，批准                                                    ← 人工把关
5. Agent 实现：LSP 诊断 + /unity-compile-check                        ← 实现
6. /unity-run-tests EditMode                                         ← 验证
7. Play 模式验证（按第 5 节流程），或人工实际试玩                     ← 验收
8. 让 unity-code-reviewer 子 Agent 审一遍，再提交                     ← 评审
```
