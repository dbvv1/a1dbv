# AGENTS.md

<!-- 跨工具通用的项目指令。Claude Code 通过 CLAUDE.md 中的 @AGENTS.md 导入；Codex、Cursor、Copilot 等直接读取本文件。
     原则：只写 Agent 猜不到、猜错代价大的内容。保持精简（建议 < 200 行），细节放 docs/ 并引用。 -->

## 项目概况

- 项目：TODO（游戏名 / 类型 / 目标平台）
- Unity 版本：TODO（见 `ProjectSettings/ProjectVersion.txt`）
- 渲染管线：TODO（URP / HDRP / Built-in）
- 关键包及锁定版本：TODO（Input System、Addressables、UniTask 等；不为本模板新增依赖）

## 已配置接口与验证入口

- 编辑器接口：TODO（现有 Editor 脚本 / Unity CLI + Pipeline / MCP 的名称、版本与能力；没有就写无）。先核对项目配置与实际可用工具，不因本模板出现命令就假定已安装。
- 编译与测试入口：TODO（项目已有命令、报告位置和编辑器开关前提）。已有入口足够就沿用；下表只保留已采用的样例，未复制或不可用的脚本改为项目真实命令。
- 缺少必要能力时，报告当前任务、缺少的操作/观测和已完成部分；不自行安装 MCP、LSP、插件或新框架，也不降低资产与权限边界。缺验证入口不等于验证通过。

## 目录结构

<!-- 只保留非标准的部分：Agent 需要知道代码放在哪、哪些目录不能碰。不要写完整的目录树。 -->

```
Assets/
  _Project/            # TODO：本项目代码与资源根目录
    Scripts/
      Runtime/         # 运行时代码（按模块分 asmdef）
      Editor/          # 编辑器扩展
      Tests/           # EditMode / PlayMode 测试
  _Generated/          # AI 生成的占位资源（需记录来源）
  Plugins/             # 第三方，只读
Packages/manifest.json # 包依赖（改动需确认）
```

TODO：列出主要模块（asmdef）及依赖方向，例如 `Core ← Gameplay ← UI`，禁止反向引用。

## 常用命令

| 目的 | 适用前提 | 命令样例 |
|---|---|---|
| 编辑器已打开时编译 | 已采用该脚本，Unity 6+ 且 CLI/Pipeline 可用 | `.claude/skills/unity-compile-check/scripts/compile_check.sh --editor` |
| 快速编译检查 | 已采用该脚本，已有 `.sln` 和 dotnet；不代替最终 Unity 编译 | `.claude/skills/unity-compile-check/scripts/compile_check.sh --dotnet` |
| 完整编译 | 已采用该脚本，引擎可定位，编辑器已关闭；无 CLI 可直接用已有编辑器 | `.claude/skills/unity-compile-check/scripts/compile_check.sh --batch` |
| EditMode 测试 | 已采用该脚本，python3 和引擎可用，编辑器已关闭 | `.claude/skills/unity-run-tests/scripts/run_tests.sh EditMode [过滤条件]` |
| PlayMode 测试 | 同上；此脚本不用于已打开同项目的编辑器 | `.claude/skills/unity-run-tests/scripts/run_tests.sh PlayMode [过滤条件]` |
| 只跑受改动影响的测试 | 已有 Unity CLI，支持该命令，且比较基线存在 | `unity test . --affected --since origin/main` |

编辑器开着但没有可用 CLI 时，使用已配置 MCP 或 Editor 脚本的编译/Test Runner 入口；均没有时先报告缺口，请用户关闭编辑器后沿用 batchmode。不要对同一工程另启 batchmode，也不要把“已有 MCP”当作上述 CLI 命令可用。

## 试玩验证接口

<!-- 让 Agent 不靠截图就能验证运行时行为（见 domains/game-dev/02-verification-and-playtesting.md）。
     没有这些接口就删掉本节，沿用现有测试并说明运行时观测缺口，不要求新建接口；
     有了就写清楚真实命令，并要求 Agent 每完成一项功能都用它验证。 -->

