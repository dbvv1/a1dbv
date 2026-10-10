# Codex 原生可选模板

核实时间：2026-10-10；🧪 试用。[经验] 适合需要中断恢复或独立审查的项目；简单改字不必采用。这里只有示例，未安装到任何用户配置，也未进行 Codex 运行时实测。

## 按需采用，不整包覆盖

[经验] 在目标项目审查、合并所需文件；不要覆盖已有配置或同名技能：

- [`.codex/config.toml.example`](.codex/config.toml.example)：合并到目标项目 `.codex/config.toml`，去掉 `.example` 后才作为配置使用
- [`.codex/agents/a1dbv_reviewer.toml`](.codex/agents/a1dbv_reviewer.toml)：可选审查角色，复制到目标项目同一路径
- [checkpoint-resume](.agents/skills/checkpoint-resume/SKILL.md)：复制整个技能目录到目标项目 `.agents/skills/checkpoint-resume/`，保存或恢复一次有实际中断成本的任务
- [verify-completion](.agents/skills/verify-completion/SKILL.md)：复制整个技能目录到目标项目 `.agents/skills/verify-completion/`，核对多项验收与当前版本证据

[一手] Codex 按当前目录到仓库根目录查找 `.agents/skills`；技能需要 `name` 和 `description`。`.claude/skills` 不等于 Codex 已发现的技能位置。这两个示例只用核心 frontmatter，不带 Claude 专属字段，保留默认技能选择行为；也可显式调用 `$checkpoint-resume` 或 `$verify-completion`。[Build skills](https://learn.chatgpt.com/docs/build-skills)

[经验] 技能正文不依赖此仓库的脚本或目录，复制后仍可独立使用。已有 `PROGRESS.md`、计划或任务记录时复用它，不另建同义状态文件。若项目确实需要机器验收，可另外参考 [long-task 示例](../long-task/task.example.json) 和 [通过记录](../long-task/fixtures/report.passing.json)；这些合成数据不是实际任务完成的证据。这里只补充人的判断与恢复步骤，不再实现一份验收器。

## 配置选择与边界

[经验] 此 profile 选择 Sol 6.1（`gpt-6.1-sol`）/ `high`，主 Agent 与子 Agent 一致；它不是所有任务的官方最优配置。并发上限 3 是此示例选择，是否值得并行要和单 Agent 对照。不要因复制示例而默认降低模型或改变已有偏好。

[一手] `[agents]` 的 `enabled`、`max_concurrent_threads_per_session`、`default_subagent_model`、`default_subagent_reasoning_effort` 按当前参考核实；并发数不含主线程。独立角色可放在 `.codex/agents/`，以 `name` 标识，不应再在另一种配置形式重复定义同名角色。[配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)、[Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)

[一手] reviewer 不指定模型和 effort，使用已解析的默认值；显式调用或角色覆盖仍可能改变它们。角色的 `read-only` 不能取代实际运行环境检查，父级实时权限覆盖可能优先。只读审查也不能承诺执行会写缓存或临时文件的测试。[Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)

[经验] 主配置不设置审批、沙箱、网络、信任、凭据或持久授权；reviewer 仅请求只读。发现测试需要写入时，交回已有相应授权的执行者。配置不安装工具，不授予发布或部署权限，也不假设 Goals、浏览器、子 Agent、网络和模型在目标环境可用。独立云任务、托管 Work 与 API 编排的能力应另行核实，不能把本地 TOML 当成它们的统一配置。

## 验证范围

[经验] 本次仅静态核对 TOML 语法、示例键、技能 frontmatter/目录命名和相对链接；不声称客户端已加载、模型可用或沙箱生效。文档核实日期不是最低客户端版本，不能外推为任意旧版兼容。

[经验] 采用者可在获授权的临时项目中记录 `codex --version`、实际模型/effort 和有效权限，验证配置加载、角色出现、允许读取与拒绝写入。无法运行时记录具体阻碍，不通过放宽权限来“修复”测试。恢复演练至少覆盖：失败后中断、改动后未验证、通过后又改动；观察是否保留失败、识别陈旧证据并选取相关复验。
