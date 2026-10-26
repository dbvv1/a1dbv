# 09 · 评审与质量

> 核实时间：2026-10-24（UTC+8），接收路线补充 2026-10-25、10-26；代际复核 2026-10-22（含离线筛选与生产窄试）。依据见各节末行；旧数据、全部外链与当前模型效果未复验，历史范围见[历史核实范围](research/2026-10-10-audit.md#09-评审页历史核实范围)。

## 30 秒结论

**第一步：每次提交跑格式化、lint、类型检查和单元测试；推送前作者对照需求、diff 与现有测试自查。** 仍有具体风险时，用 `/code-review`（Claude Code）或 `/review`（Codex）做一次定向评审。

- **✅〔跨代保留〕保留确定性检查和按风险的人审；需要第二视角，先用原生本地评审。** Agent 找证据与候选缺陷，人判断需求、风险和接收；更强模型不自动取消项目准入。
- **✅〔10月补充〕按原验收和实际消费者判断接收，不以意见数量判完成。** 先分应修／保留／待证据；修后只复验受影响差量和同一消费者路径；未验项单列，不悄悄删除。做法见[从实现产物到可接收交付](#从实现产物到可接收交付)。
- **🧪〔10月修订〕明确漏审缺口后，再扩云端多 Agent 或交叉模型。** 用事故样本和确认无须修改的 PR 一起校准，既看新增有效发现，也看是否诱发有害修改；只多评论、不减总处理负担就收窄。
- **⛔〔跨代保留〕重复发现、无效修补或费用失控时，不继续堆轮次。** 核实际入口、规则加载和完成状态；成功退出或空评论不是安全验收，复审优先看新差异与未关闭风险。

代际范围：2026年10月原生评审入口／GPT-6.1 Sol与Claude 5.5时代；团队托管review的实际模型组合未公开。标签见 [00](00-state-of-ai-coding.md#30-秒结论)。

**依据**：[一手／研究] 条件采用，当前效果排名未知；核实 2026-10-24（代际复核 2026-10-22）。

## 当前最高水平与默认的变化

<!-- frontier: status=已比较 gap=1 gen=2026-10 checked=2026-10-21 -->

**整体最高水平未知；相对测试＋PR人审的常见基线，本页采用比较后的可行默认：把自动评审前移到每个 PR，同一 diff 跨入口去重；此前确已审过且未受新改动影响的部分，才可复用原结论。** 这个默认借的是 Claude Code 团队的校准机制和 Cursor Bugbot 的增量复审，不是直接复制全量托管：Claude 的流程依赖可信作者、可回滚发布和事故跟踪；Bugbot 先查新差异、避免重复意见，但未证明少轮次就少漏审。两项机制都是厂商自报，不是同预算优胜比较。

**先补未覆盖范围，再做增量复审。** 对照本次 Git 变更全清单、实际送审文件与截断／省略提示；原评审范围内，未变但从未审过的文件仍是欠项。Cursor 本地 Bugbot 已会列出大 diff 的遗漏文件，但同一差异、同一 Diff 设置重跑仍组装同一文件包，Custom Instructions 不能补入裁掉的文件。未提交部分可改审 `uncommitted changes`；已提交的遗漏文件，交普通 Agent 显式对基线补审。别把反复跑同包当补齐覆盖，也不必为此重复已充分审过的全部范围。

| 同题选择 | 当前参照 | 本页决定 |
|---|---|---|
| 自动评审的起点与扩量 | 原生评审起步，按事故集和干净 PR 校准 | 采用校准与收敛机制；缺少回滚和风险准入时保留人审 |
| 多 Agent／交叉模型是否默认 | 厂商托管评审与同题研究 | 不默认；明确漏审缺口后先窄试 |
| 离线比较胜出后是否全量替换 | ReviewBench 接生产 A/B | 先窄试，人抽核实际修补；只多评论或改动、没有合格交付增量就保留现行入口 |

**先在一个仓库比较现行原生评审与候选层。** 把真实事故及已修补案例转为漏审检查，也放入确认无须修改的PR，观察评论是否会引出错误修补；人核发现与处理结果，Agent不得为清空意见自行扩大修改。模型、提示或工具升级后重评；事故或误改上升就恢复更严检查。详细证据与反方见本节依据。

**旧效果不冒充当前代。** CRBugBench v1 的单评审／五候选比较用GPT-5.6 Sol、Opus 5及copilot-cli 1.0.74，不是GPT-6.1或Claude 5.5的原生评审测评；支持先试更轻配置，不证明当前多Agent必然不值。§1的2025调查和跨年观察数据只选抽检方向，不估当前代缺陷率。

**离线胜出后，先核线上指标代表什么。** ReviewBench的10月5日复盘把固定缺陷集比较接到生产A/B；线上addressed rate只表示模型判断评论促成了对应修改，不保证修对。Agent按目标风险整理有效发现与漏项，不以评论数判收益。

**按你的评审范围选判据。** 固定版本的ReviewBench分类器允许既有或改动外问题算TP；只检查本次新增风险时，先区分范围，不为基准得分扩大修补。跨候选用固定gold的grounded recall比较覆盖，新增发现另核；augmented recall的分母随候选改变，不单独用于排名。源码、公开入口与采用边界见本节依据。

**依据**：[一手] [Claude Code团队10-15复盘](https://claude.dev/blog/solving-code-review-at-anthropic/)、[Cursor 6-10更新](https://cursor.com/blog/bugbot-updates-june-2026)、[本地 Bugbot 10-07 省略提示修复](https://forum.cursor.com/t/review-bugbot-on-a-large-local-branch-reports-bugbot-found-no-bugs/173568)、[10-14 支持回复：同 Diff 重跑仍同范围](https://forum.cursor.com/t/local-review-bugbot-always-skips-the-same-files-on-a-large-diff/174649/6)（2026-10-26 复核官方说明，未运行 Bugbot）、[ReviewBench的10月5日复盘](https://github.blog/ai-and-ml/reviewbench-an-open-benchmark-for-ai-code-review/)；[研究] [CRBugBench v1](https://arxiv.org/html/2610.13668v1)、[代际研究](research/2026-10-12-baml-and-review.md#p52评审代际复核)、[研究记录](research/2026-10-12-baml-and-review.md#p72审计补强离线评审怎样进入放量)；[研究：采用层级／采用判断／代际边界] 本页默认、扩量条件与旧效果边界；核实 2026-10-24（代际复核 2026-10-22）。

## 1. 质量数据：AI 代码的真实代价

**先用这些质量信号选择抽检重点，不把相关性或厂商数据当作 AI 致因的证明。**

| 来源 | 发现 |
|---|---|
| GitClear × GitKraken《The Maintainability Gap》（2026-06；2023–2026 年中累计数据） | 报告的重复指标相对增加 **81%**，但落地页正文与报告图页的单位冲突，不能据此设重复率阈值；代码移动占变更行由 2023 年 **12.7%** 降至 2026 YTD 的 **3.8%**，只是重构代理指标的占比，非重构工作量下降。旧代码更新也按占比统计，不能推断维护绝对量减少。可提示抽检重复、复用与错误处理；公开材料不足以把变化归因于默认 AI 工作流，方法及口径边界见依据行 |
| Faros AI《The Acceleration Whiplash》（2026 Q2，2.2 万名开发者、4,000 个团队、两年遥测） | 同一组织最低与最高 AI 采用时期相比，事故数／已合并 PR 数之比约 **3.4 倍**，PR 在评审中停留时间中位数约 **5.4 倍**；代码 churn（季度内已合并代码删行／加行比）约 **9.6 倍**，不能全部译成返工，也可能含有益重构。事故比率不是单个 PR 致事故概率，评审停留不等于主动阅读工时；厂商公开详解未提供完整方法，不能外推本团队恶化幅度 |
| Stack Overflow 2025 调查，该多选题 31,476 人作答 | 66% 选择遇到“几乎正确但仍有问题”的 AI 方案，45% 选择调试 AI 代码更费时；这是受访者遇到的挫折，不是输出缺陷率、合并率或实测返工成本 |
| Anthropic 长时应用开发复盘（2026-03） | 自评偏宽松在主观设计上尤其明显；作者也发现新模型已能独立完成的任务中，额外 evaluator 会成为负担。只支持对具体缺口增加外部验证，不支持固定多轮互评；原文与撤去环节见依据行 |
| *A Few Pages of Markdown*（arXiv 2608.25241v2） | 441 个仓库用于开发分类器，另在 509 个开源处理仓库中的 agent-first 分层比较：观察期未检出 AI IDE 配置痕迹的仓库，无／有提交配置组的 +52.7%／+26.7% 是作者对认知复杂度 `log(Y+1)` 系数作 `expm1` 的换算，非原量均值直接涨幅。终点配置多在采用 Agent 同期或之后出现，不能把增幅差归因于配置；分组与方法边界见依据行 |

**实践推论**：这些相关性和厂商数据值得用来选择抽检重点，但不能单独证明 AI 导致了上述变化。评审可特别检查重复是否造成同步修改负担、异常处理是否真正吞掉必要信号、改动是否绕开已有抽象；不要为提高指标而机械增加旧代码改动、函数调用或重构配额。

**对评审的启示**：

1. 把评审重心前移到**设计**（类型、接口、调用关系），而不是等 2000 行 diff 出来再看；
2. 让 Agent 按可运行、可评审的**垂直切片**提交；按行为、接口和风险设置检查点，不以固定行数作为审批门槛；
3. 测试代码本身要像需求一样认真审。

**评估缺口与训练解释分开。** Dex 从快速测试型奖励的局限推测模型难学维护性、更多评审不能提高上限（作者假设）。应检查后续修改，但公开 benchmark 不代表全部训练信号，生成与评审的输入、搜索机会也不同，不能据此断言模型不可能改善。BAML 双 PR 与原文复核记录具体反例和边界；更广的采用分析见 [14](14-synthesis.md#1-规律一验证覆盖与自主权分开判断)。

**依据**：[一手：厂商公开材料，观察性；仅读公开摘要与报告图页，完整 PDF 未取得] [GitClear 报告](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)、[核对记录](research/2026-10-12-baml-and-review.md#gitclear维护信号的分母与采用边界)；[一手：厂商公开页及详解，观察性] [Faros AI 报告](https://www.faros.ai/research/ai-acceleration-whiplash)、[十项详解](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways)；[一手：自报调查] [Stack Overflow 2025 调查](https://survey.stackoverflow.co/2025/ai)，该多选题 31,476 人作答；[一手：作者实验自述] Anthropic 长时应用开发复盘（2026-03）、[原文与撤去环节](research/2026-10-12-long-task-evidence.md#3-历史-harness-自己已经撤去哪些环节)；[研究：全文；一手：分析代码；经验：分组／换算复核] *A Few Pages of Markdown*（arXiv 2608.25241v2）、[分组与方法边界](research/2026-10-13-context-study-reassessment.md#a-few-pages分组时间与维护)；[社区：作者假设] Dex、[BAML 双 PR 与原文复核](research/2026-10-12-baml-and-review.md#baml实现反馈纠正研究计划)；[经验：建议／采用判断] 实践推论与评审启示；核实 2026-10-24（代际复核 2026-10-22）。

## 2. 评审手段

**先按评审位置选入口，再按风险加层；默认不逐层叠加。**

<a id="按风险选择评审层不默认逐层叠加"></a>

### 按风险选择评审层

**从确定性检查和作者自查开始，按实际漏项逐层增加。**

| 层 | 什么时候 | 用什么 | 拦什么 |
|---|---|---|---|
| 0. 确定性检查 | 每次保存或提交 | 格式化、lint、类型检查、单元测试（Hook 或 pre-commit） | 机器能判定的问题；增量运行另核[相关测试是否被选中](15-task-playbooks.md#6-补测试)。**不要让 AI 评审去报这些** |
| 1. 作者自查 | 推送前 | 先对照需求、diff 和现有测试；仍有具体风险时调用原生评审 | 实现遗漏与尚未覆盖的行为 |
| 2. 额外 Agent 评审 | 已有检查仍漏掉某类问题，且新增发现值得人的核查投入时 | 先比较单 Agent 的提示调整／原生能力，再试独立或多模型评审 | 目标风险上的新增有效发现；不重复 CI 已报问题 |
| 3. 人工评审 | 按项目准入与变更风险，合并前 | 按 [第 1 节](#1-质量数据ai-代码的真实代价)看设计、重复、错误处理及测试；先自行确认关键路径，再核对 AI 意见 | 需求取舍、设计与未被建议覆盖的风险，不只批准 AI 列出的项目 |
| 4. 抽样复盘 | 每周或每月 | 抽查已合并的 AI PR、AI 评审漏掉的线上问题 | 校准前三层：把漏网的问题写进实际入口读取的规则文件或测试 |

**存量安全漏项可试定向审计，不把模型 confirmed 当漏洞成立。** 🧪 目标版本、信任边界与接收人明确时，让 Agent 查跨路径／文档契约并交可复核候选；已有静态分析、测试和人审保留。没有可复核材料、只有重复告警或核查负担过高就收窄／停止，不自动上报、合并或部署。AI拟复现与补丁，人判影响、验证及发行；curl／Firefox接收与反例不证明自动审计净收益。

**依据**：[一手／研究] 存量安全审计候选与维护者接收，未实测；[研究] [curl／Firefox接收与反例](research/2026-10-12-baml-and-review.md#存量安全审计候选发现到维护者接收)；核实 2026-10-24。

### 本地 / 会话内

**先手选与当前缺口匹配的本地入口，再按风险决定是否加独立评审。**

| 手段 | 说明 | 评级 |
|---|---|---|
| `/code-review`（Claude Code 内置） | 本地评审，按正常用量计费；读 `CLAUDE.md`，不读 `REVIEW.md`。默认后台运行；终端 fork 继承历史，覆盖随模型、effort 变化 | ✅ 定向使用 |
| Codex `/review` | 本地选择未提交改动、某次提交或相对基线；报告发现，不改工作树；认证可选 ChatGPT 或其他支持方式，不能统称为仅订阅入口 | ✅ 定向使用 |
| `/code-review ultra` / `claude ultrareview` | 云端多 Agent，需 claude.ai 认证，正常本地用量之外计费；先确认实际启动云端及评审基线，CI 完成条件见下文 | 🧪 高风险变更 |
| `/security-review` | 按需安全审查；与自动运行的安全插件分开选择 | 🧪 定向使用 |
| `security-guidance` 插件 | 官方市场 2.0.13 含编辑提醒、Stop diff 与 commit／push 评审；依赖、外发和费用见下文 | 🧪 有持续安全评审缺口时 |
| `/simplify` | 只看复用、简化、效率，不找 bug | 🧪 |
| 自定义评审子 Agent | 已有明确的漏审类型或复杂变更需要独立检查时使用（模板：[code-reviewer](../templates/generic/.claude/agents/code-reviewer.md)） | 🧪 按风险试用 |
| **另一家的模型交叉评审** | 比较新增有效发现、误报和审查成本；换品牌不自动获得独立证据 | 🧪 不默认每次互审 |

**🧪 规则多、语言混合时，可把规则准备与模型评审拆开。** OpenCodeReview delegation 用 CLI 整理文件与分组规则，再交现有 Agent 判断缺陷、人决定接收，不必另配 OCR 模型。本仓两个 Go 文件确实共用一份规则正文；只验证了准备步骤，未测评审质量、token 或费用收益。小改动仍先用原生本地评审。

**采用这条路线，先用 Git 全清单对账 preview，而非只看它的总数。** 固定 v1.13.3 实测中，目录否定规则使一个已跟踪 Go 文件连“排除”列表都没进入；Markdown 则是明确不支持，两者不同。范围缺项或重要文件被排除时，把原始 Git 差异显式交回既有评审，不为工具改项目 gitignore。实际正反例与可运行对账见依据行。

**安全插件先选运行层。** `security-guidance` 2.0.13 的模型评审把 diff／相关代码送往配置的 Anthropic、网关或第三方 provider，默认跟随最新 Opus。只需模式提醒可关模型层，但独立的 SessionStart SDK 引导安装仍在；不能接受自动依赖准备就先不装。保留模型评审前核数据路径、预算与完成情况：编辑提醒不证明模型层运行，空结果不证明安全。固定实现与真实失败反例见依据行。

**独立审阅先核输入。** 终端 `/code-review` 默认 fork 继承历史，适合就地复查；确需排除实现推理时，另起干净会话或非 fork 子 Agent，只传需求、验收与可核查产物，不默认叠加 reviewer。前台例外和版本范围见依据行。

**评审子 Agent 的提示要点**：给 diff 和能追到原需求或已确认验收的判据，不灌入实现过程中的推理；明确要求“**只报告影响正确性或违背需求的问题，不报告风格偏好**”。遇权限、解析或接口变化，沿具体风险查未改的消费者，必要时用能区分假设的输入核验；计划合规与用户目标成立分别判断。复用已有判据，不要求所有任务另写 spec 或增加 reviewer。固定源码与反证见依据行。

**合并前按最终差异核测试。** 撤掉用例或再次整合主干后，分开记录作者称跑过的测试、最终树保留的覆盖及运行回执对应的树；按风险补回归，不机械恢复所有删例。Immich 的故障测试撤回与 LangGraph 的复测树／最终整合树支持这一区分。**局限：源码中的测试定义不是运行结果，测试未随补丁保留也不证明作者从未运行过。**

**依赖升级后，先追消费者要的值与时点，再改红测试。** 上游不再原地改历史时，记录器应读本轮副本，保留两次不同渲染产生两个公开提示词事件的要求；仅错误钩子提前时才改时点断言，仍验收尾持久结果。不要为保绿统一改预期或恢复已去掉的副作用。局限：未运行这些测试，公开事件契约不等于真实服务已恢复。同一下游的两种修订见依据行。

**模型与 effort 不按客户引言直接选。** Opus 5.5 发布页的低 effort 优势来自 Deloitte 客户转述，未公开其缺陷集、样本量与误报判定。可作为候选线索，不能据此默认低 effort 足够或替代本仓配对评估。原始归属与边界见依据行。

**依据**：[一手] [Claude 评审文档](https://code.claude.com/docs/en/code-review#review-a-diff-locally)、[Ultrareview 比较](https://code.claude.com/docs/en/ultrareview#how-ultrareview-compares-to-code-review)、[Codex CLI](https://learn.chatgpt.com/docs/codex/cli)、`security-guidance` 2.0.13 固定源码；[一手／本仓工具实跑] [OpenCodeReview delegation](https://github.com/alibaba/open-code-review/blob/375f64cd6f67a48a135da83cfcf59c52669a09cb/pages/src/content/docs/en/integrations/delegate.md)，2026-10-23 UTC+8，未测评审质量与费用收益；[本仓工具实跑／研究：条件采用] [Git 全清单对账 preview](research/2026-10-22-frontier-trials.md#ocr-delegation-trial)；[一手；研究：采用判断，2026-10-14 UTC，未运行] [security-guidance 运行层与数据路径](research/2026-10-12-baml-and-review.md#安全插件从提醒到自动模型评审)；[一手：2026-10-15 UTC 官方契约；研究：采用判断] [评审窗口与输入历史](research/2026-10-12-baml-and-review.md#评审窗口与输入历史的区别)；[一手：固定补丁与测试定义；研究：采用判断，2026-10-15 UTC] [依赖升级观察点](research/2026-10-12-development-conditions.md#后续依赖升级旧观察点过时不等于消费者结果可以丢)；[一手：厂商刊载客户自述；研究：采用判断] [Opus 5.5 客户转述](research/2026-10-12-baml-and-review.md#调查模型转述与第三方服务的采用边界)；[一手／社区／研究] 测试树核对 [Immich 的故障测试撤回](research/2026-10-13-immich-handover.md#补充证据新对象通过不等于原失败对象已恢复)、[LangGraph 的复测树与最终整合树](research/2026-10-12-long-task-evidence.md#完成状态正确已完成动作仍可能被重新执行)；[经验：采用判断] 工具选择与输入交接 [输入交接记录](research/2026-10-12-baml-and-review.md#后续任务相同-brief-与过期接口)；核实 2026-10-24。

### PR / CI

**先区分自管 CI、托管评审和第三方集成，再按仓库资格与风险选择。**

| 工具 | 说明 | 评级 |
|---|---|---|
| Claude Code GitHub Action | 自有 workflow 内运行 Claude；触发、权限、提示由工作流决定，可用 API key 或订阅 OAuth。不是托管 Code Review 的等价入口 | 🧪 需自管 CI |
| Claude Code Code Review（托管） | Team／Enterprise，10-15 已正式可用，需组织启用；单独计费，按仓库选择 Quick／Standard／Deep，不能由本地订阅推断资格 | 🧪 关键 PR，先校准再扩量 |
| Cursor Bugbot / Security Agents | Bugbot 按用量计费，旧 seat 方案仍有过渡；先核账户实际方案与预算，不用 5 月平均单次成本作当前报价。Security Reviewer 查 PR，Vulnerability Scanner 查存量代码；部署监控 Rollouts 不能替代评审 | 👀 已用 Cursor 且有对应缺口时 |
| Codex `@codex review` / `@codex security review` | 先连接仓库并配置评审；规则写入根／适用子目录的 `AGENTS.md`。安全评审是额外的定向评审，不能把普通评审无发现当安全验收 | 🧪 |
| **Codex Security Cloud**（研究预览，2026-09 DevDay） | 扫描已连接的 GitHub 仓库或监控新提交，给出发现、**验证证据**和补丁，再生成草稿 PR | 👀 |
| CodeRabbit、Greptile、Qodo | Claude Code 官方市场收录的**第三方集成**，不等于 Anthropic 自研或已证明更有效；先核服务资格、数据外发与是否自动增加评审轮次。固定来源与差异见依据行 | 👀 有具体缺口再接 |

**依据**：[一手] [Claude Code GitHub Action](https://code.claude.com/docs/en/github-actions)、[Code Review 正式可用](https://claude.com/resources/articles/code-review-is-now-generally-available)（10-15，10-21 核实）、[Codex `@codex review`](https://learn.chatgpt.com/docs/third-party/github)、[Cursor Bugbot 计费](https://cursor.com/docs/bugbot#pricing)、[Security Agents](https://cursor.com/docs/security-agents)、[Rollouts](https://cursor.com/docs/rollouts)；[一手：2026-10-14 UTC 文档；研究：选择边界] Cursor 方案与选择；[一手] Codex Security Cloud 研究预览（2026-09 DevDay）；[一手；研究：采用边界] [第三方集成范围](research/2026-10-12-baml-and-review.md#配置诊断插件评估与第三方集成的范围)；核实 2026-10-24。

### 重复的窄评审：何时接 Codex Action

**👀 每个 PR 重复相同窄评审时，再评估 Codex Action。** 基线是手动 Codex 评审、确定性 CI 与人工判断；隔离 runner、最小权限和预算具备后，才试统一触发与报告，不默认批准／合并。固定 Action SHA 及 CLI 依赖；该版本 Windows 仅接受 unsafe，应改用合适的隔离 runner。**关键局限**：自动化不保证更多有效发现，空／失败报告不算无问题；按安全文档隔离不可信 PR 与凭据、特权步骤，误报或费用失控就保留手动。

**依据**：[一手] [Codex Action](https://github.com/openai/codex-action)、[固定 Action SHA](https://github.com/openai/codex-action/blob/bdf19a4a223ec2549a3e2274a0cf61556bc07675/action.yml)、[安全文档](https://github.com/openai/codex-action/blob/main/docs/security.md)；[研究：采用判断] 成本与范围选择；[经验：采用判断，2026-10-12，未运行] 触发与预算条件；核实 2026-10-24。

### 云端入口和 CI：先辨认完成了什么

**`/code-review ultra` 不可用时可能退回本地评审；需要云端能力时，核对实际运行位置。** 脚本用 `claude ultrareview` 等待结果，不能用会提前退出的 `claude -p '/code-review ultra'` 代替。前者退出码 `0` 只表示完成，**有发现也返回 0**；`--json` 返回原始 `bugs.json`，不是托管 check 的严重度统计。

🧪 Ultrareview 当前通常每次 5–25 美元 usage credits；Pro／Max 用户每账号有一次性 3 次免费额度，并非周期刷新。CI 超时后云任务可能仍在跑，重试会新建并再次计费。先核查旧任务再重试；子命令由用户直接执行时视为接受计费／条款，缺少 merge base 还可能扩大到整仓，接 CI 前须明确预算和范围，不直接照搬命令。

**依据**：[一手：2026-10-14 UTC 官方契约] [Ultrareview 非交互运行与计费](https://code.claude.com/docs/en/ultrareview#run-ultrareview-non-interactively)、[Ultrareview 比较](https://code.claude.com/docs/en/ultrareview#how-ultrareview-compares-to-code-review)；[研究：成本选择] 预算与范围；核实 2026-10-24。

### 托管多 Agent 评审的实际数据：Claude Code Review

**先按预览期内部数据判断托管评审能补什么，不把数字当当前报价或你的仓库效果。** 以下是 Anthropic 2026-03 推出 Code Review 时公布的内部数据，10-15 公告已报告速度变化；这是预览期口径，不是 10 月 GA 版本的性能或报价，当前计费回官方文档。

| 指标 | 数值 |
|---|---|
| 收到实质性评审意见的 PR 比例 | 从 **16%** 提高到 **54%** |
| 被工程师标为“错误”的发现 | **不到 1%** |
| 超过 1000 行的 PR | 84% 有发现，平均 7.5 个问题 |
| 少于 50 行的 PR | 31% 有发现，平均 0.5 个问题 |
| 耗时和成本 | 平均约 20 分钟；每次 15–25 美元，按 token 计费 |

**两个真实例子**：

- Anthropic 内部一个看似常规的单行改动，被标为严重问题：它会让某个生产服务的认证失效；
- TrueNAS 在重构 ZFS 加密时，评审发现**相邻代码里一个早已存在的**类型不匹配，它会在每次同步时悄悄清空加密密钥缓存。

**机制**（官方文档）：

- 多个 Agent 各查一类问题，再由一个**验证步骤**对照实际代码行为过滤误报，然后去重、按严重度排序；
- 严重度分三级：🔴 合并前应修的 bug、🟡 小问题、🟣 这次 PR 之前就存在的 bug；
- check run 为 neutral，失败／超时也如此；不能靠它的结论直接阻止合并。官方提供末尾 `bughunter-severity` JSON，`normal` 是 Important 数量。

**确需门槛时**：核报告来自预期应用、对应当前 PR head SHA、评审成功完成，再验字段类型并按团队严重度阈值处理。待完成、失败、额度跳过、缺失／解析失败／过期均转人工或不通过，不能填零。门槛须另设 required check；`normal > 0` 是待处理发现，非独立证实的 bug。不能辨认成功报告就保留提示型评审。官方输出与失败语义见本节依据行。

**独立的组织案例，不能当作本产品效果**：Intercom 原文报告其自建审批系统在两个主代码库中自动批准超过 19% 的 PR；停机时间下降 35% 是整体研发转型期间的组织结果。系统限制大而复杂的变更，发布者仍须监控并能回滚；不能据此默认开自动批准或把下降归因于托管 Claude Code Review。

**怎么看这些数字**：

- 它们是“验证后再报告”的内部使用信号；“被标为错误不到 1%”缺少完整独立判定的分母，不能直接当成整体误报率、精确率或召回率；
- 但都是厂商自己的数据。“实质性意见比例”衡量的是覆盖面，不等于逃逸缺陷减少了多少；
- 15–25 美元是平均范围而非报价上限；逐 push 会累加。先用本地正常用量评审，符合托管资格且启用服务时，才对关键 PR 手动 `@claude review`。当前裸命令只触发一次，`always` 才订阅后续推送；fork PR 不会因 `always` 自动跟随后续推送。

**依据**：[一手：厂商自述，内部数据] Anthropic 2026-03 Code Review 内部数据；[一手] [10-15 GA 公告](https://claude.com/resources/articles/code-review-is-now-generally-available)、[官方计费文档](https://code.claude.com/docs/en/code-review)、[check run 输出与失败语义](https://code.claude.com/docs/en/code-review#check-run-output)；[经验：设计条件] 合并门槛；[一手：使用方自述；研究：归因边界] [Intercom 原文](https://www.intercom.com/blog/ai-is-approving-our-pull-requests-heres-how-we-made-it-safe)；[一手：2026-10-14 UTC 官方文档；研究：成本选择] `@claude review` 与 `always`；核实 2026-10-24。

### 用 REVIEW.md 调教评审

**托管 Code Review 会读两类文件；不要把此契约推广到本地、Action 或 ultrareview。**

- `CLAUDE.md`：新引入的违规按 🟡 报告。如果改动让 CLAUDE.md 的某条描述过时了，也会提示更新文档；
- 根目录 `REVIEW.md`：给查找、验证及报告阶段使用。官方称这比长 `CLAUDE.md` 更可靠；这是厂商对输入机制的说明，**不是已测的遵循率或强制执行保证**。

以下是官方给出的写法示例，按仓库取舍，不是统一政策：

- **严重度与证据**：例如约定行为破坏、泄露或阻碍回滚才算 Important；行为断言引用 `file:line`，不从命名推断
- **检查范围**：按需约定跳过哪些生成代码、lockfile、vendor 或 CI 已管的问题；补仓库特有的 API 测试、日志隐私、租户隔离要求
- **报告与收敛**：限制 Nit 数量，先报事实／风格统计；复审只报 Important，无阻塞直接说明

保持简短，避免稀释关键规则；起点见 [REVIEW.md 模板](../templates/generic/REVIEW.md)。

> 注意：后台 `--fix` 修改不在会话 checkpoint 内，须用 git 回退；前台运行的修改可随 `/rewind` 撤销。是否读规则与是否执行规则须分开核验。

**依据**：[一手：文档；研究：范围边界] 托管 Code Review 的规则读取契约；核实 2026-10-24。

### 从实现产物到可接收交付

**先用原验收、项目检查和实际消费者接收；跨契约或漏审风险明确时，加一次原生独立评审。** 小修改已有充分覆盖时作者自查即可；专门工具或多视角只用于补具体缺口，重复评论和误修增加时退回原组合。

1. **核对目标。** 固定产物版本、必须保留的行为和实际入口，按原任务验收，不以 Agent 总结重定义完成。
2. **按发现行动。** 应修：有违反需求的输入与影响；保留：契约或测试支持当前实现；待证据：先补缺失信息，不急着改代码。
3. **修后接回消费者。** 重验受影响差量及同一使用路径，复用未变结果。原验收成立且重要问题已解决才交付；属于验收的未验项继续保留为欠项。

可直接借用的两种判断：

- **Memos**：独审发现普通 Markdown 列表漏过过滤，修实现；二改用真实组件回归定位焦点丢失，按稳定 block 标识恢复。随后实际匿名列表／详情接收了两条渲染路径、父项上下文、开关键盘操作与刷新／前进后退偏好；分享 PNG 保留完整原文，网络与 SQLite 核对未见 memo 内容写入。代码独审修正实现，实际页面确认匿名阅读路径；owner 登录／编辑、任务勾选写入及写后焦点仍未验。
- **Sphinx**：当前 profile 推翻旧热点，保留已有效的缓存，改候选索引；用实际 CLI 输出与 warnings 不变接收性能差量。单机历史负载约快 7%，不是模型评审收益。实现与运行记录见依据行。

交给接收者的请求：

```text
按原任务验收，核固定版本、必须保留的行为和实际消费者。
把发现分为应修／保留／待证据，并给输入、影响或契约依据。
只修获准范围，复验受影响差量与消费者路径，复用未变结果。
交付实际结果和未完成项；重复意见合并，不为清空评论制造修改。
```

实现见 [07](07-workflows.md#2-标准节奏探索--计划--实现--提交-)，并行整合见 [08](08-multi-agent.md#6-操作手册从一个大任务到并行执行)，跨轮接续见 [20](20-codex-long-horizon.md#3-完成条件来自验收原文不能由总结重新定义)。下列告警保护、反馈收齐与循环收敛展开具体入口。

**依据**：[一手／本仓实际采用] [Memos 组件实施与独审](../experiments/memos-reading-adoption.md)（jsdom）及[后续真实匿名页面接收](collaboration/local-jobs/A-MEMOS-BUILT-SMOKE-001.md#当前执行)（浏览器、实际 PNG、网络与 SQLite；运行 2026-10-25 UTC，非作者范围复核未重演），[Sphinx](collaboration/local-jobs/A-PERFORMANCE-ROUTE-001.md)（真实 CLI，非完整下游链）；[一手／研究] 原生评审、反馈收齐与保留判断的既有来源；[经验] 本路线组合，非评审净收益对照。原核对 2026-10-25；Memos 后续证据回流 2026-10-26，未重跑历史实验。

### 文档有出处，还要核结论的强度

**🧪 已有引用仍出现事实越界时，本次建议在现有一轮审查中，只核会改变采用决定且尚未核清的主张。** 先从固定原文独立写出它能支持的结论，再与草稿对照谓词强度（如“允许”还是“推荐为默认”）、时间、对象和条件。交回“原主张 → 原文位置／短句 → 支持或不支持及理由”；支持不够就收窄、删除或列为待证据。决定性主张未过，不能由其余正确内容的平均分补足。已有检查已核清、原文与主张均未变时直接复用，不逐句展开全篇，也不另开模型裁判轮次。可把对应一句放进现有 [REVIEW.md](../templates/generic/REVIEW.md) 的 Evidence bar。

借用的是**逐条支持判定和理由**，不是另装评估器：Ragas 的固定实现先拆断言，再判断能否由上下文推出；内部有理由，最终却只返回总分，用户也报告过取不到理由。这里直接核草稿原句，保留其时间与条件，避免拆句时先弱化了待核主张。

本仓一份 AI 文档已有固定引用且通过独审，仍把“旧规则允许开源项目作为任务来源”判成“第三方应用曾为主线”，接收抽查才收窄；出处和独审状态都不能替代这一步支持关系核对。这个旧失败用于校准检查对象，不证明新提示已经降低漏检。

**依据**：[一手：官方建议] [逐主张核支持原句](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)；[一手：固定源码，2026-02-24] [Ragas 逐断言判定](https://github.com/vibrantlabsai/ragas/blob/298b68274234c060deacab3cf5fb52aa3a20e885/src/ragas/metrics/collections/faithfulness/util.py#L27-L86)、[总分与返回面](https://github.com/vibrantlabsai/ragas/blob/298b68274234c060deacab3cf5fb52aa3a20e885/src/ragas/metrics/collections/faithfulness/metric.py#L116-L159)；[一手：使用者报告／维护者回复，0.4.3] [理由未返回 #2566](https://github.com/vibrantlabsai/ragas/issues/2566)；[本仓公开失败校准] [原报告](https://github.com/dbvv1/a1dbv/blob/09aa64c1d107e1cabd73ce87061ac20fa41afeaa/experiments/public-guidance-reader.md)、[接收后收窄](https://github.com/dbvv1/a1dbv/commit/c4c2decce6913b239dbe501463abfba5b36c816e)；[经验：采用建议] 本段检查动作，未运行 Ragas、未作效果对照；核读 2026-10-26。

### 把“不修这条告警”变成可执行的保护

**✅ 确认告警误把项目契约当缺陷后，必要时补一条保护原行为的回归，而不只是关闭意见。** 适用于后续 Agent 容易重复提出同一“修补”的兼容行为；旧版本也这样做只是参照，不能单独证明它正确或安全。

rsync 的已接收提交 a55ab05c 明确保留名称过滤语义，而非把过滤规则改成物理路径隔离。其 Codex-reported 用例要求经模块内目录别名写入的文件存在；机械阻止该写入反而使测试失败。配套契约用例另核名称与子树规则。测试头仍沿用告警式描述，输入也叫 `SHOULD-NOT-LAND`，所以接收者必须读可执行断言与提交意图，不能只让 Agent 摘要标题。

交给修订 Agent 的最短任务：

```text
核这条发现是否违反当前需求、文档契约和信任边界，再决定修补或保留。
若决定保留，指出依据；重复误修风险值得保护时，补最小兼容性测试。
测试应在“合理保留”时通过、在本次不应采用的修改下失败；不要仅复制告警预期。
交回处置理由、实际断言及运行结果；无法确认的取舍留待决定。
```

**验证范围**：已核实际进入上游的测试与断言方向，未运行 rsync 或模型；不能由此声称原模型曾提交错误补丁、发生过回滚，或测得评审收益。本例只支持把已确认的保留决定沉淀为保护，不扩为“安全告警都不修”。

**API 修改先补缺失的确定性反馈，不默认再加评审模型。** ✅ 已有成本可接受、覆盖所需版本与真实请求／响应的集成测试，就先复用。维护公开 OpenAPI 时，比较已发布契约与本次生成契约，检查会破坏旧客户端的变化；schema差异工具只比较声明，仍须验实现与声明相符。🧪 可识别的消费者与提供方独立演进、双方愿维护验证和测试状态时，再评估 Pact：用真实消费者代码生成交互契约，由 provider 验证；只有消费者 mock 通过不够。陌生公共 API、对方不参与或状态不可控时，不为“有契约测试”强接 Pact。**局限：契约匹配不证明数据库副作用、完整业务或所有已部署版本兼容，保留相应集成／端到端检查。** 官方范围、成熟项目两种采用与反例见依据行。

**把真实兼容性诊断交给Agent，不让它自动删校验求绿。** [oasdiff可复制实试](../experiments/oasdiff-contract-review.md)比较InvenTree已发布契约558→559，直接定位到`POST /api/stock/add/`的`notes`新设512长度限制。维护者是在补齐早已有的数据库约束并提升API版本：声明兼容性告警成立，不等于修复错误。让Agent交回受影响请求、变更意图和兼容处理选项，再决定恢复旧约定或保留获准的输入收紧；不是靠改基线、降级全部规则或删除合理验证保绿。

**新增评审须补已有缺口，评论数不算收益。** CRBugBench 同模型比较中，调整单评审提示可用更低代价取得接近五候选集成的历史缺陷检出率，收益随模型变化。人工受控实验中，AI 意见集中人的注意力，未检出审查时间收益；故高风险人审保留自己的范围。研究未证明当前 Codex／Claude 在你的仓库优于测试加定向人审，采纳评论或改代码也不等于修对 bug。比较、人的负担与边界见依据行。

**循环迟迟不收敛时，区分当前改动的新增风险、既存缺陷和重复发现。** Claude Code 团队 2026-10-15 复盘记录过评审循环失控，随后限制轮次、在前几轮之后只重审改动并抑制重复发现；支持本页的收窄默认，不把其具体轮数或 0／1／2 人审批表移作通用标准。人审要求仍由本项目风险与授权决定；撤回率或事故上升时恢复检查，不能只以少等审批证明收益。

**依据**：[经验] 告警保护判断；[一手：维护者提交／固定源码，2026-10-24 核读] [rsync 提交 a55ab05c](https://github.com/RsyncProject/rsync/commit/a55ab05c1922f5cba915f203ec51e0ae15a57d3a)、[Codex-reported 用例](https://github.com/RsyncProject/rsync/blob/a55ab05c1922f5cba915f203ec51e0ae15a57d3a/testsuite/symlink-exclude-leaf_test.py#L43-L49)、[配套契约用例](https://github.com/RsyncProject/rsync/blob/a55ab05c1922f5cba915f203ec51e0ae15a57d3a/testsuite/daemon-exclude-namebased_test.py)；[研究] 验证范围；[一手：固定文档与实现；经验：采用判断] API 兼容性采用与反例 [官方范围、成熟项目两种采用与反例](research/2026-10-12-development-conditions.md#api修改声明差异消费者契约与真实集成)；[本仓 CLI 实试／一手：固定修复，2026-10-24，未验上游运行服务或模型收益] oasdiff 实试；[研究] CRBugBench 比较与人的负担 [比较、人的负担与边界](research/2026-10-12-baml-and-review.md#额外评审的增量与人的负担)；[一手：自用复盘；研究：条件采用] [Claude Code 团队 2026-10-15 复盘](https://claude.dev/blog/solving-code-review-at-anthropic/)；核实 2026-10-24。

### 把PR反馈交给修订Agent：先收齐三个入口

**✅ 先读review正文、行内意见和普通评论，再按发现合并去重。** 只遍历未解决线程会漏掉无法挂在代码行上的发现；已解决也只是线程状态，不是全部反馈已处理。已有入口能收齐就复用；已有完整采集与处置记录时，只补新增及未决，不重复灌入全历史。

dClimate的全球TESSERA管线交付中，自动reviewer已发现并发失败可能误删另一写入者的成果，但发现写在review正文，数轮只读行内线程的处理仍漏掉它。补读后，固定修订e9074c5补上冲突时不删除、普通失败仍清理的互补测试。

已有获准GitHub CLI入口时，可在自己的结果目录采集三类输入；以下为Bash与jq示例，不创建评论、批准或合并：

```sh
(
  set -euo pipefail
  REPO=dClimate/tessera-embeddings
  PR=82
  gh api --paginate "repos/$REPO/pulls/$PR/reviews?per_page=100" | jq -s 'add // []' > reviews.json
  gh api --paginate "repos/$REPO/pulls/$PR/comments?per_page=100" | jq -s 'add // []' > inline-comments.json
  gh api --paginate "repos/$REPO/issues/$PR/comments?per_page=100" | jq -s 'add // []' > conversation-comments.json
)
```

这三份分别包含review正文、行内评论与回复、PR对话评论；`--paginate`不能省略。任一步失败就不把已有部分文件当完整输入；本仓实际用已有只读连接器逐页取得三类集合，CLI命令按官方分页契约提供，未运行认证CLI。

交给修订Agent：“按当前head核对三类反馈，合并重复发现，保留每项链接、涉及版本与已有处置；先交应修／不修／待证据及依据，再修改获准范围。相似告警先追实际调用路径，不机械套同一种补丁。”本例同轮拒绝了已有自动凭据刷新的staging告警，却修了走另一条读取路径的ROI遗漏；采纳与拒绝均有公开理由。

复核者核的是遗漏是否补齐、修补是否正确；不默认再跑一轮生成同类评论。材料仍是待核证据，不授予新操作权限。噪声过多时再沿 Crossplane 的实际收窄去掉重复状态信息，而不是漏掉整个反馈入口。

本例已合入，公开补丁带Claude协作署名，但没有公开完整生成会话；这里验证了意见所在入口与处置链，不证明Agent独立完成项目或当前模型净收益。

**跨仓修复后，按实际依赖版本复核，不只看本 PR 的 head。** 上游修复而目录 PR 未变时，增量评审可能跳过；全量完成也不证明实际分发版本已核实。分开记录机器人发现、作者确认、固定补丁与行为复测；缺产物或验证时保留人审，不以重复调用代核验。ComfyUI 目录 PR 的实际链条有确认与补丁，未随补丁新增所要求的回归测试，目录 PR 仍未合并；不提高评级。

Anthropic 内部实践也强调：评审 Agent 职责要窄，**必须证明自己的发现成立**，对自动批准的结果按风险抽样给人复核（见 [10 第 3.4 节](10-security.md#34-参考架构anthropic-如何保护80-代码由-claude-写的开发流程)）。

**依据**：[一手／经验] 三类反馈采集与处置，2026-10-24；[一手：公开处置／源码，未由本仓重跑] [dClimate 全球 TESSERA 管线交付](https://github.com/dClimate/tessera-embeddings/pull/82#issuecomment-5274494072)、[固定修订 e9074c5](https://github.com/dClimate/tessera-embeddings/commit/e9074c5f62d61edcd568dbf6541afcc04a8abd55)、[经验] [Crossplane 的实际收窄](research/2026-10-12-baml-and-review.md#crossplane有用意见与收窄评审可以同时成立)；[本仓接口取回／一手] [GitHub API 分页契约](https://cli.github.com/manual/gh_api) 与只读连接器；[证据范围] 本例公开范围；[一手／社区；研究：采用判断，2026-10-16 UTC] [ComfyUI 目录 PR 的实际链条](research/2026-10-12-baml-and-review.md#跨仓修复本-pr-未变不等于评审对象未变)；核实 2026-10-24。

## 3. 给自己的 AI 配置做评估

改 CLAUDE.md、Skills、规划或模型后，先回答“**在哪些任务上，以什么代价，哪项结果改善了**”。✅ 建议做配对评估；不把一张排行榜当成因果证据。

### 3.1 独立结果与方法边界

**先分清每项证据能支持什么、不能支持什么，再决定是否采用。** 以下读过正文及原始工件，核对日期为 2026-10-10 UTC；没有重跑其模型实验。

| 证据 | 能支持什么 | 不能支持什么 |
|---|---|---|
| AGENTS.md 研究 v3，300 个 Lite + 138 个 CTXbench 任务，4 个模型配置 | 未检出相对无文件的显著成功率改善；生成文件增加约 20–23% 推理费用；应核查具体指令的作用 | 不能从旧版标题推成“所有文件必然降低正确率”；单次/条件、Python 仓库不代表所有项目 |
| SkillsBench v4，87 个任务、18 个模型—harness 配置 | 人工整理包的平均验证器得分 33.9→50.5；Codex GPT-5.5 配置 +19.7 个百分点 | 主分数含部分得分；严格 solved 另报 31.3→47.7%。优先选健康替补运行，不等于首次尝试可靠性；模块数量分组不是长度随机实验 |
| 规划研究 v3，21,120 条 SWE-agent 轨迹，4 个模型、8 种计划 | 短的定位→复现→修复→验证流程有受控支持；额外阶段也可能伤害结果；原始轨迹见依据行 | 不等于原生 Codex 的规划模式或所有任务都该写长计划；遵循计划与成功相关不单独证明因果 |
| 多 Agent 扩展研究 v3，260 配置/6 基准 | 协作收益随任务变化；先比较单体与候选，不只凭 45% 或 87% 决定新任务的单体／多体架构；完整候选组评估与静态复算于 10-15 补核，见依据行 | 新协议与论文 87% 的评价单位不同；编码每基准 20 任务，阈值依赖收益端点，迭代数也不等于 token／金额预算 |
| 重复运行研究，584 次单一 ML 任务运行 | 少量运行的排名不稳；违规高分需先过滤；原始结果、程序和分析见依据行 | 多次重复同一任务不能代替多样任务，也不能证明某 harness 一般更强 |

🧪 **工件可用性也算证据**：SWE-Skills-Bench 的论文仅用 Haiku 4.5，报告小幅收益；其声明仓库在核对日经网页与 GitHub API 均返回 404，且正文的注入位置描述不一致。不能标为本仓库已复现。持续记忆的选样、检索和工件边界见 [03](03-context-engineering.md)。

**测试通过不等于能合并。** METR 请 4 名维护者审 296 个 AI 补丁，并以 47 个人工历史补丁校准；归一化后的维护者接受率平均比自动评分低约 24 个百分点。人工旧补丁也只有 68% 被接受，不能省略这个基线。OpenAI 的失败子集审计还发现测试缺陷与污染；其中 59.4% 指被审计的困难子集，不是整个 Verified。

**依据**：[研究：受控比较] [AGENTS.md 研究 v3](https://arxiv.org/html/2602.11988v3)、[SkillsBench v4](https://arxiv.org/html/2602.12670v4)、[多 Agent 扩展研究 v3](https://arxiv.org/html/2512.08296v3)；[研究：配对比较] SkillsBench；[研究：消融] [规划研究 v3](https://arxiv.org/html/2604.12147v3)、[原始轨迹](https://github.com/Intelligent-CAT-Lab/Planning-Analysis/tree/main/raw_trajectories)；[研究：重复实验] [重复运行研究](https://arxiv.org/html/2609.33812v1)、[原始结果、程序和分析](https://github.com/earino/identical-runs-different-results)；[研究：静态复算] [完整候选组评估与静态复算](research/2026-10-12-experiment-records.md#架构阈值与完整候选组不能按45或87硬路由)；[研究] [SWE-Skills-Bench 论文](https://arxiv.org/html/2603.15401v1)、[声明仓库](https://github.com/GeniusHTX/SWE-Skills-Bench)（核对日网页与 GitHub API 均返回 404）、[METR](https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/)、[OpenAI 失败子集审计](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)；核实 2026-10-10 UTC（代际复核 2026-10-24）。

### 3.2 最小可靠设计

**先锁任务和判据，再控制变量、独立验证并完整计账。** 以下七步结合上述研究与官方评估指南，作为方法建议：

1. **先锁任务和判据**：从真实失败取样，也放入普通任务、反例、无需修改与仅部分修复的任务，分别检查不必要的修改和仍有缺陷却提前停止；不要只以补丁更少判断改进。双向失败的选样依据见依据行。5–10 个用于先导检查；小差异不能靠这个规模定论。扩展到 20–50 个独立任务后，仍按方差与目标差异决定样本量。
2. **一次只改一项**：同一任务配对，固定模型/版本、effort、工具、权限、环境和总预算；随机交错 A/B，使用干净快照与新会话。对比不同 harness 不能归因给其中某个 Skill。
3. **独立验证**：隐藏验收测试不进入 agent 工作区；参考补丁证明可解；新增回归测试须在旧代码上失败。模型自评和“读过 Skill”都不能代替验收。多 Agent 要测合并后的行为。
4. **完整计账**：保留所有尝试，区分基础设施错误、agent 超时和语义失败；预先规定重试和同一单元的取舍。记录首试与重试后结果，包含协调、记忆生成、人工修复/评审时间。
5. **避免假独立**：按任务汇总配对差异和不确定区间；29 个检查点不是 29 个任务，重复三次也不保证有统计把握。全过/全失败只能说明量表饱和，不能临时挑有利任务。
6. **明确指标**：严格通过、部分得分、流程合规、人工可合并性分开；pass@k 是多次中至少一次，实际交付还需要可执行的选择器；pass^k 是多次都过。不显著不等于等效。
7. **保留可复核记录**：固定输入、补丁/配置 hash、任务×条件×重复编号、模型版本、测试日志、失败类别、重试关系和分析脚本。公开前去除凭据、私人信息与内部路径。

[19 的 E5](19-experiments.md#8-e5公开结果表的离线复核)给出真实 CSV 的取舍敏感性核对；[工作流消融夹具](../experiments/workflow-ablation/)只验证评估器机制，不提供模型效果数据。E1–E3 缺完整原始工件，未独立复现，不宜凭汇总数字推广或声称精确可复现。

**按评估对象选工具**：测 Claude Code 插件／Skill 行为可评估 `claude plugin eval` 的有／无插件对照；它不加载项目 `CLAUDE.md` 等配置，不能直接替代整个工作流的配对评估。运行及模型裁判均耗额度／API 费用，先核预算与报告发布选项；语法、调用次数和评分不等于可交付。范围核对见依据行。

**依据**：[经验：方法建议] 七步评估设计；[研究：选样] [双向失败的选样依据](research/2026-10-12-baml-and-review.md#无需修改与部分修复要一起评估)；[一手；研究：采用判断] [官方评估指南](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)、[`claude plugin eval`](https://code.claude.com/docs/en/plugin-evals)、[范围核对](research/2026-10-12-baml-and-review.md#配置诊断插件评估与第三方集成的范围)；[研究] E5 与工作流消融夹具（见正文）；核实 2026-10-24。

### 将配置评估变成可复查的记录

**把配置评估做成可复查记录：区分任务成功率与断言通过率，保留失败和重试成本，使用留出集并校准模型裁判。** 进一步落地见 [22 评估 Agent](22-agent-evaluation.md)。

### 可执行案例：独立验证要独立到什么程度

**验证独立到什么程度，要按预期、解析实现、计算方式与执行环境分别说明。** Catalog Compare 复核的例子：原项目使用另一个 CSV 解析器核对导出，但这并未独立核对全部业务数值；补充原 CSV → Python Decimal → 实际输出的比较后，41 个匹配行通过，同时发现旧浏览器记录未覆盖当前 HTML hash（离线执行）。

✅ 采用多种验证视角时，说明独立的是预期、解析实现、计算方式还是执行环境。多开一个 reviewer 不自动获得这些独立性；反过来，一份可重跑的确定性检查可能比另一段赞同意见更有用。不要把检查数当作质量分数。

**依据**：[研究：离线执行] [Catalog Compare 复核](research/2026-10-10-catalog-compare.md)；[研究：采用判断] 独立性分类；核实 2026-10-24。

## 4. 实践清单

- [ ] 按风险选择 AI 评审；保留独立测试和必要的人工评审，不把“每次都用”当成已证实收益
- [ ] 接收前按原验收和实际消费者判断完成；应修／保留／待证据分开，修后只复验受影响差量
- [ ] 评审重点：重复代码、被吞掉的错误、旧代码是否该改却没改、测试是否真的在测
- [ ] 关键路径可试交叉模型评审，并抽查误报、漏报与人工处理成本
- [ ] 维护一个私有评估集，换模型或大改配置时重跑
- [ ] 配置有冲突或上下文负担时，先检查实际加载内容；Claude Code 可用时用 `/doctor prompt-audit` 找过时／冲突指令，用 `/skill-doctor` 查看调用与上下文成本。它们不能证明效果，少用也不是删除依据；不为这项检查默认安装额外 linter。命令版本与连接限制见依据行

**依据**：[一手；研究：采用判断] `/doctor prompt-audit`、`/skill-doctor` 的命令版本与连接范围 [范围核对](research/2026-10-12-baml-and-review.md#配置诊断插件评估与第三方集成的范围)；核实 2026-10-24。

## 来源

以下为正文引用的原始来源与延伸阅读；各节依据行已给出对应核实日期与采用边界。

- [Faros AI：The Acceleration Whiplash](https://www.faros.ai/research/ai-acceleration-whiplash)（厂商报告页）；[十项详解](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways)，口径与缺口见[核查附注](research/2026-10-12-baml-and-review.md#faros公开指标的口径补核)
- [HumanLayer：Why Software Factories Fail](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md)
- [GitClear：The Maintainability Gap（2026）](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)（一手：公开摘要与报告图页；完整 PDF 未取得）
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [Agent Skills：Evaluating skills](https://github.com/agentskills/agentskills/blob/main/docs/skill-creation/evaluating-skills.mdx)
- [Code Review for Claude Code](https://claude.com/blog/code-review)（2026-03，内部数据）、[How Anthropic secures its AI-native SDLC](https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle)（组织实践）；[Intercom 审批原文](https://www.intercom.com/blog/ai-is-approving-our-pull-requests-heres-how-we-made-it-safe)
- [Claude Code：Code review](https://code.claude.com/docs/en/code-review)、[Ultrareview](https://code.claude.com/docs/en/ultrareview)、[Plugin evals](https://code.claude.com/docs/en/plugin-evals)
- [Cursor Bugbot 当前计费](https://cursor.com/docs/bugbot#pricing)、[Security Agents](https://cursor.com/docs/security-agents)、[Rollouts](https://cursor.com/docs/rollouts)
