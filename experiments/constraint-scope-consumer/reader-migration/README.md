# 约束迁移：独立读者把失败回滚与持久化验到底

**约束名只在对应表内有意义；存在性检查和实际 ALTER 必须指向同一目标表。** 本例修复 Supabase [公开 #83](https://github.com/supabase/agent-skills/issues/83) 的 CHECK／外键配方，交付[修订 SQL](corrected.sql)与[可运行消费者](test.mjs)。原配方成功退出却可能漏建约束，不能只凭返回码接收。

## 跑起来

使用 Node 24，在本目录执行：

```sh
npm ci --cache "$PWD/.npm-cache" --ignore-scripts --no-audit --no-fund
npm test
```

依赖锁定 `@electric-sql/pglite` 0.5.15。预期读者套件 **27 项断言**及独立接收的 **5 组 schema 检查**通过，0 失败／跳过；其中预期 SQL 错误是负向断言通过。每轮在 `runs/` 新建独立合成数据库，不重置旧数据；`result.json` 指向本轮相对目录。测试使用磁盘持久化与正常 close/reopen，不连接外部数据库。

## 实际证明了什么

| 情况 | 实际 SQL 与读回结果 |
|---|---|
| 原配方，另一张表已占同名约束 | 两个目标约束都未创建；非法年龄与孤儿外键都能写入，重开后仍在 |
| 目标已有非法年龄 | 新增 CHECK 报 `23514`；回滚并重开后，所有原行与约束保持原样 |
| 目标已有孤儿外键 | 第二步报 `23503`；回滚也撤销第一步新增的 CHECK，重开无部分迁移 |
| 缺少 profiles 表 | 报 `42P01`；回滚、重开后其他四张表的行与约束不变 |
| 修订配方与合法旧数据 | 两个目标约束均创建且 validated，原行及其他表约束不变；重开和重复迁移仍一致 |
| 迁移后继续使用 | 合法插入／更新成功；非法年龄、孤儿引用和被引用父行删除被拒，失败不改变其他数据 |

**失败后先恢复事务，再继续验证。** 这份独立 SQL 自己执行 `BEGIN`／`COMMIT`；中途失败会保留 aborted transaction，后续语句报 `25P02`，调用者需执行 `ROLLBACK`。若项目已有管理事务的迁移框架，将两段 DDL 放进它的原生事务，不把本例的事务包装原样嵌套进去。修复不删除非法旧数据，需先按业务决定处置，再运行迁移。

本例限定 `public`，同时限定 catalog 的 `conrelid`、ALTER 与外键引用。若改 schema，三处一起改；同一目标表已有同名但错误定义的约束不在本例修复范围。CHECK／外键继续允许 NULL，沿用原配方语义。

## 读者实做与来源

2026-11-08，未参与页面或旧实验的新上下文云端读者读取完整[迁移页固定版本](https://github.com/dbvv1/a1dbv/blob/e0f777973f972882332aeb03de94b0d0c17b4509/docs/decisions/migrations.md)，按“复现 → 失败恢复 → 重开读回 → 成功迁移与后续读写”完成本任务，未读旧实验、研究或答案。页面提供选路与验收顺序；原缺陷、原配方 `original.sql`、固定引擎和任务验收由任务输入给出，PostgreSQL 实现细节来自读者已有知识。无页面卡点，不证明零基础读者无需 SQL 资料。

初稿的 25 项通过后，接收补充缺表覆盖，并移除未经并发试验的显式锁；最终 27 项由读者重跑，接收者另跑全部测试。接收者还以[独立脚本](test-schema-target.mjs)中的另一组合成业务行及优先于 public 的 shadow schema 核查：修订只操作 public，外键拒绝只存在于 shadow 的父键，合法数据重开保留，重复迁移无变化。此为独立云端执行，未代替本机读者门槛或上游采用，地图保持 🟡。

**依据**：[原配方固定源码](https://github.com/supabase/agent-skills/blob/c9be0e931b7930f7d02126d04774d904c381e7d7/skills/supabase-postgres-best-practices/references/schema-constraints.md)的 CHECK 至外键段完整保留在 [original.sql](original.sql)，SHA256 `7743ae355bc4c172a4c47cbb19981aaec37c9983faa1ad6e77331a71e5da3f7e`，原 MIT [许可](LICENSE.source)保留。2026-11-08 非读者核原 issue／固定源码并复跑；Node 24.22.1、npm 11.9.0，数据库报 PostgreSQL 18.6／PGlite 0.5.15（WASM）。此前[8 组内存对照](../README.md)仍只代表 11-05 的原范围，不倒算为本轮读者证据。

未验原生 PostgreSQL／Supabase、并发迁移与写入、崩溃耐久、框架集成或生产数据；不能把单连接持久化测试当成可直接上线的迁移方案。
