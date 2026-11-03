# A-REVIEW-RUBRIC-FACTS-20261103 · Codex 审查 rubric 的原文与装配

**结论：页面借用的 rubric 原句、`review_request.rs` 的读入点和 `core/src/tasks/review.rs` 的基础指令装配都成立；固定 SHA、当前稳定版与当日 main 上这三份文件逐字节相同，原链接和结论不需要改。需要限定的是范围：rubric 只由 `ReviewTask` 设为一次性审查子线程的基础指令，用户消息是 `review_request.rs` 按 review 目标生成的提示（Custom 时为用户指令）；guardian 审批复核与仓库内 `.github` 的 PR 审查提示是另外的指令源。引用句是“finding 是否成立”的判定门槛，本页把它类比到实现取舍；rubric 本身不评价实现阶段是否该删除防御机制，也不提供提示词效果证据。**

**输入版本：** 固定页 [docs/decisions/codex-overengineering.md](../../../../decisions/codex-overengineering.md)@`5ebecac1`，blob `261879bdfc10e751586d1be921cb3fef086ad9ff`，90 行，与任务内联全文一致。Codex 固定 SHA `970111f6cb62cc02fe36a82ea7d71b37a2889c97`（提交时间 2026-10-23T18:50:54Z）；当前稳定版 `rust-v0.166.0`（2026-10-29 发布，标签指向 `6ff1e1ca3b30fc8b914720681fcf5fe62e95f856`）；`main` `036e160181cf27a3e7f31eea7409bc5f266434e7`（2026-11-03T01:18:58Z）。读取日 2026-11-03。

## 影响页面主张的差量

1. **三份来源没有实质变化。** 页面引用的 rubric 原句、`review_request.rs#L8-L9` 和 `core/src/tasks/review.rs#L118-L139` 在固定 SHA、稳定版与当日 main 上内容相同；页面写的“2026-10-26 重核，rubric 与当日 main 相同”也能核对：10-26 零时前 main 的最新提交就是 `970111f6`，且三个文件自 2026-07-21／06-01／10-10 起未再改动。原链接可保留。
2. **“读入”是编译期嵌入，真正附加在 `ReviewTask`。** `review_request.rs` 只有 `include_str!` 常量，运行时按目标生成的提示里不含 rubric；rubric 由 `core/src/tasks/review.rs` 设为审查子线程的 `base_instructions`。读者若把“读入”理解成每次 review 都从磁盘读文件，或以为 `review_request.rs` 拼好了完整提示，会看错入口。
3. **rubric 的覆盖范围只是 `Op::Review` 发起的用户审查。** CLI `codex review`、app-server `review/start` 落到同一个 `Op::Review` 处理；guardian 审批复核用另一套 `GuardianPolicyInstructions`（`core/src/guardian/reviewer_config.rs#L41-L68` 渲染后设为 `base_instructions`），仓库内 `.github/codex/labels/codex-review.md` 是独立的 PR 审查任务提示。不能把“仓库里有这份 rubric”升级为所有审查入口都采用。
4. **引用句是 finding 门槛，不是实现规则。** 它属于 rubric 开头八条“是否值得标为 bug”的默认准则，且这段自述可被更具体的开发者／用户／文件指令覆盖；rubric 没有说实现时要先证明影响才能写防御代码。页面的“前移到实现”是作者类比，页面已明确标为“本页改写”，本次不据此升级评级、增加评审轮次或默认流程。

## 核实表

