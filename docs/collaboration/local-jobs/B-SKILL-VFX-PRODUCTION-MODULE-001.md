# B-SKILL-VFX-PRODUCTION-MODULE-001 · 从技能逻辑到一族清楚且可修改的视觉表现

id: B-SKILL-VFX-PRODUCTION-MODULE-001
owner: dot-B
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 84bf2e3f5fff8ac5f737a36398c857e0a3c2cbb7
result_branch: relay/b-skill-vfx-production-module-001

## 完整问题

让没有专职特效美术的程序员，把一招蓄力射击做成同一视觉语言的预警、蓄力、释放、飞行、命中与余波，再扩成一族技能，而不是堆粒子或各阶段分别生一段视频。第一版一招，第二改增加同族扇形技能，两招同屏仍读得懂来源、方向、实际范围、进度与强度，保主次与节奏。不把内容缩回“缩短时间／取消不残留”的小题，也不新做工具排名。

现有材料已比较 Riot 可读性、Dragon Crashers 的 Prefab／Timeline、Effekseer TriggerLaser、KinemaFX 和 recipe 路线。本项将它们整合成可实施的生产模块：谁负责何时出现、需要哪个可编辑源、怎样接到已确认玩法事件与真实范围参数、第二次需求怎么复用。研究、作者自报、源码、实际生成／引擎和人看分清，不把未看效果说成品质通过。

## 做法与产物

先读 AGENTS、CLAUDE、dot-B 提示词、TASKS 当前重点、手册§7／operations§2.2；复用 `assets/materials.md` 与 WP5 既有固定证据，只补“参数驱动效果族”和“正常阶段接入”会改变默认的官方实现缺口。只读05当前技能模块，确认玩法事件、确认命中与范围参数如何进入表现，不复制第二套伤害／蓄力状态。

正文给明确制作 brief 和起点：来源、方向、范围、阶段进度、强度、目标占屏与优先级；ring、ribbon、flash、粒子／flipbook 各承载什么，何时复用原生组件／许可清楚现成源，何时由 AI 补纹理或可编辑结构。区分 Prefab／recipe／编辑配置作者源、派生纹理与运行实例，给同族参数边界和装配顺序；不得把本项目建议的参数名伪装成引擎内置 API。

用首版蓄力射击→同族扇形技能的二改说明：共享哪些色彩、轮廓、节奏和材料，实际攻击范围由谁给出，哪些结构不能只拉伸贴图，命中反馈怎样依据确认结果，两个高亮效果同时出现怎样保更紧急信息。AI 的实现任务要能接着做，不只是“生成好看特效”的提示词；作者选择与许可／处理／维护成本随方案说明。

仅改 `domains/game-dev/assets/materials.md` 的画面语言与技能特效相关段、`docs/research/2026-10-14-game-wp5-material-effects.md` 对应段，以及本任务。保其他材质、烟雾、轨迹、慢放、照明、预算与发行入口及既有锚点；合并被正文取代的重复推理，不新增零碎研究文档／证明清单。不碰03／04／05／2d／3d／animation／audio及共享TASKS。开工核最新main和同文件占用，不覆盖在制结果。

仅由既有本地协作会话使用已配置模型执行普通原生 Workflow（实施＋一次独立验证）。本任务不授权 dot 直接操作用户电脑，不新开引擎／生成模型实验，不下载权重、新建凭据、增加收费／权限或部署；只用公开许可材料，不读私有文件／凭据。特定拒绝独立保留，通道本身被明确拒绝则保产物、停该动作，不换路绕过。

按手册§7复用未变证据与检查，完成关键来源、正文、公开文件／新增提交身份和暂存差异检查。未运行／未看项目画面写待验，不为文稿强造实验。只推结果分支，回写 `review_ready`、实际通道、固定SHA、改变的制作选择、真实验证范围与待验项，由dot-B接收，不自行合入main。

认领：dot 本地协作；2026-10-25T12:53Z。来源负责人分支 `dot-b/tmp/20261025-skill-vfx-module-job` 固定 `15a2b51513559d2cb732ed3a7f2804135267d314`；只引入本任务，不合入内容分支。本端当前 2d／UI 任务不写 materials／WP5，本项独占指定画面语言与技能特效段及原任务；复用未变资料，不开引擎／生成实验，仅推结果分支，由 dot-B 接收。

## 交接（本地协作会话 → dot-B）

