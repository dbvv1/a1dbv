# 上下文管理：个例与验证范围

本页从答案页下沉既有证据，不新增实验或刷新来源核实日。通行操作见[上下文管理](../decisions/context-management.md)。这些局部验证不证明当前答案页的原生压缩／新会话核心推荐已实测。

## 固定输入版本

### 指定了页面版本：读取那一版，不用工作树同名文件替代

**任务指定文档版本，或附入正文应与某版一致时，先核内容版本，再按它行动。** 分支／标签会移动，先用 `git rev-parse --verify --end-of-options '<ref>^{commit}'` 得到提交；克隆后若没有同名本地分支，确认仓库与远端后改查 `refs/remotes/origin/<分支>`（远端不叫 origin 时替换名称）。需要当前远端版本时，先按已有权限 fetch，再固定提交；只读已有跟踪 ref 就保留这一观察范围。随后用 `git show '<提交>:<文件路径>'` 读该版。工作树 HEAD 与页面版本可以不同，保留两者；普通任务只需当前文件时，不增加这一步。

例如，本仓一次上下文读者任务引用的页面分支解析到下列提交，而任务工作树使用另一提交。已有实际附入正文文件 `received-page.md` 时，可在同一仓库比较内容标识：

```bash
git rev-parse 'd0b9651b5db9039975d1abde4efe8f0cfd3a43b8:docs/decisions/context-management.md'
git hash-object --no-filters received-page.md
```

两值相同表示文件字节一致；不同则对照固定原文，分清换行／消息包装变化与正文版本变化。`received-page.md` 应从实际收到的正文保存；拿不到附入内容就记“输入版本未核”，保留继续所需的输入。仅在工作树找到同名文件，不能确认附入的是它；引用位置也按所读页面计算，不拿整张任务卡的行号指代页面行号。

