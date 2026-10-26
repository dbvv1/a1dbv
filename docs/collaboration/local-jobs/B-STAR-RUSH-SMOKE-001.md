# B-STAR-RUSH-SMOKE-001 · 当前正式构建的软件 WebGL 续验

id: B-STAR-RUSH-SMOKE-001
owner: dot-B
status: accepted
accept: auto
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 3f73455801037b5bc7587f17d0a5c2c16b2f725e
result_branch: relay/b-star-rush-smoke-001

## 本轮目标

接收者使用原任务的既有本地模型协作通道，不重开同项调用。对当前正式 Star-Rush 构建跑原严格 smoke，确认新增渲染和反馈代码仍能在软件 WebGL 下开局。以现有 `npm run smoke` 的真实退出与报告判定，不用 Canvas 实操或旧树通过代替。

## 固定范围

- 检出 `3f73455801037b5bc7587f17d0a5c2c16b2f725e`，tree `e3e15b7637f8a88ac1a8cbf1d4c46dd8d95d46aa`，父 `5bf61f113d01aa91a323a61d5f61cc08190f7361`。不合入旧 relay 历史、不改变产品代码或测试断言。
- 相比旧验收树，已含 Kenney 默认、严格失败报告、同源 Canvas 转向牌、名次／计时修复、一次性音频门禁和幽灵共享插值；63 项与客户端／API 已通过并独审，不重搭测试或重复这些未变检查。
- 本轮仅 `npm ci`、`npm run smoke`。先读固定版本 AGENTS.md、docs/brief.md、docs/browser-smoke.md；使用 Node24、锁定依赖和默认构建选项（baseline 转向牌、Kenney）。
- 复用原宿主已经可用的匹配 Chromium，保既有 sandbox=true 与项目 SwiftShader 参数。不得把 dot 容器 no-sandbox 授权延伸到本机，不改安全设置、换浏览器／镜像绕过限制或重复已拒下载源。

## 运行与回传

`npm run smoke` 自行构建，启动 loopback 随机端口的生产 Worker、内存 SQLite 与合成状态；不碰生产 D1、账号、凭据，不上传成绩或部署。原断言必须全部保留：真实 WebGL2 非 Canvas、默认赛道开局、倒计时后 W 加速、计时推进、非背景画布、console／page／request／HTTP 错误为零和资源清理。

仅在本地保留 `outputs/smoke/report.json`、`race.png`、`canvas.png`，截图不推仓库或外发。按现有脚本输出回写本文件当前结果：受测固定 SHA、实际两条命令退出结论、通过或首个失败阶段，以及既有报告／截图是否生成；不另增证明字段。失败保真实原因并交 dot-B，不降断言、不修产品或制造空提交。只回本任务，不改其他任务、共享 TASKS 或产品分支。

使用既有接收脚本和已配置模型的普通原生 Workflow；认领前核原运行是否在途，同 ID 续接，不重复启动、不创建 cloud_threads、不直接操作用户电脑、不读取私有模型流。按当前 local-jobs 协议串行回写 running、review_ready 或 blocked，dot-B 接收真实结果。

## 当前结果

- 在固定 SHA 3f73455 上以 Node 24 执行 npm ci 与 npm run smoke，退出码均为 0；严格软件 WebGL2 开局通过且 console/page/request/HTTP/清理错误为零，本地已生成 report.json 与两张截图，未改产品代码或测试断言。
- 产物：[3f73455](https://github.com/dbvv1/Star-Rush-Reborn/commit/3f73455801037b5bc7587f17d0a5c2c16b2f725e)，分支 `relay/b-star-rush-smoke-001`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- dot-B 接收：固定父链／tree 与既定严格 smoke 合同一致，接受本轮 `3f73455` 软件 WebGL2 结果。历史 `e9cf503`／`32b2d3a` 已接受结果仍只覆盖旧树；当前 master `f3cc1af` 后续仅 Canvas 牌层修复，已独立实跑，但未在该新树重跑严格 WebGL。硬件 GPU、审美、手感和听感仍待人工验收。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow。
