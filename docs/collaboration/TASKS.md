# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 修订权限与条数按[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)，只留未完成纠偏。

## 11-06 Dot-A/B 临时表现纠偏（不改变 v1.3，不等待 v1.4）

> 依据 11-06 最新 main、local-jobs 回执、三个产品仓库 main 和 Phase 3 记录。只纠偏当前工作选择与收口，不新增调度系统、不扩大权限、不要求 Claude 额度。

- **Dot-A：先收口已有交付，不再扩研究队列。**
  1. 先核对当前全部 `review_ready` 卡（TASKS 静态快照为 8 张）及其 result_branch/产物，逐项分类为：证据足够可接收、需一次明确补验、部分接收并保留欠项、拒绝/放弃。不得把 `review_ready` 当作已验收，也不得无限等待。
  2. 优先完成 [账号上下文来源](local-jobs/A-ACCOUNT-CONTEXT-PUBLIC-SOURCES-20261106.md) 与 [Compaction 来源保真](local-jobs/A-COMPACTION-PROVENANCE-SOURCES-20261106.md) 的独立审查和采用决定；两者目前只有部分成稿、审查未完成，不得写成完整通过。另核 [Sentry 迁移合同](local-jobs/A-SENTRY-MIGRATION-CONTRACT-20261103.md) 与其他 review_ready 项的年龄和读者价值。
  3. [长任务离线读者](local-jobs/A-LONG-ROUTE-OFFLINE-READER-20261106.md) 已有真实修复进入 main（19fdff08），不要重复实现；只处理 POSIX 完整离线检查未运行、Windows 环境边界等明确欠项，或记录为环境限制。
  4. 在上述 review_ready 形成处置前，暂停新增广扫、Hook、模板/测试框架类新任务；允许无依赖且能直接改善读者答案页/地图的一个高价值单元继续。每项结束必须写出正式页面/真实采用变化，或明确不采用理由。
  5. 本轮回报只给：review_ready 总数及逐项处置、进入 main/正式页面的实际成果、仍阻塞项及恢复条件、下一项唯一最高价值工作。Git 静态 0 ready/running 不得描述为本机停工。

- **Dot-B：先完成产品品质闭环，再扩展工具和素材。**
  1. **Star 唯一优先品质槽**：[B-STAR-QUALITY-CAPTURE](local-jobs/B-STAR-QUALITY-CAPTURE-20261106.md) 仍为 ready、无结果分支/可读 PNG；但其他非 Star 卡已有领取/回交，不能继续用“整机离线”解释。先通过现有接收端合法状态确认同 ID 是否已有调用、是否占用拍摄槽及真实阻塞原因。若状态 unknown，不重派、不启动第二份、不清锁、不绕过曾被拒的检查；先推进其他独立工作并记录恢复条件。若确认原调用不存在、槽空且原卡合同允许自然领取，再沿同一 ID 继续。验收仍是 12 张同机位图、非作者盲评和记分卡真实分数变化，不以脚本/CPU/部署/出图命令成功替代。
  2. **FPS：** 先把已接收的角色 adapter、reload/switch 源动作和现有音频候选收敛到实际训练赛/完整回合。产品 main 仍停在 fa8740de；不得把分支候选、430 测试或 adapter 21/21 单测说成产品品质改善。若受浏览器 socket EPERM 限制，记录为局部浏览器门槛，继续不依赖浏览器的独立任务，不绕过权限。
  3. **MOBA：** 严格按单线大乱斗及阶段 A/B/C。当前阶段 A 优先让已存在的赏金、Q/W、死亡反馈形成真实玩家可见的 HUD/动画/战斗反馈；已有 ready 卡 [赏金 HUD](local-jobs/B-MOBA-GOLD-HUD-20261106.md) 与 [Q/W 连续输入](local-jobs/B-MOBA-QUEUED-SKILLS-20261106.md) 按依赖和槽位择一执行，不同时堆更多候选。CPU 事件正确不等于玩家可读。
  4. 核心模块、制作链、AI 游戏实例只接收能明确改变现有正文或案例的差量；停止无采用路径的来源收集、独立素材工具和重复工具卡。新工具任务必须写明目标案例、接入点、实际运行/画面/声音/操作验收。
  5. B 本轮回报只给：每个案例正式产品 main 的实际变化、工具/知识进入产品的证据、最高层级质量证据（源码/测试/运行/视听/实玩）、Star 当前阻塞与恢复条件。不得用 a1dbv 提交数代替三个产品仓库进展。

- **共同：阻塞只局部隔离。** 一次 Git/网络/浏览器/权限失败只暂停真实依赖的动作；重新核对当前状态，不继承旧失败为全局限制；停止无变化重复重试；继续其他已授权独立工作。不得绕过权限、凭据、不可逆副作用或平台拒绝。每次回报必须有新证据、新行动或明确恢复条件。

