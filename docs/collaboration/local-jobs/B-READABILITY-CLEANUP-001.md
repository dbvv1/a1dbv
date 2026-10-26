# B-READABILITY-CLEANUP-001 · 存量正文一次整理

id: B-READABILITY-CLEANUP-001
owner: dot-B
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6f7494afc9707a1377e3fa88ce139e7a1df04e0e
accept: auto
result_branch: relay/b-readability-cleanup-001

## 目标

把存量正文改成[编写约定](../../../CLAUDE.md#编写约定)的写法：读者先拿到选择和做法，关键结论、数据、来源和会改变决定的条件一条不丢。用户 10-26 委托，本任务一次做完。

## 范围与顺序

**收窄（2026-10-26 用户决定）**：只做读者会复制的引擎模板与入口，已接收页保留（见当前结果），`assets/2d.md`、`assets/3d.md` 已收尾接收。剩余范围：`domains/game-dev/unity/` 与 `domains/game-dev/unreal/` 的 README，以及两处 `templates/` 下的 AGENTS、CLAUDE、README、agents 与 Skill 说明；只改说明文字，命令、脚本、路径和字段名保持不变，改后按 CLAUDE.md 的模板规则用模拟输入跑一遍相关脚本。`assets/animation.md`、`audio.md`、`materials.md` 与其余引擎页不再单独改写，制作链工作更新内容时按编写约定一起重写。

**不改的范围**：`docs/research/`、`experiments/`、`docs/collaboration/reviews/`、`archive/` 和 local-jobs 历史记录是留档证据，不重写；正文引用它们时，在正文里写清结论。

开工前看最新 main 和在制分支；同一文件只有一个写者，有人在改就先做别的页，最后统一回头改。已经清楚的页保留原样。

## 怎么改

- 整节重写，不逐句删词：首句给推荐，接着是理由、步骤和取舍；来源和原核实日期在节末写一次。
- 只写会改变读者决定的限制，写一次。重复的范围声明、连串否定句和开发过程删掉，过程留在已有研究链接里。
- 命令、代码、显式锚点和引用保持可用；标题和表格可按读者的问题重组。
- 事实有疑点时回原来源核对；核不清的照原状态写。

## 验收

用原生 Workflow 实施，由非作者做读者实测：只读新文，回答一个真实读者问题（推荐什么、第一步、何时不适用），说出读者新知道了什么；答不出、或只是换了说法压短篇幅，就不通过。再对照原文核关键结论、数字、版本与日期、来源和适用条件，有遗漏就修对应段。

核完一页就按自动接收合入 main，负责人事后抽查。收窄后的范围全部接收即标 accepted，不再开后续改写批次。

## 当前结果

- 已接收：assets/video.md、01-engine-integration.md、02-verification-and-playtesting.md、04-client-modules.md、05-gameplay-architecture.md、06-indie-roadmap.md、游戏目录README.md、assets/2d.md、assets/3d.md。05固定正文[417c42d7](https://github.com/dbvv1/a1dbv/commit/417c42d7)、入口页[713a88a8](https://github.com/dbvv1/a1dbv/commit/713a88a8)已独审／检查接收于[b6e7f064](https://github.com/dbvv1/a1dbv/commit/b6e7f064)及其祖先；其余原接收与来源保留Git历史。
- 在途2D／3D已收尾：固定正文[2c6269e1](https://github.com/dbvv1/a1dbv/commit/2c6269e1)完成非作者先新后旧审查；四项差量独审通过，追加六行原未运行事实已恢复并由宿主非作者逐行核对与快照一致，适用检查通过后按accept:auto接收。作者、独审及恢复调用均已结束，当前写域已释放。
- 下一页为 `domains/game-dev/unity/` 与 `unreal/` 的 README 和模板（按上面收窄后的范围）；animation／audio／materials 不再单独改写。保留原模块线新采用事实，不重做已接收页。
- 本端收尾与交接已完成，由替代接收脚本以adopt从“当前结果”接续；全任务保持running。本端不再认领任务、开启新页或派发下一批。原发往审计会话的最终接收请求已退役，不再发送，不另建计划或服务。
- 本机原通道Claude Code＋DeepSeek原生Workflow，message.model=deepseek-flash；非作者先新后旧核对，检查通过才按accept:auto接收。宿主串行汇总任务回执；CPU／文稿／离线检查不扩大为引擎或人工听看通过。
