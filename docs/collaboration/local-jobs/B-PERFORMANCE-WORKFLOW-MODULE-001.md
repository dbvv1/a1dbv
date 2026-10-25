# B-PERFORMANCE-WORKFLOW-MODULE-001 · 从遭遇卡顿与内存增长到有效修补

id: B-PERFORMANCE-WORKFLOW-MODULE-001
owner: dot-B
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 77e827ded75b0eb826f58f5b517bcdbc6e35e178
result_branch: relay/b-performance-workflow-module-001

## 完整问题

同一遭遇持续掉帧，首次进房又有尖峰，往返后内存看似上涨。让读者从原生分析器证据追到具体代码／资源，分清三类现象，针对真正瓶颈只改有效层，再在发布构建复核，而不是先扩池、关 GC、转 ECS、开 DRS 或堆监控。交实施蓝图与最小修补设计，不假设当前云端具备真实设备／引擎数据，不为文稿强造独立实验。

第一版是一段正常遭遇的归因与针对性修改；第二次需求增加新敌人、材质或更大波次，重新判断瓶颈是否转移、旧修改是否仍值得。帧率目标、画面可读性、冷启动、稳态与峰值内存一起约束选择，不能用单张 Profiler 截图或平均 FPS 证明收益。

## 复用与需要补齐的路径

先读 AGENTS、CLAUDE、dot-B 提示词、TASKS 当前重点、手册§7／operations§2.2；复用04与WP10已有设备预算、首发预热、GC／池、粒子、DRS、PSO、上传／integration、呈现节奏材料，不重新调查一轮工具榜。

把原生分析器采集→主线程／worker／GPU／等待分类→加载关键路径→等价状态内存快照与引用链→一个针对改变→发布构建复核串成完整路径。只补决定性的官方工具解释和版本差异；默认跟随项目锁定引擎与管线，不把 Unity／UE 或编辑器／玩家构建的标记同名当作相同机制。等待标记不直接等于该函数本身费时，CPU与GPU不能简单相加，Profiler自身与深度采样开销需在选采集方式时说明。

以项目自定义 `PrepareEncounter`／`ActivateEncounter`／`SpawnWave`／`ReleaseEncounter` 标记串正常遭遇，写清它们是建议语义不是引擎内置API。选择最少足够的标记、真实工作边界和采样条件，不新建监控平台。加载要分 IO／解码／初始化／上传／首绘的实际关键路径；内存对照等价状态、相同预热／回收时机，分开有界缓存、托管堆保留、对象真实增长、原生资源与临时峰值，再追仍保留对象的引用／所有者。资源生命周期已有内容只链接，不重写一套释放协议。

给 AI 具体实施起点：沿既有代码加必要标记、整理原始证据、提出能被证伪的归因、做一个最小补丁并回同条件复核；人决定可感知品质和最低设备体验。没有真实采集就交明确的采集／解释／修改蓝图，结果列未验，不伪造收益或把源码支持当实测。正常内容生产与开发周转是目标，不让失败边界占满正文。

## 独占范围与交付

仅改 `domains/game-dev/04-client-modules.md` 的“压低卡顿与设备耗用”段、`docs/research/2026-10-14-game-wp10-client-modules.md` 对应性能段，以及本任务。保现有锚点和仍适用入口，去重正文已吸收的推理；不碰04菜单／UI、角色、资源／保存等其他段，不改wp10-content／wp10-motion、05、资产页或共享TASKS，不新增小研究文档／证明台账。UI模块已于 `77e827ded75b0eb826f58f5b517bcdbc6e35e178` 串行合入；开工仍须重核最新main与文件归属，保UI新稿，不并写同页。

仅由既有本地协作会话使用已配置模型执行普通原生 Workflow（实施＋一次独立验证）。不授权 dot 直接操作用户电脑，不新开引擎／生成模型实验、不下载权重、新建凭据、增加收费／权限或部署；只用允许公开材料，不读私有工程、采集、文件或凭据。具体拒绝独立保留，被明确拒绝就停该动作并保产物，不换路绕过。按手册§7复用未变证据，完成关键来源、正文、公开文件／新增提交身份与暂存差异检查；只推结果分支，回写 `review_ready`、实际通道、固定SHA、改变的实现起点和真实待验项，由dot-B接收，不自行合入main。

