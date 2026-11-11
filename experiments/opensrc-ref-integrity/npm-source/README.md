# 读取精确依赖源码：发布包已有，就直接读

**🧪 只查某个依赖的实现，先读项目实际使用的包；未安装而版本已明确时，取该版发布包。** 只有包内缺少所需源码、测试或历史，才继续找仓库的精确 tag／commit 与包目录。下面完成 opensrc 用户 #61 的原目标：读取 `next-auth@5.0.0-beta.31`。这个版本不是新项目推荐，也没有虚构用户的锁文件或业务故障。

## 直接读取原用户指定的版本

需要已有 Node.js、npm 和 tar。在新目录执行；不安装 Next.js／React，不运行包脚本或建立认证账号：

```sh
set -eu
mkdir next-auth-beta31-source
cd next-auth-beta31-source
npm pack next-auth@5.0.0-beta.31 --ignore-scripts \
  --registry=https://registry.npmjs.org --cache "$PWD/.npm-cache"
tar -xOf next-auth-5.0.0-beta.31.tgz package/package.json
tar -xOf next-auth-5.0.0-beta.31.tgz package/src/index.ts
tar -xOf next-auth-5.0.0-beta.31.tgz package/index.d.ts
```

先核清单的 `name`、`version`、`exports`，再读实现及类型。三条 tar 命令只读本地归档，后续重读不联网、不改变项目依赖。归档根目录为 `package/`，Git monorepo 对应包位于 `packages/next-auth/`，不要在仓库根清单里找这个包的版本。

固定包的 SHA512 应为下值，可用现有 Node 计算后比较：

```sh
node -e 'const fs=require("node:fs"),c=require("node:crypto");console.log("sha512-"+c.createHash("sha512").update(fs.readFileSync("next-auth-5.0.0-beta.31.tgz")).digest("base64"))'
```

```text
sha512-1OBgCKPzo+S7UWWMp3xgvGvIJ0OpV7B3vR4ZDRqD9a4Ch+OT6dakLXG9ivhtmIWVa71nTSXattOHyCg8sNi8/Q==
```

这个值与[官方该版元数据](https://registry.npmjs.org/next-auth/5.0.0-beta.31)的 `dist.integrity` 相符。换包或版本时重新取得对应完整性信息，不能沿用本例哈希。若包内没有所需文件，保留“未取得”的结论，再查精确仓库版本；不把默认分支或另一个同仓包当作指定版本。

## 从文件得到的实际答案

该包根导出类型入口为 `./index.d.ts`，运行入口为 `./index.js`。实际读取的 `src/index.ts:374` 与 `index.d.ts:323` 都声明默认导出 `NextAuth(config): NextAuthResult`：

- `handlers`、`auth`、`signIn`、`signOut`、`unstable_update` 是初始化返回对象的成员，不是五个包根独立导出。
- `handlers.GET` 和 `handlers.POST` 使用同一个 HTTP handler；无参数 `auth()` 的类型返回 `Promise<Session | null>`，不能假定总有已登录用户。
- `Session` 等类型与许多 provider 转导出自 `@auth/core`。深入它们时继续查该包实际依赖 `@auth/core@0.41.2`，不要把一份归档当作全部依赖实现。

这些是发布文件的读取结果，未运行认证流程。源码可读、类型签名可查，不等于调用方已经编译通过或业务行为正确。

## 实测范围

Linux、Node 24.22.1、npm 11.9.0 上，空缓存的真实 `npm pack` 成功；归档 53,378 字节、475 个文件，包含 118 项 `src/` 文件。独立计算的 SHA512／SHA1 与官方版本元数据相符，SHA256 为 `d00c1d55498b59cde8c645100173c4bd23e5d813b6f434dab3e8e8af08ccf030`。

| 实际检查 | 结果 |
|---|---|
| 首次联网取包、从本地归档再次读取实现及类型 | 均退出 0，读到上面的 API 与导出关系 |
| 已填充缓存后同版 `npm pack --offline` | 退出 0，归档逐字相同 |
| 新空缓存下同一离线命令 | `ENOTCACHED`，退出 1；离线可用不能由一次热缓存成功推广 |
| 不存在的精确版本 | `ETARGET`，退出 1，没有自动改取最新版 |
| 空目录执行不带包名的 `npm pack --ignore-scripts` | `ENOENT`，退出 254；不带参数不是“搜索依赖” |
| 不带版本的 `npm view next-auth version` | 当时返回稳定版 `4.24.15`，不是本题 beta.31 |

另以官方 tag `next-auth@5.0.0-beta.31` 对应的 commit `dab3cfb1a04aad0b20e616bf9f1d21b5d6e318cd` 作内容参照：发布包与该 tag 共有的 12 个源码文件逐字相同，包括 `src/index.ts` 和三个 `src/lib/` 实现。其余 106 个 provider 源文件未以相同路径提交在该 tag，不能声称整个发布包与整仓同树。`src/index.ts` 的 SHA256 为 `d2a47ec303cf0bafed36a094f051acef40f94266218e77313ed3c38e16b6521a`。

该版 npm 元数据没有 `gitHead` 或 `repository.directory`；上述提交来自独立核查 tag。发布生成的 `index.d.ts` 不用不存在的 Git 同路径文件冒充对照。本轮只证明取源与内容阅读，不替代指定本机的读者验收，也未验证模型效果、NextAuth 运行或整页排障路线。

## 为什么不先修取源工具

原问题并非笼统的 monorepo 不兼容：当前完整 registry 仍含旧版 3.29.3／3.29.7 的 string `repository`，opensrc 固定 main `b51de60867e806da1839b33dd29c29424f12521b` 却先把整张版本表按 object 解码。现成 PR #62 只修这个入口，不修版本选择。

同一 main 的 `clone_at_tag` 只试 `v<version>` 与裸版本号，失败可回退默认分支，再按请求版本记缓存。beta.31 的真实 tag 带 `next-auth@` 前缀，因此路径返回成功也不能证明取对版本。PR #57 有相关逻辑，但还带无关 MCP，且已关闭、未合并，原因未知。本轮已用发布包完成目标，未应用、构建或声称运行验证这些补丁；[旧仓库 ref 补丁](../README.md)的范围与缓存限制保留。

**依据**：[原用户 #61](https://github.com/vercel-labs/opensrc/issues/61)、[PR #62](https://github.com/vercel-labs/opensrc/pull/62)（head `64c5f47a767992dec36c4571620bd5f872567960`，开放）、[PR #57](https://github.com/vercel-labs/opensrc/pull/57)（head `a478288199d604a1a719cb5c8bd0f24f952e9d71`，2026-11-10 关闭未合并）、[固定取源实现](https://github.com/vercel-labs/opensrc/blob/b51de60867e806da1839b33dd29c29424f12521b/packages/opensrc/cli/src/core/git.rs)、[npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack/)、[npm repository 契约](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#repository)、[NextAuth 固定实现](https://github.com/nextauthjs/next-auth/blob/dab3cfb1a04aad0b20e616bf9f1d21b5d6e318cd/packages/next-auth/src/index.ts)。核实与实跑：2026-11-11。next-auth 发布包按 ISC 分发，完整许可在归档 `package/LICENSE`；复制源码时一并保留版权与许可通知。本页不附带源码、归档或新下载器。
