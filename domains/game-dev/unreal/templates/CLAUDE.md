# CLAUDE.md

@AGENTS.md

## Claude Code 专属

- 操作编辑器、资产、关卡、蓝图时使用 `unreal-mcp` Skill（Epic 官方插件）：先用 `describe_toolset` 确认工具签名，再用 `call_tool`；有依赖关系的修改**串行**执行。
- 开始不熟悉的工作前，先通过 `AgentSkillToolset.ListSkills` 查看项目在引擎里注册的 Agent Skill，相关的就加载并遵循。
- PIE 正在运行时，很多编辑器工具的行为会变；结果不对时先检查 PIE 状态。
- 编译：只改了 `.cpp` 函数体 → MCP Live Coding；其他情况 → `ue-build` Skill。改完逻辑 → `ue-run-tests` Skill。
- 探索性的资产修改，优先请我在编辑器里开一个 Sandbox（UE 5.8+），确认后再合回项目。
- 大范围检索交给 Explore 子 Agent；功能完成后让 `ue-code-reviewer` 子 Agent 评审。
- 不需要我参与的步骤就继续做；只有在没有我就无法继续（比如需要关闭或重启编辑器），或者要做破坏性操作（批量修改资产、改 Config 或 `.uproject`、强推）之前，才停下来问。
- 长时间运行结束时，用 **Blocked on me / Changed / Found** 三个标题总结。
- 压缩上下文时，保留已修改文件清单、是否需要重启编辑器，以及使用过的编译和测试命令。
