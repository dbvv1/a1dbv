主线：一／二／三／四；玩法反馈、额外能力、第二次修改与可维护交付
改变的建议：[研究] 默认组件＋窄规则＋局部状态机，按真实复杂度升级。先定状态所有者、时钟、退出与输入边界；相机先定信息与控制目标，关卡、成长、教学与辅助按玩家决策取舍。物品区分可互换性，任务区分历史与当前条件；功能通过仍须核体验；群体叠招先分攻击许可、站位与单体冷却；蓄力按输入识别、技能计量与释放选择；回放按影子展示、原因复演与倒带续玩选择记录内容；本地多人按独立活动与双方可读性选共享／分屏
新证据：[一手／社区] 固定源码、官方契约、历史修复／评审及开发者复盘，来源、版本和日期见各节；含Factorio撤销二改、Wesnoth受限撤销、OpenMW／Luanti物品路径、Overgrowth玩家单例及PixelWheels视图反证／BG3楼层修复。[研究] 另有确定性算术反例，未作游戏、引擎、模型或玩家对照

# WP11：单人独立游戏的 gameplay 架构取舍

证据核实：原记录2026-10-13—14 UTC，后续日期见各节。除确定性算术复核外，均为公开资料／源码研究，未运行引擎、游戏、模型、玩家实验或上游测试，未安装／购买插件；所有验收计划均未执行。源码与文档检查不证明性能、工时、体验或AI收益；“AI风险”是契约推导，固定主干不等于发行包。各节保留特有缺口与历史验证范围。本文只提炼机制，不复制代码／资产；实际复用仍须分别核代码、素材和引擎许可。

05 页历史范围原文：核实：2026-10-16；篇幅编辑：2026-10-17（UTC+8）。本次编辑日期不代替各节证据核实日期。

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

## 镜头质量补研：从跟得上到看得懂、控得住

核实：2026-10-14 UTC；主线1／3／4。05 §8补预判、取景、输入连续性与视觉意图；依据为Cinemachine 3.1.7文档、Celeste64固定实现、开发者自述及2026可访问性指南。[研究]

### 1. 不把“顺滑”压成一个阻尼数

[研究] 相机要兼顾决策信息、输入、节奏与运动负担。死区稳住参照却减少前视，阻尼减突变却增加滞后，大视野容纳威胁却缩小提示。先定位动作缺什么信息，再选固定、移动、变焦或前瞻。

**[一手] 机制资料与证据边界：**

