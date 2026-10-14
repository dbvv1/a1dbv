主线：3「第二次、第五次修改仍可靠」／4「交付给玩家和维护者」，兼顾主线 2 的已有能力取舍
改变的建议：04 先完成有回应、可读、连续的核心动作，再以生命周期与设备预算保护迭代；区分输入延迟、容错、呈现插值和帧间隔
新证据：Input System 1.19、Unity 6.3 运动／PSO／上传／池契约、固定 motor 源码、Dead Cells 复盘与 Windows DX12 首发 trace；并补 Mindustry／Thrive 固定存档路径与 Easy Save 备份契约

# WP10：客户端模块怎样在第二次修改后仍然可靠

核实：2026-10-13 UTC（2026-10-14 UTC+8）。[一手] 为官方机制／固定源码，[社区] 为用户原帖报告，[研究] 为交叉判断。只调查与文档修订；未安装／运行 Unity、Unreal、模型或付费插件，未操作用户电脑。建议落点为 [客户端核心模块](../../domains/game-dev/04-client-modules.md)。

**[研究] 结论：默认采用商用引擎的成熟组件；仅为项目缺少的所有权、版本迁移和模式切换规则加薄层。** 最先验场景取消、释放、旧档、暂停和设备峰值，再决定是否增加框架。源码、PR 和报告不能代表实际游戏性能、模型编码成功率或生产采用；没有同任务实测，不做“质量第一”的跨工具榜单。

## 1. UniTask：新增自动释放为何仍不能等同完整取消

