# A-INSTRUCTION-PRODUCT-SCOPE-20261103 · 单元 1 提案

## 最小正文候选

**建议位置**：`docs/decisions/instruction-files.md` 的「要不要同时放两种文件」一节末尾、`## 第二步` 之前，新增下面一节。不改现有表格、`CLAUDE.md` 最小文件段，也不改第二步以后正文；不另造文件层级或新的验收体系。

```markdown
## 局部文件只覆盖挡住产品需求的那一条

**子模块有明确产品需求、又被共享设计约定挡住时，先核仓库已有的作用域与优先约定，再在该目录的局部文件里只覆盖冲突的那一条；其余共享规则继续适用，并把例外写进真实任务的验收。** 先向产品负责方确认目标和验收任务；第三方 issue、仓库里的旧文件或 Agent 的推测都不是授权。

1. **确认目标与负责方**：写清这个目录或功能要满足什么、谁决定、验收记在哪张真实任务里。
2. **先核作用域与优先约定**：查仓库的指令层级或宿主文档是否已说明子目录文件的作用域与优先级，例如根文件写明“目录自带的 `AGENTS.md` 在本目录优先”。已有这类约定就沿用，不要求局部文件再逐句覆盖根文件的同义表述；没有才在局部文件里补写它相对共享文件的作用域。共享文件与局部目录不在同一祖先链时，目录更深不会自动获得覆盖权，要在局部文件里显式点名被覆盖的那一条并引用共享文件。不要用“意思相同”自行推定覆盖范围：根文件已声明本地优先、但另有同义复述而两处关系没有写明时，先请该仓库的负责方确认覆盖范围，不要按“同义”自行认定已覆盖或未覆盖；系统／安全等独立约束不在这条例外的范围内。
3. **保留其余条款**：写“其余规则仍适用”，并链回共享文件；不删改共享文件里的条款，只为该目录加例外。局部文件不复制、不改写第二套通用规范。
4. **同步到真实验收**：把产品要求写成该任务可观察的验收项，例如最低容器宽度、非 hover 的 tap 入口、实际渲染宽度与窄场景故事；只改指令不算完成。
5. **分开核证据**：局部文件存在只算条款已写；启动加载按第二步的工具侧入口核，真实行为按第三步用实际修改和检查核。静态配置不证明任何客户端读到或遵守。

**不适用**：没有产品负责方的确定决定，先问；所有消费者的目标都变了，应改共享规则而不是堆局部例外；只是路径或命令过期，修事实；系统／安全禁止、组织权限、审批和数据外发边界不能用产品需求或局部文件绕过。

**依据**：PostHog 固定合并提交 [`4e1d31b`](https://github.com/PostHog/posthog/commit/4e1d31b2e1a18ea43f20bf278d8ac5463a1d11f4) 的根 `AGENTS.md`（L9 本地优先、L250 全前端引用、L253 窄场景与手机禁令）、`frontend/src/AGENTS.md` 首段与 Rule 6、局部 `products/signals/frontend/AGENTS.md` 全文；[#126370](https://github.com/PostHog/posthog/pull/126370)、[#126338](https://github.com/PostHog/posthog/issues/126338)、[#126769](https://github.com/PostHog/posthog/pull/126769)，2026-11-03 读取。该案例只提供写法与尚未验证的加载／行为，不证明模型已遵守。
```

## 与现有页面的增量

现有页只在文件选择表里写“共同正文放根 `AGENTS.md`；子模块确有不同约定时再加局部文件”，回答的是“要不要加”，没有回答“先核什么、谁授权、覆盖到什么范围、剩余的怎么写、怎样算做完”。第二步已有“内容可见／工具加载／真实行为”三层证据，第三步已有“用下一项真实修改验收”的入口；候选直接复用这两处，不新增第二套证据体系。

实际新增判断集中在三点：

