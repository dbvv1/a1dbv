# 遗留代码与大迁移：先按改动形状选路径，再按真实消费者验收

> **候选页，仍未通过完整读者验收。** 本页复用 Actual、Memoh、SQLite 与 Hermes 的迁移记录，并据 Extruct 真实读者卡点修订入口；各例范围见文末。

**先按改动形状选路，再拿真实消费者验收。** 适用于要批量改语法、把 JS 迁到 TS 或改跨文件引用、升级依赖大版本，或改带持久数据的表结构。重复变换先用现成规则，类型和框架分析按消费者需要引入，Agent 只处理例外；数据变化另保写入者、事务与恢复边界。**规则命中数、编译成功、补丁能应用，都不等于业务兼容。**

最小起步提示词（按已验任务的共同顺序整理）：

```text
先判断这次改动属于哪一类：重复语法变换、跨文件类型／引用、依赖版本升级、含持久数据的结构变化。
写出要保留的现有行为和真实消费者。只使用项目已有的迁移器、包管理器和检查入口；先在一个代表性模块或消费者上试，
列出已改、未改和例外，再决定是否扩量。完成后再按真实入口验收；不要先全量重写，也不要用 reset／seed 代替迁移。
```

| 改动形状 | 先做什么 | 验收入口 | 本次依据 |
|---|---|---|---|
| 重复语法变换 | 用官方 codemod／ast-grep 规则做机械变换，按变换形状与例外选择试点，再核命中、未改和警告 | 新旧形状、跨文件引用、业务例外；再有类型／构建／相关回归 | Memoh 上规则 0 命中，149 个生成定义保留；正命中机制另见下方研究链接 |
| 跨文件类型／引用 | 类型或框架迁移器；先核编辑清单与开发／发布 alias；严格编译和真实运行值共同定类型 | 原生 typecheck／lint、相关回归、构建后启动与健康检查 | Actual 配置迁移 |
| 依赖版本升级 | 先核在途迁移和当前主干，再用项目包管理器；规则零命中时核是否本来无需改，保留新主干行为与非目标依赖 | 有契约修复时核旧码真红；再验相关消费者、实际请求／运行值，产品与缓存另验 | Memoh Colada；Hermes Anthropic v1 在途 PR 接收 |
| 含持久数据的结构变化 | 保留既有受支持迁移器；先分单表／整批和外键边界，再定写入者、事务与恢复点 | 关闭后重新打开，核业务行、schema、列类型／约束和后续级联 | SQLite 关联表升级 |

**已有在途迁移，先接收必要差量，不从零重写，也不拿旧文件覆盖新主干。** 这个入口适用于每条路径，不只依赖升级：固定当前主干与原实现的父子提交，拆出本任务需要的文件，逐项保住主干后来增加的行为和测试；捆绑的打包、依赖或 CI 改动另判是否必要。

只写会改变做法的分支；其余按项目现有检查走。

## 三个容易把“绿色”当通过的地方

1. **Memoh 的规则零命中，不代表生成定义要重写。** 官方 Pinia Colada 0.21→1.0 codemod 在 `apps` 与 `packages` 上命中 0；源码扫描 111 个引用或模拟 `@pinia/colada` 的文件（92 个直接导入），128 处 `useQuery`／`useQueryState` 全是单参，没有 two-arg 调用。149 个生成的 `defineQueryOptions` 和 7 个消费者继续用同一份 1.4.8 类型，重生成或加显式泛型没有已证明的收益。实际改变只有 4 个文件（两个 app 的依赖声明、SDK peer、锁文件），0 源码改动。
2. **Actual 的编译绿，还要核运行值和发布入口。** OMP 18.12.6 的 `rename_file` 预览返回 success，但原始编辑是 `{ "changes": {} }`；不要据此自动 apply。真正推进的是显式检查开发／发布 alias、严格编译反馈和实际配置对象断言：编译指出 OpenID 消费者反复调用 `config.get()` 后无法保持数值窄化，运行断言又发现被当作元数据的 `doc` 实际包含字符串。类型检查通过时仍要保留运行行为；实际 Vite 产物是 `app.js`、`scripts/health-check.js` 和 chunks，按这些真实入口验收，而不是按源路径推断发布文件。
3. **SQLite 的事务返回或外键检查为空，不代表子记录还在。** 旧 `transform()` 重建父表时级联删光三行 books，`foreign_key_check` 仍返回空；接收后的库会拒绝同一危险事务，保留原数据和结构。必须重新打开数据库，逐行核两位作者、三本书、列类型与 STRICT，再在副本核后续级联；只验“约束有效”或进程退出码会漏掉整批数据丢失。

