# 任务状态

> [运行手册](LONG-TERM-PLAN.md) · 长期提示词 [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 每轮纠偏只改本节，最多三条（手册§6）。更新：2026-10-26，Claude 核心方向会话。

- **A**：先收口 Datasette：不再续改原型；已完成且独审过的补丁按贡献规范向上游提 PR（10-26 用户授权，每项目最多一个开放 PR），把 Datasette、MDX、Memos、Storybook 几次采用的结论写进对应任务路线页。之后的真实采用首选 MOBA-Like 的开发（与 B 约定用法），选择与实施同一任务完成；前沿发现约两成精力。
- **B**：专注主线（游戏 AI 全链路、客户端核心模块）。作品案例按[细则§6](game-taskbook.md#6-作品案例)统一：MOBA-Like 是当前主案例，先做到可玩，用来实测已写的技能、AI、寻路等模块；Star-Rush 进入维护期，FPS-Like 排队。需要人听、看、玩的验收记入下方“待人工验收”，统一处理，不阻塞 B。
- **共同**：按用户 10-26 委托一次清理存量正文：A 按 [A 存量任务](local-jobs/A-READABILITY-CLEANUP-001.md)、B 按 [B 存量任务](local-jobs/B-READABILITY-CLEANUP-001.md)，按防御密度从高到低整篇重写（正文、首页、模板与引擎页；留档记录不改），非作者对照原文保住事实，全部接收后收口，不再开后续改写批次。指导文件（本页、提示词、任务书）用同一写法：状态格只写当前态和下一步。

> **10-26 历史改写，所有执行者先重新同步**：为清除一个合并提交里的公司邮箱，main 和 58 个分支的历史已按用户授权改写，内容和其他提交的作者信息不变。开工前先 `git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune`，本地分支按远端重建（`git reset --hard origin/<分支>`），未推送的提交 cherry-pick 到新基线；不要推送基于旧历史的分支或合并旧提交。

## 分工

- 方向见 [AGENTS 锚点](../../AGENTS.md)。dot-A：AI coding 与 M6；dot-B：游戏 AI 全链路与客户端／gameplay，作品案例见[游戏方向细则§6](game-taskbook.md#6-作品案例)，Game-Core-Knowledge 按原分工。
- 本地模型委派走 [local-jobs](local-jobs/README.md)，由独立本地协作会话接收；A 研究主任务不代管 B 执行。
- 指导层：Claude 核心方向会话负责方向与原则，Codex 审计会话负责增量审计、本地执行与仓库整理（手册§6）。已有审计：[方向指导](reviews/2026-10-23-direction-guidance.md)、[增量审计](reviews/2026-10-24-direction-delta-audit.md)，不重复。

dot-A 运行：仅每小时心跳；当前接口支持PR事件，普通main／relay push不支持，尚未订阅。Git交接靠当前执行与心跳发现。

## 项目板

> 规则见[运行手册第 4 节](LONG-TERM-PLAN.md#4-做什么)。B 的逐项研究行已于 10-25 按模块合并，原文见[归档](archive/completed-through-2026-10-25.txt)。

| 编号 | 项目与验收 | 负责 | 状态／下一步 |
|---|---|---|---|
| P90 | **前沿发现**：成熟与新候选，沿[13](../13-frontier-radar.md)五问／实试验收，处理收件箱 | dot-A | 停简报；[增量测试反馈](../../experiments/testmon-feedback.md)实试；[diff-cover](local-jobs/A-FRONTIER-SELECTION-001.md) 已在 Datasette 原型消费；行执行不等于行为验收，不扩窄试。Oil UI页面策略拒绝，视觉待入口获准；Plannotator未接收。 |
| P81 | C1核心12页：强参照查漏，以真实任务验Agent能力；交可复制入口、选择与结果，回流正文 | dot-A | [MDX规格扩展](../../experiments/openspec-mdx-adoption.md)原生Agent实施、二改接收及独审；[Datasette #3015](https://github.com/simonw/datasette/pull/3015) 已提交 Draft，原型收口、跟进评审；AI与测试／文档欠项已披露；[Memos #6502](https://github.com/usememos/memos/pull/6502)亦为Draft，跟评审、浏览器smoke未验。[MOBA采用](local-jobs/A-CROSS-MODULE-SELECTION-001.md)选择与实施同任务，B已同意A只做独立接收起点，待首个固定模拟产物及实际消费。[OCR](../../experiments/ocr-matcher-replay.md)完整CLI未验，旧欠项保留。 |
| P79 | C1／C3 吸取验证 | dot-A | **10-25 收口**：[冻结三题结果](../../experiments/absorption/p79-frozen-001-results.md)已按描述性记录接收，隔离未确立、正式可比 0 对；不再续批，正式对照仅在用户明确要求时开展。 |
| SR | **Star-Rush 维护期**：master 随时可玩，只做品质提升；顺序见仓库 [brief](https://github.com/dbvv1/Star-Rush-Reborn/blob/master/docs/brief.md)（原 P112／P113／P117） | B | [master `32b2d3a`](https://github.com/dbvv1/Star-Rush-Reborn/commit/32b2d3abde569f182c13780077669f3ab628f946) 已通过宿主真实沙箱软件 WebGL2 smoke（开局、W 驾驶、计时、非背景画布）；Kenney 默认与程序音回退保持。硬件 GPU、画面审美、手感和最终混音待验。旧 `10f5f90` 不重传，旧壁画不在本次范围。 |
| MOBA | **MOBA-Like 纵切片**：可玩，再完成第二次需求修改；实测技能／Buff、英雄与小兵 AI、寻路、成长与技能制作链（FPS-Like 在此之后开工） | B | 10-26 建仓库骨架：[AGENTS](https://github.com/dbvv1/MOBA-Like/blob/main/AGENTS.md)、[任务书](https://github.com/dbvv1/MOBA-Like/blob/main/docs/brief.md)。下一步：建工程，先打通模拟层与无画面对局。 |
| B-模块 | **客户端／gameplay 完整模块**：动作与连段、瞄准、镜头、角色控制、资源生命周期、敌人 AI、技能／Buff、成长与奖励、叙事、合作续局等（原 P39、P98、P99、P101–P106、P110–P111、P114–P115、P118、P121–P122、P125–P127、P129–P130） | B | 已接收：[角色控制](../../domains/game-dev/04-client-modules.md#character-control)、[技能／效果](../../domains/game-dev/05-gameplay-architecture.md#7-战斗与技能先统一结算再决定-gas)、[菜单与设置](../../domains/game-dev/04-client-modules.md#菜单也是控制的一部分)、[性能诊断](../../domains/game-dev/04-client-modules.md#压低卡顿与设备耗用)。[跨局成长与奖励](../../domains/game-dev/05-gameplay-architecture.md#meta-progression-loop)已接收：局内构筑、结算解锁、下一局配置和第三路线二改；真实对局、平衡与旧档接入待验。[本地化制作接线](../../domains/game-dev/04-client-modules.md#增加语言与推进对白)和[存档正常续玩](../../domains/game-dev/04-client-modules.md#保存续玩与升级旧档)已接收：双语对白接线／二改、检查点到可玩世界的恢复链／门箱持久化二改；译义、引擎、真实读听与存储恢复待验。都是文稿加独审，引擎实测随 MOBA-Like 进行。旧提示词删除引起的共享离线测试回归已修复。[效用选意图](../../domains/game-dev/05-gameplay-architecture.md#utility-intent-selection)实现蓝图已接收：四意图、资格分层、反应与技能承诺、第二英雄／弹道二改；19 项合成选择检查通过，MOBA 采用与对局待验。[局内等级与装备](../../domains/game-dev/05-gameplay-architecture.md#in-match-growth)已接收：资源到购买／使用时点、等级与装备分工、两类二改；8 条合成算术通过，真实 MOBA 采用与平衡待原案例回填。 |
| B-制作链 | **AI 制作链**：2D／像素、动画源与导入、3D 与压缩消费者、材质特效、音乐音效、视频、场景作者（原旧 C2 文稿、P94–P97、P100、P107、P116、P119–P120、P123–P124、P128、分件 rig、特效源） | B | 已接收：[短音](../../domains/game-dev/assets/audio.md#可复制制作起点短样本与现有程序声混合)、[角色与武器动画](../../domains/game-dev/assets/animation.md)、[完整场景](../../domains/game-dev/assets/3d.md#完整片段先做一个能走能看能改的场景)、[技能特效](../../domains/game-dev/assets/materials.md#把候选交成整招而不是一段漂亮特效)、[2D](../../domains/game-dev/assets/2d.md)、[音乐增轨](../../domains/game-dev/assets/audio.md#保留探索录音新增战斗声部先选路线再做可回改候选)。[视频／过场](../../domains/game-dev/assets/video.md#制作起点一段能回到游戏的开门揭示)已接收：制作路线、首版接线与换装／长译文二改已写入，文稿独审完成，影片／引擎／听看未验。实际制作与接入随 MOBA-Like 和 Star-Rush 进行，听看验收在下方清单。 |
| P109 | 潮汐邮差：资产与木筏二改 | B | 窄例；v1 实玩见[正文](../../domains/game-dev/06-indie-roadmap.md)，v2 素材、筏与旧档客户端验收欠项保留。 |

## 待人工验收（统一查看）

需要人亲自听、看、玩才能判断的项目集中在这里，由用户择时统一验收；执行者记录后继续其他工作。

- Star-Rush 护栏碰撞音频（Kenney CC0／本地合成两套候选）：听感、响度与最终比赛混音。
- Star-Rush Canvas 房屋锚点（构建开关 `STAR_RUSH_CANVAS_HOUSE_ANCHORS=on`）：画面目视。
- Star-Rush 主弯驾驶手感（入弯、抓地／漂移、出弯）与完整 WebGL 场景画面。
- 潮汐邮差 v2：素材、木筏与旧档的客户端验收。
- Memos 阅读模式：真实浏览器与键盘操作。
- Maka 侧聊独立模型选择：真实组件的 4 个 Storybook play 与定向测试已通过；真实后端／Electron 与完整应用体验仍待验，见[固定候选](local-jobs/A-STORYBOOK-ADOPTION-001.md)。
- Memoh Colada 升级：仅工程差量已接收；真实业务、查询缓存与刷新恢复未验，生产依赖保留。见[补丁与接续条件](local-jobs/A-MIGRATION-ADOPTION-001.md)。

## 需要用户决定

只放锚点红线内的事（10-26 起默认授权）。等待只停对应动作，其余工作照常推进。

| 事项 | 等什么 | 期间照常做 |
|---|---|---|
| Maka 上游贡献 | [Maka #4495](https://github.com/apache/maka/issues/4495) 要求真人审阅负责并签 CLA，属于以用户名义签署协议 | OpenSpec 的贡献邀请和其他上游 PR 按默认授权继续 |

10-26 按默认授权清出：dot-A Memoh 与 P27 listmonk 的测试库合成管理员、dot-A Memos 的云端浏览器入口（用 dot 的云电脑）、P109 的限定重试、P7 的执行确认、OpenSpec #2115 的贡献邀请。负责人直接推进，平台拦下时只停那一步。

**资产取回阻塞**：[B-MOBA-ASSET-PREFLIGHT-001](local-jobs/B-MOBA-ASSET-PREFLIGHT-001.md) 第三方官方取回 HTTP 403（curl 22）保持停止；自有夹具及原创占位角色已通过限定验收（15 骨骼／三动作／阵营形状标记／长刃二改），第三方源仍待新访问证据；本云轮收口交根代理云电脑，模拟原调用继续。

**平台拒绝**：P107（固定 a012fc7 的公开工具执行）和 Action 调试 10f6a6db 曾被平台拒绝。负责人补齐具体命令和用途后，再请用户在 Dot 里批准；此前不列为待决。

**保留事实**：P7 曾读取测试目录外的一份交接文档，未见写入或外发，按用户决定只记录。B 的 PR64–78 草稿已由“自行合入、不走 PR”取代。

[prior-tasks]: https://github.com/dbvv1/a1dbv/blob/15c3c171bb7df3cc3194046125628c59ad891a28/docs/collaboration/TASKS.md

[audit-tasks]: https://github.com/dbvv1/a1dbv/blob/7028197a97197740027c38e819ced649f7f16f4c/docs/collaboration/TASKS.md

[c2-1023]: https://github.com/dbvv1/a1dbv/blob/030d04dd5dafbd9d42281c314a6be30d64e06692/docs/collaboration/TASKS.md
