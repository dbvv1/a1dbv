# A-MIGRATION-FACTORIOLAB-READER-20261110-u1 读者记录

本记录由未读过附页、未参与该页与本任务编写的独立读者完成。只照 `job.md` 里附的页面全文执行真实任务：重放 factoriolab/factoriolab 的 Angular 21→22 升级。

## 做到哪一步、产物在哪

- 已在任务临时隔离目录浅取固定提交 `f785e10becb84afd1fe546ac5b4098271207aabd`（未取后续历史），核对了 README、`package.json`、`package-lock.json`、`angular.json`、`karma.conf.js`、tsconfig、CI 工作流与两个指定消费者。
- 按页面“依赖大版本升级／接收旧 PR”行与“框架迁移器先行”选择官方迁移器路线，并通过 Angular 22.2.5 官方迁移集合/源码列出了会执行的迁移与本仓库的预计命中。
- **没有执行真实迁移**：工作副本没有 `node_modules`，`npm run test:ci`、`npm test`、`npm run build` 均在启动 CLI 前以退出码 1 失败（`ng` 不是可执行命令）；任务禁止安装/更新依赖及 `npx`/`ng update` 下载，因此停在依赖准备。
- 产物：
  - `docs/collaboration/local-jobs/artifacts/A-MIGRATION-FACTORIOLAB-READER-20261110/result.md`（固定输入、命令与退出、diff、缺项、未验）
  - 本文件
  - 代码副本仅在任务临时目录，未提交、未推送；产品仓库 diff 为空，两个消费者文件哈希未变。

## 卡点（页面原句 → 缺什么/做错什么）

1. 页表格“依赖大版本升级／接收旧 PR：读跨版本指南，按当前包管理器更新声明和锁文件”
   - 缺：仓库无 `node_modules`，项目要求 `npm ci`；任务不允许在用户机安装或更新依赖。Angular 22 还要求 TypeScript 6.0（`@angular/compiler-cli@22` peer `>=6.0 <6.1`，仓库是 5.9.3），并需把 `@fortawesome/angular-fontawesome` 4→5、`angular-eslint` 21→22 等。没有安装权限，无法更新声明和锁文件。
   - 做错：先按页面试了测试/构建入口，未事先确认本地是否有依赖；读到 `ng` 不存在后才补查 `node_modules`。应在跑命令前先核依赖目录。

2. 页验收第 3 条“出现破坏先修，不降低原目标；缺依赖按项目方式准备”
   - 缺：项目方式是 README/CI 的 `npm ci`，本任务未授权。页面没有“禁止安装时保留候选、如何验收”的替代步骤，所以只能停在该步并记录。
   - 做错：无（未尝试 `npm ci`，避免违规）。

3. 页起手提示“先选一个真实受影响的消费者，记录原结果；试改后用同一输入核正常与失败路径”
   - 缺：没有本地 Angular CLI，`npm run test:ci` 退出 1，0 个测试运行，不能记录基线；`migration.spec.ts` 依赖 `src/tests/test-module.ts`（含 `provideHttpClient()`）与 mock 数据，`button.spec.ts` 依赖 `Button` 组件与 TestBed，均未实际执行。
   - 做错：初次把测试失败误当成可能需要排查的消费者问题，核对输出后确认失败发生在 `ng` 启动之前，与消费者无关。

4. 页“用目标版本官方 codemod；代表性文件试改后补规则外语义”
   - 缺：`ng update` 会先安装 Angular 22 并改写锁文件，任务明确禁止；官方迁移器无法启动。
   - 做错：无（手工模拟迁移的选项被排除，未手改代码冒充迁移）。

5. 页“同一消费者前后对照／构建产物可运行”
   - 缺：无依赖与构建产物，迁移前后都无结果可比；不能判通过。

## 页面之外还去翻了什么

