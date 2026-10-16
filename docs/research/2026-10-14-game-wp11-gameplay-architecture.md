主线：一／二／三／四；玩法反馈、额外能力、第二次修改与可维护交付
改变的建议：[研究] 默认组件＋窄规则＋局部状态机，按真实复杂度升级。先定状态所有者、时钟、退出与输入边界；相机、关卡、成长、教学与辅助按玩家决策取舍。物品区分可互换性，任务区分历史与当前条件；功能通过仍须核体验
新证据：[一手／社区] 固定源码、官方契约、历史修复／评审及开发者复盘，来源、版本和日期见各节；含OpenMW／Luanti物品路径、Flare／SPD任务链、Overgrowth 1.2及修订后玩家单例。[研究] 另有确定性算术反例，未作游戏、引擎、模型或玩家对照

# WP11：单人独立游戏的 gameplay 架构取舍

证据核实：原记录2026-10-13—14 UTC，后续日期见各节。除确定性算术复核外，均为公开资料／源码研究，未运行引擎、游戏、模型、玩家实验或上游测试，未安装／购买插件；所有验收计划均未执行。源码与文档检查不证明性能、工时、体验或AI收益；“AI风险”是契约推导，固定主干不等于发行包。各节保留特有缺口与历史验证范围。本文只提炼机制，不复制代码／资产；实际复用仍须分别核代码、素材和引擎许可。

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

**[研究] 最低必要上下文**：现有相关实现＋版本＋依赖资产／节点引用＋一页以内的状态与生命周期说明＋已存在的回归夹具。让 AI 先追明一个需求跨哪几处，再改这些位置；不是要求所有人新建一套文档平台。

**建议给 Agent 的具体契约 [研究]**：
1. 定义不可保存当前 HP／目标／冷却；运行实例由谁创建、复用、退出时谁清理
2. 每个字段的寿命：项目、存档、session、场景、角色、一次施放；每个计时器的时钟
3. 哪个函数提交伤害／奖励／库存变化，谁只观察；同步或排队事件的顺序
4. 在正常结束、取消、死亡、卸载、池回收五条路径上，哪些句柄、标签、任务和订阅必须归零
5. 内容 ID 与序列化字段不能随重构漂移；改变需要迁移和旧夹具
6. 准确包版本与已经知道的本地改造；不要“顺手更新所有依赖／改成最佳实践”

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

**[研究] 优先验证**：同一Unity切片先用组件／小状态机，再做上述蓄力中断＋重开。退出组合难维护才对照HFSM；测得CPU批处理瓶颈才比ECS，不同时比较十个框架。

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

[研究] **顺序**：简单跟随／固定镜头→定位漏看的动作→局部规则→装饰运动。只增电影感却让人反复找目标、逐房修补时撤回；优先已有Unity组合，不据此宣称跨插件性能最优。

### 2. 三种玩法的不同默认，不共享一套“最佳参数”

**[研究] 平台跳跃**：保起跳前落点、空中高度参照与下落安全空间。屏内房间固定，大房间用死区／边界，高速漏看才加水平前瞻；纵轴按着地、越窗、下落更新。窗口导致落点晚出现或试探时前瞻翻向即调整。关卡标必要视野，程序维护少数规则。

**[研究] 俯视战斗**：固定朝向、稳定尺度、有限跟随；小场一次看全，Boss／双目标才加目标组并设最低可读尺度。分散敌人导致过度缩放时缩目标集或改空间；看不清动画、呼吸式变焦或新增敌人需大量特例就退回。未核生产游戏采用此组件组合。

**[研究] 越肩**：探索可有惯性，瞄准需直接响应；相机、身体、骨骼分开。绕行会改瞄准关系，拉近会损周边信息；有限策略仍无可用视点时改几何／局部显隐，承担材质维护成本。

**遮挡补核（2026-10-14，Cinemachine 3.1.7）。** [一手] [Decollider](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDecollider.html)只脱离障碍／地形，不保视线；[Deoccluder](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDeoccluder.html)依赖collider／查询，Maximum Effort限命中数，增加成本不能创造视点。Transparent Layers只排除遮挡层，不控材质。[研究] 先保瞄准意图，再在允许位移内恢复视线；两组件不自动保枪口／落点，也不默认叠用。

[一手] [Shader Graph 17.0.4 Dither](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/manual/Dither-Node.html)以Alpha Clip Threshold丢像素模拟透明并保深度写入，不是完整遮挡系统。[研究] 固定朝向可借材质原语，但须定对象、范围、恢复，保留掩体边、落地面、预告。轮廓只报角色位置，屋顶分区还需验新增层高／门窗。目标分辨率与运动中另验抖点干扰，未证优于透明混合。

