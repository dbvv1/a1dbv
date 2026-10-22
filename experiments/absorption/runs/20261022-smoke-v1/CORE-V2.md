# 核心正式批 v2（尚未真实执行）

题库和答案仍为冻结 v1，正文仍为 `009fd0a54a012ea3a506eea75f260f43ecc13595`。本批只改变施测提示的适用段选择，不根据冒烟回答改题或评分。核心 12 页各三题，两组共 72 个计划单元；B25-1/2/3 待同额检索另批，不算已完成。72 是计划，不保证两小时内全部完成。

## 唯一入口

复用本目录 `run_batch.py`，不传 `--task` 时仍为旧 smoke task 和旧提示。新批三个步骤均显式指定同一个 `task-core-v2.json`：

```sh
python3 experiments/absorption/runs/20261022-smoke-v1/run_batch.py prepare --task experiments/absorption/runs/20261022-smoke-v1/task-core-v2.json PRIVATE_PREPARED
python3 experiments/absorption/runs/20261022-smoke-v1/run_batch.py run --task experiments/absorption/runs/20261022-smoke-v1/task-core-v2.json --local-config PRIVATE_CONFIG PRIVATE_RUN
python3 experiments/absorption/runs/20261022-smoke-v1/run_batch.py export --task experiments/absorption/runs/20261022-smoke-v1/task-core-v2.json PRIVATE_RUN PRIVATE_EXPORT
```

`PRIVATE_*` 是仓库外执行端路径占位，不提交真实路径或配置。prepare 不运行模型。沿原 Claude Code + DeepSeek 入口及本机配置；不切 GLM／Gemini，不增加审批、金额、版本匹配门。两组相邻并交替先发顺序，已在 task 冻结。

## 输入和期限

v2 核心输入只下发共同要求与 core_decision 段，保留400中文字限制；不下发联网预算、800字或初始候选说明。读页组只追加资料边界句及固定版本完整正文。未来检索段是说明存档，不表示当前执行器有检索能力。

每页数据用 `git show <固定版本>:<页面>` 原始字节求 SHA-256；blob 用 `git rev-parse <固定版本>:<页面>`，与 freeze.md 核对。模型实际输入散列逐尝试保存；task 散列记录在批次时钟、summary 和导出 manifest 中。部署前另记录实际 runner 提交和源码散列。

一次 run 最长7200秒，单次调用480秒，普通失败最多重试一次，最多144次尝试；第37个最终失败单元才因多数失败停止。unknown模型完成但不计失败、不进正式分母。全新进程、临时空目录、无工具及公开扫描继续执行；原生builtin名录不是工具行为。

`batch-clock.private.json` 在任何版本探针／调用前保存固定绝对 deadline，同时以单调时钟约束，防系统时钟回拨拉长本次运行。没有自动恢复／续批功能；中断或截止即保留原输出并报告未运行。不得换输出目录重新 run 来重置同一批时限；如确需补项，应先审计旧回执及原期限，本实现不提供补项调用。旧目录已存在会被拒绝，不能覆盖。

## 结果与历史

`completed_core_v2` 只说明完整 API 绑定回答，不表示答对。`execution_eligible` 是执行证据资格，正式分母仍为 false，须交独立会话按冻结要点评分后另出结论；API未知不纳入。已知标签也必须在配对分析时核对两组实际模型／配置可比性，不把请求名当模型身份证明。

独立核查者仅接收 blind.json，其中每份 v2 答案的 output_constraints 携带两组相同的冻结共同要求（包括400中文字上限），不含可选页面、题号、组别或模型；不接收带组别 receipts 或私有映射；先冻结判定再揭组。72 个计划单元逐项列成功／失败／未知／未运行，按每页三题的有效配对报告，不报综合总分。超长等题目硬约束由冻结规则判，不自动裁剪或重新生成。

旧 task、提示、smoke 回执及 answers/judgments/results 均保持原历史，不填正式72格。新公开产物采用 `core-v2-` 前缀，私有输出按新 batch_id 分开。公开只交扫描与人工审查通过的必要摘要，原始流、思考、用量、费用、路径及配置仍留本地。

离线测试的合成72单元不能称为真实模型结果。真正发布／执行前对整合后的实际树重新跑完整离线验证；本文件不表示已经运行模型或完成39题。
