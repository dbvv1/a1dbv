# Node pg：prepare:false 不会关闭命名语句缓存

🧪 **让 Agent 按数据库 Skill 调整 Node `pg` 时，核驱动实际参数，不复制其他驱动的开关。** 要避免 `pg` 的命名 prepared statement，去掉 query 配置的 `name`，仍保留 `$1` 占位符与 `values` 参数。不要用拼接 SQL 替代参数化；未命名参数查询仍使用扩展协议，不能说“完全不 prepare”。是否需要禁用命名语句还应看实际池化产品、模式及版本，本试验不替 PgBouncer／Supavisor 作兼容判断。

## 真实输入与结果

Supabase agent-skills [#83](https://github.com/supabase/agent-skills/issues/83) 的采用者报告连接池配方给了不存在的 `pg { prepare: false }`。固定 main `c9be0e931b7930f7d02126d04774d904c381e7d7` 的配方仍包含该建议。此前本仓只读核这项；本次接实际驱动与数据库，未安装整套 Skill，未重复约束迁移实验。

使用 npm 正式包 **pg 8.23.1（MIT）**、**PGlite 0.5.15（Apache-2.0）**，Node 24.22.1。通过 PGlite 官方 `node-postgres` 适配器把真实 `pg.Client.query` 接入内存 WASM PostgreSQL，分别运行同一参数化查询两次，值为21、22。记录实际 adapter `parse` 调用并原样转发，再用真实 SQL 查询 `pg_prepared_statements`，不由脚本编造查询结果。

| query.name | Client与query均传prepare:false | Parse调用 | pg_prepared_statements | 查询值 |
| --- | --- | --- | --- | --- |
| read_value | 否 | 1次，名称read_value | 1项，from_sql=false | 21、22 |
| read_value | 是 | 同上 | 同上 | 21、22 |
| 不传 | 否 | 2次，名称为空 | 0项 | 21、22 |
| 不传 | 是 | 同上 | 同上 | 21、22 |

**四组断言全部通过，进程退出0。** `prepare:false` 没有改变这两种实际行为；决定命名缓存的是 query 的 `name`。pg 驱动 `requiresPreparation()` 本来就会因参数值选择扩展协议，未命名 Parse 并非异常。最小正确改法是按实际池化约束移除 `name`，而不是删参数绑定；单连接中命名缓存本身可正常工作，不应普遍禁用。

## 复跑与证据边界

```sh
cd experiments/pg-prepare-consumer
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

锁文件固定依赖及 integrity。`probe.mjs` 每组建立独立 PGlite 和 Client，所有断言成功才输出完整JSON；`result.json` 与 `exit.txt` 为实跑结果。这里只用了固定测试输入，没有通用数据库迁移、网络转发或服务器启动脚本。没有保存连接凭据、读取真实用户数据、连接托管数据库或调用模型。

**官方适配器模拟启动／认证握手，并自行发 readyForQuery；不是原生TCP连接。** 查询、Parse/Bind等执行与 `pg_prepared_statements` 内容来自 PGlite 实际 PostgreSQL引擎。这里只验证单后端中驱动选项、命名缓存与参数查询；网络认证、TLS、并发池、事务切换、PgBouncer、Supavisor及生产行为均未验。记录的Parse调用是适配器方法边界，不称抓到了真实网络包。官方适配器只支持受限连接模型，不能据此替代真实池化验收。

## 一手来源

- [原Skill配方](https://github.com/supabase/agent-skills/blob/c9be0e931b7930f7d02126d04774d904c381e7d7/skills/supabase-postgres-best-practices/references/conn-prepared-statements.md)、[#83采用者报告](https://github.com/supabase/agent-skills/issues/83)。该报告的其余问题未在本单元全面验证。
- [pg官方查询文档](https://node-postgres.com/features/queries#prepared-statements)、[8.23.1发布源码的准备判断](https://github.com/brianc/node-postgres/blob/0980cefebe0ae461da8883703be049fe13ca96cf/packages/pg/lib/query.js)。官方文档按每连接缓存解释 query.name；`prepare:false` 不在该判断中。
- [PGlite官方适配器及握手边界](https://github.com/electric-sql/pglite/blob/bac163ecc92e968adda68864b74b7e3d65a68e97/packages/pglite/src/node-postgres/index.ts)、[官方消费者测试](https://github.com/electric-sql/pglite/blob/bac163ecc92e968adda68864b74b7e3d65a68e97/packages/pglite/tests/pglite-node-postgres.test.ts)。该固定源码支持机制核对，实际运行以锁文件中的0.5.15发布包为准，不声称整个源码检出与发布包逐字一致。

核实与实际消费者运行：2026-11-05。结论供已有Node pg项目修正这条配方，不是安装整个Skill或切换数据库／驱动的推荐。
