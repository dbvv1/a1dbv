# 07 · 工作流方法论

> 核实时间：2026-10-08；Hook 完成边界与迁移拆分建议于 2026-10-11（UTC+8）复核，其余未重验。

## 1. 核心：验证闭环 ✅

> “给 Claude 一个它能运行的检查：测试、构建、截图对比。这是‘你得盯着的会话’和‘你可以走开的会话’的区别。”——Claude Code 官方最佳实践 **[一手]**

没有可运行的检查，“看起来做完了”就是 Agent 唯一的停止信号，**你就成了验证环节**，每个错误都要等你发现。

| 约束强度 | 做法 |
|---|---|
| 弱 | 在提示里写：“实现后运行测试，修到通过” |
| 中 | `/goal <完成条件>`：每轮由**独立的评估器**检查，直到条件满足 |
| 程序化检查（有条件） | **命令型 Stop hook** 按运行时协议阻止正常收尾；需测试缺文件、超时和连续阻止上限，不代替最终验收或权限边界，见 [06](06-hooks-and-guardrails.md) |
| 交叉验证 | 验证子 Agent 或 Dynamic Workflow：让一个**全新的模型尝试推翻结果** |

还要让 Agent **出示证据**（测试输出、跑过的命令和结果、截图），而不是只说“已完成”。

**来自一线的证据 [一手]**：
- Anthropic 用 16 个 Agent 写 C 编译器，作者总结：“它会自主解决你给它的任何问题，所以**任务的验证器必须近乎完美**。”项目用 GCC 作为“已知正确”的对照，并把测试输出设计成适合模型阅读（简洁，并按 1–10% 确定性采样）。
- 长时任务 harness：自评会“自信地夸奖平庸的工作”，**把干活的 Agent 和评判的 Agent 分开**是“强有力的杠杆”。

## 2. 标准节奏：探索 → 计划 → 实现 → 提交 ✅

1. **探索**（Plan 模式，只读）：“阅读 src/auth，理解 session 和登录是怎么处理的。”
2. **计划**：“我要加 Google OAuth，需要改哪些文件？写个计划。”可以按 `Ctrl+G` 在编辑器里直接改计划。
3. **实现**：退出 Plan 模式，“按计划实现，给回调写测试，跑测试并修复失败”。
4. **提交**：让它写提交信息并开 PR。

**什么时候跳过计划**：如果能用一句话描述这个 diff（改错别字、加一行日志、重命名变量），就直接让它做。

## 3. 大功能：访谈式 Spec ✅

```
我想做 [简述]。用 AskUserQuestion 工具详细采访我。
问技术实现、UI/UX、边界情况、顾虑和取舍。不要问显而易见的问题，挖我可能没想到的难点。
采访完后把完整的规格写进 SPEC.md。
```
然后**开一个新会话**按 SPEC.md 实现（上下文干净，只专注实现）。
好的 Spec 是自包含的：写明涉及的文件和接口，**写明不做什么**，最后有一个端到端的验证步骤 **[一手]**。

## 3.4 大功能的前置设计与垂直切片 ✅

来自 HumanLayer《Why Software Factories Fail》**[社区：原文]**，和访谈式 Spec 互补：

| 环节 | 对齐什么 | 形式 |
|---|---|---|
| 产品评审 | 解决什么问题、怎么算成功（最好是用户结果或可观测指标） | 短文档 + **粗糙的 HTML 原型**（“一个原型能结束三段文字吵不完的争论”） |
| 系统架构 | 服务、接口、数据如何交互 | 时序图、接口形状、表结构 |
| **程序设计** | 代码的形状：类型、函数签名、文件布局、调用栈 | **伪代码调用树**（可以用 diff 语法标出新增和删除）、文件树 diff |
| **垂直切片** | 实现顺序 | 每片都是能实际运行的端到端路径，做完马上评审 |

- **模型天然偏好“水平计划”**：先写数据库迁移，再写服务层、API，最后写前端，直到最后才能摸到可运行的东西。要**明确要求它按垂直切片计划**：先定接口并返回假数据，用 curl 验证 → 前端接假数据 → 接服务层 → 接数据库 → 补业务逻辑和错误处理。
- 每次评审 100–200 行再纠偏，比面对 2000 行再返工便宜得多。
- **按任务大小分流**：约 40% 的任务一次完成或稍作修改；中等任务写一份合并的计划文档；只有大任务才走完整的四个环节。
- 作者的总结：“**30 分钟的计划能省几个小时的评审**。”接受模型的约束，稳定地快 2–3 倍，而不是追求 10–100 倍。

