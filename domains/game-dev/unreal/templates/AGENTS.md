# AGENTS.md

<!-- 跨工具通用的项目指令。Claude Code 通过 CLAUDE.md 中的 @AGENTS.md 导入；Codex、Cursor、Copilot 等直接读取本文件。
     原则：只写 Agent 猜不到、猜错代价大的内容。保持精简（建议 < 200 行），细节放 docs/ 并引用。
     UE 的命名前缀和反射宏由 UHT 强制检查，不要写在这里（避免“Lint 泄漏”）。 -->

## 项目概况

- 项目：TODO（游戏名 / 类型 / 目标平台）
- 引擎：TODO（如 UE 5.8.1 启动器版 / 源码版；源码版写明引擎目录）
- 版本控制：TODO（Perforce / Git + LFS）
- 关键插件：TODO（GAS、Enhanced Input、CommonUI、StateTree、Mass…）

## 模块与依赖

<!-- 不要写完整目录树。只写模块边界和依赖方向。 -->

TODO：列出主要模块（`.Build.cs`）及依赖方向，例如 `MyGameCore ← MyGameCombat ← MyGameUI`，禁止反向依赖。

## 引擎 API 的真相来源

- 引擎头文件位置：TODO（启动器版：`<引擎目录>/Engine/Source/`；源码版：`../UnrealEngine/Engine/Source/`）
- **不确定某个 API 的签名、是否已废弃时，先 grep 引擎头文件，不要凭记忆写。** UE 的 API 在版本之间变化很大。

## 常用命令

| 目的 | 命令 |
|---|---|
| 编辑器开着、只改了 `.cpp` 函数体 | Unreal MCP：`LiveCodingToolset.CompileLiveCoding` |
| 命令行编译（编辑器需关闭，或已关闭 Live Coding） | `.claude/skills/ue-build/scripts/build.sh` |
| 编译游戏本体 | `.claude/skills/ue-build/scripts/build.sh <项目名> Development` |
| 自动化测试 | `.claude/skills/ue-run-tests/scripts/run_tests.sh <项目名>.<模块>` |
| 查看可用测试 | `UnrealEditor-Cmd <项目>.uproject -ExecCmds="Automation List;Quit" -unattended -NullRHI` |

## 硬性规则

1. **不要读写** `Binaries/`、`Intermediate/`、`DerivedDataCache/`、`Saved/`（`Saved/Logs/` 可以读）。
2. **`.uasset` / `.umap` 是二进制文件，绝不能用文本工具编辑。** 修改资产、关卡、蓝图一律通过 Unreal MCP 或 Editor Python。
3. 通过 MCP 做批量修改前后都要存盘；工具返回的不是明确的成功，就当作失败处理。
4. 改了头文件、`UPROPERTY` / `UFUNCTION`、新增类或模块：**不要用 Live Coding**，请我关闭编辑器后用命令行完整编译。
5. 修改 `Config/*.ini`、`.uproject`、`.uplugin`、`*.Target.cs`、`.Build.cs` 的依赖前先征求同意。
6. 每次改 C++ 后必须编译通过；改了逻辑要运行相关测试。

## 代码约定（只写 UHT 和编译器不会替你检查的）

- 指向 `UObject` 的成员一律加 `UPROPERTY()`（配合 `TObjectPtr`），否则会被 GC 回收。
- `UObject` 用 `NewObject` / `CreateDefaultSubobject` 创建；构造函数里不访问 World、不调用会触发游戏逻辑的函数。
- 判空用 `IsValid()`。
- 新 Actor 和 Component 默认关闭 Tick（`PrimaryActorTick.bCanEverTick = false`），确实需要时再打开。
- 网络同步：`Replicated` 属性必须在 `GetLifetimeReplicatedProps` 中注册；Server RPC 必须校验输入。
- 头文件：前向声明优先，`.generated.h` 必须是最后一个 include。
- **逻辑写在 C++ 里**，蓝图只做内容组装和数据配置；需要给设计师的扩展点用 `BlueprintImplementableEvent` / `BlueprintNativeEvent`。
- 数据用 DataTable（CSV / JSON 源文件放在 `TODO` 目录）和 Data Asset。
- 测试：Automation Spec，测试名以项目名开头（`MyGame.Combat.Damage`）。

## 试玩验证接口

<!-- 让 Agent 不靠截图就能验证运行时行为（见 domains/game-dev/03-verification-and-playtesting.md）。
     推荐写成测试工具集（Python 或 C++ AICallable），通过 Unreal MCP 调用；开发版打包后也可以托管 MCP。 -->

| 目的 | 工具 / 命令 |
|---|---|
| 导出当前游戏状态 | TODO（如 `MyGameTestTools.get_game_state`） |
| 注入玩家动作 | TODO（如 `MyGameTestTools.perform_action`） |
| 加载测试场景 | TODO（如 `MyGameTestTools.load_scenario`） |

每完成一项玩法功能：用上面的接口验证正常路径和至少两个异常场景，再做下一项。手感、乐趣、美术效果留给人工试玩，在总结里列出需要人看的点。

## 提交约定

- TODO（如 Conventional Commits；Perforce 的 changelist 描述格式）
- 提交前：编译通过 + 相关测试通过；不要提交 `Binaries/`、`Intermediate/`、`Saved/`、`DerivedDataCache/`。
