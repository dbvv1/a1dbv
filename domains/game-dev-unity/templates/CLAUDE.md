# CLAUDE.md

@AGENTS.md

## Claude Code 专属

- 改完 C# 后用 `unity-compile-check` Skill 验证；改了逻辑后用 `unity-run-tests` Skill 跑测试。
- 需要修改场景、Prefab、`.meta`、ProjectSettings，或移动、删除资源前，先读 `unity-safe-edit` Skill。
- 编辑器打开时，优先用 Unity CLI（`unity status` / `unity recompile` / `unity command`）或 Unity MCP 操作编辑器；batchmode 会因为项目被锁而失败。
- 大范围检索交给 Explore 子 Agent；功能完成后让 `unity-code-reviewer` / `unity-perf-auditor` 子 Agent 评审。
- 不确定 Unity API 的行为时查文档（Unity 官方插件的 Skills、Context7），不要猜。
- 压缩上下文时，保留已修改文件清单和使用过的测试命令。
