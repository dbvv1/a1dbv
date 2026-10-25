# B-READABILITY-CLEANUP-001 · 存量正文一次整理

id: B-READABILITY-CLEANUP-001
owner: dot-B
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6f7494afc9707a1377e3fa88ce139e7a1df04e0e
result_branch: relay/b-readability-cleanup-001

## 目标
2026-10-26 用户委托核心方向与审计会话处理防御式行文。读者先得到选择、理由与可执行做法；原有关键结论、数据、来源和会改变决定的条件完整保留。按最新 CLAUDE 编写约定与运行手册§7实施，替换旧style批次的搬标签、固定压缩比例和结构逐字冻结规格。

## 范围与顺序
固定清理范围：domains/game-dev/01-engine-integration.md；domains/game-dev/02-verification-and-playtesting.md；domains/game-dev/04-client-modules.md；domains/game-dev/05-gameplay-architecture.md；domains/game-dev/06-indie-roadmap.md；domains/game-dev/README.md；domains/game-dev/assets/2d.md；domains/game-dev/assets/3d.md；domains/game-dev/assets/animation.md；domains/game-dev/assets/audio.md；domains/game-dev/assets/materials.md；domains/game-dev/assets/video.md。
先处理已稳定的正文；04／05与assets在途模块的相关段落等原写者交付后再接收改写。已接收的04 MCP与游戏03试点直接复用；25探索由本次审计先行交付，不再次改写。先检查最新main、在制任务与负责人分支；同一文件只有一个写者，有并发写入先做其他页。
范围内先读完整页面。已有清楚选择、步骤与必要取舍且无具体重复缺陷的页保留；其余一次整篇改好，合并重复事实，历史过程留既有研究链接。独立页可并行；每页审完即交可接收增量，不等全部完成才交付，不新建002、003等后续改写任务。

## 写作与接收
来源和原核实日按语义节集中一次，代码与操作链接放使用处；只保留改变决定的限制一次。保持现有命令、示例代码、显式锚点和引用可用，标题／表格可按读者逻辑重组。重复表述合并不算丢结论。事实新疑点按原来源核对，未核清的保留准确状态，不靠改词抬高结论。
普通原生Workflow实施并由非作者独立核对：先只读新文找主要选择、首个操作和必要取舍，再对照原文检查关键结论、数字、版本／日期、来源及适用条件。来源列表和代码差异核对辅助语义审查；不以词频、链接数、每个背景节都有三问或压到75%判通过。发现真实遗漏只修对应段，完成后收口。
保留同一脚本的前后可见正文长度、固定词表（不能／依据／不等于／候选／仅／未运行／不代表）密度和一个代表段落对比，供解释读者负担变化；不扩写分母、替换近义词或删除有效条件来改善数字。关键结论零丢失，重复限制应明显减少；若原文限制确有必要则保留并说明。
只改指定正文及本任务，按既有文档／公开检查发布结果分支；不运行产品、旧实验或刷新无关来源，不另建报告／检查框架。结果回本任务，由原负责人逐页接收；全部范围接收或有明确理由保留后结束，本任务不成为永久循环。

## 当前结果
待自然接收。当前态保持简短：已交付页与提交、直接复用页及原因、剩余页／当前写者、必要阻塞；历史过程留提交说明。原负责人接收已完成页时保留在制工作，整批完成再标accepted。
