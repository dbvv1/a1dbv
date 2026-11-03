# A-PLAN-MODE-FACTS-20261103 · 计划模式的事实与边界

本单元只核 `docs/decisions/planning-and-tests.md@3ce1dad1`“先 Plan”段（L39、L48）的已有主张，以及同页 L14 的 best-practices 引用可达性。未改页面、模板、其他卡、权限或计划；未运行客户端、shell 示例、模型或浏览器。

## 先看：会影响读者操作的事实差量

1. **入口准确，适用范围要分清。** `claude --permission-mode plan` 是官方 CLI 入口；交互终端、`-p`、Agent SDK、VS Code 聊天面板对 Plan 的拦截范围不同。页面只给 CLI 命令不算错；读者若把它套到 `-p`／SDK，需要按非交互范围理解（见第 7 项）。
2. **Plan 不是只读。** 官方只保证 Plan 阶段不改源码（交互终端 bypass 可用的例外见第 3 项），同时明确它会读文件、运行 shell、写计划。auto 模式可用且 `useAutoModeDuringPlan`（默认 `true`）开启时，除关键路径删除（`rm`／`rmdir`）仍要你批准外，shell 由分类器逐条审，放行的运行、拦截的阻止（无交互终端时按 auto 模式处理，可能被拒）；2.1.218 起，连不能静态判定只读的 Bash 也交给分类器，而不是一律询问。auto 不可用或该设置关闭时，只读命令集之外的命令才逐条询问。页面“可运行获准的 shell”方向正确，但“获准”没有写明是分类器放行还是人工批准，也没有点明 Plan 阶段可能出现非只读命令。
3. **bypass 例外只限交互终端，而且不只 shell。** 官方原文是 “interactive terminal sessions with bypass permissions available”；这类会话里 Plan 的文件编辑和 shell 都不拦（显式 ask 规则、关键路径 `rm`／`rmdir` 仍会询问）。`-p`、Agent SDK、VS Code 聊天面板不适用。页面“交互会话”应收窄为“交互终端会话”。
4. **批准计划不等于外部写授权。** 批准只是退出 Plan，切换到所选权限模式（auto／Manual 逐条批准／bypass）；后续动作仍按该模式审批。若会话启动时已启用 bypass permissions，批准选项可以直接切到 bypass。页面已有“核有效权限与隔离”，建议补一句这个转换，正面挡住“批准了就都授权了”的误读。
5. **严格只读是页面作者的安全建议，不是官方保证。** 官方明确权限模式只决定“是否询问”，隔离由 Bash sandbox 与外层边界决定。要把“只给读工具”具体化为排除 Bash／Write／Edit 与 MCP 写工具、并关掉可执行 hook；只读挂载还要处理 Plan 默认写到 `~/.claude/plans` 的计划文件。
6. **附：一条引用当前不可达。** 同页 L14 的 `best-practices#explore-first-then-plan-then-code` 在当前官方页面不存在；该页当前没有 Plan 段。它不属于“先 Plan”段三句的直接出处，但影响读者核源；是否改引用由负责人决定，本单元不改页面。

## 逐项核实

各项的直接来源见表内；来源的原始日期、读取日与版本／平台统一见文末“来源与日期”表（读取日均为 2026-11-03）。

### 1. 入口 `claude --permission-mode plan`（页面 L39）

- **页面原句**：“在 Claude Code 中可用以下入口，再给它一个有终点的调查请求：`claude --permission-mode plan`。”
- **直接来源**：
  - CLI reference 的 `--permission-mode`：接受 `default`、`acceptEdits`、`plan`、`auto`、`dontAsk`、`bypassPermissions`，`manual` 是 `default` 的别名；示例即 `claude --permission-mode plan`。
  - permission-modes：`Shift+Tab`、`/plan`、CLI 的 `claude --permission-mode plan` 都可进入 Plan；同一 `--permission-mode` 标志也适用于 `-p`。
  - Agent SDK 用 `permissionMode: "plan"`；VS Code 用界面或 `claudeCode.initialPermissionMode`，不读项目的 `permissions.defaultMode`。
