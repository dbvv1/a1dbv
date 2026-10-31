# Qwen #15741 旧候选：投稿前判断与下一步

判断日期 2026-10-31。判断依据是附入页面 `docs/decisions/upstream-contributions.md@8da233c89e9bd92d4f3bb4f0d6b5fa11ebba5275`（与仓库该提交逐字一致），以及 `experiments/candidate-reset-recovery/qwen/change.patch`、`manifest.json` 的 qwen 条目和 `qwen/repro/*`。未创建 issue／PR／评论，未运行候选、产品、模型或测试。

## 结论：不要按“重名修复”投当前补丁，先按项目入口确认剩余差量的归属

当前补丁同时做了两件事：重名导致转换失败时抛出原始错误，以及把任何非 `Method not found` 的发现失败保存在 `ToolDiscoveryResult.error` 里再抛给调用方。第二条仍是当前 main 上的独立缺口；第一条已被一个开放 PR 占用。因此现在可执行的下一步是“按项目入口讨论”，不是直接投稿：

1. **由候选所有者本人在 #15741 发一条范围确认评论**（不要新开重复 PR）。内容要引用 #15757 正文的 out-of-scope 原句，并说明当前 main 仍未透传非重名失败：

   > #15757 handles the duplicate-name case. Its PR body still lists “other conversion failures still collapse into the generic ‘no tools’ message” as out of scope. On main `3df7f9ce`, `discoverToolsWithMetadata` still returns `{ tools: [], ... }` without the original error (`packages/core/src/tools/mcp-client.ts:1766-1775`), so `discoverAndReturn` / `connectAndDiscover` throw `No prompts, tools, or resources found on the server.` whenever `tools/list` or a non-duplicate conversion fails and no prompts/resources remain (`:793-800`, `:1542-1549`). I have a small patch that preserves that original error and tests `tools/list` failure, non-`Error` rejection, genuine empty, and unsupported `tools/list`; it does not attempt duplicate-name recovery. Would maintainers prefer this as a separate small fix, or folded into #15757? If folded, I will rebase and drop the duplicate-specific tests and docs wording.

2. **并行缩窄候选，不另起重名实现**：只保留错误透传（`ToolDiscoveryResult.error`、两个调用点的 throw 选择），删掉以重名为前提的测试和 `docs/users/features/mcp.md` 中“重名时报告底层错误”的措辞，改成“发现/转换失败时报告底层错误”。以当前 main `3df7f9ce` 为基线；不要复制 #15757 的 cursor 遍历或重名分组逻辑。
3. **按维护者答复选路**：若同意单独接，补完 preflight 与 Before/After 证据后再按另行授权的投稿流程执行；若同意并入 #15757，把片段交给该 PR，不另起 PR；若认为已覆盖或不需要，收起补丁。
4. **preflight 未通过前不得声称测试通过**。已有验证只到 build／typecheck、409 项相关测试和 bundle；完整测试被 Unix socket EPERM 阻断且未重跑。这是缺口，不是通过。

## 原文依据

### 页面入口核对

附入的页面全文与仓库 `8da233c8` 的 `docs/decisions/upstream-contributions.md` 逐字一致（59 行，空白 diff）。入口不卡。

### 上游现状（2026-10-31 只读核对）

- **Issue #15741**：`open`，标题 “MCP: duplicate tool names discard the entire server and emit a misleading 'no tools' error”，标签 `priority/P2`、`type/bug`、`category/tools`、`scope/mcp`，创建 2026-10-27，最后更新 2026-10-28，3 条评论，无 assignee、无 milestone。期望行为第 2 条是“先报重复错误，不要在工具被拒时再报空服务器”；第 1 条是跳过冲突工具、保留其余工具。
- **关联 PR #15757**：`open`、未合并，`Closes #15741`，head `f0b2104c`（2026-10-30 最后更新），base `9acb3a5a`，2 个文件、+360/−15、3 commits。正文明确把 “other conversion failures still collapse into the generic 'no tools' message” 列为未覆盖／范围外。维护者侧：collaborator `wenshao` 在 `f0b2104c` 上评论 “merge-ready”（15/15 断言），但正式 review 仍是早前 head 的 `CHANGES_REQUESTED`；作者 2026-10-30 说该 head 的所有 job 都 `cancelled`，需要维护者重跑 CI 并正式复审。当前 check-runs 统计为 14 cancelled、83 skipped、3 success。PR 有 assignee `yiliang114` 和多名 requested reviewers。
- **#15741 讨论**：除 bot triage 外，只有社区用户 `Nakagawa-master`（association `NONE`）提出验收边界，并把“只保留类型化失败状态、不假装做了部分恢复”称为可独立交付的较窄第一版。这是社区建议，不是维护者准入决定。

### 当前代码与旧补丁差量

当前 main 是 `3df7f9ce8312d15fa1c3387218a412f21cf0387b`（2026-10-31 拉取）。候选触及的三个文件与该补丁的 base blob 完全相同：

| 文件 | 当前 main blob | 候选 base blob |
|---|---|---|
| `packages/core/src/tools/mcp-client.ts` | `457ad4df…` | `457ad4df…` |
| `packages/core/src/tools/mcp-client.test.ts` | `5a7e5f45…` | `5a7e5f45…` |
| `docs/users/features/mcp.md` | `bbb3b1fd…` | `bbb3b1fd…` |

`git apply --check` 对当前 main 的三个文件通过。也就是说，旧补丁没有被已合并实现覆盖；但它的重名触发场景已经被开放 PR #15757 以更强行为（保留不重名工具、整组丢弃重名声明、全重名不再报空服务器）占用。当前 main 仍保留 #15757 明确不覆盖的通用诊断缺口：

