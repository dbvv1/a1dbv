# CLAUDE.md／AGENTS.md 怎么写

**✅ 多工具项目用一份 `AGENTS.md` 保存共同约定：真实命令、任务入口、不可猜的契约和完成标准。** Claude Code 已能直接加载它，就只保留这一份；需要 Claude 专属规则或兼容旧会话时，在同目录 `CLAUDE.md` 导入。只用 Claude、现有 `CLAUDE.md` 已经好用的项目，继续维护原文件。

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

**依据**：[一手／真实项目] 下文 Cloudflare 与 Anthropic 文件；[既有证据与取舍](../03-context-engineering.md#23-写什么不写什么官方最佳实践-一手)，原核实 2026-10-24。这里沿用已有模板的写法，跨任务最优篇幅仍未知。

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

**写完先确认加载，再看行为。** 从实际任务目录新开会话，按入口检查：

- **Claude 原生 AGENTS**：v2.1.280+ 用 `/memory` 查看 `AGENTS.md` 路径；v2.1.277–279 的 `/memory`、`/context` 不列原生 AGENTS，改为询问 Claude 当前项目规则，并对照文件。
- **Claude 显式导入**：用 `/context` 查看 **Memory files**，确认 `CLAUDE.md` 在列，并核对其中的 `@AGENTS.md` 指向同目录共享文件。
- **Codex**：在该目录运行 `codex "Summarize the current instructions."`，核对复述的项目规则。它在启动时读取根到当前目录的指令链；根会话进入子包时，别假定局部规则已自动加入。

更多排障见 [03：加载规则](../03-context-engineering.md#21-各工具的加载规则一手)。

**依据**：[官方] [Claude 导入](https://code.claude.com/docs/en/memory#share-one-file-with-other-coding-tools)、[原生加载检查](https://code.claude.com/docs/en/memory#my-agentsmd-isnt-loading)、[旧入口清理与去重](https://code.claude.com/docs/en/memory#remove-an-earlier-agentsmd-workaround)、[Codex 指令发现](https://learn.chatgpt.com/docs/agent-configuration/agents-md)；核实 2026-10-26。加载入口按官方文档核对，未实跑本页的 Claude 会话配置。

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

## 何时不适用，怎么知道该改了

- **只有某类任务需要的长流程**：放到任务文档或窄 Skill，根文件只写触发条件与入口。拆成多个文件再全部 `@` 导入，仍会一起加载；需要的是按任务读取，而非换文件名。
- **要求硬性禁止读取、联网或发布**：用宿主权限、沙箱及相应检查落实；指令文件负责说明约定，不能承担访问控制。
- **已有稳定配置**：只修具体缺口。命令失效、模块边界变化或新任务暴露遗漏时，同次更新；删减时保留默认行为、条件和例外，不能只追求更短。

**用眼前的一次真实修改验收：Agent 是否找对入口、保留那条特殊契约、跑了相关检查？** 漏哪项就补哪项；已过时的内容直接替换，不把旧状态和更正说明越叠越长。

V2EX 的混用讨论同时有导入可用的反馈与重新初始化后规则被改写的自述；Reddit 的文档清理讨论也出现旧状态、矛盾规则长期堆积。可借的教训是**维护一份当前正文，并审初始化或清理产生的 diff**，无需因此安装同步器。当前工具行为以官方契约为准。

**依据**：[社区原帖] [V2EX：混用规则与初始化](https://v2ex.com/t/1221900)、[Reddit：陈旧说明与清理](https://www.reddit.com/r/ClaudeAI/comments/1us9hfz/asked_claude_what_in_my_docs_was_hurting_its/)，重核 2026-10-26；[既有语义清理反例](../03-context-engineering.md#23-写什么不写什么官方最佳实践-一手)，原核实 2026-10-24；[官方导入与权限区别](https://code.claude.com/docs/en/memory#import-additional-files)，核实 2026-10-26。
