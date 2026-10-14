主线：一／三／四；玩法反馈、第二次修改与可维护交付
改变的建议：[研究] 默认组件＋窄规则＋局部状态机，先明确所有者、时钟和退出；实际复杂度再升级 HFSM／行为树／GAS／ECS，相机与重试围绕玩家决策，命令预览复用规则但不承诺任意结果精确；多来源效果区分授予所有权与合并语义
新证据：[一手／社区] 固定项目源码、修复链、作者复盘及镜头默认值争议；新增 OpenRA 条件授予／撤销、Shattered Pixel Dungeon 毒镖／计时源码与 GAS 聚合契约；保留预览及 rewind 对照；[研究] 含确定性算术反例，无引擎／玩家对照，不能证明架构或手感收益

# WP11：单人独立游戏的 gameplay 架构取舍

证据核实：原记录为 2026-10-13—14 UTC；命令预览及效果叠加补研为 2026-10-15（UTC+8），各节保留版本和日期。除明标的确定性算术复核外，仅调查公开资料／源码；未运行引擎、游戏、模型或玩家实验，未安装／购买插件。“AI 失败”为契约风险推导，非出错率统计；固定主干不等于稳定发布包。

## 一、研究结论与适用边界

**[研究] ✅ 采用：Unity 的默认底座是现有组件＋少量纯 C# 规则＋显式局部状态机；Unreal 对照是已有 Gameplay Framework＋ActorComponent＋C++ 规则。** 不先自建通用框架、全局消息总线或全 ECS，也不因 Lyra 官方而整套移植。最初先完成玩法实际需要的开始、暂停／局内菜单、结算、重试路径，并清干净上一局；不要求所有游戏都暂停世界。对象多不等于需要 ECS，技能多不等于需要 GAS，敌人有三种行为不等于需要行为树。

**[研究] 架构升级用“当前会反复变化的复杂度”决定：** 多层互斥状态与可中断动作→HFSM；多个优先级目标、共享行为子树与动态打断→行为树／StateTree；大量可组合效果、属性、标签、成本、冷却及必要的预测同步→GAS；目标设备上可批处理的同构 CPU 热点→局部 Jobs/Burst 或 ECS。复杂度与维护成本同时估算，不能仅凭“以后能扩展”升级。

**[研究] 局限：** 架构取舍仍须由同一玩法切片的第二次修改与目标设备构建检验；源码和官方修复只支持机制判断。

## 二、九个模块：做到哪、可省什么、AI 会破坏什么、怎么验

### 1. 游戏循环：把“一局结束”做成真正的生命周期边界

**[研究] 最低完成度**：Boot／FrontEnd／Loading／Playing／Paused／Results 的清晰归属，按游戏实际需求删减；暂停可以是 Playing 的子状态而非另造全局状态。唯一的 Session 或 Run 所有者负责本局敌人、临时奖励、计时器、订阅与取消。常驻的 Settings／存档服务与本局状态分开。把“开始下一局”定义为新 session，而不是到处将布尔值改回 false。

- **Unity 默认**：一个组合入口装配组件，规则接受明确的 delta/tick；沿已有 Update／FixedUpdate，不替换整个 PlayerLoop。需要物理的运动留在正确时序；UI、相机、菜单是否用不受暂停影响的时间各自声明。
- **UE 对照 [一手]**：GameInstance 跨关卡，GameMode 随关卡而建，Pawn 与控制者分开；不要把世界内 Actor 引用永久塞入 GameInstance 来“保持状态”。[Gameplay Framework](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-framework-in-unreal-engine)
- **可省**：自建引擎循环、跨所有玩法的 GameManager 继承树、单机不需要的服务器会话层；只为快速开始也不必引入 DI 容器。
- **AI 典型风险 [研究]**：第二次加入暂停后，动画停但技能协程／菜单计时仍推进；重开重复订阅，旧一局奖励延迟回调写到新局；失败与胜利同时触发双重结算。
- **将来验证**：同一输入轨迹跑正常结束、失败、暂停时重试、加载中退出，断言每个 session 最多结算一次；旧 session 的事件和回调不能改变新 session；重试若干轮后对象、订阅和任务数回到基线。时钟／物理确定性需真实引擎，纯规则测试不能代替。

### 2. 状态机、行为树与 StateTree：先问什么会打断什么

**[研究] 最低完成度**：给每个状态写允许入口、出口、结束条件、打断优先级与清理动作。敌人的 Idle／Pursue／Attack／Dead 可用 enum 或小类；状态共享“在地面／空中”“正常／眩晕”等父层规则时再加 HFSM，避免布尔组合爆炸。多目标优先级和复用任务确实改变内容制作时再使用行为树。

