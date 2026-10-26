# A-READABILITY-CLEANUP-001 · 存量正文一次整理

id: A-READABILITY-CLEANUP-001
owner: dot-A
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6f7494afc9707a1377e3fa88ce139e7a1df04e0e
accept: auto
result_branch: relay/a-readability-cleanup-001

把存量正文改成[编写约定](../../../CLAUDE.md#编写约定)的写法：读者先拿到选择和做法，关键结论、数据、来源和会改变决定的条件一条不丢。用户 10-26 委托，本任务一次做完。

## 范围与顺序

按防御密度从高到低：docs/02-models-and-cost.md、docs/19-experiments.md、docs/21-agent-patterns.md、docs/09-review-and-quality.md、docs/05-skills-and-plugins.md、docs/11-community-pulse.md、docs/06-hooks-and-guardrails.md、docs/17-troubleshooting.md、docs/10-security.md、docs/01-agents/open-source-agents.md、docs/01-agents/codex.md、docs/22-agent-evaluation.md、docs/18-team-adoption.md，然后是其余页：docs/00-state-of-ai-coding.md、docs/03-context-engineering.md、docs/07-workflows.md、docs/08-multi-agent.md、docs/12-resources.md、docs/13-frontier-radar.md、docs/14-synthesis.md、docs/15-task-playbooks.md、docs/16-building-agents.md、docs/20-codex-long-horizon.md、docs/23-browser-verification.md、docs/24-community-workflows.md、docs/README.md、docs/01-agents/claude-code.md、docs/01-agents/gemini-cli.md、docs/01-agents/ide-and-others.md、docs/01-agents/README.md。25 探索、04 MCP 和游戏 03 已改好，不再动。

**追加范围（2026-10-26）**：仓库首页 `README.md`，以及 `templates/` 下全部 Markdown（README、AGENTS、CLAUDE、REVIEW、agents 与 Skill 说明）。模板会被读者复制进自己的项目，写法问题会跟着扩散，优先级与正文相同；只改说明文字，命令、脚本、路径和字段名保持不变，改后按 CLAUDE.md 的模板规则用模拟输入跑一遍相关脚本。

**不改的范围**：`docs/research/`、`experiments/`、`docs/collaboration/reviews/`、`archive/` 和 local-jobs 历史记录是留档证据，不重写；正文引用它们时，在正文里写清结论。

开工前看最新 main 和在制分支；同一文件只有一个写者，有人在改就先做别的页，最后统一回头改。已经清楚的页保留原样。

## 怎么改

- 整节重写，不逐句删词：首句给推荐，接着是理由、步骤和取舍；来源和原核实日期在节末写一次。只写会改变读者决定的限制，写一次。重复的范围声明、连串否定句和开发过程删掉，过程留在已有研究链接里。
- 命令、代码、显式锚点和引用保持可用；标题和表格可按读者的问题重组。
- 事实有疑点时回原来源核对；核不清的照原状态写。

## 验收

用原生 Workflow 实施，由非作者核对：先只读新文，复述主要选择、第一步和关键取舍；再对照原文核关键结论、数字、版本与日期、来源和适用条件。有遗漏就修对应段。

核完一页就按自动接收合入 main，负责人事后抽查。全部接收后本任务结束，不再开后续改写批次。

## 当前结果

- 已接收：02、19、21、09、05、11、06、17、10、open-source-agents、codex、22、18；00总览和12资源索引由dot-A云端独审接收，来源与本机调用分开。旧接收与来源保留Git历史；22／18固定正文为[b0fce689](https://github.com/dbvv1/a1dbv/commit/b0fce689)／[e26edfb8](https://github.com/dbvv1/a1dbv/commit/e26edfb8)。
- 执行端正在交接：不再认领任务或开启新页，只收尾已在途03上下文／07工作流的审查与修正。03还须吸收[原采用证据](A-CODING-ADOPTION-001.md)：Codex0.154仅上下文组装实跑，OpenCode V2发现／已加载规则更新契约已核但未实跑；分别给单包`--cd`与根会话跨包的选择，不重启旧cspell。
- 下一页为`docs/08-multi-agent.md`，本轮清理尚未开始；其[8319183采用回流](https://github.com/dbvv1/a1dbv/commit/8319183)已由A接收并释放写域，不等于整页清理完成。其余顺序与首页／模板范围按上列完整清单，已接收页不重做。
- 当前03／07写域尚未交出，收尾完成后在此明确释放，由替代接收脚本以adopt从“当前结果”接续；全任务保持running。原发往审计会话的最终接收请求已退役，不再发送，不另建计划或服务。
- 本机原通道Claude Code＋DeepSeek原生Workflow，message.model=deepseek-flash；非作者先新后旧核对，检查通过才按accept:auto接收。任务回执由宿主串行汇总，旧过程留Git历史。
