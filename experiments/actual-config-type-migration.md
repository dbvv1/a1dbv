# Actual 配置迁移：让类型反馈和运行消费者共同接收

**已有应用的 JS→TS 迁移，先看语言服务实际给出的引用差量，再让严格类型检查和真实运行值共同校准类型。** 本次 OMP 的重命名预览没有引用编辑，真正推进工作的是仓库原生编译反馈与配置／构建消费者。
**采用对象**是 Actual Budget 仍未完成的配置入口迁移；不是给工具造一个重命名题，也不把纯编译通过当成语义保持。
**实际结果**：配置入口已迁移，原生根类型检查、相关配置／到期回归与构建后普通启动通过；固定补丁已通过非作者审查。

## 真实需求与选择

维护者的 [#1483](https://github.com/actualbudget/actual/issues/1483) 接受小而完整的 JS→TS 迁移。固定 `actualbudget/actual@2ccf885b42dbac5f4aaf287be051e4d0a799f684` 后，旧清单里的部分模块已经迁完，`packages/sync-server/src/load-config.js` 仍是 JS。选择配置入口，是因为它同时有自定义值转换、跨文件读取、开发 alias 和构建后消费者，能够检验 Agent 的完整迁移能力。

可信基线是项目自己的 **tsgo + typescript-strict-plugin + Vitest + Vite SSR build**。新增候选是 OMP 18.12.6 的 LSP `rename_file` 预览：显式 `apply:false`，先确认真实语言服务读到目标符号，再看 WorkspaceEdit。两者在同一实际任务中分工，没有测量速度提升或做工具排名。

## 反馈怎样改变实现

| 真实反馈 | Agent 随后作出的决定 |
|---|---|
| OMP 成功启动 typescript-language-server 6.0.2，目标项目依赖 TypeScript 6.0.3；symbols 返回目标完整符号，diagnostics 正常。`rename_file` 返回 success，但原始编辑为 `{ "changes": {} }`。 | 不执行自动 apply；无后缀相对 import 本来无需改动，手动把开发 `imports.#load-config` 改为 `.ts`，保留发布映射的 `.js`。这些 alias 在试用前已被识别，不能说是工具替 Agent 发现的。 |
| 仅改后缀和开发 alias 后，严格编译报 `entry` 隐式 any。基线生成声明还把 token expiration 推成 string、空网络数组推成空元组。 | 根据真实转换域明确配置类型；外部校验值用 unknown，按实际类型窄化，不加 strict-ignore 或 any。 |
| 明确 token expiration 的 number／两个特殊字符串联合后，编译指出 OpenID 消费者反复调用 `config.get()`，不能保持数值窄化。 | 改为读取一次局部值，再分支；补实际会话到期数值回归，保留秒数与两个特殊值语义。 |
| Agent 最初把嵌套 `doc` 当成纯 schema 元数据；真实配置对象断言失败，返回值确实含该字符串。 | 修正类型与断言，保留运行值，而不是改运行实现去迎合自己的类型假设。原生 typecheck 已通过仍不足以发现这个错误。 |
| 实际 Vite 产物是 `app.js`、`scripts/health-check.js` 和 chunks，而非按源路径逐文件发布。 | 用真实 bundle 启动和内置健康检查接收；不把旧 publishConfig 字面路径误设成新验收门槛，也不扩大修复既有发布元数据。 |

OMP 本次提供了可核对的预览边界，没有替代编译器，也没有自动完成迁移。**可采用的是“看编辑清单→按配置真实值定类型→修实际消费者→运行发布入口”这个组合**；新工具是否更快仍未知。

## 实施范围

产品固定提交 `446264b59ca80871f7fb21cc4b3cb8cc9cc5fdc5`，基线见上；[可应用补丁](actual-config-type-migration.patch)共六个文件，未修改锁文件。非作者接收结果见[任务卡](../docs/collaboration/local-jobs/A-TYPE-MIGRATION-ADOPTION-001.md)。

- `load-config.js` → `load-config.ts`，显式配置值类型、自定义格式参数类型和错误值显式字符串化；配置加载顺序、默认值、环境绑定和校验仍由原 Convict 实现负责。
- 开发 alias 指向 `.ts`；无后缀引用及发布 `.js` 映射保持。
- OpenID 的到期配置只读一次，以便编译器窄化；不修改认证流程或到期单位。
- 增加配置类型／实际载入回归及三种到期分支回归，附项目要求的 Maintenance release note。

## 实际验收

| 检查 | 固定基线 | 迁移后 |
|---|---|---|
| 根 `yarn typecheck` | 10 工作区全部通过 | 6 工作区重新检查通过，4 个未变工作区复用 Lage 缓存；无失败 |
| 配置既有输入 | 作者最初三文件 11 例；非作者另外在干净基线跑五文件 20 例全过 | 原 20 例均在下面 36 例中通过 |
| 根 `yarn lint:fix` | 未另跑基线全库 lint | 格式检查完成，954 warnings／0 errors；未修无关警告 |
| SSR build／CLI | 构建通过，`v26.10.0` | 构建通过，`v26.10.0` |
| 普通 app／内置健康脚本 | HTTP 200、`{"status":"UP"}`，脚本 exit 0 | 同结果；均已结束临时服务进程 |

最终 lint 与 typecheck 曾同时运行时，lint 无诊断退出 129；类型检查完成后串行重跑 lint 通过，不把那次退出算成功。

迁移后相关八个测试文件 **36 例通过**：包括原格式 6、文件环境助手 8、真实文件覆盖 1、网络配置 4、路径消费者 1、原 OpenID 相关 4，以及新配置合同 9／到期分支 3。类型断言由 typecheck 接收，不能仅据 Vitest 的运行计数说类型正确。全部应用运行清除继承环境，配置、数据、serverFiles、userFiles、HOME 使用临时目录；身份提供者只用现有测试 mock。

依赖使用仓库 Node 24 与 Yarn 4.17.1 锁文件。安装所需包已足够执行上述路径，但整个 immutable install 因旧 sharp 文档依赖的官方 libvips 下载 DNS 失败而未完成；不声称全量安装或全产品 QA 通过。没有浏览器 UI、真实银行／身份提供者或生产验证。

## 复跑与贡献边界

固定基线后应用随附补丁。从仓库根目录使用 `node .yarn/releases/yarn-4.17.1.cjs` 代替下面的 `yarn`，先按 `.nvmrc` 安装公开依赖：

```sh
yarn typecheck
yarn lint:fix
yarn workspace @actual-app/sync-server test \
  src/load-config.test.js src/load-config-types.test.ts \
  src/config-file-env.test.ts src/load-config-file-env.test.ts \
  src/simplefin-config.test.ts src/util/paths.test.ts \
  src/accounts/openid.test.ts src/app-openid.test.ts
yarn workspace @actual-app/sync-server build
```

运行测试或构建后服务前，使用清空继承环境的独立进程，显式设置临时 `HOME`、`ACTUAL_CONFIG_PATH`（不存在的合成配置路径）、`ACTUAL_DATA_DIR`、`ACTUAL_SERVER_FILES`、`ACTUAL_USER_FILES`。普通 smoke 设 `ACTUAL_HOSTNAME=127.0.0.1` 和空闲端口，启动 `build/app.js`，读取 `/health`，再运行 `build/scripts/health-check.js`，最后结束自己启动的进程。

发布状态：已审本地产品 `446264b59ca80871f7fb21cc4b3cb8cc9cc5fdc5` 的相同树已发布到 [fork分支](https://github.com/dbvv1/actual/tree/dot-a/load-config-typescript-1483)，远端为 `43bd1c0b1388dba9f2dd48a9b878f5657afc258d`。集成接口创建上游Draft返回403，回读确认没有PR；未换路重试，不把fork或本地独审当成上游接受。

AI 贡献政策允许此类补丁；所有 commit／PR 标题必须 `[AI]`，PR 正文必须保持原模板未填写、未勾选，由真人填写实际测试与接收信息。非作者检查当时全部 85 个开放 PR 的文件清单：同文件 FinTS #9262 新增配置项，#9322 面向 release 分支回移网络配置，均不是 master 上的 TS 迁移；合入前仍需重核。外发由贡献线按规范处理，本记录不代称真人测试。

来源与核实（2026-10-26）：[维护者迁移需求](https://github.com/actualbudget/actual/issues/1483)、[固定配置实现](https://github.com/actualbudget/actual/blob/2ccf885b42dbac5f4aaf287be051e4d0a799f684/packages/sync-server/src/load-config.js)、[固定构建入口](https://github.com/actualbudget/actual/blob/2ccf885b42dbac5f4aaf287be051e4d0a799f684/packages/sync-server/vite.config.mts)、[Actual 贡献指南](https://actualbudget.org/docs/contributing/)、[AI 政策](https://github.com/actualbudget/actual/blob/2ccf885b42dbac5f4aaf287be051e4d0a799f684/packages/docs/docs/contributing/ai-usage-policy.md)、[Agent PR／commit 规则](https://github.com/actualbudget/actual/blob/2ccf885b42dbac5f4aaf287be051e4d0a799f684/.github/agents/pr-and-commit-rules.md)。OMP 试用由独立前沿线完成，使用 [npm 发布包 18.12.6](https://www.npmjs.com/package/@oh-my-pi/pi-coding-agent/v/18.12.6)、Bun 1.4.4；[已核源码的重命名分支](https://github.com/can1357/oh-my-pi/blob/0b5c27ab24719c86a5986b95ee55f4e75bc1aaa0/packages/coding-agent/src/lsp/tool.ts)与该能力对照，不把 main 当作实际运行包。
