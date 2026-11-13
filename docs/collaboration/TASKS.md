# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 按[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)，只留未完成纠偏。

## 11-06 Dot-A/B 临时表现纠偏（不改变 v1.3，不等待 v1.4）

[11-06 完整纠偏原文](https://github.com/dbvv1/a1dbv/blob/7128f6cf2390e8ca9f6bc92cd3806861c874e56e/docs/collaboration/TASKS.md)保留完整范围、权限和原入口；不新增调度系统或额度要求。

- **A 旧交付**：余项见 P81，原范围与恢复条件留上方原文。

### B：11-12 先学强作品的方法，再进案例（取代 11-11 B 纠偏）

- **11-13 换默认纠偏**：§6第3条只看整局 smoke、帧耗与盲选；超次重跑、回执或清理缺项记欠项，不否决已有证据，也不冻结别的案例，换默认不占拍摄槽。Star 两入口 smoke 与盲选已过，当轮换默认并更新网站；FPS 由你判一次软件档帧耗慢 4–10% 是否明显劣化，换默认或退回，同时释放槽；MOBA 随即补双路 smoke，过即换。
- **知识首要**：按 ai-made-games-scout 继续研究 Fable 5.2 网页游戏（[Saltline](https://github.com/realcodebear/saltline-fable-5.2)、Evensong、FOG CITY 等），读成品、源码与作者原文。方法总结进 AI 全链路页；画面与声音技术栈进模块／制作链页和 game-quality-pass，不写案例经过。
- **进案例**：三案各选一个同品类网页参照作品（FPS 用 Saltline），同机 1280×720 并排截图，取代远标杆作近期目标；按研究出的做法由你自己整场景改画面与声音，不拆逐层小卡下发；按[游戏细则§6第3条](game-taskbook.md#6-作品案例)换默认，玩家界面不露候选／诊断链接。
- **完成条件**：两份知识页合入并被至少一案采用；每案有参照并排图与下一最大差距；三案默认各有一次玩家可见变化或写明阻塞。


- **共同采用欠项**：下次帧同步／存档实用共享指令、模型或依赖页之一；自然UI变更由新读者照浏览器页实操，不以截图／DOM替代。沿上方原文入口，结果写提交后删。

## Phase 3：7 天效果验证（11-04 至 11-11）

每日记录、Day 1／3／7 检查、判定口径和提前干预见 [Phase 3 验证计划](phase3-validation.md)。

## 专业审计

波次、brief、报告与综合以 [Audit Workspace](reviews/audit-workspace/README.md) 的[波次登记](reviews/audit-workspace/WAVE-REGISTER.md)为准。意见去向按 [SPEC §8](AUTONOMOUS-WORK-SYSTEM-SPEC-v1.3.md#8-指导与专业审计)：内容意见由 Dot-A／B 决定，方向与规则交 Claude 核心会话；只有接受的建议才转为任务。

## 分工

- 职责按 [AGENTS](../../AGENTS.md) 与[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)；本机任务走 [local-jobs](local-jobs/README.md)，两项清理仍按原收窄范围接续。
- 10-26 历史已获准改写：开工 `git fetch origin +refs/heads/*:refs/remotes/origin/* --prune`，按远端重建分支，不推旧历史。
- **11-13 接续**：Star已换默认并上线v11，不等FPS清理。FPS已交回，01:10:52 UTC核三个unit共3522个注册身份存活0，unit-3 exit0／子树settled，释放槽；历史probe／review／wrapper缺项记欠项，不否决已有证据。MOBA补两路smoke；仅核当前真实资源，不重复启动。

## 项目板

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿与 M6**：候选入收件箱，漏检入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | 按 explore-frontier 广扫，推进读者地图 🟡／⏳。 |
| P81 | **试用与选择** | dot-A | 15项已收口，见下方。Datasette 部分接收，#3015 合上游／修契约及六 CI 待批；Memos #6502 冲突只跟反馈，QA cancelled；Qwen v0.26.6 修重名，旧例6过时／8待验，409非新版，socket拒绝。另张 Skills 附全文待新读者，旧写者退出／空槽待核，禁装与[越界](local-jobs/A-SKILL-PACKAGE-ENTRY-20261030.md#指导层交接)交指导层；pnpm 待旧写者退出确认后并入 skills-and-plugins 一小段。 |
| MOBA | **MOBA-Like 战斗与完整内容** | dot-B | main `b8a3770`／Site **v22**，0/89。[quiet卡](local-jobs/B-MOBA-QUIET-PAIR-20261112.md)11-13沿原卡补 default／quiet 完整smoke与帧耗；原16图两非作者均4/4偏好quiet，不重复拍摄或盲选。rAF同帧误报已修（9/9回归）；两路过且无明显劣化即换默认，当前仍未换。 |
| B-模块 | **核心模块**（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | FPS [终态修复](../../domains/game-dev/04-client-modules.md#client-terminal-exit)已入主干，CPU独审过，浏览器欠。Star 原AI修复已过组装客户端CPU接收：默认9/9、轮胎8/9对手完赛，余1为前进中的截止DNF；花见坂倒车仍欠。原发布回执unknown、远端未见；本轮原补丁／9/9产物在当前环境不可复核，保留历史回执、不重推。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | 三案原 smoke 已接[整局测量](../../domains/game-dev/02-verification-and-playtesting.md#2-工具到底观察了哪一段)；FPS 原配方三标准件[颜色二改](../../domains/game-dev/assets/3d.md#asset-family-rebuild)进入实际挂接 mesh，颜色变而 bytes 不变，缺件／损坏整批回退，CPU 独审过。下一层为串行Git卡的画面／完整运行；19GLB、训练ready及Star后继材料保留，声音未听，Nature恢复unknown。 |
| B-实例 | **AI 游戏实例**：作品／作者过程／社区反馈 | dot-B | 新增[共享接触结果反例](../../domains/game-dev/assets/materials.md#web-scene-recipe)：Saltline原CPU函数／真实mask核地面、高处、查询失败；仅共享mask仍会让高处metal被重查成水声／水花，未实玩或三案采用。FOG CITY仍缺唯一作者／分享链接。[Solhex](../../domains/game-dev/08-level-design-and-encounters.md#tutorial-input-and-result)暂停保档Copper 3/6，不续窄试玩。 |
| SR | **Star-Rush 品质** | dot-B | master `1299e5a7`／Site **v11**（源`38978955`，11-13 03:02:42 UTC部署成功），coast已换默认、baseline可回退、诊断默认隐藏；0/43不变。[整局卡](local-jobs/B-STAR-DEFAULT-SMOKE-20261112.md)11-12 19:09:44复派、19:50:53执行完、21:03:15交回；两入口exit0、双盲已过。p95 450→366.6ms，>50ms比例74.1%→81.8%，不称普遍流畅。下一项整场景视听目标。 |
| FPS | **FPS-Like 品质** | dot-B | main `658b2e5`／Site **v24**，0/77，接受原全场材质默认取舍、正在发布。[原卡](local-jobs/B-FPS-DEFAULT-FULL-PAIR-20261112.md)11-12 21:10:03复派、11-13 00:03:06补回；双盲3/3偏好。三次双路smoke帧耗方向不一、非同输入，本轮不判明显劣化，保留软件慢4–10%成本风险，不称流畅。超次及缺回执记欠项，槽已释放。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材／木筏／旧档待客户端验收。 |

### A：11-12 积压接收收口

15卡已回写10 accepted、5 cancelled，见[日档](archive/completed-through-2026-11-12.txt)；无单写窗口等待。[盘符](local-jobs/A-LONG-ROUTE-DRIVE-READER-20261112.md)与[Windows测试接续](local-jobs/A-LONG-ROUTE-BASH-READER-20261113.md)已采用，新读者实用当前页；地图🟡，离开后长期稳定性待验。

11-12 三卡原进程已核不存在、隔离已解除，均取消：理由见 [GH-AW](local-jobs/A-GH-AW-APIDIFF-FACTS-20261103.md)、[MULTIAGENT](local-jobs/A-MULTIAGENT-LONG-WIDE-20261029.md)、[WORKTREE](local-jobs/A-WORKTREE-ISOLATION-FACTS-20261102.md)。不重派、不占选题；不外推其他卡。

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
