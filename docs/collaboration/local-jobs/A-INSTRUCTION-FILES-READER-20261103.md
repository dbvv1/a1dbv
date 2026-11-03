# A-INSTRUCTION-FILES-READER-20261103 · 用已有项目指令完成文档小任务
id: A-INSTRUCTION-FILES-READER-20261103
owner: dot-A
status: revision_requested
kind: reader-test
target_repo: https://github.com/dbvv1/jrnl
base_ref: 7572c1183a382d3792641e428935ee178223783f
result_branch: relay/a-instruction-files-reader-20261103
page: docs/decisions/instruction-files.md@main

## 目标
读者的问题是：“项目已有 CLAUDE.md，怎样维护真正有用的指令，并确认 Agent 在一次真实修改中用上了它？”
由此前未读过 a1dbv 的新读者，只照附入页面处理 [jrnl #1977](https://github.com/jrnl-org/jrnl/issues/1977)：在使用文档首次介绍标签的位置，给 PowerShell 用户可照用的引用／转义说明，避免把 shell 解析问题误认作 jrnl 问题。
目标仓本身已有 CLAUDE.md；按页面判断是否需要改它，有真实缺口才改，不为验收强行新建 AGENTS.md 或复制整份规则。

## 按什么做
按 kind: reader-test 原生 Workflow；接收端附入 page 在 main 实际解析版的全文，记录解析提交与内容指纹；没附正文就报告输入卡点。
该页是唯一方法指南；可读原 issue、目标仓现有指令／贡献规范、相关文档／源码／检查配置及页面直接引用的原始资料，不读 a1dbv 其他教程和旧读者答案。
读者自行按页面核当前规则来源、可见性和实际采用；工具加载信息、任务中手动读取、实际遵守分开报告。没有启动证据不能用复述替代，也不要求额外跑第二款客户端。
先核原 issue 引用的实际 shell 问题与当前文档，再决定最小文案和必要项目指令；保留其他 shell 的有效说明，不预先给读者修法。
只用现有工具与依赖，不安装或更新本机软件／依赖，不改全局规则、Hooks、账号、权限或接收端。所有示例使用合成文本与临时配置，不接触真实 journal。

## 写入范围
仅本任务独立 worktree 的 docs/usage.md、确有必要的 CLAUDE.md，以及 reader-tests/A-INSTRUCTION-FILES-READER-20261103-u1.md。
不新建同步机制或新指南页，不改生产代码、依赖、a1dbv 页面／地图／TASKS、其他卡及旧结果；与其他 jrnl 卡不共用工作树。
模型只改文件；接收端扫描后只推指定 result_branch，回 review_ready 或 blocked，由 dot-A 接收；不用 accept: auto，不合默认分支，不对外投稿或评论。

## 怎样算做成
PowerShell 中实际运行文档给出的引用／转义形式，核传入参数与预期字符一致；如已能运行 jrnl，再以临时 journal 验实际写入及标签读取。仅参数探针通过时，明确完整 jrnl 路径是否仍待验。
核 Markdown 链接、目标项目适用文档检查和最终 diff；缺依赖保留环境缺口，不把未运行的文档构建写成通过。
非读者独立核示例、指令改动必要性和真实结果：入口／检查来自项目，关键原约定保留，规则实际怎样帮助完成这次修改有具体证据。
结果记录做成没有、页面采用步骤、具体卡点与补读内容，区分页面缺信息、环境限制和读者误解；保留首次失败，不替作者改页面。
单元通常 60–90 分钟、最多两小时；不能继续时交回已做部分和精确恢复条件，不自动重开旧读者任务。

## 修改要求
本轮只沿原 result_branch 从 7572c1183a382d3792641e428935ee178223783f 定点修项目指令的授权范围，不是新读者首次实测。先核本次旧调用、工具及登记进程全部结束并确认原 worktree 单写者；缺证继续隔离，不启动第二个调用或接管旧文件。保留首轮、二轮提交及 u1 全部原记录，只追加本项修订与独立核对。
CLAUDE.md 的 “Do not install or download anything just to run this check” 把本轮禁装固化为永久规则，与同页正常 setup 冲突。改成条件分支：当前任务禁止安装／下载时不执行 setup，缺前提则记录未验；正常项目使用若获得安装授权，可按实际 CI setup 准备环境。本轮实际 no-install 不变，不执行 setup 或可能隐式安装的 npx。
同时不要把“仅 node_modules 不存在才可安装”固化为永久条件：目录存在也可能依赖不全。表述应是检查前需要对应依赖、匹配浏览器与 docs server，不要求每次重装；安装是否允许以当前任务授权为准。保留 Python／Poetry、Node／pa11y-ci、Puppeteer Chrome、docs server 与 CI 入口的准确前提。
只改必要的 CLAUDE.md 条件措辞，并在原 u1 追加本轮说明。已核通过的 usage 单引号、apostrophe 双写、单标签有效形式及 POSIX 限定／互链保持不变；不重跑 Windows 探针、不改答案页、不为指纹误读再造输入或重读首次流程。指纹误读由下方负责人接收结论更正，保留读者原文。
原写域、no-install、合成数据、公开扫描、只推原结果分支限制均保留；非读者核最终 diff 与任务范围，不扩其他页，不得另开并发调用或另派新任务。缺依赖的本机完整 jrnl／MkDocs／Pa11y 仍如实未验；云端已验范围不能冒充 Windows 宿主或全门禁。修订后回 review_ready，不以 taskDone 概括完整验收。

## 当前结果

- 三项返工已落地并核对：docs/usage.md 将 PowerShell 整句示例改为字面单引号、补单引号内 apostrophe 双写示例，保留单标签反引号/单引号/双引号三种写法且未称双引号一律错误，Composing Entries 旧反斜杠转义说明限定为 POSIX/Bash-like shell 并交叉引用 #using-tags；CLAUDE.md 文档检查说明改指 .github/workflows/docs.yaml，列 Python/Poetry 文档环境、Node/pa11y-ci、匹配 Puppeteer Chrome、运行中的 docs server 四项前提，npm install 仅在 node_modules 缺失时使用，未安装/下载/跑 npx；reader-tests 记录追加第二轮并保留首轮证据。taskDone=true（核对者独立复算 diff 与 PowerShell 5.1/7.6 argv 探针，Git Bash 复核工作树一致），但 reviewed=false，仅完成一轮 reader-test 观察，不代表目标验收通过。pageStuck=7 项（均 cause=page：输入无独立解析提交字段且把提交号写成页指纹；子代理无 /memory、/context 工具侧入口；缺 poetry/mkdocs/Node/Puppeteer/docs server 属环境与禁装边界；jrnl 未安装缺 ruamel 属任务条件；PowerShell 文案位置无页面规定；main+PR 规则与任务限制冲突；agents-md-lint 非项目依赖）。未运行验收：MkDocs 构建、poe docs-check/Pa11y、完整 jrnl 写入/标签读取，均已标为待验未写成通过。openIssues：读者把任务文件中的 21b5f4ab 当成内容指纹，得出三个指纹不一致且无法映射上游的结论不成立——21b5f4ab 是提交号，其页面为 19,328 bytes/sha256 7b8c59ff（首轮附文），当前页面为提交 684e5bcf、20,025 bytes/sha256 c4e5a91d（含 bfd477e 链接），任务文件第 41 行「相符」判断正确；另有锚点检查脚本首版误报下划线链接、已自纠未影响文档。
- 产物：[7572c11](https://github.com/dbvv1/jrnl/commit/7572c1183a382d3792641e428935ee178223783f)，分支 `relay/a-instruction-files-reader-20261103`。
- 检查：check_public（文件与新提交身份） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：交负责人接收：裁决 21b5f4ab/页指纹措辞这一 openIssue 并决定是否更正读者记录，同时在具备 poetry/mkdocs、Node+Puppeteer Chrome 与可运行 jrnl 的环境补跑 MkDocs 构建、poe docs-check/Pa11y 及临时 journal 写入/标签读取。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。

## 独立接收核验补充
2026-11-02 负责人复核更正上方首次回执的归因，保留原文：非交互执行没有 /memory、/context 入口是页面操作说明缺口；缺解析提交 SHA／指纹是输入回执缺口，issue #1977 措辞属上游需求，poetry／mkdocs 缺失属环境与禁装边界，superfences 属目标项目配置，main＋PR 与任务限制冲突属指令优先级处理。六项不能全部计为页面缺陷。
公开回传记录报告首轮附文为 19328 bytes、SHA-256 为 7b8c59ff80cb8361d7ab958a8c9436ab690090d4fac7e9735dc6b2686b0a72e5，与负责人独立计算的 21b5f4ab0d4c78c73a2ef57502a4a49ba70fb991 页面指纹相符。未取得本机原始输入文件，不能称独立验证了实际附入内容；接收端解析提交及加载仍待独立回执，不回填首次输入记录。
读者先 Read 后复述，不计无工具复述；“启动已注入全文”目前只是读者自述，缺独立宿主回执仍待验。完整 jrnl／MkDocs 未运行继续保留为环境缺口。
三项产物修订和未运行验收仍按上方修改要求处理；页面缺口、环境限制、读者误解和实际任务完成分别接收，不用 taskDone 或首次 cause 标签替代独立判断。

## 二轮独立接收补充
2026-11-03，负责人回读 7572c118 仅含三个授权文件，首轮 u1 的 23046 字节完整前缀保留。云端隔离环境复核 MkDocs 1.6.1 build exit 0，生成 usage 中两条整句、单标签及 #using-tags 互链正确；已有 jrnl 4.6 依赖、未新安装，临时 config／journal 且 HOME／XDG 全部隔离，两条文案分别写入及 @beach／@cafe JSON 查询均 exit 0，$5、反引号、apostrophe、#／& 字面保留，查询未改 journal／配置。此为云端静态文档与 CLI 链路，不是本机 Windows／Poetry 锁环境／Pa11y 完整验收。
21b5f4ab 是页面提交，不是全文 SHA-256；其 19328 字节／7b8c59ff 指纹与公开回传报告相符，684e5bcf 页为 20025 字节／c4e5a91d，是后续版本而非首轮输入。负责人分别独算页面，但未拿到本机输入原件；实际解析提交与启动加载仍缺独立回执，不倒填原记录。不能由版本不同推成原指纹冲突。
七项 cause 不能统算页面缺陷：缺输入回执属证据，依赖缺失／禁装属环境与授权，目标项目规则冲突属优先级处理，agents-md-lint 非项目依赖及具体文案位置需按实际任务判断；非交互工具入口的旧页缺口已另修，不能据后页倒推首读。已验文档与行为范围保留，但永久禁装条件句仍须上方定点返工，当前不整体验收、不升级地图。
