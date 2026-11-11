# 遗留代码与大迁移：怎样选改法、保住原行为

**🟡 优先让 Agent 使用框架官方迁移器处理重复改写，再处理例外；先验一个真实消费者，再扩量。** 跨文件类型迁移保留完整分析范围，已有迁移 PR 接必要差量，不从头重写。选路以目标框架和当前版本为准，不以 Agent 能改多少文件为准。

## 起手提示：交目标、兼容要求和真实消费者

```text
在 [仓库] 完成 [旧状态 → 新状态]，保留 [必须兼容的输入、行为和数据]。
先核主干、工作树、在途实现、实际依赖版本和项目检查入口。
按下表选官方迁移器或项目既有工具；已有 PR 只接必要差量，保留主干新增功能。
先选一个真实受影响的消费者，记录原结果；试改后用同一输入核正常与失败路径。
列出已改、未改、警告与例外，覆盖明确后再扩量，最后验整合后的产物和消费者。
交回 diff、原生检查结果及未验项；不删断言、关闭检查或改消费者来掩盖兼容破坏。
涉及数据先用合成数据或获准副本验证恢复，不自动操作真实数据或生产。
```

## 按改动形状选路

| 任务 | 先让 Agent 做什么 | 扩量前确认什么 |
|---|---|---|
| 重复语法／API 替换 | 用目标版本官方 codemod；代表性文件试改后补规则外语义 | 已改、未改与警告清楚；零命中不等于没有旧调用 |
| 跨文件类型、引用或框架升级 | 先用框架迁移器／类型工具，保留项目要求的分析范围 | 开发、发布入口与真实返回值匹配；构建产物可运行 |
| 依赖大版本升级／接收旧 PR | 读跨版本指南，按当前包管理器更新声明和锁文件 | 真实 client、请求与主干新增行为保留；已有失败和新增失败分开 |
| 分阶段切换，多环境仍用不同版本 | 沿 alias、resolver、类型映射与 adapter 核实际 runtime | 每个支持入口对应预期版本；全部切完才撤旧版支架 |
| 公开 API／协议兼容 | 固定旧调用方、配置及协议版本，对照迁移前后 | 原生编译与真实行为都符合契约；自动回退不能证明新版可用 |
| 持久数据结构变化 | 沿项目受支持迁移器，先核写入者、事务与恢复点 | 失败恢复、重开后的业务行／schema、后续读写都通过 |

## 为什么优先这些做法

**框架迁移器先行，Agent 补例外。** Angular 的 signal input 迁移会处理模板、host binding 和 TypeScript 引用，默认跳过不安全转换；不要为多改文件启用可能破坏构建的 best-effort。TanStack Query 的固定规则与历史用户反馈显示，codemod 能处理重复调用，但仍须核跨模块 query key 和自定义 hook；历史遗漏部分后来已修复，不当作当前版本缺陷。让 Agent 审查未改项、补语义和跑消费者，比要求它从零自由改写更合适。

来源：[Angular 官方迁移说明](https://angular.dev/reference/migrations/signal-inputs)、[TanStack 固定规则与夹具](https://github.com/TanStack/query/tree/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads)、[真实用户的成功与遗漏反馈](https://github.com/TanStack/query/issues/6204)；原核实 2026-10-15，保留于[同题比较](../research/2026-10-12-development-maintenance.md#重复代码迁移语法规则类型分析与第二次执行)。

**先试代表性单元，再并行；分析范围与修改范围分开。** Claude Code 的 fan-out 配方先用少量文件调好任务再扩量，但这不适合机械套在跨文件迁移上：Angular 的 `--path` 只限修改范围，`--analysis-dir` 却可能漏掉外部引用。文件可以独占分工，依赖分析与最后整合不能切丢；例外增多时先收窄并修规则。

来源：[Claude Code 官方 fan-out](https://code.claude.com/docs/en/best-practices#fan-out-across-files)、[Angular 分析范围选项](https://angular.dev/reference/migrations/signal-inputs#configuration-options)；原核实 2026-10-15，采用其分批与范围机制，不声称已证明 Agent 净提效。

<a id="导入已换新运行时可能还没换"></a>

**导入路径换新，不代表运行行为已升级。** Sentry 的 React Router 迁移先通过兼容层维持旧 runtime，再按环境分阶段切新版本，并保留双版本测试与类型检查。让 Agent 给每个实际入口列出 runtime、adapter、允许 API 和检查命令；共享代码兼容所有仍支持的版本，全部切完再清临时支架。单版本升级不另加双矩阵。

来源：[Sentry 迁移指令](https://github.com/getsentry/sentry/blob/8891ab865ca741f83cbcd20349bd21c03ad92ffc/static/AGENTS.md#L30-L39)、[环境选择](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.ts#L8-L39)、[构建消费者断言](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.test.ts#L28-L162)；原核实 2026-11-03，固定源码复核 2026-11-08。这是已完成迁移的历史机制，不是 Sentry 当前仍运行旧版的判断。

## 怎样验收，什么时候停止扩量

<a id="公开-api库能构建旧调用方仍可能坏"></a>

1. **同一个消费者前后对照。** 保留输入、依赖选项、target 与断言；公开 API 的编译破坏和行为变化分开核。协议固定两代分别调用，不能用自动降级后的成功替代新版通过。
2. **按实际交付形式检查。** 类型检查之外运行构建后的入口；发布 wheel／库时从独立环境安装产物，不拿源码目录的成功代替发行包。审查迁移器改动的检查选项；换测试 runner 时单列环境、原断言与覆盖率门槛的差异，替代环境通过只补充对应证据，不代替原 CI。数据迁移须重开并核业务行，事务未报错或外键检查为空都不足够。
3. **出现破坏先修，不降低原目标。** 规则漏改、消费者失败或主干行为丢失时停止扩量；缺依赖按项目方式准备，缺 UI／旧缓存验收就保留候选。已经写入新状态时先核恢复点与新增数据，反向应用依赖补丁不能恢复数据库。

来源：[Angular 官方 Karma→Vitest 迁移指南](https://angular.dev/guide/testing/migrating-to-vitest)区分默认 Node DOM、真实浏览器与需另迁的 reporter／覆盖率配置；核实 2026-11-10。

本页不适用于把纯内部重构统一升级成双版本兼容流程；没有持久状态的语法改写也无需数据库恢复演练。批量与并行只在迁移单元可独立接收时增加。

[历史实测、读者卡点与未验范围](../research/2026-11-10-migration-case-evidence.md)：原任务证据保留；本次为结构改写，当前版本核心路线尚未通过两项真实任务及本机新读者验收，保持 🟡。