| # | 页面原句（固定页行号） | 官方原文与位置 | 结论 | 支持范围／未知 |
|---|---|---|---|---|
| 1 | 第 28 行：“OpenAI 的实际 review rubric 要求问题具体、可行动，严谨程度与项目匹配，指出确实受影响的其他代码，并交代触发场景。” | [rubric.md#L12-L19](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/prompts/templates/review/rubric.md#L12-L19) 第 2、3、7 条；[comment 第 5 条 #L27](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/prompts/templates/review/rubric.md#L27) | **确认。** 四项能逐条对上：finding 要 discrete／actionable（第 13 行）；严谨程度不超过仓库既有水平（第 14 行）；必须指出可证明受影响的其他代码（第 18 行）；comment 要说明触发的场景、环境或输入（第 27 行）。最后一项是 comment 写作要求，不是 finding 成立条件 | 只支持四项要求的文本来源；模型实际是否照做未测 |
| 2 | 第 30 行：“The bug does not rely on unstated assumptions about the codebase or author's intent.” | [rubric.md#L17](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/prompts/templates/review/rubric.md#L17)；同文件第 7-8 行的默认／可覆盖声明 | **逐字一致。** 原句是第 6 条 finding 判定准则，含义是“审查者提出的 bug 不能依赖对代码库或作者意图的未声明假设” | 不支持“实现阶段只写能证明影响的机制”；那是页面的类比，不是 rubric 原意 |
| 3 | 第 32 行：“这份文件由 `review_request.rs` 读入” | [review_request.rs#L9](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/prompts/src/review_request.rs#L9)：`pub const REVIEW_PROMPT: &str = include_str!("../templates/review/rubric.md");`；同文件 `review_prompt()` [#L59-L99](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/prompts/src/review_request.rs#L59-L99)；[prompts/src/lib.rs#L32](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/prompts/src/lib.rs#L32) 与 [core/src/lib.rs#L245](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/lib.rs#L245) 的再导出 | **确认但需精确：** 是编译期 `include_str!` 嵌入，不是运行时读文件；`review_prompt()` 按 Uncommitted／BaseBranch／Commit／Custom 生成各自的提示（Custom 直接取用户指令），返回内容不含 rubric | 页面链接定位正确（第 8-9 行）；“读入”不等于“拼进本次 review 请求” |
| 4 | 第 32 行：“review task 再把它设为审查线程的基础指令” | [core/src/tasks/review.rs#L118-L120](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/tasks/review.rs#L118-L120)：设 `base_instructions` 为 `crate::REVIEW_PROMPT`、来源标记 Custom；[#L128-L142](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/tasks/review.rs#L128-L142) 创建一次性子线程 | **确认。** rubric 是审查子线程的系统指令；用户消息来自 `session/review.rs` [#L142-L152](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/session/review.rs#L142-L152) 的 `resolved.prompt`，随后 [#L176](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/session/review.rs#L176) 启动 `ReviewTask`。仓库测试 `review_input_isolated_from_parent_history`（[#L1127](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/tests/suite/review.rs#L1127)）在 [#L1269-L1271](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/tests/suite/review.rs#L1269-L1271) 断言请求的 instructions 等于 `REVIEW_PROMPT`，还覆盖了 Custom target | “审查线程”实为 `SubAgentSource::Review` 的一次性子线程；同一处把 web search、collab、multi-agent 关闭，审批策略设为 Never，模型取 `review_model` 或父会话模型（未按任务重核模型名／effort）。运行时未实跑 |
| 5 | 第 34 行：“2026-10-26 重核，rubric 与当日 main 相同。” | GitHub API 的提交列表（`until=2026-10-26T00:00:00Z` 返回 `970111f6`）；三个文件的提交历史分别止于 2026-07-21、2026-06-01、2026-10-10 | **确认。** 10-26 零时前 main 的最新提交就是固定 SHA；三个文件此后到读取日未再变动 | 只证明文件相同，不证明 10-26 当天有人实际打开核过 |
| 6 | 第 28 行的“OpenAI 的实际 review rubric”作为范围表述 | 除 [prompts/src/lib.rs#L32](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/prompts/src/lib.rs#L32) 的再导出外，`REVIEW_PROMPT` 只在 [core/src/lib.rs#L245](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/lib.rs#L245) 再导出并由 [tasks/review.rs#L119](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/tasks/review.rs#L119) 使用；入口链为 [exec/src/lib.rs#L921-L924](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/exec/src/lib.rs#L921-L924)（`InitialOperation::Review`）→ [exec/src/lib.rs#L1272](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/exec/src/lib.rs#L1272)（`review/start`）→ [app-server turn_processor.rs#L1466](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/app-server/src/request_processors/turn_processor.rs#L1466)（`Op::Review`）→ [session/handlers.rs#L724](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/session/handlers.rs#L724)；guardian 在 [reviewer_config.rs#L41-L68](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/guardian/reviewer_config.rs#L41-L68) 用 `GuardianPolicyInstructions` 渲染并设为 `base_instructions`；[.github/codex/labels/codex-review.md](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/.github/codex/labels/codex-review.md) 是另一份 PR 审查任务提示 | **限定范围：** 它是 Codex 开源仓库里用户发起 review 流程的 rubric，不是所有“审查”入口的规则。CLI `codex review`、app-server `review/start` 都落到 `Op::Review`；guardian 审批复核走另一套；`.github` 提示的宿主如何执行仓库内无装配代码 | 托管版 GitHub PR 审查、IDE 或云端审查是否复用这份 rubric，仓库内不可判定，记未知 |

## 与同版本 `templates/generic/REVIEW.md` 的对照

同版本指 [templates/generic/REVIEW.md@5ebecac1](../../../../../templates/generic/REVIEW.md)（blob `2d52a74cdf33b6035575a0e1b4eb21bc5070c45e`，59 行）。它是给其他项目复制的模板，不是本轮运行规则，只作对照。

| 维度 | Codex rubric（固定 SHA） | `templates/generic/REVIEW.md` |
|---|---|---|
| Important 的定义 | 影响准确性、性能、安全或可维护性，且是本次提交引入、作者会修的具体问题（第 1、4、5 条）；输出用 P0–P3 | 只保留会破坏行为、泄露数据或阻断回滚的 finding：错误逻辑、缺失鉴权、日志中的密钥／PII、不可回退的数据迁移（第 12-15 行） |
| 证据要求 | comment 要说明触发场景、环境或输入；finding body 引用文件／行／函数（第 27 行、输出 schema） | 每个行为主张用 `file:line`，不得从命名推断；每条 Important 要给出可复现失败的输入、命令或测试（第 19、30 行） |
| 输出量 | 列出作者会修的全部 finding；没有值得修的就不输出（第 36 行） | 每轮最多 5 个 Nit；首轮后不再提新 Nit（第 33-43 行） |
| 仓库特性 | 严谨程度与仓库既有水平匹配（第 3 条）；另有 Repository Rule Attribution 节处理 AGENTS 等规则 | 明确要查重复逻辑、契约外的错误吞噬、没有改动也能通过的测试和仓库特定不变量（第 50-59 行） |

两者都要求具体、可行动、有证据，都不鼓励风格 Nit。差异是模板把数据泄露与阻断回滚写成独立门槛，rubric 第 1 条的 security 涉及安全类影响（可含数据泄露），但没有把阻断回滚列为独立条件；模板还查测试质量，rubric 没有这一项。页面没有声称两者等价，因此不需要改页；但读者不应把 rubric 当成覆盖数据泄露、回滚与测试质量的完整清单。

## 版本对照与已核无变化

| 引用 | 版本／SHA | 日期 | 三份文件与固定 SHA 的差异 |
|---|---|---|---|
| 固定 SHA | `970111f6cb62cc02fe36a82ea7d71b37a2889c97` | 2026-10-23 | — |
| 当前稳定版 | `rust-v0.166.0` | 2026-10-29 | 无；sha256 前缀：rubric `ec60e7f36a1d1c26`、review_request `f4896d6746c3508a`、tasks/review `57a27393322d094e` |
| 当日 main | `036e160181cf27a3e7f31eea7409bc5f266434e7` | 2026-11-03 | 同上，逐字节相同 |

三个文件最后一次改动分别是：rubric 2026-07-21（`81de4f25`，加入 Repository Rule Attribution）、`review_request.rs` 2026-06-01（`ba2b67f9`）、`tasks/review.rs` 2026-10-10（`5ef96ab2`）。因此固定 SHA 与稳定版／main 之间不存在“拿 main 取代已发版本”的分歧。

## 未知与所缺证据

- **未运行 Codex、模型、审查客户端、构建、测试、Hook 或浏览器。** 以上是公开源码、仓库内测试断言、GitHub 元数据与官方文档的静态核对；不代表本机运行时的实际输出。
- **托管版与 IDE 入口未知。** GitHub PR 审查（`.github/codex/labels/codex-review.md`）、Codex 云端或 IDE 审查是否也把这份 rubric 当基础指令，仓库内没有对应装配代码，不能从本文件推出。
- **效果未测。** 没有证据表明该 rubric 能减少过度工程、降低漏检或带来跨模型收益；页面也未这样声称，本次不补效果结论。
- **可覆盖性。** rubric 自述是默认准则，更具体的开发者／用户／文件／系统指令可以覆盖；Custom review 指令也只改用户消息，不改 rubric 的基础指令地位。
- **模型名、effort、账号入口按要求未重核。**

## 最小候选补句（可选，未写入页面）

若负责人认为需要补范围，建议只在第 32 行“这份文件由 `review_request.rs` 读入……”之后加一句：

> 这里的“读入”是编译期 `include_str!`；rubric 只由 `ReviewTask` 设为一次性审查子线程的基础指令，按 review 目标生成的提示（Custom 时为用户指令）才是用户消息。已核的另一处指令源是 guardian 审批复核，它在 `core/src/guardian/reviewer_config.rs` 第 41-68 行用 `GuardianPolicyInstructions` 渲染自己的 `base_instructions`（第 68 行赋值）；仓库内 `.github/codex/labels/codex-review.md` 的 PR 审查提示是独立文件，其宿主如何装配在仓库内不可判定。托管版、IDE 或云端审查是否复用这份 rubric 未知。

如还要防止把 rubric 当硬规则，可再补一句：“它是可被更具体指引覆盖的默认准则，本条是 finding 判定门槛；本页把它类比到实现取舍，未做提示词效果对照。”本单元按写入范围不改页面。

## 实际运行与检查

- 固定页：`git rev-parse 5ebecac1:docs/decisions/codex-overengineering.md` 得 `261879bdfc10e751586d1be921cb3fef086ad9ff`，`git hash-object` 同值，90 行。
- 模板：`git rev-parse 5ebecac1:templates/generic/REVIEW.md` 得 `2d52a74cdf33b6035575a0e1b4eb21bc5070c45e`，59 行。
- 源码：分别从 `970111f6`、`rust-v0.166.0`、`036e1601` 取三份文件原文，`diff` 无输出；sha256 前缀见表。GitHub API 读取固定提交元数据、最新稳定发布、main 提交与三个文件的历史。
- 复核 guardian 指令源（本次修正）：固定 SHA 全树 `rg -F -uu reviewer_instructions` 为 0 处，`GuardianPolicyInstructions` 为 15 处（6 个文件）；`core/src/guardian/reviewer_config.rs` 第 41-50 行构造并渲染该指令，第 68 行赋给 `base_instructions`，第 69 行标记来源 Custom。`reviewer_instructions` 是更晚的 main 才有的函数（`036e1601` 的 `codex-rs/ext/guardian-reviewer/src/instructions.rs#L34`；该文件在固定 SHA 下 404），不属于本固定版本。
- 官方文档：[Codex CLI slash commands](https://developers.openai.com/codex/cli/slash-commands)（读取 2026-11-03）说明 `/review` 审查工作树、默认用当前会话模型，未描述 rubric 内容；仓库 `docs/` 也没有 rubric 说明，可核的装配保证是源码与仓库测试。
- 仓库检查：`python3 scripts/check_repo.py` 检查 720 个文件、0 错误；`python3 scripts/check_public.py` 检查 1181 个文件、0 命中；`git diff --check` 无输出。新增文件另用 `git diff --no-index --check /dev/null <facts.md>` 复核，无空白错误；文件为 UTF-8、LF、无行尾空格、72 行。本文件不含本机路径、凭据、内部地址或个人信息。
- 提交身份：本单元未提交；当前 `git config user.email` 是公司邮箱，不是公开安全的机器身份，未使用。发布时应由接收端沿用既有 noreply 身份。本单元不改页面、模板、TASKS、其他任务或接收脚本。
