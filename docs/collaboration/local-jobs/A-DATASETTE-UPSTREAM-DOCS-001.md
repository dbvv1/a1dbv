# A-DATASETTE-UPSTREAM-DOCS-001 · 补齐现有 PR 的用户文档

id: A-DATASETTE-UPSTREAM-DOCS-001
owner: dot-A
status: accepted
target_repo: https://github.com/dbvv1/datasette
base_ref: cae9014efb7e6a8d076df3e88e557976b02e87e7
result_branch: codex/typed-params-user-docs

## 目标

为 [Draft PR #3015](https://github.com/simonw/datasette/pull/3015) 补上贡献规范要求的 SQL 查询用户文档，不改六文件原型、不新增类型或第二个 PR。内容与现有代码及实际请求一致，原型已收口。

## 执行与验收

dot 直接执行：已启动保存的 Codex 云环境任务；本机接收端不重复认领。使用独占 fork 副本，先核当前 head 与贡献规范，只改必要文档，按受影响范围检查，并由非作者核代码／文档一致性。

默认字符串与显式整数、范围／400、GET／POST适用入口、重复参数取舍、query重放及编辑器保持行为写清。AI审查不称人审，现有CI欠项不抹去；不签CLA、不改PR状态、不部署。

## 当前结果

[a6f3ade](https://github.com/dbvv1/datasette/commit/a6f3ade873fbe91d3c6a58a76a50d359217b5c90) 已快进接入原 PR #3015，仅改sql_queries.rst（+46/-1）。13项文档测试／143子测试、严格Sphinx构建及22次示例请求通过，已有非作者AI独审；原六文件未变。PR描述已更新，仍为Draft，精确head的六项hosted工作流为action_required。任务收口，后续只跟维护者评审。
