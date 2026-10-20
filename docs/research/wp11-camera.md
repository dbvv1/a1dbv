主线：一／二／三；镜头信息、进度决策与第二次修改
改变的建议：[研究] 镜头先定信息与控制目标；关卡、叙事、教学、重试和辅助按玩家决策取舍。
新证据：原WP11镜头与进度模块的固定源码、官方契约及开发者复盘原文迁入；本次仅拆分，未新增实测。

# WP11分册：镜头、关卡与进度

核实日期、许可与验证范围沿用[原记录总说明](2026-10-14-game-wp11-gameplay-architecture.md)及各节；本文只移动完整研究块，不改变原结论。

分册：[基础与生命周期](2026-10-14-game-wp11-gameplay-architecture.md) · [战斗与AI](wp11-combat.md) · [镜头与进度](wp11-camera.md)。

<a id="s9-1"></a>
## 镜头质量补研：从跟得上到看得懂、控得住

核实：2026-10-14 UTC；主线1／3／4。05 §8补预判、取景、输入连续性与视觉意图；依据为Cinemachine 3.1.7文档、Celeste64固定实现、开发者自述及2026可访问性指南。[研究]

<a id="s9-2"></a>
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

<a id="s9-3"></a>
### 2. 三种玩法的不同默认，不共享一套“最佳参数”

**[研究] 平台跳跃**：保起跳前落点、空中高度参照与下落安全空间。屏内房间固定，大房间用死区／边界，高速漏看才加水平前瞻；纵轴按着地、越窗、下落更新。窗口导致落点晚出现或试探时前瞻翻向即调整。关卡标必要视野，程序维护少数规则。

**[研究] 俯视战斗**：固定朝向、稳定尺度、有限跟随；小场一次看全，Boss／双目标才加目标组并设最低可读尺度。分散敌人导致过度缩放时缩目标集或改空间；看不清动画、呼吸式变焦或新增敌人需大量特例就退回。未核生产游戏采用此组件组合。

**[研究] 越肩**：探索可有惯性，瞄准需直接响应；相机、身体、骨骼分开。绕行会改瞄准关系，拉近会损周边信息；有限策略仍无可用视点时改几何／局部显隐，承担材质维护成本。

**遮挡补核（2026-10-14，Cinemachine 3.1.7）。** [一手] [Decollider](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDecollider.html)只脱离障碍／地形，不保视线；[Deoccluder](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDeoccluder.html)依赖collider／查询，Maximum Effort限命中数，增加成本不能创造视点。Transparent Layers只排除遮挡层，不控材质。[研究] 先保瞄准意图，再在允许位移内恢复视线；两组件不自动保枪口／落点，也不默认叠用。

[一手] [Shader Graph 17.0.4 Dither](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/manual/Dither-Node.html)以Alpha Clip Threshold丢像素模拟透明并保深度写入，不是完整遮挡系统。[研究] 固定朝向可借材质原语，但须定对象、范围、恢复，保留掩体边、落地面、预告。轮廓只报角色位置，屋顶分区还需验新增层高／门窗。目标分辨率与运动中另验抖点干扰，未证优于透明混合。

