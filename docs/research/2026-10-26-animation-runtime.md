# 角色动画运行时：选型与源码依据

默认保 Animator＋现有 Motor，先把步态、动作和接触调成完整链；Animancer 改善创作，Motion Matching 改善有足够覆盖时的姿态选择。
新增价值是按原因分脚滑、过渡与位移权，并给正常接入、内容二改和原生验证起点；不是再补一个播放器名单。
[正文](../../domains/game-dev/unity/04-animation-runtime.md)为研究第一版，未安装／运行 Unity、Unreal 或 Animancer；已读取公开官方文档、作者原帖与固定开源源码，不报告离线动画质量。

## 范围与现有覆盖

G2 的客户端动画在 04 主要是最低交付线、角色移动关联，资产页主要解决制作／重定向与导入；缺少从运动到混合、分层、根运动和实际调校的独立完整入口。服务端 07 已有网络模型、房间、账号／云档／排行、在线配置的完整链，本轮不重复。

三组后续有价值单元：编辑器内容生产工具（一个作者操作到可验证资产）；关卡／遭遇制作（节奏、空间与重玩）；平台适配与输入延迟（设备预算到发布构建）。先接收本模块，不把它们展开成新目录或工具登记。

## 1. 官方与产品：核的是接线条件，不是广告效果

