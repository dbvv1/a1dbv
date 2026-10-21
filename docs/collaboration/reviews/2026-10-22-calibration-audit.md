# 计分板校准：大体可信，局部比较仍会被整页分数放大

核实日期：2026-10-22（UTC+8）。固定最新拉取的 main `f3ed2bca44bac831743a1c529e314dcd7c750cac`，提交时间为2026-10-22 03:16:34 UTC+8。审计者只写过审计，没有参与被审正文。[一手：Git；研究：独立判断]

## 结论

**自评大体可信，游戏02的整页分数偏高。** 计分板为C1登记26／29、C2登记7／12，合计33／41；其中16页自评1，没有0分。本轮优先满足“≤1全部入选”，再选游戏03和2D两个2分页，共18页，超过提示词的10页。[一手：scoreboard输出；研究：抽样解释]

02修正统一中档，20连起恢复与当前版本接收；07／08／14原审计已是1，本次补登记。内容有实质取舍，并非批量填标记。[研究]

**1表示主要选择已比近期领先机制，局部不代整页。** 最优未知或缺本仓实测不自动扣分；同题允许条件比较。[研究]

## 登记快照与抽样

全33个标记如下，主干按编号。C1除24为gen=2026-09外均2026-10；C2见表。checked为10-21／22，无错误／过期。[一手]

| 范围 | 状态／差距 | 全部已登记页面 |
|---|---|---|
| C1 | 已比较／1 | 00、01入口、02、03、04、05、06、07、08、09、10、14、15、20、22 |
| C1 | 已比较／2 | 11、13、16、17、18、21、23、24 |
| C1 | 仅候选／2 | 01/ide-and-others、01/open-source-agents |
| C1 | 未知／2 | 01/gemini-cli |
| C2 | 已比较／1 | 02-verification-and-playtesting（gen=2026-07） |
| C2 | 已比较／2 | 01-engine-integration、03-generative-ai-in-games、05-gameplay-architecture（2026-09）；assets/3d（2026-10）、assets/materials（2026-06） |
| C2 | 仅候选／2 | assets/2d（2026-09） |

先按标题／问题重找来源，再读正文、对照旧卡；旧知识不能消除，不称双盲。S链接／日期见下。[研究]

| 页面 | 自评状态／差距 | 独立差距 | 核对结论／补强参照 |
|---|---|---:|---|
| 00总览 | 已比较／1 | 1 | S1／S3：整轮实现、风险接收有比较；内部规模未外推。 |
| 01选型 | 已比较／1 | 1 | S2：界面、工具／循环、环境分流有反例；型号只是可行起点。 |
| 02成本 | 已比较／1 | 1 | S4／S5：按角色配置投入，首屏同步；人工净投入仍缺。 |
| 03上下文 | 已比较／1 | 1 | S5／S6：撤冗余、保必要约束；摘要反例已改变默认。 |
| 04 MCP | 已比较／1 | 1 | S7：动作与协议分开，shell／窄目录有条件比较；Ramp本轮未取正文。 |
| 05 Skills | 已比较／1 | 1 | S6：产品理由与流程删减互相约束；S8是补强而非推翻默认。 |
| 06 Hooks | 已比较／1 | 1 | 三类检查／纠偏／授权覆盖核心问题；OCA本轮原文读取受限。 |
| 07工作流 | 已比较／1 | 1 | S1／S3：整轮／澄清、原生／整包及UI二改有实质取舍。 |
| 08多Agent | 已比较／1 | 1 | S5：质量与速度、lead与人工中转已分；S9补可执行依赖验证。 |
| 09评审 | 已比较／1 | 1 | S1／S4：事故与干净PR校准、扩量看有效发现和有害修改。 |
| 10安全 | 已比较／1 | 1 | 能力、授权、核查分层，S10支持审批摩擦取舍；安全率未证。 |
| 14综合 | 已比较／1 | 1 | S1／S3／S11：按后果接收，独立团队条件没有拼成统一胜率。 |
| 15打法 | 已比较／1 | 1 | 维护覆盖与补丁粒度分开；其余行为是明确保留的工程默认。 |
| 20长程 | 已比较／1 | 1 | S12／River及恢复论文连起续接、回退、升级、当前head；认可2→1。 |
| 22评估 | 已比较／1 | 1 | S4／S13：采用代理、判定器、整包归因分流；test择优未冒充终评。 |
| 游戏02验证 | 已比较／1 | 2 | 只比二改却给整页1；自动评价转真人的决定性结果未转化，详下。 |
| 游戏03供给 | 已比较／2 | 2 | S15：造车三路同题，仍缺玩家收益、二改与完整成本，保2合理。 |
| assets/2d | 仅候选／2 | 2 | 撤官方定位精改优先级；S16补结构接入，整族零手修仍未知。 |

