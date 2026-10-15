# 02 · 模型与成本

> 更新：2026-10-15

## 1. 原则：按任务分档，而不是追榜单

已有方案能稳定完成任务，就继续用。出现漏约束、推理浅或验证不足时，🧪 尝试更强模型或提高 effort；等待或预算成为问题时，再试较低 effort 或更轻量模型。是否保留调整，看完成同一项任务的质量、总耗时与费用，包括返工；质量变差或返工抵消节省，就撤回。长时间无人值守本身不等于需要顶档，价格和单轮耗时也不能代替能力判断。**[研究：采用边界，未实测；依据见 [S1c](research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)]**

| 任务条件 | 选择 | 候选起点（非本仓库效果排名） |
|---|---|---|
| 架构设计、跨模块重构、疑难 bug 中，现有方案出现推理或验证缺口 | 🧪 尝试更强能力 | Claude Opus 5.5 / Fable 5.1、GPT-6 Astra / 6.1 Sol；effort 按下文调整。Gemini 4 Argon 见下方试用条件 |
| 范围清楚的日常功能开发、写测试 | ✅ 保留已够用的方案 | 新选型可从 Claude Sonnet 5.5 / Opus 5.5、GPT-6.1 Sol 的客户端默认 effort 起步 |
| 目标明确、结果容易检查的检索型子 Agent、批量小改、格式化 | 🧪 尝试轻量模型 | Claude Haiku 5.5、GPT-6 Luna；复杂调查不因交给子 Agent 就自动降档 |
| 路由、分类、“从有限选项中选一个” | 决策模型（新类别） | Jev、Cloudflare Clef、Strands Decider 2B、OpenAI Decisions API（见第 2.1 节） |
| 离线 / 保密 | 本地开源权重 | Qwen 3.8 27B、Qwen3.6-35B-A3B（见第 5 节） |

