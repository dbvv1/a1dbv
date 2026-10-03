# 模型选择

> 模型更新以“月”为单位，这里只写**选择原则**，具体排名请看文末榜单链接。

## 选择原则

| 任务类型 | 推荐 | 原因 |
|---|---|---|
| 架构设计、跨模块重构、疑难 Bug | 最强档推理模型（Claude Opus / GPT 旗舰 / Gemini Pro 档） | 错一次的代价远大于 token 成本 |
| 日常功能开发、写测试 | 中档主力模型（Claude Sonnet 档等） | 性价比最高 |
| 子 Agent 检索、批量小改、格式化 | 快速小模型（Claude Haiku 档、各家 mini/flash） | 便宜、快、上下文隔离 |
| 截图/UI/视觉相关 | 多模态强的模型 | Unity 场景截图、UI 还原 |
| 离线 / 保密代码 | 开源权重本地模型 | 代码不出内网 |

**实践建议**
- 在 Claude Code 里：主会话用强模型，Subagent 在 frontmatter 里指定 `model: haiku`/`sonnet` 降本。
- 关注 **effort（推理强度）** 设置：难任务调高，简单任务调低。
- 长上下文 ≠ 塞满上下文：上下文越干净，效果越好（见 [07-workflows](07-workflows.md)）。

## 本地 / 开源权重模型

适用：保密项目、离线环境、批量低价值任务。

- 常见家族：Qwen（Qwen3-Coder 系列）、DeepSeek、GLM、Kimi、MiniMax、Devstral、gpt-oss 等。
- 运行方式：Ollama、LM Studio、llama.cpp、vLLM。
- 接入 Agent：OpenCode、Aider、Goose、Cline/Kilo 等支持自定义 OpenAI 兼容端点。
- 经验法则：24GB 显存可跑 ~30B 级量化模型做补全/小任务；Agent 级长程任务目前仍明显弱于云端旗舰。

## 榜单与评测

- [Terminal-Bench](https://www.tbench.ai/)：终端 Agent 实测
- [SWE-bench](https://www.swebench.com/)：真实仓库修 Bug
- [LMArena (WebDev/Coding)](https://lmarena.ai/)：人类偏好对比
- [Aider Polyglot Leaderboard](https://aider.chat/docs/leaderboards/)：多语言编辑能力

> 榜单仅供参考：**在自己项目上的实测**才是最终依据。建议固定 3~5 个本项目典型任务作为私有基准。
