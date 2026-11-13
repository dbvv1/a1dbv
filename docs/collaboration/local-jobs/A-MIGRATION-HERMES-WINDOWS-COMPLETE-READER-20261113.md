id: A-MIGRATION-HERMES-WINDOWS-COMPLETE-READER-20261113
owner: dot-A
status: ready
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 146697f97fa8644702371a26f10c349a99f8c100
result_branch: relay/a-migration-hermes-windows-complete-reader-20261113
page: docs/decisions/migrations.md@a5324e32ae3258e78c7986c39091b0c29a341ed3
## 读者能力与真实欠项
推进地图「遗留代码与大迁移」🟡：本仓保留的Hermes SDK2候选有Windows局部消费者结果，但原副本缺32个文件，无法作为完整源码上的候选验收。请未读过改后页面、未参与前次实测的读者，照下方完整页面及它链接的候选入口，在完整Windows原生源码副本完成候选接收。消除实际未完成的源码前提，不为重新计数复跑存量，不将本例当第二个独立项目。
旧两卡已accepted，无同写域在途；不改它们，不重用其测试通过声明，不读取旧读者报告作为操作教程。页面链接所含历史证据只供来源，先自行按步骤执行，卡点原样记下。
## 范围
固定Hermes c9b20d7bc08dec1e10779a06d7d9073bc6e7e418、a1dbv候选与页面a5324e32。只在新的独立副本操作；不得碰旧工作区/旧任务进程、接收端脚本或全局设置。允许按Hermes PM安装官方依赖，禁止裸pip修改产品环境，不改安全/长路径系统设置。
只新增 docs/collaboration/local-jobs/artifacts/A-MIGRATION-HERMES-WINDOWS-COMPLETE-READER-20261113/result.md 与同目录脱敏原始输出/机器可读验收。接收端可回写本卡；读者不改答案页、实验README、候选、测试断言或其他卡。
只用合成键与内存transport；不启动完整助手或真实模型/网关/Azure/AWS服务，不读私人配置/对话/凭据，不新增上游PR或评论，不升级产品默认。
## 顺序与验收
1. 原生win32环境从页面选路，固定源码并证明checkout完整：列Git跟踪文件总数，逐项核实际文件存在且blob内容一致；记录缺失/变更数量，不能仅以HEAD正确证明完整。未打补丁前缺失或内容不符必须为0；不要靠删Git清单、忽略错误或改系统设置凑齐。
2. 按页面链接的候选README在独立环境重放，核补丁hash；原/候选两树、环境互不覆盖。按原项目入口验旧native七项与候选边界/native/网关三文件；保留版本、命令、逐项结果与原始退出码。WSL不替代win32。
3. 完整源码不等于完整产品通过，继续保留非默认采样、Bedrock旧模型、真实网关边界；只接收本任务实际消费者，不删断言、不更换模型伪装兼容。
4. 记录首次卡点、另查资料、返工和是否采用改后步骤；不能直接照做时如实失败，报告缺哪步，不改页。非读者按原始输出、源码完整性数据与冻结测试独立验收，不只采信自报。
5. 运行check_repo/check_public/git diff --check，review_ready，不自动合main。普通单元最多2小时，共享最多4并发/1GPU，本卡无GPU；超时保存结果与恢复点，不从头重试。
## 当前结果
待领取。发布不是执行；本次只补完整源码前提与改后路线的新读者采用，不预先承诺通过或✅。
## 页面全文（只去空行并固定相对链接，不额外辅导）
# 遗留代码与大迁移：怎样选改法、保住原行为
**🟡 先确认目标版本仍支持必须保留的平台与行为，再让 Agent 用官方迁移器处理重复改写、补例外；先验真实消费者，再扩量。** 跨文件类型迁移保留完整分析范围，已有迁移 PR 接必要差量，不从头重写。选路以目标框架和当前版本为准，不以 Agent 能改多少文件为准。
## 起手提示：交目标、兼容要求和真实消费者
```text
在 [仓库] 完成 [旧状态 → 新状态]，保留 [必须兼容的输入、行为和数据]。
先核主干、工作树、在途实现、实际依赖版本和项目检查入口。
列出仍须支持的平台、调用入口与不可丢失的行为；目标版本不支持的先保留旧版，不用删除参数或关闭旧入口伪装兼容。
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
| 依赖大版本升级／接收旧 PR | 先核所有仍支持入口的版本契约，再读跨版本指南、用当前包管理器更新声明和锁文件 | 主入口、辅助路径、复制客户端的真实请求都符合原目标；共享 pin 不破坏其他平台 |
| 分阶段切换，多环境仍用不同版本 | 沿 alias、resolver、类型映射与 adapter 核实际 runtime | 每个支持入口对应预期版本；全部切完才撤旧版支架 |
| 公开 API／协议兼容 | 固定旧调用方、配置及协议版本，对照迁移前后 | 原生编译与真实行为都符合契约；自动回退不能证明新版可用 |
| 持久数据结构变化 | 沿项目受支持迁移器，先核写入者、事务与恢复点 | 失败恢复、重开后的业务行／schema、后续读写都通过 |
## 为什么优先这些做法
**框架迁移器先行，Agent 补例外。** Angular 的 signal input 迁移会处理模板、host binding 和 TypeScript 引用，默认跳过不安全转换；不要为多改文件启用可能破坏构建的 best-effort。TanStack Query 的固定规则与历史用户反馈显示，codemod 能处理重复调用，但仍须核跨模块 query key 和自定义 hook；历史遗漏部分后来已修复，不当作当前版本缺陷。让 Agent 审查未改项、补语义和跑消费者，比要求它从零自由改写更合适。
来源：[Angular 官方迁移说明](https://angular.dev/reference/migrations/signal-inputs)、[TanStack 固定规则与夹具](https://github.com/TanStack/query/tree/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads)、[真实用户的成功与遗漏反馈](https://github.com/TanStack/query/issues/6204)；原核实 2026-10-15，保留于[同题比较](https://github.com/dbvv1/a1dbv/blob/a5324e32ae3258e78c7986c39091b0c29a341ed3/docs/research/2026-10-12-development-maintenance.md#重复代码迁移语法规则类型分析与第二次执行)。
**先试真实消费者，再扩量；待迁声明与全部写入范围分开。** Claude Code 的 fan-out 配方适合先用少量文件调好任务，但跨文件迁移不能机械按文件或 tsconfig 拆开。Angular 的 `--path` 限定待迁的查询声明，目录外引用仍可能被分析和改写；`--analysis-dir` 则会裁掉分析，可能漏改外部引用。重叠配置保持完整，不靠删配置消除重复改写；迁移器报告成功后，仍须核实际 diff、构建和原消费者。
来源：[Claude Code 官方 fan-out](https://code.claude.com/docs/en/best-practices#fan-out-across-files)原核实 2026-10-15；[Angular 查询迁移范围](https://angular.dev/reference/migrations/signal-queries)与[跨配置迁移实测](https://github.com/dbvv1/a1dbv/blob/a5324e32ae3258e78c7986c39091b0c29a341ed3/experiments/angular-query-migration/README.md)核实 2026-11-11。采用其分批与范围机制，不声称已证明 Agent 净提效。
<a id="导入已换新运行时可能还没换"></a>
**导入路径换新，不代表运行行为已升级。** Sentry 的 React Router 迁移先通过兼容层维持旧 runtime，再按环境分阶段切新版本，并保留双版本测试与类型检查。让 Agent 给每个实际入口列出 runtime、adapter、允许 API 和检查命令；共享代码兼容所有仍支持的版本，全部切完再清临时支架。单版本升级不另加双矩阵。
来源：[Sentry 迁移指令](https://github.com/getsentry/sentry/blob/8891ab865ca741f83cbcd20349bd21c03ad92ffc/static/AGENTS.md#L30-L39)、[环境选择](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.ts#L8-L39)、[构建消费者断言](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.test.ts#L28-L162)；原核实 2026-11-03，固定源码复核 2026-11-08。这是已完成迁移的历史机制，不是 Sentry 当前仍运行旧版的判断。
## 共享依赖升级：先核是否还能保留原行为
**先画实际调用路径，再动共享版本号。** 主请求能构造、单个响应返回 200，都不能代替辅助请求、流式入口与复制客户端；SDK 的参数层、HTTP 层和服务端 API 版本要分别核。保留真实 SDK，只将网络传输替换成内存消费者，断言最终请求头、body 与失败行为，避免宽松 mock 隐藏迁移缺口。
```text
列出使用该依赖的主/辅助/流式/复制客户端与平台入口。
逐个标出运行版本、认证方式、必须保留的参数语义与现有测试。
先对同一输入跑旧版，再从真实SDK向内存transport发请求：
核真正发出的认证头和body、复制后第二次请求、失败是否错误重试。
目标API没有等价行为时，保留旧版或明确隔离候选，不静默删参数后宣称兼容。
```
Hermes 的 [SDK 2 候选](https://github.com/dbvv1/a1dbv/blob/a5324e32ae3258e78c7986c39091b0c29a341ed3/experiments/anthropic-sdk-migration/README.md#sdk2-current-candidate)实际经过 timeout 类型、认证、主/辅助/流式边界的逐层修复；仅改主 helper 会漏掉直接 stream。修好这些局部请求后仍不能更新全产品默认：新的 native API 不再支持非默认采样，官方也要求 Bedrock 旧模型保留旧 SDK/API。第三方网关能够序列化旧参数不等于它接受新版 API header。这类共享 pin 冲突先阻止扩量，不用换模型或删除功能降低原目标。
依据：[官方跨版本升级](https://github.com/anthropics/anthropic-sdk-python/blob/v2.3.0/MIGRATION.md)、[API 支持范围与参数变化](https://platform.claude.com/docs/en/api/migration-2026-10-21)、[真实需求 #142796](https://github.com/NousResearch/hermes-agent/issues/142796)、[Bedrock 原帖与后续对照](https://github.com/anthropics/anthropic-sdk-python/issues/2031#issuecomment-6796169642)；2026-11-13 固定源码与内存请求实测，未调用真实服务。依赖的所有消费者都只有单一平台/简单类型变化时，不额外搭多平台矩阵。
## 怎样验收，什么时候停止扩量
<a id="公开-api库能构建旧调用方仍可能坏"></a>
1. **同一个消费者前后对照。** 保留输入、依赖选项、target 与断言；公开 API 的编译破坏和行为变化分开核。协议固定两代分别调用，不能用自动降级后的成功替代新版通过。
2. **先确认原生环境和源码完整，再按实际交付形式检查。** checkout 失败或包导入异常时，先核缺失文件、路径与实际解释器，不把环境故障当迁移红灯。局部消费者可以继续定位，但缺文件的源码副本不能作为整仓升级依据；Windows 使用原生解释器和短工作路径，不用 WSL 结果替代。类型检查之外运行构建后的入口；发布 wheel／库时从独立环境安装产物，不拿源码目录的成功代替发行包。审查迁移器改动的检查选项；换测试 runner 时单列环境、原断言与覆盖率门槛的差异，替代环境通过只补充对应证据，不代替原 CI。数据迁移须重开并核业务行，事务未报错或外键检查为空都不足够。
3. **出现破坏先修，不降低原目标。** 规则漏改、消费者失败或主干行为丢失时停止扩量；缺依赖按项目方式准备，缺 UI／旧缓存验收就保留候选。已经写入新状态时先核恢复点与新增数据，反向应用依赖补丁不能恢复数据库。
来源：[Angular 官方 Karma→Vitest 迁移指南](https://angular.dev/guide/testing/migrating-to-vitest)区分默认 Node DOM、真实浏览器与需另迁的 reporter／覆盖率配置；核实 2026-11-10。
本页不适用于把纯内部重构统一升级成双版本兼容流程；没有持久状态的语法改写也无需数据库恢复演练。批量与并行只在迁移单元可独立接收时增加。
[历史实测、读者卡点与未验范围](https://github.com/dbvv1/a1dbv/blob/a5324e32ae3258e78c7986c39091b0c29a341ed3/docs/research/2026-11-10-migration-case-evidence.md)：原任务证据保留；Windows 新读者已采用路线完成旧/新 SDK 局部消费者，路径卡点已改回步骤；改后路线尚未通过两项真实任务及新读者复测，保持 🟡。
