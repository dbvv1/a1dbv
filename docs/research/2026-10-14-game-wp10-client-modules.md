主线：3「第二次、第五次修改仍可靠」／4「交付给玩家和维护者」，兼顾主线 2 的已有能力取舍
改变的建议：04 先完成有回应、可读、连续的核心动作，再以生命周期与设备预算保护迭代；区分输入延迟、容错、呈现插值和帧间隔
新证据：Input System 1.19 时序、Unity 6.3 插值／转场／平台呈现、三份许可分层的动作源码与 Dead Cells 作者复盘；保留原异步与存档证据

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
