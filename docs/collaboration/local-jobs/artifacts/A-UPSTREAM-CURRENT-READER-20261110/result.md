# A-UPSTREAM-CURRENT-READER-20261110 结果

读取日期：2026-11-10。只读公开材料；未创建 issue/PR/fork，未签约，未运行测试或模型，未操作旧 Unix socket。

## 结论

**现在不能直接投稿。选择“协调剩余差量 + 准入”，不是“实现后直投”，也不是把整个候选收起。**

QwenLM/qwen-code#15741 的重名工具主问题已由 #15757 修复：合并提交 `8a2817ac8acbf9444c8a99549445c482caf1796e`（2026-10-31），并已包含在 v0.26.7（发布于 2026-11-04，比较接口显示该提交是 v0.26.7 的祖先）。#15757 的 PR 说明明确把“其他 conversion failure 仍退化为统一的 no tools 报错”列为 out of scope。候选补丁只补这个剩余差量；在拿到维护者对剩余差量的意见和一个可关联的 issue 之前，不应提 PR。

## 固定来源

- 页面全文：`job.md` 中两处副本均与 `docs/decisions/upstream-contributions.md@dc45976eeb083d498f90152035c0fa0a9ee1878c` 完全一致（3213 字符），没有缺失。
- 当前目标分支：QwenLM/qwen-code main = `f0b7df498219662a0c242eca588cd76929b1551c`（2026-11-10 读取）。
- 候选基线：QwenLM/qwen-code `41ffb223448847b4c8ea2a1e9b463650095b2890`（比 main 少 4 个提交）；该提交上的 `packages/core/src/tools/mcp-client.ts` 与 `mcp-client.test.ts` 和 main 逐字节相同。
- issue：<https://github.com/QwenLM/qwen-code/issues/15741>，标题 “MCP: duplicate tool names discard the entire server and emit a misleading 'no tools' error”，state=closed，state_reason=completed，2026-10-31 关闭。
- 关联 PR：<https://github.com/QwenLM/qwen-code/pull/15757>，“fix(core): keep uniquely named MCP tools when names collide”，merged 2026-10-31。
- 规则：`CONTRIBUTING.md`、`AGENTS.md`、`.github/pull_request_template.md`、`.github/ISSUE_TEMPLATE/`、`CLAUDE.md`（均读 main）。未发现单独的 AI 政策、CLA/DCO 文件或 “Ready” 标签流程。
- 候选材料：dbvv1/a1dbv@`af119e2469c35a4fe465f6bd3a0467df689e8802` 的 `experiments/qwen-discovery-diagnostic/{fix.patch,server.mjs,reproduce.py}`。
- 复现脚本：`server.mjs` 是 MCP 三态 fixture（failure/empty/healthy）；`reproduce.py` 用构建后的 `packages/cli/dist/index.js` 跑 `mcp reconnect --all`，按三态断言退出码和最终诊断行，POSIX-only。

## 目标项目准入（Qwen main）

- 接 bug fix PR，但所有 PR 必须关联已有 issue；缺 issue 时先开 issue 并等反馈再写代码（CONTRIBUTING §1）。
- 所有提交需要 review；PR 要小而单一；提交前要跑 `npm run preflight`；按模板给 reviewer test plan、before/after 和 macOS/Windows/Linux 的 Tested on（CONTRIBUTING §2/§4/§6/§7）。
- 未发现 CLA/DCO、AI 披露政策或 “Ready” 标签流程；AI 使用要求保持 unknown。
- 外部 PR 触碰 `packages/core/src/tools/**` 受 AGENTS 两层 gate：小范围也要 100% 置信，存疑升级维护者。

## 行为差量

当前 main（`f0b7df49`，`packages/core/src/tools/mcp-client.ts`）：

- 重名工具：`listTools` 分页后统计每个名字，冲突组全部丢弃，唯一名保留；`collidedToolNames` 使 `hadVisibilityFilteredTools=true`，所以服务器不会因“空发现”被判失败（`:1877-1878`；测试 `reports an all-collision server as discovered instead of empty` 已覆盖）。这部分是 #15757 已修，候选没有新增行为。
- 非重名 conversion/list 失败：外层 catch 仍返回 `{ tools: [], hadVisibilityFilteredTools: false }`（`:1888`），两个调用点分别抛通用 `No prompts, tools, or resources found on the server.`（`:827`、`:1583`）。这是候选要补的剩余差量。
- 方法不存在（-32601）：仍视为空服务器，保持原行为。

候选 `fix.patch`：

