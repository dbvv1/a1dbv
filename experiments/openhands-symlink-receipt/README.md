# OpenHands：编辑链接后，要让真正依赖目标的应用读回来

**🧪 项目通过符号链接共用代码时，验收实际 target 和其他消费者，不只看 Agent 的编辑成功提示或刚编辑过的路径。** 本次受测 OpenHands FileEditor 基线报告成功，第一个应用测试也绿，但它把链接换成普通文件，共享目标和第二个应用仍是旧逻辑。既有 PR #6358 候选让同一编辑落到目标，三个真实导入都通过，并能沿同一路径撤销恢复；适合定向试用，不作为整套 Agent 的默认升级建议。

## 接收的是已有未完成问题

OpenHands 主项目约 9.25 万 Star；本次实际受检的是其独立 MIT 组件 `OpenHands/software-agent-sdk` 的 SDK／tools 1.59.0，不把主项目热度当作组件效果。公开 #6348 收集测试发现的缺陷，明确尚未逐项做端到端复现，其中一项是 atomic write 替换了 symlink 本身。开放 PR #6358 只改编辑器和一项回归测试：原子替换前解析最后一级 symlink，使临时文件在真实目标旁创建、替换。

固定 current main／merge-base `98849457` 与候选 `f11d44c2`，接收原候选，不重复实施或向上游投稿。这里补的是公开 `FileEditorExecutor(FileEditorAction)` 后的实际消费路径，不调用 LLM、Agent loop、服务或 UI。

## 同一输入，让三个应用入口验收

非作者在隔离云目录建立合成共享计价模块：checkout 和 invoice 各自的 `pricing.py` 都是到 `shared/pricing.py` 的相对链接；第三个入口直接从 shared 导入。正确账单应为 `7 × 3 = 21`，原缺陷却计算 `7 + 3 = 10`。共享目标权限为 `0640`，另保留邻接文件及 allowlist 之外的合成 sentinel。

```text
生产工具 view → str_replace 经 checkout 链接修复
→ checkout、invoice、shared 三入口真实 Python 导入与断言
→ insert → 同一路径 undo → 再读三入口
→ undo 原修复 → 核内容、link、权限与 Git diff
```

| 接收时观察什么 | 原基线 | #6358 候选 |
|---|---|---|
| 工具 replace 返回 | 成功；刚编辑路径看起来正确 | 成功 |
| checkout 真实业务结果 | 21，通过 | 21，通过 |
| invoice／canonical target 真实业务结果 | **仍是 10，两者失败** | 均为 21，通过 |
| 相对 symlink 与 Git 差量 | link 变普通文件；diff 错落 checkout alias | link 文本与类型保持；diff 仅 `shared/pricing.py` |
| 目标权限／邻接文件 | 保持 | 保持 |
| insert 后再 undo insert | 仅本地 alias 逻辑恢复 | 三入口重新读到修复后逻辑 |
| 再 undo replace | 文本回去，link 身份未恢复 | 内容、link、权限的初始快照完整恢复 |
| 找不到替换字符串／文件不存在／非空 allowlist 拒绝 sentinel | 报错，全夹具不变 | 相同 |

原始业务失败 traceback 保留；消费者脚本退出 0 表示它核对到了预期的基线缺陷和候选行为，**不是两版本的业务任务都通过**。没有把工具 observation 的新文本当作磁盘目标已被修改。

## 适用边界与仍未完成的部分

**稳定 symlink 指向下，按真实目标验收这份候选；没有链接的普通编辑无需增加整套编排。** 本次同一 executor、同一 alias 路径上的编辑／撤销做通。源码中 history 仍按调用路径建键，不承诺换成 canonical 路径或新建 executor 后能接续撤销。父目录链接、hardlink、链接并发改指、跨别名并发、Windows 和打包服务器没有在此消费者中验证。

`workspace_root` 提供路径上下文，不是访问沙箱；本次所有目标都在自有合成目录。非空 `allowed_edits_files` 的拒绝实际测过，未把空列表解释为拒绝全部。

**`close()` 还不能替代临时历史的所有权处理。** 两版实际调用继承的 public close 后，都留下 2 个 history 目录。消费者记录原状态后把自有历史移入证据目录；这是验收程序保全，不是产品自动清理，也不是 #6358 修复范围。

## 检查与保全

| 检查 | 本次实际结果 |
|---|---|
| 候选新增回归，使用原基线安装包 | 1 失败：链接已变普通文件，52 项 deselected |
| 完整 `tests/tools/file_editor/` 目录 | 原基线 168、候选 169 通过；两版均 0 失败、0 跳过 |
| 候选两文件 Ruff lint／format | 通过 |
| 非作者生产工具消费者 | 候选限定通过；保留基线业务失败与 close 残留 |
| 上游固定 head CI | 2 个描述／产物 checks 成功；12 个工作流 `action_required`，功能 CI 尚未完成 |

环境为 Linux、Python 3.12.14；按现有 frozen lock 在两个独立 venv 安装 SDK、tools 与开发依赖，未改锁或安装 Hook。首次依赖准备的白名单环境遗漏平台传输变量，导致 PyPI DNS 失败；只恢复原有代理／证书环境后完成，原失败日志保留。生产导入前设置本地 LiteLLM cost map 与自有 HOME／临时目录；未启动浏览器或访问模型／账户。

未跑全仓 suite、完整 pre-commit／Pyright、模型行为评测、原生 Windows 或 macOS。完整源码快照、合成输入、输出和历史已离线保全；公开范围只有本页及 [results.json](results.json)，不公开原归档或源码补丁。长程路线保留 🟡。

**依据**：官方 [SDK／工具源码](https://github.com/OpenHands/software-agent-sdk/tree/98849457621881ae2414719b82b8bc1cf535b4ab)、[公开缺陷与原回归](https://github.com/OpenHands/software-agent-sdk/issues/6348#issuecomment-6534430043)、[PR #6358](https://github.com/OpenHands/software-agent-sdk/pull/6358)、[候选实际编辑器](https://github.com/OpenHands/software-agent-sdk/blob/f11d44c29cb28ca92705468513231b1e7562482e/openhands-tools/openhands/tools/file_editor/editor.py)，加本仓非作者真实 executor 与下游应用对照。核实 2026-11-02；定向接收不评价整套 OpenHands 的模型质量或效率。
