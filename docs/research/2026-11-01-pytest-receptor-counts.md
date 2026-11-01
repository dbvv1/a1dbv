# pytest-receptor：收集错误的计数保真

**正式版与固定 main 都保留 pytest 退出码，但 compact 的终端和 JSONL 会把收集错误记为已执行失败。** 这为[验证页既有的实际命令、数量和结果要求](../decisions/verification.md#怎样确认交付)补充一个实测反例，不新增 reporter 默认、不推荐安装，也不改变该页待补的新读者验收状态。

## 输入与版本

- [消费者 #46](https://github.com/uibcdf/pytest-receptor/issues/46) 的公开 SyntaxError 复现来自 molsysmt／molsysviewer 接收任务；2026-11-01 核仍 open。本次直接采用其两行坏文件，再补 ImportError 与另一个有效文件已被收集的变体。
- 实际安装官方 PyPI **pytest-receptor 1.2.2**，对应[发布源码 `531bafde`](https://github.com/uibcdf/pytest-receptor/tree/531bafde5d48ddd8974e29ac91ae53ecae0fd787)；逐字节核该源码目录的 Python 文件与安装包，无差异。
- 另在隔离环境构建安装[固定 main `acd8897f`](https://github.com/uibcdf/pytest-receptor/tree/acd8897f593fd11ec676c2b960fe53b9e699f5e6)。浅克隆令安装版本元数据显示 `0.0.0`，以源码哈希识别，不当作一个正式发行版。
- 两环境均 Linux、Python 3.12.14、pytest 9.1.1、串行。运行依赖仅 pytest；未装 xdist，不接模型或真实用户数据。

## 原生事实与 compact 输出

| 实际输入 | 原生 pytest 与独立事件 | llm / ci 的终端与 JSONL 汇总 |
|---|---|---|
| 只有 SyntaxError 或 ImportError 文件 | 1 个 collection error，0 collected，0 started，exit 2 | `failed=1`、`executed=1`；终端 `1 of 0 executed` |
| 另有一个有效测试已收集 | 1 个 collection error，1 collected，0 started，exit 2 | 同样误计；终端 `1 of 1 executed` |
| 全通过、普通断言失败、setup 错误 | 由原生输出和运行阶段记录判定 | 本次这些对照未发现相同误计 |

前两类均测正常与 `-x`，两个固定版本结果一致。**部分收集更容易被误读：分母是 1，不代表测试运行过。** 收集错误时独立 `pytest_runtest_logreport` 没有任何运行阶段事件，compact 原始 phase 仍为 `collect`，退出码仍是 2；问题是汇总计数，不是假绿。

机器消费的 JSONL 也不能只验文件完整性：原 artifact 经 `read_artifact` 核为完整且 SHA-256 校验有效，但 `session_finish.counts` 仍误计。`read_artifact.complete=true` 表示文件有结束记录；该记录中的 `session_finish.complete=false` 表示测试执行不完整，二者不同。

## 正对照与证据口径

- [#39 外部 helper 重跑路径](https://github.com/uibcdf/pytest-receptor/issues/39) 已在 1.2.2 修复。本次直接执行[原串行 single／grouped 回归](https://github.com/uibcdf/pytest-receptor/blob/531bafde5d48ddd8974e29ac91ae53ecae0fd787/tests/test_plugin.py#L762-L840)，两版本各 2 passed；测试真实执行生成的 rerun 并再次命中原测试、退出 1，不只是检查字符串。xdist 参数未运行。
- 正式版原 `test_collection_error_has_its_own_label` 仍为 1 passed；该断言只核标签与退出码，不足以发现本次计数问题。源码的 [parity 测试](https://github.com/uibcdf/pytest-receptor/blob/531bafde5d48ddd8974e29ac91ae53ecae0fd787/tests/test_parity.py)对 collection_error 跳过可见摘要对照；本次未跑全部上游 suite。
- 每版包含 13 个场景变体 × native/human/llm/ci。各模式退出码、收集错误数、collected、started、call、failed-call 与原生一致；但每版 26 个 compact 调用中，16 个收集错误调用的终端和 artifact 计数都不忠实。**这些是覆盖范围，不是效果指标，也不是“全部通过”。**
- 正式版另做无 observer 的 native／默认 human 对照，四个场景的退出码与结局一致。

[公开字段摘录 JSON](2026-11-01-pytest-receptor-counts.json)按版本和场景保留原生计数、模式间事件对照、终端 header 与 artifact 计数。它是去除本机路径后的字段摘录，**不是原 JSONL，不能用它重验原文件的完整性哈希**。

## 方法与局限

所有模式固定 cwd、rootdir、输入和停止参数，禁用第三方插件自动加载、个人 conftest，使用空配置。native 不加载 receptor；human 显式加载但不传仅 compact 支持的 artifact 选项。独立 observer 只记录公开 collect／collection_finish／runtest_logreport／session_finish hooks，不改测试 outcomes。

初轮 harness 错把 `--receptor-events` 传给 human，被产品按设计拒为 usage error；修正后完整重跑，公开结果只取修正轮。该错误不计产品回归。

本次是实际用户问题导出的公开受控复现及上游回归，**没有运行分子计算消费者的业务任务**；未验其他 Python／pytest 版本、OS、xdist 或 `--continue-on-collection-errors`。插件本身没有广泛采用证据，用户反馈集中同一组织；不据此评价整个工具，也不报告 token、费用、速度或 Agent 返工收益。原复现入口沿用 #46，已修路径沿用 #39，不另造安装指南或重复上游问题。

**依据**：[一手：真实消费者] [#46](https://github.com/uibcdf/pytest-receptor/issues/46)、[#39](https://github.com/uibcdf/pytest-receptor/issues/39)；[一手：发布与固定源码] [1.2.2 release](https://github.com/uibcdf/pytest-receptor/releases/tag/1.2.2)、[计数实现](https://github.com/uibcdf/pytest-receptor/blob/acd8897f593fd11ec676c2b960fe53b9e699f5e6/pytest_receptor/model.py#L110-L168)；[本仓实际试用／非作者只读验收] 本文与字段摘录。核实 2026-11-01。
