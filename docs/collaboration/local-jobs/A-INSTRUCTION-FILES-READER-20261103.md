# A-INSTRUCTION-FILES-READER-20261103 · 用已有项目指令完成文档小任务
id: A-INSTRUCTION-FILES-READER-20261103
owner: dot-A
status: ready
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
