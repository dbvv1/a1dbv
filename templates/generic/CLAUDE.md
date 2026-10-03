# CLAUDE.md

@AGENTS.md

## Claude Code 专属

- 一句话能描述的改动直接做；涉及多个文件或方案不确定时，先在 Plan 模式出计划。
- 大范围调查交给子 Agent，只把结论带回主会话。
- 宣布完成前，先用 `verifier` 子 Agent 独立核对；提交前可以用 `code-reviewer` 子 Agent 评审。
- 大功能先用 `/spec-interview` 整理需求；上下文快满或要换会话时用 `/handoff`。
- 压缩上下文时，保留已修改文件的清单、关键决策和使用过的测试命令。
