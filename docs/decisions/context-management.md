# 上下文怎么管，会话越聊越笨怎么办

**🟡 同题正常推进，沿用原生压缩；换成无关任务或旧方案纠正后仍反复出现，带短检查点新开；恢复先核最新约束与下一步。** 缺信息先按当前任务重读必要原文，别把所有退化都当成“上下文太多”。自动压缩正常时沿用默认，不按固定轮数或百分比清空，也不先装记忆服务。

## 第一步：给任务入口，不给整仓资料包

**说清要解决什么、保留什么，以及从哪里开始；让 Agent 沿实现和检查补足上下文。** 例如下面这段可直接用于本仓，换项目时替换目标和入口：

```text
请核对文档检查器是否检查 Markdown 链接里的 #锚点。
遵守项目指令，从 scripts/check_repo.py 和 tests/test_check_repo.py 入手，
先读链接解析实现与相关用例；遇到缺失依赖再扩大搜索。
交回支持范围、决定性源码位置，以及实际运行的验证命令和结果。
这是只读核查，不修改检查器，也不把“检查通过”写成所有链接均有效。
```

这个任务只需沿 `check()` 与 `test_existing_and_external_links` 看清：检查器核本地文件是否存在，**不核 `#锚点` 或外链**。入口、用例和输出足以决定下一步，无需先读所有文档。已运行以下命令，9 项测试通过；这一实例验证的是检查器行为，模型上下文收益未试用。

```sh
python3 -m unittest discover -s tests -p 'test_check_repo.py' -v
```

OpenAI 的当前提示实践也把“每次编辑前读完所有文档”改为按服务边界、数据库、部署等任务路由。Cursor 团队则撤掉强制鼓励探索委派的提示，保留高频读、搜、改工具。**借的是按需取回，不是把必要约束删光或每次搜索都交给子 Agent。** 常驻项目规则怎么写，见[指令文件](instruction-files.md)；大型独立调查怎么拆，见[长任务](long-tasks.md)。

