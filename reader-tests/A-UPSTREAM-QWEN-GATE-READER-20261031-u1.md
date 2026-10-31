# 读者测试记录：A-UPSTREAM-QWEN-GATE-READER-20261031 u1

- 日期：2026-10-31
- 身份：第一次读 `docs/decisions/upstream-contributions.md` 的读者，未参与本题旧判断
- 工作目录：本仓库工作树
- 结论产物：`docs/collaboration/local-jobs/artifacts/A-UPSTREAM-QWEN-GATE-READER-20261031/result.md`

## 入口核对

- 附入页面全文与 `docs/decisions/upstream-contributions.md@8da233c89e9bd92d4f3bb4f0d6b5fa11ebba5275` 逐字 diff 为空（59 行），页面入口不卡。
- 当前 HEAD 就是 `8da233c89e9bd92d4f3bb4f0d6b5fa11ebba5275`。
- 只读了任务指定的输入：`experiments/candidate-reset-recovery/qwen/change.patch`、`manifest.json` 的 qwen 条目、`qwen/repro/*` 和 `SHA256SUMS` 中对应行；没有读 `experiments/candidate-reset-recovery/README.md` 的补验分析、旧判断、研究、inbox 或旧读者答案。

## 做到哪一步

按页面完成了一次投稿前核查，并选出了下一步：

1. 核对 Qwen 当前贡献规则、PR／issue 模板和 AGENTS（main `3df7f9ce`，阅读日期 2026-10-31）。
2. 核对 issue #15741 的最新状态、关联 PR、讨论和准入状态。
3. 对照当前 main 源码，确认旧补丁未被已合并实现覆盖，且补丁可按原样应用到当前 main 的三个文件。
4. 确认重名触发场景已被开放 PR #15757 以更强行为占用；#15757 明确把“其他转换失败仍折叠成空服务器”列为范围外，因此候选收窄后仍有独立诊断缺口。
5. 把下一步定为“按项目入口讨论”：由本人在 #15741 发范围确认评论，先不投当前补丁；并行准备只保留错误透传的缩窄版本。未创建 issue／PR／评论，未签协议，未运行候选或测试。

产物只有一个判断文件：`docs/collaboration/local-jobs/artifacts/A-UPSTREAM-QWEN-GATE-READER-20261031/result.md`。本记录是第二份新增文件。页面、补丁、manifest、TASKS 均未改。

## 卡点

### 1. 开放 PR 与“已合并”之间的空档

- 页面位置：`有旧补丁时：先核上游，再决定续做` 段，“**查关闭原因和关联实现，不只看 issue 颜色。** 已合并的实现覆盖了同一行为，就收起重复实现；仍有独立失败路径时，说明剩余差量，按项目要求讨论。”
- 缺什么：页面只给了“已合并→收起”和“有独立缺口→讨论”两条路，没有给“上游有一个未合并、但已经覆盖部分行为的开放 PR”这种情况。这里 #15757 就是这种状态：它覆盖重名恢复，未合并，且正文明确把其他转换失败排除在外。
- 做错过什么：我先按“未合并＝未覆盖”把候选整体当成仍可投；读到 #15757 的 “Not validated / out of scope” 原句后，才改成“重名部分让给 #15757，只讨论非重名错误透传的差量”。如果直接投稿，会形成与开放 PR 竞争的重名实现。

### 2. “项目愿意接”没有可判定的最低信号

- 页面位置：`第一步：让 Agent 查清现在该做哪一步` 和 `准入、AI 使用和投稿主体分开核` 段，“先确认项目愿意接这项贡献，再做实现和投稿”“查看 issue 的最新状态、关联 PR、讨论与项目要求的准入状态”。
- 缺什么：Qwen 的 #15741 只有 bot 的 triage 标签（`priority/P2`、`type/bug`、`category/tools`、`scope/mcp`）和一条社区建议，没有维护者表示接受外部实现；AGENTS 又规定 `packages/core/src/tools/**` 属核心路径、外部 PR 要过两级门禁。页面没有说明“issue 被 triage 成 bug”是否等于“项目愿意接这个实现”。我只能判为“缺陷已受理、实现准入未知”。
- 做错过什么：一开始容易把 bot 的 label 当作准入信号；按页面“不只看 issue 颜色”的要求，没有这样写。

