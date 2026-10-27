主线：一／二／三／四；客户端体验、第二次修改与交付
改变的建议：[研究] 首包先保必要玩法内容，再派生合格规格； 图中文字二改先比较生产表示与导出维护，再扩语言； 先复用原生组件，再按具体症状补输入、运动、呈现和资源／平台更新责任；以可控、可读及旧内容兼容判断取舍。 插值成为热点时按观察尺度筛选呈现，保留模拟与入屏所需数据；掉帧先验证固定降采样的收益，再选择动态分辨率或改内容。 重复内容按机械转换、项目参数与专门作者语义分流，不因重复次数自建整套工具。
新证据：2026-10-26 新增官方 Godot 原生应用导出与交付副本消费者、资源过滤反例和 v2／旧 v1 回归（原生发布包消费者节）。[一手／社区] 2026-10-20补发行诊断；接收返工前置实际采集检查、追加SentryUE1.25.0差异，保留旧源码与Factorio／osu证据； 官方契约、固定源码、修复链与不同作者案例支持有条件选择；具体版本、反证和许可见各节，尚无本项目引擎或玩家实测。 2026-10-17补OpenRCT2发行源码／试玩回执与VVVVVV屏外取样修复，不把少处理对象写成已测性能收益。 2026-10-19补NITW语法／本地化链与Yarn声明生成维护反证，历史制作和当前工具能力分开。

# WP10：客户端模块怎样在第二次修改后仍然可靠

证据核实：2026-10-13—15 UTC；动态 UI、模拟输入、本地多人及手柄反馈补核为 2026-10-16 UTC+8，混用边界补核为 2026-10-17 UTC+8；各节保留版本和日期。[一手] 为官方契约／固定源码／作者报告，[社区] 为原帖，[研究] 为推导。原研究未安装付费插件；新加 Godot 原生发布包节单列实际引擎验证，其余旧节不扩大为游戏、引擎、模型、设备或玩家实测；源码与作者数据不等于本项目复现，也不证明本项目性能、体验或 AI 净收益。仓库离线检查、算术核对及特殊验证限制按各节记录区分。建议落点为 [客户端核心模块](../../domains/game-dev/04-client-modules.md)。

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

<a id="addressables4-native-await"></a>
### Addressables 4：单所有者用原生等待，共享引用仍分开管理

**[研究] 🧪 已采用 Addressables 4、加载引用归一个生命周期所有时，先评估原生 `ToAwaitable(token)`；共享消费者保 `Completed` 与共同所有者。** 取代“为了取消只能另加适配器”的隐含选择，不要求稳定旧项目升级，也不撤销上面的 UniTask／旧版本风险与通用代次检查。核实：2026-10-23；未运行 Unity、目标设备或模型。

