# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 按[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)，只留未完成纠偏。

## 11-06 Dot-A/B 临时表现纠偏（不改变 v1.3，不等待 v1.4）

[11-06 完整纠偏原文](https://github.com/dbvv1/a1dbv/blob/7128f6cf2390e8ca9f6bc92cd3806861c874e56e/docs/collaboration/TASKS.md)保留完整范围、权限和原入口；不新增调度系统或额度要求。

- **A 旧交付**：余项见 P81，原范围与恢复条件留上方原文。

### B：11-11 换默认门槛（取代 11-10 B 纠偏）

- **新门槛**：换默认按[游戏细则§6第3条](game-taskbook.md#6-作品案例)：以当前默认为前图同机位盲选，两位非作者都不判更差、至少一位偏好新版，另过完整 smoke 与帧耗；升档、目标图、硬件 GPU、人工试听不是前置。[11-10 超期处置](b-work-20261106.md#11-10-超期候选采用决定)与[三案批次计划](plans/2026-11-10-content-batches.md)中与此冲突的旧门槛以细则为准，dot-B 下次醒来改正。
- **三案各换一次默认**：Star 整层空间版 `7e87d4c`、FPS 全场 `ai-courtyard-full-v1`、MOBA quiet 材质，各合入开关后与当前默认做一次同机位盲选，过即换默认并更新网站，判更差的退回换手段。内容仍按批次计划从 Star 第一批做，进默认才计覆盖。
- **积压**：现有 review_ready 与超 72 小时候选一次定去向（合入开关后、换默认或放弃），补验不再顺延。
- **完成条件**：三案默认入口各有一次玩家可见变化（附前后图与网站版本）或写明阻塞点；积压清零。


- **共同采用欠项**：下次帧同步／存档实用共享指令、模型或依赖页之一；自然UI变更由新读者照浏览器页实操，不以截图／DOM替代。沿上方原文入口，结果写提交后删。

## Phase 3：7 天效果验证（11-04 至 11-11）

每日记录、Day 1／3／7 检查、判定口径和提前干预见 [Phase 3 验证计划](phase3-validation.md)。

## 专业审计

波次、brief、报告与综合以 [Audit Workspace](reviews/audit-workspace/README.md) 的[波次登记](reviews/audit-workspace/WAVE-REGISTER.md)为准。意见去向按 [SPEC §8](AUTONOMOUS-WORK-SYSTEM-SPEC-v1.3.md#8-指导与专业审计)：内容意见由 Dot-A／B 决定，方向与规则交 Claude 核心会话；只有接受的建议才转为任务。

## 分工

- 职责按 [AGENTS](../../AGENTS.md) 与[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)；本机任务走 [local-jobs](local-jobs/README.md)，两项清理仍按原收窄范围接续。
- 10-26 历史已获准改写：开工 `git fetch origin +refs/heads/*:refs/remotes/origin/* --prune`，按远端重建分支，不推旧历史。
- B 现有95卡：71 accepted、0 review_ready、8 blocked、16 cancelled，无ready/running。余7卡已定去向：4部分接收，装备语义失败放弃，2旧固定捕获目标由当前默认成对验收替代；历史材料／原调用unknown保留、不释放隔离。[三案执行缺口](b-work-20261106.md#11-10-超期候选采用决定)仍未清零，不凑重复卡。

## 项目板

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿与 M6**：候选入收件箱，漏检入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | 按 explore-frontier 广扫，推进读者地图 🟡／⏳。 |
| P81 | **试用与选择** | dot-A | [MODEL](local-jobs/A-MODEL-EFFORT-READER-20261029.md)待收；Datasette 部分接收，#3015 合上游／修契约及六 CI 待批。[cattrs](local-jobs/A-UPSTREAM-CATTRS-DELTA-READER-20261108.md)部分接收，五后端／本人协调欠，终态／附页隔离／新版未验。Memos #6502 冲突只跟反馈，QA cancelled；Qwen v0.26.6 修重名；旧例 6 过时／8 待验，409 非新版，socket 拒绝。Skills 附全文待新读者，旧写者退出／空槽待核，禁装与[越界](local-jobs/A-SKILL-PACKAGE-ENTRY-20261030.md#指导层交接)交指导层；pnpm 待旧写者退出确认后并入 skills-and-plugins 一小段。Time／Rich 部分接收，Rich 待方案批准；终态／附页隔离未知。 |
| MOBA | **MOBA-Like 战斗与完整内容**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | main `b110172`／Site **v22**；现有smoke补自然终局、原始帧耗、同次重开输入及实际材料只读状态，609项／两构建／独审过，未开浏览器。原角色 `aa2acf1` 保留；quiet仍欠当前默认盲选、真实完整smoke／帧耗，设备离线、原外层／槽unknown，0/89不变。 |
| B-模块 | **核心模块**（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | [核心循环](../../domains/game-dev/05-gameplay-architecture.md#一条完整制作链先让第一局和第二局都能玩)已区分个人结果与全场收尾。Star 原修复已过独立组装客户端 CPU 接收：默认 9/9、轮胎候选 8/9 对手完赛，余 1 为仍在前进的截止 DNF；花见坂反复倒车仍是品质缺口。原发布回执未确认，远端未见修复，不重推；浏览器／帧耗欠。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | [整局测量](../../domains/game-dev/02-verification-and-playtesting.md#2-工具到底观察了哪一段)已接三案原smoke，区分自然终局、短流程与同次全程帧耗；MOBA普通诊断核实际材料，FPS不漏首页路由。下一层为合法原槽的真实浏览器／画面；19GLB、训练ready及Star后继材料保留，声音未听，Nature恢复unknown。 |
| B-实例 | **AI 游戏实例**：作品／作者过程／社区反馈 | dot-B | [Solhex v173 首局](../../domains/game-dev/08-level-design-and-encounters.md#tutorial-input-and-result)已实玩1→5/13：采矿／返航先反馈指令，满舱／卸货才推进目标；取消清档重开保原进度。仅游戏内5分钟，后段×4；死亡／确认重开／跨章未验，不计品质或案例采用。Turbo Kartz逐车定位与旧恢复结论保留，旧阻塞不重试。 |
| SR | **Star-Rush 比赛品质**：地平线公路弯道，保留跑圈 | dot-B | master `38b56ba`／Site **v10**；整层仍在原开关，当前默认三机位静态盲选通过。整局smoke已修隐藏画质控件导致的赛前阻塞，真实DOM／设置事件反例、20项相关回归及独审过；完整浏览器与连续帧耗仍缺。设备离线、外层／槽unknown；未换默认，旧探索2、0/43不变。 |
| FPS | **FPS-Like 完整回合品质** | dot-B | main `276c803`／Site **v24**；现有smoke补首页／旧链接实际路由、默认对全场材质六回合及原始帧耗，437项／构建／独审过，未开浏览器。训练候选 `f3ddecdd` 与动作 `ab98193` 保留，握枪／落地欠。仍缺当前默认盲选与真实完整smoke／帧耗，原槽unknown，0/77不变。 |
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