1. **先核已有约定，再写局部文件**：现有页没有提醒读者先查仓库的指令层级与宿主文档是否已经规定子目录文件的优先级。PostHog 的根 `AGENTS.md` L9 直接声明目录可以有自己的 `AGENTS.md` 且“wins locally”；这种情况下局部文件不必重复覆盖根文件的同义表述，只需按已有约定写清自己覆盖哪一条。没有这类约定时，局部文件才需要显式说明作用域。
2. **授权来源**：局部例外来自产品负责方的明确需求，不来自第三方 issue、仓库旧文件或 Agent 的推测。PostHog 案例中，作者在 PR 正文称 inbox 团队希望手机可用并链接讨论；本次未读取该私人 Slack，也没有读到负责方的独立决定记录。未见不等于上游没有产品决定；这里只把它当写法示例，不作为授权证据。
3. **覆盖范围与依据**：覆盖依据要把仓库的优先约定、上级引用链和局部例外一起看，不能只看局部正文自称。固定提交里，根 L9 声明局部文件本地优先；根 L250 要求所有前端工作（主应用与 `products/*/frontend/`）都遵循 `frontend/src/AGENTS.md`；共享文件首段说明根 `AGENTS.md` 与 quill 包指南仍是权威、本文件只指路；局部文件只点名覆盖 Rule 6 的“Do not build for mobile”一条，并写“其余仍适用”、引用其他前端规则。四处合起来把例外限定在一条规则和一个目录。`frontend/src/` 与 `products/signals/frontend/` 不是文件系统祖先关系，局部文件不是靠目录更深取得覆盖权；显式引用也不证明任何客户端会原生加载它。

根 L253 另有一句“We do not support mobile”。局部文件没有逐句点名它；本次不把它写成已证的范围缺口，也不凭“同义”自行扩大或否认覆盖范围（见固定输入逐字核对）。

候选第 3、4 步（保留其余条款、同步验收）可视为把页面分散表述合并到局部例外场景，不算新原则；但现有页面没有把“例外要进入任务验收”写成局部文件的使用条件，这一句是新增的操作要求。

## 固定输入逐字核对（4e1d31b2）

### 覆盖的是哪一条、哪个目录

共享文件 `frontend/src/AGENTS.md` 的 Rule 6 标题是 “A narrow scene is normal; a phone is not”。被覆盖的是其中一条 bullet：

> **Do not build for mobile.** No phone-width layouts, no touch-sized targets, no `sm:` variants for a viewport nobody runs the app at. “Narrow” means a docked panel on a laptop.

局部文件 `products/signals/frontend/AGENTS.md` 全文（固定提交，14 行）：

```markdown
# Signals frontend

The web inbox (reports, scouts, sources and settings) lives here.
Follow [frontend/src/AGENTS.md](../../../frontend/src/AGENTS.md) for all other frontend rules.

## The inbox supports phone widths

This file overrides the "Do not build for mobile" bullet of Rule 6 in `frontend/src/AGENTS.md` for this directory.
People open inbox reports on their phones, for example from a notification or a link in Slack, so the inbox is a mobile-supported surface.
The rest of Rule 6 still applies.

- **A phone is the narrowest container, not a separate layout.** Keep breaking on container queries. A layout that holds at a ~520px scene must keep going down to a ~360px viewport: rows wrap or stack, long strings truncate, nothing scrolls sideways except a tab bar or a chip row built to scroll.
- **Every action has a tap path.** An action that appears only on hover, such as a row action or a tooltip that holds the only explanation, also needs a path without hover.
- **Render at phone width before calling the work done.** Check ~390px as well as the narrow-scene width, and pin a narrow width in a story when a layout depends on it.
```

作用域：只到 `products/signals/frontend/`（web inbox 的 reports、scouts、sources、settings）。共享文件的 Rule 6 对 main app 与其他 `products/*/frontend/` 仍然有效。

先核仓库已有的作用域与优先约定（根 `AGENTS.md` 原文）：

