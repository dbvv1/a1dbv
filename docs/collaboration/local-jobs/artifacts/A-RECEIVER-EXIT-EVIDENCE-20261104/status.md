# A-RECEIVER-EXIT-EVIDENCE-20261104 · 五项原调用退出核查

**五项原调用都已结束，本次只读复核没有发现任何一项的已登记进程或写者仍存活。** 五项的结构化执行元数据一致记录：CLI 已关闭并记录退出码 0、轮次已结束、工具调用已结算且无挂起、登记进程树全部 exited；各自结束后 2–17 分钟的采集快照 `live` 均为空。2026-11-04T13:17:36Z–13:20:10Z 的多遍只读进程表查询按 PID＋创建时间逐条比对，匹配到同一进程的条数为 0。

## 未消除的阻塞

以下阻塞状态均截至 2026-11-04T13:20:10Z 观察时点；观察后的变化见文末“观察后复核”。

- **观察时点，三项模板卡没有公开结果提交。** A-TEMPLATE-CODEX-PORTABILITY、A-TEMPLATE-SPEC-REUSE、A-TEMPLATE-VERIFIER-SCOPE 的远端当时都不存在 `relay/a-template-*-20261104` 分支；各自当时只有本机工作树里一条未推送提交（提交时间 10:27:34Z／10:43:40Z／11:01:13Z），本单元未读取其差量，也未改动工作树。
- **登记范围不含进程隔离。** 五项都是 `scope=registered_subtree`、`containment=false`：登记集合内的进程已结束，登记树之外若有脱离的写者，其状态为 unknown，无法由本次证据排除。结论只覆盖接收端登记的进程集合。
- **观察时点，三项模板卡在输入修订 bbf7128e 的 main 上为 blocked，原因是验收不过而不是未退出。** 当时卡上只记 check_repo 未通过、未推送，未列具体条目；运行目录 repo-check.json 记录为 TASKS.md 超过 10 KB 与 5 个 Wave 1 报告链接目标缺失（WAVE-1-AI-CODING／GAME-KNOWLEDGE／FPS／MOBA／STAR-RUSH），共 6 项。以上均为基线已有、本单元候选未新增（`verdict.introduced` 为空）；本报告未在原三项模板卡的工作树上重跑该检查。阻塞原因是检查失败而非进程未退出，本报告只确认退出，不裁决模板修复是否完成。
- **观察时点，两项 review_ready 卡（A-TOP5-CURRENT-WEEK、A-GIT-DELIVERY-CLI-READER）的公开提交已核到远端分支**，是否接收由负责人决定；本报告不代替接收判定。
- **范围边界：以上只是退出与公开产物证据。** 任何结论均不自动授权重跑、重派或解除隔离；后续动作仍由原恢复合同约束，隔离状态保持观察时点原样。

## 逐项结论

下表时间均为 2026-11-04（UTC），**本次观察**统一为 13:17:36Z–13:20:10Z；表中“已公开产物／尚缺”均为该观察时点状态，观察后由接收端收集的部分单独注明。

