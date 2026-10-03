# 工作流方法论

## 1. 上下文工程（Context Engineering）

> 模型能力已经足够强，**效果差通常是上下文差**：给少了会瞎猜，给多了会分心。

- **给对的信息**：任务目标、验收标准、相关文件路径、约束。
- **拿掉无关的**：不用的 MCP、过长的 CLAUDE.md、早已完成的对话（`/clear`）。
- **外置记忆**：大任务把计划/进度写到 `PLAN.md` / `TODO.md`，跨会话可接续。
- **用子 Agent 吸收噪音**：大范围检索交给 Explore 子 Agent，只把结论带回主会话。

## 2. 标准节奏：探索 → 计划 → 实现 → 验证

1. **探索**：“先读 X、Y 模块，不要写代码，告诉我现在的数据流。”
2. **计划**：Plan 模式出方案；人审方案（这一步最省钱）。
3. **实现**：小步提交，每步可编译。
4. **验证**：编译 + 测试 + （必要时）编辑器内实机检查；让 Agent 自己跑并修到通过。

## 3. 测试驱动（TDD）与 AI

- 先让 AI 写**失败的测试**，确认测试真的失败，再实现。
- 告诉 AI “不要修改测试来让它通过”。
- Unity：EditMode 测试跑得快，优先把逻辑抽到纯 C#（非 MonoBehaviour）类里以便测试。

## 4. Spec 驱动开发（SDD）

较大功能先写规格，再拆任务实现：

| 工具 | 风格 |
|---|---|
| [GitHub Spec Kit](https://github.com/github/spec-kit) | Constitution → Specify → Clarify → Plan → Tasks → Implement，最主流 |
| [Kiro](https://kiro.dev) | AWS 的 Spec 驱动 IDE，EARS 需求格式 |
| [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | 模拟敏捷团队多角色（分析师/PM/架构师/开发），产物最重 |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | 轻量，偏增量变更 |

> 游戏开发建议：**玩法原型阶段不要上重型 SDD**（需求变化太快）；系统/工具/管线类功能（存档、网络同步、打包工具）适合 SDD。

## 5. 并行 Agent

- **git worktree**：每个 Agent 一个独立工作目录 + 分支，互不干扰。
  - ⚠️ Unity 注意：每个 worktree 打开 Unity 都要重建 `Library/`（很慢、很占盘）。**纯代码任务**适合并行；需要编辑器的任务尽量串行或用专门的 worktree 长期保留 Library。
- 工具：[Conductor](https://conductor.build)（macOS 桌面）、[Claude Squad](https://github.com/smtg-ai/claude-squad)（tmux TUI）、[Vibe Kanban](https://github.com/BloopAI/vibe-kanban)（开源看板，⚠️ 2026 已宣布停止维护）。
- 云端：Claude Code on the web、Codex Cloud、Cursor Cloud Agents——适合不依赖本地编辑器的任务。
- 原则：**任务互相独立才并行**；共享文件多的任务并行只会制造冲突。

## 6. AI 代码评审

- 本地：`/code-review`、`/security-review`，或自建评审 Subagent（见模板）。
- CI：Claude Code GitHub Action、Cursor Bugbot、Copilot Review、CodeRabbit 等。
- **交叉评审**：Claude 写的让 Codex 评，反之亦然，能发现单一模型的盲区。

## 7. 把纠错沉淀下来

每当你纠正 AI 一次：
1. 是**项目事实**？→ 写进 `CLAUDE.md`。
2. 是**操作流程**？→ 写成 Skill。
3. 是**必须强制**的？→ 写成 Hook。
4. 是**某类审查**？→ 写成 Subagent。

## 参考

- [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices)
- [The Code Agent Orchestra – Addy Osmani](https://addyosmani.com/blog/code-agent-orchestra/)
- [Spec-Driven Development Tools 2026 – Augment](https://www.augmentcode.com/tools/best-spec-driven-development-tools)
