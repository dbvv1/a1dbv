# 离线量尺验证记录

> 核实时间：2026-10-10 UTC。**[经验：实测]**
> 这里只记录确定性 Python 自检，不是模型实验；模型试验状态 **not_run**。

环境：Python 3.12.14，Linux 6.18.44 x86_64。检查时仓库 parent revision 为 `8578b0776a75d3f290487feac6dfbe9fed9d1e48`，本包是未提交的新目录。该 revision 不包含本包；精确字节由 `manifest.json` 固定。没有安装依赖、调用模型或使用联网服务。

在仓库根目录执行：

```bash
python3 experiments/workflow-ablation/evaluator/selftest.py
```

实际：10 个 unittest 方法通过，退出 0。涵盖 manifest 字节一致、模板 not_run/计量为空、基线假绿、参考 patch、缺输入、语法错误/提前零测试退出、超时、B/C 有用内容一致、正常 dataclass 前向注解导入、伪造 JSON 后 SystemExit 不算通过。

```bash
python3 experiments/workflow-ablation/evaluator/grade.py experiments/workflow-ablation/agent-input/baseline
```

实际：退出 **1（预期）**，`accepted: false`。public：4 个方法、0 failures/0 errors/0 skipped，通过；held_out：7 个方法、790 个失败断言/子用例、0 errors/0 skipped，未通过。790 是断言/子用例数，**不是 790 个独立任务**。

参考补丁只由 selftest 在临时副本应用；同一 grader 的 public 4 个方法与 held_out 7 个方法均通过。held-out 中的小域 oracle 覆盖 1 + 15 + 225 + 3375 = 3,616 个有序输入组合。自检结束确认原始 `intervals.py` 字节不变，临时目录自动删除。

```bash
python3 scripts/check_repo.py
git diff --check
```

最终检查通过。前者仅验证本地链接及 JSON/TOML 语法，不是外链、内容事实或 JSON Schema 语义验证；后者对未跟踪的新文件不足以证明无尾空格，因此本包另外逐文件检查 UTF-8、LF、末尾换行（空 neutral 例外）及尾空格。

未验证：真实 CLI/API、模型行为、自动加载指令、账单/订阅限额、真实项目提升、候选程序安全隔离。未补造历史试验原始记录。
