主线：一／二／三；战斗决策、原生能力取舍与第二次修改
改变的建议：[研究] 战斗先统一结算、效果与时钟；AI先分感知、选敌、意图与攻击资格，再按复杂度升级。
新证据：原WP11固定源码、官方契约及复盘迁入；2026-10-23追加P111卡牌闭环与P118失视搜索：近期作品／玩家反馈、固定实现及引擎失败，未新增运行实测。

# WP11分册：战斗、效果与AI

核实日期、许可与验证范围沿用[原记录总说明](2026-10-14-game-wp11-gameplay-architecture.md)及各节；旧研究块沿用原结论；新增研究各节单列日期与边界。

分册：[基础与生命周期](2026-10-14-game-wp11-gameplay-architecture.md) · [战斗与AI](wp11-combat.md) · [镜头与进度](wp11-camera.md)。

<a id="s10-1"></a>
## 战斗质量补研：动作节奏与遭遇可读性一起设计

核实：2026-10-14 UTC。主线 1／3；改变 05 第 7 节只强调结算、取消正确性的侧重，补充玩家能学习的动作承诺、接触力度与恢复节奏。新证据是已发布游戏开发者自述、官方历史取消回归及现行原生动画契约；不重复 04 的输入／打击反馈参数表。[研究]

<a id="s10-2"></a>
### 1. 三种生产经验改变哪些建议

