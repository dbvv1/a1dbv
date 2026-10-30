# B-EXACT-ARTIFACT-RECOVERY-20261030 · 既有代码产物只读核查
id: B-EXACT-ARTIFACT-RECOVERY-20261030
owner: dot-B
kind: build
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: b79cd6a04da5a7ed6ccf224a481c8f79b2ef118d
result_branch: relay/b-exact-artifact-recovery-20261030

## 目标
核接收端管理的 FPS-Like、MOBA-Like 仓库及其既有任务产物中是否已有下列原件，避免等待原执行环境时重复制作。只核原件，不重做候选，不恢复任何旧任务，不发布游戏。找不到也是有效结果，不能把重新生成内容当原件。

## 按哪个规格
按 operations §2.2–3、local-jobs README 的只读恢复规范，先 fetch a1 main 与负责人分支并查重；同一目标已有活跃核查则只回归属与进展，不另启。接收端须先核自身实际在途调用、可用槽及全局停止条件；全局停止、资源归属不明或无法确认安全独立执行则 blocked，不调用模型、不清锁、不修改接收脚本或计划。A 卡的连续失败与 termination_unconfirmed 均不授权本卡重启它们；不占用未知或他人槽位。

固定目标（现有游戏工作树只读，不 checkout、fetch 缺失对象或改 ref）：

| 项目 | 原提交 | 原 tree | 已知 bundle SHA256 |
|---|---|---|---|
| FPS-Like guard | `4ff5202a4022f691b5f6620e641f0977c7055fd7` | `9b104237bd2ab0073307e969afa51d26ab7a0f11` | `05035cd674f13bfe2dfe996eb75df7e29474698c57471dcc7d8f0496e2a800a6` |
| MOBA-Like feel | `d5b5c15188620554c89634ae7ba6475c6b1bd95d` | `b29bb33822319220eae42346549009f7284c6599` | `624697f048acc3fa6af7690f8b364fffbc8cae78c75da68d117cfae8e97805f4` |

仅在接收端已登记的这两个项目仓库及它们既有任务产物目录内查 Git 对象和 bundle；不要遍历用户目录、私人文件、凭据、配置秘密、模型会话或整盘搜索。可只读 cat-file、rev-parse、bundle list-heads／verify 及文件 SHA256；不执行候选代码或 bundle 中脚本，不解包覆盖工作树。读取拒绝立即停该入口，不换身份或路径绕过；不访问原云、不重试云调用、不联网取缺失对象。

## 写入范围
仅 `docs/collaboration/local-jobs/artifacts/B-EXACT-ARTIFACT-RECOVERY-20261030/result.md`；接收端按协议另回写本卡。报告只含公开仓库名、原提交/tree、校验结论、产物相对位置与时间，不含本机绝对路径、账号、原始敏感日志或私人会话。游戏仓库、旧任务与所有既有原件只读，不上传 bundle、媒体或游戏文件，不复制秘密。不使用浏览器、GPU、GUI、键鼠，不安装软件或增加权限。

## 怎样算做成
每个目标分别返回 found／not_found／blocked：found 必须核提交真实 tree 与表格相符，说明对象完整性检查范围；bundle 须同时比对 SHA256、list-heads 和 verify 结果，缺前提如实列出，不冒称完整。只给接收端管理根下的安全相对位置以便后续 dot 接收；not_found 写已核项目范围而非断言整机不存在；blocked 写具体缺项、错误类别和恢复条件。报告由非作者核对，脚本跑 check_repo、check_public、空白与 noreply 身份检查，推指定结果分支并回 review_ready；不用 accept: auto，不合入游戏默认分支或部署，不沿用旧验收。

这是一次有限清点，不循环等待原件出现。单次最多两小时；遇超时、失败或终止不明停止后续并按原协议 blocked，不重发、不自建续搜卡。保留已完成报告，只有本卡自有且归属确认的调用可按接收端原停止协议收尾；未知进程不杀。ready／running 标签与排队不算执行，报告须区分实际检查、未检查与等待。

## 当前结果

已接收 [9cb1cd5](https://github.com/dbvv1/a1dbv/commit/9cb1cd52bac3bc5725417f92dd45686ef87f5d7a) 的[登记范围查找报告](artifacts/B-EXACT-ARTIFACT-RECOVERY-20261030/result.md)：FPS guard 与 MOBA feel 均 not_found，未取回原件；无 bundle 故 SHA256/list-heads/verify 未运行。报告内恢复条件已按既有授权修正，等原 bundle 可达；接收端未提供 PID／exit 证据，实际进程退出、全局停止与空闲槽仍未知，不重派本卡。
