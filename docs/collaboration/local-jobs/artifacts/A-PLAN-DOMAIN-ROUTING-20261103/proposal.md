# A-PLAN-DOMAIN-ROUTING-20261103 · 规划实现时保留领域入口

> 核查基准：`ec246c5d` 的 `docs/decisions/planning-and-tests.md`、`docs/07-workflows.md` §2、`docs/decisions/skills-and-plugins.md`；上游固定提交 `958f787`（修复前）、`5e183ce`（PR 分支上的修复提交）、`4f45ad9`（PR #4371 合并树）、`41768da`（作者结果）与 `06b458f`（2026-11-02 现状）。核查日期 2026-11-03。本文件只交候选稿，不改页面正文；只读公开仓库与文档，未运行探针、未执行 fixture、未实施 tinted 外观。

## 结论

**缺口成立，补一段入口选择和一个短请求即可，不改现有 Plan 默认与权限边界。** 问题不在“该不该先 Plan”，而在“只规划”被当成了任务类型：读者说“规划改 Button 外观”时，要改的对象仍是组件实现与公开外观集，应按组件实现工作流读类型、契约、样式和测试；只有“只写外观需求契约”或“只判断契约是否可行”才是 contract-only／可行性任务。现有页已正确区分 Plan 与直接实现，也已有“Plan 名称不是严格只读”的段落，缺的是把“改什么”和“这一轮允许做什么”分开。

上游修复给出的正是这个分界：路由按任务对象走，`plan-only` 从 contract-authoring 行移到 authoring 行；authoring 工作流增加“步骤 1–4 不编辑，返回计划中的契约修订、用到的参考、实现次序和验证计划”的分支；contract-authoring 只保留 contract-only 与契约可行性。作者报告修后单次探针读齐 5 份必需文件、过 2 条断言，输入 tokens 比修前多 22%；这是作者的单次报告，不是本仓复跑或普遍收益。

**若只采用一处，优先放“规划按要改的功能／领域选入口；只规划只停编辑，不把实现任务改判成契约任务”。** 它直接挡住“看到 plan-only 关键词就进 contract-only”的错误；其余条件放在同一段和短请求里，不新增路由表。

## 可直接采用的增补稿

### 1. `planning-and-tests.md`“先 Plan”段内

**插入位置**：`docs/decisions/planning-and-tests.md` 第 46 行现有请求块结束后、第 48 行“**Plan 用来先审方案，不提供严格只读隔离。**”之前。现有 `claude --permission-mode plan` 入口、三行调查请求和第 48 行权限段落均保留原文。

以下为可粘贴正文：

---

**先把“改什么”和“这一轮允许做什么”分开。** 规划实现时，按将要改变的功能或领域选资料与现成工作流，再限定本轮只调查；“只规划”停的是编辑，不把实现任务改判成契约任务，也不减少类型、组件／平台模式、契约和验收依据。例如在已有组件库规划给 Button 加一种外观，入口是该库的组件 authoring 工作流，沿它读包与组件的契约、类型与 slots、样式／token 契约、同类实现和测试。只写外观需求契约、或只判断契约是否可行，才直接走 contract-only／可行性入口；已有明确实现目标和验收的改动不因用了 Plan 就改走契约流程。已有单一领域入口能回答、没有实现决定缺口时，沿原入口直接做，不为本段加流程。

---

### 2. 可复制的短请求补充

**用法**：接在现有三行调查请求之后；若任务更适合专用版本，也可替换同位置的三行请求，但保留 `claude --permission-mode plan` 入口。方括号替换成任务事实。

```text
任务对象：[要改的功能、组件或模块；对应领域的入口文件或 Skill]。
本轮只规划、不编辑：沿该领域入口读它要求的契约、同类实现和测试；需要时再读类型、样式和平台模式。
交回：变更位置与次序、必须保留的行为、验收命令，以及仍需我决定的取舍。
范围只限本次改动；不因“只规划”跳过实现依据，也不扩到无关规则。
```

这段不要求所有规划都读 5 份文件；文件数由领域工作流和本次改动决定。Fluent UI React Native 的固定 5 份只作为下面一个具体案例的证据。

### 3. 并入本节末“依据”

在第 58 行现有“依据”段末追加（同一事实只在这里留一次）：

