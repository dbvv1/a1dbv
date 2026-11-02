# A-INSTRUCTION-FILES-READER-20261103 · 用已有项目指令完成文档小任务
id: A-INSTRUCTION-FILES-READER-20261103
owner: dot-A
status: review_ready
kind: reader-test
target_repo: https://github.com/dbvv1/jrnl
base_ref: 90de4948d79a4fca8c7238dd2487b599f458c903
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

## 当前结果

- taskDone=true（核对者独立复算：docs/usage.md 在首次标签说明处新增 PowerShell 引用/转义说明，CLAUDE.md 新增 Editing Documentation，另有读者记录；diff +22/+9，Markdown 链接、fence 配对、git diff --check 及 PowerShell 7.6.9/5.1 argv 探针均通过）。pageStuck=6 项均为 cause=page（输入缺解析提交 SHA 与内容指纹；子代理无 /memory、/context 入口；issue #1977 表述不精确；缺 poetry/mkdocs 依赖；mkdocs 未启用 superfences；CLAUDE.md 的 main+PR 规则与任务限制冲突）。未运行验收：完整 jrnl 写入/标签读取、MkDocs 构建、poe test/docs-run/docs-check（依赖缺失且任务禁装），读者已明确标为待验、未写成通过。openIssues：1) 整句双引号示例会静默吞掉 $ 和反引号，应改用单引号示例或注明转义；2) Composing Entries 旧 note 仍称保留字符可用反斜杠转义，未限定 POSIX shell 且与新增说明无交叉引用；3) CLAUDE.md 的 docs-check 前提遗漏 CI 的 npx puppeteer browsers install chrome，属未验证风险。reviewed=false 表示本轮观察尚未通过验收，仅完成一轮读者测试。
- 产物：[bfd477e](https://github.com/dbvv1/jrnl/commit/bfd477e78238243ec019b423623ea434d3226189)，分支 `relay/a-instruction-files-reader-20261103`。
- 检查：check_public（文件与新提交身份） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：交负责人接收：确认上述 3 个 openIssues 是否修正（尤其双引号整句示例），并在具备 poetry/mkdocs 与可运行 jrnl 的环境补跑 docs-check、MkDocs 构建及临时 journal 的写入/标签读取。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。
