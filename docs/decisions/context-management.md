# 上下文怎么管，会话越聊越笨怎么办

**🟡 同题正常推进，沿用原生压缩；换成无关任务或旧方案纠正后仍反复出现，带短检查点新开；恢复先核最新约束与下一步。** 缺信息先重读必要原文，环境和权限缺口先解决；不按固定轮数或百分比清空，也不先装记忆服务。原生压缩与新会话接续仍待真实本机读者验证。

## 第一步：给任务入口，让 Agent 按需找原文

**说清目标、保留行为和起点，沿实现与检查补足信息。** 下面这项本仓任务可直接照做；换项目时换目标与入口。

```text
核对本仓文档检查器是否检查 Markdown 链接里的 #锚点；不修改检查器。
遵守项目指令，从 scripts/check_repo.py 和 tests/test_check_repo.py 入手。
先看链接解析实现与相关用例，缺信息再扩大搜索。
交回支持范围、源码位置、实际验证命令和结果，不把检查通过报成所有链接均有效。
```

从仓库根目录运行 `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v`，已验证 9 项通过。`check()` 与 `test_existing_and_external_links` 表明：本地链接仍检查文件路径是否存在，但不验证 `#` 后的锚点；纯 `#锚点` 和外链跳过。这个实例验证检查器行为，未测上下文收益；全量迁移或审查仍须按依赖扩大覆盖。

