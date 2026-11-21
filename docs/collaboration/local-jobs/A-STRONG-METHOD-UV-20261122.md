# A-STRONG-METHOD-UV-20261122 · 撤回版本解释成对试验
id: A-STRONG-METHOD-UV-20261122
owner: dot-A
status: blocked
kind: build
executor: strong
target_repo: dbvv1/a1dbv
base_ref: 72eab004e5d3999894b1449405754953f400563b
result_branch: relay/a-strong-method-uv-20261122

## 要什么
用 [uv #23293](https://github.com/astral-sh/uv/issues/23293) 替补已污染的 CLI 题 Click，不复跑旧题。固定 uv 0.12.22／`70fe1196a546e49148a73b1c592b2f74c33af80e`。方向会话本机预检，双方用同一 GPT-6.1 sol／Codex CLI／xhigh；现行先跑、三段短任务后跑。沿用[原协议](../../../experiments/strong-short-task-20261117/README.md)的隔离、两小时上限、首交盲评和分账；这是 CLI 题，用真实子进程输出，不需要 GPU。

## 先预检，不先跑模型
用固定源代码及锁文件实际构建 uv，确认 runner 的 Rust 工具链及准备好的依赖能在两臂同一隔离下使用；标签指定 Rust 1.99.0。设置耗时单列。原版 CLI 二进制的复现不能替代该源码构建。
在同一 runner、Python 3.13 下生成[本地索引](../../../experiments/strong-short-task-20261117/inputs/uv-resolver/make-index.py)，记录生成器打印的文件 URL。用**刚构建的**二进制运行：
```text
uv pip install --offline --no-config --no-cache --no-python-downloads --python <Python3.13> --target <新临时目录> --default-index <打印的文件URL> --dry-run "fixturepkg<=0.1.0"
```
核本题仍退出 1、两项撤回版本仅以撤回解释，核隔离边界并冻结 RUN-ENV.txt、两提示、索引文件哈希。模型只收到索引、RUN-ENV.txt 及[现行提示](../../../experiments/strong-short-task-20261117/inputs/uv-resolver/current.txt)或[三段提示](../../../experiments/strong-short-task-20261117/inputs/uv-resolver/short.txt)之一，不收到本卡、真实 issue 评论、验收控制、其他臂或上游解法。待 dot-A 核收改 ready 才启动；模型不可用不换代。

## 验收与交回
- 核心：同一 CLI 复跑仍解析失败、退出 1；对同时不兼容 Python 的撤回版本，输出清楚交代 Python 约束，可以同时列两因或归入准确的 Python 总结，不要求固定句式。
- 对照：保持仅 Python 不兼容、真正兼容但撤回、两类撤回混合、存在未撤回兼容版本，以及精确固定版本时的诊断/选择；兼容撤回的精确固定仍可选并警告，不兼容固定仍失败。只修解释，不改变解析策略。
- 保存首交补丁、相关检查和实际 CLI 前后输出；非作者先盲判行为、回归和维护性，再看用时和成本。计量按原协议，实际费用不可得记未知。只向指定回传分支写 `experiments/strong-short-task-20261117/results/uv/` 与本卡结果，公开扫描后交 review_ready；不发上游。

## 当前结果
blocked。云端用发行版 uv 0.12.22、Python 3.13.5、离线合成索引和 dry-run 复现并独立复验；0.13.9 也复现。取消撤回标记只报 Python 不兼容；将撤回版本改为兼容后仍正确报告撤回，精确固定可选且警告；不兼容时精确固定仍失败；有兼容未撤回版本则选中。未做固定源码构建、方向会话本机隔离或输入冻结，未启动模型，没有质量、时间或成本结论。
