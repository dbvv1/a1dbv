# 接回审批修复：第一轮完成后，还要能继续下一轮

**🧪 审批相关补丁先验“回答一次 → 完成本轮 → 再做一轮 → 正常退出”，同时检查会话里的实际消息。** Goose v1.57.0 的 ACP approve 模式暴露了一个具体反例：实时审批已经回答，持久化阶段又画出同一张卡，再回答就报 `tool confirmation request was already answered` 并退出。已有下游补丁在本次 Linux 合成 ACP 消费者中消除了重复，两轮继续和正常退出均完成。适合接收同类流式事件／持久化修复；真实 provider、取消恢复和其他平台仍需各自验收。

## 这次接收了什么

输入是真实工作坊故障报告和已经存在的下游补丁，不是重新发明一个问题。下游接收分支固定于 `action-state-group/devcon-workshop` 的 `c951beea403485d0e0017545b5f8b69fb0bc9fcd`，补丁针对 Goose v1.57.0（`30bba95105e59bc3e7df624cf6b4d433690cfe12`）。本次保留补丁原意，只增加内部消息与持久化回归测试。

源代码将带 inference 元数据的 provider 消息实时发送，再将同一消息持久化。补丁跳过这些消息的第二次审批事件发送；状态机自己生成、没有 inference 元数据的审批仍在持久化后发送。接收重点因此有两边：旧卡不能再次弹出，内部审批也不能被一起删掉。

原作者的 PTY 验证覆盖一次 Allow，看到完成后观察五秒并终止；原 mock 忽略拒绝选项。本次非作者另写合成端，扩为连续两次权限、第二轮一次新权限，再走 `/exit`；另让 Reject 真正映射为 mock 的失败状态。所有工具均是合成事件，不执行真实命令。

**来源**：[真实故障 #13273](https://github.com/aaif-goose/goose/issues/13273)、[已有下游 PR #17](https://github.com/action-state-group/devcon-workshop/pull/17)、[固定补丁](https://github.com/action-state-group/devcon-workshop/blob/c951beea403485d0e0017545b5f8b69fb0bc9fcd/patches/goose-acp-approval-card-once.patch)、[Goose 原状态机](https://github.com/aaif-goose/goose/blob/30bba95105e59bc3e7df624cf6b4d433690cfe12/crates/goose/src/agents/state_machine/session.rs)。核实 2026-11-02。

## 可照用的接收步骤

1. **固定已有实现与保留行为。** 记录受验源码、二进制和锁文件；先读项目当前贡献规则。已有补丁先接收，不再派一份同题实现。
2. **从真实用户入口驱动。** 本例使用实际 CLI 的 `goose run --recipe <recipe> --interactive --no-profile`，recipe 指向隔离的合成 ACP 端；通过 PTY 操作 Allow／Reject。给每个权限、工具调用和回合独立标识，逐项核对，而不是只数总请求。
3. **让消费者走过故障之后。** 第一轮连续两个权限，收到可见完成后输入第二轮，再处理新权限，最后 `/exit`。保存原 PTY 与 ACP 双向消息；自然退出码和最后一次状态分别核对。
4. **回读真实落地。** 只读会话 SQLite，核第二轮用户输入、两轮 assistant 完成消息及原请求身份。对内部生成的审批另跑回归，确保修复没有靠屏蔽所有审批实现。
5. **接收检查结果，不修饰结果。** 解析器报错先回看原字节。本次拒绝场景的第一张卡夹入了箭头键回显，旧正则漏识；保留首次失败，只调整按卡片区段提取身份并重读原证据，未重跑 CLI。产品结果、解析问题和构建环境问题分别记录。

| 实际入口与落地 | 官方 v1.57.0 基线 | 接回候选 |
|---|---|---|
| Allow：第一轮两个不同权限 | 两个已回答后又出现第一张卡，回答时报错 | 每个权限只出现一次 |
| Reject：选项与合成结果 | 两个拒绝已传递，随后同样重复旧卡 | 三个拒绝均传递为 `reject`，mock 终态为 `failed` |
| 第二轮与正常退出 | 未进入第二轮，exit 1 | 两轮完成，实际发送 `/exit`，exit 0 |
| 实际 SQLite | 各 9 条消息，缺第二轮 | 各 15 条消息，第二轮用户输入和两轮完成均存在 |

允许候选运行于 05:48:03–05:48:09 UTC，拒绝候选运行于 05:48:15–05:48:21 UTC。负责人及非作者审查者均回读原协议、终端和数据库，未把断言数或调用数当作效果指标。机器可读输入、版本、时间与结果见 [results.json](results.json)。

## 检查与采用边界

- **构建已通过：** Linux x86_64，Rust 1.99.0，原锁文件和默认 features；候选为无调试符号的 dev 构建，基线为官方 Linux release 二进制。首次构建因 libclang 缺 `stdbool.h` 搜索路径失败，使用现有 GCC builtin headers 的 bindgen 标准参数后构建成功；未改依赖源码或关闭功能。
- **内部回归已通过：** 新增两例分别核 provider 审批只持久化、内部审批按批次顺序发送且普通消息只持久化，连同原 session 回归共 3 项通过，2,188 项未选入。格式检查已通过；goose crate 的 all-targets Clippy（`-D warnings`）也已通过。完整测试套件、真实 provider／工具、取消恢复与其他 OS 未运行。
- **隔离范围：** 每组新建 HOME、配置和会话目录，环境白名单，无凭据、旧会话或真实 provider；关闭遥测与 keyring。默认 CLI 仍尝试拉取公开模型元数据，该请求实际失败，因此不宣称零网络运行。
- **上游状态：** issue 仍是 Inbox，本次依项目允许的 local/exploratory 例外接收；未投稿。下游 PR 合并只说明工作坊采用，不能当上游发布。当前默认分支所核 `0909288ed4a2053b10540bfcf6dbee3b0de66126` 尚无该 guard。本实验不改变长程路线的 🟡 状态或推荐默认。

**依据**：[贡献规则的本地探索例外](https://github.com/aaif-goose/goose/blob/0909288ed4a2053b10540bfcf6dbee3b0de66126/AGENTS.md)、[现有下游运行材料](https://github.com/action-state-group/devcon-workshop/tree/c951beea403485d0e0017545b5f8b69fb0bc9fcd)，本仓真实消费者与独立源码／证据审查，核实 2026-11-02。

原始产物已保全为完整源码＋补丁＋消费者证据归档：129 件，315,092,917 字节，SHA256 `c7f05c46dd8af0c088336200d459cabc96f33b35315801ae439e9cb418194316`；其中基线 2,530 个 Git blob 逐一核对一致。公开页只含结果投影，未上传会话数据库或执行环境文件。
