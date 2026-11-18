# B-AI-GAME-BROWSER-SECOND-PASS-EVIDENCE-20261113 · Fable 5.2 成品二改证据
id: B-AI-GAME-BROWSER-SECOND-PASS-EVIDENCE-20261113
owner: dot-B
kind: explore
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6dedee31abc6bf77694dd02a23f3f9833084f2f5
result_branch: relay/b-ai-game-browser-second-pass-evidence-20261113

## 目标与规格
AI 游戏实例；按 ai-made-games-scout §1–2。限 2026-11-09 以后、作者明确归因 Fable 5.2 的网页成品；找真实二改如何改善玩家首次识读或反馈。旧 release-iteration 通用发现不复做，不重复 Saltline／Evensong／Redrock 或重启无法唯一定位的 FOG CITY。
- 种子一：Agent of Somebody 作者复盘 https://www.anchorterminal.com/blog/how-we-built-agent-of-somebody ，核作者给出的可玩入口、发布后的界面用语或技能栏返工，以及公开资产许可；私有提交不可验证，作者数字只归属作者。
- 种子二：Skull Jam 作者原帖 https://www.reddit.com/r/ClaudeAI/comments/1xuvop2/i_built_skull_jam_a_free_12_player_browser_game/ 与 https://skulljam.com/ 。有迭代自述但无公开版本／补丁对照时，只当排除样本，不臆测物理库或引擎。
- 仅可从作者原文的相关链接补一条来源，先与游戏首页、已有 scout 记录及 03 全链路页排重；缺证据不凑数。

## 范围与完成
只写 docs/collaboration/local-jobs/artifacts/B-AI-GAME-BROWSER-SECOND-PASS-EVIDENCE-20261113/sources.md。每个纳入项含可玩或完整原视频、作者原文、作者截图链接、版本日期、改前后可复核对象及 AI／人分工；标注许可、成本、运行未验，提出一个可在现案例验证的窄实践，不称已试玩或品质达标。只读公开资料；不启动游戏／视频／浏览器、不联系作者、不取商业资产、不改研究正文。

## 当前结果

- 按 explore 流程产出唯一交付物 sources.md（327 行）：渠道覆盖表 + 按硬条件排序的候选清单（正式纳入 2 项：Agent of Somebody、Aiden's Revenge；乙级 6 项；丙级/成品线索 71；丁级/排除 11；索引/方法/背景 26），含改前/改后可复核对象、每项许可/成本/运行未验标注及可验证的窄实践；种子二 Skull Jam 按排除样本处理。全程只读公开资料，未启动游戏/视频/浏览器，未实玩、未试听，未运行任何实机验收（不计通过）。openIssues（1 条，3 轮修正后仍未关闭）：§6 第 213 行与 §1 第 31 行把 <https://www.spawn.co/@chocopuff/one-hit-kill> 标为“Memory of Teresa”，该页实际标题为“死: One Hit Kill”，需按审查意见改名或换成该作品真实链接。
- 产物：[c8640ae](https://github.com/dbvv1/a1dbv/commit/c8640ae80bc550c28829260096c6f19740cf99e0)，分支 `relay/b-ai-game-browser-second-pass-evidence-20261113`。
- 检查：check_public（文件与新提交身份）、check_repo 本单元无新增错误；基线 6dedee31 已有问题：docs\collaboration\nonstar-return-intake-20261106.md:24: missing link target: local-jobs/artifacts/B-PIPE-MATERIAL-REUSE-READER-20261104/quiet-reader-production-proof.test.ts（保留告警，交负责人接收）；独立审查未通过或未完成。
- 下一步：负责人处理未关闭审查项：将 sources.md 第 31、213 行的“Memory of Teresa”改为“死: One Hit Kill”（可注“Teresa 记忆竞技场”），或替换为真实作品链接；其余证据缺口（乙级 6 项补截图直链/可玩 URL/版本记录）属后续深挖，不在本单元完成判定内。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
