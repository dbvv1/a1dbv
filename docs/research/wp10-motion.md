主线：一／二／三／四；运动、碰撞与视听反馈
改变的建议：[研究] 保留 WP10 既有取舍：区分控制、仿真与呈现责任，按具体症状选择运动和声音机制；误导或破坏操控时撤回。
新证据：本次仅按模块拆分，无新增证据；原日期、固定源码、许可、反证与未实测边界随各节保留。

# WP10：运动与视听反馈

[总摘要、生命周期与预算](2026-10-14-game-wp10-client-modules.md)；[输入、UI 与内容](wp10-content.md)。本册均为既有公开资料／源码研究，不代表本项目游戏、引擎、设备或玩家实测。

<a id="1"></a>

## 体验质量深化：响应与顺滑，让同一个动作值得反复玩

核实：2026-10-14 UTC。补 04 的动作回应、可读性与连续游玩质量；比较 2D 动作与 3D 第三人称，节奏／容错按玩法选择。[研究]

<a id="2"></a>

### 1. 四类时间问题不能用同一种“平滑”处理

| 问题／一手证据 | 改变的建议 | 可推翻或收窄建议的条件 |
|---|---|---|
| [Input System 1.19 时序选择](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/timing-select-mode.html)及[固定步长详解](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/timing-optimize-fixed-update.html)：FixedUpdate 在渲染帧内可能零次／多次执行，固定模式按完整时间步归组事件；低延迟需求推荐 Dynamic Update，即使物理施力仍在 FixedUpdate | [研究] 先减少事件等待；保存连续输入，离散指令消费一次，勿把所有输入搬到 FixedUpdate 当性能优化。物理模拟方式与输入采样模式可分别选 | [研究] 小量延迟不影响玩法且统一固定时序明显更简单时，原生固定模式可保留；这里不涉及网络确定性／回滚的时间线设计 |
| [Unity 6.3 Rigidbody 插值](https://docs.unity3d.com/6000.3/Documentation/Manual/rigidbody-interpolation.html)：Interpolate 用前两次物理姿态并延迟一个物理步；Extrapolate 预测未来姿态，可能越过碰撞边界 | [研究] 插值改善可见轨迹，不自动降低操作延迟。给观察到抖动的对象按需开启，再检查角色／跟随者使用的姿态；不把所有对象插值或全局提高物理频率设为默认 | [研究] 若游戏直接控制的角色更重视即时反馈，新增滞后不合适，可回退该对象插值并重新决定运动／呈现方案；不是跳过碰撞求快 |
| [Android Frame Pacing 官方说明](https://developer.android.com/games/sdk/frame-pacing)，页面更新 2026-02-26：不均匀显示间隔、重复帧及 queue-stuffing 可增加卡顿／延迟，Unity 已集成 | [研究] 平均 FPS、CPU/GPU 用时与实际呈现间隔分开记录。原生 Android 先用引擎选项，不为独立游戏再实现呈现同步层 | [研究] 平台、图形 API、刷新模式和引擎版本变化需复核；没有目标设备数据，不声称固定幅度改善 |
| [Unity 6.3 targetFrameRate](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-targetFrameRate.html)：桌面软件限帧有 microstutter 风险，vSyncCount 非零时忽略 targetFrameRate；Android 有不同规则 | [研究] 不把 `targetFrameRate=60` 当跨平台顺滑配方。桌面按同步方式选，Android 按目标与刷新率配置；帧间隔稳定和输入延迟同时比较 | [研究] VRR、平台合成器、驱动及硬件队列会影响结果；官方机制不能替目标设备端到端测量 |

[研究] 未来以时间戳定位输入处理、动作接受与首个反馈；p95／p99、最长帧和超预算场景描述稳定性。外设到屏幕发光另测，试玩判断体验。

<a id="3"></a>

### 物理查询补研：刚改位置不等于物理查询已看到新位置

核实：2026-10-15 UTC。移动／放置后的错误命中先查物理状态新鲜度；范围为 Unity 3D，UE 对照原生 tick 合同。[研究]

- [一手] [Unity 6.3 同步手册](https://docs.unity.com/en-us/engine/6000.3/manual/physics-section/physics-overview/physics-optimization/cpu/transform-sync)：默认延后 Transform 同步；直接改 Rigidbody／Collider Transform 后，依赖新位置的同帧查询前调用 `Physics.SyncTransforms`。Auto Sync 每次查询隐式同步。[研究] 批量改后同步，中间再改须重定边界，非保证一帧一次。
- [一手] [6000.3.0f1 发布说明](https://unity.com/releases/editor/whats-new/6000.3.0f1) 弃用 `Physics.autoSyncTransforms`，建议显式同步；6000.3 固定 `c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1`（6000.3.26f1）的 [Physics.deprecated.cs L22–25](https://github.com/Unity-Technologies/UnityCsReference/blob/c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1/Modules/Physics/ScriptBindings/Physics.deprecated.cs#L22-L25) 仍有 extern get/set、`Obsolete(..., false)`／`ExcludeFromDocs`。不生成新开关写入，也不称已移除／无效。
- [一手] [6.3 SyncTransforms API](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.SyncTransforms.html) 将自身／子层级 Transform 送入物理；[固定 Physics.bindings.cs L763–783](https://github.com/Unity-Technologies/UnityCsReference/blob/c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1/Modules/Physics/ScriptBindings/Physics.bindings.cs#L763-L783) 中 `Simulate_Internal` 与 SyncTransforms 为独立绑定。[研究] 同步不推进模拟／求接触；只核公开 C#，未核原生求解器。[Unity Reference-Only License](https://github.com/Unity-Technologies/UnityCsReference/blob/c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1/LICENSE.md) 仅供参考，不作可复用运行时代码。
- [一手] [6.3 MovePosition](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.MovePosition.html) 用于运动学连续运动并遵循插值，示例在 FixedUpdate；瞬移用 `Rigidbody.position`。[position 文档](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-position.html) 说明经物理设置、下次模拟后更新 Transform，可免附属 Collider 重算。[研究] 同步不令 MovePosition 已完成，可见／物理姿态也非时时相等；不外推 Rigidbody2D。
- [一手] [UE 5.8 Actor Ticking](https://dev.epicgames.com/documentation/en-us/unreal-engine/actor-ticking-in-unreal-engine)：PrePhysics 读上一帧，DuringPhysics 不确定，PostPhysics 模拟已完成；同组可用 `AddTickPrerequisiteActor/Component` 等具体生产者。[研究] 仅需要当帧模拟结果才延后，不把任意 SetActorLocation 查询等同，也不造 UE flush。

**二改预注册：** [研究] 把静态障碍改为同帧脚本移动，对照批量修改后直接查询与显式同步；原生刚体运动另按既定模拟步骤观察。正确后再测同步成本。射线起点、层矩阵、形状或参数错误另修；查询不依赖新位置时不加同步。

<a id="4"></a>

### 2. 具体动作的体验和生产成本

| 情境 | 最小可用且有质量的基线 | 增加能力的触发；目标体验 | 成本／回退 |
|---|---|---|---|
| 2D 精确平台／快节奏动作 | 起停、转向、跳高、落点与碰撞关系可理解；少量姿态也明确区分起手／生效／恢复 | [研究] 玩家合理短按常被拒绝时，分别增加按键缓冲和离地宽限；命中难辨时增加受击姿态与短音效，而非先堆粒子 | [研究] 容错会改变可达距离／战斗窗口；过期指令自动执行就收窄状态或时长。像素精度／相机呈现另审，不照抄物理数值 |
| 3D 第三人称移动／战斗 | 碰撞／位移只有一个负责人，输入方向、转身与姿态协调；先用 Animator／Clip／Blend Tree | [研究] 打断感觉迟钝先查 Exit Time／混合时长；步态不合先对齐位移与动画。确实需要脚／手接触才增加原生 Rigging／IK | [研究] 约束层、骨架一致性及动作覆盖成为新维护成本；移除无明显改善的约束。代码可调接触目标，但不能自动补齐缺失的动作风格 |
| 重武器或有承诺的动作 | 接受输入后及时给起手反馈，前摇和收招保留可学习节奏 | [研究] 接触缺乏力度时才加短顿帧／声音层次；需要连段时定义缓冲与取消窗口 | [研究] 追求零前摇、任意取消会消掉策略；顿帧过长／频繁会使连击不连贯。所有视觉变化不应悄悄修改伤害窗口 |
| 高频群战／多目标命中 | 威胁、玩家和命中结果始终可辨，声音并发受控 | [研究] 把特效／音频强度按轻重与重要性分层；多命中顿帧合并设上限，保留必要提示 | [研究] 全屏闪光、累计震动、长拖尾与无限刷新暂停会冲淡重点。可降低纯呈现强度而保持规则相同，规则性暂停则明确记录 |

[一手] [Unity 6.3 转场文档](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Transition.html) 区分 Exit Time＋条件、时长单位及打断排队，并说明避免脚滑的接触调节；不支持全关 Exit Time。[Animation Rigging 1.4 官方页](https://docs.unity3d.com/Packages/com.unity.animation.rigging@1.4/manual/index.html) 实际 1.4.1，页生成 2026-01-17，为可选能力。

[研究] 单人无手工美术修补时，先统一动作／反馈时刻、调有限动作的速度／转场和程序化演出。骨架、接触或方向覆盖仍不足，就缩动作集合或换许可清楚的资产；AI 查时序与参数，人判断力度和迟钝。

**回合等待预算（核实：2026-10-15 UTC+8）。** [研究] ✅ 先比较缩短高频反馈与可选快速播放，沿用动作完成条件和一次性结算。

- **快速路径仍等完成。** [一手] [Slay the Spire 公告正文](https://store.steampowered.com/news/posts/?appids=646570&enddate=1521157929&feed=steam_community_announcements)：2018-02-08 加 Fast Mode，02-15 加快卡片／营地／事件，02-22 修 Fast Mode＋Bite，奖励改为全部动作完成后出现；未披露竞态根因。[研究]
- **缩默认演出可不加模式。** [一手] Cogmind [2014-05-27 回复](https://www.gridsagegames.com/blog/2014/05/options-revisited/) 已加快常用弹体，大型少用武器仍慢；程序化速度影响外观。[2015 年设计说明](https://www.gridsagegames.com/blog/2015/04/cogmind-roguelike/) 继续区分弱攻击与强武器／爆炸。[研究] 按频率／重要性分等待，不将早期回复当永久拒绝倍速。
- **规则反例。** [一手] Into the Breach [v1.2.82 公告正文](https://steamcommunity.com/app/590380/allnews/)（2022-09-06）修 Fast Combat Speed 下敌人推动旧回合尸体；快速路径非天然纯视觉，根因未披露。[研究]

[研究] 三例限回合类，不外推实时／节奏游戏。Cogmind [2014-01-12 实现补记](https://www.gridsagegames.com/blog/2014/01/animation-vs-pacing-dilemma-modern-roguelikes/) 为可听结果保留间隔避免声音挤在一起；不照搬预测或自研循环。

[研究] **二改预注册**：新增击杀回血／额外效果，对照普通和快速路径的伤害、回血、死亡清理、随机消耗及奖励次数，核下一操作与声音尾部、结果辨识。若需堆规则特例或丢失关键信息，退回较短的原演出；公开说明不授予游戏代码／视听资产许可。

<a id="5"></a>

### 3. 可借用的优秀实现，以及不能带走的东西

| 来源与固定版本 | 已读的证据；采用单位 | 许可／维护／反证 |
|---|---|---|
| [NoelFB/Celeste](https://github.com/NoelFB/Celeste/tree/1b0ce45c75e05649ae91b44a8bb6b196684e4352)，最后提交 2021-08-05，仓库 2023-03-16 归档 | [一手] [Player.cs](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs)的 JumpGraceTime、角落修正、可变跳跃、DashBegin 的冻结／波纹／震动；[研究] 采用“精确动作也允许意图容错”的机制，不搬整段角色控制器 | [一手] [README](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/README.md)明确 MIT 只涵盖仓库代码，不含商业游戏及资产；发布的是部分学习源码，不是当前完整可维护模板 |
| [EXOK/Celeste64](https://github.com/EXOK/Celeste64/tree/6edfe1ebd2a21a6134d7675a28e357891025407e)，最新提交 2026-09-07 | [一手] [Player.cs](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs)的 Jump 同时设置运动、模型拉伸和声音；落地根据此前速度调整形变并发出落地事件／音效；宽限、ground snap 与显示姿态协同。可借动作到反馈的连接，3D 仍可用小规模程序化演出 | [一手] [ReadMe](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/ReadMe.md)：Source 原则上 MIT，标注例外及 FMOD 另算；Content／IP 不随代码放开商用。作者明确称约两周 jam、并非充分优化。[研究] 近期翻译提交不证明其是生产级 Unity 底座 |
| [deepnight/gamefeel](https://github.com/deepnight/gamefeel/tree/09d24aa05abe1192ad07cd3acd7270e6a5842237)，最新提交 2024-11-10，作者演示 v2 于 2024-05-01 发布 | [一手] [Options.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/Options.hx)将视觉后坐力、物理后坐力、缓冲、控制锁定等分开；[Hero.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/en/Hero.hx)把动作与反馈连接。[研究] 借逐项开关和清楚的事件绑定，而非引入 Haxe／Heaps 作为 Unity 插件 | [一手] [LICENSE](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/LICENSE)为 MIT；README 另列 Kronbits Inca tileset，不能用代码许可代替第三方资产核查。作者称学习演示而非实际游戏；未试玩，不给收益排名 |

**[一手＋研究] Deepnight 反证。** `gunAnimations` 将预备时间设为 0.33／0.06 秒；无枪械动画时爆发射击后另加 0.35 秒控制锁。`gunRecoilVisual` 改精灵偏移，`gunRecoilMovement` 改实际运动。因此全开／全关混合了规则与画面变化；这些是固定源码常量，不是推荐值。

[一手] [Game.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/Game.hx) 的 slowMo 用未缩放时间更新并计算游戏速度，须读 `stopFrame` 实际时长／倍率。[研究] Unity 输入缓存、判定、动画、粒子、相机、音频与 UI 各定时钟，`timeScale=0` 不统一暂停。

<a id="6"></a>

### 4. 作者复盘与研究能支持多强的结论

- [一手] Sébastien Bénard [GDC 2019 Dead Cells 复盘](https://media.gdcvault.com/gdc2019/presentations/Benard-Sebastian-DeepCells.pdf) 第 13 页（PDF 索引 13）为及时跳／到达辅助，16 页自由转向／自动瞄准，21 页处理挑战外细节。[研究] 只支持减少无意摩擦，不普推自瞄或统一容错；未看视频。
- [一手] Maddy 的 [Celeste & TowerFall Physics](https://www.mattmakesgames.com/articles/celeste_and_towerfall_physics/index.html)解释特定 2D 像素／平台约束下的 Actor／Solid 运动。[研究] 支持为了具体动作设计运动政策，不支持默认绕开 Unity 原生物理并自研引擎。
- [一手] [Lin 等 2022 impact-feel 论文](https://arxiv.org/abs/2208.06155) 摘要以评论训练排序、比较前八／后八游戏特征，认为顿帧、声音一致性、相机控制可能重要；仅相关分析，不定参数或因果收益。[研究]

<a id="7"></a>

### 5. 下一步验证和本轮交付边界

[研究] 未来获准切片选一个高频动作：2D 跳跃／短连击，3D 转身／近战。固定规则后切纯呈现，缓冲／顿帧窗口另作玩法变量；记录首反馈、长帧和误操作，由人判断可控／可读。二改再核是否只需动作参数和少量绑定。

<a id="8"></a>

### 联网反馈补研：先分动作预反馈与确认结果

核实：2026-10-17（UTC+8）。只在玩法确需联网时讨论；下列是公开文档／源码静读，不是本仓网络、引擎或玩家实测。物理插值和帧生成不提供输入预测／权威确认。[研究]

**[研究] ✅ 先按反馈含义选择，不把所有声音都等服务器，也不把本地预测写成已命中。**

| 选择 | 何时值得；代价与撤回 |
|---|---|
| 等确认结果 | 命中、击杀、奖励等误报代价高的事实提示先由确认结果驱动；接受等待成本，但按下／抬手等动作预反馈可立即发生 |
| 只预呈现可纠正部分 | 等待已损伤操作感且玩法能承受预报误差时，先试姿态、局部视觉或明确的预测态，确认只收敛、不再演一次；已播放的短音不能“取消听见”，预反馈勿冒充确认提示。误报或回弹比等待更坏就缩范围 |
| 借现有预测／重演机制 | 连续运动等确需本地模拟时，优先所用框架已支持的路径；仍要处理预测、重演、确认、拒绝与效果交接。维护成本抵消响应收益就降回前两种，勿只为一声提示自建全套 rollback |

**不同作者的机制与反例。** [一手] Factorio [FFF412 后半](https://www.factorio.com/blog/post/fff-412)（2024-05-24，Lou）把声音／粒子记为跨 latency state 与 game state 的一次性效果；严格比对仍会因微小预测差异重复。它报告普通驾驶可隐藏延迟，却列敌人／其他移动车辆等难以准确或低成本预测，并提战斗停用 latency hiding；不支持全战斗默认预测。[研究] 同源同 tick 可能有多个真实粒子，不能用全局 cooldown 吞掉合法连续事件。

[一手：固定源码] Valve Source SDK 的 [PlayStepSound](https://github.com/ValveSoftware/source-sdk-2013/blob/0759e2e8e179d5352d81d0d4aaded72c1704b7a9/src/game/shared/baseplayer_shared.cpp#L673-L677) 在客户端预测重演时跳过足音；[预测运行](https://github.com/ValveSoftware/source-sdk-2013/blob/0759e2e8e179d5352d81d0d4aaded72c1704b7a9/src/game/client/prediction.cpp#L1204-L1280)按是否首次预测抑制事件、运行后复位。[研究] 射击游戏代码与工厂驾驶的不同实现共同支持“重算状态不等于再发一次效果”；这不保证拒绝后已播放的声音可回收，也不证明该门控涵盖任意自写特效。其 [SOURCE 1 SDK LICENSE](https://github.com/ValveSoftware/source-sdk-2013/blob/0759e2e8e179d5352d81d0d4aaded72c1704b7a9/LICENSE)不是通用宽松商用许可；仅借机制，不复制 SDK 代码／资源。

**引擎契约分别使用。**

- [一手] [Unity NGO 2.7.0 Client anticipation](https://docs.unity3d.com/Packages/com.unity.netcode.gameobjects@2.7/manual/advanced-topics/client-anticipation.html)分 anticipated 与 authoritative 值，提供修正／Smooth；明确没有完整 rollback-and-replay。Ignore 旧数据仍更新 authoritative 值并触发对应回调；OnReanticipate 是扩展入口，不是已替项目做完回放。[研究] 换色／局部呈现可先试，不能由回调次数直接推断一次动作确认或自动声音去重；也不概括全部 Unity 联网方案。
- [一手] [UE 5.8 FPredictionKey](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/GameplayAbilities/FPredictionKey)说明 GAS 用 key 关联预测副作用；复制效果与本地 key 匹配时不重做 OnApplied／GameplayCue，待复制追上再撤本地预测效果。独立 GameplayCue 执行也考虑 key；原 key 只限一次逻辑作用域，定时／外部事件续段可能需新预测窗口。[研究] 已用 GAS 才沿该契约接入，不为去重一声引入 GAS，也不等同 Unity anticipation 或任意 RPC 的保证；原页仍列依赖与属性预测限制。

**[研究] 二改预注册。** 增连续射击或多目标反馈后，分别验同一次动作的预测→确认不重播、拒绝不留下成功提示，以及两次真实动作不互相吞掉；再覆盖延迟变化、重演、切角色／退出和观察者客户端。记录动作关联、效果种类、确认／拒绝和实际播放次数；人判误导与响应，修不好则回退关键结果等确认。

<a id="9"></a>

## 3D 运动补研：控制精度、接触连续性与物理重量的取舍

核实：2026-10-14 UTC。以下按官方契约和固定源码深化 04 的运动选择；输入缓冲与显示插值见前节。[一手／研究]

<a id="10"></a>

### 1. 先按期望运动选，不能只按组件名字选

**[研究] 默认判断**：常规直立探索／动作角色，原生坡／阶与简单接触规则已满足需求时，✅ 原生 CharacterController 加窄运动层；已有可维护的刚体运动无需迁移。真正需要物体质量、冲量与摩擦相互作用时🧪力驱动动态 Rigidbody；需要原生接触求解但按游戏规则组织速度时🧪速度驱动动态 Rigidbody；稳定接地、任意附着／脱离或复杂台阶规则超过原生便利范围时🧪现成 kinematic motor。后两条都可能很精确，不能写成“Rigidbody 必然笨重、KCC 必然最好”。

[研究] 加速度、转向承诺、落地形变和武器时序也能塑造重量；先定义坡顶、击退、转台上的期望行为，再决定速度所有者。

[一手] Unity 6.3 LTS 的边界：

- [CharacterController 组件](https://docs.unity3d.com/6000.3/Documentation/Manual/class-CharacterController.html) 提供壁滑、坡限／阶高／Skin Width，不自动受力或推刚体，可用回调补推力；示例尺度参数非通用值。
- [Move](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController.Move.html) 受碰撞约束且不加重力；[isGrounded](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController-isGrounded.html) 是最近 Move／SimpleMove 接地结果；[velocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController-velocity.html) 来自位移差，不含外部 Transform／父级运动，不能直接当世界速度／独立探地／平台动量。
- [Rigidbody.linearVelocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-linearVelocity.html) 是世界速度，反对逐步覆盖以求真实物理，也给跳跃改速示例。[研究] 速度驱动可用，但须显式保留外力／接触速度，覆盖后不能期待 AddForce 持续。
- [GetPointVelocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.GetPointVelocity.html) 含角速度；[MovePosition](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.MovePosition.html) 是运动学按物理步移动／插值接口，不包办坡阶、接地与离台政策。[研究]

<a id="11"></a>

### 2. 三份许可清晰的实现：同样叫 controller，接触政策不同

以下 SHA 经公开 GitHub API 核查，已逐文件读 motor／演示源码；活动不证明目标 Unity 兼容或商业采用，演示资产与依赖须另核许可。

**A. OpenKCC：🧪 需要显式 snap／平台政策时评估，保留现有行为再决定接入。**

- [一手] `nicholas-maltbie/OpenKCC@a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4`，v1.5.0／2023-09-15；[MIT LICENSE.txt](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/LICENSE.txt)。[package.json](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/Packages/com.nickmaltbie.openkcc/package.json) 最低 Unity 2019.4，README 开发版 2023.1，未证 6.3；另依赖作者状态机、screenmanager、testutils 与 Unity 包。
- [一手] [KCCMovementEngine.cs](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/Packages/com.nickmaltbie.openkcc/OpenKCC/Character/KCCMovementEngine.cs#L303-L339) 依次去重叠→移动→条件 snap→更新 grounding／平台；`ShouldSnapDown` 要求此前稳定着地、不滑坡、无上升，防吸回起跳；`GetProjectedMovement` 投影可行坡面并保输入长度，显式定义坡速。
- [一手] [RelativeParentConfig.cs](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/Packages/com.nickmaltbie.openkcc/OpenKCC/Character/Config/RelativeParentConfig.cs#L73-L108) 用相对位置／旋转或平台点速度，无需改层级；[KCCStateMachine.cs](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/Packages/com.nickmaltbie.openkcc/OpenKCC/Character/KCCStateMachine.cs#L302-L335) 设 kinematic、自加重力，跳跃加 `GetGroundVelocity()`，支持无动量／权重／默认弹射上限。站稳与离台动量分别决定。
- [一手／研究] [RelativeVelocityRigidbodyTracking.cs](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/Packages/com.nickmaltbie.openkcc/OpenKCC/Environment/MovingGround/RelativeVelocityRigidbodyTracking.cs#L45-L64) 算两速度模之差的绝对值，等速反向得零；`GetGroundVelocity` 给权重函数的第二参数为平台速度，非独读玩家速度。类名不代表完整相对速度契约；仅此静态路径反例，不否定其他平台路径。
- [研究] 可借明确的站立／滑坡状态、起跳不吸附，以及平台跟随与发射动量的分工。查询、去穿透、更新顺序与依赖组合仍需维护；年代不构成淘汰理由或近年活跃证据，目标版本升级须验证。

**B. Character Movement Fundamentals：🧪 学习／改造速度驱动刚体，不能按“物理控制器”承诺任意冲量自然保留。**

- [一手] `Jan-Ott/CharacterMovementFundamentals@49bd5569c1192dc98ac889046ff358c4eb8eeb44`，2025-02-09；[MIT](https://github.com/Jan-Ott/CharacterMovementFundamentals/blob/49bd5569c1192dc98ac889046ff358c4eb8eeb44/LICENSE)。[作者 README](https://github.com/Jan-Ott/CharacterMovementFundamentals/blob/49bd5569c1192dc98ac889046ff358c4eb8eeb44/README.md)：2019 发布、内容至 2021、支持至 2025-01，开源后无暇维护建议 fork；只作机制来源，不承诺 Unity 6 支持。
- [一手] [Mover.cs](https://github.com/Jan-Ott/CharacterMovementFundamentals/blob/49bd5569c1192dc98ac889046ff358c4eb8eeb44/Character%20Movement%20Fundamentals/Source/Scripts/Core%20scripts/Mover.cs) 冻结旋转、关重力，传感器距离生成竖向 ground-adjustment velocity，与作者速度相加写 Rigidbody；台阶连续性来自距离修正，不是 capsule 自然能力。
- [一手] [AdvancedWalkerController.cs](https://github.com/Jan-Ott/CharacterMovementFundamentals/blob/49bd5569c1192dc98ac889046ff358c4eb8eeb44/Character%20Movement%20Fundamentals/Source/Scripts/Controllers/AdvancedWalkerController.cs) 管 `momentum`、空控、摩擦、陡坡与 `AddMomentum`。[研究] 击退进入该所有者，不能另写刚体后假定所有碰撞速度都被保留。
- [一手／研究] [MovingPlatform.cs](https://github.com/Jan-Ott/CharacterMovementFundamentals/blob/49bd5569c1192dc98ac889046ff358c4eb8eeb44/Character%20Movement%20Fundamentals/Source/Scripts/Environment/MovingPlatform.cs) 是 waypoint 平移：改平台 Transform，再给区域刚体 MovePosition 同位移，无旋转点速度；平台到点截断、乘客仍用原 `_movement`，端点步长待验，不称高速／旋转平台已解决。

**C. SRMove：🧪 台阶连续性优先、愿意维护速度政策的轻量候选。**

- [一手] `NoiRC256/SRMove@a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b` 提交 2025-12-03，pushed_at 另为 2026-01-26；[MIT](https://github.com/NoiRC256/SRMove/blob/a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b/LICENSE)。[Readme](https://github.com/NoiRC256/SRMove/blob/a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b/Readme.md) 自述测 Unity 6000.0.32f1，不保证 6.3。
- [一手] [AvatarMover.GroundDetection.cs](https://github.com/NoiRC256/SRMove/blob/a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b/Runtime/AvatarMover.GroundDetection.cs) 前后采样代理点近似坡面；[AvatarMover.Core.cs](https://github.com/NoiRC256/SRMove/blob/a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b/Runtime/AvatarMover.Core.cs) 合坡向、hover、重力／输入写 linearVelocity。[研究] 平顺台阶可评估，锐边／窄阶精确落点须重选近似范围。
- [一手] [AvatarMover.API.cs](https://github.com/NoiRC256/SRMove/blob/a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b/Runtime/AvatarMover.API.cs)：Move 设单步速度，LeaveGround/EndLeaveGround 暂停／恢复吸附，旧 force 已 Obsolete；跳跃和击退组合仍归调用者。
- [一手／研究] `UpdateMovement` 对平台取得的是 `_groundRb.linearVelocity`；该值不足以表达旋转平台边缘的点速度。README 的 `ParentableGround` 另以层级继承位置／旋转；离台继承、父级缩放、相机参考方向与碰撞受阻仍须验证，能跟随不证明全部平台动力学正确。

<a id="12"></a>

### 现成 motor 补比：先借已有平台机制，再决定补什么

核实：2026-10-14 UTC。补比旋转升降平台＋边缘起跳／受击；依据限商店、作者文档及历史声明。此前开源实现不足以证明自补原生 CC 更省维护。[研究]

**D. Easy Character Movement 2（ECM2）：🧪 多种接触规则同时需要时，优先进入条件评估。**

- [一手] [商店页](https://marketplace.unity.com/packages/tools/physics/easy-character-movement-2-193614)：1.4.3／2025-07，USD 80／席位税前，Unity 6000.0.53f1／2021.3.45f1，未证 6.3；购买重核。[changelog](https://oscar-gracian.gitbook.io/easy-character-movement-2/user-manual/general/change-log)：1.4.2 加 Unity 6 分发并修落平台的模式／速度顺序；未标日期的 1.5 已出现，但不证明商店已发。
- [一手] [CharacterMovement API](https://oscar-gracian.gitbook.io/easy-character-movement-2/user-manual/general/components/character-movement) 分平台跟随、yaw-only 旋转与离台速度；页面仍列 PauseGroundConstraint，1.5 changelog 已弃用改 ClearCurrentGround。LaunchCharacter 可覆盖／叠速，fastPlatformMove 省 sweep，仅适合无静态阻挡。[研究] 先借这些入口，版本勿混抄；翻滚、侧挤和联网仍未证。
- [一手／研究] [创建教程](https://oscar-gracian.gitbook.io/easy-character-movement-2/walkthrough/creating-a-character) 需接模型、调 capsule、接控制，[扩展教程](https://oscar-gracian.gitbook.io/easy-character-movement-2/walkthrough/extending-a-character) 支持继承／事件；先复用 motor，只补输入／技能／动画。changelog 的 1.4.0 重构破坏 API、1.4.2 分离 Cinemachine 示例，故锁版本、分运行时与演示依赖。

**E. Philippe St-Amand 的 Kinematic Character Controller：👀 可复用的历史方案，不升级为 Unity 6 新项目的无条件默认。**

- [一手] [商店页](https://marketplace.unity.com/packages/tools/physics/kinematic-character-controller-99131) 免费，3.4.4／2022-06，原 Unity 2020.3.30；旧管线表不证明现代 URP 必坏，也未证 6.3。[作者 2022-09 声明](https://discussions.unity.com/t/released-rival-dots-character-controller/843064?page=5)：KCC 未被 Unity 收购，免费后支持有限；GameObject KCC 与 DOTS Rival 分开。
- [一手／研究] [作者发布说明](https://discussions.unity.com/t/released-kinematic-character-controller/678434?page=17) 有复杂台阶、更新控制及运动回调，可借碰撞／接地底座，非完整角色。当前包源码、现代兼容与指定发行采用未取得，不排名 ECM2／原生。

**授权先于 Agent 接入。** [一手] 两店均为 Standard Asset Store EULA／Extension Asset。[现行条款](https://unity.com/legal/as-terms)（2024-12-04）：§2.2.1 允许合条件嵌入，§2.3.2 按席位；Terms §3.8(v)／EULA §2.2.1.1(g) 的 AI／ML 用途（含输入）须 Provider 和／或 Unity 明确同意。[研究] 引擎集成授权不自动覆盖给 Agent 的包代码／数据，未清权不输入或公开复制；普通公开技术文档另论。未取得包输入权限，不作法律意见。

**改变选择顺序。** [研究] 简单坡阶保留原生 CC；明确需要贴地、旋转跟随与离台动量组合时先比较现成 motor。ECM2 值得先评估，KCC 适合能承担升级的既有使用者；需求、许可或接入成本排除现成方案后才补窄层。购买／导入／试玩待授权；动态事实于选型时或 2026-11-14 前复核。

<a id="13"></a>

### 3. root motion 与混合路线：一个最终位移所有者

[一手] Unity 6.3 [OnAnimatorMove](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnAnimatorMove.html) 在动画求值后、IK 前。固定 `Standard-Assets-Characters@8f185aa3c782d824976653dd6a6476312daad241` 的 [ThirdPersonBrain.cs](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/Assets/_Standard%20Assets/Characters/Scripts/ThirdPerson/ThirdPersonBrain.cs#L458-L481) 在非 root-motion 用 FixedUpdate，否则用 OnAnimatorMove 驱 motor；[ThirdPersonMotor.cs](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/Assets/_Standard%20Assets/Characters/Scripts/ThirdPerson/ThirdPersonMotor.cs#L215-L228) 经 adapter 提交、GetMovementVector 读 deltaPosition。位移所有权互斥，未绕过碰撞。

[一手] [LICENSE.md](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/LICENSE.md) 为 Unity Companion License；最后提交 2025-10-23 未证 6.3。[研究] 只借动画出期望位移、motor 限最终位移；自由移动代码定轨迹，承诺突进可用动画，但须定受阻缩距／停调动作政策。各路线均可用 root motion。

[一手] [Character Controller 1.4.5](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/index.html) 是 ECS；[SimulateDynamicBody](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/dynamic-body-interaction.html) 让 kinematic 模拟质量比例与推／被推，反驳无物理互动；[moving platforms](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/moving-platforms.html) 区分 TrackedTransform 跟随与 PhysicsVelocity 推力信息。[研究] 非 ECS 不因官方身份迁移；与 GameObject CC／PhysX 分列。

**肢体操纵：保留身体反应，局部改控制与可达路线。** 核实：2026-10-18（UTC+8）。下列为两个独立开发团队的历史生产取舍，只限物理肢体／抓取玩法，不改变普通直立角色的默认路线。[一手／研究]

Octodad 的 [2012-10-17 作者说明](https://younghorsesgames.com/allundercontrol/)记录：旧版上楼梯时越用力越难前进，改将输入力用于向上辅助；低顶时停止强行撑直身体，同时保留笨拙操纵。[2015-03-30 技术复盘](https://www.gamedeveloper.com/programming/octodad-dadliest-catch-post-mortem-pt-4-tech)的 Octobody 节说明，软体有穿透、观感和 CPU 问题，后作改详细胶囊 ragdoll；升级 PhysX 3 后原软体也不再可用。受控脚减重、腾空撤撑起力、悬挂另调手臂，都是为特定状态改物理响应；新增约束又吃掉去软体的性能收益，需提供低细节身体。可借“局部受控端＋其余身体反应”，代价是专用状态与约束预算，不是当前 PhysX 选型或通用参数。[一手／研究]

Human Fall Flat 开发者在 [2017-10-27 回复 #9](https://steamcommunity.com/app/477160/discussions/0/3182216552780030265/)说明：为拾物、按钮和抓边等重写抓取后，墙爬也更容易；选择保留新抓取、另削弱墙爬，避免初玩绕过谜题。作者认可重玩／多人探索的不同用途，[10-31 回复 #19](https://steamcommunity.com/app/477160/discussions/0/3182216552780030265/?ctp=2)确认独立入口。同帖玩家对限制有异议，这只支持当时的玩法取舍，不证明削弱更好或现版各平台仍有该入口。[一手／社区／研究]

因此，物理肢体操纵本身是玩法时先局部修受控端／状态；接触更可靠后，再检查可达路线是否符合目标，按具体影响保留、收窄或撤回。物理响应并非目标且持续妨碍预定运动时，才沿原建议比较显式控制。以上未运行游戏、引擎或前后实现，未测维护工时与体验收益。[研究]

<a id="14"></a>

### 4. 升级、撤回与未来验收：以玩家感到的差别为准

- [研究] **保留原生 CC**：简单接触够用就不升级；平台少也可能规则复杂，贴地／旋转／动量组合先比较现成 motor。
- [研究] **保留速度驱动 Rigidbody**：接触与步态已达标，外力统一进入 momentum。新增持续质量交互、任意冲量或堆叠时，再评估力驱动／混合政策。
- [研究] **撤回过度物理化**：物理响应并非玩法目标且不停抵消摩擦／碰撞速度时，可把重量留给参数与动画；反之每次碰撞都需 kinematic 特例，也应重选。
- [研究] **升级验收**：比较坡速、坡顶腾空、窄台阶、旋转平台站位／起跳、侧挤／低顶受击及 root-motion 撞墙。人判可控与重量，不设通用坡角／snap／恢复时长。
- [研究] **二改**：旋转升降平台边缘受击；核平台、自移和击退各应用一次，起跳解除吸附，落地／重生清旧附着。牵动大量技能／相机脚本时先收拢所有权；人决定动量与恢复手感。

<a id="15"></a>

### 5. Unreal 对照：同样的动作，不同的引擎责任

核实：2026-10-14 UTC。以 UE 5.8 官方机制／API、Lyra 和 Mover 状态校正跨引擎责任；未读受限引擎源码或运行样例。[一手／研究]

**[一手／研究] ✅ 优先成熟 CMC。** [CMC 机制](https://dev.epicgames.com/documentation/en-us/unreal-engine/understanding-networked-movement-in-the-character-movement-component-for-unreal-engine)：TickComponent→PerformMovement 组织外力／重力、root motion／RMS，再进 PhysWalking/Falling；MOVE_Custom/PhysCustom 为扩展点。UE 已承担运动组织，不另造 motor；联网才补 saved moves／重演，直接 SetLocation 会被校正，单机无须预测。

**[一手／研究] 平台／root motion 沿原生语义。** [离台速度 API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UCharacterMovementComponent/GetImpartedMovementBaseVelocity) 按 bImpartBaseVelocityX/Y/Z 继承，勿叠加平台速度；[Root Motion 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/root-motion-in-unreal-engine) 由动画驱 Movement Component，Walking/Falling 的 Z 受模式／重力约束，不随意切 Flying。相应提取模式令 Animation Graph 走 Game Thread，须核预算。

**[一手／研究] RMS 不要求 GAS。** RMS 参数由 CMC 执行、handle 管移除；GAS 仅提供任务入口。[Lyra 5.8 技能实例](https://dev.epicgames.com/documentation/unreal-engine/abilities-in-lyra-in-unreal-engine?application_version=5.8) 的 GA_Hero_Dash 在力结束后仍保持 ability 禁开火／跳，GA_ADS 结束恢复速度／输入／镜头。借请求、限制与撤销，不搬全部多人依赖；突进可受击二改同时核位移源、Montage、限制及镜头。

**[一手] 版本与模块状态。** [5.8 正式发布新闻](https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available) 为 2026-06-23；[固定 5.8 Mover 页](https://dev.epicgames.com/documentation/unreal-engine/mover-in-unreal-engine?application_version=5.8) 仍 Experimental、API／属性／数据可变并继续支持 CMC。非沿用 5.7 标签，也不要求升级。

**[一手／研究] 👀 结构性缺口才评估 Mover。** [5.8 对比页](https://dev.epicgames.com/documentation/unreal-engine/comparing-mover-and-character-movement-component-in-unreal-engine?lang=en-US) 列宽形体、模块模式／回滚，CMC 已用于多个发行项目；Mover 以模拟步命令／模式／instant effects 改状态，多个 world frame 可合一 tick。非标准形体或组合需求才迁移；联网才比较时间线／校正，不随时写 velocity 或无证推荐异步后端。

**[一手／研究] 样例只借机制。** [Game Animation Sample](https://dev.epicgames.com/documentation/en-us/unreal-engine/game-animation-sample-project-in-unreal-engine) 以动画为主、traversal 为简单示例，可借 pose／trajectory／movement 连接，非完整攀爬战斗；Lyra 也非发行游戏源码。引擎／内容条款另核，未下载或接受新协议。

**[研究] 后续验收**：保留平地、坡顶、旋转平台和撞墙突进，二改平台边缘突进→受击→死亡→重生；核胶囊、网格、movement mode、平台贡献及动作限制。确需联网才加延迟／丢包的预测校正验证。

<a id="45"></a>

## 音频并发补研：保住起音不等于保住每次提示

核实：2026-10-14 UTC。主线 3；Mindustry v154 及锁定 Arc／SoLoud 的静态源码表明，04 的并发上限须拆成入口合并、同组抢占与全局竞争；提高 priority 不保证提示进入播放。[一手／研究]

<a id="46"></a>

### 1. 真实游戏的历史改动与依赖链

[一手] [Mindustry v154 发布](https://github.com/Anuken/Mindustry/releases/tag/v154)（2025-12-16，Beta）声部 32→100、每类约 6 并换声音，作者意图防单声淹没。[研究] 多项同改，不单归因限额或照抄数量。

[一手] 发布源码声明的依赖链（非发行二进制溯源）：Mindustry `d1e0307d3906bb350e80d8969a2464ed0b771ffb` 的 [gradle.properties](https://github.com/Anuken/Mindustry/blob/d1e0307d3906bb350e80d8969a2464ed0b771ffb/gradle.properties)锁 `archash=46c0956944`；Arc v154 为 `46c0956944af81db1145625e07108c196d94e260`，其 [build.gradle](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/build.gradle#L69-L72)设置 `SOLOUD_MAX_VOICE_COUNT=100`，[同文件 L144-L146](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/build.gradle#L144-L146)在本地依赖目录不存在时拉取 Anuken/soloud 的 `2025.12.01`，对应 `4b4266fed49b45afc191728b64adf1faca943f5b`。不使用当前 main 解释旧版行为。

<a id="47"></a>

### 2. 三道门控及不能省略的反例

- **入口。** [Arc Sound.java L31-L85](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/src/arc/audio/Sound.java#L31-L85) 启 checkFrame 后按同 Sound 默认 16ms 拒新实例，大音量可改上声音量／pan 再回 -1；实为毫秒非注释“同帧”，未判敌人／位置／危险，尚未进入底层优先级。[一手]
- **组。** [Audio.java](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/src/arc/audio/Audio.java#L9-L15) 默认 6 在加载应用；[SoLoud play](https://github.com/Anuken/soloud/blob/4b4266fed49b45afc191728b64adf1faca943f5b/src/core/soloud_core_basicops.cpp#L32-L67) 未指定时每 source 独立组，非语义组。[SoundPriority.java L73-L109](https://github.com/Anuken/Mindustry/blob/d1e0307d3906bb350e80d8969a2464ed0b771ffb/core/src/mindustry/audio/SoundPriority.java#L73-L109) 才共享火焰／导弹／arc/pulsar，降修复／脚步优先级；最小可打断 `min(0.25s, 长度一半)`，部分脚步更长。[一手]
- **全局／组满不同。** [findFreeVoice_internal L309-L391](https://github.com/Anuken/soloud/blob/4b4266fed49b45afc191728b64adf1faca943f5b/src/core/soloud_core_getters.cpp#L309-L391) 全局看 priority、年龄／protected；组满只找可打断且非 protected 最老者，否则拒绝，不比 priority。“no lower volume”注释不符分支；priority 3 非 PROTECTED，仍受同组／同更高优先级路径影响。[一手]

[研究] 保护起音也可能拒绝后续重要事件。✅ 复用分组、优先级、重触发，仅补事件配置：普通同类可合并，关键警告避开提前拒绝它的入口／组；第二警告保旧还是替换由玩法定。换变体仍共享类别额度，不宣称 Mindustry 已保证任意警告。

<a id="48"></a>

### 3. Unity／Unreal 只复用相关机制

[一手] Unity 6000.3 [priority](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-priority.html) 优先虚拟化低优先级、同级看音量并留位置，数值越小越高（与 Arc 反），WebGL 不受此设；[isVirtual](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-isVirtual.html) 主声及全部 one-shots 被剔才 true，false 不证指定 one-shot 听见。[研究] 沿原生／Mixer 补类别限制，Source 状态非逐事件回执。

[一手] UE [Sound Concurrency](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-concurrency-reference-guide) 原生共享组／淘汰／Retrigger Time，多组全满足；重触发拒绝无视虚拟化。[研究] 先配原生、明确警告限制，虚拟化不是被拒提示待播队列；其他责任见 WP6。

<a id="49"></a>

### 4. 最小采用与未来验收

[研究] 沿现有音频入口，由 AI 查事件／类别／重要性及拒绝原因，人决定合并／打断。未来连发中插警告，再加变体与第二警告，分别核提交、合并／拒绝／抢占、虚拟化及实际起音／方向／时效；过期不补播。记录 voice／CPU，调用成功不代验听见。

[研究] SoLoud 通用文档不替代此 fork；其他音频责任见 WP6。

<a id="50"></a>

### 5. 持续状态声的反例：先校正可听范围与恢复政策

核实：2026-10-15 UTC+8。以下持续声反例收窄短事件限额建议，依据开发者报告、固定配置与引擎文档。[研究]

**持续声反证。** [Factorio FFF-341](https://www.factorio.com/blog/post/fff-341)（2020-04-03）环境上限 15→50 缓解雷达断声却更拥挤；管道无水仍有声，作者归于 working_sound／同类限额冲突，去限并缩范围后自报改善，非所有循环应无限。[一手／研究]

[一手] 2.1.21 固定 `374934f81f82b09ec9fc459f92a316bd642ddd82` 的 [sounds.pipe](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/prototypes/entity/sounds.lua#L248-L272) 管道 persistent／渐变／平滑／活动率，门短声 aggregation，车轮持续仍限；[WorkingSound 当前文档](https://lua-api.factorio.com/latest/types/WorkingSound.html)（2.1.21）persistent 合同 prototype 并忽略同类上限。[研究] 按语义选，非短限／长不限，现代配置非 2020 原修复。[用途声明](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/README.md) 供 mod 查定义，不开放引擎／音频。

**原生差别。** [一手] Unity 6000.3 [maxDistance](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-maxDistance.html)：Linear 边界零、Custom 保末值、Logarithmic 忽略该值继续衰减；缩 maxDistance 非通用回收。[priority 虚拟化](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-priority.html) 虚拟化留位置／状态。UE 5.8 [attenuation](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-attenuation-in-unreal-engine) falloff 从内形边缘算，衰减／声像分开；[EVirtualizationMode](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/EVirtualizationMode) Restart 从头、PlayWhenSilent 占 voice、SeekRestart Experimental。其余见 [WP6 引擎对照](2026-10-14-game-wp6-audio.md#105-unityunreal同一质量目标不同原生职责)。

[研究] 短事件过期可丢，持续声按当前活动恢复；先调范围、曲线、渐变与恢复，成本为逐类／复合听验。仅不承担独立定位的环境层可合并；危险声不为省 voice 随意缩范围。

[研究] **二改预注册：**新增持续技能／机器声，在竞争前后跨可听边界并切活动状态；核警告、误重启／残留与结束后假起音，再记 voice／CPU。藏预警或制造假事件则撤回。

<a id="51"></a>

### 6. 警报已听清却判断错：先改触发语义

核实：2026-10-17 UTC+8；主线三。补充04的症状选择：已经听得清却误导行动时，修事件触发／提示含义；只降音量或重报频率不能修正语义。OpenRA的撤回与Factorio的提前救援反例支持窄条件，不推广成所有声音都应少播。[研究]

- **少播仍然报错。** [OpenRA #7787](https://github.com/OpenRA/OpenRA/issues/7787)（2015-03-29）报告己方侦察敌基地也播“敌军正在接近”；维护者确认实际触发是敌军进入视野，主动侦察与敌军来袭不等价。[#7799](https://github.com/OpenRA/OpenRA/pull/7799)试将同一敌方玩家的单位合并通报，但作者在[关闭说明](https://github.com/OpenRA/OpenRA/pull/7799#issuecomment-89345192)明确少播仍未解决侦察误报；该PR未合入，不能写成已发布改进。[一手／社区]
- **撤掉通用播报，保留有明确用途的发现。** [#7841](https://github.com/OpenRA/OpenRA/pull/7841)于2015-04-04合入，撤去Red Alert与Dune 2000普通单位的AnnounceOnSeen。可访问的PR最终head `fd143a5eb05c8a3e1032c5cfa698c72827fb4fe1`中，[arrakis.yaml](https://github.com/OpenRA/OpenRA/blob/fd143a5eb05c8a3e1032c5cfa698c72827fb4fe1/mods/d2k/rules/arrakis.yaml#L52-L57)仍给沙虫配置WormSign及雷达提示，[D2k player.yaml](https://github.com/OpenRA/OpenRA/blob/fd143a5eb05c8a3e1032c5cfa698c72827fb4fe1/mods/d2k/rules/player.yaml)保留EnemyWatcher。这是当时配置与历史撤回，不断言当前版本仍相同。[一手]
- **更少预警也可能太迟。** Factorio 0.13的[原帖](https://forums.factorio.com/viewtopic.php?t=27255)中，玩家KatherineOfSky报告只在设施被毁后听到警报，早期分散建设需要在受击时介入；5thHorseman则指出后期自动防御能使重复受击告警烦扰。同帖开发者Rseding91确认不是bug，未评价这项取舍是否适合该玩家。[社区／一手：开发者回复] 这支持按是否仍需人工介入保留预警，不能把某玩家需求当所有阶段默认，也不从该帖推断后续版本政策。

[研究] ✅ **本次针对提示已可闻却误导行动的情况，先改触发／提示含义。** 先使“发现”“来袭”等提示与实际检测条件一致；若只代表发现，就改提示或局部撤掉，别靠全局冷却掩盖。承担抢救窗口的受击预警不能被“已损失”的结果通知替代；同一危险的重复通知是否合并，另核新地点／新危险是否仍需行动。未进入播放的漏声仍按前述门控排查，被遮住的声音仍先改混音。

[研究] 静读公开讨论、PR与固定配置，未运行游戏或音频实验；不复制音声资产或移植实现。后续对照应同时覆盖主动侦察、真正来袭、已能自动处理的持续受击与需要人工救援的新威胁，记录玩家能否及时判断下一步；本次不新增实测授权。

<a id="52"></a>

## 运动可读性补研：关键提示不能靠历史积累补成另一个位置

核实：2026-10-14 UTC。主线二／三；补 04 的运动可读性：时域历史可能造成提示错位、残留和显露延迟，抗锯齿／上采样须在完整动作中验收；依据为官方文档、固定源码及历史 issue。[一手／研究]

<a id="53"></a>

### 1. 先区分输入错误、支持边界与积累取舍

- **支持边界。** [一手] [URP 6.3 motion vectors](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors.html)仅支持 opaque／alpha-clipped，不支持透明材质对象矢量；对象矢量还要求 shader pass、renderer 与对象／材质状态满足条件。ForceNoMotion 仍需对象 pass 覆盖相机矢量为零，不能视为省掉 pass 的捷径。[研究] 透明预告与余烟不能统一交给一个“打开运动矢量”修复。
- **相机相对运动。** [一手] [6.3 troubleshooting](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors-troubleshooting.html)说明跟随移动对象的相机若只用 camera motion，会给对象错误的大矢量；先查 Per Object Motion 与 Frame Debugger 的 MotionVectors pass。[研究] 屏幕位置近似不动，不代表世界空间对象无需矢量。
- **形变输入。** [一手] [6.3 Shader Graph 支持](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors-shader-support.html)的 Time-Based 会以今／前帧 Time 运行顶点子图，其他用户参数须逐帧不变；运行时改变技能强度等参数时，不能假定此模式自动正确。Custom 可提供前帧到当前的局部空间位移；Alembic 选项用于相应缓存与 PlayableDirector，普通 MeshRenderer 错开会读错流。[研究] AI 可核对动画参数变化来源与历史值归属，不能批量开启所有选项代替诊断。

<a id="54"></a>

### 2. 固定实现：不能抄反参数方向，也不能把最高档当辨识保证

[一手] 公开 `6000.3/staging` 解析为提交 `2d2e78cc9d6254bc6e7c9c5552cea053508e86cb`（2026-07-01）。固定快照不证明某个 Editor 补丁已含相同代码；部署时仍核锁定包／Editor。

- [TemporalAA.cs](https://github.com/Unity-Technologies/Graphics/blob/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb/Packages/com.unity.render-pipelines.universal/Runtime/TemporalAA.cs)：`baseBlendFactor` 表示历史贡献，getter／setter 与内部 `m_FrameInfluence` 通过 `1-x` 转换；后者是当前帧贡献。两参数方向相反，不能互抄。
- 同文件的 `varianceClampScale` 说明较低值减少拖影但增加闪烁；`VeryLow` 不做 motion dilation，注释适用于无／低运动；`VeryHigh` 启用更多过滤。这些处理路径和成本取舍不证明哪档在本项目中最清楚。
- [TemporalAA.hlsl](https://github.com/Unity-Technologies/Graphics/blob/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb/Packages/com.unity.render-pipelines.universal/Shaders/PostProcessing/TemporalAA.hlsl)的 `DoTemporalAA` 采历史颜色、裁剪，再把 `frameInfluence` 传给 `ApplyHistoryColorLerp`；后者由历史色向当前色插值。已核对执行表达式。

[一手] [6.3 AA 文档](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/anti-aliasing.html)承认快速高反差物体可能产生 TAA 拖影；该版本 TAA 与 MSAA、Camera Stacking、Dynamic Resolution 不兼容。MSAA 主要解决几何边缘，不修 specular／texture aliasing。[研究] 运动矢量只是诊断的一项，修正不保证消除拖尾；不为透明提示默认增加相机栈。

<a id="55"></a>

### 3. 可比较方案与撤回条件

| 路线 | 采用条件与具体改变 | 撤回／不适用条件 |
|---|---|---|
| ✅ 修正原生运动输入，保留时域路线 | 不透明角色／武器／形变对象矢量缺失或错误时，先核 pass、前后帧位姿和参数，再调滤波 | 透明支持受限或矢量正确仍有残影时，停止盲加开关；单人不默认重写通用 shader |
| 🧪 减少历史积累或收紧颜色约束 | 场景确实需要时域稳定性，但短暂关键提示残留／移动糊掉；小步改变历史贡献与 clamp，保留原值 | 闪烁／边缘爬动更妨碍判断时撤回；锐化不保证恢复错位历史中的真实提示 |
| 🧪 非时域基线 | 相同分辨率比较 SMAA／FXAA；以几何轮廓为主且路径兼容时比较 MSAA，保住原动作规则 | 高光／纹理闪烁、细小轮廓丢失或预算失败就撤回；不得从“没有历史拖影”推导“所有画面问题解决” |
| ✅ 收窄内容频率与透明装饰职责 | 危险边界／方向采用足够屏幕尺寸的稳定形状，与余烟分开；风格允许时让关键轮廓由简单 opaque／alpha-clipped 几何承载 | 硬边、覆盖面积或遮挡改变范围理解就撤回；不把全部烟雾改 cutout，不通过任意延长预告时间偷偷改玩法 |

[研究] 最低内部分辨率难以稳定采样关键形状时，比较简化细节、增显示尺寸或输入分辨率；上采样不保证补出短暂细节，不给通用像素阈值。

<a id="56"></a>

### 4. STP 对照不能只看相机菜单

[一手] [URP 6.3 STP](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/stp/stp-upscaler.html)要求 TAA 预处理，会隐式启用；需要 Shader Model 5.0，不支持 OpenGL ES。[研究] 非时域对照同时核 Upscaling Filter／render scale，不能只改相机 AA 标签；STP 仍需正确运动输入。

[一手] [6.3 STP Debug Views](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/stp/stp-debug-views.html)提供输入运动、重投影色差及 Sensitivity；绿色包含无法预测的快速运动、新显露区域或错误矢量，红色标示排除时域预测的像素。[研究] 用原生视图定位，再以实际动作判断可读性；调试色不是评分，也不证明透明效果无拖影。

<a id="57"></a>

### 5. 历史反例：实际修复与当前限制分开

- **UUM-72748：可见集合错误确实需要修复。** [一手] [官方 issue](https://issuetracker.unity.com/issues/14144/motion-vectors-for-an-object-are-included-in-the-urp-motion-vector-pass-when-the-objects-layer-mask-is-filtered-out)记录被 layer mask 排除的对象仍进入 URP Motion Vector pass，移动时出现幽灵立方体；2022.3.30f1、6000.0.4f1 可复现，标注修复于 2022.3.37f1、6000.0.8f1，只测 Windows 11。[研究] 这是历史上的颜色／矢量集合不一致，不是 6.3 普遍缺陷；旧工程先核补丁，不用滤波掩盖。
- **UUM-26709：较高档位也曾触发专有故障。** [一手] [官方 issue](https://issuetracker.unity.com/issues/6004/temporal-anti-aliasing-taa-produces-severe-artifacting-when-quality-set-to-very-high)记录 URP 14.0.4–16.0.0 的特定 Timeline scrubbing 场景，High 正常、Very High 黑白伪影；页面对相关分支标 Fixed，但未给精确修复补丁。[研究] 升级／换档须验证实际动作；该历史问题不足以禁用当前 Very High，也无精确修复版可引。

<a id="58"></a>

### 6. 后续获准验证与二次修改

[研究] 固定规则／相机，分开比较分辨率／render scale、时域路线及内容简化。验出现、急转、显露、停止／消失、双攻击及低帧率；二改 Time 形变为技能参数驱动或加透明余烟，再核矢量和边界。AI 构造对照，人判误读，连续观察配帧时间。

<a id="59"></a>

## 像素网格补研：低速步进不是物理插值失效

核实：2026-10-14 UTC；主线一／三。像素抖动先区分世界、低分辨率场景和最终输出取整；依据两作者原型／演示及 Unity 6.3 URP／Cinemachine 3.1.7。[一手／研究]

<a id="60"></a>

### 1. 两位作者的方案为什么不能互相代替

[一手：作者实述] Slow Rush [2024-01-26 复盘](https://www.slowrush.dev/news/pixel-perfect-rendering/)：吸附相机改善纹理／背景摇摆却让其他画面跳，对象也吸附仍失败；sub-texel scrolling 只顺画布，内部慢物体仍逐格。为摩擦停稳、弧顶／旋转而接受过滤；仍为矩形代理、真精灵未接、性能未测，Noita/Broforce 比较未独立核。

[一手] Daniel Ludwig `code-disaster/gdx-mellow-demo@901d2bcae3819807e54814a4a34d3c72d1236f68`（2016-02-07）：[MellowGame.java L297–368](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/core/src/com/codedisaster/mellow/MellowGame.java#L297-L368) 按 WORLD_UNIT_SCALE 取整 scene camera，余量给放大输出 offset；UpScaleAndBilinearFilterShader 再拆小数，[fragment shader](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/core/assets/shaders/mellow.fsh) 四采样加权。对象为 tilemap，未证明独立角色慢动平滑。

[研究] 只借低分辨率／输出分工；demo 写死尺寸／倍率、运动含逐帧项，不作底座。[一手] [LICENSE](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/LICENSE) MIT，外部 tileset 另署名未清资产权；博客未读到，机制来自下载固定源码，未构建。

<a id="61"></a>

### 2. Unity 原生能力：能对齐像素，不替玩家决定取舍

[一手] Unity 6.3 [URP Pixel Perfect Camera](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/2d-pixelperfect-ref.html) 已内置 Universal 2D，不另装 Built-In 包；Pixel Snapping 仅渲染、不改 Transform，Upscale Render Texture 画参考或按视口放大的临时纹理。Point/Retro AA 仅 Crop Frame=Stretch Fill，前者清楚可闪、后者软边减闪，非慢对象通用修复。

[一手] [Cinemachine 3.1.7 Pixel Perfect 扩展](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachinePixelPerfect.html) 协调 orthographic size，blend 中暂非 pixel-perfect；Upscale Render Texture 可用尺寸少、会偏构图。Target Group 限制仍称 Framing Transposer，不当当前 Position Composer 已验缺陷。

[研究] ✅ 整格风格用原生并接受／验慢速步进；🧪 连续运动更重要才比较分辨率与过滤。阻尼／插值不消除最终量化，不为显示改碰撞或拾取；这些 Unity 配置不映射为 UE 等价菜单。

<a id="62"></a>

### 3. 后续验证与撤回条件

[研究] 同美术／动作比较严格网格、增分辨率与有界过滤，观察慢角色、跟随、平台停转及视差；二改窗口／缩放后核边缘、危险提示、鼠标对齐与构图。尺寸不一、危险模糊、成本显著或风格偏离就收窄／撤回。

[研究] 本节另未运行 shader。


<a id="63"></a>

## 信号取舍补研：呈现设置保住玩法信息，辅助规则另有承诺

核实：2026-10-14 UTC；布局于 10-17、远端入口于 10-18（UTC+8）补核。主线一／三；改变 04：先改表达再缩规则；按监看、局部命令、连续编辑选入口。证据为下列作者生产说明、手册及固定源码，未测体验收益。[研究]

<a id="64"></a>

### 不同类型的一手证据与边界

- **回合策略。** [一手] Matthew Davis [Into the Breach Design Postmortem，2019](https://media.gdcvault.com/gdc2019/presentations/Into%20the%20Breach%20Postmortem%20Final.pdf)，PDF 14、31–36：确定性／预告要求交代目标／类型，遂限三类攻击、正交方向、稳定属性并裁武器。仅 PDF 文字；表达可约束设计，不证明即时全预告或三类必好玩。
- **Dead Cells 29。** [一手] [29 系列](https://deadcells.com/patchnotes/29)：29.1 配色覆盖 HUD／菜单／图标／武器／物品，属性不只用颜色名，另有全图揭示；29.2 修重要资产被背景滤镜遮。辅助按自身承诺核，不要求保持标准未知信息／难度。[研究]
- **Dead Cells 35。** [一手] [35 系列](https://dead-cells.com/patchnotes/35) 未单标小版本项修隐形仍有轮廓，35.7 修弹体漏轮廓；多显／漏显都有风险。页含 alpha/beta，不作同日全平台发行或当前缺陷。

<a id="65"></a>

### 常显与按需查询：补回正文遗漏的条件

- **低频查询保入口。** Cogmind [2022 作者实作](https://www.gridsagegames.com/blog/2022/03/special-commands-menu-design/) 将低频命令集中到 Space 菜单，保快捷键；地图尺可从菜单开启、Space 关闭，未添常驻按钮以免占位。[Beta 11 发布](https://store.steampowered.com/news/posts/?appids=722730&enddate=1650631665&feed=steam_community_announcements)确认菜单可用。[一手] 不把即时威胁藏进低频入口。[研究]
- **高频并列也会挤占常用项。** Factorio [FFF363](https://www.factorio.com/blog/post/fff-363) 因嵌套制作分类打断操作，将平铺改默认；[1.1.0 发布](https://forums.factorio.com/91657)确认。[一手] [发行后原帖](https://forums.factorio.com/viewtopic.php?start=100&t=91657#p522402)中 KatherineOfSky 称物流低频，平铺隔开常用库存／制作而关闭，Serenity 认同。[社区] 频繁一起用的放近，低频可发现地展开；作者频率不能代表所有玩家。[研究]

<a id="66"></a>

### 远端界面：监看、局部命令与连续编辑

- **连续编辑与看一眼不同。** Factorio [FFF380](https://www.factorio.com/blog/post/fff-380) 作者试玩后将跨地点选择融入可操作 Remote View；即时旋转还简化当前／未来方向双状态逻辑，实物仍经机器人交付。[FFF423](https://www.factorio.com/blog/post/fff-423) 随后为仅查研究／警报补摘要和悬停摄像，避免丢失当前上下文。[一手] 是生产取舍，未量化收益。
- **操作未必先移镜。** Zero-K 项目 [Interface 手册](https://zero-k.info/mediawiki/Interface) 第 4／7 项分别给出小地图下令与消息跳转；所读普通页声明修订 9822。固定头 `e358dac2`（2026-10-16）的[589–600 行](https://github.com/ZeroK-RTS/Zero-K/blob/e358dac2ca2f9163c5290f700d74466016305b04/LuaUI/Widgets/gui_chili_minimap.lua#L589-L600)提供三种左键政策；[1002–1036 行](https://github.com/ZeroK-RTS/Zero-K/blob/e358dac2ca2f9163c5290f700d74466016305b04/LuaUI/Widgets/gui_chili_minimap.lua#L1002-L1036)只在无活动命令时进入移镜处理。[一手] 本轮未审完整引擎命令链，不将手册当实测。
- **采用与成本。** [研究] 监看先保上下文；目标明确的局部命令可留概览；辨不清目标／需连续编辑才进细节。保命令、选中、移镜含义，物品与到访规则另定。误选就收窄概览操作，反复切换才扩大；三入口可组合，不是升级阶梯。跨两类游戏仅支持条件选择，无工时／乐趣优劣证明。

<a id="67"></a>

### 采用、删减与不能外推的部分

[研究] ✅ 信号的对象／时点／范围／结果共享玩法状态，预览随局面更新；🧪 先减装饰，仍读不清才减组合。唯一节奏／方向线索补等义提示或明确辅助规则；声转视觉不默认增加精确坐标、透墙／提前预告，未实测字幕能替代空间听觉。⛔ 滤镜／描边／图标数量不作完成标准，也不必先建无障碍框架；无跨类型通用排序或点击数阈值。

<a id="68"></a>

### 第二次修改：仅预注册，不运行游戏

[研究] 在已有遭遇中新增远程弹体／状态，不另造脱离实际玩法的展示台，与旧敌人混用；在实际提供的默认、静音、减粒子、改色／轮廓设置下核危险源、时点、范围和结果；只记录可见／可听信息，不以效果组件已启用代替辨识。隐形／未发现对象随规则显隐，全图等辅助按新承诺验，切回再核旧状态。第二种颜色／状态覆盖场景、HUD、物品说明与旧内容；持续挤占提示则减组合／重做表达，再决定保留招式。

有远端界面时，新增地点／命令后核监看、下令、切回、常用信息位置与误选；活动命令不被误作移镜，概览不足辨认就进入细节。[研究]

**验证范围：** 一手正文／PDF 文字、手册与所链固定源码；未运行游戏或色觉／听觉测试。AI 查映射，人判节奏、可读性及辅助承诺。[研究]

<a id="69"></a>

## 空间容错补研：动作已开始却卡在边角

核实：2026-10-15 UTC；主线一／三。动作已接受却卡微小边角时，比较碰撞表达与局部纠偏；时间缓冲、坡阶、量化与足锁不代替此选择。[研究]

<a id="70"></a>

### 两种玩法的作者证据：局部补偿不是统一缩小碰撞体

- **Factorio。** [一手] [FFF346（2020-05-08）](https://www.factorio.com/blog/post/fff-346)：岸线旧矩形像无形墙，改按玩家位置／过渡形状通行，敌人可不同；后加玩家参数，造地安全检查仍整包围盒，误判合法站位落水。作者称旧修缺测试、早期记忆可能不准。[研究] 同角色各调用统一政策，非所有实体同规则，非当前源码审计。
- **Celeste。** [一手] [Celeste & Forgiveness](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html) 分上升顶角侧挪、水平冲刺上缘、半实心上推，与时间缓冲并列。[研究] 按动作容小误差，非全动作／统一像素或受控收益。

<a id="71"></a>

### 固定实现与后续修订：没有墙，不等于可安全纠偏

[一手：源码静读] `NoelFB/Celeste@1b0ce45c75e05649ae91b44a8bb6b196684e4352`：

- [Player.cs L2399–2422](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs#L2399-L2422)的水平碰撞纠偏限于 Dash／RedDash 及纯水平速度分支，按有限偏移距离试上下位置，无 Solid 后调用 `MoveVExact`／`MoveHExact`；着地可蹲下分支优先。
- [L2582–2613](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs#L2582-L2613)的上升顶角修正按水平速度符号选择左右，找到无 Solid 点后直接改位置。[研究] 两条应用路径也不同，不能从字段名抽成一个通用“纠偏半径”；本轮只审公开 Player 类，不声称审完商用游戏全部碰撞回调。

[一手] [V1.4.0.0 changelog](https://www.celestegame.com/changelog.html) 后补刺顶冲刺角／单向平台不修、用 hurtbox、禁向刺地下修，固定旧树缺这些条件。[研究] 借有限／状态搜索，勿照搬旧版；核路径、落点、危险／通行，各类顶角不一定同条件。

[一手] 同 SHA [README](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/README.md)／[MIT LICENSE](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/LICENSE) MIT 仅代码，非游戏／资产；只借片段，不作 Unity/UE 即用控制器，作者网页不授权商业资产。

<a id="72"></a>

### 代价与另一个作者的维护反例

[一手] [FFF344（2020-04-24）](https://www.factorio.com/blog/post/fff-344)：mod 单位启地形过渡后，抽象寻路未支持而崩溃，先退后补；敌人还涉及防御策略与计算，约5%仅历史粗测。[研究] 维护涵盖实体与世界修改调用，不只碰撞循环。

[一手] [Mina the Hollower 更新页](https://www.yachtclubgames.com/blog/mina-the-hollower-update-notes/) 页头 2026-06-26；1.0.5 缩 Spark 排出框、排除箱／雪球／可动可破坏物；1.0.6 修钓竿跳落 speed bump 卡墙排出并调位置偏好。小版本无各自日期，不共用页头作发布日期。

[研究] Spark 不是玩家；重叠排出也不同于 Celeste 动作容错。本例只说明对象、动作与位置偏好仍需维护，不作算法排名。

<a id="73"></a>

### 最小采用、撤回与第二次修改

[研究] ✅ 轮廓误导先改碰撞／关卡；🧪 有意宽容微小误差才沿运动所有者补有限、状态限定纠偏。精确卡位本是挑战则保留；穿错路线、入险或豁免增多就收窄／改空间，不一律扩大搜索或缩身体。

[研究] 二改择一：危险移动平台或可放置地形。对照原规则、空间修正、局部纠偏，在相同接受时刻核位置、分支、危险与所选路线；回查旧角、两侧通路、单向／动态障碍、重开／放置位置。敌我按各自政策。

[研究] AI 追移动／放置／脱困分支并备同输入回归，人定容错和风险；后续记录维护成本，有限查询未必比改关卡省。

**实际范围：** 静读原文／补丁／固定源码与许可；另未看嵌入视频或测最佳偏移，不给双引擎伪等价配置。

<a id="74"></a>

## 听点补比：镜头改变时从哪里听

核实：2026-10-15 UTC。[研究] 补世界声听点选择，与可听范围／恢复、选曲和相机取景分开。

<a id="75"></a>

### 视口与角色附近都有成立的条件

| 依据与证据等级 | 可改变的选择 | 反例与边界 |
|---|---|---|
| [一手] Factorio 作者在 [FFF-332](https://www.factorio.com/blog/post/fff-332)（2020-01-31）说明默认听点移到屏幕中心，便于地图视图，并调整缩放／衰减 | [研究] 管理／远程操作可先让当前操作视图有声音 | 身体附近声音可能变远，故不作近身动作默认，也不由旧文推当前全部参数 |
| [一手] NieR:Automata 开发者在[声学说明 Part 2](https://www.platinumgames.com/official-blog/article/10027)（2019-01-18）说明，多种视角下默认把听点放在角色附近；舞台等场景另改听点，并对交接作插值 | [研究] 镜头经常拉远／换视角而交互仍围绕身体时，可先保持近身声音稳定；远处演出再局部交接 | 这是非独立游戏对“听点必随相机”的反证，远处展示仍可例外；单人不复制其 Wwise 工程、预设或制作规模 |

[一手] [2.1.21 更新](https://forums.factorio.com/viewtopic.php?p=705355)（2026-10-06）修退出 remote view 过强多普勒，未公开算法／未核发行通道，不称速度归零。[研究] 切镜／传送勿意外变听者高速，有意音高仍按玩法。

<a id="76"></a>

### 固定源码：位置、朝向、速度是不同输入

[一手] Overgrowth 固定提交 `245fe4828631c84c0023d29d1525f5716ccb6106` 提供另一种 3D 动作实现：

- [玩家镜头脚本](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L11179-L11188)在 focused_character 分支把相机位置、朝向／上方向和零听者速度传给 `UpdateListener`；[Camera::GetPos](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Graphics/camera.cpp#L153-L155)包含追踪距离偏移，不能把它当角色中心
- [对白镜头](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/dialogue.as#L1180-L1189)取得控制时同样传零听者速度；[自由镜头](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/cam.as#L317)却传入 `vel`，并非所有模式都归零
- [脚本转发](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Scripting/angelscript/asfuncs.cpp#L1953-L1955)及同文件 L2069 的注册通向[音频接口](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Sound/sound.cpp#L116-L120)，分别设置 listener position、velocity、orientation

[研究] 按模式明确位置／朝向／速度；源码未说明全部意图。零听者速度不归零声源速度或全关多普勒；“角色位置＋相机朝向”也不等于相机位置算方向。

[一手] [README](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/README.md)／[LICENSE](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/LICENSE)：代码除例外 Apache-2.0，游戏美术／关卡不开放，资产分发需书面许可。[研究] 只借机制；实际复制另核文件／依赖并保通知。

<a id="77"></a>

### 原生入口够先选听点，不保证跨引擎分离声像和衰减

- [一手] Unity 6.3 [AudioListener](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioListener.html)默认在主相机，官方也建议按游戏尝试相机或角色；场景只应有一个正常工作的 listener，混响区亦以听者位置影响听到的声音。[研究] 先移动／定向单一听点，不以双 listener 过渡；文档未承诺分别设置衰减与声像原点
- [一手] UE 的 [SetAudioListenerOverride](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Game/Audio/SetAudioListenerOverride)可通过 PlayerController 覆盖位置／朝向；附着组件时参数是偏移，否则是绝对值。[研究] 特殊视图进入／退出均须交接，避免后续继承旧位置
- [一手] UE 另暴露 [Set Audio Listener Attenuation Override](https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/Game/Audio/SetAudioListenerAttenuationOverr-)。[研究] 节点页说明有限，不能证明遮挡、混响和距离消费者均沿此覆盖，也不能给 Unity 编造等价接口；确有需求才分离

<a id="78"></a>

### 成本、撤回与第二次修改

[研究] 改听点须回查衰减／空间效果，不靠全体 2D 或增益补坐标。blend 可能穿无关区域，cut 可能突变；近身失衡则回角色附近，远程缺反馈才局部交接。

[研究] 二改加远程观察／演出，固定近远声源，验拉远、转身、切镜、退出及暂停恢复，记录位置／朝向／速度和方向／响度／音高。音高先核多普勒，响度先核坐标／衰减；人判交接自然，原生足够就停。

**实际范围：** 静读作者／官方资料、固定源码与许可，未试听。

<a id="88"></a>

## 墙门遮挡补比：直达被挡不等于通路消失

核实：2026-10-16 UTC+8；主线二／三。[研究] 按可听规则区分直达遮挡、分区及通路，保既有系统，不以声学真实度为统一目标。

<a id="89"></a>

### 两种生产机制及不能互换的结论

- [一手] Homebody 主程序／技术设计 Alex Belzer 的[项目说明](https://www.alexbelzer.com/work/homebody)明确使用 zoning 处理 obstruction／occlusion，目的是减少每个 emitter 到 listener 的寻路或 raycast。[研究] 固定室内已有区域／门关系时可借划分；作者未给算法、声部规模或测量，不证明本项目速度／听感收益，也不搬自建音频系统
- [一手] Barotrauma 固定提交 `e6e95da83b1b5ca8b55ec52653c7cf6b40e30247` 的 [ShouldMuffleSound](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/Barotrauma/BarotraumaClient/ClientSource/Sounds/SoundPlayer.cs#L988-L1012)在听者水下／低通等判断之外，比较房间通路的近似距离与声音范围；[Hull 路径查询](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/Barotrauma/BarotraumaShared/SharedSource/Map/Hull.cs#L1137-L1212)考虑连接 gap、门开闭／损坏／开启程度与客户端预测状态。[研究] 通路／门状态可影响闷声，但不证明完整传播、精确绕射或声像沿路径转向；不逐声源移植寻路

[一手] Barotrauma 是**受限公开源码**：[固定 README](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/README.md)要求先读 [EULA](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/EULA.txt)，后者明确限制于 Barotrauma 相关非商业用途／模组，不允许将代码用于自己的项目或商业用途。已读固定 EULA 的完整摘要及正式第 1–8 节，未见 AI、训练或自动分析专门条款；不据此推定仓库／网站其他条款无限许可。只借高层机制，不复制代码／资产或推荐商业移植，公开可读不等于可复用开源。

<a id="90"></a>

### 原生职责与成本：不是跨引擎同一个开关

- [一手] Unity 6.3 [AudioLowPassFilter](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioLowPassFilter.html)按 cutoff 去掉高频，并提供随开门改变 cutoff 的例子；挂在 AudioSource 或 AudioListener 的作用范围不同。[Physics.Linecast](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.Linecast.html)提供线段碰撞查询及层／trigger 筛选。[研究] 简单门关系由现有状态驱动声源，确需几何遮挡才查询；声学阻挡层、查询频率、状态所有者与过渡仍归项目，原语不寻找绕行通路
- [一手] UE 5.8 [Sound Attenuation](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-attenuation-in-unreal-engine)原生提供 Occlusion、Trace Channel、低通频率、音量衰减与插值时间。官方指出 simple collision 较便宜但可能误判复杂形体；修改 Visibility 的响应可能影响其他系统，可考虑独立音频 channel。[研究] 先配置原生能力，不造等价管理器；插值仅缓和边界变化，不修正错误碰撞、过期门状态或补出间接路径

[研究] ✅ 直达够用就停；房间开门／破洞先复用分区与状态，承担内容关系维护。材质透射／反射等明确缺口才评估现成传播，先核引擎／平台／许可。分记 voice／查询／DSP，虚拟化不保证自写查询停，不给通用射线数。

<a id="91"></a>

### 集成反例与第二次修改：只预注册

[一手] [Steam Audio Unity 当前指南](https://valvesoftware.github.io/steam-audio/doc/unity/guide.html) 分 Occlusion/Transmission/Reflections；几何默认 static，动态门需导出 Dynamic Object，只传整体 Transform，不支持子物体独立变化。[研究] 铰链二改须核声学几何，非插件推荐／许可背书。

[研究] 二改加第二出口／破门，固定关键声音，比较无障碍、隔墙、门开关与绕行，沿门边查闷声、突变、漏预警及方向；再加环境声量声部／查询／DSP。输入错误先修，滤掉提示就收窄／撤回；人听验，简单遮挡／区域规则够用就停。

**实际范围：** 静读原文／契约／源码／许可，未试听；未采用未经独立核实的 Wiki 修复描述。

<a id="95"></a>

## 高速碰撞补研：线性、旋转与误接触

核实：2026-10-16 UTC；主线三。先分线性漏碰、旋转漏碰及误接触再选 CCD／substep；依据公开契约／问题报告。[一手／研究]

- **Unity 6.3 内置 3D 的模式不是无条件升级链。** [一手] [选择表](https://docs.unity3d.com/6000.3/Documentation/Manual/choose-collision-detection-mode.html)建议从 Discrete 开始，漏碰时试 Continuous Speculative，仍漏碰／误碰时按静态或动态刚体对象比较 Continuous／Continuous Dynamic；但同页明确后两者不适合旋转造成的碰撞。[sweep 原理](https://docs.unity3d.com/6000.3/Documentation/Manual/sweep-based-ccd.html)沿当前线速度计算 TOI，碰撞后可重算速度与再扫掠；固定支点的弹球挡板是官方旋转反例。[研究] 旋转物体不因“更精确”改 Continuous Dynamic；CCD 内部子步不等于全局提高模拟频率。范围不含 Rigidbody2D／ECS Unity Physics。
- **Speculative 的撤回条件不只有漏碰。** [一手] [speculative 原理](https://docs.unity3d.com/6000.3/Documentation/Manual/speculative-ccd.html)按线运动及角运动扩张 AABB；最近点法线可能把细分表面接触误判为斜坡，让高速球无故向上跳。若求解阶段获得额外能量、越出原先扩张范围，仍可能漏碰。[研究] 需要准确线性接触时可比较 sweep，角运动仍核误碰／漏碰；换模式或提高频率不保证修好。图例仅支持机制，不是本仓库体验／性能实测。
- **UE 5.8 分别查 Chaos 刚体与 ProjectileMovement。** [一手] [FBodyInstance](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/FBodyInstance)以 bUseCCD 为组件启用 CCD；[UProjectileMovementComponent](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UProjectileMovementComponent)以 bSweepCollision 控制扫掠检查，bForceSubStepping 通过更小步改善轨迹精度；UpdatedComponent 若模拟物理，则初始发射参数后由物理接管。[研究] 先确定运动所有者，不给两条路径同时套 Unity 模式；这些 API 说明不能证明 Chaos CCD 保证角运动命中。[物理 substep](https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-sub-stepping-in-unreal-engine)分割帧时间以改善复杂物理资产稳定性，受 Max Substeps 和 Max Physics Delta Time 限制；不能把时间细分当作更换检测算法。多回调已由 [04 物理行](../../domains/game-dev/04-client-modules.md#2-十一个模块的最低交付线)覆盖，不新增另一套结算规则。该文仍含 APEX／mobile 旧措辞，本轮不据页眉推导平台支持现状。
- **真实报告限定到其版本和配置。** [一手：官方问题记录] [UE-358355](https://issues.unrealengine.com/issue/UE-358355)给出 Vehicle 模板复现步骤：高速 Chaos Vehicle 开 CCD 后碰撞 One Way Interaction 动态物体，出现不应发生的明显减速；开／关 CCD 是报告里的对照。核实时为 Unresolved，列影响 5.5／5.6／5.7，目标修复 6.0；不能推断 5.8 已确认受影响或 6.0 已修复。原因归于 CCD sweep 是 licensee 的猜测，本轮未证实，也不推荐报告中的内部回调绕过。[研究] 新增 CCD 后仍须验响应政策；不推广为所有 Chaos 接触或 Unity speculative 同类故障。

**二改预注册：** [研究] 直线球／薄墙基线加旋转杆、细分表面；核漏碰、偏转及响应，先比算法再比步长／成本。UE 分别核 ProjectileMovement、Chaos 及物理接管；确需 One Way 才加。防穿透破坏反弹／推动规则则撤回定位，不全局升档。

<a id="96"></a>

## 声音响应补研：低延迟与连续播放分别验收

核实：2026-10-16（UTC+8）；主线一／三。确认声迟到先定位等待再比原生缓冲；不同类型游戏有相反维护选择。[研究]

<a id="97"></a>

### 处理块缩小与扩大都可能合理

- **OpenTTD 的缩小。** [#12227](https://github.com/OpenTTD/OpenTTD/pull/12227)于2024-03-07合入，[25aeb1c](https://github.com/OpenTTD/OpenTTD/commit/25aeb1c5a536219d07bf1e7a75fcacccd0f35249)将 win32／XAudio2 默认块从8192改1024。作者按44100Hz给出每块约186／23ms，这不是端到端测量，也不能称实际节省163ms。[补充说明](https://github.com/OpenTTD/OpenTTD/pull/12227#issuecomment-1984711843)指出该 mixer 在块起点启动声音，大块会将不同游戏 tick 的声音挤到同一起点，修改只是缓和；Cocoa 用系统块大小，不在此修改内。[一手／研究] 支持核实际消费粒度，不支持照搬1024。
- **VVVVVV 的扩大。** 2026-04-30 [0d69dd3](https://github.com/TerryCavanagh/VVVVVV/commit/0d69dd3820189937cc623b9ed30fffc60c5f787e)在[初始化](https://github.com/TerryCavanagh/VVVVVV/blob/0d69dd3820189937cc623b9ed30fffc60c5f787e/desktop_version/src/Music.cpp#L746-L759)加 FAUDIO_1024_QUANTUM，调用处无平台条件，mastering voice 仍44100Hz；目的仅是缓和部分端口的爆音／变慢，不能称各平台修复。[#970](https://github.com/TerryCavanagh/VVVVVV/issues/970)仍 open，Linux原报告未获该提交回归确认。[FAudio作者](https://github.com/TerryCavanagh/VVVVVV/issues/970#issuecomment-4352893115)说明该 flag 表示约21.33ms时间窗口，不能按名字当所有采样率固定1024样本，更不能与OpenTTD横比。[一手／研究]
- **节奏游戏的历史撤回。** osu-framework [#3832](https://github.com/ppy/osu-framework/pull/3832)、[654e9db](https://github.com/ppy/osu-framework/commit/654e9dbe972972c70a925d742776f419a73d052c)于2020-08-17撤掉强制 DevicePeriod=1，保留其他缓冲设置；维护者报告部分 PulseAudio 环境爆音，增大另一 buffer length 不能解决同一问题。[一手：历史维护] 周期、块长度与排队不是可互换旋钮，不据此称当前版本有该问题。[研究]

许可仅作机制借鉴边界：[OpenTTD固定许可](https://github.com/OpenTTD/OpenTTD/blob/25aeb1c5a536219d07bf1e7a75fcacccd0f35249/COPYING.md)为GPL v2并列第三方例外；[VVVVVV自定义许可](https://github.com/TerryCavanagh/VVVVVV/blob/0d69dd3820189937cc623b9ed30fffc60c5f787e/LICENSE.md)限制商业性修改／分发，图像和音乐另有权利。本节不复制实现或资产，不推荐把VVVVVV作为商用移植底座。[一手／研究]

<a id="98"></a>

### 原生取舍及第二次修改

Unity 6.3 [Audio设置](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioManager.html)与[GetDSPBufferSize](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSettings.GetDSPBufferSize.html)区分响应、每块样本及块数，较小粒度增加CPU开销。UE [平台音频设置](https://dev.epicgames.com/documentation/en-us/unreal-engine/platform-audio-settings-in-unreal-engine)分别控制 Callback Buffer Size 和 Number of Buffers to Enqueue：减少前者可减等待但增加CPU工作，增加后者会增加延迟并缓和部分线程供给波动。[一手] 先用已有配置，只改变与瓶颈相关的一层；不要为此换中间件或自建后端。[研究]

二改仅预注册：用已准备好的短确认声区分首次准备与每次起音等待，记录输入接受、播放请求及实际输出；增加背景音乐／空间处理或换已承诺支持的输出设备后，在空闲及高负载下比较原配置和一个低延迟配置，兼查爆音、断续及音频CPU。[VVVVVV原报告](https://github.com/TerryCavanagh/VVVVVV/issues/970#issuecomment-1515043078)中磁盘录音无噪声而扬声器有，故内部录音不替代全部实际输出验收。[社区／研究] 收益不明或连续性退化则恢复基线，迟交事件／首用准备先修对应环节，不改操作判定掩盖声音迟到。

[研究] 仅静读契约／源码／讨论；未运行后端或设备测试。

<a id="99"></a>

## 转向补研：先分限幅与平滑，再决定是否撤回插值

核实：2026-10-16 UTC；主线一／三。快速转向先隔离输入平滑、限幅与呈现插值，再决定取舍。[研究]

<a id="100"></a>

### 同一游戏里的不同选择与局部撤回

[社区] Barony Quality of Death 测试期的[原帖](https://steamcommunity.com/app/371970/discussions/3/3727324132820504963/)中，Ninjaboi8175 于2023-02-03报告关闭 Camera Interpolation 有效；FLy1n RabBit 于03-21说关闭后问题仍在，高刷新显示下的观感也难接受。开发者 WALL OF JUSTICE 于04-04建议另关 Mouse Rotation Limit；04-09同一位 FLy1n RabBit 明确回报改善，并选择保留插值，同时仍感觉停鼠后的数帧余动。[研究] 同一人的前后反馈缺完整设备配置与精确构建号，不能定位余动来自哪层，也不证明所有玩家的问题已解决。

[一手] [591ebab3](https://github.com/TurningWheel/Barony/commit/591ebab3eedd9e67b7142daf60794de575814172)（2023-04-28 UTC）将 `disablemouserotationlimit` 默认及设置应用路径置为 true，停用限速的菜单与序列化入口；[官方 V3.9.1 公告归档](https://store.steampowered.com/news/posts/?appids=371970&enddate=1686762095&feed=steam_community_announcements)（2023-05-14，Misc. Tweaks and Fixes）列出撤去 Rotation Speed Limit。[研究] 补丁、发布与反馈的时间接续可核，不证明修改单因该帖。[2020-01-07的旧补丁](https://github.com/TurningWheel/Barony/commit/4fd68a0864f4532607392540c09c5c69afa4216e)已加入关闭水平限速的选项，因此不是QoD新引入限速后才撤回。

<a id="101"></a>

### 三种机制分别负责什么

[一手] 同一固定 `591ebab3eedd9e67b7142daf60794de575814172` 树中，限速与平滑不是同一个算法：
- [actplayer.cpp L574–603](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/actplayer.cpp#L574-L603)按 `smoothmouse` 分支累积／衰减水平输入或直接赋值，`disablemouserotationlimit` 则单独控制 ±0.35 的夹取；这是转向上限，不等于输入加速曲线
- [L743–780](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/actplayer.cpp#L743-L780)另由 `bUseTimerInterpolation` 控制相机状态追踪；[MainMenu.cpp L2476–2505](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/ui/MainMenu.cpp#L2476-L2505)仍默认开插值、关 Smooth Mouse，撤限速没有一起撤掉呈现插值
- **方向边界**：[pitch L676–715](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/actplayer.cpp#L676-L715)仍有夹取；所核 flag 对玩家水平 yaw 生效，不能将公告简写扩大成所有方向、所有镜头都已无上限

[研究] 即时转向可比较关插值，但高刷新更易显低频跳动；保留时核急转、停鼠、反向。上限无玩法用途则先修截断，有转身承诺则保规则调反馈；不把三项全关作统一配方。

[一手／研究] [固定许可](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/LICENSE.txt)为 BSD-2-Clause，[README](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/README.md)说明游玩仍需购买副本；代码许可不扩大资产许可。仅静读机制、核历史反馈；不复制代码或资产，未运行游戏、引擎或设备测试，不增加实测计划。

<a id="102"></a>

## 插值预算：按观察尺度缩小呈现，不停止仿真

**核实：2026-10-17（UTC+8）。** [研究] 无热点保留全体必要对象插值；确有成本、近景／总览用途不同才按视口／尺度筛选，保留原生模拟频率与循环。

**OpenRCT2的已发行取舍。** [#24467](https://github.com/OpenRCT2/OpenRCT2/pull/24467)原先把Guest、Staff、Vehicle全加入插值，改成仅取可见且zoom≤0的视口，实体投影点落在任一视口就保留。[维护者试玩回执](https://github.com/OpenRCT2/OpenRCT2/pull/24467#issuecomment-2902380560)称未见glitches，没有设备、地图、时长或帧时分布；不把赞美评论当第二次复测。改动列入0.4.23，[2026-10-10的0.5.6发行](https://github.com/OpenRCT2/OpenRCT2/releases/tag/v0.5.6)对应[82b30979](https://github.com/OpenRCT2/OpenRCT2/blob/82b309798a83346b7f9fc61a53847f4323deb19d/distribution/changelog.txt)，[固定EntityTweener](https://github.com/OpenRCT2/OpenRCT2/blob/82b309798a83346b7f9fc61a53847f4323deb19d/src/openrct2/entity/EntityTweener.cpp#L22-L116)仍保留策略。作者认为缩小时插值作用较小是设计判断，没有感知实验或该改动的性能测量。**[一手：固定实现与发行；社区：一次试玩自报]**

筛选是所有符合条件视口的并集，不仅主相机；主视口缩小时，近看的小窗仍可能保留该对象。判定只用实体位置投影点，不是sprite包围盒或遮挡测试。preTick先restore/reset再重建集合，postTick记新位置，集合按模拟tick而非每呈现帧更新；[Context固定调用](https://github.com/OpenRCT2/OpenRCT2/blob/82b309798a83346b7f9fc61a53847f4323deb19d/src/openrct2/Context.cpp#L1342-L1377)仍执行Tick，随后tween/Draw。这只能说明减少呈现插值集合，不能说停了屏外仿真或已保证快速入屏无跳；遍历实体与视口的成本也未消失。**[一手：源码机制；研究：边界]**

**不同类型的反例。** VVVVVV [#220](https://github.com/TerryCavanagh/VVVVVV/pull/220)选择保留34ms模拟步，在中间呈现帧插值，避免为视觉帧率重调已有物理／自制关卡；拆开更新与绘制也是维护工作，不是只加lerp。它有[实际试玩](https://github.com/TerryCavanagh/VVVVVV/pull/220#issuecomment-623655566)与[维护者通关及Valgrind开销报告](https://github.com/TerryCavanagh/VVVVVV/pull/220#issuecomment-644247104)，后者不能推成普通发布构建回退。[2.3发行文](https://distractionware.com/blog/2021/08/vvvvvv-2-3-out-now/)确认高帧呈现进入发行，不证明玩家通过率提高。更直接影响筛选范围的是[#517](https://github.com/TerryCavanagh/VVVVVV/pull/517)：为滚动插值补画上方源像素，修屏幕上缘异常。这不是OpenRCT2缺陷，却表明屏幕矩形外仍可能有下一帧取样／连续运动所需数据。**[一手／社区：采用、修复与运行自报]**

**代价与撤回。** [研究] 筛选增加多视口、集合切换及数据保留责任；全体更简单，原低频牺牲连续感。二改快速入屏对象／附属视口后核近景、总览、远主＋近窗、出入屏、缩放反向及暂停恢复；危险难追或突跳就扩范围／撤回。模拟、碰撞与索引照原契约，不套 zoom 阈值。

[研究] 未测筛选成本、帧时或辨识；0.5.6 留代码不证明全版无回归，历史试玩不覆盖目标设备。不排名全体／选择性插值或推断 AI 收益。