**当前版本与许可。** [官方 changelog](https://docs.unity3d.com/Packages/com.unity.addressables@4.1/changelog/CHANGELOG.html)将直接 await、token／MonoBehaviour 重载列在 **4.0.0（2026-07-17）**；本次固定 **4.1.1** 包镜像 [`99d59c9`](https://github.com/needle-mirror/com.unity.addressables/tree/99d59c9b2a39024617b347953389ca631517bd2b)，[package.json](https://github.com/needle-mirror/com.unity.addressables/blob/99d59c9b2a39024617b347953389ca631517bd2b/package.json)最低 `unity: 6000.0`，不是 Unity 6.5 专属。[LICENSE.md](https://github.com/needle-mirror/com.unity.addressables/blob/99d59c9b2a39024617b347953389ca631517bd2b/LICENSE.md)为 Unity Companion License、限 Unity-dependent projects；镜像公开不等于 MIT。应通过项目兼容的官方包管理入口使用，不把镜像当另一套加载框架。[一手：官方文档／包源码镜像]

| 当前需要 | 选择与关键约束 |
|---|---|
| 一次加载跟随对象销毁 | `ToAwaitable(this)` 绑定 `destroyCancellationToken`；成功后销毁仍释放，不另叠一份无条件 `OnDestroy` release |
| UI／对象反复 Enable、Disable | 每次 Enable 建新 CTS，对应 Disable 取消并 Dispose；销毁 token 不覆盖仅禁用，取消应在主线程 |
| 多个独立消费者共用一份 handle | 共同所有者保句柄，通过 `Completed` 分发；消费者退出撤自身接收资格，不各自接管同一引用的取消释放 |
| 已有旧包／UniTask／简单协程路径 | 先保现有可用实现；按上一节核适配器版本、身份与收尾，不为统一语法迁移 |

前三行来自[4.1.1 API 契约](https://docs.unity3d.com/Packages/com.unity.addressables@4.1/api/UnityEngine.ResourceManagement.AsyncOperations.AsyncOperationHandle-1.ToAwaitable.html)与[生命周期示例](https://docs.unity3d.com/Packages/com.unity.addressables@4.1/manual/load-wait-asynchronous-async-await.html)，最后一行为选择建议。[一手／研究] `Awaitable` 单次等待与“多个 awaiter 是否各有一份持有引用”是两件事；handle 值复制不会 Acquire。即使每个消费者另有合法持有，也不能据此跳过该版本失败／取消组合验收。

**失败清理不能照搬 `.Task` 模板。** `.Task` 失败可能给默认值或部分结果，需查状态；直接 await 会抛 `AsyncOperationHandleException<T>`。固定 [AsyncOperationHandle.cs](https://github.com/needle-mirror/com.unity.addressables/blob/99d59c9b2a39024617b347953389ca631517bd2b/Runtime/ResourceManager/AsyncOperations/AsyncOperationHandle.cs#L282-L362)在失败时为异常另 Acquire 一份引用；[AwaitableOperationDriver.cs](https://github.com/needle-mirror/com.unity.addressables/blob/99d59c9b2a39024617b347953389ca631517bd2b/Runtime/ResourceManager/AsyncOperations/AwaitableOperationDriver.cs)负责失败／取消时释放调用方引用，已有自动释放监听者时交由它负责。因此 catch 应立即 `e.Handle.Release()`，不留到对象退出才清；不再把旧 `finally { originalHandle.Release(); }` 原样叠上；成功且未绑定有效生命周期 token 时仍由所有者释放。[一手／研究]

**迟到结果仍要验，取消不是网络／加载中止证明。** 上述 driver 对预取消先释放并返回取消；pending 路径额外持有内部引用，以完成／取消仲裁 source；成功后仍保 token 注册供生命周期结束释放。源码解释了职责，但不证明目标包组合、重入或引擎运行已经正确。AI 可据真实包写验收：完成前退出、成功后退出、失败后对象仍存活、Disable 后重开、缓存同步完成、两个消费者只退出一个；分别核结果身份、有效消费者接收与各持有引用的释放，而不是只断言 await 抛取消。[一手／研究]

**探索回执与失败参照。** 本轮按已有缺口续查官方 4.1.1 文档、固定包源码、原 UniTask #649 研究及 Unity Discussions 原帖，未重做通用异步框架排名。[2025-08 作者升级报告](https://discussions.unity.com/t/scene-loading-hang-after-upgrading-from-2021-3-to-6000-0/1680128)描述 Unity 6000.0.55f1 中场景 Awake 内 `WaitForCompletion` 挂起，旧 2021.3 工程能运行；这是不用同步阻塞掩盖异步问题的实际反例，不证明 4.1.1 修复该问题，也不是新 API 的生产采用证明。[社区／研究] 当前最佳生产表现未知；现成实现优先官方单所有者示例，共享场景沿原生完成通知，不新建通用资源管理器。无引擎授权时停在版本源码与验收清单，不以伪实现实验冒充原生验证。

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

<a id="resource-lifecycle-workflow"></a>
## 完整资源生命周期：退出、共享、转场与恢复

**[研究] ✅ 默认让独立消费者各持原生加载引用；只有真正共用一份引用时，才由共同所有者协调退出。**
**[研究] 转场先区分“新资源可用”“新玩法获准运行”“旧场景可放弃”，把返回和失败放进同一交接。**
**[研究] 本轮取代04资源段的接口中心叙述，复用上文P125等待契约；2026-10-24（UTC+8）源码／资料研究，示例未编译、未运行Unity／UE、设备或模型。**

### 1. 原生已经做了什么，项目还需要做什么

| 责任 | 先复用现成能力 | 仅项目能决定的部分 |
|---|---|---|
| 找资源、加载依赖、复用加载操作 | Addressables 的 key／location／provider 与操作缓存 | key 是否是本次要显示的内容，何时拒收 |
| 生命周期等待 | 既有 Completed／Coroutine；4.x单所有者原生等待见上文 | 销毁、禁用、换目标各自是否结束使用 |
| 两消费者 | 每次静态 LoadAssetAsync 获取一份引用；分别归还 | 全局常驻／短暂预览／池对象分别活多久 |
| 场景卸载 | Addressables.LoadSceneAsync／UnloadSceneAsync | 什么时候新世界允许运行、失败返回哪一层 |
| 内存清理 | 对应构建后端、Profiler／Memory Profiler | 允许的并存峰值、有界预留、可牺牲的装饰 |

[研究] 这个划分比“所有请求都进一个全局资源管理器”少一个重复缓存／引用计数层。若项目已有能正确交接的成熟层，保留而非重写；只在需要统一优先级、预算、重试合并或跨界驻留时增加窄协调，不把每种资源都强行包装成相同 Dispose。

**固定源码说明独立获取不是重复下载的同义词。** [一手] 沿用P125的4.1.1包镜像 `99d59c9b2a39024617b347953389ca631517bd2b`：
- [AddressablesImpl.cs L659–705](https://github.com/needle-mirror/com.unity.addressables/blob/99d59c9b2a39024617b347953389ca631517bd2b/Runtime/AddressablesImpl.cs#L659-L705)把加载交给 ResourceManager；[ResourceManager.cs L327–375](https://github.com/needle-mirror/com.unity.addressables/blob/99d59c9b2a39024617b347953389ca631517bd2b/Runtime/ResourceManager/ResourceManager.cs#L327-L375)对 provider／location／类型构造缓存键，命中时增加引用并返回 handle。这里只证明匹配操作的复用，不保证不同目录版本、不同类型、自定义 provider 或已释放后重载仍是同一操作。[一手／研究]
- [AssetReference.cs L516–537](https://github.com/needle-mirror/com.unity.addressables/blob/99d59c9b2a39024617b347953389ca631517bd2b/Runtime/AssetReference.cs#L516-L537)实例方法在已有有效 operation 时返回默认值并报错；多次获取用静态 `Addressables.LoadAssetAsync<T>(assetReference)`，对应[官方入口](https://docs.unity3d.com/Packages/com.unity.addressables@4.1/manual/LoadingAssetReferences.html)。复制 struct、从 `.Result` 存个对象字段，都不是另一次获取。[一手／研究]
- [Completed 契约 L100–107](https://github.com/needle-mirror/com.unity.addressables/blob/99d59c9b2a39024617b347953389ca631517bd2b/Runtime/ResourceManager/AsyncOperations/AsyncOperationHandle.cs#L100-L107)说明已完成操作的新增回调会延至当前帧 LateUpdate。因此先建立本次请求，再注册回调；不要写只对“慢下载”成立的初始化顺序。[一手／研究]

[研究] `IsValid()` 只表示底层操作仍有效，不证明调用者还有未归还的一份引用；两次合法获取的 handle 也可能相等。项目要按取得／转交／归还记录自己那份，不对 handle 值做全局去重。`ReferenceCount` 含框架内部和其他依赖持有，只用于诊断，不能当 UI 订阅人数或决定谁该释放。

### 2. 现成实现与生产反例：借机制，不照抄整个加载器

**现代原生实现是当前默认，历史完整游戏示例只补职责结构。** [一手] [Chop Chop固定源码](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/UOP1_Project/Assets/Scripts/SceneManagement/SceneLoader.cs#L75-L197)用 `_isLoading` 抑制重复入口，加载场景后设置活动场景，再发 `_onSceneReady` 让生成系统启动；[作者架构说明](https://github.com/UnityTechnologies/open-project-1/wiki/Game-Architecture-Overview)把 SceneLoader 放 PersistentManagers。可借的是**存活协调者、串行转场、显式就绪事件**，不是新框架名单。

[研究] 同文件 `UnloadPreviousScene` 发起卸旧后直接 `LoadNewScene`，完成回调直接访问 Result，缺状态失败分支；没有“按返回丢弃新世界并恢复旧世界”的完整路径。因此它不是可直接采用的可恢复转场实现，也不能据它宣称卸旧完成后才载新或已控住峰值。编辑器冷启动还用了 WaitForCompletion，沿用P125挂起反例，不复制为跨版本默认。

[一手] [README](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/README.md)明确2021-12已停止开发、Unity2020.3演示，固定提交日期2022-06-26；[根许可](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/LICENSE)Apache-2.0。本轮只提炼架构、无搬资产；若复制代码需保留通知并核依赖，不将这个旧demo包装成近两年生产最佳实践。

**跨场景保活失败发生在真实开发中，而非只有理论。** [社区／一手：参与者自述] [2024-10至11原帖](https://discussions.unity.com/t/addressable-scene-loses-scriptable-objects-references-when-other-scene-is-loaded/1539023)作者报告常驻UI仍丢ScriptableObject／Sprite；Unity参与者补测 `UnloadUnusedAssets` 后发现Editor与Windows／Android不一致，并引导按handle持有。该案例支持“构建里验依赖寿命”，不证明所有Addressables项目都应改成全常驻，也不采纳帖中“全部资产都必须标Addressable”的泛化答复。[研究]

**为什么不直接缓存结果。** [社区] [2020原帖与作者补测](https://discussions.unity.com/t/should-i-cache-the-asset-returned-from-loadassetasync/807083)讨论重复同key加载和引用计数；作者报告后续调用比首次快，但测法／设备不足以给现代项目数值保证。[研究] 当前默认来自上述4.1.1源码，不依赖旧帖的“0ms”；真有频繁卸载／重载再加短期持有，不把裸 Result 字典当正确保活。

[研究] 最新原生契约、旧完整实现与近两年开发反例各提供不同证据。尚无同任务、同目标设备、近两年已发行独立游戏的公开端到端对照，**当前最高生产表现未知**；这是缺口，不拿厂商示例或作者感受补成实证排名。

<a id="resource-lifecycle-example"></a>
### 3. 可交给 AI 改写的最小例：两个窗口各持一份引用

[研究] 以下为本仓独立编写的**实现起点，未编译／未引擎验证**，不是新库。目标是uGUI Sprite预览；每个窗口一个组件，一个 Image 只由该组件写入。`OnEnable` 获取，`OnDisable` 撤接收资格并清UI，pending请求保留到完成后释放；同key两个组件不会共享同一份释放责任。所有调用在Unity主线程，加载超时／下载重试交现有provider政策；这不是底层网络取消例，也不用于Scene或InstantiateAsync。

```csharp
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.AddressableAssets;
using UnityEngine.ResourceManagement.AsyncOperations;

public sealed class OwnedSpritePreview : MonoBehaviour
{
  [SerializeField] private AssetReferenceSprite asset;
  [SerializeField] private Image target;
  private Request current;

  private void OnEnable()
  {
    if (target == null || asset == null || !asset.RuntimeKeyIsValid())
    {
      Debug.LogError("Preview requires a target and valid asset key.", this);
      return;
    }
    current = new Request(target); // 先建立本次身份，再启动/订阅
    current.Start(asset);
  }

  private void OnDisable()
  {
    Request old = current;
    current = null;
    old?.Close();
  }

  private sealed class Request
  {
    private Image receiver;
    private AsyncOperationHandle<Sprite> handle;
    private bool owns, completed, closed;

    public Request(Image receiver) { this.receiver = receiver; }

    public void Start(AssetReferenceSprite key)
    {
      handle = Addressables.LoadAssetAsync<Sprite>(key);
      owns = true;
      handle.Completed += Complete;
    }

    public void Close()
    {
      if (closed) return;
      closed = true; // 撤资格先于清理；旧请求不再有 UI 目标
      if (receiver != null) receiver.sprite = null;
      receiver = null;
      if (completed) ReleaseOwned();
      // pending 由原生完成委托保住 Request，到 Complete 收尾
    }

    private void Complete(AsyncOperationHandle<Sprite> result)
    {
      result.Completed -= Complete;
      completed = true;
      if (!closed && receiver != null &&
          result.Status == AsyncOperationStatus.Succeeded)
      {
        receiver.sprite = result.Result; // 使用期间继续保引用
        return;
      }
      if (!closed && result.Status == AsyncOperationStatus.Failed)
        Debug.LogException(result.OperationException);
      ReleaseOwned(); // 失败、目标消失或晚到；均只归还自己这份
    }

    private void ReleaseOwned()
    {
      if (!owns) return;
      owns = false;
      Addressables.Release(handle);
      handle = default;
    }
  }
}
```

**怎样接入而不是只粘贴。** [研究] 指定项目实际包、Image和合法Sprite key；确保两个窗口各自绑定不同Image却可指同一AssetReference。先在目标工程编译，给获取／完成／关闭／释放加请求ID和key日志；慢加载A关闭后立刻打开B，断言A不能写B，再让两窗口同时开、只关一个。失败时本例只记录错误并清持有，产品应在当前窗口显示可重试占位，下一次打开／显式重试创建新 Request，不复活旧对象。若 `Start` 在返回句柄之前抛同步异常，调用层记录失败并显示占位；不要尝试释放未取得的句柄。

[研究] 本例故意不在pending Close时release，减少“还要观察的handle已失效”的组合；代价是旧请求至完成仍占持有，频繁打开会积累待完成请求。产品若观测积压，先限并发／合并待处理意图，再按真实包改早释放政策并验回调失效；不是无条件更省内存的实现。它也不使用易复用source的取消适配器，未宣称修复UniTask #649。改成4.x原生等待时须整体替换释放协议，按上文失败异常与token契约处理，不能只把 Complete 改成 await。

**已有一份共享handle怎么补。** [研究] 让唯一共同所有者持原引用，消费者只拿可撤销订阅或借用凭证，不向消费者暴露 Release。记录活跃订阅和可用结果；一个退出只撤自己。最后一个退出后，若尚pending由所有者收尾；若已成功且无其他保留政策则释放。逐个分发前重新检查订阅资格，并在调用业务回调前提交内部状态，处理回调同步关闭另一窗口的重入；晚订阅者应走同一资格检查。只有要把使用期真正分离给新所有者时才另Acquire，并明确这份由谁还。这个小协调不替代原生缓存，不缓存共享Awaitable供重复await。

### 4. 转场实施表：失败后回哪里，必须先决定

[一手] [4.1.1场景文档](https://docs.unity3d.com/Packages/com.unity.addressables@4.1/manual/LoadingScenes.html)说明其底层是SceneManager；`activateOnLoad=false`阻异步队列直至激活，Single卸当前场景并调用UnloadUnusedAssets。[研究] 因而本表默认Additive＋自动激活，但新关卡从Awake起就不得自行提交玩法副作用；只禁输入远远不够，还要管计时、刷怪、存档写入与事件注册。

| 阶段 | 协调者保存／动作 | 取消或失败处理 |
|---|---|---|
| 请求前 | 目的地、不可变requestId、旧场景引用、恢复点、原输入目标；只接一个运输中的操作 | 预取消不创建新加载；同帧重复入口合并为待处理意图 |
| Prepare | 冻结旧场景玩法输入；保持旧内容可恢复；加载必要依赖并检查完整性 | 旧场景仍在则恢复它；新请求取消只撤接收资格，不假定底层已停 |
| Stage | 新场景可已激活，游戏规则仍未授权；接收对应requestId的场景结果与准备结果 | 成功但已取消的新场景用UnloadSceneAsync；失败句柄按当前API归还，不按成功场景访问Result |
| Commit | 在一次主线程交接中检查代次／目标，再绑定恢复数据、切active scene和输入／镜头目标、启用新玩法 | 这是项目提交边界，不能被旧结果再次触发；数据恢复失败不得先启用新玩法 |
| Retire | 新场景已可运行后卸旧场景，清旧订阅、池和引用；观察卸载结果 | 卸载异常保留待清理状态；核实际Scene状态与剩余持有后决定下一步，不盲用旧句柄重试或重做Commit |
| Return/Retry | 提交前回旧场景；提交后返回是一个新的反向转场，从约定恢复点重建 | 不把重复回调当重复发奖；不能恢复的瞬态状态需明示，而不是只保场景名 |

[一手／研究] **卸载操作和场景加载引用分开记。** 固定[AddressablesImpl L1497–1522](https://github.com/needle-mirror/com.unity.addressables/blob/99d59c9b2a39024617b347953389ca631517bd2b/Runtime/AddressablesImpl.cs#L1497-L1522)默认自动释放返回的卸载operation；要在完成后保留它作诊断，显式`autoReleaseHandle:false`，取完状态后释放该卸载operation。此选项不等于保住原场景加载引用：[SceneProvider L276–321](https://github.com/needle-mirror/com.unity.addressables/blob/99d59c9b2a39024617b347953389ca631517bd2b/Runtime/ResourceManager/ResourceProviders/SceneProvider.cs#L276-L321)收尾另行release场景加载handle，且底层返回null也走完成。检查实际场景是否仍加载、已发生的生命周期事件与持有账，再决定重试／告警；不要拿`Succeeded`或一个已失效句柄证明完全清理。

[研究] Unity场景激活不是项目事务；Awake／OnEnable已发生的副作用不会因Unload自动撤销。若现有关卡无法关闭副作用，先做轻量引导场景和显式启动入口，不能虚构“先加载后提交”已成立。最小字段是本次身份、阶段、旧/新场景操作与资格；操作日志中的身份要来自本次局部请求，不从可变化的 `currentScene` 反推。

**低内存替代不是失败恢复的等价实现。** [研究] 当旧＋新＋共享依赖＋解码／上传临时占用超目标预算，先切常驻小读条壳，确认旧场景卸载结束再载新。壳里保取消／重试／退菜单，旧状态从恢复点重建；无需为“平滑”强留双场景。若先下载依赖再卸旧，它只改变磁盘就绪，不承诺纹理GPU上传／Awake／玩法初始化完成；进度应分别表示下载、场景准备、进入，不把PercentComplete当字节比例或100%可玩。

[研究] 退出读条时若场景加载已经进行，默认仍让其完成并立即卸载；壳和协调者活到收尾结束。若确需停在未激活状态，必须为取消路径提供激活→卸载的可达步骤，且准备激活产生的生命周期回调，不等待已经被它挡住的后续操作。没有这些保证，撤回延迟激活方案。

#### 正常接线补核：载入、Active Scene 与玩法入口

2026-10-26（UTC+8），只补 [04 首版接线](../../domains/game-dev/04-client-modules.md#scene-loading-production)缺少的场景归属接口，不刷新上面 2026-10-24 的等待／共享／生产反例结论。Unity 6.3 [SetActiveScene](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SceneManagement.SceneManager.SetActiveScene.html)明确 Additive 后原活动场景仍保留；活动场景决定默认实例化目标和光照设置，与渲染哪些场景无关，未载入时返回 false。[MoveGameObjectToScene](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SceneManagement.SceneManager.MoveGameObjectToScene.html)只迁移根对象到已加载场景；[GetRootGameObjects](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SceneManagement.Scene.GetRootGameObjects.html)给出该场景的根对象入口。因此“新场景加载成功”不能代替运行对象归属与公共镜头／输入的绑定。[一手／研究]

本次实现建议让启动壳独占协调和公共表现，每关作者源提供唯一 SceneEntry、出生点与关闭的 GameplayRoot（含本关渲染／碰撞／玩法）；准备阶段显式安排对象归属／恢复数据，提交阶段切 Active Scene、交接当前世界并启用规则。上述名字是项目语义，不是 Unity API；普通场景激活产生的 Awake 等副作用仍须由内容作者控制。首版角色随关卡重建，二改跨关角色时将实例与依赖持有共同移交常驻所有者；不把移动 GameObject 误认为 AssetBundle 引用也已移交。[研究]

Addressables [2.9.1](https://docs.unity3d.com/Packages/com.unity.addressables@2.9/manual/LoadingScenes.html)与[4.1.1](https://docs.unity3d.com/Packages/com.unity.addressables@4.1/manual/LoadingScenes.html)均描述 Additive／activateOnLoad 参数和延迟激活阻塞队列；本模块保已安装、兼容的包，不为接线迁移。几何／光照、首帧、实例归属、取消恢复及双关峰值都未在 Unity／UE 中实测；新的六步表是将已有交接实施表落到作者和消费者入口，不是可直接导入的已验证框架。[一手／研究]

### 5. 持有正确之后，再决定驻留与构建后端

[一手] [4.1.1卸载文档](https://docs.unity3d.com/Packages/com.unity.addressables@4.1/manual/UnloadingAddressableAssets.html)区分场景资源与独立加载资源；DontDestroyOnLoad不代替加载引用。[研究] 把需要常驻的玩家／UI依赖单独获取更容易控制保活范围；Acquire整个场景可作为明确选择，但可能把不再需要的依赖一起留住。不是按对象挪到新Scene就自动迁移了资源所有权。

[一手] [4.1.1内存文档](https://docs.unity3d.com/Packages/com.unity.addressables@4.1/manual/memory-assets.html)区分AssetBundle与content directory：前者的卸载受整包持有影响，后者可按资产释放，但目录注册持续至系统关闭。文档同时说明引用归零与内存观察不同、反复最后释放又重载会产生churn。[研究] 因而取三份证据：本项目获取／释放账、框架资产和依赖驻留、设备真实内存峰值。只看“handle有效”“ReferenceCount=0”或托管GC，均不足以证明没有遗漏／预算已守住。

[一手] [构建系统选择](https://docs.unity3d.com/Packages/com.unity.addressables@4.1/manual/content-build-systems.html)将content directories限定Unity6.6+，目前只支持本地内容；远程、内容更新或旧Editor走AssetBundles。允许既有本地＋远程混合，但共享依赖可能重复构建，因此默认选一种。[研究] 这是原生新能力影响卸载颗粒度，不是本轮推荐迁移的性能实证；已发布AssetBundle项目先修持有与分组，只有目标版本与内容发布要求匹配再比较后端。

**UE不照搬Unity每次Load对应一次Release。** [一手] 2026-10-24补核[LoadPrimaryAssets](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAssetManager/LoadPrimaryAssets)／[PreloadPrimaryAssets](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAssetManager/PreloadPrimaryAssets)仍为上述不同契约；无新工作返回null也可能完成。[研究] 共同拥有者管理PrimaryAsset集合与卸载时机，消费者撤资格仍需本次身份；不要把Load的句柄析构当资产卸载，也不要把Preload仅调用Unload当清理。回调取消问题沿用UE-207209版本证据，不把目标修复版本写成已解决。

### 6. 怎样判断做完，以及何时撤回

[研究] 先在真实目标工程完成四种路径：慢加载退出、缓存命中退出、共享只退出一个、切场失败返回再重试；再增加同帧退出/完成和第二次需求“预览变常驻／池化”。验每份业务持有最终释放一次、结果与requestId一致、提交最多一次、输入与镜头只指当前世界、读条可离开。对于场景卸载和实例释放记录各自类型，不把总Release次数当全部验收。

[研究] 冷启动、目标Player、断网／失败注入和正常缓存往返应分报；内存没有业务持有但高水位稳定，先解释后端与缓存，不直接判泄漏；若反复往返仍增长则定位未清订阅、池、Acquire与跨场景强引用。工程内真断网等操作由项目授权环境执行，本轮仅交检查设计，不新增CPU替身或伪引擎测试。

[研究] 撤回条件：原生独立引用已够用就不加共享管理层；每次返回都立刻重载且产生实测churn才保小范围有界缓存；双场景超峰值改读条壳；原生4等待与现有版本不兼容就保Completed／原有异步；新后端不满足远程发布则保AssetBundles。若新方案增加状态分支却未改善读者的退出、共享或恢复能力，缩回原生加最小项目语义。

**探索回执。** [研究] 截止2026-10-24（UTC+8），按缺口读Unity4.1.1官方／固定源码、Epic公开API、Unity Discussions原帖与Chop Chop加载器；复用P125版本审查。缺同任务近两年发行案例和引擎实测；下一步在获授权工程走完整流程，以镜头／输入协作验Commit，不另扩探针。

## 3. ink：存档格式兼容，不等于剧情修改兼容

[一手] `inkle/ink@35c63e52f1d36060930dc7ed3cfba38ea224b528`，commit API 2026-05-05，1.2.1；MIT [LICENSE](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/LICENSE.txt)。已读 StoryState／Story／CallStack／VariablesState。

- [StoryState.cs](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/ink-engine-runtime/StoryState.cs)明确当前 save 版本 10、最低可读版本 8；LoadJsonObj 检查字段／最低版本，分别处理旧单 flow 和新 flows 结构。[一手]
- [CallStack.cs](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/ink-engine-runtime/CallStack.cs#L52-L83)使用存档 cPath 和 idx 恢复位置，找不到抛错，近似查找会报警；[Story.cs](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/ink-engine-runtime/Story.cs#L753-L782)的 PointerAtPath 同样有 approximate 警告路径。[一手]
- **改变建议**：[研究] 捕获 LoadJson warning，核位置、选项及已领奖励；可用稳定节点／checkpoint 迁移，任意保存点兼容与章节回退须另定。
- ink 只作叙事状态机，不为非叙事游戏引入通用存档。未核发行游戏可靠性，The Intercept 旧 jam demo 不作现代底座。

<a id="native-save-consumer"></a>
## 存档原生采用：显式字段与自动场景恢复的实际取舍

**结论仍是小进度保显式 DTO；需要场景对象图才试现成库，并把新局默认与旧玩家状态分开。** [04 正文](../../domains/game-dev/04-client-modules.md#native-save-consumer)和[原生复现](../../experiments/native-save-adoption/README.md)补齐原存档章的消费者，不自建平台。[研究／实测]

比较了官方 Godot serialization demo（固定 `4.7-6ad6167`）、Fern Forest Games 的 SaveKit（MIT，固定 `9ca2dabdfd24712a2ad60b76d0a04e5a981b6e4a`）、现成 slot 路线及原 Unity JsonUtility／UE SaveGame。官方 demo 显式写玩家状态和敌人集合；SaveKit 的现成 demo 包含可交互对象、共享序列化接口、资源与原 UI，适合检验自动恢复的代价。CodingQuests 的[slot 示例](https://github.com/CodingQuests/godot-save-system)也明确节点路径身份、动态对象不自动恢复和单场景限制；本次只读未运行，不据其“atomic”介绍推导断电保障。SaveKit 也不以低样板量或新颖性取得通用默认，独立生产采用与行业最高水平未知。[源码／研究]

**正常链先过。** 官方 JSON demo 原保存按钮写盘；新进程原加载按钮恢复玩家位置、血量 63、血条 63、剩余敌人 2，并能继续移动。SaveKit 原 demo 经原交互回调获得红框计数 2、位置变化、笔记、蓝框移除；原 SaveManager 落盘、新进程恢复这些状态，随后红框计数可到 3，重载原档又回 2。并未用 Python 重建场景或只比较 JSON。[实测]

**真实二改反例。** SaveKit `SaveKitResource.save_to_dict` 默认省略等于脚本默认值的字段：原绿框计数 0 未写，红框 2 已写。把 `BoxData.click_count` 的新局默认改为 1 后，原加载 API 仍返回 OK，旧绿框和真实标签却变 1；接收器只将这两条进度／呈现失败记作预期反例，其他错误不放行。项目层沿已有 `load_from_dict`，在原解码前设置唯一旧版本的缺值含义，再沿 `save_to_dict`／原 `encode_var` 显式保存活状态，旧档绿 0／新局绿 1 均恢复；续存红 3、绿 0 都有明确记录，原档摘要和插件核心逐文件摘要保持。[固定源码／实测]

初次适配曾把裸 `int 0` 塞到编码字段字典，真实 `JSON.to_native` 拒绝。最终修正是设置资源的旧业务默认后让原 codec 解码，不修改 serializer、不把 JSON 字段和值类型凭想象拼出来。该窄适配只有一个历史版本；正式游戏仍沿原章 schema／content 迁移。SaveKit 自己的 JSON `version` 是编码格式版本，不能因此声称内容升级已经处理。[实测／研究]

**快照语义不是持续世界政策。** 固定 `save_manager.gd` 会删未载入的 `saveable` 节点；`deserializer.gd` 仍用 NodePath 定位。这对恢复当时快照有用，但新增摆放物／移动父节点必须按项目政策处理。官方小示例也只恢复选定字段；不要为了接一次插件反过来扩大玩家承诺。[源码／研究]

[Godot Forum 原帖](https://forum.godotengine.org/t/keeping-old-save-files-working-after-scene-changes/128831)（2025-11）报告节点改名／路径变化后旧档失效，回复建议版本／映射；其中把资源 UID、节点唯一名与所有实例身份混说的部分不采纳。[近期 Reddit 发布 demo 开发者](https://www.reddit.com/r/godot/comments/1x27hhy/save_file_versioning_after_release_how_do_you_do/)询问嵌套农业存档的改名／结构更新，评论有逐版本迁移、备份与结构检查的实际用法，也有失败后当无存档且未提示的缺口。它们支持“正常恢复后继续操作、保原档、明确迁移结果”，不证明某个插件已包办这些步骤。[社区原文]

**探索回执与范围。** 2026-10-26 实读官方文档／完整 demo、SaveKit 固定实现／demo／许可、slot 项目原文和上述原帖；中文 linux.do／V2EX 搜索及开发日记原页未找到足够具体的存档采用证据，不用无关帖子凑结论。原生 Linux headless 两条消费者与二改通过；可选上游 GUT 套件、目标包／硬件、恶意存档、断电恢复、云存档未在本次验证。素材保原通知，未重分发引擎／字体或使用真实玩家数据。

来源：官方 [保存游戏](https://docs.godotengine.org/en/4.7/tutorials/io/saving_games.html)、[完整 serialization 源码](https://github.com/godotengine/godot-demo-projects/tree/6ad6167/loading/serialization)；固定 SaveKit [资源保存](https://github.com/fernforestgames/godot-savekit/blob/9ca2dabdfd24712a2ad60b76d0a04e5a981b6e4a/addons/savekit/resource.gd)、[管理器](https://github.com/fernforestgames/godot-savekit/blob/9ca2dabdfd24712a2ad60b76d0a04e5a981b6e4a/addons/savekit/save_manager.gd)、[反序列化](https://github.com/fernforestgames/godot-savekit/blob/9ca2dabdfd24712a2ad60b76d0a04e5a981b6e4a/addons/savekit/deserializer.gd)。官方 archive 摘要与运行入口见实验；旧资料核实日保持。

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
| 暂停＋UI＋音频 | 按住移动／蓄力时暂停，手柄换设备，失焦再回来 | 失效输入不续执行、无“幽灵攻击”；持续值与已提交命令按玩法恢复，UI可导航，音频／DSP按各自政策 | 保输入权限切换顺序、同步canceled重入与独立时间域；恢复政策见[输入交接](wp10-content.md#21)，多来源暂停见[持有与转场](wp10-content.md#28) |
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

核实：2026-10-14 UTC；2026-10-25 UTC 补采集开销、线程／等待、内存快照、发布构建与二改路径。主线 3／4；默认跟随项目锁定的 Unity 6000.3（URP）与 UE 5.8，不把编辑器／玩家构建、Unity／UE 的同名标记当同一机制。依据 Unity 6.3 Profiler／Memory Profiler 1.1.11／FrameTimingManager 文档、UE 5.8 Insights／Trace 文档及既有 PSO／加载／池资料。[一手／研究]

<a id="native-script-profile"></a>
### 原生脚本采样：让 AI 从真实报告判断，而不是从代码猜热点

**选择：先接已有官方 Profiler；本例采用本地脚本报告，不新增采集平台。** [04 正文](../../domains/game-dev/04-client-modules.md#native-script-profile)和[原实验的可选采样](../../experiments/godot-export-adoption/README.md#脚本采样把实际回合交给官方-profiler)给出实际入口。[研究／实测]

| 方案 | 适用与本次取舍 |
|---|---|
| 引擎已有 GUI Profiler／Unity Profiler／UE Insights | 正常开发优先，能按帧看脚本、线程与其他子系统。Godot 官方脚本 Profiler 当前不支持 C#；不要把 GDScript 入口套给 C# |
| Godot 官方 local debugger＋脚本采样 | 本次实际采用；4.7.2 debug 应用无需另开 Editor 窗口、网络接收端或自建解析协议，输出函数路径／行号、total／self／调用数。用于脚本归因，不是 GPU 或完整 CPU 时间轴 |
| Tracy | 引擎内部／线程问题再接；官方路线需带 `profiler=tracy` 与匹配 Tracy 的自编模板，采样还涉及符号。本次未编译／运行，不为几份脚本重建引擎 |
| 官方 godot-benchmarks | 适合引擎版本／固定基准对照，已有命令行 JSON 输出；不是当前游戏同一次操作的归因，本次不跑全套来替玩法结论 |
| ForeverVirus/GameAnalytics | 中文作者提供静态图谱与 AI 分析，原帖明确 Godot 当时尚无真机采集；当前 README 的运行采集入口仍写 Unity、正式桌面平台为 Windows。只读未试用，不把“识别 Godot 工程”当原生性能采样已接通 |

**实跑揭示两种空结果。** 原交付 debug 包只加 `--profiling`：原回合 exit 0，但没有 BEGIN。固定 `main.cpp` 只有 `--debug` 设置 `local://`，且在调试器活跃时才开启 profiler。补齐后有 BEGIN，却在快速退出时只得到空累计。`LocalDebugger` 每隔至少一秒输出当帧样本；最终累计遍历仍存活的 GDScript 函数，而主循环先销毁场景，再关闭 debugger。当前加速回归不到一秒，因而退出成功／出现标题都不能证明有效采样。[固定源码／实测]

项目已有探针在完成重开接收后、清理声音与销毁前停止 `scripts` profiler，保原四脚本／场景不变；源工程先得真实函数，随后同样接线在新导出的 v1／v2 debug 应用通过。应用仍从交付目录正常入口运行，非 Editor 加载 PCK。消费者要求 BEGIN、正累计和两项玩法函数非零调用，原空采样日志保留。[实测]

**按原因读报告。** 最终两包 `player._process` 均 406 次，原刷怪回调 2→5 次，与波次间隔二改一致。报告还包含 `delivery_probe.frames` 的 415 次调用，不能把测试驱动当游戏需要消除的热点；当前正在执行的收尾回调尚未完整计入，停止点后的清理也不在采集范围。`ACCUMULATED.total` 来自各脚本 self 之和，函数 total 则包含子调用，所以百分比可重叠。该例没有目标机掉帧证据，结论是保原玩法实现、拿这条采样链去核真实症状，不报告“优化了多少”。[源码／实测／研究]

**探索回执。** 2026-10-26 读官方 4.7 Profiler／EngineDebugger／Tracy、固定引擎实现、godot-benchmarks README及[中文作者原帖](https://linux.do/t/topic/1891455)与其[项目 README](https://github.com/ForeverVirus/GameAnalytics)。中文作者有成本动机与Godot能力限制，回复只有支持，不能算独立生产效果；两个 Reddit profiler 反馈页分别未取到正文／仅返回页面框架，不据摘要形成结论。未安装上述第三方工具；当前最高行业性能水平未知。真实验证仅覆盖本例脚本采集与内容二改，非 GPU、目标硬件性能或本仓游戏采用。

来源：官方 [Profiler](https://docs.godotengine.org/en/4.7/tutorials/scripting/debug/the_profiler.html)、[EngineDebugger](https://docs.godotengine.org/en/4.7/classes/class_enginedebugger.html)、[Tracy](https://docs.godotengine.org/en/4.7/engine_details/development/profiling/tracy.html)，固定 4.7.2 [LocalDebugger](https://github.com/godotengine/godot/blob/4.7.2-stable/core/debugger/local_debugger.cpp)、[GDScript](https://github.com/godotengine/godot/blob/4.7.2-stable/modules/gdscript/gdscript.cpp)、[main](https://github.com/godotengine/godot/blob/4.7.2-stable/main/main.cpp)，[官方 benchmarks](https://github.com/godotengine/godot-benchmarks)。Godot MIT 许可沿原实验；核实 2026-10-26，不刷新下面旧证据日期。

### 1. 先定义要保住的动作，再选择把工作移到哪里

[研究] 首次进房／技能应分别准备资产、实例、上传与绘制；输入缓冲、插值和池化各不能兜底 PSO。只准备下一遭遇必要内容，关键预警与伤害保持一致；装饰可降级，必要时明确延后遭遇。

[研究] 用四个项目建议语义标记串正常遭遇：`PrepareEncounter`（选内容、读盘／加载、初始化、上传准备）、`ActivateEncounter`（提交状态、首个可见／可操作反馈）、`SpawnWave`（每波实例化与 AI／导航注册）、`ReleaseEncounter`（离场、释放、回池、卸载）。它们不是 Unity／UE 内置 API；标记只圈真实工作边界，先四个够用，证据指向某段再嵌子标记。

[研究] 四个名称同时标识阶段语义，不等于用一个 CPU scope 圈完整异步过程。CPU scope 只包同步片段，退出／异常成对关闭；异步加载开始到完成、激活到首可见／可操作、卸载完成，用已有阶段身份关联时间或帧号并对齐原生时间轴。Unity 的 `ProfilerMarker`（含 `Auto()`）不支持跨 `await`／`yield`，UE 作用域计时也只测当前作用域；经过时间与实际 CPU 工作分报。[一手：[Unity 添加标记](https://docs.unity3d.com/6000.3/Documentation/Manual/profiler-add-markers-code.html)]

**API 与构建差异。** [一手] Unity 6000.3 的 [ProfilerMarker](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Profiling.ProfilerMarker.html) 用 `Begin`／`End` 或 `Auto()`；`Begin`／`End` 带 `ConditionalAttribute`，在非 Development（Release）构建中被条件编译掉；`Auto()` 调用本身不能移除，但不产生采样，保留少量开销。UE 5.8 [Trace 开发者指南](https://dev.epicgames.com/documentation/en-us/unreal-engine/developer-guide-to-tracing-in-unreal-engine?application_version=5.8) 的 `TRACE_CPUPROFILER_EVENT_SCOPE` 家族把一段 C++ 作用域记成 Timing Insights 的命名计时；trace channel “默认关闭，必须显式开启”；动态字符串名比静态名多 CPU／内存开销；Trace 关闭时宏编译为空。[研究] 两端都先写清版本、构建类型、平台、图形 API、管线、画质、分辨率、冷缓存；不能把 Editor／Player、Development／Shipping、Unity／UE 的同名标记当同一机制。

#### 1.1 采集条件与采样开销

| 采集方式 | 已核语义 | 选择条件与开销 |
|---|---|---|
| Unity CPU Usage | [一手] [CPU Usage module](https://docs.unity3d.com/6000.3/Documentation/Manual/profiler-cpu-introduction.html)：CPU Usage “始终启用”；Timeline 默认，把“所有线程放在同一时间轴”；Hierarchy 一次一个线程；Inverted Hierarchy 按标记聚合、看许多小样本累计。 | 先做基线；Timeline 看线程关系，Hierarchy／Inverted 看调用与累计。Record 时该模块始终采集，关闭窗口也仍在；文档未给开销数值。 |
| Unity GPU Usage | [一手] [Profiler window](https://docs.unity3d.com/6000.3/Documentation/Manual/ProfilerWindow.html)：“默认不启用，因为开销高”。 | 只在 GPU 假说需要证实或比较档位时短开；不能一直开着跑基线。 |
| Unity Deep Profile | [一手] [CPU Usage module](https://docs.unity3d.com/6000.3/Documentation/Manual/profiler-cpu-introduction.html)：“记录这些样本开销高”；深采给每个 C# 方法加检查，开销还会记到调用者。 | 只在已经缩到短复现的热点用；不拿深采的全帧时间当优化前后对比。 |
| Unity 自定义标记 | [一手] `ProfilerMarker` 是“最高效的 profiling 方式”，比 `Profiler.BeginSample` 少传字符串；Release 移除 `Begin/End`；`Auto()` 保留少量开销但不采样。 | 开发构建定位；发布复核改用计数器／帧计时。 |
| Unity ProfilerRecorder | [一手] [ProfilerRecorder](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Profiling.ProfilerRecorder.html) 记录 marker 或 counter；可在 Editor 和 Player builds“包括 Release Players”；分配非托管资源、实现 `IDisposable`，容量有界，`WrappedAround` 表示溢出。 | 发布包长时间低开销观察内置计数器；记得 `Dispose`，不要把它当无成本日志。 |
| Unity FrameTimingManager | [一手] [FrameTimingManager](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/FrameTimingManager.html) 提供帧级 CPU／GPU 时间；Development Player 常开，Release 需开 Frame Timing Stats 或附着 ProfilerRecorder；固定延迟四帧；Linux OpenGL／WebGL 无 GPU 时间；Metal 上 GPU 时间可能大于整帧。 | 发布构建的主要帧时间复核；报告延迟、平台缺项和 TBR 语义，不能当逐帧即时值。 |
| UE Timing Insights | [一手] [Timing Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/timing-insights-in-unreal-engine)：CPU／GPU 按线程分轨；事件宽度表示该线程处理时间；Callers／Callees 给调用关系；`ContextSwitch` 通道显示 CPU 核心上下文切换，`Task` 通道显示前提任务与后续任务。 | 先看线程与依赖；等待／阻塞要结合切换到哪个线程，不把事件宽度直接当函数 CPU 成本。 |
| UE Memory Insights | [一手] [Memory Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/memory-insights-in-unreal-engine)：记录每次分配／重分配／释放，重建使用；含 LLM tag 与 callstack；memory channel“必须从进程开始就激活”；LLM track 在会话开始数秒后才开始、按帧粒度；callstack 需 `.pdb`／`.elf` 等调试信息。 | 内存增长用全程 trace；短时快照不足以覆盖启动后数秒才开始的 LLM 轨迹。 |
| UE Asset Loading Insights | [一手] [Unreal Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine)：使用 `AssetLoadTime` trace channel，覆盖按资产类型的细节、包加载顺序、异步加载优先级检查与轨道过滤。 | 首次进房／首次技能加载路径；与 Timing Insights 同 trace 看线程。 |
| Memory Profiler 快照 | [一手] [Memory Profiler window](https://docs.unity3d.com/Packages/com.unity.memoryprofiler@1.1/manual/memory-profiler-window-reference.html)：捕获 Managed Objects／Native Objects／Native Allocations；捕获可能“数秒，取决于应用大小”；Editor 快照总含编辑器内存，最终应看 Player；不同会话快照“不一定完全准确”。 | 往返内存用等价状态快照；快照本身改变内存与时间，固定取点，不用它做帧时间对比。 |

[研究] 采样条件至少包括：引擎与包版本、平台与图形 API、管线与画质、分辨率与实际刷新率、VSync／限帧、Development／Release、冷／热缓存、场景与玩家输入。先粗粒度模块定位，再对短时复现开深采或 GPU 模块；比较前后保持同一采集方式，不拿带 Profiler 的数和不带的数直接比。官方页没有给这些开关的统一开销数值，不能编一个百分比。

#### 1.2 线程、GPU 与等待

[一手] Unity 6000.3 [Profiler markers reference](https://docs.unity3d.com/6000.3/Documentation/Manual/profiler-markers.html) 对常见标记的语义：

| 标记 | 文档语义 | 不能据此下结论 |
|---|---|---|
| `WaitForTargetFPS` | 应用等待 `Application.targetFrameRate` 目标的时间；若为 `Gfx.WaitForPresentOnGfxThread` 子样本，表示等 GPU／VSync。Editor 用该标记模拟 VSync；Android／iOS 可能强制 VSync 或 30／60 上限。 | 不是应用在耗 CPU；Editor 与 Player 不可直接类比。 |
| `Gfx.WaitForPresentOnGfxThread` | 主线程已准备开始下一帧，但渲染线程尚未完成等待 GPU present；“可能表示应用 GPU-bound”。 | 不是主线程函数本身费时；不要用主线程优化解 GPU 瓶颈。 |
| `Gfx.WaitForCommands` | 渲染线程已准备接收新命令；“若看到该标记，可能表示主线程瓶颈”。 | 不是渲染线程在忙。 |
| `Gfx.WaitForRenderThread` | 多线程渲染下，主线程等待渲染线程处理完命令。 | 等待时间不能直接算给某个渲染函数。 |
| `Gfx.PresentFrame` | 应用等待 GPU 渲染并 present 的时间，包含等待 VSync。 | 不是可再加一次的 CPU 时间。 |
| `Semaphore.WaitForSignal`／`JobHandle.Complete`／`WaitForJobGroupID` | 线程同步点／JobHandle 同步栅栏；文档明确这些多线程标记“不测量消耗的 CPU 周期”，只表示同步与 Job System 信息。 | 不是该函数在耗 CPU；要看同刻真正工作的线程。 |
| `Physics.Processing` | 主线程等待物理模拟完成；对象少时也可能反映 worker 在做其他系统的任务（job stealing）。 | 不一定是物理求解重。 |
| `GC.Alloc`／`GC.Collect` | 托管堆分配／垃圾回收样本；Timeline 中 `GC.Alloc` 用红紫色表示分配大小。 | 零分配不等于低驻留；关 GC 不是修复。 |

[一手] UE 5.8 [Timing Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/timing-insights-in-unreal-engine) 把 CPU／GPU 按线程分轨，事件宽度是“线程处理它的时间”；`ContextSwitch` 提供 CPU 核心上下文切换显示，`Task` 提供任务及其前提／后续任务。[研究] 同名的“等待”在两边不是同一机制：Unity 的 `Gfx.WaitForPresentOnGfxThread` 与 UE 的 Game／Render／GPU 轨道不能按名字对齐；先读各自线程模型，再比较。

[研究] **CPU 与 GPU 不能简单相加。** 60 fps 的 16.67 ms 是整帧；game／render 线程与 GPU 可并行，主线程等待 GPU 的时间不是可再加一次的 GPU 时间。Unity 官方还说明 Metal 的 tile-based deferred rendering 可能让 GPU 时间大于整帧，Linux OpenGL／WebGL 干脆没有 GPU 时间。等待样本、同步点和 `Idle` 表示“没在做有用工作”或“等另一线程”，不等于该名字对应的函数消耗了同等 CPU。用线程时间轴、每帧分布和同条件重复来判断，不用一帧样本相加。

### 2. Unity 6.3 原生选项与不能互换的承诺

- [一手] [PSO introduction](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-pso-introduction.html)：GraphicsStateCollection 自 Unity 6，6.3 仍 experimental 可变／移除；DX12/Vulkan/Metal 用图形状态，DX11/OpenGL/OpenGLES/WebGL 回退 warmup；不兼容 compute／ray-tracing tracing。
- [一手] [Other warmup methods](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-prewarm-other.html) 不推荐 DX12/Vulkan/Metal 用旧 WarmUp／WarmupAllShaders，缺 graphics states 可建错 PSO；变体名单不代表绘制状态覆盖。[研究]
- [一手] [Trace and manage](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-pso-trace.html) 要按平台／API 采集，改 shader 后可追加 trace。[研究] 新画质／keyword／pass 需补覆盖，ContainsVariant 不证明实际状态齐全。
- [一手] [裁剪说明](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-variant-stripping.html)：裁掉变体可回退近似，运行时 shader_feature 亦有遗漏；[严格变体匹配与构建日志](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-how-many-variants.html#highlight-missing-shaders) 暴露缺变体／keyword 及裁剪过程。[研究] 二改先在目标后端严格匹配测试修入包，再补 PSO；预热补不回代码，无错也只覆盖执行组合，冷首发另测。
- [一手] [Warm up PSOs](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-prewarm.html) 提供 WarmUp／WarmUpProgressively（按 PSO 数量）并回 job handle；定位 marker 为 Shader.CreateGPUProgram／CreateGraphicsGraphicsPipelineImpl。[研究] 数量非毫秒保证，战斗同步等仍可卡；首次创建确为热点且加载成本可接受才采用。
- [一手] [Application.backgroundLoadingPriority](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-backgroundLoadingPriority.html) 分后台读／反序列化与主线程 integration，Editor 不生效；Low/BelowNormal/Normal/High 为 2/4/10/50 ms，可看 Application.Integrate Assets in Background。非整帧或全部初始化上限，High 读条快不保证游玩适合。[研究]
- [一手] [Texture and mesh loading](https://docs.unity3d.com/6000.3/Documentation/Manual/LoadingTextureandMeshData.html) 将 binary 上传跨帧；[资格页](https://docs.unity3d.com/6000.3/Documentation/Manual/LoadingTextureandMeshData-make-compatible.html)：纹理非 read/write、非 Resources，Android 要 LZ4；LoadImage 强制同步，网格另有 bone weights／BlendShapes 条件。[asyncUploadTimeSlice](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/QualitySettings-asyncUploadTimeSlice.html) 只调上传，非 backgroundLoadingPriority。[研究] 不为资格删玩法 CPU 数据／形变，先权衡提前加载或降规格。
- [一手] [allowSceneActivation](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AsyncOperation-allowSceneActivation.html)=false 时停 0.9、isDone=false 并阻 AsyncOperation 队列，随后卸载也不能运行。[研究] 不能等队列后卸载腾内存再激活；计入旧场景／新数据／预热并存峰值，激活门不分摊 Awake/OnEnable。

#### 2.1 加载关键路径：IO、解码、初始化、上传、首绘

[研究] 首次进房／技能按五段拆，不用一个“加载”标记盖住全部：

| 阶段 | Unity 6.3 可核工具 | UE 5.8 可核工具 | 先改什么 |
|---|---|---|---|
| IO | [一手] [File Access module](https://docs.unity3d.com/6000.3/Documentation/Manual/profiler-file-access-module.html) 记录打开／关闭／seek／在途读／句柄，Accesses 有 Thread 列；[Asset Loading module](https://docs.unity3d.com/6000.3/Documentation/Manual/profiler-asset-loading-module.html) 把 `AsyncReadManager` 请求字节按 texture／mesh／audio／scripting／virtual-texture 等分类；两模块默认关闭，需 Analyze Markers。 | [一手] `AssetLoadTime` channel／Asset Loading Insights 给按资产类型的细节、包加载顺序与异步加载检查。 | 合并小读、避免同步加载、提前或分批；先确认读发生在哪个线程，不凭主线程等待推断。 |
| 解码／解压 | [一手] Asset Loading 分类与 CPU 标记；`LoadImage` 同步（见上条）；没有单一通用“解码”标记。 | Asset Loading Insights 按资产类型；纹理／包解压计入加载路径。 | 降规格、换压缩、提前／拆分；不靠提高 background priority 解决同步解码。 |
| 初始化 | [一手] 见上条 `backgroundLoadingPriority`（仅 Player、Editor 不生效、2/4/10/50 ms）；可看 `Application.Integrate Assets in Background`。 | [研究] 用 Timing Insights 看 GameThread 的异步加载与 PostLoad／初始化样本。 | 分批初始化、非关键挪后、避免在激活门里做重活。 |
| 上传 | [一手] 见上条 texture／mesh 与 `asyncUploadTimeSlice`；`AsyncBufferResized`／`AsyncBufferDelete` 警告表示上传缓冲扩容／删除，慢且造成 CPU 尖峰；`LoadImage` 同步。 | [研究] 用 Timing Insights 与平台 GPU 工具确认上传发生在哪个线程、是否与首绘重叠。 | 预上传、拆大纹理、避免缓冲反复扩容；不为资格删玩法 CPU 数据／形变。 |
| 首绘／PSO | [一手] 见上条 PSO 契约；定位 `Shader.CreateGPUProgram`／`CreateGraphicsGraphicsPipelineImpl`；数量不是毫秒保证。 | [一手] PSO Precaching 在 PostLoad 收集并异步编译，未完可延 proxy／默认材质或阻塞绘制；驱动缓存首取仍有成本。 | 按平台／API 采状态、覆盖新材质／keyword、在必用前完成；计内存，遗漏就补 bundled cache。 |

[研究] “加载完成”不等于“能回应”：`PrepareEncounter` 结束只说明资源就绪，`ActivateEncounter` 还要看首个可见帧、首个预警、首个可操作帧。未就绪用明确转场或已准备的等价反馈；关键预警和伤害不能延后绘制，装饰可降级。冷进程首次进房、同进程再进、重启保留驱动缓存三种条件分开记；`allowSceneActivation=false` 的旧场景／新数据／预热并存峰值计入内存。

#### 2.2 内存快照：等价状态、引用链与五类保留

[一手] [Memory Profiler 1.1.11 window](https://docs.unity3d.com/Packages/com.unity.memoryprofiler@1.1/manual/memory-profiler-window-reference.html) 的 Capture 下拉含 Managed Objects／Native Objects／Native Allocations；捕获可能数秒；References 面板显示“选中对象的引用与被引用”；Editor 快照“总含更多内存且行为不同”，最终优化应看 Player 构建。[一手] [Compare snapshots](https://docs.unity3d.com/Packages/com.unity.memoryprofiler@1.1/manual/snapshots-comparison.html) 分 Summary／Unity Objects／All Of Memory，默认隐藏相同数据；不同会话快照“不一定完全准确”，其他进程也会影响总量，需尽量保持条件相同。[一手] [CaptureFlags](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Profiling.Memory.CaptureFlags.html)：`NativeObjects` 收原生对象，`NativeAllocations` 收 Unity 原生分配及其图形大小；`NativeAllocations`／`NativeAllocationSites` 只有在构建支持原生调用栈（当前需要源码访问）时才增加数据。

[一手] [Memory overview](https://docs.unity3d.com/6000.3/Documentation/Manual/performance-memory-overview.html)：托管堆、C# 非托管（`NativeArray`／`UnsafeUtility.Malloc`）与 Unity 原生内存是不同层；原生内存“通常是应用内存的最大块”。[一手] [Resources.UnloadUnusedAssets](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Resources.UnloadUnusedAssets.html)：遍历场景对象／组件并检查静态变量，“不检查脚本执行栈”，只被栈引用的资产会被卸载；异步返回 `AsyncOperation`。[研究] 这些是分类与追所有者的依据，不是新的释放协议；所有权、取消和卸载入口沿用[完整资源生命周期](#resource-lifecycle-workflow)。

[一手] [Unity 托管内存](https://docs.unity3d.com/6000.3/Documentation/Manual/performance-managed-memory-introduction.html)明确：扩张后的托管堆即使大部分为空也会保留，归还 OS 的时机不保证。[研究] used/live 回落而 reserved 仍高时先看稳定性、预算及峰值分配／碎片化；只有超寿命活对象才进入引用链排查。

| 保留类别 | 等价状态里怎么认 | 常见误判 | 追到哪里 |
|---|---|---|---|
| 有界缓存／池 | 第一轮升到上限后持平；每轮对象数不增 | 把预热当泄漏 | 核上限、淘汰、耗尽政策；容量不证明预创建或并发上限。 |
| 托管堆保留 | live 对象／used 已回落，reserved／committed 或空闲堆仍高；等价状态多轮看是否趋稳 | 把扩张后保留的空闲堆当成活对象泄漏，或只看 OS 总量 | 先核是否稳定及超预算，追峰值分配／碎片化；不是直接清引用，归还 OS 的时机不保证 |
| 真实对象增长 | 托管 live 对象或 Unity Objects 数量／大小持续增加；UE 按 LLM tag／asset／class 分组 | 把临时对象、有界缓存或空闲堆算成泄漏 | 仅对超出既定寿命仍存活的对象追创建者、静态字段／事件／闭包等引用与所有者；沿现有生命周期修正 |
| 原生资源 | Native Objects／Native Allocations；图形大小按对象报告；Unity 对象原生内存与驱动／GPU 私有内存不是同一层 | 把快照当 GPU／显存全量 | 与平台工具交叉核；区分 Unity 对象、原生分配与驱动／GPU。 |
| 临时峰值 | 转场、解压、上传缓冲、render target、场景重叠的峰值 | 只看稳态或只看离场后 | 记录峰值时刻与持续时间；保并存上限与预算。 |

[一手] UE 5.8 [Memory Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/memory-insights-in-unreal-engine) 记录每次分配／重分配／释放，含 LLM tag 与 callstack；memory channel 必须从进程开始激活；LLM track 在会话开始数秒后才开始、按帧粒度；可按 Package／Asset Name、Class、Callstack 分组，支持 CSV／TSV 导出；callstack 需 `.pdb`／`.elf` 等调试信息。[研究] 等价状态是两引擎共同前提：同场景、同位置、同已加载内容、同预热与回收时机；要么都自然取点，要么都显式回收并写明。不同会话的绝对总量不能直接当因果证据。

#### 2.3 发布构建复核

[一手] Unity 自定义 `ProfilerMarker.Begin/End` 在非 Development 的 Release 构建被移除；`Auto()` 调用本身保留但不产生采样，并有少量开销；Release 复核改用 `FrameTimingManager`（Release 需开 Frame Timing Stats，或附着 `ProfilerRecorder` 自动启用；固定延迟四帧；Linux OpenGL／WebGL 无 GPU 时间；Metal 上 GPU 时间可能大于整帧）或 `ProfilerRecorder` 的内置计数器（可在 Release Player 用，附着期间才测量，需 `Dispose`）。[一手] UE 的 Insights／`stat` 的可用性按构建配置与目标版本核；`stat commands` 页只建议在非 debug build 启动，不能据此假定 Shipping 仍保留 tracing。Shipping 是否保留要按 `UE_TRACE_ENABLED`、断言与项目源码确认，不假设可用。[研究] 发布包用项目已有计数器、平台 GPU／CPU 工具或最小遥测；不能把 Development 构建的自定义标记数据当 Release 收益，也不能假设 Shipping 一定能开 Insights。

[研究] 同条件比较：帧间隔 p50／p95／p99／最长帧与尖峰次数、加载到首可见／可操作、稳态与峰值内存、冷启动、目标设备可读性与输入反馈。平均 FPS 会掩盖尖峰；单张 Profiler 截图没有分布；一帧样本不能证明归因。人判断可感知品质与最低设备体验。

### 3. 池化与 GC：提前付费的范围必须有上限

[一手] [ObjectPool 构造参数](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Pool.ObjectPool_1-ctor.html)：defaultCapacity 仅存储容量，空池才 createFunc，maxSize 限闲置保留、满池归还销毁。[研究] 容量不证明预创建或玩法并发上限；Get/Release 立即归还可能只反复用一件。核独立实例数，明确耗尽时创建／复用装饰／拒绝可选，不能丢关键弹体。

[一手] [Pooling and reusing](https://docs.unity3d.com/6000.3/Documentation/Manual/performance-reusable-code.html) 要求复用重置且非线程安全；[GC overview](https://docs.unity3d.com/6000.3/Documentation/Manual/performance-garbage-collector.html) 不回收仍被引用对象。[研究] 池也持资源／原生成本，零 GC.Alloc 不等于低驻留；按遭遇释放，核托管／原生／GPU。池充满到上限后持平属于有界预热，不按泄漏处理；每轮仍增长才回到所有者与引用链。

[一手] [GC modes](https://docs.unity3d.com/6000.3/Documentation/Manual/performance-incremental-garbage-collection.html)：增量分摊而非少做，引用频变可回退完整收集，关闭有堆增长风险。[研究] 先修热分配、按需有界池；PSO 热点不靠全局关 GC 解决。

### 4. Unreal 对照与实际开发者反证

[一手] [PSO Precaching](https://dev.epicgames.com/documentation/unreal-engine/pso-precaching-for-unreal-engine) 标 UE 5.8；component 在 PostLoad 收集异步编译，未完可延 proxy、默认材质或阻塞绘制；驱动缓存首取仍有成本，留更多 PSO 增内存。[研究] 原生自动优先，仍验关键反馈／线程竞争；当前请求完成不保证未来未加载技能覆盖。

[一手：作者实作] [PSO 文章](https://tomlooman.com/unreal-engine-psocaching/) 为 Windows DX12 Action Roguelike／Project Orion，图示一项 54.1 ms 编译。5.3 缺 decal 用 bundled＋automatic，更新说明 5.6 已覆盖 UDecalComponent；要求冷缓存同动作，并记 2025-09 NVIDIA 扩展变化使旧清缓存开关失效。[研究] 非独立同硬件对照，不用转述 Fortnite／课程宣传预测收益。

**[研究] 采用与撤回**：✅ 锁版本使用原生 automatic precaching；🧪 trace 证实遗漏才补 bundled cache。关键预警提前准备；预算不足就缩首场内容／材质组合，不能靠跳绘关键提示换顺滑。

#### 4.1 UE 5.8 的 trace、线程与内存

- [一手] [Unreal Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine) 捕获高频事件；Trace Server 无 UI、官方称“对性能影响最小”；`.utrace` 与 `.ucache` 自描述、跨引擎发布版本兼容；Timing Insights 分 CPU／GPU 轨道；Memory Insights 记录每次分配；Asset Loading Insights 用 `AssetLoadTime` channel；另有 Audio Insights 等。
- [一手] [Trace 开发者指南](https://dev.epicgames.com/documentation/en-us/unreal-engine/developer-guide-to-tracing-in-unreal-engine?application_version=5.8)：channel 默认关闭；`TRACE_CPUPROFILER_EVENT_SCOPE` 家族，静态名优先；动态字符串有额外 CPU／内存；`NoSync` 事件更小更快但不能跨线程协调；Trace 关闭时宏编译为空；`TRACE_BOOKMARK` 用于不频繁状态变化；`SCOPE_CYCLE_COUNTER`／`QUICK_SCOPE_CYCLE_COUNTER`／`SCOPED_NAMED_EVENT` 在 `-statnamedevents` 时也出现在 Timing Insights。
- [一手] [stat commands](https://dev.epicgames.com/documentation/en-us/unreal-engine/stat-commands-in-unreal-engine)：`stat unit` 显示 Frame／Game／Draw／GPU／RHIT／DynRes；`stat game`／`stat gpu`／`stat memory`；`stat startfile`／`stopfile`，startfile 在 PIE 关闭后仍可能继续，必须 stopfile；文档建议在非 debug build 启动。
- [研究] 与 Unity 不同名不同机制：UE 的 Game／Draw／GPU 不是 Unity 的 main／render／GPU 标记；等待要看 ContextSwitch／Task 与线程轨道，不能把 `stat unit` 的几列直接相加成整帧。

### 5. 第二次修改的未来验收设计

[研究] 预注册新增不同材质／keyword／渲染状态技能，允许进房立即施放，并保留旧技能基线：

1. 区分冷驱动缓存、同进程重复和重启保留缓存；未来仅在获准环境清缓存，并确认引擎／驱动实际生效。
2. 对照输入接受、首个动作／预警／技能反馈及伤害时刻，归因 CPU／GPU／等待长帧；软件 marker 不代表光学端到端延迟。
3. 比较无准备、遭遇范围及必要扩大范围的耗时、反馈、长帧、活动／闲置实例、峰值与离场留存；准备迟于必用时刻同样失败。
4. 换画质／后端重查覆盖，退出重进核池重置及预热误触发的声音／伤害／奖励；装饰降档不得改关键提示窗口。

[研究] 二改不假设旧瓶颈还在：

| 新内容 | 先重查 | 旧补丁的保留／缩小／撤回 |
|---|---|---|
| 新敌人 | 生成、AI、导航、动画、绘制、音频；每波峰值 | 原生成优化仍有效就保留；瓶颈转到 GPU／AI 就按新热点另改，不叠加旧调参 |
| 新材质／keyword | 变体覆盖、首绘 PSO、上传、原生内存、首次进房 | PSO 集合不够就补采；预热内存超预算就收窄覆盖或缩材质组合 |
| 更大波次 | 实例数、粒子／音频并发、GC、峰值内存、帧间隔尾部 | 原池上限导致生成卡顿就重定上限；原 DRS 模糊新预警就改内容或退回固定档 |
| 更多往返 | 每轮对象／原生资源 diff、缓存是否到顶 | 原缓存无界就设上限；真正的所有者泄漏不能用扩池解决 |

[研究] 验收同时含新内容首用、峰值波次、往返和旧内容回归；旧补丁让新瓶颈更差就撤回或缩小，不因第一版有效而保留。只有新工作边界需要时才加标记。Unity 实验 API 的目标补丁兼容性待验；54.1 ms 仅是作者 trace，不是本项目收益。

### 6. 实施落点与证据边界

[研究] 给 AI 的起点：沿既有遭遇代码加四个建议标记（Unity `ProfilerMarker` 或 UE `TRACE_CPUPROFILER_EVENT_SCOPE`），记录构建／平台／API／画质／冷热缓存；采一次正常遭遇，整理线程／等待／五段加载／五类内存的证据；写一句可证伪归因；只做一个最小补丁；回同条件复核；发布构建用内置计数器／帧计时，不把开发构建当发布。人决定可感知品质、最低设备体验与是否保留。本段是蓝图，未运行引擎／设备／游戏，未伪造收益；PSO、加载、池化、DRS、粒子与呈现节奏的既有依据继续复用。

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

<a id="catalog-update-consumption"></a>
### 远程目录的采用边界：更新查找表，不替换活世界

**决定：已有远程内容链默认在加载本局资源前更新；确需运行中更新才先退出受影响内容，沿现有协调者串行交接，不再增加补丁／锁框架。** 原 04 已有应用更新与内容更新的选择及发行基线，本次补的是操作句柄、活资源、磁盘缓存三者不能互相代替。Unity 未运行；以下是固定原包源码／文档核查，未用抽取片段或 mock 声称引擎复现。[研究，2026-10-27]

**固定来源。** 从官方包注册库取得 [2.9.1](https://packages.unity.com/com.unity.addressables/-/com.unity.addressables-2.9.1.tgz) 与 [4.1.1](https://packages.unity.com/com.unity.addressables/-/com.unity.addressables-4.1.1.tgz)，包内 `package.json` 版本吻合；本次下载的 SHA-256 分别为 `06dc6b4a4f29c7f1337394157f6a06b29ffdec059be612fded1dd4dbd393225e`、`5e61ff4ab79548b2afbc434a941bdcfafeec7b7e5cfab34adddaa7a39f59e9ea`。这是下载身份记录，不冒称已验证包的签名。源码沿 Unity Companion License，仅阅读、不在本仓分发包或执行附带工具。

| 可确定的接缝 | 原包中的实际实现及采用影响 |
|---|---|
| 检查不是更新／下载 | `Runtime/Initialization/CheckCatalogsOperation.cs` 比较可更新目录的 hash；错误可带部分结果，但操作状态失败。调用方先核 Status，不能用空／非空结果独自解释“已最新” |
| 更新不是世界替换 | `UpdateCatalogsOperation.Execute` 对 `ResourceLocatorInfo.UpdateContent` 写新 locator；不遍历并替换玩法实例。`AddressablesImpl.LoadAssetAsync(IResourceLocation)` 直接消费传入位置，按 key 的重载才重新查 locators；项目旧位置缓存也要退出旧批次 |
| 清理失败可能发生在目录已换之后 | 同一 `Execute` 先更新 locator，再按 `m_AutoCleanBundleCache` 进入清理；`OnCleanCacheCompleted` 按清理状态完成整个更新操作。故自动清理失败不证明目录回滚。接线选择 `autoCleanBundleCache: false`，可选清理另报结果，不把整体错误自动重放成一次新内容交接 |
| 三种释放不同 | 额外目录加载句柄的引用会影响操作缓存；玩法资产／实例仍按各自所有者释放；`CleanBundleCacheOperation` 枚举磁盘 bundle 缓存并清除不再引用的条目，不回滚 locator，也不代替释放场景／池 |

**互斥是待原生核实的疑点，不写成已复现 SDK 故障。** [2.9 手册](https://docs.unity3d.com/Packages/com.unity.addressables@2.9/manual/LoadContentCatalogAsync.html)与[4.1 手册](https://docs.unity3d.com/Packages/com.unity.addressables@4.1/manual/LoadContentCatalogAsync.html)都称 `UpdateCatalogs` 会阻塞其他 Addressables 请求。核了两包的完整公开 `Addressables` 包装、`AddressablesImpl`、检查／更新／清理操作、目录 provider，以及包内全部 C# 中该字段的读写：`ShouldChainRequest`／`ChainOperation` 读取 `m_ActiveUpdateOperation`，但生产 `UpdateCatalogs` 返回局部 `op`，未找到把它登记到此字段的赋值。找到的赋值只在 `Tests/Runtime/AddressablesIntegrationTestsImpl.cs`，由测试直接注入 `DumbUpdateOperation` 来验证链式分支。相关字段／调用不在另一套条件编译实现中；`ENABLE_CONTENT_DIRECTORIES`、`ENABLE_CACHING` 与 Editor 排队路径也未补此登记。这个静态差异支持“不把该 API 当项目全局锁”的保守接线，**不证明真实 Player 的并发故障、频率或修复结果**；不用测试注入成功替代公开调用链验收。

**为什么不改成清缓存／强行共存。** 当前官方说明要求归还旧 `LoadContentCatalogAsync` 操作后才能重新取得目录；当前包公开 API 的注释也明确，已载 bundle 与更新版本可能冲突，`Unique Bundle IDs` 以更多重建／下载和新旧同时驻留换取 ID 不冲突。它不迁移对象或存档。4.1.1 changelog 另记录 CCD URL／目录缓存名修复，4.1.0 记录多目录 provider 的更新开关修复；这些是各自版本修订，不能拿早期 1.x 反馈推断所有当前问题仍在。

2025 年[开发者原帖](https://discussions.unity.com/t/addressables-content-update-not-working-modified-bundles-not-downloading/1604082)使用 2.2.2／2.3.16，代码把 `LoadContentCatalogAsync` 成功写成“发现更新”，并尝试清缓存后重下；原帖没有可核的最终解决结果。它是用户混淆“目录加载／更新检测／bundle 缓存”的实际反例，不是本轮复现或 2.9.1／4.1.1 的缺陷证据。更早[维护者答复](https://discussions.unity.com/t/updatecatalogs-and-checkforcatalogupdates-dont-see-any-updates/819330)解释额外目录句柄影响操作缓存；本轮采用以当前原包和手册为准，不照搬旧 workaround。

接回 [04 原更新总入口](../../domains/game-dev/04-client-modules.md#catalog-update-consumption)：保持应用／内容／存档三种身份和旧基线；额外目录句柄释放、旧内容仍在用、Unique Bundle IDs 的预算、更新后重新解析、失败与清理重试分别处理。真正接收仍须用目标 Player、实际目录／bundle 与新旧内容消费者；本次没有更新吞吐、离线完整性或最高生产表现的实测结论。

### 发布候选的正常构建入口（2026-10-26 UTC+8 补核）

Unity 6.3 [Build Profiles](https://docs.unity3d.com/6000.3/Documentation/Manual/build-profiles.html)区分 Platforms 的共享设置／场景数据与保存为资产的项目 profile；后者可分别配置场景并进版本控制。[BuildReport](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Build.Reporting.BuildReport.html)提供本次构建结果、大小、耗时和步骤／错误；某些无效输入可在报告生成前失败，存在报告也不代表实际游戏路径通过。UE 5.8 [Packaging](https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-your-project)分 Build、Cook、Stage、Package，并将 Deploy／Run 列为另外的可选操作；Game Default Map 决定打包后起点，教程的 Development 例不是 Shipping 验收。[一手]

[04 发布模块](../../domains/game-dev/04-client-modules.md#release-delivery-production)据此把旧平台差分、内容裁剪、符号／反馈和 WP9 内容基线接成一次发布候选及新房／语音二改。代码构建、内容集合、存档 schema 分别对应不同兼容性；三种安装路径和回退数据选择为本项目实施建议，不是平台自动保证。上述 2026-10-19／20 的机制与历史生产案例不改日期；未实际构建、分发、迁移玩家数据或证明效率收益。[研究]

<a id="native-release-consumer"></a>
### 原生发布包消费者：不以 Editor 或数据包代替应用

**改变的做法：把原六步落实到真实导出程序，补“必要内容齐／未发布内容未带出／二改后旧包保持”的接收；不新增发布平台。** 对应 [04 发布段](../../domains/game-dev/04-client-modules.md#native-release-consumer)，复现于 [Godot 应用包实验](../../experiments/godot-export-adoption/README.md)。[研究／实测]

| 方案 | 选择与实核依据 |
|---|---|
| 原生 preset＋官方 CLI | **本次采用**。官方编辑器与同版 Linux x86_64 debug／release 模板；导出、交付副本与实际主场景消费者分开，无商店／账号依赖 |
| 既有 Unity Build Profiles／UE Package | 沿前节入口，不为这次云端实验迁移项目。构建与实际包运行的区别仍成立，未原生复测 Unity／UE |
| 现成 Firebelley/godot-export | 已有 GitHub Actions 时可沿其固定版本；v8.0.0／MIT，SHA `615a6f7afc22d6266bf55c17748fb07447e8bdab`。源码先 import，再按 preset 选 debug／release 或 pack，导出非零会失败；import 异常会警告后继续，缺 export_path 会跳过该项。应核实际候选和消费者，不能只认 Action 完成。本次未执行 Actions 或安装它 |
| 只发 PCK／用 Editor 代跑 | 不选作应用验收。官方明确 Export PCK/ZIP 只有项目数据；标准发布模板路径覆盖能力与 Editor 不同，不能暗中换运行器过门 |

Firebelley 借用的是已有 preset／缓存／构建流程，不照搬示例的自动建 release、写权限与旧版下载 URL。依赖版本固定，候选上传另循项目已授权渠道。本次直接 CLI 是窄实验入口，不宣称比成熟 CI 更高效。[固定源码／研究]

**官方文件分类与旧提示冲突时，看实际包。** Godot 的 JSON-as-resource 实现已在 4.0 合入；2026 年 PR #119555 又修正把 `*.json` 列为非资源的旧导出提示。当前 4.7 文档仍有旧举例，因此不能按该例推导 JSON 必须手工 include。本次相同 preset、`all_resources`、空过滤的 release 实际遗漏 `stage_title.txt`、同时包含未引用的合成 `unreleased/bonus_level.json`；它退出 0、能运行回合，却被消费者拒收。只改 include `*.txt` 与 exclude `unreleased/*` 后，源标题进入原 HUD，未发布数据消失。[官方源码／实测]

**真实二改链。** 复用固定官方 demo 原四份脚本及原场景，新增窄项目 autoload：正常启动读标题写原 HUD，显式 `smoke` 参数才走自动回归。v1 debug 与 release 的实际 template 均正常运行，分别报告 debug=true／false；v2 复用原生作者脚本保存变体，把主场景选到变体、标题改为 Night shift、版本改为 1.1.0。新交付副本中 12 帧位移 80→48px，原回合、物理死亡与重开通过；v1 再开仍是 Training shift／1.0.0／80px，原六份脚本／场景及旧 exe／PCK 摘要未变。全部运行都从复制的 exe＋PCK 启动，不带项目 `project.godot`、源目录或开发缓存；不是原生 Editor 读取 pack。[实测]

**验证应在 release 中仍有效。** GDScript `assert` 在非 debug 构建中忽略；本例显式记录失败并返回非零，原始错误输出与完成标记也必须一致。完整入口包含源工程、错误过滤包、两种配置、新版与旧版再开；文件交付／缺数据／过滤另有 4 项纯文件单测（含许可随包）。输出不会在失败后被旧包替代。[官方契约／实测]

**现实反馈。** [Reddit 导出 JSON 的原帖](https://www.reddit.com/r/godot/comments/1u6c8n9/when_did_godot_start_automatically_exporting_json/)（2026-06）要求试玩版只带部分谜题，作者发现空 include 仍导出 JSON；评论指向官方实现与旧提示修正，作者选择命名／排除模式。借内容边界，不把社区建议当适用于所有项目的配方。[社区]

[Godot Forum 导出失败](https://forum.godotengine.org/t/export-issues-unsure-of-source/137265)（2026-04-18，4.5.1）报告在项目目录能运行、移出后部分功能失效；改小写后仍失败，未给完整闭环，不能采纳“Windows 不支持大写／空格”的泛化诊断。[中文 V2EX 已发布游戏帖](https://www.v2ex.com/t/1187822)（2026-01-23）有作品发布与后续更新，也有另一开发者 Linux／Web 导出正常而微信模拟器黑屏的反馈；这支持按最终目标验包，不支持 Linux 通过外推渠道兼容或当前模板修复。[社区：正反反馈]

**范围。** 2026-10-26 真实 Linux x86_64 官方 4.7.2 应用导出、独立目录启动与上述消费者通过；GPU 画面、真实音频输出、平台签名／商店、下载差分、存档升级和其他架构不在本例。发行许可沿原步骤核引擎、第三方组件和素材；本地技术验证不是整套发行授权审查。[实测范围]

来源：官方 [导出](https://docs.godotengine.org/en/4.7/tutorials/export/exporting_projects.html)、[Linux](https://docs.godotengine.org/en/4.7/tutorials/export/exporting_for_linux.html)、[CLI](https://docs.godotengine.org/en/4.7/tutorials/editor/command_line_tutorial.html)、[assert](https://docs.godotengine.org/en/4.7/tutorials/scripting/gdscript/gdscript_basics.html#assert-keyword)、[JSON 实现 #65295](https://github.com/godotengine/godot/pull/65295)、[旧提示修正 #119555](https://github.com/godotengine/godot/pull/119555)，[Firebelley 固定源码](https://github.com/firebelley/godot-export/blob/615a6f7afc22d6266bf55c17748fb07447e8bdab/src/godot.ts)及 README／MIT 许可，社区原帖见上。2026-10-26 定向核实；固定下载摘要与完整复现入口在实验。

## 发行裁剪：内容完整性与资源规格分开选

核实：2026-10-20（UTC+8）。[研究] ✅ 先保目标玩法必需的内容，再比较规格派生、渠道交付或有意收窄玩法。包体不足不直接推出换素材／重生成，也不把删内容当无损优化。本节补的是已有资源被发行预算裁剪后的进度代价，不替代前节下载与安装重写、WP2最终编码画质或完整目标构建检查。

### 同一作品的需求与采用链

- [一手／作者报告] SuperTuxKart 早期 Android 因历史 APK 预算不能装下全部赛道。维护者在[2017年讨论](https://github.com/supertuxkart/stk-code/issues/2805#issuecomment-284498590)估计全赛道约170MB、当时上限100MB，再降音质仅约省5MB；这些是历史报告，不是当前商店政策或本次测量。[2018年玩家报告的回复](https://github.com/supertuxkart/stk-code/issues/3109#issuecomment-361247855)明确：缺赛道导致无法完成全部挑战，所以刻意全解锁。删资源已经改变进度体验，不只是视觉降档。
- [一手] [1.1 RC官方说明](https://blog.supertuxkart.net/2019/12/supertuxkart-11-release-candidate.html)提供游戏内下载因包体限制缺失的移动资源；[正式1.1发行](https://blog.supertuxkart.net/2020/01/supertuxkart-11-released.html)承接该功能。固定1.1 [生成脚本](https://github.com/supertuxkart/stk-code/blob/68e21856cfec9b0984f15a40251011740cd2a5cb/android/generate_assets.sh)仍列选定赛道，纹理尺寸、音频规格与是否裁剪内容分别配置。它不是“下载器消除发行成本”的证据。
- [一手／源码] [2020-03-06修改](https://github.com/supertuxkart/stk-code/commit/c542feaf4dd82b90d4b79260f487580a5e62cae3)明确借 Android App Bundle 纳入全部赛道：默认名单改为 all，构建加入 bundleRelease，下载提示移除“全部赛道”而保留高质量纹理／音乐。[2020-08-27正式1.2](https://blog.supertuxkart.net/2020/08/supertuxkart-12-release.html)确认 Android 发行含全部官方赛道。逆转的证据是分发条件改变，不是压缩算法胜利。
- [一手／源码] 固定1.2 [生成脚本](https://github.com/supertuxkart/stk-code/blob/6e17f2ed6bc5134e6d9070c3321ff245739aa23a/android/generate_assets.sh)同时保留降规格配置；[下载对话](https://github.com/supertuxkart/stk-code/blob/6e17f2ed6bc5134e6d9070c3321ff245739aa23a/src/states_screens/dialogs/download_assets.cpp#L98-L110)仍告知高质量纹理／音乐与移动流量代价。完整内容并不等于全部高规格资源。

### 当前 Play 交付模式：先按可玩要求分组

2026-10-20 核对 [Google Play Asset Delivery 官方说明](https://developer.android.com/guide/playcore/asset-delivery)（页面更新2026-10-06）：install-time 随安装交付、启动即可用；fast-follow 安装后自动下载但不阻止进入应用；on-demand 在运行时按需下载。后两类资源的存在和位置不能跨会话假定，更新时也可能出现应用已更新而资源补丁尚未完成的窗口。[一手]

[研究] ✅ 承诺首次启动就可玩的必要资源放入可立即使用的集合；可等待的后续内容或高规格版本才比较 fast-follow／on-demand，并提供可用性检查及等待／失败反馈。⛔ 不把 fast-follow 的“自动”当作“首局必定齐全”；若拆包使首局、离线承诺或旧档依赖无法成立，纳回必要资源或明确收窄可玩范围。这是 Play 渠道选择，不泛化到其他商店；未实测下载、补丁或构建收益。

### 哪条路线值得选，何时撤回

[研究] 目标质量首先是玩家能完成承诺的挑战／进度，再是目标设备上资源呈现合格；两者分别验收。已满足完整内容和可读／可听标准时，优先保留资源，按类别生成可追踪的目标规格。若必须拆出内容，先核进度与旧档依赖，把首次取回、失败重试、离线边界和两套版本维护算进成本；不能只比较商店首包数字。若这些代价高于收益，渠道允许时纳回必要内容，或明确重设计可独立完成的玩法范围，不把默认全解锁称为无影响替代。

[一手／反证] 补齐赛道后，[2020年讨论](https://github.com/supertuxkart/stk-code/issues/3109#issuecomment-671553214)仍有人主张因触屏难度保留全解锁；这是另一理由及讨论意见，不证明发行行为，尤其不能声称1.2恢复了原进度体验。[研究] 因此收回完整资源后仍须单独检查输入难度和进度规则。缩规格若破坏必要辨识／声音线索，或分发维护不可承担，应撤回该规格／拆分方案；无人工美术修补时优先换可批量派生的规格或收窄明确范围，不默认人工补图。

范围：[一手／研究] 只读固定 GPLv3 脚本和作者发布／讨论，不执行脚本、不下载资产、不把代码许可套到资产，不推荐直接复制素材。未验证本项目打包、客户端、离线体验、流失率、制作工时或AI效率；历史包体阈值不得作为当前渠道规则。通用发布、升级、存档、权限和目标设备检查继续适用。

## [图中文字二改：先换生产表示再扩语言](wp10-content.md#105)

## [字体选择补研：缺字回退与地域字形优先分开](wp10-content.md#字体选择补研缺字回退与地域字形优先分开)

## 发行诊断：正常调查链与符号误配反例

**[研究] 补的是“报告→定位→复现→修复构建”，不是再选一套监控。** 原节已有 Unity／UE／Sentry 接收、同意、符号与真实修订链，但正文欠缺拿到反馈后怎样工作。默认沿已有合格接收链，保人工反馈；先对齐发行构建、内容与模块身份，再读栈，最后以同一失败动作验修复。自动采集、上传符号／源码、账户与真实日志不属于本地工具可用就能顺便开启的步骤。

### 正常制作顺序及实际平台起点

1. **反馈和分级**：无法启动、损失进度、稳定可复现阻断优先于偶发非阻断告警；同时保构建／渠道／平台／架构、最后成功动作与期待结果。使用最短获准日志或合成数据，现存存档先保原件，不让修复程序覆盖唯一复现材料。
2. **构建和符号**：归档实际包、对应符号、源码／依赖／内容版本；按模块 ID 与架构匹配，不只按发行名／文件名。原生栈中的模块相对地址与运行地址分清，ASLR 下不能把任意绝对地址直接喂给离线工具；本实验特意关闭 PIE，只证明误配风险。
3. **调查与修复**：托管异常、原生崩溃、无异常软锁分别走相应证据，读到函数不等于知道原因。先保失败动作，缩成复现，再修依赖／状态／资源生命周期；加宽 catch、关掉日志或删报告不是修复。
4. **新构建与反馈**：同输入旧包失败、新包恢复，再验正常路径、缺输入／资源与旧进度；按同平台／构建观察回归，结合暴露量与采集变化看报告，不能把报错总数下降直接算成功。

**Unity 6.3 的两条符号路径不要混。** [IL2CPP 托管栈文档](https://docs.unity.com/en-us/engine/6000.3/manual/programming-environment/scripting-backends/il2cpp/il2cpp-managed-stack-traces)说明 `Method Name, File Name, and Line Number` 利用程序集 managed `.pdb` 生成随 Player 交付的行号数据，也能在 Release／Master 内联时提供完整托管栈；增加包体／构建时间。只为栈信息不建议开更重的 Script Debugging。这是托管异常信息，不自动代替 native crash 的平台符号；[Diagnostics 符号说明](https://docs.unity.com/en-us/cloud/developer-data/debugging-symbols-intro)要求模块 UUID／GUID 与符号精确匹配。Windows native PDB 与 managed PDB 的用途也不能混称“有一个 pdb 就齐了”。

**UE 的报告客户端不是接收服务器。** [UE 5.8 Crash Reporting](https://dev.epicgames.com/documentation/en-us/unreal-engine/crash-reporting-in-unreal-engine)列报告中的错误类型、线程栈、日志和上下文，packaged 项目需配置接收链；按原节选定服务后验证真正收到与符号化。应用还能运行的 ensure、崩溃和用户反馈分开，不把任一后台事件当所有错误都能采到。

**社区反例不是根因诊断。** [2025 年 Android 开发者原帖](https://www.reddit.com/r/Unity3D/comments/1mlq92z/get_readable_stack_traces_from_google_play_store/)自述包含完整符号仍不知怎样定位，所贴栈实际上已有 `libunity` 与 `libil2cpp` 函数／BuildId。它提醒区分“已符号化到函数”“有项目源码行”“知道根因”；不能凭这份栈认定其游戏故障原因，也不能把所有可读性不足都归为未上传符号。原帖公开的机器／应用路径不纳入本仓实验。

### 本地工具实证：同地址、错符号，也会有貌似可信的行号

[可复现实验](../../experiments/native-symbol-triage/README.md)使用原创 `room.c`，在 Linux x86_64、GCC 14.2.0／GNU binutils 2.44／Python 3.12.14 编译两版 ELF；`-g -O0 -no-pie`，保 Build ID，分离 debug companion 再 strip。v1 缺房时用 `backtrace` 输出真实本进程错误栈并退出 2；v2 改为输出可返回／重试提示并退出 0。它是命令行错误路径，不触发真实游戏崩溃或构建菜单。

| 实际执行 | 观察及限制 |
|---|---|
| 默认五项测试 | 5/5 通过：正常房／缺参数、错误与修复路径、正确符号身份和行号、误配可读结果、缺符号／文件；工具缺失或误配反例不再成立会失败，不 skip |
| `readelf -n` 与 `addr2line` | v1 二进制／companion Build ID 相同；v2 ID 不同。同一错误地址正确解析为 `open_room`／`room.c:14`，错配 v2 却是 `main`／`room.c:19`；strip 文件缺行号 |
| 可选 Sentry CLI 3.8.2 | 含可选项 6/6 通过。两份 companion `check --json` 均 `is_usable: true`；按 v1 Debug ID 用限定目录 `find`，正确目录退出 0，错配／空目录退出 1，缺文件 check 退出 1 |

**所以先验身份，再信解析。** `check` 回答该文件基本可用与具备什么信息，不接受“待匹配的崩溃模块”参数；这不是工具错误。已核固定 [check.rs](https://github.com/getsentry/sentry-cli/blob/4602f5e5724d541c17df9119285adf5693c985be/src/commands/debug_files/check.rs) 调 `DifFile::open_path/is_usable`，以及 [find.rs](https://github.com/getsentry/sentry-cli/blob/4602f5e5724d541c17df9119285adf5693c985be/src/commands/debug_files/find.rs) 的给定 ID 和目录搜索。`--no-well-known --no-cwd` 加显式 `--path` 使实验不误用其他目录的正确符号；主路径没有凭据，也没有调用 upload。

**版本与权利分开。** 从官方 npm 包 `@sentry/cli@3.8.2` 安装，tag 固定 `4602f5e5724d541c17df9119285adf5693c985be`；包与固定源码 [LICENSE](https://github.com/getsentry/sentry-cli/blob/4602f5e5724d541c17df9119285adf5693c985be/LICENSE) 均为 **FSL-1.1-MIT**，列内部使用等允许用途及竞争性用途限制，不是当前 MIT 工具，也不与原节 MIT 的 Unity／UE SDK混同。[官方 CLI 文档](https://docs.sentry.io/cli/dif/)明确区分本地 check／find 与需要组织 token 的 upload，并说明 source bundle 会打包源码；本轮未创建／使用服务或上传任何文件。

**AI 的实际任务**：先把一条获准反馈落到同构建与真实消费者，再做可重复的失败输入和窄修复；第二次需求只增加能解释假设的阶段／配置事实或另一个平台的符号链。人核严重性、数据范围和恢复是否对玩家成立。原节启用／禁用、断网、缓存、SDK 自身失败与注入边界均保留，不因正常链补齐而删掉。

**探索与范围**：2026-10-26 读官方平台说明、近两年社区原帖及固定 Sentry CLI 实现，并实际运行上述本地实验；GNU 工具沿环境现成版本，未测其跨版本排名。原始合成错误与解析结果留在实验运行目录，仓库只提交源码／测试／说明。未运行 Unity／UE／IL2CPP、远程接收或真实玩家故障；未知的是原生栈覆盖、诊断开销与现场修复收益，不是本地工具是否执行成功。原接收、SDK修订与隐私事实的核实日继续见下一节。

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
