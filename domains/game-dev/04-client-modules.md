# 客户端核心模块：先守住跨模块行为

> 核实：2026-10-13 UTC（2026-10-14 UTC+8）。Unity 主线、Unreal 对照；面向单人程序，无人工美术与音频修补。资产导入见 [01](01-engine-integration.md)，生成供给见 [03](03-generative-ai-in-games.md)。固定源码、反证、许可与验证范围见 [WP10 研究记录](../../docs/research/2026-10-14-game-wp10-client-modules.md)。

## 30 秒结论：从风险选模块

| 眼前问题 | 默认先做 | 何时增加能力 |
|---|---|---|
| 还没有可玩的第一版 | 一套设备、原生输入/UI/物理、窄存档格式 | 明确缺口后再加库 |
| 换场景后对象或声音残留 | 明确所有者、取消、释放及退出顺序 | 原生加载已不够才考虑资源层 |
| 存档能读但进度不对 | 稳定内容 ID、格式版本与迁移回归 | 实际跨版本需求出现后扩迁移 |
| 平均 FPS 好但会卡顿 | 在最低设备测最坏路径和峰值 | 按热点选择缓存、池化或渲染调整 |
| 要支持更多平台 | 先补该平台构建、输入与恢复验收 | 不先造跨引擎抽象 |

AI 可补实现和检查，人决定设备与体验门槛；未做目标设备实测时不承诺性能。[研究]

## 1. 单人项目先借引擎，再补确实缺少的一层

**[研究] ✅ 采用：第一版只承诺一套目标设备和输入方式，以引擎原生组件完成可发布的最小行为。** 必须先明确最低设备、帧率／分辨率、内存上限、保存失败策略和菜单可达性。网络同步仅在玩法需要时引入；不要为了将来扩展先加 ECS、自研资源管理器、通用存档框架或跨引擎抽象。

这里的「最佳质量」指该玩法下有较高能力上限的条件路线，不是无实测的排行榜；「最佳性价比」计入单人集成、调试、升级和第二次需求修改成本；「本地／免费」指无需另购模块，不表示引擎或第三方资产没有授权条件。三个档位可以是同一原生方案，不能为凑三档而引进三个框架。

**最重要的边界：await 返回、场景可用、句柄释放、物理内存下降，是四个不同事件；能加载旧文件、能够恢复同一玩家进度，也是两回事。**

## 2. 十一个模块的最低交付线

下表的采用／改造／不用是本仓库的 **[研究]** 判断；机制链接为 **[一手]**。AI 失败列是应检查的风险，不是本轮测得的出错频率。

