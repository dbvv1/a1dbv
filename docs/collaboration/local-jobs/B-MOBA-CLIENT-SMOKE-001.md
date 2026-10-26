# B-MOBA-CLIENT-SMOKE-001 · 固定客户端候选的真实浏览器验收

id: B-MOBA-CLIENT-SMOKE-001
owner: dot-B
status: revision_requested
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 641cf1622d0805cf03db33711d04f21bd11cc2fd
result_branch: relay/b-moba-client-smoke-001

## 要完成的事

给试玩 MOBA-Like 的玩家接收方向弹道技能图标；完成后 Q Rift Lancet 在真实 HUD 显示对应图标，原技能操作继续可用。以浏览器实际 `img.decode()` 成功和现有完整 smoke 验接入，不用文件存在或人工审美判断替代。

## 修改要求

原 `48faed4` 已实测接收并合入产品 [c2184a6](https://github.com/dbvv1/MOBA-Like/commit/c2184a6216a44dc87e94b59dd5f979bb9906960d)，正式树与受检树相同。本次只续验 `b/moba-projectile-icon` 上述固定 SHA、tree `55c961f7d03d7a06e0effb994eef6836f71744ba`；3项Python／29项presentation／138项root测试、tsc／Web构建及源码、32／48px预览独审通过。原调用已完成；先核本次是否已领取，在途则接续。

仅 `npm ci`、`npm run smoke`，新断言核真实HUD的Q Rift Lancet图 `img.decode()` 成功且64×64，保角色Action／GLB／预览／取消／施法／像素／错误等全部旧断言。不改源码／依赖／断言、不新任务／重做实现、不补录字段；回固定SHA、命令退出及通过／具体失败即可。人工图标观感与硬件表现另验，本任务不改产品main或部署。

在既有获授权接收环境取得精确提交，使用 Node >=22.12.0，执行 `npm ci`、`npm run smoke`。后者自行 build:web 并启动临时 loopback 服务；如现有授权环境缺 Chromium，仅按官方 `npx playwright install chromium` 安装。失败保留原退出码和具体阶段，不换镜像、代理、浏览器二进制或 sandbox 绕过拒绝；不设置 `MOBA_SMOKE_CLOUD_NO_SANDBOX`，该例外仅限 dot 自身云容器，不能扩到本机。

## 当前结果

- 旧 `48faed4`：[f2c83cb2](https://github.com/dbvv1/a1dbv/commit/f2c83cb2)实跑ci／smoke退出0，真实E的挂接可见actor `attack.upper` 权重1／24轨道和全部旧断言通过，源码未改且独审通过；B已接受。旧97等接受保留Git历史。
- 新 `641cf16`：待本次烟测。截图／原始日志保持本地，不上传私人路径或图片；失败交原客户端owner，不自行改代码。
