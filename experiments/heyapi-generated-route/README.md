# 生成 SDK 升级：类型通过，还要核实际请求 URL

**同源 Axios 客户端遇到 Hey API 0.99.0 的根服务器 `/` 回归时，在生成配置中明确 `baseUrl:false` 再生成，不手改生成文件。** 本轮实际运行 0.98.2／0.99.0 发布包，同一消费者的请求从 `/api/auth/login` 变为 `//api/auth/login`；后者按应用地址解析会切到主机 `api`。当前生成物的 TypeScript 检查仍通过，因此接收不能只看生成／编译绿灯。

该配置只适合本来就应走同源路径的客户端。需要服务器地址、部署前缀、多服务器选择或运行时 Axios 实例覆盖时，先核项目契约，不统一清空 base URL。这里不建议普遍降级，也不把未合并 PR 当已发布修复。

## 本次可采用的做法

保留原 plugins，只把客户端项改为：

```ts
{ name: '@hey-api/client-axios', baseUrl: false }
```

重新生成，再调用一个真实 SDK 方法，在终端 adapter 记录实际 `config.url`、`axios.getUri(config)`，并按应用页面地址核解析后的 origin 与路径。普通项目继续自己的集成测试；不要只检查 `client.gen.ts` 文本。这里的 adapter 不发网络请求，不能代替后端／浏览器验收。

**单次请求传 `baseURL:''` 在本例无效。** 0.99.0 的 `buildUrl` 把空值回退到 Axios 实例的默认 `/`。先调用 `client.setConfig({baseURL:''})` 会同时更新默认实例，实测恢复同源路径，但优先把意图留在生成配置中，避免每次再生后漏设。

## 实际结果

输入保留 [用户 #4382](https://github.com/hey-api/hey-api/issues/4382) 的 `servers:[{url:'/'}]`、路由和插件组合。报告没有完整 spec，本轮补成一条 GET 操作及最小响应 schema；不是原应用或登录流程复现。

| 消费条件 | 0.98.2 | 0.99.0 |
|---|---|---|
| 默认生成后调用 SDK | `/api/auth/login` | `//api/auth/login` |
| 仅本次调用 `baseURL:''` | `/api/auth/login` | `//api/auth/login` |
| 先 `client.setConfig({baseURL:''})` | `/api/auth/login` | `/api/auth/login` |
| 生成配置 `baseUrl:false`，重新生成 | `/api/auth/login` | `/api/auth/login` |

两版安装、生成与消费者执行都退出 0。固定 Axios 1.13.4 的 adapter 收到的 URL 与 `axios.getUri` 一致；WHATWG `new URL` 以 `https://app.example/settings` 为基准时，双斜杠解析为 `https://api/auth/login`。`baseUrl:false` 两版都恢复 `https://app.example/api/auth/login`。所有地址和响应数据为公开测试占位，没有请求这些地址。

0.99.0 的默认／关闭自动 base URL 两份 SDK 消费者还通过 TypeScript 6.0.3 的 `strict:true`、`skipLibCheck:false`、`noEmit:true` 检查（退出 0）；旧版未跑该类型检查。没有编译／执行生成的 Pinia Colada 插件消费者，没有验浏览器网络、真实服务器、认证、代理或其他客户端。

## 复跑

环境：Node 24.22.1、npm 11.9.0、Python 3.12.14。依赖来自 npm 官方包仓库；生成器 0.98.2／0.99.0、Axios 1.13.4、tsx 4.21.0、TypeScript 6.0.3 固定在各自锁文件中。Hey API、Axios、tsx 为 MIT，TypeScript 为 Apache-2.0。隔离安装使用 `npm ci --ignore-scripts`，不改全局工具、账户或系统设置。

```bash
python3 experiments/heyapi-generated-route/replay.py --workdir /tmp/heyapi-route-run
```

工作目录须没有 `old`／`new` 子目录。脚本实际生成两版客户端，运行 SDK＋Axios，检查上述路由差异，再输出 JSON；**退出 0 表示复现结果吻合，包括新版默认路由错误，不表示升级通过。** 两个 npm lock 保留实际解析依赖；安装需要联网，消费者没有网络 transport。临时目录保留安装／生成／类型输出与生成代码，公开结果见 [result.json](result.json)。

## 来源与边界

- 一手用户：[Hey API #4382](https://github.com/hey-api/hey-api/issues/4382)，升级后的真实请求路由报告。
- 官方固定源码：[`d6ba11f` 客户端配置契约](https://github.com/hey-api/hey-api/blob/d6ba11fd9ae4f2b707454940121056fdb505235c/packages/openapi-ts/src/plugins/@hey-api/client-core/types.ts)、[Axios 空值回退](https://github.com/hey-api/hey-api/blob/d6ba11fd9ae4f2b707454940121056fdb505235c/packages/openapi-ts/src/plugins/@hey-api/client-axios/bundle/utils.ts)、[实际发送前构造](https://github.com/hey-api/hey-api/blob/d6ba11fd9ae4f2b707454940121056fdb505235c/packages/openapi-ts/src/plugins/@hey-api/client-axios/bundle/client.ts)、[URL 拼接](https://github.com/hey-api/hey-api/blob/d6ba11fd9ae4f2b707454940121056fdb505235c/packages/openapi-ts/src/plugins/@hey-api/client-core/bundle/utils.ts)。源码用于解释；执行的是 npm 发布包生成物，不是源码工作区构建。
- 已有他人修复：[PR #4457](https://github.com/hey-api/hey-api/pull/4457)，本轮核为 open、merged=false，head `2d9f0de0341260f5237a262d87a1f6b0dce79629`。未运行该 PR，不重复投稿；PR 作者和机器人所报检查不算本仓独立结果。

核实与真实生成消费者实跑：2026-11-05。只验证这个已报告的根路径回归和两种配置选择，不是全面 SDK 升级审计或模型收益比较。
