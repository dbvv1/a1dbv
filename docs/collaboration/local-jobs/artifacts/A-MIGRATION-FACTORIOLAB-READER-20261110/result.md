# A-MIGRATION-FACTORIOLAB-READER-20261110 结果

## 结论

**未完成真实迁移，停在依赖准备。** 固定提交的仓库没有 `node_modules`，项目规定的依赖准备方式是 `npm ci`，而本任务明确不授予安装/更新依赖的权限；官方 `ng update` 本身也会通过包管理器安装 Angular 22 并改写锁文件。因此未修改产品代码、未执行迁移器、未能运行任何测试或构建，不能判为迁移通过。卡点是执行条件（安装权限），不是页面路线本身失效；但页面在“禁止安装”环境下没有可执行的降级验收步骤。

## 固定输入

- 仓库：`https://github.com/factoriolab/factoriolab`（MIT）
- 固定提交：`f785e10becb84afd1fe546ac5b4098271207aabd`，提交时间 2026-06-07 01:21:16 -0400
- 取法：只浅取该提交（`git fetch --depth 1 origin <sha>`），未取后续历史，未读上游后续升级补丁
- 迁移前状态：Angular 21.2.12（`@angular/cli`/`@angular/build` 21.2.10），TypeScript 5.9.3
- 目标：Angular 22 线；截至 2026-11-10，npm `latest` 为 22.2.5
- 选定消费者：`src/components/button/button.spec.ts`、`src/state/router/migration.spec.ts`
- 消费者静态范围（未执行）：`button.spec.ts` 1 个 `it`/1 个 `expect`；`migration.spec.ts` 28 个 `it`/34 个 `expect`；断言未改动
- 代码副本：仅放在本次任务的临时隔离目录；未提交、未推送、未切换产品分支

## 环境与项目检查入口（实测）

- Node v22.23.2、npm 10.9.8；Chrome 已安装；PATH 上没有 `ng`；仓库内没有 `node_modules`。
- 项目说明（README）：安装依赖用 `npm ci`；测试入口 `npm test`。
- CI（`.github/workflows/build.yml`、`tests.yml`）：`npm ci` → `npm run prettier` → `npm run lint` → `npm run test:ci` → `npm run build`。
- npm 脚本：`test` = `ng test`；`test:ci` = `ng test --no-watch --progress=false --browsers=ChromeHeadless`；`build` = `ng build`。
- 测试目标使用 `@angular/build:karma`，配置 `karma.conf.js`、`tsconfig.spec.json`；覆盖率门槛为四项 100%。

## 实际命令与退出码

| 命令 | 退出 | 结果 |
|---|---|---|
| `git init` + `git fetch --depth 1 origin f785e10...` + `git checkout FETCH_HEAD` | 0 | 工作副本 HEAD 等于固定提交 |
| `npm run test:ci` | 1 | `ng` 不是可执行命令，0 个测试运行 |
| `npm test` | 1 | 同上（watch 入口也未启动） |
| `npm run build` | 1 | 同上，未产生构建产物 |
| `npm ci` / `npm install` / `npx` / `ng update` | 未运行 | 任务禁止显式或隐式安装、更新依赖与下载 |
| `npm run prettier` / `npm run lint` | 未运行 | 同样缺依赖；不属于本次验收入口，不据此判通过 |

`npm run test:ci` 的失败发生在启动 CLI 之前，不是消费者断言失败；没有可记录的前后测试结果。

## 按页选路

页面表格“依赖大版本升级／接收旧 PR”要求读跨版本指南、按当前包管理器更新声明和锁文件；正文要求“框架迁移器先行”。据此确认官方迁移器为 `ng update` 使用的两组迁移集合（`@angular/core` 22.0.0 与 `@angular/cli`/`@schematics/angular` 22.0.0），而不是手写替换。以下清单来自对 22.2.5 迁移源码的静态阅读，**均未执行**。

`@angular/core` 22.0.0 迁移：

- `change-detection-eager`：给没有 `changeDetection` 的 `@Component` 补 `ChangeDetectionStrategy.Eager`，并把显式 `Default` 改为 `Eager`。本仓库预计命中 `src/app/app.ts`、`src/app/id/id.ts`、`src/tests/mocks/component.ts`；`button.ts` 已是 `OnPush`，不受影响。
- `http-xhr-backend`：22 默认 HTTP 后端由 XHR 改为 Fetch，给未带 `withFetch()`/`withXhr()` 的 `provideHttpClient()` 补 `withXhr()`。本仓库命中 `src/tests/test-module.ts`；`src/app/app.config.ts` 已用 `withFetch()`，不命中。
- `strict-templates-default`：仅在未设置时写 `strictTemplates: false`；本仓库 `tsconfig.json` 已是 `true`，不命中。
- `can-match-snapshot-required`、`incremental-hydration`、`strict-safe-navigation-narrow`、`model-output`、`safe-optional-chaining`：本仓库未检索到 `canMatch(`、`provideClientHydration(` 等对应调用，预计零命中，但仍需迁移器警告核对。

`@schematics/angular` 22.0.0 迁移：

