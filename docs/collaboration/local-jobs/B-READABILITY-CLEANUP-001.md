# B-READABILITY-CLEANUP-001 · 存量正文一次整理

id: B-READABILITY-CLEANUP-001
owner: dot-B
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6f7494afc9707a1377e3fa88ce139e7a1df04e0e
result_branch: relay/b-readability-cleanup-001

## 目标

把存量正文改成[编写约定](../../../CLAUDE.md#编写约定)的写法：读者先拿到选择和做法，关键结论、数据、来源和会改变决定的条件一条不丢。用户 10-26 委托，本任务一次做完。

## 范围与顺序

按防御密度从高到低：domains/game-dev/assets/video.md，然后是 domains/game-dev/ 下其余页：01-engine-integration.md、02-verification-and-playtesting.md、04-client-modules.md、05-gameplay-architecture.md、06-indie-roadmap.md、README.md、assets/2d.md、assets/3d.md、assets/animation.md、assets/audio.md、assets/materials.md。25 探索、04 MCP 和游戏 03 已改好，不再动。

**追加范围（2026-10-26）**：`domains/game-dev/unity/` 与 `domains/game-dev/unreal/` 下全部 Markdown，含其 `templates/` 里的 AGENTS、CLAUDE、README、agents 与 Skill 说明。模板会被读者复制进自己的项目，写法问题会跟着扩散，优先级与正文相同；只改说明文字，命令、脚本、路径和字段名保持不变，改后按 CLAUDE.md 的模板规则用模拟输入跑一遍相关脚本。

**不改的范围**：`docs/research/`、`experiments/`、`docs/collaboration/reviews/`、`archive/` 和 local-jobs 历史记录是留档证据，不重写；正文引用它们时，在正文里写清结论。

开工前看最新 main 和在制分支；同一文件只有一个写者，有人在改就先做别的页，最后统一回头改。已经清楚的页保留原样。

## 怎么改

- 整节重写，不逐句删词：首句给推荐，接着是理由、步骤和取舍；来源和原核实日期在节末写一次。
- 只写会改变读者决定的限制，写一次。重复的范围声明、连串否定句和开发过程删掉，过程留在已有研究链接里。
- 命令、代码、显式锚点和引用保持可用；标题和表格可按读者的问题重组。
- 事实有疑点时回原来源核对；核不清的照原状态写。

## 验收

用原生 Workflow 实施，由非作者核对：先只读新文，复述主要选择、第一步和关键取舍；再对照原文核关键结论、数字、版本与日期、来源和适用条件。有遗漏就修对应段。

核完的页按批交付，每批不超过 2 份待合入，负责人逐批接收。全部接收后本任务结束，不再开后续改写批次。

## 当前结果

待接收。这里只写已交付页及提交、剩余页和当前写者、阻塞。

认领与恢复：dot 本地协作；2026-10-26。按 main 固定 `0a64c83` 的 ready 任务及本轮明确恢复指令启动。首个独占页 `domains/game-dev/assets/video.md`，按任务顺序逐页整篇处理，核完一页交增量；非作者先只读新文复述，再对照原文核结论／数据／来源。游戏04、05仍由现有模块原写者负责，未交付前跳过；保留Datasette编辑器原调用。25探索、04MCP、游戏03排除，不改规则层、不统计限定词密度、不设比例或30秒阈值、不新开后续批次。只发布结果分支与本任务回传，当前Codex审计会话接收，本端不标accepted。

## 首个视频页的新增成果交接（dot-B，2026-10-26）

首个视频页不能只以旧main `0a64c83` 为事实底稿：dot-B 已完成并独审的视频完整制作模块在 `dot-b/tmp/20261026-video-production-module` 固定提交 [`f1308f2735b7c086109dc84bc917189d47ee4d48`](https://github.com/dbvv1/a1dbv/commit/f1308f2735b7c086109dc84bc917189d47ee4d48)。读取该版本的 `domains/game-dev/assets/video.md` 与 `docs/research/2026-10-14-game-wp7-video.md`，将新增“开门揭示”完整制作链、Unity首版／离线作者源、生成器分工、回到游戏与二改，以及已审修复纳入原任务事实基线。原作者已停止写入，可以交接，不是长期锁住此页。

该成果仅因具体main引用更新被拒而未合，不是被撤回或待从头研究。保留它的关键选择、实现步骤、版本来源与真实待验范围，再按本任务要求整合行文；WP7作为固定证据读取，不扩本任务写入范围。若已按旧页完成改写，只接入新增段与必要差量，非作者定向核新增事实及修复保留，不整页重复重写／重审，不另开任务。其他页顺序与审计方向接收归属不变，后续逐页结果仍由dot-B按Git接收。

本补充只更新原任务的输入交接，保持原认领／在制状态；不是重派或另启模型指令。不要整条合入来源分支，也不要替dot-B重试已被拒的main动作；正文继续交现有独立结果分支，默认分支发布仍按当前授权与具体拒绝边界处理。

上述 dot-B 原文固定反馈来源：`d69e4b5348119336f295bb4a371f27b2a0e4804a`（`dot-b/tmp/20261026-cleanup-video-feedback`）。保留当前认领与原调用；首篇改写已返回，非作者先新后旧核对已完成，新增制作模块只沿原调用接入差量并定向核查。当前 Codex 审计会话接收，原负责人 Git 交接保持，不由本端代标 accepted。

宿主执行增量（2026-10-26）：Claude Code＋DeepSeek 原生 Workflow 首篇已实际返回；原始 assistant message.model 为 `deepseek-flash`，请求 alias `deepseek-v4.1-flash[1m]` 另记。非作者按先新后旧顺序完成首篇核对；修来源性质分组，并沿原调用纳入负责人 f1308f2 已交接的开门揭示制作模块，只核新增事实／已审修复。来源模块现已进入 main，原写者停止写入，避免覆盖新增。 本任务全范围尚未完成，状态保留 running，后续按已明确逐页增量要求继续。

发布恢复：用户明确授权后，仅更正错误合并提交身份；原 `8b7d1e9` 替换为 `de859f081d6547eeb976ba3b5da7d0dd1b1564b6`，后续提交只重接父引用，文件树、提交说明与他人身份保留；受保护的精确 lease 更新后 main 为 `1a3fad0dba89e45555f3cc1197d2ee986ab8d158`，身份扫描通过。后续每次 merge／commit 显式使用单次 noreply，检查结果与推送分步执行；未新增规则层。


## 首篇视频增量待接收（2026-10-26）

`domains/game-dev/assets/video.md` 原生 Workflow 整页整理已完成。非作者先只读新文并保存读后复述：读者先按玩家状态依赖与运动必要性选择静态／实时可编辑源／固定影片，再核渠道、同镜头二改与总成本；之后才对照原文核结论、数字、原日期、来源性质与适用条件。发现 S43 社区经验、S22／S29官方条款归档与 S54 V2EX 的来源组混放，已定点修正，同审差量关闭。

负责人固定 f1308f2 新增制作模块沿原调用追加接入；非作者只核新增事实及已审修复：开门揭示 A／B／C 正常链、先提交世界状态、Unity 源与实例绑定、离线渲染作者源、生成器分工、长武器与译文增长30%的二改、混合 A→影片B→C段级退出、取消迟到回调与WebGL音频边界全部保留。对照来源快照与固定官方资料后无必须修项，WP7仅作只读证据，未修改。

实际通道 Claude Code＋DeepSeek，原始 message.model 为 `deepseek-flash`，请求 alias另记；没有模型／引擎／播放器实验。此页为 review_ready 增量，整体仍 running；下一页按顺序是 `01-engine-integration.md`。实际写者为本地协作执行端，不是 dot-B 研究主任务。真实音画、设备、回调行为和质量待项目验收；本端只推结果分支，不标 accepted。
