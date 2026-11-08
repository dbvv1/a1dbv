# Miniflare 发布包：固定稳定版和 beta 的声明消费者

**需要 `skipLibCheck:false` 的 TypeScript 消费者，不能据“最新版”标签或 main 构建成功认定声明已修。** 2026-11-05 npm 的 `latest` 为 4.20260730.0、`beta` 为 5.20261103.0-beta；两个实际发布包都复现 `./shared` 的 TS2307。此结果不否定运行时用途，也不推荐为绕过类型错误降级或关闭库检查。

本次接续 [Cloudflare #15377](https://github.com/cloudflare/workers-sdk/issues/15377) 的真实包发布问题与[既有消费者入口](../../docs/collaboration/inbox.md)。不是新工具系列；固定历史 alpha 的旧结果保留，补当时标签对应版本这一未验环节。11-08 另有新读者在云端照完整验证页实做，范围见下节；本机 Windows 与运行时仍未验。

## 已运行

云端 Linux x86_64、Node 24.22.1、npm 11.9.0；两份独立仓库外消费者，各用 TypeScript 6.0.3、`@types/node` 24.13.3、`@types/ws` 8.18.1。输入为 `typeof import("miniflare")`，Bundler 解析、strict、noEmit、`skipLibCheck:false`，没有 workspace 链接。

| 固定发布版 | 安装 / tsc 退出码 | 全部诊断 | `./shared` TS2307 | tgz 条目 / shared 前缀文件 |
|---|---|---|---|---|
| 4.20260730.0（当时 latest） | 0 / 2 | 52 | 第 26、36、46 行，共 3 条 | 160 / 0 |
| 5.20261103.0-beta（当时 beta） | 0 / 2 | 35 | 第 27 行，共 1 条 | 160 / 0 |

剩余 49 / 34 条诊断未归因，不合并称为同一缺陷。两组安装声明均与官方 tgz 对应声明逐字节一致，pack integrity 与 lock 的 Miniflare integrity 一致。

- stable tgz SHA256：`628eac8ebdbc0c889457676e7ebbbb4a3e46f51c20c19c3325ff6cf3cad4fa43`
- beta tgz SHA256：`69313f870bea690f25cb2349707f84c375b9d59b6a23a581df3dc52416372050`

`dist-tags.json` 是当时查询结果，不是未来标签保证。每组 `result.json`、完整 `tsc-output.txt` 和实际 lock 已保存；未提交依赖目录或 tgz。npm 提示未知 http-proxy 配置和新 npm 版本，安装仍成功，未更新全局工具。

## 复跑原消费者

需要已获准使用 Node 22+、npm 及官方 npm registry。复制整个本目录到独立临时目录，分别在 stable 和 beta 内运行；不替换项目原依赖。

```sh
npm ci --ignore-scripts --no-audit --no-fund
node node_modules/typescript/bin/tsc --pretty false > actual-tsc.log 2>&1
printf 'tsc exit: %s\n' "$?"
```

正常复现的 tsc 退出码为 **2，不是通过**。对照已保存的 `tsc-output.txt`，核目标 TS2307 及其他诊断；工具缺失、安装失败或其他非零不能当作复现。

发布包核验另在该临时目录执行对应一个命令：

```sh
npm pack miniflare@4.20260730.0 --ignore-scripts --json
npm pack miniflare@5.20261103.0-beta --ignore-scripts --json
```

读取返回的 tgz 清单和 `package/dist/src/index.d.ts`，对比安装声明及 lock integrity。这里使用已发布包且只验声明，安装和 pack 均禁止生命周期脚本；**不适用于需要 prepack 生成产物的本地包构建验收**。

## 新读者的真实包消费

**11-08 新读者照[完整验证页](https://github.com/dbvv1/a1dbv/blob/064a0121b3eda0de5a1b803e4116ebe8a5bcda4a/docs/decisions/verification.md#npm-包交付安装实际-tarball再验调用方)完成固定 beta 的声明核查，没有遇到页面卡点。** 读者未读本实验、收件箱或作者结果；实际输入为 17,573 UTF-8 字节、SHA256 `94b12406a25e2d830b13ba927a6088dd784cdbc8291b4b0b459b32804cbd5147`。版本由任务指定，消费者由读者自行编写，不是对包状态的盲测，也不把作者旧轮倒算为读者验收。

读者在仓库外 pack 并安装返回的 tgz，使用同版 TypeScript／types，选择 ES2022＋NodeNext；[实际消费者](reader-consumer/consumer.ts)只做类型检查，不执行 `dispatchFetch`。安装退出 0，`npm run check` 退出 2：[完整输出](reader-consumer/tsc-output.txt)共 34 条诊断（33 TS2307、1 TS2370），其中 `./shared` 为 (27,36) 的一条；其他 33 条未合并归因。此配置与上方 Bundler 消费者不同，诊断数各按实际结果保留。

负责人独立重跑同一消费者，退出 2 且 stdout 逐字一致；另核 tgz SHA256 与上表 beta 相同，160 条目中没有 shared 前缀文件，安装声明／package.json 与包内逐字节一致，安装目录不是符号链接，实际包 SHA512 同时匹配 pack 与 [lock](reader-consumer/package-lock.json)。只验本次发布声明路线；本地 prepack、生命周期脚本、运行时、Windows 与新版本均未验，不改地图评级。

复跑时将本实验目录复制到独立临时目录，从 `reader-consumer` 执行：

```sh
mkdir -p ../artifacts
npm pack miniflare@5.20261103.0-beta --pack-destination ../artifacts --ignore-scripts --json
npm ci --ignore-scripts --no-audit --no-fund
npm run check
```

预期最后一步退出 2，并包含上述目标诊断；这不是包通过。固定 lock 用相邻 `artifacts` 内的真实 tgz，不链接工作区源码。环境、权限或包取回失败时，先记录具体缺口，不能当作同一缺陷已复现。

## 采用边界

需要完整声明检查的项目应在自己的真实使用配置下验证明确版本；本次两版没有满足此消费者门槛，不能用 stable/beta 名称代替检查。未测试 TypeScript 7、Node 26、其他编译配置、Miniflare 运行时、Wrangler API 或未来版本，也未寻找替代版本并承诺兼容。未运行云服务、使用凭据或投稿。

一手依据：[npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack/)与[生命周期](https://docs.npmjs.com/cli/v11/using-npm/scripts/)；真实用户原帖 [#15377](https://github.com/cloudflare/workers-sdk/issues/15377)区分源码构建和已发布包；[原公开复现](https://github.com/screenfluent/upstream-type-repros/tree/2b0ff6d355a8631199c2d6cbe45f397f472ae222/miniflare-package)。本轮查询、取包与真实消费者编译：2026-11-05 UTC；复用旧消费者方法，没有声称模型收益或全面前沿比较。
