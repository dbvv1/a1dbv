主线：一／二／三／四；输入、UI、存档与内容制作
改变的建议：[研究] 缺字向后回退，已有字形不合地域则改变语言选择优先级；保留 WP10 既有取舍：输入模式、保存恢复与内容身份分别维护；先借原生能力和作者工具，再补项目缺口。
新证据：2026-10-20 补译文追加内容放行与现成修订契约；另补 Mindustry 字形修复／发行链与 Unicode 地域字形机制；原日期、固定源码、许可、反证与未实测边界随各节保留。

# WP10：输入、UI 与内容

[总摘要、生命周期与预算](2026-10-14-game-wp10-client-modules.md)；[运动与视听反馈](wp10-motion.md)。本册均为既有公开资料／源码研究，不代表本项目游戏、引擎、设备或玩家实测。

<a id="16"></a>

## 菜单补研：跨暂停、改键与设备切换保住控制

核实：2026-10-14 UTC。主线 2／3；将 04 的菜单“关键页可达”深化为切换后可控、反馈可信，并限定 02 逻辑动作注入的证明范围；依据为官方文档和发行游戏更新。[一手／研究]

<a id="17"></a>

### 1. 先补玩家体验缺口，不因手柄支持迁移 UI

[研究] 按住动作进入暂停→设置／改键→弹窗→换设备→返回，目标是焦点、可用操作与返回位置清楚，确认不穿透。先定交互层、焦点、绑定提示与恢复政策；设备恢复不必自动恢复战斗。

