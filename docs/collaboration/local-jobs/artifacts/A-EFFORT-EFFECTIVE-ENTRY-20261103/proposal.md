# A-EFFORT-EFFECTIVE-ENTRY-20261103 · 所选档位与当轮生效档位

> 核查基准：`7be93247` 的 `docs/decisions/model-roles.md` 全页、`docs/01-agents/claude-code.md` §2 与 `docs/02-models-and-cost.md`“同模型换推理档保留缓存前缀”。核查日期 2026-11-03（UTC+8）。本文件只交候选稿，不改页面正文；只读公开官方文档与两条历史 issue，未启动客户端、未读取本机环境或设置、未发模型请求。

## 结论

**缺口成立，补一段诊断即可，不需要改原命令或默认档位。** L14 给单次启动命令，L17 给“记录本次可见的实际模型 ID 与 effort；无法确认就记未知”，L30 建议同模型试 `high`，但都没有说明档位来源的优先级、设置显示与当轮执行的区别，以及 `max` 与默认值的不同范围。读者最容易把“标题已变”或“启动时带了 `--effort`”当成换档成功，再把结果差异记到模型能力或成本上。

**若只采用一处，优先放“标题和 `/effort status` 显示设置，当前轮可能仍按旧档；`/effort` 确认后下一条消息按新档，`/model` 最迟从下一条消息起”。** 它直接挡住最常见的错误比较；其余来源优先级和持久范围放在同一段里，避免读者反查整张设置表。

## 可直接采用的增补稿

**插入位置**：`docs/decisions/model-roles.md` 第 17 段之后、第 19 行“按原标准接收，再决定是否沿用配置。”之前，仍在“第一步：只改这一次任务”内。不改 L14 命令、L17 的记录规则，也不改后面表格的档位建议。

以下为可粘贴正文：

---

**已选档位不等于这一轮已按该档运行。** 会话标题里的档位提示（如 “with low effort”）和 `/effort status` 显示的是设置值；当前轮可能仍按旧档运行。终端里用 `/effort` 确认新档后，下一条消息按新档处理；用 `/model` 选择器换档，新档最迟从下一条消息起生效，当前轮仍可能按旧档工作。做比较时等当前轮结束，从下一条完整消息开始算新档；也可以在本轮工作时发一条排队消息，不必打断当前轮：Claude 会在当前工具调用结束时取用，最迟在本轮结束时取用，之后按新档继续。不能仅凭取用时机认定此前每个请求的档位——轮末取用不保证整轮全旧，轮中取用也要前段确实按旧档才称得上混合轮。排队消息用 “keep going” 这类不改变任务内容的话，避免把任务变化混进比较。

**`--effort` 只设置本次启动的档位，不写入设置，也不保证最终生效。** 档位来源按顺序取第一个：`CLAUDE_CODE_EFFORT_LEVEL` 环境变量（含 settings.json 的 `env` 块）→ 会话内 `/effort` 或 `/model` 选择 → `--effort` → 设置文件里该模型已存的档位（`modelSettings`）或顶层 `effortLevel` → 模型默认档。用户设置里的顶层 `effortLevel` 只对 Opus 5／Fable 5.1 及更早模型生效；Opus 5.5 及之后要用 `/effort` 存下的按模型 `modelSettings`，否则按模型默认档；project／local／managed／`--settings` 的顶层键对所有模型生效。已有环境变量时，`--effort` 会被覆盖；没有环境变量时，启动后再在会话里选档也会覆盖它。`maxEffortLevel` 或组织上限会把超过上限的结果压低，模型不支持的档会退到其支持的、不高于所设档的最高档。设置值看会话标题／页脚；要确认是否发送档位，用 `/effort status`（`Effort level: auto`＝不发；`auto (currently <level>)`＝仍发）；一般档位输出以实际为准，无法确认就记未知。

| 操作 | 实际作用范围 |
|---|---|
| `claude --effort <档>` | 本次启动；不写入设置 |
| `/effort`＋Enter，或 `/model` 选择器＋Enter | 按模型存入 `modelSettings`，后续会话沿用（`low`–`xhigh`） |
| 在 `/effort` 滑块或 `/model` 选择器按 `s` | 仅本次会话（v2.1.257+） |
| `/effort max`（或在 `/model` 选择器选 `max`） | 仅当前会话；`effortLevel` 和 `modelSettings` 都不接受 `max` |
| `/effort auto` | 清除当前模型已存档位；其他来源仍可能生效 |

