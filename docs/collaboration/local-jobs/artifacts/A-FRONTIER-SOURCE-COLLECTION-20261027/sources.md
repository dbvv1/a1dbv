# 跨包 API 变更的前沿原始来源（采集单元 1）

> 采集与核实日期：2026-10-27。读取截止同日。本单元未安装、未运行任何候选，结论只覆盖实际读到的源码、PR、提交与工作流。

## 发现

本单元围绕“Agent 改多包公共 API／共享契约时，怎样找全下游、同步生成产物、验证兼容”读到四组原始材料：

- **Effect** 把“消费端可见的 TypeScript 声明”做成跨版本快照工具 `@effect/api-diff`；CI 锁住 `LLMS.md`，`migration/v3-to-v4.md` 则由 `api-diff --write-doc` 在迁移 PR 中生成，当前没有对应的 CI 漂移检查。真实使用发生在 v3→v4 迁移文档的连续刷新 PR 中，已知崩溃与未清零检查也有公开记录。
- **Biome** 在仓库级 `AGENTS.md` 写明“改哪类文件→跑哪条 codegen”，并让 CI autofix 机器人在 Rust 路径上补齐生成物；一个标注为 Opus 5.5 实现的 lint 规则 PR，首个提交已改两个生成文件但各留一行未同步、且没生成 ESLint 迁移映射，四分钟后由 autofix 机器人新增映射文件并各修正一行。
- **Nx** 把项目图交给 Agent：`nx graph --print` 可直接反查“谁依赖库 Y”，`nx show projects --affected` 列出变更包及其下游，`nx configure-ai-agents` 生成 AGENTS／CLAUDE／skills／MCP 配置并可用 `--check=all` 校验；生成块可能重写标记内内容，目前只有第三方作者在提交说明中自报冲突，未见实际覆盖记录。
- **cargo-semver-checks** 在多 crate 工作区用 `--workspace` 对基线做公开 API 兼容检查；一个 123 crate 的锁步发布仓库因“破坏性变更已随 minor 发出”而新增该闸门，另一个工作区记录了它真实发现的枚举变体破坏。

四组材料分别命中问题的一段：Effect 偏“生成物 + 兼容差异”，Biome 偏“生成物清单 + CI 兜底”，Nx 偏“下游发现”，cargo-semver-checks 偏“兼容验证”。动态引用、运行时行为、跨仓消费者这三类，四组材料都只覆盖一部分；dot-A 若用于真实任务，需要按缺口组合或另找来源。

## 证据缺口

- 中文渠道原帖未读到：linux.do 的 monorepo 讨论在 WebFetch 返回 `Socket is closed`、curl 返回 000；V2EX 同样无可读响应。搜索摘要只作线索，未用于确认机制。
- Nx AI skills 未找到独立的大型第三方消费者；已读证据是 Nx 自己的仓库和一个在提交说明中自报生成块会重写规则、因而把规则移出标记块的小仓库。
- 没有证据表明 Agent 会自主运行 Effect `api-diff` 或 cargo-semver-checks；Effect 的迁移刷新 PR 由仓库贡献者 tim-smart 提交，Biome PR 的“implemented by Opus 5.5”是作者在 PR 描述中的自报。
- 动态引用（反射、DI、字符串键、序列化字段）、生成代码的运行时消费者、跨仓库消费者，这四组材料都没有直接覆盖。
- 本单元没有试用任何工具，因而没有运行时长、误报率、漏检率或模型收益数据。

## 1. Effect：消费端可见声明快照 + 生成物漂移闸门

