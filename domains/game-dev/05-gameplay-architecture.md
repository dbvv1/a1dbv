# Gameplay 架构：让第二次修改仍然可靠

> 更新：2026-10-16（UTC+8）

适用：单人程序开发独立游戏，Unity 为主、Unreal 作对照。

**默认采用引擎现有组件、少量可测试规则和局部状态机；先写清谁拥有状态、谁提交结果、退出时清理什么，再决定是否增加框架。** HFSM、行为树、GAS 和 ECS 解决不同问题，不能按“先进程度”排成升级阶梯。[研究]

**主要限制**：这些建议基于源码与官方契约；实际采用仍须经过同一玩法的第二次修改、目标平台构建与真人试玩。

## 30 秒结论：先保状态，再选框架

| 玩法需求 | 首选 | 升级触发 |
|---|---|---|
| 少量阶段、敌人和技能 | 原生组件、小状态机、定义与运行实例分离 | 共享层级退出逻辑增多时考虑 HFSM |
| 优先级决策与行为反复组合 | 现有行为树或 StateTree | 确有内容编辑收益，不因角色数量猜测 |
| 追击、让路与动态堵门 | 原生导航；分开通路、局部避让、停距与位移所有者 | 原生行为不满足玩法或测得查询／人群成本后再扩展 |
| 蓄力、受击、死亡与重开 | 明确打断、取消、唯一结算点；多来源效果先定合并与撤销规则 | 复杂标签/效果/预测才评估 GAS |
| 规模上升、CPU 超预算 | 先定位热点；Unity 可局部 Jobs/Burst | 测量支持时再局部 ECS |
| 扩充随机关卡 | 稳定动作空间用有用途的房间组合；地形探索用受约束的程序布局 | 连通后还要核路线、遭遇与资源机会，不以布局数量升级 |
| 相机或关卡变化 | 现有相机、稳定内容 ID、可重置遭遇 | 流式世界需求出现后增系统 |

框架不能代替第二次修改验收；当前建议基于契约与源码，未证明真实项目净收益。[研究]

## 1. 先选够用的结构

[研究] 下面的“最佳质量”是复杂需求下的能力上限候选，并非同任务实测冠军；付费不代表更少出错，“本地／免费”也不免除引擎或依赖许可。✅ 采用，🧪 试用，👀 评估，⛔ 当前不用；质量档可以与免费档重合。

| 模块 | 最佳质量：复杂需求才增加 | 最佳性价比：单人默认 | 本地／免费与不采用边界 |
|---|---|---|---|
| 游戏循环 | ✅ 明确 Session 寿命，阶段嵌套时改造为层级状态 | ✅ 少量阶段＋引擎既有回调 | ✅ 同左；⛔ 自建通用引擎循环 |
| 状态与决策 | 🧪 优先级行为复用时用 Unity Behavior／UE BT、StateTree；👀 商业图工具 | ✅ 简单状态用 enum／小类；层级退出需求再采用 UnityHFSM | ✅ HFSM 为 MIT；⛔ 三种敌人先造图编辑器 |
| 数据配置 | ✅ 外部内容生产需要时改造表导入与校验 | ✅ 定义＋实例＋版本化存档，沿用 SO／DataAsset | ✅ 自有数据与已有序列化；⛔ 默认热更新后端 |
| 组件与 ECS | 🧪 数据规模和 CPU 预算需要时局部 ECS | ✅ 组件＋窄规则，Unity 热点先评估 Jobs/Burst | ✅ 现有组件；⛔ 只为“可扩展”全工程迁移 |
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

### 感知与搜索：持有目标不等于知道当前位置

**[研究] ✅ 躲避／误导敌人属于玩法时，分开目标身份、最近获知的位置与当前感知状态。** 沿现有状态机／黑板保存已知位置，由允许的视听、队友报告或特殊追踪规则更新；搜索阶段不要因仍持有玩家对象，就持续读取其当前位置。Shattered Pixel Dungeon 的普通追猎区分目标对象与目标格，群体智能模式又明确允许传递位置。[一手] 不必新增记忆框架，也不要求失去视线立即忘记目标。

