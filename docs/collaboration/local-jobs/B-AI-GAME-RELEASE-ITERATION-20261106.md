# B-AI-GAME-RELEASE-ITERATION-20261106 · 找发布后返工的实游戏
id: B-AI-GAME-RELEASE-ITERATION-20261106
owner: dot-B
kind: explore
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: bbb068cbdc97617856763414ace1d9d828b9c9d9
result_branch: relay/b-ai-game-release-iteration-20261106

工作线：AI 游戏实例。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
寻找 AI 大规模开发作品从首次可玩到发布后一轮真实修订的证据，借实际玩家问题决定模块/制作链下一步，不收只有首日演示的作品。

## 按哪个 Skill／规格
按 ai-made-games-scout §1–2，仅做已定候选收集。先读游戏首页、docs/research/2026-10-23-game-worth-trying.md、旧supply/scene/audio/character卡与已交回的完整候选，逐作品排重。
1. 差距限定：发布前后版本/补丁、真实玩家反馈对应的返工、保存/加载或平台发布的可用性；至少一项改动实际进入可玩版本。不要把技术CI修绿或公司公告当玩家闭环。
2. 来源范围：itch.io 已发布作品 devlog＋补丁记录、Show HN 作者回复与可玩站、公开 Steam 更新＋作者长文，另查一个中文作者B站/TapTap/linux.do原帖。 时间优先近两年；找1–3个满足门槛的新作品，不为凑数扩大题目。
3. 每项必须有当前可玩链接或完整连续实机原页、原作者制作过程、作者公开静态截图原URL、版本/发布日期、AI与人工各做什么、一次具体二改、代码/资产/生成结果许可及成本未知项。只摘关键事实，不复制整篇或分发游戏资产。
4. 以下仅可作旧对照、不计新候选：Riposte、Formula Minus One、DragonScape Idle、Battle Drones、Ascend From Nine Mountains、Remnants of R’lyeh、Codex Mortis、Void Balls、Warpact、Blocks Beyond the Stars、Pawbound、Steel Maiden、LOB、Robo Rally Open、Firefly Lasso、Capybara、backroad rally、Long Wind、World of ClaudeCraft；pxl等工具不算游戏。与本批输入/UI和关卡迭代卡按主要改动排重；只有UI或场景局部改动的转对应卡。
5. 公开资料只读；不登录、发帖/联系作者、不启动游戏或播放视频/音频、不启动浏览器。读原文与公开元数据核链接；被拒/需登录入口止步，摘要只标线索。静态链接不等于已经看完整实机。
6. 原作者身份、真实作品入口或二改证据不够就排除，给具体原因与实际覆盖。原blocked音频/角色单元不重搜、不复用旧调用。

## 写入范围
仅 docs/collaboration/local-jobs/artifacts/B-AI-GAME-RELEASE-ITERATION-20261106/sources.md；不改游戏首页、研究正文、inbox、其他卡、评分或规则。

## 怎样算做成
非作者核作者/原文/作品入口/版本和许可分界；给最强1项优先试玩建议及一个可在现案例验证的具体机制。候选不足据实交回，不称已玩、已看完、达到标杆或新增品质推荐。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果

- sources.md 新增 §8（第 2 单元 220 条清单链接核实：2 项通过 Enarian、Realm of Eldermyr，18 项第一备选，翡翠经营模拟器因缺作者制作过程降为备选；另修正上轮 6 项事实问题），diff +335/−7，仅此一个交付文件。Workflow 最终审查未通过：3 项未关闭——(1) §8.4 放置地下城『三周内连发 28 条 1.3.x 补丁』实为 1.0.9→1.3.4 共 28 条更新且仅 6 条 1.3.x；(2) §8.4 云灵修仙 changelog 写『0.1.0 到 0.2.7』但当前已到 0.3.8；(3) §8.5 第 124 行骑砍上线日期混用 UTC（10-30/10-19）与页面日期（10-31/10-20）。另返回摘要称『3 项通过』与文件 §8.2/§8.3 实际『2 项通过』不一致，以文件为准。未实玩、未看视频/音频、未登录，itch.io 等渠道仍 TLS 不可达。3 个本单元遗留的 mirror-*.html 临时页已移至本次 scratch/leftover，工作区仅 sources.md 修改。
- 产物：[bf262fa](https://github.com/dbvv1/a1dbv/commit/bf262fa75ed0a00d77295a0cd7a11299d7bc47f3)，分支 `relay/b-ai-game-release-iteration-20261106`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；独立审查未通过或未完成。
- 下一步：下一单元按审查修正 3 项事实（放置地下城补丁跨度、云灵修仙 changelog 当前版本、TapTap 日期口径）并重跑事实/读者审查；渠道可达时补读 Monkyupe、Tower of Time 等 itch 页。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
