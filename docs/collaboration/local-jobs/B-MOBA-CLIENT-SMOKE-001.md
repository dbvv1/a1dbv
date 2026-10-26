# B-MOBA-CLIENT-SMOKE-001 · 固定客户端候选的真实浏览器验收

id: B-MOBA-CLIENT-SMOKE-001
owner: dot-B
status: revision_requested
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 35c82ed114139e47a0029a795460528e4ba9810f
result_branch: relay/b-moba-client-smoke-001

## 要完成的事

给试玩 MOBA-Like 的玩家接收技能瞄准预览与取消；完成后能按 Q／E 看到对应范围，按 Esc 取消并继续正常施法。用固定源码的真实浏览器 smoke 验正常输入与 Three 场景，不把旧版本通过或人工审美判断代替本次结果。

## 修改要求

原 `d32f5d9` 已接受，保留下面历史结果。本次仅续验 `b/moba-targeting-preview` 的上述固定 SHA，tree `6bb47ff3eb83957e62656eea92070a026c398508`；119项测试、CLI／Web构建和非作者差量审查通过。原作者已补 Q／E 预览及 Esc 取消的真实断言，保原 WebGL2／输入／施法／像素等检查；本任务只执行现成 harness，不修改代码、依赖或断言，不新任务号、不重做实现。先核本次是否已有调用，未结束则接续。

在既有获授权接收环境取得精确提交，使用 Node >=22.12.0，执行 `npm ci`、`npm run smoke`。后者自行 build:web 并启动临时 loopback 服务；如现有授权环境缺 Chromium，仅按官方 `npx playwright install chromium` 安装。失败保留原退出码和具体阶段，不换镜像、代理、浏览器二进制或 sandbox 绕过拒绝；不设置 `MOBA_SMOKE_CLOUD_NO_SANDBOX`，该例外仅限 dot 自身云容器，不能扩到本机。

## 当前结果

- 固定候选 `d32f5d9`（`b/moba-playable-integrated-v8`）的 `npm ci` 与 `npm run smoke` 在本机实跑退出 0，原有断言全部通过（contentVersion 8、E 键鼠施放、技能区域与效果对象、非背景像素、无浏览器错误），渲染为软件 WebGL2；独立审查通过。
- 按 MOBA-Like brief 的合入门槛，这个候选可以直接合入 main；硬件 GPU 画面与手感进入待人工验收。
- 10-26 按用户方向调整由 Claude 核心方向会话接收，原“补录证据字段”的修改要求取消，旧过程见 Git 历史。

- 新 `35c82ed`：待本次浏览器结果；软件渲染据实记录，人工美术与手感另验。回写固定版本、实际命令退出及通过／失败结论即可，失败给具体阶段交原客户端 owner；不额外补录证明字段、不上传本地截图／私人路径／完整日志、不改产品 main或部署。
