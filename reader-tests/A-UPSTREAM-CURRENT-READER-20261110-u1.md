# A-UPSTREAM-CURRENT-READER-20261110-u1 读者记录

读取日期：2026-11-10。只读定位；未创建 issue/PR/fork，未运行测试或模型，未操作旧 Unix socket。

## 做到哪一步

1. 读了任务卡 `job.md` 里的固定页面全文，并先核了“全文实际附入”：两处副本都与 `docs/decisions/upstream-contributions.md@dc45976eeb083d498f90152035c0fa0a9ee1878c` 完全一致（3213 字符），没有缺失。之后按页面的起手清单开始核目标项目，而不是先写代码。
2. 从候选固定提交 `af119e2469c35a4fe465f6bd3a0467df689e8802` 只取了三份允许的文件：`experiments/qwen-discovery-diagnostic/fix.patch`、`server.mjs`、`reproduce.py`；没有打开同目录 README、旧 Qwen 卡/结果或其他读者判断。
3. 核了 QwenLM/qwen-code 当前 main（`f0b7df498219662a0c242eca588cd76929b1551c`）的 CONTRIBUTING、AGENTS、CLAUDE、PR/issue 模板，issue #15741 的状态/评论/timeline，PR #15757 的正文/文件/合并状态，以及当前 `packages/core/src/tools/mcp-client.ts` 和 `mcp-client.test.ts`。
4. 核了候选基线与 main 的文件一致性、补丁可应用性、release 祖先关系，并搜索了是否已有覆盖剩余差量的 open issue/PR。
5. 按页面表格选路：重名恢复部分已被 #15757 覆盖，应“收起重复部分”；剩余的非重名 conversion 诊断差异应“协调剩余差量”。结论是现在不能直接投稿，下一步是协调 + 准入（先取得可关联 issue/维护者意见），再补完整 preflight。
6. 产物：
   - `docs/collaboration/local-jobs/artifacts/A-UPSTREAM-CURRENT-READER-20261110/result.md`
   - 本记录 `reader-tests/A-UPSTREAM-CURRENT-READER-20261110-u1.md`

## 关键判断（行为而非文件名）

- #15741 报告的是重名工具导致整个 server 被丢弃；#15757 已把冲突组全部跳过、保留唯一名，并让 `hadVisibilityFilteredTools` 为 true，因此不再误报“no tools”。issue 已 closed/completed，merge commit 是 v0.26.7 的祖先。
- 当前 main 仍对“非重名 conversion/list 失败”抛通用 `No prompts, tools, or resources found on the server.`（`mcp-client.ts:827`、`:1583`；外层 catch `:1888` 返回空结果）。PR #15757 正文明确说这类失败仍退化，属 out of scope。候选补丁正好只补这一段，不重复重名恢复。
- 候选补丁对当前 main 的两份目标文件 `git apply --check --unidiff-zero` 通过；文件 blob 与候选基线 `41ffb223` 的索引哈希一致（`b68712e`、`1e483b6`），说明没有基线漂移。

## 卡点（页面哪一句 / 缺什么 / 做错过什么）

1. **页面：“先读当前 CONTRIBUTING、AGENTS、AI 政策和 issue／PR 模板；文件不存在就沿 README 找等价入口。”**
   - 缺什么：Qwen 仓库没有独立 AI 政策/披露要求章节，也没有 CLA/DCO 文件。页面没有给“AI 政策缺失时如何判定披露要求”的模板。
   - 做错过什么：一开始把“没有 AI 政策”当成“没有额外要求”；后来按页面“规则沉默或访问失败就保留未知”改成 unknown，不把它补成允许，也不自创披露标签。
2. **页面：“查 issue 最新讨论、关联 PR 与当前目标分支，按行为而非文件名判断问题是否已解决。”**
   - 缺什么：#15741 已 closed/completed，#15757 已修重名恢复；剩余非重名 conversion 诊断没有任何 open issue/PR 覆盖。页面没说明“关闭 issue 上的剩余差量”应评论已关闭 issue、重开，还是新开 issue，也没说 closed issue 能否作为新 PR 的关联 issue。
   - 做错过什么：第一反应是“issue 已关闭 = 候选应整体收起”；读 #15757 的 out-of-scope 声明和当前 main 的通用报错后，改成“收起重名部分，只协调剩余诊断差量”。
3. **页面：“已有测试若版本与行为未变可复用；受变动影响的路径要补跑，不能把旧通过记录移作新版证据。”**
   - 缺什么：候选只报定向 11 通过、同文件 174 个测试未选；完整 preflight 未过。页面没给“同文件未选测试是否算补跑”的判据。
   - 做错过什么：没有把“定向 11 通过”当成受影响路径已补跑；按缺验证记，未自行运行测试（任务也禁止）。