**解决的具体问题与机制。** 多包仓库改一个导出类型时，普通类型检查和包内测试只看得到当前编译单元，看不到“发布后消费者实际拿到的 `.d.ts` 形状”。`@effect/api-diff` 的做法是：给两个 revision 各建一个 detached 临时 worktree，用各分支自己的构建产物，独立发现每个公开包入口，用同一个固定版本的 TypeScript 编译器 API 抽取声明快照，输出 `base.snapshot.json`、`head.snapshot.json`、`diff.json`、`report.md`。它把“跨模块移动”“类式 API 的 type/value 两面”单独列出，并可用 `--write-doc` 从 diff 和 YAML 注解生成迁移参考；`--check` 会按模块列出缺失注解并以非零码退出。配套的仓库级 Agent 指令明确：`index.ts` 中带 `@barrel` 的段、`LLMS.md`、`migration/v3-to-v4.md` 都是生成物，不要直接编辑。其中 `.agents/AGENTS.md` 只给出 `@barrel` 段的命令——改源模块后运行 `pnpm codegen`；`LLMS.md` 的 `pnpm ai-docgen` 来自根 `package.json`（`effect-ai-docgen ai-docs/src -o LLMS.md`）；`migration/v3-to-v4.md` 的 `pnpm api-diff --write-doc migration/v3-to-v4.md` 来自 [api-diff README](https://github.com/Effect-TS/effect/blob/ccae35423188f58d7c3dec5db3e36ed4bf42bcdf/packages/tools/api-diff/README.md)，从新 diff 与 `migration/annotations` 生成。

**原始链接与日期。** 工具说明读自 `packages/tools/api-diff/README.md`，固定提交 `ccae35423188f58d7c3dec5db3e36ed4bf42bcdf`（2026-09-15）：[README](https://github.com/Effect-TS/effect/blob/ccae35423188f58d7c3dec5db3e36ed4bf42bcdf/packages/tools/api-diff/README.md)。Agent 生成物约束读自 [.agents/AGENTS.md](https://github.com/Effect-TS/effect/blob/31c6c1c157b05ddeb661186c381a646622a723e1/.agents/AGENTS.md)（该文件最近改动 2026-09-21，PR [#8346](https://github.com/Effect-TS/effect/pull/8346)）。CI 闸门读自 [check.yml](https://github.com/Effect-TS/effect/blob/20e5ba813ca014bc841672325b5e824b8100d976/.github/workflows/check.yml)（固定提交 `20e5ba813c`，2026-10-26 的 PR 所核 main）：Static job 跑 `pnpm jsdocs --check`（只查 JSDoc）、`pnpm circular`、`pnpm ai-docgen` 后 `git status --short` 非空即失败（锁 `LLMS.md`）；Types job 跑 `pnpm test-types`（tstyche）；`pnpm check-dist-types` 只在 `pull_request` 的 Build job 运行，不是所有事件的闸门。当前 check.yml、ai-codegen.yml、release.yml、snapshot.yml 都没有 `api-diff` 或 `migration/v3-to-v4.md` 步骤，`jsdocs` 源码也不读 migration，因此 migration 文档的更新由迁移 PR 的 `pnpm api-diff --write-doc` 保证，需人工／PR 流程，CI 不会拦它的漂移。`pnpm ai-docgen` 与 `pnpm api-diff --write-doc` 两个命令分别取自根 `package.json` 与 api-diff README，不是 `.agents/AGENTS.md` 的要求（该文件只写 `pnpm codegen`）。以上均为源码与工作流原文，不是作者介绍文章。

**真实消费者。** Effect 自己的 v3→v4 迁移参考是直接消费者。PR [#9971](https://github.com/Effect-TS/effect/pull/9971)（创建并合并于 2026-10-26）body 写明：增量 API diff `399ecbe63f68b8698789190ec3e779315e26e35e..20e5ba813ca014bc841672325b5e824b8100d976` 基于缓存快照、无 removed APIs；逐条核对既有 YAML 注解；重新生成 reference；改动文件为 4 个 `migration/annotations/*.yaml` 加 `migration/v3-to-v4.md`。同月还有 [#9555](https://github.com/Effect-TS/effect/pull/9555)（10-19）、[#9804](https://github.com/Effect-TS/effect/pull/9804)（10-22）同类刷新，说明这是反复运行的流程，不是一次性演示。另一类消费者是新增公开模块的 PR：[#9936](https://github.com/Effect-TS/effect/pull/9936)（2026-10-25，新增 `effect/docker`）的文件列表同时包含新增源码与 `LLMS.md`（生成文档）的 6 行改动；`DockerSchema` 在 PR 描述中标明由 `packages/tools/docker-codegen` 从固定 swagger 生成。可见结果：迁移文档随每次 API 变化在 PR 中重新生成；CI 只锁 `LLMS.md` 的漂移，不检查 migration 文档。

**反对反馈与限制。** README 明确写“does not make semantic-version compatibility claims”，它给差异，不给该升 major 还是 minor 的结论。公开修复 [#7852](https://github.com/Effect-TS/effect/pull/7852)（2026-09-03，“retain optional class members in snapshots”）说明抽取器曾漏掉可选类成员，快照不是天然完备。PR #9971 的 Validation 还记录了两个当前限制：完整 `api-diff --check` 仍以 20 个 API groups 非零退出（其中 0 个模块需要新指导），`api-diff --output` 仍因快照 pretty-print 抛 `RangeError: Invalid string length`，作者改用缓存快照直接比较。成本上，它要为两个 revision 建 worktree 并完成各自构建，适合发布前或大版本迁移，不适合每次小改。

**与已收录的差异。** 仓内 [oasdiff 契约评审](../../../../../experiments/oasdiff-contract-review.md)处理 OpenAPI 请求/响应的破坏性变更，[15 的任务卡](../../../../15-task-playbooks.md)把它放在“API 改稿前获得可定位的兼容性反馈”；本项处理 TypeScript 包的导出声明与生成文档，并把 `LLMS.md` 的漂移做成 CI 闸门，机制与消费者都不同。仓内 ast-grep、diff-cover、testmon 分别覆盖批量改写和测试执行范围，均不产出跨版本声明快照。与 [03 的 Context7 版本查询](../../../../03-context-engineering.md)也不同：后者查官方文档版本，前者比较本仓两个 revision 的编译产物。

**交给 dot-A 的未决问题。** 用一个可回退的小改动验证抽取器当前是否保留可选类成员与跨模块移动：在 Effect 公开仓库的临时 fork 里，把一个导出的可选类成员改为必选、再把一个类型移到另一模块，运行 `pnpm api-diff --base-ref <基线> --head-ref <HEAD>`，看 `diff.json` 是否正确分类；同时记录双 worktree 构建的耗时。另一个未知是 `--check` 的 20 个非零 groups 属于真实缺注解还是工具状态，PR #9971 已把该状态公开，可直接从同一基线复现。

## 2. Biome：仓库级“改动类型→codegen 命令”契约 + autofix 兜底

**解决的具体问题与机制。** 多包／多 crate 仓库里，公共行为变化往往同时要求改若干生成文件（规则元数据、JSON schema、语言服务器绑定、迁移映射）。Agent 容易只改主实现和测试，把生成物留给 CI 或下一个人。Biome 两条机制接住它：`AGENTS.md` 的 “Required generated artifacts” 把触发条件写成可执行清单——改 `.ungram` 跑 `just gen-grammar <lang>` 与 `just gen-formatter --allow-dirty`，改 lint rule 或 assist action 名跑 `just gen-rules` 与 `just gen-configuration`；并注明“Bindings and other full analyzer outputs may be left to the CI Autofix job”。CI 的 `autofix.ci` 工作流在 `crates/**`、`fuzz/**`、`xtask/**`、根 `Cargo.toml` 等路径变化时，依次跑 grammar、analyzer、configuration、schema、bindings、ESLint migrate、Stylelint migrate，再格式化并提交回 PR。Agent 另有 `testing-codegen` Skill，规定快照只能由 `insta` 生成、禁止手工改快照。

**原始链接与日期。** [AGENTS.md](https://github.com/biomejs/biome/blob/0651f3a5efc3c0bc4a359257e7f8781d0ef72b00/AGENTS.md) 固定提交 `0651f3a5`（该文件最近改动 2026-10-12）。[autofix.yml](https://github.com/biomejs/biome/blob/e2e5a36e1be8581419742a85268ad82f020da62e/.github/workflows/autofix.yml) 固定提交 `e2e5a36e`（main，2026-10-27）。[testing-codegen Skill](https://github.com/biomejs/biome/blob/e2e5a36e1be8581419742a85268ad82f020da62e/.agents/skills/testing-codegen/SKILL.md)。Agent 指令的迁移本身也有记录：PR [#12125](https://github.com/biomejs/biome/pull/12125)（2026-10-04 合并）把 skills 移到 `.agents`、删除 `CLAUDE.md`，理由是 Claude 已支持 `AGENTS.md`。以上均读自固定提交源码与 PR 原文。

**真实消费者。** PR [#12580](https://github.com/biomejs/biome/pull/12580)（2026-10-23 创建，截至核实日 open，作者 dyc3，描述写 “implemented by Opus 5.5”）新增 `noVueExportInScriptSetup` 规则。首个提交 [`f918116c352143ffe8fddc923fa717b56faa4b5f`](https://github.com/biomejs/biome/commit/f918116c352143ffe8fddc923fa717b56faa4b5f)（11:25:34）由作者提交，文件列表已包含 `packages/@biomejs/backend-jsonrpc/src/workspace.ts`（+20/−6）与 `packages/@biomejs/biome/configuration_schema.json`（+26/−0），但没有 `crates/biome_cli/src/execute/migrate/eslint_any_rule_to_biome.rs`；四分钟后 [`autofix-ci[bot]` 的提交 `ed1153c5574b31e4f22b7d4040f1d281b7897484`](https://github.com/biomejs/biome/commit/ed1153c5574b31e4f22b7d4040f1d281b7897484)（11:29:16）新增该映射文件（+12/−0），并对前两个文件各改 1 行（各 +1/−1）。因此可见证据是“两个生成物各留一行未同步、一个映射文件未生成，CI 补齐／修正”，不是“漏了三个文件”；它支持 CI autofix 能补生成物漂移／遗漏，不能单凭这份提交文件列表证明“Agent 完全没跑 codegen”。最终 PR 文件列表包含这些生成物。

**反对反馈与限制。** autofix 是静默补齐：Agent 和作者不必看到自己漏了哪几处生成内容，生成的 schema／绑定 diff 仍要人审。`AGENTS.md` 自己允许把 bindings 留给 CI，意味着本地跑全套不是强制；CI 也只在列出的 Rust 路径触发。更关键的是，这套机制只覆盖“本仓库已知的生成文件”，不回答“哪些下游包／调用方需要同步改”，也不覆盖发布到 npm 后的消费端类型解析。它与 Biome 的 Rust workspace 特点绑定，换到 pnpm＋TypeScript 多包时，需要自己维护“触发文件→生成命令”的映射。另有一层成本：快照与生成物属于行为，`testing-codegen` 要求逐条审核，不能用统一 accept 跳过，“全绿”只说明测试通过、生成物存在，生成内容仍需逐条审核。

**与已收录的差异。** 仓内 [13 的 Luban 配置生产链](../../../../13-frontier-radar.md)讲“改作者源而不是生成文件”，是游戏数据生产链的纪律；本项把同一纪律写成仓库级 Agent 指令，并补上“漏跑后 CI 自动补”的兜底，消费者是真实 PR 的生成 schema／绑定。仓内已有的生成文件保护是编辑期 Hook：[06 的 PostToolUse `additionalContext`](../../../../06-hooks-and-guardrails.md)在编辑后提示“这是生成文件，请改源文件”，[decisions/permissions-and-hooks](../../../../decisions/permissions-and-hooks.md) 的路径 Hook 针对“经常误改生成文件”，但只覆盖编辑类工具，不覆盖 Bash 写入或符号链接。本项是“触发条件→codegen 命令”的仓库级 Agent 指令加 CI autofix 兜底，与编辑期 Hook 互补。仓内 [Next.js 按改动构建](../../../../collaboration/inbox.md#2026-10-27sdk-迁移与按改动构建)只决定跑哪部分构建，不维护生成物清单。仓内没有“触发条件→codegen 命令”表的条目。

**交给 dot-A 的未决问题。** 在一个临时 fork 上改一条 Biome lint 规则的名称，按 `AGENTS.md` 只跑 `just gen-rules`，看是否仍缺 `just gen-configuration`，以及 eslint 迁移映射、`workspace.ts`、`configuration_schema.json` 这三个生成文件；再把 PR 推给 autofix 工作流，比较机器人补的文件与表里列的是否一一对应。这个输入可以直接用公开 PR #12580 中 bot 实际触碰的三个文件作为预期集合。另一个未知是：不做 CI 时，Agent 能否从 `just --list` 或 Skill 自行发现这些命令；`testing-codegen` Skill 已给出测试选择表，但未给出“生成物完整性自检”入口。

## 3. Nx：项目图反查下游 + 生成式 Agent 配置

**解决的具体问题与机制。** Agent 在 monorepo 里的常见漏项是“谁依赖我改的库”。Nx 的 `nx-workspace` Skill 直接给出反查命令：`nx graph --print | jq '.graph.dependencies | to_entries[] | select(.value[].target == "Y") | .key'`，回答“What depends on library Y?”；`nx show projects --affected` 列出受本次变更影响的包及其下游，`nx affected -t build test lint` 只在这些包上跑任务。`nx configure-ai-agents` 生成 `AGENTS.md`／`CLAUDE.md`、各客户端的 MCP 配置和 skills，并提供 `--check=all` 校验生成配置是否齐全；skills 覆盖 workspace 探索、生成器、任务执行、CI 监控。与普通全文搜索的区别是：它读的是构建图而不是文本命中，能包含通过项目配置推断出的依赖边，且 affected 集会进入后续测试／构建选择。

**原始链接与日期。** Nx 官方文档固定提交 `a935bb7d0af8ec3fa8936c52a4a57b9d121f6fae`（2026-09-17）：[enhance-AI.mdoc](https://github.com/nrwl/nx/blob/a935bb7d0af8ec3fa8936c52a4a57b9d121f6fae/astro-docs/src/content/docs/features/enhance-AI.mdoc) 说明 `npx nx configure-ai-agents` 写规则文件、skills、MCP；[ai-setup.mdoc](https://github.com/nrwl/nx/blob/a935bb7d0af8ec3fa8936c52a4a57b9d121f6fae/astro-docs/src/content/docs/getting-started/ai-setup.mdoc) 给出非交互命令与 `npx nx configure-ai-agents --check=all` 验证步骤。Skill 原文固定提交 `525ce266e22ec54e006d630d3b560658e8c3001c`（2026-10-14，同日该仓库切 0.2.36 release）：[nx-workspace/SKILL.md](https://github.com/nrwl/nx-ai-agents-config/blob/525ce266e22ec54e006d630d3b560658e8c3001c/skills/nx-workspace/SKILL.md) 与 [AFFECTED.md](https://github.com/nrwl/nx-ai-agents-config/blob/525ce266e22ec54e006d630d3b560658e8c3001c/skills/nx-workspace/references/AFFECTED.md)。以上为 Nx 官方仓库与官方 skills 仓库原文。

**真实消费者。** Nx 自己的仓库用该命令更新 agent 配置：PR [#36046](https://github.com/nrwl/nx/pull/36046)（2026-06-18，“chore(repo): update ai agent configuration via nx configure-ai-agents”），属于第一方使用。独立仓库证据来自 `gx-capture/capture-workbench` 的提交 [0e033d63f15c218d304cf3a031df5cb47bf61489](https://github.com/gx-capture/capture-workbench/commit/0e033d63f15c218d304cf3a031df5cb47bf61489)（2026-09-28，commit message 带 Claude Opus 5.5 co-author）：该提交只删除 `<!-- nx configuration start/end -->` 两行标记（AGENTS.md 0 增 2 删），规则内容未动；提交说明写“Nx owns that block and `nx configure-ai-agents` rewrites it”，因此作者把包边界、token 处理、运行时职责等仓库规则留在标记外。这是第三方作者自报的冲突，未见该仓库实际被覆盖的 diff，也未在本单元引用 Nx 源码或官方文档证明覆盖行为，只能算目前找到的最具体第三方使用记录。

**反对反馈与限制。** 生成块可能覆盖用户写在标记内的内容；目前只有 gx-capture 作者在提交说明中的自报，没有实际覆盖记录，也未核 Nx 源码。若该行为成立，要保留自定义规则就得放在标记外。项目图只包含 Nx 能推断的依赖：动态 `require`、字符串路径、生成代码的运行时注册、跨仓依赖都可能缺边；`nx graph --print` 输出的是项目级边，不是文件级调用点。Skill 依赖客户端能读取 `AGENTS.md` 或安装对应 skills；MCP 主要连 CI 与文档，图查询仍要求 Agent 能执行 `npx nx`。成本上，团队要先接受 Nx 的 workspace 布局与插件推断，非 Nx 仓库迁移代价高；`--check=all` 校验生成的配置文件齐全；图本身是否正确需另核。未找到独立大型第三方消费者，这是本项最弱的证据面。

**与已收录的差异。** 仓内 [A-FRONTIER-SELECTION-001](../../A-FRONTIER-SELECTION-001.md) 在 diff-cover 的“强替代”里提过 `nx affected`，用途是 monorepo 测试选择；本项处理的是“Agent 如何反查下游消费者、如何验证生成的 agent 配置”，并把 `nx graph --print` 的具体 jq 命令、`configure-ai-agents` 生成块冲突的作者自报作为新证据，不重跑那项比较。仓内 Graphicle／Serena／LSP 基线解决“找调用者和语义引用”，但不提供项目级 affected 集，也不生成 agent 配置。仓内没有 Nx 下游发现／agent 配置的专门条目；上文 `nx affected` 的比较与 [10 的 Nx 供应链案例](../../../../10-security.md) 都不涉及本机制。

**交给 dot-A 的未决问题。** 在一个临时 Nx workspace 里造 `lib-a`、`lib-b`（b 依赖 a）和 `app-c`（c 依赖 b），让 Agent 只读 `nx-workspace` Skill 回答“c 是否受 a 的改动影响”，把答案与 `nx graph --print`、`nx show projects --affected --base=<基线>` 的输出对照；再运行 `nx configure-ai-agents` 两次，看 `--check=all` 是否稳定、生成块是否只改写标记内内容。gx-capture 的提交已经给出一个待复现的冲突输入。

## 4. cargo-semver-checks：多 crate 工作区的版本兼容闸门

**解决的具体问题与机制。** 多 crate 仓库改公开项时，编译器只保证当前 workspace 内能编过；发布到 crates.io 后，下游按版本号决定是否升级。Agent 改一个 crate 的公开项后，这条检查把影响转成可读的具体 item 与文件位置，可在发布前回灌修改。cargo-semver-checks 以 rustdoc JSON 抽取公开 API，按 Cargo SemVer 参考逐条 lint，报告具体 item 与文件位置；支持 `--baseline-version`、`--baseline-rev`、`--baseline-root`、`--baseline-rustdoc` 指定基线，配置可放在 workspace 的 `[workspace.metadata.cargo-semver-checks.lints]` 并由各 crate 用 `workspace = true` 继承。`check-release` 对发布版本检查，`--workspace` 对整个工作区检查；部分 lint 带 witness（最小下游示例），用“基线可编译、当前不可编译”确认破坏。

**原始链接与日期。** 工具说明固定 tag [v0.51.0 的 README](https://github.com/obi1kenobi/cargo-semver-checks/blob/v0.51.0/README.md)（release 2026-10-03，[发布页](https://github.com/obi1kenobi/cargo-semver-checks/releases/tag/v0.51.0)）；该版本的 release notes 称首次为 Rust 1.99 的 C-ABI variadic 函数同步提供 6 条 SemVer lint。工作区 lint 配置、witness、false positive 与“是否会抓全”章节均读自同一 README。

**真实消费者。** `vixide/vix` 的提交 [d25c7edcf7eeb01e341b6ad6e5569a70e8aa7c9e](https://github.com/vixide/vix/commit/d25c7edcf7eeb01e341b6ad6e5569a70e8aa7c9e)（2026-10-21，commit message 带 Claude Sonnet 5.5 co-author）：123 个 crate 锁步发布到 crates.io，破坏性变更曾随 minor 发出（`vix_db::connect::Connection` 移动、`LspEvent` 增加 variant），因此新增 `cargo semver-checks --workspace` 到 CI 的 `semver` job 与 `scripts/check`，并写入 release checklist。`TES286-org/librouting` 的两次提交给出更细的真实结果：[1e17c5bdd6f5a065faa974e1e4156aae52b1b500](https://github.com/TES286-org/librouting/commit/1e17c5bdd6f5a065faa974e1e4156aae52b1b500)（2026-10-21）记录首次运行 `cargo semver-checks --workspace --all-features --baseline-rev v1.2.0` 发现 `lr-bgp::path::AttrType` 新增 `BgpLsAttribute` 变体：枚举没有 `#[non_exhaustive]`，新增变体破坏下游穷尽匹配，且派生 `PartialOrd` 的位置变化也属破坏；因旧债未清，CI 暂设 `continue-on-error: true`。[6ed3f954ef469542374f36c14c64786024211e37](https://github.com/TES286-org/librouting/commit/6ed3f954ef469542374f36c14c64786024211e37)（同日）在 v1.3.0 清债后移除 `continue-on-error`，闸门转为阻断。`open-source-cooperative/keyring-rs` 的提交 [912eba5d2c560b6014c3834c8e732ae522d43f48](https://github.com/open-source-cooperative/keyring-rs/commit/912eba5d2c560b6014c3834c8e732ae522d43f48)（2026-10-04）把自装 CLI 改成官方 `obi1kenobi/cargo-semver-checks-action@v2.9`，参数 `feature-group: all-features`；这是单 crate 消费者，可证明 action 的真实使用；工作区场景见 vix 与 librouting。

**反对反馈与限制。** README 的“Will cargo-semver-checks catch every semver violation?”直接列出当前抓不到的三类：字段／参数的类型破坏、泛型与生命周期破坏、只在部分 feature 组合下出现的破坏；它也不检查运行时行为变化。false positive 被当作 bug，但这不改变覆盖有缺口。HN 2023-07-08 的 147 分讨论（[Algolia 原帖接口](https://hn.algolia.com/api/v1/items/36642989)，HN 页面本次不可达） 里，反对意见集中在“类型层面的检查抓不到行为破坏、Hyrum 定律下任何变化都可能破坏某个消费者、消费者驱动契约（如 Pact）是另一条路”；支持方与工具作者则强调它主要防“作者不知情的意外破坏”，并给出“头部 1000 个下载最多的 crate 中超过 1/6 至少破坏过一次、且工具能构造出编译失败”的下界分析。该讨论是 2023 年原文，只作长期反对意见；2026 年状态见上文 README 与 librouting 记录。工程限制：`--workspace` 假定所有 crate 一起检查；librouting 的记录显示历史债会让闸门先以非阻断方式运行；vix 的锁步发布是特定版本策略，独立版本的多 crate 仓库需要逐 crate 配置基线。

**与已收录的差异。** 仓内 [oasdiff 实试](../../../../../experiments/oasdiff-contract-review.md) 是 OpenAPI 请求／响应契约，[15 §5](../../../../15-task-playbooks.md#5-大规模迁移与升级) 讲的是依赖升级后如何迁移消费者；本项是“发布方在发出前检查自己的 Rust 公开 API 是否违反 semver”，消费者与检查对象都不同。仓内 diff-cover／testmon 解决测试选择，不比较 API 形状。仓内没有 Rust 生态或 workspace 级 semver 闸门。

**交给 dot-A 的未决问题。** 在临时 Rust workspace 复现 librouting 的输入：一个没有 `#[non_exhaustive]` 的公开枚举，在 `--baseline-rev` 之后新增一个变体，运行 `cargo semver-checks --workspace --all-features --baseline-rev <tag>`，确认它报告 `enum_variant_added` 一类 lint 并给出文件位置；再加一个“字段类型从 `u32` 改为 `u64`”的改动，验证 README 所述类型破坏漏检是否仍存在。vix 的 123 crate 规模可作为耗时与 CI 集成成本的公开输入，但本单元没有运行。

## 排除与不采用

- **tRPC 的 `scripts/entrypoints.ts`**：从源码文件生成 `package.json` 的 `exports` 和每个入口的 `package.json`，属于“新增公开入口必须重跑生成器”的机制；但该文件最近改动 2026-03-20，未找到 CI 漂移检查或 Agent 指令，暂列为排除项。
- **Turborepo 的 `--filter=...[base]`**：与 Nx affected 同属“变更包＋下游”选择，但没有本窗口可读的 Agent 配置生成与第三方使用记录；本单元保留 Nx 的更强原始证据。
- **Microsoft API Extractor 的 API report、Kotlin binary-compatibility-validator、.NET ApiCompat**：机制上都是“提交公开 API 基线文件、变更时显式更新”，与 Effect `api-diff` 接近；本单元未读到它们在近 30 天的采用或修订原文，因此不列入候选。
- **已收录基线**：oasdiff／Pact、diff-cover／testmon、ast-grep／codemod、Serena／Graphicle／原生 LSP、Actual 类型迁移，均按任务要求只作对照，不重复介绍或重跑实验。SDK 迁移与 Next.js 按改动构建在 inbox 中已处理，本单元只核对差异，未以新日期重写。

## 探索回执

实际渠道：GitHub raw 文件与 REST API（仓库内容、提交、PR、workflow）、Hacker News Algolia API、Web 搜索（只用于定位）。读取范围：各候选 README 全文、AGENTS.md 相关节、workflow 全文、skills 与 AFFECTED 参考、PR body／文件列表／提交。读取截止：2026-10-27。成品共 29 个唯一外部链接（28 个 `github.com`、1 个 `hn.algolia.com`），逐一请求均返回 200；HN 原页面不在成品链接内，正文采用 Algolia 接口。读不到的入口：linux.do 主题 2302606（WebFetch `Socket is closed`，curl 000）、V2EX（curl 000；WebFetch 域名安全校验不可用）；未使用任何账号、代理或绕过访问控制。搜索摘要与 SEO 文章（aitoolsguidebook、geek-doc、iqilian 等）未作为机制或采用证据。
