# B-GPU-JOB-STATUS-001 · 核原图形任务执行断点
id: B-GPU-JOB-STATUS-001
owner: dot-B
kind: build
status: accepted
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

接收 [6570f85](https://github.com/dbvv1/a1dbv/commit/6570f85720ea1e1d91c1ca3e2508032b260c41ba) 的原停止核查报告修订：已改条件性重开风险、补 MOBA ignored 采集与丢失风险、分清 14:30Z 历史残留和 a972bb5 后续两链清理；仅接收既有记录修文，未重新核查进程或产物，未知 Edge 归属及当前整机 GPU 可用性仍未知，取消任务不恢复。

## 修改要求

- 仅修原分支 `docs/collaboration/local-jobs/artifacts/B-GPU-JOB-STATUS-001/status.md`：将恢复条件中“FPS 还会重开浏览器／预览”改为条件性风险，取消任务保持取消，不建议用新编号重开原验证。
- 用已有审查记录补“已有成果”与丢失风险：MOBA ignored `outputs/qa-session/` 另有 23 段 webm、5364 JPG、1155 PNG，约 878MB；不能只列 16 张 PNG 和 quality.md。记录原核查时点，不能冒称现在重新清点，不能由此授权清理或删除。
- 保留 14:30Z 历史事实；补链接说明后续 a972bb5 已核两条 FPS 预览链退出。未知 Edge 归属和整机 GPU 可用性仍未知，不改为已释放。
- 不读取新会话、不查询或停止进程、不启动浏览器／GPU，不改原游戏卡或产物；文档差量、公扫通过后回原卡 review_ready。
