主线：一／二／三／四；运动、碰撞与视听反馈
改变的建议：[研究] 角色控制用起停距离、转向轨迹与落点带定义体验，再复用 motor 并协同动画、镜头与反馈。
新证据：2026-10-24 整合完整角色控制，补 Holden 起停拟合／固定修正版、当前 Starter 条目及 Celeste64 运动分区；资料／源码静读，未试用。既有打击感、镜头与窄 HUD 检查保留。

# WP10：运动与视听反馈

[总摘要、生命周期与预算](2026-10-14-game-wp10-client-modules.md)；[输入、UI 与内容](wp10-content.md)。除末尾明确列出的 Star-Rush 本端兼容模式 HUD 检查，本册为既有公开资料／源码研究；其他机制、完整游戏／引擎体验与玩家收益未实测，也不代表模型能力已验证。

<a id="character-control"></a>
## 完整角色控制：把起停、转向、落点和身体表现连成可调流程

**[研究] 默认：自由移动保代码控制，接触复用成熟 motor；把停距、转向轨迹与落点带作为设计输入，再接动画／镜头。**
**[研究] 增量：补的是正向操控品质和实施次序，不再以跳跃资格／取消恢复替代完整控制；正文替换原简短运动选型段，保已有锚点。**
**范围：2026-10-24 UTC，公开资料与固定源码静读；未安装角色包、运行引擎／模型或试玩，最高体验水平和维护收益未知。**

### 现有覆盖与这次整合

探索回执：[研究] 本轮为既有研究续接，新增读官方页面、作者文章、固定源码与历史 Unity Discussions 原帖；未新增完整中文／多社区扫描，不将旧章探索范围算作本轮完成。

