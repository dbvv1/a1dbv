# A-AGENT-CHOICE-READER-20261103 · 选入口完成真实 CLI 小任务
id: A-AGENT-CHOICE-READER-20261103
owner: dot-A
status: review_ready
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

## 修改要求
本次仅恢复原单元的扫描阻塞，不是新读者或重新做题。接收端先核原调用、工具及登记进程全部退出；缺证则保持本地隔离，不启动任何新调用、不修改旧文件，也不以本状态或 blocked 推断退出。
确认退出后保留原本机候选和首轮记录，先对照真实命中内容与固定上游／基线，再做最小脱敏：jrnl/args.py:456 若确为已有 work_config.yaml 帮助占位，只替换为通用 `/home/user/work_config.yaml`，不改参数逻辑；reader-tests/A-AGENT-CHOICE-READER-20261103-u1.md:318 尚无公开原文，只对实际私人路径精确替换为合成占位／相对路径，不猜内容。
受控本地保留原输出与扫描失败，公开产物保原页面解析信息、正文指纹、真实命令／结果和首轮失败；不把新页回填为原输入，不重跑 fresh reader。未能定位同字节命中就继续 blocked，交具体缺证，不删整段证据求通过。
不修改扫描器、白名单、依赖或检查标准，不泄露原私人路径；若认定误报且不能在原写域安全更正，保留 blocked 交负责人，不绕过检查。原 no-install、合成数据、独占 worktree 与结果分支限制不变。
最小修订后跑原范围适用检查、公开扫描和提交身份检查，只推原 result_branch，由非读者核脱敏没有改变行为；发布通过仅解决扫描，不代替业务任务或页面验收。

## 当前结果

- 首轮 reader-test 完成：读者按页选择保留现有会话，核对并本地验证既有候选 #2120（与 head f4c6e2d 逐行一致，仅帮助示例路径脱敏）；CLI 实测 --import --format 五种错误组合均 exit 2 并提示 not allowed with argument --import，正常 --import（stdin/--file）与单独 --format 导出 exit 0；基线加新回归 4 例失败、候选 55 passed；单测 199 passed/27 skipped，BDD 全量 497 passed/17 skipped，ruff 与 black 通过；poe 的 poetry check 与 tox 因本机无 poetry 未跑。非读者核 taskDone=true，但 reviewed=false：openIssues 含 --imp/--impo/--impor 缩写、--form 与隐藏别名 --export 绕过检查，--help/--version 与 --import --format 同现的优先级副作用，#2120 open/merged 状态未核；pageStuck 2 条为页面未写已有未提交候选无写者时的处置、未说明缺依赖时如何发现已有隔离环境。未提交、未推送。
- 产物：[655d8a9](https://github.com/dbvv1/jrnl/commit/655d8a9f69028a4b0accdb55adce1babbf86d07c)，分支 `relay/a-agent-choice-reader-20261103`。
- 检查：check_public（文件与新提交身份） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：交负责人：决定是否补页面两句（工作树已有未提交候选且无写者信息时的处置、缺依赖且禁装时如何发现已有隔离环境）；评估 --imp/--impo/--impor、--form、--export 残余边界与 --help/--version 优先级副作用是否按 #2120 原样接受；核对 #2120 open/merged 状态并补跑 poe lint（需 poetry）。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。
