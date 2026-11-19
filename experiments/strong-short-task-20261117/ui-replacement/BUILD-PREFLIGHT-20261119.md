# Sortable 构建预检：源码确实进入页面加载的产物

**云端已验证：固定依赖下，显式设置 `NODE_ENV=umd` 可重建与原发行文件逐字节一致的 `Sortable.js`。** 页面直接加载这个文件；改源码后必须重建，不能拿旧 bundle 检查修改效果。本次没有运行模型、修复 bug 或重新执行浏览器拖拽，不解除正式卡的隔离/GPU 阻塞。[云端实测，2026-11-19]

## 可复用命令

在 SortableJS/Sortable 固定 `63ecb31937d19fcb30aa924e82ee8a769ef34492` 的独立检出根目录执行。`<temporary-cache>` 替换为可写临时缓存目录；初次下载需要 npm 官方仓库访问，依赖准备完成后仍按正式卡冻结两臂环境。

```sh
npm ci --ignore-scripts --no-audit --no-fund --cache <temporary-cache>
node -e "require('child_process').execFileSync(process.execPath,['node_modules/rollup/dist/bin/rollup','-c','scripts/umd-build.js'],{env:{...process.env,NODE_ENV:'umd'},stdio:'inherit'})"
```

Node 启动器避开了项目 npm 脚本中的 Windows `set NODE_ENV=umd&&` 语法；目前仅在 Linux 实跑，方向会话仍需在 Windows、实际两臂所用 runner 中确认，再把命令与依赖实值填入 RUN-ENV。不要修改冻结提示。

## 验证结果

| 项目 | 实测 |
|---|---|
| 环境 | Linux；Node 24.22.1；npm 11.9.0；Rollup 1.32.1；Babel core 7.14.6 |
| 安装 | `npm ci` 成功，596 包；禁用安装生命周期脚本，未运行 TestCafe |
| 依赖锁 | 仓库原有 lockfile v2；1192 条 resolved URL 均为 registry.npmjs.org；安装后锁文件未改 |
| lock SHA-256 | `67196be83f0839157b46e13e37cb914dd284fd6f9dc318abcf82f78199cd2eb0` |
| 构建路径 | `entry/entry-complete.js` → `scripts/umd-build.js` → `Sortable.js`；原预检 fixture 的 script src 就是 `Sortable.js` |
| 原文件及正确重建文件 SHA-256 | `ef647f5de9f6229193bcf1c024e706b24aa1a73fb3876a1fc7b780f16d4200f7`，逐字节一致 |
| 源码变化探针 | 临时给入口追加合成导出属性，重建后 `require('./Sortable.js')` 能读到；恢复入口再重建，属性消失、文件恢复上述哈希。没有改 bug 实现，探针未保留 |

**不设置 `NODE_ENV=umd` 仍会构建成功，但不是同一产物。** 对照命令仅运行 Rollup 配置时 exit 0，`babel.config.js` 未启用对应 preset，输出哈希为 `683bd7dc4d913e316f0af10a0b29e2ef5542c8e3c51ac5071c6216efc85a1258`。不能只以构建退出码判定运行链正确。

## 限制与下一步

首次安装因默认 home 缓存不可用失败，换显式临时缓存后成功。构建报告旧 caniuse-lite 与循环依赖警告，未升级依赖；这些结果只针对上述锁文件和工具版本。`--ignore-scripts` 足以完成本次构建，不代表项目完整测试环境已安装完备。

云端 Chromium 在页面启动前因 `socket() EPERM` 阻塞，未关闭沙箱或改安全设置。因此没有新的原版/重建版拖拽对比；文件逐字节一致支持沿用原基线产物，但不冒充本次浏览器、GPU 或模型看图验证。

方向会话可直接使用已验证的构建入口，不必重新摸索源码与 bundle 的关系。正式运行仍需原卡规定的读边界、网络边界、有效指令/工具、GPU/图像查看和相同 runner 验证。既有预检驱动只采集事件，不自动判通过；若外置验收，须由调度者从受控实际运行采集三轮完整事件并核唯一 ID/顺序，不能把 exit 0 或模型自报 JSON 当质量通过。本次没有新增验收程序或改变冻结口径。
