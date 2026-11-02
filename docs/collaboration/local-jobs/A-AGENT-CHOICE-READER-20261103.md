# A-AGENT-CHOICE-READER-20261103 · 选入口完成真实 CLI 小任务
id: A-AGENT-CHOICE-READER-20261103
owner: dot-A
status: running
kind: reader-test
target_repo: https://github.com/dbvv1/jrnl
base_ref: 90de4948d79a4fca8c7238dd2487b599f458c903
result_branch: relay/a-agent-choice-reader-20261103
page: docs/01-agents/README.md@main

## 目标
读者的问题是：“我维护一个 Python CLI 小项目，修这个问题该继续现有 Agent，还是换 Claude Code、Codex 或 Cursor？”
由此前未读过 a1dbv 的新读者，只照附入页面选择当前可用入口，实际处理 [jrnl #1990](https://github.com/jrnl-org/jrnl/issues/1990)：同时使用 --import 和 --format 时，给出明确的不兼容提示，保留正常导入与独立导出。
上游已有 [候选 #2120](https://github.com/jrnl-org/jrnl/pull/2120)；先核当前状态，已有实现可接回验证，不另造同题投稿，也不接管旧 #1908／DayOne 任务。

## 按什么做
按 kind: reader-test 原生 Workflow；接收端将 page 的 main 实际解析版全文附入正文，记录解析提交与内容指纹，不以任务卡或摘要替代页面。
只以该页作为方法指南；可读原 issue、既有候选、目标仓指令／贡献规范、源码、测试及页面直接引用的原始资料，记录必要页外帮助，不读 a1dbv 旧读者结果或作者的解题记录。
先给出针对这项任务的入口选择和理由，再沿已配置入口完成。无须同时跑三款产品；客户端、实际后端和可观察配置分别报告，未提供的能力不假装试过。
沿用已有依赖与授权；不安装或更新本机软件／依赖，不改账号、全局配置、接收端、权限或收费设置；缺依赖记环境卡点，不用依赖桩冒充原程序。
仅用项目测试 fixture／临时配置和假日志；遵守目标仓真实配置保护要求，不触碰用户 journal、密钥环或其他工作树。

## 写入范围
只在接收端分配的本任务 worktree 修改该需求必要的 jrnl/args.py、jrnl/controller.py、jrnl/messages/MsgText.py、相关 tests/ 文件，以及 reader-tests/A-AGENT-CHOICE-READER-20261103-u1.md。
确需范围外生产文件时记录原因并停止依赖改动；不改 a1dbv 页面、地图、TASKS、其他卡或旧结果，不修改依赖声明。
模型不提交或推送；接收端扫描后仅推指定 result_branch，回 review_ready 或 blocked，交 dot-A 接收；不用 accept: auto，不合默认分支，不向上游发 PR／评论。

## 怎样算做成
从实际 CLI 验错误组合（有效和未知格式都含）与正常导入／单独导出，新增回归应在原行为失败、候选通过；按目标仓规定运行相关检查，保留实际失败和未运行项。
非读者另核 diff、CLI 输出及回归，区分任务是否做成与页面能否指导选路，不凭入口名称或自报成功判通过。
在结果记录页面具体哪一步被采用、哪里卡住／做错、额外读了什么、实际命令与结果；将页面缺口、环境缺失和读者误解分开，无卡点则写无。
保留首轮结果，不自动再派盲读或换页重做；通常一个 60–90 分钟单元，最多两小时，未完成写清恢复条件。
