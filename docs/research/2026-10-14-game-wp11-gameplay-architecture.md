主线：1（玩法反馈）／3（第二次修改仍可靠）／4（可发布与可维护）。
改变的建议：从“纯逻辑＋模块化即可”推进为“先固定状态所有者、时钟、退出和重置契约；只在具体复杂度出现时升级 HFSM、行为树、GAS 或 ECS”。
新证据：读取五个固定 SHA 的项目／包、三个历史修改链及 2026 年官方变更；Chop Chop 的实例化、UnityHFSM #71、Cinemachine #1122、Unity Behavior 1.0.16 给出可核查反例。

# WP11：单人独立游戏的 gameplay 架构取舍

核实时间：2026-10-13 UTC（2026-10-14 UTC+8）。本轮为来源调查与文档修订；未运行 Unity／Unreal、安装插件、下载模型或付费资源。下文“AI 失败”是依据契约推导的风险与待测场景，不是模型出错率统计。版本号来自本次实际读取页面／固定源码，不把默认分支当稳定发布版。

## 一、研究结论与适用边界

**[研究] ✅ 采用：Unity 的默认底座是现有组件＋少量纯 C# 规则＋显式局部状态机；Unreal 对照是已有 Gameplay Framework＋ActorComponent＋C++ 规则。** 不先自建通用框架、全局消息总线或全 ECS，也不因 Lyra 官方而整套移植。最初需要能开始、暂停、结算、重试并清干净上一局的游戏循环；对象多不等于需要 ECS，技能多不等于需要 GAS，敌人有三种行为不等于需要行为树。

**[研究] 架构升级用“当前会反复变化的复杂度”决定：** 多层互斥状态与可中断动作→HFSM；多个优先级目标、共享行为子树与动态打断→行为树／StateTree；大量可组合效果、属性、标签、成本、冷却及必要的预测同步→GAS；目标设备上可批处理的同构 CPU 热点→局部 Jobs/Burst 或 ECS。复杂度与维护成本同时估算，不能仅凭“以后能扩展”升级。

**[研究] 最关键的局限：** 源码与官方修复能确认生命周期和适用条件，不能证明某框架能让当前模型少犯错、更快交付或让游戏好玩；最终需要同一个玩法切片的第二次修改与目标设备构建来判定。

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

**[研究] 最低完成度**：一个玩家视口的最终相机拥有明确控制权；跟随、瞄准、过场、菜单切换有优先级；传送与重生重置阻尼，碰撞遮挡不丢关键信息，暂停和相机震动有明确策略。Unity 优先适配目标版本的 Cinemachine，UE 先 CameraComponent／SpringArm／PlayerCameraManager；镜头足够简单可只用固定相机。

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

**[研究] 此处按达到相同玩法质量的总成本分档，“最佳质量”指复杂需求的能力上限候选，不是经过同任务对照的冠军。不同模块可以落在同一套免费基础上。**

| 模块 | 质量上限／复杂项目候选 | 最佳性价比（当前单人默认） | 本地／免费基线与不采用边界 |
|---|---|---|---|
| 游戏循环 | 明确 session 生命周期，必要时层级状态 | 小局状态机＋引擎既有回调 | 同左；不自建循环框架 |
| 角色状态／敌人决策 | 确有优先级内容需求时 Unity Behavior／UE BT、StateTree；商业图工具仅评估 | 简单状态先 enum；层级中断再 UnityHFSM | HFSM MIT；有状态机不等于需要图编辑器 |
| 数据配置 | 有内容团队／外部表需求再 DataTable／校验导入 | SO／DataAsset 定义＋实例＋版本存档 | 自有数据结构与已有序列化；无需求不加后端 |
| 组件／ECS | 大规模批处理预算失败后局部 ECS | 组件＋窄纯规则，先局部 Jobs/Burst | 引擎现有组件；无实测不整项目迁移 |
| 事件 | 边界清晰的类型化事件／必要队列 | 本地直接调用，跨模块事实通知 | C# events／UE delegates；不用全局字符串总线 |
| 战斗技能 | UE 复杂效果／预测采用 GAS；Unity 沿已验证模块 | 最小 Definition＋Execution＋唯一结算点 | 自有小技能组件；不为了几招复刻 GAS |
| 相机 | Cinemachine 或 UE 原生相机配合必要特例 | 同左，固定镜头更简单时直接固定 | Cinemachine UCL／UE 引擎条款；不从零写通用相机 |
| 关卡 | 真实流式需求才引入大世界系统 | 小型可重置遭遇、模块化房间 | 现有 Scene／Level；没有地图规模需求不预建分区 |

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

上述内容均通过公开只读 GitHub API／官方网页取得，没有 clone／编译引擎或素材。未把 GH 搜索摘要、星数、宣传视频、仅 closed 的 issue 当验证通过；#71 除 closed 外实际读取维护者回应与修复 diff。

## 七、后续验证条件

