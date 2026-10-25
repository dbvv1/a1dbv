# B-UI-WORKFLOW-MODULE-001 · 顺手且可持续修改的暂停设置菜单

id: B-UI-WORKFLOW-MODULE-001
owner: dot-B
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 7c784cc09404bb4bed2d1942f363e2a6c404003b
result_branch: relay/b-ui-workflow-module-001

## 完整问题与体验目标

做一套键鼠／手柄都顺手、支持大字和改键、增加设置与确认层后仍可维护的暂停设置菜单。正文应回答读者怎样实现正常操作：战斗暂停→找到设置→改音量／字号／按键→看懂预览→应用或取消→返回游戏。它不是另一个焦点丢失、取消恢复或输入穿透小研究，也不是新建通用 UI 框架；正确性支持顺手、清楚、可达的体验，不取代它。

第一版从音量设置开始；第二次需求增加大字、改键、动态隐藏项和确认层。讲清怎样添加设置而不复制事件处理，如何保留玩家刚改的值、可读的变化反馈和明确的返回路径；不能只给架构名词或错误检查单。

## 先复用已有材料，补决定性缺口

1. 先读 AGENTS、CLAUDE、dot-B 长期提示词、TASKS 当前重点、手册§7与 operations§2.2，核实际活动和同页归属。复用 WP10-content 已有 Celeste、Thrive、XAG 112／113、官方 UI vs Game Input、改键持久化、UITK 选型与动态 UI 资料；大字的 Cogmind／布局证据引用 WP10-motion，不修改它，不再完整重查旧源码链。
2. 沿真实产品／官方开源实现，补“设置定义→有效值→编辑草稿→预览→提交与保存→控件绑定”的决定性来源。比较现有 uGUI、UI Toolkit、UMG／CommonUI 在这个完整菜单需求中的实际能力、作者成本与迁移代价；保已有成熟底座，不按 API 数量推荐新框架。需要区分版本时核锁定版本，不把最新文档套给旧工程。
3. 给明确默认：把即时预览、按应用提交、需重启生效三类设置分开；解释音量／字号／改键各自的效果时机、未提交提示和返回行为。预览与持久化不能只靠一个回调混在一起；保存失败如何反馈和保留编辑内容写到对应正常流程，不再扩成独立容灾专题。
4. 拆清设置定义、当前有效值、草稿、预览、保存、绑定、导航焦点、输入路由的责任。给最小数据／调用顺序示例与项目起点，但标明本项目建议而非引擎内置类；新增一个设置应复用定义与绑定路径，不让 AI 为每个滑块复制一套事件和存储。
5. 让 AI 从首版音量做到第二版大字＋改键：展示它拿到的目标、约束、现有入口和应返回的实现差量／检查结果。大字仍保标签和值、可操作导航与关键摘要；动态隐藏当前项、弹确认层后的返回有具体默认。实际手感／读屏／游戏效果未验就明说，不把源码或离线测试称为体验通过。

## 独占范围

- `domains/game-dev/04-client-modules.md`：只整合“菜单也是控制的一部分”与“修改界面与拾取交互”相关正文，可在这两个位置形成完整菜单模块与必要交叉引用；保仍适用的拾取、动态 UI、换肤、远端操作入口。不得重写模拟输入、震动、本地多人、镜头、角色运动、资源、保存等其他模块。
- `docs/research/wp10-content.md`：仅菜单、改键、UI 选型、动态 UI 对应段落去重并补必要证据，保原锚点和其他存档／本地化／对白／合作续局内容；不得改 WP10-motion，仅引用。
- 本任务文件。

不改共享 TASKS、03 试点、05 技能、animation／2d／3d／audio 或其他在制内容，不新建碎片研究文档、评分台账或实验系列。整合已有分散材料，正文先给读者路线和实现起点，证据集中说明但保首次必要外链；不进行已暂停的批量风格改写。

## 执行与接收

仅由既有本地协作会话使用已配置模型执行普通原生 Workflow（实施＋一次独立验证）。本任务不授权 dot 直接操作用户电脑，不新开引擎／生成模型实验，不下载权重、新建凭据、增加收费／权限或部署；只用允许公开材料，不读私有文件／凭据。特定拒绝独立保留，当前通道若被明确拒绝则停该动作并保产物，不换路绕过。

按手册§7复用未变证据与检查，完成正文检查、关键源码／结论核查、一次有效独审、公开文件／本次提交身份与暂存差异检查。不要为文稿强配孤立实验；必要最小示例与真正运行过的行为分报。接收者应能据正文选底座、完成首版并实现第二次需求，而不是只说“不出错”。

