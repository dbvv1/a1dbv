# Gameplay 架构：让第二次修改仍然可靠

> 核实时间：2026-10-13 UTC（2026-10-14 UTC+8）。适用：单人程序开发独立游戏，Unity 为主、Unreal 作对照。固定源码、历史修改、许可与反证见 [WP11 研究记录](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md)；资源释放、存档实现与目标设备预算见[客户端模块](04-client-modules.md)，试玩方法见[验证页](02-verification-and-playtesting.md)。

**默认采用引擎现有组件、少量可测试规则和局部状态机；先写清谁拥有状态、谁提交结果、退出时清理什么，再决定是否增加框架。** HFSM、行为树、GAS 和 ECS 解决不同问题，不能按“先进程度”排成升级阶梯。[研究]

**主要限制**：本轮是源码与官方契约调查，未运行引擎或模型对照；采用判断仍须经同一玩法的第二次修改、目标平台构建与真人试玩验证。

## 30 秒结论：先保状态，再选框架

| 玩法需求 | 首选 | 升级触发 |
|---|---|---|
| 少量阶段、敌人和技能 | 原生组件、小状态机、定义与运行实例分离 | 共享层级退出逻辑增多时考虑 HFSM |
| 优先级决策与行为反复组合 | 现有行为树或 StateTree | 确有内容编辑收益，不因角色数量猜测 |
| 蓄力、受击、死亡与重开 | 明确打断、取消和唯一结算点 | 复杂标签/效果/预测才评估 GAS |
| 规模上升、CPU 超预算 | 先定位热点，局部 Jobs/Burst | 测量支持时再局部 ECS |
| 相机或关卡变化 | 现有相机、稳定内容 ID、可重置遭遇 | 流式世界需求出现后增系统 |

框架不能代替第二次修改验收；当前建议基于契约与源码，未证明真实项目净收益。[研究]

## 1. 先选够用的结构

[研究] 下面的“最佳质量”是复杂需求下的能力上限候选，并非同任务实测冠军；付费不代表更少出错，“本地／免费”也不免除引擎或依赖许可。✅ 采用，🧪 试用，👀 评估，⛔ 当前不用；质量档可以与免费档重合。

| 模块 | 最佳质量：复杂需求才增加 | 最佳性价比：单人默认 | 本地／免费与不采用边界 |
|---|---|---|---|
| 游戏循环 | ✅ 明确 Session 寿命，阶段嵌套时改造为层级状态 | ✅ 少量阶段＋引擎既有回调 | ✅ 同左；⛔ 自建通用引擎循环 |
| 状态与决策 | 🧪 优先级行为复用时用 Unity Behavior／UE BT、StateTree；👀 商业图工具 | ✅ 简单状态用 enum／小类；层级退出需求再采用 UnityHFSM | ✅ HFSM 为 MIT；⛔ 三种敌人先造图编辑器 |
| 数据配置 | ✅ 外部内容生产需要时改造表导入与校验 | ✅ 定义＋实例＋版本化存档，沿用 SO／DataAsset | ✅ 自有数据与已有序列化；⛔ 默认热更新后端 |
| 组件与 ECS | 🧪 数据规模和 CPU 预算需要时局部 ECS | ✅ 组件＋窄规则，热点先评估 Jobs/Burst | ✅ 现有组件；⛔ 只为“可扩展”全工程迁移 |
| 事件 | ✅ 必要时增加类型化队列与重入控制 | ✅ 局部调用、跨模块事实通知 | ✅ C# events／UE delegates；⛔ 全局字符串总线 |
| 战斗技能 | 🧪 UE 复杂效果、标签、属性或预测需求用 GAS | ✅ 小型技能定义＋执行实例＋唯一结算点 | ✅ 引擎组件；⛔ 为几招复刻完整 GAS |
| 相机 | ✅ Cinemachine／UE 原生相机，再加玩法特例 | ✅ 同左；固定镜头足够时更简单 | ✅ 按引擎条款使用；⛔ 自研通用相机框架 |
| 关卡 | 🧪 流式世界需求出现后采用对应系统 | ✅ 可重置遭遇、模块化房间、稳定内容 ID | ✅ Scene／Level；⛔ 小关卡先建大世界平台 |

