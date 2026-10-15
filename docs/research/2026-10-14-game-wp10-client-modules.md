主线：一／二／三／四；客户端体验、验证选择、第二次修改与交付
改变的建议：[研究] 默认复用引擎成熟组件，仅补所有权、退出和迁移规则；输入、运动、首发／呈现、粒子预算、菜单、存档、本地化、音频与时域画面分别按动作质量验收；game02 按待证事实选观察，不预建验证阶梯；长文按已承诺输入路径读完，字体默认值可撤回但语言发行门槛不降低；动作已执行的卡角先查空间表达，再按动作选择局部纠偏；镜头变化先选择听点位置、朝向与速度，再调声音衰减；续玩与撤销失败分开决定，不把永久死亡等同于不能中途离开
新证据：[一手／社区] 固定源码、官方契约／问题及开发者复盘；补输入后端、暂停时钟与截图降噪边界，重读笼子退出案例，补像素量化、信号优先级与呈现设置的玩法信息边界，以及 Thrive 旧报告保存／重译路径和原生文本转换合同；新增 Factorio 粒子因果、Vercidium 固定样例与两引擎模拟／绘制取舍；补 Stardew Valley 字体回退、Factorio 长 tooltip 与 Thrive 字体配置链；新增 Factorio 地形通行复盘、Celeste 固定纠偏与后续危险条件修订、Mina 排出维护反例；新增 Factorio 视口听点与远程视图多普勒修复、Overgrowth 固定听点调用链及 NieR 角色附近听点反例；新增 Gungeon 层间续玩、Klei 退出保存与 Cogmind 恢复点分工；未做引擎、设备或玩家实测，不能推出性能排名、AI 成功率或体验收益

# WP10：客户端模块怎样在第二次修改后仍然可靠

证据核实：2026-10-13—15 UTC，各节保留版本和日期。[一手] 为官方契约／固定源码／作者报告，[社区] 为原帖，[研究] 为推导。各轮均未安装付费插件或开展引擎、模型、设备、玩家实测；源码与作者数据不等于本项目复现。建议落点为 [客户端核心模块](../../domains/game-dev/04-client-modules.md)。

**[研究] ✅ 默认复用成熟组件；仅补项目缺少的所有权、迁移和模式切换规则。** 先验场景取消、释放、旧档、暂停与设备峰值，再决定是否加框架；无同任务实测，不作质量／性能排名。

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

**改变建议**：[研究] 菜单开启先更新各动作的接收权限，再禁用当前不允许的动作／map；否则 Disable 引发 canceled 时，旧 gameplay 回调可能仍把它看作主动松开并执行结算。模拟暂停与输入权限分别决定，战术暂停不必停用全部玩法输入。取消回调只按动作契约清理；需要“松开触发攻击”的动作必须区分交互正常完成和系统取消。此结论来自契约／源码，不是 Codex 或 Claude 实测错误统计。

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

[研究] 正文覆盖 11 个客户端模块，按最低程度、可省范围、现成机制、AI 风险与后续验收组织；Unity 异步选型与 Unreal 生命周期对照见前文。分档不以价格／功能数量排名，原生够用即停止加框架；不扩到自研引擎或单机不需要的联网。

### 能推翻推荐的条件

- 如果目标版本／目标设备的竞态和内存测试通过，且组合等待明显减少维护负担，可扩大 UniTask 使用；当前没有证据全面禁用它
- 若模板覆盖绝大部分实际玩法、许可及 Agent 输入范围清楚，且第二次修改成本更低，可重评整包底座；“官方”或“源码可见”本身不够
- 若原生音频制作成本超过中间件接入／bank／授权成本，可采用 FMOD；没有听验和制作成本，不能宣布它是音质升级
- UI Toolkit／uGUI 按实际引擎版本、关键帧动画、布局和可访问性重新判断；旧翻译页与新英文功能表不能混成同一基线

### 下一项有价值的验证

[研究] 优先固定包验证第 1 节 A／B 复用与第 7 节旧档矩阵；先查身份、次数和旧场景写入，不只查异常。真实引擎试验待授权。

