主线：一／二／三／四；玩法反馈、额外能力、第二次修改与可维护交付
改变的建议：[研究] 默认组件＋窄规则＋局部状态机，按真实复杂度升级。先定状态所有者、时钟、退出与输入边界；相机先定信息与控制目标，关卡、成长、教学与辅助按玩家决策取舍。物品区分可互换性，任务区分历史与当前条件；功能通过仍须核体验；群体叠招先分攻击许可、站位与单体冷却；蓄力按输入识别、技能计量与释放选择；回放按影子展示、原因复演与倒带续玩选择记录内容；本地多人按独立活动与双方可读性选共享／分屏
新证据：[一手／社区] 固定源码、官方契约、历史修复／评审及开发者复盘，来源、版本和日期见各节；含Factorio撤销二改、Wesnoth受限撤销、OpenMW／Luanti物品路径、Overgrowth玩家单例及PixelWheels视图反证／BG3楼层修复。[研究] 另有确定性算术反例，未作游戏、引擎、模型或玩家对照

# WP11：单人独立游戏的 gameplay 架构取舍

证据核实：原记录2026-10-13—14 UTC，后续日期见各节。除确定性算术复核外，均为公开资料／源码研究，未运行引擎、游戏、模型、玩家实验或上游测试，未安装／购买插件；所有验收计划均未执行。源码与文档检查不证明性能、工时、体验或AI收益；“AI风险”是契约推导，固定主干不等于发行包。各节保留特有缺口与历史验证范围。本文只提炼机制，不复制代码／资产；实际复用仍须分别核代码、素材和引擎许可。

05 页历史范围原文：核实：2026-10-16；篇幅编辑：2026-10-17（UTC+8）。本次编辑日期不代替各节证据核实日期。

分册：[战斗与AI](wp11-combat.md) · [镜头与进度](wp11-camera.md)。下列迁出标题保留原锚点，点击标题直达对应小节；未迁出部分继续在本页维护。

## 一、研究结论与适用边界

**[研究] ✅ 默认：Unity现有组件＋纯C#窄规则＋局部状态机；UE现有Gameplay Framework＋ActorComponent＋C++规则。** 先完成玩法需要的开始、暂停／局内菜单、结算、重试并清理旧局；世界是否暂停另定。不因对象／技能／行为数量直接采用ECS、GAS或行为树，也不整套移植Lyra。

**[研究] 按反复变化的复杂度升级：** 层级互斥与打断→HFSM；多目标优先级、共享子树与动态打断→BT／StateTree；组合效果、属性、标签、成本冷却及必要预测→GAS；目标设备的同构CPU热点→局部Jobs/Burst／ECS。收益须覆盖维护成本。

**[研究] 局限：** 架构取舍仍须由同一玩法切片的第二次修改与目标设备构建检验；源码和官方修复只支持机制判断。

## 二、九个模块：做到哪、可省什么、AI 会破坏什么、怎么验

### 1. 游戏循环：把“一局结束”做成真正的生命周期边界

**[研究] 最低完成度**：按需保留Boot／FrontEnd／Loading／Playing／Paused／Results，暂停可为Playing子状态。一个Session／Run拥有本局敌人、临时奖励、计时器、订阅与取消；Settings／存档另属常驻域。下一局创建新session，而非分散重置布尔值。

- **Unity 默认**：一个组合入口装配组件，规则接受明确的 delta/tick；沿已有 Update／FixedUpdate，不替换整个 PlayerLoop。需要物理的运动留在正确时序；UI、相机、菜单是否用不受暂停影响的时间各自声明。
- **UE 对照 [一手]**：GameInstance 跨关卡，GameMode 随关卡而建，Pawn 与控制者分开；不要把世界内 Actor 引用永久塞入 GameInstance 来“保持状态”。[Gameplay Framework](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-framework-in-unreal-engine)
- **可省**：自建引擎循环、跨所有玩法的 GameManager 继承树、单机不需要的服务器会话层；只为快速开始也不必引入 DI 容器。
- **AI 典型风险 [研究]**：第二次加入暂停后，动画停但技能协程／菜单计时仍推进；重开重复订阅，旧一局奖励延迟回调写到新局；失败与胜利同时触发双重结算。
- **将来验证**：同一输入轨迹跑正常结束、失败、暂停时重试、加载中退出，断言每个 session 最多结算一次；旧 session 的事件和回调不能改变新 session；重试若干轮后对象、订阅和任务数回到基线。时钟／物理确定性需真实引擎，纯规则测试不能代替。

### 2. 状态机、行为树与 StateTree：先问什么会打断什么

**[研究] 最低完成度**：状态声明入口、出口、结束、打断优先级与清理。简单敌人用enum／小类；共享地空、眩晕等父规则时再用HFSM；多目标优先级与复用任务确实影响制作时再用行为树。

