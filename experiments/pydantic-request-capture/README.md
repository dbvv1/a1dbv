# API 录制回放：断言当前请求，不把旧请求当新证据

🧪 **要验证 Agent 是否正确传递 API 参数，断言本次代码构造的请求；录制文件适合固定响应，不能替它作证。** 本轮实跑 Pydantic AI 已合入的 Cerebras 修复及其真实 `request_capture` fixture，并在隔离树还原旧 provider，得到可重复的假绿对照。没有新写同题修复或投稿。

## 三臂真实测试

固定上游 `be329c694aef8be4f55952315611305b06c42c94` 的两项原生测试：参数转发、四种 service tier。它们经过公开 `model_request` API、Cerebras provider、OpenAI SDK 和 HTTP 客户端，再由 VCR 回放已有公开 cassette。

| 生产代码 | 断言的数据 | 结果 |
|---|---|---|
| 已合入修复 | `request_capture` 观察本次构造的 body | 2 通过 |
| 仅 provider 还原到父提交 | 同一 `request_capture` 断言 | 2 失败，另 1 个 inline-snapshot teardown 错误 |
| 同一旧 provider | 将三处 body 读取改为 `vcr.requests` 的历史录制请求 | 2 通过，形成假绿 |

旧 provider 实际剥掉 `frequency_penalty`、`presence_penalty`、`parallel_tool_calls`、`service_tier`；四个 tier 的本次 body 均读到 `None`。录制内容却仍含当初的正确参数，因此只核录制请求会继续通过。原生 snapshot 的 teardown 错误与失败断言对应，不是第三项独立缺陷；没有接受它建议的新 snapshot 或弱化生产测试。

**改变接收动作的结论**：回放测试通过时，先查匹配是否覆盖 body；不覆盖而本次改动又是参数／header／序列化，就在实际发送层抓取并断言相关字段，再用负变异证明确实会红。不要因此废弃 VCR，或要求所有测试都采集所有字段。

## 离线复跑

需要 Git、Python 3.12 和 uv。取官方源码并固定提交，按其 uv workspace 安装测试、格式器及 OpenAI extra（安装会联网，回放不联网）：

```sh
git clone https://github.com/pydantic/pydantic-ai.git source
git -C source checkout --detach be329c694aef8be4f55952315611305b06c42c94
(cd source && uv sync --locked --package pydantic-ai-slim --extra openai --group dev --group lint)
python replay.py --source source --python "$PWD/source/.venv/bin/python" --work "$PWD/replay-output"
```

`--work` 必须不存在且在 source 树外。脚本只在新克隆中还原单个 provider 或替换断言，核导入路径确实属于该臂，不改原源码。每臂固定 `--record-mode=none`、严格 cassette 使用检查、合成 `mock-api-key`、隔离 HOME；不继承真实 API key。`offline_guard.py` 阻断进程内 socket connect/connect_ex 与 DNS，并让任何尝试导致测试失败。入口先验证 connect 和 DNS 两个调用确实被护栏拒绝。它是此 Python 测试的护栏，不是 OS 沙箱或任意子进程网络隔离。

生成逐臂日志和 [results.json](results.json)；脚本检查精确退出码／通过失败数量及两处关键失败特征。公开结果不收入原始日志中的本机路径。首次人工探针没有把虚拟环境 bin 放到 PATH，负例报告额外提示找不到 snapshot 格式器 ruff；最终入口已使用指定环境的 PATH，不将格式器问题归因于请求回归。

## 范围与归属

只跑上述两项真实测试及两臂负对照，未跑 Pydantic AI 全套、hosted CI、其他 provider 或原生 Windows/macOS。不调用 Cerebras、不录制新响应、不用真实密钥：本次只能确认当前本地构造的 payload 与历史响应回放，不能确认今天远端服务支持哪些参数、tier 生效、模型效果或费用。

来源：[原作者 PR #7653](https://github.com/pydantic/pydantic-ai/pull/7653)、[固定测试](https://github.com/pydantic/pydantic-ai/blob/be329c694aef8be4f55952315611305b06c42c94/tests/models/test_cerebras.py)、[request_capture 实现](https://github.com/pydantic/pydantic-ai/blob/be329c694aef8be4f55952315611305b06c42c94/tests/models/conftest.py)、[项目测试指导](https://github.com/pydantic/pydantic-ai/blob/be329c694aef8be4f55952315611305b06c42c94/tests/AGENTS.md)。本轮归属为既有修复的独立实测；核实与实跑：2026-11-05 UTC。不提高答案页评级。
