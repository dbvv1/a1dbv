# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 只放带完成条件的临时纠偏，最多三条，做完即删，dot 不改；方向与优先级在长期提示词（手册§6）。

- **A**：在途按原边界安全收尾，同时收口窄工具考证，将强源、替代和反例合成[长程开发路线](../decisions/long-tasks.md)及模板，在真实主线任务采用并修正卡点；交付后自然接续，以 Activity／心跳核证后删本行。其他核心问题与未知前沿并行，保留欠项，不重派四张已取消广扫；长期可靠性继续观察。心跳每小时；11-02 UTC 14:18、15:25、15:57、17:04、17:56、18:59 均唤醒并派只读查对，但15–19时误以缺新完整目标暂停本机派单、未续独立就绪页与广扫，未交付地图／模板；19:45恢复派发。
- **B**：三案默认分支自 10-30 未更新，已保全的 FPS 全场材质 `8c29cec8`、MOBA 镜头＋Q/W `7a2234e7`、Star 连续空间与峰后轮胎按[细则§6](game-taskbook.md#6-作品案例)第 3 条新旁置门槛先发布，再按其轮转派单（Star 最久未发布，先派）。云浏览器：用户 10-30、11-03 允许 `--no-sandbox`、`--enable-unsafe-swiftshader` 与 `--use-angle=swiftshader`，只用于打开三案自有页面，外层沙箱不动；按[恢复入口](../../experiments/cloud-browser-recovery/README.md)验到非空 WebGL2 图、参数、renderer 与正常退出后，补跑积压候选的完整 smoke、同机位图与盲评。手感三项（FPS 加速度／摩擦／插值，MOBA 施法中下一技能结束当 tick 执行，Star 轮胎峰后下降／载荷转移及动力测法）按同一门槛发布，前后值写入 feel.md 与记分卡。三案各有新的旁置发布、出图命令可用、三项手感候选已发布后删除本行。
- **共同**：B 在下一项帧同步或存档接入里，从[共享指令](../decisions/instruction-files.md)、[模型与 effort](../decisions/model-roles.md)、[依赖定位](../decisions/skills-and-plugins.md)中任选一项沿原入口采用；下次自然 UI 变更由新读者照[浏览器验收](../decisions/verification.md)实操补验，不以截图／静态 DOM 替代。各项结果写进提交说明后从本行删除。

## 分工

- [分工](../../AGENTS.md)：A：AI coding／M6；B：游戏 AI 全链路／核心模块；[案例](game-taskbook.md#6-作品案例)。
- 本机由 [local-jobs](local-jobs/README.md) 固定接收器领取；旧 Codex 接收器退役，两项清理按收窄范围接续。
- 指导层（手册§6）：Claude 核心管方向／优化／A、B 指导；Codex 会话执行明确子项（含本机接收端）；本机模型做已定单元。
- 10-26 历史已获准改写：开工 `git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune`，按远端重建分支，不推旧历史。
- 11-03 UTC 10:36–11:16，[Sentry](local-jobs/A-SENTRY-MIGRATION-CONTRACT-20261103.md) 仍 ready 未领取；另四项已领取，当前实际活动／原因未知；已按§3提示检查本机开机、登录。

## 项目板

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿与 M6**：候选入收件箱，漏检入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | 按 explore-frontier 广扫，推进读者地图 🟡／⏳。 |
| P81 | **试用与选择**：实作回流决策页／模板 | dot-A | [MODEL](local-jobs/A-MODEL-EFFORT-READER-20261029.md) 待接收；跟进 [Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502)。Qwen [旧基线](../../experiments/candidate-reset-recovery/README.md)构建／类型／409 测试通过。#15757 已合、#15741 关闭；静读 `dd020ddf`：旧14例中6例过时／8例待验，保留已合分页／重名策略。全套 socket 仍被拒，原动作获准后补 PR 门槛。Skills 待新读者实做，任务正文附全文；先核写者退出／空槽；本机禁安装，[越界](local-jobs/A-SKILL-PACKAGE-ENTRY-20261030.md#指导层交接)交 Claude 核心。 |
| MOBA | **MOBA-Like 战斗与完整内容**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | main [`a829005`](https://github.com/dbvv1/MOBA-Like/blob/a8290054f7e1828ff8909a7633ccc3443a282e58/docs/side-release-acceptance.md)quiet 替换旧 stylized，总候选 3；镜头＋Q/W、v12 前摇排队及出图保留。赏金派生事件已接、无可见提示，旧回放一致。Site **v22 已部署**（运行源 002ae06）；新局失败保旧档，568 测试通过；线上默认／QW 398／342 tick、旧档保留通过，破坏性替换未实玩。原恢复遮挡 8px 修复保留；窄屏／长滚动／无档未验；画面／听感／盲评待验。 |
| B-模块 | **核心模块**（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 07 ready `a0ea312`、04 boot `a1b149`／input `d55e04e`、05 生命周期 `bb807ab` 已入 main；原实验仅源码／CPU；04 [FPS 前台时钟与输入折叠](../../domains/game-dev/04-client-modules.md#web-foreground-clock)已接可玩 v20（`1183340`），三入口各两轮普通生命周期通过（software，不升原生引擎评级）。Star v7 存档、MOBA `ea7a064` 实操为旧成果；改键 `89f0831` 候选。[Unity 源准备](../../experiments/unity-encounter/README.md)未实跑，原任务暂停。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | FPS [四件源包](local-jobs/B-FPS-CONTENT-SET-001.md)已接收，旧通路／命中接线待恢复。MOBA [quiet 材质](../../domains/game-dev/assets/materials.md#quiet-material-family)已接旁置，复用三图／保护区／标准件，画面未验。开放音频未听未用，Nature 恢复未知。3D：网关三源同提示实测见 [3D 页](../../domains/game-dev/assets/3d.md)，本机 `gen3d`／`glbprep` 可用；各案例采用 3–5 件标准件，按实测分工。 |
| B-实例 | **AI 游戏实例**：作品／作者过程／社区反馈 | dot-B | [Void Balls 制作线索](local-jobs/B-AI-GAME-SUPPLY-SOURCES-20261027.md)已接收；启动遇 WebGL 不支持／连接失败，未进游戏／听音；Warpact 未玩，无新增整局品质推荐。 |
| SR | **Star-Rush 比赛品质**：地平线公路弯道，保留跑圈 | dot-B | master `b43a938`／Site **v9 已部署**；连续空间＋峰后轮胎整合 `853a3c3` 171 测试／构建／整局与曲线／浏览器门槛通过，Git 已写入，含固定出图；线上仅默认菜单到达，shell HTTP 403，完整线上验收未通过、不绕过。默认／空间／动力／组合实际推进 867／839／837／839 tick，Canvas2D 回退通过，3D／驾驶待判优；含 Rapier 共三项旁置。旧取消任务退出／清理未知，不重派。 |
| FPS | **FPS-Like 完整回合品质** | dot-B | main [`885a53c5`](https://github.com/dbvv1/FPS-Like/blob/885a53c542f42c4349c6e1d190f1ea8f4423c459/docs/quality.md)已合全场材质／ground 旁置及固定出图；Site **v23 已部署**；线上仅默认菜单到达，shell HTTP 403，完整线上验收未通过、不绕过。412 测试／构建／四路 2×144 tick 通过；默认与材质＋ground 两路 Canvas 自然六回合、换边、终局重开／暂停通过。WebGL smoke、图／ground 手感与盲评待验。腰腿 `fc64c2b` CPU 已收，原执行退出未知。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材／木筏／旧档待客户端验收。 |

## 待人工验收

用户择时验收；其余照常。

- FPS-Like：原混音／受伤声各一段交火录音，听命中与受伤是否可分、是否遮敌人枪声、久听是否疲劳；网页 v12 用原混音。
- MOBA-Like：[可玩入口与操作](https://github.com/dbvv1/MOBA-Like/blob/main/README.md)的硬件 GPU 画面、操作手感与完整对局体验；软件 WebGL2 smoke 已通过。
- Star-Rush：[公路候选](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road)的整体手感、视听与硬件画面；海岸环境声开关对比试听。
- 潮汐邮差 v2：素材、木筏与旧档。

## 需要用户决定

仅停对应动作；三站部署已获授权并完成，Star 原 blob 调用已成功，不再列待批；LOB 已获授权并完成下述有限实玩，心跳照常。

| 事项 | 等什么 | 期间照常做／批准后首步 |
|---|---|---|
| 云端截图 | MOBA 线上 `NET::ERR_CERT_AUTHORITY_INVALID`，待可信证书链后复验 | 本地 `27a40be`／Site v16：WebGL2 四路 smoke、四机位双重复通过；两非作者判小幅改善，正式评分待补。获准 `--no-sandbox`；已留 renderer／参数（SwiftShader software），exit 0、端口关闭。 |
| 三案固定出图与完整验收 | 固定 1280×720／dpr 1 代码整合／测试／构建通过；普通路径 FPS 两路 2×144、MOBA 默认 397／组合 352、Star 默认 1491／组合 1065 tick 复验通过，均 Canvas。Star 实拍需 WebGL2、无 PNG；FPS／MOBA 未实拍。 | 旁置不等硬件 GPU；捕获无 WebGL2 显式报错。FPS／Star 只导画布无 DOM HUD；参数／renderer 待核，不绕过 IPC 限制。完整 smoke／同机位／盲评卡换默认。 |
| LOB 外部试玩 | 已授权；实见原生 checkpoint 续局至第 25 关失败终局及从第一关重开；非连续整局、全程静音 | 第 21 关断连后续局重置分数／弹药／地形，不合并为连续成绩；连续完整一局、胜利与听感未验。详见[实玩范围](../research/2026-10-23-game-worth-trying.md)。 |

## 已停止的动作

jrnl／agents-md-lint／testmon 已停止，见[原文](archive/completed-through-2026-11-03.txt)；拒绝不重试／换入口。Serena 仍[跟进已有 PR #2242](../../experiments/serena-vue-implementation/README.md)，不重复投稿。

其他：Maka #4495 评论因集成 403 未发出，停止投稿／追发；MOBA 第三方素材官方取回 HTTP 403，改由本机接收端代取；P107 与 Action 调试 10f6a6db 被平台拒绝，待补齐命令／用途，由用户在 Dot 批准。
