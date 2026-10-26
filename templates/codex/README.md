# Codex 原生可选模板

> 核实时间：2026-10-10；2026-10-15（UTC+8）复核 reviewer 权限边界；🧪 试用。示例未安装到任何用户配置，未进行 Codex 运行时实测。

**已有配置先保留；任务确有中断恢复或独立审查缺口时，只合并对应组件。** 简单改字不用采用整包。已有 `PROGRESS.md`、计划或任务记录就复用它，Skill 正文复制后可独立使用，不依赖本仓库脚本或目录。

## 按需采用，不整包覆盖

| 当前需要 | 选哪个文件、放在哪里 |
|---|---|
| 调整项目的 Codex 配置 | 审查 [`.codex/config.toml.example`](.codex/config.toml.example)，只合并所需项到目标项目 `.codex/config.toml`；去掉 `.example` 后才作为配置使用 |
| 独立审查角色 | 按需复制 [`.codex/agents/a1dbv_reviewer.toml`](.codex/agents/a1dbv_reviewer.toml) 到目标项目同一路径，先核下节的有效权限 |
| 保存或恢复一次有实际中断成本的任务 | 复制整个 [checkpoint-resume](.agents/skills/checkpoint-resume/SKILL.md) 技能目录到 `.agents/skills/checkpoint-resume/` |
| 核对多项验收与当前版本证据 | 复制整个 [verify-completion](.agents/skills/verify-completion/SKILL.md) 技能目录到 `.agents/skills/verify-completion/` |

已有同名配置或技能时先比差异再合并。Codex 按当前目录到仓库根目录查找 `.agents/skills`，技能需要 `name` 和 `description`；仅有 `.claude/skills` 不表示 Codex 已发现。两个示例只用核心 frontmatter，不带 Claude 专属字段，保留默认技能选择行为；也可显式调用 `$checkpoint-resume` 或 `$verify-completion`。

确实需要机器验收时，另看 [long-task 示例](../long-task/task.example.json) 和 [通过记录](../long-task/fixtures/report.passing.json)。它们是合成数据，不是实际任务完成证据；本组 Skill 只补人的判断与恢复步骤，不另做验收器。

**依据**：[一手] [Build skills](https://learn.chatgpt.com/docs/build-skills)；[经验] 按需合并、沿用现有记录与示例分工。

## 配置选择与边界

**先核模型、并发和权限的实际值，再决定是否采用示例配置。** 此 profile 选择 Sol 6.1（`gpt-6.1-sol`）/ `high`，主 Agent 与子 Agent 一致；并发上限 3 不含主线程。这是示例选择，不是所有任务的官方最优配置；是否值得并行应与单 Agent 对照，已有模型或偏好不因复制而改变。

| 配置责任 | 采用方式 |
|---|---|
| 主配置的子 Agent 默认值 | `[agents]` 的 `enabled`、`max_concurrent_threads_per_session`、`default_subagent_model`、`default_subagent_reasoning_effort` 按当前参考核实 |
| 独立角色 | 放在 `.codex/agents/`，以 `name` 标识；同名角色只保留一种配置定义 |
| reviewer 的模型与 effort | 角色不指定，使用已解析默认值；显式调用或角色覆盖仍可能改变它们 |
| reviewer 的只读边界 | 由父会话／宿主的有效权限保证硬性只读。角色仅请求只读，发现测试需要写入时交回已有相应授权的执行者；也不能承诺执行会写缓存或临时文件的测试 |

Codex 0.162.1 虽可解析角色文件的 `sandbox_mode`／`approval_policy`，角色应用路径却不投影这些字段；模板已移除无效的 `sandbox_mode`。只读指令仍只是行为约定，见 [08 的固定实现与采用边界](../../docs/08-multi-agent.md#51-codex-子-agent配置作用域先于人数)。

主配置不设置审批、沙箱、网络、信任、凭据或持久授权，不安装工具，也不授予发布或部署权限。采用前另核目标环境是否提供 Goals、浏览器、子 Agent、网络和模型；独立云任务、托管 Work 与 API 编排各有能力边界，本地 TOML 不是统一配置。

**依据**：[一手] [配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)、[Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)；[经验] 示例配置与权限分工。

## 验证范围

**在获授权的临时项目中，先核加载与权限，再演练恢复。** 记录 `codex --version`、实际模型/effort 和有效权限，验证配置加载、角色出现、允许读取与拒绝写入。运行受阻就记录具体阻碍，保留权限边界。

恢复演练至少覆盖失败后中断、改动后未验证、通过后又改动三种状态；观察是否保留失败、识别陈旧证据并选取相关复验。

本仓本次只静态核对 TOML 语法、示例键、技能 frontmatter/目录命名和相对链接；客户端加载、模型可用与沙箱生效仍待目标环境验证。文档核实日期不是最低客户端版本，也不表示任意旧版兼容。

**依据**：[经验] 静态核对范围与目标环境验收建议。
