# A-STRONG-METHOD-EXCALIDRAW-20261117 · Mermaid 多行节点导入成对先导
id: A-STRONG-METHOD-EXCALIDRAW-20261117
owner: dot-A
status: ready
kind: build
executor: strong
target_repo: dbvv1/a1dbv
base_ref: 9a87c1aca9a08814380d4afedf506149833e9a2f
result_branch: relay/a-strong-method-excalidraw-20261117

## 目标与启动者
最高优先验证候选，来源为 11-17 用户直接要求；由方向会话本机启动，不由默认弱模型接收端执行。
比较同一强模型的短三段任务包与 a1dbv 当前调试推荐，不预设少约束胜出。
方向会话先读[冻结协议](../../../experiments/strong-short-task-20261117/README.md)，它不进入被测模型上下文。

## 共同事实（两臂同输入）
公开真实任务：[原 issue](https://github.com/excalidraw/excalidraw/issues/9708)；代码仓库 `excalidraw/excalidraw`，固定 `c0a0ca348faa273c768de839a22df113f997c095`。
原 issue 的完整 Mermaid 输入是共同输入；预期为节点分行，实际报告为显示字面 `<br>`。两组同一个真实 GPU 截图工具，可随时打开实际应用、截图并看图。普通文本与其他标签不得被错误清除。

## 调度合同（不交被测模型）
方向会话先从原 issue 提取复现输入和期望，核固定基线可复现并冻结运行命令/依赖；失败则 blocked，不换题或编结果。
各臂独立浅检出目标仓库/新上下文，不共享 Git 对象、不挂载 a1dbv/旧补丁，核可读边界与越界记录，GPT-6.1 sol + Codex CLI + xhigh；相同工具权限、项目指令和依赖，单臂两小时，顺序：短任务→现行推荐。
不读旧实验、另一臂、已有补丁或上游解法；只给原问题正文、项目运行/贡献文档和必要 API 文档。查到解法记录污染，保结果但不算干净对照。
不提交上游、不部署，不读私人文件、不改账号/凭据；实现只改此公开任务需要的源文件与测试。

## 冻结模型输入
方向会话只发送 `experiments/strong-short-task-20261117/inputs/excalidraw/short.txt` 或 `current.txt` 全文及同一 RUN-ENV.txt，不发送整卡或协议。

## 短任务臂摘要（实际输入用冻结文件）
**要什么**：让原 issue 中含 `<br>` 的 graph TD 节点正常换行，保留连线、文本编辑和导出/导入。
**几点事实**：入口、固定版本和复现见共同事实。自己运行实际应用、截图并看图，发现差距后自主改；可连续工作，无需逐步请示。遵守项目指令及共同边界。
**交付**：可重放补丁、实际运行结果、相关检查、改动原因和未完成项；界面题附终图，CLI 题附真实输出。

## 现行推荐臂
使用上述 current.txt 全文（由[原提示](../../../experiments/strong-short-task-20261117/baseline-prompt.txt)填入共同事实）；不追加三审、拆卡或禁截图等规则。
同样允许真实运行、截图看图与连续长回合；不得人为削弱当前推荐。

## 交回与验收
按冻结协议逐项验核心行为、兼容和失败路径；新非作者标签隐藏评审先判质量，再揭组别看时间成本。
仅写 `experiments/strong-short-task-20261117/results/excalidraw/` 和本卡“当前结果”；含双臂原始首交补丁、复跑命令、脱敏实际输出/终图、盲评与计量表。
记录实际模型/配置、墙钟、token/缓存、实际费用或未知/估算、人工介入及设置/评审/返工总投入；限流与失败原样保留。
产物跑适用检查与公开扫描，提交到 result_branch，回写 review_ready；dot-A 接收后按结果改答案页/模板，不自动合 main。
不重派原有三卡，不解除其他写者隔离；原调用未知时保全，不能另起进程重复同组。

## 当前结果
待方向会话启动；尚无模型对照结果。固定基线预检与模型能力分账，执行、盲评、采用均未完成。
