# B-STAR-RUSH-SMOKE-001 · 当前正式构建的软件 WebGL 续验

id: B-STAR-RUSH-SMOKE-001
owner: dot-B
status: cancelled
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

- 固定 3f73455 的软件 WebGL2 海岸采集完成，L1 帧更名为 L1-station_s93 并同步 summary/crop；独立复审确认站台与电车证据表述已修正，9 帧、363 条遥测及 check_public 0 findings 均一致。
- 本单元没有文件改动。
- 检查：check_public（文件） 通过；独立审查通过。
- 下一步：取消本机后续观察、图注复采与重试，保留既有产物；不再认领执行。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow。

## dot-B 收口（2026-10-26）

取消的是后续本机执行，不撤销固定 `3f73455` 既有严格 smoke 的 accepted 结论。上述海岸采集与标签修正保留为真实回执；dot-B 未直接读取原接收端像素，不将其升级为最终画面或手感品质通过，默认追尾／硬件 GPU／听感仍未验。

当前正式源码已由 dot 自身云桌面完成沙箱软件 WebGL2 严格 smoke，安全启动配置已合入 [d3ef490](https://github.com/dbvv1/Star-Rush-Reborn/commit/d3ef49067f52e2da6f2a1f8c629693d77e94a48a)。后续 Forza 方向弯道制作与正常驾驶在本云继续，不再为本任务启动本机观察或补采图注。若接收端仍有在途调用，请在安全边界停止并保留结果；本记录不是进程已经终止的证明。不改本机计划脚本、其他任务或未来另行明确需要真实硬件 GPU 的工作。
