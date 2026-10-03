# 落地路线图

> 目标：让 AI 从“聊天问答”逐步升级为“能在大型项目里独立完成可验证任务的工程伙伴”。
> 每一阶段都要能**验证效果**再进入下一阶段，不要一次性把所有东西都装上。

## 阶段 0：基础盘（1 天）

- [ ] 选一个主力 Agent（推荐 Claude Code，备选 Codex CLI），一个主力 IDE（Rider / VS Code / Cursor）。
- [ ] 项目根目录写 `CLAUDE.md`（或 `AGENTS.md`）：项目简介、目录结构、构建/测试命令、禁区。→ 模板见 [`templates/unity/CLAUDE.md`](../templates/unity/CLAUDE.md)
- [ ] 配好 `.gitignore`，确保 AI 能用 git 回滚（**AI 改动之前一定有干净的提交点**）。
- [ ] 全局个人偏好写进 `~/.claude/CLAUDE.md`。→ 模板见 [`templates/global/CLAUDE.md`](../templates/global/CLAUDE.md)

## 阶段 1：让 AI “看得见”（1 周）

AI 写错代码的首要原因是**看不到真实状态**。

- [ ] **代码语义**：装 C# LSP（Claude Code 插件 `csharp-lsp` 或 Roslyn LSP），让 Agent 能跳定义、查引用、拿诊断。
- [ ] **编译反馈**：能在命令行编译 Unity 项目并拿到错误日志（见 [`unity/02-large-project-guide.md`](../unity/02-large-project-guide.md)）。
- [ ] **编辑器状态**：接入 Unity 官方 MCP / Unity CLI，或社区 MCP（`unity-mcp` 等），让 Agent 能读 Console、场景层级、运行测试。
- [ ] **最新文档**：接入 Context7 一类文档 MCP，避免 API 幻觉。

## 阶段 2：让 AI “可验证”（2 周）

- [ ] 补齐 EditMode / PlayMode 测试，让 Agent 每次改完自己跑测试。
- [ ] 加 Hooks：编辑后自动格式化/检查；禁止改 `Library/`、`*.meta` 等。→ [`templates/unity/.claude/`](../templates/unity/.claude/)
- [ ] 写项目专属 Skill：`unity-compile-check`、`unity-run-tests`、项目规范等。
- [ ] 建立“探索 → 计划 → 实现 → 验证”的固定节奏（Plan 模式 + 测试）。

## 阶段 3：让 AI “可扩展”（持续）

- [ ] Subagent 分工：代码评审、性能审计、资源/序列化检查。
- [ ] Spec 驱动：较大功能先写规格（Spec Kit / 自建模板），再分任务实现。
- [ ] 并行：git worktree + 多 Agent 并行做互不相关的任务。
- [ ] AI 代码评审进 CI（Claude Code GitHub Action / Codex / Copilot / Cursor Bugbot 等）。
- [ ] 资产管线：AI 生成占位美术/音效，加速原型。→ [`unity/03-asset-generation.md`](../unity/03-asset-generation.md)

## 阶段 4：度量与沉淀

- [ ] 记录哪些任务 AI 做得好/差，更新 `CLAUDE.md` 与 Skills（**把每次纠错变成规则**）。
- [ ] 用 `/skill-doctor`、插件评测（`claude plugin eval`）评估 Skill 的上下文成本与效果。
- [ ] 定期清理：不用的 MCP、过时的 Skill 都会占上下文。
