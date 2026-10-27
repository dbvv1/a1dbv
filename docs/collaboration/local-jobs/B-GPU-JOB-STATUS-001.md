# B-GPU-JOB-STATUS-001 · 核原图形任务执行断点
id: B-GPU-JOB-STATUS-001
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5b531ae6c1e74e78c2359929148e9e4cedb6982e
result_branch: relay/b-gpu-job-status-001

## 目标
只读核实取消是否实际生效：B-FPS-SHOT-QUALITY-001（08:55:49 UTC领取）与 B-MOBA-CLIENT-SMOKE-001（08:58:18领取）的原调用现在实际执行、等待、结束还是受阻。11:14 UTC 仍只有 running 与旧结果文字，两个结果分支不存在；这不能证明进程正在运行，也不能证明已经停止。

## 按哪个规格
按 operations§2.2／§3 的恢复规则，只读接收端自身这两项任务的非敏感状态记录、关联进程是否存在／开始时间／最后进展和既有产物；区分领取与实际开始，不从进程名猜所属。先核原调用，不重新派发、重开浏览器、终止进程或修改任何状态。只看执行元数据，不读模型会话正文、配置秘密或用户文件；没有安全可读状态就明确缺口。本项不占 GPU，也不改接收端脚本或计划任务。

## 写入范围
仅 docs/collaboration/local-jobs/artifacts/B-GPU-JOB-STATUS-001/status.md，接收端另回写本卡结果；原两任务及其他文件均只读。公开只留任务ID、UTC时间、实际阶段、进程关联是否证实、已有成果和恢复条件，不提交本机路径／账户／原始日志。

## 怎样算做成
两项各给一行可核状态及依据、是否仍占用图形会话，明确两原调用与任务自有图形资源是否已经停止／释放；B-CASE-GPU-BASELINE-001 同样已取消，不得进入；不把标签当进程，不把未知写成闲置。回固定原结果分支与 review_ready；遇读取权限或缺记录直接报缺口，不为取证扩大权限。本卡仅后台只读核查，不打开浏览器／GUI、不控制键鼠；原调用的停止由接收端按 cancelled 处理，禁止重开验证。

## 当前结果

- 两项图形任务均已不在执行：FPS 于 12:17:55 被停止、MOBA 于 11:03:18 两小时超时结束，二者远端均无结果分支；未发现可归因的浏览器/GPU 进程，但 11:33Z 起的 Edge 窗口归属未知，FPS 停止前派生的 11 个预览进程（4173/4174）仍存活。审查未通过，openIssues 2 项：第 45 行把『FPS 会重开浏览器/预览』写成必然（应改为条件句）；第 31/48 行漏记 MOBA ignored 的 outputs/qa-session 下 23 段 webm、5364 JPG、1155 PNG（约 878MB），需补入并扩大产物丢失提示。
- 产物：[1ff1630](https://github.com/dbvv1/a1dbv/commit/1ff1630ebe60107768d1886e099ef8563df9a696)，分支 `relay/b-gpu-job-status-001`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查未通过或未完成。
- 下一步：接收端按任务要求回写本卡为 review_ready 并推送 relay/b-gpu-job-status-001；同时决定 FPS 残留预览进程与 MOBA 未提交产物的处置；建议先按 openIssues 修正 status.md 两处再交付。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
