# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 按[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)，只留当前活跃收窄分工与未完成纠偏；11-25 及更早的临时纠偏与旧过程记录已移入[归档](archive/completed-through-2026-11-26.txt)。

### 11-24 A、B 收窄为知识岗（11-26 用户确认落地）

- 角色边界见 [A](prompts/dot-a.md)／[B](prompts/dot-b.md)：本机 demo 与三案的制作、换默认和发布归本机方向会话；**B 优先完成 11-17 已批准三旧案线上部署并回填网站版本**（MOBA `fa3076f` v22→新、Star `1796e9f` v11→新、FPS `445b93b` v25→新）。
- **B 知识重点**：把[本机 demo 记录](demo-trial-20261117.md)与渲染／材质实测沉淀为可复用配方（不写入单次测试临时参数）。已有[三段简报与单件接入](../../domains/game-dev/03-generative-ai-in-games.md#small-scene-quality-loop)、[缺工具时的单件直读替代](../../domains/game-dev/assets/3d.md#licensed-closeup-assets)，仍缺实际应用采纳回执。
- **A 下一轮试验方向**：`platformdirs` 降级暂停、`joplin` 冻结不再叠前置门槛；新主试转向[长回合真实反馈对照](../../experiments/long-horizon-feedback-pair/README.md)（待本机选定公开多步开源任务后运行）。

## 专业审计

波次、brief、报告与综合以 [Audit Workspace](reviews/audit-workspace/README.md) 的[波次登记](reviews/audit-workspace/WAVE-REGISTER.md)为准。意见去向按 [SPEC §8](AUTONOMOUS-WORK-SYSTEM-SPEC-v1.3.md#8-指导与专业审计)：内容意见由知识协作者处理，方向与规则修改交核心指导决定。

## 分工

- 职责按 [AGENTS](../../AGENTS.md) 与[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)；本机机械任务走 [local-jobs](local-jobs/README.md)。
- 历史写后同步规范：开工前执行 `git fetch origin +refs/heads/*:refs/remotes/origin/* --prune`，基于远端最新 `main` 推进，不强推旧历史。

## 项目板

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿与 M6**（[收件箱](inbox.md) / [探索证据](../research/2026-10-15-exploration-evidence.md)） | dot-A | 降频运行，仅围绕真实问题选题与核源；读者地图标记按实测更新。 |
| P81 | **试用与上游追踪** | dot-A | 不再新开旧试用收尾，仅跟进已开上游 PR 至合入或关闭；Qwen/Datasette/Memos 等历史单卡结论留原卡。 |
| MOBA | **MOBA-Like 战斗与内容** | 本机 | main [`fa3076f`](https://github.com/dbvv1/MOBA-Like/commit/fa3076f) 已合入森林走道与 quiet 材质（`?scene=baseline` 可回退），GPU 整局 300s 通过；线上待从 v22 升至已批准部署。 |
| B-模块 | **核心模块**（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | FPS 终态退出与 Star 赛道 AI 均已过组装客户端 CPU 接收，仍缺完整浏览器实测；继续沉淀可复用模块规范。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | 三案 smoke 已接整局测量；FPS 三标准件材质改色配方过 CPU 独审，待与完整浏览器画面对齐。 |
| B-实例 | **AI 游戏实例** | dot-B | 已收录 Saltline 接触反例与 FOG CITY 立面拆解（均未实玩），Solhex 暂停在 Copper 3/6。 |
| SR | **Star-Rush 品质** | 本机 | master [`1796e9f`](https://github.com/dbvv1/Star-Rush-Reborn/commit/1796e9f) 已加海岛外观，GPU 圈速 01:52.58 不变；Site 仍 v11，待回填已批准部署；软件帧耗待优化。 |
| FPS | **FPS-Like 品质** | 本机 | main [`445b93b`](https://github.com/dbvv1/FPS-LIke/commit/445b93b) 首页加庭院布景，GPU 60 fps 通过；Site 仍 v25，待回填已批准部署；需留意低端设备帧间隔（约上版 1.3 倍）。 |
| P109 | **潮汐邮差窄例** | 本机 | v2 素材、木筏与旧档待客户端验收。 |

### A：试验收口

- **最高优先**：[强模型对照两卡](../../experiments/strong-short-task-20261117/README.md#任务卡)（Sortable 两臂核心复核通过，缺完整浏览器验收；uv / Click 暂挂起不重派）。
- [11-17 及更早已完成记录](archive/completed-through-2026-11-17.txt)；旧试验未收口前不新开同类试验。

## 待人工验收

用户择时验收[本批项目](b-work-20261106.md#待人工验收)；其余照常：

- FPS-Like：命中/受伤混音辨识度与连续交火疲劳。
- MOBA-Like：[可玩入口与操作](https://github.com/dbvv1/MOBA-Like/blob/main/README.md) 硬件 GPU 画面、手感与完整对局体验。
- Star-Rush：[公路候选](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road) 整体手感、视听与硬件画面。
- 潮汐邮差 v2：素材、木筏与旧档衔接。

## 需要用户决定

仅暂停明确阻塞的外部动作，三站部署与已批准授权沿用（历史决策见[归档](archive/completed-through-2026-11-04.txt)）：

| 事项 | 当前阻塞／状态 | 期间照常推进 |
|---|---|---|
| LOB 外部试玩 | 已完成第 25 关续局失败与重开实测（静音，第 21 关断连后重置状态） | 完整连续一局与听感待定，详见[实玩范围](../research/2026-10-23-game-worth-trying.md) |

## 已停止的动作

jrnl／agents-md-lint／testmon／Serena 重复投稿（#2242 已合入待发版）／Maka #4495（403）及旧被拒动作均维持停止，不重试或绕过限制，历史原文见[归档](archive/completed-through-2026-11-03.txt)与[2026-11-26 归档](archive/completed-through-2026-11-26.txt)。