- **适用版本／平台**：当前 CLI；交互终端、`-p`、Agent SDK、VS Code 均存在 Plan 入口，但行为不同（第 7 项）。
- **结论**：**确认**。该命令是当前官方入口，页面没有声称它是唯一入口，因此不需要更正；若要覆盖非交互读者，补一句“`-p` 同一标志、但行为见下”即可。
- **未知**：desktop／web／mobile 的入口细节本单元未逐面核。

### 2. “Plan 可运行获准的 shell”（页面 L48）

- **页面原句**：“当前 Claude Code Plan 可运行获准的 shell”。
- **直接来源**：
  - permission-modes 的模式表：plan 一行是 “Reads, plus classifier-approved commands when auto mode is available”。
  - permission-modes 的 Plan 段：“Claude reads files, runs shell commands to explore, and writes a plan, but does not edit your source.”
  - 同一段列了 shell 的三种处理：交互终端且 bypass 可用时不走分类器也不走提示；auto 可用且 `useAutoModeDuringPlan` 开启（默认开启）时，除关键路径删除（`rm`／`rmdir`）仍要你批准外，由分类器逐条审；auto 不可用或该设置关闭时，只读命令集之外的命令提示批准。
  - permission-modes 的 “Critical-path removals in each permission mode” 表把 plan 行的结果写成 “Asks you to approve it”；分类器审命令且无 bypass 可用时按 auto 处理（终端内提示、有时限，其他环境拒绝）。
  - settings reference：`useAutoModeDuringPlan` 默认 `true`，作用域为用户、local 或 managed，“A repository can't turn it off for you”；设为 `false` 时，只读集合之外的每条命令都提示。
  - permissions 的只读命令集：`ls`、`cat`、`echo`、`pwd`、`head`、`tail`、`grep`、`find`、`wc`、`which`、`diff`、`stat`、`du`、`cd` 及只读形式的 `git`；该集合不可配置。
  - changelog 2.1.218：“Changed plan mode with auto to no longer prompt for Bash commands the static analyzer can't prove read-only; the auto-mode classifier judges them instead.” 2.1.212 修过 Plan 自动运行 `touch`、`rm` 等改文件 Bash 的问题；在 auto 可用且该设置开启时，现行版本由分类器判定。
  - permission-modes：v2.1.283 起，交互终端与 VS Code 会话的默认启动模式是 auto；更早版本只在部分计划／条件下默认 auto；auto 不可用时启动为 Manual。
- **适用版本／平台**：行为随版本与配置变化。v2.1.283+ 的交互终端默认 auto；`useAutoModeDuringPlan` 默认开；组织可关闭 auto，模型也可能不支持 auto；此时 Plan 会退回逐条询问。
- **结论**：**确认但需限定**。“获准”应写明批准主体：auto 可用时是分类器逐条审（关键路径删除 `rm`／`rmdir` 除外，仍要你批准；放行或拦截），不是只读检查；分类器可以放行非只读命令，也可能拦截。Plan 阶段出现写操作是可能的，不能把“获准的 shell”读成“只读 shell”。
- **建议最小改法（供负责人决定）**：“Plan 会运行 shell：auto 可用且 `useAutoModeDuringPlan` 开启（默认）时，除关键路径删除（`rm`／`rmdir`）仍要你批准外，由分类器逐条审，放行的运行、拦截的阻止；否则只读命令集之外的命令要你批准；无交互终端时需审批的调用可能被拒（见第 7 项）。Plan 并非只读。”
- **未知**：分类器对某条具体命令的放行结果取决于模型、组织规则与命令内容，本单元不推断；本机未实跑。

### 3. “可用 bypass permissions 的交互会话另有例外”（页面 L48）

