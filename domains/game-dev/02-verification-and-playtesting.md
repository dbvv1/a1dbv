# 游戏验证：按缺少的证据选择试玩方式

> 核实时间：2026-10-15（UTC+8）。本文是公开文档、作者案例和既有源码研究的采用判断，未运行真实引擎或玩家实验。

## 1. 30 秒结论：这次改动，什么结果还没有证据？

**✅ 先用项目已有入口回答具体问题，再补缺少的观察；不按“单测→接口→像素→人工”的阶梯建设。** 编译通过只是代码入口成立；状态正确、输入可用、画面清楚和玩家愿意继续玩，是不同的待证事实。真人反馈从核心玩法原型就开始，不排在自动化全部完成之后。**[研究]**

| 现在要决定什么 | 优先采用的观察 | 什么情况下换／补手段 |
|---|---|---|
| 规则、费用、奖励次数、状态转移是否正确 | 现有纯逻辑测试；保留触发错误的动作序列与预期结果 | 错误依赖场景对象、物理、异步或引擎生命周期时，补真实运行路径，别继续扩大 mock |
| 角色、场景和物理是否真的在运行 | 现有 PlayMode／Functional Test 或可调用的运行时入口；观察相关对象、时钟和动作结果 | 编辑器通过但目标构建不同，就查目标构建；工具连接成功、进入 Play 都不足以证明玩法推进 |
| 长链交互能否走通，哪些状态不可达 | 已有状态快照＋玩家动作入口；需要时保存最小复现场景 | 文本／回合制通常适合；实时画面、设备绑定或呈现时序是问题时，补对应输入与画面，不另写一份游戏逻辑 |
| 改键、焦点、暂停菜单是否可用 | 经过实际输入系统与 UI 路由的测试；目标设备实际操作 | 调用按钮业务函数绕过绑定／焦点；引擎合成输入也不能证明 OS 与外设路径，设备问题须在目标设备复核 |
| 画面、动画、音频是否退化 | 固定场景的截图差异、动作录像／听验和目标设备帧时间；与已认可版本比较 | 静态差异适合找变化；拖影、遮挡、节奏、声音竞争要看连续过程，不能靠一张“漂亮截图”验收 |
| 动作是否有力、挑战是否公平、玩家是否想继续 | 让目标玩家完成具体情境，观察误解与操作，再比较候选 | 指标定位问题，人决定目标和取舍；自动通过、Agent 自评或短时玩通都不能证明长期乐趣 |

以上是**[研究：采用判断]**，不是工具排名。若改动只影响一个公式，无须为此建设整套试玩接口；若问题是第一分钟不好理解，也不应先把模拟对局跑到上千场。批量模拟适合已有可执行规则与明确统计目标，代理策略的胜率不直接代表真实玩家平衡。

## 2. 工具到底观察了哪一段

**✅ 复用现有测试／调试入口；发现观测缺口才加一个窄接口。** 项目没有 MCP 不意味着不能测试，也不因此要求安装。以下只列会改变选择的差别，具体接入见 [Unity](unity/01-toolchain.md)／[Unreal](unreal/01-toolchain.md)。**[研究]**

