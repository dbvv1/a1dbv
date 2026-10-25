# A-READABILITY-CLEANUP-001 · 存量正文一次整理

id: A-READABILITY-CLEANUP-001
owner: dot-A
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6f7494afc9707a1377e3fa88ce139e7a1df04e0e
accept: auto
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

核完一页就按自动接收合入 main，负责人事后抽查。全部接收后本任务结束，不再开后续改写批次。

## 当前结果

- 已接收：02与19原决定保留；21按accept:auto合入[6d4d9ce](https://github.com/dbvv1/a1dbv/commit/6d4d9ce35e74c597f7585fbc358bfca85ba2831d)，来源正文[9c0cf2c](https://github.com/dbvv1/a1dbv/commit/9c0cf2c)。先新后旧独审及gstack采用入口差量已关闭，原事实与条件保留，检查通过。
- 在制：09-review-and-quality与05-skills-and-plugins两个独立正文作者的原生Workflow已启动，任务回执由宿主串行汇总；不再改已接收页。
- 后续按清单及追加首页／模板范围接续，全任务仍running；全部范围接收后才结束并触发已登记的最终审计事件。

认领与恢复：dot 本地协作；2026-10-26。按 main 固定 `0a64c83` 的 ready 任务及本轮明确恢复指令启动。首个独占页 `docs/02-models-and-cost.md`，按任务顺序逐页整篇处理，核完一页交增量；非作者先只读新文复述，再对照原文核结论／数据／来源。游戏04、05仍由现有模块原写者负责，未交付前跳过；保留Datasette编辑器原调用。25探索、04MCP、游戏03排除，不改规则层、不统计限定词密度、不设比例或30秒阈值、不新开后续批次。只发布结果分支与本任务回传，当前Codex审计会话接收，本端不标accepted。

宿主执行增量（2026-10-26）：Claude Code＋DeepSeek 原生 Workflow 首篇已实际返回；原始 assistant message.model 为 `deepseek-flash`，请求 alias `deepseek-v4.1-flash[1m]` 另记。非作者按先新后旧顺序完成首篇核对；发现角色选档首句、原核实日重复、旧额度资格条件与导航方向四处差量，沿原调用定点修订，不整篇重派。 本任务全范围尚未完成，状态保留 running，后续按已明确逐页增量要求继续。

发布恢复：用户明确授权后，仅更正错误合并提交身份；原 `8b7d1e9` 替换为 `de859f081d6547eeb976ba3b5da7d0dd1b1564b6`，后续提交只重接父引用，文件树、提交说明与他人身份保留；受保护的精确 lease 更新后 main 为 `1a3fad0dba89e45555f3cc1197d2ee986ab8d158`，身份扫描通过。后续每次 merge／commit 显式使用单次 noreply，检查结果与推送分步执行；未新增规则层。


## 首篇增量待接收（2026-10-26）

`docs/02-models-and-cost.md` 已完成原生 Workflow 整页整理。非作者先只读新文并独立复述：读者能按实现／协调／审查选推理档、找到保缓存换档与新任务入口、区分 API／订阅额度和总投入；随后才打开原文，核数字、版本／原日期、来源性质与适用条件。发现角色选档首句未落实、日期重复、Pro 200 旧额度资格范围变宽及导航方向四项，沿原调用定点修正，同审差量已全部关闭。无在线事实刷新，无新模型试验或密度统计。

实际通道 Claude Code＋DeepSeek；原始 message.model 为 `deepseek-flash`，alias另记。当前页整理／修订已结束，独占写者为本地协作执行端；不是 dot-A 研究主任务。此页为 review_ready 增量，全任务仍 running；下一页按顺序是 `docs/19-experiments.md`，其他声明范围尚未完成。只推指定结果分支，本端不标 accepted。

本次固定结果：[99e7137aac85607b31593516514b97e90be43382](https://github.com/dbvv1/a1dbv/commit/99e7137aac85607b31593516514b97e90be43382)，仅指定 relay 分支；check_repo.py、公开文件／实际新增提交身份扫描及交付差量检查通过。

## 审计接收：02模型与成本

接收99e7137中的02首篇：复用先新后旧独立核对与四处定点修复，读者可按角色选档并直接使用起步命令、缓存换档和计费入口。接收差量将仅含日期的表头改为“核实日期”，并恢复本地模型等价说法“不作普适推荐”的原义；未刷新价格或型号事实。该页结束，不再打磨；全任务保持running，继续19及后续范围。


第二页执行与核对（2026-10-26）：`19-experiments.md` 原生 Workflow 于2026-10-25T17:30:22.371Z返回，非作者先新文复述再对原文，确认关键数字、版本、原日期、边界和入口保持；发现部分语义节的研究来源仍在正文／节末重复。只修这些段的来源集中，命令／fixture／操作入口留在使用处；沿原调用续改，同审只核差量。02已由审计接收并修正原义，此页结束，不再修改。


## 第二页实验方法增量待接收（2026-10-26）

`docs/19-experiments.md` 已完成原生 Workflow 整页整理。非作者先只读新文并保存理解，再对原文核关键事实：E1缓存和输入数、2.1.294／2.1.296、E3的27次和新增测试、E2费用／墙钟、E4历史53方法／本次6方法与43条失败、E5的291行／288单元、E6两后端26方法以及原日期、混杂因素、未知／未跑状态、命令与夹具均保持。读者能选择单Agent起点、补回归知识、分项核工具投入并沿好坏基线复现。

独审发现研究来源仍在正文与节末重复，原调用定点修正后，同审只核此差量并关闭：E3／E2／E4／E5／E6及环境／先导节来源合并到各节末，命令／fixture／workflow-ablation操作入口保留就地。没有新事实刷新、历史实验重跑、密度指标或额外审查树。实际 message.model为deepseek-flash，请求alias单列，通道为Claude Code＋DeepSeek。

此页 review_ready，待当前审计会话接收；整体仍 running，02已接收不再改，下一顺序为21-agent-patterns。只指定结果分支，本端不标 accepted。

第二页固定结果：[508004348fa5655236d00d42b55caec6d06c1010](https://github.com/dbvv1/a1dbv/commit/508004348fa5655236d00d42b55caec6d06c1010)，仅relay/a-readability-cleanup-001；文档入口、公开文件及实际提交身份检查通过。

## 审计接收：19实测记录

接收5080043中的19页。复用非作者先读新文、再对原文及来源归位差量的核对；E1至E6数字、版本、混杂因素、原日期、好坏基线与复现入口均保留。输入分项改成表格，复现操作按步骤呈现，来源在语义节末归位，读者可直接选择单Agent/指令/费用核查路线。补留旧“复查状态”锚点以保持外部引用。该页收口；全任务仍running，继续21与后续范围。
