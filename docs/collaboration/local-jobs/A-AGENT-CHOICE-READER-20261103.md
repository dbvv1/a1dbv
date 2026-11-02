# A-AGENT-CHOICE-READER-20261103 · 选入口完成真实 CLI 小任务
id: A-AGENT-CHOICE-READER-20261103
owner: dot-A
status: running
kind: reader-test
target_repo: https://github.com/dbvv1/jrnl
base_ref: 787513136a7ad83441f376d4a08960d2197ef19e
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
沿原 result_branch 从 787513136a7ad83441f376d4a08960d2197ef19e 定点修订；先确认原调用、工具和登记进程全部退出且原 worktree 单写者。缺证维持隔离，不启动第二个调用或改旧文件；不新派 reader。保留首轮和第二轮提交／记录，只追加修订与更正。
1. 按真实参数消费和最终 postconfig_cmd 优先级修互斥检测，不再靠忽略值消费的 raw token 预扫描叠例外。以下三个 nargs=2 值场景在基线 90de4948 均 exit 0，655d8a9 与 7875131 均误报 exit 2：`--import --config-override editor --format`、同句末值 `--format=json`、`--config-override editor --import --format json`。其中 --format／--import 是 config_override 的值，不能当独立选项。
2. `--import --list --format json` 与 `--import --ls --format json` 应保留基线的后置 list 覆盖、exit 0；反向 `--list --import --format json` 基线失败，候选应明确拒绝，不能用“含 list 就跳过”绕过互斥。以实际解析／命令选择语义实现，并补正反向回归。
3. 继续保住上轮已修的原 5 错误组合、5 正常路径、5 缩写／别名、help/version 的基线参数顺序与优先级，以及两条 `--` 后合法正文／检索；同一套回归对照原基线／修前候选／新候选，失败原因不能是启动或缺依赖。
4. 原 u1 把部分“基线 exit 0”误标为 655d8a9，追加更正：真正基线是 90de4948，655d8a9 和 7875131 已有相同残余反例。不得写成 7875131 新引入，不覆盖原记录。分别列真实通过、失败、跳过、未运行，不以 taskDone 或测试总数概括通过。
原 page 解析 SHA／全文指纹原件已确认缺失且无法恢复，停止索求，不读私人会话或当前页回填，也不重跑首次阅读。当前页已有未知写者处置及缺依赖禁装指引，不追加同义页面要求；这不能倒推首轮读过哪些内容。#2120 沿用负责人 22:17 UTC 的 open／未合观察，不绕网络复查。
原写域、no-install、禁全局／权限变更、合成数据、公开扫描和单写者限制不变；poetry／tox 缺依赖继续保留未跑。只修原任务实现与回归、仅推原结果分支，交非读者定点复验后回 review_ready；不扩新实验或模板。

## 当前结果

- reader-test 第二轮按页仍选保留现有会话，在 655d8a9 定点返工：args.py 按 argparse 唯一前缀/别名识别互斥、保留 help/version 优先级、在裸 -- 处截断；测试扩到 11 个错误组合并新增 version/help 优先级与 -- 边界用例。taskDone=true：修前 12 failed/56 passed，修后 68 passed；单测 212 passed/27 skipped，BDD 497 passed/17 skipped，ruff 与 black 通过；CLI 原 5 错误组合、5 正常路径及缩写/别名/help/version/-- 边界实测符合预期。openIssues：--config-override（nargs=2）把 --format/--import 当值时误报 exit 2（上游 90de4948 为 exit 0），--import --list --format json 上游 exit 0 且 --list 生效而候选误报，读者只记一例且把基线写成 655d8a9（实为 90de4948）；读者称页面未给未提交候选处置与缺依赖处置，实为漏读/部分漏读。pageStuck 3 条：缺依赖且禁装时如何发现已有隔离环境、页面解析回执与全文指纹原件缺失无法恢复、#2120 沿用负责人 2026-11-02 22:17 UTC 观察。未运行：poe lint 的 poetry check 与 tox（本机无 poetry），#2120 未联网复核。未提交、未推送。
- 产物：[7875131](https://github.com/dbvv1/jrnl/commit/787513136a7ad83441f376d4a08960d2197ef19e)，分支 `relay/a-agent-choice-reader-20261103`。
- 检查：check_public（文件与新提交身份） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：交负责人：确认 --config-override 值消费与 --list 后置覆盖两条兼容回归是否必修（按 argparse 语义预扫描需跳过值消费并尊重后置命令优先级），并核 #2120 实际状态；页面可考虑补一句“缺依赖且禁装时如何发现已有隔离环境”。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。

## 独立接收结论
2026-11-02 负责人在隔离云端对基线 90de4948 与候选 655d8a9 分别运行 19 组真实 CLI。原 5 错误组合及 5 正常路径符合有限预期；另确认 5 个缩写／别名漏拦、help/version 优先级由 exit 0 变 2，以及两条 `--` 后合法输入由 exit 0 变 2。故本轮不 accepted，原报告 taskDone=true 不代表完整验收；按上方返工，原记录保留。
原 u1 只见 page@main 和片段引用，没有可独立核对的实际解析 SHA／全文指纹；当前页面变化不用于倒推首轮输入。poetry／tox 缺依赖继续保留，真实客户端模型身份及未验路径不由源码一致或测试总数补齐。

## 后续独立接收补充
2026-11-02 23:25 UTC，负责人在隔离云端对 90de4948、655d8a9、7875131 三树分别运行同一 26 组真实 CLI：原 19 组在 7875131 已符合有限预期，但以上值消费与后置 list 兼容反例仍在；它们并非本轮新引入。原输入无法恢复仍是证据缺口，故不整体验收、不升级地图，沿原单元修订。
