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

开工前看最新 main 和在制分支；同一文件只有一个写者，有人在改就先做别的页。已经清楚的页保留原样。

## 怎么改

- 整节重写，不逐句删词：首句给推荐，接着是理由、步骤和取舍；来源和原核实日期在节末写一次。
- 只写会改变读者决定的限制，写一次。重复的范围声明、连串否定句和开发过程删掉，过程留在已有研究链接里。
- 命令、代码、显式锚点和引用保持可用；标题和表格可按读者的问题重组。
- 事实有疑点时回原来源核对；核不清的照原状态写。

## 验收

用原生 Workflow 实施，由非作者核对：先只读新文，复述主要选择、第一步和关键取舍；再对照原文核关键结论、数字、版本与日期、来源和适用条件。有遗漏就修对应段。

每页核完就交增量，负责人逐页接收。全部接收后本任务结束，不再开后续改写批次。

## 当前结果

待接收。这里只写已交付页及提交、剩余页和当前写者、阻塞。

认领与恢复：dot 本地协作；2026-10-26。按 main 固定 `0a64c83` 的 ready 任务及本轮明确恢复指令启动。首个独占页 `docs/02-models-and-cost.md`，按任务顺序逐页整篇处理，核完一页交增量；非作者先只读新文复述，再对照原文核结论／数据／来源。游戏04、05仍由现有模块原写者负责，未交付前跳过；保留Datasette编辑器原调用。25探索、04MCP、游戏03排除，不改规则层、不统计限定词密度、不设比例或30秒阈值、不新开后续批次。只发布结果分支与本任务回传，当前Codex审计会话接收，本端不标accepted。
