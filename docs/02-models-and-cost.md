# 02 · 模型与成本

> 核实时间：2026-10-08（加入 Claude Haiku 5.5、Mistral Large 4、决策模型）。模型以“周”为单位更新，本页给出**选择原则**和**当前快照**；最新动态见 [13 前沿雷达](13-frontier-radar.md)。

> 局部复核：2026-10-11（UTC+8；2026-10-10 UTC）只复核本页的计费口径、OpenAI Sol 版本价格与订阅速度倍率、Claude Haiku/Opus 价差。其他厂商条目和能力判断仍保留原核实日期，不代表全表重新验证。

## 1. 原则：按任务分档，而不是追榜单

| 任务 | 档位 | 当前代表（2026-10） |
|---|---|---|
| 架构设计、跨模块重构、疑难 bug、长时间无人值守的任务 | 顶档 | Claude Opus 5.5 / Fable 5.1，GPT-6 Astra / 6.1 Sol（高 effort），Gemini 4 Argon（尚未开放） |
| 日常功能开发、写测试 | 主力档 | Claude Sonnet 5.5 / Opus 5.5（低 effort），GPT-6 Sol（Medium） |
| 检索型子 Agent、批量小改、格式化 | 快速档 | **Claude Haiku 5.5**（2026-10-07，Claude Code 中的默认 Haiku），GPT-6 Luna，Gemini Flash |
| 路由、分类、“从有限选项中选一个” | 决策模型（新类别） | Jev、Cloudflare Clef、Strands Decider 2B、OpenAI Decisions API（见第 2.1 节） |
| 离线 / 保密 | 本地开源权重 | Qwen 3.8 27B、Qwen3.6-35B-A3B（见第 5 节） |

**在 Claude Code 里落地**：主会话用强模型；子 Agent 的 frontmatter 写 `model: haiku` / `sonnet`；用 `CLAUDE_CODE_SUBAGENT_MODEL` 统一指定子 Agent 模型；**开始前就定好模型和 effort**（中途切换会让 prompt cache 失效，Anthropic 官方建议 **[一手]**）。

**Fable 级模型的用法** **[一手 + 社区]**：
- 一条消息给出完整任务、**什么算完成**、什么时候停下来问；
- 删掉“think carefully / 一步步思考”这类话（模型自己会思考，改用 effort 控制）；
- 想要快速回答时直接说“Answer directly”。

## 2. 价格快照（API 美元/百万 token）

**先分口径**：下表为 API 单价，不能换算订阅内任务数或额度百分比。本轮复核的 OpenAI Sol 两行采用 Standard、单请求输入不超过 272K token 的基础档；Claude Haiku 5.5 按总输入是否超过 100K 分档。缓存写入、长上下文与速度附加条件见表后；其他历史条目的计费条件须回到各自来源确认。