4. **页面：“若可以实现，列出最小复现、改动范围、项目现有检查命令；不要创建 issue／PR 或签协议。”**
   - 缺什么：页面没说明 preflight 因环境（旧 Unix socket）失败时，是按“缺验证”还是按“不可投稿”处理。
   - 做错过什么：没有重试旧 Unix socket，也没有为了补 preflight 去运行测试；按“完整 preflight 未过 = 未完成”处理，保留了 unknown/未验证状态。
5. **页面：“不要创建 issue／PR 或签协议”与 CONTRIBUTING“缺 issue 先开 issue 并等反馈”。**
   - 缺什么：两条同时成立时，页面没写“谁在何时开 issue”的交接点。
   - 做错过什么：没有替贡献者开 issue；在结果里把开 issue/评论列为本人下一步，而不是假装准入已完成。
6. **页面表格：“已有同题修复或提案 → 对比行为覆盖，收起重复部分或协调剩余差量。”**
   - 缺什么：页面只说“协调”，没有给“关闭 issue + 已合并 PR + 剩余差量”的具体协调入口。
   - 做错过什么：没有把 #15757 当成已覆盖全部行为；用当前源码和 PR 的 out-of-scope 说明区分了“已修的重名恢复”和“未修的非重名诊断”。

## 页面之外还翻了什么

- QwenLM/qwen-code 当前 main 的 `packages/core/src/tools/mcp-client.ts`、`mcp-client.test.ts`、`package.json`（`preflight`/`test` 脚本）、`tsconfig.json`；用 tarball 在本地只读 grep 了 `discoverTools` 的调用方，确认运行时路径只有 `discoverAndReturn`/`connectAndDiscover` 两个调用点（导出 wrapper 主要被测试使用）。
- `CONTRIBUTING.md`、`AGENTS.md`、`CLAUDE.md`、`.github/pull_request_template.md`、`.github/ISSUE_TEMPLATE/`，以及仓库 tree 中与 contribution/AI policy/DCO/CLA 相关的路径扫描。
- issue #15741 的 JSON、评论和 timeline；PR #15757 的元数据、正文、改动文件；release v0.26.7 的发布时间和 `8a2817a` 的祖先关系；GitHub issue 搜索（`"No prompts, tools, or resources found"`、`discoveryError`、`"conversion failures"` 等）确认没有 open 的剩余差量条目。
- 没有看：候选同目录 README、旧 Qwen 卡/结果、其他读者判断、a1dbv 的其他文档或同主题教程。

## 验证边界

- 未运行任何测试、构建、模型或 CLI；未重试旧 Unix socket。
- “定向 11 通过 / 174 未选 / 完整 preflight 未过 / 三路最终诊断通过”来自任务卡给出的候选状态，未在本机复跑。
- 补丁可应用性只做了 `git apply --check --unidiff-zero` 的静态检查，不等于测试通过或可合并。

## 核对

**核对日期：** 2026-11-10。只读核对；未创建 issue/PR/fork，未运行测试或模型，未操作旧 Unix socket。

**结论：读者按任务验收完成。** 固定来源、行为差量、一个可执行下一步、仍缺内容和页面卡点都已给出；核心事实可复核，“协调剩余差量 + 准入、暂不直接投稿”的选路成立。

核对证据：

- 页面全文：`job.md` 第一处代码块与 `docs/decisions/upstream-contributions.md@dc45976` 逐字节一致（含尾换行，3214 字符）；第二处只多一个前导换行，内容一致，没有缺失。
- 上游事实：issue #15741 为 `closed` / `state_reason=completed`（2026-10-31T18:13:01Z 关闭）；PR #15757 已合并，merge commit `8a2817a`；`8a2817a...v0.26.7` 的 compare 为 `ahead`，merge base 就是 `8a2817a`；v0.26.7 发布于 2026-11-04T04:03:01Z。PR 正文确有“other conversion failures still collapse into the generic 'no tools' message”的 out-of-scope 声明。
- 目标分支：读取时 main=`f0b7df49`（2026-11-10T11:06:04Z）；`41ffb223...f0b7df49` 为 4 个提交、0 behind；两份目标文件的 blob 分别为 `b68712e593f5...`、`1e483b669a18...`，与 `fix.patch` 的 index 行一致。
- 代码行为：main 的 `packages/core/src/tools/mcp-client.ts:827`、`:1583` 仍抛 `No prompts, tools, or resources found on the server.`；`:1888` 的外层 catch 仍返回 `{ tools: [], hadVisibilityFilteredTools: false }` 且无 `discoveryError`；`:1877-1878` 的冲突组使 `hadVisibilityFilteredTools=true`；测试 `reports an all-collision server as discovered instead of empty` 在 `:1668`。
- 补丁与复现：从只读参考副本 `dbvv1__a1dbv@af119e24` 取出 `fix.patch`/`server.mjs`/`reproduce.py`；patch 为 150 行、`--unified=0`；对上述两份 main 文件副本 `git apply --check --unidiff-zero` 通过，普通 `git apply` 在 `:807` 因零上下文失败；`server.mjs` 为 failure/empty/healthy 三态，`reproduce.py` 为 POSIX-only，断言退出码和最终诊断行。
- 规则：Qwen `CONTRIBUTING.md` §1 要求 PR 关联已有 issue、§4 要求 `npm run preflight`、§5 要求用户可见变更更新 `/docs`、§6 要求 before/after demo；PR 模板含 Tested on 表；`AGENTS.md` 对 `packages/*/src/tools/**` 是两层 gate；`CLAUDE.md` 指向 AGENTS；未发现 AI 政策、CLA/DCO 或 Ready 标签流程。open issue/PR 中没有覆盖剩余非重名 conversion 诊断的条目。

