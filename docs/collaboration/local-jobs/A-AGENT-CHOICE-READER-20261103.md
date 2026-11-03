# A-AGENT-CHOICE-READER-20261103 · 选入口完成真实 CLI 小任务
id: A-AGENT-CHOICE-READER-20261103
owner: dot-A
status: accepted
kind: reader-test
target_repo: https://github.com/dbvv1/jrnl
base_ref: 9340d813714bd9aa761de602a9cfcc3a2004a036
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
沿原 result_branch 从 9340d813714bd9aa761de602a9cfcc3a2004a036 只修一个已复现的 help 参数顺序回归；先确认本次原调用、工具及登记进程全部退出且原 worktree 单写者。缺证保持隔离，不另开并发调用或新任务，不新派 reader。保留全部原提交与首轮／返工记录，仅追加本次修订与纠正。
必修：`--format whatformats --help` 在原基线 90de4948 与修前 7875131 为 exit 2，9340d8 变成 exit 0；恢复按真实参数顺序处理此前已消费的非法格式。反序 `--help --format whatformats` 应保持 exit 0，未知格式在 version 前仍 exit 2；--help 与 -h 用同一语义。保住 `--import --format json --help` 的原有 help 优先级，不能在 help action 里直接套用包含最终互斥的完整检查。
保留当前按 argparse 实际解析／action／最终 postconfig_cmd 的修法，将格式值检查与最终命令互斥分开；只校验 help 之前实际消费并记录的格式值，不恢复 raw token 预扫描。复用本轮已有 31 场景、旧 26 项与正反序控制，不无限扩反例池或同义页面指引。
`--format whatformats --badoption` 及反序均仍 exit 2 且无 journal 改动，只是诊断选择不同，本轮列非阻断差异，不要求逐字还原。任务不能以该项来掩盖上面的 exit 2→0 兼容回归，也不把两类差异都算必修。
原写域、no-install、禁全局／权限变更、合成数据、公开扫描和仅推原结果分支不变；poetry／tox 未跑保留。实际 page 解析 SHA／全文指纹原件无法恢复，停止索求、当前页回填或重跑首次阅读；#2120 保原 22:17 UTC 观察，不绕网络重查。非读者定点复验后回 review_ready，分开有限通过、非阻断差异、失败与未验，不用 taskDone 概括整体验收。

## 当前结果

- reader-test 单轮观察与定点返工完成，按 Workflow 返回 taskDone=true、reviewed=false。实际改动仅 3 个文件：jrnl/args.py 拆出 validate_export_format_values 并新增 ExportHelpAction（--help/-h 共用），恢复 --format <非法值> --help/-h 在 9340d81 上由 exit 2 退化为 exit 0 的回归，同时保持反序 --help --format whatformats exit 0、--format whatformats --version exit 2、--import --format json --help 的 help 优先级、badoption 两序 exit 2 且 journal 不变；tests/unit/test_parse_args.py 新增 4 个 case；记录追加第四轮修订与非读者核对。工作流实测：tests/unit 223 passed/27 skipped、BDD 497 passed/17 skipped、定向 31 passed/1 skipped、ruff/black 通过；新测试在 9340d81 上 2 failed/2 passed、修复后 4 passed。未提交/推送/切分支/改任务文件。openIssues：(1) 页面《第一步》未写缺依赖且禁装时如何发现已有隔离环境（页面小缺口+环境缺失，本轮复用遗留隔离环境、未安装依赖）；(2) 读者首遍回归参照树选错（先只跑 90de4948/7875131 得 4 passed），改用 git archive 9340d81 后自纠，无残余影响；(3) 页面解析 SHA/全文指纹原件缺失，按任务停止索求；(4) #2120 沿用负责人 2026-11-02 22:17 UTC 观察未联网复核。pageStuck 3 条（隔离环境发现、解析回执缺失、#2120 观察沿用）。未运行验收：poe lint 的 poetry check、tox（本机无 poetry/tox/poe，no-install 约束）、#2120 联网状态；均保留为未验。另记录内一处自述行数 +99/−0 与实际 +130 不符，属记录粒度小瑕疵。
- 产物：[7f3368b](https://github.com/dbvv1/jrnl/commit/7f3368bad7f40221e0a6a76b45dc60670ea827cf)，分支 `relay/a-agent-choice-reader-20261103`。
- 检查：check_public（文件与新提交身份） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：交负责人接收：1) 决定是否补页面“缺依赖且禁装时如何发现已有隔离环境”一句；2) 核 #2120 实际状态；3) 决定是否修记录内 +99/−0 与实际 +130 的表述（仓库文件本轮不应在 Workflow 外再改）；4) 由接收端提交 3 个交付文件并回 review_ready。taskDone=true 仅表示本轮必修项做成，不表示整体验收或页面选路通过。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。

