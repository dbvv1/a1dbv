id: A-MIGRATION-HERMES-V2-CONSUMERS-20261113
owner: dot-A
status: accepted
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 2a2cfe336d11b7e9f4e2198696d2f7563ce14787
result_branch: relay/a-migration-hermes-v2-consumers-20261113

## 读者能力与真实目标
推进 README「遗留代码与大迁移」🟡：Hermes 的 Anthropic 0.125→2.x 候选正在云端独立实现，先核真实调用链，避免只修主 adapter、漏掉辅助请求或认证路径。此卡只做源代码消费者核对，不修改候选、不重复实现，不算新读者或运行通过。

## 固定材料与范围
公开 Hermes main c9b20d7bc08dec1e10779a06d7d9073bc6e7e418，https://github.com/NousResearch/hermes-agent 。读取本项目 AGENTS／CONTRIBUTING 和对应文件，不读个人设置、日志、账号或公司材料。公开需求 #142796 仍 open；#118652 是 1.x 在途补丁，不重做它或另发上游通信。
只新增 docs/collaboration/local-jobs/artifacts/A-MIGRATION-HERMES-V2-CONSUMERS-20261113/result.md。接收端可回写本卡。不得修改任何 Hermes 源码、a1dbv 页面／测试或其他卡；不运行模型或真实 API，不安装／更新依赖，不访问私人会话，不接管设备。

## 清单与验收
1. 在隔离源码副本固定上述 SHA；只取公开源码，记录实际读取的文件/符号，勿用当前 main 代替固定输入。
2. 从 agent/anthropic_adapter.py、agent/auxiliary_client.py、agent/anthropic_message_convert.py、agent/azure_identity_adapter.py 追实际调用与现有测试。按主请求、辅助请求、copy／with_options、API-key、token／Entra、Bedrock/Foundry 分行，列是否经过该适配层，输出类型与实际 SDK client；无法确认写缺少入口，不猜。
3. 核三个参数 temperature/top_p/top_k、user-role citations、X-Api-Key/Authorization、httpx/httpx2 Timeout/client 的生成点。每个命中给文件/符号/固定行链接和原有测试入口；仅字符串出现不算可到达请求。保留不受新API影响的直接HTTP路由及旧版本header，不建议全局替换。
4. 阅读官方 SDK v2.3.0 MIGRATION.md 与其指向的 API 2026-10-21 迁移说明，以及 #142796 原帖。只提炼会改变候选验收的契约；标明静态推断与明确源码事实，不能把源码核对写成运行成功。不要向官方/维护者发消息。
5. 非作者独立核至少主/辅助/认证三条链的文件和引用；报告潜在遗漏、可直接运行的原项目测试命令（未运行须明写）与还缺的产品验收。check_repo/check_public/git diff --check，通过后 review_ready，不自动合main。

## 续接
普通单元最多2小时，共享最多4并发、1GPU；本卡不用GPU。输出可供云端实现者当轮核对并决定测试范围，不决定升级默认或推荐。若固定源码不可取，交具体错误，不换凭据、不安装或开权限。只有实际工具/输出算执行；ready/claimed不算。

## 当前结果

- 完成 Hermes 固定提交 c9b20d7 的 Anthropic SDK 2.x 源代码消费者核对，新增 result.md（187 行）。确认四个失效层：API-key 路由的 Authorization: Omit() 会删除唯一认证头；temperature 生成点与 2.x 方法签名冲突（旧 thinking 路径与辅助请求）；httpx.Timeout/httpx.Client 被 2.x 构造拒绝；user-role citations 入口存在但仓内无生产者。另记录 Bedrock 4.6 及以下版本策略冲突、直接 HTTP 路由保持旧版本头不需全局替换、Apache 2.0 许可。仓库检查 check_repo 退出 0（971 文件）、check_public --staged findings 为空（退出 2 仅因既有 54 个二进制条目跳过，本文件不在其中）、git diff --cached --check 退出 0。未运行 Hermes 测试与真实 SDK 请求（任务禁止装依赖），命令与未验项已明确写入文中。openIssues 为空。
- 产物：[3012e3b](https://github.com/dbvv1/a1dbv/commit/3012e3b0b8f55516b582b523db7af7f2f136bdc2)，分支 `relay/a-migration-hermes-v2-consumers-20261113`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；独立审查通过。
- 下一步：交负责人接收并提交；后续测试范围与未验项由云端实现者按 result.md 的测试命令和产品验收清单执行。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 负责人接收
接收 3012e3b0 的固定源码消费者矩阵；负责人重新取得四个源文件并核 SHA256、主/辅助/Omit/Entra 链。仅接收静态事实，不采用删非默认采样或覆盖 API 版本的未验证建议，不作为运行或全产品升级证据。
