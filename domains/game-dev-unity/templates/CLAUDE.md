# CLAUDE.md

@AGENTS.md

## Claude Code 专属

- 改完 C# 后用 `unity-compile-check` Skill 验证；改了逻辑后用 `unity-run-tests` Skill 跑测试。
- 需要修改场景、Prefab、`.meta`、ProjectSettings，或移动、删除资源前，先读 `unity-safe-edit` Skill。
- 编辑器打开时，优先用 Unity CLI（`unity status` / `unity recompile` / `unity command`）或 Unity MCP 操作编辑器；batchmode 会因为项目被锁而失败。
- 大范围检索交给 Explore 子 Agent；功能完成后让 `unity-code-reviewer` / `unity-perf-auditor` 子 Agent 评审。
- 不确定 Unity API 的行为时查文档（Unity 官方插件的 Skills、Context7），不要猜。
- 不需要我参与的步骤就继续做；只有在没有我就无法继续，或者要做破坏性操作（删除资源、改 ProjectSettings 或包依赖、强推）之前，才停下来问。
- 验证运行时行为时，用 `unity status --format json` 隔几秒查两次 `frameCount`，帧数增加了才算游戏在运行；不要只凭“已进入 Play 模式”或一张截图下结论。
- 长时间运行结束时，用 **Blocked on me / Changed / Found** 三个标题总结。
- 压缩上下文时，保留已修改文件清单和使用过的测试命令。