| 直接来源与证据性质 | 具体观察 | 本文采用／不采用 |
|---|---|---|
| [Thomas Vasseur，Dead Cells 动画流程，2018-01-25](https://www.gamedeveloper.com/production/art-design-deep-dive-using-a-3d-pipeline-for-2d-animation-in-i-dead-cells-i-)；本人制作复盘 [一手] | 可重做时序是关键收益；新武器可多次调整，过去仅在代码里调播放速度不足；其团队在动画与细节之间有所取舍 | ✅ 优先选可反复调整的动作资产与流程，分开改前摇、接触、恢复；⛔ 不把“3D 转像素”当无美术人员必然成功的路线。作者仍承担模型、动作与美术判断 |
| [Mark Foster，Death’s Door 动画访谈，2021-08-27](https://www.gamedeveloper.com/art/animation-feature)；仅其本人描述作为一手 [一手] | 漂亮外包动作不能替代他想控制的动作间连接；小屏幕角色不值得投入不可见的细节 | ✅ 在实际游戏镜头下判断姿态和衔接，把工时花在玩家看得到的动作；⛔ 不从“程序员学会动画”推断本仓库无手工修补基准已经实现 |
| [Alx Preston，Hyper Light Drifter 公平性访谈，2016-04-08](https://www.gamedeveloper.com/design/how-i-hyper-light-drifter-i-balances-difficulty-with-fairness)；设计者对自己游戏的描述 [一手] | 轮廓和起手传递信息；敌人组合使挑战上升；反弹子弹又格挡近战的敌人难与其他敌人组合而被删 | ✅ 在混合遭遇里评价预告与反制空间；⛔ 不以单挑 AI 更聪明当新敌人质量更高，也不推出所有游戏应降低单体智力 |

[研究] 共同支持“可反复改的一招＋可解释的敌群”，动作本身参与预测与掌握；三例均有作者判断，不能证明AI／无美术团队获得同样收益。

<a id="s10-3"></a>
### 2. 慢、快与取消各自服务什么

[研究] 前摇传达方向，接触集中速度／姿态变化，恢复建立节奏。快招可承担距离、硬直或站位风险，重招可用承诺换破防／范围／位移，非通用平衡公式。敌人可应对性与玩家输入响应不同，不要求相同时长；慢招也可在承诺清楚时成立。

[研究] 每招明确转向锁定、移动、取消、连击及落空风险；玩法先准许、动画再衔接。过度混合会抹掉接触姿态，无条件取消会抹掉重武器承诺。

[一手] [Dead Cells 官方 Update 33](https://deadcells.com/patchnotes/33)：33.1（2023-03-10）修误删Katana cancel technique，33.3（2023-03-30）恢复空中Hattori’s Katana技巧，另有新武器与音效表现修复。[研究] 保留历史连段回归，不猜根因／帧数或要求所有技巧永久保留；有意平衡改动须明示并试玩。

<a id="s10-4"></a>
### 3. 原生编排足够，重点是编辑后仍对得上

- **Unity 6.3**：[一手] [Animator 转场](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Transition.html)把 Exit Time、Fixed Duration、Transition Duration、Interruption Source／Ordered Interruption 分开；有 Exit Time 时条件在该时点后检查，AnyState 转场先进入中断队列。[研究] ✅ 沿用原生机制，但分别审查玩法准许取消和动画能否进入相应转场。换动画长度／播放速度后重新核接触姿态、窗口及混合，不把一个 normalizedTime 百分比当永远不变的现实时间。
- **Unreal 当前官方页面**：[一手] [Notifies](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-notifies-in-unreal-engine)支持 Notify State 区间、Sound／Niagara 及 Montage 通知；Branching Point 比 Queued 更精确、同步但成本更高，Link Method 的 Absolute／Relative／Proportional 对片段移动／缩放反应不同。[研究] ✅ 用现有 Montage 编排，只有确需精确次序的玩法分支才加同步通知；编辑动作后检查绑定方式。此默认 URL 本次页面标为 5.8，实际工程必须选对应版本，不借此声称已核旧版全部行为。
- **共同边界 [研究]**：动作事件开窗口／准备声，确认命中再选受击、格挡与接触效果；可见拖尾不等于全程伤害。镜头音频沿04／05 §8，新武器仍须保住旧敌人预告。

[研究] 无手修起点是许可清楚且姿态可读的现成动作，或适合刚体／简单2D的程序动作，再分段、重定时和引擎调整。程序能改时序，未必修好轮廓、缺姿态、穿插与重心；需反复手修则换素材、减招式或降表现复杂度。

<a id="s10-5"></a>
### 4. 新武器／新敌人后保住什么

[研究] 后续获准做切片时，保留一把已满意旧武器和一个代表遭遇；加入一把节奏不同的新武器，或一个与旧敌人形成新压力的敌人。不要只打训练木桩，也不要求全量笛卡尔组合：选会改变取消、预告、距离或接触的组合。

1. **前摇到承诺**：同镜头下能否辨认攻击方向与危险范围；改变方向／闪避的准许边界是否与姿态一致。记录输入、阶段与画面，不以玩家背下无提示例外为通过
2. **接触到结果**：命中、落空、格挡分别试；玩家说得出结果，声音／VFX 不许诺不存在的命中，新武器效果不遮挡同时到来的旧敌人预告
3. **恢复到下一步**：旧连段、取消和移动恢复仍符合设计；新慢武器的承诺确实换来相应收益，不能把所有不适都通过加速／开放取消消除
4. **从单体到遭遇**：新旧敌人混合、狭窄空间、边缘位置下仍有可读且可执行的选择；若无解，按[条件表](#s39-4)比较冷却错峰、特定攻击许可、敌人组合与站位／空间，不统一轮流攻击，也不先叠更响的警报

[研究] 自动核窗口、结算、转换；真人判断辨识、失误原因与再玩意愿。记录特例／工时；新武器牵动所有敌人与镜头时先修共同动作语义。设计者定承诺与公平，AI维护参数、引用、轨迹及回归。

[研究] Dead Cells Update 14 的格挡时序修订仅取得摘要，正文超时，未纳入采用证据。

[研究] 战斗补研的历史局部检查：`check_repo.py` 177 文件、0 errors，两个文件 `git diff --check` 通过；未在该轮重跑完整离线入口。

<a id="s18-1"></a>
## 效果叠加补研：来源所有权不等于合并规则

核实：2026-10-15（UTC+8）；2026-10-25 合并实现建议到 [05 §7](../../domains/game-dev/05-gameplay-architecture.md#7-战斗与技能先统一结算再决定-gas)。以下保来源与合并规则的固定实现、实际消费者和许可，不另维护一套模块。[研究]

<a id="s18-2"></a>
### 1. OpenRA：来源退出只撤自己的授予

[一手] OpenRA 固定主干`e180e3225f3930272dd451917467631618f8976f`（2026-10-11 UTC）；完整消费者链如下：

| 固定来源 | 实际机制与边界 |
|---|---|
| [Actor.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Game/Actor.cs) | GrantCondition 分配独立整数 token；UpdateConditionState 从该条件的 token 集合计算数量；RevokeCondition 只移除指定 token。无效 token 会抛异常，因此底层不是幂等释放 |
| [ProximityExternalCondition.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Mods.Common/Traits/Conditions/ProximityExternalCondition.cs) | ActorEntered 为目标保存 token；ActorExited 先移除本地记录，再以 self 和 token 请求撤销。所有权变更另有重新判断路径，不只等计时到期 |
| [ExternalCondition.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Mods.Common/Traits/Conditions/ExternalCondition.cs) | 永久 token 按 source 分组；TryRevokeCondition 核来源；限时 token 各有到期 tick。SourceCap／TotalCap 达到限制时可能替换最早到期的限时授予，不是简单拒绝所有新授予 |
| [TS nod-structures.yaml](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ts/rules/nod-structures.yaml)、[TS defaults.yaml](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ts/rules/defaults.yaml) | 真实隐形发生器以 ProximityExternalCondition 授予 cloakgenerator；消费者 Cloak 的条件为 cloakgenerator 或 crate-cloak，证明多个授权入口确实用于游戏规则，不只是未用样例 |
| [RA defaults.yaml](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ra/rules/defaults.yaml)、[DamageMultiplier.cs](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Mods.Common/Traits/Multipliers/DamageMultiplier.cs) | Iron Curtain 条件连接覆盖色、计时条和 Modifier=0 的伤害修饰；修饰器禁用时返回 100。这说明效果状态与表现可共享条件，但不证明任意计时 UI 都准确 |

[研究] token 支持逐来源撤销，不自动解决重生／存档；本仓采用选择与保护光环例已移至 05 §7。

[一手] 项目自己的 [Conditions Wiki](https://github.com/OpenRA/OpenRA/wiki/Conditions)列出实际光环、铁幕与 EMP 使用；页面示例明确针对旧 release-20180307。本次采用上述固定现行路径核实，不把旧 Wiki 的 structures.yaml 路径当当前文件布局。

<a id="s18-3"></a>
### 2. Shattered Pixel Dungeon：重复施加未必产生独立层

[一手] 独立作者的回合 roguelike SPD 固定`57a4e06a4caf162446d1c28caa7983f0493fecf0`（2026-10-06 UTC，v4.0.2 发行更新）：

- [Buff.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Buff.java)：append 创建新实例，affect 优先取同类现有实例；prolong 经 affect 后调用 postpone。按类 detach 会遍历该类效果全部撤销，不能当成某一次施放的独立释放
- [Actor.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java)：spend 增加调度时间，postpone 仅在原时间早于 now＋duration 时向后延。因此 prolong 是保留更晚结束点，不能从名字译成无条件时长相加
- [PotionOfHaste.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/potions/PotionOfHaste.java)实际使用 prolong；[FlavourBuff.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/FlavourBuff.java)到调度时刻 detach。这是单一可延期效果，不是每瓶药各建一层计时
- [PoisonDart.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/weapon/missiles/darts/PoisonDart.java)调用 affect(Poison).set；[Poison.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Poison.java)的 set 取 left 与新 duration 的最大值，另一个 extend 方法才加长；每次伤害由 left/3 的整数部分加一计算。到期或目标死亡 detach，存档保存 left

[研究] 上述真实消费者分别采用独立实例、较晚结束点和加时长；不是同一个“叠加”操作。

<a id="s18-4"></a>
### 3. Unity 与 UE 的采用边界

[一手] [Unity 6.3 SO 手册](https://docs.unity3d.com/6000.3/Documentation/Manual/class-ScriptableObject.html)支持多对象引用共享数据。[研究] Unity 用角色组件持有活效果／来源，剩余时长不回写定义。少量固定规则无需通用编辑器；已有合规模块先核合并键和移除范围，避免另建同名异义层。

[一手] UE 5.8 公开 GAS 文档：非 instant 效果的[StackingType](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingType)中 None 为每次独立实例，AggregateBySource／AggregateByTarget 分别按来源／目标聚合；[持续时间策略](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingDurationP-?lang=en-US)分刷新、不刷新、加时长；[到期策略](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/GameplayAbilities/EGameplayEffectStackingExpiratio-)分清整栈、减层后刷新、只刷新。采用已读的官方缩短路径正文，最初的长 URL 获取失败，未用第三方教程补证。

[研究] 已用GAS先核原生策略；按来源聚合不等于逐次计时，到期减层不等于历史施放各自到期。合并键与撤销粒度须一起定；未核受限源码／Lyra，枚举不证明预测、网络、驱散、句柄全部正确。

<a id="s18-5"></a>
### 4. 窄二改题、许可与验证范围

二改已统一到 05 §7 的蓄力／灼烧／双光环例；以下许可仍适用。来源撤销不等于合并政策，按类清除也不等于撤一次授予。[研究]

[一手] 文件头及[OpenRA COPYING](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/COPYING)、[SPD LICENSE.txt](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/LICENSE.txt)均为GPL-3.0-or-later；直接复用须处理分发义务及素材权利，不作闭源Unity／UE即插模块。

**范围 [研究]**：上表用例、帧时序、AI二改成功率均未测；独立review与仓库离线检查仅核知识库交付。

<a id="s19-1"></a>
## 导航补研：通路、局部让路与停止位置

核实：2026-10-15（UTC+8）。[研究] 05 §3补导航选择：任务结束／有路径不等于移动自然。追击堵塞先分通路、让路、停距，再评估原生能力，不默认升BT、重算频率或人群框架。

<a id="s19-2"></a>
### 1. 先过许可，再借真实游戏的局部机制

[一手] Overgrowth [245fe482](https://github.com/WolfireGames/overgrowth/tree/245fe4828631c84c0023d29d1525f5716ccb6106)（2025-03-20）根LICENSE／README／enemycontrol.as为Apache-2.0，代码可依条款复用，原美术关卡另核；仓库由社区运行，源码可得不保证维护。[研究] 不移植自研引擎底座，Factorio复盘不授素材源码，原生组件仍循各引擎条款。

**碰撞政策改变拥堵。** [一手] [FFF316，2019-10-11](https://www.factorio.com/blog/post/fff-316)：群组各自攻击后虽有路径却互挡绕转，团队取消同类硬碰撞、保留 separation 减少堆叠，并承认可能需要调整平衡。[研究] 借此诊断拥堵；依赖堵路、推挤、卡位的玩法仍须保留身体规则，不能一律穿同类。

**走到哪与如何停／让分开。** [一手] [enemycontrol.as](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/enemycontrol.as)：GetRepulsorForce（3295–3330）累加同队排斥并发 excuse_me，消息（1021–1022）设置 move_delay；GetCheckedRepulsorForce（2651–2661）用 NavRaycast 限制排斥；GetNavMeshMovement（3075–3121）按 target_dist／strafe_vel 投射接近与侧移目标，停距减速后加受限排斥并限方向长度。[研究] 仅借职责划分，未证明参数适合其他游戏，或物理碰撞已完全消除。

<a id="s19-3"></a>
### 2. 重寻路不能统一加速，也不能统一节流

[一手] [FFF121，2016-01-15](https://www.factorio.com/blog/post/fff-121)：短距离直行／局部启发式会卡角落，另复用路径中段并缓存不可达结果以减少昂贵搜索。[研究] 机制针对该游戏规模与请求分布；未核通路改变后的缓存失效实现，不据此要求小项目自建缓存。

[一手] Overgrowth 同文件 GetNavMeshMovement（2974–2991）每次进入调用 GetPath(target_point)；GetPath（2526–2538）重新查询、重置路径点，接近／侧移还会重查。[研究] 先沿用原生移动目标跟随；查询实测成热点才比目标变化阈值、时间预算或复用，同时保留急转响应与障碍更新的正确性。静读不能判它慢，Factorio 也不支持统一低频或毫秒间隔。

[一手] Overgrowth [navmesh.cpp 的 FindPath](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/AI/navmesh.cpp#L874-L957)还区分 partial result 与终点多边形是否真正到达。[研究] 读到非空路径不能自行判“到达目标”；这与已有 Behavior 不可达终止契约相接，不另造任务框架。

<a id="s19-4"></a>
### 3. 原生能力的具体采用边界

- **Unity，AI Navigation 2.0.16**：[AboutObstacles](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/AboutObstacles.html)说明未 carving 的障碍主要通过短距离局部避让处理，拥挤障碍可能绕不过去；会堵路但通常静止的箱子等适合 carving。默认 Carve Only Stationary 在移动时移除洞，稳定达到时间阈值后再更新；大而缓慢移动的障碍可选择移动超阈值时更新。NavMesh 查询须考虑修改后一帧才生效。[一手] [研究] “动态”不是一律每帧重建网格或全都 carving；移动人群与改变通路的门／箱子应分别处理
- **Unity 位移权**：[MixingComponents](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/MixingComponents.html)要求信息单向流动，Agent 与非运动学刚体、Root Motion 争写会冲突；Agent 与 Obstacle 同时启用会自我避让，carving 更可能使其不断映射到洞边。动画跟随速度的简单方案仍可能脚滑。[一手] [研究] 因此声明一个最终位移所有者，不能把行为节点成功当成动画与运动一致；不在此重复动画专题
- **UE，公开文档显示5.8**：[Using Avoidance](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-avoidance-with-the-navigation-system-in-unreal-engine)区分 CharacterMovement 的 RVO 与 Detour Crowd，要求二者独立择一使用。RVO 不使用 NavMesh 约束，可能走出边界；Detour Crowd 结合走廊可见性／拓扑优化，最大 Agent 数量由设置限定。[一手] [研究] 已满足需求的方案保留；需要走廊约束／更可配群体行为时再评估 Detour Crowd，核半径和数量，不叠开，不把 Unity carving 的时序映射成 UE 承诺。这里未证实任何 UE 特定项目的运行时障碍更新配置

**门还涉及角色能力与动作（2026-10-20，UTC+8核实）。** [一手] Unity AI Navigation 2.0.16 的 [Areas and Costs](https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/AreasAndCosts.html)用人类能过门、僵尸不能过门解释 AreaMask；区域也可赋给 NavMeshLink，路径成本只表示偏好。Unity 6.3 [CompleteOffMeshLink](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AI.NavMeshAgent.CompleteOffMeshLink.html)说明关闭自动通过后 Agent 停在链接上等待完成调用，Agent 在链接上时该调用会移到另一端有效 NavMesh 位置，并非动画完成通知。[研究] 先用原生过滤／链接表达适合的通路，已有状态负责开门、等待与通行，完成前或被打断时勿提前调用完成。AreaMask 按区域类别过滤；单门动态状态、个体钥匙／权限仍需项目同步，不能为一个无钥匙角色全局禁用链接而误挡有钥匙者。自由通行门可保留原表示，不要求每门建链接，也不把 Unity 时序外推到 UE。

[一手] OpenMW 已合并 [PR2510](https://github.com/OpenMW/openmw/pull/2510)，固定 [6861d9d5](https://github.com/OpenMW/openmw/commit/6861d9d5e52fada169b44ebe202ce8ba2f9d52c6)：openDoors 排除空路径／游荡，检查近门是否在角色到下一路径点之间，并保留非传送门、无陷阱、未锁定等条件。[合并前评审](https://github.com/OpenMW/openmw/pull/2510#issuecomment-554765044)认为本修订可用，另记录跟随者走向锁门而舍弃附近未锁门，注明与本 PR 不直接相关。[研究] 这是历史并存的选路反例，支持把动作与路径资格分别处理，不表明修订引入该缺陷或最新版本仍有缺陷。只借机制；[固定版 LICENSE](https://github.com/OpenMW/openmw/blob/6861d9d5e52fada169b44ebe202ce8ba2f9d52c6/LICENSE)为 GPL 文本，不把引擎代码当闭源即插模块。

[一手] [PR2494 作者自测](https://github.com/OpenMW/openmw/pull/2494#issuecomment-522138065)在五个地点反复战斗／关门，旧路径检测374次、均值约13.4μs，近门查询2999次、均值约2.5μs；前者单次较贵、累计反而较少。2510作者称改用较便宜的包围盒相交检查；未附新旧同条件对照。2494回滚是[误点合并](https://github.com/OpenMW/openmw/pull/2494#issuecomment-525438103)，不是运行失败后的撤回。[研究] 这些旧测量不证明2510收益或目标项目预算；增加检查与权限同步是可见实现成本，工时和净收益未知。已有原生能力满足时保留，仅在具体门规则表达不足时补局部交互，不借此升级导航框架。

<a id="s19-5"></a>
### 4. 后续只预注册一个二改遭遇

[研究] **二改预注册**：追击停距基线增加同队敌人与堵门箱；同房间验目标反向、堵门移开、窄门会车、追击转攻击／眩晕、退出重启。另核同门不同角色能力、锁门旁有未锁门、开门途中打断；记通路、目的地、期望／实际位移、停距与旧请求。

[研究] 真人核摆动、贴墙、急转、脚滑、挤叠及身体卡位；测查询与移动总成本。原生满足即停；让路导致越界、错停或破坏卡位时收窄／撤回，不继续叠平滑。AI补生命周期与轨迹，人定碰撞、停距和自然度。


<a id="s21-1"></a>
## 受限动作补研：开放意图不等于更强战斗 AI

核实：2026-10-15（UTC+8）；主线二／三。[研究] 03 §2区分规则战术与开放意图的语义缺口；动作名合法不代表对象、时机、结果正确，执行寿命沿05。

<a id="s21-2"></a>
### 1. 三个作者体系分别支持什么

- **Factorio：规则服务策略。** [一手：StrangePan／Earendel 历史复盘] [FFF425（2024-08-23）](https://www.factorio.com/blog/post/fff-425)说明跨墙敌人若攻击全厂会逼玩家处处布防，故用 Gleba 孢子排放集中攻击设施。[研究] 规则已能产生所需战术就保留；没有效用、行为树或 LLM 的性能对照，脚本、评分、BT 分工仅本文建议。
- **Mantella：语义到动作。** [一手] Python 固定`c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac`（2026-07-16），Skyrim 端`0c5f8513aff61cda1f32c81a962eee36ba74fdb7`（2026-07-11）。[Follow定义](https://github.com/art-from-the-machine/Mantella/blob/c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac/data/actions/follow.json)把被说服同行角色列入 source、范围 conversation，标实验性且可能破坏 NPC AI packages。[研究] 仅作“自由说服→指定同行”窄候选，回复不等于行动；非完整原创商业游戏或留存证据。
- **GoodAI：有动作不保证有挑战。** [一手：历史作者说明] [2024-04-29 FAQ](https://www.goodai.com/ai-people-announcing-the-next-evolution-of-gaming-ai-npcs/)称环境／人物／记忆进模型、游戏执行动作并回传失败，也承认会声称交物而世界未发生；[2024-09-19 Alpha说明](https://www.goodai.com/ai-people-alpha-officially-released/)定位技术概念验证、挑战有限且起初无终局目标；[2025-04-30公告](https://www.goodai.com/ai-people-entered-the-closed-phase/)无限期关闭当前版本、重新考虑玩家参与感，[现行入口](https://www.goodai.com/ai-in-games/)仍为封闭开发。[研究] 产品状态与作者解释不能证明 LLM 导致关闭，新颖行为不代玩家价值，也非当前可直接试玩候选。

<a id="s21-3"></a>
### 2. 固定调用链：required 与兼容回退为什么还不够

[一手：源码静读] 上述两个快照未核发行配对，实际消费链如下：

1. Python [function_manager.py](https://github.com/art-from-the-machine/Mantella/blob/c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac/src/actions/function_manager.py)的工具定义构造会传出 `required`，但 `_validate_arguments_against_schema` 只筛掉未知参数名，没有在这里验证必填齐全或类型。`parse_function_calls` 遇畸形 JSON 将参数置为空字典；空字典仍可生成只含 identifier 的工具结果。有效参数存在时则另有角色范围过滤。不能将函数名里的 validate 理解为完整契约验证。
2. Skyrim [MantellaConversation.psc](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaConversation.psc#L660-L708)按是否有 arguments 字典选择 advanced 或 legacy 事件。advanced [Follow处理器](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaAdvancedAction_Follow.psc)按 source 名称解析会话 Actor，再设置 WaitingForPlayer、faction，重启 follower quest、EvaluatePackage；真正的移动交给原有游戏系统。
3. 同版 [legacy处理器](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/Scripts/Source/MantellaAction_OffendForgiveFollow.psc)在会话可取得时遍历参与者，使符合条件的非玩家 NPC 跟随；只有会话不可取得才退到 speaker。它与路由处“缺参数回到 speaker-only”的注释并不等价。[研究] 这是静读可见的作用域扩大路径，未运行重现，不能声称玩家必然遇到；但足以拒绝“有白名单／JSON required就可安全执行”的采用理由。

[一手] [#441](https://github.com/art-from-the-machine/Mantella/issues/441)记录多人会话将`Npcname: Follow:`念作台词，2025-12-11 标由[Spell #128](https://github.com/art-from-the-machine/Mantella-Spell/pull/128)修复关闭。[研究] 这是已修历史问题，与上述缺参数路径分开；关单不能证明所有模型／多角色动作可靠。

**采用 [研究]**：执行侧重核允许动作、精确对象、前置条件和活任务；缺字段、无对象、超时／取消后回包拒绝或保持状态，不能扩大到全体。说服阈值、拒绝权与错误的玩法作用由设计定；有效JSON不等于授权或执行成功。

<a id="s21-4"></a>
### 3. 后续窄对照与撤回，不在本轮运行

[研究] **预注册**：指定角色同行，同状态／地图／执行器／取消下比菜单规则与LLM开放措辞。只有额外策略才有采用理由；同义改写按钮则保留规则。觅食、撤退、排序无开放语义缺口时沿规则／评分及05生命周期。

- 正常：指定 A 同行，检查 A 实际进入跟随且 B 不变；拒绝、撤销与再次邀请分别保留明确结果
- 失败：缺 source、未知角色、角色离场、回复到达前取消／死亡、重复回包；不得扩大目标或让旧请求重启跟随
- 玩法：玩家是否能解释为何同意／拒绝、是否获得菜单无法表达的有效策略；不能只问“像不像真人”，也不以动作有效率／战斗胜率代替体验
- 成本：记录从请求到世界响应的等待、超时、每段游玩调用与费用，以及新增一种角色限制后的修改成本；阈值按本玩法节奏和发行预算预先决定，不发明统一毫秒或价格门槛

[研究] 无额外选择保留基线；错对象、虚假交付、迟到动作则撤接口待修；超等待／费用预算先缩频率角色，仍不够则撤。核心开放交涉退成菜单会改玩法，须承认重做成本。

[一手] [Mantella LICENSE](https://github.com/art-from-the-machine/Mantella/blob/c0c1ae6db01f3c2a14dbab8ec5c3e6419e4f6bac/LICENSE)为AGPLv3，[Mantella-Spell LICENSE](https://github.com/art-from-the-machine/Mantella-Spell/blob/0c5f8513aff61cda1f32c81a962eee36ba74fdb7/LICENSE)为MIT；不作闭源即插模组，Skyrim内容、模型、TTS、服务另核。Factorio／GoodAI文章不授游戏复用权。

**历史验证 [研究]**：本单元独立审查及14阶段离线（非空无skip）、diff检查通过，仅核文档；Skyrim固定路径不证明Unity／UE插件同实现。

<a id="s24-1"></a>
## 屏外威胁补研：补信息还是改攻击

核实：2026-10-15 UTC。主线一／三；在既有“无解先改空间”的建议上，进一步区分视口外但规则允许获知的信息、角色未发现与已经承诺的攻击。新证据为三个作者的不同方案及 Shattered Pixel Dungeon 固定结算路径；不重复 04 的信号强度或 05 的相机实现。[研究]

<a id="s24-2"></a>
### 三种选择及代价

- **可知信息超视口：补查看。** [一手：2024-02-11 作者记录] [Cogmind 放大视图 QoL](https://www.gridsagegames.com/blog/2024/02/adventures-in-map-zooming-part-5-qol/)用边缘标记补放大损失、避开已显示机器人，支持聚焦敌群再返回；普通可见／传感器信息表现不同，范围参照未放大窗口。[研究] 可在行动前查看才适用，非实时转移视图安全证据；屏外不自动等于未知或可揭示，不复制整套 UI。
- **路线造成屏外受击：先改布局。** [一手：2020-01-21 作者复盘] [Specter of Torment 房间设计](https://www.yachtclubgames.com/blog/specter-of-torment-level-design-deep-dive-2-5/)在进房过渡以触手入镜、颜色、运动介绍 Grapps，并以天花板防从画面上方绕过后屏外中招。作者反对放慢伸出，免误示可抢跑。[研究] 空间理解不足时，封不当路线可比警报有效，但会减自由度。
- **受限视野是本体：改攻击应对。** [一手：2023-06-30 开发中访谈] [Luna Abyss 设计者／程序员](https://www.unrealengine.com/developer-interviews/how-unreal-engine-empowered-a-small-team-to-build-luna-abyss-beautiful-bullet-hell-prison)称第一人称弹幕要在面向攻击者时从前方来，背对时靠慢弹／长预告及声音留转头时间，身体边界不可见则加宽弹隙。[研究] 团队“避免不可见伤害”未独立复测；它保扫视躲避时间，Grapps 需迅速封路，不能统一“都放慢”或迁移速度／间距。

<a id="s24-3"></a>
### 固定实现反例：不显示演出，不等于不结算

[一手：源码静读] `00-Evan/shattered-pixel-dungeon@57a4e06a4caf162446d1c28caa7983f0493fecf0`：

- [Eye.java L91–148](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Eye.java#L91-L148)：`canAttack` 用 Eye 自身的 `fieldOfView` 与弹道判断；蓄力后条件不再满足时仍可返回 `beamCharged`。`doAttack` 首先蓄力并消耗时间；释放时用玩家 `heroFOV` 判定是否播放 zap，只有本体位置与射线碰撞位置均不在 `heroFOV` 时，才走直接调用 `deathGaze()` 的分支。
- [EyeSprite.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/sprites/EyeSprite.java)：有 zap 动画时在完成回调调用同一 `deathGaze()`；蓄力声音另受 sprite 的 `visible` 条件限制。

[研究] 此链分开行动资格、角色视野与表现；heroFOV不是屏幕矩形，目标仍合条件时canAttack会更新弹道／位置，不是所有蓄力锁最初目标。未证所有情境公平；源码GPL-3.0-or-later。

<a id="s24-4"></a>
### 最小采用与下一次内容修改

[研究] ✅ 沿技能与提示层声明玩家可知信息、察觉到反制的机会及出入画面对攻击的影响。表现裁剪不能意外改结算；可见仍躲不开就改方向／节奏／空间，放大漏掉可知对象才补查看。失去的信息不永久追踪，允许未知／突袭的玩法另定。

[研究] **二改预注册**：同混合遭遇加远程攻击，比正常／缩小视域，验起手后转开、回看、失去角色视野、静音减特效。核察觉反制及已承诺攻击继续／取消／重瞄；标记遮近敌、查看抢瞄准或转头意外冻结敌人时撤回。AI追路径，人定未知风险。

**特有范围**：仅读作者图示说明与实现，未实际播放视频、操作游戏或测识别；建议不依赖Unity／UE特性。

<a id="s27-1"></a>
## 感知补研：角色知道什么与导演调度什么

核实：2026-10-16（UTC+8）；主线三，GC。[研究] 05 §3补信息来源：躲避／误导有效时，保目标身份不授权搜索实时位置；执行、移动、玩家提示仍各沿原机制。

<a id="s27-2"></a>
### 跨类型证据与反例

- **Homebody 恐怖探索。** [一手：Alex Belzer 创作者自述] 系统／玩法程序员及技术设计者的[项目页](https://www.alexbelzer.com/work/homebody)称远离玩家时加快巡逻，并用盲角支持甩脱和遭遇。[研究] 支持巡逻＋空间调压，未公开足以核实完整感知记忆的数据结构；对 Alien: Isolation／Resident Evil 2 及公平性的比较仅属作者解释，不是两作实现证据，GOAP 也不升默认。
- **SPD 回合 roguelike。** [一手] 固定`57a4e06a4caf162446d1c28caa7983f0493fecf0`的[Mob.Hunting L1284–1324](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L1284-L1324)分 enemy 对象与 target 格，enemyInFOV 时更新位置后移动；[后续分支 L1345–1411](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L1345-L1411)在无法靠近且失视时转游荡，逃跑也可用旧位置。[研究] 仅这些基类分支，不能证明所有怪物／子类／选敌都不读真值。
- **共享信息的反例。** [一手] 同版本[processSwarmIntel L298–323](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Mob.java#L298-L323)在群体智能挑战、追猎并感知目标等条件下，传位置给范围内未追猎同阵营怪物。[研究] 队友报告可合法，不要求人人只信亲见。
- **Left 4 Dead 全局调度。** [一手：Mike Booth／Valve 2009 讲义] [The AI Systems of Left 4 Dead](https://cdn.akamai.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf)第 69 页按队伍不可见区域及敌种选生成点，第 79–82 页估压力、调数量；Relax 时既有特殊感染者仍攻击。[研究] 导演读真值可合理，不等于角色持续精确定位；未揭示每只感染者的感知实现，不推荐整套移植或计作本仓实测。

<a id="s27-3"></a>
### 原生入口：位置输入、感知状态与遗忘不是同一开关

- **Unity Behavior 1.0 文档渠道。** [一手] [节点清单](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/manual/node-types.html)分 Navigate To Location 位置与 Navigate To Target 对象，均用 NavMeshAgent，缺少时可退 Transform。[研究] 搜索用位置变量，勿被实时对象坐标覆盖；未核实目标刷新频率、内置感知记忆或各版本等价性，1.0 渠道不称最新发行。
- **UE 5.8 文档。** [一手] [AI Perception](https://dev.epicgames.com/documentation/en-us/unreal-engine/ai-perception-in-unreal-engine)分 Currently／Known Perceived Actors，刺激含 Age、Expiration Age、Stimulus Location、Successfully Sensed；Forget Stale Actors 配 Max Age 遗忘，0 为不遗忘。[Move To 任务](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-behavior-tree-node-reference-tasks)的 Track Moving Goal 随 Actor 更新路径。[研究] 搜索时可切换位置键，并检查旧任务是否仍追踪对象；感知丢失不自动清理自定义黑板或停止追踪，失去视野也不使听觉、队友报告等允许的线索失效。

<a id="s27-4"></a>
### 采用、撤回与二改预注册

[研究] ✅ 有限情报改变选择才保存身份、已知位置、感知与按需线索年龄；声明覆盖、搜索、返回／追踪规则。导演提示有来源精度，读真值不授权角色搜索读真值。直接追踪是玩法或现有机制够用则不加记忆库。

[研究] **二改预注册**：追逐加拐角／诱饵，记来源、已知位置、移动目标，验失视后移动、别处声音、队友报告、重现及导演继续调压。允许追踪者不强制停追；记忆只降低响应却没产生所需选择就收窄／撤回。AI追读路径，人验躲避、搜索与压力。

**边界 [一手／研究]**：SPD文件头GPL-3.0-or-later，根[LICENSE.txt](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/LICENSE.txt)为GPLv3。公开网页／Valve讲义及选定链路不证明完整感知实现，最佳遗忘时长未知；共同政策只维护一份。

<a id="s28-1"></a>
## 选敌补研：候选、保持与主动切换

核实：2026-10-16（UTC+8）。主线一／三，GC。[研究] 改变 05 §7 的选择：需要保持攻击意图时，先定义候选资格、旧目标与主动切换，不直接扩大辅助范围或每帧选最近。这里只处理玩家选敌；不重复 NPC 感知、输入死区与枪口遮挡，也不新增通用目标管理框架。

<a id="s28-2"></a>
### 跨类型机制与反例

- **Cogmind 回合 roguelike。** [一手：Beta 17.1 手册] [官方文本](https://www.gridsagegames.com/cogmind/manual.txt)的 Targeting Behavior：按`f`恢复最近机器人／空地目标，仍可见的引导武器路径点也恢复；无旧目标或已失效才取最近。前后循环按距离，通常只含有武装敌对对象，无此类可见对象才含全部非盟友。查看模式含有／无武装非盟友，可在那里选无武装目标再开火。[研究] 自动候选与直接指定分开；未核实时锁定、全部失效条件或保持阈值。搜索 booklet 为 Beta 7，以新读文本为准。
- **Hades 原作俯视动作。** [一手：历史补丁] [Early Access Patch 039，2020-01-28](https://www.supergiantgames.com/blog/hades-long-winter-update-patch-notes/)扩大手柄 Adamant Rail autolock radius；[Early Access Patch 044，2020-06-23](https://www.supergiantgames.com/blog/hades-the-blood-price-update-patch-notes/)排除 Companion Rib 召唤的 Skelly。后一页页眉 March 1st 与正文不同，本节按 June 23 补丁节。[研究] 范围／候选各自取舍，非“辅助越强越好”；不泛化全部友方、推断可手动攻击 Skelly，或视作 Hades II／现版全武器规则。两修订无对照体验测量。
- **Brotato 生存动作。** [一手：官方商店] [Features](https://store.steampowered.com/app/1942280/Brotato/)分别列默认自动开火与手动瞄准。[研究] 开火与瞄准可分选；未公开排序、保持、平台细节，也未证手瞄关闭自动开火。
- **OpenRA RTS 距离反例。** [一手：固定发行源码] 标签 API 将`release-20250330`解析为`b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787`。[AutoTarget.ChooseTarget L349–451](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Traits/AutoTarget.cs#L349-L451)先筛关系、类型、可见性、武器资格；禁移动核射程、禁转向核射界，优先级相同才比距离。[研究] 自动选敌非总最近；不能证明显式命令永不被覆盖或动作锁定手感，不移植整套 RTS 调度体系。

<a id="s28-3"></a>
### 最小采用、撤回与二改预注册

[研究] ✅ 需保持意图时，沿输入／武器分定候选、保持、失效与主动改选，对象／位置均可。自动过滤挡住合法攻击时补直接选择；持续重选／精确瞄准本是玩法则保留，不强制双模式或统一评分阈值。

[研究] **二改预注册**：加更近干扰物／可攻击召唤物，验保持、改选、死亡／失效、候选外合法对象及允许的空地；支持模式切换才验切回。记输入、候选、目标、原因，区分选错与命中失败；保持妨碍改选时收窄，不能只加强吸附。

**边界 [一手／研究]**：OpenRA文件GPL-3.0-or-later；仅机制借鉴。官方手册、公告、商店与固定源码不证明体验／效率，政策与引擎无关。

<a id="s29-1"></a>
## 意图预告补研：确定结果、条件变化与有意未知

主线一／三，GC；核实：2026-10-16（UTC+8）。
改变建议：05 §7 从看清起手进一步区分预告精度与有效条件，不把全知 UI 当默认质量升级。
新证据：Into the Breach 作者取向及预览／规则修订、Slay the Spire 意图设计、Amnesia 信息政策反例。[研究]

<a id="s29-2"></a>
### 决策信息不等于完整行为表

- **Into the Breach：确定结果供求解。** [一手：Justin Ma 首发前设计访谈] [2018-02-23 访谈](https://www.gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-)将预告、少随机与解谜连接，保护建筑、牺牲机甲、推移形成解法。[研究] 分配有限行动、改变已知攻击后果时可试；非发行后受控评价，也不指整局无随机。
- **Slay the Spire：显示决策所需。** [一手：两位创始人视频转写] [2019-05-02 访谈](https://arstechnica.com/video/watch/war-stories-slay-the-spire-war-stories/?c=series)称随机行动无预告难选攻防、逐敌长文本又繁重，遂用意图图标；部分敌人随玩家行为改意图。[研究] 借粒度／条件变化，不能证明每敌每牌后重算或要求同图标体系。
- **Amnesia：有意未知。** [一手：Thomas Grip 复盘] [2019-10-15 文章 Lesson 7](https://frictionalgames.com/2019-10-9-years-9-lessons-on-horror/)将理智系统从直白改含糊以留想象紧张。[研究] 是理智而非下一招 UI，只反证透明并非普遍更好；不能证明隐藏攻击的收益，更不允许虚假确定提示。

[研究] 沿行动状态选信息政策：确定且供计划的明确显示；可变结果标当前条件并更新／撤销；有价值的试探可隐藏。只需攻防类别不列完整行为表，未知仅造成无意义盲试时才补信息，表现不能许诺规则未锁定结果。

<a id="s29-3"></a>
### 已发布修订：可以删显示，也可以改规则

[一手：开发者公告] Matthew 的 [2023-01-23 补丁帖](https://steamcommunity.com/app/590380/discussions/0/3765606580168752432/)明确标记 developer：移除 Earth Mover／Mine Bots 的 Attack Order 显示，因为它们没有排队攻击；调整 Wind Torrent 的推移次序，使结果与效果预览更一致。标题写 v1.2.88，正文写 1.2.87 Changelog，本节保留冲突，以日期公告指认，不自行断定精确补丁归属。

[研究] 前者撤虚假顺序，后者改互动规则保预测，不只修UI；未披露根因，不能断定代码分叉或要求统一模拟框架。未证当前全部预览正确。

<a id="s29-4"></a>
### 第二次修改：仅预注册，未执行

[研究] 在已有攻击上改变一个会影响选择的条件，如推移顺序、护盾或目标死亡，保留同一局面对照：

1. 条件不变时，核预告的动作、对象、数值和次序与执行一致；只核设计承诺显示的部分
2. 玩家动作改变条件时，核已锁定部分仍守承诺，可变部分按规则更新或撤销；不把旧提示继续留着当不确定性
3. 没有排队动作的对象不出现虚假排序；有意隐藏的部分也不得因调试／新 UI 意外公开
4. 已有预演／撤销才核预演退出后状态、资源和下一行动；不为做这些检查而新增模拟器

[研究] 记录提示依据、条件变化和最终执行；AI 追消费者／回归，由人决定保留哪些未知、提示是否足以支持选择。失真时先修条件同步、缩小显示承诺或简化规则，信息过多就退必要粒度。

**范围 [研究]**：公开访谈／公告，未读商业反编译代码；只支持设计、作者观察与历史维护，无通用体验排名。建议与引擎无关。

<a id="s32-1"></a>
## 效果时钟补研：调度时间、行动次数与到期显示

核实：2026-10-16（UTC+8）；2026-10-25 将时间／周期／二改规范整合进 [05 §7](../../domains/game-dev/05-gameplay-architecture.md#多来源效果先定合并规则再增加框架)。本节保 SPD／Flare 的不同调度机制及显示反例。[研究]

<a id="s32-2"></a>
### 回合玩法：调度时间不等于输入次数

[一手] SPD 固定`57a4e06a4caf162446d1c28caa7983f0493fecf0`：[Actor L39–56](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java#L39-L56)定 TICK／同时间优先级，[调度 L250–325](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java#L250-L325)选累计时间最早者、优先级破平局；[Hero L868–887](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/hero/Hero.java#L868-L887)无动作且未休息时 ready 后等待。因此该输入等待路径不按现实秒扣效果，不推广全部回合游戏。

[一手] [Char.speed L770–782](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L770-L782)读 Haste，[Hero移动 L1873–1906](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/hero/Hero.java#L1873-L1906)以移动耗时／速度消费调度时间；[Poison.act](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Poison.java)自行跳伤、耗 TICK、减剩余后判断移除。[研究] 同一毒时段加速可增加移动机会，不改成一步一跳，也不推出所有攻击／效果加速。

[一手] [FlavourBuff L26–47](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/FlavourBuff.java#L26-L47)被调度时移除；[Buff.visualcooldown L135–143](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/Buff.java#L135-L143)显示 cooldown+1，注释称普通 Buff 晚于英雄行动。[研究] 剩余值按行动边界解释，不照搬加一；承诺“接下来几次有效攻击”就按该行动消费，不以调度时间近似，亦非 SPD 全效果规则。

<a id="s32-3"></a>
### 即时玩法：模拟秒、菜单与恢复各有边界

[一手] Flare 引擎`1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f`（2026-10-05）、游戏`af6eee6d339ac98011864bfe89da837fe7769c28`（2026-08-08），未核发行配对。[Ranger L25–66](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/powers/categories/ranger.txt#L25-L66)分别设 Haste 移动／攻击秒数；[毒云配置](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/powers/base/ranger/poison_shot_aoe_1.txt)授 poison，[effects定义](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/mods/empyrean_campaign/powers/effects.txt)映射 damage，均为实际消费者。

[一手] [Timer L188–244](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/Utils.cpp#L188-L244)随逻辑步递减、依配置步频判整秒；[EffectManager L390–497](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/EffectManager.cpp#L390-L497)先移除到期效果，再检查本步周期效果，最后推进计时。周期检查取剩余时间的整秒边界，不足一秒另有初始触发条件。[研究] N 秒不足以定义首末跳／跳数，也不意味着首跳必等满一秒；不把 Flare 算法设通用默认。

[一手] [GameStatePlay L857–900](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/GameStatePlay.cpp#L857-L900)未暂停才正常更新角色，经[Avatar L490](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/Avatar.cpp#L490)、[StatBlock L1096–1097](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/StatBlock.cpp#L1096-L1097)推进效果；[MenuManager L917–919](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/MenuManager.cpp#L917-L919)按 menus_pause 决定普通菜单暂停，退出菜单等另有强制条件；[main L195–235](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/src/main.cpp#L195-L235)最小化恢复时重置逻辑时间，暂停时也不累积补帧。[研究] 要冻结的间隔才不消费时间，也不在恢复时追补；菜单继续计时也合法。只核正常更新／恢复，非暂停屏蔽全部状态修改。

<a id="s32-4"></a>
### 显示修订与二改预注册

- [一手：历史报告／维护] SPD [#1707](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1707)报告加速下冻结时间显示-0；[维护者解释](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1707#issuecomment-2115939937)称逻辑容忍微小负数以免少给一次行动、显示未同步；[c9c6380](https://github.com/00-Evan/shattered-pixel-dungeon/commit/c9c63803492878a7fab35c2be3b74219440de9d2)修正图标取整与描述下限。未取得原用户的修复后复测，关单不能证明全到期显示正确
- [一手：历史反例] [#1843](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1843)报告 Salt Cube 剩余 17、17、15；[维护者2024-09-18回复](https://github.com/00-Evan/shattered-pixel-dungeon/issues/1843#issuecomment-2359484764)解释 Buff 的速度变化，但数值只在其行动时更新，选择保留。[研究] 跳变不等于结算错或玩家能理解，非当前复现
- [一手：近期修订] [58f0e5b，2026-07-06](https://github.com/flareteam/flare-engine/commit/58f0e5b1242680d6575e5035c960f3a5f025aaf7)分护盾强度／计时，使限时护盾 tooltip 显示期限。[研究] 支持量／期限分别显示，非毒／加速同病证据，无独立复测或体验测量

**边界 [一手／研究]**：SPD文件头GPL-3.0-or-later；Flare [README许可节](https://github.com/flareteam/flare-engine/blob/1969baeb89ebf94cf22e2bc2ed4e3d8413714d4f/README.md#license)为GPLv3-or-later，内容[LICENSE.txt](https://github.com/flareteam/flare-game/blob/af6eee6d339ac98011864bfe89da837fe7769c28/LICENSE.txt)为CC-BY-SA 3.0。未核快照组合兼容或跨设备恢复；时间／行动政策只写一份。

<a id="s33-1"></a>
## 效果读取时点：持续代价与一次承诺

核实：2026-10-16（UTC+8）；2026-10-25 将按字段选读取时点整合进 05 §7。以下为历史正式修订及单玩家显示反馈，不当作当前全技能规则。[一手／社区]

**持续收益与代价一起持续。** [一手] PoE [1.2.0正式补丁的General Balance Changes](https://www.pathofexile.com/forum/view-thread/998489)规定装备／支持宝石变动后持续技能更新；[开发者说明](https://www.pathofexile.com/forum/view-thread/951414)（2014-06-18 发布、10-10 修订）以 Mon’tregul’s Grasp 为例：快照换装保强僵尸又绕过少数量代价，限制后续装备设计。作者承认会削弱构筑，安排赛季间改，属设计理由非收益测量。字段仍不同步：生成等级须重召／新实例更新，Righteous Fire 拔技能仍持续，装备、被动、支持宝石分别处理。[研究] “修快照”不等于每跳重读全部字段。

**一次承诺可保快照。** [一手／研究] WoW [2014年正式6.0.2公告的Periodic Effects](https://worldofwarcraft.blizzard.com/en-us/news/15682579/the-iron-tide-602-patch-notes)将普通周期效果改逐跳重算，理由是择时收益伴随插件依赖／平衡压力；按上一击比例延迟兑现、专门强化下一技能的效果保留。动态只保增益期间收益，快照可延长至整段 DoT，技巧不同。同文刷新宽限为基础时长末 30%、重施最多延至基础时长 130%，不能证明所有例外刷新保旧强度；仅 2014 修订／理由，非 2026 全规则。

**快照刷新要可判断。** [社区] [2026-03-22玩家原帖](https://us.forums.blizzard.com/en/wow/t/feral-feedback-snapshotting-is-hard-with-current-cooldown-manager/2278000)要求图标显示旧流血实际保留的强化，而非仅当前增益／剩时。[研究] 单玩家信息需求，不核全部职业现规则、普遍体验或 2014 前后对照。

<a id="s34-1"></a>
## 属性修饰补研：计算顺序与重算

核实：2026-10-16（UTC+8）；2026-10-25 将重算与实际 HP 的实现建议整合进 05 §7。本节保计算顺序的修复链、固定消费者和许可。[研究]

**重建曾改变结果。** [一手：维护链] Wesnoth [#4419维护者例子](https://github.com/wesnoth/wesnoth/issues/4419#issuecomment-537258606)：先设最大 HP=100 再加 100 得 200，重建按类型重排却成 100；[报告者补充](https://github.com/wesnoth/wesnoth/issues/4419#issuecomment-537261328)称删无关修改也触发。[2020-08-20合入的#5085](https://github.com/wesnoth/wesnoth/pull/5085)采用记录顺序重放，不是讨论候选全实现。

**固定消费者。** 1.18.5对应`7a60ccb925afadc8ae7d4f47891f5ab329786da8`，不称最新版本。[到期删除](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L1237-L1267)会进入重建，[恢复基础与应用修改](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L984-L1026)及[记录顺序](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L2583-L2594)吻合该政策。[当前HP等状态](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/unit.cpp#L186-L207)另保留并受新上限约束，不自动满血。实际[Strong特质](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/data/core/macros/traits.cfg#L128-L146)修改近战，[攻击字段处理](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/units/attack_type.cpp#L431-L445)后仍经[战斗计算](https://github.com/wesnoth/wesnoth/blob/7a60ccb925afadc8ae7d4f47891f5ab329786da8/src/actions/attack.cpp#L182-L207)等后续规则，不能将基础字段当最终扣血。[一手：固定源码]

**倍率有阶段。** [一手／研究] SPD 4.0.2 `57a4e06a4caf162446d1c28caa7983f0493fecf0`的[萨满](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Shaman.java#L153-L170)授虚弱／易伤；[攻击链](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L479-L512)先攻击者虚弱×0.67，经取整、防御、扣护甲，再目标易伤×1.33，后续还有钩子、damage、护盾，中间值非最终 HP 差。[治疗药](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/potions/PotionOfHealing.java#L76-L84)移效果后下一击重查，不反算上一击。

OpenRA `release-20250330`固定`b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787`，[实际等级规则](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/mods/ra/rules/defaults.yaml#L60-L83)影响伤害；[发射侧／装甲处理](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Warheads/DamageWarhead.cs#L73-L90)和[承伤侧处理](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Traits/Health.cs#L158-L189)分阶段，存在整数转换；禁用[DamageMultiplier](https://github.com/OpenRA/OpenRA/blob/b4f3d8ae02b6bd6f4a3a5441e6d0daf7c5073787/OpenRA.Mods.Common/Traits/Multipliers/DamageMultiplier.cs#L32-L35)返回100%。[历史乘算评审](https://github.com/OpenRA/OpenRA/pull/6079#discussion_r15618105)关于200%与50%回到100%的讨论起点是装填间隔，不伪称伤害bug；这里只支持计算语义须明确，不能推广为整个管线只取整一次。[一手／研究]

**边界 [一手／研究]**：Wesnoth相关文件GPL-2.0-or-later，SPD／OpenRA为GPL-3.0-or-later。只核固定消费者与历史修复，不代表复现或当前全路径正确。


<a id="s36-1"></a>
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

<a id="s39-1"></a>
## 群体攻击协调：资格、站位与冷却分开

核实：2026-10-17（UTC+8）；GC／主线一、三。改变05 §7：把“调整攻击重叠”收窄为减敌、个体错峰与共享许可的条件选择；只读开发者材料、固定源码和引擎文档，未运行游戏、引擎、模型或玩家对照。[研究]

**✅ 先查玩家缺哪种应对，再决定限什么。** 单招已清楚但叠加失去反制，且仍需保留包围、选敌或范围攻击价值时，才给特定攻击类别加小共享许可；敌人数量、空间与预告本就不合适，先改遭遇。仅调独立冷却不能保证不同时到期；随机错峰是概率调整，不是并发上界。此为方案推导，非以下游戏的受控比较。[研究]

<a id="s39-2"></a>
### 生产取舍：参战预算不等于攻击帧计数

- **God of War (2018)。** Mihir Sheth 的 [GDC 2019 原讲稿](https://media.gdcvault.com/gdc2019/presentations/Sheth_Mihir_EvolvingCombat.pdf#page=39)第39–43页按资格、类型优先级、玩家目标和相机关系排序，从固定池分配 aggression tokens，不同类型可占不同份额；第55–62页另以区域／间距约束站位。第72页明确演示禁用攻击但保留 aggressiveness，不能把这份预算写成“同时伤害次数”。第50–56页记录加权寻位复杂、频繁失效和聚团，后来转向避免坏位置；这也反驳“加额度即可解决围攻”。这里是作者生产复盘，非本仓复现；不照搬例示数值或整套导演。[一手／研究]
- **Batman: Arkham City 的相反选择。** [CGW 2012期开发者采访，Combat Choreography](https://www.cgw.com/Publications/CGW/2011/Volume-34-Issue-9-Dec-Jan-2012-/Mean-Streets.aspx)中，David Hego说明相较Asylum增加并攻，同时提供双／三重反击；Tim Hanagan说明更多敌人技术可行却会使玩法混乱。支持“并发与反制共同设计、数量也可减少”，不证明使用某种token算法，也不把多人同步动画当单程序无美术的免费能力。[一手：实名作者陈述；研究：采用边界]
- **群涌是目标时保留群涌。** Valve [Left 4 Dead 原讲稿](https://cdn.akamai.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf#page=65)第65页描述集体冲锋；第81–82页的休整调节生成数量，现有特殊感染者仍能攻击。遭遇人口节奏和场上逐次攻击许可不同；不能据此推断L4D不存在任何局部攻击限制。[一手／研究]

<a id="s39-3"></a>
### 固定实现：共享额度的范围和退出比名字重要

静读 `ValveSoftware/source-sdk-2013@be57e3d01ac7d7aa6a2cacbfef187c0b46616db0`，只支持所列链路，不代表全部发行构建。[一手]

- [ai_squad.h](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/ai_squad.h#L17-L75)与[分配／释放](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/ai_squad.cpp#L579-L650)：同一squad按目标记录strategy slots，已有合适槽可保留，否则找空槽；不是空间坐标，也没有公平等待队列。[一手]
- [Combine选招](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/hl2/npc_combine.cpp#L1992-L2008)先争取ATTACK1–2，失败仍可取得独立GRENADE1；[建立射线](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/hl2/npc_combine.cpp#L1642-L1658)也可占攻击槽。因此两个主攻击槽既非全局威胁上限，也非仅在伤害帧持有；单体next-attack时间仍另存。[一手／研究]
- [换目标](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/ai_basenpc.cpp#L10081-L10098)先释放旧目标资格，[切schedule](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/ai_basenpc.cpp#L10515-L10537)与[死亡](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/ai_basenpc.cpp#L515-L524)有释放；[改去装填](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/src/game/server/hl2/npc_combine.cpp#L2194-L2208)也归还。自定义打断是否走到出口须单独核，不能把这一条链称为所有取消已安全。[一手／研究]

[固定许可证](https://github.com/ValveSoftware/source-sdk-2013/blob/be57e3d01ac7d7aa6a2cacbfef187c0b46616db0/LICENSE)为Source 1 SDK专用许可；这里只转述机制，不复制代码／资产，不推荐直接移植到Unity／UE商业项目。三家生产材料不是同任务性能或体验排名。[一手／研究]

<a id="s39-4"></a>
### 最小采用与第二次修改

| 症状／目标 | 先采用 | 代价与撤回条件 |
|---|---|---|
| 同批起手偶尔同步，允许重叠本身 | 保留个体冷却，必要时错峰 | 无严格上界；仍出现无应对组合，再比较共享许可 |
| 需保留多敌，但某类重招不能同时逼迫互斥应对 | 只限制该类起手／承诺阶段，定义未获准者行为 | 持有范围含准备还是恢复需明确；限制起手不限制已发弹体／持续伤害 |
| 同时接近造成堵路、预告互挡 | 沿现有导航补可达站位与间距；容量不够就改场地／减敌 | 站位可达不保证能出招；仅限攻击也不会疏通堵路 |
| 有意群压、范围清场或多重反制 | 保留可理解的并发；必要时调人口／节奏 | 一律轮流会抹掉原玩法价值，撤回过宽许可 |

以上为[研究]条件选择。Unity 6.3 [avoidancePriority](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AI.NavMeshAgent-avoidancePriority.html)决定避让优先级；UE 5.8 [RVO／Detour Crowd](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-avoidance-with-the-navigation-system-in-unreal-engine)处理动态避障。这些原生空间能力不能当作已提供攻击调度；沿既有状态／技能所有者补窄许可即可，不为此迁移行为树或GAS。[一手／研究]

**未执行的二改验收。** 在原双敌遭遇增加第三敌／远程招：记录请求、批准、归还和实际危险重叠；插入持有者死亡、打断、换目标、改招、不可达与重开。检查旧资格未遗留、旧回调不释放新持有者、持续有合法候选时没有意外全体等待；公平轮转并非必需，但饥饿不能被“未超额”掩盖。人数正确仍须核逃路和实际可用反制。若排队明显、空窗无聊或群压价值消失，收窄受限招式／占用区间或移除。未实测，不能声称更公平、省调试或AI生成收益。[研究]

<a id="s40-1"></a>
## 蓄力技能补研：按法识别、技能进度与释放

核实：2026-10-18（UTC+8）；2026-10-25 将蓄力设计、正常施放链与加速二改整合进 05 §7。本节保动作与输入契约差异。[研究]

- **历史设计拆分。** [一手] Hades II [2024-10-16 Olympic Update 官方公告](https://steamcommunity.com/games/1145350/announcements/detail/7057794870234137717?l=english)将 Sorceress 改为 Omega 动作加速，旧效果移至 Silver Wheel；后者在引导 Omega 时减慢周围事物。同页可含相邻更新，本轮按公告 ID `7057794870234137717` 与标题定位正文。[研究] 支持自身动作与周围减速可分别设计，不证明内部时钟、当前平衡或玩家体验改善。
- **满蓄仍可持有。** [一手] Veloren `21db1de49c7b57013acac7a309983b530a65b848`（2026-10-17）的 [charged_ranged.rs L59–66](https://github.com/veloren/veloren/blob/21db1de49c7b57013acac7a309983b530a65b848/common/src/states/charged_ranged.rs#L59-L66)按阶段 timer／charge_duration 给进度；[L93–178](https://github.com/veloren/veloren/blob/21db1de49c7b57013acac7a309983b530a65b848/common/src/states/charged_ranged.rs#L93-L178)在松开或能量不足且未发射时按蓄力比例发弹，满蓄按住仍持有。[utils.rs L1722–1757](https://github.com/veloren/veloren/blob/21db1de49c7b57013acac7a309983b530a65b848/common/src/states/utils.rs#L1722-L1757)分输入状态与 timer，后者以 dt 乘攻速及阶段倍率，Charge 用 charge_speed_modifier。[研究] 支持技能进度区别于单纯按住时长；未追其暂停链，不外推停顿政策。代码 [GPL-3.0](https://github.com/veloren/veloren/blob/21db1de49c7b57013acac7a309983b530a65b848/LICENSE)，这里只借机制。
- **Unity 输入计时不是提交回执。** [一手] [Input System 1.17 InputAction 文档](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.17/api/UnityEngine.InputSystem.InputAction.html#UnityEngine_InputSystem_InputAction_GetTimeoutCompletionPercentage)说明 timeout 完成率可到 1，而超时尚未由输入更新处理、动作未 performed。另核源码 `05e45ddbaf18a93245b068d787d74b738b90d01c` 的 [InputEvent L162–175](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Events/InputEvent.cs#L162-L175)真实时间线与 [StartTimeout L2289–2315](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Actions/InputActionState.cs#L2289-L2315)按输入时间加秒数注册；该 SHA 不宣称等同 1.17 包，暂停中是否处理还取决于更新与启用状态。
- **UE 可选全局缩放。** [一手] [UE 5.8 UInputTriggerTimedBase](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/EnhancedInput/UInputTriggerTimedBase?lang=en-US)的 bAffectedByTimeDilation 默认 false，选择是否将全局时间缩放用于 held duration；不据此承诺角色局部倍率、菜单暂停或动画也已同步。[研究] 只需此契约时保留原生触发器，不能因 Unity 路径不同就复刻输入层。

<a id="p111-deckbuilding"></a>
## P111：卡牌构筑，从出牌到下一场的完整闭环

核实：2026-10-23（UTC+8）。改变05 §7：从单招结算扩到单人PvE局内构筑的完整类型链，区分牌定义／本局永久牌／本战实例、唯一费用提交、有序触发、牌区循环、敌方回合与一次奖励。这里“永久”指本局跨战斗，并非账号解锁；局外meta沿原P105，不扩多人竞技、商业抽卡或完整Roguelike。[研究]

**结论：先借完整原型读通循环，或借交互组件补表现；两者都不等于生产底座。** NueDeck的资格主要在UI、规则与装饰随机共流，CardHouse示例先迁弃牌区再执行效果／费用，正好暴露“看得见出牌”与可靠结算的差别。以下只读资料／固定源码，未安装项目、未购买插件、未运行Unity／UE／第三方代码、模型或玩家实验；不声称性能、二改工时、乐趣、存档或AI效果已验证。[一手／研究]

### 作品对照：资源循环、信息与组合出口

| 决定性原文 | 已核事实与选择 |
|---|---|
| Mega Crit [2026-05-22 Neowsletter 22](https://www.megacrit.com/news/2026-5-22-neowsletter-issue-22/)；[STS2官方公告汇总](https://steamcommunity.com/app/2868840/allnews/?l=english)，Main Update #2 `v0.107.1`，2026-06-18 UTC／19 UTC+8 | 5月替换Doormaker仅在beta，6月进入主线，不能停在“尚未实装”。设计复杂度是官方解释，不能推出当前全部平衡已固定。[一手] |
| 同一官方汇总，`v0.107.1`工程师Ed说明与修订 | 多个派生seed的PRNG仍可能相关，曾可由开局act预测curse；改为xoshiro256**并由作者展示10k seed散点改善。这里只支持“分流之后仍需核相关与泄露”，不把作者检验当本仓统计验证，也不要求迁移所有项目RNG。[一手／研究] |
| 同版与2026-07-30 beta `v0.110.0`条目 | Howl From Beyond／Bombardment在抽入手**后**触发；Hellraiser仅在敌人全部无限HP时限9张防软锁。7月修部分场景泄露洗牌顺序，Juggling第三张Attack引出自动牌时应复制原牌而非自动牌。分别支持时序、退化循环、隐藏信息、源实例身份，不推断同一根因或通用9张上限。[一手／研究] |
| [Monster Train 2开发者访谈，2025-09](https://www.pcgamer.com/games/monster-train-2-lost-arsenal-update/)；仅开发者本人引语作一手，记者叙述作二手 | 费用、抽牌、容量具有跨构筑价值；作者解释永久成长路线低胜率可能因前期死亡，不能当统计已证明因果。Corruption的统计胜率与“不公平”感不同，支持把成型前生存和体验解释独立验，不照搬其平衡值。[一手／二手／研究] |
| Firaxis署名，[Marvel’s Midnight Suns战斗说明，2022-10-26](https://blog.latam.playstation.com/2022/10/26/marvels-midnight-suns-explicamos-el-juego-por-turnos-y-cartas-de-combate-tactico-superheroico/) | 历史AAA跨子类型参照：每英雄8牌混合、补手至6、3次出牌／2次重抽；攻击／技能产Heroism，英雄牌和环境耗它，环境不耗出牌次数；随机在手牌而非命中失败。这展示手牌、行动与场地资源可分开，不是每局重建牌组的同类模板，也非2026现行数值核验。[一手／研究] |

**玩家反馈不是投票定真理。** [机核，2025-05-21 MT2 demo体验](https://www.gcores.com/articles/199123)肯定组合，也提初始搭配选错后的补救成本；[TapTap，2025-06-05](https://www.taptap.cn/moment/679819562606135434)同时谈成型满足、词条解释与无尽拖沓。这些版本／个人体验不能合成总体口碑，却补上“能结算不等于愿意继续玩”的验收。[社区／研究]

[STS社区讨论原帖](https://www.reddit.com/r/slaythespire/comments/1rzfy38/potential_hot_take_the_game_isnt_and_shouldnt_be/)既有支持削无限，也有反对终关才硬封的声音。因此正文不把无限自动判bug：人先决定有意组合、重复劳动和无进展软锁的边界，再定规则出口／告知时机；本轮未做受控试玩或玩家分层统计。[社区／研究]

<a id="p111-implementations"></a>
### 固定实现：看一次出牌实际经过谁

#### Unity完整原型候选：NueDeck

固定 `Arefnue/NueDeck@e0b61aa325064939874ad6ac4f3b551348eed4a6`（2022-09-17），[MIT](https://github.com/Arefnue/NueDeck/blob/e0b61aa325064939874ad6ac4f3b551348eed4a6/LICENSE)，工程版本为Unity `2020.3.34f1`；不称当前Unity已兼容。`V2.1.0`标签剥离为`8429de834b72e55aba4ae59b0db5b37093a27dee`，不是此次固定HEAD，商店日期不能替Git版本。[一手]

| 链路／固定源码 | 读到什么；直接影响采用 |
|---|---|
| [HandController L302–332](https://github.com/Arefnue/NueDeck/blob/e0b61aa325064939874ad6ac4f3b551348eed4a6/Assets/NueGames/NueDeck/Scripts/Collection/HandController.cs#L302-L332) → [CardBase L73–95](https://github.com/Arefnue/NueDeck/blob/e0b61aa325064939874ad6ac4f3b551348eed4a6/Assets/NueGames/NueDeck/Scripts/Card/CardBase.cs#L73-L95) | 松鼠标时UI检查出牌许可、mana、目标；Use仅重查IsPlayable，协程扣费、逐项延迟后执行Action，再OnCardPlayed。单卡有顺序，不证明全局触发队列或其他入口安全。[一手／研究] |
| [CollectionManager L54–122](https://github.com/Arefnue/NueDeck/blob/e0b61aa325064939874ad6ac4f3b551348eed4a6/Assets/NueGames/NueDeck/Scripts/Managers/CollectionManager.cs#L54-L122) | 有手牌上限、空抽牌堆回收弃牌并继续抽、弃牌／消耗分区；每次Random.Range抽一个元素，不是预洗好固定顺序。牌区用CardData引用，不能承诺同定义两张有独立强化与复制来源。[一手／研究] |
| [CombatManager L92–140](https://github.com/Arefnue/NueDeck/blob/e0b61aa325064939874ad6ac4f3b551348eed4a6/Assets/NueGames/NueDeck/Scripts/Managers/CombatManager.cs#L92-L140)、[敌人行动 L279–290](https://github.com/Arefnue/NueDeck/blob/e0b61aa325064939874ad6ac4f3b551348eed4a6/Assets/NueGames/NueDeck/Scripts/Managers/CombatManager.cs#L279-L290)、[EnemyBase L51–66](https://github.com/Arefnue/NueDeck/blob/e0b61aa325064939874ad6ac4f3b551348eed4a6/Assets/NueGames/NueDeck/Scripts/Characters/EnemyBase.cs#L51-L66) | 我方广播后补mana、抽牌；敌方广播后弃手牌，协程逐个等待敌行动；意图显示NextAbility，行动用该能力。可读通回合闭环，规则和移动协程仍相连。[一手／研究] |
| [胜利 L245–273](https://github.com/Arefnue/NueDeck/blob/e0b61aa325064939874ad6ac4f3b551348eed4a6/Assets/NueGames/NueDeck/Scripts/Managers/CombatManager.cs#L245-L273) → [ChoiceCard L27–35](https://github.com/Arefnue/NueDeck/blob/e0b61aa325064939874ad6ac4f3b551348eed4a6/Assets/NueGames/NueDeck/Scripts/Card/ChoiceCard.cs#L27-L35) → [GameManager L33–57](https://github.com/Arefnue/NueDeck/blob/e0b61aa325064939874ad6ac4f3b551348eed4a6/Assets/NueGames/NueDeck/Scripts/Managers/GameManager.cs#L33-L57) | EndCombat守卫后保存角色血量、清牌区、建金币／卡奖励，选择直接向CurrentCardsList加CardData。该列表由DontDestroyOnLoad对象保内存，不能称磁盘存档或恢复奖励事务；所读路径OnExitApp为空。[一手／研究] |

**决定性缺口不是“再加几张牌”。** CardBase [L180–225](https://github.com/Arefnue/NueDeck/blob/e0b61aa325064939874ad6ac4f3b551348eed4a6/Assets/NueGames/NueDeck/Scripts/Card/CardBase.cs#L180-L225)弃牌／消耗动画用`UnityEngine.Random.value`，抽牌又用同一全局随机，装饰二改可扰规则采样。未见已扣费操作统一取消／退款、局代次身份、可恢复队列或无副作用精确预览；`WaitForSeconds`也不是独立规则时钟。以上是所读链路缺口，不宣称对全部文件形式化证明。[一手／研究]

[Exhaust扩展提交](https://github.com/Arefnue/NueDeck/commit/9f20261fd7e2b17bb3782bb5032d86a6a5fcd767)同时改CardBase、CollectionManager、UI和Prefab，说明加牌区跨多个绑定；[意图缩放／稀有度重叠修订](https://github.com/Arefnue/NueDeck/commit/7490c1d9dd7c6f41614c921b7c1ed8231c3fce85)是实际历史维护，不是本仓复测。当前[issues](https://github.com/Arefnue/NueDeck/issues)限制创建且无结果不能当无bug；2023未关闭PR不证明维护恢复。奖励Relic分支为空、完整删牌升级商店未核，不写成已有。[一手／研究]

**👀 适合研究完整PvE原型，不直接采用为现行生产底座。** 新项目先估版本迁移、身份／队列／持久化改造成本；若需求包含复杂自动出牌、任意恢复、可靠取消或永久单卡改造，应撤回整套采用，只保经许可且通过项目测试的局部模块。[研究]

#### Unity交互组件候选：CardHouse

固定 `pipeworks-studios/CardHouse@6d4a4cd167835889f81fa38d5ce7aa6a771698bf`（2025-03-19，Updating to Unity 6），工程`6000.0.41f1`，README仍荐`2022.3.0f1`，不能忽略版本文字不同步。[根CC0](https://github.com/pipeworks-studios/CardHouse/blob/6d4a4cd167835889f81fa38d5ce7aa6a771698bf/LICENSE)之外，[Third-Party Notices](https://github.com/pipeworks-studios/CardHouse/blob/6d4a4cd167835889f81fa38d5ce7aa6a771698bf/Assets/CardHouse/Third-Party%20Notices/Third-Party%20Notices.txt)将Bebas Neue／Montserrat字体列为OFL，美术为CC0，不能统一按根许可处理素材。[一手]

- **资格与提交不在同一处。** [DragDetector L16–29](https://github.com/pipeworks-studios/CardHouse/blob/6d4a4cd167835889f81fa38d5ce7aa6a771698bf/Assets/CardHouse/CardHouseCore/Scripts/Dragging/DragDetector.cs#L16-L29)查DragGates，[CurrencyGate L15–25](https://github.com/pipeworks-studios/CardHouse/blob/6d4a4cd167835889f81fa38d5ce7aa6a771698bf/Assets/CardHouse/CardHouseCore/Scripts/Gates/CurrencyGate.cs#L15-L25)查余额；[CardGroup L110–235](https://github.com/pipeworks-studios/CardHouse/blob/6d4a4cd167835889f81fa38d5ce7aa6a771698bf/Assets/CardHouse/CardHouseCore/Scripts/Groups/CardGroup.cs#L110-L235)重验drop／group／目标gates并可恢复布局，但`UseOnTargetAndDiscard`先在L232迁入弃牌，再发目标事件、HandlePlayed。新增弃牌触发会碰到此先后，不可直接假设“费用→效果→弃牌”。[一手／研究]
- **效果和费用由绑定决定。** [示例SpellZap prefab L1122–1148](https://github.com/pipeworks-studios/CardHouse/blob/6d4a4cd167835889f81fa38d5ce7aa6a771698bf/Assets/CardHouse/SampleGames/DeckBuilder/Cards/DeckbuilderSpellZap.prefab#L1122-L1148)先费用Activate再目标操作；[CurrencyCost L30–35](https://github.com/pipeworks-studios/CardHouse/blob/6d4a4cd167835889f81fa38d5ce7aa6a771698bf/Assets/CardHouse/CardHouseCore/Scripts/Currencies/CurrencyCost.cs#L30-L35)直接减值，没有同方法重验／回滚。Prefab保留旧显示名ResourceCost，实际经脚本引用解析；静读不冒充引擎绑定验证。[一手／研究]
- **计时链不是事务。** [CardTransferOperator L22–48](https://github.com/pipeworks-studios/CardHouse/blob/6d4a4cd167835889f81fa38d5ce7aa6a771698bf/Assets/CardHouse/CardHouseCore/Scripts/Card/Operators/CardTransferOperator.cs#L22-L48)支持转移／抽牌，缺牌可执行timed chain再试；[TimedEvent L15–31](https://github.com/pipeworks-studios/CardHouse/blob/6d4a4cd167835889f81fa38d5ce7aa6a771698bf/Assets/CardHouse/CardHouseCore/Scripts/Events/TimedEvent.cs#L15-L31)是UnityEvent后WaitForSeconds，未提供持久化规则游标。[一手／研究]

[作者复盘](https://www.pipeworks.com/cardhouse-unity-tool/)承认原想数据立即结算、视觉追赶，但卡牌waypoint编排未完全解决，测试反馈促使加入timer链，并建议期间收窄输入中断。这是工具设计的真实取舍，不是所有视觉／规则解耦已实现。[一手] 作者工作室有商业卡牌经验，不等于那些产品使用了CardHouse。[研究]

[issue #6](https://github.com/pipeworks-studios/CardHouse/issues/6)（2025-09-08，Open）报告Unity6教程旧输入API报错；[#7](https://github.com/pipeworks-studios/CardHouse/issues/7)同日报告教程sparkle allocator警告。未复测、不能推广成所有游戏内存泄漏；test scenes也不等于本仓测试通过。[社区／研究]

**👀 已有规则、缺布局／拖放／牌区表现才采用其交互单位。** 所读路径未核campaign奖励与本局完整快照，不承诺精确预览、快进、独立RNG或可靠取消。需要这些能力时回到项目已有结算所有者，不能用更多TimedEvents堆成事务系统。[研究]

### UE付费对照：有队列说明，不等于源码验过

[Roguelike Deckbuilder Toolkit作者商品／文档页](https://www.fab.com/listings/c03abf82-580d-4cb1-b649-b19222235b60?lang=en)说明Action Queue分离logic／visual，示例有save／load、转场、胜败、RewardManager、story／shop；节点图明确为手工放置，不是随机地图生成。该公开说明使它成为完整campaign候选，不证明取消、队列持久化、奖励幂等或升级迁移已满足本页契约。[一手／研究]

**👀 仅付费评估，不把广告承诺写成生产验证。** 未购买、未读付费源码、未运行；实际取得时分别核引擎与素材条款。作者另列字体OFL、Epic Infinity Blade／Paragon与CC图标，商店可购或允许AI标签均不能代替具体许可链。沿既有UE DataAsset／ActorComponent与窄规则即可起步，不因有卡牌而强加GAS；只有购买后同一闭环二改明显更适配，才扩大模板采用。[一手／研究]

### AI案例与验法：同seed也可能玩不下去

[Clanbound作者与玩家原帖](https://www.reddit.com/r/aigamedev/comments/1wlcv9z/i_cant_code_a_deckbuilder_claude_code_and_my_own/)：作者称Claude写码，从Unity WebGL移至PixiJS后同seed战斗一致；艺术自制，AI素材包有人工清理，非“零手修”，总工时／成本未知。[社区：作者自述]

玩家Reloecc报告拖牌／hover失效，跨战斗／continue仍坏；鼠标释放事件丢失是作者后续诊断，作者又称修复并上传，本仓未独立试玩或核修复前后。另有完整一局反馈称太易、音效重复、风格不齐，作者承认英雄牌池重叠较高。十英雄／156牌等规模不能证明完成，也不能从这一个案例推断当前模型普遍能力。[社区／研究]

**因此AI交付分三层验。** 资料与ID／引用可静态核；费用、牌区、触发与恢复以确定输入和首次分歧轨迹核；真实拖放／取消、窗口失焦、跨战斗与继续游戏须在实际客户端验。人还需试玩早中晚生存、构筑取舍、文字理解和等待感，AI自动对局不能代替这些判断。正文的抽牌回能＋复制／自动出牌二改模板是待执行方案，仍继承§11通用验收，不另造随机／事件平台。[研究]

<a id="p118-enemy-search-loop"></a>

## P118：失视之后，搜索结束与警戒结束分开

**[研究] 增量：搜索结束与警戒结束分开，补追线索、搜点与不可达出口。**
**[研究] 默认：小状态机＋原生导航；先定逃脱机会，再定搜索预算。**
**[研究] 仅静读，未运行游戏／引擎／模型，最高水平与体验未知。** 核实：2026-10-23（UTC+8）；参数和验收见[05](../../domains/game-dev/05-gameplay-architecture.md#p118-enemy-search-loop)。

### 近期作品：逃脱空间与事后警戒共同设计

[Ubisoft，2024-11-21，Shadows玩法说明](https://www.ubisoft.com/en-gb/game/assassins-creed/news/1lmnk4XTnnqRh1foViGYPR)有副游戏总监Simon的解释：城堡／堡垒分区，暴露后仍能恢复潜行；失视后成对搜索，分别搜索与观察，之后仍更怀疑。武士会离开烟雾、搜索时割除草丛，与普通士兵的行为不同。[一手：开发者发布前说明] **借“失去位置但保留事件后果”，不推断所有当前版本已按同一参数实现。** [研究]

[The Dark Mod 2.13发布说明，2025-03-24](https://www.thedarkmod.com/posts/the-dark-mod-2-13-has-been-released/)解释非玩家物体旧简化照明判断与新的随机采样改进；[2.14说明，2026-03-20](https://www.thedarkmod.com/posts/the-dark-mod-2-14-has-been-released/)承认2.13新增感知的性能／物体识别问题使部分玩家退回2.12模式。[一手：维护者报告] 这反驳“传感器越精细自然越好”的默认，不证明新版本性能已在本仓复测，也不把下列多年演化的搜索逻辑说成2026新技术。[研究]

### 固定开源链：不能把整条追击称作绝不读真值

采用[官方镜像](https://github.com/stgatilov/darkmod_src)固定`4d0427244dd21951c74d22a33361517a220130ac`（2026-10-17开发快照），不是2.14发行包。[一手：Git记录／源码阅读]

| 已读调用段 | 能支持的窄结论 |
|---|---|
| [CombatState L1120–1135](https://github.com/stgatilov/darkmod_src/blob/4d0427244dd21951c74d22a33361517a220130ac/game/ai/States/CombatState.cpp#L1120-L1135)及[Memory常量](https://github.com/stgatilov/darkmod_src/blob/4d0427244dd21951c74d22a33361517a220130ac/game/ai/Memory.h#L224) | 失视特定分支仍有3000ms盲追阶段，把lastReachable作为lastVisibleReachable；到已知点或超过两倍时限后转LostTrack。这是作者有意的宽限，不能拿该游戏证明失视立即停止更新，也不是通用推荐时长。[一手／研究] |
| [LostTrackOfEnemy L66–102](https://github.com/stgatilov/darkmod_src/blob/4d0427244dd21951c74d22a33361517a220130ac/game/ai/States/LostTrackOfEnemyState.cpp#L66-L102) | 以最后可见可达位置／最后可见位置设置搜索，ClearEnemy阻止后续UpdateEnemyPosition继续追真值，清动作与移动任务。这里才是明确的信息切换点；不能凭目标引用非空就认为允许实时追踪。[一手／研究] |
| [SearchManager L401–489](https://github.com/stgatilov/darkmod_src/blob/4d0427244dd21951c74d22a33361517a220130ac/game/SearchManager.cpp#L401-L489) | hiding-spot路径检查搜索体积、可达性、已分派索引；标记发生在分派时，不是证明已经到达／观察。这里只借候选过滤与去重，不称它完整覆盖所有搜索模式。[一手／研究] |
| [InvestigateSpot L110–146](https://github.com/stgatilov/darkmod_src/blob/4d0427244dd21951c74d22a33361517a220130ac/game/ai/Tasks/InvestigateSpotTask.cpp#L110-L146)、[L258–308](https://github.com/stgatilov/darkmod_src/blob/4d0427244dd21951c74d22a33361517a220130ac/game/ai/Tasks/InvestigateSpotTask.cpp#L258-L308) | 死亡／昏迷、取消或进入战斗可结束调查；不可达且能看见该点时转向／停留观察，否则结束。抵达后还有调查动作，不把导航成功当搜索完成。[一手／研究] |
| [SearchingState L49–68、L124–126](https://github.com/stgatilov/darkmod_src/blob/4d0427244dd21951c74d22a33361517a220130ac/game/ai/States/SearchingState.cpp#L49-L126)及[L461–526](https://github.com/stgatilov/darkmod_src/blob/4d0427244dd21951c74d22a33361517a220130ac/game/ai/States/SearchingState.cpp#L461-L526) | 警戒衰减决定退出，离开时退出共享搜索；部分搜索模式用尽藏点后仍在区域内生成随机点，因此“藏点耗尽”不等于TDM立即回岗。[一手／研究] |

**许可先过门。** 固定[LICENSE L1–10、L112–130](https://github.com/stgatilov/darkmod_src/blob/4d0427244dd21951c74d22a33361517a220130ac/LICENSE.txt)说明软件GPL-3.0-or-later及附加条款／第三方许可，非软件资产通常为CC BY-NC-SA且任务可有独立限制。[一手] 本轮只提炼机制，没有复制代码／素材；它不是供闭源Unity游戏无条件粘贴的成套底座。[研究]

### Unity／UE：原生能力给动作，不替你定搜索政策

- **Unity 6.3导航**：[SamplePosition](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AI.NavMesh.SamplePosition.html)不考虑遮挡，文档明示可能从一层采到二层；[SetDestination](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AI.NavMeshAgent.SetDestination.html)返回请求结果，路径计算可能延迟；[pathStatus](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AI.NavMeshAgent-pathStatus.html)区分complete／partial／invalid。[一手] 所以随机点投影后还须核该角色的实际通路、搜索范围与楼层，不让一个布尔值同时代表选点、抵达和查看完成。[研究]
- **Unity Behavior 1.0.16**：[节点文档](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/manual/node-types.html)分位置／对象输入；[2026-05-26 changelog](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/changelog/CHANGELOG.html)修不可达导航永久Running，新增默认true的`FailIfUnreachable`，并修运行中位置变量改变不更新目的地。[一手] 优先核工程实际版本与失败出口；本文未安装包，不把发行说明当项目已修复。[研究]
- **UE 5.8**：[AI Perception](https://dev.epicgames.com/documentation/en-us/unreal-engine/ai-perception-in-unreal-engine)区分当前与已知感知、各感官Max Age及Forget Stale Actors，视线还提供`Auto Success Range from Last Seen Location`。[一手] 后者可明确扩大持续感知许可，和搜索中的位置记忆不是同一参数。[研究]
- **制作反例**：[Dr. Collederas，2025-08-01](https://collederas.com/blog/unreal-action-ai/)希望“失视X秒→调查声音”，发现ActorForgotten等所有刺激遗忘，不是单独视觉到期；用按目标的视线计时、同目标重获取消，以及不可达失败出口接StateTree。[一手：作者实作报告] 这是可借处理法，不采纳其“BT更麻烦”为通用结论，也不照抄文章对Expiration Age回调值的绝对说法；当前引擎源码与运行未复核。其文末仍把玩家上梯离开导航网格列为未覆盖练习。[研究]

### 社区反证：相同规则，有人体验到机会，有人只剩等待

[Reddit，2025-03-27原帖](https://www.reddit.com/r/assassinscreed/comments/1jl8doo/shadows_legit_has_the_best_stealth/)中YourThatOneGuy描述借暗处、诱饵和梁上躲藏潜入的乐趣；tanman_266批评屋顶背坡等待敌人放弃，Mexus51描述反复跳杀再回屋顶。另一回复认为长时间等待本身就乏味，但把不能爬屋顶解释为敌种能力差异。[社区：玩家自述] 他们未固定相同难度／版本，不据此断言全体玩家满意或某漏洞普遍存在。[研究]

[机核，漆黑的游击士，2025-03-31](https://www.gcores.com/articles/196745)自述68小时，肯定专家模式下屋顶也不安全、道具有用途，同时不满当时不能自由切昼夜而难安排偏好的潜行条件。[社区] 这里支持**把难度、时间与路线一起记录**，不是当前版本功能声明；不会将其体验推成搜索算法证据。[研究]

### 试验边界

[研究；未执行] 05已给场景与有序事件轨迹；接真实实现后，分别核纯规则、原生感知／导航和真人可读性。故意加入失视读实时位置、旧声音续满预算、不可达永久Running，确认断言会失败。本轮不另写参考FSM自证：没有项目实现时只会证明自己的规则与断言一致。游戏智力、逃脱公平感与AI二改收益仍待验。

**探索回执：** 截至2026-10-23，读Ubisoft／TDM团队2024–26原文、TDM官方镜像固定链、Unity／Epic文档、制作人博客、Reddit正反与机核原文；Indienova／知乎定向检索未取得更强同题实作。另一篇机核算法综述正文cache miss，不采其摘要作实现证据；无付费、引擎、模型或用户电脑运行。[研究]


<a id="p126-immunity-contract"></a>
## P126 净化之后为什么仍掉血：状态与伤害的入口不同

核实：2026-10-23；2026-10-25 合并建议到 05 §7，并复核 EX-GAS 默认分支仍为 `801735292820a6de9dd1abbac0e2139025840a61`，README 的 Odin／测试提示及 Container 免疫 Cue TODO 未变。本节保净化与伤害入口反例及替代成本。[一手／研究]

### 读者先决定保护什么

清旧、挡新、免伤与暂挂的选择、成功／拒绝反馈及正常组合回归统一见 [05 §7](../../domains/game-dev/05-gameplay-architecture.md#多来源效果先定合并规则再增加框架)，这里保留支撑选择的产品与实现证据。[研究]

### 作品给出的反例：同样叫毒，未必都是状态

[一手：开发者设计] SPD 的[Cleric公开设计](https://shatteredpixel.com/blog/coming-soon-to-shattered-the-cleric.html)将 Cleanse 描述为移除负面状态、授护盾，并可提供短暂负面状态免疫。它是作品自身的组合设计，不是“净化必含免伤”的定义。

以下实读固定版本`57a4e06a4caf162446d1c28caa7983f0493fecf0`（2026-10-06，SPD 4.0.2发行更新），只核源码、不称运行复现：[一手]

| 消费链 | 证据与结论 |
|---|---|
| 清旧与挡新 | [Cleanse.java L89–102](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/hero/spells/Cleanse.java#L89-L102)先移负面 Buff，再按天赋授 Cleanse、加盾；[Char.add L1221–1228](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L1221-L1228)在 Cleanse 存在时拒新负面。两处均排除 AllyBuff、LostInventory，不能写成清／挡一切状态 |
| 地面毒气伤害 | [ToxicGas L45–52](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/blobs/ToxicGas.java#L45-L52)传自身运行类型给 isImmune，仅返回 false 才调用 damage，不创建中毒 Buff；[Char.isImmune L1380–1397](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L1380-L1397)汇总角色／属性／Buff免疫类，以 isAssignableFrom 匹配 |
| 另有毒气保护 | [PotionOfPurity L92–97](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/potions/PotionOfPurity.java#L92-L97)授 BlobImmunity；其[免疫集合 L61–81](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/BlobImmunity.java#L61-L81)含 ToxicGas。另一个[ToxicImbue L118–130](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/buffs/ToxicImbue.java#L118-L130)分别列 ToxicGas 与 Poison，并在附着后清已有 Poison，说明两类需显式组合 |

[研究] 由此只能推出 Cleanse 的拒负面入口不自动挡 ToxicGas；盾和其他保护仍可能影响实际 HP，不能把这条链说成“净化必定掉血”或一个已复现的 bug。作品使用类集合不意味着 Unity 也应照搬类继承做分类；SPD 为 GPL-3.0-or-later，本次不复制代码。

### Unity现成方案与UE对照：借机制，不为一个开关换底座

[社区：历史单例] [Unity Discussions 2022-07-15原帖](https://discussions.unity.com/t/status-effects-and-immunity/887989)的开发者已把状态做成 Prefab，遇到免疫目标仍先创建、再不生效直到到期的问题；提问者接受在实例化前检查适用性。它支撑施加入口的真实需求，不证明该结构最佳，也不是近两年普遍故障统计。

[一手：固定源码] Unity开源 EX-GAS `801735292820a6de9dd1abbac0e2139025840a61`（2025-05-12）已经区分这些机制：
- [GameplayEffect L113–126](https://github.com/No78Vino/gameplay-ability-system-for-unity/blob/801735292820a6de9dd1abbac0e2139025840a61/Assets/GAS/Runtime/Effects/GameplayEffect.cs#L113-L126)分别检查施加条件、持续条件和施加免疫标签；[Container L78–95](https://github.com/No78Vino/gameplay-ability-system-for-unity/blob/801735292820a6de9dd1abbac0e2139025840a61/Assets/GAS/Runtime/Effects/GameplayEffectContainer.cs#L78-L95)在 instant 执行前也检查免疫，但阻止时的 Cue 仍是 TODO。
- [Container L49–67、L147–164](https://github.com/No78Vino/gameplay-ability-system-for-unity/blob/801735292820a6de9dd1abbac0e2139025840a61/Assets/GAS/Runtime/Effects/GameplayEffectContainer.cs#L49-L67)分别按效果标签移除，以及按持续条件激活／失活；[Spec L233–269](https://github.com/No78Vino/gameplay-ability-system-for-unity/blob/801735292820a6de9dd1abbac0e2139025840a61/Assets/GAS/Runtime/Effects/GameplayEffectSpec.cs#L233-L269)执行／激活触发移除，失活另处理动态标签与能力。不能从存在“失活”就推定计时冻结正确。
- [README](https://github.com/No78Vino/gameplay-ability-system-for-unity/blob/801735292820a6de9dd1abbac0e2139025840a61/README.md)提示测试覆盖不足、依赖付费 Odin Inspector；[代码MIT许可](https://github.com/No78Vino/gameplay-ability-system-for-unity/blob/801735292820a6de9dd1abbac0e2139025840a61/LICENSE)不消除第三方依赖成本。[研究] 本次仅作机制参照、未安装／运行；已有它就核这些入口与反馈，不因一个净化需求采用整套移植。没有验证真实发行游戏采用或断言其为当前最佳框架。

[一手] UE公开[UImmunityGameplayEffectComponent](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/GameplayAbilities/UImmunityGameplayEffectComponent)定义为阻止其他 GameplayEffectSpec 施加，instant效果自身不能持续授免疫；[Gameplay Effects](https://dev.epicgames.com/documentation/unreal-engine/gameplay-effects-for-the-gameplay-ability-system-in-unreal-engine?lang=en-US)区分instant执行与持续效果入活容器。[研究] 已用GAS沿原生机制核配置；免疫组件不自动等于清旧、暂挂或拦截绕过GAS的自定义伤害。

**探索回执与限制。** 截至2026-10-23，核SPD开发日志与固定源码、Unity原帖、EX-GAS README／固定源码、Epic公开文档；SPD 2025 Reddit讨论仅检索摘要、原帖获取失败，不采用为玩家失败证据。未安装、未跑Unity／UE／游戏，无观感、性能或模型收益实测；最高水平未知，本项只补已识别的选择缺口。[研究]
