# B-AI-GAME-LEVEL-REVISION-20261106 · 找关卡玩法二改实例
id: B-AI-GAME-LEVEL-REVISION-20261106
owner: dot-B
kind: explore
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: bbb068cbdc97617856763414ace1d9d828b9c9d9
result_branch: relay/b-ai-game-level-revision-20261106

工作线：AI 游戏实例。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
找 AI 参与的关卡在第二次路线/遭遇修改后仍保持可玩节奏的真实作品，为三案完整内容生产提供可借制作过程。

## 按哪个 Skill／规格
按 ai-made-games-scout §1–2，仅做已定候选收集。先读游戏首页、docs/research/2026-10-23-game-worth-trying.md、旧supply/scene/audio/character卡与已交回的完整候选，逐作品排重。
1. 差距限定：路线/空间布局或遭遇节奏的实际第二次修改、关卡与碰撞/导航/触发联动、复用与重生成成本。只换光照/材质或静态场景展示不收，避免重做已接收的场景光照卡。
2. 来源范围：itch.io 3D动作/竞速/射击devlog、公开GitHub关卡修改与作者原文、game jam制作复盘，另覆盖B站或TapTap原作者。 时间优先近两年；找1–3个满足门槛的新作品，不为凑数扩大题目。
3. 每项必须有当前可玩链接或完整连续实机原页、原作者制作过程、作者公开静态截图原URL、版本/发布日期、AI与人工各做什么、一次具体二改、代码/资产/生成结果许可及成本未知项。只摘关键事实，不复制整篇或分发游戏资产。
4. 以下仅可作旧对照、不计新候选：Riposte、Formula Minus One、DragonScape Idle、Battle Drones、Ascend From Nine Mountains、Remnants of R’lyeh、Codex Mortis、Void Balls、Warpact、Blocks Beyond the Stars、Pawbound、Steel Maiden、LOB、Robo Rally Open、Firefly Lasso、Capybara、backroad rally、Long Wind、World of ClaudeCraft；pxl等工具不算游戏。排除本批发布后通用修复和输入/UI改动；同一作品只归主要价值最贴合的一卡，其他给转交链接。
5. 公开资料只读；不登录、发帖/联系作者、不启动游戏或播放视频/音频、不启动浏览器。读原文与公开元数据核链接；被拒/需登录入口止步，摘要只标线索。静态链接不等于已经看完整实机。
6. 原作者身份、真实作品入口或二改证据不够就排除，给具体原因与实际覆盖。原blocked音频/角色单元不重搜、不复用旧调用。

## 写入范围
仅 docs/collaboration/local-jobs/artifacts/B-AI-GAME-LEVEL-REVISION-20261106/sources.md；不改游戏首页、研究正文、inbox、其他卡、评分或规则。

## 怎样算做成
非作者核作者/原文/作品入口/版本和许可分界；给最强1项优先试玩建议及一个可在现案例验证的具体机制。候选不足据实交回，不称已玩、已看完、达到标杆或新增品质推荐。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果

- 第三轮 explore 已写入 sources.md（实际 683 行，git diff +273/−18；Workflow 自报 +254/−6/676 行与实际不一致）：新增 §1.3 渠道覆盖、§3.6–3.8 三项甲级（群侠传：幸存者、Fire Field、We're Gonna Need More Fireballs）、§4.6 四项 A-、§4.7 二十项 B、§5.7 三十八项 C、§7.2 约 68 组工具、§8.1 读不到渠道、§9.1 试玩建议、§10 排重；check_public 1412 文件 0 findings、check_repo 879 文件 0 errors 复跑通过。openIssues：独立事实审查 pass=false，4 条未修正——(1) 第 298 行镜之边缘 WEB v10 仍写“又补 44 根攀爬管”，原文为“攀爬管修复为 44 根”；(2) 第 191 行 More Fireballs 仍写“最后一波 25,000→250,000”，旧值 25,000 实为“最大一波”；(3) §3.7/3.8 将 Steam 商店页标为“可玩”但未写需购买（Fire Field 约 HK$61/US$9.99、More Fireballs US$11.99）且无免费 demo，第 13 行“A 级 7 项都有当前可玩入口”过宽；(4) 第 13 行“A- 4 项另计”与“Hora Cero 等补齐后再列 A-”自相矛盾。taskDone：候选收集与整理完成；pageStuck：无读者卡点文件；未运行验收：未试玩、未看完整连续实机、未播视频/音频，作者身份多为个人站/工作室/handle，逐件许可与成本多数未知；Survive the Night 可玩入口 2026-11-06 复检 404。
- 产物：[7ef80e3](https://github.com/dbvv1/a1dbv/commit/7ef80e36951b5a9c57374b6b0a320accb88f737a)，分支 `relay/b-ai-game-level-revision-20261106`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；独立审查未通过或未完成。
- 下一步：按审查意见修正上述 4 处表述/口径并重跑事实审查；之后由负责人在实机试玩 Voltane（同车同输入同机位 3 圈基线）并补作者身份与许可/成本核查。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