**[一手] 固定源**：`Cysharp/UniTask@a77a1b4a89824fb6df293099de3060daf2a432c1`，commit API 核实最后提交 2026-10-06；MIT，[LICENSE](https://github.com/Cysharp/UniTask/blob/a77a1b4a89824fb6df293099de3060daf2a432c1/LICENSE)。该提交日期证明近期仓库活动，不代表本文锁定了一个推荐稳定发行版，也不证明目标项目通过。

[一手] 本轮阅读整个 [AddressablesAsyncExtensions.cs](https://github.com/Cysharp/UniTask/blob/a77a1b4a89824fb6df293099de3060daf2a432c1/src/UniTask/Assets/Plugins/UniTask/Runtime/External/Addressables/AddressablesAsyncExtensions.cs)。关键路径：

1. [一手／研究] `ToUniTask<T>`（约 267–294 行）先判断 token 是否已取消，随后才检查 handle、IsDone，最后注册 source；因此调用者已经执行 LoadAssetAsync，再传预取消 token，不会因 true 自动释放已创建 handle。
2. [一手] `WithCancellation`／`ToUniTask` 两个重载族默认 `autoReleaseWhenCanceled=false`；成功返回结果不会替调用者建立更长寿命的资源所有权，也不会在对象最终不用时自动 release。
3. [一手／研究] `Create` 的立即取消注册、`MoveNext` 的 PlayerLoop 取消、`HandleCompleted` 的完成路径分别存在。`cancelImmediately` 改变的是观察取消时机及注册成本，不能推导成后台操作立即终止，也不是跨线程安全承诺。
4. [一手／研究] [PR #521](https://github.com/Cysharp/UniTask/pull/521)提出取消时 release；评审指出 cancelImmediately 路径遗漏和无效句柄退订风险。[PR #536](https://github.com/Cysharp/UniTask/pull/536)明确因直接改变释放行为会破坏调用者，新增可选 flag；[2.5.2 发布记录](https://github.com/Cysharp/UniTask/releases/tag/2.5.2)列出二者。**改变建议的证据是所有权不能由“取消”一词隐含决定**，并不是宣称 2.5.2 后所有竞态已修好。
5. [社区] [#649 原帖](https://github.com/Cysharp/UniTask/issues/649)报告取消 A 后复用 source，A 的迟到 callback 让 B await 返回 A 的资源；附了需要 A／B 时序的重现条件。2025-08 stale 关闭为 not planned，未见关联修复。原帖两人报告，不是社区共识。
6. [一手／研究] 固定源码的 `MoveNext`（441–457）取消后调用 core.TrySetCanceled；`GetResult`（402–418）通常归还池；`TryReturn`（467–475）清 core／handle 并回池，但没有在这里退订旧 handle.Completed；`HandleCompleted`（372–399）会读取完成参数结果。这在结构上支持原帖的风险路径，**未运行真实引擎，不能把静态路径直接标为本项目已复现漏洞，更不能声称任何新增 guard 已解决库内结果串线**。

**采用判断**：[研究] 有大量 PlayerLoop／组合等待需求时继续评估 UniTask；不因一个 issue 全面禁用。对高频取消 Addressables 的业务，不直接复制短博客包装器；首先选不提前取消底层 await 的完成清理路径，或针对锁定包测试／修复后才启用该适配器。业务 generation guard 对旧场景写入有用，但不能单独证明源库未把 A 结果错送给 B。

**未来测试必须包含**：预取消且已创建 handle、取消同帧完成、A 取消后 B 复用并由 A 先完成、autoRelease 两值、cancelImmediately 两值、成功和失败、已有缓存导致同步完成、两个消费者共享真实获取。断言结果身份、完成次数、消费方代次与释放次数；不只断言 await 没抛异常。

### 异步选型的窄比较

[研究] 采用判断；链接指向对应一手机制。

| 候选 | 本轮判断 | 契约／接入成本 |
|---|---|---|
| 项目已有 Coroutine／原生 Completed | ✅ 有限加载／简单演出默认保留 | 不引第三方依赖；取消消费者和操作收尾仍要分开，宿主消失后不能丢失资源所有者 |
| Unity Awaitable | ✅ 原生 API 等待可采用，不要求为了统一语法重写所有现有异步 | [6.3 官方说明](https://docs.unity3d.com/6000.3/Documentation/Manual/async-awaitable-introduction.html)指出实例池化，同一实例不能 await 两次；不可将它当可随处共享缓存的 Task |
| UniTask | 🧪 明确需要 PlayerLoop、组合等待、减少现有适配代码时采用；Addressables 高频取消单独验收 | MIT，具备丰富适配；承担额外版本组合和上述取消／池复用边界，不以“零分配”宣传推断目标游戏无 GC |
| .NET Task | ✅ 对真正后台／I/O 工作和已有 Task API 按原生契约使用 | 多消费者场景与 Awaitable 不同；不能让 Task.Run 内访问 Unity 对象，也不能把后台线程完成当主线程资产可用 |

[研究] 目标是少数明确的项目边界，不是禁止框架之间任何互操作。若已有方案满足需求且没有 profiler／正确性缺口，不为“先进”添加迁移工作。

## 2. Unreal 反证：文档承诺与具体版本缺陷分开

[FStreamableHandle API](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/FStreamableHandle)描述 CancelHandle 会立即 release，取消回调替代完成回调，连延迟队列中的完成回调也应停止；ReleaseHandle 则是移除持有关系，不能一概当作同一操作。[一手]

[UE-207209](https://issues.unrealengine.com/issue/UE-207209)给出同帧 A／B 在回调里互相 CancelHandle 的自动测试。官方报告指出已有回调被排入执行队列时，完成与取消都可能发生。核实页：Backlogged，Affects 5.0／5.5，Target Fix 6.0，Updated 2026-07-28。**Target Fix 不是已发布修复；影响版本列表也不能直接证明 5.8 必现或已修。** [一手]

[UE-208804](https://issues.unrealengine.com/issue/UE-208804)进一步记录 ChangeBundleStateForPrimaryAssets 在加入 bundle 时重启 pending load 的性能问题；两次过去的优化被回退，原因包括泄漏、菜单仍驻留及同步加载。核实页 2026-09-14 更新仍 Backlogged。它是有用的官方修复复盘，表明“复用正在加载的数据一定更好”会与所有权和批量句柄关联冲突。[一手]

**改变建议**：[研究] 两引擎共同保留「业务结果至多接受一次＋对象／场景仍有效」断言，并测重入；不要把相似 API 名字当相同取消语义。对 UE 合并加载／动态 bundle 变化，避免先写大量全局缓存优化，先在所用版本测暂停、重开、菜单切换和驻留。

### 资源所有权补比：Load 与 Preload 不能共用退出政策

核实：2026-10-14 UTC，以下官方 API 页面标 UE 5.8；这是公开文档契约，未读取受限引擎源码，也未运行引擎。5.7 参数页本轮未能取得，不把当前页当作固定 5.7 实现证据。[一手]

- [一手] [LoadPrimaryAssets](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAssetManager/LoadPrimaryAssets)说明资源保留到显式卸载；返回句柄可用于等待／查询，调用者不必保留它来防止卸载。没有新增工作时返回句柄可为 null，但仍调用完成回调。[UnloadPrimaryAssets](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAssetManager/UnloadPrimaryAssets)仅在此前 Load 是唯一持有来源时才使资源得以释放，不承诺所有引用或物理内存立即消失。
- [一手] [PreloadPrimaryAssets](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAssetManager/PreloadPrimaryAssets)要求保留活动句柄；这批资源不属于正式 Loaded 状态，普通 Unload／ChangeBundleState 不影响它，释放该句柄且无其他加载持有时才可释放资源。它与 Load 的同名返回类型不能证明退出政策相同。
- [一手] [Object Pointers](https://dev.epicgames.com/documentation/en-us/unreal-engine/object-pointers-in-unreal-engine)明确 `TSoftObjectPtr` 不阻止 GC；`UPROPERTY` 标记的 `TObjectPtr` 才是常见的 UObject 持有引用。保存软引用路径与维持加载后驻留是不同责任。

**[研究] ✅ 优先用上述原生能力，补共享内容的共同所有者，不新增跨引擎资源框架。** Load 用于已决定保持的内容，Preload 可用于可能取消的提前准备；既有路径够用就不切换。第二次修改将单菜单技能预览扩成两个菜单共用、再跨场景保留时，逐个菜单各自 Unload 不是 Addressables 式的消费者引用计数。应先决定共同所有者何时允许卸载，并核对其他强引用；更多常驻内容会增加内存成本，Preload 也需交接和取消收尾，不能仅凭 API 名称推导收益。

**[研究] 具体回归路径是第二次打开与第二种退出。** 已加载菜单再次打开、请求没有新增工作时，若只以返回句柄非空判成功，会误报失败；从预览改为常驻后只丢弃 Load 返回句柄，不能证明驻留已撤销；保留 Preload 句柄却只调用 Unload，也不能证明预加载持有已撤销。这些是文档契约的静态推导，不是已复现故障。未来验收记录完成次数、实际资源身份、持有来源和退出后驻留，并覆盖一个消费者退出而另一个仍使用；无需重复已有场景取消与 PSO 测试清单。

## 3. ink：存档格式兼容，不等于剧情修改兼容

[一手] 固定 `inkle/ink@35c63e52f1d36060930dc7ed3cfba38ea224b528`，commit API 2026-05-05，版本 1.2.1，MIT [LICENSE](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/LICENSE.txt)。读取 StoryState、Story、CallStack、VariablesState，而不是只读 README。

- [StoryState.cs](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/ink-engine-runtime/StoryState.cs)明确当前 save 版本 10、最低可读版本 8；LoadJsonObj 检查字段／最低版本，分别处理旧单 flow 和新 flows 结构。[一手]
- [CallStack.cs](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/ink-engine-runtime/CallStack.cs#L52-L83)使用存档 cPath 和 idx 恢复位置，找不到抛错，近似查找会报警；[Story.cs](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/ink-engine-runtime/Story.cs#L753-L782)的 PointerAtPath 同样有 approximate 警告路径。[一手]
- **改变建议**：[研究] 测试除 LoadJson 不抛错外，还要捕获 warning 并断言剧情位置、可选项、已领取奖励。可以选择稳定命名节点／显式 checkpoint 迁移，复杂内容变更不保证任意保存点兼容。是否接受回退章节须由产品决定。
- 采用边界：ink 是叙事状态机，不是通用世界／库存保存系统；小型非叙事游戏没有理由为版本字段而引入它。源码和测试是维护／机制证据；本轮没有把 The Intercept 旧 game jam demo 当现代完整客户端底座，也不声称测过发行游戏生产可靠性。

## 4. Input System：Disable 自身会触发回调

[一手／研究] 固定 `Unity-Technologies/InputSystem@05e45ddbaf18a93245b068d787d74b738b90d01c`，commit API 2026-10-06，Unity Companion License [LICENSE.md](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/LICENSE.md)。近期提交本身是 before-render timeout 修复的端口，进一步说明要固定已发布包／更新时序，不能把 develop 当稳定包。

读取 [InputAction.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Actions/InputAction.cs#L967-L986)和 [InputActionState.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Actions/InputActionState.cs#L889-L948)。DisableSingleAction 先 DisableControls，再 ResetActionState；重置会取消正在进行的 action／interaction，然后清字段。[一手]

**改变建议**：[研究] 菜单开启先将游戏状态标为暂停／不可接受攻击，再禁用 map；否则 Disable 引发 canceled 时，旧 gameplay 回调可能仍把它看作主动松开并执行结算。取消回调只清瞬态状态；需要“松开触发攻击”的动作必须区分交互正常完成和系统取消。此结论来自契约／源码，不是 Codex 或 Claude 实测错误统计。

还需防止虚拟鼠标＋导航双路：Input System 1.19 官方 UI 文档警告同时让 gamepad 驱动 Virtual Mouse 和 UI navigation 会重复触发。不要加任意毫秒 debounce 来隐藏输入所有权错误。[一手／研究]

## 5. UI 版本纠偏：不是旧功能表的简单延长

本轮读取 [Unity 6.3 LTS 英文 comparison](https://docs.unity3d.com/6000.3/Documentation/Manual/UI-system-compare.html)，文档实际列出 UI Toolkit world-space、custom shaders/materials、RTL/emoji、SVG；Animation Clips／Timeline 集成仍列不支持，uGUI 支持。总体表依旧把 uGUI 列为 Runtime recommendation、UI Toolkit 为 Editor recommendation，因此**不宜用一句“Unity 已全面推荐 UI Toolkit”替代细分决策**。[一手]

**采用判断**：[研究] 新的重布局／文本 UI 值得评估 UI Toolkit，已经稳定的 uGUI 或大量 keyframe UI 保留；6.0 与 6.3、英文新页和旧翻译页不能混当相同基线。官方表声明能力不证明其在玩家目标设备零 bug，也不能推出 UI 视觉质量高于另一套。

## 6. 许可、维护与采用边界

[一手] 许可／维护事实；[研究] 接入选择。未核实生产采用处明确保留缺口。

| 对象 | 已核实的授权与维护 | 接入／采用边界 |
|---|---|---|
| Unity 原生引擎组件／包 | 引擎受 [Unity Editor 条款](https://unity.com/legal/editor-terms-of-service/software)约束；不能统称 MIT／免费无条件。项目应锁定引擎、包版本并保留包内许可证 | 本文推荐的是官方机制；没有逐包列出第三方 notices，也未部署商用工程。发布前按实际 manifest 审计 |
| UniTask | 固定 SHA、MIT，2026-10-06 有仓库活动；取消自动释放 PR 和未解决原帖已读 | 轻量适配可借用；需要所有权政策和包组合测试。本轮未独立核实指定版本在已发行游戏中的采用 |
| Input System | 固定 SHA，Unity Companion License，Unity-dependent 条件；[许可正文](https://unity.com/legal/licenses/unity-companion-license)已读 | 采用项目兼容的已发布包；不是可搬去任意引擎的宽松开源代码。UI vs Game Input 官方包内样例可作为机制参照 |
| Addressables-Sample | 固定 [3112f7dc](https://github.com/Unity-Technologies/Addressables-Sample/tree/3112f7dc30f30d4c118a03de9c3d7ccc56e89bb2)，2026-05-06；读取 README 和递归文件树，未发现 LICENSE 文件 | **👀 机制参考；⛔ 不将整个仓库作为已清许可的商用复制底座。** README 自述是未保证／未测试适用于你的情况的例子，旧说明不可作当前契约。包自身使用条款与该示例仓库复制权限分开 |
| ink | 固定 SHA 版本 1.2.1，MIT，读取运行时核心代码 | 叙事场景🧪；不替代世界存档。维护活跃和可读代码不等于本轮验证过升级语义 |
| Unreal 原生系统 | [Unreal EULA](https://www.unrealengine.com/eula/unreal)适用于引擎代码／相应 Examples；源代码可见不等于开放源码许可证 | 不在公开仓库搬整段受限引擎源码。Marketplace／Fab 内容与引擎代码可能不同许可，逐资产核查 |
| Lyra | [机制文档](https://dev.epicgames.com/documentation/unreal-engine/lyra-sample-game-in-unreal-engine?lang=en-US)定义为随引擎更新的 modular learning resource；[Fab 官方页](https://www.fab.com/listings/93faede1-4434-47c0-85f1-bf27c0820ad0)明确 UE-Only，显示 Allows usage with AI: No | **✅ 读公开 UI／输入／生命周期说明；⛔ 默认整包输入 Agent 或作为跨引擎资源来源。** 未下载项目，具体文件许可链未确认；不把 sample 当已发行游戏或已清许可的商用复制底座 |
| FMOD | [官方 licensing](https://www.fmod.com/licensing)核实：免费 Indie 条件为开发者年收入低于 $200k 且项目开发预算低于 $600k；商业项目需注册，logo 要求和 EULA 仍适用。非免费 Indie 当前 $2,000／game，需按购买时重核 | 付费与免费档都可覆盖相同主要功能，不能把价格作为音质排序。仅当复杂音频工作流的节省超过集成／bank 管理成本才🧪；本轮未安装、签约或验证生产净收益 |

**[一手／研究] Lyra 的标签与条款分开看**：[Epic Content License §5(c)(viii) 与 §17](https://www.unrealengine.com/eula/content)限制其覆盖的 NoAI Content 作为生成式 AI 数据集、开发材料或输入。Fab 的 No 标签不能单独证明每个代码文件适用同一协议；普通公开技术说明的阅读不因此被禁，也不能推导成所有 UE 开发禁止 AI。真正接入前保存具体取得渠道、文件和适用协议，不用非官方镜像绕过限制。

许可总结属于资料核对，不代替目标项目的法律审查。没有额外购买需求的模块，不为“商业方案覆盖”虚构一个收费优胜者。

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

[研究] 测量轮数按是否达到稳定、覆盖关键竞态和可重复结果决定，不宣称固定循环次数等同无泄漏证明。自动化记录资源身份、状态转换和性能样本；画面可读性、动画观感、音频舒适度和翻译准确性保留人工验收。

## 8. 自检、反证和剩余工作

### 任务书覆盖

- 正文覆盖渲染／性能、加载／内存、动画、物理、输入、UI、音频、存档、本地化、发布、编辑器 11 模块；各给最低程度、可省范围、原生／开源机制、分档选择、AI 风险和未来验证
- 最佳质量按玩法的条件上限表达，不以价格／新功能排序；性价比计入集成和第二次修改成本；本地／免费不免除引擎、内容及第三方许可
- 比较 Unity Coroutine／Awaitable／UniTask／Task，Unreal 作同一生命周期问题的对照；不研究自研引擎，不为单机默认加入网络
- 商业对照为原生商业引擎和可选 FMOD；不为每模块凑一个收费优胜者。原生方案已满足时停止引入额外框架
- 新证据改变的是资源所有权、回调重入、旧档语义与版本选择；单 issue 不作共识，关闭不作修复，源码路径不作已复现运行

### 能推翻推荐的条件

- 如果目标版本／目标设备的竞态和内存测试通过，且组合等待明显减少维护负担，可扩大 UniTask 使用；当前没有证据全面禁用它
- 若模板覆盖绝大部分实际玩法、许可及 Agent 输入范围清楚，且第二次修改成本更低，可重评整包底座；“官方”或“源码可见”本身不够
- 若原生音频制作成本超过中间件接入／bank／授权成本，可采用 FMOD；没有听验和制作成本，不能宣布它是音质升级
- UI Toolkit／uGUI 按实际引擎版本、关键帧动画、布局和可访问性重新判断；旧翻译页与新英文功能表不能混成同一基线

### 下一项有价值的验证

优先固定包版本，比较原生完成通知与 UniTask 取消适配的 A／B 复用场景，断言资源身份、完成次数、释放次数和旧场景写入；不能只测“没有异常”。其次用 V1→V2→V3 旧剧情档验证恢复承诺。真实引擎阶段需另行确认后再执行；不为此提前搭通用框架。

补充纠偏：[Unity 6.3 协程文档](https://docs.unity3d.com/6000.3/Documentation/Manual/Coroutines.html)区分 GameObject 失活／宿主销毁会停协程，而 MonoBehaviour.enabled=false 不会。[一手] 对象池回收政策须按实际停用方式写，不能笼统认为“禁用后所有后台行为都停”。

### 实际验证状态

- **已完成资料核对**：固定 SHA commit 元数据、UniTask／ink／Input System 指定源码和许可；Addressables-Sample 递归树；修复链、原帖状态、Epic 问题页、Lyra Fab 标签及相关 Content License；对应机制链接均来自本轮读取
- **未运行**：上游完整测试、真实引擎／设备、付费工具、模型对照、完整垂直切片；无性能提高／节省工时量化结论
- **待人工判断**：目标玩法与最低设备、玩家能接受的旧档回退、音频和动画质量、平台认证和商业许可适用性
- **仓库检查已通过**：`python3 scripts/check_offline.py` 全部 14 阶段、非空测试且无 skip；`git diff --check` 与新文件空白检查通过。检查仅覆盖仓库文档／配置与离线夹具，不等于引擎行为通过

## 阶段 F 动态状态补核

2026-10-14 重读以下官方正文；建议 2026-11-14 或升级／取得样例前复核。固定源码与历史修改链不重算，也不将公开问题状态当本项目复现结果。[研究]

| 动态事实 | 本次核实与一手来源 | 对采用的影响 |
|---|---|---|
| 加载取消／重启问题状态 | [UE-207209](https://issues.unrealengine.com/issue/UE-207209)仍 Backlogged，Affects 5.0／5.5、Target Fix 6.0、更新 2026-07-28；[UE-208804](https://issues.unrealengine.com/issue/UE-208804)仍 Backlogged，更新 2026-09-14 | 保留同帧回调与 bundle 重启回归；目标修复版不是已发布修复，也不据影响列表断言其他版本必现 |
| Lyra 渠道标签与许可缺口 | [Fab 官方商品页](https://www.fab.com/listings/93faede1-4434-47c0-85f1-bf27c0820ad0)仍写 UE-Only、Allows usage with AI: No；本次提取的 License terms 字段为空 | 保留读公开机制说明；不默认整包交给 Agent 或跨引擎复用。商品标签不是逐文件授权链，具体取得协议仍未闭合；WP11 同样适用 |

仅核公开页面，未下载样例、登录取得许可、运行引擎或验证目标版本修复。[研究]

## 体验质量深化：响应与顺滑，让同一个动作值得反复玩

核实：2026-10-14 UTC。[研究] 本轮把 04 的主目标从“跨模块不出错”补到“操作自然发生、结果清楚、连续游玩舒服”。比较对象是 2D 动作与 3D 第三人称独立游戏；动作节奏、容错和演出强度由玩法决定，不给所有游戏统一管线或参数。仅公开文档／源码研究，没有启动演示、引擎、模型或设备实验。

### 1. 四类时间问题不能用同一种“平滑”处理

| 问题／一手证据 | 改变的建议 | 可推翻或收窄建议的条件 |
|---|---|---|
| [Input System 1.19 时序选择](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/timing-select-mode.html)及[固定步长详解](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/timing-optimize-fixed-update.html)：FixedUpdate 在渲染帧内可能零次／多次执行，固定模式按完整时间步归组事件；低延迟需求推荐 Dynamic Update，即使物理施力仍在 FixedUpdate | [研究] 先减少事件等待；保存连续输入，离散指令消费一次，勿把所有输入搬到 FixedUpdate 当性能优化。物理模拟方式与输入采样模式可分别选 | [研究] 小量延迟不影响玩法且统一固定时序明显更简单时，原生固定模式可保留；这里不涉及网络确定性／回滚的时间线设计 |
| [Unity 6.3 Rigidbody 插值](https://docs.unity3d.com/6000.3/Documentation/Manual/rigidbody-interpolation.html)：Interpolate 用前两次物理姿态并延迟一个物理步；Extrapolate 预测未来姿态，可能越过碰撞边界 | [研究] 插值改善可见轨迹，不自动降低操作延迟。给观察到抖动的对象按需开启，再检查角色／跟随者使用的姿态；不把所有对象插值或全局提高物理频率设为默认 | [研究] 若游戏直接控制的角色更重视即时反馈，新增滞后不合适，可回退该对象插值并重新决定运动／呈现方案；不是跳过碰撞求快 |
| [Android Frame Pacing 官方说明](https://developer.android.com/games/sdk/frame-pacing)，页面更新 2026-02-26：不均匀显示间隔、重复帧及 queue-stuffing 可增加卡顿／延迟，Unity 已集成 | [研究] 平均 FPS、CPU/GPU 用时与实际呈现间隔分开记录。原生 Android 先用引擎选项，不为独立游戏再实现呈现同步层 | [研究] 平台、图形 API、刷新模式和引擎版本变化需复核；没有目标设备数据，不声称固定幅度改善 |
| [Unity 6.3 targetFrameRate](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-targetFrameRate.html)：桌面软件限帧有 microstutter 风险，vSyncCount 非零时忽略 targetFrameRate；Android 有不同规则 | [研究] 不把 `targetFrameRate=60` 当跨平台顺滑配方。桌面按同步方式选，Android 按目标与刷新率配置；帧间隔稳定和输入延迟同时比较 | [研究] VRR、平台合成器、驱动及硬件队列会影响结果；官方机制不能替目标设备端到端测量 |

[研究] 可用时间戳区分输入处理、动作接受、首次呈现反馈的程序路径；显示器实际发光和外设延迟不在这些日志内。帧时间 p95／p99、最长帧、超过项目预算的频率与发生场景，比单独平均 FPS 更能描述稳定性，但也不代替试玩。此处只提出未来观测，不冒充已采样的数据。

### 2. 具体动作的体验和生产成本

| 情境 | 最小可用且有质量的基线 | 增加能力的触发；目标体验 | 成本／回退 |
|---|---|---|---|
| 2D 精确平台／快节奏动作 | 起停、转向、跳高、落点与碰撞关系可理解；少量姿态也明确区分起手／生效／恢复 | [研究] 玩家合理短按常被拒绝时，分别增加按键缓冲和离地宽限；命中难辨时增加受击姿态与短音效，而非先堆粒子 | [研究] 容错会改变可达距离／战斗窗口；过期指令自动执行就收窄状态或时长。像素精度／相机呈现另审，不照抄物理数值 |
| 3D 第三人称移动／战斗 | 碰撞／位移只有一个负责人，输入方向、转身与姿态协调；先用 Animator／Clip／Blend Tree | [研究] 打断感觉迟钝先查 Exit Time／混合时长；步态不合先对齐位移与动画。确实需要脚／手接触才增加原生 Rigging／IK | [研究] 约束层、骨架一致性及动作覆盖成为新维护成本；移除无明显改善的约束。代码可调接触目标，但不能自动补齐缺失的动作风格 |
| 重武器或有承诺的动作 | 接受输入后及时给起手反馈，前摇和收招保留可学习节奏 | [研究] 接触缺乏力度时才加短顿帧／声音层次；需要连段时定义缓冲与取消窗口 | [研究] 追求零前摇、任意取消会消掉策略；顿帧过长／频繁会使连击不连贯。所有视觉变化不应悄悄修改伤害窗口 |
| 高频群战／多目标命中 | 威胁、玩家和命中结果始终可辨，声音并发受控 | [研究] 把特效／音频强度按轻重与重要性分层；多命中顿帧合并设上限，保留必要提示 | [研究] 全屏闪光、累计震动、长拖尾与无限刷新暂停会冲淡重点。可降低纯呈现强度而保持规则相同，规则性暂停则明确记录 |

[一手] [Unity 6.3 转场文档](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Transition.html)明确 Exit Time 与条件的组合、Transition Duration 的秒／归一化时间区别、Interruption Source／Ordered Interruption 的排队规则。文档也说明通过转场接触关系调节避免脚滑。它没有证明“所有动作都关闭 Exit Time”最好。[一手] [Animation Rigging 1.4 官方页](https://docs.unity3d.com/Packages/com.unity.animation.rigging@1.4/manual/index.html)实际版本为 1.4.1（页面生成 2026-01-17）；这是当前可核的原生可选能力，不是必须迁移到的动画架构。

[研究] 对单人且无人工美术修补的生产条件，最划算的增强通常是统一接受动作与反馈的时刻、调好有限动作的速度／转场，以及程序可控的短音效、缩放、拖尾。若所需骨架、脚步接触或多方向动作持续不能达到目标，应缩小动作集合或更换许可清楚的可用资产；增加算法复杂度不能保证弥补资产缺口。AI 适合实现可切换参数、读取状态、排查时序；“这个动作有力量还是迟钝”保留给人判断。

### 3. 可借用的优秀实现，以及不能带走的东西

| 来源与固定版本 | 已读的证据；采用单位 | 许可／维护／反证 |
|---|---|---|
| [NoelFB/Celeste](https://github.com/NoelFB/Celeste/tree/1b0ce45c75e05649ae91b44a8bb6b196684e4352)，最后提交 2021-08-05，仓库 2023-03-16 归档 | [一手] [Player.cs](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs)的 JumpGraceTime、角落修正、可变跳跃、DashBegin 的冻结／波纹／震动；[研究] 采用“精确动作也允许意图容错”的机制，不搬整段角色控制器 | [一手] [README](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/README.md)明确 MIT 只涵盖仓库代码，不含商业游戏及资产；发布的是部分学习源码，不是当前完整可维护模板 |
| [EXOK/Celeste64](https://github.com/EXOK/Celeste64/tree/6edfe1ebd2a21a6134d7675a28e357891025407e)，最新提交 2026-09-07 | [一手] [Player.cs](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs)的 Jump 同时设置运动、模型拉伸和声音；落地根据此前速度调整形变并发出落地事件／音效；宽限、ground snap 与显示姿态协同。可借动作到反馈的连接，3D 仍可用小规模程序化演出 | [一手] [ReadMe](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/ReadMe.md)：Source 原则上 MIT，标注例外及 FMOD 另算；Content／IP 不随代码放开商用。作者明确称约两周 jam、并非充分优化。[研究] 近期翻译提交不证明其是生产级 Unity 底座 |
| [deepnight/gamefeel](https://github.com/deepnight/gamefeel/tree/09d24aa05abe1192ad07cd3acd7270e6a5842237)，最新提交 2024-11-10，作者演示 v2 于 2024-05-01 发布 | [一手] [Options.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/Options.hx)将视觉后坐力、物理后坐力、缓冲、控制锁定等分开；[Hero.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/en/Hero.hx)把动作与反馈连接。[研究] 借逐项开关和清楚的事件绑定，而非引入 Haxe／Heaps 作为 Unity 插件 | [一手] [LICENSE](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/LICENSE)为 MIT；README 另列 Kronbits Inca tileset，不能用代码许可代替第三方资产核查。作者称学习演示而非实际游戏；未试玩，不给收益排名 |

**[一手＋研究] 演示的反证特别重要。** Deepnight 的 `gunAnimations` 会改变准备射击时序：代码中的预备时间为 0.33／0.06 秒；没有枪械动画时，爆发射击后又加 0.35 秒控制锁作为补偿。`gunRecoilVisual` 只改精灵偏移，`gunRecoilMovement` 改实际运动。故不能把“全开／全关”的差异全部归因于画面美化，也不能推断所有反馈越多越好。以上是固定源码的案例常量，不是本轮测量或通用推荐值。

[一手] [Game.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/Game.hx)的 slowMo 生命周期用未缩放时间更新，并显式计算游戏速度；`stopFrame` 名称／注释也不能替代阅读实际时长和速度倍率。[研究] Unity 中同样要明确输入缓存、命中判定、动画、粒子、相机、音频与 UI 的时钟政策；不能简单认为 `timeScale=0` 会统一暂停所有反馈，或把注释当完整机制。

### 4. 作者复盘与研究能支持多强的结论

- [一手] Sébastien Bénard 的 [GDC 2019 Dead Cells 复盘](https://media.gdcvault.com/gdc2019/presentations/Benard-Sebastian-DeepCells.pdf)，第 13 页（PDF 索引 13）列及时跳跃、到达位置辅助；第 16 页列自由转向与自动瞄准，第 21 页强调处理不属于挑战本身的细节。[研究] 由此支持减少无意操作摩擦、把挑战留在有意义选择上，不支持所有项目都加自动瞄准或统一容错时长。无未观看视频内容或未公开测量的推断。
- [一手] Maddy 的 [Celeste & TowerFall Physics](https://www.mattmakesgames.com/articles/celeste_and_towerfall_physics/index.html)解释特定 2D 像素／平台约束下的 Actor／Solid 运动。[研究] 支持为了具体动作设计运动政策，不支持默认绕开 Unity 原生物理并自研引擎。
- [一手] [Lin 等 2022 impact-feel 论文](https://arxiv.org/abs/2208.06155)摘要报告从玩家评论训练排序模型，再比较前八／后八游戏的反馈特征；认为顿帧、声音一致性、相机控制可能重要。[研究] 这是相关性与特征分析，不能据此声称加入顿帧会使满意度提高固定百分比。本轮未用它制定参数或量化收益。

### 5. 下一步验证和本轮交付边界

[研究] 将来已获授权的垂直切片应以一个高频动作作对照：2D 选跳跃／短连击，3D 选转身移动／一次近战；先让控制规则固定，再分别切换纯呈现，若改缓冲／顿帧窗口则明确另作玩法变化。比较接受输入到首个反馈的程序时刻、长帧位置、玩法误操作和人的可控／可读判断；再做一次需求修改，观察是否只需改动作参数及少量绑定。验证目标是更好的动作，不是通过更多检查项。

本轮完成公开一手正文、固定源码与提交元数据核查；未运行演示、真实引擎、设备测试或用户实验。仓库离线检查只证明文档交付，不能充当上述体验验证。[研究]

## 3D 运动补研：控制精度、接触连续性与物理重量的取舍

核实：2026-10-14 UTC。[一手] 为官方正文、固定源码与提交元数据；[研究] 为静态路径分析和采用建议。只读公开资料，未安装、运行引擎或试玩演示；本节深化 04 物理选择，不重复输入缓冲与显示插值。

### 1. 先按期望运动选，不能只按组件名字选

**[研究] 默认判断**：常规直立探索／动作角色，原生坡／阶与简单接触规则已满足需求时，✅ 原生 CharacterController 加窄运动层；已有可维护的刚体运动无需迁移。真正需要物体质量、冲量与摩擦相互作用时🧪力驱动动态 Rigidbody；需要原生接触求解但按游戏规则组织速度时🧪速度驱动动态 Rigidbody；稳定接地、任意附着／脱离或复杂台阶规则超过原生便利范围时🧪现成 kinematic motor。后两条都可能很精确，不能写成“Rigidbody 必然笨重、KCC 必然最好”。

[研究] “重量”不等于质量参数：有限加速度、方向反转时的承诺、落地压缩、武器动作时序都能塑造重量，同时保留精确落点；反过来，物理自然推出的移动也可能偏离动作游戏要求。应先描述人在坡顶、被击退、站上转台时想做什么，以及实际结果是否可信，再选哪一层拥有速度。

[一手] Unity 6.3 LTS 的边界：

- [CharacterController 组件](https://docs.unity3d.com/6000.3/Documentation/Manual/class-CharacterController.html)提供壁面滑动、Slope Limit／Step Offset 和 Skin Width。它不自行接受力，也不自动推开 Rigidbody；可在碰撞回调中编写推力。文档中以角色尺度举出的参数不是本仓库的通用推荐值。
- [Move](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController.Move.html)接收位移增量并受碰撞约束，不自动使用重力；[isGrounded](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController-isGrounded.html)是最近一次 Move／SimpleMove 的接地结果。[velocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController-velocity.html)来自移动前后差值，不追踪在控制器之外施加的 Transform／父级运动。因此它们不能直接充当世界速度、独立探地或平台动量系统。
- [Rigidbody.linearVelocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-linearVelocity.html)是世界空间速度；文档反对每步覆盖速度来期待真实物理，同时给出跳跃立即改速度的用例。[研究] 这是物理真实性边界，不是禁止所有作者控制的角色：采用速度驱动就显式维护允许保留的外力与接触后速度，不能一边全量覆盖、一边期待任意 AddForce 自然持续。
- [GetPointVelocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.GetPointVelocity.html)包含角速度；[MovePosition](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.MovePosition.html)描述运动学刚体按物理步移动及插值。[研究] 仅调用 MovePosition 不等于拥有角色的台阶、可走坡、接地和离台政策。

### 2. 三份许可清晰的实现：同样叫 controller，接触政策不同

以下固定 SHA 通过公开 GitHub API 核查，源码原文逐文件读取；时间是仓库提交／活动证据，不代表目标 Unity 版本已通过，不用 star 数推导品质。三者均有实际 motor 实现与演示代码，本轮没有证据把它们写成某商业游戏已验证的底座。只建议借对应机制或有条件试用，代码许可不替代演示资产和依赖核查。

**A. OpenKCC：🧪 需要显式 snap／平台政策时评估，保留现有行为再决定接入。**

- [一手] `nicholas-maltbie/OpenKCC@a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4`，v1.5.0，2023-09-15；[MIT LICENSE.txt](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/LICENSE.txt)。[package.json](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/Packages/com.nickmaltbie.openkcc/package.json)声明最低 Unity 2019.4，README 开发版本为 2023.1；不能据此声明 Unity 6.3 已兼容。包还依赖作者的状态机、screenmanager、testutils 及 Unity 包，接入不只是替换一个组件。
- [一手] [KCCMovementEngine.cs](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/Packages/com.nickmaltbie.openkcc/OpenKCC/Character/KCCMovementEngine.cs#L303-L339)先去重叠、求移动、按条件 snap down、再更新 grounding／平台。`ShouldSnapDown` 要求此前稳定着地、不滑坡且没有向上运动，避免把主动起跳吸回地面；`GetProjectedMovement` 把移动投影到可行坡面并保留输入长度，体现的是设计好的坡速规则。
- [一手] [RelativeParentConfig.cs](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/Packages/com.nickmaltbie.openkcc/OpenKCC/Character/Config/RelativeParentConfig.cs#L73-L108)保存平台相对位置／旋转或采用平台点速度，而非必须改变 Unity 层级；[KCCStateMachine.cs](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/Packages/com.nickmaltbie.openkcc/OpenKCC/Character/KCCStateMachine.cs#L302-L335)把刚体设为 kinematic，自行施加重力，跳跃显式加入 `GetGroundVelocity()`。后者支持不传动量、权重和默认最大弹射速度，说明“随平台站稳”和“跳出平台的运动”是两个决定。
- [一手／研究] 窄反例：[RelativeVelocityRigidbodyTracking.cs](https://github.com/nicholas-maltbie/OpenKCC/blob/a1a30ed7f7722ea82a1df6bd01849e0bfde6abf4/Packages/com.nickmaltbie.openkcc/OpenKCC/Environment/MovingGround/RelativeVelocityRigidbodyTracking.cs#L45-L64)计算的是两个速度的模之差的绝对值，不是速度向量差的模；等速反向输入在此函数会得到零差。另在 `KCCMovementEngine.GetGroundVelocity` 中，传入权重函数的第二参数是已取得的平台速度，不是单独读取的玩家速度。不能把该可选类名称解释成完整相对速度契约；这是固定路径的静态反例，不是实际引擎故障复现，也不否定其他平台路径。
- [研究] 可借：显式可站立／滑坡状态、起跳不吸附、平台跟随与发射动量分开。维护代价是查询／去穿透／更新顺序及依赖组合；代码年代本身不构成淘汰理由，但目标版本升级需验证，不能当作近年活跃维护的证据。

**B. Character Movement Fundamentals：🧪 学习／改造速度驱动刚体，不能按“物理控制器”承诺任意冲量自然保留。**

- [一手] `Jan-Ott/CharacterMovementFundamentals@49bd5569c1192dc98ac889046ff358c4eb8eeb44`，2025-02-09；[MIT](https://github.com/Jan-Ott/CharacterMovementFundamentals/blob/49bd5569c1192dc98ac889046ff358c4eb8eeb44/LICENSE)。[作者 README](https://github.com/Jan-Ott/CharacterMovementFundamentals/blob/49bd5569c1192dc98ac889046ff358c4eb8eeb44/README.md)说明 2019 发布、内容更新至 2021、支持至 2025-01，之后开源且无暇维护，建议自行 fork。它可以是可读机制来源，不能列为有持续维护承诺的 Unity 6 底座。
- [一手] [Mover.cs](https://github.com/Jan-Ott/CharacterMovementFundamentals/blob/49bd5569c1192dc98ac889046ff358c4eb8eeb44/Character%20Movement%20Fundamentals/Source/Scripts/Core%20scripts/Mover.cs)冻结旋转、关闭原生重力；地面传感器测距离，生成竖向 ground-adjustment velocity，`SetVelocity` 把它加到作者提供速度后写入 Rigidbody。台阶连续性来自传感器范围和地面距离修正，不是 capsule 自然走台阶。
- [一手] [AdvancedWalkerController.cs](https://github.com/Jan-Ott/CharacterMovementFundamentals/blob/49bd5569c1192dc98ac889046ff358c4eb8eeb44/Character%20Movement%20Fundamentals/Source/Scripts/Controllers/AdvancedWalkerController.cs)拥有 `momentum`、空中控制、地面／空中摩擦、陡坡滑动和 `AddMomentum`；这是运动状态的明确扩展点。[研究] 对编排击退，调用拥有者合入动量比让另一个脚本随时改 Rigidbody 更一致；不能推导成所有碰撞产生的引擎速度已自动保留。
- [一手／研究] [MovingPlatform.cs](https://github.com/Jan-Ott/CharacterMovementFundamentals/blob/49bd5569c1192dc98ac889046ff358c4eb8eeb44/Character%20Movement%20Fundamentals/Source/Scripts/Environment/MovingPlatform.cs)是 waypoint 平移样例：直接改平台 Transform，再给触发区中刚体 `MovePosition` 同一位移；未在此路径计算旋转接触点速度。抵达 waypoint 时平台位置被截到目标，但搬运乘客仍用先前 `_movement`，是端点步长值得验证的静态边界，不能据样例宣称各种旋转／高速平台已解决。

**C. SRMove：🧪 台阶连续性优先、愿意维护速度政策的轻量候选。**

- [一手] `NoiRC256/SRMove@a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b`，提交于 2025-12-03（仓库 pushed_at 为 2026-01-26，不将其误写为该源码提交日期）；[MIT](https://github.com/NoiRC256/SRMove/blob/a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b/LICENSE)。[Readme](https://github.com/NoiRC256/SRMove/blob/a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b/Readme.md)声明开发／测试 Unity 6000.0.32f1，属于作者兼容性说明，不是本轮复测或 6.3 保证。
- [一手] [AvatarMover.GroundDetection.cs](https://github.com/NoiRC256/SRMove/blob/a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b/Runtime/AvatarMover.GroundDetection.cs)向前后采样代理地面点来近似坡面；[AvatarMover.Core.cs](https://github.com/NoiRC256/SRMove/blob/a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b/Runtime/AvatarMover.Core.cs)结合坡面方向、hover 修正、重力和输入，每步写 `linearVelocity`。[研究] 它希望让台阶像连续坡面，适合重视平顺行走的玩法；窄台阶、锐利边缘和需要精确台阶落点的玩法不能直接沿用同一近似范围。
- [一手] [AvatarMover.API.cs](https://github.com/NoiRC256/SRMove/blob/a09e215b7f96357aafec5f2fba8ed8ff90d8cc6b/Runtime/AvatarMover.API.cs)的 `Move` 设定单步目标速度，`LeaveGround/EndLeaveGround` 控制吸附暂停／恢复，旧 force 方法已标 Obsolete。跳跃曲线与击退组合属于调用方，不能认为加上组件就有完整动作。
- [一手／研究] `UpdateMovement` 对平台取得的是 `_groundRb.linearVelocity`；绕中心旋转的平台在边缘仍有点速度，单凭此值不足以表达。README 的 `ParentableGround` 通过层级继承位置／旋转，是另一条可选跟随政策；要另外验证离台时继承、父级缩放、相机参考方向与碰撞受阻，不能将“能跟着平台”概括成所有平台动力学正确。

### 现成 motor 补比：先借已有平台机制，再决定补什么

核实：2026-10-14 UTC。针对「旋转升降平台＋边缘起跳／受击」这一个缺口补比两项；以下是商店元数据、作者公开文档／历史声明，不是包内源码审计或真实游戏实测。此前三份开源实现可读，不足以证明自行补齐原生 CC 比现成 motor 更省维护。[研究]

**D. Easy Character Movement 2（ECM2）：🧪 多种接触规则同时需要时，优先进入条件评估。**

- [一手] [商店页](https://marketplace.unity.com/packages/tools/physics/easy-character-movement-2-193614)列出的版本为 1.4.3、2025-07 发布，USD 80／席位（未含税，购买时重核），列 Unity 6000.0.53f1／2021.3.45f1；不是 Unity 6.3 已验证保证。[changelog](https://oscar-gracian.gitbook.io/easy-character-movement-2/user-manual/general/change-log)记录 1.4.2 提供原生 Unity 6 分发，并修复落到运动平台时运动模式与平台速度应用顺序造成的偏差。这是具体维护证据，不能推成持续支持承诺。在线 changelog 同时已出现未标日期的 **Version 1.5**，与商店列版不同；本轮不据此认定 1.5 已在商店发布。
- [一手] [CharacterMovement API](https://oscar-gracian.gitbook.io/easy-character-movement-2/user-manual/general/components/character-movement)区分平台跟随、旋转继承（描述为 yaw-only）与起跳／掉落时继承速度；该 API 页仍列 `PauseGroundConstraint`，但上述 1.5 changelog 已将其弃用并改为无需计时器的 `ClearCurrentGround`，因此不能跨版本照抄调用；`LaunchCharacter` 的公开接口支持分别覆盖或叠加速度。`fastPlatformMove` 会省略平台搬运时的 sweep，只适用于已知没有静态阻挡的情形。[研究] 这些入口直接覆盖原文准备自补的政策；不能据此宣称任意翻滚平台、侧挤和网络同步均已解决。
- [一手／研究] [创建教程](https://oscar-gracian.gitbook.io/easy-character-movement-2/walkthrough/creating-a-character)先创建无外观角色、接模型并调 capsule，尚需接入控制；[扩展教程](https://oscar-gracian.gitbook.io/easy-character-movement-2/walkthrough/extending-a-character)支持继承或事件组合。因此先复用 motor／已有模式，只补输入、技能和动画接口，不为了用包重建整个角色架构。1.4.0 有破坏性 API／Character 重构，1.4.2 又分离 Cinemachine 示例依赖；锁版本、区分运行时与演示依赖，升级仍需回归。[一手：上述 changelog]

**E. Philippe St-Amand 的 Kinematic Character Controller：👀 可复用的历史方案，不升级为 Unity 6 新项目的无条件默认。**

- [一手] [商店页](https://marketplace.unity.com/packages/tools/physics/kinematic-character-controller-99131)当前免费，3.4.4、2022-06 发布，原始 Unity 2020.3.30；不能从旧渲染管线表推出 motor 在现代 URP 必坏，也不能据免费与口碑保证 6.3 兼容。[作者 2022-09 声明](https://discussions.unity.com/t/released-rival-dots-character-controller/843064?page=5)明确 KCC 未被 Unity 收购，转免费后客户支持更有限；其 DOTS 方案 Rival 与这个 GameObject 包不可混同。
- [一手／研究] [作者发布说明](https://discussions.unity.com/t/released-kinematic-character-controller/678434?page=17)给出复杂台阶、可控模拟更新和自定义运动回调机制；它是复用碰撞／接地底座，再写玩法规则，并非完整游戏角色。历史机制足以反驳「平台只有从零写」；但本轮未取得当前包内源码、现代引擎兼容验证或可核查的指定发行游戏采用证据，不写成比 ECM2／原生更可靠。

**授权先于 Agent 接入。** [一手] 两商店页均列 Standard Unity Asset Store EULA、Extension Asset；免费或随包提供 C# 源码不等于 MIT 开源。[现行条款](https://unity.com/legal/as-terms)标注 2024-12-04 更新：EULA §2.2.1 允许符合条件的嵌入产品用途；§2.3.2 是按席位的 Extension Asset 规则；Terms §3.8(v)／EULA §2.2.1.1(g) 对相关 AI／ML 用途（文字包括输入）要求 Provider 和／或 Unity 明确同意。[研究] 常规获许可的引擎内集成，与把取得的资产包代码／数据交给 coding Agent 是两项判断；需要后者时先取得覆盖具体工作流的明确授权，未清权不默认将包交给 Agent，也不复制进公开仓库。普通公开技术文档不可仅因链接了商店就一概套用资产包许可；本轮仅借公开机制，不据此声称拥有包源码输入权限。这是采用门槛，不是法律意见。

**改变选择顺序。** [研究] 简单静态地形、少量基本坡阶继续保留原生 CC；已明确需要贴地、旋转平台与离台动量组合的新项目，应在写这层之前比较现成 motor。ECM2 的公开接口和 Unity 6 分发使它值得先评估，KCC 的维护／兼容边界使它更适合能自担升级的既有使用者；均不据文档宣布最优。只有实际需求、许可或接入成本排除了现成方案，才补窄层并写清缺口。购买、引擎导入或试玩留到获准阶段；动态价格、许可与版本于实际选型或 2026-11-14 前复核。

### 3. root motion 与混合路线：一个最终位移所有者

[一手] Unity 6.3 [OnAnimatorMove](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnAnimatorMove.html)在状态机／动画求值后、IK 前调用。Unity 官方历史样例 `Standard-Assets-Characters@8f185aa3c782d824976653dd6a6476312daad241` 的 [ThirdPersonBrain.cs](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/Assets/_Standard%20Assets/Characters/Scripts/ThirdPerson/ThirdPersonBrain.cs#L458-L481)只在非 root-motion 模式从 FixedUpdate 驱动 motor，在 root-motion 模式从 OnAnimatorMove 驱动；[ThirdPersonMotor.cs](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/Assets/_Standard%20Assets/Characters/Scripts/ThirdPerson/ThirdPersonMotor.cs#L215-L228)通过 adapter 提交移动，`GetMovementVector` 读取 `animator.deltaPosition`。这是互斥所有权的实际实现，不是 Animator 绕过碰撞直接移动身体。

[一手] 该仓库 [LICENSE.md](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/LICENSE.md)为 Unity Companion License，非 MIT；最后提交 2025-10-23 不能证明运动代码在 Unity 6.3 已通过。[研究] 只借“动画输出期望位移、motor 约束最终位移”的机制，不搬整套历史输入、相机和状态配置。自由移动通常由代码定轨迹、动画匹配实际速度；强调身体承诺的突进可采用动画位移，仍须决定受阻时缩短距离、停止／调整动作还是改变玩法。上述运动路线都能使用 root motion，区别在谁接受、限幅并提交位移，不是有没有 Animator。

[一手] 现代官方反例：Unity [Character Controller 1.4.5](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/index.html)是 ECS 包；[SimulateDynamicBody](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/dynamic-body-interaction.html)让 kinematic 角色模拟质量比例、推与被推，因此“kinematic 不能产生物理互动”不成立。[moving platforms](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/moving-platforms.html)同时区别 TrackedTransform 跟随与 PhysicsVelocity 提供正确推力信息。[研究] 能力可借鉴，非 ECS 项目不因它是官方就迁移架构；需与 GameObject 原生 CharacterController、PhysX Rigidbody 分开说明。

### 4. 升级、撤回与未来验收：以玩家感到的差别为准

- [研究] **先保留原生 CC**：接触规则简单且原生坡／阶已够用，重力与击退由一个所有者组织。平台数量少不代表规则简单；一旦明确需要旋转跟随、贴地和离台动量组合，先比较上述现成 motor，不能等补丁互相抵消后才补做选型。已有方案稳定则保留，不以功能清单长短升级。
- [研究] **保留速度驱动 Rigidbody**：已获得需要的接触与平顺步态，外部作用都能进入统一速度／momentum 接口。这是有效中间路线；若玩法后来要求持续质量交互、任意外部冲量和堆叠，重新评估力驱动或受控的混合政策，而不是不断增加写 velocity 的脚本。
- [研究] **撤回过度物理化**：为了精确移动不停抵消摩擦、清掉碰撞速度或禁止自然推力，说明保留的模拟价值可能小于调试成本；把需要的重量感留在作者参数／动画，不用更高 solver iterations 代替运动设计。反过来，若每种碰撞都要手写特例才能做出物理玩具的相互作用，则 kinematic 也可能不划算。
- [研究] **控制器升级验收**：相同关卡对比上／下坡速度、坡顶是否意外腾空、上／下窄台阶是否稳定、旋转平台站位／起跳方向、平台侧挤与低顶受击、root-motion 撞墙后的动作可读性。测记录只是解释现象，人判断是否更精确、更有重量、更少不明原因失控；不指定跨游戏通用坡角、snap 距离或击退恢复秒数。
- [研究] **第二次修改题**：增加一种旋转升降平台，并让已有攻击可击退站在其边缘的角色。检查接地状态、平台速度、角色自移和击退是否各只应用一次，主动起跳是否解除吸附，落地／重生是否清掉旧附着。AI 可写适配、暴露参数和记录运动贡献，人决定继承动量／转向／恢复控制的体验；若必须改大量无关技能和相机脚本，先收拢所有权，不新建通用运动框架。


### 5. Unreal 对照：同样的动作，不同的引擎责任

核实：2026-10-14 UTC。补充主线 3；改变 04 中把 Unity motor 责任隐含当作跨引擎默认的建议。新证据来自 UE 5.8 官方机制、API、Lyra 实例说明和 Mover 的明确发布状态；这里只核公开文档，不声称读过受授权限制的引擎源码或运行过样例。

**[一手／研究] ✅ 采用成熟 CMC，先检查它已有的扩展点。** [CMC 机制](https://dev.epicgames.com/documentation/en-us/unreal-engine/understanding-networked-movement-in-the-character-movement-component-for-unreal-engine)说明单机 TickComponent 进入 PerformMovement，统一处理外力／重力、动画 root motion／RMS，再按模式进入 PhysWalking／PhysFalling；MOVE_Custom／PhysCustom 提供特殊运动入口。与 Unity 的 Move 接口相比，UE 的现成层承担更多运动组织，不能从“要唯一 motor”推导出另写一个。网络玩法中 CMC 的 saved moves／重演要求临时运动进入其路径；直接 SetLocation 的客户端运动会被校正。这是需要联网时才增加的设计责任，不是单机采用预测的理由。

**[一手／研究] 平台和 root motion 分别保住原生语义。** [离台速度 API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UCharacterMovementComponent/GetImpartedMovementBaseVelocity)已按 bImpartBaseVelocityX／Y／Z 决定继承分量；先检查项目实际 movement base 行为，不叠加 Unity 控制器里自补的一套平台贡献。[Root Motion 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/root-motion-in-unreal-engine)明确：动画驱动 Movement Component；Walking／Falling 下 Z 向处理受运动模式与重力约束，不能为抬脚／跳跃动画随意切 Flying。文档还提示启用对应 root-motion 提取模式会使 Animation Graph 更新走 Game Thread，应在目标版本检查预算，不能把它视为无成本修复脚滑。

**[一手／研究] RMS 与 GAS 不互相等同，技能结束也不等于位移结束。** RMS 是程序化位移来源，提交参数后由 CMC 执行，并以 handle 管理移除；GAS 提供使用它的 Ability Tasks，但不是使用该机制的前提。官方 [Lyra 5.8 技能实例](https://dev.epicgames.com/documentation/unreal-engine/abilities-in-lyra-in-unreal-engine?application_version=5.8)中的 GA_Hero_Dash 在 root-motion force 完成后仍延迟结束 ability，以继续阻止开火／跳跃；GA_ADS 则在 End Ability 恢复速度、输入映射与镜头。可借“请求运动／保留动作限制／成对撤销”的责任划分；不把多人样例的全部 RPC、ASC 与 Experience 依赖搬入几种动作的单机项目。第二次把突进改成可被受击打断时，应同时检查位移来源、Montage、动作限制和镜头是否按设计结束，不能只 Stop Montage。

**[一手] 稳定引擎版本与实验模块分开记。** Epic 的 [5.8 正式发布新闻](https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available)日期为 2026-06-23；本轮核到的 [固定 5.8 Mover 页](https://dev.epicgames.com/documentation/unreal-engine/mover-in-unreal-engine?application_version=5.8)仍明确 Experimental，API／属性／数据格式可变，且说明会继续支持 CMC。不是沿用 5.7 标签推断当前状态，也不把文档默认版本当项目应立即升级的建议。

**[一手／研究] 👀 仅在结构性缺口时评估 Mover。** [5.8 对比页](https://dev.epicgames.com/documentation/unreal-engine/comparing-mover-and-character-movement-component-in-unreal-engine?lang=en-US)列出更宽形体支持、模块化模式与回滚机制，并把 CMC 标为已在许多发行项目使用。Mover 通过模拟步输入命令、模式／instant effects 等修改状态，多个 world frame 可能合入一次 simulation tick；不能移植“每帧随时写 velocity”。确有非标准形体或模块组合需求才承担这个迁移；只有联网玩法才比较 CMC 的 client moves／服务端校正与 Mover 的共享时间线／客户端回滚。没有瓶颈证据，不额外推荐异步运动更新或网络物理后端。

**[一手／研究] 样例先拆可借机制，再决定采用范围。** [Game Animation Sample](https://dev.epicgames.com/documentation/en-us/unreal-engine/game-animation-sample-project-in-unreal-engine)明确重点是动画展示，traversal 等 gameplay 是简单示例；可借 pose／trajectory／movement 数据如何连接，不能把漂亮跨障碍演示当作完整攀爬、战斗打断与发行验证。Lyra 是官方样例，也不等于本轮取得某个已发行游戏的可复核源码。UE 原生与样例按其适用引擎／内容条款使用，公开文档可读不代表代码或资产可任意再分发。本轮未下载资源、未接受新协议。

**[研究] 后续同目标验收**：先保留单机平地／坡顶／旋转平台／撞墙突进的基线，再加入“平台边缘突进途中受击→死亡→重生”的第二次修改；观察胶囊实际运动、网格姿态、movement mode、平台贡献与动作限制，确认无双重移动、残留输入或旧位移源。只有项目确需多人，再增加延迟／丢包下预测与校正，不把离线正确当网络正确。机制比较可改变借用选择，尚不能量化响应或手感收益。

本轮完成上述公开源码、许可、版本声明及官方 API 的静态核查；没有导入候选包、运行自动测试／演示、测量性能或证明玩家体验提升。后续真实引擎比较须按仓库现有授权门槛另行安排。[研究]


## 首发帧时间补研：从资源已加载到动作可见

核实：2026-10-14 UTC。主线 3／4；改变 04 中“首发卡顿按热点优化”的泛化建议，具体化为下一场遭遇的准备范围、可见反馈与驻留成本。新证据为 Unity 6.3 LTS 英文 PSO／加载／池 API 正文、Epic 当前 PSO 文档和 Tom Looman 的实际 Windows DX12 样例 trace／版本更新。未安装或运行引擎、未测真实设备，不将作者案例数值作为本项目收益。[一手／研究]

### 1. 先定义要保住的动作，再选择把工作移到哪里

[研究] 场景为首次进房、敌人首次预警、玩家第一次施放技能。已有输入缓冲和插值解决不了首次 GPU 管线创建，池化也不保证材质已被真正绘制。最小方案按下一场遭遇准备必须内容，区分取得资产、初始化实例、上传数据、准备绘制；不新建统一“全资源就绪”框架。可见角色、有效攻击提示、可操作反馈与伤害规则必须一致。装饰效果允许降级，关键提示不能为了 trace 无长帧而跳过；延迟开始遭遇是有代价但可解释的产品选择。

### 2. Unity 6.3 原生选项与不能互换的承诺

- [一手] [PSO introduction](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-pso-introduction.html)：GraphicsStateCollection 支持 Unity 6 起的路径，6.3 仍标 experimental，未来可变更／移除；DX12、Vulkan、Metal 使用其图形状态路径，DX11／OpenGL／OpenGLES／WebGL 回退到 shader warmup。Compute 与 ray-tracing shaders 不兼容此 PSO tracing。因此不能写成“所有 shader 已预编译”。
- [一手] [Other warmup methods](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-prewarm-other.html)：ShaderVariantCollection.WarmUp、Shader.WarmupAllShaders 等旧路径不推荐用于 DX12／Vulkan／Metal，因为缺少 graphics states 可能创建错误的 PSO。[研究] 预加载变体名单和覆盖实际渲染状态不是同一件事；不因为代码调用成功就结束首次绘制验收。
- [一手] [Trace and manage](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-pso-trace.html)建议每个平台／图形 API 单独采集；修改 shaders 后可再次 trace，将新数据追加至既有 collection。[研究] 第二个技能若只在新质量档、特定 keyword 或新的 pass 下出现，旧路线可能从未覆盖它；ContainsVariant 之类的成员检查也不能单独证明全部实际状态齐全。
- [一手] [Warm up PSOs](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-prewarm.html)提供 WarmUp 与 WarmUpProgressively，后者按指定 PSO 数量调度，两者返回 job handle。官方列出的定位 marker 为 Shader.CreateGPUProgram 与 CreateGraphicsGraphicsPipelineImpl。[研究] 逐批数量不是毫秒预算保证；在战斗帧同步等待任务仍可能破坏响应。采用条件是目标后端确有首次创建热点，且分组准备的加载成本可接受。
- [一手] [Application.backgroundLoadingPriority](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-backgroundLoadingPriority.html)区分后台读取／反序列化与主线程 integration，明确 Editor 不生效；Low／BelowNormal／Normal／High 对应文档 integration 时间为 2／4／10／50 ms，可观察 Application.Integrate Assets in Background。[研究] 这些不是整帧上限，也不约束全部游戏初始化脚本；不能拿 High 的快速读条测试推导可交互时也合适。
- [一手] [Texture and mesh loading](https://docs.unity3d.com/6000.3/Documentation/Manual/LoadingTextureandMeshData.html)说明异步上传把 binary 数据拆到后续帧；[资格页](https://docs.unity3d.com/6000.3/Documentation/Manual/LoadingTextureandMeshData-make-compatible.html)要求纹理非 read/write、非 Resources，Android 另需 LZ4；LoadImage 会强制同步路径。网格有独立条件，含 bone weights／BlendShapes 等限制。[研究] 不为异步资格删掉玩法所需 CPU 数据／变形能力；先查具体资产，再权衡提前加载或更小规格。[asyncUploadTimeSlice](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/QualitySettings-asyncUploadTimeSlice.html)是上传预算入口，不能与 backgroundLoadingPriority 当同一个旋钮。
- [一手] [allowSceneActivation](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AsyncOperation-allowSceneActivation.html)为 false 时进度停在 0.9、isDone 为 false，AsyncOperation 队列也会停滞，例如随后 UnloadSceneAsync 不能执行。[研究] 所以不能等“卸掉旧场景腾内存”才允许新场景激活，却把卸载排在被阻塞队列后；保持旧场景、加载数据和预热对象并存的内存要计入峰值。激活门只决定何时开始，不会自动分摊 Awake／OnEnable 的业务成本。

### 3. 池化与 GC：提前付费的范围必须有上限

[一手] Unity 6.3 [ObjectPool 构造参数](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Pool.ObjectPool_1-ctor.html)明确 defaultCapacity 是内部存储容量，不会创建该数量实例；池空时 createFunc 创建，maxSize 限制可留在池中的实例，满池归还走销毁回调。[研究] 因而“构造容量 100 的池”不能证明首发无创建，“maxSize=100”也不是 100 个同时存活弹体的玩法上限。需要实际预创建指定数量；若用 Get／Release 循环预创建，逐个立即归还可能始终只复用一个对象，应核对独立实例数。耗尽时额外创建、复用最旧装饰效果或拒绝可选效果由项目明确决定，不能静默丢关键弹体／提示。

[一手] [Pooling and reusing](https://docs.unity3d.com/6000.3/Documentation/Manual/performance-reusable-code.html)提供原生 UnityEngine.Pool，要求复用时重置状态，非线程安全；[GC overview](https://docs.unity3d.com/6000.3/Documentation/Manual/performance-garbage-collector.html)说明仍有引用的对象不会被回收。[研究] 保留池对象也保留其资源引用和原生对象成本，GC.Alloc 降为零不代表总驻留降低。按关卡／遭遇释放不再需要的池，检查托管、原生及 GPU 内存，而非只把所有技能池上限相加后永远常驻。

[一手] [GC modes](https://docs.unity3d.com/6000.3/Documentation/Manual/performance-incremental-garbage-collection.html)：增量 GC 默认把工作分摊到多帧，不降低总工作；对象引用变化太多可能使标记反复并回退完整收集，关闭 GC 则有堆持续增长风险。[研究] ✅ 先削减已定位热路径分配，🧪 对重复实例用有边界的池，⛔ 不为一次技能尖峰全局关 GC。若事件原因为 PSO 创建，做池化／GC 改造可能没有改变真正瓶颈。

### 4. Unreal 对照与实际开发者反证

[一手] Epic [PSO Precaching](https://dev.epicgames.com/documentation/unreal-engine/pso-precaching-for-unreal-engine)本次页面标为 UE 5.8，不能外推所有旧版。其 component 路径在 PostLoad 收集并异步编译；未完成时可推迟 proxy、显示默认材质或继续绘制并阻塞。文档同时指出预热后的驱动缓存首次取回仍可能有成本，保留更多低层 PSO 则增加内存。[研究] 新版原生自动路径优先；“有预缓存”不等于“首个反馈完整且准时”，也不保证工作线程竞争没有帧影响。用等待当前 outstanding requests 的 loading screen 不能证明未来尚未加载的技能也已覆盖。

[一手：作者实作] Tom Looman 的 [PSO 文章](https://tomlooman.com/unreal-engine-psocaching/)以 Windows DirectX 12 的 Action Roguelike／Project Orion 样例展示 Insights；图中未处理 PSO 的一项编译为 54.1 ms。作者在 UE 5.3 遇到包括 decal 的自动覆盖缺口，采用 bundled 加 automatic；文内更新明确 5.6 已增加 UDecalComponent 覆盖。文章要求冷驱动缓存、相同关卡与动作复核，并记录 2025-09 NVIDIA 缓存文件扩展变化导致旧引擎清缓存开关失效的版本提醒。[研究] 这是作者实作证据，不是独立重测、同硬件性能对照或所有版本的必现缺陷；不引用其转述的 Fortnite 时间或课程宣传作为收益。

**[研究] 采用与撤回**：✅ 先用锁定版本原生 automatic precaching 和验证；🧪 当 trace 仍指向未覆盖 PSO，再为这些遗漏补 bundled cache。不要把旧作者结论“两个系统必须一起用”作为新引擎默认工程负担。对 critical tell 提前加载／准备，而不是沿用跳绘策略后宣称顺滑；无法在预算内准备时收窄首场内容、材料组合或可选演出，而不首先加自建 shader 管理框架。

### 5. 第二次修改的未来验收设计

[研究] 新增一个使用不同材质／keyword／渲染状态的技能，并允许进房后立即施放。保留旧技能作基线：

1. 冷启动／确认冷驱动缓存、同进程重复施放、重启保留驱动缓存分别记录；不把“第二遍不卡”称为修复。清缓存只限将来获准的测试环境，并确认对应引擎／驱动真的生效，不在本轮操作任何系统缓存。
2. 对照按键被接受、首个可见角色动作／攻击提示／技能反馈、伤害生效的程序与画面证据；另列长帧 CPU／GPU／等待归因，不把软件 marker 当显示端到端延迟。
3. 比较无准备、遭遇范围准备及实际必要的扩大范围；同时记录准备总耗时、首次反馈、长帧位置、活动／闲置实例数、峰值与离开遭遇后的留存内存。低优先级准备若延长到玩家必用时刻之后，同样失败。
4. 改画质／图形后端重新覆盖，退出再进入检查池重置；既检查预热遗漏，也检查为了预热意外触发声音、伤害或奖励。减少装饰实例不能改变关键提示的出现与有效窗口。

本轮只完成公开正文与作者图文核查；未复现 54.1 ms、未验证 Unity 实验 API 在目标补丁上的兼容性、未建立性能排名。离线文档检查只验证仓库交付，不证明上述体验目标已实现。[研究]

## 菜单补研：跨暂停、改键与设备切换保住控制

核实：2026-10-14 UTC。主线 2／3；改变 04 输入／UI 的建议：从关键页可达，深化为切换后仍可控、反馈可信；同时限定 02 的逻辑动作注入能证明什么。[研究] 本轮读官方正文和发行游戏更新记录，未运行引擎或设备，未安装 UI 框架。

### 1. 先补玩家体验缺口，不因手柄支持迁移 UI

[研究] 场景是按住动作打开暂停，进入设置和改键，弹出确认层，换回键盘或接回手柄，再返回游戏。质量目标是始终知道当前选择、可用操作和返回位置，而且本次确认不会穿到下一层或游戏。对单人独立游戏，先约定当前交互层、初始／返回焦点、绑定提示来源和玩法恢复规则；少量菜单不需要先建通用窗口框架。设备恢复不等于必须自动恢复战斗，恢复时机由游戏决定。

[一手] [Celeste 官方 changelog](https://www.celestegame.com/changelog.html)保留了实际迭代链：v1.4.0 开放更完整的菜单改键，移除会与自定义绑定冲突的硬编码重开组合键；同版修复教程过程中打开键盘／手柄配置菜单冻结。v1.3.3.20 beta 修复关闭菜单时 movement/dash-only 输入未刷新；v1.3.3.13 beta 要求各菜单动作至少保留一个彼此唯一的绑定，失败发声，并让改键操作提示在滚动后仍可见。这些是开发者报告的修改，不是本轮复测结果；beta 的具体规则也不直接升格为所有游戏都应复制的标准。

[研究] 可迁移的判断是改键必须保住回退路径、全局快捷键也要参加冲突检查、退出菜单要刷新正确的玩法输入。不要盲抄 Celeste 的长按重置或唯一键算法；具体策略须适合游戏的设备与玩家。

[一手] Microsoft [XAG112](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/112)要求跨屏幕导航一致、布局变化后导航顺序保持合理，并以重绑定捕获为例说明退出方式必须有明确提示；[XAG113](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/113)强调可辨识的焦点，尤其覆盖在另一界面上的弹窗。[研究] 本轮只借这些与控制连续性直接相关的目标，不把它们扩写成通用无障碍清单，也不声称完成认证。

### 2. 原生机制够用的条件与新增成本

| 原生路线与直接依据 | 改变的建议 | 何时仍不足 |
|---|---|---|
| [uGUI 2.0 Navigation](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/script-SelectableNavigation.html)支持 Automatic／Explicit；滑条的值方向用于改值，不能用该方向移出滑条 [一手] | [研究] ✅ 已有菜单先保留；规则不符合布局时修少数导航关系，并验证滑条的进出路径，而非把全部导航重写 | [研究] 动态列表、布局重排使手工关系大量失效时，才需要共享导航策略；这是维护缺口，不是 uGUI 一概不能用 |
| [Unity 6.3 UI Toolkit FAQ](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-faq-event-and-input-system.html)可指定方向焦点；初始无焦点会使起点不可预测，禁用 UIDocument GameObject 后层级重建，重新启用时须再次设置焦点 [一手] | [研究] ✅ 新布局项目可按现有选型采用；将初始焦点与重开后的焦点恢复一起做。层级重建后重新查找目标，不把旧元素引用当永久身份 | [研究] 自动导航不符合实际布局时补局部规则；“第一次打开可操作”不能证明第二次仍可用 |
| [Input System 1.19 UI support](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/UISupport.html)：uGUI 需要 UI Input Module，UI Toolkit 2023.2+ 可用 project-wide actions；uGUI 背景点击默认清选择；UI Toolkit `Button` 的 `ClickEvent` 与手柄 submit 不同，而 `Button.clicked` 覆盖两者；UI 消费输入不自动屏蔽 gameplay action [一手] | [研究] ✅ 先用原生映射并明确 UI／玩法模式；键鼠混用时保护／恢复有效选择，采用适合控件的语义激活入口 | [研究] 直接调用业务回调的测试绕过绑定和焦点，必须补输入路径；不要用 debounce 掩盖两层同时响应 |
| [CommonUI Input Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/commonui-input-technical-guide-for-unreal-engine)：激活树参与路由，停用节点不参与；导航仍与基础 UMG 相同。[ActivatableWidget](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/CommonUI/UCommonActivatableWidget)可提供目标焦点、缓存恢复目标及最末激活节点的焦点刷新；默认不自动激活或注册 Back [一手] | [研究] ✅ 简单且已可靠的 UMG 保留；🧪 跨层返回、模态和设备提示需求反复出现时再评估 CommonUI，明确激活、返回和焦点策略 | [研究] 路由不是“接入便自动解决导航”；新依赖和配置要比第二个菜单继续复制政策更省维护，且实际返回目标仍须验证 |

[一手／研究] [CommonUI 与 Enhanced Input 集成页](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-commonui-with-enhnaced-input-in-unreal-engine)核实时仍显示 Experimental，并保留“as of UE 5.2”的未充分测试说明；页面在当前文档入口出现，不足以证明目标新版的可靠性状态，也不能据此一概禁用 CommonUI。使用该集成才核对所锁定版本的实际行为和更新，不为普通 UMG 菜单增加这条依赖。

[一手／研究] [PlayerInput 1.19](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/PlayerInput.html)提供设备丢失／恢复通知，说明原生可以检测这类变化；通知本身不负责游戏的暂停、焦点或恢复政策。先在已有设备管理上补处理，不另造全局设备总线。

### 3. 先读可复用实现：官方 UI vs Game Input

[一手] 固定沿用本记录的 `Unity-Technologies/InputSystem@05e45ddbaf18a93245b068d787d74b738b90d01c`，本次实际读取 [UIvsGameInputHandler.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/UIvsGameInput/UIvsGameInputHandler.cs)、[样例 README](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/UIvsGameInput/README.md)及[根 LICENSE](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/LICENSE.md)。这是 Unity Companion License 下供 Unity-dependent 项目使用的公开源码，不是可跨引擎随意复制的 MIT 库。该固定树 [package.json](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/package.json)标 `1.20.2`、最低 Unity `6000.0`；本节固定源码与上文 1.19 文档分列，元数据不证明它已作为稳定包发布或在目标项目运行通过。

- [一手] `SetUIEngaged`（304–327 行）在 UI 模式启用 UI map、停用玩法动作，并恢复上次导航选择；退出时保存选择、清空当前选择并恢复玩法。`SetPlayerActionsEnabled`（331–345 行）特意保留 UIEngage 动作，避免把退出入口一同禁用。主菜单入口另在 `Update` 先置 `InMenu` 再停用 gameplay input 和选择首按钮，`OnContinueClicked` 恢复游戏。
- [一手／研究] 可复用边界同样可见：恢复选择只检查 null，未在该路径验证目标是否仍激活／可交互；`OnControlsChanged` 注释明确不支持 mixed models，状态机只有一个 `InMenu`，没有嵌套弹窗栈。由此不能把整个样例当作完整改键、设备热切换和多层菜单底座；这些是静态覆盖范围，不是本轮复现的游戏故障。
- [研究] **✅ 优先改造样例中的模式归属与选择保存机制，⛔ 从零写等价事件总线或整包照搬。** 简单 uGUI 项目从所锁定已发布包携带的样例出发，保持其必要输入配置，再按真实缺口补有效目标后备和嵌套返回；已有 UI Toolkit 不为复用这个 uGUI 样例迁移，只借切换边界。第二个菜单若只需补这两项，不引新框架。该样例值得作窄机制参考；官方身份和源码可见都不足以证明其是已发行高品质菜单的完整实现。

### 4. 用第二个菜单判断共享层是否值得

[研究] 在将来获准的真实切片，先用原生做暂停→设置→返回，再新增带滑条、动态隐藏选项和确认弹窗的页面。改一个确认绑定并切换设备，检查四个结果：可见焦点与导航方向一致；提示对应实际可用绑定；关闭弹窗恢复原项或明确后备项；恢复玩法没有残留移动、幽灵攻击或重复确认。让重绑定取消也走完整返回路径。

[研究] 记录新增页面需复制或修改哪些政策，以及旧页面是否回归；先用少量共享的打开／关闭边界，只有重复的激活、返回和设备规则实际难维护才引入框架。原生已经达到目标则不迁移，框架仍需每页补同样规则且无明显减负则收回扩展。AI 可以生成绑定、导航与回归场景，人判断焦点是否容易找到、操作是否费力；输入事件日志和截图须互相印证，状态注入不能替代设备路径。这是未来验证设计，非已证实的框架收益。


## 存档复用补比：序列化、落盘与玩家恢复分开选

核实：2026-10-14 UTC。[一手] 固定源码、官方接口和商店条款；[研究] 为静态路径推导及采用判断。回应的缺口不是再要求 schema roundtrip，而是**哪些现成部分值得直接采用、哪些恢复责任仍由游戏拥有**。仅公开资料与源码阅读，没有下载资产、安装、运行游戏／引擎或做故障注入。

### 1. Mindustry：实际游戏把格式、内容映射与文件恢复分开

[一手] 固定 `Anuken/Mindustry@17012d61d9e4c3cbd9820d87e81c24495486ac53`，commit API 显示 2026-10-08；[README](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/README.md)给出实际游戏发行入口，不是专门为演示保存 API 写的模板。[GPL-3.0 LICENSE](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/LICENSE)允许商业使用但带分发义务；不把 GPL 当作禁止商用，也不当作闭源项目可随意复制的 MIT。这里不复制代码或美术，代码许可核对不代表资产权利已逐项清理。该 SHA 是研究快照，不等于建议追随开发分支。

- [一手] [SaveIO.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/io/SaveIO.java)：注册 Save1 到 Save13，最新版负责写、按文件版本选择读；未知版本有独立错误。`save` 先把已有主档移为备份，再写主档；捕获写异常时移回备份。`load(Fi, WorldContext)` 在 SaveException 后尝试备份。**版本读取与文件恢复是不同路径。**
- [一手] `isSaveFileValid` 只调用 `getMeta`；[SaveVersion.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/io/SaveVersion.java#L48-L76)的 metadata 读取不遍历 map／entities 等全部区域。`readContentHeader`（627–654）按保存的名称重建临时内容映射，其中 block 有单独 fallback；它不自动定义所有类型缺失后的玩法政策。
- [一手] [Saves.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/game/Saves.java#L120-L199)读取 sectorPreset／旧位置，先把待迁移文件移到临时名称，随后集中回填目的地及 sector info，注释明确为允许位置互换。文件目的地、关卡身份和附属进度一起迁移，比“改 ID 映射表”多一个层次。
- [研究] **采用其职责划分与交换顺序；不采用整个 Java／Arc 世界序列化器作为 Unity／UE 插件。** 依赖和数据模型不同，移植代价高于项目自己的少量迁移函数。内容改名可按类型显式映射；只有真实出现关卡存储位置交换时才做暂存／回填，不默认引入通用迁移图。
- [一手／研究] 不能把上述保存路径宣传成断电事务：主档先移走，catch 不能在进程被终止后执行；[列表发现](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/game/Saves.java#L65-L78)遍历现存文件并排除名字含 backup 的项。应专门验证“只剩备份时能否从菜单恢复”，不能仅凭内部 load 有 fallback 宣称玩家可达。这里是限定源码路径，不是对发行版本丢档率的测量。

### 2. Thrive：类名存在，不等于迁移器仍适用于新格式

[一手] 固定 `Revolutionary-Games/Thrive@eceb8011d5e86b19dfa75de9e55eee6815fd1450`，commit API 为 2026-10-14；[README](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/README.md)链接 Steam／itch 游戏。[LICENSE.txt](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/LICENSE.txt)为 GPL-3.0-or-later，带独立 mod 动态加载例外；该例外不是复制整个保存模块进任意闭源游戏的通行证。近期仓库活动不保证每个历史接口已完成改造。

- [一手] [Save.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/Save.cs)已经把主要世界状态放进 `save.bin`，metadata 保留 JSON；`ReadFromArchive` 按对象 serialization version 读取，版本 2 新增 JukeboxPlaybackState，旧版取 null。因此存在当前格式的版本化读取，不能说全部旧档能力都坏了。
- [一手] 同文件的 `LoadJSONStructureFromFile` 明确抛 NotSupportedException，`WriteSaveJSONToFile` 抛 NotImplementedException；[ISaveUpgradeStep.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/ISaveUpgradeStep.cs)仍注册一个 `0.8.3.0-rc1 → 0.8.3.0` 的 UpgradeJustVersionNumber，实际 PerformUpgrade 仍调用这两个旧 JSON 入口，注释说明待 archive 改造。
- [一手] [SaveUpgrader.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/SaveUpgrader.cs)仅在存在到目标版本的 step 路径时报告可升级；[SaveListItem.cs](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/saving/SaveListItem.cs)先区分损坏、已知不兼容、可升级、较新版本等，再发相应 UI 事件。**旧 helper 遗留不证明普通加载或当前 UI 必然触发它。**
- [研究] **✅ 借鉴面向玩家的失败分类；⛔ 不直接采用其遗留 JSON upgrader。** 玩家需要知道是文件坏、需要新游戏版本，还是内容不兼容；不能所有错误都显示“没有存档”并自动新建。采用前追到真正读写入口和可达条件，而非凭 `SaveUpgrader` 类名或曾经的功能介绍决定。Thrive 的对象图和 Godot／archive 依赖也不值得为简单 checkpoint 存档迁移过来。

### 3. 原生、开源序列化库与商业候选怎么取舍

[研究] 下表的“采用”指建议复用的机制，不代表本轮安装、购买或已测目标平台。已满足需求的项目不为增加候选迁移。

| 候选 | 可直接借用与最低成本 | 不替项目解决什么／本轮判断 |
|---|---|---|
| Unity JsonUtility | 引擎内已有；显式小 DTO 无新增库维护。官方说明只序列化字段，不支持 Dictionary，可用普通 JSON 库补缺口 [一手：[6.3 文档](https://docs.unity3d.com/6000.3/Documentation/Manual/json-serialization.html)] | ✅ 简单 checkpoint／库存保留。它是 JSON 转换器，不是存储提交与恢复系统；不要为存储失败换序列化格式 |
| Unity Newtonsoft 包 | ✅ 项目需要字典或 JSON 树操作时复用现成包；[官方页](https://docs.unity3d.com/Packages/com.unity.nuget.newtonsoft-json@3.2/manual/index.html)列出 LINQ to JSON 并链接源码。[上游许可证](https://github.com/JamesNK/Newtonsoft.Json/blob/13.0.2/LICENSE.md)为 MIT；实际包保留其自带 notices，无另购序列化库费用 [一手] | 不写自己的 JSON parser，不同时塞两份 DLL；按项目已锁包与 AOT／IL2CPP 验证。Unity 包号与上游库号不同，网页包 3.2.2 的说明仍称对应 13.0.2，不把它当上游最新版。不提供内容政策或断电恢复 |
| UE SaveGame | ✅ 保留 SaveGameToSlot／AsyncSaveGameToSlot 与完成结果；SaveGameToMemory 和 SaveDataToSlot 已把内存序列化与平台写入分开，后两者均同步 [一手：[官方页](https://dev.epicgames.com/documentation/en-us/unreal-engine/saving-and-loading-your-game-in-unreal-engine)] | 不因多槽而自建跨平台文件系统；主机等平台路径不同。公开指南没有承诺任意多文件原子提交，仍需项目恢复政策；使用受引擎 EULA 约束，不是开源库许可 |
| Mindustry／Thrive 的整套保存模块 | 实际游戏中的版本／恢复／菜单机制可读，研究成本低 [一手：上述固定源码] | ✅ 借设计与反例；⛔ 不作 Unity／UE 通用保存底座。GPL 分发义务、引擎和世界对象图耦合；本轮未独立验证任何一个游戏的玩家恢复成功率 |
| Easy Save 3 | 🧪 现有 Unity 项目或确有多类型序列化／工具支持缺口时评估；现成缓存、类型适配及备份调用，免去等价自研 [一手：下列官方 API] | 缓存写入、备份轮换、内容兼容仍分开验收；不为几个 DTO 默认购买，更不因付费就承诺恢复更强。资产包未取得，未审内部落盘实现 |

[一手] Easy Save 的 [CreateBackup](https://docs.moodkie.com/easy-save-3/es3-api/es3-methods/es3-createbackup/)复制当前文件为 `.bak`，会覆盖已有备份；[RestoreBackup](https://docs.moodkie.com/easy-save-3/es3-api/es3-methods/es3-restorebackup/)返回是否找到并恢复备份，不代表新内容下的完整进度有效。[缓存／性能说明](https://docs.moodkie.com/easy-save-3/es3-guides/performance/)允许把多次键操作合并成一次持久写入；自行用线程时要求一次只在一个线程访问且数据线程安全。说明还明确删除重建 reference manager 会使旧引用 ID 的存档失效。[引用文档](https://docs.moodkie.com/easy-save-3/es3-guides/saving-and-loading-references/)把 manager 定义为 scene-specific，不能把它当跨场景内容身份服务。

[研究] **Easy Save 若已采用，优先借它的缓存与明确的备份 API，再为业务快照和恢复选择加薄层；不要同时自建另一个键值保存框架。** 缓存合并不等于业务一致快照，恢复文件不等于接受进度，场景引用 ID 不等于长期内容 ID。保存升级后立刻覆盖唯一 `.bak` 可能丢失唯一兼容旧版的副本，因此升级保留副本应与普通轮换备份分开。

| 动态事实 | 核实来源／日期 | 选型影响与重核触发 |
|---|---|---|
| Easy Save 商店显示 USD 59（税前）、Extension Asset、3.5.27／2026-07-18 | [官方商店](https://assetstore.unity.com/packages/tools/utilities/easy-save-the-complete-save-game-data-serializer-system-768)，2026-10-14 | 单人预算参考，不是含税成交价；购买／包升级或 2026-11-14 先到者重核 |
| Standard Asset Store EULA，Extension 按 seat；不是开源授权 | [条款 §2.3](https://unity.com/legal/as-terms)，2026-10-14 | 源码若随包提供也不能当作可公开再分发；实际席位和合同在取得时核对 |
| Asset Store 条款 §3.8 包含 AI 输入限制 | [同一官方条款](https://unity.com/legal/as-terms)，2026-10-14 | ⛔ 未清授权前，不把付费包源码整包输入 Agent；本轮只读公开技术文档，不声称已获得包输入许可。购买、供应商书面许可或条款变化时重核 |

### 4. 最小实现边界与后续验收

[研究] 小型独立游戏只保留三个责任：项目 DTO／内容迁移；现成序列化器＋引擎或已采用库的存储能力；游戏自己的恢复选择与提示。它们可以是少量函数，不要求三个新框架。成熟实现显示这三件事有不同失败模式，不能以“写一个通用 SaveManager”代替取舍。

1. **候选验收先于覆盖。** 分别读取主档、上次已验收的副本和迁移前副本；按版本与完整内容判断。候选对象先独立构造，失败不留下半个世界。选中副本后显示恢复的时间／章节，保留故障原档；全部失败时让玩家选择新开槽，不默认覆盖。
2. **重新保存是第二个风险点。** 读取失败、回退备份后立即 autosave、升级失败再试都可能轮换掉有效旧档。恢复流程完成前暂停对该槽的自动覆盖；只有明确接受新快照后才按保留政策清理，磁盘满时不为腾空间先删唯一有效副本。
3. **不承诺跨平台统一的 rename 原子性。** 用所选平台／库提供的提交能力；只有现成路径不满足时才补目标平台的暂存、替换和发现逻辑。不要根据有 try/catch 或 `.bak` 就宣布断电安全。
4. **第二次内容变化要触到实际地址。** V1 两个关卡分别有进度；V2 改名并换存储位置；V3 删除／替换一个道具。验主档缺失而备份存在、metadata 完好但实体区截断、迁移中断再启动、恢复后立即自动保存以及两个关卡位置互换。断言进度未互串、奖励不重复、旧副本仍可找回，而不只断言 JSON 能读。

[研究] 以上为未来获准的引擎／目标存储验收设计；静态阅读没有证明文件落盘耐久性、UI 实际可达性或商业库净收益。若既有组件通过这些路径且维护更省，就停止自研；若复杂对象图保存只增加引用和迁移负担，回到稳定内容 ID 的窄 DTO，而非继续扩张框架。

## 呈现节奏补研：平均 FPS 与实际看到的动作不是同一个承诺

核实：2026-10-14 UTC。主线 3／4；改变 04 将“高 FPS 仍不顺”主要归于姿态插值或长帧的建议，补上呈现同步、排队和限帧政策。新证据为 Factorio 开发者迁移复盘、osu! 固定等待源码及 2026 年反证讨论、Unity 6.3／UE 5.8 原生契约、Unity 当前版本缺陷记录与 Mir 2 部署案例。本轮仅调查公开资料与静态源码，不运行真实引擎、设备或性能实验。[一手／研究]

### 1. 真实游戏：先辨认问题，不因理论最优重写架构

[一手：作者实述] Factorio 开发者 posila 于 2019-03-19 [说明](https://forums.factorio.com/viewtopic.php?p=415072)，迁移 DirectX 11 时发现帧间隔约 14–18 ms，平均仍达 16.67 ms；显示实际为 59.95 Hz 时，生产与显示渐渐错位，出现重复图像或丢帧。他以 VSync 改变默认行为，但明确效果含观察和理论判断，并未给跨设备对照。完全拆开更新与渲染需要改变渲染准备的数据，接近 1.0 时成本不可接受。

[研究] 可借的是诊断与成本判断：工作量足够小不等于按时显示；成熟游戏也会选择有边界的原生修正，而不为理想架构推翻底座。此为 0.17／当时 Windows 路径，不是今天 Factorio 全平台行为，更不能引用同帖中历史 G-Sync 猜测作为现行配置指南。

### 2. 原生设置必须按平台读，实际帧率不能从目标推定

[一手] Unity 6.3 LTS [Application.targetFrameRate](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-targetFrameRate.html)正文区分：桌面 VSync 非零会忽略该目标，软件限帧存在 microstuttering；Android／iOS 使用 targetFrameRate，忽略 vSyncCount；XR 由 SDK 控制。[研究] 因而“统一锁 60”不是跨平台方案。桌面先建立 VSync 基线，移动端使用持续负荷下可维持的原生 pacing 档位；并非宣布 VSync 在所有竞技、VRR 与设备情境下最优。

[一手：实际部署案例] Google 的 [Mir 2 案例](https://developer.android.com/stories/games/swappy)，更新于 2025-02-06，报告该 Unity 游戏启用内置 Optimized Frame Pacing 后，20 FPS 门槛的 Slow Session 比例从 40% 降至 10%。[研究] 支持已有集成值得先试；该指标不是平均帧率、毫秒延迟或满意度，更不是“性能提升四倍”。文中没有足够实验控制与样本信息支持独立游戏的收益预测，游戏本身也不是单人独立制作证明。

[一手] [UE 当前移动 Frame Pacing 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/frame-pacing-for-mobile-devices-in-unreal-engine)页面标 5.8：Android 的 Swappy 从 5.2 起默认启用；支持按 Device Profile 设置及查询目标档位是否受支持。[研究] 不照搬 4.25 旧文再造插件或默认补启用开关；维护成本主要是设备档位、版本升级与回归，而不是新增 runtime。

**版本反证**：[Unity UUM-68029](https://issuetracker.unity.com/issues/8340/applicationsettargetframerate-different-results-when-optimized-frame-pacing-is-used)记录 Optimized Frame Pacing 开关两种路径对同一目标帧率采用不同取整策略；本次页面列 6000.7.0a4 Fixed、6.3.X 等 Won't Fix。[一手] 这不能推成整个 pacing 不可靠，也不是建议发行项目迁移 alpha；它改变验收方法：比较开关时同时记录实际帧率与刷新率，否则可能是在比较不同工作档位，而非纯 pacing 效果。[研究]

### 3. 降排队延迟有代价，不能把最低数值当最好

[一手] Epic [Low-Latency Frame Syncing](https://dev.epicgames.com/documentation/en-us/unreal-engine/low-latency-frame-syncing-in-unreal-engine)当前 5.8 页面解释 game thread 与 render thread 同步，不保证它们紧跟最终呈现；提供 `r.GTSyncType` 选择 render／RHI／swap-chain 同步。降低 `rhi.SyncSlackMS` 缩短 pipeline，也更容易因 hitch 错过帧；模式 2 在不支持的平台回退模式 1。

[研究] 🧪 仅当软件链路显示排队是主要问题时评估；保存原配置，对照响应与长帧，不把文档的 30 Hz 示例数值搬成项目目标，也不把面向旧并行渲染背景的说明当作每个当前平台默认状态的实测。没有证据支持全局禁用 `r.OneFrameThreadLag` 或将 slack 一律设零。

### 4. 开源反证：不要重复修复早已存在的等待实现

[一手] osu-framework 固定提交 `2140bf7dae73a6389ffea01f81319a39392c8ef1`：

- [ThrottledFrameClock.cs](https://github.com/ppy/osu-framework/blob/2140bf7dae73a6389ffea01f81319a39392c8ef1/osu.Framework/Timing/ThrottledFrameClock.cs)选择平台原生等待，测实际睡眠、累计误差，并限制负误差以避免过多追赶帧。
- [WindowsNativeSleep.cs](https://github.com/ppy/osu-framework/blob/2140bf7dae73a6389ffea01f81319a39392c8ef1/osu.Framework/Platform/Windows/Native/WindowsNativeSleep.cs)先尝试高精度 waitable timer，失败时回退普通 timer，原生等待失败再由调用者回退 Thread.Sleep。
- 同提交 [LICENCE](https://github.com/ppy/osu-framework/blob/2140bf7dae73a6389ffea01f81319a39392c8ef1/LICENCE)为 MIT；本轮逐文件读 raw 正文，没有安装或运行。它证明已有实现，不能证明目标 Unity／UE 兼容或性能收益。

[一手：维护者讨论] 2026-03-11/12 的 [#6719](https://github.com/ppy/osu-framework/discussions/6719)中，报告者建议改 timer／busy wait；维护者指出已经实现原生 timer，并试过部分混合方案而不认为收益值得。报告者随后承认未先读完整代码，并把突然长停顿与普通等待误差拆成两个问题。该讨论仍为 Unanswered，不是合入修复或效果证据。

[研究] **⛔ 不把此限帧器移植到 Unity／UE，不让 Agent 先写 Sleep／spin loop。** 该框架真正承担自己的循环，商用引擎已有不同同步所有权；叠加等待会增加新的节奏与功耗成本。源码可借“先检查已有实现、识别回退路径”，不能证明忙等一定治好驱动、合成器或显示队列问题。MIT 可复制也不等于值得复制。

### 5. 使用已有观测工具，避免再建 FPS 仪表盘

[一手] [PresentMon 官方 README](https://github.com/GameTechDev/PresentMon/blob/main/README.md)提供 Windows ETW 的 CPU／GPU／Display duration 与 latency；[Console 文档](https://github.com/GameTechDev/PresentMon/blob/main/README-ConsoleApplication.md)区分 DisplayLatency 与 DisplayedTime，后者对未显示帧可以为 NA。README 同时指出 OpenGL／Vulkan 的部分 instrumentation 与 HWS GPU 时序存在精度边界，不能把字段中的零直接解释为没有等待。本次读当前 main 文档，未固定发布版或运行采集，不作为跨版本字段保证。

[研究] 🧪 后续获准设备验证时，现有引擎 Profiler 定位工作热点，呈现仍异常再补 PresentMon 这一既有工具候选；无需自己写跨平台采集库。先确认权限和字段适用性，不为采集自动修改用户系统设置。软件事件只能描述其观测边界；端到端光学测量另需设备方案。

### 6. 下一次修改的最小验证设计

[研究] 固定同一段横向移动／连续转向／一次瞄准攻击，先用已经准备好的资产排除首发路径；第二次修改加入新的画质档或支持另一刷新率。

1. 记录引擎版本、后端、窗口模式、实际刷新率、实际帧率、VSync／pacing／外部限帧状态，先避免多个 limiter 同时作用。
2. 比较同一路径的帧间隔分布、持续长帧位置、未显示帧和首个可见反馈；分清工作耗时、等待与显示间隔。
3. 在持续负荷、暂停恢复及改变窗口／刷新率后复测；移动端同时看热降频后的持续表现，不只刚启动几十秒。
4. 人确认轨迹是否均匀、瞄准是否跟手；若改善一项明显损伤另一项，保留原设置并收窄采用范围。

本轮已核查公开正文、实际开发者说明、固定源码与许可；未复现案例收益、未运行 PresentMon 或真实设备。GitHub commits API 遭遇公开 rate limit，但固定 raw 源码成功读取；没有把源码阅读声称为引擎兼容性或性能通过。[研究]