- `ToolDiscoveryResult` 没有 error 字段（`mcp-client.ts:1620-1623`）。
- `discoverToolsWithMetadata` 的外层 catch 只记录日志，随后 `return { tools: [], hadVisibilityFilteredTools: false }`（`:1766-1775`）；`Method not found` 仍走原返回。
- `discoverAndReturn` 在“无 prompts／tools／resources 且无可见性过滤”时抛通用空服务器错误（`:793-800`）；`connectAndDiscover` 同样（`:1542-1549`）。

因此候选的剩余差量是“非重名、非 Method-not-found 的发现／转换失败仍被折叠成空服务器”，不是重名恢复本身。

### 固定核验基线的性质

输入中的 `3a4a07736299dc2cfa002346dbc4eaf8fd519625` 是上游 main 上 2026-10-30 的一次无关合并（`fix(web-shell): keep "+ Add session" clickable…`，#15835），不是候选补丁的提交。该提交下候选触及的三个文件 blob 仍与 base 相同，所以“在该固定基线核过 build／typecheck、409 项相关测试和 bundle”与“把补丁应用在固定上游基线后验证”一致。它不包含 PR #15757 的改动。

### 项目规则（当前 main，2026-10-31 阅读）

- 根 `CONTRIBUTING.md`（README 链接的版本）：§1 所有 PR 应关联已存在的 issue；§2 PR 保持小而集中（约 1,200 行起拆分，2,000 行以上须拆分或说明）；§3 WIP 用 Draft PR；§4 提交前 `npm run preflight` 全通过；§5 用户可见变更须更新 `/docs`；§6 bug fix 须附 before／after 的截图或短视频；§7 Conventional Commits 与清晰 PR 描述。
- `AGENTS.md`：`packages/core/src/**` 和 `packages/*/src/tools/**` 属核心基础设施，外部 PR 走两级门禁；500+ 行生产代码的 `refactor` 硬阻断，`fix` 类型不因规模硬阻断但要升级给维护者；小范围变更须 100% 确信，否则升级。候选是 `fix`、生产代码改动很小，不触发硬阻断，但仍属需维护者判断的核心路径。
- `docs/developers/contributing.md` 是旧版副本（仍写 `npm install`），与根 `CONTRIBUTING.md` 不一致；以 README 链接的根版本为准。
- PR 模板要求：What／Why、Reviewer Test Plan（How to verify、Before & After、Tested on、Environment）、Risk & Scope、Linked Issues，以及英文正文的完整中文翻译。
- 已读的 CONTRIBUTING、AGENTS、模板和工作流文件名中未发现 CLA、DCO、`Signed-off-by` 或 vouch 要求；未发现 AI 使用披露规则。按页面规则，这些是“规则沉默／未知”，不写成“允许”或“无要求”。

## 尚缺的证据／决定

1. 维护者是否把“非重名发现失败透传”视为值得单独接的修复，还是并入 #15757。只有维护者在 #15741／#15757 的答复能解除；bot 标签和社区评论都不够。
2. #15757 是否合并、以什么代码形状合并。它一旦合入，候选必须 rebase 并删除重名专用测试与文档措辞，否则会与新行为冲突。
3. 完整 `npm run preflight` 结果。现有环境被 Unix socket EPERM 阻断，缺的是项目明确要求的全量检查，不是“再跑一次测试”能掩盖的。
4. bug fix 所需的 before／after 证据（项目 §6、PR 模板）尚未准备；至少要有重名或 `tools/list` 失败时修复前后的日志对照。
5. AI 参与方式是否需要在 PR 描述中说明：已读规则沉默，保留为贡献者本人的决定。

## 后续需补跑的检查（获得授权后）

- `corepack pnpm install --frozen-lockfile`（按 `packageManager` 的 pnpm 版本）
- `npm run build && npm run typecheck`
- `cd packages/core && npx vitest run src/tools/mcp-client.test.ts`
- `npm run lint`、`npm run format`，最终以 `npm run preflight` 为准；若 EPERM 仍在，记录具体失败项，不以部分检查替代。
- 若 rebase 到 #15757 之后：重跑该 PR 新增的跨页／重复 cursor／全重名用例，并补一个“非重名转换失败仍透传错误”的用例。

## 页面卡点

- **“已合并的实现覆盖了同一行为，就收起重复实现；仍有独立失败路径时，说明剩余差量，按项目要求讨论。”** 页面只区分“已合并”和“独立缺口”，没写“上游存在未合并、但已覆盖部分行为的开放 PR”该怎么办。我先按“未合并＝未覆盖”保留候选，核对 #15757 正文的 out-of-scope 后才改成“重名部分让给该 PR，只讨论诊断差量”。
- **“先确认项目愿意接这项贡献，再做实现和投稿”** 与 **“查看 issue 的最新状态、关联 PR、讨论与项目要求的准入状态”**：Qwen 的 issue 只有 bot triage 标签和社区建议，没有维护者明确表示接受外部实现；页面没有定义“项目愿意接”的最低信号。我只能判为“缺陷已被受理、实现准入仍未知”。
- **“测试通过后仍要核当前上游、作者准入与人的责任”** 和 **“沿项目现成模板提交一个明确变化，写问题、关键取舍、实际验证和剩余风险。”**：页面没有说明项目必跑检查被环境阻断（这里是 Unix socket EPERM）时如何记缺口。我把 preflight 保留为未通过，没有拿 409 项相关测试代替。
- **“项目未要求统一披露标签时，按它实际需要的方式说明工具怎样参与，不自行套用别的项目政策。”**：Qwen 已读规则没有 AI 披露要求；按页面保留未知，未替项目补成“允许”或“必须披露”。
