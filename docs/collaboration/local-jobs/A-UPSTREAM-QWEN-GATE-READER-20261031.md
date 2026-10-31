# A-UPSTREAM-QWEN-GATE-READER-20261031 · 用真实 Qwen 候选验证投稿前判断入口
id: A-UPSTREAM-QWEN-GATE-READER-20261031
owner: dot-A
status: running
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 8da233c89e9bd92d4f3bb4f0d6b5fa11ebba5275
result_branch: relay/a-upstream-qwen-gate-reader-20261031
page: docs/decisions/upstream-contributions.md@8da233c89e9bd92d4f3bb4f0d6b5fa11ebba5275
## 目标与输入
新读者只照附入页，为 QwenLM/qwen-code 的真实 #15741 旧候选决定当前下一步；输入是 experiments/candidate-reset-recovery/qwen/change.patch 与 experiments/candidate-reset-recovery/manifest.json，仅取 qwen 条目及相关 payloads。该补丁另在固定 3a4a07736299dc2cfa002346dbc4eaf8fd519625 核过 build／typecheck、409 项相关测试和 bundle；完整 preflight 未过，原完整测试因 Unix socket EPERM 停止，不重跑。
读者此前未读本页、未参与本题判断；先核附入的完整页面与指定版本一致，缺页报入口卡点，不自行取回后冒称附入。不得读本题旧判断、研究、inbox、README 的补验分析或旧读者答案；以上事实是任务输入，不是投稿结论。
## 按页面执行
只读当前 CONTRIBUTING、AGENTS、模板、issue／关联 PR 及实际代码；核所读提交与时间，由读者自行选下一步。可取公开源码到本任务隔离目录，不运行候选、产品、模型或测试，不创建 issue／PR／fork，不签协议；无材料或明确拒绝时保留具体缺口，不换入口重试。
不读私人会话、凭据、账号用量、用户配置或模型／worker 日志，不用 ListAgents，不改 receiver、权限或沙箱；不触碰四 wide、旧 reader、MODEL-EFFORT、Supabase 待批内容及被拒 socket 操作。
## 写入范围
模型只新增 docs/collaboration/local-jobs/artifacts/A-UPSTREAM-QWEN-GATE-READER-20261031/result.md，给可执行下一步、原文依据、页面卡点及尚缺决定；不改页面、补丁、其他产物或 TASKS。接收端仅另回写本卡，只推指定 result_branch，回 review_ready；不用 accept: auto、不合 main。
## 验收与节奏
非读者核完整页面实际附入、当前项目规则与代码、读者结论对应证据；页面卡点与模型失误分列。仅验投稿前判断，不当完整投稿闭环、最新代码验证或四广扫完成；check_repo、check_public、空白和提交身份检查须通过。
单元 60–90 分钟、最多 2 小时；到时交实际结果与缺口并按原协议收尾，不靠重复调用凑时。按 receiver 共享最多 4 调度；新 ID 与旧 sources 写域独立，未知历史调用不计为已退出，异常沿原调用核查，不另起重试任务。
