# 内容作者工具：改完一组参数，马上看见下一场遭遇

**✅ 先保原项目数据和默认 Inspector，补一个有单位、有预览、有定位入口的编辑面板；需要摆放点位才接 Scene View 工具，需要跨资产检索才开专用窗口。** 工具的成果不是更漂亮的表单，而是作者能快速试出两种敌人组合、调出明显不同的遭遇，并把选择送进原游戏。

本页给 Unity 优先、Unreal 对照的完整首版方案。已核官方示例与固定开源源码，**未安装这些插件或运行原生编辑器**；交互、保存重开、Prefab 与构建接收仍须在采用工程完成。Agent 如何连编辑器沿[引擎接入](../01-engine-integration.md)，内容定义与实例分工沿[数据驱动](../05-gameplay-architecture.md#4-数据驱动定义实例存档分开)，这里不再造 MCP 或通用窗口框架。

## 1. 从哪个现成底座开始

**默认用原生序列化＋UI Toolkit 的小扩展；已有 IMGUI 工具继续维护，不为统一技术栈重写。** 只有当多个数据类型反复需要同样的分组、条件显示、表格和内联预览，才值得引入属性库。先选一个最常改的内容对象做采用试验，不把全项目 Inspector 同时换掉。

| 读者问题 | 当前选择与接入起点 | 主要取舍 |
|---|---|---|
| 只想更快改一个敌人／技能定义 | ✅ 默认 Inspector＋Tooltip／Range 等已有约束；需要组合摘要时接 `CreateInspectorGUI`＋`PropertyField` | 不用先建完整内容浏览器；范围控件不是数据有效性证明 |
| 多个定义都要折叠分组、条件项、按钮与内联编辑 | 🧪 UI Toolkit 工程比较 MIT 的 Alchemy 2.1.1；已有 Tri 1.x 工程保原版 | 属性提升表单创作，不替你写玩法验证、预览或事务；不要为显示字典自动换序列化 |
| 内容团队大量用现成 Inspector／Validator，愿意付费维护 | 🧪 比较 Odin Inspector／Validator 与项目已有工具 | 按席位和当前营收／融资口径核许可；Inspector 和序列化是两项决定，付费功能不是自动值得采用 |
| 调巡逻点、刷怪点、范围与方向 | ✅ `EditorTool`／Handles＋需要时的 Overlay；保 Scene View 选择、吸附和相机操作 | 空间问题留在空间中，不让作者反复手输坐标；新版自定义窗口宿主能力不是旧版都有 |
| 数百条内容需要查找、批改、比较 | ✅ 沿官方双栏 EditorWindow／ListView 示例，左侧筛选，右侧编辑与预览 | 列表绑定真实资产，虚拟化行不等于持久数据；不要另维护一份不同步的 JSON 工作库 |

**Tri 的两个大版本必须分开选。** 本次 `main` 的 2.0 是 Unity 6／UI Toolkit 预览；其 `TriEditor` 对 IMGUI 显示不支持提示。需要稳定 1.x 的工程按固定 1.15.1／兼容分支选，不直接用无版本 Git URL把旧工具升级到 2.0。两版都声明 Localization 依赖，采用时核已有包，而不是看到 Inspector 插件就认为没有额外依赖。Alchemy 同为 MIT，可只用 Inspector；序列化扩展另需 Unity.Serialization，固定版还对其扩展字段的多选编辑给出限制。

**付费库能减少重复 UI 工作，不替代项目内容模型。** Odin 当前区分 Personal 与 Enterprise、按使用 Editor 的人员计席位；官方说明有永久回退许可，不能照社区争论写成所有人都必须订阅。先在一条实际创作链比较“多快找到并改对、能否预览效果、是否减少回游戏的次数”，再决定买库；只显示几个字段，原生即可。

依据：Unity [自定义 Inspector](https://docs.unity3d.com/6000.0/Documentation/Manual/UIE-HowTo-CreateCustomInspector.html)／[窗口示例](https://docs.unity3d.com/6000.0/Documentation/Manual/UIE-HowTo-CreateEditorWindow.html)；[Alchemy 固定源码](https://github.com/annulusgames/Alchemy/tree/164f9d485d34efc99cda3e99cbf557b1baa810bf)；[Tri 2.0 预览](https://github.com/codewriter-packages/Tri-Inspector/tree/80038223a6c09651e9ab49d9964498a71c0ef3ca)／[1.x 固定源码](https://github.com/codewriter-packages/Tri-Inspector/tree/d75c4dac2e449bc19b5313ce741bd496fca7c123)；[Odin 许可与定价说明](https://odininspector.com/pricing)，2026-10-26 核实。候选均未试用，不声称跨项目效率冠军。

## 2. 首版交付：从一个遭遇定义做到可重复比较

**先让作者回答“哪种组合更有压力”，而不是“这个字段存在哪个脚本”。** 以已有刷怪玩法为例，沿原数据类型增加或整理一组遭遇配置；不要为了工具迁移稳定的运行时代码。

| 对象 | 建议由谁保存 | 作者需要看见什么 |
|---|---|---|
| 敌人定义 | 原 ScriptableObject／配置表 | 名称、图标／模型、角色职责、移速、关键能力；带单位和合法范围 |
| 遭遇定义 | 原内容资产，引用敌人定义 | 组成、数量、入场顺序／时间、结束条件、总数与预计节奏摘要 |
| 场景锚点 | 场景／Prefab 的遭遇组件 | 出生区、朝向、巡逻／目标点；与关卡空间放在一起 |
| 运行实例 | 原 EncounterRunner／Spawner | 当前批次、存活对象、计时与结果；不写回作者源 |
| 预览状态 | 工具临时状态 | 当前选项、时间游标、可视范围与警告，不当存档或正式配置 |

首版作者路径：**选一个旧遭遇→复制成新的内容身份→替换一类敌人→拖出入场间隔→在场景看到队形／范围→从原玩法入口运行→比较两版。** “复制内容”与“修改共享敌人定义”是不同操作；面板直接显示引用对象，能一键定位，不用作者猜自己是否改了所有关卡的同一种敌人。

```mermaid
flowchart LR
  A[既有定义 / 场景锚点] --> B[Inspector 或内容列表]
  B --> C[字段绑定 / 对象引用]
  C --> D[只读摘要与空间预览]
  D --> E[项目语义验证]
  E --> F[明确应用 / 保存作者源]
  F --> G[原游戏加载器与遭遇执行器]
  G --> H[试玩与结果比较]
  H --> B
```

**布局按决定排列，不按 C# 字段声明顺序堆。** 上方保身份、图标和使用场景；主体按“出现谁→在哪里→何时出现→如何结束”分组；摘要显示总数量、相邻批次间隔和关键缺项。空间字段旁放 Scene View 定位，敌人引用旁放预览；高级覆盖项折叠。批改时显示 mixed value，让作者知道选中的多个资产原本不同，不用第一个对象的值悄悄覆盖全部。

这个质量标准适合独立团队：新增一类敌人后，程序员不必重新打开多份脚本才能做内容；设计修改能迅速回到实际玩法。优秀作品作者工具的可借机制是让布局和反馈就在创作现场。《It's All Over》开发者的工具展示强调自己作为关卡作者的反复创作体验；可借这个目标，不据展示视频推断本项目节省多少时间。

依据：[开发者原帖](https://www.reddit.com/r/Unity3D/comments/1wgxhmr/custom_editortools_from_my_game_its_all_over/)与本页作者流程设计，2026-10-26 核实；对象划分和验收目标为实现建议，不是已经在该作品采用的工具。

## 3. 怎么接：先绑定已有数据，再加派生视图

**用 Unity 的 SerializedObject／SerializedProperty 维护可编辑字段，预览只读同一份已确认数据。** 普通绑定的 `PropertyField` 沿 Inspector 即时序列化编辑；图中的“明确应用”只针对批量生成／放置计划，不要求为普通字段另造草稿系统，磁盘保存另论。 自定义 Inspector 的 `CreateInspectorGUI` 返回视觉树后会做隐式绑定；`PropertyField` 绑定现有字段，嵌套的重复结构用 PropertyDrawer。独立窗口选到新资产时则要按该窗口的绑定流程切换 SerializedObject，不把 Inspector 的自动绑定规则照搬过去。

从官方样例借三块就够：`create-a-custom-inspector` 的 UXML／Inspector／PropertyDrawer；`bind-to-list` 的序列化列表；`create-a-custom-editor-window-with-CSharp` 的双栏选择与预览。**先核当前引擎版本对应的例子。** 固定官方仓库 HEAD 已用 `AssetDatabase.SourceSearchQuery`／`SearchAsync`，Unity 6.0 版窗口手册仍用 `FindAssets`；不能把最新 GitHub 片段直接称为 6.0 可编译代码。

| 一次作者动作 | 实现起点 | 最终接收对象 |
|---|---|---|
| 调数量／间隔 | 绑定现有序列化字段；用变更通知刷新总数和时间条 | 保存重开后的同一资产，以及原执行器读到的值 |
| 替换敌人类型 | 对象引用／稳定内容 ID，按原运行时解析规则过滤候选 | 最终实例确实是选中的类型，而非预览模型换了、规则仍是旧的 |
| 在场景移动出生点 | 选择适用组件时显示 `EditorTool` 与 Handles | 当前场景组件记录的锚点，Prefab override 只在作者选择的层级产生 |
| 复制或批量布置 Prefab | 先产生预览放置计划，明确应用时用 `PrefabUtility.InstantiatePrefab` 等编辑器接口 | 保 Prefab 连接的场景对象及可撤销的创建操作 |
| 检查并定位错误 | 项目 validator 返回资产／对象、字段位置、原因与建议 | 双击能定位；只修已知机械问题，玩法取舍由作者选择 |

**批量按钮要调用项目操作，不直接做一串反射字段改写。** Alchemy 的 `MethodButton` 源码只是调用目标方法；漂亮的按钮并不会自动保证新对象的 Undo、Prefab 记录和资产保存。修改操作沿 Unity 的序列化编辑、Undo 创建／修改接口和保存流程，按一次用户意图分组；预览不落对象，应用时才生成。已有点位只需改分布时更新它们，不每次销毁重建使手工关联失效。

需要即时重算的摘要尽量是便宜的纯计算，例如总敌人数与时间轴；昂贵导航烘焙、网格生成或全项目扫描放显式操作。不要把每次 `OnValidate`、Inspector repaint 或列表滚动都接成昂贵生成器；用户能流畅拖动参数，比每个按键都产生一份新产物更有用。

来源与许可：上述[官方代码仓库固定版](https://github.com/Unity-Technologies/ui-toolkit-manual-code-examples/tree/c1d7216dbb4fcf4fa3fe4fed482fd5dc1f951858)的代码片段为 Unity Companion License，其他资料为 CC BY-NC-ND，不把整仓文档当 MIT 复制；[Prefab 实例化](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/PrefabUtility.InstantiatePrefab.html)／[创建对象 Undo](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Undo.RegisterCreatedObjectUndo.html)；[Alchemy 按钮实现](https://github.com/annulusgames/Alchemy/blob/164f9d485d34efc99cda3e99cbf557b1baa810bf/Alchemy/Assets/Alchemy/Editor/Elements/MethodButton.cs)，2026-10-26 核实。本页给接缝，不分发第三方样例代码。

## 4. 预览要帮作者判断，不另外造一个假玩法

**分成三档：数字摘要、空间预览、原玩法试跑。** 摘要快速显示组成与入场时序；空间预览显示实际尺寸、碰撞占位、路径和射程；真正的难度、玩家选择与节奏交给原遭遇执行器。前两档越快越好，但不能拿“预览里的小球能移动”代替敌人实际行为。

- **参数预览**：同时显示配置值和派生结果，例如每批数量、总数量、最短理论入场时间；明确哪些是估计，不从这些数字直接评“平衡”。
- **空间预览**：选择遭遇时显示出生区、目标点、碰撞占位和朝向。使用与正式对象一致的尺度／坐标系，贴着关键地面关系看；装饰数量多时先画 gizmo，不实例化整套复杂 AI。
- **模型／动作预览**：沿编辑器已有 Preview 能力展示身份、尺度或动作，和[动画运行时](04-animation-runtime.md)的真实姿态接收分开。静态缩略图看不出进场后的身体遮挡、攻击范围或实际动画。
- **试玩入口**：把所选定义、场景锚点和固定种子送给已有调试场／关卡启动器，复用原 Spawner、AI、导航与结算。结果能回链到这份定义；工具本身不用拥有另一套战斗规则。

比较工具前后的最小证据：让同一位作者完成“把近战追击遭遇改成远近混编”两次，记录从找到内容到进入可比较试玩用了哪些动作、哪里仍需翻脚本、哪次预览误导了决定。保自然产生的录屏和差异，不为凑数字设计大型基准。首版合格是能完成一轮实际迭代，不是窗口截图好看；好玩仍要真实试玩。

Unity 6.6 的官方 Editor Tools 指南展示了自定义窗口承载工具上下文的路线；如果当前 Scene View 已够用，就保它，不为了把预览塞进一个大窗口升级引擎。Unreal 对照从选中资产／Actor 的 Scripted Actions 起步，需要持续面板再用 Editor Utility Widget；编辑器工具与运行时内容分开，业务动作照样需要可定位的数据和原关卡验证。

依据：Unity [Editor Tools 官方指南](https://discussions.unity.com/t/technical-guide-building-custom-tools-for-the-unity-editor/1733712)（2026-08-12，按 6.6）、[OnPreviewGUI](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Editor.OnPreviewGUI.html)；Epic [Scripted Actions](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripted-actions-in-unreal-engine)／[Editor Utility Widgets](https://dev.epicgames.com/documentation/en-us/unreal-engine/editor-utility-widgets-in-unreal-engine)（文档标 Beta），2026-10-26 核实；三档预览为本页采用建议。

## 5. AI 的首版任务、二改与接收

**让 AI 先复用原类型做出一个实际作者动作，不先写抽象编辑器平台。** 提供现有定义、运行时读取入口、一个正确样例和一个坏样例、作者最常做的修改、引擎／插件版本及允许操作的资产目录。让它说明哪些字段原本已经能编辑、哪个可见反馈真正缺失，再只补那一层。

首版任务可以直接写成：

> 在原项目为一种遭遇定义补编辑入口：能选择敌人、调整数量和入场间隔，看到总量／时间摘要，定位场景出生区，并用原玩法启动器试跑当前定义。沿现有序列化格式和 Prefab，不引入新存储；借原生 Inspector、UI Toolkit 或项目已装属性库。交付正常作者路径、一次保存重开、一次 Undo／Redo、一个错误定位，以及实际试玩读到修改值的证据。引擎未运行时只交研究／待执行清单，不报通过。

**第二次需求增加“同一遭遇的简单／困难两档，并新增一名远程敌人”。** 先沿原配置机制表达差异：默认组成共享，只覆盖确需改变的数量／间隔或阵容；明确当前编辑基础定义还是档位覆盖。预览与试玩要选择同一档位，旧定义没有档位数据时仍能按原默认加载。远程敌人增加射程预览和出生朝向，而不是给所有旧近战资产补一堆无意义必填字段。

| 要证明什么 | 适用检查 | 典型 AI 失败 |
|---|---|---|
| 作者能独立完成一次修改 | 非作者只看面板完成选、改、预览、试跑；记录卡点 | 入口藏在上下文菜单，字段没有单位，只有作者知道怎样用 |
| 资产是真实数据源 | 保存重开核字段与引用；原执行器读同一对象／ID | 编辑了窗口副本，预览变了但游戏仍读旧资产 |
| 批改与上下文正确 | 两资产不同值、多选；Prefab 资产／实例／变体各验适用路径 | 显示第一个值后覆盖全部；在错误上下文判缺引用 |
| 生成产物能继续编辑 | 原有手工引用保持、应用结果可定位，撤销／重做含创建物 | 按钮只是方法调用，创建了对象却不能撤销或断了 Prefab |
| 性能不妨碍创作 | 典型内容规模下搜索、滚动、拖值、预览的响应 | 每次 repaint 扫全库，虚拟列表重复挂回调，拖动就重烘焙 |
| 工具没有进入错误发布范围 | Editor 程序集隔离，目标 Player 构建不引用 UnityEditor | Runtime 类型依赖整个编辑器插件，构建才发现错误 |

验证器只证明自己检查过的约束。Tri 1.15.1 用户在 Unity 6.3 报告同一 Prefab 引用在 Project 预览与打开 Prefab 后得到不同验证结果；可用它设计上下文用例，不能把一条插件红字直接升级成“资产损坏”。玩法验证与 UI 校验复用同一规则，关窗或不选中对象也应能在现有批量检查入口发现缺项。

依据：[Tri #231 原始报告](https://github.com/codewriter-packages/Tri-Inspector/issues/231)（2026-02-07）；源码与探索详情见[研究记录](../../../docs/research/2026-10-26-content-authoring-tools.md)，2026-10-26 核实。

**停止扩工具的条件：** 作者已经能顺利完成这一轮内容迭代，就回去做关卡和玩法。只有下一次真实修改证明检索、预览或批改仍是瓶颈，才扩大工具；节点图、完整内容数据库和跨引擎编辑器都不是首版前置条件。