## 3.5 Fable 级模型时代的提示与收尾 ✅

来源：Anthropic《Getting the most out of Opus 5.5》**[一手]**，Simon Willison《Agentic Engineering Patterns》**[社区]**。

**交代任务**
```
把支付接口从旧 client 迁到新 client。
完成标准：所有接口都用新 client，旧 client 已删除，测试套件全部通过。
只有当某个测试失败、而你解释不了原因时，才停下来问我。
```
- 一条消息给出**完整任务 + 完成标准 + 停止条件**，然后放手让它做。
- 删掉“think carefully / 一步步思考”这类话：模型自己会思考，改用 effort 控制。
- 运行中想起什么，直接追加消息，不必重启任务。
- 设计类任务：**列出要避开的具体样式**（只说“别太普通”只会换成另一种默认风格）。

**开局的短提示**
- `First run the tests`：让 Agent 知道有测试套件、大致了解项目规模、进入“测试心态”。
- `Use red/green TDD`：先写测试、确认失败，再实现。

**长任务**
- 在 CLAUDE.md 里写**停止规则**（模板已包含）：不需要你时继续做，只在无法继续或要做破坏性操作时停下。
- 把清单写进 `TASKS.md`，边做边勾。它不怕上下文压缩，你也可以直接看文件了解进度。
- 审计和迁移中**可独立调查的部分**可拆给子 Agent；实际迁移先对齐共享接口和依赖顺序。**主 Agent 要逐个检查子 Agent 交回的证据**，再验证整合结果，见 [08](08-multi-agent.md)。

**收尾与验证**
- 总结格式固定为：**Blocked on me / Changed / Found**，先看需要你决定的事项。
- **Agent 式手工测试**：测试通过不等于能用，让 Agent 用 `python -c`、curl、浏览器自动化实际跑一遍。
- 要求它“**标出无法确认的内容，并说明查过哪里**”。
- 评审提示：“只列你会因此拒绝合并的问题，给出文件、行号、原因，以及怎么证明它是错的。”

**理解与交接**
- **线性走读**：让 Agent 为代码写一份逐段讲解，适合接手 vibe 出来的代码。
- **术语对齐**：评审前让 Agent 列出它自创的术语和含义，你改名后它全局替换；长期维护一份 GLOSSARY.md（Lobsters 上的做法）。
- **交接**：用 `/handoff` 写交接文档，在新会话里接着做（可以跨厂商），在 HN 上比 `/compact` 更受推荐。
- **PR 礼仪**：不要把自己都没审过的代码丢给同事；PR 要小，并附上证据（手工测试记录、截图）。

## 4. 测试驱动（TDD）🧪