- Angular 22 官方 npm 包（`@angular/core`、`@angular/cli`、`@angular/build`、`@schematics/angular` 22.2.5）的迁移集合与迁移源码，用来确认官方迁移器实际会改什么。
- npm registry 元数据（版本、engines、peerDependencies、TypeScript 可用版本）。
- `@fortawesome/angular-fontawesome` 5.1.0 包内容与导出，确认 `FaIconComponent` 仍存在。
- 仓库自身 README、`package-lock.json`、`.github/workflows` 的检查入口。
- 未读：factoriolab 固定提交之后的任何提交/升级补丁、其他读者的答案，以及页面之外的同题教程。

## 其他过程记录

- 一次 `du -sh` 探测 npm 缓存超时转入后台，随后按任务 ID 核到进程并 kill（退出 143），未把后台未结束当作结果；该探测与任务无关，属多余操作。
- 一次 `rg -L` 用法错误，输出被误读为“缺 changeDetection 的文件”，已改用逐文件判断纠正。
- 一次在错误工作目录用相对路径 `require` 导致 `MODULE_NOT_FOUND`，改用绝对路径后正常。
- 环境有 Chrome、Node 22.23.2（满足 Angular 22 engines），卡点只在依赖安装权限，不在浏览器或 Node。

## 核对

核对角色：未参与本次照做的独立复核；只读工作树与任务临时副本，未提交、未推送、未安装依赖。核对日期：2026-11-10。

**结论：真实迁移没有发生，不能判任务做成（taskDone=false），也不能据此判页面通过。** 读者停在依赖准备并如实记录；任务卡第 1 步本身就写了“需安装新包时记录缺项并停止该步”，所以这个停止是合同允许的处理，不是读者越权或谎报。但页面核心路线（官方迁移器 + 同一消费者前后对照）本次仍没有执行证据，答案页保持 🟡，不能因“命令按预期失败”或静态分析详尽而升 ✅。

### 实际验收（独立重跑，未复用读者结论）

- 页面输入：工作树 HEAD `be3c57b9`；`docs/decisions/migrations.md` 为 54 行、SHA256 `e7234616…`，任务文件内嵌页面与它归一空白后逐字相同（SHA256 `31af5a47…`）。
- 固定点：任务临时副本 HEAD `f785e10…`，提交时间 2026-06-07 01:21:16 -0400；`git rev-list --all --count` 为 1，仅该提交，没有后续历史。两个消费者 SHA256 为 `d65ace7e…`（button.spec.ts）与 `e8a1f732…`（migration.spec.ts），与记录一致；`git status` 为空。
- 环境：Node v22.23.2、npm 10.9.8，PATH 无 `ng`，副本无 `node_modules`，Chrome 存在。
- 入口：独立重跑 `npm run test:ci` 与 `npm run build`，均退出 1，输出都是 `'ng' 不是可执行命令`；0 个测试运行、无构建产物，与记录一致。
- 依赖与版本：`package.json` 为 Angular 21.2.12（CLI/build 21.2.10）、TypeScript ~5.9.3；`@fortawesome/angular-fontawesome` 4.0.0 peer `@angular/core ^21.0.0`；`angular-eslint` 21.3.1 peer `@angular/cli >=21 <22`；`@angular/build@22.2.5` peer TypeScript `>=6.0 <6.1`、vitest `^4.0.8 || ^5.0.0`，engines `^22.22.3 || ^24.15.0 || >=26.0.0`；`@fortawesome/angular-fontawesome@5.1.0` peer `^22.0.0`；`@angular/compiler-cli@22.2.5` peer TypeScript `>=6.0 <6.1`。读者所列版本门槛成立。
- 迁移清单：从 22.2.5 包内 `migrations.json` 与 `migration-collection.json` 核对，`@angular/core` 8 项、`@schematics/angular` 的 `add-istanbul-instrumenter`／`update-workspace-config`／`migrate-karma-to-vitest` 均与读者列名一致。
- 写域与产物：工作树只有 `docs/collaboration/local-jobs/artifacts/A-MIGRATION-FACTORIOLAB-READER-20261110/` 与本记录两个未跟踪项；产品代码、页面和消费者未改；`result.md` 与本记录未见本机绝对路径或内网地址。

### 卡点判定

