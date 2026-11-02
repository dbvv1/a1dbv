# Agent 选择页官方事实核查

**结论：本机 Codex／Claude 配置的模型名、effort 取值与 CLI 参数有一手支持，但 Codex 的 `gpt-6.1-sol` 还要求账号有 Sol 访问（Free／Go 计划给 Luna）；Codex Cloud 一行把本机模型配置沿用到云端，需更正。另需补 Claude 最低 CLI 版本与 Astra 的 CLI ID，并把两处措辞降为推断。**

核查对象：`docs/01-agents/README.md`@`74be0d09b201cc0aacf925625899cf2d9bd03d3d`（页面 blob `b9928206`，与 `base_ref` `21b5f4ab` 的页面相同；下文 L 为该版本行号）。只核 30 秒结论、配置表、Claude 扩展／终端差异和云端边界；产品范围限于 Codex CLI／Cloud、Claude Code CLI／VS Code。读取日期 2026-11-03；网页文档没有独立文档版本号，表中以读取日期为准，模型与 CLI 最低版本写在对应行。未启动客户端、模型或浏览器，未核账号、额度、私有会话；关键引文另用原始 Markdown 全文复核，不以搜索摘要或工具摘要代替原文。

`origin/main` 的页面已前进到 `2bddaaf7`（blob `193d4d78`），改写了 30 秒结论开头、新增“本次采用”段，并改写页末结论句；核对的两条 bullet、三行配置表与依据行未变，结论对当前 main 同样适用。新开头及其中的 git-filter-repo 实作不在本单元范围。

## 会影响读者操作的差异

### 1. Codex Cloud 的模型句没有官方依据（更正）