- **页面原句**：“可用 bypass permissions 的交互会话另有例外。”
- **直接来源**：
  - permission-modes 的 Plan 段：“Except in interactive terminal sessions with bypass permissions available, edits stay blocked until you approve the plan.”
  - 同段 shell 第一种情况：“Interactive terminal sessions with bypass permissions available: neither the classifier nor a prompt applies to planning commands.”
  - bypass 段：“In interactive terminal sessions with bypass permissions available, Claude Code also doesn't enforce plan mode's blocks. Claude is still instructed to plan without editing, but a file edit or shell command it attempts during planning runs without prompting. Explicit ask rules and recognized `rm` and `rmdir` critical-path removals still prompt.”
  - 非交互段：“Plan mode keeps its blocks wherever Claude Code runs without an interactive terminal, including non-interactive runs with `-p`, Agent SDK sessions, and conversations in the VS Code extension's chat panel. There, `--allow-dangerously-skip-permissions` makes `bypassPermissions` selectable later.”
  - CLI reference：`--allow-dangerously-skip-permissions` 把 `bypassPermissions` 加进 `Shift+Tab` 模式循环、但不从该模式启动；示例是 `claude --permission-mode plan --allow-dangerously-skip-permissions`。
  - Agent SDK 的 plan 段：`permissionMode: 'plan'` 下文件编辑始终送到 `canUseTool`；即使同时设 `allowDangerouslySkipPermissions: true`，编辑仍走回调。
  - changelog 2.1.299：“Added a one-time note when plan mode won't ask before most edits or commands because bypass permissions is available.”
- **适用版本／平台**：仅交互终端；`-p`、Agent SDK、VS Code 聊天面板不适用。`--allow-dangerously-skip-permissions` 的官方示例只说明“可开始于 plan、之后再切 bypass”，不是本卡建议开启的操作。
- **结论**：**部分更正**。第一，“交互会话”应改成“交互终端会话”；VS Code 聊天面板虽是交互界面，Plan 拦截仍保留。第二，这个例外不只 shell：计划阶段的文件编辑同样不拦。第三，显式 ask 规则和关键路径 `rm`／`rmdir` 仍会询问；protected-path 写入在该会话里也会被放行。不要把该例外写成推荐的绕过方式。
- **建议最小改法（供负责人决定）**：把“可用 bypass permissions 的交互会话”改为“交互终端、且启动方式把 `bypassPermissions` 放进模式循环的会话”；补“这类会话连计划阶段的文件编辑也不拦，ask 规则和关键路径删除仍会问；`-p`、SDK、VS Code 聊天面板不算”。
- **未知**：desktop app 的对应行为文档未逐项列出；`Shift+Tab` 未批准直接退出后回到哪个模式，文档未写。

### 4. “严格只读须读工具或只读挂载且无外部写凭据”（页面 L48）

- **页面原句**：“需要严格只读时，只给读工具，或使用只读挂载且无外部写凭据的调查环境。”
- **直接来源**：
  - permission-modes：“Permission modes decide whether Claude asks before an action, and the Bash sandbox and outer isolation boundaries decide what an action can reach once it runs.” 这句话正面支持“不能靠模式名承担保护”。
  - Plan 段：Plan “writes a plan”；protected paths 的例外包含“The current session's own plan files in `~/.claude/plans/`, or in the `plansDirectory` you set”。
  - settings reference：`plansDirectory` 默认未设，即 `~/.claude/plans`；设置值相对项目根目录。
  - CLI reference 的 `--tools`：限制内置工具；“The flag doesn't affect MCP tools; to deny those too, use `--disallowedTools 'mcp__*'`.”
  - headless：普通 `-p` 会运行项目 `.claude/settings.json` 里的 hook、连接 `.mcp.json` 的服务器；`--bare` 跳过 hooks、skills、plugins、MCP 服务器和 CLAUDE.md。`--tools` 只限内置工具，不改变项目 hook 与 MCP 的加载面。
