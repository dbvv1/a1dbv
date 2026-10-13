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
| D7 分析推论校准 | 候选，未认领 | [研究队列](../research/BACKLOG.md) |
| D8 优化模式校验修复 | 已完成回归及限定审计 | [D5/D8 审计](reviews/2026-10-12-f551db7.md) |
| D9 实用工具独立模块 | 已发布来源评估；实机试用仍按需求 | [工具入口](../practical-tools/README.md) |
| 正文与审计分层 | 本轮完成 | 19/15/20/24 保留建议与关键反证，明细归 research |
| 协作减负 | 本轮完成 | 历史叙述[原样归档](archive/README.md)；不另建状态系统 |
| 长期任务二：领域契约增量 | 本轮完成 | [05 建议](../05-skills-and-plugins.md#领域增量输入形状和状态寿命比再检查一次具体)及[证据](../research/2026-10-13-domain-skill-contract.md)；下一真实任务再评价净收益 |
| 长期任务一：试用情境反馈 | 本轮完成来源研究 | [15 原型建议](../15-task-playbooks.md#10-原型和一次性脚本)及[原帖证据](../research/2026-10-13-prototype-feedback.md)；修改后效果仍待验证 |
| workflow-ablation 先导 | 跳过 | 预算未填写，0 轮新模型运行 |

## 进行中的任务

- **下一选题。** 寻找公开补丁及第二次试用反馈的案例，或接收方实际接管过程；不重复已完成的领域契约探测。
- **发布检查。** 每项运行 `python3 scripts/check_offline.py`、`git diff --check`，随后非强制快进 main 或走 PR；hosted CI 以精确提交实际状态为准，历史计费阻塞未解决，离线通过不当作 CI 通过。

后续从[四条长期任务](../research/BACKLOG.md#四条长期任务以真实开发结果组织研究)选有价值的缺口；无新证据就不制造提交。分支协作见[说明](README.md)。
