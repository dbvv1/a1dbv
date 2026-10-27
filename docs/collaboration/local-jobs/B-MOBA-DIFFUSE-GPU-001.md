# B-MOBA-DIFFUSE-GPU-001 · 首塔漫反射 GPU 对比
id: B-MOBA-DIFFUSE-GPU-001
owner: dot-B
kind: build
status: blocked
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 8ac7340ca3b6148e8158e7e252f1f52edb6e5494
result_branch: relay/b-moba-diffuse-gpu-001

## 目标
从 base_ref 同一干净源码／构建拍 baseline→stylized-diffuse，取得首塔同状态前后真 GPU 图和新启停回执；不用旧 frame16 图。固定 first-tower、seed=61、idle、t=101、frames=1、repeat=2、1280×720；相机沿源码 (-28,24,18) 看向 (-28,0,0)，45°。

## 按什么做
按 a1 最新 game-quality-pass／references/capture.md 及固定 base_ref 的 docs/capture.md。只 headless，无窗口／键鼠／桌面；用已有 Playwright bundled Chromium，不安装、不换 exe、不改安全设置。
启动前只读既有接收端我方任务／进程元数据，确认无其他我方 GPU 任务；不停止用户 Edge，不扫描／杀不明对象。leaseRoot 取既有稳定共享 GPU 工作目录，所有调用共用，不新造根避锁；已有 capture.lock／gpu.lock 不抢不删，独占或安全无法确认即启动前 blocked。
固定干净提交只构建一次；顺序执行下列两条，第一条及清理全部通过才执行第二条，leaseRoot 替换为上述既有根：
```text
node --import tsx tools/capture.mjs --require-gpu --task-id B-MOBA-DIFFUSE-GPU-001 --lease-root <leaseRoot> --shot first-tower --seed 61 --input idle --t 101 --frames 1 --repeat 2 --lighting baseline
node --import tsx tools/capture.mjs --require-gpu --task-id B-MOBA-DIFFUSE-GPU-001 --lease-root <leaseRoot> --shot first-tower --seed 61 --input idle --t 101 --frames 1 --repeat 2 --lighting stylized-diffuse
```
沿原生忽略目录暂存构建与每次独占 run，结束后归档，避免第二条因先写 docs 而脏树。任一命令非零或清理不明立即停，不执行后续命令；保全并归档已有 PNG／JSON／lifecycle 与失败回执，标 blocked。不补跑、不加诊断、不修 baseline。

## 写入范围
提交仅本卡及 result_branch 新增 docs/quality/captures/B-MOBA-DIFFUSE-GPU-001/：manifest、原 PNG／JSON／lifecycle 和短 result。允许原生 ignored outputs 临时构建／产物、既有共享目录内本次自有租约，不改删旧锁；不改源码、旧图、默认入口、产品 main、Site 或接收端设置。公开前核实际产物并扫描；不发 wsEndpoint、nonce、完整 argv、私有路径或 DEBUG 原日志。

## 怎样算做成
两条原生命令均退出 0、report.passed=true；rendererClass=gpu、repeat 原 RGBA／state／camera 门槛不放宽。manifest 对齐同 source/tree/bundle、before-after 同 state/camera/renderer；受控渲染变量仅 lighting 不同，原始 runId／时间／PID 如实保留。每次实际 flags、自有句柄退出、preview 端口拒连、ownerMatched=true 与 released=true 齐全；不外推全机进程退出。新 API 此前仅 CPU 验证，本次是受控实跑，不自动判品质通过；交 review_ready 给 dot-B 盲判。旧卡仍 blocked，历史 #1 owner 比较缺失不补造。

## 当前结果

- 已按卡面在固定提交 8ac7340 上一次干净构建并实跑 baseline GPU 拍摄（renderer=gpu、RTX 5070、unmasked，state/camera 与清理回执齐全），但重复拍摄 frame 0 RGBA 不一致致退出 1，按规则未执行 stylized-diffuse，故无 before-after 图与任何品质结论；三路独立审查通过、openIssues 为空（仅一条非阻塞表述观察），本卡为 build 类，无读者实测/页面卡点与候选收集项，归档 16 个文件已核对与返回一致。
- 产物：[7968512](https://github.com/dbvv1/MOBA-Like/commit/79685125d2489c8e1edd2a5785eb49e2b5b78ae7)，分支 `relay/b-moba-diffuse-gpu-001`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：先由代码卡使同渲染器逐帧 RGBA 可复现（旧卡 B-MOBA-HEADLESS-GPU-001 同因 blocked），再从同一固定干净提交重跑本卡 baseline→stylized-diffuse 两条命令并重做证据归档。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
