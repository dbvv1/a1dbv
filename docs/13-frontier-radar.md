# 13 · 前沿雷达（2026-10）

> 更新：2026-10-17（UTC+8）

<a id="本轮精选哪些变化会影响实际工作2026-10-15-补核"></a>
## 30 秒选择：这些变化值得你改什么？

| 你的问题 | 现在怎么选 | 主要依据与局限 |
|---|---|---|
| 降价或新模型发布，要不要换？ | ✅ 已有方案够用就保留；质量、等待或预算有缺口才比较。Gemini 4 Argon 已 GA，不再因“未开放”排除，但迁移仍须适配缓存与输出上限；长期预算不能沿用首发价 | [02 模型与成本](02-models-and-cost.md#1-原则按任务分档而不是追榜单)：官方契约与条件候选。单价、窗口和发布状态不证明本项目质量或总成本改善；返工抵消节省就撤回 **[一手／研究]** |
| 能不能交给 Agent，离开电脑后继续？ | ✅ 先按任务所需资源选云端或本机；本机线程须保持唤醒与连接。恢复外部写入前先查结果，不因版本修复就盲目重试 | [Claude Code 并行与自动化](01-agents/claude-code.md#33-并行与自动化5-种并行方式)：Projects 入口与停止／恢复边界。云端持续运行不保证本机资源可用，停止机制也不等于账户硬预算 **[一手／研究]** |
| 新流程、Skill 或插件值得加吗？ | ✅ 对已能规划和验证的 Agent，先保留轻量方案；缺领域配方或有明确质量目标时，🧪 加最小补充。没有改善结果、反而增加等待或人工处理，就缩减或撤回 | [05 Skills 与插件](05-skills-and-plugins.md)：规范、宿主实现与采用条件。可加载不等于权限可移植，案例与完整流程都不保证净收益 **[一手／经验]** |

## 1. 时间线：2026 年发生了什么

以下保留历史事件和当时的判断，供追查来源；当前选型按上面的主专题。旧条目的核实基线为 10-08，后续只局部补核，范围见[核查记录](research/2026-10-10-audit.md#页面日期与历史覆盖)，不能把整条时间线当成当前能力或可用性认证。

| 时间 | 事件 | 来源 |
|---|---|---|
| 2025-11 | Claude Opus 4.5 和 GPT-5.1 发布；Willison 将其与各自 harness 的组合评为开始能日常使用，这是作者判断，不是跨项目可靠性验证 | [Willison 年度演讲](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/) **[社区：作者判断，10-17 补核]** |
| 2026-01–03 | **OpenClaw** 爆火，开创了“Claw”这一类个人或通用 Agent（本质是换了外壳的 Coding Agent）；Mac mini 一度卖断货 | Willison 演讲 **[社区：历史记录，10-08 基线]** |
| 2026-02 | StrongDM 提出“软件工厂”的两条规则：**代码不由人写，代码不由人审**。“不读代码怎么确信质量”成了全年主题 | Willison 演讲 **[社区：历史记录，10-08 基线]** |
| 2026-02–05 | “Tokenmaxxing”（比谁 token 用得多）先热后冷：Meta、微软、Uber 先推广后限额，因为 Agent 一天就能花掉 1000 美元 | Willison 演讲 **[社区：历史记录，10-08 基线]** |
| 2026-04 | Anthropic 的 **Claude Mythos** 只向安全研究者开放；Willison 报告 Qwen3.6-35B-A3B 的本地运行体验，不代表任意笔记本都适用（配置条件见 [02](02-models-and-cost.md#5-本地--开源权重模型)） | Willison 演讲 **[社区：历史记录，10-08 基线]** |
| 2026-06 | Claude Fable 5 发布 3 天后被美国政府以出口管制叫停，7 月 1 日恢复 | Willison、Reuters |
| 2026-07 | GPT-5.6（Willison 称其为“Fable 级”，是作者分档）；Claude Opus 5；**MCP 2026-07-28 版（无状态）**；OpenAI 的训练期 Agent 突破沙箱、入侵 Hugging Face | 能力分档：[Willison 演讲](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/) **[社区，10-17 补核]**；其余沿用 MCP 博客／Matthew Green 历史记录 **[一手／社区]** |
| 2026-08 | Claude Code 默认启用 auto mode；OpenAI 宣布拟终止对 Cursor 供模，日期与入口边界见 [11 §3](11-community-pulse.md#3-cursor按实际接入路径判断是否迁移)；Codex 支持从 Claude Code、Cursor **导入配置**；GLM-5.3 发布；本地模型 Qwen 3.8 27B | 厂商文档 **[一手]** |
| 2026-09 | GPT-6 Astra、Sol、Luna；**Claude Opus 5.5 与 Sonnet 5.5**；**价格战**；Claude Projects（云端并行线程）；Claude Mods；Gemini 4 Argon（当时受限开放，当前 GA 条件见 [02](02-models-and-cost.md#1-原则按任务分档而不是追榜单)）；GPT-6.1 Sol | 厂商页面、Latent Space **[一手]** |
| 2026-09 下旬 | **决策模型**兴起：TypeSafe AI 发布 Jev（9-15），几周内出现 Cloudflare Clef、OpenAI Decisions API 和大量开源复现；OpenAI 发布 **Dots**（常驻 Agent，每个都有自己的云端工作区）；AMD 宣布以约 82 亿美元收购 World Labs（世界模型） | 厂商博客 **[一手/二手]**、HN **[社区]** |
| 2026-10 第一周 | DeepSeek 开源 **DeepSeek Harness**（桌面版 + Web，“一切皆插件”）；**Mistral Large 4**（API 预览；当时公告计划月底发布权重，不等于已可本地部署，见 [02](02-models-and-cost.md#2-价格快照api-美元百万-token)）；Wikimedia 确认发现 OpenAI 失控 Agent 的活动；**Claude Haiku 5.5**（价格随输入档位变化，见 [02](02-models-and-cost.md#2-价格快照api-美元百万-token)）；GPT-6 向所有用户开放，并推出 Intelligent UI；GitHub Copilot 本地沙箱正式可用、推出 Dynamic workflows、computer use 和多模型编排 HydraFusion | 厂商页面 **[一手]**、HN **[社区]** |

## 2. 九个最重要的变化

### 2.1 “Fable 级”模型：瓶颈从写代码转向定义问题
[Simon Willison 的演讲](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/)把“Fable 级”用于描述他认为能在目标、约束和工具明确时解决问题的模型。这是作者的历史分档，不是统一能力标准或完成保证；不据此跳过实际验收，也不以它认定不同型号质量等价。**[社区：作者判断；研究：采用边界，2026-10-17 补核]**

**实践含义**：写好“完成标准 + 约束 + 验证手段”比写好提示词措辞重要得多。Anthropic 给 Opus 5.5 的官方建议也一样：在一条消息里给出完整任务、什么算完成、什么时候停下来问你 **[一手]**。

<a id="22-价格战同档模型价格一个季度内降了-4050"></a>
### 2.2 降价：先核计费项，再看整项任务成本

✅ 不按“同档模型一季度降 40–50%”估预算或决定迁移：该说法没有固定样本与统一口径，撤回。以 Opus 5 → 5.5 为例，Standard 输入／输出从每百万 token $5／$25 变为 $4／$20，降 **20%**；缓存读取从 $0.50 变为 $0.20，降 **60%**。同一代际也没有单一降幅。**[一手：[Claude 价表](https://platform.claude.com/docs/en/about-claude/pricing)，2026-10-17；算术]**

[Willison 09-22 的价格文章](https://simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/)分别比较了 Sol 跨代价格、Opus 普通输入／输出与缓存价，还注明旧 GPT-5.6 对照是促销价；保留为历史比较，不推广为全市场统计。“达到 Fable 5.1 水平”是厂商能力主张，不证明所有任务质量等价。**[社区：原文，2026-10-17 补核；研究：范围]**

当前价表、套餐和缓存口径只在 [02 模型与成本](02-models-and-cost.md#2-价格快照api-美元百万-token)维护。选择时比较同一任务的质量、含失败重试的费用和总耗时；已有方案够用就保留，低单价被返工抵消就撤回迁移。API 单价也不能换算订阅额度，额度自述的原帖与反证见 [11](11-community-pulse.md#7-中文社区额度与交付自述)。**[研究：采用边界，非任务效果实测]**

### 2.3 Harness 的隐性成本被量化了
Systima 2026-07 的历史实测：Claude Code 2.1.207／OpenCode 1.17.18、小样本隔离配置及自定义 API 代理。下表是该配置的输入量与缓存观察，不能作为当前默认开销或费用排名；选择须比较实际完整任务的质量、返工与含缓存的总成本，范围见 [S1c](research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)。**[社区：原文；研究：采用边界]**：

| 项目 | Claude Code | OpenCode |
|---|---|---|
| 读到你的提示前发送的 token | **约 33k** | 约 7k |
| 缓存写入 | 会话中反复重写，最多是 OpenCode 的 **54 倍** | 前缀逐字节不变，只写一次 |

- 同一历史报告中，一份 72KB 的 AGENTS.md / CLAUDE.md 让每次请求多约 2 万 token；另加 5 个普通 MCP 增加 5–7k，完整配置的首请求达到 75–85k。这些配置结果不等于当前默认负担，也不能把无 MCP 基础实验的 33k／7k 差值归因于 MCP。
- **历史单次案例**（Systima，2026-07-12；10-15 补核）：Claude Code 2.1.207 的同一小任务，直接做与双子 Agent 的累计输入量为 12.1 万／51.3 万，含缓存；不能推导当前费用或额度的固定倍率。配置与网关限制见 [S1c](research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)。
- **历史报告**（[19](19-experiments.md)）：默认输入约 31.6k；原 E1 的约 26.7k 是缓存读取，不能当工具定义。2.1.296 的 `/context` 补测给出默认工具定义约 22.9k，不是原 2.1.294 的精确拆分。E1–E3 已补交提示词、精简轨迹、逐次汇总与分项；E1 三份指令文本及逐次 stream 仍缺，完整原始轨迹未齐，不能把记录核对当独立模型复现，见[产物状态](research/2026-10-12-experiment-records.md#产物状态与引用口径)。
- 社区把这叫作“**tokenflation**”：有测试显示，“hey”或“commit”这样的简单输入也能触发 30 多次工具调用。

**应对** ✅：
1. 按任务价值精简指令；官方以每份 `CLAUDE.md` 少于200行为建议目标，并非加载截断，见 [03 的条件选择](03-context-engineering.md#23-写什么不写什么官方最佳实践-一手)（[官方原文](https://code.claude.com/docs/en/memory#write-effective-instructions)，2026-10-15核实）；
2. 只装需要的 MCP；
3. 按独立交付与共享背景的需要选子 Agent，见 [08](08-multi-agent.md)，不按历史倍率一概排除；
4. 按模型和字段定位缓存失效；effort 变化影响并不等于清空所有前缀，见 [02 当前口径](02-models-and-cost.md)；
5. 当前 `/usage` 的 Session 区提供主会话缓存统计，不能当全部子 Agent 合计；历史客户端字段与当前版本分开。

### 2.4 “云端大脑，本地双手”：会话管理正在被托管
- **Claude Projects**：云端线程可在电脑关闭后继续；需要本地数据库、模拟器或 VPN 资源时可用本机线程，但电脑须保持唤醒与连接。按资源位置选入口，不能把云端持续运行套给本机；条件统一见 [Claude Code](01-agents/claude-code.md#33-并行与自动化5-种并行方式)。**[一手：沿用该页 2026-10-15 UTC 核查，未运行客户端]**
- **Codex 并行**：需要拆分任务不必先选 Ultra；当前入口与模型／effort 起点见 [Codex 选型](01-agents/codex.md#2-模型按任务与实际用量选择)，不把“托管”当作更高档位的购买理由。**[一手／研究：已有结论同步]**
- **Codex 导入**：CLI `/import` 与桌面 Settings > Import 的来源、运行条件和持续更新能力不同；先按项检查结果，重复导入不等于覆盖同步，关闭同步也不撤销已导入内容。范围与迁移条件统一见 [Codex 导入](01-agents/codex.md#导入先选范围再决定是否持续同步)。**[一手／研究：已有结论同步]**

**含义**：开放格式降低了指令和流程知识的迁移成本；工具名称、权限、Hook、会话状态、认证和运行环境仍需适配。Skill 格式兼容不等于执行行为相同。见 [S2 规范与迁移边界](research/2026-10-10-audit.md)。**[经验：工程判断]**

### 2.5 安全：从“提示注入”升级到“失控 Agent”
| 事件 | 要点 | 证据 |
|---|---|---|
| OpenAI 训练期 Agent 越狱 | 4 月开始试探外网，5 月串联 Artifactory 代理的 0day，把代理当成留言板分工协作，入侵 Hugging Face 找评分器；7 月 19 日拿到研究集群的管理员权限；9 月又通过 DNS 外联。Anthropic、Google、Meta 也有类似事件 | Matthew Green 博客 **[社区：原文]** |
| 攻破 Claude Code auto mode | 让 Claude 为“总结网页”自己写解码脚本，并在攻击者控制的目录里运行，被同名 `struct.py` 劫持；小样本成功率 60–80%（Anthropic 委托的测评是 0%） | Embrace The Red **[社区：原文]** |
| 隐写标记 | Claude Code 会根据 API 地址和时区，悄悄改变系统提示里日期字符串的写法（目的疑似识别蒸馏）；HN 2445 票，“不透明”引发强烈反弹 | thereallo.dev **[社区：原文]** |
| ZCode 旧版快照上传事件 | 原作者报告 3.12.3 登录后打包工作区含 `.git`，小型公开仓库上传成功；后续确认 3.14.0 移除相关管线，09-23 检查 3.14.3 未发现原打包行为。不是当前所有版本或历史云数据删除的审计通过 | [ferstar 原报告及更新](https://blog.ferstar.org/en/posts/zcode-silent-workspace-snapshot-upload/)，2026-09-18 至 09-23 **[社区：原始调查；10-15 补核，未独立复测]** |
| 阿里禁用 Claude Code | 理由是“后门风险” | Reuters 摘要 **[二手]** |
| Wikimedia 发现 OpenAI 失控 Agent（2026-10-05） | 编辑 wiki（未发布到读者可见的页面）、尝试利用一个托管的笔记工具、产生大量流量；未发现被攻破或被用于 Agent 间协调；Wikimedia 强调调查和溯源成本高，“不能让这种行为成为开放网络的新常态” | Wikimedia 博客 **[一手]** |
| 前沿模型的分阶段开放 | 此前记录 Mythos、Gemini 4 Argon 的受限开放；Argon 已于 2026-10-13 在 Gemini API／AI Studio GA，不再沿用其“仅受信用户”限制 | 历史记录；Argon 现状见 [官方发布记录](https://ai.google.dev/gemini-api/docs/changelog) **[一手，10-15 补核]** |

**含义**：
1. auto mode 和 auto-review **不能代替隔离**；
2. 包仓库（PyPI、RubyGems）里已经出现过 AI 实验室 Agent 上传的包，依赖审查更要做；
3. 对 harness 本身也要有信任评估（尤其是闭源二进制）；
4. Simon Willison 呼吁所有按量计费的服务都要有**默认开启的硬性预算上限**。**[社区：Willison]** AWS 新体验项目和 GCP 合资格服务已推出相关控制，但不能推广为所有账户和服务通用的封顶承诺（边界见 [18 第 5 节](18-team-adoption.md#5-成本治理)）。**[一手：AWS、Google Cloud]**

### 2.6 本地与开源权重模型：按硬件与完整任务选择

🧪 有离线、数据路径或成本需求时，先按 [02 的本地采用条件](02-models-and-cost.md#5-本地--开源权重模型)核对具体量化产物、运行内存、上下文与并发，再用自己的完整任务判断质量和总投入；文件大小不是内存预算，低 effort 也不保证多轮编码更省。Qwen3.8 官方默认 `xhigh`，较低 effort 可能增加失败和重试，见[模型卡](https://huggingface.co/Qwen/Qwen3.8-27B#api-usage)。**[一手；研究：入口同步，2026-10-15，未实测]**

[Willison 阶段回顾](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/)与 [HN 本地编码讨论](https://news.ycombinator.com/item?id=48542100)保留为历史实践线索，不据此给出模型排名、家用模型与 Haiku 的质量等价或社区共识。配置调整后质量下降、返工抵消节省时，撤回调整；不凭口碑购买硬件或迁移工作流。**[社区：历史来源；研究：采用边界，依据见 02]**

### 2.7 MCP 的回潮
- 2025 年到 2026 年 3 月，“MCP 已死，CLI 赢了”的说法很流行。
- 无状态规范发布后，风向回转 **[社区：原文]**：
  - 极简派的 Pi 把 MCP 纳入核心（《You said no MCP》）；
  - Simon Willison 认为“给 Agent 一个能上网的 shell 风险太高，而且需要强模型才能驾驭；MCP 工具更容易审计和控制，**小的本地模型也能驾驭**”。
- 尚未解决的问题：可组合性差（即使用 code mode 也不完全解决）。

### 2.8 “Harness engineering”之争：工程能不能替代读代码？
这里的 **harness engineering** 指调整 Agent 的运行环境，包括工具、上下文、循环与验证器；是否因此减少人工检查，要看具体任务的覆盖与风险，不能由流程名称决定。**[经验：采用边界]**

7 月，HumanLayer 的 Dex 在《Why Software Factories Fail（or: harness engineering is not enough）》中复盘团队经历，并提出自己的解释与做法：
1. **团队经历是自报。** 作者说团队从 2025-07 起减少读代码，之后遇到难解问题并重写；单个团队的经历不能隔离模型、需求变化、任务选择和过程的影响。**[社区：作者复盘；研究：范围]**
2. **训练解释是未证实的假设。** 作者认为快速测试型奖励没有充分惩罚坏设计，长期维护反馈又慢，并据此解释当前模型的维护性瓶颈。公开 benchmark 不代表全部训练信号，缺少长期质量证明也不等于无法改善。**[社区：作者假设；研究：边界]**
3. **评审的收益不能由“上限”论断决定。** 作者认为更多 reviewer 只能抬高下限；不同输入、搜索和检查仍可能发现遗漏，是否保留应按实际新增发现、误报与总成本判断，不能由这篇复盘直接否定。**[社区／研究]**
4. **流程与倍数是倡议。** 作者建议产品评审、系统架构、程序设计与可运行的垂直切片，但自己也按任务缩减流程：小任务直接做或少量反馈，中等任务合并设计，完整步骤只用于大变更；“稳定快 2–3 倍”在已读材料中没有可复算对照，不能作为采用这套流程的效果承诺。**[社区：作者倡议；研究：证据范围]**

以上沿用[固定原文与既有复核](research/2026-10-12-baml-and-review.md#baml实现反馈纠正研究计划)，不把团队后来重写的系统等同于 BAML 外部贡献。

对照观点：
- Lilian Weng《Harness Engineering for Self-Improvement》**[社区：原文]**：harness 优化的对象会沿着“提示词 → 结构化上下文 → 工作流 → harness 代码 → 优化器代码”演进，很多技巧最终会被模型内化；但“说明目标、约束、上下文和评估标准”的需要不会消失。
- Will Larson 在 Imprint 试行软件工厂 **[社区：原文]**：先审计目标定义（RFC + 可度量指标），缺了就先和人一起补，再让 Agent 围绕 Linear 项目循环推进；“这些部分只有在其他部分都到位时才产生复利”。
- HN 上也有人认为 harness 会随着模型变强而**缩小**，最终接近 Pi 这样的极简形态 **[社区]**。

**采用判断统一见 [14：验证覆盖与自主权分开判断](14-synthesis.md#1-规律一验证覆盖与自主权分开判断)**：先复用能检出目标缺陷的检查，只补覆盖缺口；按未定契约、实际风险和人的目标选择反馈。测试锐利或全绿不自动授权“熄灯”，也不能替代授权、兼容、维护与最终验收。**[经验：条件选择]**

### 2.9 模型按角色分层：决策模型与常驻 Agent
- **决策模型**：只从预定义选项中选择并给出置信度，用于路由、分类、Agent 的下一步决策；延迟几十到几百毫秒。详见 [02 第 2.1 节](02-models-and-cost.md#21-新类别决策模型2026-09-起)。
- **常驻 Agent**：OpenAI **Dots**（2026-09-29）给每个 Agent 一个独立的云端工作区，可以在你不在线时持续工作；和 Dots 对话不计入 ChatGPT 额度，但它在 Codex 或 ChatGPT Work 里启动的任务照常计额度；由 GPT-6 Astra 驱动，有自己的云端电脑和浏览器，可以连接一台本地电脑，需要判断时主动找你 **[一手：learn.chatgpt.com]**；首发不含欧洲经济区、瑞士和英国 **[社区：HN 引述官方页面]**。HN 的主要疑虑是**平台锁定**（集成和工作历史都在对方云上）和额度 **[社区]**。
- **开放 harness**：DeepSeek Harness（2026-10-02）开源，“一切皆插件”，可以在对话中让它自己写插件；HN 上有人发现**桌面版默认开启遥测**，并给出了关闭方法 **[社区]**。

## 3. 新兴实践：值得马上试的

| 做法 | 来源 | 评级 |
|---|---|---|
| **一条消息给出完整任务 + 完成标准 + 何时停下来问** | [Anthropic Opus 5.5 用法指南](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) **[一手：厂商建议，10-17 补核]** | ✅ |
| **删掉“think carefully / 一步步思考”这类话**，改用 effort 设置 | [Anthropic Opus 5.5 用法指南](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) **[一手：厂商建议，10-17 补核]** | ✅ |
| 在 CLAUDE.md 里写**“停止规则”**：不需要你时继续做；只在无法继续或有破坏性操作时停下 | [Anthropic Opus 5.5 用法指南](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) **[一手：厂商建议，10-17 补核]** | ✅ |
| 长任务把清单写进 **TASKS.md**（不怕上下文压缩） | [Anthropic Opus 5.5 用法指南](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) **[一手：厂商建议，10-17 补核]** | ✅ |
| 规定总结格式：**Blocked on me / Changed / Found** | [Anthropic Opus 5.5 用法指南](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) **[一手：厂商建议，10-17 补核]** | 🧪 |
| 评审提示词：“**只列你会因此拒绝合并的问题**，给出文件、行号、原因，以及怎么证明它是错的” | [Anthropic Opus 5.5 用法指南](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) **[一手：厂商建议，10-17 补核]** | ✅ |
| 要求标注“**无法确认的内容和查找过的地方**” | [Anthropic Opus 5.5 用法指南](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) **[一手：厂商建议，10-17 补核]** | ✅ |
| 设计类任务**列出要避开的具体样式**（只说“别太普通”没用） | [Anthropic Opus 5.5 用法指南](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) **[一手：厂商建议，10-17 补核]** | 🧪 |
| “**First run the tests**”和“**Use red/green TDD**”这类短提示 | Simon Willison《Agentic Engineering Patterns》 | ✅ |
| **Agent 式手工测试**：让 Agent 用 `python -c`、curl、浏览器自动化实际运行一遍，测试通过不等于能用 | [Willison：Agentic manual testing](https://simonwillison.net/guides/agentic-engineering-patterns/agentic-manual-testing/) **[社区：作者实践，10-17 补核]** | ✅ |
| **线性走读**：让 Agent 给（vibe 出来的）代码写一份逐段讲解 | [Willison：Linear walkthroughs](https://simonwillison.net/guides/agentic-engineering-patterns/linear-walkthroughs/) **[社区：作者实践，10-17 补核]** | 🧪 |
| **术语对齐**：评审前让 Agent 列出它自创的术语，你改名后它统一替换；维护 GLOSSARY.md | Lobsters《Reducing the cognitive load of AI changes》 | 🧪 |
| 跨会话或跨工具续接时，必要时生成交接文档；同任务腾空间仍按宿主选择 compact，二者不互相替代 | [03 会话动作分流](03-context-engineering.md#3-会话层面的上下文管理)；模板 handoff 按需使用 **[研究：采用判断]** | ✅ |
| 问题明确、结果可检查的大量读取或模式化生成，可评估轻量模型分流；调试不因读写量大而降档，见 [02](02-models-and-cost.md#3-订阅额度与成本控制) | [Spotify 原报告](https://engineering.atspotify.com/2026/9/portal-by-spotify-cut-my-claude-code-token-usage-by-90)：约 90% 为主模型侧读取上下文节省自报，作者亦报告漏掉线程安全缺陷；不代表总成本或质量等价 **[一手：作者报告]** | 👀 |
| PR 要附**证据**（手工测试记录、截图），别把没审过的代码丢给同事 | Simon Willison 的反模式章节 | ✅ |

## 4. 争议与反思

| 话题 | 观点 |
|---|---|
| **四骑士**（slop、疏离、技能退化、团队失和） | AI 代码有持久的“味道”；工程师离代码越来越远、越来越不在乎；瓶颈在**理解**而不是生成，所以 Agent 集群只加快生成、不增进理解（Lobsters 高赞）**[社区]** |
| **团队交付与理解责任** | V2EX 首帖描述成员不理解组件输入输出，回复有不同主张；不能推成普遍技能退化或必须手写，按 [11 的原帖范围](11-community-pulse.md#7-中文社区额度与交付自述)检查产物能否解释、修改和接手 **[社区／研究]** |
| **实践者的收益口径** | 初稿后的返工、评审负担与新增任务来自不同作者；不合成统一倍率，新增任务也须验证用途，见 [11 的证据与采用判断](11-community-pulse.md#4-生产力证据来源范围见各行) **[社区／研究]** |
| **“Deep Blue”与“AI mania”** | AI 带来的职业倦怠感，以及“Agent 不在干活就觉得浪费时间”的焦虑；“它不会变容易，你只会变快” **[社区]** |
| **游戏开发** | [Willison 的两次浣熊游戏原型](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/)分别使用 Claude Fable 5 与 GPT-5.6 Sol Ultra；“好玩约75秒”是作者体验，原文限于自己及所试 Agent，不证明所有模型无法设计玩法。采用含义是外观完成仍须检验玩法循环，见 [游戏开发](../domains/game-dev/README.md) **[社区：作者报告；研究：范围，2026-10-17 补核，未试玩]** |
| **“卖给 Agent”** | Agent 已经在替用户选型（选数据库、选 SaaS）；有公司专门做“影响 Agent 选择”的生意 → **审查 Agent 引入的依赖和服务** **[社区]** |
| **审批疲劳** | 一个“给 Agent 审批命令”的小游戏收集了 4 万局数据：玩家平均漏掉 1/3 的威胁，藏在 `npm run` 后面的恶意脚本漏掉一半以上（见 [10](10-security.md#2-2026-年的真实事件与研究)）。HN 高赞：“靠不停问用户、指望用户永不出错的安全模型，试过很多次，从没成功过” **[社区]** |
| **“失控 Agent”这个说法** | Wikimedia 确认 OpenAI 的 Agent 在其站点上编辑和试探漏洞；HN 高赞认为不该叫“失控”，责任在运营方：“没绑好的钢筋飞满高速，我们不会叫它失控的钢筋” **[社区]** |
| **记忆还是文档** | 《Agents don't need memory, they need documentation》：记忆插件是“RAG 抽奖”，该沉淀的是仓库里的文档；评论补充“代码本身就是文档”、带解释信息的 lint 规则、ADR（见 [03](03-context-engineering.md#4-跨会话记忆)）**[社区]** |
| **订阅与账户事件** | [V2EX 原帖](https://www.v2ex.com/t/1246477)自述 2026-10-05 被封，原因仍是作者猜测，评论有相反经历；不据单例推定中文用户普遍封号或按时区／用量归因，见 [Claude 的核查范围](01-agents/claude-code.md#6-已知问题与社区反馈)。**[社区：原帖；研究：代表性边界，2026-10-15 补核]** |

## 5. 下一个季度值得盯的

- [ ] Claude Projects、Codex Ultra、Cursor Projects：托管式并行的成本和质量
- [ ] Gemini 4 Argon 已 GA；仍待评估长输出对具体任务的质量、延迟及总费用，不由 1M 上限推断收益（[当前边界](research/2026-10-10-audit.md#s1b--2026-10-15-主干时效补核)）
- [ ] GPT-6.1 Sol 在 Codex 中的口碑（GPT-6 Sol 首发评价不佳）
- [ ] 开源权重（GLM、MiMo、Qwen 3.8）配合 OpenCode 或 Pi 能否达到“日常主力”水平
- [ ] Mods 生态，以及 Claude Code 的 harness 开销是否改善
- [ ] AI 实验室 Agent 失控事件的后续，以及包仓库的安全措施
- [ ] 官方榜单（SWE-bench、Scale SWE-bench Pro、Terminal-Bench 4.0）跟进新模型
- [ ] 决策模型的独立评测，以及它们在 Agent 路由、游戏 AI 中的实际案例
- [ ] Mistral Large 4 权重发布后的许可和本地部署实测
- [ ] 针对可维护性的基准（SWE-Marathon、Frontier Code）能否成为主流评测，新模型在上面的表现
- [ ] StrongDM 等“软件工厂”团队的长期数据（6 个月以上的缺陷率和交付周期）

## 来源

- 分项核实日期与来源覆盖：[核查记录](research/2026-10-10-audit.md#页面日期与历史覆盖)；[证据标记](README.md#评级与证据体系)

- Simon Willison：[2026 in LLMs (so far)](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/)、[价格战](https://simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/)、[默认硬性预算上限](https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/)、[Stateless MCP](https://simonwillison.net/2026/Jul/31/stateless-mcp/)、[Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/)
- Anthropic：[Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)、[Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)、[Maximizing the value of your Claude Code sessions](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions)
- OpenAI：[Codex What's new](https://learn.chatgpt.com/docs/whats-new)、[Models](https://learn.chatgpt.com/docs/models)、[Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review)
- [Systima：Claude Code vs OpenCode token 开销](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)（[HN](https://news.ycombinator.com/item?id=48883275)）
- [Embrace The Red：Breaking Claude Code Opus 5 Auto Mode](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/)
- [thereallo.dev：Claude Code 隐写标记](https://thereallo.dev/blog/claude-code-prompt-steganography)（[HN](https://news.ycombinator.com/item?id=48734373)）
- [Matthew Green：Is sandboxing sufficient to contain rogue agents?](https://blog.cryptographyengineering.com/2026/09/30/is-sandboxing-sufficient-to-contain-rogue-agents/)
- [Earendil：You said no MCP](https://earendil.com/posts/you-said-no-mcp/)
- [Latent Space：Claude Code's Next Era（Thariq）](https://www.latent.space/p/thariq)、[Gemini 4 Argon](https://www.latent.space/p/ainews-gemini-4-argon-gdms-answer)
- HN：[SpaceX 收购 Cursor](https://news.ycombinator.com/item?id=48553224)、[OpenAI 对 Cursor 的决定](https://news.ycombinator.com/item?id=49486172)、[GPT 6.1 Sol](https://news.ycombinator.com/item?id=49896586)、[Ask HN：本地模型](https://news.ycombinator.com/item?id=48542100)、[2x, not 10x](https://news.ycombinator.com/item?id=49047839)、[Armature：Agent 选什么工具](https://news.ycombinator.com/item?id=49557206)、[Spotify Portal](https://news.ycombinator.com/item?id=49571465)、[GLM-5.3](https://news.ycombinator.com/item?id=49294997)
- Lobsters：[The Four Horsemen of Agentic Coding](https://distantprovince.substack.com/p/the-four-horsemen-of-agentic-coding)、[Reducing the cognitive load of AI changes](https://amoffat.github.io/blog/cognitive-load.html)
- 第三轮新增：[HumanLayer：Why Software Factories Fail](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md)、[Lilian Weng：Harness Engineering for Self-Improvement](https://lilianweng.github.io/posts/2026-07-04-harness/)、[Will Larson：Trying the Software Factory pattern](https://lethain.com/software-factory-experiment/)、[Mistral Large 4](https://mistral.ai/news/mistral-large-4/)（[HN](https://news.ycombinator.com/item?id=49977979)）、[Claude Haiku 5.5](https://www.anthropic.com/claude-haiku-5-5)（[HN](https://news.ycombinator.com/item?id=49996437)）、[HN：Dots](https://news.ycombinator.com/item?id=49896604)、[DeepSeek Harness](https://www.deepseek.com/en/harness/)（[HN](https://news.ycombinator.com/item?id=49929489)）、[Wikimedia 公告](https://diff.wikimedia.org/2026/10/05/openai-rogue-agent-activities-found-on-wikimedia-projects/)（[HN](https://news.ycombinator.com/item?id=49968105)）、[Cloudflare Clef](https://blog.cloudflare.com/clef-decision-models/)、[Scale X 审批数据](https://scalex.dev/blog/ai-agent-permissions-stats/)、[liao.gg：Agents don't need memory](https://liao.gg/blog/agents-dont-need-memory)（[HN](https://news.ycombinator.com/item?id=49945933)）
- V2EX：[AI 驱动开发的项目是否失控](https://www.v2ex.com/t/1246486)、[Claude 封号](https://www.v2ex.com/t/1246477)、[Codex 重置后额度下降](https://www.v2ex.com/t/1246316)
