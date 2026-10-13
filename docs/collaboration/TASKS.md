# 跨端任务

> 更新：2026-10-13（UTC+8）。dot 主导方向与实施，Claude、云端 Codex 提供补充。结果与验证写在同一项提交中；不单独提交认领或发布回执。

## 状态表

| 任务 | 当前状态 | 结果入口 |
|---|---|---|
| D1 审批与权限边界 | 已完成限定修订 | [历史审计](reviews/2026-10-11-4946f93.md) |
| D2 E1 缓存归因与分项 | Claude 已完成，不重做 | [19 §3.1](../19-experiments.md#31-补测用-context-分项2026-10-12)；22.9k 来自补测，原 E1 不是精确拆分 |
| D3 双方历史整合 | 已合入 main | [main](https://github.com/dbvv1/a1dbv/tree/main)；保留普通合并历史 |
| D4 两条演化案例 | 已有结果，对端限定审计通过 | [54083033 审计](reviews/2026-10-12-5408303.md)；SQLite [完整程序与原输出](../../experiments/alchemy-batch-semantics/README.md)已补交并重新核对，原审计不覆盖工具模块 |
| D5 任务建议校准 | 已完成 | [任务打法](../15-task-playbooks.md) |
| D6 最小输入与能力触发 | 本轮完成，五情境走读通过 | [Codex §6](../01-agents/codex.md#6-主力使用从实际问题选择方法) → [15](../15-task-playbooks.md) |
| D7 分析推论校准 | 云端完成本轮限定修订，待对端复审 | [331e093 整体评估](reviews/2026-10-13-331e093.md)：模板覆盖已复现并移除用法；默认流程、成熟度与撤回数字同步校准，未全面重验事实 |
| D8 优化模式校验修复 | 已完成回归及限定审计 | [D5/D8 审计](reviews/2026-10-12-f551db7.md) |
| D9 实用工具独立模块 | 已发布来源评估；实机试用仍按需求 | [工具入口](../practical-tools/README.md) |
| 正文与审计分层 | 本轮完成 | 19/15/20/24 保留建议与关键反证，明细归 research |
| 协作减负 | 本轮完成 | 历史叙述[原样归档](archive/README.md)；不另建状态系统 |
| 长期任务二：领域契约增量 | 本轮完成 | [05 建议](../05-skills-and-plugins.md#领域增量输入形状和状态寿命比再检查一次具体)及[证据](../research/2026-10-13-domain-skill-contract.md)；下一真实任务再评价净收益 |
| 长期任务一：试用情境反馈 | 本轮完成来源研究 | [15 原型建议](../15-task-playbooks.md#10-原型和一次性脚本)及[原帖证据](../research/2026-10-13-prototype-feedback.md)；修改后效果仍待验证 |
| 云预算承诺校准 | 本轮完成官方来源核对与正文修订 | [采用建议](../18-team-adoption.md#5-成本治理)及[范围证据](../research/2026-10-13-cloud-spend-boundaries.md)；区分 AWS 项目税前上限、GCP 服务级停用与普通预算告警 |
| 长期任务四：接收意见到最终代码 | 本轮来源研究完成 | [Immich 证据链](../research/2026-10-13-immich-handover.md)；最终行为解释与历史回复对齐，未测生产力或真机恢复 |
| 长期任务一：反馈到取舍与回滚 | 本轮源码研究完成 | [CodexIsland](../research/2026-10-13-codex-island-feedback.md)；保留数据口径、视觉反馈归属与未复测边界 |
| 长期任务一：独立使用与产品采用 | 来源与固定代码核对完成 | [Handy](../research/2026-10-13-handy-retest-adoption.md)；社区实际构建使用与维护者 UX/支持决策分开，非本仓实机测试 |
| 长期任务四：合并后的维护修订 | 固定补丁与断言核对完成 | [oMLX](../research/2026-10-13-omlx-postmerge.md)；接管后补能力探针和缓存隔离，合法降级仍有性能边界 |
| 长期任务二：上下文工具边界 | 固定源码与官方测试阅读完成 | [检索工具选择](../research/2026-10-13-context-tool-choice.md)；撤回 LSP 无条件替代阅读／搜索，不声称模型收益 |
| 工具模块：文档版本承诺 | 源码与原帖核对完成 | [Context7](../research/2026-10-13-context7-version-boundary.md)；近邻版本不算已验证兼容，生成摘要与项目原文分开核对 |
| 长期任务二：上下文研究范围 | 全文／公开产物核查与只读算术完成 | [Context Files 复核](../research/2026-10-13-context-study-reassessment.md)；收窄失败归因，补 E5 过滤依据及 clip 参数含义 |
| 长期任务二：效率收益的验收边界 | 全文／公开附录只读复算完成 | [AGENTS 效率证据](../research/2026-10-13-agents-efficiency.md)；有效分母、不同估计量和正确性未评估分别记录 |
| 长期任务四：接收渠道政策 | 官方规则／制定讨论／执行案例核对完成 | [Godot](../research/2026-10-13-godot-contribution-policy.md)；披露不代替准入，贡献与资产商店规则分开 |
| 游戏资产的修改边界 | 14:17（UTC+8）本轮完成，限定复核通过 | [证据与反例](../research/2026-10-13-game-asset-editing-boundary.md)；分支 `dot/asset-editing-boundary-20261013`，起点 `2b0a142`；完整离线 14 阶段及 `git diff --check` 通过，未运行真实引擎 |
| 浏览器测试自修复边界 | 14:21（UTC+8）来源与局部运行完成，限定复核通过 | [固定来源与反例](../research/2026-10-13-browser-healing-outcomes.md)；分支 `dot/browser-healing-20261013`，起点 `b9fddfb`；完整离线 14 阶段及 `git diff --check` 通过，区分修复通过与缺陷隔离，未运行真实模型修复 |
| 工具模块：会话用量指标 | 本轮固定源码与上游测试阅读完成，限定复核通过 | [指标与落盘证据](../research/2026-10-13-session-usage-metrics.md)；分支 `dot/session-usage-metrics-20261013`，起点 `994d08d`；完整离线 14 阶段及 `git diff --check` 通过；明确整轮吞吐与纯生成速度区别，未运行 ccusage |
| 云端增量审计与缓存排查 | 14:48（UTC+8）dot 独立复核通过，整合中 | [b9fddfb 审计](reviews/2026-10-13-b9fddfb.md)；oMLX 54 行结果由 dot 侧重新取固定源码独立复跑，逐字一致；保留对端 Immich 限定审计；整合树完整离线通过，未测真实缓存，不代表整仓审计 |
| workflow-ablation 先导 | 跳过 | 预算未填写，0 轮新模型运行 |

## 进行中的任务

- **窄 Skill 实际实现选择。** 找公开需求／补丁／反馈链，区分新知识与流程开销。
- **发布检查。** 每项运行 `python3 scripts/check_offline.py`、`git diff --check`，随后非强制快进 main 或走 PR；hosted CI 以精确提交实际状态为准，历史计费阻塞未解决，离线通过不当作 CI 通过。

后续从[四条长期任务](../research/BACKLOG.md#四条长期任务以真实开发结果组织研究)选有价值的缺口；无新证据就不制造提交。分支协作见[说明](README.md)。
