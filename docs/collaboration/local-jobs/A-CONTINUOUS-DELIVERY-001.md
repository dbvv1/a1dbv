# A-CONTINUOUS-DELIVERY-001 · 为真实连续修改选择采用任务

id: A-CONTINUOUS-DELIVERY-001
owner: dot-A
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 795c8f6c06607b6931ae19b45451b949825c77ec
result_branch: relay/a-continuous-delivery-001

## 目标与已有结论

继续AI coding与M6的正向方法选择，不再横向试工具。Memos阅读模式已接收工程补丁但真实浏览器待验；OpenSpec MDX已有CLI与静态组件接收，两者不扩测试矩阵。上一项A-CODING-ADOPTION-001已确认跨子树知识加载的重要缺口，但不建议自研Codex内核；本任务不要重做该研究或为了证明它虚构monorepo案例。

寻找一个当前真实开源需求，适合已有项目的连续功能修改或复杂诊断／优化，并可用当前获准的CLI、库消费者或实际文件产物直接验收。先说明哪项编码Agent能力值得增强，再找自然任务；不把普通库bug修复、换一个仓库、Agent写过代码当方法增量。选择可以采用原生Agent＋已有项目知识／定向反馈；若现成方案更好，明确复用理由，不要求新增框架或新工具。

## 调查与选择

先读固定长期提示词、TASKS当前重点、运行手册§7／9、07现有任务路线及上述两项采用结果，按需读相关专题。沿已配置本地模型正常Workflow，官方机制、实际开发者原帖与开源实现三方对照。先核未决issue、最新实现和在制PR；已经解决或维护者明确不接收的，不作为默认实施目标。候选足以作选择就深入一项，不凑数量。

交回一个明确选择，或具体且可复用的负结果：
- 原始需求、真实消费者、固定SHA、许可与现有实现缺口；不能假设能取得私人项目。
- 当前推荐组合及一个有竞争力的替代，说明何时更值得用、何时撤回。基于机制和现有证据判断，不开展正式方法对照或模型benchmark。
- 首个可运行交付的具体改动范围、必要项目知识与现成检查、保留行为、真实消费者命令、后续自然变化（有才写，不硬造二改）。
- 哪个反馈会改变实现或路线，而不仅是让检查变绿；对应读者正文入口与可复用资产。

本任务是负责人选择前的调查输入，不授权直接写产品或宣称真实采用完成。不得新建工具目录／编号专题、搜索器、流程框架或证明台账。

## 写入与权限

只改本任务文件，结果写清推荐、依据、精确恢复条件与实际模型／客户端；不改主专题、其他任务、上游代码，不发issue／PR／评论、不部署。公开材料仅读取，不读取私人历史、账号用量、连接配置、秘密或公司代码。沿既有公开授权，不付费、不创建凭据、不启动浏览器／服务／demo／账户数据库，不重试任何已明确拒绝动作，也不通过替代入口绕过。

认领发布后执行，已有调用只接续，独立任务可以并行；用一次有效独立核查覆盖推荐与来源，修订只复查变化。保留实际响应可核型号，别名与实际型号分开，原始私人日志不入库。纯文档按§7运行文档／公开文件／提交身份与空白检查，推指定结果分支，回写review_ready及固定SHA，由dot-A接收选择。Git发布不等于模型已运行。

## 执行与结果

已由本地执行端认领并完成本次调查，交 dot-A 选择。

认领：dot 本地协作；2026-10-24T23:36:15.309465+00:00。任务来源main固定提交 `ed232d7`。与现有交付无写入重叠，先发布认领再沿既有原生Workflow执行；仅写本任务授权文件，保留原始结果，成果推指定分支由dot-A接收。

## 调查结果（2026-10-25，research 阶段）