**[研究] 优先实测的一个问题**：同一 Unity 小型战斗切片，用现有组件／小状态机完成第一版，然后做“蓄力可打断＋检查点重开”第二次修改；先不比较十个框架。若状态退出组合已经让小方案难维护，再对照 HFSM；只有规模证据指向 CPU 批处理，才用官方 StateChange 样例的方法比较 ECS。

验收必须包括：
- 正常／取消／死亡／卸载／池回收均清理；一个角色受击不污染另一实例
- 旧存档与稳定内容 ID 保持，数据变更的生效时机符合约定
- 技能、相机、关卡与 UI 事件在重开后不重复；冷却和资源结算可追踪
- 各种低帧率和暂停恢复的物理／动画／相机真实行为，目标平台帧时间与内存
- 人判操作手感、敌人可读性与趣味性；自动“没报错”不代表玩法质量

**剩余理论缺口**：Unity Behavior 固定包源码及版本升级回归、GAS 目标引擎版本源码快照、具体 Lyra 文件许可链、商业插件 SKU／Agent 使用与源码维护权利；需要新环境／付费／运行引擎者列入后续验证条件，当前不因此停掉其他研究。

**实际验证状态**：来源与指定修改链已读；文档链接为读取过的官方页面或固定 SHA；未运行真实 Unity／Unreal、AI 编码对照或 profiler；没有性能数与节省工时主张；本记录与[专题正文](../../domains/game-dev/05-gameplay-architecture.md)的文档检查另行记录，不能作为引擎验证通过。

### 文档交付检查

本轮已执行依赖预检（无缺失）、`python3 scripts/check_repo.py` 和 `python3 scripts/check_offline.py`：完整离线入口 14 阶段通过，五组测试分别运行 97／26／10／13／14 项，均非空、无 skip；`git diff --check` 无错误，两份新文档另查无尾随空白或无效 UTF-8 字符。检查覆盖当时共享工作树，不代表随后整合提交、上游框架测试或真实引擎通过。云端评审尚未进行，不标为“范围内通过”。

本次交付检查：完整离线14阶段、受影响页59处标题引用和 `git diff --check` 通过；内部独立抽查无阻塞，已补ECB计时范围反证。未运行引擎/模型，hosted CI另按发布提交核对。

## 阶段 F 商业资格与版本补核

核实日 2026-10-14；建议 2026-11-14 或选包、购买、融资条件变化时复核。Lyra 的当前渠道标签及未闭合文件许可继承 [WP10 动态表](2026-10-14-game-wp10-client-modules.md#阶段-f-动态状态补核)，不重复声明完整清权。[研究]

| 动态事实 | 本次核实与一手来源 | 对采用的影响 |
|---|---|---|
| Opsive 价格、席位与资格不一致 | [购买页](https://opsive.com/assets/behavior-designer-pro/)显示 Personal $145/seat 一次性、Professional $399/year，并写合计收入＋融资 ≥US$200k；[2026-10-02 EULA §2.3、3.1](https://opsive.com/solutions/decision-solution/behavior-designer-pro/eula/)却分别要求直接操作功能者 Professional，以及过去12个月收入 >US$200k 或融资 >US$200k 时持续订阅 | 套餐名称、合计／分别计算与等号边界不能自行调和；采购前取得具体 SKU／席位资格书面确认，不默认单人支付 $145 足够。仅列商业对照，不升级默认 |
| Opsive 源码持续维护权 | 同一 EULA §4.1 允许订阅到期／终止后只继续使用最后取得版本的对象码，须停止使用并删除源码 | 未来修改成本包含持续许可；不把对象码留用解释为永久源码维护权。未取得账户合同或 Agent 使用许可 |

[一手] 另重读 Unity Behavior [1.0 changelog](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/changelog/CHANGELOG.html)，当前指定文档仍为 1.0.16（2026-05-26）；[LICENSE](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/license/LICENSE.html)仍指 Unity Terms of Service。这证明指定文档内容，不证明全渠道最新版或具体账户安装权限；继续按实际包／计划核，不改为 UCL／MIT。

本次只读公开页面，没有登录、接受协议、购买、读取付费源码或运行引擎；未重算固定历史 SHA。[研究]

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

**本次状态**：[研究] 读过上述官方文档、许可及固定源码；未安装或运行引擎、模型、游戏、付费插件，没有玩家 A/B、帧时间测量或舒适度收益主张。本补研的文档检查与整合检查由实际执行结果另记。


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

**本次状态**：[研究] 已读上述开发者原文／访谈、官方补丁和原生文档。未安装或运行引擎、游戏、模型，未付费或做玩家实验；不是玩法质量实测。另检索到 Dead Cells Update 14 的稳定格挡时序修订摘要，但正文抓取超时，未把该摘要纳入采用证据。

**文档检查**：[一手] 本补研修改后 `python3 scripts/check_repo.py` 检查 177 文件、0 errors；限定两文件的 `git diff --check` 通过。检查不覆盖外链事实、片段锚点或真实引擎体验；整仓离线检查由整合方另跑。
