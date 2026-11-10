# 迁移路线的历史案例与验证范围

本页承接[迁移答案页](../decisions/migrations.md)的既有个例，保留原核实日期、结果和未验范围；搬移不构成新实测，也不重启已取消任务。案例支持局部机制，不替代当前答案页核心推荐的读者验收。


### 自动协商成功：还要固定新版客户端

MCP sequentialthinking 的同一 SDK 2.3.1 下，旧入口能服务旧协议，新版需接入 `serveStdio`。固定 #5131 的单 server 差量后，构建产物在旧／新协议下都能保留两轮 thought、拒绝缺参数并从新连接重新计数；迁移前固定新版会明确拒绝，原生 101 项测试通过并不代表支持新协议。

**照这个顺序做：固定两代协议 → 验基线消费者 → 接必要入口差量 → 有构建先构建，重启真实入口 → 重跑相同消费者。** TypeScript SDK 2.3.1 固定新版使用 `mode: { pin: "2026-07-28" }`；Python mcp 2.3.0 则用 `mode="2026-07-28"`，旧代用 `mode="legacy"`。`auto` 能回退，只验请求成功会漏掉新版仍不支持；Python 显式新版模式还可能合成 discovery 信息，所以要同时核实际 `tools/list` 和工具调用，不能只看客户端版本字段。

**按实际交付形式验收。** Python time 开发态的 editable 安装可在修改后直接重启 `python -m mcp_server_time`；按 wheel 交付时，必须重建并在独立环境安装该 wheel。验收时离开源码目录、清除 `PYTHONPATH` 并核实际导入位置，再分别测试模块与控制台入口，避免用源码通过替代发行包通过。

**依据与复跑入口**：[固定版本、命令和真实 stdio 消费者](../../experiments/mcp-protocol-migration/README.md)，2026-11-07：作者完成 sequentialthinking；time 首轮读者的语言／启动入口卡点修正后，另一独立云读者只照修订页，在 Python 3.10.22、mcp 2.3.0 下实做基线与四文件迁移。两代工具调用、错误分层与新进程连接通过，基线 122／候选 133 项原生测试及静态、构建、覆盖门槛通过，零 skip。[本机 V2](../collaboration/local-jobs/A-MCP-TIME-MIGRATION-READER-V2-20261107.md)缺依赖及已安装控制台入口，且禁止安装；两代真实 stdio、原生测试及 Ruff／Pyright 均未运行（`taskDone=false`），云端结果不替代它。2026-11-08 又在独立环境安装 time 两版 wheel，候选的模块与控制台入口均通过两代消费者，基线仍明确拒绝新版；两包版本号相同，须核实际安装产物。这里只证明两个 server 的局部复现，不是新的上游采用；HTTP、LLM 客户端及全发布门槛未验。

### 导入已换新：运行时可能还没换

**👀 分阶段升级时，先让 Agent 查清每个环境真正运行哪一版，再决定能否用新 API。** Sentry 曾先改为 React Router V8 的导入路径，却通过兼容层继续运行 V6；下一阶段的构建默认仅本机开发用 V8，生产与 preview 仍用 V6，应用测试和类型检查另按两版跑。只看 import 或一份 `package.json`，都会选错行为和检查。

1. **沿真实入口查解析。** 列出项目实际使用的开发、构建、preview、CI 与测试入口，追构建 alias、测试 resolver、类型映射和配套 adapter；写清每个入口对应的 runtime、允许的 API 与检查命令。测试 runner 的版本覆盖单独核。共用代码须兼容所有仍支持的 runtime；新版独有 API 只用于已验证的新版专用路径，或等相关入口全部切换后再用。
2. **每版检查产物与消费者。** 对照预期主版本，核产物有没有混入另一版、adapter 是否匹配；依赖共享 context 时再核实例身份。Sentry 的构建测试还加载产物，检查路由参数、查询串与返回导航；这比只看类型检查或应用启动更接近原目标。
3. **全部受支持入口切完，再清迁移支架。** 清旧依赖、别名、兼容映射及专为双版本增加的 runner／CI 检查，同时改共享指令；保留业务回归、分片和仍有消费者的兼容行为。最后切换与清理可在同一补丁内完成，不能只因双跑成本高就提前删旧支持。

把下面这段补到本次迁移任务中，不给单版本升级增加双矩阵：

```text
先列本项目各入口的实际 runtime、adapter、允许 API 和原生检查命令，标明解析依据。
导入改名不等于行为升级。按仍支持的版本验证构建产物和一个真实消费者，
包括失败路径；只有全部受支持入口切到新版，才删除双版本支架并更新共享指令。
交回各入口已验／未验项，不把静态映射当运行结果。
```