- **✅ 采用／改造**：UnityHFSM 的状态时序机制适合代码优先的单人项目，但由角色持有独立实例，死亡／场景卸载必须能绕过非关键退出等待；不要复制自己的 HFSM 轮子。
- **🧪 图工作流**：Unity Behavior 1.0.16仅在图资产有收益时试；UE已有Blackboard／BT沿用Observer Aborts，阶段与并发Task为主再评估StateTree，不因新旧替换。[UE BT](https://dev.epicgames.com/documentation/en-us/unreal-engine/behavior-tree-in-unreal-engine---overview)、[StateTree](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-state-tree-in-unreal-engine)
- **真实回退 [一手]**：HFSM 2.2将needsExitTime等改readonly，使依赖运行时修改的用户无法升级（[#71](https://github.com/Inspiaaa/UnityHFSM/issues/71)）；2.3 [94f316f](https://github.com/Inspiaaa/UnityHFSM/commit/94f316fdae5be5abe964f70355bbb697274d38c0)恢复可变，但needsExitTime下次转换求值生效、isGhostState下次进入生效。“清理架构”不得破坏这些契约。
- **近期机制风险 [一手]**：Unity Behavior [1.0.16 changelog](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/changelog/CHANGELOG.html) 增加 OnSetup／OnTeardown，并修复目标不可达时导航持续 Running、运行中黑板位置改变但目的地未更新、动态子图实例／黑板回调问题。1.0.15 才加入特定节点及结构下的 ObserverAbort；不能把所有 BT 的 abort 语义视为一致。
- **可省**：三个简单敌人为其搭可视化节点编辑器；同时维护 HFSM、BT、GOAP 三套决策；每一帧全图扫描；为未出现的内容团队先买大型编辑器。
- **AI 风险 [研究]**：用进入条件冒充持续条件，追击目标消失仍施法；状态退出后异步 MoveTo 继续改速度；等待动画结束永远不退出；共享 Blackboard 上一次目标残留；错误地假定一个 tick 最多一次转换或 StateTree 等所有 Task 完成。
- **将来验证**：死亡／眩晕打断、不可打断窗口结束后的退出，以及不可达、目标销毁、子图替换、禁用再启用的终止／失败。图资产另核升级、枚举改名、Prefab覆盖后的实际运行实例。

### 3. 数据驱动配置：静态定义、活实例、存档不能同一个对象

**[研究] 最低完成度**：定义保存稳定ID、初值和资产引用；实例保存HP、冷却、目标与阶段；存档保存可迁移快照及schemaVersion。沿用SO／DataAsset／DataTable／CSV，校验ID、引用、范围与迁移，不由格式决定架构。

**[一手] Chop Chop [608eac98](https://github.com/UnityTechnologies/open-project-1/tree/608eac98df29cd97821a6115cd52dfb9027345b1)**：TransitionTableSO.GetInitialState为每个StateMachine建createdInstances；StateActionSO.GetAction生成并在图内复用运行StateAction；敌人无HealthSO时CreateInstance。可借配置共享／运行隔离，不必继承SO编辑器。

**[一手] 历史反证 [753c30e](https://github.com/UnityTechnologies/open-project-1/commit/753c30e6fda71c6024c69ee5704b71cfa110e160)**：初始血量移入新建分支，避免Awake重置已有玩家HP；另修UI重置、敌人误发玩家UI事件。同类型寿命不同，不能统一Reset。

- **可省**：“所有整数都 SO”、每项配置热更新、可视化表格后端、通用反射 ORM、自建 mod 语言；没有外部内容作者和热更新需求就用引擎已有序列化。
- **AI 风险 [研究]**：向共享技能定义写冷却；用数组序号当存档 ID；将字段重命名视为纯代码改动而破坏已序列化资产；敌人复制后同时掉血；把静态 readonly 与领域不变量混为一谈。
- **将来验证**：同一定义生成两个角色、只伤害其中一个；先运行再新开局确认定义未污染；固定 v1 存档在 v2 增删／改名内容后加载，必须迁移或可理解地拒绝。对配置修改分开记录“既有实例即时生效、下次生成生效、仅新局生效”，不能由 Agent 猜。

#### 定义二改：能加载不代表旧实例仍匹配

核实：2026-10-17（UTC+8）。

**[研究] 改配方输入或触发方式时，把定义与已保存的实例结构／待执行工作一起核。** 原有 ID、字段、范围校验和生效时点仍需保留；但新定义合法，不代表旧实例能按新规则运行。以下分别是经济生产和延迟效果的历史修订，不证明所有游戏都应统一迁移或清空队列。

**Widelands：选择迁移旧建筑，而非只改配方。** [维护者调查](https://github.com/widelands/widelands/pull/6505#issuecomment-2288505206)指出，旧建筑可以加载，但保留旧输入队列、执行新生产程序，因缺新输入而无法生产；尝试同时接受丝／布又被定义检查拒绝。[最终配方 5fa703b](https://github.com/widelands/widelands/commit/5fa703b75f24fb7d26df0477331b795281298fdb)把工具房的布输入及捕鱼网／弓消耗改为丝；先合入的兼容提交 [1e181e0](https://github.com/widelands/widelands/blob/1e181e07f280bf3fc3848e0b689e132e76a5c26a/src/map_io/map_buildingdata_packet.cc#L820-L930)逐项对照当前输入定义，补空队列、调整容量，并删除废队列／超额货物，向玩家列明损失、提示检查生产程序和设置。两提交均为 2024-12-03 的实际修订；GitHub 的 Codeberg 镜像 PR 状态不代替提交证据。[一手]

**保货不是无代价的默认。** [方案 A／B／C／D](https://github.com/widelands/widelands/pull/6531#issuecomment-2336636672)比较保旧队列、逐步排出、加强排出机制和直接删除；[维护者试过 A／B](https://github.com/widelands/widelands/pull/6531#issuecomment-2346148619)后认为保留已无用途的队列令人困惑，选择 D，货物重要时建议用旧版完成游戏，或先清队列再保存。最终 [#6570 审阅](https://github.com/widelands/widelands/pull/6570#pullrequestreview-2473857742)在 `dda0b74a` 报告测试可用，正文仅称通过最小联机测试；[作者早期测试](https://github.com/widelands/widelands/pull/6505#issuecomment-2299899224)的 `666288c` 则属于保货实验方案，不能当最终 D 的完整回归。官方讨论镜像不计独立来源；兼容提交还收窄了消息包版本范围，不能宣称所有旧档兼容。[一手] **[研究]** 已删除货物不会因退回配方自动恢复，这是代码推论；该项目的游戏内取舍不是一般数据丢弃建议。

**CDDA：保留 ID 也会改变旧工作的含义。** [#77664](https://github.com/CleverRaven/Cataclysm-DDA/pull/77664)（合入 `09d648e4`）把同一 `EOC_Nunez_Travel` 从周期检查改为显式延迟调用，删除旧条件；[旧档玩家](https://github.com/CleverRaven/Cataclysm-DDA/issues/77877)未达前置任务却生成车辆／NPC，[作者确认](https://github.com/CleverRaven/Cataclysm-DDA/issues/77877#issuecomment-2478519116)旧调用仍在队列。修订 [#77879](https://github.com/CleverRaven/Cataclysm-DDA/pull/77879)（`0461e7df`）给新逻辑新 ID，旧 ID 留空定义。后续同类 [e4ea40d](https://github.com/CleverRaven/Cataclysm-DDA/commit/e4ea40d224dcfdaef2d5fc480f921f9ab77f8e80)修订下的[源码](https://github.com/CleverRaven/Cataclysm-DDA/blob/e4ea40d224dcfdaef2d5fc480f921f9ab77f8e80/src/effect_on_condition.cpp#L77-L90)将无周期的定义默认为 ACTIVATION；加载更新保留有效 ID 的队列，到期执行后[消费非周期项](https://github.com/CleverRaven/Cataclysm-DDA/blob/e4ea40d224dcfdaef2d5fc480f921f9ab77f8e80/src/effect_on_condition.cpp#L164-L264)。因此是隔离旧副作用、到期消费，不是加载时清空。[一手／研究]

[#78141](https://github.com/CleverRaven/Cataclysm-DDA/issues/78141)还指出：按新定义没有周期就清除队列，会误删合法一次性延迟调用；新加来源标记只能保护以后保存的记录，不能补回旧档缺失信息。该问题被标 stale 关闭，不是通用修复完成；前述退役也可能取消旧 ID 下合法的待执行动作。#77879 作者测试针对简化效果的地图旋转，未找到玩家修后回执，不写完整迁移回归通过。[一手／研究]

**[研究] 二改验收预注册**：用已有资源队列／待执行动作的旧档，加载后继续生产／执行，再保存重载；核新旧实例输入与副作用一致、合法延迟动作未被误删、迁移未重复执行。若无法可靠辨识旧记录来源，比较保留旧解释、定向迁移、明确退役或限制升级；先说明损失及恢复所需旧档／旧版，不默认新增兼容框架。本仓仅核公开源码与回执，未运行这些游戏或上游测试。

### 4. 组件、Jobs/Burst、ECS：先用数据规模和预算选，不用对象数口号选

[研究] 本小节 Jobs/Burst、Entities、ECB、enableable、authoring／烘焙的具体机制属于 Unity；UE 仅共用先定位成本再迁移热点的原则，不据此建立跨引擎 API 等价关系。

**[研究] 默认采用**：组件接引擎对象，纯函数／普通类承载规则。先定位动画、绘制、碰撞、寻路或CPU成本；ECS不解决GPU overdraw等异类热点，单个批处理也可只用Jobs/Burst。

**[一手] [Entities samples 6786a741](https://github.com/Unity-Technologies/EntityComponentSystemSamples/tree/6786a741ee1f118ed14cecfa02beae8e926937b0)** README指Unity 6.2／Entities 1.4；实际`13. StateChange/SetStateSystem.cs`比较VALUE、STRUCTURAL_CHANGE、ENABLEABLE_COMPONENT并带profiler。README仍链接14，复查应找实际路径；只借热点小样例。

**[一手] Entities 1.4代价**：[结构变更](https://docs.unity.cn/Packages/com.unity.entities%401.4/manual/optimize-structural-changes.html)会迁移数据并涉及同步；[enableable 1.4.8](https://docs.unity3d.com/Packages/com.unity.entities@1.4/manual/components-enableable-use.html)不改archetype，但写作业可阻塞主线程查询，禁用在普通查询中视同不存在。

- **ECS条件 [研究]**：目标设备上同构CPU计算确已超预算，内容适合baking／数据布局，且能承担混合层、调试与版本适配。先迁热点，不设统一对象数门槛。
- **反证 [一手／研究]**：[Unity 案例](https://unity.com/resources/stunlock-studios-v-rising)证明V Rising生产采用ECS，也说明范式／底座投入；多人开放世界团队成功不证明单人起步全ECS最省。
- **可省**：全工程 ECS、为少量机关加实体世界、过早锁步／回滚；UE 的 Mass 同样不因“将来大地图”默认加入。
- **AI 风险 [研究]**：用 Add/Remove tag 表达每帧变化而制造结构变更；读写依赖遗漏；把 ECB 录制完成当已应用；复用销毁的 Entity；忘记禁用组件过滤；authoring 数据修改却没有重烘焙。
- **将来验证**：同玩法、资产、设备与出生／死亡密度下比较组件、局部Jobs和ECS，测CPU P95/P99、同步、内存、主线程／worker及二改工时。样例强制Complete只属测量设施；结构变更计时只录ECB、playback在后，ENABLEABLE还混用ECB启用与直接禁用，须连后续系统计总成本，不能据局部计时排名。

### 5. 事件：用于传播已发生事实，别把一次命令拆成无人负责的广播

**[研究] 最低完成度**：对象内直接调用；跨边界确需多观察者才用类型化事件。命令有唯一处理者和结果，DamageApplied／EnemyDied等事实提交后再通知。声明同步／排队、顺序、重入和丢弃；SO通道仅在Inspector装配／跨场景有收益时用。

**[一手] Unity 官方例子**强调 OnEnable 订阅／OnDisable 退订并说明 SO event channel 是项目级资产；因此“换场景就自动清干净”不是其承诺。[官方事件通道说明](https://unity.com/how-to/scriptableobjects-event-channels-game-code)

- **可省**：无差别全局 EventBus、字符串消息、自建完整 CQRS／事件溯源、每帧健康轮询和每个属性一个广播。
- **AI 风险 [研究]**：匿名 lambda 退订失败，双重订阅，事件在构造半完成状态发出；伤害／死亡广播造成重入后重复奖励；晚订阅 UI 丢失初始状态；一条事件跨场景带过期对象引用。
- **将来验证**：重复死亡只结算一次；回调内销毁／退订不破坏枚举；池化多轮无重复订阅；晚加入UI从快照取值。跨寿命时按需用sessionId／entityId／operationId拒绝旧事件，局部调用不强制加ID。

### 6. 战斗与技能：先统一结算权，再谈 GAS

**[研究] 最低完成度**：请求→合法性／资源检查→启动与承诺→命中→效果提交→结束／取消，每步唯一权威。动画可触发窗口，VFX不重复扣血；晚事件须随取消、死亡、卸载失效。攻击身份应区分重入／池化，同目标多次命中按玩法定。

- **Unity 最佳性价比 [研究]**：先 Health／Combatant／AbilityRunner 小组件＋不可变 AbilityDefinition＋每次施放的 AbilityExecution；已有成熟角色控制器或技能模块覆盖实际玩法时复用并留适配边界，不从零造全能技能编辑器。
- **UE默认 [研究]**：少量动作先用ActorComponent／Montage／现有输入。重复的属性、叠层、标签、成本冷却、目标或必要预测使统一模型更划算时再用GAS；复杂单机也可适用，不按技能数或联网与否划死门槛。
- **官方代价 [一手]**：GAS 的 CommitAbility 应用费用与冷却；正常结束要显式 EndAbility，否则可能持续阻挡其他动作；Per-Actor 实例跨施放复用，成员需清理。[Gameplay Abilities](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-abilities-in-unreal-engine)
- **Lyra边界 [一手]**：[Abilities in Lyra](https://dev.epicgames.com/documentation/unreal-engine/abilities-in-lyra-in-unreal-engine?lang=en-US)中Pawn依赖possession、PlayerState、Input、Game Feature就绪，PawnExtension满足条件才授能力，失Pawn撤关联能力。跨Pawn ASC服务具体多人生命周期，不默认搬入单机。
- **可省**：几种固定动作先上完整 GameplayTag 分类、全技能网络预测、通用公式 DSL、可组合效果图；也不在 Unity 里为了名字相同去复刻 UE GAS 全栈。
- **AI 风险 [研究]**：Check 后仍可能失效却无提交时检查；费用扣两次；取消技能忘移除标签、移动锁、命中盒和订阅；非实例化默认对象写玩家私有状态；Per-Actor 复用残留上次目标；重生重复授予。
- **将来验证**：施放准备／费用提交／命中／恢复各阶段插入死亡、眩晕、失去目标、场景卸载；断言费用、冷却、效果、伤害和奖励次数；同时攻击与治疗的顺序固定。若有网络再测延迟／丢包／预测回滚；单机切片不替联网通过。

**动作响应与承诺（2026-10-15 UTC+8）。** [研究] 沿技能定义／执行实例与局部状态机，分别定移动转向、阶段出口和再次攻击资格。动画退出不等于退款、重开命中盒或清冷却；本节只补输入识别后的动作许可。

- **历史调整 [一手]**：[Hades 官方历史补丁](https://www.supergiantgames.com/blog/hades-updates/)在2020-10-27改Guan Yu缓冲使连击间可Dash，2020-12-01同时加快Heavy Knuckle并解原地锁。[研究] 支持局部控制权调整，不能拆因果或推出所有武器任意取消、Hades II当前规则。
- **固定机制 [一手]**：Overgrowth [playercontrol.as](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/playercontrol.as#L469-L478)提供移动／跳／蹲／抓／攻击取消意图；[aschar.as](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L9600-L9610)检查动画已设、cancel门槛及延迟再EndAttack；[退出路径](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L6260-L6274)清动画回调并回运动。[研究] 借请求、阶段许可与退出；未核完整曲线，不能推出帧数／退款。代码Apache-2.0，动画美术另属权利人。
- **撤回反例 [一手]**：[Overgrowth 1.2 公告，2018-03-15](https://www.wolfire.com/blog/2018/03/Overgrowth-1-2---Combat-improvements/)取消casual外攻击吸附，缩短高难度肩投距离。[研究] 自动修位会改承诺；第三人称近战与Hades俯视比较不推广格斗帧表／联网竞技。

[研究] **二改预注册**：原生动画层增加重武器／攻速增益，在起手、命中、恢复时请求移动、防御、再攻击，核恢复、次数、费用与已提交效果。缺过渡则缩窄出口或换合规片段；出口若破坏频率、预警或武器差异就撤回。退款／冷却沿原结算规则，不加框架。

**动画释放边界补核（2026-10-16 UTC+8）。** 主线3；改变的建议：动画淡出后失去后续操作，先核现成回调与释放时机，不统一添加定时解锁；新证据：Epic 历史维护复现与 UE 5.8 当前选项契约，Unity 6.3 过渡状态机制对照。

- **已修历史问题 [一手]**：[UE-183351](https://issues.unrealengine.com/issue/UE-183351)的Lyra长淡出中移动打断，监听Completed／Interrupted的EndAbility可能漏触发。WaitDelay仅报告中的workaround；已Fixed、Target Fix 5.3、修复`25328943`，不当当前故障。未下载Lyra／私有引擎源码。
- **当前选择 [一手]**：[UE 5.8 PlayMontageAndWait](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Ability/Tasks/PlayMontageAndWait)区分淡出与播放完成；Allow Interrupt After Blend Out=true才在淡出后给Interrupted，关闭时该阶段打断无Interrupted／Complete，页面不证默认值。Stop When Ability Ends=true使正常结束也停Montage，显式取消总停止。先核选项，不据旧问题加watchdog。
- **释放政策 [研究]**：完整播放才还控制→覆盖淡出中的打断；淡出开始即结束规则→核EndAbility是否截断应保留表现；后面还有Montage／逻辑→只推进或取消当前阶段。清理可共享，取消不得提交成功结果。
- **Unity边界 [一手／研究]**：[Unity 6.3 StateMachineBehaviour](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/StateMachineBehaviour.html)允许current／next／interrupted同时活跃，同步层可多次回调；[OnStateExit](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/StateMachineBehaviour.OnStateExit.html)只是结束评估。旧出口只释自己的占用／窗口，不能撤新动作；局部表现仍用原生回调，不将机制推成当前故障。

**[研究] 二改预注册**：拉长恢复段，在淡出前／中／后打断并立即再出招。按执行身份核锁释放、旧出口不误结束新招、取消无成功结果、剩余动画符合政策；费用／冷却／已提交效果不变。原生配置满足即停止，锁定版本确有缺口才局部补偿并核重入／重开。

### 7. 相机：先复用成熟运行时，验收的是可读性与控制权

**[研究] 最低完成度**：每视口最终输出唯一，跟随／瞄准／过场／菜单有优先级；传送重生按意图处理历史，遮挡、暂停、震动各有政策。Unity先适配版本的Cinemachine，UE先CameraComponent／SpringArm／PlayerCameraManager；简单玩法保留固定镜头。

**[一手] Cinemachine修订**：[45728f30](https://github.com/Unity-Technologies/com.unity.cinemachine/tree/45728f3030787076f32930101d11d9ca96fe3a0f) Brain分Smart／Fixed／Late；2026-02 fast-enter-play之后，[2026-08 #1122／69b2051](https://github.com/Unity-Technologies/com.unity.cinemachine/commit/69b205115495a374fbba329547ba608cdcfe7847)把static reset提前至SubsystemRegistration并重建CameraUpdated／Activated事件。changelog归3.1.8-pre.2，未证全部已发3.1.x含修复。

- **可省**：自研完整 Cinemachine、每种技能独立控制 Camera transform、对普通固定视角游戏搭通用镜头语言。
- **AI 风险 [研究]**：物理目标在 FixedUpdate 移动而镜头拿不一致时序；传送后追着旧位置平滑；切镜完成的回调却在取消后覆盖新镜头；循环进入 PlayMode 静态监听残留；禁用鼠标控制但最后一帧轴值继续生效。
- **将来验证**：低帧率、不同固定步长、暂停／恢复、传送、重生、过场中取消、窄走廊、快速多次切镜；有时序日志和屏幕轨迹仍要真人判晕动与瞄准手感。相机库修复不是游戏已验证。

### 8. 关卡：先做可重置的遭遇，再做大世界

**[研究] 最低完成度**：关卡定义含稳定levelId、入口、目标、出生表；Encounter拥有所生敌人、触发与一次奖励；存档保存完成事实。目标、出口、回退位置可查，重进不重发奖励。

- **Unity**：场景承载内容，组合入口注入玩家／服务；Additive／Addressables 的释放细节归 WP10，玩法层必须提供退出／取消钩子。UE 先普通 Level；确实需要流式世界后再上相应分区机制。
- **可省**：小房间游戏用 World Partition 级系统、无玩法约束的随机铺图、自建通用关卡编辑器；已有模块化房间足够时优先组合，但仍需按路线与遭遇目标筛选，详见文末关卡组合补研。
- **AI 风险 [研究]**：把 Scene load 完当玩法 ready；门只等某个已销毁敌人的事件而永远不开；检查点保存了运行实例引用；生成顺序改变而让种子不再对应同布局；脚本重建关卡丢稳定 ID。
- **将来验证**：从每个检查点恢复，杀怪后离开再回、完成事件重放、加载失败、出生位置被占、最后敌人离场；验证出口可达、任务可完成、关键资源可取得。程序化地图保留 seed、生成器版本与关键布局数据，只有 seed 不保证版本升级仍兼容。

### 9. AI 第二次修改：交付“契约切片”，不强制再搭一层工具

**[研究] Agent 上下文**：提供相关实现、准确包版本与本地改造、资产／节点引用和既有回归夹具。用一页以内的契约交代：

- 定义不保存当前 HP、目标、冷却；谁创建、复用和清理运行实例
- 字段分别属于项目、存档、session、场景、角色还是一次施放；计时器使用什么时钟
- 谁提交伤害、奖励与库存变化，谁只观察；同步或排队事件按什么顺序处理
- 正常结束、取消、死亡、卸载、池回收各清哪些句柄、标签、任务和订阅；内容 ID 与序列化字段改变时如何迁移、用哪些旧夹具验证

先追清需求涉及的位置再改，不顺手升级依赖或另搭文档平台。

**第二次需求 [研究]**：单段冲刺改成蓄力、受击中断、按承诺扣资源并能检查点重开；同时检验实例、退出、命中幂等、晚动画、相机和关卡。记录改动文件／资产、主动工时与回归失败。

## 三、分档选择：不要把最高复杂度当最高质量

[研究] 分档是同一玩法质量下的总成本判断，不是实测排名；“质量上限”指复杂需求候选，本地／免费不免许可义务。具体采用、升级与可省项见第二节对应模块。

**[研究] 何时撤回／升级**：出现测得的规模瓶颈、反复重复的效果语义、真实内容编辑需求，或第三方版本／许可条件改变时重新选择；不能因为新包发布就重架构。升级必须保住旧内容与旧存档的行为，简单方案失去优势才替换。

## 四、可借用项目与许可：采用单位是机制，不是整个仓库

| 项目／固定版本 | 维护及真实采用证据 | 许可和成本边界 | 采用判断 |
|---|---|---|---|
| UnityHFSM [f8fdc2ef](https://github.com/Inspiaaa/UnityHFSM/tree/f8fdc2efb862522acd26fab6cd940886c84cde37)，默认最后提交 2026-03-23 | [一手] 2.3 changelog、#71 原报告、维护者回应及补丁已读；具体商业游戏采用未核实 | [MIT LICENSE](https://github.com/Inspiaaa/UnityHFSM/blob/f8fdc2efb862522acd26fab6cd940886c84cde37/LICENSE.md)，保留版权和许可；本轮未运行测试 | ✅ 在需要层级时采用；固定版本，先回归退出语义 |
| Chop Chop [608eac98](https://github.com/UnityTechnologies/open-project-1/tree/608eac98df29cd97821a6115cd52dfb9027345b1) | [一手] 官方开源 demo；README 明确 2021-12 停止开发，Unity 2020.3，最后提交 2022-06-26 | 根 [Apache-2.0](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/LICENSE)；具体素材／包仍各核；不复制美术、音频 | ✅ 学实例化／事件生命周期；⛔ 不作为当代默认工程底座 |
| Daggerfall Unity [2343305d](https://github.com/Interkarma/daggerfall-unity/tree/2343305d1d83ccc0de57a81e3b1e61188a997e34)，2026-09-14 | [一手] 已发布完整可玩重制，最近 release [v1.1.1-cve-2025](https://github.com/Interkarma/daggerfall-unity/releases/tag/v1.1.1-cve-2025) 是安全更新；EnemyMotor、README、2024 改动读过 | [MIT](https://github.com/Interkarma/daggerfall-unity/blob/2343305d1d83ccc0de57a81e3b1e61188a997e34/LICENSE) 覆盖项目代码，不给原版 Daggerfall 贴图、模型、音频权利；README 要求外部原版数据 | ✅ 学具体行为演化；⛔ 不移植整个 RPG 或素材当原创商用游戏 |
| Entities Samples [6786a741](https://github.com/Unity-Technologies/EntityComponentSystemSamples/tree/6786a741ee1f118ed14cecfa02beae8e926937b0)，2026-03-06 | [一手] 官方小样例，6.2／1.4 路线；不能当已发行游戏证明 | [UCL](https://github.com/Unity-Technologies/EntityComponentSystemSamples/blob/6786a741ee1f118ed14cecfa02beae8e926937b0/LICENSE.md)，需有效 Unity 许可及通知；不是 MIT，也不许任意跨引擎复制 | 🧪 只借与热点相符的样例；实际性能待测 |
| Cinemachine [45728f30](https://github.com/Unity-Technologies/com.unity.cinemachine/tree/45728f3030787076f32930101d11d9ca96fe3a0f)，2026-09-29 | [一手] 读取 Brain/Core/changelog，历史修复持续可见；未核本项目所需最低稳定修复版 | [UCL](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/LICENSE.md)；与 Unity 引擎许可配套 | ✅ 复用包；不以主干 pre.2 代替已验证发行版 |
| Unity Behavior 1.0.16 | [一手] 官方文档与 2026-05 变更已读；没有读取固定包源码或核实商业游戏采用 | [官方 LICENSE](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/license/LICENSE.html) 指 Unity Terms of Service，不是 UCL/MIT；相应计划和实际包权限安装前核 | 🧪 图工作流有收益才采用，不自动替换 HFSM |
| UE GAS／原生 BT／StateTree | [一手] 本次读取 Epic 5.8 文档；未获取有许可的引擎源码快照 | [UE EULA](https://www.unrealengine.com/en-US/eula/unreal)；引擎与商业发行条款单独适用，源码可见不等于开源 | ✅ 条件适用时复用引擎系统；不把网络机制全塞进单机 |
| Lyra 官方样例 | [一手] 读 Epic 机制文档与 Fab 官方页；没有下载项目，不用来声称固定源码已核查 | [Fab 页](https://www.fab.com/listings/93faede1-4434-47c0-85f1-bf27c0820ad0) 明写 UE-Only，显示 Allows usage with AI: No；具体获得时适用许可及 NoAI 范围必须核实 | ✅ 读公开机制说明；⛔ 不作为默认可交给 Agent 全量输入／跨引擎素材来源 |
| Opsive Behavior Designer Pro（商业对照） | [一手] 官方功能／条件打断文档、2026-10-02 EULA 已读；付费源码及实测未读，AAA 宣传不计质量证据 | 官网显示 Personal $145/seat 一次性、Professional $399/year；自定义 EULA，营收／融资及命名席位限制；税费、实际 SKU／资格未核 | 👀 有持续图编写和配套任务收益才评估；不能当免费或无条件买断源码；本轮不购买 |

**[一手] UCL 注意**：[现行 UCL 1.4](https://unity.com/legal/licenses/unity-companion-license) 要求与有效 Unity Engine License 下创作／发行有关，保留通知，第三方组件另循条款；不能因软件免费即忽略引擎条件。

**[一手／研究] NoAI**：[Epic Content License §5(c)(viii)、§17](https://www.unrealengine.com/eula/content)对适用NoAI Content限制生成式AI数据集、开发与输入。Fab标签未证明每个Lyra代码文件同许可，也不禁止所有UE开发用AI。接入须保存具体授权链，不以非官方镜像绕过。

**[一手／研究] Opsive持续成本**：[10-02 EULA](https://opsive.com/solutions/decision-solution/behavior-designer-pro/eula/)区分编辑操作者／编译游戏用户，按收入融资设订阅门槛；到期须停用删源码，只留已取得对象码。[购买页](https://opsive.com/assets/behavior-designer-pro/)与合同的席位／阈值差异见阶段F表；离线维护、融资与源码持续权进入总成本。未接受或付款。

## 五、两个成熟项目能反证什么，不能反证什么

### Daggerfall Unity：已发布复杂游戏也不等于全图／全 ECS

**[一手]** EnemyMotor 是 MonoBehaviour，FixedUpdate 以明确顺序处理麻痹、击退、重力、不能行动、撞门、计时器、行动与跌落伤害，其他感知／攻击组件分工；并不是“一个统一黑板图自动管理全部”。[固定 EnemyMotor](https://github.com/Interkarma/daggerfall-unity/blob/2343305d1d83ccc0de57a81e3b1e61188a997e34/Assets/Scripts/Game/EnemyMotor.cs)

**[一手]** [0519cee（2024-01-08）](https://github.com/Interkarma/daggerfall-unity/commit/0519cee99740d4005ef70b99a3a064ac0655ce72) 为 mod 提供具体行为 delegate；后续仍在具体重力／地面位置逻辑上修正。扩展点随真实需求出现，不必在第一天重写通用框架。该源码也有庞大类、全局访问和历史兼容负担，不能反推“大类就是最佳实践”或无需状态契约。

**[研究] 对单人的启发**：优先保证一个清晰、有测试的决策和结算顺序，再为真实重复需求抽象；不要为了“专业架构”把每个函数拆成一层抽象。复刻既有游戏的范围与原创项目不同，项目成功不能证明当前 Agent 能独立从零做同规模游戏。

### Chop Chop：可借结构，但历史 demo 的特例不能升格为通用规则

**[一手]** Damageable死亡即重设数值但保留IsDead，Revive另处理；CameraManager存场景外anchor，角色重建后重绑Follow／LookAt，禁输入清轴值。属于该游戏流程，不能直接套给可查尸体HP、多玩家或对象池。

**[研究] 采用单位**：定义与实例的区分、订阅成对释放、角色重生通知相机这些机制值得采用；项目版本、整个事件网络、内容资产、UI 与任务框架不用一起继承。没有经过第二次需求修改的“模板已跑起来”，不足以成为发布底座选型结论。

## 六、固定源码的核查入口（复查入口）

均为 [一手]，日期为本次读取默认分支最新提交的作者日期，不保证持续维护。

- HFSM：`f8fdc2efb862522acd26fab6cd940886c84cde37`；`src/Base/StateBase.cs`、`src/StateMachine/StateMachine.cs`、`Changelog.md`、`LICENSE.md`；读取 #71 本文和 comments，维护者明确 2.3 已恢复修改
- Chop Chop：`608eac98df29cd97821a6115cd52dfb9027345b1`；`StateMachine/ScriptableObjects/StateActionSO.cs`、`TransitionTableSO.cs`、`StateMachine/Core/StateMachine.cs`、`Characters/Damageable.cs`、`Camera/CameraManager.cs`、README、LICENSE；历史补丁 `753c30e6fda71c6024c69ee5704b71cfa110e160`
- Entities Samples：`6786a741ee1f118ed14cecfa02beae8e926937b0`；`Dots101/Entities101/Assets/HelloCube/6. EnableableComponents/RotationSystem.cs`、`13. StateChange/SetStateSystem.cs`、`ConfigAuthoring.cs`、README、LICENSE
- Cinemachine：`45728f3030787076f32930101d11d9ca96fe3a0f`；`com.unity.cinemachine/Runtime/Behaviours/CinemachineBrain.cs`、`Runtime/Core/CinemachineCore.cs`、CHANGELOG、LICENSE；历史补丁 `69b205115495a374fbba329547ba608cdcfe7847`
- Daggerfall Unity：`2343305d1d83ccc0de57a81e3b1e61188a997e34`；`Assets/Scripts/Game/EnemyMotor.cs`、README、LICENSE；历史补丁 `0519cee99740d4005ef70b99a3a064ac0655ce72`；最近 release API 与说明已读

[研究] 来源为公开 GitHub／官方正文；#71 同时读取维护者回应和修复 diff，不以 closed、星数或宣传视频代替修复证据。

## 七、后续验证条件

**[研究] 优先验证**：同一 Unity 组件／小状态机切片做第 2.9 节蓄力中断＋重开。退出组合难维护才比 HFSM，测得 CPU 批处理瓶颈才比 ECS；按下列跨模块验收收口，不同时比较十个框架。

验收合并为三个跨模块问题：[研究]
- 正常、取消、死亡、卸载、池回收都清理，实例互不污染；重开无重复技能／镜头／关卡／UI 事件，冷却／资源结算可追踪
- 旧档与内容 ID 保持，数据变更按约定时点生效
- 低帧率、暂停恢复及目标平台帧时间／内存预算下物理／动画／镜头正确，并由人判断手感、可读性与趣味；无报错不等于质量通过

**剩余理论缺口**：Unity Behavior 固定包源码及版本升级回归、GAS 目标引擎版本源码快照、具体 Lyra 文件许可链、商业插件 SKU／Agent 使用与源码维护权利；需要新环境／付费／运行引擎者列入后续验证条件，当前不因此停掉其他研究。

**[研究] 验证范围**：源码与修改链已读，目标设备与第二次修改尚待实测；[专题正文](../../domains/game-dev/05-gameplay-architecture.md)和本记录的仓库检查不能代替引擎验收。

### 文档交付检查

[研究] 历史交付：依赖无缺失；`check_repo.py`、完整离线 14 阶段及 `git diff --check` 通过，五组测试 97／26／10／13／14 项、非空无 skip；UTF-8／空白检查通过。后续整合又核 59 处标题引用并补 ECB 计时反证，内部抽查无阻塞；当时未取得云端评审。上述不代表最新共享树或 hosted CI。

## 阶段 F 商业资格与版本补核

核实日 2026-10-14；建议 2026-11-14 或选包、购买、融资条件变化时复核。Lyra 的当前渠道标签及未闭合文件许可继承 [WP10 动态表](2026-10-14-game-wp10-client-modules.md#阶段-f-动态状态补核)，不重复声明完整清权。[研究]

| 动态事实 | 本次核实与一手来源 | 对采用的影响 |
|---|---|---|
| Opsive 价格、席位与资格不一致 | [购买页](https://opsive.com/assets/behavior-designer-pro/)显示 Personal $145/seat 一次性、Professional $399/year，并写合计收入＋融资 ≥US$200k；[2026-10-02 EULA §2.3、3.1](https://opsive.com/solutions/decision-solution/behavior-designer-pro/eula/)却分别要求直接操作功能者 Professional，以及过去12个月收入 >US$200k 或融资 >US$200k 时持续订阅 | 套餐名称、合计／分别计算与等号边界不能自行调和；采购前取得具体 SKU／席位资格书面确认，不默认单人支付 $145 足够。仅列商业对照，不升级默认 |
| Opsive 源码持续维护权 | 同一 EULA §4.1 允许订阅到期／终止后只继续使用最后取得版本的对象码，须停止使用并删除源码 | 未来修改成本包含持续许可；不把对象码留用解释为永久源码维护权。未取得账户合同或 Agent 使用许可 |

[一手] 另重读 Unity Behavior [1.0 changelog](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/changelog/CHANGELOG.html)，当前指定文档仍为 1.0.16（2026-05-26）；[LICENSE](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/license/LICENSE.html)仍指 Unity Terms of Service。这证明指定文档内容，不证明全渠道最新版或具体账户安装权限；继续按实际包／计划核，不改为 UCL／MIT。

## [镜头质量补研：从跟得上到看得懂、控得住](wp11-camera.md#s9-1)

### [1. 不把“顺滑”压成一个阻尼数](wp11-camera.md#s9-2)

### [2. 三种玩法的不同默认，不共享一套“最佳参数”](wp11-camera.md#s9-3)

<a id="3-两种真实开发证据借机制不复制整套负担"></a>

### [3. 真实开发证据：借机制，不复制整套负担](wp11-camera.md#s9-4)

### [4. 瞄准、切镜和舒适度属于玩法质量](wp11-camera.md#s9-5)

### [5. 后续体验验收与维护成本](wp11-camera.md#s9-6)

## [战斗质量补研：动作节奏与遭遇可读性一起设计](wp11-combat.md#s10-1)

### [1. 三种生产经验改变哪些建议](wp11-combat.md#s10-2)

### [2. 慢、快与取消各自服务什么](wp11-combat.md#s10-3)

### [3. 原生编排足够，重点是编辑后仍对得上](wp11-combat.md#s10-4)

### [4. 新武器／新敌人后保住什么](wp11-combat.md#s10-5)

## [Unreal 相机补研：同一遮挡问题的原生职责与新系统边界](wp11-camera.md#s11-1)

### [1. 默认采用什么，谁不能替谁做决定](wp11-camera.md#s11-2)

### [2. 越肩绕柱：改造射击与显示规则，不再造相机框架](wp11-camera.md#s11-3)

### [3. 固定俯视：借原生 masked 开口，不复制 Unity 材质实现](wp11-camera.md#s11-4)

### [4. 新系统何时值得替换基线](wp11-camera.md#s11-5)

## [跟随历史补研：瞬移、换目标与变帧率](wp11-camera.md#s12-1)

### [1. 复用历史管理入口，不让技能各自重写平滑](wp11-camera.md#s12-2)

### [2. 指数收敛不等于移动目标的跟随完全帧率无关](wp11-camera.md#s12-3)

### [3. 窄二改题与停止条件](wp11-camera.md#s12-4)

## [失败与重试补研：回到刚才的决策点](wp11-camera.md#s13-1)

### [1. 不把恢复正确当成重试体验合格](wp11-camera.md#s13-2)

### [2. 固定游戏实现：重建世界也可以是简洁起点](wp11-camera.md#s13-3)

### [3. 边界、成本与下一次修改](wp11-camera.md#s13-4)

### [4. 已获线索难回看：先补材料还是移动检查点](wp11-camera.md#s13-5)

## [Endless Sky：非平台游戏的动感镜头与默认值取舍](wp11-camera.md#s14-1)

## [命令预览补研：提示清楚还要规则一致](wp11-camera.md#s15-1)

### [1. Factorio：动作模式改变，预览也必须改变](wp11-camera.md#s15-2)

### [2. OpenTTD：同一处理器可试算，但不是任意结果保证](wp11-camera.md#s15-3)

### [3. 竞争选择：让复杂组合可尝试，不强迫 UI 解释一切](wp11-camera.md#s15-4)

### [4. 采用成本、二改与引擎边界](wp11-camera.md#s15-5)

## [区域命令补研：持续任务还是固定对象队列](wp11-camera.md#s16-1)

## [运行时叙事：开放表达、知识解锁与离线承诺](wp11-camera.md#s17-1)

### [1. 先比较玩法需要，而非台词是否无限](wp11-camera.md#s17-2)

### [2. Vaudeville：保留生成玩法，也撤回一部分供应方式](wp11-camera.md#s17-3)

### [3. 生成自由度不免除作者的进度与知识设计](wp11-camera.md#s17-4)

### [4. 撤回条件与证据缺口](wp11-camera.md#s17-5)

## [效果叠加补研：来源所有权不等于合并规则](wp11-combat.md#s18-1)

### [1. OpenRA：来源退出只撤自己的授予](wp11-combat.md#s18-2)

### [2. Shattered Pixel Dungeon：重复施加未必产生独立层](wp11-combat.md#s18-3)

### [3. Unity 与 UE 的采用边界](wp11-combat.md#s18-4)

### [4. 窄二改题、许可与验证范围](wp11-combat.md#s18-5)

## [导航补研：通路、局部让路与停止位置](wp11-combat.md#s19-1)

### [1. 先过许可，再借真实游戏的局部机制](wp11-combat.md#s19-2)

### [2. 重寻路不能统一加速，也不能统一节流](wp11-combat.md#s19-3)

### [3. 原生能力的具体采用边界](wp11-combat.md#s19-4)

### [4. 后续只预注册一个二改遭遇](wp11-combat.md#s19-5)

## [关卡组合补研：连通之后还要选择什么](wp11-camera.md#s20-1)

### [1. 两类游戏，借不同的小机制](wp11-camera.md#s20-2)

### [2. 固定开源调用链：规则确实被消费，但不推荐整套接入](wp11-camera.md#s20-3)

### [3. 单人采用与二改预注册](wp11-camera.md#s20-4)

## [受限动作补研：开放意图不等于更强战斗 AI](wp11-combat.md#s21-1)

### [1. 三个作者体系分别支持什么](wp11-combat.md#s21-2)

### [2. 固定调用链：required 与兼容回退为什么还不够](wp11-combat.md#s21-3)

### [3. 后续窄对照与撤回，不在本轮运行](wp11-combat.md#s21-4)

## [学习迁移补研：按提示完成之后会不会主动使用](wp11-camera.md#s22-1)

### [1. 两条竞争路线：帮助时机与自主选择](wp11-camera.md#s22-2)

### [2. 固定实现：触发与已读不代表掌握](wp11-camera.md#s22-3)

### [3. 反例：少指导与完成率都不能单独作为目标](wp11-camera.md#s22-4)

### [4. 窄二改预注册与撤回条件](wp11-camera.md#s22-5)

## [辅助取舍补研：局部调整、整局预设与切回规则](wp11-camera.md#s23-1)

### [竞争选择与一手反例](wp11-camera.md#s23-2)

### [最小采用与撤回边界](wp11-camera.md#s23-3)

### [第二次修改：只预注册，不运行](wp11-camera.md#s23-4)

## [屏外威胁补研：补信息还是改攻击](wp11-combat.md#s24-1)

### [三种选择及代价](wp11-combat.md#s24-2)

### [固定实现反例：不显示演出，不等于不结算](wp11-combat.md#s24-3)

### [最小采用与下一次内容修改](wp11-combat.md#s24-4)

## [建造镜头补研：旋转缩放支点与输入入口](wp11-camera.md#s25-1)

### [1. Tiny Glade：按设备改变支点政策，不是修正坐标计算](wp11-camera.md#s25-2)

### [2. OpenRCT2：同一支点契约下删除多余拾取，按钮另修](wp11-camera.md#s25-3)

### [3. 最小采用与二改验收](wp11-camera.md#s25-4)

## 随机所有权补研：装饰二改是否改变玩法序列

核实：2026-10-16（UTC+8）；主线三，GC。[研究] 05 §6补合法表现随机的消费域：需复现玩法时按所有者隔离，区别于预览禁副作用及seed／生成器版本存档。

### 1. OpenRA：视口相关闪光的评审修正

[一手：评审／合并源码] [PR #18711](https://github.com/OpenRA/OpenRA/pull/18711)新增宝石闪光；[具体评审](https://github.com/OpenRA/OpenRA/pull/18711#discussion_r711581362)指出按客户端`Viewport.AllVisibleCells`抽 SharedRandom 会多人失同步，要求 LocalRandom，[作者回复](https://github.com/OpenRA/OpenRA/pull/18711#discussion_r711729049)确认修改。属评审纠正风险，非发行故障统计。

[一手] 2021-10-02 合并`a13d04630469fcb994bbbc25e644b4e6b471017c`：[WithResourceAnimation L62–103](https://github.com/OpenRA/OpenRA/blob/a13d04630469fcb994bbbc25e644b4e6b471017c/OpenRA.Mods.Cnc/Traits/World/WithResourceAnimation.cs#L62-L103)的间隔、可见格洗牌、比例、动画选择用 LocalRandom；[Util L201–209](https://github.com/OpenRA/OpenRA/blob/a13d04630469fcb994bbbc25e644b4e6b471017c/OpenRA.Mods.Common/Util.cs#L201-L209)的范围采样改为显式接收生成器，不固定取 SharedRandom。[研究] 借调用者传所拥有的流，不移植整套 RTS 架构；按是否影响权威状态／调用时机划域，不能把全部声音动画都改局部随机。

### 2. BrogueCE：单人显示与玩法也有不同消费域

[一手] BrogueCE 主干`104a20fedbe7d9360d2dfc8ff665571694212ad8`（2026-09-27，非已核发行包）：[Rogue.h L401–405](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/Rogue.h#L401-L405)分 substantive／cosmetic；[Math.c L90–133](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/Math.c#L90-L133)存两状态、按域采样；[IO.c L1768–1805](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/IO.c#L1768-L1805)颜色随机前选 cosmetic、完成后恢复。[研究] 单人 roguelike 也可隔离，仅读该链不能证明全路径，也不推荐照搬可变全局选择器。

### 3. 复用原生能力，别把重置当续接

- [一手] [Unity 6.0 Random](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Random.html)明确 UnityEngine.Random 是全局共享的静态状态，需要独立生成器时可管理 System.Random 实例。[研究] 小项目可由玩法与表现模块分别持有已有实例并传入采样函数，不要求新增库或每个实体单独播种。
- [一手] [Unity 6.0 Random.state](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Random-state.html)区分保存／恢复完整状态和 InitState 重新初始化；官方示例中前者续接保存点，后者回到序列开头。[研究] 这不使全局 Random 自动成为多条流；不要在每次表现回调里重设全局 seed 来“隔离”。
- [一手] [UE 5.8 Random Streams](https://dev.epicgames.com/documentation/en-us/unreal-engine/random-streams-in-unreal-engine)提供 Blueprint RandomStream 结构变量和 From Stream 节点；[FRandomStream](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Core/FRandomStream)分别列 InitialSeed、当前 Seed 与 Reset，Reset 回到初始 seed。[研究] 沿现有所有者保留流状态并选对输入，别每次抽取都重建／重置；这里不承诺任意序列化或跨版本兼容。

[研究] ✅ seed挑战、回放或可复查结果会受表现采样影响时，隔离玩法／纯表现流；无需求耦合则保简单实现。玩法域规则改动仍可改变序列；参与碰撞、命中、资源的视觉对象仍属玩法。

[研究] **二改预注册**：固定版本、初始状态、输入，仅改闪光／音效、视口或关闭表现；对照掉落伤害选敌，核表现未抽玩法流，中途恢复续接当前状态而非起点。只验证此配置随机隔离，不外推跨平台、物理、联网确定性。

**许可**：BrogueCE为AGPL-3.0-or-later，OpenRA为GPL-3.0-or-later；只核评审、固定文件和原生API，未执行隔离用例。

## [感知补研：角色知道什么与导演调度什么](wp11-combat.md#s27-1)

### [跨类型证据与反例](wp11-combat.md#s27-2)

### [原生入口：位置输入、感知状态与遗忘不是同一开关](wp11-combat.md#s27-3)

### [采用、撤回与二改预注册](wp11-combat.md#s27-4)

## [选敌补研：候选、保持与主动切换](wp11-combat.md#s28-1)

### [跨类型机制与反例](wp11-combat.md#s28-2)

### [最小采用、撤回与二改预注册](wp11-combat.md#s28-3)

## [意图预告补研：确定结果、条件变化与有意未知](wp11-combat.md#s29-1)

### [决策信息不等于完整行为表](wp11-combat.md#s29-2)

### [已发布修订：可以删显示，也可以改规则](wp11-combat.md#s29-3)

### [第二次修改：仅预注册，未执行](wp11-combat.md#s29-4)

## 物品补研：数量栈、单件状态与转移身份

核实：2026-10-16（UTC+8）；主线三，GC。[研究] 05 §4增耐久／强化先核可互换性及拆分转移，不全改实体。比较OpenMW与Minetest Game／Luanti，后两者算同一生态；快照非稳定发行。

**OpenMW：保留状态不等于复制身份。** [一手] 固定 `9ec458174fa5a459b7910cd6990c1acc830b0b8a` 的实际消费者如下：

- [ActionTake](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/actiontake.cpp#L20-L40)的非拖放拾取路径加入容器、删除地面对象，并采用返回目标；[ItemModel.moveItem](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwgui/itemmodel.cpp#L58-L65)区分整堆转移与部分复制。未合并的整堆可沿用身份；合并返回目标栈，不能要求所有旧引用仍指向存活物品
- [ContainerStore.unstack／restack／stacks](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/containerstore.cpp#L315-L400)拆分时保留原栈指定数量，为余量另发 RefNum；合并时原项归零并返回存活栈。同定义只是必要条件：还核灵魂、剩余使用时间与传统物品脚本；有耐久者须都满耐久，有附魔充能者须都满充能。[研究] 因此两个都剩50%耐久也不能合并，是该项目政策，不是通用相等规则
- [装备入口](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/inventorystore.cpp#L162-L195)按类别拆一件，[弹药与投掷物](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwclass/weapon.cpp#L84-L105)允许装备时保持栈，不能写成所有装备都拆。普通装备在装备期间另受[合并限制](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/inventorystore.cpp#L547-L565)；[修理](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwmechanics/repair.cpp#L59-L70)恢复后尝试重合并。[灵魂捕获](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwmechanics/actors.cpp#L209-L214)实际采用拆一件、写灵魂、按同灵魂重合并，也反证新增状态不必永久禁堆叠

[一手] [2023拆堆另发身份](https://github.com/OpenMW/openmw/commit/0f608f388ef84db438eda67c06409dcd58056a1e)后，[2024-05-28修复](https://github.com/OpenMW/openmw/commit/ae4bf04798b3ad25a8490d448f8d53b06347e567)仍修跨容器拆堆丢灵魂：从仅按定义 RefId 重造改为复制实例模板。当前[InventoryItemModel.copyItem](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwgui/inventoryitemmodel.cpp#L50-L65)及[ManualRef](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/manualref.cpp#L101-L109)保实例数据后清 RefNum／Lua 脚本。[研究] 状态保留与身份不重复分别核；清脚本仅此项目政策。GitLab 问题 6148／MR2995 正文未取得，无原报告者复测证据。

**Minetest Game／Luanti：值式单件状态。** [一手] 游戏`c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f`的[farming实际消费者](https://github.com/luanti-org/minetest_game/blob/c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f/mods/farming/api.lua#L59-L104)注册锄头为 tool、使用后改 wear 并返回 ItemStack。引擎`0e1414682e4be3ffb84d067d0621e98d6bf5cd76`的[ItemStack字段](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.h#L146-L154)含 name／count／wear／metadata，没有内置逐件 ID；[tool构造](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L30-L40)和[默认stack_max](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L721-L738)均限 1。[拾取](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L383-L399)返回未收入余量，[地面实体](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item_entity.lua#L325-L348)据此更新／删除；[拆分](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L484-L501)复制状态再分数量，[跨槽／列表转移](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L826-L891)把余量退来源；[持用工具](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L515-L538)读取、损耗、写回当前 ItemStack，不沿地面实体身份。

[一手／研究] **合并路径有差异：** [stacksWith](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L401-L481)比较 name／wear／metadata，同文件 addItem／itemFits 却只比 name／metadata，[掉落物合并](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item_entity.lua#L103-L138)才另比 wear。耐久工具靠单件限制，不能推广为任意堆叠耐久装备。[6057原报告](https://github.com/luanti-org/luanti/issues/6057)报告空元数据使表面相同物品不合并，[85d7b18修复](https://github.com/luanti-org/luanti/commit/85d7b18d851504e6d9f637c4373cf896b1ce8e4c)避免无内容空键值。[已有单测](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/unittest/test_inventory.cpp#L39-L83)核 tool count=1 且保 wear；仅读未运行，非全路径验收。

[研究] **二改预注册**：先复用支持每件／栈状态、数量／合并限制、余量／存活目标返回的背包。三把同型剑只改一把，转移拾回合并，核数量、状态及允许回堆后的旧引用。跨位置持续引用“这一件”才加身份，无法表达区别才局部扩展；AI追消费者，人定可互换政策。

**边界 [一手／研究]**：[OpenMW README](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/README.md#L4-L9)标GPLv3，运行Morrowind须自有游戏；[Luanti引擎](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/LICENSE.txt#L114-L132)为LGPL-2.1-or-later，[farming模块](https://github.com/luanti-org/minetest_game/blob/c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f/mods/farming/license.txt)源码单独MIT、媒体另有许可，不能以根许可代组件核查。未验上游用例／引擎集成，不作闭源即插底座。

## [任务推进补研：历史事实与当前条件](wp11-camera.md#s31-1)

## [效果时钟补研：调度时间、行动次数与到期显示](wp11-combat.md#s32-1)

### [回合玩法：调度时间不等于输入次数](wp11-combat.md#s32-2)

### [即时玩法：模拟秒、菜单与恢复各有边界](wp11-combat.md#s32-3)

### [显示修订与二改预注册](wp11-combat.md#s32-4)

## [效果读取时点：持续代价与一次承诺](wp11-combat.md#s33-1)

## [属性修饰补研：计算顺序与重算](wp11-combat.md#s34-1)

## 事件连锁补研：排队不代替防重入与操作边界

核实：2026-10-16（UTC+8）。主线三／GC；改变05§6的同步／排队选择：来源、防重入资格和完整操作边界分别决定，不因“解耦”统一延迟。新证据复用已完成的固定源码调查，再对照当前章节缺口；不是新增效果框架或游戏实测。[研究]

**DCSS：资格与延后边界。** [一手] 固定`2952e12c52c2a66210f6c5488db987d0962a67ca`的[反伤执行](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/fineff.cc#L1081-L1107)允许原防御者已经死亡、重新检查承受反伤者仍活着；[伤害入口](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/monster.cc#L4393-L4402)排除派生反伤再次镜像。[2014修复](https://github.com/crawl/crawl/commit/4f3d0c6879f2baefcf3eb2749133ae3340dcbdca)修来回反弹；[2024修复](https://github.com/crawl/crawl/commit/f4a7df68b9800669d3a70ac8d7dc9cc4f2eeb94b)将血箭冷却前置以防止反射重新触发齐射，同时另修 beam 复用，不能把全部崩溃归重入。

[一手／研究] [2020修复](https://github.com/crawl/crawl/commit/3dd439832fe0f5fe295caad1a2fe3e479a757cda)延后死亡爆炸，避免多目标攻击未完就杀攻击者；[2021修复](https://github.com/crawl/crawl/commit/4e304d196c1d5a90fd7939a3cf94c2339bed27f0)撤每束 beam 后处理，因多束法术未整体结束。[现行消费者](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/fineff.cc#L2133-L2147)从 vector 尾取再执行，为 LIFO 且继续处理新加入的效果，不是 FIFO；排队本身不中断循环。

**直接处理也可成立。** [一手／研究] SPD v4.0.2 `57a4e06`的[LifeLink](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L830-L864)用派生来源免再次分摊，[Skeleton](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Skeleton.java#L70-L141)直接做死亡邻格伤害。[攻击链](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L483-L512)的 attackProc 在普通 damage 之前，是规则钩子、非 HP 提交事实；正文 DamageApplied 仍在提交后。

OpenRA固定e180e3225f3930272dd451917467631618f8976f中，[桶伤害](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ra/weapons/explosions.yaml#L144-L182)有Delay=5，[ATMine](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ra/weapons/explosions.yaml#L193-L209)不设Delay且排除Mine；[消费者](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Game/GameRules/WeaponInfo.cs#L234-L265)分别直接执行或走延时，[DelayedImpact](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Game/Effects/DelayedImpact.cs#L19-L40)单位为tick不是秒。[一手] 游戏规则的延迟与为保护操作完整性而延后是不同目的，不统一换成一种调度器。[研究]

**采用与预注册 [研究]**：会重入的动作登记资格／来源，但仍重核合法性，取消失败按原规则返还。加反射／爆炸后验重入、多目标未完时死亡、多个连锁与即时规则；必要时才延至完整操作边界。DCSS为GPL-2.0-or-later，SPD／OpenRA为GPL-3.0-or-later；仅选定链路，未证全路径。


## [组合取舍：先修辅助、规则还是动作出口](wp11-combat.md#s36-1)

## [镜头借出控制：持续更新历史与当前视点分开](wp11-camera.md#s37-1)

## 离线收益补研：等待、精度与结算边界

主线：三／四；GC，2026-10-17（UTC+8）核实。
改变建议：05 §2只为承诺离线收益的玩法比较分批逐步、粗步与聚合结算；普通暂停不据此补收益。
新证据：两款不同作者的增量游戏固定源码，以及AD休眠路径、KG离线漏产修订；不能推广为所有游戏要求。[一手／研究]

**步数减少会改变自动化。** Antimatter Dimensions [固定说明](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L126-L176)解释：1000步补1小时，每步3.6秒，自动购买每步仅触发一次，影响随阶段变化。[实现](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/game.js#L895-L1055)按剩余时间／剩余步数分摊，异步分批，并允许减步加速。分批让出执行时间与减步牺牲精度是两种选择，不可混称无损提速。[一手／研究]

**聚合有另一套规则成本。** Kittens Game [资源路径](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/js/resources.js#L843-L870)以缓存速率乘时长，暂放容量限制供后续消费，再限回容量；[时间路径](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/js/time.js#L191-L312)批量推进各子系统，QUEUE_REDSHIFT分支按队列ETA分段／购买，但向整游戏年取整。它是有意聚合，非精确解析或在线等价证明。[一手]

**修订反证。** AD [changelog](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/changelog.js)记载2023-05-25将休眠的单大步改为离线模拟，07-18仍修真实时间资源漏发及未遵循离线设置。KG [1.4.8.1](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/changelog.txt#L207-L224)修Temporal Paradox期间离线漏产。补算接通不代表所有规则接通；历史修复不代表当前仍有故障。[一手／研究]

**✅ 条件选择 [研究]**：
- 购买、解锁、消费顺序重要：复用逐步规则，分批保响应；仍须测恢复等待，不能无限追赶。
- 容许收益误差：粗步设上限并说明精度代价；不同阶段核收益及自动化次数，误差破坏承诺就撤回。
- 稳定区间或另定离线规则：聚合结算；跨容量、耗尽、购买／解锁边界需分段重算或明确不同规则。边界过密、难维护时退回逐步，不先造通用解析器。

AD模拟时停普通循环，[普通存档门槛](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/storage/storage.js#L244-L273)拒绝进度模拟中的普通保存，备份有例外；这不证明崩溃幂等。[一手] 建议收益与已结算区间同存，恢复重入拒绝重复区间，负时差与上限另定政策。[研究]

**未运行验收**：同存档加“自动购买后解锁新产物”，比正常逐步与两种补算的收益、触发次数、恢复等待和最长阻塞；再验后台恢复、重复回调、结算前后崩溃／重载。不以算法存在宣称玩家体验、净性能或重复收益已解决。本轮只读公开实现与修订，不复制代码；复用另核许可。[研究]


## [群体攻击协调：资格、站位与冷却分开](wp11-combat.md#s39-1)

### [生产取舍：参战预算不等于攻击帧计数](wp11-combat.md#s39-2)

### [固定实现：共享额度的范围和退出比名字重要](wp11-combat.md#s39-3)

### [最小采用与第二次修改](wp11-combat.md#s39-4)

## [蓄力技能补研：按法识别、技能进度与释放](wp11-combat.md#s40-1)

## 回放用途：先分影子展示、输入复演与状态倒带

核实：2026-10-18（UTC+8）。GC，主线一／三／四。新增读者任务是最佳路线对照、回放诊断或倒带续玩，不把既有随机分流建议扩成确定性保证。选择依据是固定实现与开发者报告；未运行游戏、引擎、上游测试或模型。[研究]

### 先按需要保住的结果选择

| 任务 | 先比较什么 | 代价与撤回条件 |
|---|---|---|
| 并排路线影子、观看上次表现 | 带时间的姿态＋必要表现状态／事件，独立回放表现 | 不能据此重算真实碰撞／奖励；转弯、瞬移或事件缺项使画面误导时增加必要采样／标注，或缩小展示范围 |
| 查同一输入为何造成错误 | 已知初始状态与版本下重演输入／玩法命令，并检查状态分歧 | 输入文件小不等于实现便宜；时钟、数值、随机与外部结果不受控时不能承诺重现，保留失败现场的状态和日志另查 |
| 任意倒退后继续玩 | 足以恢复允许倒带部分的状态；比较状态历史与输入重演＋检查点 | 状态存储／迁移与重演成本分别计；稀疏姿态没有冷却、对象生命周期等必要状态时，不能直接用于续玩 |

这些是研究判断，不是三种完整框架的推荐名单。纯观看需求不必先重构全游戏为确定性模拟；反过来，画面吻合也不证明错误原因被复现。时间点、缺失字段、地图／规则版本及可执行的副作用要成为记录契约的一部分。[研究]

### SuperTuxKart：姿态之外还要记录想展示的含义

固定源码 [`2997f192e6876047909d909498dbb4810e5dbb8d`](https://github.com/supertuxkart/stk-code/tree/2997f192e6876047909d909498dbb4810e5dbb8d)：[recorder L134–301](https://github.com/supertuxkart/stk-code/blob/2997f192e6876047909d909498dbb4810e5dbb8d/src/replay/replay_recorder.cpp#L134-L301)记录时间、位置、视觉旋转及速度、转向、悬挂、滑行、道具和特效；重要状态改变时提前采样，临近终点提高精度。它不是只存 Transform，也不是把玩家输入重新送回原模拟。[一手：源码阅读]

[GhostKart L90–250](https://github.com/supertuxkart/stk-code/blob/2997f192e6876047909d909498dbb4810e5dbb8d/src/karts/ghost_kart.cpp#L90-L250)避开依赖物理的图形更新路径，插值位置并用 slerp 插值旋转。附件计时与护盾续期并不精确，源码明确把这些误差限定在图形用途；不能将这条简化路线用于权威碰撞或奖励重算。[一手／研究]

**二改反证最重要。** [旧版读取分支 L450–480](https://github.com/supertuxkart/stk-code/blob/2997f192e6876047909d909498dbb4810e5dbb8d/src/replay/replay_play.cpp#L450-L480)为格式3中未保存的滑行状态、nitro 数量、道具和距离等字段补零，但保留原已记录的部分特效。[研究] 这能支持降级播放，不能让新增数据分析把补零当“当年没有使用道具”。新功能依赖旧记录没有的字段时，应标未知／不可用，或只保留不依赖该字段的观看能力，不伪造历史。

[2018-11-17 开发者说明](https://blog.supertuxkart.net/2018/11/supertux-challenges-in-story-mode.html)以预录 ghost 展示路线、滑行和 nitro 使用，作为学习挑战的设计意图；没有给出学习收益测量。此处借的是任务与记录内容的对应关系，不照抄整套竞速架构。[一手／研究]

### Neverball：叫 command 不代表记录了玩家输入

固定 [`82883833043725b21a65fe45416524cb77412e39`](https://github.com/Neverball/neverball/tree/82883833043725b21a65fe45416524cb77412e39) 的 [game_server L210–240](https://github.com/Neverball/neverball/blob/82883833043725b21a65fe45416524cb77412e39/ball/game_server.c#L210-L240)产生球位置／方向和视图状态命令；[game_client L316–330](https://github.com/Neverball/neverball/blob/82883833043725b21a65fe45416524cb77412e39/ball/game_client.c#L316-L330)把它们写入记录后消费，[demo L374–394](https://github.com/Neverball/neverball/blob/82883833043725b21a65fe45416524cb77412e39/ball/demo.c#L374-L394)播放时读回给 client。这条路径记录的是模拟输出协议，不能仅凭“command replay”名称当输入复演模板。[一手／研究]

[地图 major version 检查](https://github.com/Neverball/neverball/blob/82883833043725b21a65fe45416524cb77412e39/ball/game_client.c#L296-L302)及[官方历史变更](https://neverball.org/changes)补上限制：1.5.1／1.5.3 的若干地图修改明确使回放失效，1.5.2 又补过初始视图数据。**记录输出也不自动摆脱场景与格式依赖。** 改图后显示旧轨迹可作历史参考，但不能悄悄当新地图的有效成绩或验证结果。[一手／研究]

### 输入复演与状态倒带，各自省掉什么、增加什么

- [ccleste 固定 README](https://github.com/lemon32767/ccleste/blob/261d96f15af430b8111abc7a5250229246654f52/README.md#tas-playback-and-the-fixed-point-question)给出逐帧输入 bitfield、起始加载帧与固定 seed；作者同时说明 float 与原 PICO-8 的 16.16 定点差异可能影响 TAS。为特定理想 RNG 记录提供的 balloon hack 会固定气球并扩大 hitbox。[研究] 所以“文件播完”必须附模拟配置，不能把改变玩法条件的兼容补丁算成忠实复现。这里只核移植作者文档，未编译／播放。[一手／研究]
- [Factorio FFF47，2014-08-15](https://www.factorio.com/blog/post/fff-47)描述历史调试模式逐 tick 比 CRC，再保存带可读标签的状态以定位第一次分歧。作者也报告这种密集检查很慢；它支持调试时比较状态，而非只看画面，不是当前性能数字或所有游戏每帧完整落盘的建议。[一手：作者报告；研究]
- Braid 作者 Jonathan Blow 的[原评论](https://news.ycombinator.com/item?id=9484297)说明主要记录世界状态，world5 的影子动作是事件记录例外；[后续解释](https://news.ycombinator.com/item?id=9484350)说状态历史以更多内存换较少 CPU。输入／事件倒带若要迅速跳转仍需邻近状态起点，因此可能同时维护两套机制。[研究] 这是该项目的历史取舍，不证明状态记录对所有项目更便宜；此处未取得对应源码或独立运行。

### 第二次修改的最小验收与许可边界

增加新道具显示、修改地图，再改变一项运动规则：分别检查旧格式能否解析、旧画面能否诚实显示、旧输入能否在声明的模拟条件下重现。缺字段显式降级；跳转／倒放经过事件时，表现播放不得重复触发真实奖励或提交命令；倒带续玩另验对象生命周期、冷却与继续执行。需要诊断原因时定位首次状态分歧，不能用外观接近当通过。[研究；验收未执行]

只提炼公开机制，不复制代码或游戏资产；STK／Neverball 的开源许可也不将全部素材或其他游戏代码一并授权。没有测试存储量、性能、跨平台确定性、玩家学习或二改工时。上述证据支持用途划分和维护风险，不支持“回放系统已经验证”或强制 Unity／UE 使用相同实现。[研究]


## [本地多人视图：独立活动与双方可读性先于自动合屏](wp11-camera.md#s42-1)

### [选择及撤回条件](wp11-camera.md#s42-2)

### [共享屏幕的真实收益与反证：Pixel Wheels](wp11-camera.md#s42-3)

### [独立活动的相反路线与二改：Larian](wp11-camera.md#s42-4)

### [二改验收与未覆盖部分](wp11-camera.md#s42-5)
