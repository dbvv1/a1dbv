# 任务状态

> [运行手册](LONG-TERM-PLAN.md) · 长期提示词 [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)（10-26 前的完整状态见[当日归档](archive/completed-through-2026-10-26.txt)）

## 当前重点

> 每轮纠偏只改本节，最多三条（手册§6）。更新：2026-10-27，Claude 核心方向会话。

- **A**：从根 README 的“读者问题 → 答案”地图取下一项，先做 ⏳：该装哪些 Skill 与插件、Codex 过度防御怎么治、本周值得试什么（13 首屏改成本周 Top 5）；根 README 其余入口表逐步并入地图。根 README 与游戏首页里的否定串、限定语按写法改写。dot 运行线：查长程、多 Agent 做法，提升两个 dot 的并行与产出。
- **B**：三条线按 `domains/game-dev/README.md` 的模块与制作链地图各自推进：模块线把“可用”的模块在案例里证实，引擎与服务端按地图补第一版，已有内容合并补全不另开重复页；制作链让开放权重 3D 与音频进作品；案例按里程碑阶梯走质量环节，差距清单放各案例 `docs/quality.md`。新页成熟度如实标，文档依据的最多“可用”。
- **共同**：完成看读者或玩家得到的价值；过程写在提交说明里，写做了什么、还差什么，不写免责，不进正文和 TASKS。独立审查只用于新默认做法、模板和作品版本。本机接收端只做需要本机 GPU 或本机工具的任务。

## 分工

- 方向见 [AGENTS 锚点](../../AGENTS.md)。dot-A：AI coding 与 M6；dot-B：游戏 AI 全链路与核心模块（客户端／gameplay、引擎、部分服务端），作品案例见[游戏方向细则§6](game-taskbook.md#6-作品案例)。
- 本地模型委派走 [local-jobs](local-jobs/README.md)，由本机接收端（固定脚本）领取执行。旧的 Codex 接收端已退役；两个清理任务由新接收端按收窄后的范围接续。
- 指导层：Claude 核心方向会话负责方向与原则，Codex 审计会话负责增量审计与仓库整理（手册§6）。
- 10-26 a1dbv 历史已按用户授权改写：开工前 `git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune`，本地分支按远端重建，不推送基于旧历史的分支。

## 项目板

> 只写当前状态和下一步；过程写进提交说明。规则见[运行手册第 4 节](LONG-TERM-PLAN.md#4-做什么)。

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿发现与 M6**：让读者第一时间知道该试什么；来源按产出调整，候选进收件箱，漏检对照记入 [25](../25-ai-exploration.md) | dot-A | 首轮扫描、周校准与[本周 Top 5](../13-frontier-radar.md#本周-top-5)已做。下一步按 explore-frontier 广扫，同时推进读者地图上仍为 🟡／⏳ 的问题，漏检记进探索证据。 |
| P81 | **试用与写成选择**：读者照着就能采用；在案例仓库的真实编码任务和 a1dbv 脚本上试用，结论进 [13](../13-frontier-radar.md)、决策页和模板 | dot-A | [读者地图](../../README.md)已补 Skill／插件选择与 Codex 过度工程的答案页。三项脚本候选待原门禁通过；跟评审 [Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502)。 |
| MOBA | **MOBA-Like 基本战斗**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | [main a7d6605](https://github.com/dbvv1/MOBA-Like/commit/a7d66054ae5885e38af43f88c4472a58cb765d89) 已进入[网站](https://dbvv1-moba-like.pretty-llama-9945.chatgpt.site) v11（模拟默认 10）：右键敌人追击普攻、地面移动，菜单不穿透；[当前画面与差距](https://github.com/dbvv1/MOBA-Like/blob/main/docs/quality.md)每轮替换。下一步改善出手方向与命中辨识；基本战斗仍未达到英雄联盟品质。 |
| B-模块 | **核心模块**：客户端、gameplay、引擎、部分服务端（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 本地化真实消费者已交付；本批补[等待→预测回滚取舍](../../domains/game-dev/07-networking-and-server.md#rollback-adoption)，官方模拟真实恢复、技能二改与成本对照。保原引擎栈，未作公网／原生性能结论；[旧 Unity 实跑](local-jobs/B-UNITY-ADOPTION-001.md)仍暂停。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | [海岸音频](local-jobs/B-OPENWEIGHT-AUDIO-001.md)已在 RTX 5070 生成两 seed 候选，relay `fa5664f`；尚未混合听验，构建默认 off。[3D 岩簇](local-jobs/B-OPENWEIGHT-3D-001.md)原任务 `cce6083` 修复待接收端续验，尚无生成 mesh。资源采用后回流制作链，不与案例云端品质互等。 |
| SR | **Star-Rush 完整弯道品质**：以地平线公路弯道为参照，保留跑圈 | dot-B | [master cfb2075](https://github.com/dbvv1/Star-Rush-Reborn/commit/cfb2075a44c502af1b209ca28a274ad78fee7b26) 已上网站 v4：[公路候选](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road)受光改进；截图与差距见产品 docs/quality.md。下一步小屏 HUD 与音频候选。 |
| FPS | **FPS-Like 射击循环品质**，按 [brief](https://github.com/dbvv1/FPS-Like/blob/main/docs/brief.md) | dot-B | [main 0d8c0c2](https://github.com/dbvv1/FPS-Like/commit/0d8c0c2c29e3b5d208b943d46a8f713392a9e855) 已上网站 v8：换弹双袖保接触；[换弹做法](../../domains/game-dev/assets/animation.md#第四步换弹手离开枪是动作的一部分)已回流。差距在左腕、手指、人物单姿态与声音。下一步核开火／受击声画辨识。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材、木筏与旧档的客户端验收欠项保留。 |

## 待人工验收（统一查看）

需要人亲自听、看、玩才能判断的项目集中在这里，由用户择时统一验收；执行者记录后继续其他工作。

- FPS-Like：已交当前原混音／受伤声候选两段真实交火录音；候选默认关闭，待听是否能分清“我命中”与“我受伤”、是否遮掉敌人枪声及连续疲劳。录音成功不等于听感采用；网页当前仍为 v8。
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
| Maka 上游贡献 | 真人贡献者须实际审阅负责，适用时本人签 CLA | [OpenSpec 邀请已发](https://github.com/Fission-AI/OpenSpec/issues/2115#issuecomment-6401683363)；其他 PR 继续 |

**停止的动作**：Maka #4495 评论同样因集成 403 未发出；MOBA 第三方素材官方取回 HTTP 403，自有与原创占位素材已通过；P107 与 Action 调试 10f6a6db 曾被平台拒绝，负责人补齐命令和用途后再请用户在 Dot 里批准。