| 来源／本次核实 | 直接支持的内容 | 不支持的推断 |
|---|---|---|
| [Unity 6.0 包页](https://docs.unity.com/en-us/engine/6000.0/manual/packages-list/packages-all/pack-safe/com-unity-cinemachine)与 3.1 文档页面元数据 | 当前该渠道发布版 3.1.7；从 2.x 升级有迁移工作 | 不是全渠道永远最新；不能将主干 3.1.8-pre.2 修复说成已进入 3.1.7 |
| [Position Composer](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachinePositionComposer.html) | 按屏幕位置、死区、各轴阻尼构图；前瞻会放大噪声，预测平滑增加滞后 | 未给具体游戏的最佳参数，也没有证实“多平滑就更舒服” |
| [Group Framing](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineGroupFraming.html) | 可用移动／变焦装下目标组，设构图尺度与镜头范围 | 将所有敌人加入组不等于战斗更可读；目标权重和成员资格由玩法决定 |
| [Deoccluder](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDeoccluder.html) | 拉近、保持高度或距离三种避遮挡取舍；最短遮挡时间、保持时间和恢复阻尼可减少无谓调整 | 不保证所有窄走廊有可行视点；看见角色不等于看见落点或敌人预告 |
| [Confiner 2D](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineConfiner2D.html) | 限制的是含视口尺寸／比例的区域；改变镜头需按文档失效相应缓存，形状重算有成本 | 一个边界多边形不能自动解决所有宽高比的构图；频繁重建并非零成本 |

[研究] **顺序**：先定动作所需信息与发现节奏，再选固定／跟随基线、局部规则和装饰运动。简单路线满足目标就保留；高速穿行可在扩量路线前比较构图与追随，见下列开发者取舍。只增电影感却让人反复找目标、逐房修补时撤回；优先已有 Unity 组合，不据此宣称跨插件性能最优。

### 2. 三种玩法的不同默认，不共享一套“最佳参数”

**[研究] 平台跳跃**：保起跳前落点、空中高度参照与下落安全空间。屏内房间固定，大房间用死区／边界，高速漏看才加水平前瞻；纵轴按着地、越窗、下落更新。窗口导致落点晚出现或试探时前瞻翻向即调整。关卡标必要视野，程序维护少数规则。

**[研究] 俯视战斗**：固定朝向、稳定尺度、有限跟随；小场一次看全，Boss／双目标才加目标组并设最低可读尺度。分散敌人导致过度缩放时缩目标集或改空间；看不清动画、呼吸式变焦或新增敌人需大量特例就退回。未核生产游戏采用此组件组合。

**[研究] 越肩**：探索可有惯性，瞄准需直接响应；相机、身体、骨骼分开。绕行会改瞄准关系，拉近会损周边信息；有限策略仍无可用视点时改几何／局部显隐，承担材质维护成本。

**遮挡补核（2026-10-14，Cinemachine 3.1.7）。** [一手] [Decollider](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDecollider.html)只脱离障碍／地形，不保视线；[Deoccluder](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDeoccluder.html)依赖collider／查询，Maximum Effort限命中数，增加成本不能创造视点。Transparent Layers只排除遮挡层，不控材质。[研究] 先保瞄准意图，再在允许位移内恢复视线；两组件不自动保枪口／落点，也不默认叠用。

[一手] [Shader Graph 17.0.4 Dither](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/manual/Dither-Node.html)以Alpha Clip Threshold丢像素模拟透明并保深度写入，不是完整遮挡系统。[研究] 固定朝向可借材质原语，但须定对象、范围、恢复，保留掩体边、落地面、预告。轮廓只报角色位置，屋顶分区还需验新增层高／门窗。目标分辨率与运动中另验抖点干扰，未证优于透明混合。

[一手] **发布后反证**：[Project Zomboid 42.21 stable 公告](https://projectzomboid.com/blog/news/2026/09/42-21-stable-released/)称大树妨碍驾驶，改cutaway以露出树下房屋／家具且仍待改进。[研究] 支持树冠＋步行改驾驶／瞄准的二改验收，不证明采用Cinemachine／Shader Graph或该方案最优。

[研究] **成本**：材质不能批量显隐或墙树例外不断增加时先改几何构图。二改记collider、材质、显隐特例、恢复遗漏及工时，核角色、落点、预告、准星、弹道。[3.1 许可页](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/license/LICENSE.html)与[17.0 许可页](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/license/LICENSE.html)均为UCL、限Unity-dependent项目；引擎资格另核WP1。

<a id="3-两种真实开发证据借机制不复制整套负担"></a>

### 3. 真实开发证据：借机制，不复制整套负担

**Lonely Mountains：导演构图与追随视角的选择，核实 2026-10-18（UTC+8）。** [一手] 创始人 Daniel Helbig、Jan Bubenik 在 [2020-03-17 的 Downhill 访谈](https://80.lv/articles/level-game-production-lonely-mountains-downhill)中说明，镜头随速度／方向调角度和距离，聚焦预测位置；快速响应与避免突兀运动需要折中。受控构图能预示路线、展示地标、提示或隐藏捷径，但地形必须适应该视角；装饰后的路段也可能不再像白模时清楚。

[一手] Helbig 的 [Snow Riders 更新原帖](https://www.linkedin.com/posts/helbigdaniel_since-we-started-with-the-lonely-mountains-activity-7407445428683653122-7F7h)说明，长期镜头反馈促使团队再试第三人称替代模式，作者认为结果有趣，已发布 PS5／Xbox／Steam；为适应新视角，艺术团队修改了全部山地与路线。原帖仅取得相对时间，不认定其绝对发布日期；[Steam 公告](https://steamcommunity.com/games/2545360/announcements/detail/514103843981624429)正文提取为空，[镜像](https://steamdb.info/patchnotes/21232103/)所列日期不算原帖日期已核。正文事实使用本人原帖，不采用其差评占比表述作统计。

[研究] **采用单位是选择顺序**：高速穿行先定玩家该看见与发现什么；导演构图服务展示次序，前方判断优先时比较追随。无需每个项目做双模式，换视角也不必全面重做：内容维护超预算就缩小路线范围或保留受控构图。返工事实说明相机选型会牵涉关卡，不是只调阻尼；艺术团队完成返工不证明单人零美术修补可以承担。两段是同团队不同作品，非同游戏受控前后对照；作者体验判断不证明玩家成绩、舒适度或工时收益，本轮未运行游戏／引擎。

**Mushroom 11 [一手]**：[Itay Keren 的修订文章](https://gamedesignskills.com/game-design/camera-design-2d-side-scroller-games/)源自GDC 2015。作者按区域设路径／缩放，解谜看块平均、推进看领先块；无跳跃使预测较自然。[研究] 支持按玩法选焦点／区域，非通用纵向预测。手工区域有维护成本，简单跟随无法表达谜题才增加导演；无工时／舒适对照。

**Celeste64 [一手]**：固定`EXOK/Celeste64@6edfe1ebd2a21a6134d7675a28e357891025407e`，2026-09-07主干提交非发行日；完整读[Player.cs](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs)：

- 443–460：水平跟随角色，垂直目标依据着地、下落与高度窗选择；使用含 delta 的指数趋近，避免把“每帧固定比例”当时间不变的阻尼
- 544–589：局部固定镜头区域与一般碰撞修正并存；这说明局部设计镜头可以与常规跟随共存，不证明其射线方案覆盖所有近裁剪或窄角落情形
- 597–617：普通移动使用当前画面方向建立输入基；1474–1487 的攀爬则在横向输入松回阈值内才重算方向符号，保持转角期间持续输入的意图
- 480–482：速度会影响 FOV；这仅是作者的效果选择，不构成所有高速移动都应改变 FOV、或已验证减轻晕动的证据

[研究] **只借局部规则**：[ReadMe](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/ReadMe.md)称原团队不足两周的jam级制作，Player为单体类，不推荐长期架构。攀爬持续输入跨视角的语义归移动组件，相机只给朝向。

**许可 [一手]**：[Source/License.txt](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/License.txt)为MIT；ReadMe另保留Content／Celeste IP，非商业同人授权不扩成商用素材，FMOD例外另核。Cinemachine [LICENSE.md](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/LICENSE.md)为Unity-dependent UCL。

### 4. 瞄准、切镜和舒适度属于玩法质量

[一手] [Third Person Aim 文档](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineThirdPersonAim.html)区分相机看点与角色命中点；固定[CinemachineThirdPersonAim.cs](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Behaviours/CinemachineThirdPersonAim.cs)先找看点再从vcam.Follow.position查遮挡；样例[AimTargetManager.cs](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Samples~/Shared%20Assets/Scripts/AimTargetManager.cs)在CameraUpdatedEvent后更新指示，从传入firingOrigin求方向。

[研究] Follow未必是枪口；弹体体积、弹道、散布仍归武器。准星区分目标与受阻点，验近墙、换肩和高低差；装饰噪声可与瞄准分离，故意后坐力另定，不能一起抵消。

[一手] [Input Axis Controller](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineInputAxisController.html)分加减速、混合期抑制、非缩放时间、Cancel Delta Time。鼠标delta已随时间累积，不按摇杆角速率二次积分。[研究] 精确鼠标无需求不加平滑，混合期间输入政策另定。

[一手] [切换文档](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/concept-camera-control-transitions.html)中两虚拟相机可同时live，停用对象仍可能参与混合。[研究] 唯一输出指Brain层；传送、复活、揭谜、瞄准各自选cut／blend／重置，不统一过渡。

[一手] [Xbox XAG 117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117)（2026-03-04更新）建议关闭额外运动、调FOV／横纵灵敏度／自动回正；[Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/avoid-or-provide-option-to-disable-any-difference-between-controller-movement-and-camera-movement/)也要求可退出非输入效果。[研究] 非医疗阈值或实测收益；关震动后保动作、声音、UI命中信息，固定视角无需因此造双视角系统。

### 5. 后续体验验收与维护成本

[研究] 待未来获准运行切片再做；当前不能把以下项目标为通过，也不设伪精确的通用“最佳毫秒”。

| 观察任务 | 需要记录的证据 | 撤回／修改条件 |
|---|---|---|
| 同一跳跃在默认镜头、有限前瞻下试玩 | 玩家起跳前是否能指出落点；失误时当时可见区域；急转向后视野恢复 | 只是视频更流畅，但看落点更晚或反向时镜头反复摆动 |
| 同一遭遇固定尺度与目标组比较 | 预告能否被认出；关键角色屏幕尺度；远处敌人加入时是否被迫缩放 | 更多对象入镜却更难分辨攻击，或每种敌人要补特例 |
| 掩体边缘瞄准、连续绕柱、开关瞄准 | 准星／受阻点／真实枪口轨迹；拉近恢复次数；同输入下目标稳定性 | 准星承诺与命中不符，避障持续抢控制，碰撞修正产生反复抽动 |
| 持续按方向经过区域切镜／攀爬转角 | 输入轨迹、最终相机方向、角色运动方向；手柄与键鼠分开 | 同一意图突然逆转或必须松手重找方向，而玩法未告知 |
| 默认与减弱运动设置完成同一路段 | 主观舒适反馈、是否需要重找目标、关闭效果后命中反馈辨识 | 将“无报错／帧率稳定”当舒适通过；不适参与者不被要求继续 |

[研究] 保留暂停、低帧率、时钟、传送、重生、过场取消与静态重入检查。二改加下落房间和窄掩体，记录模式／特例、资产与调参工时；牵动全部镜头时先简化职责。AI实现规则并记录轨迹，人验取景、节奏、输入承诺与舒适度。

## 战斗质量补研：动作节奏与遭遇可读性一起设计

核实：2026-10-14 UTC。主线 1／3；改变 05 第 7 节只强调结算、取消正确性的侧重，补充玩家能学习的动作承诺、接触力度与恢复节奏。新证据是已发布游戏开发者自述、官方历史取消回归及现行原生动画契约；不重复 04 的输入／打击反馈参数表。[研究]

### 1. 三种生产经验改变哪些建议

| 直接来源与证据性质 | 具体观察 | 本文采用／不采用 |
|---|---|---|
| [Thomas Vasseur，Dead Cells 动画流程，2018-01-25](https://www.gamedeveloper.com/production/art-design-deep-dive-using-a-3d-pipeline-for-2d-animation-in-i-dead-cells-i-)；本人制作复盘 [一手] | 可重做时序是关键收益；新武器可多次调整，过去仅在代码里调播放速度不足；其团队在动画与细节之间有所取舍 | ✅ 优先选可反复调整的动作资产与流程，分开改前摇、接触、恢复；⛔ 不把“3D 转像素”当无美术人员必然成功的路线。作者仍承担模型、动作与美术判断 |
| [Mark Foster，Death’s Door 动画访谈，2021-08-27](https://www.gamedeveloper.com/art/animation-feature)；仅其本人描述作为一手 [一手] | 漂亮外包动作不能替代他想控制的动作间连接；小屏幕角色不值得投入不可见的细节 | ✅ 在实际游戏镜头下判断姿态和衔接，把工时花在玩家看得到的动作；⛔ 不从“程序员学会动画”推断本仓库无手工修补基准已经实现 |
| [Alx Preston，Hyper Light Drifter 公平性访谈，2016-04-08](https://www.gamedeveloper.com/design/how-i-hyper-light-drifter-i-balances-difficulty-with-fairness)；设计者对自己游戏的描述 [一手] | 轮廓和起手传递信息；敌人组合使挑战上升；反弹子弹又格挡近战的敌人难与其他敌人组合而被删 | ✅ 在混合遭遇里评价预告与反制空间；⛔ 不以单挑 AI 更聪明当新敌人质量更高，也不推出所有游戏应降低单体智力 |

[研究] 共同支持“可反复改的一招＋可解释的敌群”，动作本身参与预测与掌握；三例均有作者判断，不能证明AI／无美术团队获得同样收益。

### 2. 慢、快与取消各自服务什么

[研究] 前摇传达方向，接触集中速度／姿态变化，恢复建立节奏。快招可承担距离、硬直或站位风险，重招可用承诺换破防／范围／位移，非通用平衡公式。敌人可应对性与玩家输入响应不同，不要求相同时长；慢招也可在承诺清楚时成立。

[研究] 每招明确转向锁定、移动、取消、连击及落空风险；玩法先准许、动画再衔接。过度混合会抹掉接触姿态，无条件取消会抹掉重武器承诺。

[一手] [Dead Cells 官方 Update 33](https://deadcells.com/patchnotes/33)：33.1（2023-03-10）修误删Katana cancel technique，33.3（2023-03-30）恢复空中Hattori’s Katana技巧，另有新武器与音效表现修复。[研究] 保留历史连段回归，不猜根因／帧数或要求所有技巧永久保留；有意平衡改动须明示并试玩。

### 3. 原生编排足够，重点是编辑后仍对得上

- **Unity 6.3**：[一手] [Animator 转场](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Transition.html)把 Exit Time、Fixed Duration、Transition Duration、Interruption Source／Ordered Interruption 分开；有 Exit Time 时条件在该时点后检查，AnyState 转场先进入中断队列。[研究] ✅ 沿用原生机制，但分别审查玩法准许取消和动画能否进入相应转场。换动画长度／播放速度后重新核接触姿态、窗口及混合，不把一个 normalizedTime 百分比当永远不变的现实时间。
- **Unreal 当前官方页面**：[一手] [Notifies](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-notifies-in-unreal-engine)支持 Notify State 区间、Sound／Niagara 及 Montage 通知；Branching Point 比 Queued 更精确、同步但成本更高，Link Method 的 Absolute／Relative／Proportional 对片段移动／缩放反应不同。[研究] ✅ 用现有 Montage 编排，只有确需精确次序的玩法分支才加同步通知；编辑动作后检查绑定方式。此默认 URL 本次页面标为 5.8，实际工程必须选对应版本，不借此声称已核旧版全部行为。
- **共同边界 [研究]**：动作事件开窗口／准备声，确认命中再选受击、格挡与接触效果；可见拖尾不等于全程伤害。镜头音频沿04／05 §8，新武器仍须保住旧敌人预告。

[研究] 无手修起点是许可清楚且姿态可读的现成动作，或适合刚体／简单2D的程序动作，再分段、重定时和引擎调整。程序能改时序，未必修好轮廓、缺姿态、穿插与重心；需反复手修则换素材、减招式或降表现复杂度。

### 4. 新武器／新敌人后保住什么

[研究] 后续获准做切片时，保留一把已满意旧武器和一个代表遭遇；加入一把节奏不同的新武器，或一个与旧敌人形成新压力的敌人。不要只打训练木桩，也不要求全量笛卡尔组合：选会改变取消、预告、距离或接触的组合。

1. **前摇到承诺**：同镜头下能否辨认攻击方向与危险范围；改变方向／闪避的准许边界是否与姿态一致。记录输入、阶段与画面，不以玩家背下无提示例外为通过
2. **接触到结果**：命中、落空、格挡分别试；玩家说得出结果，声音／VFX 不许诺不存在的命中，新武器效果不遮挡同时到来的旧敌人预告
3. **恢复到下一步**：旧连段、取消和移动恢复仍符合设计；新慢武器的承诺确实换来相应收益，不能把所有不适都通过加速／开放取消消除
4. **从单体到遭遇**：新旧敌人混合、狭窄空间、边缘位置下仍有可读且可执行的选择；若无解，先调整攻击重叠、敌人组合或空间，不先叠更响的警报

[研究] 自动核窗口、结算、转换；真人判断辨识、失误原因与再玩意愿。记录特例／工时；新武器牵动所有敌人与镜头时先修共同动作语义。设计者定承诺与公平，AI维护参数、引用、轨迹及回归。

[研究] Dead Cells Update 14 的格挡时序修订仅取得摘要，正文超时，未纳入采用证据。

[研究] 战斗补研的历史局部检查：`check_repo.py` 177 文件、0 errors，两个文件 `git diff --check` 通过；未在该轮重跑完整离线入口。

## Unreal 相机补研：同一遮挡问题的原生职责与新系统边界

核实：2026-10-14 UTC；主线1／3。05 §8补UE职责，依据为标5.8的Epic契约、Top Down Strategy屋顶与Experimental Gameplay Cameras；设计组合属推导。[研究]

### 1. 默认采用什么，谁不能替谁做决定

[一手] [USpringArmComponent](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/USpringArmComponent)用ProbeChannel／ProbeSize防穿透，默认ECC_Camera；肩位用臂端SocketOffset以保查询，bUsePawnControlRotation决定控制朝向。[研究] 成熟boom不保证搜索任意可见构图；防穿墙、看见目标与枪口通路分开，非Deoccluder等价物。

[一手] [Cameras](https://dev.epicgames.com/documentation/unreal-engine/cameras-in-unreal-engine)：CameraComponent供视点，ViewTarget供候选POV，PlayerCameraManager管最终视图／混合并可查询；[ControlRotation](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/AController/GetControlRotation)是可不同于相机／Pawn的瞄准朝向。[研究] 沿原最终归属，不强制子类；控制层拥输入，碰撞不反写意图，最终视点不混成骨骼朝向。

[一手] [Traces Overview](https://dev.epicgames.com/documentation/unreal-engine/traces-in-unreal-engine---overview?lang=en-US)分channel／object与line／shape sweep，Multi Trace by Channel只返回到首个blocking hit。[研究] 相机、可见性、武器各定过滤，查多层树冠不能假定一次取全。

### 2. 越肩绕柱：改造射击与显示规则，不再造相机框架

**[研究] ✅ 原生基线＋两条独立路径。** 相机按玩家意图定位，SpringArm 负责约定范围内的防穿透；武器负责可发射性、弹道与伤害。这是由上述契约推导的工程建议，不是文档声称 UE 自动实现的两段瞄准算法。

1. 画面准星从实际显示的视点求候选目标；读取时声明与相机更新的先后，避免拿上一帧缓存或混合前 CameraComponent transform 解释当前画面。装饰性 shake 可与瞄准姿态分离，故意后坐力是否改目标由玩法明确，不把所有扰动强制消除
2. 武器从真实 muzzle／发射点向候选目标验证；hitscan 可用 line，有限尺寸弹体用合适 sweep，弧线弹道不能用一根直线宣称全程畅通。近墙生成重叠也要单独处理
3. 柱子挡住枪口但没挡镜头时，保留候选目标并清楚标示受阻／实际接触点；按既定规则阻止开火或击中掩体，不能从相机原点发子弹绕过碰撞。伤害提交仍属武器／战斗系统
4. 需要目标可见性修复时，先限制相机位移和换肩条件，持续输入不应因自动绕柱突然改方向；若取景和掩体公平性无法同时满足，修改柱距／肩位／遭遇，而非叠加一个不可预测的避障导演

[研究] **二改预注册**：新增柱／长枪，记录最终POV、ControlRotation、枪口、目标、阻挡与伤害；验双肩、贴墙、高低差、绕柱及进出瞄准。可见、射线通、体积弹体通分别核，人判断控制是否被抢。

### 3. 固定俯视：借原生 masked 开口，不复制 Unity 材质实现

[一手] [Top Down Template](https://dev.epicgames.com/documentation/unreal-engine/top-down-template-in-unreal-engine) Strategy的M_Cutout以屏幕／相机位置开masked屋顶，实例Strength控大小。[研究] 🧪 沿现有材质工作流改造，不是树冠／落点识别器，投影、视距、多层适配待验。

[研究] 只显隐必要前景，保存对象集合、范围与恢复状态；退出遮挡、换目标、重生、卸载须恢复。保留树干、碰撞掩体边、落地面与预告；显隐不改碰撞，轮廓不提供落点。材质／房间例外过多时先简化几何与镜头。

[研究] 二改加宽树冠和下层落点，验下落前的落地面、预告、逃路，记材质例外与恢复遗漏。目标设备再验稳定性／GPU成本；未比较masked、dither、translucent，未取得模板资产／受限源码，Unity节点与UCL不迁给UE。

### 4. 新系统何时值得替换基线

[一手] [Gameplay Cameras 插件索引](https://dev.epicgames.com/documentation/unreal-engine/API/PluginIndex/GameplayCameras?lang=en-US)、[系统概览](https://dev.epicgames.com/documentation/unreal-engine/gameplay-camera-system-overview?lang=en-US)、[Quick Start](https://dev.epicgames.com/documentation/unreal-engine/gameplay-camera-system-quick-start)本次均标UE 5.8 Experimental。系统用Camera Asset复用rig／transition／director及Debugger；教程用Occlusion Material并移除旧CameraBoom／FollowCamera。

[研究] **👀 条件评估**：多角色共享rig／过渡、图导演确能减少编写，且能承担版本与发布回归时再比。单个遮挡问题沿原基线，最终输出不争写。Occlusion Material不保证掩体边界／武器合法；未读受限实现，节点清单不代表稳定或生产采用。

[研究] **版本／许可边界**：四个 `application_version=5.8` URL 抓取失败后读取默认页，以实际标题和日期限定判断，不冒充安装包验证。工程须重核本版本的 Experimental 状态；UE 原生／资产条款仍适用，Cinemachine／Shader Graph 的 UCL 不能跨引擎移植。

## 跟随历史补研：瞬移、换目标与变帧率

核实：2026-10-14 UTC。主线 3；收窄 05 第 8 节及本文原有“传送与重生重置阻尼”的建议。新证据为 Cinemachine 固定实现／测试与 Epic 变帧率复现报告；没有新增运行时或通用教程。[研究]

### 1. 复用历史管理入口，不让技能各自重写平滑

[一手] 本节 Unity 源码固定为 `45728f3030787076f32930101d11d9ca96fe3a0f`，不是对稳定 3.1.7 安装包的复测。[PositionComposer](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Components/CinemachinePositionComposer.cs)的 `OnTargetObjectWarped` 仅在目标等于 FollowTarget 时平移 `m_PreviousCameraPosition` 并调用预测器 `ApplyTransformDelta`；[Predictor](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Core/Predictor.cs)中后者只平移位置，保留速度历史。`Reset()` 才清速度与平滑速度。

[一手] PositionComposer 在 PreviousState 无效或 FollowTargetChanged 时清预测器，但只在前者重建跟随历史并跳过阻尼。[VirtualCameraBase](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Core/CinemachineVirtualCameraBase.cs)的 `CancelDamping(updateNow)` 包装 `PreviousStateIsValid=false`，可选择立即更新或等正常更新。[固定 changelog](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/CHANGELOG.md)在 2.8.0-pre.1 明确换目标默认平滑，3.0.1 加入 CancelDamping；这不是本轮首次发现的新 API。

**[研究] ✅ 采用／改造一处现有相机模式入口，按事件意图选三种政策：**

- **保留连续性**：同一目标确实整体平移，且希望保留相对构图及原运动趋势，传入真实新旧位置差调用 warp；按项目相机集合通知受影响相机。传送门若还旋转朝向，位置差接口并未完成方向／速度参考系转换
- **丢弃旧历史**：死亡重生、换角色或载入后要求立即重新取景，用 CancelDamping；已激活的镜头混合另选 cut／blend。零位移 warp 不清旧趋势，直接改 Camera transform 也不等于同步组件缓存
- **保留设计过渡**：正常观察对象交接或谜题揭示允许平滑时，沿原生切换／混合；不能每次换 Follow 都强制 reset，否则会取消本来想保留的过渡。warp 更不能把两个不同角色当成同一条运动轨迹

[研究] 暂停恢复也不默认清历史：目标与相机时钟都冻结时保持原状态；菜单中允许镜头继续移动则先明确时钟，暂停期间若重生／换目标再按上述政策处理。[固定 Brain](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Behaviours/CinemachineBrain.cs)的 IgnoreTimeScale 在非固定更新选 unscaledDeltaTime；固定路径仍用 fixedDeltaTime。[一手] 勾选它不意味着新增了暂停期间的固定更新调用，也不证明整条输入／混合链使用同一时钟。

### 2. 指数收敛不等于移动目标的跟随完全帧率无关

[一手] Predictor 中 `StandardDamp` 按 `initial * (1-exp(log(0.01)*dt/dampTime))` 返回本次施加量；`StableDamp` 只在 `CINEMACHINE_EXPERIMENTAL_DAMPING` 且非固定步长时由 Damp 路由启用，不能写成默认运行时保证。[DampingTests](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Tests/Editor/DampingTests.cs)比较不同固定 FPS 下的衰减耗时，允许两算法时间比误差小于 7%；它没有覆盖同一运动目标交替帧时间下的屏幕位置一致性。[LookaheadTests](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Tests/Runtime/LookaheadTests.cs)检查换目标标志和移动后预测量非零，也不能替代传送／暂停恢复的玩法验收。

[研究] 零依赖 Python 标准库算术复核：取 dampTime=1 秒、每帧末采样匀速 10 单位／秒的目标，逐步应用上述标量公式。15／30／60／120 FPS 时，静止误差 100 在 1 秒后均剩 1；但移动 5 秒后的追随距离分别为 1.855168528／2.009068115／2.089204983／2.130072239。计算用 `alpha=-math.expm1(-math.log(100)*dt)`、每步 `target+=10*dt; camera+=(target-camera)*alpha`；与离散稳态式 `10*dt/math.expm1(math.log(100)*dt)` 的差约为 2×10⁻¹⁰。**这是采样递推的确定性反例，不是 Cinemachine 实测**：没有目标插值、死区、旋转、硬边界或扩展，更不能据这些数值决定游戏阻尼参数。

[一手] [UE-216449](https://issues.unrealengine.com/issue/UE-216449)给出另一实现的具体反例：SpringArm 开 Camera Lag Substepping 后切换 120／60／30／15 FPS，目标的视口位置／旋转仍改变；报告指出插值子步计算问题，并提到补丁另存 PreviousTargetLoc／PreviousTargetRot。2026-10-14 核实时仍 Backlogged，更新日 2026-09-14，影响列表为 4.27–5.4。**不能据此断言 5.8 必现或已修；公开复现项目链接已移除，本轮未取得补丁或复跑。** [研究] 仅借其验收问题，不建议拷贝无法核实的引擎补丁，也不默认开启实验算法。

### 3. 窄二改题与停止条件

[研究] **二改预注册**：增加保动量平移传送、清动量重生，并在暂停菜单触发重生。沿统一入口传意图；比较偏移、预测、恢复首帧与活动混合，移动目标另比恒定／交替帧间隔的屏幕位置和滞后。立即取景才要求清历史，连续传送验真实位移迁移。若需改多个技能／写Transform者／扩展，先收拢职责。

## 失败与重试补研：回到刚才的决策点

核实：2026-10-14 UTC。主线 1／3；改变 05 第 9 节仅强调遭遇可重置的建议，补充高频失败玩法的重试体验。新纳入的证据是经典开发者原文与固定游戏源码，不是 2026 年新技术，也不是本项目实测。[研究]

### 1. 不把恢复正确当成重试体验合格

[一手] Edmund McMillen [Why So Hard?（2010-04-21）](https://www.gamedeveloper.com/game-platforms/-i-super-meat-boy-i-s-mcmillen-explains-why-so-hard-)把无命数后的失败代价分等待和关长，采用短关、可见目标、快复活；与Tommy Refenes的[成品复盘（2011-04-14）](https://www.gamedeveloper.com/audio/postmortem-team-meat-s-i-super-meat-boy-i-)再述该取舍，并把失败回放作为完成奖励。仅作者解释，非独立实验／难度公式。

[研究] 短挑战分别观察死亡演出、重建转场、恢复控制、重走路程，重叠段不机械相加，动画常量不代总耗时。检查点随挑战与学习目标，而非场景文件划分；只快复活动画不能减少重复路程。

### 2. 固定游戏实现：重建世界也可以是简洁起点

固定 `EXOK/Celeste64@6edfe1ebd2a21a6134d7675a28e357891025407e`；以下为源码阅读，未运行游戏。[一手]

- [Player.cs L1881–1991](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L1881-L1991)：死亡演出达到条件后请求 Replace，并用保留入口信息创建 `new World(entry)`；重生另有状态，演出完成才进入 Normal。常量只描述这些局部状态，不能推出目标设备从死亡到可操作的总时间。
- [Game.cs L173–250](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Game.cs#L173-L250)：退出旧场景、创建并建立新场景；资产重载由另一个选项控制。音乐路径相同且仍在播放时不重新启动音乐。[研究] 可借“重试保留体验连续性”，不能由场景重建推断必然重新加载全部资产，也不能反推其没有重建开销。
- [Checkpoint.cs L26–60](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Checkpoint.cs#L26-L60)：命名检查点更新当前入口，激活时有声音、模型状态和短形变。[研究] 玩家知道重试起点已改变，也属于恢复体验，而不只是内部字段已更新。

[研究] ✅ 小项目先复用死亡／场景重开，实测重建妨碍尝试后才缩小重置范围或驻留资源。该实现无需原地回滚／对象池，耗时与规模边界未测，不先建世界快照。

### 3. 边界、成本与下一次修改

[研究] 永久死亡、资源损失与整局承诺有意构成风险时保留；另排查加载、确认菜单与无意义等待的意外成本，不统一改成最近检查点。

[研究] 成本包括状态入口、检查点反馈、出生安全、敌人机关与进度维护，驻留另占内存。二改延长遭遇／移动检查点后，观察回到原决策点全过程，核奖励、收集物、机关与出生安全。AI记录和回归，人定失败代价；不加回放框架。

[一手] [Celeste64 ReadMe](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/ReadMe.md#license)将MIT Source（有例外）、Content／IP及FMOD分开；仅借机制，短期jam不作生产底座。重试全程与工时未测。

### 4. 已获线索难回看：先补材料还是移动检查点

核实：2026-10-17（UTC+8）。只读历史版本公告与玩家回执；补充05重试段“只为回看已获线索而重走，可先保留可回看材料”。[研究]

- **实际修订 [一手]**：Mobius 的 [Outer Wilds／Echoes of the Eye 1.1.13（2022-09-15）](https://www.mobiusdigitalgames.com/news/patch-13-is-now-available)同时修改视觉线索、船载日志和关卡，以“无需 photographic memory”描述其中一项；公告未展开播放条件，不能单靠这句断言全部幻灯片解锁。
- **后续使用 [社区]**：[2022-10-05讨论](https://www.reddit.com/r/patientgamers/comments/xwfpyw/anyone_else_feel_like_the_outer_wilds_echoes_of/)中，Torchiest描述较早看到的图像当时尚无意义、后来忘记而查攻略；Mossimo5明确称补丁后在船上电脑看幻灯片很有帮助，但仍不喜欢潜行。前者与后者是不同玩家，非同人前后对照，也不证明整个重试体验改善。
- **显示范围 [社区：模组作者说明]**：[Damián Garro的播放器说明](https://outerwildsmods.com/mods/shiplogslidereelplayerplus/)称原版按日志条目关联的facts显示，存在未覆盖材料；显示未看过全部材料是其模组另设且默认关闭的选项。这里只核说明，未安装模组或反编译游戏，不把模组功能归给原版。

[研究] **两个替代**：移近检查点／加捷径减少再次到达的操作；保留已获材料供回看则减少重复取证，仍让玩家推理。问题仅是忘记已见线索时，可先选后者；实际重复挑战负担仍按前节处理。以记忆为挑战目标时不自动日志化，也不提前开放未发现材料。此例不支持取消循环、统一缩短重试，或给所有谜题补答案。

## Endless Sky：非平台游戏的动感镜头与默认值取舍

核实：2026-10-14 UTC。主线 1；补 05 §8 从“效果能关闭”到分别决定效果、默认值与首玩可发现性。比较的是俯视太空贸易／战斗中的居中跟随与加速度偏移，不重做输入研究，也不声称两种方案通过了全部玩法回归。[研究]

**居中或加速度偏移。** [一手] [#9638](https://github.com/endless-sky/endless-sky/pull/9638)于 2024-05-19 合并（`ae5c7f1fb6e791a5742cab23a9332f72913893d9`）；[固定 Engine.cpp](https://github.com/endless-sky/endless-sky/blob/cbca555b1cdca081b57ee7473f3db07a31181d96/source/Engine.cpp)的 OFF 返回飞船中心／速度，ON 插值相机速度与位置，REVERSED 反向偏移。[研究] 稳定参照与加速感各有代价：偏移改变前后视野，可能增加重找目标负担。[#8446 的讨论](https://github.com/endless-sky/endless-sky/pull/8446#issuecomment-1441120912)希望高速时多看前方，[反馈者](https://github.com/endless-sky/endless-sky/pull/8446#issuecomment-1441124904)认可动感却担心目标辨识及长时间舒适度；均为方案反馈，非计时／晕动测试。[社区]

**修订与正面反馈。** [一手／社区] 较早[#7347](https://github.com/endless-sky/endless-sky/pull/7347)按推力状态偏移；Koranir 在[2023-12-30 比较](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872451536)认为起止突兀并给替代视频。修订后 alexrovw[实际使用并表示会保留](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872582712)，[复测确认](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872604442)复杂转向、停车与倒车下的轮廓对齐及反向模式故障已修，仍有武器后坐力边例。作者关闭未合并的#7347 让位于#9638，前者测试不转作后者通过。#9638 获原作者[正面体验评价](https://github.com/endless-sky/endless-sky/pull/9638#pullrequestreview-1807800878)；Koranir 在[2024-05-18](https://github.com/endless-sky/endless-sky/pull/9638#issuecomment-2119032487)用 Marauder Leviathan 试玩后认为效果轻微、有动感，支持 ON 默认并被采用。没有同一批玩家的受控 A/B，不能判定后一算法普遍更优。

**撤回默认开启，保留效果。** [一手] [#12252](https://github.com/endless-sky/endless-sky/pull/12252)于 2026-02-12 合并，仅改 Preferences.cpp：加速度镜头缺省索引 1→0，并取消 Landing zoom／Show hyperspace flash 默认开启（[之前](https://github.com/endless-sky/endless-sky/blob/f57851bc0cfe715c6e276a3e1402c131fe368a4c/source/Preferences.cpp#L65-L66)／[之后](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Preferences.cpp#L65-L66)）。作者担心新人难从长设置列表找到关闭项而退出，注明 Testing Done: None，故只属可接近性判断，不是玩家流失数据。[社区] 合并后 Koranir[质疑是否收到实际投诉](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3889579433)，warp-core[说明自己也抱怨](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3897596643)，Amazinite[第一人称表示镜头效果更令人恶心而非有趣](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3898047376)；后者未分离加速度与着陆缩放贡献、未给安装版本，不能推成玩家共识或算法因果。

**发行与采用。** [一手] [v0.11.0](https://github.com/endless-sky/endless-sky/blob/v0.11.0/source/Preferences.cpp#L65-L66)（2026-01-31）仍 ON；[v0.11.1](https://github.com/endless-sky/endless-sky/releases/tag/v0.11.1)（2026-04-25，unstable）的[changelog](https://github.com/endless-sky/endless-sky/blob/v0.11.1/changelog#L263)与源码已 OFF；[v0.11.2](https://github.com/endless-sky/endless-sky/releases/tag/v0.11.2)（2026-06-27，stable）[仍 OFF](https://github.com/endless-sky/endless-sky/blob/v0.11.2/source/Preferences.cpp#L66-L67)。[固定 Camera.cpp](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Camera.cpp#L46-L74)保留三模式，[设置读取](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Preferences.cpp#L243-L244)沿用保存值，升级不等于老玩家全关闭。[研究] ✅ 有明确不适反馈且不承担必要提示时，考虑稳定缺省＋易发现的可选效果，保留喜欢动感效果的玩家选择。代价是喜欢动感的玩家可能漏看选项，设置说明和多模式回归也增加维护成本；不默认关掉所有反馈。AI 维护开关、旧选择、菜单路径，由人决定体验，首玩测试检查能否找到并理解开关。

[研究] **证据终点**：实现、使用反馈与默认值撤回已核；人群分母、使用时长、关闭后舒适／留存收益未知。代码GPL-3.0-or-later，不作Unity／UE即插插件；有新收益复测前不再堆同类投诉。

## 命令预览补研：提示清楚还要规则一致

核实：2026-10-15（UTC+8）；主线3／1。05 §6补提交前反馈：复用规则查询，区分精确与估计；跨工厂、经营、战术的机制证据不等于同方案均已验证。[研究]

### 1. Factorio：动作模式改变，预览也必须改变

[一手] Wube 的 [FFF #213（2017-10-20）](https://www.factorio.com/blog/post/fff-213)列出普通建造、ghost 与 shift-blueprint 的不同规则：ghost 可忽略已标记拆除的实体，shift 放蓝图会安排拆树／石并跳过不能放置的部分。作者举例，0.15 按住 shift 后矿机 ghost 实际可放，预览却仍因树石标红，0.16 修正显示。这是开发者报告的历史修改，不是本轮复现，也未提供理解率改善数据。

[研究] 预览须含位置、模式、修饰键和相关世界状态；蓝图可提交不等于每项落地。先改现有查询，避免UI另写碰撞／费用规则；文章未证明Factorio全部查询执行已统一。

### 2. OpenTTD：同一处理器可试算，但不是任意结果保证

[一手] OpenTTD 固定主干`daa6e1ca1c357eb9e6ae3d69af134205e1be8517`（2026-10-12），已读取完整相关文件：

- [command_func.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command_func.h)：`CommandHelper::Execute` 先以测试 flags 调用同一个 `CommandTraits<Tcmd>::proc`，通过检查后再带 Execute 标志调用；估算可在测试阶段后退出。`Do` 也区分测试和执行
- [command.cpp](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command.cpp)：试算前后切换城镇评价与持久存储的测试模式；分别显示估计费用和已执行费用动画。非 NoTest 命令断言测试／执行费用及失败状态一致，NoTest 则检查实际执行失败
- [command_type.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command_type.h)将 NoTest 明确定义为测试／执行输出可能不同；[landscape_cmd.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/landscape_cmd.h)的 ClearArea 实际使用该标志，注明多格房屋拆除使城镇评价在两阶段间不同

[研究] **共享处理器仍有连锁状态差异**，提交须重核较早预览。随机／隐藏信息显示条件或范围；查询不得扣费、消费玩法随机或发结算事件。这些待验责任不等于已证OpenTTD全部无副作用，亦未运行其断言。

### 3. 竞争选择：让复杂组合可尝试，不强迫 UI 解释一切

[一手] Tom Francis 的[Tactical Breach Wizards 原始设计（2018-02-02）](https://www.pentadact.com/2018-02-02-pitch-tactical-breach-wizards/)提出提交前反复试演，也注明原型可改；[开发商成品页面](https://store.steampowered.com/app/1043810/Tactical_Breach_Wizards/)确认成品保留免费 rewind、鼓励尝试技能组合。仅此功能得到后续确认，早期同时行动方案与内部预测／回滚实现未核。

**[研究] 纠错先选恢复承诺，不因支持撤销就建完整回滚。** 建造可撤待办／发反向订单；战术可只允许未揭露信息的行动重排；谜题／组合试演才评估完整状态恢复。后者也抹不掉玩家已学到的信息，侦察风险是否保留是玩法选择。

**Factorio：反向订单与操作范围分开。** [一手] [FFF255（2018-08-10）](https://www.factorio.com/blog/post/fff-255)的原型撤掉待建ghost，把已建部分标拆；撤拆时取消未执行订单，已拆部分补ghost等待重建。它保留建造流程，不倒退世界时间。[FFF412（2024-05-24）](https://www.factorio.com/blog/post/fff-412)的2.0前公告又补蓝图配方／过滤、线缆和方向的撤销；手动R旋转有意不入栈，避免淹没历史。跨地点／较旧动作另加预览与确认。前者是原型，后者是发行前开发报告，不能据此承诺当前全部动作可逆或玩家受益已测。

[社区：官方wiki补证] 核实2026-10-17 UTC，[拆除页](https://wiki.factorio.com/Deconstruction_planner#Undo)仍说明已拆建筑只恢复ghost，搬走的库存不会还原，树石等无法撤销。[一手] [FFF415](https://www.factorio.com/blog/post/fff-415)说明施工需找范围内机器人、缺材料／机器人会留待办，逐tick调度另有等待。[研究] 因而反向订单提交成功不等于场景已复原；需要即时自由试摆的游戏不宜照搬这笔等待成本。

**Wesnoth：允许撤销、补偿副作用、揭露信息是三件事。** [一手] 固定主干 `cd1f7380650148d7ccff00c9b81144a87de972e4`（2026-10-12；非稳定版保证）：

- [wml-tags.lua](https://github.com/wesnoth/wesnoth/blob/cd1f7380650148d7ccff00c9b81144a87de972e4/data/lua/wml-tags.lua)：`allow_undo`只设可撤销，`on_undo`另外登记命令；[官方说明](https://wiki.wesnoth.org/DirectActionsWML#%5Ballow_undo%5D)要求作者负责事件改变的变量等状态，不因允许移动回退就自动还原
- [undo_action.cpp](https://github.com/wesnoth/wesnoth/blob/cd1f7380650148d7ccff00c9b81144a87de972e4/src/actions/undo_action.cpp)：逆序执行登记的步骤，`undo_event`运行登记脚本；不是任意世界快照。单步失败也不等于整组原子撤回，容器未传播各步返回值
- [undo.cpp](https://github.com/wesnoth/wesnoth/blob/cd1f7380650148d7ccff00c9b81144a87de972e4/src/actions/undo.cpp)：延迟更新视野时，`commit_vision`若揭露信息就清空可撤销动作；新信息不会随回移而从玩家记忆消失

[研究] 可借责任划分，不照搬脚本架构；上述文件头GPL-2.0-or-later，闭源项目不默认复制。官方wiki含旧版限制／时序备注，本节不将其当现行实现结论，也不声称整个游戏已通过恢复验证。

### 4. 采用成本、二改与引擎边界

[研究] **默认窄查询，确有纠错需求再选受限撤销或完整试演。** 预览含模式／修饰键、无副作用，缓存随世界变化失效；提交重验。撤销以玩家的一次操作为单位，列明它包含的设置、连线、资源和脚本效果。反向订单显示等待／失败／部分完成，已有副作用无法补偿就禁止该类撤销或缩承诺；不会仅为这点接入全局事件溯源。自由尝试本身是玩法时，可承担完整恢复成本，不把所有游戏都收窄成订单纠错。

[研究] **二改预注册，未运行**：在已有建造操作加复制设置／连线，核撤销恢复两者且不重复奖励；分别在未施工、部分施工、缺资源和目标已改后撤销／重做，区分请求与完成。战术动作新增揭雾／脚本奖励后，核撤销许可、补偿和再次触发政策。预览后改障碍／资源／目标再提交，反复取消不消费玩法随机。记恢复遗漏、例外和二改工时，人判纠错是否清楚、等待是否值得；不把有undo等同更好玩。

[研究] Unity／Unreal均沿项目已有命令、存储和动作边界选择，不要求SO框架／GAS；本节无引擎API或性能优劣结论。上述类型互为取舍证据，不是同任务对照，也未证明单人能复现整体质量。[一手] OpenTTD [COPYING.md](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/COPYING.md)为GPL v2，不直接复制进闭源底座。本轮只核公开原源／源码，未运行引擎、游戏或上游测试。


## 区域命令补研：持续任务还是固定对象队列

核实：2026-10-17（UTC+8）；主线三。改变 05命令建议：需要响应目标进出时保留持续区域任务，指定对象分派才展开快照队列；追加／替换和筛选失败另定，不把统一手势当语义一致。[研究]

**两种可用任务并不等价。** BAR [#9042讨论](https://github.com/beyond-all-reason/Beyond-All-Reason/issues/9042#issuecomment-5510929781)解释：区域维修转成当时的单位列表后，会追随离区对象、忽略新入区对象；原生区域维修在任务持续期间重选范围内受损对象，区内无人需修时结束，特定 Alt 模式才持续等待。[#8342作者](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/8342)认为拆分在战斗／战场回收有用，对建造单位的维修／回收等任务却通常更差：固定展开还要维护原生区域命令已有的资源满额、复活冲突、目标移动与射程检查。这是作者使用判断，非跨游戏对照收益。[一手]

**统一转换会丢操作含义。** 历史[#5946](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/5946)合并为`33bb76324c916f6ffb2ad3e2c8f01256456b9b90`，统一区域筛选并展开目标命令；作者自述用 LLM 评审代码，尤其运输逻辑，不据此归因正确性或错误。[玩家#9042](https://github.com/beyond-all-reason/Beyond-All-Reason/issues/9042)于 2026-09-02 报告：单位上起拖会丢 Ctrl，导致应跨 Stop 保留的目标被清掉、应取消的排队攻击仍在；地面起拖正常。[另一测试者](https://github.com/beyond-all-reason/Beyond-All-Reason/issues/9042#issuecomment-5510801309)辨明起拖位置后确认结果一致。作者仅怀疑自 #5946 开始，未见定位引入提交；问题仍 open，历史合并不证明当前全部沿同实现。[一手：历史修订；社区：操作自报]

**固定修订后的回执仍有保留。** 已读候选[#8342的02d3474262237453d060f6d44b24b0e55bdf8b1d实现](https://github.com/beyond-all-reason/Beyond-All-Reason/blob/02d3474262237453d060f6d44b24b0e55bdf8b1d/luaui/Widgets/cmd_area_commands_filter.lua#L819-L868)：解析模式／悬停对象、筛能力，但空筛选仍有消费命令的分支。[2026-08-12复测](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/8342#pullrequestreview-4920866636)明确在该修订确认分配崩溃、敌我检查等已有修复，同时报告空筛选吞命令，以及无合适悬停对象时回收队列误派自己／友军；[两建造单位的回执](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/8342#discussion_r3770098055)称错误命令留在队列、下游未拒绝。另一次[游戏内回执](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/8342#discussion_r3701207170)显示取消全部误改为移除单目标后，新目标变成追加，旧目标残留。[一手：固定源码；社区：贡献者游戏内自报]

**采用边界。** [研究] 先选持续区域／固定对象，再验对象进出、混选能力、目标少于单位、空筛选及追加／替换；自动分派若需重造原有任务规则，就保留原生路径。#8342已关闭但未合并；[测试者](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/8342#issuecomment-5284309510)说明未逐项对照 master，不能把所有失败归为新引入或声称候选整体通过。只提炼单款 RTS的机制选择，不复制代码、不推所有引擎实现；本仓库未运行游戏／引擎或测玩家收益。

## 运行时叙事：开放表达、知识解锁与离线承诺

核实：2026-10-14 UTC。主线二／四；补充 03 §2 的采用与撤回选择，不改受限动作选择评级。新证据是已发行游戏的开发者撤回记录、2025-12 的叙事编辑器契约、2026-01 的本地兼容后续，以及独立的 authored 叙事路线。只读研究，未运行游戏、引擎或模型。[研究]

### 1. 先比较玩法需要，而非台词是否无限

[一手] [Suck Up! 开发者商店页](https://store.steampowered.com/app/2726370/Suck_Up?l=english)标 2025-10-01 发行：用声音、措辞、伪装骗取进住宅的邀请，并披露第三方生成服务和联网要求。[研究] 采用理由是开放说服成为挑战；商店声明不能证明留存、净收益、响应速度或写作节省，宣传评价及未复核 token 价格不计证据。

[一手] [inkle 的 2021-02-22 发布说明](https://www.inklestudios.com/2021/02/22/ink-version-1)确认 ink 用于 Heaven’s Vault（2019）、Pendragon（2020），支持状态化内容及并行共享状态的 story flows。[研究] 因此记忆历史／按状态响应不足以单独支持 LLM；这也不是与 Suck Up!的同题比较，手写内容仍有成本。

[一手] `inkle/ink@35c63e52f1d36060930dc7ed3cfba38ea224b528`（2026-05-05）：[RunningYourInk L14–85](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/Documentation/RunningYourInk.md#L14-L85)将故事编译为 JSON 后运行，Continue／ChooseChoiceIndex 输出台词、接收选择，state.ToJson／LoadJson 保存加载；[L242–249](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/Documentation/RunningYourInk.md#L242-L249)有变量观察者，[WritingWithInk L824–828](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/Documentation/WritingWithInk.md#L824-L828)用种子复现内容。[研究] 可选本地数据驱动机制，不代表前述游戏采用该 2026 快照，也不保证零延迟、无错或跨版存档。许可／存档边界沿 WP10，不增框架推荐。

### 2. Vaudeville：保留生成玩法，也撤回一部分供应方式

[一手：开发者自述，历史事实] [2024-01-31 pre-mortem](https://steamcommunity.com/gid/103582791472864770/announcements/detail/3973931474188161576)报告上线流量触及服务容量上限，并曾因费用不可持续退回旧语音服务；不能把当年的供应价格或容量当作当前通用成本。[2024-10-03 offline beta](https://steamcommunity.com/gid/103582791472864770/announcements/detail/4657375543606995004)转向本地对话／语音模型，同时承认 GPU 负担、加载与崩溃限制。

[一手] [2025-11-28 正式发行](https://steamcommunity.com/gid/103582791472864770/announcements/detail/520857340524626354)保留在线旧版以支持弱设备／其他语言；[2026-01-22 v1.3.0](https://steamcommunity.com/gid/103582791472864770/announcements/detail/535499112589559217)继续修 Steam Deck、非 CUDA、集显兼容并保留在线分支。[研究] 迁移仍有支持成本，本地模型不是随手可接的离线 fallback；不能由此判游戏／生成路线失败或旧故障未修。端到端延迟、成本、优化幅度、当前兼容覆盖率均无独立测量。

### 3. 生成自由度不免除作者的进度与知识设计

[一手] [Story Vault 编辑器](https://steamcommunity.com/gid/103582791472864770/announcements/detail/520859243419534792)（2025-12-21）由作者设角色知识、地点及关键词，台词提词可解锁地点，结案题及正确项也由作者填写，并告诫勿给角色必须保密的信息。[研究] 仅读契约，未核实现或复现泄题／绕过，不据此禁用所有关键词玩法。

[研究] 关键词先作候选事件，执行侧重核进度、角色权限与前置条件；输入按可知范围过滤，不能只提示保密。作者仍设计知识、线索与答案；这是契约推导，非Vaudeville内部审计。

### 4. 撤回条件与证据缺口

[研究] 固定内容足够则撤生成；开放表达是玩法本体时，固定回复只是有损降级。断网需明确暂停恢复、固定内容或独立本地配置，按设备／语言／质量验收；延迟含识别、排队、生成、播放，无横向数据可设统一门槛。

[研究] Steam单篇经公开HTTP核正文／日期，解析器只读到[公告合集](https://steamcommunity.com/app/2240920/announcements/)。同作者多公告不算独立样本；同题玩法与全程费用／支持成本对照仍缺，未下载模型或付费调用。

## 效果叠加补研：来源所有权不等于合并规则

核实：2026-10-15（UTC+8）。[研究] §7补来源与合并规则：其他来源仍有效或施放结束而毒应持续时，“取消就清标签”不足；先定谁维持、重复如何合并。

### 1. OpenRA：来源退出只撤自己的授予

[一手] OpenRA 固定主干`e180e3225f3930272dd451917467631618f8976f`（2026-10-11 UTC）；完整消费者链如下：

| 固定来源 | 实际机制与边界 |
|---|---|
| [Actor.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Game/Actor.cs) | GrantCondition 分配独立整数 token；UpdateConditionState 从该条件的 token 集合计算数量；RevokeCondition 只移除指定 token。无效 token 会抛异常，因此底层不是幂等释放 |
| [ProximityExternalCondition.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Mods.Common/Traits/Conditions/ProximityExternalCondition.cs) | ActorEntered 为目标保存 token；ActorExited 先移除本地记录，再以 self 和 token 请求撤销。所有权变更另有重新判断路径，不只等计时到期 |
| [ExternalCondition.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Mods.Common/Traits/Conditions/ExternalCondition.cs) | 永久 token 按 source 分组；TryRevokeCondition 核来源；限时 token 各有到期 tick。SourceCap／TotalCap 达到限制时可能替换最早到期的限时授予，不是简单拒绝所有新授予 |
| [TS nod-structures.yaml](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ts/rules/nod-structures.yaml)、[TS defaults.yaml](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ts/rules/defaults.yaml) | 真实隐形发生器以 ProximityExternalCondition 授予 cloakgenerator；消费者 Cloak 的条件为 cloakgenerator 或 crate-cloak，证明多个授权入口确实用于游戏规则，不只是未用样例 |
| [RA defaults.yaml](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ra/rules/defaults.yaml)、[DamageMultiplier.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Mods.Common/Traits/Multipliers/DamageMultiplier.cs) | Iron Curtain 条件连接覆盖色、计时条和 Modifier=0 的伤害修饰；修饰器禁用时返回 100。这说明效果状态与表现可共享条件，但不证明任意计时 UI 都准确 |

[研究] 重叠来源需分别退出时，从活授予推导状态；数量用计数，撤回权限／重复释放用来源句柄。句柄不解决清理顺序、重生、序列化；单一不重叠所有者仍可用布尔值。不为此移植OpenRA trait／YAML。

[一手] 项目自己的 [Conditions Wiki](https://github.com/OpenRA/OpenRA/wiki/Conditions)列出实际光环、铁幕与 EMP 使用；页面示例明确针对旧 release-20180307。本次采用上述固定现行路径核实，不把旧 Wiki 的 structures.yaml 路径当当前文件布局。

### 2. Shattered Pixel Dungeon：重复施加未必产生独立层

[一手] 独立作者的回合 roguelike SPD 固定`57a4e06a4caf162446d1c28caa7983f0493fecf0`（2026-10-06 UTC，v4.0.2 发行更新）：

- [Buff.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Buff.java)：append 创建新实例，affect 优先取同类现有实例；prolong 经 affect 后调用 postpone。按类 detach 会遍历该类效果全部撤销，不能当成某一次施放的独立释放
- [Actor.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java)：spend 增加调度时间，postpone 仅在原时间早于 now＋duration 时向后延。因此 prolong 是保留更晚结束点，不能从名字译成无条件时长相加
- [PotionOfHaste.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/potions/PotionOfHaste.java)实际使用 prolong；[FlavourBuff.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/FlavourBuff.java)到调度时刻 detach。这是单一可延期效果，不是每瓶药各建一层计时
- [PoisonDart.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/weapon/missiles/darts/PoisonDart.java)调用 affect(Poison).set；[Poison.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Poison.java)的 set 取 left 与新 duration 的最大值，另一个 extend 方法才加长；每次伤害由 left/3 的整数部分加一计算。到期或目标死亡 detach，存档保存 left

[研究] 独立层、max与sum会改变毒镖伤害和重复收益，配置改动也是平衡修改。由人选合并规则，不推广成所有毒都合一；回合调度不可直接换成帧时钟。

### 3. Unity 与 UE 的采用边界

[一手] [Unity 6.3 SO 手册](https://docs.unity3d.com/6000.3/Documentation/Manual/class-ScriptableObject.html)支持多对象引用共享数据。[研究] Unity 用角色组件持有活效果／来源，剩余时长不回写定义。少量固定规则无需通用编辑器；已有合规模块先核合并键和移除范围，避免另建同名异义层。

[一手] UE 5.8 公开 GAS 文档：非 instant 效果的[StackingType](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingType)中 None 为每次独立实例，AggregateBySource／AggregateByTarget 分别按来源／目标聚合；[持续时间策略](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingDurationP-?lang=en-US)分刷新、不刷新、加时长；[到期策略](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingExpiratio-)分清整栈、减层后刷新、只刷新。采用已读的官方缩短路径正文，最初的长 URL 获取失败，未用第三方教程补证。

[研究] 已用GAS先核原生策略；按来源聚合不等于逐次计时，到期减层不等于历史施放各自到期。合并键与撤销粒度须一起定；未核受限源码／Lyra，枚举不证明预测、网络、驱散、句柄全部正确。

### 4. 窄二改题、许可与验证范围

[研究] 后续预注册：原有冲刺保护增加一个保护光环，再给毒镖增加可选叠加升级。基线与修改后使用相同遭遇，逐项记录有效来源、剩余时间、伤害及玩家可见图标；不预先增加框架。

| 待证规则 | 对照输入与期望，由设计先确认 |
|---|---|
| 独立保护来源 | A 生效→B 生效→A 结束，B 仍保护；再 B 结束才移除。重复 A 清理不影响 B；重复是否报错由边界契约决定 |
| 时长合并 | 原剩余 8，新施加 3：max 保持 8，刷新为 3，相加为 11；独立层则是 8 与 3 两个计时。这里是规则示意，非任何游戏的实测结果 |
| 效果与施放寿命 | 冲刺结束只释放冲刺保护；毒命中后施法者死亡是否保留按设计断言，不默认清光目标状态 |
| 驱散与恢复 | 指定来源、清一层、清整类分别测试；驱散后立即重施、旧回调迟到、目标重生不得删新效果 |
| 可读性 | 两光环重叠及毒升级前后，让玩家解释图标数量、剩余时间和重复使用收益；图标没消失不自动证明伤害规则正确 |

[一手] 文件头及[OpenRA COPYING](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/COPYING)、[SPD LICENSE.txt](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/LICENSE.txt)均为GPL-3.0-or-later；直接复用须处理分发义务及素材权利，不作闭源Unity／UE即插模块。

**范围 [研究]**：上表用例、帧时序、AI二改成功率均未测；独立review与仓库离线检查仅核知识库交付。

## 导航补研：通路、局部让路与停止位置

核实：2026-10-15（UTC+8）。[研究] 05 §3补导航选择：任务结束／有路径不等于移动自然。追击堵塞先分通路、让路、停距，再评估原生能力，不默认升BT、重算频率或人群框架。

### 1. 先过许可，再借真实游戏的局部机制

[一手] Overgrowth [245fe482](https://github.com/WolfireGames/overgrowth/tree/245fe4828631c84c0023d29d1525f5716ccb6106)（2025-03-20）根LICENSE／README／enemycontrol.as为Apache-2.0，代码可依条款复用，原美术关卡另核；仓库由社区运行，源码可得不保证维护。[研究] 不移植自研引擎底座，Factorio复盘不授素材源码，原生组件仍循各引擎条款。

**碰撞政策改变拥堵。** [一手] [FFF316，2019-10-11](https://www.factorio.com/blog/post/fff-316)：群组各自攻击后虽有路径却互挡绕转，团队取消同类硬碰撞、保留 separation 减少堆叠，并承认可能需要调整平衡。[研究] 借此诊断拥堵；依赖堵路、推挤、卡位的玩法仍须保留身体规则，不能一律穿同类。

**走到哪与如何停／让分开。** [一手] [enemycontrol.as](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/enemycontrol.as)：GetRepulsorForce（3295–3330）累加同队排斥并发 excuse_me，消息（1021–1022）设置 move_delay；GetCheckedRepulsorForce（2651–2661）用 NavRaycast 限制排斥；GetNavMeshMovement（3075–3121）按 target_dist／strafe_vel 投射接近与侧移目标，停距减速后加受限排斥并限方向长度。[研究] 仅借职责划分，未证明参数适合其他游戏，或物理碰撞已完全消除。

### 2. 重寻路不能统一加速，也不能统一节流

[一手] [FFF121，2016-01-15](https://www.factorio.com/blog/post/fff-121)：短距离直行／局部启发式会卡角落，另复用路径中段并缓存不可达结果以减少昂贵搜索。[研究] 机制针对该游戏规模与请求分布；未核通路改变后的缓存失效实现，不据此要求小项目自建缓存。

[一手] Overgrowth 同文件 GetNavMeshMovement（2974–2991）每次进入调用 GetPath(target_point)；GetPath（2526–2538）重新查询、重置路径点，接近／侧移还会重查。[研究] 先沿用原生移动目标跟随；查询实测成热点才比目标变化阈值、时间预算或复用，同时保留急转响应与障碍更新的正确性。静读不能判它慢，Factorio 也不支持统一低频或毫秒间隔。

[一手] Overgrowth [navmesh.cpp 的 FindPath](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/AI/navmesh.cpp#L874-L957)还区分 partial result 与终点多边形是否真正到达。[研究] 读到非空路径不能自行判“到达目标”；这与已有 Behavior 不可达终止契约相接，不另造任务框架。

### 3. 原生能力的具体采用边界

- **Unity，AI Navigation 2.0.16**：[AboutObstacles](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/AboutObstacles.html)说明未 carving 的障碍主要通过短距离局部避让处理，拥挤障碍可能绕不过去；会堵路但通常静止的箱子等适合 carving。默认 Carve Only Stationary 在移动时移除洞，稳定达到时间阈值后再更新；大而缓慢移动的障碍可选择移动超阈值时更新。NavMesh 查询须考虑修改后一帧才生效。[一手] [研究] “动态”不是一律每帧重建网格或全都 carving；移动人群与改变通路的门／箱子应分别处理
- **Unity 位移权**：[MixingComponents](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/MixingComponents.html)要求信息单向流动，Agent 与非运动学刚体、Root Motion 争写会冲突；Agent 与 Obstacle 同时启用会自我避让，carving 更可能使其不断映射到洞边。动画跟随速度的简单方案仍可能脚滑。[一手] [研究] 因此声明一个最终位移所有者，不能把行为节点成功当成动画与运动一致；不在此重复动画专题
- **UE，公开文档显示5.8**：[Using Avoidance](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-avoidance-with-the-navigation-system-in-unreal-engine)区分 CharacterMovement 的 RVO 与 Detour Crowd，要求二者独立择一使用。RVO 不使用 NavMesh 约束，可能走出边界；Detour Crowd 结合走廊可见性／拓扑优化，最大 Agent 数量由设置限定。[一手] [研究] 已满足需求的方案保留；需要走廊约束／更可配群体行为时再评估 Detour Crowd，核半径和数量，不叠开，不把 Unity carving 的时序映射成 UE 承诺。这里未证实任何 UE 特定项目的运行时障碍更新配置

**门还涉及角色能力与动作（2026-10-20，UTC+8核实）。** [一手] Unity AI Navigation 2.0.16 的 [Areas and Costs](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/AreasAndCosts.html)用人类能过门、僵尸不能过门解释 AreaMask；区域也可赋给 NavMeshLink，路径成本只表示偏好。Unity 6.3 [CompleteOffMeshLink](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AI.NavMeshAgent.CompleteOffMeshLink.html)说明关闭自动通过后 Agent 停在链接上等待完成调用，Agent 在链接上时该调用会移到另一端有效 NavMesh 位置，并非动画完成通知。[研究] 先用原生过滤／链接表达适合的通路，已有状态负责开门、等待与通行，完成前或被打断时勿提前调用完成。AreaMask 按区域类别过滤；单门动态状态、个体钥匙／权限仍需项目同步，不能为一个无钥匙角色全局禁用链接而误挡有钥匙者。自由通行门可保留原表示，不要求每门建链接，也不把 Unity 时序外推到 UE。

[一手] OpenMW 已合并 [PR2510](https://github.com/OpenMW/openmw/pull/2510)，固定 [6861d9d5](https://github.com/OpenMW/openmw/commit/6861d9d5e52fada169b44ebe202ce8ba2f9d52c6)：openDoors 排除空路径／游荡，检查近门是否在角色到下一路径点之间，并保留非传送门、无陷阱、未锁定等条件。[合并前评审](https://github.com/OpenMW/openmw/pull/2510#issuecomment-554765044)认为本修订可用，另记录跟随者走向锁门而舍弃附近未锁门，注明与本 PR 不直接相关。[研究] 这是历史并存的选路反例，支持把动作与路径资格分别处理，不表明修订引入该缺陷或最新版本仍有缺陷。只借机制；[固定版 LICENSE](https://github.com/OpenMW/openmw/blob/6861d9d5e52fada169b44ebe202ce8ba2f9d52c6/LICENSE)为 GPL 文本，不把引擎代码当闭源即插模块。

[一手] [PR2494 作者自测](https://github.com/OpenMW/openmw/pull/2494#issuecomment-522138065)在五个地点反复战斗／关门，旧路径检测374次、均值约13.4μs，近门查询2999次、均值约2.5μs；前者单次较贵、累计反而较少。2510作者称改用较便宜的包围盒相交检查；未附新旧同条件对照。2494回滚是[误点合并](https://github.com/OpenMW/openmw/pull/2494#issuecomment-525438103)，不是运行失败后的撤回。[研究] 这些旧测量不证明2510收益或目标项目预算；增加检查与权限同步是可见实现成本，工时和净收益未知。已有原生能力满足时保留，仅在具体门规则表达不足时补局部交互，不借此升级导航框架。

### 4. 后续只预注册一个二改遭遇

[研究] **二改预注册**：追击停距基线增加同队敌人与堵门箱；同房间验目标反向、堵门移开、窄门会车、追击转攻击／眩晕、退出重启。另核同门不同角色能力、锁门旁有未锁门、开门途中打断；记通路、目的地、期望／实际位移、停距与旧请求。

[研究] 真人核摆动、贴墙、急转、脚滑、挤叠及身体卡位；测查询与移动总成本。原生满足即停；让路导致越界、错停或破坏卡位时收窄／撤回，不继续叠平滑。AI补生命周期与轨迹，人定碰撞、停距和自然度。


## 关卡组合补研：连通之后还要选择什么

**核实：2026-10-15（UTC+8）；主线一／三，GC。** [研究] 05 §9：稳定动作空间先组合现有房间，地形探索可用受约束布局；数量／连通率不代体验，不要求自建框架或逐seed人审。

### 1. 两类游戏，借不同的小机制

- **Dead Cells，横版动作。** [一手：Sébastien Bénard 历史复盘] [The Level Design of Dead Cells](https://deepnight.net/tutorial/the-level-design-of-dead-cells-a-hybrid-approach/)按世界连接、用途／biome 房间、概念图组织长度、特殊房间和出口间隔，敌人另受空间及同平台组合限制。原文 Gamasutra、此为作者转载，非新算法。[研究] 借用途与连接条件→组合→遭遇限制的次序；房间仍由人设计，作者称当时 Director 已所剩很少，不移植整套或提取资产，也不据此声称 AI 省掉内容设计。
- **Cogmind，回合探索。** [一手：Josh Ge 历史复盘] [2019 程序布局](https://www.gridsagegames.com/blog/2019/03/roguelike-level-design-addendum-procedural-layouts/)从出口恢复／逃生价值定出入口，再约束回环、开阔空间、房间尺度，支持部分／全部程序布局并剔除不合参数的图。[研究] 反证并非所有游戏都该拼房；借玩法空间目标，不移植整个生成器，俯视全图观感不代探索体验。
- **内容分配另定。** [一手] [Cogmind 2015 Map Composition](https://www.gridsagegames.com/blog/2015/05/map-composition/)对洞穴／主区域分开分配气氛、免费收益、风险收益与危险遭遇，显示分布供调整。[研究] 既有遭遇按用途核路线，不要求每房战斗或均撒奖励。

**设计意图不等于落地。** [一手] [Dungeon Metrics](https://www.gridsagegames.com/blog/2014/07/dungeon-metrics/)的 2014 正文提出偏僻程度与奖励关系，但作者 2015-11-06 评论明确物品未直接这样分配。[研究] 不能声称 Cogmind 实现“越偏僻奖励越好”；最短路只作辅助，不代未知地图真实路线。回环、喘息、绕路奖励按玩法选，不设统一阈值。

### 2. 固定开源调用链：规则确实被消费，但不推荐整套接入

[一手：源码静读] Shattered Pixel Dungeon **v3.2.4，提交 fdb10fc77914000af0907ac63f561ff21279115b**：

1. [RegularLevel.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/RegularLevel.java#L104-L119)的 `build` 先取 `initRooms`，清连接后调用 builder，返回 `null` 则重试，成功后交 painter；其默认 `builder()` 在 LoopBuilder 与 FigureEightBuilder 中选择，不能写成所有关卡都只有单环
2. [RegularBuilder.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/builders/RegularBuilder.java#L89-L130)的 `setupRooms` 按入口／出口、商店与 `maxConnections` 分组，消费 `pathLength`、扰动权重及房间尺寸来挑主路房间；这些不是只声明未使用的标签
3. [LoopBuilder.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/builders/LoopBuilder.java#L73-L173)把入口置首、出口插入主路序列中段，布置并接回入口，然后追加分支和可能的相邻连接；放置失败可返回 `null`。这证明拓扑意图在生成前／中被实施，**不证明**每条玩家路线等长、资源充足或生成耗时有上界

[研究] ✅ 借分层顺序和少数规则；⛔ 不将 Java／LibGDX 整游戏当 Unity／UE 插件。[一手] [源码许可](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/LICENSE.txt)为 GPLv3，所读 Java 头允许 v3 或后续，不能直接作为闭源宽松许可底座；未复制代码、未核美术／关卡独立授权。Dead Cells／Cogmind 仅公开设计说明，无代码／内容复用许可。

### 3. 单人采用与二改预注册

[研究] 沿合规房间、遭遇与编辑器，程序员仍做内容设计。自动查可达、资源条件和敌群不兼容，人抽看代表／极端组合的压力、绕路机会与应对空间；不判所有空白为坏。房间按用途连接，探索布局按空间目标。

[研究] **二改预注册**：新增敌人／房间，保留旧规则与正常／极端种子，记违约、重复路程、资源位置、例外；同内容目标比较组合与程序布局，以试玩选择而非种子数判断。逐房修补过多则缩组合或换模块。


**结束条件与奖励（2026-10-15，UTC+8）。** [研究] 布局之外还核跳过清理是否缺下一关成长。风险取舍玩法先改目标／收益再加房间；清场刷宝本身有趣则保留。

- **Rogue Legacy，动作平台。** [一手：Teddy／Kenny Lee 作者复盘] [GDC2014 讲稿](https://media.gdcvault.com/GDC2014/Presentations/Lee_Teddy_Rogue_Legacy_Design.pdf)PDF 第16–17页说明，逐层成长使跳过清理的玩家被后续敌人数值甩开；团队移除城堡内的角色成长，把 RPG 提升放在死亡后、再次进城前。第27–33页另述为避免平均加点而采用升级一项、其他项也涨价的经济补丁；作者承认它惩罚随意升级者，坏处明显而原因不清，仍因实现便宜而接受。[研究] 借“成长安排改变是否敢离开”的机制，不推成所有游戏都应局外成长，也不误写为没有局内金币／装备收益；低实现成本不等于低体验代价。
- **Into the Breach，回合策略。** [一手：Matthew Davis 作者复盘] [GDC2019 幻灯](https://media.gdcvault.com/gdc2019/presentations/Into%20the%20Breach%20Postmortem%20Final.pdf)PDF 第20–22页把防守、操纵敌人与限回合结束联系起来，为非致命武器留下价值；第39–43页记录战略层未遵循战斗约束、研究系统不佳，最后削减并从明确奖励重新构建。[研究] 借“结束条件支持想要的动作”，不照搬回合数或删研究树；这是已有可读性引用之外的设计证据，不能证明所有清场战斗无趣。

[研究] 沿Encounter目标、一次结算与存档改：只改开门却仍须刷满成长，问题仍在；取消交战收益也会削弱战斗动机。核目标／时限表达、掉落、购买力、挑战与旧档；限时挤压观察、防守变等待时连敌人压力和奖励重选。

[研究] **二改预注册**：同敌人动作比较全清与目标完成可走；观察停留／离开理由、下一场资源，验重复完成、重返、读档不重发奖。AI记路线收益，人判断选择，时长缩短不等于更好；作者团队含美术，不能据此证明零手绘可复现。

## 受限动作补研：开放意图不等于更强战斗 AI

核实：2026-10-15（UTC+8）；主线二／三。[研究] 03 §2区分规则战术与开放意图的语义缺口；动作名合法不代表对象、时机、结果正确，执行寿命沿05。

### 1. 三个作者体系分别支持什么

- **Factorio：规则服务策略。** [一手：StrangePan／Earendel 历史复盘] [FFF425（2024-08-23）](https://www.factorio.com/blog/post/fff-425)说明跨墙敌人若攻击全厂会逼玩家处处布防，故用 Gleba 孢子排放集中攻击设施。[研究] 规则已能产生所需战术就保留；没有效用、行为树或 LLM 的性能对照，脚本、评分、BT 分工仅本文建议。
- **Mantella：语义到动作。** [一手] Python 固定`c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac`（2026-07-16），Skyrim 端`0c5f8513aff61cda1f32c81a962eee36ba74fdb7`（2026-07-11）。[Follow定义](https://github.com/art-from-the-machine/Mantella/blob/c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac/data/actions/follow.json)把被说服同行角色列入 source、范围 conversation，标实验性且可能破坏 NPC AI packages。[研究] 仅作“自由说服→指定同行”窄候选，回复不等于行动；非完整原创商业游戏或留存证据。
- **GoodAI：有动作不保证有挑战。** [一手：历史作者说明] [2024-04-29 FAQ](https://www.goodai.com/ai-people-announcing-the-next-evolution-of-gaming-ai-npcs/)称环境／人物／记忆进模型、游戏执行动作并回传失败，也承认会声称交物而世界未发生；[2024-09-19 Alpha说明](https://www.goodai.com/ai-people-alpha-officially-released/)定位技术概念验证、挑战有限且起初无终局目标；[2025-04-30公告](https://www.goodai.com/ai-people-entered-the-closed-phase/)无限期关闭当前版本、重新考虑玩家参与感，[现行入口](https://www.goodai.com/ai-in-games/)仍为封闭开发。[研究] 产品状态与作者解释不能证明 LLM 导致关闭，新颖行为不代玩家价值，也非当前可直接试玩候选。

### 2. 固定调用链：required 与兼容回退为什么还不够

[一手：源码静读] 上述两个快照未核发行配对，实际消费链如下：

1. Python [function_manager.py](https://github.com/art-from-the-machine/Mantella/blob/c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac/src/actions/function_manager.py)的工具定义构造会传出 `required`，但 `_validate_arguments_against_schema` 只筛掉未知参数名，没有在这里验证必填齐全或类型。`parse_function_calls` 遇畸形 JSON 将参数置为空字典；空字典仍可生成只含 identifier 的工具结果。有效参数存在时则另有角色范围过滤。不能将函数名里的 validate 理解为完整契约验证。
2. Skyrim [MantellaConversation.psc](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaConversation.psc#L660-L708)按是否有 arguments 字典选择 advanced 或 legacy 事件。advanced [Follow处理器](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaAdvancedAction_Follow.psc)按 source 名称解析会话 Actor，再设置 WaitingForPlayer、faction，重启 follower quest、EvaluatePackage；真正的移动交给原有游戏系统。
3. 同版 [legacy处理器](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaAction_OffendForgiveFollow.psc)在会话可取得时遍历参与者，使符合条件的非玩家 NPC 跟随；只有会话不可取得才退到 speaker。它与路由处“缺参数回到 speaker-only”的注释并不等价。[研究] 这是静读可见的作用域扩大路径，未运行重现，不能声称玩家必然遇到；但足以拒绝“有白名单／JSON required就可安全执行”的采用理由。

[一手] [#441](https://github.com/art-from-the-machine/Mantella/issues/441)记录多人会话将`Npcname: Follow:`念作台词，2025-12-11 标由[Spell #128](https://github.com/art-from-the-machine/Mantella-Spell/pull/128)修复关闭。[研究] 这是已修历史问题，与上述缺参数路径分开；关单不能证明所有模型／多角色动作可靠。

**采用 [研究]**：执行侧重核允许动作、精确对象、前置条件和活任务；缺字段、无对象、超时／取消后回包拒绝或保持状态，不能扩大到全体。说服阈值、拒绝权与错误的玩法作用由设计定；有效JSON不等于授权或执行成功。

### 3. 后续窄对照与撤回，不在本轮运行

[研究] **预注册**：指定角色同行，同状态／地图／执行器／取消下比菜单规则与LLM开放措辞。只有额外策略才有采用理由；同义改写按钮则保留规则。觅食、撤退、排序无开放语义缺口时沿规则／评分及05生命周期。

- 正常：指定 A 同行，检查 A 实际进入跟随且 B 不变；拒绝、撤销与再次邀请分别保留明确结果
- 失败：缺 source、未知角色、角色离场、回复到达前取消／死亡、重复回包；不得扩大目标或让旧请求重启跟随
- 玩法：玩家是否能解释为何同意／拒绝、是否获得菜单无法表达的有效策略；不能只问“像不像真人”，也不以动作有效率／战斗胜率代替体验
- 成本：记录从请求到世界响应的等待、超时、每段游玩调用与费用，以及新增一种角色限制后的修改成本；阈值按本玩法节奏和发行预算预先决定，不发明统一毫秒或价格门槛

[研究] 无额外选择保留基线；错对象、虚假交付、迟到动作则撤接口待修；超等待／费用预算先缩频率角色，仍不够则撤。核心开放交涉退成菜单会改玩法，须承认重做成本。

[一手] [Mantella LICENSE](https://github.com/art-from-the-machine/Mantella/blob/c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac/LICENSE)为AGPLv3，[Mantella-Spell LICENSE](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/LICENSE)为MIT；不作闭源即插模组，Skyrim内容、模型、TTS、服务另核。Factorio／GoodAI文章不授游戏复用权。

**历史验证 [研究]**：本单元独立审查及14阶段离线（非空无skip）、diff检查通过，仅核文档；Skyrim固定路径不证明Unity／UE插件同实现。

## 学习迁移补研：按提示完成之后会不会主动使用

核实：2026-10-15 UTC；主线一／三／四。[研究] 05 §9比较强制步骤、按需帮助、可选练习；控制可用／步骤完成不代学习迁移，不默认每机制做教程。

### 1. 两条竞争路线：帮助时机与自主选择

- **Factorio：按需帮助。** [一手：历史作者解释] [FFF361（2020-10-09）](https://www.factorio.com/blog/post/fff-361)把逐页提示改为索引、搜索、条件推荐并统一微教程；基础说明用 tooltip，tips 处理组合与误解，易过时截图换成真实模拟演示。[研究] 借分工／回查，已有场景短演示够用就不另造嵌入式模拟器；触发、内容、示例需维护，通知也会被忽略。
- **Outer Wilds：可选练习。** [一手：开发中作者复盘] [Filling Out The Toolbox（2016-05-27）](https://www.mobiusdigitalgames.com/news/filling-out-the-toolbox)将强制工具链改为沿途练习：原流程让玩家照做，进开放世界却不知下一步，遂强调可做什么。作者承认可选教学会被跳过、多用途探测器难教，用场景示意工具用途仍只是设计意图。[研究] 寻找目标有价值时可试；代价为漏学及练习内容成本，无受控结果支持其普遍更好。

### 2. 固定实现：触发与已读不代表掌握

[一手] `wube/factorio-data@374934f81f82b09ec9fc459f92a316bd642ddd82`（2026-10-06）的实际消费链：

- [base/data.lua L50](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/data.lua#L50)加载 `prototypes.tips-and-tricks`
- [bulk-crafting L208–229](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/prototypes/tips-and-tricks.lua#L208-L229)以连续单件下单5次触发提示，连续批量下单3次满足 `skip_trigger`，绑定相应 simulation
- [ghost-rail-planner L1685–1732](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/prototypes/tips-and-tricks.lua#L1685-L1732)组合玩法条件与已有操作，并依赖 `ghost-building`、`rail-building`
- [官方 TipsAndTricksItem 契约](https://lua-api.factorio.com/latest/prototypes/TipsAndTricksItem.html)本次页面显示 2.1.21：`skip_trigger` 取消通知但保留列表入口；`dependencies` 依赖前项标记已读。版本化 URL 本轮未取得正文，不把 latest 链接声称为永久固定版本

[研究] 行为计数可减少打扰，不证理解／迁移；不照搬5／3阈值，已读、做过、学会分开。公开数据不含完整可审计的教学引擎运行时。

[一手／研究] [固定 README](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/README.md)将公开原型用于mod、版本查看与讨论；未核跨游戏通用开源／AI输入许可，只引机制和短字段，不作Unity／UE底座。

### 3. 反例：少指导与完成率都不能单独作为目标

[一手] [FFF213（2017-10-20）](https://www.factorio.com/blog/post/fff-213)记录无顺序微教程的问题：未懂 ghost 就学幽灵铁轨，未懂火车就学信号，因此增加依赖建议。[研究] 保留关键知识的明确教学机会，不把可选练习误写为所有前置条件都能省。

[一手] [FFF342（2020-04-10）](https://www.factorio.com/blog/post/fff-342)同时报告旧 NPE 获得正面新玩家反馈、却仍决定撤回：任务式演示吸引的受众，在正式游戏得不到同类后续内容。[研究] 教程易懂或受欢迎，也可能训练了错误的玩法期待；首玩完成不能代替正式关卡迁移。

[一手] [Outer Wilds 路线复盘（2016-08-18）](https://www.mobiusdigitalgames.com/news/the-intentionality-of-wandering)说明自由选择仍需线索，作者希望玩家有意识地选路，同时讨论怎样保留惊喜。[研究] 操作能力、值得调查的方向、谜题答案分开决定提示范围；自动提示若提前交出本应发现的用途，可能损害核心体验。该边界是设计推导，不是本轮测得的剧透影响。

[一手：历史受控研究] Andersen 等[The Impact of Tutorials on Games of Varying Complexity（CHI 2012，pp.59–68）](https://grail.cs.washington.edu/projects/game-abtesting/chi2012/chi2012.pdf)在 Refraction、Hello Worlds、Foldit 随机分配情境提示、提前手册、锁操作、按需帮助。复杂度未跨游戏随机操纵，操作范式、下载门槛、经验及自选择人群可能不同；帮助按钮跨条件汇总无一致收益，Hello Worlds 返回率在 Table 3 与正文方向冲突。时长、完成关卡、返回行为也不能证明无指令主动使用／迁移。[研究] 选型看目标玩家经验和真实误解，不能仅按复杂度／“可选”再叠帮助入口；这是 Flash 解谜／平台及蛋白质折叠游戏时代证据，非当前 AI 收益。

### 4. 窄二改预注册与撤回条件

[研究] **预注册**：选玩家能执行却不主动用的一项工具，比短提示／回查与可选练习。分记按指令完成、解释适用情境、无指令变形情境主动使用，不合成教程通过率。

[研究] 二改用途／操作后核说明、绑定、触发、前置与示例。漏硬前置就明确教；正式玩法要探索却只等任务，就减强制步骤、补回查；无真实误解保留物件说明。AI做局部触发与采集，人定必须教什么、留下什么发现。

**特有缺口 [研究]**：跨游戏设计比较不代同玩法对照；无学习／留存收益实测。建议与Unity／UE及联网无关。


## 辅助取舍补研：局部调整、整局预设与切回规则

核实：2026-10-15（UTC+8）；主线一／三／四。[研究] 05 §9按阻碍选局部辅助或整局预设，声明生效／关闭政策；依据为Dead Cells 29历史补丁及Cogmind设计、发布后回顾。

### 竞争选择与一手反例

- **Dead Cells 局部选项。** [一手：历史补丁] [Dead Cells 29 系列](https://deadcells.com/patchnotes/29)将按住跳／滚、盾牌切换、输入自定义与 Assist 分列；Assist 含敌人伤害／血量、陷阱伤害／速度、格挡窗口。29.2 修关闭后子项仍生效，29.3 修 Multiple Lives 特定死亡软锁，说明菜单与规则／失败路径须同维护，非当前仍坏。另有读档敌人／Boss 复满血修复但未归因 Assist，也未证所有项安全即时切换。[研究]
- **Cogmind 整局预设。** [一手：作者设计] [Adjustable Difficulty（2017-02-16）](https://www.gridsagegames.com/blog/2017/02/adjustable-difficulty/)为计分一致将难度限下局生效、榜单分模式，调警戒压力、遭遇、出口信息而非仅伤害。作者区分练标准与探内容的人，认为低压可能不教标准所需应对；属取舍风险，非学习实验或现版全参数核验。[研究]
- **发现入口。** [一手：作者观察] [Rebranding Difficulty Modes（2019-09-17）](https://www.gridsagegames.com/blog/2019/09/rebranding-difficulty-modes/)称手册、菜单、死亡提示仍被漏看，改首次启动显式选择及 Explorer／Adventurer／Rogue 命名；[2022-05-08 回顾](https://www.gridsagegames.com/blog/2022/05/kyzratis-game-design-philosophy/)报告较易模式使用增加但仍少数，未隔离命名贡献或证留存。[研究]
- **信息权限。** [一手：同上 2022 回顾] 已警觉敌人位置曾全体可见，标准玩法优势过大后从 Rogue 撤出。[研究] 提高信号可达与揭露未知分开，不删标准必要提示或判所有轮廓越权。

### 最小采用与撤回边界

[研究] ✅ 沿设置／规则配置：单项按键／时机负担用局部选项；资源、遭遇、探索需协调时用少量明确预设。全局降速可有意保留，核节奏、其他时钟与操作；不必暴露所有参数。

[研究] 当局调减少重开，下一局生效保持规则／计分归属。说明生效点、关闭恢复、跨档／新局保留、进度计分；关闭不会抹掉已得进度／已知情报，不统一锁成就或惩罚辅助玩家。

[研究] 探索模式不必是标准模式训练。承诺练习则保留相应决策机会，目标是内容可多改规则；较易模式成功不证明标准掌握或各区域等比例变易。

### 第二次修改：只预注册，不运行

[研究] **二改预注册**：新增敌人／辅助，验支持组合的启用、关闭／新局、死亡重试读档；核情报切回、计分归属和进度保留。不穷举滑杆；AI追消费恢复，人验目标体验。

**特有缺口 [研究]**：未核成就解锁政策、当前存档兼容或学习／留存收益；历史补丁与作者观察仅支持各自维护风险和取舍。

## 屏外威胁补研：补信息还是改攻击

核实：2026-10-15 UTC。主线一／三；在既有“无解先改空间”的建议上，进一步区分视口外但规则允许获知的信息、角色未发现与已经承诺的攻击。新证据为三个作者的不同方案及 Shattered Pixel Dungeon 固定结算路径；不重复 04 的信号强度或 05 的相机实现。[研究]

### 三种选择及代价

- **可知信息超视口：补查看。** [一手：2024-02-11 作者记录] [Cogmind 放大视图 QoL](https://www.gridsagegames.com/blog/2024/02/adventures-in-map-zooming-part-5-qol/)用边缘标记补放大损失、避开已显示机器人，支持聚焦敌群再返回；普通可见／传感器信息表现不同，范围参照未放大窗口。[研究] 可在行动前查看才适用，非实时转移视图安全证据；屏外不自动等于未知或可揭示，不复制整套 UI。
- **路线造成屏外受击：先改布局。** [一手：2020-01-21 作者复盘] [Specter of Torment 房间设计](https://www.yachtclubgames.com/blog/specter-of-torment-level-design-deep-dive-2-5/)在进房过渡以触手入镜、颜色、运动介绍 Grapps，并以天花板防从画面上方绕过后屏外中招。作者反对放慢伸出，免误示可抢跑。[研究] 空间理解不足时，封不当路线可比警报有效，但会减自由度。
- **受限视野是本体：改攻击应对。** [一手：2023-06-30 开发中访谈] [Luna Abyss 设计者／程序员](https://www.unrealengine.com/developer-interviews/how-unreal-engine-empowered-a-small-team-to-build-luna-abyss-beautiful-bullet-hell-prison)称第一人称弹幕要在面向攻击者时从前方来，背对时靠慢弹／长预告及声音留转头时间，身体边界不可见则加宽弹隙。[研究] 团队“避免不可见伤害”未独立复测；它保扫视躲避时间，Grapps 需迅速封路，不能统一“都放慢”或迁移速度／间距。

### 固定实现反例：不显示演出，不等于不结算

[一手：源码静读] `00-Evan/shattered-pixel-dungeon@57a4e06a4caf162446d1c28caa7983f0493fecf0`：

- [Eye.java L91–148](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Eye.java#L91-L148)：`canAttack` 用 Eye 自身的 `fieldOfView` 与弹道判断；蓄力后条件不再满足时仍可返回 `beamCharged`。`doAttack` 首先蓄力并消耗时间；释放时用玩家 `heroFOV` 判定是否播放 zap，只有本体位置与射线碰撞位置均不在 `heroFOV` 时，才走直接调用 `deathGaze()` 的分支。
- [EyeSprite.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/sprites/EyeSprite.java)：有 zap 动画时在完成回调调用同一 `deathGaze()`；蓄力声音另受 sprite 的 `visible` 条件限制。

[研究] 此链分开行动资格、角色视野与表现；heroFOV不是屏幕矩形，目标仍合条件时canAttack会更新弹道／位置，不是所有蓄力锁最初目标。未证所有情境公平；源码GPL-3.0-or-later。

### 最小采用与下一次内容修改

[研究] ✅ 沿技能与提示层声明玩家可知信息、察觉到反制的机会及出入画面对攻击的影响。表现裁剪不能意外改结算；可见仍躲不开就改方向／节奏／空间，放大漏掉可知对象才补查看。失去的信息不永久追踪，允许未知／突袭的玩法另定。

[研究] **二改预注册**：同混合遭遇加远程攻击，比正常／缩小视域，验起手后转开、回看、失去角色视野、静音减特效。核察觉反制及已承诺攻击继续／取消／重瞄；标记遮近敌、查看抢瞄准或转头意外冻结敌人时撤回。AI追路径，人定未知风险。

**特有范围**：仅读作者图示说明与实现，未实际播放视频、操作游戏或测识别；建议不依赖Unity／UE特性。

## 建造镜头补研：旋转缩放支点与输入入口

核实：2026-10-16（UTC+8）；主线一／三。[研究] 05 §8建造视图先定支点／入口；对照三维自由建造设计与二维等距修复，不把偏离都归于平滑。

### 1. Tiny Glade：按设备改变支点政策，不是修正坐标计算

[一手] [Patch 1.11.2 公告](https://steamcommunity.com/games/2198150/announcements/detail/543346166601876516)（2025-01-15）保留 PC 的 Cursor point：绕光标下方点旋转，向该点缩放；Steam Deck 默认改为 Center region，仍可切回。作者在旋转说明中解释，单一 Center point 虽精确、易理解，屏幕中心刚好在高塔旁时却可能选中背景；Center region 从中心附近方形区域寻找候选支点。公告把体验改善写成预期，没有提供玩家对照或区域选点算法。

[研究] 🧪 缺直接指向或单点常选背景时，比明确中心与有限区域；光标保直接指定。区域会推断意图，若更难预测就退明确支点，不统一改掌机默认或靠阻尼掩盖误选。

[一手：取得范围] 网页解析只得标题，[Steam 官方 GetNewsForApp API](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2198150&count=100&maxlength=0&enddate=1737072000&feeds=steam_community_announcements)提供完整正文：appid `2198150`、gid `1788945554756976`、author `anopara`、timestamp `1736947659`，官方 community announcements。未借转载或播放动图；2024 鼠标读取异常修复与本次支点设计不同因。

### 2. OpenRCT2：同一支点契约下删除多余拾取，按钮另修

[一手] [#12831](https://github.com/OpenRCT2/OpenRCT2/issues/12831)报告 v0.3 竖直地形面 zoom-to-cursor 偏移，复现为 Extreme Heights 边缘或抬高 4×4 地形。[#25042](https://github.com/OpenRCT2/OpenRCT2/pull/25042)于 2025-08-27 合入[85a0f70ae166cb5d240844c4dffad7c1c9fbbd76](https://github.com/OpenRCT2/OpenRCT2/commit/85a0f70ae166cb5d240844c4dffad7c1c9fbbd76)：`src/openrct2/interface/Window.cpp` 的旧路径取地图坐标、高度再按 tile 校正；新路径删两个辅助函数，仅`ZoomToCursor && atCursor`时依鼠标相对 viewport 位置与前后缩放级别补偿`savedViewPos`，再同步`viewPos`。目标仍保光标下的点，未改中心默认。

[一手／研究] 这是二维等距视口补偿，不是3D射线算法；仅保屏幕指向时可省拾取，透视旋转仍须按需找世界支点。作者及他人的主／额外视口测试只支持该修复链。

[一手] 同日[#25046](https://github.com/OpenRCT2/OpenRCT2/pull/25046)（[e4f36840bff585b4a3f5581cd2b4714f887b2c02](https://github.com/OpenRCT2/OpenRCT2/commit/e4f36840bff585b4a3f5581cd2b4714f887b2c02)）另将`src/openrct2-ui/windows/Viewport.cpp` 的额外视口按钮从直接改`viewport->zoom`接回`WindowZoomIn/Out(*this, false)`完整中心缩放。[测试反馈](https://github.com/OpenRCT2/OpenRCT2/pull/25046#issuecomment-3228516256)称按钮改善、滚轮仍异常，作者指向#25042；单入口通过不代整体。两修复均进 2025-09-06 的[v0.4.26 官方发行说明](https://openrct2.io/blog/2025/09/openrct2-v0.4.26-released)。

### 3. 最小采用与二改验收

[研究] ✅ 在已有相机／视口入口声明支点政策：直接指向、视口中心或有限区域候选；统一坐标归属与完整变换路径，不统一所有入口的支点。Tiny Glade 的可切回是设置选择，不是射线未命中时自动回退的证据；本节不据此新增自动回退机制。

[研究] **二改预注册**：高塔／陡崖＋另一输入／视口按钮，核中心、边缘、背景、视口边界及滚轮／按钮两路径。关平滑仍错位先修选点、坐标、命令；正确但突兀才调过渡。无具体缺陷保留原方案，AI追变换，人验意图。

**边界 [一手／研究]**：OpenRCT2代码GPLv3；Tiny Glade公告不授复用权。本节只核公开API、网页、提交与讨论，非Unity／UE等价配置或游戏实测。

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

## 感知补研：角色知道什么与导演调度什么

核实：2026-10-16（UTC+8）；主线三，GC。[研究] 05 §3补信息来源：躲避／误导有效时，保目标身份不授权搜索实时位置；执行、移动、玩家提示仍各沿原机制。

### 跨类型证据与反例

- **Homebody 恐怖探索。** [一手：Alex Belzer 创作者自述] 系统／玩法程序员及技术设计者的[项目页](https://www.alexbelzer.com/work/homebody)称远离玩家时加快巡逻，并用盲角支持甩脱和遭遇。[研究] 支持巡逻＋空间调压，未公开足以核实完整感知记忆的数据结构；对 Alien: Isolation／Resident Evil 2 及公平性的比较仅属作者解释，不是两作实现证据，GOAP 也不升默认。
- **SPD 回合 roguelike。** [一手] 固定`57a4e06a4caf162446d1c28caa7983f0493fecf0`的[Mob.Hunting L1284–1324](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L1284-L1324)分 enemy 对象与 target 格，enemyInFOV 时更新位置后移动；[后续分支 L1345–1411](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L1345-L1411)在无法靠近且失视时转游荡，逃跑也可用旧位置。[研究] 仅这些基类分支，不能证明所有怪物／子类／选敌都不读真值。
- **共享信息的反例。** [一手] 同版本[processSwarmIntel L298–323](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L298-L323)在群体智能挑战、追猎并感知目标等条件下，传位置给范围内未追猎同阵营怪物。[研究] 队友报告可合法，不要求人人只信亲见。
- **Left 4 Dead 全局调度。** [一手：Mike Booth／Valve 2009 讲义] [The AI Systems of Left 4 Dead](https://cdn.akamai.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf)第 69 页按队伍不可见区域及敌种选生成点，第 79–82 页估压力、调数量；Relax 时既有特殊感染者仍攻击。[研究] 导演读真值可合理，不等于角色持续精确定位；未揭示每只感染者的感知实现，不推荐整套移植或计作本仓实测。

### 原生入口：位置输入、感知状态与遗忘不是同一开关

- **Unity Behavior 1.0 文档渠道。** [一手] [节点清单](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/manual/node-types.html)分 Navigate To Location 位置与 Navigate To Target 对象，均用 NavMeshAgent，缺少时可退 Transform。[研究] 搜索用位置变量，勿被实时对象坐标覆盖；未核实目标刷新频率、内置感知记忆或各版本等价性，1.0 渠道不称最新发行。
- **UE 5.8 文档。** [一手] [AI Perception](https://dev.epicgames.com/documentation/en-us/unreal-engine/ai-perception-in-unreal-engine)分 Currently／Known Perceived Actors，刺激含 Age、Expiration Age、Stimulus Location、Successfully Sensed；Forget Stale Actors 配 Max Age 遗忘，0 为不遗忘。[Move To 任务](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-behavior-tree-node-reference-tasks)的 Track Moving Goal 随 Actor 更新路径。[研究] 搜索时可切换位置键，并检查旧任务是否仍追踪对象；感知丢失不自动清理自定义黑板或停止追踪，失去视野也不使听觉、队友报告等允许的线索失效。

### 采用、撤回与二改预注册

[研究] ✅ 有限情报改变选择才保存身份、已知位置、感知与按需线索年龄；声明覆盖、搜索、返回／追踪规则。导演提示有来源精度，读真值不授权角色搜索读真值。直接追踪是玩法或现有机制够用则不加记忆库。

[研究] **二改预注册**：追逐加拐角／诱饵，记来源、已知位置、移动目标，验失视后移动、别处声音、队友报告、重现及导演继续调压。允许追踪者不强制停追；记忆只降低响应却没产生所需选择就收窄／撤回。AI追读路径，人验躲避、搜索与压力。

**边界 [一手／研究]**：SPD文件头GPL-3.0-or-later，根[LICENSE.txt](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/LICENSE.txt)为GPLv3。公开网页／Valve讲义及选定链路不证明完整感知实现，最佳遗忘时长未知；共同政策只维护一份。

## 选敌补研：候选、保持与主动切换

核实：2026-10-16（UTC+8）。主线一／三，GC。[研究] 改变 05 §7 的选择：需要保持攻击意图时，先定义候选资格、旧目标与主动切换，不直接扩大辅助范围或每帧选最近。这里只处理玩家选敌；不重复 NPC 感知、输入死区与枪口遮挡，也不新增通用目标管理框架。

### 跨类型机制与反例

- **Cogmind 回合 roguelike。** [一手：Beta 17.1 手册] [官方文本](https://www.gridsagegames.com/cogmind/manual.txt)的 Targeting Behavior：按`f`恢复最近机器人／空地目标，仍可见的引导武器路径点也恢复；无旧目标或已失效才取最近。前后循环按距离，通常只含有武装敌对对象，无此类可见对象才含全部非盟友。查看模式含有／无武装非盟友，可在那里选无武装目标再开火。[研究] 自动候选与直接指定分开；未核实时锁定、全部失效条件或保持阈值。搜索 booklet 为 Beta 7，以新读文本为准。
- **Hades 原作俯视动作。** [一手：历史补丁] [Early Access Patch 039，2020-01-28](https://www.supergiantgames.com/blog/hades-long-winter-update-patch-notes/)扩大手柄 Adamant Rail autolock radius；[Early Access Patch 044，2020-06-23](https://www.supergiantgames.com/blog/hades-the-blood-price-update-patch-notes/)排除 Companion Rib 召唤的 Skelly。后一页页眉 March 1st 与正文不同，本节按 June 23 补丁节。[研究] 范围／候选各自取舍，非“辅助越强越好”；不泛化全部友方、推断可手动攻击 Skelly，或视作 Hades II／现版全武器规则。两修订无对照体验测量。
- **Brotato 生存动作。** [一手：官方商店] [Features](https://store.steampowered.com/app/1942280/Brotato/)分别列默认自动开火与手动瞄准。[研究] 开火与瞄准可分选；未公开排序、保持、平台细节，也未证手瞄关闭自动开火。
- **OpenRA RTS 距离反例。** [一手：固定发行源码] 标签 API 将`release-20250330`解析为`b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787`。[AutoTarget.ChooseTarget L349–451](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Traits/AutoTarget.cs#L349-L451)先筛关系、类型、可见性、武器资格；禁移动核射程、禁转向核射界，优先级相同才比距离。[研究] 自动选敌非总最近；不能证明显式命令永不被覆盖或动作锁定手感，不移植整套 RTS 调度体系。

### 最小采用、撤回与二改预注册

[研究] ✅ 需保持意图时，沿输入／武器分定候选、保持、失效与主动改选，对象／位置均可。自动过滤挡住合法攻击时补直接选择；持续重选／精确瞄准本是玩法则保留，不强制双模式或统一评分阈值。

[研究] **二改预注册**：加更近干扰物／可攻击召唤物，验保持、改选、死亡／失效、候选外合法对象及允许的空地；支持模式切换才验切回。记输入、候选、目标、原因，区分选错与命中失败；保持妨碍改选时收窄，不能只加强吸附。

**边界 [一手／研究]**：OpenRA文件GPL-3.0-or-later；仅机制借鉴。官方手册、公告、商店与固定源码不证明体验／效率，政策与引擎无关。

## 意图预告补研：确定结果、条件变化与有意未知

主线一／三，GC；核实：2026-10-16（UTC+8）。
改变建议：05 §7 从看清起手进一步区分预告精度与有效条件，不把全知 UI 当默认质量升级。
新证据：Into the Breach 作者取向及预览／规则修订、Slay the Spire 意图设计、Amnesia 信息政策反例。[研究]

### 决策信息不等于完整行为表

- **Into the Breach：确定结果供求解。** [一手：Justin Ma 首发前设计访谈] [2018-02-23 访谈](https://www.gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-)将预告、少随机与解谜连接，保护建筑、牺牲机甲、推移形成解法。[研究] 分配有限行动、改变已知攻击后果时可试；非发行后受控评价，也不指整局无随机。
- **Slay the Spire：显示决策所需。** [一手：两位创始人视频转写] [2019-05-02 访谈](https://arstechnica.com/video/watch/war-stories-slay-the-spire-war-stories/?c=series)称随机行动无预告难选攻防、逐敌长文本又繁重，遂用意图图标；部分敌人随玩家行为改意图。[研究] 借粒度／条件变化，不能证明每敌每牌后重算或要求同图标体系。
- **Amnesia：有意未知。** [一手：Thomas Grip 复盘] [2019-10-15 文章 Lesson 7](https://frictionalgames.com/2019-10-9-years-9-lessons-on-horror/)将理智系统从直白改含糊以留想象紧张。[研究] 是理智而非下一招 UI，只反证透明并非普遍更好；不能证明隐藏攻击的收益，更不允许虚假确定提示。

[研究] 沿行动状态选信息政策：确定且供计划的明确显示；可变结果标当前条件并更新／撤销；有价值的试探可隐藏。只需攻防类别不列完整行为表，未知仅造成无意义盲试时才补信息，表现不能许诺规则未锁定结果。

### 已发布修订：可以删显示，也可以改规则

[一手：开发者公告] Matthew 的 [2023-01-23 补丁帖](https://steamcommunity.com/app/590380/discussions/0/3765606580168752432/)明确标记 developer：移除 Earth Mover／Mine Bots 的 Attack Order 显示，因为它们没有排队攻击；调整 Wind Torrent 的推移次序，使结果与效果预览更一致。标题写 v1.2.88，正文写 1.2.87 Changelog，本节保留冲突，以日期公告指认，不自行断定精确补丁归属。

[研究] 前者撤虚假顺序，后者改互动规则保预测，不只修UI；未披露根因，不能断定代码分叉或要求统一模拟框架。未证当前全部预览正确。

### 第二次修改：仅预注册，未执行

[研究] 在已有攻击上改变一个会影响选择的条件，如推移顺序、护盾或目标死亡，保留同一局面对照：

1. 条件不变时，核预告的动作、对象、数值和次序与执行一致；只核设计承诺显示的部分
2. 玩家动作改变条件时，核已锁定部分仍守承诺，可变部分按规则更新或撤销；不把旧提示继续留着当不确定性
3. 没有排队动作的对象不出现虚假排序；有意隐藏的部分也不得因调试／新 UI 意外公开
4. 已有预演／撤销才核预演退出后状态、资源和下一行动；不为做这些检查而新增模拟器

[研究] 记录提示依据、条件变化和最终执行；AI 追消费者／回归，由人决定保留哪些未知、提示是否足以支持选择。失真时先修条件同步、缩小显示承诺或简化规则，信息过多就退必要粒度。

**范围 [研究]**：公开访谈／公告，未读商业反编译代码；只支持设计、作者观察与历史维护，无通用体验排名。建议与引擎无关。

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

## 任务推进补研：历史事实与当前条件

核实：2026-10-16（UTC+8）。主线三，GC。[研究] 改变05 §9的选择：先区分曾经获得、当前可交付与已经完成，再扩任务内容；不把新拾取事件当作唯一进度来源。本节只处理推进条件与消费者，不重做库存事务、叙事存档或遭遇奖励。

**Flare：存放物品改变推进条件。** [一手] Empyrean Campaign [作者问题827](https://github.com/flareteam/flare-game/issues/827)指出任务物可入仓后，携物检查须从 requires_status 改 requires_item，文字也随当前持有。[2020-12-10提交](https://github.com/flareteam/flare-game/commit/d058433aa3759a54148c622913a02ac204196b72)开放主线物品入私人仓库，并补祭坛携刀、书本羽毛笔、Florin 制墨花朵／血瓶及缺料对话。[研究] 保留历史标记，但需现物的操作不能只靠历史授权；非原报告者全面复测。

[一手] Flare 游戏`af6eee6d339ac98011864bfe89da837fe7769c28`、引擎`1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f`的主干消费者：

- **已有物品可交。** Alchemy 材料进[普通一级掉落表](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/loot/level_1.txt#L1-L7)；[Florin对话](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/npcs/florin.txt#L91-L134)接取写 emp_alchemy_init，交付须已接、未完成、现有三材料，消耗水晶／蘑菇、留芦荟并写 emp_alchemy_finish，不要求接取后再拾（静读，未跑先取物路线）
- **显示不交付。** [日志定义](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/quests/0011_alchemy.txt)按材料提示返回、按独立状态显示完成，[QuestLog](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/QuestLog.cpp#L163-L200)重算；[NPC对话动作](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/NPC.cpp#L917-L933)交 EventManager，再由[状态动作](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/EventManager.cpp#L977-L984)推 CampaignManager，非日志自行完成
- **解锁不倒推剩余物品。** [Book交互](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/maps/book_of_the_dead.txt#L340-L355)耗羽毛笔／墨水并写 emp_main_underworld，[传送与on_load外观](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/maps/wizards_tower_2.txt#L549-L567)读该状态；[SaveLoad](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/SaveLoad.cpp#L139-L202)分存装备／背包与 campaign，同文件 L510 恢复 campaign，再供日志／地图消费

[一手] [当前checkItem](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/CampaignManager.cpp#L143-L147)合计背包＋装备，不计仓库。[2026-09-29修复](https://github.com/flareteam/flare-engine/commit/d3d5688a59057e6318421d8e959e26287eefd6c1)才将“任一处足够”改为两处合计，修各放一把刀却不满足两把；QuestLog 旧注释“not equipped”不代消费者。[研究] 支持条件／持久状态分工，未证交付存档原子性、任意并发或全部旧档兼容。

**SPD：局部任务状态。** [一手] 独立作者回合 roguelike 固定`57a4e06a4caf162446d1c28caa7983f0493fecf0`：[墓室生成](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/rooms/quest/MassGraveRoom.java#L101-L123)先放 CorpseDust，[Wandmaker](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/npcs/Wandmaker.java#L111-L214)首介写 given、后续查现物，允许先取物但不表示首对话跳介绍即完成。[确认奖励入口](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/windows/WndWandmaker.java#L108-L130)耗任务物、移 NPC、调用 complete 清奖励引用；[保存／恢复](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/npcs/Wandmaker.java#L249-L293)存 given／奖励，[Dungeon实际存档入口](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/Dungeon.java#L661-L666)实际调用，无需从空背包倒推任务已完成。

[一手／研究] [Quest.active](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/npcs/Wandmaker.java#L378-L447)还查房间、诅咒、怪物，所核[PrisonLevel消费者](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/PrisonLevel.java#L73-L80)用它选紧张音乐，不能当已接／已完成的统一判断。两项目只支持各自机制，不要求所有游戏同表。

[研究] **二改预注册**：沿交互／存档分历史、当前条件、推进入口。允许先取物后，验接取、暂存、交付消耗、离开保存恢复；提示匹配物品查询范围，永久完成不因消耗回退。持续携物／占领设计保可逆，不一律锁存；AI追路径，人定永久性。

**边界 [一手／研究]**：[Flare引擎](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/README.md#L28-L38)代码GPL-3.0-or-later；[Empyrean Campaign](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/README.md#L17-L25)数据／美术CC-BY-SA 3.0或后续，非引擎许可。SPD代码GPL-3.0-or-later；未验全部分支／保存故障恢复，政策与引擎无关。

## 效果时钟补研：调度时间、行动次数与到期显示

主线三，GC；核实：2026-10-16（UTC+8）。
改变建议：05 §7 持续效果按行动调度、指定次数或模拟时间选择；首末跳、到期与剩余显示一起定义，不把“声明时钟”简化为统一 N 秒。
新证据：Shattered Pixel Dungeon 的毒／加速消费者与历史显示修订，不同作者 Flare／Empyrean 的秒数效果、暂停及恢复路径。[研究]

### 回合玩法：调度时间不等于输入次数

[一手] SPD 固定`57a4e06a4caf162446d1c28caa7983f0493fecf0`：[Actor L39–56](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java#L39-L56)定 TICK／同时间优先级，[调度 L250–325](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java#L250-L325)选累计时间最早者、优先级破平局；[Hero L868–887](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/hero/Hero.java#L868-L887)无动作且未休息时 ready 后等待。因此该输入等待路径不按现实秒扣效果，不推广全部回合游戏。

[一手] [Char.speed L770–782](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L770-L782)读 Haste，[Hero移动 L1873–1906](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/hero/Hero.java#L1873-L1906)以移动耗时／速度消费调度时间；[Poison.act](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Poison.java)自行跳伤、耗 TICK、减剩余后判断移除。[研究] 同一毒时段加速可增加移动机会，不改成一步一跳，也不推出所有攻击／效果加速。

[一手] [FlavourBuff L26–47](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/FlavourBuff.java#L26-L47)被调度时移除；[Buff.visualcooldown L135–143](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Buff.java#L135-L143)显示 cooldown+1，注释称普通 Buff 晚于英雄行动。[研究] 剩余值按行动边界解释，不照搬加一；承诺“接下来几次有效攻击”就按该行动消费，不以调度时间近似，亦非 SPD 全效果规则。

### 即时玩法：模拟秒、菜单与恢复各有边界

[一手] Flare 引擎`1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f`（2026-10-05）、游戏`af6eee6d339ac98011864bfe89da837fe7769c28`（2026-08-08），未核发行配对。[Ranger L25–66](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/powers/categories/ranger.txt#L25-L66)分别设 Haste 移动／攻击秒数；[毒云配置](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/powers/base/ranger/poison_shot_aoe_1.txt)授 poison，[effects定义](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/powers/effects.txt)映射 damage，均为实际消费者。

[一手] [Timer L188–244](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/Utils.cpp#L188-L244)随逻辑步递减、依配置步频判整秒；[EffectManager L390–497](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/EffectManager.cpp#L390-L497)先移除到期效果，再检查本步周期效果，最后推进计时。周期检查取剩余时间的整秒边界，不足一秒另有初始触发条件。[研究] N 秒不足以定义首末跳／跳数，也不意味着首跳必等满一秒；不把 Flare 算法设通用默认。

[一手] [GameStatePlay L857–900](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/GameStatePlay.cpp#L857-L900)未暂停才正常更新角色，经[Avatar L490](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/Avatar.cpp#L490)、[StatBlock L1096–1097](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/StatBlock.cpp#L1096-L1097)推进效果；[MenuManager L917–919](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/MenuManager.cpp#L917-L919)按 menus_pause 决定普通菜单暂停，退出菜单等另有强制条件；[main L195–235](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/main.cpp#L195-L235)最小化恢复时重置逻辑时间，暂停时也不累积补帧。[研究] 要冻结的间隔才不消费时间，也不在恢复时追补；菜单继续计时也合法。只核正常更新／恢复，非暂停屏蔽全部状态修改。

### 显示修订与二改预注册

- [一手：历史报告／维护] SPD [#1707](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1707)报告加速下冻结时间显示-0；[维护者解释](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1707#issuecomment-2115939937)称逻辑容忍微小负数以免少给一次行动、显示未同步；[c9c6380](https://github.com/00-Evan/shattered-pixel-dungeon/commit/c9c63803492878a7fab35c2be3b74219440de9d2)修正图标取整与描述下限。未取得原用户的修复后复测，关单不能证明全到期显示正确
- [一手：历史反例] [#1843](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1843)报告 Salt Cube 剩余 17、17、15；[维护者2024-09-18回复](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1843#issuecomment-2359484764)解释 Buff 的速度变化，但数值只在其行动时更新，选择保留。[研究] 跳变不等于结算错或玩家能理解，非当前复现
- [一手：近期修订] [58f0e5b，2026-07-06](https://github.com/flareteam/flare-engine/commit/58f0e5b1242680d6575e5035c960f3a5f025aaf7)分护盾强度／计时，使限时护盾 tooltip 显示期限。[研究] 支持量／期限分别显示，非毒／加速同病证据，无独立复测或体验测量

[研究] ✅ 沿既有行动队列、模拟更新与效果实例确定推进单位、首末跳、移除和显示，保留每种玩法自己的暂停政策。不为效果种类增加而统一 N 秒、所有输入减一或搬入另一游戏调度器；本节不改变既有多来源合并与撤销建议，也不重复数值组合与命中连锁。

[研究] **二改预注册**：毒增加移动加速，验快慢动作、等待、临界跳伤及行动机会；按次数承诺才按有效行动扣。即时版本在跳伤／到期前开普通菜单、暂停、切后台恢复，各依政策继续／冻结，冻结不补积压跳伤。记状态、时间／次数、UI边界，不以显示平滑代结算。

**边界 [一手／研究]**：SPD文件头GPL-3.0-or-later；Flare [README许可节](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/README.md#license)为GPLv3-or-later，内容[LICENSE.txt](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/LICENSE.txt)为CC-BY-SA 3.0。未核快照组合兼容或跨设备恢复；时间／行动政策只写一份。

## 效果读取时点：持续代价与一次承诺

主线三／GC；核实：2026-10-16（UTC+8）。[研究]
改变05 §7：二改加入临时增伤／换装时，按字段选择施加快照或动态读取，不让实例复用决定规则。[研究]
新证据：PoE 1.2.0、WoW 6.0.2的历史正式修订及2026单玩家显示反馈；不新增效果框架。[一手／社区]

**持续收益与代价一起持续。** [一手] PoE [1.2.0正式补丁的General Balance Changes](https://www.pathofexile.com/forum/view-thread/998489)规定装备／支持宝石变动后持续技能更新；[开发者说明](https://www.pathofexile.com/forum/view-thread/951414)（2014-06-18 发布、10-10 修订）以 Mon’tregul’s Grasp 为例：快照换装保强僵尸又绕过少数量代价，限制后续装备设计。作者承认会削弱构筑，安排赛季间改，属设计理由非收益测量。字段仍不同步：生成等级须重召／新实例更新，Righteous Fire 拔技能仍持续，装备、被动、支持宝石分别处理。[研究] “修快照”不等于每跳重读全部字段。

**一次承诺可保快照。** [一手／研究] WoW [2014年正式6.0.2公告的Periodic Effects](https://worldofwarcraft.blizzard.com/en-us/news/15682579/the-iron-tide-602-patch-notes)将普通周期效果改逐跳重算，理由是择时收益伴随插件依赖／平衡压力；按上一击比例延迟兑现、专门强化下一技能的效果保留。动态只保增益期间收益，快照可延长至整段 DoT，技巧不同。同文刷新宽限为基础时长末 30%、重施最多延至基础时长 130%，不能证明所有例外刷新保旧强度；仅 2014 修订／理由，非 2026 全规则。

**快照刷新要可判断。** [社区] [2026-03-22玩家原帖](https://us.forums.blizzard.com/en/wow/t/feral-feedback-snapshotting-is-hard-with-current-cooldown-manager/2278000)要求图标显示旧流血实际保留的强化，而非仅当前增益／剩时。[研究] 单玩家信息需求，不核全部职业现规则、普遍体验或 2014 前后对照。

**采用与撤回 [研究]**：沿实例按字段分已承诺值／动态依赖，刷新时长与强度分别定，需要比较才显示差异。快照造成换装仪式／规避持续代价就缩范围；动态读取毁掉强化攻击的延迟部分就恢复局部快照，不全回滚。未取得到期复用残留快照的独立修复链；不新增实测计划。

## 属性修饰补研：计算顺序与重算

核实：2026-10-16（UTC+8），主线三／GC。改变05第7节：效果所有权与层数不足以定义计算；首次和重建采用同一顺序，区分派生上限与已发生的资源变化。[研究]

**重建曾改变结果。** [一手：维护链] Wesnoth [#4419维护者例子](https://github.com/wesnoth/wesnoth/issues/4419#issuecomment-537258606)：先设最大 HP=100 再加 100 得 200，重建按类型重排却成 100；[报告者补充](https://github.com/wesnoth/wesnoth/issues/4419#issuecomment-537261328)称删无关修改也触发。[2020-08-20合入的#5085](https://github.com/wesnoth/wesnoth/pull/5085)采用记录顺序重放，不是讨论候选全实现。

**固定消费者。** 1.18.5对应`7a60ccb925afadc8ae7d4f47891f5ab329786da8`，不称最新版本。[到期删除](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L1237-L1267)会进入重建，[恢复基础与应用修改](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L984-L1026)及[记录顺序](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L2583-L2594)吻合该政策。[当前HP等状态](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L186-L207)另保留并受新上限约束，不自动满血。实际[Strong特质](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/data/core/macros/traits.cfg#L128-L146)修改近战，[攻击字段处理](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/attack_type.cpp#L431-L445)后仍经[战斗计算](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/actions/attack.cpp#L182-L207)等后续规则，不能将基础字段当最终扣血。[一手：固定源码]

**倍率有阶段。** [一手／研究] SPD 4.0.2 `57a4e06a4caf162446d1c28caa7983f0493fecf0`的[萨满](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Shaman.java#L153-L170)授虚弱／易伤；[攻击链](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L479-L512)先攻击者虚弱×0.67，经取整、防御、扣护甲，再目标易伤×1.33，后续还有钩子、damage、护盾，中间值非最终 HP 差。[治疗药](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/potions/PotionOfHealing.java#L76-L84)移效果后下一击重查，不反算上一击。

OpenRA `release-20250330`固定`b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787`，[实际等级规则](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/mods/ra/rules/defaults.yaml#L60-L83)影响伤害；[发射侧／装甲处理](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Warheads/DamageWarhead.cs#L73-L90)和[承伤侧处理](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Traits/Health.cs#L158-L189)分阶段，存在整数转换；禁用[DamageMultiplier](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Traits/Multipliers/DamageMultiplier.cs#L32-L35)返回100%。[历史乘算评审](https://github.com/OpenRA/OpenRA/pull/6079#discussion_r15618105)关于200%与50%回到100%的讨论起点是装填间隔，不伪称伤害bug；这里只支持计算语义须明确，不能推广为整个管线只取整一次。[一手／研究]

**二改预注册 [研究]**：A加入B，核首次／重建、删无关项、A到期、期间永久成长后撤临时效果；有意义的顺序保留。核小伤害、护甲、取整、降上限与当前HP，避免重算重复治疗／扣血，现有函数够用不加DSL。

**边界 [一手／研究]**：Wesnoth相关文件GPL-2.0-or-later，SPD／OpenRA为GPL-3.0-or-later。只核固定消费者与历史修复，不代表复现或当前全路径正确。


## 事件连锁补研：排队不代替防重入与操作边界

核实：2026-10-16（UTC+8）。主线三／GC；改变05§6的同步／排队选择：来源、防重入资格和完整操作边界分别决定，不因“解耦”统一延迟。新证据复用已完成的固定源码调查，再对照当前章节缺口；不是新增效果框架或游戏实测。[研究]

**DCSS：资格与延后边界。** [一手] 固定`2952e12c52c2a66210f6c5488db987d0962a67ca`的[反伤执行](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/fineff.cc#L1081-L1107)允许原防御者已经死亡、重新检查承受反伤者仍活着；[伤害入口](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/monster.cc#L4393-L4402)排除派生反伤再次镜像。[2014修复](https://github.com/crawl/crawl/commit/4f3d0c6879f2baefcf3eb2749133ae3340dcbdca)修来回反弹；[2024修复](https://github.com/crawl/crawl/commit/f4a7df68b9800669d3a70ac8d7dc9cc4f2eeb94b)将血箭冷却前置以防止反射重新触发齐射，同时另修 beam 复用，不能把全部崩溃归重入。

[一手／研究] [2020修复](https://github.com/crawl/crawl/commit/3dd439832fe0f5fe295caad1a2fe3e479a757cda)延后死亡爆炸，避免多目标攻击未完就杀攻击者；[2021修复](https://github.com/crawl/crawl/commit/4e304d196c1d5a90fd7939a3cf94c2339bed27f0)撤每束 beam 后处理，因多束法术未整体结束。[现行消费者](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/fineff.cc#L2133-L2147)从 vector 尾取再执行，为 LIFO 且继续处理新加入的效果，不是 FIFO；排队本身不中断循环。

**直接处理也可成立。** [一手／研究] SPD v4.0.2 `57a4e06`的[LifeLink](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L830-L864)用派生来源免再次分摊，[Skeleton](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Skeleton.java#L70-L141)直接做死亡邻格伤害。[攻击链](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L483-L512)的 attackProc 在普通 damage 之前，是规则钩子、非 HP 提交事实；正文 DamageApplied 仍在提交后。

OpenRA固定e180e3225f3930272dd451917467631618f8976f中，[桶伤害](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ra/weapons/explosions.yaml#L144-L182)有Delay=5，[ATMine](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ra/weapons/explosions.yaml#L193-L209)不设Delay且排除Mine；[消费者](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Game/GameRules/WeaponInfo.cs#L234-L265)分别直接执行或走延时，[DelayedImpact](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Game/Effects/DelayedImpact.cs#L19-L40)单位为tick不是秒。[一手] 游戏规则的延迟与为保护操作完整性而延后是不同目的，不统一换成一种调度器。[研究]

**采用与预注册 [研究]**：会重入的动作登记资格／来源，但仍重核合法性，取消失败按原规则返还。加反射／爆炸后验重入、多目标未完时死亡、多个连锁与即时规则；必要时才延至完整操作边界。DCSS为GPL-2.0-or-later，SPD／OpenRA为GPL-3.0-or-later；仅选定链路，未证全路径。


## 组合取舍：先修辅助、规则还是动作出口

核实：2026-10-16（UTC+8）。主线三；改变05 §7：不把目标保持、预告与取消分别正确当作同一次玩家决定已成立。先按失败位置选择窄修正，不默认更强辅助／全部可取消；04仍只维护反馈表达，没有新增引擎API或模块。**[研究：采用判断]**

- **位移后不合理转身，修辅助的作用情境。** [Dead Cells 6系列原公告](https://dead-cells.com/patchnotes/6)中，6.0（2018-02-02）允许翻滚后续接武器连击；6.1（02-09，`6da3294a`）另调近战auto-aim，明确举Phaser造成不合理转身为例；6.5又取消Kunai对身后敌人的自动瞄准。这说明连击连续性和辅助朝向可分别取舍，不是一个“更自由”开关。公告未给算法和玩家测量，不能归因于每帧最近目标，也不支持所有攻击锁死目标。**[一手：版本修订；研究：边界]**
- **命中不等于威胁解除，先对齐敌人当前状态。** Hades II [Hotfix 3（2026-06-03）](https://steamcommunity.com/games/1145350/announcements/detail/670617245259399701)分别修护甲轮廓缺失、Black Coat意外完全抵消不可打断的Chronos攻击及Cerberus喷火追踪过快；[Hotfix 4（06-10）](https://steamcommunity.com/games/1145350/announcements/detail/707773844292634084)修Dire Auto-Seekers防御态破甲后仍免疫硬直。详情提取只返回标题，条目实读自[同一官方汇总的对应标题段](https://steamcommunity.com/app/1145350/announcements/)。不同修复不可拼成同一根因；不可打断也不等于不受伤。**[一手：官方修订；研究：范围]**
- **应对后反击也是成立的方案，不要求抢断所有威胁。** Furi设计师Benjamin Le Moullec的[2026-03-20复盘](https://cronosthenewdawndesign.substack.com/p/designing-memorable-boss-fights-lessons)将读起手、闪避／招架、恢复期反击连接；一般命中有反应，但The Edge特定狂暴阶段允许承受攻击而不硬直，并用红色气场提示。作者明确这只是Furi的设计选择。这里只提炼使规则例外可辨，不把其常见两种应对或人物规则推广到所有游戏。**[一手：作者复盘；研究：反例]**

**Overgrowth：补足组合修改前后的使用反馈，不能拆分因果。** 2026-10-16（UTC+8）补核，复用前文1.2生产链，不新增模块。2017-10-29玩家[原评论#11](https://steamcommunity.com/app/25000/discussions/0/1473096694440638724/#c1479856439038181571)报告最高难度通关时，对狼、重装及重武器敌人主要反复飞踢，不用则反复死亡。开发者[10-31最终答复#25](https://steamcommunity.com/app/25000/discussions/0/1473096694440638724/?ctp=2#c1479857071247278872)认为只减伤会变成重复更多次飞踢，承诺另找应对方案；不能据此认定后来每项修订都源于该帖。**[社区：玩家自述；一手：开发者解释]**

[1.2官方公告（2018-03-15）](https://www.wolfire.com/blog/2018/03/Overgrowth-1-2---Combat-improvements/)关闭casual以外的攻击吸附、让AI翻滚躲飞踢、缩短高难度肩投距离，并调整猫的副手投掷。2018-03-21，[玩家UtmostGorilla的#16回应](https://steamcommunity.com/app/25000/discussions/0/2650805212054304885/?ctp=2#c1697168437859266489)直接引用开发者“1.2 Expert飞踢更难”的说明，确认更难命中、成功更有满足感。**[一手：版本修订；社区：修订后体验]** 这是版本指向明确的单玩家反馈，不是同一玩家前后受控比较；没有精确构建、命中率或行为录像，不能分离吸附、AI与其他改动的贡献，也不能证明更广人群受益。**[研究：证据边界]**

**场地反证。** [同帖开头](https://steamcommunity.com/app/25000/discussions/0/2650805212054304885/)的Arrar起初称半速仍难读剑招；[03-21的#12](https://steamcommunity.com/app/25000/discussions/0/2650805212054304885/#c1697168437856609499)继续游玩后认为，狭窄场地及落水风险可能加重此前挫败，开阔关卡更可玩。这里只是同一玩家修正诊断，没有固定构建或遭遇对照，不把它算作1.2修复效果；但足以提醒先核预定的站位／闪避是否有空间，不见“难躲”就统一加长起手。**[社区／研究]**

**采用与撤回 [研究]**：前三例非同条件排名；Overgrowth仍缺受控前后、主动投入和完整二改。一招挤占其他选择时先查命中、对手应对与脱离风险，再局部改辅助／规则；原方案清楚、支持目标人群且不妨碍主动改选时就保留。有意承诺导致挨打时先让玩家理解躲避，不抹风险。

后续获准才以一个既有双敌遭遇加护甲或穿身位移，分别验抢断A与避开A攻击B；观察目标、朝向、敌招是否继续及下一动作资格，不新建全局管理器。本轮没有运行游戏、引擎或模型，不新增实验授权。**[研究：未执行的验证范围]**

## 镜头借出控制：持续更新历史与当前视点分开

2026-10-16（UTC+8）补核。归 GC；改变 05 §8 的历史政策：短暂回看后需要连续返回时，除冻结／清空，还可维护原跟随状态但不输出。**[研究：条件建议]**

**失败与中间修订。** SuperTuxKart [#5270](https://github.com/supertuxkart/stk-code/issues/5270)希望保留驾驶平滑，但开赛、重开与回看结束不应追赶过时方向。[6d04543](https://github.com/supertuxkart/stk-code/commit/6d0454383ca7c151ed42e3bede1a518a13d0546b)先在回切／重开时 snap；作者称做过分屏测试，不是完整测量。[后续反馈](https://github.com/supertuxkart/stk-code/issues/5270#issuecomment-2637678754)仍有未解决项。[#5278](https://github.com/supertuxkart/stk-code/issues/5278)报告在线回切突跳；报告者怀疑首修引入但未 bisect。维护者[以地面为参照逐帧观察](https://github.com/supertuxkart/stk-code/issues/5278#issuecomment-2620599733)，认为车连续而镜头跳，并[解释](https://github.com/supertuxkart/stk-code/issues/5278#issuecomment-2621722909)镜头消费 rewind 更新、旧平滑掩盖问题；[ef8bbed](https://github.com/supertuxkart/stk-code/commit/ef8bbedfa1577612947d66f2a04f3f715b9e7b26)加入重演期间提前返回。不能把这个中间补丁直接当最终推荐。**[社区：症状；一手：维护者说明与补丁]**

**最终接受的是另一种历史政策。** [2025-03-08 f9ffcc6／PR #5365](https://github.com/supertuxkart/stk-code/commit/f9ffcc6310d4e632773acfeadcb9fd03bf446371)删除上述回切 snap 和局部 guard，保存 m_last_smooth_mode；当前视图不平滑时，仍调用 moveCamera(dt, false, …) 更新原模式的内部历史，仅 smooth 为真时写相机位置与 target。见[固定实现](https://github.com/supertuxkart/stk-code/blob/f9ffcc6310d4e632773acfeadcb9fd03bf446371/src/graphics/camera/camera_normal.cpp#L118-L165)及[1.5 发布源码](https://github.com/supertuxkart/stk-code/blob/1.5/src/graphics/camera/camera_normal.cpp#L300-L350)。这是被接受的实现，不是本仓玩家复测；也不能据删除 guard 宣称联网问题已由本轮验证解决。**[一手：固定代码]**

**不要给所有运动再套总滤波。** 不同类型的 Veloren [固定代码](https://github.com/veloren/veloren/blob/2dbddc2ffa36db9a5c69cc831b65a7336ceab6a3/voxygen/src/scene/camera.rs#L580-L637)将位置、距离、FOV 与可选旋转平滑分开；只证明可以独立选择，不证明系数可迁移。Phantom Camera [#522](https://github.com/ramokz/phantom-camera/issues/522)中，对最终 Transform 统一插值的提案被[维护者指出](https://github.com/ramokz/phantom-camera/issues/522#issuecomment-2848644530)会延迟直接旋转；[提议者承认](https://github.com/ramokz/phantom-camera/issues/522#issuecomment-2848660970)只是示意，不是完成方案。该讨论未闭环，不作已交付改进。**[一手／社区]**

**采用与撤回 [研究]**：同目标短暂借出、需连续返回时，比后台维护必要历史与回切重建；重生换目标使历史失效则重建，cut／blend另定。不让闲置镜头全做碰撞；无益或硬切够用即撤后台更新。联网另核重演污染；预注册回看时转弯再松开，记目标、历史、输出，只修变差通路。

许可与范围：STK代码GPL-3.0-or-later，Veloren为GPLv3；固定代码和修订链静读，未做完整视频体验评估，效果／成本仍待验证。

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


## 群体攻击协调：资格、站位与冷却分开

核实：2026-10-17（UTC+8）；GC／主线一、三。改变05 §7：把“调整攻击重叠”收窄为减敌、个体错峰与共享许可的条件选择；只读开发者材料、固定源码和引擎文档，未运行游戏、引擎、模型或玩家对照。[研究]

**✅ 先查玩家缺哪种应对，再决定限什么。** 单招已清楚但叠加失去反制，且仍需保留包围、选敌或范围攻击价值时，才给特定攻击类别加小共享许可；敌人数量、空间与预告本就不合适，先改遭遇。仅调独立冷却不能保证不同时到期；随机错峰是概率调整，不是并发上界。此为方案推导，非以下游戏的受控比较。[研究]

### 生产取舍：参战预算不等于攻击帧计数

- **God of War (2018)。** Mihir Sheth 的 [GDC 2019 原讲稿](https://media.gdcvault.com/gdc2019/presentations/Sheth_Mihir_EvolvingCombat.pdf#page=39)第39–43页按资格、类型优先级、玩家目标和相机关系排序，从固定池分配 aggression tokens，不同类型可占不同份额；第55–62页另以区域／间距约束站位。第72页明确演示禁用攻击但保留 aggressiveness，不能把这份预算写成“同时伤害次数”。第50–56页记录加权寻位复杂、频繁失效和聚团，后来转向避免坏位置；这也反驳“加额度即可解决围攻”。这里是作者生产复盘，非本仓复现；不照搬例示数值或整套导演。[一手／研究]
- **Batman: Arkham City 的相反选择。** [CGW 2012期开发者采访，Combat Choreography](https://www.cgw.com/Publications/CGW/2011/Volume-34-Issue-9-Dec-Jan-2012-/Mean-Streets.aspx)中，David Hego说明相较Asylum增加并攻，同时提供双／三重反击；Tim Hanagan说明更多敌人技术可行却会使玩法混乱。支持“并发与反制共同设计、数量也可减少”，不证明使用某种token算法，也不把多人同步动画当单程序无美术的免费能力。[一手：实名作者陈述；研究：采用边界]
- **群涌是目标时保留群涌。** Valve [Left 4 Dead 原讲稿](https://cdn.akamai.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf#page=65)第65页描述集体冲锋；第81–82页的休整调节生成数量，现有特殊感染者仍能攻击。遭遇人口节奏和场上逐次攻击许可不同；不能据此推断L4D不存在任何局部攻击限制。[一手／研究]

### 固定实现：共享额度的范围和退出比名字重要

静读 `ValveSoftware/source-sdk-2013@be57e3d01ac7d7aa6a2cacbfef187c0b46616db0`，只支持所列链路，不代表全部发行构建。[一手]

- [ai_squad.h](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/ai_squad.h#L17-L75)与[分配／释放](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/ai_squad.cpp#L579-L650)：同一squad按目标记录strategy slots，已有合适槽可保留，否则找空槽；不是空间坐标，也没有公平等待队列。[一手]
- [Combine选招](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/hl2/npc_combine.cpp#L1992-L2008)先争取ATTACK1–2，失败仍可取得独立GRENADE1；[建立射线](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/hl2/npc_combine.cpp#L1642-L1658)也可占攻击槽。因此两个主攻击槽既非全局威胁上限，也非仅在伤害帧持有；单体next-attack时间仍另存。[一手／研究]
- [换目标](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/ai_basenpc.cpp#L10081-L10098)先释放旧目标资格，[切schedule](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/ai_basenpc.cpp#L10515-L10537)与[死亡](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/ai_basenpc.cpp#L515-L524)有释放；[改去装填](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/hl2/npc_combine.cpp#L2194-L2208)也归还。自定义打断是否走到出口须单独核，不能把这一条链称为所有取消已安全。[一手／研究]

[固定许可证](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/LICENSE)为Source 1 SDK专用许可；这里只转述机制，不复制代码／资产，不推荐直接移植到Unity／UE商业项目。三家生产材料不是同任务性能或体验排名。[一手／研究]

### 最小采用与第二次修改

| 症状／目标 | 先采用 | 代价与撤回条件 |
|---|---|---|
| 同批起手偶尔同步，允许重叠本身 | 保留个体冷却，必要时错峰 | 无严格上界；仍出现无应对组合，再比较共享许可 |
| 需保留多敌，但某类重招不能同时逼迫互斥应对 | 只限制该类起手／承诺阶段，定义未获准者行为 | 持有范围含准备还是恢复需明确；限制起手不限制已发弹体／持续伤害 |
| 同时接近造成堵路、预告互挡 | 沿现有导航补可达站位与间距；容量不够就改场地／减敌 | 站位可达不保证能出招；仅限攻击也不会疏通堵路 |
| 有意群压、范围清场或多重反制 | 保留可理解的并发；必要时调人口／节奏 | 一律轮流会抹掉原玩法价值，撤回过宽许可 |

以上为[研究]条件选择。Unity 6.3 [avoidancePriority](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AI.NavMeshAgent-avoidancePriority.html)决定避让优先级；UE 5.8 [RVO／Detour Crowd](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-avoidance-with-the-navigation-system-in-unreal-engine)处理动态避障。这些原生空间能力不能当作已提供攻击调度；沿既有状态／技能所有者补窄许可即可，不为此迁移行为树或GAS。[一手／研究]

**未执行的二改验收。** 在原双敌遭遇增加第三敌／远程招：记录请求、批准、归还和实际危险重叠；插入持有者死亡、打断、换目标、改招、不可达与重开。检查旧资格未遗留、旧回调不释放新持有者、持续有合法候选时没有意外全体等待；公平轮转并非必需，但饥饿不能被“未超额”掩盖。人数正确仍须核逃路和实际可用反制。若排队明显、空窗无聊或群压价值消失，收窄受限招式／占用区间或移除。未实测，不能声称更公平、省调试或AI生成收益。[研究]

## 蓄力技能补研：按法识别、技能进度与释放

核实：2026-10-18（UTC+8）；主线一／三。改变 05 §7 的蓄力二改选择：原生 Hold 契约满足就保留，游戏规则改变蓄力速率／资源时沿已有技能状态计量，不把满格当释放。[研究]

- **历史设计拆分。** [一手] Hades II [2024-10-16 Olympic Update 官方公告](https://steamcommunity.com/games/1145350/announcements/detail/7057794870234137717?l=english)将 Sorceress 改为 Omega 动作加速，旧效果移至 Silver Wheel；后者在引导 Omega 时减慢周围事物。同页可含相邻更新，本轮按公告 ID `7057794870234137717` 与标题定位正文。[研究] 支持自身动作与周围减速可分别设计，不证明内部时钟、当前平衡或玩家体验改善。
- **满蓄仍可持有。** [一手] Veloren `21db1de49c7b57013acac7a309983b530a65b848`（2026-10-17）的 [charged_ranged.rs L59–66](https://github.com/veloren/veloren/blob/21db1de49c7b57013acac7a309983b530a65b848/common/src/states/charged_ranged.rs#L59-L66)按阶段 timer／charge_duration 给进度；[L93–178](https://github.com/veloren/veloren/blob/21db1de49c7b57013acac7a309983b530a65b848/common/src/states/charged_ranged.rs#L93-L178)在松开或能量不足且未发射时按蓄力比例发弹，满蓄按住仍持有。[utils.rs L1722–1757](https://github.com/veloren/veloren/blob/21db1de49c7b57013acac7a309983b530a65b848/common/src/states/utils.rs#L1722-L1757)分输入状态与 timer，后者以 dt 乘攻速及阶段倍率，Charge 用 charge_speed_modifier。[研究] 支持技能进度区别于单纯按住时长；未追其暂停链，不外推停顿政策。代码 [GPL-3.0](https://github.com/veloren/veloren/blob/21db1de49c7b57013acac7a309983b530a65b848/LICENSE)，这里只借机制。
- **Unity 输入计时不是提交回执。** [一手] [Input System 1.17 InputAction 文档](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.17/api/UnityEngine.InputSystem.InputAction.html#UnityEngine_InputSystem_InputAction_GetTimeoutCompletionPercentage)说明 timeout 完成率可到 1，而超时尚未由输入更新处理、动作未 performed。另核源码 `05e45ddbaf18a93245b068d787d74b738b90d01c` 的 [InputEvent L162–175](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Events/InputEvent.cs#L162-L175)真实时间线与 [StartTimeout L2289–2315](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Actions/InputActionState.cs#L2289-L2315)按输入时间加秒数注册；该 SHA 不宣称等同 1.17 包，暂停中是否处理还取决于更新与启用状态。
- **UE 可选全局缩放。** [一手] [UE 5.8 UInputTriggerTimedBase](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/EnhancedInput/UInputTriggerTimedBase?lang=en-US)的 bAffectedByTimeDilation 默认 false，选择是否将全局时间缩放用于 held duration；不据此承诺角色局部倍率、菜单暂停或动画也已同步。[研究] 只需此契约时保留原生触发器，不能因 Unity 路径不同就复刻输入层。

**选择与边界。** [研究] 沿现有执行实例保留资格、取消与唯一提交；UI 表达按法进度还是技能进度由用途定，动画释放沿前述窗口／退出政策，不额外搭状态框架。原生 Hold 满足即停止拆分；满蓄自动释放也合法，Veloren 不是统一规则。沿原蓄力二改加入攻速，再核停顿／暂停中的进度、耗能、松开／取消和释放次数；本轮仅官方契约、历史公告及固定源码阅读，未运行游戏／引擎／模型或验证手感。


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


## 本地多人视图：独立活动与双方可读性先于自动合屏

核实：2026-10-18（UTC+8）。GC，主线一／三。补此前单视口／多目标构图未回答的任务：同机两人能否独立行动，分开后双方还能否看懂自己的路线、地面与威胁。以下只比较视图机制，不把本地竞速误称合作，也不由此追加联网系统。[研究]

### 选择及撤回条件

| 玩法承诺 | 先比较 | 何时撤回 |
|---|---|---|
| 同一区域活动，双方在可读尺度内 | 稳定共享视图、有限缩放，必要时收敛场地跨度 | 全员入镜却看不清行动；缩小场地破坏玩法就换视图路线 |
| 允许各自探索或明显分离 | 独立分屏；接近时合屏只作有条件选项 | 各自视口丢失必需前方信息，或合屏夺走旋转／瞄准控制 |
| 近距离却位于不同楼层或遮挡空间 | 保留独立视图，或分别验证显隐与可行视点 | 地面、威胁被另一玩家的显隐策略隐藏；不能仅用平面距离判合屏 |

动态合分屏不是统一最优：先能维持最小可读尺度、预告距离与控制权，再比较过渡。无法同时满足时，场地／间距约束与分屏是不同设计承诺，不默认为强拉同伴、传送或无限缩小角色；任何新增约束要符合玩法。[研究]

### 共享屏幕的真实收益与反证：Pixel Wheels

作者在 [0.12.0 发布说明（2019-06-20）](https://agateau.com/2019/pixelwheels-0-12-0/)报告玩家认为分屏难读，因此改为单屏缩放容纳双方；同时缩小 Tiny sur Mer 赛道、移除旋转相机选项。这不是只换一个相机组件，内容尺度和控制方式也付出了代价。[一手／作者转述反馈]

作者 [2023 复盘](https://agateau.com/2023/opening-another-pandora-box/)又指出俯视二维分屏损失前方道路视野，而共享视图遇大赛道过度缩小，仍可能无法游玩，因而限制赛道规模。两篇属于同一作者的选择及后续反证，不算两个独立成功样本；也不证明所有二维游戏都应共享屏幕。[一手／研究]

### 独立活动的相反路线与二改：Larian

[Divinity: Original Sin Enhanced Edition 制作人原文（2015）](https://blog.playstation.com/2015/08/05/divinity-original-sin-enhanced-edition-couch-co-op-rpg-action-on-ps4/)把接近时共屏、分离时动态分屏用于独立探索。这支持另一种玩法承诺，不等于动态合并没有维护代价。[一手／研究]

[DOS2 官方支持答复（2019）](https://forums.larian.com/ubbthreads.php?ubb=showflat&Number=654683#Post654683)分别说明战斗外可强制分屏、接近却未重新合并属于缺陷；在当时控制器共屏路径，除了仍可使用键盘快捷键外，只有玩家一控制相机。由此不能将“两个角色都在画面中”当作“两个玩家都控得住”；历史产品限制不外推当前版本。[一手／研究]

[BG3 Patch 8（2025-04-15）](https://baldursgate3.game/news/the-final-patch-new-subclasses-photo-mode-and-cross-play_138)记录合屏后玩家处于不同地形高度，可能使另一人的地面淡出、难以导航；修订为不同楼层或足够高度差时分屏，并增加控制器 Forced Split Screen 选项。这是显隐和视口选择相互影响的正式修复记录，不是本仓库运行认证。Divinity 与 BG3 同属 Larian，不能当作两个独立团队的一致结论。[一手／研究]

### 二改验收与未覆盖部分

原平面场地改为上下层，再让双方靠近／分离、相反方向移动、一人停下或进入局部交互：分别观察角色尺度、前方预告、地面／掩体、旋转与输入归属、合分过渡，以及恢复后显隐。保留固定分屏作为对照；切换造成持续误判就减少自动切换或收窄合并条件，而不是只加阻尼。[研究；验收未执行]

本轮只读作者原文、支持回执与发行修复，没有运行游戏、Unity／Unreal、双控制器或 GPU 实验。未量化渲染成本、阈值、过渡舒适度、玩家表现及单人维护工时，也未认证无人工美术修补的完整流程。通用视图取舍只写一份，不虚构两引擎现成集成配方。[研究]