- `update-workspace-config`：只处理应用构建器的 SSR `experimentalPlatform`，本仓库不涉及。
- `add-istanbul-instrumenter`（必需）：测试目标仍是 Karma 构建器，会给 `devDependencies` 添加 `istanbul-lib-instrument@^6`。
- `migrate-karma-to-vitest`（可选）：把 `angular.json` 测试构建器改为 `@angular/build:unit-test` 且 `runner: vitest`；`codeCoverage`→`coverage`、`codeCoverageExclude`→`coverageExclude`；`karma.conf.js` 因使用 ESM import、`path.join` 与插件标识符被判为不可自动删除，会保留并列入手工迁移；可映射 `reporters`（`progress`→`default`、`junit`→`junit`，`kjhtml` 不映射）和覆盖率门槛（四项 100%）；`tsconfig.spec.json` 的 `types: ["jasmine"]` 会改为 `vitest/globals`；并添加 `vitest`、`@vitest/coverage-v8` 依赖。
- 迁移器还会提示运行 `ng g @schematics/angular:refactor-jasmine-vitest`；本次选定的两个 spec 只用 `describe/it/expect`，未使用 Jasmine spy 等专用 API，预计无需改写，但未实测。

## 依赖缺项（安装权限未授予，停在该步）

| 包 | 当前 | 目标/原因 |
|---|---|---|
| `@angular/core`、`common`、`compiler`、`compiler-cli`、`forms`、`platform-browser`、`router`、`service-worker` | 21.2.12 | 22.2.x；框架大版本 |
| `@angular/cdk` | 21.2.10 | 22.2.x |
| `@angular/cli`、`@angular/build` | 21.2.10 | 22.2.x |
| `typescript` | 5.9.3 | 6.0.x；`@angular/compiler-cli@22` 的 peer 为 `>=6.0 <6.1`，属大版本升级 |
| `@fortawesome/angular-fontawesome` | 4.0.0（peer 仅 `^21.0.0`） | 5.1.0（peer `^22.0.0`），否则 peer 冲突 |
| `angular-eslint` | 21.3.1（peer `@angular/cli >=21 <22`） | 22.x |
| `istanbul-lib-instrument` | 未直接声明 | 官方必需迁移会添加 `^6`（Karma 覆盖率） |
| `vitest`、`@vitest/coverage-v8` | 锁文件仅有传递依赖 `vitest 4.1.5` | 若走 `unit-test` 构建器需直接依赖；`@angular/build@22` peer 为 `^4.0.8 || ^5.0.0`，当前 latest 5.1.0 |

Node 本身不阻塞：Angular 22.2.5 的 engines 为 `^22.22.3 || ^24.15.0 || >=26.0.0`，本机 Node 22.23.2 满足。

## diff 范围

无代码或配置改动。工作副本 `git status` 为空；两个消费者保持原样：

- `src/components/button/button.spec.ts`：`d65ace7e16fb59670f06c597121268b375c43a2f14d9f82dec952533d456e357`
- `src/state/router/migration.spec.ts`：`e8a1f732c6ce2fafdcee5d3ba3f51f121d1085c69bc8c468191eeff2d184f85f`

## 卡点（对应页面原句）

1. 页表格“依赖大版本升级／接收旧 PR：读跨版本指南，按当前包管理器更新声明和锁文件”——需要 `npm ci`/`npm install` 落盘；任务禁止在用户机安装、更新依赖，也禁止 `npx` 下载。缺 `node_modules` 与安装权限。
2. 页验收第 3 条“缺依赖按项目方式准备”——项目方式是 README 和 CI 里的 `npm ci`，本任务未授权；页面没有给出“禁止安装时如何保留候选、如何降级验收”的步骤。
3. 页起手提示“先选一个真实受影响的消费者，记录原结果”——因无 CLI/依赖，`test:ci` 在启动前退出 1，无法记录基线结果；这不是消费者本身失败。
4. 页“用目标版本官方 codemod”——`ng update` 需要先安装 Angular 22 工具链并改写锁文件，任务明确禁止 `ng update`/`npm install`；官方迁移器无法启动。
5. 环境并非卡在 Node 或浏览器：Chrome 已装、Node 满足 engines；唯一硬条件是依赖安装权限。

## 未验

- 未运行任何测试或构建；两个消费者的迁移前行为、迁移后行为均未验证。
- 未执行 `ng update` 或任何迁移器；“预计命中”只是对 22.2.5 迁移源码的静态判断。
- 未验证 Angular 22 + TypeScript 6 的项目编译、`@fortawesome/angular-fontawesome` 5 的 API、`angular-eslint` 22、Vitest 迁移后的覆盖率和测试启动、GLPK WASM 资产路径。
- 未验证 `npm ci` 在本机网络下能否成功（按规则未尝试）。
- 不据此判页面通过；本次只能作为“执行条件缺失”的记录。

## 页面之外查了什么

- Angular 22 官方 npm 包（`@angular/core`、`@angular/cli`、`@angular/build`、`@schematics/angular` 22.2.5）的迁移集合与迁移源码。
- npm registry 元数据：各包版本、engines、peerDependencies、`typescript` 可用版本。
- `@fortawesome/angular-fontawesome` 5.1.0 的包内容与导出。
- 仓库自身 README、`package-lock.json` 与 `.github/workflows`。
- 未读：factoriolab 固定提交之后的提交或升级补丁、其他读者的答案、页面之外的同题教程。
