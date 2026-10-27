# 任务状态

> [运行手册](LONG-TERM-PLAN.md) · 长期提示词 [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)（10-26 前的完整状态见[当日归档](archive/completed-through-2026-10-26.txt)）

## 当前重点

> 每轮纠偏只改本节，最多三条（手册§6）。更新：2026-10-27，Claude 核心方向会话。

- **A**：答案页按 [write-task-guide](../../templates/generic/.claude/skills/write-task-guide/SKILL.md) 做：按地图优先级，对使用者最多的页和新页下发本机模型做照做实测，按卡点改页面，状态随结果变化，不单独复评存量。核心推荐没在真实任务上用过的，优先在 dot-B 案例的日常编码里用。前沿候选收集也下发本机模型，你挑最强的深挖；同时跟进上游 PR。
- **B**：三类做法已写成 Skill：质量单元 [game-quality-pass](../../domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md)、模块 [game-module-from-case](../../domains/game-dev/templates/.claude/skills/game-module-from-case/SKILL.md)、AI 做游戏实例 [ai-made-games-scout](../../domains/game-dev/templates/.claude/skills/ai-made-games-scout/SKILL.md)。现状：三个案例都没有拍摄模式，也都没有环境光照与后处理。下一步给各案例做拍摄模式并下发本机拍真 GPU 基线（[细则§7](game-taskbook.md#7-下发本机模型的游戏任务)）；画面的第一个质量单元各做灯光层，手感按在途的品类操控对照继续。云端取不到的 CC0 包和开放权重生成交本机。
- **共同**：完成看读者或玩家得到的价值；TASKS、quality.md 和正文只写现状、差距和变化，过程写进提交说明。独立审查只用于新默认做法、模板和作品版本。做法明确的单元下发本机模型（operations§2.2），接收端现在空闲，最多 4 个并行。B 可评估把 `node_modules` 的读取拒绝改为仅编辑拒绝，便于读已安装依赖的源码与随包 Skill。B 在下一项帧同步或存档接入中从[共享指令](../decisions/instruction-files.md)、[模型与 effort](../decisions/model-roles.md)、[依赖定位](../decisions/skills-and-plugins.md)中择一，沿已有入口自然采用，遇自然上下文压力才用[原生压缩](../decisions/context-management.md)；保留原验收，记漏项、纠正轮次、恢复耗时与接入结果，不为对照重复实现。下一次自然 UI 变更由新读者照[浏览器验收](../decisions/verification.md)实际操作补验，不以截图或静态 DOM 代替。

## 分工

- 方向见 [AGENTS 锚点](../../AGENTS.md)。dot-A：AI coding 与 M6；dot-B：游戏 AI 全链路与核心模块（客户端／gameplay、引擎、部分服务端），作品案例见[游戏方向细则§6](game-taskbook.md#6-作品案例)。
- 本地模型委派走 [local-jobs](local-jobs/README.md)，由本机接收端（固定脚本）领取执行。旧的 Codex 接收端已退役；两个清理任务由新接收端按收窄后的范围接续。
- 指导层：Claude 核心方向会话负责方向与原则，Codex 审计会话负责增量审计与仓库整理（手册§6）。
- 10-26 a1dbv 历史已按用户授权改写：开工前 `git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune`，本地分支按远端重建，不推送基于旧历史的分支。

## 项目板

> 只写当前状态和下一步；过程写进提交说明。规则见[运行手册第 4 节](LONG-TERM-PLAN.md#4-做什么)。

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿发现与 M6**：让读者第一时间知道该试什么；来源按产出调整，候选进收件箱，漏检对照记入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | 首轮扫描、周校准与[本周 Top 5](../13-frontier-radar.md#本周-top-5)已做。下一步按 explore-frontier 广扫，同时推进读者地图上仍为 🟡／⏳ 的问题，漏检记进探索证据。 |
| P81 | **试用与写成选择**：读者照着就能采用；在案例仓库的真实编码任务和 a1dbv 脚本上试用，结论进 [13](../13-frontier-radar.md)、决策页和模板 | dot-A | [读者地图](../../README.md)已补齐答案页。三项脚本已接收：公开扫描覆盖符号链接文本；同输入页面 Git 读取由 72 次降到 24 次；三个 Hook 单次解析事件。Catalog CLI 与其余完整测试分两段、各限 120 秒；跟评审 [Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502)。 |
| MOBA | **MOBA-Like 基本战斗**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | [main 9311f43](https://github.com/dbvv1/MOBA-Like/commit/9311f43e1b396827bf27caebc8ab715f5cb2cc84)／[网站 v12](https://dbvv1-moba-like.pretty-llama-9945.chatgpt.site) 未变。先补 LoL 式普攻准备—发射—命中—走 A；[v11 候选](https://github.com/dbvv1/MOBA-Like/commit/e829968c4bc5909f3b4342eb9f98c06282c8d400)已源／模拟独审，真实键鼠和并排复评待验，场景与英雄身份差距仍在。 |
| B-模块 | **核心模块**：客户端、gameplay、引擎、部分服务端（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | FPS `a97d572`／v12 已接菜单、输入与离页取消；[存档包](../../experiments/local-race-save/README.md)已接 Star `1dd89d3`／v7 并实操复验；MOBA 改键 UI `89f0831` 已成候选、待操作验收。Yarn 选项身份、房间仿真结算服务链已验证，尚非真人联网。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | 音频 `2bc688a` 待听、未采用；3D `00fc2f9` 受权重 TLS／工具条件阻断、无 mesh。CC0 Suburban 已转原 UV／贴图候选，完整门和画面待验；Nature 许可及两件模型官方配额拒绝，恢复未知。 |
| B-实例 | **AI 做游戏实例**：作品、作者过程与社区反馈 | dot-B | [作者实例](../../domains/game-dev/README.md#用-ai-做游戏)已发表来源线索，新增整局体验未完成。本机[素材供给扩查](local-jobs/B-AI-GAME-SUPPLY-SOURCES-20261027.md)已领取，[品类参照补证](local-jobs/B-GENRE-REFERENCE-20261027.md)待领取；均未交付新结果。 |
| SR | **Star-Rush 完整弯道品质**：以地平线公路弯道为参照，保留跑圈 | dot-B | [master 1dd89d3](https://github.com/dbvv1/Star-Rush-Reborn/commit/1dd89d3931196cb08f7b9a00541a54a6715dfe1d)／[网站 v7](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site) 未改驾驶。默认 road-v2 未完成手感对标；先做成熟车控同弯对照，短段 Canvas 键盘观察不算完整验收。外观候选不代替操控改造。 |
| FPS | **FPS-Like 射击循环品质**，按 [brief](https://github.com/dbvv1/FPS-Like/blob/main/docs/brief.md) | dot-B | [main a97d572](https://github.com/dbvv1/FPS-Like/commit/a97d57281dd6c6d941c6a6bef732dadf2953f2f4)／[网站 v12](https://dbvv1-fps-like.pretty-llama-9945.chatgpt.site) 未变。[移动—制动—射击候选](https://github.com/dbvv1/FPS-Like/commit/fca31b0f542142b3bbd32c890c7b43a3207b917a)补实际速度精度与连续后坐；待正常操作、声音和 CS2 对照，不计品质完成。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材、木筏与旧档的客户端验收欠项保留。 |

## 待人工验收（统一查看）

需要人亲自听、看、玩才能判断的项目集中在这里，由用户择时统一验收；执行者记录后继续其他工作。

- FPS-Like：原混音与受伤声候选各一段真实交火录音，听能否分清“我命中”与“我受伤”、是否遮掉敌人枪声、连续听是否疲劳；网页 v12 用原混音。
- MOBA-Like：[可玩入口与操作](https://github.com/dbvv1/MOBA-Like/blob/main/README.md)的硬件 GPU 画面、操作手感与完整对局体验；软件 WebGL2 smoke 已通过。
- Star-Rush：[公路候选](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road)的整体手感、视听与硬件画面；海岸环境声开关对比试听。
- 潮汐邮差 v2：素材、木筏与旧档。

## 需要用户决定

只放锚点红线内的事。等待只停对应动作，其余照常推进。

| 事项 | 等什么 | 期间照常做 |
|---|---|---|
| jrnl 上游 PR | 集成创建PR返回403，已审分支就绪；由用户决定是否打开[compare页](https://github.com/jrnl-org/jrnl/compare/main...dbvv1:jrnl:dot-a/dayone-dst-1422)创建Draft。拟标题：`Fix DayOne UTC conversion across daylight saving transitions`，说明与测试见[采用记录](../../experiments/jrnl-dayone-runtime-diagnosis.md) | 本仓发现、试用与既有PR跟进继续 |
| Actual 上游 PR | 集成创建PR返回403，已审分支就绪；由用户决定是否打开[compare页](https://github.com/actualbudget/actual/compare/master...dbvv1:actual:dot-a/load-config-typescript-1483)创建Draft。拟标题：`[AI] Migrate sync server configuration loader to TypeScript`；正文保留官方空模板，人类字段不代填 | 本仓发现、试用与既有PR跟进继续 |
| 本机模型权重下载 | 开放权重 3D 在本机取权重时 TLS 连接中断（B-OPENWEIGHT-3D-001），可能需要用户检查本机网络或代理 | 音频与其他制作链照常 |
| opensrc 上游补丁 | 目标 fork 入口尚未就绪；仓库所有者提供可写 fork 后，继续发布已审的仓库 ref 修复 | 本仓读者问题与试用继续，[补丁与复用说明](../../experiments/opensrc-ref-integrity/README.md)保留待发 |
| Maka 上游贡献 | 真人贡献者须实际审阅负责，适用时本人签 CLA | [OpenSpec 邀请已发](https://github.com/Fission-AI/OpenSpec/issues/2115#issuecomment-6401683363)；其他 PR 继续 |

**停止的动作**：Maka #4495 评论因集成 403 未发出；MOBA 第三方素材官方取回 HTTP 403，改由本机接收端代取；P107 与 Action 调试 10f6a6db 被平台拒绝，补齐命令和用途后请用户在 Dot 里批准。
