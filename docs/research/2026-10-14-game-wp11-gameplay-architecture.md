主线：一／二／三／四；玩法反馈、额外能力、第二次修改与可维护交付
改变的建议：[研究] 默认组件＋窄规则＋局部状态机，按实际复杂度升级；先明确状态所有者、时钟、退出与输入边界，再调整预览、效果、导航和随机消费。相机、关卡、成长、教学与辅助围绕玩家决策及具体阻碍取舍；物品先定可互换性，任务分历史事实与当前条件；连通、动作完成或规则复用不等于体验、迁移或预测通过，不能用统一参数与扩内容替代诊断
新证据：[一手／社区] 固定源码、官方契约、修复与评审链及开发者复盘支持正文各项机制与反例；物品含 OpenMW 拆堆修复与 Luanti 合并入口，任务含 Flare 存放规则修改与 Shattered Pixel Dungeon 局部消费链，版本和日期见各节。[研究] 含确定性算术反例；未运行引擎、游戏、模型或玩家对照，不把作者观察写成架构、手感或学习收益的验证

# WP11：单人独立游戏的 gameplay 架构取舍

证据核实：原记录为 2026-10-13—14 UTC；命令预览、效果叠加、导航、关卡组合及学习迁移补研为 2026-10-15（UTC+8），各节保留版本和日期。除明标的确定性算术复核外，仅调查公开资料／源码；未运行引擎、游戏、模型或玩家实验，未安装／购买插件。“AI 失败”为契约风险推导，非出错率统计；固定主干不等于稳定发布包。

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

**动作响应与承诺（2026-10-15 UTC+8）。** [研究] ✅ 沿现有技能定义／执行实例和局部状态机，分别决定移动／转向、当前阶段允许的出口与再次攻击资格；不把动画退出等同于退款、重开命中盒或解除冷却。输入已被识别后是否允许改变动作，是这里的增量，不重复输入缓冲或取消清理。