| 模型 | 输入 | 缓存读取 | 输出 | 来源 |
|---|---|---|---|---|
| **Claude Haiku 5.5**（Standard） | $0.10（总输入 >100K：$0.50） | $0.01（>100K：$0.05） | $0.50（>100K：$2.50） | [一手：API 价表](https://platform.claude.com/docs/en/about-claude/pricing) |
| GPT-6 Luna | $0.10 | $0.01 | $0.50 | [社区：Willison 整理] |
| Mistral Large 4（预览，限时价） | $0.68（原价 $1.36） | $0.07 | $2.09（原价 $4.18） | [一手：Mistral 文档] |
| GPT-6 Sol（`gpt-6-sol`，Standard ≤272K） | $2 | $0.20 | $10 | [一手：模型页](https://developers.openai.com/api/docs/models/gpt-6-sol) |
| GPT-6.1 Sol（`gpt-6.1-sol`，Standard ≤272K） | $2 | $0.10 | $10 | [一手：模型页](https://developers.openai.com/api/docs/models/gpt-6.1-sol) |
| Grok 4.7 | $2 | $0.50 | $6 | [社区] |
| **Claude Sonnet 5.5** | $2 | $0.10（2026-10 减半） | $10 | [一手：Claude Code changelog、Anthropic 公告] |
| **Claude Opus 5.5** | $4 | $0.20 | $20 | [一手] |
| Gemini 4 Argon | $4（首发 5 折：$2） | 九五折缓存 | $20（$10） | [社区：Latent Space] |
| **Claude Fable 5.1** | $10 | $0.25 | $50 | [一手] |
| GPT-6 Astra | $10 | $1 | $50 | [社区] |

**表中未展开的计费维度** **[一手；本轮局部复核]**：
- `gpt-6-sol` / `gpt-6.1-sol` 的 Standard 基础档缓存写入均为 $2.50/百万 token。总输入 >272K 时，整次请求的输入/缓存费率为基础档 2 倍，输出为 1.5 倍。API Fast 为适用 Standard 费率的 2 倍；`gpt-6.1-sol` Ultrafast 为 6 倍；Batch/Flex 为一半。不要把 6.1 的缓存价或 Ultrafast 可用性套给 6 Sol。见上方精确模型页。
- [OpenAI 缓存写入价](https://developers.openai.com/api/docs/guides/prompt-caching)替代该部分普通输入价，**不是两项叠加收费**。每个输入 token 按普通输入、缓存读或缓存写中的适用类别计价。
- Haiku 5.5 的 100K 门槛包含缓存读取与写入，逐请求判断，不是整段会话累计值；缓存写入还区分 TTL。完整规则见 [Claude API 价表](https://platform.claude.com/docs/en/about-claude/pricing)。

- **Claude Haiku 5.5**（2026-10-07）**[一手：Anthropic 公告]**：
  - 按 Standard 输入/输出单价，Haiku 4.5 的 $1/$5 对比 Haiku 5.5 ≤100K 档 $0.10/$0.50，下降 **90%**；>100K 档 $0.50/$2.50 则下降 **50%**，不是统一 75%。这是单价算术，不是任务总成本降幅 **[一手价表 + 算术]**；原公告还报告 1M 上下文、OSWorld 72.4%，并推荐子 Agent 用途（能力项本轮未复核）；
  - 同日 Sonnet 5.5 的缓存读取价格减半；
  - 订阅用户开始**每月附带 API 额度**：Max 5x 100 美元、Max 20x 200 美元、Team 最多 500 美元（团队共享）。
- **Mistral Large 4**（2026-10-06，公开预览）**[一手：Mistral 博客和文档]**：1.05T 总参数、52B 激活的 MoE，原生多模态，1M 上下文；**月底发布权重**；在欧洲自有数据中心训练。官方称在开源权重模型中达到领先、在视觉定位上超过闭源前沿模型。HN 上 Simon Willison 实测认为这是“Mistral 至今最好的模型”，也有人认为进步慢于中美实验室 **[社区]**。
- **降价必须指定比较对象和计费项**：Opus 5 的 Standard 输入/输出 $5/$25 → Opus 5.5 $4/$20，下降 **20%**（[一手价表](https://platform.claude.com/docs/en/about-claude/pricing)）。原“同档模型整体下降 40–50%”缺少固定样本与统一口径，不作为市场统计；“达到 Fable 5.1 水平”保留为厂商能力主张，不能据此认定所有任务质量等价。
- **Prompt cache 是最大的杠杆**：缓存读取约为输入价的十分之一甚至更低。缓存规则须按厂商、模型与配置区分：[Claude 缓存指南](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)说明，更改顶层 `output_config.effort` 会使消息缓存失效，对工具/系统缓存的影响依模型而异；显式写出原默认值不算变化，支持逐消息 effort 的模型也有保留前缀的路径。模型切换、前缀改动和 TTL 是排查因素，不能一概断言每次修改都会清空全部缓存。当前 [Claude Code 成本文档](https://code.claude.com/docs/en/costs)将缓存统计放在 `/usage` 的 Session 区；它覆盖主会话，不能当作全部子 Agent 的合计 **[一手]**。
- **Harness 本身也有成本**：实测 Claude Code 在你开口前就发送约 33k token，OpenCode 约 7k；一份 72KB 的指令文件让每次请求多约 2 万 token（详见 [13](13-frontier-radar.md#23-harness-的隐性成本被量化了)）**[社区：原文]**。本仓库在云端环境复现：默认约 31.6k，用 `--tools=` 收窄工具后降到 3–6k；72KB 的指令文件让每次请求多约 2.6 万 token（[19](19-experiments.md#3-e1固定开销)）**[经验：历史实测]**。这些是含缓存的原始输入量，不是按普通输入价计费的 token，也不能直接推算订阅消耗；原逐次数据缺失的限制见 [19](19-experiments.md)。

### 2.1 新类别：决策模型（2026-09 起）👀

- **是什么**：只能从**预先定义的选项**中选择、并给出**校准过的置信度**的小模型，不生成自由文本。由 TypeSafe AI 的 **Jev**（2026-09-15 发布）带起，几周内出现了 Cloudflare Clef（开源，基于冻结的 Qwen 骨干 + 选项打分头）、Strands Decider 2B、OpenAI Decisions API（基于 GPT-6 Luna），以及大量 0.8B 级别的社区复现；Ollama 0.35 起支持 **[一手：Cloudflare、Strands 博客；二手：Forkast 关于 Jev]**。
- **号称的优势**：Jev 自称比前沿 LLM 快约 190 倍、便宜约 440 倍；独立测试（Every）在一个抽取任务上测得快约 25 倍。注意 Jev 的准确率是**和前沿模型的一致率**，不是对照真实标准答案 **[二手]**。
- **在 AI coding 里的位置**：Agent 流程中大量的路由、分类、“下一步做什么”的判断，目前都交给通用 LLM 来做；决策模型把这部分拆出来，**用置信度决定是自动执行还是交给人**。
- **判断**：方向值得关注（模型在按角色分层，见 [14 规律五](14-synthesis.md#5-规律五模型在商品化可迁移的工程资产在增值)），但独立评测很少，大量复现出现在几周内，说明门槛不高、格局未定。**现在适合做原型，不建议押注某一家。**

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
- 当前 Pro 提供 $100/$200/$500 月费档；$500 档包含 **Ultrafast 访问资格**，不等于无限 Ultrafast 用量（[一手](https://learn.chatgpt.com/docs/pricing)）。此前记录的“$200 Pro 从 Plus 20 倍降至 10 倍”与“10 月 3 日后体感六折”没有附精确日期和可复核社区原帖，本轮标为**未核实历史说法，不作为当前套餐合同**。
- **GPT-5.5 于 2026-10-14 在 ChatGPT 和 Codex 中退役**（API 不受影响），Plus 以上换 `gpt-6-sol`，Free/Go 换 `gpt-6-luna` **[一手：OpenAI 文档]**。
- Anthropic 2026-05 到 09 的 +50% 周额度促销结束后，“几天就用完周额度”的抱怨持续存在（claude-code issue 区点赞第一）**[一手]**。
- 企业侧：Meta、微软、Uber 都经历了从鼓励“tokenmaxxing”到限制 AI 开销的转变；有工程负责人反映每人每月 token 花费在 200–500 美元，个别超过 2000 美元 **[社区]**。
- 2026-10 有报道称 **Meta 和微软在压缩员工的 Claude 使用量**，原因是成本 **[二手：HN 287 分的报道]**。HN 讨论的重点是“成本清算”：按量计费的 Agent 开销已经大到需要管理层出面控制。

**控制成本的做法** ✅：
1. 用 `npx ccusage` 分析本地日志里的用量 **[一手]**；
2. 无关任务之间 `/clear`；离开键盘前先 `/compact`（缓存还在时压缩更便宜）**[一手：Anthropic 博客]**；
3. **谨慎使用子 Agent**：同一任务拆给 2 个子 Agent 后 token 增加约 4 倍 **[社区：原文]**；
4. 让嘈杂的命令安静输出（加 quiet 参数），或者放到子 Agent 里跑；
5. 把 I/O 密集的杂活交给便宜模型（Spotify Portal 的做法）👀；
6. **按量计费的云服务一定要设硬性预算上限**：Agent 会自己开通付费服务；AWS（2026-09）和 GCP（2026-07）已有 spend limit **[社区：Willison]**。

## 4. 国内 Coding Plan

国产模型厂商推出了“Coding Plan”订阅，大多提供**与 Anthropic 或 OpenAI 兼容的接口**，可以直接配进 Claude Code、OpenCode、Cline 等工具：

| 厂商 | 说明 |
|---|---|
| 智谱 GLM（GLM-5.3，2026-08） | HN 评价“离 Sol 和 Fable 只差一点”；兼容 Claude Code 等 20 多种工具；经常限量发售 **[社区]** |
| Kimi（K3） | 每月 49 元 / 99 元两档 **[二手]** |
| 小米 MiMo（V2.6-Pro，1T-A42B） | 2026-09 发布时的开源权重第一 **[社区：Latent Space]** |
| DeepSeek V4.1 / V4 Flash | 很便宜，HN 有人评价“勤快” **[社区]** |
| MiniMax、阿里百炼等 | 价格战 |

**注意**：
- 换成第三方模型后，Claude Code 的部分功能（如 auto mode 分类器）可能不可用或效果不同。
- 代码会发送给相应厂商，按合规要求选择；GLM 官方的 ZCode 被曝会静默上传 git 历史 **[二手]**。
- 多个服务商之间切换：社区常用 cc-switch。比较网站：[codingplan.org](https://codingplan.org/en)。

## 5. 本地 / 开源权重模型

| 场景 | 建议 |
|---|---|
| 笔记本（32GB 以上内存） | **Qwen 3.8 27B**（17GB，Simon Willison 认为“几乎可以和前沿竞争”，推荐首选；默认 high 推理很慢，建议调低）、Qwen3.6-35B-A3B（MoE，速度快）、Gemma 4 26B-A4B **[社区]** |
| 单张 RTX 3090 / 4090 | llama.cpp + Qwen3.6-35B（MTP）+ OpenCode：“质量相当于 8–12 个月前的前沿模型”，参考 [LocalCodingLLM](https://github.com/pierotofy/LocalCodingLLM/) **[社区]** |
| 工作站（2 张 RTX Pro 6000） | DeepSeek V4 Flash，约 160 tok/s **[社区]** |
| Harness | **Pi**（系统提示极小）、**OpenCode**、Qwen Code；Codex 内置 ollama / lmstudio 支持 **[一手]** |

HN“有人用本地模型替代 Claude/GPT 做日常编码吗”（1318 票）的共识 **[社区]**：
- 家用硬件能跑的模型大约相当于 Haiku 4.5（有时接近 Sonnet）；
- 接近前沿的开源模型约 1T 参数，家里跑不动；
- 适合隐私要求高、离线、批量杂活的场景；
- **很多时候短板在 harness 的体验，而不是模型**。

## 6. 基准测试：怎么看才不被误导

**官方榜单现状（2026-10-05 直接读取数据）** **[一手]**：

| 榜单 | 当前情况 |
|---|---|
| [SWE-bench Verified](https://www.swebench.com) | 最高 79.2%（2025-12）；**最新条目停在 2026-02**，之后的模型（Opus 5.x、Fable、GPT-6）都没有上榜。Multilingual（bash-only，2026-02）：Gemini 3 Flash 72.7%、Claude 4.6 Opus 72.0%、GLM 5 69.7%、MiniMax M2.5 68.3%（成本只有其他模型的约七分之一） |
| [Scale SWE-bench Pro](https://scale.com/leaderboard/swe_bench_pro_public) | 公开集：Muse Spark 1.1 61.5%、GPT-5.4 xHigh 59.1%、Claude Opus 4.6 51.9%；**私有商业代码集**最高 51.5%。使用 copyleft 许可的代码来降低数据污染 |
| [Terminal-Bench](https://www.tbench.ai) | 已更新到 **4.0** 版（Stanford / Laude Institute） |

**怎么看**：
1. **官方榜单比模型发布慢好几个月**；第三方聚合站为了填补空白，混用了自报数据，出现“99%”这类明显不可信的数字。只看官方榜单，或者看实验室官方博客（并注意 harness 和 effort 的设置）。
2. 分数是**模型 + harness + 预算**的组合结果：Scale 的灰色条目就是限制了成本和轮数的结果。
3. **私有代码集上的分数**（Scale 商业集）比公开集低 10 个百分点左右，更接近真实项目。
4. **最可靠的是你自己的私有基准**：挑 5–20 个本项目的真实任务，换模型或换配置时重跑（方法见 [09](09-review-and-quality.md#3-给自己的-ai-配置做评估)）。

## 来源

- [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)、[Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)、[Maximizing the value of your Claude Code sessions](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions)、[Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)
- OpenAI：[Models / GPT-5.5 退役](https://learn.chatgpt.com/docs/models)、[What's new](https://learn.chatgpt.com/docs/whats-new)
- Simon Willison：[价格战](https://simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/)、[2026 in LLMs](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/)、[默认硬性预算上限](https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/)
- [Systima token 开销实测](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)、[Spotify Portal](https://engineering.atspotify.com/2026/9/portal-by-spotify-cut-my-claude-code-token-usage-by-90)
- HN：[GPT 6.1 Sol](https://news.ycombinator.com/item?id=49896586)、[GLM-5.3](https://news.ycombinator.com/item?id=49294997)、[Ask HN：本地模型](https://news.ycombinator.com/item?id=48542100)
- [Latent Space：Gemini 4 Argon](https://www.latent.space/p/ainews-gemini-4-argon-gdms-answer)、[MiMo-V2.6-Pro](https://www.latent.space/p/ainews-xiaomi-mimo-v26-pro-1t-a42b)
- 官方榜单：[swebench.com](https://www.swebench.com)、[Scale SWE-bench Pro](https://scale.com/leaderboard/swe_bench_pro_public)、[tbench.ai](https://www.tbench.ai)