```text
L9: A directory may carry its own `AGENTS.md` that wins locally (`posthog/temporal/`, `rust/`, `frontend/src/`, most of `products/`). Check for one before working in an unfamiliar tree.

L250: **Follow [frontend/src/AGENTS.md](frontend/src/AGENTS.md) for all frontend work** — the main app and `products/*/frontend/` alike, since they share components and generated types.
```

共享文件 `frontend/src/AGENTS.md` 首段原文：

```text
Applies to any change under `frontend/src`. This is a **discovery + cadence** guide: the rules below exist because agents tend to generate before they look. The root `AGENTS.md` and the quill package guides remain authoritative, except that [`design.md`](./design.md) wins over a quill package guide for UI behind `today-rail-nav` — this file does not repeat them, it points at them.
```

把这些与局部文件的精确例外合起来看：

- 根 L9 规定目录自带的 `AGENTS.md` 在该目录本地优先；
- 根 L250 把所有前端工作指向共享文件；
- 共享文件首段保留根文件与 quill 指南的权威（`design.md` 对 `today-rail-nav` 下的 quill 指南另有优先，与本例无关），并把本文件定位为指路；
- 局部文件只覆盖 Rule 6 的“Do not build for mobile”一条，明确“The rest of Rule 6 still applies”，并要求其余前端规则遵循共享文件。

因此文本层面的覆盖依据是这四处的组合，而不是局部文件自称覆盖：例外只到那一条、只到该目录。

根 L253 另有一句“We do not support mobile — no phone-width layouts, no touch-sized targets”，并指向 Rule 6；同一条还要求按容器查询断点、换行或截断、堆叠放不下的两半、完成前实际渲染几个宽度。局部文件没有逐句点名末尾的手机禁令。本次只把这一点记为“文本没有单独说明它与该局部例外的关系”，不据此断言存在已证的范围缺口，也不靠“同义”自行认定已覆盖；读者自己的仓库遇到同类未解冲突时，先请该仓库的负责方明确。

### 仍保留的原约束

- Rule 6 其余 bullet：按容器查询断点、不裁剪/不横向滚动、变窄先砍装饰不砍内容与主要动作、实际渲染几个宽度再看。
- 局部文件明确写 “The rest of Rule 6 still applies”，并重复了容器查询、换行/截断、除 tab bar 或 chip row 外不横向滚动。
- 局部文件写 “Follow `frontend/src/AGENTS.md` for all other frontend rules”，即 Rule 1（先复用 Lemon/quill 组件）、Rule 2（产品 UI 放 `products/<name>/frontend/`）、Rule 3（用生成的 API 类型）、Rule 4（业务逻辑放 kea）、Rule 5（结构与抽象）、Rule 7（裸文本节点）都仍在。
- 根 `AGENTS.md` 的 TypeScript、kea、双击防重、quill 与 LemonUI 分工等前端规则未被局部文件触碰。
- 系统、安全、权限、审批、数据外发边界不属于“设计约定”，局部文件没有也不能覆盖它们。

### 该提交差量

合并提交 `4e1d31b2e1a18ea43f20bf278d8ac5463a1d11f4`（2026-10-30 15:46:15 UTC）的 diff 只有两个新文件：

| 文件 | 状态 |
|---|---|
| `products/signals/frontend/AGENTS.md` | 新增 14 行 |
| `products/signals/frontend/CLAUDE.md` | 新增，mode `120000`，符号链接，内容 `AGENTS.md` |

`frontend/src/AGENTS.md` 与根 `AGENTS.md` 在该提交中均未改动，共享规则没有被删改。PR #126370 作者 `andrewm4894`，head `49950c546ec5c42b005879b0065ef2ed65e9112b`，由 `trunk-io[bot]` 合入；PR 正文自报“Agents that work on the web inbox refuse or water down phone-width layouts”，并把测试理由写成 “Agent instructions only. No code or test changes. The pre-commit symlink and markdown format checks passed.”

### 条款合入、入口加载、功能行为

| 层面 | 现有证据 | 结论 |
|---|---|---|
| 条款合入 | 上述 diff 两个文件；局部文件逐字包含覆盖声明、360px、tap 入口、390px 与窄故事要求 | 条款已合入，范围是 `products/signals/frontend/` 的一条 bullet |
| 入口加载 | 根 `AGENTS.md` L9 是“局部文件本地优先”的书面约定，L250 要求前端工作读 `frontend/src/AGENTS.md`；根与局部的 `CLAUDE.md` 都是指向同目录 `AGENTS.md` 的符号链接（固定提交核对）。局部文件对共享文件用的是普通 Markdown 链接，不是 `@` 导入，共享条款是否进入上下文取决于 Agent 是否打开它。本次没有客户端启动回执、`/memory`／`/context` 输出或 `/config` 核对，也没有运行任何客户端 | 未验证。书面约定与符号链接只说明内容可被读取；不说明 Claude Code 或 Codex 在真实任务里加载并优先采用了局部声明 |
| 功能行为 | #126370 只改指令；作者未提供修改前后的模型原始记录。#126338 的验收写约 520px scene，没有约 390px 或 tap 条款。#126769 仍是 open，正文只自报 Storybook 1440→420px 渲染 | 未验证。不能证明模型不再拒绝手机布局，也不能证明手机功能已完成 |

## #126338 与 #126769 能否证明手机要求完成

**不能。** 两项都只提供“正在做”的状态或作者自报，缺少约 390px 渲染、非 hover tap 入口的可核结果。

- [#126338](https://github.com/PostHog/posthog/issues/126338) 标题为 “Move inbox triage mode to the scene header and fit report filters on one row”。2026-11-03 读取时 state 为 `OPEN`，页面 `updatedAt` 为 `2026-10-30T14:39:03Z`。验收项是：1280px 下滤镜一行、约 520px scene 不裁剪且只在分隔处换行、Triage 只在 Reports tab 且 onboarding 接管时不显示、`T` 快捷键与 `inbox-triage-mode` 事件仍工作、`InboxScene` Storybook 快照更新。没有约 390px、没有手机 tap 路径。PR #126370 正文只把“给这张 spec 补手机宽度”写成 follow-up（“once this merges”），没有证据表明已补。
- [#126769](https://github.com/PostHog/posthog/pull/126769) 标题为 “feat(inbox): move triage mode to the header and fit filters on one row”。2026-11-03 读取 GitHub REST `GET /repos/PostHog/posthog/pulls/126769` 时 `state` 为 `open`、`merged` 为 `false`、`merged_at` 为 `null`，head 为 `0078e0eb873c82479ce2d6a794e494ec14feea38`；REST 返回的 `merge_commit_sha` 是 `978166baa185f77255b1ac94cb20e4d4f0b73168`，但该提交标题为 “Merge 0078e0eb… into a2927dfa…”，是未合并 PR 的测试合并提交，不代表已合入。正文测试栏只写 “Rendered the inbox story in Storybook from 1440 to 420px, including `today-rail-nav`”，并说明 “No new test. InboxScene visual snapshots cover the layout and need re-approval.” 420px 大于 390px，且 Storybook 渲染不等于 tap 路径；正文没有提到 390px 或 hover-only 动作的替代入口。

因此，这些来源能证明的只是：局部指令的条款已经合入，真实需求仍在推进。它们不能证明需求完成，也没有证明模型行为或手机功能已按该条款通过；文本层面的作用域按上面的四处约定核对，本次未运行任何模型或浏览器。

## 不可直接覆盖的反例

1. **未获产品决定**：只有第三方 issue、仓库里的旧文件或 Agent 推测说“应该支持手机”，没有产品负责方确认目标与验收任务。此时先问负责方，不写局部例外。用户明确的产品需求与项目自己的设计约定冲突时，才按上述范围做局部例外；把项目约定或外部材料当成用户授权不算。PostHog 案例中，PR 作者称 inbox 团队希望手机可用并链接讨论，但本次没有读到负责方的独立决定记录；未见不等于上游没有产品决定，这里只说明本次未取得该记录。
2. **系统／安全禁令**：共享规则若涉及凭据、密钥、token、内部地址、真实用户数据、生产部署、权限或数据外发，产品需求不能覆盖。本仓自己的“禁止提交密钥、token、内部地址”与“要求硬性禁止读取、联网或发布时用宿主权限、沙箱及检查落实”都属于这一类；指令文件本身不能承担访问控制。
3. **所有消费者的目标都变了**：如果根规则服务的大多数目录都已转向手机宽度，应审共享规则本身，而不是在每个目录堆局部例外。
4. **只是路径或命令过期**：事实过期就修说明，不用产品需求或局部文件绕开。
5. **权限、审批与数据外发边界**：局部文件只能说明约定，不能替代组织权限、审批流程或数据外发限制；这些需要单独授权与相应检查。

## 去重与未验证边界

- 去重按固定树核，不按当前工作树文本：`git grep -n -E '126370|126338|126769|cc75c28d' ec246c5d -- .` 在本卡 `base_ref` `ec246c5d`（也是本次新增前的 HEAD）上无任何匹配（退出码 1）。当前工作树里检索这四个串只命中本文件自身，属于自引用，不能作为“已有产物”的判据。
- 任务要求的 `cc75c28d` 原卡按提交核，不按哈希文本搜：`git show cc75c28d:docs/collaboration/local-jobs/A-PLAN-DOMAIN-ROUTING-20261103.md` 是“规划时保留实现领域知识”一题的 37 行原卡，未见 126370／126338／126769 同原子，本题不与它重题。本次只新增本文件，没有复用旧 Storybook（Maka 组件与交互）、Memos（阅读模式／键盘回归）或 STYLE（保持知识的文风改写）的结论。
- 本次只做公开静态材料核对：没有启动 Claude Code、Codex、模型或浏览器，没有运行上游构建／测试，没有读取账号、私人会话、凭据或 PR 中的私人 Slack 链接，也没有评论、修改 issue 或 PR。
- 候选正文只到“可交给非作者照做”的草案，尚未经过非作者读者实测；不把静态审稿写成页面已采用或模型／浏览器行为已通过。本轮修订只改根文件与局部优先相关的文本判断，未新增模型、浏览器或上游运行。
- 所有条款引文固定在 `4e1d31b2`；#126338／#126769 的状态与正文是 2026-11-03 读取的可变页面，不当作固定代码或已完成验收。

## 来源

- [固定合并提交 4e1d31b2](https://github.com/PostHog/posthog/commit/4e1d31b2e1a18ea43f20bf278d8ac5463a1d11f4)（diff 两文件；2026-10-30 15:46:15 UTC）
- [frontend/src/AGENTS.md @4e1d31b2](https://github.com/PostHog/posthog/blob/4e1d31b2e1a18ea43f20bf278d8ac5463a1d11f4/frontend/src/AGENTS.md)（首段定位与 Rule 6）
- [根 AGENTS.md @4e1d31b2](https://github.com/PostHog/posthog/blob/4e1d31b2e1a18ea43f20bf278d8ac5463a1d11f4/AGENTS.md)（L9 本地优先约定、L250 全前端引用、L253 窄场景与手机禁令）
- [products/signals/frontend/AGENTS.md @4e1d31b2](https://github.com/PostHog/posthog/blob/4e1d31b2e1a18ea43f20bf278d8ac5463a1d11f4/products/signals/frontend/AGENTS.md)（局部全文）
- [#126370](https://github.com/PostHog/posthog/pull/126370)（已合入的指令改动；作者自报与测试理由）
- [#126338](https://github.com/PostHog/posthog/issues/126338)（2026-11-03 读取，OPEN，约 520px 验收）
- [#126769](https://github.com/PostHog/posthog/pull/126769)（2026-11-03 REST 读取：`state=open`、`merged=false`、`merged_at=null`，head `0078e0e`；正文自报 Storybook 1440→420px）
