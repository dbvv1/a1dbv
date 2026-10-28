# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)（[10-26](archive/completed-through-2026-10-26.txt)）

## 当前重点

> 只放带完成条件的临时纠偏，最多三条，做完即删，dot 不改；方向与优先级在长期提示词（手册§6）。

- **B**：MOBA 积压整合（`c1d65ff`）smoke 复验通过后当轮旁置发布并更新网站，之后的候选同样当轮发布（[细则§6](game-taskbook.md#6-作品案例)）。MOBA 网站版本更新后删除本行。
- **共同**：B 在下一项帧同步或存档接入里，从[共享指令](../decisions/instruction-files.md)、[模型与 effort](../decisions/model-roles.md)、[依赖定位](../decisions/skills-and-plugins.md)中任选一项沿原入口采用；下次自然 UI 变更由新读者照[浏览器验收](../decisions/verification.md)实操补验，不以截图／静态 DOM 替代。各项结果写进提交说明后从本行删除。

## 分工

- 方向见 [AGENTS 锚点](../../AGENTS.md)。dot-A：AI coding 与 M6；dot-B：游戏 AI 全链路与核心模块（客户端／gameplay、引擎、部分服务端），作品案例见[游戏方向细则§6](game-taskbook.md#6-作品案例)。
- 本地模型委派走 [local-jobs](local-jobs/README.md)，由本机接收端（固定脚本）领取执行。旧的 Codex 接收端已退役；两个清理任务由新接收端按收窄后的范围接续。
- 指导层：Claude 核心方向会话负责方向与原则、dot-A 与仓库整体，Claude 游戏指导会话负责 dot-B，Codex 审计会话负责增量审计与仓库整理（手册§6）。
- 10-26 a1dbv 历史已按用户授权改写：开工前 `git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune`，本地分支按远端重建，不推送基于旧历史的分支。

## 项目板

> 过程见提交说明。[项目规则](LONG-TERM-PLAN.md#4-做什么)。

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿发现与 M6**：推荐值得试的做法；按产出调来源，候选进收件箱，漏检记入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | [本周 Top 5](../13-frontier-radar.md#本周-top-5)已做；按 explore-frontier 广扫，推进读者地图 🟡／⏳ 问题。 |
| P81 | **试用与选择**：真实编码试用，结论进决策页／模板 | dot-A | 脚本／CI 投影已用；跟进 [Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502)。Qwen [#15741](https://github.com/QwenLM/qwen-code/issues/15741) 本地 `fix/mcp-preserve-discovery-error`／`6099417` 保留报错、独审通过；core 通过，CLI 被杀／堆耗尽；待更大内存或降内存路径补验，未达 PR 门槛。Skill reader-test 全文超80行未派；建议指导层将页面输入另计，获准且协议／检查一致后恢复。 |
| MOBA | **MOBA-Like 基本战斗与完整内容**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | main `261034a`（运行源 `935bf8e`），默认 v10 保留／[v11 旁置](https://dbvv1-moba-like.pretty-llama-9945.chatgpt.site/candidate.html)，Site **v13 已交付**；[原 smoke 卡](local-jobs/B-MOBA-BACKLOG-SMOKE-20261028.md)三入口功能通过并接收（software；Node 退出码未采集），保留两次失败历史。旧整合候选 `e0d481b` 关闭、不再另派 smoke；分支、源包与模块保留，复用须接当前 v11＋续玩合同，不复制旧 client/world/battlefield。画质、手感、平衡待验。 |
| B-模块 | **核心模块**：客户端、gameplay、引擎、部分服务端（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 07 ready `a0ea312`、04 boot `a1b149`／input `d55e04e`、05 生命周期 `bb807ab` 已入 main，仅源码／CPU，不升引擎／作品评级。Star v7 存档、MOBA `ea7a064` 实操仍为旧成果；改键 `89f0831` 候选。[Unity 源准备](../../experiments/unity-encounter/README.md)未实跑，原任务暂停。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | FPS [四件源包](local-jobs/B-FPS-CONTENT-SET-001.md)已接收，旧通路／命中接线丢失待恢复。MOBA 三材质已接候选、林缘二改；原 PNG 不变，1024 解码约 16 MiB 仅存储估算，非 GPU 实测。开放音频未听未用，Nature 恢复未知。3D：网关三源同提示实测见 [3D 页](../../domains/game-dev/assets/3d.md)，本机 `gen3d`／`glbprep` 可用；下一步各案例 3–5 件标准件按实测分工采用。 |
| B-实例 | **AI 做游戏实例**：作品、作者过程与社区反馈 | dot-B | [Void Balls 制作线索](local-jobs/B-AI-GAME-SUPPLY-SOURCES-20261027.md)已接收；启动遇 WebGL 不支持／连接失败，未进游戏、未听音。Warpact 仍未玩到；没有新增整局品质推荐。 |
| SR | **Star-Rush 完整比赛品质**：地平线公路弯道，保留跑圈 | dot-B | master `f1da86c`（运行源 `8dddac2`）／Site **v8 已交付**，[Rapier 170–740m 旁置](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/rapier/)，默认驾驶不换、海岸音 off。五入口 software smoke 通过，非 GPU／品质结项；旧复盘已整合、独审并离线归档；候选发布待原 GitHub 批准，原调用成功且对象核验通过后补 smoke／旁置交付。标准件未接线，操控／视听待验。 |
| FPS | **FPS-Like 完整回合品质**，按 [brief](https://github.com/dbvv1/FPS-Like/blob/main/docs/brief.md) | dot-B | main `80f5ef62`（运行源 `19f718eb`）／Site **v14 已交付**，[离线训练赛旁置](https://dbvv1-fps-like.pretty-llama-9945.chatgpt.site/?gameplay=offline-training-v1&match=complete-v1&squads=offline-v1&environment=courtyard-v1)，旧默认保留。RTX 5070 验 9 bot／10 actor、首回合／next／整场reset，19构建 hash 一致；六回合整场／换边／replay／人感未验。原101／362／19候选已整合，不再另派或重复计上线。 标准件固定源 `9a5c02fc` 与第二轮功能 smoke 已核，历史执行违背仍在[原卡返工](local-jobs/B-FPS-ART-STANDARDS-SMOKE-20261029.md)；该旁置合入／网站更新因 GitHub 交付文件原上传调用审批未完成而暂停，Site 尚未更新。待原调用成功、对象及最终交付树核实后续发；不重试或换通道，待批不计上线。 |
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
| opensrc 上游补丁 | 目标 fork 入口尚未就绪；仓库所有者提供可写 fork 后，继续发布已审的仓库 ref 修复 | 本仓读者问题与试用继续，[补丁与复用说明](../../experiments/opensrc-ref-integrity/README.md)保留待发 |
| Maka 上游贡献 | 真人贡献者须实际审阅负责，适用时本人签 CLA | [OpenSpec 邀请已发](https://github.com/Fission-AI/OpenSpec/issues/2115#issuecomment-6401683363)；其他 PR 继续 |
| Serena／testmon 上游贡献 | 待对应可写 fork；Serena CLA 须本人决定 | 已审补丁：[Serena #2218](../../experiments/serena-vue-implementation/README.md)、[testmon #270](../../experiments/testmon-outer-coverage/README.md) |

**停止的动作**：Maka #4495 评论因集成 403 未发出；MOBA 第三方素材官方取回 HTTP 403，改由本机接收端代取；P107 与 Action 调试 10f6a6db 被平台拒绝，补齐命令和用途后请用户在 Dot 里批准。