[研究] 这取代“先选一个大而全框架，再把玩法填进去”的做法。只有反复出现的行为组合、真实内容编辑需求或测得的规模瓶颈让小方案失去优势时才升级；第三方版本和许可改变时重新评估，不因新版本发布就重架构。

## 2. 游戏循环：一局结束要真的结束

[研究] **做到哪**：按玩法保留 Boot、FrontEnd、Loading、Playing、Paused、Results 中必要的阶段；暂停可以是 Playing 的子状态。一个 Session／Run 所有者负责本局对象、计时器、临时奖励、订阅和任务。常驻设置、存档服务与本局状态分开，重开创建新局而非到处重置布尔值。

- **可以省**：通用 GameManager 继承树、替换整个 PlayerLoop、单机不需要的服务器会话层
- **AI 可承担**：沿现有代码补阶段、转换日志、重开清理与回归测试；人决定暂停时哪些时钟、输入和表现继续运行
- **典型失败**：动画暂停而技能计时继续；旧局延迟奖励写进新局；胜利和失败各结算一次
- **验证**：正常结算、失败、暂停重试、加载中退出；每局最多结算一次，旧回调不改变新局，重复重开后对象和订阅回到基线

[一手] UE 已有寿命边界：GameInstance 跨关卡，GameMode 随关卡创建，Pawn 与 Controller 分工；沿用它们比另建持久化总管更合适。[Gameplay Framework](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-framework-in-unreal-engine) [研究] Unity 同样沿用 Update／FixedUpdate；物理、UI、相机分别声明时钟，常驻服务不保留已卸载世界的对象引用。

## 3. 状态机与行为树：先定义打断关系

[研究] **做到哪**：每个状态有入口、出口、结束条件、打断优先级与清理动作。Idle／Pursue／Attack／Dead 可用小状态机；共享父层规则和退出等待明显增加时用 HFSM；多个优先级目标、复用子树和运行中重选真正改善内容生产时才用行为树。

- **可以省**：简单敌人的图编辑器，同时维护 HFSM、BT、GOAP 三套决策
- **AI 可承担**：实现状态／任务、条件、调试输出和组合测试；人决定攻击承诺窗口与敌人可读性
- **典型失败**：把入口条件当持续条件；状态退出后 MoveTo 仍改速度；目标消失却永远 Running；死亡也等不可结束的动画
- **验证**：死亡／眩晕打断、不可打断窗口后退出、导航不可达、目标销毁、禁用再启用；检查活状态路径与清理结果，不只看图上节点变色

