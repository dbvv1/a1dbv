id: A-UPSTREAM-CURRENT-READER-20261110
owner: dot-A
status: review_ready
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: dc45976eeb083d498f90152035c0fa0a9ee1878c
result_branch: relay/a-upstream-current-reader-20261110
page: docs/decisions/upstream-contributions.md@dc45976eeb083d498f90152035c0fa0a9ee1878c
## 真实任务与输入
为 QwenLM/qwen-code #15741 的新诊断候选决定现在能否投稿及下一步。只照下附当前页；须未读过该版本、未参与候选与页面写作的新读者。先核全文实际附入，缺失则报卡点，不自行补读后冒称输入成功。
候选固定 dbvv1/a1dbv@af119e2469c35a4fe465f6bd3a0467df689e8802，仅读 experiments/qwen-discovery-diagnostic/fix.patch、server.mjs、reproduce.py；不读同目录 README、旧 Qwen 卡/结果、其他读者判断。本补丁基于 Qwen 41ffb223448847b4c8ea2a1e9b463650095b2890：定向11通过/174未选、CLI构建及三路最终诊断通过；完整preflight未过，旧Unix socket明确拒绝不得重试。已有复现不能替代投稿准入。
## 范围与验收
按附页实际读目标当前规则、issue/PR及代码，独立选择实现/补验/协调/准入/收起；给固定来源、行为差量、一个可执行下一步、仍缺内容，以及页面造成的卡点。不得创建issue/PR/fork、签约、安装、运行测试/模型、操作用户配置或访问私密数据；只读公开材料。规则沉默保留未知。
只新写 docs/collaboration/local-jobs/artifacts/A-UPSTREAM-CURRENT-READER-20261110/result.md；不改正文/补丁/旧任务/产品。接收端按合同回写本卡与结果分支；不自动合main。单元60–90分钟、上限2小时，沿已有4并行/1GPU限额；旧调用未知不接管，本任务不重试旧任务。
非读者核源码、所读版本、原始返回与实际结论，区分页面卡点和执行能力；只验当前页的投稿前核心选路，不视为已投稿/合并或自动升级✅。check_repo/check_public/空白与提交身份通过后交回。没有新读者或共享槽条件则保留待领取，不捏造执行。
## 当前结果