**17／18页一致；低差距保留15／16，游戏02整页1→2，局部二改可维持1。** 补齐后再降，标记由执行者改。[研究]

## 原文参照

以下均读所列相关正文，年份2026；不称全文／复现。团队复盘与官方契约分开。[一手／研究]

- S1：[Claude Code评审](https://claude.dev/blog/solving-code-review-at-anthropic/)，Osmani等，10-15；风险、事故／干净PR校准与回滚。
- S2：[Browser Use](https://browser-use.com/posts/bitter-lesson-browser-agents)，Zunic，09-15；观察接口及撤循环。[Helix](https://shopify.engineering/helix)，Shopify，09-21；迁移checkpoint与质量门。
- S3：[Battle Drones](https://simonwillison.net/2026/Oct/20/battledrones/)，Willison，10-20；过夜修改、试玩及音频问题。
- S4：[Cloudflare优化](https://blog.cloudflare.com/obsessive-inference-optimization/)，Skidmore，10-19；角色effort、改行代理与跨厂商盲评。
- S5：[Cursor效率](https://cursor.com/blog/improved-token-efficiency)，Katz等，09-23；工具、缓存、委派及组合A/B。[Router](https://cursor.com/blog/how-cursor-router-works)，08-06；生产反馈与切换成本。
- S6：[Astra迁移](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)，Provencher，09-11；按需文档与完成状态。[Vercel设计](https://vercel.com/blog/teaching-agents-product-design-at-vercel)，Phamous，06-25；领域理由、lint、留出界面。
- S7：[企业工具比较](https://arxiv.org/html/2609.11999v1)，Mak等，09-10，方法／结果；Bash经MCP提供，能力面并不相等。
- S8：[Code2Skill](https://arxiv.org/html/2609.05571)，Tong等，09-04，§3、§5.1–5.5；源码盲重建与同协议有／无技能对照，未测当前Astra／5.5。
- S9：[NP-Bench](https://arxiv.org/html/2610.07261)，Muku，10-05，§5–6／9；小型契约迁移、实际merge。[AsynCodeBench](https://arxiv.org/html/2609.32662)，09-26，§3–5；19题、开放模型、依赖检查。
- S10：[Auto-review](https://alignment.openai.com/auto-review/)，Trębacz等，04-30；审批摩擦与沙箱边界，约六个月，仅作机制参照。
- S11：[Monzo Chip](https://monzo.com/blog/building-agent-chip)，Deshayes／Haley，08-13；工程师接收。[River](https://shopify.engineering/river-vulnerability-remediation)，09-02；当前head与修复闭环。
- S12：[Pi Durable](https://earendil.com/posts/pi-durable/)，Earendil，10-01；恢复／提交去重。[Agents API](https://openai.com/index/introducing-the-agents-api/)，09-10；原生耐久与压缩。
- S13：[Eval与hillclimb](https://claude.dev/blog/automating-eval-design-and-hillclimbing/)，Martin，09-28；样本、grader及test择优，仍需独立终评。
- S14：[Spec2Game](https://arxiv.org/html/2610.04253)，Cai等，10-03，§4–5；运行、规格与呈现分验，非连续二改／长期乐趣实验。
- S15：[Roblox Build](https://about.roblox.com/newsroom/2026/10/how-roblox-evaluates-build-game-creation)，Zhang等，10-08；规格、实现／设计、真实输入与呈现，多轮评价仍在扩展。
- S16：[SPRITE](https://arxiv.org/html/2604.18591)，2026-03／04公开，§3；结构、alpha提取与引擎输出，仅UI范围。

## M6漏检参照

固定树检索S8、S9两篇、S14、S16未命中，得5项**发现遗漏候选**；定点复核再找到ReviewBench，共6项。只说明这组外部参照未进入受查材料，不是全网漏检率。[一手／研究]

- 05／03，S8：比源码提炼的程序知识与文档摘要，再决定放计划或评审；旧代模型，不要求安装技能库。
- 08／22，S9两篇：将共享接口约束转成集成后依赖检查，复用原任务验收，不另建协调平台。
- 游戏02，S14：比能运行、规格实现与下一动作可理解性；不外推连续二改或长期乐趣。
- 2D，S16：补原生UI、切片、结构化重建的条件比较，不推翻原生控件优先。
- 09，[ReviewBench，GitHub，10-05](https://github.blog/ai-and-ml/reviewbench-an-open-benchmark-for-ai-code-review/)：已读校准与线上A/B段，可补评审采用验证；addressed rate仍由LLM判定，不能当缺陷正确率。与Microsoft论文也非完全独立企业阵营。

**转化缺口是游戏02回调的直接理由。** 已引用的[Play2Code v2，10-02，附录H](https://arxiv.org/html/2605.28258v2)以50个moderate-gain任务比较真人与GUI反馈，真人后期仍发现更细交互问题；C.3区分游戏与评价器失败。[RSIGame，09-30，F.2](https://arxiv.org/html/2609.39045v1)展示分数与可读性／可玩性分离。原文相关段本轮已读，页面却主要取裁判分离与旧分保留，应转成“何时用GUI、何时追加真人、如何识别假阻塞”的选择；不据此断言作者没读。S15在游戏03已存在，也应复用。[研究]

**读取缺口**：Ramp原站正文失败；GameDevBench仅PMLR摘要。**截止后新增**：Shopify10-21新文仅索引，发布时间不明，未计漏检。ReviewBench为后验补查，另记。[研究]

## 机制与重心

1. **显示分歧，不改变两种分数的含义。** `scoreboard.py`有标记便按自评排序／计数；TSV游戏02=2不会改变自评1。建议输出自评／独审／审计后是否改过，交执行者按证据处理；永久取最大值会让旧审计压住新改善。[源码；研究]
2. **按主要选择验整页。** 用“主要选择→领先替代→决定／未覆盖”短表，替代更多证明记录；游戏02须补真人与自动评价比较，不要求每条API做SOTA实验。[研究]
3. **复用来源，补不同证据角色。** Cursor组合A/B不能独立证明四页各机制净收益；02的Cloudflare是有效补强，S8／S9值得转化，不能仅靠博客数量达标。[研究]
4. **删硬水位冲突。** 手册要求至少3项并立即补，后文却不为数量立项，TASKS又暂停扩页。保留按真实未决选择接续。A已转深核心12页，B的P63／P64／P37聚焦资产与AI接入，本窗口未见整体偏离C1／G1；吞吐与在线状态不由提交数推定。[一手／研究]
5. **默认先行，限制就近收束。** N/F与秒级墙钟不决定质量。主文保留默认、原因和一个撤回条件；下一步先补游戏02现有证据转化，再做有界漏检补强，不为登记扩新专题。[研究]

## 五条动态事实

近期增补的功能／计费契约五项均获原文支持；未执行账号调用。[一手；10-22核]

| 位置／事实 | 原文核对 |
|---|---|
| 02：GPT-5.6+的30m／12h写价为输入1.25／2.5倍，非叠加 | [Cache lifetime](https://developers.openai.com/api/docs/guides/prompt-caching)：一致，计费寿命不保延迟 |
| 04：2026-07-28取消初始化握手／协议级会话 | [Versioning](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)、[HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)：一致 |
| 09：10-15 Code Review GA、Team／Enterprise、仓库三档 | [公告](https://claude.com/resources/articles/code-review-is-now-generally-available)：一致，Quick／Standard／Deep |
| 20：Pi Durable为实验框架，不替代Pi CLI | [10-01原文](https://earendil.com/posts/pi-durable/)：一致；提交去重不等外部副作用恰好一次 |
| 02研究：2.1.305修ToolSearch被网关拒绝后的回退 | [官方CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#21305)：一致，为2.1.304回归修复 |

## 范围、基线与验证

已读18页首屏／最高水平节及对应研究段；未全审外链、API、模板／源码。其余23页未重评，原基线已有行／日期保留；补入00／04／06／10四行。本轮只核可见原文，不认证历史阅读行为。[研究]

仅新增报告、重写TSV；文档／公开扫描／diff及独立复核通过。完整离线入口缺bash／jq，预检阻断、零阶段；未安装／付费／运行模型或引擎。仅发布`codex/calibration-audit-20261022`。
