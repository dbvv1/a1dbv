# CLAUDE.md

@AGENTS.md

## Claude Code 专属

- 先按 AGENTS 核对已配置接口与验证入口。`unity-compile-check` / `unity-run-tests` 已采用且前提满足时才使用；否则沿用项目现有编译和测试命令。改 C# 后仍须编译，改逻辑后仍须运行相关测试，不把缺少 Skill 当作安装要求或跳过验证的理由。
- 需要修改场景、Prefab、`.meta`、ProjectSettings，或移动、删除资源前，已采用 `unity-safe-edit` 时先读；未采用时遵守 AGENTS 的硬性规则与项目已有资产规范，仍需先确认受保护操作。没有安全入口就停写并报告缺口。
- 编辑器打开时，用已配置的 Unity CLI（`unity status` / `unity recompile` / `unity command`）、MCP 或 Editor 脚本；不对同一工程另启 batchmode。没有相应入口时报告缺口，请用户关闭编辑器后用现有 batchmode，不自行安装连接。
- 可独立的大范围检索可交给 Explore；涉及 Unity 生命周期、资产引用或性能风险时，按问题选 `unity-code-reviewer` / `unity-perf-auditor`，不为每项修改固定叠加评审。
- 不确定 Unity API 的行为时查目标版本的官方文档或包源码；已配置官方 Skills、Context7 时可用，不为查询强装插件。
- 不需要我参与的步骤就继续做；只有在没有我就无法继续，或者要做破坏性操作（删除资源、改 ProjectSettings 或包依赖、强推）之前，才停下来问。
- 验证运行时行为时，已有 CLI 且当前 Pipeline 返回帧字段时，才用 `unity status --format json` 隔几秒查两次 `frameCount`；字段缺失不表示停帧，改用现有接口的帧/时间进度和测试结果。缺少观测就标明未验证，不只凭“已进入 Play 模式”或一张截图下结论。
- 长时间运行结束时，用 **Blocked on me / Changed / Found** 三个标题总结。
- 压缩上下文时，保留已修改文件清单和使用过的测试命令。
