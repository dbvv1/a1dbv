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
| 依赖大版本升级 | 先核所有仍支持入口的版本契约，再读跨版本指南、用当前包管理器更新声明和锁文件 | 主入口、辅助路径、复制客户端的真实请求都符合原目标；共享 pin 不破坏其他平台 |
| 接收旧迁移 PR | 固定当前主干和候选，只把所需差量接到当前主干；不顺手升级依赖或刷新锁文件 | 用整合后产物验目标行为，也验候选分叉后主干新增的行为 |
| 分阶段切换，多环境仍用不同版本 | 沿 alias、resolver、类型映射与 adapter 核实际 runtime | 每个支持入口对应预期版本；全部切完才撤旧版支架 |
| 公开 API／协议兼容 | 固定旧调用方、配置及协议版本，对照迁移前后 | 原生编译与真实行为都符合契约；自动回退不能证明新版可用 |
| 持久数据结构变化 | 沿项目受支持迁移器，先核写入者、事务与恢复点 | 失败恢复、重开后的业务行／schema、后续读写都通过 |

## 为什么优先这些做法

**框架迁移器先行，Agent 补例外。** Angular 的 signal input 迁移会处理模板、host binding 和 TypeScript 引用，默认跳过不安全转换；不要为多改文件启用可能破坏构建的 best-effort。TanStack Query 的固定规则与历史用户反馈显示，codemod 能处理重复调用，但仍须核跨模块 query key 和自定义 hook；历史遗漏部分后来已修复，不当作当前版本缺陷。让 Agent 审查未改项、补语义和跑消费者，比要求它从零自由改写更合适。

