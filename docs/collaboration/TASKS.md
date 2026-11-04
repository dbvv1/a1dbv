# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 修订权限与条数按[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)，只留未完成纠偏。

- **A**：收口窄工具考证，合成[长程开发路线](../decisions/long-tasks.md)与模板，在真实主线采用、修卡点；交付后以 Activity／心跳核自然接续后删本行。原在途安全收尾，其他核心问题与未知前沿并行；保留欠项，不重派四张已取消广扫，长期可靠性继续观察。唤醒与派发历史见[归档](archive/completed-through-2026-11-04.txt)。
- **B**：三案当前发布见项目板，后续按[细则§6](game-taskbook.md#6-作品案例)轮转；补齐候选完整验收。手感三项（FPS 加速度／摩擦／插值，MOBA 施法中下一技能结束当 tick 执行，Star 轮胎峰后下降／载荷转移及动力测法）按同一门槛发布，前后值写入 feel.md 与记分卡。三案各有新的旁置发布、出图命令可用、三项手感候选已发布后删除本行。
- **B 出图**：需要 WebGL2 的出图与 smoke 改由本机跑（11-04 用户决定，[细则§7](game-taskbook.md#7-下发本机模型的游戏任务)），一次一张卡；交回后补十机位图、目标图、盲评与材质整层。
- **共同**：B 在下一项帧同步或存档接入里，从[共享指令](../decisions/instruction-files.md)、[模型与 effort](../decisions/model-roles.md)、[依赖定位](../decisions/skills-and-plugins.md)中任选一项沿原入口采用；下次自然 UI 变更由新读者照[浏览器验收](../decisions/verification.md)实操补验，不以截图／静态 DOM 替代。各项结果写进提交说明后从本行删除。


## Phase 3：7 天快速效果验证（T0：2026-11-04；截止：2026-11-11）

> Phase 1（工作循环与规则精简）已基本落地；Phase 2（接收端差量修复）以本机生产 HEAD `8adeaf2c77e64e3e315156d8c05852a929576649` 完成交付。当前进入真实运行验证，不新增心跳或独立仪表盘。

- **每日**：Dot-A/B 在正常工作循环中记录实际成果、ready 队列、结果回传/接收等待、返工和阻塞；沿用现有心跳与接收端，不另建汇报任务。
- **Day 1（11-05）**：确认生产接收端、计划任务、A/B ready 队列和回传链正常；发现故障立即修复，不等观察期。
- **Day 3（11-07）**：中期检查 A/B 是否持续派发、本机任务是否有真实执行、结果是否及时接收、局部 unknown 是否仍导致全局停滞。
- **Day 7（11-11）**：阶段验收，对比基线，评估有效成果、队列供给、回传等待、待核活动缺口、用户介入、返工/质量和 Claude/Codex 资源使用。
- **判定口径**：无仓库交付且无本机运行证据只记“待核活动缺口”，不直接判停工；用户介入次数、云端 Activity 或费用不可观测时记 unknown。不得用提交数、心跳数或任务卡数代替有效成果。
- **提前干预**：ready 任务存在却持续不派发、结果长期无人接收、重复执行/覆盖产物、接收端故障或局部 unknown 阻塞独立工作时，立即处理，不等 Day 3/7。
- **验收产物**：复用现有 `progress.mjs` 报告与日志，形成一份 Phase 3 七天总结；样本不足的指标明确标记证据不足，不为按期结项而宣称成功。
- **阶段边界**：七天是首轮决策窗口，不代表已证明长期效果。若改善明确，转入正常运行；若仍有可复现瓶颈，再提出针对性任务，不自动建设 SQLite、通用调度器或新仪表盘。

## 分工

- 职责按 [AGENTS](../../AGENTS.md) 与[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)；本机任务走 [local-jobs](local-jobs/README.md)，两项清理仍按原收窄范围接续。
- 10-26 历史已获准改写：开工 `git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune`，按远端重建分支，不推旧历史。
- 11-03 UTC 10:36–11:16，[Sentry](local-jobs/A-SENTRY-MIGRATION-CONTRACT-20261103.md) 仍 ready 未领取；另四项已领取，当前实际活动／原因未知；已按§3提示检查本机开机、登录。

## 项目板

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿与 M6**：候选入收件箱，漏检入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | 按 explore-frontier 广扫，推进读者地图 🟡／⏳。 |
| P81 | **试用与选择**：实作回流决策页／模板 | dot-A | [MODEL](local-jobs/A-MODEL-EFFORT-READER-20261029.md) 待接收；跟进 [Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502)。Qwen [旧基线](../../experiments/candidate-reset-recovery/README.md)构建／类型／409 测试通过。#15757 已合、#15741 关闭；静读 `dd020ddf`：旧14例中6例过时／8例待验，保留已合分页／重名策略。全套 socket 仍被拒，原动作获准后补 PR 门槛。Skills 待新读者实做，任务正文附全文；先核写者退出／空槽；本机禁安装，[越界](local-jobs/A-SKILL-PACKAGE-ENTRY-20261030.md#指导层交接)交 Claude 核心。 |
| MOBA | **MOBA-Like 战斗与完整内容**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | main [`a829005`](https://github.com/dbvv1/MOBA-Like/blob/a8290054f7e1828ff8909a7633ccc3443a282e58/docs/side-release-acceptance.md)quiet 替换旧 stylized，总候选 3；镜头＋Q/W、v12 前摇排队及出图保留。赏金派生事件已接、无可见提示，旧回放一致。Site **v22 已部署**（运行源 002ae06）；新局失败保旧档，568 测试通过；线上默认／QW 398／342 tick、旧档保留通过，破坏性替换未实玩。原恢复遮挡 8px 修复保留；窄屏／长滚动／无档未验；画面／听感／盲评待验。 |
| B-模块 | **核心模块**（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 07 ready／04 boot-input／05 生命周期已入 main（源码／CPU）；[FPS 前台时钟](../../domains/game-dev/04-client-modules.md#web-foreground-clock)已接 v20，三入口两轮通过。Star v7 存档／MOBA `ea7a064` 为旧实操；[完整改键链](../../experiments/moba-keybindings/README.md)已在 MOBA main，45 项 CPU／DOM＋类型检查通过，历史浏览器验改键／刷新保留；原生／手柄／多人未验。[Unity 源准备](../../experiments/unity-encounter/README.md)未实跑，原任务暂停。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | [成套重导出](../../domains/game-dev/assets/3d.md#asset-family-rebuild)已接；[四件源包](local-jobs/B-FPS-CONTENT-SET-001.md)通路／命中未接。MOBA [quiet 材质](../../domains/game-dev/assets/materials.md#quiet-material-family)已接旁置，复用三图／保护区／标准件，画面未验。开放音频未听未用，Nature 恢复未知。3D：网关三源实测见 [3D 页](../../domains/game-dev/assets/3d.md)，本机`gen3d`／`glbprep`可用；按实测采用 3–5 件标准件。 |
| B-实例 | **AI 游戏实例**：作品／作者过程／社区反馈 | dot-B | [Void Balls 制作线索](local-jobs/B-AI-GAME-SUPPLY-SOURCES-20261027.md)已接收；启动遇 WebGL 不支持／连接失败，未进游戏／听音；Warpact 未玩，无新增整局品质推荐。 |
| SR | **Star-Rush 比赛品质**：地平线公路弯道，保留跑圈 | dot-B | master `b43a938`／Site **v9 已部署**；连续空间＋峰后轮胎整合 `853a3c3` 171 测试／构建／整局与曲线／浏览器门槛通过，Git 已写入，含固定出图；线上仅默认菜单到达，shell HTTP 403，完整线上验收未通过、不绕过。默认／空间／动力／组合实际推进 867／839／837／839 tick，Canvas2D 回退通过，3D／驾驶待判优；含 Rapier 共三项旁置。旧取消任务退出／清理未知，不重派。 |
| FPS | **FPS-Like 完整回合品质** | dot-B | main [`36fde4b`](https://github.com/dbvv1/FPS-Like/blob/36fde4bb6a2e8f9652528fdea648d0a90190db79/docs/client.md)已合全场材质／ground 旁置及固定出图；Site **v24 已部署**；线上仅默认菜单到达，shell HTTP 403，完整线上验收未通过、不绕过。迟到鼠标锁销毁修复：430 测试／构建、默认及 ground 各 2×144、四路暂停恢复通过；旧 Canvas 六回合证据保留。WebGL smoke、图／ground 手感与盲评待验。腰腿 `fc64c2b` CPU 已收，原执行退出未知。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材／木筏／旧档待客户端验收。 |

## 待人工验收

用户择时验收；其余照常。

- FPS-Like：原混音／受伤声各一段交火录音，听命中与受伤是否可分、是否遮敌人枪声、久听是否疲劳；网页 v12 用原混音。
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