本册已有 [P35](#p35新增移动能力后保住控制契约) 的缓冲／跳跃资格／接续、[3D 运动](#9)的 motor／平台／root motion、[镜头模块](#camera-contract)及[打击感](#hit-feedback)。WP11 的[镜头参照](wp11-camera.md#s9-4)、05 的技能／状态接续可直接引用；这次不改它们、不重包装路线意图研究。[研究]

缺口是：读者仍不容易从“角色发黏／转弯漂／落地不好控”定位控制目标、参数组、身体表现和内容尺度。正文现在给一条从体验目标到现成底座、参数、可操作调校场和 AI 二改的路径。选目标后再选控制器，不把“换为更高级 motor”当手感答案。[研究]

<a id="control-evidence"></a>
### 强实践对照：哪些机制真正改变选择

| 原始证据 | 能借的机制；本轮判断与边界 |
|---|---|
| **Penny’s Big Breakaway，GDC 2025**：沿本册 [P35 的 PDF 页码与作者证据](#最高水平卡与同题比较)，本轮不声称重看演讲 | [一手／研究] 动量与动作组合可成为表达空间；对照精确修正，保留“高速不必瞬转”的路线。关卡和反馈要解释失败，不能把更快制动统一当改善 |
| **Celeste64 固定 `6edfe1ebd2a21a6134d7675a28e357891025407e`**：[Player.cs L991–1122](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L991-L1122)，本轮重新读取 | [一手] 无输入时地／空摩擦不同；地面低速趋目标速度，高速转方向，强反向进 skid；超速保留与空中修正另分支。[研究] 借响应分区，不抄常量、坡速或临时边缘纠偏；该游戏风格和 jam 架构不是通用质量上限 |
| **Daniel Holden，2026-01-07**：[New Movement Model](https://theorangeduck.com/page/new-movement-model) | [一手] 分加减速、方向性加速、转向、速度平滑及朝向；作者说明进入 Mover Smooth Walking。[研究] ✅ 先用简单目标速度趋近；需要保速转弯／动画轨迹时🧪独立这些自由度，不将速度弹簧当纯表现、不默认迁 Mover |
| **Holden，2026-02-15**：[Fitting Code Driven Displacement Revisited](https://theorangeduck.com/page/fitting-code-driven-displacement-revisited) | [一手] 在临界弹簧模型下以起停距离／时间估参；简化停距假设初始加速度零，停时需速度阈值。[研究] 借“从可见尺度倒推参数”的工作方式，正文恒制动公式是另一模型，不能混算；途中制动、反向和碰撞后重新观测 |
| **ECM2 用户与作者原帖，2023-04**：[原文 #881–882](https://discussions.unity.com/t/released-easy-character-movement-2/839721?page=45) | [社区／一手] 用户反馈样例 dash 结束停顿，作者指出样例主动清零，并说明加减速／摩擦继续影响运动。[研究] 碰撞 motor 可复用，样例的动量政策仍须按游戏重选；历史问题不证明现行包故障或全部控制器都有同一原因 |

**固定可复核的新实现。** [一手] `orangeduck/MovementModel@ae699fde7b8c8e268facdff0dbbc2ade8e2db9bd`（2026-02-02），本轮读 [MIT](https://github.com/orangeduck/MovementModel/blob/ae699fde7b8c8e268facdff0dbbc2ade8e2db9bd/LICENSE)与 [movement.cpp L430–458](https://github.com/orangeduck/MovementModel/blob/ae699fde7b8c8e268facdff0dbbc2ade8e2db9bd/movement.cpp#L430-L458)：`next_vel` 更新中间状态，`track_vel` 是实际速度弹簧目标。作者[勘误](https://theorangeduck.com/page/microblog)说明早先文章代码用错目标，2026-02-02 修正。**[研究] 需要试这个模型时固定修正版，不照旧文章片段生成实现；这是控制曲线示例，不含 Unity 碰撞／平台整合，也没有本仓实跑。**

[研究] 三种速度路线的代价不同：直接跟目标速度最容易理解但方向突变强；有限加减速有可解释停距但转向会减速；再独立转向／弹簧可扩大表现范围，却增加参数耦合、状态和轨迹验收。响应不是越快越好，平滑不是越多越好；缺口只在视觉朝向，就不要把整个物理速度送进新滤波器。

<a id="control-foundations"></a>
### Unity 实现起点与 UE 对照：复用哪一层

**Starter 条目不能凭旧名称判断。** [一手] 本轮读 Unity 官方[条目 196526](https://assetstore.unity.com/packages/3d/characters/first-person-third-person-character-controllers-196526)：原 ThirdPerson URL 重定向到 First Person + Third Person | Character Controllers，2.0.1、2026-09-17、免费，兼容表含 6000.3 URP；标 **Non standard EULA**。另一个[条目 267961](https://assetstore.unity.com/packages/essentials/starter-assets-character-controllers-urp-267961)仅自身标 deprecated。没有下载 2.0.1 或核其包内文档／许可，不能沿用旧版脚本字段、推断所有 Starter 停更或宣称 AI 输入权限。[研究] 👀 作为快速建立可操作基线的当前官方候选；已有许可明确的旧版本可以继续，不因重命名强制升级。

**motor 复用沿已核机制，不重新造表。** [研究] [既有五方案](#11)已经比较 OpenKCC、CMF、SRMove、ECM2 与 Philippe St-Amand KCC 的接地、平台、依赖与许可。本轮未重新核每个商店的发行状态，因此不将 10-14 价格／版本提升为 10-24 最新。OpenKCC 是可改接触底座；CMF 是速度／momentum 分工参考；Starter 是快速上手组合；ECM2/KCC 解决更复杂接触。目的不同，不能按功能数排名。

[一手] 重新读取 [ECM2 Character 文档](https://oscar-gracian.gitbook.io/easy-character-movement-2/user-manual/general/components/character)：Character 处理移动模式并把运动交 CharacterMovement；默认 auto-simulation 通过 LateFixedUpdate 协程安排在 Unity 物理更新之后。[研究] 窄策略沿实际包回调接入，不能再随意加一个 FixedUpdate 重复驱动。文档未锁版本且未验包；正式接入按安装版确认，不复制不匹配 API。沿[旧许可核查](#现成-motor-补比先借已有平台机制再决定补什么)处理商业包与 Agent 输入权限，公开文档可读不等于包代码可输入。

[一手] [Unity Character Controller 1.4.5](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/index.html)仍是 Entities 路线；GameObject 内置 CC 的 [Move](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController.Move.html)没有自动重力，平台／速度语义沿[既有核查](#10)。[研究] 已有 ECS 用其标准角色／平台入口，非 ECS 不因它“官方”而迁移；已有 Rigidbody 手感合格也无需强换。

[一手] [Epic 当前 Mover 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/mover-in-unreal-engine)仍标 UE 5.8 Experimental，并提示 API／数据格式可能变、更成熟后仍会继续支持 CMC。[研究] Smooth Walking 的新思想可评估，成熟胶囊角色仍默认 CMC；回滚、非标准形体或模块模式有结构性需求才改变默认。动画采样上限与完整角色 gameplay 不等同，GASP 的定位沿[已有 UE 记录](#15)。

### 参数推导、输入与协同的实施边界

[研究] 正文的恒制动／跳高公式是理想运动学初值，不是引擎复制代码：无额外力／碰撞、固定重力或恒制动才满足；模拟步与阈值改变实际停点。`MoveTowards` 类速度趋近可以先用地面加速／制动两档，转向是否用独立曲线由 90°／180° 轨迹决定。半衰期适合时间一致的响应表达，但不能把任意 `Lerp(v,target,k*dt)` 都叫精确半衰期，也不能用平滑遮输入等待。[研究]

[一手] Unity Input System 1.20.1 的[处理器入口](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/Processors.html)、[内置处理器](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/built-in-processors.html)及[处理层级](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/introduction-to-processors.html)区分值变换及 Control／Binding／Action 层。[研究] 检查现有死区而非机械再加一次；模拟幅度要进入速度映射。镜头水平参考基在接近竖直时需稳定后备，具体是上一有效朝向还是角色 yaw 由项目选择。持续输入是否跟导演切镜沿 [WP11 已有来源](wp11-camera.md#s9-4)，不把装饰视图强当唯一玩法参考。

[研究] 动画、镜头、反馈各消费合适信息：意图给启动／瞄准，实际支撑面相对速度给步态，碰撞前相对接近速度给落地力度，稳定呈现姿态给跟随。角速度平台的支撑点速度、root motion 经过 motor 及视觉／物理更新阶段沿[旧 3D 运动](#9)；非零世界位移不等于角色在走。缺动作资产时优先换合规资源或缩动作范围，程序不能凭空修好接触姿态。

### 验收为什么是一个调校场，而不是一次取消测试

[研究] 正文实施清单让 AI 在现有项目内交可操作场景、参数释义、轨迹与前后录屏；一条路线覆盖短推、起停、折返、空控、坡阶和平台，再接瞄准／落地表现。每个区段对应一个玩家可学能力，机器记录原因、人判断可控／可读与乐趣。没有执行这些验收，不填写已通过，也不为文稿额外写脱离引擎的 CPU 模拟来证明手感。

二改提高跑速时同时核停距、转向空间与镜头预判；二改瞄准侧移时同时核移动基、朝向与动画。只让与需求有关的轨迹变化，不要求新旧全部相同。碰撞、资源、输入暂停等基础正确性继续沿既有章节；本轮主结果是正向操控和开发调校方法，不另造通用 controller／新游戏。[研究]

## P35：新增移动能力后保住控制契约

核实：2026-10-21 UTC；本单元复用审计 G04／G05 卡与本册旧动作证据，比较同一问题：Agent 给已有单跳增加冲刺、再增加二段跳或受击时，怎样不悄悄改变原有操控。仅公开资料和源码静读；项目整体验收、模型效果与引擎体验均未完成。[研究]

### 最高水平卡与同题比较

- **问题：** 既要接受合理输入，又要让新动作接得上旧速度、资格与反馈；代码能运行还不够。[研究]
- **当前最高水平：未知。** 审计 [G04／G05](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md) 的整链缺口仍在。近期高质量实践为 Esteban Fajardo 的 [GDC 2025 演讲入口](https://gdcvault.com/play/1035507/Jazz-Platforming-in-Penny-s)及[原始幻灯片含讲稿备注](https://media.gdcvault.com/gdc2025/Slides/EstebanFajardo_JazzPlatformingInPennysBigBreakaway.pdf)，会期 2025-03-17 至 21，未核单场日期、未看视频；作者在 PDF 自述参与 Penny’s Big Breakaway 设计。已读机制段，不仅目录摘要。[一手]
- **近期工程候选：** Daniel Holden [New Movement Model](https://www.theorangeduck.com/page/new-movement-model)，2026-01-07；[作者归档](https://www.theorangeduck.com/page/all)确认日／月格式。作者自述与 Caleb Longmire、Jack Potter 在 Unreal 团队合作，成果进入 Mover Smooth Walking；不据个人文章称为官方质量认证。[一手]
- **主流参照：** 原生输入／运动与明确状态交接；这是引擎提供的路线，不是采用率调查。[研究]
- **可行实现：** 固定 Celeste64 可读到分动作速度政策；Unity／UE 文档可实现跳跃，但源码和 API 不证明玩家更喜欢。[一手／研究]
- **本仓推荐：** 原生底座＋显式三份契约属于有依据的可行默认。比较近期路线后仍不默认迁移：读者需要的是二改不误改玩法，目前没有证明换控制器能保整链的同题结果。[研究]

| 同一决定 | 旧高质量参照／近期路线 | 对这次二改的取舍 |
|---|---|---|
| 是否把转向和停止改得更快 | Celeste 的作者说明以扩展时空容错帮助玩家；Penny 的 2025 复盘 PDF 第 20–35 页（零基索引）则有意保留惯性，并说明技能差距与失败原因更难读的成本 | 精确落点先保纠错；动量玩法先保继承。两者都不能推出所有新动作结束时清零。[一手／研究] |
| 平滑是否只是表现层 | Holden 模型分加速、减速、方向加速、转向强度及速度半衰期／补偿；旋转又独立。作者模型能逼近多种轮廓，尚非该项目的输入延迟或玩法优胜实测 | 需要不同起停／转向轮廓才比较；把真实速度送进弹簧会改轨迹，不能作为纯动画重构混入。[一手／研究] |
| 新能力是否必须互不重叠 | Penny PDF 第 40–51 页说明输入时机与已有速度影响摆荡结果，多个动作允许达到相近结果 | 不因“职责重复”删除玩家已有连段；先写预期速度与可达路线，再判断冗余是表达空间还是误触。[一手／研究] |

Penny 是已发行作品的设计取舍，不是通用最优证明；Holden 是近期工程候选，不替输入缓冲、碰撞或取消协议。两者与旧方案比较的是运动控制目标，不延伸到 P39 的窄道动画选择。[研究]

### 三个机制：参数要跟行为一起交给 Agent

选择这三项，是因为它们分别决定“这一按是否还有效”“现在是否有资格跳”“动作接续留下什么”，一次新增能力就会跨过三处，不是随意凑三个功能。[研究]

1. **输入意图有期限，也有适用状态。** 参数至少含缓冲秒数、计时域、可接受状态、消费点与互斥优先级。默认成功接受后消费一次；死亡／重开作废旧意图；暂停如何处理按原玩法明确配置。不要让每个新状态自行复制一个“按过跳跃”布尔值。采样与固定步的旧建议见本册“四类时间问题”，这里增加的是跨动作资格，而非再教一次 Dynamic Update。[研究]
2. **离地宽限不是额外跳跃次数，短长跳不是再次按下。** 参数含宽限秒数、起跳竖直速度、持有追加量／持续上限、松键截止、顶头／受击截止、落地恢复条件。默认主动起跳消费地面资格；二段跳使用自己的剩余次数；若设计要求其它规则，写进动作表而不是靠判断顺序碰巧实现。[研究]
3. **速度由接续政策决定，反馈由已接受动作驱动。** 参数含进／出状态各轴的替换、叠加、保留或上限，外部击退与平台速度如何合成，状态退出后谁仍可写。默认不要在共同 Exit 中统一清零，也不要在输入回调提前播放成功声；打断后旧写入失效，当前动作自己恢复权限。[研究]

**Unity 与 UE 不照抄同名字段。** [Unity Character Controller 1.4.5 Jumping](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/jumping.html)（页面生成 2026-08-20）分离最近按下／最近着地时间，并列出起跳基础速度、持有加速度与持续时间；自写起跳要解除 IsGrounded，否则吸附可能把角色拉回。它是该包的契约，不是 GameObject 内置 CharacterController API。[一手]

[UE Character Jump](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Character/Jump)在下一更新起跳；JumpMaxHoldTime 非零时须在希望停止持续跳力时调用 StopJumping。这里只核 Character 路线，不把它当 Mover 的同名接口。[一手]

[UE 5.8 LaunchCharacter](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/ACharacter/LaunchCharacter)分别以 bXYOverride／bZOverride 选择替换或叠加分量；pending launch 在下一 CharacterMovementComponent tick 处理并转 falling。它是“按轴明确政策”的原生对照，不是所有冲刺的默认实现；若采用，另验静止、已有水平速度、上升和下落四种入口。[一手／研究]

**现成实现借哪些，拒绝哪些。** 本册已固定的 [Celeste64 Player.cs](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L714-L803) 中，普通 Jump 设竖直速度、叠加水平 boost，WallJump 替换水平速度；两者都处理平台速度与吸附，DashJump 另有持有参数。CoyoteTime=0.12、JumpHoldTime=0.1 是这个实现的秒值，不是推荐区间。普通起跳清 tCoyote；[冲刺分支](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L1251-L1289)只在特定条件放行 dash jump，并非任意取消。[一手：固定源码静读]

采用单位是这些不同接续政策，不是整段移植；代码／资产许可仍按本册原“可借用实现”表，非 Unity／UE 即用库。缓冲 0.1 秒的旧核查与菜单共键反例复用 [输入交接](wp10-content.md)，本轮没有重新核到 Controls 文件正文，不冒充新增证据。[研究]

### 二改验收：从单跳到冲刺再到中断

下表是本仓提出的未执行验收设计，不是优秀作品公开测试结果。先保存原落点与输入轨迹，再让 Agent 改；目标不是所有轨迹必须相同，而是只有授权改变的部分能不同。[研究]

| 阶段／刺激 | 机器可查的契约 | 人要判断 |
|---|---|---|
| 基线单跳：落地前按下再松开、离台边界前后各一模拟步 | 按所选缓冲／持有政策最多一次起跳；过期不执行；记录拒绝原因和接受时刻 | 短按是否符合意图，宽限是否跨过本应失败的路线 |
| 第一次修改加冲刺：跳冲同帧、落地前冲刺、空中反向 | 按明确优先级只消费对应意图；进／出状态速度符合各轴政策；旧短长跳轨迹除批准部分不变 | 新招能否连贯接续，是否把动量玩法改成瞬停 |
| 第二次修改加二段跳／受击：宽限内起跳后再按、持有中受击 | 地面资格与空中次数各自只消费一次；释放／打断终止旧持有写入；旧冲刺结束不覆盖新击退 | 二段跳是救险还是误触，受击是否清楚且保必要承诺 |
| 边界：打开菜单、恢复、死亡重开；注入旧动作回调 | 按原菜单政策保留／作废；旧实例不能改新速度、次数、锁或反馈；结果音不重复 | 玩家能分清拒绝、接受与被打断，没有凭空动作 |
| 30／60／120 显示率及长帧，固定步不变 | 记录采样、接受、模拟生效、首反馈四时点；次数／到期判断一致，不要求浮点轨迹逐位相同 | 实际设备首反馈与落点是否稳定，自动轨迹不能判乐趣 |

**AI 风险要落到检查上。** 易错点是把 held 当 pressed、宽限复用成第二跳、在每个状态重复计时、通用退出清零、受击后旧持有仍改速度，以及拿新模型的平滑掩盖接受延迟。Agent 可生成边界时间序列、记录上述字段并做差异定位；人必须选操作目标、试玩关键落点／连段，决定参数与撤回，资料不支持宣称 AI 可自动调出最佳手感。[研究]

**反例与撤回。** [UE-209032](https://issues.unrealengine.com/issue/UE-209032)记录 MoverExamples 因输入与模拟 Tick 顺序额外等待一帧；状态 Fixed、影响版本 5.4、目标修复 6.0，2026-08-04 resolved／09-30 updated。不能据此称 5.8 已修，也不能把它泛化为当前所有 Mover 项目仍有该缺陷。[一手] [Mover 官方页](https://dev.epicgames.com/documentation/en-us/unreal-engine/mover-in-unreal-engine)仍标 Experimental；本轮不为加跳跃迁移它。[一手／研究]

出现过期补跳先收窄有效状态／窗口；新招破坏旧连段先撤回速度交接改动；平滑增加不可接受的控制距离先撤回该参数。若现成底座无法表达已定政策，再比较自定义模式或新控制器，不以调参永远修补结构冲突。[研究]

<a id="1"></a>

## 体验质量深化：响应与顺滑，让同一个动作值得反复玩

核实：2026-10-14 UTC。补 04 的动作回应、可读性与连续游玩质量；比较 2D 动作与 3D 第三人称，节奏／容错按玩法选择。[研究]

<a id="2"></a>

### 1. 四类时间问题不能用同一种“平滑”处理

| 问题／一手证据 | 改变的建议 | 可推翻或收窄建议的条件 |
|---|---|---|
| [Input System 1.19 时序选择](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/timing-select-mode.html)及[固定步长详解](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.19/manual/timing-optimize-fixed-update.html)：FixedUpdate 在渲染帧内可能零次／多次执行，固定模式按完整时间步归组事件；低延迟需求推荐 Dynamic Update，即使物理施力仍在 FixedUpdate | [研究] 先减少事件等待；保存连续输入，离散指令消费一次，勿把所有输入搬到 FixedUpdate 当性能优化。物理模拟方式与输入采样模式可分别选 | [研究] 小量延迟不影响玩法且统一固定时序明显更简单时，原生固定模式可保留；这里不涉及网络确定性／回滚的时间线设计 |
| [Unity 6.3 Rigidbody 插值](https://docs.unity3d.com/6000.3/Documentation/Manual/rigidbody-interpolation.html)：Interpolate 用前两次物理姿态并延迟一个物理步；Extrapolate 预测未来姿态，可能越过碰撞边界 | [研究] 插值改善可见轨迹，不自动降低操作延迟。给观察到抖动的对象按需开启，再检查角色／跟随者使用的姿态；不把所有对象插值或全局提高物理频率设为默认 | [研究] 若游戏直接控制的角色更重视即时反馈，新增滞后不合适，可回退该对象插值并重新决定运动／呈现方案；不是跳过碰撞求快 |
| [Android Frame Pacing 官方说明](https://developer.android.com/games/sdk/frame-pacing)，页面更新 2026-02-26：不均匀显示间隔、重复帧及 queue-stuffing 可增加卡顿／延迟，Unity 已集成 | [研究] 平均 FPS、CPU/GPU 用时与实际呈现间隔分开记录。原生 Android 先用引擎选项，不为独立游戏再实现呈现同步层 | [研究] 平台、图形 API、刷新模式和引擎版本变化需复核；没有目标设备数据，不声称固定幅度改善 |
| [Unity 6.3 targetFrameRate](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Application-targetFrameRate.html)：桌面软件限帧有 microstutter 风险，vSyncCount 非零时忽略 targetFrameRate；Android 有不同规则 | [研究] 不把 `targetFrameRate=60` 当跨平台顺滑配方。桌面按同步方式选，Android 按目标与刷新率配置；帧间隔稳定和输入延迟同时比较 | [研究] VRR、平台合成器、驱动及硬件队列会影响结果；官方机制不能替目标设备端到端测量 |

[研究] 未来以时间戳定位输入处理、动作接受与首个反馈；p95／p99、最长帧和超预算场景描述稳定性。外设到屏幕发光另测，试玩判断体验。

<a id="3"></a>

### 物理查询补研：刚改位置不等于物理查询已看到新位置

核实：2026-10-15 UTC。移动／放置后的错误命中先查物理状态新鲜度；范围为 Unity 3D，UE 对照原生 tick 合同。[研究]

- [一手] [Unity 6.3 同步手册](https://docs.unity.com/en-us/engine/6000.3/manual/physics-section/physics-overview/physics-optimization/cpu/transform-sync)：默认延后 Transform 同步；直接改 Rigidbody／Collider Transform 后，依赖新位置的同帧查询前调用 `Physics.SyncTransforms`。Auto Sync 每次查询隐式同步。[研究] 批量改后同步，中间再改须重定边界，非保证一帧一次。
- [一手] [6000.3.0f1 发布说明](https://unity.com/releases/editor/whats-new/6000.3.0f1) 弃用 `Physics.autoSyncTransforms`，建议显式同步；6000.3 固定 `c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1`（6000.3.26f1）的 [Physics.deprecated.cs L22–25](https://github.com/Unity-Technologies/UnityCsReference/blob/c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1/Modules/Physics/ScriptBindings/Physics.deprecated.cs#L22-L25) 仍有 extern get/set、`Obsolete(..., false)`／`ExcludeFromDocs`。不生成新开关写入，也不称已移除／无效。
- [一手] [6.3 SyncTransforms API](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.SyncTransforms.html) 将自身／子层级 Transform 送入物理；[固定 Physics.bindings.cs L763–783](https://github.com/Unity-Technologies/UnityCsReference/blob/c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1/Modules/Physics/ScriptBindings/Physics.bindings.cs#L763-L783) 中 `Simulate_Internal` 与 SyncTransforms 为独立绑定。[研究] 同步不推进模拟／求接触；只核公开 C#，未核原生求解器。[Unity Reference-Only License](https://github.com/Unity-Technologies/UnityCsReference/blob/c57f9f00d22b3794130a9bfa76dd7c8b32e4f2f1/LICENSE.md) 仅供参考，不作可复用运行时代码。
- [一手] [6.3 MovePosition](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.MovePosition.html) 用于运动学连续运动并遵循插值，示例在 FixedUpdate；瞬移用 `Rigidbody.position`。[position 文档](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-position.html) 说明经物理设置、下次模拟后更新 Transform，可免附属 Collider 重算。[研究] 同步不令 MovePosition 已完成，可见／物理姿态也非时时相等；不外推 Rigidbody2D。
- [一手] [UE 5.8 Actor Ticking](https://dev.epicgames.com/documentation/en-us/unreal-engine/actor-ticking-in-unreal-engine)：PrePhysics 读上一帧，DuringPhysics 不确定，PostPhysics 模拟已完成；同组可用 `AddTickPrerequisiteActor/Component` 等具体生产者。[研究] 仅需要当帧模拟结果才延后，不把任意 SetActorLocation 查询等同，也不造 UE flush。

**二改预注册：** [研究] 把静态障碍改为同帧脚本移动，对照批量修改后直接查询与显式同步；原生刚体运动另按既定模拟步骤观察。正确后再测同步成本。射线起点、层矩阵、形状或参数错误另修；查询不依赖新位置时不加同步。

<a id="4"></a>

<a id="hit-feedback"></a>

### 2. 完整反馈模块：结果、力度与通道分开设计

核实：2026-10-23 UTC。**[研究] ✅ 以确认 HitResult 并列驱动动作仲裁和反馈编排，默认复用原生播放器；多通道反复编排才评估 Feel。** 本节替换原来“重武器／群战加短反馈”的窄建议；作品参照、参数和生命周期一起接到[正文执行清单](../../domains/game-dev/04-client-modules.md#打击感与反馈先让命中有含义再让重击有分量)。仅资料与源码阅读，未安装反馈库、购买资产、运行引擎或做观感测试，最高质量排名未知。

#### 作品怎么做：强调哪一击，比统一加大更重要

| 代表作／原文 | 决定性证据、改变的选择与限制 |
|---|---|
| **Monster Hunter Wilds，AAA，2024-12-19 发行前社区更新**：[官方公告](https://steamcommunity.com/games/582010/announcements/detail/500560073905406298)；[实际读到的官方转引](https://devtrackers.gg/monster-hunter-world/p/c8161ebd-monster-hunter-wilds-pre-launch-community-update) | [一手转引] 开发者解释，《World》反馈过重的意见促使 Beta 减少 hitstop；Beta 后又收到攻击力度不足的意见，遂强化终结和强攻击。[研究] 两次方向相反的调整支持按动作地位分层，不支持“越长越重越好”。官方索引交叉核对，原公告工具未返回正文，未观看视频／试玩；没有可复用毫秒参数 |
| **Dead Cells，优秀独立，2017 开发者访谈**：[Fighting 段](https://80.lv/articles/interview-with-the-developers-of-dead-cells) | [一手] 开发者描述暴击的一帧冻结、随后零点几秒减速（历史描述），配血花和专属声音。[研究] 借“确认事件同时组织节奏／声画”，不能把一帧武断换成 16.7 ms，也不能把访谈当当前版常量；没有本仓因果 A/B |
| **Warframe，2025-10 官方修订**：[PC 40.0.0，10-15](https://www.warframe.com/en/patch-notes/pc/40-0-0)；[PSN 40.0.3，10-21](https://www.warframe.com/en/patch-notes/psn/40-0-3) | [一手] 在恢复曾误去掉的后坐镜头后，玩家报告不适；关 Screen Shake 时去掉相关镜头位移，以准星菱形继续表达 recoil。后续仍有分开后坐／屏震设置的诉求，公告说明主机 cert 边界。[研究] 命中／后坐的信息不应被绑死于镜头运动，不声称后续已彻底解决晕动 |

**[社区] “打击感差”不是一个参数诊断。** [机核 2024-11-08 Wilds Beta 讨论](https://www.gcores.com/articles/190510)涉及轮廓与低机位遮挡；[Reddit 2024-12-04 讨论](https://www.reddit.com/r/MonsterHunter/comments/1h64wll/i_cant_believe_overseas_fans_used_to_hate_hitstop/)中轻武器连贯与重击力度有不同意见。另一个独立游戏的 [Katanaut Demo Steam 原帖，2025-01-19](https://steamcommunity.com/app/3032830/discussions/0/632293266018036582/)把失控前冲、接触姿态和低对比也归为打击感，开发者回应待调整，未见本轮后续复测。[研究] 所以先把问题拆成动作控制、接触可读性、节奏和感官负担；这些是个别观察，不是总体玩家共识或当前发行版故障列表。

#### 参数合同：反馈插件接不了的那一半

[研究] 输入接受即发起手预反馈，命中查询／结算后才发结果；`HitResult` 至少可关联动作、段序号、目标、结果、接触位置／方向和实例代次。动作仲裁决定受击、霸体、击退、死亡优先级，反馈编排只选择该结果的声画触觉。两个分支并列，不让“是否播放特效”决定是否受伤。

| 必填参数 | 比较与失败条件 [研究] |
|---|---|
| 接触／节奏 | 采样→接受→判定→首反馈分别记时；起手、生效、恢复与取消窗口分开。迟到先修链路，不能以零前摇／任意取消牺牲动作承诺 |
| hitstop scope／时钟 | 逐项指定攻击者、受击者、世界、动画、物理、粒子、相机、音频、UI 与输入 TTL 是否停；局部表现冻结不能假定冻结所有子系统。凡改变反应／判定窗口，作为玩法规则，不偷偷随画质或无障碍选项改变 |
| 重入／合并 | 同击用关联身份去重；真实多段用不同序号，多目标各结算但镜头／声音／触觉设预算，合并方式和上限显式。全局 cooldown 既可能漏真实下一击，也不能证明同击已去重 |
| 恢复／所有者 | 每个持续效果有所属动作、对象、玩家与代次；暂停、取消、销毁、回池、换设备、退局、重开逐项定停止／恢复政策。旧回调不能改新实例，停止不能灭掉别人仍有效的贡献 |
| 质量 | 轻／重、格挡／命中可辨，接触方向正确，下一威胁可见；层级声音起音不被并发吞掉，镜头与触觉不累。没有跨武器、设备和玩家的最佳毫秒配方 |

[一手] [Unity 6000.3 timeScale](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Time-timeScale.html)：零时 FixedUpdate 和 WaitForSeconds 不推进，修改从后续帧生效。[研究] 恢复必须有仍推进的路径；释放本次持有权后重算有效状态，不盲写 `timeScale=1` 或恢复已过时的旧值。固定步是否随倍率改另定。输入、菜单权限和触觉沿 [WP10 content #21／#22](wp10-content.md#21) 的既有 1.20.1 证据，不用较老包文档倒退版本；旧命中脉冲过期后不补播，持续状态另定恢复。

#### Unity 优先的实现比较：时钟、停止和复位并非同义词

| 路线／固定依据 | 采用单位与撤回条件 |
|---|---|
| **原生 Animator／AudioSource／Particle System＋Cinemachine**：[ImpulseManager 3.1 API 实际 3.1.7](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/api/Unity.Cinemachine.CinemachineImpulseManager.html)；[main 固定源码](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Impulse/CinemachineImpulseManager.cs) | [一手] `ImpulseManager.IgnoreTimeScale` 独立于 Brain；快照 `GetImpulseAt` 位移相加、旋转相乘，不是总强度封顶；Cancel 可衰减／立即，Clear 清全局，过期事件可复用。[研究] ✅ 项目补通道预算和所有者，不长期保过期 handle 或用 Clear 清单次命中。main 快照不等于发行 3.1.7；[2019 菜单冻结 shake 原帖](https://discussions.unity.com/t/can-impulselistener-ignore-timescale/750827)说明时钟易混，不是当前 bug 判定 |
| **Feel**：[MMF Player 文档](https://feel-docs.moremountains.com/mmf-player.html)；[发行记录](https://feel.moremountains.com/feel-releases) | [一手] `StopFeedbacks()` 默认停序列和内容，false 只停序列，`InterruptsOnStop=false` 的子效果可继续；`RestoreInitialValues` 另调用，重入／cooldown 不代事件 ID；Player 与子反馈时钟都须核。6.3（2026-10）需 Unity 6000.5.0f1+，6.0 才有 Sequential mode，不能套回 5.x。[研究] 👀 多动作反复编排才有潜在收益；本仓 6000.3 不直接升级，未购买／安装或读付费源码。停止后残留／重开音高等修复记录说明整包仍需回归 |
| **DOTween**：[develop 固定 TweenSettingsExtensions](https://github.com/Demigiant/dotween/blob/bfb02b05551a45204352dc43bdc15b882147891a/_DOTween.Assembly/DOTween/TweenSettingsExtensions.cs#L87-L110)；[官方文档](https://dotween.demigiant.com/documentation.php)；[许可](https://dotween.demigiant.com/license.php) | [一手] 快照内部 1.3.045，不当商店发行版；已入 Sequence 的子 tween 不接受 SetLink，嵌套更新时钟由根序列控制；independent＋Fixed 在 timeScale=0 仍无 FixedUpdate。许可非 MIT，允许商用而改版分发受限。[研究] ✅ 项目已有就复用根 handle，明确 Kill／Complete／回初值，避免 KillAll；不拷改版库进公共模板，也不为一次闪色迁库 |
| **PrimeTween 近期对照**：[1.5.1 固定 changelog](https://github.com/KyryloKuzyk/PrimeTween/blob/023630e033ddaf197cb5f135b7cd0deda1a3557c/changelog.md)（2026-10-21）；[许可](https://github.com/KyryloKuzyk/PrimeTween/blob/023630e033ddaf197cb5f135b7cd0deda1a3557c/LICENSE) | [一手] 1.5.0 增取消 stop／complete 策略，修 CompleteAll 的回调重启自身冻结；公开模板须经 NPM 引依赖，不能捆源码／tgz，不是无条件宽松开源。[社区／一手] [issue 220](https://github.com/KyryloKuzyk/PrimeTween/issues/220) 是旧版 build／加载存档后极短 tween 协程问题，缺稳定最小复现，1.4.0 标记相关复用问题已修。[研究] 👀 提醒测 build 与重开，不证明当前坏或性能最好；无实测净收益不迁库 |

**Unreal 对照。** [一手] [Camera Shake](https://dev.epicgames.com/documentation/en-us/unreal-engine/camera-shakes-in-unreal-engine) 的 Single Instance 是再次触发重启，不是忽略重复命中；[UGameplayCueNotify_Burst](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/GameplayAbilities/UGameplayCueNotify_Burst) 非实例一次性，不能放 latent delay／timeline。[研究] 原生 Montage／Niagara／Audio／Force Feedback 各自管理生命周期，已用 GAS 才沿下文 PredictionKey；CustomTimeDilation 不能据此推定所有物理／音频／网络都冻结。本轮未核这些覆盖，不造 Unity 式统一暂停配方。

**[研究] AI 与人各验什么。** AI 写绑定、分档参数、身份／时钟 trace、去重和生命周期回归，先锁规则再逐通道 A/B；人验动作接触、可控性、威胁辨识与舒适性。首反馈和帧间隔必须在首次播放、密集命中、30／60／120 显示率及长帧分别看；自动检查不证明外设到发光延迟、真实音频输出或乐趣。第二次需求把单击改多段＋多目标，再加霸体／击杀，核伤害次数与反馈预算各自成立，并覆暂停、回池／重生及网络确认／拒绝／重演。具体步骤沿正文清单，不另建实验平台。

**探索回执。** 截止 2026-10-23，读开发者访谈、官方更新／API、固定 GitHub 源码与 issue、Unity Discussions、Steam、Reddit、中文机核；Wilds 官方正文仅经转引读到，未看视频，Feel 付费源码未取，候选生产采用规模与体验排名未建立。旧 Celeste／Deepnight、Factorio／NGO／GAS 证据复用如下，不计本轮新作品或实测。

**保留的运动边界。** [研究] 2D 精确动作需要才加有期限缓冲／离地宽限，容错改变可达距离和战斗窗口；3D 保一个位移负责人，先 Animator／Clip／Blend Tree，接触缺口才上 Rigging／IK。骨架、方向覆盖不足就换许可清楚资产或缩动作集合。[一手] [Unity 6.3 转场](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Transition.html)区分 Exit Time＋条件、时长单位和打断排队，不支持全关 Exit Time；[Animation Rigging 1.4 页实际 1.4.1](https://docs.unity3d.com/Packages/com.unity.animation.rigging@1.4/manual/index.html)为可选能力。

**回合等待预算（核实：2026-10-15 UTC+8）。** [研究] ✅ 先比较缩短高频反馈与可选快速播放，沿用动作完成条件和一次性结算。

- **快速路径仍等完成。** [一手] [Slay the Spire 公告正文](https://store.steampowered.com/news/posts/?appids=646570&enddate=1521157929&feed=steam_community_announcements)：2018-02-08 加 Fast Mode，02-15 加快卡片／营地／事件，02-22 修 Fast Mode＋Bite，奖励改为全部动作完成后出现；未披露竞态根因。[研究]
- **缩默认演出可不加模式。** [一手] Cogmind [2014-05-27 回复](https://www.gridsagegames.com/blog/2014/05/options-revisited/) 已加快常用弹体，大型少用武器仍慢；程序化速度影响外观。[2015 年设计说明](https://www.gridsagegames.com/blog/2015/04/cogmind-roguelike/) 继续区分弱攻击与强武器／爆炸。[研究] 按频率／重要性分等待，不将早期回复当永久拒绝倍速。
- **规则反例。** [一手] Into the Breach [v1.2.82 公告正文](https://steamcommunity.com/app/590380/allnews/)（2022-09-06）修 Fast Combat Speed 下敌人推动旧回合尸体；快速路径非天然纯视觉，根因未披露。[研究]

[研究] 三例限回合类，不外推实时／节奏游戏。Cogmind [2014-01-12 实现补记](https://www.gridsagegames.com/blog/2014/01/animation-vs-pacing-dilemma-modern-roguelikes/) 为可听结果保留间隔避免声音挤在一起；不照搬预测或自研循环。

[研究] **二改预注册**：新增击杀回血／额外效果，对照普通和快速路径的伤害、回血、死亡清理、随机消耗及奖励次数，核下一操作与声音尾部、结果辨识。若需堆规则特例或丢失关键信息，退回较短的原演出；公开说明不授予游戏代码／视听资产许可。

<a id="5"></a>

### 3. 可借用的优秀实现，以及不能带走的东西

| 来源与固定版本 | 已读的证据；采用单位 | 许可／维护／反证 |
|---|---|---|
| [NoelFB/Celeste](https://github.com/NoelFB/Celeste/tree/1b0ce45c75e05649ae91b44a8bb6b196684e4352)，最后提交 2021-08-05，仓库 2023-03-16 归档 | [一手] [Player.cs](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs)的 JumpGraceTime、角落修正、可变跳跃、DashBegin 的冻结／波纹／震动；[研究] 采用“精确动作也允许意图容错”的机制，不搬整段角色控制器 | [一手] [README](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/README.md)明确 MIT 只涵盖仓库代码，不含商业游戏及资产；发布的是部分学习源码，不是当前完整可维护模板 |
| [EXOK/Celeste64](https://github.com/EXOK/Celeste64/tree/6edfe1ebd2a21a6134d7675a28e357891025407e)，最新提交 2026-09-07 | [一手] [Player.cs](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs)的 Jump 同时设置运动、模型拉伸和声音；落地根据此前速度调整形变并发出落地事件／音效；宽限、ground snap 与显示姿态协同。可借动作到反馈的连接，3D 仍可用小规模程序化演出 | [一手] [ReadMe](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/ReadMe.md)：Source 原则上 MIT，标注例外及 FMOD 另算；Content／IP 不随代码放开商用。作者明确称约两周 jam、并非充分优化。[研究] 近期翻译提交不证明其是生产级 Unity 底座 |
| [deepnight/gamefeel](https://github.com/deepnight/gamefeel/tree/09d24aa05abe1192ad07cd3acd7270e6a5842237)，最新提交 2024-11-10，作者演示 v2 于 2024-05-01 发布 | [一手] [Options.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/Options.hx)将视觉后坐力、物理后坐力、缓冲、控制锁定等分开；[Hero.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/en/Hero.hx)把动作与反馈连接。[研究] 借逐项开关和清楚的事件绑定，而非引入 Haxe／Heaps 作为 Unity 插件 | [一手] [LICENSE](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/LICENSE)为 MIT；README 另列 Kronbits Inca tileset，不能用代码许可代替第三方资产核查。作者称学习演示而非实际游戏；未试玩，不给收益排名 |

**[一手＋研究] Deepnight 反证。** `gunAnimations` 将预备时间设为 0.33／0.06 秒；无枪械动画时爆发射击后另加 0.35 秒控制锁。`gunRecoilVisual` 改精灵偏移，`gunRecoilMovement` 改实际运动。因此全开／全关混合了规则与画面变化；这些是固定源码常量，不是推荐值。

[一手] [Game.hx](https://github.com/deepnight/gamefeel/blob/09d24aa05abe1192ad07cd3acd7270e6a5842237/src/game/Game.hx) 的 slowMo 用未缩放时间更新并计算游戏速度，须读 `stopFrame` 实际时长／倍率。[研究] Unity 输入缓存、判定、动画、粒子、相机、音频与 UI 各定时钟，`timeScale=0` 不统一暂停。

<a id="6"></a>

### 4. 作者复盘与研究能支持多强的结论

- [一手] Sébastien Bénard [GDC 2019 Dead Cells 复盘](https://media.gdcvault.com/gdc2019/presentations/Benard-Sebastian-DeepCells.pdf) 第 13 页（PDF 索引 13）为及时跳／到达辅助，16 页自由转向／自动瞄准，21 页处理挑战外细节。[研究] 只支持减少无意摩擦，不普推自瞄或统一容错；未看视频。
- [一手] Maddy 的 [Celeste & TowerFall Physics](https://www.mattmakesgames.com/articles/celeste_and_towerfall_physics/index.html)解释特定 2D 像素／平台约束下的 Actor／Solid 运动。[研究] 支持为了具体动作设计运动政策，不支持默认绕开 Unity 原生物理并自研引擎。
- [一手] [Lin 等 2022 impact-feel 论文](https://arxiv.org/abs/2208.06155) 摘要以评论训练排序、比较前八／后八游戏特征，认为顿帧、声音一致性、相机控制可能重要；仅相关分析，不定参数或因果收益。[研究]

<a id="7"></a>

### 5. 下一步验证和本轮交付边界

[研究] 完整反馈的逐通道 A/B、第二次需求与退出恢复统一沿[正文执行清单](../../domains/game-dev/04-client-modules.md#交给-ai-的执行清单先基线再加第二次需求)；运动扩展沿 P35 的单跳→冲刺→中断。仅预注册，未跑游戏；保留可复用配置与少量事件绑定是否真能减少二改成本，仍待实际工程验证。

<a id="8"></a>

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

<a id="9"></a>

## 3D 运动补研：控制精度、接触连续性与物理重量的取舍

核实：2026-10-14 UTC。以下按官方契约和固定源码深化 04 的运动选择；输入缓冲与显示插值见前节。[一手／研究]

<a id="10"></a>

### 1. 先按期望运动选，不能只按组件名字选

**[研究] 默认判断**：常规直立探索／动作角色，原生坡／阶与简单接触规则已满足需求时，✅ 原生 CharacterController 加窄运动层；已有可维护的刚体运动无需迁移。真正需要物体质量、冲量与摩擦相互作用时🧪力驱动动态 Rigidbody；需要原生接触求解但按游戏规则组织速度时🧪速度驱动动态 Rigidbody；稳定接地、任意附着／脱离或复杂台阶规则超过原生便利范围时🧪现成 kinematic motor。后两条都可能很精确，不能写成“Rigidbody 必然笨重、KCC 必然最好”。

[研究] 加速度、转向承诺、落地形变和武器时序也能塑造重量；先定义坡顶、击退、转台上的期望行为，再决定速度所有者。

[一手] Unity 6.3 LTS 的边界：

- [CharacterController 组件](https://docs.unity3d.com/6000.3/Documentation/Manual/class-CharacterController.html) 提供壁滑、坡限／阶高／Skin Width，不自动受力或推刚体，可用回调补推力；示例尺度参数非通用值。
- [Move](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController.Move.html) 受碰撞约束且不加重力；[isGrounded](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController-isGrounded.html) 是最近 Move／SimpleMove 接地结果；[velocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/CharacterController-velocity.html) 来自位移差，不含外部 Transform／父级运动，不能直接当世界速度／独立探地／平台动量。
- [Rigidbody.linearVelocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody-linearVelocity.html) 是世界速度，反对逐步覆盖以求真实物理，也给跳跃改速示例。[研究] 速度驱动可用，但须显式保留外力／接触速度，覆盖后不能期待 AddForce 持续。
- [GetPointVelocity](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.GetPointVelocity.html) 含角速度；[MovePosition](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.MovePosition.html) 是运动学按物理步移动／插值接口，不包办坡阶、接地与离台政策。[研究]

<a id="11"></a>

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

<a id="12"></a>

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

<a id="13"></a>

### 3. root motion 与混合路线：一个最终位移所有者

[一手] Unity 6.3 [OnAnimatorMove](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnAnimatorMove.html) 在动画求值后、IK 前。固定 `Standard-Assets-Characters@8f185aa3c782d824976653dd6a6476312daad241` 的 [ThirdPersonBrain.cs](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/Assets/_Standard%20Assets/Characters/Scripts/ThirdPerson/ThirdPersonBrain.cs#L458-L481) 在非 root-motion 用 FixedUpdate，否则用 OnAnimatorMove 驱 motor；[ThirdPersonMotor.cs](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/Assets/_Standard%20Assets/Characters/Scripts/ThirdPerson/ThirdPersonMotor.cs#L215-L228) 经 adapter 提交、GetMovementVector 读 deltaPosition。位移所有权互斥，未绕过碰撞。

[一手] [LICENSE.md](https://github.com/Unity-Technologies/Standard-Assets-Characters/blob/8f185aa3c782d824976653dd6a6476312daad241/LICENSE.md) 为 Unity Companion License；最后提交 2025-10-23 未证 6.3。[研究] 只借动画出期望位移、motor 限最终位移；自由移动代码定轨迹，承诺突进可用动画，但须定受阻缩距／停调动作政策。各路线均可用 root motion。

[一手] [Character Controller 1.4.5](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/index.html) 是 ECS；[SimulateDynamicBody](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/dynamic-body-interaction.html) 让 kinematic 模拟质量比例与推／被推，反驳无物理互动；[moving platforms](https://docs.unity3d.com/Packages/com.unity.charactercontroller@1.4/manual/moving-platforms.html) 区分 TrackedTransform 跟随与 PhysicsVelocity 推力信息。[研究] 非 ECS 不因官方身份迁移；与 GameObject CC／PhysX 分列。

**肢体操纵：保留身体反应，局部改控制与可达路线。** 核实：2026-10-18（UTC+8）。下列为两个独立开发团队的历史生产取舍，只限物理肢体／抓取玩法，不改变普通直立角色的默认路线。[一手／研究]

Octodad 的 [2012-10-17 作者说明](https://younghorsesgames.com/allundercontrol/)记录：旧版上楼梯时越用力越难前进，改将输入力用于向上辅助；低顶时停止强行撑直身体，同时保留笨拙操纵。[2015-03-30 技术复盘](https://www.gamedeveloper.com/programming/octodad-dadliest-catch-post-mortem-pt-4-tech)的 Octobody 节说明，软体有穿透、观感和 CPU 问题，后作改详细胶囊 ragdoll；升级 PhysX 3 后原软体也不再可用。受控脚减重、腾空撤撑起力、悬挂另调手臂，都是为特定状态改物理响应；新增约束又吃掉去软体的性能收益，需提供低细节身体。可借“局部受控端＋其余身体反应”，代价是专用状态与约束预算，不是当前 PhysX 选型或通用参数。[一手／研究]

Human Fall Flat 开发者在 [2017-10-27 回复 #9](https://steamcommunity.com/app/477160/discussions/0/3182216552780030265/)说明：为拾物、按钮和抓边等重写抓取后，墙爬也更容易；选择保留新抓取、另削弱墙爬，避免初玩绕过谜题。作者认可重玩／多人探索的不同用途，[10-31 回复 #19](https://steamcommunity.com/app/477160/discussions/0/3182216552780030265/?ctp=2)确认独立入口。同帖玩家对限制有异议，这只支持当时的玩法取舍，不证明削弱更好或现版各平台仍有该入口。[一手／社区／研究]

因此，物理肢体操纵本身是玩法时先局部修受控端／状态；接触更可靠后，再检查可达路线是否符合目标，按具体影响保留、收窄或撤回。物理响应并非目标且持续妨碍预定运动时，才沿原建议比较显式控制。以上未运行游戏、引擎或前后实现，未测维护工时与体验收益。[研究]

<a id="14"></a>

### 4. 升级、撤回与未来验收：以玩家感到的差别为准

- [研究] **保留原生 CC**：简单接触够用就不升级；平台少也可能规则复杂，贴地／旋转／动量组合先比较现成 motor。
- [研究] **保留速度驱动 Rigidbody**：接触与步态已达标，外力统一进入 momentum。新增持续质量交互、任意冲量或堆叠时，再评估力驱动／混合政策。
- [研究] **撤回过度物理化**：物理响应并非玩法目标且不停抵消摩擦／碰撞速度时，可把重量留给参数与动画；反之每次碰撞都需 kinematic 特例，也应重选。
- [研究] **升级验收**：比较坡速、坡顶腾空、窄台阶、旋转平台站位／起跳、侧挤／低顶受击及 root-motion 撞墙。人判可控与重量，不设通用坡角／snap／恢复时长。
- [研究] **二改**：旋转升降平台边缘受击；核平台、自移和击退各应用一次，起跳解除吸附，落地／重生清旧附着。牵动大量技能／相机脚本时先收拢所有权；人决定动量与恢复手感。

<a id="15"></a>

### 5. Unreal 对照：同样的动作，不同的引擎责任

核实：2026-10-14 UTC。以 UE 5.8 官方机制／API、Lyra 和 Mover 状态校正跨引擎责任；未读受限引擎源码或运行样例。[一手／研究]

**[一手／研究] ✅ 优先成熟 CMC。** [CMC 机制](https://dev.epicgames.com/documentation/en-us/unreal-engine/understanding-networked-movement-in-the-character-movement-component-for-unreal-engine)：TickComponent→PerformMovement 组织外力／重力、root motion／RMS，再进 PhysWalking/Falling；MOVE_Custom/PhysCustom 为扩展点。UE 已承担运动组织，不另造 motor；联网才补 saved moves／重演，直接 SetLocation 会被校正，单机无须预测。

**[一手／研究] 平台／root motion 沿原生语义。** [离台速度 API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UCharacterMovementComponent/GetImpartedMovementBaseVelocity) 按 bImpartBaseVelocityX/Y/Z 继承，勿叠加平台速度；[Root Motion 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/root-motion-in-unreal-engine) 由动画驱 Movement Component，Walking/Falling 的 Z 受模式／重力约束，不随意切 Flying。相应提取模式令 Animation Graph 走 Game Thread，须核预算。

**[一手／研究] RMS 不要求 GAS。** RMS 参数由 CMC 执行、handle 管移除；GAS 仅提供任务入口。[Lyra 5.8 技能实例](https://dev.epicgames.com/documentation/unreal-engine/abilities-in-lyra-in-unreal-engine?application_version=5.8) 的 GA_Hero_Dash 在力结束后仍保持 ability 禁开火／跳，GA_ADS 结束恢复速度／输入／镜头。借请求、限制与撤销，不搬全部多人依赖；突进可受击二改同时核位移源、Montage、限制及镜头。

**[一手] 版本与模块状态。** [5.8 正式发布新闻](https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available) 为 2026-06-23；[固定 5.8 Mover 页](https://dev.epicgames.com/documentation/unreal-engine/mover-in-unreal-engine?application_version=5.8) 仍 Experimental、API／属性／数据可变并继续支持 CMC。非沿用 5.7 标签，也不要求升级。

**[一手／研究] 👀 结构性缺口才评估 Mover。** [5.8 对比页](https://dev.epicgames.com/documentation/unreal-engine/comparing-mover-and-character-movement-component-in-unreal-engine?lang=en-US) 列宽形体、模块模式／回滚，CMC 已用于多个发行项目；Mover 以模拟步命令／模式／instant effects 改状态，多个 world frame 可合一 tick。非标准形体或组合需求才迁移；联网才比较时间线／校正，不随时写 velocity 或无证推荐异步后端。

**[一手／研究] 样例只借机制。** [Game Animation Sample](https://dev.epicgames.com/documentation/en-us/unreal-engine/game-animation-sample-project-in-unreal-engine) 以动画为主、traversal 为简单示例，可借 pose／trajectory／movement 连接，非完整攀爬战斗；Lyra 也非发行游戏源码。引擎／内容条款另核，未下载或接受新协议。

**[研究] 后续验收**：保留平地、坡顶、旋转平台和撞墙突进，二改平台边缘突进→受击→死亡→重生；核胶囊、网格、movement mode、平台贡献及动作限制。确需联网才加延迟／丢包的预测校正验证。

<a id="45"></a>

## 音频并发补研：保住起音不等于保住每次提示

核实：2026-10-14 UTC。主线 3；Mindustry v154 及锁定 Arc／SoLoud 的静态源码表明，04 的并发上限须拆成入口合并、同组抢占与全局竞争；提高 priority 不保证提示进入播放。[一手／研究]

<a id="46"></a>

### 1. 真实游戏的历史改动与依赖链

[一手] [Mindustry v154 发布](https://github.com/Anuken/Mindustry/releases/tag/v154)（2025-12-16，Beta）声部 32→100、每类约 6 并换声音，作者意图防单声淹没。[研究] 多项同改，不单归因限额或照抄数量。

[一手] 发布源码声明的依赖链（非发行二进制溯源）：Mindustry `d1e0307d3906bb350e80d8969a2464ed0b771ffb` 的 [gradle.properties](https://github.com/Anuken/Mindustry/blob/d1e0307d3906bb350e80d8969a2464ed0b771ffb/gradle.properties)锁 `archash=46c0956944`；Arc v154 为 `46c0956944af81db1145625e07108c196d94e260`，其 [build.gradle](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/build.gradle#L69-L72)设置 `SOLOUD_MAX_VOICE_COUNT=100`，[同文件 L144-L146](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/build.gradle#L144-L146)在本地依赖目录不存在时拉取 Anuken/soloud 的 `2025.12.01`，对应 `4b4266fed49b45afc191728b64adf1faca943f5b`。不使用当前 main 解释旧版行为。

<a id="47"></a>

### 2. 三道门控及不能省略的反例

- **入口。** [Arc Sound.java L31-L85](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/src/arc/audio/Sound.java#L31-L85) 启 checkFrame 后按同 Sound 默认 16ms 拒新实例，大音量可改上声音量／pan 再回 -1；实为毫秒非注释“同帧”，未判敌人／位置／危险，尚未进入底层优先级。[一手]
- **组。** [Audio.java](https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/src/arc/audio/Audio.java#L9-L15) 默认 6 在加载应用；[SoLoud play](https://github.com/Anuken/soloud/blob/4b4266fed49b45afc191728b64adf1faca943f5b/src/core/soloud_core_basicops.cpp#L32-L67) 未指定时每 source 独立组，非语义组。[SoundPriority.java L73-L109](https://github.com/Anuken/Mindustry/blob/d1e0307d3906bb350e80d8969a2464ed0b771ffb/core/src/mindustry/audio/SoundPriority.java#L73-L109) 才共享火焰／导弹／arc/pulsar，降修复／脚步优先级；最小可打断 `min(0.25s, 长度一半)`，部分脚步更长。[一手]
- **全局／组满不同。** [findFreeVoice_internal L309-L391](https://github.com/Anuken/soloud/blob/4b4266fed49b45afc191728b64adf1faca943f5b/src/core/soloud_core_getters.cpp#L309-L391) 全局看 priority、年龄／protected；组满只找可打断且非 protected 最老者，否则拒绝，不比 priority。“no lower volume”注释不符分支；priority 3 非 PROTECTED，仍受同组／同更高优先级路径影响。[一手]

[研究] 保护起音也可能拒绝后续重要事件。✅ 复用分组、优先级、重触发，仅补事件配置：普通同类可合并，关键警告避开提前拒绝它的入口／组；第二警告保旧还是替换由玩法定。换变体仍共享类别额度，不宣称 Mindustry 已保证任意警告。

<a id="48"></a>

### 3. Unity／Unreal 只复用相关机制

[一手] Unity 6000.3 [priority](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-priority.html) 优先虚拟化低优先级、同级看音量并留位置，数值越小越高（与 Arc 反），WebGL 不受此设；[isVirtual](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-isVirtual.html) 主声及全部 one-shots 被剔才 true，false 不证指定 one-shot 听见。[研究] 沿原生／Mixer 补类别限制，Source 状态非逐事件回执。

[一手] UE [Sound Concurrency](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-concurrency-reference-guide) 原生共享组／淘汰／Retrigger Time，多组全满足；重触发拒绝无视虚拟化。[研究] 先配原生、明确警告限制，虚拟化不是被拒提示待播队列；其他责任见 WP6。

<a id="49"></a>

### 4. 最小采用与未来验收

[研究] 沿现有音频入口，由 AI 查事件／类别／重要性及拒绝原因，人决定合并／打断。未来连发中插警告，再加变体与第二警告，分别核提交、合并／拒绝／抢占、虚拟化及实际起音／方向／时效；过期不补播。记录 voice／CPU，调用成功不代验听见。

[研究] SoLoud 通用文档不替代此 fork；其他音频责任见 WP6。

<a id="50"></a>

### 5. 持续状态声的反例：先校正可听范围与恢复政策

核实：2026-10-15 UTC+8。以下持续声反例收窄短事件限额建议，依据开发者报告、固定配置与引擎文档。[研究]

**持续声反证。** [Factorio FFF-341](https://www.factorio.com/blog/post/fff-341)（2020-04-03）环境上限 15→50 缓解雷达断声却更拥挤；管道无水仍有声，作者归于 working_sound／同类限额冲突，去限并缩范围后自报改善，非所有循环应无限。[一手／研究]

[一手] 2.1.21 固定 `374934f81f82b09ec9fc459f92a316bd642ddd82` 的 [sounds.pipe](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/base/prototypes/entity/sounds.lua#L248-L272) 管道 persistent／渐变／平滑／活动率，门短声 aggregation，车轮持续仍限；[WorkingSound 当前文档](https://lua-api.factorio.com/latest/types/WorkingSound.html)（2.1.21）persistent 合同 prototype 并忽略同类上限。[研究] 按语义选，非短限／长不限，现代配置非 2020 原修复。[用途声明](https://github.com/wube/factorio-data/blob/374934f81f82b09ec9fc459f92a316bd642ddd82/README.md) 供 mod 查定义，不开放引擎／音频。

**原生差别。** [一手] Unity 6000.3 [maxDistance](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-maxDistance.html)：Linear 边界零、Custom 保末值、Logarithmic 忽略该值继续衰减；缩 maxDistance 非通用回收。[priority 虚拟化](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-priority.html) 虚拟化留位置／状态。UE 5.8 [attenuation](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-attenuation-in-unreal-engine) falloff 从内形边缘算，衰减／声像分开；[EVirtualizationMode](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/EVirtualizationMode) Restart 从头、PlayWhenSilent 占 voice、SeekRestart Experimental。其余见 [WP6 引擎对照](2026-10-14-game-wp6-audio.md#105-unityunreal同一质量目标不同原生职责)。

[研究] 短事件过期可丢，持续声按当前活动恢复；先调范围、曲线、渐变与恢复，成本为逐类／复合听验。仅不承担独立定位的环境层可合并；危险声不为省 voice 随意缩范围。

[研究] **二改预注册：**新增持续技能／机器声，在竞争前后跨可听边界并切活动状态；核警告、误重启／残留与结束后假起音，再记 voice／CPU。藏预警或制造假事件则撤回。

<a id="51"></a>

### 6. 警报已听清却判断错：先改触发语义

核实：2026-10-17 UTC+8；主线三。补充04的症状选择：已经听得清却误导行动时，修事件触发／提示含义；只降音量或重报频率不能修正语义。OpenRA的撤回与Factorio的提前救援反例支持窄条件，不推广成所有声音都应少播。[研究]

- **少播仍然报错。** [OpenRA #7787](https://github.com/OpenRA/OpenRA/issues/7787)（2015-03-29）报告己方侦察敌基地也播“敌军正在接近”；维护者确认实际触发是敌军进入视野，主动侦察与敌军来袭不等价。[#7799](https://github.com/OpenRA/OpenRA/pull/7799)试将同一敌方玩家的单位合并通报，但作者在[关闭说明](https://github.com/OpenRA/OpenRA/pull/7799#issuecomment-89345192)明确少播仍未解决侦察误报；该PR未合入，不能写成已发布改进。[一手／社区]
- **撤掉通用播报，保留有明确用途的发现。** [#7841](https://github.com/OpenRA/OpenRA/pull/7841)于2015-04-04合入，撤去Red Alert与Dune 2000普通单位的AnnounceOnSeen。可访问的PR最终head `fd143a5eb05c8a3e1032c5cfa698c72827fb4fe1`中，[arrakis.yaml](https://github.com/OpenRA/OpenRA/blob/fd143a5eb05c8a3e1032c5cfa698c72827fb4fe1/mods/d2k/rules/arrakis.yaml#L52-L57)仍给沙虫配置WormSign及雷达提示，[D2k player.yaml](https://github.com/OpenRA/OpenRA/blob/fd143a5eb05c8a3e1032c5cfa698c72827fb4fe1/mods/d2k/rules/player.yaml)保留EnemyWatcher。这是当时配置与历史撤回，不断言当前版本仍相同。[一手]
- **更少预警也可能太迟。** Factorio 0.13的[原帖](https://forums.factorio.com/viewtopic.php?t=27255)中，玩家KatherineOfSky报告只在设施被毁后听到警报，早期分散建设需要在受击时介入；5thHorseman则指出后期自动防御能使重复受击告警烦扰。同帖开发者Rseding91确认不是bug，未评价这项取舍是否适合该玩家。[社区／一手：开发者回复] 这支持按是否仍需人工介入保留预警，不能把某玩家需求当所有阶段默认，也不从该帖推断后续版本政策。

[研究] ✅ **本次针对提示已可闻却误导行动的情况，先改触发／提示含义。** 先使“发现”“来袭”等提示与实际检测条件一致；若只代表发现，就改提示或局部撤掉，别靠全局冷却掩盖。承担抢救窗口的受击预警不能被“已损失”的结果通知替代；同一危险的重复通知是否合并，另核新地点／新危险是否仍需行动。未进入播放的漏声仍按前述门控排查，被遮住的声音仍先改混音。

[研究] 静读公开讨论、PR与固定配置，未运行游戏或音频实验；不复制音声资产或移植实现。后续对照应同时覆盖主动侦察、真正来袭、已能自动处理的持续受击与需要人工救援的新威胁，记录玩家能否及时判断下一步；本次不新增实测授权。

<a id="52"></a>

## 运动可读性补研：关键提示不能靠历史积累补成另一个位置

核实：2026-10-14 UTC。主线二／三；补 04 的运动可读性：时域历史可能造成提示错位、残留和显露延迟，抗锯齿／上采样须在完整动作中验收；依据为官方文档、固定源码及历史 issue。[一手／研究]

<a id="53"></a>

### 1. 先区分输入错误、支持边界与积累取舍

- **支持边界。** [一手] [URP 6.3 motion vectors](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors.html)仅支持 opaque／alpha-clipped，不支持透明材质对象矢量；对象矢量还要求 shader pass、renderer 与对象／材质状态满足条件。ForceNoMotion 仍需对象 pass 覆盖相机矢量为零，不能视为省掉 pass 的捷径。[研究] 透明预告与余烟不能统一交给一个“打开运动矢量”修复。
- **相机相对运动。** [一手] [6.3 troubleshooting](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors-troubleshooting.html)说明跟随移动对象的相机若只用 camera motion，会给对象错误的大矢量；先查 Per Object Motion 与 Frame Debugger 的 MotionVectors pass。[研究] 屏幕位置近似不动，不代表世界空间对象无需矢量。
- **形变输入。** [一手] [6.3 Shader Graph 支持](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/features/motion-vectors-shader-support.html)的 Time-Based 会以今／前帧 Time 运行顶点子图，其他用户参数须逐帧不变；运行时改变技能强度等参数时，不能假定此模式自动正确。Custom 可提供前帧到当前的局部空间位移；Alembic 选项用于相应缓存与 PlayableDirector，普通 MeshRenderer 错开会读错流。[研究] AI 可核对动画参数变化来源与历史值归属，不能批量开启所有选项代替诊断。

<a id="54"></a>

### 2. 固定实现：不能抄反参数方向，也不能把最高档当辨识保证

[一手] 公开 `6000.3/staging` 解析为提交 `2d2e78cc9d6254bc6e7c9c5552cea053508e86cb`（2026-07-01）。固定快照不证明某个 Editor 补丁已含相同代码；部署时仍核锁定包／Editor。

- [TemporalAA.cs](https://github.com/Unity-Technologies/Graphics/blob/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb/Packages/com.unity.render-pipelines.universal/Runtime/TemporalAA.cs)：`baseBlendFactor` 表示历史贡献，getter／setter 与内部 `m_FrameInfluence` 通过 `1-x` 转换；后者是当前帧贡献。两参数方向相反，不能互抄。
- 同文件的 `varianceClampScale` 说明较低值减少拖影但增加闪烁；`VeryLow` 不做 motion dilation，注释适用于无／低运动；`VeryHigh` 启用更多过滤。这些处理路径和成本取舍不证明哪档在本项目中最清楚。
- [TemporalAA.hlsl](https://github.com/Unity-Technologies/Graphics/blob/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb/Packages/com.unity.render-pipelines.universal/Shaders/PostProcessing/TemporalAA.hlsl)的 `DoTemporalAA` 采历史颜色、裁剪，再把 `frameInfluence` 传给 `ApplyHistoryColorLerp`；后者由历史色向当前色插值。已核对执行表达式。

[一手] [6.3 AA 文档](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/anti-aliasing.html)承认快速高反差物体可能产生 TAA 拖影；该版本 TAA 与 MSAA、Camera Stacking、Dynamic Resolution 不兼容。MSAA 主要解决几何边缘，不修 specular／texture aliasing。[研究] 运动矢量只是诊断的一项，修正不保证消除拖尾；不为透明提示默认增加相机栈。

<a id="55"></a>

### 3. 可比较方案与撤回条件

| 路线 | 采用条件与具体改变 | 撤回／不适用条件 |
|---|---|---|
| ✅ 修正原生运动输入，保留时域路线 | 不透明角色／武器／形变对象矢量缺失或错误时，先核 pass、前后帧位姿和参数，再调滤波 | 透明支持受限或矢量正确仍有残影时，停止盲加开关；单人不默认重写通用 shader |
| 🧪 减少历史积累或收紧颜色约束 | 场景确实需要时域稳定性，但短暂关键提示残留／移动糊掉；小步改变历史贡献与 clamp，保留原值 | 闪烁／边缘爬动更妨碍判断时撤回；锐化不保证恢复错位历史中的真实提示 |
| 🧪 非时域基线 | 相同分辨率比较 SMAA／FXAA；以几何轮廓为主且路径兼容时比较 MSAA，保住原动作规则 | 高光／纹理闪烁、细小轮廓丢失或预算失败就撤回；不得从“没有历史拖影”推导“所有画面问题解决” |
| ✅ 收窄内容频率与透明装饰职责 | 危险边界／方向采用足够屏幕尺寸的稳定形状，与余烟分开；风格允许时让关键轮廓由简单 opaque／alpha-clipped 几何承载 | 硬边、覆盖面积或遮挡改变范围理解就撤回；不把全部烟雾改 cutout，不通过任意延长预告时间偷偷改玩法 |

[研究] 最低内部分辨率难以稳定采样关键形状时，比较简化细节、增显示尺寸或输入分辨率；上采样不保证补出短暂细节，不给通用像素阈值。

<a id="56"></a>

### 4. STP 对照不能只看相机菜单

[一手] [URP 6.3 STP](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/stp/stp-upscaler.html)要求 TAA 预处理，会隐式启用；需要 Shader Model 5.0，不支持 OpenGL ES。[研究] 非时域对照同时核 Upscaling Filter／render scale，不能只改相机 AA 标签；STP 仍需正确运动输入。

[一手] [6.3 STP Debug Views](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/stp/stp-debug-views.html)提供输入运动、重投影色差及 Sensitivity；绿色包含无法预测的快速运动、新显露区域或错误矢量，红色标示排除时域预测的像素。[研究] 用原生视图定位，再以实际动作判断可读性；调试色不是评分，也不证明透明效果无拖影。

<a id="57"></a>

### 5. 历史反例：实际修复与当前限制分开

- **UUM-72748：可见集合错误确实需要修复。** [一手] [官方 issue](https://issuetracker.unity.com/issues/14144/motion-vectors-for-an-object-are-included-in-the-urp-motion-vector-pass-when-the-objects-layer-mask-is-filtered-out)记录被 layer mask 排除的对象仍进入 URP Motion Vector pass，移动时出现幽灵立方体；2022.3.30f1、6000.0.4f1 可复现，标注修复于 2022.3.37f1、6000.0.8f1，只测 Windows 11。[研究] 这是历史上的颜色／矢量集合不一致，不是 6.3 普遍缺陷；旧工程先核补丁，不用滤波掩盖。
- **UUM-26709：较高档位也曾触发专有故障。** [一手] [官方 issue](https://issuetracker.unity.com/issues/6004/temporal-anti-aliasing-taa-produces-severe-artifacting-when-quality-set-to-very-high)记录 URP 14.0.4–16.0.0 的特定 Timeline scrubbing 场景，High 正常、Very High 黑白伪影；页面对相关分支标 Fixed，但未给精确修复补丁。[研究] 升级／换档须验证实际动作；该历史问题不足以禁用当前 Very High，也无精确修复版可引。

<a id="58"></a>

### 6. 后续获准验证与二次修改

[研究] 固定规则／相机，分开比较分辨率／render scale、时域路线及内容简化。验出现、急转、显露、停止／消失、双攻击及低帧率；二改 Time 形变为技能参数驱动或加透明余烟，再核矢量和边界。AI 构造对照，人判误读，连续观察配帧时间。

<a id="59"></a>

## 像素网格补研：低速步进不是物理插值失效

核实：2026-10-14 UTC；主线一／三。像素抖动先区分世界、低分辨率场景和最终输出取整；依据两作者原型／演示及 Unity 6.3 URP／Cinemachine 3.1.7。[一手／研究]

<a id="60"></a>

### 1. 两位作者的方案为什么不能互相代替

[一手：作者实述] Slow Rush [2024-01-26 复盘](https://www.slowrush.dev/news/pixel-perfect-rendering/)：吸附相机改善纹理／背景摇摆却让其他画面跳，对象也吸附仍失败；sub-texel scrolling 只顺画布，内部慢物体仍逐格。为摩擦停稳、弧顶／旋转而接受过滤；仍为矩形代理、真精灵未接、性能未测，Noita/Broforce 比较未独立核。

[一手] Daniel Ludwig `code-disaster/gdx-mellow-demo@901d2bcae3819807e54814a4a34d3c72d1236f68`（2016-02-07）：[MellowGame.java L297–368](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/core/src/com/codedisaster/mellow/MellowGame.java#L297-L368) 按 WORLD_UNIT_SCALE 取整 scene camera，余量给放大输出 offset；UpScaleAndBilinearFilterShader 再拆小数，[fragment shader](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/core/assets/shaders/mellow.fsh) 四采样加权。对象为 tilemap，未证明独立角色慢动平滑。

[研究] 只借低分辨率／输出分工；demo 写死尺寸／倍率、运动含逐帧项，不作底座。[一手] [LICENSE](https://github.com/code-disaster/gdx-mellow-demo/blob/901d2bcae3819807e54814a4a34d3c72d1236f68/LICENSE) MIT，外部 tileset 另署名未清资产权；博客未读到，机制来自下载固定源码，未构建。

<a id="61"></a>

### 2. Unity 原生能力：能对齐像素，不替玩家决定取舍

[一手] Unity 6.3 [URP Pixel Perfect Camera](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/2d-pixelperfect-ref.html) 已内置 Universal 2D，不另装 Built-In 包；Pixel Snapping 仅渲染、不改 Transform，Upscale Render Texture 画参考或按视口放大的临时纹理。Point/Retro AA 仅 Crop Frame=Stretch Fill，前者清楚可闪、后者软边减闪，非慢对象通用修复。

[一手] [Cinemachine 3.1.7 Pixel Perfect 扩展](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachinePixelPerfect.html) 协调 orthographic size，blend 中暂非 pixel-perfect；Upscale Render Texture 可用尺寸少、会偏构图。Target Group 限制仍称 Framing Transposer，不当当前 Position Composer 已验缺陷。

[研究] ✅ 整格风格用原生并接受／验慢速步进；🧪 连续运动更重要才比较分辨率与过滤。阻尼／插值不消除最终量化，不为显示改碰撞或拾取；这些 Unity 配置不映射为 UE 等价菜单。

<a id="62"></a>

### 3. 后续验证与撤回条件

[研究] 同美术／动作比较严格网格、增分辨率与有界过滤，观察慢角色、跟随、平台停转及视差；二改窗口／缩放后核边缘、危险提示、鼠标对齐与构图。尺寸不一、危险模糊、成本显著或风格偏离就收窄／撤回。

[研究] 本节另未运行 shader。


<a id="63"></a>

## 信号取舍补研：呈现设置保住玩法信息，辅助规则另有承诺

核实：2026-10-14 UTC；布局于 10-17、远端入口于 10-18（UTC+8）补核。主线一／三；改变 04：先改表达再缩规则；按监看、局部命令、连续编辑选入口。证据为下列作者生产说明、手册及固定源码，未测体验收益。[研究]

<a id="64"></a>

### 不同类型的一手证据与边界

- **回合策略。** [一手] Matthew Davis [Into the Breach Design Postmortem，2019](https://media.gdcvault.com/gdc2019/presentations/Into%20the%20Breach%20Postmortem%20Final.pdf)，PDF 14、31–36：确定性／预告要求交代目标／类型，遂限三类攻击、正交方向、稳定属性并裁武器。仅 PDF 文字；表达可约束设计，不证明即时全预告或三类必好玩。
- **Dead Cells 29。** [一手] [29 系列](https://deadcells.com/patchnotes/29)：29.1 配色覆盖 HUD／菜单／图标／武器／物品，属性不只用颜色名，另有全图揭示；29.2 修重要资产被背景滤镜遮。辅助按自身承诺核，不要求保持标准未知信息／难度。[研究]
- **Dead Cells 35。** [一手] [35 系列](https://dead-cells.com/patchnotes/35) 未单标小版本项修隐形仍有轮廓，35.7 修弹体漏轮廓；多显／漏显都有风险。页含 alpha/beta，不作同日全平台发行或当前缺陷。

<a id="65"></a>

### 常显与按需查询：补回正文遗漏的条件

- **低频查询保入口。** Cogmind [2022 作者实作](https://www.gridsagegames.com/blog/2022/03/special-commands-menu-design/) 将低频命令集中到 Space 菜单，保快捷键；地图尺可从菜单开启、Space 关闭，未添常驻按钮以免占位。[Beta 11 发布](https://store.steampowered.com/news/posts/?appids=722730&enddate=1650631665&feed=steam_community_announcements)确认菜单可用。[一手] 不把即时威胁藏进低频入口。[研究]
- **高频并列也会挤占常用项。** Factorio [FFF363](https://www.factorio.com/blog/post/fff-363) 因嵌套制作分类打断操作，将平铺改默认；[1.1.0 发布](https://forums.factorio.com/91657)确认。[一手] [发行后原帖](https://forums.factorio.com/viewtopic.php?start=100&t=91657#p522402)中 KatherineOfSky 称物流低频，平铺隔开常用库存／制作而关闭，Serenity 认同。[社区] 频繁一起用的放近，低频可发现地展开；作者频率不能代表所有玩家。[研究]

### 放大 UI：保信息与连续操作

核实：2026-10-23 UTC。[研究] 本节接上方常显／查询选择：**只需大字时，先在既有组件内分开文字与装饰缩放、重排；空间仍不足，再用带摘要和操作补偿的半模态。** 当前最高水平未知，以下为作者实现说明，未试用，不证明统一放大、重排或模态哪种普遍更好。

- **近期候选：先重排，不先藏信息。** [一手：作者自述] Mytheria [2026-10-08 制作记录](https://cobomakesgames.com/blog/game-ui-text-size/)将文字放大与多数画框分开，较大档重排库存列，少数标签另设上限，并逐屏检查尺寸。游戏未发行；作者自己区分字号与实际字形高度，不据字号表认证掌机可读性。[研究] 借重排机制，不照搬比例／上限，也不把未发行展示当玩家验证。
- **旧生产案例：折叠须补信息与动作。** [一手] Cogmind [2024-02-23 作者实现](https://www.gridsagegames.com/blog/2024/02/full-ui-upscaling-part-5-completion-and-demos/)在半模态库存入口保容量／新物提示，拖动自动展开并接续键盘操作；完整模态换回地图空间，当时暴露日志遮战斗、教程漏看，旧布局仍可选。菜单适配也是大量工作，不只是改字号。[研究] 此例早于近两年窗口，仅支持可借机制，不作当前领先证明。

**Unity 落地先锁版本。** [一手] [uGUI 2.6 的 Layout Element](https://docs.unity.cn/Packages/com.unity.ugui@2.6/manual/script-LayoutElement.html)已列 Max Width/Height，但 [UUM-144431](https://issuetracker.unity.com/issues/5183/layout-elements-min-width-can-be-set-bigger-that-max-width-which-breaks-the-max-width)明确 6000.3.15f1 等旧版没有该字段；6000.6.0a7 的 Min 大于 Max 可破坏约束，核实时仍 Open、仅测 macOS。[研究] 已有支持版先验原生上限／换行；旧版只有局部缺口，不为一个面板升级引擎或迁框架，参数冲突也不靠自动缩字掩盖。

**开源替代只补布局缺口。** [一手：固定源码] [uLayout 1.8.1／965c44a](https://github.com/pokeblokdude/uLayout/tree/965c44ae8a26e9e062e5d0d35b583ce4f6d2a05b)（2026-10-22，MIT）保留 uGUI，提供内容测量、Grow 与控件分行；[LayoutText](https://github.com/pokeblokdude/uLayout/blob/965c44ae8a26e9e062e5d0d35b583ce4f6d2a05b/Runtime/Scripts/LayoutText.cs#L37-L91)订阅 TMP dirty、测内容尺寸；[变更记录](https://github.com/pokeblokdude/uLayout/blob/965c44ae8a26e9e062e5d0d35b583ce4f6d2a05b/CHANGELOG.md)显示1.8改事件驱动，不能沿用旧轮询成本断言。[研究] 👀 仅多处 flex／wrap 确有维护缺口才比较，原生够用就不加层。其 max 后再 min 的顺序不能保证冲突参数仍守上限，控件分行也不包文字溢出；不负责摘要／焦点，发行采用与收益未知，未安装运行。

[一手] Unity 官方 [LetterSpell 固定示例](https://github.com/Unity-Technologies/a11y-public-sample/blob/ec14cfcb8c10bafab83ea02cd17759d77b225fae/README.md)明示 display size slider 未实现，不能当完成的缩放方案；许可为 Unity Companion，非任意引擎通用底座。[研究] 可借其输入／无障碍映射，不为本需求整套引入。

[社区] [2025-10 本地化操作提示实作](https://discussions.unity.com/t/psa-max-width-workaround-for-layout-in-ugui/1690844)因嵌套横向布局不能直接用 ContentSizeFitter，做子项尺寸上限及变动标脏；旧补法不应无条件复制到新版。[2025-12 至 2026-05 模拟器讨论](https://discussions.unity.com/t/wrong-constant-physical-size-using-device-simulator-on-uitk/1698654)有两位开发者报告 UITK 物理尺寸在模拟器与设备不同，含6.3.9f1；尚非普遍缺陷结论。[研究] 局部约束仍有更新成本，编辑器尺寸预览不替真实设备观察。

[一手] [Steam Deck 显示要求](https://partner.steamgames.com/doc/steamhardware/compat)按 1280×800、约30厘米观察，要求最小屏幕字形高度9px并推荐12px。[研究] 字号／布局探针只能筛问题，不能把字号表当字形或真机可读性验收。

[一手] [Beta 13 发布及后续补丁](https://store.steampowered.com/news/posts/?appgroupname=Cogmind&appids=722730&enddate=1710735641&feed=steam_community_announcements)说明布局设置需重启，240229／240304已将部分原日志信息补到黑客终端，不能把2月文章的遗漏当作当前未修缺陷；当前[Beta17.1手册](https://www.gridsagegames.com/cogmind/manual.txt)仍列三种布局、重启生效与可展开的战斗日志历史。[研究] 借的是降级后补信息路径的过程，不要求现成项目新增实时换布局。

[研究] **采用与撤回：** 不可隐藏的信息由本游戏决策时点确定，不照抄别人的常驻列表；收起面板必须补状态摘要、发现入口和当前输入设备的连续操作。优先复用布局／组件，新增自动展开需处理拖动结束和返回焦点；信息看不全或操作频繁中断就回退常驻／半模态。远端操作沿用下方 [#66](#66)，不把折叠当迁移到新界面的理由。

[研究] **二改只预注册：** 新增长物品名／第二类提示，再用同一查看、拖放或键盘连续操作、返回任务比较普通／大字档；核折叠前后摘要更新、教程／危险提示及原布局；档位切换按项目承诺，实时切换保当前操作，需重启则说明并验重进。既有信号与玩法设置沿用 [#67–68](#67)，不另建通用验收；本轮未运行 AI、引擎或游戏。

探索回执（2026-10-23 UTC）：已读两游戏作者、Unity 文档／issue／Discussions、固定开源和 Steam 要求；中文检索含 indienova，未找到近期同题实作，视觉篇及谈话会正文403未读、不绕过。当前最高水平、真实设备与 AI 二改收益仍未知；不提高整格等级。[研究]

<a id="66"></a>

### 远端界面：监看、局部命令与连续编辑

- **连续编辑与看一眼不同。** Factorio [FFF380](https://www.factorio.com/blog/post/fff-380) 作者试玩后将跨地点选择融入可操作 Remote View；即时旋转还简化当前／未来方向双状态逻辑，实物仍经机器人交付。[FFF423](https://www.factorio.com/blog/post/fff-423) 随后为仅查研究／警报补摘要和悬停摄像，避免丢失当前上下文。[一手] 是生产取舍，未量化收益。
- **操作未必先移镜。** Zero-K 项目 [Interface 手册](https://zero-k.info/mediawiki/Interface) 第 4／7 项分别给出小地图下令与消息跳转；所读普通页声明修订 9822。固定头 `e358dac2`（2026-10-16）的[589–600 行](https://github.com/ZeroK-RTS/Zero-K/blob/e358dac2ca2f9163c5290f700d74466016305b04/LuaUI/Widgets/gui_chili_minimap.lua#L589-L600)提供三种左键政策；[1002–1036 行](https://github.com/ZeroK-RTS/Zero-K/blob/e358dac2ca2f9163c5290f700d74466016305b04/LuaUI/Widgets/gui_chili_minimap.lua#L1002-L1036)只在无活动命令时进入移镜处理。[一手] 本轮未审完整引擎命令链，不将手册当实测。
- **采用与成本。** [研究] 监看先保上下文；目标明确的局部命令可留概览；辨不清目标／需连续编辑才进细节。保命令、选中、移镜含义，物品与到访规则另定。误选就收窄概览操作，反复切换才扩大；三入口可组合，不是升级阶梯。跨两类游戏仅支持条件选择，无工时／乐趣优劣证明。

<a id="67"></a>

### 采用、删减与不能外推的部分

[研究] ✅ 信号的对象／时点／范围／结果共享玩法状态，预览随局面更新；🧪 先减装饰，仍读不清才减组合。唯一节奏／方向线索补等义提示或明确辅助规则；声转视觉不默认增加精确坐标、透墙／提前预告，未实测字幕能替代空间听觉。⛔ 滤镜／描边／图标数量不作完成标准，也不必先建无障碍框架；无跨类型通用排序或点击数阈值。

<a id="68"></a>

### 第二次修改：仅预注册，不运行游戏

[研究] 在已有遭遇中新增远程弹体／状态，不另造脱离实际玩法的展示台，与旧敌人混用；在实际提供的默认、静音、减粒子、改色／轮廓设置下核危险源、时点、范围和结果；只记录可见／可听信息，不以效果组件已启用代替辨识。隐形／未发现对象随规则显隐，全图等辅助按新承诺验，切回再核旧状态。第二种颜色／状态覆盖场景、HUD、物品说明与旧内容；持续挤占提示则减组合／重做表达，再决定保留招式。

有远端界面时，新增地点／命令后核监看、下令、切回、常用信息位置与误选；活动命令不被误作移镜，概览不足辨认就进入细节。[研究]

**验证范围：** 一手正文／PDF 文字、手册与所链固定源码；未运行游戏或色觉／听觉测试。AI 查映射，人判节奏、可读性及辅助承诺。[研究]

<a id="69"></a>

## 空间容错补研：动作已开始却卡在边角

核实：2026-10-15 UTC；主线一／三。动作已接受却卡微小边角时，比较碰撞表达与局部纠偏；时间缓冲、坡阶、量化与足锁不代替此选择。[研究]

<a id="70"></a>

### 两种玩法的作者证据：局部补偿不是统一缩小碰撞体

- **Factorio。** [一手] [FFF346（2020-05-08）](https://www.factorio.com/blog/post/fff-346)：岸线旧矩形像无形墙，改按玩家位置／过渡形状通行，敌人可不同；后加玩家参数，造地安全检查仍整包围盒，误判合法站位落水。作者称旧修缺测试、早期记忆可能不准。[研究] 同角色各调用统一政策，非所有实体同规则，非当前源码审计。
- **Celeste。** [一手] [Celeste & Forgiveness](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html) 分上升顶角侧挪、水平冲刺上缘、半实心上推，与时间缓冲并列。[研究] 按动作容小误差，非全动作／统一像素或受控收益。

<a id="71"></a>

### 固定实现与后续修订：没有墙，不等于可安全纠偏

[一手：源码静读] `NoelFB/Celeste@1b0ce45c75e05649ae91b44a8bb6b196684e4352`：

- [Player.cs L2399–2422](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs#L2399-L2422)的水平碰撞纠偏限于 Dash／RedDash 及纯水平速度分支，按有限偏移距离试上下位置，无 Solid 后调用 `MoveVExact`／`MoveHExact`；着地可蹲下分支优先。
- [L2582–2613](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/Source/Player/Player.cs#L2582-L2613)的上升顶角修正按水平速度符号选择左右，找到无 Solid 点后直接改位置。[研究] 两条应用路径也不同，不能从字段名抽成一个通用“纠偏半径”；本轮只审公开 Player 类，不声称审完商用游戏全部碰撞回调。

[一手] [V1.4.0.0 changelog](https://www.celestegame.com/changelog.html) 后补刺顶冲刺角／单向平台不修、用 hurtbox、禁向刺地下修，固定旧树缺这些条件。[研究] 借有限／状态搜索，勿照搬旧版；核路径、落点、危险／通行，各类顶角不一定同条件。

[一手] 同 SHA [README](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/README.md)／[MIT LICENSE](https://github.com/NoelFB/Celeste/blob/1b0ce45c75e05649ae91b44a8bb6b196684e4352/LICENSE) MIT 仅代码，非游戏／资产；只借片段，不作 Unity/UE 即用控制器，作者网页不授权商业资产。

<a id="72"></a>

### 代价与另一个作者的维护反例

[一手] [FFF344（2020-04-24）](https://www.factorio.com/blog/post/fff-344)：mod 单位启地形过渡后，抽象寻路未支持而崩溃，先退后补；敌人还涉及防御策略与计算，约5%仅历史粗测。[研究] 维护涵盖实体与世界修改调用，不只碰撞循环。

[一手] [Mina the Hollower 更新页](https://www.yachtclubgames.com/blog/mina-the-hollower-update-notes/) 页头 2026-06-26；1.0.5 缩 Spark 排出框、排除箱／雪球／可动可破坏物；1.0.6 修钓竿跳落 speed bump 卡墙排出并调位置偏好。小版本无各自日期，不共用页头作发布日期。

[研究] Spark 不是玩家；重叠排出也不同于 Celeste 动作容错。本例只说明对象、动作与位置偏好仍需维护，不作算法排名。

<a id="73"></a>

### 最小采用、撤回与第二次修改

[研究] ✅ 轮廓误导先改碰撞／关卡；🧪 有意宽容微小误差才沿运动所有者补有限、状态限定纠偏。精确卡位本是挑战则保留；穿错路线、入险或豁免增多就收窄／改空间，不一律扩大搜索或缩身体。

[研究] 二改择一：危险移动平台或可放置地形。对照原规则、空间修正、局部纠偏，在相同接受时刻核位置、分支、危险与所选路线；回查旧角、两侧通路、单向／动态障碍、重开／放置位置。敌我按各自政策。

[研究] AI 追移动／放置／脱困分支并备同输入回归，人定容错和风险；后续记录维护成本，有限查询未必比改关卡省。

**实际范围：** 静读原文／补丁／固定源码与许可；另未看嵌入视频或测最佳偏移，不给双引擎伪等价配置。

<a id="74"></a>

## 听点补比：镜头改变时从哪里听

核实：2026-10-15 UTC。[研究] 补世界声听点选择，与可听范围／恢复、选曲和相机取景分开。

<a id="75"></a>

### 视口与角色附近都有成立的条件

| 依据与证据等级 | 可改变的选择 | 反例与边界 |
|---|---|---|
| [一手] Factorio 作者在 [FFF-332](https://www.factorio.com/blog/post/fff-332)（2020-01-31）说明默认听点移到屏幕中心，便于地图视图，并调整缩放／衰减 | [研究] 管理／远程操作可先让当前操作视图有声音 | 身体附近声音可能变远，故不作近身动作默认，也不由旧文推当前全部参数 |
| [一手] NieR:Automata 开发者在[声学说明 Part 2](https://www.platinumgames.com/official-blog/article/10027)（2019-01-18）说明，多种视角下默认把听点放在角色附近；舞台等场景另改听点，并对交接作插值 | [研究] 镜头经常拉远／换视角而交互仍围绕身体时，可先保持近身声音稳定；远处演出再局部交接 | 这是非独立游戏对“听点必随相机”的反证，远处展示仍可例外；单人不复制其 Wwise 工程、预设或制作规模 |

[一手] [2.1.21 更新](https://forums.factorio.com/viewtopic.php?p=705355)（2026-10-06）修退出 remote view 过强多普勒，未公开算法／未核发行通道，不称速度归零。[研究] 切镜／传送勿意外变听者高速，有意音高仍按玩法。

<a id="76"></a>

### 固定源码：位置、朝向、速度是不同输入

[一手] Overgrowth 固定提交 `245fe4828631c84c0023d29d1525f5716ccb6106` 提供另一种 3D 动作实现：

- [玩家镜头脚本](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L11179-L11188)在 focused_character 分支把相机位置、朝向／上方向和零听者速度传给 `UpdateListener`；[Camera::GetPos](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Graphics/camera.cpp#L153-L155)包含追踪距离偏移，不能把它当角色中心
- [对白镜头](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/dialogue.as#L1180-L1189)取得控制时同样传零听者速度；[自由镜头](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/cam.as#L317)却传入 `vel`，并非所有模式都归零
- [脚本转发](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Scripting/angelscript/asfuncs.cpp#L1953-L1955)及同文件 L2069 的注册通向[音频接口](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Source/Sound/sound.cpp#L116-L120)，分别设置 listener position、velocity、orientation

[研究] 按模式明确位置／朝向／速度；源码未说明全部意图。零听者速度不归零声源速度或全关多普勒；“角色位置＋相机朝向”也不等于相机位置算方向。

[一手] [README](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/README.md)／[LICENSE](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/LICENSE)：代码除例外 Apache-2.0，游戏美术／关卡不开放，资产分发需书面许可。[研究] 只借机制；实际复制另核文件／依赖并保通知。

<a id="77"></a>

### 原生入口够先选听点，不保证跨引擎分离声像和衰减

- [一手] Unity 6.3 [AudioListener](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioListener.html)默认在主相机，官方也建议按游戏尝试相机或角色；场景只应有一个正常工作的 listener，混响区亦以听者位置影响听到的声音。[研究] 先移动／定向单一听点，不以双 listener 过渡；文档未承诺分别设置衰减与声像原点
- [一手] UE 的 [SetAudioListenerOverride](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Game/Audio/SetAudioListenerOverride)可通过 PlayerController 覆盖位置／朝向；附着组件时参数是偏移，否则是绝对值。[研究] 特殊视图进入／退出均须交接，避免后续继承旧位置
- [一手] UE 另暴露 [Set Audio Listener Attenuation Override](https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/Game/Audio/SetAudioListenerAttenuationOverr-)。[研究] 节点页说明有限，不能证明遮挡、混响和距离消费者均沿此覆盖，也不能给 Unity 编造等价接口；确有需求才分离

<a id="78"></a>

### 成本、撤回与第二次修改

[研究] 改听点须回查衰减／空间效果，不靠全体 2D 或增益补坐标。blend 可能穿无关区域，cut 可能突变；近身失衡则回角色附近，远程缺反馈才局部交接。

[研究] 二改加远程观察／演出，固定近远声源，验拉远、转身、切镜、退出及暂停恢复，记录位置／朝向／速度和方向／响度／音高。音高先核多普勒，响度先核坐标／衰减；人判交接自然，原生足够就停。

**实际范围：** 静读作者／官方资料、固定源码与许可，未试听。

<a id="88"></a>

## 墙门遮挡补比：直达被挡不等于通路消失

核实：2026-10-16 UTC+8；主线二／三。[研究] 按可听规则区分直达遮挡、分区及通路，保既有系统，不以声学真实度为统一目标。

<a id="89"></a>

### 两种生产机制及不能互换的结论

- [一手] Homebody 主程序／技术设计 Alex Belzer 的[项目说明](https://www.alexbelzer.com/work/homebody)明确使用 zoning 处理 obstruction／occlusion，目的是减少每个 emitter 到 listener 的寻路或 raycast。[研究] 固定室内已有区域／门关系时可借划分；作者未给算法、声部规模或测量，不证明本项目速度／听感收益，也不搬自建音频系统
- [一手] Barotrauma 固定提交 `e6e95da83b1b5ca8b55ec52653c7cf6b40e30247` 的 [ShouldMuffleSound](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/Barotrauma/BarotraumaClient/ClientSource/Sounds/SoundPlayer.cs#L988-L1012)在听者水下／低通等判断之外，比较房间通路的近似距离与声音范围；[Hull 路径查询](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/Barotrauma/BarotraumaShared/SharedSource/Map/Hull.cs#L1137-L1212)考虑连接 gap、门开闭／损坏／开启程度与客户端预测状态。[研究] 通路／门状态可影响闷声，但不证明完整传播、精确绕射或声像沿路径转向；不逐声源移植寻路

[一手] Barotrauma 是**受限公开源码**：[固定 README](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/README.md)要求先读 [EULA](https://github.com/FakeFishGames/Barotrauma/blob/e6e95da83b1b5ca8b55ec52653c7cf6b40e30247/EULA.txt)，后者明确限制于 Barotrauma 相关非商业用途／模组，不允许将代码用于自己的项目或商业用途。已读固定 EULA 的完整摘要及正式第 1–8 节，未见 AI、训练或自动分析专门条款；不据此推定仓库／网站其他条款无限许可。只借高层机制，不复制代码／资产或推荐商业移植，公开可读不等于可复用开源。

<a id="90"></a>

### 原生职责与成本：不是跨引擎同一个开关

- [一手] Unity 6.3 [AudioLowPassFilter](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioLowPassFilter.html)按 cutoff 去掉高频，并提供随开门改变 cutoff 的例子；挂在 AudioSource 或 AudioListener 的作用范围不同。[Physics.Linecast](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.Linecast.html)提供线段碰撞查询及层／trigger 筛选。[研究] 简单门关系由现有状态驱动声源，确需几何遮挡才查询；声学阻挡层、查询频率、状态所有者与过渡仍归项目，原语不寻找绕行通路
- [一手] UE 5.8 [Sound Attenuation](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-attenuation-in-unreal-engine)原生提供 Occlusion、Trace Channel、低通频率、音量衰减与插值时间。官方指出 simple collision 较便宜但可能误判复杂形体；修改 Visibility 的响应可能影响其他系统，可考虑独立音频 channel。[研究] 先配置原生能力，不造等价管理器；插值仅缓和边界变化，不修正错误碰撞、过期门状态或补出间接路径

[研究] ✅ 直达够用就停；房间开门／破洞先复用分区与状态，承担内容关系维护。材质透射／反射等明确缺口才评估现成传播，先核引擎／平台／许可。分记 voice／查询／DSP，虚拟化不保证自写查询停，不给通用射线数。

<a id="91"></a>

### 集成反例与第二次修改：只预注册

[一手] [Steam Audio Unity 当前指南](https://valvesoftware.github.io/steam-audio/doc/unity/guide.html) 分 Occlusion/Transmission/Reflections；几何默认 static，动态门需导出 Dynamic Object，只传整体 Transform，不支持子物体独立变化。[研究] 铰链二改须核声学几何，非插件推荐／许可背书。

[研究] 二改加第二出口／破门，固定关键声音，比较无障碍、隔墙、门开关与绕行，沿门边查闷声、突变、漏预警及方向；再加环境声量声部／查询／DSP。输入错误先修，滤掉提示就收窄／撤回；人听验，简单遮挡／区域规则够用就停。

**实际范围：** 静读原文／契约／源码／许可，未试听；未采用未经独立核实的 Wiki 修复描述。

<a id="95"></a>

## 高速碰撞补研：线性、旋转与误接触

核实：2026-10-16 UTC；主线三。先分线性漏碰、旋转漏碰及误接触再选 CCD／substep；依据公开契约／问题报告。[一手／研究]

- **Unity 6.3 内置 3D 的模式不是无条件升级链。** [一手] [选择表](https://docs.unity3d.com/6000.3/Documentation/Manual/choose-collision-detection-mode.html)建议从 Discrete 开始，漏碰时试 Continuous Speculative，仍漏碰／误碰时按静态或动态刚体对象比较 Continuous／Continuous Dynamic；但同页明确后两者不适合旋转造成的碰撞。[sweep 原理](https://docs.unity3d.com/6000.3/Documentation/Manual/sweep-based-ccd.html)沿当前线速度计算 TOI，碰撞后可重算速度与再扫掠；固定支点的弹球挡板是官方旋转反例。[研究] 旋转物体不因“更精确”改 Continuous Dynamic；CCD 内部子步不等于全局提高模拟频率。范围不含 Rigidbody2D／ECS Unity Physics。
- **Speculative 的撤回条件不只有漏碰。** [一手] [speculative 原理](https://docs.unity3d.com/6000.3/Documentation/Manual/speculative-ccd.html)按线运动及角运动扩张 AABB；最近点法线可能把细分表面接触误判为斜坡，让高速球无故向上跳。若求解阶段获得额外能量、越出原先扩张范围，仍可能漏碰。[研究] 需要准确线性接触时可比较 sweep，角运动仍核误碰／漏碰；换模式或提高频率不保证修好。图例仅支持机制，不是本仓库体验／性能实测。
- **UE 5.8 分别查 Chaos 刚体与 ProjectileMovement。** [一手] [FBodyInstance](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/FBodyInstance)以 bUseCCD 为组件启用 CCD；[UProjectileMovementComponent](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UProjectileMovementComponent)以 bSweepCollision 控制扫掠检查，bForceSubStepping 通过更小步改善轨迹精度；UpdatedComponent 若模拟物理，则初始发射参数后由物理接管。[研究] 先确定运动所有者，不给两条路径同时套 Unity 模式；这些 API 说明不能证明 Chaos CCD 保证角运动命中。[物理 substep](https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-sub-stepping-in-unreal-engine)分割帧时间以改善复杂物理资产稳定性，受 Max Substeps 和 Max Physics Delta Time 限制；不能把时间细分当作更换检测算法。多回调已由 [04 物理行](../../domains/game-dev/04-client-modules.md#2-十一个模块的最低交付线)覆盖，不新增另一套结算规则。该文仍含 APEX／mobile 旧措辞，本轮不据页眉推导平台支持现状。
- **真实报告限定到其版本和配置。** [一手：官方问题记录] [UE-358355](https://issues.unrealengine.com/issue/UE-358355)给出 Vehicle 模板复现步骤：高速 Chaos Vehicle 开 CCD 后碰撞 One Way Interaction 动态物体，出现不应发生的明显减速；开／关 CCD 是报告里的对照。核实时为 Unresolved，列影响 5.5／5.6／5.7，目标修复 6.0；不能推断 5.8 已确认受影响或 6.0 已修复。原因归于 CCD sweep 是 licensee 的猜测，本轮未证实，也不推荐报告中的内部回调绕过。[研究] 新增 CCD 后仍须验响应政策；不推广为所有 Chaos 接触或 Unity speculative 同类故障。

**二改预注册：** [研究] 直线球／薄墙基线加旋转杆、细分表面；核漏碰、偏转及响应，先比算法再比步长／成本。UE 分别核 ProjectileMovement、Chaos 及物理接管；确需 One Way 才加。防穿透破坏反弹／推动规则则撤回定位，不全局升档。

<a id="96"></a>

## 声音响应补研：低延迟与连续播放分别验收

核实：2026-10-16（UTC+8）；主线一／三。确认声迟到先定位等待再比原生缓冲；不同类型游戏有相反维护选择。[研究]

<a id="97"></a>

### 处理块缩小与扩大都可能合理

- **OpenTTD 的缩小。** [#12227](https://github.com/OpenTTD/OpenTTD/pull/12227)于2024-03-07合入，[25aeb1c](https://github.com/OpenTTD/OpenTTD/commit/25aeb1c5a536219d07bf1e7a75fcacccd0f35249)将 win32／XAudio2 默认块从8192改1024。作者按44100Hz给出每块约186／23ms，这不是端到端测量，也不能称实际节省163ms。[补充说明](https://github.com/OpenTTD/OpenTTD/pull/12227#issuecomment-1984711843)指出该 mixer 在块起点启动声音，大块会将不同游戏 tick 的声音挤到同一起点，修改只是缓和；Cocoa 用系统块大小，不在此修改内。[一手／研究] 支持核实际消费粒度，不支持照搬1024。
- **VVVVVV 的扩大。** 2026-04-30 [0d69dd3](https://github.com/TerryCavanagh/VVVVVV/commit/0d69dd3820189937cc623b9ed30fffc60c5f787e)在[初始化](https://github.com/TerryCavanagh/VVVVVV/blob/0d69dd3820189937cc623b9ed30fffc60c5f787e/desktop_version/src/Music.cpp#L746-L759)加 FAUDIO_1024_QUANTUM，调用处无平台条件，mastering voice 仍44100Hz；目的仅是缓和部分端口的爆音／变慢，不能称各平台修复。[#970](https://github.com/TerryCavanagh/VVVVVV/issues/970)仍 open，Linux原报告未获该提交回归确认。[FAudio作者](https://github.com/TerryCavanagh/VVVVVV/issues/970#issuecomment-4352893115)说明该 flag 表示约21.33ms时间窗口，不能按名字当所有采样率固定1024样本，更不能与OpenTTD横比。[一手／研究]
- **节奏游戏的历史撤回。** osu-framework [#3832](https://github.com/ppy/osu-framework/pull/3832)、[654e9db](https://github.com/ppy/osu-framework/commit/654e9dbe972972c70a925d742776f419a73d052c)于2020-08-17撤掉强制 DevicePeriod=1，保留其他缓冲设置；维护者报告部分 PulseAudio 环境爆音，增大另一 buffer length 不能解决同一问题。[一手：历史维护] 周期、块长度与排队不是可互换旋钮，不据此称当前版本有该问题。[研究]

许可仅作机制借鉴边界：[OpenTTD固定许可](https://github.com/OpenTTD/OpenTTD/blob/25aeb1c5a536219d07bf1e7a75fcacccd0f35249/COPYING.md)为GPL v2并列第三方例外；[VVVVVV自定义许可](https://github.com/TerryCavanagh/VVVVVV/blob/0d69dd3820189937cc623b9ed30fffc60c5f787e/LICENSE.md)限制商业性修改／分发，图像和音乐另有权利。本节不复制实现或资产，不推荐把VVVVVV作为商用移植底座。[一手／研究]

<a id="98"></a>

### 原生取舍及第二次修改

Unity 6.3 [Audio设置](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioManager.html)与[GetDSPBufferSize](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSettings.GetDSPBufferSize.html)区分响应、每块样本及块数，较小粒度增加CPU开销。UE [平台音频设置](https://dev.epicgames.com/documentation/en-us/unreal-engine/platform-audio-settings-in-unreal-engine)分别控制 Callback Buffer Size 和 Number of Buffers to Enqueue：减少前者可减等待但增加CPU工作，增加后者会增加延迟并缓和部分线程供给波动。[一手] 先用已有配置，只改变与瓶颈相关的一层；不要为此换中间件或自建后端。[研究]

二改仅预注册：用已准备好的短确认声区分首次准备与每次起音等待，记录输入接受、播放请求及实际输出；增加背景音乐／空间处理或换已承诺支持的输出设备后，在空闲及高负载下比较原配置和一个低延迟配置，兼查爆音、断续及音频CPU。[VVVVVV原报告](https://github.com/TerryCavanagh/VVVVVV/issues/970#issuecomment-1515043078)中磁盘录音无噪声而扬声器有，故内部录音不替代全部实际输出验收。[社区／研究] 收益不明或连续性退化则恢复基线，迟交事件／首用准备先修对应环节，不改操作判定掩盖声音迟到。

[研究] 仅静读契约／源码／讨论；未运行后端或设备测试。

<a id="99"></a>

## 转向补研：先分限幅与平滑，再决定是否撤回插值

核实：2026-10-16 UTC；主线一／三。快速转向先隔离输入平滑、限幅与呈现插值，再决定取舍。[研究]

<a id="100"></a>

### 同一游戏里的不同选择与局部撤回

[社区] Barony Quality of Death 测试期的[原帖](https://steamcommunity.com/app/371970/discussions/3/3727324132820504963/)中，Ninjaboi8175 于2023-02-03报告关闭 Camera Interpolation 有效；FLy1n RabBit 于03-21说关闭后问题仍在，高刷新显示下的观感也难接受。开发者 WALL OF JUSTICE 于04-04建议另关 Mouse Rotation Limit；04-09同一位 FLy1n RabBit 明确回报改善，并选择保留插值，同时仍感觉停鼠后的数帧余动。[研究] 同一人的前后反馈缺完整设备配置与精确构建号，不能定位余动来自哪层，也不证明所有玩家的问题已解决。

[一手] [591ebab3](https://github.com/TurningWheel/Barony/commit/591ebab3eedd9e67b7142daf60794de575814172)（2023-04-28 UTC）将 `disablemouserotationlimit` 默认及设置应用路径置为 true，停用限速的菜单与序列化入口；[官方 V3.9.1 公告归档](https://store.steampowered.com/news/posts/?appids=371970&enddate=1686762095&feed=steam_community_announcements)（2023-05-14，Misc. Tweaks and Fixes）列出撤去 Rotation Speed Limit。[研究] 补丁、发布与反馈的时间接续可核，不证明修改单因该帖。[2020-01-07的旧补丁](https://github.com/TurningWheel/Barony/commit/4fd68a0864f4532607392540c09c5c69afa4216e)已加入关闭水平限速的选项，因此不是QoD新引入限速后才撤回。

<a id="101"></a>

### 三种机制分别负责什么

[一手] 同一固定 `591ebab3eedd9e67b7142daf60794de575814172` 树中，限速与平滑不是同一个算法：
- [actplayer.cpp L574–603](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/actplayer.cpp#L574-L603)按 `smoothmouse` 分支累积／衰减水平输入或直接赋值，`disablemouserotationlimit` 则单独控制 ±0.35 的夹取；这是转向上限，不等于输入加速曲线
- [L743–780](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/actplayer.cpp#L743-L780)另由 `bUseTimerInterpolation` 控制相机状态追踪；[MainMenu.cpp L2476–2505](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/ui/MainMenu.cpp#L2476-L2505)仍默认开插值、关 Smooth Mouse，撤限速没有一起撤掉呈现插值
- **方向边界**：[pitch L676–715](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/src/actplayer.cpp#L676-L715)仍有夹取；所核 flag 对玩家水平 yaw 生效，不能将公告简写扩大成所有方向、所有镜头都已无上限

[研究] 即时转向可比较关插值，但高刷新更易显低频跳动；保留时核急转、停鼠、反向。上限无玩法用途则先修截断，有转身承诺则保规则调反馈；不把三项全关作统一配方。

[一手／研究] [固定许可](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/LICENSE.txt)为 BSD-2-Clause，[README](https://github.com/TurningWheel/Barony/blob/591ebab3eedd9e67b7142daf60794de575814172/README.md)说明游玩仍需购买副本；代码许可不扩大资产许可。仅静读机制、核历史反馈；不复制代码或资产，未运行游戏、引擎或设备测试，不增加实测计划。

<a id="102"></a>

## 插值预算：按观察尺度缩小呈现，不停止仿真

**核实：2026-10-17（UTC+8）。** [研究] 无热点保留全体必要对象插值；确有成本、近景／总览用途不同才按视口／尺度筛选，保留原生模拟频率与循环。

**OpenRCT2的已发行取舍。** [#24467](https://github.com/OpenRCT2/OpenRCT2/pull/24467)原先把Guest、Staff、Vehicle全加入插值，改成仅取可见且zoom≤0的视口，实体投影点落在任一视口就保留。[维护者试玩回执](https://github.com/OpenRCT2/OpenRCT2/pull/24467#issuecomment-2902380560)称未见glitches，没有设备、地图、时长或帧时分布；不把赞美评论当第二次复测。改动列入0.4.23，[2026-10-10的0.5.6发行](https://github.com/OpenRCT2/OpenRCT2/releases/tag/v0.5.6)对应[82b30979](https://github.com/OpenRCT2/OpenRCT2/blob/82b309798a83346b7f9fc61a53847f4323deb19d/distribution/changelog.txt)，[固定EntityTweener](https://github.com/OpenRCT2/OpenRCT2/blob/82b309798a83346b7f9fc61a53847f4323deb19d/src/openrct2/entity/EntityTweener.cpp#L22-L116)仍保留策略。作者认为缩小时插值作用较小是设计判断，没有感知实验或该改动的性能测量。**[一手：固定实现与发行；社区：一次试玩自报]**

筛选是所有符合条件视口的并集，不仅主相机；主视口缩小时，近看的小窗仍可能保留该对象。判定只用实体位置投影点，不是sprite包围盒或遮挡测试。preTick先restore/reset再重建集合，postTick记新位置，集合按模拟tick而非每呈现帧更新；[Context固定调用](https://github.com/OpenRCT2/OpenRCT2/blob/82b309798a83346b7f9fc61a53847f4323deb19d/src/openrct2/Context.cpp#L1342-L1377)仍执行Tick，随后tween/Draw。这只能说明减少呈现插值集合，不能说停了屏外仿真或已保证快速入屏无跳；遍历实体与视口的成本也未消失。**[一手：源码机制；研究：边界]**

**不同类型的反例。** VVVVVV [#220](https://github.com/TerryCavanagh/VVVVVV/pull/220)选择保留34ms模拟步，在中间呈现帧插值，避免为视觉帧率重调已有物理／自制关卡；拆开更新与绘制也是维护工作，不是只加lerp。它有[实际试玩](https://github.com/TerryCavanagh/VVVVVV/pull/220#issuecomment-623655566)与[维护者通关及Valgrind开销报告](https://github.com/TerryCavanagh/VVVVVV/pull/220#issuecomment-644247104)，后者不能推成普通发布构建回退。[2.3发行文](https://distractionware.com/blog/2021/08/vvvvvv-2-3-out-now/)确认高帧呈现进入发行，不证明玩家通过率提高。更直接影响筛选范围的是[#517](https://github.com/TerryCavanagh/VVVVVV/pull/517)：为滚动插值补画上方源像素，修屏幕上缘异常。这不是OpenRCT2缺陷，却表明屏幕矩形外仍可能有下一帧取样／连续运动所需数据。**[一手／社区：采用、修复与运行自报]**

**代价与撤回。** [研究] 筛选增加多视口、集合切换及数据保留责任；全体更简单，原低频牺牲连续感。二改快速入屏对象／附属视口后核近景、总览、远主＋近窗、出入屏、缩放反向及暂停恢复；危险难追或突跳就扩范围／撤回。模拟、碰撞与索引照原契约，不套 zoom 阈值。

[研究] 未测筛选成本、帧时或辨识；0.5.6 留代码不证明全版无回归，历史试玩不覆盖目标设备。不排名全体／选择性插值或推断 AI 收益。


<a id="arcade-vehicles"></a>

## 街机车辆：先比现成控制模型，再决定是否窄取规则

核实：2026-10-23 UTC。范围是漂移、跳跃与连锁加速成为核心玩法的车辆，不替代普通角色／肢体交互建议。**当前最高水平未知；以下仅公开资料与固定源码静读，未运行游戏、引擎或真实模型，生产质量、二改工时与手感收益未证，不升为整链验证。** [研究]

**✅ 默认先比较现成街机底座，而非从“不要逼真轮胎”直接跳到自建。** 能保目标操控且许可、引擎版本与依赖合适就复用；整套耦合不合才抽取窄规则。👀 下列两个公开实现是比较／阅读候选，不是即装即用推荐。[研究]

| 同一选择 | 可借的机制与证据 | 会改变采用决定的成本 |
|---|---|---|
| 近期联网街机样例 NetickRocketCars，固定 `907ec505`（2026-01-26） | [CarController.cs][vehicle-netick-code] 用轮位射线、侧向摩擦与漂移抓地调整；悬挂动画另算，不以完整轮胎模拟为前提。[一手] | 继承网络回放类、使用 Netick 状态／Sandbox；自动扶正含世界高度大于 10 即退出的场景条件。[研究] 停车楼等新场景不能只换模型；单机须比较抽离成本，不照搬整个联机工程。 |
| 较轻的 ArcadeVehiclePhysics，固定 `2883b931`（2024-11-27） | [项目说明][vehicle-light] 分物理、能力、视觉脚本，无 Netick 绑定；漂移与 boost 可单独读。[一手] | 工程仍是 [Unity 2018.4.5f1][vehicle-light-version]；近期提交不等于现代版本支持。许可／网络负担较少，不等于状态与时序验收更少；见下方松键路径。[研究] |

**许可是分层筛选，不看根目录一个 MIT 就放行。** [一手／研究]

- Netick 样例的 [MIT][vehicle-netick-license] 不覆盖整个工程：[README credits][vehicle-netick-readme] 中音频有仅为本项目授予的许可，另含 Custom／Asset Store EULA 资产。[锁文件][vehicle-netick-lock] 还依赖 NetickForUnity `549aa7f5`；该固定树未见独立许可文件，[package.json][vehicle-netick-package] 也无许可字段。官方链接的 [Netick 商店页][vehicle-netick-store] 是 Standard Unity Asset Store EULA／Extension Asset，不能据此替 GitHub 固定版本补授权。**不把整套当通用 MIT 商用底座**；只借确属 MIT 的运动代码也须保留声明，重新接自己的输入／步进／查询，排除依赖代码和资产，授权疑点先确认。[研究]
- 轻库根 [MIT][vehicle-light-license] 支持代码复用；README 单列演示车模型来源，不能代替资产许可核查。可只比较代码，另配已获授权资产；旧输入与演示视觉依赖仍需迁移，未证明比 Netick 抽离更省总工时。[一手／研究]

**低依赖反例：松开 boost 后是否还应有推力？** 固定 [CaBoost.cs 第 29–70 行][vehicle-light-boost] 的可达条件是组件持续启用、接地、燃料未耗尽时按住，再松键：Update 先读键，回血分支不写 `currentBoost`，FixedUpdate 仍消费上次推力，直到后续进入清零分支。已检索该树全部 C# 写点：该值只有本类初始化、赋力与清零；[基类][vehicle-light-base] 没有禁用／复位钩子，UI／视觉不代清推力。**这是静态风险，不是引擎复现或作者已确认 bug**；先定按住式还是定时式：若目标是松键即停，必须验该序列；若承诺持续加速，则核推力、燃料与提示是否共同遵守，不能一律清零。[一手／研究]

[CaDrift][vehicle-light-drift] 则只在接地时更新 `isDrifting`，Update 写抓地系数；[CpLateralFriction][vehicle-light-friction] 在 LateUpdate 算侧力、FixedUpdate 施力并复位系数。空中松键保留漂移可能是有意政策，不能直接“修掉”；需先约定落地恢复与多物理步时的消费规则。[一手／研究]

**用制作取舍约束二改，而非只看技术名称。** [PGRC 开发者 2025-01-03 原帖][vehicle-pgrc] 说明 boost 时长可叠加，并用排气颜色提示余量；同帖 02-07 玩家报告高速擦碰／落地翻车，只是个人反例，不代表共识。[一手／社区] [Top Drifters 作者 2025 自述][vehicle-topdrifters] 则选择 WheelCollider，称半尺寸车辆需要重调参数；作品当时在开发，且作者承认 Unreal 经验不足，不能据此排名引擎。[一手] 两者支持的判断是：先定叠加、接地、失败恢复政策，不把 WheelCollider 与“不能街机”画等号。[研究]

**官方对照与撤回条件。** Unity Vehicles [0.1.1-exp.1 changelog][vehicle-unity] 已在 2025-09-02 修正空气阻力施加错误、轮力不均导致的偏转等问题，不能把旧帖当现版未修故障，也不能因官方／实验包身份就推定适合该玩法。AI 可先整理状态读写、隔离输入／反馈、补项目规则与验收场景；人决定漂移可控性、保速与碰撞惩罚。新增连锁 boost 后比较：按住式／定时式各自的松键／耗尽、离地后松漂移／落地、高速擦墙／坡顶跳跃、翻车复位；已有连段或可达路线受损就撤回该规则改动。上述两库均未做此二改，不能声称 AI 已节省返工。[一手／研究]

**探索回执与缺口。** 同日检索 indienova「车辆 物理 Unity」「漂移 物理 开发」及知乎「车辆物理 街机」，未找到近两年同题生产比较，不以无关教程凑正例。PGRC 2026 技术视频仅取得简介／章节，未读到字幕正文，不用其推导内部实现。仍缺同一项目的整套复用／抽离规则对照、目标 Unity 版本运行与玩家体验；现有证据只足以改变筛选顺序，不足以选出最优底座。[研究]

[vehicle-netick-code]: https://github.com/NetickNetworking/NetickRocketCars/blob/907ec50519d61920eefbbd34897aecf2e81e5dc1/Assets/Rocket%20Cars/Scripts/Player/Car/CarController.cs
[vehicle-netick-license]: https://github.com/NetickNetworking/NetickRocketCars/blob/907ec50519d61920eefbbd34897aecf2e81e5dc1/LICENSE
[vehicle-netick-readme]: https://github.com/NetickNetworking/NetickRocketCars/blob/907ec50519d61920eefbbd34897aecf2e81e5dc1/README.md
[vehicle-netick-lock]: https://github.com/NetickNetworking/NetickRocketCars/blob/907ec50519d61920eefbbd34897aecf2e81e5dc1/Packages/packages-lock.json
[vehicle-netick-package]: https://github.com/NetickNetworking/NetickForUnity/blob/549aa7f5c71eb14b1a09b6ab9d3fb3a820365760/package.json
[vehicle-netick-store]: https://assetstore.unity.com/packages/tools/network/netick-networking-engine-292096
[vehicle-light]: https://github.com/benmcinnes/ArcadeVehiclePhysics/tree/2883b931c37d55682dc7d4b55551f55bd6d1d0bd
[vehicle-light-version]: https://github.com/benmcinnes/ArcadeVehiclePhysics/blob/2883b931c37d55682dc7d4b55551f55bd6d1d0bd/ProjectSettings/ProjectVersion.txt
[vehicle-light-license]: https://github.com/benmcinnes/ArcadeVehiclePhysics/blob/2883b931c37d55682dc7d4b55551f55bd6d1d0bd/LICENSE
[vehicle-light-boost]: https://github.com/benmcinnes/ArcadeVehiclePhysics/blob/2883b931c37d55682dc7d4b55551f55bd6d1d0bd/Assets/ArcadeVehiclePhysics/Vehicle/Scripts/CA%20-%20CarAbilities/CaBoost.cs#L29-L70
[vehicle-light-base]: https://github.com/benmcinnes/ArcadeVehiclePhysics/blob/2883b931c37d55682dc7d4b55551f55bd6d1d0bd/Assets/ArcadeVehiclePhysics/Vehicle/Scripts/CA%20-%20CarAbilities/CaAbility.cs
[vehicle-light-drift]: https://github.com/benmcinnes/ArcadeVehiclePhysics/blob/2883b931c37d55682dc7d4b55551f55bd6d1d0bd/Assets/ArcadeVehiclePhysics/Vehicle/Scripts/CA%20-%20CarAbilities/CaDrift.cs#L28-L61
[vehicle-light-friction]: https://github.com/benmcinnes/ArcadeVehiclePhysics/blob/2883b931c37d55682dc7d4b55551f55bd6d1d0bd/Assets/ArcadeVehiclePhysics/Vehicle/Scripts/CP%20-%20CarPhysics/CpLateralFriction.cs#L35-L66
[vehicle-pgrc]: https://steamcommunity.com/app/2737300/discussions/0/599640708794564635/
[vehicle-topdrifters]: https://www.reddit.com/r/Unity3D/comments/1majlpx/we_made_a_game_with_unreal_engine_and_switched_to/
[vehicle-unity]: https://docs.unity3d.com/Packages/com.unity.vehicles@0.1/changelog/CHANGELOG.html

<a id="p112-racing-corner-loop"></a>

## P112：街机赛车——让一个弯道可预判、可选择、可恢复

核实：2026-10-23（UTC+8）。**[研究] ✅ 先联调路线提示、抓地／漂移选择与出弯恢复，不把“漂得更多”当作好开的标准。** 对应 [05 Gameplay 架构](../../domains/game-dev/05-gameplay-architecture.md)；本节承接 P103 的车辆底座选择，不重复插件排名。范围为单车、弯道与坡面的一条完整操作，不扩道具、联网或开放世界。**当前最高水平未知；下述驾驶实现候选均未试用，未运行引擎或模型；末尾另记 Star-Rush HUD、提示实现与兼容模式浅弯操作，完整同弯任务及手感仍未验。**

### 先定弯道任务，再调漂移参数

| 玩家要做的事 | 当前默认与撤回条件 [研究] |
|---|---|
| 提前知道往哪走、何时动作 | 让入口、出口与关键边缘可辨，再补必要路标；提示仍晚于操作窗口就先改布局／镜头，不只增转向力 |
| 选择抓地或漂移 | 明定哪些弯道值得以转向约束换奖励；比较同入弯条件的净路线收益，直道也被迫刷漂移就重调奖励／成本 |
| 松键后可靠出弯 | 分开物理朝向、速度方向、视觉车头，约定恢复与奖励；画面暗示的出口与实际运动不符就缩视觉偏转或改交接 |
| 失误后重新掌控 | 按接地与起跳状态恢复，不每帧强扶正；破坏正常坡面、跳跃或有意路线就收窄辅助 |

### 现成实现：借状态契约，不搬整套游戏

[SuperTuxKart 1.5 固定配置](https://github.com/supertuxkart/stk-code/blob/1fb491f507216c5d181ccd85f29ff08eca003827/data/stk_config.xml#L483-L523)把漂移中转向映射到同向的最小／最大范围：反打可放宽弯度，不立即反向；视觉转角、恢复时间和结束后物理旋转分别配置。通用默认 `reduce-turn-min/max=0.2/0.8`、`revert-visual-time=0.7`、`time-till-bonus` 奖励门槛 `1.0/3.0` 秒（`bonus-time` 持续时间另为 `3.0/4.0` 秒），只是该版本默认，不是各车最终值或通用最佳参数。[一手]

[固定 skidding.cpp](https://github.com/supertuxkart/stk-code/blob/1fb491f507216c5d181ccd85f29ff08eca003827/src/karts/skidding.cpp#L379-L551)区分累积与松键后的恢复状态；释放时安排物理朝向调整并发可能的奖励。**👀 借“进入—维持—释放—恢复”及反馈同源，不把低摩擦等同完整漂移。** 源文件标 GPL-3.0-or-later；不直接复制进许可不相容工程，也不据代码证明手感。现成 Unity 底座继续按 P103 的许可、版本、依赖筛选。[一手／研究]

版本不可混用：[官方发布公告](https://blog.supertuxkart.net/2025/10/supertuxkart-15-release.html)日期为2025-10-20；本轮[下载页](https://supertuxkart.net/Download)仍将1.5列为最新稳定版，并说明Evolution尚无公开测试构建。以下Evolution问题只作开发反例，不声称已在1.5复现或修好。[一手／研究]

### 画面必须说明动作时机，镜头必须说明去向

任天堂[2025-05-21发行前访谈 Part 3](https://www.nintendo.com/us/whatsnew/ask-the-developer-vol-18-mario-kart-world-part-3/)解释强化白色浪尖，是为了让玩家看清波峰、判断跳跃时机；[Part 4](https://www.nintendo.com/us/whatsnew/ask-the-developer-vol-18-mario-kart-world-part-4/)以地标和倾斜地形引导路线，并观察不熟练成员发现卡点。**借的是把行动线索做进环境，不是取消箭头；交叉路仍要明确指路。** 这是设计者报告，不是发布后学习收益测量。[一手／研究]

[Unity Cinemachine Follow 3.1.7](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineFollow.html)已有位置／角度阻尼与仅跟yaw的World Up绑定。**✅ 原有跟随组件优先，先选跟随参照，再调偏移、阻尼与FOV；不直接把漂移装饰节点当唯一方向。** 仅跟yaw适合相应地形承诺，不推广到反重力赛道；入口更晚可见或出口离屏就撤回该镜头变化。回看／重生历史沿既有相机段处理。[一手／研究]

### 反例改变验收，不代表作品普遍失败

- [Evolution #5720，2026-05-04](https://github.com/supertuxkart/stk-code/issues/5720)报告漂移视觉旋转未匹配物理，长窄车尤其穿帮；无精确构建号，仍未关闭。由此增加车长二改的显示／碰撞检查，不能据此判1.5所有车型有缺陷。[社区／研究]
- [#5460](https://github.com/supertuxkart/stk-code/issues/5460)记录两轮接地时恢复过慢，也指出简单扶正可能使坡面轮子离地。维护者2026-06-13说明Evolution补了前后轮情况及正常起跳的激活延迟后关闭；本轮未核修订全文或复测。由此分测侧轮、前后轮、坡面与起跳，不只验翻车按钮。[一手／研究]
- [mass 2026-08-06原文§7–8](https://note.com/we_love_mkwrld/n/n79e4b13aeb28)认为直线漂移单独不更快，需接后续弯道／MTJA；落地漂移收益有限。作者自称非最上位，全文未锁补丁号，只作具名玩家经验，不冒充专业排名或普遍定律。[社区]

[任天堂2025-08-15技巧](https://www.nintendo.com/au/news-and-articles/get-a-head-start-on-mario-kart-world-with-a-few-tips/)也将漂移与其他加速来源分开，辅助转向开启／关闭分别允许两级／三级Mini-Turbo。借“辅助有明确政策和反馈”，不照搬其奖励限制；该页未注明补丁号。[一手／研究]

### AI 实施与二改清单：规则可测，手感仍须玩

1. 沿既有控制器明确状态、单位和松键／离地政策；记录输入、速度、三种方向、接地、阶段与奖励，不先造车辆框架。
2. 同一弯道比较抓地、早漂、晚漂；固定输入查规则，人判断可控性。记录首次看见入口、首次正确操作、出弯速度和纠偏／碰撞，不只比圈速。
3. 验奖励门槛前后松键、反打、离地松键与落地、擦墙、两轮接地、恢复中再次漂移；提示与实际奖励保持一致。
4. 第二次只改车长或奖励门槛，复核碰撞对应、旧路线、提示和恢复。新手判断路线与时机，熟练者判断选择是否保留；脚本通过不等于好玩。

[弯道机制图](../img/2026-10-23-racing-corner.svg)呈现入口—弯中—出口与三方向；图为机制示意，非实测轨迹。**未验证：目标设备成本、真实操控、AI二改工时与玩家收益；专业玩家同构建一手反例仍缺，不以来源数、热度或完成清单代替效果。**[研究]


<a id="star-rush-hud-case"></a>

### Star-Rush HUD 实操：真实背景决定先修什么

**结论：先让玩法信息脱离浅背景，再加装饰；关键方向用 SVG／几何配文字。** [经验／研究]
核实：2026-10-23（UTC+8）；AI 辅助代码修正，沿用程序化画面，不涉及生图或驾驶参数调优。[经验]
证据仅支持本端兼容显示模式 HUD；未部署，不据此宣称线上修复或完整游戏品质提升。[研究]

- **固定代码与回归。** [Star-Rush PR #1](https://github.com/dbvv1/Star-Rush-Reborn/pull/1)核至 [6f8e763742eb653331aa85375ac10e9127eb06b1](https://github.com/dbvv1/Star-Rush-Reborn/commit/6f8e763742eb653331aa85375ac10e9127eb06b1)。仅 HUD 源码、测试及原有构建产物改变；HUD、原客户端与 API 回归通过。客户端套件使用 fake DOM，不能当作真实浏览器验证；执行细节见该 PR。[一手／经验]
- **决定性画面。** 正文两张原截图均为 1188×761：已有入口仅显示版本标识 REBORN01，部署 SHA 未核；训练场白色计时／圈数落在浅天空和樱花上，暂停字形为方框。本端修改后构建的预览在浅背景下，深色底后的模式／赛段／计时／圈数、中文回正／暂停及 SVG 左箭头可辨。两图已目检，但不是同一时刻或路线位置，不能把场景差异当作修改收益。[经验]
- **二改边界。** 保留真实 DOM 绑定与原状态入口，完整测试后仍须在真实背景检查；本次未验窄屏／字体放大、完整 WebGL、回正功能、真人操控手感、音频或双机。驾驶物理与镜头未改，亮背景 HUD 结论不能替代本节的同弯操作与通用验收。[研究]

<a id="star-rush-cue-handoff"></a>

### Star-Rush 提示回流：路线同源，恢复优先于奖励

**结论：箭头与教练读同一预览，教练按当前动作选一条主提示，不用奖励就绪覆盖收车。** 这是已有实现的接收，不新增驾驶参数或素材实验。[一手／研究；核实：2026-10-24 UTC+8]

- **路线同源。** 固定公开版本 [07e1839 的 race-features.js](https://github.com/dbvv1/Star-Rush-Reborn/blob/07e18395bff8a172f7d552ccae0f6cefe7458fce/race-features.js#L36-L55)中，`routePreview(s)`比较前方32m与62m道路朝向，绝对差小于0.05时视为直道，同时返回当前位置曲率。[race.js 的 updateHUD](https://github.com/dbvv1/Star-Rush-Reborn/blob/07e18395bff8a172f7d552ccae0f6cefe7458fce/race.js#L110)取得一次结果，更新箭头／文字，并在非联机训练模式传给教练。机制来自驾驶提示修订`8d8dcf5`，以上链接固定其后续已包含版本；距离与阈值是本项目实现，不是通用最佳预判窗口。[一手：源码静读]
- **动作优先。** 反打、收漂／退出及其余漂移阶段先于有效小喷；小喷再先于正在喷射的氮气。普通抓地弯前提示收油控速／平顺转向，不一律提示Shift；只有前方被判直道、当前位置曲率足够小、速度与瓶数满足条件才给可选氮气。车头稳定是提示文字，代码没有据车头／速度夹角判断可以安全喷射，不应把它写成安全门控。[一手：源码静读]
- **现有测试能证明什么。** [client.mjs](https://github.com/dbvv1/Star-Rush-Reborn/blob/07e18395bff8a172f7d552ccae0f6cefe7458fce/tests/client.mjs#L50-L103)覆盖共用预览与冲突状态等逻辑；本轮只读已有代码，不重新运行游戏测试，测试替身不证明实际路线更好开。[一手／研究]
- **已有提示实屏。** [PR #1驾驶提示修订回执](https://github.com/dbvv1/Star-Rush-Reborn/pull/1)记录兼容模式163／194／284.8m的左弯预告与控速教练一致，291m暂停／恢复／回正后提示仍正确；未捕到反打／release／小喷瞬时教练，不能将位置抽查写成连续成功过弯。[一手：执行者回执，非本轮复跑]
- **浅弯与中断历史。** [早期回执](https://github.com/dbvv1/Star-Rush-Reborn/pull/1#issuecomment-6371588003)的28–103m操作仍是起步浅弯，之后浏览器错误代码9中断；本轮原入口已恢复，不再把旧中断当当前不可运行。[一手：执行者回执]

**主弯实操纠正了测试范围，而非证明驾驶已改善。** 固定同一公开版本`07e1839`，2026-10-23原生浏览器／Canvas兼容模式接续：第一主左弯延续至约450m，不是原估300m结束。以下来自[原执行者主弯回执](https://github.com/dbvv1/Star-Rush-Reborn/pull/1#issuecomment-6374260570)，本节整理未另跑游戏。[一手]

| 操作路径 | 实际观察与可支持的结论 |
|---|---|
| 连续抓地 | 入口156.7m／8.8km/h；177→383→576m间未暂停、未按Shift／Q／E。383m右贴栏、576m已到直道却左贴栏，驶过主弯不等于稳定恢复 |
| 漂移／早双喷 | 235m出现双喷，318m外侧贴栏；235／318m均暂停观察，不能称完整连续漂移退出 |
| 停走低速 | UI确认自动油门未选；观察后短段操作并多次W+S制动，入口与前两轮不同，弯中仍贴栏。约494m触发BOOST STRIP／71km/h，随后W+S 1800ms，514.5m降至3.2km/h；松键后515m／0km/h、横向1.21m，稳定停在路内 |

**先分操作方式和加速来源，再决定是否改参数。** 自动释放按键、截图和调用间隔包含松键滑行；未按喷射键也可能经过赛道加速带。教练“先收油控速，平顺转向”未见方向冲突，贴栏尚不能归因物理或镜头，因此不硬调数值、没有代码修复。触发加速带与制动后的两截图跨2.42秒，只证明其后可制动停稳，不能还原带生效期内逐帧推力切断。本轮不认证WebGL2或真人手感；待补的是顺畅连续过弯／漂移退出，不用停走成功替代。[一手／研究]

<a id="camera-contract"></a>
## P114：完整镜头——预判、跟随、遮挡与玩家控制

**结论：[研究] 先验玩家能否看见下一决策、保持观察与移动意图，再调顺滑和冲击；不以角色始终入镜作为完成。**
**新增选择：[研究] Unity 优先已有 Cinemachine；密集冲击先比较原生 `Use Largest`，6.6 升级按 Editor 核包，不把 3.1.7 配方统一外推。**
**范围：2026-10-23 UTC 公开资料及固定源码静读；未装包、未运行引擎／模型、未购买插件，手感、成本收益及当前最高体验水平未知。**

### 作品与开源：借哪项质量，而不是复制参数

| 来源／证据 | 决定与边界 |
|---|---|
| [Daniel Helbig 原帖](https://www.linkedin.com/posts/helbigdaniel_since-we-started-with-the-lonely-mountains-activity-7407445428683653122-7F7h)：Snow Riders 增加第三人称镜头，艺术团队修改全部山地与路线；本轮正文可读，日期只显示相对时间 | [一手／研究] 镜头改变的是路径发现与内容可见面，不只是追随曲线。保留导演构图或换追随须连路线一起判断；不采用作者的差评占比作统计，也不把艺术团队工时视为单人可承担 |
| [Steam 2025-01-20 原帖与回复](https://steamcommunity.com/app/2545360/discussions/0/744883366278500571/)：提问者抱怨前方看不见／切镜控制反向，支持者重视替代路线及挑战 | [社区／研究] 同题正反说明预判与发现节奏存在取舍，不是第三人称绝对更优；只代表此讨论，未证明控制算法实际反转或玩家整体偏好 |
| [Celeste64 Player.cs 固定 6edfe1e，L443–460](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L443-L460)与[L1474–1487](https://github.com/EXOK/Celeste64/blob/6edfe1ebd2a21a6134d7675a28e357891025407e/Source/Actors/Player.cs#L1474-L1487)：本轮重读原文 | [一手] XY 跟角色，Z 依据着地／下落／高度窗选择；攀爬横向输入回到阈值内才重算相机相关方向符号。[研究] 支持状态化纵向跟随及持续输入契约，不支持把攀爬规则套全部移动；代码 MIT、内容／IP 边界及 jam 架构沿[既有核查](wp11-camera.md#s9-4) |
| Warframe 2025 后坐修订与玩家反例，沿本册[打击感证据](#hit-feedback)；[Xbox XAG 117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117)，更新 2026-03-04 | [一手／研究] 游戏修订说明信息可以不依赖镜头位移；指南建议可调 FOV、横纵灵敏度及关闭额外运动。只作设置与验收依据，不给医学阈值，也不要求固定视角项目强做另一整套视角 |

较旧的 Celeste64／[Mushroom 11 区域焦点](wp11-camera.md#s9-4)仍有价值，是因为分别解决持续输入和谜题取景；与近期 Snow Riders 的视角重构、当前原生组件比较后，保留的是窄机制，不据历史名作宣布最高水平。作品表现、作者自述和源码可读是不同证据。[研究]

### Unity 现成职责与不能互换的参数

| 入口／本轮核实 | 直接支持什么；实施选择 |
|---|---|
| [Position Composer 3.1.7](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachinePositionComposer.html) | [一手] 前视依目标运动预测，噪声可被放大，Lookahead Smoothing 同时增加滞后。[研究] 镜头目标优先可靠移动参照，骨骼抖动先处理来源；急弯／落点需要的是玩法信息，不能用无限增大预测秒数代替 |
| [Brain 3.1.7](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineBrain.html) | [一手] Smart Update 按目标更新方式选择；ManualUpdate 应在目标移动后调用，Blend Update 是另一职责。[研究] 先记录目标、物理呈现和相机阶段；一概改 LateUpdate 或取消插值都不是诊断 |
| [Input Axis Controller 3.1.7](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineInputAxisController.html) | [一手] 提供加减速、非缩放时间、混合期输入抑制与 Cancel Delta Time。[研究] 鼠标位移与摇杆角速率分配单位；自动回正、混合时输入、暂停政策要由玩法决定，不能因两种设备共用一个 Action 就重复积分 |
| [Decollider](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDecollider.html)／[Deoccluder 3.1.7](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineDeoccluder.html) | [一手] 前者处理穿入、不保证视线；后者可拉近、保高度或保距离，Maximum Effort 限命中处理。[研究] 原生策略足够先试，不默认同时加两者；看见角色、保近裁剪、看见威胁及武器通路分开验，没有可行视点时改几何／局部显隐 |
| [Third Person Aim 3.1.7](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineThirdPersonAim.html) | [一手] 分相机看点与角色受阻点，Noise Cancellation 可稳定屏幕目标。[研究] Follow 未必是枪口，弹体体积／弹道仍归武器；有意后坐力与装饰噪声先分类，不全部抵消 |
| [Confiner 2D 3.1.7](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineConfiner2D.html) | [一手] 内边界考虑视口；多边形点／非均匀缩放变化需更新形状缓存，镜头变化另有缓存入口。[研究] 新宽高比或变焦是二改验收，不只看中心点在地图内；避免每帧重烘焙 |

相机最终朝向可以用于投影，但移动／瞄准意图是否随导演切镜、避障或震动改变要显式约定；不能把装饰后的 Camera transform 当所有玩法的唯一输入参考。连续相机相对移动与“持有直到松开”的攀爬都可成立，选后用持续输入跨转角验证。[研究]

**成本与撤回。** 先定单人能维护的相机模式、区域触发、遮挡材质例外和可选运动通道；内容每增加一个房间就需新特例时，比较简化几何、改取景或减少视角自由度。新增 Deoccluder 查询、Confiner 烘焙及扩展并非零成本，本轮没有设备测量；不写通用射线数／最佳阻尼。可靠窄跟随没有缺口就保留，Cinemachine 的完整功能不构成迁移理由。[研究]

<a id="camera-control-return"></a>
### 控制借出与返回：画面事件不拥有玩法权限

**2026-10-23 核实。[研究] ✅ 在现有模式入口保存交接身份，返回时按当前资格重新提交目标／权限，而非恢复借出前快照。** 完整执行顺序放在[04 镜头模块](../../domains/game-dev/04-client-modules.md#camera-contract)，这里仅补证据边界；未运行引擎，不能称最优体验已验证。

[一手] Cinemachine 3.1.7 的 [Brain Events](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineBrainEvents.html)把 Activated 放在混合开始，零时长 cut 不发 Blend Finished；Timeline 混合不发 Blend Created。[事件流](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineEvents.html)还包括各 Brain 和子相机管理器。因此“任何混合完成就启用玩家”和“只等完成事件才释放”都不足以覆盖返回；事件须过滤所属视口与期望目标，cut／取消有各自路径。[研究]

[一手] [Input Axis Controller](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineInputAxisController.html)的混合期抑制只约束该控制器，轴仍可由脚本／动画驱动。[研究] 菜单保持期间的观察、自动回正与角色移动许可仍由模式决定；不能把此选项当完整接管。既有[暂停持有／死亡后恢复反例](wp10-content.md#5-暂停叠加与转场关闭一层不等于恢复整局)与[反馈所有者清理](#hit-feedback)直接复用，不另造两套恢复器。

**推导反例，非引擎复现：** 剧情 A 返回玩家 P 的混合尚未结束，P 死亡并重生为 Q；A 的旧完成通知随后到达。若通知恢复保存的 Follow／输入开关，镜头会拉回旧对象或越过死亡／菜单权限。采用交接 ID＋目标代次校验，旧通知只可幂等结束自己的持有，不能提交 Q 的目标／许可；新状态选择 Q 的取景并处理旧反馈。相机可复用同一个对象，所以只比较相机引用不够。[研究]

[研究] 这是跨职责的窄协调，不建议新建通用相机事务平台。无重入／中断需求的单入口可保简单状态；有意连续操控的观察模式保持其移动参考系，不为等画面强锁玩家。重生清历史、正常借出保连续性仍沿[既有历史政策](wp11-camera.md#s12-2)，不与权限恢复绑成一次全局 reset。

<a id="camera-version"></a>
### 当前版本：Editor 升级与相机手感回归分开接收

- [一手] [Unity 6.6 升级指南](https://docs.unity.com/en-us/engine/6000.6/manual/upgrade-guides/upgrade-guide-unity66)明确 Cinemachine 成为核心包，依赖它的项目随 Editor 使用对应版本；CM2 自动升级 CM3，API／数据格式不同，保 CM2 需本地副本引用。[6.6.0 changelog](https://docs.unity3d.com/Packages/com.unity.cinemachine@6.6/changelog/CHANGELOG.html)同时记录核心包化及命名空间升级修复。6.3／3.1.7 是本页旧基线，不能说它是所有 Editor 的最新包；也不推断每个已有 CM3 项目必变行为。
- [一手／社区] [官方 breaking-change 讨论](https://discussions.unity.com/t/planned-breaking-changes-in-unity-6-6/1715134/5)保留 CM2 在 Unity 6.3 LTS 生命周期内支持；[2025-09／10 Orbital Follow 原帖](https://discussions.unity.com/t/cinemachine-orbital-follow-camera-behaving-differently-after-updating-from-3-1-2-to-3-1-3/1685378)中，用户原来喜欢的缓动来自 Deoccluder 旧行为，维护者建议在实际跟随／旋转阻尼里复现。原帖没有成功接收结果，不写“升级后重新调参数即可无损恢复”。
- [一手] [固定 45728f changelog](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/CHANGELOG.md)的 `3.1.8-pre.2`（2026-08-04）记 MixingCamera 样例直接使用物理速度的抖动修复；`3.1.7`（2026-06-08）列混合完成／取消修复。[研究] 这是读取发行记录，不是重现；既不能把预发布修复算进 3.1.7，也不能据旧版本已修过同类 bug 就跳过新项目回归。

[研究] 因而升级接收保存的是原路线、输入与取景意图，不只是 Inspector 数值。用直行、急反向、绕柱、混合中取消与重生重放，区分 API／序列化迁移通过和体验接收；暂无法还原关键控制时保已验证版本／缩升级范围，不盲贴旧 Deoccluder 实现。既有 warp／CancelDamping 与变帧率边界复用[历史管理](wp11-camera.md#s12-2)，本轮不重复另造算法。

### 震动：已有最大信号选择，但“设为零”仍要验完整通道

[一手] [Impulse Listener 3.1.7 文档](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineImpulseListener.html)明确 `Gain` 是倍数，默认 Additive，可选 `Use Largest` 仅取最大幅度信号；功能在 3.1.4 changelog 已列。**[研究] 密集命中先比较原生最大信号与叠加，再决定项目上限；最大值选择不限制单次超大冲击，也不代事件去重。**

[一手：源码静读] 本轮读取[固定 `45728f` 的 CinemachineImpulseListener.cs](https://github.com/Unity-Technologies/com.unity.cinemachine/blob/45728f3030787076f32930101d11d9ca96fe3a0f/com.unity.cinemachine/Runtime/Impulse/CinemachineImpulseListener.cs)：先按组合模式取信号，`ReactionSettings.GetReaction` 接原信号并按自身 `AmplitudeGain` 算次级反应；主信号乘 `Gain` 后再叠加次级位置／旋转。因此**在该固定实现中，有次级噪声时只把主 Gain 设 0 不足以证明全部运动为零**。这不是对安装版 3.1.7／6.6 的运行结论；接入项目应核实际包，并在冲击刚触发及衰减中切换关闭设置，检查主震、尾震和恢复后的残留。

[社区／一手] 中文[SouthBegonia 实作](https://www.cnblogs.com/SouthBegonia/p/11891117.html)（2019-11-19）有真实案例和代码，但把 Gain 解释成同时信号数量，与本轮官方定义不符。[研究] 可借事件源／监听器分离，不复制旧版本字段解释；AI 上下文要附当前包页／固定源码。避免用全局清除所有冲击去关一个玩家的镜头，停止、禁用监听和清历史也须分开约定。

### Unreal 与付费候选：已有职责够用时不迁移

- [一手] [UE 5.8 SpringArm](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/USpringArmComponent)提供碰撞球探测、位置／旋转 lag 与 substepping；肩位用 SocketOffset 才与臂查询一致。[Camera 职责](https://dev.epicgames.com/documentation/en-us/unreal-engine/cameras-in-unreal-engine)由 PlayerCameraManager 提供最终视图；[Camera Shake](https://dev.epicgames.com/documentation/en-us/unreal-engine/camera-shakes-in-unreal-engine)的 Single Instance 是重启同类，不是跨事件去重或总幅度上限。[研究] ✅ 沿原生职责补视线／控制政策，不把 SpringArm 等同能找到任意可见视点的搜索器。
- [一手] [Gameplay Camera System 5.8](https://dev.epicgames.com/documentation/unreal-engine/gameplay-camera-system?application_version=5.8)仍明确 Experimental；其创建者在[2026-03-30 开发日记](https://ludovic.chabant.com/blog/2026/03/30/ue5-gameplay-cameras-coda/)表示自己离开后数据驱动编辑工作流的维护未来不明。[研究] 👀 多模式、图编排确需才评估，承担升级与作者工具成本；个人预测不证明插件已弃用，单个社区意见也不能盖过版本文档。未下载 UE 工程，不将引擎可读源码当开放源码许可。
- [一手] [Pro Camera 2D 作者官网](https://www.procamera2d.com/)列房间、前视、边界、轨道、震动及多目标构图，支持二维平面上的透视相机；页面的最新发行仍显示 2.9.2／2022-04-10。[研究] 👀 若频繁制作房间／触发镜头，可比较其作者工作流；本轮没确认当前 Unity 支持、净工时和购买条款，未购买／试用，不能称其已过时弃用，也不能凭奖项／客户引言推荐替换 Cinemachine。商业许可与二改绑定是新增成本。

Unity 包的 UCL／Unity-dependent 条件、Celeste64 代码与资产分开许可沿[既有来源](wp11-camera.md#s9-4)；对工程中的实际包及插件再核授权，不把公开可读当任意跨引擎复制。[研究]

### AI 接收证据：轨迹解释原因，试玩判断好不好用

[研究] 正文的清单是可执行任务模板，不是已通过记录。最低 trace 包含 `frame / deltaTime / mode / targetId / targetPose / desiredPose / finalPose / focusScreenPoint / occlusionCorrection / inputBasis / shakeLevel / transitionReason`；按项目语义扩字段，不造跨引擎通用框架。日志能定位谁在改画面，但“焦点在屏内”不证明玩家认得出出口／预告，所以同段录屏与真人操作仍必要。

验收刺激按失败来源选择：急反向查前视翻转，台阶／下落查垂直窗，窄门／绕柱查近裁剪和恢复振荡，近墙换肩查准星承诺，持续输入切镜查参考系，暂停／重生查历史和尾震；30／60／120 Hz、长帧与不同宽高比覆盖呈现变化，不当通用性能承诺。第二次需求加窄门和连续多击后，第一版开阔路线仍须接收。[研究]

探索回执：截至 2026-10-23 UTC，读 Unity／Epic／Xbox 官方、Cinemachine／Celeste64 固定源码、作者 LinkedIn／开发日记、Unity Discussions、Steam 与中文博客原文；中文新版本深度实作未找到可作为决定性证据者。Steam 更新公告正文未取得，改用已可读作者原帖支持发布事实；Unity Issue Tracker 重定向不可读，不报告其当前修复状态。未运行引擎、模型或试玩，不据来源齐全宣称最高水平已知。[研究]

<a id="p117-audio-lifecycle"></a>

## 音频事件与混音：声音结束，不等于背景应该恢复

**核实：2026-10-23 UTC。** [研究] ✅ 原生播放器／混音器继续用，补的是一次声音事件的完整退出路径：获准播放后按需让位，结束只撤自己的影响，最后依据仍活跃的请求和玩家当前设置重算。已有[并发](#45)、[持续声](#50)与[低延迟](#96)结论不重写；本节不开发通用音频框架。

<a id="audio-normal-production"></a>
### 正常接线：素材准备、发声对象与实例消费

[研究] 2026-10-25 将本节已有事件表、并发、持续声和混音组合成正文同一实施链：定义事件→准备资源→绑定声源→驱动实例→混音／退出。首版只做命中、机器循环和对白；新增移动载具先改声源及状态参数，第二警报先改共存语义与类别。沿已有原生默认和制作参照，不新增音频框架或宣称最高听感；本次未运行引擎、真实设备或试听。

- [一手] Unity 6.3 [AudioSource](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource.html)的 `spatialBlend` 区分 2D／3D，单片可 Play／Pause／Stop，输出路由到 `outputAudioMixerGroup`，`playOnAwake` 会在激活时自动起播；[`PlayOneShot`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource.PlayOneShot.html)返回 void，不取消已有 Play／one-shot。[研究] 事件控制的声源预制体关闭自动起播，配置完成且请求获准才显式播放。共享 UI 短音可沿该入口；需要逐实例停止、位置或循环参数时分配独立受管声源，项目 handle 只表控制身份，不证明实际可听。
- [一手] [AudioClip 导入](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioClip.html)区分解压常驻、压缩常驻与流式，代价分别是内存、播放解码和流式缓冲／读盘；平台覆盖改变结果。[`LoadAudioData`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioClip.LoadAudioData.html)默认同步，开启 loadInBackground 才异步；未 ready 就 Play 会推迟到数据就绪。[研究] 因此瞬时反馈的“不追补过期事件”必须在调用播放器**之前**由 ready／有效期判定落实，而不是把请求先交给引擎再丢项目队列。准备期按 `loadState` 查就绪；持续声恢复时重读当前活动状态，播放结束后按资源所有权释放。
- [研究] 首版路由和让位继续用下表的原生职责。低成本实现是少量事件配置＋已有 AudioSource／Mixer，不为每次命中建一套可视化作者工具；只有复杂事件／互动音乐的编排维护成为实测瓶颈，再比较中间件及许可。源件的定位核心、立体声宽度与混音验收沿 [WP6](2026-10-14-game-wp6-audio.md#105-unityunreal同一质量目标不同原生职责)，未把短音 mono 规范扩展到整套声音。

### 先做一张事件表，再选混音手段

[研究] AI 从现有调用点整理每类声音的：**触发事实、实例所有者、类别／并发、目标总线、让位条件、停止条件、暂停政策**。命中跟结算结果，普通脚步不因“有声”就压低整场；机器循环跟活跃状态更新同一实例，离开状态、对象销毁／回池与切场都必须收尾。播放失败或过期的请求不应遗留背景衰减；受音频锁或加载影响的等待态与已开始播放分开处理。

一个够小的路由是 `Music → GameMusic → UserMusic → Master`：`UserMusic` 接设置滑条，`GameMusic` 接对白／菜单等游戏混音；SFX、UI、Voice 只按实际独立调节需求分组，不机械扩成很多总线。**两段对白重叠时，第一段结束不能直接写回“进入前音量”**；保留第二段的让位，最后恢复的是此刻用户设置，而非旧值。重叠可选最强、叠加并封顶或显式状态优先，先按体验选一条，再映射所用工具；不同工具的“blend”并非同一算法。[研究]

| 当前实现 | 同题选择，而非工具名单 | 最容易接错的地方 |
|---|---|---|
| **Unity 6.3 原生：✅ 默认** | [一手] [Audio Mixer Inspector](https://docs.unity3d.com/6000.3/Documentation/Manual/AudioMixerInspectors.html)提供 Send 与 Duck Volume，适合按实际信号压低背景；snapshot 适合已定义的游戏混音状态。[研究] 只缺这两件事，不引中间件 | [SetFloat](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Audio.AudioMixer.SetFloat.html)调用后该 exposed 参数不再随 snapshot；用户与游戏层分开。检查返回值，在 Start 或之后应用设置，不在 Awake／OnEnable／AfterSceneLoad |
| **Unreal 原生：✅ 已用 UE 就复用** | [一手] [Audio Modulation](https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-modulation-reference-guide-in-unreal-engine)已有 Control Bus／Mix，可把用户与设计控制分开。[研究] 不为移植 Unity 的管理器再包一层相同系统 | 多个调制器的组合依参数类型：音量衰减 dB 相加，HPF 取最大、LPF 取最小；不是所有参数做平均。按[Quick Start](https://dev.epicgames.com/documentation/unreal-engine/audio-modulation-quick-start-guide?lang=en-US)，同一 Mix 只能有一个活跃实例；两个所有者不能各自把同一 Mix 当私有开关 |
| **FMOD Studio 2.04：✅ 已有作者工作流时用** | [一手] [Mixing](https://www.fmod.com/docs/2.04/studio/mixing.html)支持有范围的 snapshot 实例、优先级、分组和过渡。[研究] 需要事件内编辑多层让位时，可省项目自建作者工具 | blending 只对范围为 −∞ 至 +10 dB 的已纳入音量属性做相对加法，其他属性仍覆盖（如 compressor gain）；同组按强度合成。snapshot 要停止／解除触发，音频片段播完不自动等于它也结束 |
| **Wwise：👀 已采用或确需集中作者工具时比较** | [一手] 官方 [2025 动态混音工作坊](https://info.audiokinetic.com/gamesoundcon-2025)围绕 Game Parameters、States、auto-ducking、side-chain、HDR 组合设计。[研究] 状态明确时沿已用 State／RTPC，依声音强弱让位才比较 meter／side-chain；不为一个音量滑条迁移 | 作者工具仍需要游戏给出正确状态与结束；本轮未跑 Wwise、未核出一套可直接复制的当前项目配置。许可／构建维护沿[已有许可比较](2026-10-14-game-wp10-client-modules.md#6-许可维护与采用边界)另核 |
| **Howler 2.2.4／Web Audio：✅ 轻量 Web 沿现有入口** | [一手] [Howler 固定源码](https://github.com/goldfire/howler.js/blob/003b917c40cb41cf382ba47ae0ed7a35ca2abe76/src/howler.core.js#L1003-L1144)已有实例 ID、pause／stop／fade；[MIT](https://github.com/goldfire/howler.js/blob/003b917c40cb41cf382ba47ae0ed7a35ca2abe76/LICENSE.md)。[研究] 不需要中间件作者界面时，补少量项目规则即可 | `pause` 保播放位置，`stop` 重置到起点；`end` 在循环每轮也发，取消 fade 也可能发 `fade`，不能把回调名称当“整次声音自然结束” |

**近期制作对照：复杂交互音乐不自动要求中间件。** [一手] Sandfall 团队在 [2025-03-27《Clair Obscur: Expedition 33》官方采访](https://www.unrealengine.com/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33)说明全部使用 UE Audio；音乐管理器按探索、战斗、过场、菜单、对白分 context，每个 context 同时一曲，接管时旧／新曲分别转出／转入，曲目由少量同架构 MetaSound preset 构造。**[研究] 可借“用途分层、统一模板、明确交接”，不照搬其制作量；这不是单人无音频人员达到同等成品质量的证明。**

### 四个参数失败，比再加一层 AudioManager 更值得先查

| 观察到的失败 | 证据与修正方向 |
|---|---|
| 滑条改过以后，暂停／对白 snapshot 不再改变音乐音量 | [一手] Unity `SetFloat` 的显式接管规则。[研究] 分用户增益与游戏混音参数，先查谁写同一参数；[ClearFloat](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Audio.AudioMixer.ClearFloat.html)该版文档只承诺复位初值，不据此宣称已验证完整 snapshot 归还流程 |
| 两个房间 snapshot 都单独正常，边界重叠却不合预期 | [社区／一手] [FMOD 2024-10-24 原帖](https://qa.fmod.com/t/blending-reverb-snaphots/22219)报告异常，官方解释 scope、覆盖／相对加法及分组规则，未确认发帖者最终根因。[研究] 先画重叠状态与作用属性，不把“blending”理解为任意参数平均 |
| 配音结束，音乐仍被压低；把一个 release 调短却没用 | [社区／一手] [FMOD 2026-03 原帖](https://qa.fmod.com/t/the-sound-that-contains-a-snapshot-instrument-does-not-stop/24103)：活跃 snapshot instrument 会让父事件不能自然结束；用户后来发现 snapshot 的 AHDSR release 仍是 1 秒，之前改的是 side-chain 的 10ms。[研究] 分“语音结束→解除触发→混音淡出结束”，这两个数是故障现场，不是推荐参数 |
| 循环一轮就恢复背景，或取消淡出却触发“完成后停止” | [一手：源码] Howler [_ended](https://github.com/goldfire/howler.js/blob/003b917c40cb41cf382ba47ae0ed7a35ca2abe76/src/howler.core.js#L1951-L2008)先发 `end`，循环时仍继续；[_stopFade](https://github.com/goldfire/howler.js/blob/003b917c40cb41cf382ba47ae0ed7a35ca2abe76/src/howler.core.js#L1407-L1430)取消时也发 `fade`。[研究] 终止入口区分整次结束、循环边界、取消与主动 stop，并核实例身份；没有把此静读当浏览器回调复测 |

### AI 实施顺序与最小反例

1. **列出现有事实，不先重构。** AI 找到重复触发、循环创建处、用户音量写入处、snapshot 开关与清理处；人决定哪些声音应该互相让位。
2. **先画信号路由与退出路径。** 保已有播放器，记录本次实例身份；自然结束、被抢占、主动打断、播放失败、对象退场分别进入适当清理，重复通知只能清一次。
3. **再确定组合规则。** 同一参数只由明确的入口提交；重叠请求按所选规则重算，不各自保存／恢复旧音量。循环不靠每帧 Play 驱动，暂停／恢复与退场分开。
4. **注入交错与二改。** A→B→停A→用户改音量→重播A→旧A回调→停B→退场；再把短提示改循环／将对白中断，核新实例仍在、旧影响归还。播放失败、遗漏 ID、无效参数也必须有结果。
5. **分开验收。** 自动核触发次数、身份、活跃请求、目标参数和渲染数值；人用真实资源与设备听起音、方向、对白可懂度、音乐呼吸与反复循环。改 release／阈值后仍须听，不用峰值或接缝通过代替耐听。

**最小反例已跑，不是一套音频框架。** [研究；本仓纯状态与浏览器离线合成检查] [脚本](../../experiments/game-audio-lifecycle.mjs)用两个重叠请求和独立用户音量比较正确路径与故意错误的“保存旧值→结束恢复”。示例只选最强让位：用户 `0.5`，A乘 `0.5`、B乘 `0.25`；A先结束时应仍是 `0.125`，错误单推子恢复到 `0.5`。用户改成 `0.8` 时应仍让位到 `0.2`。12时点、5类非法输入及重复／旧代结束检查通过；数字为合成测试，不是混音推荐值。

复跑纯控制：`node experiments/game-audio-lifecycle.mjs`。另有[静态离线页](../../experiments/game-audio-lifecycle.html)，通过本地静态服务打开后用原生 `OfflineAudioContext` 将常量循环缓冲渲染到内存，显示两条路径的断言 JSON；它不播放声音、不请求麦克风、不取外部资源。**本仓浏览器离线渲染已通过：48kHz、双通道、144000帧，12个检查点与预期相符，见[原始结果](../../experiments/game-audio-lifecycle-results.json)。Unity／UE／FMOD／Wwise运行、真实资源听感和设备输出未测。** [W3C Web Audio](https://www.w3.org/TR/webaudio/#OfflineAudioContext)的离线缓冲与实际输出是不同验收面。

**探索回执：** 截至2026-10-23，核Unity／UE／FMOD官方文档、Sandfall团队采访、FMOD 2024／2026原帖与Howler固定源码；中文社区实践页未完整读到，B站只取得说明未听看，未拿它们支撑技术结论；A Sound Effect 长访谈正文不可读，不使用检索摘要补出制作细节。当前最高制作水平未知，默认胜出的是此范围下已有原生能力与最小项目规则。[研究]


<a id="p127-sensor-crossing"></a>

## P127：高速穿越触发区，事件不等于当前占据

**结论：物理阻挡、路径经过与当前占据分别选；已有原生连续 sensor 就先复用，不先写替代物理。**
**新增实证：Box2D 3.2.0 能报静止 sensor 的跨步经过，但该步的 sensor data 可以含已经离开的物体。**
**范围：2026-10-23 UTC；真实官方 C 库六组对照，未运行 Unity／UE、移动 sensor、近战或玩家测试。**

### 现成方案与版本差异

[一手] Box2D [3.2.0 release](https://github.com/erincatto/box2d/releases/tag/v3.2.0)（2026-10-19）新增 continuous sensor events，列快速 shape 对静止 sensor、bullet 对非 bullet sensor。固定 [3.1.1 手册](https://github.com/erincatto/box2d/blob/8c661469c9507d3ad6fbd2fea3f1aa71669c2fe3/docs/simulation.md)的 Sensors 则明确一步穿越不检测。两版都是 MIT；本仓使用原库，不复制第三方代码。[3.2.0 许可](https://github.com/erincatto/box2d/blob/178495ba35695aefe9c321e569d2277f06db3b90/LICENSE)

[一手／研究] [3.2.0 手册](https://github.com/erincatto/box2d/blob/178495ba35695aefe9c321e569d2277f06db3b90/docs/simulation.md)仍将可靠范围限定为不移动 sensor；快速物体对快速移动 sensor 推荐 ray／shape cast，双方还须启用 `enableSensorEvents`。所以新版本不是“任何 trigger 都连续”，也不是任意旋转武器的完整命中方案。已经使用 Box2D 且确有静止区域漏触发，可比较升级；没有这一缺口不为单个功能换物理底层。

### 真实 C 库：穿越可被记住，末位置并不重叠

[实验] 官方固定 3.1.1／3.2.0，各跑高速 sensor、低速 sensor 与高速 solid，场景同一几何和时步；初始化后实读默认 continuous=1、速度上限400 m/s。动态非 bullet 圆从 x=-0.2 m 以24 m/s前进，静止盒半宽0.05 m、圆半径0.05 m，dt=1/60 s、substep=1；一步到+0.2 m，前后都完全在区外。完整配置、编译方式、断言与原始CSV见[复跑记录](../../experiments/p127-sensor-crossing.md)。

| 高速 sensor 观测 | 3.1.1 | 3.2.0 |
|---|---|---|
| step 1，末位置 x=+0.2 m | 无事件、sensor data为空 | begin=1、sensor data有1个对象 |
| step 2，末位置 x=+0.6 m | 无事件、sensor data为空 | end=1、sensor data为空 |

[实验] 两版低速对照均能报 begin／end；solid 对照均在第一步阻挡于 x=-0.095 m，contact begin 在第二步才出现。这里只说明本配置通知时序，不推出全部引擎回调延迟。无重叠依据固定 y=0、无旋转几何关系独立观察，并非库 overlap query 的对照测试。

[一手：源码／研究] 固定 [solver.c](https://github.com/erincatto/box2d/blob/178495ba35695aefe9c321e569d2277f06db3b90/src/solver.c)收集连续 sensor hits；[sensor.c L156–164](https://github.com/erincatto/box2d/blob/178495ba35695aefe9c321e569d2277f06db3b90/src/sensor.c#L156-L164)将这些 hits 加入 overlap 数据。源码另有限定 `B2_MAX_CONTINUOUS_SENSOR_HITS` 并过滤实体阻挡之后的 sensor hit；本次只有一个静止 sensor，不承诺任意密集路径全部触发。它是保留经过的设计，不是错误数据：拾取／检查点可消费一次穿越；需要“仍在区域内”的持续伤害则使用当前姿态的 overlap 查询，不能直接按 begin/end 相隔步数算真实停留时间。撤回的应是错误消费方式，不是默认关闭连续事件。

### Unity／Unreal：保原生，不把上游能力硬套过去

- [一手] Unity [6.3 LowLevelPhysics2D.PhysicsShapeDefinition.isTrigger](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/LowLevelPhysics2D.PhysicsShapeDefinition-isTrigger.html)明确 trigger 无连续碰撞并建议 ray／shape cast；仅此 API 范围，不外推传统 Rigidbody2D／3D。[UUM-121087](https://issuetracker.unity.com/issues/1992/box2d-bug-fixes-and-improvements)只确认6000.3.0b5／6000.4.0a2更新到上游另一个提交，不能证明集成3.2。当前Unity最新版是否有同等能力，本轮未知。
- [一手／研究] Unity [SphereCast（页面6000.0）](https://docs.unity3d.com/ja/current/ScriptReference/Physics.SphereCast.html)明确起始球已重叠时不检测该 collider；因此贴身开命中窗口不能只加路径cast。保现有 overlap 候选，再按动作需要补区间；不统一放大体积，也不改已有命中身份规则。6000.3同页本轮返回异常HTML，不声称精确版本复测。
- [一手] UE [OnComponentBeginOverlap](https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/Collision/OnComponentBeginOverlap)区分 overlap 与 blocking，双方需开启 GenerateOverlapEvents；继续沿现有 ProjectileMovement／Chaos 运动所有者核路径，不把 Unity trigger 限制翻译为 UE 定律。

[研究] 交给 Agent 的窄二改：先列现有碰撞事实由谁生成、谁移动、哪些消费者需要一次经过／当前占据／停留时长；复用原生事件／查询，保持攻击取消、回池与唯一结算政策。验收增加薄触发区完整穿越、起始已重叠、低速正常进入及实体墙对照。这里实跑了前述Box2D六组；贴身、移动双方与技能消费仍需项目测试，不用库通过代替玩法正确。

**探索回执：** 核到2026-10-23的Box2D官方release、固定两版源码／许可与任务issue、Unity／Epic官方契约；Reddit 2025近战boxcast原帖读取失败，未使用摘要，未取得近期生产作品或中文社区的可靠同题反例。当前最佳近战方案未知，本项只补已证实的静止触发区选择与事件消费边界；未扩成近战教程或新增通用框架。
