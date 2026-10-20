主线：一／二／三／四；客户端体验、第二次修改与交付
改变的建议：[研究] 图中文字二改先比较生产表示与导出维护，再扩语言； 先复用原生组件，再按具体症状补输入、运动、呈现和资源／平台更新责任；以可控、可读及旧内容兼容判断取舍。 插值成为热点时按观察尺度筛选呈现，保留模拟与入屏所需数据；掉帧先验证固定降采样的收益，再选择动态分辨率或改内容。 重复内容按机械转换、项目参数与专门作者语义分流，不因重复次数自建整套工具。
新证据：[一手／社区] 2026-10-20补发行诊断；接收返工前置实际采集检查、追加SentryUE1.25.0差异，保留旧源码与Factorio／osu证据； 官方契约、固定源码、修复链与不同作者案例支持有条件选择；具体版本、反证和许可见各节，尚无本项目引擎或玩家实测。 2026-10-17补OpenRCT2发行源码／试玩回执与VVVVVV屏外取样修复，不把少处理对象写成已测性能收益。 2026-10-19补NITW语法／本地化链与Yarn声明生成维护反证，历史制作和当前工具能力分开。

# WP10：客户端模块怎样在第二次修改后仍然可靠

证据核实：2026-10-13—15 UTC；动态 UI、模拟输入、本地多人及手柄反馈补核为 2026-10-16 UTC+8，混用边界补核为 2026-10-17 UTC+8；各节保留版本和日期。[一手] 为官方契约／固定源码／作者报告，[社区] 为原帖，[研究] 为推导。全文未安装付费插件，未开展游戏、引擎、模型、设备或玩家实测；源码与作者数据不等于本项目复现，也不证明本项目性能、体验或 AI 净收益。仓库离线检查、算术核对及特殊验证限制按各节记录区分。建议落点为 [客户端核心模块](../../domains/game-dev/04-client-modules.md)。

**[研究] ✅ 默认复用成熟组件；仅补项目缺少的所有权、迁移和模式切换规则。** 先验场景取消、释放、旧档、暂停与设备峰值，再决定是否加框架；无同任务实测，不作质量／性能排名。

分册导航：[运动与视听反馈](wp10-motion.md)；[输入、UI 与内容](wp10-content.md)。本页保留生命周期、预算与验证研究；链接标题保留旧锚点，点击直达迁出原文。仅结构拆分，未新增实测。

## 1. UniTask：新增自动释放为何仍不能等同完整取消