**“保存 max”“选择 max”和“API 默认”不是一回事。** 要让 `max` 跨会话，需要经 `CLAUDE_CODE_EFFORT_LEVEL=max` 设置；它会压过上面其他来源，尤其是会话里的选择，但仍受 `maxEffortLevel`／组织上限限制。没有显式档位（也没有设成 `auto`／`unset`）时，客户端按模型默认档发送（Opus 5.5／Sonnet 5.5／Haiku 5.5 为 `medium`，Opus 4.7 为 `xhigh`，其余支持 effort 的模型为 `high`；组织可为默认模型另设默认档），这不是 API 默认；只有客户端不发档位时（`/effort status` 显示 `Effort level: auto`），才用 API 默认。`auto (currently <level>)` 表示仍在发送某个档位；官方说明的情形是存在低于 `max` 的 `maxEffortLevel` 上限，客户端发送模型默认档并压到该上限。v2.1.304 之前，确实没发档位时也会误显示 `auto (currently high)`。

**这些显示只证明设置。** 官方没有通用的逐轮请求值入口；仅当以 `--effort` 启动且超过 cap 时，plain-text `--print` 的 stderr 警告（交互会话、`json`／`stream-json` 输出和后台会话写入 debug log）会报 requested／applied levels；`/effort` 超过 cap 时官方只说按 cap 运行，未说明会告警。该警告只能证明启动时的应用值，不能证明每轮请求实际值。skill／子代理的 `effort` 会在其运行期间覆盖会话档位（环境变量仍优先），自动模型 fallback 会沿用触发请求的档位。记录实际模型 ID 与 effort 时按这些边界注明；无法确认就写未知，不用模型自述、私有轨迹采集、抓包或上传日志代替。

---

## 原句与缺口

| 位置 | 原句 | 原句已经说了什么 | 缺口（不是事实错误） |
|---|---|---|---|
| L14 | `claude --model claude-sonnet-5-5 --effort medium` | 给单次启动的模型与档位 | 没说 `--effort` 只决定启动默认值，可能被环境变量、会话内选择和上限覆盖 |
| L17 | “Codex 的 `-c`、Claude 的 `--effort` 都只覆盖本次启动……记录本次可见的实际模型 ID 与 effort；无法确认就记未知，不由客户端名称或其他模型的同名档位推断。” | 参数不持久，记录可见值，无法确认记未知 | “只覆盖本次启动”只说持久范围，没有说来源优先级和生效时点；读者仍可能把设置显示当运行证据 |
| L30 | “跨文件审查、追调用链、查边界遗漏”“同模型试 `high`”“找到更多可核实的问题或补足关键验证”（表格行，按单元格摘录） | 建议同模型试高档 | 没说什么算“真的换到了 `high`”；标题变了不等于本轮已按新档执行 |

原命令与“无法确认就记未知”的边界成立，本稿不重新选默认档位，也不改 L17 的未知规则。

## 诊断路线：设置来源 → 模型与上限 → 当前轮或下一轮 → 可见证据

| 步骤 | 要问的问题 | 可查入口 | 能得出的结论 |
|---|---|---|---|
| 1 设置来源 | 哪一层在设档位：环境变量、会话内选择、`--effort`、设置文件，还是模型默认 | 自己的启动命令；是否设了 `CLAUDE_CODE_EFFORT_LEVEL`（含 settings.json 的 `env` 块）；`/effort status` | 只得到“设置值”，不是本轮实际值 |
| 2 模型与上限 | 这个模型支持该档吗；有没有 `maxEffortLevel` 或组织上限 | 官方模型表；设置参考 | 不支持或超上限会被降档，`--effort` 写了也不等于按原档运行 |
| 3 当前轮或下一轮 | 当前轮结束了吗；新档从哪条消息开始 | 会话是否仍在工作；标题、页脚 | `/effort` 确认后下一条消息按新档；`/model` 最迟从下一条消息起，当前轮可能仍按旧档；纯样本等本轮结束 |
| 4 可见证据 | 有没有能证明“请求按该档执行”的可见信息 | 官方没有通用的逐轮请求值入口；除设置显示外，仅以 `--effort` 启动且超 cap 时，plain-text `--print` 的 stderr（其他会话写 debug log）报启动时的 requested／applied levels；`/effort` 超 cap 官方只说按 cap 运行 | 启动警告只能证明启动时的应用值；不能证明每轮实际值，无法判断就保留未知 |