- 状态：`review_ready`（工作树；父会话提交后回填固定 SHA；未合入 main，本会话不自行发布）。
- 实际通道：Claude Code 本地协作会话（原生 Workflow，2 个 agent：implement、delivery-check）。请求别名 `deepseek-v4.1-flash[1m]`（原始 init 元数据）；原始 assistant `message.model` 在 `attempt-1/native.stdout.jsonl` 与两个 agent transcript 中均为 `deepseek-flash`。两者不一致，按原始值记录，不据别名推断后端。独立语义审查由根会话在 Workflow 结束后独立完成（不与实施 agent 共享上下文），结果见文末根审查小节；本实现会话不声明自审独立。
- 基线：任务 `base_ref` `84bf2e3f5fff8ac5f737a36398c857e0a3c2cbb7`；开工与当前 HEAD `d4acb3ec25fb6800518d1309b6dc11b5487cfdc8`（与 `origin/main` 同点，已含本任务文件）；结果分支 `relay/b-skill-vfx-production-module-001`。来源负责人分支固定 `15a2b51513559d2cb732ed3a7f2804135267d314` 只带入原任务，未合入其内容分支。
- 交付内容（正文／研究；本任务文件随附状态回写）：
  - `domains/game-dev/assets/materials.md` SHA-256 `a6e27d191054595727b1a965f8367f84595f498cfbc8a7a791ea4b5131001f52`
  - `docs/research/2026-10-14-game-wp5-material-effects.md` SHA-256 `bdb7b187c86e2d8000776a1e453b50803e64074b703f88ace27026d3de0767f1`
  - 提交 SHA 由父会话创建后回填；本会话不自行 commit／push。
- 改变的制作选择：
  1. 正文把技能特效从“保一份可编辑整招”推进为“阶段＋图层＋参数合同”的生产模块：制作 brief 七项（来源、方向、实际范围、阶段进度、强度、目标占屏、优先级）、ring／ribbon／flash／粒子／flipbook 责任分层、作者源／派生纹理／运行实例分开；范围与进度只读玩法参数，命中只接确认结果。
  2. 新增同族三级参数边界（族共享／每招／每次施放）和装配顺序；示意字段明确标为本项目约定、不是引擎 API；用配置校验拒绝未知阶段、越界角度和缺失绑定。
  3. 首版蓄力射击按预警→蓄力→释放→飞行→确认命中→余波六段接 05 正常链；二改扇形只换形状绑定和范围参数，扇环由玩法半径／角度生成，不拉伸 beam 贴图，多目标命中按确认结果合并，不按视觉射线计数。
  4. 两招同屏优先级定为来袭威胁 > 我方主动攻击 > 命中确认 > 余波；重叠时降低低优先级层亮度／频率／时长，不删高优先级边界；强度可同族缩放但不得伪装紧急度；占屏超限先减装饰与余波。
  5. 补会改变默认的官方契约缺口：VFX Graph Exposed／`SetFloat`／`SendEvent`、`VisualEffect.Stop`／`Reinit`、Particle System `Stop`／`StopEmittingAndClear`／`Stop Action`、Sub Emitters 的 burst 限制、Shape 的 Cone Angle／Arc、Niagara `SetVariableFloat`／`ResetSystem`；明确停发／重置不等于取消或命中。
  6. 保留旧来源反证与边界（Dragon Crashers 的 Prefab／Timeline、Effekseer `TriggerLaser`、effekseer-vfx-skill recipe 的 `release()` 与未验 Linux／GPU）；删去被正文取代的重复人检句，选源、许可／处理与维护成本合并到模块末。
  7. 研究新增一节记录官方事实、参数分级、两招同屏验收设计与未验边界；未新增零碎研究文档、证明台账或工具排名。
- 读取范围：已读 `AGENTS.md`、`CLAUDE.md`、长期 dot-B 提示词、`docs/collaboration/TASKS.md` 当前重点、运行手册 §7、`operations.md` §2.2、本任务及来源分支任务文本；通读 `domains/game-dev/assets/materials.md` 与 `docs/research/2026-10-14-game-wp5-material-effects.md`；只读 `domains/game-dev/05-gameplay-architecture.md` §7 的施放／效果／表现所有者、正常链、配置与二改，未改 05。另核 Unity 6000.3／VFX Graph 17.3 与 UE 当前公开 API 页；未读私有文件、凭据或公司资料。
- 真实检查范围：
  - `python3 scripts/check_repo.py`：380 文件，0 error（仅内联本地链接目标；片段不检）。
  - `python3 scripts/check_public.py`：641 文件，0 findings（模式扫描，不等同人工安全审阅）。
  - `git diff --check`：通过。
  - 另用本地脚本按 GitHub 风格 slug 核对两文件全部本地链接片段（含跨文件到 05）：0 missing。
  - 未运行完整 `check_offline.py`（纯文档改动，按手册§7只跑适用检查）；未暂存、未提交。无新提交时预跑 `check_public.py --commits origin/main..HEAD` 为 0 findings、`git diff --cached --check` 通过；提交身份扫描需新提交，由父会话提交后执行。
  - 开工占用核对：在目标文件范围内，`origin/main` 仅比任务 base 多本任务文件；最近远程分支与其他在制工作树（2D、UI）均未修改 materials／WP5，无同文件占用。
