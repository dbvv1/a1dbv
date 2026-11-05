# 约束迁移：核实际目标表，不只看迁移成功

**采用 Supabase Postgres Skill 的约束配方前，把存在性检查限定到目标表，再用非法数据验约束是否真正生效。** 原配方在别表已有同名约束时可成功执行却漏建；本实验直接复现公开 [issue #83](https://github.com/supabase/agent-skills/issues/83)，不是制造新的迁移需求。

## 实际消费者与结果

2026-11-05，在 Node 24.22.1／PGlite 0.5.15 运行真实 SQL，数据库报告 PostgreSQL 18.6、WASM。SQL 逐字提取自 Supabase 当前 main 固定 `c9be0e931b7930f7d02126d04774d904c381e7d7` 的 [schema-constraints.md](https://github.com/supabase/agent-skills/blob/c9be0e931b7930f7d02126d04774d904c381e7d7/skills/supabase-postgres-best-practices/references/schema-constraints.md) 中 `-- Check constraints` 至外键段末尾，见 [source.sql](source.sql)；原文件 SHA256 为 `90e8efda3e9e81095e642911ad4aae2809d160f29414338fa997253238f510f8`，原 MIT 许可附于 [LICENSE.source](LICENSE.source)。

8 组测试覆盖 CHECK／FOREIGN KEY × 有无别表同名约束 × 原配方／限定目标表：

- 原配方且存在碰撞时，迁移连续执行两次均成功，目标表却没有该约束；`age=-1` 或没有父记录的 `birthchart_id=2` 实际插入成功。
- 只在两段存在性查询加 `and conrelid = 'public.<目标表>'::regclass`，同一碰撞下目标约束各建成一项，非法插入分别被 SQLSTATE `23514`／`23503` 拒绝，原合法行保留。
- 无碰撞时原配方与限定版均能拒绝非法数据；全部条件下重跑迁移不增加重复约束。

**8 项通过表示这组缺陷与对照断言均成立，不表示原配方安全。** 每项使用独立内存数据库，固定 `search_path=public`，核 `pg_constraint` 的目标表记录、实际 INSERT 的错误码及最终行数。没有只比较生成的 SQL 字符串，也没有将语法成功当作完整迁移。

## 复跑

在本目录执行，依赖版本及 npm integrity 由锁文件固定：

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

预期 8 项通过、0 skipped。若缓存目录不可写，可将 `npm_config_cache` 指向自己可写的临时目录；无需改系统权限。测试的 SQL 修正发生在内存字符串，不会修改原配方或连接外部数据库。

## 采用边界

这验证的是 PGlite 的 PostgreSQL SQL 执行，不是原生服务、Supabase 托管环境、事务并发或生产迁移。按真实 schema 同时限定查询与 ALTER TABLE 的目标；本例固定 public，未验证自定义 search_path。存在相同名字但定义错误的已有约束仍会被跳过，不能靠这个存在性检查判断定义正确；并发迁移也另验。

本轮没有安装整个 Skill、运行模型或向上游投稿，不对其余规则作整体评价。该结果补收件箱的可复跑证据，答案页的双真实任务和未读读者条件未满足，不升级为默认。约束名称并非全库唯一的契约见 [PostgreSQL pg_constraint](https://www.postgresql.org/docs/current/catalog-pg-constraint.html)。
