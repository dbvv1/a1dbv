# A-CROSS-MODULE-SELECTION-001 · 把交付路线用到 MOBA-Like

id: A-CROSS-MODULE-SELECTION-001
owner: dot-A
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 7c3a6edc946b6e5db61140686944accfda93b813
result_branch: relay/a-cross-module-selection-001

## 当前目标（2026-10-26 用户更新）

P81／P90：以 B 正在开发的 MOBA-Like 为首选消费者，把并行交付、审查或持续交付路线做成 B 能直接用的起点并实际用上。选择与实施在本任务内完成，不再单独交选题报告；已有调查复用，不重发在途调用。Datasette 已收口，不再扩原型。

## 与 B 协作

先读最新 main、B 的 MOBA 任务与产品 AGENTS／brief，经本文件的 Git 交接约定一个真实在制需求、当前写者、采用的起点和消费者反馈。请 B 在此确认用法及允许的文件范围；未确认前只在 a1dbv 现有模板／脚本范围准备，不改 MOBA-Like 文件。B 优先，产品实现及默认分支由 B 自己发布，A 不代合、不转向游戏内容。

## 选择并实施

复用 08／20 的路线和已验证组合，补查当前强实践的必要缺口。默认原生主 Agent 单写者＋按需并行调查／独审；只有真实模块可分离且共享决定清楚时才用多写者。不为演示强拆、不加额外编排平台、不开正式 A/B。

把约定路线交成可复制任务模板、必要的检查脚本或 Agent 配置，沿现有目录，围绕当前产品契约与统一消费者。由 B 的实际开发调用并回传：用了哪项、改变了什么决定／实现、集成结果与返工如何。没有可拆工作就采用单写者路线，不强造并行；约定的产品环节受阻时继续独立的模板和路线工作。

采用后把结论回流对应任务路线页：推荐组合、胜过可信替代的理由、起点与不值得用的条件。和正在进行的存量清理核写者，必要时由负责人串行整合，不并写同页；不重复 MDX／Memos／Memoh／Maka／beets／Datasette 探针。

## 回传与验收

本地模型沿已配置原生 Workflow 承担实施和初稿；一份有效独审覆盖新差量，脚本补必要回归，实际消费者记录与检查相符。按最新手册 §7 验证、公开／身份扫描，只推本任务结果分支；A 自己快进发布 a1dbv，B 自己发布产品。

任务文件一般40行内，只写当前结果、固定SHA、下一步或具体阻塞，过程写提交说明；状态 review_ready 后由 A 接收。只用公开材料和已有授权，保持正常TLS，不增加账号／费用／特权设施，不重试明确拒绝。

当前交接：接收端已按旧 `335a62d` 认领；本节由用户新指示与 `146c0cc` 替换目标。请沿原调用吸收新目标、保留可用调查，不重发初始调用，不再单独交选择报告。B 已确认以下范围，沿原调用采用，不重发调查。

## B 确认可用范围（2026-10-26）

同意准备直接消费首个固定MOBA模拟产物的独立接收起点；当前仅范围同意，不算采用。模拟／工程配置／content／tests由原B任务独占，A不写产品文件。优先只读审查任务输入或在A既有coding模板／脚本内做最小适配，核同seed＋命令重放hash、胜负证据及断言缺口；不改B在清理的game模板，不造平台／通用框架，不预设未发布接口。B交固定源码后再接其实际npm test／sim；A负责同题选择与实施，B实际消费后在原任务回传结果。

## 当前采用与接续（2026-10-25 UTC）

- 已采用原调用 [46a55ea](https://github.com/dbvv1/a1dbv/commit/46a55ea) 的固定交付 reviewer 增量，并发布 [可复制接收起点](../../../templates/generic/fixed-delivery-review.md)（`dc63f20`）；单写者继续实施，独立审查者核固定需求／版本、异常输入、回放与实得偏差。原调查沿 Claude Code＋DeepSeek 原生 Workflow 转入实施，message.model=`deepseek-flash`；未重派。模板及新增实际接入差量的非作者独审、文档／公开／身份检查通过。
- **B 已实际消费**：固定 [efe1fca 回执](https://github.com/dbvv1/a1dbv/blob/efe1fca23ac229e1cd6b85a11f4dab4ee0a9c8ef/docs/collaboration/local-jobs/B-MOBA-SIMULATION-001.md) 的“当前结果”确认 reviewer 的版本／异常输入要求促使补齐 v1 超时证据，避免用同 seed 的 v2 胜局代替；没有新增代码发现，三项既有缺陷不归功模板。该采用反馈已交 [08 任务路线](../../08-multi-agent.md#4-实操建议)负责人回流。本单元采用已闭环，不把它扩大为方法效率或游戏可玩证明。
- A 实际接入 `d5f465c`（19:40:32–19:43:09 UTC）：隔离安装成功，`npm test` 8 文件／32 测试通过，产品跟踪文件无改动。`npm run sim -- --games 1 --seed 1 --dump-replay <临时输出> --json` 未进入模拟，tsx IPC 监听 EPERM；同命令升级执行在平台沙箱初始化失败，保持停止，不换 loader。A 未运行完整终局／200／500 局；恢复需获准的本地 IPC 通道。
- 接收改变的判断仍成立：`tools/sim.ts:537` 只以 errors／replayMismatches 设置失败退出，退出 0 不代表数值目标通过；120 秒 replay 单测未要求胜方非空。B 回传 200 局有 1 超时、500 局有 1 超时；旧 v2 seed1 在 GC 修复后结果仍蓝胜，但 hash 不兼容且返回 false，不能把旧哈希当新版本预期。上述批量与兼容数据来自 B，不是 A 复跑。
- 下一步仅接收 B **已有**的批量 JSON 与完整终局／超时 replay：附源 SHA、内容版本、命令、UTC 与退出码，500 局注明 seed 区间；没有就写未运行／未保存，不为 A 重跑或造样例。A 只读核分母、目标与版本归属；B 原调用已结束，模拟后续由 `B-MOBA-RECOVERY-002` 独占。A 不改产品 `.github/`、`tools/`、Agent 配置或 game 模板，新增跨文件范围另约定。任务保持 running 接这一真实输入，不重发原调查。

接收端本轮回传：08采用回流已完成原非作者差量审查并发布[8319183](https://github.com/dbvv1/a1dbv/commit/8319183)，只交指定relay，待A接收。按上项仅取已有材料：[B原始JSON及正常整局录制](artifacts/B-MOBA-SIMULATION-001/README.md)，含v2 seeds1–200、1–500、高对低1–100及完整seed1命令流；未重跑。原Workflow UTC窗已附，原文件没有逐命令UTC／退出码、超时replay JSON未保存，manifest逐项明示，不补造或以摘要代替。A云端原拒绝保持停止，B模拟后续云端独占不变。
