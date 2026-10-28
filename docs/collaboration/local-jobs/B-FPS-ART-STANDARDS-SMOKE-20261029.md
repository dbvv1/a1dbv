# B-FPS-ART-STANDARDS-SMOKE-20261029 · 三件环境标准件旁置接入验收
id: B-FPS-ART-STANDARDS-SMOKE-20261029
owner: dot-B
kind: build
status: revision_requested
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 9a5c02fc6b51c852d567cc0d4d28bf388fc41f4b
result_branch: relay/b-fps-art-standards-smoke-20261029

## 目标
本轮仅对原 smoke 的历史记录做 review 返工：保留已核实的第二轮功能证据，补齐首次失败和两次调用之间的实际记录，纠正停止边界说明。不是重新执行原 build 卡；本节替换原执行目标与命令授权，禁止重新启动任何浏览器、GPU、预览服务或 smoke，不恢复任何旧已取消任务，不安装依赖、不重建、不重拍、不改源码。

## 按哪个 Skill／规格
按 game-quality-pass/references/capture.md、细则§7和本目录状态规范，仅读取已有本地日志、进程采样、输出目录与公开产物；revision_requested 只领取这次记录修订，不能重新运行旧卡命令。原执行规格以 a1dbv ddd95bbd1622ca4fbd9ae77dd11d43cb853392a2 的本卡为历史记录，不再执行其中命令。
固定源仍为 9a5c02fc6b51c852d567cc0d4d28bf388fc41f4b / tree 7cb322681201244e6e9f252ecf21bf63a037ac78；已有结果 18d9a1bfaaff1c1594e473ac2e98afd06449f9cc 的第二轮两路功能报告不删除、不伪造重算为新运行。已知第二轮事实与执行边界判断分开记录，不用后一次成功覆盖前一次失败。

## 写入范围
仅在原 result_branch 的 docs/quality/smoke/B-FPS-ART-STANDARDS-SMOKE-20261029/ 下补历史证据及纠正 manifest / exit-evidence 的说明、更新受影响文件 hash；保留原截图和功能报告。原始文件不能覆盖或修改；公开副本脱敏，保 renderer 原始公开字段。只回写本卡当前结果，不合案例 main、不部署、不改其它卡或锁。
缺失的原始记录直接写 unknown / 未留存及其影响，不重造时间、PID、目录、renderer 或退出证据；不得为补证重新执行任何原操作。

## 怎样算做成
以下修改要求逐项回应并给精确文件路径；可从历史记录核到的附证据，核不到的明确未知。独审检查公开副本与原始记录来源、hash和边界说明，交回 review_ready；该状态不是整卡合规通过或美术定稿。无法补齐亦交回真实缺口，不发起替代拍摄。

## 修改要求
1. 首次调用（20:39:27.251–20:43:30.074 UTC、exit 1）补原独占目录/run-id、manifest、已存在的两路报告与完整 raw WebGL renderer/vendor/version；软件 WebGL after 等待 phase=over 超时的原失败记录保留，不能只放成功轮。若本来没有 manifest 或字段，明确未生成/未留存，不追造。
2. 补首次失败后所属 preview 的停止/端口关闭、父链退出记录，以及第二次 20:44:59.647 UTC 启动前实际串行核验的时点和范围。已有 browser PID 96172/50524 退出 0 不能替代 preview/父链退出；第二轮结束后的总清理也不能证明两轮之间已清理。缺失直接未知。
3. 纠正 exit-evidence 的“no renderer switch”及“prescribed”免责解释：首次软件 WebGL 失败后换完整 Chromium 并得到 GPU 成功，违反原卡“非gpu保结果、不切换重试”的停止边界；允许预先指定既有 executable 不覆盖该停止条件。不得据成功抹去执行违背；以后遇到此条件保结果并停对应动作。
4. 保留第二轮独立事实：20:44:59.647–20:48:20.230 UTC exit 0、两路 passed、after ready/active/3件/2396tris/4calls/123604bytes；12项hash和21项构建hash已核。headless/sandbox、无GUI、串行及退出仅按已有证据范围表述，跨任务全局GPU独占仍未证实。
5. 修正“openIssues为空／仅剩六回合与人工验收”：过程缺口之外，墙角/掩体/选定灯具/正常战斗机位、非作者视觉优劣、有意义二改、GPU性能仍待验；初始部署菜单遮挡截图不能验三件品质。本次只修记录，不新增这些拍摄或测试。

## 当前结果
- [18d9a1b](https://github.com/dbvv1/FPS-Like/commit/18d9a1bfaaff1c1594e473ac2e98afd06449f9cc) 的第二轮固定源两路功能证据已核实，可供旁置交付技术判断；未将整卡执行合规或三件美术品质判通过。
- review 返工：仅补历史记录与纠正文案，按修改要求1–5处理；无须且禁止重跑浏览器/GPU/smoke。首次失败留档和两轮之间清理/串行证据未齐，缺失如实未知。