- 先让 Agent 写**会失败的测试**，确认确实失败，再实现。
- 明确告诉它“不要改测试来让测试通过”。
- 另一种形式：一个会话写测试，另一个会话写代码让测试通过（官方推荐）。
- 强制工具：[tdd-guard](https://github.com/nizos/tdd-guard)（Hook 实现）；Superpowers 也内置 TDD Skill。

## 5. Spec 驱动开发（SDD）

| 工具 | 风格 | 评级 |
|---|---|---|
| [GitHub Spec Kit](https://github.com/github/spec-kit) | 功能流程含 Constitution → Specify → Clarify → Plan → Tasks → Implement → Converge；当前另有 bug/想法评估入口 | 🧪 按任务规模选择 |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | 轻量，偏增量变更（`/opsx:propose`），支持 30+ 工具 | 🧪 |
| [Kiro](https://kiro.dev) | IDE 形态，EARS 格式需求 | 👀 |
| [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | 模拟敏捷团队的多个角色，产出物很多 | 👀 |

**批评（[社区]：Martin Fowler、HN《SDD: The Waterfall Strikes Back》）**

下面是历史使用体验，不代表当前版本只有完整 SDD 一条路径；2026-10-10 源码已提供独立 bug 流程，见 [21 的版本与原帖](21-agent-patterns.md)。
- Spec Kit 给一个简单的日期显示功能生成了 **1300 行 Markdown**；审阅大量生成的 Markdown 可能比审代码还累；
- Kiro 把任务拆得过细，而且**规格会漂移**：实现中发现的约束不会回写到文档；
- 有人报告写规格占了项目一半的时间；用完整 SDD 修 bug 显然是大材小用。
- 支持者的反驳：瀑布模型的问题在于反馈周期长达数月，而 SDD 的周期是几分钟。

**本仓库的判断**：
- ✅ 用**轻量 Spec**：上面的访谈式 SPEC.md，或 OpenSpec 这类增量方式；
- 只在**中大型、需求相对稳定**的功能上用；
- 探索期、原型期、修 bug 不用；
- Spec 要和代码一起演进（实现中发现新约束就更新 Spec）。

## 6. Ralph 循环 🧪

“Ralph 就是一个 bash 循环”（Geoffrey Huntley）：把同一个提示反复喂给 Agent，每一轮都能通过文件和 git 历史看到上一轮的成果，一直迭代到完成。官方插件用 Stop hook 实现：

```
/ralph-loop "实现 X。要求……全部测试通过后输出 <promise>COMPLETE</promise>" \
  --completion-promise "COMPLETE" --max-iterations 30
```
- **适合**：完成条件明确且能由机器检查的任务（让测试全绿、迁移完成、lint 清零）。
- **风险**：没有好的验证就会空转烧额度。**务必设上限**。
- 相关资料：[Ralph Playbook](https://github.com/ClaytonFarr/ralph-playbook)、[awesome-ralph](https://github.com/snwfdhmp/awesome-ralph)。

## 7. 长时任务 harness（Anthropic 两篇工程博客 [一手]）

**第一篇（2025-11）：Initializer + Coding Agent**
1. 第一个会话做初始化：写 `init.sh`（启动开发环境）、`claude-progress.txt`（进度），列出 **200 多个功能的 JSON 清单（全部标为 failing）**，做初始提交；
2. 后续每个会话：`pwd` → 读 git log 和进度文件 → 选优先级最高、还没完成的功能 → 启动开发服务器跑基本的端到端测试 → 实现**一个**功能 → 用浏览器自动化验证 → 提交，留下干净的状态。
3. 应对的失败模式：一口气想做完整个应用、过早宣布完成、会话之间留下未记录的 bug。

**第二篇（2026-03）：Planner / Generator / Evaluator**
- Planner 把简单需求扩展成完整的产品规格；Generator 负责实现；Evaluator 用 Playwright 按**客观标准**打分并给反馈。
- 成本参考：Opus 4.5 做一个复古游戏制作器，6 小时花了 200 美元，而单 Agent 20 分钟 9 美元的版本核心功能是坏的；Opus 4.6 做一个 DAW，3 小时 50 分钟花了 124.7 美元。
- **“上下文焦虑”**：上下文快满时模型会过早收尾 → 重置上下文比压缩效果好（新模型上这个问题有所缓解）。
- 开工前让 Generator 和 Evaluator **协商“做完”的标准**（sprint contract）。
- **“找最简单的方案，只在需要时增加复杂度；每次模型更新后重新审视 harness，删掉过时的脚手架。”**

## 8. 把纠错沉淀下来（复利工程）

| 纠正的是什么 | 写到哪里 |
|---|---|
| 项目事实或约定（搞错了两次） | CLAUDE.md / AGENTS.md |
| 操作流程（第三次粘贴） | Skill |
| 可机械检查的流程约束 | 命令型 Hook，并测试失败路径；权限约束交给沙箱等运行时边界 |
| 某类审查 | Subagent |
| 跨仓库通用 | 插件 |

参考：Every 的 [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) 插件。

## 9. 常见失败模式（官方总结 [一手]）

| 失败模式 | 修复 |
|---|---|
| 大杂烩会话：一会儿做 A 一会儿做 B | 不相关的任务之间 `/clear` |
| 反复纠正：上下文里塞满失败的尝试 | 纠正两次就 `/clear`，写个更好的提示重来 |
| CLAUDE.md 写得太多 | 狠心删减，或改成 Hook |
| 信任但不验证 | 一定要有测试、脚本或截图；无法验证就不要上线 |
| 无边界的探索 | 限定调查范围，或交给子 Agent |

## 来源

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)、[/goal](https://code.claude.com/docs/en/goal)、[Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)
- [HumanLayer：Why Software Factories Fail](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md)
- [Simon Willison：Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/)、[Reducing the cognitive load of AI changes](https://amoffat.github.io/blog/cognitive-load.html)
- Anthropic：[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)、[Harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)、[Building a C compiler](https://www.anthropic.com/engineering/building-c-compiler)
- [Ralph Wiggum 插件](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum)
- [Martin Fowler：Understanding SDD](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)、HN：[SDD: The Waterfall Strikes Back](https://news.ycombinator.com/item?id=45935763)（摘要）
