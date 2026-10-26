主线：一／二／三／四；玩法反馈、额外能力、第二次修改与可维护交付
改变的建议：[研究] 默认组件＋窄规则＋局部状态机，按真实复杂度升级。先定状态所有者、时钟、退出与输入边界；相机先定信息与控制目标，关卡、成长、教学与辅助按玩家决策取舍。物品区分可互换性，任务区分历史与当前条件；功能通过仍须核体验；群体叠招先分攻击许可、站位与单体冷却；蓄力按输入识别、技能计量与释放选择；回放按影子展示、原因复演与倒带续玩选择记录内容；本地多人按独立活动与双方可读性选共享／分屏
新证据：2026-10-23（UTC+8）补数据模组局部补丁、世界输出／NPC与整页供给选择；2026-10-22补 Sandfall／NeoBards 2026 制作复盘、Wube 2026 系统演进与 Unity／Highstreet 2025 混合架构取舍；并保留 Phaser 共享能力修复与旧工程固定版本边界。[一手／社区] 原文、固定源码、官方契约及历史修复日期见各节。[研究] 未作游戏、引擎、模型或玩家对照

# WP11：单人独立游戏的 gameplay 架构取舍

证据核实：原记录2026-10-13—14 UTC，后续日期见各节。除确定性算术复核外，均为公开资料／源码研究，未运行引擎、游戏、模型、玩家实验或上游测试，未安装／购买插件；所有验收计划均未执行。源码与文档检查不证明性能、工时、体验或AI收益；“AI风险”是契约推导，固定主干不等于发行包。各节保留特有缺口与历史验证范围。本文只提炼机制，不复制代码／资产；实际复用仍须分别核代码、素材和引擎许可。

05 页历史范围原文：核实：2026-10-16；篇幅编辑：2026-10-17（UTC+8）。本次编辑日期不代替各节证据核实日期。