[一手] **发布后反证**：[Project Zomboid 42.21 stable 公告](https://projectzomboid.com/blog/news/2026/09/42-21-stable-released/)称大树妨碍驾驶，改cutaway以露出树下房屋／家具且仍待改进。[研究] 支持树冠＋步行改驾驶／瞄准的二改验收，不证明采用Cinemachine／Shader Graph或该方案最优。

[研究] **成本**：材质不能批量显隐或墙树例外不断增加时先改几何构图。二改记collider、材质、显隐特例、恢复遗漏及工时，核角色、落点、预告、准星、弹道。[3.1 许可页](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/license/LICENSE.html)与[17.0 许可页](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/license/LICENSE.html)均为UCL、限Unity-dependent项目；引擎资格另核WP1。

<a id="3-两种真实开发证据借机制不复制整套负担"></a>

<a id="s9-4"></a>
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

<a id="s9-5"></a>
### 4. 瞄准、切镜和舒适度属于玩法质量

[一手] [Third Person Aim 文档](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineThirdPersonAim.html)区分相机看点与角色命中点；固定[CinemachineThirdPersonAim.cs](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Behaviours/CinemachineThirdPersonAim.cs)先找看点再从vcam.Follow.position查遮挡；样例[AimTargetManager.cs](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Samples~/Shared%20Assets/Scripts/AimTargetManager.cs)在CameraUpdatedEvent后更新指示，从传入firingOrigin求方向。

[研究] Follow未必是枪口；弹体体积、弹道、散布仍归武器。准星区分目标与受阻点，验近墙、换肩和高低差；装饰噪声可与瞄准分离，故意后坐力另定，不能一起抵消。

[一手] [Input Axis Controller](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineInputAxisController.html)分加减速、混合期抑制、非缩放时间、Cancel Delta Time。鼠标delta已随时间累积，不按摇杆角速率二次积分。[研究] 精确鼠标无需求不加平滑，混合期间输入政策另定。

[一手] [切换文档](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/concept-camera-control-transitions.html)中两虚拟相机可同时live，停用对象仍可能参与混合。[研究] 唯一输出指Brain层；传送、复活、揭谜、瞄准各自选cut／blend／重置，不统一过渡。

[一手] [Xbox XAG 117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117)（2026-03-04更新）建议关闭额外运动、调FOV／横纵灵敏度／自动回正；[Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/avoid-or-provide-option-to-disable-any-difference-between-controller-movement-and-camera-movement/)也要求可退出非输入效果。[研究] 非医疗阈值或实测收益；关震动后保动作、声音、UI命中信息，固定视角无需因此造双视角系统。

<a id="s9-6"></a>
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

<a id="s11-1"></a>
## Unreal 相机补研：同一遮挡问题的原生职责与新系统边界

核实：2026-10-14 UTC；主线1／3。05 §8补UE职责，依据为标5.8的Epic契约、Top Down Strategy屋顶与Experimental Gameplay Cameras；设计组合属推导。[研究]

<a id="s11-2"></a>
### 1. 默认采用什么，谁不能替谁做决定

[一手] [USpringArmComponent](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/USpringArmComponent)用ProbeChannel／ProbeSize防穿透，默认ECC_Camera；肩位用臂端SocketOffset以保查询，bUsePawnControlRotation决定控制朝向。[研究] 成熟boom不保证搜索任意可见构图；防穿墙、看见目标与枪口通路分开，非Deoccluder等价物。

[一手] [Cameras](https://dev.epicgames.com/documentation/unreal-engine/cameras-in-unreal-engine)：CameraComponent供视点，ViewTarget供候选POV，PlayerCameraManager管最终视图／混合并可查询；[ControlRotation](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/AController/GetControlRotation)是可不同于相机／Pawn的瞄准朝向。[研究] 沿原最终归属，不强制子类；控制层拥输入，碰撞不反写意图，最终视点不混成骨骼朝向。

[一手] [Traces Overview](https://dev.epicgames.com/documentation/unreal-engine/traces-in-unreal-engine---overview?lang=en-US)分channel／object与line／shape sweep，Multi Trace by Channel只返回到首个blocking hit。[研究] 相机、可见性、武器各定过滤，查多层树冠不能假定一次取全。

<a id="s11-3"></a>
### 2. 越肩绕柱：改造射击与显示规则，不再造相机框架

**[研究] ✅ 原生基线＋两条独立路径。** 相机按玩家意图定位，SpringArm 负责约定范围内的防穿透；武器负责可发射性、弹道与伤害。这是由上述契约推导的工程建议，不是文档声称 UE 自动实现的两段瞄准算法。

1. 画面准星从实际显示的视点求候选目标；读取时声明与相机更新的先后，避免拿上一帧缓存或混合前 CameraComponent transform 解释当前画面。装饰性 shake 可与瞄准姿态分离，故意后坐力是否改目标由玩法明确，不把所有扰动强制消除
2. 武器从真实 muzzle／发射点向候选目标验证；hitscan 可用 line，有限尺寸弹体用合适 sweep，弧线弹道不能用一根直线宣称全程畅通。近墙生成重叠也要单独处理
3. 柱子挡住枪口但没挡镜头时，保留候选目标并清楚标示受阻／实际接触点；按既定规则阻止开火或击中掩体，不能从相机原点发子弹绕过碰撞。伤害提交仍属武器／战斗系统
4. 需要目标可见性修复时，先限制相机位移和换肩条件，持续输入不应因自动绕柱突然改方向；若取景和掩体公平性无法同时满足，修改柱距／肩位／遭遇，而非叠加一个不可预测的避障导演

[研究] **二改预注册**：新增柱／长枪，记录最终POV、ControlRotation、枪口、目标、阻挡与伤害；验双肩、贴墙、高低差、绕柱及进出瞄准。可见、射线通、体积弹体通分别核，人判断控制是否被抢。

<a id="s11-4"></a>
### 3. 固定俯视：借原生 masked 开口，不复制 Unity 材质实现

[一手] [Top Down Template](https://dev.epicgames.com/documentation/unreal-engine/top-down-template-in-unreal-engine) Strategy的M_Cutout以屏幕／相机位置开masked屋顶，实例Strength控大小。[研究] 🧪 沿现有材质工作流改造，不是树冠／落点识别器，投影、视距、多层适配待验。

[研究] 只显隐必要前景，保存对象集合、范围与恢复状态；退出遮挡、换目标、重生、卸载须恢复。保留树干、碰撞掩体边、落地面与预告；显隐不改碰撞，轮廓不提供落点。材质／房间例外过多时先简化几何与镜头。

[研究] 二改加宽树冠和下层落点，验下落前的落地面、预告、逃路，记材质例外与恢复遗漏。目标设备再验稳定性／GPU成本；未比较masked、dither、translucent，未取得模板资产／受限源码，Unity节点与UCL不迁给UE。

<a id="s11-5"></a>
### 4. 新系统何时值得替换基线

[一手] [Gameplay Cameras 插件索引](https://dev.epicgames.com/documentation/unreal-engine/API/PluginIndex/GameplayCameras?lang=en-US)、[系统概览](https://dev.epicgames.com/documentation/unreal-engine/gameplay-camera-system-overview?lang=en-US)、[Quick Start](https://dev.epicgames.com/documentation/unreal-engine/gameplay-camera-system-quick-start)本次均标UE 5.8 Experimental。系统用Camera Asset复用rig／transition／director及Debugger；教程用Occlusion Material并移除旧CameraBoom／FollowCamera。

[研究] **👀 条件评估**：多角色共享rig／过渡、图导演确能减少编写，且能承担版本与发布回归时再比。单个遮挡问题沿原基线，最终输出不争写。Occlusion Material不保证掩体边界／武器合法；未读受限实现，节点清单不代表稳定或生产采用。

[研究] **版本／许可边界**：四个 `application_version=5.8` URL 抓取失败后读取默认页，以实际标题和日期限定判断，不冒充安装包验证。工程须重核本版本的 Experimental 状态；UE 原生／资产条款仍适用，Cinemachine／Shader Graph 的 UCL 不能跨引擎移植。

<a id="s12-1"></a>
## 跟随历史补研：瞬移、换目标与变帧率

核实：2026-10-14 UTC。主线 3；收窄 05 第 8 节及本文原有“传送与重生重置阻尼”的建议。新证据为 Cinemachine 固定实现／测试与 Epic 变帧率复现报告；没有新增运行时或通用教程。[研究]

<a id="s12-2"></a>
### 1. 复用历史管理入口，不让技能各自重写平滑

[一手] 本节 Unity 源码固定为 `45728f3030787076f32930101d11d9ca96fe3a0f`，不是对稳定 3.1.7 安装包的复测。[PositionComposer](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Components/CinemachinePositionComposer.cs)的 `OnTargetObjectWarped` 仅在目标等于 FollowTarget 时平移 `m_PreviousCameraPosition` 并调用预测器 `ApplyTransformDelta`；[Predictor](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Core/Predictor.cs)中后者只平移位置，保留速度历史。`Reset()` 才清速度与平滑速度。

[一手] PositionComposer 在 PreviousState 无效或 FollowTargetChanged 时清预测器，但只在前者重建跟随历史并跳过阻尼。[VirtualCameraBase](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Core/CinemachineVirtualCameraBase.cs)的 `CancelDamping(updateNow)` 包装 `PreviousStateIsValid=false`，可选择立即更新或等正常更新。[固定 changelog](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/CHANGELOG.md)在 2.8.0-pre.1 明确换目标默认平滑，3.0.1 加入 CancelDamping；这不是本轮首次发现的新 API。

**[研究] ✅ 采用／改造一处现有相机模式入口，按事件意图选三种政策：**

- **保留连续性**：同一目标确实整体平移，且希望保留相对构图及原运动趋势，传入真实新旧位置差调用 warp；按项目相机集合通知受影响相机。传送门若还旋转朝向，位置差接口并未完成方向／速度参考系转换
- **丢弃旧历史**：死亡重生、换角色或载入后要求立即重新取景，用 CancelDamping；已激活的镜头混合另选 cut／blend。零位移 warp 不清旧趋势，直接改 Camera transform 也不等于同步组件缓存
- **保留设计过渡**：正常观察对象交接或谜题揭示允许平滑时，沿原生切换／混合；不能每次换 Follow 都强制 reset，否则会取消本来想保留的过渡。warp 更不能把两个不同角色当成同一条运动轨迹

[研究] 暂停恢复也不默认清历史：目标与相机时钟都冻结时保持原状态；菜单中允许镜头继续移动则先明确时钟，暂停期间若重生／换目标再按上述政策处理。[固定 Brain](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Behaviours/CinemachineBrain.cs)的 IgnoreTimeScale 在非固定更新选 unscaledDeltaTime；固定路径仍用 fixedDeltaTime。[一手] 勾选它不意味着新增了暂停期间的固定更新调用，也不证明整条输入／混合链使用同一时钟。

<a id="s12-3"></a>
### 2. 指数收敛不等于移动目标的跟随完全帧率无关

[一手] Predictor 中 `StandardDamp` 按 `initial * (1-exp(log(0.01)*dt/dampTime))` 返回本次施加量；`StableDamp` 只在 `CINEMACHINE_EXPERIMENTAL_DAMPING` 且非固定步长时由 Damp 路由启用，不能写成默认运行时保证。[DampingTests](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Tests/Editor/DampingTests.cs)比较不同固定 FPS 下的衰减耗时，允许两算法时间比误差小于 7%；它没有覆盖同一运动目标交替帧时间下的屏幕位置一致性。[LookaheadTests](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Tests/Runtime/LookaheadTests.cs)检查换目标标志和移动后预测量非零，也不能替代传送／暂停恢复的玩法验收。

[研究] 零依赖 Python 标准库算术复核：取 dampTime=1 秒、每帧末采样匀速 10 单位／秒的目标，逐步应用上述标量公式。15／30／60／120 FPS 时，静止误差 100 在 1 秒后均剩 1；但移动 5 秒后的追随距离分别为 1.855168528／2.009068115／2.089204983／2.130072239。计算用 `alpha=-math.expm1(-math.log(100)*dt)`、每步 `target+=10*dt; camera+=(target-camera)*alpha`；与离散稳态式 `10*dt/math.expm1(math.log(100)*dt)` 的差约为 2×10⁻¹⁰。**这是采样递推的确定性反例，不是 Cinemachine 实测**：没有目标插值、死区、旋转、硬边界或扩展，更不能据这些数值决定游戏阻尼参数。

[一手] [UE-216449](https://issues.unrealengine.com/issue/UE-216449)给出另一实现的具体反例：SpringArm 开 Camera Lag Substepping 后切换 120／60／30／15 FPS，目标的视口位置／旋转仍改变；报告指出插值子步计算问题，并提到补丁另存 PreviousTargetLoc／PreviousTargetRot。2026-10-14 核实时仍 Backlogged，更新日 2026-09-14，影响列表为 4.27–5.4。**不能据此断言 5.8 必现或已修；公开复现项目链接已移除，本轮未取得补丁或复跑。** [研究] 仅借其验收问题，不建议拷贝无法核实的引擎补丁，也不默认开启实验算法。

<a id="s12-4"></a>
### 3. 窄二改题与停止条件

[研究] **二改预注册**：增加保动量平移传送、清动量重生，并在暂停菜单触发重生。沿统一入口传意图；比较偏移、预测、恢复首帧与活动混合，移动目标另比恒定／交替帧间隔的屏幕位置和滞后。立即取景才要求清历史，连续传送验真实位移迁移。若需改多个技能／写Transform者／扩展，先收拢职责。

<a id="s13-1"></a>
## 失败与重试补研：回到刚才的决策点

核实：2026-10-14 UTC。主线 1／3；改变 05 第 9 节仅强调遭遇可重置的建议，补充高频失败玩法的重试体验。新纳入的证据是经典开发者原文与固定游戏源码，不是 2026 年新技术，也不是本项目实测。[研究]

<a id="s13-2"></a>
### 1. 不把恢复正确当成重试体验合格

[一手] Edmund McMillen [Why So Hard?（2010-04-21）](https://www.gamedeveloper.com/game-platforms/-i-super-meat-boy-i-s-mcmillen-explains-why-so-hard-)把无命数后的失败代价分等待和关长，采用短关、可见目标、快复活；与Tommy Refenes的[成品复盘（2011-04-14）](https://www.gamedeveloper.com/audio/postmortem-team-meat-s-i-super-meat-boy-i-)再述该取舍，并把失败回放作为完成奖励。仅作者解释，非独立实验／难度公式。

[研究] 短挑战分别观察死亡演出、重建转场、恢复控制、重走路程，重叠段不机械相加，动画常量不代总耗时。检查点随挑战与学习目标，而非场景文件划分；只快复活动画不能减少重复路程。

<a id="s13-3"></a>
### 2. 固定游戏实现：重建世界也可以是简洁起点

固定 `EXOK/Celeste64@6edfe1ebd2a21a6134d7675a28e357891025407e`；以下为源码阅读，未运行游戏。[一手]

- [Player.cs L1881–1991](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L1881-L1991)：死亡演出达到条件后请求 Replace，并用保留入口信息创建 `new World(entry)`；重生另有状态，演出完成才进入 Normal。常量只描述这些局部状态，不能推出目标设备从死亡到可操作的总时间。
- [Game.cs L173–250](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Game.cs#L173-L250)：退出旧场景、创建并建立新场景；资产重载由另一个选项控制。音乐路径相同且仍在播放时不重新启动音乐。[研究] 可借“重试保留体验连续性”，不能由场景重建推断必然重新加载全部资产，也不能反推其没有重建开销。
- [Checkpoint.cs L26–60](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Checkpoint.cs#L26-L60)：命名检查点更新当前入口，激活时有声音、模型状态和短形变。[研究] 玩家知道重试起点已改变，也属于恢复体验，而不只是内部字段已更新。

[研究] ✅ 小项目先复用死亡／场景重开，实测重建妨碍尝试后才缩小重置范围或驻留资源。该实现无需原地回滚／对象池，耗时与规模边界未测，不先建世界快照。

<a id="s13-4"></a>
### 3. 边界、成本与下一次修改

[研究] 永久死亡、资源损失与整局承诺有意构成风险时保留；另排查加载、确认菜单与无意义等待的意外成本，不统一改成最近检查点。

[研究] 成本包括状态入口、检查点反馈、出生安全、敌人机关与进度维护，驻留另占内存。二改延长遭遇／移动检查点后，观察回到原决策点全过程，核奖励、收集物、机关与出生安全。AI记录和回归，人定失败代价；不加回放框架。

[一手] [Celeste64 ReadMe](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/ReadMe.md#license)将MIT Source（有例外）、Content／IP及FMOD分开；仅借机制，短期jam不作生产底座。重试全程与工时未测。

<a id="s13-5"></a>
### 4. 已获线索难回看：先补材料还是移动检查点

核实：2026-10-17（UTC+8）。只读历史版本公告与玩家回执；补充05重试段“只为回看已获线索而重走，可先保留可回看材料”。[研究]

- **实际修订 [一手]**：Mobius 的 [Outer Wilds／Echoes of the Eye 1.1.13（2022-09-15）](https://www.mobiusdigitalgames.com/news/patch-13-is-now-available)同时修改视觉线索、船载日志和关卡，以“无需 photographic memory”描述其中一项；公告未展开播放条件，不能单靠这句断言全部幻灯片解锁。
- **后续使用 [社区]**：[2022-10-05讨论](https://www.reddit.com/r/patientgamers/comments/xwfpyw/anyone_else_feel_like_the_outer_wilds_echoes_of/)中，Torchiest描述较早看到的图像当时尚无意义、后来忘记而查攻略；Mossimo5明确称补丁后在船上电脑看幻灯片很有帮助，但仍不喜欢潜行。前者与后者是不同玩家，非同人前后对照，也不证明整个重试体验改善。
- **显示范围 [社区：模组作者说明]**：[Damián Garro的播放器说明](https://outerwildsmods.com/mods/shiplogslidereelplayerplus/)称原版按日志条目关联的facts显示，存在未覆盖材料；显示未看过全部材料是其模组另设且默认关闭的选项。这里只核说明，未安装模组或反编译游戏，不把模组功能归给原版。

[研究] **两个替代**：移近检查点／加捷径减少再次到达的操作；保留已获材料供回看则减少重复取证，仍让玩家推理。问题仅是忘记已见线索时，可先选后者；实际重复挑战负担仍按前节处理。以记忆为挑战目标时不自动日志化，也不提前开放未发现材料。此例不支持取消循环、统一缩短重试，或给所有谜题补答案。

<a id="s14-1"></a>
## Endless Sky：非平台游戏的动感镜头与默认值取舍

核实：2026-10-14 UTC。主线 1；补 05 §8 从“效果能关闭”到分别决定效果、默认值与首玩可发现性。比较的是俯视太空贸易／战斗中的居中跟随与加速度偏移，不重做输入研究，也不声称两种方案通过了全部玩法回归。[研究]

**居中或加速度偏移。** [一手] [#9638](https://github.com/endless-sky/endless-sky/pull/9638)于 2024-05-19 合并（`ae5c7f1fb6e791a5742cab23a9332f72913893d9`）；[固定 Engine.cpp](https://github.com/endless-sky/endless-sky/blob/cbca555b1cdca081b57ee7473f3db07a31181d96/source/Engine.cpp)的 OFF 返回飞船中心／速度，ON 插值相机速度与位置，REVERSED 反向偏移。[研究] 稳定参照与加速感各有代价：偏移改变前后视野，可能增加重找目标负担。[#8446 的讨论](https://github.com/endless-sky/endless-sky/pull/8446#issuecomment-1441120912)希望高速时多看前方，[反馈者](https://github.com/endless-sky/endless-sky/pull/8446#issuecomment-1441124904)认可动感却担心目标辨识及长时间舒适度；均为方案反馈，非计时／晕动测试。[社区]

**修订与正面反馈。** [一手／社区] 较早[#7347](https://github.com/endless-sky/endless-sky/pull/7347)按推力状态偏移；Koranir 在[2023-12-30 比较](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872451536)认为起止突兀并给替代视频。修订后 alexrovw[实际使用并表示会保留](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872582712)，[复测确认](https://github.com/endless-sky/endless-sky/pull/7347#issuecomment-1872604442)复杂转向、停车与倒车下的轮廓对齐及反向模式故障已修，仍有武器后坐力边例。作者关闭未合并的#7347 让位于#9638，前者测试不转作后者通过。#9638 获原作者[正面体验评价](https://github.com/endless-sky/endless-sky/pull/9638#pullrequestreview-1807800878)；Koranir 在[2024-05-18](https://github.com/endless-sky/endless-sky/pull/9638#issuecomment-2119032487)用 Marauder Leviathan 试玩后认为效果轻微、有动感，支持 ON 默认并被采用。没有同一批玩家的受控 A/B，不能判定后一算法普遍更优。

**撤回默认开启，保留效果。** [一手] [#12252](https://github.com/endless-sky/endless-sky/pull/12252)于 2026-02-12 合并，仅改 Preferences.cpp：加速度镜头缺省索引 1→0，并取消 Landing zoom／Show hyperspace flash 默认开启（[之前](https://github.com/endless-sky/endless-sky/blob/f57851bc0cfe715c6e276a3e1402c131fe368a4c/source/Preferences.cpp#L65-L66)／[之后](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Preferences.cpp#L65-L66)）。作者担心新人难从长设置列表找到关闭项而退出，注明 Testing Done: None，故只属可接近性判断，不是玩家流失数据。[社区] 合并后 Koranir[质疑是否收到实际投诉](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3889579433)，warp-core[说明自己也抱怨](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3897596643)，Amazinite[第一人称表示镜头效果更令人恶心而非有趣](https://github.com/endless-sky/endless-sky/pull/12252#issuecomment-3898047376)；后者未分离加速度与着陆缩放贡献、未给安装版本，不能推成玩家共识或算法因果。

**发行与采用。** [一手] [v0.11.0](https://github.com/endless-sky/endless-sky/blob/v0.11.0/source/Preferences.cpp#L65-L66)（2026-01-31）仍 ON；[v0.11.1](https://github.com/endless-sky/endless-sky/releases/tag/v0.11.1)（2026-04-25，unstable）的[changelog](https://github.com/endless-sky/endless-sky/blob/v0.11.1/changelog#L263)与源码已 OFF；[v0.11.2](https://github.com/endless-sky/endless-sky/releases/tag/v0.11.2)（2026-06-27，stable）[仍 OFF](https://github.com/endless-sky/endless-sky/blob/v0.11.2/source/Preferences.cpp#L66-L67)。[固定 Camera.cpp](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Camera.cpp#L46-L74)保留三模式，[设置读取](https://github.com/endless-sky/endless-sky/blob/f1dba50fe4cd22bd5ed51dc601203c9f62cd9164/source/Preferences.cpp#L243-L244)沿用保存值，升级不等于老玩家全关闭。[研究] ✅ 有明确不适反馈且不承担必要提示时，考虑稳定缺省＋易发现的可选效果，保留喜欢动感效果的玩家选择。代价是喜欢动感的玩家可能漏看选项，设置说明和多模式回归也增加维护成本；不默认关掉所有反馈。AI 维护开关、旧选择、菜单路径，由人决定体验，首玩测试检查能否找到并理解开关。

[研究] **证据终点**：实现、使用反馈与默认值撤回已核；人群分母、使用时长、关闭后舒适／留存收益未知。代码GPL-3.0-or-later，不作Unity／UE即插插件；有新收益复测前不再堆同类投诉。

<a id="s15-1"></a>
## 命令预览补研：提示清楚还要规则一致

核实：2026-10-15（UTC+8）；主线3／1。05 §6补提交前反馈：复用规则查询，区分精确与估计；跨工厂、经营、战术的机制证据不等于同方案均已验证。[研究]

<a id="s15-2"></a>
### 1. Factorio：动作模式改变，预览也必须改变

[一手] Wube 的 [FFF #213（2017-10-20）](https://www.factorio.com/blog/post/fff-213)列出普通建造、ghost 与 shift-blueprint 的不同规则：ghost 可忽略已标记拆除的实体，shift 放蓝图会安排拆树／石并跳过不能放置的部分。作者举例，0.15 按住 shift 后矿机 ghost 实际可放，预览却仍因树石标红，0.16 修正显示。这是开发者报告的历史修改，不是本轮复现，也未提供理解率改善数据。

[研究] 预览须含位置、模式、修饰键和相关世界状态；蓝图可提交不等于每项落地。先改现有查询，避免UI另写碰撞／费用规则；文章未证明Factorio全部查询执行已统一。

<a id="s15-3"></a>
### 2. OpenTTD：同一处理器可试算，但不是任意结果保证

[一手] OpenTTD 固定主干`daa6e1ca1c357eb9e6ae3d69af134205e1be8517`（2026-10-12），已读取完整相关文件：

- [command_func.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command_func.h)：`CommandHelper::Execute` 先以测试 flags 调用同一个 `CommandTraits<Tcmd>::proc`，通过检查后再带 Execute 标志调用；估算可在测试阶段后退出。`Do` 也区分测试和执行
- [command.cpp](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command.cpp)：试算前后切换城镇评价与持久存储的测试模式；分别显示估计费用和已执行费用动画。非 NoTest 命令断言测试／执行费用及失败状态一致，NoTest 则检查实际执行失败
- [command_type.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/command_type.h)将 NoTest 明确定义为测试／执行输出可能不同；[landscape_cmd.h](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/src/landscape_cmd.h)的 ClearArea 实际使用该标志，注明多格房屋拆除使城镇评价在两阶段间不同

[研究] **共享处理器仍有连锁状态差异**，提交须重核较早预览。随机／隐藏信息显示条件或范围；查询不得扣费、消费玩法随机或发结算事件。这些待验责任不等于已证OpenTTD全部无副作用，亦未运行其断言。

<a id="s15-4"></a>
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

<a id="s15-5"></a>
### 4. 采用成本、二改与引擎边界

[研究] **默认窄查询，确有纠错需求再选受限撤销或完整试演。** 预览含模式／修饰键、无副作用，缓存随世界变化失效；提交重验。撤销以玩家的一次操作为单位，列明它包含的设置、连线、资源和脚本效果。反向订单显示等待／失败／部分完成，已有副作用无法补偿就禁止该类撤销或缩承诺；不会仅为这点接入全局事件溯源。自由尝试本身是玩法时，可承担完整恢复成本，不把所有游戏都收窄成订单纠错。

[研究] **二改预注册，未运行**：在已有建造操作加复制设置／连线，核撤销恢复两者且不重复奖励；分别在未施工、部分施工、缺资源和目标已改后撤销／重做，区分请求与完成。战术动作新增揭雾／脚本奖励后，核撤销许可、补偿和再次触发政策。预览后改障碍／资源／目标再提交，反复取消不消费玩法随机。记恢复遗漏、例外和二改工时，人判纠错是否清楚、等待是否值得；不把有undo等同更好玩。

[研究] Unity／Unreal均沿项目已有命令、存储和动作边界选择，不要求SO框架／GAS；本节无引擎API或性能优劣结论。上述类型互为取舍证据，不是同任务对照，也未证明单人能复现整体质量。[一手] OpenTTD [COPYING.md](https://github.com/OpenTTD/OpenTTD/blob/daa6e1ca1c357eb9e6ae3d69af134205e1be8517/COPYING.md)为GPL v2，不直接复制进闭源底座。本轮只核公开原源／源码，未运行引擎、游戏或上游测试。


<a id="s16-1"></a>
## 区域命令补研：持续任务还是固定对象队列

核实：2026-10-17（UTC+8）；主线三。改变 05命令建议：需要响应目标进出时保留持续区域任务，指定对象分派才展开快照队列；追加／替换和筛选失败另定，不把统一手势当语义一致。[研究]

**两种可用任务并不等价。** BAR [#9042讨论](https://github.com/beyond-all-reason/Beyond-All-Reason/issues/9042#issuecomment-5510929781)解释：区域维修转成当时的单位列表后，会追随离区对象、忽略新入区对象；原生区域维修在任务持续期间重选范围内受损对象，区内无人需修时结束，特定 Alt 模式才持续等待。[#8342作者](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/8342)认为拆分在战斗／战场回收有用，对建造单位的维修／回收等任务却通常更差：固定展开还要维护原生区域命令已有的资源满额、复活冲突、目标移动与射程检查。这是作者使用判断，非跨游戏对照收益。[一手]

**统一转换会丢操作含义。** 历史[#5946](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/5946)合并为`33bb76324c916f6ffb2ad3e2c8f01256456b9b90`，统一区域筛选并展开目标命令；作者自述用 LLM 评审代码，尤其运输逻辑，不据此归因正确性或错误。[玩家#9042](https://github.com/beyond-all-reason/Beyond-All-Reason/issues/9042)于 2026-09-02 报告：单位上起拖会丢 Ctrl，导致应跨 Stop 保留的目标被清掉、应取消的排队攻击仍在；地面起拖正常。[另一测试者](https://github.com/beyond-all-reason/Beyond-All-Reason/issues/9042#issuecomment-5510801309)辨明起拖位置后确认结果一致。作者仅怀疑自 #5946 开始，未见定位引入提交；问题仍 open，历史合并不证明当前全部沿同实现。[一手：历史修订；社区：操作自报]

**固定修订后的回执仍有保留。** 已读候选[#8342的02d3474262237453d060f6d44b24b0e55bdf8b1d实现](https://github.com/beyond-all-reason/Beyond-All-Reason/blob/02d3474262237453d060f6d44b24b0e55bdf8b1d/luaui/Widgets/cmd_area_commands_filter.lua#L819-L868)：解析模式／悬停对象、筛能力，但空筛选仍有消费命令的分支。[2026-08-12复测](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/8342#pullrequestreview-4920866636)明确在该修订确认分配崩溃、敌我检查等已有修复，同时报告空筛选吞命令，以及无合适悬停对象时回收队列误派自己／友军；[两建造单位的回执](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/8342#discussion_r3770098055)称错误命令留在队列、下游未拒绝。另一次[游戏内回执](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/8342#discussion_r3701207170)显示取消全部误改为移除单目标后，新目标变成追加，旧目标残留。[一手：固定源码；社区：贡献者游戏内自报]

**采用边界。** [研究] 先选持续区域／固定对象，再验对象进出、混选能力、目标少于单位、空筛选及追加／替换；自动分派若需重造原有任务规则，就保留原生路径。#8342已关闭但未合并；[测试者](https://github.com/beyond-all-reason/Beyond-All-Reason/pull/8342#issuecomment-5284309510)说明未逐项对照 master，不能把所有失败归为新引入或声称候选整体通过。只提炼单款 RTS的机制选择，不复制代码、不推所有引擎实现；本仓库未运行游戏／引擎或测玩家收益。

<a id="s17-1"></a>
## 运行时叙事：开放表达、知识解锁与离线承诺

核实：2026-10-14 UTC。主线二／四；补充 03 §2 的采用与撤回选择，不改受限动作选择评级。新证据是已发行游戏的开发者撤回记录、2025-12 的叙事编辑器契约、2026-01 的本地兼容后续，以及独立的 authored 叙事路线。只读研究，未运行游戏、引擎或模型。[研究]

<a id="s17-2"></a>
### 1. 先比较玩法需要，而非台词是否无限

[一手] [Suck Up! 开发者商店页](https://store.steampowered.com/app/2726370/Suck_Up?l=english)标 2025-10-01 发行：用声音、措辞、伪装骗取进住宅的邀请，并披露第三方生成服务和联网要求。[研究] 采用理由是开放说服成为挑战；商店声明不能证明留存、净收益、响应速度或写作节省，宣传评价及未复核 token 价格不计证据。

[一手] [inkle 的 2021-02-22 发布说明](https://www.inklestudios.com/2021/02/22/ink-version-1)确认 ink 用于 Heaven’s Vault（2019）、Pendragon（2020），支持状态化内容及并行共享状态的 story flows。[研究] 因此记忆历史／按状态响应不足以单独支持 LLM；这也不是与 Suck Up!的同题比较，手写内容仍有成本。

[一手] `inkle/ink@35c63e52f1d36060930dc7ed3cfba38ea224b528`（2026-05-05）：[RunningYourInk L14–85](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/Documentation/RunningYourInk.md#L14-L85)将故事编译为 JSON 后运行，Continue／ChooseChoiceIndex 输出台词、接收选择，state.ToJson／LoadJson 保存加载；[L242–249](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/Documentation/RunningYourInk.md#L242-L249)有变量观察者，[WritingWithInk L824–828](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/Documentation/WritingWithInk.md#L824-L828)用种子复现内容。[研究] 可选本地数据驱动机制，不代表前述游戏采用该 2026 快照，也不保证零延迟、无错或跨版存档。许可／存档边界沿 WP10，不增框架推荐。

<a id="s17-3"></a>
### 2. Vaudeville：保留生成玩法，也撤回一部分供应方式

[一手：开发者自述，历史事实] [2024-01-31 pre-mortem](https://steamcommunity.com/gid/103582791472864770/announcements/detail/3973931474188161576)报告上线流量触及服务容量上限，并曾因费用不可持续退回旧语音服务；不能把当年的供应价格或容量当作当前通用成本。[2024-10-03 offline beta](https://steamcommunity.com/gid/103582791472864770/announcements/detail/4657375543606995004)转向本地对话／语音模型，同时承认 GPU 负担、加载与崩溃限制。

[一手] [2025-11-28 正式发行](https://steamcommunity.com/gid/103582791472864770/announcements/detail/520857340524626354)保留在线旧版以支持弱设备／其他语言；[2026-01-22 v1.3.0](https://steamcommunity.com/gid/103582791472864770/announcements/detail/535499112589559217)继续修 Steam Deck、非 CUDA、集显兼容并保留在线分支。[研究] 迁移仍有支持成本，本地模型不是随手可接的离线 fallback；不能由此判游戏／生成路线失败或旧故障未修。端到端延迟、成本、优化幅度、当前兼容覆盖率均无独立测量。

<a id="s17-4"></a>
### 3. 生成自由度不免除作者的进度与知识设计

[一手] [Story Vault 编辑器](https://steamcommunity.com/gid/103582791472864770/announcements/detail/520859243419534792)（2025-12-21）由作者设角色知识、地点及关键词，台词提词可解锁地点，结案题及正确项也由作者填写，并告诫勿给角色必须保密的信息。[研究] 仅读契约，未核实现或复现泄题／绕过，不据此禁用所有关键词玩法。

[研究] 关键词先作候选事件，执行侧重核进度、角色权限与前置条件；输入按可知范围过滤，不能只提示保密。作者仍设计知识、线索与答案；这是契约推导，非Vaudeville内部审计。

<a id="s17-5"></a>
### 4. 撤回条件与证据缺口

[研究] 固定内容足够则撤生成；开放表达是玩法本体时，固定回复只是有损降级。断网需明确暂停恢复、固定内容或独立本地配置，按设备／语言／质量验收；延迟含识别、排队、生成、播放，无横向数据可设统一门槛。

[研究] Steam单篇经公开HTTP核正文／日期，解析器只读到[公告合集](https://steamcommunity.com/app/2240920/announcements/)。同作者多公告不算独立样本；同题玩法与全程费用／支持成本对照仍缺，未下载模型或付费调用。

<a id="s20-1"></a>
## 关卡组合补研：连通之后还要选择什么

**核实：2026-10-15（UTC+8）；主线一／三，GC。** [研究] 05 §9：稳定动作空间先组合现有房间，地形探索可用受约束布局；数量／连通率不代体验，不要求自建框架或逐seed人审。

<a id="s20-2"></a>
### 1. 两类游戏，借不同的小机制

- **Dead Cells，横版动作。** [一手：Sébastien Bénard 历史复盘] [The Level Design of Dead Cells](https://deepnight.net/tutorial/the-level-design-of-dead-cells-a-hybrid-approach/)按世界连接、用途／biome 房间、概念图组织长度、特殊房间和出口间隔，敌人另受空间及同平台组合限制。原文 Gamasutra、此为作者转载，非新算法。[研究] 借用途与连接条件→组合→遭遇限制的次序；房间仍由人设计，作者称当时 Director 已所剩很少，不移植整套或提取资产，也不据此声称 AI 省掉内容设计。
- **Cogmind，回合探索。** [一手：Josh Ge 历史复盘] [2019 程序布局](https://www.gridsagegames.com/blog/2019/03/roguelike-level-design-addendum-procedural-layouts/)从出口恢复／逃生价值定出入口，再约束回环、开阔空间、房间尺度，支持部分／全部程序布局并剔除不合参数的图。[研究] 反证并非所有游戏都该拼房；借玩法空间目标，不移植整个生成器，俯视全图观感不代探索体验。
- **内容分配另定。** [一手] [Cogmind 2015 Map Composition](https://www.gridsagegames.com/blog/2015/05/map-composition/)对洞穴／主区域分开分配气氛、免费收益、风险收益与危险遭遇，显示分布供调整。[研究] 既有遭遇按用途核路线，不要求每房战斗或均撒奖励。

**设计意图不等于落地。** [一手] [Dungeon Metrics](https://www.gridsagegames.com/blog/2014/07/dungeon-metrics/)的 2014 正文提出偏僻程度与奖励关系，但作者 2015-11-06 评论明确物品未直接这样分配。[研究] 不能声称 Cogmind 实现“越偏僻奖励越好”；最短路只作辅助，不代未知地图真实路线。回环、喘息、绕路奖励按玩法选，不设统一阈值。

<a id="s20-3"></a>
### 2. 固定开源调用链：规则确实被消费，但不推荐整套接入

[一手：源码静读] Shattered Pixel Dungeon **v3.2.4，提交 fdb10fc77914000af0907ac63f561ff21279115b**：

1. [RegularLevel.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/RegularLevel.java#L104-L119)的 `build` 先取 `initRooms`，清连接后调用 builder，返回 `null` 则重试，成功后交 painter；其默认 `builder()` 在 LoopBuilder 与 FigureEightBuilder 中选择，不能写成所有关卡都只有单环
2. [RegularBuilder.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/builders/RegularBuilder.java#L89-L130)的 `setupRooms` 按入口／出口、商店与 `maxConnections` 分组，消费 `pathLength`、扰动权重及房间尺寸来挑主路房间；这些不是只声明未使用的标签
3. [LoopBuilder.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/levels/builders/LoopBuilder.java#L73-L173)把入口置首、出口插入主路序列中段，布置并接回入口，然后追加分支和可能的相邻连接；放置失败可返回 `null`。这证明拓扑意图在生成前／中被实施，**不证明**每条玩家路线等长、资源充足或生成耗时有上界

[研究] ✅ 借分层顺序和少数规则；⛔ 不将 Java／LibGDX 整游戏当 Unity／UE 插件。[一手] [源码许可](https://github.com/00-Evan/shattered-pixel-dungeon/blob/fdb10fc77914000af0907ac63f561ff21279115b/LICENSE.txt)为 GPLv3，所读 Java 头允许 v3 或后续，不能直接作为闭源宽松许可底座；未复制代码、未核美术／关卡独立授权。Dead Cells／Cogmind 仅公开设计说明，无代码／内容复用许可。

<a id="s20-4"></a>
### 3. 单人采用与二改预注册

[研究] 沿合规房间、遭遇与编辑器，程序员仍做内容设计。自动查可达、资源条件和敌群不兼容，人抽看代表／极端组合的压力、绕路机会与应对空间；不判所有空白为坏。房间按用途连接，探索布局按空间目标。

[研究] **二改预注册**：新增敌人／房间，保留旧规则与正常／极端种子，记违约、重复路程、资源位置、例外；同内容目标比较组合与程序布局，以试玩选择而非种子数判断。逐房修补过多则缩组合或换模块。


**结束条件与奖励（2026-10-15，UTC+8）。** [研究] 布局之外还核跳过清理是否缺下一关成长。风险取舍玩法先改目标／收益再加房间；清场刷宝本身有趣则保留。

- **Rogue Legacy，动作平台。** [一手：Teddy／Kenny Lee 作者复盘] [GDC2014 讲稿](https://media.gdcvault.com/GDC2014/Presentations/Lee_Teddy_Rogue_Legacy_Design.pdf)PDF 第16–17页说明，逐层成长使跳过清理的玩家被后续敌人数值甩开；团队移除城堡内的角色成长，把 RPG 提升放在死亡后、再次进城前。第27–33页另述为避免平均加点而采用升级一项、其他项也涨价的经济补丁；作者承认它惩罚随意升级者，坏处明显而原因不清，仍因实现便宜而接受。[研究] 借“成长安排改变是否敢离开”的机制，不推成所有游戏都应局外成长，也不误写为没有局内金币／装备收益；低实现成本不等于低体验代价。
- **Into the Breach，回合策略。** [一手：Matthew Davis 作者复盘] [GDC2019 幻灯](https://media.gdcvault.com/gdc2019/presentations/Into%20the%20Breach%20Postmortem%20Final.pdf)PDF 第20–22页把防守、操纵敌人与限回合结束联系起来，为非致命武器留下价值；第39–43页记录战略层未遵循战斗约束、研究系统不佳，最后削减并从明确奖励重新构建。[研究] 借“结束条件支持想要的动作”，不照搬回合数或删研究树；这是已有可读性引用之外的设计证据，不能证明所有清场战斗无趣。

[研究] 沿Encounter目标、一次结算与存档改：只改开门却仍须刷满成长，问题仍在；取消交战收益也会削弱战斗动机。核目标／时限表达、掉落、购买力、挑战与旧档；限时挤压观察、防守变等待时连敌人压力和奖励重选。

[研究] **二改预注册**：同敌人动作比较全清与目标完成可走；观察停留／离开理由、下一场资源，验重复完成、重返、读档不重发奖。AI记路线收益，人判断选择，时长缩短不等于更好；作者团队含美术，不能据此证明零手绘可复现。

<a id="s22-1"></a>
## 学习迁移补研：按提示完成之后会不会主动使用

核实：2026-10-15 UTC；主线一／三／四。[研究] 05 §9比较强制步骤、按需帮助、可选练习；控制可用／步骤完成不代学习迁移，不默认每机制做教程。

<a id="s22-2"></a>
### 1. 两条竞争路线：帮助时机与自主选择

- **Factorio：按需帮助。** [一手：历史作者解释] [FFF361（2020-10-09）](https://www.factorio.com/blog/post/fff-361)把逐页提示改为索引、搜索、条件推荐并统一微教程；基础说明用 tooltip，tips 处理组合与误解，易过时截图换成真实模拟演示。[研究] 借分工／回查，已有场景短演示够用就不另造嵌入式模拟器；触发、内容、示例需维护，通知也会被忽略。
- **Outer Wilds：可选练习。** [一手：开发中作者复盘] [Filling Out The Toolbox（2016-05-27）](https://www.mobiusdigitalgames.com/news/filling-out-the-toolbox)将强制工具链改为沿途练习：原流程让玩家照做，进开放世界却不知下一步，遂强调可做什么。作者承认可选教学会被跳过、多用途探测器难教，用场景示意工具用途仍只是设计意图。[研究] 寻找目标有价值时可试；代价为漏学及练习内容成本，无受控结果支持其普遍更好。

<a id="s22-3"></a>
### 2. 固定实现：触发与已读不代表掌握

[一手] `wube/factorio-data@374934f81f82b09ec9fc459f92a316bd642ddd82`（2026-10-06）的实际消费链：

- [base/data.lua L50](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/data.lua#L50)加载 `prototypes.tips-and-tricks`
- [bulk-crafting L208–229](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/prototypes/tips-and-tricks.lua#L208-L229)以连续单件下单5次触发提示，连续批量下单3次满足 `skip_trigger`，绑定相应 simulation
- [ghost-rail-planner L1685–1732](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/prototypes/tips-and-tricks.lua#L1685-L1732)组合玩法条件与已有操作，并依赖 `ghost-building`、`rail-building`
- [官方 TipsAndTricksItem 契约](https://lua-api.factorio.com/latest/prototypes/TipsAndTricksItem.html)本次页面显示 2.1.21：`skip_trigger` 取消通知但保留列表入口；`dependencies` 依赖前项标记已读。版本化 URL 本轮未取得正文，不把 latest 链接声称为永久固定版本

[研究] 行为计数可减少打扰，不证理解／迁移；不照搬5／3阈值，已读、做过、学会分开。公开数据不含完整可审计的教学引擎运行时。

[一手／研究] [固定 README](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/README.md)将公开原型用于mod、版本查看与讨论；未核跨游戏通用开源／AI输入许可，只引机制和短字段，不作Unity／UE底座。

<a id="s22-4"></a>
### 3. 反例：少指导与完成率都不能单独作为目标

[一手] [FFF213（2017-10-20）](https://www.factorio.com/blog/post/fff-213)记录无顺序微教程的问题：未懂 ghost 就学幽灵铁轨，未懂火车就学信号，因此增加依赖建议。[研究] 保留关键知识的明确教学机会，不把可选练习误写为所有前置条件都能省。

[一手] [FFF342（2020-04-10）](https://www.factorio.com/blog/post/fff-342)同时报告旧 NPE 获得正面新玩家反馈、却仍决定撤回：任务式演示吸引的受众，在正式游戏得不到同类后续内容。[研究] 教程易懂或受欢迎，也可能训练了错误的玩法期待；首玩完成不能代替正式关卡迁移。

[一手] [Outer Wilds 路线复盘（2016-08-18）](https://www.mobiusdigitalgames.com/news/the-intentionality-of-wandering)说明自由选择仍需线索，作者希望玩家有意识地选路，同时讨论怎样保留惊喜。[研究] 操作能力、值得调查的方向、谜题答案分开决定提示范围；自动提示若提前交出本应发现的用途，可能损害核心体验。该边界是设计推导，不是本轮测得的剧透影响。

[一手：历史受控研究] Andersen 等[The Impact of Tutorials on Games of Varying Complexity（CHI 2012，pp.59–68）](https://grail.cs.washington.edu/projects/game-abtesting/chi2012/chi2012.pdf)在 Refraction、Hello Worlds、Foldit 随机分配情境提示、提前手册、锁操作、按需帮助。复杂度未跨游戏随机操纵，操作范式、下载门槛、经验及自选择人群可能不同；帮助按钮跨条件汇总无一致收益，Hello Worlds 返回率在 Table 3 与正文方向冲突。时长、完成关卡、返回行为也不能证明无指令主动使用／迁移。[研究] 选型看目标玩家经验和真实误解，不能仅按复杂度／“可选”再叠帮助入口；这是 Flash 解谜／平台及蛋白质折叠游戏时代证据，非当前 AI 收益。

<a id="s22-5"></a>
### 4. 窄二改预注册与撤回条件

[研究] **预注册**：选玩家能执行却不主动用的一项工具，比短提示／回查与可选练习。分记按指令完成、解释适用情境、无指令变形情境主动使用，不合成教程通过率。

[研究] 二改用途／操作后核说明、绑定、触发、前置与示例。漏硬前置就明确教；正式玩法要探索却只等任务，就减强制步骤、补回查；无真实误解保留物件说明。AI做局部触发与采集，人定必须教什么、留下什么发现。

**特有缺口 [研究]**：跨游戏设计比较不代同玩法对照；无学习／留存收益实测。建议与Unity／UE及联网无关。


<a id="s23-1"></a>
## 辅助取舍补研：局部调整、整局预设与切回规则

核实：2026-10-15（UTC+8）；主线一／三／四。[研究] 05 §9按阻碍选局部辅助或整局预设，声明生效／关闭政策；依据为Dead Cells 29历史补丁及Cogmind设计、发布后回顾。

<a id="s23-2"></a>
### 竞争选择与一手反例

- **Dead Cells 局部选项。** [一手：历史补丁] [Dead Cells 29 系列](https://deadcells.com/patchnotes/29)将按住跳／滚、盾牌切换、输入自定义与 Assist 分列；Assist 含敌人伤害／血量、陷阱伤害／速度、格挡窗口。29.2 修关闭后子项仍生效，29.3 修 Multiple Lives 特定死亡软锁，说明菜单与规则／失败路径须同维护，非当前仍坏。另有读档敌人／Boss 复满血修复但未归因 Assist，也未证所有项安全即时切换。[研究]
- **Cogmind 整局预设。** [一手：作者设计] [Adjustable Difficulty（2017-02-16）](https://www.gridsagegames.com/blog/2017/02/adjustable-difficulty/)为计分一致将难度限下局生效、榜单分模式，调警戒压力、遭遇、出口信息而非仅伤害。作者区分练标准与探内容的人，认为低压可能不教标准所需应对；属取舍风险，非学习实验或现版全参数核验。[研究]
- **发现入口。** [一手：作者观察] [Rebranding Difficulty Modes（2019-09-17）](https://www.gridsagegames.com/blog/2019/09/rebranding-difficulty-modes/)称手册、菜单、死亡提示仍被漏看，改首次启动显式选择及 Explorer／Adventurer／Rogue 命名；[2022-05-08 回顾](https://www.gridsagegames.com/blog/2022/05/kyzratis-game-design-philosophy/)报告较易模式使用增加但仍少数，未隔离命名贡献或证留存。[研究]
- **信息权限。** [一手：同上 2022 回顾] 已警觉敌人位置曾全体可见，标准玩法优势过大后从 Rogue 撤出。[研究] 提高信号可达与揭露未知分开，不删标准必要提示或判所有轮廓越权。

<a id="s23-3"></a>
### 最小采用与撤回边界

[研究] ✅ 沿设置／规则配置：单项按键／时机负担用局部选项；资源、遭遇、探索需协调时用少量明确预设。全局降速可有意保留，核节奏、其他时钟与操作；不必暴露所有参数。

[研究] 当局调减少重开，下一局生效保持规则／计分归属。说明生效点、关闭恢复、跨档／新局保留、进度计分；关闭不会抹掉已得进度／已知情报，不统一锁成就或惩罚辅助玩家。

[研究] 探索模式不必是标准模式训练。承诺练习则保留相应决策机会，目标是内容可多改规则；较易模式成功不证明标准掌握或各区域等比例变易。

<a id="s23-4"></a>
### 第二次修改：只预注册，不运行

[研究] **二改预注册**：新增敌人／辅助，验支持组合的启用、关闭／新局、死亡重试读档；核情报切回、计分归属和进度保留。不穷举滑杆；AI追消费恢复，人验目标体验。

**特有缺口 [研究]**：未核成就解锁政策、当前存档兼容或学习／留存收益；历史补丁与作者观察仅支持各自维护风险和取舍。

<a id="s25-1"></a>
## 建造镜头补研：旋转缩放支点与输入入口

核实：2026-10-16（UTC+8）；主线一／三。[研究] 05 §8建造视图先定支点／入口；对照三维自由建造设计与二维等距修复，不把偏离都归于平滑。

<a id="s25-2"></a>
### 1. Tiny Glade：按设备改变支点政策，不是修正坐标计算

[一手] [Patch 1.11.2 公告](https://steamcommunity.com/games/2198150/announcements/detail/543346166601876516)（2025-01-15）保留 PC 的 Cursor point：绕光标下方点旋转，向该点缩放；Steam Deck 默认改为 Center region，仍可切回。作者在旋转说明中解释，单一 Center point 虽精确、易理解，屏幕中心刚好在高塔旁时却可能选中背景；Center region 从中心附近方形区域寻找候选支点。公告把体验改善写成预期，没有提供玩家对照或区域选点算法。

[研究] 🧪 缺直接指向或单点常选背景时，比明确中心与有限区域；光标保直接指定。区域会推断意图，若更难预测就退明确支点，不统一改掌机默认或靠阻尼掩盖误选。

[一手：取得范围] 网页解析只得标题，[Steam 官方 GetNewsForApp API](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2198150&count=100&maxlength=0&enddate=1737072000&feeds=steam_community_announcements)提供完整正文：appid `2198150`、gid `1788945554756976`、author `anopara`、timestamp `1736947659`，官方 community announcements。未借转载或播放动图；2024 鼠标读取异常修复与本次支点设计不同因。

<a id="s25-3"></a>
### 2. OpenRCT2：同一支点契约下删除多余拾取，按钮另修

[一手] [#12831](https://github.com/OpenRCT2/OpenRCT2/issues/12831)报告 v0.3 竖直地形面 zoom-to-cursor 偏移，复现为 Extreme Heights 边缘或抬高 4×4 地形。[#25042](https://github.com/OpenRCT2/OpenRCT2/pull/25042)于 2025-08-27 合入[85a0f70ae166cb5d240844c4dffad7c1c9fbbd76](https://github.com/OpenRCT2/OpenRCT2/commit/85a0f70ae166cb5d240844c4dffad7c1c9fbbd76)：`src/openrct2/interface/Window.cpp` 的旧路径取地图坐标、高度再按 tile 校正；新路径删两个辅助函数，仅`ZoomToCursor && atCursor`时依鼠标相对 viewport 位置与前后缩放级别补偿`savedViewPos`，再同步`viewPos`。目标仍保光标下的点，未改中心默认。

[一手／研究] 这是二维等距视口补偿，不是3D射线算法；仅保屏幕指向时可省拾取，透视旋转仍须按需找世界支点。作者及他人的主／额外视口测试只支持该修复链。

[一手] 同日[#25046](https://github.com/OpenRCT2/OpenRCT2/pull/25046)（[e4f36840bff585b4a3f5581cd2b4714f887b2c02](https://github.com/OpenRCT2/OpenRCT2/commit/e4f36840bff585b4a3f5581cd2b4714f887b2c02)）另将`src/openrct2-ui/windows/Viewport.cpp` 的额外视口按钮从直接改`viewport->zoom`接回`WindowZoomIn/Out(*this, false)`完整中心缩放。[测试反馈](https://github.com/OpenRCT2/OpenRCT2/pull/25046#issuecomment-3228516256)称按钮改善、滚轮仍异常，作者指向#25042；单入口通过不代整体。两修复均进 2025-09-06 的[v0.4.26 官方发行说明](https://openrct2.io/blog/2025/09/openrct2-v0.4.26-released)。

<a id="s25-4"></a>
### 3. 最小采用与二改验收

[研究] ✅ 在已有相机／视口入口声明支点政策：直接指向、视口中心或有限区域候选；统一坐标归属与完整变换路径，不统一所有入口的支点。Tiny Glade 的可切回是设置选择，不是射线未命中时自动回退的证据；本节不据此新增自动回退机制。

[研究] **二改预注册**：高塔／陡崖＋另一输入／视口按钮，核中心、边缘、背景、视口边界及滚轮／按钮两路径。关平滑仍错位先修选点、坐标、命令；正确但突兀才调过渡。无具体缺陷保留原方案，AI追变换，人验意图。

**边界 [一手／研究]**：OpenRCT2代码GPLv3；Tiny Glade公告不授复用权。本节只核公开API、网页、提交与讨论，非Unity／UE等价配置或游戏实测。

<a id="s31-1"></a>
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

<a id="s37-1"></a>
## 镜头借出控制：持续更新历史与当前视点分开

2026-10-16（UTC+8）补核。归 GC；改变 05 §8 的历史政策：短暂回看后需要连续返回时，除冻结／清空，还可维护原跟随状态但不输出。**[研究：条件建议]**

**失败与中间修订。** SuperTuxKart [#5270](https://github.com/supertuxkart/stk-code/issues/5270)希望保留驾驶平滑，但开赛、重开与回看结束不应追赶过时方向。[6d04543](https://github.com/supertuxkart/stk-code/commit/6d0454383ca7c151ed42e3bede1a518a13d0546b)先在回切／重开时 snap；作者称做过分屏测试，不是完整测量。[后续反馈](https://github.com/supertuxkart/stk-code/issues/5270#issuecomment-2637678754)仍有未解决项。[#5278](https://github.com/supertuxkart/stk-code/issues/5278)报告在线回切突跳；报告者怀疑首修引入但未 bisect。维护者[以地面为参照逐帧观察](https://github.com/supertuxkart/stk-code/issues/5278#issuecomment-2620599733)，认为车连续而镜头跳，并[解释](https://github.com/supertuxkart/stk-code/issues/5278#issuecomment-2621722909)镜头消费 rewind 更新、旧平滑掩盖问题；[ef8bbed](https://github.com/supertuxkart/stk-code/commit/ef8bbedfa1577612947d66f2a04f3f715b9e7b26)加入重演期间提前返回。不能把这个中间补丁直接当最终推荐。**[社区：症状；一手：维护者说明与补丁]**

**最终接受的是另一种历史政策。** [2025-03-08 f9ffcc6／PR #5365](https://github.com/supertuxkart/stk-code/commit/f9ffcc6310d4e632773acfeadcb9fd03bf446371)删除上述回切 snap 和局部 guard，保存 m_last_smooth_mode；当前视图不平滑时，仍调用 moveCamera(dt, false, …) 更新原模式的内部历史，仅 smooth 为真时写相机位置与 target。见[固定实现](https://github.com/supertuxkart/stk-code/blob/f9ffcc6310d4e632773acfeadcb9fd03bf446371/src/graphics/camera/camera_normal.cpp#L118-L165)及[1.5 发布源码](https://github.com/supertuxkart/stk-code/blob/1.5/src/graphics/camera/camera_normal.cpp#L300-L350)。这是被接受的实现，不是本仓玩家复测；也不能据删除 guard 宣称联网问题已由本轮验证解决。**[一手：固定代码]**

**不要给所有运动再套总滤波。** 不同类型的 Veloren [固定代码](https://github.com/veloren/veloren/blob/2dbddc2ffa36db9a5c69cc831b65a7336ceab6a3/voxygen/src/scene/camera.rs#L580-L637)将位置、距离、FOV 与可选旋转平滑分开；只证明可以独立选择，不证明系数可迁移。Phantom Camera [#522](https://github.com/ramokz/phantom-camera/issues/522)中，对最终 Transform 统一插值的提案被[维护者指出](https://github.com/ramokz/phantom-camera/issues/522#issuecomment-2848644530)会延迟直接旋转；[提议者承认](https://github.com/ramokz/phantom-camera/issues/522#issuecomment-2848660970)只是示意，不是完成方案。该讨论未闭环，不作已交付改进。**[一手／社区]**

**采用与撤回 [研究]**：同目标短暂借出、需连续返回时，比后台维护必要历史与回切重建；重生换目标使历史失效则重建，cut／blend另定。不让闲置镜头全做碰撞；无益或硬切够用即撤后台更新。联网另核重演污染；预注册回看时转弯再松开，记目标、历史、输出，只修变差通路。

许可与范围：STK代码GPL-3.0-or-later，Veloren为GPLv3；固定代码和修订链静读，未做完整视频体验评估，效果／成本仍待验证。

<a id="s42-1"></a>
## 本地多人视图：独立活动与双方可读性先于自动合屏

核实：2026-10-18（UTC+8）。GC，主线一／三。补此前单视口／多目标构图未回答的任务：同机两人能否独立行动，分开后双方还能否看懂自己的路线、地面与威胁。以下只比较视图机制，不把本地竞速误称合作，也不由此追加联网系统。[研究]

<a id="s42-2"></a>
### 选择及撤回条件

| 玩法承诺 | 先比较 | 何时撤回 |
|---|---|---|
| 同一区域活动，双方在可读尺度内 | 稳定共享视图、有限缩放，必要时收敛场地跨度 | 全员入镜却看不清行动；缩小场地破坏玩法就换视图路线 |
| 允许各自探索或明显分离 | 独立分屏；接近时合屏只作有条件选项 | 各自视口丢失必需前方信息，或合屏夺走旋转／瞄准控制 |
| 近距离却位于不同楼层或遮挡空间 | 保留独立视图，或分别验证显隐与可行视点 | 地面、威胁被另一玩家的显隐策略隐藏；不能仅用平面距离判合屏 |

动态合分屏不是统一最优：先能维持最小可读尺度、预告距离与控制权，再比较过渡。无法同时满足时，场地／间距约束与分屏是不同设计承诺，不默认为强拉同伴、传送或无限缩小角色；任何新增约束要符合玩法。[研究]

<a id="s42-3"></a>
### 共享屏幕的真实收益与反证：Pixel Wheels

作者在 [0.12.0 发布说明（2019-06-20）](https://agateau.com/2019/pixelwheels-0-12-0/)报告玩家认为分屏难读，因此改为单屏缩放容纳双方；同时缩小 Tiny sur Mer 赛道、移除旋转相机选项。这不是只换一个相机组件，内容尺度和控制方式也付出了代价。[一手／作者转述反馈]

作者 [2023 复盘](https://agateau.com/2023/opening-another-pandora-box/)又指出俯视二维分屏损失前方道路视野，而共享视图遇大赛道过度缩小，仍可能无法游玩，因而限制赛道规模。两篇属于同一作者的选择及后续反证，不算两个独立成功样本；也不证明所有二维游戏都应共享屏幕。[一手／研究]

<a id="s42-4"></a>
### 独立活动的相反路线与二改：Larian

[Divinity: Original Sin Enhanced Edition 制作人原文（2015）](https://blog.playstation.com/2015/08/05/divinity-original-sin-enhanced-edition-couch-co-op-rpg-action-on-ps4/)把接近时共屏、分离时动态分屏用于独立探索。这支持另一种玩法承诺，不等于动态合并没有维护代价。[一手／研究]

[DOS2 官方支持答复（2019）](https://forums.larian.com/ubbthreads.php?ubb=showflat&Number=654683#Post654683)分别说明战斗外可强制分屏、接近却未重新合并属于缺陷；在当时控制器共屏路径，除了仍可使用键盘快捷键外，只有玩家一控制相机。由此不能将“两个角色都在画面中”当作“两个玩家都控得住”；历史产品限制不外推当前版本。[一手／研究]

[BG3 Patch 8（2025-04-15）](https://baldursgate3.game/news/the-final-patch-new-subclasses-photo-mode-and-cross-play_138)记录合屏后玩家处于不同地形高度，可能使另一人的地面淡出、难以导航；修订为不同楼层或足够高度差时分屏，并增加控制器 Forced Split Screen 选项。这是显隐和视口选择相互影响的正式修复记录，不是本仓库运行认证。Divinity 与 BG3 同属 Larian，不能当作两个独立团队的一致结论。[一手／研究]

<a id="s42-5"></a>
### 二改验收与未覆盖部分

原平面场地改为上下层，再让双方靠近／分离、相反方向移动、一人停下或进入局部交互：分别观察角色尺度、前方预告、地面／掩体、旋转与输入归属、合分过渡，以及恢复后显隐。保留固定分屏作为对照；切换造成持续误判就减少自动切换或收窄合并条件，而不是只加阻尼。[研究；验收未执行]

本轮只读作者原文、支持回执与发行修复，没有运行游戏、Unity／Unreal、双控制器或 GPU 实验。未量化渲染成本、阈值、过渡舒适度、玩家表现及单人维护工时，也未认证无人工美术修补的完整流程。通用视图取舍只写一份，不虚构两引擎现成集成配方。[研究]
