# B-FPS-TERMINAL-RELOAD-BROWSER-20261119 · 结算时撤下换弹提示
id: B-FPS-TERMINAL-RELOAD-BROWSER-20261119
owner: dot-B
kind: build
executor: strong
status: blocked
target_repo: dbvv1/FPS-Like
base_ref: 9f01f0a6f61536e96ea42c1b52274903d43edb62
result_branch: relay/b-fps-terminal-reload-browser-20261119

## 要什么

只核训练赛结算后仍显示换弹的功能修复，不改美术、手感或任何源码。对比下述两个冻结构建：实际玩家正在换弹时自然结算，第一帧已渲染的 `over` 状态应立即撤下换弹文字、进度条和准星 `reloading` 类；活局换弹仍正常显示。必须在结算后的 700 ms 尾帧内、结果菜单尚关闭时留证，不能等菜单遮住 HUD 后称问题消失。

## 几点事实

- **本卡为阻塞交接，不调度、不预留第二个拍摄槽；普通接收端不认领。** 方向会话确认当前 MOBA／其他任务及拍摄槽已经结束后，才可决定启动。只用现有获准的本机无窗口 headless 浏览器路径；不启动桌面、不合成键鼠事件、不用 DOM click／派发事件／直接写 Actor、reload、phase、result 或时钟制造状态，不重试任何已拒入口。
- 基线为 [720450c](https://github.com/dbvv1/FPS-Like/commit/720450c790d4e2ae84bab6b4c8feabbe39c809c5)，候选为 [9f01f0a6](https://github.com/dbvv1/FPS-Like/commit/9f01f0a6f61536e96ea42c1b52274903d43edb62)。两版入口均为普通 `/`，不加 `smoke` 或 `qualityCapture`；核实际加载的是默认离线训练客户端。现有固定 smoke 只走移动带，不能证明换弹复现；没有现成获准入口能观察到活局换弹，就仅回交一般加载／推进 smoke，不另造输入通道或声称本缺陷已验。
- 真实 client 在 `src/candidates/offline-training-v1/client.ts` 先 `view.render`、再 `Hud.update`，随后才写 `#debug-state`；`RESULT_HOLD_MS=700`。在开始前装只读观察，捕获该节点每次真实写入。首次 `phase=over` 的同一回调内一并读取 debug JSON 与三个 HUD 状态、`#menu.open`、观察时间，不能把较新的 `fpsClient.snapshot()` 配上尚未更新的 DOM。前一段须实际读到 `phase=live` 且 `player.reload!=null`；首个 over 仍须 `player.reload!=null`，才能证明不是换弹恰好完成或死亡取消。不得暂停页面／改时钟延长尾帧。

## 交付

- 两版真实构建 SHA／文件摘要、完整最终 URL、Chromium 版本、实际启动参数与 renderer、viewport/DPR、命令 exit、页面未捕获错误及清理结果。若已有批准的通用 smoke 跑完规定 tick，单列其 tick 与结果；不要替代本项专项观察。
- 每版原始同帧 JSON：末段 live 换弹、首次 over，以及结算时间与 tick；保留 `player.reload`、`#reload.textContent`、`#reload-progress.hidden/value`、`#crosshair.classList.contains('reloading')`、`#menu.open` 和观察时间。预期 base 仍残留三提示；candidate 为文字空、条 hidden 且 value=0、reloading=false，权威 reload 快照不被清除。
- 尾帧内取得原始 HUD 截图时另记时间及菜单仍关闭的核实结果；晚到／菜单已打开的图如实标失败，不冒充首帧图。未遇到活局换弹→自然结算、未捕到第一帧或未取得合格图，逐项写“未验证”。交回实际证据供 dot 判定，不合 main、不改默认、不部署；一般 smoke 通过不等于本缺陷专项通过。