| 目的 | 命令 |
|---|---|
| 导出当前游戏状态（JSON） | TODO（如自定义 `[CliCommand]`：`unity command game_state --result-only`） |
| 注入玩家动作 | TODO（如 `unity command game_action --action Jump`） |
| 加载测试场景 | TODO（如 `unity command load_fixture --name boss_phase2`） |
| 控制时间 / 固定随机种子 | TODO |

每完成一项玩法功能：用上面的接口验证正常路径和至少两个异常场景，再做下一项。手感、乐趣、美术效果留给人工试玩，在总结里列出需要人看的点。

## 硬性规则

1. **不要读写** `Library/`、`Temp/`、`obj/`、`Logs/`、`UserSettings/`。
2. **不要删除或手写 `.meta`**；移动/重命名资源时 `.meta` 必须一起移动（`git mv`）。新建 C# 文件让 Unity 生成 `.meta`。
3. **不要手改** `.unity` / `.prefab` / `.asset` 的 YAML，除非只是改简单的数值字段并说明了风险；优先用已配置的编辑器 API（Unity CLI、Unity MCP、编辑器脚本）。接口缺失不是绕过此规则的理由。
4. 修改 `ProjectSettings/`、`Packages/manifest.json`、`Assets/Plugins/` 前先征求同意。
5. 每次修改 C# 后必须通过编译检查；修改逻辑后运行相关测试。

## 代码约定

- 命名和格式由 `.editorconfig` 和 IDE 检查，不在这里重复（避免“Lint 泄漏”）。
- 序列化字段用 `[SerializeField] private`，不暴露 public 字段；字段改名要加 `[FormerlySerializedAs]`，否则场景和 Prefab 里的数据会丢失。
- 不要对 `UnityEngine.Object` 使用 `?.` / `??`（Unity 重载了 null 判定）。如果已经启用了 Microsoft.Unity.Analyzers（UNT0007 / UNT0008 会检查），这一条可以删掉。
- 热路径（`Update`/`FixedUpdate`/`LateUpdate`）禁止：GC 分配、LINQ、`GetComponent`/`Find*`、字符串拼接、装箱。
- 业务逻辑尽量写在纯 C# 类中（便于 EditMode 测试），MonoBehaviour 只做胶水。
- 异步：TODO（沿用项目现有 Coroutine / Awaitable / UniTask / Task 边界与版本）。统一取消与所有权约定，不为统一语法重写所有 API；池化 Awaitable 不得重复 await。
- 注释与文档：TODO（中文/英文）。

## 本项目的状态与资源契约

<!-- 只填写本次修改涉及的现有实现/测试位置；没有相应系统就删去，不要求新建框架。 -->

- 加载所有者及释放入口：TODO。取消消费者等待不等于底层完成或资源释放；创建句柄前处理预取消，创建后由唯一所有者在成功、失败、取消路径收尾，不能自动 release 与 finally 双重释放。旧请求完成只收尾，不写新场景/池对象；高频取消适配器需测 A 取消后 B 复用且 A 先完成的结果身份，业务代次不能证明库内无串线。
- 定义与实例：TODO（定义、Session/角色/一次施放实例的类型）。共享 ScriptableObject 不存当前 HP、冷却或目标；池回收/状态退出显式清理任务、订阅与命中窗口，不只等 Destroy。计时器的暂停时钟：TODO。
- 伤害/奖励唯一提交入口：TODO；动画与事件观察者不得重复结算，取消、死亡、换局后的晚事件失效。暂停先关闭玩法权限，再禁用 Input Action Map，防止同步 canceled 被当成松手攻击。
- 存档类型、旧档夹具与兼容政策：TODO。保存稳定内容 ID、schemaVersion/contentVersion 和一致快照；字段/内容改名需迁移，不以 `[FormerlySerializedAs]` 或同版 roundtrip 代替旧档验证；写入失败保留原档，恢复后进度和奖励须正确。

## 提交约定

- TODO（如 Conventional Commits：`feat(combat): ...`）
- 提交前：编译通过 + 相关测试通过；不要提交生成物和本地设置。