- 未验项／保留事实：
  - 未运行 Unity／Unreal／Effekseer、未生成资产、未做阶段截图或两招同屏人看；未取得视觉可读性、手感、取消残留、占屏与帧成本证据。正文的“待验”不是品质通过。
  - 动态事实只核本轮会改变选择的官方 API 页；既有许可、价格、版本与来源沿用原文日期，未刷新全部来源，未重做工具排名或实验。
  - 目标占屏、优先级和强度上限是设计起点，不是实测阈值；族参数字段名是项目示意约定，不是引擎内置 API。
- 接收：dot-B 接收；本会话不自行合入 main、不声明独立审查；父会话负责提交与推送结果分支。

## 根会话独立语义审查与发布（2026-10-25）

> 本节在实现交接之后追加；与上文“工作树／待提交”表述冲突时，以本节为最终状态。

- 审查对象：内容提交 `83c7122771ed6d8639a46669a72c2daa050fc43a` 的三文件差量；根会话在 Workflow 结束后独立阅读正文、研究记录与任务文件，不使用嵌套 reviewer、Explore、CLI 模型或另一个 Workflow。
- 结论：**未发现范围内语义缺陷，可接收**。七项 brief、ring／ribbon／flash／粒子／flipbook 责任、作者源／派生纹理／运行实例分离、族／每招／每次施放三级参数、装配顺序、首版六段链、二改扇形与并发优先级均覆盖；05 保持只读，其他材质、烟雾、轨迹、慢放、照明、预算与发行入口未改。
- 官方声明复核：逐条对照 Unity 6000.3／VFX Graph 17.3 与 UE 当前页面——Stop Action 需粒子全灭且 age 超过 Duration；Sub Emitters 仅 Birth 支持多项 burst，Collision／Death／Trigger／Manual 单 burst；Shape Arc 与 Cone Angle；ParticleSystem.Stop 默认 StopEmitting；VisualEffect.Stop 仅向 Spawn 系统发停止事件、未承诺清空；Reinit 恢复初始状态、内部时间归零并重发 initial event；SetFloat 自动标 overridden；Blackboard Exposed 可经组件与 C# 读写；Niagara SetVariableFloat／SetVariableVec3 局部覆盖、ResetSystem 回初始模拟状态、Deactivate 无描述。未发现正文把这些说成玩法状态或取消语义。
- 根审查修正：只做两处精度修正——交接中的原始模型元数据改为实读值（raw `message.model` = `deepseek-flash`；请求别名 `deepseek-v4.1-flash[1m]`），以及把取消收费／退款句限定为 05 的本例政策（其他招式可另定）。未扩大范围。
- 机械检查（内容提交后）：`check_repo.py` 380 文件 0 error；`check_public.py` 641 文件 0 findings；`check_public.py --commits origin/main..HEAD` 0 findings；`git diff --check` 与 `git diff --cached --check` 通过；提交身份 `Codex Local Executor <codex@users.noreply.github.com>` 为 noreply 白名单身份。未跑完整 `check_offline.py`（纯文档，按手册§7只跑适用检查）。
- 发布范围：仅结果分支 `relay/b-skill-vfx-production-module-001`；未合入 main，未强推。固定内容 SHA：`83c7122771ed6d8639a46669a72c2daa050fc43a`；本审查记录提交即推送后的分支 HEAD（根会话在交接回复中回报完整 SHA）。
- 未验项：未运行 Unity／Unreal／Effekseer、未生成资产、未做阶段截图或两招同屏人看；视觉可读性、手感、取消残留、占屏与帧成本均未取得证据；动态事实沿用原文日期，未刷新全部来源。不得把本文件或正文写成品质通过。
