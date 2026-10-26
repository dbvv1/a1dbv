# B-MOBA-CLIENT-SMOKE-001 · 固定客户端候选的真实浏览器验收

id: B-MOBA-CLIENT-SMOKE-001
owner: dot-B
status: review_ready
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 35c82ed114139e47a0029a795460528e4ba9810f
result_branch: relay/b-moba-client-smoke-001

## 要完成的事

给试玩 MOBA-Like 的玩家接收技能瞄准预览与取消；完成后能按 Q／E 看到对应范围，按 Esc 取消并继续正常施法。用固定源码的真实浏览器 smoke 验正常输入与 Three 场景，不把旧版本通过或人工审美判断代替本次结果。

## 修改要求

原 `d32f5d9` 已接受，保留下面历史结果。本次仅续验 `b/moba-targeting-preview` 的上述固定 SHA，tree `6bb47ff3eb83957e62656eea92070a026c398508`；119项测试、CLI／Web构建和非作者差量审查通过。原作者已补 Q／E 预览及 Esc 取消的真实断言，保原 WebGL2／输入／施法／像素等检查；本任务只执行现成 harness，不修改代码、依赖或断言，不新任务号、不重做实现。先核本次是否已有调用，未结束则接续。

在既有获授权接收环境取得精确提交，使用 Node >=22.12.0，执行 `npm ci`、`npm run smoke`。后者自行 build:web 并启动临时 loopback 服务；如现有授权环境缺 Chromium，仅按官方 `npx playwright install chromium` 安装。失败保留原退出码和具体阶段，不换镜像、代理、浏览器二进制或 sandbox 绕过拒绝；不设置 `MOBA_SMOKE_CLOUD_NO_SANDBOX`，该例外仅限 dot 自身云容器，不能扩到本机。

## 当前结果

- 固定候选 35c82ed 在本机以 Node 22.23.2 实跑 npm ci、npm test 与 npm run smoke 均退出 0，119 项测试通过，smoke 报告 passed=true 且覆盖 Q/E 瞄准预览、Esc 取消、E 施放区域与效果对象、非背景像素及无浏览器错误；软件 WebGL2 已据实确认，未改代码。
- 本单元没有文件改动。
- 检查：check_public（文件） 通过；独立审查通过。
- 下一步：由接收端回写固定版本与命令退出结论；硬件 GPU 画面、手感与美术待人工验收。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow。
