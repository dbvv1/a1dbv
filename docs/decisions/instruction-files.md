# CLAUDE.md／AGENTS.md 怎么写

**🟡 多工具项目先在真实任务里试用共享的 `AGENTS.md`：写清真实命令、任务入口、不可猜的契约和完成标准。** 确认当前环境的 Claude Code 已直接加载后，只保留这一份；需要 Claude 专属规则或兼容旧会话时，在同目录 `CLAUDE.md` 导入。只用 Claude、现有 `CLAUDE.md` 已经好用的项目，继续维护原文件。

## 第一步：把四件事填进现有文件

**先看项目的 CI、包配置和已有指令，填入实际能用的入口，而不是让 Agent 生成一份全仓说明书。** 下面是可合并的短骨架；方括号都是待替换项，不是可执行命令。没有的项目删掉，不为凑齐栏目新建流程。

```markdown
## 入口与验证
- 工作目录：[目录]；运行时和包管理器版本以 [权威配置路径] 为准。
- 安装依赖：[实际命令]；当前模块测试：[最小相关测试命令]。
- 提交前检查：[项目规定的检查命令]。

## 任务导航
- 修改 [功能] 时，先读 [实现或文档路径]；这里决定 [具体行为或边界]。

## 契约与完成
- 保留 [兼容行为或领域约定]，因为 [不能从代码直接推知的原因]。
- 完成需看到 [可观察结果]，并报告相关检查的实际结果。
```

命令从当前项目复制并试跑；版本值指向配置，少维护一份会过期的副本。任务导航写“做什么 → 去哪里 → 为什么”，不用展开整棵目录树。更多项目特有项从[现有 AGENTS 模板](../../templates/generic/AGENTS.md)挑选，不整份叠加。

**把已知环境条件写进实际命令，不只放在旁注。** Ruff 的维护者发现，已有沙箱限制说明，Codex 仍先照完整命令跑监听测试；随后把 `-E 'not binary(=file_watching)'` 写进 `cargo nextest run` 命令。此过滤只适用于缺少所需 OS 事件的环境，涉及监听行为的改动仍须在支持事件的环境另验。本仓未运行 Ruff。

