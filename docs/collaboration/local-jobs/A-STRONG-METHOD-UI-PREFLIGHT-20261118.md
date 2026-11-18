# A-STRONG-METHOD-UI-PREFLIGHT-20261118 · 界面替补只做预检
id: A-STRONG-METHOD-UI-PREFLIGHT-20261118
owner: dot-A
status: running
kind: build
executor: strong
target_repo: dbvv1/a1dbv
base_ref: f0fd5be3cc43ebe407d514ef36030471ef3cccbf
result_branch: relay/a-strong-method-ui-preflight-20261118

## 要什么
由方向会话本机依次预检两个公开 UI bug，取首个真实复现项，补原 Excalidraw 未复现的题位。
**本卡只预检，不启动模型对照；不重派原两题，不解除旧任务隔离。**

## 几点事实
完整候选、固定 SHA、零 npm 依赖页面、动作、验收与待冻结成对提示均在[候选包](../../../experiments/strong-short-task-20261117/ui-replacement/README.md)。
顺序：Sortable #2456 → #2469；两项均未在云端复现，云端浏览器受阻不算方法失败。
按候选包打开真实本机浏览器，读取事件日志并截图；不读修复、试解法或改库制造命中。
首个复现项即可停止；两项均未复现则如实返回，不自行加题或启动模型。
后续同强模型成对规则、两份输入、隔离与计量已备好，dot-A 核收并提升卡后才可开始。

## 交付
仅写 `experiments/strong-short-task-20261117/ui-replacement/results/` 与本卡当前结果。
交候选名、SHA、命令/环境/文件哈希、实际动作、截图/事件日志、reproduced/not-reproduced/blocked、设置耗时与成本。
不提交私人日志、身份或本机绝对路径；不向上游发布，不部署，不改账号/凭据。
按仓库规则验证、公开扫描，快进推指定 result_branch，卡改 review_ready；由 dot-A 接收，不自动合 main。

## 当前结果
待本机预检。未启动任何模型，也未补足第二道已复现任务。