页面 L20 写“模型仍按上两行，不因‘长任务’升最高档”。官方 [Workspace model availability](https://learn.chatgpt.com/docs/enterprise/workspace-model-availability) 明确：“Codex cloud doesn't support changing its default model.” 云任务的模型可用性由 “Models supported by hosted Codex workflows and the access available to the signed-in ChatGPT identity” 决定，workspace 的模型默认也不自动适用于 Codex cloud。[Codex 模型页](https://learn.chatgpt.com/docs/models)的 Astra／GPT-6.1 Sol 可用面只列 ChatGPT desktop／web、Codex CLI、Codex IDE extension，未列 Codex cloud；[云环境页](https://learn.chatgpt.com/docs/environments/cloud-environments)只描述环境选择、准备和发布，没有模型或 effort 选择。

因此“云端仍用本机两行的模型”没有官方依据，也与“默认模型不可改”不一致；本次没有找到云端任务级模型选择说明。建议改为：“云端模型由托管工作流决定，官方不支持修改默认模型；不要把本机型号直接套到云端。有对应模型访问权限时留本机 CLI／IDE 指定 `gpt-6.1-sol`／Astra；没有权限时换用可用模型。‘不为长任务一律升档’只适用于可选模型的本机入口。”官方 [Model selection](https://learn.chatgpt.com/docs/model-selection) 的 “keep the lightest setting that meets your quality bar” 支持后半句的原则，但不能推出云端可选模型。

### 2. Claude 型号有最低 CLI 版本，页面没写（补充）

[Claude 模型／effort 页](https://code.claude.com/docs/en/model-config)写明 Sonnet 5.5 需 Claude Code v2.1.284 或更高，Opus 5.5 需 v2.1.280 或更高；[VS Code 页](https://code.claude.com/docs/en/vs-code)说明扩展版本号就是它内置的 Claude Code 版本。页面只让读者“查看版本”，没给门槛。旧版终端或扩展跑不了这两个型号。

建议在本机行与困难行补最低版本，检查顺序仍按页面：扩展列表版本 + `claude --version`。另需补一句：扩展安装不会把 `claude` 加到 PATH；只装扩展时 `claude --version` 会失败，需先装 standalone CLI（[VS Code 页](https://code.claude.com/docs/en/vs-code)、[安装页](https://code.claude.com/docs/en/setup)）。

### 3. Astra 的 CLI ID 缺失（更正）

[Codex 模型页](https://learn.chatgpt.com/docs/models)的模型卡标题是 **Astra**，用法是 `codex -m gpt-6-astra`；Light 的配置值是 `low`（“In configuration, Astra's Light setting is `low`”）。页面写“GPT-6 Astra + Light（CLI 配置值 `low`）”，只给了显示名和 effort，没给可执行的 model ID；把“GPT-6 Astra”直接填给 `--model` 不是官方写法。

建议写成 `codex --model gpt-6-astra -c 'model_reasoning_effort="low"'`。页面“Light = CLI `low`”这一半正确；[Model selection](https://learn.chatgpt.com/docs/model-selection) 也列了 “Astra · Low” 的配对。

### 4. “扩展与终端版本可能不同”是推断，原文只说两套安装（措辞调整）

[VS Code 页](https://code.claude.com/docs/en/vs-code)原文：扩展为聊天面板内置一份私有 CLI；在终端运行 `claude` 需要 standalone CLI，扩展不会把 `claude` 加到 PATH；扩展版本号即其内置 CLI 版本。文档没有直接写“两者版本可能不同”，但两套独立安装使版本可以不同。页面的检查方法成立。

建议改成“扩展与终端是两套安装，版本各自独立；扩展版本号等于面板内置 CLI 版本”，不要把“可能不同”写成官方原句。

### 5. Cursor Cloud 是概括，不是带版本号的“修复”；且超出本次产品范围（措辞调整）

[Cursor release notes](https://prod.cursor.com/docs/release-notes) 的 Week of Oct 19, 2026 有两条：Cloud Agent 新建环境改用仓库 `.cursor/environment.json`，不再忽略；在指定 environment build 上启动的 Agent 使用该 build 记录的配置，而不是仓库当前文件或父 Agent 的新版本。原文没有“fix”措辞，也没有版本号（邻近版本标题是 v2026.10.22、v2026.10.17）。

页面说“曾修复”作为概括可读，但事实描述应落在“行为改为……”；本任务范围只到 Codex／Claude，Cursor 仅核这一条，不外推其他能力。

### 6. Claude Code 的 `medium` 是默认值，不是升档（操作提示）

[Claude 模型／effort 页](https://code.claude.com/docs/en/model-config)：Claude Code 里 Opus 5.5、Sonnet 5.5、Haiku 5.5 默认 effort 是 `medium`；[Anthropic 模型表](https://platform.claude.com/docs/en/about-claude/models/overview)的 API 默认则是 Opus 5.5 `medium`、Sonnet 5.5 `high`。页面的 `--effort medium` 有效，但在默认配置下等于默认，不会提高推理投入；要更高从 `high` 起。这与页面“验证要求高可从 `high` 起”一致，只是读者可能误以为 `medium` 是加强档。

### 7. 模型可用性按 provider／plan／产品版本不同（补充限制）

[Claude 模型／effort 页](https://code.claude.com/docs/en/model-config)的 alias 表：`sonnet` 在 Bedrock／Google Cloud 解析为 Sonnet 4.5、在 Claude Platform on AWS 为 4.6；`opus` 在 Microsoft Foundry 为 Opus 4.6。完整 ID `claude-sonnet-5-5`／`claude-opus-5-5` 在官方模型表存在，但是否可用仍看 provider／plan／组织限制。Codex 侧 [Model selection](https://learn.chatgpt.com/docs/model-selection) 写 “Availability, tools, reasoning settings, and usage limits differ by product and model version.”

Codex 侧还有账号级门槛：[config-advanced 的 One-off overrides from the CLI](https://learn.chatgpt.com/docs/config-file/config-advanced#one-off-overrides-from-the-cli) 原文 “The model overrides below also require GPT-6.1 Sol access. If you don't have access, substitute a model available to you:”；[models 页](https://learn.chatgpt.com/docs/models)的 GPT-5.5 retirement 段写 “On Plus, Pro, Business, Enterprise, and Edu plans, choose GPT-6.1 Sol (gpt-6.1-sol) when available. On Free and Go plans, choose GPT-6 Luna (gpt-6-luna) in the desktop app when available.” 因此 `codex --model gpt-6.1-sol` 只对具备 Sol 访问的账号成立；Free／Go 或未获授权时本机同样跑不通，须换用可用模型。本次未核任何账号，只确认命令写法，不能确认读者可用。

页面已经要求“核会话实际模型／effort”，保留；困难行的“Opus 5.5”建议给完整 ID，避免把 alias 当固定版本。

## 核实表

| 页面原句／位置 | 对应原始来源（读取 2026-11-03） | 版本／日期 | 确认或更正 | 仍缺什么 |
|---|---|---|---|---|
| L11：“扩展自带一份 CLI，终端使用独立安装，两者版本可能不同” | [code.claude.com/docs/en/vs-code](https://code.claude.com/docs/en/vs-code) | 页面无文档版本；扩展版本号 = 内置 CLI 版本 | 支持“两套安装、扩展版本号即内置 CLI 版本”；“版本可能不同”是推断，原文未直说 | 官方没有并排版本对照句 |
| L11：“缺 CLI 专属功能时先回终端” | 同上，CLI／扩展功能对照表 | 同上 | 确认：commands／skills 仅部分可用，`!` Bash 快捷键与 Tab completion 扩展没有 | 未在扩展里实跑 |
| L11：“在扩展列表查看扩展版本，再运行 `claude --version`” | [vs-code](https://code.claude.com/docs/en/vs-code)、[setup](https://code.claude.com/docs/en/setup) | 同上 | 确认：Extensions view 显示扩展版本；`claude --version` 输出版本号 | 只装扩展时 `claude` 不在 PATH，页面未提示 |
| L12：“Cursor Cloud 曾修复忽略仓库 `.cursor/environment.json`、指定 build 却使用其他配置” | [prod.cursor.com/docs/release-notes](https://prod.cursor.com/docs/release-notes) | Week of Oct 19, 2026；无版本号 | 确认两条行为变更；“修复”是概括；改动无版本号 | 无法从 release note 判断旧版本范围 |
| L14：Sentry 共享项目规则链接 | [getsentry/sentry AGENTS.md@65d8ecc](https://github.com/getsentry/sentry/blob/65d8ecc0bd1b4825afbde7bd05e5fd52e3511c4d/AGENTS.md) | 固定 SHA `65d8ecc0bd1b4825afbde7bd05e5fd52e3511c4d` | 确认：文件是 AI agent instructions 的 source of truth，要求按区域更新 AGENTS.md | 未核该提交之后是否更新 |
| L14：Reddit 三工具采用讨论 | [reddit.com/r/cursor/comments/1wfeim1/claude_code_vs_codex_vs_cursorwhat_are_you/](https://www.reddit.com/r/cursor/comments/1wfeim1/claude_code_vs_codex_vs_cursorwhat_are_you/) | 页面无日期 | 未核：社区帖，本机按 ops§2.2 打不开 Reddit（curl 返回 000）；非官方事实 | 原帖内容、发帖时间、样本量 |
| L18：`codex --model gpt-6.1-sol` | [learn.chatgpt.com/docs/models](https://learn.chatgpt.com/docs/models)、[config-advanced](https://learn.chatgpt.com/docs/config-file/config-advanced) | 读取 2026-11-03；Sol 未标 CLI 最低版本 | 部分确认：精确 ID 为 `gpt-6.1-sol`，官方示例 `codex -m gpt-6.1-sol`／`codex --model gpt-6.1-sol`；Codex CLI／IDE 在可用面内，但同节要求 GPT-6.1 Sol access，Free／Go 计划给 Luna | 旧版 CLI 是否支持未标；未运行、未核账号是否有 Sol 访问 |
| L18：`-c 'model_reasoning_effort="medium"'`（只覆盖本次启动） | [config-advanced](https://learn.chatgpt.com/docs/config-file/config-advanced)、[config-reference](https://learn.chatgpt.com/docs/config-file/config-reference)、[model-selection](https://learn.chatgpt.com/docs/model-selection) | 读取 2026-11-03；无文档版本 | 确认：`-c`／`--config` 是单次覆盖，值按 TOML 解析；`model_reasoning_effort` 可取值 `low`／`medium`／`high`／`xhigh`／`max`／`ultra`，可用级别取决于模型和客户端；官方列出 “GPT-6.1 Sol · Medium” 配对 | 官方没有给出该 key 的单次 `-c` 示例；未运行 |
| L18：`claude --model claude-sonnet-5-5 --effort medium` | [cli-reference](https://code.claude.com/docs/en/cli-reference)、[Anthropic 模型表](https://platform.claude.com/docs/en/about-claude/models/overview)、[model-config](https://code.claude.com/docs/en/model-config) | Sonnet 5.5 需 Claude Code v2.1.284+；读取 2026-11-03 | 确认：`--model` 接受完整模型名，`--effort` 取值含 `medium`；API ID `claude-sonnet-5-5` 存在；Claude Code 默认 effort 为 `medium` | 页面未写 v2.1.284 门槛；provider／plan 可用性未核 |
| L19：“GPT-6 Astra + Light（CLI 配置值 `low`）” | [models](https://learn.chatgpt.com/docs/models)、[model-selection](https://learn.chatgpt.com/docs/model-selection) | 读取 2026-11-03；Astra 未标 CLI 最低版本 | 部分确认：官方名 Astra，CLI ID `gpt-6-astra`，Light = `low`，配对 “Astra · Low” 存在；页面未给 ID，名称也不精确 | 页面需补 `gpt-6-astra`；旧版 CLI 是否支持未标 |
| L19：“Claude Code 选 Opus 5.5 + `medium`” | [Anthropic 模型表](https://platform.claude.com/docs/en/about-claude/models/overview)、[model-config](https://code.claude.com/docs/en/model-config) | Opus 5.5 需 Claude Code v2.1.280+；读取 2026-11-03 | 确认：ID `claude-opus-5-5`；`medium` 为 Claude Code 默认且受支持；页面未给完整 ID | 页面未写 v2.1.280 门槛；alias `opus` 在 Foundry 为 Opus 4.6 |
| L19：“验证要求高可从 `high` 起；只有检查深度不足时先试 `medium` → `high`” | [config-reference](https://learn.chatgpt.com/docs/config-file/config-reference)、[model-config](https://code.claude.com/docs/en/model-config) | 读取 2026-11-03 | 确认：`high` 是 Codex／Claude 共同支持的级别；Claude 支持 `low`／`medium`／`high`／`xhigh`／`max` | 未验证实际质量收益 |
| L20：“选择已发布环境；没有就先准备仓库、依赖和检查并核结果后发布” | [environments/modes](https://learn.chatgpt.com/docs/environments/modes)、[cloud-environments](https://learn.chatgpt.com/docs/environments/cloud-environments) | 读取 2026-11-03；无文档版本 | 确认：cloud task 需要可访问的已发布环境；创建时检查仓库、安装依赖和工具、试跑工作流，审阅 setup report 后发布 | 未实际创建或发布环境 |
| L20：“模型仍按上两行，不因‘长任务’升最高档” | [workspace-model-availability](https://learn.chatgpt.com/docs/enterprise/workspace-model-availability)、[models](https://learn.chatgpt.com/docs/models)、[model-selection](https://learn.chatgpt.com/docs/model-selection) | 读取 2026-11-03 | 更正：官方明确 “Codex cloud doesn't support changing its default model”；Astra／Sol 可用面未列 Codex cloud，本次也未找到任务级选择说明。页面“仍按上两行”无依据；后半句“不因长任务升最高档”与官方 “keep the lightest setting that meets your quality bar” 方向一致，但只适用于可选模型的入口 | 客户端后续是否提供任务级选择，需新来源 |
| L20：“本机 VPN、浏览器登录或设备是必要条件时，留本机入口” | [environments/modes](https://learn.chatgpt.com/docs/environments/modes) | 读取 2026-11-03 | 确认：计算机本地文件、运行进程、浏览器登录和 VPN 不会自动转到 cloud task | “设备”未逐字出现，属对本地资源的概括 |
| L7：“`--version`／`--help` 成功不等于模型可用” | [setup](https://code.claude.com/docs/en/setup)、[models](https://learn.chatgpt.com/docs/models) | 读取 2026-11-03 | 确认：`claude --version` 只输出安装版本；模型可用性另按产品、版本和身份判断 | 未运行，无法给本机实际模型清单 |
| L7：“模型依据见 02” | 本仓 `docs/02-models-and-cost.md` | 未读 | 未核：不在本任务官方来源范围 | 需另页核对 |

## 已核范围与结论边界

- **事实核查结论**：本机 Codex／Claude 的模型名、effort 取值和 CLI 参数有一手支持，但 Codex 的 `gpt-6.1-sol` 需账号有 Sol 访问；Codex Cloud 的模型句需更正；Claude 最低版本、Astra 的 CLI ID 需补；扩展／终端“版本可能不同”与 Cursor“修复”应降为推断或行为概括。没有发现需要改推荐的其他事实错误，也未新增推荐。
- **真实采用分开**：本次未启动任何客户端或模型，未核账号、额度、私有会话，也未在真实任务中比较效果。页面“待真实任务验证”的结论不变；事实核查通过不等于本机账号可用或采用验收通过。
- **未覆盖**：`codex.md`、`claude-code.md` 等深页；对比矩阵其余单元格；Claude Web／Projects 云端入口；Gemini、OpenCode 等非本任务产品；Cursor 除 L12 外的能力；页面 L14 Reddit 社区帖；页面新开头的 git-filter-repo 实作。
- **受阻项**：OpenAI Help Center 文章返回 403，未绕过；改用官方 `learn.chatgpt.com` 的 Workspace model availability 与云环境页。Reddit 按 ops§2.2 本机不可读（curl 返回 000），保留原帖链接 `https://www.reddit.com/r/cursor/comments/1wfeim1/claude_code_vs_codex_vs_cursorwhat_are_you/` 与内容、发帖时间、样本量缺口。链接可达只作线索，以上结论均回到读到的正文。