[一手] UnityHFSM [#71](https://github.com/Inspiaaa/UnityHFSM/issues/71) 是直接反例：把 `needsExitTime` 等改只读破坏了真实运行期配置需求，2.3 又恢复可变并明确生效时机。[修复](https://github.com/Inspiaaa/UnityHFSM/commit/94f316fdae5be5abe964f70355bbb697274d38c0) [研究] AI 不应以“最佳实践清理”为由更改既有状态契约。

[一手] Unity Behavior [1.0.16](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/changelog/CHANGELOG.html) 新增 OnSetup／OnTeardown，并修复不可达导航持续 Running 等问题。UE [BT](https://dev.epicgames.com/documentation/en-us/unreal-engine/behavior-tree-in-unreal-engine---overview) 有事件驱动的观察／打断；[StateTree](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-state-tree-in-unreal-engine) 以转换触发选状态，同状态任务并发，完成转换不应被理解为自动等待全部任务。[研究] 选择已有体系并锁定版本，不能把所有图工具的 abort、重入和完成语义视为相同。

## 4. 数据驱动：定义、实例、存档分开

[研究] **做到哪**：定义层保存稳定内容 ID、初始参数与资产引用；实例层保存 HP、冷却、目标和当前阶段；存档层保存可迁移快照与 schemaVersion。沿用 ScriptableObject、DataAsset、DataTable 或已有 CSV 管线，补 ID 唯一性、引用完整性和范围校验即可。

- **可以省**：每个整数都做 SO、默认配置热更新、通用反射 ORM、自建 mod 语言
- **AI 可承担**：定义类型、导入校验、旧数据迁移和夹具；人决定数值与内容修改对既有存档的含义
- **典型失败**：共享技能定义写当前冷却；用数组序号当存档 ID；字段改名丢序列化引用；两只敌人共享血量
- **验证**：同一定义生成两个实例，只伤害一个；新开局定义不污染；v1 存档载入 v2；分别声明修改即时生效、下次生成生效或仅新局生效

[一手] Chop Chop 的 [TransitionTableSO](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/UOP1_Project/Assets/Scripts/StateMachine/ScriptableObjects/TransitionTableSO.cs) 每个状态机创建运行实例字典，[StateActionSO](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/UOP1_Project/Assets/Scripts/StateMachine/ScriptableObjects/StateActionSO.cs) 从定义生成普通动作实例；不是所有角色共用一份可变 SO。[后续健康管理修改](https://github.com/UnityTechnologies/open-project-1/commit/753c30e6fda71c6024c69ee5704b71cfa110e160) 将初始血量写入限制到新建实例分支，避免 Awake 重置既有玩家状态。[研究] 可借这个区分，不必借整套编辑器。

## 5. 组件与 ECS：迁移热点，不迁移口号

[研究] **做到哪**：MonoBehaviour／ActorComponent 处理引擎对象，普通类和函数承担可独立测的规则。只有玩法确实需要大群同构计算，且目标设备 CPU 预算表明现有结构不足时，才比较局部 Jobs/Burst 与 ECS；渲染、蒙皮、碰撞或寻路热点先各自定位。

- **可以省**：UI、对话和相机一起 ECS；只因“可能有很多对象”预建实体世界；单机默认锁步和回滚
- **AI 可承担**：在已定边界内改批处理、数据布局、查询与 profiler 标记；人定设备、规模和预算
- **典型失败**：每帧增删组件制造结构变更；漏依赖；把 ECB 录制当已应用；忽略禁用组件的查询过滤
- **验证**：同玩法、资产、设备比较组件基线／局部 Jobs／ECS，测 P95/P99 CPU 帧时间、同步点、内存和第二次修改工时，不承诺通用对象数量阈值

[一手] 官方 [StateChange 样例](https://github.com/Unity-Technologies/EntityComponentSystemSamples/blob/6786a741ee1f118ed14cecfa02beae8e926937b0/Dots101/Entities101/Assets/HelloCube/13.%20StateChange/SetStateSystem.cs) 可借来比较值、结构变更与 enableable 三种状态表示；其测量用强制 Complete 不应照搬生产循环；局部计时中结构变更只录制 ECB，实际 playback 在后，因此公平对照还要纳入 playback 与相关后续系统成本。Entities [enableable 文档](https://docs.unity3d.com/Packages/com.unity.entities@1.4/manual/components-enableable-use.html) 明确它避免 archetype 变更，却不保证相关主线程查询无需等待。

[一手] [V Rising 的 Unity 案例](https://unity.com/resources/stunlock-studios-v-rising) 支持 ECS 用于商业大世界，也记录了搭建底座和团队适应成本。[研究] 这是条件成立时值得投入的例子，不是单人默认全 ECS 的证据；数据导向确有明确需求时可以早评估，但应保留测量与撤回条件。

## 6. 事件：命令有负责人，事实才广播

[研究] **做到哪**：同一对象内直接调用；跨模块有多个观察者时使用类型化事件。一次命令有明确处理者和成功／失败结果；DamageApplied、EnemyDied 在状态提交后通知 UI、音效与任务。声明同步／排队、顺序、重入和丢弃策略；Inspector 装配确有收益才增加 SO 事件通道。

- **可以省**：全局字符串 EventBus、完整事件溯源、每属性一个广播
- **AI 可承担**：类型化事件、订阅配对、日志和重复触发测试；人决定是否能丢消息、重复命中如何计算
- **典型失败**：匿名 lambda 退订失败；回调重入导致双奖励；晚加入 UI 丢初始值；跨场景携带旧对象
- **验证**：重复死亡只结算一次；监听者回调中退出安全；池对象多次启停每次只收一次；晚加入 UI 先读快照。需要时用 session／操作身份拒绝旧事件，不把所有局部函数都复杂化

[一手] [Unity 官方事件通道例子](https://unity.com/how-to/scriptableobjects-event-channels-game-code) 要求订阅／退订配对，SO 通道是项目级资产。[研究] 换场景不会自动证明旧监听已清除；“解耦”也不意味着无人拥有事务结果。

## 7. 战斗与技能：先统一结算，再决定 GAS

[研究] **做到哪**：请求→合法性／资源检查→启动及承诺成本→命中→伤害／效果提交→结束或取消。每步只有一个结算所有者；动画事件可开命中窗口，但迟到的事件在取消、死亡、换场景后失效。Unity 小项目先用技能定义＋执行实例＋少量组件；已有许可清楚且适配玩法的模块优先复用，只补缺失契约。

- **GAS 值得何时采用**：UE 中效果叠层、属性计算、标签互斥、费用／冷却和必要的网络预测反复出现，统一模型开始比零散实现便宜；复杂单机 RPG 也可能适合，不按技能数或联网与否设死门槛
- **可以省**：几种固定动作先建通用公式 DSL／效果编辑器；Unity 为名称一致复刻 UE GAS；单机引入所有预测同步
- **AI 可承担**：规则、状态转换、效果参数、取消路径与测试；人决定承诺窗口、资源退款、命中和手感
- **典型失败**：费用两次提交；取消遗漏标签／命中盒／移动锁；复用执行实例残留上次目标；重生重复授予；动画和逻辑各扣一次血
- **验证**：准备、承诺、命中、恢复各阶段插入死亡／眩晕／目标失效／卸载，核费用、冷却、伤害和奖励次数；有网络需求才额外测延迟、丢包与预测回滚

[一手] GAS [官方生命周期](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-abilities-in-unreal-engine) 将 CommitAbility、取消和 EndAbility 分开；未正常结束会继续阻挡动作，Per-Actor 实例复用还需清理成员。[研究] 框架没有替玩法定义退款与取消语义。

[一手] [Lyra 的能力初始化](https://dev.epicgames.com/documentation/unreal-engine/abilities-in-lyra-in-unreal-engine?lang=en-US) 处理 Pawn、PlayerState、输入与 Game Feature 的就绪和移除。[研究] 可读公开机制文档；其整套多人生命周期并非单机默认底座，资源的 AI 使用许可另见第 10 节。

## 8. 相机：先让玩家看懂并控得住，再增加镜头语言

[研究] **质量目标**：玩家在做决定前看见落点、威胁和路线；移动、瞄准与屏幕变化有可预测的关系；镜头把注意力引到重要动作，又不抢走控制。固定镜头／简单跟随能做到这些就是合格基线，不以更多阻尼、震动或自动运镜代表高级。Unity 默认复用匹配项目版本的 Cinemachine，UE 先沿用 CameraComponent／SpringArm／PlayerCameraManager；只补玩法特例。

下表是交叉来源后的采用判断，**不是三种玩法的实测排名**。[研究]

| 场景与玩家需要 | 默认采用 | 何时调整；不值得增加什么 |
|---|---|---|
| 精确平台跳跃：起跳前读落点，空中保留高度参照 | ✅ 房间固定取景，或 Position Composer＋适度死区＋房间边界；水平与垂直分别调 | 长距离冲刺看不清前方才加有界前瞻；落下看不到落点才加下视规则。不要让每次小跳都拖整个背景上下动，也不把速度预测绑到抖动骨骼 |
| 俯视战斗／小型竞技场：读围攻方向、攻击预告与逃路 | ✅ 固定朝向和稳定尺度，有限跟随；只在确有需要时加入目标偏移 | Boss／双目标无法同屏时试 Target Group＋Group Framing，并限制缩放。把所有敌人纳入构图会被远处杂兵拉远；角色和预告过小就退回固定尺度或改遭遇布局 |
| 越肩射击／3D 探索：控制观察方向，瞄准与实际命中可信 | ✅ Third Person Follow，瞄准需要时加 Third Person Aim；输入方向与角色动画分离 | 窄角落先调遮挡层、相机半径和进出碰撞响应；关卡仍无可用视线时改空间或局部遮挡表现。不要靠不断自动绕行／换肩替玩家瞄准 |

[一手] 当前 [Unity 6.0 包页](https://docs.unity.com/en-us/engine/6000.0/manual/packages-list/packages-all/pack-safe/com-unity-cinemachine)列出的发布版为 **3.1.7**，不是主干预发布版。[Position Composer](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachinePositionComposer.html)明确前瞻可能放大动画噪声，平滑预测又增加滞后；[Group Framing](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineGroupFraming.html)提供变焦／移动构图。[研究] 先改善取景和输入响应，再补阻尼；一味拉远虽能装下对象，却可能降低战斗可读性。

**三个容易漏掉的体验契约：**

- **转镜不应偷偷改变正在执行的意图。** [Celeste64 固定源码](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L1474-L1487)在攀爬持续按方向时保持输入映射，松开后才重算；垂直跟随也区分着地、下降与高度窗。[一手] ✅ 借这种局部机制，勿将它推广成所有地面移动都锁方向；已发布 jam 的代码不是长期架构或舒适度实测。
- **准星是命中承诺。** [Third Person Aim](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineThirdPersonAim.html)处理相机与角色起点的视差；实际枪口和弹道仍由游戏负责。[研究] 掩体边缘要分别验“镜头看得见”和“枪口打得到”，不要为了稳定准星把有意设计的后坐力也全部抵消。鼠标位移与摇杆速率分别处理，别重复乘帧时间；[Input Axis Controller](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineInputAxisController.html)已有对应选项。[一手]
- **切镜服务意图，舒适度能退出。** [研究] 揭示谜题可用缓动，瞬移／重生通常应重置而非追过半张地图；战斗中长混合不能让玩家失去落点或瞄准控制。震动、摆动、运动模糊及非必要自动回正应可减弱／关闭；视野与横纵灵敏度按玩法提供调整，依据 [Xbox XAG 117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117)，不承诺某组参数适合所有人。[一手]

**维护与验收**：[研究] 一个视口由一个最终输出控制者拥有；跟随／瞄准／过场／菜单的优先级、时钟、传送重置、退出恢复写在少量模式配置中，技能只请求效果，不各自写 Camera transform。相机更新阶段要匹配跟随目标的实际移动方式，不统一指定 Fixed 或 Late；同时检查目标插值与镜头平滑叠加的滞后。AI 可实现绑定、状态切换、参数暴露与轨迹记录；人决定取景、力度、节奏。后续真人试玩观察：起跳前能否指出落点、转向后威胁是否及时进入视野、绕柱是否反复拉近拉远、持续输入穿过切镜是否仍按预期移动、关闭镜头效果后是否仍读得懂命中。并保留低帧率、不同固定步长、暂停、重生、过场取消测试；这些观察尚非实测收益。

[一手] Cinemachine [Brain 源码](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Behaviours/CinemachineBrain.cs)区分更新阶段；2026-08 的 [#1122 修复](https://github.com/Unity-Technologies/com.unity.cinemachine/commit/69b205115495a374fbba329547ba608cdcfe7847)将 static reset 提前到 SubsystemRegistration 并重建事件，主干 changelog 归入 3.1.8-pre.2。[研究] 不据此宣称稳定 3.1.7 已含修复。Cinemachine 源码按 Unity Companion License 使用；Celeste64 的 MIT Source 与其 IP／Content 授权分开，详见 [WP11 镜头补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#镜头质量补研从跟得上到看得懂控得住)。

## 9. 关卡：先能重置遭遇，再扩成大世界

[研究] **做到哪**：关卡定义含稳定 ID、入口、目标和出生表；运行中的 Encounter 拥有所生对象、触发状态和一次性奖励；跨关卡完成标记属于存档域。玩法 ready 与场景加载完成区分，退出有取消／清理钩子。

- **可以省**：小房间游戏的大世界分区、自建关卡编辑器、以随机生成代替关卡设计
- **AI 可承担**：按既定规则组装模块化房间、校验可达性、生成测试场景；人决定节奏、路线与资源可读性
- **典型失败**：门永等已销毁敌人的事件；检查点保存运行实例；改生成顺序让相同 seed 变布局；重建内容丢 ID
- **验证**：逐检查点恢复、完成后离开重返、完成事件重复、出生点被占、最后敌人意外离场；核出口、目标与关键资源可达。程序化地图记录生成器版本，不能只保存 seed 就保证升级兼容

[一手] 已发布的 [Daggerfall Unity EnemyMotor](https://github.com/Interkarma/daggerfall-unity/blob/2343305d1d83ccc0de57a81e3b1e61188a997e34/Assets/Scripts/Game/EnemyMotor.cs) 仍按明确顺序处理具体行为，并随 [mod 扩展需求](https://github.com/Interkarma/daggerfall-unity/commit/0519cee99740d4005ef70b99a3a064ac0655ce72) 增加回调。[研究] 大型可玩游戏不要求每层都通用化；其历史兼容、巨型类和原版资源依赖也不宜整套继承。

## 10. 复用与许可：公开可读不等于任意可复制或可输入 AI

[一手＋研究] 下表是选型门槛，完整许可、维护状态和实际采用边界在[研究记录](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md)。软件与素材分开核，不复制第三方美术／音频来填充原创商用游戏。

| 对象 | 采用边界 |
|---|---|
| UnityHFSM | MIT；保留版权／许可，固定版本并回归退出行为；未核具体商业游戏采用 |
| Chop Chop | 根 Apache-2.0，依赖／素材另核；2021-12 停止开发、面向 Unity 2020.3，学机制，不当现行工程底座 |
| Daggerfall Unity | 项目代码 MIT；原版贴图、模型、音频不由此获得许可，不能直接当原创资源包 |
| Cinemachine／Entities Samples | Unity Companion License，与有效 Unity 引擎许可及通知义务相关，不能标为任意跨引擎 MIT |
| Unity Behavior 1.0.16 | 官方 LICENSE 指向 Unity Terms of Service，不是 MIT／UCL；按实际包与计划核权限 |
| GAS／UE 原生模块 | UE 引擎条款；源码可见不是开源，商业发行条件另核 |
| Lyra | Fab 明写 UE-Only，同时显示 Allows usage with AI: No；不作为可直接全量喂给 Agent 的默认样例 |
| Behavior Designer Pro | 商业候选，2026-10-02 自定义 EULA 有席位、营收／融资与订阅条件；付费源码未读，不按宣传认定胜过免费方案 |

[一手] Lyra [Fab 页](https://www.fab.com/listings/93faede1-4434-47c0-85f1-bf27c0820ad0) 的 UE-Only 只说明引擎使用范围；[Epic Content License §17](https://www.unrealengine.com/eula/content) 对适用的 NoAI Content 还限制生成式 AI 输入等用途。[研究] 具体文件与取得时的许可链应分别核实，不能用非官方源码镜像绕过，也不能反推所有 UE 开发禁止 AI。

[一手] Opsive 的 [EULA](https://opsive.com/solutions/decision-solution/behavior-designer-pro/eula/) 将订阅到期后的源码使用与对象码使用分开；[购买页](https://opsive.com/assets/behavior-designer-pro/)与合同的席位、收入／融资资格措辞不完全一致。[研究] 商业图工具只有确实减少长期行为编写／调试成本才值得评估，采购前须取得具体 SKU／席位资格书面确认，不能默认单人 $145 足够；融资后的费用及源码维护权利都进入总成本。详见 [WP11 动态补核](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#阶段-f-商业资格与版本补核)。

## 11. 给 AI 第二次修改的最小契约

[研究] 不先加工具或大模板：提供相关代码、精确包版本、关联资产／节点、已有回归夹具，再用短说明写清六件事：

1. 定义与运行实例分离，谁创建、复用和销毁
2. 状态寿命是项目、存档、Session、场景、角色还是一次施放；计时器用哪个时钟
3. 谁提交伤害、奖励、库存变化；谁只观察；事件同步还是排队
4. 正常结束、取消、死亡、卸载、池回收各要清理什么
5. 内容 ID、序列化字段和旧存档怎样保持或迁移
6. 本项目对依赖做过哪些改造，哪些时序不能“顺手优化”

[研究] **推荐第二次修改题**：把单段冲刺攻击改为“可蓄力、受击中断、按承诺规则扣资源，并能从检查点重开”。它会同时触及实例状态、取消、命中、动画晚事件、相机和关卡重置，比增加一个同类技能更能检验架构。记录改动文件、资产引用、主动工时与回归失败；由人决定手感和趣味性，自动测试负责状态契约。