**建议：下一项真实连续修改采用 cspell 的“未使用 inline 词条（抑制/自定义词）”报告。第一交付只做默认关闭的词级 `ignore`/`ignoreWords`/`words` 报告，用 cspell 自身源码与 CLI 验收；配置词表清理复用现成 `cspell-check-unused-words`，不在本轮重做。** 这是条件选择：维护者尚未承诺接收，先按 cspell 的 `docs/feature-design.md` 写一页设计；若维护者要求放到外部 reporter/工具，撤回核心入口并复用现成实现。

### 1. 要增强的能力与消费者结果

**能力：在成熟 lint 管线里判断“一个 inline 抑制是否仍改变验证结果”，而不是再加一条规则。** Agent 要读懂指令解析、验证、报告三层，先用项目自身真实语料和 CLI 建立“哪些抑制真正压住了问题”的判据，再实现默认关闭的报告，并保持默认检查、退出码和 reporter 契约不变。

**消费者结果：** 用户和 CI 能找出不再需要的 inline `cspell:ignore`/`ignoreWords`/`words` 词条，缩小过宽忽略表或自定义词表，减少它掩盖新拼写错误的可能。cspell 仓库自身可作为真实语料和消费者：`packages`/`docs`/`fixtures` 中约有 610 行匹配 inline 指令模式；静态初扫提示 `DefaultSettings.ts:24` 的 `filetypes`、`GlobMatcherTypes.ts:1` 的 `fname`、`findUpFromUrl.ts:21` 的 `hrefs` 等候选，但这不是 cspell 的解析结果，不能当作已确认未使用。

**会改变实现/路线的反馈：** 第一版若按“词是否在文件中出现”判断，会碰到三种真实情况：指令文本自身被算作出现；`hrefs` 出现在 `stopAtHrefs` 的 camelCase 中、`filetypes` 出现在 `enabledFileTypes` 中，词法边界、大小写和复合词规则会改变结论；一个词在文本中出现但已由字典接受，指令是冗余而非缺席。真实 CLI 输出会迫使设计明确“缺席/冗余”两种语义，并改用“去掉该指令后是否还会报错”的反事实判断（或等价跟踪），而不是把测试改绿。若反事实二次验证在仓库规模上过慢，会迫使改为单次遍历跟踪或独立命令；这些是路线变化，不只是检查通过。

