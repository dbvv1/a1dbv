# A-STRONG-METHOD-UI-PREFLIGHT-20261118 · 界面替补只做预检
id: A-STRONG-METHOD-UI-PREFLIGHT-20261118
owner: dot-A
status: review_ready
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

- 候选 1 Sortable #2456 在固定基线 1.15.6 / 63ecb31937d19fcb30aa924e82ee8a769ef34492 上经 headless Chromium 156 三轮真实拖拽均复现：forceFallback 拖拽时 onStart 的 toArray() 为 alpha,bravo,charlie,alpha（Alpha 重复），释放后 onSort/onEnd 为 bravo,charlie,alpha；判定 reproduced，按协议停止，候选 2 #2469 未检查，未启动模型、计费 0。已写 results/PREFLIGHT.md、事件日志 JSON、复跑驱动与 9 张截图，任务卡置 review_ready。openIssues：scripts/check_offline.py 在本机 Windows 环境 BLOCKED（缺 /bin/bash 与 jq，0 个 phase 运行），完整离线套件未运行；仓库无 npm 测试入口；Workflow 为取得候选包执行了 git merge --ff-only origin/main（HEAD f0fd5be3→29f494e2，未提交/推送/切分支）。check_repo.py、check_public.py、git diff --check 均 exit 0。
- 产物：[f0a1d72](https://github.com/dbvv1/a1dbv/commit/f0a1d727493713df9ae722abe3d52be8bf18d0fb)，分支 `relay/a-strong-method-ui-preflight-20261118`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；独立审查通过。
- 下一步：待负责人 dot-A 核收 review_ready 卡并决定是否提升成对模型卡；离线套件需在具备 bash/jq 的环境补跑。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
