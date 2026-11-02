# gstack：审查汇总要回到原回复逐条核对

**🧪 值得借用的是接回审查后的逐条一致性核验，不是把 `verify clean` 当作审查可信或覆盖完整的证明。** gstack #3717 在本次原生 CLI 对照中挡住了 merged finding 的严重度／正文改写、缺失原回复和 judge 换用另一份汇总文件；整组事件与对应 finding 一起删除仍可能 clean。先保留独立原回复和任务接收记录，再读汇总与缺失覆盖，不能只存最后一个绿色摘要。

## 真实输入与固定范围

gstack 是约 13.9 万 Star 的 AI 开发 Skill／工具项目，MIT。开放 PR #3717 修复的是实际 `/ship` 审查接收链：原回复未变，但 `merged.jsonl` 的 CRITICAL 被改成 INFORMATIONAL 后，旧 verify 仍可通过。候选从原回复重新解析 finding，再核标签、正文、数量、回复声明的树及 judgment 文件绑定。#3719 明确保留“删除整条 output event 及其 merged 行”的缺口。

本次接收既有候选，不重复写补丁。固定 main `7762c39a`、实际 merge-base `0c84f4ee` 与 PR head `5d2ba4f6`；main 的 dispatch CLI、brief、ledger 和三个定向测试文件与 base 相同。只在独立 Linux 云目录运行现有 Bun 1.4.4，不安装整套 Skill。没有模型、浏览器、真实账户或私人审查内容。

## 非作者走完生产文件链

独立消费者创建自己的合成 Git 仓库和审查回复，直接调用项目原生五步，而不是调用内部函数或复用作者测试替身：

```text
render 固定树的 brief → sent 核提交给命令的 prompt 文件
→ collect 原回复 → judge 接回 finding → verify 回读
```

所有输入／输出、命令、退出状态与 UTC 时间保留；两版本使用同一合成任务。正常 CRITICAL finding、`NO FINDINGS`、具备原因的提级，以及 wrong-tree／拒绝后重新 sent 并写入新回复路径，均走到最终 verify。

| 实际消费者输入 | 原 base | #3717 候选 |
|---|---|---|
| 原始 finding 或明确无 finding | clean | clean |
| 只改 merged 的严重度，原回复保留 | clean，漏掉改写 | dirty：`merged_line_differs` |
| 只改 merged 的正文，原回复保留 | clean，漏掉改写 | dirty：`merged_line_differs` |
| 原回复文件缺失 | clean | dirty：`output_file_missing` |
| judge 改读另一份内容相同的 merged 副本 | clean | dirty：`judge_merged_not_collected` |
| 带理由提级／非法降级 | 提级通过／降级拒绝 | 相同行为 |
| wrong-tree 或拒绝后，用新路径交回正确回复 | 原失败记录 VOIDED，正确回复被接收 | 相同行为 |
| 删除早先整条 output 事件及其 finding，保留后来的 clean 回复 | clean | **仍 clean，#3719 未修** |

最后一项有明确条件：同一 reader 先交回 CRITICAL，重新 sent 后交回 `NO FINDINGS`；删除前一条 output event 和相应 merged 行，再生成 judgment，原回复文件仍保留。不是“任意删除都能过”，而是剩余记录仍能自洽。保留第一条 output 事件、只删其 merged 行时，两版都拒绝，确认区别在记录被整组删除。另一个 candidate 对照中，outside-voice 的合成 unavailable 仍得到 `clean ... unavailable=1`；接收者必须另看覆盖缺口。

## 可带回长程任务的选择

**审查接回时同时保留原回复、汇总、判断和被审版本；发现冲突回原回复，不由协调者重写一句“已通过”代替。** 这次候选补足了旧哈希／行数校验漏掉的内容绑定，适合已有多 reviewer 文件链的项目定向试用；只有一次审查时，直接核原回复与实际 diff 更轻，不必为这一步安装整套编排工具。

这组文件仍由同一可写方控制，没有独立签名或不可变锚。整组删除或协调改写原回复与哈希不在本次修复的保证内。`REVIEWED_TREE` 核的是输出声明，hash 会归一 CRLF 并去尾部空白；verify 使用运行版本的 parser，保全时要一起固定工具版本。它们分别帮助查错，不能替代真实审查、未提交改动检查或独立接收记录。

## 验证与保全

本地基线 **117 通过／0 失败**，候选 **119 通过／0 失败**。运行原项目 `review-dispatch`、`review-pass`、`review-targeted` 三个明确测试文件，使用隔离 HOME／临时目录／状态和禁环境自动加载的 Bun 入口。pass 测试包含 fake host／subagents 与真实本地 Git、CLI；targeted 的 push 只指向自建本地 bare 仓库。没有把这些测试计作真实模型审查。

完整免费套件、整套 Skill、typecheck 和付费／真实模型 eval 本轮未运行。上游固定 PR head 的 49 个 checks 为 37 成功、12 跳过，7 个 workflows 成功；这是托管状态回读，不是本机全面通过。具体定向终态和消费者负控见 [results.json](results.json)。原始输入、输出与固定源码只作离线保全；公开的是限定事实，不发布上游补丁或原始归档，长程页仍为 🟡。

**依据**：官方 [项目](https://github.com/garrytan/gstack/tree/7762c39a4ecdba8268c1ffc2b0384bccc04b3fa6)、[PR #3717 与作者披露边界](https://github.com/garrytan/gstack/pull/3717)、[候选 ledger 实现](https://github.com/garrytan/gstack/blob/5d2ba4f6f2b4e97f9ede69f6f1d9e4c747b7c81a/lib/review-ledger.ts)、[审查策略](https://github.com/garrytan/gstack/blob/5d2ba4f6f2b4e97f9ede69f6f1d9e4c747b7c81a/docs/review-policy.md)、仍开放的 [#3719](https://github.com/garrytan/gstack/issues/3719)，加本仓独立原生 CLI 对照。核实 2026-11-02；未比较整套方法的质量或效率收益，不据 Star 推荐默认。
