# Datasette 新改动后的投稿判断

**部分接收：#3038 没有覆盖 #3015 的通用参数绑定目标；接收代码判断与页面卡点，不接“完整读者验收通过”。** 这是接收方对[原结果 45a20ea](https://github.com/dbvv1/a1dbv/blob/45a20ead8bf0952e5515a40812b0e6915223a5bb/docs/collaboration/local-jobs/artifacts/A-UPSTREAM-DATASETTE-DELTA-READER-20261107/result.md)的订正版。没有运行 Datasette、改产品、投稿或批准 CI。

## 当前下一步

沿 [#3015](https://github.com/simonw/datasette/pull/3015) 保留提案，先准备与当前上游共存的更新；保持 draft。#3038 为列统计在客户端内联 SQL 字面量，而 #2946 问的是查询参数的服务端非字符串绑定，目标不同。是否采用 `_typed_params=1`／`::int` 及其兼容取舍，仍需维护者决定，不能从其另一功能的实现推成同意本提案。

1. 补丁作者重新核 upstream main 与原 PR head。在只授权快进的范围内，将上游合入原分支并补交，不能沿原建议 rebase 后强推已发布历史。
2. 合并时保留两边的浏览器测试，核 `tests/test_playwright.py` 的导入和追加测试冲突。代码自动合并不等于行为兼容。
3. 保持 `QueryContext.named_parameter_values` 按去掉 `:` 的 SQL 基名键控。原分支传入 typed 名映射，违反已文档化的模板契约；typed 表单回填另用字段或表单名处理。`_query_page_data` 在静态合并树中仍收到基名映射，不能沿用读者已撤回的“必然缺 age 键”判断。
4. 先补 typed 查询与列统计共存回归、失败路径和模板上下文断言，再按当前贡献规则与 workflow 跑受影响的 typed、query/stored-query、HTML、Playwright 三浏览器和文档／格式检查。原 Unix socket 拒绝未解除，不重试；原 HTTPS 脚本未运行的缺口仍在，不缩检查后称全绿。
5. 设计决定与 CI 审批分开记录。只有完成获准更新并得到实际结果，才改 PR 验证说明；本轮没有发送讨论或其他消息。

## 独立核到的证据

- [#2946](https://github.com/simonw/datasette/issues/2946) 仍 open、标 `research`，问题是字符串与整数绑定的比较差异。
- #3015 仍 open／draft，head `a6f3ade873fbe91d3c6a58a76a50d359217b5c90`，没有评论或 review；该 head 的六个 GitHub workflow run 均为 `action_required`。这不是通过或正在运行。合并性字段可能返回未知，冲突结论按固定提交合并树判断，不依赖瞬时字段。
- [#3038](https://github.com/simonw/datasette/pull/3038) 于 2026-11-07 20:38:55 UTC 合入，merge `c261804af95d0ee27446754764745be7c07ecb3e`；其正文与 `column-stats.js` 明确说 `/-/query.json` 按字符串绑定，列统计改用字面量内联。该 PR 的检查不能移给 #3015。
- [main@3cb0f1b 的贡献规则](https://github.com/simonw/datasette/blob/3cb0f1b/docs/contributing.rst) 是有效入口；没有根级常见文件名，不代表项目没有规则。AI、CLA／DCO／vouch 未见明文要求，保留未知；维护者自己的 AI 署名不是外部贡献政策。
- 接收方独立执行固定 `main@3cb0f1b` 与 `a6f3ade` 的 `git merge-tree --write-tree`：仅 `tests/test_playwright.py` 有两处内容冲突；固定观察生成树 `eb8e1619`；本次取得的新 main `77bc27bd` 也只有同一测试文件冲突（树 `d2f03fe1`），未更新产品分支。`database.py`／`query.html` 自动合并，仍须修下述语义冲突。
- [模板契约](https://github.com/simonw/datasette/blob/3cb0f1b/docs/template_context.rst) 将 `named_parameter_values` 定义为去掉前导 `:` 的参数名映射，并声明模板上下文契约稳定至 Datasette 2.0。[候选源码](https://github.com/dbvv1/datasette/blob/a6f3ade873fbe91d3c6a58a76a50d359217b5c90/datasette/views/database.py) 把 typed 映射交给该字段，必须修正。
- main 没有 `_typed_params`／`::int` 的功能实现；`_typed_params` 子串确实存在于一个列统计测试名中，原报告“没有这些符号”过强。
- 按发布日期较新的 [1.0a41](https://github.com/simonw/datasette/releases/tag/1.0a41) 是 2026-09-24 的预发布版；最新稳定版是 [0.65.5](https://github.com/simonw/datasette/releases/tag/0.65.5)。二者早于本次两份 PR，不能把主分支实现写成发行结果。

原读者观察为 2026-11-07 UTC；接收方于 11-07 至 11-08 UTC 复核公开状态、规则、固定源码及发布信息。受影响检查是下一步计划，不是本轮测试结果。

## 附页、卡点与接收范围

- [input.txt](input.txt) 已随 `83bce683` 发布；接收方提取 `BEGIN/END EXACT PAGE` 段，与 `a25b151c` 页面逐字节相同（11,924 字节，blob `3bb764d2`）。结果分支的基线为 `e2628b9f`，工作树里看不到后加文件，不等于接收端没有产物。
- 接收端独立核对记录称，实际交给读者的附页与固定版本也一致。当前接收方只独立核了公开 input 与版本，未查看私人运行记录；“读者从未接触旧答案”未获独立证明。不能用这份静态文件或自报升级完整冷读验收。
- **采用的页面卡点**：常见规则文件缺失时应找文档导航中的等价入口；判断“覆盖”必须比较目标行为，明确“已合入但只作局部绕行”的情形，并核跨功能共存。
- **不增加规则的反馈**：页面已经要求规则沉默保留未知，不再重复铺一遍；本次只读边界、Goose 方法示例和工作树基线差异不算正文缺陷。
- 原结果额外写了不在授权写域中的 `reader-tests/...-u1.md`，本轮只作接收参考，不合入该额外产物。
- **执行信息**：接收卡记为 Claude Code＋DeepSeek 原生 workflow；本次实际模型标识与 effort 未能独立核实，均记未知。

已接收事实和针对页面的修正；修页后的首次照做、完整投稿闭环、新组合运行和新版 Qwen 验证均未完成，页面及地图保持 🟡。本卡不自动再派，不以新 ID 重跑原任务。