**[一手] 固定源**：`Cysharp/UniTask@a77a1b4a89824fb6df293099de3060daf2a432c1`，commit API：2026-10-06；MIT，[LICENSE](https://github.com/Cysharp/UniTask/blob/a77a1b4a89824fb6df293099de3060daf2a432c1/LICENSE)。活动日期不代表推荐稳定版。

[一手] 已读完整 [AddressablesAsyncExtensions.cs](https://github.com/Cysharp/UniTask/blob/a77a1b4a89824fb6df293099de3060daf2a432c1/src/UniTask/Assets/Plugins/UniTask/Runtime/External/Addressables/AddressablesAsyncExtensions.cs)，关键路径：

1. [一手／研究] `ToUniTask<T>`（267–294）先判 token，后查 handle／IsDone，再注册 source；LoadAssetAsync 后传预取消 token，即使 true 也不自动释放既有 handle。
2. [一手] `WithCancellation`／`ToUniTask` 两族默认 `autoReleaseWhenCanceled=false`；成功不建立长期所有权，最终不用仍需 release。
3. [一手／研究] `Create`、`MoveNext`、`HandleCompleted` 分别处理立即注册、PlayerLoop 取消和完成；`cancelImmediately` 只改变观察时机／注册成本，不保证后台终止或跨线程安全。
4. [一手／研究] [PR #521](https://github.com/Cysharp/UniTask/pull/521) 提议取消时 release，评审指出立即取消遗漏／无效句柄退订风险；[PR #536](https://github.com/Cysharp/UniTask/pull/536) 为免破坏调用者改加可选 flag，[2.5.2 发布记录](https://github.com/Cysharp/UniTask/releases/tag/2.5.2) 列出两者。所有权须显式约定，不据此认为全部竞态已修。
5. [社区] [#649 原帖](https://github.com/Cysharp/UniTask/issues/649) 两人报告：取消 A 后复用 source，A 迟到 callback 使 B await 返回 A 资源；2025-08 stale 关闭为 not planned，未见修复。
6. [一手／研究] `MoveNext`（441–457）取消；`GetResult`（402–418）通常回池；`TryReturn`（467–475）清 core／handle 却未退订旧 Completed；`HandleCompleted`（372–399）读取完成参数。静态结构支持 #649 风险，未复现，业务 guard 不能证明库内串线已修。

**采用判断**：[研究] PlayerLoop／组合等待需求可继续评估 UniTask。高频 Addressables 取消先用不提前取消底层 await 的完成清理，或固定包复测／修复适配器；generation guard 防旧场景写入，却不保证 B 未收到 A。

**未来测试**：覆盖预取消前已创建 handle、取消同帧完成、A 取消后 B 复用且 A 先完成、两种 autoRelease／cancelImmediately、成功／失败／缓存同步完成及共享获取；核结果身份、完成／释放次数和消费方代次。

### 异步选型的窄比较

[研究] 采用判断；链接指向对应一手机制。

| 候选 | 本轮判断 | 契约／接入成本 |
|---|---|---|
| 项目已有 Coroutine／原生 Completed | ✅ 有限加载／简单演出默认保留 | 不引第三方依赖；取消消费者和操作收尾仍要分开，宿主消失后不能丢失资源所有者 |
| Unity Awaitable | ✅ 原生 API 等待可采用，不要求为了统一语法重写所有现有异步 | [6.3 官方说明](https://docs.unity3d.com/6000.3/Documentation/Manual/async-awaitable-introduction.html)指出实例池化，同一实例不能 await 两次；不可将它当可随处共享缓存的 Task |
| UniTask | 🧪 明确需要 PlayerLoop、组合等待、减少现有适配代码时采用；Addressables 高频取消单独验收 | MIT，具备丰富适配；承担额外版本组合和上述取消／池复用边界，不以“零分配”宣传推断目标游戏无 GC |
| .NET Task | ✅ 对真正后台／I/O 工作和已有 Task API 按原生契约使用 | 多消费者场景与 Awaitable 不同；不能让 Task.Run 内访问 Unity 对象，也不能把后台线程完成当主线程资产可用 |

[研究] 已有方案无正确性或 profiler 缺口就保留；允许必要互操作，不为统一语法迁移。

## 2. Unreal 反证：文档承诺与具体版本缺陷分开

[FStreamableHandle API](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/FStreamableHandle)：CancelHandle 立即 release，以取消替代完成回调，延迟队列也应停止；ReleaseHandle 仅移除持有关系。[一手]

[UE-207209](https://issues.unrealengine.com/issue/UE-207209) 的同帧 A／B 互相 CancelHandle 测试报告：已排队时完成与取消都可能发生。状态／影响版／目标修复见阶段 F 表，不能推定 5.8 必现或已修。[一手]

[UE-208804](https://issues.unrealengine.com/issue/UE-208804) 记录加入 bundle 时 ChangeBundleStateForPrimaryAssets 重启 pending load；两次优化曾因泄漏、菜单驻留／同步加载回退。状态见阶段 F；复用 pending load 仍受所有权与批量句柄约束。[一手]

**改变建议**：[研究] 两引擎均验结果至多接受一次、场景有效及重入。UE 合并加载／动态 bundle 先验暂停、重开、菜单切换与驻留，再考虑全局缓存。

### 资源所有权补比：Load 与 Preload 不能共用退出政策

核实：2026-10-14 UTC。官方 API 标 UE 5.8；仅文档，未读受限源码。5.7 参数页未取得，不作其实现证据。[一手]

- [一手] [LoadPrimaryAssets](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAssetManager/LoadPrimaryAssets) 保留到显式卸载，句柄用于等待／查询，非保活必需；无新工作可返回 null 但仍回调。[UnloadPrimaryAssets](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAssetManager/UnloadPrimaryAssets) 仅在 Load 为唯一持有时允许释放，不保证其他引用／内存立即消失。
- [一手] [PreloadPrimaryAssets](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAssetManager/PreloadPrimaryAssets) 必须保留活动句柄；资源非正式 Loaded，普通 Unload／ChangeBundleState 不影响。释放句柄且无其他持有才可释放，退出政策不同于 Load。
- [一手] [Object Pointers](https://dev.epicgames.com/documentation/en-us/unreal-engine/object-pointers-in-unreal-engine)：`TSoftObjectPtr` 不阻止 GC；`UPROPERTY` 的 `TObjectPtr` 可持有 UObject。路径与驻留分开。

**[研究] ✅ 用原生能力补共同所有者。** Load 保持已决定内容，Preload 做可取消准备；两个菜单共用再跨场景时，逐菜单 Unload 不是消费者计数。先定共同卸载时机、核强引用与常驻成本，Preload 仍需交接收尾。

**[研究] 回归重点是第二次打开与不同退出。** 无新增工作时不能仅凭 null handle 判失败；丢弃 Load 句柄或对 Preload 仅调用 Unload 均不证明持有已撤销。未来记录完成次数、资源身份、持有来源和退出驻留，覆盖一个消费者退出、另一个仍使用。

## 3. ink：存档格式兼容，不等于剧情修改兼容

[一手] `inkle/ink@35c63e52f1d36060930dc7ed3cfba38ea224b528`，commit API 2026-05-05，1.2.1；MIT [LICENSE](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/LICENSE.txt)。已读 StoryState／Story／CallStack／VariablesState。

- [StoryState.cs](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/ink-engine-runtime/StoryState.cs)明确当前 save 版本 10、最低可读版本 8；LoadJsonObj 检查字段／最低版本，分别处理旧单 flow 和新 flows 结构。[一手]
- [CallStack.cs](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/ink-engine-runtime/CallStack.cs#L52-L83)使用存档 cPath 和 idx 恢复位置，找不到抛错，近似查找会报警；[Story.cs](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/ink-engine-runtime/Story.cs#L753-L782)的 PointerAtPath 同样有 approximate 警告路径。[一手]
- **改变建议**：[研究] 捕获 LoadJson warning，核位置、选项及已领奖励；可用稳定节点／checkpoint 迁移，任意保存点兼容与章节回退须另定。
- ink 只作叙事状态机，不为非叙事游戏引入通用存档。未核发行游戏可靠性，The Intercept 旧 jam demo 不作现代底座。

## 旧内容升级补研：保旧世界不等于放行旧模板生产

核实：2026-10-19（UTC+8）。主线三／四，GB／GC；改变04旧档选型：几何或连接规则改版，先比较迁移与受限保留旧实现，再分别决定旧模板是否继续生产、怎样与新内容混用。身份有效也可能几何不兼容，不重复导入ID建议。[研究]

**同作品的需求与淘汰。** [FFF377](https://factorio.com/blog/post/fff-377)（2023-09-22）说明Factorio旧轨连接、信号布置和硬编码限制；单加S弯会增加连接选择及手动驾驶歧义，团队改用分段曲线与新方向，并扩大曲率半径。作者报告连带更新信号、残骸、站点等图形及规划器，需人工制作和数月工作。不是换贴图，也不证明单人零手修可复现。[一手：作者开发报告] 当时计划保1.1旧档中的旧轨运行、不再新建旧轨并将来移除；下面的发行行为不能用这份早期计划代替。[研究]

**实际采用与失败边界。** [2.0.18原帖](https://forums.factorio.com/121548)（2024-11-15）中玩家只重做旧蓝图曲轨，却发现直轨也不能覆盖。boskid解释新旧轨方向／连接规则不同；某些重叠会使连接不一致，因而拒绝放宽后再修坏档。玩家提出复制时转新轨，只是提议，不写成已采用。[一手／社区] [2.0.66原帖](https://forums.factorio.com/viewtopic.php?t=130938)（2025-09-20）又报告机器人可建旧蓝图而手动不行；boskid明确旧蓝图仍能建旧形状、手动建新形状，对齐差异归为Not a bug。保留旧世界、旧模板生产、允许混建，是三种不同承诺。[研究]

**版本反证。** 固定[2.1.17数据源码](https://github.com/wube/factorio-data/blob/35b4e50206aa425d5be114373cf5ede194a98bf6/base/prototypes/entity/trains.lua)仍定义legacy-straight-rail／legacy-curved-rail，隐藏、使用旧图形、保留placeable_by，fast_replaceable_group为空。只读配置，未读闭源引擎连接算法、未运行；这足以否定“按2023预想，2.1已经删除旧轨”的断言，不保证永久支持或所有2.1运行行为。[一手／研究]

**选择与代价。** [研究] 若更新能可靠保留旧布局和行为，可做明确迁移；不能则比较保留受限旧实现，而非按相同ID强换新形状。允许旧模板继续产旧件时，也要保其依赖、连接规则和回归；不允许则提供清楚的阻止／迁移反馈，不能仅从菜单隐藏。目标是保玩家已有作品且让新建行为可理解，不是保证双版本成本更低。资源允许时先借现有版本化／迁移能力，不另建通用兼容框架。

**二改验收与撤回。** [研究] 对同一旧档分别检查恢复运行、按旧模板新建、接入新件及保存重开；明确预期允许和拒绝，不把全部加载成功当通过。保留／迁移无法守住承诺时缩小更新，或明确收窄支持范围并保留可恢复旧版资料，不静默丢进度。此处只有作者报告、玩家原帖与固定数据源码；零手修资产供应、完整工时、迁移成功率和玩家体验均未实测。既有快照、唯一原档保护、两次内容修改回归与ink warning检查继续适用。

## 4. Input System：Disable 自身会触发回调

[一手／研究] `Unity-Technologies/InputSystem@05e45ddbaf18a93245b068d787d74b738b90d01c`，commit API 2026-10-06；Unity Companion License [LICENSE.md](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/LICENSE.md)。该提交为 before-render timeout 修复端口，develop 不作稳定包。

读取 [InputAction.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Actions/InputAction.cs#L967-L986)和 [InputActionState.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Actions/InputActionState.cs#L889-L948)。DisableSingleAction 先 DisableControls，再 ResetActionState；重置会取消正在进行的 action／interaction，然后清字段。[一手]

**改变建议**：[研究] 先更新接收权限再禁 action／map，避免同步 canceled 被旧回调当松开结算。战术暂停可保部分输入；取消只清理，松开攻击区分正常完成／系统取消。

Input System 1.19 UI 文档警告：gamepad 同时驱动 Virtual Mouse 与 navigation 可重复触发；修所有权，不加任意 debounce。[一手／研究]

## 5. UI 版本纠偏：不是旧功能表的简单延长

[Unity 6.3 LTS 英文 comparison](https://docs.unity3d.com/6000.3/Documentation/Manual/UI-system-compare.html) 已列 UI Toolkit world-space、custom shaders/materials、RTL/emoji、SVG，仍不支持 Animation Clips／Timeline（uGUI 支持）；总体仍推荐 uGUI runtime、UI Toolkit editor，不能概括为全面推荐后者。[一手]

**采用判断**：[研究] 新重布局／文本 UI 可评估 UI Toolkit；稳定 uGUI／大量 keyframe UI 保留。6.0／6.3、新英文／旧译文分列，功能表不证明目标设备质量。

## 6. 许可、维护与采用边界

[一手] 许可／维护事实；[研究] 接入选择。未核实生产采用处明确保留缺口。

| 对象 | 已核实的授权与维护 | 接入／采用边界 |
|---|---|---|
| Unity 原生引擎组件／包 | 引擎受 [Unity Editor 条款](https://unity.com/legal/editor-terms-of-service/software)约束；不能统称 MIT／免费无条件。项目应锁定引擎、包版本并保留包内许可证 | 推荐官方机制，未逐包列出第三方 notices，也未部署商用工程；发布前按实际 manifest 审计 |
| UniTask | 固定 SHA、MIT，2026-10-06 有仓库活动；取消自动释放 PR 和未解决原帖已读 | 轻量适配可借用；需要所有权政策和包组合测试。本轮未独立核实指定版本在已发行游戏中的采用 |
| Input System | 固定 SHA，Unity Companion License，Unity-dependent 条件；[许可正文](https://unity.com/legal/licenses/unity-companion-license)已读 | 采用兼容的已发布包，UI vs Game Input 样例可借机制；代码不能任意跨引擎搬用 |
| Addressables-Sample | 固定 [3112f7dc](https://github.com/Unity-Technologies/Addressables-Sample/tree/3112f7dc30f30d4c118a03de9c3d7ccc56e89bb2)，2026-05-06；读取 README 和递归文件树，未发现 LICENSE 文件 | **👀 机制参考；⛔ 不将整个仓库作为已清许可的商用复制底座。** README 明说未保证／测试适用性，旧说明不作当前契约；包条款不等于示例复制权限 |
| ink | 固定 SHA 版本 1.2.1，MIT，读取运行时核心代码 | 叙事场景🧪；不替代世界存档。维护活跃和可读代码不等于本轮验证过升级语义 |
| Unreal 原生系统 | [Unreal EULA](https://www.unrealengine.com/eula/unreal)适用于引擎代码／相应 Examples；源代码可见不等于开放源码许可证 | 不在公开仓库搬整段受限引擎源码。Marketplace／Fab 内容与引擎代码可能不同许可，逐资产核查 |
| Lyra | [机制文档](https://dev.epicgames.com/documentation/unreal-engine/lyra-sample-game-in-unreal-engine?lang=en-US)定义为随引擎更新的 modular learning resource；[Fab 官方页](https://www.fab.com/listings/93faede1-4434-47c0-85f1-bf27c0820ad0)渠道标签见阶段 F 表 | **✅ 读公开 UI／输入／生命周期说明；⛔ 默认整包输入 Agent 或作为跨引擎资源来源。** 未下载项目，逐文件许可仍未确认；不作发行游戏证据或商用复制底座 |
| FMOD | [官方 licensing](https://www.fmod.com/licensing)核实：免费 Indie 条件为开发者年收入低于 $200k 且项目开发预算低于 $600k；商业项目需注册，logo 要求和 EULA 仍适用。非免费 Indie 当前 $2,000／game，需按购买时重核 | 付费与免费档均可覆盖相同主要功能，价格不作音质排序。复杂音频工作流节省超过集成／bank 成本才🧪；未安装、签约或验证生产净收益 |

**[一手／研究] Lyra 标签不等于逐文件条款。** [Epic Content License §5(c)(viii) 与 §17](https://www.unrealengine.com/eula/content) 限制所覆盖 NoAI Content 的生成式 AI 数据集、开发材料及输入用途。公开技术说明可读，不等于所有 UE 开发禁 AI；接入前核取得渠道／文件／协议，不用镜像绕过。

许可核对不替代目标项目法律审查；无购买需求时不虚构收费优胜者。

## 7. 后续真实验证矩阵

| 跨模块场景 | 输入／操作 | 必须观察的结果 | 失败时先改什么 |
|---|---|---|---|
| A 关卡切 B 后立刻返回 | 慢加载、缓存命中、失败各一组；退出前／中／完成同帧取消 | 没有旧结果写入，无双释放，B 迟到资源最终收尾；界面可返回 | 所有者／代次／取消接口契约，不先换框架 |
| Addressables adapter 池复用 | A 取消、B 开始，强制 A 比 B 先完成；依 #649 组合 flags | B 的结果 ID 必须是 B，完成／释放各一次 | 版本级适配器复现／修复或不用提前取消等待；业务 guard 不能掩盖错结果 |
| 暂停＋UI＋音频 | 按住移动／蓄力时暂停，手柄换设备，失焦再回来 | 角色不漂移、不发射一次“幽灵攻击”，UI 可导航，按政策暂停音频／DSP | 输入权限切换顺序、canceled 重入、独立时间域 |
| 资源所有权 | 两个关卡共享纹理，池对象反复复用，开关同一 UI | 获取／释放对称，池归还取消旧工作，多轮稳定；允许正常缓存但要解释峰值 | bundle 组合与寿命，不先调用全局卸载／GC |
| 存档第二次修改 | V1 保存→V2 改字段／删除道具→V3 改剧情位置 | 明确迁移／拒绝／恢复，进度与奖励不重复，旧档保留 | 内容 ID／版本策略；不要只修 JSON 反序列化 |
| 最低设备满负荷 | 冷启动、首次特效、峰值战斗、切场景时保留必要共享资源 | 在事先约定帧时间和内存范围内；无漏 shader／静音／读取卡顿 | profiler 所证瓶颈，减少资源和并发预算优于全局新框架 |
| 干净发行构建 | 无编辑器／本地缓存条件，断网，存储失败，目标输入与语言 | 首次可玩、关键路径可达、失败反馈可理解、许可清单完整 | 构建资源清单／目标平台差异，不以模拟测试遮掩 |

[研究] 轮数由稳定性、竞态覆盖和可重复结果决定；自动化核资源身份、状态及性能，人验视听质量与翻译。

## 8. 自检、反证和剩余工作

### 任务书覆盖

[研究] 11 个模块的建议在 04 维护；本页留证据、反证与跨引擎边界。

### 能推翻推荐的条件

- 如果目标版本／目标设备的竞态和内存测试通过，且组合等待明显减少维护负担，可扩大 UniTask 使用；当前没有证据全面禁用它
- 若模板覆盖绝大部分实际玩法、许可及 Agent 输入范围清楚，且第二次修改成本更低，可重评整包底座；“官方”或“源码可见”本身不够
- 若原生音频制作成本超过中间件接入／bank／授权成本，可采用 FMOD；没有听验和制作成本，不能宣布它是音质升级
- UI Toolkit／uGUI 按实际引擎版本、关键帧动画、布局和可访问性重新判断；旧翻译页与新英文功能表不能混成同一基线

### 下一项有价值的验证

[研究] 优先固定包验证第 1 节 A／B 复用与第 7 节旧档矩阵；真实引擎试验待授权。

[Unity 6.3 协程文档](https://docs.unity3d.com/6000.3/Documentation/Manual/Coroutines.html)：GameObject 失活／宿主销毁停协程，`MonoBehaviour.enabled=false` 不停。池回收须按实际停用方式约定。[一手／研究]

### 实际验证状态

- **已核资料**：固定 SHA、源码／许可、修复链、原帖和官方问题状态；未核生产采用之处保持缺口
- **待项目决定**：目标玩法／设备、旧档回退承诺、视听质量及许可适用性
- **历史仓库检查**：完整离线 14 阶段、非空且无 skip，`git diff --check` 与空白检查通过；仅覆盖文档／配置／夹具，不代表引擎或 hosted CI

## 阶段 F 动态状态补核

2026-10-14 重读以下官方正文；建议 2026-11-14 或升级／取得样例前复核。固定源码与历史修改链不重算，也不将公开问题状态当本项目复现结果。[研究]

| 动态事实 | 本次核实与一手来源 | 对采用的影响 |
|---|---|---|
| 加载取消／重启问题状态 | [UE-207209](https://issues.unrealengine.com/issue/UE-207209)仍 Backlogged，Affects 5.0／5.5、Target Fix 6.0、更新 2026-07-28；[UE-208804](https://issues.unrealengine.com/issue/UE-208804)仍 Backlogged，更新 2026-09-14 | 保留同帧回调与 bundle 重启回归；目标修复版不是已发布修复，也不据影响列表断言其他版本必现 |
| Lyra 渠道标签与许可缺口 | [Fab 官方商品页](https://www.fab.com/listings/93faede1-4434-47c0-85f1-bf27c0820ad0)仍写 UE-Only、Allows usage with AI: No；本次提取的 License terms 字段为空 | 保留读公开机制说明；不默认整包交给 Agent 或跨引擎复用。商品标签不是逐文件授权链，具体取得协议仍未闭合；WP11 同样适用 |

[研究] 样例文件许可与目标版本修复证据仍缺。

## [体验质量深化：响应与顺滑，让同一个动作值得反复玩](wp10-motion.md#1)

### [1. 四类时间问题不能用同一种“平滑”处理](wp10-motion.md#2)

### [物理查询补研：刚改位置不等于物理查询已看到新位置](wp10-motion.md#3)

### [2. 具体动作的体验和生产成本](wp10-motion.md#4)

### [3. 可借用的优秀实现，以及不能带走的东西](wp10-motion.md#5)

### [4. 作者复盘与研究能支持多强的结论](wp10-motion.md#6)

### [5. 下一步验证和本轮交付边界](wp10-motion.md#7)

### [联网反馈补研：先分动作预反馈与确认结果](wp10-motion.md#8)

## [3D 运动补研：控制精度、接触连续性与物理重量的取舍](wp10-motion.md#9)

### [1. 先按期望运动选，不能只按组件名字选](wp10-motion.md#10)

### [2. 三份许可清晰的实现：同样叫 controller，接触政策不同](wp10-motion.md#11)

### [现成 motor 补比：先借已有平台机制，再决定补什么](wp10-motion.md#12)

### [3. root motion 与混合路线：一个最终位移所有者](wp10-motion.md#13)

### [4. 升级、撤回与未来验收：以玩家感到的差别为准](wp10-motion.md#14)

### [5. Unreal 对照：同样的动作，不同的引擎责任](wp10-motion.md#15)

## 首发帧时间补研：从资源已加载到动作可见

核实：2026-10-14 UTC。主线 3／4；将首发热点细化为遭遇准备、可见反馈与驻留成本。依据 Unity 6.3 PSO／加载／池 API、Epic PSO 文档及 Tom Looman 的 Windows DX12 样例 trace。[一手／研究]

### 1. 先定义要保住的动作，再选择把工作移到哪里

[研究] 首次进房／技能应分别准备资产、实例、上传与绘制；输入缓冲、插值和池化各不能兜底 PSO。只准备下一遭遇必要内容，关键预警与伤害保持一致；装饰可降级，必要时明确延后遭遇。

### 2. Unity 6.3 原生选项与不能互换的承诺

- [一手] [PSO introduction](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-pso-introduction.html)：GraphicsStateCollection 自 Unity 6，6.3 仍 experimental 可变／移除；DX12/Vulkan/Metal 用图形状态，DX11/OpenGL/OpenGLES/WebGL 回退 warmup；不兼容 compute／ray-tracing tracing。
- [一手] [Other warmup methods](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-prewarm-other.html) 不推荐 DX12/Vulkan/Metal 用旧 WarmUp／WarmupAllShaders，缺 graphics states 可建错 PSO；变体名单不代表绘制状态覆盖。[研究]
- [一手] [Trace and manage](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-pso-trace.html) 要按平台／API 采集，改 shader 后可追加 trace。[研究] 新画质／keyword／pass 需补覆盖，ContainsVariant 不证明实际状态齐全。
- [一手] [裁剪说明](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-variant-stripping.html)：裁掉变体可回退近似，运行时 shader_feature 亦有遗漏；[严格变体匹配与构建日志](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-how-many-variants.html#highlight-missing-shaders) 暴露缺变体／keyword 及裁剪过程。[研究] 二改先在目标后端严格匹配测试修入包，再补 PSO；预热补不回代码，无错也只覆盖执行组合，冷首发另测。
- [一手] [Warm up PSOs](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-prewarm.html) 提供 WarmUp／WarmUpProgressively（按 PSO 数量）并回 job handle；定位 marker 为 Shader.CreateGPUProgram／CreateGraphicsGraphicsPipelineImpl。[研究] 数量非毫秒保证，战斗同步等仍可卡；首次创建确为热点且加载成本可接受才采用。
- [一手] [Application.backgroundLoadingPriority](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-backgroundLoadingPriority.html) 分后台读／反序列化与主线程 integration，Editor 不生效；Low/BelowNormal/Normal/High 为 2/4/10/50 ms，可看 Application.Integrate Assets in Background。非整帧或全部初始化上限，High 读条快不保证游玩适合。[研究]
- [一手] [Texture and mesh loading](https://docs.unity3d.com/6000.3/Documentation/Manual/LoadingTextureandMeshData.html) 将 binary 上传跨帧；[资格页](https://docs.unity3d.com/6000.3/Documentation/Manual/LoadingTextureandMeshData-make-compatible.html)：纹理非 read/write、非 Resources，Android 要 LZ4；LoadImage 强制同步，网格另有 bone weights／BlendShapes 条件。[asyncUploadTimeSlice](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/QualitySettings-asyncUploadTimeSlice.html) 只调上传，非 backgroundLoadingPriority。[研究] 不为资格删玩法 CPU 数据／形变，先权衡提前加载或降规格。
- [一手] [allowSceneActivation](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AsyncOperation-allowSceneActivation.html)=false 时停 0.9、isDone=false 并阻 AsyncOperation 队列，随后卸载也不能运行。[研究] 不能等队列后卸载腾内存再激活；计入旧场景／新数据／预热并存峰值，激活门不分摊 Awake/OnEnable。

### 3. 池化与 GC：提前付费的范围必须有上限

[一手] [ObjectPool 构造参数](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Pool.ObjectPool_1-ctor.html)：defaultCapacity 仅存储容量，空池才 createFunc，maxSize 限闲置保留、满池归还销毁。[研究] 容量不证明预创建或玩法并发上限；Get/Release 立即归还可能只反复用一件。核独立实例数，明确耗尽时创建／复用装饰／拒绝可选，不能丢关键弹体。

[一手] [Pooling and reusing](https://docs.unity3d.com/6000.3/Documentation/Manual/performance-reusable-code.html) 要求复用重置且非线程安全；[GC overview](https://docs.unity3d.com/6000.3/Documentation/Manual/performance-garbage-collector.html) 不回收仍被引用对象。[研究] 池也持资源／原生成本，零 GC.Alloc 不等于低驻留；按遭遇释放，核托管／原生／GPU。

[一手] [GC modes](https://docs.unity3d.com/6000.3/Documentation/Manual/performance-incremental-garbage-collection.html)：增量分摊而非少做，引用频变可回退完整收集，关闭有堆增长风险。[研究] 先修热分配、按需有界池；PSO 热点不靠全局关 GC 解决。

### 4. Unreal 对照与实际开发者反证

[一手] [PSO Precaching](https://dev.epicgames.com/documentation/unreal-engine/pso-precaching-for-unreal-engine) 标 UE 5.8；component 在 PostLoad 收集异步编译，未完可延 proxy、默认材质或阻塞绘制；驱动缓存首取仍有成本，留更多 PSO 增内存。[研究] 原生自动优先，仍验关键反馈／线程竞争；当前请求完成不保证未来未加载技能覆盖。

[一手：作者实作] [PSO 文章](https://tomlooman.com/unreal-engine-psocaching/) 为 Windows DX12 Action Roguelike／Project Orion，图示一项 54.1 ms 编译。5.3 缺 decal 用 bundled＋automatic，更新说明 5.6 已覆盖 UDecalComponent；要求冷缓存同动作，并记 2025-09 NVIDIA 扩展变化使旧清缓存开关失效。[研究] 非独立同硬件对照，不用转述 Fortnite／课程宣传预测收益。

**[研究] 采用与撤回**：✅ 锁版本使用原生 automatic precaching；🧪 trace 证实遗漏才补 bundled cache。关键预警提前准备；预算不足就缩首场内容／材质组合，不能靠跳绘关键提示换顺滑。

### 5. 第二次修改的未来验收设计

[研究] 预注册新增不同材质／keyword／渲染状态技能，允许进房立即施放，并保留旧技能基线：

1. 区分冷驱动缓存、同进程重复和重启保留缓存；未来仅在获准环境清缓存，并确认引擎／驱动实际生效。
2. 对照输入接受、首个动作／预警／技能反馈及伤害时刻，归因 CPU／GPU／等待长帧；软件 marker 不代表光学端到端延迟。
3. 比较无准备、遭遇范围及必要扩大范围的耗时、反馈、长帧、活动／闲置实例、峰值与离场留存；准备迟于必用时刻同样失败。
4. 换画质／后端重查覆盖，退出重进核池重置及预热误触发的声音／伤害／奖励；装饰降档不得改关键提示窗口。

[研究] Unity 实验 API 的目标补丁兼容性待验；54.1 ms 仅是作者 trace。

## [菜单补研：跨暂停、改键与设备切换保住控制](wp10-content.md#16)

### [1. 先补玩家体验缺口，不因手柄支持迁移 UI](wp10-content.md#17)

### [2. 原生机制够用的条件与新增成本](wp10-content.md#18)

### [3. 先读可复用实现：官方 UI vs Game Input](wp10-content.md#19)

#### [混用补核：提示变化不等于退出 UI](wp10-content.md#20)

#### [输入交接补比：消费按下不等于等待松键](wp10-content.md#21)

### [手柄反馈补研：结束、暂停与设备交接分开核](wp10-content.md#22)

### [本地多人补研：设备配对与 UI 目标范围分开核](wp10-content.md#23)

#### [Unity：玩家动作、设备与 UI 选择分别落到实例](wp10-content.md#24)

#### [Unreal：输入映射、UI 所有者、焦点和显示范围分别确认](wp10-content.md#25)

### [模拟输入补研：轻推幅度与处理链不能丢](wp10-content.md#26)

### [4. 用第二个菜单判断共享层是否值得](wp10-content.md#27)

### [5. 暂停叠加与转场：关闭一层不等于恢复整局](wp10-content.md#28)

### [6. 背包负担：改交互还是改携带规则](wp10-content.md#29)

## [存档复用补比：序列化、落盘与玩家恢复分开选](wp10-content.md#30)

### [1. Mindustry：实际游戏把格式、内容映射与文件恢复分开](wp10-content.md#31)

### [2. Thrive：类名存在，不等于迁移器仍适用于新格式](wp10-content.md#32)

### [3. 原生、开源序列化库与商业候选怎么取舍](wp10-content.md#33)

### [4. 最小实现边界与后续验收](wp10-content.md#34)

### [5. 续玩不等于撤销失败](wp10-content.md#35)

### [6. 保存响应：把捕获、序列化与写入分开判断](wp10-content.md#36)

## 呈现节奏补研：平均 FPS 与实际看到的动作不是同一个承诺

核实：2026-10-14 UTC；主线 3／4。高 FPS 不顺还需查呈现同步、排队与限帧。依据 Factorio 复盘、osu! 固定等待实现与 2026 讨论、Unity 6.3／UE 5.8 契约、缺陷与 Mir 2 部署报告。[一手／研究]

### 1. 真实游戏：先辨认问题，不因理论最优重写架构

[一手：作者实述] posila [说明](https://forums.factorio.com/viewtopic.php?p=415072)（2019-03-19）：Factorio 迁 DX11 时帧间隔 14–18 ms、均值 16.67，显示 59.95 Hz 导致逐渐错位／重复／丢帧，故改默认 VSync。效果含观察／理论，非跨设备对照；近 1.0 时拆更新／绘制要改准备数据，成本不可接受。

[研究] 工作少不代表按时显示；接近发行可选有界原生修正。本例仅 0.17／当时 Windows 路径，同帖 G-Sync 猜测不作现行配置指南。

### 2. 原生设置必须按平台读，实际帧率不能从目标推定

[一手] Unity 6.3 [Application.targetFrameRate](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-targetFrameRate.html)：桌面 VSync 非零忽略 target，软件限帧可 microstutter；Android/iOS 反而忽略 vSyncCount，XR 由 SDK 控制。[研究] 桌面建 VSync 基线，移动选可持续 pacing，不作竞技／VRR 普遍最优。

[一手：部署报告] [Mir 2 案例](https://developer.android.com/stories/games/swappy)（更新 2025-02-06）：Unity Mir 2 启 Optimized Frame Pacing 后，20 FPS 门槛 Slow Session 由 40%→10%。[研究] 非均 FPS／延迟／满意度或四倍性能；控制／样本不足，亦非单人制作证明。

[一手] [UE 当前移动 Frame Pacing 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/frame-pacing-for-mobile-devices-in-unreal-engine) 标 5.8：Android Swappy 自 5.2 默认，支持 Device Profile 及目标档查询。[研究] 不抄 4.25 再造插件，主要维护档位、升级／回归。

**版本反证。** [一手] [Unity UUM-68029](https://issuetracker.unity.com/issues/8340/applicationsettargetframerate-different-results-when-optimized-frame-pacing-is-used)：pacing 开关使用不同取整，6000.7.0a4 Fixed、6.3.X 等 Won’t Fix。[研究] 对照须记实际帧率／刷新率以免换了工作档；不据此禁 pacing 或荐 alpha。

### 3. 降排队延迟有代价，不能把最低数值当最好

[一手] UE 5.8 [Low-Latency Frame Syncing](https://dev.epicgames.com/documentation/en-us/unreal-engine/low-latency-frame-syncing-in-unreal-engine)：game/render 同步未必紧随呈现；r.GTSyncType 选 render/RHI/swap-chain。减 rhi.SyncSlackMS 缩排队却更易错过长帧，模式 2 无支持则退 1。

[研究] 🧪 排队确为主要问题才评估，对照响应与长帧并保原配置；30 Hz 示例不作目标，不全局禁用 `r.OneFrameThreadLag` 或将 slack 归零。旧并行渲染背景不证明当前平台默认状态。

### 4. 开源反证：不要重复修复早已存在的等待实现

[一手] osu-framework 固定提交 `2140bf7dae73a6389ffea01f81319a39392c8ef1`：

- [ThrottledFrameClock.cs](https://github.com/ppy/osu-framework/blob/2140bf7dae73a6389ffea01f81319a39392c8ef1/osu.Framework/Timing/ThrottledFrameClock.cs)选择平台原生等待，测实际睡眠、累计误差，并限制负误差以避免过多追赶帧。
- [WindowsNativeSleep.cs](https://github.com/ppy/osu-framework/blob/2140bf7dae73a6389ffea01f81319a39392c8ef1/osu.Framework/Platform/Windows/Native/WindowsNativeSleep.cs)先尝试高精度 waitable timer，失败时回退普通 timer，原生等待失败再由调用者回退 Thread.Sleep。
- 同 SHA [LICENCE](https://github.com/ppy/osu-framework/blob/2140bf7dae73a6389ffea01f81319a39392c8ef1/LICENCE) 为 MIT；已读 raw，未运行，不证明商用引擎兼容。

[一手：维护讨论] [#6719](https://github.com/ppy/osu-framework/discussions/6719)（2026-03-11/12）建议 timer/busy wait，维护者指出已有原生 timer、试过混合而认为不值；报告者承认未完整读码，并分长停顿／普通误差。仍 Unanswered，非合入修复。

[研究] **⛔ 不移植该限帧器到 Unity／UE。** 商用引擎拥有自己的同步；叠加 Sleep／spin 增加节奏与功耗成本。只借检查原生等待／回退的做法，忙等未必解决驱动与显示队列。

### 5. 使用已有观测工具，避免再建 FPS 仪表盘

[一手] [PresentMon 官方 README](https://github.com/GameTechDev/PresentMon/blob/main/README.md) 用 Windows ETW 取 CPU/GPU/Display 时长／延迟；[Console 文档](https://github.com/GameTechDev/PresentMon/blob/main/README-ConsoleApplication.md) 的 DisplayedTime 对未显示可 NA，区别 DisplayLatency。OpenGL/Vulkan instrumentation、HWS 时序有精度边界，零非无等待；仅 main 文档，未锁发行／采集。

[研究] 🧪 后续先用引擎 Profiler，呈现仍异常再评估 PresentMon；先核权限／字段，不自动改系统。端到端光学测量另需设备。

### 6. 下一次修改的最小验证设计

[研究] 固定同一段横向移动／连续转向／一次瞄准攻击，先用已经准备好的资产排除首发路径；第二次修改加入新的画质档或支持另一刷新率。

1. 记录引擎版本、后端、窗口模式、实际刷新率、实际帧率、VSync／pacing／外部限帧状态，先避免多个 limiter 同时作用。
2. 比较同一路径的帧间隔分布、持续长帧位置、未显示帧和首个可见反馈；分清工作耗时、等待与显示间隔。
3. 在持续负荷、暂停恢复及改变窗口／刷新率后复测；移动端同时看热降频后的持续表现，不只刚启动几十秒。
4. 人确认轨迹是否均匀、瞄准是否跟手；若改善一项明显损伤另一项，保留原设置并收窄采用范围。

[研究] commits API 遇公开 rate limit，已读固定 raw；PresentMon 未运行。

### 7. 帧生成：增加呈现帧，不增加一次业务更新承诺

核实：2026-10-16 UTC+8；主线二／三。基础响应合格、呈现密度不足才评估帧生成；依据 FSR API、UE 4.1.1 插件与 Streamline v2.14.1，先定 HUD 合成／更新责任。[研究]

**计数与模拟分开。** [一手] [Streamline v2.14.1 DLSS-G 指南](https://github.com/NVIDIA-RTX/Streamline/blob/v2.14.1/docs/ProgrammingGuideDLSS_G.md) §13 分 application frame／numFramesActuallyPresented，生成帧可丢；§8 要 Reflex marker/constants 同帧号；§5.1 规定 HUD-less、alpha／预乘色尺寸与合成；§6.4/12 菜单／窗口按条件停，§14 异常关闭修复。[研究] 分记应用渲染、呈现和输入／模拟，不由 FPS 算业务 delta，基础耗时也可能变。

**三种 UI 合成。** [一手] [FSR Frame Generation API](https://gpuopen.com/manuals/fsr_sdk/techniques/frame-interpolation-api/)：presentCallback 逐真实／生成帧绘制；独立 surface 合两者但仍 render rate 更新；HUDLessColor 为兼容。未双缓冲时 Present 后纹理仍可能在读；Prepare/Configure frameID 相同逐帧加一，delta 为毫秒。[Swapchain 3.1.7](https://gpuopen.com/manuals/fsr_sdk/techniques/frame-interpolation-swap-chain/) 提醒回调小工作量。[研究] 需重绘才拆绘制／业务，保纹理寿命，不逐生成帧推进玩法。

**UE 的具体副作用与版本边界。** [一手] [AMD FSR UE 指南](https://gpuopen.com/learn/ue-fsr/)正文标 4.1.1、2026-08-27，支持 UE 5.3–5.8：

- Slate Redraw（UIMode=0）为正常／生成帧重绘，文档说会两次调用 NativeTick；第二次 delta-time 默认是零，禁用 ModifySlateDeltaTime 才改变这项处理。
- 使用 DX12 swapchain override 的 UI Extraction（UIMode=1）从 UI 前后图像提取界面，不双 tick，但半透明 UI 可能变差；AllowAsyncWorkloads 会自动选此模式。不能只为吞吐打开异步而不重查 HUD。
- UpdateGlobalFrameTime 可使 GAverageMs／GAverageFPS 使用帧生成统计。当前插件允许帧生成独立于 FSR Upscaling；[旧 3.1.4 插件指南](https://gpuopen.com/learn/ue-fsr3/)则要求该上采样组件，不能混用教程。

[研究] 零 delta 仍可能触发按次数累加／发事件，须核 widget 副作用；双 UI tick 不等于双模拟。指南称 RHI backend 已移除，CVar 表却仍列 fallback，故不推荐该路径。

**Unity 支持另核。** [一手] [HDRP 17.3.0 DLSS](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@17.3/manual/deep-learning-super-sampling-in-hdrp.html) 为 DLSS 4.5 Super Resolution；[NVIDIA 开发入口](https://developer.nvidia.com/rtx/dlss) 的 Unity 仅列 SR，UE 明列 MFG/Dynamic MFG。[研究] 这些入口未建立 Unity 帧生成／UI 契约，非证明不可能；无需求不默认接入。

**采用与撤回。** [一手] [AMD 当前 Frame Generation 页面](https://gpuopen.com/amd-fsr-framegeneration/) 建议插值前 ≥60 fps、避免 <30，限厂商实现。[研究] 未来固定上采样／画质，分切帧生成与 UI；二改加动态数值／半透明，验急转、暂停、改窗下可读性、更新次数及实际反馈／呈现。HUD 失真、重复副作用或超响应预算，修不好即撤回。

## [本地化补研：新语言与旧名字一起维护](wp10-content.md#37)

### [1. 发行游戏的修复指向旧内容与资源寿命](wp10-content.md#38)

### [2. 官方输入样例可借机制，未交付完整本地化](wp10-content.md#39)

### [3. 字体优化随内容更新，不把 ATG 当无成本开关](wp10-content.md#40)

### [4. 保留与否及证据边界](wp10-content.md#41)

### [5. 旧报告重译：保留消息含义，而非只存渲染结果](wp10-content.md#42)

### [6. 新增语言的显示、编辑和布局不能互相代验](wp10-content.md#43)

### [7. 完整长文可达性与字体默认值的撤回](wp10-content.md#44)

## [音频并发补研：保住起音不等于保住每次提示](wp10-motion.md#45)

### [1. 真实游戏的历史改动与依赖链](wp10-motion.md#46)

### [2. 三道门控及不能省略的反例](wp10-motion.md#47)

### [3. Unity／Unreal 只复用相关机制](wp10-motion.md#48)

### [4. 最小采用与未来验收](wp10-motion.md#49)

### [5. 持续状态声的反例：先校正可听范围与恢复政策](wp10-motion.md#50)

### [6. 警报已听清却判断错：先改触发语义](wp10-motion.md#51)

## [运动可读性补研：关键提示不能靠历史积累补成另一个位置](wp10-motion.md#52)

### [1. 先区分输入错误、支持边界与积累取舍](wp10-motion.md#53)

### [2. 固定实现：不能抄反参数方向，也不能把最高档当辨识保证](wp10-motion.md#54)

### [3. 可比较方案与撤回条件](wp10-motion.md#55)

### [4. STP 对照不能只看相机菜单](wp10-motion.md#56)

### [5. 历史反例：实际修复与当前限制分开](wp10-motion.md#57)

### [6. 后续获准验证与二次修改](wp10-motion.md#58)

## 验证选择深化：状态、输入与体验各自需要什么证据

核实：2026-10-15（UTC+8）；主线一／三。校正 game02 验证阶梯、首日全接口和“手感不可计算”，依据输入后端、暂停时钟、截图契约及作者完整试玩记录。[研究]

### 1. 采用与撤回

[研究] ✅ 按事实选入口：规则用确定性测试，生命周期进运行时，绑定／焦点走输入系统，设备／OS 用目标设备，连续视听与体验由实际观察判断。撤回首日全接口和固定“至少两个异常”，按风险选择动作链。

### 2. 本次读取的新一手契约

- Unity [Input testing 1.19](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/Testing.html)：自动输入可脱离平台后端与物理设备；InputTestFixture 提供空白隔离系统，启动代码里的自定义注册也不会自动存在。可检查绑定与动作交互，初始化差异和硬件链另验。[一手＋研究]
- UE 5.8 [Automation Driver](https://dev.epicgames.com/documentation/en-us/unreal-engine/automation-driver-in-unreal-engine)：替换 Core 输入接口实现，启用时阻断几乎全部平台输入并注入模拟输入；公开 API 不依赖 Slate，但现成定位器针对 Slate，当前动作是键鼠，控制器／触摸列在未来能力。同步 API 不得在 GameThread 运行。仅覆盖引擎侧模拟，不证明 OS 外设链可靠，也不据此新装框架。[一手＋研究]
- [Roblox Studio MCP](https://create.roblox.com/docs/studio/mcp)：playtest 子 Agent、Client／Server Luau、状态／日志／截图、键鼠模拟与 character_navigation 分别存在，各调用指定 studio_id。这些入口不证明键鼠走 OS，角色导航不代验玩家控制。[一手＋研究]
- [Unity CLI release notes](https://docs.unity.com/en-us/unity-cli/release-notes)当前页顶部 beta.13（2026-10-07），beta.12 段说明 Play 状态附带 frameCount／playerLoopTicking；[timeScale](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-timeScale.html)与 [unscaledDeltaTime](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-unscaledDeltaTime.html)表明不同更新路径的时钟不等价。[UE FTickFunction](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/FTickFunction)明确 bTickEvenWhenPaused 控制暂停时 Tick。帧推进不证明指定玩法／物理推进；暂停同时核世界、UI 与动作缓冲。[一手＋研究]
- [UE Screenshot Comparison](https://dev.epicgames.com/documentation/en-us/unreal-engine/screenshot-comparison-tool-in-unreal-engine)：提供误差容忍及关闭 TAA、运动模糊、SSR、曝光等降噪选项。可做固定图像回归；检查时域拖影须保留相关效果并连续观察，否则会改变被测对象。不据此新增视觉框架。[一手＋研究]

### 3. 原案例反证与可借用质量机制

[一手] 重读 [Schomay 原文](https://blog.jeffschomay.com/letting-ai-play-my-game)：作者的文字／回合制游戏采用外层文本状态和合成事件；公开轨迹显示解开笼子后仍不能移动，清除 state.caged 后坐标改变；末尾也说人工又发现 bug 和 feel 问题。[研究] 保留作者结果，撤回“这类 bug 单元测试通常发现不了”：退出状态后的下一动作可由规则测试或真实事件回归断言。原文无测试体系对照，不证明某类测试无效。

[研究] 沿用 Celeste／Celeste64／Deepnight 固定证据及反证，借动作条件和可切换反馈。AI 查时序、窗口、状态与帧时间，人判公平、力度、清晰度及长期体验；整体乐趣无自动合格分。

### 4. 范围与后续

[研究] game02 二改以暂停／设置加入蓄力为例，先定政策再选验证入口；沿现有 fixture 记录版本、动作与预期，不另建测试服务。

[研究] 历史验证：完整离线 14 阶段（97／26／10／13／14 项，非空无 skip）及 `git diff --check` 通过；独立审未发现本节／game02 的事实或决策问题。入口旧阶梯须整合端同步，检查不覆盖引擎／设备／玩家。


## [像素网格补研：低速步进不是物理插值失效](wp10-motion.md#59)

### [1. 两位作者的方案为什么不能互相代替](wp10-motion.md#60)

### [2. Unity 原生能力：能对齐像素，不替玩家决定取舍](wp10-motion.md#61)

### [3. 后续验证与撤回条件](wp10-motion.md#62)

## [信号取舍补研：呈现设置保住玩法信息，辅助规则另有承诺](wp10-motion.md#63)

### [不同类型的一手证据与边界](wp10-motion.md#64)

### [常显与按需查询：补回正文遗漏的条件](wp10-motion.md#65)

### [远端界面：监看、局部命令与连续编辑](wp10-motion.md#66)

### [采用、删减与不能外推的部分](wp10-motion.md#67)

### [第二次修改：仅预注册，不运行游戏](wp10-motion.md#68)

## 重复进入补研：不要让编译刷新替你重置验收状态

核实：2026-10-15（UTC+8）；主线三。初始化、静态缓存／订阅或热更二改须区分编译后首次、无源码变化的重进与新进程；依据 Unity 6.3／UE 5.8 及 Realm／NGO 已合入链。[一手／研究]

### 已有覆盖与新增选择

[研究] 既有 WP9／10／11 已覆盖重建与生命周期；本节只补验收起点：每次改脚本只 Play 一次可能借编译刷新初始化，只测热会话则可能漏首次异常。

### Unity：两个已修历史案例给出相反方向

[一手] Unity 6.3 [关闭域重载](https://docs.unity3d.com/6000.3/Documentation/Manual/domain-reloading.html)：禁域重载保静态／订阅，但脚本变化 refresh 仍重载；运行时可 SubsystemRegistration 重置，Editor 用自身入口。[研究] 解绑与重初始化分开，不为通过擅改设置。

1. **Realm 重进缺初始化。** [#2898](https://github.com/realm/realm-dotnet/issues/2898) 报禁域重载后第二次登录挂起；维护者称退出拆 native hooks，重进不执行静态构造接线，用户 2023-01-05 自报预发布包正常。[一手／社区] [#3145](https://github.com/realm/realm-dotnet/pull/3145) 同日合 [`2a6d23c`](https://github.com/realm/realm-dotnet/commit/2a6d23cc40bac8bd3c9d841b8f731616f889ddab)，API 差分 [Initializer.cs](https://github.com/realm/realm-dotnet/blob/b30e116cb92c23773f49daedff548afb3265796a/Realm/Realm.UnityUtils/Initializer.cs) 加 OnSubsystemRegistration→NativeCommon.Initialize，清理重置标志／防重复。[研究] 解绑非重入保证，非当前缺陷。
2. **NGO 首次坏、随后可好。** [社区] [#2892](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/issues/2892)：6000.0.0b13／2.0.0-exp2 关 Scene Reload 后，域重载将子行为缓存变空列表而非 null，跳发现、不发 OnNetworkSpawn；再禁域重载重进可恢复。[#2906](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/pull/2906) 于 2024-05-08 合 [`cd6ead3`](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/commit/cd6ead3ac07100f5769d080e46dd4f269e8aea40)，[NetworkObject.cs](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/blob/85c6f39f9ef88edc8295bd0cdbcf39c5d0bb362d/com.unity.netcode.gameobjects/Runtime/Core/NetworkObject.cs) 在 Awake 置 m_ChildNetworkBehaviours=null。[一手／研究] PR 含其他 spawn 改动，非整项收益归此行，全部 Reload 测试覆盖未知。

[研究] 保留编译后首次结果，再不编辑／刷新地 Stop→Play 重走，核对象、初态、回调和结果。不同则查初始化／缓存／版本，不挑好结果；纯逻辑且无相关风险不追加。

### UE：旧实例、反射对象和工具注册不是一个刷新契约

[一手] [UE 5.8 Live Coding](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-live-coding-to-recompile-unreal-engine-applications-at-runtime)：.cpp 构造默认不更新旧实例，Reinstancing 可替反射对象；以 ReloadReinstancingCompleteDelegate/ReloadCompleteDelegate 更新引用／废缓存，残留对象退出可析构冲突。[研究] 初始化改动核实际值与资产覆盖，完整构建新进程重走；缓存含退出，重启不清已存覆盖。

[一手] [Unreal MCP 官方文档](https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor) 限新增 C++ UFUNCTION 工具须完整重启，RefreshTools 仅重轮询、客户端可需重连 schema。[研究] 不扩成全部反射不支持热更；也不用一般 Reinstancing 推翻此要求。保留头文件／反射改动完整编译重启的保守策略，撤回通用能力误归因。

[一手] [PIE 多玩家选项](https://dev.epicgames.com/documentation/unreal-engine/play-in-editor-multiplayer-options-in-unreal-engine?lang=zh-CN) 的 Play Standalone 与 Run Under One Process 分开。[研究] 跨实例共享／联网启动才核进程，不给纯公式加多客户端；独立进程也非 cook／发布通过。

### 后续验收范围与停止条件

[研究] 未来沿最小场景记录版本、Reload／Live Coding／Reinstancing 设置、编译与进程／实例来源，保留首次、重进及按需新进程结果。现有测试够用就不加层；夹具若注入状态／清缓存，标明仅验隔离规则，不冒充自然启动。

[研究] 未运行上游测试；Realm 网页失败后以 API 核合入 SHA／日期／补丁，NGO 核 PR 与 API。复测为他人报告，差分只证明维护机制。

## 粒子预算补研：模拟规模与透明覆盖不能互相代替

核实：2026-10-14 UTC。改变 04 的设备预算选择：先区分 CPU 实例／更新与 GPU 绘制压力，再选原生 CPU／GPU 粒子或缩减效果；不再让“加池、减粒子、迁 GPU”承担同一个承诺。[研究]

### 不同作者的机制与反例

- **Factorio 烟雾。** [一手] [FFF281](https://www.factorio.com/blog/post/fff-281)（2019-02-08）：降更新后到期仍绘，越透明覆盖反大；修到期绘制并略低透明尾部。[研究] 查寿命／覆盖，不推广阈值或收益。
- **Factorio 状态隔离。** [一手] [FFF326](https://www.factorio.com/blog/post/fff-326)（2019-12-20）分任意 trigger 与不改状态 simple particles；后者推轨迹、屏外不建、处理入屏／读档不重播，限单类型／固定发射器／范围。[研究] 按语义裁，不普停屏外或移植 emitter。
- **Sector’s Edge 反例。** [一手] Mitchell Robinson [2020 博文](https://vercidium.com/blog/particle-optimisations/) 用 ray-march 碰体素后反弹／减速，只改粒子速度／姿态，未见伤害／地形写入。[研究] 碰撞未必是玩法真相，但去掉会改视觉接触；Ryzen 5 1600／GTX 960 立方粒子测量不作本项目预算或横比烟雾。
- **后续源码不同。** [一手] `Vercidium/particles@31bd44b3d3654498924ee26604884cfedf969e92`（2021-08-25）的 [ParticleManagerUpdate.cs](https://github.com/Vercidium/particles/blob/31bd44b3d3654498924ee26604884cfedf969e92/source/particlemanager/ParticleManagerUpdate.cs) 仅位置／旋转／寿命／缓冲，无体素碰撞；[Particle.cs](https://github.com/Vercidium/particles/blob/31bd44b3d3654498924ee26604884cfedf969e92/source/structs/Particle.cs) 无伤害／地形，[README](https://github.com/Vercidium/particles/blob/31bd44b3d3654498924ee26604884cfedf969e92/README.md) 为 mock OpenGL，[LICENSE](https://github.com/Vercidium/particles/blob/31bd44b3d3654498924ee26604884cfedf969e92/LICENSE) Apache-2.0。[研究] 仅借机制，非即插即用库，线程／后端仍有成本。

### 现成路线怎么选

| 已定位的约束 | 选择与成本 | 撤回条件 |
|---|---|---|
| 少量、局部反馈，需逐粒子脚本或物理交互 | [一手／研究] ✅ Unity 6.3 [Particle System](https://docs.unity3d.com/6000.3/Documentation/Manual/ChoosingYourParticleSystem.html)具备这些交互；已有实现够用便保留，不因 VFX 可处理更多粒子而重做资产 | 只有对应模拟负载或确切图形创作需求成为瓶颈，再比较 VFX；不能把逐粒子接口当无成本 |
| 大规模主要呈现效果，CPU 模拟成为热点 | [一手／研究] 🧪 VFX Graph；[17.3 要求页](https://docs.unity3d.com/Packages/com.unity.visualeffectgraph@17.3/manual/System-Requirements.html)要求 compute 与 SSBO，URP 不支持 gamma 色彩空间，不支持 Open GL ES。图属性／事件交互不是 Particle System 逐粒子 C#／物理的等价替换 | 若必须维持原图形 API／交互或 GPU 已紧张，保留原生小效果或缩范围；维护两套效果也计入单人成本 |
| UE 多处小效果／多 emitter 的 CPU 开销 | [一手／研究] ✅ 先用 [Niagara Effect Type](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara)缩实例／发射量／renderer，再比较相同逻辑合并；GPU 路线保留 System／Emitter CPU 开销，池也不消除重新激活成本 | 合并降低裁剪粒度；GPU 瓶颈、少粒子或显存紧张的设备仍比较 CPU，不默认迁移 |
| 高分辨率／近景透明覆盖是热点 | [研究] ✅ 缩装饰烟片面积、重叠、尾部寿命与材质成本，保留接触瞬间及关键预警；必要时减少同时发生的效果／遭遇组合 | 若简化后提示不完整或接触感丢失，重做少量更明确的反馈，而不是仅以帧时间下降验收 |

[一手／研究] Unity 17.3 要求页称 URP／mobile VFX 尚未 out of preview，不等于整条 URP 或所有移动 VFX 不可用。UE 5.8 页保留 5.4 Lightweight Emitters 历史说明，本节不推荐或断言其成熟度；接入再核版本／平台。

### 第二次修改只预注册

[研究] 未来固定最低设备、分辨率、帧率与内存预算；比较大透明片、多小实例、离屏再入屏的 CPU／GPU、关键提示与尾部，不给通用粒子数或重复分配整帧预算。

[研究] 二改加点燃地面的碎片：伤害／地形独立于可裁剪视觉回调，低档／屏外规则不变，危险边界不随装饰消失。先分离已有耦合，保留原效果／预算以便撤回 GPU 迁移或裁剪。


## [空间容错补研：动作已开始却卡在边角](wp10-motion.md#69)

### [两种玩法的作者证据：局部补偿不是统一缩小碰撞体](wp10-motion.md#70)

### [固定实现与后续修订：没有墙，不等于可安全纠偏](wp10-motion.md#71)

### [代价与另一个作者的维护反例](wp10-motion.md#72)

### [最小采用、撤回与第二次修改](wp10-motion.md#73)

## [听点补比：镜头改变时从哪里听](wp10-motion.md#74)

### [视口与角色附近都有成立的条件](wp10-motion.md#75)

### [固定源码：位置、朝向、速度是不同输入](wp10-motion.md#76)

### [原生入口够先选听点，不保证跨引擎分离声像和衰减](wp10-motion.md#77)

### [成本、撤回与第二次修改](wp10-motion.md#78)

## [拾取坐标补研：显示变换不能靠 DPI 猜回去](wp10-content.md#79)

### [原生路径先行，只有跨空间时才转换](wp10-content.md#80)

### [实际纠正与当前版本反例](wp10-content.md#81)

### [最小采用与二改预注册](wp10-content.md#82)

## [动态 UI 补研：重建边界不等于停止绘制](wp10-content.md#83)

### [先去掉错误变化，再决定是否缓存](wp10-content.md#84)

### [Unity：按现有 UI 路线选择，不互抄边界](wp10-content.md#85)

### [UE：缓存计算与降频绘制分别决策](wp10-content.md#86)

### [采用、撤回与第二次修改](wp10-content.md#87)

## [墙门遮挡补比：直达被挡不等于通路消失](wp10-motion.md#88)

### [两种生产机制及不能互换的结论](wp10-motion.md#89)

### [原生职责与成本：不是跨引擎同一个开关](wp10-motion.md#90)

### [集成反例与第二次修改：只预注册](wp10-motion.md#91)

## [对白补研：显示完成不等于剧情交付](wp10-content.md#92)

### [原生组件已区分的交付动作](wp10-content.md#93)

### [不同作者选择不同节奏](wp10-content.md#94)

## [高速碰撞补研：线性、旋转与误接触](wp10-motion.md#95)

## 客户端模块页历史页头

历史原文转存：2026-10-16（UTC+8），来自 `domains/game-dev/04-client-modules.md` 的原页头。以下保留当时的核查日期、范围和来源说明；相对链接以原页面路径为基准。

```text
> 核实：2026-10-14 UTC；空间容错及保存响应补核：2026-10-15 UTC；动态 UI 与模拟输入补核：2026-10-16 UTC+8。Unity 主线、Unreal 对照；面向单人程序，无人工美术与音频修补。资产导入见 [01](01-engine-integration.md)，生成供给见 [03](03-generative-ai-in-games.md)。固定源码、反证、许可与验证范围见 [WP10 研究记录](../../docs/research/2026-10-14-game-wp10-client-modules.md)。
```


## [声音响应补研：低延迟与连续播放分别验收](wp10-motion.md#96)

### [处理块缩小与扩大都可能合理](wp10-motion.md#97)

### [原生取舍及第二次修改](wp10-motion.md#98)

## [转向补研：先分限幅与平滑，再决定是否撤回插值](wp10-motion.md#99)

### [同一游戏里的不同选择与局部撤回](wp10-motion.md#100)

### [三种机制分别负责什么](wp10-motion.md#101)

## [插值预算：按观察尺度缩小呈现，不停止仿真](wp10-motion.md#102)

## [改键持久化：既有选型回流](wp10-content.md#103)

## 分辨率预算：固定档、动态档与内容取舍

核实：2026-10-17（UTC+8）；GC／主线一、三。改变04设备预算中的降档选择：先核像素减少能否降低当前成本，再决定动态调节，而非“勾选DRS就保帧”。只读官方契约、开发者生产说明与经验，未运行引擎、游戏、模型或目标设备。[研究]

**✅ 固定低档先做基线，动态档只管理可伸缩的波动成本。** 同场景降低内部render scale后，GPU时间无明显改善就定位真实热点；已到危险轮廓可辨下限就改内容／效果，不继续压画面。稳定负载用固定质量档可少一层调度；忙闲变化明显且仍有画质余量时，才试有上下限与预算的原生DRS。此为研究选择，不是跨引擎或同游戏受控实验。[研究]

### 两种生产选择，不是统一最佳比例

- **保忙时响应，也用闲时余量。** Respawn 的 Drew McCoy 在 [Titanfall 2 Xbox One X 访谈（2017-10-30）](https://news.xbox.com/en-us/2017/10/30/inside-xbox-one-x-enhanced-titanfall-2/amp/)说明固定4K输出、按GPU负载改变内部渲染分辨率，有余量还可superscale。它证明该游戏采用动态内部比例，不证明任意硬件、玩法或当前版本都能零掉帧；不把宣传中的流畅承诺当本仓测量。[一手：开发者陈述；研究：范围]
- **降像素不够，就换昂贵效果路线。** Epic工程师 Daniel Wright／Krzysztof Narkowicz 的 [Fortnite Chapter 4复盘（2023-01-26）](https://www.unrealengine.com/tech-blog/lumen-brings-real-time-global-illumination-to-fortnite-battle-royale-chapter-4?lang=en-US)说明Series S较低内部分辨率仍不足，最后关闭Lumen Reflections，保留Lumen GI的粗糙反射，以SSR处理镜面反射。这是保核心视觉、替换部分效果的生产取舍；其毫秒预算和比例不作独立游戏通用阈值，也不推断当前Fortnite沿用完全相同配置。[一手／研究]
- **成本不会按像素数等比例下降。** Martin Fuller [2023实现经验](https://martinfullerblog.wordpress.com/2023/10/11/dynamic-resolution-scaling-drs-implementation-best-practice/)指出阴影图、粒子更新、裁剪、加速结构构建等并不一般随输出分辨率缩放，降到一定程度还可能成为顶点瓶颈。因此“GPU慢”还不足以选DRS；它可能帮助部分成本，不替代热点分解。[一手：作者经验；研究：边界]

### 原生能力按管线区分，接口不等于策略

| 环境／来源 | 已核契约 | 采用边界 |
|---|---|---|
| Unity 6.3 URP [Asset参考](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/universalrp-asset.html) | Render Scale改渲染目标，不改设备输出；文档说明UI保持设备原生分辨率 | [研究] 不由HUD清楚推断场内轮廓／攻击预告仍清楚；固定档先核正确相机、比例和上采样路径 |
| Unity 6.3 [DRS介绍](https://docs.unity3d.com/6000.3/Documentation/Manual/DynamicResolution-introduction.html)／[控制示例](https://docs.unity3d.com/6000.3/Documentation/Manual/DynamicResolution-control.html) | 目标按完整分辨率分配后缩使用区域，不重分配；通用路径支持列表中的Windows为DX12，Android为Vulkan。示例按点击／触摸调用ResizeBuffers，采集timing并未构成自动预算器 | [研究] 不把动态缩放当降低该目标分配内存的办法；已有控制器先复用，只有API时仍需补策略；勾选Allow不是自动保帧 |
| HDRP 17.3 [Dynamic Resolution](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@17.3/manual/Dynamic-Resolution.html) | Asset／Camera启用后可加HD Dynamic Resolution组件；也允许自定义SetDynamicResScaler，硬件／软件路径另有支持条件 | [研究] 优先现成组件，不能把URP示例限制外推HDRP；STP动态缩放要求硬件支持，无该支持只用固定scale。无需为DRS迁管线 |
| UE 5.8 [Dynamic Resolution](https://dev.epicgames.com/documentation/en-us/unreal-engine/dynamic-resolution-in-unreal-engine) | 有前帧GPU历史heuristic、FrameTimeBudget、上下限与panic；支持表列PC/Win64 DX12／Vulkan | [研究] 用原生能力并核实际DynRes与timing；同页末尾FAQ仍写旧“仅主机”，不据文档冲突承诺所有编辑器／PIE路径可用，目标版本和构建实测仍缺 |

表中契约为[一手]，边界为[研究]。UE页面说明突发效果／切镜头无法预知，GPU回读与panic有延迟，不能保证首帧不过预算；示例33.3ms不是60fps配方。CPU-bound也不简单写成“降分辨率绝无作用”：共享内存带宽平台可用CPUBoundScreenPercentage减带宽压力，但这不证明会减少玩法CPU工作。[一手／研究]

既有URP TAA／STP与动态分辨率组合限制沿[运动可读性记录](wp10-motion.md#52)核对；本单元不重做拖影调查。当前资料未给同项目固定档与动态档的净维护投入或玩家可辨下限，不宣称已得到最佳比例。[研究]

### 二改预注册与撤回

后续获准才在同设备、视角和规则下比较原档、一个固定低档、有上下限的DRS；记录CPU／GPU时间、实际scale、触底时长与突发帧，不只平均FPS。新增大面积效果和更多活动单位，分别检查像素与非像素成本；在最低档、下降和恢复途中核危险方向、关键轮廓、场内提示与HUD。[研究；未执行]

固定低档已稳定且可读就不强加DRS；动态收益明确但反复泵动、掉到不可辨或首发尖峰仍在，先收窄范围／修实际热点。最低可辨档仍超预算时，比较更便宜的效果、减少负载或另定目标档位，不能让自动缩放掩盖不可达预算；内存峰值沿原有驻留分析处理。[研究]


## 闲时预算：少画几帧不等于整个应用一起慢

核实：2026-10-18（UTC+8）；GC／主线三、四。改变 04 设备预算：静止菜单与回合等待仍耗用时，区分整应用限帧和只降呈现；不凭 API 承诺省电或输入无损。[研究]

**🧪 渲染确占主要成本才试原生降频。** Unity 6.3 [OnDemandRendering](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rendering.OnDemandRendering.html)允许独立控制渲染；renderFrameInterval 是每 N 个应用帧绘制，不是自动检测变化或零帧待机。跳过帧不执行渲染专属事件，包括 GUI／End-of-frame；不能把这些回调里的工作也当成照常更新。间隔过大仍可无响应。[一手／研究]

[Unity 优化指南](https://docs.unity3d.com/6000.3/Documentation/Manual/OptimizingGraphicsPerformance.html)区分单帧成本与绘制频率，建议菜单、暂停与等输入回合场景，并要求输入时恢复绘制。[研究] 需要继续及时更新时，先比较这条路，别顺带降低整应用更新频率；这不表示整应用限帧会按比例减慢游戏时间或固定步模拟。持续动画／异步结果也可能需要新画面；仅停止 UI 重建并不停止绘制，CPU 模拟重而渲染轻时不指望此法解决热点。

**真实采用只支持相应场景。** Unciv [#1612](https://github.com/yairm210/Unciv/pull/1612)于 2020-01-04 合入：关闭 libGDX 连续渲染，同时移除迫使持续绘制的旋转选择圈；这是回合游戏，不是实时战斗的等价证明。[#1464](https://github.com/yairm210/Unciv/issues/1464)有 Android 用户短测 CPU 下降及约 200 回合后闲时 CPU 显示零的自报，没有 GPU 功耗／续航受控测量，不写成节电幅度。[一手／社区]

固定源码[LoadingImage](https://github.com/yairm210/Unciv/blob/58b2844068866a04525eecfbc45e57c693714294/core/src/com/unciv/ui/components/widgets/LoadingImage.kt)关闭连续渲染时仍显示忙碌图标，只取消淡化和旋转；[动画盘点](https://github.com/yairm210/Unciv/issues/11986#issuecomment-2262249912)区分装饰开关与仍触发绘制的移动／攻击 Actions。[研究] 借鉴的是保留状态反馈、减少持续装饰，不是把所有动画或玩法冻结。[同 SHA 许可](https://github.com/yairm210/Unciv/blob/58b2844068866a04525eecfbc45e57c693714294/LICENSE)为 MPL-2.0；仅提炼机制，不移植代码／资产。[一手]

**反例收窄采用。** [Unity 解谜游戏作者原帖](https://discussions.unity.com/t/new-input-system-and-ondemandrendering-input-lag/899418)报告换 Input System 后触摸恢复延迟；2024 年跟帖称 Unity 6 Android 按低渲染频率处理触摸、Editor 却正常。缺完整版本与官方修复闭环，不能声称 6.3 仍必现；足以要求发布构建分开核输入接受和首个可见反馈。[社区／研究] 用现有预算验证同时看实际更新／呈现频率与耗用，覆盖静止、首操作、动画／异步变化及恢复；无收益或反馈变迟就撤回。未运行引擎、游戏、设备或模型，不由 API 或 CPU 自报推断 GPU 省电。[研究]

## [重复内容：先分机械转换与作者判断](wp10-content.md#104)

## 更新交付：平台差分与独立内容发布分开选

核实：2026-10-19（UTC+8）。改变 04 平台发布选择：随应用版本发布的小补丁，先比较平台差分与打包布局，不因下载／安装代价异常就增加运行时远程分发。WP9 已覆盖[内容更新基线维护](2026-10-14-game-wp9-engine-handoff.md#33-addressables-管加载不负责识别同一个动作)，本节新增的是下载量、客户端重写和布局迁移的区别。[研究]

**平台机制。** Valve [SteamPipe 文档](https://partner.steamgames.com/doc/sdk/uploading?language=english)说明，约 1 MB 块可复用，但更新大包仍要在旧文件旁生成完整新包；少量下载也可能伴随大量本地复制。官方建议限制包范围、按关卡／功能分组、减少无关重排及跨资产压缩扩散；为加载效率重排资产则可能扩大本次下载。其 1–2 GB 建议不是通用阈值。先核真正改变的字节和客户端重写，不能由补丁下载量直接推安装速度；本轮没有实测。[一手／研究]

**引擎能力与交付分开。** Unity [Addressables 2.9.1](https://docs.unity3d.com/Packages/com.unity.addressables@2.9/manual/content-update-builds-overview.html)（另核 [2.7.6](https://docs.unity3d.com/Packages/com.unity.addressables@2.7/manual/content-update-builds-overview.html)／[3.0.0](https://docs.unity3d.com/Packages/com.unity.addressables@3.0/manual/content-update-builds-overview.html)）要求平台自带 patch 或不支持远程内容分发时不用 content-update builds，每次应用发布做新 content build；这不取消本地 Addressables 加载与资源管理。确需内容独立更新，再承担远程 catalog／托管及各平台原始发行 content_state 维护；AssetBundles 不含代码变更。[一手／研究]

Epic [UE 5.8 文档中的平台无关 PAK 路径](https://dev.epicgames.com/documentation/unreal-engine/how-to-create-a-patch-in-unreal-engine)以 package（如 .uasset）为最小纳入单位，保留已发行 cooked content、挂载新旧 PAK；长期保旧文件会增加存储，补丁怎样送达仍由分发平台决定。该页保留 Windows／Xbox One 使用范围说明，不代验所有 IoStore／平台组合。Steam 文档的旧 UE padding 示例未核目标 5.8 实现，因此不照抄参数。[一手／研究]

**迁移代价与改判。** Dead by Daylight [2022 年 3 月开发者更新](https://forums.bhvr.com/dead-by-daylight/discussion/315701/developer-update-march-2022)称内容增长使分组扩大，因而重排／重平衡；[5.7.0 发行通知](https://forums.bhvr.com/dead-by-daylight/discussion/320530/release-information-5-7-0)确认文件结构变更需一次近乎全量重下。这是进入发行的迁移代价，未独立验证宣传速度，也不代表单人项目收益。布局调整后若局部更新仍牵连大量无关数据，或迁移成本不值，先缩改动范围／保原布局，再比较交付路线；下载、安装、临时磁盘与既有加载表现分别验收。没有运行引擎、打包器、游戏或模型，维护工时与本项目净收益未知。[一手／研究]

## [图中文字二改：先换生产表示再扩语言](wp10-content.md#105)

## 发行诊断：先保可定位反馈，再选自动报告

核实：2026-10-20（UTC+8，接收返工补核）。[研究] **✅ 先核项目实际采集状态，再决定保留／停用／新增自动链；人工反馈始终保留。** Unity新项目可能已启用诊断，未安装第三方SDK不能当未采集。选仅人工路线先明确关闭相关自动诊断，再验目标发布包；已有合格且授权清楚的诊断链可保留，不为了“人工优先”无差别拆除。自动异常／崩溃报告不覆盖无崩溃的软锁、坏档或不好玩。

### 选择接收链，不默认自建后台或叠加SDK

| 情况 | 起点 | 改选／撤回条件 |
|---|---|---|
| 小范围可联系试玩，主要缺复现步骤 | ✅ 人工反馈＋版本化本地日志；仅人工须先核并关闭已有自动诊断；保构建与符号 | 现场崩溃持续没有栈／设备信息，或发布范围不适合逐个追问，再加自动诊断 |
| 已用Unity 6.2+及支持平台 | 🧪 内置Diagnostics，核实际采集／接收与符号 | 目标平台或必须的逐用户数据控制不满足，换合适接入；不为诊断盲升引擎 |
| UE桌面发行构建 | 🧪 CRC客户端＋选定接收／符号化服务 | 仅勾Include Crash Reporter不能交付完整链；端点／符号不可维护时保手工材料 |
| 原生覆盖不足，确需统一分组／跨平台定位 | 👀 比较一个现成SDK，如Sentry；先最小错误事件 | 采集边界、启动／禁用、维护预算不合格就缩窄或撤回，不双开兜底 |

**Unity前提必须落到构建。** [当前前提][diag-unity]列6.2+、连接Unity Cloud及Android／iOS／macOS／Windows（不含UWP）；新项目默认开启，升级项目默认不开。[同意管理][diag-consent]明确Diagnostics不使用UnityConsent、按项目而非逐用户控制，因此AnalyticsIntent不能当诊断关闭证明。需要逐用户选择的项目，先核替代接入与数据依据，不能用别的服务开关代验。[一手／研究]

**仅人工不是“什么都不配置”。** [Editor配置](https://docs.unity.com/en-us/cloud/developer-data/configure-diagnostics-editor)要求按Project Settings→Services→Diagnostics和目标Build Profiles核最终值；profile可覆盖项目默认，复制profile会继承覆盖。关闭Diagnostics只停止该类诊断，不影响其他Unity产品或第三方SDK的数据。还须逐项核它们的启用／发送路径，并在获准验证的目标构建确认实际外传；不能用UnityConsent或一次后台空列表代证。本文没有修改真实项目、关闭服务或测网络流量。[一手／研究]

[迁移说明][diag-migration]已弃用旧Cloud Diagnostics，新服务替代崩溃／异常与符号，User Reporting另包；旧数据仅在原保留期可访问，不承诺全量历史迁移。本轮未闭合新服务现行独立配额；旧服务日报告配额不能套入新服务，采用前确认费用与保留期。[一手／研究]

**UE发行端与编辑器不同。** [5.8文档][diag-ue]明确打包默认不带CRC，5.4起packaged不发Epic；UE也不附接收／保存／符号化服务器。这里仅推荐已核桌面链路，不将它扩成移动／主机全覆盖；报告界面出现不等于开发者已收到。[一手／研究]

### Sentry是对照，不是免费且无副作用的默认

Unity SDK源码沿固定4.10.3（`e154bbf1883a610d26ca3f8e83ad8257b15fda1b`）；UE 1.24.0（`e1b4efb44590a412bded437c9dcc657b4d390303`）仅保历史基线，当前追加[1.25.0](https://github.com/getsentry/sentry-unreal/releases/tag/1.25.0)（2026-10-19 18:18 UTC发布，固定`bbbb9296447aa34a397949d4687668059d421c28`），不将旧SHA改标签冒充新版本。两SDK代码MIT，托管服务和依赖另核；[价格](https://sentry.io/pricing/)按errors、logs、attachments等不同单位计，未估读者游戏费用。维护成本包含符号、数据控制、噪声与SDK／架构升级，不给“接入后零维护”的承诺。[一手／研究]

**1.25.0改变的是具体配置／生命周期验收，不是全面效果保证。** [native span修复](https://github.com/getsentry/sentry-unreal/commit/c1c6b763d56e9c1524bf02ea1a4a9349f34990fc)处理重复finish及并发使用导致崩溃；这主要影响使用tracing的路径，不推为所有仅错误上报都会崩溃。[一手／研究]

[Apple回调修复](https://github.com/getsentry/sentry-unreal/commit/6b7d844fbf8af845dcd82deffdd49f34b9f2d908)让transaction不再进入错误事件BeforeSend，回调不因此成为全部数据的过滤门。[一手：发布／差异阅读]

[ANR修复](https://github.com/getsentry/sentry-unreal/commit/0b203342bb21f4f616b0ed9775b218e553f7df8a)补Apple／Android部分app hang分类，不证明所有卡死都捕获。[一手／研究]

[缓存修复](https://github.com/getsentry/sentry-unreal/commit/1d7781989c6a8306546e73c4b2fd70eb644bbb35)在启用离线缓存时把非正CacheMaxItems映为MAX_int32，避免0导致丢事件；0表示取消条数限制，不表示关闭缓存或发送。这也不是Unity的初始化flush时间设置。先在目标平台核实际事件与缓存行为，不给升级必然无副作用的承诺。[一手／研究]

[UE官方集成](https://docs.sentry.io/platforms/unreal/)说明Windows UE5.2+的Sentry native handler与引擎CRC互斥；应选一条接收链，而非两套同时开。Unity的[初始化检查][diag-unity-init]对未启用／空白配置有跳过分支，但[缓存选项](https://docs.sentry.io/platforms/unity/configuration/options/#InitCacheFlushTimeout)默认初始化flush最多1秒，且为阻塞发送。源码分支不证明所有平台断网／缺依赖时启动无影响。[一手／研究]

**PII开关不是匿名或完整过滤保证。** [UE数据说明][diag-data]明确crashpad／breakpad的线程栈随minidump发送，处理后丢弃不等于没有外传；[附件说明][diag-attachments]又明确附件不做数据清洗。UE 1.24历史[限制][diag-hooks]在[1.25固定README](https://github.com/getsentry/sentry-unreal/blob/bbbb9296447aa34a397949d4687668059d421c28/README.md#known-limitations)仍保留：fast-fail跳过`HandleBeforeSend`；新版本回调修复不能覆盖这条路径。先限定必要错误／构建字段；截图、完整日志、source context及dump留存分别决定，不能把一个回调当所有崩溃的脱敏出口。[一手／研究]

### 两条真实修订链：可见性、可控性和启动分别成立

[Factorio FFF231](https://www.factorio.com/blog/post/fff-231)记录0.16.24自动日志发现论坛未报崩溃；作者仍需要玩家补步骤／存档，自动报告又无法联系原提交者。对Ryzen故障增加定点minidump后仍未定位，直到[FFF239](https://www.factorio.com/blog/post/fff-239)与AMD调查才报告解决方向。历史opt-out与EULA取舍不作当前隐私默认，报告次数也不是受影响玩家比例。[一手：作者报告；研究]

osu!从[关闭采集请求](https://github.com/ppy/osu/discussions/31832)到[合入禁用门](https://github.com/ppy/osu/pull/36426)，在SDK初始化前判断明确禁用。后续[为减少无用上报改了缺省配置](https://github.com/ppy/osu/commit/48434dd683d095c42c01def8ff7cb95ce0a85ce4)，却使[规则模板启动失败](https://github.com/ppy/osu/issues/37650)；[固定修复][diag-osu]改成空缺省，并进入[2026.518.0-lazer](https://github.com/ppy/osu/releases/tag/2026.518.0-lazer)。这是osu!的.NET／规则模板链，不是当前Unity／UE SDK普遍有此故障。[一手／研究]

修复也不等于强制停止上报：当时Sentry .NET 6.2.0的[配置查找][diag-dsn]在空options后仍读环境／assembly来源；仅无其他值才进入禁用值。osu!的明确关闭由初始化前返回实现。由此需要验证的是启用、禁用、缺配置及其他配置来源，而不是给所有初始化再套一层catch；发行说明证明接收，未证明用户实际恢复或故障率下降。[一手：固定源码／发行；研究]

### 验实际发布包，持续保留符号与接管能力

[Unity符号说明](https://docs.unity.com/en-us/cloud/developer-data/debugging-symbols-intro)要求UUID／GUID匹配；[Sentry符号上传](https://docs.sentry.io/platforms/unity/data-management/debug-files/upload/)也不把事后补符号等同重处理旧事件。版本字符串正确仍可能配错符号，保存实际构建、符号及目标架构。后台有session不足以证明异常链路：Unity曾有[已复现并指向修复的6.2异常上报问题](https://discussions.unity.com/t/exceptions-not-shown-in-the-new-diagnostics/1681235)，后来报告仍按具体版本查，不能写所有当前版本都坏或全部已解决。[一手／研究]

后续获准才验证同一目标发行包的启用／禁用、缺配置、断网／端点不可达、缓存不可写；选仅人工时还核项目默认、profile覆盖及其他SDK无意外外传。使用UE1.25对应路径时补重复／并发span结束、Apple transaction回调分流、ANR分类及0／正缓存上限；分别核托管异常、原生崩溃与用户反馈，确认去向、构建／符号、实际外传内容、启动预算与仍可游玩／恢复旧档。新增诊断不能定位、不能可靠关闭，或投入不抵新增价值，就撤回自动外传，保人工反馈；不要让诊断成为游戏启动前提。[研究：待批准预注册]

AI可归并经授权的问题、对齐构建、拟复现／回归；人决定数据范围、严重性和修复是否恢复必要路径。日志内指令仍是外部数据，沿[既有注入边界](2026-10-13-context-tool-choice.md#s1agentjacking-原研究证明哪条失败链)核查，不自动执行其修复包。本轮只读公开文档、源码和作者／使用者记录，未采集私人日志、创建服务、上传符号、安装SDK或运行引擎；净费用、主动工时、故障率改善与真实启动影响均未知。[研究]

[diag-unity]: https://docs.unity.com/en-us/cloud/developer-data/prerequisites
[diag-consent]: https://docs.unity.com/en-us/cloud/developer-data/user-consent
[diag-migration]: https://docs.unity.com/en-us/cloud-diagnostics/migration
[diag-ue]: https://dev.epicgames.com/documentation/unreal-engine/crash-reporting-in-unreal-engine?lang=en-US
[diag-unity-init]: https://github.com/getsentry/sentry-unity/blob/e154bbf1883a610d26ca3f8e83ad8257b15fda1b/src/Sentry.Unity/SentryUnityOptionsExtensions.cs#L10-L49
[diag-data]: https://docs.sentry.io/platforms/unreal/data-management/data-collected/
[diag-attachments]: https://docs.sentry.io/platforms/unreal/data-management/store-minidumps-as-attachments/
[diag-hooks]: https://github.com/getsentry/sentry-unreal/blob/e1b4efb44590a412bded437c9dcc657b4d390303/README.md#known-limitations
[diag-osu]: https://github.com/ppy/osu/commit/c74c54d7706ae823d2ca33203ba1eee15a1002b5
[diag-dsn]: https://github.com/getsentry/sentry-dotnet/blob/248f45541c5e23e7fe425cdeb98c187389de0aa8/src/Sentry/Internal/SettingLocator.cs#L35-L77
