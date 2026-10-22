# 02 · 模型与成本

> 代际复核：2026-10-22（UTC+8）；本次核角色分档、有效覆盖与投入顺序。〔10月保留／修订〕表示近期原文比较后的建议，〔跨代保留〕表示仍适用的约束；不是新模型实测。价表、接口及身份契约保留各自核实日期。

## 30 秒结论

**✅ 当前默认：已有模型的有效配置能稳定达到目标，就保留；新开始、范围清楚的日常编码，Codex 选 GPT-6.1 Sol + `medium`，Claude Code 选 Sonnet 5.5 + `medium`。** 这是本仓库给新读者的明确起点，不是所有客户端的出厂默认，也不是两者效果相同的实测结论。型号须在当前账号、客户端与服务商中可用。**〔10月保留〕** **[研究：采用判断；一手依据见第 1 节，2026-10-21核对，未实测]**

**中档起点不等于全程中档。** 对要跨文件找遗漏的代码质量审查，🧪 可直接比较同模型 `high`；协调、实现与审查分开选档。近期独立生产比较支持这一区分：审查升档带来更多后续采用，而协调器升档未带来有意义的发现增量。保留能改善目标覆盖的那一档，核查与等待抵消收益就撤回。下文给出同题依据与边界。**[一手：独立团队复盘；研究：采用判断，2026-10-22]**

