# 任务状态

> [手册](LONG-TERM-PLAN.md) · [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 按[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)，只留未完成纠偏。

## 11-06 Dot-A/B 临时表现纠偏

[11-06 完整纠偏原文](https://github.com/dbvv1/a1dbv/blob/7128f6cf2390e8ca9f6bc92cd3806861c874e56e/docs/collaboration/TASKS.md)保留完整范围、权限和原入口，不新增调度或额度要求。

- **A 旧交付**：余项见 P81，原范围与恢复条件留上方原文。

### 11-24 A、B 收窄为知识岗

- 用户选择收窄，见 [A](prompts/dot-a.md)／[B](prompts/dot-b.md)：本机 demo 与三案的制作、换默认和发布归本机方向会话；11-17 已批准的三案部署仍由 dot-B 执行并回填（MOBA `fa3076f`、Star `1796e9f`、FPS `445b93b`）。
- **B 首项**：把[本机 demo 记录](demo-trial-20261117.md)写成配方（目标措辞、自看实图、真实输入测试、手感规格与合成玩家、CC0／CC-BY＋bpy 改造）；demo 源码精选公开后据实现补参数。完成：建议、依据和反例入页，方向会话下一轮任务说明引用。 已有[三段简报与单件接入](../../domains/game-dev/03-generative-ai-in-games.md#small-scene-quality-loop)、[缺工具时的单件直读替代](../../domains/game-dev/assets/3d.md#licensed-closeup-assets)；尚无采用回执。
- **A 首项**：[GPT-6.2 Sol 窄修复：中档与高档](../../experiments/platformdirs-effort-pair/README.md) · [Joplin 桌面回归：单 Agent 与两路只读诊断](../../experiments/joplin-sidebar-delegation-pair/README.md)。均为未运行提案，由方向会话预检、启动与验收。

- **共同采用欠项**：下次帧同步／存档实用共享指令、模型或依赖页之一；自然UI变更由新读者照浏览器页实操，不以截图／DOM替代。沿上方原文入口，结果写提交后删。

## 专业审计

波次、brief、报告与综合以 [Audit Workspace](reviews/audit-workspace/README.md) 的[波次登记](reviews/audit-workspace/WAVE-REGISTER.md)为准。意见去向按 [SPEC §8](AUTONOMOUS-WORK-SYSTEM-SPEC-v1.3.md#8-指导与专业审计)：内容意见由 Dot-A／B 决定，方向与规则交 Claude 核心会话；只有接受的建议才转为任务。

## 分工

- 职责按 [AGENTS](../../AGENTS.md) 与[手册§6](LONG-TERM-PLAN.md#6-节奏与反馈)；本机任务走 [local-jobs](local-jobs/README.md)，两项清理仍按原收窄范围接续。
- 10-26 历史已获准改写：开工 `git fetch origin +refs/heads/*:refs/remotes/origin/* --prune`，按远端重建分支，不推旧历史。
- [11-13 已完成的释放槽与整局回执](https://github.com/dbvv1/a1dbv/blob/42e2cc4a36e5d3aa3d94e3cefd991f506f081751/docs/collaboration/TASKS.md#分工)。MOBA v23 仅等单次发布确认。

## 项目板

| 编号 | 项目 | 负责 | 当前状态／下一步 |
|---|---|---|---|
| P90 | **前沿与 M6**：候选入收件箱，漏检入[探索证据](../research/2026-10-15-exploration-evidence.md) | dot-A | 降频，只为本机对照试验选题；读者地图 🟡／⏳ 按实测更新。 |
| P81 | **试用与选择** | dot-A | 11-24 起不再收尾旧试用，已开上游 PR 回应到合入或关闭。15项已收口。Datasette 部分接收，#3015 合上游／修契约及六 CI 待批；Memos #6502 冲突只跟反馈，QA cancelled；Qwen v0.26.6 修重名，旧例6过时／8待验，409非新版，socket拒绝。另张 Skills 附全文待新读者，旧写者退出／空槽待核，禁装与[越界](local-jobs/A-SKILL-PACKAGE-ENTRY-20261030.md#指导层交接)交指导层。 |
| MOBA | **MOBA-Like 战斗与完整内容** | 本机 | main [`fa3076f`](https://github.com/dbvv1/MOBA-Like/commit/fa3076f)：默认改森林走道（quiet材质不变，`?scene=baseline`回退），GPU整局300 s过、60 fps；线上仍**v22**；11-17 用户已批准部署 fa3076f（含 quiet 与森林走道），dot-B 部署后回填。dot-B 的 4bc44ca 已被 [4f564e3](https://github.com/dbvv1/MOBA-Like/commit/4f564e3) 取代。软件渲染下整局 Morrow E 断言两版同败，原因未查。 |
| B-模块 | **核心模块**（[G2](game-taskbook.md#2-g2-游戏核心模块)） | dot-B | FPS [终态修复](../../domains/game-dev/04-client-modules.md#client-terminal-exit)已入主干，CPU独审过，浏览器欠。Star 原AI修复已过组装客户端CPU接收：默认9/9、轮胎8/9对手完赛，余1为前进中的截止DNF；花见坂倒车仍欠。原发布回执unknown、远端未见；本轮原补丁／9/9产物在当前环境不可复核，保留历史回执、不重推。 |
| B-制作链 | **AI 全链路**（[G1](game-taskbook.md#1-g1-全-ai-流程管线端到端按瓶颈排序)） | dot-B | 三案原 smoke 已接[整局测量](../../domains/game-dev/02-verification-and-playtesting.md#2-工具到底观察了哪一段)；FPS 原配方三标准件[颜色二改](../../domains/game-dev/assets/3d.md#asset-family-rebuild)进入实际挂接 mesh，颜色变而 bytes 不变，缺件／损坏整批回退，CPU 独审过。下一层为串行Git卡的画面／完整运行；19GLB、训练ready及Star后继材料保留，声音未听，Nature恢复unknown。 |
| B-实例 | **AI 游戏实例** | dot-B | [Saltline 接触反例](../../domains/game-dev/assets/materials.md#web-scene-recipe)已过 CPU 验证，未采用。[FOG CITY 立面](../research/2026-10-23-game-worth-trying.md#fog-city-facades)已定位并核源码，未实玩。[Solhex](../../domains/game-dev/08-level-design-and-encounters.md#tutorial-input-and-result)暂停保档 Copper 3/6。 |
| SR | **Star-Rush 品质** | 本机 | master [`1796e9f`](https://github.com/dbvv1/Star-Rush-Reborn/commit/1796e9f)：默认加海岛外观（`?scene=baseline`回退），216/216，GPU整局圈速01:52.58不变；Site仍**v11**；11-17 用户已批准部署 1796e9f，dot-B 部署后回填。软件帧耗仍差。旧对照卡 B-STAR-COAST-SCENE-PAIR 已被方向会话本机原图取代。 |
| FPS | **FPS-Like 品质** | 本机 | main [`445b93b`](https://github.com/dbvv1/FPS-LIke/commit/445b93b)：首页加庭院布景（上一版用README里的完整查询回退），475/475，GPU六回合整局过、60 fps；Site仍**v25**；11-17 用户已批准部署 445b93b，dot-B 部署后回填。布景已按材质合并；不限帧时帧间隔约为上一版1.3倍，低端设备未测。 |
| P109 | 潮汐邮差窄例 | 本机 | v2 素材／木筏／旧档待客户端验收。 |

### A：试验收口

- 最高优先：[强模型对照两卡](../../experiments/strong-short-task-20261117/README.md#任务卡)：Sortable、uv 均待方向会话本机预检；核收后仅手动启动，Click 不重派。

[11-12 已完成段](archive/completed-through-2026-11-17.txt)；旧试验未收口不新开。

- **旧卡接收**：Decimal、Chat-stream、Ruler 已按各卡限定范围接收，不重派。Hermes／Skills 尚未收口，保持原隔离。四条已发布路线仅核到隔离读者验证，实际采用未知。

## 待人工验收

用户择时验[本批](b-work-20261106.md#待人工验收)；其余照常。

- FPS-Like：原／受伤混音各一段交火，核命中/受伤可辨、敌枪掩蔽和疲劳；v12 用原混音。
- MOBA-Like：[可玩入口与操作](https://github.com/dbvv1/MOBA-Like/blob/main/README.md)的硬件 GPU 画面、操作手感与完整对局体验；软件 WebGL2 smoke 已通过。
- Star-Rush：[公路候选](https://dbvv1-star-rush.pretty-llama-9945.chatgpt.site/road)的整体手感、视听与硬件画面；海岸环境声开关对比试听。
- 潮汐邮差 v2：素材、木筏与旧档。

## 需要用户决定

仅停对应动作。三站部署、Star 原 blob 与 LOB 授权沿用；完成记录见[归档](archive/completed-through-2026-11-04.txt)，LOB 剩余验收见下表。

| 事项 | 等什么 | 期间照常做／批准后首步 |
|---|---|---|
| 云端截图 | MOBA 线上 `NET::ERR_CERT_AUTHORITY_INVALID`，待可信证书链后复验 | 本地 `27a40be`／Site v16：WebGL2 四路 smoke、四机位双重复通过；两非作者判小幅改善，正式评分待补。获准 `--no-sandbox`；已留 renderer／参数（SwiftShader software），exit 0、端口关闭。 |
| LOB 外部试玩 | 已授权；实见原生 checkpoint 续局至第 25 关失败终局及从第一关重开；非连续整局、全程静音 | 第 21 关断连后续局重置分数／弹药／地形，不合并为连续成绩；连续完整一局、胜利与听感未验。详见[实玩范围](../research/2026-10-23-game-worth-trying.md)。 |

## 已停止的动作

jrnl／agents-md-lint／testmon 已停止，见[原文](archive/completed-through-2026-11-03.txt)；拒绝不重试／换入口。Serena [上游 #2242 已合并](../../experiments/serena-vue-implementation/README.md)，首个含修复的正式版本待发布；不重复投稿。

其他：Maka #4495 评论因集成 403 未发出，停止投稿／追发；MOBA 第三方素材官方取回 HTTP 403，改由本机接收端代取；P107 与 Action 调试 10f6a6db 被平台拒绝，待补齐命令／用途，由用户在 Dot 批准。
