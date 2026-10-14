主线：三；G1 引擎接入与 G2 客户端／gameplay 的模板契约
改变的建议：[研究] 改造已有 AGENTS／Skill／reviewer 的身份、取消、实例及旧档约定；按项目实际接口分支，不增配置层或强制 MCP
新证据：[一手／研究] WP9–11、Unity 6.3／UE 5.8 契约与有／无 MCP 的静态指令链走查；仅证明文本分支一致，未测 Agent 成功率或真实引擎结果

# WP13：把已证实的边界带进现有游戏模板

核实：2026-10-13 UTC（2026-10-14 UTC+8）。[一手] 为本轮重新读取的官方契约；[研究] 为本地模板对照与采用判断。当前仍是理论阶段，未运行引擎、模型、付费工具或安装插件。

## 1. 改哪里，为什么不加 Hook

**[研究] 采用现有 AGENTS、按需 Skill 和代码 reviewer，改造其中错误或缺失的具体契约，不新建配置层。** 路径保护 Hook 不能证明 Sprite 是否仍代表原动作、取消后是否串线、旧档奖励是否正确；把这些判断变成更多路径拦截只会给出错误安全感。因此本轮不改脚本、settings、MCP 配置或 Hook，也不迁移异步框架。

| 现有位置 | 对照发现 | 采取的窄修改 |
|---|---|---|
| Unity safe-edit | “GUID 保持不变则引用不丢”过强；无二次导入语义检查 | 回读脚本绑定/数据；Sprite 子身份、Prefab 名称匹配、pivot 和运行时加载键分别验证；停止歧义自动替换 |
| Unity AGENTS | “异步统一一种”会抹平 Coroutine/Awaitable/Task 契约 | 保留现有边界及版本；唯一句柄所有者、预取消、旧请求收尾；禁重复 await 池化 Awaitable |
| Unreal AGENTS | 返回不明确直接当失败，容易在已部分修改后重试 | 停写并回读；success 之后仍验证目标与引用；明确重导入覆盖/保留字段 |
| 两端 AGENTS | 只有代码风格，没有定义/实例、结算、旧档所有者 | 填现有实现与夹具位置；只改涉及系统，允许删去无关项；不新增状态机/GAS/存档框架 |
| 两端 code-reviewer | 取消仅检查对象销毁，存档/实例边界缺失 | 检查重复结算、池复用旧目标、失败覆盖唯一档、内容迁移；Unity 加 Disable 同步取消回调 |
| UE code-reviewer | 同步加载/硬引用一律要求改软引用 | 以实际帧时间问题与驻留需求为依据，小型常驻资源不自动判错 |

初次 WP13 改五文件；当时以 CLAUDE 已导入 AGENTS 为由未同步其具体指令，F1 已纠正该遗漏，见 §4。导入细节归 Unity safe-edit／UE AGENTS；版本由项目填写，不要求升级到研究快照。[研究]

## 2. 证据和反证

### 本轮重新读的一手来源

