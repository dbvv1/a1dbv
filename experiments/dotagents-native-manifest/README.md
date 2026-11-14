# 原生 manifest 合法，分发器仍可能拒绝

读者要把现有 shadcn Cursor 插件交给 dotagents 管理时，先检查分发器是否支持原生 manifest 的字段形状；不要为了通过导入删掉 MCP 声明。当前 3.4.0 的这个解析入口仍拒绝内联 `mcpServers`，先保原生安装路线；没有跨客户端分发需求就不额外加管理器。

## 实做

- dotagents 固定 `81fa16f2bb6645dae9b8f8a5cb04297c838474fd`（package 3.4.0）。
- 真实任务来自 [#211](https://github.com/getsentry/dotagents/issues/211)，原作者已提出 union 方案，本次不是原创修复，不重复投稿。
- shadcn/ui [ba1503c 原 manifest](https://github.com/shadcn-ui/ui/blob/ba1503c/.cursor-plugin/plugin.json) 的 blob 为 `464694d2eb306ca99a9002fdfdb40ff1d1c7f49f`；本轮读取的 main 同 blob。
- 直接调用项目原生 `parsePluginManifest` 和 `resolvePlugin`，放入隔离的临时本地 source。原解析器拒绝真实内联对象；候选接受后完整 manifest 不变、`nativeSource` 为 cursor、authored native manifest 不变。
- 路径字符串继续接受；混合路径/对象数组从拒绝变接受；父目录、绝对路径、URL、Windows 绝对路径四类数组路径项仍拒绝。**内联对象的服务器配置与命令不由这个 union 校验**：非作者附加探针中的 `{x:42}` 和 `{x:{command:'../evil'}}` 都被接受，不能将路径检查概括为 MCP 安全验证。
- 原有相关两文件 29 测试通过；完整 lib 的 17 文件 329 测试通过，lib TypeScript declaration check 通过。

这是分发器的解析与本地 source 解析实做，未安装或激活插件、未运行 MCP、未调用模型；没有证明 Cursor 运行或全部客户端投影可用。非作者在独立副本重跑基线／候选、29 项相关测试与完整 329 项 lib 测试，结果一致；未更新答案页评级。

## 重现

在固定 dotagents checkout 中，用声明的 pnpm 10.28.2 `install --frozen-lockfile --ignore-scripts` 安装依赖；缓存放独立可写工作区。复制本目录 `consumer.ts` 为 checkout 的 `consumer.ts`，`manifest.json` 为 `consumer-manifest.json`。

```sh
node --import tsx consumer.ts
git apply /path/to/native-manifest.patch
node --import tsx consumer.ts
cd packages/dotagents-lib
../../node_modules/.bin/vitest run
../../node_modules/.bin/tsc -b --emitDeclarationOnly
```

consumer 的临时 source 保留在 checkout 的 `consumer-*`，不涉及真实配置。`base.json` 与 `candidate.json` 保存本次输出；不要以脚本 exit 0 代替逐项结果核对。

首次宿主 pnpm 安装因默认缓存路径不存在失败；改用工作区缓存后，宿主新版 pnpm 不再读取旧 overrides，frozen 安装拒绝。本次没有改锁文件或关闭策略，改用项目声明版本后安装成功。首次测试误用了不存在的 `--project=lib`，零测试；改按 package 原生 cwd 执行后取得上面的 329 项结果。
