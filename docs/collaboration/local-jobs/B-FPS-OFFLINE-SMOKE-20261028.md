# B-FPS-OFFLINE-SMOKE-20261028 · 离线训练赛旁置入口无头验收
id: B-FPS-OFFLINE-SMOKE-20261028
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 19f718ebd5570ed1fb962b30d4ee607dc1ec9f6f
result_branch: relay/b-fps-offline-smoke-20261028

## 目标
只验已有离线训练赛旁置入口，不制作新玩法或美术，不合 main、不部署网站。固定源码为 base_ref，tree 必须 dffe2ecd3e8b12190037e446112d250ccca9c9bb，不跟随移动分支头。
唯一入口：?gameplay=offline-training-v1&match=complete-v1&squads=offline-v1&environment=courtyard-v1。复用旧四入口真实 smoke 与 106 项 baseline hash／路由回归，不重复旧入口或 capture。
本卡已发布，只有下述只读预检确认后才可启动。前序 MOBA 失败轮已核 2026-10-28 15:01:55Z 六个自有 PID 全部消失、12765 无监听，但是否随后另起调用未知；旧退出回执和 Git blocked 均不能证明现在可启动。

## 按哪个 Skill／规格
按游戏细则 §7、local-jobs 与固定源 tools/smoke-backlog.mjs、tools/smoke.mjs、tools/smoke-offline-support.mjs；仅 headless Chromium 的 Playwright 页面输入，不打开可见窗口、不操作系统键鼠或桌面。
接收端先只读核原 B-MOBA-BACKLOG-SMOKE-20261028 是否另有活跃执行；如有，不打断、不同时启动浏览器，仅回其实际阶段／自有退出事实，待确认结束且无冲突再执行本 FPS 一次。无安全可读元数据则本卡 blocked 并写缺口，不能把 MOBA 的 Git blocked 当退出。启动前再核实际 GPU 任务、浏览器／预览父链及既有串行条件；一次仅一个 GPU 任务。不创建新锁、不改锁根、不清锁、不停止或碰触未知资源；审查员只读本轮结果，不另跑浏览器。
在独立工作树精确 checkout 固定 SHA，核 HEAD/tree/clean。复用已通过的 323 项 CPU、构建、独立非作者审查及 106 baseline hash／路由证据，不以重复 CPU 工作占用本轮；本命令仍按既有实现构建并记录本机产物 hash。
复用现有本地依赖与可定位 Chromium；依赖缺失可尝试 npm ci --offline，离线不可满足则 blocked，不联网安装或下载浏览器。设置 FPS_SMOKE_RENDERER=native，必要时只设置 FPS_SMOKE_CHROMIUM 已有可执行路径，路径仅本地保留；执行 npm run smoke:offline-training。
不改产品、时钟、模拟状态或任何测试断言；不加入网络玩法、不访问外部页面。保留 chromiumSandbox:true 和移除默认 unsafe 参数的现有实现，禁止 no-sandbox、disable-setuid-sandbox、unsafe-swiftshader；不换 renderer 或浏览器规避失败。
接收端对依赖准备施加完整10分钟外部超时，对整个 smoke 命令（含命令内构建）施加300秒外部超时；脚本首回合自然等待上限120秒，其他动作遵循固定脚本。超时先核自有进程和已有产物，仅关闭本任务确定归属的资源，不盲重试、不修改脚本。

## 写入范围
产品源码、锁文件和测试／smoke 脚本只读；允许离线安装缓存、被忽略 dist/、web-dist/ 和 runner 创建的 outputs/offline-training-smoke/<source-commit-prefix>-<unique>/。每轮必须全新独占目录，不指定旧目录、不覆盖或混入历史证据。
只在 result_branch 新增 docs/quality/smoke/B-FPS-OFFLINE-SMOKE-20261028/<run-id>/ 的本轮 manifest.json、report.json、实际截图与脱敏退出证据；任务卡仅回写当前结果。保留失败现场，不伪造缺失截图或字段。
原始日志、argv 和进程父链本地留存；公开副本删除私有路径、用户名、完整 argv、wsEndpoint、nonce、凭据和内部对话，注明脱敏；保留 raw WebGL renderer/vendor/version 及分类所需公开字段。禁止桌面截图。
不改 main／Site、仓库设置、接收端配置、调度或其他任务；只正常关闭本轮自有浏览器与预览服务。

## 怎样算做成
实际页面核对九个 bot controller／十名角色、完整六回合模式 HUD、courtyard active、WebGL2 和非背景像素；页面输入移动／瞄准／开火／换弹中断，暂停时 tick 冻结、恢复推进；自然完成首回合，用 UI 下一回合保留记录，然后“重新开始”清空整场记录／比分／弹药状态；无页面、控制台或请求错误。
当前 UI 没有“只重开本回合”动作，不能制造该覆盖。报告明确 fullMatchPlaythrough:false；六回合浏览器整场、半场换边、终局及“再打一场”、真人画面／手感／听感均未覆盖，不拿 CPU 六回合重放冒充实玩。
交本轮 manifest 的 sourceCommit/sourceTree、clean 证据、构建文件路径与 SHA-256、run query/status/signal、report、实际 PNG 的大小及 SHA-256。源码、构建身份必须与固定输入和本轮相符；记录 raw renderer 与 gpu/software/unknown，native 请求不等于 GPU。
交实际起止 UTC、npm/runner 退出码、自有 Chromium PID／父链及原始 process did exit 的 exitCode/signal、browserDisconnected、预览 listener 关闭与端口不可达。本脚本 manifest 的 browserExit 与 report.cleanup 都须核，不以 passed 代替退出。记录既有串行条件；无共用锁则如实写无锁，不虚构归还证据。
smoke 结束并核实自有资源退出后立即先回起止 UTC、退出码、renderer 分类与清理结果；报告整理、公开文件／提交身份扫描和独审随后在同一任务继续，不用 running 标签掩盖已结束的 GPU 阶段。
全部功能断言与退出证据通过后回 review_ready；失败或超时也早回实际结果、保留原始证据和精确阻塞，不额外重拍。dot-B 决定接收及后续旁置发布，本任务不获默认切换或网站部署权限。

## 当前结果

- 完成固定源离线训练单入口真实 WebGL2 GPU 功能 smoke 实测与脱敏归档：9 个 bot controller／10 名角色、六回合 HUD、首回合自然超时、下一回合保留记录、整场重开清零、浏览器退出码 0 与端口清理均通过，19 个构建文件 hash 与产物一致，7 个公开文件 hash 全部匹配；未关闭审查问题 0 项（taskDone／pageStuck 为读者实测字段，本单元 build 不适用）。
- 产物：[1125fc4](https://github.com/dbvv1/FPS-Like/commit/1125fc428dcc0f22be976258fb105a0596ef46a3)，分支 `relay/b-fps-offline-smoke-20261028`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：任务全部范围已完成，无剩余单元
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
