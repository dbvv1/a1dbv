# CLAUDE.md

@AGENTS.md

## Claude Code 专属

- 改动 C# 后使用 `unity-compile-check` skill 验证；逻辑改动后使用 `unity-run-tests` skill。
- 需要修改场景 / Prefab / `.meta` / ProjectSettings 时，先阅读 `unity-safe-edit` skill。
- 大范围检索交给 Explore 子 Agent；完成功能后可调用 `unity-code-reviewer` / `unity-perf-auditor` 子 Agent 评审。
- 编辑器处于打开状态时，优先通过 Unity MCP / Unity CLI 读取 Console、运行测试，而不是 batchmode（会因项目被锁定而失败）。
- 不确定某个 Unity API 的行为时，查询文档（Unity 官方插件 Skills / Context7）而不是猜测。
