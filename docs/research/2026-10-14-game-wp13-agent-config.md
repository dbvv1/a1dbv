主线：G1 引擎接入与 G2 客户端/gameplay；主线三“第二次修改仍可靠”
改变的建议：修正已有 Agent 模板中的身份保证、异步统一和失败重试假设，补入具体所有者/实例/旧档契约
新证据：现有模板逐项对照 WP9–11；复核 Unity 6.3 API，补读 UE 5.8 FStreamableHandle 的失败项计数/完成语义

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

以上五个已有文件是本轮全部模板修改；CLAUDE 已导入 AGENTS，不复制一份规则。Unity 详细导入检查放既有 safe-edit，UE 没有同等 Skill，因此在既有 AGENTS 放一条具体导入约定。关键版本由项目填写，不把当前主干快照写成每个项目必须升级的版本。[研究]

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

- 已完成：本地五文件对照、官方三页契约复核；保留其他并行工作，不改用户锚点或共享状态页
- 未运行：真实 Unity/Unreal、上游测试、模型 A/B、性能测量；没有采用收益数据
- 待人工决定：取消退款/暂停时钟、旧档可接受回退、目标玩法和设备；模板保留项目填写位置，不替人作决定
- 离线检查已通过：`python3 scripts/check_offline.py` 全部 14 阶段，测试非空且无 skip；`git diff --check` 与新增研究页 UTF-8/尾随空白检查通过。检查针对当时共享工作树，模板 AGENTS 分别 86/82 行；离线通过仅覆盖仓库文档/配置和既有模拟夹具，最终整合提交仍需复核