## 三问逐条

### ① 已有环境变量时，`--effort` 能否保证新档？

**不能保证。** `--effort` 只设置本次启动的档位；最终档位由优先级最高的来源决定：`CLAUDE_CODE_EFFORT_LEVEL` 排第一，会话内选择排第二，`--effort` 排第三，设置文件与模型默认档排在后面。需要分开看的条件：

- 环境变量已设为一个档位时，`--effort` 不会改变最终设置。settings.json 的 `env` 块写入的变量也在最高优先级；历史 issue #80940 在 v2.1.220 的实测就是 `env` 块里的 `xhigh` 压过 `--effort max`，错误信息里报的仍是 `xhigh`。该实测只用来证明优先级，不把当页的 WebSearch 400 当成现故障。
- 启动后又在会话里用 `/effort` 或 `/model` 选了档，且没有更高优先级的环境变量时，会话选择覆盖启动参数。
- 即使某个来源选中了一个档，模型不支持的档会退到其支持的、不高于所设档的最高档；`maxEffortLevel` 或组织上限在超过时再压低；多个上限同时存在时取最低。
- 只有没有更高优先来源时，`--effort` 才决定最终设置。

**可见证据**：`/effort status` 用来核对会话设置的档位；所引模型配置页在 fallback 和 `auto` 两处描述该命令，并在 Check the effort level you set 一节说明会话标题、页脚反映设置值；官方 commands 参考的 `/effort` 条目只写明 `status` prints it。`--effort` 本身、启动命令和标题不能证明最终档位。**仍未知**：本稿未执行客户端，未核 `/effort status` 对一般档位的完整输出格式；环境变量可能来自 shell，也可能来自 settings.json 的 `env` 块，只看其中一处会漏。

### ② 当前轮未结束、标题已变，能否认定正在按新档执行？

**不能。** 官方原文说：标题里的档位“comes from your effort setting, even if Claude is still working at the old level”。`/model` 选择器换档时，“The new level starts with your next message at the latest. Until then, Claude can keep working at the old level, even on a new model.”终端里 `/effort` 确认后，“the next message you send runs at that level”；当前轮“it's expected if the turn finishes at the old level”。两者不能一概写成“必须等下一条消息才生效”：`/model` 只保证最迟从下一条消息起，当前轮也可能已按新档、也可能仍按旧档；`/effort` 的新档从下一条消息开始，但这条消息可以在本轮中排队送入。

- 可以等当前轮结束再发下一条消息，从下一条完整消息开始算新档；也可以在它工作时发一条消息排队，不必打断当前轮。排队消息被取用后按新档继续：通常在当前工具调用结束时取用，最迟在本轮结束时取用。但取用时机不能反推此前每个请求的档位：轮末取用不保证整轮全旧，`/model` 的新档可能更早生效；轮中取用也要前段确实按旧档，才称得上混合轮。要纯样本就等当前轮结束再发下一条。
- 版本条件：v2.1.242 之前，`/effort` 可能被排到本轮结束；不获取 feature flags 的会话（如第三方 provider）在当时总是如此。旧客户端上“确认后立刻生效”的预期不成立。
- 自动模型 fallback 换模型时，会沿用触发请求的档位；模型 ID 变了不代表 effort 变成新模型的默认档。

**可见证据**：标题、页脚和 `/effort status` 只反映设置；官方没有通用的逐轮请求值入口，仅当以 `--effort` 启动且超过 cap 时，plain-text `--print` 的 stderr 警告（交互会话、`json`／`stream-json` 输出和后台会话写 debug log）报启动时的 requested／applied levels；`/effort` 超过 cap 时官方只说按 cap 运行，未说明会告警。该警告不能证明每轮请求实际值。**仍未知**：当前轮实际发送的档位；本稿未执行，不能确认任何一轮的实际请求值。

### ③ 保存 max、选择 max 与 API／客户端默认是否等价？

**不等价，分属四个不同范围：**

