# B-AI-GAME-AUDIO-MIX-20261104 · 游戏内分层音频实例
id: B-AI-GAME-AUDIO-MIX-20261104
owner: dot-B
kind: explore
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 463b4b9a95a8e6eadb98b730d8aa373a05dcbec0
result_branch: relay/b-ai-game-audio-mix-20261104

工作线：AI 做游戏实例。本卡为独立排队单元，尚未认领。

## 目标
为 声音供给进入游戏后的事件映射与混音层级。 找 2–3 个有实际游戏和作者制作过程的新作品，供 dot 后续完整试玩和选择。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/ai-made-games-scout/SKILL.md` §1。来源范围：itch.io 已发布作品音频 devlog、原作者博客／GitHub 配置、r/aigamedev／r/gamedev 返工帖、带声音连续实机和原作者说明，并覆盖一个中文原作者渠道。
核环境／动作／重要提示三层如何供给接线，重叠时谁压低／抢占，改提示音或音乐层如何保事件，以及代码／生成结果／第三方音频各自许可。只有预告旁白、静音实机或工具名不收。
先对照游戏首页与 `docs/research/2026-10-23-game-worth-trying.md`、旧 B-AI-GAME-SUPPLY-SOURCES 的完整产物排重。以下仅能作对照，不计新候选：Riposte、Formula Minus One、DragonScape Idle、Battle Drones、Ascend From Nine Mountains、Remnants of R’lyeh、Codex Mortis、Void Balls、Warpact、Blocks Beyond the Stars、Pawbound、Steel Maiden、LOB、Robo Rally Open、Firefly Lasso；pxl 也不算新游戏。若跨新卡重复，把它归最贴合的一张，其他卡只留转交链接。
每项需可玩链接或完整连续实机、作者原始制作过程、作者公开静态截图原链接、版本与发布日期、AI／人工分工、成本与许可未知项。只取已公开静态资料，不启动游戏或抓取游戏画面；已知拦截不绕过，可标摘要线索。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/B-AI-GAME-AUDIO-MIX-20261104/sources.md`；不改游戏首页、研究正文、inbox、其他卡或规则。

## 怎样算做成
交最有用的制作机制、上述证据及一个可在现案例验证的二改问题。非作者核链接和作者身份、完整实机可达性，候选不足就给实际覆盖与排除原因，不凑数；本机不评水平、不写已玩或品质通过。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- 完成渠道覆盖、候选排重与排序（261 候选中 242 条链接核验），主推 Claude of Tanks、World of ClaudeCraft、Kart Royale，中文首选替补茫室，另列 NOVA LANCER、小巫大祸、AI训练模拟器：智能涌现及 31 项第二梯队、机制/工具参考和 §7 二改验证问题；交付 sources.md（410 行，新增未跟踪）。未关闭问题（openIssues）：第113行 NOVA「无 voice cap 细节」与源码 Pool(40/48)、MAX_LOOPS=16 不符；第127行「日志01 写明一人独立开发，但日志未写团队规模」自相矛盾；第229行小巫应为「未取得原文」而非「未取得原链接」；第127行问题重复计 2 条。审查 3 轮后 reviewed=false。未验项：未启动游戏、未试听、未见实机；Reddit/itch.io/YouTube/微信/知乎/B站/小红书等渠道不可达，许可与成本多处未知。
- 产物：[9d1b5ad](https://github.com/dbvv1/a1dbv/commit/9d1b5ad2f1f3fc69407f2bf10164597f7b413bf5)，分支 `relay/b-ai-game-audio-mix-20261104`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；独立审查未通过或未完成。
- 下一步：先修正 sources.md 第113、127、229行三处表述（按 openIssues 给出的改法），再把 unit 1 产物交 dot 按 §7 做二改验证、完整试玩并选择主推。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。


## 负责人接收 · 2026-11-06

仅接收已逐条补核的少量来源机制，已回入正文；原整稿与未完成／未通过的审查不转成通过，剩余广搜与不可靠结论放弃。具体采用、纠错和固定链接见[接收记录](../nonstar-return-intake-20261106.md)。原进程终态没有新证明，不重新调用、不重复登记；新增源码断言未运行，未听／未玩，不更新品质评分。
