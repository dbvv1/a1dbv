# B-GENRE-REFERENCE-20261027 · 三个品类的可观察操控参照
id: B-GENRE-REFERENCE-20261027
owner: dot-B
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: a613f010cf1ee54610915a5ca3edabaf1f372a7c
result_branch: relay/b-genre-reference-20261027

执行边界（2026-10-27）：本机仅后台模型、命令行与文件处理；不打开交互浏览器／GUI，不控制桌面、键鼠或抢占前台。需要实际游戏操作或画面验收的部分交 dot 云端；不因此重启已有后台调用。

## 目标
给 dot-B 一组能直接设计同场景手动对照的原始证据：Forza Horizon 公路转向／制动／碰撞／镜头，LoL 普攻取消／发射／命中／移动窗口，CS2 移动速度／急停精度／连续后坐。只交研究材料，dot 亲自观察并决定作品差距，不求精确商业参数，也不交泛工具名单。

## 按什么做
1. 先 fetch 最新 main、负责人及 relay 分支，读 AGENTS、CLAUDE、operations§2.2、local-jobs README、TASKS 共同项与 inbox；遵循 explore-frontier：`templates/generic/.claude/skills/explore-frontier/SKILL.md`。同题已有成果先去重，不重跑已完成工作。
2. 已核基线仅引用定位，不重抄：Riot [13.22](https://www.leagueoflegends.com/en-gb/news/game-updates/patch-13-22-notes/) 的发射时点／弹速与补刀、[Clarity](https://www.leagueoflegends.com/en-us/news/dev/clarity-in-league/) 的辨认／反应、Valve [Side-stepping Skill](https://store.steampowered.com/news/app/730/view/6500469346429600836) 的手动移动与急停。新资料须明确补上哪个观察缺口；新闻索引不是具体事实依据。
3. 不重收 Three Rapier、Rapier、Bruno、Jolt 的工具介绍；本轮缺的是商业参照的完整可观察动作，不是换物理库。以近两年公开实机／反馈为主，关键旧官方文可追溯，分清游戏、版本、平台与控制设备。
4. Forza：找同一公路弯道的连续入弯—转向—制动—出弯，以及碰撞后恢复与镜头变化；保留车辆、辅助设置、视角等已公开条件，没写就未知。LoL：同英雄原地普攻、起手取消、发射后移动、命中反馈，分近战／远程及攻速条件。CS2：静止／移动／急停单发与连续射击，分武器、姿态和更新版本。
5. 从官方说明、开发者／高质量教学作者的原文与连续实机、实际玩家正反反馈交叉找；至少补查一个中文原始社区。宣传片、剪辑集锦、点赞或排名不能证明体验；社区自述与官方契约分开。
6. 用现有公开搜索定位，再通过正常 HTTPS／浏览器／`curl` 或 PowerShell `Invoke-WebRequest` 读取原文；GitHub 用现有 `gh api` 或固定 SHA 文件，Reddit／中文社区读原帖及评论，HN 可用 Algolia items API。遇明确拒绝停止该入口，记缺口，不换身份或绕过访问控制。
7. 每个保留项写：完整原始 URL、作者／来源类型、发布日期与核实日、游戏版本；支持哪个具体动作的短原文及段落位置；连续实机完整地址与起止时间、应观察的前后变化。未播放只读字幕就标“字幕核读”，不得写看过画面；取不到时间段则留待定位，不编造。
8. 再写同场景对照任务：控制哪些条件、做什么输入、看哪个时点／关系、何种反例会推翻判断；区分来源直接说的与建议。参数只记原文明示值，不猜物理／商业精确数值，不把跨版本／跨英雄／跨设备推成通则。
9. 不为数量凑条目；无新证据可交搜索范围、排除理由与剩余缺口。开头给可立即观察的增量，结尾一行探索回执（实际渠道、截止日、读不到的内容）。

## 独占写域与接收
模型唯一产物：`docs/collaboration/local-jobs/artifacts/B-GENRE-REFERENCE-20261027/sources.md`。接收端只另回写本任务状态与当前结果；过程和检查写提交说明，不改正文、TASKS、其他任务或其他人的文件。
只用可公开材料；不读私人资料、会话或凭据，不建账号、不付费、不改安全设置、不安装／运行外来配置或调用新服务。无需 GPU，不抢占既有任务；共享接收端最多四并行，由接收端调度，ready 不等于已运行。
仅推指定 relay 结果分支并回 `review_ready`；不设自动接收，不把材料合入 main，不部署、不对外发表评论。dot-B 选取、实玩／观察与判断后另行发布。

## 怎样算做成
按既有原生 Workflow 实施 → 未参与实施者独立审查 → 必要修正一次并复审；单次最多两小时。审查核原文支持范围、视频读取方式、版本、反例与去重，确保能据材料直接安排观察，而非仅有链接。
接收端运行适用 `check_repo`、`check_public` 和空白检查；提交身份用 noreply，提交及推送由接收端做，公开扫描通过仍人工读实际差量。回固定提交、产物链接和未解缺口，不把来源收集写成品质验收通过。

## 当前结果

- 单元 3 已把 CS2 移动、急停与连续后坐写入 sources.md（C-V1 官方更新、C-02～C-15 原文证据、C-T1～C-T6 对照任务），此前 3 个 LoL 审查问题已全部关闭，check_repo/check_public 均通过。审查未通过，仍有 2 个问题：练习工具 0.25x/0.5x 被写成需改设置文件（实为默认隐藏热键），C-11/C-12/C-13 的“步枪/AWP”武器条件无原文支持却写进条件矩阵、标题和 C-T6。
- 产物：[dd614da](https://github.com/dbvv1/a1dbv/commit/dd614da37bbd061736ad1bdd6a144c252a58d973)，分支 `relay/b-genre-reference-20261027`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查未通过或未完成。
- 下一步：修正练习工具倍速热键入口表述，并把三处武器条件改为“未写/播放时确认”并同步 C-T6，然后重跑三视角审查，再交接收端提交推送。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
