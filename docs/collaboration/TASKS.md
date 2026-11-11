# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 按[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)，只留未完成纠偏。

## 11-06 Dot-A/B 临时表现纠偏（不改变 v1.3，不等待 v1.4）

[11-06 完整纠偏原文](https://github.com/dbvv1/a1dbv/blob/7128f6cf2390e8ca9f6bc92cd3806861c874e56e/docs/collaboration/TASKS.md)保留完整范围、权限和原入口；不新增调度系统或额度要求。

- **A 旧交付**：余项见 P81，原范围与恢复条件留上方原文。

### B：11-10 品质与内容优先（取代旧 B 临时纠偏）

- **Star 唯一品质首要闭环**：dot-B／Star 品质执行先建同机位目标及 1–5 分锚图，由非作者选定；既有本机接收端仅 headless 硬件 GPU 固定出图，整层改机械重复／岸坡折面／光照中最大扣分项，再同机位重拍、后台双非作者盲评并写记分卡。至少一机位带图 **2→3** 才算完成。保留 SwiftShader 档；原槽位／调用未知只停对应拍摄，不重启取消项或绕拒绝。
- **内容**：dot-B／内容执行按[三案批次计划](plans/2026-11-10-content-batches.md)制作，从 Star 第一批开始做。一案一整层统一地表、墙面、路肩及 3–5 标准件；未在游戏中验收不计覆盖。
- **其余长线**：核心模块、AI 制作链、三案例、AI 游戏实例保留，各活跃线 3–6 张有效 ready 卡。知识先补无美术时的角色动画／材质／音效，按目标、做法、失败反例、可用命令写，案例哈希放脚注。回归／输入只修阻塞玩家的问题，不再追加 Record 类提交。
- **完成条件**：Star 带同机位图的分数变化＋全部超 72 小时候选有决定。决定不是补验通过；本轮品质／网站未变。

**超期处置**：[9 单元逐项决定、缺口与负责人](b-work-20261106.md#11-10-超期候选采用决定)：8 项补验，Rapier 放弃本阶段默认目标、保留入口；被替代旧版不单独采用，取消项不恢复。无换默认。


- **共同采用欠项**：下次帧同步／存档实用共享指令、模型或依赖页之一；自然UI变更由新读者照浏览器页实操，不以截图／DOM替代。沿上方原文入口，结果写提交后删。

## Phase 3：7 天效果验证（11-04 至 11-11）

每日记录、Day 1／3／7 检查、判定口径和提前干预见 [Phase 3 验证计划](phase3-validation.md)。

## 专业审计

波次、brief、报告与综合以 [Audit Workspace](reviews/audit-workspace/README.md) 的[波次登记](reviews/audit-workspace/WAVE-REGISTER.md)为准。意见去向按 [SPEC §8](AUTONOMOUS-WORK-SYSTEM-SPEC-v1.3.md#8-指导与专业审计)：内容意见由 Dot-A／B 决定，方向与规则交 Claude 核心会话；只有接受的建议才转为任务。

## 分工

- 职责按 [AGENTS](../../AGENTS.md) 与[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)；本机任务走 [local-jobs](local-jobs/README.md)，两项清理仍按原收窄范围接续。
- 10-26 历史已获准改写：开工 `git fetch origin +refs/heads/*:refs/remotes/origin/* --prune`，按远端重建分支，不推旧历史。
- B 现有95卡无 ready/running：先核原写者／拍摄槽；购买音效先听验，FPS先定实际接触，不凑重复卡。

## 项目板

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿与 M6**：候选入收件箱，漏检入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | 按 explore-frontier 广扫，推进读者地图 🟡／⏳。 |
| P81 | **试用与选择** | dot-A | [MODEL](local-jobs/A-MODEL-EFFORT-READER-20261029.md)待收；Datasette 部分接收，#3015 合上游／修契约及六 CI 待批。[cattrs](local-jobs/A-UPSTREAM-CATTRS-DELTA-READER-20261108.md)部分接收，五后端／本人协调欠，终态／附页隔离／新版未验。Memos #6502 冲突只跟反馈，QA cancelled；Qwen v0.26.6 修重名；旧例 6 过时／8 待验，409 非新版，socket 拒绝。Skills 附全文待新读者，旧写者退出／空槽待核，禁装与[越界](local-jobs/A-SKILL-PACKAGE-ENTRY-20261030.md#指导层交接)交指导层；pnpm 待旧写者退出确认后并入 skills-and-plugins 一小段。Time／Rich 部分接收，Rich 待方案批准；终态／附页隔离未知。 |
| MOBA | **MOBA-Like 战斗与完整内容**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | main `aade37c`／Site **v22**。原候选[2504411](https://github.com/dbvv1/MOBA-Like/commit/25044115c335763b8670f52c40935a80072af395)让双队Morrow短释放期普通受击只叠躯干，保法器前指释放；控制／死亡优先，默认／quiet／Veyra保原。717测试、双构建、真GLB与独审过；未看图／合main／部署，0/89不变。原终态unknown，拒绝不重试。 |
| B-模块 | **核心模块**（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 07／04／05 已入 main；前台时钟接v20，改键／六席已收。[分片保存](../../domains/game-dev/04-client-modules.md#分片保存失败只能丢候选不能清掉旧一代)新增原文4组失败消费：核心片拒写会清旧片，secondary可混代；外层回退未测。原文命令／新读者通过，真实跨版／浏览器事务／Unity消费者仍欠。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | 图标LF已进MOBA；quiet材质旁置未看图。[动画页](../../domains/game-dev/assets/animation.md#第二次修改决定是否留下)补Morrow新源的受击层消费与FPS共享步枪事件判断，手枪长冷却不能套用；均真源／CPU，未完成视听采用。Star仍借原车手；开放音频未听未用，Nature恢复unknown。 |
| B-实例 | **AI 游戏实例**：作品／作者过程／社区反馈 | dot-B | 哈耶克v2.3.64同版恢复已实玩；[税制二改](../../domains/game-dev/06-indie-roadmap.md#ai-制作实例改经济规则要验旧玩家下一回合付了多少)新增五组原文迁移，幂等不保证税额兼容，无版本／v2起点须分验。新读者照做通过；真实旧发行包／经济整回合未验，不复制无许可实现。Brickbrag WebGL失败、Permit Pending 403与原调用unknown不重试。 |
| SR | **Star-Rush 比赛品质**：地平线公路弯道，保留跑圈 | dot-B | master `ce7b870`／Site **v10**；双盲2→2、0/43。原候选[f64b5a5](https://github.com/dbvv1/Star-Rush-Reborn/commit/f64b5a5caaf8cde7b88eb4676469eb77b082f5cf)试24栋，移除两排形成海岬开口，保原30栋完整保护包络，房屋／底座／3D植被筛选同步；CPU／构建／独审过，未拍图判优。旧车手接回与捕获回退检测保留；设备离线、原外层及槽unknown，不重拍／清锁。 |
| FPS | **FPS-Like 完整回合品质** | dot-B | main `b895bcb`／Site **v24**；训练`bd4e185`待视听。原角色候选[4ed8222](https://github.com/dbvv1/FPS-Like/commit/4ed8222dd4bf6827ec4017ae112fb942bf0400dc)修既有View步枪切回后重播旧fire，与Knight共用判断；487测试／构建／真Game与GLB／独审过。手枪取消仍欠；Knight／RX24未装配或接View，不缩放／改倍速。0/77不变，拍摄unknown与拒绝不重试。 |
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
