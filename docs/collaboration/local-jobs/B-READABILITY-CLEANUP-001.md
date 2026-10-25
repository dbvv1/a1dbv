# B-READABILITY-CLEANUP-001 · 存量正文一次整理

id: B-READABILITY-CLEANUP-001
owner: dot-B
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6f7494afc9707a1377e3fa88ce139e7a1df04e0e
result_branch: relay/b-readability-cleanup-001

## 目标

把存量正文改成[编写约定](../../../CLAUDE.md#编写约定)的写法：读者先拿到选择和做法，关键结论、数据、来源和会改变决定的条件一条不丢。用户 10-26 委托，本任务一次做完。

## 范围与顺序

按防御密度从高到低：domains/game-dev/assets/video.md，然后是 domains/game-dev/ 下其余页：01-engine-integration.md、02-verification-and-playtesting.md、04-client-modules.md、05-gameplay-architecture.md、06-indie-roadmap.md、README.md、assets/2d.md、assets/3d.md、assets/animation.md、assets/audio.md、assets/materials.md。04、05 和 assets 里还在写的模块段落，等原写者交付后再改。25 探索、04 MCP 和游戏 03 已改好，不再动。

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