- **实际调整 [一手]**：[Hades 官方历史补丁](https://www.supergiantgames.com/blog/hades-updates/)在 2020-10-27 调整 Guan Yu 攻击缓冲，使连击之间可 Dash；2020-12-01 同时提高 Heavy Knuckle 攻速并解除攻击时的原地锁定。[研究] 说明可针对某招局部修改控制权，不证明其中一项单独带来收益，也不代表所有武器任意阶段均可取消或 Hades II 当前规则。
- **可借机制 [一手]**：Overgrowth 固定 `245fe4828631c84c0023d29d1525f5716ccb6106` 的 [playercontrol.as](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/playercontrol.as#L469-L478)提供移动／跳／蹲／抓／攻击等取消意图；[aschar.as](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L9600-L9610)还要求动画已设置、`cancel` 状态达门槛，再经延迟条件调用 `EndAttack`。其 [退出路径](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L6260-L6274)清动画回调并按当前状态回到运动。[研究] 借“请求＋阶段许可＋退出”，不搬整份角色脚本；未核完整动画曲线，不推出统一取消帧数或自动退款政策。代码 Apache-2.0，游戏动画／美术不随之授权；仅静态阅读。
- **撤回反例 [一手]**：[Overgrowth 1.2 公告，2018-03-15](https://www.wolfire.com/blog/2018/03/Overgrowth-1-2---Combat-improvements/)关闭 casual 之外的攻击吸附，并缩短较高难度肩投的允许距离，保留距离挑战。[研究] 自动修位也会改变动作承诺，不能把更多辅助当免费响应。这是第三人称近战与 Hades 俯视动作玩法的比较，不推广到格斗帧表或联网竞技。

[研究] **成本与二改验收（仅预注册）**：先沿现有原生动画层表达阶段，不为此增加 GAS／新执行框架。许可合适的现成动画缺过渡时，缩窄出口或换片段，不暗含手工补动画。给已有攻击增加重武器或攻速增益，在起手、命中、恢复阶段分别请求移动／防御／再攻击，核控制恢复、攻击次数、费用与已提交效果。若退出意外提高攻击频率、破坏可读预警或抹平武器差异，撤回对应出口；退款、冷却和效果政策复用本节结算责任。这些是维护风险推导，未运行游戏／引擎，未测得具体漏洞或手感收益。

### 7. 相机：先复用成熟运行时，验收的是可读性与控制权

**[研究] 最低完成度**：一个玩家视口的最终相机拥有明确控制权；跟随、瞄准、过场、菜单切换有优先级；传送与重生按意图保留或重置跟随历史，碰撞遮挡不丢关键信息，暂停和相机震动有明确策略。Unity 优先适配目标版本的 Cinemachine，UE 先 CameraComponent／SpringArm／PlayerCameraManager；镜头足够简单可只用固定相机。

**[一手] 固定源码与真实修改链**：Cinemachine [45728f30](https://github.com/Unity-Technologies/com.unity.cinemachine/tree/45728f3030787076f32930101d11d9ca96fe3a0f) 的 Brain 区分 SmartUpdate／FixedUpdate／LateUpdate；2026-02 fast-enter-play 支持后，[2026-08 #1122／69b2051](https://github.com/Unity-Technologies/com.unity.cinemachine/commit/69b205115495a374fbba329547ba608cdcfe7847) 又将 static reset 提前至 SubsystemRegistration，并重新创建 CameraUpdated／Activated 等事件。默认分支 changelog 此项归于 3.1.8-pre.2，不可宣称所有已发布 3.1.x 已修。

- **可省**：自研完整 Cinemachine、每种技能独立控制 Camera transform、对普通固定视角游戏搭通用镜头语言。
- **AI 风险 [研究]**：物理目标在 FixedUpdate 移动而镜头拿不一致时序；传送后追着旧位置平滑；切镜完成的回调却在取消后覆盖新镜头；循环进入 PlayMode 静态监听残留；禁用鼠标控制但最后一帧轴值继续生效。
- **将来验证**：低帧率、不同固定步长、暂停／恢复、传送、重生、过场中取消、窄走廊、快速多次切镜；有时序日志和屏幕轨迹仍要真人判晕动与瞄准手感。相机库修复不是游戏已验证。

### 8. 关卡：先做可重置的遭遇，再做大世界

**[研究] 最低完成度**：关卡定义（稳定 levelId、入口、目标、出生表）与运行状态分开；每个 Encounter 所有者管理产生的敌人、触发器状态和一次性奖励；完成标记由存档域持有，不依赖 Scene 中对象是否还活着。目标、出口、回退位置可查询，重进关卡不会误发奖励。

- **Unity**：场景承载内容，组合入口注入玩家／服务；Additive／Addressables 的释放细节归 WP10，玩法层必须提供退出／取消钩子。UE 先普通 Level；确实需要流式世界后再上相应分区机制。
- **可省**：小房间游戏用 World Partition 级系统、无玩法约束的随机铺图、自建通用关卡编辑器；已有模块化房间足够时优先组合，但仍需按路线与遭遇目标筛选，详见文末关卡组合补研。
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

## 导航补研：通路、局部让路与停止位置

核实：2026-10-15（UTC+8）。[研究] 改变 05 §3 及30秒表的采用条件：状态任务能结束、找到路径，不足以说明敌人移动自然；追击堵塞先分问题，默认利用引擎已有导航，不靠升级行为树、提高重寻路频率或默认加人群框架解决。以下仅源码／官方资料，未运行游戏或引擎。

### 1. 先过许可，再借真实游戏的局部机制

[一手] Overgrowth 固定 [245fe482](https://github.com/WolfireGames/overgrowth/tree/245fe4828631c84c0023d29d1525f5716ccb6106)，提交日期2025-03-20；读取根 LICENSE、README 和 enemycontrol.as 文件头，相关代码为 Apache-2.0，可按其条件复用代码，原游戏美术／关卡不因此开放，分发素材需另获许可。README 说明仓库由社区运作，不能把当前源码可取得当成维护承诺。[研究] 本文只提炼机制、不复制实现，不建议将其自研引擎当 Unity／UE 项目底座。Factorio 只读官方复盘，不取得代码或资产授权；引擎组件按项目实际 Unity／UE 条款使用，不称宽松开源，也不复制受限 UE 源码。

**群体防御的反例。** [一手] Factorio [FFF316，2019-10-11](https://www.factorio.com/blog/post/fff-316)解释：群组转入各自攻击后，单位有路径但互相挡住、反复绕转；团队选择取消同类硬碰撞，保留既有 separation，以减少明显堆叠，并承认可能需要平衡调整。[研究] 这表明碰撞政策会改变拥堵，不支持“所有敌人都应穿过同类”；依赖堵路、推挤或身体卡位的玩法必须保留相应规则，不能为顺滑偷偷删掉战术。

**近身动作的不同选择。** [一手] Overgrowth [enemycontrol.as](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/enemycontrol.as)的 GetRepulsorForce（3295–3330）只累加同队邻居排斥，并发送 excuse_me；消息分支（1021–1022）设置 move_delay。GetCheckedRepulsorForce（2651–2661）先用 NavRaycast 限制排斥；GetNavMeshMovement（3075–3121）按 target_dist 和 strafe_vel 投射接近／侧移目标，经停距减速后加入受限排斥并限制方向长度。[研究] 这支持把“走到哪”和“在目标周围如何停／让”分开，不证明这些参数适合其他游戏，也不证明物理碰撞已经完全消除。

### 2. 重寻路不能统一加速，也不能统一节流

[一手] Factorio [FFF121，2016-01-15](https://www.factorio.com/blog/post/fff-121)说明直行／局部启发式只用于短距离，会卡在角落；其缓存重用旧路径的中段，并缓存不可达结果，避免重复做昂贵搜索。[研究] 这是该游戏的规模与请求分布下的机制，不是单人项目起步就自建路径缓存的理由；通路改变后的失效责任也不能省略，本文不从复盘推定具体失效实现。

[一手] 相反，Overgrowth 同文件 GetNavMeshMovement（2974–2991）每次进入会调用 GetPath(target_point)，GetPath 包装（2526–2538）重新查询并重置路径点；接近／侧移分支还会重新查询目标。[研究] 不据静读指控它慢，也不以 Factorio 外推所有动作游戏必须低频重算。默认保留原生移动目标跟随能力；测得查询成为热点后，再比较目标变化阈值、时间预算或复用策略，并保留急转响应与障碍更新的正确性。当前没有推荐统一毫秒间隔。

[一手] Overgrowth [navmesh.cpp 的 FindPath](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/AI/navmesh.cpp#L874-L957)还区分 partial result 与终点多边形是否真正到达。[研究] 读到非空路径不能自行判“到达目标”；这与已有 Behavior 不可达终止契约相接，不另造任务框架。

### 3. 原生能力的具体采用边界

- **Unity，AI Navigation 2.0.16**：[AboutObstacles](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/AboutObstacles.html)说明未 carving 的障碍主要通过短距离局部避让处理，拥挤障碍可能绕不过去；会堵路但通常静止的箱子等适合 carving。默认 Carve Only Stationary 在移动时移除洞，稳定达到时间阈值后再更新；大而缓慢移动的障碍可选择移动超阈值时更新。NavMesh 查询须考虑修改后一帧才生效。[一手] [研究] “动态”不是一律每帧重建网格或全都 carving；移动人群与改变通路的门／箱子应分别处理
- **Unity 位移权**：[MixingComponents](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/MixingComponents.html)要求信息单向流动，Agent 与非运动学刚体、Root Motion 争写会冲突；Agent 与 Obstacle 同时启用会自我避让，carving 更可能使其不断映射到洞边。动画跟随速度的简单方案仍可能脚滑。[一手] [研究] 因此声明一个最终位移所有者，不能把行为节点成功当成动画与运动一致；不在此重复动画专题
- **UE，公开文档显示5.8**：[Using Avoidance](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-avoidance-with-the-navigation-system-in-unreal-engine)区分 CharacterMovement 的 RVO 与 Detour Crowd，要求二者独立择一使用。RVO 不使用 NavMesh 约束，可能走出边界；Detour Crowd 结合走廊可见性／拓扑优化，最大 Agent 数量由设置限定。[一手] [研究] 已满足需求的方案保留；需要走廊约束／更可配群体行为时再评估 Detour Crowd，核半径和数量，不叠开，不把 Unity carving 的时序映射成 UE 承诺。这里未证实任何 UE 特定项目的运行时障碍更新配置

### 4. 后续只预注册一个二改遭遇

[研究] 基线为追击并停在攻击距离；第二次增加一只同队敌人和可移动堵门箱。保留同一房间、动作与目标：目标突然反向→箱子堵住再移开→两敌窄门会车→追击切攻击／眩晕→退出后重启。记录通路状态、目的地更新、期望／实际位移、停止距离与旧移动请求是否残留；逐项定位是哪层失败，不能只看最终抵达。

[研究] 真人再看反复左右摆、贴墙、突然转身、脚滑、攻击前挤叠，以及让路是否破坏身体卡位；性能测查询成本和移动总成本，不能只报寻路次数减少。若原生达到这些要求就不加系统；若让路使单位越界、错过攻击距离或破坏卡位，就收窄／撤回该策略，而非继续叠平滑参数。AI 可补目标生命周期、参数和轨迹记录，人决定停距、碰撞政策及是否自然。本轮未执行这些用例，离线检查只证明知识库交付。


## 关卡组合补研：连通之后还要选择什么

**核实：2026-10-15（UTC+8）；主线一／三，GC。** [研究] 改变05 §9“模块化房间＋可达性”的采用边界：✅ 稳定动作空间优先现有房间组合；🧪 地形探索可用受约束程序布局；⛔ 不以生成数量或连通通过率代替体验目标。不是要求自建生成框架，也不是要求人工检查每个 seed。

### 1. 两类游戏，借不同的小机制

- **即时横版动作，Sébastien Bénard / Dead Cells。** [一手：作者历史复盘] [The Level Design of Dead Cells](https://deepnight.net/tutorial/the-level-design-of-dead-cells-a-hybrid-approach/)说明先固定世界连接、设计按用途与 biome 分类的房间，再用概念图约束长度、特殊房间和出口间隔；敌人还受空间及同平台组合限制。文章原发 Gamasutra，此处为作者站转载，不把转载日期当新算法。[研究] 借“用途／连接条件→组合→遭遇限制”的次序；不抄其房间资产，不移植整套 Director，作者说当时该系统已剩很少。房间是人设计的，不能声称单人无美术人员或 AI 已省去内容设计成本。
- **回合制战术探索，Josh Ge / Cogmind。** [一手：作者历史复盘] [2019 程序布局](https://www.gridsagegames.com/blog/2019/03/roguelike-level-design-addendum-procedural-layouts/)从出口的恢复／逃生价值推导入口出口位置，再约束回环、开阔空间和房间尺度；部分或全部程序布局都存在，自动剔除不满足参数的图。[研究] 这是“所有游戏都该拼预制房”的反例；只借与玩法相关的少数空间目标，不搬整个生成器。作者也提醒俯视全图的观感不代表探索体验。
- **内容分配是另一层。** [一手] [Cogmind 2015 Map Composition](https://www.gridsagegames.com/blog/2015/05/map-composition/)给洞穴和主区域不同的内容分配方式，并区分气氛、免费收益、风险收益与危险遭遇，显示分布供调整。[研究] 可把既有遭遇按用途分类后检查路线，不需要每个房间有战斗，也不把奖励平均撒满地图。

**反证必须保留。** [一手] [Dungeon Metrics](https://www.gridsagegames.com/blog/2014/07/dungeon-metrics/)2014 正文提出偏僻程度与奖励的关系，但作者在2015-11-06的评论明确说物品分配并未直接这样实现。[研究] 所以不写成“Cogmind 已实现越偏僻奖励越好”；最短路只是辅助指标，也不是未知地图中玩家真实的行走路线。回环、喘息和绕路奖励是否适合本玩法均须判断，不统一设阈值。

### 2. 固定开源调用链：规则确实被消费，但不推荐整套接入

[一手：源码静读] Shattered Pixel Dungeon **v3.2.4，提交 fdb10fc77914000af0907ac63f561ff21279115b**：

1. [RegularLevel.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/RegularLevel.java#L104-L119)的 `build` 先取 `initRooms`，清连接后调用 builder，返回 `null` 则重试，成功后交 painter；其默认 `builder()` 在 LoopBuilder 与 FigureEightBuilder 中选择，不能写成所有关卡都只有单环
2. [RegularBuilder.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/builders/RegularBuilder.java#L89-L130)的 `setupRooms` 按入口／出口、商店与 `maxConnections` 分组，消费 `pathLength`、扰动权重及房间尺寸来挑主路房间；这些不是只声明未使用的标签
3. [LoopBuilder.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/builders/LoopBuilder.java#L73-L173)把入口置首、出口插入主路序列中段，布置并接回入口，然后追加分支和可能的相邻连接；放置失败可返回 `null`。这证明拓扑意图在生成前／中被实施，**不证明**每条玩家路线等长、资源充足或生成耗时有上界

[研究] ✅ 借鉴这条分层顺序与少数规则；⛔ 不把整个 Java／LibGDX 游戏作为 Unity／UE 即插用生成插件。固定[源码许可](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/LICENSE.txt)为 GPLv3 文本，所读 Java 文件头允许 v3 或后续版本，不能当宽松许可代码直接拷入闭源工程；本轮未复制代码，未核整套美术／关卡资产的独立授权，不推荐提取这些资产。Dead Cells 与 Cogmind 只引用公开设计说明，未取得其代码或内容复用许可。

### 3. 单人采用与二改预注册

[研究] 先用自己已有或许可清楚的房间、遭遇及编辑器；程序员仍负责玩法内容设计，AI 可把规则落成数据与过滤。稳定动作空间优先房间用途／连接条件；地形探索优先少数路线和空间目标。先自动查出口／目标可达、关键资源条件及敌群不兼容，再按预期体验抽看代表性与极端组合：必经路线是否只有连续压力，绕路是否有可理解的机会，玩家是否有应对空间。不把所有空白都判坏，也不要求逐 seed 人审。

[研究] **后续仅预注册**：增加一种敌人或房间后，保留旧规则与一组已知正常／极端种子；记录遭遇违约、必须重走的路段、资源机会位置及新增例外，再由试玩判断选择是否有意义。比较同一内容目标下的房间组合与受约束布局，不以种子数量判胜；若扩组合迫使大量逐房修补，缩小组合范围或替换问题模块。这里未生成地图、运行游戏／引擎或测玩家收益；离线检查只能证明文档交付完整。


**结束条件与奖励增量（核实：2026-10-15，UTC+8）。** [研究] 上述布局规则回答“能否绕路、哪里有资源”，还不能回答“跳过清理会不会使下一关成长不足”。若目标是风险取舍，先调整已有目标与收益，再扩大房间资产量；若清场、刷宝或完成收集就是核心乐趣，不引入这个改动。

- **Rogue Legacy，动作平台。** [一手：Teddy／Kenny Lee 作者复盘] [GDC2014 讲稿](https://media.gdcvault.com/GDC2014/Presentations/Lee_Teddy_Rogue_Legacy_Design.pdf)PDF 第16–17页说明，逐层成长使跳过清理的玩家被后续敌人数值甩开；团队移除城堡内的角色成长，把 RPG 提升放在死亡后、再次进城前。第27–33页另述为避免平均加点而采用升级一项、其他项也涨价的经济补丁；作者承认它惩罚随意升级者，坏处明显而原因不清，仍因实现便宜而接受。[研究] 借“成长安排改变是否敢离开”的机制，不推成所有游戏都应局外成长，也不误写为没有局内金币／装备收益；低实现成本不等于低体验代价。
- **Into the Breach，回合策略。** [一手：Matthew Davis 作者复盘] [GDC2019 幻灯](https://media.gdcvault.com/gdc2019/presentations/Into%20the%20Breach%20Postmortem%20Final.pdf)PDF 第20–22页把防守、操纵敌人与限回合结束联系起来，为非致命武器留下价值；第39–43页记录战略层未遵循战斗约束、研究系统不佳，最后削减并从明确奖励重新构建。[研究] 借“结束条件支持想要的动作”，不照搬回合数或删研究树；这是已有可读性引用之外的设计证据，不能证明所有清场战斗无趣。

[研究] **采用与撤回：**复用05已有 Encounter 的目标状态、一次性结算与存档职责，不新增目标／经济框架，也不为此迁移引擎。只改开门条件而保留必须刷满的成长门槛，会留下同一个问题；取消交战收益又可能令有趣战斗不值得做。保护目标、出口与时限仍需可读表达，后续改动会牵连掉落、购买能力、挑战尺度与旧档，不能承诺省去美术或总工时。限时可能挤压观察，防守可能变成等待；出现这些结果时回到目标、敌人压力与奖励一起重选。

[研究] **二改仅预注册：**保留同一套敌人与动作，为一组“全清开门”遭遇比较“目标完成可走”的路径；核玩家为何停留／离开、下一遭遇资源是否支持该选择，以及重复完成、离开重返与读档是否重复发奖。AI 可记录路线、收益与完成后的停留，人判断是否仍有值得做的决定，不把时长缩短当质量提高。两份资料仅引用设计说明，不复制商业代码或资产；作者项目有美术参与，不证明单人零手绘可复现。未运行游戏／引擎或玩家实验，无留存、乐趣或生产工时实测。

## 受限动作补研：开放意图不等于更强战斗 AI

核实：2026-10-15（UTC+8）。主线二／三。[研究] 改变03 §2原先笼统的“同题收益决定”：先区分可用规则表达的战术／需求，与玩家开放意图到有限动作的语义缺口；动作名合法不代表对象、时机与世界结果正确。05既有状态／任务执行契约不变，不重做叙事案例，不增加框架。

### 1. 三个作者体系分别支持什么

- **Factorio：规则服务玩家策略。** [一手：作者历史复盘] StrangePan／Earendel 的 [FFF425（2024-08-23）](https://www.factorio.com/blog/post/fff-425)说明，跨墙敌人若能攻击整个工厂，会逼玩家到处布防；于是用 Gleba 的孢子排放让敌人集中某些设施。它支持“已知规则能产生所需战术就保持规则”，不是效用／行为树之间的性能比较，更不是与 LLM 的实测胜负。正文中的脚本、评分、行为树分工是[研究]建议，不冒称 Factorio 使用了这三套系统。
- **Mantella：实际模组中的语义到动作接口。** [一手：固定源码] Python端固定 `c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac`（2026-07-16）；Skyrim端固定 `0c5f8513aff61cda1f32c81a962eee36ba74fdb7`（2026-07-11）。[Follow定义](https://github.com/art-from-the-machine/Mantella/blob/c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac/data/actions/follow.json)将被说服同行的角色列入 source，范围为 conversation，并明确标实验性、可能破坏 NPC AI packages。[研究] 借用“自由说服→指定角色同行”作为窄候选，不把其自然语言回复算行动结果，不声称这是完整原创商业游戏或已证实留存收益。
- **GoodAI：有物理动作仍不等于有好玩的挑战。** [一手：作者历史说明] [2024-04-29 FAQ](https://www.goodai.com/ai-people-announcing-the-next-evolution-of-gaming-ai-npcs/)说明环境／人物／记忆进入模型，动作由游戏执行，失败回传纠正；也承认角色会声称给了物品但世界没有发生。[2024-09-19 Alpha说明](https://www.goodai.com/ai-people-alpha-officially-released/)将其定位为技术概念验证，挑战有限、最初没有场景终局目标。[2025-04-30公告](https://www.goodai.com/ai-people-entered-the-closed-phase/)宣布无限期关闭当前版本并重新思考参与感；本次读取[现行入口](https://www.goodai.com/ai-in-games/)仍写封闭开发。[研究] 这些是作者自述和产品状态，不是证明“LLM导致关闭”的因果研究；不能以宣传中的新颖行为代替玩家价值，也不将该游戏列作现在可直接试玩的候选。

### 2. 固定调用链：required 与兼容回退为什么还不够

[一手：源码静读] 两个仓库分别固定，不假设当前主干组合是经过发布配对验证的版本。读取以下消费链，不只看 JSON 名称：

1. Python [function_manager.py](https://github.com/art-from-the-machine/Mantella/blob/c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac/src/actions/function_manager.py)的工具定义构造会传出 `required`，但 `_validate_arguments_against_schema` 只筛掉未知参数名，没有在这里验证必填齐全或类型。`parse_function_calls` 遇畸形 JSON 将参数置为空字典；空字典仍可生成只含 identifier 的工具结果。有效参数存在时则另有角色范围过滤。不能将函数名里的 validate 理解为完整契约验证。
2. Skyrim [MantellaConversation.psc](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaConversation.psc#L660-L708)按是否有 arguments 字典选择 advanced 或 legacy 事件。advanced [Follow处理器](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaAdvancedAction_Follow.psc)按 source 名称解析会话 Actor，再设置 WaitingForPlayer、faction，重启 follower quest、EvaluatePackage；真正的移动交给原有游戏系统。
3. 同版 [legacy处理器](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaAction_OffendForgiveFollow.psc)在会话可取得时遍历参与者，使符合条件的非玩家 NPC 跟随；只有会话不可取得才退到 speaker。它与路由处“缺参数回到 speaker-only”的注释并不等价。[研究] 这是静读可见的作用域扩大路径，未运行重现，不能声称玩家必然遇到；但足以拒绝“有白名单／JSON required就可安全执行”的采用理由。

[一手] 作者 [#441](https://github.com/art-from-the-machine/Mantella/issues/441)还记录过多人会话把 `Npcname: Follow:` 当台词念出来；2025-12-11注明由 [Spell #128](https://github.com/art-from-the-machine/Mantella-Spell/pull/128)修复并关闭。[研究] 不把历史问题报成当前未修，也不据关闭推定所有模型／多角色动作都已可靠；上述参数缺失路径是另一次固定源码核查。

**采用判断。** [研究] 只借接口分层，不移植整套模组。执行侧必须重核允许动作、精确对象、当前前置条件及请求是否仍属于活任务；缺字段、无合法对象、超时／取消后回包应拒绝或保持原状态，不能静默改为所有角色执行。说服阈值、哪些角色可以拒绝与错误是否属于游戏乐趣仍由设计决定；“模型输出是有效JSON”既不是权限验证，也不是跟随已成功。

### 3. 后续窄对照与撤回，不在本轮运行

[研究] 只预注册一个“说服指定角色同行”的同题切片：菜单／现有规则基线对比 LLM 解释开放措辞，共用角色状态、地图、跟随执行器与取消行为。先确定开放理由是否真的让玩家形成不同策略；若只是不同措辞触发同一个按钮，基线足够。若没有开放语义需求，觅食／撤退／目标排序沿原规则或效用评分，任务生命周期沿05状态机／行为树，不默认增加 LLM。

- 正常：指定 A 同行，检查 A 实际进入跟随且 B 不变；拒绝、撤销与再次邀请分别保留明确结果
- 失败：缺 source、未知角色、角色离场、回复到达前取消／死亡、重复回包；不得扩大目标或让旧请求重启跟随
- 玩法：玩家是否能解释为何同意／拒绝、是否获得菜单无法表达的有效策略；不能只问“像不像真人”，也不以动作有效率／战斗胜率代替体验
- 成本：记录从请求到世界响应的等待、超时、每段游玩调用与费用，以及新增一种角色限制后的修改成本；阈值按本玩法节奏和发行预算预先决定，不发明统一毫秒或价格门槛

[研究] 无额外玩家选择则保留基线；错误对象、虚假交付或迟到动作破坏状态则撤掉动作接口直到修复；等待／费用超过预设预算则缩小频率与角色范围，仍不满足就撤回。若开放交涉是核心玩法，菜单回退会改变游戏本身，应承认玩法需要重做，不能称无损降级。

[一手] 已读两端固定根许可：[Mantella LICENSE](https://github.com/art-from-the-machine/Mantella/blob/c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac/LICENSE)为 AGPLv3 文本；[Mantella-Spell LICENSE](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/LICENSE)为 MIT。本文不复制代码，不推荐把 AGPL 服务端当闭源商用即插用模块；Skyrim内容、模型、TTS与服务许可另查。Factorio／GoodAI文章不授予游戏资产或源码使用权。

**实际验证范围：** [研究] 公开网页与固定源码只读；未运行模型、模组、游戏、Unity／UE或上表用例，未测体验净收益。通用决策不据 Skyrim 路径推定 Unity／UE 插件具备同样实现。本单元独立审查范围内通过；`python3 scripts/check_offline.py` 14阶段通过（非空、无skip），`git diff --check`通过；这些只验证知识库交付，不算动作效果实证。

## 学习迁移补研：按提示完成之后会不会主动使用

核实：2026-10-15 UTC。主线一／三／四；补 05 §9 的具体选择：教学步骤能运行之后，是否应增加强制步骤、改为按需帮助或提供可选练习。现有控制／菜单可用性、规则预览和重试验收不能代替学习迁移。本节比较开发者已经采用的设计路线，不推荐新教程框架，也不要求所有机制都做教学。[研究]

### 1. 两条竞争路线：帮助时机与自主选择

- **组合操作与长期经营：按需帮助。** [一手：历史作者解释] Wube 的 [FFF361（2020-10-09）](https://www.factorio.com/blog/post/fff-361)展示逐页提示改成索引、搜索、按条件推荐，并统一微教程入口；基础物件说明仍优先在 tooltip 解释，tips 留给难解释的组合与真实误解。作者还指出静态截图会随更新过期，改用真实模拟演示。[研究] 借帮助的分工与回查机制，不要求独立开发者先造嵌入式模拟器；已有场景中的短演示能讲清就够。代价是持续维护触发、内容与示例，且通知可能被忽略。
- **自主探索：可选练习与能力提示。** [一手：开发中作者复盘] Mobius 的 [Filling Out The Toolbox（2016-05-27）](https://www.mobiusdigitalgames.com/news/filling-out-the-toolbox)描述 Outer Wilds 从强制工具操作链改为沿途可选练习：旧流程让玩家照做，进入开放世界却不知道下一步；作者于是强调可做什么，而非继续指定该做什么。同文明确承认可选教学会被跳过，多用途探测器尤其难教，补场景用途示意也只是设计意图。[研究] 适合寻找目标本身有价值的玩法，代价是漏学与练习空间的内容成本；这是作者观察，没有受控玩家结果，不能宣布自由教学普遍更好。

### 2. 固定实现：触发与已读不代表掌握

[一手：源码阅读] `wube/factorio-data@374934f81f82b09ec9fc459f92a316bd642ddd82`，提交日期 2026-10-06。已读以下消费链，不只引用字段名：

- [base/data.lua L50](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/data.lua#L50)加载 `prototypes.tips-and-tricks`
- [bulk-crafting L208–229](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/prototypes/tips-and-tricks.lua#L208-L229)以连续单件下单5次触发提示，连续批量下单3次满足 `skip_trigger`，绑定相应 simulation
- [ghost-rail-planner L1685–1732](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/prototypes/tips-and-tricks.lua#L1685-L1732)组合玩法条件与已有操作，并依赖 `ghost-building`、`rail-building`
- [官方 TipsAndTricksItem 契约](https://lua-api.factorio.com/latest/prototypes/TipsAndTricksItem.html)本次页面显示 2.1.21：`skip_trigger` 取消通知但保留列表入口；`dependencies` 依赖前项标记已读。版本化 URL 本轮未取得正文，不把 latest 链接声称为永久固定版本

[研究] 这些实现支持“在需要时提醒、已做过则减少打扰”，不证明玩家理解了目的，更不证明迁移到新场景。不能照搬5次／3次阈值；读过、做过、学会三个状态不应被 Agent 合并。固定公开数据也不包含本轮可审计的完整引擎教学运行时。

[一手／研究：许可] [固定 README](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/README.md)说明公开原型定义用于帮助 mod 作者、查看版本变化和链接讨论；本轮未核到可跨游戏复制的通用开源许可。公开可读不等于任意复制代码／资产或输入 AI 的授权；本节只引用机制与短字段，不把它列为 Unity／UE 可直接移植底座。Mobius 文章同样不授予游戏资产使用权。

### 3. 反例：少指导与完成率都不能单独作为目标

[一手] [FFF213（2017-10-20）](https://www.factorio.com/blog/post/fff-213)记录无顺序微教程的问题：未懂 ghost 就学幽灵铁轨，未懂火车就学信号，因此增加依赖建议。[研究] 保留关键知识的明确教学机会，不把可选练习误写为所有前置条件都能省。

[一手] [FFF342（2020-04-10）](https://www.factorio.com/blog/post/fff-342)同时报告旧 NPE 获得正面新玩家反馈、却仍决定撤回：任务式演示吸引的受众，在正式游戏得不到同类后续内容。[研究] 教程易懂或受欢迎，也可能训练了错误的玩法期待；首玩完成不能代替正式关卡迁移。

[一手] [Outer Wilds 路线复盘（2016-08-18）](https://www.mobiusdigitalgames.com/news/the-intentionality-of-wandering)说明自由选择仍需线索，作者希望玩家有意识地选路，同时讨论怎样保留惊喜。[研究] 操作能力、值得调查的方向、谜题答案分开决定提示范围；自动提示若提前交出本应发现的用途，可能损害核心体验。该边界是设计推导，不是本轮测得的剧透影响。

[一手：历史受控研究] Andersen 等 [The Impact of Tutorials on Games of Varying Complexity（CHI 2012，pp.59–68）](https://grail.cs.washington.edu/projects/game-abtesting/chi2012/chi2012.pdf)在 Refraction、Hello Worlds、Foldit 内随机分配新玩家的教程条件，比较情境提示、提前手册、锁定操作及按需帮助；跨游戏的复杂度没有随机操纵，操作范式与下载门槛不同，玩家经验及自选择人群也可能不同。帮助按钮的跨条件汇总未提供一致的收益证据，且 Hello Worlds 返回率的方向在 Table 3 与正文间不一致，不能据此为已有教学再叠加帮助入口；主要指标是时长、完成关卡与返回行为，不证明无指令情境中的主动使用或知识迁移。[研究] 因此把目标玩家经验与真实误解作为选型条件，不从复杂度或“可选”标签单独推导教学收益。这是 Flash 解谜／平台游戏与蛋白质折叠游戏时代的机制证据，不代表当前 AI 收益。

### 4. 窄二改预注册与撤回条件

[研究] 只选一个已能正确执行、但玩家不会主动使用的工具或组合操作，准备“按需短提示／回查”与“可选小练习”两个局部方案。未来获准试玩时分开记录：是否能按指令完成动作、能否解释或选择适用情境、在无逐步指令的变形情境中能否主动使用；不能压成一个教程通过率。

[研究] 二改增加工具一种用途或改变一种操作，检查旧说明、实际绑定、触发、前置知识与示例是否仍对应规则。频繁漏掉硬前置时保留短而明确的必要教学；强制流程让玩家等待任务而正式玩法要求探索时，减少步骤并提供可回查能力说明；若观察不到真实误解，保留物件旁说明，不扩教学系统。AI 可比较方案、实现局部触发与采集，人决定目标体验和哪些发现不能提前告知。

**实际验证范围：** [研究] 仓库与公开原文／固定源码只读调查；未运行游戏、引擎、模型或玩家实验，未测学习收益、留存、AI 成功率或维护工时。两种设计跨游戏比较不能替代同一玩法对照；结论不依赖 Unity／UE 特性，不拆引擎版本，不引入联网前提。


## 辅助取舍补研：局部调整、整局预设与切回规则

核实：2026-10-15（UTC+8）。主线一／三／四；改变 05 §9 的选择：按实际阻碍与游玩目标选局部辅助或协调后的整局预设，明确当局／下一局生效与关闭恢复。新证据为 Dead Cells 29 历史补丁及 Cogmind 作者的设计与发布后回顾；不重复 WP10 的信号映射、输入缓冲或前节的重试／教学迁移，不新增辅助框架。[研究]

### 竞争选择与一手反例

- **即时动作的局部选择。** [一手：官方历史补丁] [Dead Cells 29 系列](https://deadcells.com/patchnotes/29)将按住跳跃／翻滚、盾牌切换及输入自定义与 Assist 选项分列；后者包含敌人伤害／血量、陷阱伤害、格挡窗口与陷阱速度等调整。29.2 修复关闭 Assist 后子选项仍生效；29.3 修复 Multiple Lives 下特定死亡软锁。它们说明菜单开关与实际规则、失败路径必须一起维护，不代表当前版本仍坏。该页另有读档后敌人／Boss 血量复满的修复，但未说明由 Assist 引起，不作因果归属，也不据此声称每种选项都可安全即时切换。[研究]
- **回合策略的整局选择。** [一手：作者设计说明] Kyzrati 的 [Adjustable Difficulty（2017-02-16）](https://www.gridsagegames.com/blog/2017/02/adjustable-difficulty/)为计分一致性限定难度下一局生效，榜单分模式；调整包括警戒压力、遭遇和出口信息，而非只有伤害倍率。作者区分仍希望练习标准玩法与主要希望探索内容的玩家，也提出低压力可能不迫使玩家学到标准模式所需应对。这是设计取舍与风险判断，不是学习实验或当前版本全部参数的核验。[研究]
- **可发现性有发布后反证。** [一手：作者观察] [Rebranding Difficulty Modes（2019-09-17）](https://www.gridsagegames.com/blog/2019/09/rebranding-difficulty-modes/)说明此前手册、选项菜单及死亡提示仍常被漏看，于是增加首次启动的显式选择，并改用 Explorer／Adventurer／Rogue 名称。[2022-05-08 回顾](https://www.gridsagegames.com/blog/2022/05/kyzratis-game-design-philosophy/)报告菜单加入后较易模式使用增加、仍为少数。这不证明单一命名改动的效果或留存收益。[研究]
- **信息可达不等于新增情报。** [一手：同上 2022 回顾] 作者说明标出已警觉敌人位置的功能最初面向所有人，后来因对标准玩法优势过大，从 Rogue 模式撤出。[研究] 将既有危险信号换成能读到的表达，与揭露原本未知的敌人位置必须分别决定；这不意味着标准模式可省掉必要提示，也不意味着所有轮廓都是越权情报。

### 最小采用与撤回边界

[研究] ✅ 沿已有设置／规则配置实现。玩家只被重复按键或一种时机要求挡住时，先提供针对性操作或窗口选项；若多种资源、遭遇和探索规则需要协调，采用少量有明确目标的预设。全局降速也是可选的有意设计，是否保留取决于它对核心节奏、其他时钟和操作的实际影响，不能因局部选项存在就判其劣质。无需把所有参数都暴露给玩家。

[研究] 当局可调能减少被卡住后重开的成本；下一局生效能保住整局规则与计分归属。没有跨游戏唯一答案。选择前说明何时生效、关闭恢复什么、哪些设置随存档或新局保留、进度与计分如何处理；“可关闭”不是抹除已经获得的进度，也不意味着恢复未知情报。上述是实现与产品政策建议，不主张统一锁成就、清档或惩罚辅助玩家。

[研究] 不把探索模式强制设计成标准模式的训练阶段。若明确承诺练习某种应对，应让关键动作／决策仍有使用机会，再由目标玩家试玩判断；若目的是看内容，可以有意改变更多规则。较易模式的成功不能代验标准模式的掌握，亦不支持所有区域难度等比例下降。

### 第二次修改：只预注册，不运行

[研究] 在已有玩法增加一种敌人或一个辅助参数，检查支持的设置组合即可，不穷举全部滑杆：启用后实际生效；关闭或进入下一局时按承诺恢复；死亡、重试、读档后仍使用正确的规则与遭遇状态。对新增情报检查切回后的显示政策，对计分核模式归属，对已获进度核是否按既定政策保留。AI 可追配置消费、恢复路径与回归样例，人决定辅助目标并判断核心玩法是否仍可进入；现有系统足够就停止扩建。

**实际验证范围：** [研究] 已读两位／组作者、即时动作与回合策略的一手网页正文及本仓相关章节；未运行游戏、引擎、模型或玩家实验，未验证成就解锁政策、当前存档兼容性或学习／留存收益。历史补丁证明维护风险曾发生，作者回顾证明其设计和观察，不作为本项目效果保证。

## 屏外威胁补研：补信息还是改攻击

核实：2026-10-15 UTC。主线一／三；在既有“无解先改空间”的建议上，进一步区分视口外但规则允许获知的信息、角色未发现与已经承诺的攻击。新证据为三个作者的不同方案及 Shattered Pixel Dungeon 固定结算路径；不重复 04 的信号强度或 05 的相机实现。[研究]

### 三种选择及代价

- **当前可获知信息超出视口，补查看路径。** [一手：作者开发记录，2024-02-11] [Cogmind 放大视图 QoL](https://www.gridsagegames.com/blog/2024/02/adventures-in-map-zooming-part-5-qol/)展示放大后边缘标记、标记避开已显示机器人、按键聚焦敌群并返回。普通可见对象与传感器信息采用不同表现；标记范围以未放大窗口为基准，目的在于补回放大损失的信息。[研究] 适用于能在行动前查看局面的玩法，不证明实时战斗中频繁转移视图也安全；不把“在画面外”当作原本未知而自动揭示，也不建议复制全部 UI。
- **动作空间本身让玩家在看不到处受击，先改布局。** [一手：作者复盘，页面标注2020-01-21] [Specter of Torment 房间设计](https://www.yachtclubgames.com/blog/specter-of-torment-level-design-deep-dive-2-5/)用进房间过渡期间触手伸入画面、醒目颜色与运动介绍 Grapps；附近天花板阻止玩家从画面上方绕过而遭受屏外命中。作者还反对把伸出动作随意放慢：那会错误暗示能抢跑通过。[研究] 缺的是正确空间理解时，限制不合适的路线可比再加警报有效；但这种结构约束会缩小自由度，不能推广为所有游戏都应封路。
- **受限视野仍是核心玩法，改攻击的可应对性。** [一手：开发中团队访谈，2023-06-30] [Luna Abyss 设计者／程序员](https://www.unrealengine.com/developer-interviews/how-unreal-engine-empowered-a-small-team-to-build-luna-abyss-beautiful-bullet-hell-prison)说明第一人称弹幕须在玩家面向攻击者时从前方来；玩家可能背对攻击者，因此以慢弹或长预告留出转向观察时间，加上声音提示，并因身体边界不可见扩大弹幕间隙。[研究] 它与 Grapps 不能合并成“都放慢”：一个保住扫视与躲避时间，另一个需要快速明确地封住道路。文中“避免不可见伤害”为团队自述，未独立复测；不照搬具体速度或间距。

### 固定实现反例：不显示演出，不等于不结算

[一手：源码静读] `00-Evan/shattered-pixel-dungeon@57a4e06a4caf162446d1c28caa7983f0493fecf0`：

- [Eye.java L91–148](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Eye.java#L91-L148)：`canAttack` 用 Eye 自身的 `fieldOfView` 与弹道判断；蓄力后条件不再满足时仍可返回 `beamCharged`。`doAttack` 首先蓄力并消耗时间；释放时用玩家 `heroFOV` 判定是否播放 zap，只有本体位置与射线碰撞位置均不在 `heroFOV` 时，才走直接调用 `deathGaze()` 的分支。
- [EyeSprite.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/sprites/EyeSprite.java)：有 zap 动画时在完成回调调用同一 `deathGaze()`；蓄力声音另受 sprite 的 `visible` 条件限制。

[研究] 该链只证明“行动资格、玩家视野和表现分支不是同一条件”，不证明此敌人在所有情境中公平，也不把 `heroFOV` 冒称屏幕矩形。不能把所有蓄力说成锁定最初目标：目标仍满足条件时 `canAttack` 会更新弹道与目标位置。代码头声明 GPL-3.0-or-later；这里借鉴责任划分，不推荐复制进闭源游戏。三个开发者网页均不授予游戏资产或代码复用权。

### 最小采用与下一次内容修改

[研究] ✅ 沿用技能状态与现有提示层，先指定：玩家此时应知道什么、从注意到执行反制有何机会、进入／离开画面是否有意改变起手或已承诺攻击；表现裁剪不能意外改变结算，有意的可见性规则则明确维护。无需新增“战斗导演”。若提示可见仍无可行躲避，改方向、节奏或布局；若仅因放大漏看当前规则仍允许获知的对象，补查看路径，不能永久跟踪曾经发现而今已失去的信息；若允许威胁隐藏或突袭，按其玩法承诺设计，不以全知为统一目标。

[研究] 后续只预注册同一混合遭遇，增加一种远程攻击，比较正常与缩小可视范围（项目支持的缩放／屏幕比例），包括起手后转开视角、重新看向敌人、失去角色视野、静音／减特效。分别检查能否察觉并作出实际反制，以及已承诺攻击是否按规则继续、取消或重新瞄准。若标记遮住近处目标、自动查看抢走瞄准、或限制出手变成转头冻结敌人的非预期玩法，撤回对应方案。AI 可追状态与表现路径、形成同遭遇替代配置；人决定允许的未知和风险，不用提示数代替质量。

**实际验证范围：** 证据来自仓库既有内容与公开网页／固定源码阅读；读到作者的图示说明和实现，不声称本轮实际播放视频、操作游戏或进行玩家识别测验。未运行引擎、模型或实验；没有体验收益、最佳时长或 AI 净效率结论。本判断不依赖 Unity／UE 特性，只维护一份通用建议。

## 建造镜头补研：旋转缩放支点与输入入口

核实：2026-10-16（UTC+8）。主线一／三；改变 05 §8 对无角色跟随目标的建造视图的选择：先定义旋转／缩放支点与输入入口，不把偏离目标都归为平滑问题。新证据是不同作者的三维自由建造设计调整与二维等距经营游戏缺陷修复；不扩相机框架，不重复 04 的模拟／呈现分层。[研究]

### 1. Tiny Glade：按设备改变支点政策，不是修正坐标计算

[一手] [Patch 1.11.2 公告](https://steamcommunity.com/games/2198150/announcements/detail/543346166601876516)（2025-01-15）保留 PC 的 Cursor point：绕光标下方点旋转，向该点缩放；Steam Deck 默认改为 Center region，仍可切回。作者在旋转说明中解释，单一 Center point 虽精确、易理解，屏幕中心刚好在高塔旁时却可能选中背景；Center region 从中心附近方形区域寻找候选支点。公告把体验改善写成预期，没有提供玩家对照或区域选点算法。

[研究] 🧪 无有效直接指向、或单点经常选错背景时，比较明确中心与有限区域选择；保留光标模式则能直接指定关注点。区域方案增加意图推断，不能保证永远猜对，也不能由此推导所有掌机或建造游戏都应改默认。若新政策让玩家更难预测围绕哪里转，撤回到明确支点；不要用更大阻尼掩盖选错目标。

[一手：取得范围] 普通网页解析只返回标题，本轮通过 [Steam 官方 GetNewsForApp API](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2198150&count=100&maxlength=0&enddate=1737072000&feeds=steam_community_announcements)取得完整正文：appid `2198150`、gid `1788945554756976`、author `anopara`、timestamp `1736947659`，feed 为官方 community announcements。未以转载补足一手正文，也未运行游戏或播放公告动图。2024 年鼠标读取异常的修复不是本次支点设计调整，不合并因果。

### 2. OpenRCT2：同一支点契约下删除多余拾取，按钮另修

[一手] [#12831](https://github.com/OpenRCT2/OpenRCT2/issues/12831)报告 v0.3 在竖直地形面 zoom-to-cursor 时偏移，可用 Extreme Heights 地图边缘或抬高的 4×4 地形复现。[#25042](https://github.com/OpenRCT2/OpenRCT2/pull/25042)于 2025-08-27 合入，固定提交 [85a0f70ae166cb5d240844c4dffad7c1c9fbbd76](https://github.com/OpenRCT2/OpenRCT2/commit/85a0f70ae166cb5d240844c4dffad7c1c9fbbd76)。`src/openrct2/interface/Window.cpp` 旧路径把鼠标位置转地图坐标、查询高度，再围绕 tile 校正；新路径删除两个辅助函数，仅在 `ZoomToCursor && atCursor` 时按鼠标相对当前 viewport 的位置和前后缩放级别附加补偿 `savedViewPos`，随后同步 `viewPos`。作者明确目标仍是保持光标下的点，并未把默认改成中心。

[一手／研究] 这是二维等距缩放的实现简化，不是更精确的 3D 射线选点。只需保持屏幕指向时，优先用现有投影／视口变换表达；不要推导透视相机绕建筑旋转也不需要世界支点。PR 中的作者测试及他人主／额外视口反馈支持该修复链，不是本仓库复测或普遍舒适度结论。

[一手] 同日 [#25046](https://github.com/OpenRCT2/OpenRCT2/pull/25046)的固定提交 [e4f36840bff585b4a3f5581cd2b4714f887b2c02](https://github.com/OpenRCT2/OpenRCT2/commit/e4f36840bff585b4a3f5581cd2b4714f887b2c02)另修额外视口按钮：`src/openrct2-ui/windows/Viewport.cpp` 从直接增减 `viewport->zoom` 改为 `WindowZoomIn/Out(*this, false)`，接回完整中心缩放路径。[测试反馈](https://github.com/OpenRCT2/OpenRCT2/pull/25046#issuecomment-3228516256)称按钮改善而滚轮仍异常，作者指向 #25042；不能把任一入口成功当整个缩放功能通过。两个修复均进入 2025-09-06 发布的 [v0.4.26 官方发行说明](https://openrct2.io/blog/2025/09/openrct2-v0.4.26-released)，不是只引用开发分支。

### 3. 最小采用与二改验收

[研究] ✅ 在已有相机／视口入口声明支点政策：直接指向、视口中心或有限区域候选；统一坐标归属与完整变换路径，不统一所有入口的支点。Tiny Glade 的可切回是设置选择，不是射线未命中时自动回退的证据；本节不据此新增自动回退机制。

[研究] 二改增加高塔／陡崖，再新增独立视口按钮或另一种输入入口。分别核对象中心、对象边缘、背景与视口边界，检查滚轮和按钮、主视口和额外视口的结果。关闭平滑后仍跳错位置，先修选点／坐标／命令路径；结果正确但过渡突兀，再比较平滑及其延迟。AI 可追坐标转换、补入口和记录轨迹；人决定操作意图是否容易预测。没有具体误选或入口缺陷就保留现有方案，不为新增配置而造通用镜头系统。

**边界与实际验证：** [一手／研究] OpenRCT2 代码标 GPLv3，本轮只提炼机制、不复制代码；实际复用须遵守对应许可证。Tiny Glade 公告不授予代码／资产复用权。只读公开官方 API、网页、固定提交与讨论，未运行游戏／引擎／模型、未安装软件；无舒适度、操作速度或 AI 效率测量。这是通用控制政策，不新增 Unity／Unreal 等价配置。

## 随机所有权补研：装饰二改是否改变玩法序列

核实：2026-10-16（UTC+8）。主线三，GC。[研究] 改变05 §6的选择：需要复现玩法序列时，新增纯表现随机先分清状态所有者，沿现有实例／流隔离消费。已有“预览不得改变随机状态”只规定查询副作用；本节回答合法的颜色／音效变体应该消耗哪条流，不重复 seed 与生成器版本存档建议。

### 1. OpenRA：视口相关闪光的评审修正

[一手：维护者评审／合并源码] [PR #18711](https://github.com/OpenRA/OpenRA/pull/18711)新增宝石闪光。维护者在[具体评审](https://github.com/OpenRA/OpenRA/pull/18711#discussion_r711581362)指出：按客户端 `Viewport.AllVisibleCells` 调用 SharedRandom 会导致多人失同步，应改用 LocalRandom；[作者回复](https://github.com/OpenRA/OpenRA/pull/18711#discussion_r711729049)确认已处理。这是评审发现并纠正的风险，不能写成已发行故障统计或本轮复现。

[一手：固定源码] 2021-10-02 合并提交 `a13d04630469fcb994bbbc25e644b4e6b471017c` 的 [WithResourceAnimation L62–103](https://github.com/OpenRA/OpenRA/blob/a13d04630469fcb994bbbc25e644b4e6b471017c/OpenRA.Mods.Cnc/Traits/World/WithResourceAnimation.cs#L62-L103)把间隔、可见格筛选后的洗牌、比例与动画选择接到 LocalRandom；同提交 [Util L201–209](https://github.com/OpenRA/OpenRA/blob/a13d04630469fcb994bbbc25e644b4e6b471017c/OpenRA.Mods.Common/Util.cs#L201-L209)让范围采样显式接收生成器，不再在帮助函数中固定取世界 SharedRandom。[研究] 可借的是调用者明确传入所拥有的流，而不是搬运整个 RTS 架构。不能把全部声音／动画相关代码一律改为局部随机：是否影响权威状态及调用时机才是边界。

### 2. BrogueCE：单人显示与玩法也有不同消费域

[一手：固定源码] `tmewett/BrogueCE@104a20fedbe7d9360d2dfc8ff665571694212ad8`（2026-09-27 主干快照，非本轮确认的发行包）的 [Rogue.h L401–405](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/Rogue.h#L401-L405)区分 substantive／cosmetic；[Math.c L90–133](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/Math.c#L90-L133)保存两份状态并按当前域采样；[IO.c L1768–1805](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/IO.c#L1768-L1805)在颜色随机化前选 cosmetic，完成后恢复原域。[研究] 这为独立单人 roguelike 提供另一种隔离实现；本轮只确认该调用链，不证明所有路径均正确，也不建议在新项目照搬可变全局选择器。

### 3. 复用原生能力，别把重置当续接

- [一手] [Unity 6.0 Random](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Random.html)明确 UnityEngine.Random 是全局共享的静态状态，需要独立生成器时可管理 System.Random 实例。[研究] 小项目可由玩法与表现模块分别持有已有实例并传入采样函数，不要求新增库或每个实体单独播种。
- [一手] [Unity 6.0 Random.state](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Random-state.html)区分保存／恢复完整状态和 InitState 重新初始化；官方示例中前者续接保存点，后者回到序列开头。[研究] 这不使全局 Random 自动成为多条流；不要在每次表现回调里重设全局 seed 来“隔离”。
- [一手] [UE 5.8 Random Streams](https://dev.epicgames.com/documentation/en-us/unreal-engine/random-streams-in-unreal-engine)提供 Blueprint RandomStream 结构变量和 From Stream 节点；[FRandomStream](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Core/FRandomStream)分别列 InitialSeed、当前 Seed 与 Reset，Reset 回到初始 seed。[研究] 沿现有所有者保留流状态并选对输入，别每次抽取都重建／重置；这里不承诺任意序列化或跨版本兼容。

[研究] ✅ 需要 seed 挑战、回放或可复查规则结果，且表现二改可能改变采样次数时，先隔离玩法与纯表现的随机消费。无此需求且现有实现没有耦合问题时保留简单方案；同一玩法域内部的规则改动仍可能改变后续序列，分流不使一切修改稳定。视觉对象若参与碰撞、命中或资源规则，按玩法处理，不能仅凭外观归入 cosmetic。

[研究] **二改预注册，未执行：** 固定版本、初始玩法状态与玩法输入轨迹，只增加闪光／音效变体，或改变视口、关闭表现；对照掉落、伤害及目标选择等所需玩法结果，并检查表现路径未抽取玩法流。若恢复中途继续，另核续接的是当前流状态而非重播起点。AI 可追消费者与补回归夹具，人决定哪些结果需复现。不新增锁步／回滚系统；通过也只支持本配置下的随机隔离，不证明跨平台、物理或完整网络确定性。

**许可与验证边界：** BrogueCE 对应源码标 AGPL-3.0-or-later，OpenRA 对应源码标 GPL-3.0-or-later；本节只借机制、不复制代码／资产，实际源码复用须遵守许可证。核对公开评审、固定文件与原生 API，未安装、运行引擎／游戏／模型、执行玩法测试或测量收益。

## 感知补研：角色知道什么与导演调度什么

核实：2026-10-16（UTC+8）。主线三，GC。[研究] 改变05 §3的具体选择：躲避／误导属于玩法时，保留目标身份不等于允许搜索任务读取实时位置。已有状态退出、导航让路和玩家屏外威胁分别处理执行寿命、移动与玩家信息；本节只补角色决策的信息来源，不扩写那些机制。

### 跨类型证据与反例

- **Homebody，恐怖探索。** [一手：创作者自述] 主要系统／玩法程序员及技术设计者 Alex Belzer 的[项目页](https://www.alexbelzer.com/work/homebody)说明，他实现了远离玩家时加快巡逻的机制，并用盲角布局让玩家甩脱追逐或遇见敌人。[研究] 它支持通过巡逻与空间设计调节遭遇，未公开足以证明完整感知记忆的数据结构。页面对 Alien: Isolation、Resident Evil 2 的比较及公平性感受属于作者解释，不当作那两部游戏的原始实现证据，也不把他的 GOAP 选择升格为默认方案。
- **Shattered Pixel Dungeon，回合 roguelike。** [一手：固定源码] `57a4e06a4caf162446d1c28caa7983f0493fecf0` 的 [Mob.Hunting L1284–1324](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L1284-L1324)分开 enemy 对象与 target 格，在 enemyInFOV 时更新目标格，再向该格移动；[后续分支 L1345–1411](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L1345-L1411)在无法继续靠近且失去视野时转游荡，逃跑也可继续使用旧位置。[研究] 只借这些基类分支，不宣称所有怪物、子类或目标选择路径都不读取真值。
- **同项目的允许共享反例。** [一手] [processSwarmIntel L298–323](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L298-L323)在群体智能挑战、正在追猎并感知目标等条件满足时，把目标位置传给范围内未追猎的同阵营怪物。[研究] 因而不能把“不是亲眼看到”一律判错；队友报告可以是明确允许的信息来源，不要求各角色彼此隔绝。
- **Left 4 Dead，合作动作射击的全局调度反例。** [一手：Mike Booth／Valve，2009讲义] [The AI Systems of Left 4 Dead](https://cdn.akamai.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf)PDF 第69页按队伍不可见区域与敌人类型选择生成位置，第79–82页估算队伍压力、调节威胁数量，Relax 期间既存特殊感染者仍可攻击。[研究] 导演读取世界状态以组织遭遇，不等于每个角色都应取得持续精确定位；这也反对把全局位置访问一概定性为坏设计。材料不证明每只感染者的感知实现，不推荐单人项目搬整套导演，也不把历史团队经验算成本仓库实测。

### 原生入口：位置输入、感知状态与遗忘不是同一开关

- **Unity Behavior 1.0 文档渠道，本轮读取的节点契约。** [一手] [节点清单](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/manual/node-types.html)将 Navigate To Location 的指定位置与 Navigate To Target 的目标 GameObject 分开；两者使用 NavMeshAgent，缺少时可回退 Transform。[研究] 搜索沿既有位置变量，不由实时对象坐标隐式覆盖；这里只核输入类型，不宣称具体目标刷新频率、内置感知记忆或所有 Unity 版本等价，也不把1.0渠道称为最新发行版。
- **UE 5.8 当前官方文档。** [一手] [AI Perception](https://dev.epicgames.com/documentation/en-us/unreal-engine/ai-perception-in-unreal-engine)分别列 Get Currently Perceived Actors 与 Get Known Perceived Actors，刺激携带 Age、Expiration Age、Stimulus Location、Successfully Sensed；Forget Stale Actors 配合 Max Age 管理遗忘，0表示不遗忘。[Move To 任务](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-behavior-tree-node-reference-tasks)的 Track Moving Goal 会随着目标 Actor 移动更新路径。[研究] 搜索可切换到位置键，并核旧任务是否仍跟对象；不能认为感知丢失会自动清除自定义黑板或停止已有追踪。视线丢失也不代表听觉、队友报告或其他允许的线索同时失效。

### 采用、撤回与二改预注册

[研究] ✅ 只在隐蔽、误导或有限情报改变玩家选择时，沿现有角色状态保留目标身份、已知位置和当前感知；线索需要按时间失效才保存年龄／时间。明确哪些线索可覆盖旧位置、何时搜索、返回或继续追踪，不默认建设通用知识库。导演若需要向角色投递提示，声明提示来源与精度；导演能读真值不自动授权普通搜索读同一真值。直接追踪本来就是玩法，或现有规则已满足要求时，保留简单方案。

[研究] **二改预注册，未执行：** 同一追逐场景新增绕角隐蔽路线或一种诱饵声音，记录当前线索来源、已知位置和实际移动目标；分别核失去视线后继续移动、别处声响、队友报告、重新出现，以及导演继续调节压力时的结果。允许持续追踪的角色另按其规则对照，不统一要求停追。AI 可追实时位置读取路径、补调试显示和回归用例，人判断躲避是否有效、搜索是否可理解、压力是否合适；若只是降低响应却没有创造所需选择，缩小或撤回记忆机制，不以等待时间更长当质量提高。

**许可与实际验证：** [一手／研究] Shattered Pixel Dungeon 固定文件头标 GPL-3.0-or-later，根 [LICENSE.txt](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/LICENSE.txt)为 GPLv3；本节只提炼机制，不复制代码或资产，不列作闭源项目即插用底座。创作者网页／Valve讲义不授予游戏内容复用权。只读仓库、公开网页、PDF文本、固定源码与官方契约，未运行游戏／引擎／模型或玩家实验，未测体验、效率或最佳遗忘时长；共同决策维护一份，仅原生接口分引擎说明。

## 选敌补研：候选、保持与主动切换

核实：2026-10-16（UTC+8）。主线一／三，GC。[研究] 改变 05 §7 的选择：需要保持攻击意图时，先定义候选资格、旧目标与主动切换，不直接扩大辅助范围或每帧选最近。这里只处理玩家选敌；不重复 NPC 感知、输入死区与枪口遮挡，也不新增通用目标管理框架。

### 跨类型机制与反例

- **Cogmind，回合 roguelike。** [一手：开发者手册] 本轮读取的[官方文本](https://www.gridsagegames.com/cogmind/manual.txt)页头为 Beta 17.1，Targeting Behavior 节说明：按 `f` 进入开火模式时恢复最近目标，可以是机器人或空地；此前引导武器的路径点仍在视野内时一并恢复。没有旧目标或旧目标不再有效才选最近目标。前后循环按近到远，通常仅含有武装的敌对对象；没有此类可见对象时才循环所有非盟友对象。查看模式始终包括有／无武装的非盟友对象，可先在那里选中无武装目标再转开火。[研究] 这支持把自动候选和玩家可指定对象分开，并保留例外选择路径；不证明实时锁定算法、所有旧目标失效条件或通用保持阈值。搜索所得 booklet PDF 为 Beta 7，本节以重新读取的当前文本为准。
- **Hades，俯视动作，原作历史补丁。** [一手] [Early Access Patch 039，2020-01-28](https://www.supergiantgames.com/blog/hades-long-winter-update-patch-notes/)扩大 Adamant Rail 使用手柄时的 autolock radius；[Early Access Patch 044，2020-06-23](https://www.supergiantgames.com/blog/hades-the-blood-price-update-patch-notes/)让 Companion Rib 召唤出的 Skelly 不再被 Aim Assist 自动锁定。后一网页页眉写 March 1st，本节采用正文补丁节明确标注的 June 23，而非页眉日期。[研究] 两次分别修改范围与候选，反证辅助不能沿一个“越强越好”的方向调。这里只说该召唤物，不泛化所有友方／练习对象，不推断仍能手动攻击它，也不把原作历史规则写成 Hades II 或当前全武器规则；开发者未提供这两项调整的对照体验测量。
- **Brotato，生存动作。** [一手：官方商店描述] [Features](https://store.steampowered.com/app/1942280/Brotato/)分别写默认自动开火和手动瞄准选项。[研究] 可借的是开火自动化与瞄准控制分开选择；该描述不公开候选排序、目标保持或各平台设置细节，也不证明手动瞄准会关闭自动开火。
- **OpenRA，RTS 的距离反例。** [一手：固定发行源码] GitHub 标签 API 将 `release-20250330` 解析到提交 `b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787`。[AutoTarget.ChooseTarget L349–451](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Traits/AutoTarget.cs#L349-L451)先筛关系、类型、可见性与武器资格；不允许移动时核射程，不允许转向时核射界，最后先比较优先级，同级才比较距离。[研究] 这是自动选敌并非总选最近的具体实现，不证明所有显式命令永不被自动目标覆盖，也不是动作游戏锁定手感的证据；不搬整个 RTS 调度体系。

### 最小采用、撤回与二改预注册

[研究] ✅ 需要保持玩家意图时，在已有输入／武器状态中分别指定候选、保持、失效和主动改选；目标可为对象或位置。因自动候选过滤而无法表达玩法允许的攻击时，补直接选择路径；自动攻击本来就要求不断重选，或精确手动瞄准就是挑战时，保留原方案。不要求所有游戏都有手动／辅助两套模式，不预设固定角度、时间或评分公式。

[研究] **预注册，未执行：** 同一遭遇新增更近的干扰对象或可攻击召唤物，检查继续攻击旧目标、主动改选、目标死亡／离开有效范围、按规则选择自动候选之外的对象；允许指定空地时也保留该输入。支持手动／辅助切换才检查切回。记录输入、候选、当前目标及改变原因，区分选错对象与瞄准／命中本身失败。AI 可追选择路径与补回归，人判断能否理解并纠正选择；若保持阻碍主动改选，缩小或撤回保持政策，而不是只加更强吸附。通过也只支持本遭遇与设备配置，不证明某种辅助普遍更舒适或更公平。

**许可与实际验证：** [一手／研究] OpenRA 对应文件头标 GPL-3.0-or-later；仅概念借鉴，不复制源码或资产，实际复用须遵守许可证。开发者手册、公告和商店说明不授予游戏内容复用权。本轮只读仓库、官方网页／手册与固定公开源码；未安装、运行游戏／引擎／模型或做玩家实验，未测操作、体验或 AI 效率收益。该建议与引擎无关，仅维护一份通用玩法政策。

## 意图预告补研：确定结果、条件变化与有意未知

主线一／三，GC；核实：2026-10-16（UTC+8）。
改变建议：05 §7 从看清起手进一步区分预告精度与有效条件，不把全知 UI 当默认质量升级。
新证据：Into the Breach 作者取向及预览／规则修订、Slay the Spire 意图设计、Amnesia 信息政策反例。[研究]

### 决策信息不等于完整行为表

- **确定结果服务局面求解。** [一手：设计者访谈] Justin Ma 在 [2018-02-23 访谈](https://www.gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-)把 Into the Breach 的敌方预告与减少随机性、解谜取向相连；保护建筑、牺牲机甲和推移提供不同解法。这是首发前的设计说明，不是发行后的受控评价。[研究] 当玩家要分配有限行动、改变已知攻击后果时，明确预告可作为候选；不推出所有类型都应采用，也不把局内攻击可预测说成整局没有随机性。
- **只呈现当前选择需要的信息。** [一手：作者原始视频转写] Slay the Spire 两位创始人的 [2019-05-02 访谈](https://arstechnica.com/video/watch/war-stories-slay-the-spire-war-stories/?c=series)说明：随机行动不预告使攻防难选，逐敌长文本又太繁重，后来改为意图图标；部分敌人会根据玩家行为改变意图。[研究] 支持决策粒度与条件变化，不证明所有敌人每张牌后即时重算，也不要求复制图标体系。
- **有意未知是另一种体验政策。** [一手：作者复盘] Thomas Grip 的 [2019-10-15 文章 Lesson 7](https://frictionalgames.com/2019-10-9-years-9-lessons-on-horror/)回顾 Amnesia 理智系统从较直白改得更含糊，以保留想象与紧张。[研究] 这是理智系统而非敌方下一招 UI，只用于反驳“规则越透明普遍越好”；作者观察不能证明隐藏攻击提高恐怖体验，更不能授权错误的确定性提示。

[研究] 三种政策不要求三套系统：已确定且玩家需要据此计划的行动，作明确预告；可被玩家后续行动改变的结果，说明当前条件并在变化时更新或撤销；观察和试探本身有价值的部分，可不公开。沿现有行动状态定义哪些部分已锁定、哪些仍可变化，不让表现自行许诺玩法没有锁定的结果。若只需要攻防类别，就不增加完整行为表；若未知只迫使玩家反复盲试且不是所需体验，再补必要信息。

### 已发布修订：可以删显示，也可以改规则

[一手：开发者公告] Matthew 的 [2023-01-23 补丁帖](https://steamcommunity.com/app/590380/discussions/0/3765606580168752432/)明确标记 developer：移除 Earth Mover／Mine Bots 的 Attack Order 显示，因为它们没有排队攻击；调整 Wind Torrent 的推移次序，使结果与效果预览更一致。标题写 v1.2.88，正文写 1.2.87 Changelog，本节保留冲突，以日期公告指认，不自行断定精确补丁归属。

[研究] 第一项支持撤掉不存在的顺序承诺，第二项支持修改互动次序来维护可预测性，而非只修 UI。公告未披露实现根因，不能断言预览与执行必用不同代码，也不能据此要求统一模拟框架。历史修订不证明当前全部预览正确，更不证明胜率、留存或单人维护收益。

### 第二次修改：仅预注册，未执行

[研究] 在已有攻击上改变一个会影响选择的条件，如推移顺序、护盾或目标死亡，保留同一局面对照：

1. 条件不变时，核预告的动作、对象、数值和次序与执行一致；只核设计承诺显示的部分
2. 玩家动作改变条件时，核已锁定部分仍守承诺，可变部分按规则更新或撤销；不把旧提示继续留着当不确定性
3. 没有排队动作的对象不出现虚假排序；有意隐藏的部分也不得因调试／新 UI 意外公开
4. 已有预演／撤销才核预演退出后状态、资源和下一行动；不为做这些检查而新增模拟器

[研究] 记录显示所依据的状态、条件变化与最终执行；AI 可追条件消费和补回归，人决定哪些未知值得保留、预告能否支持所需决定。失真时先修条件同步、缩小显示承诺或简化规则；若信息堆积使当前选择更难读，退回必要粒度，不用更多字段充当质量提高。

**许可与实际验证：** [研究] 仅读仓库和公开开发者访谈／公告，未读取商业反编译代码、复制游戏代码或提取资产；网页不授予游戏内容复用权。未安装、运行游戏／引擎／模型或进行玩家实验。来源支持具体设计取向、作者观察与历史维护，不支持通用体验排名或 AI 效率承诺；机制与引擎无关，只维护一份共同建议。

## 物品补研：数量栈、单件状态与转移身份

核实：2026-10-16（UTC+8）。主线三，GC。[研究] 改变 05 §4 的选择：增加耐久／强化，先核可互换性与实际拆分、转移路径，不自动将全部物品改成独立实体。比较开放世界 RPG 运行时 OpenMW 与沙盒游戏 Minetest Game／Luanti；后两者属于同一生态，不算两个独立案例。固定主干不等于稳定发行，本节不扩写 UI 或存档。

**OpenMW：保留状态不等于复制身份。** [一手] 固定 `9ec458174fa5a459b7910cd6990c1acc830b0b8a` 的实际消费者如下：

- [ActionTake](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/actiontake.cpp#L20-L40)的非拖放拾取路径加入容器、删除地面对象，并采用返回目标；[ItemModel.moveItem](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwgui/itemmodel.cpp#L58-L65)区分整堆转移与部分复制。未合并的整堆可沿用身份；合并返回目标栈，不能要求所有旧引用仍指向存活物品
- [ContainerStore.unstack／restack／stacks](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/containerstore.cpp#L315-L400)拆分时保留原栈指定数量，为余量另发 RefNum；合并时原项归零并返回存活栈。同定义只是必要条件：还核灵魂、剩余使用时间与传统物品脚本；有耐久者须都满耐久，有附魔充能者须都满充能。[研究] 因此两个都剩50%耐久也不能合并，是该项目政策，不是通用相等规则
- [装备入口](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/inventorystore.cpp#L162-L195)按类别拆一件，[弹药与投掷物](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwclass/weapon.cpp#L84-L105)允许装备时保持栈，不能写成所有装备都拆。普通装备在装备期间另受[合并限制](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/inventorystore.cpp#L547-L565)；[修理](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwmechanics/repair.cpp#L59-L70)恢复后尝试重合并。[灵魂捕获](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwmechanics/actors.cpp#L209-L214)实际采用拆一件、写灵魂、按同灵魂重合并，也反证新增状态不必永久禁堆叠

[一手] 维护证据不是假想风险：[2023拆堆另发身份](https://github.com/OpenMW/openmw/commit/0f608f388ef84db438eda67c06409dcd58056a1e)后，[2024-05-28修复](https://github.com/OpenMW/openmw/commit/ae4bf04798b3ad25a8490d448f8d53b06347e567)仍需处理跨容器拆堆丢灵魂：旧路径只凭定义 RefId 重造，新路径从实例模板复制。当前 [InventoryItemModel.copyItem](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwgui/inventoryitemmodel.cpp#L50-L65)与 [ManualRef](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/manualref.cpp#L101-L109)保留实例数据后清 RefNum／Lua脚本。[研究] 借的是“状态保留、身份不重复分别核”；清脚本是此项目的复制规则，不要求其他游戏拆分时丢弃脚本。GitLab原问题6148／MR2995本轮未取得正文，不据搜索摘要宣称原报告者复测。

**Minetest Game／Luanti：单件工具可用值式状态。** [一手] 游戏固定 `c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f`，[farming实际消费者](https://github.com/luanti-org/minetest_game/blob/c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f/mods/farming/api.lua#L59-L104)将锄头注册为 tool，使用后改 wear 并返回 ItemStack。Luanti 固定 `0e1414682e4be3ffb84d067d0621e98d6bf5cd76` 的 [ItemStack字段](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.h#L146-L154)为 name、count、wear、metadata，没有内置逐件 ID；[tool构造](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L30-L40)限数量1，[默认stack_max](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L721-L738)也是1。[拾取](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L383-L399)返回未收入背包的余量，[地面实体](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item_entity.lua#L325-L348)据此更新或删除；[拆分](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L484-L501)复制状态值后分数量，[跨槽／列表转移](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L826-L891)将余量放回来源；[持用工具](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L515-L538)读取、损耗后写回当前 ItemStack，而非沿用地面实体身份。

[一手／研究] **跨路径反例必须保留：** [stacksWith](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L401-L481)比较 name／wear／metadata，但同文件实际 addItem／itemFits 只比较 name 与 metadata；[掉落物合并](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item_entity.lua#L103-L138)才另比较 wear。耐久工具靠单件限制隔离，不能把函数名推成所有路径支持任意可堆叠耐久装备。[6057原报告](https://github.com/luanti-org/luanti/issues/6057)还指出空元数据使表面相同物品无法合并；[85d7b18修复](https://github.com/luanti-org/luanti/commit/85d7b18d851504e6d9f637c4373cf896b1ce8e4c)避免无内容时生成空键值。[已有单测](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/unittest/test_inventory.cpp#L39-L83)检查 tool 解析为 count=1 并保留 wear；本轮仅读定义，未运行，不能当全路径验收。

[研究] **采用与二改，仅预注册：** 已有背包能承载单件／每栈状态、限制数量或定制合并，并返回余量／存活目标，就先复用。用三把同型剑增加耐久或强化，只改其中一把，再转移、拾回、与另两把合并：核数量守恒、状态不重置不串件；若设计允许恢复为可互换状态后回堆，核旧引用失效或改指存活目标。仅当玩法要跨位置／操作持续引用“这一件”时补身份，不以显示耐久条代替数据契约。AI 可追消费者和补回归，人决定何时仍可互换；组件无法表达所需区别才局部扩展，不迁移整套框架。

**许可与实际验证：** [一手／研究] [OpenMW README](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/README.md#L4-L9)标 GPLv3，运行 Morrowind 需自有游戏；[Luanti引擎](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/LICENSE.txt#L114-L132)为 LGPL-2.1-or-later；实际借鉴的 [farming模块](https://github.com/luanti-org/minetest_game/blob/c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f/mods/farming/license.txt)源码单独 MIT，媒体另有许可，不能把仓库根许可套给每个组件。这里只提炼机制，不复制源码或资产，不把两套引擎推荐为闭源 Unity／Unreal 项目的即插用底座。未运行游戏、引擎、模型或上游用例；未证明性能、维护工时或特定引擎集成收益。

## 任务推进补研：历史事实与当前条件

核实：2026-10-16（UTC+8）。主线三，GC。[研究] 改变05 §9的选择：先区分曾经获得、当前可交付与已经完成，再扩任务内容；不把新拾取事件当作唯一进度来源。本节只处理推进条件与消费者，不重做库存事务、叙事存档或遭遇奖励。

**Flare：允许存放物品，会改变原有推进条件。** [一手] 动作RPG Empyrean Campaign 的[作者问题827](https://github.com/flareteam/flare-game/issues/827)指出：任务物品可入仓后，原来以 `requires_status` 代替携物检查的地方需要改用 `requires_item`，对话／任务文字也须对应当前持有。[2020-12-10提交](https://github.com/flareteam/flare-game/commit/d058433aa3759a54148c622913a02ac204196b72)开放主线物品的私人仓库存放，同时为祭坛补当前携刀、为书本补当前羽毛笔、为Florin制墨补花朵／血瓶检查及缺材料对话。[研究] 历史标记可以继续保留，但不能再单独授权需要现物的操作；该变更不是原报告者全面复测证据。

[一手] 游戏固定 `af6eee6d339ac98011864bfe89da837fe7769c28`，引擎固定 `1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f`；固定主干不等于稳定发行。实际消费链如下：

- **已有物品也能满足条件。** Alchemy材料进入[普通一级掉落表](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/loot/level_1.txt#L1-L7)；[Florin对话](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/npcs/florin.txt#L91-L134)接取写 `emp_alchemy_init`，交付要求已接、未完成与当前三种材料，随后只消耗水晶／蘑菇、保留芦荟并写 `emp_alchemy_finish`。条件不要求接取后再拾一次；这是源码路径判断，未跑先取物路线
- **显示不负责交付。** [日志定义](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/quests/0011_alchemy.txt)按当前材料显示可返回提示，按独立完成状态显示完成；[QuestLog](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/QuestLog.cpp#L163-L200)重算显示。[NPC对话动作](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/NPC.cpp#L917-L933)交给EventManager执行，再由[状态动作](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/EventManager.cpp#L977-L984)推进CampaignManager；不是日志看见材料就自行完成
- **已解锁不从剩余物品倒推。** [Book交互](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/maps/book_of_the_dead.txt#L340-L355)消耗羽毛笔／墨水并写 `emp_main_underworld`；另一地图的[传送与on_load外观](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/maps/wizards_tower_2.txt#L549-L567)读该状态。[SaveLoad](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/SaveLoad.cpp#L139-L202)分别保存装备／背包与campaign；同文件L510恢复campaign后，日志与地图再消费恢复的数据

[一手] 查询范围也不能靠名字猜：[当前checkItem](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/CampaignManager.cpp#L143-L147)相加背包与装备，不计仓库。[2026-09-29修复](https://github.com/flareteam/flare-engine/commit/d3d5688a59057e6318421d8e959e26287eefd6c1)才把“任一处数量足够”改为两处合计，防止各放一把刀却不能满足两把要求；QuestLog旧注释的“not equipped”不能盖过实际消费者。[研究] 这些资料支持条件和持久状态分工，不证明交付与存档原子性、任意并发安全或所有旧档兼容。

**Shattered Pixel Dungeon：局部状态足够，函数名也有边界。** [一手] 独立作者的回合roguelike固定 `57a4e06a4caf162446d1c28caa7983f0493fecf0`。[墓室生成](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/rooms/quest/MassGraveRoom.java#L101-L123)已放CorpseDust；[Wandmaker](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/npcs/Wandmaker.java#L111-L214)首次介绍写given，后续交互查当前物品，因此已取得物品也可满足，但不表示首次对话自动跳过介绍完成。[确认奖励入口](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/windows/WndWandmaker.java#L108-L130)消耗任务物品、移除NPC并调用complete；后者把奖励引用清空。任务[保存／恢复](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/npcs/Wandmaker.java#L249-L293)包含given与奖励状态，[Dungeon实际存档入口](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/Dungeon.java#L661-L666)确实调用，不需要从空背包重新推断完成。

[一手／研究] 反过来，[Quest.active](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/npcs/Wandmaker.java#L378-L447)还查询当前房间、诅咒或怪物；这里核实的[PrisonLevel消费者](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/PrisonLevel.java#L73-L80)选择紧张音乐，不能把active当成已接受／已完成任务的统一判断。两个项目分别支持各自机制，不推出所有游戏都需同一种任务状态表。

[研究] **采用与二改，仅预注册：** 沿现有交互与存档区分已接受／已交付等历史事实、当前条件与推进入口。把“先接再取”改成允许先取物，再验接取、暂存后回来、交付消耗、离开保存与恢复：当前可交付提示对应允许的物品范围，完成与永久解锁不因物品已消耗而回退。设计若改为持续携物／占领才开放，就保留可逆规则；不能把所有世界条件锁存。AI追读写路径并补回归，人决定哪些事实永久、哪些条件允许失效；已有组件能表达就不加通用任务图或事件溯源。

**许可与实际验证：** [一手／研究] [Flare引擎](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/README.md#L28-L38)源码GPL-3.0-or-later；[Empyrean Campaign](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/README.md#L17-L25)数据／美术CC-BY-SA 3.0并允许后续版本，不能套用引擎许可。Shattered相关源码文件头标GPL-3.0-or-later。这里只提炼机制，不复制代码、剧情或资产，不推荐为闭源Unity／Unreal即插用底座；共同建议与引擎无关。仅读固定源码、原问题与补丁，未运行游戏、引擎、模型或上游用例，未证明全部分支、保存故障恢复、玩家体验或AI效率收益。

## 效果时钟补研：调度时间、行动次数与到期显示

主线三，GC；核实：2026-10-16（UTC+8）。
改变建议：05 §6 持续效果按行动调度、指定次数或模拟时间选择；首末跳、到期与剩余显示一起定义，不把“声明时钟”简化为统一 N 秒。
新证据：Shattered Pixel Dungeon 的毒／加速消费者与历史显示修订，不同作者 Flare／Empyrean 的秒数效果、暂停及恢复路径。[研究]

### 回合玩法：调度时间不等于输入次数

[一手：固定源码] Shattered Pixel Dungeon 沿用快照 `57a4e06a4caf162446d1c28caa7983f0493fecf0`。[Actor L39–56](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java#L39-L56)定义 TICK 与同时间优先级，[调度 L250–325](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java#L250-L325)选择累计时间最早的 Actor，再按优先级打破平局；[Hero L868–887](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/hero/Hero.java#L868-L887)在无待执行动作、未休息时进入 ready 并返回等待。因此这条等待玩家输入的路径不随现实秒数扣效果时间，不能推广成所有回合游戏都如此。

[一手] [Char.speed L770–782](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L770-L782)读取 Haste，[Hero移动 L1873–1906](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/hero/Hero.java#L1873-L1906)按移动耗时除以速度消费调度时间；[Poison.act](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Poison.java)自行跳伤、消费 TICK，再减少剩余量并判断移除。[研究] 同一段毒的调度时间内，加速可以改变移动机会，不能改成“每次走一步扣一跳”，也不能从移动加速推出所有攻击和效果都加速。

[一手] [FlavourBuff L26–47](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/FlavourBuff.java#L26-L47)在被调度时移除；[Buff.visualcooldown L135–143](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Buff.java#L135-L143)为显示采用 cooldown+1，注释解释普通 Buff 晚于英雄行动。[研究] 借的是按行动边界解释剩余值，不照搬加一；若玩法承诺“接下来几次有效攻击”，应直接按对应行动消费，而非用调度时间近似次数。这是条件建议，不声称 SPD 所有效果采用同一规则。

### 即时玩法：模拟秒、菜单与恢复各有边界

[一手：固定源码与实际配置] 本轮读取 `flareteam/flare-engine@1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f`（2026-10-05）与 `flareteam/flare-game@af6eee6d339ac98011864bfe89da837fe7769c28`（2026-08-08）两个主干快照，不冒称已验证发行组合。Empyrean Campaign 的 [Ranger L25–66](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/powers/categories/ranger.txt#L25-L66)实际给 Haste 的移动与攻击效果分别配置秒数；[毒云配置](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/powers/base/ranger/poison_shot_aoe_1.txt)授予 poison，[effects定义](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/powers/effects.txt)将其映射到 damage。这是实际游戏内容消费者，不是只有框架功能清单。

[一手] [Timer L188–244](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/Utils.cpp#L188-L244)按逻辑步递减，以配置步频判整秒；[EffectManager L390–497](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/EffectManager.cpp#L390-L497)先移除已到期效果，再检查本步周期效果，最后推进计时器。周期判断取剩余时间的整秒边界，不足一秒另有初始触发条件。[研究] 只写“持续 N 秒”不能决定首跳、末跳与跳数；该实现也不等于“一定等满一秒才第一跳”。这里只提炼需要明确的边界，不把 Flare 条件推广为默认周期算法。

[一手] [GameStatePlay L857–900](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/GameStatePlay.cpp#L857-L900)仅在未暂停时执行正常角色更新，角色经 [Avatar L490](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/Avatar.cpp#L490)进入 [StatBlock L1096–1097](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/StatBlock.cpp#L1096-L1097)推进效果。[MenuManager L917–919](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/MenuManager.cpp#L917-L919)另按 menus_pause 决定普通菜单是否暂停，退出菜单等另有强制条件；[main L195–235](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/main.cpp#L195-L235)在最小化恢复时重置逻辑时间基准，暂停时也避免累积补帧。[研究] 只有设计要求冻结的间隔才不消费、也不在恢复时追补；菜单中时间继续是另一种合法政策。这里只核正常更新与恢复路径，不宣称暂停屏蔽全部状态修改。

### 显示修订与二改预注册

- [一手：历史用户报告、维护者诊断与补丁] SPD [#1707](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1707)报告加速下时间冻结显示 -0；[维护者解释](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1707#issuecomment-2115939937)称逻辑容忍微小负数以免少给一次行动，显示未同步处理。[c9c6380](https://github.com/00-Evan/shattered-pixel-dungeon/commit/c9c63803492878a7fab35c2be3b74219440de9d2)修正相关图标取整与描述下限。未取得原用户修复后复测；不能从关单推当前全部到期显示正确
- [一手：历史维护者解释的反例] SPD [#1843](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1843)报告 Salt Cube 下剩余回合显示17、17、15；[维护者2024-09-18回复](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1843#issuecomment-2359484764)解释 Buff 速度变化，但数值只在其行动时更新，并选择保留。[研究] 显示跳变不自动证明结算错误，也不证明玩家必然能理解；该历史反馈不当作当前复现
- [一手：近期源码修订] Flare [58f0e5b，2026-07-06](https://github.com/flareteam/flare-engine/commit/58f0e5b1242680d6575e5035c960f3a5f025aaf7)把护盾剩余强度与计时字段分开，使有期限护盾的图标 tooltip 也能显示剩余时间。它支持分别表达资源量与期限，不证明毒／加速有过同一缺陷；没有独立用户复测或体验收益测量

[研究] ✅ 沿既有行动队列、模拟更新与效果实例确定推进单位、首末跳、移除和显示，保留每种玩法自己的暂停政策。不为效果种类增加而统一 N 秒、所有输入减一或搬入另一游戏调度器；本节不改变既有多来源合并与撤销建议，也不重复数值组合与命中连锁。

[研究] **二改预注册，未执行：** 同一毒效果新增一种移动加速，检查快慢动作、等待、临界到期时的跳伤及实际行动机会；承诺按次数消费才核对应有效行动。即时版本在下一跳前、到期前分别打开普通菜单、正式暂停与切后台，再恢复，按各自政策核继续或冻结，冻结路径不得补出一串积压跳伤。记录实际状态、计时／次数与 UI 更新边界；AI 可追消费者和补回归，人决定时间压力与可读性。没有具体语义冲突时保留现有简单实现，不以显示更平滑代替结算正确。

**许可与实际验证：** [一手／研究] SPD 对应源码文件头标 GPL-3.0-or-later；Flare 引擎 [README许可节](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/README.md#license)说明代码 GPLv3-or-later，游戏内容根 [LICENSE.txt](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/LICENSE.txt)为 CC-BY-SA 3.0。只读固定源码、配置、提交与公开讨论，不复制代码／资产，不列作闭源 Unity／Unreal 项目可直接接入的默认底座。未安装、运行游戏／引擎／模型或做玩家实验，未验证快照组合兼容、跨设备恢复或净收益；通用时间／行动语义维护一份，不新增双引擎重复实现。