| 模块 | 独立游戏必须做到；可以不做 | 分档与借用判断 | AI 可以承担／重点防错 | 将来验证 |
|---|---|---|---|---|
| 渲染与性能 | 固定最低设备、分辨率和帧时间；有阴影、透明叠加、纹理／网格和同时可见对象预算。可以没有实时 GI、动态天气、自研 SRP | 性价比／本地：✅ 采用 Unity [URP](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/urp-introduction.html) 及对应平台预设。质量上限：🧪 只在光照／材质需求和设备都支持时评估更重管线；Unreal 使用原生渲染与 scalability，不能因有 Nanite／Lumen 就豁免预算。⛔ 不为生成模型的高面数输出自建渲染器 | AI 批量查导入规格、shader 变体和材质引用，按 profiler 热点改动；防止只看平均 FPS、用降低画质掩盖错误、每帧分配、无条件开昂贵特性 | Unity [目标设备 Profiler](https://docs.unity.com/en-us/engine/6000.5/manual/analysis/profiler/profiling-applications/profiling-target-device)／Frame Debugger；UE [Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine)。冷启动、首次技能、满屏战斗与切关卡分别测 CPU/GPU、尖峰和内存；发布构建复核 |
| 资源加载与内存 | 每次获取有明确释放者，旧场景不接受迟到结果，失败能回到可操作状态。可以没有 CDN、热更新、全局缓存框架 | 性价比／本地：✅ 小型常驻内容用直接引用；出现明确分组驻留、内容分发需求时改造为 [Addressables](https://docs.unity3d.com/Packages/com.unity.addressables@2.7/manual/AddressableAssetsAsyncOperationHandle.html)。质量上限也是有预算的 Addressables，不是另一套加载器。UE 按需用 Asset Manager／StreamableHandle；常驻小资源不必一律软引用。UniTask 为可选异步适配层，不能代替资源所有权 | AI 能建立句柄清单、加载状态日志和错误恢复；防止取消 await 就忘记 release、双重释放、Object.Destroy 当成 Release、旧回调给新对象赋值、同步等待卡死 | 预取消、加载中取消、同帧完成、失败、共享依赖、连续 A→B→A；检查句柄计数、实际驻留及峰值三者，不只观察任务成功 |
| 动画系统 | 正确骨架、root motion 归属、动作打断、暂停恢复、死亡／重开后复位。可以没有 motion matching、全身 IK、自定义动画图 | 性价比／本地：✅ Unity [Animator／Clip／Blend Tree](https://docs.unity3d.com/6000.3/Documentation/Manual/AnimationOverview.html)；简单刚体／2D 反馈可用少量参数动画。质量上限：🧪 明确接触／表演需求才增加 IK／Playables；UE Animation Blueprint／Montage／[Root Motion](https://dev.epicgames.com/documentation/en-us/unreal-engine/root-motion-in-unreal-engine)。不把大型多人样例全套搬入小型单机 | AI 连参数、生成转场表、检查动画资源名与事件；防止脚本位移与 root motion 同时驱动、动画事件成为唯一伤害／奖励真相、池对象保留旧 trigger | 低帧率、任意转场点打断、暂停、死亡复活、斜坡／台阶、碰撞体与网格一致；视觉检查脚滑／穿插，Profiler 检查动画线程开销 |
| 物理与碰撞 | 碰撞层明确，触发器／实体碰撞分清，快速物体与低帧率仍满足玩法。可以没有破坏、布料、全场景刚体、网络确定性 | 性价比／本地／通常的质量路线：✅ Unity 原生 [2D／3D 物理](https://docs.unity3d.com/6000.3/Documentation/Manual/PhysicsSection.html)，按玩法选择其一；UE 原生 Chaos。🧪 CCD、substep 只为具体穿透／稳定性问题启用，⛔ 不用提高全局迭代数代替定位 | AI 配置层矩阵、测试代理碰撞体、写幂等命中结算；防止高精网格直接作所有动态碰撞、Transform 与 Rigidbody 争用、把一次物理回调等同一次伤害 | 快速弹体／薄墙／斜坡／多接触／低帧率；按攻击 ID 去重。UE [substep 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-sub-stepping-in-unreal-engine)明确同次接触可能在同帧产生多个回调，须测结算规则 |
| 输入 | 可重绑定的逻辑动作、玩法／菜单模式、失焦和设备断连恢复。可以没有所有控制器／本地多人／复杂手势 | 性价比／本地／质量：✅ [Unity Input System](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/UISupport.html) 已发布兼容包及其 UI vs Game Input 样例；UE Enhanced Input。需要跨设备菜单栈再🧪 CommonUI。⛔ 不为基本输入另造事件总线 | AI 配 action map、持久化 bindings、生成输入路径测试；防止 UI 和开火同时处理同一键，Disable 内同步 canceled 回调重入，恢复时仍保留蓄力／移动值 | 按住移动失焦、蓄力中开菜单、重绑定取消、拔插控制器、菜单返回同帧；动作事件日志配合实际设备 |
| UI | 主菜单→开始→设置→暂停→退出路径均可达；焦点、尺寸变化、错误和加载状态可见。可以没有通用窗口框架、网页嵌入、复杂动画 | 性价比：✅ 现有 uGUI 不迁移；新多分辨率菜单可🧪 UI Toolkit。质量／本地：仍由需求决定两者，见 [6.3 功能表](https://docs.unity3d.com/6000.3/Documentation/Manual/UI-system-compare.html)。原生 UE UMG；多层交互用 [CommonUI 路由](https://dev.epicgames.com/documentation/en-us/unreal-engine/commonui-input-technical-guide-for-unreal-engine)。⛔ 不并列维护两套 UI 除非有具体缺口 | AI 能生成布局、数据绑定、焦点规则和截图用例；防止单张截图正确却键盘／手柄不可达、重复监听、隐藏面板仍吃输入、依赖 UI 类型名字判断运行态 | 键鼠／控制器全流程、宽高比、安全区、长文和字体缩放、点击穿透、反复打开关闭。UI Toolkit 新功能仍需在锁定版本上实测 |
| 音频 | 音量分组、静音、优先级和并发上限；音乐循环／切换与暂停语义清楚。可以没有专业中间件、实时模型推理、复杂声学 | 性价比／本地：✅ Unity AudioSource／AudioMixer／[DSP 调度](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource.PlayScheduled.html)；UE Audio／[MetaSounds 原生模板](https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-in-unreal-engine)。质量上限：🧪 只有交互音乐／音频制作工作量证明有收益才评估 FMOD；其商业许可另核，免费档有营收／项目预算条件 | AI 建声音事件表、分组和并发政策，自动测长度／峰值；防止 Update 时间调度节拍、长音乐全部解压常驻、无限 PlayOneShot、把 Time.timeScale 当音频暂停 | 听验接缝、声道、瞬态与重复疲劳；并发高峰、低帧率、暂停和失焦。测 audio CPU、流读取与解压内存 |
| 存档 | schemaVersion／contentVersion、稳定内容 ID、失败反馈、恢复策略和旧档夹具。可以没有云存档、跨设备冲突处理、任意运行时对象图快照 | 性价比／本地／质量：✅ 显式 DTO + 项目已有序列化器 + 小型版本迁移函数；Unity [JSON 序列化](https://docs.unity3d.com/6000.3/Documentation/Manual/json-serialization.html)或 UE [SaveGame](https://dev.epicgames.com/documentation/en-us/unreal-engine/saving-and-loading-your-game-in-unreal-engine)只解决部分机制。叙事项目🧪 ink，普通存档不用引入 ink | AI 写迁移和夹具、删除字段默认值、内容 ID 映射；防止只测同版 roundtrip、改类名／资源路径即丢进度、原地覆盖唯一档、异步保存读取正在变化的对象 | 旧档跨两次内容修改、缺失道具 ID、断电式中断、磁盘满、损坏／未来版本、重复载入不重复发奖。保存成功提示必须来自真实结果 |
| 本地化 | UI 文本以稳定 key 管理，字体 fallback、复数／变量插值正确，切语言不会漏事件／资源。单语言发布也应避免把可变文字烘焙进图；可以暂不翻译多语种、不做配音 | 性价比／本地／质量：✅ Unity Localization 的 String／Asset Table 与 [伪本地化](https://docs.unity3d.com/Packages/com.unity.localization@1.5/manual/Pseudo-Localization.html)；UE [FText／Localization](https://dev.epicgames.com/documentation/en-us/unreal-engine/localization-overview-for-unreal-engine)。没有大量内容不自建翻译后台 | AI 提取 key、查硬编码、占位符与缺字、做初译；防止拼接句子破坏词序、漏复数、把翻译结果当母语审校、用最新完成的异步字符串覆盖已关闭 UI | 伪语言拉长、实际 CJK／目标 RTL 字形、运行时切换、格式参数、长按钮可点击；关键玩法和商店文案由人确认 |
| 平台适配与发布 | 一个目标平台可干净安装启动，存储／输入／分辨率／关闭恢复可用，资源都被打包，第三方许可清楚。可以不首发多平台、无需求不接账号／排行榜／联网 SDK | 性价比／本地／质量：✅ Unity [Build Profiles](https://docs.unity3d.com/6000.3/Documentation/Manual/build-profiles.html)与 UE [build/cook/stage/package](https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-your-project)原生路径；按实际需要再做 CI。⛔ 不把 Editor Play、模拟引擎测试或成功 Cook 当正式发行通过 | AI 可维护构建参数、资源清单和 smoke test；防止 Editor API 混运行时、IL2CPP/AOT/裁剪遗漏、路径大小写、只在开发机有资产、日志泄密 | 干净目标机离线首次启动，实际后端构建、权限拒绝、窗口／语言／设备变化、保存路径；商店与主机认证需对应真实权限和平台测试 |
| 编辑器扩展 | 批处理可预览、幂等、可撤回；导入后资源引用稳定。可以没有自建关卡编辑器／可视化编排平台 | 性价比／本地：✅ Unity [AssetPostprocessor](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetPostprocessor.html)、Inspector／UI Toolkit；UE [Editor Python](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python)、原生 Editor Utilities。质量路线是可靠小工具，不是更多面板；MCP 取舍交 WP9 | AI 非常适合写规格检查、批量导入和报告；防止递归 reimport、覆盖手工参数、破坏 GUID、所有资源一刀切、把编辑器 Python 当打包后运行时 | 同一批次执行两次差异为零；缺输入／坏素材中止且报告；Undo／回滚、Domain Reload 开关重入；干净导入和构建复核 |



## 3. 先验收五条跨模块边界

### 场景切换：取消等待不等于取消工作

**[研究] ✅ 采用一个持有加载句柄的所有者和请求代次：旧代结果只收尾，不得写入当前场景。** 可以继续用已有 Coroutine、Awaitable 或 UniTask；统一的是生命周期约定，不是把底层 API 的完成、取消和主线程时序抹成一样。

[Addressables 句柄契约](https://docs.unity3d.com/Packages/com.unity.addressables@2.7/manual/AddressableAssetsAsyncOperationHandle.html)要求使用结果期间保留句柄，失败也清理。[UniTask 固定源码](https://github.com/Cysharp/UniTask/blob/a77a1b4a89824fb6df293099de3060daf2a432c1/src/UniTask/Assets/Plugins/UniTask/Runtime/External/Addressables/AddressablesAsyncExtensions.cs)默认不在取消时 release；预取消会在接管句柄前返回。因此先处理预取消，创建 handle 后指定唯一释放者，不让自动释放和多个 finally 竞争。[一手]

**[研究] 不把 WithCancellation＋finally Release 当通用安全模板。** [#649](https://github.com/Cysharp/UniTask/issues/649)报告取消后池复用导致旧完成回调串线，固定源码仍有对应结构；它未有已确认修复，也未在本轮引擎复现。高频取消路径可先用原生完成通知或不提前取消底层等待，界面以代次拒绝旧结果，由持续存活的所有者完成收尾。业务 guard 不能独自证明库内不会错送结果。

场景激活也要单独规划：[activateOnLoad=false 阻塞异步队列](https://docs.unity3d.com/Packages/com.unity.addressables@2.7/manual/LoadingScenes.html)，不能等队列中其他加载完成后才激活。Unreal 的 [UE-207209](https://issues.unrealengine.com/issue/UE-207209)同样记录同帧交叉取消后完成回调仍可能运行；目标修复版不等于已经修好。[一手]

### 资源释放：所有权、驻留、总内存分别看

**[研究] ✅ 按常驻、关卡、临时对象划寿命，只为实测热区加池或缓存。** 池对象归还时取消旧工作、解绑事件、重置动画和输入，不能只等最终 Destroy。复制 handle 结构体也不等于新取得一次资源所有权。

Addressables 引用归零不保证马上释放物理内存；同 bundle 仍用的资产影响卸载，相邻关卡共享依赖反复释放／加载会产生 asset churn。[一手：[资源内存](https://docs.unity3d.com/Packages/com.unity.addressables@2.7/manual/memory-assets.html)] **[研究] 同时观察所有者／handle 数、实际资源驻留和设备峰值；不因缓存高水位直接宣布泄漏，也不因引用归零宣布达标。**

### 旧档升级：版本可读之外还要进度正确

**[研究] ✅ 稳定内容 ID＋schemaVersion／contentVersion＋逐版本迁移；先截取一致快照，保存失败不覆盖唯一原档。** 临时／备用槽如何提交和断电恢复，按目标平台验证。FromJson 成功、FormerlySerializedAs 或同版保存再读，都不能代替内容迁移。

ink 的 [CallStack 恢复源码](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/ink-engine-runtime/CallStack.cs#L52-L83)在剧情位置变化时可能抛错，也可能近似恢复并警告。[一手] **[研究] 旧档经过两次内容修改后，需断言剧情位置、可选项、库存与奖励；捕获恢复 warning，不能静默清档。**

### 输入与暂停：先关玩法权限，再切输入

**[研究] ✅ 先改变玩法权限状态，再禁用 gameplay map、清持续动作、开启 UI 导航；恢复时确认焦点。** [InputAction.Disable](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Actions/InputAction.cs#L967-L986)可同步触发 canceled，因此回调须允许重入，不能把系统取消都当主动松手发射。[一手]

[UI 输入](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/UISupport.html#distinguishing-between-ui-and-game-input)不自动阻止 gameplay 接收同一点击；[timeScale=0](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Time-timeScale.html)与 [AudioListener.pause](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioListener-pause.html)管不同时间域。[一手] **[研究] 蓄力开菜单、按住移动失焦、设备断连、菜单声音例外作为联合用例，而非各模块单独“正常”。**

### 设备预算：量最坏场景，不抄通用面数

**[研究] ✅ 先定最低设备、分辨率、帧率、内存与加载体验，再分配资源预算。** 60 fps 的帧间隔约 16.67 ms，30 fps 约 33.33 ms；这不是每模块各有一份预算，CPU／GPU／同步等待也不能简单混加。

Unity 官方支持[目标设备采样](https://docs.unity.com/en-us/engine/6000.5/manual/analysis/profiler/profiling-applications/profiling-target-device)，UE 使用 [Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine)。[一手] **[研究] 测冷启动、首次关卡／技能、峰值战斗、暂停菜单、关卡往返；记录帧时间分布和尖峰、稳态／峰值内存、音频并发、加载时间与包体。** 开发构建定位，发布构建复核；旧关卡、新关卡和解压缓冲短暂并存也要计入。

## 4. 借用的授权边界与升级条件

**[研究] 先采用原生系统，改造项目缺少的窄政策，不用大型模板充当默认底座。** Unity 原生／包遵循引擎及具体包条款；UniTask／ink 为 MIT，Input System 为 Unity Companion License，均不免除资产和第三方通知。Addressables-Sample 固定树未发现许可证文件，先作机制参考，不能当已清商用复制权限；[许可与维护账](../../docs/research/2026-10-14-game-wp10-client-modules.md#6-许可维护与采用边界)记录详细范围。

**[一手＋研究] Lyra 只推荐读公开机制说明，不默认下载后整包输入 Agent 或复制资源。** [Fab 官方页](https://www.fab.com/listings/93faede1-4434-47c0-85f1-bf27c0820ad0)标 UE-Only、Allows usage with AI: No；具体代码／内容仍须核对取得时的许可链。该标签不是禁止阅读普通公开文档，也不证明所有 UE 项目禁止 AI。

- **资源／异步**：从按项目大小决定框架，改为按驻留、分发和组合等待需求选择；锁定版本的取消竞态通过、收益明确时再扩大 UniTask／Addressables 使用
- **UI**：保留可用 uGUI；新布局密集项目评估 UI Toolkit。Unity [6.3 对照](https://docs.unity3d.com/6000.3/Documentation/Manual/UI-system-compare.html)已列 world-space／custom shader／RTL 能力，不能沿旧表永久排除；AnimationClip／Timeline 和现有 Prefab 仍影响迁移成本 [一手／研究]
- **存档**：跨内容修改的语义测试取代同版往返；只有产品明确接受版本清档／回退时才改变兼容承诺
- **动画／物理／音频**：先复用原生机制；只有接触、稳定性或交互音乐需求成为真实瓶颈，才加 IK／substep／中间件，不按功能数量升级
- **渲染／发布／编辑器**：目标设备不足先减少预算或定位热点；重复手工操作才做幂等小工具，无收益不扩为多平台和通用工具链

**[研究] 关键局限：资料和源码能约束选择，不能证明这些模块在同一游戏、最低设备和第二次内容修改后已经联合达到可发布质量。**
