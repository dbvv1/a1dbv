# prek 的“已恢复”提示，不保证 clean filter 隐藏行仍在

**🧪 已用 prek 且用 Git clean filter 排除本机设置的项目，可针对这个已知缺陷评估 0.5.9；不要只靠退出码或 stash 恢复提示判断内容保全。** 原公开输入在 0.5.6 成功退出却丢失隐藏行，0.5.9 保留了同一输入。本轮不推荐其他项目为此切换 hook runner，也不作速度、模型收益或全面数据安全比较。

## 原输入与实际变化

使用者 #2912 的最小复现配置 `filter.strip.clean='grep -v SECRET'`，让 `f` 中的 `SECRET=1` 不进入过滤后的 diff；这是公开合成标记，不是真实凭据。另一文件 `h` 的普通未暂存改动触发 prek 保存／恢复。两版本都在全新 Git 仓、独立 HOME／PREK_HOME 中运行官方 Linux 二进制；没有安装 Git hook、接入真实设置或改用户仓库。

| 场景 | 0.5.6 | 0.5.9 |
|---|---|---|
| 原报告：隐藏行＋另一文件未暂存 | exit 0，显示已恢复；`f` 隐藏行消失 | exit 0，隐藏行保留 |
| 仅隐藏行，没有其他 stash 触发 | 保留，无 patch | 保留，无 patch |
| 只有普通可见未暂存修改 | 原字节恢复 | 原字节恢复 |
| 合成 hook 新增隐藏行，并制造 patch 冲突 | exit 1；回滚后隐藏行消失 | exit 1；回滚后该新增隐藏行保留 |

原报告场景没有 staged 文件，identity 实际显示 `no files to check / Skipped`，**不是 identity hook 通过**；观察的是它前后的 stash 生命周期。冲突控制则在初始提交后先暂存 `h-stage`、再写未暂存 `h2`，hook marker、输出和冲突日志证明确实执行。它保留的是 hook 期间新加的隐藏行，不是该场景运行前已有行；exit 1 来自修改文件的 hook，并非恢复失败。

每场都读回工作文件原始字节、index 内容、index tree、HEAD、status、可见 diff 和保存 patch。普通 `h`、index、HEAD 及未跟踪哨兵均保留；patch 只有 `h`，没有 `f` 的隐藏行。`git status` 有时仍因 stat-dirty 标记 `f`，因此不能说 Git 的所有视图都看不见它；但过滤后的 diff／保存 patch 确实不含该内容，不能据 patch 推定隐藏行已有备份。

## 为什么这个版本不同

官方 #2915 在 0.5.9 发布说明中列为修复：保存阶段只 checkout Git 可见的未暂存路径；冲突回滚恢复 index 后重新计算路径，不再整树覆盖。这里验证的是已发布二进制的同输入结果，没有重复开发补丁或向上游投稿。

真实运行：2026-11-01 19:11:09 UTC，Linux、Git **2.47.3**（隔离 PATH 实际调用）、驱动 Python **3.12.14**、本地 hook Python **3.13.5**。报告者环境是 WSL2，本轮没有运行 WSL、Windows、pre-commit 或完整上游测试。其他 filter、子模块、并发／中断恢复和原生安全设置不在证据范围，不能称所有未暂存数据都安全。

[`results.json`](results.json) 保留每次配置、完整 CLI 输出、退出码、前后内容／Git 状态与 patch，以及官方发布包 SHA-256、实际版本和 runner hash。完整原始证据另已归档；没有把仅有 Git diff 的检查冒充文件字节备份。

**依据**：[真实用户 #2912 与原输入](https://github.com/j178/prek/issues/2912)、[已合入 #2915](https://github.com/j178/prek/pull/2915)、[正式 0.5.9](https://github.com/j178/prek/releases/tag/v0.5.9)。核实／实跑：2026-11-01 UTC。
