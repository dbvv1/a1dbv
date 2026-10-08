# 02 · 模型与成本

> 核实时间：2026-10-08（加入 Claude Haiku 5.5、Mistral Large 4、决策模型）。模型以“周”为单位更新，本页给出**选择原则**和**当前快照**；最新动态见 [13 前沿雷达](13-frontier-radar.md)。

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

## 2. 价格快照（每百万 token）

| 模型 | 输入 | 缓存读取 | 输出 | 来源 |
|---|---|---|---|---|
| **Claude Haiku 5.5** | $0.10（>10 万 token 的请求 $0.50） | — | $0.50（>10 万：$2.50） | [一手：Anthropic 公告、Claude Code changelog] |
| GPT-6 Luna | $0.10 | $0.01 | $0.50 | [社区：Willison 整理] |
| Mistral Large 4（预览，限时价） | $0.68（原价 $1.36） | $0.07 | $2.09（原价 $4.18） | [一手：Mistral 文档] |
| GPT-6 Sol | $2 | $0.20 | $10 | 同上 |
| GPT-6.1 Sol | — | $0.10 | — | HN 引用 OpenAI 公告 |
| Grok 4.7 | $2 | $0.50 | $6 | [社区] |
| **Claude Sonnet 5.5** | $2 | $0.10（2026-10 减半） | $10 | [一手：Claude Code changelog、Anthropic 公告] |
| **Claude Opus 5.5** | $4 | $0.20 | $20 | [一手] |
| Gemini 4 Argon | $4（首发 5 折：$2） | 九五折缓存 | $20（$10） | [社区：Latent Space] |
| **Claude Fable 5.1** | $10 | $0.25 | $50 | [一手] |
| GPT-6 Astra | $10 | $1 | $50 | [社区] |

- **Claude Haiku 5.5**（2026-10-07）**[一手：Anthropic 公告]**：
  - 比 Haiku 4.5 便宜约 75%，1M 上下文，OSWorld 72.4%；Anthropic 推荐把它用作**子 Agent 模型**；
  - 同日 Sonnet 5.5 的缓存读取价格减半；
  - 订阅用户开始**每月附带 API 额度**：Max 5x 100 美元、Max 20x 200 美元、Team 最多 500 美元（团队共享）。
- **Mistral Large 4**（2026-10-06，公开预览）**[一手：Mistral 博客和文档]**：1.05T 总参数、52B 激活的 MoE，原生多模态，1M 上下文；**月底发布权重**；在欧洲自有数据中心训练。官方称在开源权重模型中达到领先、在视觉定位上超过闭源前沿模型。HN 上 Simon Willison 实测认为这是“Mistral 至今最好的模型”，也有人认为进步慢于中美实验室 **[社区]**。
- 2026-09 的价格战让同档价格下降 40–50%：GPT-6 系列约为 GPT-5.6 的一半；Opus 5.5 比 Opus 5（$5/$25）便宜，**能力达到 Fable 5.1 水平** **[一手：Anthropic]**。
- **Prompt cache 是最大的杠杆**：缓存读取约为输入价的十分之一甚至更低。会导致缓存失效的操作：切换模型或 effort、改动工具定义或系统提示、空闲超过 TTL（Claude Code 可以设成 1 小时）。`/cost` 会显示命中率和失效原因 **[一手]**。
- **Harness 本身也有成本**：实测 Claude Code 在你开口前就发送约 33k token，OpenCode 约 7k；一份 72KB 的指令文件让每次请求多约 2 万 token（详见 [13](13-frontier-radar.md#23-harness-的隐性成本被量化了)）**[社区：原文]**。本仓库在云端环境复现：默认约 31.6k，用 `--tools=` 收窄工具后降到 3–6k；72KB 的指令文件让每次请求多约 2.6 万 token（[19](19-experiments.md#3-e1固定开销)）**[经验：实测]**。

### 2.1 新类别：决策模型（2026-09 起）👀

- **是什么**：只能从**预先定义的选项**中选择、并给出**校准过的置信度**的小模型，不生成自由文本。由 TypeSafe AI 的 **Jev**（2026-09-15 发布）带起，几周内出现了 Cloudflare Clef（开源，基于冻结的 Qwen 骨干 + 选项打分头）、Strands Decider 2B、OpenAI Decisions API（基于 GPT-6 Luna），以及大量 0.8B 级别的社区复现；Ollama 0.35 起支持 **[一手：Cloudflare、Strands 博客；二手：Forkast 关于 Jev]**。
- **号称的优势**：Jev 自称比前沿 LLM 快约 190 倍、便宜约 440 倍；独立测试（Every）在一个抽取任务上测得快约 25 倍。注意 Jev 的准确率是**和前沿模型的一致率**，不是对照真实标准答案 **[二手]**。
- **在 AI coding 里的位置**：Agent 流程中大量的路由、分类、“下一步做什么”的判断，目前都交给通用 LLM 来做；决策模型把这部分拆出来，**用置信度决定是自动执行还是交给人**。
- **判断**：方向值得关注（模型在按角色分层，见 [14 规律五](14-synthesis.md#5-规律五模型在商品化可迁移的工程资产在增值)），但独立评测很少，大量复现出现在几周内，说明门槛不高、格局未定。**现在适合做原型，不建议押注某一家。**

## 3. 订阅、额度与成本控制

| | 订阅（Claude Pro/Max、ChatGPT Plus/Pro…） | API 按量 |
|---|---|---|
| 成本 | 固定，重度使用时单价低 | 用多少付多少 |
| 限制 | **5 小时额度 + 每周额度**，规则经常变 | 速率限制 |
| 适合 | 个人交互开发 | CI、批处理、团队计费、自建工具 |

**2026 下半年的变化**：
- OpenAI 推出 **500 美元/月的 Pro 档**（含 Ultrafast），原 200 美元 Pro 档在 Codex 和 Work 里的额度从 Plus 的 20 倍降到 10 倍 **[社区：HN 引用公告]**；10 月 3 日重置后，V2EX 用户普遍感觉额度大约打了六折 **[社区]**。
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