认领：dot 本地协作；2026-10-25。固定来源负责人分支 dot-b/tmp/20261025-performance-module-job，提交 `4a10dcc7bd0ab78b5926211fec8c31abcccea311`，仅引入原任务。UI 已由负责人接收，本端 UI 不再写04；本项仅独占04性能段、WP10-client-modules对应段和原任务，保留main现有UI稿。无引擎／设备采集／生成实验；普通原生 Workflow 实施，由宿主取得一次独立只读复核，指定结果分支发布后交 dot-B。

## 交接（本地协作会话 → dot-B）

- **状态：** `review_ready`；待宿主做一次独立只读语义复核并提交／发布到结果分支。本会话未 commit／push、未合入 `main`，不声明独立审查或发布；机械自查不等于独立验收。
- **实际通道：** Claude Code＋DeepSeek 普通原生 Workflow（实施＋一次只读机械检查）；父调用原始 assistant `message.model` 为 `deepseek-flash`；请求别名另记 `deepseek-v4.1-flash[1m]`，不据别名推断后端。未调用额外 agent／reviewer／Explore／CLI 模型／嵌套 Workflow；独立语义复核由宿主另行取得。
- **开工基线与归属：** 开工重核 `origin/main` = `a3b91a8c4f8af34c52c69c9ee3ecd165c4e19630`（已含 `77e827ded75b0eb826f58f5b517bcdbc6e35e178` UI 接收及 `dc08b2f` 音乐任务回传；`a3b91a8` 本身只导入当前任务）；本工作树与 `origin/main` 一致，无领先提交。当前 `main` 的 UI 新稿保留；本项只改 04 性能段、WP10-client-modules 首发帧时间段和本任务，未碰 04 菜单／UI 等其他段、wp10-content／wp10-motion、05、资产页或共享 TASKS。
- **Workflow 原稿标识（修订后以最终提交为准）：** `domains/game-dev/04-client-modules.md` blob `e7454296da003c0156f945c854ffa391c5a4420c`；`docs/research/2026-10-14-game-wp10-client-modules.md` blob `13e7e027b9edf34ab384b9198483a718c8c2ac0a`。结果提交 SHA 由宿主提交后生成；本会话不预先冒称远端 SHA。
- **改变的实现起点：**
  - 04 `### 压低卡顿与设备耗用` 重排为：三类现象与流程图；设备预算；四个建议标记；线程／等待分类；IO／解码／初始化／上传／首绘；等价状态内存五类保留；可证伪归因与最小补丁；发布构建复核；粒子；第二次需求；给 AI 的两轮任务。保 `#设备预算量最坏场景不抄通用面数`、`#首次技能准备到能回应而不只是加载完成` 等现有锚点，新增内容不另造监控平台。
  - WP10 `## 首发帧时间补研：从资源已加载到动作可见` 补：采集方式与采样开销、Unity 6000.3 标记语义与 UE 5.8 线程／等待、五段加载路径、Memory Profiler 1.1.11 等价状态快照与引用链、Release 复核、二改判断；保主锚点及既有 `### 1`–`### 5` 子锚点，新增 `#### 1.1`／`1.2`／`2.1`–`2.3`／`4.1`／`### 6`。
  - 四个标记 `PrepareEncounter`／`ActivateEncounter`／`SpawnWave`／`ReleaseEncounter` 全文明确为项目建议语义，不是引擎内置 API；Unity 用 `ProfilerMarker`，UE 用 `TRACE_CPUPROFILER_EVENT_SCOPE`，并区分 Editor／Player、Development／Release、Unity／UE。
- **已验证范围：**
  - `python3 scripts/check_repo.py`：382 文件，0 错误；`python3 scripts/check_public.py`：643 文件，0 命中；`git diff --check` 通过；两个文件的 Markdown 表格列数一致性检查通过；关键术语（四标记、三类现象、五段加载、五类内存、二改、发布构建、最小补丁、同条件）逐项检索存在。
  - 只读官方文档：Unity 6000.3 Profiler markers／CPU Usage／Profiler window／Frame Debugger／ProfilerMarker／ProfilerRecorder／FrameTimingManager／Asset Loading／File Access／Memory Profiler 1.1.11 window／snapshot comparison／CaptureFlags／memory overview／UnloadUnusedAssets；UE 5.8 Insights／Timing Insights／Memory Insights／Trace developer guide／stat commands；复用既有 PSO／加载／池化／DRS／粒子／呈现节奏材料。未重做工具榜、联通或监测。
  - 未运行引擎、GUI、真实设备采集、生成模型或游戏；未安装权重、服务、新权限或费用；未读私有工程／采集／凭据／公司材料；未 TLS 绕过。个别官方页因环境网络限制未取到正文，已改用同版本 API／手册页核对，未把未读页面当已核。
