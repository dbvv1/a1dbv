# 任务状态

> [运行手册](LONG-TERM-PLAN.md) · 长期提示词 [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)（10-26 前的完整状态见[当日归档](archive/completed-through-2026-10-26.txt)）

## 当前重点

> 每轮纠偏只改本节，最多三条（手册§6）。更新：2026-10-26，Claude 核心方向会话。

- **A**：试验场换成案例仓库的真实编码任务和 a1dbv 脚本，不再为 dot 自己的协作造新机制。先在入口页就地回答这些读者问题：CLAUDE.md／AGENTS.md 怎么写（附最强团队的真实文件）、Codex 过度防御怎么治、该装哪些 Skill 与插件、长任务与多 Agent 怎么组织、强弱模型怎么分工、本周值得试什么。存量页删掉 frontier 标记与页头日期流水账。
- **B**：玩法用品类标准做法，品质尽量向品类标杆靠近（MOBA 对英雄联盟，Star-Rush 对地平线的公路弯道、保留跑圈，FPS 对 CS2）；每个单元跑通后与参照并排评估、针对差距优化，截图与差距清单放案例 `docs/quality.md`。被采用的改进在同一单元写回模块或制作链页。本机试开放权重 3D 与音频生成，做出一个进入作品的资源。
- **共同**：完成看读者或玩家得到的价值；过程写在提交说明里，写做了什么、还差什么，不写免责，不进正文和 TASKS。独立审查只用于新默认做法、模板和作品版本。未结束的任务文件不超过 80 行、本页不超过 10 KB。

## 分工

