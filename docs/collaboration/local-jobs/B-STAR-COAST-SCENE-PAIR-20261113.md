# B-STAR-COAST-SCENE-PAIR-20261113 · 整场景同机位对照
id: B-STAR-COAST-SCENE-PAIR-20261113
owner: dot-B
kind: build
status: blocked
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 0405af62c8d1a099fd710a852f42c9f8bcf80968
result_branch: relay/b-star-coast-scene-pair-20261113

## 目标与串行条件

MOBA原卡已于11-13 07:38:20 UTC交回；已核b03b7c22原回执：06:38:59外层exit0，浏览器exit0／preview关闭，06:41:51资源检查runner及Chromium进程均0。现释放前卡拍摄槽并派发本卡；这是回执核查，不冒充此刻现场进程采样，执行前仍核当前资源；派发不表示运行。不重启旧取消卡、不打断现有工作。整景源6a409a7，0405af62仅增加Node22兼容的commit/query拍摄入口；不改游戏、默认或网站。Skill：game-quality-pass／capture.md及目标仓AGENTS。

在同一固定SHA、同一构建、同一浏览器下，当前默认 `/road` 对候选 `/road?scene=coast-afternoon-v1`。三机位 coast-chase、coast-full-bend、academy-depth，1280×720／DPR1。候选统一街屋轮廓与冷暖色带、矮灌木簇，不拆层开关。CPU测试不是出图结论。

## 范围与执行

1. 开始核原调用、实际进程／端口和槽；同单元活跃只读进展。Node22.23.2与原已装Chromium，保真实版本／二进制SHA／renderer，不要求24、不安装升级、不探测驱动。仅headless及隐藏子进程窗口，不操作桌面。
2. 干净独立worktree固定base_ref，记录HEAD/tree/tracked状态，运行 `npm run build`；启动该checkout的 `node tests/smoke-server.mjs`，记录打印的STAR_SMOKE_LOOPBACK为本卡自有预览源。HEAD本身不证明服务器构建来源，须保构建与 served bundle 比对证据。
3. 用游戏仓现有 `tests/capture.mjs`，不用a1旧hard24／写死SHA的脚本。STAR_RUSH_CAPTURE_CHROMIUM指向原已装二进制；SwiftShader与真实renderer记录，不称GPU。下例中OWN_ORIGIN用本卡预览源替换，输出每路每机位独立新目录：

```text
node tests/capture.mjs OWN_ORIGIN/road outputs/B-STAR-COAST-SCENE-PAIR-20261113/default/coast-chase coast-chase --commit 0405af62c8d1a099fd710a852f42c9f8bcf80968 --repeat
node tests/capture.mjs OWN_ORIGIN/road outputs/B-STAR-COAST-SCENE-PAIR-20261113/scene/coast-chase coast-chase --commit 0405af62c8d1a099fd710a852f42c9f8bcf80968 --query scene=coast-afternoon-v1 --repeat
```

其余两机位同样两路；不追加scene=off或重复query，不使用玩家可见诊断链接。只运行本卡固定截图，不混入商业参照公库，不借此声称整局smoke／声音验收通过。

4. 真为测试脚本小问题，可只修tests并回归后重跑失败命令一次；保首错与patch。不改游戏、依赖或观测语义、不删断言。第二次失败如实交回，不重复已完成机位。
5. 保PNG、manifest、source/renderer/Chromium、命令和真实起止UTC、exit/signal、构建日志及SHA、浏览器和自有preview关闭证据，公开扫描，推result_branch交回review_ready。缺外层收集单列，不伪造；执行者不合main、不换默认、不部署。

## 完成标准

六组同机位真实图及repeat证据可配对，候选参数与served构建核实，零未捕获错误或如实首错，owned资源收尾。负责人另安排两位非作者盲选，结合整局smoke与帧耗决定换默认；本卡不把CPU测试或截图冒充品质结项。

## 当前结果

- 原调用、工具或已登记进程尚未确认结束，保留产物与原调用身份，由维护者核清并解除本地隔离后接续；不自动重派。
- 隔离解除（接收端维护，2026-11-13 10:31 UTC）：worker 约 09:46 UTC 在修复／审查循环中停止输出，进程已退出且未写执行结果；复核时无相关进程存活。本机已保全未提交改动：`docs/quality/capture/B-STAR-COAST-SCENE-PAIR-20261113/` 下 default 与 scene 两入口各三机位（academy-depth、coast-chase、coast-full-bend）双拍 PNG 与 report，另有 comparison.json、manifest.json、scene-fallback.json、build-records.json 与 README；dist／worker 只是构建刷新。最终审查未完成，不算验收通过。下一步由你决定：只收集这批已存证据（交维护者公开扫描后推结果分支，不重跑模型），或改回 ready 从头重跑，或取消。