[一手] **发布后反证**：[Project Zomboid 42.21 stable 公告](https://projectzomboid.com/blog/news/2026/09/42-21-stable-released/)称大树妨碍驾驶，改cutaway以露出树下房屋／家具且仍待改进。[研究] 支持树冠＋步行改驾驶／瞄准的二改验收，不证明采用Cinemachine／Shader Graph或该方案最优。

[研究] **成本**：材质不能批量显隐或墙树例外不断增加时先改几何构图。二改记collider、材质、显隐特例、恢复遗漏及工时，核角色、落点、预告、准星、弹道。[3.1 许可页](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/license/LICENSE.html)与[17.0 许可页](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/license/LICENSE.html)均为UCL、限Unity-dependent项目；引擎资格另核WP1。

### 3. 两种真实开发证据：借机制，不复制整套负担

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

## Endless Sky：非平台游戏的动感镜头与默认值取舍

核实：2026-10-14 UTC。主线 1；补 05 §8 从“效果能关闭”到分别决定效果、默认值与首玩可发现性。比较的是俯视太空贸易／战斗中的居中跟随与加速度偏移，不重做输入研究，也不声称两种方案通过了全部玩法回归。[研究]

**两个可运行选择及代价。** [一手] [#9638](https://github.com/endless-sky/endless-sky/pull/9638)于 2024-05-19 合并（`ae5c7f1fb6e791a5742cab23a9332f72913893d9`）；[固定 Engine.cpp](https://github.com/endless-sky/endless-sky/blob/cbca555b1cdca081b57ee7473f3db07a31181d96/source/Engine.cpp)的 OFF 返回飞船中心／速度，ON 对相机速度与位置插值，REVERSED 反向偏移。同一飞行与战斗可以保留稳定参照，也可以用偏移强调加速感；偏移会改变前后方可见空间，增加重新定位目标的负担，具体收益属于玩法判断。[研究] [#8446 的讨论](https://github.com/endless-sky/endless-sky/pull/8446#issuecomment-1441120912)明确提出希望高速前进时看见更多前方空间；另一位[反馈者](https://github.com/endless-sky/endless-sky/pull/8446#issuecomment-1441124904)认可动感却担心目标辨识与长时间舒适度。这些是方案反馈，不是计时或晕动测试。[社区]

**改得更顺，不等于所有人都应开启。** [一手／社区] 较早的 [#7347](https://github.com/endless-sky/endless-sky/pull/7347)按推力状态更新偏移；Koranir 在[2023-12-30 比较](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872451536)中认为其起止突兀，并给出替代视频。原方案修订后，alexrovw [实际使用并表示会保留](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872582712)，随后[复测确认](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872604442)复杂转向／停车／倒车下轮廓对齐和反向模式故障已修，但仍指出武器后坐力边例。该 PR 未合并，作者关闭它让位于 #9638；不能把前者的测试移作后者全面通过。#9638 获原方案作者[正面体验评价](https://github.com/endless-sky/endless-sky/pull/9638#pullrequestreview-1807800878)，Koranir 又在[2024-05-18](https://github.com/endless-sky/endless-sky/pull/9638#issuecomment-2119032487)报告用 Marauder Leviathan 试玩后认为效果轻微且增加动感，支持默认开启；最终默认为 ON。没有同一批玩家的受控 A/B，不能宣布后一算法普遍更优。

**后续反馈改变的是默认值。** [一手] [#12252](https://github.com/endless-sky/endless-sky/pull/12252)于 2026-02-12 合并，仅改 Preferences.cpp：将加速度镜头缺省索引从 1 改 0，并去掉 Landing zoom／Show hyperspace flash 的默认开启；[之前](https://github.com/endless-sky/endless-sky/blob/f57851bc0cfe715c6e276a3e1402c131fe368a4c/source/Preferences.cpp#L65-L66)与[之后](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Preferences.cpp#L65-L66)可核。作者认为长设置列表使新人未必找到关闭入口，甚至可能直接退出，但明确写 Testing Done: None；这是维护者的可接近性判断，不是玩家流失数据。[社区] 合并后 Koranir [质疑是否收到实际投诉](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3889579433)；warp-core [说明自己也抱怨](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3897596643)，Amazinite [第一人称表示镜头效果更令人恶心而非有趣](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3898047376)。后者未分离加速度与着陆缩放的贡献，也未给安装版本，不能转写为独立玩家群体共识或精确算法因果。

**交付范围与采用判断。** [一手] 发布版 [v0.11.0](https://github.com/endless-sky/endless-sky/blob/v0.11.0/source/Preferences.cpp#L65-L66)（2026-01-31）仍 ON，[v0.11.1](https://github.com/endless-sky/endless-sky/releases/tag/v0.11.1)（2026-04-25，unstable）的 [changelog](https://github.com/endless-sky/endless-sky/blob/v0.11.1/changelog#L263)与源码已 OFF，[v0.11.2](https://github.com/endless-sky/endless-sky/releases/tag/v0.11.2)（2026-06-27，stable）[仍 OFF](https://github.com/endless-sky/endless-sky/blob/v0.11.2/source/Preferences.cpp#L66-L67)。[固定 Camera.cpp](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Camera.cpp#L46-L74)保留三种模式；[设置读取](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Preferences.cpp#L243-L244)仍采用已保存的值，因此升级不等于所有老玩家实际关闭。[研究] ✅ 对已有明确不适反馈、又不承担必要提示的运动效果，考虑稳定缺省＋可发现的可选效果；代价是喜欢动感者可能不主动发现它，同时增加设置说明与各模式回归成本。不要因此删除有正面反馈的效果，也不默认关闭所有视觉反馈。AI 可实现独立开关、保留旧选择与检查菜单路径；人决定目标体验，首玩测试核实际能否找到并理解开关。

[研究] **证据终点**：实现、使用反馈与默认值撤回已核；人群分母、使用时长、关闭后舒适／留存收益未知。代码GPL-3.0-or-later，不作Unity／UE即插插件；有新收益复测前不再堆同类投诉。

## 命令预览补研：提示清楚还要规则一致

核实：2026-10-15（UTC+8）；主线3／1。05 §6补提交前反馈：复用规则查询，区分精确与估计；跨工厂、经营、战术的机制证据不等于同方案均已验证。[研究]

### 1. Factorio：动作模式改变，预览也必须改变

[一手] Wube 的 [FFF #213（2017-10-20）](https://www.factorio.com/blog/post/fff-213)列出普通建造、ghost 与 shift-blueprint 的不同规则：ghost 可忽略已标记拆除的实体，shift 放蓝图会安排拆树／石并跳过不能放置的部分。作者举例，0.15 按住 shift 后矿机 ghost 实际可放，预览却仍因树石标红，0.16 修正显示。这是开发者报告的历史修改，不是本轮复现，也未提供理解率改善数据。

[研究] 预览须含位置、模式、修饰键和相关世界状态；蓝图可提交不等于每项落地。先改现有查询，避免UI另写碰撞／费用规则；文章未证明Factorio全部查询执行已统一。

### 2. OpenTTD：同一处理器可试算，但不是任意结果保证

[一手] 固定 `OpenTTD/OpenTTD@daa6e1ca1c357eb9e6ae3d69af134205e1be8517`（提交日 2026-10-12），读取完整相关文件；固定主干不等于稳定发行版本。

- [command_func.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command_func.h)：`CommandHelper::Execute` 先以测试 flags 调用同一个 `CommandTraits<Tcmd>::proc`，通过检查后再带 Execute 标志调用；估算可在测试阶段后退出。`Do` 也区分测试和执行
- [command.cpp](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command.cpp)：试算前后切换城镇评价与持久存储的测试模式；分别显示估计费用和已执行费用动画。非 NoTest 命令断言测试／执行费用及失败状态一致，NoTest 则检查实际执行失败
- [command_type.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command_type.h)将 NoTest 明确定义为测试／执行输出可能不同；[landscape_cmd.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/landscape_cmd.h)的 ClearArea 实际使用该标志，注明多格房屋拆除使城镇评价在两阶段间不同

[研究] **共享处理器仍有连锁状态差异**，提交须重核较早预览。随机／隐藏信息显示条件或范围；查询不得扣费、消费玩法随机或发结算事件。这些待验责任不等于已证OpenTTD全部无副作用，亦未运行其断言。

### 3. 竞争选择：让复杂组合可尝试，不强迫 UI 解释一切

[一手] Tom Francis 的 [Tactical Breach Wizards 原始设计（2018-02-02）](https://www.pentadact.com/2018-02-02-pitch-tactical-breach-wizards/)设想提交前反复试演，但明确原型可能被改掉；[开发商成品页面](https://store.steampowered.com/app/1043810/Tactical_Breach_Wizards/)确认免费 rewind 鼓励玩家实际尝试技能组合。成品页只支持这项功能仍在，不证明早期的同时行动方案全部保留，也不揭示内部预测／回滚实现。

[研究] 可撤销尝试符合玩法时，可替代过重的数字／箭头说明；风险承诺、未知或反应时间构成挑战时，rewind会改玩法。默认窄查询，确需试演才承担完整状态恢复成本。

### 4. 采用成本、二改与引擎边界

[研究] 查询隔离资源、事件、随机、持久化，缓存随世界／模式失效，连锁规则重核估计范围。UI被迫再建模拟时先缩承诺到合法性／直接效果，确需完整预演再扩。

[研究] **二改预注册**：加替换／范围模式，对照提示与结果；预览后改障碍、资源、目标再提交，核重验与失败反馈。反复查看取消无扣费／随机变化／奖励，部分成功显示范围。记规则分叉、显示例外及工时，人验可决策性。

[研究] **Unity／Unreal 共用这条信息契约**：复用项目已有命令／技能／建造查询，不要求 Unity 加 SO 框架或 UE 迁 GAS；没有提出引擎 API 或性能优劣结论。上述游戏不是 Unity／UE 同任务对照，也不证明单人无美术团队已能复现其整体质量。

[一手] OpenTTD文件头及[COPYING.md](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/COPYING.md)为GPL v2；不推荐直接复制进闭源底座。二改用例与体验／性能／工时仍未测。[研究]


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

[研究] 关键词先作候选事件，执行侧重核进度、角色权限与前置条件；输入按可知范围过滤，不能只提示保密。作者仍设计知识、线索与答案；这是契约推导，非Vaudeville内部审计。

### 4. 撤回条件与证据缺口

[研究] 固定内容足够则撤生成；开放表达是玩法本体时，固定回复只是有损降级。断网需明确暂停恢复、固定内容或独立本地配置，按设备／语言／质量验收；延迟含识别、排队、生成、播放，无横向数据可设统一门槛。

[研究] Steam单篇经公开HTTP核正文／日期，解析器只读到[公告合集](https://steamcommunity.com/app/2240920/announcements/)。同作者多公告不算独立样本；同题玩法与全程费用／支持成本对照仍缺，未下载模型或付费调用。

## 效果叠加补研：来源所有权不等于合并规则

核实：2026-10-15（UTC+8）。[研究] §7补来源与合并规则：其他来源仍有效或施放结束而毒应持续时，“取消就清标签”不足；先定谁维持、重复如何合并。

### 1. OpenRA：来源退出只撤自己的授予

[一手] 固定官方仓库 `e180e3225f3930272dd451917467631618f8976f`（提交日期 2026-10-11 UTC）；这是读取时主干，不宣称已发布稳定包。读取了如下完整链路，而非只凭框架接口推断真实使用：

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

[一手] 不同作者、回合制 roguelike 的官方仓库固定 `57a4e06a4caf162446d1c28caa7983f0493fecf0`（2026-10-06 UTC；提交说明为 v4.0.2 发行更新），核到实际消费而非仅凭命名：

- [Buff.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Buff.java)：append 创建新实例，affect 优先取同类现有实例；prolong 经 affect 后调用 postpone。按类 detach 会遍历该类效果全部撤销，不能当成某一次施放的独立释放
- [Actor.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java)：spend 增加调度时间，postpone 仅在原时间早于 now＋duration 时向后延。因此 prolong 是保留更晚结束点，不能从名字译成无条件时长相加
- [PotionOfHaste.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/potions/PotionOfHaste.java)实际使用 prolong；[FlavourBuff.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/FlavourBuff.java)到调度时刻 detach。这是单一可延期效果，不是每瓶药各建一层计时
- [PoisonDart.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/weapon/missiles/darts/PoisonDart.java)调用 affect(Poison).set；[Poison.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Poison.java)的 set 取 left 与新 duration 的最大值，另一个 extend 方法才加长；每次伤害由 left/3 的整数部分加一计算。到期或目标死亡 detach，存档保存 left

[研究] 独立层、max与sum会改变毒镖伤害和重复收益，配置改动也是平衡修改。由人选合并规则，不推广成所有毒都合一；回合调度不可直接换成帧时钟。

### 3. Unity 与 UE 的采用边界

[一手] [Unity 6.3 SO 手册](https://docs.unity3d.com/6000.3/Documentation/Manual/class-ScriptableObject.html)明确共享数据可由多个对象引用。[研究] Unity 默认沿既有角色组件持有活效果和来源，不把来源／剩余时长写回共享定义；两三个固定规则不需要通用效果编辑器。若本来已有合规的效果模块，先核它的合并键和移除范围，别另造名字相同、语义不同的一层。

[一手] UE 当前公开文档页面显示 5.8，GAS 对非 instant 效果的 [StackingType](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingType)将 None 定义为每次独立实例，而不是拒绝重复；AggregateBySource 与 AggregateByTarget 分别按来源、目标聚合。[持续时间策略](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingDurationP-?lang=en-US)区分刷新、不刷新、增加时长；[到期策略](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingExpiratio-)区分清整栈、减一层后刷新、仅刷新。已打开正确缩短路径的官方正文，不依赖最初失败的长 URL 或第三方教程。

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

[研究] **二改预注册**：追击停距基线增加同队敌人与堵门箱；同房间验目标反向、堵门移开、窄门会车、追击转攻击／眩晕、退出重启。记通路、目的地、期望／实际位移、停距与旧请求。

[研究] 真人核摆动、贴墙、急转、脚滑、挤叠及身体卡位；测查询与移动总成本。原生满足即停；让路导致越界、错停或破坏卡位时收窄／撤回，不继续叠平滑。AI补生命周期与轨迹，人定碰撞、停距和自然度。


## 关卡组合补研：连通之后还要选择什么

**核实：2026-10-15（UTC+8）；主线一／三，GC。** [研究] 05 §9：稳定动作空间先组合现有房间，地形探索可用受约束布局；数量／连通率不代体验，不要求自建框架或逐seed人审。

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

- **Factorio：规则服务玩家策略。** [一手：作者历史复盘] StrangePan／Earendel 的 [FFF425（2024-08-23）](https://www.factorio.com/blog/post/fff-425)说明，跨墙敌人若能攻击整个工厂，会逼玩家到处布防；于是用 Gleba 的孢子排放让敌人集中某些设施。它支持“已知规则能产生所需战术就保持规则”，不是效用／行为树之间的性能比较，更不是与 LLM 的实测胜负。正文中的脚本、评分、行为树分工是[研究]建议，不冒称 Factorio 使用了这三套系统。
- **Mantella：实际模组中的语义到动作接口。** [一手：固定源码] Python端固定 `c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac`（2026-07-16）；Skyrim端固定 `0c5f8513aff61cda1f32c81a962eee36ba74fdb7`（2026-07-11）。[Follow定义](https://github.com/art-from-the-machine/Mantella/blob/c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac/data/actions/follow.json)将被说服同行的角色列入 source，范围为 conversation，并明确标实验性、可能破坏 NPC AI packages。[研究] 借用“自由说服→指定角色同行”作为窄候选，不把其自然语言回复算行动结果，不声称这是完整原创商业游戏或已证实留存收益。
- **GoodAI：有物理动作仍不等于有好玩的挑战。** [一手：作者历史说明] [2024-04-29 FAQ](https://www.goodai.com/ai-people-announcing-the-next-evolution-of-gaming-ai-npcs/)说明环境／人物／记忆进入模型，动作由游戏执行，失败回传纠正；也承认角色会声称给了物品但世界没有发生。[2024-09-19 Alpha说明](https://www.goodai.com/ai-people-alpha-officially-released/)将其定位为技术概念验证，挑战有限、最初没有场景终局目标。[2025-04-30公告](https://www.goodai.com/ai-people-entered-the-closed-phase/)宣布无限期关闭当前版本并重新思考参与感；本次读取[现行入口](https://www.goodai.com/ai-in-games/)仍写封闭开发。[研究] 这些是作者自述和产品状态，不是证明“LLM导致关闭”的因果研究；不能以宣传中的新颖行为代替玩家价值，也不将该游戏列作现在可直接试玩的候选。

### 2. 固定调用链：required 与兼容回退为什么还不够

[一手：源码静读] 两个仓库分别固定，不假设当前主干组合是经过发布配对验证的版本。读取以下消费链，不只看 JSON 名称：

1. Python [function_manager.py](https://github.com/art-from-the-machine/Mantella/blob/c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac/src/actions/function_manager.py)的工具定义构造会传出 `required`，但 `_validate_arguments_against_schema` 只筛掉未知参数名，没有在这里验证必填齐全或类型。`parse_function_calls` 遇畸形 JSON 将参数置为空字典；空字典仍可生成只含 identifier 的工具结果。有效参数存在时则另有角色范围过滤。不能将函数名里的 validate 理解为完整契约验证。
2. Skyrim [MantellaConversation.psc](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaConversation.psc#L660-L708)按是否有 arguments 字典选择 advanced 或 legacy 事件。advanced [Follow处理器](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaAdvancedAction_Follow.psc)按 source 名称解析会话 Actor，再设置 WaitingForPlayer、faction，重启 follower quest、EvaluatePackage；真正的移动交给原有游戏系统。
3. 同版 [legacy处理器](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaAction_OffendForgiveFollow.psc)在会话可取得时遍历参与者，使符合条件的非玩家 NPC 跟随；只有会话不可取得才退到 speaker。它与路由处“缺参数回到 speaker-only”的注释并不等价。[研究] 这是静读可见的作用域扩大路径，未运行重现，不能声称玩家必然遇到；但足以拒绝“有白名单／JSON required就可安全执行”的采用理由。

[一手] 作者 [#441](https://github.com/art-from-the-machine/Mantella/issues/441)还记录过多人会话把 `Npcname: Follow:` 当台词念出来；2025-12-11注明由 [Spell #128](https://github.com/art-from-the-machine/Mantella-Spell/pull/128)修复并关闭。[研究] 不把历史问题报成当前未修，也不据关闭推定所有模型／多角色动作都已可靠；上述参数缺失路径是另一次固定源码核查。

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

- **组合操作与长期经营：按需帮助。** [一手：历史作者解释] Wube 的 [FFF361（2020-10-09）](https://www.factorio.com/blog/post/fff-361)展示逐页提示改成索引、搜索、按条件推荐，并统一微教程入口；基础物件说明仍优先在 tooltip 解释，tips 留给难解释的组合与真实误解。作者还指出静态截图会随更新过期，改用真实模拟演示。[研究] 借帮助的分工与回查机制，不要求独立开发者先造嵌入式模拟器；已有场景中的短演示能讲清就够。代价是持续维护触发、内容与示例，且通知可能被忽略。
- **自主探索：可选练习与能力提示。** [一手：开发中作者复盘] Mobius 的 [Filling Out The Toolbox（2016-05-27）](https://www.mobiusdigitalgames.com/news/filling-out-the-toolbox)描述 Outer Wilds 从强制工具操作链改为沿途可选练习：旧流程让玩家照做，进入开放世界却不知道下一步；作者于是强调可做什么，而非继续指定该做什么。同文明确承认可选教学会被跳过，多用途探测器尤其难教，补场景用途示意也只是设计意图。[研究] 适合寻找目标本身有价值的玩法，代价是漏学与练习空间的内容成本；这是作者观察，没有受控玩家结果，不能宣布自由教学普遍更好。

### 2. 固定实现：触发与已读不代表掌握

[一手：源码阅读] `wube/factorio-data@374934f81f82b09ec9fc459f92a316bd642ddd82`，提交日期 2026-10-06。已读以下消费链，不只引用字段名：

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

[一手：历史受控研究] Andersen 等 [The Impact of Tutorials on Games of Varying Complexity（CHI 2012，pp.59–68）](https://grail.cs.washington.edu/projects/game-abtesting/chi2012/chi2012.pdf)在 Refraction、Hello Worlds、Foldit 内随机分配新玩家的教程条件，比较情境提示、提前手册、锁定操作及按需帮助；跨游戏的复杂度没有随机操纵，操作范式与下载门槛不同，玩家经验及自选择人群也可能不同。帮助按钮的跨条件汇总未提供一致的收益证据，且 Hello Worlds 返回率的方向在 Table 3 与正文间不一致，不能据此为已有教学再叠加帮助入口；主要指标是时长、完成关卡与返回行为，不证明无指令情境中的主动使用或知识迁移。[研究] 因此把目标玩家经验与真实误解作为选型条件，不从复杂度或“可选”标签单独推导教学收益。这是 Flash 解谜／平台游戏与蛋白质折叠游戏时代的机制证据，不代表当前 AI 收益。

### 4. 窄二改预注册与撤回条件

[研究] **预注册**：选玩家能执行却不主动用的一项工具，比短提示／回查与可选练习。分记按指令完成、解释适用情境、无指令变形情境主动使用，不合成教程通过率。

[研究] 二改用途／操作后核说明、绑定、触发、前置与示例。漏硬前置就明确教；正式玩法要探索却只等任务，就减强制步骤、补回查；无真实误解保留物件说明。AI做局部触发与采集，人定必须教什么、留下什么发现。

**特有缺口 [研究]**：跨游戏设计比较不代同玩法对照；无学习／留存收益实测。建议与Unity／UE及联网无关。


## 辅助取舍补研：局部调整、整局预设与切回规则

核实：2026-10-15（UTC+8）；主线一／三／四。[研究] 05 §9按阻碍选局部辅助或整局预设，声明生效／关闭政策；依据为Dead Cells 29历史补丁及Cogmind设计、发布后回顾。

### 竞争选择与一手反例

- **即时动作的局部选择。** [一手：官方历史补丁] [Dead Cells 29 系列](https://deadcells.com/patchnotes/29)将按住跳跃／翻滚、盾牌切换及输入自定义与 Assist 选项分列；后者包含敌人伤害／血量、陷阱伤害、格挡窗口与陷阱速度等调整。29.2 修复关闭 Assist 后子选项仍生效；29.3 修复 Multiple Lives 下特定死亡软锁。它们说明菜单开关与实际规则、失败路径必须一起维护，不代表当前版本仍坏。该页另有读档后敌人／Boss 血量复满的修复，但未说明由 Assist 引起，不作因果归属，也不据此声称每种选项都可安全即时切换。[研究]
- **回合策略的整局选择。** [一手：作者设计说明] Kyzrati 的 [Adjustable Difficulty（2017-02-16）](https://www.gridsagegames.com/blog/2017/02/adjustable-difficulty/)为计分一致性限定难度下一局生效，榜单分模式；调整包括警戒压力、遭遇和出口信息，而非只有伤害倍率。作者区分仍希望练习标准玩法与主要希望探索内容的玩家，也提出低压力可能不迫使玩家学到标准模式所需应对。这是设计取舍与风险判断，不是学习实验或当前版本全部参数的核验。[研究]
- **可发现性有发布后反证。** [一手：作者观察] [Rebranding Difficulty Modes（2019-09-17）](https://www.gridsagegames.com/blog/2019/09/rebranding-difficulty-modes/)说明此前手册、选项菜单及死亡提示仍常被漏看，于是增加首次启动的显式选择，并改用 Explorer／Adventurer／Rogue 名称。[2022-05-08 回顾](https://www.gridsagegames.com/blog/2022/05/kyzratis-game-design-philosophy/)报告菜单加入后较易模式使用增加、仍为少数。这不证明单一命名改动的效果或留存收益。[研究]
- **信息边界。** [一手：同上2022回顾] 已警觉敌人位置曾向全体显示，因标准玩法优势过大从Rogue撤出。[研究] 既有信号可达与揭露未知位置分开，不由此取消标准模式必要提示或判所有轮廓越权。

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

- **当前可获知信息超出视口，补查看路径。** [一手：作者开发记录，2024-02-11] [Cogmind 放大视图 QoL](https://www.gridsagegames.com/blog/2024/02/adventures-in-map-zooming-part-5-qol/)展示放大后边缘标记、标记避开已显示机器人、按键聚焦敌群并返回。普通可见对象与传感器信息采用不同表现；标记范围以未放大窗口为基准，目的在于补回放大损失的信息。[研究] 适用于能在行动前查看局面的玩法，不证明实时战斗中频繁转移视图也安全；不把“在画面外”当作原本未知而自动揭示，也不建议复制全部 UI。
- **动作空间本身让玩家在看不到处受击，先改布局。** [一手：作者复盘，页面标注2020-01-21] [Specter of Torment 房间设计](https://www.yachtclubgames.com/blog/specter-of-torment-level-design-deep-dive-2-5/)用进房间过渡期间触手伸入画面、醒目颜色与运动介绍 Grapps；附近天花板阻止玩家从画面上方绕过而遭受屏外命中。作者还反对把伸出动作随意放慢：那会错误暗示能抢跑通过。[研究] 缺的是正确空间理解时，限制不合适的路线可比再加警报有效；但这种结构约束会缩小自由度，不能推广为所有游戏都应封路。
- **受限视野仍是核心玩法，改攻击的可应对性。** [一手：开发中团队访谈，2023-06-30] [Luna Abyss 设计者／程序员](https://www.unrealengine.com/developer-interviews/how-unreal-engine-empowered-a-small-team-to-build-luna-abyss-beautiful-bullet-hell-prison)说明第一人称弹幕须在玩家面向攻击者时从前方来；玩家可能背对攻击者，因此以慢弹或长预告留出转向观察时间，加上声音提示，并因身体边界不可见扩大弹幕间隙。[研究] 它与 Grapps 不能合并成“都放慢”：一个保住扫视与躲避时间，另一个需要快速明确地封住道路。文中“避免不可见伤害”为团队自述，未独立复测；不照搬具体速度或间距。

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

[一手：取得范围] 普通网页解析只返回标题，本轮通过 [Steam 官方 GetNewsForApp API](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2198150&count=100&maxlength=0&enddate=1737072000&feeds=steam_community_announcements)取得完整正文：appid `2198150`、gid `1788945554756976`、author `anopara`、timestamp `1736947659`，feed 为官方 community announcements。未以转载补足一手正文，也未运行游戏或播放公告动图。2024 年鼠标读取异常的修复不是本次支点设计调整，不合并因果。

### 2. OpenRCT2：同一支点契约下删除多余拾取，按钮另修

[一手] [#12831](https://github.com/OpenRCT2/OpenRCT2/issues/12831)报告 v0.3 在竖直地形面 zoom-to-cursor 时偏移，可用 Extreme Heights 地图边缘或抬高的 4×4 地形复现。[#25042](https://github.com/OpenRCT2/OpenRCT2/pull/25042)于 2025-08-27 合入，固定提交 [85a0f70ae166cb5d240844c4dffad7c1c9fbbd76](https://github.com/OpenRCT2/OpenRCT2/commit/85a0f70ae166cb5d240844c4dffad7c1c9fbbd76)。`src/openrct2/interface/Window.cpp` 旧路径把鼠标位置转地图坐标、查询高度，再围绕 tile 校正；新路径删除两个辅助函数，仅在 `ZoomToCursor && atCursor` 时按鼠标相对当前 viewport 的位置和前后缩放级别附加补偿 `savedViewPos`，随后同步 `viewPos`。作者明确目标仍是保持光标下的点，并未把默认改成中心。

[一手／研究] 这是二维等距视口补偿，不是3D射线算法；仅保屏幕指向时可省拾取，透视旋转仍须按需找世界支点。作者及他人的主／额外视口测试只支持该修复链。

[一手] 同日 [#25046](https://github.com/OpenRCT2/OpenRCT2/pull/25046)的固定提交 [e4f36840bff585b4a3f5581cd2b4714f887b2c02](https://github.com/OpenRCT2/OpenRCT2/commit/e4f36840bff585b4a3f5581cd2b4714f887b2c02)另修额外视口按钮：`src/openrct2-ui/windows/Viewport.cpp` 从直接增减 `viewport->zoom` 改为 `WindowZoomIn/Out(*this, false)`，接回完整中心缩放路径。[测试反馈](https://github.com/OpenRCT2/OpenRCT2/pull/25046#issuecomment-3228516256)称按钮改善而滚轮仍异常，作者指向 #25042；不能把任一入口成功当整个缩放功能通过。两个修复均进入 2025-09-06 发布的 [v0.4.26 官方发行说明](https://openrct2.io/blog/2025/09/openrct2-v0.4.26-released)，不是只引用开发分支。

### 3. 最小采用与二改验收

[研究] ✅ 在已有相机／视口入口声明支点政策：直接指向、视口中心或有限区域候选；统一坐标归属与完整变换路径，不统一所有入口的支点。Tiny Glade 的可切回是设置选择，不是射线未命中时自动回退的证据；本节不据此新增自动回退机制。

[研究] **二改预注册**：高塔／陡崖＋另一输入／视口按钮，核中心、边缘、背景、视口边界及滚轮／按钮两路径。关平滑仍错位先修选点、坐标、命令；正确但突兀才调过渡。无具体缺陷保留原方案，AI追变换，人验意图。

**边界 [一手／研究]**：OpenRCT2代码GPLv3；Tiny Glade公告不授复用权。本节只核公开API、网页、提交与讨论，非Unity／UE等价配置或游戏实测。

## 随机所有权补研：装饰二改是否改变玩法序列

核实：2026-10-16（UTC+8）；主线三，GC。[研究] 05 §6补合法表现随机的消费域：需复现玩法时按所有者隔离，区别于预览禁副作用及seed／生成器版本存档。

### 1. OpenRA：视口相关闪光的评审修正

[一手：维护者评审／合并源码] [PR #18711](https://github.com/OpenRA/OpenRA/pull/18711)新增宝石闪光。维护者在[具体评审](https://github.com/OpenRA/OpenRA/pull/18711#discussion_r711581362)指出：按客户端 `Viewport.AllVisibleCells` 调用 SharedRandom 会导致多人失同步，应改用 LocalRandom；[作者回复](https://github.com/OpenRA/OpenRA/pull/18711#discussion_r711729049)确认已处理。这是评审发现并纠正的风险，不能写成已发行故障统计或本轮复现。

[一手：固定源码] 2021-10-02 合并提交 `a13d04630469fcb994bbbc25e644b4e6b471017c` 的 [WithResourceAnimation L62–103](https://github.com/OpenRA/OpenRA/blob/a13d04630469fcb994bbbc25e644b4e6b471017c/OpenRA.Mods.Cnc/Traits/World/WithResourceAnimation.cs#L62-L103)把间隔、可见格筛选后的洗牌、比例与动画选择接到 LocalRandom；同提交 [Util L201–209](https://github.com/OpenRA/OpenRA/blob/a13d04630469fcb994bbbc25e644b4e6b471017c/OpenRA.Mods.Common/Util.cs#L201-L209)让范围采样显式接收生成器，不再在帮助函数中固定取世界 SharedRandom。[研究] 可借的是调用者明确传入所拥有的流，而不是搬运整个 RTS 架构。不能把全部声音／动画相关代码一律改为局部随机：是否影响权威状态及调用时机才是边界。

### 2. BrogueCE：单人显示与玩法也有不同消费域

[一手：固定源码] `tmewett/BrogueCE@104a20fedbe7d9360d2dfc8ff665571694212ad8`（2026-09-27 主干快照，非本轮确认的发行包）的 [Rogue.h L401–405](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/Rogue.h#L401-L405)区分 substantive／cosmetic；[Math.c L90–133](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/Math.c#L90-L133)保存两份状态并按当前域采样；[IO.c L1768–1805](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/IO.c#L1768-L1805)在颜色随机化前选 cosmetic，完成后恢复原域。[研究] 这为独立单人 roguelike 提供另一种隔离实现；本轮只确认该调用链，不证明所有路径均正确，也不建议在新项目照搬可变全局选择器。

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

- **Homebody，恐怖探索。** [一手：创作者自述] 主要系统／玩法程序员及技术设计者 Alex Belzer 的[项目页](https://www.alexbelzer.com/work/homebody)说明，他实现了远离玩家时加快巡逻的机制，并用盲角布局让玩家甩脱追逐或遇见敌人。[研究] 它支持通过巡逻与空间设计调节遭遇，未公开足以证明完整感知记忆的数据结构。页面对 Alien: Isolation、Resident Evil 2 的比较及公平性感受属于作者解释，不当作那两部游戏的原始实现证据，也不把他的 GOAP 选择升格为默认方案。
- **Shattered Pixel Dungeon，回合 roguelike。** [一手：固定源码] `57a4e06a4caf162446d1c28caa7983f0493fecf0` 的 [Mob.Hunting L1284–1324](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L1284-L1324)分开 enemy 对象与 target 格，在 enemyInFOV 时更新目标格，再向该格移动；[后续分支 L1345–1411](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L1345-L1411)在无法继续靠近且失去视野时转游荡，逃跑也可继续使用旧位置。[研究] 只借这些基类分支，不宣称所有怪物、子类或目标选择路径都不读取真值。
- **同项目的允许共享反例。** [一手] [processSwarmIntel L298–323](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L298-L323)在群体智能挑战、正在追猎并感知目标等条件满足时，把目标位置传给范围内未追猎的同阵营怪物。[研究] 因而不能把“不是亲眼看到”一律判错；队友报告可以是明确允许的信息来源，不要求各角色彼此隔绝。
- **Left 4 Dead，合作动作射击的全局调度反例。** [一手：Mike Booth／Valve，2009讲义] [The AI Systems of Left 4 Dead](https://cdn.akamai.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf)PDF 第69页按队伍不可见区域与敌人类型选择生成位置，第79–82页估算队伍压力、调节威胁数量，Relax 期间既存特殊感染者仍可攻击。[研究] 导演读取世界状态以组织遭遇，不等于每个角色都应取得持续精确定位；这也反对把全局位置访问一概定性为坏设计。材料不证明每只感染者的感知实现，不推荐单人项目搬整套导演，也不把历史团队经验算成本仓库实测。

### 原生入口：位置输入、感知状态与遗忘不是同一开关

- **Unity Behavior 1.0 文档渠道，本轮读取的节点契约。** [一手] [节点清单](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/manual/node-types.html)将 Navigate To Location 的指定位置与 Navigate To Target 的目标 GameObject 分开；两者使用 NavMeshAgent，缺少时可回退 Transform。[研究] 搜索沿既有位置变量，不由实时对象坐标隐式覆盖；这里只核输入类型，不宣称具体目标刷新频率、内置感知记忆或所有 Unity 版本等价，也不把1.0渠道称为最新发行版。
- **UE 5.8 当前官方文档。** [一手] [AI Perception](https://dev.epicgames.com/documentation/en-us/unreal-engine/ai-perception-in-unreal-engine)分别列 Get Currently Perceived Actors 与 Get Known Perceived Actors，刺激携带 Age、Expiration Age、Stimulus Location、Successfully Sensed；Forget Stale Actors 配合 Max Age 管理遗忘，0表示不遗忘。[Move To 任务](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-behavior-tree-node-reference-tasks)的 Track Moving Goal 会随着目标 Actor 移动更新路径。[研究] 搜索可切换到位置键，并核旧任务是否仍跟对象；不能认为感知丢失会自动清除自定义黑板或停止已有追踪。视线丢失也不代表听觉、队友报告或其他允许的线索同时失效。

### 采用、撤回与二改预注册

[研究] ✅ 有限情报改变选择才保存身份、已知位置、感知与按需线索年龄；声明覆盖、搜索、返回／追踪规则。导演提示有来源精度，读真值不授权角色搜索读真值。直接追踪是玩法或现有机制够用则不加记忆库。

[研究] **二改预注册**：追逐加拐角／诱饵，记来源、已知位置、移动目标，验失视后移动、别处声音、队友报告、重现及导演继续调压。允许追踪者不强制停追；记忆只降低响应却没产生所需选择就收窄／撤回。AI追读路径，人验躲避、搜索与压力。

**边界 [一手／研究]**：SPD文件头GPL-3.0-or-later，根[LICENSE.txt](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/LICENSE.txt)为GPLv3。公开网页／Valve讲义及选定链路不证明完整感知实现，最佳遗忘时长未知；共同政策只维护一份。

## 选敌补研：候选、保持与主动切换

核实：2026-10-16（UTC+8）。主线一／三，GC。[研究] 改变 05 §7 的选择：需要保持攻击意图时，先定义候选资格、旧目标与主动切换，不直接扩大辅助范围或每帧选最近。这里只处理玩家选敌；不重复 NPC 感知、输入死区与枪口遮挡，也不新增通用目标管理框架。

### 跨类型机制与反例

- **Cogmind，回合 roguelike。** [一手：开发者手册] 本轮读取的[官方文本](https://www.gridsagegames.com/cogmind/manual.txt)页头为 Beta 17.1，Targeting Behavior 节说明：按 `f` 进入开火模式时恢复最近目标，可以是机器人或空地；此前引导武器的路径点仍在视野内时一并恢复。没有旧目标或旧目标不再有效才选最近目标。前后循环按近到远，通常仅含有武装的敌对对象；没有此类可见对象时才循环所有非盟友对象。查看模式始终包括有／无武装的非盟友对象，可先在那里选中无武装目标再转开火。[研究] 这支持把自动候选和玩家可指定对象分开，并保留例外选择路径；不证明实时锁定算法、所有旧目标失效条件或通用保持阈值。搜索所得 booklet PDF 为 Beta 7，本节以重新读取的当前文本为准。
- **Hades，俯视动作，原作历史补丁。** [一手] [Early Access Patch 039，2020-01-28](https://www.supergiantgames.com/blog/hades-long-winter-update-patch-notes/)扩大 Adamant Rail 使用手柄时的 autolock radius；[Early Access Patch 044，2020-06-23](https://www.supergiantgames.com/blog/hades-the-blood-price-update-patch-notes/)让 Companion Rib 召唤出的 Skelly 不再被 Aim Assist 自动锁定。后一网页页眉写 March 1st，本节采用正文补丁节明确标注的 June 23，而非页眉日期。[研究] 两次分别修改范围与候选，反证辅助不能沿一个“越强越好”的方向调。这里只说该召唤物，不泛化所有友方／练习对象，不推断仍能手动攻击它，也不把原作历史规则写成 Hades II 或当前全武器规则；开发者未提供这两项调整的对照体验测量。
- **Brotato，生存动作。** [一手：官方商店描述] [Features](https://store.steampowered.com/app/1942280/Brotato/)分别写默认自动开火和手动瞄准选项。[研究] 可借的是开火自动化与瞄准控制分开选择；该描述不公开候选排序、目标保持或各平台设置细节，也不证明手动瞄准会关闭自动开火。
- **OpenRA，RTS 的距离反例。** [一手：固定发行源码] GitHub 标签 API 将 `release-20250330` 解析到提交 `b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787`。[AutoTarget.ChooseTarget L349–451](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Traits/AutoTarget.cs#L349-L451)先筛关系、类型、可见性与武器资格；不允许移动时核射程，不允许转向时核射界，最后先比较优先级，同级才比较距离。[研究] 这是自动选敌并非总选最近的具体实现，不证明所有显式命令永不被自动目标覆盖，也不是动作游戏锁定手感的证据；不搬整个 RTS 调度体系。

### 最小采用、撤回与二改预注册

[研究] ✅ 需保持意图时，沿输入／武器分定候选、保持、失效与主动改选，对象／位置均可。自动过滤挡住合法攻击时补直接选择；持续重选／精确瞄准本是玩法则保留，不强制双模式或统一评分阈值。

[研究] **二改预注册**：加更近干扰物／可攻击召唤物，验保持、改选、死亡／失效、候选外合法对象及允许的空地；支持模式切换才验切回。记输入、候选、目标、原因，区分选错与命中失败；保持妨碍改选时收窄，不能只加强吸附。

**边界 [一手／研究]**：OpenRA文件GPL-3.0-or-later；仅机制借鉴。官方手册、公告、商店与固定源码不证明体验／效率，政策与引擎无关。

## 意图预告补研：确定结果、条件变化与有意未知

主线一／三，GC；核实：2026-10-16（UTC+8）。
改变建议：05 §7 从看清起手进一步区分预告精度与有效条件，不把全知 UI 当默认质量升级。
新证据：Into the Breach 作者取向及预览／规则修订、Slay the Spire 意图设计、Amnesia 信息政策反例。[研究]

### 决策信息不等于完整行为表

- **确定结果服务局面求解。** [一手：设计者访谈] Justin Ma 在 [2018-02-23 访谈](https://www.gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-)把 Into the Breach 的敌方预告与减少随机性、解谜取向相连；保护建筑、牺牲机甲和推移提供不同解法。这是首发前的设计说明，不是发行后的受控评价。[研究] 当玩家要分配有限行动、改变已知攻击后果时，明确预告可作为候选；不推出所有类型都应采用，也不把局内攻击可预测说成整局没有随机性。
- **只呈现当前选择需要的信息。** [一手：作者原始视频转写] Slay the Spire 两位创始人的 [2019-05-02 访谈](https://arstechnica.com/video/watch/war-stories-slay-the-spire-war-stories/?c=series)说明：随机行动不预告使攻防难选，逐敌长文本又太繁重，后来改为意图图标；部分敌人会根据玩家行为改变意图。[研究] 支持决策粒度与条件变化，不证明所有敌人每张牌后即时重算，也不要求复制图标体系。
- **有意未知是另一种体验政策。** [一手：作者复盘] Thomas Grip 的 [2019-10-15 文章 Lesson 7](https://frictionalgames.com/2019-10-9-years-9-lessons-on-horror/)回顾 Amnesia 理智系统从较直白改得更含糊，以保留想象与紧张。[研究] 这是理智系统而非敌方下一招 UI，只用于反驳“规则越透明普遍越好”；作者观察不能证明隐藏攻击提高恐怖体验，更不能授权错误的确定性提示。

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

[研究] 记录显示所依据的状态、条件变化与最终执行；AI 可追条件消费和补回归，人决定哪些未知值得保留、预告能否支持所需决定。失真时先修条件同步、缩小显示承诺或简化规则；若信息堆积使当前选择更难读，退回必要粒度，不用更多字段充当质量提高。

**范围 [研究]**：公开访谈／公告，未读商业反编译代码；只支持设计、作者观察与历史维护，无通用体验排名。建议与引擎无关。

## 物品补研：数量栈、单件状态与转移身份

核实：2026-10-16（UTC+8）；主线三，GC。[研究] 05 §4增耐久／强化先核可互换性及拆分转移，不全改实体。比较OpenMW与Minetest Game／Luanti，后两者算同一生态；快照非稳定发行。

**OpenMW：保留状态不等于复制身份。** [一手] 固定 `9ec458174fa5a459b7910cd6990c1acc830b0b8a` 的实际消费者如下：

- [ActionTake](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/actiontake.cpp#L20-L40)的非拖放拾取路径加入容器、删除地面对象，并采用返回目标；[ItemModel.moveItem](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwgui/itemmodel.cpp#L58-L65)区分整堆转移与部分复制。未合并的整堆可沿用身份；合并返回目标栈，不能要求所有旧引用仍指向存活物品
- [ContainerStore.unstack／restack／stacks](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/containerstore.cpp#L315-L400)拆分时保留原栈指定数量，为余量另发 RefNum；合并时原项归零并返回存活栈。同定义只是必要条件：还核灵魂、剩余使用时间与传统物品脚本；有耐久者须都满耐久，有附魔充能者须都满充能。[研究] 因此两个都剩50%耐久也不能合并，是该项目政策，不是通用相等规则
- [装备入口](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/inventorystore.cpp#L162-L195)按类别拆一件，[弹药与投掷物](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwclass/weapon.cpp#L84-L105)允许装备时保持栈，不能写成所有装备都拆。普通装备在装备期间另受[合并限制](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/inventorystore.cpp#L547-L565)；[修理](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwmechanics/repair.cpp#L59-L70)恢复后尝试重合并。[灵魂捕获](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwmechanics/actors.cpp#L209-L214)实际采用拆一件、写灵魂、按同灵魂重合并，也反证新增状态不必永久禁堆叠

[一手] 维护证据不是假想风险：[2023拆堆另发身份](https://github.com/OpenMW/openmw/commit/0f608f388ef84db438eda67c06409dcd58056a1e)后，[2024-05-28修复](https://github.com/OpenMW/openmw/commit/ae4bf04798b3ad25a8490d448f8d53b06347e567)仍需处理跨容器拆堆丢灵魂：旧路径只凭定义 RefId 重造，新路径从实例模板复制。当前 [InventoryItemModel.copyItem](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwgui/inventoryitemmodel.cpp#L50-L65)与 [ManualRef](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/manualref.cpp#L101-L109)保留实例数据后清 RefNum／Lua脚本。[研究] 借的是“状态保留、身份不重复分别核”；清脚本是此项目的复制规则，不要求其他游戏拆分时丢弃脚本。GitLab原问题6148／MR2995本轮未取得正文，不据搜索摘要宣称原报告者复测。

**Minetest Game／Luanti：单件工具可用值式状态。** [一手] 游戏固定 `c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f`，[farming实际消费者](https://github.com/luanti-org/minetest_game/blob/c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f/mods/farming/api.lua#L59-L104)将锄头注册为 tool，使用后改 wear 并返回 ItemStack。Luanti 固定 `0e1414682e4be3ffb84d067d0621e98d6bf5cd76` 的 [ItemStack字段](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.h#L146-L154)为 name、count、wear、metadata，没有内置逐件 ID；[tool构造](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L30-L40)限数量1，[默认stack_max](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L721-L738)也是1。[拾取](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L383-L399)返回未收入背包的余量，[地面实体](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item_entity.lua#L325-L348)据此更新或删除；[拆分](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L484-L501)复制状态值后分数量，[跨槽／列表转移](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L826-L891)将余量放回来源；[持用工具](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L515-L538)读取、损耗后写回当前 ItemStack，而非沿用地面实体身份。

[一手／研究] **跨路径反例必须保留：** [stacksWith](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L401-L481)比较 name／wear／metadata，但同文件实际 addItem／itemFits 只比较 name 与 metadata；[掉落物合并](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item_entity.lua#L103-L138)才另比较 wear。耐久工具靠单件限制隔离，不能把函数名推成所有路径支持任意可堆叠耐久装备。[6057原报告](https://github.com/luanti-org/luanti/issues/6057)还指出空元数据使表面相同物品无法合并；[85d7b18修复](https://github.com/luanti-org/luanti/commit/85d7b18d851504e6d9f637c4373cf896b1ce8e4c)避免无内容时生成空键值。[已有单测](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/unittest/test_inventory.cpp#L39-L83)检查 tool 解析为 count=1 并保留 wear；本轮仅读定义，未运行，不能当全路径验收。

[研究] **二改预注册**：先复用支持每件／栈状态、数量／合并限制、余量／存活目标返回的背包。三把同型剑只改一把，转移拾回合并，核数量、状态及允许回堆后的旧引用。跨位置持续引用“这一件”才加身份，无法表达区别才局部扩展；AI追消费者，人定可互换政策。

**边界 [一手／研究]**：[OpenMW README](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/README.md#L4-L9)标GPLv3，运行Morrowind须自有游戏；[Luanti引擎](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/LICENSE.txt#L114-L132)为LGPL-2.1-or-later，[farming模块](https://github.com/luanti-org/minetest_game/blob/c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f/mods/farming/license.txt)源码单独MIT、媒体另有许可，不能以根许可代组件核查。未验上游用例／引擎集成，不作闭源即插底座。

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

[研究] **二改预注册**：沿交互／存档分历史、当前条件、推进入口。允许先取物后，验接取、暂存、交付消耗、离开保存恢复；提示匹配物品查询范围，永久完成不因消耗回退。持续携物／占领设计保可逆，不一律锁存；AI追路径，人定永久性。

**边界 [一手／研究]**：[Flare引擎](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/README.md#L28-L38)代码GPL-3.0-or-later；[Empyrean Campaign](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/README.md#L17-L25)数据／美术CC-BY-SA 3.0或后续，非引擎许可。SPD代码GPL-3.0-or-later；未验全部分支／保存故障恢复，政策与引擎无关。

## 效果时钟补研：调度时间、行动次数与到期显示

主线三，GC；核实：2026-10-16（UTC+8）。
改变建议：05 §7 持续效果按行动调度、指定次数或模拟时间选择；首末跳、到期与剩余显示一起定义，不把“声明时钟”简化为统一 N 秒。
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

[研究] **二改预注册**：毒增加移动加速，验快慢动作、等待、临界跳伤及行动机会；按次数承诺才按有效行动扣。即时版本在跳伤／到期前开普通菜单、暂停、切后台恢复，各依政策继续／冻结，冻结不补积压跳伤。记状态、时间／次数、UI边界，不以显示平滑代结算。

**边界 [一手／研究]**：SPD文件头GPL-3.0-or-later；Flare [README许可节](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/README.md#license)为GPLv3-or-later，内容[LICENSE.txt](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/LICENSE.txt)为CC-BY-SA 3.0。未核快照组合兼容或跨设备恢复；时间／行动政策只写一份。

## 效果读取时点：持续代价与一次承诺

主线三／GC；核实：2026-10-16（UTC+8）。[研究]
改变05 §7：二改加入临时增伤／换装时，按字段选择施加快照或动态读取，不让实例复用决定规则。[研究]
新证据：PoE 1.2.0、WoW 6.0.2的历史正式修订及2026单玩家显示反馈；不新增效果框架。[一手／社区]

**持续装备收益：代价应一起持续。** PoE [1.2.0正式补丁的General Balance Changes](https://www.pathofexile.com/forum/view-thread/998489)明确装备／支持宝石改变后，持续技能效果随之更新。[开发者说明](https://www.pathofexile.com/forum/view-thread/951414)（2014-06-18发布，10-10修订）指出：Mon’tregul’s Grasp本要在少量强僵尸与大量普通僵尸间取舍，快照换装却能保留强化而绕过代价，也使后续装备设计受限。作者承认修改会降低部分构筑强度，因此安排在赛季间；这是维护者的设计理由，不是玩家收益测量。[一手] 同文并非每个字段同步：既定生成等级需新召唤／进入新实例才更新；Righteous Fire拔掉技能仍持续，并分别处理装备、被动与支持宝石变化。不能从补丁中的“修复快照”推导所有持续效果都在每跳读取全部字段。[一手／研究]

**一次承诺：快照未必该撤。** WoW [2014年正式6.0.2公告的Periodic Effects](https://worldofwarcraft.blizzard.com/en-us/news/15682579/the-iron-tide-602-patch-notes)把普通周期效果改为逐跳重算，解释快照虽奖励择时，也造成插件依赖与平衡压力；但保留按上一击伤害比例延迟兑现、以及专门强化下一次技能的效果。动态读取保留增益期间的收益，却取消将短增益延长到整段DoT的收益，两种规则不是同一种技巧。[一手／研究] 同文另改刷新宽限至基础时长最后30%、重施最多延至130%；这只证明时长规则也需明确，不证明所有例外刷新时都保留旧强度。该公告仅支持历史修订与设计理由，不声称2026机制仍全部相同。[一手／研究]

**保留快照也要让刷新可判断。** [2026-03-22玩家原帖](https://us.forums.blizzard.com/en/wow/t/feral-feedback-snapshotting-is-hard-with-current-cooldown-manager/2278000)要求图标表达旧流血实际保留的强化，而不只显示当前增益与剩余时长。[社区] 这里只支持该玩家遇到的信息需求，不据其描述确认职业的全部现行规则，也不当作2014修订的前后对照或普遍体验结论。[研究]

**采用与撤回 [研究]**：沿实例按字段分已承诺值／动态依赖，刷新时长与强度分别定，需要比较才显示差异。快照造成换装仪式／规避持续代价就缩范围；动态读取毁掉强化攻击的延迟部分就恢复局部快照，不全回滚。未取得到期复用残留快照的独立修复链；不新增实测计划。

## 属性修饰补研：计算顺序与重算

核实：2026-10-16（UTC+8），主线三／GC。改变05第7节：效果所有权与层数不足以定义计算；首次和重建采用同一顺序，区分派生上限与已发生的资源变化。[研究]

**真实二改失败。** Wesnoth [#4419维护者例子](https://github.com/wesnoth/wesnoth/issues/4419#issuecomment-537258606)是先设最大HP为100，再增加100，得到200；重建按修改类型重排后却变100。[报告者补充](https://github.com/wesnoth/wesnoth/issues/4419#issuecomment-537261328)指出移除无关修改也可触发这种重建。[2020-08-20合入的#5085](https://github.com/wesnoth/wesnoth/pull/5085)改为沿修改记录顺序重放，不是把讨论中的每种候选都实现。[一手：公开维护链]

**固定消费者。** 1.18.5对应`7a60ccb925afadc8ae7d4f47891f5ab329786da8`，不称最新版本。[到期删除](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L1237-L1267)会进入重建，[恢复基础与应用修改](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L984-L1026)及[记录顺序](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L2583-L2594)吻合该政策。[当前HP等状态](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L186-L207)另保留并受新上限约束，不自动满血。实际[Strong特质](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/data/core/macros/traits.cfg#L128-L146)修改近战，[攻击字段处理](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/attack_type.cpp#L431-L445)后仍经[战斗计算](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/actions/attack.cpp#L182-L207)等后续规则，不能将基础字段当最终扣血。[一手：固定源码]

**没有通用倍率袋。** SPD 4.0.2固定`57a4e06a4caf162446d1c28caa7983f0493fecf0`，[萨满](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Shaman.java#L153-L170)实际授予虚弱／易伤；[攻击链](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L479-L512)先对攻击者虚弱乘0.67、经过取整与防御处理、扣护甲，再对目标易伤乘1.33，之后仍有攻击钩子、damage与护盾，不能称中间值为最终HP差。[治疗药](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/potions/PotionOfHealing.java#L76-L84)移除效果，下次攻击重查，不反算上一击。[一手／研究]

OpenRA `release-20250330`固定`b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787`，[实际等级规则](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/mods/ra/rules/defaults.yaml#L60-L83)影响伤害；[发射侧／装甲处理](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Warheads/DamageWarhead.cs#L73-L90)和[承伤侧处理](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Traits/Health.cs#L158-L189)分阶段，存在整数转换；禁用[DamageMultiplier](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Traits/Multipliers/DamageMultiplier.cs#L32-L35)返回100%。[历史乘算评审](https://github.com/OpenRA/OpenRA/pull/6079#discussion_r15618105)关于200%与50%回到100%的讨论起点是装填间隔，不伪称伤害bug；这里只支持计算语义须明确，不能推广为整个管线只取整一次。[一手／研究]

**二改预注册 [研究]**：A加入B，核首次／重建、删无关项、A到期、期间永久成长后撤临时效果；有意义的顺序保留。核小伤害、护甲、取整、降上限与当前HP，避免重算重复治疗／扣血，现有函数够用不加DSL。

**边界 [一手／研究]**：Wesnoth相关文件GPL-2.0-or-later，SPD／OpenRA为GPL-3.0-or-later。只核固定消费者与历史修复，不代表复现或当前全路径正确。


## 事件连锁补研：排队不代替防重入与操作边界

核实：2026-10-16（UTC+8）。主线三／GC；改变05§6的同步／排队选择：来源、防重入资格和完整操作边界分别决定，不因“解耦”统一延迟。新证据复用已完成的固定源码调查，再对照当前章节缺口；不是新增效果框架或游戏实测。[研究]

**DCSS：延后有具体边界。** 固定2952e12c52c2a66210f6c5488db987d0962a67ca的[反伤执行](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/fineff.cc#L1081-L1107)允许原防御者已死，但重核承受反伤者仍活着；[伤害入口](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/monster.cc#L4393-L4402)排除对派生反伤再次镜像。[2014修复](https://github.com/crawl/crawl/commit/4f3d0c6879f2baefcf3eb2749133ae3340dcbdca)针对来回反弹；[2024修复](https://github.com/crawl/crawl/commit/f4a7df68b9800669d3a70ac8d7dc9cc4f2eeb94b)把血箭冷却移到发射前，防反射重新触发齐射，该提交另有beam复用修复，不把全部崩溃归给重入。[一手]

[2020修复](https://github.com/crawl/crawl/commit/3dd439832fe0f5fe295caad1a2fe3e479a757cda)延后死亡爆炸以避免多目标攻击处理中攻击者被杀；[2021修复](https://github.com/crawl/crawl/commit/4e304d196c1d5a90fd7939a3cf94c2339bed27f0)又撤销每束beam后处理，因为多束法术尚未整体结束。[现行消费者](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/fineff.cc#L2133-L2147)从vector尾取出再执行，后进先出且继续处理新增效果，不能误称FIFO，更不能认为入待办便自动截断循环。[一手／研究]

**直接处理的反例。** SPD v4.0.2固定57a4e06的[LifeLink](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L830-L864)用派生来源类型避免再次分摊，[Skeleton](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Skeleton.java#L70-L141)直接处理死亡邻格伤害。[攻击链](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L483-L512)中的attackProc早于普通damage，因此规则钩子不能冒充HP已提交的事实通知；不改变正文DamageApplied在提交后通知的约定。[一手／研究]

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