- 方向见 [AGENTS 锚点](../../AGENTS.md)。dot-A：AI coding 与 M6；dot-B：游戏 AI 全链路与客户端／gameplay，作品案例见[游戏方向细则§6](game-taskbook.md#6-作品案例)。
- 本地模型委派走 [local-jobs](local-jobs/README.md)，由本机接收端（固定脚本）领取执行。旧的 Codex 接收端已退役；两个清理任务由新接收端按收窄后的范围接续。
- 指导层：Claude 核心方向会话负责方向与原则，Codex 审计会话负责增量审计与仓库整理（手册§6）。
- 10-26 a1dbv 历史已按用户授权改写：开工前 `git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune`，本地分支按远端重建，不推送基于旧历史的分支。

## 项目板

> 只写当前状态和下一步；过程写进提交说明。规则见[运行手册第 4 节](LONG-TERM-PLAN.md#4-做什么)。

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿发现与 M6**：让读者第一时间知道该试什么；来源按产出调整，候选进收件箱，漏检对照记入 [25](../25-ai-exploration.md) | dot-A | 10-26 首轮固定来源扫描与[有界周校准](../25-ai-exploration.md)已完成：上海 10-19～25 的固定 HN 查询前 10 条中补入 2 项适用漏项；不是全量漏检率，不与旧 6/25 直接比较，真实发现时差未知。下一步从收件箱按本仓真实消费者挑选试用，不重复本周扫描。 |
| P81 | **试用与写成选择**：读者照着就能采用；在案例仓库的真实编码任务和 a1dbv 脚本上试用，结论进 [13](../13-frontier-radar.md)、决策页和模板 | dot-A | 旧采用已收口；[场景→动作写法](../../experiments/writing-action-first/README.md)已用于本仓在制稿：小节非空白 Markdown 字符 1042→937，13 项事实保留，已写入 [REVIEW](../../templates/generic/REVIEW.md)；SDK 仍为未运行素材。[Datasette #3015](https://github.com/simonw/datasette/pull/3015)、[Memos #6502](https://github.com/usememos/memos/pull/6502) 继续跟评审。symlink 扫描、Git 读取去重与 Hook 单次解析候选未发布；完整 offline 在 Python 3.12／3.13 均超时，Hook 的 3.12 定向也有超时。已过的定向与独审记录保留，原因未定；原完整门禁通过后再接收，不放宽限时或省测试。 |
| MOBA | **MOBA-Like 基本战斗**，按 [brief](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md) | dot-B | [main 0e464e4](https://github.com/dbvv1/MOBA-Like/commit/0e464e44414f50df394d38f0cb7433c67ab9cf7e) 已进入[网站](https://dbvv1-moba-like.pretty-llama-9945.chatgpt.site) v8：小兵倒下不再当帧消失，短普攻联系不再首绘前丢失；[当前画面与差距](https://github.com/dbvv1/MOBA-Like/blob/main/docs/quality.md)每轮替换。下一步改善普攻与技能危险区的视觉主次；基本战斗仍未达到英雄联盟品质。 |
| B-模块 | **核心模块**：客户端、gameplay、引擎、部分服务端（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | 按 G2 独立补制作缺口，不等案例；游戏循环已交付，本批补[发行后诊断](../../domains/game-dev/04-client-modules.md#发行后诊断先保反馈再接自动报告)与离线符号校验。继续整合真实制作链；[旧 Unity 实跑](local-jobs/B-UNITY-ADOPTION-001.md)仍暂停，原生画面／性能未测。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | [海岸音频](local-jobs/B-OPENWEIGHT-AUDIO-001.md)已在 RTX 5070 生成两 seed 候选，relay `fa5664f`；尚未混合听验，构建默认 off。[3D 岩簇](local-jobs/B-OPENWEIGHT-3D-001.md)原任务 `cce6083` 修复待接收端续验，尚无生成 mesh。资源采用后回流制作链，不与案例云端品质互等。 |
| SR | **Star-Rush 完整弯道品质**：以地平线公路弯道为参照，保留跑圈 | dot-B | [master cfb2075](https://github.com/dbvv1/Star-Rush-Reborn/commit/cfb2075a44c502af1b209ca28a274ad78fee7b26) 已进入网站 v4：[公路候选](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road)采用 Lambert 受光，树背颗粒减少；[默认街机](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/)保持原受光。当前截图和差距见产品 docs/quality.md；[受光归因做法](../../domains/game-dev/04-client-modules.md)已回流。雪山黑底／提示遮车修正 `9fce32` 已验，GitHub blob 写入待原平台确认，暂不重试；继续小屏 HUD 与音频候选，整体仍未达到参照。 |
| FPS | **FPS-Like 纵切片**，按 [brief](https://github.com/dbvv1/FPS-Like/blob/main/docs/brief.md) | dot-B | [公开网站](https://dbvv1-fps-like.pretty-llama-9945.chatgpt.site) v7 已部署：CC0 持枪人物替换盒形目标，浅头盔让头部与背景分离小幅改善；[同源几何与材料分组](../../domains/game-dev/assets/3d.md#角色换装先开放已配套组合)已回流。**仍未达到 CS2 基本射击循环品质**；胸口仍被枪与深布切碎，固定姿态／腕臂动作和声音仍有缺口。下一步核对手实际开火的姿态与枪口反馈，不为演示改 AI。`git push origin HEAD:refs/heads/b/fps-headless-v1` 因 FPS-Like 不在显式推送授权范围被平台拒绝，须用户补充该仓库普通快进推送授权才恢复；期间不重试 GitHub 发布，网站部署与 Git 权限分开。 |
| P109 | 潮汐邮差窄例 | dot-B | v2 素材、木筏与旧档的客户端验收欠项保留。 |

## 待人工验收（统一查看）

需要人亲自听、看、玩才能判断的项目集中在这里，由用户择时统一验收；执行者记录后继续其他工作。

- MOBA-Like：[可玩入口与操作](https://github.com/dbvv1/MOBA-Like/blob/main/README.md)的硬件 GPU 画面、操作手感与完整对局体验；软件 WebGL2 smoke 已通过。
- Star-Rush：[普通公路候选](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road)已公开可试玩，但未默认、未定稿；制动转向耦合错误已修，路内跑酷物移出，离散工具输入不能代替真人连续操控或证明所有触墙是物理缺陷。我们继续本云优化完整弯道，不等待用户接管；整体手感、完整视听与硬件表现未达成验收，海岸环境声已有本云真实关闭／开启混音试听文件（不同驾驶、Canvas、无增益），待统一听辨接缝与掩蔽，默认仍关闭、未采用。
- 潮汐邮差 v2：素材、木筏与旧档。
- Memos：owner 登录与编辑。
- Maka 侧聊模型选择：真实后端／Electron 与完整应用体验（[固定候选](local-jobs/A-STORYBOOK-ADOPTION-001.md)）。
- Memoh Colada 升级：真实业务、查询缓存与刷新恢复（[补丁](local-jobs/A-MIGRATION-ADOPTION-001.md)）。

## 需要用户决定

只放锚点红线内的事。等待只停对应动作，其余照常推进。

| 事项 | 等什么 | 期间照常做 |
|---|---|---|
| jrnl 上游 PR | 集成创建PR返回403，已审分支就绪；由用户决定是否打开[compare页](https://github.com/jrnl-org/jrnl/compare/main...dbvv1:jrnl:dot-a/dayone-dst-1422)创建Draft。拟标题：`Fix DayOne UTC conversion across daylight saving transitions`，说明与测试见[采用记录](../../experiments/jrnl-dayone-runtime-diagnosis.md) | 本仓发现、试用与既有PR跟进继续 |
| Actual 上游 PR | 集成创建PR返回403，已审分支就绪；由用户决定是否打开[compare页](https://github.com/actualbudget/actual/compare/master...dbvv1:actual:dot-a/load-config-typescript-1483)创建Draft。拟标题：`[AI] Migrate sync server configuration loader to TypeScript`；正文保留官方空模板，人类字段不代填 | 本仓发现、试用与既有PR跟进继续 |
| Maka 上游贡献 | 真人贡献者须实际审阅负责，适用时本人签 CLA | [OpenSpec 邀请已发](https://github.com/Fission-AI/OpenSpec/issues/2115#issuecomment-6401683363)；其他 PR 继续 |

**停止的动作**：Maka #4495 评论同样因集成 403 未发出；MOBA 第三方素材官方取回 HTTP 403，自有与原创占位素材已通过；P107 与 Action 调试 10f6a6db 曾被平台拒绝，负责人补齐命令和用途后再请用户在 Dot 里批准。
