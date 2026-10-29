# B-MOBA-TOWER-STANDARDS-SMOKE-20261029 · 三件标准件旁置验收
id: B-MOBA-TOWER-STANDARDS-SMOKE-20261029
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: b7687337231df4d275800643472c7f878a885211
result_branch: relay/b-moba-tower-standards-smoke-20261029

## 目标
验证 `candidate.html?standards=tower-standards` 的友塔、友兵营及连续路面三件小样正常加载；默认入口不变。固定游戏内机位比较前后，不扩大素材量，不判美术定稿。

## 按哪个 Skill／规格
按 game-quality-pass/references/capture.md、game-content-production 与细则§7；仅既有接收端 headless Chromium，保留sandbox，绝不OS输入/桌面/可见窗口。一次只运行一项GPU任务；由既有接收端依据实际进程／原调用记录核上一项浏览器、预览服务及父链均退出，串行条件未知即 blocked，不启动、不清锁、不杀进程。
固定 SHA `b7687337231df4d275800643472c7f878a885211`，tree `bc48db509ec097c4e3b918c199325eb8a1a744fd`；不得另挑main、换源或加内容。复用 dot 已核与该远端 SHA 完整 tree 完全相同的468/468 CPU测试和非作者独审，不在本机重跑 npm test。依赖只用已有环境及lockfile；缺依赖只允许 `npm ci --offline`，离线不可用即 blocked，不联网取依赖、不下载浏览器。不重跑 web 构建。
本次仅接续剩余 standards 拍摄，不重跑已通过的完整 smoke 或468项CPU测试。dot依据本单元首轮回执明确批准这一次启动配置修正：从此前 FPS 原成功轮 `18d9a1b`／历史修订 `4207752` 的本机留存记录中，取得已成功使用的既有完整 Chromium 实际可执行文件绝对路径，显式设置 `MOBA_SMOKE_CHROMIUM`；不得用默认 headless-shell。启动前核文件存在、版本及真实串行条件；路径或身份无法核实即 blocked，不猜路径、不搜索替代浏览器、不下载或安装，不改变 sandbox／安全参数。绝对路径与原始身份核验仅本地留存，公开只写浏览器种类、版本及脱敏核验结论。
复用可核实固定源／clean／构建哈希一致的已有 capture 构建；没有对应构建才执行 `npx --no-install tsc -p tsconfig.capture.json && npx --no-install vite build --config vite.capture.config.ts`。运行前核 actual source 为上述固定 SHA/tree、工作树 clean、capture build identity 及 bundle hash；不符即 blocked。使用上述显式浏览器路径与 `MOBA_SMOKE_RENDERER=gpu node tests/client/browser-smoke/standards.mjs`（20分钟上限），仅这一次尝试。若 software／unknown／启动失败或其他失败，保新独占目录、manifest、完整原始日志和退出记录并停止，不再自行换配置或重试；若无法生成脚本 manifest，补脱敏失败 manifest，不覆盖原轮目录。
固定拍摄：first-tower 位(-28,24,18)向(-28,0,0)，barracks-road 位(-82,24,18)向(-82,0,0)，FOV45；分辨率1280×720、pixelRatio1，seed1、t10、input=march、frames1。每机位 baseline/tower-standards 各两次，共8张；命令输入和固定步长由游戏内capture实现，禁止浏览器脚本改状态或注入拍摄键鼠。

## 写入范围
仅结果分支 `docs/quality/smoke/B-MOBA-TOWER-STANDARDS-SMOKE-20261029/`，保留首轮完整smoke目录，并为本次拍摄新建独占输出目录、manifest、PNG；完整 argv、PID／父链与串行时间原始证据仅本地留存，公开仅脱敏退出与串行核验摘要及 raw WebGL 字符串。上传前清除 manifest 的完整 argv、私人路径和个人信息，不上传原始进程／日志文件。只回写本卡当前结果，不改源码/默认入口/模型，不合main不部署。

## 怎样算做成
复用首轮已过完整smoke功能证据；本次标准件manifest passed，actual models两项candidate且road candidate（fallback不算采用）。同机位两次PNG hash一致，前后source/bundle/stateHash/时间/相机/viewport一致，原始renderer信息完整且class=gpu；非gpu/unknown保结果并停止，不换renderer重跑。所有自己启动浏览器和服务有真实退出回执；清理错误即失败。交回review_ready供dot独审，不自动接收、不宣称品质优于当前或完成有意义二改。

## 当前结果
已接收 [2f24dab](https://github.com/dbvv1/MOBA-Like/commit/2f24dabee5279df798a079e3501b134f5311fd95) 的固定源完整功能 smoke 与退出证据：7项hash通过、浏览器退出0、预览关闭、cleanup无错误；原始renderer是SwiftShader/software，不是GPU成功。原轮按边界停止，standards及8图未产出，原证据保留；本卡现按dot明确批准的既有完整Chromium配置仅接续剩余拍摄，待领取未执行，不代表品质通过。
