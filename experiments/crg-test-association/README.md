# code-review-graph：空测试关联、调用路径和运行覆盖是三件事

**🧪 原报告的 React 两文件已经形成 `Test → view → Widget` 静态调用路径，但 code-review-graph 的 `tests_for(Widget)` 仍返回 0。** PyPI 2.3.9 与固定 staging 都复现；staging 只消除了本次 interface 的 gap 分类，组件 gap 仍在。这是实际 CLI 结果，不是 React 测试运行或覆盖率。

本记录回答一个具体误判：图中“没找到测试”不能直接推出项目没有测试，找到调用路径也不能推出本次改动受到断言保护。它不提供新的操作指南、默认工具或已验收答案页。

## 原始输入与已观察到的关联

输入来自 [#1109](https://github.com/tirth8205/code-review-graph/issues/1109) 的两段原始代码：`src/widget.tsx` 声明 `WidgetProps` 与 `Widget`，测试文件的 `view` helper 渲染组件，`it` 调用 helper 并检查文本 `Hi`。本轮没有使用报告者的完整私有项目。

```mermaid
flowchart LR
  T["it: renders the title"] -->|CALLS| V["view helper"]
  V -->|CALLS| W["Widget"]
```

这两条 `CALLS` 来自实际图查询，不是执行 trace。测试源码只有文本断言；没有针对标题级别或 subtitle 的显式断言。受控差量只在组件文件新增可选 `subtitle?: string`，并把 `h1` 改为 `h2`，测试源文件保持不变。

## 四组完整建图结果

两版分别对原始输入与受控改动执行完整 build，均为 **2 文件、7 节点、18 边**；随后使用完整限定名查询，避免同名歧义。

| 工具构建 | 输入 | `tests_for` | 两次 `callers_of` | 改动后的 `test_gaps` |
|---|---|---|---|---|
| PyPI 2.3.9 | 原始 | status ok，0 项 | `Widget` 的 caller 为 `view`；`view` 的 caller 为实际 `it` Test | 未查询 |
| PyPI 2.3.9 | 受控改动 | status ok，0 项 | 同上 | `WidgetProps`、`Widget` |
| staging `d72e8fbf` | 原始 | status ok，0 项 | 同上 | 未查询 |
| staging `d72e8fbf` | 受控改动 | status ok，0 项 | 同上 | `Widget` |

共 22 次 build／status／query／detect-changes 调用，全部 exit 0。改动分析读取的是相对 `HEAD` 的未提交差量，不把工作树误当成未修改的基线。四个快照均报告 build 完整，节点保存的文件 hash 与对应磁盘输入一致；查询仍带有 JS/TS 解析局限提示，没有 stale 标记。

两份安装都显示 **2.3.9**，并不代表同一实现。正式包来自 PyPI；staging 安装的 `direct_url.json` 固定到 `d72e8fbf7ef571b668c26a4222a284bf7792e7a1`，其 parser／changes 源文件 hash 与正式版不同。实际环境为 Linux、Python 3.12.14，依赖清单与源码 hash 见记录。

## 证据与此前纠正

[results.json](results.json) 保留最终 22 次调用的 CLI 参数、开始时间、退出码、完整 stdout／stderr，以及四个只读数据库／文件快照。`args` 是可执行文件之后的参数；安装入口与工作目录由当时实际执行的脚本补充标识。公开投影仅替换试验目录绝对路径，保留原记录 SHA-256，不包含本机运行状态或私人项目数据。

最初使用裸 `Widget` 的查询有歧义，不算成功的空结果；随后快速写入／更新的四次限定名查询带 stale 提示，也没有充当最终的新鲜图证据。两个已捕获的改动状态中，节点 hash 已匹配文件，但文件 mtime 带小数、图更新时间只到整秒，支持这两次提示与时间精度有关；没有据此解释所有早期状态。最终让输入稳定 1.1 秒后正常完整建图，没有改文件／数据库时间或关闭提示；这不是通用的“加等待即可修复”建议。

截至核实日，[#1112](https://github.com/tirth8205/code-review-graph/pull/1112) 已合入 staging，旧图需重新建图才带有 declaration 元数据；[关联修复 #1128](https://github.com/tirth8205/code-review-graph/pull/1128) 仍 open、未合入，head `82099953824de8f7bafaa99b9f96a8fe2b6b5b83`。本轮未运行该候选，不重复开发它，也不把其测试自述并入本表。

**接收范围**：已核原报告输入、固定安装身份、静态关联与 gap 差异。未运行 Vitest、React、Windows、完整项目、模型或 MCP／HTTP 服务；没有运行覆盖率或断言充分性的实证。操作候选的本机新读者验收仍未完成，雷达排行与默认做法不变。

**依据与核实**：[使用者原始两文件](https://github.com/tirth8205/code-review-graph/issues/1109)、[正式发布 v2.3.9](https://github.com/tirth8205/code-review-graph/releases/tag/v2.3.9)、[固定 staging](https://github.com/tirth8205/code-review-graph/tree/d72e8fbf7ef571b668c26a4222a284bf7792e7a1)、上述两份上游 PR 与本仓 CLI 记录，核实 **2026-10-31 UTC**。独立只读审查核对公开投影与结论，不称为独立重新运行。