> [一手项目配置；作者单次报告] [Fluent UI React Native 的 agentic 路由修复](https://github.com/microsoft/fluentui-react-native/commit/5e183ce7fcea936d112543cc2799b0f8581c614d)（合入 [PR #4371](https://github.com/microsoft/fluentui-react-native/pull/4371)，合并提交 `4f45ad9`，2026-10-15）把“plan-only”从 contract-authoring 行移到 authoring 行，并在 authoring 工作流加入步骤 1–4 不编辑的分支；[作者结果](https://github.com/microsoft/fluentui-react-native/blob/41768dacc889222444c538ce6031fe668f06043f/agent-improvements-plan.md#L149-L159)报告 GPT-6.1 Sol 单次开发探针修后读齐 5 份必需文件、过 2 条断言，输入 tokens 比修前多 22%，核实 2026-11-03。本仓未重跑探针、未实施 tinted 外观。

## 原句与缺口

| 位置 | 原句或现状 | 已经说了什么 | 缺口（不是事实错误） |
|---|---|---|---|
| 第 36 行 | “需要先审方案、摸清陌生模块或澄清关键取舍时，先用 Plan；已经明确的局部修改直接做。” | 选择何时用 Plan | 没说什么算“摸清”：读者只规划实现时，仍需要类型、组件／平台模式、契约和测试依据 |
| 第 43–45 行 | “先调查 [目标路径]，本轮不实现。交回：现有行为依据、受影响入口、必须保留的契约、建议改法和验收命令。” | 给目标路径和交回项 | 没让读者先选领域入口；也不区分“规划改实现”和“只写契约”，容易被 plan-only 关键词带到窄入口 |
| 第 48 行 | Plan 会写计划文件；auto 可用时 shell 由分类器审核；bypass 与 `-p`／SDK／VS Code 另有范围 | Plan 不提供严格只读隔离 | 本稿保留原段，不据此把入口改进当权限保证 |
| 第 52–56 行 | “计划只记录实施者不能自行决定的内容”；函数体留给实现者 | 计划产物只留决定、测试断言和验证命令 | 本稿不重复；只补“规划前读哪些领域依据、从哪个入口进” |
| `07` §2 | 默认原生 Agent＋项目反馈；先读入口、相似实现、测试和运行命令 | 默认路线与加窄规格的条件 | 没回答“只规划实现时，按关键词还是按任务对象选入口” |
| `skills-and-plugins` | “已有能力够用就沿用”；按缺口选一项补充 | 不重复安装、按缺口选 Skill | 本稿沿用，不新增 Skill 路由表 |

结论：上述现有内容均成立，且没有覆盖“plan-only 是当前动作，不是任务对象”这一选择，因此补一段而非改写整页；第一张表的直接实现／调查／测试／短规格选择和 Plan 权限段都不动。

## 旧路由到新路由：固定提交的实际差量

上游把“plan-only”放在 contract-authoring 的任务行里，模型按关键词选择了该行，跳过 authoring 工作流和 `types-and-slots`。修复把任务对象写回路由行，并把只规划分支放进 authoring 工作流。

| 位置 | 修复前（`958f787`） | 修复后（`5e183ce`，内容见 `4f45ad9` 树） |
|---|---|---|
| 根 `AGENTS.md` 路由 | “Agentic contract-only, feasibility, or **plan-only** work” → `agentic-component-contract-authoring` | “New component, or change **or plan a change to** an agentic component or primitive” → `agentic-component-authoring`；“Agentic contract-only **or contract-feasibility** work” → `agentic-component-contract-authoring` |
| `references/agents/components/classification.md` §1 | “Contract-only, feasibility, or **plan-only** agentic contract work” → contract-authoring | “Change, **or plan a change to,** an existing agentic component or primitive” → authoring；“Agentic contract-only or contract-feasibility work” → contract-authoring |
| `agentic-component-authoring/SKILL.md` | 描述只写 “Implement or change”；工作流没有只规划分支 | 描述加 “or plan changes to”；工作流加：“For a plan-only request, follow steps 1 to 4 without editing, then return the planned contract revision, the references used, the implementation order, and the validation plan.” |
| `agentic-component-contract-authoring/SKILL.md` | 直接用于 “contract-only, feasibility, or implementation-plan requests”；请求模式叫 “Feasibility or plan only” | 直接用于 contract-only 或 contract-feasibility；改实现或公开 API 的计划从 authoring 开始；模式改为 “Feasibility or contract plan”；“Commit contract files only when the user requested a contract.” |
| contract-authoring 的 token 步骤 | 只写 FURN token bindings and gaps in `spec/tokens.yaml` | 增加经 Flex token map 映射；“Name each proposed binding or list it as unresolved.” |
| `contract-sources/flex-x3.md` | 只说 “Consult the Flex token map” | 补上 Flex token map 的直接链接 |

合并方式说明：PR #4371 合并为单个提交 `4f45ad9`（单父提交），所以 `5e183ce` 是 PR 分支上的提交，不在 `main` 的历史里；上述修复内容已包含在 `4f45ad9` 的树中。`958f787` 只是 `5e183ce` 的父提交，其树即修复前基线；根路由行与 `classification.md` 的当前形态由同 PR 的 `3d1076b82a`（“Reorganize agent instructions into shared references”）引入，`958f787` 本身只新增 routing 校验约定与脚本。

## 固定 fixture 与两个入口

固定输入为 [agentic-button-appearance-plan.json](https://github.com/microsoft/fluentui-react-native/blob/4f45ad9bfdc3abf6a3428d92073353551bfeec12/references/agents/evals/cases/agentic-button-appearance-plan.json)。其真实内容如下（摘要，不是执行结果）：

- `task_mode: "plan"`，`prompt: "Plan adding a new 'tinted' appearance to the agentic Button in packages/agentic/components/src/components/button. Plan only."`
- `expected.skills: ["agentic-component-authoring"]`；`classification.implementation_model: "agentic-higher-order"`，`public_compatibility: ["ref-prop"]`，`native_platforms: []`。
- `required_reads` 5 项：`packages/agentic/components/AGENTS.md`、`packages/agentic/components/src/components/AGENTS.md`、`packages/agentic/components/src/components/button/SPEC.md`、`references/agents/components/agentic/types-and-slots.md`、`references/agents/components/agentic/styles-and-tokens.md`。
- `forbidden_actions: ["edit-files"]`。
- 两条断言：`contract-before-code`（公开外观集变化时，先计划契约修订与评审，再实现；`R-AGENTIC-001`，来源为 button `SPEC.md`）；`token-source`（把新外观映射到 Flex tokens 并记录 token 缺口；`R-DESIGN-001`，来源为 `flex-token-map.yaml`）。

### 问一：计划给 Button 加 tinted 外观，用什么入口？

**入口是 `agentic-component-authoring`，不是 `agentic-component-contract-authoring`。** 这是“改实现或公开 API 的计划”，任务对象是组件实现与其公开外观集；contract-authoring 只在契约缺失、过期、仍是草稿或伴随新来源证据时，作为 authoring 步骤 2 的契约门被调用，读完并完成预代码评审后仍回到规划，不取代 authoring 工作流。

不能省的资料：

- authoring 工作流步骤 1–4 要求的包说明与组件契约（`SPEC.md`、`spec/source.json` 及它引用的 React Native companion，或 primitive 的 `CONTRACT.md`）、最近同类实现和公开契约维度（variants、slots、native props、accessibility、interaction、platform behavior）。
- 本 fixture 的 5 项 `required_reads` 是这个案例的要求集；其中 `types-and-slots` 与 `styles-and-tokens` 正是被错误路由跳过的实现领域知识。
- 验收依据来自步骤 9 的相关测试／构建命令；规划要返回验证计划，不把“计划写完”当实现完成。

本轮仍禁止：fixture 明列 `edit-files`；只规划不实现，不写契约文件，不运行有副作用的命令。分类还把公开兼容面标为 `ref-prop`、原生平台为空，规划需保留该兼容面，不扩成原生改动。两条断言要求计划先给出契约修订与评审，并把新外观映射到 Flex tokens、记录 token 缺口。

### 问二：只写外观需求契约，用什么入口？

**入口是 `agentic-component-contract-authoring`，直接进入。** 该 Skill 拥有来源解释、权威与出处、不确定项、React Native 适配、分歧和需求规划，不拥有组件实现。

不能省的资料：包说明、现有 `SPEC.md`、`spec/` 下全部 companion 与 `SPEC-SOURCE.md`（步骤 1 要求；已评审契约除新证据或明确需求变更外不重审）、证据对应的来源 adapter（例如 Flex/X3、Fluent v9、HTML/CSS、图像等，按提供的证据加载，不多加载）、Flex token map、公开 API 与 slots、可访问性与交互需求、来源权威与不确定项。需要判断可行性时才读同类实现；不要求读 authoring 专用的 `types-and-slots`、`styles-and-tokens` 等实现参考，仍须读包说明、现有 `SPEC.md`、`spec/` companions 与 `SPEC-SOURCE.md`。

本轮仍禁止：不写组件实现；契约文件只在任务要求契约时提交（本题要求，所以契约文件是交付物）；契约可行性模式只描述契约工作，不改变实现。与问一的区别是：问一交付的是“计划中的契约修订与实现次序”，问二交付的是“契约文件本身”。

## 修后结果与证据边界

作者在 [agent-improvements-plan.md L149–159](https://github.com/microsoft/fluentui-react-native/blob/41768dacc889222444c538ce6031fe668f06043f/agent-improvements-plan.md#L149-L159) 记录：

- 探针为只读 Copilot CLI 1.0.98，one run per case，基线 `a1fd5c65d`；GPT-6.1 Sol high、long context，8 个 development cases，独立评分。
- 修复前该 case 进入 contract authoring，跳过 authoring recipes；`5e183ce7f` 修复后，recheck 到达 authoring skill，读齐 5 份必需文件，过 2 条断言，输入 tokens 比修前多 22%。

边界：

- 这是作者的单次探针报告；本仓没有重跑，也没有执行 fixture，不能称独立复现。
- 22% 只是该次取舍的输入成本，不是“多读必然更好”的证据；不能据此给 Skill 整体判胜负或成本收益。
- 固定 fixture 来自真实团队评估，但模拟规划不等于完成组件交付，不称 tinted 外观已实现或原生加载已验证。
- 当前旁证 `06b458f`（2026-11-02）仍保留新路由行与 authoring 的“步骤 1–4 不编辑”分支；但 fixture 的 5 个路径有 3 个已演进：`types-and-slots.md`、`styles-and-tokens.md` 移到 `packages/agentic/components/references/`，`src/components/AGENTS.md` 不再单独存在。因此不能用历史 fixture 直接判当前树缺文件，也不把路径演进当路由回退。

## 权限边界与不适用

**不把领域路由当权限或隔离保证。** 本候选只改“先读哪些资料、从哪个入口进”，不改变 Plan 的实际权限；第 48 行“Plan 用来先审方案，不提供严格只读隔离”保留。任务写“只规划／只读”也不因此授权实现、运行有副作用的命令或写契约文件；需要严格只读时仍按原段的工具与隔离核对。

**不适用：**

- 已有单一领域入口能回答任务：沿用现有入口，不新增路由；这与 `skills-and-plugins` 的“已有能力够用就沿用”一致。
- 纯规格／契约可行性调查：继续 contract-only／可行性窄入口，不先走实现工作流。
- 没有实现决定缺口、目标和验收已明确：直接做，不因本段一律先 Plan。
- 计划产物的缩减：沿用 `07` §2 与本页“计划只记录实施者不能自行决定的内容”，本候选不重复“计划不复制函数体”。

## 去重与归属

- 固定树检索未发现同题计划路由稿件（仅本文件命中 `plan-only`／`contract-authoring`）；两张已取消广扫按任务记录不接续、不细分重派；本卡只写本文件。
- `A-PLAN-MODE-FACTS-20261103` 只核 Claude Plan 的权限与只读边界，已接收 `6a82ac9` 的事实修订；本卡不重做权限、不接续或拆分该题。
- `A-LAGE-FRESH-VALIDATION-20261103` 只核 Lage 缓存恢复，与本卡的入口选择无关。
- 未知页面／模板旧 writer 继续隔离；本卡不改 `planning-and-tests`、`07`、`skills-and-plugins`、研究页、模板、`13`、`TASKS`、其他卡或接收器。

## 未做与边界

- 只读公开提交、文件与 GitHub API；未安装、未运行上游项目或模型，未执行 fixture，未实施 tinted 外观，未向上游改 Skill 或投稿。
- 未读取本机配置、账号、凭据、私人会话或用量日志；产物不含本机绝对路径或内网地址。
- 本稿为静态核对的候选稿，不是模型采用、原生 Skill 加载或组件实现成功的证据。若负责人认为现有页已覆盖同一选择，应按负结果处理，不硬加段落。

## 检查

- `python3 scripts/check_repo.py`：744 files，0 errors。
- `python3 scripts/check_public.py`：先 `git add -N docs/collaboration/local-jobs/artifacts/A-PLAN-DOMAIN-ROUTING-20261103/proposal.md` 再跑，1210 files，0 findings（已覆盖本文件）；跑后用 `git reset -- <path>` 撤销 intent-to-add。模式扫描不替代人工读 diff。
- `git diff --check`：工作树无已跟踪改动；新增文件另用 `git diff --no-index --check /dev/null <proposal.md>` 核对，无空白错误；UTF-8、LF、无 BOM、无行尾空白。
- 提交身份：未提交；当前工作区 `user.email` 为公司地址，接收端提交时须按仓库要求改用 noreply 身份。
- 本文件是唯一改动；任务文件、页面与其他产物未改。
