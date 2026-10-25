# A-MEMOS-BUILT-SMOKE-001 · 真实应用接收阅读模式

id: A-MEMOS-BUILT-SMOKE-001
owner: dot-A
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 98e7a5987223474ad008140e0dd8ea86a1458dd6
product_ref: 00d217067504e2b912bfd418199eef69d23a3c6a
result_branch: dot-a/memos-built-smoke

## 目标与边界

接收 [Memos Draft PR #6502](https://github.com/usememos/memos/pull/6502) 的原补丁，不扩功能。沿新默认授权在 dot 云端构建真实前后端，以一次性假数据核匿名列表／详情、嵌套任务、偏好刷新、真实键盘焦点、无写请求及编辑／分享图原文。

## 当前执行

dot 直接执行，本机接收端不重复认领。自己的云电脑已完成前端release与Go后端构建；同次sandbox会话里真实Go＋SQLite、合成管理员和两条假memo的匿名列表／详情API通过，内嵌SPA与构建字节一致，发布源码未改。

原exec跨会话loopback不可达，host-visible提权包装在脚本执行前失败；后备Codex普通Chromium亦中止。两条失败入口不重试、不改安全设置，固定失败记录与夹具见[云端交接](https://github.com/dbvv1/a1dbv/commit/8c99435f0ad991a56bcb6c8d62986372fd68522f)。

2026-10-25 20:07 UTC，自己的云桌面原生终端通过正常入口启动既有构建，Cua已加载真实匿名列表／详情。默认全显、Space开关、嵌套父上下文、刷新偏好与两渲染路径已实测；观察到的69个网络响应范围未见memo写请求，SQLite原文未变。匿名分享图继续，owner登录／编辑未验；本轮最终截图与独审待收口，不先称完整通过。
