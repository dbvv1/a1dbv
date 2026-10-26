# 写作实用比较：先给场景中的动作

**需要补限定时，先说清读者在哪个场景会做错，再给能照做的动作。** 本仓在一份真实在制稿中合并重复的 CLI 提醒，将条件改成场景动作，并把升级后的取数选择移到首段与对应表格行；这套改法已用于本次写作，现放进 [评审选择](../../docs/09-review-and-quality.md#限定语挡住做法时先写读者动作)和 [REVIEW 模板](../../templates/generic/REVIEW.md)。

比较 [旧稿](before.md) 与 [新稿](after.md)：小节非空白 Markdown 字符少 105（约 10.1%），原有 13 项事实与条件保留。两份是 **SDK 取数文档的写作素材，SDK 未运行**；这里交付的是改稿方法。

## 同口径结果

只量两稿 `### 3.3` 标题之后、`**依据**：` 之前的正文，先去掉正文首尾空白；含表格与 Markdown 标记，排除标题、来源段及本页说明。非空白数为 Python `len(re.sub(r"\s", "", body))`，计 Unicode 码点；固定词用 `body.count(word)` 非重叠计数。叙述段按空行分块、排除表格块；两稿均由叙述段和表格构成，叙述段少一段。

| 项目 | 旧稿 | 新稿 |
|---|---:|---:|
| 非空白 Markdown 字符 | 1042 | 937 |
| 含空白 Markdown 字符 | 1137 | 1028 |
| 叙述段 | 4 | 3 |
| 表格块／表头／数据行 | 1／1／4 | 1／1／4 |
| 固定词：不等于／不代表／未证明／不能／不要 | 1／0／0／2／1 | 0／0／0／1／0 |

固定来源版本为旧稿 `d61622a2219198fd152a6c162e08903ec64e8b8f`、新稿 `b4dbd28042d0847f501bbc6da17a3bceb0a5cb6c` 的在制 §3.3；本目录保存其计数正文逐字快照，读者无需取得原在制分支。原修订中，小节外正文与来源段逐字未变；搬入样本时只将来源段的研究相对链接改接本页固定来源。

**范围：** 五词次数只描述这五个字面表达，字符数是原始 Markdown 的体量。原正文文件净少 109 个含空白 Unicode 字符，同批研究说明净增 902，整批净增 793；此处没有测理解速度、净工时、费用或模型能力。

## 读者检查与事实保全

同一新上下文先只读新首段并锁定答案，再读全节回答复合问题。首段答案包括独立调用加最终总计、CLI 2.1.277 起正常退出并保存后恢复取最新累计，以及先核实际 CLI；全节再答多轮、重置、fork、未知起点、崩溃、Python 接线与角色分账。旧首段只给版本检查与字段范围，取数选择要继续读表格；已看过全节的首轮首段回执排除。下列 13 项事实另由未参与改稿者核对；读者答案与事实核对分别留存。

| 项 | 保全内容 | 新稿位置 |
|---|---|---|
| F1 | 核实际 CLI；费用估算含子 Agent，用于开发比较，账单／额度另查 | 首段、末段 |
| F2 | 全树 token 用 `modelUsage`／`model_usage`；`usage` 为当前轮主流程 | 首段 |
| F3 | 未用 `resume`／`continue` 的独立调用加最终总计；单调用多轮先收口 | 表格独立调用行 |
| F4 | 未清空的 streaming 多轮为运行累计，取最新 `result` | 表格 streaming 行 |
| F5 | 三个清空命令归零；封存重置前末值加末段，重置自己的结果属新段 | 表格清空行 |
| F6 | CLI 2.1.277 起，正常退出且已保存的恢复／fork 继承旧累计；共同历史计一次 | 首段、表格恢复行 |
| F7 | 此前 headless／SDK 恢复从零累计；升级要改原跨调用求和逻辑 | 表格恢复行 |
| F8 | 新增投入扣已确认起点；未知保留缺口 | 末段 |
| F9 | 崩溃可能未保存，错误末值可能清零；保留有效读数并走官方恢复 | 末段 |
| F10 | Python 0.2.137 起接收重置事件，旧版跟踪命令；事件属旧 ID，新 ID 读后续消息而非 `new_conversation_id` | Python 段 |
| F11 | 固定 SDK 0.2.174 捆绑 CLI 2.1.310；`cli_path` 可覆盖，仍核实际启动文件 | Python 段 |
| F12 | 同模型主／子合桶；`TaskUsage.total_tokens` 角色费用依据待核，按任务选模型而非为遥测换模型 | 末段 |
| F13 | 原核实日期、官方／固定源码／使用者反馈的类型，以及 SDK／模型与账户用量的未运行范围 | 依据段 |

## 后续生产使用：收件箱入口

**把决定移到前列后，再删掉两列之间重复的触发条件。** 本仓随后把这套写法用于[当次前沿收件箱](https://github.com/dbvv1/a1dbv/blob/7beb6e5ea45f81c7c58d93f09c43f04d5680ec96/docs/collaboration/inbox.md)的 13 项真实入口。非作者先只读候选逐项回答选择、状态和下一步，再核事实；41 个原链接及决定性条件保留。但[首份候选](https://github.com/dbvv1/a1dbv/commit/82b00a56cc60beaf061225b733cdb24d374641aa)把部分条件写了两遍，不能只因答案正确就认定改写减负成功。

同口径统计 13 条数据行，去首尾 `|` 后三列以 ` | ` 连接，行间换行，含 Markdown 与 URL，去所有空白：原入口 5544，首候选 5999（增加 455，8.21%）。负责人仅修 anymd、show-me、lights-on 和 usage-guard 四处已发现的问题，去重复或校正动作，修后 5917（仍比原入口增加 373，6.73%）。结构改进是决定与状态前置，长度目标未实现；原稿到新稿还补入 anymd 后续修复与目录条件，不能把全部增字都归于同义重复。未测阅读时长，也没有新增工具试用。

## 写法来源

- **Codex：明确影响场景，给可行动的最小修正。** 固定提交 `970111f6` 的 [review rubric](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/prompts/templates/review/rubric.md)要求说明具体受影响对象、触发场景与可行动问题；它经 [REVIEW_PROMPT](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/prompts/src/review_request.rs#L8-L9)装配，由 [review task](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/tasks/review.rs#L118-L138)设为实际审查指令。本稿将这项审查原则借用为场景动作，合并重复版本提醒。
- **OpenClaw：先给用户结果，保留可见的迁移动作。** 固定提交 `8decb216` 的 [PR 模板](https://github.com/openclaw/openclaw/blob/8decb216f9eede2fce8537df9e899f0ffcb12727/.github/pull_request_template.md#L22-L47)先写具体问题与用户结果，再解释原因；[维护 Skill](https://github.com/openclaw/openclaw/blob/8decb216f9eede2fce8537df9e899f0ffcb12727/.agents/skills/openclaw-pr-maintainer/SKILL.md#L62)明确要求按当前模板保持迁移与必要动作可见。本稿把取数动作提前，把升级逻辑紧贴恢复行。

以上固定配置说明写法出处，本仓结果来自上面的真实改稿；两种来源都没有提供本仓写作收益的上游实验。核读与试用 2026-10-26。

## 素材来源

SDK 素材沿用 2026-10-26 核实日期与来源类型：官方[跨调用累计](https://code.claude.com/docs/en/agent-sdk/cost-tracking#accumulate-costs-across-multiple-calls)、[streaming input](https://code.claude.com/docs/en/agent-sdk/cost-tracking#track-costs-in-streaming-input-mode)、[总计范围](https://code.claude.com/docs/en/agent-sdk/cost-tracking#get-the-total-cost-of-a-query)、[CLI 2.1.277 release](https://github.com/anthropics/claude-code/releases/tag/v2.1.277)；固定 Python 提交 `0e89b298` 的 [CHANGELOG](https://github.com/anthropics/claude-agent-sdk-python/blob/0e89b298e771259378a6cd3734e00d323dff5703/CHANGELOG.md#L273-L277)、[包版本](https://github.com/anthropics/claude-agent-sdk-python/blob/0e89b298e771259378a6cd3734e00d323dff5703/pyproject.toml#L5-L7)、[重置类型](https://github.com/anthropics/claude-agent-sdk-python/blob/0e89b298e771259378a6cd3734e00d323dff5703/src/claude_agent_sdk/types.py#L1793-L1817)、[parser](https://github.com/anthropics/claude-agent-sdk-python/blob/0e89b298e771259378a6cd3734e00d323dff5703/src/claude_agent_sdk/_internal/message_parser.py#L309-L340)、[重置分支](https://github.com/anthropics/claude-agent-sdk-python/blob/0e89b298e771259378a6cd3734e00d323dff5703/src/claude_agent_sdk/_internal/message_parser.py#L378-L389)、[CLI 选择](https://github.com/anthropics/claude-agent-sdk-python/blob/0e89b298e771259378a6cd3734e00d323dff5703/src/claude_agent_sdk/_internal/transport/subprocess_cli.py#L237-L260)、[TaskUsage](https://github.com/anthropics/claude-agent-sdk-python/blob/0e89b298e771259378a6cd3734e00d323dff5703/src/claude_agent_sdk/types.py#L1516-L1521)；使用者 [TypeScript #293](https://github.com/anthropics/claude-agent-sdk-typescript/issues/293)。parser 支持字段传输与可见性；多个 fork 共用历史计一次是恢复契约的采用推论，#293 是角色分账诉求。SDK、模型与账户用量均未运行或采集。
