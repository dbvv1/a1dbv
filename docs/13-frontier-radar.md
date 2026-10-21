# 13 · 前沿雷达（2026-10）

> 编辑更新：2026-10-21（UTC+8）；三项产物质量机会保留，保留 Claude 2.1.305 配置升级边界，并补能力／纠偏分层选择；历史条目不整体重核

<a id="本轮精选哪些变化会影响实际工作2026-10-15-补核"></a>
## 30 秒选择：这些变化值得你改什么？

**✅ 已有产物能跑，默认保现有入口与工具，先选要改善的质量，不急着换模型或harness。** 没有可靠起点，先到[02任务分档](02-models-and-cost.md#1-原则按任务分档而不是追榜单)；已有基线，选下表的一项小改动并保旧行为。配置是否失效另见下一表。[研究：采用入口]

| 你要改善什么 | 先改变哪一步 | 比较依据、代价与唯一主专题 |
|---|---|---|
| 功能满足，实际等待／运行负担仍大 | 🧪 让Agent从已有测量挑一项负担，复用工具做小修；人核同任务收益是否抵得维护复杂度，没有收益就保旧方案 | OpenAI十月维护案例有产物前后结果，此处不据它隔离模型贡献；测量与人工复核有成本。主建议：[15§7](15-task-playbooks.md#7-性能优化) |
| 界面能跑，但设计普通或关键交互不好用 | 🧪 先给具体质量参照，原生改一轮；人选方向、核实际操作，行为证据缺口才加独立检查，退步则留较好旧版 | 九月frontend-design固定配方与历史质量实验支持先补输入；整套循环的当前同预算优势未知。主建议：[07](07-workflows.md#已有界面能跑但还不像可交付的产品) |
| 功能检查已过，但贡献要求仍被遗漏 | 🧪 先核目标版本、本次适用条件是否到达Agent，沿用原生阅读和既有检查；人确认义务，不用泛化审稿层或近似分数代替接收 | SWE-CC信息条件对照改善合规指标，功能／成本收益未证；短条件是试用建议，不是实测赢家。主建议：[18](18-team-adoption.md#pr-准入与协作约定) |

**2026-10-21来源校准：** [Claude Code团队10-15评审复盘](https://claude.dev/blog/solving-code-review-at-anthropic/)补出循环不收敛时的差量重审与收窄依据，采用建议归[09](09-review-and-quality.md#按风险选择评审层不默认逐层叠加)；来源名册与条件记录归[25](25-ai-exploration.md#第二步按问题检索渠道分工)，不增设整套流程。[一手；研究]

**新增工具或Hook前先分层。** 近期接口对照与Ramp采用／撤回支持先选动作和权限，再选接入；推理提醒应能收敛，授权闸门不能因次数耗尽放行。具体默认与原文统一归[04](04-mcp.md)、[06](06-hooks-and-guardrails.md)和[10](10-security.md)，不据新论文重排模型。[研究：2026-10-21同题比较]

**UI修复先验发生错误的阶段。** 对首屏闪错内容，让Agent复现脚本执行前、数据返回前及错误恢复，而不是只等最终页面正常；同SHA部署成功不能覆盖测试失败。具体选择与近期闭环自报、公开失败回执归[17](17-troubleshooting.md)和[23](23-browser-verification.md)。[研究：2026-10-21资料比较，完整公开成功链待证]

**嵌入产品不等于重写Agent循环。** Spotify采用现成编码SDK仍保留维护调度，Shopify River强调当前版本、接管与真实关闭；先复用循环，再补产品确需的控制责任。与任务硬编码撤回、迁移范围收窄的同题取舍见[16](16-building-agents.md)与[21](21-agent-patterns.md)。[研究：2026-10-21资料比较，非同预算效果结论]

**团队试用、产品接收和放宽人审不是同一阶段梯。** 近期团队分别采用受限共享平台、工程师接收和窄任务放行；先定用途、接收者与维护责任，再决定扩量。采用条件、持续投入及效果尚早的反例见[11](11-community-pulse.md)和[18](18-team-adoption.md)。[研究：2026-10-21资料比较]

**退出整套流程，也保留回归交付。** 固定模型的小任务对照区分了修对代码、补回归和询问过程；原生起步不是取消测试，无人值守也不能把询问得分当可运行产物。整包、原生与未测窄补充的采用边界统一见[24](24-community-workflows.md)。[研究：2026-10-21资料比较，不推广为长期效果]

**运行逻辑升级，不只验旧记录读得出。** 兼容续接要核首次新写后的冷读与下一轮，原生修复发布后还要确认旧补丁没有遮蔽它。旧版排空、兼容续接和短工作段的选择见[20](20-codex-long-horizon.md)，不由框架案例推定托管Codex的升级契约。[研究：2026-10-21资料比较]

**整轮委派，不授权自动改接受标准。** 同一SDK升级的自动候选与接管版本、下一版本自动修复链，支持把争议集中到权限／验收语义，解决后恢复自主推进。采用与撤回见[00](00-state-of-ai-coding.md#整轮自主实现在哪一步接管)。[研究：2026-10-21公开产物比较]

### 当前最高水平与本轮取舍

**前沿比较：已比较（三项质量机会的资料范围）／差距2；当前最优仍未知。** 复用[C11](collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#c11--前沿雷达)，补近期产物结果、固定实现和同问题条件对照；原生及现成工具是可行起点，不据热度称主流最佳。作者、日期、来源、成本和反例见[P45记录](research/2026-10-12-baml-and-review.md#p45功能能跑以后先改善哪种质量)。三项都没有当前强模型跨任务净收益保证。[研究]

### 已有配置何时需要复核


| 你的问题 | 现在怎么选 | 主要依据与局限 |
|---|---|---|
| 配置没改，是否可以继续信任旧基线？ | ✅ 先核客户端／运行后端、实际模型、effort 与工具／历史回传契约，保留已验证的有效配置；已知退役／路由或后台版本变化后，重跑代表任务 | [02](02-models-and-cost.md#1-原则按任务分档而不是追榜单)记录 DeepSeek／Gemini 的具体路由与兼容契约；[Codex](01-agents/codex.md#慢保守和反复停下来先辨认是哪一种问题)区分安装包与运行端，不泛化所有别名 **[一手／研究]** |
| Claude 升级后网关失败，或托管 MCP 集合变了？ | ✅ 网关拒绝 tool search 先核包含2.1.305修复；`managed-mcp.json` 中仅 `env` 含变量的 stdio 服务升级后可能不再受白名单过滤，禁用须明确拒绝 | 2.1.305发布于10-21（UTC+8）；[Claude网关建议](01-agents/claude-code.md#6-已知问题与社区反馈)与[管理边界](01-agents/claude-code.md#34-评审与安全)为主专题，[固定来源与文档差异](research/2026-10-10-audit.md#s1g--2026-10-21-claude-21305-升级边界)；未运行客户端，不泛化全部托管服务 **[一手／研究]** |
| 任务没完，纠偏、重启还是新开？ | ✅ 目标纠偏先 steer；须停止动作再中断；后台配置问题才考虑重启。Claude 休眠恢复警告出现时，比恢复费用与新开返工 | [Codex](01-agents/codex.md#慢保守和反复停下来先辨认是哪一种问题)与[Claude](01-agents/claude-code.md#33-并行与自动化5-种并行方式)：新会话不等于新进程，中断不回滚；没有端到端净省实测 **[一手／社区／研究]** |
| 新模型或新 harness 值得换吗？ | 👀 Muse 先核地域、数据设置及普通／Full入口，再比任务收益；原生已够用不因榜单迁移 | [02资格边界](02-models-and-cost.md#1-原则按任务分档而不是追榜单)：大陆／港／澳限制与订阅默认数据用途是采用门槛，不是功能排名。相反迁移与缺失人工成本不支持统一换 harness **[一手／社区／研究]** |

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

<a id="23-harness-的隐性成本被量化了"></a>
### 2.3 Harness 成本：版本、完成与返工必须一起看

✅ 先定位实际执行端与任务缺口，再决定缩减配置或换 harness。10 月有两个公开仓库为保持 pin 而关闭 Codex daemon 自动启动，但固定官方源码已经提供关闭 updater／固定后端包的另一条路径；不是只能卸载客户端。配置提交证明采取了动作，不证明旧进程已退出或长任务验收通过。**[一手：源码；社区：采用，2026-10-20，见[连续性研究](research/2026-10-10-codex-continuity.md#有效配置与续接动作2026-10-20)]**

旧 Systima 输入量倍率不作为当前费用排名；本轮原作者对照又分别受旧模型、短题、失败样本排除或不同 harness 影响。论文中的模拟用户也不替真人维护。只比较推理费、首轮耗时或测试数，容易漏掉规格、恢复、核查和用户反馈。具体边界见[本轮反例](research/2026-10-10-codex-continuity.md#有效配置与续接动作2026-10-20)；工具负担与缓存治理回到 [02](02-models-and-cost.md)／[03](03-context-engineering.md)，不在雷达再维护一套建议。**[社区／研究：未复测]**

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

7 月 HumanLayer 的 Dex 在《Why Software Factories Fail》中自报：团队从 2025-07 起减少读代码，后来遇到难解问题并重写。单例不能隔离模型、需求、任务选择和过程的影响；也不能把后来重写的系统等同于 BAML 外部贡献。其训练解释仍是假设，公开 benchmark 不代表全部训练信号，缺少长期质量证明不等于无法改善。**[社区：作者复盘／假设；研究：范围]**

作者认为更多 reviewer 只能抬高下限；采用时仍按新增发现、误报与总成本判断，不据此否定评审。产品评审、系统架构、程序设计与垂直切片是倡议，作者也按任务缩减：小任务直接做或少量反馈，中等任务合并设计，大变更才用完整步骤；“稳定快 2–3 倍”没有可复算对照，不作效果承诺。论证与原文见[固定原文与既有复核](research/2026-10-12-baml-and-review.md#baml实现反馈纠正研究计划)。**[社区：作者倡议；研究：证据范围]**

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

下表前八项均据 [Anthropic Opus 5.5 用法指南](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)，**[一手：厂商建议，10-17 补核]**。

| 做法 | 来源 | 评级 |
|---|---|---|
| **一条消息给出完整任务 + 完成标准 + 何时停下来问** | 同上指南 | ✅ |
| **删掉“think carefully / 一步步思考”这类话**，改用 effort 设置 | 同上指南 | ✅ |
| 在 CLAUDE.md 里写**“停止规则”**：不需要你时继续做；只在无法继续或有破坏性操作时停下 | 同上指南 | ✅ |
| 长任务把清单写进 **TASKS.md**（不怕上下文压缩） | 同上指南 | ✅ |
| 规定总结格式：**Blocked on me / Changed / Found** | 同上指南 | 🧪 |
| 评审提示词：“**只列你会因此拒绝合并的问题**，给出文件、行号、原因，以及怎么证明它是错的” | 同上指南 | ✅ |
| 要求标注“**无法确认的内容和查找过的地方**” | 同上指南 | ✅ |
| 设计类任务**列出要避开的具体样式**（只说“别太普通”没用） | 同上指南 | 🧪 |
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