[一手] [Celeste 官方 changelog](https://www.celestegame.com/changelog.html)：v1.4.0 加菜单改键、删冲突重开组合，修教程内进配置冻结；v1.3.3.20 beta 修关闭菜单未刷新 movement/dash-only；v1.3.3.13 beta 要各菜单动作留唯一键、失败发声并保滚动后提示可见。beta 规则不作普适标准。

[研究] 保住改键退出路径，把全局快捷键纳入冲突检查，退出菜单刷新玩法输入；不照搬唯一键／长按重置算法。

[一手] [XAG112](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/112) 要跨屏一致、布局变后合理导航及重绑定退出提示；[XAG113](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/113) 要焦点清楚，含覆盖弹窗。仅借连续控制目标，未做认证。[研究]

<a id="18"></a>

### 2. 原生机制够用的条件与新增成本

| 原生路线与直接依据 | 改变的建议 | 何时仍不足 |
|---|---|---|
| [uGUI 2.0 Navigation](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/script-SelectableNavigation.html)支持 Automatic／Explicit；滑条的值方向用于改值，不能用该方向移出滑条 [一手] | [研究] ✅ 保留已有菜单，只修不合布局的导航关系，并验证滑条进出路径 | [研究] 动态列表或布局重排使大量手工关系失效时才补共享策略，不据此否定 uGUI |
| [Unity 6.3 UI Toolkit FAQ](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-faq-event-and-input-system.html)可指定方向焦点；初始无焦点会使起点不可预测，禁用 UIDocument GameObject 后层级重建，重新启用时须再次设置焦点 [一手] | [研究] ✅ 新布局项目沿现有选型，初开／重开均设置焦点；层级重建后重新查找目标，不永久保留旧元素引用 | [研究] 自动导航不符合实际布局时补局部规则；“第一次打开可操作”不能证明第二次仍可用 |
| [Input System 1.19 UI support](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/UISupport.html)：uGUI 需要 UI Input Module，UI Toolkit 2023.2+ 可用 project-wide actions；uGUI 背景点击默认清选择；UI Toolkit `Button` 的 `ClickEvent` 与手柄 submit 不同，而 `Button.clicked` 覆盖两者；UI 消费输入不自动屏蔽 gameplay action [一手] | [研究] ✅ 先用原生映射、区分 UI／玩法模式；混用时保护／恢复有效选择，沿控件语义激活 | [研究] 业务回调测试绕过绑定／焦点，须补输入路径；两层同时响应不能靠 debounce 掩盖 |
| [CommonUI Input Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/commonui-input-technical-guide-for-unreal-engine)：激活树参与路由，停用节点不参与；导航仍与基础 UMG 相同。[ActivatableWidget](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/CommonUI/UCommonActivatableWidget)可提供目标焦点、缓存恢复目标及最末激活节点的焦点刷新；默认不自动激活或注册 Back [一手] | [研究] ✅ 简单且已可靠的 UMG 保留；🧪 跨层返回、模态和设备提示需求反复出现时再评估 CommonUI，明确激活、返回和焦点策略 | [研究] 路由不包办导航，返回目标仍须验证；新依赖和配置应比第二个菜单继续复制政策更省维护 |

[一手／研究] [CommonUI 与 Enhanced Input 集成页](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-commonui-with-enhnaced-input-in-unreal-engine) 仍标 Experimental，并留“as of UE 5.2”测试不足说明，不能据当前入口断言新版可靠或全面禁 CommonUI；仅使用该集成时核锁定版，普通 UMG 不增依赖。

[一手／研究] [PlayerInput 1.19](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/PlayerInput.html) 有设备丢失／恢复通知，但暂停、焦点与恢复仍由项目在现有设备管理中处理。

<a id="19"></a>

### 3. 先读可复用实现：官方 UI vs Game Input

[一手] 固定 InputSystem `05e45ddbaf18a93245b068d787d74b738b90d01c` 的 [UIvsGameInputHandler.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/UIvsGameInput/UIvsGameInputHandler.cs)、[样例 README](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/UIvsGameInput/README.md)、[根 LICENSE](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/LICENSE.md) 已读；Unity-dependent Companion License，非跨引擎 MIT。[package.json](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/package.json) 标 1.20.2／最低 6000.0，与 1.19 文档分列，不据元数据确认稳定发行。

- [一手] `SetUIEngaged`（304–327 行）在 UI 模式启用 UI map、停用玩法动作，并恢复上次导航选择；退出时保存选择、清空当前选择并恢复玩法。`SetPlayerActionsEnabled`（331–345 行）特意保留 UIEngage 动作，避免把退出入口一同禁用。主菜单入口另在 `Update` 先置 `InMenu` 再停用 gameplay input 和选择首按钮，`OnContinueClicked` 恢复游戏。
- [一手／研究] 恢复选择仅检查 null，未在该路径检查目标是否激活／可交互；`OnControlsChanged` 注释明说不支持 mixed models，状态机只有 `InMenu`，没有嵌套弹窗栈。因此样例不作完整改键、热切换及多层菜单底座；这是静态覆盖缺口，不是已复现故障。
- [研究] **✅ 优先借用样例中的显式 UI 交接与选择保存机制，⛔ 从零写等价事件总线或整包照搬。** 简单 uGUI 项目从锁定已发布包的样例出发，保留必要输入配置，按缺口补有效目标后备／嵌套返回；第二个菜单只缺这两项就不引框架。UI Toolkit 只借切换边界，无须迁移。官方身份与源码可见不证明它是已发行高品质菜单的完整实现。

<a id="20"></a>

#### 混用补核：提示变化不等于退出 UI

核实：2026-10-17 UTC+8；主线三。已承诺混用时，提示、交互方式与焦点分开判断；设备通知不自动意味着退出 UI。[研究]

- **Unity 样例前提。** [一手] [场景配置](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/UIvsGameInput/UIvsGameInput.unity) 连接 OnControlsChanged；[PlayerInput 契约与实现](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/PlayerInput/PlayerInput.cs#L574-L595) 通知涵盖设备集合、scheme、绑定／键盘布局。[handler 80–106行](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/UIvsGameInput/UIvsGameInputHandler.cs#L80-L106) 按分配设备判 ControlStyle，明确不支持 mixed models；GamepadJoystick 时 SetUIEngaged(false) 保存／清选择、停 UI map、启除 UIEngage 的 Player 动作，但不关主菜单或改 InGame。[研究] 借交接，勿整段作提示刷新；非 Unity 全体混用限制。
- **设备与交互语义分开。** [一手] DevilutionX [#4242 原报告](https://github.com/diasurgical/DevilutionX/issues/4242) 报光标缺失／暗／卡，窗口／屏外原因仅猜测；[2022-04-03 固定修复](https://github.com/diasurgical/DevilutionX/commit/79c7eee10aee93d7fa3429decdcb5921a1522bd5) 分 ControlDevice／ControlMode，手柄模拟指针仍保设备身份，硬件光标另判。补丁亦改调色板，未有独立复测，不能单因归属或称漂移修复。
- **混用可另定提示。** [社区／一手] Deadlock [2024-09 原帖](https://forums.playdeadlock.com/threads/game-hitches-when-using-analog-input.27479/) 报摇杆＋鼠标时图标交替／卡顿；[2024-11-07 官方更新](https://forums.playdeadlock.com/threads/11-07-2024-update.44786/) 改 glyph swapping，提供 Automatic／Keyboard & Mouse Only／Game Pad Only，并改动作／配置、提示重绑。aeodyn0 于 11-08 开 Overlay 重配后自报正常。[研究] 多项同改不能归功提示锁或确认根因，只支持独立提示策略。
- **UE 合成事件。** [一手] [CommonUI Input Technical Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/commonui-input-technical-guide-for-unreal-engine)：手柄 Accept 可合成鼠标点击；导航找目标、设 user focus，下 tick 才移合成光标。[研究] 鼠标事件不证明物理鼠标切入，先核路径，不直接重建选择。

**采用与撤回。** [研究] ✅ 混用中仅提示变化时保留菜单、有效焦点与获准输入；实际导航／指针操作或明确进出 UI 时才交接。互斥模式可保留可靠切换。振荡先分真实混用、合成事件和噪声；提示锁定不能掩盖确认／返回不可达，新增政策破坏混用就撤回。

<a id="21"></a>

#### 输入交接补比：消费按下不等于等待松键

核实：2026-10-14 UTC；主线三。收窄恢复后残留移动建议：旧缓存与设备仍按住的意图分开。依据 Celeste64、锁定 Foster 实现及 Unity 初始检查契约。[研究]

- [一手] 同 Celeste64 `6edfe1ebd2a21a6134d7675a28e357891025407e`：[Controls.cs](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Data/Controls.cs#L23-L45) 的 Jump/Dash 缓冲 0.1 秒，Consume 清六种按下，不含 Move/Camera；[World.SetPaused](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Scenes/World.cs#L416-L435) 暂停／恢复均消费，[Menu](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Helpers/Menu.cs#L248-L254) 确认后亦消费。[ControlsConfig](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Data/ControlsConfig.cs) 的 C=确认／跳、X=取消／冲刺，故有共键风险；时长非推荐。
- [一手] [csproj](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Celeste64.csproj) 锁 Foster 0.4.2，[v0.4.2 tag](https://api.github.com/repos/FosterFramework/Foster/git/refs/tags/v0.4.2)→`a5b574f36e5d8928a4d47566c7b924140b653c85`。[VirtualAction.cs](https://github.com/FosterFramework/Foster/blob/a5b574f36e5d8928a4d47566c7b924140b653c85/Framework/Input/Virtual/VirtualAction.cs#L84-L162) Update 分 Pressed/Released/Down/Value；ConsumePress 仅清有效 Pressed、置 PressConsumed，不清持续值。Clear 后仍再读设备，均非松键门禁；RepeatInterval>0 可再生 Pressed，新物理按下亦可接受。
- [一手] Unity 1.19 [wantsInitialStateCheck](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/api/UnityEngine.InputSystem.InputAction.html#UnityEngine_InputSystem_InputAction_wantsInitialStateCheck)：Value 重启后下一更新检查已操作控件，无新变化也可触发；Button/PassThrough 可启同类行为。map 切换不保证清业务缓存或要求重新按键。[研究]

**采用与反例。** [研究] UI 交接清失效离散指令／执行状态，持续值按政策重读，需松键另设门禁；不在每次角色变状态时清连招／落地缓冲。[Player](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L1149-L1165) 持续读 Climb.Down/Jump.Down，跳启动消费按下，反对一律松键。Celeste64 Source MIT／例外、Content 限制沿前文；Foster [LICENSE](https://github.com/FosterFramework/Foster/blob/a5b574f36e5d8928a4d47566c7b924140b653c85/LICENSE) 为 MIT。

**二改预注册。** [研究] 增加确认弹窗，确认与跳跃共键：返回不多跳；暂停中松开不沿用旧方向，仍按住按政策恢复，落地前缓冲仍有效；另核按住重复。AI 追输入归属，人定恢复手感。

**跨玩法补比（2026-10-14）。** [研究] Celeste64 只支持平台动作的按下／持续值和共键交接机制，不能决定所有玩法的恢复政策；以下三例进一步收窄默认做法。

1. **战术暂停仍能下令。** [一手] `Mindustry@17012d61d9e4c3cbd9820d87e81c24495486ac53`，[README](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/README.md) 为自动化塔防 RTS；[Control.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/core/Control.java#L707-L712) 暂停仍更新 input，[DesktopInput.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/input/DesktopInput.java#L276-L315) 仍移相机、438–439 才限角色，[InputHandler.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/input/InputHandler.java#L1174-L1208) 提交命令、330–355 写目标／队列不因暂停拒绝，[Logic.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/core/Logic.java#L519-L544) 另停模拟。[研究] 分选择／相机／下令与角色权限；二改队列核恢复顺序／次数，不当旧按键删除。

2. **本地菜单与 hold/toggle。** [一手] 同 Mindustry [BaseDialog.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/ui/dialogs/BaseDialog.java#L27-L38) 仅离线弹窗改暂停，[Control.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/core/Control.java#L746-L753) 联网显示菜单不由此冻结，非证明其他暂停不存在；[DesktopInput.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/input/DesktopInput.java#L300-L310) 依 commandmodehold 选 keyDown／keyTap，失资格清模式。[研究] 恢复分别定当前值、模式、蓄力和已提交命令，不以连续／离散二分替所有政策。

3. **回合持续输入会交下一步。** [一手] `shattered-pixel-dungeon@57a4e06a4caf162446d1c28caa7983f0493fecf0`（v4.0.2）：[Hero.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/hero/Hero.java#L868-L930) 无动作／非休息时 ready 并 false，[Actor.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java#L300-L324) 停连续处理；[CellSelector.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/scenes/CellSelector.java#L355-L418) UI 阻断跳持续更新，ready 才方向转格命令＋next；[GameScene.show](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/scenes/GameScene.java#L1434-L1454) 先 cancel，1716–1726 清动作／休息／键盘 held。**反证：** resetKeyHold（482–484）未清 leftStickAction，不是全设备松键门禁。[研究] 验关窗多走／耗回合、取消误提交及键盘／摇杆差异，非平台短缓冲。

**采用边界。** [研究] 先更新权限再切可能同步取消的输入，按上下文停动作；无需所有游戏同暂停政策。Mindustry [LICENSE](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/LICENSE)、SPD [LICENSE.txt](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/LICENSE.txt) 为 GPL-3.0，只借机制不移植商用引擎组件。

<a id="22"></a>

### 手柄反馈补研：结束、暂停与设备交接分开核

核实：2026-10-16 UTC+8；主线三。动作停收输入未必停止马达：分别核事件期限、持续来源与玩家／设备交接。[研究]

**两作者机制。** [一手] STK `b0689319aed2c932f76fbd86729f39cdf3fd7d65` 的 [local_player_controller.cpp L474–508](https://github.com/supertuxkart/stk-code/blob/b0689319aed2c932f76fbd86729f39cdf3fd7d65/src/karts/controller/local_player_controller.cpp#L474-L508) 给碰撞设有限时长，过滤紧邻事件，回滚重演不触发，选所属玩家允许反馈设备，[SDL 调用 L262–274](https://github.com/supertuxkart/stk-code/blob/b0689319aed2c932f76fbd86729f39cdf3fd7d65/src/input/sdl_controller.cpp#L262-L274) 继续传时长。Barony `962a5ce36d10207beef7d8673876e0cebf8e76e4` 的 [滚石 L1552–1579](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/src/actboulder.cpp#L1552-L1579) 未停且有水平速度才周期请求，[效果 L3011–3028](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/src/player.cpp#L3011-L3028) 有期限，[L2842–2899](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/src/player.cpp#L2842-L2899) 清过期并按优先级播放。[研究] 持续来源可续有限反馈，但仍有尾部；非通用时长／恢复政策。

**设备修正与后续撤换。** [一手] Barony [87255f2](https://github.com/TurningWheel/Barony/commit/87255f20b1d8c2545e57ef8143935ac00813cdd9)（2022-06-20）因 gamecontroller／haptic ID 不同改从 joystick 打开、插拔重取；次日 [d6eeaad](https://github.com/TurningWheel/Barony/commit/d6eeaadafcd2b3cd02de4ac75de0f9e3fab0473b) 改用 SDL_GameControllerRumble 并停 reinitHaptic。当前 [doRumble／stopRumble L3155–3197](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/src/player.cpp#L3155-L3197) 播放／停止可分别走 GameController／Haptic，故须核实际后端；仅静态差异，非已复现残震。[研究]

**Unity 1.20.1。** [一手] 固定 `a934411756c8862cb0f54da514a9b7cc1c000a2b`，[haptics 文档](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/Documentation~/gamepad-haptics.md) 分单设备／全设备；[DualMotorRumble.cs](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Devices/Haptics/DualMotorRumble.cs) Pause 输出零但留缓存，Resume 重发，Reset 清缓存／输出；SetMotorSpeeds 无时长也不查暂停。[研究] 输入停收／任务取消不等于马达停止，持续写入也须管。用 [PlayerInput.devices L846–860](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/PlayerInput/PlayerInput.cs#L846-L860) 配对，局部菜单只处理所属玩家，不盲恢复旧命中；硬件时序另验。

**UE 5.8。** [一手] [Force Feedback](https://dev.epicgames.com/documentation/en-us/unreal-engine/force-feedback-in-unreal-engine) 从目标 PlayerController 播放，时长至最后关键点；[Client Play](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Game/Feedback/ClientPlayForceFeedback) 有单次／循环、Ignore Time Dilation、Play While Paused，同 Tag 替换；[Client Stop](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Game/Feedback/ClientStopForceFeedback) 按 Effect／Tag 停；[PlayDynamicForceFeedback](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/APlayerController/PlayDynamicForceFeedback) 有 Start/Update/Stop，负 Duration 至主动停止，C++ 可留 handle。[研究] 有限／循环已够用就保留，不因 Unity 接口迁动态反馈。

**采用与撤回。** [研究] ✅ 沿现有动作明确期限及停止／恢复条件：过期短脉冲不补播，持续来源恢复前重判；有意冻结后续演的效果可保留。换设备／退出作废该玩家旧任务，可达旧设备发送停止，新设备只接当前有效反馈，不误清其他玩家。原生足够即停；跨菜单延续旧命中需堆特例时撤回。

**许可与缺口。** [一手] STK 文件 GPL-3.0-or-later；Barony [LICENSE.txt](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/LICENSE.txt) BSD-2-Clause，[README](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/README.md) 仍须购游戏，资产另限；Unity Companion 仅 Unity-dependent，UE 仅读文档。[研究] 未找到暂停残震修复＋复测完整链。二改预注册：短命中开菜单、持续来源暂停后取消、A→B 换设备并保第二玩家；核旧补播、误停新反馈、旧设备／他人误操作。停止命令不保证马达即时停。

<a id="23"></a>

### 本地多人补研：设备配对与 UI 目标范围分开核

核实：2026-10-16 UTC+8；主线三。仅确需本地多人时，按玩家区分设备、动作和菜单选择；分屏不证明输入独立。[研究]

**版本／许可。** [一手] [Unity 6.0 官方包页](https://docs.unity.com/en-us/engine/6000.0/manual/packages-list/packages-all/pack-safe/com-unity-inputsystem) 列 released 1.20.1，[1.20.1 tag API](https://api.github.com/repos/Unity-Technologies/InputSystem/git/ref/tags/1.20.1)→`a934411756c8862cb0f54da514a9b7cc1c000a2b`，[package.json](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/package.json) 同版／最低 6000.0；不重标前文 1.19 文档与 1.20.2 样例，也不要求升级。[LICENSE](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/LICENSE.md) 为 Unity-dependent Companion，只借机制。

<a id="24"></a>

#### Unity：玩家动作、设备与 UI 选择分别落到实例

1. **按所属玩家读。** [一手] [1.20.1 PlayerInput/UI 文档](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/use-player-input-component-ui.html) 要用 PlayerInput.actions，全局 InputSystem.actions 绕设备分配；module 与 PlayerInput 配同 asset 后由后者传玩家配置。[PlayerInput.cs L1389–1407](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/PlayerInput/PlayerInput.cs#L1389-L1407) 核复制／重定向，[L1708–1710](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/PlayerInput/PlayerInput.cs#L1708-L1710) 关联 InputUser；[L294–302](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/PlayerInput/PlayerInput.cs#L294-L302) 说明第一位可用原资源、后续复制，非每次全 Clone。[研究]
2. **current 非玩家身份。** [一手] [Gamepad.cs L613–627](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Devices/Gamepad.cs#L613-L627)：新增手柄及非 noisy 输入变化可改 current，不建议并发多手柄依赖，改用 PlayerInput/InputUser；未掉线也不能以近期设备归属角色。[研究]
3. **单 module 不给多焦点。** [一手] [导航契约](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/Documentation~/supported-ui-input-types-navigation.md) 每帧一份 move/submit/cancel；[多人 UI 文档](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/Documentation~/introduction-multiplayer-ui-input.md) 让每人独立 InputModule、MultiplayerEventSystem、actions，playerRoot 定目标树。[研究] 来源与目标都需隔离，复制 Canvas 不够。
4. **playerRoot 非全路径隔离。** [一手] [InputSystemUIInputModule.cs L506–515](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L506-L515)、[L634–639](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L634-L639) 查点击 raycast，[L905–941](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L905-L941) 查导航；[L475–489](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L475-L489) 先移再按钮／滚轮，[L598–603](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L598-L603) 先写 pointerEnter 再在 hover 查 root，[L787–796](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L787-L796) 从 pointerEnter 找 IScrollHandler 并 ExecuteHierarchy，无同样 root 检查。[L876–901](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L876-L901) 将 submit/cancel 发 currentSelectedGameObject。[研究] 滚轮须单独验，初始／返回选择错误不能兜底；仅 uGUI 静态链，未复现越界，不荐 workaround。

**历史报告。** [一手] [Unity issue 1306361](https://issuetracker.unity3d.com/issues/input-system-ui-input-module-lets-the-player-navigate-across-other-canvases) 于 2021-01-15 报摇杆跨 Canvas 导航，标 1.3.0 修复。[研究] 保留跨玩家验收，当前树已有目标检查，不称 1.20.1 仍坏或照抄旧 CanvasGroup 绕路。

<a id="25"></a>

#### Unreal：输入映射、UI 所有者、焦点和显示范围分别确认

[一手] UE 5.8 [Enhanced Input](https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine) 将 contexts 加到特定 LocalPlayer 的 subsystem。[研究] IMC 定义可共享，生效实例取所属 PlayerController/LocalPlayer；此契约不等于硬件配对。

[一手] [Set Owning Player](https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/Player/SetOwningPlayer?lang=en-US) 指 UI 所属 PlayerController，[Set User Focus](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Widget/SetUserFocus) 设用户焦点（owning user 可 SetFocus），[AddToPlayerScreen](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/UMG/UUserWidget/AddToPlayerScreen) 放所属视口。[研究] 所有者、目标与显示位置分别核，任一均非输入隔离证明。[CommonUI 技术说明](https://dev.epicgames.com/documentation/en-us/unreal-engine/commonui-input-technical-guide-for-unreal-engine) 亦要求正确 user、沿用 UMG 导航，不为多人强加 CommonUI。

**采用、撤回与二改。** [研究] 单玩家保留原路径；共享菜单先定操作者，并发独立菜单才分输入／选择实例。仍越界先查 module、导航与脚本选择。二改加第二玩家菜单，同时导航／确认，一人退出时另一人继续；重排布局复查跨区导航，滚轮另验另一玩家区域的归属。共享菜单按约定，不强求独立。

<a id="26"></a>

### 模拟输入补研：轻推幅度与处理链不能丢

核实：2026-10-16 UTC+8；主线三。轻推即满幅时先核连续幅度与处理链，再调灵敏度；依据 Unity 1.19、UE 5.8 与 STK 降敏／历史触摸修复。[研究]

1. **Unity 死区非单位化。** [一手] 1.19.0 tag→`ca8d898356596a91bda6505e506cc1a4bb3a9fa6`，[package.json](https://github.com/Unity-Technologies/InputSystem/blob/ca8d898356596a91bda6505e506cc1a4bb3a9fa6/Packages/com.unity.inputsystem/package.json) 同版；[Gamepad.cs](https://github.com/Unity-Technologies/InputSystem/blob/ca8d898356596a91bda6505e506cc1a4bb3a9fa6/Packages/com.unity.inputsystem/InputSystem/Devices/Gamepad.cs#L138-L149) 给 sticks 加 stickDeadzone，[StickDeadzoneProcessor.cs](https://github.com/Unity-Technologies/InputSystem/blob/ca8d898356596a91bda6505e506cc1a4bb3a9fa6/Packages/com.unity.inputsystem/InputSystem/Controls/Processors/StickDeadzoneProcessor.cs#L32-L57) 重映射幅度后按比缩向量，保连续值；min=0 取全局默认，非关闭。[1.19 绑定文档](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/ActionBindings.html)：完整 stick binding 再加会叠 control 死区。
2. **合成模式分开。** [一手] [Vector2Composite.cs](https://github.com/Unity-Technologies/InputSystem/blob/ca8d898356596a91bda6505e506cc1a4bb3a9fa6/Packages/com.unity.inputsystem/InputSystem/Actions/Composites/Vector2Composite.cs#L126-L154) 的 Analog 读 float、数字模式读按钮，默认 DigitalNormalized。[研究] 先绑定整个 stick，重组才选 Analog；不为防键盘斜走统一 normalized，方向／离散玩法可主动舍幅度。
3. **UE 两层 modifiers。** [一手] 5.8 [FEnhancedActionKeyMapping](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/EnhancedInput/FEnhancedActionKeyMapping) 处理 raw key，[UInputAction](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/EnhancedInput/UInputAction) 处理 final action；[Enhanced Input](https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine) 输出逐级传后续 modifier/trigger，[DeadZone](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/EnhancedInput/UInputModifierDeadZone) 将 lower–upper 映射 0–1、外部截断。[研究] Axis1D/2D 保幅度，按动作选轴形并查重复变换；未证所有模板／设备同默认值与次序。
4. **STK 的降敏与触摸修复。** [一手] `supertuxkart/stk-code@0334c6cd7432de391b7981b153df32b7bf6d83ea` 的 [gamepad_device.cpp](https://github.com/supertuxkart/stk-code/blob/0334c6cd7432de391b7981b153df32b7bf6d83ea/src/input/gamepad_device.cpp#L149-L169) 分数字／模拟，可选保符号平方降中心敏度；[2018 修复 b7856d4](https://github.com/supertuxkart/stk-code/commit/b7856d4991503fc3d13eb567b9dbed2faa8db832) 改触摸 getSteeringFactor，死区重映射与 sensitivity 缩放分开，非手柄修复。文件 GPL-3.0-or-later，只借机制，不给通用曲线。[研究]

**采用与撤回。** [研究] ✅ 保住所需幅度，逐层核原生处理器，仅补漂移／微调缺口。死区过大损微调，过小露漂移；曲线及轴向／径向按动作选，不给统一阈值。方向离散动作可舍弃幅度。

**二改预注册。** [研究] 对照原生与单项调整，记录回中、起动、低幅、满幅及轴向／斜向；加入另一手柄或跨动作复用配置后核耦合。撤销重复死区／单位化已解决就不扩框架。

<a id="27"></a>

### 4. 用第二个菜单判断共享层是否值得

[研究] 未来用原生暂停→设置→返回，再加滑条、动态隐藏项和确认层。改确认键并换设备，核焦点／导航、实际绑定提示、返回目标、过期缓存与当前按住政策；重绑定取消也走返回路径。

[研究] 记录二改复制的政策与旧页回归；少量共享开关边界仍难维护，才引框架，无减负则撤回。AI 补绑定／导航／回归，人判操作负担；日志与截图互证，状态注入不代验设备路径。

<a id="28"></a>

### 5. 暂停叠加与转场：关闭一层不等于恢复整局

核实：2026-10-14 UTC；主线三。第二种暂停来源出现后，补持有／释放与加载入口权限；依据 Thrive 三个已合入补丁及固定实现。[研究]

- **防护未复现原故障。** [一手] [#7203 补丁](https://github.com/Revolutionary-Games/Thrive/commit/0deed4285e3d25852707d7bbf639620293c9e1ba)（2026-09-02）HUD 由翻转改 buttonState，关闭灭绝框调用 EnsureGameIsUnpausedForEditor；[PR 原文](https://github.com/Revolutionary-Games/Thrive/pull/7203) 明说作者未触发故障。已合入防护非软锁复测；未读 Discord，不用自动摘要。
- **加载入口统一。** [一手] [#7290 补丁](https://github.com/Revolutionary-Games/Thrive/commit/1b82f43ac822cf8b149831b1389a0c3686bc498a)（2026-09-17）在菜单可见判断外补 GameLoading；[PR](https://github.com/Revolutionary-Games/Thrive/pull/7290) 勾选作者试玩＋另一人功能确认，仅维护方验证。
- **撤回全局暂停。** [一手] [#7232 补丁](https://github.com/Revolutionary-Games/Thrive/commit/03b9b8e2b7bbc3a6ecb3159dd38960d69be33d6b)（2026-09-10）补玩家死亡／消失时取消，删无条件恢复编辑按钮；[PR 原文](https://github.com/Revolutionary-Games/Thrive/pull/7232) 说明旧修复允许死亡后立刻点，最终撤回转场暂停。[研究] 取消收尾后按真实资格恢复，不全启控件或全冻结。

**固定实现与反证。** 以下均实际读取 `Revolutionary-Games/Thrive@1b82f43ac822cf8b149831b1389a0c3686bc498a`：[一手]

1. [PauseManager.cs](https://github.com/Revolutionary-Games/Thrive/blob/1b82f43ac822cf8b149831b1389a0c3686bc498a/src/engine/PauseManager.cs) 用 HashSet<string> 记原因，Resume 只删指定项，非空仍停；同名重复只报错不计数，多实例不能只用类型名。ForceClear 限主菜单／另局兜底并记残留，不作普通关闭。
2. [HUDWithPausing.cs](https://github.com/Revolutionary-Games/Thrive/blob/1b82f43ac822cf8b149831b1389a0c3686bc498a/src/general/base_stage/HUDWithPausing.cs) 的 helper 经 PauseButtonPressed 释放，但菜单可见／GameLoading 会早退；后日志只报仍停，不能凭函数名保证转场清锁。
3. [PauseMenu.cs](https://github.com/Revolutionary-Games/Thrive/blob/1b82f43ac822cf8b149831b1389a0c3686bc498a/src/general/PauseMenu.cs) 转场将 GameState=Invalid 表 GameLoading，暂停／鼠标捕获／输入分别维护；[CreatureStageHUDBase.cs](https://github.com/Revolutionary-Games/Thrive/blob/1b82f43ac822cf8b149831b1389a0c3686bc498a/src/general/base_stage/CreatureStageHUDBase.cs) 取消淡入、清 MovingToEditor，不直接启编辑钮。[研究] 分别核资格／归属／暂停，不保证全交错。

**采用／不用。** [研究] ✅ 沿 Session 明确暂停持有者、释放及拒绝入口；按钮按目标状态设置。单入口可靠就不加锁；并存来源要区分实际实例，退出本局才清本局持有。字符串集合不是计数锁，输入门禁不是无条件释放，全局暂停不能补失效前提。

[一手／研究] Unity [6.3 timeScale](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-timeScale.html) 仅缩放时间、后帧生效，零值停 FixedUpdate/WaitForSeconds，非持有／权限管理器。Thrive [固定许可](https://github.com/Revolutionary-Games/Thrive/blob/1b82f43ac822cf8b149831b1389a0c3686bc498a/LICENSE.txt) 为 GPL-3.0-or-later 并列例外，只借机制。

**二改预注册。** [研究] 单暂停新增选择框，交错开关、加载中按暂停、淡出中死亡再进新局；核持有、输入与按钮资格，重点覆盖释放命中菜单／Loading 门禁及同名多实例。人定转场模拟与恢复时机。


<a id="29"></a>

### 6. 背包负担：改交互还是改携带规则

核实：2026-10-15（UTC+8）。[研究] 已决定用什么却反复寻找，先加稳定快捷引用；囤积挤掉玩法才改携带成本，排列本身有价值则保留。

- **Factorio 稳入口。** [一手] Twinsen／Klonan [FFF278（2019-01-18）](https://www.factorio.com/blog/post/fff-278) 为 0.17 发布前说明：快捷栏由库存改引用，耗尽留映射，防制作随机入栏／补货换槽，补偿原容量。[研究] 借引用，不抄十页或声称普遍体验改善。
- **Cogmind 改规则。** [一手] Kyzrati [2021仓储重设](https://www.gridsagegames.com/blog/2021/04/design-overhaul-1-capping-inventory/)：叠仓囤备件、挤主动槽／超 UI，起初反对硬限、试后采用，同时增单件容量／高端选项。[2023发布后回顾](https://www.gridsagegames.com/blog/2023/03/cogmind-beta-11-player-stats/) 确认 Beta 11 去叠，极大背包少、平均容量反增。[研究] 非简单缩包或因果乐趣证据，借容量／重量／槽位协调，便利交换仍有用。
- **Backpack Hero 排列即决策。** [一手] Jasper Cole [2022访谈](https://www.escapistmagazine.com/backpack-hero-interview-jasper-cole-inventory-management-roguelike/)（经编辑澄清）称源自重位置卡牌原型，摆放／放弃后果形成策略。[研究] 自动安排可能删玩法，不按点击少判好；不采其对别作的个人批评或“前所未有”背书。

[研究] **复用与补缺：**沿现有物品命令、导航和库存所有者，快捷栏只引用。类型与具体实例分开：材料和带耐久／词条装备可有不同政策；明确耗尽、卖出、替换后的映射与重选。

[研究] **成本与撤回：**入口改动保用户排布／焦点；容量改动还涉及掉落、消耗、负重、构筑和旧档超额。入口已解决就不改规则；只增加搬运／丢物或毁构筑则撤回，排列即玩法不自动排序。

[研究] **二改预注册：**新增非同质变体或改堆叠上限，核补货、卖出绑定实例、满包交换、重复命令及旧档。人判是在重复寻找还是有价值取舍，不单看点击数。只借机制，不复制商业代码／美术。

<a id="30"></a>

## 存档复用补比：序列化、落盘与玩家恢复分开选

核实：2026-10-14 UTC。[一手] 固定源码、官方接口与商店条款；[研究] 比较现成保存能力与游戏自有恢复责任，未做故障注入。

<a id="31"></a>

### 1. Mindustry：实际游戏把格式、内容映射与文件恢复分开

[一手] `Anuken/Mindustry@17012d61d9e4c3cbd9820d87e81c24495486ac53`，commit API 2026-10-08；[README](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/README.md) 有发行入口，[GPL-3.0 LICENSE](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/LICENSE) 允许商用但带分发义务，非 MIT。仅研究快照，不跟开发分支／复制代码美术，资产权利未逐项核。

- [一手] [SaveIO.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/io/SaveIO.java) 注册 Save1–13、最新版写、按版读，未知版独立报错；先主档移备份再写，catch 移回，load 遇 SaveException 尝试备份。格式与恢复分路。
- [一手] isSaveFileValid 仅 getMeta；[SaveVersion.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/io/SaveVersion.java#L48-L76) metadata 不读全部 map/entities，readContentHeader（627–654）按保存名映射、block 有 fallback，但未定所有缺内容政策。
- [一手] [Saves.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/game/Saves.java#L120-L199) 按 sectorPreset／旧位置先临时移档，再集中回填目的地／sector info，支持位置交换；迁移含地址、关卡身份及附属进度。
- [研究] 借职责与交换顺序，不移植 Java／Arc 对象图。按类型映射改名；真实出现存储位置互换时才加暂存／回填。
- [一手／研究] 主档先移、终止后 catch 不执行，不是断电事务；[列表发现](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/game/Saves.java#L65-L78) 排除含 backup 的名称。仅备份时菜单能否恢复须另验，内部 fallback 不保证可达。

<a id="32"></a>

### 2. Thrive：类名存在，不等于迁移器仍适用于新格式

[一手] `Revolutionary-Games/Thrive@eceb8011d5e86b19dfa75de9e55eee6815fd1450`，commit API 2026-10-14；[README](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/README.md) 有 Steam/itch，[LICENSE.txt](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/LICENSE.txt) 为 GPL-3.0-or-later＋独立 mod 动态加载例外，非整模块闭源复制许可。活动不证明旧接口改造完成。

- [一手] [Save.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/Save.cs) 世界存 save.bin、metadata JSON；ReadFromArchive 按对象版读，v2 加 JukeboxPlaybackState、旧版 null。当前格式有兼容读取，不是全坏。
- [一手] 旧 LoadJSONStructureFromFile 抛 NotSupportedException，WriteSaveJSONToFile 抛 NotImplementedException；[ISaveUpgradeStep.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/ISaveUpgradeStep.cs) 仍注册 0.8.3.0-rc1→0.8.3.0 step，PerformUpgrade 调旧入口，注释待 archive 改造。
- [一手] [SaveUpgrader.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/SaveUpgrader.cs) 有到目标版 step 才可升级；[SaveListItem.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/SaveListItem.cs) 分损坏、不兼容、可升级、较新版再发 UI 事件。旧 helper 不证明普通加载／UI 必然到达。
- [研究] ✅ 借失败分类，⛔ 不用遗留 JSON upgrader。区分损坏、版本过新和内容不兼容；追实际入口／可达条件，不凭类名采用，也不为简单 checkpoint 搬来 Godot 对象图。

<a id="33"></a>

### 3. 原生、开源序列化库与商业候选怎么取舍

[研究] 下表为机制选择；现有项目够用就不迁移。

| 候选 | 可直接借用与最低成本 | 不替项目解决什么／本轮判断 |
|---|---|---|
| Unity JsonUtility | 引擎内小 DTO 无新增库维护；只序列化字段，不支持 Dictionary，可用普通 JSON 库补缺口 [一手：[6.3 文档](https://docs.unity3d.com/6000.3/Documentation/Manual/json-serialization.html)] | ✅ 简单 checkpoint／库存保留；JSON 转换不承担存储提交／恢复，存储失败不靠换格式解决 |
| Unity Newtonsoft 包 | ✅ 项目需要字典或 JSON 树操作时复用现成包；[官方页](https://docs.unity3d.com/Packages/com.unity.nuget.newtonsoft-json@3.2/manual/index.html)列出 LINQ to JSON 并链接源码。[上游许可证](https://github.com/JamesNK/Newtonsoft.Json/blob/13.0.2/LICENSE.md)为 MIT；实际包保留其自带 notices，无另购序列化库费用 [一手] | 不自写 parser 或放入重复 DLL；按锁定包验证 AOT／IL2CPP。Unity 包 3.2.2 网页仍称对应上游 13.0.2，两种版号分开，不称上游最新；内容政策／断电恢复仍归项目 |
| UE SaveGame | ✅ 保留 SaveGameToSlot／AsyncSaveGameToSlot 与完成结果；SaveGameToMemory 和 SaveDataToSlot 已把内存序列化与平台写入分开，后两者均同步 [一手：[官方页](https://dev.epicgames.com/documentation/en-us/unreal-engine/saving-and-loading-your-game-in-unreal-engine)] | 不因多槽自建文件系统，主机等平台路径另核；公开指南未承诺任意多文件原子提交，项目须定恢复政策。适用引擎 EULA，非开源许可 |
| Mindustry／Thrive 的整套保存模块 | 实际游戏中的版本／恢复／菜单机制可读，研究成本低 [一手：上述固定源码] | ✅ 借设计与反例；⛔ 不作 Unity／UE 通用保存底座。GPL 分发义务、引擎和世界对象图耦合；本轮未独立验证任何一个游戏的玩家恢复成功率 |
| Easy Save 3 | 🧪 现有 Unity 项目或确有多类型序列化／工具支持缺口时评估；现成缓存、类型适配及备份调用，免去等价自研 [一手：下列官方 API] | 分别验缓存写入、备份轮换与内容兼容；几个 DTO 不默认购买，付费不证明恢复更强。未取得包，也未审内部落盘实现 |

[一手] Easy Save [CreateBackup](https://docs.moodkie.com/easy-save-3/es3-api/es3-methods/es3-createbackup/) 覆盖 .bak，[RestoreBackup](https://docs.moodkie.com/easy-save-3/es3-api/es3-methods/es3-restorebackup/) 返回找到／恢复而非进度有效；[缓存／性能说明](https://docs.moodkie.com/easy-save-3/es3-guides/performance/) 合多键为一次写、线程访问须互斥且数据线程安全，删重建 reference manager 会使旧 ID 失效；[引用文档](https://docs.moodkie.com/easy-save-3/es3-guides/saving-and-loading-references/) 明确 manager 为 scene-specific，非长期内容身份。

[研究] **已用 Easy Save 就复用缓存与备份 API，只补业务快照／恢复薄层。** 合并写入不保证一致快照，恢复文件不代表接受进度，场景引用 ID 不替代内容 ID；迁移前副本与普通轮换分开，避免覆盖唯一旧版兼容档。

| 动态事实 | 核实来源／日期 | 选型影响与重核触发 |
|---|---|---|
| Easy Save 商店显示 USD 59（税前）、Extension Asset、3.5.27／2026-07-18 | [官方商店](https://assetstore.unity.com/packages/tools/utilities/easy-save-the-complete-save-game-data-serializer-system-768)，2026-10-14 | 单人预算参考，不是含税成交价；购买／包升级或 2026-11-14 先到者重核 |
| Standard Asset Store EULA，Extension 按 seat；不是开源授权 | [条款 §2.3](https://unity.com/legal/as-terms)，2026-10-14 | 源码若随包提供也不能当作可公开再分发；实际席位和合同在取得时核对 |
| Asset Store 条款 §3.8 包含 AI 输入限制 | [同一官方条款](https://unity.com/legal/as-terms)，2026-10-14 | ⛔ 未清授权前，不把付费包源码整包输入 Agent；本轮只读公开技术文档，不声称已获得包输入许可。购买、供应商书面许可或条款变化时重核 |

<a id="34"></a>

### 4. 最小实现边界与后续验收

[研究] 保留窄 DTO／内容迁移、现成序列化／存储、游戏恢复提示三项责任；可仅用少量函数，不另建 SaveManager 框架。

1. **先验候选。** 分别按版本／完整内容读取主档、已验副本、迁移前副本；独立构造候选，失败不残留半个世界。显示恢复时间／章节，保留故障档；全失败由玩家选新槽。
2. **防止覆盖有效旧档。** 读取失败、回退后 autosave、升级重试都需保护。恢复完成前停该槽自动覆盖，接受新快照后按政策清理；磁盘满不先删唯一副本。
3. **沿平台提交能力。** 现成路径不满足才补暂存／替换／发现；try/catch、`.bak` 或 rename 名称不保证跨平台断电安全。
4. **二改实际地址。** V1 两关卡→V2 改名换位置→V3 删除／换道具；核仅存备份、metadata 完整但实体截断、迁移中断、恢复后 autosave 和位置互换，断言进度／奖励及副本可达。

[研究] 以上仅预注册。既有组件可靠且更省维护就停止自研；复杂对象图只增引用／迁移负担时退回稳定 ID 的窄 DTO。


<a id="35"></a>

### 5. 续玩不等于撤销失败

核实：2026-10-15 UTC+8。[研究] 单局需要跨多次游玩时，在既有一致状态边界提供续玩；撤销旧决定另定，不默认任意世界快照。

- **Enter the Gungeon。** [一手] Dave Crooks [2017-02-03 更新说明](https://blog.playstation.com/2017/02/03/enter-the-gungeon-supply-drop-update-out-today-on-ps4/) 称 Save and Quit 或是发布后最常请求，新增层末保存续玩；出口角色／冷冻室也可换菜单。[研究] 借转换边界，非需求排名调查或通用层间间隔。
- **Don’t Starve。** [一手] Klei [Why Can't I Save?（2019-06-25）](https://support.klei.com/hc/en-us/articles/360029882191-Why-Can-t-I-Save) 说明黎明、黄昏、关闭自动保存，刻意不提供手动安全网。[研究] 保后果仍可离开，但非崩溃／断电恢复或任意快照保证。
- **Cogmind。** [一手] Kyzrati [Quicksaving and Restore Points（2019-09-27）](https://www.gridsagegames.com/blog/2019/09/quicksaving-restore-points/)：原有续玩之外给 Adventurer/Explorer 加旧恢复点，Rogue 永久死亡；与最新续玩档分开、仅当前局，另补死亡 UI。2022-03-23 评论称部分玩家受益，非受控结果。[研究] 借职责，不抄文件／模式，榜单排除原文不确定。

[研究] **复用与补缺：**沿 DTO、存储、迁移和 Session／Encounter 一次性结算，只补保存边界、提示与恢复入口。明确奖励提交前后、当前局／永久进度恢复范围；交接前保唯一有效档，死亡／新局后的恢复资格按玩法失效。回退玩法和故障备份各自维护。

[一手] Unity 6.3 [OnApplicationQuit](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnApplicationQuit.html)：iOS 挂起不调用。[研究] 沿已有检查点／反馈，不仅退出时才启动保存；UE 有 SaveGame 也不保证结束前写完，未新增 UE 退出 API。

[研究] **成本与二改：**间隔过长仍迫使等待，任意帧快照增加弹体／计时器／动作恢复负担；先缩段或明确回段首，短计分挑战可不加。延长遭遇后核奖励前后退出、失败、重入、重复读档及新局的状态／奖励／等待；永久死亡模式另核不能借备份复活，允许恢复的模式不套此限。

<a id="36"></a>

### 6. 保存响应：把捕获、序列化与写入分开判断

核实：2026-10-16 UTC+8；主线 3／4。保存卡顿先分捕获、序列化和写入成本，正常退出交接保存结果；依据双引擎线程契约、开发者方案与回归记录。[研究]

**原生线程边界。** [一手] Unity [6.3 JSON serialization 的 Performance 节](https://docs.unity3d.com/6000.3/Documentation/Manual/json-serialization.html) 可后台 JsonUtility，但另一线程不得访问／改正在处理对象；UE [5.8 AsyncSaveGameToSlot](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UGameplayStatics/AsyncSaveGameToSlot) 在 game thread 序列化、worker 写、game thread 回调，delegate payload 须线程安全。[保存指南](https://dev.epicgames.com/documentation/en-us/unreal-engine/saving-and-loading-your-game-in-unreal-engine) 小档／菜单可同步，大档／游玩优先异步；非全离主线程或断电持久保证。

[研究] **✅ 窄 DTO＋现成存储，只移走可独立工作。** 在完整状态边界捕获，后台 DTO 及可变引用不得继续被玩法访问／改写；浅拷贝不足。捕获若是热点，先减数据／调整边界；跨帧采集未必一致。同步路径达预算就不加线程／队列。

**合并与退出。** [一手：作者自述] Evil Trout [2026-08-21 保存经验](https://eviltrout.com/blog/2026-08-21-tips-for-saving-game-data-in-godot/) 以两部 Roottrees／Galley House 游戏说明重要变化请求、线程短窗合并、正常退出强制最终保存并需同步。[研究] 重复写才合并，窗口按可失进度；退出等覆盖目标状态的结果，较新快照可满足、旧请求不可代报。不得阻塞回调 game thread，失败提供恢复而非无限等待。原文未公开合并／交接／退出实现，不证一致性／跨平台覆盖；备份顺序、等长校验及故障下降比例均未采作有效性／收益证据。

**fork 非默认。** [一手] [FFF #408（2024-04-26）](https://factorio.com/blog/post/fff-408)：Factorio 子进程保存，当时限 macOS/Linux、大 RAM，仍有冻结；[社区／一手] [2.0.33 回归帖](https://forums.factorio.com/viewtopic.php?t=126407) 报 2.0.33 全程冻结、回退 2.0.32 正常，维护者 2025-01-28 称修于 2.0.34。[研究] 只支持平台／内存／回归成本，不荐 Unity/UE fork 或称当前故障。

**退出与二改。** [一手] [6.3 wantsToQuit](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-wantsToQuit.html) 可取消正常退出，但 Editor Stop 忽略，iOS/iPadOS 不能阻终止；OnApplicationQuit 的移动／Web限制仍在。[研究] 正常退出与挂起／强杀分开。扩档／增请求后分别记捕获、序列化、写入、回调、长帧／内存；验重复请求、新进度退出、失败及重开，不提前报成功。挂起／断电耐久另验。

<a id="37"></a>

## 本地化补研：新语言与旧名字一起维护

核实：2026-10-14 UTC。主线 3／4；补 04 稳定 key、fallback 与长文之外的内容更新风险：字体覆盖、旧名字及样例文案再次失效。[研究]

<a id="38"></a>

### 1. 发行游戏的修复指向旧内容与资源寿命

[一手] [Celeste 官方更新记录](https://www.celestegame.com/changelog.html)：1.3.0 加韩语、调日语与命名，仅加载当前语言字体，不支持的名字用 Madeline 代空白；1.3.1 又修意大利 Journal 换行。仅已发行修改报告，无内存测量。

[研究] **✅ 新语言连带旧名字、语言页与旧界面检查。** 项目自选跨语言字体、命名限制或替代显示；Celeste 政策不外推身份／聊天，混排仍可能需其他字体。二改新增旧字库外名字、切语言读档，核可理解与驻留预算。

<a id="39"></a>

### 2. 官方输入样例可借机制，未交付完整本地化

[一手] 同 InputSystem `05e45ddbaf18a93245b068d787d74b738b90d01c`，通过文件接口读 [RebindActionUI.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/RebindingUI/RebindActionUI.cs)／[GamepadIconsExample.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/RebindingUI/GamepadIconsExample.cs)；版本与 Companion 许可沿前文。

- `UpdateBindingDisplay` 按 binding ID 查找并调用 `GetBindingDisplayString`，再向显示事件传递文字、device layout 和 control path；`OnActionChange` 响应 `BoundControlsChanged`，包括键盘布局导致的重解析
- 文件仍有 localization TODO；`UpdateActionLabel` 直接显示 `action.name`，重绑定等待、复合绑定部件提示和取消倒计时使用硬编码英文及字符串插值
- 图标样例按 DualShock／Gamepad layout 和 control path 选图，找不到图时回文字；但空 layout/path 分支直接返回，不能从样例推断旧图标一定被清除。它是有限设备演示，不是全部控制器的显示政策

[研究] **✅ 借绑定刷新，把展示名、等待、取消／倒计时接 String Table／Smart String。** 保留内部 action 身份，按语言处理复数，教程引用真实绑定；随现有改键／设备／重开回归，不照搬样例为发布菜单。

<a id="40"></a>

### 3. 字体优化随内容更新，不把 ATG 当无成本开关

[一手] Unity 6.3 [ATG 启用说明](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/enable-and-use-atg.html) 属 UI Toolkit，默认关，需项目及元素配置，不支持静态 font asset，非 uGUI/TMP 能力。[静态字体迁移说明](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/migrate-static-font-assets.html)：减内容用子集创建动态资产，减首次生成用 atlas 预填；SDFAA 下许多项目不需预填，不统一预热。

[研究] **🧪 UI Toolkit 确需复杂排版才评估 ATG，稳定 uGUI 不迁移。** 子集／预填充随新增译文更新，含数字、符号及允许用户文字；源字体已删字形不能动态恢复。比较冷显与切语言驻留，无收益退回完整合适字体。

[一手] [font subsetting 文档](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-font-subsetting.html) 推荐 FontTools 并保 OpenType 特性；[FontTools subset 正文](https://fonttools.readthedocs.io/en/stable/subset/) 默认 ignore-missing-unicodes，text/text-file 间接缺字亦可不报，no-ignore 才失败。[研究] 按字体职责严格核必须字集／承接字体，不以退出成功证覆盖，也不将分工缺字误判全失败。字体修改／嵌入／分发另核，未裁剪或推荐文件。

[一手] UE [Asset Localization](https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-localization-in-unreal-engine) 推荐 runtime 换 culture／不受限用户文字用 composite font；整资产按 culture 替换限受限场景，已加载切换可需重启。非全部常驻要求。[研究]

<a id="41"></a>

### 4. 保留与否及证据边界

[研究] 保留旧内容／字库更新与消息重译责任；AI 查硬编码、占位符和回归，人定名字政策及可读性，目标设备排版／首次显示／内存待验。

[研究] 未采纳：Factorio 简繁误选仅有搜索线索；Unity 6.0 翻译页的 ATG 限制不套用 6.3，也不从删限制推定组合可靠。

<a id="42"></a>

### 5. 旧报告重译：保留消息含义，而非只存渲染结果

核实：2026-10-14 UTC；主线三／四。[研究] ✅ 承诺重译的系统消息保留稳定身份、参数类型及历史值；实时值另取。原样保留的玩家文字／引用不套此政策。

**固定路径。** [一手] Thrive `eceb8011d5e86b19dfa75de9e55eee6815fd1450`；[维护文档](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/doc/working_with_translations.md) 描述延迟翻译／读档重译 auto-evo，以下据实际源码核路径。

- [LocalizedString.cs L57–77、160–183](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/engine/LocalizedString.cs#L57-L77) 保存 key＋对象参数；ToString 才取译文／culture 格式化，FormatException 回模板，仍可能缺参不可读。
- [EditorBase.cs L793–827](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/general/base_stage/EditorBase.cs#L793-L827) 用 LocalizedStringBuilder 存 autoEvoExternal；[报告组件 L356–365](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/microbe_stage/editor/MicrobeEditorReportComponent.cs#L356-L365) 翻译变化重发报告，[MicrobeEditor L568–575](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/microbe_stage/editor/MicrobeEditor.cs#L568-L575) 把 builder 转当前文字并提供按需正文委托，非所有弹窗刷新证明。
- **反证：** [LocalizedStringBuilder.cs L63–108、128–158](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/engine/LocalizedStringBuilder.cs#L63-L108) Append 先缓冲，FormatString getter 才归并，WriteToArchive 直接写字段，故立即保存须核顺序；但 [MicrobeEditor.OnEditorReady L397–403](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/microbe_stage/editor/MicrobeEditor.cs#L397-L403) 已调用报告显示，[EditorBase L293–299](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/general/base_stage/EditorBase.cs#L293-L299) 自动保存晚于编辑器进入，不能判正常存档已丢。旧字符串也恢复不了消息身份。[研究：静态]

**引擎合同。** [研究] 用原生机制，不复制 Thrive GPL 组件；许可沿用前述核查。

- [Unity Localization 1.5.13 Arguments](https://docs.unity3d.com/Packages/com.unity.localization@1.5/api/UnityEngine.Localization.LocalizedString.Arguments.html) 不序列化 Arguments，可用局部持久变量或从已存数据重建；[Persistent Variables](https://docs.unity3d.com/Packages/com.unity.localization@1.5/manual/Smart/Persistent-Variables-Source.html) 通过 IVariableValueChanged 通知，普通参数值改用 [RefreshString](https://docs.unity3d.com/Packages/com.unity.localization@1.5/api/UnityEngine.Localization.LocalizedString.RefreshString.html)（加载中 false）。名称不证明已接存档，调用不证明显示完成。[一手／研究]
- [UE 5.8 Text Localization](https://dev.epicgames.com/documentation/en-us/unreal-engine/text-localization-in-unreal-engine) 的 FTextHistory 可重建 culture，转 FString 通常丢 history；底层需字符串时上层保来源／刷新。数字保类型做复数，名词性别／词形另处理；FText 不自动追任意变量，参数改后须更新。[一手／研究]

**二改预注册。** [研究] 改参数结构并加语言，区分历史量与实时进度，覆盖目标语言复数类别；对照立即保存／先显示后保存，再读档切语言。缺 key／参／旧格式提供后备；仅有旧译文则保原文或迁移，不逆猜 key。实际字号验换行、字形与操作。

[研究] 未做存档往返或语言审校；不据此要求永久保存所有系统消息。

<a id="43"></a>

### 6. 新增语言的显示、编辑和布局不能互相代验

核实：2026-10-15 UTC+8；主线三／四。原生塑形优先，TMP 仅补具体缺口；依据 Unity 6.3／UE 5.8、RTLTMPro 固定源码／二改反馈、Mindustry 报告及 poRTL。动态混排需验显示、编辑与布局。[研究]

**RTL 属性非完整塑形。** [一手] Unity 6.3 [language-direction](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/language-direction.html) 仅基础反转，[ATG](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-advanced-text-generator.html) 用 HarfBuzz/ICU/FreeType 做完整断行／塑形；仍限 UI Toolkit。[光标契约](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/cursor-movement.html) 是 logical movement，英阿按段走、跨段可能视觉跳转，非必然错误，删改逻辑字符另验。

[一手] UE 5.8 [UMG Rich Text Block](https://dev.epicgames.com/documentation/en-us/unreal-engine/umg-rich-text-blocks-in-unreal-engine) 分 shaping/flow/方向偏好/navigation，[ETextShapingMethod](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/SlateCore/ETextShapingMethod?lang=en-US) 的 FullShaping 用复杂 RTL／双向。[研究] 原生优先，composite font 沿前节；自定义控件／显式导航未保证，地图／玩法箭头不因语言全镜像。

**已有 TMP 的窄候选与反证。** [一手] 本次静读 `pnarimani/RTLTMPro@f480419bbbffed1be3c129d68cc0182afcfbcac3`（提交日期 2026-04-29）：

- [README](https://github.com/pnarimani/RTLTMPro/blob/f480419bbbffed1be3c129d68cc0182afcfbcac3/README.md) 声明阿拉伯／波斯／希伯来、输入／富文本支持及字体要求；ForceFix 可处理英文开头，却影响多行英文。
- [RTLTextMeshPro.cs](https://github.com/pnarimani/RTLTMPro/blob/f480419bbbffed1be3c129d68cc0182afcfbcac3/Assets/RTLTMPro/Scripts/Runtime/RTLTextMeshPro.cs#L106-L131) 留 originalText，按 ForceFix/IsRTLInput 选原文或 FixRTL→Reverse→TMP；属适配而非全语言排版，未跑输入框／测试。
- [#70 原帖](https://github.com/pnarimani/RTLTMPro/issues/70)：2021-06-01 fork 自报可用，06-23 缩区域后混排换行坏，维护者解释缺 TMP 自动断行位置。历史二改反例不证明当前仍坏，当前多行声明与旧限制均保留。[一手／研究]

[研究] 🧪 已有 TMP 具体缺口才试 RTLTMPro，核组件绑定、富文本／数字与布局；UI Toolkit 先试 ATG，不按语言数迁菜单。[MIT 许可](https://github.com/pnarimani/RTLTMPro/blob/f480419bbbffed1be3c129d68cc0182afcfbcac3/LICENSE) 为 MIT，字体／演示／TMP 另核；README 所链其他维护者 UPM 分支未证与固定树等价，接入须锁包。

**不同作者的游戏反例只支持具体机制。**

- [社区] Mindustry [#2248](https://github.com/Anuken/Mindustry/issues/2248)：Linux build 104 波斯 back 无文字；[#1943](https://github.com/Anuken/Mindustry/issues/1943)：Steam/release 104.10 韩文组合末字不可见。[研究] 分显示与输入失败，不采根因猜测或称当前仍坏，译文正常不代验输入。
- [一手] `sigmagamma/portl@8a9cc38eee4eec3bc763bf101cc5c444d5060db1`（2026-09-04）[README](https://github.com/sigmagamma/portl/blob/8a9cc38eee4eec3bc763bf101cc5c444d5060db1/README.md) 为 Source 粉丝翻译，Portal 1 右对齐限 Windows 字体映射／1366×768；[text_tools.py](https://github.com/sigmagamma/portl/blob/8a9cc38eee4eec3bc763bf101cc5c444d5060db1/src/text_tools.py) 用 arabic_reshaper/bidi 按字符数断行，[MIT](https://github.com/sigmagamma/portl/blob/8a9cc38eee4eec3bc763bf101cc5c444d5060db1/LICENSE) 仅软件 MIT、非游戏资产。未装／验字幕，不荐新游戏动态输入或系统字体改动。[研究]

**二改预注册。** [研究] 原生设置／命名页混入目标语言、拉丁名、数字和富文本，缩窗／放大文字；查塑形、换行、标点、省略、选删及输入组合。再把短标签改长说明，以已承诺输入方式进入／确认／返回，核焦点与点击，不靠缩到不可读来防溢出。文字方向不代验控件布局或显式导航。

[研究] AI 备配置／文本回归，人或目标语言读者判可读、可编辑。原生够用就停；适配仍需逐字符串／宽度补丁或关键页不可用时暂缓语言，保留原逻辑文字与组件以便退回，不把塑形／倒序结果写回内容。

<a id="44"></a>

### 7. 完整长文可达性与字体默认值的撤回

核实：2026-10-15 UTC；主线三／四。补实际字号与已承诺输入下读完整决策信息；可靠布局优先，字体默认可撤回。依据发布说明、作者机制及固定资源。[研究]

**不同作者的机制与反例。**

- [一手] Stardew [1.6.6 官方说明](https://www.stardewvalley.net/stardew-valley-1-6-6-full-patch-notes/)：中文回 1.6.3 文本、原默认字体，1.6.4 smooth 留选项，加中文字号滑条并保俄文旧字体。可撤默认不撤语言，非翻译回退归因或人人偏好。[社区] [官方论坛原帖 #24／#25](https://forums.stardewvalley.net/threads/simplified-chinese-typo-display-text-errors.20921/page-2) 分外观与段落拥挤，仅个体反馈。
- [一手] [1.6 官方更新记录](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/) 将遮住的动物价格加入 tooltip，perfection tracker 按屏分页，修建档 tooltip 出屏及 resize 背包／制作错位。[研究] 字形有、面板够不保证信息可用于决定。
- [一手] Factorio [FFF370](https://www.factorio.com/blog/post/fff-370) 保数百 GUI 布局，由控件／父级几何推手柄导航，快速栏另加 Quick panel，自定义仍需补。[2.0.44 官方说明](https://forums.factorio.com/viewtopic.php?t=128050) 仅为右侧过高 tooltip 加 Shift＋滚轮；[Controls 表](https://wiki.factorio.com/Controls) 的控制器 scroll-tooltip 默认 Not set，上下滚轮描述疑重复，不能判当前绝对无法手柄滚动。[研究]
- [一手] Thrive 同 `eceb8011d5e86b19dfa75de9e55eee6815fd1450`：[style guide L668–679](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/doc/style_guide.md#L668-L679) 要复用 LabelSettings 与正确覆盖字体；[Body-Bold-Normal.tres](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/gui_common/fonts/Body-Bold-Normal.tres) Lato-Bold／20，经 [导入资源](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/assets/fonts/Lato-Bold.ttf.import) 指 NotoSans-Bold 且允系统 fallback；[变体资源](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/assets/fonts/variants/NotoSans-Bold.tres) 基于 Variable，含 Emoji、简繁、希伯来／泰文，中文实际 Regular。直接 ttf 未必缺 fallback，Bold 名不保证同粗。[研究]

**采用与撤回。** [研究] ✅ 新页复用完整字体／样式链；可靠布局保留，短标签伸缩，长说明用现有分页／滚动／详情，关键条件／代价不能只靠 hover／省略号。新字体整段更难读可撤回默认或保留已验证选项，不强制新增选择器；仍不可用才暂缓语言。

**二改预注册。** [研究] 商店／技能页短说明改混合名字与数值长文；用实际 fallback、字号及最小窗口，以每种已承诺输入读到最后代价、确认并返回。焦点、键鼠滚动或直接回调单项通过均不足。混排／编辑沿上一节；由目标语言读者判断整段阅读，真实路径失败才改行距／布局、回退默认或补详情，不先重写导航／字体系统。

[研究] Godot LabelSettings 不硬译为 Unity／UE API；字体授权仍另核，不推荐分发。Factorio 控制器 mod guide 正文未取得，未采搜索摘要。字体解析／渲染、手柄与 UI 自动化均未运行。

<a id="79"></a>

## 拾取坐标补研：显示变换不能靠 DPI 猜回去

核实：2026-10-16（UTC+8）；主线三。拖拽／拾取／小地图先核生产与消费坐标，再补映射；依据 Unity 6.3／UE 5.8 及针对性公开纠正。[研究]

<a id="80"></a>

### 原生路径先行，只有跨空间时才转换

| 场景 | 本轮核到的契约与采用边界 |
|---|---|
| Unity 6.3 UI Toolkit 事件 | [`position`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/UIElements.IPointerEvent-position.html) 属于 panel；[`localPosition`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/UIElements.IPointerEvent-localPosition.html) 属于 currentTarget，传播到不同接收元素时会变化。[一手] 在需要的空间已有位置就直接使用，不再当原始屏幕像素缩放。[研究] |
| 外部屏幕位置到 UI Toolkit | [官方 FAQ](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-faq-event-and-input-system.html) 给出 `RuntimePanelUtils.ScreenToPanel` 与 `panel.Pick`，并区分 uGUI 屏幕左下原点和 UI Toolkit 左上原点。[一手] 先辨原点再转换，不对已转换事件再翻 Y 或除 DPI。[研究] |
| uGUI 自定义局部交互 | [`RectTransformUtility.ScreenPointToLocalPointInRectangle`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RectTransformUtility.ScreenPointToLocalPointInRectangle.html) 转到指定 RectTransform 局部平面；Overlay 的相机为 null，点击可取 `PointerEventData.pressEventCamera`。返回 true 只证明击中平面，不证明在矩形内。[一手] 额外检查实际交互区域；不能把此 API 与 ScreenToPanel 互换。[研究] |
| 相机世界拾取 | [`ScreenPointToRay`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Camera.ScreenPointToRay.html) 接受左下原点屏幕像素；[相机射线说明](https://docs.unity.com/en-us/engine/6000.3/manual/cameras/camera-view/camera-rays/introduction) 区分 `ViewportPointToRay` 的相机视图 0–1 坐标。[一手] 直接渲染到屏幕视口时用该相机的 `ScreenPointToRay`；已有归一化视图坐标才用 `ViewportPointToRay`。小地图等另行显示相机纹理时，先按图像区域、裁剪及 UV 映回相机视图；不提供留黑、裁剪和纹理复用的通用公式。[研究] |
| UE 对照，本轮页面标为 5.8 | [`Local to Viewport`](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/UserInterface/Geometry/LocaltoViewport) 的 Pixel Position 是视口分辨率单位，可用于 line trace；Viewport Position 用于视口内其他 widget。[`Get Mouse Position on Viewport`](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Viewport/GetMousePositiononViewport) 返回 viewport widget 局部空间。[一手] 不按名字把所有 viewport 坐标当像素；5.6 参数页本轮未成功读取，不宣称已核该版本。[研究] |

<a id="81"></a>

### 实际纠正与当前版本反例

[社区] [2022 年公开报告与回复](https://discussions.unity.com/t/panel-raycaster-ignores-ui-settings-dynamic-resolution-scalar/874565/2)：用户在 2022.1.0b11 将 UI Toolkit 渲染纹理放入缩放 Canvas，描述显示与输入不一致，尝试重建纹理和修改 raycaster。SimonDufour 建议通过 `SetScreenToPanelSpaceFunction` 映射外部显示变换，指出 UI Toolkit 无法自动知道这些操作。**改法未获复测确认**，不作当前缺陷或效果证据。

[一手] Unity 6.3 [同名 API](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/UIElements.PanelSettings.SetScreenToPanelSpaceFunction.html) 仍明确支持 targetTexture 用于网格时的映射：有效命中转为纹理像素，无有效目标返回面板外坐标；有超出面板表面的 3D 元素变换时指向另一个 3D 入口。相对地，6.3 已有[原生 World Space UI](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/world-space-ui.html) 和 [Panel Input Configuration](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/world-space-panel-input-configuration.html)。[研究] 普通按钮／原生世界 UI 保留事件路径，自行重显示纹理才补映射；旧帖不支持全部手写 raycast。

<a id="82"></a>

### 最小采用与二改预注册

[研究] 在现有处理函数注明两端空间、原点／单位、面板／相机。二改缩放／窗口并加移位小地图／视口，核中心、边缘和区外拾取。原生够用就停；普通控件也错查版本，对齐仍漏查遮挡／路由。

**实际范围：** 静读原帖／仓库／官方契约，不证明通用缩放公式或修复成功率。


<a id="83"></a>

## 动态 UI 补研：重建边界不等于停止绘制

核实：2026-10-16 UTC+8；主线三。动态 HUD／菜单已测重建热点后，先查反复失效原因再选原生边界，不按静／动态标签普遍拆 Canvas／套 Retainer。[研究]

<a id="84"></a>

### 先去掉错误变化，再决定是否缓存

[一手／社区] [TokyoWarfareProject 的项目报告与 Unity 工程师诊断](https://discussions.unity.com/t/case-1082192-massive-performance-hit-due-to-ui/715019)（2018-09-16—21）：2018.3 beta Player profile 中，同 Canvas 两个 Scaler 写 1／0.47，工程师发现持续尺寸通知／重建，建议删重复并说明已加禁止标记。作者确认误加，无完整修后 benchmark；仅支持查 dirty 来源，不引 FPS 收益或称当前仍可如此配置。[研究]

<a id="85"></a>

### Unity：按现有 UI 路线选择，不互抄边界

- [一手] [uGUI 官方优化指南](https://unity.com/how-to/unity-ui-optimization-tips)：Canvas 变化需重析批次，子 Canvas 自管几何／batching，可按更新时机拆；非每值改都重建全树 mesh/layout。独立边界不能合批、可能增 draw，静态仍绘。指南无固定版，非 6.3 实测。[研究]
- [一手] [Unity 6.3 LTS 移动元素契约](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-use-usage-hints-to-reduce-draw-calls-and-geometry-regeneration.html)（页面构建 2026-10-14）：top／left／width／height／flex 可引起布局重算及传播；style.translate 在 transform 阶段移动，不重算布局；频繁变换可用 DynamicTransform 避免 CPU mesh 更新。**仅视觉移动才走这条路；真实内容重排不能冻结布局来省成本。** 不由此迁移稳定 uGUI 或拆出多个 UIDocument。[研究]
- [一手] [6.3 平台与网格限制](https://docs.unity.com/en-us/engine/6000.3/manual/uitoolkits/uielements/uie-support-for-runtime-ui/uie-performance-consideration-runtime/uie-platform-and-mesh)：尺寸变化会重新生成几何，部分 Android 设备与 Web 不能局部更新 index buffer。仍需设备测量，不保证跨平台收益相同。[研究]

<a id="86"></a>

### UE：缓存计算与降频绘制分别决策

[一手] UE 5.8 [UE 5.8 Invalidation 契约](https://dev.epicgames.com/documentation/en-us/unreal-engine/invalidation-in-slate-and-umg-for-unreal-engine) 分 Invalidation 布局／paint 缓存和 Retainer 纹理；Global 启用停窗口局部 Box，Volatile 不缓存 paint，只给高频部件。Retainer 重绘／内存更贵，先 invalidation 再处理残余 draw 压力。[研究] 不叠无效缓存或混 CPU/GPU 收益。

[一手] [URetainerBox API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/UMG/URetainerBox) 分 RenderOnInvalidation/Phase、PhaseCount、RequestRender；[UE 5.5 官方 API 示例](https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/RetainerBox?application_version=5.5) 的 PhaseCount=2 隔帧。[研究] 降频改变反馈时点，非固定毫秒延迟；每帧强刷不保原缓存收益。

[社区／一手] [2022-04-25 开发者原帖](https://forums.unrealengine.com/t/text-component-not-updating-inside-retainer-box/539340) 报 UE5 Retainer 内血／弹文本不更新、移出正常，4.27.2 无此问题；后续强刷／phase 绕法不一致。[Epic UE-150807](https://issues.unrealengine.com/issue/UE-150807) 影响 5.0.1，Fixed／Target 5.4／29900904；创建 2022-05-02、解决 2023-11-22、更新 2026-08-07。[研究] 历史已修，非 5.8 缺陷；SetText 成功不证明可见已更新。

<a id="87"></a>

### 采用、撤回与第二次修改

[研究] ✅ 预算够用保留；热点先分布局／几何／批次／GPU，去重复写入，只试一个边界并保交互。uGUI 按更新时机拆；Toolkit 纯视觉用 transform；UMG 先 invalidation，剩 draw 压力且反馈允许才试 Retainer。

[研究] 二改静 HUD 加持续值再加动画，同设备／分辨率比基线与一局部改动，记 CPU 重建、draw/GPU、缓存内存及可见反馈。菜单／显隐后实际点击与已承诺导航核数值／焦点；无 CPU 收益或 GPU／内存／延迟超预算则撤回，停更先查版本／失效，不全树强刷。

<a id="92"></a>

## 对白补研：显示完成不等于剧情交付

核实：2026-10-16（UTC+8）；主线一／三。分别决定补全文字、推进当前句和退出会话，按内容定节奏。[研究]

<a id="93"></a>

### 原生组件已区分的交付动作

[一手] `YarnSpinnerTool/YarnSpinner-Unity@bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d`，[v3.2.8 提交](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/commit/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d)（2026-08-07），[LICENSE.md](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/LICENSE.md) MIT；仅读，字体／配音授权另核。

- [LinePresenter.cs L350–368](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/LinePresenter.cs#L350-L368)：打字效果使用 `HurryUpToken`，随后按设置自动等待或等待 `NextContentToken`。补全文字不是立即推进剧情。[一手／研究]
- [VoiceOverPresenter.cs L156–228](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/VoiceOverPresenter.cs#L156-L228) 消费下一内容、提前结束淡出停止，不消费文字加速；[L115–127](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/VoiceOverPresenter.cs#L115-L127) 缺语音且 endLineWhenVoiceoverComplete 开、接收者有效也请求结束。[一手／研究] 缺配音语言须有阅读回退，非所有配置跳句或应全关自动。
- [LineAdvancer.cs L450–510](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/LineAdvancer.cs#L450-L510) 内部按呈现及 separateHurryUpAndAdvanceControls 补全／推进，忽略收到内容同帧输入；公开 RequestLineHurryUp 路径不同。先配原生，退出不撤已发 [玩法命令](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/DialogueRunner/DialogueRunner.cs#L689-L746)。[一手／研究]

[一手] [Line Advancer 官方文档](https://www.yarnspinner.dev/docs/unity/10-components/02-dialogue-view/03-dialogue-advance-input/) 分 hurry/next/cancel，仍标 3.1；具体以固定 3.2.8 为准。政策通用，不强加 UE 对照或迁 Yarn。

<a id="94"></a>

### 不同作者选择不同节奏

1. **Firewatch。** [一手] [GDC 2017《Do You Copy?》](https://media.gdcvault.com/gdc2017/Presentations/Armstrong_Do_you_copy.pdf) 页50–58（零基49–57）：Julia 被打断会令内部事实与听见信息脱节，故保护关键会话。[研究] 非全禁打断；73–75 的 Conversation 容器仍 Further Work。
2. **inkle。** [一手] [2026-06-18《Pacing dialogue》](https://medium.com/@inklestudios/pacing-dialogue-5bd5a99bfc20) 以短句串联承载文本情绪／节奏，常默认气泡自动继续，频点十来词负担大。[研究] 反对每句必手动，非各语言／阅读能力都更好。

**采用判断：** [研究] 分开呈现、推进和退出输入；可插话保留打断，关键事实可保护／补述／重入。自动或手动按长度、配音与后续选择取舍，不能靠禁所有跳过藏同步错误。

**二改预注册：** [研究] 加配音、缺配音语言及插话分支，走补全、语音中推进、退出、重进和自动播放；核文字、声音、选项及事实。阅读来不及或漏信息则收窄自动／打断；人判阅读与表演。

**实际范围：** 公开文档、固定源码及作者原文静读，无对白体验测试。[研究]

<a id="103"></a>

## 改键持久化：既有选型回流

2026-10-17（UTC+8）。[研究] 回流[既有先导](../../experiments/m6-search-pilot-20261017.json)的 arms[2].result、grades[1].report：Unity 6.3 先用 Input System 1.20.1 加应用薄层，不重做选型。原生[override保存／加载](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/save-load-rebinds.html)配稳定 binding GUID；项目负责冲突、落盘及版本迁移。按索引保存会受重排影响，新增绑定拓扑也不是 override 的保存对象；恢复默认须同步旧设置。[一手／研究]

UE 5.8 的[UserSettings](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/EnhancedInput/UEnhancedInputUserSettings)已有映射、重置与保存，默认固定存档槽；[映射参数](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/EnhancedInput/FMapPlayerKeyArgs)区分 MappingName、slot、设备与 profile，不套 Unity GUID。[研究] 默认沿原生能力，身份／结构变更才补迁移；文档不保证任意动作改版自动恢复。此次是资料支持结论的入口回流与 UE 契约对照，无新增效果、引擎或设备验证。


<a id="104"></a>

## 重复内容：先分机械转换与作者判断

2026-10-19核实。改变04编辑器扩展选择：重复次数本身不决定是否开发工具；机械转换留脚本，项目独有参数先沿已有Inspector，分支与语义作者任务先比较成熟环境。机械批处理继续核预览、重复执行与恢复；引用不稳或重跑结果异常先修原规则，沿01既有契约，不承诺所有操作可Undo。[研究]

**同游戏制作链。** [NITW开发者Jon Manning复盘](https://www.gamedeveloper.com/programming/deep-dive-yarn-spinner)述最初逐行解释对白／命令，嵌套条件后来促使转正式语法与编译器；同游戏日文本地化实际用控制流生成台词覆盖游玩路线，检查器禁循环。语言版本迁移还可通过AST重写。原文未说初版只为一次导入，不能包装成“一次脚本升级工具”的完整实验。[一手：历史作者自述]

[团队2017制作原文](https://secretlab.games/blog/2017/11/14/how-night-in-the-woods-uses-yarn-spinner)展示对白、字节码与表演对应：通用层发出台词、选项、命令，项目实现人物定位、表情、气泡与走位。价值在可反复改稿和控制演出，不只是导入成功；作品有艺术与写作人员，不能证明单人零手修全流程。[一手／研究]

**当前工具维护是另一条链。** [Yarn 3.2发布说明](https://yarnspinner.dev/blog/yarn-spinner-3-2-release/)记录旧编辑器发现YSLS失败、Roslyn回退漏包内命令及参数信息，改由引擎产声明并撤静默回退；同期发布的VSCode扩展提供跨文件图与对白预览，这些能力不能由Unity包3.2.8单独认证。[7月反证](https://yarnspinner.dev/blog/monthly_jul_26/)仍修声明未写盘；无游戏的自定义函数预览当时需用户提供返回值且属预发布，不是实际世界状态。不能推成NITW持续升级或已证明提效。[一手／研究]

固定[Unity v3.2.8](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/releases/tag/v3.2.8)，SHA `bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d`：[设置](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Editor/Editors/YarnSpinnerProjectSettings.cs#L25-L34)默认生成；[生成器](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Editor/Analysis/ActionsRegistrationGenerator~/ActionsGenerator.cs#L293-L354)仍有缺设置、缺项目路径及写失败分支。改命令参数后要核声明与反馈，不能只看开关。[许可MIT](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/LICENSE.md)，[包声明](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/package.json)Unity2022.3；不代替目标版本实测或额外资产授权。[一手：静态]

**采用与责任。** Unity先沿用已有Inspector；需要字段组织、条件显隐等项目反馈时，才按[自定义Inspector教程](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-HowTo-CreateCustomInspector.html)补窄UI。专门作者工具则承接内容语义，项目维护动作消费与表演。已有[Inky](https://www.inklestudios.com/ink/)可自动重放修改后的选择，无依据要求稳定项目迁Yarn。UE[Editor Utility Widgets](https://dev.epicgames.com/documentation/unreal-engine/editor-utility-widgets-in-unreal-engine?lang=en-US)为UMG编辑器tab且标Beta，不搬Unity契约。[一手／研究]

关键作者任务无法表达／验证，或学习、补接与维护成本不值时，转窄工具或其他环境。预览没覆盖游戏状态／完整演出本是职责边界，不单独构成撤回理由。单人程序可承担这些代码与参数工作，但整套内容质量仍待验证；安装、学习、主动工时、费用和二改净收益未知。未运行候选、引擎或游戏；3.3重写与UE版本不作为本段采用依据。[研究]

<a id="105"></a>

## 图中文字二改：先换生产表示再扩语言

核实：2026-10-19（UTC+8）。主线3／4；改变04本地化的资产生产选择，不重复字库覆盖或要求自建本地化平台。未下载图片／字体，未安装、运行工具、游戏或引擎。[研究]

**采用判断。** 已有完整合法语言图片且修改少，可保留；成套图反复修改时，先比较背景、文字、布局分离后批量重生，或移为运行时文字。前者保留可控栅格外观，新增导出链；后者减少语言图片，却把布局／塑形交给运行时。两者须按目标效果验收，不能因源码公开就直接搬历史工具。这里的运行时替代是研究比较项，不称作者已实测淘汰。[研究]

**同作需求与原方案。** [Pope 2014复盘一](https://dukope.com/devlogs/papers-please/localizing-1/)记录：英文首发后，多语言迫使原来手排文字的证件图改生产方式。逐语言人工修图难保统一，自写Flash／C#排版和昂贵专业工具也未选；最后共用HTML/CSS布局，译文变化后再烘焙。它保留精细文档外观，但浏览器导出与像素字平滑成为新成本；特殊图与部分字形仍靠人工，不能作为零手修成功链。[一手：作者自述]

**发行不是效果对照。** [复盘二](https://dukope.com/devlogs/papers-please/localizing-2/)报告候选版由约百人测试后于2014-02-12发行；[GOG当日1.1.60回执](https://www.gog.com/forum/papers_please/papers_please_has_been_updated_to_version_1160_pc_mac/page1)列七种新增语言。作者同时负责翻译团队协调与工具修订；发行证明实际采用，不证明比逐图修改更省工，也不是本仓玩家验收。[一手]

**后续维护改变工具，不撤掉生产目标。** 固定工具仓 `1fba12973b37b847ec0867076e8b4eb471ece600`（2022-09-17快照，非新打包器首发日）的 [packer说明](https://github.com/PapersPleaseLoc/PapersPleaseLoc.github.io/blob/1fba12973b37b847ec0867076e8b4eb471ece600/packer/README.md)明确：旧Chrome扩展跨Windows／Mac维护困难，后来改Node／Playwright／headless WebKit；新方案也有负担，作者标明不提供支持、仅短暂测试。它把生成的图片与数据打成语言ZIP供游戏读取，不是只有在线预览。[一手：作者说明]

固定 [ext/main.js](https://github.com/PapersPleaseLoc/PapersPleaseLoc.github.io/blob/1fba12973b37b847ec0867076e8b4eb471ece600/ext/main.js#L1524-L1567)从CSV与捕获元素形成图片／数据清单；[packer/index.js](https://github.com/PapersPleaseLoc/PapersPleaseLoc.github.io/blob/1fba12973b37b847ec0867076e8b4eb471ece600/packer/index.js#L359-L435)依清单输出数据、逐元素截图并后处理。源码支持生产机制，不证明2026浏览器兼容，也没有把2022打包器追认为2014发行所用工具。[一手：源码阅读]

**代价、撤回与缺口。** 程序员能维护布局与生成脚本，不代表能补画特殊字形。先用目标语言的一组代表文档核共享布局能否覆盖；导出平台升级、特殊图或合法字库缺口抵消收益时，换已支持的生产路线、简化图中文字或收窄语言，不继续扩手工例外。此为后续验收设计，未执行；保留04已有字体、塑形、显示和操作检查。实际可读性、完整零手修与可分离主动工时仍未知。[研究]

权利仅核到 [packer/package.json](https://github.com/PapersPleaseLoc/PapersPleaseLoc.github.io/blob/1fba12973b37b847ec0867076e8b4eb471ece600/packer/package.json)声明ISC；不据此覆盖整库CSS、字体、游戏图片或译文。此处借生产机制，不分发资产或推荐整库直接商用。[一手／研究]

## 字体选择补研：缺字回退与地域字形优先分开

核实：2026-10-20（UTC+8），GA／GB，主线二／三。[研究] 本单元改变04本地化入口：新增语言后，同一字体能查到码位不等于选对地域字形；先判断是缺字还是选择顺序错误，再决定补资源或改变选择。不是改编码或逐字人工修图的默认理由。

**同一游戏的两种修订。** Mindustry 于2026-03-05先[为monospace加入默认字体回退](https://github.com/Anuken/Mindustry/commit/0215cabda88f77b8d3d9faf694e82195338c2eb8)，同日又[修日文字形显示](https://github.com/Anuken/Mindustry/commit/65e4a22c84f60414bccaaf5fc92acaa4ea14e326)：新增font_jp.woff，按locale给默认和描边字体设置override，注释说明要覆盖原来已有字符。[一手：固定diff] 二者不能写成“fallback试验失败后全面弃用”；它们修不同问题。[v156 Beta发布](https://github.com/Anuken/Mindustry/releases/tag/v156)（2026-03-23）分别列日文字体错误与monospace无法显示中文等语言的修复，证明进入发布，不是本仓渲染或母语阅读测试。[一手：发布声明]

**发布实现怎么选。** v156固定 [1773a4d的Fonts.java](https://github.com/Anuken/Mindustry/blob/1773a4d0bc0c11b8896cbed481ce82de049c95c2/core/src/mindustry/ui/Fonts.java)已将monospace回退改为加载参数 `fallback.add(() -> Fonts.def)`，不是逐字沿用首补丁；JP的def／outline两套覆盖保留。其[Vars.java](https://github.com/Anuken/Mindustry/blob/1773a4d0bc0c11b8896cbed481ce82de049c95c2/core/src/mindustry/Vars.java)在常规bundle加载路径按设置locale选默认或显式语言并设置Java默认locale，之后安排额外字体加载，不能简化为只看操作系统，也不能据此保证运行中热切成功。[一手：源码阅读]

[gradle锁定](https://github.com/Anuken/Mindustry/blob/1773a4d0bc0c11b8896cbed481ce82de049c95c2/gradle.properties)的Arc为 [f9072fcc02b4801caf80a116081a666ae0b5fa1d](https://github.com/Anuken/Arc/commit/f9072fcc02b4801caf80a116081a666ae0b5fa1d)；其[FreeTypeFontGenerator.java](https://github.com/Anuken/Arc/blob/f9072fcc02b4801caf80a116081a666ae0b5fa1d/extensions/freetype/src/arc/freetype/FreeTypeFontGenerator.java)的FreeTypeFontData先查询override，原字体生成缺失时才遍历fallback。因此把JP字体仅追加在已有CJK字体之后，不能解决已命中另一地域字形的问题。[一手／研究] 这是特定FreeType实现，不能将同名接口视为所有位图字体／引擎都有效。

**现成替代与反例。** [Unicode官方FAQ](https://www.unicode.org/faq/han_cjk.html)区分字符编码与地域字形，建议日文使用面向日文的字体，也说明已有每码位提供多地域字形的Pan-CJK字体。[一手] 因此比较合法地域字体优先选择，或当前文本栈已支持的同字体地域选择；不要求每种语言都换独立字体，也不从单个汉字可靠猜语言。现有字体已经合适则保留；只缺少罕见字符仍可fallback，不全量替换。

[研究] 对程序员可执行的改动是语言到字体／字形的选择和共享样式引用，不是人工重画。目标质量是符合目标语言阅读习惯而非覆盖率数字；额外代价包括字体分发与驻留、正文／描边等样式配套、混排及语言切换的验证。改变优先级后破坏其他语言、符号、行距或预算，就收窄覆盖范围／换已清权且合格的字体，保留缺字回退；不能撤掉原有塑形、编辑、长文可达性、旧名字和目标输入检查。

本轮只读公开diff、发布与固定源码；未下载字体、渲染、运行游戏／引擎或测量内存／质量。font_jp.woff具体上游与独立许可未闭合，故不推荐复制该文件，也不以游戏代码许可代替字体许可。不同语言地域选择的实际支持、热切、母语读者效果仍待对应验证，不承诺一张配置表完成全部本地化。[研究]

## 译文供给：追加文本不继承旧验收

**2026-10-20（UTC+8），P21／GA、GB。[研究] 小项目先保文本表与版本控制，AI产候选，该语言另行放行；反复增量协作才比较现成TMS，不自建平台。** 记录源稿、语境／术语、译文及放行状态；AI可整理语境、译候选、查增量与占位符，人核目标语言的意思、角色口吻及玩法条件，独立完成比例未知。

**语境纠偏只证明候选可修改。** [Trade Anchor作者](https://lemuria.org/devlogs/ta-07/)称用LLM译六种语言，给太空船、按钮用途等语境，并用自己懂的语言纠偏后重译其他语言。没有陌生语言独立验收、模型版本或净工时，不能据此推荐六语直接发行。[一手：作者自述]

**占比小不免追加内容验收。** The Alters [2025-06-30官方声明](https://bsky.app/profile/11bitstudios.bsky.social/post/3lstiwaoxcc2i)解释最后加入的授权电影因时间不足采用AI本地化，后交翻译伙伴；[7月14日1.1.0补丁](https://store.steampowered.com/news/app/1601570/view/555747819912167772)明确替换Social Room电影机翻字幕。只确认该块采用后撤回，不外推全作失败、具体模型或替换后质量。声明图片与补丁正文由本端云浏览器核读，未运行游戏。[一手／研究]

**改语境也可能使旧译文失效。** [Weblate 2026.10.1源串编辑契约](https://docs.weblate.org/en/weblate-2026.10.1/user/translating.html#editing-source-strings-and-keys)中，改源文会标待编辑，只改key／context／explanation却保留状态。因此说话人或条件变了而原句没变时，要主动回审；此结论限该编辑流程，不泛化全部导入格式。[一手／研究]

**开启review不等于未审文本不会入仓。** [Weblate 2026.10质量过滤](https://docs.weblate.org/en/weblate-2026.10/admin/projects.html#translation-quality-filter)须另配；approved-only仅约束开启reviews的语言，语言覆盖关闭reviews时仍可写各状态。TMS审批也不是本游戏发行验收。[一手／研究]

**保留译文和保留审批分开选。** [Crowdin配置更新契约](https://support.crowdin.com/developer/configuration-file/#changed-strings-update)的update_as_unapproved保译文撤审批，update_without_changes连审批保留；未设时变更串旧译文丢失。语义变化先留待复核候选，不整批覆盖人工成果。此为2026-10-20滚动文档，不代表所有UI默认。[一手／研究]

**二改至少核新增句、否定／条件变化及只改语境。** 确认受影响项回审、旧人工译文保留，实际发行文件没有误混未审新文；格式检查不证明译义正确。延期内容、明确原文回退或缩小语言范围须按玩法与支持承诺决定，不能静默混语；仍保原字库、塑形、布局、编辑和操作检查。[研究；未执行]

**集成维护超过增量收益就撤回TMS或缩小范围。** 译义／术语自动二改闭环、目标语言质量、订阅运维与审校工时均未实测；两案例不足以排名工具／模型。提交云服务前另核文本／译文权利与传输授权；本轮无安装、付费、账号连接、翻译生成或引擎实验。[研究]
