# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)（[10-26](archive/completed-through-2026-10-26.txt)）

## 当前重点

> 只放带完成条件的临时纠偏，最多三条，做完即删，dot 不改；方向与优先级在长期提示词（手册§6）。

- **B**：手感三项不依赖浏览器，立即做成候选：FPS 训练赛移动换成加速度＋摩擦并补渲染插值；MOBA 前摇与施法中的下一条指令排队、结束当帧执行；Star 轮胎侧滑曲线补峰后下降与载荷转移，并先定动力范围的测法。过单元测试、无画面模拟与云端浏览器 smoke 后旁置发布。三项候选已发布，且同一输入脚本的前后值已写进各案 feel.md 与记分卡（FPS 滑停／反向／插值；MOBA 施法中的下一技能在结束当 tick 执行；Star 侧滑曲线）后删除本行；是否落进范围由记分卡继续追。
- **B**：画面与 smoke 在 dot 云电脑跑，不占本机。云 headless Chromium 因容器不支持其沙箱而崩溃：用户 10-30 允许加 `--no-sandbox`，只用于打开三个案例的页面（本地预览与案例网站）做截图和 smoke，不访问其他网站，dot 平台外层沙箱不动。跑通以非空 WebGL2 软件图、记下启动参数与 renderer、进程正常退出为准；加参数后仍失败，只停此动作并把报错写回“需要用户决定”。跑通后每案一条命令出同机位图，补齐目标图与首轮盲评，再按 [game-quality-pass](../../domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md)§3 第 1 层逐案核受光路径做灯光层旁置候选（三案缺环境光照、AO 与调色，FPS 另缺色调映射与投射阴影）。三案出图命令可用、灯光候选双盲结果已记后删除本行。
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
| P81 | **试用与选择**：实作回流决策页／模板 | dot-A | 脚本／CI 投影已用；跟进 [Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502)。Qwen [固定基线补验](../../experiments/candidate-reset-recovery/README.md)已过 build／typecheck、409 项相关测试；完整测试卡 socket 权限，未达 PR 门槛；待兼容 #15757。Skill reader-test 全文超 80 行未派，待指导层批准页面另计并同步协议／检查；另交[禁安装越界](local-jobs/A-SKILL-PACKAGE-ENTRY-20261030.md#指导层交接)给 Claude 核心方向会话。 |
| MOBA | **MOBA-Like 基本战斗与完整内容**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | main `dea84c4`／Site **v18 已交付**；[关键声音旁置](https://dbvv1-moba-like.pretty-llama-9945.chatgpt.site/candidate.html?commands=buffer-v1&audio=critical-v1)默认 off。496 tests、v11/v12 回放、WebAudio 生命周期／OfflineAudio 波形、38 文件 hash 通过；software，试听与音画同步待验。04 已回写；原手感／截图待批动作仍须原动作获准。 |
| B-模块 | **核心模块**：客户端、gameplay、引擎、部分服务端（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 07 ready `a0ea312`、04 boot `a1b149`／input `d55e04e`、05 生命周期 `bb807ab` 已入 main，原实验仍仅源码／CPU；04 [FPS 前台时钟与输入折叠](../../domains/game-dev/04-client-modules.md#web-foreground-clock)已接可玩 v20（`1183340`），三入口各两轮普通生命周期通过，software，不升原生引擎评级。Star v7 存档、MOBA `ea7a064` 实操仍为旧成果；改键 `89f0831` 候选。[Unity 源准备](../../experiments/unity-encounter/README.md)未实跑，原任务暂停。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | FPS [四件源包](local-jobs/B-FPS-CONTENT-SET-001.md)已接收，旧通路／命中接线丢失待恢复。MOBA 三材质已接候选、林缘二改；原 PNG 不变，1024 解码约 16 MiB 仅存储估算，非 GPU 实测。开放音频未听未用，Nature 恢复未知。3D：网关三源同提示实测见 [3D 页](../../domains/game-dev/assets/3d.md)，本机 `gen3d`／`glbprep` 可用；下一步各案例 3–5 件标准件按实测分工采用。 |
| B-实例 | **AI 做游戏实例**：作品、作者过程与社区反馈 | dot-B | [Void Balls 制作线索](local-jobs/B-AI-GAME-SUPPLY-SOURCES-20261027.md)已接收；启动遇 WebGL 不支持／连接失败，未进游戏、未听音。Warpact 仍未玩到；没有新增整局品质推荐。 |
| SR | **Star-Rush 完整比赛品质**：地平线公路弯道，保留跑圈 | dot-B | master `f1da86c`（运行源 `8dddac2`）／Site **v8 已交付**，[Rapier 170–740m 旁置](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/rapier/)，默认驾驶不换、海岸音 off。五入口 software smoke 通过，非 GPU／品质结项；复盘候选已发布，原上传阻塞解除；游戏内容基线 `c4e6dd1` 与已审源码一致，runner补齐原始renderer记录后固定为 [`42f8404`](https://github.com/dbvv1/Star-Rush-Reborn/commit/42f8404c07f3ebc3d1fd575dd16ead440231e917)。CPU／独审已过，待既有接收端串行 headless smoke 后旁置交付；网站仍 v8。标准件未接线，操控／视听待验。 |
| FPS | **FPS-Like 完整回合品质** | dot-B | main `2b7ac87`／Site **v21 已交付**；默认训练赛＋标准件＋灯光，AI 材质与 ground 手感仍旁置，材质采用已回写。新腰腿候选 [`fc64c2b`](https://github.com/dbvv1/FPS-Like/commit/fc64c2b568be4bc15250447b3959bf50957684fe)：云 CPU 393/393、类型／构建、200 局与三 seed 六回合回放通过，hash 与基线一致；CPU 已接收，原卡 blocked，原执行端退出未知。云 smoke 导航前 EPERM／SIGABRT，无新图／盲评，不合入发布。旧 guard 原件仍待取回。 |
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
| 云端截图 | MOBA 线上 `NET::ERR_CERT_AUTHORITY_INVALID`，待可信证书链后复验 | 本地 WebGL2：`27a40be`／Site v16，四路 smoke、四机位双重复通过；两非作者仅判小幅改善，正式评分待补。限定授权 `--no-sandbox`；原始 renderer／参数已留存（SwiftShader software），进程 exit 0、端口关闭。 |
| FPS 新候选云端 smoke | `fc64c2b` 复用原 CPU；已用获准 `--no-sandbox`，导航前报 `socket() failed: Operation not permitted (1)`、SIGABRT；待云环境支持既有启动，外层沙箱不改，不重试／重复要许可 | 无新图／WebGL2证据，preview 已关闭；CPU 已验，本机不接浏览器。 |
| jrnl 上游 PR | 集成创建PR返回403，已审分支就绪；由用户决定是否打开[compare页](https://github.com/jrnl-org/jrnl/compare/main...dbvv1:jrnl:dot-a/dayone-dst-1422)创建Draft。拟标题：`Fix DayOne UTC conversion across daylight saving transitions`，说明与测试见[采用记录](../../experiments/jrnl-dayone-runtime-diagnosis.md) | 本仓发现、试用与既有PR跟进继续 |
| Serena／testmon 上游贡献 | 待对应可写 fork；Serena CLA 须本人决定 | 已审补丁：[Serena #2218](../../experiments/serena-vue-implementation/README.md)、[testmon #270](../../experiments/testmon-outer-coverage/README.md) |

**停止的动作**：Maka #4495 评论因集成 403 未发出，本轮不再推进投稿或追发；MOBA 第三方素材官方取回 HTTP 403，改由本机接收端代取；P107 与 Action 调试 10f6a6db 被平台拒绝，补齐命令和用途后请用户在 Dot 里批准。
