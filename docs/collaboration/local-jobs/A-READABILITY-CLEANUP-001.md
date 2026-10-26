# A-READABILITY-CLEANUP-001 · 存量正文一次整理

id: A-READABILITY-CLEANUP-001
owner: dot-A
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6f7494afc9707a1377e3fa88ce139e7a1df04e0e
accept: auto
result_branch: relay/a-readability-cleanup-001

把存量正文改成[编写约定](../../../CLAUDE.md#编写约定)的写法：读者先拿到选择和做法，关键结论、数据、来源和会改变决定的条件一条不丢。用户 10-26 委托，本任务一次做完。

## 范围与顺序

**收窄（2026-10-26 用户决定）**：只做读者真正会读的入口页和会被复制的模板，已接收页保留（见当前结果）。本轮收口范围：仓库首页 `README.md`、`docs/README.md`、`docs/15-task-playbooks.md`、`docs/01-agents/README.md`、`docs/01-agents/claude-code.md`，以及 `templates/` 下全部 Markdown（包括 dot-A 云端已接收的两份入口 README）。模板只改说明文字，命令、脚本、路径和字段名保持不变，改后按 CLAUDE.md 的模板规则用模拟输入跑一遍相关脚本。其余页（08、13、14、20、23、24、ide-and-others 等）不再单独改写，下次因内容更新被改动时按编写约定一起重写。

**不改的范围**：`docs/research/`、`experiments/`、`docs/collaboration/reviews/`、`archive/` 和 local-jobs 历史记录是留档证据，不重写；正文引用它们时，在正文里写清结论。

开工前看最新 main 和在制分支；同一文件只有一个写者，有人在改就先做别的页，最后统一回头改。已经清楚的页保留原样。

## 怎么改

- 整节重写，不逐句删词：首句给推荐，接着是理由、步骤和取舍；来源和原核实日期在节末写一次。只写会改变读者决定的限制，写一次。重复的范围声明、连串否定句和开发过程删掉，过程留在已有研究链接里。
- 命令、代码、显式锚点和引用保持可用；标题和表格可按读者的问题重组。
- 事实有疑点时回原来源核对；核不清的照原状态写。

## 验收

用原生 Workflow 实施，由非作者做读者实测：只读新文，回答一个真实读者问题（推荐什么、第一步、何时不适用），说出读者新知道了什么；答不出、或只是换了说法压短篇幅，就不通过。再对照原文核关键结论、数字、版本与日期、来源和适用条件，有遗漏就修对应段。

核完一页就按自动接收合入 main，负责人事后抽查。收窄后的范围全部接收即标 accepted，不再开后续改写批次。

## 当前结果

- 按用户收窄范围收口：5个入口与15份模板，共20个文件均已有可复用接收依据；不等于重新核实全部外部事实或验证原生客户端效果。
- docs/README.md 的新本机产物[d243e8c](https://github.com/dbvv1/a1dbv/commit/d243e8c2ae7fca7f640c3592228607d806f4cd81)已按当前验收独审并自动合入[c0a9c63](https://github.com/dbvv1/a1dbv/commit/c0a9c63863a010999eddba7e2a91a5b172109a66)，两处质量／来源限定已恢复；复用该次独审与检查，不覆盖新稿。
- 00、12、Gemini、16及3份模板README由dot-A云端后台代理实施、非作者先新后旧核查并回答真实读者问题；命令、字段、日期、来源与旧锚点保留，相关合成回归通过。较早本机Claude Code＋DeepSeek已收正文与03／07收尾见[固定记录](https://github.com/dbvv1/a1dbv/blob/c7f577c76f51ee4d085136bba8b6ae1122b82147/docs/collaboration/local-jobs/A-READABILITY-CLEANUP-001.md)，通道不混算。
- 根README、Agent总览、Claude入口及11份模板经fresh读者问题核对后原样保留；15任务路线复用明确读者问答，固定交付模板另补一次使用问答。20个文件依受检版本和后来整合差量逐一核对，未重跑B游戏或旧模型计划。
- 本任务不再领取新页或开启后续改写批次。未列入当前范围的正文只在今后真实内容更新时按编写约定处理；退役的最终审计请求不恢复。可能迟到的旧结果先核已接收内容，不能用旧running状态覆盖本次完成。
