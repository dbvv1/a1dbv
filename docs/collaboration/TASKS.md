# 任务状态

> [运行手册](LONG-TERM-PLAN.md) · 长期提示词 [A](prompts/dot-a.md)／[B](prompts/dot-b.md) · [归档](archive/README.md)

## 当前重点

> 每轮纠偏只改本节，最多三条（手册§6）。更新：2026-10-25，Claude 核心方向会话。

- **A**：AI coding 为中心，任务路线在开源项目和真实仓库的开发中用上；恢复前沿发现（约两成精力），持续引入当前值得用的新工具和做法。
- **B**：专注主线（游戏 AI 全链路、客户端核心模块）和不受阻的游戏案例内容。Star-Rush 中许可清楚、工程验证通过的素材默认启用；需要人听、看、玩的验收记入下方“待人工验收”，统一处理，不再阻塞或占用 B 的时间。
- **共同**：批量正文改写暂停。前一版只挪了证据标签，正文反而变长约 9%、限定语未减；按新规格先做试点 [A-STYLE-PILOT-001](local-jobs/A-STYLE-PILOT-001.md)／[B-STYLE-PILOT-001](local-jobs/B-STYLE-PILOT-001.md)，负责人与核心方向会话确认后再恢复批量。本地模型保持多项在途。

## 分工

- 方向见 [AGENTS 锚点](../../AGENTS.md)。dot-A：AI coding 与 M6；dot-B：游戏 AI 全链路与客户端／gameplay，Star-Rush 为现有载体，Game-Core-Knowledge 按原分工。
- 本地模型委派走 [local-jobs](local-jobs/README.md)，由独立本地协作会话接收；A 研究主任务不代管 B 执行。
- 指导层：Claude 核心方向会话负责方向与原则，Codex 审计会话负责增量审计、本地执行与仓库整理（手册§6）。已有审计：[方向指导](reviews/2026-10-23-direction-guidance.md)、[增量审计](reviews/2026-10-24-direction-delta-audit.md)，不重复。

## 项目板

> 规则见[运行手册第 4 节](LONG-TERM-PLAN.md#4-做什么)。B 的逐项研究行已于 10-25 按模块合并，原文见[归档](archive/completed-through-2026-10-25.txt)。

| 编号 | 项目与验收 | 负责 | 状态／下一步 |
|---|---|---|---|
| P90 | **前沿发现**：成熟与新候选，沿[13](../13-frontier-radar.md)五问／实试验收，处理收件箱 | dot-A | 停简报；[增量测试反馈](../../experiments/testmon-feedback.md)实试；[diff-cover](local-jobs/A-FRONTIER-SELECTION-001.md) 合成报告消费已接收，随 Datasette 真实需求验采用；不扩窄试。Oil UI页面策略拒绝，视觉待入口获准；Plannotator未接收。 |
| P81 | C1核心12页：强参照查漏，以真实任务验Agent能力；交可复制入口、选择与结果，回流正文 | dot-A | [MDX规格扩展](../../experiments/openspec-mdx-adoption.md)原生Agent实施、二改接收及独审；[Datasette 显式整数参数](local-jobs/A-DATASETTE-TYPED-PARAMS-001.md)设计＋原型待认领，消费真实请求。[OCR](../../experiments/ocr-matcher-replay.md)完整CLI未验，旧欠项保留。 |
| P79 | C1／C3 吸取验证 | dot-A | **10-25 收口**：[冻结三题结果](../../experiments/absorption/p79-frozen-001-results.md)已按描述性记录接收，隔离未确立、正式可比 0 对；不再续批，正式对照仅在用户明确要求时开展。 |
| SR | **Star-Rush 品质版本**：master 随时可玩，赛中 AI 美术、音频、驾驶手感有可体验的提升（原 P112／P113／P117） | B | master 已整合为 `6324d55`：HUD、教练、卡片、音频候选、Canvas 房屋锚点与场景作者链均已在主干；当前护栏仍默认 procedural，样本与房屋锚点显式开启。Kenney 默认启用的 `10f5f90` 仅本地完成、上传被拒，未进入 master；听／看／玩集中到下方人工验收，B 转回主线。 |
| B-模块 | **客户端／gameplay 完整模块**：动作与连段、瞄准、镜头、角色控制、资源生命周期、敌人 AI、技能／Buff、成长与奖励、叙事、合作续局等（原 P39、P98、P99、P101–P106、P110–P111、P114–P115、P118、P121–P122、P125–P127、P129–P130） | B | 角色控制已进 [04 完整模块](../../domains/game-dev/04-client-modules.md#character-control)；[05 技能／效果模块](../../domains/game-dev/05-gameplay-architecture.md#7-战斗与技能先统一结算再决定-gas)已整合蓄力、施放／承诺、连段、效果堆层／时钟／快照、净化免疫与属性重算，给正常链、实施起点与二改。复用资料／源码与独审，未引擎实测／模型运行；继续合并已有研究，不逐项新开小题。 |
| B-制作链 | **AI 制作链**：2D／像素、动画源与导入、3D 与压缩消费者、材质特效、音乐音效、视频、场景作者（原旧 C2 文稿、P94–P97、P100、P107、P116、P119–P120、P123–P124、P128、分件 rig、特效源） | B | 已接收 [短音制作链](../../domains/game-dev/assets/audio.md#可复制制作起点短样本与现有程序声混合)：源与许可、处理配方、规格二改、加载打包及事件接入；保留现有工程回执，已按 master `6324d55` 区分历史样本默认与当前 procedural 默认。[角色与武器动画模块](../../domains/game-dev/assets/animation.md)已整合动作供给／AI补缺、导入、图层、握点与换弹二改，接收为制作／实现蓝图，未引擎实测。[完整场景制作模块](../../domains/game-dev/assets/3d.md#完整片段先做一个能走能看能改的场景)已接收：同包供给、作者源／运行引用与傍晚局部二改；原生 Workflow 文稿完成，实际场景／画面／性能与二改未验。继续合并已有制作研究并做独立制作／接入；最终听验留在下方人工清单。 |
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

## 需要用户决定／保留事实

- dot-A Memoh：一次性测试库内合成管理员和 bot 的初始化已单次询问，未答；只限 dot 云端假数据、无付费／部署／特权容器。当前真实业务与跨升级缓存待验，工程补丁已接收；原历史浏览器拒绝不泛化为本项目拒绝。

- dot-A Memos：已接收[阅读模式工程补丁](../../experiments/memos-reading-adoption.md)，Node24组件／全量、lint、构建与独审通过；真实浏览器未验。恢复需获准且可用的dot云端浏览器入口及该固定补丁运行实例，核匿名列表／详情、刷新恢复、键盘焦点和无写请求；既有浏览器拒绝不换路重试，不借此启动服务、demo或账户／数据库。工程接收不冒称界面成品、上游合入或方法收益。

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