| 已有入口 | 能得到的证据；选择边界 |
|---|---|
| Unity CLI／Pipeline | `status --format json` 的 `frameCount`、`playerLoopTicking` 可帮助确认 PlayerLoop 推进；还要读本次涉及的玩法状态，不能把帧数增长当作伤害／物理已执行。[一手：[CLI release notes](https://docs.unity.com/en-us/unity-cli/release-notes)；研究] |
| Unity Input System 1.19 | `InputTestFixture` 用隔离的输入系统与合成设备测试绑定、交互和输入处理；不依赖真实平台后端／硬件。适合可重复的输入回归，外设与 OS 问题仍需实机。[一手：[Input testing](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/Testing.html)] |
| Unreal 5.8 | 原生 Functional Testing 可测关卡，Automation Driver 模拟应用收到的键鼠输入，现成定位器面向 Slate；当前文档未提供手柄／触摸支持。别把它写成通用真实设备试玩，也不因有 MCP 就假定所需测试工具已暴露。[一手：[Automation Framework](https://dev.epicgames.com/documentation/en-us/unreal-engine/automation-test-framework-in-unreal-engine)、[Automation Driver](https://dev.epicgames.com/documentation/en-us/unreal-engine/automation-driver-in-unreal-engine)；研究] |
| Roblox Studio MCP | 官方提供 `playtest` 子 Agent、状态／日志／截图与键鼠模拟；`character_navigation` 是另一个移动入口。导航到位置并不能证明玩家按键、UI 焦点与操作提示正确；回读应选对 Studio 实例及 Client／Server 状态。[一手：[Studio MCP](https://create.roblox.com/docs/studio/mcp)；研究] |

**局限：工具的官方能力契约不等于本项目已验证。** 缺少结果就报告具体缺口，例如“逻辑序列通过，手柄返回菜单未验证”，而不是把一种入口的成功升级成全部验收通过。**[研究]**

## 3. 一个真实案例：答对了，为什么还走不出去？

Jeff Schomay 的 [Crossword Dungeon 开发记录](https://blog.jeffschomay.com/letting-ai-play-my-game)展示了适合状态接口的情境：网页、文字为主、回合制。他为现有游戏加 Node.js 外层，以文本呈现状态并发送合成事件，再让 Agent 建立指定情境的 fixture。正文保留的是作者公布的运行记录，不是本仓库复现。**[一手：作者报告]**

“笼子陷阱”的关键路径是：答错被困→移动被拒绝→答对显示解脱→关闭提示→再次尝试移动。Agent 观察到房间完成而移动仍被拒绝，定位到 `state.caged` 未清除；修正后记录了坐标变化。作者随后仍人工发现其他 bug 和手感问题。**[一手：同上]**

**✅ 借用的是“验证退出后的下一步”，不是“单元测试发现不了状态 bug”。** 若规则能独立调用，这条状态序列也能写成确定性测试；依赖实际事件分发时则保留运行时回归。只断言“房间完成”会漏掉“恢复移动”，换成更多截图也未必弥补错误的验收条件。这个案例支持给已有游戏补合适的观察入口，不支持所有新项目第一天先建 HTTP、文本渲染器和时间控制层。**[研究]**

## 4. 如何验证第二次修改：给已有动作加入暂停菜单

假设原先“按住蓄力、松开释放”已可用，现在加入暂停与设置菜单。**先决定暂停时蓄力、输入缓冲和恢复后的释放规则，再选择能观察这些规则的现有入口。** 下面是按风险组合的例子，不是每项功能固定跑几个异常场景。**[研究]**

- **规则回归**：用原有测试走蓄力→暂停→松键→恢复，按设计检查是否取消／保留、费用与释放次数。不是让测试自行决定“恢复后应该攻击”
- **真实运行**：确认暂停前后相关对象与计时的变化。Unity `timeScale=0` 停止 `FixedUpdate` 和 `WaitForSeconds` 的继续执行，但 `unscaledDeltaTime` 不受它缩放；UE 的 Tick 可设置 `bTickEvenWhenPaused`。因此菜单能动、帧数增长、世界冻结可以同时成立，要检查玩法自己的时钟。[一手：[Unity timeScale](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-timeScale.html)、[unscaledDeltaTime](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-unscaledDeltaTime.html)、[UE FTickFunction](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/FTickFunction)]
- **输入与 UI**：通过项目实际输入路径走暂停→设置→弹窗→返回，检查焦点、按键提示以及恢复后角色是否误释放；涉及改键／设备切换就加入该路径。Unity UI Toolkit `Button` 的 `ClickEvent` 与手柄 `NavigationSubmitEvent` 不同，`Button.clicked` 覆盖两者，仅调用业务回调会漏过这个差别。[一手：[UI support](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/UISupport.html)]
- **玩家体验**：让人实际操作这段切换，确认按键释放是否符合预期、菜单是否可理解、恢复是否突兀；日志用来定位被拒绝／延迟的动作，不能替人决定操作是否自然

**何时补接口？** 只有当前无法回答关键问题时，例如看得见“没有攻击”，却分不清输入未到、状态拒绝还是动画延迟，才在已有入口增加对应状态或时间戳。复现场景保留版本、输入序列与预期结果；不要为了自动试玩复制规则实现或改造全部架构。**[研究]**

### 重复 Play 与新进程：先核实这次从什么状态开始

**✅ 第二次改动触及启动、静态订阅／缓存或编辑器热更新时，保留“刚编译后的首次进入”和“不改源码的退出→再进入”两个观察；需要判断首次启动时，再用新进程走同一动作。** 复用项目已有 PlayMode／Functional Test、日志与操作入口，不新建一层试玩服务。只改无共享状态的公式、已有测试已覆盖输入输出时，无须强制双 Play。**[研究]**

- **Unity 使用关闭 Domain Reload 的迭代设置时**：记录 Domain／Scene Reload 开关；第一次完成动作后退出，不修改脚本、不主动刷新，再进入并核对动作结果、回调次数与本局初始状态。脚本变化触发的刷新仍会重载域，所以“每改一次代码就 Play 一次”可能一直看不到残留订阅；另一方面，关闭 Scene Reload 的历史缺陷也曾表现为首次失败、第二次成功，不能只保留较好的那次。[一手／研究：[Unity 6.3 契约](https://docs.unity3d.com/6000.3/Documentation/Manual/domain-reloading.html)；维护反例见下方研究记录]
- **UE 只改 `.cpp` 也要看改了什么**：Live Coding 后已有对象不自动获得 `.cpp` 构造函数里的新默认值。若改动涉及初始化，回读旧实例及重新完整构建、启动后的实例，并区分蓝图／关卡保存的覆盖值；不要因为热会话仍显示旧值就反复补业务逻辑。涉及 Object Reinstancing 时，另查缓存引用是否失效重建、退出是否正常。[一手／研究：[UE 5.8 Live Coding](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-live-coding-to-recompile-unreal-engine-applications-at-runtime)]

**关键局限：这些检查区分状态来源，不保证发布正确，也不表示每个改动都要打包。** Realm 的第二次启动挂起与 NGO 的首次进入漏回调都是已处理的历史维护案例；具体版本、修订与未实测范围见 [WP10 重复进入补研](../../docs/research/2026-10-14-game-wp10-client-modules.md#重复进入补研不要让编译刷新替你重置验收状态)。**[研究]**

## 5. 质量上限：可测的部分交给工具，体验取舍交给人

**✅ 把“手感不好”拆成能修改的假设，而不是写成“没有可计算标准”。** [04 客户端质量](04-client-modules.md)已结合 Celeste、Celeste 64 和 Deepnight 的公开实现，区分输入容错、运动、反馈与呈现。借用其机制时，应保持纯呈现对照与规则变化分开：视觉后坐力与实际位移不是同一改动，顿帧／缓冲也会改变操作时序。**[一手＋研究，证据见 [WP10](../../docs/research/2026-10-14-game-wp10-client-modules.md#体验质量深化响应与顺滑让同一个动作值得反复玩)]**

| 具体问题 | Agent 可以推进什么 | 人保留什么决定 |
|---|---|---|
| 按了没反应／恢复后误操作 | 对照输入、动作接受、首次反馈的程序时刻；检查缓冲消费和状态退出 | 容错窗口、动作承诺是否适合玩法；程序日志不等于外设到显示器的完整延迟 |
| 攻击看不清／画面不顺 | 对比同场景运动录像、帧时间和命中反馈，找长帧、遮挡与信号冲突 | 哪个威胁应优先被看见，效果是有力还是干扰；用目标设备连续试玩判断 |
| 换素材后风格或清晰度退化 | 自动检查规格、引用、布局与基准截图，生成候选对照 | 选择认可的基准、判断风格与信息层次；不是把全部美术检查留给人 |
| 玩通却无聊／策略单一 | 汇总行为与失败位置，比较候选规则，按已定目标模拟 | 目标玩家、挑战、节奏与公平性的取舍；Agent 能帮助迭代，不能自证好玩 |

**截图差异不是审美评分。** UE 截图比较支持容差，也可关闭 TAA、运动模糊等噪声来源；这有助于稳定回归，但若正在检查拖影／动态清晰度，就必须另外观察保留实际渲染特性的运动过程，不能用“关掉后通过”代替问题解决。**[一手：[Screenshot Comparison](https://dev.epicgames.com/documentation/en-us/unreal-engine/screenshot-comparison-tool-in-unreal-engine)；研究]**

下一轮只改变明确的问题：先确认动作／画面是否改善，再看第二次需求修改会不会破坏它。人的判断与自动回归相互补充，不需要宣称 AI 不可能做出好游戏，也不把测试通过当作品质保证。**[研究]**