- **保存 max**：`effortLevel` 与 `modelSettings` 都只接受 `low`／`medium`／`high`／`xhigh`，不接受 `max`。issue #35904 中，维护者在 v2.1.233 上复现了 `"effortLevel": "max"` 被忽略、会话按默认 `high` 启动，并说明这是预期契约：`max` 是会话级，不通过该设置持久化。因此不要写了一个 `max` 就当成已保存。
- **选择 max**：`/effort max` 只作用于当前会话；除非经 `CLAUDE_CODE_EFFORT_LEVEL`，Claude Code 不会把 `max` 应用到后续会话。要跨会话保留 `max`，需要经环境变量设置；它会成为最高优先来源，压过 `--effort` 和会话内选择，同时仍受 `maxEffortLevel`／组织上限限制。
- **客户端默认**：没有显式档位（也没有设成 `auto`／`unset`）时，客户端按模型默认档发送（Opus 5.5／Sonnet 5.5／Haiku 5.5 为 `medium`，Opus 4.7 为 `xhigh`，其余支持 effort 的模型为 `high`；组织可为默认模型另设默认档）。这是客户端行为，不是 API 默认。
- **API 默认**：只有客户端不发档位时才生效；`/effort status` 显示 `Effort level: auto` 才表示没有发送。`Effort level: auto (currently <level>)` 表示仍在发送某个档位，通常是 `maxEffortLevel` 低于 `max` 时，客户端发送模型默认档并压到该上限。`/effort auto` 只是清除当前模型已存档位，不等于“不发档位”。

还有一个容易混淆的“已保存”条件：用户设置文件里的顶层 `effortLevel` 是旧写法，Opus 5.5 及之后的模型会忽略它，直到用 `/effort` 存下按模型的档位（`modelSettings`）；project、local、managed 设置或 `--settings` 传入的顶层键则对所有模型生效。

**可见证据**：设置键本身、`/effort status`、标题和页脚。**仍未知**：API 默认的具体数值不在该页；具体账号或组织的上限未核；本稿没有变更任何设置。

## 来源、版本与日期

