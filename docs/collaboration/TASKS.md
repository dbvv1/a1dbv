# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 修订权限与条数按[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)，只留未完成纠偏。

## 11-06 Dot-A/B 临时表现纠偏（不改变 v1.3，不等待 v1.4）

[11-06 完整纠偏原文](https://github.com/dbvv1/a1dbv/blob/7128f6cf2390e8ca9f6bc92cd3806861c874e56e/docs/collaboration/TASKS.md)保留完整范围、权限和原入口；不新增调度系统或额度要求。

- **A 先收旧交付**：核全量review_ready（快照8）：接收／一次补验／部分接收／拒绝。优先账号上下文、Compaction独审、Sentry价值；不重做19fdff08，仅补POSIX／Windows边界。处置前停广扫／Hook／模板新卡，只允一个无依赖正文单元。回报逐项决定、正式采用、恢复条件与唯一下一项；Git状态不证明停工。
- **B 先收产品**：Star唯一品质槽沿同ID核真实调用、槽位与阻塞；unknown不重派、不清锁、不绕过拒绝，先做独立工作。仅确认原调用不存在、槽空且原合同允许才自然领取。门槛仍12张同机位图、非作者盲评与真实分数变化。
- **FPS**：接收[d685bd6训练整合](b-work-20261106.md#fps-训练场整合)，main仍fa8740de；完整角色reload/switch仍缺，CPU不算品质通过，补合法浏览器门槛。
- **MOBA**：单线大乱斗按A/B/C；阶段A先赏金HUD、Q/W与死亡的真实可见反馈，沿已有卡依赖／槽位择一，不堆候选。CPU正确不等于玩家可读。
- **其他B线**：只收能改变正文／案例的差量，停止无采用路径的来源、独立素材与重复工具卡；新工具须明确案例接入及运行／视听／操作验收。回报产品main／采用／最高验证与Star阻塞，不以a1提交数替代。
- **共同**：长程推进，尽量无人值守；阻塞先排障，只停真实依赖，其他授权线继续。无变化不重试、不绕权限；回报新证据、行动或恢复条件，不以重复状态代排障。

- **B 临时纠偏**：Star沿“固定出图→盲评→最大差距整层改→同机位重拍→评分”闭环，完成才删。暂停Star同类中间工具／素材，其他线按上方及完整原文边界继续；[人工批次](#待人工验收)保留；MOBA先修首错、仅一张出图，在做工作每小时推分支。
- **共同采用欠项**：下次帧同步／存档实用共享指令、模型或依赖页之一；自然UI变更由新读者照浏览器页实操，不以截图／DOM替代。沿上方原文入口，结果写提交后删。

## Phase 3：7 天效果验证（11-04 至 11-11）

每日记录、Day 1／3／7 检查、判定口径和提前干预见 [Phase 3 验证计划](phase3-validation.md)。

## 专业审计

波次、brief、报告与综合以 [Audit Workspace](reviews/audit-workspace/README.md) 的[波次登记](reviews/audit-workspace/WAVE-REGISTER.md)为准。意见去向按 [SPEC §8](AUTONOMOUS-WORK-SYSTEM-SPEC-v1.3.md#8-指导与专业审计)：内容意见由 Dot-A／B 决定，方向与规则交 Claude 核心会话；只有接受的建议才转为任务。

## 分工

- 职责按 [AGENTS](../../AGENTS.md) 与[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)；本机任务走 [local-jobs](local-jobs/README.md)，两项清理仍按原收窄范围接续。
- 10-26 历史已获准改写：开工 `git fetch origin +refs/heads/*:refs/remotes/origin/* --prune`，按远端重建分支，不推旧历史。
- 11-06 main `1af556cd`：A 卡 83 accepted／13 cancelled／8 review_ready（含 [Sentry](local-jobs/A-SENTRY-MIGRATION-CONTRACT-20261103.md)）／5 blocked，0 ready/running。仅 Git 静态状态，本机活动 unknown，非退出证明。

## 项目板

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿与 M6**：候选入收件箱，漏检入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | 按 explore-frontier 广扫，推进读者地图 🟡／⏳。 |
| P81 | **试用与选择** | dot-A | [MODEL](local-jobs/A-MODEL-EFFORT-READER-20261029.md) 待接收；Datasette 部分接收，#3015 合上游／修契约及六 CI 待批。[cattrs](local-jobs/A-UPSTREAM-CATTRS-DELTA-READER-20261108.md) 部分接收，留五后端／本人协调；终态／附页隔离／新版未验。[Memos #6502](https://github.com/usememos/memos/pull/6502) 冲突，仅跟反馈；QA cancelled。[投稿页](../decisions/upstream-contributions.md) 🟡；Qwen v0.26.6 修重名，旧 14 例 6 过时／8 待验，409 非新版；socket 仍拒绝。Skills 附全文待新读者，先核退出／空槽；本机禁装，[越界](local-jobs/A-SKILL-PACKAGE-ENTRY-20261030.md#指导层交接)交 Claude 核心。Time／Rich 部分接收，Rich 待方案批准；终态／附页隔离未知。pnpm 答案已接，采用待验。 |
| MOBA | **MOBA-Like 战斗与完整内容**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | main `8584c77`／Site **v22**。[Veyra消费者](local-jobs/B-MOBA-HERO-CLIP-CONSUMER-20261106.md)已接收，配方／Three均读固定旧源；595项／Python42过。heroes配方／pin／默认与画面待。[Esc候选](local-jobs/B-MOBA-QUEUED-SKILLS-20261106.md)`00f82c7`未合／部署；验证及缺口见卡，品质不变。原终态unknown；socket及DevTools拒绝不重试。 |
| B-模块 | **核心模块**（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 07／04／05 已入 main（源码／CPU）；[FPS 前台时钟](../../domains/game-dev/04-client-modules.md#web-foreground-clock)接 v20，三入口两轮通过。[改键与六席读者](core-reader-intake-20261106.md)：改键新版接线／失败保旧独立通过；六席9081tick及原经济购买独立照做过，共享契约手读已用、完整采用欠。浏览器沿旧证据；原生／设备未验，Unity暂停。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | [图标LF](../../domains/game-dev/assets/2d.md#icon-family-rebuild)已进MOBA main，Cairo／HUD消费者过；[四件源包](local-jobs/B-FPS-CONTENT-SET-001.md)命中[部分接入](../../domains/game-dev/assets/materials.md#source-hit-marker)，通路未接。MOBA [quiet 材质](../../domains/game-dev/assets/materials.md#quiet-material-family)已接旁置，画面未验。开放音频未听未用，Nature 恢复未知。[3D](../../domains/game-dev/assets/3d.md)：网关三源实测，本机`gen3d`／`glbprep`可用；采用3–5件标准件。 |
| B-实例 | **AI 游戏实例**：作品／作者过程／社区反馈 | dot-B | [三份探索处置](b-work-20261106.md#三份实例探索处置)：仅收 Bichitos 触控识别与 Solhex 章节计时机制，发布迭代本轮不收，不扩表。原场景氛围来源已入[制作链](../../domains/game-dev/assets/materials.md#scene-atmosphere-revision)。均不新增品质推荐；Void Balls 启动失败、Warpact 未玩及原实机欠项保留，不重派。 |
| SR | **Star-Rush 比赛品质**：地平线公路弯道，保留跑圈 | dot-B | master `ce7b870`／Site **v10**；12图双盲评2→2，正式分未建。院落／灯塔通路 `eeaf46d` 仅过CPU独审，无浏览器／新图评分；原上传待批准。[原唯一拍摄](local-jobs/B-STAR-QUALITY-CAPTURE-20261106.md)外层仍unknown，不重拍／清锁。原403及手感／听感欠项保留。 |
| FPS | **FPS-Like 完整回合品质** | dot-B | main `6157235`／Site **v24**。原训练 `827c655` 的589项、Canvas六回合与开火／换弹／切枪证据见[接收记录](b-work-20261106.md#11-09-冻结候选接收)。另有[锁定去重候选3e8c86a](https://github.com/dbvv1/FPS-Like/commit/3e8c86a9c9f29582fdecc7745fc30299a523a521)：435项／类型／构建／独审过，真实浏览器未验。两候选未合main／部署；GLB动作、资源失败、视听与自然安拆仍缺，socket拒绝不重试。 |
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
