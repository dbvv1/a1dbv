# A-LONG-ROUTE-FOREMERGE-READER-20261101 · 接回真实已返回结果
id: A-LONG-ROUTE-FOREMERGE-READER-20261101
owner: dot-A
status: review_ready
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 0004f093a86d277aebeb2f8eee4590d5e8b9c46f
result_branch: relay/a-long-route-foremerge-reader-20261101
page: docs/decisions/long-tasks.md@0004f093a86d277aebeb2f8eee4590d5e8b9c46f

## 目标与真实任务
当前真实单元是 Foremerge 两版本对 a1dbv 已审发布的 CLI 回放：实验已完成并交回，尚未决定怎样进入长程开发路线。你作为未参与本文或试验的新读者，按附入的答案页接回它，做出有证据的采用／保留／不适用判断，准备现有收件箱 Foremerge 段落的替换建议；不是重做实验、另找工具或完成全部长程能力评测。
输入为固定 base_ref 的 docs/collaboration/local-jobs/artifacts/A-LONG-ROUTE-FOREMERGE-READER-20261101/input.json；它含实际命令、输出、状态、失败控制、官方来源及独立远端回读，只有明示路径／作者名脱敏，保留原始 JSON hash。现有候选入口是 docs/collaboration/inbox.md 的 Foremerge 段落。不得读取私人会话／目录、账号用量、MODEL 残留文档或旧广扫运行材料。

## 按什么做
按 write-task-guide 的真实新读者要求，接收端必须把 page 固定版本全文原样放入实际模型任务正文；只给链接、摘要、文件路径或本卡不能算已给页面。全文缺失就报告输入阻塞，不自行改成一次普通代码评审。
只照这一页安排工作，可读必要仓库约定、上述实际任务输入和输入中已有官方来源；记录必须补读的其他指南或无法从页面决定的步骤，不替作者修改页面。
这是已完成运行的接收：不安装依赖、不再启动 Foremerge／服务／MCP／模型试验，不重跑 prek 或该两版本试验，不改接收器、权限、配置或旧任务状态。可以用已有标准库解析结果并执行本次文档适用检查。
先核是否已有同项结果或写者；本单元与已取消的 MULTIAGENT 广扫不同，不重排或接管旧卡。共享四并行由既定接收器决定，不另起调度。登记槽位与未登记历史后代状态分别报告，不宣称全局空闲。

## 写入范围
只写 docs/collaboration/local-jobs/artifacts/A-LONG-ROUTE-FOREMERGE-READER-20261101/result.md；接收端只另回写本任务的状态／当前结果。
不改 input.json、答案页、模板、inbox、TASKS 或其他任务。仅推指定 result_branch，回 review_ready；不用 accept:auto、不合 main、不提上游 PR、评论或部署。原始运行、页面与模板均由负责人接收。

## 怎样算做成
结果先给读者可用的判断与建议替换文字，再列关键证据，避免重复运行日志。必须能据实际版本、CLI 返回、接收与落地身份、失败控制和远端回读，解释本例支持哪一层结论、是否值得改变现有协调方式及何时不适用；不把本地状态、检查数量或工具调用数写成发布成功或协作收益。
保留首次失败和修正经过，区分已验、失败、未验与剩余必要动作；不得自行把遗漏的验收、取消项或原始失败改成完成。建议文案只含可公开内容并指向真实来源。
另以简短“页面卡点”记录页面是否全文进入、实际采用的步骤、发生的错误／补读、原因属于页面还是环境／模型，以及这项真实接收做成与否。无卡点如实写，无须编造问题；本单元不验证客户端自动加载、无人值守时长或其他宿主。
按 reader-test 原流程做非作者结果核查：核实际结果与证据，不靠读者自报；有遗漏保留未通过，不自动再派新盲读。跑适用 check_repo、check_public、提交身份与空白检查，回固定提交供负责人本轮接收。单次最多两小时，阻塞保留具体动作、原因和恢复条件。

## 当前结果

- reader-test 单轮观察完成，内容层结论成立：Foremerge 0.6.0 对实际落地 c735c8ed 按内容核为 COMMITTED（integration.method=content，2 路径），0.5.1 对同一落地返回 TARGET_DIVERGED 属假阴性；页面全文与 docs/decisions/long-tasks.md@0004f093 逐字节一致。产出 docs/collaboration/local-jobs/artifacts/A-LONG-ROUTE-FOREMERGE-READER-20261101/result.md（101 行）与 reader-tests/A-LONG-ROUTE-FOREMERGE-READER-20261101-u1.md（95 行），均为未跟踪文件；check_repo（643 文件、0 错误）、check_public（1099 文件、0 findings）、git diff --check 通过。taskDone=false（外层禁止提交/推送/切分支，固定提交与 result_branch 交付未完成）。pageStuck 两处轻量缺口：页面未写去哪里核同项结果与当前写者；未给同一工具两版结果不同的现成写法（均不阻塞）。openIssues：替换文案把 0.5.1 与 0.6.0 并列写成两版都识别缺文件，但 0.5.1 实为祖先检查拒绝；新依据行若整段替换会丢 HN/V2EX/linux.do 核读记录；回读事件的远端观测仍来自记录，不能用本地一致性宣称独立验证。未运行验收：hosted CI、完整测试套件、消费者验收、并发多写者案例、候选 53cc161e 对象本体独立复核。未提交、未推送、未切换分支，未改任务文件和页面。
- 产物：[0d7b82a](https://github.com/dbvv1/a1dbv/commit/0d7b82a98680d485d07d3d218ed630276965c9e1)，分支 `relay/a-long-route-foremerge-reader-20261101`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：负责人处理：在允许提交的环境补固定提交并按 result_branch 交付、核 hosted CI；按 openIssues 修正 inbox 替换文案（区分 0.5.1 祖先拒绝、保留原来源记录、弱化回读独立性表述）；如需把 0.6.0 提升为默认，补真实并发多写者案例与消费者验收。reader-test 不自动重读。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。