- **✅ 采用／改造**：UnityHFSM 的状态时序机制适合代码优先的单人项目，但由角色持有独立实例，死亡／场景卸载必须能绕过非关键退出等待；不要复制自己的 HFSM 轮子。
- **🧪 试用**：Unity Behavior 1.0.16 适合确实需要图形化行为资产的 Unity 项目；UE 已用 Blackboard／BT 时沿用原生 Observer Aborts，状态阶段与并发 Task 为主时评估 StateTree。二者不是“新的一定替换旧的”。[UE BT](https://dev.epicgames.com/documentation/en-us/unreal-engine/behavior-tree-in-unreal-engine---overview)、[StateTree](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-state-tree-in-unreal-engine)
- **决定性反例 [一手]**：UnityHFSM 2.2 为“数据完整性”将 needsExitTime 等改 readonly；用户依赖运行时修改而无法升级（[#71](https://github.com/Inspiaaa/UnityHFSM/issues/71)）。2.3 的 [94f316f](https://github.com/Inspiaaa/UnityHFSM/commit/94f316fdae5be5abe964f70355bbb697274d38c0) 恢复可变，并注明 needsExitTime 要到下一次转换求值才生效，isGhostState 到下一次进入才生效。所谓“清理架构”也可能毁掉真实游戏契约，不能机械把可变字段改只读。
- **近期机制风险 [一手]**：Unity Behavior [1.0.16 changelog](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/changelog/CHANGELOG.html) 增加 OnSetup／OnTeardown，并修复目标不可达时导航持续 Running、运行中黑板位置改变但目的地未更新、动态子图实例／黑板回调问题。1.0.15 才加入特定节点及结构下的 ObserverAbort；不能把所有 BT 的 abort 语义视为一致。
- **可省**：三个简单敌人为其搭可视化节点编辑器；同时维护 HFSM、BT、GOAP 三套决策；每一帧全图扫描；为未出现的内容团队先买大型编辑器。
- **AI 风险 [研究]**：用进入条件冒充持续条件，追击目标消失仍施法；状态退出后异步 MoveTo 继续改速度；等待动画结束永远不退出；共享 Blackboard 上一次目标残留；错误地假定一个 tick 最多一次转换或 StateTree 等所有 Task 完成。
- **将来验证**：高优先级死亡／眩晕打断低优先级攻击，攻击不可打断窗口之后恰好退出；导航不可达、目标销毁、子图热替换、禁用再启用都必须终止或明确失败。对图资产还要检查版本升级、枚举改名及 Prefab 覆盖后的运行图；有图可见不等于 Agent 看到了实际运行实例。

### 3. 数据驱动配置：静态定义、活实例、存档不能同一个对象

**[研究] 最低完成度**：定义层保存稳定内容 ID、初始数值与资产引用；实例层保存 HP、冷却剩余、目标、当前阶段；存档层保存可迁移的数据快照与 schemaVersion。配置可由 ScriptableObject／DataAsset、DataTable 或已有 CSV 管线承载，不以格式决定架构。给 ID 唯一性、引用完整性、数值范围和版本迁移建窄校验。

**[一手] Chop Chop 不是“把运行状态全部放到共享 SO”**：固定 [608eac98](https://github.com/UnityTechnologies/open-project-1/tree/608eac98df29cd97821a6115cd52dfb9027345b1) 的 TransitionTableSO.GetInitialState 每个 StateMachine 创建自己的 createdInstances 字典，StateActionSO.GetAction 生成普通运行时 StateAction 并在该图内复用；Damageable 对未配置 HealthSO 的敌人 CreateInstance，让不同敌人不共享血量。其“配置资产复用、运行状态隔离”可借用，不必借整套 SO 编辑器。

**[一手] 后续修改反证**：[753c30e](https://github.com/UnityTechnologies/open-project-1/commit/753c30e6fda71c6024c69ee5704b71cfa110e160) 将初始血量写入移进“新建实例”的分支，不再让所有 Awake 都重置已有玩家生命；提交同时处理 UI 血量重置与敌人不应发玩家 UI 事件。相同 Health 类型有不同寿命，统一 Reset 不是正确抽象。

- **可省**：“所有整数都 SO”、每项配置热更新、可视化表格后端、通用反射 ORM、自建 mod 语言；没有外部内容作者和热更新需求就用引擎已有序列化。
- **AI 风险 [研究]**：向共享技能定义写冷却；用数组序号当存档 ID；将字段重命名视为纯代码改动而破坏已序列化资产；敌人复制后同时掉血；把静态 readonly 与领域不变量混为一谈。
- **将来验证**：同一定义生成两个角色、只伤害其中一个；先运行再新开局确认定义未污染；固定 v1 存档在 v2 增删／改名内容后加载，必须迁移或可理解地拒绝。对配置修改分开记录“既有实例即时生效、下次生成生效、仅新局生效”，不能由 Agent 猜。

### 4. 组件、Jobs/Burst、ECS：先用数据规模和预算选，不用对象数口号选

[研究] 本小节 Jobs/Burst、Entities、ECB、enableable、authoring／烘焙的具体机制属于 Unity；UE 仅共用先定位成本再迁移热点的原则，不据此建立跨引擎 API 等价关系。

**[研究] 默认采用**：MonoBehaviour／ActorComponent 负责引擎对象，纯函数／普通类承担能独立验证的规则。对象多而成本在动画、绘制、碰撞或寻路时，先解决该热点，ECS 不会自动修掉 GPU overdraw、复杂蒙皮和错误导航。单个昂贵批处理也可先用 Jobs/Burst，无须把 UI、对话与相机一起迁到 Entities。

**[一手] 可借官方小样例，不照抄全游戏底座**：[Entities samples 6786a741](https://github.com/Unity-Technologies/EntityComponentSystemSamples/tree/6786a741ee1f118ed14cecfa02beae8e926937b0) README 指向 Unity 6.2／Entities 1.4 系列；实际 `13. StateChange/SetStateSystem.cs` 比较 VALUE、STRUCTURAL_CHANGE、ENABLEABLE_COMPONENT 三种状态表示，并自带 profiler 入口。README 的链接仍写 14，不宜盲复制其旧路径。

**[一手] 关键代价**：Entities 1.4 文档说明添加／移除组件等结构变更会迁移数据并涉及同步；enableable 不改变 archetype，但相关写作业仍可能使主线程查询等待，且禁用组件在普通查询中视同不存在。[结构变更](https://docs.unity.cn/Packages/com.unity.entities%401.4/manual/optimize-structural-changes.html)、[enableable 1.4.8](https://docs.unity3d.com/Packages/com.unity.entities@1.4/manual/components-enableable-use.html)

- **ECS 真值得 [研究]**：玩法确实是大群单位、海量弹体、工厂或模拟，其同构计算可并行且现有架构在目标设备 CPU 帧预算中失败；内容也适合 baking 和数据布局，并能接受调试、混合层及版本适配成本。先迁最热的一块；没有通用“超过 N 个对象就必须 ECS”的数字。
- **反对一刀切 [一手＋研究]**：V Rising 官方案例确有 ECS 生产采用，但它是多人开放世界团队项目，且案例明确转变范式和建底座需要时间；这是“能用于复杂商业游戏”的证据，不是“单人一开始全 ECS 最省钱”的证据。[Unity 案例](https://unity.com/resources/stunlock-studios-v-rising)
- **可省**：全工程 ECS、为少量机关加实体世界、过早锁步／回滚；UE 的 Mass 同样不因“将来大地图”默认加入。
- **AI 风险 [研究]**：用 Add/Remove tag 表达每帧变化而制造结构变更；读写依赖遗漏；把 ECB 录制完成当已应用；复用销毁的 Entity；忘记禁用组件过滤；authoring 数据修改却没有重烘焙。
- **将来验证**：同一玩法、资产、设备上比较组件基线、局部 Jobs 与 ECS；固定对象规模和出生／死亡密度，测 CPU P95/P99、同步点、内存、主线程／worker 占用及第二次需求修改工时。样例的强制 Complete 与 timing 是测量设施，不能照搬到生产每帧；其局部计时中结构变更只录制 ECB，实际 playback 在之后，ENABLEABLE 分支也混用 ECB 启用和直接禁用，不能仅凭该段计时排序总成本；对照须纳入 playback 与后续系统；本轮未跑 benchmark，不报加速倍数。

### 5. 事件：用于传播已发生事实，别把一次命令拆成无人负责的广播

**[研究] 最低完成度**：同一对象内直接调用；跨边界必须多个观察者才使用类型化事件。命令要有一个明确处理者及成功／失败结果；DamageApplied、EnemyDied 等事实在状态提交后广播给 UI／音效／任务。声明同步或排队、顺序、重入策略、是否允许丢弃。少量 SO 事件通道只在 Inspector 装配与跨场景连接确有收益时采用。

**[一手] Unity 官方例子**强调 OnEnable 订阅／OnDisable 退订并说明 SO event channel 是项目级资产；因此“换场景就自动清干净”不是其承诺。[官方事件通道说明](https://unity.com/how-to/scriptableobjects-event-channels-game-code)

- **可省**：无差别全局 EventBus、字符串消息、自建完整 CQRS／事件溯源、每帧健康轮询和每个属性一个广播。
- **AI 风险 [研究]**：匿名 lambda 退订失败，双重订阅，事件在构造半完成状态发出；伤害／死亡广播造成重入后重复奖励；晚订阅 UI 丢失初始状态；一条事件跨场景带过期对象引用。
- **将来验证**：同一死亡触发多次，只提交一次事实与奖励；监听者在回调中销毁或退订不会破坏枚举；池对象启用／禁用多轮，每次只收一次；UI 晚加入通过快照建立当前值而非期望历史广播重放。必要时用 sessionId、entityId、operationId 拒绝旧事件，简单局部函数无需全部加 ID。

### 6. 战斗与技能：先统一结算权，再谈 GAS

**[研究] 最低完成度**：攻击请求→合法性／资源检查→启动／承诺成本→命中判定→伤害与效果提交→结束或取消。每一步的权威所有者唯一。动画和 VFX 表现结算，不各自再扣血；动画事件可以触发命中窗口，但“取消、死亡、换场景之后的晚事件”需失效。给一次攻击分配足够区分重入／池化复用的操作身份；同目标是否能被同攻击多次命中由规则决定，不是统一去重到永远。

- **Unity 最佳性价比 [研究]**：先 Health／Combatant／AbilityRunner 小组件＋不可变 AbilityDefinition＋每次施放的 AbilityExecution；已有成熟角色控制器或技能模块覆盖实际玩法时复用并留适配边界，不从零造全能技能编辑器。
- **UE 默认 [研究]**：少量攻击／冲刺可用 ActorComponent、Montage 和现有输入层；只有重复出现属性计算、叠层效果、标签互斥、费用冷却、目标与必要网络预测时，GAS 的一致模型才可能比多处手写划算。复杂单机 RPG 也可能值得 GAS，不能说“GAS 只为联网”；少技能但规则复杂也可能适用，不按技能数量设死门槛。
- **官方代价 [一手]**：GAS 的 CommitAbility 应用费用与冷却；正常结束要显式 EndAbility，否则可能持续阻挡其他动作；Per-Actor 实例跨施放复用，成员需清理。[Gameplay Abilities](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-abilities-in-unreal-engine)
- **Lyra 的真实边界 [一手]**：Pawn 初始化依赖 possession、PlayerState、Input 与 Game Feature 就绪；PawnExtension 等条件满足后才授予能力，并在失去 Pawn 时移除关联能力。其 ASC 跨 Pawn 的组织是为具体体验和多人生命周期服务，不能无条件搬到单机。[Abilities in Lyra](https://dev.epicgames.com/documentation/unreal-engine/abilities-in-lyra-in-unreal-engine?lang=en-US)
- **可省**：几种固定动作先上完整 GameplayTag 分类、全技能网络预测、通用公式 DSL、可组合效果图；也不在 Unity 里为了名字相同去复刻 UE GAS 全栈。
- **AI 风险 [研究]**：Check 后仍可能失效却无提交时检查；费用扣两次；取消技能忘移除标签、移动锁、命中盒和订阅；非实例化默认对象写玩家私有状态；Per-Actor 复用残留上次目标；重生重复授予。
- **将来验证**：施放准备／费用提交／命中／恢复各阶段插入死亡、眩晕、失去目标、场景卸载；断言费用、冷却、效果、伤害和奖励次数；同时攻击与治疗的顺序固定。若有网络再测延迟／丢包／预测回滚；单机切片不替联网通过。

### 7. 相机：先复用成熟运行时，验收的是可读性与控制权

**[研究] 最低完成度**：一个玩家视口的最终相机拥有明确控制权；跟随、瞄准、过场、菜单切换有优先级；传送与重生按意图保留或重置跟随历史，碰撞遮挡不丢关键信息，暂停和相机震动有明确策略。Unity 优先适配目标版本的 Cinemachine，UE 先 CameraComponent／SpringArm／PlayerCameraManager；镜头足够简单可只用固定相机。

**[一手] 固定源码与真实修改链**：Cinemachine [45728f30](https://github.com/Unity-Technologies/com.unity.cinemachine/tree/45728f3030787076f32930101d11d9ca96fe3a0f) 的 Brain 区分 SmartUpdate／FixedUpdate／LateUpdate；2026-02 fast-enter-play 支持后，[2026-08 #1122／69b2051](https://github.com/Unity-Technologies/com.unity.cinemachine/commit/69b205115495a374fbba329547ba608cdcfe7847) 又将 static reset 提前至 SubsystemRegistration，并重新创建 CameraUpdated／Activated 等事件。默认分支 changelog 此项归于 3.1.8-pre.2，不可宣称所有已发布 3.1.x 已修。

- **可省**：自研完整 Cinemachine、每种技能独立控制 Camera transform、对普通固定视角游戏搭通用镜头语言。
- **AI 风险 [研究]**：物理目标在 FixedUpdate 移动而镜头拿不一致时序；传送后追着旧位置平滑；切镜完成的回调却在取消后覆盖新镜头；循环进入 PlayMode 静态监听残留；禁用鼠标控制但最后一帧轴值继续生效。
- **将来验证**：低帧率、不同固定步长、暂停／恢复、传送、重生、过场中取消、窄走廊、快速多次切镜；有时序日志和屏幕轨迹仍要真人判晕动与瞄准手感。相机库修复不是游戏已验证。

### 8. 关卡：先做可重置的遭遇，再做大世界

**[研究] 最低完成度**：关卡定义（稳定 levelId、入口、目标、出生表）与运行状态分开；每个 Encounter 所有者管理产生的敌人、触发器状态和一次性奖励；完成标记由存档域持有，不依赖 Scene 中对象是否还活着。目标、出口、回退位置可查询，重进关卡不会误发奖励。

- **Unity**：场景承载内容，组合入口注入玩家／服务；Additive／Addressables 的释放细节归 WP10，玩法层必须提供退出／取消钩子。UE 先普通 Level；确实需要流式世界后再上相应分区机制。
- **可省**：小房间游戏用 World Partition 级系统、纯随机生成替代关卡设计、自建通用关卡编辑器；已有模块化房间足够时让程序生成组合和验证可达性即可。
- **AI 风险 [研究]**：把 Scene load 完当玩法 ready；门只等某个已销毁敌人的事件而永远不开；检查点保存了运行实例引用；生成顺序改变而让种子不再对应同布局；脚本重建关卡丢稳定 ID。
- **将来验证**：从每个检查点恢复，杀怪后离开再回、完成事件重放、加载失败、出生位置被占、最后敌人离场；验证出口可达、任务可完成、关键资源可取得。程序化地图保留 seed、生成器版本与关键布局数据，只有 seed 不保证版本升级仍兼容。

### 9. AI 第二次修改：交付“契约切片”，不强制再搭一层工具

**[研究] 最低必要上下文**：现有相关实现＋版本＋依赖资产／节点引用＋一页以内的状态与生命周期说明＋已存在的回归夹具。让 AI 先追明一个需求跨哪几处，再改这些位置；不是要求所有人新建一套文档平台。

**建议给 Agent 的具体契约 [研究]**：
1. 定义不可保存当前 HP／目标／冷却；运行实例由谁创建、复用、退出时谁清理
2. 每个字段的寿命：项目、存档、session、场景、角色、一次施放；每个计时器的时钟
3. 哪个函数提交伤害／奖励／库存变化，谁只观察；同步或排队事件的顺序
4. 在正常结束、取消、死亡、卸载、池回收五条路径上，哪些句柄、标签、任务和订阅必须归零
5. 内容 ID 与序列化字段不能随重构漂移；改变需要迁移和旧夹具
6. 准确包版本与已经知道的本地改造；不要“顺手更新所有依赖／改成最佳实践”

**第二次需求的推荐题 [研究]**：先有单段冲刺攻击，再改为“可蓄力、受击中断、取消后只按已承诺规则扣资源，并能从检查点重开”。这会同时检验配置／执行实例、退出时机、命中幂等、动画晚事件、相机控制和关卡重置，比增加一个同类技能更有区分度。记录改动文件、资产引用、主动工时与回归失败，而不是仅比较生成 token 或代码行数。

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

**[一手＋研究] NoAI 不是只看商用开关**：[Epic Content License §5(c)(viii)、§17](https://www.unrealengine.com/eula/content) 对受该协议约束的 NoAI Content 涵盖生成式 AI 数据集、开发和输入。Fab 产品标记不能自行证明每个 Lyra 代码文件都适用同一协议，也不能据此推导所有 UE 开发禁止 AI；本轮只读公开技术文档，不下载／提交样例资源给模型。真正接入前，应保存具体文件授权链；不能用非官方 GitHub 镜像绕过资产条件。

**[一手＋研究] 商业工具也有第二次修改成本**：Opsive [10-02 EULA](https://opsive.com/solutions/decision-solution/behavior-designer-pro/eula/) 对编辑器操作者与仅使用编译游戏者分开，对营收／融资设订阅门槛，订阅过期要求停止使用和删除源码，仅留已取得版本对象码；[购买页](https://opsive.com/assets/behavior-designer-pro/) 与许可的席位类别、阈值文字需购买前对应具体 SKU。单人项目应把可离线维护、未来融资和源码持续可用性计入成本，而非只比较首次价格。本轮只评估，未接受条款或付款。

## 五、两个成熟项目能反证什么，不能反证什么

### Daggerfall Unity：已发布复杂游戏也不等于全图／全 ECS

**[一手]** EnemyMotor 是 MonoBehaviour，FixedUpdate 以明确顺序处理麻痹、击退、重力、不能行动、撞门、计时器、行动与跌落伤害，其他感知／攻击组件分工；并不是“一个统一黑板图自动管理全部”。[固定 EnemyMotor](https://github.com/Interkarma/daggerfall-unity/blob/2343305d1d83ccc0de57a81e3b1e61188a997e34/Assets/Scripts/Game/EnemyMotor.cs)

**[一手]** [0519cee（2024-01-08）](https://github.com/Interkarma/daggerfall-unity/commit/0519cee99740d4005ef70b99a3a064ac0655ce72) 为 mod 提供具体行为 delegate；后续仍在具体重力／地面位置逻辑上修正。扩展点随真实需求出现，不必在第一天重写通用框架。该源码也有庞大类、全局访问和历史兼容负担，不能反推“大类就是最佳实践”或无需状态契约。

**[研究] 对单人的启发**：优先保证一个清晰、有测试的决策和结算顺序，再为真实重复需求抽象；不要为了“专业架构”把每个函数拆成一层抽象。复刻既有游戏的范围与原创项目不同，项目成功不能证明当前 Agent 能独立从零做同规模游戏。

### Chop Chop：可借结构，但历史 demo 的特例不能升格为通用规则

**[一手]** Damageable 死亡时立刻重设数值并保留 IsDead，与 Revive 分工是该游戏具体流程；CameraManager 保存场景外的 anchor，角色重新实例化后重绑 Follow／LookAt，并在禁用输入时清轴值。这些都是能读懂的生命周期例子，不应原封不动移植到“死亡尸体仍可查看 HP／多玩家／对象池”新需求。

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

**[研究] 优先实测的一个问题**：同一 Unity 小型战斗切片，用现有组件／小状态机完成第一版，然后做“蓄力可打断＋检查点重开”第二次修改；先不比较十个框架。若状态退出组合已经让小方案难维护，再对照 HFSM；只有规模证据指向 CPU 批处理，才用官方 StateChange 样例的方法比较 ECS。

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

核实：2026-10-14 UTC。主线 1／3／4；改变 05 第 8 节只强调所有权与取消的侧重，补充预判、取景、输入连续性与视觉意图。新证据是 Cinemachine 3.1.7 当前文档、Celeste64 固定源码中的体验规则，以及开发者自述与 2026 年可访问性指南；本次仍只有公开理论／源码研究。[研究]

### 1. 不把“顺滑”压成一个阻尼数

[研究] 相机至少有四个可能冲突的目标：提供决策信息、遵从玩家输入、建立视觉节奏、避免不必要的运动负担。更大死区能保住稳定参照，也会减少某方向的前方视野；更大阻尼降低突变，也会落后；更大视野装下更多威胁，也会缩小命中提示。应先问某个动作缺少哪种信息，再决定移动、变焦、前瞻或固定镜头，不能把复杂相机系统当质量升级的必经步骤。

**[一手] 机制资料与证据边界：**

| 来源／本次核实 | 直接支持的内容 | 不支持的推断 |
|---|---|---|
| [Unity 6.0 包页](https://docs.unity.com/en-us/engine/6000.0/manual/packages-list/packages-all/pack-safe/com-unity-cinemachine)与 3.1 文档页面元数据 | 当前该渠道发布版 3.1.7；从 2.x 升级有迁移工作 | 不是全渠道永远最新；不能将主干 3.1.8-pre.2 修复说成已进入 3.1.7 |
| [Position Composer](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachinePositionComposer.html) | 按屏幕位置、死区、各轴阻尼构图；前瞻会放大噪声，预测平滑增加滞后 | 未给具体游戏的最佳参数，也没有证实“多平滑就更舒服” |
| [Group Framing](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineGroupFraming.html) | 可用移动／变焦装下目标组，设构图尺度与镜头范围 | 将所有敌人加入组不等于战斗更可读；目标权重和成员资格由玩法决定 |
| [Deoccluder](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDeoccluder.html) | 拉近、保持高度或距离三种避遮挡取舍；最短遮挡时间、保持时间和恢复阻尼可减少无谓调整 | 不保证所有窄走廊有可行视点；看见角色不等于看见落点或敌人预告 |
| [Confiner 2D](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineConfiner2D.html) | 限制的是含视口尺寸／比例的区域；改变镜头需按文档失效相应缓存，形状重算有成本 | 一个边界多边形不能自动解决所有宽高比的构图；频繁重建并非零成本 |

[研究] **采用顺序**：先固定房间／单目标简单跟随；识别漏看的动作；只对该动作加状态规则；最后才加装饰性运动。新增规则如果只是让片段看起来更“电影感”，却增加玩家重找目标的次数或每间房的修补工作，就撤回。当前 Unity 原生组合通常比新引入另一个通用相机框架更好维护；这是匹配单人需求的判断，不是跨插件性能冠军结论。

### 2. 三种玩法的不同默认，不共享一套“最佳参数”

**[研究] 精确平台跳跃。** 玩家关心的是跳之前的目标、飞行中的高度参照、下落后的安全空间。屏内房间先固定；较大房间用死区和边界，水平前瞻只在高速移动确有漏看时加入。纵轴不用追每一次短跳，可以用着地／超出窗口／下落状态决定何时改变基准。失败条件是过大的窗口让落点来不及出现，或速度前瞻在左右试探时反复翻向。维护责任是关卡作者标出需保留视野的动作区间，程序只实现几种可解释规则；不要让 AI 逐房堆补丁、猜几十个无来源参数。

**[研究] 俯视战斗。** 默认固定朝向、较稳定尺度和有限跟随，让预告尺寸与闪避距离容易学习。小竞技场一次看全即可；Boss 体型或双目标需要时才加目标组，限定最低角色／预告可读尺度。若敌人分散导致镜头越拉越远，先缩小目标集合或调整遭遇空间；“都进画面”不是最高目标。退回条件是玩家读不到关键动画、镜头频繁呼吸式缩放，或新增敌人类型需要改大量相机特殊分支。本文未取得已发布俯视游戏采用此具体组件组合的证据，因此这是机制推导，不标成生产采用案例。

**[研究] 越肩射击／探索。** 探索允许适度跟随惯性，精确瞄准需要更直接的输入响应；不要把摄像机、角色身体朝向和动画骨骼当同一目标。遮挡处理先选少数确定策略，遮挡物过滤与碰撞半径由镜头和关卡共同拥有。保持距离的自动绕行可能改变瞄准关系，拉近可能牺牲周边信息；若二者都不满足，修改关卡几何或局部遮挡表现，收益往往比再加求解分支更明确。局部透明还会引入材质／渲染维护，不能当免费兜底。

**遮挡补核（2026-10-14）：区分物理碰撞、可见信息与瞄准控制。** [一手] 指定文档元数据为 Cinemachine **3.1.7**；[Decollider](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDecollider.html)处理相机脱离障碍／地形的定位，明确不维护目标视线。[Deoccluder](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDeoccluder.html)依赖障碍 collider／物理查询，Maximum Effort 限制处理的命中数；增加上限可能增加成本，不能补救不存在的视点。Transparent Layers 是遮挡排除层，不是淡出材质控制。两者都不能证明枪口可射击或落点可读。[研究] 因而先保住玩家瞄准意图，在允许的相机位移范围内恢复视线；不能为自动绕开柱子而悄悄改变准星方向，也不要把两个组件全部叠加当默认升级。

[研究] **固定朝向下的局部遮挡，🧪 复用材质原语，按玩法选择显隐对象。** [一手] [Shader Graph 17.0.4 Dither](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/manual/Dither-Node.html)文档给出接入 Alpha Clip Threshold 的做法，通过丢弃部分像素模拟透明，同时保留不透明渲染的深度写入等性质；这不是完整遮挡系统。[研究] 程序仍负责可淡出对象集合、遮挡范围、恢复状态；树冠／前景可局部退让，掩体边界、落地表面和攻击预告不能一起消失。显示角色轮廓只能回答“人在哪”，不能回答“往哪落／哪边能躲”；按房间切掉屋顶适合已定义清楚的区域，但新增层高、门窗或穿越状态时也必须回看边界。屏幕空间抖点在实际分辨率和运动中是否干扰提示要另验，本文不宣称它比透明混合更快或更舒服。

[一手] **实际发布后的维护反证：** The Indie Stone 的 [Project Zomboid 42.21 stable 公告](https://projectzomboid.com/blog/news/2026/09/42-21-stable-released/)明确大树影响驾驶视野，修改 cutaway 以免遮住树下房屋／家具，并称仍需继续改进。[研究] 这支持把“更高树冠＋步行改驾驶／瞄准”的二次修改列为验收，不支持该游戏方案普遍最优，也不证明它使用 Cinemachine／Shader Graph。本文只借开发者公开报告，不取得或推荐复制其代码、地图、shader 或美术资产。

[研究] **采用边界与成本：** ✅ 已用 Unity 的项目先复用上述原生组件／节点，避免再接一套通用相机框架；若当前材质无法批量承接显隐参数，或每加一种墙／树都要写例外，先改几何和构图。二改记录新增 collider／材质变体／显隐例外数、恢复遗漏与调参工时；在同一新遮挡物下检查角色、落点、预告、准星和真实弹道，而不是只看角色有没有露出来。Cinemachine [3.1 许可页](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/license/LICENSE.html)与 Shader Graph [17.0 许可页](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/license/LICENSE.html)均标 UCL、限 Unity-dependent 项目，不能当作可跨引擎搬运的 MIT 代码；引擎计划资格另按 WP1 核。这里增加的是接入／维护责任判断，没有购买插件，也没有测得性能或工时数字。

### 3. 两种真实开发证据：借机制，不复制整套负担

**Mushroom 11：开发者对自己的游戏的说明。** [Itay Keren 的修订文章](https://gamedesignskills.com/game-design/camera-design-2d-side-scroller-games/)源自 GDC 2015，不能把网页重新发表当新算法。其本人说明区域各自有镜头路径与缩放，解谜区域可取多个块的平均，推进区域偏向最前方块；因为游戏没有跳跃，运动预测较自然。[一手] [研究] 这支持“按玩法定义焦点、必要时由关卡指定区域”的方法。它不支持给所有平台游戏默认开启纵轴速度预测，也没有给出单人长期内容维护工时或对照舒适度数字。每关几十个手工区域正是应纳入成本的部分；只有简单跟随确实无法表达谜题意图才增加区域导演。

**Celeste64：可发布小作品的局部实现。** 本次通过公开 GitHub API 锁定 `EXOK/Celeste64@6edfe1ebd2a21a6134d7675a28e357891025407e`，该主干提交日期 2026-09-07；不是声称该日重新发布游戏。完整读取 [Player.cs](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs)，核对以下路径：[一手]

- 443–460：水平跟随角色，垂直目标依据着地、下落与高度窗选择；使用含 delta 的指数趋近，避免把“每帧固定比例”当时间不变的阻尼
- 544–589：局部固定镜头区域与一般碰撞修正并存；这说明局部设计镜头可以与常规跟随共存，不证明其射线方案覆盖所有近裁剪或窄角落情形
- 597–617：普通移动使用当前画面方向建立输入基；1474–1487 的攀爬则在横向输入松回阈值内才重算方向符号，保持转角期间持续输入的意图
- 480–482：速度会影响 FOV；这仅是作者的效果选择，不构成所有高速移动都应改变 FOV、或已验证减轻晕动的证据

[研究] **✅ 改造局部规则，⛔ 不移植工程结构。** 官方 [ReadMe](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/ReadMe.md)说明由原团队在不足两周内制作，按 jam 级项目学习，Player 自称单体类；发布游戏确实比孤立教程更贴近体验，但不能据此推荐长期维持巨型类。特别值得借的是攀爬的“同一按住意图跨视角变化仍连续”，迁入 Unity 时让移动组件拥有该语义，相机只提供最终朝向，不把该规则塞进通用镜头库。

**许可分层 [一手]**：Celeste64 [Source/License.txt](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/License.txt)为 MIT；ReadMe 明确 Content 与 Celeste IP 归权利人，非商业同人许可不能扩为商业素材许可，FMOD 另有例外。Cinemachine 固定 [LICENSE.md](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/LICENSE.md)指 Unity-dependent 项目的 Unity Companion License，并非 MIT。本文仅借机制与链接，未搬运图像、音频、角色或整段源代码。

### 4. 瞄准、切镜和舒适度属于玩法质量

[一手] 当前 [Third Person Aim 文档](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineThirdPersonAim.html)区分相机所看点与角色可能命中点。又读固定源码 [CinemachineThirdPersonAim.cs](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Behaviours/CinemachineThirdPersonAim.cs)：先求看向点，再从 `vcam.Follow.position` 检查遮挡。官方样例 [AimTargetManager.cs](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Samples~/Shared%20Assets/Scripts/AimTargetManager.cs)在 CameraUpdatedEvent 后更新屏幕指示，再从传入 firingOrigin 生成射向目标的方向。

[研究] 因而“用了 Third Person Aim 就保证任何枪口无遮挡”是错误扩大：Follow 原点可能并非枪口，发射物大小、弹道、散布仍属武器系统。后续应让准星清楚区分瞄准目标和受阻点，并测近墙／越肩换边／高低差。装饰噪声可取消以保准星，故意的后坐力则需单独建模，否则反馈与命中挑战会一起被抹掉。

[一手] [Input Axis Controller](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineInputAxisController.html)区分输入加减速、混合期抑制、非缩放时间与 Cancel Delta Time；鼠标 delta 本身随帧间隔累积，不能按摇杆角速率再积分一次。[研究] 默认不为精确鼠标瞄准添加无需求平滑；瞄准模式混合时是否继续响应必须由玩法决定，不能照抄“混合期禁输入”开关。

[一手] [切换文档](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/concept-camera-control-transitions.html)说明混合期间两台虚拟相机可同时 live，甚至停用对象也可能仍参与混合。[研究] “唯一输出控制权”是 Brain／最终输出层唯一，不是要求混合时只有一台虚拟相机；传送、复活、谜题揭示、瞄准切换应分别选择 cut、blend 或重置目标，避免为了统一过渡使快速重试和即时瞄准拖沓。

[一手] [Xbox XAG 117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117)页面标记更新于 2026-03-04，建议可关闭额外镜头运动、调整视野与横纵灵敏度／自动回正；[Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/avoid-or-provide-option-to-disable-any-difference-between-controller-movement-and-camera-movement/)同样强调可退出非输入驱动效果。[研究] 这是可访问性建议及产品实例，不是统一医疗阈值或本项目已测降低不适。关闭震动后仍应从动作、声音和 UI 获得命中信息；固定视角玩法不必为满足一份通用清单另做第一／第三人称双系统。

### 5. 后续体验验收与维护成本

[研究] 待未来获准运行切片再做；当前不能把以下项目标为通过，也不设伪精确的通用“最佳毫秒”。

| 观察任务 | 需要记录的证据 | 撤回／修改条件 |
|---|---|---|
| 同一跳跃在默认镜头、有限前瞻下试玩 | 玩家起跳前是否能指出落点；失误时当时可见区域；急转向后视野恢复 | 只是视频更流畅，但看落点更晚或反向时镜头反复摆动 |
| 同一遭遇固定尺度与目标组比较 | 预告能否被认出；关键角色屏幕尺度；远处敌人加入时是否被迫缩放 | 更多对象入镜却更难分辨攻击，或每种敌人要补特例 |
| 掩体边缘瞄准、连续绕柱、开关瞄准 | 准星／受阻点／真实枪口轨迹；拉近恢复次数；同输入下目标稳定性 | 准星承诺与命中不符，避障持续抢控制，碰撞修正产生反复抽动 |
| 持续按方向经过区域切镜／攀爬转角 | 输入轨迹、最终相机方向、角色运动方向；手柄与键鼠分开 | 同一意图突然逆转或必须松手重找方向，而玩法未告知 |
| 默认与减弱运动设置完成同一路段 | 主观舒适反馈、是否需要重找目标、关闭效果后命中反馈辨识 | 将“无报错／帧率稳定”当舒适通过；不适参与者不被要求继续 |

[研究] 同时保留原有暂停、低帧率、时钟、传送、重生、过场取消与静态重入检查。第二次修改可只增加“一个下落房间＋一个狭窄掩体角落”，记录新增模式／特殊分支、改动资产数、调参工时；如果小内容修改牵动所有镜头，先简化责任与配置，而非引入更大的导演框架。AI 擅长记录轨迹、实现清楚的模式、暴露参数和维护回归；设计者仍拥有视觉意图、取景节奏、输入承诺和真人舒适验收。

## 战斗质量补研：动作节奏与遭遇可读性一起设计

核实：2026-10-14 UTC。主线 1／3；改变 05 第 7 节只强调结算、取消正确性的侧重，补充玩家能学习的动作承诺、接触力度与恢复节奏。新证据是已发布游戏开发者自述、官方历史取消回归及现行原生动画契约；不重复 04 的输入／打击反馈参数表。[研究]

### 1. 三种生产经验改变哪些建议

| 直接来源与证据性质 | 具体观察 | 本文采用／不采用 |
|---|---|---|
| [Thomas Vasseur，Dead Cells 动画流程，2018-01-25](https://www.gamedeveloper.com/production/art-design-deep-dive-using-a-3d-pipeline-for-2d-animation-in-i-dead-cells-i-)；本人制作复盘 [一手] | 可重做时序是关键收益；新武器可多次调整，过去仅在代码里调播放速度不足；其团队在动画与细节之间有所取舍 | ✅ 优先选可反复调整的动作资产与流程，分开改前摇、接触、恢复；⛔ 不把“3D 转像素”当无美术人员必然成功的路线。作者仍承担模型、动作与美术判断 |
| [Mark Foster，Death’s Door 动画访谈，2021-08-27](https://www.gamedeveloper.com/art/animation-feature)；仅其本人描述作为一手 [一手] | 漂亮外包动作不能替代他想控制的动作间连接；小屏幕角色不值得投入不可见的细节 | ✅ 在实际游戏镜头下判断姿态和衔接，把工时花在玩家看得到的动作；⛔ 不从“程序员学会动画”推断本仓库无手工修补基准已经实现 |
| [Alx Preston，Hyper Light Drifter 公平性访谈，2016-04-08](https://www.gamedeveloper.com/design/how-i-hyper-light-drifter-i-balances-difficulty-with-fairness)；设计者对自己游戏的描述 [一手] | 轮廓和起手传递信息；敌人组合使挑战上升；反弹子弹又格挡近战的敌人难与其他敌人组合而被删 | ✅ 在混合遭遇里评价预告与反制空间；⛔ 不以单挑 AI 更聪明当新敌人质量更高，也不推出所有游戏应降低单体智力 |

[研究] 三者交叉后，单人项目应优先得到“可重复修改的一招＋可解释的敌人组合”。动作不是渲染完才贴到伤害公式上的皮肤；它决定玩家怎样预测和掌握战斗。反过来，某个开发者声称满意或省时，不等于本项目获得了同样收益，三例都不是 AI 或无美术团队对照实验。

### 2. 慢、快与取消各自服务什么

[研究] 前摇表达准备和方向，接触段集中速度／姿态变化，恢复段建立下一决策的节奏。快攻击可把风险放在较短距离、低硬直或后续站位，重攻击可用长承诺换破防、范围或位移；这些是可选设计关系，不是统一平衡公式。敌人前摇需要让人作出相应决定，玩家前摇还要照顾操作回应，两者不必用同一时长。慢攻击在玩家知道何时已经来不及改招、能预先选机会时，同样能有高质量。

[研究] 一招至少明确：转向锁定时机、可移动区间、闪避／技能取消入口、连击接续入口、落空是否增加风险。先由玩法所有者准许转换，再让表现衔接，不让动画任意完成时刻偷偷定义规则。允许取消与完整播放都不是默认正确答案；不必要的滑动混合会抹掉清楚的接触姿态，无条件取消也会抹掉故意设计的重武器承诺。

[一手] [Dead Cells 官方 Update 33](https://deadcells.com/patchnotes/33)标明 33.1 为 2023-03-10，记录修复误删 Katana cancel technique；33.3 为 2023-03-30，再记录恢复空中 Hattori’s Katana 技巧。页面同时列出新武器与后续音效／表现修复。[研究] 这是真实历史回归证据，足以要求修改后保留既有连段与取消体验；不能据此猜测缺陷根因、精确帧窗口，或声称任何隐藏技巧都应永久保留。若有意改平衡，明确变更旧承诺并重新试玩。

### 3. 原生编排足够，重点是编辑后仍对得上

- **Unity 6.3**：[一手] [Animator 转场](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Transition.html)把 Exit Time、Fixed Duration、Transition Duration、Interruption Source／Ordered Interruption 分开；有 Exit Time 时条件在该时点后检查，AnyState 转场先进入中断队列。[研究] ✅ 沿用原生机制，但分别审查玩法准许取消和动画能否进入相应转场。换动画长度／播放速度后重新核接触姿态、窗口及混合，不把一个 normalizedTime 百分比当永远不变的现实时间。
- **Unreal 当前官方页面**：[一手] [Notifies](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-notifies-in-unreal-engine)支持 Notify State 区间、Sound／Niagara 及 Montage 通知；Branching Point 比 Queued 更精确、同步但成本更高，Link Method 的 Absolute／Relative／Proportional 对片段移动／缩放反应不同。[研究] ✅ 用现有 Montage 编排，只有确需精确次序的玩法分支才加同步通知；编辑动作后检查绑定方式。此默认 URL 本次页面标为 5.8，实际工程必须选对应版本，不借此声称已核旧版全部行为。
- **两者共同边界**：[研究] 动作事件可提示何时开始挥动、允许检测或播放准备声；确认命中后才选择受击声、格挡声和接触效果。持续拖尾用于解释运动方向，不代表整条可见轨迹始终有伤害。相机和音频的具体设置沿用 04／05 第 8 节；这里优先保护下一敌人的预告，使新武器视觉语言不会遮掉旧敌人的危险信息。

[研究] 无人工修补的可行起点是许可清楚、姿态已有可读性的现成动作，或适合刚体／简单 2D 的程序化动作，再用参数、分段、重定时和引擎内调整匹配玩法。程序可以修时序，不能保证修好错误轮廓、缺失姿态、穿插与重心；如果需要反复手修才能读懂，先换素材、缩少招式或降低表现复杂度。本轮没有新复制素材或代码；Unity／UE 原生功能仍按各自引擎条款，文章和成品游戏不提供素材再利用许可。

### 4. 新武器／新敌人后保住什么

[研究] 后续获准做切片时，保留一把已满意旧武器和一个代表遭遇；加入一把节奏不同的新武器，或一个与旧敌人形成新压力的敌人。不要只打训练木桩，也不要求全量笛卡尔组合：选会改变取消、预告、距离或接触的组合。

1. **前摇到承诺**：同镜头下能否辨认攻击方向与危险范围；改变方向／闪避的准许边界是否与姿态一致。记录输入、阶段与画面，不以玩家背下无提示例外为通过
2. **接触到结果**：命中、落空、格挡分别试；玩家说得出结果，声音／VFX 不许诺不存在的命中，新武器效果不遮挡同时到来的旧敌人预告
3. **恢复到下一步**：旧连段、取消和移动恢复仍符合设计；新慢武器的承诺确实换来相应收益，不能把所有不适都通过加速／开放取消消除
4. **从单体到遭遇**：新旧敌人混合、狭窄空间、边缘位置下仍有可读且可执行的选择；若无解，先调整攻击重叠、敌人组合或空间，不先叠更响的警报

[研究] 自动检查保存阶段窗口、伤害结果与允许转换，真人判断读懂时间、失误原因和重复操作意愿。记录新增特例和调参工时：新武器若要改每个敌人和相机，先检查共同动作语义，不急于加通用框架。设计者定轻重、承诺与公平；AI 维护参数、引用、对照轨迹及回归，不据此宣称能自动判断好玩。

[研究] Dead Cells Update 14 的格挡时序修订仅取得摘要，正文超时，未纳入采用证据。

[研究] 战斗补研的历史局部检查：`check_repo.py` 177 文件、0 errors，两个文件 `git diff --check` 通过；未在该轮重跑完整离线入口。

## Unreal 相机补研：同一遮挡问题的原生职责与新系统边界

核实：2026-10-14 UTC。主线 1／3；改变 05 第 8 节把 Cinemachine 组件名放进通用玩法表、UE 只列三个名称的缺口。新证据为 Epic 当前标 5.8 的原生相机契约、Top Down Strategy 屋顶示例及仍标 Experimental 的 Gameplay Cameras 页面；以下设计组合标为研究判断，不冒充引擎内置玩法。[研究]

### 1. 默认采用什么，谁不能替谁做决定

[一手] [USpringArmComponent](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/USpringArmComponent)公开 API 把 bDoCollisionTest 定义为用 ProbeChannel／ProbeSize 防止 camera clipping；ProbeChannel 默认 ECC_Camera。SocketOffset 在臂端，文档建议用它而非所挂组件的相对偏移以保查询符合预期；bUsePawnControlRotation 决定是否使用 Pawn 的视图／控制朝向。[研究] 这支持默认使用成熟 boom 碰撞机制，但没有提供围绕任意目标搜索可用构图的保证；不能写成 SpringArm 与 Cinemachine Deoccluder 等价。相机不穿墙、目标可见、枪口可射击是三个问题。

[一手] [Cameras](https://dev.epicgames.com/documentation/unreal-engine/cameras-in-unreal-engine)说明 CameraComponent 提供视点参数，ViewTarget 提供候选 POV，PlayerCameraManager 管理最终视图和混合，并通过 GetCameraViewPoint 等公开查询提供结果。[ControlRotation](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/AController/GetControlRotation)则是完整瞄准旋转，可不同于相机与 Pawn 朝向。[研究] 因而沿用 PlayerCameraManager 作为最终视图归属，不要求每个项目新增其子类；控制层拥有输入意图，角色表现可只跟部分轴。碰撞修正不能擅自反写输入，最终视点也不能与角色骨骼朝向混用。

[一手] [Traces Overview](https://dev.epicgames.com/documentation/unreal-engine/traces-in-unreal-engine---overview?lang=en-US)区分 channel／object 查询及 line／shape sweep；Multi Trace by Channel 返回 overlap 到第一个 blocking hit 为止，不是所有遮挡物列表。[研究] 因此相机探测、可见性与武器路径要各自明确过滤和阻挡规则，不共用一个命中结果；要收集多层可淡出树冠，也不能假定一次 blocking channel 查询会拿到后面全部对象。

### 2. 越肩绕柱：改造射击与显示规则，不再造相机框架

**[研究] ✅ 原生基线＋两条独立路径。** 相机按玩家意图定位，SpringArm 负责约定范围内的防穿透；武器负责可发射性、弹道与伤害。这是由上述契约推导的工程建议，不是文档声称 UE 自动实现的两段瞄准算法。

1. 画面准星从实际显示的视点求候选目标；读取时声明与相机更新的先后，避免拿上一帧缓存或混合前 CameraComponent transform 解释当前画面。装饰性 shake 可与瞄准姿态分离，故意后坐力是否改目标由玩法明确，不把所有扰动强制消除
2. 武器从真实 muzzle／发射点向候选目标验证；hitscan 可用 line，有限尺寸弹体用合适 sweep，弧线弹道不能用一根直线宣称全程畅通。近墙生成重叠也要单独处理
3. 柱子挡住枪口但没挡镜头时，保留候选目标并清楚标示受阻／实际接触点；按既定规则阻止开火或击中掩体，不能从相机原点发子弹绕过碰撞。伤害提交仍属武器／战斗系统
4. 需要目标可见性修复时，先限制相机位移和换肩条件，持续输入不应因自动绕柱突然改方向；若取景和掩体公平性无法同时满足，修改柱距／肩位／遭遇，而非叠加一个不可预测的避障导演

[研究] **二改验收**：新增柱子或更长枪身，记录最终 POV、ControlRotation、枪口位置、候选目标、实际阻挡点与伤害结果；左右肩、贴墙、俯仰高低差、连续绕柱、开始／退出瞄准分别检查。能够看见敌人不等于有射线通路，射线畅通不等于有体积弹体可通过。AI 可补轨迹和断言，玩家判断瞄准是否被抢走。

### 3. 固定俯视：借原生 masked 开口，不复制 Unity 材质实现

[一手] [Top Down Template](https://dev.epicgames.com/documentation/unreal-engine/top-down-template-in-unreal-engine)的 Strategy 变体通过 M_Cutout masked material 显露屋顶内空间，以屏幕位置和相机位置计算效果，Material Instance 的 Strength 调开口大小。[研究] **🧪 改造这个局部材质机制**，优先留在已用 UE 材质／实例工作流；它不是完整树冠／落点识别器，也不能证明任意视距、投影或多楼层配置都能直接套用。

[研究] 项目须定义允许淡出的屋顶／树冠集合和所需可见区域，并保存恢复状态；退出遮挡、换目标、重生或卸载后恢复。只挖掉挡信息的前景：树干、可碰撞掩体边缘、落地平面与攻击预告仍提供空间判断。角色轮廓不提供落点；把整棵树隐藏也可能把仍阻挡子弹／移动的树干藏掉。材质显隐只改变画面，不改碰撞。若每种树都要特殊材质或每个房间都要补例外，先简化遮挡几何／镜头与内容，拒绝默认新建通用可见性框架。

[研究] 二改用“更宽树冠＋下层落地点”，观察落下之前能否辨出着陆面、敌人预告和逃路，同时记录新增材质变体／例外与恢复遗漏。屏幕开口／透明表现的稳定性与 GPU 成本须在目标设备验证；本轮没有比较 masked、dither、translucent 的性能，不把 Unity Shader Graph 的节点、许可或行为迁给 UE。未取得模板资产或受限源码。

### 4. 新系统何时值得替换基线

[一手] 当前读取的 [Gameplay Cameras 插件索引](https://dev.epicgames.com/documentation/unreal-engine/API/PluginIndex/GameplayCameras?lang=en-US)、[系统概览](https://dev.epicgames.com/documentation/unreal-engine/gameplay-camera-system-overview?lang=en-US)及 [Quick Start](https://dev.epicgames.com/documentation/unreal-engine/gameplay-camera-system-quick-start)均明确 Experimental，页面标题标 UE 5.8。概览把 rigs、transitions、director 放进可复用 Camera Asset，带 Camera Debugger；Quick Start 的第三人称与俯视 rig 使用 Occlusion Material，且教学流程移除旧 CameraBoom／FollowCamera。

[研究] **👀 有条件评估**：多角色共享多套 rig／过渡、图形化导演确有内容编辑收益，并愿承担版本兼容与发布回归时，才在隔离切片比较。**⛔ 不默认迁移**：只为一根柱、一层树冠或“5.8 更新”，现有原生路线仍更小；不同时让旧相机和新系统争最终输出。Occlusion Material 是新系统能力的证据，不保证自动保留掩体边界或解决武器合法性；本轮没读它的受限实现，不猜测其采样范围／还原细节。也不把 API 中列出的节点视为稳定或成品游戏采用证明。

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

[研究] 给已有跟随增加“保持动量的平移传送”和“清动量的检查点重生”，再在暂停菜单打开时触发后者：复用原有模式入口传递意图，不让每个技能维护独立历史。后续获准的引擎测试比较更新前后目标／相机相对偏移、预测趋势、首个恢复画面与活动混合；另让同一运动在恒定及交替帧间隔下运行，比较屏幕位置和追随滞后。只有设计要立即重取景才断言无旧历史，连续传送则断言历史随真实位移迁移。若小修改必须同时改多个技能、多个 transform 写入者或每个相机扩展，先收拢接口；不用“更多平滑”遮住责任冲突。算术复核不扩大为引擎／舒适度结论，许可沿用前文。

## 失败与重试补研：回到刚才的决策点

核实：2026-10-14 UTC。主线 1／3；改变 05 第 9 节仅强调遭遇可重置的建议，补充高频失败玩法的重试体验。新纳入的证据是经典开发者原文与固定游戏源码，不是 2026 年新技术，也不是本项目实测。[研究]

### 1. 不把恢复正确当成重试体验合格

[一手] Edmund McMillen 的 [Why So Hard?（2010-04-21）](https://www.gamedeveloper.com/game-platforms/-i-super-meat-boy-i-s-mcmillen-explains-why-so-hard-)将取消命数后的失败代价分成重开等待与关卡长度，采用短关卡、目标可见和快速复活；结算与转场也服务连续尝试。作者与 Tommy Refenes 的[成品复盘（2011-04-14）](https://www.gamedeveloper.com/audio/postmortem-team-meat-s-i-super-meat-boy-i-)再次说明这些取舍，并将多次失败回放视为完成挑战后的奖励。这是开发者对自身设计的解释，不是独立实验或通用难度公式。

[研究] ✅ 借“让下一次尝试仍围绕刚才的问题”的设计关系，不照搬回放功能。对于短挑战，分别观察死亡演出、转场／重建、恢复控制、重新走到失败点四段成本；它们可能重叠，不能机械相加，更不能拿一个动画计时常量代替完整耗时。单纯加快复活动画，不能消除重复走已掌握路段的负担；检查点位置要随挑战长度与学习目标调整，而不只按场景文件划分。

### 2. 固定游戏实现：重建世界也可以是简洁起点

固定 `EXOK/Celeste64@6edfe1ebd2a21a6134d7675a28e357891025407e`；以下为源码阅读，未运行游戏。[一手]

- [Player.cs L1881–1991](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L1881-L1991)：死亡演出达到条件后请求 Replace，并用保留入口信息创建 `new World(entry)`；重生另有状态，演出完成才进入 Normal。常量只描述这些局部状态，不能推出目标设备从死亡到可操作的总时间。
- [Game.cs L173–250](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Game.cs#L173-L250)：退出旧场景、创建并建立新场景；资产重载由另一个选项控制。音乐路径相同且仍在播放时不重新启动音乐。[研究] 可借“重试保留体验连续性”，不能由场景重建推断必然重新加载全部资产，也不能反推其没有重建开销。
- [Checkpoint.cs L26–60](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Checkpoint.cs#L26-L60)：命名检查点更新当前入口，激活时有声音、模型状态和短形变。[研究] 玩家知道重试起点已改变，也属于恢复体验，而不只是内部字段已更新。

[研究] 这个现成重试实现不以原地回滚／对象池为前提，值得作为较简单的起点；源码本身不证明其重建耗时，更不证明任意规模都足够快。✅ 小项目先复用现有死亡与重开入口，观察重建成本确实妨碍重复尝试时，才考虑缩小重置范围或保留必要资源；不要为此先做任意世界快照。

### 3. 边界、成本与下一次修改

[研究] 永久死亡、资源损失、整局承诺本身构成玩法时，最近检查点会改变风险收益；不能把这一短挑战建议升格成所有游戏取消惩罚。保留有意设计的代价，同时检查加载、确认菜单和无意义等待是否只是意外负担。真实的紧张感与玩家是否愿意再试仍由人判断。

[研究] 最小采用成本是既有状态入口、检查点激活反馈，以及出生点安全、敌人／机关重置和保留进度的内容维护；额外驻留也有内存成本，不承诺零成本即时重试。AI 可记录阶段边界、维护入口与回归，人决定重试距离和失败代价。第二次修改只延长一个已有遭遇或移动一个检查点：重新观察回到同一决策点的全过程，检查旧奖励、已收集物、机关和出生安全，不仅断言场景恢复成功。无需新增回放或通用重试框架。

[一手] [Celeste64 ReadMe](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/ReadMe.md#license)区分 Source 的 MIT（注明例外）、Content／Celeste IP 与 FMOD；本文只借机制，不复制美术音频或将短期 jam 项目当成生产底座。开发者文章不授权使用成品资产。[研究] 未测整段重试耗时或实现工时。

## Endless Sky：非平台游戏的动感镜头与默认值取舍

核实：2026-10-14 UTC。主线 1；补 05 §8 从“效果能关闭”到分别决定效果、默认值与首玩可发现性。比较的是俯视太空贸易／战斗中的居中跟随与加速度偏移，不重做输入研究，也不声称两种方案通过了全部玩法回归。[研究]

**两个可运行选择及代价。** [一手] [#9638](https://github.com/endless-sky/endless-sky/pull/9638)于 2024-05-19 合并（`ae5c7f1fb6e791a5742cab23a9332f72913893d9`）；[固定 Engine.cpp](https://github.com/endless-sky/endless-sky/blob/cbca555b1cdca081b57ee7473f3db07a31181d96/source/Engine.cpp)的 OFF 返回飞船中心／速度，ON 对相机速度与位置插值，REVERSED 反向偏移。同一飞行与战斗可以保留稳定参照，也可以用偏移强调加速感；偏移会改变前后方可见空间，增加重新定位目标的负担，具体收益属于玩法判断。[研究] [#8446 的讨论](https://github.com/endless-sky/endless-sky/pull/8446#issuecomment-1441120912)明确提出希望高速前进时看见更多前方空间；另一位[反馈者](https://github.com/endless-sky/endless-sky/pull/8446#issuecomment-1441124904)认可动感却担心目标辨识与长时间舒适度。这些是方案反馈，不是计时或晕动测试。[社区]

**改得更顺，不等于所有人都应开启。** [一手／社区] 较早的 [#7347](https://github.com/endless-sky/endless-sky/pull/7347)按推力状态更新偏移；Koranir 在[2023-12-30 比较](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872451536)中认为其起止突兀，并给出替代视频。原方案修订后，alexrovw [实际使用并表示会保留](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872582712)，随后[复测确认](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872604442)复杂转向／停车／倒车下轮廓对齐和反向模式故障已修，但仍指出武器后坐力边例。该 PR 未合并，作者关闭它让位于 #9638；不能把前者的测试移作后者全面通过。#9638 获原方案作者[正面体验评价](https://github.com/endless-sky/endless-sky/pull/9638#pullrequestreview-1807800878)，Koranir 又在[2024-05-18](https://github.com/endless-sky/endless-sky/pull/9638#issuecomment-2119032487)报告用 Marauder Leviathan 试玩后认为效果轻微且增加动感，支持默认开启；最终默认为 ON。没有同一批玩家的受控 A/B，不能宣布后一算法普遍更优。

**后续反馈改变的是默认值。** [一手] [#12252](https://github.com/endless-sky/endless-sky/pull/12252)于 2026-02-12 合并，仅改 Preferences.cpp：将加速度镜头缺省索引从 1 改 0，并去掉 Landing zoom／Show hyperspace flash 的默认开启；[之前](https://github.com/endless-sky/endless-sky/blob/f57851bc0cfe715c6e276a3e1402c131fe368a4c/source/Preferences.cpp#L65-L66)与[之后](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Preferences.cpp#L65-L66)可核。作者认为长设置列表使新人未必找到关闭入口，甚至可能直接退出，但明确写 Testing Done: None；这是维护者的可接近性判断，不是玩家流失数据。[社区] 合并后 Koranir [质疑是否收到实际投诉](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3889579433)；warp-core [说明自己也抱怨](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3897596643)，Amazinite [第一人称表示镜头效果更令人恶心而非有趣](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3898047376)。后者未分离加速度与着陆缩放的贡献，也未给安装版本，不能转写为独立玩家群体共识或精确算法因果。

**交付范围与采用判断。** [一手] 发布版 [v0.11.0](https://github.com/endless-sky/endless-sky/blob/v0.11.0/source/Preferences.cpp#L65-L66)（2026-01-31）仍 ON，[v0.11.1](https://github.com/endless-sky/endless-sky/releases/tag/v0.11.1)（2026-04-25，unstable）的 [changelog](https://github.com/endless-sky/endless-sky/blob/v0.11.1/changelog#L263)与源码已 OFF，[v0.11.2](https://github.com/endless-sky/endless-sky/releases/tag/v0.11.2)（2026-06-27，stable）[仍 OFF](https://github.com/endless-sky/endless-sky/blob/v0.11.2/source/Preferences.cpp#L66-L67)。[固定 Camera.cpp](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Camera.cpp#L46-L74)保留三种模式；[设置读取](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Preferences.cpp#L243-L244)仍采用已保存的值，因此升级不等于所有老玩家实际关闭。[研究] ✅ 对已有明确不适反馈、又不承担必要提示的运动效果，考虑稳定缺省＋可发现的可选效果；代价是喜欢动感者可能不主动发现它，同时增加设置说明与各模式回归成本。不要因此删除有正面反馈的效果，也不默认关闭所有视觉反馈。AI 可实现独立开关、保留旧选择与检查菜单路径；人决定目标体验，首玩测试核实际能否找到并理解开关。

[研究] **证据终点**：已有实现选择、修改后实际使用与后续默认值撤回；人群分母、持续使用时长、默认关闭后的舒适度／留存改善均未知。只读公开源码、原帖与发布信息，未运行游戏／引擎／模型，未测性能或工时。代码按文件声明 GPL-3.0-or-later；这里只借设计关系，不作为可直接复制进 Unity／Unreal 的插件。新增收益复测出现前，不再用更多相似镜头投诉填充此链。

## 命令预览补研：提示清楚还要规则一致

核实：2026-10-15（UTC+8）。主线 3／1；补 05 §6 从命令结算到提交前反馈的责任。✅ 先复用既有规则查询，明确精确结果与估计的边界；不默认自建完整预演系统。新证据跨工厂建造、运输经营和回合战术，支持各自机制，不代表同一方案在这些玩法中均已验证。[研究]

### 1. Factorio：动作模式改变，预览也必须改变

[一手] Wube 的 [FFF #213（2017-10-20）](https://www.factorio.com/blog/post/fff-213)列出普通建造、ghost 与 shift-blueprint 的不同规则：ghost 可忽略已标记拆除的实体，shift 放蓝图会安排拆树／石并跳过不能放置的部分。作者举例，0.15 按住 shift 后矿机 ghost 实际可放，预览却仍因树石标红，0.16 修正显示。这是开发者报告的历史修改，不是本轮复现，也未提供理解率改善数据。

[研究] 这里不是颜色够不够醒目，而是提示回答了错误的动作问题。预览输入除了位置，还要包含当前模式、修饰键与相关世界状态；整张蓝图的“可提交”也不等于所有元素都能落地。✅ 先改造现有查询入口，不在 UI 复制一套简化的碰撞／费用判断。不能仅据文章推断 Factorio 内部已统一所有查询与执行代码。

### 2. OpenTTD：同一处理器可试算，但不是任意结果保证

[一手] 固定 `OpenTTD/OpenTTD@daa6e1ca1c357eb9e6ae3d69af134205e1be8517`（提交日 2026-10-12），读取完整相关文件；固定主干不等于稳定发行版本。

- [command_func.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command_func.h)：`CommandHelper::Execute` 先以测试 flags 调用同一个 `CommandTraits<Tcmd>::proc`，通过检查后再带 Execute 标志调用；估算可在测试阶段后退出。`Do` 也区分测试和执行
- [command.cpp](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command.cpp)：试算前后切换城镇评价与持久存储的测试模式；分别显示估计费用和已执行费用动画。非 NoTest 命令断言测试／执行费用及失败状态一致，NoTest 则检查实际执行失败
- [command_type.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command_type.h)将 NoTest 明确定义为测试／执行输出可能不同；[landscape_cmd.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/landscape_cmd.h)的 ClearArea 实际使用该标志，注明多格房屋拆除使城镇评价在两阶段间不同

[研究] **这也是反例：共享代码只能减少规则分叉，不能消除连锁状态变化。** 断言存在不等于本轮跑过断言，更不能证明屏幕上较早的预览在世界变化后仍然有效。借用试算／提交的责任区分，提交时重核；项目需要保留随机或隐藏信息时，显示已知条件或范围，不假装确定。查询不应扣费、改变随机序列或发出结算事件；这些是本项目应验证的责任，不能由上面几份源码推出 OpenTTD 所有命令均无副作用。

### 3. 竞争选择：让复杂组合可尝试，不强迫 UI 解释一切

[一手] Tom Francis 的 [Tactical Breach Wizards 原始设计（2018-02-02）](https://www.pentadact.com/2018-02-02-pitch-tactical-breach-wizards/)设想提交前反复试演，但明确原型可能被改掉；[开发商成品页面](https://store.steampowered.com/app/1043810/Tactical_Breach_Wizards/)确认免费 rewind 鼓励玩家实际尝试技能组合。成品页只支持这项功能仍在，不证明早期的同时行动方案全部保留，也不揭示内部预测／回滚实现。

[研究] 因而复杂战术组合不必全靠数字和箭头事前解释；当可撤销尝试符合玩法时，它是可比较的选择。反之，风险承诺、未知信息或反应时间本身构成挑战时，全面预演／rewind 会改变玩法，不能把它当通用易用性补丁。默认仍是窄查询与真实结果反馈；只有项目确需试演，才评估完整状态恢复的内容与工程成本。

### 4. 采用成本、二改与引擎边界

[研究] 查询需隔离资源、事件、随机与持久化副作用；缓存需随相关世界状态和动作模式失效，连锁规则增加后还要重核估计范围。这些都不是零维护。若新增动作迫使 UI 维护第二套模拟，先缩小承诺为合法性／直接效果，而不是再补大量显示例外；只在已有设计需要时采用完整预演。

[研究] **二改题（仅预注册）**：给已有放置／目标操作增加替换或范围模式，比较原模式与新模式的提示和实际结果；预览后改变障碍、资源或目标，再提交，观察重新校验与失败反馈。另检查反复查看／取消不扣资源、不改变随机状态、不触发奖励；范围操作只完成部分时显示对应范围，不以整体成功掩盖差异。记录规则分叉、显示例外与维护工时，人判断玩家是否能据提示做决定，AI 可补规则夹具与显示回归。没有执行本计划。

[研究] **Unity／Unreal 共用这条信息契约**：复用项目已有命令／技能／建造查询，不要求 Unity 加 SO 框架或 UE 迁 GAS；没有提出引擎 API 或性能优劣结论。上述游戏不是 Unity／UE 同任务对照，也不证明单人无美术团队已能复现其整体质量。

[一手] OpenTTD 相关源码文件头及 [COPYING.md](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/COPYING.md)声明 GPL v2；这里只借机制，不推荐整段复制成闭源引擎底座。开发者文章与商店介绍不授予游戏资产／代码复用权。[研究] 本轮只读公开源码和原文，未运行游戏／引擎／模型，未测体验、性能或工时；不以资料核对冒充上述二改验收。


## 运行时叙事：开放表达、知识解锁与离线承诺

核实：2026-10-14 UTC。主线二／四；补充 03 §2 的采用与撤回选择，不改受限动作选择评级。新证据是已发行游戏的开发者撤回记录、2025-12 的叙事编辑器契约、2026-01 的本地兼容后续，以及独立的 authored 叙事路线。只读研究，未运行游戏、引擎或模型。[研究]

### 1. 先比较玩法需要，而非台词是否无限

[一手] [Suck Up! 开发者商店页](https://store.steampowered.com/app/2726370/Suck_Up?l=english)标注 2025-10-01 发行，玩法是玩家用声音、措辞和伪装骗取邀请进入住宅；页面披露第三方生成服务，并列联网要求。它提供的采用理由是开放说服本身成为挑战，而非 NPC 多说几句就让任何游戏更好。商店页证明公开的玩法／依赖声明，不证明留存、净收益、响应速度或节省写作；不采用页面宣传评价与未经复核的 token 价格。[研究]

[一手] 独立对照来自 [inkle 的 2021-02-22 发布说明](https://www.inklestudios.com/2021/02/22/ink-version-1)：ink 已用于 Heaven’s Vault（2019）和 Pendragon（2020），支持状态化内容与并行共享状态的 story flows。[研究] 因而“记住历史、按状态响应”本身不是采用 LLM 的充分理由；这些已发行游戏也不是与 Suck Up! 同题的优劣实验，更不证明手写内容免费。

[一手：固定文档与实现入口] 本轮读取 `inkle/ink@35c63e52f1d36060930dc7ed3cfba38ea224b528`（2026-05-05）的 [RunningYourInk L14–85](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/Documentation/RunningYourInk.md#L14-L85)：故事编译成 JSON，运行时 Continue／ChooseChoiceIndex 返回台词和接受选项，state.ToJson／LoadJson 保存加载状态；[L242–249](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/Documentation/RunningYourInk.md#L242-L249)提供变量观察者。[WritingWithInk L824–828](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/Documentation/WritingWithInk.md#L824-L828)说明用随机种子复现内容。[研究] 这些证明可选的本地数据驱动机制，不证明两款游戏使用这一 2026 快照，也不保证任意故事零延迟、无错误或跨版存档兼容。代码许可与存档边界沿用 WP10 已有 ink 研究，不新增框架推荐。

### 2. Vaudeville：保留生成玩法，也撤回一部分供应方式

[一手：开发者自述，历史事实] [2024-01-31 pre-mortem](https://steamcommunity.com/gid/103582791472864770/announcements/detail/3973931474188161576)报告上线流量触及服务容量上限，并曾因费用不可持续退回旧语音服务；不能把当年的供应价格或容量当作当前通用成本。[2024-10-03 offline beta](https://steamcommunity.com/gid/103582791472864770/announcements/detail/4657375543606995004)转向本地对话／语音模型，同时承认 GPU 负担、加载与崩溃限制。

[一手：后续发行公告] [2025-11-28 正式发行](https://steamcommunity.com/gid/103582791472864770/announcements/detail/520857340524626354)保留在线旧版支持弱设备及其他语言；[2026-01-22 v1.3.0](https://steamcommunity.com/gid/103582791472864770/announcements/detail/535499112589559217)继续修 Steam Deck、非 CUDA 与集显兼容，并保留在线分支。[研究] 新增证据是迁移后的支持负担仍持续，不能把本地生成视为顺手接入的离线 fallback；也不能把这一迁移写成游戏失败、生成路线失败或旧故障仍未修复。没有独立测量端到端延迟、成本、优化幅度或当前兼容覆盖率。

### 3. 生成自由度不免除作者的进度与知识设计

[一手：2025-12-21 官方指南] [Story Vault 编辑器](https://steamcommunity.com/gid/103582791472864770/announcements/detail/520859243419534792)让作者指定角色知识、可解锁地点及关键词；角色台词提到对应词可解锁地点；结案问题和正确选项由作者填写。指南还告诫作者不要向角色提供必须保密的信息。[研究] 这是公开设计契约，未读到游戏实现；不声称已复现泄题或绕过，也不笼统禁用关键词玩法。

[研究：采用建议] 将生成关键词当作候选事件，按当前进度、角色权限和前置条件再提交；更早一层按可知范围过滤角色输入，不能只靠提示角色保密。作者仍要设计知识分配、线索与答案，生成台词没有消除内容结构成本。这是从契约推导的保守建议，不是对 Vaudeville 内部实现的审计结论。

### 4. 撤回条件与证据缺口

[研究] 若固定内容与状态组合已满足玩法，撤回运行时生成；若开放表达是挑战本体，固定回复只能作为明确的降级模式，不能宣称体验等价。必须支持断网时，分别决定暂停／恢复、固定内容或独立本地配置，并按目标设备、语言、响应质量验收。等待时长须含识别、排队、生成和播放；本轮没有可横向复用的延迟数字，不设伪通用毫秒门槛。

[研究] 核查范围为公开原文、公告日期和固定 ink 文档；Steam 单篇页面通过公开 HTTP 核对标题与内容，网页解析器只成功读取[公告合集](https://steamcommunity.com/app/2240920/announcements/)。没有下载模型、安装、付费调用、游戏试玩、引擎运行或体验／留存实验。后续只有同题玩法对照与全程费用／支持成本证据，才足以把本节的条件试用提升为效果推荐；不以多个同作者公告冒充独立样本。

## 效果叠加补研：来源所有权不等于合并规则

核实：2026-10-15（UTC+8）。[研究] 改变 §7 的二改选择：第二个技能／光环加入时，先决定一个效果由谁维持、重复施加怎么合并，再决定是否升级框架。原有“取消时清理标签”不足以处理其他来源仍有效、或施放已经结束但毒仍应持续的情况；本节不重做命令事件、预览、镜头和输入研究。

### 1. OpenRA：来源退出只撤自己的授予

[一手] 固定官方仓库 `e180e3225f3930272dd451917467631618f8976f`（提交日期 2026-10-11 UTC）；这是读取时主干，不宣称已发布稳定包。读取了如下完整链路，而非只凭框架接口推断真实使用：

| 固定来源 | 实际机制与边界 |
|---|---|
| [Actor.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Game/Actor.cs) | GrantCondition 分配独立整数 token；UpdateConditionState 从该条件的 token 集合计算数量；RevokeCondition 只移除指定 token。无效 token 会抛异常，因此底层不是幂等释放 |
| [ProximityExternalCondition.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Mods.Common/Traits/Conditions/ProximityExternalCondition.cs) | ActorEntered 为目标保存 token；ActorExited 先移除本地记录，再以 self 和 token 请求撤销。所有权变更另有重新判断路径，不只等计时到期 |
| [ExternalCondition.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Mods.Common/Traits/Conditions/ExternalCondition.cs) | 永久 token 按 source 分组；TryRevokeCondition 核来源；限时 token 各有到期 tick。SourceCap／TotalCap 达到限制时可能替换最早到期的限时授予，不是简单拒绝所有新授予 |
| [TS nod-structures.yaml](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ts/rules/nod-structures.yaml)、[TS defaults.yaml](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ts/rules/defaults.yaml) | 真实隐形发生器以 ProximityExternalCondition 授予 cloakgenerator；消费者 Cloak 的条件为 cloakgenerator 或 crate-cloak，证明多个授权入口确实用于游戏规则，不只是未用样例 |
| [RA defaults.yaml](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ra/rules/defaults.yaml)、[DamageMultiplier.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Mods.Common/Traits/Multipliers/DamageMultiplier.cs) | Iron Curtain 条件连接覆盖色、计时条和 Modifier=0 的伤害修饰；修饰器禁用时返回 100。这说明效果状态与表现可共享条件，但不证明任意计时 UI 都准确 |

[研究] 可迁移的选择是：当重叠来源必须分别退出时，以活授予推导“仍受保护”，而不是每个技能都写无敌布尔值。引用计数足够表达纯数量；来源句柄还能识别谁有权撤回与重复释放，但不自动处理清理顺序、对象重生或序列化。只用一个稳定所有者、确定不会重叠时，布尔值仍更简单。OpenRA 是 RTS 引擎及经典游戏重实现，不是 Unity／UE 独立游戏质量排名，也不值得为这一个机制移植它的完整 trait／YAML 系统。

[一手] 项目自己的 [Conditions Wiki](https://github.com/OpenRA/OpenRA/wiki/Conditions)列出实际光环、铁幕与 EMP 使用；页面示例明确针对旧 release-20180307。本次采用上述固定现行路径核实，不把旧 Wiki 的 structures.yaml 路径当当前文件布局。

### 2. Shattered Pixel Dungeon：重复施加未必产生独立层

[一手] 不同作者、回合制 roguelike 的官方仓库固定 `57a4e06a4caf162446d1c28caa7983f0493fecf0`（2026-10-06 UTC；提交说明为 v4.0.2 发行更新），核到实际消费而非仅凭命名：

- [Buff.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Buff.java)：append 创建新实例，affect 优先取同类现有实例；prolong 经 affect 后调用 postpone。按类 detach 会遍历该类效果全部撤销，不能当成某一次施放的独立释放
- [Actor.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java)：spend 增加调度时间，postpone 仅在原时间早于 now＋duration 时向后延。因此 prolong 是保留更晚结束点，不能从名字译成无条件时长相加
- [PotionOfHaste.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/potions/PotionOfHaste.java)实际使用 prolong；[FlavourBuff.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/FlavourBuff.java)到调度时刻 detach。这是单一可延期效果，不是每瓶药各建一层计时
- [PoisonDart.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/weapon/missiles/darts/PoisonDart.java)调用 affect(Poison).set；[Poison.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Poison.java)的 set 取 left 与新 duration 的最大值，另一个 extend 方法才加长；每次伤害由 left/3 的整数部分加一计算。到期或目标死亡 detach，存档保存 left

[研究] 这是“所有 Buff 都改成按施放独立叠层”的反例：即使伤害公式不改，独立层或相加时长也会改变毒镖伤害与重复使用收益。它也反证“只改配置，不会改玩法语义”：将 max 改成 sum 属于平衡规则修改，应由人决定。不会反推所有毒都应合并成一份，也不据此宣称这种公式最公平；回合调度与实时帧时钟不能直接互换。

### 3. Unity 与 UE 的采用边界

[一手] [Unity 6.3 SO 手册](https://docs.unity3d.com/6000.3/Documentation/Manual/class-ScriptableObject.html)明确共享数据可由多个对象引用。[研究] Unity 默认沿既有角色组件持有活效果和来源，不把来源／剩余时长写回共享定义；两三个固定规则不需要通用效果编辑器。若本来已有合规的效果模块，先核它的合并键和移除范围，别另造名字相同、语义不同的一层。

[一手] UE 当前公开文档页面显示 5.8，GAS 对非 instant 效果的 [StackingType](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingType)将 None 定义为每次独立实例，而不是拒绝重复；AggregateBySource 与 AggregateByTarget 分别按来源、目标聚合。[持续时间策略](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingDurationP-?lang=en-US)区分刷新、不刷新、增加时长；[到期策略](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingExpiratio-)区分清整栈、减一层后刷新、仅刷新。已打开正确缩短路径的官方正文，不依赖最初失败的长 URL 或第三方教程。

[研究] 已使用 GAS 的项目先利用这些原生选项；来源聚合不等于每次施放独立计时，到期减一层也不等于每个历史施放各自到期。需要取消单次授予时，合并策略与撤销粒度必须一起选择，不能只保存一个“效果类型”然后全删。这里不声称官方枚举足以证明特定版本的预测、网络、驱散与句柄全部正确；未读取受限引擎源码或 Lyra 内容。

### 4. 窄二改题、许可与验证范围

[研究] 后续预注册：原有冲刺保护增加一个保护光环，再给毒镖增加可选叠加升级。基线与修改后使用相同遭遇，逐项记录有效来源、剩余时间、伤害及玩家可见图标；不预先增加框架。

| 待证规则 | 对照输入与期望，由设计先确认 |
|---|---|
| 独立保护来源 | A 生效→B 生效→A 结束，B 仍保护；再 B 结束才移除。重复 A 清理不影响 B；重复是否报错由边界契约决定 |
| 时长合并 | 原剩余 8，新施加 3：max 保持 8，刷新为 3，相加为 11；独立层则是 8 与 3 两个计时。这里是规则示意，非任何游戏的实测结果 |
| 效果与施放寿命 | 冲刺结束只释放冲刺保护；毒命中后施法者死亡是否保留按设计断言，不默认清光目标状态 |
| 驱散与恢复 | 指定来源、清一层、清整类分别测试；驱散后立即重施、旧回调迟到、目标重生不得删新效果 |
| 可读性 | 两光环重叠及毒升级前后，让玩家解释图标数量、剩余时间和重复使用收益；图标没消失不自动证明伤害规则正确 |

[一手] 两项目已读相关源码头和根 [OpenRA COPYING](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/COPYING)、[SPD LICENSE.txt](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/LICENSE.txt)：相关代码为 GPL-3.0-or-later。[研究] 本文只提炼机制并链接，不复制实现；欲直接复用须单独处理 GPL 分发义务及素材权利，不推荐作为闭源商用 Unity／UE 的即插即用模块。

**实际范围**：[研究] 读取官方网页、固定公开源码与许可；未构建／运行 OpenRA、SPD、Unity 或 UE，未测帧时序、真人体验、AI 二改成功率与性能，也未执行上表玩法用例。独立 review、仓库离线检查与差异检查仅核本知识库交付，不能变成游戏行为或净收益实证。
