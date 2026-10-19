主线：一／二／三／四；客户端体验、第二次修改与交付
改变的建议：[研究] 先复用原生组件，再按具体症状补输入、运动、呈现和资源责任；以可控、可读及旧内容兼容判断取舍。 插值成为热点时按观察尺度筛选呈现，保留模拟与入屏所需数据；掉帧先验证固定降采样的收益，再选择动态分辨率或改内容。
新证据：[一手／社区] 官方契约、固定源码、修复链与不同作者案例支持有条件选择；具体版本、反证和许可见各节，尚无本项目引擎或玩家实测。 2026-10-17补OpenRCT2发行源码／试玩回执与VVVVVV屏外取样修复，不把少处理对象写成已测性能收益。

# WP10：客户端模块怎样在第二次修改后仍然可靠

证据核实：2026-10-13—15 UTC；动态 UI、模拟输入、本地多人及手柄反馈补核为 2026-10-16 UTC+8，混用边界补核为 2026-10-17 UTC+8；各节保留版本和日期。[一手] 为官方契约／固定源码／作者报告，[社区] 为原帖，[研究] 为推导。全文未安装付费插件，未开展游戏、引擎、模型、设备或玩家实测；源码与作者数据不等于本项目复现，也不证明本项目性能、体验或 AI 净收益。仓库离线检查、算术核对及特殊验证限制按各节记录区分。建议落点为 [客户端核心模块](../../domains/game-dev/04-client-modules.md)。

**[研究] ✅ 默认复用成熟组件；仅补项目缺少的所有权、迁移和模式切换规则。** 先验场景取消、释放、旧档、暂停与设备峰值，再决定是否加框架；无同任务实测，不作质量／性能排名。

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

## 体验质量深化：响应与顺滑，让同一个动作值得反复玩

核实：2026-10-14 UTC。补 04 的动作回应、可读性与连续游玩质量；比较 2D 动作与 3D 第三人称，节奏／容错按玩法选择。[研究]

### 1. 四类时间问题不能用同一种“平滑”处理

