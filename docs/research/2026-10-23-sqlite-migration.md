# SQLite 多步升级：事务成功不等于数据保住

核实：2026-10-23。[一手／本轮实测] 真实项目 sqlite-utils（Apache-2.0），本仓独立编写的公开合成数据探针，历史失败源自上游回归；不是用户数据库，不提交新上游修复。

## 读者获得的能力

用 sqlite-utils 4.2.1 的现成 API 把关联表升级为 STRICT 表并保持可查询：正确组合多步提交、嵌套回滚、失败恢复，且分清父表重建与外键级联的边界。不要只验 `foreign_key_check` 或进程返回码，必须查业务行内容及重新打开后的结果。

## 真实来源与两轮实现

1. [维护者 #755](https://github.com/simonw/sqlite-utils/issues/755)，2026-06-21：旧 `transform()` 会意外提交外层事务。新增 `db.atomic()` 用外层 BEGIN、内层 savepoint，并将多处写操作迁入统一事务入口，处理 `executescript()` 隐式提交。固定 [6729ea3f60fd10800143ab2e5d085d22b5956e83](https://github.com/simonw/sqlite-utils/commit/6729ea3f60fd10800143ab2e5d085d22b5956e83) 已读源码；该历史提交没有单独运行，本轮验证其当前继承能力。
2. [维护者 #794](https://github.com/simonw/sqlite-utils/issues/794)，2026-07-12：父表重建在已有事务且外键 ON 时，会触发子表 CASCADE，外键检查却可以通过。维护者比较全部拒绝事务内重建、按外键筛选、再按 pragma 状态筛选，选最后一种。接收 [#795](https://github.com/simonw/sqlite-utils/pull/795) 已发布实现，不再造一份重复 PR。

机制：`foreign_keys` 在事务内切换无效；`defer_foreign_keys` 可以延迟违规检查，但不会延迟级联操作。两者不要混写为“所有 pragma 均不能在事务内改”。[SQLite 官方语义](https://www.sqlite.org/foreignkeys.html)

## 固定输入与实测结果

- 旧代码 `d71420065903ff54247b5062b8c6af6165b7e638`：父表字段改名成功，三行 books 全部丢失，`foreign_key_check` 返回空。旧缺陷按预期复现，绝非验收成功。
- 接收代码 `f66ddcb215e76dcbc1fa1dff4359f2ac3dc702e5`：相同操作抛 `TransactionError`；重新打开后逐行内容和 schema 与 before 完全相同；外键 ON 未变。该固定版本相关事务测试 8 passed，68 deselected。
- 当前 4.2.1 `28dc6278cc03a9245325d056e6986818544abc68`：全部 `tests/test_atomic.py` 与 `tests/test_transform.py` 141 passed，无 skip。
- 环境：Python 3.12.14，SQLite 3.53.1，Linux。安装官方 PyPI 依赖，实际库导入来自各固定源码 worktree，不靠替身实现。

## 当前可用路径

[经验] 只有改列名时优先 SQLite 原生 `ALTER TABLE RENAME COLUMN`，不必重建或关闭外键。本例历史反例保留上游以 rename 触发问题的复现操作；当前正向任务包含原生 ALTER 无法直接完成的 STRICT 模式转换，因此使用 transform。

1. 父表单次 STRICT 转换放在外层事务之外，保持 FK ON；让 `transform()` 管理临时禁用、校验和恢复。
2. 普通多步写入用 `db.atomic()`；内层失败可以只撤销内层，外层失败仍能撤销内部已释放 savepoint 的修改。
3. 如必须把父表和子表重建放在同一个事务，先在事务外关闭 FK，再进入 `db.atomic()`。提交之前由调用者显式执行 `foreign_key_check` 并拒绝违规，同时比较需要保留的业务数据；退出事务后恢复原来的 FK 状态。不要在已经开始的事务里尝试关闭。
4. FK 关闭时 `transform()` 不替调用者做那次 FK 校验，所以本例故意写入不存在的 author_id，靠显式校验使整批回滚，再复核数据库未变。

本例保留三个成功查询结果：Ada revised / Transactions，Ada revised / Data migration，Lin / Graphs revised。两张表均升级为 STRICT，子表列名变为 book_title，父表列名变为 display_name。逐项核对列类型、NOT NULL、主键、外键和 STRICT 标志，另验证 TEXT 字段拒绝 BLOB。真实 `python -m sqlite_utils` 子进程重新打开数据库并 JOIN 查询；另在结果副本删除作者，确认 CASCADE 仍按预期删除其两本书。

## 复用入口

使用相邻的[重放入口](../../experiments/replay_sqlite_migration.py)与[数据探针](../../experiments/sqlite_migration_probe.py)。准备 Python 3.10+ 与 SQLite 3.37+（[STRICT 的最低版本](https://www.sqlite.org/stricttables.html)）；本轮实际测试版本仍以上述环境为准，并非已跑兼容矩阵。先在独立 Python 环境安装依赖（可用 [已测依赖](../../experiments/sqlite-migration-requirements.txt) 复现本轮依赖），准备 Git 与公开 GitHub 网络，然后：

    python3 experiments/replay_sqlite_migration.py --python .venv/bin/python --tests --output ./sqlite-migration-output

入口不安装依赖，不改原仓库，不接触现有数据库。输出目录必须新建且不存在；不指定时创建新的临时目录。各固定源码、日志、before.db、after.db、cascade.db、report.json、真实 CLI join.json 均保留。该入口含固定 SHA 校验和实际导入路径记录，任一步异常返回非零。

## 范围

已验：三个指定源码状态；真实磁盘 DB、子进程 CLI；内层回滚、外层结构和数据回滚；危险路径拒绝；两种可工作的迁移路径；显式 FK 违规拒绝与恢复；重新打开、内容和 schema、后续级联。

未验：全部上游测试、多 SQLite/Python/OS 矩阵、生产并发、进程崩溃/断电耐久、用户真实数据、模型或 Skill 增益。FK OFF 路径不是通用生产迁移框架；触发器、视图、表达式索引等真实 schema 仍需按目标覆盖。

探索回执：从维护者真实事务重构沿后续级联数据问题追到已发布修复，再以独立读取的 SQLite 外键／ALTER 原文和当前库源码核对路径；原生改名优先，重建只用于本例 STRICT 目标。原文对照还明确了 FK 关闭时须由调用者检查的责任，已用于实际失败回滚试验；这不构成发现能力的总体提升或模型收益证明。[一手／本轮研究]
