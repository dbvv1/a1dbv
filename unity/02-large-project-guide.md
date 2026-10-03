# 大型 Unity 项目 × AI 落地指南

> 目标：让 Agent 在大型 Unity 项目里**看得见、改得对、验得了、回得去**。

## 1. 项目前置条件（一次性设置）

| 设置 | 位置 | 原因 |
|---|---|---|
| Asset Serialization = **Force Text** | Project Settings → Editor | 场景/Prefab/ScriptableObject 变成可读 YAML，AI 和 diff 才能看懂 |
| Version Control Mode = **Visible Meta Files** | Project Settings → Version Control | `.meta` 进版本控制，GUID 不丢 |
| 程序集定义 `.asmdef` 拆分 | `Assets/**` | 缩短编译时间；给 AI 清晰的模块边界和依赖方向 |
| 生成 `.sln` / `.csproj` | Preferences → External Tools → Regenerate project files | 让 LSP / `dotnet build` 能在编辑器外分析代码 |
| `.gitignore`（Unity 模板） | 仓库根 | 排除 `Library/ Temp/ Logs/ obj/ Build/ UserSettings/`，Agent 搜索时也会跳过它们 |

## 2. AI 改 Unity 项目的“禁区”与规则

| 对象 | 规则 |
|---|---|
| `Library/`、`Temp/`、`obj/`、`Logs/` | **禁止读写**（生成物，体积巨大） |
| `*.meta` | **禁止删除或手写 GUID**。新建脚本让 Unity 生成 meta；移动/重命名文件时 `.meta` 必须一起 `git mv` |
| `*.unity`、`*.prefab`、`*.asset`（YAML） | **避免手改**：fileID/GUID 引用极易弄坏。优先通过编辑器 API（官方插件 / MCP / 编辑器脚本）修改 |
| `ProjectSettings/`、`Packages/manifest.json` | 改前必须询问（影响全项目/全平台） |
| 第三方插件目录（如 `Assets/Plugins/`、Asset Store 包） | 只读；需要改时用包装层或 fork |

模板中的 Hook 会自动拦截以上大部分操作：[`templates/unity/.claude/hooks/guard-unity-files.sh`](../templates/unity/.claude/hooks/guard-unity-files.sh)

## 3. 编译验证（最重要的反馈回路）

按速度从快到慢：

### A. LSP 实时诊断（秒级）
装 C# LSP 插件后，Agent 每次编辑后就能拿到诊断。依赖 `.sln/.csproj` 已生成。

### B. `dotnet build`（十几秒级，不需要打开 Unity）
```bash
dotnet build YourProject.sln -nologo -v q
```
- 依赖 Unity 生成的 csproj（引用了 Unity 安装目录下的程序集）。
- 新增/删除 `.cs` 文件后 csproj 不会自动更新，需要 Unity 重新生成——结果仅供快速参考，**最终以 Unity 编译为准**。

### C. 编辑器已打开：通过 Unity CLI / MCP 读取 Console
让 Agent 触发刷新/编译并读取编辑器 Console 错误（官方插件 / 社区 MCP 都支持）。

### D. Unity 批处理模式（分钟级，编辑器**必须关闭**该项目）
```bash
"$UNITY_EDITOR" -batchmode -nographics -quit \
  -projectPath "$PROJECT_PATH" -logFile - 2>&1 | tee Logs/batch-compile.log
```
封装脚本见 [`unity-compile-check`](../templates/unity/.claude/skills/unity-compile-check/)。

## 4. 测试

```bash
# EditMode（注意：-runTests 时不要加 -quit）
"$UNITY_EDITOR" -batchmode -nographics -projectPath "$PROJECT_PATH" \
  -runTests -testPlatform EditMode \
  -testResults "$PROJECT_PATH/Logs/editmode-results.xml" \
  -testFilter "MyGame.Combat" -logFile -
```

- 结果是 NUnit XML，可让 Agent 解析失败用例。封装见 [`unity-run-tests`](../templates/unity/.claude/skills/unity-run-tests/)。
- **为可测试性设计**：业务逻辑放纯 C# 类（不继承 MonoBehaviour），MonoBehaviour 只做胶水层——AI 写测试和改逻辑都会容易得多。
- 编辑器开着时，用 MCP/Unity CLI 运行 Test Runner 更快。

## 5. 日志位置（给 Agent 查错）

| 平台 | Editor.log |
|---|---|
| Windows | `%LOCALAPPDATA%\Unity\Editor\Editor.log` |
| macOS | `~/Library/Logs/Unity/Editor.log` |
| Linux | `~/.config/unity3d/Editor.log` |

Player 日志在 `Application.persistentDataPath` 附近（各平台不同）。

## 6. 大仓库 / 版本控制

- **Git + LFS**：二进制资源（贴图、模型、音频）走 LFS；Agent 只关心代码与文本资源。
- **Perforce**：文件默认只读，Agent 编辑会失败。可加 `PreToolUse` Hook 在 Edit/Write 前自动 `p4 edit <file>`。
- **上下文控制**：给每个大模块写子目录 `CLAUDE.md`（如 `Assets/Scripts/Network/CLAUDE.md`），只在进入该模块时加载。
- 并行 Agent 用 worktree 时，每个 worktree 都有独立的 `Library/`（首次导入很慢）——纯代码任务适合并行，编辑器任务串行。

## 7. 代码质量与规范

- `.editorconfig` + [Microsoft.Unity.Analyzers](https://github.com/microsoft/Microsoft.Unity.Analyzers)：Unity 专用 Roslyn 分析器（如不要对 Unity 对象用 `?.`）。
- 把团队约定写进 `CLAUDE.md`：命名、`[SerializeField] private` 优先于 `public` 字段、事件/消息机制、对象池、异步方案（UniTask/Awaitable）等。
- 性能评审 Subagent（模板中的 `unity-perf-auditor`）：检查 `Update` 中的分配、`GetComponent`/`Find` 热路径调用、装箱、LINQ、字符串拼接等。

## 8. 哪些任务适合交给 AI

| 很适合 ✅ | 需要人盯 ⚠️ | 不建议 ❌ |
|---|---|---|
| 纯 C# 逻辑、数据结构、工具类 | 跨模块重构（先出计划） | 手改大场景/Prefab YAML |
| 编辑器扩展、批处理脚本、导入后处理 | Shader / 渲染管线修改 | 平台签名、商店发布配置 |
| 单元测试补齐 | 网络同步、存档格式迁移 | 无测试覆盖的核心战斗手感调参 |
| 配置表解析/代码生成 | 性能优化（需 Profiler 数据佐证） | |
| 日志/崩溃堆栈分析 | UI Toolkit/uGUI 布局（配合截图） | |

## 9. 推荐的一次任务流程

```
1. /clear，开新会话
2. “阅读 Assets/Scripts/Inventory，说明数据流，不要改代码”    ← 探索
3. Shift+Tab 进入 Plan 模式，描述需求与验收标准               ← 计划
4. 审阅计划 → 批准                                            ← 人审
5. Agent 实现，每步 LSP 诊断 + /unity-compile-check            ← 实现
6. /unity-run-tests EditMode                                   ← 验证
7. 编辑器内实机检查（MCP 截图/读 Console，或人工）             ← 验收
8. 让评审 Subagent 过一遍 → 提交                               ← 评审
```