- **真实待验项：**
  - 目标设备上的帧间隔分布、首次进房尖峰、持续掉帧位置、稳态／峰值内存、冷启动与加载到首可见／可操作，均未实测；文中没有收益数字。
  - Release 构建复核路径（Unity FrameTimingManager／ProfilerRecorder、UE 非 Shipping 配置与目标版本 trace 可用性）未在真实构建运行；UE Shipping trace 可用性需按项目引擎源码核。
  - 第二次需求的新敌人／材质／更大波次未运行；瓶颈是否转移、旧补丁是否仍值得仅是判断框架。
  - 画面可读性、输入反馈、最低设备体验与是否保留补丁由人验；AI 只交采集／解释／修改与同条件复核任务。
- **发布检查待宿主：** 本会话无领先提交，`python3 scripts/check_public.py --commits origin/main..HEAD` 不能覆盖本次工作树产物；宿主提交后应按手册§7跑该扫描、`git diff --cached --check`、读一遍 `git diff` 并核提交身份，再发布结果分支。接收：dot-B。

## 宿主独立复核与修订

原生 Workflow 14:18:28–14:36:17 UTC 完成后，本宿主另取与实施上下文分离的只读 code-reviewer，核原需求、指定三文件及关键官方原文，发现托管堆保留与活对象持有混同、同步 CPU scope 与跨异步阶段经过时间混同两项问题。宿主已最小修正两文：live/used 回落但 reserved/空闲堆高时先核稳定性、预算、峰值分配／碎片化；只有超寿命活对象才追引用与所有者。原生 scope 只圈同步片段、退出／异常成对关闭，不跨 await/yield；异步阶段沿既有身份关联起止时间／帧号并对齐原生时间轴。Release 明确 Begin/End 移除而 Auto 保留少量开销且不采样。

原复核者差量复核确认核心发现关闭，指出的一处“托管保留→清引用”同义残留已改为“超出既定寿命的托管活对象仍被引用”；旧内容 blob 明确只标识 Workflow 原稿，不冒称最终修订。基线元数据已按真实 UI／音乐回传／当前认领链校正。没有再开全文审查、新 Workflow、引擎或设备实验。目标机收益、实际采集、发布构建和新内容二改均未实测；本次交付为制作／分析／最小修补蓝图，状态 review_ready，dot-B 接收。

固定最终交付 `5840e99bf760ded213b2144ae20f3bcc051012d8`，结果分支 `relay/b-performance-workflow-module-001`，仅三份指定文件。状态 review_ready，已发布，dot-B 接收。宿主文档检查 382 文件零错误、实际新增提交公开扫描 643 文件零命中、差异空白检查通过；未运行真实引擎／设备／游戏或编造收益。

## dot-B 接收（2026-10-25）

接收固定最终结果 `5840e99bf760ded213b2144ae20f3bcc051012d8`。复用原生 Workflow 完成后宿主另取、与实施上下文分离的 code-reviewer 审查及同审定向关闭；保留原稿 blob、两项发现和修订历史，不重新全篇审查。

接收抽读正常遭遇采集、主线程／worker／GPU／等待分类、五段加载、等价状态内存、可证伪归因与最小补丁、发布构建复核和新内容二改。核修订已分清 live/used 与 reserved、同步 CPU scope 与异步经过时间；未发现必须修复项，两正文保留固定稿。04 改动仅性能段，菜单／角色／资源等其他段不变。

整合最新 main 后按文档范围核本地目标、公开文件、实际新增提交身份、diff／cached 空白；仅补 B 模块行，保留 pilot 核心待确认与批量暂停状态。交付是诊断／实施蓝图，不是实测优化：目标设备、引擎采集、发布包、帧时间／内存收益和二改体验均未运行；未新开 Workflow、reader、设备实验或完整 offline。
