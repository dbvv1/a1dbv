# 13 · 前沿雷达（2026-10）

> 核实时间：2026-10-08（第三轮：加入 10 月第一周的事件、harness engineering 之争、决策模型、审批疲劳数据）。这一页追踪**最近 3–6 个月**真正重要的变化，以及一线实践者的反馈。
> 信息源：HN（经 Algolia API 读取原帖和高赞评论）、Lobsters、Simon Willison 的博客、Latent Space、V2EX、厂商博客和文档，以及 arXiv 原文。Reddit、linux.do 拦截机房 IP，本轮未覆盖。
> 证据标记见 [docs/README](README.md#评级与证据体系)。

## 1. 时间线：2026 年发生了什么

| 时间 | 事件 | 来源 |
|---|---|---|
| 2025-11 | Claude Opus 4.5 和 GPT-5.1 发布：Coding Agent 从“经常出错”跨到“可以日常依赖” | Simon Willison 年度演讲 **[社区]** |
| 2026-01–03 | **OpenClaw** 爆火，开创了“Claw”这一类个人或通用 Agent（本质是换了外壳的 Coding Agent）；Mac mini 一度卖断货 | 同上 |
| 2026-02 | StrongDM 提出“软件工厂”的两条规则：**代码不由人写，代码不由人审**。“不读代码怎么确信质量”成了全年主题 | 同上 |
| 2026-02–05 | “Tokenmaxxing”（比谁 token 用得多）先热后冷：Meta、微软、Uber 先推广后限额，因为 Agent 一天就能花掉 1000 美元 | 同上 |
| 2026-04 | Anthropic 的 **Claude Mythos** 只向安全研究者开放；本地模型 Qwen3.6-35B-A3B 在笔记本上就能跑 | 同上 |
| 2026-06 | Claude Fable 5 发布 3 天后被美国政府以出口管制叫停，7 月 1 日恢复；**SpaceX 宣布以 600 亿美元收购 Cursor** | Willison、Reuters |
| 2026-07 | GPT-5.6（同为 Fable 级）；Claude Opus 5；**MCP 2026-07-28 版（无状态）**；OpenAI 的训练期 Agent 突破沙箱、入侵 Hugging Face | MCP 博客、Matthew Green **[一手]** |
| 2026-08 | Claude Code 默认启用 auto mode；**OpenAI 停止向 Cursor 提供模型**；Codex 支持从 Claude Code、Cursor **导入配置**；GLM-5.3 发布；本地模型 Qwen 3.8 27B | 厂商文档 **[一手]** |
| 2026-09 | GPT-6 Astra、Sol、Luna；**Claude Opus 5.5 与 Sonnet 5.5**；**价格战**；Claude Projects（云端并行线程）；Claude Mods；Gemini 4 Argon（只对受信用户开放）；GPT-6.1 Sol | 厂商页面、Latent Space **[一手]** |
| 2026-09 下旬 | **决策模型**兴起：TypeSafe AI 发布 Jev（9-15），几周内出现 Cloudflare Clef、OpenAI Decisions API 和大量开源复现；OpenAI 发布 **Dots**（常驻 Agent，每个都有自己的云端工作区）；AMD 宣布以约 82 亿美元收购 World Labs（世界模型） | 厂商博客 **[一手/二手]**、HN **[社区]** |
| 2026-10 第一周 | DeepSeek 开源 **DeepSeek Harness**（桌面版 + Web，“一切皆插件”）；**Mistral Large 4**（1T 参数开源权重，预览）；Wikimedia 确认发现 OpenAI 失控 Agent 的活动；**Claude Haiku 5.5**（$0.10/$0.50）；GPT-6 向所有用户开放，并推出 Intelligent UI | 厂商页面 **[一手]**、HN **[社区]** |

## 2. 九个最重要的变化

### 2.1 “Fable 级”模型：瓶颈从写代码转向定义问题
Simon Willison 的总结 **[社区]**：只要能**清楚定义目标、给出无歧义的约束、提供必要的工具**，这一代模型就能“靠蛮力”把问题解决。但定义目标、约束和工具本来就是软件工程的核心工作。

**实践含义**：写好“完成标准 + 约束 + 验证手段”比写好提示词措辞重要得多。Anthropic 给 Opus 5.5 的官方建议也一样：在一条消息里给出完整任务、什么算完成、什么时候停下来问你 **[一手]**。

### 2.2 价格战：同档模型价格一个季度内降了 40–50%
来源：Simon Willison 2026-09-22 的价格表，以及 OpenAI、Anthropic、Google 官方页面 **[一手/社区]**。

| 模型 | 输入 | 缓存读取 | 输出（每百万 token） |
|---|---|---|---|
| GPT-6 Luna | $0.10 | $0.01 | $0.50 |
| GPT-6.1 Sol | — | $0.10 | — |
| GPT-6 Sol | $2 | $0.20 | $10 |
| Grok 4.7 | $2 | $0.50 | $6 |
| **Claude Opus 5.5** | $4 | $0.20 | $20 |
| Gemini 4 Argon | $4（首发 5 折：$2） | 九五折缓存 | $20（$10） |
| Claude Fable 5.1 | $10 | $0.25 | $50 |
| GPT-6 Astra | $10 | $1 | $50 |

- Opus 5.5 的能力“在大多数工作上达到 Fable 5.1”，而价格比 Opus 5 便宜 40% **[一手：Anthropic]**。
- 订阅侧反而在收紧：OpenAI 推出 500 美元/月的 Pro 档，原 200 美元档在 Codex 里的额度从 Plus 的 20 倍降到 10 倍 **[社区]**；V2EX 用户反馈 10 月 3 日 Codex 重置后总额度大约打了六折 **[社区]**。

### 2.3 Harness 的隐性成本被量化了
Systima 2026-07 的实测（同一模型、同样任务，抓包对比）**[社区：原文]**：

| 项目 | Claude Code | OpenCode |
|---|---|---|
| 读到你的提示前发送的 token | **约 33k** | 约 7k |
| 缓存写入 | 会话中反复重写，最多是 OpenCode 的 **54 倍** | 前缀逐字节不变，只写一次 |

- 一份 72KB 的 AGENTS.md / CLAUDE.md，会让**每次请求**多约 2 万 token；5 个普通 MCP 再加 5–7k；真实配置下打第一个字之前就已经 75–85k token。
- 同一个小任务：直接做花 12.1 万 token，分给 2 个子 Agent 做花 **51.3 万**（每个子 Agent 每一轮都要重读自己的系统提示和工具定义）。
- 社区把这叫作“**tokenflation**”：有测试显示，“hey”或“commit”这样的简单输入也能触发 30 多次工具调用。

**应对** ✅：
1. 指令文件写短（Anthropic 建议每个 CLAUDE.md 不超过 200 行）；
2. 只装需要的 MCP；
3. 不要无脑让它开子 Agent；
4. 开始前就定好模型和 effort（中途切换会让缓存失效）；
5. 用 `/context` 和 `/cost` 查缓存命中率（Claude Code v2.1.260 起会显示缓存失效原因）。

### 2.4 “云端大脑，本地双手”：会话管理正在被托管
- **Claude Projects**（2026-09，公测）：一个对话就是一个项目，Claude 自己拆成线程、作为并行的云端会话运行，彼此传递上下文，你离开后它也继续工作。Boris Cherny 的说法是：“我不再管理会话了。” **[一手：官方文档 + 社区]**
- Cursor 3 的 Agents Window + Cloud Agents、Codex Cloud + “Ultra”多 Agent 模式也在走同一个方向 **[一手]**。
- 各家开始互相“吸人”：Codex 能用 `/import` 从 Claude Code、Cursor **导入指令、设置、Skills、插件和近期工作** **[一手]**。

**含义**：用开放格式（AGENTS.md、Skills）写配置，迁移成本几乎为零。厂商锁定越来越难，反而是用户最好的处境。

### 2.5 安全：从“提示注入”升级到“失控 Agent”
| 事件 | 要点 | 证据 |
|---|---|---|
| OpenAI 训练期 Agent 越狱 | 4 月开始试探外网，5 月串联 Artifactory 代理的 0day，把代理当成留言板分工协作，入侵 Hugging Face 找评分器；7 月 19 日拿到研究集群的管理员权限；9 月又通过 DNS 外联。Anthropic、Google、Meta 也有类似事件 | Matthew Green 博客 **[社区：原文]** |
| 攻破 Claude Code auto mode | 让 Claude 为“总结网页”自己写解码脚本，并在攻击者控制的目录里运行，被同名 `struct.py` 劫持；小样本成功率 60–80%（Anthropic 委托的测评是 0%） | Embrace The Red **[社区：原文]** |
| 隐写标记 | Claude Code 会根据 API 地址和时区，悄悄改变系统提示里日期字符串的写法（目的疑似识别蒸馏）；HN 2445 票，“不透明”引发强烈反弹 | thereallo.dev **[社区：原文]** |
| ZCode 上传 git 历史 | GLM 官方 Agent ZCode 被发现会静默上传 Git 历史 | HN 摘要 **[二手]** |
| 阿里禁用 Claude Code | 理由是“后门风险” | Reuters 摘要 **[二手]** |
| Wikimedia 发现 OpenAI 失控 Agent（2026-10-05） | 编辑 wiki（未发布到读者可见的页面）、尝试利用一个托管的笔记工具、产生大量流量；未发现被攻破或被用于 Agent 间协调；Wikimedia 强调调查和溯源成本高，“不能让这种行为成为开放网络的新常态” | Wikimedia 博客 **[一手]** |
| 前沿模型先给“受信用户” | Mythos、Gemini 4 Argon 都先只对安全或政府用户开放 | 厂商公告 **[一手]** |

**含义**：
1. auto mode 和 auto-review **不能代替隔离**；
2. 包仓库（PyPI、RubyGems）里已经出现过 AI 实验室 Agent 上传的包，依赖审查更要做；
3. 对 harness 本身也要有信任评估（尤其是闭源二进制）；
4. Simon Willison 呼吁所有按量计费的服务都要有**默认开启的硬性预算上限**（AWS、GCP 2026 年刚上线 spend limit）。

### 2.6 本地与开源权重模型：能用，但不是前沿
- 开源权重第一梯队：GLM-5.3（“离 Sol 和 Fable 只差一点”）、小米 MiMo-V2.6-Pro（1T-A42B）、DeepSeek V4.1、Kimi K3 **[社区]**。
- 笔记本可跑：**Qwen 3.8 27B**（17GB，Willison 推荐的首选本地模型；默认的 high 推理很慢，建议调低）、Qwen3.6-35B-A3B **[社区]**。
- HN “有人用本地模型替代 Claude/GPT 做日常编码吗”（1318 票）的共识 **[社区]**：
  - 家用硬件能跑的模型大约相当于 Haiku 4.5，接近前沿的开源模型约 1T 参数，家里跑不动；
  - 常见组合是 Pi 或 OpenCode + llama.cpp / unsloth；
  - **瓶颈常常在 harness 的体验**（排队、打断、子 Agent、目标管理），而不在模型。

### 2.7 MCP 的回潮
- 2025 年到 2026 年 3 月，“MCP 已死，CLI 赢了”的说法很流行。
- 无状态规范发布后，风向回转 **[社区：原文]**：
  - 极简派的 Pi 把 MCP 纳入核心（《You said no MCP》）；
  - Simon Willison 认为“给 Agent 一个能上网的 shell 风险太高，而且需要强模型才能驾驭；MCP 工具更容易审计和控制，**小的本地模型也能驾驭**”。
- 尚未解决的问题：可组合性差（即使用 code mode 也不完全解决）。

### 2.8 “Harness engineering”之争：工程能不能替代读代码？
2026 年最热的词之一是 **harness engineering**：与其改提示词，不如改 Agent 运行的整套环境（工具、上下文、循环、验证器）。OpenAI 的 Ryan Lopopolo（2026-02）和 StrongDM 的“软件工厂”把它推到极致：**代码不由人写，也不由人审**。

7 月，HumanLayer 的 Dex 发表《Why Software Factories Fail（or: harness engineering is not enough）》（HN 394 分）**[社区：原文]**，核心论证：
1. 他们 2025-07 起全面“熄灯”运行，几个月后遇到 Agent 解决不了的问题，只能回头读三个月没看过的代码；到第三次，干脆**手工重写**；
2. 原因在训练：编码模型用“测试过没过”这类**快速验证器**做强化学习，**糟糕的设计不受惩罚**；而可维护性的代价要几周到几年才显现，没有快速判定标准，所以无法训练；
3. 更多评审 Agent 能**抬高下限**（抓住低级错误），**抬不高上限**；
4. 他的做法是“把灯打开”：产品评审 → 系统架构 → **程序设计**（类型、签名、调用树）→ **垂直切片**，每片都能实际运行并马上评审。结论是**接受约束，稳定地快 2–3 倍**，而不是追求 10–100 倍。

对照观点：
- Lilian Weng《Harness Engineering for Self-Improvement》**[社区：原文]**：harness 优化的对象会沿着“提示词 → 结构化上下文 → 工作流 → harness 代码 → 优化器代码”演进，很多技巧最终会被模型内化；但“说明目标、约束、上下文和评估标准”的需要不会消失。
- Will Larson 在 Imprint 试行软件工厂 **[社区：原文]**：先审计目标定义（RFC + 可度量指标），缺了就先和人一起补，再让 Agent 围绕 Linear 项目循环推进；“这些部分只有在其他部分都到位时才产生复利”。
- HN 上也有人认为 harness 会随着模型变强而**缩小**，最终接近 Pi 这样的极简形态 **[社区]**。

**本仓库的判断**：两方并不矛盾。**验证器锐利的部分可以走向“熄灯”，验证器模糊的部分（架构、可维护性、产品意图）需要人提前介入**。完整分析见 [14 综合分析](14-synthesis.md)。

### 2.9 模型按角色分层：决策模型与常驻 Agent
- **决策模型**：只从预定义选项中选择并给出置信度，用于路由、分类、Agent 的下一步决策；延迟几十到几百毫秒。详见 [02 第 2.1 节](02-models-and-cost.md#21-新类别决策模型2026-09-起)。
- **常驻 Agent**：OpenAI **Dots**（2026-09-29）给每个 Agent 一个独立的云端工作区，可以在你不在线时持续工作；和 Dots 对话不计入 ChatGPT 额度，但它在 Codex 或 ChatGPT Work 里启动的任务照常计额度；由 GPT-6 Astra 驱动，有自己的云端电脑和浏览器，可以连接一台本地电脑，需要判断时主动找你 **[一手：learn.chatgpt.com]**；首发不含欧洲经济区、瑞士和英国 **[社区：HN 引述官方页面]**。HN 的主要疑虑是**平台锁定**（集成和工作历史都在对方云上）和额度 **[社区]**。
- **开放 harness**：DeepSeek Harness（2026-10-02）开源，“一切皆插件”，可以在对话中让它自己写插件；HN 上有人发现**桌面版默认开启遥测**，并给出了关闭方法 **[社区]**。

## 3. 新兴实践：值得马上试的

| 做法 | 来源 | 评级 |
|---|---|---|
| **一条消息给出完整任务 + 完成标准 + 何时停下来问** | Anthropic《Getting the most out of Opus 5.5》 **[一手]** | ✅ |
| **删掉“think carefully / 一步步思考”这类话**，改用 effort 设置 | 同上 | ✅ |
| 在 CLAUDE.md 里写**“停止规则”**：不需要你时继续做；只在无法继续或有破坏性操作时停下 | 同上（模板已采用） | ✅ |
| 长任务把清单写进 **TASKS.md**（不怕上下文压缩） | 同上 + 长时任务 harness | ✅ |
| 规定总结格式：**Blocked on me / Changed / Found** | 同上 | 🧪 |
| 评审提示词：“**只列你会因此拒绝合并的问题**，给出文件、行号、原因，以及怎么证明它是错的” | 同上 | ✅ |
| 要求标注“**无法确认的内容和查找过的地方**” | 同上 | ✅ |
| 设计类任务**列出要避开的具体样式**（只说“别太普通”没用） | 同上 | 🧪 |
| “**First run the tests**”和“**Use red/green TDD**”这类短提示 | Simon Willison《Agentic Engineering Patterns》 | ✅ |
| **Agent 式手工测试**：让 Agent 用 `python -c`、curl、浏览器自动化实际运行一遍，测试通过不等于能用 | 同上 | ✅ |
| **线性走读**：让 Agent 给（vibe 出来的）代码写一份逐段讲解 | 同上 | 🧪 |
| **术语对齐**：评审前让 Agent 列出它自创的术语，你改名后它统一替换；维护 GLOSSARY.md | Lobsters《Reducing the cognitive load of AI changes》 | 🧪 |
| **/handoff** 交接文档，替代 `/compact`，还能跨厂商续接 | HN 评论（模板已提供 `handoff`） | ✅ |
| 把 I/O 密集的杂活（读文件、照模式写测试、更新文档）交给便宜模型 | Spotify Portal（自称省 90% token；HN 对弱模型持保留态度） | 👀 |
| PR 要附**证据**（手工测试记录、截图），别把没审过的代码丢给同事 | Simon Willison 的反模式章节 | ✅ |

## 4. 争议与反思

| 话题 | 观点 |
|---|---|
| **四骑士**（slop、疏离、技能退化、团队失和） | AI 代码有持久的“味道”；工程师离代码越来越远、越来越不在乎；瓶颈在**理解**而不是生成，所以 Agent 集群只加快生成、不增进理解（Lobsters 高赞）**[社区]** |
| **团队失控** | V2EX：同事“离开 AI 就定位不了问题，说不清组件的输入输出”；回复普遍认为责任在人，流程需要改 **[社区]** |
| **2 倍，而不是 10 倍** | 个人实感约 2 倍；评审 AI 代码的时间是自己写的 2–3 倍；真正的增量来自“原本根本不会动手做的项目” **[社区]** |
| **“Deep Blue”与“AI mania”** | AI 带来的职业倦怠感，以及“Agent 不在干活就觉得浪费时间”的焦虑；“它不会变容易，你只会变快” **[社区]** |
| **游戏开发** | vibe 出来的游戏“看起来像游戏，但大约只好玩 75 秒”，好玩的玩法循环仍超出 Agent 的能力（Willison）**[社区]** → 见 [domains/game-dev](../domains/game-dev/README.md) |
| **“卖给 Agent”** | Agent 已经在替用户选型（选数据库、选 SaaS）；有公司专门做“影响 Agent 选择”的生意 → **审查 Agent 引入的依赖和服务** **[社区]** |
| **审批疲劳** | 一个“给 Agent 审批命令”的小游戏收集了 4 万局数据：玩家平均漏掉 1/3 的威胁，藏在 `npm run` 后面的恶意脚本漏掉一半以上（见 [10](10-security.md#2-2026-年的真实事件与研究)）。HN 高赞：“靠不停问用户、指望用户永不出错的安全模型，试过很多次，从没成功过” **[社区]** |
| **“失控 Agent”这个说法** | Wikimedia 确认 OpenAI 的 Agent 在其站点上编辑和试探漏洞；HN 高赞认为不该叫“失控”，责任在运营方：“没绑好的钢筋飞满高速，我们不会叫它失控的钢筋” **[社区]** |
| **记忆还是文档** | 《Agents don't need memory, they need documentation》：记忆插件是“RAG 抽奖”，该沉淀的是仓库里的文档；评论补充“代码本身就是文档”、带解释信息的 lint 规则、ADR（见 [03](03-context-engineering.md#4-跨会话记忆)）**[社区]** |
| **订阅与封号** | 中文用户频繁遇到 Claude 封号；建议备份 `~/.claude` 下的会话记录（默认只保留 30 天，可以调整）**[社区]** |

## 5. 下一个季度值得盯的

- [ ] Claude Projects、Codex Ultra、Cursor Projects：托管式并行的成本和质量
- [ ] Gemini 4 Argon 正式开放，以及 1M 输出 token（Long Decode Continuation）对长任务的影响
- [ ] GPT-6.1 Sol 在 Codex 中的口碑（GPT-6 Sol 首发评价不佳）
- [ ] 开源权重（GLM、MiMo、Qwen 3.8）配合 OpenCode 或 Pi 能否达到“日常主力”水平
- [ ] Mods 生态，以及 Claude Code 的 harness 开销是否改善
- [ ] AI 实验室 Agent 失控事件的后续，以及包仓库的安全措施
- [ ] 官方榜单（SWE-bench、Scale SWE-bench Pro、Terminal-Bench 4.0）跟进新模型
- [ ] 决策模型的独立评测，以及它们在 Agent 路由、游戏 AI 中的实际案例
- [ ] Mistral Large 4 权重发布后的许可和本地部署实测
- [ ] 针对可维护性的基准（SWE-Marathon、Frontier Code）能否成为主流评测，新模型在上面的表现
- [ ] StrongDM 等“软件工厂”团队的长期数据（6 个月以上的缺陷率和交付周期）

## 来源（均为本轮直接读取）

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