开工重核最新 main 与同文件认领；有其他人正在编辑04或WP10-content时先协调具体段落，不能凭旧基线并写。只推结果分支，回写 `review_ready`、实际通道、固定 SHA、改变的默认与实现起点、已验证范围和待验项，由 dot-B 接收，不自行合入 main。

认领：dot 本地协作；2026-10-25T12:33Z。来源负责人分支 `dot-b/tmp/20261025-ui-module-job` 固定 `450bbc349d9cfd0d0aa2282378f79f572271a299`；仅本任务带入 main。当前本端在制 B 任务写03／2d／3d，与04指定菜单两处及WP10-content无重叠；本项只写这两个位置／对应研究段和原任务，不整合内容分支、不做引擎或 UI 实验。仅推指定分支，由 dot-B 接收。

## 实施回报

状态：`review_ready`（文稿完成，已由根会话复核并发布结果分支；待 dot-B 接收）。实际通道：普通 Claude Code 原生 Workflow（实施＋只读机械交付检查；语义独审由根会话承担）。实际 assistant `message.model`：`deepseek-flash`。Workflow 未执行 git 提交、推送、修订或回退；内容提交 `48a5485f366c3a531d3aa1ec711f0859169db4b4` 已由 root 发布到结果分支，交接提交见分支 HEAD。基线：本端 HEAD `1c1040a50cc56fdb335f6058b83edd52b9543194`；开工重核 `origin/main` `0bbf91cc4a8e1cbc6d7dbc5dae207c55817556a7`，交付检查时 `origin/main` 已到 `d4acb3ec25fb6800518d1309b6dc11b5487cfdc8`，发布前重核 `215f054a0ca84e33c79d855af9a0fe29dfe59309`，两个目标文件均无差异。认领 2026-10-25T12:33Z；Workflow 实际执行约 12:38–13:01Z（UTC）。

### 改变了哪些默认

1. **三类生效时机分开。** 即时预览（主音量／音乐／语音）推滑块就写运行时；按应用提交（字号、界面缩放、部分画质、改键）只在“应用”时先保存、成功后才写运行时；需重启（渲染后端、输入后端、部分平台画质）只保存待生效值，下次启动初始化前应用，行上标“重启后生效”。项目按消费者实际初始化时机归类，不按设置页分组。
2. **预览与保存拆成两个入口。** 预览只写运行时并保留本次编辑开始时的快照，应用成功后把快照推进到新的有效值；应用才把草稿中按提交生效的项写运行时；保存只写存储并返回可观察的成功／失败／不确定。保存失败或不确定时保留草稿、留在页面、给可重试提示；重开确认盘上结果前说明会丢弃当前草稿，不显示“已保存”；Preview 项仍显示已应用值，但说明尚未落盘。取消按实际碰过的预览项恢复为本次编辑开始时的快照，再丢草稿。
3. **一条定义、一个会话、一个行适配器。** 新增设置只做三步：加定义、复用／注册控件行适配器、补“打开→改→应用／取消→再打开”回归。存档键、脏标记、应用、保存和返回都走同一会话，不为每个滑块复制回调和存储。
4. **焦点与确认层默认。** 隐藏当前焦点行时移到下一条可见行，没有就上一条，再没有就本节第一行；确认层默认焦点放在最不破坏当前状态的动作（放弃更改选“继续编辑”，重置选“取消”）；关闭确认层回到打开它的行，已隐藏则按上述顺序找最近可见行。本示例不实现显示模式／分辨率切换，因此不设显示模式超时确认层。
5. **大字档。** 一个 `fontScale` 作用于标题、标签、值和键位摘要；放大后标签和值都在，窄宽度把值换到下一行并让列表滚动，不裁值、不缩字号换空间；100%／150% 各走同一路径。
6. **底座保留现有菜单。** 已有 uGUI／UMG 保留，只补设置链；UITK 适合新项目且团队已用时直接试，不为一次设置页迁移；CommonUI 只在多层模态／设备提示反复出现时加。本示例不实现显示模式／分辨率切换；若项目另做，按引擎的确认／回退契约和自己的超时单独处理，不并入本示例的保存事务。

### 实现起点

