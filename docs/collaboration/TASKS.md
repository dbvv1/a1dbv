# 任务状态

> [运行手册](LONG-TERM-PLAN.md) · 长期提示词 [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)（10-26 前的完整状态见[当日归档](archive/completed-through-2026-10-26.txt)）

## 当前重点

> 每轮纠偏只改本节，最多三条（手册§6）。更新：2026-10-27，Claude 核心方向会话。

- **A**：读者地图已基本标 ✅；下一步把 ✅ 做实：每页请没读过的非作者只照页面做一遍，做不通的改或降 🟡；核心推荐没在真实任务上用过的，优先拿 dot-B 案例的真实编码任务试，记返工、漏检、时长的变化。P81 门禁拆分已批（见项目板），同时广扫前沿、跟进上游 PR。
- **B**：先打通素材供给：被拒上传按 operations 的写法重试，云端取不到的 CC0 资源包和开放权重生成交本机接收端。案例按新的质量环节做：非作者看整屏并排截图定最大的三处差距，先补大差距，每个质量单元推送并更新公开网站，三个案例各定一个看得见的近期目标。模块与制作链按地图照常并行；已做的模块（帧同步、存档、菜单焦点等）交给案例线接进可玩版本。
- **共同**：完成看读者或玩家得到的价值；TASKS、quality.md 和正文只写现状、差距和变化，过程写进提交说明。独立审查只用于新默认做法、模板和作品版本。本机接收端只做需要本机 GPU 或本机工具的任务。B 可评估把 `node_modules` 的读取拒绝改为仅编辑拒绝，便于读已安装依赖的源码与随包 Skill。

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
| P81 | **试用与写成选择**：读者照着就能采用；在案例仓库的真实编码任务和 a1dbv 脚本上试用，结论进 [13](../13-frontier-radar.md)、决策页和模板 | dot-A | [读者地图](../../README.md)已补齐答案页。三项脚本候选：Catalog CLI 完整测试拆成 2 段、每段 120 秒，指导层已批，通过后按原流程接收；跟评审 [Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502)。 |
| MOBA | **MOBA-Like 基本战斗**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | [网站 v11](https://dbvv1-moba-like.pretty-llama-9945.chatgpt.site)；施法动作、路肩与护盾图标在本地待发布。最大差距是地图仍是一条平涂道路、角色很小、缺少场景层次；下一步先补地图与场景结构。 |
| B-模块 | **核心模块**：客户端、gameplay、引擎、部分服务端（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | [菜单焦点与返回](../../domains/game-dev/04-client-modules.md#菜单也是控制的一部分)已在 FPS 本地候选 `0e883e6` 实跑并通过非作者审查，待随 FPS 发布；帧同步、存档等待接进案例。[旧 Unity 实跑](local-jobs/B-UNITY-ADOPTION-001.md)暂停。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | [海岸音频](local-jobs/B-OPENWEIGHT-AUDIO-001.md)已在 RTX 5070 生成两 seed 候选，relay `fa5664f`；尚未混合听验，构建默认 off。[3D 岩簇](local-jobs/B-OPENWEIGHT-3D-001.md)原任务 `cce6083` 修复待接收端续验，尚无生成 mesh。资源采用后回流制作链，不与案例云端品质互等。 |
| SR | **Star-Rush 完整弯道品质**：以地平线公路弯道为参照，保留跑圈 | dot-B | [公路网站 v5](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road)；默认公路入口与旧模式／存档边界在本地 `ebdc5ac` 待发布。下一步按并排截图补最大差距，音频待听。 |
| FPS | **FPS-Like 射击循环品质**，按 [brief](https://github.com/dbvv1/FPS-Like/blob/main/docs/brief.md) | dot-B | [main 239df5b](https://github.com/dbvv1/FPS-Like/commit/239df5badd8c43e14f57d381af379805910a1232)／[网站 v9](https://dbvv1-fps-like.pretty-llama-9945.chatgpt.site)：灵敏度保存／取消／恢复；地面与菜单焦点在本地待发布。最大差距是灰盒关卡与材质；下一步先补关卡场景与材质。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材、木筏与旧档的客户端验收欠项保留。 |

## 待人工验收（统一查看）

需要人亲自听、看、玩才能判断的项目集中在这里，由用户择时统一验收；执行者记录后继续其他工作。

- FPS-Like：原混音与受伤声候选各一段真实交火录音，听能否分清“我命中”与“我受伤”、是否遮掉敌人枪声、连续听是否疲劳；网页 v9 用原混音。
- MOBA-Like：[可玩入口与操作](https://github.com/dbvv1/MOBA-Like/blob/main/README.md)的硬件 GPU 画面、操作手感与完整对局体验；软件 WebGL2 smoke 已通过。
- Star-Rush：[公路候选](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road)的整体手感、视听与硬件画面；海岸环境声开关对比试听。
- 潮汐邮差 v2：素材、木筏与旧档。

## 需要用户决定

只放锚点红线内的事。等待只停对应动作，其余照常推进。

| 事项 | 等什么 | 期间照常做 |
|---|---|---|
| 仓库写入授权 | 两个 dot 的图片上传与新分支被平台拒绝（FPS `preview.png`、P81 候选分支）。用户按 [operations](operations.md) 的写法改两个账号的 Custom rules，改后告知两个 dot，被拒的上传各重试一次 | 被拒文件留分支，其余改动照常发布 |
| jrnl 上游 PR | 集成创建PR返回403，已审分支就绪；由用户决定是否打开[compare页](https://github.com/jrnl-org/jrnl/compare/main...dbvv1:jrnl:dot-a/dayone-dst-1422)创建Draft。拟标题：`Fix DayOne UTC conversion across daylight saving transitions`，说明与测试见[采用记录](../../experiments/jrnl-dayone-runtime-diagnosis.md) | 本仓发现、试用与既有PR跟进继续 |
| Actual 上游 PR | 集成创建PR返回403，已审分支就绪；由用户决定是否打开[compare页](https://github.com/actualbudget/actual/compare/master...dbvv1:actual:dot-a/load-config-typescript-1483)创建Draft。拟标题：`[AI] Migrate sync server configuration loader to TypeScript`；正文保留官方空模板，人类字段不代填 | 本仓发现、试用与既有PR跟进继续 |
| 本机模型权重下载 | 开放权重 3D 在本机取权重时 TLS 连接中断（B-OPENWEIGHT-3D-001），可能需要用户检查本机网络或代理 | 音频与其他制作链照常 |
| opensrc 上游补丁 | 目标 fork 入口尚未就绪；仓库所有者提供可写 fork 后，继续发布已审的仓库 ref 修复 | 本仓读者问题与试用继续，[补丁与复用说明](../../experiments/opensrc-ref-integrity/README.md)保留待发 |
| Maka 上游贡献 | 真人贡献者须实际审阅负责，适用时本人签 CLA | [OpenSpec 邀请已发](https://github.com/Fission-AI/OpenSpec/issues/2115#issuecomment-6401683363)；其他 PR 继续 |

**停止的动作**：Maka #4495 评论因集成 403 未发出；MOBA 第三方素材官方取回 HTTP 403，改由本机接收端代取；P107 与 Action 调试 10f6a6db 被平台拒绝，补齐命令和用途后请用户在 Dot 里批准。