依据：cspell 固定提交 `a8589bff9bfdd80bde19bb0ac87e0e040ae8a1c3` 的源码与仓库内 inline 指令静态清点；[#808](https://github.com/streetsidesoftware/cspell/issues/808) 的维护者 2021-01-24、2021-12-31 评论；[ESLint `--report-unused-disable-directives` 官方文档](https://eslint.org/docs/latest/use/command-line-interface) 提供同类机制；核实 2026-10-25。候选词未用 cspell 执行验证。

### 2. 真实需求、消费者与固定来源

- **原始需求：** [#808 Option to report unused suppressed words/inline suppressions](https://github.com/streetsidesoftware/cspell/issues/808)，2020-12-26 提出，2026-10-22 仍有用户要求内置；用户要清理过期 inline ignore 与配置词表。相关 [#2536](https://github.com/streetsidesoftware/cspell/issues/2536)（2022-03-03，配置词表/孤儿词）和已关闭的重复 [#2158](https://github.com/streetsidesoftware/cspell/issues/2158)；维护者在 #2158 明确“清理词表”和“检测不必要指令”是两件事。
- **真实消费者：** cspell 自身仓库（约 610 行 inline 指令模式，含测试语料）；#808/#2536 中使用脚本或第三方包的用户；MegaLinter 等下游不在本任务验收范围。
- **固定源码：** `streetsidesoftware/cspell` main `a8589bff9bfdd80bde19bb0ac87e0e040ae8a1c3`，tree `2117270359ebbe31569d855e9eb61695fd6f90fc`，提交时间 2026-10-24T09:33:00Z；[LICENSE](https://github.com/streetsidesoftware/cspell/blob/a8589bff9bfdd80bde19bb0ac87e0e040ae8a1c3/LICENSE) 为 MIT。
- **源码入口（固定 SHA）：** [InDocSettings.ts](https://github.com/streetsidesoftware/cspell/blob/a8589bff9bfdd80bde19bb0ac87e0e040ae8a1c3/packages/cspell-lib/src/lib/Settings/InDocSettings.ts#L107)、[docValidator.ts](https://github.com/streetsidesoftware/cspell/blob/a8589bff9bfdd80bde19bb0ac87e0e040ae8a1c3/packages/cspell-lib/src/lib/textValidation/docValidator.ts#L420)、[CSpellReporter.ts](https://github.com/streetsidesoftware/cspell/blob/a8589bff9bfdd80bde19bb0ac87e0e040ae8a1c3/packages/cspell-types/src/CSpellReporter.ts#L63)、[reporters.ts](https://github.com/streetsidesoftware/cspell/blob/a8589bff9bfdd80bde19bb0ac87e0e040ae8a1c3/packages/cspell/src/reporters/reporters.ts#L27)、[commandLint.ts](https://github.com/streetsidesoftware/cspell/blob/a8589bff9bfdd80bde19bb0ac87e0e040ae8a1c3/packages/cspell/src/commandLint.ts#L184)。
- **现有实现缺口：** `InDocSettings.ts:107` 把指令合并为 `words`/`ignoreWords` 等设置，`:147` 的 `validateInDocumentSettings` 只检查指令语法；`getIgnoreWordsFromDocument`/`getWordsFromDocument` 只返回词数组，不返回每条指令的位置或使用状态。`docValidator.ts:420` 的 `checkDocument` 只合并拼写问题和指令语法问题，不做“去掉指令后”的比较。`CSpellReporter.ts:63` 的 `IssueType` 只有 `spelling`/`directive`；`reporters.ts:27` 的 `filterFeatureIssues` 把 directive 问题绑在 `validateDirectives` 上。CLI 已有 `--validate-directives`（`commandLint.ts:184`），没有未使用报告。
- **在制 PR／已解决：** 固定 main 与本轮 GitHub PR 搜索（关键词 `unused`/`directive`，2026-10-25）未见 “unused directive” 实现；#808 未分配、无 milestone、无 linked PR；2021 年的重复 #2158 已关闭，不是实现。维护者未明确接收，也未拒绝；2021-12-31 称其为 “nice feature ... multiple features”，2021-01-24 说 “I can see how this can be useful”。项目 CONTRIBUTING 欢迎新 feature，但这不是合并承诺。
- **现成方案：** `cspell-check-unused-words` 1.6.3（MIT，7 stars，最后推送 2026-06-18，依赖 cspell 10.0.1）只查配置 `words`，不查 inline 指令；用户自述它可能重复做一次检查。本任务第一交付不重做配置词表清理，复用该包。

依据：上述 issue／PR 元数据与源码按 2026-10-24/25 读取；第三方包 README 与 package.json；静态候选来自本任务私有源码检出的正则初扫，不是 cspell 运行结果。维护者自述与用户自述分开，未把它们写成合并承诺或效果证明。

### 3. 推荐组合与替代

**默认（推荐）：原生 Agent ＋ cspell 现有项目知识 ＋ 真实 CLI 反馈。** Agent 先读 `AGENTS.md`、`docs/config-and-cli.md`、`docs/feature-design.md`、`docs/design-principles.md`，按项目约定写一页 `docs/designs/<feature>.md`（因为新 CLI flag 改变公共行为），再在 `cspell-lib`/`cspell` 实现，最后用 `node ./bin.mjs lint` 在 cspell 自身真实文件上验收。理由：项目已有设计、测试、fixture、CLI 和 reporter 入口；无需新框架；语义不确定性由真实 CLI 反馈收敛。

**最强替代：外部包／脚本路线。** 现成的 `cspell-check-unused-words` 处理配置词表，README 已说明无未使用词返回 0、发现未使用词返回 1 并输出词条，可直接用于独立 CI 检查；inline 检查尚需用 cspell-lib 公共 API（已导出 `DocumentValidator`）编写独立脚本，不能把它写成现成包已有的能力。更值得用：一次性清理、接受独立检查命令的 CI、不能改核心，或维护者明确要外部工具。需要 inline 或 CI 退出码本身不排除这条路线。只有消费者确实需要复用 `cspell lint` 同一遍文件发现／验证、现有 reporter 输出与维护入口，且这些集成收益值得承担核心改动成本时，才转向核心方案；收益尚待实现确认。外部包依赖 cspell 10.0.1，当前固定为 10.4.0，版本兼容仍需实施时确认。

**规格路线：** 不默认上 OpenSpec／BMAD；cspell 的 `docs/feature-design.md` 已提供短设计入口，足以承载 flag 名称、默认值、语义和边界。只有多维护者或多 Agent 需要共享可审计契约、或第二交付跨多个公共 API 时，才考虑一页以上规格；规格膨胀超过实现或与项目 docs 重复时撤回。

依据：cspell 贡献文档与 `cspell-lib/src/index.ts` 公共导出（固定 SHA）；[`cspell-check-unused-words` README Usage](https://github.com/complete-ts/cspell-check-unused-words#usage) 的退出码约定与包信息；本仓 07 §2 的“原生＋项目反馈／窄规格／完整框架”条件选择（复用既有结论，不重跑实验）。

### 4. 首个可运行交付

**范围：** 给 `cspell lint` 增加默认关闭的 `--report-unused-directives`（名称按设计定），只报告 inline `ignore`/`ignoreWords`/`words` 中未改变验证结果的词级条目，带指令所在文件、行/列和词；不做 `ignoreRegExp`、`disable*` 范围指令，不做自动删除。第一交付 CLI-only，不加 config option／`check` 命令；第二交付再加配置与 `check` 对齐。开启后按 cspell 现有问题/退出码语义报告，不新增专用退出码；若新 `IssueType` 会破坏 custom reporter 契约，改用独立报告通道。

**拟改文件（按固定 SHA，实际以源码为准）：** `packages/cspell-lib/src/lib/Settings/InDocSettings.ts`（保留每条指令的词、offset 和来源范围；`getPossibleInDocSettings` 已有 offset，`getIgnoreWordsFromDocument` 只有词）、`packages/cspell-lib/src/lib/textValidation/docValidator.ts`（在 `checkDocument` 中接入反事实或使用跟踪）、`packages/cspell-lib/src/lib/textValidation/...`（使用项目自己的分词和验证，不写新的 Markdown／正则解析器）、`packages/cspell/src/commandLint.ts`、`packages/cspell/src/options.ts`（flag 与 help）、必要时 `packages/cspell/src/application.mts`／`lint/processFile.ts`；测试 `packages/cspell-lib/src/lib/Settings/InDocSettings.test.ts`、`packages/cspell-lib/src/lib/textValidation/docValidator.test.ts`、`packages/cspell/src/app.test.ts`。若需要新 `IssueType`，先评估 `CSpellReporter.ts` 公共 API 与 `reporters.ts` 的 `filterFeatureIssues`；优先不新增公共 issue type，避免 custom reporter 兼容问题。

**必须保留：** 默认 lint 输出与退出码；`--validate-directives` 与 `validateDirectives` 语义；`cspell:ignore`/`cspell:words` 的 file-wide 语义、`disable`/`enable`/`disable-line` 行为、指令最后应用且“总是赢”的优先级；不写文件、不改字典/配置；`--cache` 不得因缓存返回过期报告（第一交付至少把 flag 纳入缓存键或禁用缓存，并在设计里说明）；自定义 reporter 不因未 opt-in 看到新问题类型。**现成检查：** `pnpm run build`（项目要求先 build 再 test）、`pnpm --filter cspell-lib test`、`pnpm --filter cspell test`、`pnpm run lint-ci`、`pnpm run check-spelling`、`git status --porcelain`；若改 config/types 再跑 `pnpm test`（含 `test-schema`）并提交生成文件。环境：Node >=22.18；项目 `packageManager: pnpm@12.11.1`，本机现有 Node 22.23.2／pnpm 11.21.0，下一执行者需按 `corepack enable` 使用固定 pnpm（这是实施环境条件，本次未安装、未运行）。

**真实消费者命令（实施后）：**

```sh
node ./bin.mjs lint --report-unused-directives packages/cspell-lib/src/lib/Settings/DefaultSettings.ts
node ./bin.mjs lint packages/cspell-lib/src/lib/Settings/DefaultSettings.ts   # 默认输出应不变
node ./bin.mjs lint --report-unused-directives packages/cspell-glob/src/GlobMatcherTypes.ts packages/cspell-io/src/VirtualFS/findUpFromUrl.ts
```

先由人工或测试确认报告只列真正未使用的条目，再跑默认命令对比。若需要文件产物，用现有 `@cspell/cspell-json-reporter` 的 `outFile` 配置（reporter settings 不在 CLI flag 里）生成 JSON；第一交付不为此新增 reporter。

**后续自然变化：** 第一交付稳定后，用同一“去掉指令后是否改变结果”的机制覆盖 `cspell:disable`／`disable-line`／`disable-next-line` 范围（#808 的第 3 个子需求），再考虑 `reportUnusedDirectives` config（命名按设计定）与 `check` 命令对齐。配置 `words`／字典清理不复刻到核心；继续用 `cspell-check-unused-words` 或按其反馈改进。不为验证流程制造第二轮需求。

依据：cspell 固定源码的函数与测试位置；项目 `AGENTS.md`／`docs/config-and-cli.md`／`docs/feature-design.md`；官方文档的 file-wide 与 disable 语义；本任务未执行构建或 CLI，命令为待验收入口。

### 5. 什么反馈会改变选择

1. **语义反馈：** `DefaultSettings.ts` 的 `filetypes`、`GlobMatcherTypes.ts` 的 `fname`、`findUpFromUrl.ts` 的 `hrefs` 在真实 CLI 下若有的被字典/分词接受、有的确实缺席，报告必须区分“缺席”和“冗余”；若只报告缺席，消费者仍要手工处理冗余，设计需改。若 cspell 的分词把 `stopAtHrefs` 拆成 `hrefs`，则“出现”判据失效，必须用验证器或反事实。
2. **实现反馈：** 指令自身文本会被算作出现；`getPossibleInDocSettings` 的 `fullDirective`／`offset` 可用于排除，但 `getIgnoreWordsFromDocument` 不带 offset，需要改接口。若改接口影响公共导出，需在设计里限定内部或新导出。
3. **性能/缓存反馈：** 反事实二次验证在 cspell 仓库或大项目上超时/变慢，或 `--cache` 复用旧结果；改为单次遍历记录“被抑制的 issue”，或把 flag 纳入缓存键／禁用缓存。若代价仍高，撤回词级 lint flag，改独立命令。
4. **公共契约反馈：** 若复用 `IssueType.directive` 会让 `--validate-directives` 或 custom reporter 看到未 opt-in 的新问题，改用新 feature flag／独立报告通道；若维护者要求外部 reporter／工具，按恢复条件撤回核心路线。
5. **维护者反馈：** 维护者若说 inline 报告不属于核心或应先做设计，按其方向改；若明确拒绝，停止 cspell 核心路线，复用 `cspell-check-unused-words` 加脚本，不换仓库硬造。

**精确恢复条件：** 只要维护者没有明确拒绝，且设计能在不破坏 `IssueType`／reporter／cache 契约的前提下落地，就可进入本地实施；若维护者已明确拒绝或要求外部工具，或设计必须破坏公共 reporter 契约，撤回本选择，保留本文件的证据与外部工具复用方案，不把另一个 cspell feature 自动当替代。

依据：上述源码与 issue 线程；未运行，故这些是设计条件而非已观察结果。

### 6. 依据分级、执行与边界

- **一手事实（2026-10-24/25 读取）：** 固定 SHA、tree、MIT LICENSE；源码函数与行号；issue 状态、评论、无 assigned、无 linked PR；`cspell-check-unused-words` 包元数据；官方 cspell 文档的 file-wide／disable 语义；ESLint 官方 `--report-unused-disable-directives` 机制。
- **作者/用户自述：** #808 的用户使用场景、维护者“nice feature/multiple features”、第三方包 README 的自我描述；未把它们写成已合并或已验证效果。
- **推断（未运行）：** 静态初扫的候选 stale 指令、反事实实现的可行性与性能、cspell 自身报告的实际输出；均需实施后 CLI 验证。未做模型 A/B、benchmark、浏览器、服务、demo、账户/数据库；未安装依赖、未 build/test/执行 cspell。
- **模型/客户端：** 执行通道为 Claude Code 子代理（本 workflow `research` 阶段）；请求/环境标签为 `deepseek-v4.1-flash[1m]`，assistant 响应元数据记录的 `model` 为 `deepseek-flash`；响应字段本身也可能是别名，后端型号未知，不把标签当实际型号。原始私有日志/路径不入库。
- **读者入口与可复用资产：** 建议 dot-A 接收后把“真实语料 → 反事实语义 → 默认关闭报告 → CLI 对比”的条件路线补进 `docs/07-workflows.md` §2 的连续修改段；可复用资产是本任务的命令/检查清单与设计条件，不新建目录、框架或台账。

### 7. 交付检查（本文件）

- `python3 scripts/check_repo.py`：357 files，0 errors。
- `python3 scripts/check_public.py`：618 files，0 findings（工作树，含本文件修改）。
- 提交后按 `python3 scripts/check_public.py --commits origin/main..HEAD` 检查本次提交身份与公开内容，固定结果提交由原任务回传。
- `git diff --check`：通过；文件 UTF-8、LF、无 BOM、无尾随空白。
- 范围与交付：只改本任务文件，推指定结果分支；main 仅回传原任务结果与固定提交。文件无私有路径、凭据或原始日志。原始调用、独立核查和修订记录留本机，未安装或执行候选软件。

独立核查：已核原始需求、固定源码、公开需求与推荐。发现外部路线撤回条件过宽，已按现有 README 的 0／1 退出约定和公共 `DocumentValidator` 导出修正：独立 CI／inline 脚本仍是有效替代，转向核心仅由真实集成需求决定；未增加试用或模型对照。

Git 回传：结果分支 `relay/a-continuous-delivery-001`，固定提交 [`cf7313c1f65499942bf10d29f3b86d5aff560068`](https://github.com/dbvv1/a1dbv/commit/cf7313c1f65499942bf10d29f3b86d5aff560068)。原生 Workflow 的 research／delivery-check 完成，响应元数据均为 `deepseek-flash`；独立语义核查的替代路线问题已修正并经受影响复核确认。文档 357 文件、公开扫描 618 文件及本次提交身份范围检查通过，空白检查通过。调查输入 `review_ready`，由 dot-A 接收；未实施 cspell 功能、未运行消费者、未取得维护者接收或 Agent 效果结论。

## dot-A 选择（2026-10-25）

接收固定 `cf7313c1f65499942bf10d29f3b86d5aff560068` 的调查，不启动cspell核心实施。需求与技术路径真实，但本轮尚未证明消费者必须复用同一lint／reporter入口，独立脚本仍是有效替代；“先推荐核心，待以后确认集成收益”的顺序不充分。相较已完成Memos的原生Agent＋项目反馈采用，再完成一项lint功能还不足以说明新增AI coding能力，暂不以换仓库延长普通工程案例。

保留inline抑制的词法／反事实判断与外部方案证据，不把静态候选算未使用词。恢复条件是出现具体采用者的同管线集成需求，或当前方法路线确实需要该语义推理能力且有实际消费者；不继续同题搜索／重跑，不转成Codex内核补丁。接下来优先把已发生的多Agent并行交付与串行整合形成可用任务路线，原生模型与固定Git成果已有实际证据，不再等新工具或新仓库。
