# FactorioLab 原消费者的无浏览器复跑

这是 2026-11-10 环境重建后的入口，不是此前临时产物的原件。
固定公开源码 `factoriolab/factoriolab@f785e10becb84afd1fe546ac5b4098271207aabd`，运行 Button 创建与 Router Migration 的两份原 spec，共 29 个既有测试。

要求：Linux、Node 24（实测 24.22.1）、npm、Git、Python 3、GNU timeout、sha256sum，以及 GitHub/npm 下载权限；会下载并执行该公开项目依赖，预留约 2GB 工作空间。

```sh
bash run.sh /tmp/factoriolab-check-unique
```

父目录须已存在；目标目录以原子 mkdir 创建、必须尚不存在（包括悬空链接），路径及解析后的路径不能含空白字符。入口在新目录取得固定提交、按原锁文件 `npm ci`，独立 provider 按随附锁安装 jsdom 31.0.0，只链接其入口，不更新项目依赖或锁文件。在该副本新增官方 Angular 21 `unit-test` target，不替换原 Karma target；保留原断言并核前后哈希。任一步失败返回非零，安装/测试有限时；原目录与日志保留供检查，不自动重试。

Vitest 4.1.5 使用 jsdom、单线程 worker、middleware 模式，无浏览器、UI、watch 或调试监听；预加载护栏遇到任何 `net.Server.listen` 立即抛错，不模拟成功。它不是完整网络沙箱。

验收看 `run.log` 的 **2 files / 29 tests passed**、JSON 报告核定 2 文件、29 断言全部 passed（无跳过）、两消费者哈希和锁文件检查、末尾 `RUN_EXIT=0`。这是 Node DOM 下的既有断言验证，不是 Chromium、布局、真实点击或生产验收；本入口仅重建迁移前基线，不证明 Angular 22 迁移成功。

公开原项目：[FactorioLab](https://github.com/factoriolab/factoriolab/tree/f785e10becb84afd1fe546ac5b4098271207aabd)（MIT）。不附上游源码或完整安装日志。

## 本轮重建实跑

2026-11-10 21:11 UTC，最终脚本在新目录完整运行：项目 `npm ci` 1249 包、独立 provider 28 包；构建 8.418 秒，Vitest 2 文件 / 29 passed，JSON 核验 0 failed/skipped/todo，消费者与项目锁文件检查通过，最终退出 0。未执行 Angular 22 迁移。

返工：第一次 JSON 配置只输出到终端，验收脚本正确失败；改用 Angular target 的 reporter tuple 后重建新目录通过。负例：缺参、已有目录、相对/空白路径和悬空链接均拒绝；缺父目录原子创建失败；缺失、坏格式和含跳过断言的 JSON 在 `PYTHONOPTIMIZE=1` 下仍失败。监听护栏自测立即失败，正常测试未触发。