- reader-test 单轮观察完成：按附页与固定来源选路为“收起重名恢复重复部分 + 协调剩余非重名 conversion 诊断差量 + 准入”，结论是现在不能直接投稿；taskDone=true，pageStuck 记录 5 条页面缺口，未运行验收（未跑测试、构建、模型或 CLI，完整 preflight 未复跑，候选状态仍来自任务卡）。openIssues：result.md 对 getMCPServerLastError 记录范围表述偏宽（仅 discoverAndReturn catch 记录）；漏 Qwen CONTRIBUTING §5/§6 的 /docs 更新与 before/after demo；下一步把评论已关闭 #15741 列为首选、新开 issue 仅作备选，应按 CONTRIBUTING 改为新开 issue 主路径；页面副本“3213 字符完全一致”不精确（首处 3214 字符逐字节一致，第二处多一前导换行）；Windows 未验证非硬性阻断，真正阻断是完整 preflight/全量测试未过与缺少可关联 open issue。
- 产物：[10c592c](https://github.com/dbvv1/a1dbv/commit/10c592cacc9aece883eb9066d904dc333a0dfd8f)，分支 `relay/a-upstream-current-reader-20261110`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：由 dot-A 接收决定去向；负责人可据上述 openIssues 决定是否修订 result.md 或沉淀页面缺口（尤其 closed issue + merged PR 下剩余差量的协调入口、定向子集与全量测试判据），本轮不自动重读；未投稿、未合 main。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。

## 当前页面全文（固定版本如 page）
以下原文相对链接以 docs/decisions/ 为基准，不以任务卡目录为基准。
````markdown
# AI 辅助补丁怎样交给开源项目

**🟡 让 Agent 做复现、实现和检查，由贡献者理解改动、按目标项目规则投稿并回应评审。** 先确认项目接受什么，再围绕一个真实问题交付可复现、可审查的小补丁；不要先生成一批代码，再找维护者接收。适合使用 Codex、Claude Code 等工具、准备向开源项目贡献的开发者。

## 起手：先确定这次贡献的下一步

把下面这段交给 Agent，填入目标仓库和真实问题：

```text
为 [仓库] 的 [issue／真实问题] 判断并准备下一步；已有材料为 [分支／补丁／测试结果]。
先读当前 CONTRIBUTING、AGENTS、AI 政策和 issue／PR 模板；文件不存在就沿 README 找等价入口。
确认项目是否接这类贡献、AI 使用与披露要求、谁须本人写或提交、是否需要先讨论／批准。
查 issue 最新讨论、关联 PR 与当前目标分支，按行为而非文件名判断问题是否已解决。
返回一个具体下一步及原文依据：实现、补验证、协调重叠、本人处理准入，或收起重复补丁。
若可以实现，列出最小复现、改动范围、项目现有检查命令；不要创建 issue／PR 或签协议。
规则沉默或访问失败就保留未知，不把它补成允许。
```

## 按项目的门槛选路

| 现在遇到的情况 | 下一步 | 怎样知道这一步完成 |
|---|---|---|
| 接受这类修复，允许直接提 PR | 复现问题，做单一目的补丁，补回归并运行项目要求的检查 | 能说明失败输入、修复行为和检查结果，diff 没有无关变化 |
| 要求先讨论／批准方案，或 issue 到 `Ready` 才可实现 | 沿现有 issue／discussion 取得所需决定 | 对应方案或任务状态满足规则；open、标签和 bot 回复不能代替批准 |
| 不接外部代码贡献 | 按项目允许的入口贡献诊断、复现或设计反馈 | 材料补充了缺失证据，而不是另一份被禁止的代码投稿 |
| 要求本人写、签 CLA／DCO 或完成准入 | Agent 只整理允许的事实材料，本人完成专属步骤 | 规则要求的本人行动确已完成；不把 AI 草稿换署名当成本人写作 |
| 已有同题修复或提案 | 对比行为覆盖，收起重复部分或协调剩余差量 | 说清还缺什么；提案不等于已修复，main 已修也不等于 release 已发 |
| 工具发出失败或结果未知 | 先查远端是否已生效；明确拒绝只停该动作 | 分清“没发出”“已创建”“维护者拒收”，不重复投稿或绕权限 |

## 从主流 AI coding 项目借用什么

**先读贡献入口，再分配 Agent 工作，不为所有项目套同一个审批流程。** OpenAI Codex 接受问题复现、根因和设计讨论，但不接受外部代码贡献；Goose 的外部 PR 要对应看板 `Ready` issue，允许 AI 辅助代码，而 issue 须贡献者自己写。这两条会直接改变“让 Agent 去修”之前应做的事。

**项目允许小修直投，就把时间花在可审查的补丁上。** Serena 允许小修直接提 PR，要求认真审查或实际测试 AI 辅助贡献，并有覆盖整个仓库的 CLA。不要额外等一次通用预审批，也不要把“CLA 尚未签”误写成“GitHub 无法创建 PR”；协议是本人决定，技术准备可以独立完成。

**披露参与方式，贡献者承担解释和后续责任。** 披露工具做了什么、自己怎样检查；若目标项目有专门格式，按它填写。不能让 Agent 代替本人完成项目明确要求的人类写作、签署或责任声明。项目没要求某个统一标签，也不应照搬另一项目的标签。

来源：项目维护者的固定贡献规则：[Codex](https://github.com/openai/codex/blob/67f0994b532b8740f14b5b738af7b7b2a915b1d6/docs/contributing.md)（核实 2026-10-31）；[Goose](https://github.com/aaif-goose/goose/blob/6ec4e9a2abc0fdb13f8af2676ceaf848a1df716f/CONTRIBUTING.md)及 [AGENTS 的探索例外](https://github.com/aaif-goose/goose/blob/6ec4e9a2abc0fdb13f8af2676ceaf848a1df716f/AGENTS.md#contribution-workflow)、[Serena](https://github.com/oraios/serena/blob/ede329aaf0c824bea75455a2926f01420d7aa620/CONTRIBUTING.md)（核实 2026-10-30）。这些来源支持操作选择，投稿前仍读目标项目最新规则。

## 实现到投稿：让 Agent 产出可审材料

1. **先固定失败，再写最小修复。** 用真实输入复现，明确预期输出和兼容契约；让 Agent 解释根因、改动与回归测试的对应关系。沿项目现有测试布局、可选依赖和 Python／OS 矩阵，不把自己机器能跑的脚本直接当上游测试。
2. **核当前分支上的行为，不只看补丁能否合并。** 有旧候选时检查实际 merge-base、目标分支和关联 PR；PR 元数据的 base tip 不是旧分支起点。文本无冲突也要补受影响的跨功能回归。仅获快进授权时，合并上游后补交，不擅自 rebase 或强推已发布历史。
3. **按目标模板写可核的说明。** 一个 PR 说明问题、关键取舍、实际运行的命令／版本／结果及影响使用的风险；长日志按需链接。自己应能解释整个 diff，验证方法见[验证页](verification.md)。已有测试若版本与行为未变可复用；受变动影响的路径要补跑，不能把旧通过记录移作新版证据。
4. **获准后投稿，并持续处理实际反馈。** 先查同题 PR，避免重复；读维护者意见再决定修正或解释，不让 Agent 自动接受每条评论。准入问题靠对应准入步骤解决，代码问题靠修复和测试解决；接收 PR、合并和后续维护是不同结果。

上述做法中的准入不是形式要求：Goose 的 [#11322](https://github.com/aaif-goose/goose/pull/11322) 曾因缺 `Ready` issue 关闭，作者补充后重开并合并；[Windows 安装器讨论](https://github.com/aaif-goose/goose/issues/11987#issuecomment-6029897376)还明确要求后续维护承诺。这些是维护者实际接收决定，不是“多跑一次测试就会放行”。来源核读 2026-10-30。

## 何时不走这条路线

**项目明确不接这类贡献、已有同等修复，或没人能理解和承担后续时，不再向评审队列增加生成代码。** 先交自己的可用产品结果，或按项目允许的方式补充问题证据。`403` 应结合响应判断工具权限，结果未知先回读；明确拒绝不换账号或通道绕过。项目允许投稿不等于工具已有写权限。

[历史候选、旧版读者回执与验证边界](https://github.com/dbvv1/a1dbv/blob/f06519e9f980ef1053252e79120e15035a278e1c/docs/decisions/upstream-contributions.md)：自家实验及个例仅作历史证据；当前页未完成新版全文的独立读者实做与完整投稿闭环，保持 🟡。

````
