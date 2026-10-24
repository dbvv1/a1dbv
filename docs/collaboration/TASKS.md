# 任务状态

> [运行手册](LONG-TERM-PLAN.md) · 长期提示词 [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 每轮纠偏只改本节，最多三条（手册§6）。更新：2026-10-25，Claude 核心方向会话。

- **A**：AI coding 为中心，把已有能力组合成任务路线，并在开源项目和真实仓库的开发中用上。
- **B**：主线是游戏 AI 全链路与客户端核心模块，研究项按完整模块合并进正文，不再逐条新开；支线把 Star-Rush 临时分支合入 master 并做赛中美术、音频、驾驶的可玩提升，精力不超过约三成。
- **共同**：本地模型是主要产能，独立任务保持多项在途；完成看成品进入读者入口或可玩版本。

## 分工

- 方向见 [AGENTS 锚点](../../AGENTS.md)。dot-A：AI coding 与 M6；dot-B：游戏 AI 全链路与客户端／gameplay，Star-Rush 为现有载体，Game-Core-Knowledge 按原分工。
- 本地模型委派走 [local-jobs](local-jobs/README.md)，由独立本地协作会话接收；A 研究主任务不代管 B 执行。
- 指导层：Claude 核心方向会话负责方向与原则，Codex 审计会话负责增量审计、本地执行与仓库整理（手册§6）。已有审计：[方向指导](reviews/2026-10-23-direction-guidance.md)、[增量审计](reviews/2026-10-24-direction-delta-audit.md)，不重复。

## 项目板

> 规则见[运行手册第 4 节](LONG-TERM-PLAN.md#4-做什么)。B 的逐项研究行已于 10-25 按模块合并，原文见[归档](archive/completed-through-2026-10-25.txt)。

| 编号 | 项目与验收 | 负责 | 状态／下一步 |
|---|---|---|---|
| P90 | **前沿发现**：成熟与新候选，沿[13](../13-frontier-radar.md)五问／实试验收，处理收件箱 | dot-A | 停简报；[增量测试反馈](../../experiments/testmon-feedback.md)实试；强方法比较／组合与真实模型采用优先；窄试用收口。Oil UI页面策略拒绝，视觉待入口获准；Plannotator未接收。 |
| P81 | C1核心12页：强参照查漏，以真实任务验Agent能力；交可复制入口、选择与结果，回流正文 | dot-A | [MDX规格扩展](../../experiments/openspec-mdx-adoption.md)原生Agent实施、二改接收及独审；续完整能力采用。[OCR](../../experiments/ocr-matcher-replay.md)完整CLI未验，旧欠项保留。 |
| P79 | C1／C3 吸取验证 | dot-A | **10-25 收口**：[冻结三题结果](../../experiments/absorption/p79-frozen-001-results.md)已按描述性记录接收，隔离未确立、正式可比 0 对；不再续批，正式对照仅在用户明确要求时开展。 |
| SR | **Star-Rush 品质版本**：master 随时可玩，赛中 AI 美术、音频、驾驶手感有可体验的提升（原 P112／P113／P117） | B | master 自 10-23 起未更新；成果分散在临时分支 `racing-quality`（HUD、教练、卡片、音频候选）、`canvas-house-anchors`、`scene-authoring`、`local/dot-b-rail-audio-001`。先合入 master（未听／未看部分以开关或原默认合入），再做赛中美术、音频与驾驶；最终试听交可用接收端。 |
| B-模块 | **客户端／gameplay 完整模块**：动作与连段、瞄准、镜头、角色控制、资源生命周期、敌人 AI、技能／Buff、成长与奖励、叙事、合作续局等（原 P39、P98、P99、P101–P106、P110–P111、P114–P115、P118、P121–P122、P125–P127、P129–P130） | B | 均已接收为资料／源码研究，多数未实测。按完整开发问题合并进 04／05 正文；角色控制模块在 `dot-b/tmp/20261025-character-control` 待合。 |
| B-制作链 | **AI 制作链**：2D／像素、动画源与导入、3D 与压缩消费者、材质特效、音乐音效、视频、场景作者（原旧 C2 文稿、P94–P97、P100、P107、P116、P119–P120、P123–P124、P128、分件 rig、特效源） | B | 已接收为研究；音频制作链文稿在 `dot-b/tmp/20261025-audio-production-case` 待合。下一步优先落到 Star-Rush 赛中美术与音频的实际制作。 |
| P109 | 潮汐邮差：资产与木筏二改 | B | 窄例；v1 实玩见[正文](../../domains/game-dev/06-indie-roadmap.md)，v2 素材、筏与旧档客户端验收欠项保留。 |

## 需要用户决定／保留事实

- P109：生图已许可；B 原浏览器 URL 拒绝后的限定重试待答，仅停该入口客户端 QA。本轮其他环境的 v1 实玩不解除此限制；新版接收可由具备现有授权的环境承担。

- P107：固定a012fc7公开工具执行待批准；仅影响实试，静读继续。

- PR88／89公开验收评论被拒，已问待答；已合入不受影响，不重试留言。

- dot-A：默认提交邮箱不是noreply，持久修改待答；不改全局配置，发布沿用已准许的单次noreply身份并扫描。

- P7：原执行端仍要求直接确认①档S01–S09；新核原文已转交一次，仍拒且调用0。所需确认已问；不重批配置、不重复派发或换路。

- P27 正式测试身份已在当前对话问过一次、未答：仅一次性 listmonk 公开副本的测试 DB 内创建合成管理员，loopback／假数据、不外发邮件、密码不回传提交；此前无持久身份仅列表与 SMTP-test 通过，实际活动 403。C1 未运行，观测补丁／seed 已冻结；不借 P25 专属批准或绕权。
- Action 调试固定 10f6a6db 仍待明确批准；不随清理扩权，旧细节见当日归档。
- P7 历史读取：测试目录外一份 Markdown 交接文档，格式据命令元数据，目标称压缩恢复后核对；正文、来源及敏感性未核，无已见目录外写入／额外外发证据，不据此认定泄露。按用户决定仅保事实，不再列为启用前提。
- B 的 PR64–78 草稿转换申请已被“自行合入、不走 PR”授权取代，不再请求 ready；B已完成交付默认由A复核代合，P24 原范围和旧拒绝独立保留，不能据旧授权推定本次 main 写入已成功。

[prior-tasks]: https://github.com/dbvv1/a1dbv/blob/15c3c171bb7df3cc3194046125628c59ad891a28/docs/collaboration/TASKS.md

[audit-tasks]: https://github.com/dbvv1/a1dbv/blob/7028197a97197740027c38e819ced649f7f16f4c/docs/collaboration/TASKS.md

[c2-1023]: https://github.com/dbvv1/a1dbv/blob/030d04dd5dafbd9d42281c314a6be30d64e06692/docs/collaboration/TASKS.md