## 按路径操作

### 重复语法变换：机械改写交规则，例外交 Agent

已有迁移实现时先接收必要差量；需要批量改写时，优先用现成 codemod／ast-grep 规则，记录已改、未改和警告／跳过项。先在代表性文件上试，核调用覆盖和旧／新形状，不要从第一次成功退出直接推到全量。

**测试风格迁移也从这里起步，但断言改写不是语义验收。** 先把当前主干的用例与子场景映射到候选，再逐项核预期值、异常类型及对象身份、日志、循环输入和 fixture／setUp 重置；参数化可以改变 node ID 或数量，不能因此删掉场景。已有 PR 落后于主干时，保留后来新增的测试，再适配旧差量；局部保留 TestCase 等兼容写法须说明范围，不能称已彻底替换测试框架。

- **停止扩量**：出现额外变换、覆盖不清、例外增多，就停下，修规则或退回局部 Agent 补丁；分片时保证文件归属不重叠。
- **重复执行**：一次性迁移器从可恢复起点重做；同一批处理先在首轮产物上重跑，看是否还变。幂等不等于业务行为正确。
- **本次边界**：Memoh 只用官方规则作“应无命中”的覆盖检查，没有为工具制造目标调用，也没有可报告的正命中节省；重复变换的收益仍按项目覆盖和未改项判断，不推广为工具排名。规则正命中的覆盖与未改项判断沿用[开发维护研究中的 TanStack／Angular 证据](../../../../research/2026-10-12-development-maintenance.md#重复代码迁移语法规则类型分析与第二次执行)（15 §5 由此转链），本页不新增正命中收益结论。

### 跨文件类型／引用：编译和运行值共同定类型

Actual 的固定基线是 `actualbudget/actual@2ccf885b42dbac5f4aaf287be051e4d0a799f684`；已审的 `446264b59ca80871f7fb21cc4b3cb8cc9cc5fdc5` 是本地产品树，公开远端不能直接 checkout，其相同树在 fork `dbvv1/actual` 的分支 `dot-a/load-config-typescript-1483`，远端为 `43bd1c0b1388dba9f2dd48a9b878f5657afc258d`。补丁与记录见[采用记录](../../../../../experiments/actual-config-type-migration.md)和[任务卡](../../A-TYPE-MIGRATION-ADOPTION-001.md)。操作顺序：

1. 有 LSP 重命名预览就先核真实编辑清单；空编辑不要求另造改动，手动检查开发 alias 是否指向 `.ts`、发布映射是否保留 `.js`。
2. 用显式配置类型承接自定义值转换；外部校验值先 `unknown` 再按实际类型窄化，不加 `any` 或严格忽略。到期值用 number／两个特殊字符串的联合，消费者改为读取一次再分支。
3. 编译通过后跑真实值断言；类型与实际返回值冲突时，修正类型和断言，保留运行行为，不为类型假设改业务。
4. 用相关回归和构建后入口接收，不只停在 typecheck。

先准备可执行状态：clone 上游 `https://github.com/actualbudget/actual` 并 checkout `2ccf885b`，应用 a1dbv 仓库内的[固定补丁](../../../../../experiments/actual-config-type-migration.patch)；或 `git clone https://github.com/dbvv1/actual` 后 checkout `43bd1c0b1388dba9f2dd48a9b878f5657afc258d`（分支 `dot-a/load-config-typescript-1483`），该公开同树已含补丁，无需再应用。随后按 `.nvmrc` 用 Node 24 和仓库 Yarn 安装锁定依赖。原试用的全量 immutable install 曾遇旧 sharp 的 libvips 下载 DNS 失败；这不是新环境必然失败的结论。原工作区已有包足够执行下列路径，也不能替代新 clone 的依赖准备；当前安装未完成或缺包时，先停在该准备缺口，不承诺下面命令能运行。

测试或启动服务前，使用独立进程清空继承环境，显式设置临时 `HOME`、`ACTUAL_DATA_DIR`、`ACTUAL_SERVER_FILES`、`ACTUAL_USER_FILES`；`ACTUAL_CONFIG_PATH` 指向不存在的合成配置文件路径，不指向目录或真实配置。以下命令在该隔离进程的 Actual 仓库根运行（Node 24，按 `.nvmrc`；仓库自带 Yarn 4.17.1）：

```sh
node .yarn/releases/yarn-4.17.1.cjs typecheck
node .yarn/releases/yarn-4.17.1.cjs lint:fix
node .yarn/releases/yarn-4.17.1.cjs workspace @actual-app/sync-server test \
  src/load-config.test.js src/load-config-types.test.ts \
  src/config-file-env.test.ts src/load-config-file-env.test.ts \
  src/simplefin-config.test.ts src/util/paths.test.ts \
  src/accounts/openid.test.ts src/app-openid.test.ts
node .yarn/releases/yarn-4.17.1.cjs workspace @actual-app/sync-server build
```

验收：本次原生 typecheck、相关回归、lint 与 SSR build 应无新错误；检查 lint 修改后的最终 diff。原固定试用的 8 文件 36 例通过、版本为 `v26.10.0`，可作对照；缓存与 warning 计数见原记录，不作为新环境门槛。构建后在上述隔离环境启动 `build/app.js`，设 `ACTUAL_HOSTNAME=127.0.0.1` 和空闲端口，核 `/health` 返回 200 与 `{"status":"UP"}`，再跑 `build/scripts/health-check.js` 并核 exit 0；最后停止自己启动的服务。

未验：完整产品 QA、浏览器 UI、真实银行／身份提供者或生产验证；全量 immutable install 未完成（见上）。上游 Draft 创建返回 403，回读确认无 PR，本轮投稿已取消；不把 fork 或本地独审当成上游接受。

### 依赖版本升级：先接在途实现，再核当前消费者

**已有迁移 PR 就先接收，不从零重写，也不整份覆盖新主干。** Hermes #118652 升到 Anthropic 1.7.0：旧码加新 SDK 的两个构造回归真红，固定 PR 的 160 项相关测试通过；但原补丁到新 main 的依赖文件冲突。实际做法是仅移植必要源码和两处 pin，用当前项目 PM 重生成锁文件，保留新 main 的 Bedrock timeout 参数与其他依赖，再通过 178 项相关测试和原生 14 项静态检查。

[固定补丁、环境前提与复跑入口](../../../../../experiments/anthropic-sdk-migration/README.md#hermes-v1-在途迁移接收旧-pr-时保住新主干)保留了这条接收路径。关键是核真实 SDK 构造、原／复制 client 的请求认证，以及受影响的旁路消费者；返回 200 的 mock 不能代替请求断言。这里的合成传输与 Bedrock 构造不证明线上服务兼容，1.x 通过也不证明 2.x 通过；未向上游提交、未变更产品默认，本例未用于独立新读者验收。

**没有需要改写的调用，就保留它。** 以下 Memoh 是另一种情况：规则零命中、消费者仍通过时，不为迁移器制造目标调用或重写生成定义。

Memoh 固定在 `felinics/Memoh@21b44d1087c43a83bde1fcce1d43a457220d45c1`（AGPL-3.0）。完整补丁、应用／回滚命令见[原固定卡](https://github.com/dbvv1/a1dbv/blob/98e7a5987223474ad008140e0dd8ea86a1458dd6/docs/collaboration/local-jobs/A-MIGRATION-ADOPTION-001.md#应用方式与回滚)；当前任务是[已取消的接收卡](../../A-MIGRATION-ADOPTION-001.md)，只保留方法与工程结果。

在空父目录执行下列 clone 与 apply 命令；`cd Memoh` 后所有 pnpm 检查都在 Memoh 仓库根运行。需 `pnpm 10.27.0`，`pnpm 11` 不读 `package.json` 的 `pnpm.overrides`，会拒绝该 frozen lockfile。实际运行用 Node 22.23.2；仓库 `mise.toml` 固定的 Node 24.22.1 未安装。

clone 并 checkout 后，从[原固定卡的 raw 文本](https://raw.githubusercontent.com/dbvv1/a1dbv/98e7a5987223474ad008140e0dd8ea86a1458dd6/docs/collaboration/local-jobs/A-MIGRATION-ADOPTION-001.md)提取唯一的 `diff` 代码块正文（不含围栏），保留原字节、前导空格和最后的 LF，保存为 `Memoh/memoh-colada-1.4.8.patch`。先核 SHA-256 为 `fd94f2c7c093f92708109a4ea740c321a62c273779d5a4cd7b689c8bfa8308ca`；从渲染页复制若改变空白，不要强行应用。再应用：

```sh
git clone https://github.com/felinics/Memoh.git Memoh
git -C Memoh checkout 21b44d1087c43a83bde1fcce1d43a457220d45c1
git -C Memoh submodule update --init packages/ui
# 把固定卡补丁保存为 Memoh/memoh-colada-1.4.8.patch 后：
git -C Memoh apply --check memoh-colada-1.4.8.patch
git -C Memoh apply memoh-colada-1.4.8.patch
cd Memoh && pnpm install --frozen-lockfile
```

升级后检查：

```sh
pnpm --filter @memohai/sdk typecheck
pnpm --filter @memohai/web typecheck
pnpm --filter @memohai/desktop typecheck
pnpm --filter @memohai/web build
pnpm test --run --project web
pnpm lint
```

验收：三个 typecheck、web build 和相关消费者回归通过，lint 无新增错误；再次 `pnpm install --frozen-lockfile` 后核锁文件无变化。全量测试须比较本次基线与候选的失败集合，新增失败先定位，不能把下面历史计数当作允许失败的门槛。原试用记录为 2414 项测试，基线 8 失败／6 文件、候选 9 失败／7 文件；多出的一项 15 秒超时在基线单跑也出现，根因未坐实。原相关消费者 8 文件 50 项通过，lint 为 0 errors／20 warnings；这些记录保留了当时全量并非全绿的事实。

**不要为重写而制造目标调用。** 官方 codemod（MIT，规则 blob `4042f70ceb69bb515d53e306e7d084bf33c2abff`）与 `@ast-grep/cli 0.51.0` 只作覆盖检查；零命中、149 个生成定义和 7 个消费者在 1.4.8 下仍通过时，保留生成定义；本次未用 `@hey-api/openapi-ts 0.99.0` 重生成，因为会引入 Go／swagger 工具链而没有已证明的类型收益。

后端工程另算：Go 编译、普通 PostgreSQL 18＋pgvector／pgcrypto 的 169 项 clean 迁移、合成 admin 登录、bot 异步写入／读取／改名与独立 SQL 持久化通过；升级后 Vite→真实 API 代理返回 200。这些不是 Colada 页面运行证据。

未验：Chromium 的 singleton IPC socket 被平台 EPERM 拒绝，异步 workspace provision 的 Unix endpoint 也被拒，两个 bot 最终 failed、各 attempt=1，均未重试；页面和同一 profile／origin／会话的旧缓存 hydrate-before-refetch 未验；生产依赖默认与部署未变，完整产品 QA 已取消。若升级目标包含持久缓存兼容，必须另用同一 profile／origin／会话跨版本、延迟真实响应，核缓存恢复、重新请求、切换与刷新；本次没有这项证据，不能把工程补丁当成缓存升级方案。

回滚前先核当前 diff；仅在这份补丁未混入后续修改的独立副本中反向应用。它只回退依赖声明与锁文件，不恢复数据库或迁移后新数据。回到父目录执行：

```sh
git -C Memoh apply --check -R memoh-colada-1.4.8.patch
git -C Memoh apply -R memoh-colada-1.4.8.patch
cd Memoh && pnpm install --frozen-lockfile
```

### 含持久数据的结构变化：事务成功不等于数据保住

用 sqlite-utils 4.2.1 的现成 API 把关联表升级为 STRICT 表。完整机制、固定提交与查询结果见[SQLite 记录](../../../../research/2026-10-23-sqlite-migration.md)；复跑入口是可选例子，只在新建的合成数据上跑，不要指向现有业务库。

准备 Python 3.10+、SQLite 3.37+（原 10-23 试用环境为 Python 3.12.14、SQLite 3.53.1、Linux，未跑兼容矩阵）、Git 和公开 GitHub 网络；先在独立环境安装[已测依赖](../../../../../experiments/sqlite-migration-requirements.txt)。在 a1dbv 仓库根目录执行；入口不安装依赖，输出目录必须新建且不存在：

```sh
python3 experiments/replay_sqlite_migration.py --python .venv/bin/python --tests --output ./sqlite-migration-output
```

路径选择：

- 只改列名：优先 SQLite 原生 `ALTER TABLE RENAME COLUMN`，不必重建或关闭外键。
- 父表单次 STRICT 转换：放在外层事务之外，保持外键 ON，让 `transform()` 管理临时禁用、校验和恢复。
- 必须整批升级父子表：先在事务外关闭外键，再进入 `db.atomic()`；提交前由调用者显式执行 `foreign_key_check` 并拒绝违规，同时比较需要保留的业务数据；退出事务后恢复原外键设置。不要在已经开始的事务里尝试关闭外键。
- 外键关闭时 `transform()` 不替调用者做那次校验，所以不要只看它的返回值；本例故意写入不存在的 `author_id`，用显式校验让整批回滚，再复核数据库未变。

分阶段核输出：危险的外层事务路径在旧实现中复现父表重建后三行 books 丢失、外键检查仍为空；固定接收实现对同一路径抛 `TransactionError`，重开后行内容和 schema 与 before 相同、外键 ON 未变。后续成功迁移阶段的结果则应由真实 CLI 重开并 JOIN，得到 `Ada revised / Transactions`、`Ada revised / Data migration`、`Lin / Graphs revised`；两表均为 STRICT，子表列名 `book_title`、父表 `display_name`。核列类型、NOT NULL、主键、外键和 STRICT，另验 TEXT 拒绝 BLOB；在结果副本删除作者，核 CASCADE 只删除其两本书。原固定 `28dc6278` 的相关两文件测试为 141 passed、无 skip；回归与数据库查询分别判定，不把失败回滚阶段的 unchanged 输出和成功阶段的新结构混为同一预期。

未验：全部上游测试、SQLite／Python／OS 矩阵、生产并发、进程崩溃／断电耐久、用户真实数据和触发器／视图／表达式索引等复杂 schema；外键 OFF 路径不是通用生产迁移框架，也不证明模型或 Skill 增益。

## 停止扩量、局部补丁与保留旧实现

| 情况 | 选择 |
|---|---|
| 规则额外变换多、覆盖不清或例外增长 | 停止扩量，修规则或退回局部 Agent 补丁；不按已改文件数继续推 |
| 重命名预览为空、自动工具没有产生编辑 | 不造改动；手改必要 alias，用严格编译和运行值推进 |
| 运行时值与类型冲突 | 保留运行行为，修类型和消费者；不为类型假设改业务 |
| 依赖规则零命中，生成定义仍通过 | 保留生成定义，不重写、不为命中率制造调用 |
| 产品／旧缓存验收是目标但没有证据 | 保留旧依赖或旁置，不把工程补丁当缓存或产品升级 |
| 有数据变更但写入者或窗口未确认 | 保留旧实现或做桥接；小表能核实全部停写且落在批准窗口内，才短停写 |
| 已写新状态需要回退 | 先核新状态、恢复点和将丢的数据；不用 reset／seed 代替迁移或暗示真实数据可丢 |

回退先确认已写下的新状态与恢复点：依赖补丁回退后重装并核旧依赖树；数据库回退要重新打开核行与 schema，不能靠“事务已回滚”推断；不可逆时保留新状态继续修复。任何回退说明都不承诺能找回迁移后新写入的真实数据。

## 真实读者反馈与剩余验收

[Extruct 读者任务](../../A-MIGRATION-EXTRUCT-READER-20261101.md)已实际使用固定全文，反馈两处入口不清：测试风格迁移应从哪条路径开始，以及接收旧 PR 时如何保住新主干。本页据此把在途 PR 接收前置为共用步骤，并补上测试子场景与运行语义的验收。Python 具体命令、依赖清单和补丁重建前提仍属于任务自身的交接，不能全部归为页面卡点。

本次任务的静态检查与可复现交接仍有缺口，原成果没有发布为可取用的复现包。本页保持候选，不把执行成功或已经读过页面当作完整验收通过；原任务已取消，不重派首次读者。

## 依据与未验范围

| 来源 | 固定版本／日期 | 已验 | 未验 |
|---|---|---|---|
| [Actual 配置类型迁移](../../../../../experiments/actual-config-type-migration.md) | `actualbudget/actual@2ccf885b`，本地产品树 `446264b5`（公开同树：fork `dbvv1/actual` 分支 `dot-a/load-config-typescript-1483`，远端 `43bd1c0b`）；2026-10-26 | 36 项相关回归、原生 typecheck／lint、SSR build、构建后启动与健康检查；非作者 20 例基线 | 全量 immutable install（sharp libvips DNS 失败）、完整产品 QA、浏览器 UI、真实银行／身份提供者／生产；上游 Draft 403，投稿已取消 |
| [Memoh 依赖升级固定卡](https://github.com/dbvv1/a1dbv/blob/98e7a5987223474ad008140e0dd8ea86a1458dd6/docs/collaboration/local-jobs/A-MIGRATION-ADOPTION-001.md#应用方式与回滚) | `felinics/Memoh@21b44d10`；Colada 0.21.2→1.4.8；pnpm 10.27.0／Node 22.23.2；2026-10-25 | 官方规则零命中、149 个生成定义保留；四文件依赖／锁文件补丁、typecheck／web build／独审、8 文件 50 项消费者单测 | 真实 UI／运行时（含页面请求与缓存跨升级恢复）；该卡范围未跑 Go 后端与 Electron 打包；hosted CI |
| [Memoh 当前接收卡](../../A-MIGRATION-ADOPTION-001.md) | 2026-10-25 后端接收；此后取消完整产品验收 | Go 编译与 169 项 PostgreSQL 迁移等后端工程；bot 异步读写与独立 SQL 持久化；升级后 Vite→真实 API 代理 200 | 浏览器 singleton IPC EPERM、Unix endpoint 拒绝、两 bot failed；页面与旧缓存 hydrate-before-refetch；生产默认与部署；完整产品 QA 已取消 |
| [Hermes SDK v1 接收](../../../../../experiments/anthropic-sdk-migration/README.md#hermes-v1-在途迁移接收旧-pr-时保住新主干) | #118652 head `40f03bd6`；适配 main `c7da41dd`；2026-11-01 | 旧码＋新 SDK 两项类型真红；PR 160 passed；当前主干适配 178 passed、原生 14 项静态检查；真实 SDK／合成请求与 Bedrock 构造 | 线上 provider／模型、全套 Hermes、OS／发布矩阵、SDK 2、新读者实做；未投稿或改产品默认 |
| [SQLite 关联表升级](../../../../research/2026-10-23-sqlite-migration.md) | sqlite-utils 4.2.1；固定提交 `d7142006`（旧）、`f66ddcb2`（接收）、`28dc6278`（当前）；2026-10-23 | 三个指定源码状态、真实磁盘 DB 与子进程 CLI、内外层回滚、危险路径拒绝、重开与后续级联 | 全部上游测试、多版本矩阵、生产并发、崩溃／断电耐久、真实用户数据、复杂 schema；仅合成数据 |

本页 2026-10-30 原稿只读已公开输入；2026-11-01 补入 Hermes 的实际云端迁移接收与 Extruct 读者反馈，未重跑 Actual、Memoh 或 SQLite。语法／类型迁移的机制比较沿 [15 §5](../../../../15-task-playbooks.md#5-大规模迁移与升级) 及其[开发维护研究证据](../../../../research/2026-10-12-development-maintenance.md#重复代码迁移语法规则类型分析与第二次执行)，不新增未核来源。各例的已验范围分别成立，不拼成一项新的综合实测或工具提效结论；本页是候选，不改变地图评级或现有决策页。