来源：[Angular 官方迁移说明](https://angular.dev/reference/migrations/signal-inputs)、[TanStack 固定规则与夹具](https://github.com/TanStack/query/tree/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads)、[真实用户的成功与遗漏反馈](https://github.com/TanStack/query/issues/6204)；原核实 2026-10-15，保留于[同题比较](../research/2026-10-12-development-maintenance.md#重复代码迁移语法规则类型分析与第二次执行)。

**先试真实消费者，再扩量；待迁声明与全部写入范围分开。** Claude Code 的 fan-out 配方适合先用少量文件调好任务，但跨文件迁移不能机械按文件或 tsconfig 拆开。Angular 的 `--path` 限定待迁的查询声明，目录外引用仍可能被分析和改写；`--analysis-dir` 则会裁掉分析，可能漏改外部引用。重叠配置保持完整，不靠删配置消除重复改写；迁移器报告成功后，仍须核实际 diff、构建和原消费者。

来源：[Claude Code 官方 fan-out](https://code.claude.com/docs/en/best-practices#fan-out-across-files)原核实 2026-10-15；[Angular 查询迁移范围](https://angular.dev/reference/migrations/signal-queries)与[跨配置迁移实测](../../experiments/angular-query-migration/README.md)核实 2026-11-11。采用其分批与范围机制，不声称已证明 Agent 净提效。

<a id="导入已换新运行时可能还没换"></a>

**导入路径换新，不代表运行行为已升级。** Sentry 的 React Router 迁移先通过兼容层维持旧 runtime，再按环境分阶段切新版本，并保留双版本测试与类型检查。让 Agent 给每个实际入口列出 runtime、adapter、允许 API 和检查命令；共享代码兼容所有仍支持的版本，全部切完再清临时支架。单版本升级不另加双矩阵。

来源：[Sentry 迁移指令](https://github.com/getsentry/sentry/blob/8891ab865ca741f83cbcd20349bd21c03ad92ffc/static/AGENTS.md#L30-L39)、[环境选择](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.ts#L8-L39)、[构建消费者断言](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.test.ts#L28-L162)；原核实 2026-11-03，固定源码复核 2026-11-08。这是已完成迁移的历史机制，不是 Sentry 当前仍运行旧版的判断。

**验检查工具的实际规则，别只看绿灯。** ESLint 9→10 时，在原 CI 工作目录、用项目入口分别对根目录和子包的代表文件跑 `eslint --print-config <文件>`，再用一条已知违规核严重度和退出码。v10 从各受检文件所在目录向上找配置；子包可能用另一套规则。若原来就要求统一根配置，用普通模块承载共享实现并从根配置导出，或给该检查显式指定 `--config`。从 CI 和子包钩子的各自工作目录复验：即使配置和目标文件都是绝对路径，指定 `--config` 后相对 `files` 模式仍按工作目录匹配。保留有意设置的子包差异。

在 [ESLint 上游固定夹具](https://github.com/eslint/eslint/tree/4e6c4ac042e321da8fc29ce53ed03c86dcaa44a7/tests/fixtures/lookup-from-file)的根目录对 `subdir/code.js` 实跑：9.39.4 默认是 `no-unused-vars` error／退出 1；同版开启新版查找或 10.0.0 默认都是 warn／退出 0；10.0.0 显式 `--config ./eslint.config.js` 恢复 error／1。根目录的 `code.js` 两版仍是 error／1。依据：[查找规则与旧旗标](https://eslint.org/docs/latest/use/migrate-to-10.0.0#new-configuration-file-lookup-algorithm)、[Gutenberg 把共享实现改为普通模块](https://github.com/WordPress/gutenberg/pull/77215)；2026-11-21 Linux、Node 24.22.3 运行 ESLint 夹具。另用子包范围规则最小样例固定两个绝对路径，只改工作目录，让 v10 从根目录的 error／1 变为子包目录的 warn／0；未运行真实钩子或 Gutenberg 全仓。

## 共享依赖升级：先核是否还能保留原行为

**先画实际调用路径，再动共享版本号。** 主请求能构造、单个响应返回 200，都不能代替辅助请求、流式入口与复制客户端；SDK 的参数层、HTTP 层和服务端 API 版本要分别核。保留真实 SDK，只将网络传输替换成内存消费者，断言最终请求头、body 与失败行为，避免宽松 mock 隐藏迁移缺口。

```text
列出使用该依赖的主/辅助/流式/复制客户端与平台入口。
逐个标出运行版本、认证方式、必须保留的参数语义与现有测试。
先对同一输入跑旧版，再从真实SDK向内存transport发请求：
核真正发出的认证头和body、复制后第二次请求、失败是否错误重试。
目标API没有等价行为时，保留旧版或明确隔离候选，不静默删参数后宣称兼容。
```

Hermes 的 [SDK 2 候选](../../experiments/anthropic-sdk-migration/README.md#sdk2-current-candidate)实际经过 timeout 类型、认证、主/辅助/流式边界的逐层修复；仅改主 helper 会漏掉直接 stream。修好这些局部请求后仍不能更新全产品默认：新的 native API 不再支持非默认采样，官方也要求 Bedrock 旧模型保留旧 SDK/API。第三方网关能够序列化旧参数不等于它接受新版 API header。这类共享 pin 冲突先阻止扩量，不用换模型或删除功能降低原目标。

依据：[官方跨版本升级](https://github.com/anthropics/anthropic-sdk-python/blob/v2.3.0/MIGRATION.md)、[API 支持范围与参数变化](https://platform.claude.com/docs/en/api/migration-2026-10-21)、[真实需求 #142796](https://github.com/NousResearch/hermes-agent/issues/142796)、[Bedrock 原帖与后续对照](https://github.com/anthropics/anthropic-sdk-python/issues/2031#issuecomment-6796169642)；2026-11-13 固定源码与内存请求实测，未调用真实服务。依赖的所有消费者都只有单一平台/简单类型变化时，不额外搭多平台矩阵。

## 接收旧迁移 PR：从当前主干接差量

**先固定当前主干与 PR head 两个提交，不把旧 PR 整棵树当新版。** 把两者分别记作 `base`、`candidate`（下列是占位 ref，先换成已核对的引用）。先查历史，再算分叉：

```bash
git rev-parse --is-shallow-repository
git merge-base base candidate
# 确认有共同基线且所需历史完整后，再运行下面三条。
git rev-list --left-right --count base...candidate
git log --oneline base..candidate
git cherry -v base candidate
```

**浅检出中两个 SHA 都存在，也不代表中间历史齐全。** 找不到共同基线或历史仍在浅边界截断时，先在审查副本补齐两端历史，再判断分叉，不改已固定的 SHA；补齐后仍无共同基线，就不要把它当普通旧 PR 接收。用本仓两个已知祖先关系的提交实跑，深度 1 时找不到共同基线、左右各报 1 个，补齐所需历史后是 0／3。依据：[Git 浅仓库机制](https://git-scm.com/docs/shallow)、[补历史命令](https://git-scm.com/docs/git-fetch#Documentation/git-fetch.txt---deepenltdepthgt)；2026-11-21 Linux 实跑。

**提交历史只判断新旧 SHA；要不要接，查当前主干是否已保留该行为。** `git cherry` 的 `-` 表示主干历史有等价补丁，不表示后来未撤销；`+` 表示没找到等价补丁，不排除通过压缩或重写实现。用 `git show <SHA>` 看补丁，读主干对应文件并跑原回归；已有行为就不重复应用，确有缺项才在当前主干的独立检出接已审差量（单个普通提交可用 `git cherry-pick <SHA>`）。合并提交不靠这份清单判断。变更日志的并列功能可两边都保留；代码冲突按两边的行为和测试合并。

依据：[Git cherry 的补丁等价规则](https://git-scm.com/docs/git-cherry)。2026-11-21 用 cattrs 的[原 Decimal 修复](https://github.com/python-attrs/cattrs/commit/2e883761ca61b076c3de45a5d976952226347c2c)在两个临时基线上实跑：换 SHA 接入后，两棵树相同，但旧命令仍列出原提交；再撤销接入，改动已不在当前树，`git cherry` 却仍标 `-`。这两次仅验证 Git 的区分方法，库行为另按下方消费者跑。

[cattrs 的读者复跑](../../reader-tests/A-MIGRATION-CATTRS-DECIMAL-READER-20261114-u1.md)中，旧 PR 比基线少 6 个提交，只多 1 个。旧 PR wheel 的 Decimal 消费者 24/24 通过，却有 6 项 typed-deque 回归失败；接到现有基线后两组 24/24、11/11 都过。当时为 Windows / CPython、JSON／PyYAML Decimal 和 typed-deque 子集；下方另有同口径 Linux 复跑。修订页仍未由新读者复测。

### Python 库的发布验收：安装三个 wheel，让同一消费者说话

1. **各自构建基线、旧候选、整合三个 wheel。** 按源码提交、实际受检树与 wheel 的 SHA-256 核身份，不按生成的开发版本号推断候选更新；分开输出目录，每个新环境只装一个 wheel。用该环境的解释器核 `cattrs.__file__`（其他库换成相应模块），路径必须在该环境，不从工作树导入。两个 wheel 的版本字符串也可能相同。
2. **同一份新增行为检查＋同一份主干回归，分别跑三次。** 新行为在旧基线应因预定原因失败，主干保护则应在基线通过。不要从每个旧候选自己取“主干回归”，否则它落后的测试也会一起消失。
3. **只收“两列都绿”的整合包。** 收原始退出码、预期失败诊断、日志及包哈希，不能用观察脚本的“成功写 JSON”代替 pytest 结果。

| cattrs 的同一份测试 | 基线包 | 旧 PR 包 | 整合包 |
|---|---:|---:|---:|
| Decimal JSON／PyYAML 消费者 | 2 过、22 失败 | 24/24 | 24/24 |
| 来自基线的 msgspec typed-deque | 11/11 | 5 过、6 失败 | 11/11 |

从本仓根目录可直接复跑这三份公开源码与产物（Bash 4+、Git、CPython 3.12、uv；需下载公开依赖）：

```sh
bash artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/replay_posix.sh
```

[脚本](../../artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/replay_posix.sh)只在新临时目录工作，输出 6 组日志及 `builds.tsv`，不覆盖既有证据；结果已在 Linux CPython 3.12.14 复跑。这是固定案例的 wheel 验收，不是自动整合任意 PR，也不替代 Windows 原生或上游完整 CI。

## 怎样验收，什么时候停止扩量

<a id="公开-api库能构建旧调用方仍可能坏"></a>

1. **同一个消费者前后对照。** 保留输入、依赖选项、target 与断言；公开 API 的编译破坏和行为变化分开核。协议固定两代分别调用，不能用自动降级后的成功替代新版通过。
2. **先确认原生环境和源码完整，再按实际交付形式检查。** checkout 失败或包导入异常时，先核缺失文件、路径与实际解释器，不把环境故障当迁移红灯。局部消费者可以继续定位，但缺文件的源码副本不能作为整仓升级依据；Windows 使用原生解释器和短工作路径，不用 WSL 结果替代。类型检查之外运行构建后的入口；发布 wheel／库时从独立环境安装产物，不拿源码目录的成功代替发行包。审查迁移器改动的检查选项；换测试 runner 时单列环境、原断言与覆盖率门槛的差异，替代环境通过只补充对应证据，不代替原 CI。数据迁移须重开并核业务行，事务未报错或外键检查为空都不足够。
3. **出现破坏先修，不降低原目标。** 规则漏改、消费者失败或主干行为丢失时停止扩量；缺依赖按项目方式准备，缺 UI／旧缓存验收就保留候选。已经写入新状态时先核恢复点与新增数据，反向应用依赖补丁不能恢复数据库。

<a id="test-runner-named-config"></a>

**换测试 runner 时，验 CI 实际用的命名配置，不只跑默认命令。** 例如 Angular 的 `ng test --configuration ci`：从 `angular.json` 的 `test.configurations.ci` 读出 `buildTarget`，到对应构建配置核迁移前继承的 `styles`／`assets`、显式 `aot` 与覆盖项，再跑原 CI 命令。默认目标正确，不能替代命名目标通过。

2026-11-22 用官方 `SchematicTestRunner` 在同一上游夹具上执行三版迁移：`@schematics/angular@22.3.0` 默认目标保留样式和 `aot: true`，但仅覆盖 `watch` 的 `ci` 丢了样式、AOT 变成 `false`；[候选前一提交](https://github.com/angular/angular-cli/commit/79620cf808406607d4aeb7b05ae561796eac4df7)恢复了样式仍没恢复 AOT；[候选提交](https://github.com/angular/angular-cli/commit/5846b1857126c3b49d61cb7e2038e99247d51fb0)两项都保留。仅验生成的配置和两个断言，未跑浏览器或整套 CI；[#34405](https://github.com/angular/angular-cli/pull/34405)核实当时未合并。[Angular 官方指南](https://angular.dev/guide/testing/migrating-to-vitest)对 Node DOM、浏览器及 reporter／覆盖率配置的区分原核实 2026-11-10。

**核源码齐不齐，先对固定提交的文件清单，再查磁盘；不用为此补齐全部历史。** 用 `git ls-tree -r --full-tree --name-only <固定提交>` 列路径，逐项确认本轮需要的文件实际在磁盘上；要验证完整源码，就核全表。普通跟踪文件核内容时，在可信仓库根用 `git hash-object --path=path/to/file -- path/to/file` 按当前生效属性算 Git blob，再和 `git rev-parse '<固定提交>:path/to/file'` 比。不一致先核 `git check-attr -a -- path/to/file` 和过滤配置；既不把 CRLF 的原始字节差异当改动，也不为对上哈希改规则。链接、子模块与产物按各自用法另外验，不能靠文本哈希确认可用。

在 Git 2.56.1 的合成仓实跑：同一深度 1 的提交可完整检出，也可由稀疏检出漏掉消费者文件而 `git status` 干净；CRLF 文件的原始哈希不匹配，按路径转换后匹配，改正文后转换哈希仍能发现差异。依据：[Git 目录树](https://git-scm.com/docs/git-ls-tree)、[按路径计算 blob](https://git-scm.com/docs/git-hash-object)与[换行规则](https://git-scm.com/docs/gitattributes#_end_of_line_conversion)；2026-11-22 Linux 合成验证，未跑原生 Windows 或真实迁移。

本页不适用于把纯内部重构统一升级成双版本兼容流程；没有持久状态的语法改写也无需数据库恢复演练。批量与并行只在迁移单元可独立接收时增加。

[历史实测、读者卡点与未验范围](../research/2026-11-10-migration-case-evidence.md)：原任务证据保留；Windows 新读者已采用路线完成旧/新 SDK 局部消费者，路径卡点已改回步骤；改后路线尚未通过两项真实任务及新读者复测，保持 🟡。