分册：[战斗与AI](wp11-combat.md) · [镜头与进度](wp11-camera.md)。 新增[整套关卡二改](wp11-camera.md#整套关卡二改可编辑源不替代战役设计)：保既有制作链，语义源与规则不替代教学／进度返工。下列迁出标题保留原锚点，点击标题直达对应小节；未迁出部分继续在本页维护。

## 一、研究结论与适用边界

**[研究] ✅ 默认：Unity现有组件＋纯C#窄规则＋局部状态机；UE现有Gameplay Framework＋ActorComponent＋C++规则。** 先完成玩法需要的开始、暂停／局内菜单、结算、重试并清理旧局；世界是否暂停另定。不因对象／技能／行为数量直接采用ECS、GAS或行为树，也不整套移植Lyra。

**[研究] 按反复变化的复杂度升级：** 层级互斥与打断→HFSM；多目标优先级、共享子树与动态打断→BT／StateTree；组合效果、属性、标签、成本冷却及必要预测→GAS；目标设备的同构CPU热点→局部Jobs/Burst／ECS，明确的预测等子系统能力也可支持混合架构；受控整招反复调节奏→可编辑时间线，规则结算仍独立。收益须覆盖维护成本。

**[研究] 局限：** 架构取舍仍须由同一玩法切片的第二次修改与目标设备构建检验；源码和官方修复只支持机制判断。

<a id="p76整页比较生产上限与agent任务边界"></a>

## P76：整页比较，生产上限与 Agent 任务边界

核实：2026-10-22（UTC+8）。主线一／二／三／四。覆盖 05 页五组主选择。全新上下文整页独审确认gap=1，不声称最优架构已知。[研究]

**改变默认：** ECS 也可由必要能力驱动，保组件制作链；整招增加可编辑编排。其余补近期演进与验收。[研究]

### 近期原始证据及其支持范围

| 来源、日期与作者 | 读到的生产选择 | 能支持什么；不能支持什么 |
|---|---|---|
| [Sandfall：创作自由的技术路径](https://blog.playstation.com/2026/03/11/how-the-clair-obscur-expedition-33-dev-process-powered-creative-design-freedom/)，2026-03-11，联合创始人／CTO Tom Guillermin，GDC 讲述的作者文章 | 大体保留原生引擎，少量插件补缺；程序员提供可组合节点，非程序员也可制作整招运动、特效、镜头和时间变化；世界地图复用既有交互／战斗等系统 | 领先作品的制作能力与代码边界，不是“不写代码”，也不是单人无美术团队的产能证明 |
| [Sandfall 技术访谈](https://www.unrealengine.com/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33)，2025-03-27，Tom Guillermin 等原团队受访 | 技能用 Sequencer 小演出，动态绑定战斗演员，暴露属性供轨道控制；战场位置受控，关卡设计可调整敌人位置 | 说明完整编排的实现前提；2025 机制解释与 2026 作者复盘互补，不是两个独立团队，也不推出所有即时战斗都应使用时间线 |
| [Survival Kids 网络基础设施](https://unity.com/blog/inside-the-survival-kids-multiplayer-network-infrastructure)，2025-09-10，Unity 工程师 Andy Bastable | 为所需预测能力使用 Netcode for Entities，玩法继续 GameObjects／MonoBehaviours；单机同样跑客户端／服务器以复用路径，双重模拟是 60fps 成本挑战 | 能力驱动的混合边界，不只是 CPU 热点；选择背景早于发表，不推断当前其他网络栈仍无预测，也不把团队规模当单人效果 |
| [Highstreet 的 ECS 生产案例](https://unity.com/resources/highstreet-market-scaled-vr-mmo-with-ecs-for-unity)，2025-10-07，Unity 承载的 Highstreet 团队案例 | 从自建服务器向 ECS 演进；全 ECS 物理改为混合，客户端保组件式 VR 手部交互生态，服务器保关键碰撞校验；反思过早按峰值规模建设挤占玩法／内容资源 | 与 Survival Kids 不同团队的反向取舍，支持按制作生态收窄 ECS；厂商承载、团队自述，不是独立成本测量或 MMO 全 ECS 默认 |
| [NeoBards：Silent Hill f 近战设计](https://blog.playstation.com/2026/03/11/how-silent-hill-f-developers-crafted-tense-melee-only-combat/)，2026-03-11，创意总监／游戏总监 Al Yang | 用耐久将资源压力转入近战；有意不完整公开敌人血量／伤害，但保留打击反应；Focus 与 fox-arm 能力给紧张循环提供释放与主动性 | 独立团队对“信息越全越好”的生产反例；不证明隐藏数值普遍更好，也不是引擎或 Agent 效果比较 |
| [Wube FFF442](https://updater.factorio.com/blog/post/fff-442)，2026-06-12，Klonan／V453000／Raiguard | 从 Quality 拆出 Recycler，使 Space Age 可不启用 Quality；管道系统移除隐藏双缓冲并处理过滤／拓扑冲突 | 可选功能先解除真实依赖，简化内部状态仍需保玩家操作语义；不是通用事件或存档框架，也不必把整套管道机制搬入正文 |
| [Wube FFF444](https://www.factorio.com/blog/post/fff-444)，2026-06-26，Klonan | 2.1 实验版可升级 2.0 存档，但工厂行为可能受改动影响；升级后的存档／蓝图不能降回旧版，建议备份 | 区分解析兼容、继续运行与可逆升级；不是声称正式版必然损坏旧档 |

已读正文及相关技术段落，未运行／复测；2025 生产证据不冒充当前模型效果。未读完整的 GDC 视频／幻灯片及二手参会笔记不承担结论。[一手／研究]

### 五组选择的整页覆盖与剩余差距

1. **架构（§1／3／5）**：组件／FSM 默认及 HFSM／BT／StateTree 升级条件保留。Survival Kids 与 Highstreet 的一进一退修订 ECS 边界，不设对象数阈值；Unity 网络结论不移植到 UE，后者以 Sandfall 原生制作对照。[研究]
2. **状态（§2／4／6）**：保留离线补算、Widelands／CDDA 迁移、同步／延后事件、快照／动态读取、三类回放的既有比较。Wube 补可选依赖与旧档运行，不支持统一状态框架；最高维护收益未知。[研究]
3. **整招（§7）**：补完整技能制作。时间线编排表现，FSM／GAS 保资格、费用、结算与取消，两者正交；NeoBards 对照完整预告，保留有意未知。原动作／群攻机制不删。[研究]
4. **视图／内容（§8／9）**：保留 Lonely Mountains 导演／追随返工、PixelWheels／BG3 合分屏、LDtk／Tiled 制作源／教学返工比较。Sandfall 增加受控战场路线，不覆盖自由场景；尚缺试玩和目标设备验收，非缺另一相机框架。[研究]
5. **复用／二改（§10／11）**：沿 Phaser 2026-09 修共享能力但旧作保版本；AE 非 Phaser 4。许可与旧局迁移仍单独验。Codex 时钟／缓冲二改只证明局部风险，不用 GCA 多角色描述扩建流程。[研究]

### 给 Agent 的工作与人要接受的核心结果

第二次修改可选新增可取消技能、允许关闭某效果。Agent 查定义／实例／旧队列，接表现节点与恢复，列绑定／版本差异。按任务选以下未执行验收：[研究]

- **架构**：同玩法／设备计同步、双重模拟、playback、后续系统及制作成本；负担更大就缩边界。
- **整招**：改站位／目标，打断再施放，核旧回调失效、镜头／时间／位移权归还；人验起手、接触、反制、恢复。
- **旧状态**：先备份；旧队列／已建对象继续操作、存取，再关可选系统。明确保留／转换／停用，加载或退配置不等于回滚。
- **视图／内容**：单／多人、上下层、改路线后核控制与信息；人验舒适、发现和教学，可编辑不等于设计成立。
- **交付**：记能力版本、许可及升级范围；失败则退版本／缩改动。Agent 分工是推导，质量、工时、单人无手修上限未测。

未运行模型、引擎、游戏或检验脚本；生产案例与整页比较登记不等于模型／引擎实测验收。[研究]

## P97：世界输出、NPC与整页供给选择

**[研究] 结论：按交付物分流，而不是把所有“世界生成”当作同一种游戏制作工具。** 可编辑几何、绑定既有行为的功能对象、交互生成视频各有价值；NPC 的自由表达也须落到可验证的游戏状态。
**[研究] 改变默认：** 不再把世界模型笼统列为3D候选；按需要保住的对象、行为与二改选模块场景／Marble／视频世界，保留 P93 四用途和 P63 三路造车比较。
**[研究] 范围：** 2026-10-23（UTC+8）资料核查，未试用平台、运行模型／引擎／游戏或测玩家收益；全新上下文独审支持整页资料差距1；不等于全流程最优或零手修实证。

### 三类世界输出的同题比较

题目是“小房间里看见一辆车与一扇门，玩家能探索；下一版移动门并改变开启条件，旧存档仍可继续”。如果目标只有气氛探索，不强迫承担驾驶与存档；如果承诺这些功能，则不能用一段好看的可操控画面代验。[研究]

| 路线 | 给读者的新增能力 | 二改与交付边界 | 选择与撤回 |
|---|---|---|---|
| 现成模块＋程序化场景 | 已批准几何、可审查布局配方、独立对象与既有组件 | 仍需保引用、旧默认、导航和资源预算；不是无返工 | ✅ 固定玩法和持久对象起点；表达空间明显不够再扩大来源 |
| Marble 可编辑3D | 用粗结构约束场景，再生成视觉；编辑、扩展和组合空间 | 几何输出不承诺对象语义或引擎工程；粗collider与视觉mesh分验，覆盖实际行走区域和混合几何 | 🧪 与模块场景比目标设备、深度／碰撞及接入总成本；范围内质量或二改不达标就缩范围／退模块或背景 |
| Roblox 多部件＋既有行为 | 玩家在运行中生成形体，接受已定义驾驶等能力 | P63已比较 schema、行为与保存分别版本化；当前接口、持久权利、引擎出口需核 | 👀 创造陌生形体是核心再试；数值换皮先用预制参数 |
| Project Genie 类交互视频 | 动作条件驱动的短时探索，生成体验可以是目标本身 | 当前Revisit以同提示重生成且可能不同，另可下载视频；不构成旧状态恢复 | 👀 探索画面原型；要旧档续玩或源码接管时不以Revisit／视频替代工程 |
| WorldMind 分层研究 | 从生成帧估紧凑状态，显式决定NPC动作，再生成后果画面 | 状态估计、动作计划、时序条件与视频闭环；不是引擎对象语义或现成NPC插件 | 👀 借分层与对照方法；不是单人游戏生产底座推荐 |

表中默认是本仓根据交付依赖作的推导，不是各路线实测质量／工时排序。[研究]

### 决定性一手材料与可借机制

- **W1｜[Marble发布，2025-11-12](https://www.worldlabs.ai/blog/marble-world-model)**：本轮读Chisel、扩展／组合与导出段。粗布局和提示风格分开；splat、粗物理collider及高质量mesh有不同用途。借用“先固定空间结构，再补外观”，而不是把生成几何当已有游戏行为。未试用、未核本项目商用合同与Unity／Unreal导入质量。[一手／研究]
- **W1补｜[Clarence Dadson亲测，2026-09-26](https://design4real.de/en/world-labs-marble-practical-test/)**：2026-10-23（UTC+8）核实测、导出与引擎段。作者报告中心外质量下降、所见派生mesh不理想，以及其Unity／UE组合的深度、碰撞和性能问题；未完整列版本、插件、设备与样本，且明确结果依赖输入、场景与实现。不外推全产品，不采“唯一方案”或约两次扩展断言。[一手：作者报告]
- **W2｜[Atlas，2026-09-01](https://www.worldlabs.ai/blog/atlas)**：读能力说明与开放状态，原文明确未来版本Marble和early access。它把相机控制、空间重建和时空模拟列为前沿能力；不据此声称所有Marble账户已具备，也不从演示推可编辑游戏工程。[一手／研究]
- **W3｜[Project Genie历史发布，2026-01-29](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/project-genie/)与[当前官方帮助](https://support.google.com/labs/answer/16875695?hl=en)**：2026-10-23（UTC+8）核资格、Navigate、post-experience与数据导出段。现为Ultra可用地区的18+订阅者、每次探索60秒；Revisit以同提示重生成且可能不同，另可下载体验视频。用户数据导出未承诺可恢复世界快照，文档未提供Unity／UE工程出口；这些边界限当前入口，不推所有Genie模型永远不能持久化。[一手／研究]
- **W4｜[WorldMind v1，2026-08](https://arxiv.org/html/2608.21439v1)**：读§3方法和§4实验设置／结果；将紧凑状态、NPC决策、时序控制与视觉合成解耦，推理状态来自生成帧和动作历史。§4／Table 3的闭环偏好由GPT-5.5与Gemini-3.1-pro两个LLM判定器对一分钟Game A生成轨迹评分，不是人类玩家研究，也不是与商业游戏FSM／BT的公平成本对照；跨游戏状态重建仍需域适配。只借明确决策接口，不作Unity SDK推荐。[研究：论文]
- **W5｜[Orchestrated Reality v1，2026-06-14](https://arxiv.org/html/2606.16014v1)**：读§3 JSON／Plan–Diff–Validate–Apply和§5–6。作者以约5人非正式使用提出假设，正式玩家研究仍待做；schema外细节会漂移，完整复演需记录模型请求／回复，NPC并发成本未定。借“状态提议与正式提交分开”，不采纳“其他所有系统都无持久状态”等概括，也不把schema有效当规则全覆盖。[研究：WIP论文]

**渲染器能读什么，不能替游戏决定什么。** [Spark v2.4.0 的 SplatMesh.ts](https://github.com/sparkjsdev/spark/blob/v2.4.0/src/SplatMesh.ts)本轮读 `SplatMeshOptions`、构造与异步初始化：可从URL／bytes／stream读取splat，包含editable／raycastable和LOD等控制。它提供可接入表示的机制，不给门的权限、车的驾驶能力或存档迁移；不由“可射线查询”推物理／导航已通过。本轮是标签源码阅读，未解析不可变SHA、未装包、未核整库依赖或运行性能，故不登记固定源码实测。[一手／研究]

### NPC实际采用：有行动，不等于普遍比规则更好

**N1｜[Ubisoft Teammates，2025-11-21](https://news.ubisoft.com/en-au/article/3mWlITIuWuu0MoVuR6o8ps/ubisoft-reveals-teammates--an-ai-experiment-to-change-the-game)。** 可玩研究把语音输入用于队友掩护、攻击等动作，作者仍编写故事／人格并设世界观边界。它支持“自由表达可能成为交互方式”，不支持商业留存、开发省时或任意NPC模型替代。没有菜单同题体验与全程成本比较，本仓未试玩。[一手／研究]

**N2｜[inZOI v0.10.0，2026-09-03](https://playinzoi.com/en/news/10849)。** 发布说明列出Smart Zoi利用地点、群体活动、社交活动、工作／生意选择交互，并以符号标记动作；这是实际发布功能，不只是概念视频。同补丁移除AI build但未给理由，不能推导AI构建普遍失败。补丁只证明该版本做了什么，不证明现今无缺陷或用户收益。[一手／研究]

**社区正反都落到同一验收题。** [Smart Zoi原帖及评论](https://www.reddit.com/r/inZOI_Adults/comments/1wa5b0t/the_smart_zoi_overhaul_is_amazing/)的作者报告NPC想回家并执行，评论既赞改进，也有人描述约会中突然离开及设备使用问题。它提示应该同时验“动作真的发生、行为能否理解、最低设备能否使用”；个体反馈不证明普遍胜率，设备门槛不从评论照抄成当前官方规格。[社区／研究]

**中文机制参照。** [V2EX作者原帖，2026-06-04](https://www.v2ex.com/t/1217813)描述服务端枚举合法动作、模型选择、schema验证、业务裁决和执行器改状态。借用“有限候选也要二次规则校验”，不把格式正确当动作可执行；作者三天自述不作成本估算。[qx仓库首页](https://github.com/wunameya/qx)本轮可读backend／frontend和README，未核固定实现／LICENSE，未安装运行，不推荐复制代码或资源。[社区：作者说明；一手：首页；研究]

**持续费用有真实反向线索，但不是行业统计。** [r/aigamedev讨论](https://www.reddit.com/r/aigamedev/comments/1o27wjl/anyone_using_ai_in_their_games/)中一位开发者自述语音NPC曾提升沉浸，却依赖按次付费且供应方停止；另有作者描述慢生成与多角色事件维护问题。项目、金额和因果未独立确认，只支持采购时问全程调用、并发、供应退出与核心玩法降级，而非“LLM游戏都不可行”。[社区／研究]

### 全页取舍怎样收口，而不是只添世界模型

1. **用途与供应：** P93已经分开一次性、长期、已有工程、玩家创造；沿用它的交付与退出证据。场景有结构控制的新候选，不推翻合格现成资产／参数配方，反而让两者能按同一布局题比较。[研究]
2. **各资产任务：** 本页继续引用2D／3D／动画／材质／音频／视频专题的当前三档、生产边界与撤回，不用世界模型代表全部资源；完整供给和新类别兼容沿WP8的实际二改反例。[研究]
3. **权利：** 软件许可、指定权重／节点、输入、生成时计划、正式导出、运行时服务和渠道是独立问题；本轮没有接受Marble／Genie／Atlas合同，故它们只是候选。Spark可读源码不授权世界生成服务或生成资产。[研究]
4. **状态和二改：** 生成对象保批准产物／ID、行为版本和旧默认；NPC只提议，游戏判定合法结果；世界几何重生不能默默替换原场景的对象引用。保存、重开、取消后迟到返回和退配置分别验，不把一次成功叫可维护。[研究]
5. **成本：** 离线按完成资产＋下一次变更，运行时按玩家全程／并发／设备，托管按退出和重建计。调用费、淘汰、人工筛选、接入、存储、审核和维护分报；未知不填零，纯原型不用替不存在的长期承诺付费。[研究]

**接受设计，未执行：** 固定目标设备、相同核心规则与可接受表示；比较现成／程序化、离线生成与运行时生成的全部尝试，保失败样本。第二次需求分别改一处资产、一道门或一种车辆能力，检查新旧混用与旧档；NPC比相同目标下菜单／规则与自由表达，记录成功动作、误动作、等待与玩家理解。不能用“每次都有新东西”抵消控制、保存或设备失败。[研究]

**探索回执：** 本轮读World Labs、Google、Ubisoft、inZOI原文与两篇论文决定性章节；中文V2EX、Reddit两个社区渠道的原帖和正反评论；Spark标签源码及qx首页。qx实现／许可未核、Spark未固定SHA；未取X／Discord、未进行热度排行或试用。已有P63的固定接口和独立游戏二改证据继续保留。本轮篇幅合并的是重复入口与资产摘要，不删通用清权、二改、费用和平台检查。[一手／社区／研究]

## P63：玩家造车，生成的是形体还是新玩法

核实：2026-10-21；主线二／三，C2。问题固定为：玩家定制一辆可驾驶的车；下一版加入一种能力，已保存的旧车仍能加载和使用。以下是同题资料比较，未运行游戏、模型、引擎或玩家实验。[研究]

**最高水平卡。** 整条路线的当前最高水平未知。近期工程质量参照是 Roblox Build 分开评价实现／设计／呈现（2026-10-08，R5）；它不是供给优胜证明。功能创造的领先候选是 Studsy 与 Roblox Innovation Studio 合作的 Dream Racers：把受控词语组合变成玩家的车，而非只帮开发者做美术（2026-09-01，创始人 Delus 原访谈，R1）。它仍缺同题质量、玩家收益及二改成本对照。主流参照沿用审计 G03 的现成／参数化生产，未新测采用率；可行路线是语义部件生成后接既有行为。**本仓推荐属于可行默认：先验证预制参数路线，只有创造陌生形体本身是核心乐趣才试运行时生成。** 沿用[审计 G03](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#g03--资产管线)，不把新案例升级成零手修全流程最佳。[一手／研究]

### 同题比较与撤回条件

三条路线都固定驾驶、转向、刹车、碰撞、玩家可读性和设备预算；不能让生成组展示奇特外形、基线组只有一辆默认车，再称生成更有价值。[研究]

| 路线 | 能给玩家什么 | 下一版加能力时改什么 | 默认与撤回 |
|---|---|---|---|
| 预制模块库＋参数 | 组合已验证部件、颜色、尺寸与规则参数；新奇性受库限制 | 行为代码、配置版本和旧参数默认；必要时补模块 | ✅ 有限改装／竞速先用；若玩家真正需要库无法表达的形体，才扩大供给 |
| 离线生成、审核后入库 | 开发者补独特外形，玩家仍从批准集合选 | 保旧合格输出和身份，只替换批准的新版本；行为另改 | 🧪 固定内容缺口用；筛选／接入／扩展成本过高则退回模块或缩范围 |
| 运行时 schema 生成＋行为复用 | 玩家在游玩中提出外形，新对象接已定义功能 | schema、部件映射、行为及保存格式分别版本化；旧对象不因新生成配方自动重生 | 👀 创造本身是核心时试；等待、失配或回退破坏核心乐趣就撤回，不以生成数验收 |

这里比较的是机制和依赖，不是三路实测排名。AI 可以在已定义语义部件里生成形体；程序员仍须定义合法能力、预算、控制权和修订策略。相同词语可以交给预制参数映射，**词语影响速度／耐久并不单独证明生成几何不可替代**。[研究]

### 新证据怎样改变选择

**同平台的程序化对照可直接定义。** [Roblox Procedural models](https://create.roblox.com/docs/parts/procedural-models)滚动文档于2026-10-21全文读：开发者用 generator module 与属性构造模型，可在编辑期或运行时执行；缺属性用模块默认值。它也可能超时、失败后显示占位，生成挂起时改参数会取消重启。故这里的“程序化”指可审查配方，不等于无失败；先用相同词语映射到配方，才看 Cube 是否提供额外表达价值。[一手／研究]

**R1｜近期实际采用，而非自动造整款游戏。** [GamesBeat 原采访，2026-09-01，Alexander Lee 采访 Studsy 创始人 Kaya-kii “Delus” Ndlovu](https://gamesbeat.com/how-dream-racers-uses-robloxs-cube-ai-to-generate-playable-vehicles-in-real-time-exclusive/)全文已读。作者说明玩家从受控词语商店选三个词，生成车并参加比赛；Cube 未用于开发该游戏。报道描述词语关联车辆属性；火／冰相克是创始人展望。合作条件包含 Roblox Innovation Studio，未给单人复制成本、留存对照、生成失败率或旧车迁移结果。它改变的是“生成可以成为游玩输入”，不是“开发者可省掉行为设计”。[一手：原访谈；研究]

**R2｜功能来自行为接入。** [Roblox model generation 指南](https://create.roblox.com/docs/parts/model-generation)于2026-10-21全文读：生成多部件几何后，预置 retargetable script 按形状与尺寸接功能；汽车示例调用已有 CarBehavior。静态示例仅固定部件，不能拿它验驾驶通过。文档宣称延迟改善但未给同题数值，供给规模、失配率和总成本未知。[一手：官方滚动文档]

**接口版本尚需项目内确认。** 指南快照写 Car5／Body1；本轮 API 参考的不同公开读取快照对自定义 SchemaDefinition 内容不一致，未取得对应部署日期或不可变新版依据。因此不以“两种是今天全部支持”或“任意自定义已普遍可用”为采用前提。[GenerationService](https://create.roblox.com/docs/reference/engine/classes/GenerationService)及其[公开文档源](https://github.com/Roblox/creator-docs/blob/main/content/en-us/reference/engine/classes/GenerationService.yaml)只用于核接口；当前读到的源明确提示拒绝、超时、schema失配或服务错误会抛错。旧 GenerateMeshAsync／LoadGeneratedMeshAsync 的加载规则不能移植到 GenerateModelAsync 的持久化承诺。[一手／研究]

**R3｜参与者玩得久，仍未证明因果。** [Roblox 工程负责人 Anupam Singh，2026-02-04](https://about.roblox.com/newsroom/2026/02/accelerating-creation-powered-roblox-cube-foundation-model)全文已读。文中转述 Wish Master 作者：参与4D生成者平均游玩时间高64%，并描述未预期愿望带来的理解问题。分组、样本分母、观察窗口和随机分配未披露；更投入的玩家可能更愿意生成。该数字不证明延迟被收益抵消，也不证明节约制作成本。[一手：厂商转述开发者；研究]

**R4｜非AI参照也付二改成本。** [Flashbulb 的 Trailmakers 2.3 公告与次日热修，2026-03-12／13，官方 Steam 发布流](https://store.steampowered.com/news/posts/?appgroupname=Trailmakers&appids=585420&enddate=1774518460&feed=steam_community_announcements)正文已读。既有铰链增加 Steering／Linear／Hold 模式，默认仍是 Steering；这是给旧部件加能力的具体参照。次日修复旧／模组颜色蓝图破坏 Builder 的问题，说明保留默认并不足以保证旧对象兼容。这里没有提取资产、照搬代码，也没有证明 Trailmakers 胜过 Cube；它反驳“预制就不用验证旧内容”的过强默认。[一手／研究]

**R5｜近期质量上限参照不是一次功能通过。** [Roblox 工程团队 Zhang／Sun／Khanna，2026-10-08](https://about.roblox.com/newsroom/2026/10/how-roblox-evaluates-build-game-creation)全文已读：Build 的同一示例工程评分98、设计31，试玩检查通过；团队把实现、设计和呈现分开，并承认自动试玩处理复杂物理的弱点。本题借用分开验车能开／创造有趣的做法，不能把 Build 的得分或耗时当 Cube 的质量／延迟数据。该系统自身多轮修改评价仍在扩展，未补齐本题二改证据。[一手：厂商工程报告；研究]

**近期扫描不把路线图算交付。** [David Baszucki，2026-09-11 RDC 原文](https://about.roblox.com/newsroom/2026/09/rdc-2026-the-world-needs-more-play)全文已读，Scene Generator 写的是当年稍后到来。它不能补齐本题已保存对象、行为迁移和量产成本证据。以上材料支持平台内机制；未核可向 Unity／Unreal 商用导出，不推荐直接迁移资产或更换引擎。[一手／研究]

### 第二次修改与接受条件（设计，未执行）

**把旧车保住，再测新增能力。** 首版保存批准对象、对象身份、语义部件及行为版本；下一版新增加速或遥控时，先确定哪些旧车适用，缺字段如何取旧默认，哪些需要迁移。不能只保存提示词或生成ID，就承诺将来能重建同一车。[研究]

1. 用同一批玩家任务、目标设备和功能规则比较三路，保留全部失败和重试。人的选择与审核、端到端等待、服务调用、资产处理和维护工时分别记录；不只报单次生成价。
2. 对旧保存对象加载、控制、碰撞和再次保存；再验新对象及混合房间。部件名字齐全后仍验挂点、体积、可读性和合法能力；不以schema通过代替真实游戏结果。
3. 注入超时、拒绝、缺件、取消后迟到响应和服务不可用；结果尚未接收就不替换旧对象。把当前局可玩与跨会话保存分别验收，先核实际持久化接口及权利。
4. 回退可用批准车辆，但要明确是否损失“自己创造”的核心体验；若缺失的是核心目标，应允许保留旧作品、重试或退出该模式，而不是声称固定车与生成玩法等价。
5. 玩家收益至少比较受控词语＋预制参数与受控词语＋生成几何；如声称因果，预先定分配、样本、退出和失败口径。人的判断包括驾驶手感、表达空间和等待是否值得；自动检查只覆盖规则与状态。

这些是据接口和发布反例提出的接受设计，不是 Roblox 或 Trailmakers 已完成的测试。P63当时只支持限定采用判断并保留页级差距2，尚缺完整同题收益／成本及保存对象二改实证；后续全页资料比较见上方P97，不把补资料写成这些实证已经完成。[研究]

## 近期 coding Agent 二改：缓冲寿命与时钟信任

核实：2026-10-21；P53，主线三。按 P51 提示词先冻结问题：强 Agent 是否足以让单人游戏跳过原生组件、窄规则和小 FSM？本轮只读公开材料，不运行游戏、引擎或模型。[研究]

**最高水平卡。** 当前最优未知；新候选是作者的 Codex 持续开发与公开二改，不是 NPC 决策 Agent。主流参照沿本记录的引擎契约与状态所有权，未新测采用率；本仓推荐属于可行默认。未取得当前代际、同玩法、框架迁移与基线的维护总成本比较，不因生成能力提高就升级 GAS／ECS／HFSM。[研究]

**专业候选：能力模块，而非无限扩张框架。** [Phaser Studio，2026-06-12](https://phaser.io/news/2026/06/how-we-built-the-phaser-game-agent-with-claude-managed-agents-and-superserve)全文已读：AE 用小接口封装碰撞／对象池／输入，Agent 按能力找可配置叶模块并写组合代码。团队自报 Gradius 九个系统复用五个；机械检查通过后，人试玩仍发现地形滚动粗糙，将陷阱回填模块。相比只拆文件，这提供可复用行为与经验的承载点；相比不断给框架加玩法，保住接口规模。文章发布时为 beta、具体模型未知，未给同游戏需求二改或框架迁移成本，该局部比较当时保留差距2；整页现见P76复评，不推 Unity／UE 换引擎。[一手：厂商自报；研究]

**离线收益：人的试玩改变信任边界。** [rushdygames，2026-08-03](https://community.openai.com/t/from-prototype-to-soft-launch-building-a-deterministic-ai-startup-idle-game-with-codex/1388893)明确原型使用 5.6 Sol／Codex，人决定经济、验收与发布。作者报告经济规则改为纯确定性函数与模拟测试；试玩者打破浏览器时间戳方案后，改服务器锚定与单调计时。属于同项目作者自报，未公开补丁、迁移损失或修复工时；不能称本仓复现。[一手]

[研究] 同题选择是“允许本地改钟，还是承诺可信收益”，不是“要不要玩法框架”。服务器路线增加在线依赖，成本未知；无可信经济要求时保本地。Agent 负责实现，用户决定政策，验恢复、改钟与重复结算；回退时不能默许重复补发已结算区间。

**模拟优化＋撤销：借用缓冲不等于历史。** [SHAN，2026-05-24](https://shan-verse.com/blog/codex-after-the-update/)自述让 Codex 把 falling-sand 单文件拆成规则／网格／模拟／渲染，约束不加重框架，本人审 diff、运行并纠正取舍，具体模型未给。以下九月补丁的 Agent／模型及逐项人审归属未知，不能用五月归因补齐。[一手／研究]

- [守恒修复 ae3c78a，09-09](https://github.com/huiishan99/web-falling-sand/commit/ae3c78aa2883b8c1c9e3c4ff70cbc391b0123209)：旧／新网格混读会复制已移动的水；修目标占用检查并加守恒与多步混合世界测试。[一手：diff]
- [二改 872d594，同日](https://github.com/huiishan99/web-falling-sand/commit/872d594b05b66072ca7549827bef52157b8fc625)：逐帧分配改为缓冲复用，同时新增撤销。模拟返回对象以后会复用；snapshot 独立复制，测试继续模拟四步后撤销／重做，核历史独立。[一手：diff]
- [恢复入口](https://github.com/huiishan99/web-falling-sand/blob/872d594b05b66072ca7549827bef52157b8fc625/src/main.js)清 spare、暂停并失效渲染缓存；[作者 DEVLOG](https://github.com/huiishan99/web-falling-sand/blob/872d594b05b66072ca7549827bef52157b8fc625/docs/DEVLOG.md)的局部对照中 occupied bounds 改善稀疏模拟，密集场景基本不变。不是设备 FPS 或 ECS 对照。[一手]

[研究] 同题默认先保既有规则、局部优化；持久快照独立所有，复制与历史内存上限计成本。需要退回分配时保留守恒修复，不能整段回退带回旧缺陷。它是浏览器沙盒，不指定 Unity／UE 实现；新增验收是优化后继续运行，再恢复历史，未在本仓执行。

**差距仍为 2。** 11:38—11:39 UTC 定向补查 Ubisoft／Riot／EA／Supercell 的 coding 工程实践，未取得头部工作室同项目玩法二改比较。[EA AutoWorldModel-Bench](https://github.com/electronicarts/AutoWorldModelBench)的任务定义与指标已读：它评估 coding Agent 改进世界模型的研究能力，非玩法架构维护；[2026-03 客户端生产论文](https://arxiv.org/html/2603.01460v1)的作者、任务与系统部分已读，来自小红书移动 UI，而非游戏。两项均排除，不能拿知名团队补齐同题质量；这轮增加可行证据，未完成最高水平差距收敛。[一手／研究]

**P51 回执。** 提示词 `2026-10-21-exploration-self-use`；起点 `cda12a9`，11:33—11:36 UTC，约3分钟墙钟，等待未单计。输入已知工具／P40案例不计新发现。初轮新查验 N=14／正文 F=13，已知 Anthropic harness 重读另计1／1；决定性 D=6／FD=6（上列作者两文、两个提交、恢复入口、DEVLOG）。镜像去重；Infinite Build 正文超时，不采用。GitHub 历史页 cache miss 后由连接器取得历史；Tetris 页面旧快照不作二改证据。DSCube、Omar、Brutal Derby 已读但缺完整失败修复链，未作决定性依据。补查新增 N=2／F=2，D 不变；合计新查验16／15。无合格独立盲测分母，不报漏检率。[研究]

**冻结后独立参照。** 截止11:44 UTC，独立核查带回3项候选：Unity Insight 为输入已知，Phaser 为新增专业一手，Novaglio 为个人 n=1、非严格上限参照。Phaser 是发现遗漏：它改变“重复能力放哪里”的具体选择；此前按工作室与重构关键词扫描未覆盖引擎团队的 Agent 架构文章。11:45 补读，单列 N=1／F=1／D=1／FD=1，不回写上述冻结统计；三项不是合格同题盲测分母，不报召回率。[研究]

### P53补查：共享能力修复怎样进入旧游戏

2026-10-22（UTC+8）补查六月文章之后的工程变化。**优先复用修过真实错误的窄能力，但不能把新版本能力当旧工程已经接收。** 当前最高水平仍未知；近期领先候选是 Phaser Studio 的版本化 AE 能力，主流参照沿已有组件与人审，本仓仍采用可行默认，不新增框架排名。[研究]

[Phaser Studio，2026-09-22](https://phaser.io/news/2026/09/opus-5-5-grok-4-7-and-muse-spark-1-3-in-the-phaser-game-agent)报告连续三个生成游戏把左右方向弄反，于是提供六个命名方向及内置 mouse-look；这些错误无法只凭截图发现。新建游戏改用 AE v2.8.1，既有游戏保留原模型及引擎版本。因此，二改先核项目版本和已有能力：重复实现与复用能力比较后，再决定局部修复或迁移；更强模型不是旧工程自动修复凭证。[一手：厂商报告；研究]

[2026-07-23 的官方澄清](https://phaser.io/news/2026/07/no-you-didn-t-miss-a-3d-update)指出 AE 是独立、非开源引擎，与 Phaser 4 的 API 不通用。这里借能力边界，不建议 Unity／UE 项目迁移或把 AE API 当开源 Phaser 可用项。采用后仍须真人操作方向、鼠标捕获与恢复路径；迁移破坏旧行为时保留局部修复、退回已验证版本。[一手／研究]

两篇同属 Phaser，未取得独立同题评估；具体错误发生时的模型、同一游戏二改工时和迁移总成本均未知。只能更新候选版本及采用边界，**该局部补查当时保留2；整页现由P76复评为1**，不能据厂商发布或新模型名称降分。[研究]

**补查回执。** 16:43:27—16:44:24 UTC，六条检索式，选入目标N=5／相关正文F=4，决定性D=3／FD=3（本节两篇与WP9的UnityDataTools问题）；检索摘要、导航及重复打开不另计。另读prompt-to-scene的v0.8作者验证节，只有临时工程改名／重启／撤销，不是索引正确率对照，未采用；Asset Insights只见摘要未核原文。公开文本研究，无引擎／模型运行，无独立漏检分母。此为P53续查，不新增P51自用次数。[研究：执行者回执]

## 二、九个模块：做到哪、可省什么、AI 会破坏什么、怎么验

### 1. 游戏循环：把“一局结束”做成真正的生命周期边界

**[研究] 最低完成度**：按需保留Boot／FrontEnd／Loading／Playing／Paused／Results，暂停可为Playing子状态。一个Session／Run拥有本局敌人、临时奖励、计时器、订阅与取消；Settings／存档另属常驻域。下一局创建新session，而非分散重置布尔值。

- **Unity 默认**：一个组合入口装配组件，规则接受明确的 delta/tick；沿已有 Update／FixedUpdate，不替换整个 PlayerLoop。需要物理的运动留在正确时序；UI、相机、菜单是否用不受暂停影响的时间各自声明。
- **UE 对照 [一手]**：GameInstance 跨关卡，GameMode 随关卡而建，Pawn 与控制者分开；不要把世界内 Actor 引用永久塞入 GameInstance 来“保持状态”。[Gameplay Framework](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-framework-in-unreal-engine)
- **可省**：自建引擎循环、跨所有玩法的 GameManager 继承树、单机不需要的服务器会话层；只为快速开始也不必引入 DI 容器。
- **AI 典型风险 [研究]**：第二次加入暂停后，动画停但技能协程／菜单计时仍推进；重开重复订阅，旧一局奖励延迟回调写到新局；失败与胜利同时触发双重结算。
- **将来验证**：同一输入轨迹跑正常结束、失败、暂停时重试、加载中退出，断言每个 session 最多结算一次；旧 session 的事件和回调不能改变新 session；重试若干轮后对象、订阅和任务数回到基线。时钟／物理确定性需真实引擎，纯规则测试不能代替。

### 2. 状态机、行为树与 StateTree：先问什么会打断什么

**[研究] 最低完成度**：状态声明入口、出口、结束、打断优先级与清理。简单敌人用enum／小类；共享地空、眩晕等父规则时再用HFSM；多目标优先级与复用任务确实影响制作时再用行为树。

- **✅ 采用／改造**：UnityHFSM 的状态时序机制适合代码优先的单人项目，但由角色持有独立实例，死亡／场景卸载必须能绕过非关键退出等待；不要复制自己的 HFSM 轮子。
- **🧪 图工作流**：Unity Behavior 1.0.16仅在图资产有收益时试；UE已有Blackboard／BT沿用Observer Aborts，阶段与并发Task为主再评估StateTree，不因新旧替换。[UE BT](https://dev.epicgames.com/documentation/en-us/unreal-engine/behavior-tree-in-unreal-engine---overview)、[StateTree](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-state-tree-in-unreal-engine)
- **真实回退 [一手]**：HFSM 2.2将needsExitTime等改readonly，使依赖运行时修改的用户无法升级（[#71](https://github.com/Inspiaaa/UnityHFSM/issues/71)）；2.3 [94f316f](https://github.com/Inspiaaa/UnityHFSM/commit/94f316fdae5be5abe964f70355bbb697274d38c0)恢复可变，但needsExitTime下次转换求值生效、isGhostState下次进入生效。“清理架构”不得破坏这些契约。
- **近期机制风险 [一手]**：Unity Behavior [1.0.16 changelog](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/changelog/CHANGELOG.html) 增加 OnSetup／OnTeardown，并修复目标不可达时导航持续 Running、运行中黑板位置改变但目的地未更新、动态子图实例／黑板回调问题。1.0.15 才加入特定节点及结构下的 ObserverAbort；不能把所有 BT 的 abort 语义视为一致。
- **可省**：三个简单敌人为其搭可视化节点编辑器；同时维护 HFSM、BT、GOAP 三套决策；每一帧全图扫描；为未出现的内容团队先买大型编辑器。
- **AI 风险 [研究]**：用进入条件冒充持续条件，追击目标消失仍施法；状态退出后异步 MoveTo 继续改速度；等待动画结束永远不退出；共享 Blackboard 上一次目标残留；错误地假定一个 tick 最多一次转换或 StateTree 等所有 Task 完成。
- **将来验证**：死亡／眩晕打断、不可打断窗口结束后的退出，以及不可达、目标销毁、子图替换、禁用再启用的终止／失败。图资产另核升级、枚举改名、Prefab覆盖后的实际运行实例。

<a id="utility-intent-evidence"></a>

#### 效用选意图：作品分工、现成候选与固定源码

**小项目采用薄评分层选意图、既有 FSM 执行；效用不是 BT 的替代宗教。** 对应 [05 效用模块](../../domains/game-dev/05-gameplay-architecture.md#utility-intent-selection)的补兵／换血／撤退／推塔正常链。作者实践支持把合法动作、用途与执行分开；分值和调度仍须按自己的玩法设计，当前最高水平及本案例实际收益未知。

| 公开实践（2017） | 本题借什么 | 不据此推出什么 |
|---|---|---|
| Paragon 的参数化 BT、空间查询与技能选择器 | 技能用途标签服务不同英雄，候选日志帮助查原因；保执行结构而局部评分 | 一张评分表能取代整套 AI 或团队战略 |
| Dragon Age: Inquisition BDS | 把合法动作及其用途列成候选，再评价并执行 | 闭源商业作品的权重适合自己的战斗 |
| Guild Wars 2 考虑项设计 | 原始输入归一化、响应曲线与乘积评分的结构 | 因素越多越准确；零分或跨意图可比性自动成立 |
| Paragon 战略层 | 团队应去哪里与个体战斗怎样做分工 | 1v1 首版必须先造团队规划平台 |

来源：作者公开章节 [Paragon Bots](https://www.gameaipro.com/GameAIPro3/GameAIPro3_Chapter32_Paragon_Bots_A_Bag_of_Tricks.pdf)、[DA:I BDS](https://www.gameaipro.com/GameAIPro3/GameAIPro3_Chapter31_Behavior_Decision_System_Dragon_Age_Inquisition%E2%80%99s_Utility_Scoring_Architecture.pdf)、[GW2 考虑项](https://www.gameaipro.com/GameAIPro3/GameAIPro3_Chapter13_Choosing_Effective_Utility-Based_Considerations.pdf)、[Being Where It Counts](https://www.gameaipro.com/GameAIPro3/GameAIPro3_Chapter24_Being_Where_It_Counts_Telling_Paragon_Bots_Where_to_Go.pdf)。这是机制参照，不是本仓运行复现。

**先算制作与维护成本，再选库。** 目前没有同案例的真实品质／工时比较；商业工具未购买或运行，开源候选仅静读，不能以营销中的“更自然”替代效果证据。

| 路线 | 适合什么；采用评级 | 成本与撤回条件 |
|---|---|---|
| 薄评分＋现有 FSM／执行图 | ✅ 少量英雄，已有移动／技能执行；BT 局部分支也可评分 | 若只是固定巡逻→追击→攻击，条件规则更省；不维护两套打断所有者 |
| Utility Intelligence GO | 👀 多设计者反复调决策／目标过滤、曲线，需要编辑器运行预览 | 商业许可、类型／版本约束和资产迁移需在自己的角色上试改核定；未购买、未试用 |
| ZorPastaman UtilityAI | 👀 阅读 Brain／Consideration／Action 分工与切换差值；固定版 MIT | 宿主仍补资格、全零出口和强制退出；不直接替换已有执行器 |
| crashkonijn/GOAP | 👀 “先拿钥匙→开门→救援”等可替换多步达成路径；作者仓库 Apache-2.0 | 增加状态、前置条件、效果、计划失效重规划；只加支援意图不值得换框架 |

来源：官方 [UE BT Overview](https://dev.epicgames.com/documentation/en-us/unreal-engine/behavior-tree-in-unreal-engine---overview)、[Unity Behavior 1.0](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/manual/index.html)；作者 [Utility Intelligence GO Overview](https://uintel-go.utilityworlds.com/Documentation/Overview/)（页显更新 2026-08-09），另读 Decision／Decision Makers 页、[FAQ 类型／版本约束](https://utilityworlds.com/FAQs/)；[GOAP 仓库与许可](https://github.com/crashkonijn/GOAP)。既有 Unity Behavior 1.0.16／UnityHFSM 2.3 生命周期结论仍沿上节原记录，不刷新核实日期。

**固定 Brain 展示了可借机制，也展示了必须由宿主补齐的语义。** 读 ZorPastaman/UtilityAI `5471701695f333f01a6d0dc441fbebb574fafa51`（2025-10-16）的 Brain、BrainSettings、package 和 MIT 许可，未运行该 Unity 库：

- 考虑项相乘得到动作分；增加相同的非 1 因素会降低乘积，须核因素数量与跨动作校准。
- `FindBestActionIndex()` 从索引 0 开始，仅更高分替换，因此全零 argmax 返回首项。初始化据此 `Begin()` 首项；运行时经过 `SwitchAction()`，又可能因差值门槛保留当前非首项。它没有显式“无可选动作”语义。
- `SwitchAction()` 比较当前与新动作的本轮分数，差小于 `minimalUtilityDifference` 才返回；达到门槛就 `End()` 旧动作、切索引、`Begin()` 新动作。同一索引不重复进入。差值本身不区分资格失效、技能承诺或反应时机。
- 因而正文不直接搬这个选择器：发起资格、阶段持续合法性、战术退出分层；无正分候选提交回退，不能抢断合法恢复期。正文示例用严格 `>` 的切换政策，与库的“达到门槛”分开。

固定来源：[Brain.cs](https://github.com/ZorPastaman/UtilityAI/blob/5471701695f333f01a6d0dc441fbebb574fafa51/Runtime/Core/Brain.cs)、[BrainSettings.cs](https://github.com/ZorPastaman/UtilityAI/blob/5471701695f333f01a6d0dc441fbebb574fafa51/Runtime/Core/BrainSettings.cs)、[LICENSE.md](https://github.com/ZorPastaman/UtilityAI/blob/5471701695f333f01a6d0dc441fbebb574fafa51/LICENSE.md)。没有复制库实现或下载副本进入交付。

**合成检查支持算术，不代表产品行为通过。** 原创 Python 检查 19 项通过：低血曲线、四个评分式、危险单调性、零／空候选、资格淘汰、切换差值、稳定排序、NaN、缺失／越界输入及重复身份。首次低血曲线的浮点完全相等断言失败，改近似断言后通过，公式未变。该脚本未实现反应队列、导航、技能或引擎，故恢复期全零、迟到回调、实际反应、公平感、性能和跨运行时确定性仍待产品验收。

本节原资料核实：2026-10-26（UTC+8）；文档／源码静读与原创算术合成检查。正文四公式、统一候选接口与调度仍是设计建议。Valve 官方 wiki 原入口返回 403 后已停止，未读内容不作依据。

**真实消费者先修生命周期与资格，再谈评分惯性。** MOBA-Like 已发布的 v8 采用逐角色 `HeroBot.think()`：在决策间隔内选择撤退、换血、补兵、推进等意图，由既有方法生成普通移动／攻击／技能命令，Simulation 负责合法性和结算。它不是正文四式或纯选择接口的完整实现；当前没有战争迷雾。第二英雄和指向 Q→方向弹道已有版本化模拟及回放，不把尚未采用的蓝图一并记为落地。

| 实际接入与反例 | 对正文选择的影响 |
|---|---|
| 毁坏的外塔保留在实体容器；v7 起 `ownOuterTower()` 筛存活，推进等待点在没有活外塔时回原基地集结点 | 身份存在、数值低与候选资格是三件事；死塔／活塔／缺塔分别测，不用分数惩罚掩盖资格错误 |
| 目标同 ID 近距复活仍可能沿用上次 `firstSeen`；v8 清自身死亡及已知目标死亡／移除的首次识别记录，保位置跟踪与 RNG | 反应计时属于当前生命期；在施法／失能提前返回前做硬资格清理。无迷雾消费者不能证明该全状态查询适用于迷雾项目 |
| v8 正常 seed136 超时；只读跟踪不改变终态 hash，英雄在基地退路未损失 HP，却反复在约三成血量退出撤退，主要转推进 | 验恢复需要实际回血、停留与退出后结果，不只看“到达安全点”或切换次数。完成的对局也切换；不要把低血恢复需求错误地限定为眼前有敌人 |
| 旧 v3 恢复承诺仍先抽难度失误，只在承诺期跳过评分噪声；该候选高低难度为 74%，未采用 | 保留失误不等于保留随机序列；同一 bot 的评分／失误共流会随分支移位。比较恢复机制时分清行为承诺与抽样影响，不能直接给所有行动加通用锁 |

已发布 v8 的固定 900 局为正常 200、高低难度 200、镜像 500：正常 seed136 超时；高低难度 91%；镜像蓝方 278/500，95% 区间未覆盖 50%。三批 0 异常／卡死，各 3 次输入回放哈希相同。可重放证明确定性，不证明不偏向某一阵营，更不证明机器人像人；实际目标与时长留在产品 brief，不用检查退出码替代它们。

在固定产品版本安装依赖后，先跑真实反例，再做三组对局；统计检查失败仍须保留报告：

```sh
npm test -- tests/live-anchor.test.ts tests/reaction-life.test.ts
npm run sim -- --content-version 8 --games 200 --seed 1 --verify-targets normal
npm run sim -- --content-version 8 --games 200 --seed 1 --blue-difficulty high --red-difficulty low --verify-targets difficulty
npm run sim -- --content-version 8 --games 500 --seed 201 --verify-targets mirror
```

**单位次序问题另归结算层，不靠 AI 权重补偿。** 独立 v9 候选在单位入口取共同状态，统一移动与普攻死亡，再发奖励；500 镜像为 256/244、区间覆盖 50%，但正常 200 仍有 seed13 超时。无英雄的对称波线在原／红先次序、Detour／直线导航四组中全程位置和 HP 对称，直到 1200 秒也不自行终局。因此它支持“固定排序不等于公平、对称不等于能完成目标”的测试分工，不支持把 v9 记为默认已采用，也不替代真实可玩与手感验收。

真实消费者核实 2026-10-26：已发布固定 [AI 源码](https://github.com/dbvv1/MOBA-Like/blob/c5c01ba414cc5f322631b7ed7bbbe5bfa10853f7/src/sim/ai.ts)、[活塔资格测试](https://github.com/dbvv1/MOBA-Like/blob/c5c01ba414cc5f322631b7ed7bbbe5bfa10853f7/tests/live-anchor.test.ts)、[反应生命期测试](https://github.com/dbvv1/MOBA-Like/blob/c5c01ba414cc5f322631b7ed7bbbe5bfa10853f7/tests/reaction-life.test.ts)、[brief／真实目标差距](https://github.com/dbvv1/MOBA-Like/blob/c5c01ba414cc5f322631b7ed7bbbe5bfa10853f7/docs/brief.md)；未采用的 [v3 控制器](https://github.com/dbvv1/MOBA-Like/blob/a96956c9ae32e3bf555d8faf37b9c0a13c3ae6ad/src/sim/ai.ts)；非默认 [v9 候选源码与检查](https://github.com/dbvv1/MOBA-Like/tree/a244bebcef6f827a507dd35d7a3ba507839434f3)。本轮复用原作者／工具比较并读固定源、跑实际 Node 对局与反例，未重新扫描工具生态，未把候选运行改写为浏览器或品质通过。

### 3. 数据驱动配置：静态定义、活实例、存档不能同一个对象

**[研究] 最低完成度**：定义保存稳定ID、初值和资产引用；实例保存HP、冷却、目标与阶段；存档保存可迁移快照及schemaVersion。沿用SO／DataAsset／DataTable／CSV，校验ID、引用、范围与迁移，不由格式决定架构。

**[一手] Chop Chop [608eac98](https://github.com/UnityTechnologies/open-project-1/tree/608eac98df29cd97821a6115cd52dfb9027345b1)**：TransitionTableSO.GetInitialState为每个StateMachine建createdInstances；StateActionSO.GetAction生成并在图内复用运行StateAction；敌人无HealthSO时CreateInstance。可借配置共享／运行隔离，不必继承SO编辑器。

**[一手] 历史反证 [753c30e](https://github.com/UnityTechnologies/open-project-1/commit/753c30e6fda71c6024c69ee5704b71cfa110e160)**：初始血量移入新建分支，避免Awake重置已有玩家HP；另修UI重置、敌人误发玩家UI事件。同类型寿命不同，不能统一Reset。

- **可省**：“所有整数都 SO”、每项配置热更新、可视化表格后端、通用反射 ORM、自建 mod 语言；没有外部内容作者和热更新需求就用引擎已有序列化。
- **AI 风险 [研究]**：向共享技能定义写冷却；用数组序号当存档 ID；将字段重命名视为纯代码改动而破坏已序列化资产；敌人复制后同时掉血；把静态 readonly 与领域不变量混为一谈。
- **将来验证**：同一定义生成两个角色、只伤害其中一个；先运行再新开局确认定义未污染；固定 v1 存档在 v2 增删／改名内容后加载，必须迁移或可理解地拒绝。对配置修改分开记录“既有实例即时生效、下次生成生效、仅新局生效”，不能由 Agent 猜。

#### 定义二改：能加载不代表旧实例仍匹配

核实：2026-10-17（UTC+8）。

**[研究] 改配方输入或触发方式时，把定义与已保存的实例结构／待执行工作一起核。** 原有 ID、字段、范围校验和生效时点仍需保留；但新定义合法，不代表旧实例能按新规则运行。以下分别是经济生产和延迟效果的历史修订，不证明所有游戏都应统一迁移或清空队列。

**Widelands：选择迁移旧建筑，而非只改配方。** [维护者调查](https://github.com/widelands/widelands/pull/6505#issuecomment-2288505206)指出，旧建筑可以加载，但保留旧输入队列、执行新生产程序，因缺新输入而无法生产；尝试同时接受丝／布又被定义检查拒绝。[最终配方 5fa703b](https://github.com/widelands/widelands/commit/5fa703b75f24fb7d26df0477331b795281298fdb)把工具房的布输入及捕鱼网／弓消耗改为丝；先合入的兼容提交 [1e181e0](https://github.com/widelands/widelands/blob/1e181e07f280bf3fc3848e0b689e132e76a5c26a/src/map_io/map_buildingdata_packet.cc#L820-L930)逐项对照当前输入定义，补空队列、调整容量，并删除废队列／超额货物，向玩家列明损失、提示检查生产程序和设置。两提交均为 2024-12-03 的实际修订；GitHub 的 Codeberg 镜像 PR 状态不代替提交证据。[一手]

**保货不是无代价的默认。** [方案 A／B／C／D](https://github.com/widelands/widelands/pull/6531#issuecomment-2336636672)比较保旧队列、逐步排出、加强排出机制和直接删除；[维护者试过 A／B](https://github.com/widelands/widelands/pull/6531#issuecomment-2346148619)后认为保留已无用途的队列令人困惑，选择 D，货物重要时建议用旧版完成游戏，或先清队列再保存。最终 [#6570 审阅](https://github.com/widelands/widelands/pull/6570#pullrequestreview-2473857742)在 `dda0b74a` 报告测试可用，正文仅称通过最小联机测试；[作者早期测试](https://github.com/widelands/widelands/pull/6505#issuecomment-2299899224)的 `666288c` 则属于保货实验方案，不能当最终 D 的完整回归。官方讨论镜像不计独立来源；兼容提交还收窄了消息包版本范围，不能宣称所有旧档兼容。[一手] **[研究]** 已删除货物不会因退回配方自动恢复，这是代码推论；该项目的游戏内取舍不是一般数据丢弃建议。

**CDDA：保留 ID 也会改变旧工作的含义。** [#77664](https://github.com/CleverRaven/Cataclysm-DDA/pull/77664)（合入 `09d648e4`）把同一 `EOC_Nunez_Travel` 从周期检查改为显式延迟调用，删除旧条件；[旧档玩家](https://github.com/CleverRaven/Cataclysm-DDA/issues/77877)未达前置任务却生成车辆／NPC，[作者确认](https://github.com/CleverRaven/Cataclysm-DDA/issues/77877#issuecomment-2478519116)旧调用仍在队列。修订 [#77879](https://github.com/CleverRaven/Cataclysm-DDA/pull/77879)（`0461e7df`）给新逻辑新 ID，旧 ID 留空定义。后续同类 [e4ea40d](https://github.com/CleverRaven/Cataclysm-DDA/commit/e4ea40d224dcfdaef2d5fc480f921f9ab77f8e80)修订下的[源码](https://github.com/CleverRaven/Cataclysm-DDA/blob/e4ea40d224dcfdaef2d5fc480f921f9ab77f8e80/src/effect_on_condition.cpp#L77-L90)将无周期的定义默认为 ACTIVATION；加载更新保留有效 ID 的队列，到期执行后[消费非周期项](https://github.com/CleverRaven/Cataclysm-DDA/blob/e4ea40d224dcfdaef2d5fc480f921f9ab77f8e80/src/effect_on_condition.cpp#L164-L264)。因此是隔离旧副作用、到期消费，不是加载时清空。[一手／研究]

[#78141](https://github.com/CleverRaven/Cataclysm-DDA/issues/78141)还指出：按新定义没有周期就清除队列，会误删合法一次性延迟调用；新加来源标记只能保护以后保存的记录，不能补回旧档缺失信息。该问题被标 stale 关闭，不是通用修复完成；前述退役也可能取消旧 ID 下合法的待执行动作。#77879 作者测试针对简化效果的地图旋转，未找到玩家修后回执，不写完整迁移回归通过。[一手／研究]

**[研究] 二改验收预注册**：用已有资源队列／待执行动作的旧档，加载后继续生产／执行，再保存重载；核新旧实例输入与副作用一致、合法延迟动作未被误删、迁移未重复执行。若无法可靠辨识旧记录来源，比较保留旧解释、定向迁移、明确退役或限制升级；先说明损失及恢复所需旧档／旧版，不默认新增兼容框架。本仓仅核公开源码与回执，未运行这些游戏或上游测试。

### 4. 组件、Jobs/Burst、ECS：先用数据规模和预算选，不用对象数口号选

[研究] 本小节 Jobs/Burst、Entities、ECB、enableable、authoring／烘焙的具体机制属于 Unity；UE 仅共用先定位成本再迁移热点的原则，不据此建立跨引擎 API 等价关系。

**[研究] 默认采用**：组件接引擎对象，纯函数／普通类承载规则。先定位动画、绘制、碰撞、寻路或CPU成本；ECS不解决GPU overdraw等异类热点，单个批处理也可只用Jobs/Burst。

**[一手] [Entities samples 6786a741](https://github.com/Unity-Technologies/EntityComponentSystemSamples/tree/6786a741ee1f118ed14cecfa02beae8e926937b0)** README指Unity 6.2／Entities 1.4；实际`13. StateChange/SetStateSystem.cs`比较VALUE、STRUCTURAL_CHANGE、ENABLEABLE_COMPONENT并带profiler。README仍链接14，复查应找实际路径；只借热点小样例。

**[一手] Entities 1.4代价**：[结构变更](https://docs.unity.cn/Packages/com.unity.entities%401.4/manual/optimize-structural-changes.html)会迁移数据并涉及同步；[enableable 1.4.8](https://docs.unity3d.com/Packages/com.unity.entities@1.4/manual/components-enableable-use.html)不改archetype，但写作业可阻塞主线程查询，禁用在普通查询中视同不存在。

- **ECS条件 [研究]**：目标设备上同构CPU计算确已超预算，内容适合baking／数据布局，且能承担混合层、调试与版本适配。先迁热点，不设统一对象数门槛。
- **反证 [一手／研究]**：[Unity 案例](https://unity.com/resources/stunlock-studios-v-rising)证明V Rising生产采用ECS，也说明范式／底座投入；多人开放世界团队成功不证明单人起步全ECS最省。
- **可省**：全工程 ECS、为少量机关加实体世界、过早锁步／回滚；UE 的 Mass 同样不因“将来大地图”默认加入。
- **AI 风险 [研究]**：用 Add/Remove tag 表达每帧变化而制造结构变更；读写依赖遗漏；把 ECB 录制完成当已应用；复用销毁的 Entity；忘记禁用组件过滤；authoring 数据修改却没有重烘焙。
- **将来验证**：同玩法、资产、设备与出生／死亡密度下比较组件、局部Jobs和ECS，测CPU P95/P99、同步、内存、主线程／worker及二改工时。样例强制Complete只属测量设施；结构变更计时只录ECB、playback在后，ENABLEABLE还混用ECB启用与直接禁用，须连后续系统计总成本，不能据局部计时排名。

### 5. 事件：用于传播已发生事实，别把一次命令拆成无人负责的广播

**[研究] 最低完成度**：对象内直接调用；跨边界确需多观察者才用类型化事件。命令有唯一处理者和结果，DamageApplied／EnemyDied等事实提交后再通知。声明同步／排队、顺序、重入和丢弃；SO通道仅在Inspector装配／跨场景有收益时用。

**[一手] Unity 官方例子**强调 OnEnable 订阅／OnDisable 退订并说明 SO event channel 是项目级资产；因此“换场景就自动清干净”不是其承诺。[官方事件通道说明](https://unity.com/how-to/scriptableobjects-event-channels-game-code)

- **可省**：无差别全局 EventBus、字符串消息、自建完整 CQRS／事件溯源、每帧健康轮询和每个属性一个广播。
- **AI 风险 [研究]**：匿名 lambda 退订失败，双重订阅，事件在构造半完成状态发出；伤害／死亡广播造成重入后重复奖励；晚订阅 UI 丢失初始状态；一条事件跨场景带过期对象引用。
- **将来验证**：重复死亡只结算一次；回调内销毁／退订不破坏枚举；池化多轮无重复订阅；晚加入UI从快照取值。跨寿命时按需用sessionId／entityId／operationId拒绝旧事件，局部调用不强制加ID。

### 6. 战斗与技能：先统一结算权，再谈 GAS

完整的体验目标、底座选择、职责、正常施放链、配置和二改现统一在 [05 §7](../../domains/game-dev/05-gameplay-architecture.md#7-战斗与技能先统一结算再决定-gas)，本节保留原生生命周期与历史动作证据，不再维护第二份实现规范。2026-10-25 整合；资料／源码研究，未运行引擎。

- [Epic Gameplay Abilities](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-abilities-in-unreal-engine)：CommitAbility 应用费用／冷却；正常结束须 EndAbility；Per-Actor 复用需清成员。2026-10-25 复核公开生命周期文档，不据此声称现有工程正确。
- [Abilities in Lyra](https://dev.epicgames.com/documentation/unreal-engine/abilities-in-lyra-in-unreal-engine?lang=en-US)：PawnExtension 等 possession、PlayerState、Input、Game Feature 就绪才授能力，失 Pawn 撤关联；这是多人生命周期参照，不是单机必须采用的整套底座。

**动作响应与承诺（2026-10-15 UTC+8）。** [研究] 沿技能定义／执行实例与局部状态机，分别定移动转向、阶段出口和再次攻击资格。动画退出不等于退款、重开命中盒或清冷却；本节只补输入识别后的动作许可。

- **历史调整 [一手]**：[Hades 官方历史补丁](https://www.supergiantgames.com/blog/hades-updates/)在2020-10-27改Guan Yu缓冲使连击间可Dash，2020-12-01同时加快Heavy Knuckle并解原地锁。[研究] 支持局部控制权调整，不能拆因果或推出所有武器任意取消、Hades II当前规则。
- **固定机制 [一手]**：Overgrowth [playercontrol.as](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/playercontrol.as#L469-L478)提供移动／跳／蹲／抓／攻击取消意图；[aschar.as](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L9600-L9610)检查动画已设、cancel门槛及延迟再EndAttack；[退出路径](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L6260-L6274)清动画回调并回运动。[研究] 借请求、阶段许可与退出；未核完整曲线，不能推出帧数／退款。代码Apache-2.0，动画美术另属权利人。
- **撤回反例 [一手]**：[Overgrowth 1.2 公告，2018-03-15](https://www.wolfire.com/blog/2018/03/Overgrowth-1-2---Combat-improvements/)取消casual外攻击吸附，缩短高难度肩投距离。[研究] 自动修位会改承诺；第三人称近战与Hades俯视比较不推广格斗帧表／联网竞技。

**动画释放边界补核（2026-10-16 UTC+8）。** 主线3；改变的建议：动画淡出后失去后续操作，先核现成回调与释放时机，不统一添加定时解锁；新证据：Epic 历史维护复现与 UE 5.8 当前选项契约，Unity 6.3 过渡状态机制对照。

- **已修历史问题 [一手]**：[UE-183351](https://issues.unrealengine.com/issue/UE-183351)的Lyra长淡出中移动打断，监听Completed／Interrupted的EndAbility可能漏触发。WaitDelay仅报告中的workaround；已Fixed、Target Fix 5.3、修复`25328943`，不当当前故障。未下载Lyra／私有引擎源码。
- **当前选择 [一手]**：[UE 5.8 PlayMontageAndWait](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Ability/Tasks/PlayMontageAndWait)区分淡出与播放完成；Allow Interrupt After Blend Out=true才在淡出后给Interrupted，关闭时该阶段打断无Interrupted／Complete，页面不证默认值。Stop When Ability Ends=true使正常结束也停Montage，显式取消总停止。先核选项，不据旧问题加watchdog。
- **释放政策 [研究]**：完整播放才还控制→覆盖淡出中的打断；淡出开始即结束规则→核EndAbility是否截断应保留表现；后面还有Montage／逻辑→只推进或取消当前阶段。清理可共享，取消不得提交成功结果。
- **Unity边界 [一手／研究]**：[Unity 6.3 StateMachineBehaviour](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/StateMachineBehaviour.html)允许current／next／interrupted同时活跃，同步层可多次回调；[OnStateExit](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/StateMachineBehaviour.OnStateExit.html)只是结束评估。旧出口只释自己的占用／窗口，不能撤新动作；局部表现仍用原生回调，不将机制推成当前故障。

### 7. 相机：先复用成熟运行时，验收的是可读性与控制权

**[研究] 最低完成度**：每视口最终输出唯一，跟随／瞄准／过场／菜单有优先级；传送重生按意图处理历史，遮挡、暂停、震动各有政策。Unity先适配版本的Cinemachine，UE先CameraComponent／SpringArm／PlayerCameraManager；简单玩法保留固定镜头。

**[一手] Cinemachine修订**：[45728f30](https://github.com/Unity-Technologies/com.unity.cinemachine/tree/45728f3030787076f32930101d11d9ca96fe3a0f) Brain分Smart／Fixed／Late；2026-02 fast-enter-play之后，[2026-08 #1122／69b2051](https://github.com/Unity-Technologies/com.unity.cinemachine/commit/69b205115495a374fbba329547ba608cdcfe7847)把static reset提前至SubsystemRegistration并重建CameraUpdated／Activated事件。changelog归3.1.8-pre.2，未证全部已发3.1.x含修复。

- **可省**：自研完整 Cinemachine、每种技能独立控制 Camera transform、对普通固定视角游戏搭通用镜头语言。
- **AI 风险 [研究]**：物理目标在 FixedUpdate 移动而镜头拿不一致时序；传送后追着旧位置平滑；切镜完成的回调却在取消后覆盖新镜头；循环进入 PlayMode 静态监听残留；禁用鼠标控制但最后一帧轴值继续生效。
- **将来验证**：低帧率、不同固定步长、暂停／恢复、传送、重生、过场中取消、窄走廊、快速多次切镜；有时序日志和屏幕轨迹仍要真人判晕动与瞄准手感。相机库修复不是游戏已验证。

### 8. 关卡：先做可重置的遭遇，再做大世界

**[研究] 最低完成度**：关卡定义含稳定levelId、入口、目标、出生表；Encounter拥有所生敌人、触发与一次奖励；存档保存完成事实。目标、出口、回退位置可查，重进不重发奖励。

- **Unity**：场景承载内容，组合入口注入玩家／服务；Additive／Addressables 的释放细节归 WP10，玩法层必须提供退出／取消钩子。UE 先普通 Level；确实需要流式世界后再上相应分区机制。
- **可省**：小房间游戏用 World Partition 级系统、无玩法约束的随机铺图、自建通用关卡编辑器；已有模块化房间足够时优先组合，但仍需按路线与遭遇目标筛选，详见文末关卡组合补研。
- **AI 风险 [研究]**：把 Scene load 完当玩法 ready；门只等某个已销毁敌人的事件而永远不开；检查点保存了运行实例引用；生成顺序改变而让种子不再对应同布局；脚本重建关卡丢稳定 ID。
- **将来验证**：从每个检查点恢复，杀怪后离开再回、完成事件重放、加载失败、出生位置被占、最后敌人离场；验证出口可达、任务可完成、关键资源可取得。程序化地图保留 seed、生成器版本与关键布局数据，只有 seed 不保证版本升级仍兼容。

### 9. AI 第二次修改：交付“契约切片”，不强制再搭一层工具

**[研究] Agent 上下文**：提供相关实现、准确包版本与本地改造、资产／节点引用和既有回归夹具。用一页以内的契约交代：

- 定义不保存当前 HP、目标、冷却；谁创建、复用和清理运行实例
- 字段分别属于项目、存档、session、场景、角色还是一次施放；计时器使用什么时钟
- 谁提交伤害、奖励与库存变化，谁只观察；同步或排队事件按什么顺序处理
- 正常结束、取消、死亡、卸载、池回收各清哪些句柄、标签、任务和订阅；内容 ID 与序列化字段改变时如何迁移、用哪些旧夹具验证

先追清需求涉及的位置再改，不顺手升级依赖或另搭文档平台。

**第二次需求 [研究]**：单段冲刺改成蓄力、受击中断、按承诺扣资源并能检查点重开；同时检验实例、退出、命中幂等、晚动画、相机和关卡。记录改动文件／资产、主动工时与回归失败。

## 三、分档选择：不要把最高复杂度当最高质量

[研究] 分档是同一玩法质量下的总成本判断，不是实测排名；“质量上限”指复杂需求候选，本地／免费不免许可义务。具体采用、升级与可省项见第二节对应模块。

**[研究] 何时撤回／升级**：出现测得的规模瓶颈、反复重复的效果语义、真实内容编辑需求，或第三方版本／许可条件改变时重新选择；不能因为新包发布就重架构。升级必须保住旧内容与旧存档的行为，简单方案失去优势才替换。

## 四、可借用项目与许可：采用单位是机制，不是整个仓库

| 项目／固定版本 | 维护及真实采用证据 | 许可和成本边界 | 采用判断 |
|---|---|---|---|
| UnityHFSM [f8fdc2ef](https://github.com/Inspiaaa/UnityHFSM/tree/f8fdc2efb862522acd26fab6cd940886c84cde37)，默认最后提交 2026-03-23 | [一手] 2.3 changelog、#71 原报告、维护者回应及补丁已读；具体商业游戏采用未核实 | [MIT LICENSE](https://github.com/Inspiaaa/UnityHFSM/blob/f8fdc2efb862522acd26fab6cd940886c84cde37/LICENSE.md)，保留版权和许可；本轮未运行测试 | ✅ 在需要层级时采用；固定版本，先回归退出语义 |
| Chop Chop [608eac98](https://github.com/UnityTechnologies/open-project-1/tree/608eac98df29cd97821a6115cd52dfb9027345b1) | [一手] 官方开源 demo；README 明确 2021-12 停止开发，Unity 2020.3，最后提交 2022-06-26 | 根 [Apache-2.0](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/LICENSE)；具体素材／包仍各核；不复制美术、音频 | ✅ 学实例化／事件生命周期；⛔ 不作为当代默认工程底座 |
| Daggerfall Unity [2343305d](https://github.com/Interkarma/daggerfall-unity/tree/2343305d1d83ccc0de57a81e3b1e61188a997e34)，2026-09-14 | [一手] 已发布完整可玩重制，最近 release [v1.1.1-cve-2025](https://github.com/Interkarma/daggerfall-unity/releases/tag/v1.1.1-cve-2025) 是安全更新；EnemyMotor、README、2024 改动读过 | [MIT](https://github.com/Interkarma/daggerfall-unity/blob/2343305d1d83ccc0de57a81e3b1e61188a997e34/LICENSE) 覆盖项目代码，不给原版 Daggerfall 贴图、模型、音频权利；README 要求外部原版数据 | ✅ 学具体行为演化；⛔ 不移植整个 RPG 或素材当原创商用游戏 |
| Entities Samples [6786a741](https://github.com/Unity-Technologies/EntityComponentSystemSamples/tree/6786a741ee1f118ed14cecfa02beae8e926937b0)，2026-03-06 | [一手] 官方小样例，6.2／1.4 路线；不能当已发行游戏证明 | [UCL](https://github.com/Unity-Technologies/EntityComponentSystemSamples/blob/6786a741ee1f118ed14cecfa02beae8e926937b0/LICENSE.md)，需有效 Unity 许可及通知；不是 MIT，也不许任意跨引擎复制 | 🧪 只借与热点相符的样例；实际性能待测 |
| Cinemachine [45728f30](https://github.com/Unity-Technologies/com.unity.cinemachine/tree/45728f3030787076f32930101d11d9ca96fe3a0f)，2026-09-29 | [一手] 读取 Brain/Core/changelog，历史修复持续可见；未核本项目所需最低稳定修复版 | [UCL](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/LICENSE.md)；与 Unity 引擎许可配套 | ✅ 复用包；不以主干 pre.2 代替已验证发行版 |
| Unity Behavior 1.0.16 | [一手] 官方文档与 2026-05 变更已读；没有读取固定包源码或核实商业游戏采用 | [官方 LICENSE](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/license/LICENSE.html) 指 Unity Terms of Service，不是 UCL/MIT；相应计划和实际包权限安装前核 | 🧪 图工作流有收益才采用，不自动替换 HFSM |
| UE GAS／原生 BT／StateTree | [一手] 本次读取 Epic 5.8 文档；未获取有许可的引擎源码快照 | [UE EULA](https://www.unrealengine.com/en-US/eula/unreal)；引擎与商业发行条款单独适用，源码可见不等于开源 | ✅ 条件适用时复用引擎系统；不把网络机制全塞进单机 |
| Lyra 官方样例 | [一手] 读 Epic 机制文档与 Fab 官方页；没有下载项目，不用来声称固定源码已核查 | [Fab 页](https://www.fab.com/listings/93faede1-4434-47c0-85f1-bf27c0820ad0) 明写 UE-Only，显示 Allows usage with AI: No；具体获得时适用许可及 NoAI 范围必须核实 | ✅ 读公开机制说明；⛔ 不作为默认可交给 Agent 全量输入／跨引擎素材来源 |
| Opsive Behavior Designer Pro（商业对照） | [一手] 官方功能／条件打断文档、2026-10-02 EULA 已读；付费源码及实测未读，AAA 宣传不计质量证据 | 自定义EULA；购买页与合同的操作者资格／阈值有冲突，价格、源码持续权与待确认项仅在[阶段F](#阶段-f-商业资格与版本补核)维护，采购前核具体SKU／席位 | 👀 有持续图编写和配套任务收益才评估；不能当免费或无条件买断源码；本轮不购买 |

**[一手] UCL 注意**：[现行 UCL 1.4](https://unity.com/legal/licenses/unity-companion-license) 要求与有效 Unity Engine License 下创作／发行有关，保留通知，第三方组件另循条款；不能因软件免费即忽略引擎条件。

**[一手／研究] NoAI**：[Epic Content License §5(c)(viii)、§17](https://www.unrealengine.com/eula/content)对适用NoAI Content限制生成式AI数据集、开发与输入。Fab标签未证明每个Lyra代码文件同许可，也不禁止所有UE开发用AI。接入须保存具体授权链，不以非官方镜像绕过。

**[研究] Opsive按持续维护总成本选择，不把对象码留用当源码永久可维护。** 资格冲突与到期义务见[阶段F](#阶段-f-商业资格与版本补核)；未接受或付款。

## 五、两个成熟项目能反证什么，不能反证什么

### Daggerfall Unity：已发布复杂游戏也不等于全图／全 ECS

**[一手]** EnemyMotor 是 MonoBehaviour，FixedUpdate 以明确顺序处理麻痹、击退、重力、不能行动、撞门、计时器、行动与跌落伤害，其他感知／攻击组件分工；并不是“一个统一黑板图自动管理全部”。[固定 EnemyMotor](https://github.com/Interkarma/daggerfall-unity/blob/2343305d1d83ccc0de57a81e3b1e61188a997e34/Assets/Scripts/Game/EnemyMotor.cs)

**[一手]** [0519cee（2024-01-08）](https://github.com/Interkarma/daggerfall-unity/commit/0519cee99740d4005ef70b99a3a064ac0655ce72) 为 mod 提供具体行为 delegate；后续仍在具体重力／地面位置逻辑上修正。扩展点随真实需求出现，不必在第一天重写通用框架。该源码也有庞大类、全局访问和历史兼容负担，不能反推“大类就是最佳实践”或无需状态契约。

**[研究] 对单人的启发**：优先保证一个清晰、有测试的决策和结算顺序，再为真实重复需求抽象；不要为了“专业架构”把每个函数拆成一层抽象。复刻既有游戏的范围与原创项目不同，项目成功不能证明当前 Agent 能独立从零做同规模游戏。

### Chop Chop：可借结构，但历史 demo 的特例不能升格为通用规则

**[一手]** Damageable死亡即重设数值但保留IsDead，Revive另处理；CameraManager存场景外anchor，角色重建后重绑Follow／LookAt，禁输入清轴值。属于该游戏流程，不能直接套给可查尸体HP、多玩家或对象池。

**[研究] 采用单位**：定义与实例的区分、订阅成对释放、角色重生通知相机这些机制值得采用；项目版本、整个事件网络、内容资产、UI 与任务框架不用一起继承。没有经过第二次需求修改的“模板已跑起来”，不足以成为发布底座选型结论。

## 六、固定源码的核查入口（复查入口）

均为 [一手]，日期为本次读取默认分支最新提交的作者日期，不保证持续维护。

- HFSM：`f8fdc2efb862522acd26fab6cd940886c84cde37`；`src/Base/StateBase.cs`、`src/StateMachine/StateMachine.cs`、`Changelog.md`、`LICENSE.md`；读取 #71 本文和 comments，维护者明确 2.3 已恢复修改
- Chop Chop：`608eac98df29cd97821a6115cd52dfb9027345b1`；`StateMachine/ScriptableObjects/StateActionSO.cs`、`TransitionTableSO.cs`、`StateMachine/Core/StateMachine.cs`、`Characters/Damageable.cs`、`Camera/CameraManager.cs`、README、LICENSE；历史补丁 `753c30e6fda71c6024c69ee5704b71cfa110e160`
- Entities Samples：`6786a741ee1f118ed14cecfa02beae8e926937b0`；`Dots101/Entities101/Assets/HelloCube/6. EnableableComponents/RotationSystem.cs`、`13. StateChange/SetStateSystem.cs`、`ConfigAuthoring.cs`、README、LICENSE
- Cinemachine：`45728f3030787076f32930101d11d9ca96fe3a0f`；`com.unity.cinemachine/Runtime/Behaviours/CinemachineBrain.cs`、`Runtime/Core/CinemachineCore.cs`、CHANGELOG、LICENSE；历史补丁 `69b205115495a374fbba329547ba608cdcfe7847`
- Daggerfall Unity：`2343305d1d83ccc0de57a81e3b1e61188a997e34`；`Assets/Scripts/Game/EnemyMotor.cs`、README、LICENSE；历史补丁 `0519cee99740d4005ef70b99a3a064ac0655ce72`；最近 release API 与说明已读

[研究] 来源为公开 GitHub／官方正文；#71 同时读取维护者回应和修复 diff，不以 closed、星数或宣传视频代替修复证据。

## 七、后续验证条件

**[研究] 优先验证**：同一 Unity 组件／小状态机切片做第 2.9 节蓄力中断＋重开。退出组合难维护才比 HFSM，测得 CPU 批处理瓶颈才比 ECS；按下列跨模块验收收口，不同时比较十个框架。

验收合并为三个跨模块问题：[研究]
- 正常、取消、死亡、卸载、池回收都清理，实例互不污染；重开无重复技能／镜头／关卡／UI 事件，冷却／资源结算可追踪
- 旧档与内容 ID 保持，数据变更按约定时点生效
- 低帧率、暂停恢复及目标平台帧时间／内存预算下物理／动画／镜头正确，并由人判断手感、可读性与趣味；无报错不等于质量通过

**剩余理论缺口**：Unity Behavior 固定包源码及版本升级回归、GAS 目标引擎版本源码快照、具体 Lyra 文件许可链、商业插件 SKU／Agent 使用与源码维护权利；需要新环境／付费／运行引擎者列入后续验证条件，当前不因此停掉其他研究。

**[研究] 验证范围**：源码与修改链已读，目标设备与第二次修改尚待实测；[专题正文](../../domains/game-dev/05-gameplay-architecture.md)和本记录的仓库检查不能代替引擎验收。

### 文档交付检查

[研究] 历史交付：依赖无缺失；`check_repo.py`、完整离线 14 阶段及 `git diff --check` 通过，五组测试 97／26／10／13／14 项、非空无 skip；UTF-8／空白检查通过。后续整合又核 59 处标题引用并补 ECB 计时反证，内部抽查无阻塞；当时未取得云端评审。上述不代表最新共享树或 hosted CI。

## 阶段 F 商业资格与版本补核

核实日 2026-10-14；建议 2026-11-14 或选包、购买、融资条件变化时复核。Lyra 的当前渠道标签及未闭合文件许可继承 [WP10 动态表](2026-10-14-game-wp10-client-modules.md#阶段-f-动态状态补核)，不重复声明完整清权。[研究]

| 动态事实 | 本次核实与一手来源 | 对采用的影响 |
|---|---|---|
| Opsive 价格、席位与资格不一致 | [购买页](https://opsive.com/assets/behavior-designer-pro/)显示 Personal $145/seat 一次性、Professional $399/year，并写合计收入＋融资 ≥US$200k；[2026-10-02 EULA §2.3、3.1](https://opsive.com/solutions/decision-solution/behavior-designer-pro/eula/)却分别要求直接操作功能者 Professional，以及过去12个月收入 >US$200k 或融资 >US$200k 时持续订阅 | 套餐名称、合计／分别计算与等号边界不能自行调和；采购前取得具体 SKU／席位资格书面确认，不默认单人支付 $145 足够。仅列商业对照，不升级默认 |
| Opsive 源码持续维护权 | 同一 EULA §4.1 允许订阅到期／终止后只继续使用最后取得版本的对象码，须停止使用并删除源码 | 未来修改成本包含持续许可；不把对象码留用解释为永久源码维护权。未取得账户合同或 Agent 使用许可 |

[一手] 另重读 Unity Behavior [1.0 changelog](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/changelog/CHANGELOG.html)，当前指定文档仍为 1.0.16（2026-05-26）；[LICENSE](https://docs.unity3d.com/Packages/com.unity.behavior@1.0/license/LICENSE.html)仍指 Unity Terms of Service。这证明指定文档内容，不证明全渠道最新版或具体账户安装权限；继续按实际包／计划核，不改为 UCL／MIT。

## [镜头质量补研：从跟得上到看得懂、控得住](wp11-camera.md#s9-1)

### [1. 不把“顺滑”压成一个阻尼数](wp11-camera.md#s9-2)

### [2. 三种玩法的不同默认，不共享一套“最佳参数”](wp11-camera.md#s9-3)

<a id="3-两种真实开发证据借机制不复制整套负担"></a>

### [3. 真实开发证据：借机制，不复制整套负担](wp11-camera.md#s9-4)

### [4. 瞄准、切镜和舒适度属于玩法质量](wp11-camera.md#s9-5)

### [5. 后续体验验收与维护成本](wp11-camera.md#s9-6)

## [战斗质量补研：动作节奏与遭遇可读性一起设计](wp11-combat.md#s10-1)

### [1. 三种生产经验改变哪些建议](wp11-combat.md#s10-2)

### [2. 慢、快与取消各自服务什么](wp11-combat.md#s10-3)

### [3. 原生编排足够，重点是编辑后仍对得上](wp11-combat.md#s10-4)

### [4. 新武器／新敌人后保住什么](wp11-combat.md#s10-5)

## [Unreal 相机补研：同一遮挡问题的原生职责与新系统边界](wp11-camera.md#s11-1)

### [1. 默认采用什么，谁不能替谁做决定](wp11-camera.md#s11-2)

### [2. 越肩绕柱：改造射击与显示规则，不再造相机框架](wp11-camera.md#s11-3)

### [3. 固定俯视：借原生 masked 开口，不复制 Unity 材质实现](wp11-camera.md#s11-4)

### [4. 新系统何时值得替换基线](wp11-camera.md#s11-5)

## [跟随历史补研：瞬移、换目标与变帧率](wp11-camera.md#s12-1)

### [1. 复用历史管理入口，不让技能各自重写平滑](wp11-camera.md#s12-2)

### [2. 指数收敛不等于移动目标的跟随完全帧率无关](wp11-camera.md#s12-3)

### [3. 窄二改题与停止条件](wp11-camera.md#s12-4)

## [失败与重试补研：回到刚才的决策点](wp11-camera.md#s13-1)

### [1. 不把恢复正确当成重试体验合格](wp11-camera.md#s13-2)

### [2. 固定游戏实现：重建世界也可以是简洁起点](wp11-camera.md#s13-3)

### [3. 边界、成本与下一次修改](wp11-camera.md#s13-4)

### [4. 已获线索难回看：先补材料还是移动检查点](wp11-camera.md#s13-5)

## [Endless Sky：非平台游戏的动感镜头与默认值取舍](wp11-camera.md#s14-1)

## [命令预览补研：提示清楚还要规则一致](wp11-camera.md#s15-1)

### [1. Factorio：动作模式改变，预览也必须改变](wp11-camera.md#s15-2)

### [2. OpenTTD：同一处理器可试算，但不是任意结果保证](wp11-camera.md#s15-3)

### [3. 竞争选择：让复杂组合可尝试，不强迫 UI 解释一切](wp11-camera.md#s15-4)

### [4. 采用成本、二改与引擎边界](wp11-camera.md#s15-5)

## [区域命令补研：持续任务还是固定对象队列](wp11-camera.md#s16-1)

## [运行时叙事：开放表达、知识解锁与离线承诺](wp11-camera.md#s17-1)

### [1. 先比较玩法需要，而非台词是否无限](wp11-camera.md#s17-2)

### [2. Vaudeville：保留生成玩法，也撤回一部分供应方式](wp11-camera.md#s17-3)

### [3. 生成自由度不免除作者的进度与知识设计](wp11-camera.md#s17-4)

### [4. 撤回条件与证据缺口](wp11-camera.md#s17-5)

## [效果叠加补研：来源所有权不等于合并规则](wp11-combat.md#s18-1)

### [1. OpenRA：来源退出只撤自己的授予](wp11-combat.md#s18-2)

### [2. Shattered Pixel Dungeon：重复施加未必产生独立层](wp11-combat.md#s18-3)

### [3. Unity 与 UE 的采用边界](wp11-combat.md#s18-4)

### [4. 窄二改题、许可与验证范围](wp11-combat.md#s18-5)

## [导航补研：通路、局部让路与停止位置](wp11-combat.md#s19-1)

### [1. 先过许可，再借真实游戏的局部机制](wp11-combat.md#s19-2)

### [2. 重寻路不能统一加速，也不能统一节流](wp11-combat.md#s19-3)

### [3. 原生能力的具体采用边界](wp11-combat.md#s19-4)

### [4. 后续只预注册一个二改遭遇](wp11-combat.md#s19-5)

### [5. 制作接入：离线制品、群体消费者与几何二改](wp11-combat.md#navigation-production-evidence)

## [关卡组合补研：连通之后还要选择什么](wp11-camera.md#s20-1)

### [1. 两类游戏，借不同的小机制](wp11-camera.md#s20-2)

### [2. 固定开源调用链：规则确实被消费，但不推荐整套接入](wp11-camera.md#s20-3)

### [3. 单人采用与二改预注册](wp11-camera.md#s20-4)

## 局外解锁：构筑能力与控制池分开安排

核实：2026-10-25（UTC）。P105，主线一／三。新增的是解锁次序、随机池与跨局结算链的选择，不重做存档身份或[重复成长成本](2026-10-14-game-wp12-indie-roadmap.md#构筑补研选择清楚之后还要付多少换法成本)；原关卡成长时机、存档与通用二改契约继续适用。本轮补固定开源调用链，仍属研究判断，未实玩。[研究]

**👀 默认先分四件事，再排解锁节奏。** 槽位／工具让玩家能够组织哪些选择；扩池增加未来可能遇见的内容；控制池允许排除部分内容；永久数值提高同样操作下的能力。需要尽早展示组合时可前置部分能力，重视随机适应时保留池宽；长期变强本身是目标则可保永久数值。不是要求所有新档立即获得全部构筑。[研究]

### 同一作品既前置能力，也限制控制池

**Windblown，官方版本差异 [一手]。** [0.5](https://windblown.game/Patchnotes/0.5)在解密足够 Memories 后开放 Memory Deck：只有选入内容进入个人掉落，联机共享掉落取决于所有人的 Deck。[0.10](https://windblown.game/Patchnotes/0.10)将 Start Source／Gift Slots II 改为默认可用，作者目标是让开局构筑更有趣；该版本从2026-06-10 Beta走到06-22无Beta标记的0.10.0.10。作者目标不是已测收益。

[2026-10-22的0.99记录](https://windblown.game/Patchnotes)反而把 Deck 后移解锁、最低池从80提到110，并声明旧 Deck 需修改；页面列0.99.0及0.99.0.1，未标Beta。这是已公告规则，不据此推断玩家接受度或作者未写出的调参原因；数量不是通用门槛。[一手／研究]

**维护代价 [研究]。** 放宽前期选择和限制后期缩池可以并存，不等于“全部提前”或“永久成长全删”。旧 Deck 失效已知，但旧玩家是否保留功能资格、未达新门槛如何恢复未核；该补丁关于保留已投入 Cogs 的稀有度迁移条款不能套到 Deck。当前页会更新，采用时复核版本。

### 扩池为何可能被玩家当成惩罚

[Steam原帖，2024-11-18至19](https://steamcommunity.com/app/1911610/discussions/0/6330467073266842911/)中，Haven明确因目标组合更难出现而暂停解锁；Chadwick（#1／#5）则重视临场适应与换武器。TLATER（#10）指出更窄的冲突：早期赐福随武器倾向，后期换高等级武器却可能拆散协同。它提示应查奖励之间的依赖，不只缩池。[社区／研究]

中文[TapTap星回二十二，2025-05-04](https://www.taptap.cn/review/44863185)认可设施成长、新解锁物品可立即带入下一局，又认为后期继续扩池有负面体验，希望能禁用内容。两处均是 Memory Deck 上线前的个人体验，不是0.99回执，也不证明最小池方案已解决问题。[社区]

**永久数值的相反选择 [一手]。** Rogue Command [2025-09-26官方公告正文](https://store.steampowered.com/news/posts/?enddate=1758878370&feed=steam_community_announcements)（[该游戏原帖](https://steamcommunity.com/games/1461910/announcements/detail/519725729918746752)）宣布 Battle Archive 向所有玩家开放：从仅扩池转为可撤点的永久升级，并同时提高基础难度。作者认为更有动力，也承认自身视角偏差、仍需反馈。[研究] 这反驳统一删除永久成长，但同步改难度不能证明升级树独立改善体验。聚合正文混有其他游戏，仅取 Rogue Command 段；原帖本轮未返回完整正文。

### 固定开源调用链：从结算到下一局配置

对应 [05 局外成长](../../domains/game-dev/05-gameplay-architecture.md#meta-progression-loop)；本段只补固定源码，不重写上面的作品对照。[研究]

**Shattered Worlds，MIT，固定 `384227e`（2026-10-07）。** TypeScript 牌组构筑 roguelite；跨局链能在固定源码里逐段追到，不是只看接口：

| 段 | 固定源码 | 源码里能追到的行为 |
|---|---|---|
| 初始化 | [main.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/game/main.ts) | 生产入口初始化 profile／runStats，再把运行时交给下一局入口；这条链不是只在测试里拼出来。[一手] |
| 定义 | [data/feats/types.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/data/feats/types.ts)、[data/unlocks/types.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/data/unlocks/types.ts) | `FeatDefinition`＝条件＋奖励（内存碎片／解锁）；`UnlockDefinition` 区分 `startingStat`、`handSizeBonus`、`minResourcePerTurn`、`rarityBonus`、`keywordDamageBonus`、`playerCardModifier`、`starterDeckOverride`、`worldUnlock`、`actReward`。[一手] |
| 结算 | [runStats.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/game/runtime/runStats.ts)、[featEvaluator.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/game/runtime/featEvaluator.ts)、[RunSummaryView.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/game/view/RunSummaryView.ts) | `RunEnded` 把本局写进 `runStats`；`featEvaluator` 订阅后跳过 `abandoned`，对 `RunRecord`／lifetime／witness 求值；每个 feat 只追加一次；摘要显示结果、局内事实与获得的碎片。[一手] |
| 持久进度 | [featsProfile.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/game/runtime/featsProfile.ts)、[unlocksProfile.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/game/runtime/unlocksProfile.ts) | 带 `version` 的 profile；feat 按 ID 去重；`purchased`／`activated` 分开；`activated` 必须是 `purchased` 子集；读取失败或形状不符回空档。[一手] |
| 购买／启用 | [data/unlocks/catalog.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/data/unlocks/catalog.ts) | 可花余额＝已赚碎片减已购成本（派生，不存可变余额）；预算限制启用集合；starter deck 只允许一个。[一手] |
| 下一局配置 | [gameplayRuntime.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/game/runtime/gameplayRuntime.ts) | `startSession` 读 `activated`，`resolveStarterDeckId`＋`buildRunModifiers` 后创建本局；本局拿的是计算后的配置，该入口没有回写 meta。[一手] |

表中 `UnlockDefinition` 的 9 个变体是代码层效果粒度；本页四类奖励是按“到账／候选池／槽位／永久数值”的业务分类，不能用变体数反推四类判错或漏项。设计文档 [destiny-progression.md](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/.lore/reference/progression/destiny-and-unlocks/destiny-progression.md) 讨论选项、知识、故事与 power 等持久内容，但把 power 的具体答案留空；不能把“power”当成已实现的永久数值效果。[unlock-system-runtime-ownership.md](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/.lore/reference/progression/destiny-and-unlocks/unlock-system-runtime-ownership.md) 记录“购买＋逐局启用”与“总是生效”“按世界门禁”的取舍。两者是作者设计意图，不是玩家验证，也不是现实现数值效果。

**支持范围与代价。** MIT 代码（素材另有许可，本轮未逐项核）；2026-06 创建，2026-10-25 为 1 star／0 fork、38 条解锁定义、有测试文件，属于外部采用很少的个人项目。feats／unlocks 两个 profile 的 `localStorage` 持久层目前只见版本 1 校验，没有跨版本迁移代码；项目整体并非完全没有迁移：[runStats.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/game/runtime/runStats.ts) 有 v1→v2、[userSettings.ts](https://github.com/rjroy/shattered-worlds/blob/384227efe8afcb44be0582399f16ffe6d6030934/src/game/runtime/userSettings.ts) 有 v1／v2→v3。因此只能说这两个 profile 的迁移未核，不能概括为“v1 localStorage 无迁移”。适合借“定义／结算／持久／配置”分离和四类业务奖励的拆分，不适合直接当生产底座。维护时要带 schema 版本、测试和未知 ID 处理，不能把整款游戏搬进项目。[一手／研究]

**KeeperRL，GPL-2.0 代码，固定 `95d2be4`。** 2013 年创建、2026-10-25 为 1009 stars；`data_free` 为 CC BY-SA，`data` 只随官方二进制分发。它把同一条链压得很小：

| 段 | 固定源码 | 源码里能追到的行为 |
|---|---|---|
| 定义 | [keeper_creatures.txt](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/data_free/game_config/keeper_creatures.txt)、[achievements.txt](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/data_free/game_config/achievements.txt) | 内容块写 `unlock = "goblins"` 等可选门禁；成就 ID 与名称在配置里声明。[一手] |
| 持久进度 | [unlocks.cpp](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/unlocks.cpp) | `Unlocks` 是一个压缩文件里的字符串集合；`isUnlocked` 读取，`unlock` 写入；`achieve` 只是加 `ACH_` 前缀。[一手] |
| 授予 | [game.cpp](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/game.cpp)、[effect.cpp](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/effect.cpp) | `considerAchievement` 在征服敌人、击杀、击晕和 `RetiredGame` 时授予；`Effects::Unlock` 可直接写解锁。授予点分布在对局事件，不是统一结算页。[一手] |
| 下一局配置 | [avatar_info.cpp](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/avatar_info.cpp)、[creature_predicate.cpp](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/creature_predicate.cpp) | 开局选择按 `KeeperCreatureInfo.unlock` 过滤；内容谓词 `Unlocked` 读同一集合。[一手] |

它证明成熟项目可以把“定义门禁＋持久集合＋开局消费”保持在几十行，并让所有入口读同一集合；不证明失败／通关结算总结、货币收益或四类奖励的体验。维护代价是 C++／SDL 代码库要跟引擎、存档路径和 UI 一起接；GPL-2.0 代码与 CC BY-SA／受限 `data` 分开，不能把内容直接搬进闭源项目。[一手／研究]

**Survivors Roguelike Kit，MIT，固定 `3f9053`。** Unity 6／DOTween 完整模板（2026-10-25 为 44 stars／17 forks；DOTween 自带许可另核）。[PowerUpAttributeUpgrade.cs](https://github.com/Roo-Roo-Roo/survivors-roguelike-kit/blob/3f905381d73a34b516030528b8ef6743868b9e52/Assets/RGame/RoguelikeKit/Scripts/UI/MainMenu/PowerUp/PowerUpAttributeUpgrade.cs) 用金币购买永久属性，修改属性运行时 SO 与 `AttributeSO` 后触发保存；[SaveGame.cs](https://github.com/Roo-Roo-Roo/survivors-roguelike-kit/blob/3f905381d73a34b516030528b8ef6743868b9e52/Assets/RGame/RoguelikeKit/Scripts/System/Save/SaveGame.cs) 用 `JsonUtility` 序列化属性与金币；[CharacterSaveSO.cs](https://github.com/Roo-Roo-Roo/survivors-roguelike-kit/blob/3f905381d73a34b516030528b8ef6743868b9e52/Assets/RGame/RoguelikeKit/Scripts/System/Save/CharacterSaveSO.cs) 用两个布尔量解锁角色。本轮在该模板里只追到“永久数值＋角色开关＋保存”，没有结算总结、解锁目录或候选池接线；适合看 SO／JSON 存档接缝，不能当完整局外成长底座。[一手／研究]

**可反驳条件。** 先分五对象（定义、持久进度、本局状态、结算结果、下一局配置），再排四类奖励；结算按 `runId` 一次，下一局配置只算一次，启用集合受拥有集合约束，余额由账本派生。判断新增解锁是增加选择还是稀释供给，看老路线首个核心工具时点、首次补强前合法候选数和无效候选数；老路线仍能成型才算选择。老路线变晚且无补偿、无效候选增加、玩家无法解释或总是跳过新项，就后移／缩小／撤下，不靠提高权重掩盖。[研究]

**仍缺。** 没有成熟的全量同题开源底座：Shattered Worlds 完整但外部采用很少，KeeperRL 成熟但不是同一局内结算链，Survivors Kit 只覆盖永久数值和存档；Unity／UE 的完整接入、真实玩家验证、留存与平衡数据都未取得。[研究]

### AI 二改交付与玩家验收，不混成一个通过

0.99还记录已修复赐福条件只检查首名玩家、重抽未检查条件的问题；这是资格检查的历史反例，不是 Deck 过滤故障。[一手] 因而二改须覆盖自身承诺的各玩家与重抽入口。[研究]

沿原状态所有者与存档契约，只改一项槽位／工具的开放时机，再加入一个可选内容：交付解锁配置、候选池规则与回归用例；固定奖励条件比较新旧进度，核已承诺的商店／箱子等入口是否共同遵守解锁与禁选规则。项目本来支持共享掉落才核多人的池合成，不为测试新增多人；改最低池时须说明旧配置不可用后的处理，不能静默清空已获内容。[研究；未实施]

玩家验证分新手与熟手的新档，观察何时能解释并主动使用组合、是否为效率拒绝新解锁、是否仍为拿到工具重复刷取。数值成长、基础难度和奖励分布尽量分开改，避免把变强误读为学会；若前置导致选择过载，或缩池只剩固定最优套路，就退回部分开放／调整供给，而非继续加解锁项。[研究；未验证]

**边界。** 只读公开补丁、社区原文和固定开源源码；源码经 GitHub Contents API 读取固定提交，未运行 tests／build，也未运行游戏、引擎或玩家实验，未把作者设计意图当玩家收益。新增源码只证明调用链与职责分离存在：Shattered Worlds 完整但外部采用很少，KeeperRL 成熟但不是同一局内结算链，Survivors Kit 只覆盖永久数值与存档；Unity／UE 完整接入、真实玩家验证、留存与平衡数据仍未取得。以上支持条件取舍，不证明AI净收益、留存改善或当前最高水平；完整效果仍未知。[研究]

## [受限动作补研：开放意图不等于更强战斗 AI](wp11-combat.md#s21-1)

### [1. 三个作者体系分别支持什么](wp11-combat.md#s21-2)

### [2. 固定调用链：required 与兼容回退为什么还不够](wp11-combat.md#s21-3)

### [3. 后续窄对照与撤回，不在本轮运行](wp11-combat.md#s21-4)

## [学习迁移补研：按提示完成之后会不会主动使用](wp11-camera.md#s22-1)

### [1. 两条竞争路线：帮助时机与自主选择](wp11-camera.md#s22-2)

### [2. 固定实现：触发与已读不代表掌握](wp11-camera.md#s22-3)

### [3. 反例：少指导与完成率都不能单独作为目标](wp11-camera.md#s22-4)

### [4. 窄二改预注册与撤回条件](wp11-camera.md#s22-5)

## [辅助取舍补研：局部调整、整局预设与切回规则](wp11-camera.md#s23-1)

### [竞争选择与一手反例](wp11-camera.md#s23-2)

### [最小采用与撤回边界](wp11-camera.md#s23-3)

### [第二次修改：只预注册，不运行](wp11-camera.md#s23-4)

## [屏外威胁补研：补信息还是改攻击](wp11-combat.md#s24-1)

### [三种选择及代价](wp11-combat.md#s24-2)

### [固定实现反例：不显示演出，不等于不结算](wp11-combat.md#s24-3)

### [最小采用与下一次内容修改](wp11-combat.md#s24-4)

## [建造镜头补研：旋转缩放支点与输入入口](wp11-camera.md#s25-1)

### [1. Tiny Glade：按设备改变支点政策，不是修正坐标计算](wp11-camera.md#s25-2)

### [2. OpenRCT2：同一支点契约下删除多余拾取，按钮另修](wp11-camera.md#s25-3)

### [3. 最小采用与二改验收](wp11-camera.md#s25-4)

## 随机所有权补研：装饰二改是否改变玩法序列

核实：2026-10-16（UTC+8）；主线三，GC。[研究] 05 §6补合法表现随机的消费域：需复现玩法时按所有者隔离，区别于预览禁副作用及seed／生成器版本存档。

### 1. OpenRA：视口相关闪光的评审修正

[一手：评审／合并源码] [PR #18711](https://github.com/OpenRA/OpenRA/pull/18711)新增宝石闪光；[具体评审](https://github.com/OpenRA/OpenRA/pull/18711#discussion_r711581362)指出按客户端`Viewport.AllVisibleCells`抽 SharedRandom 会多人失同步，要求 LocalRandom，[作者回复](https://github.com/OpenRA/OpenRA/pull/18711#discussion_r711729049)确认修改。属评审纠正风险，非发行故障统计。

[一手] 2021-10-02 合并`a13d04630469fcb994bbbc25e644b4e6b471017c`：[WithResourceAnimation L62–103](https://github.com/OpenRA/OpenRA/blob/a13d04630469fcb994bbbc25e644b4e6b471017c/OpenRA.Mods.Cnc/Traits/World/WithResourceAnimation.cs#L62-L103)的间隔、可见格洗牌、比例、动画选择用 LocalRandom；[Util L201–209](https://github.com/OpenRA/OpenRA/blob/a13d04630469fcb994bbbc25e644b4e6b471017c/OpenRA.Mods.Common/Util.cs#L201-L209)的范围采样改为显式接收生成器，不固定取 SharedRandom。[研究] 借调用者传所拥有的流，不移植整套 RTS 架构；按是否影响权威状态／调用时机划域，不能把全部声音动画都改局部随机。

### 2. BrogueCE：单人显示与玩法也有不同消费域

[一手] BrogueCE 主干`104a20fedbe7d9360d2dfc8ff665571694212ad8`（2026-09-27，非已核发行包）：[Rogue.h L401–405](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/Rogue.h#L401-L405)分 substantive／cosmetic；[Math.c L90–133](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/Math.c#L90-L133)存两状态、按域采样；[IO.c L1768–1805](https://github.com/tmewett/BrogueCE/blob/104a20fedbe7d9360d2dfc8ff665571694212ad8/src/brogue/IO.c#L1768-L1805)颜色随机前选 cosmetic、完成后恢复。[研究] 单人 roguelike 也可隔离，仅读该链不能证明全路径，也不推荐照搬可变全局选择器。

### 3. 复用原生能力，别把重置当续接

- [一手] [Unity 6.0 Random](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Random.html)明确 UnityEngine.Random 是全局共享的静态状态，需要独立生成器时可管理 System.Random 实例。[研究] 小项目可由玩法与表现模块分别持有已有实例并传入采样函数，不要求新增库或每个实体单独播种。
- [一手] [Unity 6.0 Random.state](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Random-state.html)区分保存／恢复完整状态和 InitState 重新初始化；官方示例中前者续接保存点，后者回到序列开头。[研究] 这不使全局 Random 自动成为多条流；不要在每次表现回调里重设全局 seed 来“隔离”。
- [一手] [UE 5.8 Random Streams](https://dev.epicgames.com/documentation/en-us/unreal-engine/random-streams-in-unreal-engine)提供 Blueprint RandomStream 结构变量和 From Stream 节点；[FRandomStream](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Core/FRandomStream)分别列 InitialSeed、当前 Seed 与 Reset，Reset 回到初始 seed。[研究] 沿现有所有者保留流状态并选对输入，别每次抽取都重建／重置；这里不承诺任意序列化或跨版本兼容。

[研究] ✅ seed挑战、回放或可复查结果会受表现采样影响时，隔离玩法／纯表现流；无需求耦合则保简单实现。玩法域规则改动仍可改变序列；参与碰撞、命中、资源的视觉对象仍属玩法。

[研究] **二改预注册**：固定版本、初始状态、输入，仅改闪光／音效、视口或关闭表现；对照掉落伤害选敌，核表现未抽玩法流，中途恢复续接当前状态而非起点。只验证此配置随机隔离，不外推跨平台、物理、联网确定性。

**许可**：BrogueCE为AGPL-3.0-or-later，OpenRA为GPL-3.0-or-later；只核评审、固定文件和原生API，未执行隔离用例。

## [感知补研：角色知道什么与导演调度什么](wp11-combat.md#s27-1)

### [跨类型证据与反例](wp11-combat.md#s27-2)

### [原生入口：位置输入、感知状态与遗忘不是同一开关](wp11-combat.md#s27-3)

### [采用、撤回与二改预注册](wp11-combat.md#s27-4)

## [选敌补研：候选、保持与主动切换](wp11-combat.md#s28-1)

### [跨类型机制与反例](wp11-combat.md#s28-2)

### [最小采用、撤回与二改预注册](wp11-combat.md#s28-3)

## [意图预告补研：确定结果、条件变化与有意未知](wp11-combat.md#s29-1)

### [决策信息不等于完整行为表](wp11-combat.md#s29-2)

### [已发布修订：可以删显示，也可以改规则](wp11-combat.md#s29-3)

### [第二次修改：仅预注册，未执行](wp11-combat.md#s29-4)

## 物品补研：数量栈、单件状态与转移身份

核实：2026-10-16（UTC+8）；主线三，GC。[研究] 05 §4增耐久／强化先核可互换性及拆分转移，不全改实体。比较OpenMW与Minetest Game／Luanti，后两者算同一生态；快照非稳定发行。

**OpenMW：保留状态不等于复制身份。** [一手] 固定 `9ec458174fa5a459b7910cd6990c1acc830b0b8a` 的实际消费者如下：

- [ActionTake](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/actiontake.cpp#L20-L40)的非拖放拾取路径加入容器、删除地面对象，并采用返回目标；[ItemModel.moveItem](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwgui/itemmodel.cpp#L58-L65)区分整堆转移与部分复制。未合并的整堆可沿用身份；合并返回目标栈，不能要求所有旧引用仍指向存活物品
- [ContainerStore.unstack／restack／stacks](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/containerstore.cpp#L315-L400)拆分时保留原栈指定数量，为余量另发 RefNum；合并时原项归零并返回存活栈。同定义只是必要条件：还核灵魂、剩余使用时间与传统物品脚本；有耐久者须都满耐久，有附魔充能者须都满充能。[研究] 因此两个都剩50%耐久也不能合并，是该项目政策，不是通用相等规则
- [装备入口](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/inventorystore.cpp#L162-L195)按类别拆一件，[弹药与投掷物](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwclass/weapon.cpp#L84-L105)允许装备时保持栈，不能写成所有装备都拆。普通装备在装备期间另受[合并限制](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/inventorystore.cpp#L547-L565)；[修理](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwmechanics/repair.cpp#L59-L70)恢复后尝试重合并。[灵魂捕获](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwmechanics/actors.cpp#L209-L214)实际采用拆一件、写灵魂、按同灵魂重合并，也反证新增状态不必永久禁堆叠

[一手] [2023拆堆另发身份](https://github.com/OpenMW/openmw/commit/0f608f388ef84db438eda67c06409dcd58056a1e)后，[2024-05-28修复](https://github.com/OpenMW/openmw/commit/ae4bf04798b3ad25a8490d448f8d53b06347e567)仍修跨容器拆堆丢灵魂：从仅按定义 RefId 重造改为复制实例模板。当前[InventoryItemModel.copyItem](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwgui/inventoryitemmodel.cpp#L50-L65)及[ManualRef](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/apps/openmw/mwworld/manualref.cpp#L101-L109)保实例数据后清 RefNum／Lua 脚本。[研究] 状态保留与身份不重复分别核；清脚本仅此项目政策。GitLab 问题 6148／MR2995 正文未取得，无原报告者复测证据。

**Minetest Game／Luanti：值式单件状态。** [一手] 游戏`c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f`的[farming实际消费者](https://github.com/luanti-org/minetest_game/blob/c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f/mods/farming/api.lua#L59-L104)注册锄头为 tool、使用后改 wear 并返回 ItemStack。引擎`0e1414682e4be3ffb84d067d0621e98d6bf5cd76`的[ItemStack字段](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.h#L146-L154)含 name／count／wear／metadata，没有内置逐件 ID；[tool构造](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L30-L40)和[默认stack_max](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L721-L738)均限 1。[拾取](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L383-L399)返回未收入余量，[地面实体](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item_entity.lua#L325-L348)据此更新／删除；[拆分](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L484-L501)复制状态再分数量，[跨槽／列表转移](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L826-L891)把余量退来源；[持用工具](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item.lua#L515-L538)读取、损耗、写回当前 ItemStack，不沿地面实体身份。

[一手／研究] **合并路径有差异：** [stacksWith](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/inventory.cpp#L401-L481)比较 name／wear／metadata，同文件 addItem／itemFits 却只比 name／metadata，[掉落物合并](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/builtin/game/item_entity.lua#L103-L138)才另比 wear。耐久工具靠单件限制，不能推广为任意堆叠耐久装备。[6057原报告](https://github.com/luanti-org/luanti/issues/6057)报告空元数据使表面相同物品不合并，[85d7b18修复](https://github.com/luanti-org/luanti/commit/85d7b18d851504e6d9f637c4373cf896b1ce8e4c)避免无内容空键值。[已有单测](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/src/unittest/test_inventory.cpp#L39-L83)核 tool count=1 且保 wear；仅读未运行，非全路径验收。

[研究] **二改预注册**：先复用支持每件／栈状态、数量／合并限制、余量／存活目标返回的背包。三把同型剑只改一把，转移拾回合并，核数量、状态及允许回堆后的旧引用。跨位置持续引用“这一件”才加身份，无法表达区别才局部扩展；AI追消费者，人定可互换政策。

**边界 [一手／研究]**：[OpenMW README](https://github.com/OpenMW/openmw/blob/9ec458174fa5a459b7910cd6990c1acc830b0b8a/README.md#L4-L9)标GPLv3，运行Morrowind须自有游戏；[Luanti引擎](https://github.com/luanti-org/luanti/blob/0e1414682e4be3ffb84d067d0621e98d6bf5cd76/LICENSE.txt#L114-L132)为LGPL-2.1-or-later，[farming模块](https://github.com/luanti-org/minetest_game/blob/c42e4d0c0ff9d27ff7b9b308c3cfc14098dd3a0f/mods/farming/license.txt)源码单独MIT、媒体另有许可，不能以根许可代组件核查。未验上游用例／引擎集成，不作闭源即插底座。

## [任务推进补研：历史事实与当前条件](wp11-camera.md#s31-1)

## [效果时钟补研：调度时间、行动次数与到期显示](wp11-combat.md#s32-1)

### [回合玩法：调度时间不等于输入次数](wp11-combat.md#s32-2)

### [即时玩法：模拟秒、菜单与恢复各有边界](wp11-combat.md#s32-3)

### [显示修订与二改预注册](wp11-combat.md#s32-4)

## [效果读取时点：持续代价与一次承诺](wp11-combat.md#s33-1)

## [属性修饰补研：计算顺序与重算](wp11-combat.md#s34-1)

## 事件连锁补研：排队不代替防重入与操作边界

核实：2026-10-16（UTC+8）。主线三／GC；改变05§6的同步／排队选择：来源、防重入资格和完整操作边界分别决定，不因“解耦”统一延迟。新证据复用已完成的固定源码调查，再对照当前章节缺口；不是新增效果框架或游戏实测。[研究]

**DCSS：资格与延后边界。** [一手] 固定`2952e12c52c2a66210f6c5488db987d0962a67ca`的[反伤执行](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/fineff.cc#L1081-L1107)允许原防御者已经死亡、重新检查承受反伤者仍活着；[伤害入口](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/monster.cc#L4393-L4402)排除派生反伤再次镜像。[2014修复](https://github.com/crawl/crawl/commit/4f3d0c6879f2baefcf3eb2749133ae3340dcbdca)修来回反弹；[2024修复](https://github.com/crawl/crawl/commit/f4a7df68b9800669d3a70ac8d7dc9cc4f2eeb94b)将血箭冷却前置以防止反射重新触发齐射，同时另修 beam 复用，不能把全部崩溃归重入。

[一手／研究] [2020修复](https://github.com/crawl/crawl/commit/3dd439832fe0f5fe295caad1a2fe3e479a757cda)延后死亡爆炸，避免多目标攻击未完就杀攻击者；[2021修复](https://github.com/crawl/crawl/commit/4e304d196c1d5a90fd7939a3cf94c2339bed27f0)撤每束 beam 后处理，因多束法术未整体结束。[现行消费者](https://github.com/crawl/crawl/blob/2952e12c52c2a66210f6c5488db987d0962a67ca/crawl-ref/source/fineff.cc#L2133-L2147)从 vector 尾取再执行，为 LIFO 且继续处理新加入的效果，不是 FIFO；排队本身不中断循环。

**直接处理也可成立。** [一手／研究] SPD v4.0.2 `57a4e06`的[LifeLink](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L830-L864)用派生来源免再次分摊，[Skeleton](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/mobs/Skeleton.java#L70-L141)直接做死亡邻格伤害。[攻击链](https://github.com/00-Evan/shattered-pixel-dungeon/blob/57a4e06a4caf162446d1c28caa7983f0493fecf0/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/Char.java#L483-L512)的 attackProc 在普通 damage 之前，是规则钩子、非 HP 提交事实；正文 DamageApplied 仍在提交后。

OpenRA固定e180e3225f3930272dd451917467631618f8976f中，[桶伤害](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ra/weapons/explosions.yaml#L144-L182)有Delay=5，[ATMine](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/mods/ra/weapons/explosions.yaml#L193-L209)不设Delay且排除Mine；[消费者](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Game/GameRules/WeaponInfo.cs#L234-L265)分别直接执行或走延时，[DelayedImpact](https://github.com/OpenRA/OpenRA/blob/e180e3225f3930272dd451917467631618f8976f/OpenRA.Game/Effects/DelayedImpact.cs#L19-L40)单位为tick不是秒。[一手] 游戏规则的延迟与为保护操作完整性而延后是不同目的，不统一换成一种调度器。[研究]

**采用与预注册 [研究]**：会重入的动作登记资格／来源，但仍重核合法性，取消失败按原规则返还。加反射／爆炸后验重入、多目标未完时死亡、多个连锁与即时规则；必要时才延至完整操作边界。DCSS为GPL-2.0-or-later，SPD／OpenRA为GPL-3.0-or-later；仅选定链路，未证全路径。


## [组合取舍：先修辅助、规则还是动作出口](wp11-combat.md#s36-1)

## [镜头借出控制：持续更新历史与当前视点分开](wp11-camera.md#s37-1)

## 离线收益补研：等待、精度与结算边界

主线：三／四；GC，2026-10-17（UTC+8）核实。
改变建议：05 §2只为承诺离线收益的玩法比较分批逐步、粗步与聚合结算；普通暂停不据此补收益。
新证据：两款不同作者的增量游戏固定源码，以及AD休眠路径、KG离线漏产修订；不能推广为所有游戏要求。[一手／研究]

**步数减少会改变自动化。** Antimatter Dimensions [固定说明](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L126-L176)解释：1000步补1小时，每步3.6秒，自动购买每步仅触发一次，影响随阶段变化。[实现](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/game.js#L895-L1055)按剩余时间／剩余步数分摊，异步分批，并允许减步加速。分批让出执行时间与减步牺牲精度是两种选择，不可混称无损提速。[一手／研究]

**聚合有另一套规则成本。** Kittens Game [资源路径](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/js/resources.js#L843-L870)以缓存速率乘时长，暂放容量限制供后续消费，再限回容量；[时间路径](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/js/time.js#L191-L312)批量推进各子系统，QUEUE_REDSHIFT分支按队列ETA分段／购买，但向整游戏年取整。它是有意聚合，非精确解析或在线等价证明。[一手]

**修订反证。** AD [changelog](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/changelog.js)记载2023-05-25将休眠的单大步改为离线模拟，07-18仍修真实时间资源漏发及未遵循离线设置。KG [1.4.8.1](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/changelog.txt#L207-L224)修Temporal Paradox期间离线漏产。补算接通不代表所有规则接通；历史修复不代表当前仍有故障。[一手／研究]

**✅ 条件选择 [研究]**：
- 购买、解锁、消费顺序重要：复用逐步规则，分批保响应；仍须测恢复等待，不能无限追赶。
- 容许收益误差：粗步设上限并说明精度代价；不同阶段核收益及自动化次数，误差破坏承诺就撤回。
- 稳定区间或另定离线规则：聚合结算；跨容量、耗尽、购买／解锁边界需分段重算或明确不同规则。边界过密、难维护时退回逐步，不先造通用解析器。

AD模拟时停普通循环，[普通存档门槛](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/storage/storage.js#L244-L273)拒绝进度模拟中的普通保存，备份有例外；这不证明崩溃幂等。[一手] 建议收益与已结算区间同存，恢复重入拒绝重复区间，负时差与上限另定政策。[研究]

**未运行验收**：同存档加“自动购买后解锁新产物”，比正常逐步与两种补算的收益、触发次数、恢复等待和最长阻塞；再验后台恢复、重复回调、结算前后崩溃／重载。不以算法存在宣称玩家体验、净性能或重复收益已解决。本轮只读公开实现与修订，不复制代码；复用另核许可。[研究]


## [群体攻击协调：资格、站位与冷却分开](wp11-combat.md#s39-1)

### [生产取舍：参战预算不等于攻击帧计数](wp11-combat.md#s39-2)

### [固定实现：共享额度的范围和退出比名字重要](wp11-combat.md#s39-3)

### [最小采用与第二次修改](wp11-combat.md#s39-4)

## [蓄力技能补研：按法识别、技能进度与释放](wp11-combat.md#s40-1)

## 回放用途：先分影子展示、输入复演与状态倒带

核实：2026-10-18（UTC+8）。GC，主线一／三／四。新增读者任务是最佳路线对照、回放诊断或倒带续玩，不把既有随机分流建议扩成确定性保证。选择依据是固定实现与开发者报告；未运行游戏、引擎、上游测试或模型。[研究]

### 先按需要保住的结果选择

| 任务 | 先比较什么 | 代价与撤回条件 |
|---|---|---|
| 并排路线影子、观看上次表现 | 带时间的姿态＋必要表现状态／事件，独立回放表现 | 不能据此重算真实碰撞／奖励；转弯、瞬移或事件缺项使画面误导时增加必要采样／标注，或缩小展示范围 |
| 查同一输入为何造成错误 | 已知初始状态与版本下重演输入／玩法命令，并检查状态分歧 | 输入文件小不等于实现便宜；时钟、数值、随机与外部结果不受控时不能承诺重现，保留失败现场的状态和日志另查 |
| 任意倒退后继续玩 | 足以恢复允许倒带部分的状态；比较状态历史与输入重演＋检查点 | 状态存储／迁移与重演成本分别计；稀疏姿态没有冷却、对象生命周期等必要状态时，不能直接用于续玩 |

这些是研究判断，不是三种完整框架的推荐名单。纯观看需求不必先重构全游戏为确定性模拟；反过来，画面吻合也不证明错误原因被复现。时间点、缺失字段、地图／规则版本及可执行的副作用要成为记录契约的一部分。[研究]

### SuperTuxKart：姿态之外还要记录想展示的含义

固定源码 [`2997f192e6876047909d909498dbb4810e5dbb8d`](https://github.com/supertuxkart/stk-code/tree/2997f192e6876047909d909498dbb4810e5dbb8d)：[recorder L134–301](https://github.com/supertuxkart/stk-code/blob/2997f192e6876047909d909498dbb4810e5dbb8d/src/replay/replay_recorder.cpp#L134-L301)记录时间、位置、视觉旋转及速度、转向、悬挂、滑行、道具和特效；重要状态改变时提前采样，临近终点提高精度。它不是只存 Transform，也不是把玩家输入重新送回原模拟。[一手：源码阅读]

[GhostKart L90–250](https://github.com/supertuxkart/stk-code/blob/2997f192e6876047909d909498dbb4810e5dbb8d/src/karts/ghost_kart.cpp#L90-L250)避开依赖物理的图形更新路径，插值位置并用 slerp 插值旋转。附件计时与护盾续期并不精确，源码明确把这些误差限定在图形用途；不能将这条简化路线用于权威碰撞或奖励重算。[一手／研究]

**二改反证最重要。** [旧版读取分支 L450–480](https://github.com/supertuxkart/stk-code/blob/2997f192e6876047909d909498dbb4810e5dbb8d/src/replay/replay_play.cpp#L450-L480)为格式3中未保存的滑行状态、nitro 数量、道具和距离等字段补零，但保留原已记录的部分特效。[研究] 这能支持降级播放，不能让新增数据分析把补零当“当年没有使用道具”。新功能依赖旧记录没有的字段时，应标未知／不可用，或只保留不依赖该字段的观看能力，不伪造历史。

[2018-11-17 开发者说明](https://blog.supertuxkart.net/2018/11/supertux-challenges-in-story-mode.html)以预录 ghost 展示路线、滑行和 nitro 使用，作为学习挑战的设计意图；没有给出学习收益测量。此处借的是任务与记录内容的对应关系，不照抄整套竞速架构。[一手／研究]

### Neverball：叫 command 不代表记录了玩家输入

固定 [`82883833043725b21a65fe45416524cb77412e39`](https://github.com/Neverball/neverball/tree/82883833043725b21a65fe45416524cb77412e39) 的 [game_server L210–240](https://github.com/Neverball/neverball/blob/82883833043725b21a65fe45416524cb77412e39/ball/game_server.c#L210-L240)产生球位置／方向和视图状态命令；[game_client L316–330](https://github.com/Neverball/neverball/blob/82883833043725b21a65fe45416524cb77412e39/ball/game_client.c#L316-L330)把它们写入记录后消费，[demo L374–394](https://github.com/Neverball/neverball/blob/82883833043725b21a65fe45416524cb77412e39/ball/demo.c#L374-L394)播放时读回给 client。这条路径记录的是模拟输出协议，不能仅凭“command replay”名称当输入复演模板。[一手／研究]

[地图 major version 检查](https://github.com/Neverball/neverball/blob/82883833043725b21a65fe45416524cb77412e39/ball/game_client.c#L296-L302)及[官方历史变更](https://neverball.org/changes)补上限制：1.5.1／1.5.3 的若干地图修改明确使回放失效，1.5.2 又补过初始视图数据。**记录输出也不自动摆脱场景与格式依赖。** 改图后显示旧轨迹可作历史参考，但不能悄悄当新地图的有效成绩或验证结果。[一手／研究]

### 输入复演与状态倒带，各自省掉什么、增加什么

- [ccleste 固定 README](https://github.com/lemon32767/ccleste/blob/261d96f15af430b8111abc7a5250229246654f52/README.md#tas-playback-and-the-fixed-point-question)给出逐帧输入 bitfield、起始加载帧与固定 seed；作者同时说明 float 与原 PICO-8 的 16.16 定点差异可能影响 TAS。为特定理想 RNG 记录提供的 balloon hack 会固定气球并扩大 hitbox。[研究] 所以“文件播完”必须附模拟配置，不能把改变玩法条件的兼容补丁算成忠实复现。这里只核移植作者文档，未编译／播放。[一手／研究]
- [Factorio FFF47，2014-08-15](https://www.factorio.com/blog/post/fff-47)描述历史调试模式逐 tick 比 CRC，再保存带可读标签的状态以定位第一次分歧。作者也报告这种密集检查很慢；它支持调试时比较状态，而非只看画面，不是当前性能数字或所有游戏每帧完整落盘的建议。[一手：作者报告；研究]
- Braid 作者 Jonathan Blow 的[原评论](https://news.ycombinator.com/item?id=9484297)说明主要记录世界状态，world5 的影子动作是事件记录例外；[后续解释](https://news.ycombinator.com/item?id=9484350)说状态历史以更多内存换较少 CPU。输入／事件倒带若要迅速跳转仍需邻近状态起点，因此可能同时维护两套机制。[研究] 这是该项目的历史取舍，不证明状态记录对所有项目更便宜；此处未取得对应源码或独立运行。

### 第二次修改的最小验收与许可边界

增加新道具显示、修改地图，再改变一项运动规则：分别检查旧格式能否解析、旧画面能否诚实显示、旧输入能否在声明的模拟条件下重现。缺字段显式降级；跳转／倒放经过事件时，表现播放不得重复触发真实奖励或提交命令；倒带续玩另验对象生命周期、冷却与继续执行。需要诊断原因时定位首次状态分歧，不能用外观接近当通过。[研究；验收未执行]

只提炼公开机制，不复制代码或游戏资产；STK／Neverball 的开源许可也不将全部素材或其他游戏代码一并授权。没有测试存储量、性能、跨平台确定性、玩家学习或二改工时。上述证据支持用途划分和维护风险，不支持“回放系统已经验证”或强制 Unity／UE 使用相同实现。[研究]


## [本地多人视图：独立活动与双方可读性先于自动合屏](wp11-camera.md#s42-1)

### [选择及撤回条件](wp11-camera.md#s42-2)

### [共享屏幕的真实收益与反证：Pixel Wheels](wp11-camera.md#s42-3)

### [独立活动的相反路线与二改：Larian](wp11-camera.md#s42-4)

### [二改验收与未覆盖部分](wp11-camera.md#s42-5)


<a id="p104-mod-blueprint-patches"></a>

## P104：AI 二改模组，别把局部补丁补成完整定义

**[研究] 默认：已有数据／编辑器够用就保局部补丁；新增素材、行为再分别进入资产、代码制作链。**
**[一手／研究] 反直觉：Timberborn 编辑器会补齐缺字段，修改型 Blueprint 反而要关闭其默认补齐行为；不是关闭所有校验。**
**[研究] 未试用：只读公开文档／工具样例，未运行游戏、引擎或模型；合并结果与 AI 二改收益未验证。** 核实：2026-10-23（UTC+8）。

### 先选制作链，不为一个配方造模组平台

| 要改什么 | 最小路线；升级成本 |
|---|---|
| 既有地图布局／数值／配方 | 原有编辑器或数据补丁；先查内容路径与叠加语义，不先引入脚本运行时 |
| 新模型／材质 | 沿现有资产导入与构建链；文本改对不等于素材可用 |
| 数据未暴露的新行为 | 窄代码扩展；计入游戏 API、构建与发布维护，不把任意代码加载称为安全沙箱 |

[官方 Modding 文档](https://github.com/mechanistry/timberborn-modding/wiki)区分不需 Unity 的数据修改与导入 DLL／资产、构建 AssetBundle 的工具链；[代码入口](https://github.com/mechanistry/timberborn-modding/wiki/Coding-basics)提供 C# DLL／`IModStarter`。这只证明该游戏开放的能力，不是给自己的 Unity 项目可直接安装的通用运行框架。[一手／研究] UE 仅作边界对照：[SML v3.11.3](https://docs.ficsit.app/satisfactory-modding/v3.11.3/Development/ModLoader/index.html)的 Blueprint mod 是 Unreal 插件资产／脚本，不是这里的 JSON 补丁；不据其版本页推荐当前安装组合。

### 决定性区别：补丁不是不完整的定义

[Blueprint Editor 官方说明（2025-10-29）](https://github.com/mechanistry/timberborn-modding/wiki/Blueprint-Editor)明确：编辑器自动补齐遗漏字段；制作 modifying Blueprint 时启用 `Disable Blueprint validation`。这不是本仓猜测，也不代表 JSON 语法、引用或运行时检查全部关闭。未取得编辑器验证器／运行合并器的公开实现，不能扩写内部效果。[一手／研究]

[Blueprints 官方规则（2025-12-10）](https://github.com/mechanistry/timberborn-modding/wiki/Blueprints)说明遗漏字段保留、数组默认替换，支持追加／删除；最高 priority **先**应用，`#remove` 要给完整对象。[一手] 两个待验推演：A 先向同一数组追加材料，B 后替换该数组，A 的追加可能消失；A 把材料数量 10 改为 20，B 仍删除数量 10 的完整对象，不能假定删除成功。这是合并契约推导，不是已复现故障。[研究]

### 当前版本、发布和反向参照

[官方发布流](https://store.steampowered.com/oldnews/?appgroupname=Timberborn&appids=1062090&feed=steam_community_announcements&headlines=0&l=english)记录 2026-09-03 的 1.1 与 10-20 主分支补丁；Wiki 也跟随 Experimental，不能把最新工具文档当稳定版实测。[一手] [Mod Builder](https://github.com/mechanistry/timberborn-modding/wiki/Mod-Builder)区分 Dev／Clean build；[发布说明](https://github.com/mechanistry/timberborn-modding/wiki/Mod-management)通过 `workshop_data.json` 保留 Workshop 条目，更新时可不覆盖手改描述。二改还要核发布包与条目身份，不止 JSON 差异。[一手／研究]

专业作者 [Luke 的无代码教程](https://datvm.github.io/TimberbornMods/ModdingGuide/getting-started)展示最小字段修改，但仍用 Update 7 的路径与能力边界；[TimberAPI 作者说明](https://github.com/Timberborn-Modding-Central/TimberAPI/blob/main/README.md)也指出不少旧功能已进入官方支持。两者提醒先核版本，不默认照旧教程装框架，也不把历史“JSON 能力有限”当 1.1 结论。[一手／研究] 社区覆盖仍不足：已检索 Reddit、indienova 与知乎；[Reddit 制作求助](https://www.reddit.com/r/Timberborn/comments/1s9r6qg/building_blueprint_documentationtimbermesh_error/)涉及数据与模型加载，却无已核解决结果，不能当补丁故障实测。中文未找到同题专业实作，专业作者资料也未提供该开关的独立复测。[研究]

**Agent 的具体交付：** 给既有配方增加材料，再要求修改其数量；交最小补丁、编辑器往返 diff、按声明加载顺序得到的预期结果及发布文件清单。只测承诺支持的模组组合／顺序；冲突可通过声明依赖、顺序或不兼容解决，不要求任意组合都成功。人再验游戏内实际内容与发布包；若数据没有目标能力才升级代码，不因补丁冲突立刻造平台。[研究；全部待执行]

<a id="p106-equipment-loss-supply"></a>

## P106：装备损毁与替代供给，要一起改

**[研究] 改变建议：想让玩家临场重建，才把装备当消耗；同时设计逃生、替代供给与保留构筑的相反路线。**
**[一手／社区] Cogmind 提供真实制作参照，也有接受重建和被构筑不稳定劝退的两种玩家反馈。**
**[研究] 最高水平未知；👀 仅机制评估，未运行游戏、引擎、模型或玩家对照。** 核实：2026-10-23（UTC+8）。

### 当代复盘与当前规则：消耗不只是扣一个数

[Kyzrati 2025-08-07 原文](https://www.gridsagegames.com/blog/2025/08/designing-for-mastery-in-roguelikes-w-roguelike-radio/)的 Comebacks／Agency／Consequences 将受击损耗、裸核逃生与环境零件重建连起来；特定缺件可用限量制造补足，洞穴则缺少常规替代供给。作者也承认长期保持构筑的玩家未必喜欢；这是近期复盘，不是2025才新增机制。作者所称玩家数据差异未独立核实，不据此声称设计有效。[一手／研究]

[官方手册 Beta 17.1](https://www.gridsagegames.com/cogmind/manual.txt)在 Explorer 列出按当前状态替换主设施出生点附近物品、洞穴残骸不自毁的辅助政策；Salvage 明确制造机造出的机器人不留可回收部件，紧接着说明未装配的库存物品总会掉落。不能宽化为完全无掉落。[一手] **二改补给时要核制造—回收循环**是研究推导，不是作者在此声明的设计意图。[研究]

### 现成相反路线及其维护成本

同一手册仍提供 RPGLIKE，降低部件损毁并允许治疗；不是本仓凭空提出一套永久装备模式。[一手] [2020-01-06 制作复盘](https://www.gridsagegames.com/blog/2020/01/special-mode-design-rpglike/)解释：完全不毁加休息恢复的初案需要重做挑战，工作量过大而放弃；转移部件伤害到核心后，又在 Beta 9.4 恢复护甲的保护作用。**旧历史对照**说明改损耗会改掉其他资源价值，不能将其包装成近期新技术或最优参数。[一手／研究]

**开源反向参照：修复不必回到全新。** CDDA 2026-10-22 实验版固定 `afe52ab` 的[非枪支修复路径](https://github.com/CleverRaven/Cataclysm-DDA/blob/afe52ab9847fdd229ad5bc6acdafa2631bcd5e04/src/iuse_actor.cpp#L3284-L3554)先核材料，成功时消耗并减损伤，失败可能进一步损坏甚至毁物；[损伤调整](https://github.com/CleverRaven/Cataclysm-DDA/blob/afe52ab9847fdd229ad5bc6acdafa2631bcd5e04/src/item_degrade.cpp#L856-L881)不会因负向修复量直接抹掉基础长期磨损。[一手：源码静读] 因而 AI 新增“修复”按钮时，要保材料供应、失败风险及长期磨损政策，不能顺手清零所有状态；此结论仅限所读路径，不推广为所有故障不可修，也不建议把整套 CDDA 移植到 Unity。[研究；未运行]

### 玩家为何意见相反

| 已读原帖与发言者 | 支持的窄结论 |
|---|---|
| [r/Cogmind，Rushional](https://www.reddit.com/r/Cogmind/comments/1r03nwk/i_think_im_officially_too_stupid_for_cogmind/)自述约90小时，损失快于合适零件补充 | 即使认可QoL，也可能因构筑不稳定而焦虑；不能只叫玩家接受损毁 |
| [r/roguelikes，jglazer75／Ok-Pepper-1447](https://www.reddit.com/r/roguelikes/comments/1hrsuip/im_considering_getting_cogmind_but_one_negative/)分别自述转为动态构筑后更有趣、被打散后逃脱重建 | 有玩家喜欢转换和恢复，但“总能重建”只是其体验，不是供给保证 |
| [r/Cogmind，uniqiq](https://www.reddit.com/r/Cogmind/comments/1s1vm8p/the_cogmind_is_the_most_frustrating_game_ive_ever/)认可可毁装备，后续承认已有进步，但对扩展胜利目标下的失败仍感挫败 | 不满也可能来自学习／反馈，不能全归为讨厌损毁 |

以上是不同玩家的自述，未取得同构建、同难度的受控比较；评论精确日期未统一核实，不据时长、票数或商店好评率量化效果。[社区／研究]

**AI 二改交付（待验）**：沿现有组件／数据与伤害、掉落接口，只改一种关键件的损毁政策，再改一处替代来源；记录损失后仍可做的动作、可达补给及其代价。比较正常补给与缺件路线、制造后回收、辅助模式开关；若承诺稳定构筑，则反查治疗是否让护甲无用。沿05通用契约验一次结算／重开，人试玩核重建意愿；库存身份与堆栈沿既有段，不为此另造经济框架。[研究]

**探索回执**：截至2026-10-23，读作者博客、当前手册、Reddit正反；中文Steam搜到2025个人手册翻译，但它不是独立体验验证，未找到可核的近期同题中文正反。开源已核 CDDA 固定修复路径，仅借机制，不直接复用到 Unity，也不复制代码或素材。两篇论坛公告要求登录，停止访问且未换镜像；未试用、未比较AI二改工时。[研究]


<a id="in-match-growth-evidence"></a>

## 局内等级与装备：资源到账不等于力量已兑现

**默认先保升级、购买和首次使用的时间链，复杂赏金与配方在明确需求后加入。** 对应 [05 局内成长](../../domains/game-dev/05-gameplay-architecture.md#in-match-growth)，回答等级／金币／装备怎样形成可理解的正常一局；不重复已有随机抽样、跨局解锁或卡牌结算。它是小项目设计选择，实际 MOBA 参数仍由案例实现维护，当前最佳品质与调参成本未知。

### 作品和社区怎样改变默认

| 已读原文 | 支持的取舍 | 适用限制 |
|---|---|---|
| Riot [26.1](https://www.leagueoflegends.com/en-us/news/game-updates/patch-26-1-notes/)／[26.2](https://www.leagueoflegends.com/en-us/news/game-updates/patch-26-2-notes/)，2026-01 | Swiftplay 前置三级和更多起始金币；后续作者报告局长约缩短六分钟。起步、收入、购买、终局可以分别改 | 厂商整体结果自报，不把变化归因于起始金币单项，也不移植为十分钟局参数；前置能力增加早期学习负担 |
| Riot [2024 Item Changes](https://www.leagueoflegends.com/en-us/news/dev/dev-2024-item-changes/)，2023-11-29 | 作者认为物品占用过多力量预算、压过英雄技能，转向简明且匹配玩法的效果；借技能管核心动作、装备管情境侧重 | 历史设计取舍，不据此宣布纯属性最好；增加主动物品会带来输入、AI 与反馈成本 |
| Blizzard [2019-12-03 补丁](https://news.blizzard.com/en-us/article/23239990/heroes-of-the-storm-live-patch-notes-december-3-2019) | Heroes of the Storm 经验球将附近自动经验改为可拾取对象，让经验位置成为可见决定 | 历史机制而非当前版本推荐；需增加路径、消失、隐身、特殊单位政策，同总量不能保原升级时点 |
| Riot [Season 2 Gameplay Changes Preview](https://www.leagueoflegends.com/en-gb/news/dev/dev-season-2-gameplay-changes-preview/)，2025-04-15 | 把英雄赏金和团队金币／经验／目标优势关联，解释落后队高击杀英雄不应自动给对方额外赏金，并记录状态更新延迟修复 | 支持别只看击杀数／当前钱包的失败模式，不证明小项目应复制其追赶公式 |

[Swiftplay 玩家原帖](https://www.reddit.com/r/leagueoflegends/comments/1qbuuqx/new_swiftplay_is_a_step_back_bad_for_new_player/)（2026-01-13）中，QbieShay担忧新手直接面对中期爆发、看不懂死亡；同帖 mack-y0 喜欢新版并自述局长缩短。这是不同个体体验，不能按票数或自述量化收益；它改变本题默认：先留可理解的简单起步，试玩证明重复多于学习，再考虑前置。以上官方与社区原文核实于 2026-10-25 UTC，未安装或运行作品。

### 固定经验入口：跨级之外还有消费者

沿已有 SPD v3.3.8 证据，只补读固定 `7b8b845a76fe76c6b7c031ae9e570852411f56db` 的 [Hero.java](https://github.com/00-Evan/shattered-pixel-dungeon/blob/7b8b845a76fe76c6b7c031ae9e570852411f56db/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/actors/hero/Hero.java) 中 `earnExp`／`maxExp`：一次经验可跨多个等级，获得经验也联动物品／状态效果。由此提出两项实施要求：逐级落实技能点／解锁；改为拾取或目标来源时同时追 XP 的充能／恢复消费者，不只核总量和等级。

源码静读支持调用关系，不是本仓运行复现，也不是推荐迁移 Java 游戏框架。固定文件头为 GPL-3.0-or-later，本次只借机制、不复制源码或素材；商业文章也不授予游戏代码／资产复用许可。核实：2026-10-25 UTC。

### 手算与实际检查分别覆盖什么

正文算例固定零起始、无支出、直购 1000 与商店机会 120／240／360／480 秒。持续收入 4、5、6 金／秒，对应够买 250、200、166.67 秒，实际首个窗口为 360、240、240 秒；收入连续变化，购买时间可跳变。累计 XP `[100,200,300,400]` 与 `[0,200,200,400]` 同终值，却分别在第三、第四波越过 250 门槛。这些表可手算，不含真实回城决策和战况反馈，不是 MOBA 建议数值。

作者及新上下文非作者独立运行纯 Python 算术，8 条合成断言通过，覆盖收入／窗口、跨级、精确门槛、同总 XP 不同时点及组件补差。检查脚本仅为本次研究辅助，并未作为产品或正文目录下的可运行入口交付。它没有实现真实奖励／购买事务、组件实例校验、技能发放或对局，不能据其通过声称这些行为已验收。

独审发现并修复了三处契约：`t_afford` 绑定指定装备及当时合法组件路径的补差；组件须为持有的唯一实例并匹配直接配方 ID／数量；金币分初始、玩法收入、出售回款与购买支出并保持守恒，组件消耗不二次记现金支出。正文的阶段由作者定义，不从局长机械等分。

后续只在真实案例回传后补实际采用的固定版本、来源／购买政策、正常与领先／落后时点、玩家解释升级／购物的结果。MOBA 的模拟、浏览器、真实品质与第二英雄＋方向弹道里程碑仍由原案例任务验收；本研究不新开平衡 benchmark，也不把算术当采用证据。

<a id="reward-choice-evidence"></a>
## 局内奖励选择：直接权重、票袋与供给底线不是一回事

核实：2026-10-24 UTC；对应[05局内奖励](../../domains/game-dev/05-gameplay-architecture.md#reward-choice)。本轮补小资源池怎样产生可用选择，不重开P105局外解锁、卡牌底座或随机隔离。默认是资格过滤＋单次展示去重，只有明确供给问题才加长期状态；属于研究判断，最高玩家体验与制作效率未知。[研究]

### 一手作品与固定实现

| 已读来源 | 支持什么；不支持什么 |
|---|---|
| [Windblown 0.99官方补丁](https://windblown.game/Patchnotes/0.99)，2026-10-22，Rewards Update | 装备来源由2改3选、部分场景可选商店类型、精英增强来源保最低稀有度。[一手] 可分别调候选数、来源与质量；未披露抽样算法或改善幅度，不能写成三选一必然优于二选一。[研究] |
| SPD v3.3.8，固定`7b8b845a76fe76c6b7c031ae9e570852411f56db`：[Generator.java L622–735](https://github.com/00-Evan/shattered-pixel-dungeon/blob/7b8b845a76fe76c6b7c031ae9e570852411f56db/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/Generator.java#L622-L735)、[L817–850](https://github.com/00-Evan/shattered-pixel-dungeon/blob/7b8b845a76fe76c6b7c031ae9e570852411f56db/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/items/Generator.java#L817-L850) | 抽中减票、耗尽重置；直接权重另有入口，神器不重置且耗尽返回null，由调用者回退为戒指。[一手] 袋与普通抽样可按来源混用，不是通用三选一实现。仅读固定历史版本，不称当前HEAD或已运行。[研究] |
| 同版[Dungeon.java L502–525](https://github.com/00-Evan/shattered-pixel-dungeon/blob/7b8b845a76fe76c6b7c031ae9e570852411f56db/core/src/main/java/com/shatteredpixel/shatteredpixeldungeon/Dungeon.java#L502-L525) | 力量药、升级卷轴的生成需求按楼层阶段与已生成数另算。[一手] 支持把关键供给与普通随机分层；此处未追完整生成、拾取路径，不把“判定需要生成”写成玩家必然获得。[研究] |
| [Black Dragon Mage作者公告](https://steamcommunity.com/app/2207230/allnews/)，Update v0.6.7，2025-12-07 | 作者修复早期解锁少、反复禁选使付费地图宝箱耗尽候选并卡住。[一手] 空池须有产品回退；未取得补丁源码，不推断作者采用哪种回退。[研究] |
| Halls of Torment [Dev Journal #4官方正文](https://store.steampowered.com/news/posts/?enddate=1686747619&feed=steam_community_announcements)，2023-06-14，历史对照 | 作者区分重抽本次特性选择、当局移除特性及后继。[一手] 只借不同作用范围，未核2026全套药水规则；与近期来源控制／最低品质比较，不据旧机制宣布最优。[研究] |

固定SPD文件声明GPL-3.0-or-later；本轮只借机制，不复制源码／素材，不推荐把Java游戏底座迁到Unity。Unity／UE原生随机能力及隔离边界沿[既有比较](#随机所有权补研装饰二改是否改变玩法序列)，它们不提供作品的资格／供给政策。[一手／研究]

### 玩家需求并不一致

已读[r/roguelites原帖](https://www.reddit.com/r/roguelites/comments/1md3pkj/do_complex_build_systems_make_roguelites_more_fun/)：manderson1313厌倦每局重复少数升级，blorbagorp偏好能计划见到目标的小池，VagrantPilgrim担心复杂构筑打断动作节奏。[社区：个人自述，精确发言日未核] 因此增加池量、降低重复或提高定向性没有统一胜者；本轮不以票数证明普遍偏好，仍先定位玩家缺的是变化、可规划性还是少停顿。[研究]

### 决定与可反驳条件

**先保证“选择合法”，再决定是否保证“构筑及时成形”。** 原型普通奖励按正权重抽取、展示内身份唯一；若关键供给缺口才分出阶段规则，而非让所有稀有物品都按袋循环。正文10票／18次缺口是数学构造，无模拟或玩家效果声明。[研究]

**展示记账不等于获得记账。** 若袋控制内容曝光，新展示即耗票是自洽选择；若契约保证获得补给，未选不算获得。多选奖励若只在选中时耗长期票，不能仍套用“整袋展示频率”的保证。采用哪种取决于玩法，不能由随机API决定。[研究]

**有限控制保留适应，不代替内容质量。** 重抽或选来源让玩家付代价换机会，禁选则持续改变可行集合；若只有指定组合可玩，应先修替代路线或必要前置供给，不用更多重抽次数遮掩。无效候选归规则验证；玩家是否愿意改构筑、是否觉得选择只是耗时，仍须实际试玩。[研究]

本轮只读公开补丁、固定源码与原生文档；未购买、运行模型／引擎、制作新游戏或CPU小样，不声称玩家收益／AI二改成本已测。实施与验收直接回05，存档／随机隔离沿既有契约，不另造框架。[研究]
