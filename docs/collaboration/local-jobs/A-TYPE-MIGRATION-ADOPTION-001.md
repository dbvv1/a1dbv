# A-TYPE-MIGRATION-ADOPTION-001 · 类型反馈与运行消费者真实采用

id: A-TYPE-MIGRATION-ADOPTION-001
owner: dot-A
status: cancelled
target_repo: https://github.com/actualbudget/actual
base_ref: 2ccf885b42dbac5f4aaf287be051e4d0a799f684
product_ref: 446264b59ca80871f7fb21cc4b3cb8cc9cc5fdc5
result_branch: dot-a/actual-method-adoption-20261026

## 结果

Actual [#1483](https://github.com/actualbudget/actual/issues/1483) 的配置入口已迁到 TS。真实 OMP LSP 预览返回空编辑后，Agent 显式核开发／发布 alias；严格编译和运行值反馈共同收紧配置类型，修正 OpenID 取值窄化，并保留配置原行为。[采用记录和补丁](../../../experiments/actual-config-type-migration.md)给出复跑入口与方法判断。

36 项相关配置／到期回归通过；根 typecheck、lint、SSR build、隔离 app 与内置 health-check 通过。原基线 20 个配置输入由非作者另跑通过。全量依赖安装仍有无关 sharp 下载未完成，未做完整产品 QA。

## 接收与下一步

产品与采用包已通过非作者独审：独立基线20例、候选36例、严格类型与真实构建消费者核验通过；不重新派接收端。对应正文 owner 回流迁移路线，贡献线按下述收口决定关闭。PR 模板保留原样未勾选，真人字段不代填；方法实证已接收；[fork分支](https://github.com/dbvv1/actual/tree/dot-a/load-config-typescript-1483)远端 `43bd1c0b1388dba9f2dd48a9b878f5657afc258d` 与本地产品树相同。创建上游Draft的集成接口返回403，回读确认无PR，只停该动作、不换路重试，其他方法工作继续。

## dot-A 收口（2026-10-29）

关闭本轮剩余投稿，不再排队或等待用户创建 PR。依据是 main 已发布的[采用记录收口决定](../../../experiments/actual-config-type-migration.md)（`a2163146`）；本卡同步该决定，修正旧 blocked 与“准备 PR”的过时描述。方法与补丁接收、fork 分支及全部测试／未验事实保留，不撤销已有成果。创建 Draft 的历史 403 仍是拒绝，未重试；cancelled 只关闭任务范围，不声称有运行中的进程已退出。
