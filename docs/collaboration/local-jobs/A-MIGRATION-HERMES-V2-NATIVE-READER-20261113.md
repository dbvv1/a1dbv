id: A-MIGRATION-HERMES-V2-NATIVE-READER-20261113
owner: dot-A
status: accepted
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: e43f4e047932b1c0d7d18c713e095aa621609167
result_branch: relay/a-migration-hermes-v2-native-reader-20261113
page: docs/decisions/migrations.md@77345c97fbbec5bcf50ddafa83766fe91de362ef
## 读者能力与真实任务
让读者照当前迁移页接收真实依赖升级候选，而不是只看 mock 返回成功。本仓 Hermes SDK2 候选 Linux 契约已验，Windows 原生消费者尚缺；本单元用当前页面路线做这项待验，采用结果决定候选可复用范围，不改 Hermes 共享 pin 或上游 PR。
与 A-MIGRATION-HERMES-V2-CONSUMERS-20261113 的静态调用链核对独立，不修改该卡或重复其事实报告。本任务不是第二独立项目的迁移证据，不能单凭它将整页改为 ✅。
## 执行与写入边界
选未读过此页、未参与 Hermes 候选写作或审查的本机读者，全文在下方。读者仅照页面及其所链接的原项目指南完成；记录每次另查资料、卡住、误做的位置，不改页面，不补能力说明进页面。
只新增 docs/collaboration/local-jobs/artifacts/A-MIGRATION-HERMES-V2-NATIVE-READER-20261113/result.md 和同目录脱敏验收数据；接收端可回写本卡。源码只在独立临时副本操作；不修改其他卡、答案页、既有实验或 receiver。不得使用已有读者审查结论当自己的结果。
固定 Hermes c9b20d7bc08dec1e10779a06d7d9073bc6e7e418 和 a1dbv 候选 77345c97。按项目 PM 准备两个隔离环境，允许官方依赖安装，不读个人配置，不改全局设置。只用内存 transport 和合成值；禁止真实模型、网关、Azure/AWS/Anthropic 服务、账号或凭据操作。不得新增上游通信。
## 验收
1. 按页面先列本任务实际入口、保留行为和不支持范围，再按链接的候选重放入口在本机操作；冻结补丁 hash 与实际 SDK/Python/OS、所用命令。
2. 旧版与候选分别运行已保存 independent-native.py 的七项消费者；候选另跑边界与网关控制，记录逐项 passed/failed/skip。真实 SDK 请求只进入内存 transport；网关序列化不算服务兼容。
3. 不删除断言、不换模型掩盖非默认采样缺口；保持旧模型支持边界，不能以 native 局部通过升级全产品。若 Windows 项目 runner 不可用，记录具体卡点和已完成层，不以 WSL/POSIX 成功替代 Windows。
4. 报告本任务是否确实采用页面路线、卡点与未验范围，保留失败后修复的轮次。独立验收者核实际原始测试输出/断言与版本，不采信读者自报；脱敏后交回，不改页面或默认。
5. check_repo、check_public、git diff --check；review_ready，不自动接收。普通单元不超过2小时，超时保存现有产物并写恢复点，不重复启动；遵守共享4并发/1GPU，本卡不用GPU。
## 当前结果

