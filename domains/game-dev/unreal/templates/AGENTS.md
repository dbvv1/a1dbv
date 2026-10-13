# AGENTS.md

<!-- 跨工具通用的项目指令。Claude Code 通过 CLAUDE.md 中的 @AGENTS.md 导入；Codex、Cursor、Copilot 等直接读取本文件。
     原则：只写 Agent 猜不到、猜错代价大的内容。保持精简（建议 < 200 行），细节放 docs/ 并引用。
     UE 的命名前缀和反射宏由 UHT 强制检查，不要写在这里（避免“Lint 泄漏”）。 -->

## 项目概况

- 项目：TODO（游戏名 / 类型 / 目标平台）
- 引擎：TODO（如 UE 5.8.1 启动器版 / 源码版；源码版写明引擎目录）
- 版本控制：TODO（Perforce / Git + LFS）
- 关键插件及锁定版本：TODO（仅列已采用插件，不为本模板新增 GAS、StateTree 或 Mass）

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
3. 通过 MCP 做批量修改前后都要存盘；结果不明确时停止后续写入，先回读实际资产状态，不假设完全未修改后盲目重试。明确 success 也须回读目标及引用。
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

<!-- 让 Agent 不靠截图就能验证运行时行为（见 domains/game-dev/02-verification-and-playtesting.md）。
     推荐写成测试工具集（Python 或 C++ AICallable），通过 Unreal MCP 调用；开发版打包后也可以托管 MCP。 -->

| 目的 | 工具 / 命令 |
|---|---|
| 导出当前游戏状态 | TODO（如 `MyGameTestTools.get_game_state`） |
| 注入玩家动作 | TODO（如 `MyGameTestTools.perform_action`） |
| 加载测试场景 | TODO（如 `MyGameTestTools.load_scenario`） |

每完成一项玩法功能：用上面的接口验证正常路径和至少两个异常场景，再做下一项。手感、乐趣、美术效果留给人工试玩，在总结里列出需要人看的点。

## 本项目的状态与资源契约

<!-- 只填写本次修改涉及的现有实现/测试位置；没有相应系统就删去，不要求新建框架。 -->

- 重导入目标与 pipeline：TODO（已有对象路径、源身份、要覆盖/保留的属性）。重生成应更新已有资产，不以新增 `_1` 或相同名字代替；Interchange 覆盖策略须明确，回读材质槽、Blueprint 使用点与软引用/Primary Asset ID，语义对应不唯一时停止自动替换。
- 加载所有者及退出入口：TODO。按目标版本区分 FStreamableHandle 的 CancelHandle 与 ReleaseHandle；回调核当前请求、对象寿命及结果资产是否齐全，业务结果至多接收一次；HasLoadCompleted/加载计数包含失败项，不能当作成功。测同帧完成/交叉取消；不能只凭 CancelHandle 已返回就接受迟到结果。
- 定义与实例：TODO（DataAsset/DataTable、Session/角色/施放实例的类型）。共享定义/CDO 不存当前 HP、冷却或目标；正常结束、取消、死亡、卸载和池回收清理计时器、委托、任务与命中窗口。计时器的暂停时钟：TODO。
- 伤害/奖励唯一提交入口：TODO；Montage 晚事件不能重复结算。已用 GAS 时明确 CommitAbility 的费用/冷却、取消退款政策与 EndAbility 路径，Per-Actor 实例下次激活不能带上次目标。
- SaveGame 类型、旧档夹具与兼容政策：TODO。保存稳定内容 ID、schemaVersion/contentVersion 和一致快照；内容改名需迁移，不把 UObject 引用或数组序号当持久身份；写入失败保留原档，旧档恢复后进度和奖励须正确。

## 提交约定

- TODO（如 Conventional Commits；Perforce 的 changelist 描述格式）
- 提交前：编译通过 + 相关测试通过；不要提交 `Binaries/`、`Intermediate/`、`Saved/`、`DerivedDataCache/`。
