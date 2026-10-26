# B-MOBA-CLIENT-SMOKE-001 · 固定客户端候选的真实浏览器验收

id: B-MOBA-CLIENT-SMOKE-001
owner: dot-B
status: revision_requested
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 97a29a58956e89538d9f6a10b66467d794fa08cd
result_branch: relay/b-moba-client-smoke-001

## 要完成的事

给试玩 MOBA-Like 的玩家接收同一原创角色源的动作版本；完成后默认角色资产能在真实构建中加载，且已有瞄准／取消／施法继续可用。用既有严格 smoke 的真实 GLB 请求和场景／输入断言验收，不把 CPU 动作测试当完整死亡画面或手感通过。

## 修改要求

`35c82ed` 的本机通过结果已由 B 接受并合入产品 [0b27b9a](https://github.com/dbvv1/MOBA-Like/commit/0b27b9a34e1a6156c75959a45790d901f991f072)，不重做。本次只续验 `b/moba-hero-reactions` 上述固定 SHA，tree `88f220230efb274fa7d8ddad755b1bacb4920ec5`；135项root／21项presentation测试、双构建与非作者独审通过。新原创CC0 GLB含5动作，目前实际接入death的alive边沿；hurt／attack尚未接入，后续event桥接不混入本树。

只执行现有 `npm ci`、`npm run smoke`，新harness核真实成功加载 `blue-reactions-*.glb`，保Q／E预览、Esc取消、施法、Three／像素／错误等全部断言。不改源码／依赖／断言、不重派实现、不加补录字段；先核同输入是否已有调用，在途则接续。结果只回固定版本、命令退出及通过／失败阶段，人工动作与硬件画面另验，不改产品main或部署。

在既有获授权接收环境取得精确提交，使用 Node >=22.12.0，执行 `npm ci`、`npm run smoke`。后者自行 build:web 并启动临时 loopback 服务；如现有授权环境缺 Chromium，仅按官方 `npx playwright install chromium` 安装。失败保留原退出码和具体阶段，不换镜像、代理、浏览器二进制或 sandbox 绕过拒绝；不设置 `MOBA_SMOKE_CLOUD_NO_SANDBOX`，该例外仅限 dot 自身云容器，不能扩到本机。

## 当前结果

- 旧 `35c82ed`：[f1f24de8](https://github.com/dbvv1/a1dbv/commit/f1f24de8)回执 `npm ci`／test／smoke均退出0，119项测试与全部浏览器断言通过，软件WebGL2；独审通过，B已接受。更早d32接受及取消补录要求保留Git历史。
- 新 `97a29a5`：待本次固定树烟测；截图与原始日志保持接收端本地，不上传私人路径或图片。失败仅交原客户端owner定位，不扩成新实现任务。