| 问题／一手证据 | 改变的建议 | 可推翻或收窄建议的条件 |
|---|---|---|
| [Input System 1.19 时序选择](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/timing-select-mode.html)及[固定步长详解](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/timing-optimize-fixed-update.html)：FixedUpdate 在渲染帧内可能零次／多次执行，固定模式按完整时间步归组事件；低延迟需求推荐 Dynamic Update，即使物理施力仍在 FixedUpdate | [研究] 先减少事件等待；保存连续输入，离散指令消费一次，勿把所有输入搬到 FixedUpdate 当性能优化。物理模拟方式与输入采样模式可分别选 | [研究] 小量延迟不影响玩法且统一固定时序明显更简单时，原生固定模式可保留；这里不涉及网络确定性／回滚的时间线设计 |
| [Unity 6.3 Rigidbody 插值](https://docs.unity3d.com/6000.3/Documentation/Manual/rigidbody-interpolation.html)：Interpolate 用前两次物理姿态并延迟一个物理步；Extrapolate 预测未来姿态，可能越过碰撞边界 | [研究] 插值改善可见轨迹，不自动降低操作延迟。给观察到抖动的对象按需开启，再检查角色／跟随者使用的姿态；不把所有对象插值或全局提高物理频率设为默认 | [研究] 若游戏直接控制的角色更重视即时反馈，新增滞后不合适，可回退该对象插值并重新决定运动／呈现方案；不是跳过碰撞求快 |
| [Android Frame Pacing 官方说明](https://developer.android.com/games/sdk/frame-pacing)，页面更新 2026-02-26：不均匀显示间隔、重复帧及 queue-stuffing 可增加卡顿／延迟，Unity 已集成 | [研究] 平均 FPS、CPU/GPU 用时与实际呈现间隔分开记录。原生 Android 先用引擎选项，不为独立游戏再实现呈现同步层 | [研究] 平台、图形 API、刷新模式和引擎版本变化需复核；没有目标设备数据，不声称固定幅度改善 |
| [Unity 6.3 targetFrameRate](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-targetFrameRate.html)：桌面软件限帧有 microstutter 风险，vSyncCount 非零时忽略 targetFrameRate；Android 有不同规则 | [研究] 不把 `targetFrameRate=60` 当跨平台顺滑配方。桌面按同步方式选，Android 按目标与刷新率配置；帧间隔稳定和输入延迟同时比较 | [研究] VRR、平台合成器、驱动及硬件队列会影响结果；官方机制不能替目标设备端到端测量 |

[研究] 未来以时间戳定位输入处理、动作接受与首个反馈；p95／p99、最长帧和超预算场景描述稳定性。外设到屏幕发光另测，试玩判断体验。

### 物理查询补研：刚改位置不等于物理查询已看到新位置

核实：2026-10-15 UTC。移动／放置后的错误命中先查物理状态新鲜度；范围为 Unity 3D，UE 对照原生 tick 合同。[研究]

- [一手] [Unity 6.3 同步手册](https://docs.unity.com/en-us/engine/6000.3/manual/physics-section/physics-overview/physics-optimization/cpu/transform-sync)：默认延后 Transform 同步；直接改 Rigidbody／Collider Transform 后，依赖新位置的同帧查询前调用 `Physics.SyncTransforms`。Auto Sync 每次查询隐式同步。[研究] 批量改后同步，中间再改须重定边界，非保证一帧一次。
- [一手] [6000.3.0f1 发布说明](https://unity.com/releases/editor/whats-new/6000.3.0f1) 弃用 `Physics.autoSyncTransforms`，建议显式同步；6000.3 固定 `c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1`（6000.3.26f1）的 [Physics.deprecated.cs L22–25](https://github.com/Unity-Technologies/UnityCsReference/blob/c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1/Modules/Physics/ScriptBindings/Physics.deprecated.cs#L22-L25) 仍有 extern get/set、`Obsolete(..., false)`／`ExcludeFromDocs`。不生成新开关写入，也不称已移除／无效。
- [一手] [6.3 SyncTransforms API](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.SyncTransforms.html) 将自身／子层级 Transform 送入物理；[固定 Physics.bindings.cs L763–783](https://github.com/Unity-Technologies/UnityCsReference/blob/c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1/Modules/Physics/ScriptBindings/Physics.bindings.cs#L763-L783) 中 `Simulate_Internal` 与 SyncTransforms 为独立绑定。[研究] 同步不推进模拟／求接触；只核公开 C#，未核原生求解器。[Unity Reference-Only License](https://github.com/Unity-Technologies/UnityCsReference/blob/c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1/LICENSE.md) 仅供参考，不作可复用运行时代码。
- [一手] [6.3 MovePosition](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.MovePosition.html) 用于运动学连续运动并遵循插值，示例在 FixedUpdate；瞬移用 `Rigidbody.position`。[position 文档](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-position.html) 说明经物理设置、下次模拟后更新 Transform，可免附属 Collider 重算。[研究] 同步不令 MovePosition 已完成，可见／物理姿态也非时时相等；不外推 Rigidbody2D。
- [一手] [UE 5.8 Actor Ticking](https://dev.epicgames.com/documentation/en-us/unreal-engine/actor-ticking-in-unreal-engine)：PrePhysics 读上一帧，DuringPhysics 不确定，PostPhysics 模拟已完成；同组可用 `AddTickPrerequisiteActor/Component` 等具体生产者。[研究] 仅需要当帧模拟结果才延后，不把任意 SetActorLocation 查询等同，也不造 UE flush。

**二改预注册：** [研究] 把静态障碍改为同帧脚本移动，对照批量修改后直接查询与显式同步；原生刚体运动另按既定模拟步骤观察。正确后再测同步成本。射线起点、层矩阵、形状或参数错误另修；查询不依赖新位置时不加同步。

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

### 3. 可借用的优秀实现，以及不能带走的东西

| 来源与固定版本 | 已读的证据；采用单位 | 许可／维护／反证 |
|---|---|---|
| [NoelFB/Celeste](https://github.com/NoelFB/Celeste/tree/1b0ce45c75e05649ae91b44a8bb6b196684e4352)，最后提交 2021-08-05，仓库 2023-03-16 归档 | [一手] [Player.cs](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs)的 JumpGraceTime、角落修正、可变跳跃、DashBegin 的冻结／波纹／震动；[研究] 采用“精确动作也允许意图容错”的机制，不搬整段角色控制器 | [一手] [README](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/README.md)明确 MIT 只涵盖仓库代码，不含商业游戏及资产；发布的是部分学习源码，不是当前完整可维护模板 |
| [EXOK/Celeste64](https://github.com/EXOK/Celeste64/tree/6edfe1ebd2a21a6134d7675a28e357891025407e)，最新提交 2026-09-07 | [一手] [Player.cs](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs)的 Jump 同时设置运动、模型拉伸和声音；落地根据此前速度调整形变并发出落地事件／音效；宽限、ground snap 与显示姿态协同。可借动作到反馈的连接，3D 仍可用小规模程序化演出 | [一手] [ReadMe](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/ReadMe.md)：Source 原则上 MIT，标注例外及 FMOD 另算；Content／IP 不随代码放开商用。作者明确称约两周 jam、并非充分优化。[研究] 近期翻译提交不证明其是生产级 Unity 底座 |
| [deepnight/gamefeel](https://github.com/deepnight/gamefeel/tree/09d24aa05abe1192ad07cd3acd7270e6a5842237)，最新提交 2024-11-10，作者演示 v2 于 2024-05-01 发布 | [一手] [Options.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/Options.hx)将视觉后坐力、物理后坐力、缓冲、控制锁定等分开；[Hero.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/en/Hero.hx)把动作与反馈连接。[研究] 借逐项开关和清楚的事件绑定，而非引入 Haxe／Heaps 作为 Unity 插件 | [一手] [LICENSE](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/LICENSE)为 MIT；README 另列 Kronbits Inca tileset，不能用代码许可代替第三方资产核查。作者称学习演示而非实际游戏；未试玩，不给收益排名 |

**[一手＋研究] Deepnight 反证。** `gunAnimations` 将预备时间设为 0.33／0.06 秒；无枪械动画时爆发射击后另加 0.35 秒控制锁。`gunRecoilVisual` 改精灵偏移，`gunRecoilMovement` 改实际运动。因此全开／全关混合了规则与画面变化；这些是固定源码常量，不是推荐值。

[一手] [Game.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/Game.hx) 的 slowMo 用未缩放时间更新并计算游戏速度，须读 `stopFrame` 实际时长／倍率。[研究] Unity 输入缓存、判定、动画、粒子、相机、音频与 UI 各定时钟，`timeScale=0` 不统一暂停。

### 4. 作者复盘与研究能支持多强的结论

- [一手] Sébastien Bénard [GDC 2019 Dead Cells 复盘](https://media.gdcvault.com/gdc2019/presentations/Benard-Sebastian-DeepCells.pdf) 第 13 页（PDF 索引 13）为及时跳／到达辅助，16 页自由转向／自动瞄准，21 页处理挑战外细节。[研究] 只支持减少无意摩擦，不普推自瞄或统一容错；未看视频。
- [一手] Maddy 的 [Celeste & TowerFall Physics](https://www.mattmakesgames.com/articles/celeste_and_towerfall_physics/index.html)解释特定 2D 像素／平台约束下的 Actor／Solid 运动。[研究] 支持为了具体动作设计运动政策，不支持默认绕开 Unity 原生物理并自研引擎。
- [一手] [Lin 等 2022 impact-feel 论文](https://arxiv.org/abs/2208.06155) 摘要以评论训练排序、比较前八／后八游戏特征，认为顿帧、声音一致性、相机控制可能重要；仅相关分析，不定参数或因果收益。[研究]

### 5. 下一步验证和本轮交付边界

[研究] 未来获准切片选一个高频动作：2D 跳跃／短连击，3D 转身／近战。固定规则后切纯呈现，缓冲／顿帧窗口另作玩法变量；记录首反馈、长帧和误操作，由人判断可控／可读。二改再核是否只需动作参数和少量绑定。

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

## 3D 运动补研：控制精度、接触连续性与物理重量的取舍

核实：2026-10-14 UTC。以下按官方契约和固定源码深化 04 的运动选择；输入缓冲与显示插值见前节。[一手／研究]

### 1. 先按期望运动选，不能只按组件名字选

**[研究] 默认判断**：常规直立探索／动作角色，原生坡／阶与简单接触规则已满足需求时，✅ 原生 CharacterController 加窄运动层；已有可维护的刚体运动无需迁移。真正需要物体质量、冲量与摩擦相互作用时🧪力驱动动态 Rigidbody；需要原生接触求解但按游戏规则组织速度时🧪速度驱动动态 Rigidbody；稳定接地、任意附着／脱离或复杂台阶规则超过原生便利范围时🧪现成 kinematic motor。后两条都可能很精确，不能写成“Rigidbody 必然笨重、KCC 必然最好”。

[研究] 加速度、转向承诺、落地形变和武器时序也能塑造重量；先定义坡顶、击退、转台上的期望行为，再决定速度所有者。

[一手] Unity 6.3 LTS 的边界：

- [CharacterController 组件](https://docs.unity3d.com/6000.3/Documentation/Manual/class-CharacterController.html) 提供壁滑、坡限／阶高／Skin Width，不自动受力或推刚体，可用回调补推力；示例尺度参数非通用值。
- [Move](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController.Move.html) 受碰撞约束且不加重力；[isGrounded](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController-isGrounded.html) 是最近 Move／SimpleMove 接地结果；[velocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController-velocity.html) 来自位移差，不含外部 Transform／父级运动，不能直接当世界速度／独立探地／平台动量。
- [Rigidbody.linearVelocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-linearVelocity.html) 是世界速度，反对逐步覆盖以求真实物理，也给跳跃改速示例。[研究] 速度驱动可用，但须显式保留外力／接触速度，覆盖后不能期待 AddForce 持续。
- [GetPointVelocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.GetPointVelocity.html) 含角速度；[MovePosition](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.MovePosition.html) 是运动学按物理步移动／插值接口，不包办坡阶、接地与离台政策。[研究]

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

### 3. root motion 与混合路线：一个最终位移所有者

[一手] Unity 6.3 [OnAnimatorMove](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnAnimatorMove.html) 在动画求值后、IK 前。固定 `Standard-Assets-Characters@8f185aa3c782d824976653dd6a6476312daad241` 的 [ThirdPersonBrain.cs](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/Assets/_Standard%20Assets/Characters/Scripts/ThirdPerson/ThirdPersonBrain.cs#L458-L481) 在非 root-motion 用 FixedUpdate，否则用 OnAnimatorMove 驱 motor；[ThirdPersonMotor.cs](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/Assets/_Standard%20Assets/Characters/Scripts/ThirdPerson/ThirdPersonMotor.cs#L215-L228) 经 adapter 提交、GetMovementVector 读 deltaPosition。位移所有权互斥，未绕过碰撞。

[一手] [LICENSE.md](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/LICENSE.md) 为 Unity Companion License；最后提交 2025-10-23 未证 6.3。[研究] 只借动画出期望位移、motor 限最终位移；自由移动代码定轨迹，承诺突进可用动画，但须定受阻缩距／停调动作政策。各路线均可用 root motion。

[一手] [Character Controller 1.4.5](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/index.html) 是 ECS；[SimulateDynamicBody](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/dynamic-body-interaction.html) 让 kinematic 模拟质量比例与推／被推，反驳无物理互动；[moving platforms](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/moving-platforms.html) 区分 TrackedTransform 跟随与 PhysicsVelocity 推力信息。[研究] 非 ECS 不因官方身份迁移；与 GameObject CC／PhysX 分列。

**肢体操纵：保留身体反应，局部改控制与可达路线。** 核实：2026-10-18（UTC+8）。下列为两个独立开发团队的历史生产取舍，只限物理肢体／抓取玩法，不改变普通直立角色的默认路线。[一手／研究]

Octodad 的 [2012-10-17 作者说明](https://younghorsesgames.com/allundercontrol/)记录：旧版上楼梯时越用力越难前进，改将输入力用于向上辅助；低顶时停止强行撑直身体，同时保留笨拙操纵。[2015-03-30 技术复盘](https://www.gamedeveloper.com/programming/octodad-dadliest-catch-post-mortem-pt-4-tech)的 Octobody 节说明，软体有穿透、观感和 CPU 问题，后作改详细胶囊 ragdoll；升级 PhysX 3 后原软体也不再可用。受控脚减重、腾空撤撑起力、悬挂另调手臂，都是为特定状态改物理响应；新增约束又吃掉去软体的性能收益，需提供低细节身体。可借“局部受控端＋其余身体反应”，代价是专用状态与约束预算，不是当前 PhysX 选型或通用参数。[一手／研究]

Human Fall Flat 开发者在 [2017-10-27 回复 #9](https://steamcommunity.com/app/477160/discussions/0/3182216552780030265/)说明：为拾物、按钮和抓边等重写抓取后，墙爬也更容易；选择保留新抓取、另削弱墙爬，避免初玩绕过谜题。作者认可重玩／多人探索的不同用途，[10-31 回复 #19](https://steamcommunity.com/app/477160/discussions/0/3182216552780030265/?ctp=2)确认独立入口。同帖玩家对限制有异议，这只支持当时的玩法取舍，不证明削弱更好或现版各平台仍有该入口。[一手／社区／研究]

因此，物理肢体操纵本身是玩法时先局部修受控端／状态；接触更可靠后，再检查可达路线是否符合目标，按具体影响保留、收窄或撤回。物理响应并非目标且持续妨碍预定运动时，才沿原建议比较显式控制。以上未运行游戏、引擎或前后实现，未测维护工时与体验收益。[研究]

### 4. 升级、撤回与未来验收：以玩家感到的差别为准

- [研究] **保留原生 CC**：简单接触够用就不升级；平台少也可能规则复杂，贴地／旋转／动量组合先比较现成 motor。
- [研究] **保留速度驱动 Rigidbody**：接触与步态已达标，外力统一进入 momentum。新增持续质量交互、任意冲量或堆叠时，再评估力驱动／混合政策。
- [研究] **撤回过度物理化**：物理响应并非玩法目标且不停抵消摩擦／碰撞速度时，可把重量留给参数与动画；反之每次碰撞都需 kinematic 特例，也应重选。
- [研究] **升级验收**：比较坡速、坡顶腾空、窄台阶、旋转平台站位／起跳、侧挤／低顶受击及 root-motion 撞墙。人判可控与重量，不设通用坡角／snap／恢复时长。
- [研究] **二改**：旋转升降平台边缘受击；核平台、自移和击退各应用一次，起跳解除吸附，落地／重生清旧附着。牵动大量技能／相机脚本时先收拢所有权；人决定动量与恢复手感。

### 5. Unreal 对照：同样的动作，不同的引擎责任

核实：2026-10-14 UTC。以 UE 5.8 官方机制／API、Lyra 和 Mover 状态校正跨引擎责任；未读受限引擎源码或运行样例。[一手／研究]

**[一手／研究] ✅ 优先成熟 CMC。** [CMC 机制](https://dev.epicgames.com/documentation/en-us/unreal-engine/understanding-networked-movement-in-the-character-movement-component-for-unreal-engine)：TickComponent→PerformMovement 组织外力／重力、root motion／RMS，再进 PhysWalking/Falling；MOVE_Custom/PhysCustom 为扩展点。UE 已承担运动组织，不另造 motor；联网才补 saved moves／重演，直接 SetLocation 会被校正，单机无须预测。

**[一手／研究] 平台／root motion 沿原生语义。** [离台速度 API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UCharacterMovementComponent/GetImpartedMovementBaseVelocity) 按 bImpartBaseVelocityX/Y/Z 继承，勿叠加平台速度；[Root Motion 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/root-motion-in-unreal-engine) 由动画驱 Movement Component，Walking/Falling 的 Z 受模式／重力约束，不随意切 Flying。相应提取模式令 Animation Graph 走 Game Thread，须核预算。

**[一手／研究] RMS 不要求 GAS。** RMS 参数由 CMC 执行、handle 管移除；GAS 仅提供任务入口。[Lyra 5.8 技能实例](https://dev.epicgames.com/documentation/unreal-engine/abilities-in-lyra-in-unreal-engine?application_version=5.8) 的 GA_Hero_Dash 在力结束后仍保持 ability 禁开火／跳，GA_ADS 结束恢复速度／输入／镜头。借请求、限制与撤销，不搬全部多人依赖；突进可受击二改同时核位移源、Montage、限制及镜头。

**[一手] 版本与模块状态。** [5.8 正式发布新闻](https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available) 为 2026-06-23；[固定 5.8 Mover 页](https://dev.epicgames.com/documentation/unreal-engine/mover-in-unreal-engine?application_version=5.8) 仍 Experimental、API／属性／数据可变并继续支持 CMC。非沿用 5.7 标签，也不要求升级。

**[一手／研究] 👀 结构性缺口才评估 Mover。** [5.8 对比页](https://dev.epicgames.com/documentation/unreal-engine/comparing-mover-and-character-movement-component-in-unreal-engine?lang=en-US) 列宽形体、模块模式／回滚，CMC 已用于多个发行项目；Mover 以模拟步命令／模式／instant effects 改状态，多个 world frame 可合一 tick。非标准形体或组合需求才迁移；联网才比较时间线／校正，不随时写 velocity 或无证推荐异步后端。

**[一手／研究] 样例只借机制。** [Game Animation Sample](https://dev.epicgames.com/documentation/en-us/unreal-engine/game-animation-sample-project-in-unreal-engine) 以动画为主、traversal 为简单示例，可借 pose／trajectory／movement 连接，非完整攀爬战斗；Lyra 也非发行游戏源码。引擎／内容条款另核，未下载或接受新协议。

**[研究] 后续验收**：保留平地、坡顶、旋转平台和撞墙突进，二改平台边缘突进→受击→死亡→重生；核胶囊、网格、movement mode、平台贡献及动作限制。确需联网才加延迟／丢包的预测校正验证。

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

## 菜单补研：跨暂停、改键与设备切换保住控制

核实：2026-10-14 UTC。主线 2／3；将 04 的菜单“关键页可达”深化为切换后可控、反馈可信，并限定 02 逻辑动作注入的证明范围；依据为官方文档和发行游戏更新。[一手／研究]

### 1. 先补玩家体验缺口，不因手柄支持迁移 UI

[研究] 按住动作进入暂停→设置／改键→弹窗→换设备→返回，目标是焦点、可用操作与返回位置清楚，确认不穿透。先定交互层、焦点、绑定提示与恢复政策；设备恢复不必自动恢复战斗。

[一手] [Celeste 官方 changelog](https://www.celestegame.com/changelog.html)：v1.4.0 加菜单改键、删冲突重开组合，修教程内进配置冻结；v1.3.3.20 beta 修关闭菜单未刷新 movement/dash-only；v1.3.3.13 beta 要各菜单动作留唯一键、失败发声并保滚动后提示可见。beta 规则不作普适标准。

[研究] 保住改键退出路径，把全局快捷键纳入冲突检查，退出菜单刷新玩法输入；不照搬唯一键／长按重置算法。

[一手] [XAG112](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/112) 要跨屏一致、布局变后合理导航及重绑定退出提示；[XAG113](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/113) 要焦点清楚，含覆盖弹窗。仅借连续控制目标，未做认证。[研究]

### 2. 原生机制够用的条件与新增成本

| 原生路线与直接依据 | 改变的建议 | 何时仍不足 |
|---|---|---|
| [uGUI 2.0 Navigation](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/script-SelectableNavigation.html)支持 Automatic／Explicit；滑条的值方向用于改值，不能用该方向移出滑条 [一手] | [研究] ✅ 保留已有菜单，只修不合布局的导航关系，并验证滑条进出路径 | [研究] 动态列表或布局重排使大量手工关系失效时才补共享策略，不据此否定 uGUI |
| [Unity 6.3 UI Toolkit FAQ](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-faq-event-and-input-system.html)可指定方向焦点；初始无焦点会使起点不可预测，禁用 UIDocument GameObject 后层级重建，重新启用时须再次设置焦点 [一手] | [研究] ✅ 新布局项目沿现有选型，初开／重开均设置焦点；层级重建后重新查找目标，不永久保留旧元素引用 | [研究] 自动导航不符合实际布局时补局部规则；“第一次打开可操作”不能证明第二次仍可用 |
| [Input System 1.19 UI support](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/UISupport.html)：uGUI 需要 UI Input Module，UI Toolkit 2023.2+ 可用 project-wide actions；uGUI 背景点击默认清选择；UI Toolkit `Button` 的 `ClickEvent` 与手柄 submit 不同，而 `Button.clicked` 覆盖两者；UI 消费输入不自动屏蔽 gameplay action [一手] | [研究] ✅ 先用原生映射、区分 UI／玩法模式；混用时保护／恢复有效选择，沿控件语义激活 | [研究] 业务回调测试绕过绑定／焦点，须补输入路径；两层同时响应不能靠 debounce 掩盖 |
| [CommonUI Input Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/commonui-input-technical-guide-for-unreal-engine)：激活树参与路由，停用节点不参与；导航仍与基础 UMG 相同。[ActivatableWidget](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/CommonUI/UCommonActivatableWidget)可提供目标焦点、缓存恢复目标及最末激活节点的焦点刷新；默认不自动激活或注册 Back [一手] | [研究] ✅ 简单且已可靠的 UMG 保留；🧪 跨层返回、模态和设备提示需求反复出现时再评估 CommonUI，明确激活、返回和焦点策略 | [研究] 路由不包办导航，返回目标仍须验证；新依赖和配置应比第二个菜单继续复制政策更省维护 |

[一手／研究] [CommonUI 与 Enhanced Input 集成页](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-commonui-with-enhnaced-input-in-unreal-engine) 仍标 Experimental，并留“as of UE 5.2”测试不足说明，不能据当前入口断言新版可靠或全面禁 CommonUI；仅使用该集成时核锁定版，普通 UMG 不增依赖。

[一手／研究] [PlayerInput 1.19](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/PlayerInput.html) 有设备丢失／恢复通知，但暂停、焦点与恢复仍由项目在现有设备管理中处理。

### 3. 先读可复用实现：官方 UI vs Game Input

[一手] 固定 InputSystem `05e45ddbaf18a93245b068d787d74b738b90d01c` 的 [UIvsGameInputHandler.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/UIvsGameInput/UIvsGameInputHandler.cs)、[样例 README](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/UIvsGameInput/README.md)、[根 LICENSE](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/LICENSE.md) 已读；Unity-dependent Companion License，非跨引擎 MIT。[package.json](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/package.json) 标 1.20.2／最低 6000.0，与 1.19 文档分列，不据元数据确认稳定发行。

- [一手] `SetUIEngaged`（304–327 行）在 UI 模式启用 UI map、停用玩法动作，并恢复上次导航选择；退出时保存选择、清空当前选择并恢复玩法。`SetPlayerActionsEnabled`（331–345 行）特意保留 UIEngage 动作，避免把退出入口一同禁用。主菜单入口另在 `Update` 先置 `InMenu` 再停用 gameplay input 和选择首按钮，`OnContinueClicked` 恢复游戏。
- [一手／研究] 恢复选择仅检查 null，未在该路径检查目标是否激活／可交互；`OnControlsChanged` 注释明说不支持 mixed models，状态机只有 `InMenu`，没有嵌套弹窗栈。因此样例不作完整改键、热切换及多层菜单底座；这是静态覆盖缺口，不是已复现故障。
- [研究] **✅ 优先借用样例中的显式 UI 交接与选择保存机制，⛔ 从零写等价事件总线或整包照搬。** 简单 uGUI 项目从锁定已发布包的样例出发，保留必要输入配置，按缺口补有效目标后备／嵌套返回；第二个菜单只缺这两项就不引框架。UI Toolkit 只借切换边界，无须迁移。官方身份与源码可见不证明它是已发行高品质菜单的完整实现。

#### 混用补核：提示变化不等于退出 UI

核实：2026-10-17 UTC+8；主线三。已承诺混用时，提示、交互方式与焦点分开判断；设备通知不自动意味着退出 UI。[研究]

- **Unity 样例前提。** [一手] [场景配置](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/UIvsGameInput/UIvsGameInput.unity) 连接 OnControlsChanged；[PlayerInput 契约与实现](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/PlayerInput/PlayerInput.cs#L574-L595) 通知涵盖设备集合、scheme、绑定／键盘布局。[handler 80–106行](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/UIvsGameInput/UIvsGameInputHandler.cs#L80-L106) 按分配设备判 ControlStyle，明确不支持 mixed models；GamepadJoystick 时 SetUIEngaged(false) 保存／清选择、停 UI map、启除 UIEngage 的 Player 动作，但不关主菜单或改 InGame。[研究] 借交接，勿整段作提示刷新；非 Unity 全体混用限制。
- **设备与交互语义分开。** [一手] DevilutionX [#4242 原报告](https://github.com/diasurgical/DevilutionX/issues/4242) 报光标缺失／暗／卡，窗口／屏外原因仅猜测；[2022-04-03 固定修复](https://github.com/diasurgical/DevilutionX/commit/79c7eee10aee93d7fa3429decdcb5921a1522bd5) 分 ControlDevice／ControlMode，手柄模拟指针仍保设备身份，硬件光标另判。补丁亦改调色板，未有独立复测，不能单因归属或称漂移修复。
- **混用可另定提示。** [社区／一手] Deadlock [2024-09 原帖](https://forums.playdeadlock.com/threads/game-hitches-when-using-analog-input.27479/) 报摇杆＋鼠标时图标交替／卡顿；[2024-11-07 官方更新](https://forums.playdeadlock.com/threads/11-07-2024-update.44786/) 改 glyph swapping，提供 Automatic／Keyboard & Mouse Only／Game Pad Only，并改动作／配置、提示重绑。aeodyn0 于 11-08 开 Overlay 重配后自报正常。[研究] 多项同改不能归功提示锁或确认根因，只支持独立提示策略。
- **UE 合成事件。** [一手] [CommonUI Input Technical Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/commonui-input-technical-guide-for-unreal-engine)：手柄 Accept 可合成鼠标点击；导航找目标、设 user focus，下 tick 才移合成光标。[研究] 鼠标事件不证明物理鼠标切入，先核路径，不直接重建选择。

**采用与撤回。** [研究] ✅ 混用中仅提示变化时保留菜单、有效焦点与获准输入；实际导航／指针操作或明确进出 UI 时才交接。互斥模式可保留可靠切换。振荡先分真实混用、合成事件和噪声；提示锁定不能掩盖确认／返回不可达，新增政策破坏混用就撤回。

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

### 手柄反馈补研：结束、暂停与设备交接分开核

核实：2026-10-16 UTC+8；主线三。动作停收输入未必停止马达：分别核事件期限、持续来源与玩家／设备交接。[研究]

**两作者机制。** [一手] STK `b0689319aed2c932f76fbd86729f39cdf3fd7d65` 的 [local_player_controller.cpp L474–508](https://github.com/supertuxkart/stk-code/blob/b0689319aed2c932f76fbd86729f39cdf3fd7d65/src/karts/controller/local_player_controller.cpp#L474-L508) 给碰撞设有限时长，过滤紧邻事件，回滚重演不触发，选所属玩家允许反馈设备，[SDL 调用 L262–274](https://github.com/supertuxkart/stk-code/blob/b0689319aed2c932f76fbd86729f39cdf3fd7d65/src/input/sdl_controller.cpp#L262-L274) 继续传时长。Barony `962a5ce36d10207beef7d8673876e0cebf8e76e4` 的 [滚石 L1552–1579](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/src/actboulder.cpp#L1552-L1579) 未停且有水平速度才周期请求，[效果 L3011–3028](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/src/player.cpp#L3011-L3028) 有期限，[L2842–2899](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/src/player.cpp#L2842-L2899) 清过期并按优先级播放。[研究] 持续来源可续有限反馈，但仍有尾部；非通用时长／恢复政策。

**设备修正与后续撤换。** [一手] Barony [87255f2](https://github.com/TurningWheel/Barony/commit/87255f20b1d8c2545e57ef8143935ac00813cdd9)（2022-06-20）因 gamecontroller／haptic ID 不同改从 joystick 打开、插拔重取；次日 [d6eeaad](https://github.com/TurningWheel/Barony/commit/d6eeaadafcd2b3cd02de4ac75de0f9e3fab0473b) 改用 SDL_GameControllerRumble 并停 reinitHaptic。当前 [doRumble／stopRumble L3155–3197](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/src/player.cpp#L3155-L3197) 播放／停止可分别走 GameController／Haptic，故须核实际后端；仅静态差异，非已复现残震。[研究]

**Unity 1.20.1。** [一手] 固定 `a934411756c8862cb0f54da514a9b7cc1c000a2b`，[haptics 文档](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/Documentation~/gamepad-haptics.md) 分单设备／全设备；[DualMotorRumble.cs](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Devices/Haptics/DualMotorRumble.cs) Pause 输出零但留缓存，Resume 重发，Reset 清缓存／输出；SetMotorSpeeds 无时长也不查暂停。[研究] 输入停收／任务取消不等于马达停止，持续写入也须管。用 [PlayerInput.devices L846–860](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/PlayerInput/PlayerInput.cs#L846-L860) 配对，局部菜单只处理所属玩家，不盲恢复旧命中；硬件时序另验。

**UE 5.8。** [一手] [Force Feedback](https://dev.epicgames.com/documentation/en-us/unreal-engine/force-feedback-in-unreal-engine) 从目标 PlayerController 播放，时长至最后关键点；[Client Play](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Game/Feedback/ClientPlayForceFeedback) 有单次／循环、Ignore Time Dilation、Play While Paused，同 Tag 替换；[Client Stop](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Game/Feedback/ClientStopForceFeedback) 按 Effect／Tag 停；[PlayDynamicForceFeedback](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/APlayerController/PlayDynamicForceFeedback) 有 Start/Update/Stop，负 Duration 至主动停止，C++ 可留 handle。[研究] 有限／循环已够用就保留，不因 Unity 接口迁动态反馈。

**采用与撤回。** [研究] ✅ 沿现有动作明确期限及停止／恢复条件：过期短脉冲不补播，持续来源恢复前重判；有意冻结后续演的效果可保留。换设备／退出作废该玩家旧任务，可达旧设备发送停止，新设备只接当前有效反馈，不误清其他玩家。原生足够即停；跨菜单延续旧命中需堆特例时撤回。

**许可与缺口。** [一手] STK 文件 GPL-3.0-or-later；Barony [LICENSE.txt](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/LICENSE.txt) BSD-2-Clause，[README](https://github.com/TurningWheel/Barony/blob/962a5ce36d10207beef7d8673876e0cebf8e76e4/README.md) 仍须购游戏，资产另限；Unity Companion 仅 Unity-dependent，UE 仅读文档。[研究] 未找到暂停残震修复＋复测完整链。二改预注册：短命中开菜单、持续来源暂停后取消、A→B 换设备并保第二玩家；核旧补播、误停新反馈、旧设备／他人误操作。停止命令不保证马达即时停。

### 本地多人补研：设备配对与 UI 目标范围分开核

核实：2026-10-16 UTC+8；主线三。仅确需本地多人时，按玩家区分设备、动作和菜单选择；分屏不证明输入独立。[研究]

**版本／许可。** [一手] [Unity 6.0 官方包页](https://docs.unity.com/en-us/engine/6000.0/manual/packages-list/packages-all/pack-safe/com-unity-inputsystem) 列 released 1.20.1，[1.20.1 tag API](https://api.github.com/repos/Unity-Technologies/InputSystem/git/ref/tags/1.20.1)→`a934411756c8862cb0f54da514a9b7cc1c000a2b`，[package.json](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/package.json) 同版／最低 6000.0；不重标前文 1.19 文档与 1.20.2 样例，也不要求升级。[LICENSE](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/LICENSE.md) 为 Unity-dependent Companion，只借机制。

#### Unity：玩家动作、设备与 UI 选择分别落到实例

1. **按所属玩家读。** [一手] [1.20.1 PlayerInput/UI 文档](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/use-player-input-component-ui.html) 要用 PlayerInput.actions，全局 InputSystem.actions 绕设备分配；module 与 PlayerInput 配同 asset 后由后者传玩家配置。[PlayerInput.cs L1389–1407](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/PlayerInput/PlayerInput.cs#L1389-L1407) 核复制／重定向，[L1708–1710](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/PlayerInput/PlayerInput.cs#L1708-L1710) 关联 InputUser；[L294–302](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/PlayerInput/PlayerInput.cs#L294-L302) 说明第一位可用原资源、后续复制，非每次全 Clone。[研究]
2. **current 非玩家身份。** [一手] [Gamepad.cs L613–627](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Devices/Gamepad.cs#L613-L627)：新增手柄及非 noisy 输入变化可改 current，不建议并发多手柄依赖，改用 PlayerInput/InputUser；未掉线也不能以近期设备归属角色。[研究]
3. **单 module 不给多焦点。** [一手] [导航契约](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/Documentation~/supported-ui-input-types-navigation.md) 每帧一份 move/submit/cancel；[多人 UI 文档](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/Documentation~/introduction-multiplayer-ui-input.md) 让每人独立 InputModule、MultiplayerEventSystem、actions，playerRoot 定目标树。[研究] 来源与目标都需隔离，复制 Canvas 不够。
4. **playerRoot 非全路径隔离。** [一手] [InputSystemUIInputModule.cs L506–515](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L506-L515)、[L634–639](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L634-L639) 查点击 raycast，[L905–941](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L905-L941) 查导航；[L475–489](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L475-L489) 先移再按钮／滚轮，[L598–603](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L598-L603) 先写 pointerEnter 再在 hover 查 root，[L787–796](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L787-L796) 从 pointerEnter 找 IScrollHandler 并 ExecuteHierarchy，无同样 root 检查。[L876–901](https://github.com/Unity-Technologies/InputSystem/blob/a934411756c8862cb0f54da514a9b7cc1c000a2b/Packages/com.unity.inputsystem/InputSystem/Runtime/Plugins/UI/InputSystemUIInputModule.cs#L876-L901) 将 submit/cancel 发 currentSelectedGameObject。[研究] 滚轮须单独验，初始／返回选择错误不能兜底；仅 uGUI 静态链，未复现越界，不荐 workaround。

**历史报告。** [一手] [Unity issue 1306361](https://issuetracker.unity3d.com/issues/input-system-ui-input-module-lets-the-player-navigate-across-other-canvases) 于 2021-01-15 报摇杆跨 Canvas 导航，标 1.3.0 修复。[研究] 保留跨玩家验收，当前树已有目标检查，不称 1.20.1 仍坏或照抄旧 CanvasGroup 绕路。

#### Unreal：输入映射、UI 所有者、焦点和显示范围分别确认

[一手] UE 5.8 [Enhanced Input](https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine) 将 contexts 加到特定 LocalPlayer 的 subsystem。[研究] IMC 定义可共享，生效实例取所属 PlayerController/LocalPlayer；此契约不等于硬件配对。

[一手] [Set Owning Player](https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/Player/SetOwningPlayer?lang=en-US) 指 UI 所属 PlayerController，[Set User Focus](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Widget/SetUserFocus) 设用户焦点（owning user 可 SetFocus），[AddToPlayerScreen](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/UMG/UUserWidget/AddToPlayerScreen) 放所属视口。[研究] 所有者、目标与显示位置分别核，任一均非输入隔离证明。[CommonUI 技术说明](https://dev.epicgames.com/documentation/en-us/unreal-engine/commonui-input-technical-guide-for-unreal-engine) 亦要求正确 user、沿用 UMG 导航，不为多人强加 CommonUI。

**采用、撤回与二改。** [研究] 单玩家保留原路径；共享菜单先定操作者，并发独立菜单才分输入／选择实例。仍越界先查 module、导航与脚本选择。二改加第二玩家菜单，同时导航／确认，一人退出时另一人继续；重排布局复查跨区导航，滚轮另验另一玩家区域的归属。共享菜单按约定，不强求独立。

### 模拟输入补研：轻推幅度与处理链不能丢

核实：2026-10-16 UTC+8；主线三。轻推即满幅时先核连续幅度与处理链，再调灵敏度；依据 Unity 1.19、UE 5.8 与 STK 降敏／历史触摸修复。[研究]

1. **Unity 死区非单位化。** [一手] 1.19.0 tag→`ca8d898356596a91bda6505e506cc1a4bb3a9fa6`，[package.json](https://github.com/Unity-Technologies/InputSystem/blob/ca8d898356596a91bda6505e506cc1a4bb3a9fa6/Packages/com.unity.inputsystem/package.json) 同版；[Gamepad.cs](https://github.com/Unity-Technologies/InputSystem/blob/ca8d898356596a91bda6505e506cc1a4bb3a9fa6/Packages/com.unity.inputsystem/InputSystem/Devices/Gamepad.cs#L138-L149) 给 sticks 加 stickDeadzone，[StickDeadzoneProcessor.cs](https://github.com/Unity-Technologies/InputSystem/blob/ca8d898356596a91bda6505e506cc1a4bb3a9fa6/Packages/com.unity.inputsystem/InputSystem/Controls/Processors/StickDeadzoneProcessor.cs#L32-L57) 重映射幅度后按比缩向量，保连续值；min=0 取全局默认，非关闭。[1.19 绑定文档](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/ActionBindings.html)：完整 stick binding 再加会叠 control 死区。
2. **合成模式分开。** [一手] [Vector2Composite.cs](https://github.com/Unity-Technologies/InputSystem/blob/ca8d898356596a91bda6505e506cc1a4bb3a9fa6/Packages/com.unity.inputsystem/InputSystem/Actions/Composites/Vector2Composite.cs#L126-L154) 的 Analog 读 float、数字模式读按钮，默认 DigitalNormalized。[研究] 先绑定整个 stick，重组才选 Analog；不为防键盘斜走统一 normalized，方向／离散玩法可主动舍幅度。
3. **UE 两层 modifiers。** [一手] 5.8 [FEnhancedActionKeyMapping](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/EnhancedInput/FEnhancedActionKeyMapping) 处理 raw key，[UInputAction](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/EnhancedInput/UInputAction) 处理 final action；[Enhanced Input](https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine) 输出逐级传后续 modifier/trigger，[DeadZone](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/EnhancedInput/UInputModifierDeadZone) 将 lower–upper 映射 0–1、外部截断。[研究] Axis1D/2D 保幅度，按动作选轴形并查重复变换；未证所有模板／设备同默认值与次序。
4. **STK 的降敏与触摸修复。** [一手] `supertuxkart/stk-code@0334c6cd7432de391b7981b153df32b7bf6d83ea` 的 [gamepad_device.cpp](https://github.com/supertuxkart/stk-code/blob/0334c6cd7432de391b7981b153df32b7bf6d83ea/src/input/gamepad_device.cpp#L149-L169) 分数字／模拟，可选保符号平方降中心敏度；[2018 修复 b7856d4](https://github.com/supertuxkart/stk-code/commit/b7856d4991503fc3d13eb567b9dbed2faa8db832) 改触摸 getSteeringFactor，死区重映射与 sensitivity 缩放分开，非手柄修复。文件 GPL-3.0-or-later，只借机制，不给通用曲线。[研究]

**采用与撤回。** [研究] ✅ 保住所需幅度，逐层核原生处理器，仅补漂移／微调缺口。死区过大损微调，过小露漂移；曲线及轴向／径向按动作选，不给统一阈值。方向离散动作可舍弃幅度。

**二改预注册。** [研究] 对照原生与单项调整，记录回中、起动、低幅、满幅及轴向／斜向；加入另一手柄或跨动作复用配置后核耦合。撤销重复死区／单位化已解决就不扩框架。

### 4. 用第二个菜单判断共享层是否值得

[研究] 未来用原生暂停→设置→返回，再加滑条、动态隐藏项和确认层。改确认键并换设备，核焦点／导航、实际绑定提示、返回目标、过期缓存与当前按住政策；重绑定取消也走返回路径。

[研究] 记录二改复制的政策与旧页回归；少量共享开关边界仍难维护，才引框架，无减负则撤回。AI 补绑定／导航／回归，人判操作负担；日志与截图互证，状态注入不代验设备路径。

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


### 6. 背包负担：改交互还是改携带规则

核实：2026-10-15（UTC+8）。[研究] 已决定用什么却反复寻找，先加稳定快捷引用；囤积挤掉玩法才改携带成本，排列本身有价值则保留。

- **Factorio 稳入口。** [一手] Twinsen／Klonan [FFF278（2019-01-18）](https://www.factorio.com/blog/post/fff-278) 为 0.17 发布前说明：快捷栏由库存改引用，耗尽留映射，防制作随机入栏／补货换槽，补偿原容量。[研究] 借引用，不抄十页或声称普遍体验改善。
- **Cogmind 改规则。** [一手] Kyzrati [2021仓储重设](https://www.gridsagegames.com/blog/2021/04/design-overhaul-1-capping-inventory/)：叠仓囤备件、挤主动槽／超 UI，起初反对硬限、试后采用，同时增单件容量／高端选项。[2023发布后回顾](https://www.gridsagegames.com/blog/2023/03/cogmind-beta-11-player-stats/) 确认 Beta 11 去叠，极大背包少、平均容量反增。[研究] 非简单缩包或因果乐趣证据，借容量／重量／槽位协调，便利交换仍有用。
- **Backpack Hero 排列即决策。** [一手] Jasper Cole [2022访谈](https://www.escapistmagazine.com/backpack-hero-interview-jasper-cole-inventory-management-roguelike/)（经编辑澄清）称源自重位置卡牌原型，摆放／放弃后果形成策略。[研究] 自动安排可能删玩法，不按点击少判好；不采其对别作的个人批评或“前所未有”背书。

[研究] **复用与补缺：**沿现有物品命令、导航和库存所有者，快捷栏只引用。类型与具体实例分开：材料和带耐久／词条装备可有不同政策；明确耗尽、卖出、替换后的映射与重选。

[研究] **成本与撤回：**入口改动保用户排布／焦点；容量改动还涉及掉落、消耗、负重、构筑和旧档超额。入口已解决就不改规则；只增加搬运／丢物或毁构筑则撤回，排列即玩法不自动排序。

[研究] **二改预注册：**新增非同质变体或改堆叠上限，核补货、卖出绑定实例、满包交换、重复命令及旧档。人判是在重复寻找还是有价值取舍，不单看点击数。只借机制，不复制商业代码／美术。

## 存档复用补比：序列化、落盘与玩家恢复分开选

核实：2026-10-14 UTC。[一手] 固定源码、官方接口与商店条款；[研究] 比较现成保存能力与游戏自有恢复责任，未做故障注入。

### 1. Mindustry：实际游戏把格式、内容映射与文件恢复分开

[一手] `Anuken/Mindustry@17012d61d9e4c3cbd9820d87e81c24495486ac53`，commit API 2026-10-08；[README](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/README.md) 有发行入口，[GPL-3.0 LICENSE](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/LICENSE) 允许商用但带分发义务，非 MIT。仅研究快照，不跟开发分支／复制代码美术，资产权利未逐项核。

- [一手] [SaveIO.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/io/SaveIO.java) 注册 Save1–13、最新版写、按版读，未知版独立报错；先主档移备份再写，catch 移回，load 遇 SaveException 尝试备份。格式与恢复分路。
- [一手] isSaveFileValid 仅 getMeta；[SaveVersion.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/io/SaveVersion.java#L48-L76) metadata 不读全部 map/entities，readContentHeader（627–654）按保存名映射、block 有 fallback，但未定所有缺内容政策。
- [一手] [Saves.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/game/Saves.java#L120-L199) 按 sectorPreset／旧位置先临时移档，再集中回填目的地／sector info，支持位置交换；迁移含地址、关卡身份及附属进度。
- [研究] 借职责与交换顺序，不移植 Java／Arc 对象图。按类型映射改名；真实出现存储位置互换时才加暂存／回填。
- [一手／研究] 主档先移、终止后 catch 不执行，不是断电事务；[列表发现](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/game/Saves.java#L65-L78) 排除含 backup 的名称。仅备份时菜单能否恢复须另验，内部 fallback 不保证可达。

### 2. Thrive：类名存在，不等于迁移器仍适用于新格式

[一手] `Revolutionary-Games/Thrive@eceb8011d5e86b19dfa75de9e55eee6815fd1450`，commit API 2026-10-14；[README](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/README.md) 有 Steam/itch，[LICENSE.txt](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/LICENSE.txt) 为 GPL-3.0-or-later＋独立 mod 动态加载例外，非整模块闭源复制许可。活动不证明旧接口改造完成。

- [一手] [Save.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/Save.cs) 世界存 save.bin、metadata JSON；ReadFromArchive 按对象版读，v2 加 JukeboxPlaybackState、旧版 null。当前格式有兼容读取，不是全坏。
- [一手] 旧 LoadJSONStructureFromFile 抛 NotSupportedException，WriteSaveJSONToFile 抛 NotImplementedException；[ISaveUpgradeStep.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/ISaveUpgradeStep.cs) 仍注册 0.8.3.0-rc1→0.8.3.0 step，PerformUpgrade 调旧入口，注释待 archive 改造。
- [一手] [SaveUpgrader.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/SaveUpgrader.cs) 有到目标版 step 才可升级；[SaveListItem.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/SaveListItem.cs) 分损坏、不兼容、可升级、较新版再发 UI 事件。旧 helper 不证明普通加载／UI 必然到达。
- [研究] ✅ 借失败分类，⛔ 不用遗留 JSON upgrader。区分损坏、版本过新和内容不兼容；追实际入口／可达条件，不凭类名采用，也不为简单 checkpoint 搬来 Godot 对象图。

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

### 4. 最小实现边界与后续验收

[研究] 保留窄 DTO／内容迁移、现成序列化／存储、游戏恢复提示三项责任；可仅用少量函数，不另建 SaveManager 框架。

1. **先验候选。** 分别按版本／完整内容读取主档、已验副本、迁移前副本；独立构造候选，失败不残留半个世界。显示恢复时间／章节，保留故障档；全失败由玩家选新槽。
2. **防止覆盖有效旧档。** 读取失败、回退后 autosave、升级重试都需保护。恢复完成前停该槽自动覆盖，接受新快照后按政策清理；磁盘满不先删唯一副本。
3. **沿平台提交能力。** 现成路径不满足才补暂存／替换／发现；try/catch、`.bak` 或 rename 名称不保证跨平台断电安全。
4. **二改实际地址。** V1 两关卡→V2 改名换位置→V3 删除／换道具；核仅存备份、metadata 完整但实体截断、迁移中断、恢复后 autosave 和位置互换，断言进度／奖励及副本可达。

[研究] 以上仅预注册。既有组件可靠且更省维护就停止自研；复杂对象图只增引用／迁移负担时退回稳定 ID 的窄 DTO。


### 5. 续玩不等于撤销失败

核实：2026-10-15 UTC+8。[研究] 单局需要跨多次游玩时，在既有一致状态边界提供续玩；撤销旧决定另定，不默认任意世界快照。

- **Enter the Gungeon。** [一手] Dave Crooks [2017-02-03 更新说明](https://blog.playstation.com/2017/02/03/enter-the-gungeon-supply-drop-update-out-today-on-ps4/) 称 Save and Quit 或是发布后最常请求，新增层末保存续玩；出口角色／冷冻室也可换菜单。[研究] 借转换边界，非需求排名调查或通用层间间隔。
- **Don’t Starve。** [一手] Klei [Why Can't I Save?（2019-06-25）](https://support.klei.com/hc/en-us/articles/360029882191-Why-Can-t-I-Save) 说明黎明、黄昏、关闭自动保存，刻意不提供手动安全网。[研究] 保后果仍可离开，但非崩溃／断电恢复或任意快照保证。
- **Cogmind。** [一手] Kyzrati [Quicksaving and Restore Points（2019-09-27）](https://www.gridsagegames.com/blog/2019/09/quicksaving-restore-points/)：原有续玩之外给 Adventurer/Explorer 加旧恢复点，Rogue 永久死亡；与最新续玩档分开、仅当前局，另补死亡 UI。2022-03-23 评论称部分玩家受益，非受控结果。[研究] 借职责，不抄文件／模式，榜单排除原文不确定。

[研究] **复用与补缺：**沿 DTO、存储、迁移和 Session／Encounter 一次性结算，只补保存边界、提示与恢复入口。明确奖励提交前后、当前局／永久进度恢复范围；交接前保唯一有效档，死亡／新局后的恢复资格按玩法失效。回退玩法和故障备份各自维护。

[一手] Unity 6.3 [OnApplicationQuit](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnApplicationQuit.html)：iOS 挂起不调用。[研究] 沿已有检查点／反馈，不仅退出时才启动保存；UE 有 SaveGame 也不保证结束前写完，未新增 UE 退出 API。

[研究] **成本与二改：**间隔过长仍迫使等待，任意帧快照增加弹体／计时器／动作恢复负担；先缩段或明确回段首，短计分挑战可不加。延长遭遇后核奖励前后退出、失败、重入、重复读档及新局的状态／奖励／等待；永久死亡模式另核不能借备份复活，允许恢复的模式不套此限。

### 6. 保存响应：把捕获、序列化与写入分开判断

核实：2026-10-16 UTC+8；主线 3／4。保存卡顿先分捕获、序列化和写入成本，正常退出交接保存结果；依据双引擎线程契约、开发者方案与回归记录。[研究]

**原生线程边界。** [一手] Unity [6.3 JSON serialization 的 Performance 节](https://docs.unity3d.com/6000.3/Documentation/Manual/json-serialization.html) 可后台 JsonUtility，但另一线程不得访问／改正在处理对象；UE [5.8 AsyncSaveGameToSlot](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UGameplayStatics/AsyncSaveGameToSlot) 在 game thread 序列化、worker 写、game thread 回调，delegate payload 须线程安全。[保存指南](https://dev.epicgames.com/documentation/en-us/unreal-engine/saving-and-loading-your-game-in-unreal-engine) 小档／菜单可同步，大档／游玩优先异步；非全离主线程或断电持久保证。

[研究] **✅ 窄 DTO＋现成存储，只移走可独立工作。** 在完整状态边界捕获，后台 DTO 及可变引用不得继续被玩法访问／改写；浅拷贝不足。捕获若是热点，先减数据／调整边界；跨帧采集未必一致。同步路径达预算就不加线程／队列。

**合并与退出。** [一手：作者自述] Evil Trout [2026-08-21 保存经验](https://eviltrout.com/blog/2026-08-21-tips-for-saving-game-data-in-godot/) 以两部 Roottrees／Galley House 游戏说明重要变化请求、线程短窗合并、正常退出强制最终保存并需同步。[研究] 重复写才合并，窗口按可失进度；退出等覆盖目标状态的结果，较新快照可满足、旧请求不可代报。不得阻塞回调 game thread，失败提供恢复而非无限等待。原文未公开合并／交接／退出实现，不证一致性／跨平台覆盖；备份顺序、等长校验及故障下降比例均未采作有效性／收益证据。

**fork 非默认。** [一手] [FFF #408（2024-04-26）](https://factorio.com/blog/post/fff-408)：Factorio 子进程保存，当时限 macOS/Linux、大 RAM，仍有冻结；[社区／一手] [2.0.33 回归帖](https://forums.factorio.com/viewtopic.php?t=126407) 报 2.0.33 全程冻结、回退 2.0.32 正常，维护者 2025-01-28 称修于 2.0.34。[研究] 只支持平台／内存／回归成本，不荐 Unity/UE fork 或称当前故障。

**退出与二改。** [一手] [6.3 wantsToQuit](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-wantsToQuit.html) 可取消正常退出，但 Editor Stop 忽略，iOS/iPadOS 不能阻终止；OnApplicationQuit 的移动／Web限制仍在。[研究] 正常退出与挂起／强杀分开。扩档／增请求后分别记捕获、序列化、写入、回调、长帧／内存；验重复请求、新进度退出、失败及重开，不提前报成功。挂起／断电耐久另验。

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

## 本地化补研：新语言与旧名字一起维护

核实：2026-10-14 UTC。主线 3／4；补 04 稳定 key、fallback 与长文之外的内容更新风险：字体覆盖、旧名字及样例文案再次失效。[研究]

### 1. 发行游戏的修复指向旧内容与资源寿命

[一手] [Celeste 官方更新记录](https://www.celestegame.com/changelog.html)：1.3.0 加韩语、调日语与命名，仅加载当前语言字体，不支持的名字用 Madeline 代空白；1.3.1 又修意大利 Journal 换行。仅已发行修改报告，无内存测量。

[研究] **✅ 新语言连带旧名字、语言页与旧界面检查。** 项目自选跨语言字体、命名限制或替代显示；Celeste 政策不外推身份／聊天，混排仍可能需其他字体。二改新增旧字库外名字、切语言读档，核可理解与驻留预算。

### 2. 官方输入样例可借机制，未交付完整本地化

[一手] 同 InputSystem `05e45ddbaf18a93245b068d787d74b738b90d01c`，通过文件接口读 [RebindActionUI.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/RebindingUI/RebindActionUI.cs)／[GamepadIconsExample.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/RebindingUI/GamepadIconsExample.cs)；版本与 Companion 许可沿前文。

- `UpdateBindingDisplay` 按 binding ID 查找并调用 `GetBindingDisplayString`，再向显示事件传递文字、device layout 和 control path；`OnActionChange` 响应 `BoundControlsChanged`，包括键盘布局导致的重解析
- 文件仍有 localization TODO；`UpdateActionLabel` 直接显示 `action.name`，重绑定等待、复合绑定部件提示和取消倒计时使用硬编码英文及字符串插值
- 图标样例按 DualShock／Gamepad layout 和 control path 选图，找不到图时回文字；但空 layout/path 分支直接返回，不能从样例推断旧图标一定被清除。它是有限设备演示，不是全部控制器的显示政策

[研究] **✅ 借绑定刷新，把展示名、等待、取消／倒计时接 String Table／Smart String。** 保留内部 action 身份，按语言处理复数，教程引用真实绑定；随现有改键／设备／重开回归，不照搬样例为发布菜单。

### 3. 字体优化随内容更新，不把 ATG 当无成本开关

[一手] Unity 6.3 [ATG 启用说明](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/enable-and-use-atg.html) 属 UI Toolkit，默认关，需项目及元素配置，不支持静态 font asset，非 uGUI/TMP 能力。[静态字体迁移说明](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/migrate-static-font-assets.html)：减内容用子集创建动态资产，减首次生成用 atlas 预填；SDFAA 下许多项目不需预填，不统一预热。

[研究] **🧪 UI Toolkit 确需复杂排版才评估 ATG，稳定 uGUI 不迁移。** 子集／预填充随新增译文更新，含数字、符号及允许用户文字；源字体已删字形不能动态恢复。比较冷显与切语言驻留，无收益退回完整合适字体。

[一手] [font subsetting 文档](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-font-subsetting.html) 推荐 FontTools 并保 OpenType 特性；[FontTools subset 正文](https://fonttools.readthedocs.io/en/stable/subset/) 默认 ignore-missing-unicodes，text/text-file 间接缺字亦可不报，no-ignore 才失败。[研究] 按字体职责严格核必须字集／承接字体，不以退出成功证覆盖，也不将分工缺字误判全失败。字体修改／嵌入／分发另核，未裁剪或推荐文件。

[一手] UE [Asset Localization](https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-localization-in-unreal-engine) 推荐 runtime 换 culture／不受限用户文字用 composite font；整资产按 culture 替换限受限场景，已加载切换可需重启。非全部常驻要求。[研究]

### 4. 保留与否及证据边界

[研究] 保留旧内容／字库更新与消息重译责任；AI 查硬编码、占位符和回归，人定名字政策及可读性，目标设备排版／首次显示／内存待验。

[研究] 未采纳：Factorio 简繁误选仅有搜索线索；Unity 6.0 翻译页的 ATG 限制不套用 6.3，也不从删限制推定组合可靠。

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

## 音频并发补研：保住起音不等于保住每次提示

核实：2026-10-14 UTC。主线 3；Mindustry v154 及锁定 Arc／SoLoud 的静态源码表明，04 的并发上限须拆成入口合并、同组抢占与全局竞争；提高 priority 不保证提示进入播放。[一手／研究]

### 1. 真实游戏的历史改动与依赖链

[一手] [Mindustry v154 发布](https://github.com/Anuken/Mindustry/releases/tag/v154)（2025-12-16，Beta）声部 32→100、每类约 6 并换声音，作者意图防单声淹没。[研究] 多项同改，不单归因限额或照抄数量。

[一手] 发布源码声明的依赖链（非发行二进制溯源）：Mindustry `d1e0307d3906bb350e80d8969a2464ed0b771ffb` 的 [gradle.properties](https://github.com/Anuken/Mindustry/blob/d1e0307d3906bb350e80d8969a2464ed0b771ffb/gradle.properties)锁 `archash=46c0956944`；Arc v154 为 `46c0956944af81db1145625e07108c196d94e260`，其 [build.gradle](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/build.gradle#L69-L72)设置 `SOLOUD_MAX_VOICE_COUNT=100`，[同文件 L144-L146](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/build.gradle#L144-L146)在本地依赖目录不存在时拉取 Anuken/soloud 的 `2025.12.01`，对应 `4b4266fed49b45afc191728b64adf1faca943f5b`。不使用当前 main 解释旧版行为。

### 2. 三道门控及不能省略的反例

- **入口。** [Arc Sound.java L31-L85](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/src/arc/audio/Sound.java#L31-L85) 启 checkFrame 后按同 Sound 默认 16ms 拒新实例，大音量可改上声音量／pan 再回 -1；实为毫秒非注释“同帧”，未判敌人／位置／危险，尚未进入底层优先级。[一手]
- **组。** [Audio.java](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/src/arc/audio/Audio.java#L9-L15) 默认 6 在加载应用；[SoLoud play](https://github.com/Anuken/soloud/blob/4b4266fed49b45afc191728b64adf1faca943f5b/src/core/soloud_core_basicops.cpp#L32-L67) 未指定时每 source 独立组，非语义组。[SoundPriority.java L73-L109](https://github.com/Anuken/Mindustry/blob/d1e0307d3906bb350e80d8969a2464ed0b771ffb/core/src/mindustry/audio/SoundPriority.java#L73-L109) 才共享火焰／导弹／arc/pulsar，降修复／脚步优先级；最小可打断 `min(0.25s, 长度一半)`，部分脚步更长。[一手]
- **全局／组满不同。** [findFreeVoice_internal L309-L391](https://github.com/Anuken/soloud/blob/4b4266fed49b45afc191728b64adf1faca943f5b/src/core/soloud_core_getters.cpp#L309-L391) 全局看 priority、年龄／protected；组满只找可打断且非 protected 最老者，否则拒绝，不比 priority。“no lower volume”注释不符分支；priority 3 非 PROTECTED，仍受同组／同更高优先级路径影响。[一手]

[研究] 保护起音也可能拒绝后续重要事件。✅ 复用分组、优先级、重触发，仅补事件配置：普通同类可合并，关键警告避开提前拒绝它的入口／组；第二警告保旧还是替换由玩法定。换变体仍共享类别额度，不宣称 Mindustry 已保证任意警告。

### 3. Unity／Unreal 只复用相关机制

[一手] Unity 6000.3 [priority](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-priority.html) 优先虚拟化低优先级、同级看音量并留位置，数值越小越高（与 Arc 反），WebGL 不受此设；[isVirtual](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-isVirtual.html) 主声及全部 one-shots 被剔才 true，false 不证指定 one-shot 听见。[研究] 沿原生／Mixer 补类别限制，Source 状态非逐事件回执。

[一手] UE [Sound Concurrency](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-concurrency-reference-guide) 原生共享组／淘汰／Retrigger Time，多组全满足；重触发拒绝无视虚拟化。[研究] 先配原生、明确警告限制，虚拟化不是被拒提示待播队列；其他责任见 WP6。

### 4. 最小采用与未来验收

[研究] 沿现有音频入口，由 AI 查事件／类别／重要性及拒绝原因，人决定合并／打断。未来连发中插警告，再加变体与第二警告，分别核提交、合并／拒绝／抢占、虚拟化及实际起音／方向／时效；过期不补播。记录 voice／CPU，调用成功不代验听见。

[研究] SoLoud 通用文档不替代此 fork；其他音频责任见 WP6。

### 5. 持续状态声的反例：先校正可听范围与恢复政策

核实：2026-10-15 UTC+8。以下持续声反例收窄短事件限额建议，依据开发者报告、固定配置与引擎文档。[研究]

**持续声反证。** [Factorio FFF-341](https://www.factorio.com/blog/post/fff-341)（2020-04-03）环境上限 15→50 缓解雷达断声却更拥挤；管道无水仍有声，作者归于 working_sound／同类限额冲突，去限并缩范围后自报改善，非所有循环应无限。[一手／研究]

[一手] 2.1.21 固定 `374934f81f82b09ec9fc459f92a316bd642ddd82` 的 [sounds.pipe](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/prototypes/entity/sounds.lua#L248-L272) 管道 persistent／渐变／平滑／活动率，门短声 aggregation，车轮持续仍限；[WorkingSound 当前文档](https://lua-api.factorio.com/latest/types/WorkingSound.html)（2.1.21）persistent 合同 prototype 并忽略同类上限。[研究] 按语义选，非短限／长不限，现代配置非 2020 原修复。[用途声明](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/README.md) 供 mod 查定义，不开放引擎／音频。

**原生差别。** [一手] Unity 6000.3 [maxDistance](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-maxDistance.html)：Linear 边界零、Custom 保末值、Logarithmic 忽略该值继续衰减；缩 maxDistance 非通用回收。[priority 虚拟化](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-priority.html) 虚拟化留位置／状态。UE 5.8 [attenuation](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-attenuation-in-unreal-engine) falloff 从内形边缘算，衰减／声像分开；[EVirtualizationMode](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/EVirtualizationMode) Restart 从头、PlayWhenSilent 占 voice、SeekRestart Experimental。其余见 [WP6 引擎对照](2026-10-14-game-wp6-audio.md#105-unityunreal同一质量目标不同原生职责)。

[研究] 短事件过期可丢，持续声按当前活动恢复；先调范围、曲线、渐变与恢复，成本为逐类／复合听验。仅不承担独立定位的环境层可合并；危险声不为省 voice 随意缩范围。

[研究] **二改预注册：**新增持续技能／机器声，在竞争前后跨可听边界并切活动状态；核警告、误重启／残留与结束后假起音，再记 voice／CPU。藏预警或制造假事件则撤回。

### 6. 警报已听清却判断错：先改触发语义

核实：2026-10-17 UTC+8；主线三。补充04的症状选择：已经听得清却误导行动时，修事件触发／提示含义；只降音量或重报频率不能修正语义。OpenRA的撤回与Factorio的提前救援反例支持窄条件，不推广成所有声音都应少播。[研究]

- **少播仍然报错。** [OpenRA #7787](https://github.com/OpenRA/OpenRA/issues/7787)（2015-03-29）报告己方侦察敌基地也播“敌军正在接近”；维护者确认实际触发是敌军进入视野，主动侦察与敌军来袭不等价。[#7799](https://github.com/OpenRA/OpenRA/pull/7799)试将同一敌方玩家的单位合并通报，但作者在[关闭说明](https://github.com/OpenRA/OpenRA/pull/7799#issuecomment-89345192)明确少播仍未解决侦察误报；该PR未合入，不能写成已发布改进。[一手／社区]
- **撤掉通用播报，保留有明确用途的发现。** [#7841](https://github.com/OpenRA/OpenRA/pull/7841)于2015-04-04合入，撤去Red Alert与Dune 2000普通单位的AnnounceOnSeen。可访问的PR最终head `fd143a5eb05c8a3e1032c5cfa698c72827fb4fe1`中，[arrakis.yaml](https://github.com/OpenRA/OpenRA/blob/fd143a5eb05c8a3e1032c5cfa698c72827fb4fe1/mods/d2k/rules/arrakis.yaml#L52-L57)仍给沙虫配置WormSign及雷达提示，[D2k player.yaml](https://github.com/OpenRA/OpenRA/blob/fd143a5eb05c8a3e1032c5cfa698c72827fb4fe1/mods/d2k/rules/player.yaml)保留EnemyWatcher。这是当时配置与历史撤回，不断言当前版本仍相同。[一手]
- **更少预警也可能太迟。** Factorio 0.13的[原帖](https://forums.factorio.com/viewtopic.php?t=27255)中，玩家KatherineOfSky报告只在设施被毁后听到警报，早期分散建设需要在受击时介入；5thHorseman则指出后期自动防御能使重复受击告警烦扰。同帖开发者Rseding91确认不是bug，未评价这项取舍是否适合该玩家。[社区／一手：开发者回复] 这支持按是否仍需人工介入保留预警，不能把某玩家需求当所有阶段默认，也不从该帖推断后续版本政策。

[研究] ✅ **本次针对提示已可闻却误导行动的情况，先改触发／提示含义。** 先使“发现”“来袭”等提示与实际检测条件一致；若只代表发现，就改提示或局部撤掉，别靠全局冷却掩盖。承担抢救窗口的受击预警不能被“已损失”的结果通知替代；同一危险的重复通知是否合并，另核新地点／新危险是否仍需行动。未进入播放的漏声仍按前述门控排查，被遮住的声音仍先改混音。

[研究] 静读公开讨论、PR与固定配置，未运行游戏或音频实验；不复制音声资产或移植实现。后续对照应同时覆盖主动侦察、真正来袭、已能自动处理的持续受击与需要人工救援的新威胁，记录玩家能否及时判断下一步；本次不新增实测授权。

## 运动可读性补研：关键提示不能靠历史积累补成另一个位置

核实：2026-10-14 UTC。主线二／三；补 04 的运动可读性：时域历史可能造成提示错位、残留和显露延迟，抗锯齿／上采样须在完整动作中验收；依据为官方文档、固定源码及历史 issue。[一手／研究]

### 1. 先区分输入错误、支持边界与积累取舍

- **支持边界。** [一手] [URP 6.3 motion vectors](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors.html)仅支持 opaque／alpha-clipped，不支持透明材质对象矢量；对象矢量还要求 shader pass、renderer 与对象／材质状态满足条件。ForceNoMotion 仍需对象 pass 覆盖相机矢量为零，不能视为省掉 pass 的捷径。[研究] 透明预告与余烟不能统一交给一个“打开运动矢量”修复。
- **相机相对运动。** [一手] [6.3 troubleshooting](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors-troubleshooting.html)说明跟随移动对象的相机若只用 camera motion，会给对象错误的大矢量；先查 Per Object Motion 与 Frame Debugger 的 MotionVectors pass。[研究] 屏幕位置近似不动，不代表世界空间对象无需矢量。
- **形变输入。** [一手] [6.3 Shader Graph 支持](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors-shader-support.html)的 Time-Based 会以今／前帧 Time 运行顶点子图，其他用户参数须逐帧不变；运行时改变技能强度等参数时，不能假定此模式自动正确。Custom 可提供前帧到当前的局部空间位移；Alembic 选项用于相应缓存与 PlayableDirector，普通 MeshRenderer 错开会读错流。[研究] AI 可核对动画参数变化来源与历史值归属，不能批量开启所有选项代替诊断。

### 2. 固定实现：不能抄反参数方向，也不能把最高档当辨识保证

[一手] 公开 `6000.3/staging` 解析为提交 `2d2e78cc9d6254bc6e7c9c5552cea053508e86cb`（2026-07-01）。固定快照不证明某个 Editor 补丁已含相同代码；部署时仍核锁定包／Editor。

- [TemporalAA.cs](https://github.com/Unity-Technologies/Graphics/blob/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb/Packages/com.unity.render-pipelines.universal/Runtime/TemporalAA.cs)：`baseBlendFactor` 表示历史贡献，getter／setter 与内部 `m_FrameInfluence` 通过 `1-x` 转换；后者是当前帧贡献。两参数方向相反，不能互抄。
- 同文件的 `varianceClampScale` 说明较低值减少拖影但增加闪烁；`VeryLow` 不做 motion dilation，注释适用于无／低运动；`VeryHigh` 启用更多过滤。这些处理路径和成本取舍不证明哪档在本项目中最清楚。
- [TemporalAA.hlsl](https://github.com/Unity-Technologies/Graphics/blob/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb/Packages/com.unity.render-pipelines.universal/Shaders/PostProcessing/TemporalAA.hlsl)的 `DoTemporalAA` 采历史颜色、裁剪，再把 `frameInfluence` 传给 `ApplyHistoryColorLerp`；后者由历史色向当前色插值。已核对执行表达式。

[一手] [6.3 AA 文档](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/anti-aliasing.html)承认快速高反差物体可能产生 TAA 拖影；该版本 TAA 与 MSAA、Camera Stacking、Dynamic Resolution 不兼容。MSAA 主要解决几何边缘，不修 specular／texture aliasing。[研究] 运动矢量只是诊断的一项，修正不保证消除拖尾；不为透明提示默认增加相机栈。

### 3. 可比较方案与撤回条件

| 路线 | 采用条件与具体改变 | 撤回／不适用条件 |
|---|---|---|
| ✅ 修正原生运动输入，保留时域路线 | 不透明角色／武器／形变对象矢量缺失或错误时，先核 pass、前后帧位姿和参数，再调滤波 | 透明支持受限或矢量正确仍有残影时，停止盲加开关；单人不默认重写通用 shader |
| 🧪 减少历史积累或收紧颜色约束 | 场景确实需要时域稳定性，但短暂关键提示残留／移动糊掉；小步改变历史贡献与 clamp，保留原值 | 闪烁／边缘爬动更妨碍判断时撤回；锐化不保证恢复错位历史中的真实提示 |
| 🧪 非时域基线 | 相同分辨率比较 SMAA／FXAA；以几何轮廓为主且路径兼容时比较 MSAA，保住原动作规则 | 高光／纹理闪烁、细小轮廓丢失或预算失败就撤回；不得从“没有历史拖影”推导“所有画面问题解决” |
| ✅ 收窄内容频率与透明装饰职责 | 危险边界／方向采用足够屏幕尺寸的稳定形状，与余烟分开；风格允许时让关键轮廓由简单 opaque／alpha-clipped 几何承载 | 硬边、覆盖面积或遮挡改变范围理解就撤回；不把全部烟雾改 cutout，不通过任意延长预告时间偷偷改玩法 |

[研究] 最低内部分辨率难以稳定采样关键形状时，比较简化细节、增显示尺寸或输入分辨率；上采样不保证补出短暂细节，不给通用像素阈值。

### 4. STP 对照不能只看相机菜单

[一手] [URP 6.3 STP](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/stp/stp-upscaler.html)要求 TAA 预处理，会隐式启用；需要 Shader Model 5.0，不支持 OpenGL ES。[研究] 非时域对照同时核 Upscaling Filter／render scale，不能只改相机 AA 标签；STP 仍需正确运动输入。

[一手] [6.3 STP Debug Views](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/stp/stp-debug-views.html)提供输入运动、重投影色差及 Sensitivity；绿色包含无法预测的快速运动、新显露区域或错误矢量，红色标示排除时域预测的像素。[研究] 用原生视图定位，再以实际动作判断可读性；调试色不是评分，也不证明透明效果无拖影。

### 5. 历史反例：实际修复与当前限制分开

- **UUM-72748：可见集合错误确实需要修复。** [一手] [官方 issue](https://issuetracker.unity.com/issues/14144/motion-vectors-for-an-object-are-included-in-the-urp-motion-vector-pass-when-the-objects-layer-mask-is-filtered-out)记录被 layer mask 排除的对象仍进入 URP Motion Vector pass，移动时出现幽灵立方体；2022.3.30f1、6000.0.4f1 可复现，标注修复于 2022.3.37f1、6000.0.8f1，只测 Windows 11。[研究] 这是历史上的颜色／矢量集合不一致，不是 6.3 普遍缺陷；旧工程先核补丁，不用滤波掩盖。
- **UUM-26709：较高档位也曾触发专有故障。** [一手] [官方 issue](https://issuetracker.unity.com/issues/6004/temporal-anti-aliasing-taa-produces-severe-artifacting-when-quality-set-to-very-high)记录 URP 14.0.4–16.0.0 的特定 Timeline scrubbing 场景，High 正常、Very High 黑白伪影；页面对相关分支标 Fixed，但未给精确修复补丁。[研究] 升级／换档须验证实际动作；该历史问题不足以禁用当前 Very High，也无精确修复版可引。

### 6. 后续获准验证与二次修改

[研究] 固定规则／相机，分开比较分辨率／render scale、时域路线及内容简化。验出现、急转、显露、停止／消失、双攻击及低帧率；二改 Time 形变为技能参数驱动或加透明余烟，再核矢量和边界。AI 构造对照，人判误读，连续观察配帧时间。

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


## 像素网格补研：低速步进不是物理插值失效

核实：2026-10-14 UTC；主线一／三。像素抖动先区分世界、低分辨率场景和最终输出取整；依据两作者原型／演示及 Unity 6.3 URP／Cinemachine 3.1.7。[一手／研究]

### 1. 两位作者的方案为什么不能互相代替

[一手：作者实述] Slow Rush [2024-01-26 复盘](https://www.slowrush.dev/news/pixel-perfect-rendering/)：吸附相机改善纹理／背景摇摆却让其他画面跳，对象也吸附仍失败；sub-texel scrolling 只顺画布，内部慢物体仍逐格。为摩擦停稳、弧顶／旋转而接受过滤；仍为矩形代理、真精灵未接、性能未测，Noita/Broforce 比较未独立核。

[一手] Daniel Ludwig `code-disaster/gdx-mellow-demo@901d2bcae3819807e54814a4a34d3c72d1236f68`（2016-02-07）：[MellowGame.java L297–368](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/core/src/com/codedisaster/mellow/MellowGame.java#L297-L368) 按 WORLD_UNIT_SCALE 取整 scene camera，余量给放大输出 offset；UpScaleAndBilinearFilterShader 再拆小数，[fragment shader](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/core/assets/shaders/mellow.fsh) 四采样加权。对象为 tilemap，未证明独立角色慢动平滑。

[研究] 只借低分辨率／输出分工；demo 写死尺寸／倍率、运动含逐帧项，不作底座。[一手] [LICENSE](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/LICENSE) MIT，外部 tileset 另署名未清资产权；博客未读到，机制来自下载固定源码，未构建。

### 2. Unity 原生能力：能对齐像素，不替玩家决定取舍

[一手] Unity 6.3 [URP Pixel Perfect Camera](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/2d-pixelperfect-ref.html) 已内置 Universal 2D，不另装 Built-In 包；Pixel Snapping 仅渲染、不改 Transform，Upscale Render Texture 画参考或按视口放大的临时纹理。Point/Retro AA 仅 Crop Frame=Stretch Fill，前者清楚可闪、后者软边减闪，非慢对象通用修复。

[一手] [Cinemachine 3.1.7 Pixel Perfect 扩展](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachinePixelPerfect.html) 协调 orthographic size，blend 中暂非 pixel-perfect；Upscale Render Texture 可用尺寸少、会偏构图。Target Group 限制仍称 Framing Transposer，不当当前 Position Composer 已验缺陷。

[研究] ✅ 整格风格用原生并接受／验慢速步进；🧪 连续运动更重要才比较分辨率与过滤。阻尼／插值不消除最终量化，不为显示改碰撞或拾取；这些 Unity 配置不映射为 UE 等价菜单。

### 3. 后续验证与撤回条件

[研究] 同美术／动作比较严格网格、增分辨率与有界过滤，观察慢角色、跟随、平台停转及视差；二改窗口／缩放后核边缘、危险提示、鼠标对齐与构图。尺寸不一、危险模糊、成本显著或风格偏离就收窄／撤回。

[研究] 本节另未运行 shader。


## 信号取舍补研：呈现设置保住玩法信息，辅助规则另有承诺

核实：2026-10-14 UTC；布局于 10-17、远端入口于 10-18（UTC+8）补核。主线一／三；改变 04：先改表达再缩规则；按监看、局部命令、连续编辑选入口。证据为下列作者生产说明、手册及固定源码，未测体验收益。[研究]

### 不同类型的一手证据与边界

- **回合策略。** [一手] Matthew Davis [Into the Breach Design Postmortem，2019](https://media.gdcvault.com/gdc2019/presentations/Into%20the%20Breach%20Postmortem%20Final.pdf)，PDF 14、31–36：确定性／预告要求交代目标／类型，遂限三类攻击、正交方向、稳定属性并裁武器。仅 PDF 文字；表达可约束设计，不证明即时全预告或三类必好玩。
- **Dead Cells 29。** [一手] [29 系列](https://deadcells.com/patchnotes/29)：29.1 配色覆盖 HUD／菜单／图标／武器／物品，属性不只用颜色名，另有全图揭示；29.2 修重要资产被背景滤镜遮。辅助按自身承诺核，不要求保持标准未知信息／难度。[研究]
- **Dead Cells 35。** [一手] [35 系列](https://dead-cells.com/patchnotes/35) 未单标小版本项修隐形仍有轮廓，35.7 修弹体漏轮廓；多显／漏显都有风险。页含 alpha/beta，不作同日全平台发行或当前缺陷。

### 常显与按需查询：补回正文遗漏的条件

- **低频查询保入口。** Cogmind [2022 作者实作](https://www.gridsagegames.com/blog/2022/03/special-commands-menu-design/) 将低频命令集中到 Space 菜单，保快捷键；地图尺可从菜单开启、Space 关闭，未添常驻按钮以免占位。[Beta 11 发布](https://store.steampowered.com/news/posts/?appids=722730&enddate=1650631665&feed=steam_community_announcements)确认菜单可用。[一手] 不把即时威胁藏进低频入口。[研究]
- **高频并列也会挤占常用项。** Factorio [FFF363](https://www.factorio.com/blog/post/fff-363) 因嵌套制作分类打断操作，将平铺改默认；[1.1.0 发布](https://forums.factorio.com/91657)确认。[一手] [发行后原帖](https://forums.factorio.com/viewtopic.php?start=100&t=91657#p522402)中 KatherineOfSky 称物流低频，平铺隔开常用库存／制作而关闭，Serenity 认同。[社区] 频繁一起用的放近，低频可发现地展开；作者频率不能代表所有玩家。[研究]

### 远端界面：监看、局部命令与连续编辑

- **连续编辑与看一眼不同。** Factorio [FFF380](https://www.factorio.com/blog/post/fff-380) 作者试玩后将跨地点选择融入可操作 Remote View；即时旋转还简化当前／未来方向双状态逻辑，实物仍经机器人交付。[FFF423](https://www.factorio.com/blog/post/fff-423) 随后为仅查研究／警报补摘要和悬停摄像，避免丢失当前上下文。[一手] 是生产取舍，未量化收益。
- **操作未必先移镜。** Zero-K 项目 [Interface 手册](https://zero-k.info/mediawiki/Interface) 第 4／7 项分别给出小地图下令与消息跳转；所读普通页声明修订 9822。固定头 `e358dac2`（2026-10-16）的[589–600 行](https://github.com/ZeroK-RTS/Zero-K/blob/e358dac2ca2f9163c5290f700d74466016305b04/LuaUI/Widgets/gui_chili_minimap.lua#L589-L600)提供三种左键政策；[1002–1036 行](https://github.com/ZeroK-RTS/Zero-K/blob/e358dac2ca2f9163c5290f700d74466016305b04/LuaUI/Widgets/gui_chili_minimap.lua#L1002-L1036)只在无活动命令时进入移镜处理。[一手] 本轮未审完整引擎命令链，不将手册当实测。
- **采用与成本。** [研究] 监看先保上下文；目标明确的局部命令可留概览；辨不清目标／需连续编辑才进细节。保命令、选中、移镜含义，物品与到访规则另定。误选就收窄概览操作，反复切换才扩大；三入口可组合，不是升级阶梯。跨两类游戏仅支持条件选择，无工时／乐趣优劣证明。

### 采用、删减与不能外推的部分

[研究] ✅ 信号的对象／时点／范围／结果共享玩法状态，预览随局面更新；🧪 先减装饰，仍读不清才减组合。唯一节奏／方向线索补等义提示或明确辅助规则；声转视觉不默认增加精确坐标、透墙／提前预告，未实测字幕能替代空间听觉。⛔ 滤镜／描边／图标数量不作完成标准，也不必先建无障碍框架；无跨类型通用排序或点击数阈值。

### 第二次修改：仅预注册，不运行游戏

[研究] 在已有遭遇中新增远程弹体／状态，不另造脱离实际玩法的展示台，与旧敌人混用；在实际提供的默认、静音、减粒子、改色／轮廓设置下核危险源、时点、范围和结果；只记录可见／可听信息，不以效果组件已启用代替辨识。隐形／未发现对象随规则显隐，全图等辅助按新承诺验，切回再核旧状态。第二种颜色／状态覆盖场景、HUD、物品说明与旧内容；持续挤占提示则减组合／重做表达，再决定保留招式。

有远端界面时，新增地点／命令后核监看、下令、切回、常用信息位置与误选；活动命令不被误作移镜，概览不足辨认就进入细节。[研究]

**验证范围：** 一手正文／PDF 文字、手册与所链固定源码；未运行游戏或色觉／听觉测试。AI 查映射，人判节奏、可读性及辅助承诺。[研究]

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


## 空间容错补研：动作已开始却卡在边角

核实：2026-10-15 UTC；主线一／三。动作已接受却卡微小边角时，比较碰撞表达与局部纠偏；时间缓冲、坡阶、量化与足锁不代替此选择。[研究]

### 两种玩法的作者证据：局部补偿不是统一缩小碰撞体

- **Factorio。** [一手] [FFF346（2020-05-08）](https://www.factorio.com/blog/post/fff-346)：岸线旧矩形像无形墙，改按玩家位置／过渡形状通行，敌人可不同；后加玩家参数，造地安全检查仍整包围盒，误判合法站位落水。作者称旧修缺测试、早期记忆可能不准。[研究] 同角色各调用统一政策，非所有实体同规则，非当前源码审计。
- **Celeste。** [一手] [Celeste & Forgiveness](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html) 分上升顶角侧挪、水平冲刺上缘、半实心上推，与时间缓冲并列。[研究] 按动作容小误差，非全动作／统一像素或受控收益。

### 固定实现与后续修订：没有墙，不等于可安全纠偏

[一手：源码静读] `NoelFB/Celeste@1b0ce45c75e05649ae91b44a8bb6b196684e4352`：

- [Player.cs L2399–2422](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs#L2399-L2422)的水平碰撞纠偏限于 Dash／RedDash 及纯水平速度分支，按有限偏移距离试上下位置，无 Solid 后调用 `MoveVExact`／`MoveHExact`；着地可蹲下分支优先。
- [L2582–2613](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs#L2582-L2613)的上升顶角修正按水平速度符号选择左右，找到无 Solid 点后直接改位置。[研究] 两条应用路径也不同，不能从字段名抽成一个通用“纠偏半径”；本轮只审公开 Player 类，不声称审完商用游戏全部碰撞回调。

[一手] [V1.4.0.0 changelog](https://www.celestegame.com/changelog.html) 后补刺顶冲刺角／单向平台不修、用 hurtbox、禁向刺地下修，固定旧树缺这些条件。[研究] 借有限／状态搜索，勿照搬旧版；核路径、落点、危险／通行，各类顶角不一定同条件。

[一手] 同 SHA [README](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/README.md)／[MIT LICENSE](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/LICENSE) MIT 仅代码，非游戏／资产；只借片段，不作 Unity/UE 即用控制器，作者网页不授权商业资产。

### 代价与另一个作者的维护反例

[一手] [FFF344（2020-04-24）](https://www.factorio.com/blog/post/fff-344)：mod 单位启地形过渡后，抽象寻路未支持而崩溃，先退后补；敌人还涉及防御策略与计算，约5%仅历史粗测。[研究] 维护涵盖实体与世界修改调用，不只碰撞循环。

[一手] [Mina the Hollower 更新页](https://www.yachtclubgames.com/blog/mina-the-hollower-update-notes/) 页头 2026-06-26；1.0.5 缩 Spark 排出框、排除箱／雪球／可动可破坏物；1.0.6 修钓竿跳落 speed bump 卡墙排出并调位置偏好。小版本无各自日期，不共用页头作发布日期。

[研究] Spark 不是玩家；重叠排出也不同于 Celeste 动作容错。本例只说明对象、动作与位置偏好仍需维护，不作算法排名。

### 最小采用、撤回与第二次修改

[研究] ✅ 轮廓误导先改碰撞／关卡；🧪 有意宽容微小误差才沿运动所有者补有限、状态限定纠偏。精确卡位本是挑战则保留；穿错路线、入险或豁免增多就收窄／改空间，不一律扩大搜索或缩身体。

[研究] 二改择一：危险移动平台或可放置地形。对照原规则、空间修正、局部纠偏，在相同接受时刻核位置、分支、危险与所选路线；回查旧角、两侧通路、单向／动态障碍、重开／放置位置。敌我按各自政策。

[研究] AI 追移动／放置／脱困分支并备同输入回归，人定容错和风险；后续记录维护成本，有限查询未必比改关卡省。

**实际范围：** 静读原文／补丁／固定源码与许可；另未看嵌入视频或测最佳偏移，不给双引擎伪等价配置。

## 听点补比：镜头改变时从哪里听

核实：2026-10-15 UTC。[研究] 补世界声听点选择，与可听范围／恢复、选曲和相机取景分开。

### 视口与角色附近都有成立的条件

| 依据与证据等级 | 可改变的选择 | 反例与边界 |
|---|---|---|
| [一手] Factorio 作者在 [FFF-332](https://www.factorio.com/blog/post/fff-332)（2020-01-31）说明默认听点移到屏幕中心，便于地图视图，并调整缩放／衰减 | [研究] 管理／远程操作可先让当前操作视图有声音 | 身体附近声音可能变远，故不作近身动作默认，也不由旧文推当前全部参数 |
| [一手] NieR:Automata 开发者在[声学说明 Part 2](https://www.platinumgames.com/official-blog/article/10027)（2019-01-18）说明，多种视角下默认把听点放在角色附近；舞台等场景另改听点，并对交接作插值 | [研究] 镜头经常拉远／换视角而交互仍围绕身体时，可先保持近身声音稳定；远处演出再局部交接 | 这是非独立游戏对“听点必随相机”的反证，远处展示仍可例外；单人不复制其 Wwise 工程、预设或制作规模 |

[一手] [2.1.21 更新](https://forums.factorio.com/viewtopic.php?p=705355)（2026-10-06）修退出 remote view 过强多普勒，未公开算法／未核发行通道，不称速度归零。[研究] 切镜／传送勿意外变听者高速，有意音高仍按玩法。

### 固定源码：位置、朝向、速度是不同输入

[一手] Overgrowth 固定提交 `245fe4828631c84c0023d29d1525f5716ccb6106` 提供另一种 3D 动作实现：

- [玩家镜头脚本](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L11179-L11188)在 focused_character 分支把相机位置、朝向／上方向和零听者速度传给 `UpdateListener`；[Camera::GetPos](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Graphics/camera.cpp#L153-L155)包含追踪距离偏移，不能把它当角色中心
- [对白镜头](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/dialogue.as#L1180-L1189)取得控制时同样传零听者速度；[自由镜头](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/cam.as#L317)却传入 `vel`，并非所有模式都归零
- [脚本转发](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Scripting/angelscript/asfuncs.cpp#L1953-L1955)及同文件 L2069 的注册通向[音频接口](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Sound/sound.cpp#L116-L120)，分别设置 listener position、velocity、orientation

[研究] 按模式明确位置／朝向／速度；源码未说明全部意图。零听者速度不归零声源速度或全关多普勒；“角色位置＋相机朝向”也不等于相机位置算方向。

[一手] [README](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/README.md)／[LICENSE](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/LICENSE)：代码除例外 Apache-2.0，游戏美术／关卡不开放，资产分发需书面许可。[研究] 只借机制；实际复制另核文件／依赖并保通知。

### 原生入口够先选听点，不保证跨引擎分离声像和衰减

- [一手] Unity 6.3 [AudioListener](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioListener.html)默认在主相机，官方也建议按游戏尝试相机或角色；场景只应有一个正常工作的 listener，混响区亦以听者位置影响听到的声音。[研究] 先移动／定向单一听点，不以双 listener 过渡；文档未承诺分别设置衰减与声像原点
- [一手] UE 的 [SetAudioListenerOverride](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Game/Audio/SetAudioListenerOverride)可通过 PlayerController 覆盖位置／朝向；附着组件时参数是偏移，否则是绝对值。[研究] 特殊视图进入／退出均须交接，避免后续继承旧位置
- [一手] UE 另暴露 [Set Audio Listener Attenuation Override](https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/Game/Audio/SetAudioListenerAttenuationOverr-)。[研究] 节点页说明有限，不能证明遮挡、混响和距离消费者均沿此覆盖，也不能给 Unity 编造等价接口；确有需求才分离

### 成本、撤回与第二次修改

[研究] 改听点须回查衰减／空间效果，不靠全体 2D 或增益补坐标。blend 可能穿无关区域，cut 可能突变；近身失衡则回角色附近，远程缺反馈才局部交接。

[研究] 二改加远程观察／演出，固定近远声源，验拉远、转身、切镜、退出及暂停恢复，记录位置／朝向／速度和方向／响度／音高。音高先核多普勒，响度先核坐标／衰减；人判交接自然，原生足够就停。

**实际范围：** 静读作者／官方资料、固定源码与许可，未试听。

## 拾取坐标补研：显示变换不能靠 DPI 猜回去

核实：2026-10-16（UTC+8）；主线三。拖拽／拾取／小地图先核生产与消费坐标，再补映射；依据 Unity 6.3／UE 5.8 及针对性公开纠正。[研究]

### 原生路径先行，只有跨空间时才转换

| 场景 | 本轮核到的契约与采用边界 |
|---|---|
| Unity 6.3 UI Toolkit 事件 | [`position`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/UIElements.IPointerEvent-position.html) 属于 panel；[`localPosition`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/UIElements.IPointerEvent-localPosition.html) 属于 currentTarget，传播到不同接收元素时会变化。[一手] 在需要的空间已有位置就直接使用，不再当原始屏幕像素缩放。[研究] |
| 外部屏幕位置到 UI Toolkit | [官方 FAQ](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-faq-event-and-input-system.html) 给出 `RuntimePanelUtils.ScreenToPanel` 与 `panel.Pick`，并区分 uGUI 屏幕左下原点和 UI Toolkit 左上原点。[一手] 先辨原点再转换，不对已转换事件再翻 Y 或除 DPI。[研究] |
| uGUI 自定义局部交互 | [`RectTransformUtility.ScreenPointToLocalPointInRectangle`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/RectTransformUtility.ScreenPointToLocalPointInRectangle.html) 转到指定 RectTransform 局部平面；Overlay 的相机为 null，点击可取 `PointerEventData.pressEventCamera`。返回 true 只证明击中平面，不证明在矩形内。[一手] 额外检查实际交互区域；不能把此 API 与 ScreenToPanel 互换。[研究] |
| 相机世界拾取 | [`ScreenPointToRay`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Camera.ScreenPointToRay.html) 接受左下原点屏幕像素；[相机射线说明](https://docs.unity.com/en-us/engine/6000.3/manual/cameras/camera-view/camera-rays/introduction) 区分 `ViewportPointToRay` 的相机视图 0–1 坐标。[一手] 直接渲染到屏幕视口时用该相机的 `ScreenPointToRay`；已有归一化视图坐标才用 `ViewportPointToRay`。小地图等另行显示相机纹理时，先按图像区域、裁剪及 UV 映回相机视图；不提供留黑、裁剪和纹理复用的通用公式。[研究] |
| UE 对照，本轮页面标为 5.8 | [`Local to Viewport`](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/UserInterface/Geometry/LocaltoViewport) 的 Pixel Position 是视口分辨率单位，可用于 line trace；Viewport Position 用于视口内其他 widget。[`Get Mouse Position on Viewport`](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Viewport/GetMousePositiononViewport) 返回 viewport widget 局部空间。[一手] 不按名字把所有 viewport 坐标当像素；5.6 参数页本轮未成功读取，不宣称已核该版本。[研究] |

### 实际纠正与当前版本反例

[社区] [2022 年公开报告与回复](https://discussions.unity.com/t/panel-raycaster-ignores-ui-settings-dynamic-resolution-scalar/874565/2)：用户在 2022.1.0b11 将 UI Toolkit 渲染纹理放入缩放 Canvas，描述显示与输入不一致，尝试重建纹理和修改 raycaster。SimonDufour 建议通过 `SetScreenToPanelSpaceFunction` 映射外部显示变换，指出 UI Toolkit 无法自动知道这些操作。**改法未获复测确认**，不作当前缺陷或效果证据。

[一手] Unity 6.3 [同名 API](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/UIElements.PanelSettings.SetScreenToPanelSpaceFunction.html) 仍明确支持 targetTexture 用于网格时的映射：有效命中转为纹理像素，无有效目标返回面板外坐标；有超出面板表面的 3D 元素变换时指向另一个 3D 入口。相对地，6.3 已有[原生 World Space UI](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/world-space-ui.html) 和 [Panel Input Configuration](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/world-space-panel-input-configuration.html)。[研究] 普通按钮／原生世界 UI 保留事件路径，自行重显示纹理才补映射；旧帖不支持全部手写 raycast。

### 最小采用与二改预注册

[研究] 在现有处理函数注明两端空间、原点／单位、面板／相机。二改缩放／窗口并加移位小地图／视口，核中心、边缘和区外拾取。原生够用就停；普通控件也错查版本，对齐仍漏查遮挡／路由。

**实际范围：** 静读原帖／仓库／官方契约，不证明通用缩放公式或修复成功率。


## 动态 UI 补研：重建边界不等于停止绘制

核实：2026-10-16 UTC+8；主线三。动态 HUD／菜单已测重建热点后，先查反复失效原因再选原生边界，不按静／动态标签普遍拆 Canvas／套 Retainer。[研究]

### 先去掉错误变化，再决定是否缓存

[一手／社区] [TokyoWarfareProject 的项目报告与 Unity 工程师诊断](https://discussions.unity.com/t/case-1082192-massive-performance-hit-due-to-ui/715019)（2018-09-16—21）：2018.3 beta Player profile 中，同 Canvas 两个 Scaler 写 1／0.47，工程师发现持续尺寸通知／重建，建议删重复并说明已加禁止标记。作者确认误加，无完整修后 benchmark；仅支持查 dirty 来源，不引 FPS 收益或称当前仍可如此配置。[研究]

### Unity：按现有 UI 路线选择，不互抄边界

- [一手] [uGUI 官方优化指南](https://unity.com/how-to/unity-ui-optimization-tips)：Canvas 变化需重析批次，子 Canvas 自管几何／batching，可按更新时机拆；非每值改都重建全树 mesh/layout。独立边界不能合批、可能增 draw，静态仍绘。指南无固定版，非 6.3 实测。[研究]
- [一手] [Unity 6.3 LTS 移动元素契约](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-use-usage-hints-to-reduce-draw-calls-and-geometry-regeneration.html)（页面构建 2026-10-14）：top／left／width／height／flex 可引起布局重算及传播；style.translate 在 transform 阶段移动，不重算布局；频繁变换可用 DynamicTransform 避免 CPU mesh 更新。**仅视觉移动才走这条路；真实内容重排不能冻结布局来省成本。** 不由此迁移稳定 uGUI 或拆出多个 UIDocument。[研究]
- [一手] [6.3 平台与网格限制](https://docs.unity.com/en-us/engine/6000.3/manual/uitoolkits/uielements/uie-support-for-runtime-ui/uie-performance-consideration-runtime/uie-platform-and-mesh)：尺寸变化会重新生成几何，部分 Android 设备与 Web 不能局部更新 index buffer。仍需设备测量，不保证跨平台收益相同。[研究]

### UE：缓存计算与降频绘制分别决策

[一手] UE 5.8 [UE 5.8 Invalidation 契约](https://dev.epicgames.com/documentation/en-us/unreal-engine/invalidation-in-slate-and-umg-for-unreal-engine) 分 Invalidation 布局／paint 缓存和 Retainer 纹理；Global 启用停窗口局部 Box，Volatile 不缓存 paint，只给高频部件。Retainer 重绘／内存更贵，先 invalidation 再处理残余 draw 压力。[研究] 不叠无效缓存或混 CPU/GPU 收益。

[一手] [URetainerBox API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/UMG/URetainerBox) 分 RenderOnInvalidation/Phase、PhaseCount、RequestRender；[UE 5.5 官方 API 示例](https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/RetainerBox?application_version=5.5) 的 PhaseCount=2 隔帧。[研究] 降频改变反馈时点，非固定毫秒延迟；每帧强刷不保原缓存收益。

[社区／一手] [2022-04-25 开发者原帖](https://forums.unrealengine.com/t/text-component-not-updating-inside-retainer-box/539340) 报 UE5 Retainer 内血／弹文本不更新、移出正常，4.27.2 无此问题；后续强刷／phase 绕法不一致。[Epic UE-150807](https://issues.unrealengine.com/issue/UE-150807) 影响 5.0.1，Fixed／Target 5.4／29900904；创建 2022-05-02、解决 2023-11-22、更新 2026-08-07。[研究] 历史已修，非 5.8 缺陷；SetText 成功不证明可见已更新。

### 采用、撤回与第二次修改

[研究] ✅ 预算够用保留；热点先分布局／几何／批次／GPU，去重复写入，只试一个边界并保交互。uGUI 按更新时机拆；Toolkit 纯视觉用 transform；UMG 先 invalidation，剩 draw 压力且反馈允许才试 Retainer。

[研究] 二改静 HUD 加持续值再加动画，同设备／分辨率比基线与一局部改动，记 CPU 重建、draw/GPU、缓存内存及可见反馈。菜单／显隐后实际点击与已承诺导航核数值／焦点；无 CPU 收益或 GPU／内存／延迟超预算则撤回，停更先查版本／失效，不全树强刷。

## 墙门遮挡补比：直达被挡不等于通路消失

核实：2026-10-16 UTC+8；主线二／三。[研究] 按可听规则区分直达遮挡、分区及通路，保既有系统，不以声学真实度为统一目标。

### 两种生产机制及不能互换的结论

- [一手] Homebody 主程序／技术设计 Alex Belzer 的[项目说明](https://www.alexbelzer.com/work/homebody)明确使用 zoning 处理 obstruction／occlusion，目的是减少每个 emitter 到 listener 的寻路或 raycast。[研究] 固定室内已有区域／门关系时可借划分；作者未给算法、声部规模或测量，不证明本项目速度／听感收益，也不搬自建音频系统
- [一手] Barotrauma 固定提交 `e6e95da83b1b5ca8b55ec52653c7cf6b40e30247` 的 [ShouldMuffleSound](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/Barotrauma/BarotraumaClient/ClientSource/Sounds/SoundPlayer.cs#L988-L1012)在听者水下／低通等判断之外，比较房间通路的近似距离与声音范围；[Hull 路径查询](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/Barotrauma/BarotraumaShared/SharedSource/Map/Hull.cs#L1137-L1212)考虑连接 gap、门开闭／损坏／开启程度与客户端预测状态。[研究] 通路／门状态可影响闷声，但不证明完整传播、精确绕射或声像沿路径转向；不逐声源移植寻路

[一手] Barotrauma 是**受限公开源码**：[固定 README](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/README.md)要求先读 [EULA](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/EULA.txt)，后者明确限制于 Barotrauma 相关非商业用途／模组，不允许将代码用于自己的项目或商业用途。已读固定 EULA 的完整摘要及正式第 1–8 节，未见 AI、训练或自动分析专门条款；不据此推定仓库／网站其他条款无限许可。只借高层机制，不复制代码／资产或推荐商业移植，公开可读不等于可复用开源。

### 原生职责与成本：不是跨引擎同一个开关

- [一手] Unity 6.3 [AudioLowPassFilter](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioLowPassFilter.html)按 cutoff 去掉高频，并提供随开门改变 cutoff 的例子；挂在 AudioSource 或 AudioListener 的作用范围不同。[Physics.Linecast](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.Linecast.html)提供线段碰撞查询及层／trigger 筛选。[研究] 简单门关系由现有状态驱动声源，确需几何遮挡才查询；声学阻挡层、查询频率、状态所有者与过渡仍归项目，原语不寻找绕行通路
- [一手] UE 5.8 [Sound Attenuation](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-attenuation-in-unreal-engine)原生提供 Occlusion、Trace Channel、低通频率、音量衰减与插值时间。官方指出 simple collision 较便宜但可能误判复杂形体；修改 Visibility 的响应可能影响其他系统，可考虑独立音频 channel。[研究] 先配置原生能力，不造等价管理器；插值仅缓和边界变化，不修正错误碰撞、过期门状态或补出间接路径

[研究] ✅ 直达够用就停；房间开门／破洞先复用分区与状态，承担内容关系维护。材质透射／反射等明确缺口才评估现成传播，先核引擎／平台／许可。分记 voice／查询／DSP，虚拟化不保证自写查询停，不给通用射线数。

### 集成反例与第二次修改：只预注册

[一手] [Steam Audio Unity 当前指南](https://valvesoftware.github.io/steam-audio/doc/unity/guide.html) 分 Occlusion/Transmission/Reflections；几何默认 static，动态门需导出 Dynamic Object，只传整体 Transform，不支持子物体独立变化。[研究] 铰链二改须核声学几何，非插件推荐／许可背书。

[研究] 二改加第二出口／破门，固定关键声音，比较无障碍、隔墙、门开关与绕行，沿门边查闷声、突变、漏预警及方向；再加环境声量声部／查询／DSP。输入错误先修，滤掉提示就收窄／撤回；人听验，简单遮挡／区域规则够用就停。

**实际范围：** 静读原文／契约／源码／许可，未试听；未采用未经独立核实的 Wiki 修复描述。

## 对白补研：显示完成不等于剧情交付

核实：2026-10-16（UTC+8）；主线一／三。分别决定补全文字、推进当前句和退出会话，按内容定节奏。[研究]

### 原生组件已区分的交付动作

[一手] `YarnSpinnerTool/YarnSpinner-Unity@bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d`，[v3.2.8 提交](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/commit/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d)（2026-08-07），[LICENSE.md](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/LICENSE.md) MIT；仅读，字体／配音授权另核。

- [LinePresenter.cs L350–368](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/LinePresenter.cs#L350-L368)：打字效果使用 `HurryUpToken`，随后按设置自动等待或等待 `NextContentToken`。补全文字不是立即推进剧情。[一手／研究]
- [VoiceOverPresenter.cs L156–228](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/VoiceOverPresenter.cs#L156-L228) 消费下一内容、提前结束淡出停止，不消费文字加速；[L115–127](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/VoiceOverPresenter.cs#L115-L127) 缺语音且 endLineWhenVoiceoverComplete 开、接收者有效也请求结束。[一手／研究] 缺配音语言须有阅读回退，非所有配置跳句或应全关自动。
- [LineAdvancer.cs L450–510](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/LineAdvancer.cs#L450-L510) 内部按呈现及 separateHurryUpAndAdvanceControls 补全／推进，忽略收到内容同帧输入；公开 RequestLineHurryUp 路径不同。先配原生，退出不撤已发 [玩法命令](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/DialogueRunner/DialogueRunner.cs#L689-L746)。[一手／研究]

[一手] [Line Advancer 官方文档](https://www.yarnspinner.dev/docs/unity/10-components/02-dialogue-view/03-dialogue-advance-input/) 分 hurry/next/cancel，仍标 3.1；具体以固定 3.2.8 为准。政策通用，不强加 UE 对照或迁 Yarn。

### 不同作者选择不同节奏

1. **Firewatch。** [一手] [GDC 2017《Do You Copy?》](https://media.gdcvault.com/gdc2017/Presentations/Armstrong_Do_you_copy.pdf) 页50–58（零基49–57）：Julia 被打断会令内部事实与听见信息脱节，故保护关键会话。[研究] 非全禁打断；73–75 的 Conversation 容器仍 Further Work。
2. **inkle。** [一手] [2026-06-18《Pacing dialogue》](https://medium.com/@inklestudios/pacing-dialogue-5bd5a99bfc20) 以短句串联承载文本情绪／节奏，常默认气泡自动继续，频点十来词负担大。[研究] 反对每句必手动，非各语言／阅读能力都更好。

**采用判断：** [研究] 分开呈现、推进和退出输入；可插话保留打断，关键事实可保护／补述／重入。自动或手动按长度、配音与后续选择取舍，不能靠禁所有跳过藏同步错误。

**二改预注册：** [研究] 加配音、缺配音语言及插话分支，走补全、语音中推进、退出、重进和自动播放；核文字、声音、选项及事实。阅读来不及或漏信息则收窄自动／打断；人判阅读与表演。

**实际范围：** 公开文档、固定源码及作者原文静读，无对白体验测试。[研究]

## 高速碰撞补研：线性、旋转与误接触

核实：2026-10-16 UTC；主线三。先分线性漏碰、旋转漏碰及误接触再选 CCD／substep；依据公开契约／问题报告。[一手／研究]

- **Unity 6.3 内置 3D 的模式不是无条件升级链。** [一手] [选择表](https://docs.unity3d.com/6000.3/Documentation/Manual/choose-collision-detection-mode.html)建议从 Discrete 开始，漏碰时试 Continuous Speculative，仍漏碰／误碰时按静态或动态刚体对象比较 Continuous／Continuous Dynamic；但同页明确后两者不适合旋转造成的碰撞。[sweep 原理](https://docs.unity3d.com/6000.3/Documentation/Manual/sweep-based-ccd.html)沿当前线速度计算 TOI，碰撞后可重算速度与再扫掠；固定支点的弹球挡板是官方旋转反例。[研究] 旋转物体不因“更精确”改 Continuous Dynamic；CCD 内部子步不等于全局提高模拟频率。范围不含 Rigidbody2D／ECS Unity Physics。
- **Speculative 的撤回条件不只有漏碰。** [一手] [speculative 原理](https://docs.unity3d.com/6000.3/Documentation/Manual/speculative-ccd.html)按线运动及角运动扩张 AABB；最近点法线可能把细分表面接触误判为斜坡，让高速球无故向上跳。若求解阶段获得额外能量、越出原先扩张范围，仍可能漏碰。[研究] 需要准确线性接触时可比较 sweep，角运动仍核误碰／漏碰；换模式或提高频率不保证修好。图例仅支持机制，不是本仓库体验／性能实测。
- **UE 5.8 分别查 Chaos 刚体与 ProjectileMovement。** [一手] [FBodyInstance](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/FBodyInstance)以 bUseCCD 为组件启用 CCD；[UProjectileMovementComponent](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UProjectileMovementComponent)以 bSweepCollision 控制扫掠检查，bForceSubStepping 通过更小步改善轨迹精度；UpdatedComponent 若模拟物理，则初始发射参数后由物理接管。[研究] 先确定运动所有者，不给两条路径同时套 Unity 模式；这些 API 说明不能证明 Chaos CCD 保证角运动命中。[物理 substep](https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-sub-stepping-in-unreal-engine)分割帧时间以改善复杂物理资产稳定性，受 Max Substeps 和 Max Physics Delta Time 限制；不能把时间细分当作更换检测算法。多回调已由 [04 物理行](../../domains/game-dev/04-client-modules.md#2-十一个模块的最低交付线)覆盖，不新增另一套结算规则。该文仍含 APEX／mobile 旧措辞，本轮不据页眉推导平台支持现状。
- **真实报告限定到其版本和配置。** [一手：官方问题记录] [UE-358355](https://issues.unrealengine.com/issue/UE-358355)给出 Vehicle 模板复现步骤：高速 Chaos Vehicle 开 CCD 后碰撞 One Way Interaction 动态物体，出现不应发生的明显减速；开／关 CCD 是报告里的对照。核实时为 Unresolved，列影响 5.5／5.6／5.7，目标修复 6.0；不能推断 5.8 已确认受影响或 6.0 已修复。原因归于 CCD sweep 是 licensee 的猜测，本轮未证实，也不推荐报告中的内部回调绕过。[研究] 新增 CCD 后仍须验响应政策；不推广为所有 Chaos 接触或 Unity speculative 同类故障。

**二改预注册：** [研究] 直线球／薄墙基线加旋转杆、细分表面；核漏碰、偏转及响应，先比算法再比步长／成本。UE 分别核 ProjectileMovement、Chaos 及物理接管；确需 One Way 才加。防穿透破坏反弹／推动规则则撤回定位，不全局升档。

## 客户端模块页历史页头

历史原文转存：2026-10-16（UTC+8），来自 `domains/game-dev/04-client-modules.md` 的原页头。以下保留当时的核查日期、范围和来源说明；相对链接以原页面路径为基准。

```text
> 核实：2026-10-14 UTC；空间容错及保存响应补核：2026-10-15 UTC；动态 UI 与模拟输入补核：2026-10-16 UTC+8。Unity 主线、Unreal 对照；面向单人程序，无人工美术与音频修补。资产导入见 [01](01-engine-integration.md)，生成供给见 [03](03-generative-ai-in-games.md)。固定源码、反证、许可与验证范围见 [WP10 研究记录](../../docs/research/2026-10-14-game-wp10-client-modules.md)。
```


## 声音响应补研：低延迟与连续播放分别验收

核实：2026-10-16（UTC+8）；主线一／三。确认声迟到先定位等待再比原生缓冲；不同类型游戏有相反维护选择。[研究]

### 处理块缩小与扩大都可能合理

- **OpenTTD 的缩小。** [#12227](https://github.com/OpenTTD/OpenTTD/pull/12227)于2024-03-07合入，[25aeb1c](https://github.com/OpenTTD/OpenTTD/commit/25aeb1c5a536219d07bf1e7a75fcacccd0f35249)将 win32／XAudio2 默认块从8192改1024。作者按44100Hz给出每块约186／23ms，这不是端到端测量，也不能称实际节省163ms。[补充说明](https://github.com/OpenTTD/OpenTTD/pull/12227#issuecomment-1984711843)指出该 mixer 在块起点启动声音，大块会将不同游戏 tick 的声音挤到同一起点，修改只是缓和；Cocoa 用系统块大小，不在此修改内。[一手／研究] 支持核实际消费粒度，不支持照搬1024。
- **VVVVVV 的扩大。** 2026-04-30 [0d69dd3](https://github.com/TerryCavanagh/VVVVVV/commit/0d69dd3820189937cc623b9ed30fffc60c5f787e)在[初始化](https://github.com/TerryCavanagh/VVVVVV/blob/0d69dd3820189937cc623b9ed30fffc60c5f787e/desktop_version/src/Music.cpp#L746-L759)加 FAUDIO_1024_QUANTUM，调用处无平台条件，mastering voice 仍44100Hz；目的仅是缓和部分端口的爆音／变慢，不能称各平台修复。[#970](https://github.com/TerryCavanagh/VVVVVV/issues/970)仍 open，Linux原报告未获该提交回归确认。[FAudio作者](https://github.com/TerryCavanagh/VVVVVV/issues/970#issuecomment-4352893115)说明该 flag 表示约21.33ms时间窗口，不能按名字当所有采样率固定1024样本，更不能与OpenTTD横比。[一手／研究]
- **节奏游戏的历史撤回。** osu-framework [#3832](https://github.com/ppy/osu-framework/pull/3832)、[654e9db](https://github.com/ppy/osu-framework/commit/654e9dbe972972c70a925d742776f419a73d052c)于2020-08-17撤掉强制 DevicePeriod=1，保留其他缓冲设置；维护者报告部分 PulseAudio 环境爆音，增大另一 buffer length 不能解决同一问题。[一手：历史维护] 周期、块长度与排队不是可互换旋钮，不据此称当前版本有该问题。[研究]

许可仅作机制借鉴边界：[OpenTTD固定许可](https://github.com/OpenTTD/OpenTTD/blob/25aeb1c5a536219d07bf1e7a75fcacccd0f35249/COPYING.md)为GPL v2并列第三方例外；[VVVVVV自定义许可](https://github.com/TerryCavanagh/VVVVVV/blob/0d69dd3820189937cc623b9ed30fffc60c5f787e/LICENSE.md)限制商业性修改／分发，图像和音乐另有权利。本节不复制实现或资产，不推荐把VVVVVV作为商用移植底座。[一手／研究]

### 原生取舍及第二次修改

Unity 6.3 [Audio设置](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioManager.html)与[GetDSPBufferSize](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSettings.GetDSPBufferSize.html)区分响应、每块样本及块数，较小粒度增加CPU开销。UE [平台音频设置](https://dev.epicgames.com/documentation/en-us/unreal-engine/platform-audio-settings-in-unreal-engine)分别控制 Callback Buffer Size 和 Number of Buffers to Enqueue：减少前者可减等待但增加CPU工作，增加后者会增加延迟并缓和部分线程供给波动。[一手] 先用已有配置，只改变与瓶颈相关的一层；不要为此换中间件或自建后端。[研究]

二改仅预注册：用已准备好的短确认声区分首次准备与每次起音等待，记录输入接受、播放请求及实际输出；增加背景音乐／空间处理或换已承诺支持的输出设备后，在空闲及高负载下比较原配置和一个低延迟配置，兼查爆音、断续及音频CPU。[VVVVVV原报告](https://github.com/TerryCavanagh/VVVVVV/issues/970#issuecomment-1515043078)中磁盘录音无噪声而扬声器有，故内部录音不替代全部实际输出验收。[社区／研究] 收益不明或连续性退化则恢复基线，迟交事件／首用准备先修对应环节，不改操作判定掩盖声音迟到。

[研究] 仅静读契约／源码／讨论；未运行后端或设备测试。

## 转向补研：先分限幅与平滑，再决定是否撤回插值

核实：2026-10-16 UTC；主线一／三。快速转向先隔离输入平滑、限幅与呈现插值，再决定取舍。[研究]

### 同一游戏里的不同选择与局部撤回

[社区] Barony Quality of Death 测试期的[原帖](https://steamcommunity.com/app/371970/discussions/3/3727324132820504963/)中，Ninjaboi8175 于2023-02-03报告关闭 Camera Interpolation 有效；FLy1n RabBit 于03-21说关闭后问题仍在，高刷新显示下的观感也难接受。开发者 WALL OF JUSTICE 于04-04建议另关 Mouse Rotation Limit；04-09同一位 FLy1n RabBit 明确回报改善，并选择保留插值，同时仍感觉停鼠后的数帧余动。[研究] 同一人的前后反馈缺完整设备配置与精确构建号，不能定位余动来自哪层，也不证明所有玩家的问题已解决。

[一手] [591ebab3](https://github.com/TurningWheel/Barony/commit/591ebab3eedd9e67b7142daf60794de575814172)（2023-04-28 UTC）将 `disablemouserotationlimit` 默认及设置应用路径置为 true，停用限速的菜单与序列化入口；[官方 V3.9.1 公告归档](https://store.steampowered.com/news/posts/?appids=371970&enddate=1686762095&feed=steam_community_announcements)（2023-05-14，Misc. Tweaks and Fixes）列出撤去 Rotation Speed Limit。[研究] 补丁、发布与反馈的时间接续可核，不证明修改单因该帖。[2020-01-07的旧补丁](https://github.com/TurningWheel/Barony/commit/4fd68a0864f4532607392540c09c5c69afa4216e)已加入关闭水平限速的选项，因此不是QoD新引入限速后才撤回。

### 三种机制分别负责什么

[一手] 同一固定 `591ebab3eedd9e67b7142daf60794de575814172` 树中，限速与平滑不是同一个算法：
- [actplayer.cpp L574–603](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/actplayer.cpp#L574-L603)按 `smoothmouse` 分支累积／衰减水平输入或直接赋值，`disablemouserotationlimit` 则单独控制 ±0.35 的夹取；这是转向上限，不等于输入加速曲线
- [L743–780](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/actplayer.cpp#L743-L780)另由 `bUseTimerInterpolation` 控制相机状态追踪；[MainMenu.cpp L2476–2505](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/ui/MainMenu.cpp#L2476-L2505)仍默认开插值、关 Smooth Mouse，撤限速没有一起撤掉呈现插值
- **方向边界**：[pitch L676–715](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/actplayer.cpp#L676-L715)仍有夹取；所核 flag 对玩家水平 yaw 生效，不能将公告简写扩大成所有方向、所有镜头都已无上限

[研究] 即时转向可比较关插值，但高刷新更易显低频跳动；保留时核急转、停鼠、反向。上限无玩法用途则先修截断，有转身承诺则保规则调反馈；不把三项全关作统一配方。

[一手／研究] [固定许可](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/LICENSE.txt)为 BSD-2-Clause，[README](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/README.md)说明游玩仍需购买副本；代码许可不扩大资产许可。仅静读机制、核历史反馈；不复制代码或资产，未运行游戏、引擎或设备测试，不增加实测计划。

## 插值预算：按观察尺度缩小呈现，不停止仿真

**核实：2026-10-17（UTC+8）。** [研究] 无热点保留全体必要对象插值；确有成本、近景／总览用途不同才按视口／尺度筛选，保留原生模拟频率与循环。

**OpenRCT2的已发行取舍。** [#24467](https://github.com/OpenRCT2/OpenRCT2/pull/24467)原先把Guest、Staff、Vehicle全加入插值，改成仅取可见且zoom≤0的视口，实体投影点落在任一视口就保留。[维护者试玩回执](https://github.com/OpenRCT2/OpenRCT2/pull/24467#issuecomment-2902380560)称未见glitches，没有设备、地图、时长或帧时分布；不把赞美评论当第二次复测。改动列入0.4.23，[2026-10-10的0.5.6发行](https://github.com/OpenRCT2/OpenRCT2/releases/tag/v0.5.6)对应[82b30979](https://github.com/OpenRCT2/OpenRCT2/blob/82b309798a83346b7f9fc61a53847f4323deb19d/distribution/changelog.txt)，[固定EntityTweener](https://github.com/OpenRCT2/OpenRCT2/blob/82b309798a83346b7f9fc61a53847f4323deb19d/src/openrct2/entity/EntityTweener.cpp#L22-L116)仍保留策略。作者认为缩小时插值作用较小是设计判断，没有感知实验或该改动的性能测量。**[一手：固定实现与发行；社区：一次试玩自报]**

筛选是所有符合条件视口的并集，不仅主相机；主视口缩小时，近看的小窗仍可能保留该对象。判定只用实体位置投影点，不是sprite包围盒或遮挡测试。preTick先restore/reset再重建集合，postTick记新位置，集合按模拟tick而非每呈现帧更新；[Context固定调用](https://github.com/OpenRCT2/OpenRCT2/blob/82b309798a83346b7f9fc61a53847f4323deb19d/src/openrct2/Context.cpp#L1342-L1377)仍执行Tick，随后tween/Draw。这只能说明减少呈现插值集合，不能说停了屏外仿真或已保证快速入屏无跳；遍历实体与视口的成本也未消失。**[一手：源码机制；研究：边界]**

**不同类型的反例。** VVVVVV [#220](https://github.com/TerryCavanagh/VVVVVV/pull/220)选择保留34ms模拟步，在中间呈现帧插值，避免为视觉帧率重调已有物理／自制关卡；拆开更新与绘制也是维护工作，不是只加lerp。它有[实际试玩](https://github.com/TerryCavanagh/VVVVVV/pull/220#issuecomment-623655566)与[维护者通关及Valgrind开销报告](https://github.com/TerryCavanagh/VVVVVV/pull/220#issuecomment-644247104)，后者不能推成普通发布构建回退。[2.3发行文](https://distractionware.com/blog/2021/08/vvvvvv-2-3-out-now/)确认高帧呈现进入发行，不证明玩家通过率提高。更直接影响筛选范围的是[#517](https://github.com/TerryCavanagh/VVVVVV/pull/517)：为滚动插值补画上方源像素，修屏幕上缘异常。这不是OpenRCT2缺陷，却表明屏幕矩形外仍可能有下一帧取样／连续运动所需数据。**[一手／社区：采用、修复与运行自报]**

**代价与撤回。** [研究] 筛选增加多视口、集合切换及数据保留责任；全体更简单，原低频牺牲连续感。二改快速入屏对象／附属视口后核近景、总览、远主＋近窗、出入屏、缩放反向及暂停恢复；危险难追或突跳就扩范围／撤回。模拟、碰撞与索引照原契约，不套 zoom 阈值。

[研究] 未测筛选成本、帧时或辨识；0.5.6 留代码不证明全版无回归，历史试玩不覆盖目标设备。不排名全体／选择性插值或推断 AI 收益。

## 改键持久化：既有选型回流

2026-10-17（UTC+8）。[研究] 回流[既有先导](../../experiments/m6-search-pilot-20261017.json)的 arms[2].result、grades[1].report：Unity 6.3 先用 Input System 1.20.1 加应用薄层，不重做选型。原生[override保存／加载](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/save-load-rebinds.html)配稳定 binding GUID；项目负责冲突、落盘及版本迁移。按索引保存会受重排影响，新增绑定拓扑也不是 override 的保存对象；恢复默认须同步旧设置。[一手／研究]

UE 5.8 的[UserSettings](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/EnhancedInput/UEnhancedInputUserSettings)已有映射、重置与保存，默认固定存档槽；[映射参数](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/EnhancedInput/FMapPlayerKeyArgs)区分 MappingName、slot、设备与 profile，不套 Unity GUID。[研究] 默认沿原生能力，身份／结构变更才补迁移；文档不保证任意动作改版自动恢复。此次是资料支持结论的入口回流与 UE 契约对照，无新增效果、引擎或设备验证。


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

既有URP TAA／STP与动态分辨率组合限制沿[运动可读性记录](#运动可读性补研关键提示不能靠历史积累补成另一个位置)核对；本单元不重做拖影调查。当前资料未给同项目固定档与动态档的净维护投入或玩家可辨下限，不宣称已得到最佳比例。[研究]

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