- **B 临时纠偏**：优先跑通 Star：本机固定出图 → 后台非作者盲评 → 最大差距整层修改 → 同机位重拍 → 更新记分卡；完成条件：“Star 记分卡有一次带同机位图的分数变化”，完成即删。仅过 CPU 测试的工具／素材不计品质进展；闭环前只暂停 Star 同类中间工具卡与素材卡。其他案例、核心模块、制作链、AI 游戏实例照常，每线 3–6 张 ready 本机卡；三案候选验收与手感欠项保留。MOBA 先读失败原因并修好再排，同一时间只排一张出图卡。人听、人玩的攒批进[待人工验收](#待人工验收)；在做工作每小时推工作分支。
- **共同**：B 在下一项帧同步或存档接入里，从[共享指令](../decisions/instruction-files.md)、[模型与 effort](../decisions/model-roles.md)、[依赖定位](../decisions/skills-and-plugins.md)中任选一项沿原入口采用；下次自然 UI 变更由新读者照[浏览器验收](../decisions/verification.md)实操补验，不以截图／静态 DOM 替代。各项结果写进提交说明后从本行删除。


## Phase 3：7 天效果验证（11-04 至 11-11）

每日记录、Day 1／3／7 检查、判定口径和提前干预见 [Phase 3 验证计划](phase3-validation.md)。

## 专业审计

波次、brief、报告与综合以 [Audit Workspace](reviews/audit-workspace/README.md) 的[波次登记](reviews/audit-workspace/WAVE-REGISTER.md)为准。意见去向按 [SPEC §8](AUTONOMOUS-WORK-SYSTEM-SPEC-v1.3.md#8-指导与专业审计)：内容意见由 Dot-A／B 决定，方向与规则交 Claude 核心会话；只有接受的建议才转为任务。

## 分工

- 职责按 [AGENTS](../../AGENTS.md) 与[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)；本机任务走 [local-jobs](local-jobs/README.md)，两项清理仍按原收窄范围接续。
- 10-26 历史已获准改写：开工 `git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune`，按远端重建分支，不推旧历史。
- 11-06 main `1af556cd`：A 卡 83 accepted／13 cancelled／8 review_ready（含 [Sentry](local-jobs/A-SENTRY-MIGRATION-CONTRACT-20261103.md)）／5 blocked，0 ready/running。仅 Git 静态状态，本机活动 unknown，非退出证明。

- **B 出图等待**（11-06 08:34 UTC）：[Star 唯一卡](local-jobs/B-STAR-QUALITY-CAPTURE-20261106.md)自 03:28 仍 ready、无结果分支；其后其他卡持续领取／回交，不能归因整机离线。Star 调用／未领取原因 unknown，不重派。

## 项目板

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿与 M6**：候选入收件箱，漏检入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | 按 explore-frontier 广扫，推进读者地图 🟡／⏳。 |
| P81 | **试用与选择**：实作回流决策页／模板 | dot-A | [MODEL](local-jobs/A-MODEL-EFFORT-READER-20261029.md) 待接收；跟进 [Datasette #3015](https://github.com/simonw/datasette/pull/3015)；[Memos #6502](https://github.com/usememos/memos/pull/6502) 有冲突，仅跟反馈，QA cancelled。Qwen [旧基线](../../experiments/candidate-reset-recovery/README.md)构建／类型／409 测试通过。#15757 已合、#15741 关闭；静读 `dd020ddf`：旧14例中6例过时／8例待验，保留已合分页／重名策略。全套 socket 仍被拒，原动作获准后补 PR 门槛。Skills 待新读者实做，任务正文附全文；先核写者退出／空槽；本机禁安装，[越界](local-jobs/A-SKILL-PACKAGE-ENTRY-20261030.md#指导层交接)交 Claude 核心。  A→B FPS 2a789cc Py3.12.14: invalid-structure≠invalid-json;exit2. |
| MOBA | **MOBA-Like 战斗与完整内容**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | main [`7e1986f`](https://github.com/dbvv1/MOBA-Like/blob/7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64/docs/side-release-acceptance.md)；quiet、镜头＋Q/W 共 3 候选，v12 前摇排队及出图保留。赏金事件已接、无可见提示。Site **v22 已部署**（运行源 002ae06）；新局失败保旧档，568 测试通过；线上默认／QW 398／342 tick、旧档保留通过，破坏性替换未实玩。恢复遮挡 8px 修复保留；窄屏／长滚动／无档、画面／听感／盲评待验。 |
| B-模块 | **核心模块**（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 07／04／05 已入 main（源码／CPU）；[FPS 前台时钟](../../domains/game-dev/04-client-modules.md#web-foreground-clock)接 v20，三入口两轮通过。[改键与六席读者](core-reader-intake-20261106.md)已接正文：改键47项／类型通过；六席9081 tick同构实例一致，共享指令采用未完成。浏览器沿旧证据，原生／设备／新版首次照做未验；Unity 实跑原任务暂停。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | [成套重导出](../../domains/game-dev/assets/3d.md#asset-family-rebuild)已接；[四件源包](local-jobs/B-FPS-CONTENT-SET-001.md)通路／命中未接。MOBA [quiet 材质](../../domains/game-dev/assets/materials.md#quiet-material-family)已接旁置，复用三图／保护区／标准件，画面未验。开放音频未听未用，Nature 恢复未知。3D：网关三源实测见 [3D 页](../../domains/game-dev/assets/3d.md)，本机`gen3d`／`glbprep`可用；按实测采用 3–5 件标准件。 |
| B-实例 | **AI 游戏实例**：作品／作者过程／社区反馈 | dot-B | [三份探索处置](b-work-20261106.md#三份实例探索处置)：仅收 Bichitos 触控识别与 Solhex 章节计时机制，发布迭代本轮不收，不扩表。原场景氛围来源已入[制作链](../../domains/game-dev/assets/materials.md#scene-atmosphere-revision)。均不新增品质推荐；Void Balls 启动失败、Warpact 未玩及原实机欠项保留，不重派。 |
| SR | **Star-Rush 比赛品质**：地平线公路弯道，保留跑圈 | dot-B | Site **v10 已部署**（11-06 02:53 UTC；产品源 811646e／Site 源 5c78194），海岸旁置已见街屋，默认入口不变。[唯一品质出图卡](local-jobs/B-STAR-QUALITY-CAPTURE-20261106.md)仍 ready：两版三机位双拍／盲评未交；正式分、手感／听感及原 403／旧退出 unknown 欠项保留。 |
| FPS | **FPS-Like 完整回合品质** | dot-B | main [`fa8740d`](https://github.com/dbvv1/FPS-Like/commit/fa8740de3bf2f4ffaaabec5c8df09d9f4c9088c8) 已接[离线角色 adapter](local-jobs/B-FPS-TRAINING-CHARACTER-ADAPTER-20261104.md)，训练赛未接线；旧 fire 强清除缺切枪历史，reload/switch 源动作及画面验收待补，不计品质。原返工 Workflow／CLI 已退出，外层 worker 独立退出未知。430 测试／构建及另跑 adapter 21/21 通过。全场材质／ground 旁置、固定出图与迟到锁销毁修复保留；Site **v24 已部署**，线上仅默认菜单到达，shell HTTP 403，不绕过。默认／ground 各 2×144、四路暂停恢复及旧 Canvas 六回合证据保留；完整线上、WebGL smoke、图／手感／盲评待验。腰腿 `fc64c2b` CPU 已收，原执行退出未知。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材／木筏／旧档待客户端验收。 |

## 待人工验收

用户择时验[本批](b-work-20261106.md#待人工验收)；其余照常。

- FPS-Like：原／受伤混音各一段交火，核命中/受伤可辨、敌枪掩蔽和疲劳；v12 用原混音。
- MOBA-Like：[可玩入口与操作](https://github.com/dbvv1/MOBA-Like/blob/main/README.md)的硬件 GPU 画面、操作手感与完整对局体验；软件 WebGL2 smoke 已通过。
- Star-Rush：[公路候选](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road)的整体手感、视听与硬件画面；海岸环境声开关对比试听。
- 潮汐邮差 v2：素材、木筏与旧档。

## 需要用户决定

仅停对应动作。三站部署、Star 原 blob 与 LOB 授权沿用；完成记录见[归档](archive/completed-through-2026-11-04.txt)，LOB 剩余验收见下表。

| 事项 | 等什么 | 期间照常做／批准后首步 |
|---|---|---|
| 云端截图 | MOBA 线上 `NET::ERR_CERT_AUTHORITY_INVALID`，待可信证书链后复验 | 本地 `27a40be`／Site v16：WebGL2 四路 smoke、四机位双重复通过；两非作者判小幅改善，正式评分待补。获准 `--no-sandbox`；已留 renderer／参数（SwiftShader software），exit 0、端口关闭。 |
| LOB 外部试玩 | 已授权；实见原生 checkpoint 续局至第 25 关失败终局及从第一关重开；非连续整局、全程静音 | 第 21 关断连后续局重置分数／弹药／地形，不合并为连续成绩；连续完整一局、胜利与听感未验。详见[实玩范围](../research/2026-10-23-game-worth-trying.md)。 |

## 已停止的动作

jrnl／agents-md-lint／testmon 已停止，见[原文](archive/completed-through-2026-11-03.txt)；拒绝不重试／换入口。Serena 仍[跟进已有 PR #2242](../../experiments/serena-vue-implementation/README.md)，不重复投稿。

其他：Maka #4495 评论因集成 403 未发出，停止投稿／追发；MOBA 第三方素材官方取回 HTTP 403，改由本机接收端代取；P107 与 Action 调试 10f6a6db 被平台拒绝，待补齐命令／用途，由用户在 Dot 批准。
