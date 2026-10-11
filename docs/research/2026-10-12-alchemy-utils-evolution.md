# D4 来源记录：alchemy-utils 的第二次修改

> 核实：2026-10-12（北京时间）。只读公开来源及源码，没有安装或执行上游项目、调用模型、接触私人会话或生产数据库。正文与采用判断归 [24 社区工作流](../24-community-workflows.md#从原型到第二次修改alchemy-utils-的真实-csv-改变了什么)，本页只保存定位和证据缺口。

## 固定证据

- **A1 [社区：作者经历]**：[2026-08-12 发布说明](https://simonwillison.net/2026/aug/12/alchemy-utils/)披露 Codex／GPT-5.6 Sol Ultra、初始需求与实际 CSV 导入；接近一小时降至约 35 秒是作者报告。页面时间不是每一步执行时间；以仓库提交／release 时间定位后续版本，不将文章标题日期当成优化已于初版完成。
- **A2 [社区：公开对话]**：[作者公开 Gist，revision `d5bf8416`](https://gist.github.com/simonw/bd10e4886688e0fd1b833e4afaabf19e/d5bf8416e0b099561326dc04602987027716a782)。已读初始任务、DuckDB 反射问题后的人工拆分要求、追加 CLI 和重命名段落；结尾是一次 schema 命令异常与测试数据库恢复。它不是优化任务的完整记录，不能据它补写性能请求、profiler 结果、全部提示轮次或人的耗时。没有保存整份对话或其中本机路径。
- **A3 [一手：架构落实]**：[`768c090145d57ce4e71d1b36a2fca29a7425d5f7`](https://github.com/simonw/alchemy-utils/commit/768c090145d57ce4e71d1b36a2fca29a7425d5f7)引入各引擎 Database 子类；A2 的人工要求先于对应提交操作。源码表明后续复用了此边界，不证明没有该要求就做不到或更慢。
- **A4 [一手：初版与第二次修改]**：[初版 `14702954`](https://github.com/simonw/alchemy-utils/tree/147029549653238621b78104d0a93cd2f9cf4df6)；[优化 `e3b8d03`](https://github.com/simonw/alchemy-utils/commit/e3b8d03e040867b256aeff7db322a0b0eb1f8b06)（2026-08-13 UTC）；[0.1a1 `c2432fb`](https://github.com/simonw/alchemy-utils/tree/c2432fb580317dd6a8cdf3e3451a2fc6a85631f7)与[发布说明](https://github.com/simonw/alchemy-utils/releases/tag/0.1a1)。读完整优化补丁，涉及 README、CLI、共享 db、DuckDB adapter 和两份测试。初版忽略 batch_size／全量物化是已披露的 spike 取舍，不定性为违反初始需求。
- **A5 [一手：测试与历史执行]**：[test_writes.py](https://github.com/simonw/alchemy-utils/blob/e3b8d03e040867b256aeff7db322a0b0eb1f8b06/tests/test_writes.py)新增的原子性例子是在已创建表上，三条输入第二批出现重复主键后检查表空；不是建表 DDL 回滚证明。[test_databases.py](https://github.com/simonw/alchemy-utils/blob/e3b8d03e040867b256aeff7db322a0b0eb1f8b06/tests/test_databases.py)检查缺 pandas 缓存退出后清理，不测并发。精确 `c2432fb` 的 [Test run 31662692544](https://github.com/simonw/alchemy-utils/actions/runs/31662692544)五个 Python job 状态 success；只进一步读取 [3.10 job 94330647807](https://github.com/simonw/alchemy-utils/actions/runs/31662692544/job/94330647807)完整日志，179 collected、178 passed、1 skipped、1 warning。[测试源码](https://github.com/simonw/alchemy-utils/blob/c2432fb580317dd6a8cdf3e3451a2fc6a85631f7/tests/test_introspection.py)与日志位置对应 DuckDB partial index skip。CI 通过不构成本轮复跑，也不验证作者的性能数字。

## 采用边界与仍未回答的问题

**[经验：本仓库源码分析]** 可采用的是“真实输入触发局部修改，并用旧行为反例约束优化”。不能从这个案例推导先拆子类总是最好、Codex 优于其他模型、TDD／并行调查各自带来多少收益，或 0.1a1 已具生产兼容性。多个改动共同发生，完整性能轨迹和逐项对照缺失。

**[社区：A2 同项目反例]** 公开对话结尾，Agent 承认重命名清理时把用户的未跟踪测试数据库移走，DuckDB 随后在原路径新建空库，schema 输出为空；用户给出实际命令后，Agent 报告恢复了原库。这里可见的是一次恢复报告，未见 create-on-read 的底层 UX 修复；也说明“初版测试通过”不涵盖工作区数据处理。未将该自述升级为本轮复现。

需要继续验证的是字段缺失／默认值在批内归一化后的兼容、全局 pandas-miss 缓存的并发影响，以及更长期维护。JSON／JSONL 仍物化，`alter=True` 与新表非流式输入仍需全量扫描；不能将 CSV 路径写成全 API 恒定内存保证。README 新旧限制的矛盾可以直接确认，但不是已报告用户因此出错。

## 为什么不继续扩写原候选

- **h3o [一手]**：[PR #11](https://github.com/simonw/research/pull/11)是 #10 次日的 Claude Code web 基准任务，合并 `52385971c815a457618a6b94b2ba939e87e04cad`。本轮查 `h3o-python` 的公开提交历史，只见初始实现、README 自动更新、该 PR 的 .gitignore 与后续 AI 说明；未找到绑定实现的后续维护，不将基准报告当成维护成本证据。此检索范围不能证明项目在其他地方没有使用。
- **BAML [一手]**：[PR #2259](https://github.com/BoundaryML/baml/pull/2259)已合并并披露 Claude Code；可见人的回复表示将随当晚发布。本轮没有取得同一实现的后续维护链，不把另一篇作者复盘拼成同项目结论。
- **herdr [一手／社区]**：[PR #52](https://github.com/arrrrny/herdr/pull/52)有真实上游同步与评审修复，但 owner 账号回复带自动修复任务标记；已读材料不足以确认具体 Codex 实现与人工纠正的归属。本例留作线索，不以账号类型代替作者身份核实。

这些只是本轮选材的已查范围；不是评价三个项目质量，也不要求每轮重新查一遍。下一项应补不同作者／用户情境或真实长期变更，避免同一作者的多篇材料被当作独立人群样本。
