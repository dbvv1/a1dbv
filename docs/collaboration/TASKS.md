# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)（[10-26](archive/completed-through-2026-10-26.txt)）

## 当前重点

> 只放带完成条件的临时纠偏，最多三条，做完即删，dot 不改；方向与优先级在长期提示词（手册§6）。

- **B**：三个案例各在 `docs/quality.md` 开头建[质量记分卡](../../domains/game-dev/templates/.claude/skills/game-quality-pass/references/quality-bar.md)：画面每个命名机位的目标图与首轮盲评分、手感规格表与首轮实测、当前阶段内容清单与覆盖率；之后按细则§6 第 3 条只追记分卡最大差距。三张记分卡都建好后删除本行。
- **B**：画面与 smoke 都在 dot 云电脑里跑（10-29 用户：不占本机）：先让云电脑 headless Chromium 软件渲染跑通一次截图（10-29 dot-A 实测启动即报环境错误，见[探索证据](../research/2026-10-15-exploration-evidence.md)“社区入口实测 2026-10-29”；先修环境，A／B 谁先修好在 TASKS 写一行，不重复修；不开可见浏览器，被平台拒绝则只停此动作并记入“需要用户决定”），再每案一条命令出同机位图，补齐目标图与首轮盲评；再按 [game-quality-pass](../../domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md)§3 第 1 层逐案核材质受光路径做灯光层旁置候选（三案缺环境光照、AO 与调色，FPS 另缺色调映射与投射阴影）。本机已排的截图与 smoke 卡不再续跑；浏览器修好前，候选按单元测试与无画面模拟先过门槛、浏览器 smoke 补跑后再旁置发布。Star 按 10-29 用户决定把 brief 改为风格化，重做目标图并重核记分卡。三案出图命令可用、灯光候选双盲结果已记、Star brief 已改后删除本行。
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
| SR | **Star-Rush 完整比赛品质**：地平线公路弯道，保留跑圈 | dot-B | master `f1da86c`（运行源 `8dddac2`）／Site **v8 已交付**，[Rapier 170–740m 旁置](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/rapier/)，默认驾驶不换、海岸音 off。五入口 software smoke 通过，非 GPU／品质结项；复盘候选已发布，原上传阻塞解除；游戏内容基线 `c4e6dd1` 与已审源码一致，runner补齐原始renderer记录后固定为 [`42f8404`](https://github.com/dbvv1/Star-Rush-Reborn/commit/42f8404c07f3ebc3d1fd575dd16ead440231e917)。CPU／独审已过，待既有接收端串行 headless smoke 后旁置交付；网站仍 v8。标准件未接线，操控／视听待验。 |
| FPS | **FPS-Like 完整回合品质**，按 [brief](https://github.com/dbvv1/FPS-Like/blob/main/docs/brief.md) | dot-B | main `a14a6b52`（标准件运行源 `9a5c02fc`）／Site **v15 已交付**，[三件环境标准件旁置](https://dbvv1-fps-like.pretty-llama-9945.chatgpt.site/?gameplay=offline-training-v1&match=complete-v1&squads=offline-v1&environment=courtyard-v1&art=standards-v1)，旧默认及 v14 离线赛入口保留。332 项 CPU 与第二轮 RTX 5070 两路功能 smoke 通过，21 构建 hash 一致；首回合／next／整场 reset 已验，六回合整场／换边／终局／人感未验。三件资源已接线，菜单遮挡致非作者不可判优，品质与二改未结项。[原卡历史说明已限定接收](local-jobs/B-FPS-ART-STANDARDS-SMOKE-20261029.md)，首次切换重跑违背及缺证保留，不等于执行合规。仅自制目标 PNG 仍等原上传审批，不重传／换通道；该图待批不再阻塞已验证代码交付。 |
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
| Serena／testmon 上游贡献 | 待对应可写 fork；Serena CLA 须本人决定 | 已审补丁：[Serena #2218](../../experiments/serena-vue-implementation/README.md)、[testmon #270](../../experiments/testmon-outer-coverage/README.md) |

**停止的动作**：Maka #4495 评论因集成 403 未发出，本轮不再推进投稿或追发；MOBA 第三方素材官方取回 HTTP 403，改由本机接收端代取；P107 与 Action 调试 10f6a6db 被平台拒绝，补齐命令和用途后请用户在 Dot 里批准。