- **Unity**：[Behavior 1.0 节点](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/manual/node-types.html)区分 Navigate To Location 与 Navigate To Target。[一手／研究] 搜索已知位置时用位置输入，并查上游是否仍每帧从玩家 Transform 刷新；节点选择本身不替玩法实现感知
- **UE**：[AI Perception](https://dev.epicgames.com/documentation/en-us/unreal-engine/ai-perception-in-unreal-engine)区分当前感知、已知目标及刺激位置／年龄；[Move To](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-behavior-tree-node-reference-tasks)的 Track Moving Goal 会随目标 Actor 移动更新路径。[一手／研究] 失去感知后检查移动任务是否仍跟踪对象，搜索可切到位置键；需要自动遗忘才配置 Forget Stale Actors 与 Max Age，不能只改一个感知标志就当作停止追踪

**[研究] 局限：全局调度与角色感知承担不同职责，没有通用“所有敌人都必须忘记玩家”的规则。** Left 4 Dead 的导演按队伍位置与压力组织遭遇；有意提供追踪或队友线索可以保留，但要明确何种信息允许进入角色决策。二改增加隐蔽路线／诱饵后，核实际移动目标、线索来源与重新发现；直接追踪本来就是玩法时，保留简单跟随。固定源码、创作者对照、遗忘配置与未运行的验收见 [WP11 感知补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#感知补研角色知道什么与导演调度什么)。

### 追击与让路：有路径不等于走得自然

**[研究] ✅ 先复用原生导航，分清通路、局部避让、停止位置和最终位移所有者。** 近邻临时挡路先用已有避让；门／箱子改变可通行区域时更新导航表示；近身战另定停距、侧移与是否允许身体卡位，不让所有敌人挤向目标中心。目标更新沿用当前组件的跟随契约，只有测得重复查询成本后才节流／缓存，不能统一降低频率而损失转向响应。

- **Unity**：[AI Navigation 2.0.16](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/AboutObstacles.html)的局部避让范围短，不能保证绕过堵塞；通常静止但可被推动的箱子可用 carving，移动与静止策略分开，查询要考虑一帧更新延迟。[一手] [混合组件约束](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/MixingComponents.html)要求导航、非运动学刚体、Root Motion 不争写位置；同一角色的 Agent 与 Obstacle 不同时启用。[研究] 先修这些边界，再考虑外部人群系统
- **UE**：[原生 RVO／Detour Crowd](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-avoidance-with-the-navigation-system-in-unreal-engine)择一；CharacterMovement RVO 不受 NavMesh 约束，可能越界，需依赖走廊约束时评估 Detour Crowd 并核配置的 Agent 上限。[一手] [研究] 不把 Unity carving 规则照搬到 UE，也不默认同时开两种避让

[一手] [Factorio FFF316](https://www.factorio.com/blog/post/fff-316)面对同类单位互相堵塞，改为取消同类硬碰撞、保留 separation；[Overgrowth 固定源码](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/enemycontrol.as#L3075-L3121)则把攻击停距、侧移和经 NavRaycast 限制的同队排斥组合成目标运动。[研究] 借局部机制，不整搬引擎；需要身体卡位的玩法不照搬取消碰撞。后续二改用“追击中急转＋箱子堵门后移开＋窄门会车＋切攻击／眩晕”检查停距、反复左右转向和旧移动残留；源码不能证明自然度或性能收益，许可与重寻路反例见 [WP11 导航补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#导航补研通路局部让路与停止位置)。

## 4. 数据驱动：定义、实例、存档分开

[研究] **做到哪**：定义层保存稳定内容 ID、初始参数与资产引用；实例层保存 HP、冷却、目标和当前阶段；存档层保存可迁移快照与 schemaVersion。沿用 ScriptableObject、DataAsset、DataTable 或已有 CSV 管线，补 ID 唯一性、引用完整性和范围校验即可。

- **可以省**：每个整数都做 SO、默认配置热更新、通用反射 ORM、自建 mod 语言
- **AI 可承担**：定义类型、导入校验、旧数据迁移和夹具；人决定数值与内容修改对既有存档的含义
- **典型失败**：共享技能定义写当前冷却；用数组序号当存档 ID；字段改名丢序列化引用；两只敌人共享血量
- **验证**：同一定义生成两个实例，只伤害一个；新开局定义不污染；v1 存档载入 v2；分别声明修改即时生效、下次生成生效或仅新局生效

[一手] Chop Chop 的 [TransitionTableSO](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/UOP1_Project/Assets/Scripts/StateMachine/ScriptableObjects/TransitionTableSO.cs) 每个状态机创建运行实例字典，[StateActionSO](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/UOP1_Project/Assets/Scripts/StateMachine/ScriptableObjects/StateActionSO.cs) 从定义生成普通动作实例；不是所有角色共用一份可变 SO。[后续健康管理修改](https://github.com/UnityTechnologies/open-project-1/commit/753c30e6fda71c6024c69ee5704b71cfa110e160) 将初始血量写入限制到新建实例分支，避免 Awake 重置既有玩家状态。[研究] 可借这个区分，不必借整套编辑器。

**[研究] ✅ 物品加耐久／强化，先定哪些仍可互换。** 材料可继续数量栈；会单独变化的装备，优先沿现有背包使用单件状态或使用前拆一件，不能只按定义 ID 合并。OpenMW 的真实修复表明拆分另发身份仍可能丢实例数据；Minetest Game 的单件工具则说明耐久本身不要求逐件 ID。[一手／研究] 二改拿三把同型剑，只损耗／强化一把，再转移、拾回与尝试合并：数量守恒，状态不串件、不重置；需要跨操作追踪“这一件”时再补身份与失效规则，已有组件满足就不另造框架。**源码不证明目标项目的维护收益；**合并路径反例、状态／身份区别及许可见 [WP11 物品补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#物品补研数量栈单件状态与转移身份)。

## 5. 组件与 ECS：迁移热点，不迁移口号

[研究] 下文 Jobs/Burst、Entities、ECB 与 enableable 的具体路线仅适用于 Unity；UE 只共用“先定位热点、再局部改变结构”的判断，不把这些包名和时序直接映射到 UE。

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

**[研究] 连锁回调可能重入时，先明确本次资格与派生来源，不把排队当防环。** 完成合法性检查后，在可能重入的调用前登记本次已触发／占用状态，失败如何释放仍按玩法约定；派生伤害明确能否再反射／分摊。DCSS 曾将冷却登记提前以阻止反射重新触发，又将死亡爆炸延后到完整多目标操作结束；SPD 的直接死亡伤害与 OpenRA 的即时／延时配置说明不是所有连锁都需排队。[一手] 只有同步执行会破坏尚未完成的操作时，才复用已有待办并选清处理边界；“每个子步骤末尾”未必等于整次操作结束。**局限：队列本身不防环，也不保证所需顺序；**固定消费者、历史修复与反例见 [WP11](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#事件连锁补研排队不代替防重入与操作边界)。

**[研究] ✅ 预览先复用命令的规则查询，不在 UI 另写一份近似规则。** 建造落点、目标与费用提示应对应当前动作模式、修饰键及世界状态，提交时仍重新校验。Factorio 曾修正“按住 shift 实际可放 ghost，预览却仍标红”；OpenTTD 则沿同一命令处理器区分试算与执行。[一手] 新增替换／范围动作时，同时检查预览与实际结果，并确认查看预览不扣资源或改变世界。**局限：共享代码不保证连锁效果可精确预测，估计应标明；**先缩小提示承诺，不默认增加整局模拟／回滚框架。来源、反例与可撤销试验的竞争选择见 [WP11 预览补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#命令预览补研提示清楚还要规则一致)。

**[研究] ✅ 需要复现玩法序列时，让纯表现随机有自己的状态所有者。** 新增颜色、闪光或音效变体，不应消耗掉落／战斗正在使用的随机流；沿现有生成器实例或引擎 RandomStream 分开传入，不自建 PRNG 框架或默认每对象一条流。OpenRA 的宝石闪光评审曾发现按客户端视口消耗 SharedRandom 的失同步风险，随后改用 LocalRandom；BrogueCE 则把显示颜色与实质玩法随机状态分开。[一手] 二改增加表现变体或关闭特效后，在固定版本与相同玩法输入下对照玩法结果。**局限：分流只隔离随机消费，不能保证跨版本、跨平台、物理或网络确定性；**会改变命中或障碍的“装饰”仍归玩法。原生入口、状态／重置区别与许可见 [WP11 随机所有权补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#随机所有权补研装饰二改是否改变玩法序列)。

## 7. 战斗与技能：先统一结算，再决定 GAS

[研究] 借用现成效果时，同时核对取得条件、消耗与目标限制；需要保留行动取舍时别只复制奖励，需要稳定被动能力也不必照搬前置动作，见 [构筑差异与规则取舍](../../docs/research/2026-10-14-game-wp12-indie-roadmap.md#构筑补研同一效果的触发代价)。

[研究] **做到哪**：请求→合法性／资源检查→启动及承诺成本→命中→伤害／效果提交→结束或取消。每步只有一个结算所有者；动画事件可开命中窗口，但迟到的事件在取消、死亡、换场景后失效。Unity 小项目先用技能定义＋执行实例＋少量组件；已有许可清楚且适配玩法的模块优先复用，只补缺失契约。

- **GAS 值得何时采用**：UE 中效果叠层、属性计算、标签互斥、费用／冷却和必要的网络预测反复出现，统一模型开始比零散实现便宜；复杂单机 RPG 也可能适合，不按技能数或联网与否设死门槛
- **可以省**：几种固定动作先建通用公式 DSL／效果编辑器；Unity 为名称一致复刻 UE GAS；单机引入所有预测同步
- **AI 可承担**：规则、状态转换、效果参数、取消路径与测试；人分别决定移动限制、阶段退出与再次攻击资格。感觉攻击后不听使唤时，先试局部解锁移动或恢复段退出，费用／冷却／已提交效果仍沿原结算政策；别默认整段可取消。[一手] Hades 曾调整特定招式的移动锁与连击间 Dash，Overgrowth 则按动画状态准许退出。[研究] 需要读招和站位承诺的动作仍保留限制，不能以更快退出代替手感判断（[依据与反例](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#6-战斗与技能先统一结算权再谈-gas)）
- **典型失败**：费用两次提交；取消遗漏标签／命中盒／移动锁；复用执行实例残留上次目标；重生重复授予；动画和逻辑各扣一次血
- **验证**：准备、承诺、命中、恢复各阶段插入死亡／眩晕／目标失效／卸载，核费用、冷却、伤害和奖励次数；有网络需求才额外测延迟、丢包与预测回滚

[一手] GAS [官方生命周期](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-abilities-in-unreal-engine) 将 CommitAbility、取消和 EndAbility 分开；未正常结束会继续阻挡动作，Per-Actor 实例复用还需清理成员。[研究] 框架没有替玩法定义退款与取消语义。

[一手] [Lyra 的能力初始化](https://dev.epicgames.com/documentation/unreal-engine/abilities-in-lyra-in-unreal-engine?lang=en-US) 处理 Pawn、PlayerState、输入与 Game Feature 的就绪和移除。[研究] 可读公开机制文档；其整套多人生命周期并非单机默认底座，资源的 AI 使用许可另见第 10 节。

### 多来源效果：先定合并规则，再增加框架

**[研究] ✅ 第二招也能授予同一状态时，先改效果契约，别让每招各写一个布尔值并在结束时清零。** 单一所有者、不会重叠的状态仍可用布尔值／局部计时器；多个独立来源才保留授予身份或句柄，退出只撤回自己拥有的那份。持续光环可随离开撤销，已经命中的毒则可独立持续；施放结束、来源死亡不自动意味着目标效果结束。

- **独立来源维持同一能力**：两道保护或两座光环重叠，移除一份后其他份仍有效；有／无可从有效授予集合推导。只要次数且释放严格配对时计数已足够，需要识别重复退出／指定来源时再用句柄
- **重复命中改变同一效果**：先选择保留较长剩余时间、刷新、延长、叠强度或独立计时，再定上限与到期／驱散范围。它们会改变重复攻击是否有收益，不能统一成“计数加一”；图标、层数和倒计时应表达所选规则

**[研究] ✅ 持续效果先定推进单位，再定首末跳与到期边界。** 等待玩家决策时不推进的玩法，沿既有行动调度；承诺“接下来几次攻击”则消费指定的有效行动；即时玩法用明确的模拟时间，不统一成 N 秒或每次输入减一。Shattered Pixel Dungeon 的移动加速改变行动耗时，毒仍按自己的调度跳伤；Flare 的秒数效果随正常模拟推进，普通菜单是否暂停另有配置。[一手] [研究] 分别规定首次／末次跳伤、到期移除与剩余显示，不能让倒计时误报还能行动的机会。只有设计要求冻结时，暂停才不消费效果时间，恢复也不补算被冻结的间隔；菜单中继续冒险则保留时间推进。先在同一毒效果上新增加速，核快慢动作与临界到期，再按项目政策验暂停／恢复；无需新增调度框架，具体源码、显示修订与边界见 [WP11 效果时钟补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#效果时钟补研调度时间行动次数与到期显示)。

[一手] OpenRA 的固定 [Actor](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Game/Actor.cs) 以 token 集合维护条件，[光环](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Mods.Common/Traits/Conditions/ProximityExternalCondition.cs)退出按来源和 token 撤销；不同作者的 Shattered Pixel Dungeon [毒镖](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/weapon/missiles/darts/PoisonDart.java)却复用单个 Poison，其 [set](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Poison.java)保留较长剩余时间，extend 才相加。[研究] 借用的是两种不同玩法语义，不是统一 Buff 框架；两项目相关代码为 GPL-3.0-or-later，不作闭源项目可直接复制的默认底座。

**[研究] Unity 继续用定义＋角色自己的活效果集合；UE 已采用 GAS 时沿用它的聚合配置。** [一手] Unity [SO 文档](https://docs.unity3d.com/6000.3/Documentation/Manual/class-ScriptableObject.html)支持多对象共享数据，因此剩余时间与来源仍放实例；GAS 的 [StackingType](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingType)区分独立实例、按来源、按目标聚合，[到期策略](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingExpiratio-)又区分清整栈与减一层后刷新。[研究] 不把 GAS 的 None 读成“同类效果只留一个”，也不为两种状态迁移整套系统。**局限：句柄与计数只能表达所有权，不能替玩法决定合并、强弱和到期规则。** 二改先验两来源交错结束、重复清理、短效果覆盖长效果和驱散后重施；完整来源、反证与预注册见 [WP11 效果叠加补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#效果叠加补研来源所有权不等于合并规则)。

**[研究] ✅ 第二种增减伤加入时，把计算顺序写清，而不只增加层数。** 明确修饰读取基础值还是上一阶段结果、固定加减／护甲的先后、取整和限幅位置；可撤销属性沿基础值与有效修饰重算，首次计算与重算保持同一政策，不靠反向加减／除法恢复旧值。当前 HP 等已经发生的资源变化另存，最大值变化如何影响它由玩法决定。Wesnoth 曾因重放次序变化让最大 HP 从200变100，SPD 又把虚弱与易伤放在护甲两侧。[一手／研究] 先沿现有属性／伤害函数验“移除无关修饰不改变其余结果”，不造公式语言；**明确规则不代表所有效果可任意组合**，维护证据与二改边界见 [WP11 数值重算](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#属性修饰补研计算顺序与重算)。

### 选敌：先保意图，再调辅助

**[研究] ✅ 需要持续攻击玩家所选对象时，先定义候选、保持与切换，别用每帧最近目标代替意图。** 沿现有武器／输入状态说明哪些对象进入自动候选、旧目标何时保留或失效、玩家怎样改选；手动目标也可以是位置。自动候选可比手动可选范围窄，但须保留玩法需要的直接选择路径。最近目标、持续自动重选或精确手动瞄准本来就是玩法时，保留简单方案，不默认增加锁定管理器。

[一手／研究] Cogmind 的[官方手册](https://www.gridsagegames.com/cogmind/manual.txt)描述进入开火模式时优先恢复旧目标，无有效旧目标才选最近者，并提供过滤后的循环与查看模式转入开火的例外路径。Hades 曾[扩大特定武器的手柄锁定范围](https://www.supergiantgames.com/blog/hades-long-winter-update-patch-notes/)，又[排除召唤出的 Skelly](https://www.supergiantgames.com/blog/hades-the-blood-price-update-patch-notes/)；Brotato [官方说明](https://store.steampowered.com/app/1942280/Brotato/)则同时列出默认自动开火与手动瞄准选项。**局限：候选资格、保持目标、辅助范围与自动开火不是同一个强度开关，没有通用最强辅助。** 误选增加时先修候选或保持规则，不继续扩大吸附。

[研究] **二改先加一个更近的干扰对象或可攻击召唤物**，核继续原目标、主动换敌、旧目标失效及按设计选择自动候选之外的对象；支持手动／辅助切换时再核切回。记录输入、当前目标和换目标原因，AI 追路径与补回归，人判断能否预测并纠正选择；保持反而阻碍主动改选时，缩小或撤回该规则。版本、固定源码与未执行的预注册见 [WP11 选敌依据](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#选敌补研候选保持与主动切换)。

### 战斗质量：让玩家读懂承诺、接触与下一步

**[研究] ✅ 先做好一招的节奏，再增加招式。** 前摇让玩家看出动作与方向，接触段让力量集中且命中范围可信，恢复段让下一次移动、闪避或连击的机会可预测。重武器可以慢且不能随时取消，只要风险、收益与敌人的反击机会相配；轻武器可以快且允许衔接，但不能靠每击加长停顿假装沉重。分别调整这三段，别把整段动画统一加速当手感修复。

[一手] Dead Cells 美术 Thomas Vasseur 的[开发复盘](https://www.gamedeveloper.com/production/art-design-deep-dive-using-a-3d-pipeline-for-2d-animation-in-i-dead-cells-i-)强调新武器需要反复重调动画，单改播放速度不足；Death’s Door 的 Mark Foster 在[访谈](https://www.gamedeveloper.com/art/animation-feature)中解释，亲自协调代码与动作是为了控制动作间的连接。[研究] 单人无人工美术修补时，先选能在引擎内分段、重定时或程序化控制的动作资源；缺少清楚起手姿态／接触姿态的素材应替换或简化动作，不能靠混合、拖尾补出不存在的姿态。

- **承诺可学习**：[研究] 每招说明何时可转向、移动、闪避、接下一击，落空和命中是否相同；动画还没收完但允许移动不一定是 bug。保留有意的取消技巧，避免 AI 为“完整播放”删掉它。Dead Cells [33.1／33.3 官方修复](https://deadcells.com/patchnotes/33)曾恢复误删的 Katana 取消及空中技巧。[一手]
- **预告能变成决定**：[研究] 起手轮廓／方向告诉玩家要避什么，音效帮助及时注意，攻击轨迹与实际危险区域一致；接触效果结束后仍看得到下一威胁。镜头、声音和 VFX 服务同一次决策，不各自争抢注意。Hyper Light Drifter 的[设计者访谈](https://www.gamedeveloper.com/design/how-i-hyper-light-drifter-i-balances-difficulty-with-fairness)说明，单体容易的敌人组合后已足够复杂，一种同时反弹子弹、格挡近战的敌人因组合困难被放弃。[一手] 因而新敌人先验证与旧敌人的围攻、距离和逃路，再决定增加聪明程度。
- **用原生机制保住节奏**：[研究] Unity 先用已有 Animator、动作配置与事件；[转场文档](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Transition.html)里的 Exit Time、混合时长和中断顺序分别控制不同事情，混合更长不一定更自然，可能淹没接触姿态。UE 用 Montage／[Notify State](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-notifies-in-unreal-engine)编排区间，精确分支才评估 Branching Point；特效与挥动声可跟动作，命中声与受击效果仍跟已确认结果，不为此另造通用战斗编辑器。

**[研究] 敌方意图预告到哪一步，先看玩家要做什么决定。** ✅ 计算当前局面、分配攻防时，显示足够支持判断的下一步；Into the Breach 的[作者访谈](https://www.gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-)将明确预告与解谜取向相连。[一手／研究] **行动已确定才作确定预告；会随玩家动作改变的，显示当前条件下的结果，并按规则更新或撤销旧提示。** 不默认公开完整行为表；观察、试探和未知本身构成体验时，可保留不确定性，但不能把显示错误当悬念。Amnesia 的[作者复盘](https://frictionalgames.com/2019-10-9-years-9-lessons-on-horror/)只提供信息政策反例，不证明隐藏敌人下一招更好。

[研究] **二改攻击、推移或护盾规则时，同时核预告的对象、数值与次序。** Into the Breach 的[2023-01-23 公告](https://steamcommunity.com/app/590380/discussions/0/3765606580168752432/)既移除了没有排队攻击的对象的误导排序，也调整推移顺序以匹配预览。[一手] 因而预告失真时可收窄显示承诺或简化行动规则，不只补 UI 特例；没有对应玩家决定就不加完整模拟器。**局限：透明程度是玩法取舍，作者观察与补丁不证明普遍体验提升。** 来源边界、条件预告与未执行验收见 [WP11 意图预告依据](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#意图预告补研确定结果条件变化与有意未知)。

**[研究] 屏外威胁先分“规则允许获知但没在画面内”与“来不及应对”，别直接给所有敌人加箭头或停攻击。** 回合策略因放大画面漏掉当前仍可获知的敌人时，✅ 补边缘标记与按需查看，并让标记避开画面内目标；即时动作若看见提示仍来不及转向、定位和躲避，先改入场位置、攻击方向、预告或弹体速度。Cogmind 的[放大视图改造](https://www.gridsagegames.com/blog/2024/02/adventures-in-map-zooming-part-5-qol/)与 Specter of Torment 的[房间布局复盘](https://www.yachtclubgames.com/blog/specter-of-torment-level-design-deep-dive-2-5/)体现这两条不同路线。[一手] [研究] 若玩法要求看见起手才能反制，可考虑限制屏外起手；已发出的攻击是否继续由技能规则决定；不能让表现裁剪意外改变结算，有意随可见性取消则明确写进规则。**局限：合理方案取决于可获得的信息和应对时间，不存在通用“屏外不能攻击”规则。** 固定源码反例与后续对照见 [WP11 屏外威胁补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#屏外威胁补研补信息还是改攻击)。

**[研究] ✅ 当命中也承担阻止威胁的作用时，先保住玩家读招后的选择，再扩大辅助或取消。** 旧招与新招打同一遭遇，比较“抢断这个敌人”和“避开它再反击”两条本来可行的路径：

| 当前失败 | 优先改什么 | 代价与撤回条件 |
|---|---|---|
| 位移后自动转向与原攻击意图相反 | 收窄该情境的辅助转向／候选，而非一律锁死目标 | 更少自动纠正；若妨碍主动换敌，恢复明确改选路径 |
| 打中却没阻止敌招，玩家仍以为危险已解除 | 先核当前护甲／阶段本来能否被打断，再修状态表达或错误结算 | 提示需表达有用差异；若玩法本就要求先躲后打，不把敌招全部改成可抢断 |
| 应对正确却无法进行约定的下一步 | 核自己的承诺与衔接出口，不靠所有动作随时取消补救 | 更宽取消会减少出招风险；破坏既有风险收益时收回该出口 |

[一手／研究] Dead Cells 的 Phaser 辅助转向修订、Hades II 护甲／不可打断攻击的独立修复，以及 Furi 有意保留的不可硬直阶段，分别支持这些选择；**局限：这些不是同一游戏的组合对照，也没有证明玩家体验或 AI 制作净收益。** 人判断“为什么挨打、下一步何时可做”，AI 可维护参数和事件轨迹；依据、例外及未执行的二改验证见 [WP11 组合取舍](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#组合取舍先修辅助规则还是动作出口)。

## 8. 相机：先让玩家看懂并控得住，再增加镜头语言

[研究] **✅ 先用固定镜头／简单跟随，让玩家在行动前看见落点、威胁和路线，移动与瞄准不被运镜抢走。** Unity 复用匹配项目版本的 Cinemachine，UE 沿用 CameraComponent／SpringArm／PlayerCameraManager；只为看不清或控不住的动作加规则，不把更多阻尼、震动或自动运镜当升级。

下表组件名仅指 **Unity Cinemachine 路线**，UE 见后文；这是机制推导的选用建议，不是三种玩法的实测排名。[研究]

| 场景与玩家需要 | 默认采用 | 何时调整；不值得增加什么 |
|---|---|---|
| 精确平台跳跃：起跳前读落点，空中保留高度参照 | ✅ 房间固定取景，或 Position Composer＋适度死区＋房间边界；水平与垂直分别调 | 长距离冲刺看不清前方才加有界前瞻；落下看不到落点才加下视规则。不要让每次小跳都拖整个背景上下动，也不把速度预测绑到抖动骨骼 |
| 俯视战斗／小型竞技场：读围攻方向、攻击预告与逃路 | ✅ 固定朝向和稳定尺度，有限跟随；只在确有需要时加入目标偏移 | Boss／双目标无法同屏时试 Target Group＋Group Framing，并限制缩放。把所有敌人纳入构图会被远处杂兵拉远；角色和预告过小就退回固定尺度或改遭遇布局 |
| 越肩射击／3D 探索：控制观察方向，瞄准与实际命中可信 | ✅ Third Person Follow，瞄准需要时加 Third Person Aim；输入方向与角色动画分离 | 窄角落先调遮挡层、相机半径和进出碰撞响应；关卡仍无可用视线时改空间或局部遮挡表现。不要靠不断自动绕行／换肩替玩家瞄准 |

[一手／研究] 前瞻会放大动画噪声，预测平滑又增加滞后；先改善取景与输入响应，再加阻尼。版本按项目核：本次核实的 Unity 6.0 渠道发布版为 **3.1.7**，不能把主干 **3.1.8-pre.2** 的静态重入修复算进稳定版。机制、修复与许可详见 [WP11 镜头补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#镜头质量补研从跟得上到看得懂控得住)及 [WP11 相机基线](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#7-相机先复用成熟运行时验收的是可读性与控制权)。

**Unity 遮挡：先分“不穿墙”和“看得见”。** [一手／研究] Decollider 修正相机碰撞位置，Deoccluder 才尝试恢复目标视线；Transparent Layers 只排除遮挡判断，不会让材质透明。✅ 保住瞄准意图后仍有可用视点，才用有限拉近／移位；固定朝向只被可退让的树冠／前景挡住时，🧪 用 Shader Graph Dither＋Alpha Clip 做局部显隐。保留碰撞、掩体边界、落地面和攻击预告，定义显隐对象与退出恢复；轮廓只回答“人在哪”。若无可行视点，或每种墙／树都要补材质例外，先改几何与遭遇布局。Project Zomboid 发布后仍修改树冠 cutaway，反证显隐不是免费兜底；实现、案例与 UCL 的 Unity-dependent 限制见 [WP11 遮挡依据](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#2-三种玩法的不同默认不共享一套最佳参数)。

### 建造／策略视图：先选支点，再调平滑

**[研究] ✅ 旋转／缩放突然偏离正在看的建筑，先查支点与输入入口。** 鼠标直接指向时可保留光标锚点；按钮可先用当前视口中心，另有选中对象等意图时单独声明，不把全窗口鼠标位置套给所有入口。Tiny Glade [1.11.2](https://steamcommunity.com/games/2198150/announcements/detail/543346166601876516)保留 PC 光标支点，却为 Steam Deck 改用中心区域；旋转时单一中心点落在高塔旁会选中背景，增加阻尼并不改变这个目标。[一手／研究] 中心区域会推断玩家意图，只在单点经常误选时评估，不要求所有游戏增加模式选择器。

**[研究] ✅ 简单缩放优先复用现有视口变换，不额外引入不需要的地形拾取。** OpenRCT2 的[等距缩放修复](https://github.com/OpenRCT2/OpenRCT2/commit/85a0f70ae166cb5d240844c4dffad7c1c9fbbd76)删除高度拾取，用视口内坐标补偿；[按钮修复](https://github.com/OpenRCT2/OpenRCT2/commit/e4f36840bff585b4a3f5581cd2b4714f887b2c02)另接完整缩放路径，说明滚轮通过不能代验按钮。[一手] 二改增加高塔／陡崖、额外视口或另一输入入口，分别核对象边缘、背景与视口中心；**局限：二维等距修复不是 3D 旋转算法，发布说明也不证明目标设备的舒适度收益。** 设计选择与缺陷修复、固定版本及待验范围见 [WP11 支点补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#建造镜头补研旋转缩放支点与输入入口)。

### Unreal：同样的可读性目标，不同的职责边界

[一手／研究] **✅ 保留原生职责：** CameraComponent 提供视点，SpringArm 用 ProbeChannel／ProbeSize 防穿透（默认 ECC_Camera），PlayerCameraManager 管最终视图与混合；ControlRotation 表达控制／瞄准朝向，可不同于相机和 Pawn 朝向。SpringArm 不等于 Deoccluder，更不负责枪口命中；不要相互反写旋转。

- **绕柱越肩：** 肩位优先用 SocketOffset，避免偏移子 Camera 绕过探测。输入拥有瞄准意图，SpringArm 只在允许范围修正位置；从最终视点／准星取候选目标，武器再从真实枪口按射线、弹体体积／弹道查路径。枪口撞柱就显示受阻并按武器规则结算，不能从相机发射穿掩体，也不自动转 ControlRotation 替玩家绕柱。[研究]
- **固定俯视：** 先保朝向、尺度和落地参照；🧪 从 Top Down Strategy 的 masked M_Cutout 屋顶开口改造局部显隐。它不是完整树冠系统，对象选择、范围和恢复由项目负责；同样保留碰撞与关键边界，不靠整体拉近或角色轮廓代替落点信息，也不跨引擎搬运 Unity 节点／受限源码。[一手／研究]
- **👀 新系统只在减少编排时评估：** 本次读取的 UE **5.8** Gameplay Cameras 仍标 **Experimental**；多套可复用 rig、导演与过渡确有收益才试，不因“最新”默认迁移。已有 Occlusion Material 节点不保证枪口合法、落点可读或材质自动适配。[一手／研究]

原生契约、模板限制与版本核实范围见 [WP11 UE 补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#unreal-相机补研同一遮挡问题的原生职责与新系统边界)。

### 两引擎共用的体验契约

- **持续输入跨切镜仍可预测。** Celeste64 在攀爬持续按方向时保留映射，松开才重算；✅ 借局部机制，不推广成所有地面移动都锁方向，也不照搬 jam 的长期架构。鼠标位移与摇杆速率分开处理，别重复乘帧时间；Unity Input Axis Controller 有对应选项。[一手／研究]
- **准星与命中分开核。** Unity Third Person Aim 可处理相机／角色起点视差，实际枪口与弹道仍属玩法；两引擎都须区分“镜头看得见”和“枪口打得到”。装饰震动可与瞄准分离，故意后坐力是否影响瞄准另定，不能一并抵消。[一手／研究]
- **切镜、可选效果与默认值分别决定。** 谜题揭示可缓动，要求立即取景的重生不应追过半张地图，战斗混合不能丢落点或瞄准控制。震动、摆动、运动模糊和非必要自动回正应可减弱／关闭，视野与横纵灵敏度按玩法开放；没有通用舒适参数。[一手／研究] 非必要运动已有明确不适反馈时，考虑稳定缺省＋易发现的动感开关。Endless Sky 保留功能却撤回默认开启，正面体验与不适报告并存：能关闭不足以支持默认开，也不必一律关闭；旧设置仍保留，舒适度／留存收益未测，见 [WP11 默认值取舍](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#endless-sky非平台游戏的动感镜头与默认值取舍)。

输入、瞄准与可访问性依据见 [WP11 镜头补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#镜头质量补研从跟得上到看得懂控得住)；借 Celeste64 机制不等于取得其 Content／IP 商用许可。

**先选历史政策，再调阻尼。** [研究] Unity 在项目版本有相应入口时：同一目标整体平移、需保留相对构图与运动趋势，用 `OnTargetObjectWarped(target, positionDelta)` 同步历史；重生／换角色后需立即重新取景，用 `CancelDamping()` 清历史，活动混合另选 cut／blend；正常交接仍需设计过渡时保留混合。换 Follow 不等于硬切，零位移 warp 不等于重置，位置 warp 不处理旋转传送与所有扩展状态。

**短暂借出视图，还可维护历史而暂不输出。** [研究] 同一目标回看期间继续移动、返回希望连续时，可比较后台推进原跟随状态与切回重初始化；SuperTuxKart 最终采用前者，而非早期回切 snap，见 [WP11 修订链](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#镜头借出控制持续更新历史与当前视点分开)。只更新必要状态，不默认让全部闲置镜头持续做碰撞查询；旧状态失效或成本不值时重建，硬切／混合另定，换目标本身不等于清历史。**局限：被接受的代码不证明目标项目手感或预算收益。**

**统一输出与时钟，验移动目标而非阻尼名称。** [研究] 一个视口只有一个最终输出控制者；少量模式配置声明优先级、时钟、历史政策与退出恢复，技能只请求效果。更新阶段匹配目标实际移动方式，不统一选 Fixed／Late，并检查目标插值与镜头平滑叠加的滞后。联网回切突跳时，先核重演是否污染呈现历史；只在一条通路变差就收窄平滑范围，别为退让突跳给最终 Transform 整体加滤波、连带拖慢直接旋转，来源与反例见上述修订链。暂停不默认清历史；目标与相机都冻结可保留，菜单继续运镜则须明确时钟，Unity IgnoreTimeScale 不会制造暂停期间的固定更新。指数阻尼／substepping 不保证整套跟随帧率无关：比较变帧率下移动目标的屏幕位置与追随滞后，不只验静止误差。Unity 固定源码、算术反例及 UE 旧版本问题不能冒充当前引擎复测，见 [WP11 跟随历史补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#跟随历史补研瞬移换目标与变帧率)。

**后续验收：** [研究] 二改加一根柱／一层树冠，核瞄准与枪口分歧、显隐恢复及新增材质例外；再验起跳前落点、转向后威胁、绕柱抽动、持续输入跨切镜、关闭效果后的命中可读性。低帧率／不同固定步长、暂停、重生和过场取消一起覆盖。AI 实现绑定、切换、参数和轨迹记录；人判断取景、力度、节奏与舒适度。这是待做验收，不是已测收益。

## 9. 关卡：先能重置遭遇，再扩成大世界

[研究] **做到哪**：关卡定义含稳定 ID、入口、目标和出生表；运行中的 Encounter 拥有所生对象、触发状态和一次性奖励；跨关卡完成标记属于存档域。玩法 ready 与场景加载完成区分，退出有取消／清理钩子。

- **可以省**：小房间游戏的大世界分区、自建关卡编辑器、无玩法约束的随机铺图
- **AI 可承担**：按既定规则组装房间或生成布局、自动过滤连接／遭遇违约、生成测试场景；人决定节奏、路线与资源可读性
- **典型失败**：门永等已销毁敌人的事件；检查点保存运行实例；改生成顺序让相同 seed 变布局；重建内容丢 ID
- **验证**：逐检查点恢复、完成后离开重返、完成事件重复、出生点被占、最后敌人意外离场；核出口、目标与关键资源可达。程序化地图记录生成器版本，不能只保存 seed 就保证升级兼容

**[研究] ✅ 任务推进分开历史事实与当前条件。** 已交付、永久解锁按规则保留，当前携物、位置或目标存在则查询现有状态；允许先探索后接任务时，接取／交付入口要认可已有成果，不能只等接取后的新事件。Flare 开放任务物品入仓后补查当前持有，Shattered Pixel Dungeon 则分开接取状态、背包查询与确认交付。[一手／研究] 沿现有交互与存档指定推进入口，二改检查先取物、暂存、交付消耗、离开读档后仍可继续；**若玩法要求持续携物或占领，就保留可逆条件，不能一律锁成永久完成。** 不新增通用任务框架；源码不证明存档原子性或体验收益，消费链、真实修订和许可见 [WP11 任务推进补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#任务推进补研历史事实与当前条件)。

**[研究] ✅ 先选空间组合。** 稳定跳跃／战斗空间优先已有或许可清楚的房间，沿用编辑器，按用途、入口与遭遇条件组装；未知地形、绕行与逃生本身是玩法时，🧪 用受约束程序布局。Dead Cells 与 Cogmind 作者分别提供这两种参照。[一手] [研究] 连通后仍查路线压力／喘息、资源机会与敌群应对空间；AI 筛明确违约，人抽看代表性与极端样本。**模块仍需内容设计，自动通过不证明好玩。**

**[研究] ✅ 再核结束条件与奖励。** 若每局都在清理无挑战的残敌，先沿现有 Encounter 目标与一次性结算，检查完成后离开是否损失下一关必需成长，再加房间。Rogue Legacy 调整成长时机、Into the Breach 重选胜利条件提供了不同参照。[一手] [研究] **清场／刷宝本身是乐趣时保留；新条件若只让玩家拖时间或跳过有趣交战，应撤回重选。** 不照搬局外成长或限时防守；四个案例、固定开源消费链、许可与二改条件见 [WP11 关卡组合补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#关卡组合补研连通之后还要选择什么)。

**[研究] 会按提示操作之后，还要知道何时主动使用。** ✅ 先区分动作完成、理解使用时机、在正式关卡迁移使用，别把点击“已读”当学会。对组合操作多、容易漏掉捷径的游戏，可借 [Factorio](https://www.factorio.com/blog/post/fff-361) 的情境推荐、可回查帮助与可选微教程；若自主探索就是核心玩法，可借 [Outer Wilds 作者](https://www.mobiusdigitalgames.com/news/filling-out-the-toolbox)的可选练习与能力提示，避免教程一直发任务、正式游戏却要求自己找目标。[一手／研究] 不必为每个机制搭教程；先看目标玩家是否熟悉操作范式、哪里存在真实误解，不按游戏复杂度单独决定教学量，基础说明能在物件旁讲清就不增加页面。关键前置知识保留明确教学机会，属于探索奖励的谜题答案不提前交给自动提示。**局限：作者观察与触发源码不证明学习收益；**竞争方案、漏学反例及许可见 [WP11 学习迁移补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#学习迁移补研按提示完成之后会不会主动使用)。

[研究] 二改增加工具的一种用途后，用没有逐步指令的变形情境检查玩家能否主动选择它，再决定补短提示还是练习；同时核旧说明、绑定与示例是否仍对得上规则。AI 可提出两个局部方案、实现触发和回查入口，人决定哪些知识必须教、哪些发现应留给玩家；行为次数仅用于减少打扰，不作掌握证明，不先建通用教学框架。

**[研究] 高频失败的玩法，还要让玩家愿意再试。** ✅ 对靠反复练习掌握动作的短挑战，分别检查死亡演出、转场／重建、恢复控制、重走已掌握路程的成本；先缩短无意义等待和重复路程，再决定降低挑战或加提示。检查点改变时给清楚反馈，重试沿用既有生命周期，不先加快照或回放框架。

[一手] Super Meat Boy 作者的[经典设计复盘](https://www.gamedeveloper.com/game-platforms/-i-super-meat-boy-i-s-mcmillen-explains-why-so-hard-)把短关卡与快速复活一起设计；[Celeste64 固定源码](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L1968-L1991)仍通过重建 World 重生，提供了先复用场景重开、再按实际成本决定是否局部重置的起点。[研究] 永久死亡、资源消耗或整局承诺若构成玩法，不能套用最近检查点；这些来源也不是本项目的耗时或玩家收益实测，采用成本见 [WP11 重试补研](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#失败与重试补研回到刚才的决策点)。

**[研究] ✅ 辅助按玩家被挡住的环节与游玩目标选择。** 已有信号的可达表达与主动揭露未知信息分开；前者沿用[客户端设置](04-client-modules.md#信号取舍减掉演出后仍看得懂下一步)，后者明确属于规则选择。只需缓解一种操作／反应负担时，可借 [Dead Cells](https://deadcells.com/patchnotes/29) 的局部调整；需要协调遭遇、资源压力与探索目标时，可借 [Cogmind](https://www.gridsagegames.com/blog/2017/02/adjustable-difficulty/) 的整局预设，后者为计分一致性限定下一局生效。[一手／研究] 全局降速也可以是有意提供的辅助，不默认替代所有局部需求；按玩法决定当局可调还是下一局生效，并让玩家容易找到选择、知道关闭后恢复什么及进度／计分如何处理。沿现有设置与存档实现，二改加敌人或辅助后，核切回、死亡与读档后的实际规则；Dead Cells 曾修复关闭 Assist 后子选项仍生效。[一手] **局限：较易模式能改变进入内容的条件，不证明玩家已掌握标准模式，也不保证各区域等比例变容易。** 竞争方案、历史反例与待验证范围见 [WP11 辅助取舍](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md#辅助取舍补研局部调整整局预设与切回规则)。

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

固定源码、核实日期、历史修改、许可与反证见 [WP11 研究记录](../../docs/research/2026-10-14-game-wp11-gameplay-architecture.md)。资源释放、存档实现与目标设备预算见[客户端模块](04-client-modules.md)，试玩方法见[验证页](02-verification-and-playtesting.md)。