**依据**：[一手／真实项目] 下文 Cloudflare 与 Anthropic 文件；[既有证据与取舍](../03-context-engineering.md#23-写什么不写什么官方最佳实践-一手)，原核实 2026-10-24。这里沿用已有模板的写法，跨任务最优篇幅仍未知。Ruff 的[维护者反馈 #29190](https://github.com/astral-sh/ruff/pull/29190)与[固定 AGENTS.md L59–96](https://github.com/astral-sh/ruff/blob/c618e8b1382992a27dafe2fc288777792e36ecab/AGENTS.md#L59-L96)，核实 2026-10-28。

## 要不要同时放两种文件

| 项目情况 | 最简单的选择 |
|---|---|
| Codex 为主，或多个工具共享规则 | 共同正文放根 `AGENTS.md`；子模块确有不同约定时再加局部文件 |
| 只用 Claude Code，已有 `CLAUDE.md` | 原地维护，不为统一文件名搬家 |
| 已有 `AGENTS.md`，Claude 没直接加载，或还要 Claude 专属规则 | 同目录 `CLAUDE.md` 写下方导入，专属规则放其后 |

`CLAUDE.md` 的最小文件内容是：

```markdown
@AGENTS.md
```

**复制到文件里时只放这一行，不带代码围栏或行内反引号。** 自然语言“请阅读 AGENTS.md”要靠模型再去打开文件；`@AGENTS.md` 才是 Claude 的导入语法。公共正文只维护一份；同文件的显式导入会去重。清理旧方案时，移除已由原生加载替代的 `SessionStart` 打印 Hook 和手工复制的正文，保留有用的导入。

当前 Claude Code 的原生 AGENTS 入口要求 v2.1.277+ 且该能力可用；默认情况下，工作目录或祖先目录里的 `CLAUDE.md`、`.claude/CLAUDE.md`、`CLAUDE.local.md` 会让它改读 CLAUDE 文件。团队有混合版本或这些文件时，保留显式导入最省事。

## 第二步：核对加载入口与当前上下文

**先按任务选对起始目录，再分开核对工具侧的加载信息和 Agent 当前看见的规则。** 从实际任务目录新开会话，三种情况这样选：

| 任务情况 | 从哪里开始 | 怎样确认加载缺口 |
|---|---|---|
| 单包新任务 | 在目标包目录新开；Codex 用 `codex --cd <仓库>/<包>`，会带入根到该包的指令链 | 用无工具复述核对包内契约；codex-cli 0.154.0 fixture 只证明上下文组装，模型是否遵守另看真实修改 |
| Codex 根会话跨兄弟包 | 不要把同一根会话里的 shell `cd` 当原生重载；在目标包目录另开新任务，既有根任务不自动终止或重开 | 根会话缺兄弟包自动发现时，该包规则记为未加载；换到目标目录的新会话再核 |
| Claude 访问附加仓库 | `claude --add-dir <外部目录>` 只增加可访问目录，默认不加载该目录的指令；需要其 `CLAUDE.md`／`.claude/rules` 时另开额外目录加载开关，或用显式导入并先核外部导入批准状态 | 目录可读不等于 AGENTS 被发现；额外目录开关覆盖 CLAUDE 文件与 rules，不覆盖原生 AGENTS |

第一条命令可在仓库外的任意目录运行，第二条从当前任务目录运行；尖括号占位符换成实际路径，不要照抄：

```sh
# 单包任务：从仓库外的任意目录启动，Codex 带入根到目标包的指令链
codex --cd <仓库>/<包>

# Claude 增加一个外部仓库：从当前任务目录启动；默认只给访问，不加载其指令
claude --add-dir <外部仓库>
```

`--cd` 只改 Codex 的启动目录，启动后不需要再 `cd`；`--add-dir` 本身只增加可访问范围，默认不加载该目录的指令；需要其 `CLAUDE.md`／`.claude/rules` 时另开额外目录加载开关（官方形式可内联、不改用户设置：`CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 claude --add-dir <外部仓库>`，仍不覆盖原生 `AGENTS.md`），或用显式导入并先核外部导入批准状态。在项目 `CLAUDE.md` 中 `@` 外部文件，首次遇到外部导入时会弹一次列出这些文件的批准框；拒绝后该导入保持禁用、不再弹框。只有 Claude 原生读取的 `AGENTS.md` 内部再导入外部文件时，才须此前获准且运行时不再弹框。不改用户设置，也不绕过批准。

按各工具入口核对：

- **Claude 原生 AGENTS**：v2.1.280+ 用 `/memory` 查看 `AGENTS.md` 路径；v2.1.277–279 的 `/memory`、`/context` 不列原生 AGENTS，改为询问 Claude 当前项目规则，并对照文件。
- **Claude 显式导入**：用 `/context` 查看 **Memory files**，确认外层 `CLAUDE.md` 在列，并核对其中的 `@AGENTS.md` 指向同目录共享文件；共享内容是否可见，再用下方提问核对。
- **Codex**：在目标目录运行 `codex "Summarize the current instructions."`，核对复述的项目规则。它在启动时读取根到当前目录的指令链。

核对时选共享文件里已有的一条项目特有契约和一条检查命令，不另加暗号。可以这样问：

```text
先不要打开文件或运行命令，只根据当前上下文列出本任务的项目约定：
必须保留的特殊行为、应执行的检查，以及对应指令来源。
没有看到的项请直说；先停在这里，等我核对后再开始修改。
```

**把复述当内容核对，把工具信息当加载证据，把真实修改当行为验收。** 无工具复述答对，记为“规则在当前上下文可见”；先出现 Read／`cat` 再答对，记为“任务中读取后答对”，启动状态仍查工具侧证据。只列外层 `CLAUDE.md` 时，共享文件的启动展开待验。路径确认后仍要核关键契约与下节的实际执行。预期文件缺失就查版本、目录与导入，再开新会话；提问里不要粘贴规则正文。

更多排障见 [03：加载规则](../03-context-engineering.md#21-各工具的加载规则一手)。

**依据**：[官方] [Claude 导入](https://code.claude.com/docs/en/memory#share-one-file-with-other-coding-tools)、[原生加载检查](https://code.claude.com/docs/en/memory#my-agentsmd-isnt-loading)、[旧入口清理与去重](https://code.claude.com/docs/en/memory#remove-an-earlier-agentsmd-workaround)、[Codex 指令发现](https://learn.chatgpt.com/docs/agent-configuration/agents-md)；加载入口重核 2026-10-28。共享方案尚待真实多工具任务的加载与行为验收。

## 第三步：让规则参与眼前的真实修改

**直接用下一项本来就要做的修复或功能，不为测指令编一道题。** 开始前留下该任务原有的验收条件；规则核对后接着发：

```text
完成这项真实任务：[粘贴现有需求或 issue，以及原有验收条件]。
按项目指令选择实现入口，保留相关契约，并运行适用检查。
结束时给出最终 diff、实际运行的命令和结果；受阻的检查写明原因。
```

接收时看产物与运行结果，核对三件事：

| 要确认什么 | 去哪里看 |
|---|---|
| 入口选择是否符合规则 | 实际读过或修改的入口，是否符合任务导航；例外是否有任务本身的理由 |
| 特殊契约是否保留 | 最终 diff 与该行为的测试或实际输出，而非只看 Agent 的复述 |
| 检查是否真正执行 | 实际命令、退出状态和测试／运行结果，是否覆盖原有验收条件 |

有遗漏就修那条规则或执行结果，结论记在现有提交说明里。**多工具共享要分别看 Codex 与 Claude Code 各自的自然任务。** 验收通过可说明这次任务遵守了约定，效率或返工改善另需比较。缺某个工具、共享文件的启动证据或真实任务，就保留对应待验项和原配置；可继续完成手头任务，不把局部通过升级为共享方案已采用。

## 向强项目借什么，而不是整份照抄

### Cloudflare：给权威入口，也给跨工具边界

Workers SDK 的真实 `AGENTS.md` 写道：

> Use the Node.js and pnpm versions declared in `package.json`.

它还提供这条定点测试命令：

```text
pnpm -w test:ci -F <package> -- <test-file>
```

这是 **Workers SDK 工作区根目录**的命令；`<package>`、`<test-file>` 要替换成实际包名和测试文件，并要求该包测试配置支持透传。其他仓库应抄自己的测试入口，不原样运行这条命令。

**最值得借的是“改一个地方，会影响谁”。** 它把开发功能尽量放进 Miniflare 的共享实现，并要求检查 Wrangler、Vite、Vitest 消费方；先跑最小相关测试，再按影响扩大。换到自己的项目，就写清共享层、调用方和必要检查，避免“单个入口能用”便交付。

**依据**：[一手／实际配置] [Cloudflare Workers SDK AGENTS.md](https://github.com/cloudflare/workers-sdk/blob/1787b353ddb35c9d82a6a7fdae8bc4dc2f4cd035/AGENTS.md)；2026-10-26 重核，与当日 main 文件相同。

### Anthropic：写出 Agent 容易误改的领域意图

Claude Cookbooks 的真实 `CLAUDE.md` 明确要求：

> Keep outputs in notebooks (intentional for demonstration)

**输出是教程的一部分，所以不能套用“清空 notebook 输出”的通用清理习惯。** 文件还要求 notebook 从头到尾运行无误，并给出仓库检查入口：

```sh
make check
```

这条命令属于 Claude Cookbooks 的 format-check＋lint；notebook 执行另验。换到自己的项目，留下同类信息：哪些看似多余的输出、兼容行为或资源是产品刻意保留的，以及怎样确认它仍然可用。

**依据**：[一手／实际配置] [Anthropic Claude Cookbooks 固定文件](https://github.com/anthropics/claude-cookbooks/blob/9c1e493ddd2b82df399d2a61b9c806c539e18be6/CLAUDE.md)与[当前文件](https://github.com/anthropics/claude-cookbooks/blob/main/CLAUDE.md)；上述规则与命令重核 2026-10-26。两份上游配置均为源码核查，未运行其构建或模型任务。

### NVIDIA：小改动用原生补丁，批量转换保留脚本

**✅ 修改已有文本的局部内容，优先用 `Edit`／`apply_patch`；机械批量转换、生成与格式化，用项目已有的脚本、codemod、生成器或格式化器。** 让审阅者直接看到改了什么，少为几行修改再维护一段替换程序。

cuda-python 的真实 `AGENTS.md` 有这段短句：

> Try to use apply_patch for single file edits

同条规则也允许工具不适用时换方案，并把自动生成、格式化和跨代码库机械替换列为例外。可借的是按修改类型选工具；读取、搜索、测试照常使用 shell。合并进现有项目指令时，可以只加这一条：

```markdown
- 先读目标文件与相关约定；局部文本修改优先用原生 Edit／apply_patch。批量转换、生成、格式化或需保留非 UTF-8 编码时，使用合适的脚本／codemod／生成器，说明选择理由；完成后检查最终 diff 并运行相关验证。
```

Claude Code 的 `Edit` 默认要求 `old_string` 与当前内容精确且唯一匹配；文件被其他人改过仍可能成功，因此协调好同一文件的写者，并审最终 diff。

issue #92178 的使用者报告，几处字符串替换被写成 50 多行 Python，因 heredoc 脚本语法错误做了三次尝试；另有反馈说，写进指令后仍未稳定遵守。

**依据**：[一手／实际配置] [NVIDIA cuda-python 固定文件 L191–205](https://github.com/NVIDIA/cuda-python/blob/585038dfa23437c17bb60b210a3db25464e32171/AGENTS.md#L191-L205)；[官方] [当前 Edit 行为与编码边界](https://code.claude.com/docs/en/tools-reference#edit-tool-behavior)；[社区原帖] [脚本三次尝试](https://github.com/anthropics/claude-code/issues/92178#issuecomment-5621524015)、[指令未稳定遵守](https://github.com/anthropics/claude-code/issues/92178#issuecomment-5979127203)、[linux.do 讨论](https://linux.do/t/topic/2828925)。核实 2026-10-26；Claude 工具语义按文档核对，社区结果为使用者自述。

## 何时不适用，怎么知道该改了

- **只有某类任务需要的长流程**：放到任务文档或窄 Skill，根文件只写触发条件与入口。拆成多个文件再全部 `@` 导入，仍会一起加载；需要的是按任务读取，而非换文件名。
- **要求硬性禁止读取、联网或发布**：用宿主权限、沙箱及相应检查落实；指令文件负责说明约定，不能承担访问控制。
- **已有稳定配置**：只修具体缺口。命令失效、模块边界变化或新任务暴露遗漏时，同次更新；删减时保留默认行为、条件和例外，不能只追求更短。
- **代码与说明冲突**：先核当前任务、版本配置和相关验收。路径或命令的旧描述已失效，就修说明；仍有效的目标、兼容或安全契约未被实现，就修代码。不要把“代码总优先”设成全局规则，也不要只报告冲突便继续走错的一边。

本仓 [testmon 维护](../../experiments/testmon-outer-coverage/README.md)遇到的就是后一类：声明支持 coverage 6，而实现误捕异常使它无法运行；现有注释也明确意图兼容旧版。修复保留声明的版本范围，三个合法依赖环境的相关验收均通过，没有通过抬高最低版本避开问题。

**依据**：[10-22 过期指令研究](https://arxiv.org/html/2610.30571v1)在 40 个合成项目中预设说明过期；[使用者的反向案例](https://github.com/WenJing95/stale-docs-data/issues/1)则指出现行规格正确而代码漂移的情况，尚无同协议定量复验。这里据两种情况和本仓真实修复作条件取舍；研究数据未在本仓重跑模型。核实：2026-10-27。

**用眼前的一次真实修改验收：Agent 是否找对入口、保留那条特殊契约、跑了相关检查？** 漏哪项就补哪项；已过时的内容直接替换，不把旧状态和更正说明越叠越长。

**维护一份当前正文，并审初始化或清理产生的 diff。** V2EX 的重新初始化反馈与 Reddit 的陈旧规则讨论支持这一做法；已有稳定文件不用加同步器。

**依据**：[社区原帖] [V2EX：混用规则与初始化](https://v2ex.com/t/1221900)、[Reddit：陈旧说明与清理](https://www.reddit.com/r/ClaudeAI/comments/1us9hfz/asked_claude_what_in_my_docs_was_hurting_its/)，重核 2026-10-26；[既有语义清理反例](../03-context-engineering.md#23-写什么不写什么官方最佳实践-一手)，原核实 2026-10-24；[官方导入与权限区别](https://code.claude.com/docs/en/memory#import-additional-files)，核实 2026-10-26。

**👀 自己维护指令生成／同步工具时，把已有自定义章节作为回归输入，跑真正的重建路径，再核保留内容。** CataForge 的中文故障记录中，普通更新能保留正文，`deploy --rebuild` 却先删掉 section-merge 的输入文件，再生成占位模板，doctor 仍全绿。修复按合并策略保留目标；新增测试先部署、加入自定义标记、再真实 rebuild 并断言标记仍在。可借这条保留性检查，不必安装整套框架。

**依据**：[作者自用原帖 #340](https://github.com/lync-cyber/CataForge/issues/340)、[已合入修复 #341](https://github.com/lync-cyber/CataForge/pull/341)、[固定回归 L253–328](https://github.com/lync-cyber/CataForge/blob/7826268b08e9f567dc4d1c7f39638afba7198c06/tests/deploy/test_deployer.py#L253-L328)。2026-06-22 的故障与修复，源码核实 2026-10-27；本仓未试用，该回归只直接检查自定义标记保留。