## 独立接收结论
2026-11-02 负责人在隔离云端对基线 90de4948 与候选 655d8a9 分别运行 19 组真实 CLI。原 5 错误组合及 5 正常路径符合有限预期；另确认 5 个缩写／别名漏拦、help/version 优先级由 exit 0 变 2，以及两条 `--` 后合法输入由 exit 0 变 2。故本轮不 accepted，原报告 taskDone=true 不代表完整验收；按上方返工，原记录保留。
原 u1 只见 page@main 和片段引用，没有可独立核对的实际解析 SHA／全文指纹；当前页面变化不用于倒推首轮输入。poetry／tox 缺依赖继续保留，真实客户端模型身份及未验路径不由源码一致或测试总数补齐。

## 后续独立接收补充
2026-11-02 23:25 UTC，负责人在隔离云端对 90de4948、655d8a9、7875131 三树分别运行同一 26 组真实 CLI：原 19 组在 7875131 已符合有限预期，但以上值消费与后置 list 兼容反例仍在；它们并非本轮新引入。原输入无法恢复仍是证据缺口，故不整体验收、不升级地图，沿原单元修订。

## 第三轮独立接收补充
2026-11-03 负责人独立在 90de4948、7875131、9340d8 三树各跑同一 31 场景：旧 26 项在 9340d8 均符合有限预期，值消费与后置 list 已修。新暴露的非法格式在 help 前 exit 2→0 是唯一阻断；两个 badoption 顺序只改错误诊断，均 exit 2、无 journal 改动，非阻断披露。非作者独审同意上述分级；原卡继续定点返工，不 accepted，不新增页面差量或 reader。

## 第四轮负责人限定接收（2026-11-03）
- 接收原结果分支 [7f3368ba](https://github.com/dbvv1/jrnl/commit/7f3368bad7f40221e0a6a76b45dc60670ea827cf) 的此次 jrnl 参数兼容修复，关闭 help-only 实现返工，不新增 reader。01:56 UTC 负责人用原封不动的上一轮脚本，对 90de4948／9340d813／7f3368ba 三树各重放同一 31 个真实 CLI 场景；相对 9340d813，非法 format 在 help 前由 exit 0 恢复为 2，正常路径均 0、应拒绝组合均 2，值消费、list 顺序与 `--` 字面量保留，合成 journal 未被错误路径改动。非作者另核源码与原输出，无代码阻断；这是 31 场景三树对照，不是 93 个独立场景。
- 原首轮和各次返工记录保留；本轮 u1 的旧 401 行逐字节保留，531 行结果实际追加 130 行，原“+99/−0”未对齐整份增量，不据该自述计完整 diff。“两个前置 help 用例”准确应为非法 format 在前、help 在后。以上作为负责人核验更正，不覆盖读者原文、不为记录措辞再次返工代码。
- 卡点重新分类：解析 SHA／全文指纹缺失属于输入回执，已明确无法恢复，停止索求或当前页回填；#2120 沿负责人原 22:17 UTC 观察属于任务约束；寻找既有环境是环境经验，不据此再加同义页面指引。读者选错回归树后已自纠，保留这一失败过程；三项不能统算页面缺陷。
- 本机 223 unit／497 BDD 等为回传报告，不冒称负责人独立跑过全套；poetry check、tox 及完整门槛未验继续保留。接收仅限实际代码产物与上述定向消费者结果，不代表首轮输入完整可追溯、全部客户端／模型效果或 Agent 选型比较通过，地图仍 🟡。保留 badoption 的非阻断诊断差异；正式产物已发布，模型阶段“未提交未推送”不否认接收端后续结果。
