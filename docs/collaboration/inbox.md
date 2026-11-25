# 前沿收件箱

> 用户在 X、linux.do、技术群等处看到的 AI coding 项目、帖子、做法，直接把链接贴在下面（一行一条，可附一句话说明为什么觉得有意思）；dot-A 每周扫描发现的候选也记在这里，标明来源。只贴公开链接，不贴私聊截图或账号信息。dot-A 在 24 小时内处理：写明它对应本仓哪个任务或使用中的问题，能转化的进试用，只是值得一试的新工具进 [13 前沿雷达](../13-frontier-radar.md)“值得一试”表，一行两句以内；处理后在行尾标 ✅ 和去向，本仓此前已收录的标“已有”。规则见[运行手册 §3](LONG-TERM-PLAN.md#3-怎么探索)；2026-11-10 及更早的已吸收／过程记录见[归档收件箱](archive/inbox-through-2026-11-25.md)。

## 待处理

### 2026-11-15：Code Mode 先试批量读任务，不替换无人值守入口

👀 **Claude Code Code Mode 可作为批量搜索、过滤和独立工具调用的候选，未试用，不改默认。** 2.1.323 起提供实验入口；仅支持原生交互终端及官方支持的账号、模型，不支持 `-p`、Agent SDK、cloud 或 gateway。已有环境满足条件、接受首次确认时，可在 macOS／Linux／WSL 中用一次性启动，不写项目配置：

```sh
CLAUDE_CODE_EXPERIMENTAL_CODE_MODE=1 claude
```

先看启动提示确认真正开启，不能只看环境变量。Code Mode 会话只能在终端保持该模式恢复；不能转 Desktop、Remote Control 或后台会话。后台 **代码** 是另一概念，仅特定启动条件支持，不能据此承诺离开后持续执行。不为试用删除隐私、认证或管理设置。

**把省工具往返与真实收益分开。** 下一项用本仓真实文档链接检查，同一固定树分别用普通模式与 Code Mode，核最终清单的漏检、误报、返工与总投入，不只比较工具次数。逐工具 `deny`／`ask` 和 `PreToolUse` 仍生效，auto classifier 审整段代码而非每次工具调用；不把它当更强沙箱。

依据：[官方入口与限制](https://code.claude.com/docs/en/code-mode)、[2.1.323 发布](https://github.com/anthropics/claude-code/releases/tag/v2.1.323)、[社区原帖与评论](https://www.reddit.com/r/ClaudeCode/comments/1xvw576/claude_code_21323_experimental_code_mode_claude/)。社区有读多任务受益、短任务增加成本和 JS 错误中断写批次的自报，缺可复跑对照；其中“用了一周”的时间跨度也不能由新发布日证实，不作效果证据。核实：2026-11-15。只完成该候选的一手文档与社区定向核对，未达领域饱和。

### 2026-11-15：前端领域知识按需取，不让扫描器替代浏览器验收

🧪 **已有前端任务可试 Modern Web Guidance 补 Web 平台知识，框架行为仍用对应版本配方。** GoogleChrome 的 1.0.0 将专家指南与浏览器支持数据按 `search → retrieve` 送入上下文，不必整包读入或先安装 Skill。先写清目标浏览器、核心交互与保留行为；查询用单个 UI 能力，不混入项目名。以下命令会从 npm 取公开包，需 Node.js 22+，关闭工具默认遥测：

```sh
DISABLE_TELEMETRY=1 npx -y modern-web-guidance@1.0.0 search "filter search results"
DISABLE_TELEMETRY=1 npx -y modern-web-guidance@1.0.0 retrieve forms
```

**本仓已试检索和实际源码扫描，尚未证明能改善页面。** 在固定 `35f71fff` 的 Posts 筛选任务中，查询返回 `forms`，正文补充语义、标签、明确提交与状态通知；既有实现已保留显式 Apply、可见标签和 `role="status"`。它不能替代 TanStack 配方对 URL 状态继承、清空、详情返回与历史恢复的指导，故保留现有路线，不为采用工具改写已经正常的交互。对现有 `tanstack-url-state` 和 `gate-reveal` 分别运行 `legacy-scan` 均为 0 条；输出明确仅覆盖 35 条规则、33 份指南，不代表完整可访问性、兼容性或视觉通过。下一次自然 UI 修改再看它是否减少具体遗漏，仍回原浏览器路径验结果。

**不要把新 API 或作者评测直接升为默认。** 固定 Skill 默认要求非 Baseline Widely Available 特性保留指南中的 fallback；HN 使用者既有支持 Temporal 回退的实用反馈，也质疑新 API 带来的复杂回退成本。按项目支持范围决定是否采用，不为扫描归零删安全回退。作者公开评测按自己的指南验收，不是独立生产效果；本仓未跑模型对照或跨浏览器实现。安装的 Skill 内部会调用 `@latest`，上方固定版本的 CLI 实跑不能证明日后动态版本行为相同。

依据：[官方发布与覆盖](https://developer.chrome.com/blog/modern-web-guidance-v1)、[固定 Skill 与默认兼容策略](https://github.com/GoogleChrome/modern-web-guidance/blob/4dd968349e54ca45a05dd5c818fb035c9054b022/skills/modern-web-guidance/SKILL.md)、[HN 作者原帖及正反评论](https://news.ycombinator.com/item?id=50443812)、[兼容性讨论与使用者回退反馈](https://news.ycombinator.com/item?id=50446132)、[r/webdev 作者说明与使用者反馈](https://www.reddit.com/r/webdev/comments/1xw9yw4/showoff_saturday_my_team_at_chrome_worked_with/)。核实、固定包检索与源码扫描：2026-11-15。定向覆盖官方发布/实际 Skill、npm 发布物、HN 与 Reddit 原帖及评论；未完成整个前端领域广扫，不称饱和。

### 2026-11-15：Argus 的无人值守数据先核分母，再决定是否换框架

👀 **已有协调与接收流程先保留，ArgusAgent 仅列候选，未试用。** [官方固定源码](https://github.com/microsoft/ArgusAgent/tree/fdfeb715b0749db176c7d8b3212a717fb81087ba)的论文把模型调用占用的可用时间与全日历时间分开，结果表五个 campaign 的约 95–99% 不是全体范围或全日历在线率；约 310 小时一次仅指研究判断请求，全部需人请求为 38 次／1,548 小时，原始 busy 占比为 32.4%，且未做同配置回放对照，不能据此替换现有长程协调或保证持续在线（[原定义、局限与覆盖](../research/2026-10-15-exploration-evidence.md#2026-11-15argus-无人值守指标与采用门槛)）。