**逐条卡点判断：**

| # | 读者卡点 | 判断 | 说明 |
|---|---|---|---|
| 1 | AI 政策/披露要求缺失 | model | 页面起手句已写“规则沉默或访问失败就保留未知，不把它补成允许”，原则节也要求披露工具做了什么；按 unknown 处理本身正确，把它记成页面缺模板不准确，且下一步未把 AI 披露未知带入要问维护者的事项。 |
| 2 | closed issue 上的剩余差量该评论/重开/新开 | page | 页面只说“协调剩余差量”，没有定义 closed issue + merged PR 的具体平台操作，也没说 closed issue 能否作关联 issue；这是真实页面缺口，读者的处理正确。 |
| 3 | 同文件 174 个未选测试是否算补跑 | page | 页面没有区分“定向子集”与“同文件全量”的粒度；不过目标 CONTRIBUTING §4 明确要求 preflight 全通过，读者按“完整 preflight 未过 = 未完成”处理正确。 |
| 4 | preflight 因环境（旧 Unix socket）失败的判据 | page | 页面没有区分“检查因环境失败”与“检查未通过”；读者保留 unknown/未验证并计划在干净环境重跑，保守正确。 |
| 5 | 谁在何时开 issue | page | 页面“不要创建 issue／PR”与 CONTRIBUTING“缺 issue 先开并等反馈”之间没有写交接；读者把开 issue 交给贡献者本人，方向正确。 |
| 6 | “关闭 issue + 已合并 PR + 剩余差量”的协调入口 | page | 与 #2 同源；页面缺少可直接执行的平台操作定义。 |
| 7 | `git apply --check` 误报不兼容 | model | 读者先用普通 `git apply --check` 误判，自行改用 `--unidiff-zero` 并核对 blob 纠正；最终结论正确。 |

**读者没意识到的错误：**

- `getMCPServerLastError` 的说法偏宽：只有 `McpClient.discoverAndReturn` 的 catch（`mcp-client.ts:845`）调用 `recordMCPServerLastError`；导出的 `connectAndDiscover` 的 catch 只写 debug 日志并置 `DISCONNECTED`，不记录 last error。因此“用户看到原始诊断，`getMCPServerLastError` 也记录原始消息”只对前者成立；候选的 standalone 测试也只断言状态和 debug 日志。
- 漏了 CONTRIBUTING §5/§6：候选改变用户可见的报错文本（行为变更），按 §5 需要检查并更新 `/docs`，按 §6 需要 before/after 的截图或录像 demo；`result.md` 的下一步和“仍缺内容”只列了 preflight、测试、Windows，没有这两项。
- 下一步把“在 #15741 发评论”列为首选、把新开 issue 写成“按维护者要求”的备选，容易让人继续在已关闭 issue 上等待；CONTRIBUTING 的要求是缺 issue 时先开新 issue 并等反馈，新 issue 应是主路径，评论只作征询。
- 页面副本“完全一致（3213 字符）”不精确：第一处与页面文件逐字节一致（含尾换行，3214 字符），第二处多一个前导换行；内容一致但不是逐字节一致。
- “Windows 未验证”被列为仍缺内容，但 PR 模板允许 Tested on 标“⚠️ not tested”，它不是硬性阻断；真正的阻断是完整 preflight/全量测试未过和没有可关联的 open issue。

**核对边界：** 未运行测试、构建或模型；候选的“定向 11 通过 / 174 未选 / 三路诊断通过”仍来自任务卡。读取后 main 已从 `f0b7df49` 前进到 `274c1dab`（2026-11-10T11:27Z，Web Shell 邮件频道提交），但两份目标文件 blob 未变，补丁可应用性不受影响；`result.md` 的“当前 main”应视为读取时快照。
