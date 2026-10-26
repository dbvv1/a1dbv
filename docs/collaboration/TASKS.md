# 任务状态

> [运行手册](LONG-TERM-PLAN.md) · 长期提示词 [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)（10-26 前的完整状态见[当日归档](archive/completed-through-2026-10-26.txt)）

## 当前重点

> 每轮纠偏只改本节，最多三条（手册§6）。更新：2026-10-26，Claude 核心方向会话。

- **A**：回到使命本身：发现 → 试用 → 写成选择。每周一轮扫官方、开源项目、社区与技术博客，候选进[收件箱](inbox.md)，挑最值得的在本仓自己的 AI 开发里实际用，结论写进 13 与决策页；每周做一次漏检对照（M6）。Datasette #3015、Memos #6502 跟到结束，不再新开第三方应用采用。
- **B**：AI 全链路、核心模块（先覆盖最核心、最通用的模块，含引擎与部分服务端）和三个案例一直同时推进。MOBA-Like：`b/moba-playable-integrated-v8` 的浏览器 smoke 已在 `d32f5d9` 实跑通过，直接合入 main，不再补证据字段；Star-Rush 做 brief 里的品质提升；FPS-Like 在 MOBA-Like main 可玩后开工。
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
| P90 | **前沿发现与 M6**：让读者第一时间知道该试什么；固定来源每周一轮，候选进收件箱，漏检对照记入 [25](../25-ai-exploration.md) | dot-A | 下一步：第一轮扫描和首次漏检对照。上次校准 10-22：25 项参照漏 6 项。 |
| P81 | **试用与写成选择**：读者照着就能采用；在本仓自己的 AI 开发里试用，结论进 [13](../13-frontier-radar.md)、决策页和模板 | dot-A | 已有采用结论（Datasette、MDX、Memos、Storybook、Memoh）写进路线页后收口；[Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502) 跟评审；jrnl 补丁待用户创建 PR（见下）。 |
| MOBA | **MOBA-Like 纵切片**：可玩 → 第二次需求修改，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | 可玩集成已入 [main 274bc62](https://github.com/dbvv1/MOBA-Like/commit/274bc62c69f84294fbd4c97f7acff9f16ca8f68a)，[原 smoke 任务](local-jobs/B-MOBA-CLIENT-SMOKE-001.md)已接受软件 WebGL2 实跑与独审；按 [README](https://github.com/dbvv1/MOBA-Like/blob/main/README.md) 运行并操作。默认 v8，模拟指标继续作调参报告；下一步第二次需求修改与制作链接入。 |
| B-模块 | **核心模块**：客户端、gameplay、引擎、部分服务端（[细则 G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 下一步：服务端第一页，联网模型选型与接入起点，在 MOBA-Like 模拟上跑两端帧同步样例（两端状态哈希一致）；已写模块进案例用时补实测。 |
| B-制作链 | **AI 全链路**（[细则 G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | [开门源→影片→玩法](../../experiments/gate-reveal/README.md)已实际制作、浏览器播放／跳过返回与二改通过（静音灰盒）。下一步：MOBA 英雄模型与动作从制作到接入 main，写回 3d、animation 两页，以进入可玩构建为验收。 |
| SR | **Star-Rush 品质提升**：驾驶手感、竞速 AI、美术与音频，按 [brief](https://github.com/dbvv1/Star-Rush-Reborn/blob/master/docs/brief.md) | dot-B | master [`5cfbb91`](https://github.com/dbvv1/Star-Rush-Reborn/commit/5cfbb9135abdfc32fe8c64026f486aea8ce75ee5) 已接入转向牌共享源与构建开关；默认 baseline 保原画面，三变体客户端回归通过。下一步候选实机观感与试玩反馈，不卡其他项。 |
| FPS | **FPS-Like 纵切片**，按 [brief](https://github.com/dbvv1/FPS-Like/blob/main/docs/brief.md) | dot-B | MOBA-Like main 可玩后开工，先做模拟层和无画面验收。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材、木筏与旧档的客户端验收欠项保留。 |

## 待人工验收（统一查看）

需要人亲自听、看、玩才能判断的项目集中在这里，由用户择时统一验收；执行者记录后继续其他工作。

- MOBA-Like：[可玩入口与操作](https://github.com/dbvv1/MOBA-Like/blob/main/README.md)的硬件 GPU 画面、操作手感与完整对局体验；软件 WebGL2 smoke 已通过。
- Star-Rush：护栏碰撞音频两套候选的听感与混音；Canvas 房屋锚点（`STAR_RUSH_CANVAS_HOUSE_ANCHORS=on`）目视；主弯驾驶手感与完整 WebGL 画面；转向牌 `STAR_RUSH_SIGNBOARD_VARIANT=navy-v2` 在真实路段的运动、光照和左右辨识。
- 潮汐邮差 v2：素材、木筏与旧档。
- Memos：owner 登录与编辑。
- Maka 侧聊模型选择：真实后端／Electron 与完整应用体验（[固定候选](local-jobs/A-STORYBOOK-ADOPTION-001.md)）。
- Memoh Colada 升级：真实业务、查询缓存与刷新恢复（[补丁](local-jobs/A-MIGRATION-ADOPTION-001.md)）。

## 需要用户决定

只放锚点红线内的事。等待只停对应动作，其余照常推进。

| 事项 | 等什么 | 期间照常做 |
|---|---|---|
| jrnl 上游 PR | GitHub 集成在上游仓库创建 PR 返回 403。补丁已在 fork：用户打开 [compare 页](https://github.com/jrnl-org/jrnl/compare/main...dbvv1:jrnl:dot-a/dayone-dst-1422?expand=1) 点创建（Draft），标题与说明用 [采用记录](../../experiments/jrnl-dayone-runtime-diagnosis.md)里的修复摘要 | 其他上游 PR 照常跟进 |
| Maka 上游贡献 | 真人贡献者须实际审阅负责，适用时本人签 CLA | [OpenSpec 邀请已发](https://github.com/Fission-AI/OpenSpec/issues/2115#issuecomment-6401683363)；其他 PR 继续 |

**停止的动作**：Maka #4495 评论同样因集成 403 未发出；MOBA 第三方素材官方取回 HTTP 403，自有与原创占位素材已通过；P107 与 Action 调试 10f6a6db 曾被平台拒绝，负责人补齐命令和用途后再请用户在 Dot 里批准。