**依据**：[Sentry 首阶段指令](https://github.com/getsentry/sentry/blob/8891ab865ca741f83cbcd20349bd21c03ad92ffc/static/AGENTS.md#L30-L39)、[阶段二环境选择](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.ts#L8-L39)与[构建消费者断言](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.test.ts#L28-L162)、[双版应用测试](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/scripts/testCi.js#L18-L31)与[类型检查](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/scripts/typecheck.ts#L56-L81)、[完成切换并撤除支架](https://github.com/getsentry/sentry/commit/de3060f736c6dd55836bfae104336a967ec41d8d)。已有候选原核实 2026-11-03，2026-11-08 复核固定源码；这是已完成迁移的历史机制，不是建议 Sentry 继续 V6。本仓未运行该迁移或完成此分支的新读者实做，未验证净收益。

<a id="公开-api库能构建旧调用方仍可能坏"></a>

### 公开 API：给 Agent 原调用方，不只给库的测试

**需要保兼容时，让 Agent 在改动前固定一个真实调用方，再用同一输入、配置与断言验旧版和新版。** 这样能约束它为消除编译错误而改消费者、放宽断言或打开默认功能的做法。项目已有兼容检查就沿用；纯内部重构、没有公开消费者契约时，不统一加一套版本兼容流程。

把以下要求补进当前迁移任务，消费者取自本项目实际支持的调用方式：

```text
先固定现有消费者源码、依赖选项、target 和原生检查命令，记录旧版结果。
迁移后用相同消费者复验；把 API 扫描结果与真实编译、行为结果分开。
默认配置和已有消费者的显式配置分别检查，不为通过而强开新功能。
出现 warning 先用原输入核影响，不直接改行为或抬高检查基线。
若原契约失败，交回最小失败与处理选择；只有任务明确允许破坏性升级，
才修改调用方，并保留新旧行为及迁移说明。
```

**Rust 项目已有 cargo-semver-checks 时**，可先运行 `cargo semver-checks -p <crate> --baseline-root <旧版源码目录> --default-features --color never`，固定工具链，在旧／新消费者副本只切换库版本并更新各自锁文件，再跑原检查与测试。替换占位符，含空格的路径加引号。集成测试或 example 要选对应 target，例如 `cargo check --locked --all-targets`；已有显式 feature 的消费者另验其原选项。0.51.0 的裸命令会启发式选 features，不能当作默认配置的精确对照；跳过项仍是未验。

**实测支持的是这个验收选择，不是对样例库的推荐。** librouting 历史样例里，库自身能构建，旧枚举匹配调用却编译失败；排序 warning 经原输入对照未显示行为变化。另一消费者默认配置通过，原来支持的 `std`-only 配置却失败。因此应保留真实调用与配置，而不是只相信库的自测或扫描。路由认证、队列和计时器的修复细节留在实验中，不是学习本页或使用 Agent 的前提。

**依据与复跑入口**：[公开 API 对照](../../experiments/rust-semver-consumer/README.md)，2026-11-05 Linux 实测（Rust 1.99.0、cargo-semver-checks 0.51.0）；[显式配置对照与旁置修复](../../experiments/rust-semver-consumer/bfd-reader/README.md)，2026-11-08 独立云端实做、11-09 修复复核。前者是最小下游探针，后者来自旧版测试，另加观察探针；只支持所列版本、target 和 features，未证明 Agent 选型或净提效、完整发行兼容或上游采用。本机新读者门槛仍未完成。

### 规则零命中：保留仍兼容的生成代码

Memoh 的 Pinia Colada 0.21.2→1.4.8 升级中，官方规则零命中，原调用不需要该语法转换。149 个生成定义继续通过新版本类型检查，实际只改四个依赖／锁文件；重生成它们没有已证明的收益。

**照这个顺序做：查调用形状 → 更新声明与锁文件 → 验实际消费者 → 核遗漏与已有失败。** 如果目标包括旧缓存兼容，另验同一 profile／origin／会话跨版本的恢复与重新请求。该例类型、构建和相关单测通过，页面与旧缓存未验，全量测试也不是全绿；不能当作完整产品升级已通过。

**依据与复跑入口**：[固定补丁、版本、命令和已知失败](https://github.com/dbvv1/a1dbv/blob/98e7a5987223474ad008140e0dd8ea86a1458dd6/docs/collaboration/local-jobs/A-MIGRATION-ADOPTION-001.md#应用方式与回滚)，2026-10-25 实测。完整产品 QA 后来已取消，不据此重启旧任务。

### 编译通过：还要核真实值与发布产物

Actual 的配置迁移里，LSP 重命名预览报告 success，却没有任何编辑；真正推进的是显式核开发／发布 alias、严格类型检查和运行值断言。被误当作元数据的 `doc` 实际在返回对象里，是字符串字段；正确做法是修类型，保留运行行为。

**照这个顺序做：核实际编辑与 alias → 用真实值定类型 → 修消费者 → 运行构建产物。** 该例 36 项相关回归、typecheck、lint、SSR build、启动与健康检查通过；全量依赖安装、浏览器与完整产品 QA 没有通过结论。

**依据与复跑入口**：[Actual 固定补丁、公开同树与消费者验收](../../experiments/actual-config-type-migration.md)，2026-10-26 实测；原上游投稿已取消。

### 旧 PR 可用：接回新主干仍要验请求

Hermes 的 Anthropic SDK v1 迁移已有实现，但旧 PR 的依赖文件与新主干冲突。接收时只移植必要源码与两处版本 pin，用当前项目包管理器生成锁文件，保住新主干后来增加的 Bedrock timeout 参数和其他依赖。

**照这个顺序做：验固定 PR → 对照当前主干差量 → 适配并生成锁文件 → 验真实 client 与请求。** 该次适配的 178 项相关测试与 14 项原生静态检查通过；请求用真实 SDK 加合成传输核认证头。Mock 返回 200 不能证明请求正确，v1 通过也不证明 v2 可用。没有验证线上 provider、完整 Hermes 或发布矩阵。

**依据与复跑入口**：[固定补丁、隔离环境和完整命令](../../experiments/anthropic-sdk-migration/README.md#hermes-v1-在途迁移接收旧-pr-时保住新主干)，2026-11-01 Linux 实测；这里只引用固定版本结果，不断言 PR 当前状态。

### 事务没报错：重新打开检查业务行

SQLite 父表重建曾级联删掉三条子记录，外键检查仍为空。接收后的实现会拒绝同一危险事务；验证不仅看异常，还重开数据库逐行核数据、schema、STRICT 与后续级联。

**照这个顺序做：确认停写／桥接与事务边界 → 验失败恢复 → 重开核业务行和约束 → 验成功迁移及后续读写。** 只改列名先用原生重命名；整批父子表转换的外键与事务安排按下面实作入口，不在已开始的事务里尝试关闭外键。已有回滚输出和成功阶段的新结构是两种预期，分开接收。

**依据与复跑入口**：[SQLite 关联表实作与合成数据库检查](../research/2026-10-23-sqlite-migration.md)，2026-10-23 实测。未验生产并发、崩溃耐久、真实数据或复杂 schema；不能据此省去生产恢复演练。

### 约束创建成功：还要确认属于目标表

**让 Agent 增加数据库约束时，要求存在性检查与实际修改指向同一张表，再用真实非法输入核约束生效。** PostgreSQL 的 `pg_constraint.conname` 不是全库唯一；Supabase 的真实配方在别表有同名约束时成功退出，却跳过目标表的 CHECK／外键，非法数据仍能写入。查询同时加 `conrelid = 'public.<目标表>'::regclass`，并让 ALTER 与外键引用使用对应 schema，不能只按名字判断已完成。

**保留旧行，失败回滚后重新打开，再验成功与重复执行。** 如果第二项约束因已有非法数据失败，核第一项 DDL 是否一并回滚，不由 Agent 擅自删数据换通过。本例独立 SQL 管理自己的事务，失败后需 `ROLLBACK` 才能继续；已有事务型迁移框架时，沿它的原生入口，不嵌套照抄 `BEGIN`／`COMMIT`。目标表已存在同名但错误定义的约束须另审，重复运行不证明定义正确。

**依据与直接入口**：[修订 SQL、锁定依赖与持久化消费者](../../experiments/constraint-scope-consumer/reader-migration/README.md)，2026-11-08：独立云端读者按本页完成 Supabase [#83](https://github.com/supabase/agent-skills/issues/83) 的既有缺陷，接收后 27 项断言通过并独立复跑；覆盖两种约束、非法旧数据回滚、缺表、正常关闭后重开、合法后续写入与幂等。页面提供路线，SQL 细节来自读者已有知识；使用 PostgreSQL 18.6 的 PGlite 0.5.15 WASM，原生服务、生产并发与框架集成未验，不代表本机读者门槛已通过。

### 迁移器通过：分开核检查配置与测试环境

2026-11-10 云端以 [Factoriolab 迁移前 f785e10](https://github.com/factoriolab/factoriolab/tree/f785e10becb84afd1fe546ac5b4098271207aabd) 重放 Angular 21→22 官方迁移：固定相容依赖后运行 CLI／core `--migrate-only`，迁移与开发构建通过；官方脚本将两项 extended diagnostics 设为 suppress，不能据此称检查强度完全不变。

同两份原消费者 `button.spec.ts` 与 `state/router/migration.spec.ts`，在原 Angular 21.2.12／CLI 21.2.10 与后态 Angular 22.2.5／CLI 22.2.6 下，各用自身官方 unit-test builder、Vitest 4.1.5／jsdom 31.0.0，前后均 29 项通过，原断言和文件哈希不变，当轮独立复核确认上述范围。这是 Node DOM 下的创建与路由迁移回归；未承接原 Karma 的 100% coverage 门槛，不是 ChromeHeadless、完整 CI 或本机新读者验收。隔离环境已重置，原产物及日志现不可回读，未提供复跑包；本页仍为 🟡。
