# B-FPS-ART-OBSERVER-CAPTURE-20261029 · 三件美术固定 observer 八图对照
id: B-FPS-ART-OBSERVER-CAPTURE-20261029
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 723d910e291b1dfac2ed72086cc4adfc0803cf6f
result_branch: relay/b-fps-art-observer-capture-20261029

## 目标
为现有三件美术同一单元补齐两个明确标记 observer 固定机位的真实 GPU 原图对照；art off/on 各独立重复两次，共八张。不是新美术二改、手感/玩家可达性或品质结项。

## 按哪个 Skill／规格
game-quality-pass，最新版 capture.md 与细则 §7；仅既有接收端单个 headless 浏览器任务。启动硬前置依次为：① MOBA原卡一次当前全量只读核验实际证明原及额外观察／fullsmoke调用settled，按精确PID＋创建时点／父链核全部自有Node／浏览器／动态preview监听及已归属两head当前不存在；② B-SR-RACE-REVIEW-SMOKE-20261029 原调用实际结束且全部自有资源退出；③ 本FPS启动前fresh复核串行槽空闲。历史三观察及两head退出码保持unknown、第三renderer unknown、额外重跑／删产物不合规，不要求补不存在的历史码、不采纳来源自拟书面豁免。排队／认领不是容量，任何当前前置未知即blocked、不启动；标签／Git／锁／超时不代表退出。不清锁、不杀未知或他人进程、不重跑MOBA或Star、不并发浏览器、不恢复旧cancelled卡；不得桌面／可见窗口／OS键鼠。失败、非GPU或renderer未知立即停，不换浏览器／通道。

首次启动前的浏览器选择（2026-10-29 固定，仅排队未运行）：
- 已核 runner 源码 tools/capture-art-observers-worker.mjs 第 22 行支持 FPS_CAPTURE_CHROMIUM → launch.executablePath，外层 runner 通过继承 env 传入 worker。首次启动就必须设置该环境变量，禁止留空走 channel=chromium 默认 headless-shell。
- 仅使用既有接收端此前 FPS GPU 成功回执中那一个已安装的完整 Chromium chrome.exe 绝对路径。接收端从原始成功回执/现有配置核取实际路径；公开证据已将路径隐去，因此本卡不猜造路径、不换其他安装。启动前只读核文件存在、完整 Chromium 身份、文件版本与原成功记录一致，并保存绝对路径、版本及文件 SHA256 于本轮本地启动证据；未能核定即停止并报缺项，不先启动默认 shell 试一次。
- 在接收端当前进程设置 FPS_CAPTURE_CHROMIUM 为上述已核绝对路径，再一次运行 node tools/capture-art-observers.mjs。保持 headless:true、chromiumSandbox:true、禁止 unsafe SwiftShader 的现有安全参数；离线执行，不安装或更新浏览器。
- 浏览器版本/文件选择不等于 GPU 已验：本轮仍须原始 renderer 明确 gpu。任一失败/非GPU/unknown 都保留该独占目录及所有已有日志和失败 manifest 后停止，不在本轮切换可执行文件、换浏览器或重复试跑。只有接收端实际核实上述全部串行硬前置后才可启动；dot 发布本卡不代表已核实进程空闲。

## 写入范围
独立 clean checkout 固定 HEAD 723d910e291b1dfac2ed72086cc4adfc0803cf6f／tree 6513130645f21d660a9ba6ba98da2d775163f510；由原 runner 新建独占 outputs/art-observers/<SHA前12位>-<unique>/，不预建或覆盖。保留 build.log、source-build.json、browser.log、capture.json、manifest.json，八组原 frame.png/metadata.json/manifest.json。除原流程构建输出和本轮证据外，源码、lockfile、runner、游戏状态、规则、地图、模型、存档都不写；禁止目标 PNG 50698cb1650d81a9cdc26d67b10bc454974d3722 以及旧 shot 路由。

## 怎样算做成
复用已有依赖，缺失即 blocked，不安装依赖／浏览器、不改配置或安全参数。在已授权浏览器配置下一次执行 node tools/capture-art-observers.mjs。自建对应 clean source 的 production build 并逐文件 SHA256；八图都有真实原始 renderer=gpu、same camera/sim/commands、同 variant RGBA 两次一致，art-on 确认三件模型实际 ready/active，warm 12 帧不推进模拟。两次正常 offline 入口启动回归覆盖 entry/View 改动；此前真实输入/自然回合/下一回合/重启证据仅复用未变范围，不重写历史违卡。复用已过 CPU 337 项和独审新差量范围，不重跑全套 CPU；只执行原 runner 自带构建。完整manifest passed=true 还必须有真实 browser PID exitCode=0/signal=null 和 preview port closed；Node 与外层 wrapper 各自记录原调用实际开始／结束／退出码，并核全部自有父链实际退出；原始 PID／父链与启动日志仅留本地。关闭失败也必须保存失败回执，不能当取消状态即已退出。图片另交非作者看遮挡/可读性，不把 runner 通过当视觉更好。禁止注入状态、模拟时钟、存档或结果，禁止新输入与 OS 键鼠；仅用固定游戏内 observer 原回放。

只在结果分支 docs/quality/capture/B-FPS-ART-OBSERVER-CAPTURE-20261029/<run-id>/ 发布八张原图、脱敏报告／manifest、完整构建及公开产物 hash、独占和实际退出摘要；失败轮同样保留，原始日志留本地。公开去除绝对路径、用户名、PID、完整 argv、wsEndpoint、nonce、凭据与内部对话，标明脱敏；原始 renderer/vendor/version/unmaskedRenderer/unmaskedVendor 字符串和实际 gpu/software/unknown 分类不改写。不合 main、不部署、不触碰待批目标 PNG。

## 当前结果
固定候选 [723d910](https://github.com/dbvv1/FPS-Like/commit/723d910e291b1dfac2ed72086cc4adfc0803cf6f) 已有 CPU／独审证据；仅排队，八图未运行。先等MOBA本次全量只读当前核验实际满足、Star原调用实际退出，再于启动前fresh核真实串行空闲；未知即 blocked，完成后交回 review_ready 供 dot 判定，不自行作视觉验收。
