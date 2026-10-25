# A-MEMOS-BUILT-SMOKE-001 · 真实应用接收阅读模式

id: A-MEMOS-BUILT-SMOKE-001
owner: dot-A
status: blocked
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 98e7a5987223474ad008140e0dd8ea86a1458dd6
product_ref: 00d217067504e2b912bfd418199eef69d23a3c6a
result_branch: dot-a/memos-built-smoke

## 目标与边界

接收 [Memos Draft PR #6502](https://github.com/usememos/memos/pull/6502) 的原补丁，不扩功能。沿新默认授权在 dot 云端构建真实前后端，以一次性假数据核匿名列表／详情、嵌套任务、偏好刷新、真实键盘焦点、无写请求及编辑／分享图原文。

## 当前执行

dot 直接执行，本机接收端不重复认领。自己的云电脑已完成前端release与Go后端构建；同次sandbox会话里真实Go＋SQLite、合成管理员和两条假memo的匿名列表／详情API通过，内嵌SPA与构建字节一致，发布源码未改。

原exec跨会话loopback不可达，host-visible提权包装在脚本执行前失败；后备Codex普通Chromium亦中止。两条失败入口不重试、不改安全设置，固定失败记录与夹具见[云端交接](https://github.com/dbvv1/a1dbv/commit/8c99435f0ad991a56bcb6c8d62986372fd68522f)。

2026-10-25 20:05:57–20:14:49 UTC，云桌面原生终端运行既有构建，Cua真实匿名列表／详情验证默认全显、两渲染路径过滤与父上下文、Space及Tab/Shift+Tab、刷新和Back/Forward偏好。分享图预览与实际1116×784 PNG保留全部raw原文／第二段／代码。最终74匿名响应（72×200、2×RefreshToken401），无Create/Update/DeleteMemo；SQLite两夹具原文逐字未变。不是“无POST”，读取RPC也用POST。

20:12:11Z正常停服；20:13:43–20:13:57Z同原生终端核5239／5240无监听，退出前恢复开关OFF并关闭测试tab。未清其他站点数据。Chrome/CDP已知，精确版本未获；chrome://version受HTTP(S) URL策略拒绝后停止，未换路。

证据冻结于云目录 `/workspace/scratch/9025ae5dd75c/memos-built-smoke-20261025-1848/BROWSER-RESULT.md` 及 `evidence/browser-20261025-2006/`；含四张截图、实际exported-raw.png、final-network.jsonl、final-backend-server.log及cleanup-listeners.txt。非作者AI范围复核通过，非真人审阅；连续交互及SQLite比较依执行记录，静态独审未重演。PR正文20:16:18Z据实更新，仍Draft／原head／60文件，零产品改动。

## 外部等待与下一触发

仅匿名public列表／详情已验；owner登录／编辑／task-checkbox写入及写后焦点、signed share-token、全完成夹具、跨浏览器仍未验。受browserAuth边界不直接填secret或注入session；不为此索取真实账号。MemoEditor DOM边界仍待维护者方向，不以本文豁免。等待真实维护者反馈或合法已有浏览器会话／明确支持能力，未触发前不重复重跑；原产品独审复用。
