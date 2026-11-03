# A-MODEL-ENTRY-CONSISTENCY-20261102 · 跨页更正候选

> 核查基准：`docs/01-agents/README.md@73dbfe668a4fde4577e949613a25626f02098929`；工作树 base_ref `99c1c1fc6114188d9a18d05f628f6f08e368ac00`。核查日期 2026-11-03（UTC+8）。本文件只列供页面负责人采用的候选，未改三页正文，也不构成客户端、模型或账号可用性验收。

## 结论

两处有实质影响：Codex 深页 §3.5 的“模型按 §2”在 Cloud／Dots 语境下会被读成可以套用本机模型覆盖；02 的 Claude 启动命令缺 Sonnet 5.5 的最低客户端版本。其余入口与命令已核，保留原写法。

如果只采纳一条，优先改 §3.5：总览已经明确 Codex Cloud 默认模型不可改，深页仍有未限定的“模型按 §2”，两页对同一入口给出不同预期。

## 一、有实质影响的差量

### 1. `docs/01-agents/codex.md` §3.5：把“模型按 §2”限定到本机，并排除 Cloud／Dots 的模型与 effort 配置

**原句（第 163 行）**

> **只按当前任务采用云环境、持续 Agent 或安全扫描。** DevDay 的发布背景见官方记录；模型按 §2，持续任务按 §6，不把发布清单当配置清单。

**上下文**

§3.5 讲 DevDay 2026 的变化，紧接着的三条分别讲云环境、Dots 和安全扫描。§2 给的是用户在客户端上可改选的模型与 effort，以及 `codex --model ...` 单次 CLI 覆盖；读者从总览的 Cloud 行进入本页时，容易把“模型按 §2”读成 Cloud 任务也能按 §2 改模型或 effort。

**依据（2026-11-03 读取）**

