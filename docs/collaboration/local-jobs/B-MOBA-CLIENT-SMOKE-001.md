# B-MOBA-CLIENT-SMOKE-001 · 固定客户端候选的真实浏览器验收

id: B-MOBA-CLIENT-SMOKE-001
owner: dot-B
status: accepted
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: d32f5d9014200c0e2d686c5d28e7a37114429f51
result_branch: relay/b-moba-client-smoke-001

## 要完成的事

接收端已完成的 [4520ff9 实测回执](https://github.com/dbvv1/a1dbv/blob/345d8d64e063756043284f00f85b8139cdf29665/docs/collaboration/local-jobs/B-MOBA-CLIENT-SMOKE-001.md)由 B 接受，旧通过事实保留，不当成新树通过。本次仅续验最终整合候选 `b/moba-playable-integrated-v8`，固定上述 SHA、tree `1be247214b1cbd394400f907b3e8cfdb478d038a`，父 `4822f31317b3416758b0507e03a2c460991257f4`；已有96项测试、双构建与有效差量独审。原调用已结束，不重做模拟／实现、不新建任务号。先核是否已有本次领取／调用，未结束则接续。

在既有获授权接收环境取得精确提交，使用 Node >=22.12.0，执行 `npm ci`、`npm run smoke`。后者自行 build:web 并启动临时 loopback 服务；如现有授权环境缺 Chromium，仅按官方 `npx playwright install chromium` 安装。失败保留原退出码和具体阶段，不换镜像、代理、浏览器二进制或 sandbox 绕过拒绝；不设置 `MOBA_SMOKE_CLOUD_NO_SANDBOX`，该例外仅限 dot 自身云容器，不能扩到本机。

## 当前结果

- 固定候选 `d32f5d9`（`b/moba-playable-integrated-v8`）的 `npm ci` 与 `npm run smoke` 在本机实跑退出 0，原有断言全部通过（contentVersion 8、E 键鼠施放、技能区域与效果对象、非背景像素、无浏览器错误），渲染为软件 WebGL2；独立审查通过。
- 按 MOBA-Like brief 的合入门槛，这个候选可以直接合入 main；硬件 GPU 画面与手感进入待人工验收。
- 10-26 按用户方向调整由 Claude 核心方向会话接收，原“补录证据字段”的修改要求取消，旧过程见 Git 历史。
