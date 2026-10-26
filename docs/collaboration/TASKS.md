# 任务状态

> [运行手册](LONG-TERM-PLAN.md) · 长期提示词 [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)（10-26 前的完整状态见[当日归档](archive/completed-through-2026-10-26.txt)）

## 当前重点

> 每轮纠偏只改本节，最多三条（手册§6）。更新：2026-10-26，Claude 核心方向会话。

- **A**：去最强的东西实际所在的地方找（官方团队与高质量项目自己怎么用 AI coding、Skill 与工具生态、真实反馈、Claude Code／Codex 的问题），来源按产出自行调整；找到的先在本仓生产上用出能数的变化，再写成选择。写法先给做法，限制只留改变决定的一条。
- **B**：目标是整体高品质（画面、声音、手感、反馈、界面、完成度一起达到同规模优秀作品的水平），不只是功能正确：每个单元跑通后专门做质量评估（和参照并排、列差距）并针对差距优化，达到参照水平才算完成；AI 全链路用来把品质做上去。一次把一个完整片段整体做到参照水平再扩：Star-Rush 一段完整弯道，MOBA 一次基本战斗（先把方块塔、小兵、灰色地面和英雄换成制作链产出），FPS 一次射击循环。三个网页案例检验并串联知识。
- **共同**：立项先写三句（读者、增量、怎么知道用上）；审查做读者实测；未结束的任务文件不超过 80 行、本页不超过 10 KB，由 `check_repo.py` 检查。存量清理已收窄到入口页和模板（见两个清理任务）。

## 分工

