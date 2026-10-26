# B-STAR-RUSH-SMOKE-001 · 当前正式构建的软件 WebGL 续验

id: B-STAR-RUSH-SMOKE-001
owner: dot-B
status: running
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

- 在固定 3f73455 上以真实键盘完成海岸 0–800m 软件 WebGL2 采集，得到 380m/620m 弯段六状态帧、站台/电车帧与画面判断；唯一遗留是 s=95 的 L1 帧仍误标 after-station（站台中心约 97m、电车未入镜），需改名并同步报告。
- 本单元没有文件改动。
- 检查：check_public（文件） 通过；独立审查未通过或未完成。
- 下一步：把 L1 改名为 L1-station_s95（或 L1-approach-station_s95），同步 summary frames[1] 与 crop 文件名，报告注明电车仅 L0_s83 同框、默认追尾视角未验证，然后复审收尾。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow。

## dot-B 质量诊断续接（2026-10-26）

既有 `3f73455` 严格 smoke 与独审的 accepted 结论保持，不重复安装、开局 smoke 或原单测。本次同 ID 只补真实 WebGL 画面与输入的采用判断；不另开任务，不改产品、测试、引擎采用任务或共享 TASKS。

先在原接收端读取已经留存的 `race.png`、`canvas.png` 像素，确认其实际版本及画面。若已有同海岸主弯接近／弯心／离开画面和连续驾驶观察，直接复用，不再运行。原图仅在开局、不能回答弯道可读性时，才复用原已配置环境和固定 `3f73455801037b5bc7587f17d0a5c2c16b2f725e` 的运行入口，以正常 UI 开海岸赛道、真实键盘到约 380m 与 620m 弯段，保留接近／弯心／离开三状态及一次连续转向观察；不得注入位置、速度或伪造输入。保 sandbox 与现有 SwiftShader，不重建浏览器或改安全设置。仍只 loopback 合成状态，不生产账号、成绩上传、部署或截图外发。

判断目标不是“有非背景像素”，而是这一个清晨海岸街机片段：主车青蓝／深色底盘能否从道路与对手分开；箭头是否在入弯前可见；弯心站台／电车是否形成单一地标；出弯是否有海面留白；树、房屋、金币与 HUD 是否遮住路线；轮胎、车身朝向与实际行进方向是否可读。既有 `scenery.js`、`racer.js` 的程序模型和 `render-three.js` 顶点色 toon 是首选复用，不先引入 GLTF、PBR 或重写 renderer。只给具体保留／修改建议，不在本项修改文件。Canvas 是另画的简化兼容表现，不能拿它代替 WebGL 质量判断。

同文件回传固定受测版本、实际看到的缺陷与一项最优先改动、是否需要模型替换／仅编排即可、输入观察的范围；未能看到或听到的明确写未知。声音本项不凭 ready／调用计数作听验结论。若原图已足够则本项到此结束；若运行被具体环境或安全限制阻断，只暂停缺失感知项并回报准确原因，不重跑已通过检查，也不阻止源资产／编排候选继续制作。原宿主发现本反馈后按既有同 ID 续接合同认领，避免重复原调用。
