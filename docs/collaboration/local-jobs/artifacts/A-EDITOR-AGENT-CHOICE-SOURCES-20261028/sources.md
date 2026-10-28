# A-EDITOR-AGENT-CHOICE-SOURCES-20261028 · 编辑器与编码 Agent 选择：原始来源

> 读取截止 2026-10-29。主窗 2026-04-28 至截止；超出主窗但用于追溯机制原委的旧决定，按原始发生日单列。本文件只整理已核候选、原始链接和取舍条件，不作推荐、不默认化，也不替 dot-A 判断采用。
>
> **核实标记**：「重核」= 本单元直接读过原始 PR、固定文件或作者原文；「部分重核」= 主结论已核，子主张未核；「未核」= 仅按上游候选清单保留，本单元未重读。所有“已核”只表示本次读到的公开页面与文件，不等于安装、运行或效果验证。PR 合并、HTTP 200、配置存在都不单独充当采用或效果证据。

## 先给选择图：这批材料各改变哪一问

这批案例不指向“哪个编辑器/Agent 更好”，而是把“是否要换”拆成四个可分别决定的问题：

1. **保留原编辑器，只换或加执行入口。** [MarsBased](https://marsbased.com/blog/2026/05/07/the-strategy-behind-the-shift-why-marsbased-left-cursor-for-claude-code) 全公司改用 Claude Code 但明确不统一编辑器；[Rootly](https://rootly.com/blog/what-broke-when-engineering-went-fully-agent-based) 连 harness 都不统一，只统一共享底座；[JetBrains](https://blog.jetbrains.com/platform/2026/10/jetbrains-terminal-now-uses-ghostty/) 在 IDE 内置终端里补齐 CLI Agent 所需协议；[Next.js](https://github.com/vercel/next.js/pull/88105) 共享指令但 Codex/Cursor 各维护执行环境。
2. **多个客户端并用，共享指令但各自保留专属层。** [Kibana](https://github.com/elastic/kibana/tree/c698fe4fc3c283175adaba498b47b60bc61e24f0/.agents) 共享 skills 但 Hook 按客户端双写；[Supabase](https://github.com/supabase/supabase/blob/b27694b1d4641def5315a5169e93ba510b653f39/.github/copilot-instructions.md) 用内容分工而非单指针；[Grafana](https://github.com/grafana/grafana/blob/71d3f7ef47fea8810203c596ffa5b0f4f3930015/AGENTS.md) 的共享文件引用了只有 Claude 能发现的 skill。
3. **统一入口失败、整体退回或社区拒绝。** [Home Assistant #153777](https://github.com/home-assistant/core/pull/153777) 上线当天因 Copilot 评审只认 `.github/copilot-instructions.md` 固定路径而回退；[NixOS/nixpkgs #534657](https://github.com/NixOS/nixpkgs/pull/534657) 被社区否决并改用 `.gitignore`；[DuckDuckGo](https://github.com/duckduckgo/apple-browsers/pull/6853) 停用一个客户端但只迁评审配置。
4. **收敛到单一客户端。** [OpenTelemetry Go](https://github.com/open-telemetry/opentelemetry-go/pull/8988)、[Flatcar](https://github.com/flatcar/Flatcar/pull/2466)、[Vendure](https://github.com/vendurehq/vendure/pull/5536) 删除 `CLAUDE.md`，[Angular](https://github.com/angular/angular/blob/f6486074e8ef6792c8a814226bf1aebff6b35b49/.agent/rules/agents.md) 根本没有 `.claude`/`.cursor`。

**贯穿四问的前置检查：文件真的被客户端读到了吗。** [2.1.277+ 的 AGENTS.md 读取受远端开关与遥测影响](https://blog.szypowi.cz/p/claude-code-reads-agents.md-only-when-telemetry-is-on/)、[orca 的 fork worktree 恢复导入](https://github.com/stablyai/orca/pull/31242)、[DuckDuckGo 的软链不被解析则规则不生效](https://github.com/duckduckgo/apple-browsers/pull/6853) 三个案例说明：文件存在、甚至合并进仓库，都不等于目标入口加载了它。

## 排序标准

按“对保留/并用/迁移判断的改变幅度”排序，不是采用推荐。依次看：

1. 是否有真实的**改变动作**（撤回、拒绝、迁移完成、停止使用），而不只是配置文件存在；
2. 是否暴露会改变决定的**代价**（权限/Hook、打包、平台、凭据、人工步骤、文档一致性）；
3. 是否验证了**实际被读取或被执行**，而不只是文件可访问；
4. 证据层级：原始 PR/固定源码＋具体评论 > 作者自报 > 厂商内容；厂商仓只作机制样本。

## 排序后的候选总表

「改变哪一问」列即保留理由：只有能改变保留/并用/迁移判断的项才列入；证据不足或只是配置存在的项在末节降级或排除。

| 序 | 候选 | 改变哪一问 | 证据层级 | 核实 |
|---|---|---|---|---|
| S1 | [NixOS/nixpkgs #534657](https://github.com/NixOS/nixpkgs/pull/534657) 根文件被社区否决，`.gitignore` 替代 | 仓库该不该为单个客户端加根文件 | 原 PR＋关闭理由＋替代 PR | 重核 |
| S2 | [Home Assistant #153777](https://github.com/home-assistant/core/pull/153777) 统一入口当天回退 | 一个客户端能力缺口能否让整体方案作废 | 回退 PR＋被回退 PR＋评审原文 | 重核 |
| S3 | [AGENTS.md 静默不加载](https://blog.szypowi.cz/p/claude-code-reads-agents.md-only-when-telemetry-is-on/)＋[OTel Go #8988](https://github.com/open-telemetry/opentelemetry-go/pull/8988)＋[orca #31242](https://github.com/stablyai/orca/pull/31242) | 换入口前怎样验证“真的读到了” | 作者复现＋两个合并/恢复 PR | 重核 |
| S4 | [Kibana 固定树](https://github.com/elastic/kibana/tree/c698fe4fc3c283175adaba498b47b60bc61e24f0/.agents)＋[#272052](https://github.com/elastic/kibana/pull/272052) | 同文件共享能否连权限/Hook 一起共享 | 固定 symlink＋两套 hook 文件＋未合入修复 | 重核 |
| S5 | [Airflow #73107](https://github.com/apache/airflow/pull/73107)／[#73448](https://github.com/apache/airflow/pull/73448) 源包断链 | 共享入口的维护成本是否外溢到发布 | 合并 PR＋before/after | 重核 |
| S6 | [DuckDuckGo #6853](https://github.com/duckduckgo/apple-browsers/pull/6853) 停用 Cursor 但只迁评审配置 | 停用一个客户端是否等于整体迁移 | 合并 PR＋自报的静默失效假设 | 重核 |
| S7 | [Rootly 工程博客](https://rootly.com/blog/what-broke-when-engineering-went-fully-agent-based) 拒绝统一 harness | 公司层该统一工具还是统一底座 | 作者自报，无独立复现 | 重核 |
| S8 | [MarsBased 博客](https://marsbased.com/blog/2026/05/07/the-strategy-behind-the-shift-why-marsbased-left-cursor-for-claude-code) 统一 Claude Code、不统一编辑器 | 换执行入口是否必须换编辑器 | 创始人自报，无量化数据 | 重核 |
| S9 | [JetBrains 终端改用 libghostty](https://blog.jetbrains.com/platform/2026/10/jetbrains-terminal-now-uses-ghostty/) | 保留 IDE、在终端跑原 CLI 是否可行 | 厂商一手说明 | 重核 |
| S10 | [Codex 官方导入文档](https://learn.chatgpt.com/docs/import) | 试换时哪些能带走、哪些必须重核 | 官方契约 | 重核 |
| S11 | [Home Assistant #167219](https://github.com/home-assistant/core/pull/167219) 生成 Copilot 专属文件＋CI/pre-commit | 专属文件能否消灭，维护成本多少 | 合并 PR＋生成器 | 重核 |
| S12 | [Kibana #296583](https://github.com/elastic/kibana/pull/296583) 评审工作流先并行后下线 | 执行入口能否留在 CI 而非编辑器 | 合并 PR | 重核 |
| S13 | [Kibana #292150](https://github.com/elastic/kibana/pull/292150) 一份检查表接三个面 | 多客户端能否只共享内容、不共享机制 | 合并 PR | 重核 |
| S14 | [Home Assistant quality-scale-reviewer](https://github.com/home-assistant/core/blob/88f81cb15e611e6259fc9df43bb28ad2f71f938e/.github/workflows/quality-scale-reviewer.md) CI 里跑 Agent 前重置 PR 改过的 `.md` 与客户端目录、裁剪 skill | 执行入口在 CI 时，本地配置还算不算采用 | 固定 workflow | 重核 |
| S15 | [Grafana #120503](https://github.com/grafana/grafana/pull/120503)＋[#133055](https://github.com/grafana/grafana/pull/133055)＋[固定 AGENTS](https://github.com/grafana/grafana/blob/71d3f7ef47fea8810203c596ffa5b0f4f3930015/AGENTS.md) import shim 的存废 | 共享入口用软链还是导入，取决于客户端版本 | 合并/未合并 PR＋固定文件 | 重核 |
| S16 | [Airflow #68143](https://github.com/apache/airflow/pull/68143) `.agents/skills` 单一真源＋relay symlink | 多客户端共享 skill 的真实维护方式 | 合并 PR | 重核 |
| S17 | [Frapp #652](https://github.com/pdcarlson/Frapp/pull/652) 定时 Agent 从 Cursor 迁到 Claude Code Routines | 迁移成本主要在凭据与人工步骤 | 合并 PR | 重核 |
| S18 | [Next.js #88105](https://github.com/vercel/next.js/pull/88105)＋[`.codex` 固定文件](https://github.com/vercel/next.js/blob/4bfbf2382f7c4552381a71ba79a76c3224a63ceb/.codex/environments/next.toml) | 指令共享但执行环境各配一份 | 合并 PR＋固定配置 | 重核 |
| S19 | [Supabase Copilot 评审策略](https://github.com/supabase/supabase/blob/b27694b1d4641def5315a5169e93ba510b653f39/.github/copilot-instructions.md)＋[根 CLAUDE.md](https://github.com/supabase/supabase/blob/b27694b1d4641def5315a5169e93ba510b653f39/CLAUDE.md) | 并用是内容分工，不只是文件指针 | 固定文件 | 重核 |
| S20 | [PostHog owners.yaml](https://github.com/PostHog/posthog/blob/abbc794123b9a065da8e05d4ee671249b7e7ca54/.agents/owners.yaml)＋[`.cursor/rules`](https://github.com/PostHog/posthog/tree/abbc794123b9a065da8e05d4ee671249b7e7ca54/.cursor/rules) | 迁移遗留物和客户端专属规则的归属 | 固定文件 | 部分重核 |
| S21 | [Angular `.agent/rules/agents.md`](https://github.com/angular/angular/blob/f6486074e8ef6792c8a814226bf1aebff6b35b49/.agent/rules/agents.md) | 多客户端并用不是默认结局 | 固定 symlink | 重核 |
| S22 | [Vendure #5536](https://github.com/vendurehq/vendure/pull/5536) 删除根 CLAUDE.md、目录级改名 | 目录级规则也要迁，旧安装有兼容风险 | 合并 PR | 重核 |
| S23 | [Flatcar #2466](https://github.com/flatcar/Flatcar/pull/2466) 删除 CLAUDE.md | 小配置能否同样收敛 | 合并 PR | 重核 |
| S24 | [Airflow 贡献文档](https://github.com/apache/airflow/blob/71bdce5fa513b35071b9a01ffe94b81611ae4644/contributing-docs/05_pull_requests.rst) AI 政策只要求披露 | 治理该管工具还是管披露与验收 | 固定文档 | 重核 |

## 前几项为什么最值得深挖

**S1 是唯一一个“社区层面否决根文件”的完整样本。** 它不是“某公司没采用”，而是 99 个反对反应、关闭理由明确写成 `rejected by the community`、并且已经合入替代方案（把 `AGENTS.md`/`CLAUDE.md` 写进 `.gitignore`，让使用者自建软链）的完整决策链。它回答的是比“用哪个客户端”更前置的问题：仓库根目录要不要为任何单个客户端留文件。反对方还给出“根目录是稀缺资源”“要不要为每个专有 Agent 都放指针”的理由；这些理由会直接影响本仓 `docs/decisions/instruction-files.md` 里“多工具项目先试共享 AGENTS.md”的默认写法。尚需核实：候选清单说核心团队成员 emilazy 公开过 Claude Code 2.1.187/Opus 4.8 的有无 `CLAUDE.md` 前后对比，本次抓取的页面只看到 emilazy 的一句劝冷静评论，未看到该对比原文；“115 条评论、50 条评审意见”也未在页面拿到聚合值。

**S2 是“统一入口被单个客户端能力挡住”的最短闭环。** 原 PR #153680 把 `.github/copilot-instructions.md` 改名为 `AGENTS.md`（内容不变），并把 `CLAUDE.md` 软链改指 `AGENTS.md`，评审里已经在讨论“写 `@AGENTS.md` 能省一次工具调用”与“软链不用维护带内容的文件”；当天 #153777 就以“Copilot 只在 coding agent 支持 AGENTS.md，code review 不支持”整体回退，恢复原文件名和软链目标。它比任何“理论上应该统一”的论证都更能改变动作：统一入口不是内容问题，而是每个消费端的能力与固定读取路径问题。尚需核实：Copilot code review 之后是否补上 AGENTS.md 支持；本单元未查。

**S3 决定“换入口”是否真的成立。** 三份材料互补：作者用 canary 词复现读取受远端 flag 控制，关遥测时静默不加载、无警告；文章以 2.1.280 bundle 的注册说明该 flag，未写 canary 实测所用版本。Bedrock/Vertex/第三方网关的同问题来自其引用的 issue #95690，本单元未独立核。作者给出一行 `CLAUDE.md` 的绕法；OpenTelemetry Go 在同一能力发布后删除 shim，理由是避免两份指令漂移；orca 删除后又被下游 fork 恢复，因为 fork worktree 不加载 AGENTS.md，另有 `CLAUDE.local.md` 会让 Claude 完全跳过 AGENTS.md 的报告。三者合起来说明：删不删 shim 不是仓库偏好，而是“目标客户端版本＋检出形态＋托管平台＋是否存在 `.local` 文件”的函数。最值得深挖的原因是它给出可执行的验证方法（canary 词、两次会话），而不是只给结论。尚需核实：候选清单称 Anthropic 官方 changelog 在 09-23 版补上了这些环境，本次只读到作者文章说遥测关闭仍阻止加载；版本范围 2.1.277→2.1.281 未独立核。

**S4 把“多个客户端可读同一文件”拆到权限层。** 固定树里 `.claude/CLAUDE.md` 是 12 字节软链指向 `../AGENTS.md`，`.claude/skills` 是指向 `../.agents/skills` 的软链；但 `.claude/settings.json` 用 `PreToolUse` 的 `Bash` matcher 加 `if: Bash(gh *)`，`.cursor/hooks.json` 用 `beforeShellExecution` 加正则 `\bgh\b`。同一个“拦 gh 命令”的守卫必须按两套契约各写一份，说明共享的是内容，不是拦截层。#272052 又补上检出成本：没有 `core.symlinks = true` 的贡献者“Claude Code doesn't work out of the box”，修复 PR 用两个 SessionStart hook 重建链接，至今 Open、无评审。最值得深挖的原因是它同时给出“共享什么、不能共享什么、修复卡在哪”三层证据。更正：候选清单写“未开 core.symlinks 的 Windows 克隆”，PR 原文只写“not all contributors have `core.symlinks = true` in their gitconfig”，未点名 Windows；本文件按原文记录。

**S5 是唯一一个把 Agent 配置成本算进发布产物的案例。** `.claude/skills` 全是指向 `.agents/skills` 的 relay symlink，`.agents` 被 `export-ignore` 后，源码包里只剩死链；#73107 的 before/after 是“dangling symlinks 4→0、`.claude/` 从 tarball 消失”，#73448 把它 backport 到 3.3 分支。它提醒：保留/并用方案的维护成本不只在编辑器里，还会出现在 sdist、下游打包和发行检查里。尚需核实：候选清单说当前 `.gitattributes` 把 `AGENTS.md`/`CLAUDE.md`/`.agents`/`.claude`/`.github` 全部 export-ignore，本次只核了两个 PR 的表述，未逐行读当前文件。

**S6 是“停用一个客户端”最具体的部分迁移样本。** 合并说明直接写 `We no longer use Cursor`，把 `.cursor/BUGBOT.md` 的评审规则迁到 Claude Code Review 读取的 `REVIEW.md`，拆出按需加载的 `REVIEW-pixels.md`，常驻评审上下文从 24.7KB 降到 7KB；但它同时保留 `.cursor/rules`，因为“still load-bearing via `AGENTS.md`”。更关键的是作者自己标了两个可能静默失效的假设：按需加载不是 `REVIEW.md` 的文档化能力，若评审端没有仓库读权限，像素规则“silently never fire”；提交的 `CLAUDE.md` 是软链，若评审端不解析软链，“none of our conventions load”。这正好对应本仓“迁移前验四件事”里的“接续什么状态、接收什么结果”。

**如果只够读三份，按 S1→S2→S3：** 先判断根文件该不该存在，再判断统一入口能否成立，最后验证入口是否真的加载。若要决定“继续并用”而不是“收敛”，再接 S4→S5：先看权限/Hook 能否共享，再看发布与维护成本。

## S1–S10 明细

### S1 NixOS/nixpkgs #534657：根文件被社区否决，替代是 `.gitignore`

- **真实项目和任务。** nixpkgs 仓库，提案由 fzakaria 加根 `AGENTS.md` 指向 `CONTRIBUTING.md` 里的 Automation/AI 政策，并软链 `CLAUDE.md`。
- **原入口与改变。** 2026-06-23 提出，2026-07-24 由 wolfgangwalther 以 `rejected by the community` 关闭；讨论持续到 07-31。没有合并，改为把 `AGENTS.md`/`CLAUDE.md` 写进 `.gitignore`（PR #544374 已合入）。
- **原始链接与具体评论。** [PR #534657](https://github.com/NixOS/nixpkgs/pull/534657)。关闭理由原文：`I'm closing this PR as "rejected by the community"`；`LLM usage is not in the interest of the community, not just a few individuals`。替代方案原文：`I don't think we should include this symlink, but instead add CLAUDE.md to .gitignore`。页面显示开帖反应 19👍/99👎、139 条隐藏项。
- **采用证据与结果。** 替代 PR 已合入是可见结果；原提案没有采用。没有“用了之后效果如何”的数据。
- **正反条件与维护投入。** 反对方的核心不是“Claude 不好”，而是不为单个专有客户端在根目录留文件、根目录是稀缺资源、已有 AI 政策不需要再放指针；支持方主张 agent 需要入口。替代方案把成本转给每个使用者（自建软链），仓库不再维护共享入口。
- **净增量与未核。** 本仓 `docs/decisions/instruction-files.md` 目前把“多工具项目先试共享 AGENTS.md”写成默认；本项给出一个头部仓库明确拒绝该默认、并选择 `.gitignore` 的真实反例。未核：emilazy 的前后对比原文、评论/评审聚合数、`AGENTS.md` 单独提案（#536668/#545711）的具体结果。

### S2 Home Assistant #153777：统一入口上线当天回退

- **真实项目和任务。** Home Assistant core，把 `.github/copilot-instructions.md` 改名为 `AGENTS.md`（内容不变，GitHub 标为 `File renamed without changes`），并把 `CLAUDE.md` 软链从 `.github/copilot-instructions.md` 改指 `AGENTS.md`（#153680），让 Claude 与 Copilot 共用一个入口。
- **原入口与改变。** 2025-10-04 提出、10-05 合并；同日由 zweckj 提交回退 #153777，10-05 由 frenck 合入。回退理由只有一条：`copilot supports the AGENTS.md only for the coding agent, but not for code review`。
- **原始链接与具体评论。** [回退 PR #153777](https://github.com/home-assistant/core/pull/153777)、[原 PR #153680](https://github.com/home-assistant/core/pull/153680)。原 PR 评审中 fprochazka 建议 `if you write it as @AGENTS.md then Claude is gonna load it without additional tool calls`；zweckj 答 `The symlink should be fine`，理由是 `we don't have to manage a file with content then`。
- **采用证据与结果。** 回退已合入，统一入口没有保留；Copilot 评审继续读 `.github/copilot-instructions.md`。
- **正反条件与维护投入。** 这次改名把真源统一到 `AGENTS.md` 这个入口名，Claude 通过软链读取同一份内容；但 Copilot code review 只读固定路径 `.github/copilot-instructions.md`，改名把这个路径移走就直接失效。软链方案省去维护带内容的文件，但没有解决消费端的能力与固定路径差异。
- **净增量与未核。** 本仓已有“多工具共享要分别看 Codex 与 Claude 各自自然任务”的验收建议，但缺一个“统一入口被单个客户端能力挡住后整体退回”的原始案例；本项补上。未核：Copilot code review 后来是否支持 AGENTS.md。

### S3 AGENTS.md 静默不加载、shim 删除与 fork 恢复

- **真实项目和任务。** 三类真实动作：作者复现 Claude Code 2.1.277+ 的 AGENTS.md 加载条件；OpenTelemetry Go 删除只含 `@AGENTS.md` 的 shim；stablyai/orca 删除 `CLAUDE.md` 后又被下游 fork 恢复。
- **原入口与改变。** OTel Go #8988 于 2026-09-21 合并，删除根 `CLAUDE.md`；orca #31242 于 2026-10-20 合并删除，10-22 起 fork 以“permanent fork exception”恢复；作者文章 2026-09-23 发布，记录遥测关闭时文件不加载；Bedrock/Vertex/第三方网关的同类问题引自 issue #95690。
- **原始链接与具体评论。** [作者复现](https://blog.szypowi.cz/p/claude-code-reads-agents.md-only-when-telemetry-is-on/)、[OTel Go #8988](https://github.com/open-telemetry/opentelemetry-go/pull/8988)、[orca #31242](https://github.com/stablyai/orca/pull/31242)。作者原文：`Reading a markdown file from the working directory needs no network at all, but here it waits on a server-side switch`；`None of these cases print a warning`。OTel PR 理由：`Claude Code reads AGENTS.md directly in a project with no CLAUDE.md, so the import shim is redundant`。fork 理由：`Without its one line (@AGENTS.md), Claude Code sessions in fork worktrees stop loading AGENTS.md`；另一 fork 报告 `any CLAUDE.local.md in a checkout made Claude Code skip AGENTS.md entirely`。
- **采用证据与结果。** OTel 已合并、orca 上游已合并；fork 恢复与 `CLAUDE.local.md` 报告是下游维护者自报，但给出了具体检出形态。作者用 canary 词 `PERIWINKLE` 和两次会话复现，未依赖日志。
- **正反条件与维护投入。** 删除 shim 减少两份指令漂移；保留 shim 则要维护一行导入，但能覆盖旧版本、托管平台、fork worktree 和 `.local` 文件。作者的绕法就是一行 `CLAUDE.md`。
- **净增量与未核。** 本仓 `docs/decisions/instruction-files.md` 已写 `CLAUDE.local.md` 会让 Claude 改读 CLAUDE 文件，`docs/03-context-engineering.md` 也已写“部分 provider／禁遥测会话到 v2.1.281 才支持”；本批补的是 fork 检出中的具体报告、远端 feature flag 的具体触发与无警告表现、Bedrock/Vertex 点名的来源（引自 issue #95690，非作者实测），以及 canary 验证法。未核：官方 changelog 是否在 09-23 修复这些环境、2.1.281 的具体行为、候选清单中的版本范围。

### S4 Kibana：内容共享，权限/Hook 不共享

- **真实项目和任务。** Kibana 用 `AGENTS.md` 作真源，`.claude/CLAUDE.md` 软链过去，`.claude/skills` 软链到 `.agents/skills`（候选称 `.codex/skills` 同样）；但拦截 `gh` 命令的守卫在两个客户端各写一份。
- **原入口与改变。** 固定检出的 `.claude/settings.json` 用 `PreToolUse`，matcher 为 `Bash` 且 `if: Bash(gh *)`；`.cursor/hooks.json` 用 `beforeShellExecution`，matcher 为正则 `\\bgh\\b`，另有覆盖 `.netrc`/`.env`/`.aws`/`.ssh`/`.claude` 等的 guard。没有迁移，是长期并存。
- **原始链接与具体评论。** [固定 `.agents` 树](https://github.com/elastic/kibana/tree/c698fe4fc3c283175adaba498b47b60bc61e24f0/.agents)、[`.claude` 树](https://github.com/elastic/kibana/tree/c698fe4fc3c283175adaba498b47b60bc61e24f0/.claude)、[`.claude/CLAUDE.md`](https://github.com/elastic/kibana/blob/c698fe4fc3c283175adaba498b47b60bc61e24f0/.claude/CLAUDE.md)（12 字节 symlink → `../AGENTS.md`）、[`.claude/skills`](https://github.com/elastic/kibana/tree/c698fe4fc3c283175adaba498b47b60bc61e24f0/.claude/skills)（symlink → `../.agents/skills`）、[#272052](https://github.com/elastic/kibana/pull/272052)。
- **采用证据与结果。** 两套 hook 文件与软链是固定树的一手证据；#272052 是贡献者遇到“Claude Code doesn't work out of the box”后的修复提案，2026-05-31 开、06-15 force-push，至今 Open、无评审、未合入。
- **正反条件与维护投入。** 共享 skill 内容降低漂移；代价是权限/拦截层双写、检出时软链可能不存在、修复靠 SessionStart hook 重建。PR 原文只说 `Not all contributors have core.symlinks = true in their gitconfig`，未点名 Windows。
- **净增量与未核。** 本仓 `docs/01-agents/ide-and-others.md` 已有“多个客户端可读同一文件不能推出权限、恢复或执行环境等价”的原则；本项给出具体 hook 契约差异与未合入的检出修复。未核：两套 hook 行为是否等价、`.codex/skills` 软链、33 个 skill 的数量、SessionStart 修复是否覆盖所有客户端。

### S5 Airflow：relay symlink 让源码包断链

- **真实项目和任务。** Airflow 的 `.claude/skills` 全是指向 `.agents/skills` 的 relay symlink；`.agents` 已被 `export-ignore`，`.claude` 没有。
- **原入口与改变。** #73107（2026-09-14 合入）给 `.claude` 加 `export-ignore`；#73448（2026-09-21 合入 v3-3-test）backport 同一修复。
- **原始链接与具体评论。** [#73107](https://github.com/apache/airflow/pull/73107)、[#73448](https://github.com/apache/airflow/pull/73448)。原文：`.agents is export-ignored (added in #68851) but .claude was not`；`unpacking the source release gives you broken symlinks`；before/after 为 `4 → 0` dangling、`.claude/` `gone`、`31 other symlinks` 仍可解析。
- **采用证据与结果。** 两个 PR 均合并，backport 到 3.3 分支；修复只移除 `.claude` 和 4 个 relay，不改代码。
- **正反条件与维护投入。** 共享入口让开发期只有一份 skill，但发布期要同时维护两份 export-ignore 规则；漏一处就把死链发给下游。修复是“让目录整个消失”，不是让链接可用，说明发布包不再携带 agent 配置。
- **净增量与未核。** 本仓没有“共享入口的维护成本外溢到 sdist/打包”的条目；本项补上。未核：当前 `.gitattributes` 是否同时 export-ignore `AGENTS.md`/`CLAUDE.md`/`.github`、其它分支是否仍有死链。

### S6 DuckDuckGo：停用 Cursor，但只迁评审配置

- **真实项目和任务。** duckduckgo/apple-browsers，团队停用 Cursor，把 `.cursor/BUGBOT.md` 的 PR 评审规则迁到 Claude Code Review 读取的 `REVIEW.md`。
- **原入口与改变。** 2026-09-25 合并（commit `10da2d0`）。规则拆分：`REVIEW.md` 放常驻规则，`REVIEW-pixels.md` 放像素/宽事件细节、按需加载；常驻评审上下文 24.7KB→7KB；保留 `.cursor/rules`，因为仍经 `AGENTS.md` 起作用。
- **原始链接与具体评论。** [PR #6853](https://github.com/duckduckgo/apple-browsers/pull/6853)。原文：`We no longer use Cursor`、旧指引 `was being read by nothing`、`.cursor/rules/` `deliberately untouched` 因为 `it's still load-bearing via AGENTS.md`。两个风险：`The conditional load is not a documented REVIEW.md feature`，缺仓库读权限时像素规则 `silently never fire`；提交的 `CLAUDE.md` 是软链，`if symlinks are not resolved, none of our conventions load`。
- **采用证据与结果。** 合并、21 项检查通过、两名评审批准；效果只有作者自报的上下文体积下降，没有评审质量或漏检数据；首个像素 PR 才是按需加载的确认测试。
- **正反条件与维护投入。** 停用一个客户端不等于删掉它的全部配置；迁移评审入口可以只迁评审规则，保留仍被共享入口引用的规则树。代价是两条静默失效路径需要另行验收。
- **净增量与未核。** 本仓 `docs/01-agents/ide-and-others.md` 讲“接收与长期维护”，但没有“停用客户端后哪些配置仍 load-bearing”的案例；本项补上。未核：像素规则是否真的触发、评审端是否解析软链、`CLAUDE.md` 的 git blob 在其它检出形态下如何表现。

### S7 Rootly：拒绝统一 harness，只统一共享底座

- **真实项目和任务。** Rootly 工程团队同时用 Cursor、Claude Code、Codex；每人各有 `CLAUDE.md`，一季内分裂出几十个版本。
- **原入口与改变。** 2026-05-13 发布、06-23 更新。没有选一个统一 harness；改为把工程标准从 Notion 迁到 GitHub markdown 仓库，做 `rootly-agent-tools` 插件市场，用一个 46 行的 `engineering-standards` skill 指路，并用 `submit-pr` 六阶段 skill 要求真实执行证据。
- **原始链接与具体评论。** [Rootly 博客](https://rootly.com/blog/what-broke-when-engineering-went-fully-agent-based)。原文：`Every engineer has their own CLAUDE.md`；`Ten engineers running multiple agents each can produce dozens of versions of "how we do things" inside a single quarter`；`The fix wasn't centralization`；`Telling them which agent harness to use is the same fight as telling people which text editor to use`；`The tool is your choice. The rules are shared.`
- **采用证据与结果。** 作者自报，相关仓库私有，没有独立复现或量化效果；插件目前只服务 Claude Code，跨 harness 仍有缺口。
- **正反条件与维护投入。** 不统一工具降低组织摩擦；代价是共享底座要有人维护、每个 harness 的接入仍要各自补，46 行指针 skill 仍要随标准仓库演进。
- **净增量与未核。** 本仓 `docs/01-agents/ide-and-others.md` 的“保留编辑器、只补执行入口”主要是产品机制层面；本项给出公司层的组织理由，且明确把“指定 harness”类比为“指定编辑器”。未核：非 Claude 客户端如何消费该插件与标准仓库、真实采用人数、效果数据。

### S8 MarsBased：统一 Claude Code，不统一编辑器

- **真实项目和任务。** MarsBased 全公司从 Cursor 转向 Claude Code，目标是“不强迫所有人用同一个编辑器”。
- **原入口与改变。** 2026-05-07 由创始人/CTO Xavier Redó 发布。明确保留 Neovim、VS Code 及其 fork 用于看 diff/小改，作者本人装了 Zed。
- **原始链接与具体评论。** [MarsBased 博客](https://marsbased.com/blog/2026/05/07/the-strategy-behind-the-shift-why-marsbased-left-cursor-for-claude-code)。原文：`we have decided to standardize across the company on Claude Code`；`a shared, focused environment for coding with agents that does not force everyone into the same editor`；`People who use Neovim can keep using Neovim`；`The AI writes the code. The human provides direction, context, and judgment.`
- **采用证据与结果。** 只有创始人自报和“internal benchmarks”一句，没有数字、采用率或第三方复现；候选清单提到的 Handbook 中 `CLAUDE.md`/`.claude/rules`/RPI/三处人工复核未在该页面出现。
- **正反条件与维护投入。** 统一执行入口可以获得一致的 agent 体验；代价是仍要维护各编辑器的接入和共享规则，且“统一 Claude Code”本身是供应商集中风险。
- **净增量与未核。** 本仓已有“编辑器与执行 Agent 可以分开选”的判断，但缺公司级样本；本项补上“统一入口、不统一编辑器”的自报案例。未核：Handbook 细节、实际迁移范围、效果数据。

### S9 JetBrains：保留 IDE，在终端里跑原 CLI

- **真实项目和任务。** JetBrains 2026.3 的内置终端改用 libghostty，替换使用多年的 JediTerm。
- **原入口与改变。** 官方文章（候选日期 2026-10-27）说明：AI coding agents（Claude Code、Codex）、Neovim、tmux 等推动终端协议需求；libghostty 接管解析和终端状态，IDE 保留渲染和高层集成。
- **原始链接与具体评论。** [JetBrains 博客](https://blog.jetbrains.com/platform/2026/10/jetbrains-terminal-now-uses-ghostty/)。原文：`It now runs on libghostty`；`libghostty replaces JediTerm`；Kitty keyboard protocol 让 `Enter`、`Shift + Enter`、`Ctrl + Enter` 可区分；主题切换通过 mode 2031 通知，`Claude Code, OpenCode, Pi, Neovim, and tmux` 订阅；新引擎处理 `almost 50 control sequences`；OSC 52 剪贴板、OSC 9/777 通知、ConEmu 进度条、Kitty graphics 已解析但 IDE 侧尚未接入。
- **采用证据与结果。** 厂商一手说明，没有独立用户验证；能证明的是编辑器厂商在为“保留 IDE、在终端跑 CLI Agent”补基础设施，不是效果数据。
- **正反条件与维护投入。** 好处是不用换编辑器就能获得更接近独立终端的 TUI；限制是剪贴板、通知、进度条等仍未接通，需要另验。官方文章给出回退入口：`If something goes wrong, you can switch back to JediTerm: go to Help | Find Action, open Registry…, and turn off terminal.use.ghostty.emulator.`；新引擎在 2026.3 EAP 起默认启用，并沿用至 Beta、RC 和稳定版。
- **净增量与未核。** 本仓 `docs/01-agents/ide-and-others.md` 的 JetBrains 节讲 AI Chat/ACP 的边界，没有讲终端引擎这一层；本项补上“编辑器侧修终端，而不是换 Agent IDE”的路径。未核：真实 IDE 版本行为、OSC 52 等后续落地时间。

### S10 Codex 官方导入文档：迁移能带走什么、必须重核什么

- **真实项目和任务。** Codex 官方“从其他 Agent 导入”文档；桌面端可从 Claude Code／Claude Cowork／Cursor 导入。
- **原入口与改变。** CLI 只支持 Claude Code／Cursor，最多导入近 30 天 50 条聊天；映射包括指令文件→`AGENTS.md`、`settings.json`→`config.toml`、Skills、Plugins、Projects、Memories、近 30 天聊天、MCP 配置、Hooks、Slash commands→Skills、Subagents。
- **原始链接与具体评论。** [官方文档](https://learn.chatgpt.com/docs/import)。原文：`Importing doesn't change or delete your existing agent setup`；同步是单向（从原 Agent 到导入副本）；`/import` 在 running task、remote session、local app-server daemon 下不可用。
- **采用证据与结果。** 官方契约，没有独立迁移复现；文档明确要求导入后重核工具权限、MCP 自定义认证/headers/env/transports、Hook 行为、插件、带参数/路径占位符的 prompt 模板。
- **正反条件与维护投入。** 降低试换成本，能带走聊天和配置；但文档自己说“不等于行为等价”，权限、Hook、MCP 认证都可能需要重新登录或重配。
- **净增量与未核。** 本仓 `docs/01-agents/ide-and-others.md` 的“迁移前验四件事”是验收框架；本项给出 Codex 侧的具体搬运清单和不可用模式。未核：导入后 Hook/权限的实际保真度、是否有第三方复现、同步冲突如何处理。

## 其余保留项（S11–S24）

下表保留理由看「原入口与改变」与「条件、代价与未核」两列；这些项的净增量按主题汇总在下一节，避免每行重复同一结论。

| 序 | 项目/任务 | 原入口与改变 | 固定链接与日期 | 采用/结果证据 | 条件、代价与未核 |
|---|---|---|---|---|---|
| S11 | Home Assistant 生成 Copilot 专属文件 | `script/gen_copilot_instructions.py` 用 `AGENTS.md` 生成 `.github/copilot-instructions.md`（候选称另加 PR 模板，未核）；#167219 再加 pre-commit hook，CI 已有校验 | [#167219](https://github.com/home-assistant/core/pull/167219)、[固定生成文件](https://github.com/home-assistant/core/blob/88f81cb15e611e6259fc9df43bb28ad2f71f938e/.github/copilot-instructions.md)；同作者 [#166496](https://github.com/home-assistant/core/pull/166496) 2026-03-25 开、04-02 作者自关 | #167219 已合并；工作流说明 pre-commit 在 AGENTS.md、相关 skill、生成器或目标文件变化时重生成 | 专属文件无法消灭，只能加自动维护；候选称 abmantis 反对“pre-commit 更慢”未见原文，未核；已核：`.github/copilot-instructions.md` 首行（dev 与本行固定提交 88f81cb 均为）`<!-- Automatically generated by gen_copilot_instructions.py, do not edit -->`，是生成器自动维护的直接证据 |
| S12 | Kibana 评审工作流先并行后下线 | #296583 删除 Claude Reviewer 与 Scout Test Reviewer 两个 GitHub Actions，理由 `now that we are on Libra` | [#296583](https://github.com/elastic/kibana/pull/296583) 2026-10-08 合并 | 两评审批准、51 项检查通过；只删两个 workflow | 说明执行入口可在 CI、可整体撤回；候选称 #265641 引入 Claude reviewer（约 $1.37/次）、#290933 把 Libra 覆盖提到 50%，本页未出现，未核；Libra 内部是否仍用 Claude/Codex 未核 |
| S13 | Kibana 一份检查表接三个面 | 同一份 agent-builder 检查表 C1–C6/Q1–Q8 落到 `.libra/specialists/`、`.github/agents/` 的 Copilot 审核 agent、`.agents/skills/agent-builder-tool-review/SKILL.md`（Claude Code 或 Cursor 可用） | [#292150](https://github.com/elastic/kibana/pull/292150) 2026-10-01 合并 | 合并；客户端专属的只是触发条件与评论格式 | 共享内容不共享执行机制；Copilot 自报 `unable to run its full agentic suite`，说明三面不等价 |
| S14 | Home Assistant CI 里的 Agent 执行入口 | `quality-scale-reviewer` 在 GitHub Actions 跑 agent 做 PR 评审；先 fetch 并 checkout PR head，再把 PR 改动过的所有 `.md`（含根 `AGENTS.md`）逐个 `rm -rf` 后从 `BASE_SHA` 取回（workflow 注释：`Copilot CLI loads instructions from Markdown files in many locations, so every .md is reset`）；随后重置 `.github/.agents/.claude/.codex/.gemini/.pi` 六个目录（先 `rm -rf` 再 `git checkout "${BASE_SHA}" -- "${path}"`）、删除 `.mcp.json`、把 `.claude/skills` 裁到只剩 `ha-quality-scale-verify`；设每日 AI credit 预算。`.agents/skills` 与 `.gemini/skills` 均是指向 `../.claude/skills` 的 symlink，裁剪同时生效 | [固定 workflow](https://github.com/home-assistant/core/blob/88f81cb15e611e6259fc9df43bb28ad2f71f938e/.github/workflows/quality-scale-reviewer.md)＋[`.claude/skills` 树](https://github.com/home-assistant/core/tree/88f81cb15e611e6259fc9df43bb28ad2f71f938e/.claude/skills) | 固定 workflow 原文；未见运行结果 | 说明“本地有客户端配置”不等于“该客户端在执行”；CI 入口用默认分支副本覆盖 PR 改过的指令文件（含根 `AGENTS.md`）并裁掉白名单外 skill，不采用 PR 里的配置；每日预算用尽即跳过评审；Claude 是唯一真源、其他客户端只是借读 |
| S15 | Grafana import shim 的存废 | #120503（2026-03-17 合并）加一行 `CLAUDE.md` 包含 `AGENTS.md`，作者实测 Codex 读 AGENTS.md、Claude 只读 CLAUDE.md；#133055（2026-09-18 开）以 2.1.277 可直接读 AGENTS.md 为由提议删除，至今 Open/stale | [#120503](https://github.com/grafana/grafana/pull/120503)、[#133055](https://github.com/grafana/grafana/pull/133055)、[固定 AGENTS.md](https://github.com/grafana/grafana/blob/71d3f7ef47fea8810203c596ffa5b0f4f3930015/AGENTS.md) | #120503 合并；#133055 因未签名提交/CLA/待评审未合入 | 共享入口用软链还是 `@AGENTS.md` import 取决于客户端版本；固定 AGENTS.md 要求 `frontend-testing-strategy` skill（另有 `panel-testing-strategy`），而 skill 只在 `.claude/skills`，非 Claude 客户端读到悬空引用；AGENTS.md 还含 “Cursor Cloud specific instructions” 节 |
| S16 | Airflow 从 Codex 专用到 `.agents/skills` 单一真源 | #68143（2026-06-07 合并）把 `.agents/skills/` 设为 canonical，`.github/skills/` 与 `.claude/skills/` 放 per-skill relay symlink；消费者列 Codex、Cursor、Gemini CLI、Copilot、OpenCode、Claude Code、GitHub | [#68143](https://github.com/apache/airflow/pull/68143) | 合并；141/143 检查通过；backport 到 v3-2-test 失败需手工 cherry-pick | 代价是多路径 relay、prek 跳过软链所以 lint 只覆盖真文件、license/codespell/markdownlint 等工具路径要重指、`.gitignore` 要放行 relay；候选称更早的 #50824/#62440/#62443 迁移链未在本页出现，未核 |
| S17 | Frapp 定时 Agent 迁移 | 两个 Linear 定时 agent 从 Cursor 迁到 Claude Code Routines；删 `.cursor/`，五份 playbook 进 `.claude/skills`，认证从 `LINEAR_API_KEY` 改为运行环境注入的 Linear MCP | [#652](https://github.com/pdcarlson/Frapp/pull/652) 2026-08-04 合并 | 合并、16 项检查通过；合并后另修五处跨文档矛盾 | 仍需人工在 UI 建 routine、停旧 Cursor 自动化、吊销旧 key；PR 未做运行时验证；迁移成本集中在凭据、人工步骤和文档一致性 |
| S18 | Next.js 指令共享、执行环境各配 | #88105 把 `CLAUDE.md` 改名 `AGENTS.md` 并留软链，理由是 AGENTS.md 覆盖更多 agent、Claude Code 当时还不支持；`.codex/environments/next.toml` 标 `THIS IS AUTOGENERATED. DO NOT EDIT MANUALLY`，执行 `pnpm install --frozen-lockfile` 与 `pnpm build --filter=next` | [#88105](https://github.com/vercel/next.js/pull/88105) 2026-01-05 合并；[`.codex` 树](https://github.com/vercel/next.js/tree/4bfbf2382f7c4552381a71ba79a76c3224a63ceb/.codex) 与 [固定 toml](https://github.com/vercel/next.js/blob/4bfbf2382f7c4552381a71ba79a76c3224a63ceb/.codex/environments/next.toml) | PR 合并；固定文件确认自动生成与命令 | 指令共享但 Codex/Cursor 各自维护执行环境；候选称 `.cursor/worktrees.json` 重复同一套 pnpm install+build，本单元未读，未核 |
| S19 | Supabase 并用是内容分工 | 根 `CLAUDE.md` 是 11 字节普通文件，内容仅 `@AGENTS.md`；`.github/copilot-instructions.md` 是独立的 “Copilot Code Review Instructions”，要求 >85% 置信才评论、团队只采纳 <20% 默认 Copilot 建议、`Silence is better than noise` | [根 CLAUDE.md](https://github.com/supabase/supabase/blob/b27694b1d4641def5315a5169e93ba510b653f39/CLAUDE.md)、[Copilot 文件](https://github.com/supabase/supabase/blob/b27694b1d4641def5315a5169e93ba510b653f39/.github/copilot-instructions.md) | 固定文件原文；未见使用效果 | 说明并用不只是文件指针，评审策略这类内容无法并进共享文件；候选称 `.claude/skills` 软链到 `../.agents/skills`，本单元未核 |
| S20 | PostHog 迁移遗留物与归属 | `.agents/owners.yaml` v1：`/*` 归 `team-devex`，`/skills/building-product-empty-states/` 归 `team-growth`；`.cursor/rules` 下仍有 `django-python.mdc`、`react-typescript.mdc`、`rust.mdc` | [owners.yaml](https://github.com/PostHog/posthog/blob/abbc794123b9a065da8e05d4ee671249b7e7ca54/.agents/owners.yaml)、[.cursor/rules](https://github.com/PostHog/posthog/tree/abbc794123b9a065da8e05d4ee671249b7e7ca54/.cursor/rules) | 固定文件；owner 分派可核 | 迁移后仍保留客户端专属规则，且有明确 owner；候选称 `.cursorrules`、`.mdc` 的 globs/alwaysApply、`CLAUDE.md` 软链未逐项核 |
| S21 | Angular 完全不接 Claude/Cursor | `.agent/rules/agents.md` 是 15 字节 symlink，内容 `../../AGENTS.md`，无 frontmatter | [固定文件](https://github.com/angular/angular/blob/f6486074e8ef6792c8a814226bf1aebff6b35b49/.agent/rules/agents.md) | 固定 symlink；未见使用记录 | 头部开源项目可以完全不用 Claude Code/Cursor，多客户端并用不是默认结局；更正：候选写“全文只有一行”，实际是软链；无 `.claude`/`.cursor`/`.agents` 未核 |
| S22 | Vendure 删除根 CLAUDE.md、目录级改名 | 根 `CLAUDE.md`（软链）删除；`docs/CLAUDE.md`、`packages/dashboard/CLAUDE.md` 两个实体文件内容不变改名为 `AGENTS.md`；`No other file referenced CLAUDE.md` | [#5536](https://github.com/vendurehq/vendure/pull/5536) 2026-10-11 合并 | 合并、39 项检查通过；CodeRabbit 评审 | CodeRabbit 提醒旧版本或改过 project-instruction 设置的安装可能需要调整；无人工实测记录；说明目录级规则也要迁，不只根文件 |
| S23 | Flatcar 删除 CLAUDE.md | #2466 删除 `CLAUDE.md`，提交信息 `Claude Code learned how to read "AGENTS.md"` | [#2466](https://github.com/flatcar/Flatcar/pull/2466) 2026-10-27 合并 | 合并；Chewi 批准；Copilot 评论说给的上下文没有 diff，无法核删除内容是否保留 | 真实消费者收敛，但配置很小、证据薄；候选称主分支只剩 735 字节 AGENTS.md、无评审讨论，本次见 Copilot 评论，标更正；文件大小未核 |
| S24 | Airflow AI 政策只要求披露 | 贡献文档要求 PR 描述声明使用 Gen-AI、审阅并理解生成代码、贡献者承担最终责任；未限制编辑器或 Agent | [固定文档](https://github.com/apache/airflow/blob/71bdce5fa513b35071b9a01ffe94b81611ae4644/contributing-docs/05_pull_requests.rst) | 固定文档原文 | 治理放在披露与人工验收，把“用哪个客户端”留给个人；候选称 PR 模板有 checkbox 与 `Generated-by` 行，该文档未见，未核 |

## 仅机制样本与合并项

- **[VS Code AGENTS.md](https://github.com/microsoft/vscode/blob/2275d3ca2e5450119a7a9a8cc7ce658844882000/AGENTS.md)**：开头是 `# VS Code Agents Instructions`，正文只指向 `.github/copilot-instructions.md`，本身没有实质项目指引；仓库无 `.claude`。它是“共享入口=指针、真源在单一客户端”的机制样本，且是编辑器厂商仓，**不作独立消费者或采用证据**。
- **[Kibana #3a56208f 固定树](https://github.com/elastic/kibana/tree/3a56208f5c644b5af8fedf5f54372291889c5f07)**：与 S4 的 c698fe4 固定树是同一机制的另一次检出；本文件以 c698fe4 的 hook 文件与软链为准，不再重复计数。

## 与仓内已有材料的净增量

- `docs/01-agents/ide-and-others.md` 已有“编辑器与执行 Agent 可以分开选”“迁移前验四件事”“多个客户端可读同一文件不等于权限/恢复/执行环境等价”的原则。本批新增的是可回源的案例与具体契约：Kibana 两套 hook 的 matcher 差异、Airflow 的 sdist 死链、DuckDuckGo 的两条静默失效假设、NixOS 的社区否决与 `.gitignore` 替代。
- `docs/decisions/instruction-files.md` 已有共享 `AGENTS.md`、`@AGENTS.md` 导入、v2.1.277+ 原生加载与混合版本保留导入的判断，并已写 `CLAUDE.local.md` 会让 Claude 改读 CLAUDE 文件；`docs/03-context-engineering.md` 已写“部分 provider／禁遥测会话到 v2.1.281 才支持”。本批新增的是远端 feature flag 的具体触发、无警告表现、Bedrock/Vertex/第三方网关点名（引自 issue #95690）、fork worktree 不加载、软链不被解析，以及 canary 验证法；另有一个头部仓库拒绝根文件的真实反例。
- `docs/01-agents/README.md`、`ide-and-others.md` 已收 Cursor Cloud、VS Code Agent Host、Zed Terminal Threads、Kiro 等执行入口；本批新增 JetBrains 终端引擎、Codex 官方导入、MarsBased/Rootly 的组织层选择，不重复已有条目。
- 本仓已有的 Sentry/dotagents、Cursor Agent SDK、Claude VS Code/CLI 对照、Zed/ACP、Browser Use/Pi 等材料未在本批重做；本文件只处理“编辑器/执行入口选择”的新案例。

## 证据缺口与未核清单

1. **GitHub API 限额。** 本机未认证 API 返回 `rate limit exceeded`，`raw.githubusercontent.com` 的 TLS 连接为 000；本单元改用 `github.com` HTML/Blob 页面和 WebFetch 读取，无法做 GitHub code search，也没有 star 增长或全仓采用率。
2. **未运行任何客户端。** 没有安装或运行 Claude Code、Codex、Cursor、JetBrains、Kibana/Airflow 配置；所有 Hook、导入、Routine、终端行为都是原文与固定文件核对，不是实际行为验证。
3. **候选清单子主张未逐项核。** 已在各条目标“未核”的包括：NixOS 的 emilazy 前后对比与评论/评审计数；Kibana 的 33 个 skill 数量、`.codex/skills` 软链、两套 Hook 行为等价性；Airflow 的早期迁移链与当前 `.gitattributes` 全量；Grafana #133055 的客户端版本前提；HA #166496 的 abmantis 反对意见；Next.js 的 `.cursor/worktrees.json`；Supabase 的 `.claude/skills`；PostHog 的 `.cursorrules`、`.mdc` frontmatter、`CLAUDE.md` 软链；Angular 无 `.claude`/`.cursor`/`.agents`；Flatcar 的 735 字节；JetBrains 的真实 IDE 版本行为与 OSC 52 等落地时间；MarsBased 的 Handbook 细节。
4. **部分来源是自报或厂商内容。** Rootly、MarsBased、JetBrains、DuckDuckGo 的效果描述均为作者/厂商自报；NixOS、Kibana、Airflow、Home Assistant 的配置与 PR 是一手文件，但不等于运行时效果。Vendure 的兼容风险来自 CodeRabbit 评审，不是人工实测。
5. **主窗与旧决定。** S2（2025-10-05）、S15 的 #120503（2026-03-17）、S18（2026-01-05）早于主窗，按原日期保留用于追溯机制；其余多在主窗或近三个月内。
6. **未覆盖渠道。** 按任务分工未使用 Reddit、LINUX DO、V2EX；HN 未在本单元系统检索，因此不能以“没找到讨论”推断没有社区反馈。

## 排除与降级

| 项 | 处理 | 理由 |
|---|---|---|
| VS Code AGENTS.md | 降级为机制样本 | 编辑器厂商仓，正文只是指向 Copilot 文件的指针；不能冒充独立消费者或采用证据 |
| Kibana #3a56208f | 合并到 S4 | 与 c698fe4 固定树是同一机制的重复检出，避免重复计数 |
| Flatcar #2466 | 保留但低权重 | 真实收敛动作，但配置很小、只有 Copilot 一条“上下文不足”的评论，无法证明复杂多客户端配置也能同样合并 |
| Vendure #5536 | 保留但低权重 | 只有 CodeRabbit 的版本兼容提醒，无人工实测；目录级改名的证据清楚，效果证据薄 |
| PostHog | 保留为维护成本样本 | 能证明 owner 分派与客户端专属规则并存，但“三代并存”的完整清单未逐项核 |
| 仅“文件存在/可访问”的仓库 | 不单列 | 任务要求文件存在只记配置；真正采用要回到公开使用记录 |

## 探索回执

读取截止 2026-10-29。实际渠道：GitHub PR/Blob/Tree 页面、固定 commit 文件、作者博客、厂商官方博客、官方文档；WebFetch 与 curl 均只读公开页面。逐项核实方式与结果已在上文标记；未安装、未运行任何候选，未使用账号、代理、镜像或绕过访问控制，未读取私人会话或本机配置。写入后检查：`scripts/check_repo.py` 0 errors（542 个文件）、`scripts/check_public.py` 0 findings（955 个文件）、`git diff --check` 通过、UTF-8/LF、无尾随空白、单结尾换行。