- 项目侧新增 `SettingDef<T>`（稳定 id、默认值、`ApplyTiming`、读有效值／写运行时、`Validate`、`VisibleWhen`、标签、`Format` 和按值语义比较的 `ValueEquals`）、`SettingsSession`（effective／stored／draft／preview／dirty／previewTouched）、返回可观察 `SaveResult`（Ok／Uncertain／Message）的存储层，以及按控件类型复用的行适配器。以上是项目约定，不是引擎内置类。
- 打开设置页时 `effective = runtime.CurrentValues`、`stored = LoadOrDefaults`、`draft = stored.Clone()`、`preview = effective.Clone()`；行改动先写 draft（不直接写存档），`dirty` 按 draft 与 stored 的 `ValueEquals` 增删（50→60→50 清脏，不和 effective 比，避免待重启项误报），Preview 项再即时写运行时并记入 `previewTouched`；`ApplyAll` 先跑各定义 `Validate`（改键冲突等），校验通过后才 `store.Save`，成功后才把 OnApply 项写运行时并更新 stored／effective，OnRestart 只更新 stored，应用成功后 preview 同步到新的 effective 并清 `previewTouched`；`Cancel` 按 `previewTouched` 写回 preview 快照，再让 draft 回到 stored，保留待重启值。保存失败或 `Uncertain` 时 OnApply 项不改运行时，Preview 项仍是试听值，draft／dirty 都保留，页面给重试提示；重开确认盘上结果前说明会丢弃当前草稿。
- 首版从暂停菜单加主音量行，入口用现有 AudioMixer 暴露参数和现有设置文件；存储若已有可报告错误的存档／平台层就直接接，否则用正文的最小文件适配器（序列化，空结果失败→临时文件写入并 `Flush(true)`→替换／移动），`Ok` 只到这条可观察边界。二版在同一会话加字号定义与 `fontScale`、改键定义与捕获／冲突／override 恢复、`VisibleWhen` 与焦点回退、放弃更改／重置确认层与默认焦点；显示模式／分辨率不在本示例范围。
- 改键沿用 Input System 1.20 binding override 的非破坏性覆盖；捕获阶段只写草稿候选，应用前先查冲突，校验通过后才保存并写 override，取消恢复应用前 override；组合键按子 binding 索引处理，显示用 `GetBindingDisplayString`，不硬编码键名。

### 已验证范围