**首次启动（本次 CLI 参数，不改持久设置）**：Codex 用 `codex --model gpt-6.1-sol -c 'model_reasoning_effort="medium"'`；Claude Code 用 `claude --model claude-sonnet-5-5 --effort medium`。入口说明见 [Codex 单次覆盖](https://learn.chatgpt.com/docs/config-file/config-advanced#one-off-overrides-from-the-cli)及 [Claude 起步](01-agents/claude-code.md#7-推荐起步先原生扩展按需选择)。**〔当前入口〕** **[一手：配置入口；研究：起点，2026-10-20，未执行]**

**何时撤回**：漏约束、推理或验证不足时，先辨缺的是输入、有效检查还是推理，再为相应角色提高 effort 或换模型；有依据的质量目标、困难的跨模块任务，也可以一开始就选更强配置，不必先失败。已有有效修改但任务未完，先[按剩余需求续做](#任务没做完先续做还是另开候选)，不把每次停止都当成模型能力不足。等待或预算成为瓶颈时，再试降档。是否保留，看目标质量、整项任务的耗时与费用，包括人工检查和返工；收益消失就退回仍可用的已验证配置；旧模型已退役或名称改路由时，不能仅填回旧名当作回退。**〔跨代保留〕** **[研究：选择与撤回条件；同名effort不可跨代等同，见下节]**

**⛔ 不推荐仅凭最低单价选主模型，也不默认全程 Ultra、最高 effort 或 Fast／Ultrafast。** 前者只在可检查的工作上证明质量与总投入合算后采用；后者用于明确的推理、并行或等待瓶颈，能改善整项任务才保留。速度档、effort 与模型能力是不同选择，付费提速不能补推理缺口。若负担来自重复上下文或无益委派，先减冗余、核缓存，再决定是否降能力；若确是推理不足，则直接比较更强配置。**〔10月修订：先分成本来源〕** **[研究：采用边界；同题比较见下节，计费口径见第 3 节]**

**Agent 做实现、调查与检查，人核对目标和检查覆盖。** 它可能漏读约束、漏测边界或自报完成；更强模型与更高 effort 也不替代实际验收。**〔跨代保留〕** **[研究：风险与把关，见 [09](09-review-and-quality.md)]**

## 当前最高水平：为质量缺口分配投入，而不是统一加档

<!-- frontier: status=已比较 gap=1 gen=2026-10 checked=2026-10-22 -->

**前沿比较：已比较／差距1。** 参照是近期团队怎样在同一类任务上同时核质量与投入，不是某个模型的通用冠军。本页的日常型号仍是可行起点；更接近领先做法的是按角色比较实际覆盖、后续采用与成本。外部报告与本仓源码核对不等于本仓模型实测。[研究]

| 同题选择 | 当前领先参照与独立佐证 | 本仓决定 |
|---|---|---|
| 日常实现与质量审查是否统一用同一 effort | Anthropic／Thariq Shihipar [9-25 同题比较](https://claude.dev/blog/spending-your-effort/)区分草稿和自主验证；独立使用团队 Cloudflare／Ryan Skidmore [10-19 生产复盘](https://blog.cloudflare.com/obsessive-inference-optimization/)按角色比较投入后分别保留、提高 effort | **修正**中档只作范围清楚的日常起点；跨文件质量审查可直接比较 high，不要求先失败，也不把协调器一同加档 |
| 更高综合分或主测试通过，是否足以接受升级 | Cognition／Eric Lu 等 [6-08 FrontierCode](https://cognition.com/blog/frontier-code) 的维护者接收标准是领先参照；独立 Stet 10-12 同题维护公开产物暴露硬失败与软评分不一致，Tor 固定构造题展示同过主检查但回归保护不同 | **保留并收紧**先核真实需求和判定器，再比较新增保护；不让参考实现形状替代语义，也不由构造题推出通用 high |
| 账单高是否直接降模型 | Cursor [9-23 生产比较](https://cursor.com/blog/improved-token-efficiency)先减上下文与工具负担；Cloudflare 的采用反馈补充独立核对：不同角色的降本与有效覆盖并不同步 | **保留**先定位冗余、缓存、重复工作与能力缺口，改变可控的一项；成本下降而重要覆盖变差就撤回，不能用总账单证明各角色无损 |

当前主流参照是厂商按任务分档，可行基线是保留已验证的配置。本仓采纳上述质量优先的投入选择机制，不照搬某团队的节省比例；长会话切换还核缓存重建，续做与多候选分别比较，详见下节及[研究记录](research/2026-10-10-audit.md#p65模型换代与effort的实际质量差异)。整体最优型号和完整人工净收益仍未知。[研究]

<a id="1-原则按任务分档而不是追榜单"></a>

## 1. 从默认起步，按缺口调整

| 任务条件 | 当前选择 | 起点与撤回条件（非本仓库效果排名） |
|---|---|---|
| 范围清楚的日常功能开发、写测试，尚无稳定配置 | ✅ 采用日常起点 | Codex：GPT-6.1 Sol + `medium`；Claude Code：Sonnet 5.5 + `medium`。已有配置稳定达标则不必换 |
| 跨文件代码质量审查、明确的回归保护目标，或已出现有效覆盖不足 | 🧪 为该角色比较更高 effort | 可直接从同模型 `high` 起步；与已验证配置比有效发现与保护，不把实现／协调角色自动一起升档；没有增益就撤回 |
| 困难的跨模块重构、架构或疑难 bug；已有推理缺口或明确更高质量目标 | 🧪 直接选更强能力 | Codex：GPT-6 Astra + Light（`low`）；Claude Code：Opus 5.5 + `medium`，验证要求高可从 `high` 起步。仍需更强能力时再评 Fable 5.1；不能达到目标或新增投入不值得就撤回 |
| 目标明确、结果容易检查的检索型子 Agent、批量小改、格式化 | 🧪 尝试轻量模型 | Claude Haiku 5.5、GPT-6 Luna；复杂调查不因交给子 Agent 就自动降档，返工抵消节省就撤回 |
| 反复出现的有限选项语义判断 | 🧪 有具体缺口才试决策接口 | 规则或当前模型在质量、等待、成本上不足时再比较；分数、回退与授权见第 2.1 节 |
| 离线 / 保密 | 🧪 评估本地开源权重 | Qwen 3.8 27B、Qwen3.6-35B-A3B；硬件、质量与数据路径条件见第 5 节 |

**🧪 有现成反馈的整合任务，也可比较“轻量模型＋既有反馈”。** 已有可运行接口契约、故障样例和行为检查时，轻量模型不必只做检索与格式化：让Agent使用这些反馈，人保持同一业务接收标准，比较漏项、返工、等待和维护投入，节省被抵消就撤回；不为降模型先重建整套harness。近期同题实验与本仓契约工具试用支持把这条路线列为候选，**尚未证明当前任务的模型收益，也不替换上述日常起点**。[作者实验／本仓工具实跑／研究：2026-10-22，见[组合选择与反馈范围](research/2026-10-22-frontier-trials.md#模型与反馈组合现成契约能帮到哪一层)]

**为何给这两个日常起点**：[Codex 官方模型指南](https://learn.chatgpt.com/docs/models#choosing-a-model)推荐 GPT-6.1 Sol 用于编码工作，但要求从客户端默认 effort 起步；同页把 `medium` 定位为兼顾速度与规划深度。本页据此为没有已验证配置的新读者明确选 `medium`，不把它说成官方统一默认。[Claude Code 模型配置](https://code.claude.com/docs/en/model-config#choose-an-effort-level)将 Sonnet 用于日常编码，Sonnet 5.5 的 `medium` 用于范围明确的工程任务、`high` 用于更重验证的工作。以上支持起点选择，不证明本项目上的相对效果或总成本。**[一手：厂商指南；研究：采用判断，2026-10-20]**

**effort 不跨接口照搬**：Claude Code 的 Sonnet 5.5 默认 `medium`，[Claude API](https://platform.claude.com/docs/en/build-with-claude/effort#recommended-effort-levels-for-claude-sonnet-5-5)默认仍是 `high`（2026-10-15 核实）；Codex 的 Sol 默认依客户端而异，Astra 官方建议从 Light（配置值 `low`）开始。同名 effort 不代表跨型号、跨代等强度。**[一手：上述文档；Codex／Claude Code 2026-10-20 补核]**

**保留的是有效配置，不只是旧名称。** 先核客户端与运行后端、实际模型、effort、工具和历史回传契约，再判断质量缺口。DeepSeek 旧 `deepseek-v4-flash`／`deepseek-v4-flash-vision-exp` 已退役但请求仍接受，转由 V4.1-Flash-1017 服务；Gemini 10-08 将旧 3.7／3.5 Flash 请求路由至 3.8／3.6。已知路由变化后重新核代表任务，不能凭配置文件没改或模型自报身份认定未迁移；可得时记录响应模型版本。缺上下文先补输入，检查不足再升 effort，充分尝试仍失败再换更强模型。**[一手：官方路由与响应契约；研究：采用判断，2026-10-20，见 [S1f](research/2026-10-10-audit.md#s1f--2026-10-20-模型身份与采用资格)]**

**Gemini 4 Argon：从等待开放改为按任务试用。** `gemini-4-argon` 于 2026-10-13 在 Gemini API／AI Studio 正式可用；Free tier 和 Google AI Pro 计划不包含它。已有 Gemini API 工作流迁移时，先移除显式缓存调用，核对 thinking 与输出共享的 token 上限；不要只换模型 ID。🧪 适合需要比较复杂编码或长输出的任务，现有模型已满足要求则不必迁移；是否保留取决于本项目质量、延迟和总费用，GA 不证明收益。**[一手：[发布记录](https://ai.google.dev/gemini-api/docs/changelog)、[迁移指南](https://ai.google.dev/gemini-api/docs/latest-model)；研究：采用判断，2026-10-15，未实测]**

**兼容接口不等于行为兼容。** GPT-6 Luna 同时需要推理和工具调用时用 Responses API；其 Chat Completions function calling 仅支持 `reasoning_effort=none`。[一手：[模型契约](https://developers.openai.com/api/docs/models/gpt-6-luna)，2026-10-15] 新 MiniMax M3.1-Flash 始终思考、默认 effort 为 max，不能照搬旧 M3 的默认关闭思考；工具轮须保留完整 assistant blocks，其 Anthropic 兼容接口会忽略 `context_management` 等字段。切换前让 Agent 核这些契约，人复核工具可用性、失败输出与完整任务成本，不只换 model ID。**[一手／研究：2026-10-20，未调用，见 [S1f](research/2026-10-10-audit.md#s1f--2026-10-20-模型身份与采用资格)]**

**Haiku 5.5 的 computer-use API 迁移须按提供方选择**：从 Haiku 4.5 的旧工具迁移，不能只换模型 ID。Claude API／Google Cloud 要用 `computer_toolset_20260801`，并同步改调用分派与结果回传；Amazon Bedrock 则用 `computer_20251124` 及对应 beta header。现有宿主未适配时，先保留可用路径，不因基准分数直接替换。这是自建 API 集成条件，不代表 Claude Code 或桌面 App 的功能变化。**[一手：[迁移指南](https://platform.claude.com/docs/en/models/haiku-5-5/migration-guide#move-computer-use-to-the-toolset)、[兼容性契约](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool#compatibility)；研究：选择，2026-10-16（UTC+8），未实测]**

**在 Claude Code 里落地**：主会话用适合任务的模型；需要子 Agent 时，可在 frontmatter 写 `model: haiku` / `sonnet`，或用 `CLAUDE_CODE_SUBAGENT_MODEL` 统一指定。尽量减少没有任务理由的模型和 effort 切换；缓存影响按下文 [Prompt cache 的厂商与配置边界](#2-价格快照api-美元百万-token)判断，不为保缓存而拒绝必要的模型调整。**[一手：配置接口；经验：使用建议]**

**👀 Muse Wonder：先过资格门，再比较长任务。** 普通 Wonder 可走 API／Muse Code，Full 当前只在 Muse Code 指定订阅；API 单价和订阅额度不能混算。官方限制地域含中国大陆、香港、澳门；Code 订阅默认 Contributor，机密代码不得输入，需先确认可用地域与 Standard 数据设置，后改设置不追溯旧输入。资格成立且现有模型有明确缺口时才比较，不能凭不同 harness 的榜单换掉当前默认，也不能当作开放权重。入口、价格与条款依据见 [S1f](research/2026-10-10-audit.md#s1f--2026-10-20-模型身份与采用资格)。**[一手：官方产品及条款；研究：候选边界，2026-10-20，未运行]**

### 换模型与升 effort：先过行为门，再比较新增质量

**✅ 保留 Sol 6.1 + medium 作为日常候选；“更高综合分”不能替代必需行为通过。** Stet 的近期同题维护比较使用同一 Codex、medium 和单次尝试；公开的 replay-provenance 样本两模型都未过隐藏测试，6.1 的综合分仍较高。它支持继续评估当前起点，不支持把综合赢家直接当合格交付，或承诺用户成本减半；隐藏失败原因未公开完整核定，也不据此宣判能力不足。[社区：2026-10-12 作者实验；研究，详见[产物与最高水平卡](research/2026-10-10-audit.md#p65模型换代与effort的实际质量差异)]

**先核扣分是否真的违反需求，再升模型。** 同文另一个 ignored-files 样本，两者通过测试且综合分相同；清单却包含指定测试名的要求，而公开提示没有该名字。缺少直接断言可能值得补测，但“没按参考实现命名”不能直接判为语义错误。[社区：公开提示／清单／补丁；研究]

**需要更强回归保护时，升 effort 要看它多抓住什么，而不只看主测试通过。** 另一份公开构造题的 MVCC 实现都过主检查，低档测试却只读未被改变的键；高档测试明确核对并发改写后仍读旧快照。原生检查相同，不代表附带测试质量相同。可直接为这类质量目标比较更高档，不必等生产出错；没有改善目标覆盖或新增投入不值得就撤回。[一手：固定代码与归档；研究]

**审查可以升档，协调不必跟着升。** Cloudflare 在同一 Sonnet 5.5 代码质量审查角色上随机分流 medium／high；前者引起后续改动的发现更少，团队改用 high。其 Opus 5.5 协调器却保留 medium，因为 high 未增加有意义发现。比的是该角色多找到什么，不是要求所有步骤付最高成本。[一手：[Ryan Skidmore，2026-10-19](https://blog.cloudflare.com/obsessive-inference-optimization/)；研究]

作者下一次推送改动被标行，是采用信号而非修复正确性；人仍须核实发现本身。分流方式、样本与成本归因范围见[研究记录](research/2026-10-10-audit.md#独立生产比较给不同角色不同投入)。[研究：关键边界]

Agent 保留目标行为及已有回归，解释新增测试对应哪类缺陷；人先核行为门，再比较覆盖、改动范围和总投入。不为选档另造通用评分器，优先复用已有回归或已知失败样例。上述维护样本与构造题分开计证，不能由后者推出所有真实维护都应 high。[研究：采用边界]

### 同题维护审计：低成本起点不等于相同覆盖

**✅ 只需先找少量可核验维护候选，保留Sol + medium起点；明确要求广覆盖时，可直接比较更强配置，不必先失败。** 近期同提示厂商案例中，Sol Ultra比Medium报告更多发现，Astra Ultra还发现部分Sol漏掉的间接依赖；这支持按覆盖目标分档，不证明一般日常编码最优。Agent追依赖与保留用途，人核有效发现和遗漏类别；额外投入未改善目标覆盖，或核查／等待抵消收益，就撤回。[一手：作者比较；研究：采用，见P38数据](research/2026-10-12-baml-and-review.md#p38同题维护审计的配置比较)

**本小节仍是厂商单例，不单独代表整页的前沿比较。** 沿用[C05](collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#c05--模型与成本)的整项质量／投入标准；“92%发现数”不是92%召回率，API成本也不是订阅额度。本例未测Astra Light／low或Sol high，不用Ultra结果替其他档位背书。[研究]

### 任务没做完：先续做还是另开候选

**✅ 已有有效修改、剩余需求明确，先保留代码并让原生 Agent 续做；同一诊断反复失败时，🧪 再试独立候选。** 前者接着完成未做部分；后者探索不同解法，把诊断、有效线索和失败证据供下一次尝试参考，而不是自动合并各份补丁。Agent负责提出与验证修复，人核对旧行为及剩余目标；仅延长执行却没有新增有效进展，或新增投入不值得，就撤回额外重试，重新定位缺口。[研究：采用判断]

**比较过的领先候选是保工作区续做，以及多轨迹摘要选择后重新生成。** LoopsBench与Meta等的同题研究分别支持这两种投入方向；后者不是在旧补丁上继续改，前者也不保证每轮已验收。日常默认仍是原生窄修，整套多候选选择仅👀评估；两研究没有证明当前模型下的完整净收益。数据、反例和成本范围见[P38比较](research/2026-10-12-baml-and-review.md#p38补充未完成与诊断失败选择不同的再投入)。[一手：论文报告；研究：选择]

## 2. 价格快照（API 美元/百万 token）

**先分口径**：下表为 API 单价，不能换算订阅内任务数或额度百分比。下列 OpenAI 模型采用 Standard、单请求输入不超过 272K token 的基础档；Claude Haiku 5.5 按总输入是否超过 100K 分档。缓存写入、长上下文与速度附加条件见表后；其他历史条目的计费条件须回到各自来源确认。

| 模型 | 输入 | 缓存读取 | 输出 | 来源与核实日期 |
|---|---|---|---|---|
| **Claude Haiku 5.5**（Standard） | $0.10（总输入 >100K：$0.50） | $0.01（>100K：$0.05） | $0.50（>100K：$2.50） | [一手：API 价表](https://platform.claude.com/docs/en/about-claude/pricing)；2026-10-11（UTC+8） |
| GPT-6 Luna（Standard ≤272K） | $0.10 | $0.01 | $0.50 | [一手：模型页](https://developers.openai.com/api/docs/models/gpt-6-luna)；2026-10-15 |
| Mistral Large 4（预览，限时价） | $0.68（原价 $1.36） | $0.07 | $2.09（原价 $4.18） | [一手：模型页](https://docs.mistral.ai/models/mistral-large-4)；2026-10-15 |
| GPT-6 Sol（`gpt-6-sol`，Standard ≤272K） | $2 | $0.20 | $10 | [一手：模型页](https://developers.openai.com/api/docs/models/gpt-6-sol)；2026-10-11（UTC+8） |
| GPT-6.1 Sol（`gpt-6.1-sol`，Standard ≤272K） | $2 | $0.10 | $10 | [一手：模型页](https://developers.openai.com/api/docs/models/gpt-6.1-sol)；2026-10-11（UTC+8） |
| Grok 4.7（基础档 ≤200K） | $2 | $0.50 | $6 | [一手：模型页](https://docs.x.ai/developers/models/grok-4.7)；2026-10-15 |
| **Claude Sonnet 5.5** | $2 | $0.10（2026-10 减半） | $10 | [一手：API 价表](https://platform.claude.com/docs/en/about-claude/pricing)；2026-10-15 |
| **Claude Opus 5.5** | $4 | $0.20 | $20 | [一手：API 价表](https://platform.claude.com/docs/en/about-claude/pricing)；2026-10-15 |
| Gemini 4 Argon（Standard，截至 2026-11-30） | $2（12-01 起 $4） | $0.10（12-01 起 $0.20） | $10（12-01 起 $20，含 thinking） | [一手：Gemini API 价表](https://ai.google.dev/gemini-api/docs/pricing)；2026-10-15 |
| **Claude Fable 5.1** | $10 | $0.25 | $50 | [一手：API 价表](https://platform.claude.com/docs/en/about-claude/pricing)；2026-10-15 |
| GPT-6 Astra（Standard ≤272K） | $10 | $1 | $50 | [一手：模型页](https://developers.openai.com/api/docs/models/gpt-6-astra)；2026-10-15 |

**表中未展开的计费维度** **[一手；本轮局部复核]**：
- `gpt-6-sol` / `gpt-6.1-sol` 的 Standard 基础档 **30m** 缓存写入均为 $2.50/百万 token。总输入 >272K 时，整次请求的输入/缓存费率为基础档 2 倍，输出为 1.5 倍。API Fast 为适用 Standard 费率的 2 倍；`gpt-6.1-sol` Ultrafast 为 6 倍；Batch/Flex 为一半。不要把 6.1 的缓存价或 Ultrafast 可用性套给 6 Sol。见上方精确模型页。
- Luna／Astra 的基础 **30m** 缓存写入分别为 $0.125／$12.50；总输入 >272K 时同样对整次请求收取输入／缓存 2 倍、输出 1.5 倍。Grok 4.7 在 >200K 时另计，长上下文预算须查对应地区的价表，不能沿用基础行。**[一手：上列模型页，2026-10-15]**
- **OpenAI API 缓存先保留默认 `30m`；稳定前缀需隔数小时复用时，才试 `12h`；复用不足以抵消写入成本就退回 30m。**

  GPT-5.6 及以后模型在 Responses API 用 `prompt_cache_options.ttl` 选择；写入分别按普通输入价的 **1.25／2.5 倍**计，替代而非叠加普通输入价，读取单价不变。Standard ≤272K 的 12h 写入：6.1 Sol $5、Luna $0.25、Astra $25／百万 token。

  最低寿命保障的是缓存读计价资格，**不是每次复用 KV 或更低延迟的保证**；也不外推订阅内 Codex／Work。**[一手：[指南](https://developers.openai.com/api/docs/guides/prompt-caching)、[价表](https://developers.openai.com/api/docs/pricing)，2026-10-21；研究：选择，未实测；[补核](research/2026-10-10-audit.md#s1h--2026-10-21-api-缓存寿命与写入预算)]**
- Haiku 5.5 的 100K 门槛包含缓存读取与写入，逐请求判断，不是整段会话累计值；缓存写入还区分 TTL。完整规则见 [Claude API 价表](https://platform.claude.com/docs/en/about-claude/pricing)。
- Gemini 4 Argon 仅支持隐式缓存，命中后按输入价的 **5%** 计费（优惠 95%，不是“九五折”）；显式 `cachedContents`／`caches.create` 不支持。上表为 Standard，Batch／Flex／Priority 另计，搜索等工具费不在 token 单价内。长期预算按 2026-12-01 起的费率估算。**[一手：上列价表与迁移指南；研究：预算建议，2026-10-15]**

- **Haiku 5.5 降价不等于任务总成本下降**：对比 Haiku 4.5 的 Standard 输入／输出 $1／$5，上表 ≤100K 档下降 **90%**，>100K 档下降 **50%**，不是统一 75%。[官方模型页](https://platform.claude.com/docs/en/models/haiku-5-5/overview)确认 1M 上下文；[系统卡 §8.9.3](https://www-cdn.anthropic.com/e1080d6bf5ae2018ea3c2f414064be03232f5be5/Claude%20Haiku%205.5%20System%20Card.pdf#page=128)的 OSWorld 72.4% 是检查点部分得分，严格成功率为 37.1%，均非本项目实测；自建 computer-use 先核第 1 节的接口迁移条件。**[一手／算术；研究：采用边界，2026-10-16 UTC+8]**
- **Claude 订阅附带 API 额度仍有用途边界**：Max 5x $100、Max 20x $200、Team 最多 $500／月（团队共享）；须领取且只覆盖合资格运行入口，不能抵所有 Code 用量，见 [18 成本治理](18-team-adoption.md#5-成本治理)。**[一手，2026-10-15 补核]**
- **Mistral Large 4 仍按预览候选比较**：上表限时价不能当长期预算，参数规模、厂商领先主张和社区好评不能证明本任务更划算；模型与发布条件回[官方页](https://docs.mistral.ai/models/mistral-large-4)。**[一手：预览与价格；研究：采用边界]**
- **降价必须指定比较对象和计费项**：Opus 5 的 Standard 输入/输出 $5/$25 → Opus 5.5 $4/$20，下降 **20%**（[一手价表](https://platform.claude.com/docs/en/about-claude/pricing)）。原“同档模型整体下降 40–50%”缺少固定样本与统一口径，不作为市场统计；“达到 Fable 5.1 水平”保留为厂商能力主张，不能据此认定所有任务质量等价。
- **缓存收益看实际复用**：长且稳定的前缀在有效期内反复命中时，可降低重复输入成本；折扣按模型价表，不统一按十分之一。[Claude 缓存指南](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)的 5 分钟／1 小时写入分别按普通输入价的 1.25／2 倍收费；未复用的写入、缓存重建以及输出、工具与返工仍计入整项任务成本。先查实际命中与总费用，不为保缓存拒绝必要的模型调整。**[一手；研究：采用条件，2026-10-17 UTC+8]**

- **失效排查按厂商与配置**：[Claude 缓存指南](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)说明，更改顶层 `output_config.effort` 会使消息缓存失效，对工具/系统缓存的影响依模型而异；显式写出原默认值不算变化，支持逐消息 effort 的模型也有保留前缀的路径。模型切换、前缀改动和 TTL 是排查因素，不能一概断言每次修改都会清空全部缓存。当前 [Claude Code 成本文档](https://code.claude.com/docs/en/costs)将缓存统计放在 `/usage` 的 Session 区；它覆盖主会话，不能当作全部子 Agent 的合计 **[一手]**。
- **Harness 开销看完整任务**：[Systima 历史实验](research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)与[本仓旧实验](19-experiments.md#3-e1固定开销)记录的是含缓存的原始输入量，不能当普通输入账单、订阅消耗或当前客户端成本排名；本仓原逐次数据还存在缺失。先定位实际负担，再比较质量、返工与含缓存总成本，配置范围和当前诊断见 [S1c](research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)。**[社区／经验：历史记录；研究：选择]**

<a id="21-新类别决策模型2026-09-起"></a>

### 2.1 决策模型：有限选项不等于可以放心执行 🧪

**何时值得加**：已有反复出现的分类、候选路由或检查项预筛，选项含义清楚、需要理解自然语言，而规则或当前模型有具体质量、等待或成本缺口时，再比较决策接口；现有方案够用就保留。不把开放式规划整体改成一次选项打分。是否保留，看本任务误判、复核量及包含失败与升级的总成本；节省被漏报或复核抵消就撤回。**[研究：采用边界，未实测；依据与原测试见 [S1d](research/2026-10-10-audit.md#s1d--2026-10-16-决策接口的评分与执行边界)]**

**先辨分数，再定阈值**：[Clef 模型卡](https://huggingface.co/Cloudflare/clef#model)说明选项 logits 经 softmax 得到概率；[Jev 的 Choice confidence](https://docs.typesafe.ai/confidence)则是从分布计算的集中程度，不能直接读成正确率，也不把其公式套给其他接口或 Score 题型。用本项目有可靠标签的样本检查误报、漏报及阈值下的覆盖率，按错误代价定路由／复核条件；训练时做过校准、输出合法或与强模型一致，都不证明目标任务正确。[OpenAI 指南](https://developers.openai.com/api/docs/guides/decisions#interpret-the-answers)也要求按应用标签与误报／漏报代价设阈值。**[一手：字段与指南；研究：采用判断，2026-10-16（UTC+8）]**

**回退和授权由程序守住**：类别不全时留 `other`／“以上皆非”；缺证据、低于已验证阈值或接口拒绝时，补信息、升级或交人复核，不把这些状态算执行成功。[OpenAI API](https://developers.openai.com/api/reference/resources/decisions/methods/create)可逐题返回 `refusal`，同请求其他题仍可能正常作答，应逐项处理。动作还须通过当前状态、参数和权限检查；高分不会新增授权，也不能跳过原本必需的确认。**[一手：接口与回退指南；研究：执行边界]**

## 3. 订阅、额度与成本控制

| | 订阅（Claude Pro/Max、ChatGPT Plus/Pro…） | API 按量 |
|---|---|---|
| 成本 | 固定订阅费覆盖一定用量；额外 credits 另计，是否划算取决于实际任务 | 按适用 token 类别、速度及工具等用量计费 |
| 限制 | 按产品和计划区分；当前 Codex/Work Pro 无 5 小时限制，Plus 等有时间窗口额度，周限制也可能适用 | 速率限制及适用的账户/项目开销控制 |
| 适合 | 个人交互开发 | CI、批处理、团队计费、自建工具 |

**Codex / Work 的三种计量口径**（2026-10-10 UTC，[一手：Pricing](https://learn.chatgpt.com/docs/pricing)）：

| 速度（相对同一模型 Standard） | 订阅内额度消耗 | 另购 credits / Enterprise 按量 credits |
|---|---|---|
| Fast | 2.5 倍 | 2 倍 |
| GPT-6 Astra / GPT-6.1 Sol Ultrafast | 8 倍 | 6 倍 |

API-key 计费另按 API 价表；不要由美元或 credit 单价估算订阅内可做任务数。Codex credits 无独立缓存写入收费，API 的缓存写入规则不能移植到 credits。Work 与 Codex 共享用量，任务上下文、推理、工具和缓存都会影响消耗；这里没有读取任何用户账户额度。

**2026 下半年的变化**：
- **不符合旧额度资格的新订 Pro 200 按现行较低额度预算，别按旧“20 倍”购买。** 当前 Pro 为 $100/$200/$500 月费档；$500 档有 Ultrafast 访问资格，并非无限用量。[官方 Pro 说明](https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers)已确认 $200 档新旧订户的额度过渡条件，详见下段。历史“Plus 20 倍降至 10 倍”的精确倍率仍未核实；这不影响“新订户可能适用较低额度”已获官方确认。**[一手；研究：购买边界，2026-10-17 UTC+8]**

  **旧额度资格**：2026-09-22 至 09-29 上午 10 点（Pacific Time）期间任一时刻有有效 Pro 200 订阅者，在该订阅有效时可沿用旧额度至 10-29，此后转较低额度、月费仍为 $200。同账号重订也按该窗口判断，不能仅凭“曾订过 Pro”认定适用。10-29 结束的具体时刻／时区未注明；官方也未列出新旧精确倍率。[完整核查范围](research/2026-10-10-audit.md#pro-200-新旧订户条件2026-10-17-补核)另列。“体感六折”与相反体验仍仅是 [11 的社区自述](11-community-pulse.md#7-中文社区额度与交付自述)，不能用于换算统一降幅。**[一手：资格与过渡；社区／研究：证据边界]**
- **GPT-5.5 于 2026-10-14 19:00 UTC 起在以 ChatGPT 登录的 Codex 中退役**；OpenAI API 和 API-key 登录的 Codex 不受该次退役影响。受影响的配置按当前可用模型与任务需要替换，不统一指定继任型号，见 [Codex 选择](01-agents/codex.md#2-模型按任务与实际用量选择)。**[一手：当前模型文档，2026-10-15 补核]**
- Claude 订阅耗尽速度有[具体历史报告](https://github.com/anthropics/claude-code/issues/26271)，但版本、任务与套餐不同，不能从个案或点赞推定当前普遍可用天数；范围见 [Claude](01-agents/claude-code.md#6-已知问题与社区反馈)。**[社区：原帖；研究：边界，2026-10-15 补核]**。


**控制成本的做法** ✅：
1. 先查原生状态和服务商账单；需要历史定位时，按[下节边界](#31-查异常消耗ccusage-只补历史诊断)试用 ccusage，不把估算当结算 **[一手；经验：采用判断]**；
2. 无关任务之间 `/clear`；同任务续接比较恢复费用与新开遗漏／返工，Claude 的休眠恢复额度警告不是必须清空历史。腾空间再选 `/compact`，它本身也要读上下文；具体选择见 [Claude](01-agents/claude-code.md#33-并行与自动化5-种并行方式)与 [03](03-context-engineering.md) **[一手；研究：2026-10-20，未实测净省]**；
3. **按任务选择子 Agent**：只拆可独立验收或需隔离冗长输出的支线；共享背景多、频繁往返的小任务留主会话，见 [08](08-multi-agent.md)。历史小任务的输入量倍率不能当当前费用或额度倍率 **[一手；社区：历史报告；研究：采用判断，2026-10-15]**；
4. 让嘈杂的命令安静输出（加 quiet 参数），或者放到子 Agent 里跑；
5. **👀 分流先比较固定分工，再评动态路由**：大量读取／模式化生成有明确负担、结果可检查时，可试轻量 worker；Spotify 约 90% 仅指主模型侧读取上下文节省。重复仓库 issue 可比较“固定便宜模型＋核对过的定位证据”：Scrouting 中该组合与路由版同分且略便宜，但不证明一般等效。路由须相对固定分配有新增收益；把探查、验收与返工计入，无净收益就撤回。见 [原方法、消融与反例](research/2026-10-10-audit.md#s1e--2026-10-16-轻量模型分流与主模型侧节省)。**[一手：作者报告；研究：外部实验与采用判断，2026-10-18，未实测]**；
6. **给按量计费设预算与停用边界**：有开通权限的 Agent 可能产生额外费用；AWS 新体验项目和 GCP 合资格服务已有 spend limit / spend cap，但适用范围和超额计费不同，不能视为所有云服务通用的硬性封顶（见 [18 第 5 节](18-team-adoption.md#5-成本治理)）。**[一手：AWS、Google Cloud；研究：采用建议]**

**路由对照要包含本来会用的固定模型，即使它不在路由候选池。** 让Agent比较同题质量及含分类、切换缓存、失败重试的总投入；人按实际替代方案决定是否保留。9-26公布的试验中，比最贵模型便宜的路由仍输给固定中价模型；这是单轮文本反例，仓库修改还要另验。见[原生路由、开源正反例与计费范围](research/2026-10-12-community-source-records.md#p82动态路由先选对固定基线)。[一手／研究：2026-10-22核]

### 3.1 查异常消耗：ccusage 只补历史诊断

**🧪 原生状态无法解释历史异常时，再试 ccusage。** 当前会话先查 Codex [`/status`、`/statusline`](https://learn.chatgpt.com/docs/developer-commands?surface=cli)，实际结算看服务商；[ccusage](https://github.com/ccusage/ccusage/blob/main/docs/guide/codex/index.md)补日/月/会话报告，已知 UUID 可用 `ccusage codex session --id <完整UUID> --json` 定位。只读获准的脱敏日志，能解释差异才保留；本地读取不授权上传。**关键局限**：实验性适配无法补回缺失日志，token、估算成本、实扣与剩余额度不能互换；[计量复核](research/2026-10-13-session-usage-metrics.md)记录缓存分项与修复链，速度另见 [17](17-troubleshooting.md#会话用量与速度不能混算)。**[一手；经验：采用判断，2026-10-13，未运行]**

### 3.2 多账号与网关：先区分显式切换和请求调度

**Magpie：👀 评估自动多账号调度。** 基线是官方登录与明确的账号/项目边界；多个已授权个人账号确有配额分担需求，才评估[按配额调度、会话黏性与指定账号](https://github.com/yetone/magpie/blob/main/docs/reference.md#how-magpie-picks-an-account)。**关键局限**：黏性不是硬隔离、[额度阈值也不保证绝不超额](https://github.com/yetone/magpie/issues/1295)；须核对真实请求账号与凭据流向，公司任务不自动 fallback 到个人订阅。**[一手；社区：单例；经验：采用判断，2026-10-12，未实测]**

**CC Switch：👀 评估显式账号与供应商切换。** 官方登录及独立配置已够用就不加；需要统一管理时，比较[独立账号卡与切换后重启](https://github.com/farion1231/cc-switch/blob/main/docs/release-notes/v3.20.0-en.md)。[4.0 已有 Routing 与 Aggregation](https://github.com/farion1231/cc-switch/blob/main/docs/release-notes/v4.0.0-en.md)，不能仅按直连切换器比较；官方 ChatGPT 卡排除自动 failover。**关键局限**：切卡不证明旧进程已换身份，登录包写入与 [OAuth 代理的账户/条款风险](https://github.com/farion1231/cc-switch/blob/main/docs/user-manual/en/2-providers/2.1-add.md)须单独审查，不让两个管理器同时改配置。**[一手；经验：采用判断，2026-10-12，未实测]**

## 4. 国内 Coding Plan

**🧪 先确认使用资格和用途，再比较月费。** 兼容 Anthropic／OpenAI 协议不等于通用 API 额度：先核套餐允许的工具、用途和专用 endpoint。下面只把已核条件用于选型，不以社区能力评价决定迁移。**[研究：采用判断，2026-10-15]**

| 厂商 | 说明 |
|---|---|
| 智谱 GLM | [官方政策](https://docs.z.ai/devpack/usage-policy)限订阅者本人及官方支持工具；[FAQ](https://docs.z.ai/devpack/faq)列 GLM-5.3／5.3-Flash 与专用 endpoint，不能把协议兼容视为任意客户端均获许可 **[一手，2026-10-15]** |
| Kimi | 中国区新套餐 Code 从 Plus ¥99/月起；Go ¥49/月不含 Code。存量 Andante 等保留原资格，不能按新套餐名称推断老用户权限；见[官方套餐表](https://www.kimi.com/en/help/membership/membership-overview) **[一手，2026-10-15]** |

Kimi 新套餐无周限制，仍受滚动 5 小时限制与月度共享 credits 约束；[使用规则](https://www.kimi.com/en/help/kimi-code/community-guidelines)限个人交互使用，脚本批处理等非交互自动化应改用适用的平台 API。**关键局限**：价格、资格与用途分别核对，CLI 有非交互参数也不代表订阅允许该用途。**[一手；研究：选择，2026-10-15]**

MiMo、DeepSeek、MiniMax、百炼仍是可另行比较的候选；本次未核其当前套餐，不保留“第一”“很便宜”等缺少同口径比较的购买依据。**[研究：撤回历史推荐]**

**注意**：
- 换成第三方模型后，Claude Code 的部分功能（如 auto mode 分类器）可能不可用或效果不同。
- 除模型 endpoint，还要核客户端、快照和遥测的外发路径；旧客户端事件不能外推为当前所有版本的行为，历史案例及修复范围见 [13](13-frontier-radar.md)。**[研究：数据边界，2026-10-15]**
- 多个服务商之间切换：先判断是显式切换还是请求调度，见[账号与网关边界](#32-多账号与网关先区分显式切换和请求调度)。比较网站：[codingplan.org](https://codingplan.org/en)。

## 5. 本地 / 开源权重模型

**🧪 已有硬件且确需离线时，先评估本地；仅为省钱，不按模型参数或 token/s 买显卡。** 先固定量化格式、目标上下文、并发和 CPU／GPU 卸载方式，再比较完成同一任务的时间与总成本。硬件摊销、电费、维护和失败重试都算预算；若不能满足目标延迟或质量，撤回该配置，允许外发的任务再比较托管服务。**[研究：采用与撤回条件，2026-10-15，未实测]**

| 场景 | 条件候选与边界 |
|---|---|
| 已有 32GB 以上内存笔记本 | 评估 [Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B)、[Qwen3.6-35B-A3B](https://huggingface.co/Qwen/Qwen3.6-35B-A3B) 或 [Gemma4-26B-A4B-it](https://huggingface.co/google/gemma-4-26B-A4B-it) 的兼容量化产物；内存容量不是可用上下文或速度保证 **[一手：模型卡；研究：候选]** |
| 已有单张 RTX 3090／4090 | 评估量化权重与实际 VRAM 余量；不能把“可加载”或 CPU 卸载后的运行当成全 GPU 性能。Qwen3.6 的 A3B 是激活参数，总量仍为 35B **[一手：模型卡；研究：条件]** |
| 为更大模型购置工作站 | 👀 暂只做容量、功耗与任务预算；没有绑定量化、上下文和并发的吞吐数字，不足以证明投资回报 **[研究：购买边界]** |

**不要把文件大小当运行内存**：Qwen3.8 官方[原始仓库](https://huggingface.co/Qwen/Qwen3.8-27B/tree/main)显示约 55.6GB 文件，“17GB”必须指明具体量化产物。[Ollama](https://docs.ollama.com/faq#how-does-ollama-handle-concurrent-requests)另说明并发与上下文会增加内存需求；其 `ollama ps` 可区分 CPU／GPU 加载。上述模型卡标注 Apache-2.0，选定量化或衍生包时仍核其来源与许可证。**[一手，2026-10-15]**

**effort 看整项任务**：Qwen3.8 官方默认 `xhigh`；短任务可试 `medium`／`low`，多轮编码不能预设越低越省。[官方模型卡](https://huggingface.co/Qwen/Qwen3.8-27B#api-usage)提示较低 effort 可能增加失败与重试，抵消单轮提速。**[一手；研究：配置选择，2026-10-15]**

**保密取决于完整路径**：本地权重之外，还要核模型 endpoint、harness、搜索／MCP 与遥测的外发路径。Ollama 支持云模型和搜索，需按[官方 local-only 设置](https://docs.ollama.com/faq#how-do-i-disable-ollamas-cloud-features)关闭云功能；这不替其他工具保证离线。**[一手；研究：适用条件，2026-10-15]**

原“家用模型相当于 Haiku／Sonnet”“质量落后前沿若干月”和 HN“共识”未有同任务、同 harness、同预算证据，本页撤回其普适推荐；选型用[本项目任务集](09-review-and-quality.md#3-给自己的-ai-配置做评估)，不把厂商自报分数当质量等价。**[研究：证据边界]**

## 6. 基准测试：怎么看才不被误导

**历史榜单快照（2026-10-05 原记录，本轮未复核）**：仅供定位原来源，不作为当前排名或跨模型成本比较。**[一手：历史记录；研究：适用范围]**

| 榜单 | 当前情况 |
|---|---|
| [SWE-bench Verified](https://www.swebench.com) | 最高 79.2%（2025-12）；**最新条目停在 2026-02**，之后的模型（Opus 5.x、Fable、GPT-6）都没有上榜。Multilingual（bash-only，2026-02）：Gemini 3 Flash 72.7%、Claude 4.6 Opus 72.0%、GLM 5 69.7%、MiniMax M2.5 68.3%（成本只有其他模型的约七分之一） |
| [Scale SWE-bench Pro](https://scale.com/leaderboard/swe_bench_pro_public) | 公开集：Muse Spark 1.1 61.5%、GPT-5.4 xHigh 59.1%、Claude Opus 4.6 51.9%；**私有商业代码集**最高 51.5%。使用 copyleft 许可的代码来降低数据污染 |
| [Terminal-Bench](https://www.tbench.ai) | 已更新到 **4.0** 版（Stanford / Laude Institute） |

**怎么看**：
1. 先核榜单更新时间、数据集版本和评测来源；厂商自报与官方榜单分开，不能由上面的历史快照推断当前排名。
2. 分数是**模型 + harness + 预算**的组合结果：Scale 的灰色条目就是限制了成本和轮数的结果。
3. 公开集与私有集的任务、模型和预算不同，不能用各自最高分相减推导固定差距，也不能只因私有就认定更贴近本项目。
4. **选型优先用本项目的代表任务，并先校准判定。** 换模型或配置时重跑，核检查是否覆盖真实需求、有没有把参考实现细节当必需条件；私有不自动等于可靠。Stet 的公开维护样本正显示这种错位（方法见[09](09-review-and-quality.md#3-给自己的-ai-配置做评估)）。

## 来源

- 价格与选型核查记录：[历史日期](research/2026-10-10-audit.md#页面日期与历史覆盖)、[发布与迁移](research/2026-10-10-audit.md#s1b--2026-10-15-主干时效补核)、[套餐与本地模型](research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)

- [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)、[Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)、[Maximizing the value of your Claude Code sessions](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions)、[Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)
- OpenAI：[Models / GPT-5.5 退役](https://learn.chatgpt.com/docs/models)、[What's new](https://learn.chatgpt.com/docs/whats-new)
- Simon Willison：[价格战](https://simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/)、[2026 in LLMs](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/)、[默认硬性预算上限](https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/)
- [Systima token 开销实测](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)、[Spotify Portal](https://engineering.atspotify.com/2026/9/portal-by-spotify-cut-my-claude-code-token-usage-by-90)
- HN：[GPT 6.1 Sol](https://news.ycombinator.com/item?id=49896586)、[GLM-5.3](https://news.ycombinator.com/item?id=49294997)、[Ask HN：本地模型](https://news.ycombinator.com/item?id=48542100)
- [Latent Space：Gemini 4 Argon](https://www.latent.space/p/ainews-gemini-4-argon-gdms-answer)、[MiMo-V2.6-Pro](https://www.latent.space/p/ainews-xiaomi-mimo-v26-pro-1t-a42b)
- 官方榜单：[swebench.com](https://www.swebench.com)、[Scale SWE-bench Pro](https://scale.com/leaderboard/swe_bench_pro_public)、[tbench.ai](https://www.tbench.ai)