- **适用版本／平台**：当前 CLI。sandbox 的可用平台与配置层级不在本卡展开（与 A-PERMISSION-BOUNDARY-FACTS 去重）。
- **结论**：**页面作者建议，方向有官方依据，但不是官方保证**。官方没有“严格只读模式”这个承诺，也没有保证“只给读工具”就等于无写。单独限制内置读工具仍可能留下 MCP 工具、插件与 hook 的执行面；`--tools` 只管内置工具。只读挂载若只覆盖项目，Plan 默认还会写 `~/.claude/plans`；若把 home 也设成只读，计划文件写入失败的具体行为文档未写。作为建议可以保留，但应把“只给读工具”的操作含义写清。
- **建议最小改法（供负责人决定）**：“需要严格只读时，不要只靠 Plan：只给读工具（排除 Bash／Write／Edit 与 MCP 写工具，并关掉可执行 hook），或使用只读挂载且无外部写凭据的调查环境；Plan 默认还会把计划文件写到 `~/.claude/plans`。”
- **未知**：只读 home／项目挂载时计划文件写入失败的具体行为；读工具能否读到凭据属于保密问题，文档不提供保证；本机未验证任何 sandbox 或挂载。

### 5. “涉及真实数据或外部写操作时，应核有效权限与隔离，不能靠模式名承担保护”（页面 L48）

- **页面原句**：“涉及真实数据或外部写操作时，应核有效权限与隔离，不能靠模式名承担保护。”
- **直接来源**：
  - permission-modes 的“权限模式 vs sandbox／隔离”原句（见第 4 项）。
  - Review and approve：“Approving a plan exits plan mode and switches the session to the permission mode each approve option describes, so Claude starts editing.” 批准选项包括 “Yes, and use auto mode”“Yes, manually approve edits”“No, keep planning”；auto 不可用时第一项显示 “Yes, auto-accept edits”；若会话启动时已启用 bypass，则第一项显示 “Yes, and switch to BYPASS PERMISSIONS (no further prompts) for this session”。
  - bypass 段：即使 bypass，显式 ask 规则和关键路径删除仍会询问。
- **适用版本／平台**：当前文档。
- **结论**：**确认**。这句话是准确的，且是页面里最接近“批准≠授权”的表述。建议在它前面补一句转换关系，避免读者把“批准计划”当成一次性的外部写授权。
- **建议最小补句（供负责人决定）**：“批准计划只是退出 Plan 并切到所选权限模式（auto／Manual 逐条批准／bypass），不等于为外部写动作授权。”
- **未知**：无新增；具体外部动作是否被批准仍取决于该会话的有效规则与分类器。

### 6. 计划文件写入与退出后的权限（页面未写，目标要求）

- **页面状态**：L48 没有提计划文件写到哪里，也没有提批准后权限如何变化。
- **直接来源**：
  - Plan “writes a plan”；当前会话自己的计划文件在 `~/.claude/plans` 或 `plansDirectory`，属于 protected paths 的例外。
  - `plansDirectory` 默认未设，即 `~/.claude/plans`；设置值相对项目根目录。
  - 批准计划退出 Plan，切换到批准选项所描述的模式；按 `Shift+Tab` 也可以不批准直接退出 Plan。
  - Agent SDK：主会话在 plan 时，子 Agent 即使 `AgentDefinition` 设 `permissionMode: "acceptEdits"` 仍运行在 plan，编辑仍走 `canUseTool`；文档明确“Plan mode holds for the subagents you define too”。
- **适用版本／平台**：当前文档；SDK 的这条是 SDK 文档明确写的，其他宿主的子 Agent 继承未逐面核。
- **结论**：**页面缺一条对严格只读读者有用的操作事实**：Plan 不是“只在内存里想”，默认会写计划文件到 home；批准后不是继承 Plan 的限制，而是切到 auto／Manual 逐条批准／bypass。建议在严格只读处补计划文件路径，在批准处补模式切换。
- **未知**：`Shift+Tab` 未批准退出后回到哪个模式；计划文件写入失败时客户端行为；计划文件由哪个工具写入未单列。

### 7. 非交互、Agent SDK、VS Code 的入口范围（页面未写）

