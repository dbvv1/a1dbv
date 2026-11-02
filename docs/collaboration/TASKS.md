# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 只放带完成条件的临时纠偏，最多三条，做完即删，dot 不改；方向与优先级在长期提示词（手册§6）。

- **A**：在途按原边界安全收尾，同时收口窄工具考证，将强源、替代和反例合成[长程开发路线](../decisions/long-tasks.md)及模板，在真实主线任务采用并修正卡点；交付后自然接续，以 Activity／心跳核证后删本行。其他核心问题与未知前沿并行，保留欠项，不重派四张已取消广扫；长期可靠性继续观察。
- **B**：按[恢复入口与补丁](../../experiments/cloud-browser-recovery/README.md)先区分失败 shell 的 IPC／loopback 与已有获准云浏览器能力，接续 FPS `67ae83a7` 的精确材料路由和 `qualityCapture`，不拿旧入口通过替代；其他独立长线继续。三案画面按 [game-quality-pass §4](../../domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md#4-同机位对比非作者判定)：固定画质同机位软件图、拟发布入口完整 smoke、非作者盲评；不等硬件 GPU、不占本机。`--no-sandbox` 只限三案自有页面，外层沙箱不动，明确拒绝不换路；核非空 WebGL2 图、参数、renderer 与正常退出。手感三项继续：FPS 加速度／摩擦／插值，MOBA 前摇／施法下一指令排队且结束当 tick 执行，Star 轮胎峰后下降／载荷转移及动力测法；过单测、无画面模拟和云 smoke 后旁置发布。同输入前后值写入 feel.md／记分卡（FPS 滑停／反向／插值、MOBA 下一技能、Star 侧滑），差距继续追。三案出图命令可用、画面候选已接收或退回、三项手感候选已发布且前后值已记录后删除本行。
- **共同**：B 在下一项帧同步或存档接入里，从[共享指令](../decisions/instruction-files.md)、[模型与 effort](../decisions/model-roles.md)、[依赖定位](../decisions/skills-and-plugins.md)中任选一项沿原入口采用；下次自然 UI 变更由新读者照[浏览器验收](../decisions/verification.md)实操补验，不以截图／静态 DOM 替代。各项结果写进提交说明后从本行删除。

## 分工

- [分工](../../AGENTS.md)：A：AI coding／M6；B：游戏 AI 全链路／核心模块；[案例](game-taskbook.md#6-作品案例)。
- 本机由 [local-jobs](local-jobs/README.md) 固定接收器领取；旧 Codex 接收器退役，两项清理按收窄范围接续。
- 指导层（手册§6）：Claude 核心管方向／原则／A／整体，游戏指导管 B；Codex 审计管增量审计／整理。
- 10-26 历史已获准改写：开工 `git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune`，按远端重建分支，不推旧历史。

## 项目板

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿与 M6**：候选入收件箱，漏检入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | 按 explore-frontier 广扫，推进读者地图 🟡／⏳。 |
| P81 | **试用与选择**：实作回流决策页／模板 | dot-A | [MODEL](local-jobs/A-MODEL-EFFORT-READER-20261029.md) 待接收；跟进 [Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502)。Qwen [旧基线](../../experiments/candidate-reset-recovery/README.md)构建／类型／409 测试通过。#15757 已合、#15741 关闭；静读 `dd020ddf`：旧14例中6例过时／8例待验，保留已合分页／重名策略。全套 socket 仍被拒，原动作获准后补 PR 门槛。Skills 待新读者实做，任务正文附全文；先核写者退出／空槽；本机禁安装，[越界](local-jobs/A-SKILL-PACKAGE-ENTRY-20261030.md#指导层交接)交 Claude 核心。 |
| MOBA | **MOBA-Like 战斗与完整内容**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | main `dea84c4`／Site **v18 已交付**；[关键声音旁置](https://dbvv1-moba-like.pretty-llama-9945.chatgpt.site/candidate.html?commands=buffer-v1&audio=critical-v1)默认 off。496 tests、v11/v12 回放、WebAudio 生命周期／OfflineAudio 波形、38 文件 hash 通过；software，试听／音画同步待验。04 已回写；原手感／截图待原动作获准。 |
| B-模块 | **核心模块**（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 07 ready `a0ea312`、04 boot `a1b149`／input `d55e04e`、05 生命周期 `bb807ab` 已入 main；原实验仅源码／CPU；04 [FPS 前台时钟与输入折叠](../../domains/game-dev/04-client-modules.md#web-foreground-clock)已接可玩 v20（`1183340`），三入口各两轮普通生命周期通过（software，不升原生引擎评级）。Star v7 存档、MOBA `ea7a064` 实操为旧成果；改键 `89f0831` 候选。[Unity 源准备](../../experiments/unity-encounter/README.md)未实跑，原任务暂停。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | FPS [四件源包](local-jobs/B-FPS-CONTENT-SET-001.md)已接收，旧通路／命中接线待恢复。MOBA 三材质已接候选、林缘二改；PNG 未改；1024 解码约 16 MiB 为存储估算，非 GPU 实测。开放音频未听未用，Nature 恢复未知。3D：网关三源同提示实测见 [3D 页](../../domains/game-dev/assets/3d.md)，本机 `gen3d`／`glbprep` 可用；各案例采用 3–5 件标准件，按实测分工。 |
| B-实例 | **AI 游戏实例**：作品／作者过程／社区反馈 | dot-B | [Void Balls 制作线索](local-jobs/B-AI-GAME-SUPPLY-SOURCES-20261027.md)已接收；启动遇 WebGL 不支持／连接失败，未进游戏／听音；Warpact 未玩，无新增整局品质推荐。 |
| SR | **Star-Rush 比赛品质**：地平线公路弯道，保留跑圈 | dot-B | master `f1da86c`（运行源 `8dddac2`）／Site **v8 已交付**，[Rapier 170–740m 旁置](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/rapier/)，默认驾驶不换、海岸音 off；五入口 software smoke 通过，非 GPU／品质结项。复盘候选已发布、上传阻塞解除；内容基线 `c4e6dd1` 与已审源码一致；runner 补原始 renderer 后为 [`42f8404`](https://github.com/dbvv1/Star-Rush-Reborn/commit/42f8404c07f3ebc3d1fd575dd16ead440231e917)。CPU／独审已过，待原接收端串行 headless smoke 后旁置，网站仍 v8。标准件未接线，操控／视听待验。 |
| FPS | **FPS-Like 完整回合品质** | dot-B | main `2b7ac87`／Site **v21 已交付**；默认训练赛／标准件／灯光；AI 材质与 ground 手感旁置，材质已回写。新腰腿候选 [`fc64c2b`](https://github.com/dbvv1/FPS-Like/commit/fc64c2b568be4bc15250447b3959bf50957684fe)：云 CPU／类型／构建／回放通过、hash 与基线一致；CPU 已接收；原卡 blocked，执行端退出未知。云 smoke 导航前 EPERM／SIGABRT，无新图／盲评，不发布；旧 guard 待取回。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材／木筏／旧档待客户端验收。 |

## 待人工验收

用户择时验收；其余照常。

- FPS-Like：原混音／受伤声各一段交火录音，听命中与受伤是否可分、是否遮敌人枪声、久听是否疲劳；网页 v12 用原混音。
- MOBA-Like：[可玩入口与操作](https://github.com/dbvv1/MOBA-Like/blob/main/README.md)的硬件 GPU 画面、操作手感与完整对局体验；软件 WebGL2 smoke 已通过。
- Star-Rush：[公路候选](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road)的整体手感、视听与硬件画面；海岸环境声开关对比试听。
- 潮汐邮差 v2：素材、木筏与旧档。

## 需要用户决定

锚点红线事项，仅停对应动作。

| 事项 | 等什么 | 期间照常做 |
|---|---|---|
| 云端截图 | MOBA 线上 `NET::ERR_CERT_AUTHORITY_INVALID`，待可信证书链后复验 | 本地 `27a40be`／Site v16：WebGL2 四路 smoke、四机位双重复通过；两非作者判小幅改善，正式评分待补。获准 `--no-sandbox`；已留 renderer／参数（SwiftShader software），exit 0、端口关闭。 |
| FPS 新候选云端 smoke | 11-02 已实核原生云端 CDP 浏览器存在；原候选 `8e66087e` 构建成功、preview 同进程 HTTP 200 且 index 哈希匹配，但跨 exec 与云浏览器访问该候选 preview 均连接拒绝。shell Unix stream 创建仍 EPERM，socketpair／TCP 通过；当前缺候选预览跨入口可达性，非参数授权或品质失败，不改外层沙箱 | 无页面／WebGL2／新图；完整六回合、换边、终局重开与盲评未跑。两个自有 preview 已 SIGINT 退出 130，未获正常 close／全资源清理回执；云错误页已关闭。候选保留，待原授权云浏览器可访问准确构建后续验，本机不接浏览器。 |

## 已停止的动作

三项投稿不再待用户决定，不卡主线；保留补丁与实测，明确拒绝不重试／换入口。

- jrnl：Draft 创建被集成 403 拒绝，无 PR；保留[已审分支 compare](https://github.com/jrnl-org/jrnl/compare/main...dbvv1:jrnl:dot-a/dayone-dst-1422)及[说明与测试](../../experiments/jrnl-dayone-runtime-diagnosis.md)。
- agents-md-lint：Draft 创建被集成 403 拒绝；`54313ea` 回读无 PR、check-runs／workflows 均 0；保留[分支 compare](https://github.com/openintelligence-labs/agents-md-lint/compare/main...dbvv1:agents-md-lint:fix/input-contract-and-placeholder-paths?expand=1)及[本地测试范围](../../experiments/instruction-file-lint/README.md)，投稿／hosted CI 未完成。
- testmon：未取得可写 fork，无 PR；保留[已审补丁 #270 与实测](../../experiments/testmon-outer-coverage/README.md)。Serena 仍[跟进已有 PR #2242](../../experiments/serena-vue-implementation/README.md)，不重复投稿。

其他：Maka #4495 评论因集成 403 未发出，停止投稿／追发；MOBA 第三方素材官方取回 HTTP 403，改由本机接收端代取；P107 与 Action 调试 10f6a6db 被平台拒绝，待补齐命令／用途，由用户在 Dot 批准。
