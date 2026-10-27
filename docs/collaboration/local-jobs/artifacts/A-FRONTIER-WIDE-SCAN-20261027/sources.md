# A-FRONTIER-WIDE-SCAN-20261027 · 原始来源广扫（单元 1）

> 读取截止 2026-10-27 08:20 UTC。主窗为 2026-10-22 至截止；为补全机制，少量 10-20 的官方发布按原日期单列。下列只作候选材料，不含推荐排名、采用结论或默认化建议。所有“已核”只指本次读到的公开页面、源码或接口返回，不等于安装、运行或效果验证。HN 的 points 与评论数只表示讨论量，不是效果指标。

## 本轮保留的候选

以下按证据类型分组，不是推荐顺序。四组都给出了可回源的原始位置和日期；消费者线索厚薄不同，社区反馈也在各自小节写明。

| 候选 | 一句解决什么 | 证据类型 | 本次找到的社区反馈 |
|---|---|---|---|
| Agent Skills 标准移交 AAIF + 独立技能扫描 | 安装、分发 Skill 前判断该审什么，以及标准今后由谁维护、怎样版本化 | 官方公告（10-22）+ 独立扫描（10-19） | HN 两条提交本次均未见评论；扫描报告本身是独立出版物 |
| Cursor Agent SDK | 把反复运行的 PR 审查、分诊 agent 做成可版本化、可评测、可部署的项目 | 官方发布（10-20）+ 可执行文档 + npm（10-25） | 未找到同题 HN 讨论或独立使用反馈 |
| Entire CLI 的会话 checkpoint | 把 agent 会话中的意图和过程与提交放在同一 Git 仓的旁路 ref，评审时可回看 | MIT 开源 CLI（0.12.2，10-26）+ 真实用户 HN 评论 | 正反都有，含价格、评审单位和营销质疑 |
| Claude Code 2.1.309／2.1.310 | 修正 `sed -i` 与 `/rewind` 的旧边界，明确嵌套 `CLAUDE.md` 超限和 worktree 取对象行为 | 官方 release notes（10-22／10-23） | 本窗未找到相关 HN 讨论或独立复测 |

## 1. Agent Skills 标准移交 Agentic AI Foundation，独立扫描给出安装审查的具体模式

**解决什么。** Skill 是“agent 会照着执行的文本”，但安装前的审查长期只有原则；本轮同时出现标准治理变化和一份对公开 Skill 文本的独立扫描，能回答“到底该查哪些行、标准会不会有版本和安全指引”。

**原始链接、日期与版本。**