- **页面状态**：页面只给 CLI 命令，没有声称覆盖所有宿主；这里记录读者可能套用的差异。
- **直接来源**：
  - permission-modes：“The same `--permission-mode` flag works with `-p` for [non-interactive runs](https://code.claude.com/docs/en/headless.md).”（句内链接指向 headless 页）
  - headless：给出 `claude -p ... --permission-mode acceptEdits`／`auto` 示例；在 Manual 模式的 `-p` 运行中，需要批准的调用会被拒绝，除非有 `PermissionRequest` hook 或 `--permission-prompt-tool` 之类批准。
  - permission-modes：Plan 的拦截在 `-p`、Agent SDK、VS Code 聊天面板保留；`--allow-dangerously-skip-permissions` 只让 bypass 之后可选，不解除这些宿主的 Plan 拦截。
  - Agent SDK：`plan` 模式把文件编辑送到 `canUseTool`；auto 可用时规划阶段的命令默认不进回调，由分类器审；`allowDangerouslySkipPermissions: true` 也不放行编辑。
  - VS Code：Plan 用界面或 `claudeCode.initialPermissionMode`；扩展不读项目的 `permissions.defaultMode`。
- **适用版本／平台**：`-p` 与 SDK 为当前文档。当前文档口径是 v2.1.302 起 `-p` 无权限模式按 Manual 处理；changelog 2.1.302 另列了第三方提供商／遥测关闭／全新安装等生效范围，两者未逐条对齐。
- **结论**：**页面不构成错误，但不能把交互终端的 bypass 例外带到这些宿主**。若页面要覆盖非交互读者，补一句“`-p`／SDK／VS Code 聊天面板保留 Plan 拦截，需审批的调用可能被拒”即可。
- **未知**：`-p --permission-mode plan` 在 auto 不可用且无审批宿主时，非只读命令是“拒绝”还是“阻塞”，文档分别写了 Plan 会提示、`-p` 需审批的调用被拒，但没有单列这个组合；本机未实测。

### 8. 附：best-practices 引用可达性（页面 L14）

- **页面原句**：L14 依据链接 `https://code.claude.com/docs/en/best-practices#explore-first-then-plan-then-code`，核实 2026-10-26。
- **直接来源**：当前 `best-practices.md` 的二级标题中没有 “Explore first, then plan, then code”，全文也没有 Plan mode 段；当前页面讲的是 “Brainstorm with Claude first”“Change the permission mode”等。
- **结论**：**当前不可达**。不能据此说 2026-10-26 时该锚点不存在；只能确认现在无法从该链接核到“先计划”的依据。它不在“先 Plan”段三句的直接出处里（L56 的 Plan 依据是 permission-modes），所以不改变本单元对三句的判断；是否改引用由负责人决定。
- **未知**：2026-10-26 的官方页面原文或存档；本单元只读当前公开页面，未使用第三方存档。

## 来源与日期

官方文档页面不标内容发布日期；下表的“原始日期”按可核实信息写，读取日统一为 2026-11-03。HTTP `Last-Modified` 只反映构建时间，不作为内容日期。

| 来源 | 定位 | 原始日期 | 适用版本／平台 |
|---|---|---|---|
| 被核页面快照 | `docs/decisions/planning-and-tests.md@3ce1dad1`，L39、L48、L14 | 快照提交 2026-11-03；页内原核实日 2026-10-26 | base_ref `3ce1dad1` |
| Choose a permission mode | https://code.claude.com/docs/en/permission-modes 的 Available modes、Analyze before you edit with plan mode、Review and approve a plan、Skip all checks with bypassPermissions mode、Protected paths、Switch permission modes（`-p` 同标志句）、Critical-path removals in each permission mode、Which mode a session starts in | 页面未标内容日期 | 当前文档；v2.1.281、v2.1.283+、v2.1.302 等版本注记 |
| CLI reference | https://code.claude.com/docs/en/cli-reference 的 `--permission-mode`、`--allow-dangerously-skip-permissions`、`--tools` | 页面未标内容日期 | 当前 CLI |
| Settings reference | https://code.claude.com/docs/en/settings-reference 的 `useAutoModeDuringPlan`、`plansDirectory`、`permissions.defaultMode` | 页面未标内容日期 | 当前文档 |
| Run Claude Code programmatically | https://code.claude.com/docs/en/headless 的 `-p`、`--bare` 与 Manual 模式审批段 | 页面未标内容日期 | 当前文档；`-p` 无权限模式从 v2.1.302 起按 Manual |
| Agent SDK permissions | https://code.claude.com/docs/en/agent-sdk/permissions 的 Plan mode | 页面未标内容日期 | 当前 SDK 文档 |
| Permissions / read-only commands | https://code.claude.com/docs/en/permissions 的 Read-only commands、Hook approvals in plan mode | 页面未标内容日期 | 当前文档 |
| Claude Code changelog | https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md，2.1.212、2.1.218、2.1.299、2.1.302 | 条目只标版本，无日期 | 顶部版本 2.1.316 |
| Best practices | https://code.claude.com/docs/en/best-practices 当前页面 | 页面未标内容日期 | 当前文档；原锚点不可达 |

## 未验证与未知

- 本单元只读文档，**未运行 Claude Code、未复现任何 Plan 会话、未测试越界访问、未读本机配置或凭据**；文中的“行为”是官方文档契约，不是本机实测或安全保证。
- `Shift+Tab` 在未批准计划时退出后回到哪个权限模式，文档未写。
- 只读 home／项目挂载时计划文件写入失败的具体行为，文档未写。
- `-p --permission-mode plan` 在 auto 不可用且无审批宿主时，非只读命令是拒绝还是阻塞，文档未单列；按 Plan 段与 `-p` 段组合推测为拒绝，未实测。
- **Plan 下 hook／mod 的 `allow` 不能批准写操作，当前文档已写明。** permissions 的 “Hook approvals in plan mode” 规定：除 `ExitPlanMode` 外，`PreToolUse` hook 返回 `"allow"` 对文件编辑或其他非只读调用无效，调用仍得到与没有 hook 时相同的提示／阻止／批准（hook 的 `updatedInput` 仍会应用）；mod 处理 `tool.check` 也只能阻止这类调用、不能批准。批准计划或切到其他权限模式后解除该限制。交互终端且 bypass 可用时按第 3 项例外：该会话本就不拦计划阶段的编辑与 shell。Agent SDK 同口径：plan 下文件编辑即使 allow 规则匹配或 `PreToolUse` hook 返回 `allow` 也不自动批准，仍进 `canUseTool`。changelog 2.1.299 的 “Fixed plan mode running a write (an MCP tool's, a file's, a shell command's) that a `PreToolUse` hook or a mod's `tool.check` hook allowed” 是对违反该契约的历史修复记录，不作为当前行为依据。本机未实测，以上为文档契约；文档未覆盖的 desktop／web／mobile 宿主未逐面核。
- desktop／web／mobile 的 Plan 拦截、bypass 例外与批准选项细节，本单元未逐面核。
- 分类器对某条具体命令的放行结果取决于模型、组织规则与命令内容，本单元不推断。
- best-practices 在 2026-10-26 是否确有 `#explore-first-then-plan-then-code`，无官方存档可核。
- changelog 各版本的发布日期未取得：GitHub API 返回限流，未换身份或代理重试；只按版本号引用，不写推测日期。
- “严格只读”不是官方术语；本单元只核到页面建议与官方权限模式／隔离的区别，没有给出可复制的隔离配置。

## 检查与边界

| 检查 | 结果 |
|---|---|
| `python3 scripts/check_repo.py` | exit 0；719 files，0 errors |
| `python3 scripts/check_public.py` | exit 0；1181 files，0 findings |
| `python3 scripts/check_public.py --commits origin/main..HEAD` | exit 0；0 findings；本单元未新建提交，既有 HEAD 为公开安全的 noreply 身份 |
| `git diff --check` | exit 0（已对本文件执行 `git add -N`，空白检查覆盖新增文件） |
| 提交身份 | 本机 `user.email` 为内部邮箱，未用于提交、未写入本文件；本单元未提交、未推送 |
| 页面／模板／权限改动 | 无；只新增本文件 |
| 客户端／模型／浏览器／探针 | 未运行 |

本单元不提交、不推送、不切换分支、不改任务文件；结果交接收端按任务要求发布。