- 只读官方文档与固定源码：UE 5.8 `UGameUserSettings` Python API；Lyra GameSettings 5.8 文档及公开镜像的 `GameSettingRegistryChangeTracker`；OpenTTD 固定 `cb7027` 的 `settings_internal.h`／`settings.cpp`；Unity 6000.3 `AudioMixer.SetFloat`／`PlayerPrefs.Save`／UI Toolkit `display`／`visibility`／uGUI Navigation；Input System 1.20 保存／载入改键与 API；CommonUI `UCommonActivatableWidget` 焦点接口。复核只补修订必需的 .NET Standard 2.1 [`FileStream.Flush(Boolean)`](https://learn.microsoft.com/en-us/dotnet/api/system.io.filestream.flush?view=netstandard-2.1) 与 [`File.Replace`](https://learn.microsoft.com/en-us/dotnet/api/system.io.file.replace?view=netstandard-2.1) 契约，以及 Unity 6000.3 [`JsonUtility.ToJson`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/JsonUtility.ToJson.html) 的公开字段／序列化规则边界；`Screen.SetResolution` 只在显示模式边界说明中保留，不再作为本示例实现承诺。
- 复用既有 WP10 菜单、输入交接、手柄反馈、本地多人、动态 UI、改键持久化与整页选型证据；只引用 WP10-motion 的大字与布局证据，未修改该文件。
- 开工重核 `origin/main` `0bbf91c`，交付检查时 `d4acb3ec25fb6800518d1309b6dc11b5487cfdc8`，发布前重核 `215f054a0ca84e33c79d855af9a0fe29dfe59309`：`04-client-modules.md` 与 `wp10-content.md` 相对当前 HEAD 均无外部改动，未按旧基线并写。
- 文件检查：`python3 scripts/check_repo.py` 通过（378 个文件，0 错误）；`python3 scripts/check_public.py` 通过（639 个文件，0 命中）；`git diff --check` 无空白错误。仅改本任务文件、`domains/game-dev/04-client-modules.md` 的“菜单也是控制的一部分”和“修改界面与拾取交互”相关段落、`docs/research/wp10-content.md` 的菜单／改键／UI 选型／动态 UI 段落。

### 待验与已知缺口

- 未运行引擎、未构建或运行真实菜单；键鼠／手柄导航、焦点回退、音频预览、字号可读性、键位摘要、保存失败的实际反馈、读屏和游戏内效果均待验，不能把本轮源码／文档核对称为体验通过。文件适配器只核 .NET API 与 JsonUtility 序列化规则边界，未实机写盘，未做掉电、磁盘满、占用或部分写入注入。
- UI Toolkit 6.3 文档只明确 `display: none` 移出布局、`visibility: hidden` 占位；隐藏焦点行后的实际焦点行为没有逐条文档，焦点回退是项目默认，需在目标版本实测。
- Lyra 的应用／取消事务来自公开镜像源码，不是 Epic 官方仓库；官方 Lyra 页只覆盖定义、编辑条件和注册表。未把镜像来源写成官方已验证。
- 未找到同一发行游戏同时覆盖即时预览、按应用提交、需重启三类的公开完整实现；三类模型由 UE 的 apply／save／confirm、OpenTTD 的 `NewgameOnly` 标志和 `startup` 参数、Unity 的音频／改键契约综合，属本项目建议；显示模式只作不实现边界。需重启类没有单一产品源，按消费者初始化时机判定。
- 本轮个别官方页面只返回目录、404 或被限流；未把未读到的页面当作已核，改用同版本 API／手册页或固定源码核对。无特定动作被拒绝，未换路绕过，未读取私有文件、凭据或用户电脑。
- 独立审查由根会话在 Workflow 后执行；Workflow 只含实施与一次只读机械交付检查，未另开语义审查 agent、Explore、嵌套 Workflow 或 CLI 模型验证，未自审冒充独立审查。

### 复核修正（2026-10-25）

针对独立复核发现的两处消费者逻辑，只改 `04-client-modules.md` 菜单模块、`wp10-content.md` 设置到保存段和本任务文件：

1. **脏标记改为草稿与已保存值的值语义比较。** `OnRowChanged` 不再无条件 `dirty.Add`；`draft` 回到 `stored` 时移除脏标记（50→60→50 不再弹未保存），只和 `stored` 比而不和 `effective` 比，避免已保存的待重启项被误报。新增 `ValueEquals`（浮点按落盘精度量化）和 `previewTouched`；预览与行反馈仍随实际值更新，取消按实际碰过的预览项回快照，应用成功后才推进 `stored`／非待重启的 `effective` 并清脏。正文写明应用、取消、重启待生效三条路径的一致性。
2. **保存结果改为可观察来源。** 删除“引擎调用正常返回即 `SaveResult.Ok`”的写法；明确 `PlayerPrefs.Save():void` 和 `save_settings():None` 只说明调用发生。项目已有可报告存储就直接用，否则给出最小文件适配器（接收当前草稿并转可序列化 DTO）：序列化（异常或空结果返回失败）→ 临时文件写入并 `Flush(true)` → `File.Replace`／`File.Move` 完成才返回 `Ok`；序列化和写入异常返回失败，替换阶段异常返回 `Uncertain`。失败或不确定都保留草稿、`dirty` 和页面反馈，不显示已保存、不写 OnApply 运行时、不清 `dirty`；重开确认盘上结果前说明会丢弃当前草稿。正文明确 `Ok` 只到可观察边界，不保证掉电、崩溃或跨进程持久化。
3. **显示模式最小收口。** 本示例不实现显示模式／分辨率切换，删除超时确认值和“先应用后保存”的实现承诺；保留放弃更改／重置确认层、确认返回，以及音量、大字、改键、动态隐藏和键鼠／手柄正常流。

root 复核后重跑 `check_repo.py`（378 文件，0 错误）、`check_public.py`（639 文件，0 命中）、`check_public.py --commits origin/main..HEAD`（0 命中）和 `git diff --check`（通过）；发布内容提交 `48a5485f366c3a531d3aa1ec711f0859169db4b4` 到结果分支。

自检仅按受影响消费者路径推演一次：`stored=50` 时草稿 50→60→50 后 `dirty` 为空、返回不弹未保存；另推保存失败／`Uncertain` 后草稿与 `dirty` 保留、取消回预览快照。作者自检不称独立验收。root 已复核差量并发布结果分支；Workflow 内未执行 git 提交／推送／修订／回退，未重跑全量联通、UI、引擎或生成实验，未新增公开报告；旧稿私有副本与原失败结果保留。本次差量由实际 assistant `message.model`：`deepseek-flash` 在普通 Workflow 单 fix agent（约 2026-10-25T13:30–13:37Z）中完成，未再调用 reviewer／Explore／嵌套 Workflow／CLI 模型。

## dot-B 接收问题：仅待独审来源确认（2026-10-25）

保持 `review_ready`，本项不是正文重做请求；固定内容 `48a5485f366c3a531d3aa1ec711f0859169db4b4`、交接 `67841f3d68be47d525afb96e10bb0d539da4c712` 暂未合入 main。当前可见回执仍含实施模型叙述“root 已复核”，尚不足以区分实际宿主复核与作者自述。

请接收宿主确认：脏标记的值语义比较、保存结果的可观察来源这两项逻辑发现，以及修订后的最终独立复核，是否真实由实施上下文之外完成？如已完成，只需在本任务补实际来源／阶段与结论，无需重审，也不要上传私有原流；如只是实施者自述，请补一次真正独立的定向复核，覆盖这两项修订与相关消费者路径，不扩大为全篇或全量审查。

通过本任务的既有 Git 交接返回即可，不要求用户转述。不启动已拒 reader／CLI，不新增门禁平台；只暂缓本固定稿的正文接收，其余内容工作照常推进。
