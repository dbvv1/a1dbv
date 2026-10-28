# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)（[10-26](archive/completed-through-2026-10-26.txt)）

## 当前重点

> 纠偏只改本节，最多三条（手册§6）；2026-10-27 Claude 核心方向会话更新。

- **A**：现阶段首要：优化 dot 长程执行、质量与并行；真实任务验证接收、续接、补位，已验证做法进[长任务页](../decisions/long-tasks.md)及模板供两账号共用。经“共同”交 B 采用，长期规则交指导层。答案页按 [write-task-guide](../../templates/generic/.claude/skills/write-task-guide/SKILL.md) 实测并改卡点；明确单元和候选收集交本机模型，上游 PR 继续跟进。
- **B**：案例要做成内容成套统一的高质量作品。各案按完整一局列清单、定风格标准件；拍摄可用后先做灯光层，操控并行。做法见 Skill：[成套内容](../../domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md)、[质量单元](../../domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md)、[模块](../../domains/game-dev/templates/.claude/skills/game-module-from-case/SKILL.md)、[AI 做游戏实例](../../domains/game-dev/templates/.claude/skills/ai-made-games-scout/SKILL.md)。用户 10-27 新决定：云端能做的留在云端；真 GPU 拍摄按[细则§7](game-taskbook.md#7-下发本机模型的游戏任务)写 `kind: build` 交本机，只用 headless（无窗口、不模拟键鼠、不操作桌面），一次一个 GPU 任务。本机后台模型与文件制作照常。候选旁置发布、换默认见细则§6；积压候选逐个过测试和 smoke 后合入，不留在分支上。
- **共同**：完成看读者或玩家得到的价值；TASKS、quality.md 和正文只写现状、差距和变化，过程写进提交说明。独立审查只用于新默认做法、模板和作品版本。做法明确的单元下发本机模型（operations§2.2），接收端现在空闲，最多 4 个并行。B 可评估把 `node_modules` 的读取拒绝改为仅编辑拒绝，便于读已安装依赖的源码与随包 Skill。B 在下一项帧同步或存档接入中从[共享指令](../decisions/instruction-files.md)、[模型与 effort](../decisions/model-roles.md)、[依赖定位](../decisions/skills-and-plugins.md)中择一，沿已有入口自然采用，遇自然上下文压力才用[原生压缩](../decisions/context-management.md)；保留原验收，记漏项、纠正轮次、恢复耗时与接入结果，不为对照重复实现。下一次自然 UI 变更由新读者照[浏览器验收](../decisions/verification.md)实际操作补验，不以截图或静态 DOM 代替。

## 分工

- 方向见 [AGENTS 锚点](../../AGENTS.md)。dot-A：AI coding 与 M6；dot-B：游戏 AI 全链路与核心模块（客户端／gameplay、引擎、部分服务端），作品案例见[游戏方向细则§6](game-taskbook.md#6-作品案例)。
- 本地模型委派走 [local-jobs](local-jobs/README.md)，由本机接收端（固定脚本）领取执行。旧的 Codex 接收端已退役；两个清理任务由新接收端按收窄后的范围接续。
- 指导层：Claude 核心方向会话负责方向与原则，Codex 审计会话负责增量审计与仓库整理（手册§6）。
- 10-26 a1dbv 历史已按用户授权改写：开工前 `git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune`，本地分支按远端重建，不推送基于旧历史的分支。

## 项目板

> 过程见提交说明。[项目规则](LONG-TERM-PLAN.md#4-做什么)。

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿发现与 M6**：让读者第一时间知道该试什么；来源按产出调整，候选进收件箱，漏检对照记入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | 首轮扫描、周校准与[本周 Top 5](../13-frontier-radar.md#本周-top-5)已做。下一步按 explore-frontier 广扫，同时推进读者地图上仍为 🟡／⏳ 的问题，漏检记进探索证据。 |
| P81 | **试用与写成选择**：真实编码任务试用，结论进决策页／模板 | dot-A | 脚本／CI 投影已实用；跟进 [Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502)。Qwen [#15741](https://github.com/QwenLM/qwen-code/issues/15741) 本地 `fix/mcp-preserve-discovery-error`／`6099417` 保留真实报错，独审通过；preflight 卡在 core tsc（137），待可构建环境补跑，未达 PR 门槛。 |
| MOBA | **MOBA-Like 基本战斗与完整内容**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | main `9311f43`／Site v12 未变；回溯 `f533d6f` 已接收：baseline 失败，额外运行及清理未知，停止重派；恢复须定范围、核串行安全。回滚后 `d0db3d7` 未上传文件不可用、未精确恢复；历史CPU检查非交付、未验 GPU。可读性／smoke／整局视听待补。 |
| B-模块 | **核心模块**：客户端、gameplay、引擎、部分服务端（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | Star v7 已用存档；MOBA `ea7a064` 重开／续玩／跨标签实操通过，改键 `89f0831` 仍候选，main／Site 未变。完整 smoke 未启动，Firefox 退出原因未明；Codex 恢复提示 2026-11-02 06:08（时区未给）。[Unity 源准备](../../experiments/unity-encounter/README.md)已接收，未在引擎实跑；原任务暂停。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | FPS [四件源包](local-jobs/B-FPS-CONTENT-SET-001.md)已接收；通路／命中接线文件不可用，待精确恢复。MOBA 灯光已回正文。开放音频未听未用，3D 无 mesh，Nature 恢复未知。 |
| B-实例 | **AI 做游戏实例**：作品、作者过程与社区反馈 | dot-B | [Void Balls 制作线索](local-jobs/B-AI-GAME-SUPPLY-SOURCES-20261027.md)已接收；启动遇 WebGL 不支持／连接失败，未进游戏、未听音。Warpact 仍未玩到；没有新增整局品质推荐。 |
| SR | **Star-Rush 完整比赛品质**：地平线公路弯道，保留跑圈 | dot-B | master `1dd89d3`／网站 v7 未改驾驶。标准件已接入本地候选 `345f914`，pilot／off 均未获 READY 或图。`dca3409` 软件全弯 frame0 已取得，公开上传原调用已取消、未生成远端产物；恢复待用户决定。车控 `0817aa0` 仅短段观察；普通追尾、完整同弯操控与声音待验。 |
| FPS | **FPS-Like 完整回合品质**，按 [brief](https://github.com/dbvv1/FPS-Like/blob/main/docs/brief.md) | dot-B | main `a97d572`／网站 v12 未变。未上传门洞 `05471f6`、命中 `d47fa66`→`3f7499d` 文件不可用、未精确恢复；历史203 CPU测试／构建／独审非当前交付，未实跑 smoke。旧实图非新门洞源；角色 `a0c8d52` 实显及射击／换弹／败局／续局／重开已观察，品质未定。云端 Firefox 被拒未执行；smoke／操控／整局视听待验，原上传待批。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材、木筏与旧档的客户端验收欠项保留。 |

## 待人工验收（统一查看）

用户择时验收视听与游玩，其他工作照常。

- FPS-Like：原混音与受伤声候选各一段真实交火录音，听能否分清“我命中”与“我受伤”、是否遮掉敌人枪声、连续听是否疲劳；网页 v12 用原混音。
- MOBA-Like：[可玩入口与操作](https://github.com/dbvv1/MOBA-Like/blob/main/README.md)的硬件 GPU 画面、操作手感与完整对局体验；软件 WebGL2 smoke 已通过。
- Star-Rush：[公路候选](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road)的整体手感、视听与硬件画面；海岸环境声开关对比试听。
- 潮汐邮差 v2：素材、木筏与旧档。

## 需要用户决定

锚点红线事项；只暂停对应动作。

| 事项 | 等什么 | 期间照常做 |
|---|---|---|
| FPS 云端浏览器验收 | 可见 Firefox 启动被拒；待用户明确批准后恢复，不换路绕过 | CPU 修正保留，独立工作照常 |
| jrnl 上游 PR | 集成创建PR返回403，已审分支就绪；由用户决定是否打开[compare页](https://github.com/jrnl-org/jrnl/compare/main...dbvv1:jrnl:dot-a/dayone-dst-1422)创建Draft。拟标题：`Fix DayOne UTC conversion across daylight saving transitions`，说明与测试见[采用记录](../../experiments/jrnl-dayone-runtime-diagnosis.md) | 本仓发现、试用与既有PR跟进继续 |
| Actual 上游 PR | 集成创建PR返回403，已审分支就绪；由用户决定是否打开[compare页](https://github.com/actualbudget/actual/compare/master...dbvv1:actual:dot-a/load-config-typescript-1483)创建Draft。拟标题：`[AI] Migrate sync server configuration loader to TypeScript`；正文保留官方空模板，人类字段不代填 | 本仓发现、试用与既有PR跟进继续 |
| 本机模型权重下载 | 开放权重 3D 在本机取权重时 TLS 连接中断（B-OPENWEIGHT-3D-001），可能需要用户检查本机网络或代理 | 音频与其他制作链照常 |
| opensrc 上游补丁 | 目标 fork 入口尚未就绪；仓库所有者提供可写 fork 后，继续发布已审的仓库 ref 修复 | 本仓读者问题与试用继续，[补丁与复用说明](../../experiments/opensrc-ref-integrity/README.md)保留待发 |
| Maka 上游贡献 | 真人贡献者须实际审阅负责，适用时本人签 CLA | [OpenSpec 邀请已发](https://github.com/Fission-AI/OpenSpec/issues/2115#issuecomment-6401683363)；其他 PR 继续 |
| Serena／testmon 上游贡献 | 待对应可写 fork；Serena CLA 须本人决定 | 已审补丁：[Serena #2218](../../experiments/serena-vue-implementation/README.md)、[testmon #270](../../experiments/testmon-outer-coverage/README.md) |

**停止的动作**：Maka #4495 评论因集成 403 未发出；MOBA 第三方素材官方取回 HTTP 403，改由本机接收端代取；P107 与 Action 调试 10f6a6db 被平台拒绝，补齐命令和用途后请用户在 Dot 里批准。
