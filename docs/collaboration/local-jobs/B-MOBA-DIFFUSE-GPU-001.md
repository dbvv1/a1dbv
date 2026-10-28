# B-MOBA-DIFFUSE-GPU-001 · 既有运行声明与回执追溯
id: B-MOBA-DIFFUSE-GPU-001
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 3f89df2bcfcaca1dde86cc1412d1649090a09d60
result_branch: relay/b-moba-diffuse-gpu-001

## 本次目标与历史边界

本次仅追溯已发生事实，不恢复拍摄。保留原卡 ID、源身份与结果分支；kind: build 是既有分类，不授权构建或测试。
[历史卡面 e17b197](https://github.com/dbvv1/a1dbv/blob/e17b197ecf3b3d4a58d96d3b7cd759a22c2da24f/docs/collaboration/local-jobs/B-MOBA-DIFFUSE-GPU-001.md)仅供核对历史要求，其中拍摄命令与恢复路径不是本次执行指令。
[原归档 8a82480](https://github.com/dbvv1/MOBA-Like/commit/8a824802f771ab6a18381517c51966a754a20ec0)及旧 7968512 证据原样保留，不覆盖、不删除、不改写原始时间、PID、runId 或失败结论。

## 已核事实

revision-3f89df2 原归档共 16 个文件：9 个 lifecycle JSON、2 个 PNG、2 个逐帧 JSON、report.json、manifest.json、result.md。
它们只对应 baseline run-3f89df2bcfca-idle-gtjcpZ。report.passed=false、capturePassed=false；两次 frame 0 RGBA 不同。归档记载 stylized-diffuse 未执行、未补跑，无前后对比与品质结论。
原浏览器 PID 84524／父 runner 94800 于 2026-10-27T23:22:48.629Z 由自有句柄观察退出；connection/server 关闭；preview 5293 于 .822Z 拒连；lease 于 .825Z ownerMatched=true、released=true。
这些清理回执只覆盖上述原 run，不能覆盖声称的额外运行或证明全机空闲。
a1 历史卡另转述运行审查员声称两条命令复跑通过，但未经独立复核。上述 16 文件中没有额外 run 或运行审查输出；额外运行是否实际发生仍未知，不等于已证明没有发生。

## 本次允许范围（所有角色一致）

仅只读核查本卡已有、获准访问且明确定位的结构化审查结果及产物目录；允许文件清单、哈希、JSON 解析与公开扫描。不得广泛搜索私人文件系统、私人会话目录、对话或内部 transcript；没有明确定位就报告缺口。
适用于主执行者、所有子代理和所有审查员（包括 runtime reviewer）：禁止启动游戏构建、安装、测试、浏览器、GPU、拍摄、补跑、诊断性运行或代码改动。禁止以新运行证明旧声明。
禁止终止当前进程、关闭当前资源、删除或回收锁、变更接收端设置、换根避锁、操作桌面或键鼠。仅核已有清理证据，不执行清理。
不能确认授权或找不到既有证据时，停止相关读取并报告确切 action、target、reason、outcome；不得绕过拒绝。

## 请求补充的既有证据

1. 原运行审查结果的已公开或获准读取的明确定位，以及可安全公开的事实摘要；不要导出审查对话、transcript 或私人日志。
2. 对每次声称的额外调用，逐项列出已有 runId、开始／结束时间、sourceCommit、tree、runnerSourceCommit、sourceDirty、bundle 哈希与构建身份；不得补造缺失值。
3. 提供已产生的原 report、逐帧 PNG／JSON 及其哈希、命令退出码和原始通过／失败字段；区分 baseline 与 stylized-diffuse，区分每次调用与调用内 repeat。
4. 提供已有逐命令预检／共享租约证据、实际启动安全 flags 摘要，以及与该 runId 绑定的自有进程身份和退出事件、connection/server 关闭、preview 拒连、ownerMatched/released 回执。请求配置不替代实际 flags；原 gtjcpZ 的回执不替代后续 run 的回执。
5. 若只有审查声明而无上述原始证据，明确标记“声明未经原始证据验证；额外运行及其清理未知”。若原审查输出也无法定位，单独列为缺口，不推断运行存在或不存在。

## 导出与保全

只导出脱敏事实摘要和经公开扫描确认安全的既有原始 capture 产物；禁止完整 argv、wsEndpoint、nonce、私有路径、DEBUG 原日志、凭据、对话或 transcript。
原 16 个文件及更早证据逐字节不变；核对新增补充与原档的身份和时间关系，保持各 run 独立。不要为脱敏覆盖原证据；不安全文件不导出，仅列缺口。
新增产物的唯一写入范围为 docs/quality/captures/B-MOBA-DIFFUSE-GPU-001/revision-3f89df2/review-evidence/；原卡只更新“当前结果”，不改历史证据。原 16 文件及旧档均不得改动。
接收端可按原工作流向原 result_branch 发布经扫描的脱敏追溯证据，并更新原卡“当前结果”；本草稿的准备本身不触发派发或外部写入。
本次回传事实、可公开定位、校验结果、缺口和冲突；不宣布 GPU／品质通过，不把审查 pass 或 openIssues 为空当作验收。最终验收、是否重新授权 GPU 运行和产品发布仅由 dot-B 决定；本卡不授予任何重启或发布产品的权限。

## 当前结果

- 按只读边界完成已发生事实追溯：原归档 15/15 哈希复核一致、原始证据只支持 blocked；审查员“两条命令复跑通过”的声明无可定位原始证据，已标记“声明未经原始证据验证；额外运行及其清理未知”，未补造任何缺失字段；openIssues 为空。新增 review-evidence/README.md 与 traceability.json，未改动原 16 个文件及旧档。
- 产物：[f533d6f](https://github.com/dbvv1/MOBA-Like/commit/f533d6f3b4b59b61e71369143dac6c150ea08216)，分支 `relay/b-moba-diffuse-gpu-001`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：由 dot-B 依据追溯结论验收，并决定是否重新授权 GPU 运行；本单元不再继续。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
