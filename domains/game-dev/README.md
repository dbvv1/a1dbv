# 领域分支：AI coding × 游戏开发

> 更新：2026-10-23
> 这个分支回答：**只有一名程序员、没有美术和音频人员时，怎样借助 AI 把独立游戏做到可发布质量？** 先从玩法和目标设备确定资产规格，许可清晰的现成资源、程序化资源和生成资源都可采用；人负责选择、重生成、程序处理和引擎调整，不以人工修图、刷权重或补动画为兜底。引擎知识只服务于这些选择与验证。
> **方向**：本分支的研究方向和基准场景（单人程序、无人工美术修补、垂直切片要经历第二次修改）见 [AGENTS.md 方向锚点](../../AGENTS.md)“重点领域：游戏开发”；候选问题见 [研究队列](../../docs/research/BACKLOG.md#游戏开发方向)。
> 前置阅读：[07 工作流](../../docs/07-workflows.md)（验证闭环）、[14 深度分析](../../docs/14-synthesis.md)（底层规律）。

**从这里开始：[独立游戏从概念到发布的路线图](06-indie-roadmap.md)。** 按概念、原型、垂直切片、内容生产、打磨、发布和上线后选择下一步；每阶段列质量标准、AI 能做、人必须决定与对应专题。先过许可与真人反馈；扩角色／组合前确认玩家能察觉核心选择差异；切片必须经历第二次需求修改。阶段路线仍是资料比较。G1 的实测范围与未验项见第 5 节。[研究]

## 模块与制作链地图

**先看你要做的模块或资源现在做到什么程度。** 成熟度：案例证实＝在本仓案例里用上并验证；可用＝有默认做法、实现起点和 AI 怎样实施；研究中＝只有零散研究或缺页。引擎专属内容以官方文档与工具为据，未在引擎里实跑的最多标“可用”。

| 核心模块 | 去哪看 | 成熟度 |
|---|---|---|
| 游戏循环、固定步长与确定性回放 | [05 游戏循环](05-gameplay-architecture.md) | 案例证实（网页） |
| 流程与场景状态机（启动、菜单、加载、对局、结算） | [05](05-gameplay-architecture.md)、[04 场景切换](04-client-modules.md) | 可用 |
| 输入与操作手感 | [04 输入](04-client-modules.md) | 可用 |
| 相机 | [05 相机](05-gameplay-architecture.md)、[04](04-client-modules.md) | 可用 |
| 战斗、技能与命中反馈 | [05 战斗与技能](05-gameplay-architecture.md) | 案例证实（网页） |
| AI 行为与寻路 | [05](05-gameplay-architecture.md) | 案例证实（网页） |
| 数据驱动配置 | [05](05-gameplay-architecture.md) | 可用 |
| 关卡与遭遇 | [08 关卡与遭遇](08-level-design-and-encounters.md) | 可用 |
| 动画运行时 | [动画](assets/animation.md)、[Unity 动画运行时](unity/04-animation-runtime.md) | 案例证实（网页） |
| 物理、碰撞与交互 | [04](04-client-modules.md)、[Unity 物理交互](unity/06-physics-interaction.md) | 可用 |
| 渲染、光照与性能 | [04 渲染](04-client-modules.md)、[Unity 场景光照](unity/07-scene-rendering-and-lighting.md) | 可用 |
| 资源加载与内存 | [04](04-client-modules.md) | 案例证实（网页） |
| UI 与 HUD | [04](04-client-modules.md) | 可用 |
| 音频事件与混音 | [04](04-client-modules.md)、[音频](assets/audio.md) | 案例证实（听感待评） |
| 存档、本地化、设置与可访问性 | [04](04-client-modules.md) | 可用 |
| 调试、日志、遥测与崩溃 | [04 发行后诊断](04-client-modules.md) | 可用 |
| 内容制作工具与编辑器扩展 | [Unity 内容工具](unity/05-content-authoring-tools.md) | 可用 |
| 引擎接入（Unity 优先、Unreal 对照） | [01 引擎接入](01-engine-integration.md)、[Unity](unity/README.md)、[Unreal](unreal/README.md) | 可用 |
| 平台与发布 | [04](04-client-modules.md) | 可用 |
| 服务端：联网同步、房间、账号与云存档 | [07 联网与服务端](07-networking-and-server.md) | 可用 |

| 制作链 | 没有美术时现在能做到 | 离品类标杆还差 |
|---|---|---|
| [2D](assets/2d.md) | AI 插画用于菜单选卡；图标为手写 SVG | 角色、地表与 UI 套件的风格一致性 |
| [3D 角色与场景](assets/3d.md) | CC0 低模包加脚本改色、重塑成统一风格 | 角色精度与场景丰富度；AI 生成 3D 尚未进作品 |
| [动画](assets/animation.md) | CC0 成熟动作源重采样、实际左右校正到既有骨架＋脚本动作 | 文生动作与动捕清理 |
| [材质、特效与光照](assets/materials.md) | 共享渐变图集、局部地表边簇、程序特效与卡通／Lambert 光照 | 光照氛围、后处理与技能特效 |
| [音频](assets/audio.md) | CC0 音效、程序合成音乐；开放权重生成的环境声候选 | 听感与混音层级；配音 |
| [视频](assets/video.md) | 实验短片 | 尚未进作品 |


## 用 AI 做游戏

**待试制作线索：真实尺度与空间布局、混合资产供给、图标分类与二改保留。** 下表新增三例核到了作者过程、公开源码或玩家反馈，尚未完成本端实玩或完整实机观看；作品品质待验。这组实例仅 Battle Drones 历史 v4 有 1:38 窄试玩记录。[研究]

| 作品与入口 | AI 与人做了什么 | 待试制作线索 |
|---|---|---|
| 🧪 [Riposte: Frontline](https://www.playriposte.com/)：网页 FPS | 作者用 Claude Code 写 Three.js 几何与玩法，人提供参考、逐件调整并试玩；照片贴图、动画和声音另有来源。 | 先核真实尺度、建筑体量与通行／视线布局，再试立面构造；给旧盒子贴百叶不等于完整场景。代码 MIT 不覆盖整包资产，详见[作者、源码与排除项](../../docs/research/2026-10-23-game-worth-trying.md#riposte建筑先有构造再加材质)。 |
| 🧪 [Formula Minus One](https://fm1.app/)：反重力赛车 | 作者持续六个月迭代；草图→图像生成→Tripo 3D→Blender 清理，另有现成声音、人工音乐草稿与风格指南。 | 待试整条赛道的主题与资产组合，而非坚持全程序几何。流程含 Blender 清理，未证实无需手修；[过程与成本](../../docs/research/2026-10-23-game-worth-trying.md#formula-minus-one混合供给仍需设计与清理)。 |
| 🧪 [DragonScape Idle](https://dragonscapeidle.com/)：网页 idle RPG | 作者用游戏数据生成分类风格静图，人选图与重生成。 | 待试暗底小图标与二改保留，详见[作者原文](../../docs/research/2026-10-23-game-worth-trying.md#dragonscape-idle分类风格与保留已验图片)。 |
| 🧪 [Battle Drones v4](https://simonw.github.io/battledrones/v4/)：历史 2D RTS | 作者用 Claude Code 多轮开发并亲自试玩；本端跑到采集→建造→造飞机、暂停重开。 | 保留小回路试玩线索，不把功能数当乐趣。未打完一局，当前 3D 版未进入玩法；[原作者与既有记录](../../docs/research/2026-10-23-game-worth-trying.md#4-battle-drones确实玩到了什么)。 |

![Battle Drones v4 实际窄试玩：资源栏、部队、Airpad 与 Wasp 生产队列](../../docs/img/2026-10-23-game-battledrones-v4.jpg)

图摄于 2026-10-22 UTC，记录的是公开产物，不是 AI 制作复现。新增实例原文与固定源码核实于 2026-10-27 UTC；[制作边界、未验与来源](../../docs/research/2026-10-23-game-worth-trying.md#8-用-ai-做游戏制作过程与采用边界)。资产选择仍沿 [2D](assets/2d.md)／[3D](assets/3d.md)／[音频](assets/audio.md)核许可与规格。[经验／研究]

## 游戏版值得一试

**先按任务选工具，不按热度换栈：下面七项是首试候选，不是当前全行业质量排行。** 旧调查支持需求／检索与编码优先，新案例提供可借的制作步骤；截至 2026-10-23（UTC+8），下表各候选保留各自的试用范围。本仓 G1 实战不计入表中比较，也不计作各工具的制作复现或行业采用率。[研究]

| 任务 | 为什么值得试 | 先试什么与撤回 | 本端实际状态 |
|---|---|---|---|
| 🧪 ChatGPT／Gemini：理需求、查资料 | [GDC 调查](https://investgame.net/wp-content/uploads/2026/01/2026-01-29-dec052f4_d88e_48ce_9f83_a18ce2f2a6e5_541400_GDC26_PDF_SOTI_Report.pdf)中 AI 用户最常报研究／头脑风暴，适合先把玩法疑问变成可核查问题。[一手] | 拿一条玩法写规则与反例并逐条查原文，来源或版本对不上就退回直接查资料。[研究] | 未试用，调查是 1 月跨岗位样本而非 10 月工具胜负。[研究] |
| 🧪 Claude Code／Codex：小切片与二改 | [Playgama](https://playgama.com/ai-game-index/)站内历史游戏自报归属为 50%／20%，配合[制作案例](https://simonwillison.net/2026/Oct/20/battledrones/)将两者列入网页原型对照。[一手／研究] | 同一基线做“移动→采集→造单位”后再改建造规则，旧流程或引用被破坏就撤补丁。[研究] | [产物窄试玩见上节](#用-ai-做游戏)，未复现制作，也未比较两工具。[经验] |
| 🧪 Cursor／GitHub Copilot：沿既有 IDE 改代码 | [游戏团队复盘](https://www.gametactics.io/blog/ai-tools-for-game-development-2026)给出 Unity C#／编辑器实践及误改序列化字段反例，已用 Cursor 可沿其 Agent，其他 IDE 先比兼容的 Copilot。[一手／研究] | 在现工程补一项编辑器校验并二改提示，越界改序列化字段或维护成本更高就退回原编辑流程。[研究] | 未试用，团队自述不证明净收益或当前口碑第一。[研究] |
| 🧪 Context7：精确版本资料入口 | [固定检索记录](https://github.com/dbvv1/a1dbv/blob/1ae780868ba4d1bfeb7e322e5b89896f0c994320/docs/research/wp10-content.md#文档检索窄试用先辨版本再读源码)暴露了库名命中但版本未命中的真实边界。[经验] | 用项目锁定包问一次取消时序，拿不到精确版本就停止文档查询并读固定 tag 原文。[研究] | 两次 resolve 未返回所需版本 ID，已回 InputSystem／UniTask 固定源码。[经验] |
| 🧪 Meshy＋Blender 脚本：局部资产候选 | [开发者原帖](https://www.reddit.com/r/aigamedev/comments/1x6ql3o/2_weeks_of_work_now_im_fully_committed_on_the/)把生成、尺寸与绑定处理连到 UE，提供了值得拆开验证的制作链。[社区] | 先做三件同族刚体并脚本统一二改尺寸／挂点，风格或轮廓需手修就回合格现成或参数化资源。[研究] | 未试用，作者角色手指／握持／肩部仍有问题，零手修链未成立。[社区／研究] |
| 🧪 ElevenLabs：有限台词／占位旁白 | [同一作者](https://www.reddit.com/r/aigamedev/comments/1x6ql3o/2_weeks_of_work_now_im_fully_committed_on_the/)主要用于预告片旁白，适合先验证短文本而非整套角色演出。[社区／研究] | 用有授权的声音做三句并改其中一句，口吻接不上就退字幕／合法占位音频。[研究] | 未试用，连续补句、整套演出质量与完整成本未知。[研究] |
| 🧪 [pxl：共享源的像素资产族](../../docs/research/2026-10-23-game-worth-trying.md#7-pxl让资产族共享源但补丁不会自动跟着形状走)（新意候选） | [公开示例](https://github.com/uilianks/pxl/blob/a012fc78b92e5deff27e56bba563f22895c3916c/examples/basics.px.js)把主体、换色变体与局部补丁写成可审文本，不是广用／质量冠军。[一手／研究] | 先改一处主体，再核变体与所有帧；坐标补丁错位就修源，已有合格 PNG／Aseprite 管线不为换色迁移。[研究] | 源码静读／公开产物观察；工具未运行，无可比二改前后，成本未知。[研究] |

## 1. 结合方式全景：游戏开发每个环节里 AI 做什么

**先找当前的开发环节，再按“怎么接入”和“怎么验证”执行；“人做什么”列是需要人决定的部分。**

| 环节 | AI 做什么 | 怎么接入 | 怎么验证 | 人做什么 | 详见 |
|---|---|---|---|---|---|
| **策划 → 规格** | 把玩法描述整理成规格：状态机、数值表、边界情况、验收标准 | 复用现有约束；关键取舍未决才访谈，视觉偏好先看样品 | 人审规格 | **定核心玩法和“好玩”的标准** | [07](../../docs/07-workflows.md#3-大功能访谈式-spec-) |
| **一次性玩法原型** | 生成可玩小样，用简单形状／程序化声音先验机制 | 整包／托管试玩，与原生 Agent＋最小网页工程对照 | 实际操作核心回路；需分发时验实际包，长期保留才加接管检查 | 判断玩法是否值得继续，允许扔掉原型 | [03入口选择](03-generative-ai-in-games.md#30-秒结论先决定要验证什么再决定是否需要资产管线) |
| **玩法和系统代码** | 写 C# / C++ 逻辑、补测试、重构 | Claude Code / Codex + 现有编译／测试入口；符号定位不足再补 LSP | 编译与规则测试；涉及场景生命周期时补运行时验证 | 定架构和接口，按切片评审 | [unity/02](unity/02-large-project-guide.md)、[unreal/02](unreal/02-large-project-guide.md) |
| **编辑器和资产操作** | 搭场景、改 Prefab / 蓝图、批量设置导入参数 | 引擎 Editor API，按需通过 MCP / CLI 调用 | 分验编译、序列化值、保存重开与修改后画面；恢复另核消费者 | 按格式与引用关系选择修改路径 | [01](01-engine-integration.md) |
| **运行时验证** | 复用测试、读取状态与动作结果，按问题分析输入、视听与帧时间 | 现有测试／调试入口；观察不足时才补窄接口 | 按待证事实选择规则、运行时、输入、视听与目标设备测试 | 从原型开始试玩，决定手感、乐趣与风格取舍 | [**02**](02-verification-and-playtesting.md) |
| **工具和管线** | 编辑器扩展、导入后处理、配置表解析、构建脚本 | 通用编码工作流 | 脚本测试 | — | [unity/02](unity/02-large-project-guide.md#9-哪些任务适合交给-ai) |
| **资产生成** | 调 3D / 2D / 音频生成 API，批量导入、规范化、记录来源 | API 或 MCP + 编辑器脚本 | 规格／风格与引用检查；在实际使用点复验替换及第二次修改 | 程序员验收风格与可读性，选择、重生成或程序化调整 | [03](03-generative-ai-in-games.md#1-资产管线agent-负责搬运和规范) |
| **游戏内 AI** | 规则优先；开放表达或意图确有玩法价值才试生成 | 复用既有规则执行器，按设备与费用选择生成入口 | 规则结果与实际体验分验，保留失败回退 | 确认玩家增加了什么选择 | [03](03-generative-ai-in-games.md#2-游戏运行时的-ai) |
| **构建和 CI** | 编译、测试、打包、分析失败日志 | 引擎命令行（`unity test`、`UnrealEditor-Cmd`、BuildCookRun） | 退出码 + 报告解析 | 审批发布 | 各引擎子目录 |

## 2. 和普通软件相比，游戏的三个特殊点

1. **源码与资产要分开处理**：C# / C++ 源码可按普通编码流程编辑；资产修改默认交给引擎 Editor API，不要求专用 Agent 接口。Unity 文本资产须维护 GUID / fileID 与 Prefab 关系，直接修改仅作经项目验证的受限例外；Unreal 的 `.uasset` / `.umap` 不做文本补丁。格式与采用边界见 [01](01-engine-integration.md)。**[一手＋经验]**
2. **验证要选对观察对象**：状态正确、输入可用、视听清楚与玩家愿意继续玩是不同的待证事实。先复用已有测试与调试入口，缺少关键观察才补窄接口，不默认改造成 Agent 可试玩。真人反馈从核心玩法原型开始；GUI 反馈停滞先核操作器与观察，再补独立试玩；评分分歧先对齐问项。采用依据与边界见 [02](02-verification-and-playtesting.md)。**[研究]**
3. **内容侧有外部约束**：
   - Steam 要求披露 AI 生成内容；
   - Godot 贡献与 Asset Store 使用不同 AI 规则，见[渠道边界](../../docs/research/2026-10-13-godot-contribution-policy.md)。

   约束既涉及**玩家看得见的内容**，也涉及代码贡献、审阅和维护责任。**资产供给和工程接入需要一起判断**，不能以能生成或能编译代替可发布，见 [03](03-generative-ai-in-games.md#3-外部约束披露与玩家态度)。

## 3. 按引擎的起点

**已有项目先沿用；新项目按玩法、目标平台、现成资产与维护能力比较，只有具体阻塞才考虑迁移。**

| 引擎 | 起点 |
|---|---|
| **Unity** | [unity/](unity/README.md)：沿用已有编译／测试；场景与资产操作缺入口时再评估版本匹配的 CLI／Editor API／MCP，模板只合并所需部分 |
| **Unreal** | [unreal/](unreal/README.md)：已有 C++ 构建／测试为基线，需要编辑器操作时才增最小 MCP 工具集或现成脚本 |
| Roblox | [01 第 2.3 节](01-engine-integration.md#23-roblox把-agent-能力直接做进编辑器)：Studio 内置 MCP，用好 `playtest` 子 Agent |
| Godot / 自研 / Web | 通用编码工作流 + 现有测试／调试入口；按 [02](02-verification-and-playtesting.md) 的待证事实补观察 |

接口版本前提按各引擎入口核对，不为接入 Agent 默认升级引擎；采用与撤回边界见 [01 第 3 节](01-engine-integration.md#3-引擎选择对-ai-coding-的影响)。**[经验：采用判断]**

## 4. 目录

| 文档 | 内容 |
|---|---|
| [**06 独立游戏路线图：读者入口**](06-indie-roadmap.md) | 阶段按待解决的问题分流：试玩／EA／完整发行、内容冻结与不同经历玩家接收；保 AI 与人分工、二改及停止条件 |
| [01 引擎接入](01-engine-integration.md) | Unity、Unreal、Roblox、Godot、Blender 的官方 Agent 接入；三种设计思路；引擎选择对 AI coding 的影响 |
| [**02 验证与试玩**](02-verification-and-playtesting.md) | 按待证事实选测试、复用已有入口、暂停菜单的第二次修改、工具观察与人的体验取舍 |
| [03 G1资产管线总览](03-generative-ai-in-games.md) | 四用途与十项整页选择图；区分可编辑场景、功能对象、NPC与交互视频，保供给、许可、二改及完整成本 |
| [2D资产](assets/2d.md) | 十组生产选择与领先替代；保源默认，风格按分工参考／适配／训练分流，动作区分换皮／配装／补帧，瓦片保旧连接补过渡；透明动画、重打光与引擎交付各守边界 |
| [3D资产](assets/3d.md) | 整页主要选择已比较；保源与合格资源族默认，植被缺结构比较源端恢复，角色按联合生成／衣物拟合分流；保布局、UV、身份、LOD与碰撞门槛 |
| [动画与绑定](assets/animation.md) | 十二项选择图；固定骨架优先，成套供给、检索与在线生成分层比较，全部路线过权限／相机／二改检查 |
| [材质与特效](assets/materials.md) | 全页13组选择：保可改材质源；技能／烟花事件与烘焙细节分层，烟雾需深度才比较体积；保可读性、设备及许可门槛 |
| [音频资产](assets/audio.md) | 整页13组选择：保合格声音，音乐保原录音／主题重演绎、角色连续补句与制作升级；已比较／差距1，整套零手修效果与全成本未知 |
| [视频与过场](assets/video.md) | 源镜头与固定成片选择、生成候选与渠道门槛；原创开门源→静音影片→真实浏览器返回玩法及长武器／字幕二改已实跑，Unity／UE与有声体验待验 |
| [04 客户端核心模块](04-client-modules.md) | 11模块整页条件选择与可读图，比较原生／现成替代及二改成本；保动作响应、取消／所有权、旧档、输入改键、本地化与最低设备验收 |
| [05 Gameplay架构](05-gameplay-architecture.md) | 整页比较组件／混合架构、状态兼容、完整技能制作与镜头关卡；保规则结算与原制作链，以二改接收决定扩展 |
| [07 联网与服务端](07-networking-and-server.md) | 状态／输入同步与预测回滚的条件选择；现成引擎接线、两端真实 MOBA 模拟输入帧消费和共同状态验证 |
| [08 关卡与遭遇](08-level-design-and-encounters.md) | 从体验概念、可玩布局、真实角色尺度到遭遇节奏与二改；沿现有工程制作，不先造生成器 |
| [游戏制作 Skill](templates/.claude/skills/) | 可放进自己项目的做法：[画面与手感质量单元](templates/.claude/skills/game-quality-pass/SKILL.md)（固定机位、目标效果图、整场景改、非作者判定）、[成套内容制作](templates/.claude/skills/game-content-production/SKILL.md)、[从案例需求做核心模块](templates/.claude/skills/game-module-from-case/SKILL.md)、[AI 做游戏实例](templates/.claude/skills/ai-made-games-scout/SKILL.md) |
| [unity/](unity/README.md) | Unity：**引擎基础知识**（每节附 AI 要点）、Unity CLI 和官方插件、大型项目的编译和测试闭环、配置模板；[动画运行时](unity/04-animation-runtime.md)、[内容作者工具](unity/05-content-authoring-tools.md)、[物理道具与机关](unity/06-physics-interaction.md)、[场景光照](unity/07-scene-rendering-and-lighting.md) |
| [unreal/](unreal/README.md) | Unreal：**引擎基础知识**（每节附 AI 要点）、UE 5.8 官方 MCP 和 Epic 插件、Live Coding 与 UBT、自动化测试、配置模板 |

## 5. 历史盘点与当前推进

读者按[独立游戏路线图](06-indie-roadmap.md)选择下一步，不必按历史工作包编号阅读。历史工作包交付不表示长期维护结束。WP0–13 的历史覆盖与依赖见 [WP0 盘点](../../docs/research/2026-10-14-game-wp0-inventory.md)；其中缺口以实施前的 `f3726c6` 为基线，不代表当前未交付事项。当前成熟度与待办分别见[成熟度表](../../docs/README.md#核心页面成熟度)和 [TASKS](../../docs/collaboration/TASKS.md)，持续推进和实测边界按[长期计划](../../docs/collaboration/LONG-TERM-PLAN.md)。**[研究：仓库覆盖与阶段边界]**

现有理论建议和来源核查，不能证明整款游戏已达零手修发行质量，也不能证明实际生产成本或收益。[G1 实战](06-indie-roadmap.md#g1-旗舰实战给潮汐邮差真的生成资产再改一次规则)已取得真实生成资产（内置生图）、网页源码与预设二改（规则二改）的离线结果，v1 独立浏览器回路已有独立证据；但 v2 规则与模拟 UI 虽已验，真实浏览器、最新二改客户端、引擎及玩家体验仍须分别接收。局部试验不能当成完整切片验收，也不表示整款游戏已验证。[研究]
