# 任务状态

> [运行手册](LONG-TERM-PLAN.md) · 长期提示词 [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)（10-26 前的完整状态见[当日归档](archive/completed-through-2026-10-26.txt)）

## 当前重点

> 每轮纠偏只改本节，最多三条（手册§6）。更新：2026-10-27，Claude 核心方向会话。

- **A**：答案页按 [write-task-guide](../../templates/generic/.claude/skills/write-task-guide/SKILL.md) 做：按地图优先级，对使用者最多的页和新页下发本机模型做照做实测，按卡点改页面，状态随结果变化，不单独复评存量。核心推荐没在真实任务上用过的，优先在 dot-B 案例的日常编码里用。前沿候选收集也下发本机模型，你挑最强的深挖；同时跟进上游 PR。
- **B**：案例要做成内容成套统一的高质量作品。各案按完整一局列清单、定风格标准件；拍摄可用后先做灯光层，操控并行。做法见 Skill：[成套内容](../../domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md)、[质量单元](../../domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md)、[模块](../../domains/game-dev/templates/.claude/skills/game-module-from-case/SKILL.md)、[AI 做游戏实例](../../domains/game-dev/templates/.claude/skills/ai-made-games-scout/SKILL.md)。用户 10-27 最新选择：游戏操作、浏览器、图形与品质验证只用 dot 云电脑；云端未能验证就记具体缺口，不派回本机。本机后台模型与文件制作保留。候选旁置发布、换默认见细则§6；积压候选逐个过测试和 smoke 后合入，不留在分支上。
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
| P81 | **试用与写成选择**：真实编码任务试用，结论进决策页／模板 | dot-A | 脚本交付已接收；CI 投影经真实 PR／本机读者验收。跟进 [Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502)；Serena 见下表。 |
| MOBA | **MOBA-Like 基本战斗与完整内容**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | main `9311f43`／网站 v12 未变。[灯光候选 `069b74b`](https://github.com/dbvv1/MOBA-Like/commit/069b74bc410eec318a1effb0a05a7acc619b5bcc)云端软件实帧二改后，接地／体积小幅改善；移动及 Q 瞄准线可见，短弹体未看全。Q `003884b`／攻城 `cca9c5d`仍候选；暗面、动态与完整 smoke／整局视听待补。 |
| B-模块 | **核心模块**：客户端、gameplay、引擎、部分服务端（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | Star `1dd89d3`／v7 已用存档；[MOBA候选](https://github.com/dbvv1/MOBA-Like/commit/ea7a06451cba085da8107fca634e51d5a2bb25bf)云端重开／续玩／跨标签实操通过，main／Site未变；Firefox 退出原因未明。完整 smoke 待补（未启动）；Codex 额度恢复提示 2026-11-02 06:08（时区未给），恢复后续原任务。改键 `89f0831` 仍候选。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | Star [四件标准 `ab26559`](https://github.com/dbvv1/Star-Rush-Reborn/commit/ab2655930996b9d81f5fb35469669c72b7be28e1)已回原卡 review_ready，待接线与实机；FPS 四件 GLB 的 48 项官方 validator 错误已退原卡，接收端重新领取，修复未回。MOBA灯光经验已回正文；开放权重音频未听未采用，3D仍无mesh，Nature恢复未知。 |
| B-实例 | **AI 做游戏实例**：作品、作者过程与社区反馈 | dot-B | [原供给卡](local-jobs/B-AI-GAME-SUPPLY-SOURCES-20261027.md)的 Void Balls 音频来源窄修已 accepted，只是作者制作线索、未试玩。Warpact 云浏览器遇 WebGL2 缺失／连接失败，未玩到；没有新增整局品质推荐。 |
| SR | **Star-Rush 完整比赛品质**：地平线公路弯道，保留跑圈 | dot-B | master `1dd89d3`／网站 v7 未改驾驶。`dca3409`已取得云端软件 WebGL 全弯 frame0，公开回执待发布；普通追尾、完整同弯操控与声音未验。车控 `0817aa0`仍仅短段键盘观察；[标准件原卡](local-jobs/B-SR-CONTENT-SET-001.md)已 review_ready，不再排队。 |
| FPS | **FPS-Like 完整回合品质**，按 [brief](https://github.com/dbvv1/FPS-Like/blob/main/docs/brief.md) | dot-B | main `a97d572`／网站 v12 未变。操控 `fca31b0`／拍摄 `febed026`待云端验证。原本机射击任务已停止；14:30 UTC 仍有 11 个旧预览进程，[清理卡](local-jobs/B-FPS-PREVIEW-CLEANUP-001.md)已领取 running，实际清理未回，不等于已退出。 |
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
| Serena #2218 上游贡献 | 待可写 fork；CLA 须本人审阅决定 | 保留[已审补丁与验证](../../experiments/serena-vue-implementation/README.md)，其他主线继续 |

**停止的动作**：Maka #4495 评论因集成 403 未发出；MOBA 第三方素材官方取回 HTTP 403，改由本机接收端代取；P107 与 Action 调试 10f6a6db 被平台拒绝，补齐命令和用途后请用户在 Dot 里批准。
