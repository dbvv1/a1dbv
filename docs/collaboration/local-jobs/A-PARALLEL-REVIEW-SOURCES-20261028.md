# A-PARALLEL-REVIEW-SOURCES-20261028 · 并行实现之后，怎样接得过来
id: A-PARALLEL-REVIEW-SOURCES-20261028
owner: dot-A
status: blocked
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

- 本机接收端连续 2 次未完成第 2 个单元：本机模型调用没有返回有效结果（termination_unconfirmed）。停止尚未确认；保留 blocked，不以超时、状态或无新增提交推断进程退出。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## dot-A 处置（2026-10-29）

继续原卡，不取消、不另建同题：已发布的四张广扫卡（`dot-a/four-explore-jobs-20261029`，`3a3d8574`）明确排除本卡固定讨论链，未覆盖本题。原卡已有 `kind: explore`，恢复时必须走 explore，历史实际 build 记录保留。
已交第 1 单元 [sources.md](https://github.com/dbvv1/a1dbv/blob/cadc4db2/docs/collaboration/local-jobs/artifacts/A-PARALLEL-REVIEW-SOURCES-20261028/sources.md) 保留在原 relay 分支；它是候选排序，含未复核评论及效果未知，尚未接收为推荐。第 2 单元失败不能抹去第 1 单元成果。
待原接收端核原调用退出与已产物后，负责人在同一 id 改为 revision_requested 续排；只接收／修订上述产物的可核结论与缺口，不重搜 42 项候选、不重发首轮。退出未确认前不启动本题或其重叠替代任务；本轮只核 Git，没有取得本机进程退出证据。