1. 「依赖大版本升级／接收旧 PR：读跨版本指南，按当前包管理器更新声明和锁文件」——cause=page（前提没写）。主因是执行条件：无 `node_modules` 且任务禁止安装；页面只写“更新声明和锁文件”，没写“无权安装时保留缺项并停止”的判据。任务卡已补这条规则，所以不是读者错误。
2. 「缺依赖按项目方式准备」——cause=page。同一条根因：项目方式是 README/CI 的 `npm ci`，页面假定可以执行，没有给禁止安装时的降级验收步骤。读者没有尝试安装，处理正确。
3. 「先选真实消费者，记录原结果」——cause=model（读者侧顺序失误）。没有本地 CLI，`test:ci` 在启动前退出，基线无法记录，这是执行条件；但读者自述先跑测试、之后才核 `node_modules`，而页面起手提示已要求先核“实际依赖版本和项目检查入口”，这一步是读者自己的顺序失误，已自纠且没有改变结果。
4. 「用目标版本官方 codemod」——cause=page（前提没写）。`ng update` 会先安装目标版本并改写锁文件，页面没说明该前提，也没给无安装条件下的替代。读者没有手改代码冒充迁移，处理正确。
5. 「同一消费者前后对照／构建产物可运行」——cause=page。无依赖即无构建产物；页面“缺 UI／旧缓存验收就保留候选”没有覆盖“依赖准备整体被禁止”的情形。属执行条件，不是页面路线被证伪。

以上停止原因集中在执行条件（禁止安装），不是读者能力不足；页面侧的缺口是同一个：没有写“依赖准备不被允许时如何停止、哪些内容不能算通过”。

### 读者没意识到的错误

- `http-xhr-backend` 的预计命中不止 `src/tests/test-module.ts`。迁移在 `tsconfig.app.json` 与 `tsconfig.spec.json` 两套程序上运行（`runMigrationInDevkit` 取 build+test tsconfig），`src/data/release.spec.ts` 和 `src/translate/translate.spec.ts` 也调用不带 `withFetch()`／`withXhr()` 的 `provideHttpClient()`，会被补 `withXhr()`。
- `change-detection-eager` 的预计命中不止 `app.ts`、`id.ts`、`tests/mocks/component.ts`。`src/components/form-field/form-field.spec.ts` 的 `TestFormField` 与 `src/components/tooltip/tooltip.spec.ts` 的 `TestTooltip` 也是没有 `changeDetection` 的 `@Component`，经 `tsconfig.spec.json` 纳入迁移，会被补 `ChangeDetectionStrategy.Eager`。读者自述曾用 `rg -L` 误读后改逐文件判断，但最终清单仍漏这两个 spec。
- `@vitest/coverage-v8` 不是“锁文件仅有传递依赖”：它是 `package.json` 和锁文件根的直接 devDependency `^4.1.5`。若走可选 `migrate-karma-to-vitest`，迁移以 `ExistingBehavior.Skip` 添加 `vitest ^5.0.0`，不会升级已存在的 coverage-v8，`coverage-v8@4.1.5`（peer 要求 vitest 4.1.5）与 vitest 5 存在版本错配，需要手工对齐到 `^5.x`；读者的缺项表没有这一条。
- `@schematics/angular` 22.0.0 迁移集合还含 `use-application-builder`（可选推荐）与 `trust-proxy-headers`。本仓库已用 application builder、无 SSR，预计零命中，但“已改／未改／警告”清单没有列这两项，覆盖不完整。
- 小偏差：`tests.yml` 只有 `npm ci → prettier → lint → test:ci`，没有 `npm run build`；`build.yml` 才有 build。记录把两条工作流合并成了一条五步序列。

### 未验

官方迁移器实际执行、Angular 22 + TypeScript 6 编译、两个消费者迁移前后测试、`ng build` 产物、Vitest／覆盖率迁移、`@fortawesome/angular-fontawesome` 5 运行行为，全部未执行；读者已把这些写入 result.md 的未验段，本次核对同样不能替它们作证。