**依据**：[Git 固定版本与对象定位](https://git-scm.com/docs/git-rev-parse)、[不经过过滤器的内容标识](https://git-scm.com/docs/git-hash-object)；[固定页面](https://github.com/dbvv1/a1dbv/blob/d0b9651b5db9039975d1abde4efe8f0cfd3a43b8/docs/decisions/context-management.md)。2026-10-30 实跑同版／异版文件对照；2026-11-04 按 Git 官方建议加入 `--end-of-options`，本仓复验 HEAD／远端跟踪 ref 可解析，缺失 ref／选项形输入拒绝；检查只确认提供的文件内容，接收端附文与模型实际加载仍按可观察证据判断。


## 客户端搜索、重载与图片估算

**Cursor 的“零结果”和“拒绝读取”分开排查。** 历史 worktree 帖报告 `Read` 能读、`Grep/Glob` 却为零，工作人员确认搜索索引故障；另一帖中，用户移除 `.cursorignore` 的 `worktree/*` 后文件工具恢复，只是该用户的自报。不要据此统一删除忽略规则。先确认同一工作树、同一文件与符号，再核项目、全局及已启用的父目录忽略规则；有意排除或权限拒绝时停下确认，不改用 shell/MCP 绕过。文档说明这些工具未必受 `.cursorignore` 约束，因此 shell 读得到不能证明 Agent 已获准读取。

**`git check-ignore` 只诊断 Git 规则，不证明 Cursor 没有忽略。** 对已跟踪文件核 Git 模式可用 `git check-ignore --no-index -v -- <文件>`；默认会跳过已跟踪文件，且该命令不会自动加载 `.cursorignore` 或 Cursor 全局设置。返回空结果不等于所有客户端规则均放行。2026-11-04 在新建临时 Git 仓库用两份合成文本实跑：已跟踪且匹配 `.gitignore` 的文件默认不报、加 `--no-index` 报规则；仅匹配 `.cursorignore` 的文件仍不报；已获准的显式文件 `grep` 阳性对照成功，4 项断言通过。此实验只验证 Git／shell 诊断边界，未运行 Cursor，也未验证其历史故障是否修复。[Git 命令范围](https://git-scm.com/docs/git-check-ignore)。

**检索依据**：[Cursor 历史漏检及官方确认](https://forum.cursor.com/t/agents-grep-glob-tools-silently-return-zero-results-inside-any-cursor-managed-worktree/160373)、[忽略规则误诊](https://forum.cursor.com/t/agent-editing-files-with-shell-python-permission-denied-from-read-and-strreplace-tools-when-using-git-worktrees/155500/10)与[忽略规则](https://cursor.com/docs/reference/ignore-file)，2026-11-04 重读两帖与忽略规则文档；所读帖子仍无具体修复版本回执，不能据此断言当前版本仍有故障。本仓原有 `rg`／`grep` 阳性对照与直接阅读一致，本次合成诊断见上；未实测 Cursor。

**重载依据**：[Claude 旧副本修复](https://github.com/anthropics/claude-code/blob/08c6a4f5121ae140d3c1b5c96e3e5ae53587b54b/CHANGELOG.md#L12)与[旧版反馈](https://github.com/anthropics/claude-code/issues/92949#issuecomment-6119121589)，核实 2026-10-27、未实跑；[AOCI 全量重读核查](../research/2026-10-26-context-reload-scope.md)与[断流反馈](https://github.com/openai/codex/issues/53653)，核实 2026-10-26、未复现客户端故障。

**图片估算依据**：[Cline 修复](https://github.com/cline/cline/pull/14520)、[4.1.24 发布](https://github.com/cline/cline/releases/tag/v4.1.24)、[同请求与缓存口径](https://github.com/cline/cline/issues/14979)、[本仓固定源码离线对照](../collaboration/inbox.md#cline-image-token-estimate)，核实 2026-10-28。v4.1.20／v4.1.24 相同文本加一张 192×128 合成 PNG 的请求估算为 32,926／1,662；正常路径的 1,600 token／图是内部定额，文本仍按字符估算。真实压缩时机、恢复质量及服务端用量待验。10-31 补核[原使用者后续回执](https://github.com/cline/cline/issues/14979#issuecomment-6473972321)：旧扩展的 1.2–1.5 倍报告不能套到 CLI；CLI 3.0.73 两次自报约 1.08／1.04 倍，非同负载比较。


## 检查点与 SDK 的证据边界

自己用 SDK 实现接续时，还要分别核 fork 写出的引用与读取接口实际返回的消息。[Claude Agent SDK 的组合接收](../../experiments/claude-session-receipt/README.md)中，单修 fork 或单修 read 均漏掉压缩明确保留的消息；两项已有补丁组合后，disk／内存 store 的 fork→read 才完整。此为公开合成数据的 SDK 实测，真实 CLI／模型接续未验；核实 2026-11-02。

**依据**：[Codex 固定压缩提示](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/prompts/templates/compact/prompt.md)、[Claude 引用](https://code.claude.com/docs/en/common-workflows#reference-files-and-directories)与[压缩重载](https://code.claude.com/docs/en/context-window#what-survives-compaction)、[Codex 文件入口](https://learn.chatgpt.com/docs/developer-commands#interactive-shortcuts)、[既有恢复包](../20-codex-long-horizon.md#4-恢复包必须包含最新任务而非最长历史)，核实 2026-10-26。 Claude 文件引用限额与压缩重读范围于 2026-11-04 复核官方文档；未实跑客户端，不据此提升本页评级。

**优先核限制：任务得分稳定，摘要仍可能丢掉工作方法和禁改范围。** [10 月压缩研究](https://arxiv.org/html/2610.31778v1) §4.2／§5 与[改造版 OpenCode](https://github.com/aisa-group/compaction/blob/main/docs/COMPACTION.md)，核实 2026-10-28。该研究的任务实验仅含少量任务及 Opus 4.6、GPT-5.3-Codex、GPT-5.4 等模型，1M 模型只用到窗口的 16%–38%；44 条真实会话用 LLM 判分，未测约束丢失对最终结果的影响。本仓未复现，不据此设通用阈值。


## Chat Completions 续接的离线实测

**依据与实测**：[官方状态策略](https://github.com/openai/openai-agents-python/blob/1fc77bbc8ac1446690f6ba62dd0d52779bdcf43f/docs/running_agents.md#choose-a-memory-strategy)、[真实使用者 #5454](https://github.com/openai/openai-agents-python/issues/5454)、[Chat 参数校验](https://github.com/openai/openai-agents-python/blob/1fc77bbc8ac1446690f6ba62dd0d52779bdcf43f/src/agents/models/openai_chatcompletions.py#L543-L574)，核实 2026-11-09。本仓在该提交用公开 `Runner`、真实适配器和 HTTP mock 复现上述丢历史，并在普通／流式两种模式验证工具往返后再接一轮用户输入；Responses 的 8 项对照保留原有完整历史／服务端增量语义。测试使用合成消息，未调用在线模型；不证明原生 CLI 压缩或生产接续已修复。

## 输出工具和侧问的局部证据

| 局部症状 | 原有处理建议 |
|---|---|
| RTK 的 uv 失败只剩 warn，却没有恢复提示 | 先核程序日志、产物与操作状态；短输出可能根本没留档。下一次确需执行时用原生输出，已用自动改写者可[只排除外层 uv](../03-context-engineering.md#rtk-uv-short-failure)，不盲目重跑 |
| Repomix 分块包每次重打都变大 | 核包内是否收入自己的旧编号分片；正式版 1.18.1 有这条回流路径。用干净输入并把产物放树外，已有旧分片先确认再精确排除；[CLI 实跑与版本选择](../../experiments/repomix-split-input/README.md) |

**本仓尚未试用这条原生侧问路线，保持候选。** 独立作者在 Cursor 3.22.7 的短对话中验证了父背景取回和 `@` 回传，回传实际读取了会话记录；没有验证运行中不打断、长对话或重启恢复，不据此承诺提效。

**依据**：[官方 Claude `/btw` 的上下文与工具范围](https://code.claude.com/docs/en/interactive-mode#side-questions-with-btw)、[Cursor 侧聊与回传](https://cursor.com/help/ai-features/side-chats)、[3.11 原生入口与默认行为](https://cursor.com/changelog/side-chat)；[独立作者 3.22.7 操作记录](https://dev.classmethod.jp/en/articles/cursor-side-chat-context/)（2026-10-12）、[3.11 云端入口反馈及官方回应](https://forum.cursor.com/t/3-11-side-chats-unavailable-in-cloud-agent-remote-control/165571)（2026-07-13，历史限制）；核读 2026-11-09。


已有[检查器定位](https://github.com/dbvv1/a1dbv/blob/b318ca9ea8525ccb2dd837572823893a99b2dc25/docs/decisions/context-management.md#第一步给任务入口让-agent-按需找原文)与[Graphify 试用](../../experiments/graphify-code-map/README.md)只保留各自验证范围，不证明通用上下文收益。