**依据**：[官方／团队实践] [OpenAI 按任务路由](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)、[Cursor 的上下文与委派调整](https://cursor.com/blog/improved-token-efficiency)，核实 2026-10-26；[本仓实跑] [检查器](../../scripts/check_repo.py)与[9 项测试](../../tests/test_check_repo.py)，复跑 2026-10-28。跨任务最优上下文量仍未知；不沿用厂商组合改动的收益数字。

## 已经变笨：按症状选动作

| 眼前发生了什么 | 现在怎么做 |
|---|---|
| 漏了接口约定、拿旧文件说事 | 重读当前权威文件与相关调用方；指出被取代的旧决定。压缩无法补回从未读过的事实 |
| 搜索为零，却知道相关源码存在 | 核工作树与忽略规则，再用已知符号做下文的阳性对照；先别据此重复实现 |
| 读图后 token 占用突然暴涨、很快触发压缩 | 先核客户端版本与数字来源，按下文区分内部估算和服务端 usage；不要仅凭占用提示清空历史 |
| 同一任务还在正常推进，只是历史占空间 | 沿用自动压缩；需要手动腾空间时，指定保留最新约束、失败测试、已排除方案与下一步，压缩后核对 |
| 压缩完马上又满，或不停全量重读 | 查最大的文件、工具输出和启动加载项，缩小**实际读入范围**；日志保留错误段与原文件位置，不逐轮灌回全文 |
| 已换成无关任务，或明确纠正后仍不断回到旧方案 | 先保存下节的检查点，再以当前目标和已排除方案写新提示开会话；从当前文件恢复 |
| 压缩报错、断流，旧会话无法继续 | 保留原会话与工作区，先核当前 diff、在途操作及已返回结果，再从已核状态接续；别因缺一句完成回复重做写入 |

**重开用来摆脱持续误导的旧思路，不是每个模型都需要的固定仪式。** Anthropic 团队的长程应用实践中，Sonnet 4.5 会因自认为接近窗口上限而提前收尾，压缩不足以解决，团队采用检查点加重开；换到 Opus 4.5 后撤掉重开，整次构建改用 Agent SDK 自动压缩。当前 Claude Code 官方也建议：同一错误纠正两次仍复发时，用吸收教训的新提示重开。前者是团队实作报告，后者是操作建议，不能据此为其他模型设统一阈值。

社区对两种做法仍有分歧：Reddit 原帖有人每完成一个任务就清空，也有人自报 Opus 5.5 的协调任务靠压缩持续运行；反对压缩者担心丢掉“试过什么、为什么放弃”。可借的是**按下一步是否依赖这些理由来选择**，并在压缩或交接中明确保留它们。原帖没有同条件任务对照，个人百分比和赞数不作为默认配置依据。

**依据**：[官方／团队实践] [Anthropic 长程应用的重开撤回](https://www.anthropic.com/research/harness-design-long-running-apps)、[Claude Code 会话引导](https://code.claude.com/docs/en/best-practices#steer-the-session)；[社区原帖] [clear 与 compact 的正反使用经验](https://www.reddit.com/r/ClaudeCode/comments/1x0jmvm/when_do_you_use_clear_vs_compact_in_your_daily/)，核实 2026-10-28。

### 搜索为零：先确认检索入口看得见

**用同一工作树中已知存在、获准读取的源码做阳性对照。** 记下客户端版本、当前目录与 HEAD，先核忽略规则，再搜索指定文件里的已知符号并直接读取核对。文件可读、搜索却漏掉时，暂停“实现不存在”的判断；确认没有访问限制后，仅对该文件用 shell `grep` 复核，保留结果排查客户端，不先清空历史或重派 Agent。遇权限拒绝或有意排除则先处理授权，不换 shell 绕过。

Cursor 3.3.30／macOS 用户曾报告 worktree 内 Grep／Glob 返回零结果，而 Read 与 shell 搜索可见，子 Agent 也受影响；官方支持确认当时的索引问题。另一个用户起初也认为是客户端故障，最后发现排除 worktree 的 `.cursorignore` 规则才是原因。**零命中要分清工具故障、范围限制与真实不存在。**

**依据**：[历史用户报告与官方确认](https://forum.cursor.com/t/agents-grep-glob-tools-silently-return-zero-results-inside-any-cursor-managed-worktree/160373)、[忽略规则误诊的最终回执](https://forum.cursor.com/t/agent-editing-files-with-shell-python-permission-denied-from-read-and-strreplace-tools-when-using-git-worktrees/155500/10)、[当前官方忽略规则](https://cursor.com/docs/reference/ignore-file)；核实 2026-10-28。本仓未试用该排障流程，也未核实历史故障的修复版本，不据此判断当前客户端受影响。

### 读图后提前压缩：先查客户端估算

**先记实际客户端版本、模型和触发输入，再判断该换版本还是减材料。** Cline 的图片 base64 曾被按文本长度计入压缩估算；相符症状优先核是否含 #14520 修复（已进入 4.1.24 发布源码），保留自动压缩设置。单纯占用数字异常查估算路径；已经漏掉目标、约束或接口契约，则按上表重读当前原文。

本仓直接运行 Cline v4.1.20／v4.1.24 固定源码：相同文本加一张 192×128 合成 PNG，**请求估算从 32,926 变为 1,662**，纯文本保持 45。修复后的正常路径按识别出的图片另加 1,600 token／图内部定额；它验证的是估算算法变化，真实客户端何时压缩、任务恢复质量和服务端用量仍待实跑。

**需要查差额时，只对照同一次请求。** 把客户端估算和服务端返回的 input／缓存字段分开记录，先按该提供方的定义核输入总量；字段或配对缺失就记未知，不拿“当前请求估算”除以“上一请求 usage”调低阈值。费用查服务商账单，1,600 定额只用于客户端估算；文本仍按字符启发式计数。

**依据**：[使用者原帖 #14512](https://github.com/cline/cline/issues/14512)、[官方修复 #14520](https://github.com/cline/cline/pull/14520)与[4.1.24 发布说明](https://github.com/cline/cline/releases/tag/v4.1.24)、[固定请求估算实现](https://github.com/cline/cline/blob/ed469c753a0d7a0d41f906cf3fc75a983cd766ac/sdk/packages/shared/src/llms/tokens.ts)、[后续报告与缓存口径说明](https://github.com/cline/cline/issues/14979)、[本仓离线对照与边界](../collaboration/inbox.md#cline-image-token-estimate)；核实与离线复跑 2026-10-28 UTC。

### 压缩后旧内容回来：核重载行为

**同一长轮次改过 `CLAUDE.md`／`MEMORY.md`，自动压缩后又读到旧内容，先核客户端版本。** Claude Code 2.1.311 已修复这条旧副本路径；旧版显式重读当前文件，含修复的版本在下一次自然压缩后核对新内容，再接原任务。先不叠加记忆注入插件，也不人为降低压缩阈值制造试验。

**依据**：[官方修复](https://github.com/anthropics/claude-code/blob/08c6a4f5121ae140d3c1b5c96e3e5ae53587b54b/CHANGELOG.md#L12)、[旧版用户对照 #92949](https://github.com/anthropics/claude-code/issues/92949#issuecomment-6119121589)；核实 2026-10-27，本仓未实跑该客户端修复，保留现有原生压缩待验状态。

**全量资料读不完时，切小块可能仍无效。** AOCI 的公开故障中，压缩后合同要求重读整份索引，分块只改每次响应大小，总量没变。遇到这类工具，要沿其范围配置减少实际纳入材料；任务不需要全量索引时，明确改走源码定位。仍要求全量审查的任务则保留完整覆盖，不能把局部读取报成全量完成。

**依据**：[官方] [Claude 压缩循环排障](https://code.claude.com/docs/en/troubleshooting#auto-compaction-stops-with-a-thrashing-error)；[社区原帖] [AOCI #114 与维护者回复](https://github.com/aoci-spec/aoci-code/issues/114)、[Codex 长会话断流／已改文件但回复失败](https://github.com/openai/codex/issues/53653)；[既有证据] [17 排障分流](../17-troubleshooting.md#26-越聊越笨上下文腐化与压缩丢失)、[全量重读源码核查](../research/2026-10-26-context-reload-scope.md)，核实 2026-10-26。公开故障是特定环境的自述，本文未复现这些客户端故障。

## Claude Code 与 Codex：别把命令和加载语义混用

以下是 **CLI 会话内命令**，不是 shell 命令；其他客户端以其 `/` 菜单为准。

| 目的 | Claude Code | Codex CLI |
|---|---|---|
| 看当前上下文 | `/context` 看分类与加载来源 | `/status` 看当前上下文／token 使用信息 |
| 同题腾空间 | `/compact 保留当前目标、兼容与禁改约束、已撤回要求、已验证结果、未完成检查、已排除方案和下一步；省略长日志` | `/compact`；需要指定接续内容时，先用普通消息要求写出下节检查点，再压缩 |
| 开干净会话 | `/clear` | `/new`；`/clear` 也开新聊天，同时清终端显示 |
| 回原来的会话 | `/resume` | `/resume` 或终端 `codex resume` |

**新会话不等于干净工作区。** 文件修改与外部操作仍要核对；resume 会取回旧历史，fork 也会带旧历史，二者都不适合用来丢掉旧假设。Codex `/recap` 是回顾摘要，要腾上下文用 `/compact`。

**先保留自动压缩默认值。** 已经手动调乱时再恢复：

- **Claude Code**：支持 `/autocompact` 的版本可运行 `/autocompact auto` 回到模型调优窗口（命令自 v2.1.221 起提供）。它会保存设置；若提示被环境变量或更高优先级设置覆盖，先核覆盖来源。
- **Codex**：`model_auto_compact_token_limit` 未设置时使用模型默认。检查实际生效配置，撤回自己为“防变笨”随意加入的阈值；不要把 `model_context_window` 填大当成获得了服务端更大容量。确有网关／模型容量差异时，按实际能力配置。

**依据**：[官方] [Claude 命令](https://code.claude.com/docs/en/commands)、[自动压缩窗口及覆盖关系](https://code.claude.com/docs/en/model-config#set-the-auto-compact-window)、[Codex 命令](https://learn.chatgpt.com/docs/developer-commands)、[Codex 配置](https://learn.chatgpt.com/docs/config-file/config-reference)，核实 2026-10-26。命令与配置按文档核对；本页的原生压缩和换会话步骤尚未在真实编码任务中运行，暂列候选。

## 要跨压缩或新会话：保存下一步能用的检查点

**复用现有任务记录，保留当前事实与理由，而不是整段聊天。** 只在确实需要跨会话继续时保存；短任务直接把内容放在交接消息里即可。可复制给当前 Agent：

```text
请在现有任务记录中更新一份简短检查点，供下一次继续：
1. 当前目标与完成条件；最新约束（尤其禁改范围）、取消或已取代的要求。
2. 仓库、分支、基线 commit；尚未提交的修改及其位置。
3. 已确认事实、关键决定及排除旧方案的理由；已有记录只给文件／符号／结果入口。
4. 已运行检查、实际结果及适用版本；失败与未运行项分开。
5. 在途任务／外部操作的 ID 和状态；结果未知的先标记待查询。
6. 下一步具体动作，以及尚缺的输入或授权。
只写已有证据，不补造成功结果，不保存密钥或私人对话全文。
```

比如上面的只读核查，可以留成这样一段，而不是“研究完成，继续优化”：

```text
目标：确认 check_repo.py 的链接验证范围；不修改检查器。
证据入口：scripts/check_repo.py 的 check()，以及
tests/test_check_repo.py 的 test_existing_and_external_links。
已确认：本地文件存在时，即使 #missing-anchor 不存在也不会报错；外链跳过。
已验证：test_check_repo.py 的 9 项 unittest 通过。
下一步：对需要交付的文档运行 python3 scripts/check_repo.py；
其中的锚点、外链及事实仍需单独核查，不能只凭 errors=[] 宣布全部有效。
版本：交接时填写当前 commit 与差量；上述检查只对应实际受检文件。
在途写入：无，本例只读。
```

**恢复先核最新约束，尤其禁改范围与撤回要求，再核当前进度；明确要求“读内容”，不能只留下文件名。** 代码和测试能重读，临时说过的限制若只剩旧摘要，可能再也找不回来。在压缩后或新会话贴入检查点，或把下面的路径换成实际任务记录：

```text
请实际读取 [任务记录路径] 中的最新检查点与当前项目指令。
先核当前目标、最新约束（尤其禁改范围）、已取消或替代的要求，再查看 Git 状态与相关 diff。
从源码／结果入口核对已完成项、在途操作和下一步；结果未知的操作先查状态。
若记录与当前文件冲突，先查明变化；沿剩余动作继续，不重做已确认的写入。
```

**接续成功要看三件事：** 最新限制仍被遵守；能指出下一步及其证据入口；没有重复已完成或结果未知的写入。10 月的压缩研究发现，部分任务分数保持平稳时，摘要仍会丢掉工作方法和禁改范围。任务实验使用改造版 OpenCode、少量任务及 Opus 4.6、GPT-5.3-Codex、GPT-5.4 等模型，1M 模型仅测到窗口的 16%–38%；另以 LLM 判分检查 44 条真实会话，未测约束缺失对最终结果的影响。这支持优先核限制，通用最佳压缩阈值仍未知。

**依据**：[原始研究] [Benchmarks Are Surprisingly Compaction-Friendly](https://arxiv.org/html/2610.31778v1) §4.2、§5；[公开实现] [研究用 OpenCode 配置](https://github.com/aisa-group/compaction/blob/main/docs/COMPACTION.md)，核实 2026-10-28；本仓未复现该研究，真实本机读者的跨压缩／新会话接续待验。

普通 Markdown 检查点没有自动加载特权。Claude 的提示中 `@文件` 可引入文件；Codex 的 `@` 文件选择主要把路径加到提示，仍应明确要求读取。Claude 压缩后也可能只保留大文件的 `Referenced file` 路径；关键契约是否仍可见，要按实际内容核对。常驻规则及导入写法留在[指令文件页](instruction-files.md)，不把临时任务状态塞进根规则。

这与 Codex 开源压缩提示的做法一致：它要求保留进度、决定、约束、下一步和关键资料。可借其中的 **“What remains to be done (clear next steps)”**，无需替换内建压缩提示或安装同步器。

**依据**：[一手／开源实现] [Codex 固定压缩提示](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/prompts/templates/compact/prompt.md)，与当日 main 正文一致；[官方] [Claude 文件引用](https://code.claude.com/docs/en/best-practices#provide-rich-content)、[压缩后重载范围](https://code.claude.com/docs/en/context-window#what-survives-compaction)、[Codex 文件引用入口](https://learn.chatgpt.com/docs/developer-commands#interactive-shortcuts)；[既有做法] [20 恢复包](../20-codex-long-horizon.md#4-恢复包必须包含最新任务而非最长历史)，核实 2026-10-26。检查点是本仓做法的简化，不是保证摘要无损的产品功能。

## 何时不适用

- **缺的是环境、权限或明确需求**：先补真实缺口；换会话不会让缺失的依赖或授权出现。
- **必须看全量才能判断的迁移、架构或审查**：按依赖扩大阅读。按需读取的目标是读对资料，不是固定少读几份。
- **当前会话工作正常**：继续完成即可；已有任务记录能恢复，就不另建长期记忆层。真正需要委派、接回在途任务或检查 CI，转到[长任务页](long-tasks.md)。

V2EX 有使用者报告频繁压缩，随后同时禁用意外加载的 Skills／Plugins 并更换大窗口模型，体验改善。这里最有用的提醒是**先查实际装入了什么**；因为同时改了多项，不能据此判断是哪项有效，更不能推出“都换大窗口”。

**依据**：[社区原帖] [V2EX：频繁压缩与实际加载项](https://v2ex.com/t/1241320)，核实 2026-10-26；更广的上下文量、检索与记忆比较见 [03](../03-context-engineering.md)。