- 给 `ToolDiscoveryResult` 增加 `discoveryError?: Error`；外层 catch 对非 method-not-found 的错误保留原始 Error（字符串/未知值包成 Error），method-not-found 仍为 undefined。
- `discoverAndReturn()` 和 `connectAndDiscover()` 在“prompts/resources/tools 都为空且未被 visibility 过滤”时优先抛 `discoveryError`，否则仍抛通用消息。
- 因此：非重名 conversion/list 失败时，用户看到原始诊断，`getMCPServerLastError` 也记录原始消息；空服务器、方法不存在、纯 prompt 服务器保持原行为。
- 限制：若 prompts 或 resources 可用，tools 的 conversion 失败仍只进 debug 日志，不向用户显示；#15757 也提到需要新的用户可见警告通道。
- 补丁是 `--unified=0` 零上下文 diff；对当前 main 的两份文件 `git apply --check --unidiff-zero` 通过，索引 blob 与 `41ffb223` 完全一致（`mcp-client.ts` `b68712e`、`mcp-client.test.ts` `1e483b6`）。普通 `git apply` 会因零上下文拒绝，需要 `--unidiff-zero`。

## 一个可执行下一步

由贡献者本人（不是 Agent）在 #15741 发一条范围收窄的跟进评论，或按维护者要求在确认后新开一个 bug issue：

1. 引用 #15757 已修复重名恢复及其“其他 conversion failure 仍退化”的 out-of-scope 声明，明确候选只改剩余诊断，不重复重名恢复。
2. 贴出上面的行为差量、当前 main 的 `git apply --check --unidiff-zero` 结果、三态复现的输入/预期/实际（failure 显示原始 fixture 错误；empty 仍显示通用 no tools；healthy 成功重连）。
3. 问维护者是否接受这个 follow-up、应关联哪个 issue（#15741 已 closed/completed，不能直接当新 PR 的 “Fixes”）。
4. 得到肯定答复后，本人在干净环境跑 `npm run preflight` 和完整的 `packages/core/src/tools/mcp-client.test.ts`（当前只报定向 11 通过、174 未选），再按 CONTRIBUTING 提 PR；不要把已有复现或定向通过当作准入。

## 仍缺内容

- 完整 preflight 未过；同文件 174 个测试未选；Windows 未验证（PR 模板要求 macOS/Windows/Linux 的 Tested on）。
- 没有可关联的 open issue：#15741 已 closed/completed；CONTRIBUTING 要求 PR 关联已有 issue，缺 issue 时先开 issue 并等反馈。
- AI 使用/披露政策：CONTRIBUTING、AGENTS、CLAUDE.md、PR/issue 模板均未找到；规则沉默，保持 unknown，不能当成允许，也不能自创标签。
- 无 CLA/DCO 要求；但外部 PR 触碰 `packages/core/src/tools/**` 受 AGENTS 两层 gate，要求 100% 置信，存疑升级维护者。
- 部分成功场景（prompts 可用、tools 失败）仍不向用户暴露 tools 诊断；需要新的用户可见警告通道。
- 候选复现脚本是 POSIX-only 且依赖构建后的 CLI；已有三态结果不能替代投稿准入。
- 旧 Unix socket 已明确拒绝，未重试。

## 页面造成的卡点

- 页面“先读当前 CONTRIBUTING、AGENTS、AI 政策和 issue／PR 模板；文件不存在就沿 README 找等价入口”：Qwen 仓库没有 AI 政策文件或章节，页面没给“AI 政策缺失时如何判定披露要求”的模板；只能按“规则沉默保留未知”处理，无法确认维护者是否要求披露 AI 参与。
- 页面“查 issue 最新讨论、关联 PR 与当前目标分支，按行为而非文件名判断问题是否已解决”和表格“已有同题修复或提案 → 对比行为覆盖，收起重复部分或协调剩余差量”：issue 已 closed/completed，#15757 只覆盖重名恢复；页面没说明关闭 issue 上的剩余差量应走“评论已关闭 issue”“重开”还是“新开 issue”，也没说 closed issue 能否作为新 PR 的关联 issue。
- 页面“已有测试若版本与行为未变可复用；受变动影响的路径要补跑”：候选只跑定向 11、留 174 未选；页面没给“同文件未选测试是否算补跑”的判据。
- 页面“若可以实现，列出最小复现、改动范围、项目现有检查命令”：页面没说明 preflight 因环境（旧 Unix socket）失败时，是按“缺验证”还是按“不可投稿”处理；本记录按未完成处理。
- 页面“不要创建 issue／PR 或签协议”与 CONTRIBUTING“缺 issue 先开 issue 等反馈”同时成立时，读者只能把开 issue 交给本人；页面没写这个交接点由谁、何时做。