**依据**：[官方／团队实践] [OpenAI 按任务路由](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)、[Cursor 按需取回及撤掉强制探索委派](https://cursor.com/blog/improved-token-efficiency)，核实 2026-10-26；[检查器](../../scripts/check_repo.py)与[测试](../../tests/test_check_repo.py)，复跑 2026-10-28。常驻规则见[指令文件](instruction-files.md)，委派与在途任务见[长任务](long-tasks.md)。

### 指定了页面版本：读取那一版，不用工作树同名文件替代

**任务指定文档版本，或附入正文应与某版一致时，先核内容版本，再按它行动。** 分支／标签会移动，先用 `git rev-parse --verify '<ref>^{commit}'` 得到提交；克隆后若没有同名本地分支，确认仓库与远端后改查 `refs/remotes/origin/<分支>`（远端不叫 origin 时替换名称）。需要当前远端版本时，先按已有权限 fetch，再固定提交；只读已有跟踪 ref 就保留这一观察范围。随后用 `git show '<提交>:<文件路径>'` 读该版。工作树 HEAD 与页面版本可以不同，保留两者；普通任务只需当前文件时，不增加这一步。

例如，本仓一次上下文读者任务引用的页面分支解析到下列提交，而任务工作树使用另一提交。已有实际附入正文文件 `received-page.md` 时，可在同一仓库比较内容标识：

```bash
git rev-parse 'd0b9651b5db9039975d1abde4efe8f0cfd3a43b8:docs/decisions/context-management.md'
git hash-object --no-filters received-page.md
```

两值相同表示文件字节一致；不同则对照固定原文，分清换行／消息包装变化与正文版本变化。`received-page.md` 应从实际收到的正文保存；拿不到附入内容就记“输入版本未核”，保留继续所需的输入。仅在工作树找到同名文件，不能确认附入的是它；引用位置也按所读页面计算，不拿整张任务卡的行号指代页面行号。

**依据**：[Git 固定版本与对象定位](https://git-scm.com/docs/git-rev-parse)、[不经过过滤器的内容标识](https://git-scm.com/docs/git-hash-object)；[固定页面](https://github.com/dbvv1/a1dbv/blob/d0b9651b5db9039975d1abde4efe8f0cfd3a43b8/docs/decisions/context-management.md)。2026-10-30 实跑同版／异版文件对照；检查只确认提供的文件内容，接收端附文与模型实际加载仍按可观察证据判断。

## 已经变笨：按症状选动作

| 眼前发生了什么 | 现在怎么做 |
|---|---|
| 漏约定、引用旧文件 | 重读当前权威文件与调用方，指出被取代的决定；压缩不能补回从未读过的事实 |
| 搜索为零，却知道源码存在 | 核客户端版本、工作树／HEAD 和忽略规则；搜索已知文件里的符号，与直接读取对照。确认获准读取且没有有意排除后，才对该文件用 shell `grep` 复核；权限拒绝不换入口绕过 |
| 同题正常推进，历史占空间 | 沿用自动压缩；手动压缩时保留最新约束、失败测试、已排除方案与下一步，压缩后核对 |
| 压缩完又满、不停全量重读 | 查大文件、工具输出与启动加载项，缩小实际纳入范围；日志保留错误段和文件入口。只分块却仍读全量，不能减少总量；必要的全量审查仍须覆盖 |
| Repomix 分块包每次重打都变大 | 核包内是否收入自己的旧编号分片；正式版 1.18.1 有这条回流路径。用干净输入并把产物放树外，已有旧分片先确认再精确排除；[CLI 实跑与版本选择](../../experiments/repomix-split-input/README.md) |
| 无关新任务，或纠正后仍回到旧方案 | 保存下节检查点，用当前目标和已排除方案写新提示，开新会话 |
| 读图后占用突增、提前压缩 | 先记客户端版本、模型和触发输入；Cline 相符症状核是否含 #14520 修复（4.1.24 已含）。只对照同一请求，按提供方定义核客户端估算与服务端 input／缓存口径；配不齐就记未知；费用查账单，不凭估算调低阈值 |
| 同轮改过规则，压缩后又读旧内容 | Claude Code 2.1.311 修复了 `CLAUDE.md`／`MEMORY.md` 旧副本路径；旧版显式重读，含修复版在下次自然压缩后核新内容，不降低阈值造试验 |
| 压缩报错或断流，旧会话无法继续 | 保留原会话与工作区；先核 diff、在途操作和已返回结果，再接剩余步骤，别因缺完成回复重做写入 |

**压缩还是重开，取决于下一步需要的事实与理由。** Anthropic 团队曾为 Sonnet 4.5 的提前收尾采用检查点重开，换到 Opus 4.5 后撤掉重开、沿用 SDK 自动压缩；Claude 官方建议同一错误两次纠正仍复发时改用新提示重开。社区同时存在清空和持续压缩的成功自述，没有同条件对照，不设跨模型统一阈值。

**依据**：[团队实作](https://www.anthropic.com/research/harness-design-long-running-apps)、[Claude 会话引导](https://code.claude.com/docs/en/best-practices#steer-the-session)、[社区 clear／compact 正反经验](https://www.reddit.com/r/ClaudeCode/comments/1x0jmvm/when_do_you_use_clear_vs_compact_in_your_daily/)，核实 2026-10-28。

**检索依据**：[Cursor 历史漏检及官方确认](https://forum.cursor.com/t/agents-grep-glob-tools-silently-return-zero-results-inside-any-cursor-managed-worktree/160373)、[忽略规则误诊](https://forum.cursor.com/t/agent-editing-files-with-shell-python-permission-denied-from-read-and-strreplace-tools-when-using-git-worktrees/155500/10)与[忽略规则](https://cursor.com/docs/reference/ignore-file)，核实 2026-10-28；本仓 `rg`／`grep` 阳性对照与直接阅读一致，未实测 Cursor，历史故障修复版本未知。

**重载依据**：[Claude 旧副本修复](https://github.com/anthropics/claude-code/blob/08c6a4f5121ae140d3c1b5c96e3e5ae53587b54b/CHANGELOG.md#L12)与[旧版反馈](https://github.com/anthropics/claude-code/issues/92949#issuecomment-6119121589)，核实 2026-10-27、未实跑；[AOCI 全量重读核查](../research/2026-10-26-context-reload-scope.md)与[断流反馈](https://github.com/openai/codex/issues/53653)，核实 2026-10-26、未复现客户端故障。

**图片估算依据**：[Cline 修复](https://github.com/cline/cline/pull/14520)、[4.1.24 发布](https://github.com/cline/cline/releases/tag/v4.1.24)、[同请求与缓存口径](https://github.com/cline/cline/issues/14979)、[本仓固定源码离线对照](../collaboration/inbox.md#cline-image-token-estimate)，核实 2026-10-28。v4.1.20／v4.1.24 相同文本加一张 192×128 合成 PNG 的请求估算为 32,926／1,662；正常路径的 1,600 token／图是内部定额，文本仍按字符估算。真实压缩时机、恢复质量及服务端用量待验。

## CLI 命令：压缩、新开和恢复分开用

以下在 **CLI 会话内**输入，不是 shell 命令；其他客户端看其 `/` 菜单。

| 目的 | Claude Code | Codex CLI |
|---|---|---|
| 看上下文 | `/context` 看分类与加载来源 | `/status` 看上下文／token 信息 |
| 同题腾空间 | `/compact 保留目标、最新约束、撤回要求、已验结果、失败测试、已排除方案和下一步` | 先用普通消息写下节检查点，再 `/compact` |
| 开干净会话 | `/clear` | `/new`；`/clear` 也开新聊天并清终端显示 |
| 回旧会话 | `/resume` | `/resume`，或 shell 的 `codex resume` |

新会话保留工作区改动；resume 和 fork 带旧历史，不能借它们丢掉旧假设。Codex `/recap` 只回顾摘要。

**默认自动压缩够用就不调；确曾手改时再恢复：**
- Claude 支持 `/autocompact` 的版本可用 `/autocompact auto`（v2.1.221 起，会保存设置）；被环境变量或更高优先级设置覆盖时，先核覆盖来源。
- Codex 撤回随意添加的 `model_auto_compact_token_limit`，未设置时用模型默认；`model_context_window` 须与实际服务能力一致。

**依据**：[Claude 命令](https://code.claude.com/docs/en/commands)与[压缩配置](https://code.claude.com/docs/en/model-config#set-the-auto-compact-window)、[Codex 命令](https://learn.chatgpt.com/docs/developer-commands)与[配置](https://learn.chatgpt.com/docs/config-file/config-reference)，核实 2026-10-26；命令按文档核对，原生压缩与重开尚未在真实编码任务实跑。

## 跨压缩或新会话：检查点保留下一步用得上的内容

复用现有任务记录，短任务直接留交接消息；只写已有事实，不保存密钥或私人对话全文。

```text
请更新检查点，供下一次继续：
1. 当前目标、完成条件、最新约束（尤其禁改范围）、取消或被取代的要求。
2. 仓库、分支、基线 commit；未提交修改及位置。
3. 已确认事实、关键决定与排除旧方案的理由；可重读的文件／符号／结果入口。
4. 已运行命令、结果与适用版本；失败、未运行分别列明。
5. 在途任务／外部操作的 ID 和状态；未知结果先标待查询。
6. 下一步具体动作，尚缺输入或授权。
```

**恢复时要求实际读取检查点与当前项目指令，先核最新约束和撤回项，再核 Git 状态、diff、产物与在途结果。** 冲突先查变化，未知写入先查状态。接续合格看三件事：限制仍遵守；下一步有证据入口；没有重复已完成或结果未知的写入。

普通 Markdown 不会自动加载：Claude `@文件` 可引入内容，Codex `@` 文件选择主要加入路径，仍要明确要求读取；Claude 压缩后也可能只留下大文件的 `Referenced file` 路径，应核实际内容。检查点并不保证摘要无损。

**依据**：[Codex 固定压缩提示](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/prompts/templates/compact/prompt.md)、[Claude 引用](https://code.claude.com/docs/en/best-practices#provide-rich-content)与[压缩重载](https://code.claude.com/docs/en/context-window#what-survives-compaction)、[Codex 文件入口](https://learn.chatgpt.com/docs/developer-commands#interactive-shortcuts)、[既有恢复包](../20-codex-long-horizon.md#4-恢复包必须包含最新任务而非最长历史)，核实 2026-10-26。

**优先核限制：任务得分稳定，摘要仍可能丢掉工作方法和禁改范围。** [10 月压缩研究](https://arxiv.org/html/2610.31778v1) §4.2／§5 与[改造版 OpenCode](https://github.com/aisa-group/compaction/blob/main/docs/COMPACTION.md)，核实 2026-10-28。该研究的任务实验仅含少量任务及 Opus 4.6、GPT-5.3-Codex、GPT-5.4 等模型，1M 模型只用到窗口的 16%–38%；44 条真实会话用 LLM 判分，未测约束丢失对最终结果的影响。本仓未复现，不据此设通用阈值。