### 3. 必跑检查被环境阻断时怎么记

- 页面位置：`条件满足后：交可审结果，继续负责回应` 段，“**沿项目现成模板提交一个明确变化，写问题、关键取舍、实际验证和剩余风险。**”以及 `**先处理实际退回原因。** … 都不靠多跑一次测试解除。”
- 缺什么：Qwen `CONTRIBUTING.md` §4 要求 `npm run preflight` 全通过；已有验证只到 build／typecheck、409 项相关测试和 bundle，完整测试被 Unix socket EPERM 阻断且未重跑。页面没写“项目必跑项被环境阻断”时是保留缺口、换环境，还是用 CI 代替。我保留了缺口，没有把部分检查写成通过。
- 做错过什么：没有把 409 项相关测试误当成 preflight（这是最容易写错的地方）；但也没法补出被阻断的全量结果，只能把它列为尚缺证据。

### 4. AI 使用与个人步骤的规则沉默

- 页面位置：`准入、AI 使用和投稿主体分开核` 段，“项目未要求统一披露标签时，按它实际需要的方式说明工具怎样参与，不自行套用别的项目政策”与“**项目要求本人写的材料，就由本人写。**”
- 缺什么：读过的 Qwen `CONTRIBUTING.md`、`AGENTS.md`、PR／issue 模板和工作流文件名里都没有 CLA、DCO、`Signed-off-by`、vouch 或 AI 使用披露规则；无法据此推出“允许”或“无需披露”。
- 做错过什么：没有把“没搜到”写成“项目允许 AI 自动代投”；结果里保留为未知，并把“是否在 PR 描述里说明工具参与”留给贡献者本人。

## 页面之外查阅了什么

- GitHub REST API（只读、未登录）：QwenLM/qwen-code 仓库元数据；issue #15741 的正文、评论、时间线；PR #15757 的详情、改动文件、评论、reviews、check-runs；按路径查询 `packages/core/src/tools/mcp-client.ts` 的提交；搜索提及 #15741 和“No prompts, tools, or resources found”的 issue／PR。
- `raw.githubusercontent.com` @ main `3df7f9ce`：`CONTRIBUTING.md`、`AGENTS.md`、`CLAUDE.md`、`docs/developers/contributing.md`、`.github/pull_request_template.md`、两个 issue 模板、`README.md`、`packages/core/src/tools/mcp-client.ts`、`packages/core/src/tools/mcp-client.test.ts`、`docs/users/features/mcp.md`。
- `raw.githubusercontent.com` @ 输入给出的固定基线 `3a4a077`：同样三份候选触及文件，用于核对 blob 是否与候选 base 相同。
- 本地只读核对：`git ls-remote` 取当前 main；`git hash-object` 对比文件 blob；在隔离目录对当前 main 的三个文件执行 `git apply --check`。没有运行候选、产品、模型或测试。
- 没有读 a1dbv 的其他文档、同主题教程、本题旧判断／研究／inbox／README 补验分析或旧读者答案；没有使用 ListAgents、凭据、会话、账号用量、用户配置或模型／worker 日志。

## 边界遵守

- 未改页面、补丁、manifest、TASKS、receiver、权限或沙箱。
- 未创建／重开 issue、PR、fork，未发评论，未签协议。
- 未安装全局软件、未使用凭据、未开付费服务、未访问模型网关。
- 产物只含公开材料，使用仓库相对路径和公开 URL，没有本机绝对路径或内网地址。

## 核对（验证者，2026-10-31）

**结论：读者按任务验收做成了投稿前判断，taskDone=true。** 以下是我独立复核的内容；页面卡点与模型失误分列。

### 入口与写入范围

- 任务附入的页面（job.md 第 24–82 行）与 `git show 8da233c8:docs/decisions/upstream-contributions.md` 逐字 diff 为空，59 行；工作树 HEAD 为 `8da233c8`，页面文件未改。
- 工作树只多出 `docs/collaboration/local-jobs/artifacts/A-UPSTREAM-QWEN-GATE-READER-20261031/result.md` 与本卡；`qwen/change.patch` 的 sha256 仍为 manifest 的 `4e41dc3a…`，manifest、页面、TASKS 未改。

### 独立复核到的上游事实

- main 仍为 `3df7f9ce8312d15fa1c3387218a412f21cf0387b`；三个候选文件的 blob 在 main、固定基线 `3a4a077`、候选 base `127c2ab` 三处都等于补丁 pre-image（`bbb3b1fd…`、`5a7e5f45…`、`457ad4df…`），所以“补丁可按原样应用”成立。
- `3a4a077` 确为 main 上的 `fix(web-shell): keep "+ Add session" clickable… (#15835)`（2026-10-30），与候选无关。
- #15741：open，4 个 bot triage 标签、3 条评论、无 assignee/milestone；期望行为与读者转述一致，除 bot 外只有社区成员 `Nakagawa-master`（association NONE）评论，无维护者准入表态。
- #15757：open、未合并，head `f0b2104c`、base `9acb3a5a`、2 个文件 +360/−15、3 commits；正文确有 “other conversion failures still collapse into the generic 'no tools' message” 的 out-of-scope 原句；`wenshao` 在 f0b2104c 评论 merge-ready（15/15），正式 reviews 仍只有更早 head 的 CHANGES_REQUESTED；作者 2026-10-30 的评论与“CI 全 cancelled、需重跑和复审”一致。
- 代码行号：`ToolDiscoveryResult` 在 1620、外层 catch 返回在 1774、两个空服务器 throw 在 799/1548，读者引用范围都落在实际代码上。
- 规则：CONTRIBUTING §1–7、AGENTS 的 core 两级门禁、PR 模板的中文完整翻译要求均与读者转述相符；未发现 CLA/DCO/Signed-off-by/vouch 或 AI 披露规则（按页面保留未知）。

### 验收命令与结果

- `python scripts/check_repo.py`：checked_files 588，errors 为空。
- `python scripts/check_public.py`：checked_files 1019，findings 为空。
- 两份新增文件为 UTF-8、无行尾空白；result.md 无本机绝对路径或内网地址。
- 未运行候选、产品、模型或测试；未创建 issue／PR／评论。

### 卡点判定

1. 开放 PR 与“已合并”之间的空档：cause=page。页面只写“已合并／独立缺口”，缺“未合并开放 PR 已覆盖部分行为”的第三种状态；读者先按“未合并＝未覆盖”保留整个候选，读到 #15757 正文后才收窄，属于页面缺前提，不是读者臆造。
2. “项目愿意接”的最低信号：cause=page。页面要求查“准入状态”，但没定义维护者明示、已批准 issue、已分配等算不算，也没写 bot triage／label 不等于准入；读者判为“缺陷已受理、实现准入未知”是正确处置。
3. 必跑检查被环境阻断：cause=page。页面要求写“实际验证和剩余风险”、哪里没验，但没写项目必跑的全量检查被 Unix socket EPERM 阻断时是保留缺口、换环境还是等 CI；读者保留为未通过、不用 409 项部分测试代替，处置正确。
4. 规则沉默（CLA／AI 披露）：cause=model。页面已明确“规则沉默或访问失败保留未知，不补成允许”，也写了未要求统一标签时按项目实际需要说明工具参与；读者的结论正是页面要求，把这条记成页面缺口是误读，页面不缺信息。

### 读者没意识到的错误

- `result.md` 写“当前 check-runs 统计为 14 cancelled、83 skipped、3 success”，但这是 check-runs 接口第一页 100 条；该 head 共 193 条，完整统计为 15 cancelled、157 skipped、21 success。定性结论（CI 多为 cancelled，需重跑）不变，但数字应按全量或注明取样范围。

### 验收结论

- 任务按“投稿前判断”验收为完成：读者给出了具体下一步（本人到 #15741 发范围确认评论、并行缩窄补丁、按维护者答复选路），并保留了 preflight、#15757 合并形状、before／after、AI 披露等缺口。
- 这不构成完整投稿闭环，也不等于最新代码全量验证或四广扫完成。
