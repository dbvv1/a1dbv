# B-AI-GAME-SCENE-LIGHTING-20261104 · 成套场景光照二改实例
id: B-AI-GAME-SCENE-LIGHTING-20261104
owner: dot-B
kind: explore
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 463b4b9a95a8e6eadb98b730d8aa373a05dcbec0
result_branch: relay/b-ai-game-scene-lighting-20261104

工作线：AI 做游戏实例。本卡静态来源已接收，制作机制已并入现有制作链页；实机与品质未验。

## 目标
为 案例材质／素材缺少统一场景身份、连续层次和光照氛围。 找 2–3 个有实际游戏和作者制作过程的新作品，供 dot 后续完整试玩和选择。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/ai-made-games-scout/SKILL.md` §1。来源范围：Vibe Jam 2026 美术／精良类作品及原作者、itch.io 3D FPS／驾驶／俯视动作 devlog、Show HN 复盘与完整演示，并覆盖中文原作者制作帖。
核一段真实可玩区域怎样组合建筑／道路／植被／光照；改路线或主题要重做哪些源；生成、现成、程序与人工各做什么。一次生图、shader 展示和工具 showcase 不收。
先对照游戏首页与 `docs/research/2026-10-23-game-worth-trying.md`、旧 B-AI-GAME-SUPPLY-SOURCES 的完整产物排重。以下仅能作对照，不计新候选：Riposte、Formula Minus One、DragonScape Idle、Battle Drones、Ascend From Nine Mountains、Remnants of R’lyeh、Codex Mortis、Void Balls、Warpact、Blocks Beyond the Stars、Pawbound、Steel Maiden、LOB、Robo Rally Open、Firefly Lasso；pxl 也不算新游戏。若跨新卡重复，把它归最贴合的一张，其他卡只留转交链接。
每项需可玩链接或完整连续实机、作者原始制作过程、作者公开静态截图原链接、版本与发布日期、AI／人工分工、成本与许可未知项。只取已公开静态资料，不启动游戏或抓取游戏画面；已知拦截不绕过，可标摘要线索。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/B-AI-GAME-SCENE-LIGHTING-20261104/sources.md`；不改游戏首页、研究正文、inbox、其他卡或规则。

## 怎样算做成
交最有用的制作机制、上述证据及一个可在现案例验证的二改问题。非作者核链接和作者身份、完整实机可达性，候选不足就给实际覆盖与排除原因，不凑数；本机不评水平、不写已玩或品质通过。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- 接收范围：原结果 `b09c12e` 经窄修后接收为静态来源。3 项待试玩首选为 Capybara、backroad rally、Long Wind；其余 67 项仅为待核线索，14 项按规则排除，84 项不代表通过候选门槛或完成实例研究。
- 已合入：[材质与特效的场景氛围二改](../../../domains/game-dev/assets/materials.md#scene-atmosphere-revision)提炼 backroad 的公共默认 → 时段 → 赛道覆盖 → 天气与统一单位／色彩映射，并给出现案例的二改与撤回条件；不新增重复页，不改变 Star 代码或拍摄任务。
- 原始材料与补核：[来源记录](artifacts/B-AI-GAME-SCENE-LIGHTING-20261104/sources.md)。已分清作者自述、固定源码、成本口径与资产许可；代码许可不覆盖音频／模型，完整成本未知。
- 未接收：三款的实际游玩、完整连续实机、画面／手感／听感与零人工美术生产质量。Capybara 视频原页被网络安全拦截，Long Wind 原页播放器无法播放，已停止；不据静态材料作整款推荐。日后原实例线取得可用实机再续接，不重派来源收集、不抢占既有串行拍摄。
- 检查：整合最新 main 后重新运行全文档、公开文件／新提交身份和差异检查，结果写入本次提交说明；原 6 项 main 文档失败已由 `f2771632` 修复，不沿用旧失败或原卡自报通过。
- 执行回执：原 Workflow 已完成，工具与登记进程已结束；外层 worker 独立退出码仍未知。这不补成游戏运行或品质验收。
