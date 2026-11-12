# B-MOBA-QUIET-PAIR-20261112 · 当前默认与 quiet 成对验收
id: B-MOBA-QUIET-PAIR-20261112
owner: dot-B
kind: build
status: blocked
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: da56173cb338b3706d20d769ce34cecaa1edb385
result_branch: relay/b-moba-quiet-pair-20261112

## 目标与顺序
前序 FPS 已于06:04:16 UTC交回失败；原报告确认 browserDisconnected=true、previewPortClosed=true，浏览器exit0。本卡按 Star → FPS → MOBA 接续独占拍摄槽。旧卡已 accepted、旧进程不存在，不沿用“设备离线／槽 unknown”停拍。开始前只核当前占用，禁止三卡同时 ready。
固定上述 main，当前默认 baseline 材质与 quiet-family-v1 同机位成对图；两个入口分别自然完整一局、既有完整交互 smoke 及连续帧耗。只产证据，不改源码／工具／资产／默认、不部署。
读目标仓 AGENTS.md、docs/capture.md、tests/client/browser-smoke/README.md、src/capture/cameras.ts；复用已装且匹配锁文件的依赖与浏览器，Node沿固定源码要求≥22.12（本机已有22.23.2及便携24.22.1，不另设24前置）；先预检，缺项即交回，不运行npm ci/install、不下载浏览器、不改变本机设置。

## 现成工具规格
成对图固定 1280×720、DPR1、headless SwiftShader；相同 forest-light-v1 灯光、seed1、t10、march、frames1、repeat2。
规格差异必须显式交回：固定源码完整 smoke 的 newPage 是1280×900（DPR1），HUD检查另遍历320至1280宽，现成入口没有720参数。下列完整smoke按原900规格执行、两材质保持相同；不得声称720帧耗，不改脚本或注入视口补丁。若负责人要求所有阶段必须720，先将此工具规格失败交回，不自行修工具。
唯一本卡输出根：outputs/B-MOBA-QUIET-PAIR-20261112/da56173-swiftshader；必须此前不存在，创建一次；捕获脚本生成的唯一 run-* 子目录保留，不改名覆盖、不换根重试。
独立 worktree 精确 checkout base_ref；记录HEAD/tree及构建前后tracked clean。输出之外不写源文件。开始UTC、交回UTC由执行者填真实ISO8601，禁止预填虚构时间。

## 原有命令（在目标仓根顺序运行，不并行浏览器）
1. `node node_modules/typescript/bin/tsc -p tsconfig.capture.json`
2. `node node_modules/vite/bin/vite.js build --config vite.capture.config.ts`
3. `node --import tsx tools/capture.mjs --software --lighting forest-light-v1 --materials baseline --shot all --seed 1 --t 10 --input march --frames 1 --repeat 2 --out outputs/B-MOBA-QUIET-PAIR-20261112/da56173-swiftshader/default-pair`
4. 核上一步真实退出和预览关闭后：`node --import tsx tools/capture.mjs --software --lighting forest-light-v1 --materials quiet-family-v1 --shot all --seed 1 --t 10 --input march --frames 1 --repeat 2 --out outputs/B-MOBA-QUIET-PAIR-20261112/da56173-swiftshader/quiet-pair`
5. `npm run build:web`，保留构建身份、构建文件哈希和真实退出码。
6. 给下面一条子进程设置环境：MOBA_SMOKE_SOURCE_SHA=da56173cb338b3706d20d769ce34cecaa1edb385；MOBA_SMOKE_RENDERER=software；MOBA_SMOKE_VARIANT=default；MOBA_SMOKE_OUTPUT=outputs/B-MOBA-QUIET-PAIR-20261112/da56173-swiftshader/default-smoke。
7. `node tests/client/browser-smoke/run.mjs --full-match`
8. 核上一步退出／端口关闭，将步骤6仅variant改quiet、output末段改quiet-smoke，执行同一步骤7一次。
环境只施加本卡子进程，不写全局设置。预选同一个已装官方Chromium二进制，记录脱敏标识、版本／SHA256，一致设置 MOBA_CAPTURE_CHROMIUM、MOBA_SMOKE_CHROMIUM；capture的channel默认和smoke默认可能不同，不凭默认推定同浏览器。清除继承的 MOBA_SMOKE_CLOUD_NO_SANDBOX；不能换二进制重试失败。

## 四机位与入口
- gameplay：跟随t10真实玩家(x,z)，position=(x,24,z+18)，target=(x,0,z)，FOV45。
- spawn：position=(-94,24,19.2)，target=(-94,0,1.2)，FOV45。
- first-tower：position=(-28,24,18)，target=(-28,0,0)，FOV45。
- spawn-to-tower：position=(-65,62,46.5)，target=(-65,0,0)，FOV45。
图入口由原脚本生成 /capture.html?shot=<机位>&seed=1&t=10&input=march&frames=1&lighting=forest-light-v1&materials=<baseline或quiet-family-v1>。
完整smoke默认入口 /；quiet入口 /candidate.html?materials=quiet-family-v1&lighting=forest-light-v1。不得加入commands、camera、英雄源或其他候选开关。

## 接收证据与失败处理
每材质四机位各双拍；保留原PNG、JSON、report、lifecycle、构建清单，核尺寸/DPR、sourceCommit/clean、stateHash/camera、灯光相同、材质实际生效，quiet不许静默回退。逐机位双拍RGBA一致；跨材质只比较相同状态/机位，不要求像素一致。
完整smoke保留report.json、manifest.json、full-match-frames.json、终局图及原操作截图；必须从tick0自然推进至规则终局，期间不暂停、不手工推进、不注入命令作弊；随后原脚本继续重开／输入／保存恢复全链。完整smoke的正常测试输入不等于整局玩家操作。
逐帧原样保存callbackMs和intervalMs，交回两路p50/p95/p99/max、超过33.333ms计数、总帧数与实际观察起止UTC。它们是rAF回调CPU及间隔，不是GPU耗时；同设备比较是否明显劣化，勿用固定图预推进计作整局帧耗。
记录浏览器版本、实际argv、renderer/vendor/unmasked、软件档、每个子命令退出码、BrowserServer进程退出和preview关闭、开始/结束UTC。维持原工具sandbox与参数；遇明确拒绝不绕过、不换安全档。
任一步失败保全原目录与部分日志，停止本卡后续浏览器动作，仅关闭已确知归属资源；写明动作、阶段、错误、退出是否确认和恢复条件。不新增smoke脚本或验收工具，工具失败由负责人按交回证据处理。

## 交回与盲选
接收端公开扫描新增产物、去私人路径与敏感日志后，只推result_branch并回写review_ready；列真实开始/交回UTC、产物目录、结果提交和所有退出回执。不得替负责人合入main或部署。
负责人把两路PNG匿名成A/B，交两位非作者只看同机位图独立判断；全部不判更差、至少一位偏好quiet，并且完整smoke与帧耗无明显劣化，才换默认并更新网站；判更差退回。升档、目标图、硬件GPU与人工试听不前置。
未过换默认前仍0/89；源码合入、默认切换、网站版本、品质分与覆盖分别汇报。失败或不完整证据不计通过。

## 当前结果

- 本单元交付文件清单无效，产物保留本地且未提交；修正清单后由接收端维护者接续。
