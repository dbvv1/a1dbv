# 客户端核心模块：让操作有回应，让体验连续

> 核实：2026-10-14 UTC。Unity 主线、Unreal 对照；面向单人程序，无人工美术与音频修补。资产导入见 [01](01-engine-integration.md)，生成供给见 [03](03-generative-ai-in-games.md)。固定源码、反证、许可与验证范围见 [WP10 研究记录](../../docs/research/2026-10-14-game-wp10-client-modules.md)。

## 30 秒结论：先把核心动作做舒服

| 眼前问题 | 默认先做 | 何时增加能力 |
|---|---|---|
| 移动、跳跃或攻击已经能运行，但不好玩 | 先调响应、动作节奏和结果辨识，做完整的一次操作 | 卡在具体体验缺口后加容错、转场或演出 |
| 还没有可玩的第一版 | 一套设备、原生输入/UI/物理、窄存档格式 | 明确缺口后再加库 |
| 换场景后对象或声音残留 | 明确所有者、取消、释放及退出顺序 | 原生加载已不够才考虑资源层 |
| 存档能读但进度不对 | 稳定内容 ID、格式版本与迁移回归 | 实际跨版本需求出现后扩迁移 |
| 平均 FPS 好但首次技能会卡顿 | 分清加载、激活、GPU 上传与首次绘制；准备下一场遭遇必需的反馈 | 按尖峰来源选 PSO 预热、分批初始化或有上限的池，别把缺失画面当顺滑 |
| 要支持更多平台 | 先补该平台构建、输入与恢复验收 | 不先造跨引擎抽象 |

**[研究] 高质量首先是玩家想做的动作能自然发生、看得懂结果、愿意再做一次。** 动作游戏通常先打通输入响应→可读反馈→稳定帧间隔，再扩演出；已经明显卡顿时先清掉尖峰，节奏／音乐游戏则把时序与音画同步提前。AI 可补实现、参数对照与检查，人决定动作的轻重、容错范围和体验门槛。

## 1. 单人项目先借引擎，再补确实缺少的一层

**[研究] ✅ 采用：第一版只承诺一套目标设备和输入方式，以引擎原生组件完成可发布的最小行为。** 必须先明确最低设备、帧率／分辨率、内存上限、保存失败策略和菜单可达性。网络同步仅在玩法需要时引入；不要为了将来扩展先加 ECS、自研资源管理器、通用存档框架或跨引擎抽象。

这里的「最佳质量」指该玩法下有较高能力上限的条件路线，不是无实测的排行榜；「最佳性价比」计入单人集成、调试、升级和第二次需求修改成本；「本地／免费」指无需另购模块，不表示引擎或第三方资产没有授权条件。三个档位可以是同一原生方案，不能为凑三档而引进三个框架。

**最重要的边界：await 返回、场景可用、句柄释放、物理内存下降，是四个不同事件；能加载旧文件、能够恢复同一玩家进度，也是两回事。**

### 先做完整动作：响应、反馈和顺滑分别解决什么

**[研究] ✅ 先精修一个高频动作，再扩内容。** 对 2D 动作游戏，先做到起步／停步／转向有明确性格，跳跃高度与落点可控，命中／落空可分辨；对 3D 第三人称，先做到方向输入、角色位移、转身与接触姿态协调。轻快平台跳跃与强调承诺的重武器战斗不应共用“越快越好”的参数，质量来自玩家意图与游戏规则一致。

