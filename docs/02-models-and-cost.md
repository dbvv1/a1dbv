# 02 · 模型与成本

> 核实时间：2026-10-03。

## 1. 原则：按任务分档，而不是追榜单

| 任务 | 档位 | 理由 |
|---|---|---|
| 架构设计、跨模块重构、疑难 bug、长程自主任务 | 顶档（Claude Fable / Opus、GPT 旗舰 high/xhigh、Gemini Pro） | 出错的返工成本远高于 token 成本 |
| 日常功能开发、写测试 | 主力档（Claude Sonnet、GPT 主力） | 性价比最高 |
| 检索型子 Agent、批量小改、格式化、分类 | 快速档（Claude Haiku、各家 mini / flash） | 便宜、快 |
| 审批分类、评审 | 专用或小模型 | Codex 有专门的 `codex-auto-review` 模型 **[二手]**；Claude Code 的 auto mode 也用独立分类器 **[一手]** |

**在 Claude Code 里落地**：主会话用强模型；子 Agent 在 frontmatter 里写 `model: haiku` / `sonnet`；`CLAUDE_CODE_SUBAGENT_MODEL` 统一指定子 Agent 的模型；`/effort` 调推理强度。

## 2. Anthropic 官方价格（Claude Code changelog，[一手]）

| 模型 | 输入 / 输出（每百万 token） | 缓存读取 | 上下文 |
|---|---|---|---|
| Claude Fable 5.1 | $10 / $50 | $0.25 | 1M |
| Claude Opus 5.5 | $4 / $20 | $0.20 | 1M |
| Claude Sonnet 5.5 | $2 / $10 | $0.20 | 1M |

**Prompt caching 是最大的省钱杠杆**：缓存读取价格只有输入价的十分之一左右。以下操作会让缓存失效：切换模型、改动工具定义或系统提示、空闲超过 TTL。Claude Code 的 `/cost` 会显示命中率和失效原因 **[一手]**。

其他厂商价格请以官网为准（本次未能直接访问 OpenAI 和 Google 的价格页）。

## 3. 订阅 vs API

| | 订阅（Claude Pro/Max、ChatGPT Plus/Pro、Copilot…） | API 按量 |
|---|---|---|
| 成本 | 固定，重度使用时单价低 | 用多少付多少，可预测性取决于用法 |
| 限制 | **5 小时额度 + 每周额度**，高峰期可能收紧 | 速率限制，没有周额度 |
| 适合 | 个人、交互式开发 | CI、批处理、团队统一计费、自建工具 |

**社区痛点 [社区]**：两家的 issue 区点赞第一都是额度问题。Claude Code 是“Max 订阅几天就用完周额度”（1498 个赞），Codex 是“token 消耗太快”（630 个赞）和“GPT-5.5 下额度消耗涨了 10–20 倍”（211 个赞）。Anthropic 2026-05 到 09 的 +50% 周额度促销结束后争议仍在。

**应对**：
- 用 `ccusage`（`npx ccusage`）分析本地日志里的用量 **[一手]**；
- 子 Agent 用便宜模型，避免无谓的并行；
- 长会话及时 `/clear`（上下文越长，每轮成本越高）；
- 关键工作流不要只依赖一家，准备备选。

## 4. 国内 Coding Plan

国产模型厂商推出了“Coding Plan”订阅，大多提供**与 Anthropic 或 OpenAI 兼容的接口**，可以直接配进 Claude Code、OpenCode、Cline 等工具 **[二手]**：

| 厂商 | 说明 |
|---|---|
| 智谱 GLM Coding Plan | 工具兼容性最好（官方支持 Claude Code、Cline 等 20+ 工具）；经常限量发售、很快售罄 |
| Kimi（月之暗面） | 每月 49 元 / 99 元两档，含 Kimi Code 额度 |
| MiniMax、小米 MiMo、阿里百炼等 | 价格战激烈 |

**注意**：
- 换成第三方模型后，Claude Code 的部分功能（如 auto mode 分类器、Anthropic 专属的工具特性）可能不可用或效果不同。
- 代码会发送给相应厂商，按公司合规要求选择。
- 比较：[codingplan.org](https://codingplan.org/en)、[码力榜](https://coding.iamle.com/)。

## 5. 本地 / 开源权重模型

| 场景 | 建议 |
|---|---|
| 代码不能出内网 | 自部署开源权重模型（vLLM / llama.cpp / Ollama / LM Studio），接入 OpenCode、Qwen Code、Codex（内置 ollama / lmstudio 支持 **[一手]**） |
| 单卡 24–32GB | 约 30B 级的量化编码模型可以做补全和小任务 |
| 长程 Agent 任务 | 开源模型与云端顶档仍有明显差距 **[经验]** |

常见家族：Qwen（Qwen3-Coder 系列）、DeepSeek、GLM、Kimi、MiniMax、Devstral、gpt-oss。

## 6. 基准测试：怎么看才不被误导

- **主要基准**：SWE-bench Verified / Pro（真实仓库修 bug）、Terminal-Bench 2.x（终端任务）、Aider Polyglot。
- **⚠️ 第三方聚合站的数字经常互相矛盾**。本次核实中看到，同为“SWE-bench Pro 公开集”，不同聚合站给出的最高分从约 60% 到 99% 不等（版本和子集不同，标注也不清楚）**[一手观察]**。
- **只信官方榜单**（[swebench.com](https://www.swebench.com)、[tbench.ai](https://www.tbench.ai)、[Scale SWE-bench Pro](https://scale.com/leaderboard)），并且注意：
  1. 分数是**模型 + harness** 的组合结果，换 harness 分数会变；
  2. 存在数据污染、“评估感知”问题（Anthropic 的 BrowseComp 文章讨论过 eval awareness）；
  3. **最可靠的是自己的私有基准**：挑 5–20 个本项目的真实任务，换模型或换配置时重跑（方法见 [09](09-review-and-quality.md#3-给自己的-ai-配置做评估)）。

## 来源

- [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)（v2.1.257 / 2.1.280 / 2.1.284 模型与价格）
- [Prompt caching 文档](https://code.claude.com/docs/en/prompt-caching)
- 额度 issue：[claude-code #（按点赞排序）](https://github.com/anthropics/claude-code/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)、[codex（按点赞排序）](https://github.com/openai/codex/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)
- [ccusage](https://github.com/ccusage/ccusage)
- 国内 Coding Plan：[CSDN 对比](https://blog.csdn.net/zhangay1998/article/details/162555439)（二手）