- [Unity 6.3 SaveAsPrefabAsset](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/PrefabUtility.SaveAsPrefabAsset.html)：覆盖时按 GameObject 名称匹配；同名对象或同类型多组件不可预测。StartAssetEditing 批次中即使保存成功也可返回 null。本轮将“查 success/日志，导入后回读，不盲建副本”写进 safe-edit。[一手]
- [Unity 6.3 Awaitable introduction](https://docs.unity3d.com/6000.3/Documentation/Manual/async-awaitable-introduction.html)：Awaitable 池化，不能重复等待同一实例；它不应按可共享 Task 的约定重写。模板统一所有权，不统一底层 API 语义。[一手＋研究]
- [UE 5.8 FStreamableHandle](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/FStreamableHandle)：除 CancelHandle/ReleaseHandle 区别外，本轮补读到 GetLoadedCount 把失败资产也计为 loaded；HasLoadCompleted 可以早于延迟完成回调，失败资产仍为 null。因此 UE 模板另要求核结果资产齐全，完成标志和计数不是成功证明。[一手＋研究]

### 延用已完成研究，不能冒充本轮实测

- [WP9](2026-10-14-game-wp9-engine-handoff.md)：官方 Sprite Smart 空间匹配、Interchange 覆盖策略、Coplay 移动返回边界支持“源身份/目标身份/语义分别检查”。并非所有同名导入都会失败，不禁用成熟 importer；无法唯一映射时才停止自动替换。[研究]
- [WP10](2026-10-14-game-wp10-client-modules.md)：固定 UniTask 取消/池复用路径、UE-207209、Input System Disable 重入、旧档语义支持新增的生命周期判断。业务 generation guard 不能修复库内错结果；官方 issue 的目标修复版不代表已发布修复。模板不全面禁用 UniTask，不把平台所有版本判为有缺陷。[研究]
- [WP11](2026-10-14-game-wp11-gameplay-architecture.md)：定义/实例、GAS Commit/End、事件重复提交、旧档 ID 支持具体状态契约；同一份定义生成两个实例，只改一个，不应污染另一个。这里只借边界，不搬整个 Chop Chop/Lyra 或自建技能框架。[研究]

## 3. 验证范围和撤回条件

[研究] 文本契约只能减少上下文歧义。下一阶段应在目标项目做“重生成且重排子资产”和“蓄力可打断且检查点重开”的第二次修改，观察真实引用、取消结果身份、每次获取释放、两实例隔离、旧档进度/奖励。若重复已有项目约定，则删去重复模板项并指向已有实现；适配器版本修复经目标引擎验证后，可简化相应警示。没有 Agent 对照运行，不主张成功率、性能或工时改善。

- 历史初稿：五文件对照和三页官方契约；待项目决定退款／暂停时钟、旧档回退、玩法和设备
- 历史检查：完整离线 14 阶段（非空无 skip）、`git diff --check`、新增页 UTF-8／空白通过；当时 AGENTS 为 86／82 行，不代表当前文件规模
- 无 Agent 对照或引擎实测，不能量化采用收益

## 4. F1 复核：入口必须按已配置能力分支

核实：2026-10-14 UTC。逐项重读 `e08dcbc` 的两端 CLAUDE、AGENTS、模板说明，以及编译/测试 Skill 和脚本实现；没有把评审意见当作事实来源。[研究]

### 新证据与修订范围

- [原 UE CLAUDE](https://github.com/dbvv1/a1dbv/blob/e08dcbc25ec2896a5faa9157e20b715381e47d7b/domains/game-dev/unreal/templates/CLAUDE.md#L7-L10)无条件要求 `unreal-mcp`、`AgentSkillToolset.ListSkills` 和 MCP Live Coding，与模板 README 中“可选接入、复制不会安装”直接冲突。`@AGENTS.md` 导入不会删除这些具体指令。[一手：仓库原文；研究：指令冲突]
- 原 Unity CLAUDE 将三个 Skill、Unity CLI 运行时观测列为固定操作，文档查询举例也未给插件缺失时的分支；两端 AGENTS 命令表没有区分“示例文件存在”与“项目真实可用”。已改为先确认现有入口，已采用的 Skill 才使用；缺 Skill 沿用项目命令，缺验证结果仍报告未验证。[一手：本地前后文本；研究]
- 顺着 UE 编译调用链发现既有 [ue-build Skill](../../domains/game-dev/unreal/templates/.claude/skills/ue-build/SKILL.md)也在函数体分支无条件要求 MCP。因此同步补该文档的前提与无 MCP 分支；否则只改顶层仍会重新读到冲突指令。`build.sh` 的退出码 3 提示仍含 MCP 名称，Skill 明确它不是能力探测或安装要求，没有相应入口就请用户关闭编辑器后走既有完整构建。[一手：脚本/Skill 对照；研究]
- 重新读取 [Epic Live Coding 官方说明](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-live-coding-to-recompile-unreal-engine-applications-at-runtime)：引擎/IDE 自身即有调用入口，并非依赖 MCP。本文保留更保守的项目边界：只有函数体改动且现有入口可用时才用 Live Coding；头文件、反射、新类/模块仍关闭编辑器后完整构建，不把官方对象重实例能力当作放宽模板边界的理由。[一手＋经验]

本次改动是 Unity README、两端 CLAUDE/AGENTS、既有 ue-build Skill 六个文档，以及本记录与 [WP9 §7](2026-10-14-game-wp9-engine-handoff.md#7-f1-复核把接口选择落实到-unity-入口)的复核追加。没有修改脚本、权限配置、Hook、MCP 配置或安装流程。[研究]

### 两种配置的只读走查

假设修改任务分别需要代码编译/逻辑测试和资产操作；只读取文件、跟随条件分支，不调用任何引擎接口。模板使用者须填入现有项目命令，以下并非对空 TODO 可执行性的承诺。[研究]

| 引擎与已有配置 | 编译与测试分支 | 资产与运行时验证分支 | 判定 |
|---|---|---|---|
| Unity：已接入 MCP；不假定同时有 CLI | 用实际暴露的编译/Test Runner 工具或已有脚本；`--editor` 仅在 CLI/Pipeline 确实可用时选；测试脚本不用于已打开同项目的编辑器 | 用既有 MCP/Editor API 并回读；没有 CLI 时用已有状态进度/测试证据，不强行调用 `unity status` | 指令链一致，不为 MCP 场景另装 CLI/LSP |
| Unity：仅已有 Editor 脚本、编译/测试入口 | 沿用项目命令；已采用模板时，`.sln` + dotnet 仅作快检，编辑器关闭后可通过现有引擎走 batchmode；编辑器开着且无可调用入口时请用户关闭后再验证 | 用已有 Editor 脚本；缺安全资产入口停写，缺运行时观测标未验证；不通过 YAML 或新安装绕过 | 能做部分继续；必要操作缺失是明确阻塞，不被解释为必须安装 MCP |
| Unreal：已接入 MCP；不假定所有 toolset 存在 | 函数体 + 现有支持 Live Coding 的入口才用；缺该工具时走已有 UBT，必要时请用户关闭编辑器；头文件/反射仍完整构建 | MCP 使用实际签名并串行、存盘、回读；`ListSkills` 仅暴露时调用，不以缺该工具阻塞其他现有能力 | MCP 存在不再推出 ListSkills/Live Coding 必然存在 |
| Unreal：仅已有 Editor Python、UBT/测试入口 | 跳过 MCP、ListSkills；用已有构建/Automation 入口；已采用 ue-build 的退出码 3 分支也可走关闭编辑器后的完整构建 | 已有 Editor Python 保持相同资产禁区、存盘和回读要求；没有运行时接口就用已有测试并报告观测缺口 | 无 MCP 分支完整，不要求安装官方插件或新工具集 |

反向检查：两端仍要求代码编译与逻辑测试；Unity `.meta`/序列化资产和 UE 二进制资产禁区未因接口缺失放宽；配置、依赖和受保护操作仍须确认。原试玩接口段改为只填写现有工具，没有接口可删除占位节而不要求新建框架。沿用现有 reviewer 可选策略，不把本次修订扩成配置层。[研究]

[研究] 历史 F1 检查：完整离线 14 阶段，测试 97／26／10／13／14 项、非空无 skip，`git diff --check` 通过。仅确认所走查静态分支一致，不证明引擎／原生 OS 行为或全部来源已补核。
