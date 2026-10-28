# A-PARALLEL-REVIEW-SOURCES-20261028 · 并行实现之后，怎样接得过来
id: A-PARALLEL-REVIEW-SOURCES-20261028
owner: dot-A
status: running
kind: explore
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 4282fee1684ba2c6a6412f58d6f52a12d913221c
result_branch: relay/a-parallel-review-sources-20261028

## 目标
给 dot 长程高质量并行补一份可判断的来源材料：实现任务不断交回时，什么实际信号支持继续派新实现，什么信号支持先让独立读者审查、修订和接收？找真实使用者怎样处理接收瓶颈，供 dot-A 在已有任务上选择下一步，不制定固定代理数量或新调度。

## 按哪个 Skill 与规格做
按 explore-frontier Skill 和 `kind: explore` 三路收集、核实后整理再审。先读 [长任务](../../decisions/long-tasks.md)、[并行接收](../../08-multi-agent.md#6-操作手册从一个大任务到并行执行)、[评审](../../09-review-and-quality.md)、inbox 和相关任务，已有原则只作基线。
开工核最新 main、负责人分支与已回结果，发现同题在途先报告重叠；旧分支的 ready 不覆盖 main 的终态。A-RESUME-CONTRACT-SOURCES-20261028、中止的 CI 补项及两个取消的宽采集保持原状态，不重复派发或取回其材料。

只从以下原始入口起步，沿其中与本题直接相关的评论、公开产物或后续修订追查：
- [Cursor Projects 官方实践](https://cursor.com/blog/projects)：核协调者分派、渐进接收与持续维护的机制和实际公开证据；PR 数增长仅作厂商自报，另查质量、返工与完整投入是否可见。
- [社区原帖：并行到何时人成瓶颈](https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/)：读完整可见讨论，区分审查、产品决定、本地测试和 CI 容量，不把回复里的并发数当通用最佳值。
- [社区原帖：怎样不再成为瓶颈](https://www.reddit.com/r/ClaudeCode/comments/1x15b7r/how_do_you_stop_being_the_bottleneck/)：追独立评审、批量接收、减少并行和仍卡在最后验收的正反反馈。

三路分别核官方机制、社区真实取舍、证据与仓内差异；范围限上述讨论链，不扩成通用多 Agent／插件扫描。已有 Cursor 1 月 scaling-agents、HumanLayer 接收、dot 停工个案、OpenCode 保活和 pstack 验收地图不重新总结。
每条只保留会改变下一步的材料，回答：
1. 当时具体做什么，哪些结果已回、哪些还在执行？实际瓶颈落在审查、需求决定、测试资源还是合并冲突，依据是什么？
2. 作者实际调整了什么：把协调交出去、预留独立读者、批量审查、先接收再补位，还是缩小并行？区分已做、自述有效、打算尝试及纯建议。
3. 变化后能核到哪些合格交付、漏检、返工和等待／协调投入？缺可比前后记录就写未知；代理数、PR 数与“运行整夜”不单独充当效果。
4. 什么条件下该做法仍失败或被撤回？对 dot 可借的最小动作是什么，哪些依赖人类注意力、特定宿主或额外基础设施，不能直接外推？

逐项给原帖／具体评论永久链接、日期、产品／模型版本（未给则未知）、公开产物链接和支持主张的原位置。核发布日期，页面相对时间或搜索缓存时间不补成精确运行日期；作者宣传、用户自报、可复核产物分开。无净增量可交明确负结果与排除理由。
只读公开官方与社区原文、公开源码／PR；可用正常匿名 HTTPS。未读到的正文标覆盖缺口，遇拒绝停对应入口；不登录、不联系作者、不读取私人 transcript／账号用量／凭据，不探查本机其他文件／配置、不操作桌面或改接收脚本，不安装运行新工具、不新开模型或浏览器实例。

## 写入范围
模型唯一成果：`docs/collaboration/local-jobs/artifacts/A-PARALLEL-REVIEW-SOURCES-20261028/sources.md`。先交可改变取舍的发现，再列来源与未知；不改正文、模板、TASKS、inbox、其他任务或长期规则，不复制整份原文。
接收端只另更新本任务状态／当前结果；检查、公开扫描、提交和指定 relay 分支推送由脚本做，回 `review_ready` 由 dot-A 接收，不用 `accept: auto`。任务文件存在或标 running 只表示准备／认领，不自称采集已执行。

## 怎样算做成
一个 60–90 分钟单元，含整理与审查最多 90 分钟；仅由现有接收端按共享最多 4 并行调度，无 GPU，不另起进程抢槽。到时保留已有事实与缺口，不扩题续搜。
非作者逐链接核主张、日期、实际动作和因果强度；有无明确改进都交结果。运行 `check_repo`、`check_public` 与空白检查；受阻写具体入口、原因、哪些未完成及恢复条件，失败和未知分开。

## 当前结果

- 《并行实现之后怎样接得过来》来源清单已写入 sources.md：45 个候选中 42 个通过链接核实，按 A–E 排序并给出继续派发的四类可观测信号、转独立审查的触发条件和 dot 最小动作；但独立审查仍有 7 个问题未关闭，主要是 Request Changes 清锁漏了仓库 Action 路径、Project 主对话也可发 /review，以及多处数字归因/链接归属不准，需修正后重审。
- 产物：[cadc4db](https://github.com/dbvv1/a1dbv/commit/cadc4db285f95d52543abe7e3e70118b0dd07238)，分支 `relay/a-parallel-review-sources-20261028`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查未通过或未完成。
- 下一步：按 7 条 openIssues 修正 sources.md（第 3/36/37/55/57/80 行补 Action 清锁路径，第 64/81 行补 Project 主对话入口，第 96/145 行改 Bugbot 误报归因，第 103/143 行注明 swarm 对照非等时，第 125 行挂 pey46d9 链接，第 128 行改分数表述，第 139/148 行改 R/A/V/N 现状），再跑两角度审查。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
