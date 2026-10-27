# 新读者记录 · A-CI-PROJECTION-READER-20261027 · u1

角色：第一次读该页的读者。只按任务给出的页面全文与仓内被引用代码操作，未读 a1dbv 的其他文档，未搜同主题教程。

## 做到哪一步

全流程做完：

1. 读取 PR 当前 head。
2. 用同一 40 位 SHA 读取 statuses、check-runs（`filter=latest`）、actions runs 三个响应，均 `page=1&per_page=100`。
3. 组装 `ci-input.json`，从 `experiments/ci-result-projection/` 运行页面片段，得到投影。
4. 运行页面给出的回归命令，`46 tests passed`。
5. 结果写入产物。

结果：head `00d217067504e2b912bfd418199eef69d23a3c6a`；statuses 1 条（CodeRabbit success，说明为 `Review skipped: draft pull request`），checks 0 条，actions 1 条（Frontend Tests，completed / `action_required`）；三源分页缺口均为 0。

产物位置：`docs/collaboration/local-jobs/artifacts/A-CI-PROJECTION-READER-20261027/result.md`。工作目录内未提交、未推送、未切换分支。

## 卡点

### 1. “沿用已授权 GitHub 入口”（§输入与使用）

- 页面原句：”沿用已授权 GitHub 入口，给同一完整 SHA 取以下三个响应“。
- 缺什么：页面没有说明这个入口是什么——`gh` CLI、token、本地代理还是连接器封装，均未写。
- 实际处理：先查 `gh`（未安装）与 GitHub 相关环境变量（无 token），再用匿名公开 GitHub REST，仅 GET，未登录、未取新凭据，三次请求均 200。
- 做错过的：一开始把 curl 输出写到 `/tmp`，Node 在 Windows 下解析不到该路径（`MODULE_NOT_FOUND`），改为工作目录下的临时目录后才成功。这是环境差异下的自误，不是页面缺信息。

### 2. “先读 PR 当前 head”（§目标与真实任务）

- 页面原句：”先读 PR 当前 head，再读该 SHA 的三类公开 API“。
- 缺什么：页面没有给 PR 元数据端点，也没有在操作步骤里重复 PR 编号；编号只出现在后文”Memos #6502“。
- 实际处理：据此使用官方 `GET /repos/usememos/memos/pulls/6502` 取 `head.sha`，核验前后各取一次确认 head 未变。
- 做错过的：无。

### 3. “以下片段从 experiments/ci-result-projection/ 目录运行”（§输入与使用）

- 页面原句：”以下片段从 `experiments/ci-result-projection/` 目录运行，`ci-input.json` 放在同目录“。
- 缺什么：页面没说投影输出要不要落盘、临时输入用后如何处置。
- 实际处理：按原片段输出到 stdout，额外把结果写到工作目录临时文件用于记录；用后删除 `ci-input.json` 和临时目录，保证唯一成果是 `result.md`。
- 做错过的：第一次写投影文件时相对路径少算一层（`../../../` 指到了工作区上层），报 `ENOENT`；改成 `../../` 后成功。属自误。

### 4. 零记录与状态说明的读法（§输入与使用）

- 页面原句：”三来源均零应报告“当前未观测到记录”“、”状态成功与审核执行是两件事“。
- 卡点：本次不是三源全零，statuses/actions 各有 1 条；需要按源分别报告，并且不能把 CodeRabbit 的 `success` 当成已审核。页面给了判据，但没有给“非全零但审核被跳过”的现成措辞，按自己的理解写成“状态成功，审核因 draft 跳过，没有实际评审”。
- 做错过的：无。

## 页面之外还翻了什么

- 官方 GitHub REST 的 PR 元数据端点 `GET /repos/usememos/memos/pulls/6502`：页面未列，但取当前 head 必需。
- 仓内 `experiments/ci-result-projection/ci-projection.cjs`：页面直接引用，用来确认字段含义与报错边界。
- 仓内 `experiments/ci-result-projection/ci-projection.test.cjs`：页面给出运行命令，实际执行。
- 环境检查：`node --version`、`which gh`、GitHub 相关环境变量——用于确认“已授权入口”是否已配置。
- 未看：a1dbv 其他文档、同主题其他教程、页面链接的官方 API 文档页（本次不需要）、任何私人会话或账号用量。

## 核对

核对角色：未参与本次照做的独立复核。核对日期：2026-10-27。

**结论：按任务验收通过。** 读者按页面顺序完成，产物结果与当前 API 一致。

实际验收：

- `node experiments/ci-result-projection/ci-projection.test.cjs` → `46 tests passed`。
- 匿名公开只读 REST 重取 `GET /repos/usememos/memos/pulls/6502`：200，25,371 字节；head `00d217067504e2b912bfd418199eef69d23a3c6a`，`draft=true`、`state=open`、head 分支 `reading-mode-prototype`，与产物一致。
- 同一 SHA 重取三源（均 `page=1&per_page=100`）：statuses 200/5,411 字节、checks 200/47 字节、actions 200/14,304 字节；`total_count` 为 1/0/1。statuses 顶层 `sha` 与请求相同；CodeRabbit `state=success`、`description="Review skipped: draft pull request"`、`target_url=null`；Frontend Tests `status=completed`、`conclusion=action_required`、`head_sha` 同 SHA。
- 用重取正文组装 `ci-input.json`（17,018 字符）运行页面片段：投影 1,930 字符，与 `result.md` 内嵌 JSON 全等。
- 工作树 HEAD 仍为 `5113e0ea`，分支未切换，无提交/推送；产物目录只有 `result.md`（7,506 字节）；产物无本机绝对路径或内网地址。

卡点判断：

- 卡点 1（“已授权 GitHub 入口”未定义）：page。页面未写入口形式或未配置时的回退；本环境无 `gh`、无 GitHub token/代理变量，匿名只读 REST 是可行回退，若页面本意是特定连接器则结果可能不同。其中的 `/tmp` 失败是环境/路径处理自误（model，已恢复），不是页面缺信息。
- 卡点 2（PR 元数据端点未列）：page（轻）。操作节没给端点和编号，但任务抬头与页面后文都有 Memos #6502，官方端点可推出；补一行更稳。读者“编号只出现在后文”的说法与任务文件第 11 行不符，属表述误差，不影响做法。
- 卡点 3（投影是否落盘、`ci-input.json` 处置未写）：page（轻，非阻塞）。片段本身只 `console.log` 到 stdout，清理属“唯一成果”的任务约束；建议页面补一句临时文件处置。其中的 `../../../` 路径错误是 model 自误（已恢复）。
- 卡点 4（非全零但审核被跳过的现成措辞）：page（很轻，非阻塞）。页面已给判据，读者写法正确；可在页面补一句示例。

读者没意识到的：

- “核验前后各取一次 PR 元数据”的第二次请求没有命令或输出留痕，产物无法自证；本次重取 head 一致，不改变结论。
- 原始响应与 `ci-input.json` 用后删除，核对“原响应”只能重取；产物记录了 HTTP 码与字节数，但仍不能从产物复原当时正文。
- “PR 编号只出现在后文”与任务文件开头的 Memos #6502 不符。
