# Angular 查询迁移：成功提示之后，仍要验原消费者

**🧪 多个 tsconfig 引用同一份源码时，先在独立副本保留全部配置跑官方迁移，再核 diff 和原消费者；出现重复改写就停止扩量，保留原入口。** Angular core 22.2.1、22.2.5 和 22.3.0-next.4 在同一公开输入中都报告成功，却生成不能编译的库。不要通过删除 tsconfig、缩小分析范围或改测试断言换取通过。

这是[迁移路线](../../docs/decisions/migrations.md)的一次真实问题复现，支持“先验消费者”的选择，不是 Angular 整体升级完成或页面升绿的证明。

## 固定输入与环境

- 原问题：[Angular #71147](https://github.com/angular/angular/issues/71147)。本次只复现 signal queries；原帖提到的 ngstyle 问题未运行。
- 迁移前：[msmallest/migrations-duplicate-bug@6925342620710ecf65bb0e7dddbd6230418b25c3](https://github.com/msmallest/migrations-duplicate-bug/tree/6925342620710ecf65bb0e7dddbd6230418b25c3)。`signal-queries-migration` 分支 HEAD 已是迁坏结果，不能作为迁前输入。
- 实测 Linux x64、Node 24.22.1、npm 11.9.0（项目声明为 npm 10.9.8）。使用项目原 `angular.json` 和四个 tsconfig 分析入口，未删除配置或启用 best effort。
- 原复现未见 LICENSE；本目录只提供自行编写的复跑说明，不转存其源码、锁文件或迁移后副本。自行获取公开源码不意味着获得再分发许可。

## 照原锁复跑

在新的独立目录执行；需要获准下载公开项目和安装 npm 依赖。先查看项目说明与依赖脚本，不对已有工作树或真实数据执行清理、覆盖命令。

```bash
git clone --branch signal-queries-migration https://github.com/msmallest/migrations-duplicate-bug.git angular-query-repro
cd angular-query-repro
git checkout --detach 6925342620710ecf65bb0e7dddbd6230418b25c3
node --version
npm --version
export NG_CLI_ANALYTICS=false CI=true
npm ci
npx --no-install ng version
npx --no-install ng build lib
npx --no-install ng test lib --watch=false
```

原锁对应 core／CLI 22.2.1。这里的两个库检查迁前均通过，测试共 1 项，只验组件创建，不覆盖 query 读取行为。不要用完整应用已有失败替代这个对照：原 `npm run build` 因多项目而要求指定目标，原应用的模板调用 `title()`，但类已没有该字段，`ng build app` 和完整测试在迁移前就失败。需复核这些原失败时，分别运行 `npm run build`、`npx --no-install ng build app`、`npm test -- --watch=false`，保留各自退出码，不修改模板或断言。

接着在同一副本执行官方迁移，保留其警告与完整输出：

```bash
npx --no-install ng generate @angular/core:signal-queries-migration --path=./ --best-effort-mode=false --interactive=false
git diff -- projects/app/src/app/app.ts projects/lib/src/lib/lib.ts
npx --no-install ng build lib
npx --no-install ng test lib --watch=false
```

**预期看到缺陷，不是期待最后两个命令成功。** 迁移命令退出 0、报告迁移 2/2 个 query，同时 Prettier 警告语法错误；库文件的 import 和 `ref` 字段各被改写三遍。随后库构建与测试编译均退出 1，出现 TS1005／TS2300 等错误。迁移输出的“成功”、命中数和格式化警告不能代替消费者结果。

## 当前版本也要重验

2026-11-11 在三个独立副本中，保留同一迁前源码和检查入口。后两组按相容版本重新解析依赖，不沿用旧锁冒充新版本，也未使用 `--force` 或忽略 peer 依赖。

| core | CLI／build | 库迁前构建／测试 | 迁移自报 | 库迁后构建／测试 |
|---|---|---|---|---|
| 22.2.1 | 22.2.1 | 通过／1 项通过 | exit 0，2/2 | exit 1／exit 1 |
| 22.2.5 | 22.2.6 | 通过／1 项通过 | exit 0，2/2 | exit 1／exit 1 |
| 22.3.0-next.4 | 22.3.0-next.5 | 通过／1 项通过 | exit 0，2/2 | exit 1／exit 1 |

三组均生成相同的重复库内容，SHA-256 为 `3454b67c671c9b365e7cddd1843e4529c8ac8a4cc01711c3d069674721cf5374`，与原作者迁坏提交一致。正式版与 preview 另外解析到 Vitest 5.1.0，原锁为 5.0.3；表格是各组迁前后对照，不把不同依赖矩阵拼成单一版本验收。

额外新增的 spec-only 消费者作为补充探针，分别核投影元素读值／无匹配值、注入上下文外实例化、子类覆写。各自基线通过，正式版迁后都先被重复语法错误阻断；覆写一组还自报跳过一个 query，却仍改坏基类。它们没有证明迁后值语义通过，也没有观测到被编译错误挡住的潜在运行错误。

## 分清声明、引用与配置范围

Angular `--path` 限定待迁的查询声明，目录外的使用处仍可能被分析和改写；它不是文件写入沙箱。`--analysis-dir` 会裁掉外部分析，官方明确提示可能漏改引用。涉及共享文件的配置不能删掉当作修复，也不能未经整合就各自并行改同一文件。独立单 tsconfig 补充探针中，`--path=src/selected` 确实改了目录外的 `reader.ts` 引用，同时保留目录外另一 query 声明，迁前后 `ngc` 均通过；这是范围机制实测，不是另一个产品迁移完成。

已有 [PR #71151](https://github.com/angular/angular/pull/71151) 在固定 head `c2490ff199185dba88b435ed59685e0563632058` 中将全程序定义发现与所属编译单元的声明写回分开。作者仍承认 spec-only 子类 override 缺口；原 PR 的两个字符串断言也不能代替类型和实际 query 消费者。本次候选官方 Bazel bundle 构建因嵌套沙箱挂载失败而未完成，未得到可运行产物；没有切换沙箱策略或手改发布包来代替。因而本轮只接收发布版缺陷与候选源码审查，不推荐把该 PR 当作已验证修复。

来源：[官方迁移与选项](https://angular.dev/reference/migrations/signal-queries)、[正式版迁移实现](https://github.com/angular/angular/blob/v22.2.5/packages/core/schematics/migrations/signal-queries-migration/migration.ts)、[候选实现](https://github.com/angular/angular/blob/c2490ff199185dba88b435ed59685e0563632058/packages/core/schematics/migrations/signal-queries-migration/migration.ts)、[作者说明的继承缺口](https://github.com/angular/angular/pull/71151#issuecomment-6486346960)；源码、原帖与上述实测核实 2026-11-11。完整应用、真实浏览器、生产迁移和 Agent 净提效未验。
