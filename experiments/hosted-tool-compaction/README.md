# Hosted shell 压缩：用真实消费者验证已有修补

**已用 Agent Framework 且旧 shell 结果被压缩丢失时，先验证同一消息输入，再考虑窄补丁；不要为此迁移框架。** 本次按[上下文页](../../docs/decisions/context-management.md)完成真实公开问题 [#9886](https://github.com/microsoft/agent-framework/issues/9886) 的候选验收，不新增上游投稿。

## 固定输入与实际结果

- 2026-11-05，云端 POSIX、Python 3.12.14；源码 main 固定 `2d4cce8d75f74e4ae7e40d53ccb5c141440d874c`，core 声明版本 1.24.0。独立虚拟环境以 editable 安装该 core，未调用模型、远端服务或真实 shell 命令。
- 消息使用真实 Content／Message 类型和 `annotate_message_groups` → `ToolResultCompactionStrategy` → `included_messages`。合成输出表示测试通过、失败与超时；测试的是 SDK 如何保留结果，不是再次执行这些命令。
- [5 项独立消费者断言](test_consumer.py)：原源码 4 失败／1 通过。失败均是旧 shell 摘要为 `[Tool results: no results]`；保留最新且唯一一组时的对照通过。`keep_last_tool_call_groups=1` 不能保护更早的 shell 组。
- 只应用已关闭、未合并 [PR #9887](https://github.com/microsoft/agent-framework/pull/9887) 的生产文件差量后，同 5 项通过。补丁固定在 `20dd7f69c5992c7368cee8fbbb4dc6422e352a31` 相对其第二父提交的差量，70 行，仅补结果提取，不替换整份旧源码。
- 当前 main 原有 compaction 套件在修补后 159 项通过。再移入该 PR 的 9 项回归，修补后 168 通过；恢复本次 main 原生产文件、保留相同测试后，9 失败／159 通过。恢复补丁后生产文件 SHA256 为 `f0db3642c7f916398124422b9ecfa653dfbbc0c884a049f5a5348990fb0f7181`。
- 168 项包含上游针对 shell、code interpreter、image、computer、空输出、状态和混合结果的检查；自己的 5 项仅验 shell。suite 有 1 条 computer API experimental warning，无 skip。没有跑完整 core／workspace、类型检查、provider 请求序列化或真实模型。

## 在新隔离克隆复跑

需 Git、Python 3.12 与 uv；从官方仓库和公开包源安装依赖，先按所在项目授权执行。不要对正在工作的 checkout 应用补丁。将本目录复制到该克隆之外，下面 TEST 指向其绝对路径。

```sh
TEST=/absolute/path/to/hosted-tool-compaction  # 改为复制后的实际绝对路径
git clone https://github.com/microsoft/agent-framework.git af-check
cd af-check
git checkout --detach 2d4cce8d75f74e4ae7e40d53ccb5c141440d874c
git fetch origin 20dd7f69c5992c7368cee8fbbb4dc6422e352a31
uv venv --python 3.12 .venv
uv pip install --python .venv/bin/python -e ./python/packages/core pytest pytest-asyncio pytest-timeout opentelemetry-sdk
.venv/bin/python "$TEST/test_consumer.py"
# 上一步应是目标断言的 4 失败，而不是导入或环境错误；先读输出再继续。
git diff 20dd7f69^2 20dd7f69 -- python/packages/core/agent_framework/_compaction.py > ../hosted-result.patch
git apply --check ../hosted-result.patch
git apply ../hosted-result.patch
.venv/bin/python "$TEST/test_consumer.py"
.venv/bin/python -m pytest -o addopts='' python/packages/core/tests/core/test_compaction.py -q
git diff 20dd7f69^2 20dd7f69 -- python/packages/core/tests/core/test_compaction.py > ../hosted-tests.patch
git apply --check ../hosted-tests.patch
git apply ../hosted-tests.patch
.venv/bin/python -m pytest -o addopts='' python/packages/core/tests/core/test_compaction.py -q
```

本轮依赖：msgspec 0.22.0、pydantic 2.14.3、pytest 9.2.0、pytest-asyncio 1.4.1.post1、pytest-timeout 2.4.0、opentelemetry-api/sdk 1.45.2。命令按包允许范围解析依赖，不声称锁定完整可重现环境。缓存不可写时本轮将 `UV_CACHE_DIR` 指到独立临时目录，未更改系统权限。

## 采用边界

候选仅供同版本、同缺陷的本地验证，不是已发布修复或上游认可。`SummarizationStrategy`、provider 实际请求和模型遵守仍需另验；摘要仍受长度截断，不能承诺全部原输出无损。图片只保留描述元数据，不把二进制载荷嵌入摘要。

本次是已知背景执行者按页面做真实缺陷验收，不是新读者盲测。第二位未读材料的读者可用同问题的 code-interpreter 失败结果作为独立任务；本轮未完成该读者条件，不提升上下文页 🟡，不量化节时或模型收益。页面原有方法能指导核输入／输出；本轮补的是可复跑入口与窄候选的已验边界。
