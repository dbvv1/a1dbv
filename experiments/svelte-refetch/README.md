# SvelteKit 翻页时保留旧行并显示等待

在固定公开示例里，保留 `await`，将翻页提示与 Previous/Next 的 disabled 依据改成 `$effect.pending() > 0`。这两处修改在编译后组件试验中通过；不是完整应用、浏览器或上线验收。

## 来源和范围

- 真实需求：https://github.com/sveltejs/kit/discussions/14945
- 目标：https://github.com/davidbaranek/sveltekit-demo/tree/7dea2077f4851e7709b68db11eb6f3e02c0dfa46
- 固定 lockfile：Kit 2.48.5、Svelte 5.43.10、Runed 0.36.0、Vite 7.2.2。
- 官方 Skill：https://github.com/sveltejs/ai-tools/tree/b2589f890e9c5c4a788a557315aa5012d1fba4ba/tools/skills
- 官方机制：https://svelte.dev/docs/svelte/await-expressions#Indicating-loading-states
- 核实：2026-10-23。Skill 的 async 参考资料帮助确定 pending 语义；并未验证原生自动触发或模型增益。官方 @sveltejs/mcp 0.1.27 的 autofixer 已执行，传入 --async --svelte-version 5.43.10，结果无 issues／suggestions；它只是静态分析，不替代行为验收。

已有 boundary pending 只显示首次等待。组件后续 await 会协调状态提交，因此查询对象的 loading 不等于用户此刻可见的后续等待状态。本例原版静态检查 0 错误，运行组件仍出现 pending=1、旧行保留、两按钮未禁用。补丁后等待提示变 true，两按钮禁用，完成后显示新行并重新启用。

Limit 输入没有禁用。`$effect.pending()` 是所在边界异步工作的计数，不是通用网络请求计数，复杂页面应先判断边界范围是否符合交互。

## 可重放

本次 Node 24.19.0；固定 Vite 7.2.2 要求 Node ^20.19.0 或 >=22.12.0。

脚本显式核对固定 Svelte/Kit 版本、必要文件、Query 类标记和独立 jsdom 版本，不匹配就停止。每次生成文件都放入新建的 `.svelte-refetch-trial-*` 目录，保留供检查，不覆盖既有 `.trial`；整个一次性副本验完可按自己的文件管理流程清理。

只在一次性目录使用。上游未发现明确 LICENSE，本包不包含上游整份代码；脚本从读者自行取得的固定公开副本与 npm 依赖读取必要源码。

1. clone 目标仓库，checkout 上述 SHA，审查 package.json 和 Vite 配置。
2. 在应用目录运行 `npm ci --ignore-scripts --no-audit --no-fund`。缓存目录需要可写时使用 `--cache <自己的可写缓存>`。不要为加测试依赖而更新应用 lockfile。
3. 另建一次性工具目录，写入 package.json：`{"private":true,"dependencies":{"jsdom":"26.1.0"}}`，在该目录运行 `npm install --ignore-scripts --no-audit --no-fund`。
4. 将本包全部 .mjs 文件放到应用根目录。先运行 `node preflight-check.mjs` 检查前置条件校验器的正常、缺输入和错误版本分支。设置环境变量 SVELTE_TEST_TOOLS 为第 3 步目录的绝对路径。
5. 原版运行 `node trial.mjs`：必须失败在 pending 按钮应禁用的断言。`node trial.mjs --baseline` 则检查并报告已知原版失败现象，不代表修复通过。
6. `git apply <本包路径>/refetch-loading.patch` 后，`node trial.mjs` 应通过等待、成功和失败边界检查。
7. `node server-check.mjs` 检查真实服务端 schema/handler 和独立服务器渲染；`npm run check` 检查类型。完整 `npm run build` 应另外完成，本次未完成。

## 验收与局限

- 已通过：编译后的实际 Data/Pagination/+page 组件与 Kit 2.48.5 Query 类在 jsdom 中的初次 pending、旧行保留、等待提示、Previous/Next 禁用／重新启用、新行提交、拒绝后进入失败边界。
- 已通过：实际 data.remote.ts 的 Zod schema 和 handler，第二页 IDs 6–10；缺 page/limit 时默认 1/10，缺整个参数对象或 page=0 拒绝。
- 已通过：实际组件的独立 Svelte 服务器渲染保留首次 pending 文本，没有初始数据表。这并不声称 SSR 输出首屏帖子；原例本来就由 pending boundary 输出占位。
- 已通过：修改前后 svelte-check 均 0 错误／0 警告；git diff --check。
- 未完成：生产构建在转换 194 个模块后、rendering chunks 阶段被终止，原因未知。随后一次重复类型检查也被终止，未得到新结果；此前对同一两行补丁的类型检查已完成通过。初次独立 SSR 测试的 dev 构建还曾因测试打包的开发上下文报错，改为服务端 production 编译后通过；不能把它当应用修复。
- 未验证：真实浏览器画面、HTTP 路由和传输、Runed URL 同步、查询缓存／重复请求、hydration、错误后的 reset/retry、真实部署。

组件试验使用真实编译器和真实 Query 类，但替换 URL 状态及响应来源，以手动 resolve/reject 控制等待，不替代全应用测试。server-check 分别验证服务端数据契约与 SSR，不是端到端客户端／服务端往返。
