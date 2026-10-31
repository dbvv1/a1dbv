# Agent Framework：工具外派时拿不到调用 ID

**🧪 已用 Python Agent Framework、又要把工具派发到外部服务时，先核 provider 原始调用 ID，再在固定版本中用函数中间件取得它。** 同名、同参数的两次调用仍是不同调用，不能按参数或完成顺序猜配对；只让框架自己执行并回传工具结果的项目，不必为此加中间件。

真实使用者 [#9454](https://github.com/microsoft/agent-framework/issues/9454) 要在派发时用 provider `call_id` 关联服务记录与后续会话回放。问题不在模型是否生成了 ID，而在 Python 工具取得的 `FunctionInvocationContext`：没有函数中间件时，ID 没有进入 context。**框架回传给模型的结果仍带 ID**，不能把这件事诊断成整个调用循环丢失关联。

## 先确认来源，再临时取值

**在 provider 适配器接收原始调用时确认真实 ID 存在，再注册 `FunctionMiddleware`。** 本次 Core **1.22.0、1.24.0** 与固定主干均支持在 client 或 Agent 上注册；下面选择 Agent 级，已有函数中间件时先核实际路径，不重复加空层。

```python
from agent_framework import FunctionMiddleware

class KeepFunctionContext(FunctionMiddleware):
    async def process(self, context, call_next):
        await call_next()

# 在现有 Agent 构造处，把 KeepFunctionContext() 加入 middleware 列表。
# 工具仍以 FunctionInvocationContext 注入 context，不把 call_id 加进模型参数。
def context_call_id(context):
    value = context.metadata.get("call_id")
    if not isinstance(value, str) or not value:
        raise RuntimeError("No context call_id: do not dispatch")
    return value
```

在工具中先取值，再调用已有代理服务；不要从 tracing span、工具名或参数倒推。`FunctionTool.invoke(tool_call_id=...)` 的参数用于遥测，不会自动进入工具 context。本例 schema 实际只有业务参数 `q`，上下文无需模型填写。

**非空 metadata 不是来源证明。** 所测版本会把空 provider ID 回填为框架生成的 `Content.id`，并发出 `FutureWarning`；本例实跑中，两个原始空 ID 也通过了上面的非空检查。缺真实 ID 要在进入自动循环前处理，不能等工具内检查；也不能靠字符串前缀或与 `function_call_occurrence_id` 比较来猜来源。后者是框架调用实例身份，不是 provider ID 的替代品，provider ID 也不承诺跨会话全局唯一。

这是依赖未公开保证的 `metadata["call_id"]` 键的**版本固定临时做法**，升级时重跑复验。#9454 仍开放，维护者尚在规划公共 API，本仓没有替上游设计新 API 或发布修复。

**依据**：[官方函数中间件说明](https://learn.microsoft.com/en-us/agent-framework/concepts/agents/middleware/?pivots=programming-language-python#function-middleware)、固定主干的[两条执行路径](https://github.com/microsoft/agent-framework/blob/b7884ad88eb85c27b2a7bf40c0e15948e7ccc28d/python/packages/core/agent_framework/_tools.py#L2285-L2369)、[空 ID 回填](https://github.com/microsoft/agent-framework/blob/b7884ad88eb85c27b2a7bf40c0e15948e7ccc28d/python/packages/core/agent_framework/_tools.py#L4650-L4669)和 [Content 两种身份](https://github.com/microsoft/agent-framework/blob/b7884ad88eb85c27b2a7bf40c0e15948e7ccc28d/python/packages/core/agent_framework/_types.py#L1190-L1221)。核实：2026-10-31 UTC。

## 真框架、脚本模型的对照结果

[consumer_probe.py](consumer_probe.py) 调用安装包的真实 `Agent` 与自动工具循环；脚本 client 发出两次同名、同参调用，内存 recorder 代表外部代理。用事件明确让第二次先完成，不靠 sleep 时序猜测。

| 场景 | 工具内看到什么 | 框架下一次模型请求 |
|---|---|---|
| 无函数中间件，流式／非流式 | 两次 metadata ID 均为空 | 两条结果仍分别带 `call-a`、`call-b` |
| client／Agent 级函数中间件，流式／非流式 | 两个预置 provider ID 可读取；外派记录与结果 receipt 精确匹配 | 逆序完成仍正确对应 |
| 工具先检查 context ID；无中间件 | 0 次内存派发 | 两条工具错误结果，循环继续，不是整个 Agent 停止 |
| 同一检查＋Agent 级函数中间件 | 两次派发 | 两条成功结果 |
| provider 原始 ID 为空＋函数中间件 | metadata 非空检查仍放行；ID 来自框架回填 | 证明该检查不能替代 provider 边界校验 |

三个版本各 **9 个框架场景**通过行为断言；“通过”包含明确复现缺口和空 ID 反例，不表示问题已修好。另检查手动 `invoke`、4 类无效 metadata 和隐藏 context 的参数 schema。非作者独立复跑结果随 [results.json](results.json) 留存。

本次没有真实模型、HTTP 代理服务、跨会话重放、审批／取消／重试或 provider 专属集成验收；没有修改框架，也未跑完整上游套件。这里交付的是这一个关联缺口的诊断与临时取值入口，不是新的通用 Agent 架构。

## 重跑固定正式版 1.24.0

在一次性环境中使用 Python 3.12；安装步骤会从包仓下载依赖，脚本本身不联网、不读真实配置。下列命令从 a1dbv 根目录执行：

```sh
set -eu
probe="$PWD/experiments/agent-framework-call-id"
work="$(mktemp -d)"
python3.12 -m venv "$work/venv"
"$work/venv/bin/python" -m pip install -r "$probe/requirements.txt"
mkdir "$work/home"
env -i HOME="$work/home" PATH="$PATH" \
  "$work/venv/bin/python" "$probe/consumer_probe.py"
```

正常退出时 JSON 的 `all_assertions` 为 `passed`；stderr 的函数失败告警来自预期的缺 ID 对照。任一断言失败均非零退出。不要用 `python -O`，它会关闭断言。

本次环境：Linux、CPython 3.12.14；正式版安装包与固定主干分别导入执行。主干测试沿用 1.24.0 依赖，但导入源码来自固定 checkout；`_tools.py`／`_middleware.py` 与正式包相同，其他文件有差异，不能把两者当同一整包。版本、实际导入文件哈希和完整代表输出在 [results.json](results.json)，复验依赖见 [requirements.txt](requirements.txt)。

## 来源覆盖

| 来源 | 本次采用与缺口 |
|---|---|
| 官方文档、发布包与开源实现 | 函数中间件契约、[1.24.0 发布](https://github.com/microsoft/agent-framework/releases/tag/python-1.24.0)、固定主干；形成 1 项版本固定取值办法 |
| 真实使用者与维护者 | #9454 原问题、完整复现和两条评论；消费需求真实，本仓 recorder 是合成替身，未获原报告者验收 |
| 中英文技术社区 | 定向检索未取得另一份可核、同因的独立实践；中文缺 ID 搜索线索原帖本轮不可读，不混成同一个 bug，也不作热度或最佳框架排名 |

本轮是已有 SDK 读者问题的定向实试，不是框架选型广扫。最高水平的跨框架效果比较未知。