- [Anthropic 公告](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation)，2026-10-22。公告称 70 多个 agent 平台（含 ChatGPT、Cursor、GitHub Copilot、VS Code）已接入 Agent Skills，已发布 100 万个 Skill、安装近 2.8 亿次；将 Agent Skills 的名称、logo、GitHub 组织和 `agentskills.io` 域名捐给 Linux Foundation 下的 Agentic AI Foundation（AAIF），并称已提出“版本化发布、正式提案流程、Skill 安全指引”的路线图。以上均为 Anthropic 自报，路线图本次未看到已发布的正式文档。
- [Agent Skills 规范](https://agentskills.io/specification)，本次读取 2026-10-27。`description` 必填、上限 1024 字符；`name` 上限 64 字符；`allowed-tools` 标为实验；frontmatter 没有必填的版本字段，示例中的 `metadata.version` 只是可选元数据。
- [agentskills/agentskills](https://github.com/agentskills/agentskills)（Apache-2.0）：`git ls-remote` 的 `main` 为 `69ef37e9424c0a7ea9dd2293b559e43ec8176379`；GitHub 仓库接口显示 `pushed_at` 为 2026-08-09；以 `since=2026-10-18` 查询 commits 返回 0 条。即公告所称的治理与版本化变化，本次在标准仓库里还没有对应提交。
- [独立扫描报告](https://theagentforge.io/reports/skill-scan-2026-10)：The Agent Forge，2026-10-19，报告版本 1.1、规则版本 2026-10-19.3。扫描 277 个公开 GitHub 仓库的 9,930 个唯一 `SKILL.md`；把 916 个安全课程／测试样例单列，普通 Skill 9,014 个。普通 Skill 中 30 个（0.33%，分布于 21 个仓库）命中高危模式，人工复核 26 个为真实模式、4 个误报，未发现恶意样本；报告自报精确率 87%。
- 扫描给出的具体模式：14 个文件（11 个仓库）把下载内容管道给 shell；8 个文件（5 个仓库）读取 `~/.env`、`~/.claude/.env` 或 `~/.openclaw/.env` 只为取一个 key；28 个文件关闭 agent 的权限确认；27 个文件修改 `AGENTS.md`／`CLAUDE.md` 等常驻指令；16 个文件把指令藏在 HTML 注释里；16 个文件读 `.env`。报告明确说这些文本模式不等同恶意，也不能证明其余文件安全；ClawHub 不在样本内，17 个仓库在 11-02 前匿名。

**实际消费者与采用证据。** 公告给的“70+ 平台、100 万 Skill、2.8 亿安装”是厂商口径，没有逐项清单；扫描报告的 277 个仓库是可核的实际样本，但它证明的是“这些仓库里有 Skill 文本”，不是“这些项目因 AAIF 移交改了配置”。本次没有找到因移交而出现的具体 PR 或迁移提交；标准仓库在截止日也没有新提交。因此这条候选的“真实消费者”证据只能到“公开 Skill 的规模与文本模式”这一层。

**社区正反反馈。** HN 提交 [50198911](https://news.ycombinator.com/item?id=50198911)（2026-10-22，5 points）和 [50246751](https://news.ycombinator.com/item?id=50246751)（2026-10-26，1 point）本次均未见可读评论，不能当作社区认可或反对。扫描报告是独立发布，不是社区讨论；其方法、抽样和 87% 精确率均由作者自述，本次未复跑。

**与本仓差异。** `docs/05-skills-and-plugins.md` 已写 `description` 上限 1024 字符、渐进式披露三阶段，以及“审查实际下载版本的指令、脚本、动态命令、Hook、连接和依赖”；`docs/00-state-of-ai-coding.md` 已链 `agentskills.io`，`docs/12-resources.md` 链的是 GitHub 规范仓。本项新增的是：标准移交 AAIF 的治理事实、公告提出的版本化／提案／安全指引路线图尚未落地、以及独立扫描给出的危险模式分布。它不改变“安装前审查”的结论，只把审查对象具体化。

**值得 dot-A 核实的关键未知。** 规范允许 1024 字符描述，而宿主可能因 Skill 数量截断描述；两者在实际客户端里如何取舍未验。AAIF 的版本化发布与提案流程何时真正建立、是否会给 `SKILL.md` 增加版本字段，本次看不到。扫描只读文本，不执行脚本，也不覆盖 ClawHub、私有 Skill 和运行时下载；17 个匿名仓库的结果要等 11-02 后才能核对。公告中的 100 万／2.8 亿没有分母说明，不能直接当采用率。

## 2. Cursor Agent SDK：把常驻审查／分诊 agent 做成版本化项目

**解决什么。** 团队反复运行的 PR 审查、分诊、合规 agent 过去常绑在某个产品的 dashboard 提示词上，难版本化、难测试、难回放事件；这条候选把 agent 的指令、工具、评测和部署入口都放进一个可提交的项目。

**原始链接、日期与版本。**

- [Cursor 公告](https://cursor.com/blog/agent-sdk)，2026-10-20，作者 Rustam Lalkaka。公告称 Agent SDK 是 Cursor 用来构建 Bugbot、Security Reviewer、Rollouts 的同一套 harness；agent 由 Markdown 指令、TypeScript 工具、连接和 evals 组成；`agent-sdk deploy` 可部署到 Cursor 基础设施，也可作为单个 Node 进程打包自托管；支持 agent 之间移交任务、并行子 agent、evals 和事件回放。
- [Agent SDK 文档](https://cursor.com/docs/agent-sdk.md)，本次读取 2026-10-27。要求 Node 22.13 或更新；安装 `npm install --global @grok/agent-sdk`；命令为 `agent-sdk init`、`dev`、`validate`、`run`、`deploy`；文档写明这个包以前叫 `@cursor/bdk`。
- [PR reviewer 快速开始](https://cursor.com/docs/agent-sdk/quickstart.md)：给出可复制的完整路径——先让 agent 调 `inspect_pr`，按 `trivial`／`moderate`／`large` 决定批准或转人工；提示词要求跑两个 tool-call 检查、核对复杂度、发 GitHub review 前先问人、跳过 deploy，最后跑 `validate` 和 TypeScript 检查。另有 [项目布局](https://cursor.com/docs/agent-sdk/reference/project-layout.md)、[review 模板](https://cursor.com/docs/agent-sdk/templates/reviews.md) 和 [owners-policy approver 模板](https://cursor.com/docs/agent-sdk/templates/agentic-owners.md)。
- npm：`@grok/agent-sdk` 最新 `0.3.0`，2026-10-25T20:04Z 发布；前一版 `0.2.29` 为 2026-10-23T22:41Z。`@cursor/bdk` 也存在且最新同为 `0.3.0`；`@cursor/agent-sdk` 在 npm 返回 404（本次查询）。

**实际消费者与采用证据。** 公告称 Cursor 内部一个团队用 Agent SDK 约一天做出 `kb-reviewer`，在主干每个 PR 上运行，标出与既有经验条目冲突的改动并引用原条目；PGA Tour 的 Principal Engineer Michael Gyarmathy 以客户引语称其“software factory 的每个组件”都建在 Cursor 基础设施上，evals 帮助快速迭代。两者都是厂商刊载的自报，本次没有找到公开仓库、PR 或独立复测。

**社区正反反馈。** 本次在 HN 未找到 2026-10-20 这篇公告的讨论；2026-04-30 的旧 TypeScript SDK 帖只有 3 points、0 评论。没有可引用的社区正反原文，不能把公告里的客户引语当独立评价。

**与本仓差异。** `docs/16-building-agents.md` 讲自建 agent 的结构，`docs/09-review-and-quality.md` 讲评审入口；本项新增的是“审查／分诊 agent 以 Markdown+TypeScript 项目交付，带 evals、事件回放、CLI 验证和部署／自托管”这一具体形态。它不证明 eval 能抓住真实回归。

**值得 dot-A 核实的关键未知。** 公告代码示例写 `import { defineAgent } from "@cursor/agent-sdk"`，但该包在 npm 不存在，文档要求 `@grok/agent-sdk`；博客与文档至少有一处已过期，照抄前必须核实际包名。evals 与事件回放在真实 PR 回归上的效果、托管与自托管的行为差异、额度和价格，公告都没有给出可复算数据。Node 单进程自托管是否包含模型调用凭据和沙箱，需要读实现或实际运行才能确认。

## 3. Entire CLI：把 agent 会话作为 Git ref 与提交放在一起

**解决什么。** PR diff 只保留结果，agent 会话里的意图、死路和被否方案在会话结束后丢失；这条候选把提示、transcript、会话上下文和 checkpoint 元数据存进同一个 Git 仓库的旁路 ref，并让评审界面回看这些内容。

**原始链接、日期与版本。**

- [HN 故事 50247453](https://news.ycombinator.com/item?id=50247453)，2026-10-26，55 points、36 条评论；提交的原文是 [Entire 博客《The Git Forge for Agent-Human Collaboration》](https://entire.com/blog/the-git-forge-for-agent-human-collaboration)。文章主张 agent 写出大部分代码后，PR 不再是合适的评审单位，应把会话、检查与 eval 一起作为评审对象。
- [Entire CLI 仓库](https://github.com/entireio/cli)，MIT；`main` 为 `b6900cf9f71bfbebc68b88860892e8ae5bad30b8`（2026-10-26）。[CHANGELOG](https://github.com/entireio/cli/blob/b6900cf9f71bfbebc68b88860892e8ae5bad30b8/CHANGELOG.md) 的 `0.12.2` 日期为 2026-10-26；[README](https://github.com/entireio/cli/blob/b6900cf9f71bfbebc68b88860892e8ae5bad30b8/README.md) 称支持 Claude Code、Codex、Cursor、Copilot CLI、OpenCode、Antigravity、Factory AI Droid、Pi 等，Trails 可在每次 push 上跑可定制的 evals。
- [会话存储文档](https://docs.entire.com/guides/checkpoints/checkpoint-storage)：默认是 ref-based，每个 checkpoint 一个 `refs/entire/checkpoints/<shard>/<id>`；提示、transcript、会话上下文和 checkpoint 元数据存在 checkpoint storage，代码留在源分支，正常 Git 历史保持干净；多 remote 时只选一个 checkpoint 同步 remote；也可推到独立仓库或只留本地。文档页标注“核对于 Entire CLI 0.10.2”，与仓库 0.12.2 有版本差。
- `0.12.2` 的 changelog 还写明：`entire enable` 结束时列出仍需提交的配置（`.entire/settings.json`、`.entire/.gitignore`、每个 agent 的 hook 配置和 Skill 文件），交互终端会询问是否只提交这些文件；`transcript.jsonl` 的 assistant 行开始记录每次调用的模型、输入／输出／缓存／推理 token 用量（当前为 Claude Code、Codex、Pi）。

**实际消费者与采用证据。** 同一作者 alexzhues 的两条评论：[50248753](https://news.ycombinator.com/item?id=50248753)（2026-10-26）称已用一个月并推荐；[50251718](https://news.ycombinator.com/item?id=50251718)（同日，回复 50249566 的追问）称在大型 monorepo 里用 Runners 自动评审、默认规则“够好”。[50249132](https://news.ycombinator.com/item?id=50249132) 称用 checkpoints、正在试 Trails，“回不去了”。厂商 Field CTO [50247704](https://news.ycombinator.com/item?id=50247704) 主动标明身份，并澄清会话是写进仓库的 git refs、不是侧数据库。上述三条使用者评论均为使用者自报，没有第三方复测或公开采用提交；厂商回复则是厂商自报。

**社区正反反馈。** 正面集中在“为什么”被保留、流程不必回退；负面有：[50255682](https://news.ycombinator.com/item?id=50255682) 反问如果工单／规格已经记录意图，为何还要这个工具；[50247949](https://news.ycombinator.com/item?id=50247949) 认为博文营销过多，自己不会选 Trails 视图；[50248188](https://news.ycombinator.com/item?id=50248188) 找不到价格，要求免费期或可预期的账单。厂商回复 [50248247](https://news.ycombinator.com/item?id=50248247) 给出 [billing 文档](https://docs.entire.com/billing) 链接，称只对 Agents 收费并有 $100 注册额度；[50248813](https://news.ycombinator.com/item?id=50248813) 称 CLI 为 MIT、存储后端 EntireDB 正在开源、会话存在仓库；两条均为厂商自报。[50247606](https://news.ycombinator.com/item?id=50247606) 认同 PR 不再够用，并指出“why”在会话结束时就消失，这是工具要解决的问题而不是反对意见。价格与数据驻留仍是评论里最具体的阻碍，厂商已在同帖回应，但计费与自托管细节未核。

**与本仓差异。** `docs/20-codex-long-horizon.md` 已收 Pi Durable、River、AgentRewind 的续接与恢复，`docs/08-multi-agent.md` 收 worktree 隔离；本项新增的是“会话作为提交旁路 ref 存储 + 评审时回看”的具体存储契约和真实用户正反反馈，未在本仓出现。

**值得 dot-A 核实的关键未知。** 文档按 0.10.2 核对、仓库已到 0.12.2，ref 路径与 push 行为要按新版重核。checkpoint 里的 transcript 可能含提示、代码片段或凭据；默认 redaction 范围、push 体积和跨区域复制成本未核。Trails 的 eval 是否能区分真实回归、存储后端 EntireDB 的开源时间、自托管实际行为与计费细节、以及 HN 正面用户是否与项目有关联，都未核。

## 4. Claude Code 2.1.309／2.1.310：恢复、隔离与上下文的三处语义变化

**解决什么。** 已有做法可能依赖 `/rewind` 撤销 `sed -i` 改动、依赖超大嵌套 `CLAUDE.md` 正常加载、或假设 partial clone 的 worktree 会按需取对象；这两版发布说明把其中几条边界改掉了。

**原始链接、日期与版本。**

- [v2.1.309](https://github.com/anthropics/claude-code/releases/tag/v2.1.309)，2026-10-22T22:18:57Z。与本项直接相关的三条：
  - `sed -i` 改成标准 Bash 提示、按原样执行，不再是“模拟的文件编辑预览”；和 Bash 的其他编辑一样，不再由 `/rewind` 恢复。
  - 读取超大嵌套 `CLAUDE.md` 后反复压缩的问题修复；超过大小限制的嵌套 `CLAUDE.md` 现在只加载开头。
  - worktree 创建与复用不再按需 fetch 对象；普通 clone 和配置了 Bash sandbox 的 partial clone 都受影响，partial clone 会先取对象。
  - 同版还把 `--add-dir` 中同名 Skill 改为 `<folder>:<name>` 暴露，并让 `/verify`、`/code-review` 能找到被 shell 改动过的嵌套包自己的 Skill。
- [v2.1.310](https://github.com/anthropics/claude-code/releases/tag/v2.1.310)，2026-10-23T23:39:00Z。相关条目：Monitor 工具和插件 monitors 在 Bedrock、Vertex、Foundry 以及遥测／非必要流量关闭时可用，长前台 sleep 同时被阻止；prompt-too-long 后压缩保留过多 dense text 的问题修复；非交互会话中 MCP 工具调用超时且 elicitation 未答时，错误会告诉模型“没有回答，不要重复调用”。
- 同版本线的 2.1.311（2026-10-26）已在任务中列为已处理，本单元不重复。

**实际消费者与采用证据。** 只有 Anthropic 官方 release notes；本次没有找到独立复现、PR 或用户实测。发布说明是官方契约，不等于所有 provider、终端和扩展都按同一路径工作。

**社区正反反馈。** 以 `sed -i`、`nested CLAUDE.md`、`2.1.309`、`Monitor tool` 在本窗 HN 评论中查询，未找到相关讨论；不能据此说没有影响，只能说本次社区渠道没有覆盖。

**与本仓差异。** `docs/01-agents/claude-code.md` 已写“当前会话捕获的编辑可用 `/rewind`；Bash、子 Agent 或其他会话改过的工作按 Git diff／提交确认”，`docs/03-context-engineering.md` 有指令预算和子目录 `CLAUDE.md` 的用法，`docs/08-multi-agent.md` 有 worktree 隔离。本项新增的是把 `sed -i` 从旧的“模拟编辑预览”明确划到 Bash（即旧例外被移除）、嵌套文件超限只读开头、以及 worktree 不再按需 fetch。它确认而非推翻现有“Bash 改动不假定可 rewind”的结论。

**值得 dot-A 核实的关键未知。** release notes 没给嵌套 `CLAUDE.md` 的具体大小阈值；`/rewind` 的 UI 是否仍把 `sed -i` 列为“代码改动”未验；Monitor 工具在非 Anthropic 后端的行为没有独立测试。若要更新文档，应回官方 checkpointing／worktree 文档核当前契约，而不是只引 release notes。

## 窗口前后补核：已收录工具的版本变化

`docs/09-review-and-quality.md` 当前按 `security-guidance` 2.0.13 写。官方插件仓在窗口前后把它升到 2.0.16（2026-10-21）和 2.0.17（2026-10-27），并合入以下评审内部度量改动：

- [#6903](https://github.com/anthropics/claude-plugins-official/pull/6903)：reviewer stage metrics。
- [#6858](https://github.com/anthropics/claude-plugins-official/pull/6858)：prompt capture time。
- [#6836](https://github.com/anthropics/claude-plugins-official/pull/6836)：diff seen count。
- [#6839](https://github.com/anthropics/claude-plugins-official/pull/6839)：network failure class。
- [#6861](https://github.com/anthropics/claude-plugins-official/pull/6861)：fail metric。
- [#6908](https://github.com/anthropics/claude-plugins-official/pull/6908)：2.0.17 版本 bump。

其中 #6903 的标题与说明都标明 “measure only”，在 commit review 行新增一个内部度量键 `rv_effort`（把 turns 与 model_ms 编码成一个数），并不改变调用、提示或输出。这些是内部度量埋点，不是用户可查看预算／完成情况的入口；本次没有运行插件，也没有看到指标样例，`rv_effort` 在何处可见、是否足以判断预算或评审质量均未核。

## 去重基线

以下内容本仓已有，本单元只核差异、不重写：

- `docs/13-frontier-radar.md` 与 `docs/collaboration/inbox.md`：Portless、Next.js 按源码变化构建、dotagents、pr-test-analyzer、Anthropic SDK 迁移、GPT-6.1 Terra、show-me／Hippo／context-mode、agent-browser、opensrc 等。
- `docs/05-skills-and-plugins.md`：Agent Skills 目录结构、`description` 1024 字符上限、渐进式披露三阶段、安装前审查原则。
- `docs/09-review-and-quality.md`：`security-guidance` 2.0.13 的运行层、数据路径和依赖准备。
- `docs/15-task-playbooks.md`、`docs/01-agents/codex.md`、`docs/research/2026-10-12-baml-and-review.md`：OpenAI Core Experimentation 的 2026-10-14 维护实践、模型／effort 成本与 63 项测试案例。
- `docs/05-skills-and-plugins.md` 与 `docs/collaboration/reviews/2026-10-21-quality-audit-sota-cards.md`（S04）：OpenAI 2026-09-11 的 skills／prompts 重审文章及其“随模型升级清理过度指导”的结论。
- `docs/research/2026-10-15-exploration-evidence.md`：Anthropic “Redesigning source control at Anthropic”（Scion／Antique，2026-10-13）及其适用边界。
- Anthropic Claude Code 2.1.311（2026-10-26）：任务明确已处理，本单元只看 2.1.309／2.1.310。

## 未覆盖与读不到

- **Reddit 未覆盖。** `www.reddit.com` 的 JSON 与页面请求均以 TLS handshake 失败（curl schannel），本轮没有 Reddit 原帖；不能用转载或搜索摘要代替。
- **OpenAI 新闻首页 403**，改用 `developers.openai.com` 的博客页与 `.md` 版本；两篇博客的 HTML 页分别显示发布日期 Oct 14, 2026 与 Sep 11, 2026（`.md` 版不带日期），本仓按此记录。HN 提交（10-17、09-12）更晚，是转贴时间，不能反推发布日期。
- **GitHub 未认证 API 限额 60 次／小时**，末段只剩 3 次；未做 GitHub code search（需认证），只查了指定仓库的 commits、releases 和固定文件。不能给 star 增长或全仓采用率结论。
- **HN 只读 Algolia 返回的 story／comment 对象**：story 的评论树按对象取，单帖最多读前两层、每层前几条；没有穷举全部 36 条或 100+ 条评论，也没有读折叠或已删除内容。
- **LINUX DO、V2EX 按任务分工不采**（A-COMMUNITY-PRACTICE-SCAN-20261027）；X、作者个人博客和 newsletter 未系统检索。
- **A-FRONTIER-SOURCE-COLLECTION-20261027 的跨包 API／下游契约线未重做**；Biome、tRPC、Effect 等入口没有展开。
- 没有安装、运行或调用任何候选；所有效果、价格和采用数字均为来源自报或官方口径。

## 排除项与不保留理由

| 候选 | 日期与热度 | 不保留为候选的原因 |
|---|---|---|
| [Tasks as Code](https://typemill.net/knowledge-hub/tasks-as-code) | HN [50241924](https://news.ycombinator.com/item?id=50241924)，2026-10-26，47 points／52 评论 | 内容是 Typemill（文档 CMS）的实践文章，属厂商内容；评论集中反对把工单塞进 Git 历史（干系人无仓库权限、双重真源、提交历史被污染），没有给出可核的真实采用。可作“Agent 任务放哪里”的反面材料，不足以进候选。 |
| [ADRs for AI](https://adrs.systems) | HN [50227041](https://news.ycombinator.com/item?id=50227041)，2026-10-25，66／54 | 作者自推，评论大量批评页面是 AI 生成的营销文本；机制与现有决策记录重叠。一条较具体的实践反馈是 [50242080](https://news.ycombinator.com/item?id=50242080)：把 spec Markdown 放到相关代码旁，并要求 review Skill 加载它，而不是维护一份 AI wiki。另有评论指出 ADR 必须维护 supersede／deprecated 关系，否则互相冲突的文档会让模型更困惑。可作为“文档放哪里、怎样退役旧决定”的线索，但没有独立采用或效果数据。 |
| [LayerFS](https://layerfs.ai) | HN [50179857](https://news.ycombinator.com/item?id=50179857)，2026-10-21，76／47 | 声称比 btrfs 少约 20 倍空间，但没有第三方复测；评论质疑文件系统稳定性、专利先例和“vibe coded”风险。它是 agent 工作区的版本化文件系统候选，不是已可借用的编码做法。 |
| [OpenAI CLI](https://github.com/openai/openai-cli) | HN [50191507](https://news.ycombinator.com/item?id=50191507)，2026-10-22，244／111 | 官方 REST API 的批处理 CLI，和 Codex／agent harness 是不同层；讨论集中在产品边界、订阅额度和弃用风险，没有编码工作流证据。 |
| [Corgi](https://corgi.computer)、[Hob](https://github.com/FrigadeHQ/hob)、[Omnara](https://github.com/omnara-ai/omnara) | HN [50214373](https://news.ycombinator.com/item?id=50214373)（140／46）、[50246238](https://news.ycombinator.com/item?id=50246238)（140／32）、[50183892](https://news.ycombinator.com/item?id=50183892)（114／34），10-21～10-26 | 三个产品发布。Corgi 有一个月使用者称可替代 cmux，Hob 有用户抱怨 18GB 模型无法清理，Omnara 的 durable harness 讨论集中在“日志即 agent”和 Postgres 队列；都没有独立评测，配置是否可复用也未核。Omnara 的机制与 `docs/20` 已收的 Pi Durable／River 重叠。 |
| [The State of Context Engineering](https://www.dbreunig.com/2026/10/24/the-state-of-context-engineering.html) | HN [50235780](https://news.ycombinator.com/item?id=50235780)，2026-10-25，261 points | 有真实讨论，但主体是经验文章，没有实现或配置可核；评论对“200k～300k 就重置”分歧明显（有人认为新模型不再成立）。`docs/03` 已有 context rot 与压缩边界，暂不单列候选，保留为背景。 |
| [OpenAI Maintaining software](https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family) | 2026-10-14，已被本仓多处引用 | 维护流程、模型／effort 成本和 63 项测试数字已在 `docs/15`、`docs/01-agents/codex.md`、`docs/research/2026-10-12-baml-and-review.md` 处理；本窗没有新事实。唯一可补的是“重放同一条 AGENTS.md 指令做 A/B”的提示词，但官方 skills 文已给同类判断，且没有公开结果，未单列。 |
| [OpenAI Rethinking skills and prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) | 2026-09-11，已被本仓引用 | `docs/05` 与 2026-10-21 质量审计卡 S04 已收“随模型升级缩窄触发、清理过度指导”。另核到公开仓库 `openai/skills` 的 `main` 仍是 `49f948faa9258a0c61caceaf225e179651397431`（与 2026-10-10 文档引用同一提交），本次在该提交的 `skill-creator` 里仍能看到“clear and comprehensive”的长描述示例；博文所称“最近更新”无法从该仓库核实，留作缺口。 |
| [Anthropic Redesigning source control](https://www.anthropic.com/research/redesigning-source-control) | 2026-10-13，已在本仓探索证据 | Scion／Antique 的职责迁移、人工审意图和“不是通用 Git 替代”的边界已在 `docs/research/2026-10-15-exploration-evidence.md` 记录；本周没有新发布或新采用。 |

## 探索回执

读取截止 2026-10-27 08:20 UTC。实际渠道：Anthropic 新闻／工程页、Cursor 博客与文档、OpenAI Developers 博客（Markdown 版）、GitHub 仓库 API／raw 文件／`git ls-remote`、HN Algolia story 与 comment、npm registry、theagentforge.io、entire.com 与 docs.entire.com。读不到：Reddit（TLS handshake 失败）、OpenAI 新闻首页（403）、GitHub code search（未认证）、以及超出未认证 API 配额的仓库历史；LINUX DO、V2EX 按分工不采。