| 来源 | 核实发现 | 影响决定 |
|---|---|---|
| Unity 6.0 [2D Blend Tree](https://docs.unity3d.com/6000.0/Documentation/Manual/BlendTree-2DBlending.html) | Simple Directional 不适合同方向多种速度；Freeform Directional 需要中心动作 | 先按走跑／侧移集合选树，不让 AI 任意选一种 2D 类型 |
| Unity [根运动](https://docs.unity3d.com/6000.0/Documentation/Manual/RootMotion.html)、[OnAnimatorMove](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/MonoBehaviour.OnAnimatorMove.html) | 导入根变换与运行时应用是不同环节，回调在动画求值后 | 先保位移唯一入口；特殊动作增量进入既有 Motor |
| Unity [分层](https://docs.unity3d.com/6000.0/Documentation/Manual/AnimationLayers.html)、Rigging [Multi-Aim](https://docs.unity3d.com/Packages/com.unity.animation.rigging@1.3/manual/constraints/MultiAimConstraint.html)／[Two Bone IK](https://docs.unity3d.com/Packages/com.unity.animation.rigging@1.3/manual/constraints/TwoBoneIKConstraint.html) | 遮罩、覆盖／叠加、目标／hint 有独立职责 | 瞄准先有基础姿态，最后修方向和持握接触 |
| Animancer [商店](https://assetstore.unity.com/packages/tools/animation/animancer-pro-v8-293522)、[下载](https://kybernetik.com.au/animancer/docs/download/)、[8.4](https://kybernetik.com.au/animancer/docs/changes/animancer-v8-4) | 实际商店为 8.4.0，2026-06-21；Extension Asset；开发者标测试 Unity 2022.3／6000.0；Lite 的 Editor 功能不代表构建全部免费 | 不沿用搜索容易返回的 8.1，不把付费播放器当免费 Motion Matching。未购买、未下载 |
| Epic [GASP](https://dev.epicgames.com/documentation/en-us/unreal-engine/game-animation-sample-project-in-unreal-engine)／[Fab](https://www.fab.com/listings/880e319a-a59e-4ed2-b268-b32dac7fa016) | 样例聚焦动画，玩法示例简单；Fab 本次许可字段为“-”，AI 使用字段为 No | 只按公开文档作技术参照，资产许可未完成核验，不取回／公开分发，也不推断跨引擎许可 |
| Epic [Mover 原帖](https://forums.unrealengine.com/t/any-roadmap-updates-on-mover/2833898)（2026-08-25） | 官方称仍有 API 改动，建议项目早期使用 | 新样例版本不能直接证明旧 CMC 工程应迁移 |

以上核实于 2026-10-26。Unity 6.0／Rigging 1.3.1 是说明使用的接口版本，不是要求项目升级或最新版本声明。

## 2. 真源码：Motion Matching 不只是搜索最近的一帧

读 [JLPM22/MotionMatching 固定 35fc8ee9a0fd97f12de458ea81eaef7c8219d87a](https://github.com/JLPM22/MotionMatching/tree/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a)（提交日期 2026-04-24），下载到一次性研究目录但未启动 Unity：

- `Runtime/Core/MotionMatchingController.cs`：订阅控制器更新；构造并归一化查询向量，按策略搜索，姿态切换后惯性化，更新根与骨架后再做 foot lock。`OnInputChangedQuickly` 可以提前触发搜索；固定搜索节拍不是输入只能等那一拍。
- `Runtime/CharacterController/SpringCharacterController.cs`：轨迹预测和响应参数独立于姿态选择；`AdjustMotionMatching`／`ClampMotionMatching` 约束动画角色与控制器的差异。不能只抄搜索器而忽略这层。
- `Runtime/Unity/SimpleMMController.cs`：把数据、Spring controller、MotionMatching controller、SkinnedMeshRenderer 连起来，`SetVelocity` 进入既有运动方向入口，是最小接线阅读起点，不是完整玩家控制器。
- `Samples~/Examples/Scripts/Input/InputCharacterController.cs`：输入事件转交角色控制器，开关 tag query；输入／姿态／筛选分开，便于替换消费者。
- `package.json` 是 0.3.2、`unity: 2020.1`，README 却明确 Unity 6+、其他版本未测试；采用按 README 和自己的构建验，不凭 manifest 声称旧版本兼容。依赖已有 Burst、Input System、Splines，接入需看项目包冲突。
- 根 `LICENSE` 为 MIT；README 指向作者的 Environment-aware Motion Matching（SIGGRAPH Asia 2025）及研究采用，属于可读机制和研究实现证据，不是已发行独立游戏性能证明。动作数据来源与目标项目许可仍须单独核。

采用判断：**👀 学机制／隔离候选，未采用到生产**。仓库源码、研究使用与近期修复足以支持具体入口和职责分析；缺少本项目原生帧时间、接触效果、动作生产成本，不宣称比 Animator／Animancer 更省工。

## 3. 开发者实践与反证

[2026-04-25 Animancer＋CCP 作者原帖](https://www.reddit.com/r/Unity3D/comments/1sv9e62/i_tried_adding_some_environmental_interaction/)完整读取了作者与评论：作者明确没有 Motion Matching，使用状态机／分层；自由度高但 API 与逐动作配置工作不小。评论也质疑写实动作与小比例卡通角色是否匹配。这改变正文两处：工具选择和动作风格分开；骨架能重定向不等于角色动作语言合适。作者“唯一可行方案”的主观判断未采用。

Unity [2025 夏季官方／社区原帖](https://discussions.unity.com/t/animation-status-update-summer-2025/1672386/1)区分了在 Survival Kids **发行后**用工程做验证与游戏实际生产采用；正文不把该项目写成新工具商业落地。性能数字是官方特定场景，不拿来预估读者项目收益。

中文渠道读取 Unity 官方社区 [2025-11-10 AnimGraph／RigGraph 原文](https://developer.unity.cn/projects/6911648dedbc2a001c3309f1)：网页解析正文为空，公开 HTML 的 `markdownBody` 可读，明确是团结引擎 1.7.0_preview 起的功能。它不能证明全球 Unity 6 的相同系统已发布；据此在正文留下产品线区分，不转录营销式“完美解决”结论。中文实战根运动文章检索到作者稿但正文抓取失败，未作为事实依据。

探索回执：截止 2026-10-26，查 Unity／Epic／Animancer 官方，Unity Discussions、Reddit 作者讨论及中文 Unity 开发者社区，固定 JLPM22 源码；中文实战稿与 TUNIC 网站无法读取，Death's Door 发行商页返回 403（未重试），Fab 许可正文未呈现。优秀独立作品只列预定的质量参照，不声称完成该作品逐帧评测；技术对照来自官方样例说明。Unity 新动画工具当前全部生产状态与跨作品最优方案未能确立。

## 4. 接收与尚待验证

正文完整提供默认与替代、现有项目接缝、步态／层／根运动正常链、调校、两轮 AI 实施任务和验证问题。因为没有启动原生引擎，本轮不制作伪造的 Animator 测试、动画帧时间或软件 WebGL 替代证明。

原生接收应在采用该模块的工程恢复引擎执行后做：一名角色的正常链；双手武器／矮角色二改；目标设备 Profiler 与同镜头实玩。未有真实消费者时保留研究版本，不要求当前网页案例迁移，也不启动被暂停的引擎任务。
