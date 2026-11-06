# B-AI-GAME-RELEASE-ITERATION-20261106 · 找发布后返工的实游戏
id: B-AI-GAME-RELEASE-ITERATION-20261106
owner: dot-B
kind: explore
status: review_ready
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

- 第3单元已完成：sources.md 新增 §9（第3单元 u3-a0，196 条已核实链接，排重后 186 条新链接、182 个新对象；本轮 3 项通过：Brickbrag、Permit Pending、哈耶克的文明：市场经济；另 22 项第一备选、48 项其余作品线索、14 项弱闭环、80 项工具/索引/方法、15 项背景/反向样本），并关闭 §8 三项事实问题（放置地下城改为 1.0.9→1.3.4 共 28 条更新且 1.3.x 仅 6 条；云灵修仙 changelog 覆盖 0.1.0→0.3.8；骑砍 TapTap 统一页面口径 2026-10-31 上线/10-20 更新并注明 JSON-LD UTC 原值）。独立审查 reviewed=true、pass=true、issues=[]、missingReviewers=0；check_public 扫描 1412 文件 findings=[]、check_repo 扫描 879 文件 errors=[]、git diff --check 退出 0。实测 git status 仅 sources.md 修改，diff +373/−4（工作流摘要记 +371/−3，差 2 行，内容核对一致）。未关闭/待人工：3 项均未实玩、未看完整实机，许可与总成本多为未知；Brickbrag 无版本号、Permit Pending 无 release notes、哈耶克 TapTap 旧入口 404/知乎原文 403；itch.io、linux.do、Steam 评测区、X/Discord/YouTube 仍读不到。未运行：游戏、视频/音频、浏览器、登录及实机验收，均不计通过。
- 产物：[08a9128](https://github.com/dbvv1/a1dbv/commit/08a9128ce73e0867f4eb4cf2b2d5d735519af8de)，分支 `relay/b-ai-game-release-iteration-20261106`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；独立审查通过。
- 下一步：按 §9.7 复测 Brickbrag 三条；将“降级路径＋最低设备回归”四段规格接到现有 FPS/MOBA/Star；补核哈耶克 LICENSE 与 Permit Pending 版本页；渠道可达时补读 itch 相关页。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