| 来源 | 位置 | 支持什么 | 版本与日期 |
|---|---|---|---|
| [官方模型配置：Adjust effort level](https://code.claude.com/docs/en/model-config#adjust-effort-level) | Set the effort level、Check the effort level you set、When a new effort level starts（说明等待本轮结束与排队两种做法；排队消息在当前工具调用结束或本轮结束时被取用：轮中取用则同一轮后半段按新档，轮末取用则下一轮按新档）、Send no effort level、Effort level after a fallback、Organization effort limits | 来源优先级、会话级/持久范围、生效时点、`/effort status` 的 auto 输出、上限与降档、fallback 沿用档位 | 页面未标明整体版本或更新日期；逐功能注记 v2.1.195、v2.1.203、v2.1.234、v2.1.242、v2.1.257、v2.1.284、v2.1.304、v2.1.311。读取 2026-11-03 |
| [官方交互模式：When Claude Code sends what you queued](https://code.claude.com/docs/en/interactive-mode#when-claude-code-sends-what-you-queued) | When Claude Code sends what you queued | 补充送达细节：排队消息在 Claude 跑工具调用时入队，会在这些工具调用结束时于同一轮内送达；本轮结束时仍有排队消息，则本轮结束后才发出。档位“按新档继续”的说明见 model-config 的 When a new effort level starts | 该节未标明版本；同页立即发送（`Ctrl+Enter`）需 v2.1.275+。读取 2026-11-03 |
| [官方 CLI 参考](https://code.claude.com/docs/en/cli-reference) | `--effort` | 选项含 `low`／`medium`／`high`／`xhigh`／`max`／`ultracode`；覆盖 `modelSettings`、`effortLevel`，只对本次会话、不持久 | 该条未标明引入版本。读取 2026-11-03 |
| [官方 commands 参考](https://code.claude.com/docs/en/commands) | `/effort [level\|auto\|status\|ultracode [on\|off]]` | `status` prints it；`max` 为会话级；`-p` 中可用需 v2.1.205+ | 该条未标明 `/effort` 引入版本；`ultracode on/off` 需 v2.1.284+。读取 2026-11-03 |
| [官方设置参考](https://code.claude.com/docs/en/settings-reference) | `effortLevel`、`modelSettings`、`maxEffortLevel`、`CLAUDE_CODE_EFFORT_LEVEL` | 设置键取值、按模型保存、跨文件优先级、上限取最低、环境变量优先于 `--effort` | `modelSettings` 需 v2.1.251+；`maxEffortLevel`（含按模型字段）需 v2.1.267+；`effortLevel` 的旧写法在 v2.1.251 前由 `/effort` 写入。读取 2026-11-03 |
| [issue #35904 维护者回复](https://github.com/anthropics/claude-code/issues/35904#issuecomment-5348008599) | `#issuecomment-5348008599` | `effortLevel: "max"` 被忽略、`max` 为会话级、环境变量可持久化 | 2026-08-19，v2.1.233（Linux）。历史已证场景，不等于当前缺陷 |
| [issue #80940 用户测量](https://github.com/anthropics/claude-code/issues/80940#issuecomment-5089278074)、[维护者修复回复](https://github.com/anthropics/claude-code/issues/80940#issuecomment-5351104376) | `#issuecomment-5089278074`、`#issuecomment-5351104376` | `env` 块的档位压过 `--effort`；WebSearch 400 已在 v2.1.221 修复 | 用户测量 2026-07-27，v2.1.220；维护者回复 2026-08-20。历史对照，不重跑 |
| 仓内固定输入 | `docs/decisions/model-roles.md` L14、L17、L30；`docs/01-agents/claude-code.md` §2；`docs/02-models-and-cost.md`“同模型换推理档保留缓存前缀” | 原入口、原记录规则与原换档建议；Codex 的 `configuration_update` 边界只作排除 | 核查 2026-11-03 |

## 历史场景怎么用（不重跑）

- **#35904 是“保存 max 不是保存”的真实反例。** 用户报告按 `effortLevel: "max"` 写入后会话按默认档启动；维护者在 v2.1.233 上复现为按默认 `high` 启动，并说明 `max` 是会话级、不会经该键持久化，另给出环境变量这条受支持路径。这正好支撑第③问，也解释了为什么不能把“设置里有 max”当成生效证据。保留它为历史契约佐证；不说今天仍有缺陷，不据此否定 `max` 本身。
- **#80940 是“以为换档无效，实际来源被压住”的对照。** 2026-07-27 用户在 v2.1.220 上看到同一 400，随后用四行对比发现 settings.json `env` 块里的 `xhigh` 压过 `--effort max`，改环境来源后才真正变成 `high`。这里只借它的优先级观测，说明“降低 effort 没效果”可能根本没换档；该 WebSearch 400 已由维护者在 v2.1.221 修复，不称当前仍有该故障，不重跑旧复现，也不照抄当时的 `--settings` 覆盖写法。

## 去重与归属

- **MODEL-EFFORT-READER-20261029**：jrnl #1908 修复及原返工；本卡不补其模型记录、不续接其 reader、不改其未知结论。
- **MODEL-EFFORT-PRACTICE-20261027**：已取消的采用／比较广采，退出未知；不取回、不续跑、不细分重派。
- **MODEL-ENTRY（A-MODEL-ENTRY-CONSISTENCY-20261102）**：已接客户端最低版本与 Cloud 入口；本卡不重核同题，只补所选／当轮诊断。
- **A-AGENT-CHOICE-FACTS-20261102（Agent facts@6f36b1c）**：参数／默认值七节已读；本卡不重核同一批事实，只交其未给的诊断路线。
- 已核 `main` 与各远端分支中与本题同名的任务／产物路径及关键措辞，未发现同原子稿；本卡只写本文件。

## 附录：候选细节（不并入正文也成立）

### A. 设置文件与优先级

- 同一设置文件内，按模型的 `modelSettings.effortLevel` 优先于顶层 `effortLevel`；跨文件时按模型分别解析，设置该模型或设置适用于该模型的顶层键的最高优先级文件决定，managed 设置可压过用户已存的档位。
- 用户设置里的顶层 `effortLevel` 是旧写法，只继续作用于 Opus 5、Fable 5.1 及更早模型；Opus 5.5 及之后忽略它。项目、local、managed 设置和 `--settings` 里的顶层键对所有模型生效。
- `modelSettings` 需 v2.1.251+；它按模型的规范名保存，并匹配别名、日期后缀、`[1m]` 和已识别的 provider 专用 ID。运行 `/effort auto` 只清除当前模型的条目，保留其他条目和顶层键。
- `maxEffortLevel` 设在任意设置文件都有效，上限作用于 `/effort`、`/model` 选择器、`--effort`、`CLAUDE_CODE_EFFORT_LEVEL`、skill／子代理的 `effort` 和模型默认档；多个作用域同时设上限时取最低，不能从另一个作用域抬高。`maxEffortLevel`（含按模型字段）需 v2.1.267+；组织按角色的上限需 v2.1.195+，与客户端上限同时存在时取更低者。

### B. 生效时点与旧版行为

- v2.1.242 之前，`/effort` 可能被排到本轮结束才处理；不获取 feature flags 的会话（如第三方 provider）在当时总是如此。
- `/effort` 在 `-p` 运行中只作用于该会话，不保存为默认（需 v2.1.205+）；Remote Control（手机／浏览器）选择的档位只作用于当前会话，需 v2.1.234+。
- v2.1.257+ 才支持在选择器里按 `s` 仅对本次会话生效。

### C. skill／子代理与 fallback

- skill 的 `effort` 持续到其所在轮结束，或 `context: fork` 时作用于 fork 出来的子代理运行；子代理的 `effort` 在其运行期间生效，除非调用方覆盖。两者运行时，“whatever level you launch with, save, or pick”都不改变它；若设置了 `CLAUDE_CODE_EFFORT_LEVEL`，则用环境变量的档位。`maxEffortLevel` 或组织上限仍限制它。
- 自动模型 fallback 会保留触发请求的档位，例如 Opus 5.5 默认 `medium` 的会话 fallback 到 Opus 4.8 仍是 `medium`，虽然 Opus 4.8 默认 `high`。之后自己选档、在 `/model` 选模型或恢复会话，fallback 的档位不再沿用；单轮 `ultrathink` 或 skill 的 `effort` 只作用于该轮。需要看 fallback 后的档位，运行 `/effort status`。

### D. `/effort status` 的边界

- 在所引模型配置页的两处描述该命令：fallback 后查看档位，以及确认是否发送档位；官方 commands 参考的 `/effort [level|auto|status|...]` 条目另写明 `status` prints it。`Effort level: auto` 表示不发；`Effort level: auto (currently <level>)` 表示仍发送某个档位。
- v2.1.304 之前，确实没发档位时也会打印 `Effort level: auto (currently high)`；旧客户端上不能只凭这一行判断。
- 官方把 `/effort status` 作为确认显示的命令，未说明它会写设置或发模型请求；本稿未在客户端执行。不带参数的 `/effort` 会打开交互滑块，按 Enter 会保存，所以查看设置应使用带 `status` 的形式，不要用空参数形式代替查看。

### E. 相邻但未纳入主线

- 终端输入的 `ultrathink` 可在支持时把该轮升到 `xhigh`（需 v2.1.311+，受环境变量、`maxEffortLevel`、组织上限和模型限制），不改变会话档位；它会造成单轮档位高于设置值，但本卡三问不需要它，暂不并入正文。
- `/effort ultracode` 开启的是工作流设置，不是普通档位；`--effort ultracode` 以 `xhigh` 启动并开启 ultracode（需 v2.1.203+）。本稿不展开。

### F. 仍未知

- API 默认档的具体数值；本页未给出，不能由客户端默认档反推。
- `/effort status` 对一般档位的完整输出格式；官方只明确给出 `auto` 两种输出。
- 具体账号、组织上限、模型可用性与实际客户端版本；本稿未核账户，未执行客户端。
- 单轮请求实际发送的档位；官方没有通用的逐轮请求值入口，仅以 `--effort` 启动且超 cap 时的启动警告只报启动应用值（`/effort` 超 cap 官方未说明会告警），保留未知。

## 未做与边界

- 只读公开官方文档、两条历史 issue 和固定仓内文件；未读取用户设置、HOME、环境变量、账号、账单、凭据、私人会话或日志；未安装或启动 CLI、SDK、模型、代理或抓包；未改个人或组织设置；未做付费请求或外部写入。
- 本稿是未执行的用户操作稿，不是客户端实测。通过只表示有限操作稿可接收，不证明客户端实跑、请求档位、模型效果、用户资格或页面实做完成。
- `docs/02-models-and-cost.md` 的 `configuration_update`／`previous_response_id` 机制属于 Codex Responses API 的换档边界，不能套到 Claude；本稿不据此判断 Claude 的缓存、请求或效果。

核查：`check_repo.py` 739 文件 0 errors；`check_public.py` 0 findings；`git diff --check` 通过。本次未提交、未推送。
