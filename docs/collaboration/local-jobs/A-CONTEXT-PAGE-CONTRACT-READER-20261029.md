id: A-CONTEXT-PAGE-CONTRACT-READER-20261029
owner: dot-A
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5847ea532dbf7437ca8c4865af031ce0d862a153
result_branch: relay/a-context-page-contract-reader-20261029
kind: reader-test
page: docs/decisions/context-management.md@dot-a/context-concise-reader-20261029

# 新 page 输入合同的真实仓库验收

## 目标与做法
本仓刚以 5561e38e 更新 reader-test 的 page 引用协议；四页读者任务需要据此派发。请完成仓库侧验收：现行写法怎样提交一个合法任务，哪些保证仍须接收端验证。
先确认接收端实际附入本卡 page 固定版本的全文。没有全文则记录入口卡点，不把自行取回页面说成已成功附入；执行读者须此前未读本页、未参与该页写作或旧诊断，使用独立新上下文。
只照所附页面的方法完成本任务；项目必读指令、目标源码和测试是工作材料，不另找上下文管理教程或旧读者答案。
从 docs/collaboration/local-jobs/README.md、scripts/check_repo.py 与 tests/test_check_repo.py 开始，缺信息再扩大到相关实现；记下实际使用的入口与缺口。

## 写域
只在结果分支新增 docs/collaboration/local-jobs/artifacts/A-CONTEXT-PAGE-CONTRACT-READER-20261029/result.md，记录结果、必要复现输入、卡点和短检查点；临时测试输入放本任务独占的仓外目录或内存。
不修改页面、检查器、任务协议、长期规则、接收端及用户电脑设置，不创建或发布 ready 任务，不重跑旧调用。
不访问凭据或私人会话，不操作桌面，不请求其他模型；不为试验压低阈值、填满上下文或制造中断。

## 原任务验收
- 固定实际受检 commit 与 page ref，给出实现位置、实际命令和退出结果；失败、未运行、未知分开。
- 以现行协议给出一份可公开的最小 reader-test 卡示例，保持未入队；实际调用当前检查器相关入口验证它，说明输入和验证范围。
- 核对 page 的默认 ref、固定 ref 及缺失目标的处理边界；生成的测试输入明确标为合成，不冒充接收端故障。
- 按需运行相关仓库测试；区分文档规定、检查器实际检查和本次真实执行证据，不以静态通过宣称接收端已附全文或任务已启动。
- 留下最新约束、已验结果、证据入口、尚缺条件与具体下一步组成的检查点；说明页面让你卡住、做错或需补查的位置。
- 非读者验证者核对实际测试输入与输出，复跑关键检查，并核读者实际收到的固定页面全文；无法观察的接收端行为记未知，不采纳模型自报作通过。

没有自然跨压缩或新会话时，只记按需取回与检查点准备的结果，原生接续效果仍待验。单元最多两小时；接收端公开扫描与适用检查后推指定结果分支、回 review_ready，不用 accept: auto，不合默认分支。

## 当前结果

- 仓库侧验收已完成：README 规定任务卡格式，check_repo.py 只查直属卡 80 行、内联链接与 JSON/TOML（另有 TASKS.md 超 10KB 检查），page 缺省 main、缺目标及接收端解析/落盘不可观察记未知；合成探针、9 项单测与 561 文件复跑均通过（taskDone=true）。页面卡点是第 7 行“沿实现与检查补足信息”未给核对接收端附入内容是否等于固定 ref 的步骤；未关闭审查问题 7 条：卡点行号误用 job.md 行号（页面仅 82 行）、result.md 称“没有命令失败”与首次 FileNotFoundError 矛盾、卡点写在 reader-tests 而非 result.md、检查器概述漏 TASKS.md 10KB 检查、第 80 行 page@提交 措辞不精确等。
- 产物：[0b5d66d](https://github.com/dbvv1/a1dbv/commit/0b5d66dec1eda98c4eaabd2ee982788a53c96951)，分支 `relay/a-context-page-contract-reader-20261029`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：按 verify.missed 修正 result.md：补记首次 FileNotFoundError 与重试、把卡点行号改为页面行号、将卡点写入 result.md、补 TASKS.md 超 10KB 检查、澄清 page@提交 与 blob/sha256 的区别；改后复跑 check_repo.py 与 test_check_repo.py。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。
