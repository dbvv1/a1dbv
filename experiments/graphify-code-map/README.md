# Graphify：代码关系图能替代源码验收吗

**🧪 用来定位文件和符号，不用来证明行为。** 本次 Graphify 能为本仓交付门禁找到关键实现与测试，但缺少跨进程 argv 目标、分支条件和动态测试调用关系；“没有路径”不能解读成“没有执行”。文档为主的知识库尤其不能把一次 code-only 建图当成全文索引。

## 用真实门禁问题核图，而不是数节点

固定本仓版本后，一位消费者只看实际生成的图并使用官方 query／explain／path；另一位独立读取固定源码，先写真值，不看图。负责人对照原始输出验收，未为这次评估编造待修规则或改动检查器。

| 接收者实际要核什么 | 图能提供的定位 | 仍须读源码的部分 |
|---|---|---|
| 完整离线入口怎样到公开扫描 | `check_offline.main → phases/run_process → subprocess` | `phases` 里的 argv 指向 `check_public.py`，再由新进程进入其 `main`；图没有连出这座桥，定向 path 返回无路径 |
| 为什么 skip 不能算完整通过 | `run_suite`、skip 回归测试及其辅助函数，另有解释普通 unittest 行为的注释节点 | `result.skipped` 返回失败的分支、父进程对退出码的处理；测试辅助函数到动态导入实现的边也未连出 |
| 是否只扫描 symlink 文本 | `scan_files`、`symlink_parent` 及相关测试名称；局部直接调用链可见 | 图仅连到 `os` 模块，未细化到 `readlink`；链接分支与普通文件读取的先后、allowlist 索引模式例外仍要核源码 |

这里的正结果是**找到继续阅读的起点**，不是三个行为问题已经由图证明。源码依据分别在 [离线入口](../../scripts/check_offline.py)、[公开扫描](../../scripts/check_public.py)及其[离线回归](../../tests/test_check_offline.py)、[扫描回归](../../tests/test_check_public.py)；精确受检版本、行号和结果见 [results.json](results.json)。

实际消费者先遇到两类卡点：普通词查询会混入其他模块和公共 import 节点，后来用 `path::symbol` 收敛；`query --help` 被当查询词，`explain --help` 查名称，`path --help` 报缺默认图却仍 exit 0。原输出全部保留，没有把退出成功当作拿到了答案；这些自由文本子命令应从顶层帮助核用法。

## 这次覆盖了什么

实际使用 Graphify 0.9.100 的 `extract --code-only --no-cluster --max-workers 1`，421 个代码文件生成 3721 节点、7569 边。日志同时报告：跳过 606 个非代码文件和 132 个未分类文件；1 个 Lisp 文件缺可选 grammar，另有 18 个代码文件无符号。后者没有逐文件判定原因。目标 Python 检查器在图中，但不能据总量推定其余文件都完整覆盖。

安装和运行仅在独立云 venv／仓库副本。使用空白环境、隔离 HOME，设置 `GRAPHIFY_BACKEND=none` 与 `GRAPHIFY_NO_AUTO_REFRESH=1`，没有运行 install／Hook／服务命令。这个版本普通 CLI 可刷新已有用户级 Skill，关闭自动刷新是本次只读边界的一部分。建图和查询后，目标树干净、隔离 HOME 没有文件、图内容哈希不变。

这只是无模型、无聚类的代码定位试用；未测文档语义提取、完整上游测试套件、真实 Agent 的效果或 token／时间收益。节点、边和查询次数不作为收益；不升级[上下文路线](../../docs/decisions/context-management.md)的默认或读者状态。

**依据**：[官方代码与语义提取区别](https://github.com/Graphify-Labs/graphify/tree/32e5efe935e6844ef39a5e33409e4efe848f2172)、[实际架构与置信标记](https://github.com/Graphify-Labs/graphify/blob/32e5efe935e6844ef39a5e33409e4efe848f2172/ARCHITECTURE.md)、[自动刷新开关源码](https://github.com/Graphify-Labs/graphify/blob/32e5efe935e6844ef39a5e33409e4efe848f2172/graphify/__main__.py#L266-L296)与[原使用者的版本漂移反馈](https://github.com/Graphify-Labs/graphify/issues/1805)。官方 [benchmark](https://github.com/Graphify-Labs/graphify/blob/32e5efe935e6844ef39a5e33409e4efe848f2172/BENCHMARKS.md#inferred-cross-file-edge-precision-fastapi-demo-corpus)也区分生产代码与 tests 同名 helper 的推断噪声；其其他仓库指标未移用到本仓。许可 Apache-2.0，核实 2026-11-02。
