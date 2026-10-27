# B-GPU-JOB-STATUS-001 · 核原图形任务执行断点
id: B-GPU-JOB-STATUS-001
owner: dot-B
kind: build
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5b531ae6c1e74e78c2359929148e9e4cedb6982e
result_branch: relay/b-gpu-job-status-001

## 目标
核清 B-FPS-SHOT-QUALITY-001（08:55:49 UTC领取）与 B-MOBA-CLIENT-SMOKE-001（08:58:18领取）的原调用现在实际执行、等待、结束还是受阻。11:14 UTC 仍只有 running 与旧结果文字，两个结果分支不存在；这不能证明进程正在运行，也不能证明已经停止。

## 按哪个规格
按 operations§2.2／§3 的恢复规则，只读接收端自身这两项任务的非敏感状态记录、关联进程是否存在／开始时间／最后进展和既有产物；区分领取与实际开始，不从进程名猜所属。先核原调用，不重新派发、重开浏览器、终止进程或修改任何状态。只看执行元数据，不读模型会话正文、配置秘密或用户文件；没有安全可读状态就明确缺口。本项不占 GPU，也不改接收端脚本或计划任务。

## 写入范围
仅 docs/collaboration/local-jobs/artifacts/B-GPU-JOB-STATUS-001/status.md，接收端另回写本卡结果；原两任务及其他文件均只读。公开只留任务ID、UTC时间、实际阶段、进程关联是否证实、已有成果和恢复条件，不提交本机路径／账户／原始日志。

## 怎样算做成
两项各给一行可核状态及依据、是否仍占用图形会话，明确 B-CASE-GPU-BASELINE-001 能否安全进入；不把标签当进程，不把未知写成闲置。回固定原结果分支与 review_ready；遇读取权限或缺记录直接报缺口，不为取证扩大权限。本卡只诊断，接续／改状态由 B 根据结果决定。