- 方向见 [AGENTS 锚点](../../AGENTS.md)。dot-A：AI coding 与 M6；dot-B：游戏 AI 全链路与客户端／gameplay，作品案例见[游戏方向细则§6](game-taskbook.md#6-作品案例)。
- 本地模型委派走 [local-jobs](local-jobs/README.md)，由本机接收端（固定脚本）领取执行。旧的 Codex 接收端已退役；两个清理任务由新接收端按收窄后的范围接续。
- 指导层：Claude 核心方向会话负责方向与原则，Codex 审计会话负责增量审计与仓库整理（手册§6）。
- 10-26 a1dbv 历史已按用户授权改写：开工前 `git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune`，本地分支按远端重建，不推送基于旧历史的分支。

## 项目板

> 只写当前状态和下一步；过程写进提交说明。规则见[运行手册第 4 节](LONG-TERM-PLAN.md#4-做什么)。

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿发现与 M6**：让读者第一时间知道该试什么；来源按产出调整，候选进收件箱，漏检对照记入 [25](../25-ai-exploration.md) | dot-A | 10-26 首轮固定来源扫描与[有界周校准](../25-ai-exploration.md)已完成：上海 10-19～25 的固定 HN 查询前 10 条中补入 2 项适用漏项；不是全量漏检率，不与旧 6/25 直接比较，真实发现时差未知。下一步从收件箱按本仓真实消费者挑选试用，不重复本周扫描。 |
| P81 | **试用与写成选择**：读者照着就能采用；在本仓自己的 AI 开发里试用，结论进 [13](../13-frontier-radar.md)、决策页和模板 | dot-A | 旧采用已收口；[场景→动作写法](../../experiments/writing-action-first/README.md)已用于本仓在制稿：小节非空白 Markdown 字符 1042→937，13 项事实保留，已写入 [REVIEW](../../templates/generic/REVIEW.md)；SDK 仍为未运行素材。[Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502) 继续跟评审。 |
| MOBA | **MOBA-Like 纵切片**：可玩 → 第二次需求修改，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | 双英雄选择已入 [main 083183c](https://github.com/dbvv1/MOBA-Like/commit/083183c245c2e8f4bd3dbbfa7e3d7c75a0357b3b)：选择 Morrow／Veyra、四技能与保／改选择重开，[原 smoke 任务](local-jobs/B-MOBA-CLIENT-SMOKE-001.md)已接受软件 WebGL2 实跑与独审；按 [README](https://github.com/dbvv1/MOBA-Like/blob/main/README.md) 运行并操作。10-26 [网站](https://dbvv1-moba-like.pretty-llama-9945.chatgpt.site)已部署 `083183c` 并设为所有人可访问；本次部署已完成，线上 GPU 玩法未再验。Git 推送不自动发布网站。默认 v8；下一步把塔、小兵、地面和英雄换成制作链产出，再改善完整对局的可读性与操作体验。 |
| B-模块 | **核心模块**：客户端、gameplay、引擎、部分服务端（[细则 G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 当前优先把现有 Web 简单内容的品质做好；[Unity 原生采用](local-jobs/B-UNITY-ADOPTION-001.md)保留接收端许可阻断与独立源候选，暂停工程、实跑与扩展，恢复须以届时用户方向为准，不随许可恢复自动开跑。 |
| B-制作链 | **AI 全链路**（[细则 G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | [原创角色源→多单位→可玩主循环](../../domains/game-dev/assets/animation.md#multiunit-animation-consumer)已回流：idle／walk／death 与权威事件驱动 attack／hurt 已入正式 c218→083，原软件 WebGL2 功能检查通过；[静音开门影片](../../experiments/gate-reveal/README.md)制作与返回玩法也已实跑。基础动作接入不等于品质达标；当前统一一次基本战斗的场景／塔／兵／英雄资源、技能与声音反馈，按参照并排优化。 |
| SR | **Star-Rush 品质提升**：驾驶手感、竞速 AI、美术与音频，按 [brief](https://github.com/dbvv1/Star-Rush-Reborn/blob/master/docs/brief.md) | dot-B | master [`c287b23`](https://github.com/dbvv1/Star-Rush-Reborn/commit/c287b23b868abab96269f6443ab1ce4814d587a4)：AI 按碰撞后障碍位置避让，真实输入对局＋Canvas 重放对照通过；64 项及客户端回归、独审通过。`3f73455` 严格软件 WebGL smoke 已接收，后续牌层／AI 差量未重跑严格 WebGL；10-26 对应 `c287b23` 的[新赛车站](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site)已部署并设为所有人可访问，旧站不变；公开页正常显示菜单，线上驾驶待验。 |
| FPS | **FPS-Like 纵切片**，按 [brief](https://github.com/dbvv1/FPS-Like/blob/main/docs/brief.md) | dot-B | 10-26 [公开网站](https://dbvv1-fps-like.pretty-llama-9945.chatgpt.site)第二版已部署：新增可见加载、慢加载提示与导入失败提示；本地 CPU 浏览器菜单／移动及慢加载／失败后重载实跑通过。原空白正常重访已恢复，未确认持续性 WASM 故障；`git push origin HEAD:refs/heads/b/fps-headless-v1` 因 FPS-Like 不在显式推送授权范围被平台拒绝，待用户补充该仓库普通快进推送授权，期间不重试发布。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材、木筏与旧档的客户端验收欠项保留。 |

## 待人工验收（统一查看）

需要人亲自听、看、玩才能判断的项目集中在这里，由用户择时统一验收；执行者记录后继续其他工作。

- MOBA-Like：[可玩入口与操作](https://github.com/dbvv1/MOBA-Like/blob/main/README.md)的硬件 GPU 画面、操作手感与完整对局体验；软件 WebGL2 smoke 已通过。
- Star-Rush：[同弯驾驶 A/B `2ad6cf7`](https://github.com/dbvv1/Star-Rush-Reborn/blob/2ad6cf72157e27a9eba0326776bccf29beee3236/docs/driving-ab.md)：高速转向渐入、主动小喷与贴墙恢复已做正常 Canvas 同弯对照；尚未证明整体更好，正式站保留 baseline，继续实玩改进。另验完整 WebGL 画面、护栏声音与混音、Canvas 房屋锚点及 `navy-v2` 转向牌运动辨识。
- 潮汐邮差 v2：素材、木筏与旧档。
- Memos：owner 登录与编辑。
- Maka 侧聊模型选择：真实后端／Electron 与完整应用体验（[固定候选](local-jobs/A-STORYBOOK-ADOPTION-001.md)）。
- Memoh Colada 升级：真实业务、查询缓存与刷新恢复（[补丁](local-jobs/A-MIGRATION-ADOPTION-001.md)）。

## 需要用户决定

只放锚点红线内的事。等待只停对应动作，其余照常推进。

| 事项 | 等什么 | 期间照常做 |
|---|---|---|
| jrnl 上游 PR | 集成创建PR返回403，已审分支就绪；由用户决定是否打开[compare页](https://github.com/jrnl-org/jrnl/compare/main...dbvv1:jrnl:dot-a/dayone-dst-1422)创建Draft。拟标题：`Fix DayOne UTC conversion across daylight saving transitions`，说明与测试见[采用记录](../../experiments/jrnl-dayone-runtime-diagnosis.md) | 本仓发现、试用与既有PR跟进继续 |
| Actual 上游 PR | 集成创建PR返回403，已审分支就绪；由用户决定是否打开[compare页](https://github.com/actualbudget/actual/compare/master...dbvv1:actual:dot-a/load-config-typescript-1483)创建Draft。拟标题：`[AI] Migrate sync server configuration loader to TypeScript`；正文保留官方空模板，人类字段不代填 | 本仓发现、试用与既有PR跟进继续 |
| Maka 上游贡献 | 真人贡献者须实际审阅负责，适用时本人签 CLA | [OpenSpec 邀请已发](https://github.com/Fission-AI/OpenSpec/issues/2115#issuecomment-6401683363)；其他 PR 继续 |

**停止的动作**：Maka #4495 评论同样因集成 403 未发出；MOBA 第三方素材官方取回 HTTP 403，自有与原创占位素材已通过；P107 与 Action 调试 10f6a6db 曾被平台拒绝，负责人补齐命令和用途后再请用户在 Dot 里批准。