- reader-test 一轮完成：读者按页面共享依赖升级路线，在 Windows 11 x64 / CPython 3.14.9 原生完成 Hermes c9b20d7 候选补丁（SHA256 2a38c55c…）实测，旧/候选各由项目 PM 建独立环境；旧与候选 independent-native.py 七项各 7 passed/0 failed/0 skipped，候选边界 8 + 网关控制 3 共 11 passed，3 文件门禁 18 passed；git diff --check、check_public、check_repo 均退出 0，未提交未推送。taskDone=true，reviewed=false（核对者 openIssues 未清）。pageStuck：页面与候选 README 未写 Windows 260 字符 MAX_PATH 前提（PM ruamel 271 字符 ImportError、长路径解释器导入 269 字符 anthropic ModuleNotFoundError、website/plugins 32 个文件未落地），且示例用 Linux bin/python 而非 Windows Scripts/python.exe。未运行/未验：真实模型与网关、Bedrock/Foundry、OAuth 刷新、async client、完整 Hermes 应用、发布产物与其他 OS；native 非默认采样仍被明确拒绝，属升级阻塞，不能据此把整页改 ✅ 或升级全产品默认。证据链未闭合：hermes 最终仍是 blob:none 部分克隆且缺 32 个非门禁文件，hermes-old 无 .git 且未记录复制方式，主线程直接 stream open_sdk2_stream 未在门禁覆盖，native-consumers.json 边界项使用自定标签而非 pytest node id。
- 产物：[657f2eb](https://github.com/dbvv1/a1dbv/commit/657f2eb7645eaff846a312bd97356f79761b46d5)，分支 `relay/a-migration-hermes-v2-native-reader-20261113`。
- 检查：check_public（文件与新提交身份）、check_repo（已提交产物树） 通过；非读者核对有未解决项或未完成，交负责人接收。
- 下一步：负责人接收本卡并处理 openIssues：补记部分克隆与 32 个缺失文件、hermes-old 来源；补验或明确标注主线程 open_sdk2_stream 未覆盖；如需定稿，补边界项标签与实际 node id 映射。reader-test 不自动重读。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。

## 给读者的页面全文（仅去空行并将相对链接固定到原版本，不另写操作辅导）
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
来源：[Angular 官方迁移说明](https://angular.dev/reference/migrations/signal-inputs)、[TanStack 固定规则与夹具](https://github.com/TanStack/query/tree/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads)、[真实用户的成功与遗漏反馈](https://github.com/TanStack/query/issues/6204)；原核实 2026-10-15，保留于[同题比较](https://github.com/dbvv1/a1dbv/blob/77345c97fbbec5bcf50ddafa83766fe91de362ef/docs/research/2026-10-12-development-maintenance.md#重复代码迁移语法规则类型分析与第二次执行)。
**先试真实消费者，再扩量；待迁声明与全部写入范围分开。** Claude Code 的 fan-out 配方适合先用少量文件调好任务，但跨文件迁移不能机械按文件或 tsconfig 拆开。Angular 的 `--path` 限定待迁的查询声明，目录外引用仍可能被分析和改写；`--analysis-dir` 则会裁掉分析，可能漏改外部引用。重叠配置保持完整，不靠删配置消除重复改写；迁移器报告成功后，仍须核实际 diff、构建和原消费者。
来源：[Claude Code 官方 fan-out](https://code.claude.com/docs/en/best-practices#fan-out-across-files)原核实 2026-10-15；[Angular 查询迁移范围](https://angular.dev/reference/migrations/signal-queries)与[跨配置迁移实测](https://github.com/dbvv1/a1dbv/blob/77345c97fbbec5bcf50ddafa83766fe91de362ef/experiments/angular-query-migration/README.md)核实 2026-11-11。采用其分批与范围机制，不声称已证明 Agent 净提效。
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
Hermes 的 [SDK 2 候选](https://github.com/dbvv1/a1dbv/blob/77345c97fbbec5bcf50ddafa83766fe91de362ef/experiments/anthropic-sdk-migration/README.md#sdk2-current-candidate)实际经过 timeout 类型、认证、主/辅助/流式边界的逐层修复；仅改主 helper 会漏掉直接 stream。修好这些局部请求后仍不能更新全产品默认：新的 native API 不再支持非默认采样，官方也要求 Bedrock 旧模型保留旧 SDK/API。第三方网关能够序列化旧参数不等于它接受新版 API header。这类共享 pin 冲突先阻止扩量，不用换模型或删除功能降低原目标。
依据：[官方跨版本升级](https://github.com/anthropics/anthropic-sdk-python/blob/v2.3.0/MIGRATION.md)、[API 支持范围与参数变化](https://platform.claude.com/docs/en/api/migration-2026-10-21)、[真实需求 #142796](https://github.com/NousResearch/hermes-agent/issues/142796)、[Bedrock 原帖与后续对照](https://github.com/anthropics/anthropic-sdk-python/issues/2031#issuecomment-6796169642)；2026-11-13 固定源码与内存请求实测，未调用真实服务。依赖的所有消费者都只有单一平台/简单类型变化时，不额外搭多平台矩阵。
## 怎样验收，什么时候停止扩量
<a id="公开-api库能构建旧调用方仍可能坏"></a>
1. **同一个消费者前后对照。** 保留输入、依赖选项、target 与断言；公开 API 的编译破坏和行为变化分开核。协议固定两代分别调用，不能用自动降级后的成功替代新版通过。
2. **按实际交付形式检查。** 类型检查之外运行构建后的入口；发布 wheel／库时从独立环境安装产物，不拿源码目录的成功代替发行包。审查迁移器改动的检查选项；换测试 runner 时单列环境、原断言与覆盖率门槛的差异，替代环境通过只补充对应证据，不代替原 CI。数据迁移须重开并核业务行，事务未报错或外键检查为空都不足够。
3. **出现破坏先修，不降低原目标。** 规则漏改、消费者失败或主干行为丢失时停止扩量；缺依赖按项目方式准备，缺 UI／旧缓存验收就保留候选。已经写入新状态时先核恢复点与新增数据，反向应用依赖补丁不能恢复数据库。
来源：[Angular 官方 Karma→Vitest 迁移指南](https://angular.dev/guide/testing/migrating-to-vitest)区分默认 Node DOM、真实浏览器与需另迁的 reporter／覆盖率配置；核实 2026-11-10。
本页不适用于把纯内部重构统一升级成双版本兼容流程；没有持久状态的语法改写也无需数据库恢复演练。批量与并行只在迁移单元可独立接收时增加。
[历史实测、读者卡点与未验范围](https://github.com/dbvv1/a1dbv/blob/77345c97fbbec5bcf50ddafa83766fe91de362ef/docs/research/2026-11-10-migration-case-evidence.md)：原任务证据保留；当前版本核心路线尚未通过两项真实任务及本机新读者验收，保持 🟡。

## 负责人接收
接收 657f2eb7 的 Windows 原生局部消费者证据：原/候选 native 各7、候选runner18；负责人核原始win32逐项输出、冻结测试断言、补丁hash。保留32文件未落地及路径返工；不是完整源码/产品验收，也不是页面首次无卡点通过。当前路线补入源码完整性和Windows路径前提；改后页面尚待新读者，地图保持🟡。