**effort 起点按模型与客户端区分**：Claude Code 当前建议 Opus 5.5／Sonnet 5.5 的日常、范围明确开发从 `medium` 开始；`low` 更适合逐次查看结果的小修改或快速草稿。Sonnet 5.5 在 Claude API 的默认值仍是 `high`，不能照搬客户端默认。Codex 的 GPT-6.1 Sol 从客户端默认 effort 起步，Astra 从 Light（配置值 `low`）起步，再按规划、分析与检查需要调整。同名 effort 不代表跨型号、跨代等强度。以上是厂商使用建议，不能据此认定本项目中的效果等价；表中决策模型与本地候选仍按各自小节的核查范围理解。**[一手：[Claude Code](https://code.claude.com/docs/en/model-config#choose-an-effort-level)、[Claude API](https://platform.claude.com/docs/en/build-with-claude/effort#recommended-effort-levels-for-claude-sonnet-5-5)、[Codex](https://learn.chatgpt.com/docs/models#choosing-a-model)，2026-10-15]**

**Gemini 4 Argon：从等待开放改为按任务试用。** `gemini-4-argon` 于 2026-10-13 在 Gemini API／AI Studio 正式可用；Free tier 和 Google AI Pro 计划不包含它。已有 Gemini API 工作流迁移时，先移除显式缓存调用，核对 thinking 与输出共享的 token 上限；不要只换模型 ID。🧪 适合需要比较复杂编码或长输出的任务，现有模型已满足要求则不必迁移；是否保留取决于本项目质量、延迟和总费用，GA 不证明收益。**[一手：[发布记录](https://ai.google.dev/gemini-api/docs/changelog)、[迁移指南](https://ai.google.dev/gemini-api/docs/latest-model)；研究：采用判断，2026-10-15，未实测]**

**快速子 Agent 还要匹配接口**：GPT-6 Luna 若同时需要推理与工具调用，使用 Responses API；Chat Completions 的 function calling 仅支持 `reasoning_effort=none`，不要只按低单价替换现有推理工具链。**[一手：[模型页](https://developers.openai.com/api/docs/models/gpt-6-luna)；研究：选型条件，2026-10-15]**

**在 Claude Code 里落地**：主会话用适合任务的模型；需要子 Agent 时，可在 frontmatter 写 `model: haiku` / `sonnet`，或用 `CLAUDE_CODE_SUBAGENT_MODEL` 统一指定。尽量减少没有任务理由的模型和 effort 切换；缓存影响按下文 [Prompt cache 的厂商与配置边界](#2-价格快照api-美元百万-token)判断，不为保缓存而拒绝必要的模型调整。**[一手：配置接口；经验：使用建议]**

**Fable 级模型的用法** **[一手 + 社区]**：
- 一条消息给出完整任务、**什么算完成**、什么时候停下来问；
- 删掉“think carefully / 一步步思考”这类话（模型自己会思考，改用 effort 控制）；
- 想要快速回答时直接说“Answer directly”。

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
- `gpt-6-sol` / `gpt-6.1-sol` 的 Standard 基础档缓存写入均为 $2.50/百万 token。总输入 >272K 时，整次请求的输入/缓存费率为基础档 2 倍，输出为 1.5 倍。API Fast 为适用 Standard 费率的 2 倍；`gpt-6.1-sol` Ultrafast 为 6 倍；Batch/Flex 为一半。不要把 6.1 的缓存价或 Ultrafast 可用性套给 6 Sol。见上方精确模型页。
- Luna／Astra 的基础缓存写入分别为 $0.125／$12.50；总输入 >272K 时同样对整次请求收取输入／缓存 2 倍、输出 1.5 倍。Grok 4.7 在 >200K 时另计，长上下文预算须查对应地区的价表，不能沿用基础行。**[一手：上列模型页，2026-10-15]**
- [OpenAI 缓存写入价](https://developers.openai.com/api/docs/guides/prompt-caching)替代该部分普通输入价，**不是两项叠加收费**。每个输入 token 按普通输入、缓存读或缓存写中的适用类别计价。
- Haiku 5.5 的 100K 门槛包含缓存读取与写入，逐请求判断，不是整段会话累计值；缓存写入还区分 TTL。完整规则见 [Claude API 价表](https://platform.claude.com/docs/en/about-claude/pricing)。
- Gemini 4 Argon 仅支持隐式缓存，命中后按输入价的 **5%** 计费（优惠 95%，不是“九五折”）；显式 `cachedContents`／`caches.create` 不支持。上表为 Standard，Batch／Flex／Priority 另计，搜索等工具费不在 token 单价内。长期预算按 2026-12-01 起的费率估算。**[一手：上列价表与迁移指南；研究：预算建议，2026-10-15]**

- **Claude Haiku 5.5**（2026-10-07）**[一手：Anthropic 公告]**：
  - 按 Standard 输入/输出单价，Haiku 4.5 的 $1/$5 对比 Haiku 5.5 ≤100K 档 $0.10/$0.50，下降 **90%**；>100K 档 $0.50/$2.50 则下降 **50%**，不是统一 75%。这是单价算术，不是任务总成本降幅 **[一手价表 + 算术]**；原公告还报告 1M 上下文、OSWorld 72.4%，并推荐子 Agent 用途（能力项本轮未复核）；
  - 同日 Sonnet 5.5 的缓存读取价格减半；
  - 订阅用户开始**每月附带 API 额度**：Max 5x 100 美元、Max 20x 200 美元、Team 最多 500 美元（团队共享）；须领取且只覆盖合资格运行入口，不能抵所有 Code 用量，见 [18 成本治理](18-team-adoption.md#5-成本治理)（2026-10-15 补核）。
- **Mistral Large 4**（2026-10-06，公开预览）**[一手：Mistral 博客和文档]**：1.05T 总参数、52B 激活的 MoE，原生多模态，1M 上下文；**月底发布权重**；在欧洲自有数据中心训练。官方称在开源权重模型中达到领先、在视觉定位上超过闭源前沿模型。HN 上 Simon Willison 实测认为这是“Mistral 至今最好的模型”，也有人认为进步慢于中美实验室 **[社区]**。
- **降价必须指定比较对象和计费项**：Opus 5 的 Standard 输入/输出 $5/$25 → Opus 5.5 $4/$20，下降 **20%**（[一手价表](https://platform.claude.com/docs/en/about-claude/pricing)）。原“同档模型整体下降 40–50%”缺少固定样本与统一口径，不作为市场统计；“达到 Fable 5.1 水平”保留为厂商能力主张，不能据此认定所有任务质量等价。
- **Prompt cache 是最大的杠杆**：缓存读取约为输入价的十分之一甚至更低。缓存规则须按厂商、模型与配置区分：[Claude 缓存指南](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)说明，更改顶层 `output_config.effort` 会使消息缓存失效，对工具/系统缓存的影响依模型而异；显式写出原默认值不算变化，支持逐消息 effort 的模型也有保留前缀的路径。模型切换、前缀改动和 TTL 是排查因素，不能一概断言每次修改都会清空全部缓存。当前 [Claude Code 成本文档](https://code.claude.com/docs/en/costs)将缓存统计放在 `/usage` 的 Session 区；它覆盖主会话，不能当作全部子 Agent 的合计 **[一手]**。
- **Harness 本身也有成本**：Systima 在 2026-07、Claude Code 2.1.207／OpenCode 1.17.18 的隔离代理实验中测得首轮约 33k／7k 输入；一份 72KB 的指令文件让每次请求多约 2 万 token（详见 [13](13-frontier-radar.md#23-harness-的隐性成本被量化了)）**[社区：原文]**。本仓库在云端环境复现：默认约 31.6k，用 `--tools=` 收窄工具后降到 3–6k；72KB 的指令文件让每次请求多约 2.6 万 token（[19](19-experiments.md#3-e1固定开销)）**[经验：历史实测]**。这些是含缓存的原始输入量，不是按普通输入价计费的 token，也不能直接推算订阅消耗或作为当前客户端成本排名。选择须比较实际完整任务的质量、返工与含缓存的总成本；历史配置及当前诊断入口见 [S1c](research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)，本仓库原逐次数据缺失的限制见 [19](19-experiments.md)。

### 2.1 新类别：决策模型（2026-09 起）👀

- **是什么**：从**预先定义的选项**中给出结果及概率的模型，不生成自由文本；概率输出不代表已经在目标任务上校准。由 TypeSafe AI 的 **Jev**（2026-09-15 发布）带起，几周内出现了 Cloudflare Clef（开源，基于冻结的 Qwen 骨干 + 选项打分头）、Strands Decider 2B、OpenAI Decisions API（基于 GPT-6 Luna），以及大量 0.8B 级别的社区复现；Ollama 0.35 起支持 **[一手：Cloudflare、Strands 博客；二手：Forkast 关于 Jev]**。 2026-10-15 局部复核：[Clef 官方模型卡](https://huggingface.co/Cloudflare/clef)只说明 logits 经 softmax 得到选项概率；自动路由前仍须检查本任务误判与阈值表现，阈值不能替代实际授权，见 [14 的采用边界](14-synthesis.md#新的分层趋势)。本次不重新认证其余产品条目。**[一手；研究：边界]**
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
- 当前 Pro 提供 $100/$200/$500 月费档；$500 档包含 **Ultrafast 访问资格**，不等于无限 Ultrafast 用量（[一手](https://learn.chatgpt.com/docs/pricing)）。此前“$200 Pro 从 Plus 20 倍降至 10 倍”仍缺精确日期和可复核依据，保留为未核实历史说法；“体感六折”已有 V2EX 第 7 条回复自述，但缺可复算的任务与前后基线，第 8–9 条还有相反体验。原帖与反证统一见 [11 额度自述](11-community-pulse.md#7-中文社区额度与交付自述)，两者均**不能作为当前套餐合同或统一降额的依据**。**[社区：六折原帖；研究：证据边界]**
- **GPT-5.5 于 2026-10-14 19:00 UTC 起在以 ChatGPT 登录的 Codex 中退役**；OpenAI API 和 API-key 登录的 Codex 不受该次退役影响。受影响的配置按当前可用模型与任务需要替换，不统一指定继任型号，见 [Codex 选择](01-agents/codex.md#2-模型按任务与实际用量选择)。**[一手：当前模型文档，2026-10-15 补核]**
- Claude 订阅耗尽速度有[具体历史报告](https://github.com/anthropics/claude-code/issues/26271)，但版本、任务与套餐不同，不能从个案或点赞推定当前普遍可用天数；范围见 [Claude](01-agents/claude-code.md#6-已知问题与社区反馈)。**[社区：原帖；研究：边界，2026-10-15 补核]**。
- 企业侧：Meta、微软、Uber 都经历了从鼓励“tokenmaxxing”到限制 AI 开销的转变；有工程负责人反映每人每月 token 花费在 200–500 美元，个别超过 2000 美元 **[社区]**。
- 2026-10 有报道称 **Meta 和微软在压缩员工的 Claude 使用量**，原因是成本 **[二手：HN 287 分的报道]**。HN 讨论的重点是“成本清算”：按量计费的 Agent 开销已经大到需要管理层出面控制。

**控制成本的做法** ✅：
1. 先查原生状态和服务商账单；需要历史定位时，按[下节边界](#31-查异常消耗ccusage-只补历史诊断)试用 ccusage，不把估算当结算 **[一手；经验：采用判断]**；
2. 无关任务之间 `/clear`；同任务需要腾空间时再 `/compact` 并指定保留重点，不把离开键盘当必做触发器，见 [03 会话动作选择](03-context-engineering.md)。缓存有效时压缩可能更便宜，不等于额外压缩一定省钱 **[一手；研究：采用判断，2026-10-15]**；
3. **按任务选择子 Agent**：只拆可独立验收或需隔离冗长输出的支线；共享背景多、频繁往返的小任务留主会话，见 [08](08-multi-agent.md)。历史小任务的输入量倍率不能当当前费用或额度倍率 **[一手；社区：历史报告；研究：采用判断，2026-10-15]**；
4. 让嘈杂的命令安静输出（加 quiet 参数），或者放到子 Agent 里跑；
5. 把 I/O 密集的杂活交给便宜模型（Spotify Portal 的做法）👀；
6. **给按量计费设预算与停用边界**：有开通权限的 Agent 可能产生额外费用；AWS 新体验项目和 GCP 合资格服务已有 spend limit / spend cap，但适用范围和超额计费不同，不能视为所有云服务通用的硬性封顶（见 [18 第 5 节](18-team-adoption.md#5-成本治理)）。**[一手：AWS、Google Cloud；研究：采用建议]**

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
4. **最可靠的是你自己的私有基准**：挑 5–20 个本项目的真实任务，换模型或换配置时重跑（方法见 [09](09-review-and-quality.md#3-给自己的-ai-配置做评估)）。

## 来源

- 价格与选型核查记录：[历史日期](research/2026-10-10-audit.md#页面日期与历史覆盖)、[发布与迁移](research/2026-10-10-audit.md#s1b--2026-10-15-主干时效补核)、[套餐与本地模型](research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)

- [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)、[Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)、[Maximizing the value of your Claude Code sessions](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions)、[Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)
- OpenAI：[Models / GPT-5.5 退役](https://learn.chatgpt.com/docs/models)、[What's new](https://learn.chatgpt.com/docs/whats-new)
- Simon Willison：[价格战](https://simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/)、[2026 in LLMs](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/)、[默认硬性预算上限](https://simonwillison.net/2026/Oct/3/default-hard-budget-caps/)
- [Systima token 开销实测](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)、[Spotify Portal](https://engineering.atspotify.com/2026/9/portal-by-spotify-cut-my-claude-code-token-usage-by-90)
- HN：[GPT 6.1 Sol](https://news.ycombinator.com/item?id=49896586)、[GLM-5.3](https://news.ycombinator.com/item?id=49294997)、[Ask HN：本地模型](https://news.ycombinator.com/item?id=48542100)
- [Latent Space：Gemini 4 Argon](https://www.latent.space/p/ainews-gemini-4-argon-gdms-answer)、[MiMo-V2.6-Pro](https://www.latent.space/p/ainews-xiaomi-mimo-v26-pro-1t-a42b)
- 官方榜单：[swebench.com](https://www.swebench.com)、[Scale SWE-bench Pro](https://scale.com/leaderboard/swe_bench_pro_public)、[tbench.ai](https://www.tbench.ai)
