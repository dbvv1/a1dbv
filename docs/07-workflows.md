# 07 · 工作流方法论

> 核实时间：2026-10-03。

## 1. 核心：验证闭环 ✅

> “给 Claude 一个它能运行的检查：测试、构建、截图对比。这是‘你得盯着的会话’和‘你可以走开的会话’的区别。”——Claude Code 官方最佳实践 **[一手]**

没有可运行的检查，“看起来做完了”就是 Agent 唯一的停止信号，**你就成了验证环节**，每个错误都要等你发现。

| 约束强度 | 做法 |
|---|---|
| 弱 | 在提示里写：“实现后运行测试，修到通过” |
| 中 | `/goal <完成条件>`：每轮由**独立的评估器**检查，直到条件满足 |
| 强（确定性） | **Stop hook** 运行检查脚本，不通过就不让结束 |
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

## 4. 测试驱动（TDD）🧪

- 先让 Agent 写**会失败的测试**，确认确实失败，再实现。
- 明确告诉它“不要改测试来让测试通过”。
- 另一种形式：一个会话写测试，另一个会话写代码让测试通过（官方推荐）。
- 强制工具：[tdd-guard](https://github.com/nizos/tdd-guard)（Hook 实现）；Superpowers 也内置 TDD Skill。

## 5. Spec 驱动开发（SDD）

| 工具 | 风格 | 评级 |
|---|---|---|
| [GitHub Spec Kit](https://github.com/github/spec-kit) | Constitution → Specify → Clarify → Plan → Tasks → Implement | 👀 |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | 轻量，偏增量变更（`/opsx:propose`），支持 30+ 工具 | 🧪 |
| [Kiro](https://kiro.dev) | IDE 形态，EARS 格式需求 | 👀 |
| [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | 模拟敏捷团队的多个角色，产出物很多 | 👀 |

**批评（[社区]：Martin Fowler、HN《SDD: The Waterfall Strikes Back》）**
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
| 必须强制执行的规则 | Hook（官方 `hookify` 插件能从对话生成） |
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

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)、[/goal](https://code.claude.com/docs/en/goal)
- Anthropic：[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)、[Harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)、[Building a C compiler](https://www.anthropic.com/engineering/building-c-compiler)
- [Ralph Wiggum 插件](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum)
- [Martin Fowler：Understanding SDD](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)、HN：[SDD: The Waterfall Strikes Back](https://news.ycombinator.com/item?id=45935763)（摘要）
