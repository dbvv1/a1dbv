# Superpowers：跨 worktree 接回真实补丁，不能只信 complete

**🧪 现有 main 在正确目标 cwd 已能完成 helper 交接；只需解决控制者 cwd 不固定时，再评估尚未合入的 `-C` 候选。**
**⛔ 本次接收的测试摘要修复 #2348 不能完整采纳：Linux C.UTF-8 下原测试仍失败 3 项，真实 Node 默认／spec 输出仍被记成 duration。**
**review package 界定了已提交代码，不包含充分验收证据；ledger 的 complete 也可能只是零测试或全跳过命令退出 0。**

## 本次实际接回了什么

官方 `obra/superpowers`（MIT，发现时约 31 万 Star）的真实未完成工作有两层：#2606 为跨 worktree helper 增加目标目录入口，#2607 修正文稿中的调用位置；另一个独立的 #2348 修复 Node 测试计数被耗时行替代的问题。本次接收原 #2348，不另造实现，也不把两个路径 PR 混进目标代码。

固定 main v7.0.1、两路径 PR 及其共同 merge-base；#2607 已包含 #2606 的代码，独有增量是文稿和 helper 引用结构检查。源目录只供读取。新目标仓库固定在 #2348 原 base，建两个真实 linked worktree，分别应用相同原补丁；计划留在 main，控制者从第三个无仓库目录工作。新消费者实际走完：

```text
固定目标与计划 → workspace / brief / task-start
→ 原补丁应用 → 实际检查 → 仅两原文件本地提交
→ task-done → review-package → 非作者核代码包、原输出和退出码
```

两个代码包只含 `task-done` 及其原 shell 测试，均为 80 行新增、1 行删除；正文与各自 `BASE..HEAD` 的 Git 净 diff 逐字节相同，两目标 tree 一致。main 的已跟踪内容和兄弟 worktree 源文件保持不变；计划是预期未跟踪输入。代码包没有运行环境、原输出或完整验收材料，非作者补读这些证据后才作出 **BLOCKED** 判断。

## 路径选择：先用已有正确 cwd，而不是先升级

| 实际调用 | main v7.0.1 | #2606 + #2607 stack |
|---|---|---|
| helper 位于外部固定源，工具 cwd 为目标 worktree，计划为绝对路径 | 成功形成正确 review package | 支持此类目标定位 |
| 控制者位于无仓库目录，三 helper 用首位 `-C TARGET` | 没有该选项 | workspace、brief、review package 均落到目标 |
| 无仓库 cwd、不传 `-C`，使用默认 workspace 输出 | 打印 Git 错误但退出 0，并在控制者目录建 workspace | 退出 2，无新默认 workspace 写入 |

这不是“main 不能跨 worktree”的结论。已有可用选择是把工具调用的 `workdir` 明确设为目标 worktree，使用 helper 和计划的绝对路径。候选只在 `sdd-workspace`、`task-brief`、`review-package` 支持首位单个 `-C DIR`；`task-start`／`task-done` 仍需目标 cwd。相对计划／输出路径在 `-C` 后相对于目标目录。

本次用白名单环境、独立 HOME／临时目录、关闭系统／全局 Git 配置和 Hook，未带入 `GIT_DIR`／`GIT_WORK_TREE` 等覆盖。`-C` 不是沙箱；`task-done` 会执行传入命令，显式 OUTFILE 的 `task-brief` 还会绕过默认 workspace 的仓库检查。这里只核自有新目录，未验证恶意链接或并发写入。

## 真正的拒收点在测试证据，而不是包能否生成

Linux x64、GNU sed 4.9、Bash 5.2.37、Node v24.22.1，解析器 locale 为 C.UTF-8。两路径下原 #2348 补丁结果相同：

| 实际 Node 输入 | 命令退出 | ledger 摘要／验收意义 |
|---|---:|---|
| 2 个成功测试，TAP | 0 | `2/2 pass` |
| 同样测试，默认或显式 spec reporter | 0 | 错记 duration，未解决计数需求 |
| 不匹配任何文件的测试 glob，TAP | 0 | `0 tests ran`，仍标 complete |
| 同一零测试输入，spec | 0 | duration，仍标 complete |
| 只有 skip 的测试，TAP | 0 | `0/1 pass`，仍标 complete |
| 同一 skip 输入，spec | 0 | duration，仍标 complete |
| 故意断言失败，TAP | 1 | 不追加完成记录 |

候选原回归套件在 C.UTF-8 失败三项：spec 计数、排除 duration、零测试 spec。源码使用 `[^[:alnum:]]*` 跳过前缀，但这个 locale 下 `ℹ` 被视为字母数字字符，模式没有匹配。将**整套解析器及测试**改为 C locale 后通过，只解释失败原因，不能用环境收窄覆盖实际验收失败。另一次只把 Node 子进程设为 C、解析器仍在 C.UTF-8，结果依旧是 duration；两种比较不能混称。

**接收操作本身也出过错。** C-locale 诊断曾误复用主任务编号，追加了 complete；原行和纠正文均保留，不能拿它批准候选。最终两路径重跑 C.UTF-8 主任务仍退出 1，ledger 字节未增加。这里采用的仍是既有长程路线：原输出、退出码、受验版本决定接收，状态词不能反向覆盖失败。

## 验证范围与可复用结论

路径框架的两个离线 shell 套件均通过：main／merge-base 各 25 + 12 条 PASS 断言，#2606／stack 各 40 + 20 条；stack 文稿结构另通过 14 个 helper 引用检查。这些是套件内部断言，不是独立任务数，更不能抵消目标补丁的三项失败。

其余准备失误也保留：第一次本地 clone 未带齐目标 base 对象，补取固定本地对象后恢复；空 Node 文件被当成 1 个测试，改用真实不匹配 glob 才测到零测试；把 `diff.external` 设为空字符串造成首个包生成退出 128，移除该错误设置、核本地配置后生成正确包。没有修改原补丁或删除失败记录。

**本次可借用的是目标定位与接收粒度：** 路径改变要核实际落点；包要核固定提交净 diff；测试摘要修复要喂实际 runner 输出、locale 和零／跳过／失败输入。当前不批准 #2348 完整修复，也没有理由仅为常规正确 cwd 流程升级到路径 PR。整套 Skill 的自动触发、模型效果、Claude integration、其他 OS 和完整产品工作流未验；没有加载 Skill、安装 Hook、访问真实会话或外发投稿。三 PR 精确 head 的 checks／workflows／statuses 均为 0，CI 未确认，不能称绿；本页与长程路线的 🟡 状态不变。

**依据与原文**：官方 [#2606](https://github.com/obra/superpowers/pull/2606)、[#2607](https://github.com/obra/superpowers/pull/2607) 与固定源码；真实用户问题 [#2429](https://github.com/obra/superpowers/issues/2429)、[#2342](https://github.com/obra/superpowers/issues/2342)，[#2348 讨论](https://github.com/obra/superpowers/pull/2348)中实际 Node reporter 反馈与作者解析选择；本仓真实 helper 消费及非作者接收。核实 2026-11-02。本次为定向验证，未覆盖所有社区或证明最高水平。

固定版本、命令范围和保全摘要见 [results.json](results.json)。完整源码、原始输入／失败输出、两 Git bundle 和接收包已做可离线恢复归档并回读校验；原归档未审核为可公开上传，本页只发布脱敏事实投影。