| 任务（第 1 单元第 0 次） | 原调用 | 工具 | 登记进程／相关写者 | 关联范围与核验依据 | 已公开产物 | 尚缺 |
|---|---|---|---|---|---|---|
| A-TEMPLATE-CODEX-PORTABILITY-20261104 | 已结束：10:12:11.530–10:24:34.681Z，exit 0 | 已结束：settled，pending 0 | 已结束：登记 770 个全部 exited；本次 0 存活 | 登记子树 770，`censusError` 空，`containment=false`；结束时 10:24:34.678Z 与结束后 10:27:31.415Z 两次快照均无 live | 观察时点无；观察后接收端推 [7f3330a](https://github.com/dbvv1/a1dbv/commit/7f3330a1290849f88a98e8c148978c584dad1ad1)，分支 `relay/a-template-codex-portability-20261104`（1 文件，+1/−1） | 观察时点缺公开结果提交与可核差量；观察后已收集，待负责人接收 |
| A-TEMPLATE-SPEC-REUSE-20261104 | 已结束：10:29:05.306–10:41:04.719Z，exit 0 | 已结束：settled，pending 0 | 已结束：登记 1005 个全部 exited；本次 0 存活 | 登记子树 1005，`censusError` 空，`containment=false`；10:41:04.716Z 与 10:43:38.255Z 两次快照均无 live | 观察时点无；观察后接收端推 [cee8a0b](https://github.com/dbvv1/a1dbv/commit/cee8a0b7aa8912555af2b3fce764114e5907ca96)，分支 `relay/a-template-spec-reuse-20261104`（1 文件，+9/−6） | 观察时点缺公开结果提交与可核差量；观察后已收集，待负责人接收 |
| A-TEMPLATE-VERIFIER-SCOPE-20261104 | 已结束：10:44:28.762–10:58:25.791Z，exit 0 | 已结束：settled，pending 0 | 已结束：登记 1102 个全部 exited；本次 0 存活 | 登记子树 1102，`censusError` 空，`containment=false`；10:58:25.788Z 与 11:01:10.648Z 两次快照均无 live | 观察时点无；观察后接收端推 [7d418cd](https://github.com/dbvv1/a1dbv/commit/7d418cdd737f7482d28513ec81ea01c52f893b2f)，分支 `relay/a-template-verifier-scope-20261104`（1 文件，+16/−7） | 观察时点缺公开结果提交与可核差量；观察后已收集，待负责人接收 |
| A-TOP5-CURRENT-WEEK-20261104 | 已结束：11:03:28.019–11:14:25.674Z，exit 0 | 已结束：settled，pending 0 | 已结束：登记 675 个全部 exited；本次 0 存活 | 登记子树 675，`censusError` 空，`containment=false`；11:14:25.672Z 与 11:31:31.625Z 两次快照均无 live | [a2793db](https://github.com/dbvv1/a1dbv/commit/a2793db01b0037eec02ba68b906b2eb6e6bb00fa)，分支 `relay/a-top5-current-week-20261104` | 无退出缺口；待负责人接收 |
| A-GIT-DELIVERY-CLI-READER-20261104 | 已结束：09:54:28.219–10:08:16.408Z，exit 0 | 已结束：settled，pending 0 | 已结束：登记 716 个全部 exited；本次 0 存活 | 登记子树 716，`censusError` 空，`containment=false`；10:08:16.406Z 与 10:10:33.379Z 两次快照均无 live | [9a5ba4b](https://github.com/dbvv1/a1dbv/commit/9a5ba4bca22220171bb6b48b6efc3bd6870ddad6)，分支 `relay/a-git-delivery-cli-reader-20261104` | 无退出缺口；待负责人接收 |

三项模板卡的“尚缺”只指 13:20:10Z 观察时点的公开产物：其原调用本身已正常退出；观察后接收端已推送结果分支，并在 main 上把三卡改为 review_ready，待负责人接收，不由本报告改写。

## 逐项明细

### A-TEMPLATE-CODEX-PORTABILITY-20261104

- 原调用：10:12:11.530Z 派出，10:24:34.681Z 结束，`status=success`、`exit_code=0`、`error` 为空；CLI 10:24:34.357Z 关闭且 `closeSeen=true`，`termination.state=none`、`persistence.state=not_required`。
- 工具：`settled`，`pending=[]`，`scope=native_stream`。
- 登记进程／写者：结束时登记的 770 个进程全部 exited（10:24:34.678Z 观察）。本次末遍查询中该集合有 30 个 PID 仍在进程表里，但创建时间全部不同，按 PID＋创建时间判定为 PID 复用，同一进程存活 0 个。接收端状态记录的本单元进程号本次查询不存在（该项只记 PID、未记创建时间）。
- 关联完整性：`scope=registered_subtree`、`containment=false`、`censusError=null`；采集快照登记 771 个，比控制块多 1 个，口径差一个对象，`live` 仍为空。无隔离，脱离登记树的写者不在证据范围。
- 已公开产物：截至 13:20:10Z 观察时点无（当时本机工作树 `receiver/A-TEMPLATE-CODEX-PORTABILITY-20261104` 有 10:27:34Z 的未推送提交，未读取、未改动）；观察后 13:37Z 复核，远端分支 `relay/a-template-codex-portability-20261104` 已指向 [7f3330a](https://github.com/dbvv1/a1dbv/commit/7f3330a1290849f88a98e8c148978c584dad1ad1)，即该工作树 HEAD，差量 1 文件 +1/−1。
- 尚缺：观察时点缺公开结果提交与可核差量；观察后已由接收端收集，待负责人接收。隔离状态为观察时点记录，保持原状。

### A-TEMPLATE-SPEC-REUSE-20261104

- 原调用：10:29:05.306Z 派出，10:41:04.719Z 结束，`status=success`、`exit_code=0`、`error` 为空；CLI 10:41:04.613Z 关闭且 `closeSeen=true`，`termination.state=none`、`persistence.state=not_required`。
- 工具：`settled`，`pending=[]`，`scope=native_stream`。
- 登记进程／写者：结束时登记的 1005 个进程全部 exited（10:41:04.716Z 观察）。本次末遍查询中该集合有 34 个 PID 仍在进程表里，创建时间全部不同，同一进程存活 0 个。接收端状态记录的本单元进程号本次查询不存在（该项只记 PID、未记创建时间）。
- 关联完整性：`scope=registered_subtree`、`containment=false`、`censusError=null`；采集快照登记 1006 个，比控制块多 1 个，`live` 为空。无隔离，脱离登记树的写者不在证据范围。
- 已公开产物：截至 13:20:10Z 观察时点无（当时本机工作树 `receiver/A-TEMPLATE-SPEC-REUSE-20261104` 有 10:43:40Z 的未推送提交，未读取、未改动）；观察后 13:37Z 复核，远端分支 `relay/a-template-spec-reuse-20261104` 已指向 [cee8a0b](https://github.com/dbvv1/a1dbv/commit/cee8a0b7aa8912555af2b3fce764114e5907ca96)，即该工作树 HEAD，差量 1 文件 +9/−6。
- 尚缺：观察时点缺公开结果提交与可核差量；观察后已由接收端收集，待负责人接收。隔离状态为观察时点记录，保持原状。

### A-TEMPLATE-VERIFIER-SCOPE-20261104

- 原调用：10:44:28.762Z 派出，10:58:25.791Z 结束，`status=success`、`exit_code=0`、`error` 为空；CLI 10:58:25.545Z 关闭且 `closeSeen=true`，`termination.state=none`、`persistence.state=not_required`。
- 工具：`settled`，`pending=[]`，`scope=native_stream`。
- 登记进程／写者：结束时登记的 1102 个进程全部 exited（10:58:25.788Z 观察）。本次末遍查询中该集合有 28 个 PID 仍在进程表里，创建时间全部不同，同一进程存活 0 个。接收端状态记录的本单元进程号本次查询不存在（该项只记 PID、未记创建时间）。
- 关联完整性：`scope=registered_subtree`、`containment=false`、`censusError=null`；采集快照登记 1103 个，比控制块多 1 个，`live` 为空。无隔离，脱离登记树的写者不在证据范围。
- 已公开产物：截至 13:20:10Z 观察时点无（当时本机工作树 `receiver/A-TEMPLATE-VERIFIER-SCOPE-20261104` 有 11:01:13Z 的未推送提交，未读取、未改动）；观察后 13:37Z 复核，远端分支 `relay/a-template-verifier-scope-20261104` 已指向 [7d418cd](https://github.com/dbvv1/a1dbv/commit/7d418cdd737f7482d28513ec81ea01c52f893b2f)，即该工作树 HEAD，差量 1 文件 +16/−7。
- 尚缺：观察时点缺公开结果提交与可核差量；观察后已由接收端收集，待负责人接收。隔离状态为观察时点记录，保持原状。

### A-TOP5-CURRENT-WEEK-20261104

- 原调用：11:03:28.019Z 派出，11:14:25.674Z 结束，`status=success`、`exit_code=0`、`error` 为空；CLI 11:14:25.421Z 关闭且 `closeSeen=true`，`termination.state=none`、`persistence.state=not_required`。
- 工具：`settled`，`pending=[]`，`scope=native_stream`。
- 登记进程／写者：结束时登记的 675 个进程全部 exited（11:14:25.672Z 观察）。本次末遍查询中该集合有 21 个 PID 仍在进程表里，创建时间全部不同，同一进程存活 0 个。
- 关联完整性：`scope=registered_subtree`、`containment=false`、`censusError=null`；采集快照登记 676 个，比控制块多 1 个，`live` 为空。无隔离，脱离登记树的写者不在证据范围。
- 已公开产物：[a2793db](https://github.com/dbvv1/a1dbv/commit/a2793db01b0037eec02ba68b906b2eb6e6bb00fa)，`relay/a-top5-current-week-20261104` 远端分支指向该提交，内容为首屏更新（1 文件，+9/−9）。
- 尚缺：无退出相关缺口；接收与否由负责人判断。

### A-GIT-DELIVERY-CLI-READER-20261104

- 原调用：09:54:28.219Z 派出，10:08:16.408Z 结束，`status=success`、`exit_code=0`、`error` 为空；CLI 10:08:16.279Z 关闭且 `closeSeen=true`，`termination.state=none`、`persistence.state=not_required`。
- 工具：`settled`，`pending=[]`，`scope=native_stream`。
- 登记进程／写者：结束时登记的 716 个进程全部 exited（10:08:16.406Z 观察）。本次末遍查询中该集合有 23 个 PID 仍在进程表里，创建时间全部不同，同一进程存活 0 个。
- 关联完整性：`scope=registered_subtree`、`containment=false`、`censusError=null`；采集快照登记 717 个，比控制块多 1 个，`live` 为空。无隔离，脱离登记树的写者不在证据范围。
- 已公开产物：[9a5ba4b](https://github.com/dbvv1/a1dbv/commit/9a5ba4bca22220171bb6b48b6efc3bd6870ddad6)，`relay/a-git-delivery-cli-reader-20261104` 远端分支指向该提交，内容为 CLI 输出修复与回归测试（3 文件，+257/−1）。
- 尚缺：无退出相关缺口；接收与否由负责人判断。

## 核查方法

- 只读来源：五项各自运行目录的 `execution.json`（结构化执行元数据，未读其中模型输出文本）、`collection-processes.json`、接收端 `state/_attempts.json` 的五条记录、五项工作树的 HEAD 引用、远端 `git ls-remote` 分支查询。
- 进程核对：一次性读取系统进程表的 PID 与进程创建时间，只与本卡关联的登记集合比对；不按进程名推断归属，不列出无关进程，不停止、不暂停、不恢复任何进程。
- 生存判定：PID 与创建时间同时匹配才算同一进程；只在 PID 相同、创建时间不同时判为 PID 复用。三次查询的现存数因 PID 回收略有出入，匹配数始终为 0。
- 关联完整性：五项 `censusError` 均为空，说明当次登记采集没有报错；但 `containment=false` 表示没有进程隔离，登记树之外的脱离写者无法排除，本报告只断言登记集合内的进程已退出。
- 未读取：模型会话正文、提示词、原生事件流、接收端原始日志、凭据与账号配置。未运行：任何恢复、停止、清理入口；未重跑五项原任务的检查；未改动原五卡、模板、页面、脚本与工作树。

## 依据

接收端 2026-11-04 五项运行目录的结构化执行元数据与采集快照（各行的原记录与观察时点）；三项模板卡运行目录的 repo-check.json（check_repo 输出）；接收端状态记录的五条单次尝试记录（均为第 1 单元第 0 次，无重试）；2026-11-04T13:17:36Z–13:20:10Z 的多遍只读进程表查询；2026-11-04T13:20:10Z 观察时对上述五项对应 `relay` 分支的查询（仅 A-TOP5-CURRENT-WEEK 与 A-GIT-DELIVERY-CLI-READER 两条命中，三项模板卡无对应分支）；2026-11-04T13:37Z 对 `origin` 的复核查询（`refs/heads/main` 与三项模板结果分支，见下节）。本单元只新增本文件，未提交、未推送。

## 观察后复核（发布前，2026-11-04T13:36Z–13:37Z）

上文的公开产物与卡片状态只描述 13:20:10Z 观察时点。复核时已更新为：

- main 于 13:28:25Z／13:29:29Z／13:30:26Z 依次提交 `205ca4babc5e116d63b456041e7c9f84a0d29a3b`／`d47a5a83949dda5b7da6f2215dd4e953440870ac`／`8ff9c82101f5c80b962e184d9136994583e0d881`，提交信息分别为 A-TEMPLATE-CODEX-PORTABILITY／A-TEMPLATE-SPEC-REUSE／A-TEMPLATE-VERIFIER-SCOPE 的 `unit 1 done`；最新 main `a80ec3ec0bc33772d849eda8585902e5533e43af`（13:32:50Z）上三卡均为 `status: review_ready`。
- 观察后复核时 main 为 a80ec3ec，三卡当前结果同样记为 6 项既有失败。
- 远端 `relay/a-template-codex-portability-20261104`、`relay/a-template-spec-reuse-20261104`、`relay/a-template-verifier-scope-20261104` 已分别指向 `7f3330a1290849f88a98e8c148978c584dad1ad1`／`cee8a0b7aa8912555af2b3fce764114e5907ca96`／`7d418cdd737f7482d28513ec81ea01c52f893b2f`，即三项原工作树 HEAD（创建时间 10:27:34Z／10:43:40Z／11:01:13Z）；差量分别为 1 文件 +1/−1、1 文件 +9/−6、1 文件 +16/−7。
- 三项模板卡的采集快照在观察时点之后被重采：`collection-processes.json` 的 `observedAt` 现为 13:27:52.228Z／13:28:47.534Z／13:29:47.400Z，`registered` 771／1006／1103，`live` 均为 0，与观察时点结论一致。上文表中 10:27:31.415Z／10:43:38.255Z／11:01:10.648Z 是 13:20:10Z 观察时点读到的旧文件时间，保留不改写，是两次观察。
- 因此上文“三项模板卡没有公开结果提交”“三项模板卡…为 blocked”两条阻塞和表中三项“无公开产物／main 为 blocked”仅代表观察时点状态，已由接收端在观察后收集并更新为 review_ready，待负责人接收。五项退出结论不变。