- workspace 模型可用性页明确：“Codex cloud doesn’t support changing its default model.” 同页说 Cloud 的模型可用性取决于 “Models supported by hosted Codex workflows and the access available to the signed-in ChatGPT identity”；管理员的起始模型与 reasoning 设置只覆盖 Chat、Work 与 local Codex 界面。
- Codex Cloud 页正文没有模型/effort 说明，只有 Start a new task 插图显示 “GPT-6 Sol” 与 “Medium” 控件；该页既未说这两项可改选，也未说默认模型不可改。
- 官方命令页的 `codex cloud exec` 只列 `--attempts`、`--env` 与 `QUERY`，没有 `--model`／`--effort`；`--model`／`-c` 只出现在全局选项表。
- [Codex issue #56350](https://github.com/openai/codex/issues/56350)（[社区/开源 issue]，2026-11-03 读取，当前 open）：`codex cloud exec` 的 `-c model=...`／`-c model_reasoning_effort=...` 被接受但不生效，任务实际按更低档模型运行；报告者指出 web composer 有模型选择与五档 effort 选择器；2026-10-25／26 有独立复现。
- Dots 页写明 “Powered by GPT-6 Astra, your dot lives in the cloud...”，没有列出用户改选模型的入口。
- DevDay 页确实提到 GPT-6.1 Sol 与 Astra Ultrafast，但没有说 Cloud 或 Dots 可以改模型；不能把模型发布当作 Cloud 的配置入口。
- 总览 73dbfe66 第 40 行已按同一来源改成“官方不支持更改 Cloud 的默认模型，不能直接套用上两行本机配置”；深页仍保留未限定的“模型按 §2”。

**读者可能做错什么**

以为 Cloud 没有模型/effort 入口，或把本机 `--model`／`-c model_reasoning_effort` 覆盖带到 Cloud 任务。实际 Cloud 的默认模型不可改，模型可用性取决于托管工作流与登录身份；Cloud 任务界面显示 GPT-6 Sol／Medium，社区报告该界面可改选模型与 effort，启动时以任务内可见选择为准；`codex cloud exec` 没有 `--model`／`--effort` 参数，截至 2026-11-03 的社区报告称 `-c` 覆盖会被接受但不生效（issue 仍 open，修复后可能变化）；Dots 也没有给出本机 `--model` 或 effort 的接入口。

**建议最小替换**

> **只按当前任务采用云环境、持续 Agent 或安全扫描。** DevDay 的发布背景见官方记录；本机的模型与 effort 选择按 §2；Codex Cloud 的默认模型不可改，可用性取决于托管工作流与登录身份；启动 Cloud 任务时在任务界面选模型与 effort（官方 Cloud 页的 Start a new task 显示 GPT-6 Sol／Medium；社区报告该界面可改选，而 `codex cloud exec` 的 `-c` 覆盖不生效，且该 issue 尚 open），不要假定本机 `--model`／`-c model_reasoning_effort` 会带到 Cloud；Dots 等托管入口也不套用本机模型与 effort 配置；持续任务按 §6，不把发布清单当配置清单。

**依据行**

在 §3.5 节末第 171 行的依据里按主张分别补源：Cloud 默认模型不可改与可用性前提用 [Cloud 模型可用性](https://learn.chatgpt.com/docs/enterprise/workspace-model-availability)（2026-11-03 读取；同页说明管理员起始设置只覆盖 Chat、Work 与 local Codex 界面）；任务界面的 GPT-6 Sol／Medium 显示用 [Codex Cloud](https://learn.chatgpt.com/docs/cloud)（2026-11-03 读取；正文未写这两项可改选）；`codex cloud exec` 无 `--model`／`--effort` 用 [Codex 命令](https://learn.chatgpt.com/docs/developer-commands)（2026-11-03 读取；`codex cloud exec` 只列 `--attempts`、`--env`、`QUERY`）；“`-c` 覆盖被接受但不生效、任务界面可改选”用 [Codex issue #56350](https://github.com/openai/codex/issues/56350)（[社区/开源 issue]，2026-11-03 读取，当前 open；2026-10-25／26 有独立复现）。不要把“不会生效”归到前两篇官方页。原有 DevDay、Dots 资格和 Security Cloud 事实保持 2026-10-15。

**不改**

§2 的本机模型表与命令仍然有效；§1 的 Cloud 入口行只讲准备和发布环境，没有模型断言，不重复加限制。

### 2. `docs/02-models-and-cost.md` 开头：Claude 启动命令补最低客户端版本

**原句（第 17、20 行）**

```bash
claude --model claude-sonnet-5-5 --effort medium
```

```text
Codex 入口说明见本节依据；Claude 的起步方式详见 [Claude 起步](01-agents/claude-code.md#7-推荐起步先原生扩展按需选择)。 **〔当前入口〕**
```

**上下文**

第 9 行只说“型号须在当前账号、客户端与服务商中可用”，没有给出客户端版本门槛；“Claude 起步”页的模型表只标了 Haiku 5.5 的 v2.1.293，没有写 Sonnet 5.5 的 v2.1.284+。读者照这条命令启动时，无法从本页或该链接判断自己的客户端是否支持 Sonnet 5.5。

**官方依据（2026-11-03 复核）**

Claude Code 模型配置文档写明：“Sonnet 5.5 requires Claude Code v2.1.284 or later, and Opus 5.5 requires v2.1.280 or later.” 总览 73dbfe66 第 38 行已写“Sonnet 5.5 需 Claude Code v2.1.284+”，`docs/decisions/model-roles.md` 第 17 行也写同一要求。CLI reference 中 `--effort` 可用于当前会话，`medium` 不是需要额外版本门槛的 `ultracode`；本行缺的是模型支持版本，不是参数可用性。

**读者可能做错什么**

在低于 v2.1.284 的 Claude Code 上复制命令，模型请求会失败并提示需要升级到 v2.1.284+（官方未描述自动回退）；读者可能误判为模型、账号或 provider 问题，而不是客户端版本不足。

**建议最小替换（第 20 行前加一句）**

```text
`claude` 这行需 Claude Code v2.1.284+。Codex 入口说明见本节依据；Claude 的起步方式详见 [Claude 起步](01-agents/claude-code.md#7-推荐起步先原生扩展按需选择)。 **〔当前入口〕**
```

**依据行**

第 33 行补 [Claude 型号与版本](https://code.claude.com/docs/en/model-config#model-aliases)（2026-11-03 复核；版本要求句在 Model aliases 节，同页 [Version history](https://code.claude.com/docs/en/model-config#version-history) 有逐版本说明）。价格、模型推荐与 effort 建议保持 2026-10-22，不重核。

**不改**

第 9 行的账号、客户端与服务商可用性前提已覆盖 provider 与账号；命令用完整模型 ID，不需要再讲 `sonnet`／`opus` 别名解析。Opus 5.5 的 v2.1.280+ 低于 Sonnet 的 v2.1.284+，Sonnet 门槛已覆盖更严的一档；Haiku 5.5 的 v2.1.293 已在链接的 Claude 起步页模型表中标注。不在 02 重复全部版本限制。

## 二、看似不同但应保留

| 页面与原句 | 保留理由 |
|---|---|
| `docs/decisions/model-roles.md:14` 的 Sonnet 命令与 `:17` 的版本、provider 前提 | 已同时给出 Sonnet 5.5 的 v2.1.284+、Haiku 5.5 的 v2.1.293+ 和第三方提供方用实际模型 ID，与总览一致。在途 `origin/dot-a/model-effort-reader-dispatch-20261029` 的简化稿也保留这段；本候选不依赖其 section anchor，也不改该页。 |
| `docs/02-models-and-cost.md:9` “型号须在当前账号、客户端与服务商中可用” | 这是账号与 provider 的前提，不是客户端版本门槛；两者不冲突。命令用完整模型 ID，别名解析问题不适用于本行。 |
| `docs/01-agents/codex.md:69-75` §2 模型表与 `codex --model ...` 命令 | 模型 ID `gpt-6.1-sol`、`gpt-6-astra` 与官方 Models 页一致；命令是单次 CLI 覆盖，§2 没有声称适用于 Cloud。账号与套餐前提在 §1“先按任务选入口，再核套餐和开通状态”已有，不在 §2 重复。 |
| `docs/01-agents/codex.md:50` §1 的 Cloud 行 | 只说“先准备并发布可复用环境”，没有模型断言；§3.5 一处限制即可，§1 不重复。 |
| `docs/01-agents/codex.md:166-169` Dots 与 Security Cloud 行 | Dots 资格和 Security Cloud 计费是另一类前提；本候选只加“托管入口不套用本机 `--model` 或 effort 配置”，不改这些事实。 |
| 总览 `README.md:38-40` 的 Cloud 与版本行 | 基准已核；本任务是让深页对齐它，不回改总览。 |

## 三、已核范围与来源

| 已核主张 | 来源（2026-11-03 读取） | 结论 |
|---|---|---|
| Cloud 默认模型不可改，模型可用性取决于托管工作流与登录身份；管理员起始设置不覆盖 Cloud | [workspace model availability](https://learn.chatgpt.com/docs/enterprise/workspace-model-availability) | 对应差量 1 |
| Cloud 任务界面显示 GPT-6 Sol／Medium；`codex cloud exec` 只列 `--attempts`／`--env`／`QUERY`；`-c` 覆盖被接受但不生效（截至 2026-11-03 社区报告，issue open） | [Codex Cloud](https://learn.chatgpt.com/docs/cloud)、[Codex 命令](https://learn.chatgpt.com/docs/developer-commands)、[issue #56350](https://github.com/openai/codex/issues/56350)（[社区/开源 issue]） | 对应差量 1；前两项为官方命令/界面事实，覆盖行为仅来自 issue |
| Dots 由 GPT-6 Astra 驱动，页面未列用户改选模型入口 | [Dots](https://learn.chatgpt.com/docs/dots#access) | 支持差量 1 的限定，不新增 Dots 模型断言 |
| DevDay 页未说 Cloud／Dots 可改模型 | [DevDay 2026](https://learn.chatgpt.com/docs/whats-new/devday-2026) | 支持差量 1 |
| Codex 模型 ID：`gpt-6.1-sol`、`gpt-6-astra`、`gpt-6-luna` | [Codex Models](https://learn.chatgpt.com/docs/models) | 三页写法一致，不改 |
| Sonnet 5.5 需 Claude Code v2.1.284+；Opus 5.5 需 v2.1.280+；Haiku 5.5 需 v2.1.293+ | [Claude Code model config](https://code.claude.com/docs/en/model-config#model-aliases)、[Version history](https://code.claude.com/docs/en/model-config#version-history) | 对应差量 2；Opus／Haiku 已在其他页面或链接覆盖 |
| `--effort` 为当前会话设置 effort，`medium` 可用 | [Claude Code CLI reference](https://code.claude.com/docs/en/cli-reference) | 命令参数本身无版本问题 |
| 总览 73dbfe66 已修 Cloud 默认模型与 Claude 客户端前提 | 本地基准提交 | 作为核查基准，未改 |

价格、benchmark、模型排名与 effort 推荐不在本任务范围，未重核。

## 四、同题在途与边界

- `origin/dot-a/model-effort-reader-dispatch-20261029` 正在简化 `docs/decisions/model-roles.md`，保留 Sonnet／Haiku 版本要求和第三方 provider 说明；不改该页，也不依赖其当前 heading。
- `origin/dot-a/agent-choice-reader-20261102` 在总览顶部增加读者实测段，不改模型／入口表与 Cloud、版本前提；基准表仍按 73dbfe66。
- `origin/dot-a/model-viewer-version-boundary-20261028` 只改实验页 HTML，与本三页无关。
- 本产物只写本文件。三页正文、模板、TASKS、其他卡片与接收器均未改。
- 未做：未启动客户端、模型、浏览器或 API，未核账号、额度或凭据，未复跑任何模型任务；以上候选不替代页面负责人验收。

## 五、建议应用顺序

1. `docs/01-agents/codex.md` §3.5：改一句并在节末补 Cloud 来源。
2. `docs/02-models-and-cost.md` 第 20 行：补 Sonnet 5.5 客户端版本，并在第 33 行补 [Claude 型号与版本] 来源（2026-11-03 复核）。
3. `docs/decisions/model-roles.md`：不改；若在途简化稿合入，保留其现有版本与 provider 句即可。