| 当前基线 → 需要增加的信号 | 采用什么；想得到的体验 | 代价、撤回和维护边界 |
|---|---|---|
| 按键已映射，但跳跃／闪避像晚了一拍 | ✅ 先缩短输入到动作被接受、到首个可见／可听回应的路径。Unity Input System 1.19 对低延迟需求推荐 Dynamic Update；物理仍可在 FixedUpdate 消费保存的输入 | 连续方向可保存最新值；离散按下要记录并消费一次。别在多个 FixedUpdate 重复使用同一渲染帧的按下，也别让零次 FixedUpdate 丢掉短按。玩法的蓄力／前摇保留，去掉的是意外等待 [一手／研究：[输入时序](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/timing-optimize-fixed-update.html)] |
| 边缘跳跃／落地前短按频繁被玩家当成“没按出来” | 🧪 加短期输入缓冲或离地宽限，让意图连续；分别规定有效期、消费、失效条件。前者保存尚不可执行的指令，后者暂时延长可跳资格 | 它们是玩法容错，不是降低设备延迟。若产生意外自动跳／过期攻击，缩短窗口或收窄适用状态；不能给所有动作统一毫秒值。Celeste 与 Dead Cells 的机制是案例，不是本项目调参答案 [一手／研究：[Celeste 源码](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs)、[作者复盘](https://media.gdcvault.com/gdc2019/presentations/Benard-Sebastian-DeepCells.pdf)] |
| 状态立即改变，画面却迟迟转过去或姿态突然弹跳 | ✅ 先调整原生 Animator 的转场时长、Exit Time 和打断规则；2D 可用少量清楚的起手／命中／收招姿态，3D 先校准位移速度与步态，再做 Blend Tree | 过长混合会冲淡攻击接触瞬间；全部可打断会抹掉战斗承诺。只有接触缺口明确时🧪加 Animation Rigging／IK；骨架和基础动作不合格时，更多约束不能代替资产修正 [一手／研究：[6.3 转场](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Transition.html)、[Rigging 1.4.1](https://docs.unity3d.com/Packages/com.unity.animation.rigging@1.4/manual/index.html)] |
| 能造成伤害，但不知道打中了谁、轻击还是重击 | ✅ 从同一次已确认的结果触发清楚的受击姿态、位置明确的短特效和对应声音；先区分命中、护甲／格挡、落空，再🧪加顿帧、震动和拖尾 | 每个效果服务于辨识或力度。群攻／连击出现遮挡、疲劳或失去控制时先减强度和并发；纯视觉后坐力不应顺手改碰撞体。以动作配置收拢时序、强度和开关，别建通用“打击感框架” [一手／研究：[可切换演示及源码](https://deepnight.net/games/game-feel/)] |
| FPS 很高，移动仍抖；或首发技能明显顿一下 | ✅ 区分模拟姿态不连续与真正的长帧：前者检查物理／呈现节奏并按需插值，后者定位加载、分配、渲染等热点。目标是均匀可预测的动作轨迹和呈现节奏 | Rigidbody Interpolate 会让可见姿态落后一个物理步，Extrapolate 可越过碰撞边界再纠正；两者都不是消除长帧的办法。只给有问题的对象加，不能靠全局提高物理频率掩盖问题 [一手／研究：[6.3 插值](https://docs.unity3d.com/6000.3/Documentation/Manual/rigidbody-interpolation.html)] |

**[研究] 把“丝滑”拆开调，才不会一个改善抵消另一个。** 输入延迟关心按下到被处理；玩法响应关心指令何时允许生效；模拟时间决定碰撞／位移如何推进；呈现插值决定画面展示哪一段姿态；帧间隔方差决定玩家看到的更新是否均匀。引擎内时间戳能定位软件链路，不能直接称为按键到屏幕发光的端到端延迟。相机跟随与取景另见 [05](05-gameplay-architecture.md#8-相机先让玩家看懂并控得住再增加镜头语言)。

**[研究] 顿帧要保住下一次输入和清楚的节奏。** 决定冻结哪些角色／动画／特效、输入缓冲是否继续接收以及用哪种时间过期、声音与界面是否继续；同帧多命中采用有上限的合并策略，避免持续刷新成长期失控。纯演出关闭后应仍能理解命中；若顿帧承担规则上的反应窗口，就明确作为玩法配置维护。Deepnight 演示会用开关改变控制锁定、物理后坐力和动画预备时间，因此“全开对全关”不等于只比较美化效果，细节见 [WP10](../../docs/research/2026-10-14-game-wp10-client-modules.md#体验质量深化响应与顺滑让同一个动作值得反复玩)。

**[研究] 较易维护的起点是保留可退回的手感基线。** 保存一组已选动作参数，让 AI 每次只改“起步更利落”“重击接触更清楚”等具体目标，说明同时改变了哪些规则；对照移动、命中、连续攻击和重开后的完整动作。采样计划同时记录输入／动作／反馈时刻、帧时间分布与长帧发生位置，人试玩确认是否更可控、更易读、更有力度。不要把特效数、动画帧数或平均 FPS 当质量评分。

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



### 3D 角色运动：先选想要的控制，再选碰撞求解方式

**[研究] 以下先比较 Unity GameObject 路线。✅ 普通直立角色、接触规则简单且原生坡／阶能力已够用时，先用原生 CharacterController；已经好用的 Rigidbody 控制器不为统一架构重写。** “有重量”可以来自加减速、转向承诺、步态与受击恢复，不必让全部运动交给物理。希望玩家被箱子、摆锤和冲量自然影响，才把动态响应作为核心要求；希望台阶、斜坡和旋转平台遵守精确玩法规则，则重点比较 motor 的接地与平台政策。

| 想得到的动作 | 采用／改造选择 | 实际增加的责任与撤回条件 |
|---|---|---|
| 起停利落、贴墙滑动、常规台阶和斜坡，受击距离可编排 | ✅ 原生 CharacterController + 小型运动脚本 | Move 接收位移、处理碰撞，但不施加重力，也不自动响应力／推刚体；平台跟随、离台继承速度和击退由项目定义。不要把 isGrounded 当独立持续探地，它描述最近一次 Move 的结果 |
| 角色与道具的质量、冲量、摩擦相互作用就是玩法 | 🧪 力驱动的动态 Rigidbody | 接地、可走坡、台阶仍需规则；控制加速度与摩擦可能改变推箱／击退结果。若不断清掉物理响应才能保持落点，改成显式运动政策，不用提高全局迭代数硬补 |
| 需要原生刚体接触，又希望速度和台阶表现可预测 | 🧪 速度驱动的动态 Rigidbody，保留已有成熟实现 | 是实用折中，但每步覆盖速度会覆盖未合入的外力；把移动、重力、平台和击退贡献收进同一所有者。CMF／SRMove 展示这种路线，不能因组件是 Rigidbody 就承诺自然保留冲量 |
| 稳定下坡、台阶贴地、旋转平台与起跳动量需要更细控制 | 🧪 先评估现成 kinematic motor，再决定是否补原生层 | 接管 sweep／滑动、ground snap、去穿透及平台附着政策，并承担依赖与升级回归；只有缺口减少、修改仍局部时才保留。不要只为“更高级”从零写 motor |

[一手] 上述原生契约见 Unity 6.3 [CharacterController](https://docs.unity3d.com/6000.3/Documentation/Manual/class-CharacterController.html)、[Move](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController.Move.html)、[isGrounded](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController-isGrounded.html)及 [linearVelocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-linearVelocity.html)。Unity 的另一个 [Character Controller 1.4.5 包](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/index.html)面向 ECS，不是给 GameObject 原生组件加功能的即插即用升级。[研究] 普通单人项目不为一个平台切换整套 ECS。

**[研究] 不等平台补丁互相打架才找现成方案。** 需求已同时包含持续贴地、旋转平台跟随与离台动量时，先比较现成 motor 的对应接口，再写项目适配；[ECM2 文档](https://oscar-gracian.gitbook.io/easy-character-movement-2/user-manual/general/components/character-movement)已把平台平移、朝向继承和离台速度分开，并提供主动离地的接地控制入口（方法随版本变化）。[一手] 🧪 ECM2 是有条件的商业候选，Philippe St-Amand 的 KCC 是需自担兼容维护的免费候选；二者的版本、接入与 AI 使用授权边界见 [WP10](../../docs/research/2026-10-14-game-wp10-client-modules.md#现成-motor-补比先借已有平台机制再决定补什么)。商店版本与在线文档存在差异，先按实际取得包核对 API；公开接口比对不能证明任一候选在本游戏更好。

**[研究] 接触质量先验四件事：** 下坡／下台阶不无故腾空，上坡速度符合设计，平台转动时站位与起跳方向可信，受击后输入既不瞬间抹掉击退也不意外长期失控。平台的“站着跟随”“离开继承速度”“被侧面挤压”分别定规则；旋转平台要考虑平台角速度对接触点线速度的贡献，不能只加平台平移速度。Unity [GetPointVelocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.GetPointVelocity.html)包含角速度。[一手] 简单 parenting 只解决一种跟随方式，碰撞、旋转继承与脱离还需验证。

**[研究] root motion 是位移来源，由唯一运动控制者提交给碰撞求解。** 动态 Rigidbody 的最终位置仍由物理求解器决定，motor 负责组织力／速度请求； 自由移动可由代码定速度、动画跟随；攻击突进可由动画提供期望位移，再经 motor 约束。不要让 Animator、脚本和平台各自写最终 Transform；撞墙后用实际运动校准步态／动作，不能把脚滑全部交给 IK。后续在真实关卡试玩坡顶、窄台阶、低顶跳跃、升降／旋转平台、边缘受击及 root-motion 撞墙，再修改台阶高度或击退规则，确认控制精度和重量感仍一致。固定源码、许可、反例与维护代价见 [WP10 运动比较](../../docs/research/2026-10-14-game-wp10-client-modules.md#3d-运动补研控制精度接触连续性与物理重量的取舍)；本轮资料比较不能替代目标版本的手感验证。


#### Unreal：先扩展 CharacterMovement，不搬 Unity 的 motor 调度

**[研究] ✅ 常规胶囊角色先用 ACharacter＋CharacterMovementComponent（CMC）。** Unity 原生 CharacterController 留给项目组织的重力、运动模式和平台政策，不能照搬成 UE 的待建模块。CMC 已在自己的更新路径组织这些责任；先调原生参数、复用运动模式，特殊攀爬／冲刺再评估局部扩展，而非另起 Tick 脚本直接搬 Actor。官方把 CMC 列为已有大量发行项目验证的路线；这不是任意玩法都无需修改的保证。[一手：[CMC／Mover 对比](https://dev.epicgames.com/documentation/unreal-engine/comparing-mover-and-character-movement-component-in-unreal-engine?lang=en-US)]

| 同一个玩家目标 | Unity 的实现责任 | Unreal 的实现责任与误搬成本 |
|---|---|---|
| 短按被接受，走／落／跳之间连贯 | 输入采样与 motor／物理消费时序分开；离散输入只消费一次 | CMC 沿 TickComponent／PerformMovement 及运动模式推进；别把 FixedUpdate 规则翻译成另一个定时器，与原生更新重复推进 |
| 离开旋转平台时动量可信 | 按实际控制器选平台跟随、接地点速度与脱离政策 | 先用 movement base 及离台速度配置；另外叠一遍平台速度可能双算。原生有机制不代表挤压／特殊平台已符合玩法 |
| 攻击突进碰墙后仍可控 | 动画位移经既有 motor／碰撞层提交 | 动画 root motion 交给 Movement Component；程序化临时位移可评估 Root Motion Sources（RMS）。技能决定开始／取消／恢复控制，不能另写最终 Actor transform |

[一手] CMC 的更新、模式和 RMS 见 [运动机制](https://dev.epicgames.com/documentation/en-us/unreal-engine/understanding-networked-movement-in-the-character-movement-component-for-unreal-engine)；离台速度已有 [GetImpartedMovementBaseVelocity](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UCharacterMovementComponent/GetImpartedMovementBaseVelocity)。[研究] RMS 是 CMC 的位移机制，GAS 是可选的技能组织层，不能为一次突进强制引入 GAS。只有玩法要联网时，才补预测／校正验收；单机不先造同步框架。

**[研究] 👀 Mover 是有条件评估项，不是 CMC 的默认升级。** 核实至 2026-10-14，UE 5.8 已正式发布，但 [5.8 Mover](https://dev.epicgames.com/documentation/unreal-engine/mover-in-unreal-engine?application_version=5.8)仍标 Experimental。确需更灵活形体、模块化运动或物理网络回滚，且能承担 API 变更，才评估；已有 CMC 控制器不因“下一代”重写。Mover 需把输入汇入模拟步命令，不能任意改 velocity；这是更新和状态所有权的迁移，不是换组件名。[一手／研究] 版本、Lyra 可借机制、动画样例边界与未来验收见 [WP10 对照](../../docs/research/2026-10-14-game-wp10-client-modules.md#5-unreal-对照同样的动作不同的引擎责任)。

## 3. 先验收五条跨模块边界

### 场景切换：取消等待不等于取消工作

**[研究] ✅ 明确加载／驻留所有者和请求代次：按所用 API 保留必要句柄，旧代结果只收尾，不得写入当前场景。** 可以继续用已有 Coroutine、Awaitable 或 UniTask；统一的是生命周期约定，不是把底层 API 的完成、取消和主线程时序抹成一样。

[Addressables 句柄契约](https://docs.unity3d.com/Packages/com.unity.addressables@2.7/manual/AddressableAssetsAsyncOperationHandle.html)要求使用结果期间保留句柄，失败也清理。[UniTask 固定源码](https://github.com/Cysharp/UniTask/blob/a77a1b4a89824fb6df293099de3060daf2a432c1/src/UniTask/Assets/Plugins/UniTask/Runtime/External/Addressables/AddressablesAsyncExtensions.cs)默认不在取消时 release；预取消会在接管句柄前返回。因此先处理预取消，创建 handle 后指定唯一释放者，不让自动释放和多个 finally 竞争。[一手]

**[研究] 不把 WithCancellation＋finally Release 当通用安全模板。** [#649](https://github.com/Cysharp/UniTask/issues/649)报告取消后池复用导致旧完成回调串线，固定源码仍有对应结构；它未有已确认修复，也未在本轮引擎复现。高频取消路径可先用原生完成通知或不提前取消底层等待，界面以代次拒绝旧结果，由持续存活的所有者完成收尾。业务 guard 不能独自证明库内不会错送结果。

场景激活也要单独规划：[activateOnLoad=false 阻塞异步队列](https://docs.unity3d.com/Packages/com.unity.addressables@2.7/manual/LoadingScenes.html)，不能等队列中其他加载完成后才激活。Unreal 的 [UE-207209](https://issues.unrealengine.com/issue/UE-207209)同样记录同帧交叉取消后完成回调仍可能运行；目标修复版不等于已经修好。[一手]

### 资源释放：所有权、驻留、总内存分别看

**[研究] ✅ 按常驻、关卡、临时对象划寿命，只为实测热区加池或缓存。** 池对象归还时取消旧工作、解绑事件、重置动画和输入，不能只等最终 Destroy。复制 handle 结构体也不等于新取得一次资源所有权。

Addressables 引用归零不保证马上释放物理内存；同 bundle 仍用的资产影响卸载，相邻关卡共享依赖反复释放／加载会产生 asset churn。[一手：[资源内存](https://docs.unity3d.com/Packages/com.unity.addressables@2.7/manual/memory-assets.html)] **[研究] 同时观察所有者／handle 数、实际资源驻留和设备峰值；不因缓存高水位直接宣布泄漏，也不因引用归零宣布达标。**

**[一手／研究] UE 不应机械套用 Addressables 的逐次获取／释放约定。** [LoadPrimaryAssets](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAssetManager/LoadPrimaryAssets)由 Asset Manager 保持驻留直到显式卸载，不要求调用者保留返回句柄；[PreloadPrimaryAssets](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAssetManager/PreloadPrimaryAssets)却要求保留句柄，且不受普通 Unload／ChangeBundleState 影响。✅ 已确定的内容沿用原生 Load／Unload；试探性准备下一房间才按需要用 Preload，并明确交接。多个菜单共享内容时，由共同所有者协调退出，不把每个菜单关闭都翻译为卸载同一 Primary Asset；第二次打开的无新增工作路径也要验收，详见 [WP10 所有权对照](../../docs/research/2026-10-14-game-wp10-client-modules.md#资源所有权补比load-与-preload-不能共用退出政策)。

### 旧档升级：版本可读之外还要进度正确

**[研究] ✅ 稳定内容 ID＋schemaVersion／contentVersion＋逐版本迁移；先截取一致快照，保存失败不覆盖唯一原档。** 临时／备用槽如何提交和断电恢复，按目标平台验证。FromJson 成功、FormerlySerializedAs 或同版保存再读，都不能代替内容迁移。

ink 的 [CallStack 恢复源码](https://github.com/inkle/ink/blob/35c63e52f1d36060930dc7ed3cfba38ea224b528/ink-engine-runtime/CallStack.cs#L52-L83)在剧情位置变化时可能抛错，也可能近似恢复并警告。[一手] **[研究] 旧档经过两次内容修改后，需断言剧情位置、可选项、库存与奖励；捕获恢复 warning，不能静默清档。**

### 存档复用：借序列化与存储能力，自己决定哪些进度能恢复

**[研究] ✅ 小型 Unity 存档保留显式 DTO＋JsonUtility；确需字典／JSON 树迁移时采用项目兼容的 [Newtonsoft 包](https://docs.unity3d.com/Packages/com.unity.nuget.newtonsoft-json@3.2/manual/index.html)，不另写序列化器。UE 保留 SaveGame 的槽位与平台存储接口。** 内容迁移、落盘提交、玩家恢复是三个不同责任；无须为它们建立通用对象图框架。已有 Easy Save 项目可复用其缓存写入和备份 API，但其 [CreateBackup](https://docs.moodkie.com/easy-save-3/es3-api/es3-methods/es3-createbackup/)会覆盖旧备份，不能把“每次保存后备份一次”当作已保住上一份可用进度。[一手]

**[研究] 先保住已验证可用的旧档，再允许重试、迁移后自动保存或清理旧槽。** 恢复候选分别经过完整读取与内容校验，失败不把默认新游戏写回原槽；让玩家知道恢复到了哪个时间／章节，并可保留原文件。真实游戏 [Mindustry 的 SaveIO](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/io/SaveIO.java)有写入前移备份、读取失败后退备份，但存档列表的有效性检查只读 metadata；因此“列表看得到”不能作为完整恢复成功的证据。[一手]

**[研究] 第二次改关卡位置时，除了内容 ID，还检查存储地址和附属进度是否一起变化。** Mindustry 的 [sector remap](https://github.com/Anuken/Mindustry/blob/17012d61d9e4c3cbd9820d87e81c24495486ac53/core/src/mindustry/game/Saves.java#L120-L199)先暂存再回填，允许两个关卡交换位置；可借这个迁移顺序，不能把其 Java／Arc 世界保存模块直接移植成 Unity 底座。只补项目需要的迁移和恢复政策；源码、商业候选许可及中断验收见 [WP10 补比](../../docs/research/2026-10-14-game-wp10-client-modules.md#存档复用补比序列化落盘与玩家恢复分开选)。上述机制未在本轮真实引擎／断电环境验证。

### 输入与暂停：先关玩法权限，再切输入

**[研究] ✅ 先改变玩法权限状态，再禁用 gameplay map、清持续动作、开启 UI 导航；恢复时确认焦点。** [InputAction.Disable](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Packages/com.unity.inputsystem/InputSystem/Runtime/Actions/InputAction.cs#L967-L986)可同步触发 canceled，因此回调须允许重入，不能把系统取消都当主动松手发射。[一手]

[UI 输入](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/UISupport.html#distinguishing-between-ui-and-game-input)不自动阻止 gameplay 接收同一点击；[timeScale=0](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Time-timeScale.html)与 [AudioListener.pause](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioListener-pause.html)管不同时间域。[一手] **[研究] 蓄力开菜单、按住移动失焦、设备断连、菜单声音例外作为联合用例，而非各模块单独“正常”。**

### 设备预算：量最坏场景，不抄通用面数

**[研究] ✅ 先定最低设备、分辨率、帧率、内存与加载体验，再分配资源预算。** 60 fps 的帧间隔约 16.67 ms，30 fps 约 33.33 ms；这不是每模块各有一份预算，CPU／GPU／同步等待也不能简单混加。

Unity 官方支持[目标设备采样](https://docs.unity.com/en-us/engine/6000.5/manual/analysis/profiler/profiling-applications/profiling-target-device)，UE 使用 [Insights](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine)。[一手] **[研究] 测冷启动、首次关卡／技能、峰值战斗、暂停菜单、关卡往返；记录帧时间分布和尖峰、稳态／峰值内存、音频并发、加载时间与包体。** 开发构建定位，发布构建复核；旧关卡、新关卡和解压缓冲短暂并存也要计入。

**[一手／研究] 帧率上限还要与平台呈现方式配套。** Unity 6.3 [targetFrameRate 文档](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-targetFrameRate.html)指出桌面软件限帧可能 microstutter，追求稳定帧间隔时优先按 vSyncCount 路径配置；这不是最低输入延迟的通用保证，仍需结合显示器／同步设置。Android 用 targetFrameRate，并评估引擎已集成的 [Optimized Frame Pacing](https://developer.android.com/games/sdk/frame-pacing)，不要另接一套 Swappy。显示刷新率、提交队列和负载共同影响实际呈现，不能仅凭“CPU 每帧不到预算”判定已经顺滑。稳定低档与更高帧率之间按目标设备的持续负载、发热和玩法取舍。

### 首次技能：准备到能回应，而不只是加载完成

**[研究] ✅ 把下一场遭遇必需的角色、攻击提示和技能反馈提前准备好；不要默认在启动时预热整款游戏。** 以“首次进入房间，立刻闪避并释放新技能”为目标：资源取得、实例初始化、GPU 上传、首次绘制都可能花时间。玩家按下后应及时看见动作和关键提示；若准备尚未完成，优先在遭遇开始前用可理解的转场等待，或提供预先准备、语义等价的简化反馈，不让伤害已经生效而攻击提示仍不可见。

| 尖峰实际落点 | 先采用的窄方案 | 代价与撤回条件 |
|---|---|---|
| 首次绘制出现 shader／PSO 创建 | 🧪 Unity 6.3 的实验性 GraphicsStateCollection 按目标平台／图形 API 采集，分关卡或技能组预热；支持逐批调度。DX12／Vulkan／Metal 不把旧 ShaderVariantCollection.WarmUp 当完整 PSO 覆盖 | 预热占用启动时间和资源；新材质、keyword、渲染状态或质量档增加后补采。只优化已确认的首次绘制热点；若加载时间变差而首发尖峰未降，回到 trace 查真正原因 [一手／研究：[原生预热](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-prewarm.html)、[旧方法边界](https://docs.unity3d.com/6000.3/Documentation/Manual/shader-prewarm-other.html)] |
| 加载结束或启用对象时卡 | ✅ 先移走激活时的重初始化，分批准备实例；区分主线程 integration 与纹理／网格上传，再调各自时间预算 | async 不代表所有步骤都离开主线程。Unity backgroundLoadingPriority 只在 Player 生效；提高它可能更快加载却打断当前操作。纹理可读写、Resources 位置及 LoadImage 等会影响异步上传资格，不先换 await 库 [一手／研究：[integration](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-backgroundLoadingPriority.html)、[上传条件](https://docs.unity3d.com/6000.3/Documentation/Manual/LoadingTextureandMeshData-make-compatible.html)] |
| 连发时反复创建／分配并伴随 GC 尖峰 | ✅ 先减少热路径临时分配，再为确实重复的弹体／特效使用原生 ObjectPool；遭遇前实际创建所需实例，并明确并发上限及耗尽政策 | defaultCapacity 只预留内部存储，maxSize 不限制已借出的并发实例；单设两个数字并未预热。池使对象及依赖继续驻留，缩小／清理不再需要的池，而非为每种技能永久囤积峰值数量 [一手／研究：[池构造契约](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Pool.ObjectPool_1-ctor.html)] |

**[一手／研究] Unreal 的对照说明“帧不中断”仍可能回应失败。** 当前 [PSO Precaching](https://dev.epicgames.com/documentation/unreal-engine/pso-precaching-for-unreal-engine)可在 PSO 未就绪时延迟 proxy（因此暂不绘制）或显示默认材质；对关键攻击预警，这些不是免费优化。先让所需组件／PSO 在遭遇前准备，只有定位到自动覆盖遗漏才补 bundled PSO；[Tom Looman 的 Windows DX12 实作](https://tomlooman.com/unreal-engine-psocaching/)同时记录旧版遗漏及 5.6 覆盖改进，不能照搬 5.3 的缺口结论到新版本。

**[研究] 第二次修改就新增一种不同材质／渲染状态的技能。** 分别检查冷缓存首发、同进程第二次施放、重启后的热缓存，以及切画质后的首发；记录首个有效反馈时刻、对应长帧、准备时间和峰值／留存内存。只有首发响应改善且等待、内存和画面完整性仍在预算内，才保留预热或池化扩大范围。AI 可补采集路径、初始化分批和反馈记录，人决定何时允许开始遭遇、简化反馈是否仍清楚；原生选项与作者 trace 不能代替目标设备验证，详细范围见 [WP10](../../docs/research/2026-10-14-game-wp10-client-modules.md#首发帧时间补研从资源已加载到动作可见)。

### 菜单也是控制的一部分

**[研究] 先保证暂停、改键和返回之后仍知道“我选中了什么、这个键会做什么”。** 手柄／键盘进入菜单应有可见的有效焦点；弹窗只由当前层处理确认／返回，关闭后回到原来的有效选项，原项被移除则选明确后备项。重绑定期间显示取消方式，不能把确认／返回全改没；换设备后提示应对应实际绑定，恢复游戏不能沿用菜单里的残留移动／蓄力。Celeste 的[官方更新记录](https://www.celestegame.com/changelog.html)曾修复改键菜单在教程中冻结、关菜单后方向输入未刷新，并移除与自定义绑定冲突的硬编码重开组合键：菜单边界会直接破坏玩法控制，不只是外观问题。[一手]

**[研究] ✅ 保留能完成这些路径的原生 UI，先改造官方样例而非重写输入路由。** [UI vs Game Input 源码](https://github.com/Unity-Technologies/InputSystem/blob/05e45ddbaf18a93245b068d787d74b738b90d01c/Assets/Samples/UIvsGameInput/UIvsGameInputHandler.cs#L304-L345)已有模式切换与导航选择恢复；复用这些机制，再补样例未覆盖的无效焦点与嵌套返回。 uGUI 的导航关系、UI Toolkit 的焦点与事件足以支持简单菜单；前者要防背景点击丢选择，后者重新启用 UIDocument 时须重新建立焦点，不能只验首次打开。🧪 当第二个菜单／弹窗又复制输入归属、返回和恢复逻辑时，再抽共享管理；UE 可评估 CommonUI 的激活层与输入路由，但它仍沿用 UMG 导航规则，不会自动选出合理焦点。版本条件和直接证据见 [WP10](../../docs/research/2026-10-14-game-wp10-client-modules.md#菜单补研跨暂停改键与设备切换保住控制)。

**[研究] 第二次修改加一个带滑条、确认弹窗的设置页，再改键并换设备走回来。** 同时检查导航顺序、可见焦点、当前按键提示、返回目标和角色状态；不能用直接调用按钮回调代替真实输入路径。AI 可生成规则、绑定与回归路径，人判断焦点／反馈是否清楚、操作是否费力；本轮资料比较不能证明目标设备上的完整可用性。

## 4. 借用的授权边界与升级条件

**[研究] 先采用原生系统，改造项目缺少的窄政策，不用大型模板充当默认底座。** Unity 原生／包遵循引擎及具体包条款；UniTask／ink 为 MIT，Input System 为 Unity Companion License，均不免除资产和第三方通知。Addressables-Sample 固定树未发现许可证文件，先作机制参考，不能当已清商用复制权限；[许可与维护账](../../docs/research/2026-10-14-game-wp10-client-modules.md#6-许可维护与采用边界)记录详细范围。

**[一手＋研究] Lyra 只推荐读公开机制说明，不默认下载后整包输入 Agent 或复制资源。** [Fab 官方页](https://www.fab.com/listings/93faede1-4434-47c0-85f1-bf27c0820ad0)标 UE-Only、Allows usage with AI: No；具体代码／内容仍须核对取得时的许可链。该标签不是禁止阅读普通公开文档，也不证明所有 UE 项目禁止 AI。

- **资源／异步**：从按项目大小决定框架，改为按驻留、分发和组合等待需求选择；锁定版本的取消竞态通过、收益明确时再扩大 UniTask／Addressables 使用
- **UI**：保留可用 uGUI；新布局密集项目评估 UI Toolkit。Unity [6.3 对照](https://docs.unity3d.com/6000.3/Documentation/Manual/UI-system-compare.html)已列 world-space／custom shader／RTL 能力，不能沿旧表永久排除；AnimationClip／Timeline 和现有 Prefab 仍影响迁移成本 [一手／研究]
- **存档**：跨内容修改的语义测试取代同版往返；只有产品明确接受版本清档／回退时才改变兼容承诺
- **动画／物理／音频**：先复用原生机制；只有接触、稳定性或交互音乐需求成为真实瓶颈，才加 IK／substep／中间件，不按功能数量升级
- **渲染／发布／编辑器**：目标设备不足先减少预算或定位热点；重复手工操作才做幂等小工具，无收益不扩为多平台和通用工具链

**[研究] 关键局限：资料和源码能约束选择，不能证明这些模块在同一游戏、最低设备和第二次内容修改后已经联合达到可发布质量。**
