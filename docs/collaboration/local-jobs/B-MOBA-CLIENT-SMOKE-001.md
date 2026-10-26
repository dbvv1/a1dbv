# B-MOBA-CLIENT-SMOKE-001 · 固定客户端候选的真实浏览器验收

id: B-MOBA-CLIENT-SMOKE-001
owner: dot-B
status: review_ready
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 48faed4190ebf18029a0350364b4faa3c0fa1c76
result_branch: relay/b-moba-client-smoke-001

## 要完成的事

给试玩 MOBA-Like 的玩家接收施法与角色动作的真实接线；完成后正常 E 输入能驱动已挂接角色的上身攻击动作，且预览／取消／施法仍可用。用原严格 smoke 的真实输入、角色 Action 权重与已有场景断言确认接入，不把 CPU 动作测试当完整画面或手感通过。

## 修改要求

原 `97a29a5` 已实测接收并合入产品 [92e229b](https://github.com/dbvv1/MOBA-Like/commit/92e229b114cdf7e2d0e5f17edd6aa0f20b67071c)，受检树与正式树相同。本次仅续验 `b/moba-event-animation` 上述固定 SHA、tree `a4896729e068b9e1d1b05cb9e109066961d5d72b`；29项presentation／138项root测试、根tsc／双构建及新上下文独审通过，时钟／朝向／终局修复已闭合。原调用已完成；先核本次是否已领取，若仍在途接续原调用。

只执行现有 `npm ci`、`npm run smoke`。新严格断言在真实 E 后核已挂接可见 actor 的 `attack.upper` 有轨道且权重>0，保真实GLB请求、Q/E预览、Esc取消、施法区域／Three对象、像素与错误等原全部断言。不改源码／依赖／断言、不重做实现或新增任务；回固定SHA、实际退出与通过／具体失败即可，不补录证明字段。CPU hurt/death二改不等浏览器美术通过，硬件与人工动作观感另验；本任务不改产品main或部署。

在既有获授权接收环境取得精确提交，使用 Node >=22.12.0，执行 `npm ci`、`npm run smoke`。后者自行 build:web 并启动临时 loopback 服务；如现有授权环境缺 Chromium，仅按官方 `npx playwright install chromium` 安装。失败保留原退出码和具体阶段，不换镜像、代理、浏览器二进制或 sandbox 绕过拒绝；不设置 `MOBA_SMOKE_CLOUD_NO_SANDBOX`，该例外仅限 dot 自身云容器，不能扩到本机。

## 当前结果

- 固定提交 48faed4（tree a4896729）上 npm ci 与 npm run smoke 均退出 0；真实 E 输入后已挂接可见 actor 的 attack.upper 权重为 1（24 条轨道），原有 GLB、预览、取消、施法与像素断言全部通过，源码未改。
- 本单元没有文件改动。
- 检查：check_public（文件） 通过；独立审查通过。
- 下一步：本单元已完成，无后续范围；硬件与人工动作观感按任务另行验收。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow。