补充纠偏：[Unity 6.3 协程文档](https://docs.unity3d.com/6000.3/Documentation/Manual/Coroutines.html)区分 GameObject 失活／宿主销毁会停协程，而 MonoBehaviour.enabled=false 不会。[一手] 对象池回收政策须按实际停用方式写，不能笼统认为“禁用后所有后台行为都停”。

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

[研究] 本表只核公开动态状态；未取得样例文件许可或目标版本修复证据。

## 体验质量深化：响应与顺滑，让同一个动作值得反复玩

核实：2026-10-14 UTC。以下补 04 的动作回应、可读性与连续游玩质量，比较 2D 动作和 3D 第三人称；节奏、容错与演出强度按玩法选择。[研究]

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

## 3D 运动补研：控制精度、接触连续性与物理重量的取舍

核实：2026-10-14 UTC。以下按官方契约和固定源码深化 04 的运动选择；输入缓冲与显示插值见前节。[一手／研究]

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

## 首发帧时间补研：从资源已加载到动作可见

核实：2026-10-14 UTC。主线 3／4；改变 04 中“首发卡顿按热点优化”的泛化建议，具体化为下一场遭遇的准备范围、可见反馈与驻留成本。新证据为 Unity 6.3 LTS 英文 PSO／加载／池 API 正文、Epic 当前 PSO 文档和 Tom Looman 的实际 Windows DX12 样例 trace／版本更新。未安装或运行引擎、未测真实设备，不将作者案例数值作为本项目收益。[一手／研究]

### 1. 先定义要保住的动作，再选择把工作移到哪里

[研究] 场景为首次进房、敌人首次预警、玩家第一次施放技能。已有输入缓冲和插值解决不了首次 GPU 管线创建，池化也不保证材质已被真正绘制。最小方案按下一场遭遇准备必须内容，区分取得资产、初始化实例、上传数据、准备绘制；不新建统一“全资源就绪”框架。可见角色、有效攻击提示、可操作反馈与伤害规则必须一致。装饰效果允许降级，关键提示不能为了 trace 无长帧而跳过；延迟开始遭遇是有代价但可解释的产品选择。

### 2. Unity 6.3 原生选项与不能互换的承诺

- [一手] [PSO introduction](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-pso-introduction.html)：GraphicsStateCollection 支持 Unity 6 起的路径，6.3 仍标 experimental，未来可变更／移除；DX12、Vulkan、Metal 使用其图形状态路径，DX11／OpenGL／OpenGLES／WebGL 回退到 shader warmup。Compute 与 ray-tracing shaders 不兼容此 PSO tracing。因此不能写成“所有 shader 已预编译”。
- [一手] [Other warmup methods](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-prewarm-other.html)：ShaderVariantCollection.WarmUp、Shader.WarmupAllShaders 等旧路径不推荐用于 DX12／Vulkan／Metal，因为缺少 graphics states 可能创建错误的 PSO。[研究] 预加载变体名单和覆盖实际渲染状态不是同一件事；不因为代码调用成功就结束首次绘制验收。
- [一手] [Trace and manage](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-pso-trace.html)建议每个平台／图形 API 单独采集；修改 shaders 后可再次 trace，将新数据追加至既有 collection。[研究] 第二个技能若只在新质量档、特定 keyword 或新的 pass 下出现，旧路线可能从未覆盖它；ContainsVariant 之类的成员检查也不能单独证明全部实际状态齐全。
- [一手] Unity 6.3 [裁剪说明](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-variant-stripping.html)指出，所需变体被裁掉后可能回退到相近变体；运行时切换 `shader_feature` 分支也有遗漏风险。[严格变体匹配与构建日志](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-how-many-variants.html#highlight-missing-shaders)可分别暴露缺失变体／keywords，及构建中的各阶段裁剪结果。[研究] 第二次新增运行时 keyword 或修改裁剪规则时，先用目标平台／后端的严格匹配测试构建检查必需反馈是否使用正确变体，修正入包范围，再补采实际 PSO；扩大预热不能补回已裁掉的代码。严格匹配无报错只覆盖本次执行到的组合，不证明所有运行时路径、画质档和图形状态齐全，也不能代替冷缓存首发测量。
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

[研究] 54.1 ms 为作者 trace，Unity 实验 API 尚无目标补丁兼容验证；不据此建立性能排名。

## 菜单补研：跨暂停、改键与设备切换保住控制

核实：2026-10-14 UTC。主线 2／3；将 04 的菜单“关键页可达”深化为切换后可控、反馈可信，并限定 02 逻辑动作注入的证明范围；依据为官方文档和发行游戏更新。[一手／研究]

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

#### 输入交接补比：消费按下不等于等待松键

核实：2026-10-14 UTC。主线 3；收窄 04“恢复游戏不能沿用残留移动”的建议，区分旧缓存与设备当前仍按住的意图。新证据为 Celeste64 暂停／菜单调用链、固定 Foster 依赖实现及 Unity 初始状态检查契约；仅静态核查。[研究]

- [一手] 沿用 `EXOK/Celeste64@6edfe1ebd2a21a6134d7675a28e357891025407e`：[Controls.cs](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Data/Controls.cs#L23-L45)为 Jump／Dash 配置 0.1 秒缓冲；`Consume` 消费 Jump、Dash、Climb、Confirm、Cancel、Pause 的按下，不涉及 Move／Camera。[World.SetPaused](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Scenes/World.cs#L416-L435)在暂停和恢复两方向调用它；[Menu](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Helpers/Menu.cs#L248-L254)在确认成功后也消费。[ControlsConfig](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Data/ControlsConfig.cs)中 C 同时绑定确认与跳跃，X 同时绑定取消与冲刺，因此 UI 与玩法共键是具体交接风险。0.1 秒是案例配置，不是推荐窗口。
- [一手] [csproj](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Celeste64.csproj)固定 FosterFramework 0.4.2；官方 [v0.4.2 tag](https://api.github.com/repos/FosterFramework/Foster/git/refs/tags/v0.4.2)指向 `a5b574f36e5d8928a4d47566c7b924140b653c85`。[VirtualAction.cs](https://github.com/FosterFramework/Foster/blob/a5b574f36e5d8928a4d47566c7b924140b653c85/Framework/Input/Virtual/VirtualAction.cs#L84-L162)的 Update 分别读取 Pressed、Released、Down、Value，未消费且在窗口内的按下继续有效；ConsumePress 只在 Pressed 时清 Pressed、置 PressConsumed，不清 Down／Value。Clear 虽会清值，下次 Update 仍重新读取设备；两者都不是等待物理松键的门禁。`RepeatInterval > 0` 时后续重复逻辑仍可生成 Pressed，新物理按下也会重新接受，因此不能把一次消费当成所有未来事件的屏障。
- [一手] Unity 1.19 [wantsInitialStateCheck](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/api/UnityEngine.InputSystem.InputAction.html#UnityEngine_InputSystem_InputAction_wantsInitialStateCheck)规定 Value action 重新启用后的下一输入更新检查已操作控件，没有新的状态变化也可触发；Button／PassThrough 可显式启用同类行为。[研究] 不把切换 action map 等同于“旧业务缓冲已清理”或“恢复前必然重新按键”。

**采用与反例。** [研究] ✅ 在已有 UI／玩法交接处使不再属于当前上下文的离散指令失效，并取消不应延续的执行状态；持续值按动作政策重新读取，确需回中／松键才恢复的动作另设该条件。⛔ 不在每次动画／角色状态改变时清全部缓冲，否则落地前短按、连招衔接会受损。Celeste64 的 [Player](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L1149-L1165)以 Climb.Down／Jump.Down 接收持续意图，而跳跃启动消费按下；这反对一律强制松键，不证明所有项目都该立即恢复移动。只借机制，沿用其 Source MIT／例外、Content 不放开商用的许可边界；Foster 固定 [LICENSE](https://github.com/FosterFramework/Foster/blob/a5b574f36e5d8928a4d47566c7b924140b653c85/LICENSE)为 MIT。

**第二次修改验收。** [研究] 给暂停菜单增加确认弹窗，并将确认与跳跃设为同键：返回不能多跳一次；暂停期间松开移动后不能沿用旧方向，仍按住时按约定恢复；原有落地前缓冲仍有效。若配置了按住重复，另查恢复后重复事件是否被允许。AI 可追踪输入归属、缓冲消费与动作启动，人决定恢复手感。

**跨玩法补比（2026-10-14）：哪些条件会改变上述建议。** [研究] Celeste64 是 3D 平台动作游戏；与 Celeste 并列不构成射击、策略、回合或菜单密集玩法的覆盖。其源码支持按下与持续值分层、共键交接的具体实现，不支持“恢复必须立即移动／必须等松键”或某种手感最优。以下只选会改变 04 默认做法的三种情境，不按游戏类型名字推导实现。

1. **战术暂停仍允许下令。** [一手] 固定 `Anuken/Mindustry@17012d61d9e4c3cbd9820d87e81c24495486ac53`，作者 [README](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/README.md)称其为自动化塔防 RTS。[Control.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/core/Control.java#L707-L712)在暂停中仍调用 input.update；[DesktopInput.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/input/DesktopInput.java#L276-L315)允许暂停时平移相机，438–439 行才用未暂停条件限制角色运动。[InputHandler.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/input/InputHandler.java#L1174-L1208)提交移动／攻击指令，330–355 行的处理函数写目标或命令队列，不因暂停而拒绝；[Logic.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/core/Logic.java#L519-L544)另行阻断模拟。[研究] 因而暂停不等于整张 gameplay map 无效；选择、相机、下令可以保留，角色直接控制另定权限。第二次增加暂停中排队指令时，检查恢复后顺序与次数，不把队列当旧按键缓存删除。

2. **本地菜单不等于全局暂停，hold 也不等于 toggle。** [一手] 同一固定 Mindustry 的 [BaseDialog.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/ui/dialogs/BaseDialog.java#L27-L38)只在非联网时由弹窗改变暂停状态；[Control.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/core/Control.java#L746-L753)联网时仍可显示菜单，但不由该入口冻结世界。这不能推成联网绝无其他全局暂停机制。[DesktopInput.java](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/input/DesktopInput.java#L300-L310)按 commandmodehold 设置在 keyDown 与 keyTap 翻转模式之间选择，不满足交互资格时清 commandMode。[研究] 菜单只接管本地输入的玩法不能无条件设置全局 Paused；同一个逻辑动作也可能选择按住或切换。恢复时分别决定设备当前值、模式状态、蓄力执行状态和已提交命令的命运，不能用“连续／离散”二分替代全部规则；该例也不能决定其他游戏蓄力该保留还是取消。

3. **回合制的持续输入会提交下一步。** [一手] 固定 `00-Evan/shattered-pixel-dungeon@57a4e06a4caf162446d1c28caa7983f0493fecf0`（提交标明 v4.0.2）：[Hero.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/hero/Hero.java#L868-L930)在无当前动作且非休息时进入 ready 并返回 false；[Actor.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Actor.java#L300-L324)据此停止连续处理并等待。[CellSelector.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/scenes/CellSelector.java#L355-L418)在界面阻断时跳过持续输入更新，英雄 ready 后才将方向转换为相邻格命令并调用 next；[GameScene.show](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/scenes/GameScene.java#L1434-L1454)先调用 cancel，1716–1726 行清当前动作、休息及键盘 held 记录。**反证：** CellSelector 的 resetKeyHold（482–484 行）只清 heldAction1／2／3，未清 leftStickAction，不能说它给所有设备实现了等松键门禁。[研究] 验收重点增加关闭窗口是否多走一步／多耗回合、目标选择取消是否误提交，以及键盘与摇杆差异；不能把这一命令节奏等同于平台跳跃的短期缓冲窗口。

**采用边界。** [研究] 保留“先更新权限，再触发可能同步取消的输入切换”机制；收窄为按上下文停用动作，不要求所有游戏都有暂停或恢复同一种动作。Mindustry [LICENSE](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/LICENSE)与 Shattered Pixel Dungeon [LICENSE.txt](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/LICENSE.txt)均为 GPL-3.0 许可文本；本次只借鉴机制并链接，不复制实现为商用引擎组件。仅据固定源码借机制，不主张移植可靠性。

### 4. 用第二个菜单判断共享层是否值得

[研究] 在将来获准的真实切片，先用原生做暂停→设置→返回，再新增带滑条、动态隐藏选项和确认弹窗的页面。改一个确认绑定并切换设备，检查四个结果：可见焦点与导航方向一致；提示对应实际可用绑定；关闭弹窗恢复原项或明确后备项；恢复玩法不沿用失效的移动缓存、没有幽灵攻击或重复确认，并按约定处理当前仍按住的移动。让重绑定取消也走完整返回路径。

[研究] 记录新增页面需复制或修改哪些政策，以及旧页面是否回归；先用少量共享的打开／关闭边界，只有重复的激活、返回和设备规则实际难维护才引入框架。原生已经达到目标则不迁移，框架仍需每页补同样规则且无明显减负则收回扩展。AI 可以生成绑定、导航与回归场景，人判断焦点是否容易找到、操作是否费力；输入事件日志和截图须互相印证，状态注入不能替代设备路径。这是未来验证设计，非已证实的框架收益。

### 5. 暂停叠加与转场：关闭一层不等于恢复整局

核实：2026-10-14 UTC。主线 3；改变 04 的菜单恢复建议：第二种暂停来源出现后，补持有／释放与加载入口权限，避免把任意关闭动作当全局恢复。新证据为 Thrive 三个已合入补丁及固定实现；仅静态阅读，不是本轮游戏／引擎实测。[研究]

- **暂停状态与清理**：[一手] [#7203 补丁](https://github.com/Revolutionary-Games/Thrive/commit/0deed4285e3d25852707d7bbf639620293c9e1ba)（2026-09-02）将 HUD 的 `Paused = !Paused` 改成传入的 `buttonState`，并在关闭区域灭绝选择框时调用 `EnsureGameIsUnpausedForEditor`，意图避免 HUD 暂停跨到新区域。[PR 原文](https://github.com/Revolutionary-Games/Thrive/pull/7203)明确作者未能触发所报告故障；这是已合入防护，不应写成已复现、已验证消除软锁。未读取其 Discord 报告，也不采用自动生成的 PR 摘要代替作者原文。
- **不同入口需服从同一阶段**：[一手] [#7290 补丁](https://github.com/Revolutionary-Games/Thrive/commit/1b82f43ac822cf8b149831b1389a0c3686bc498a)（2026-09-17）给 HUD 暂停按钮补 `GameLoading` 判断，原来只检查暂停菜单是否可见。[PR](https://github.com/Revolutionary-Games/Thrive/pull/7290)勾选作者试玩及另一人功能确认；可称维护方确认，不能称本轮验证。
- **撤回一刀切暂停**：[一手] [#7232 补丁](https://github.com/Revolutionary-Games/Thrive/commit/03b9b8e2b7bbc3a6ecb3159dd38960d69be33d6b)（2026-09-10）在转场发现玩家死亡／消失时补取消入口，并删除取消时无条件重启编辑按钮的代码。[PR 原文](https://github.com/Revolutionary-Games/Thrive/pull/7232)说明此前的修复反而允许死亡后立即点击；按钮应由真实资格条件恢复。开发者最终撤回“转场时暂停游戏”的尝试。[研究] 因而采用取消收尾与资格重判，不推导所有转场都应冻结世界，也不把取消后的所有控件一律启用。

**固定实现与反证。** 以下均实际读取 `Revolutionary-Games/Thrive@1b82f43ac822cf8b149831b1389a0c3686bc498a`：[一手]

1. [PauseManager.cs](https://github.com/Revolutionary-Games/Thrive/blob/1b82f43ac822cf8b149831b1389a0c3686bc498a/src/engine/PauseManager.cs)以 `HashSet<string>` 保存命名暂停原因，`Resume` 仅移除指定原因，集合非空仍暂停。**这不是计数锁**：重复添加同名只报错，不累计；一次释放会移除这个名字，多实例／重入不能仅靠类型名区分。`ForceClear` 注释限定主菜单或直接切换另一局的兜底，并记录剩余锁；不能照搬为普通弹窗关闭动作。
2. [HUDWithPausing.cs](https://github.com/Revolutionary-Games/Thrive/blob/1b82f43ac822cf8b149831b1389a0c3686bc498a/src/general/base_stage/HUDWithPausing.cs)的 `EnsureGameIsUnpausedForEditor` 经 `PauseButtonPressed` 释放自己；但菜单可见或 `GameLoading` 时该入口提前返回。因此不能宣称 helper 在任意转场都能撤销 HUD 锁，也不能用方法名证明清理完成。后置日志只报告仍暂停，不会自动解决残留。
3. [PauseMenu.cs](https://github.com/Revolutionary-Games/Thrive/blob/1b82f43ac822cf8b149831b1389a0c3686bc498a/src/general/PauseMenu.cs)在 `ReportStageTransition` 将 `GameState` 设为 Invalid，以此表达 `GameLoading`；暂停菜单、鼠标捕获阻止和输入接收注册分别维护。[CreatureStageHUDBase.cs](https://github.com/Revolutionary-Games/Thrive/blob/1b82f43ac822cf8b149831b1389a0c3686bc498a/src/general/base_stage/CreatureStageHUDBase.cs)的取消入口淡入并清 `MovingToEditor`，不再直接恢复编辑按钮。[研究] 这些具体分工支持把暂停、交互归属和过渡资格分开检查，不证明已有实现覆盖所有交错。

**采用／不用。** [研究] ✅ 在已有 Session／菜单边界明确谁持有暂停、何时可释放、各输入入口何时拒绝新暂停；按钮传目标状态时按目标设置。仅有一个暂停入口且行为可靠时不增加锁系统。出现并存来源时，使用能区分实际持有者的窄机制；退出本局清本局持有，普通弹窗不能清所有原因。⛔ 不照搬字符串集合为通用计数／多实例方案，不把上层输入门禁当无条件释放入口，不用全局暂停掩盖转场前提失效。

[一手／研究] Unity [6.3 timeScale](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-timeScale.html)只约定时间缩放、后续帧生效及零值暂停 FixedUpdate／WaitForSeconds；它不是暂停持有或输入权限管理器。本节机制不依赖双引擎同名 API，不另扩引擎框架比较。Thrive 的[固定许可](https://github.com/Revolutionary-Games/Thrive/blob/1b82f43ac822cf8b149831b1389a0c3686bc498a/LICENSE.txt)为 GPL-3.0-or-later 并列有例外条款；这里只借机制，不把整套代码推荐为可随意复制的商用引擎组件。

**第二次修改与验证局限。** [研究] 从单暂停菜单增加一个可在暂停中操作的选择框：交错开关两者、加载期间按 HUD 暂停、淡出期间死亡，再进入新局。检查当前有效暂停原因、输入归属、按钮资格和旧局持有；特别覆盖释放时命中菜单可见／Loading 门禁，以及同名多实例。AI 可补状态日志与回归路径，人决定转场是否仍模拟及何时恢复控制。源码可见和维护方复核不能代替这些路径的实测。

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


### 5. 续玩不等于撤销失败

核实：2026-10-15（UTC+8）。[研究] 可靠落盘与损坏恢复已有上述方案；这里仅补“玩家还活着却需要离开”的产品选择，不重复05死亡重试或难度辅助。✅ 单局需要跨多次游玩时，先复用既有一致状态边界提供续玩；是否允许撤销早先决定另定，不默认引入任意世界快照。

- **发布后补续玩，Enter the Gungeon。** [一手：Dodge Roll 设计师 Dave Crooks] [2017-02-03 更新说明](https://blog.playstation.com/2017/02/03/enter-the-gungeon-supply-drop-update-out-today-on-ps4/)称 Save and Quit 可能是发布后最常被请求的功能，新增每层结束后保存、日后继续。作者用了出口按钮角色与冷冻室，也说明可以用菜单实现。[研究] 借已有转换边界，不复制其美术入口；作者反馈不等于需求排名调查，也不证明层间间隔适合所有玩法。
- **保留后果仍可退出保存，Don't Starve。** [一手：Klei 官方产品说明] [Why Can't I Save?（2019-06-25）](https://support.klei.com/hc/en-us/articles/360029882191-Why-Can-t-I-Save)说明黎明、黄昏和关闭游戏时自动保存，同时刻意不提供手动保存的安全网。[研究] 反证“保留决定后果就不能中途离开”；这段说明不证明崩溃／断电恢复或任意时刻完整快照。
- **续玩与回退分别维护，Cogmind。** [一手：Kyzrati 作者复盘] [Quicksaving and Restore Points（2019-09-27）](https://www.gridsagegames.com/blog/2019/09/quicksaving-restore-points/)说明原本已有退出后续玩；后来为 Adventurer／Explorer 加早先恢复点，Rogue 保留永久死亡设计。恢复点与最新续玩档分开、仅对当前局有效；调试存取虽已存在，公开功能仍需死亡界面等配套。2022-03-23 作者评论认为部分玩家因此受益，不是受控结果。[研究] 借职责分离，不照搬四类文件或各模式政策；原文对榜单排除用不确定措辞，不据此确认当前计分规则。

[研究] **直接复用与需补部分：**沿上述 DTO、现成序列化／存储、备份／迁移，以及05的 Session／Encounter 与一次性结算，只补允许保存的状态边界、退出提示和恢复入口。明确快照在奖励提交之前还是之后、当前局与永久进度各恢复什么；正常续玩交接成功前不删唯一有效副本；死亡／新开局后的恢复资格按玩法失效，保留诊断文件不等于允许复活。只有另需回退玩法才补早先恢复点；正常续玩与故障备份也不混为一个入口。

[一手] Unity 6.3 [OnApplicationQuit](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnApplicationQuit.html)列出平台限制，例如 iOS 挂起不调用该回调。[研究] 因而不要把产品上的“退出可续玩”实现成只在退出通知中启动保存；沿用项目与平台的既有保存机会和完成反馈，UE 也不能仅凭已有 SaveGame 就假定进程结束前一定写完。本轮未新增 UE 退出 API 推荐，通用政策只维护一份。

[研究] **成本与撤回：**边界间隔变长仍会迫使玩家等待；任意帧快照则可能增加弹体、计时器与执行中动作的恢复负担。先按玩法缩短可保存段落或明确回到段首，不把“层间保存”当普适参数。短时计分挑战若无跨次游玩需求，可不加中段存取。二改延长一个遭遇后，预注册奖励前后退出、保存失败、重入、重复读取与新开局检查；核返回状态、重复发奖和被迫等待的时间；约定永久死亡的模式还须检查死亡后退出重进，不能从续玩档／故障备份复活，不把这条限制套给允许恢复的模式。不以保存次数证明体验更好。以上仅公开文字调查，未运行引擎／游戏或玩家实验；不复制商业代码与资产，不声称零美术、任意帧可靠恢复或留存收益。

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

[研究] GitHub commits API 遭遇公开 rate limit，固定 raw 源码已读；未运行 PresentMon 或复现案例收益。

## 本地化补研：新语言与旧名字一起维护

核实：2026-10-14 UTC。主线 3／4；补 04 稳定 key、fallback 与长文之外的内容更新风险：字体覆盖、旧名字及样例文案再次失效。[研究]

### 1. 发行游戏的修复指向旧内容与资源寿命

[一手] [Celeste 官方更新记录](https://www.celestegame.com/changelog.html)的 1.3.0 增加韩语、调整日语本地化与命名界面，并改为仅加载正在使用的语言字体；玩家名含当前语言不能显示的字符时，改用 Madeline 代替空白。1.3.1 仍修复意大利语 Journal 换行。这些是作者报告的已发行修改，不是本轮复现或内存收益测量。

[研究] **✅ 新语言同时检查旧存档名字、语言选择页和旧界面；不只抽查新增译文。** 采用跨语言字体、限制命名字符或明确替代显示，需要游戏自行选择。不能把 Celeste 的角色名替代政策推广到玩家身份、排行榜或聊天，也不能从按语言加载推断应立即释放全部其他字体：混合文字仍可能需要它们。未来第二次修改加入旧字符集没有的名字，再切换语言读取旧名字；成功条件是内容可理解且资源寿命符合预算，不是 JSON 解析成功。

### 2. 官方输入样例可借机制，未交付完整本地化

[一手] 沿用本记录固定的 `Unity-Technologies/InputSystem@05e45ddbaf18a93245b068d787d74b738b90d01c`，本轮通过 GitHub 文件接口读取 [RebindActionUI.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/RebindingUI/RebindActionUI.cs) 与 [GamepadIconsExample.cs](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/RebindingUI/GamepadIconsExample.cs)。版本和 Unity Companion License 边界沿用前文，不把该提交当已锁定发布包或跨引擎宽松许可。

- `UpdateBindingDisplay` 按 binding ID 查找并调用 `GetBindingDisplayString`，再向显示事件传递文字、device layout 和 control path；`OnActionChange` 响应 `BoundControlsChanged`，包括键盘布局导致的重解析
- 文件仍有 localization TODO；`UpdateActionLabel` 直接显示 `action.name`，重绑定等待、复合绑定部件提示和取消倒计时使用硬编码英文及字符串插值
- 图标样例按 DualShock／Gamepad layout 和 control path 选图，找不到图时回文字；但空 layout/path 分支直接返回，不能从样例推断旧图标一定被清除。它是有限设备演示，不是全部控制器的显示政策

[研究] **✅ 改造样例的绑定刷新机制，把动作展示名、等待、取消和倒计时接已有 String Table／Smart String；⛔ 整包照搬成发布菜单。** 内部 action 名不必因翻译改身份；倒计时按语言处理复数，教程提示复用实际动作绑定。这里不新建本地化／图标框架，也不要求为少数文案引入第三方 UI。现有菜单节已规定的改键、设备切换和重开路径顺带检查这些提示即可。

### 3. 字体优化随内容更新，不把 ATG 当无成本开关

[一手] Unity 6.3 [ATG 启用说明](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/enable-and-use-atg.html)属于 **UI Toolkit**，默认未启用，需项目设置及元素的文本生成器配置；不支持静态 font asset。它不能作为现有 uGUI／TMP 自动获得同样能力的依据。[静态字体迁移说明](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/migrate-static-font-assets.html)区分两项目标：字体内容减小用子集字体创建动态资产；控制首次字形生成用动态资产预填充所选字符的 atlas。文档也说明采用 SDFAA 时很多项目不再需要预填充，不能无测量地要求所有语言预热。

[研究] **🧪 目标语言确需复杂排版且项目采用 UI Toolkit 时，评估锁定版本 ATG；已稳定的 uGUI 不因此搬迁。** 若使用子集或预填充，批准文本新增／翻译修改后更新覆盖输入，纳入格式化数字、必要符号和允许的用户文字；不能只取第一版译文做永久字库。动态资产能生成其源字体含有的字形，不能恢复源字体已裁掉的字符。区分冷启动首次显示与语言切换后驻留，收益不成立就撤回优化，保留完整合适字体。

[一手] Unity [font subsetting 文档](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-font-subsetting.html)推荐现成 FontTools，并提醒保留所需 OpenType 布局特性；[FontTools subset 正文](https://fonttools.readthedocs.io/en/stable/subset/)说明 `--ignore-missing-unicodes` 为默认值，`--text`／`--text-file` 间接指定但源字体缺少的字符也可不报错，`--no-ignore-missing-unicodes` 才要求失败。**[研究] 工具退出成功不是覆盖证明。** 按各字体职责核对缺失字符及承接字体；对该字体必须支持的集合使用严格检查，不把计划由另一字体承接的字符误判为整个管线失败。优先现成工具，不写自己的字形裁剪器。实际字体的修改、嵌入和分发权仍需单独核对，本轮未推荐具体字体文件或执行裁剪。

[一手] UE [Asset Localization](https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-localization-in-unreal-engine)只提供必要差异：运行时换 culture 或显示不受限用户文字时，推荐 composite font；按 culture 替换整个字体资产只适合更受限项目，已加载本地化资产切换可能需要重启。[研究] 这不是要求全部字体常驻，也不必为 Unity 的 ATG 逐项造对称替代方案。

### 4. 保留与否及证据边界

[研究] 正文保留“新语言／名字连带旧内容和字库更新”，并补下节旧报告的消息表示与重译责任；不另写字体百科、翻译后台或通用 UI 框架。AI 可查硬编码与占位符、准备覆盖报告和回归画面，人决定名字政策并判断实际尺寸下的可读性。目标设备的字形、排版、输入提示与内存／首次显示表现仍待授权实测。

[研究] 本轮不采用两条容易误写的材料：Factorio 简繁字体误选只取得搜索线索、论坛正文未成功读取，不列为一手结论；Unity 6.0 旧翻译页中的 ATG 富文本限制不能直接套到 6.3 新英文页，也不据限制项删除推断所有组合已可靠。

### 5. 旧报告重译：保留消息含义，而非只存渲染结果

核实：2026-10-14 UTC；主线三／四。现有字体与名字政策不解决旧任务／系统报告已经被存成某种语言的问题。✅ 对承诺随语言更新的系统消息，保留稳定身份、参数类型及历史值；实时值另从当前状态取得。原样保留的玩家文字、引用及历史记录不套此政策。[研究]

**固定游戏路径。** 沿用已核 `Revolutionary-Games/Thrive@eceb8011d5e86b19dfa75de9e55eee6815fd1450`；[维护文档](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/doc/working_with_translations.md)解释延迟翻译以及读档后重译 auto-evo 报告的意图。实际读取以下源码，而非只凭文档断言功能已通过：[一手]

- [LocalizedString.cs L57–77、160–183](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/engine/LocalizedString.cs#L57-L77)：archive 写读 translationKey 与对象参数数组；ToString 才查译文并按 culture 格式化，捕获 FormatException 后返回译文模板。这避免某类异常，**不保证缺参时仍是可理解的完整句子**。
- [EditorBase.cs L793–827](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/general/base_stage/EditorBase.cs#L793-L827)：autoEvoExternal 以 LocalizedStringBuilder 写读。[报告组件 L356–365](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/microbe_stage/editor/MicrobeEditorReportComponent.cs#L356-L365)在 OnTranslationsChanged 重发报告；[MicrobeEditor L568–575](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/microbe_stage/editor/MicrobeEditor.cs#L568-L575)将保存的 builder 转为当前显示文字，并提供按需生成正文的委托。这里只闭合该路径，不声称每个已打开弹窗都刷新。
- **反证／复用边界**：[LocalizedStringBuilder.cs L63–108、128–158](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/engine/LocalizedStringBuilder.cs#L63-L108)的 Append 先写 StringBuilder，FormatString getter 才归并缓冲；WriteToArchive 直接写 formatString 字段。因此“追加后尚未 ToString 就保存”不能凭可序列化接口宣称完整，需核调用顺序。但 [MicrobeEditor.OnEditorReady L397–403](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/microbe_stage/editor/MicrobeEditor.cs#L397-L403)已有报告显示调用，而 [EditorBase L293–299](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/general/base_stage/EditorBase.cs#L293-L299)把自动保存放在进入编辑器完成之后；不能由类级条件风险推出正常报告存档已丢内容。旧字符串转换也只保留原格式串，不能恢复丢掉的消息身份。[研究：静态推导，未运行]

**引擎合同与采用边界。** Unity 与 UE 均有原生机制，不复制 Thrive 的 GPL 组件；许可沿用本记录此前核查。[研究]

- [Unity Localization 1.5.13 Arguments](https://docs.unity3d.com/Packages/com.unity.localization@1.5/api/UnityEngine.Localization.LocalizedString.Arguments.html)明确参数列表不序列化，可用局部持久变量，或从自己的已保存数据重建。[Persistent Variables](https://docs.unity3d.com/Packages/com.unity.localization@1.5/manual/Smart/Persistent-Variables-Source.html)以 IVariableValueChanged 通知引用者；普通 Arguments 内部值变化可用 [RefreshString](https://docs.unity3d.com/Packages/com.unity.localization@1.5/api/UnityEngine.Localization.LocalizedString.RefreshString.html)，加载仍进行时会返回 false。不要把“持久变量”名称当成项目存档已接通，也不要把一次刷新调用当成最终显示已更新。[一手／研究]
- [UE 5.8 Text Localization](https://dev.epicgames.com/documentation/en-us/unreal-engine/text-localization-in-unreal-engine)的 FTextHistory 支持 culture-correct rebuilding；转 FString 通常丢失 history。确需交给只接受字符串的底层接口时可转换，但上层仍需保留来源并管理刷新。数字保留数值类型，由本地化格式处理复数；对象名的性别／词形不一定能靠插入一个已翻译名词解决。[一手] 这不意味着 FText 自动追踪任意业务变量；参数改变仍要更新对应格式化结果。[研究]

**第二次修改的验收选择。** [研究] 在已有任务／报告中改一次参数结构并新增目标语言：历史数量保持当时含义，实时进度反映当前值；对目标语言实际使用的复数类别准备数值样本，而非只测英语 1／2。比较消息产生后立即保存与先显示后保存，再读档切语言；缺 key、缺参和旧格式要显示明确后备结果。只剩旧译文的记录应保留原文或走已定义迁移，不做字符串逆向猜 key。画面仍按实际尺寸检查换行、字形与操作路径，不以格式化成功代替可读性。

本轮是固定源码／官方正文静态核查，无引擎运行、存档往返或语言审校实测；案例支持表示与更新责任的选择，不证明所有系统消息都应永久保存或引入新框架。[研究]

### 6. 新增语言的显示、编辑和布局不能互相代验

核实：2026-10-15 UTC+8；主线三／四。新增证据为 Unity 6.3 的方向／光标契约、UE 当前 5.8 文档、RTLTMPro 固定源码及历史二改反馈、Mindustry 历史输入报告与另一作者的 poRTL 字幕实现。改变的选择是：已有原生塑形先用原生，现有 TMP 只为具体缺口试现成组件；动态混排不能靠静态倒序与单张截图验收。不重做前述字库优化、消息保存或菜单输入路由。[研究]

**原生能力不等于开一个 RTL 开关。** [一手] Unity 6.3 [language-direction](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/language-direction.html)明确 RTL 属性仅提供基础反转；完整断行、换行与塑形需要 [ATG](https://docs.unity3d.com/6000.3/Documentation/Manual/UIE-advanced-text-generator.html)，后者采用 HarfBuzz、ICU 和 FreeType。启用及静态字体迁移条件沿用本节第 3 小节；不把 UI Toolkit 能力扩写成 uGUI／TMP 能力。[光标契约](https://docs.unity3d.com/6000.3/Documentation/Manual/ui-systems/cursor-movement.html)采用 logical movement：英阿混排时按段方向走，跨段可能跳到另一视觉位置。这与 visual movement 是不同政策，不应单凭跳转判错；编辑后实际删改了哪个逻辑字符仍须验证。

[一手] UE [UMG Rich Text Block](https://dev.epicgames.com/documentation/en-us/unreal-engine/umg-rich-text-blocks-in-unreal-engine)当前显示 5.8，分别提供 shaping、text flow、Force Direction Preference 和 navigation；[ETextShapingMethod](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/SlateCore/ETextShapingMethod?lang=en-US)列 Auto／KerningOnly／FullShaping，FullShaping 用于复杂 RTL／双向字形。采用原生完整塑形与布局方向，不为普通本地化先加外部渲染器；字体资产的文化切换与任意用户文字边界仍按第 3 小节的 composite font 建议。文档没有保证自定义控件和显式导航会随方向全部正确；地图方向、玩法箭头不能仅因语言改变就一概镜像。[研究]

**已有 TMP 的窄候选与反证。** [一手] 本次静读 `pnarimani/RTLTMPro@f480419bbbffed1be3c129d68cc0182afcfbcac3`（提交日期 2026-04-29）：

- [README](https://github.com/pnarimani/RTLTMPro/blob/f480419bbbffed1be3c129d68cc0182afcfbcac3/README.md)声明 Arabic／Farsi／Hebrew、输入框和富文本支持，并要求字体含相应字符；同时说明 ForceFix 用于强制处理以英文开头的文本，却会影响多行英文。不能只引用功能列表，漏掉同页限定。
- [RTLTextMeshPro.cs](https://github.com/pnarimani/RTLTMPro/blob/f480419bbbffed1be3c129d68cc0182afcfbcac3/Assets/RTLTMPro/Scripts/Runtime/RTLTextMeshPro.cs#L106-L131)保留 originalText，按 ForceFix／IsRTLInput 选择原文或处理结果；处理路径调用 FixRTL、Reverse，再赋给 TMP。这里是已有渲染器上的适配组件，不是覆盖任意语言与布局的通用排版引擎；并未运行它的输入框或测试套件。
- [#70 原帖](https://github.com/pnarimani/RTLTMPro/issues/70)中，2021-06-01 使用者先报告 fork 可用，06-23 缩放文本区域后又报告混合文本换行问题；维护者解释当时插件缺少 TMP 内部自动断行位置。**这是历史“首次成功→布局修改后失败”链，不是当前固定提交仍有同一缺陷的证明。** 当前 README 的多行支持声明与历史混排限制不能互相抹掉，后续须测所用版本与实际内容。[一手／研究]

[研究] 🧪 仅对已有 TMP 且确有目标语言缺口的页面试 RTLTMPro，先核字符串绑定是否写入正确组件、富文本／数字政策和动态布局；🧪 已采用 UI Toolkit 的项目先比较 ATG。两者均不值得仅为宣传的语言数量迁移整套菜单。RTLTMPro 固定 [MIT 许可](https://github.com/pnarimani/RTLTMPro/blob/f480419bbbffed1be3c129d68cc0182afcfbcac3/LICENSE)允许带通知复用软件；实际字体、演示资源及所接 TMP 版本另核，不把仓库许可当字体商用证明。README 指向另一维护者的 UPM 分支，本次没有验证其与固定源码的版本等价，接入时须锁定实际包。

**不同作者的游戏反例只支持具体机制。**

- [社区：原报告] Mindustry [#2248](https://github.com/Anuken/Mindustry/issues/2248)记录 Linux build 104 将 back 替换为波斯文字后按钮无文字；[#1943](https://github.com/Anuken/Mindustry/issues/1943)记录 Steam/release 104.10 韩文输入组合末字不可见。它们分别提示显示与输入组合的不同失败，不证明当前 Mindustry 仍坏，也不把报告中的原因猜测写成已确认根因。字体存在或菜单译文正常不能代验玩家实际输入。[研究]
- [一手：作者说明／源码] `sigmagamma/portl@8a9cc38eee4eec3bc763bf101cc5c444d5060db1`（提交日期 2026-09-04）的 [README](https://github.com/sigmagamma/portl/blob/8a9cc38eee4eec3bc763bf101cc5c444d5060db1/README.md)描述 Portal 等 Source 游戏的粉丝翻译；Portal 1 右对齐路径限定 Windows 字体映射及已试的 1366×768，未测试其他尺寸。[text_tools.py](https://github.com/sigmagamma/portl/blob/8a9cc38eee4eec3bc763bf101cc5c444d5060db1/src/text_tools.py)调用 arabic_reshaper／bidi，并按配置字符数处理行。固定 [MIT](https://github.com/sigmagamma/portl/blob/8a9cc38eee4eec3bc763bf101cc5c444d5060db1/LICENSE)仅支持软件许可判断，不开放游戏资产；未安装补丁或复核实际字幕。这个受限旧游戏补救不能外推为新游戏的动态文字／可编辑输入框方案，更不推荐照搬其系统字体改动。[研究]

**后续只预注册，收窄到一个会失败的真实页面。** [研究] 在已有设置／名字输入页先用原生：目标语言句子混入拉丁玩家名、数字与富文本，再缩窄窗口和放大文字；观察塑形、换行、标点／省略号、选中删除及输入组合提交，最后按已承诺支持的输入方式进入、确认、返回；承诺手柄支持时才包含手柄路径。第二次修改将短标签变为带变量的长说明，检查实际焦点与点击目标，不以缩小到不可读的字号换取“不溢出”。UI Toolkit 的文字方向不代验整体控件布局；UE 方向偏好也不代验显式导航。

[研究] AI 可查配置、准备文本与控件回归，人或目标语言读者判断真实字号下是否可读、编辑是否可理解。原生已满足就停止加库；现成适配仍需大量逐字符串／逐宽度补丁，或关键页面不可读／不可操作，则暂缓该语言而非自建排版框架。保留原始逻辑文字及未改组件以便撤回；不把已塑形、已倒序的显示结果反写到翻译表／玩家名字。以上是静读后的采用条件，无新引擎、母语用户或目标设备实验。

### 7. 完整长文可达性与字体默认值的撤回

核实：2026-10-15 UTC；主线三／四。改变建议：从字库覆盖、伸缩布局与菜单可导航，补到实际字体／字号与已承诺输入方式下能读完决策信息；已有布局可靠才优先保留，字体替换可以撤回默认。以下是公开发布说明、作者机制说明与固定资源静读，不是阅读质量或设备实测。[研究]

**不同作者的机制与反例。**

- [一手] Stardew Valley [1.6.6 官方说明](https://www.stardewvalley.net/stardew-valley-1-6-6-full-patch-notes/)分别记录中文文本回到 1.6.3、默认字体恢复原字体、1.6.4 的 smooth font 留作选项、中文对话增加字号滑条，并保留俄文旧字体选项。它支持撤回新默认、不必撤回语言；不能据此把翻译回退归因于字体，或断言旧字体适合所有玩家。[研究] [官方论坛原帖 #24／#25](https://forums.stardewvalley.net/threads/simplified-chinese-typo-display-text-errors.20921/page-2)区分字体外观与整段阅读的拥挤感，只是具体玩家反馈，不是总体偏好或正式实验。[社区]
- [一手] Stardew Valley [1.6 官方更新记录](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/)把动物商店中被 tooltip 遮住的价格也放入 tooltip，并改进 perfection tracker 按屏幕大小分页、修复高级建档选项 tooltip 超出屏幕及 resize 时背包／制作菜单错位。这些具体修复说明信息是否可读、可用于决定，不能由字形存在或面板尺寸单独代验。[研究]
- [一手] Factorio [FFF370](https://www.factorio.com/blog/post/fff-370)为避免重做数百个仍在变化的 GUI，主要沿用布局，以控件及父级的边界／位置等推导手柄导航，并为高频快速栏新增 Quick panel；自定义控件仍需处理。它支持保留可靠布局、局部补交互的选择，不要求其他游戏重写几何导航。[研究] [2.0.44 官方说明](https://forums.factorio.com/viewtopic.php?t=128050)只给固定在屏幕右侧的过高 tooltip 增加滚动，默认 Shift＋滚轮；不证明所有 tooltip 或手柄路径可读。官方 [Controls 表](https://wiki.factorio.com/Controls)的 scroll-tooltip-up/down 控制器默认值为 Not set，但上下滚轮文字有疑似重复，本轮不据此判断当前游戏绝对无法手柄滚动。[一手／研究]
- [一手] Thrive 沿用固定提交 `eceb8011d5e86b19dfa75de9e55eee6815fd1450`：[style guide L668–679](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/doc/style_guide.md#L668-L679)要求复用 LabelSettings，并提醒按钮覆盖指向合适字体，包括中文 fallback。[Body-Bold-Normal.tres](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/src/gui_common/fonts/Body-Bold-Normal.tres)引用 Lato-Bold.ttf、字号 20；[导入资源](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/assets/fonts/Lato-Bold.ttf.import)再指向 NotoSans-Bold 变体并允许系统 fallback；[变体资源](https://github.com/Revolutionary-Games/Thrive/blob/eceb8011d5e86b19dfa75de9e55eee6815fd1450/assets/fonts/variants/NotoSans-Bold.tres)以 NotoSans-Variable 为 base，包含 Emoji、简繁中文、希伯来与泰文等 fallback，中文项实际为 Regular。因此不能说直接引用 ttf 必然缺 fallback，也不能凭 Bold 文件名推断所有文字同粗。[研究]

**采用与撤回。** [研究] ✅ 新页面及局部覆盖复用项目已有完整字体／样式资源链，不让第二页“修字号”复制出缺配置的字体。已有布局可靠时优先保留，短标签合理伸缩，长说明优先现有分页、滚动或详情入口；影响购买／技能选择的条件、数值、代价不能只藏在鼠标 hover 或省略号之后。🧪 完整段落确实更难读时撤回新字体默认，或在维护成本可接受时保留已验证的样式选项；不要求所有游戏新增字体选择器／独立字号滑条。回退仍不可读或不可操作时，上一节暂缓该语言发行的门槛不变。

**后续只预注册。** [研究] 在既有商店／技能详情页将短说明改为含混合名字和数值的长说明，采用目标语言实际 fallback、既有字号选项与最小支持窗口。逐一使用已承诺输入方式读到最后一项代价，确认对应项后返回；承诺支持手柄才验手柄，不新增双输入要求。仅直接调用回调、键鼠滚动或焦点单项通过都不代验完整路径。混排、选中删除、逻辑光标政策仍按上一节。AI 排查样式引用和准备路径，人或目标语言读者判断整段阅读与操作负担；只有真实路径失败才改行距／布局、回退默认或补分页／详情，不先重写整个导航和字体系统。

本轮未运行引擎、游戏、字体解析／渲染、手柄或 UI 自动化，未测性能、玩家收益及当前版本全设备行为。Godot 的 LabelSettings 不硬译为 Unity／UE API；可迁移的是配置复用与任务验证选择。字体各自授权仍需另核，本轮只总结公开机制、不复制或推荐发行这些字体文件。Factorio 控制器 mod guide 正文未能读取，不采用搜索摘要为主证。[研究]

## 音频并发补研：保住起音不等于保住每次提示

核实：2026-10-14 UTC。主线 3；Mindustry v154 及锁定 Arc／SoLoud 的静态源码表明，04 的并发上限须拆成入口合并、同组抢占与全局竞争；提高 priority 不保证提示进入播放。[一手／研究]

### 1. 真实游戏的历史改动与依赖链

[一手] [Mindustry v154 发布](https://github.com/Anuken/Mindustry/releases/tag/v154)（2025-12-16，Beta）同时提高 active sound cap 32→100、限制每类约 6 声，并重做多种声音素材，作者称意在避免一种声音淹没其余声音。这是历史生产改动，不是本日新功能；多项改动一起发布，不能把作者报告的改善全部归因于某个限额，更不能照抄数字为独立游戏标准。[研究]

[一手] 发布源码声明的依赖链（非发行二进制溯源）：Mindustry `d1e0307d3906bb350e80d8969a2464ed0b771ffb` 的 [gradle.properties](https://github.com/Anuken/Mindustry/blob/d1e0307d3906bb350e80d8969a2464ed0b771ffb/gradle.properties)锁 `archash=46c0956944`；Arc v154 为 `46c0956944af81db1145625e07108c196d94e260`，其 [build.gradle](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/build.gradle#L69-L72)设置 `SOLOUD_MAX_VOICE_COUNT=100`，[同文件 L144-L146](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/build.gradle#L144-L146)在本地依赖目录不存在时拉取 Anuken/soloud 的 `2025.12.01`，对应 `4b4266fed49b45afc191728b64adf1faca943f5b`。不使用当前 main 解释旧版行为。

### 2. 三道门控及不能省略的反例

- **入口重触发合并。** [Arc Sound.java L31-L85](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/src/arc/audio/Sound.java#L31-L85)在启用 checkFrame 时按同一 Sound 对象的默认 16ms 间隔拒绝新实例；较大音量请求可更新上一声的音量及 pan，然后返回 -1。注释说“同帧”，实际判断经过毫秒数；这不是按敌人、位置或危急程度判断是否同一事件。新声音甚至尚未进入底层优先级选择。[一手]
- **同组并发。** [Audio.java](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/src/arc/audio/Audio.java#L9-L15)默认值为 6，Sound 加载时应用；[SoLoud play](https://github.com/Anuken/soloud/blob/4b4266fed49b45afc191728b64adf1faca943f5b/src/core/soloud_core_basicops.cpp#L32-L67)为未显式指定组的 source 分配独立组，不能把默认值叫“按语义分组”。游戏另在 [SoundPriority.java L73-L109](https://github.com/Anuken/Mindustry/blob/d1e0307d3906bb350e80d8969a2464ed0b771ffb/core/src/mindustry/audio/SoundPriority.java#L73-L109)把部分火焰、导弹、arc／pulsar 变体共享组，降低修复／脚步优先级，并设通用最小可打断时间为 `min(0.25s, 声音长度一半)`，部分脚步更长。这里有真实内容取舍，不只有 API。[一手]
- **全局声部竞争。** [findFreeVoice_internal L309-L391](https://github.com/Anuken/soloud/blob/4b4266fed49b45afc191728b64adf1faca943f5b/src/core/soloud_core_getters.cpp#L309-L391)在全局候选中使用 priority、年龄与 protected 条件，但同组已满分支先找非 protected、达到最小播放时间的最老实例，找不到就拒绝；同组替换条件不比较 priority。源码中“no lower volume candidate”注释与实际分支不符，不据注释声称按音量淘汰。游戏配置的 priority 3 注释虽称绝不打断，实现只是设置数值，不等于底层 PROTECTED flag；同组及其他同／更高优先级路径仍须分别核对。[一手]

[研究] 因而，“保护起音”会减少连续重启导致的碎裂，也可能使后来的重要事件进不来；后一风险是分支推导，未测实际听感。✅ 借用已有系统的分组、优先级与重触发功能，仅为需要区别的事件补项目配置：普通同类枪声可合并，关键警告不要与普通装饰声共用会提前拒绝它的入口／组；第二个警告到来时由玩法决定保留旧声还是替换，不能统称永不打断。只更换音色／增加随机变体时维持原本的类别限额，避免每个资产各得一份预算。上述是工程推论，不宣称 Mindustry 已实现任意关键警告保障。

### 3. Unity／Unreal 只复用相关机制

[一手] Unity 6000.3 [priority](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-priority.html)在 real voices 不足时优先虚拟化低优先级声源，同优先级再按音量，虚拟化仍跟踪播放位置；数值越小优先级越高，不能照抄 Arc 的数值方向。该设置不影响 WebGL。 [isVirtual](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-isVirtual.html)仅在该 AudioSource 的主声及全部 one-shots 都被剔除时为 true，因此 false 不能证明某次关键 PlayOneShot 已被听见。[研究] 保留原生播放与 Mixer，在已有声音事件入口补必要的类别限制；别用一个混杂的 Source 状态当逐事件成功回执。

[一手] UE [Sound Concurrency](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-concurrency-reference-guide)已支持跨资产共享组、不同淘汰规则与 Retrigger Time；后者拒绝的声音忽略虚拟化设置，多组规则必须全部满足。[研究] ✅ 先配置原生组，明确警告是否受普通重触发限制；不要再写等价限流器，也不要把虚拟化当作被拒绝提示的待播队列。已有 WP6 对静音生命周期、混音与音乐调度的说明继续适用，本节不重列。

### 4. 最小采用与未来验收

[研究] 保留现有音频系统，不把 Arc／SoLoud 移植进 Unity／UE，不加通用威胁评分、专业中间件或全局队列。AI 可整理事件到资产／类别／重要性的映射并添加拒绝原因采集，人决定能合并哪些反馈、能否打断旧起音。未来获准实测时，在同类连发期间插入警告，再增加第二种变体与第二次警告：分别观察是否提交、被哪层合并／拒绝／抢占或虚拟化，并听验标志性起音、方向和时效；过期警告不应稍后补播成当前危险。记录 voice／CPU 预算，但不能以播放调用次数、有效 handle 或非虚拟状态代替听感验收。

[研究] 未引用 SoLoud 通用虚拟声文档替代此 fork 的实现；该部分沿用 WP6，不再扩章。

### 5. 持续状态声的反例：先校正可听范围与恢复政策

核实：2026-10-15 UTC+8。新增依据限开发者报告、固定数据定义和引擎文档；未试听、运行游戏／引擎或测量辨识收益。此节约束前述短事件并发建议，不撤回合理的限额，也不新增音频管理器。[研究]

**强反例与固定配置。** [Factorio FFF-341](https://www.factorio.com/blog/post/fff-341)（2020-04-03）报告：提高环境上限 15→50 缓解雷达声突然切断，却增加混音拥挤；管道无水仍发声片段，作者将其关联到 working_sound 与同类限额的冲突，移除该限额并缩小可听范围后报告改善。这只证明该历史问题，不证明所有循环声都该取消限额。[一手／研究]

[一手] 官方数据仓库的 2.1.21 固定提交 `374934f81f82b09ec9fc459f92a316bd642ddd82` 中，[sounds.pipe](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/prototypes/entity/sounds.lua#L248-L272)使用 persistent、淡入淡出、音量平滑及活动率控制；同文件的 roboport door 短音另设 aggregation，train_wagon_wheels 持续声仍设同类上限。[WorkingSound 当前文档](https://lua-api.factorio.com/latest/types/WorkingSound.html)（本次标注 2.1.21）定义 persistent 合并同 prototype 工作声，并在该模式忽略 max_sounds_per_prototype。[研究] 这支持按声源语义选政策，不支持“一次声限流、循环声不限流”；现代配置也不能冒充 2020 年修复的原始代码。该仓库[用途声明](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/README.md)是公开原型定义供模组作者查阅，不等于游戏引擎开源或音频素材获准再分发。

**实施时会改变选择的引擎差别。** [一手] Unity 6000.3 [maxDistance](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-maxDistance.html)当前契约区分：Linear 在边界归零，Custom 超界保持曲线末值，Logarithmic 忽略该设置并持续随距离衰减。因此减小 maxDistance 不能作为通用静音／回收方法，先核 rolloff 与曲线末值。其 [priority 虚拟化](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-priority.html)保持播放位置和状态，不等同 Stop 后重新 Play。UE 5.8 [attenuation](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-attenuation-in-unreal-engine)的 falloff 从内形状边缘起算，音量衰减与 spatialization 分开；[EVirtualizationMode](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/EVirtualizationMode)中 Restart 恢复循环时从头开始，PlayWhenSilent 继续占 voice，SeekRestart 仍标 Experimental。其余并发、混音和生命周期边界沿用 [WP6 引擎对照](2026-10-14-game-wp6-audio.md#105-unityunreal同一质量目标不同原生职责)，不重复实现一套虚拟化。

[研究] **采用与代价：** 短事件过期可丢，持续状态需按当前活动状态恢复；先调整现有声源的范围、曲线、淡入淡出与恢复配置，成本是逐类调校及复合场景听验。语义相近且不承担独立定位的环境层才考虑合并，定位重要的危险不能只为省声部缩短可听范围。Mindustry 的入口拒绝机制与 Factorio 的持续声反例是两个不同实现的边界证据，不构成通用参数或听感提升证明。

[研究] **未来验收预注册：** 保持原动作规则，加入第二种持续技能／机器声；在竞争前后穿越可听边界，同时切换实际活动状态。检查关键警告是否仍可辨、持续声是否错误重启／残留、已经结束的状态是否再次发出起音；再记录 voice／CPU。若范围缩小藏掉预警，或重启制造假事件，就撤回该配置；不能以没有播放错误或声部减少代替听验。本轮只完成资料核对。

## 运动可读性补研：关键提示不能靠历史积累补成另一个位置

核实：2026-10-14 UTC。主线二／三；补 04 的运动可读性：时域历史可能造成提示错位、残留和显露延迟，抗锯齿／上采样须在完整动作中验收；依据为官方文档、固定源码及历史 issue。[一手／研究]

### 1. 先区分输入错误、支持边界与积累取舍

- **支持边界。** [一手] [URP 6.3 motion vectors](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors.html)仅支持 opaque／alpha-clipped，不支持透明材质对象矢量；对象矢量还要求 shader pass、renderer 与对象／材质状态满足条件。ForceNoMotion 仍需对象 pass 覆盖相机矢量为零，不能视为省掉 pass 的捷径。[研究] 透明预告与余烟不能统一交给一个“打开运动矢量”修复。
- **相机相对运动。** [一手] [6.3 troubleshooting](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors-troubleshooting.html)说明跟随移动对象的相机若只用 camera motion，会给对象错误的大矢量；先查 Per Object Motion 与 Frame Debugger 的 MotionVectors pass。[研究] 屏幕位置近似不动，不代表世界空间对象无需矢量。
- **形变输入。** [一手] [6.3 Shader Graph 支持](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors-shader-support.html)的 Time-Based 会以今／前帧 Time 运行顶点子图，其他用户参数须逐帧不变；运行时改变技能强度等参数时，不能假定此模式自动正确。Custom 可提供前帧到当前的局部空间位移；Alembic 选项用于相应缓存与 PlayableDirector，普通 MeshRenderer 错开会读错流。[研究] AI 可核对动画参数变化来源与历史值归属，不能批量开启所有选项代替诊断。

### 2. 固定实现：不能抄反参数方向，也不能把最高档当辨识保证

[一手] 公开 `6000.3/staging` 本次解析为提交 `2d2e78cc9d6254bc6e7c9c5552cea053508e86cb`（2026-07-01）。这是固定源码快照，不是确认某个 Editor 补丁已经包含所有相同代码；部署时仍核项目锁定的包／Editor。

- [TemporalAA.cs](https://github.com/Unity-Technologies/Graphics/blob/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb/Packages/com.unity.render-pipelines.universal/Runtime/TemporalAA.cs)：`baseBlendFactor` 表示历史贡献，getter／setter 与内部 `m_FrameInfluence` 通过 `1-x` 转换；后者是当前帧贡献。不能把“提高 frame influence 减少拖影”直接抄成“提高 base blend factor”。
- 同文件的 `varianceClampScale` 说明较低值减少拖影但增加闪烁；`VeryLow` 不做 motion dilation，注释适用于无／低运动；`VeryHigh` 启用更多过滤。源码定义的是处理路径与成本取舍，不证明某档在本项目动作中最清楚。
- [TemporalAA.hlsl](https://github.com/Unity-Technologies/Graphics/blob/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb/Packages/com.unity.render-pipelines.universal/Shaders/PostProcessing/TemporalAA.hlsl)的 `DoTemporalAA` 采历史颜色、裁剪，再把 `frameInfluence` 传给 `ApplyHistoryColorLerp`；后者由历史色向当前色插值。已对照执行表达式，不只重复参数注释。

[一手] [6.3 AA 文档](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/anti-aliasing.html)承认快速高反差物体可能产生 TAA 拖影；该版本 TAA 与 MSAA、Camera Stacking、Dynamic Resolution 不兼容。MSAA 主要解决几何边缘，不修 specular／texture aliasing。[研究] 所以正确运动矢量只是必要诊断项之一；不能承诺修完矢量即可消除拖尾，也不能为了一个透明提示默认新增相机栈。

### 3. 可比较方案与撤回条件

| 路线 | 采用条件与具体改变 | 撤回／不适用条件 |
|---|---|---|
| ✅ 修正原生运动输入，保留时域路线 | 不透明角色／武器／形变对象存在缺失或错误矢量；先核 pass、前后帧位姿与参数，再调滤波 | 确属透明支持边界，或矢量正确仍有残影时，停止盲加开关；不将通用 shader 重写作为单人默认 |
| 🧪 减少历史积累或收紧颜色约束 | 场景确实需要时域稳定性，但短暂关键提示残留／移动糊掉；小步改变历史贡献与 clamp，保留原值 | 闪烁、边缘爬动比原拖影更妨碍判断时撤回；锐化只改变观感，不能保证恢复错位历史中的真实提示 |
| 🧪 非时域基线 | 相同分辨率比较 SMAA／FXAA；以几何轮廓为主且路径兼容时比较 MSAA，保住原动作规则 | 高光／纹理闪烁、细小轮廓丢失或预算失败就撤回；不得从“没有历史拖影”推导“所有画面问题解决” |
| ✅ 收窄内容频率与透明装饰职责 | 危险边界／方向采用足够屏幕尺寸的稳定形状，与余烟分开；风格允许时让关键轮廓由简单 opaque／alpha-clipped 几何承载 | 硬边、覆盖面积或遮挡改变范围理解就撤回；不把全部烟雾改 cutout，不通过任意延长预告时间偷偷改玩法 |

[研究] 后两条与现有 WP5 的信号分层相接，但这里新增的是运动／历史输入约束，不另建效果框架。若最低内部分辨率下关键形状已经难以稳定采样，先考虑简化细节、调整形状／显示尺寸或提高该档输入分辨率，不能要求上采样保证补出所有短暂细节；这些是待目标项目验证的内容决策，不是跨游戏通用像素阈值。

### 4. STP 对照不能只看相机菜单

[一手] [URP 6.3 STP](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/stp/stp-upscaler.html)要求 TAA 预处理，会隐式启用；需要 Shader Model 5.0，不支持 OpenGL ES。[研究] 非时域对照要同时核 Upscaling Filter 与 render scale，不能仅改变相机 AA 标签后宣称完成对照；不要把 STP 当成无需正确运动输入的独立修复。

[一手] [6.3 STP Debug Views](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/stp/stp-debug-views.html)提供输入运动、重投影色差及 Sensitivity；绿色包含无法预测的快速运动、新显露区域或错误矢量，红色标示排除时域预测的像素。[研究] 用原生视图定位后回到实际动作判断；调试色不能直接充当可读性合格／失败评分，也不由此假设所有透明效果都已无拖影。

### 5. 历史反例：实际修复与当前限制分开

- **UUM-72748：可见集合错误确实需要修复。** [一手] [官方 issue](https://issuetracker.unity.com/issues/14144/motion-vectors-for-an-object-are-included-in-the-urp-motion-vector-pass-when-the-objects-layer-mask-is-filtered-out)记录被 layer mask 排除的对象仍进入 URP Motion Vector pass，移动时出现幽灵立方体；2022.3.30f1、6000.0.4f1 可复现，标注修复于 2022.3.37f1、6000.0.8f1，只测 Windows 11。[研究] 这是颜色与矢量对象集合不一致的历史反例，不是今天 6.3 普遍缺陷；对应旧工程先核补丁，不用调滤波掩盖问题。
- **UUM-26709：较高档位也曾触发专有故障。** [一手] [官方 issue](https://issuetracker.unity.com/issues/6004/temporal-anti-aliasing-taa-produces-severe-artifacting-when-quality-set-to-very-high)记录 URP 14.0.4–16.0.0 的特定 Timeline scrubbing 场景，High 正常、Very High 黑白伪影；页面对相关分支标 Fixed，但未给精确修复补丁。[研究] 仅支持升级／档位变更应覆盖实际动作的判断，不将该历史问题写成禁用当前 Very High 的依据，也不虚构修复版本。

### 6. 后续获准验证与二次修改

[研究] 保持同一游戏规则和相机轨迹，分开比较原生分辨率／固定 render scale、时域／非时域路径及内容简化，不让多项同时变化掩盖原因。观察提示出现、急转、遮挡后显露、停止与消失；除单个敌人，还覆盖两个攻击交叠和低帧率。第二次内容修改可将固定 Time 形变改为随技能强度变化，或添加透明余烟，再核运动输入和危险边界是否仍清楚。AI 可查材质／renderer 配置与构造对照，人判断方向、范围、持续伤害是否被误读；帧时间配合观察，静态截图或平均 FPS 不能替代辨识。本轮无识别率、性能或最优参数实测收益。

## 验证选择深化：状态、输入与体验各自需要什么证据

核实：2026-10-15（UTC+8）。主线一／三；改变 game02 的验证阶梯、第一天全接口和“手感不可计算”建议。新证据为输入测试后端、暂停时钟、截图降噪契约，以及重读作者完整试玩记录；只读公开文档和已有研究，未安装／运行引擎、模型或真实 OS 输入。[研究]

### 1. 采用与撤回

[研究] ✅ 按待证事实选已有入口，不按 L0–L6 建设阶梯。规则可独立调用时保留确定性测试；场景生命周期才进入运行时；绑定／焦点走输入系统；设备／OS 路径用目标设备；连续视听品质与人的体验判断不被状态快照替代。撤回新项目第一天全套接口和“至少两个异常场景”的固定数量，风险决定要保留的动作链。不是少测试，而是不让接口数量代替有效断言。

### 2. 本次读取的新一手契约

- Unity [Input testing 1.19](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/Testing.html)：自动输入可脱离平台后端与物理设备；InputTestFixture 提供空白隔离系统，启动代码里的自定义注册也不会自动存在。由此可用来查绑定与动作交互，但测试初始化差异和硬件链需要另外判断。[一手＋研究]
- UE 5.8 [Automation Driver](https://dev.epicgames.com/documentation/en-us/unreal-engine/automation-driver-in-unreal-engine)：替换 Core 输入接口实现，启用时阻断几乎全部平台输入并注入模拟输入；公开 API 不依赖 Slate，但现成定位器针对 Slate，当前动作是键鼠，控制器／触摸列在未来能力。同步 API 不得在 GameThread 运行。它是引擎侧输入模拟，不是 OS 外设覆盖；不为此推荐新装框架。[一手＋研究]
- [Roblox Studio MCP](https://create.roblox.com/docs/studio/mcp)：playtest 子 Agent、Client／Server Luau、状态／日志／截图、键鼠模拟与 character_navigation 分别存在，各调用指定 studio_id。仅可证明当前文档暴露这些入口，不推断内部键鼠一定走 OS，也不把角色导航等同于玩家控制通过。[一手＋研究]
- [Unity CLI release notes](https://docs.unity.com/en-us/unity-cli/release-notes)当前页顶部 beta.13（2026-10-07），beta.12 段说明 Play 状态附带 frameCount／playerLoopTicking；[timeScale](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-timeScale.html)与 [unscaledDeltaTime](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-unscaledDeltaTime.html)表明不同更新路径的时钟不等价。[UE FTickFunction](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/FTickFunction)明确 bTickEvenWhenPaused 控制暂停时 Tick。帧推进是运行证据之一，不证明指定玩法或物理推进；暂停案例同时核世界、UI 和动作缓冲。[一手＋研究]
- [UE Screenshot Comparison](https://dev.epicgames.com/documentation/en-us/unreal-engine/screenshot-comparison-tool-in-unreal-engine)：提供误差容忍及关闭 TAA、运动模糊、SSR、曝光等降噪选项。固定图像回归可用，但正在检查时域拖影时关闭相关效果会改掉被测对象，需要保留实际配置的连续观察。这是选择观察手段的理由，不是新增视觉测试框架。[一手＋研究]

### 3. 原案例反证与可借用质量机制

[一手] 重读 [Schomay 原文](https://blog.jeffschomay.com/letting-ai-play-my-game)：作者的文字／回合制游戏采用外层文本状态和合成事件；公开轨迹显示解开笼子后仍不能移动，清除 state.caged 后坐标改变；末尾也说人工又发现 bug 和 feel 问题。[研究] 因而保留作者结果，撤回“这类 bug 单元测试通常发现不了”：关键是断言退出状态后的下一动作，独立规则测试或真实事件回归均可承载。作者未给测试体系能力对照，不能推出某类测试无效。

[研究] 延用本记录的 Celeste／Celeste 64／Deepnight 固定源码研究，不冒充本轮重新运行。具体采用单位是可复现的动作条件与可切换的反馈；尤其 Deepnight 的视觉后坐力和实际位移、枪械演出和控制锁不等价，不能用“全部打开”证明纯美术收益。让 Agent 检查时间戳、窗口、状态、帧时间与视听变化，人决定公平、力度、清晰度和长期体验。可测量部分存在，不推出整体乐趣有一个自动合格分。

### 4. 范围与后续

[研究] game02 用暂停／设置加入原有蓄力动作作为第二次修改例子，先由项目决定暂停和释放政策，再选择规则、输入、运行时和人工观察；不是通用状态机或固定异常数。复现版本、动作序列和预期结果可以沿用现有 fixture，无需新增目录或测试服务。本轮验证仅文档／链接与仓库离线检查；目标设备、真实引擎与玩家收益留到获准实测。

[研究] 本轮完成完整离线 14 阶段（97／26／10／13／14 项，非空无 skip）与 `git diff --check`。独立新上下文评审对本节及 game02 未发现事实或决策级问题；入口残留的阶梯／先改造建议由整合端同步处理后才算完整交付。检查与评审均不替代引擎／设备／玩家验证。


## 像素网格补研：低速步进不是物理插值失效

核实：2026-10-14 UTC。主线一／三；改变 04 将移动抖动优先归入模拟节奏的建议：像素风先分清世界模拟、低分辨率场景和最终放大画面的取整。新证据是不同作者的原型复盘与固定演示实现、Unity 6.3 URP／Cinemachine 3.1.7 契约；不增客户端模块或渲染框架。[一手／研究]

### 1. 两位作者的方案为什么不能互相代替

[一手：作者实述] Slow Rush Games 的 [2024-01-26 复盘](https://www.slowrush.dev/news/pixel-perfect-rendering/)记录：相机吸附改善像素物理纹理与背景之间的相对摇摆，却使其他画面跳动；连对象也吸附仍未整体解决；最终画布的 sub-texel scrolling 改善相机移动，却保留画布内慢速物体的逐 texel 跳动。作者需要摩擦停稳、弧顶和旋转刚体，因此接受像素边缘过滤。该页面仍以矩形代理为主，明确真实精灵尚待接入、性能未 benchmark；关于 Noita／Broforce 的比较仅是该作者转述，本轮未独立核实，不用它证明成熟游戏普遍采用某种过滤。

[一手：固定源码] Daniel Ludwig 的 `code-disaster/gdx-mellow-demo@901d2bcae3819807e54814a4a34d3c72d1236f68`（2016-02-07）提供可读的替代机制。[MellowGame.java L297–368](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/core/src/com/codedisaster/mellow/MellowGame.java#L297-L368)先把 scene camera 按 WORLD_UNIT_SCALE 向下取整，再把剩余位移转换为最终放大画面的 offset；只有 `UpScaleAndBilinearFilterShader` 模式继续拆出小数部分。对应 [fragment shader](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/core/assets/shaders/mellow.fsh)按该小数权重组合四次采样。渲染对象是 tilemap，不能据此宣称独立角色的低速运动已经平滑。

[研究] 可借“低分辨率画面与最终输出分开处理”的思路，不从一个游戏的过滤选择推出默认方案，也不因相机滚动顺滑就认定物体动画／碰撞更顺滑。该 demo 的分辨率与放大倍率写死、运动循环另有逐帧项，不作新项目底座或帧率无关运动范本。[一手] [LICENSE](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/LICENSE)为 MIT；README 单独署名外部 tileset，本轮仅读代码，不把整个示例的美术许可一并视作已清。原博客入口本轮无法读取，机制结论来自实际下载的固定源码；未构建或运行 demo。

### 2. Unity 原生能力：能对齐像素，不替玩家决定取舍

[一手] Unity 6.3 [URP Pixel Perfect Camera](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/2d-pixelperfect-ref.html)明确内置于 Universal 2D template，不应另装只适用于 Built-In 的同名独立包。`Pixel Snapping` 阻止显示在像素之间，但不改变 Transform；`Upscale Render Texture` 先画到参考分辨率或按视口比例扩大后的临时纹理再放大。`Filter Mode` 中 Point／Retro AA 的取舍限定在 Crop Frame 为 Stretch Fill 时：前者清楚但可能闪烁，后者减少闪烁但边缘更软，不能把此开关当通用的慢速对象修复器。

[一手] [Cinemachine 3.1.7 Pixel Perfect 扩展](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachinePixelPerfect.html)协调两个系统都修改 orthographic size 的冲突；文档明确 blend 期间暂时非 pixel-perfect，Upscale Render Texture 的可用尺寸更少，可能导致明显构图偏差。该页仍用历史 Framing Transposer 名称描述 Target Group 限制，本轮不把它改写成对当前 Position Composer 的已验证缺陷。

[研究] ✅ 有意追求整格视觉时先沿用原生组件，把慢速步进纳入风格验收；🧪 连续慢速／旋转需要更高时，比较呈现分辨率与过滤，不先为此自建渲染器。镜头阻尼／物理插值可以改善上游轨迹，却不会移除最终量化规则；不能为显示上的对齐而无意更改碰撞、平台接触或鼠标命中位置。上述 Unity 设置不映射成 UE 同名等价菜单，本轮没有提出 UE 配置推荐；模拟与呈现分工的判断可跨引擎使用。

### 3. 后续验证与撤回条件

[研究] 同一美术与动作比较严格网格、提高呈现分辨率和有界过滤，分别观察慢速角色、相机跟随、独立平台停稳／旋转，以及视差背景的相对运动。新增第二种窗口尺寸／缩放档后，核边缘闪烁、细小危险提示、mouse-to-world 对齐与切镜取景；不要用单张静止截图或平均 FPS 评分。像素尺寸不一致、过滤使危险边界难辨、增加显著开销或改变预期风格，就收窄／撤回该路线。

本轮完成资料和固定源码阅读；未运行游戏、Unity／UE、shader 或玩家视觉实验，未证明任何路线体验更好。公开源码仅借机制，未来真正采纳前还需按锁定引擎和目标设备验证。[研究]


## 信号取舍补研：呈现设置保住玩法信息，辅助规则另有承诺

核实：2026-10-14 UTC。主线一／三；改变 04 的选择：并发信息读不懂时先减规则／效果，设置与新内容共享玩法含义；不另建无障碍框架。[研究]

### 不同类型的一手证据与边界

- **回合策略，Subset Games。** [一手：开发者复盘] Matthew Davis 的 [Into the Breach Design Postmortem，2019](https://media.gdcvault.com/gdc2019/presentations/Into%20the%20Breach%20Postmortem%20Final.pdf)，PDF 页码 14、31–36：玩家回合内确定性与敌人攻击预告是设计约束；UI 要交代目标和攻击类型，因此限制到三类攻击、正交方向及稳定敌人属性，并大幅裁减武器设计。已读 PDF 文字。它证明团队曾让信息表达反向约束内容，不证明即时游戏也要预告所有结果，或照抄三类攻击就会好玩。
- **即时动作，Dead Cells 29。** [一手：官方历史补丁] [29 系列](https://deadcells.com/patchnotes/29)的 29.1 补齐配色在 HUD／菜单／图标／武器／物品的应用，属性选择不再只写颜色名；29.2 修复重要资产落在背景滤镜后面。29.1 同时明确提供全图揭示辅助选项。这里的失败是呈现与选项承诺不一致，不能推导辅助玩法必须保留标准模式的未知信息或难度。
- **同一游戏后续内容，Dead Cells 35。** [一手：官方历史补丁] [35 系列](https://dead-cells.com/patchnotes/35)的未单独标小版本修复项包含隐形敌人仍有轮廓；35.7 明确修复部分弹体在开关开启时缺轮廓。页面列有 alpha／beta 和后续版本，不能把各项日期当同一天的正式全平台发行，更不能说这些仍是当前缺陷。这里记录已报告的两种相反失配：多显示与漏显示。

### 采用、删减与不能外推的部分

**[研究] ✅ 采用项目内的小范围映射，不新增通用提示系统。** 为现有敌人／技能配置明确这条信号对应的对象、时点、范围或结果；颜色、图标、轮廓、音效引用同一已决定的状态。即时威胁的可行动时间短，先保来源和危险边界；回合策略可以把较低频说明放进选中／悬停详情，但行动预览必须跟着当前局面更新。两例不能建立跨类型、跨玩家的通用信息排序。

**[研究] 🧪 删装饰，必要时减玩法组合。** 降低粒子／震动／重复飘字后仍能判断下一步，才算安全删减；动画或声音若是唯一节奏／方向线索，先补等义提示或明确辅助规则再删，不能机械“全关”。声音转成视觉提示时，不默认增加声源的精确坐标、透墙轮廓或提前预告；允许增加什么由该模式的设计决定。这是推导的实现边界，本轮没有独立游戏声转视觉效果实测，正文不承诺字幕足以替代空间听觉。

**[研究] ⛔ 不以全屏滤镜、所有对象描边或图标数量当完成标准。** 现有动作、音频并发和运动画面章节已覆盖信号能否按时出现；本节只补“出现后表达什么、切设置后是否仍表达同一承诺”。纯呈现设置与改变规则的辅助选项可以分组说明，但无需先建完整设置框架。

### 第二次修改：仅预注册，不运行游戏

1. 在已有遭遇中加入一种远程弹体或新状态，不另造脱离实际玩法的展示台；保留旧敌人混合出现。
2. 对项目实际提供的默认、减粒子、静音、改色／轮廓配置，观察危险源、起手时点、范围及命中／格挡结果；只记录可见／可听信息，不以效果组件已启用代替辨识。
3. 若有隐形／未发现对象，核其显示随规则状态变化；若模式明确承诺全图或提前揭示，按新承诺检验。切回标准模式再核旧状态，不将辅助设计自动定性为泄漏。
4. 更新第二种颜色／状态后检查场景、HUD、物品说明及旧内容；新招式持续挤占关键提示时，先减少同时出现的组合或重做表达，再决定是否保留该招式。

**验证范围：**本轮读取上述一手正文与 PDF 文字；没有安装／运行引擎、游戏或模型，也未做色觉、听觉或玩家测试。没有取得可证明提示净收益的实验；AI 可查映射覆盖，人仍需判断节奏、可读性和辅助模式承诺。[研究]

## 重复进入补研：不要让编译刷新替你重置验收状态

核实：2026-10-15（UTC+8）。主线 3；改变 game02 的验证入口选择：第二次改动触及初始化、静态订阅／缓存或热更新时，区分编译后首次进入、无源码变化的重复进入与新进程启动。新证据为 Unity 6.3／UE 5.8 契约及 Realm、NGO 已合入维护链；仅公开资料与源码差分阅读。[一手／研究]

### 已有覆盖与新增选择

WP9 已处理资产更新、依赖重建和引用；WP10 已写加载退出、UI 重复监听、编辑器扩展 Domain Reload 开关重入；WP11 已有 Cinemachine static reset 提前的案例。本节不复述这些生命周期责任。缺口在于 **Agent 每次改脚本后只 Play 一次，可能借编译刷新获得了额外初始化；只在热会话里反复成功，也可能看不到首次进入的不同状态**。因此改变的是同一验收动作的起点，不是另建测试架构。[研究]

### Unity：两个已修历史案例给出相反方向

[一手] Unity 6.3 [关闭域重载](https://docs.unity3d.com/6000.3/Documentation/Manual/domain-reloading.html)说明静态字段和事件订阅跨 Play 保留；脚本变化的 Asset Database refresh 仍会重载域。运行时代码可在 `SubsystemRegistration` 重置，编辑器代码另用其编辑器初始化入口；退出解绑与下次启动重新初始化是不同责任。不要为了让验收通过擅自改变项目的 Reload 设置。[研究]

1. **Realm：第一次正常，第二次缺少初始化。** [#2898](https://github.com/realm/realm-dotnet/issues/2898)报告禁域重载后第二次 Play 的登录挂起。维护者解释退出为避免 native 异步挂起会拆除 native hooks，但重进 Play 不再执行负责接线的静态构造器；用户在 2023-01-05 报告预发布包复测成功。[一手：维护者；社区：使用者报告] [#3145](https://github.com/realm/realm-dotnet/pull/3145)于当日合入 [`2a6d23c`](https://github.com/realm/realm-dotnet/commit/2a6d23cc40bac8bd3c9d841b8f731616f889ddab)。API 返回的补丁显示 [Initializer.cs](https://github.com/realm/realm-dotnet/blob/b30e116cb92c23773f49daedff548afb3265796a/Realm/Realm.UnityUtils/Initializer.cs)新增 `OnSubsystemRegistration` 调 `NativeCommon.Initialize()`；`NativeCommon.CleanupNativeResources` 同时重置初始化标志并限制重复清理。[一手：固定差分] 这说明不能把“解绑都做了”当作重入成功，也不表示当前 Realm 仍有此缺陷。[研究]
2. **NGO：编译后首次失败，随后可能正常。** [#2892](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/issues/2892)记录 Unity 6000.0.0b13／Netcode 2.0.0-exp2，关闭 Scene Reload 后，域重载使子行为缓存成为空列表而非预期 null，跳过重新发现，场景对象不发 `OnNetworkSpawn`；同时禁域重载后再次进入可恢复。[社区：报告者调试，未由本仓复现] [#2906](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/pull/2906)明确修复 #2892，于 2024-05-08 合入 [`cd6ead3`](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/commit/cd6ead3ac07100f5769d080e46dd4f269e8aea40)。固定 [NetworkObject.cs](https://github.com/Unity-Technologies/com.unity.netcode.gameobjects/blob/85c6f39f9ef88edc8295bd0cdbcf39c5d0bb362d/com.unity.netcode.gameobjects/Runtime/Core/NetworkObject.cs)差分在 Awake 添加 `m_ChildNetworkBehaviours = null`；PR 还包含其他 spawn 功能，不能把整个 PR 的收益归于此行，也未证实其中测试覆盖全部 Reload 组合。[一手／研究]

**采用判断。** 保留编译／刷新后的第一次动作结果，再在不编辑脚本、不主动刷新的 Stop→Play 后走同一动作；核当前对象、会话初始状态、回调次数及完成结果，而不是只看日志无红字。若二者不同，先查初始化／缓存和所用包版本，不把其中较好的结果当通过，不默认“第二次一定更糟”。没有禁重载或相关状态风险、既有测试已覆盖的纯逻辑改动不追加这条路径。[研究]

### UE：旧实例、反射对象和工具注册不是一个刷新契约

[一手] [UE 5.8 Live Coding](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-live-coding-to-recompile-unreal-engine-applications-at-runtime)规定 `.cpp` 构造默认值变化不更新已有实例；Object Reinstancing 则可替换反射对象。持有相关指针的代码需通过 `ReloadReinstancingCompleteDelegate`／`ReloadCompleteDelegate` 更新引用或作废缓存，遗留对象还可能在退出时触发析构冲突。[研究] 因而只按“改了 `.cpp`”选热验收不够：初始化变化须读真实实例值及蓝图／关卡覆盖，并在完整构建后的新进程重走启动；缓存变化须包括退出路径。新进程复核也不能抹掉资产已保存的覆盖值。

[一手] [Unreal MCP 官方文档](https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor)又明确限定 C++ 工具新增 `UFUNCTION` 要完整重启；`RefreshTools` 重轮询注册表，客户端可能还需重连以更新 schema。这项工具发现限制不能扩写成所有反射对象一概不支持 Live Coding；一般 Reinstancing 能力也不能反过来推翻新增 MCP 工具的重启要求。[研究] 大项目页保留头文件／反射变更完整编译重启作为保守执行策略，撤回其错误的通用能力归因；不建议因此扩大自动热更范围。

[一手] [PIE 多玩家选项](https://dev.epicgames.com/documentation/unreal-engine/play-in-editor-multiplayer-options-in-unreal-engine?lang=zh-CN)还区分 Net Mode 的 Play Standalone 与 Run Under One Process；前者不自动证明独立进程。[研究] 仅当改动触及跨实例共享状态／联网启动时才额外核实际进程与实例，不向单机公式改动添加多客户端层，也不把独立进程试玩当已完成 cook／发布验证。

### 后续验收范围与停止条件

未来获准运行时，沿用已有最小场景和动作入口，记录代码／包版本、Reload 或 Live Coding／Reinstancing 设置、是否刚编译、进程与实例来源，并分别保留首次、重复进入和按需新进程的结果。已有测试能启动所需真实路径并读出这些结果，就不添加 MCP、HTTP、全局 reset 框架或新的测试层。状态注入／手动清缓存会改变起点；若这是夹具必要步骤，应明确其覆盖的是隔离规则，而非自然启动。[研究]

本轮未运行引擎、第三方游戏、模型或上游测试；公开 issue 的复测是他人报告，固定差分只证明维护机制，不能量化 Agent 净收益或断言当前项目存在同样问题。Realm PR 的网页抓取失败后，使用公开 GitHub API 核实合并 SHA／日期与文件补丁；NGO 同时核了公开 PR 与 API 差分。[研究]

## 粒子预算补研：模拟规模与透明覆盖不能互相代替

核实：2026-10-14 UTC。改变 04 的设备预算选择：先区分 CPU 实例／更新与 GPU 绘制压力，再选原生 CPU／GPU 粒子或缩减效果；不再让“加池、减粒子、迁 GPU”承担同一个承诺。[研究]

### 不同作者的机制与反例

- **Factorio，透明烟雾。** [一手：历史开发者调查] [FFF281](https://www.factorio.com/blog/post/fff-281)（2019-02-08）记录烟雾降低更新频率后，到期粒子仍可能被绘制，越透明反而覆盖越大；修复跳过到期绘制，另略去作者判为无贡献的低透明度尾部。[研究] 支持按透明覆盖／寿命追 GPU 浪费，不推广作者透明度阈值或收益到其他材质、背景、分辨率。
- **Factorio，状态隔离。** [一手：作者方案] [FFF326](https://www.factorio.com/blog/post/fff-326)（2019-12-20）把可运行任意 trigger 的粒子与不改游戏状态的 simple particles 分开，后者可推算轨迹、离屏不创建；仍受单类型、固定发射器和运动范围限制，并处理入屏／读档不重播。[研究] 借用“能否不模拟取决于语义”的因果，不把作者自研 emitter 搬进 Unity／UE，也不把所有屏外效果都判为可停。
- **Sector’s Edge，视觉接触反例。** [一手：作者历史代码] Mitchell Robinson 的[2020 博文](https://vercidium.com/blog/particle-optimisations/)让碎屑 ray-march 体素地形，碰撞后反弹／减速；文中该更新路径修改粒子自身速度与姿态，未见伤害结算或地形写入。[研究] 因而“有碰撞”不证明它必须作为玩法真相持续模拟；但若保留贴地／反弹观感，随意取消碰撞会改变效果。作者测量来自 Ryzen 5 1600／GTX 960 及特定立方体粒子，不拿数量或速度比作本项目预算，更不能横比 Factorio 烟雾。
- **同作者源码纠偏。** [一手：固定源码] `Vercidium/particles@31bd44b3d3654498924ee26604884cfedf969e92`（2021-08-25）的 [ParticleManagerUpdate.cs](https://github.com/Vercidium/particles/blob/31bd44b3d3654498924ee26604884cfedf969e92/source/particlemanager/ParticleManagerUpdate.cs)只示例更新位置／旋转／寿命并写入缓冲，已经不含上述体素碰撞；[Particle.cs](https://github.com/Vercidium/particles/blob/31bd44b3d3654498924ee26604884cfedf969e92/source/structs/Particle.cs)也无伤害／地形状态。[README](https://github.com/Vercidium/particles/blob/31bd44b3d3654498924ee26604884cfedf969e92/README.md)说明使用 mock OpenGL bindings，[LICENSE](https://github.com/Vercidium/particles/blob/31bd44b3d3654498924ee26604884cfedf969e92/LICENSE)为 Apache-2.0。[研究] 👀 仅借机制，⛔ 不作为商用引擎即插即用碰撞库；许可允许复用不消除接入线程／渲染后端的成本，未复制代码或资产。

### 现成路线怎么选

| 已定位的约束 | 选择与成本 | 撤回条件 |
|---|---|---|
| 少量、局部反馈，需逐粒子脚本或物理交互 | [一手／研究] ✅ Unity 6.3 [Particle System](https://docs.unity3d.com/6000.3/Documentation/Manual/ChoosingYourParticleSystem.html)具备这些交互；已有实现够用便保留，不因 VFX 可处理更多粒子而重做资产 | 只有对应模拟负载或确切图形创作需求成为瓶颈，再比较 VFX；不能把逐粒子接口当无成本 |
| 大规模主要呈现效果，CPU 模拟成为热点 | [一手／研究] 🧪 VFX Graph；[17.3 要求页](https://docs.unity3d.com/Packages/com.unity.visualeffectgraph@17.3/manual/System-Requirements.html)要求 compute 与 SSBO，URP 不支持 gamma 色彩空间，不支持 Open GL ES。图属性／事件交互不是 Particle System 逐粒子 C#／物理的等价替换 | 若必须维持原图形 API／交互或 GPU 已紧张，保留原生小效果或缩范围；维护两套效果也计入单人成本 |
| UE 多处小效果／多 emitter 的 CPU 开销 | [一手／研究] ✅ 先用 [Niagara Effect Type](https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara)缩实例／发射量／renderer，再比较相同逻辑合并；GPU 路线保留 System／Emitter CPU 开销，池也不消除重新激活成本 | 合并降低裁剪粒度；GPU 瓶颈、少粒子或显存紧张的设备仍比较 CPU，不默认迁移 |
| 高分辨率／近景透明覆盖是热点 | [研究] ✅ 缩装饰烟片面积、重叠、尾部寿命与材质成本，保留接触瞬间及关键预警；必要时减少同时发生的效果／遭遇组合 | 若简化后提示不完整或接触感丢失，重做少量更明确的反馈，而不是仅以帧时间下降验收 |

[一手／研究] Unity 17.3 要求页另外写 URP／mobile 的 VFX 尚未 out of preview；这是该包页面的状态表述，不推导 URP 整条管线不可用，也不作为“所有移动设备禁用 VFX”的依据。UE 页面当前显示 5.8，但正文保留 5.4 Lightweight Emitters 的历史说明，本节未据此推荐该功能或断言其当前成熟度。平台支持与实现版本在实际接入时再核；两个作者的历史方案只证明具体机制，不代表跨游戏画质／性能排行榜。

### 第二次修改只预注册

[研究] 先记录最低设备、分辨率、帧率与可用显存／内存；既有遭遇的整体帧预算不能重复分给每个效果。不设置通用粒子数。后续获准后，在目标构建分别观察：少量大透明片、许多小效果实例、同效果离屏再入屏；看 CPU 更新／实例开销、GPU 绘制时间、关键提示及尾部消失，不用编辑器单效果预览代替整场遭遇。

[研究] 二改新增“可点燃地面的碎片”：让 AI 检查伤害／地形写入是否依赖可被裁剪的视觉回调；规则由玩法层执行，外观从结果产生。在低档／离屏仍应保持相同规则，必要的可见危险边界不能随装饰额度消失。试用前保留原效果与预算配置，便于撤回 GPU 迁移或更激进裁剪；若规则已与表现绑定，先分离这项依赖而非另建特效框架。未运行引擎、性能采样或玩家验证。


## 空间容错补研：动作已开始却卡在边角

核实：2026-10-15 UTC。主线一／三；补 04 的窄选择：输入已经接受，动作仍被视觉上微小的边角打断时，改碰撞表达还是增加局部纠偏。已有时间缓冲、坡阶／平台、像素量化与足锁不替代这一决定；通用判断只在 04 维护，不新增运动框架。[研究]

### 两种玩法的作者证据：局部补偿不是统一缩小碰撞体

- **俯视建造／探索，Factorio。** [一手：作者历史解释] [FFF346（2020-05-08）](https://www.factorio.com/blog/post/fff-346)说明岸线过渡画面使旧矩形碰撞像无形墙，作者改为按玩家位置与过渡形状处理地形通行，并容许敌人不能通过同样路径。后续加玩家专用参数时，造地后的安全检查仍按整包围盒判断，将合法站位误认为落水而在脚下造地。作者说明同问题曾修过却没有补测试，也提示更早历史的回忆可能不准确。[研究] 需要协调的是各调用对该角色政策的理解，不是让所有实体共用同一通行规则；不把作者自述当当前引擎源码审计。
- **精确平台，Celeste。** [一手：作者说明] [Celeste & Forgiveness](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html)分别描述上升顶角侧挪、水平冲刺上缘修正与半实心平台上推；这些定位容错与短期输入缓冲并列。[研究] 只借“按具体动作扩大可接受的微小误差”，不能从单个游戏推出所有动作都应纠偏，或照搬像素距离；没有受控体验收益。

### 固定实现与后续修订：没有墙，不等于可安全纠偏

[一手：源码静读] `NoelFB/Celeste@1b0ce45c75e05649ae91b44a8bb6b196684e4352`：

- [Player.cs L2399–2422](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs#L2399-L2422)的水平碰撞纠偏限于 Dash／RedDash 及纯水平速度分支，按有限偏移距离试上下位置，无 Solid 后调用 `MoveVExact`／`MoveHExact`；着地可蹲下分支优先。
- [L2582–2613](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs#L2582-L2613)的上升顶角修正按水平速度符号选择左右，找到无 Solid 点后直接改位置。[研究] 两条应用路径也不同，不能从字段名抽成一个通用“纠偏半径”；本轮只审公开 Player 类，不声称审完商用游戏全部碰撞回调。

[一手：官方历史反证] [V1.4.0.0 changelog](https://www.celestegame.com/changelog.html)明确记录冲刺角与单向平台顶部有刺时不做对应修正、检查改用 hurtbox、禁止向带刺地面下修。固定旧分支不包含这些后来明确补充的条件。[研究] ✅ 借状态限定与有限搜索机制，⛔ 不把旧分支原样当完成方案；按本项目检查危险、经过路径、落点与通行政策。不能将历史修复写成当前仍有缺陷，也不能推断所有顶角修正都遵循完全相同的危险条件。

[一手：许可] 已读同 SHA 的 [README](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/README.md)和 [MIT LICENSE](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/LICENSE)：许可只覆盖仓库代码，不含商业游戏／资产。它是可读学习片段，不是 Unity／UE 即插即用控制器；本节未复制代码。其他作者网页不授予其游戏资产复用权。

### 代价与另一个作者的维护反例

[一手：作者历史报告] [FFF344（2020-04-24）](https://www.factorio.com/blog/post/fff-344)记录给 mod 单位启用地形过渡碰撞后，抽象寻路未支持而崩溃，先撤回、后补支持。是否给敌人启用还涉及已有防御策略与额外计算；文中约5%是历史粗测，不预测本项目成本。[研究] 空间补偿不是仅修改每帧碰撞，多种实体与世界修改路径会扩维护面，允许不同规则也须明确调用范围。

[一手：官方修复] [Mina the Hollower 更新页](https://www.yachtclubgames.com/blog/mina-the-hollower-update-notes/)页头为2026-06-26；其1.0.5记录缩小 Spark 排出检查框以免轻微重叠就排出，并排除箱子、雪球、可移动／可破坏物。1.0.6记录钓竿跳跃落到 speed bump 后卡在墙排出过程，并调整 fishing wall ejection 的位置偏好。各版本没有在该段给出独立发布日期，不把页头日期当所有修复发布日期。

[研究] Spark 是另一对象，不能冒称前述修复全是玩家控制，也不能把已重叠位置的排出等同 Celeste 的动作容错。此来源只反证通用自动挪位的范围：对象类别、动作与目标偏好仍需维护，不证明哪种算法更好。正文不再堆第三案例。

### 最小采用、撤回与第二次修改

[研究] ✅ 显示轮廓误导时先校准碰撞或关卡边界；🧪 明确要宽容微小定位误差时，沿现有运动所有者补有界、状态限定的纠偏，不另造位置写入者或自动寻路。精确卡位／窄缝本身是挑战时可保留阻挡，只改善表达。若更顺滑来自穿过本应阻挡的路线、误入危险或不断添加逐房豁免，就收窄规则，必要时改空间；不一律扩大搜索或缩小身体。

[研究] 仅预注册项目适用的一种二改：平台游戏加带危险边缘的移动平台，或俯视玩法加可放置地形／障碍。比较原规则、空间表达修正、局部纠偏；在动作接受时间不变时看最终位置、触发分支、危险结果及是否仍沿玩家选择的路线。回查旧普通角、两侧都能通过、单向／动态障碍，以及重开或放置后的合法位置。敌我有意不同时按各自承诺判断，不用“路径完全一致”作为目标。

[研究] AI 可追移动、放置／脱困调用与状态分支，准备相同输入回归；人决定哪些近失误应被宽容、哪些路线与风险必须保留。只增加有限查询也不保证比关卡修改更便宜，需在后续阶段记录新增内容的维护成本。

**实际验证范围：** 公开作者原文、官方补丁与固定源码／许可静读；未播放嵌入视频、运行游戏、Unity／UE、模型或玩家实验，未测可控性、最佳偏移或 AI 净收益。结论不依赖引擎专有 API，不给两引擎编造等价配置。

## 听点补比：镜头改变时从哪里听

核实：2026-10-15 UTC。[研究] 本节补运行时世界声的听点选择；既有持续声章节讨论可听范围与恢复，音频资产页讨论音乐选曲／切换，05讨论取景与相机历史，均不能代替这个选择。只补现有音频配置，不新增监听管理框架。

### 视口与角色附近都有成立的条件

| 依据与证据等级 | 可改变的选择 | 反例与边界 |
|---|---|---|
| [一手] Factorio 作者在 [FFF-332](https://www.factorio.com/blog/post/fff-332)（2020-01-31）说明默认听点移到屏幕中心，便于地图视图，并调整缩放／衰减 | [研究] 管理或远程操作可优先让正在操作的视图有声音，而非固定在角色身体 | 身体附近的声音也可能因此变远；不能把管理游戏经验泛化成近身动作的默认值，也不能由旧博客推断当前全部参数 |
| [一手] NieR:Automata 开发者在[声学说明 Part 2](https://www.platinumgames.com/official-blog/article/10027)（2019-01-18）说明，多种视角下默认把听点放在角色附近；舞台等场景另改听点，并对交接作插值 | [研究] 镜头经常拉远／换视角而交互仍围绕身体时，可先保持近身声音稳定；远处演出再局部交接 | 这是非独立游戏的相反选择，只反证“听点必随相机”。不推荐单人复制其 Wwise 工程、多套预设或制作规模；远处展示仍可能需要例外 |

[一手] Factorio 官方 [2.1.21 更新](https://forums.factorio.com/viewtopic.php?p=705355)（2026-10-06）又修复了退出 remote view 时过强的多普勒效应。该完整公告证明视图交接确实有后续维护成本，没有公开这里的修复算法，不能声称其做法就是将速度清零；本轮也未核该版本当前处于哪个发行通道。[研究] 切镜／传送不应无意变成听者高速移动，但是否保留有意的运动音高效果仍由玩法决定。

### 固定源码：位置、朝向、速度是不同输入

[一手] Overgrowth 固定提交 `245fe4828631c84c0023d29d1525f5716ccb6106` 提供另一种 3D 动作实现：

- [玩家镜头脚本](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L11179-L11188)在 focused_character 分支把相机位置、朝向／上方向和零听者速度传给 `UpdateListener`；[Camera::GetPos](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Graphics/camera.cpp#L153-L155)包含追踪距离偏移，不能把它当角色中心
- [对白镜头](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/dialogue.as#L1180-L1189)取得控制时同样传零听者速度；[自由镜头](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/cam.as#L317)却传入 `vel`，并非所有模式都归零
- [脚本转发](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Scripting/angelscript/asfuncs.cpp#L1953-L1955)及同文件 L2069 的注册通向[音频接口](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Sound/sound.cpp#L116-L120)，分别设置 listener position、velocity、orientation

[研究] 可借的是按模式明确这三项输入，而非把听者速度自动等同相机位移差。源码没有解释作者全部意图，也没有证明这种听点更好；零听者速度不等于声源速度归零，更不等于所有多普勒均关闭。声像的原点与朝向都重要，“角色位置＋相机朝向”不等于“角色算距离、相机位置算方向”。

[一手] 固定 [README](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/README.md)／[LICENSE](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/LICENSE)说明代码除另注外采用 Apache-2.0；游戏美术／关卡不随代码开放，原资产分发需明确书面许可。[研究] 只借机制，不移植自研引擎或商业资产；实际复制代码仍核文件及依赖声明，保留许可、版权与修改说明。

### 原生入口够先选听点，不保证跨引擎分离声像和衰减

- [一手] Unity 6.3 [AudioListener](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioListener.html)默认在主相机，官方也建议按游戏尝试相机或角色；场景只应有一个正常工作的 listener，混响区亦以听者位置影响听到的声音。[研究] 先移动／定向这个听点，不用两个同时激活的 listener 做过渡；这份文档没有承诺可分别指定衰减原点和声像原点
- [一手] UE 的 [SetAudioListenerOverride](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Game/Audio/SetAudioListenerOverride)可通过 PlayerController 覆盖位置／朝向；附着组件时参数是偏移，否则是绝对值。[研究] 进入与退出特殊视图都要交接，不能只设置一次而让后续模式继承旧位置
- [一手] UE 另暴露 [Set Audio Listener Attenuation Override](https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/Game/Audio/SetAudioListenerAttenuationOverr-)。[研究] 本轮官方节点页说明有限，不能据名称保证所有遮挡、混响和距离消费者都使用同一覆盖，也不能给 Unity 编造等价接口；没有确切需求不先增加这种分离

### 成本、撤回与第二次修改

[研究] 改听点后重新检查已有距离衰减和空间效果；不要把全体声音改 2D 或逐个提高增益当坐标政策的补丁。插值也不是一律更好：跨地点平滑可能经过无关区域，硬切则可能突变，按演出选择 cut／blend，不给通用秒数。近身声音失衡就收回到角色附近；远程交互缺乏声音反馈再局部交接，而不是积累全局特例。

[研究] 只预注册实际二改：原版角色跟随镜头增加远程观察或演出后，在同一近处／远处声源场景中检查拉远、转身、切镜、退出及暂停后返回；记录听点位置／朝向／速度与听到的方向、响度、音高。音高异常先核多普勒路径，响度异常先核坐标与衰减，再决定是否改素材。AI 可追模式切换和参数来源；人判断听觉重点与交接是否自然。原生听点可表达模式且交接符合目标即可收工，没有症状不建完整配置图或音频框架。

**实际验证范围：** 公开作者原文、官方更新、引擎文档与固定源码／许可静读；未试听、运行游戏或引擎，未测可辨性、舒适度、性能或 AI 净收益。案例用于选择和反证，不等于本项目听感验证。
