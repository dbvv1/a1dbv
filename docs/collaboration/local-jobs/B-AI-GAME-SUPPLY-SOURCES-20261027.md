# B-AI-GAME-SUPPLY-SOURCES-20261027 · AI 做游戏实例与素材供给原始证据
id: B-AI-GAME-SUPPLY-SOURCES-20261027
owner: dot-B
kind: explore
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: a613f010cf1ee54610915a5ca3edabaf1f372a7c
result_branch: relay/b-ai-game-supply-sources-20261027

## 目标
为“一名程序员、无专职美术音频、不靠人工美术修补”的游戏制作寻找尚未覆盖、真实可玩的高质量候选与作者原始过程，优先角色、场景、音效供给。研究材料要让 dot-B 能选择最强作品亲自试玩、判断并提炼可用制作路线，不把宣传或高星当品质结论。

## 按什么做
1. 先 fetch 最新 main、负责人及 relay 分支，读 AGENTS、CLAUDE、operations§2.2、local-jobs README、TASKS 共同项与 inbox；按 `templates/generic/.claude/skills/explore-frontier/SKILL.md` 广扫，先写要改变的素材供给决定。
2. 先读 `domains/game-dev/README.md`“用 AI 做游戏”和 `docs/research/2026-10-23-game-worth-trying.md` 第 8 节（已发表基线 987ea327）。Riposte、Formula Minus One／FM1、DragonScape、Battle Drones、Ascend From Nine Mountains／AFNM、Remnants of R’lyeh、Codex Mortis 仅收真正改变已有判断的新事实，不重采已知制作／许可／手修反例。
3. 游戏主窗近两年，优先当前完整可玩版本与有内容的作者 devlog／复盘／源码；成熟作品近期新过程也纳入。广扫官方商店或 itch.io、作者网站／YouTube、GitHub、Reddit aigamedev／gamedev／相关工具社区、HN，以及至少一个中文原始社区（如 LINUX DO、V2EX）；渠道按真实产出扩展，不限“vibe coding”标题。
4. 搜索仅定位，回作者完整帖子与评论、devlog、固定版本源码／许可和真实玩家反馈；既看完成作品也看返工／弃用反例。工具厂商 showcase、广告、转述、下载量和 star 只能作线索；没有实际作品与原始过程支撑，不列为已证实的好路线。
5. 现有公开搜索不足时，用正常 HTTPS／浏览器／`curl` 或 PowerShell `Invoke-WebRequest`；GitHub 可用现有 `gh api` 检索及读取固定 SHA 源码，HN Algolia items API 读评论树，Reddit／中文社区读原帖。记录实际读取范围；摘要单列，拒绝入口停止，不换身份或绕过 TLS／访问控制。
6. 每个保留作品写完整可玩地址／公开 demo，连续实机完整 URL 与可定位片段、版本／平台／发布日期；能否形成完整游玩回路及其证据。只读字幕就标字幕核读，未玩／未看画面不得写已体验，短剪辑不能冒充完整实机。
7. 沿作者过程明确 AI 做什么、人做什么：代码、角色、场景、动画、音效、音乐分别采用何种供给；人选图、手工改网格／绑定／绘图／混音不能藏进“全 AI”。标作者自述、源码核实、玩家反馈，不能互相替代。
8. 回源素材及许可：代码、权重、生成结果、第三方资源各自权限与排除项；商店可玩不等于资产可复用。成本、失败／淘汰、返工与二改只记已披露的口径，区分订阅费、专项成本与人工工时；没有账本就未知，不推算净收益。
9. 每项附作者原始过程／代码具体位置、正反玩家原帖、对角色／场景／音效供给的可借机制、和已收录案例的差异、下一次完整试玩要核的关键未知。无同题反对原文时写实际检索范围，不伪造社区共识，不替 dot 选赢家。
10. 按证据价值收敛，不定数量；零项也交最相关排除原因与覆盖缺口。开头给真正新增的制作线索，结尾一行探索回执（渠道、截止日、不可读内容）；不交泛工具名单或新闻堆积。

## 独占写域与接收
模型唯一产物：`docs/collaboration/local-jobs/artifacts/B-AI-GAME-SUPPLY-SOURCES-20261027/sources.md`。接收端只另回写本任务状态与当前结果；不改正文、首页、inbox、TASKS、其他任务或其他人的文件，过程和检查留提交说明。
只用公开材料；不读私人资料、会话或凭据，不建账号、不付费、不改安全设置，不安装／运行候选游戏、外来仓库配置或新模型服务。无需 GPU；接收端最多四并行，由接收端调度，保留其他在途任务。
仅推指定 relay 分支并回 `review_ready`；不设自动接收，不将材料合入 main、不部署、不对外发表评论。dot-B 最终试玩、判断、选取并发布。

## 怎样算做成
按当前 operations§3 的 explore Workflow 接续原分支；本轮只修下列事实，不重新广扫；单次最多两小时。审查核原始链接、真实作品、AI／人分工、许可与成本口径、反例、版本和差量，任何未知保持未知。
接收端跑适用 `check_repo`、`check_public` 与空白检查，用 noreply 身份提交；提交／公开扫描／结果推送由接收端做，扫描通过仍人工读实际产物。回固定提交、产物链接与剩余缺口，不把材料收集当成品质推荐。

## 当前结果

- 修正了 SimCity 2000 反例的许可表述——CC 授权音乐音效单列为可按 CC 条款复用，代码生成 3D／矢量与 GPT Image 2 位图记为无独立许可，并重写与 Riposte／FM1 的对比句；独立复审通过，check_repo／check_public 通过。
- 产物：[223aa3e](https://github.com/dbvv1/a1dbv/commit/223aa3e069734b09c5a7acf3ea9139d0f8b184e1)，分支 `relay/b-ai-game-supply-sources-20261027`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：接收端提交并推送 relay 分支，交 dot-B 试玩 Blocks Beyond the Stars、Void Balls、Warpact 并判断可用制作路线。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow。

## 修改要求

接续固定产物 `223aa3e`，不重做已核来源：Void Balls 作者原文 https://www.loopedin.games/blog/how-i-built-void-balls-using-ai 的 The Numbers 写 3 首音乐为“两首玩法主题＋一首 Boss 主题”，不是当前产物的“菜单、玩法、Boss”。按原文修正；9 个音效仅有数量与部分类别，不把未逐项列出的完整九项用途当作作者提供。保留作者自述层级及未试玩状态。独立审查核这两处原文，再回原 relay 分支；不改其他作品或把素材清单当品质推荐。
