# A-READABILITY-CLEANUP-001 · 存量正文一次整理

id: A-READABILITY-CLEANUP-001
owner: dot-A
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6f7494afc9707a1377e3fa88ce139e7a1df04e0e
result_branch: relay/a-readability-cleanup-001

## 目标

把存量正文改成[编写约定](../../../CLAUDE.md#编写约定)的写法：读者先拿到选择和做法，关键结论、数据、来源和会改变决定的条件一条不丢。用户 10-26 委托，本任务一次做完。

## 范围与顺序

按防御密度从高到低：docs/02-models-and-cost.md、docs/19-experiments.md、docs/21-agent-patterns.md、docs/09-review-and-quality.md、docs/05-skills-and-plugins.md、docs/11-community-pulse.md、docs/06-hooks-and-guardrails.md、docs/17-troubleshooting.md、docs/10-security.md、docs/01-agents/open-source-agents.md、docs/01-agents/codex.md、docs/22-agent-evaluation.md、docs/18-team-adoption.md，然后是其余页：docs/00-state-of-ai-coding.md、docs/03-context-engineering.md、docs/07-workflows.md、docs/08-multi-agent.md、docs/12-resources.md、docs/13-frontier-radar.md、docs/14-synthesis.md、docs/15-task-playbooks.md、docs/16-building-agents.md、docs/20-codex-long-horizon.md、docs/23-browser-verification.md、docs/24-community-workflows.md、docs/README.md、docs/01-agents/claude-code.md、docs/01-agents/gemini-cli.md、docs/01-agents/ide-and-others.md、docs/01-agents/README.md。25 探索、04 MCP 和游戏 03 已改好，不再动。

**追加范围（2026-10-26）**：仓库首页 `README.md`，以及 `templates/` 下全部 Markdown（README、AGENTS、CLAUDE、REVIEW、agents 与 Skill 说明）。模板会被读者复制进自己的项目，写法问题会跟着扩散，优先级与正文相同；只改说明文字，命令、脚本、路径和字段名保持不变，改后按 CLAUDE.md 的模板规则用模拟输入跑一遍相关脚本。

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

认领与恢复：dot 本地协作；2026-10-26。按 main 固定 `0a64c83` 的 ready 任务及本轮明确恢复指令启动。首个独占页 `docs/02-models-and-cost.md`，按任务顺序逐页整篇处理，核完一页交增量；非作者先只读新文复述，再对照原文核结论／数据／来源。游戏04、05仍由现有模块原写者负责，未交付前跳过；保留Datasette编辑器原调用。25探索、04MCP、游戏03排除，不改规则层、不统计限定词密度、不设比例或30秒阈值、不新开后续批次。只发布结果分支与本任务回传，当前Codex审计会话接收，本端不标accepted。

宿主执行增量（2026-10-26）：Claude Code＋DeepSeek 原生 Workflow 首篇已实际返回；原始 assistant message.model 为 `deepseek-flash`，请求 alias `deepseek-v4.1-flash[1m]` 另记。非作者按先新后旧顺序完成首篇核对；发现角色选档首句、原核实日重复、旧额度资格条件与导航方向四处差量，沿原调用定点修订，不整篇重派。 本任务全范围尚未完成，状态保留 running，后续按已明确逐页增量要求继续。

发布恢复：用户明确授权后，仅更正错误合并提交身份；原 `8b7d1e9` 替换为 `de859f081d6547eeb976ba3b5da7d0dd1b1564b6`，后续提交只重接父引用，文件树、提交说明与他人身份保留；受保护的精确 lease 更新后 main 为 `1a3fad0dba89e45555f3cc1197d2ee986ab8d158`，身份扫描通过。后续每次 merge／commit 显式使用单次 noreply，检查结果与推送分步执行；未新增规则层。


## 首篇增量待接收（2026-10-26）

`docs/02-models-and-cost.md` 已完成原生 Workflow 整页整理。非作者先只读新文并独立复述：读者能按实现／协调／审查选推理档、找到保缓存换档与新任务入口、区分 API／订阅额度和总投入；随后才打开原文，核数字、版本／原日期、来源性质与适用条件。发现角色选档首句未落实、日期重复、Pro 200 旧额度资格范围变宽及导航方向四项，沿原调用定点修正，同审差量已全部关闭。无在线事实刷新，无新模型试验或密度统计。

实际通道 Claude Code＋DeepSeek；原始 message.model 为 `deepseek-flash`，alias另记。当前页整理／修订已结束，独占写者为本地协作执行端；不是 dot-A 研究主任务。此页为 review_ready 增量，全任务仍 running；下一页按顺序是 `docs/19-experiments.md`，其他声明范围尚未完成。只推指定结果分支，本端不标 accepted。

本次固定结果：[99e7137aac85607b31593516514b97e90be43382](https://github.com/dbvv1/a1dbv/commit/99e7137aac85607b31593516514b97e90be43382)，仅指定 relay 分支；check_repo.py、公开文件／实际新增提交身份扫描及交付差量检查通过。

第二页执行事实（2026-10-26）：首篇固定结果已回传后，沿原调用开始 `docs/19-experiments.md` 整页整理；实际 Claude Code＋DeepSeek 原生 Workflow 已启动，原始 message.model 为 deepseek-flash，非新建任务或重派首篇。本页实施已于2026-10-25T17:30:22.371Z返回，现由新上下文非作者先新文复述、再原文对照，未判接收。剩余页继续原清单顺序，全部范围未完成。
