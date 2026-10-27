# B-MOBA-HEADLESS-GPU-001 · 首塔灯光同机位 GPU 对比
id: B-MOBA-HEADLESS-GPU-001
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 069b74bc410eec318a1effb0a05a7acc619b5bcc
result_branch: relay/b-moba-headless-gpu-001

## 目标
为已发布的灯光候选取得首塔同状态改前／改后 GPU 实帧，每版独立重复两次；只补拍摄证据，不改灯光、玩法、默认入口或网站。固定版 `npm run smoke` 会用 page.mouse／page.keyboard，本卡不运行、不改写它，完整 smoke 缺口保留。此为唯一新 GPU 卡，四张旧游戏卡保持 cancelled，清理卡不重跑。
改前固定 `baecaf56e131a9bfebbbcf1a65427c45b002b19f`；改后固定 `069b74bc410eec318a1effb0a05a7acc619b5bcc`。分别用干净独立 checkout 构建，不能用移动分支或既有软件图代替。

## 按哪个 Skill／规格
按 [game-taskbook§7](../game-taskbook.md#7-下发本机模型的游戏任务)、[game-quality-pass§1／§4](../../../domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md)及其 [capture.md](../../../domains/game-dev/templates/.claude/skills/game-quality-pass/references/capture.md)；产品固定版 `docs/capture.md` 的 CLI 仅用以下子集。
1. 浏览器前先只读接收端自身任务执行元数据，核本卡是唯一我方 GPU 任务；领取标签不能代替实际运行状态。旧 3D／音频及取消调用不得仍在用 GPU。用户自己的 Edge、桌面和其他工作不在排除或清理范围。
2. 复用已有共享 GPU 互斥入口；没有时，仅在接收端已知、各重试实例共享的本卡稳定运行根原子创建任务锁，写本次 PID、进程启动身份与随机 owner token。不得覆盖／抢占已有锁，不自动回收旧锁，不停其他进程。取得锁后再核我方任务元数据；无法证明独占或没有可信元数据，就在启动浏览器前回 blocked。锁不冒充已验证的跨任务全局调度；本卡未终结前不派第二个 GPU 单元。
3. before → after 串行；每版沿原生 `tools/capture.mjs`，先 `npm ci`、`npx tsc -p tsconfig.capture.json`、相关 capture 测试、`npx vite build --config vite.capture.config.ts`，不得覆盖别人的构建或服务目录。两固定版本的脚本 SHA-256 同为 `5dd0ad8dcb95fc275862f1a905782cc47dff45401ccf88a34fa4214a83dae3a9`。
4. 每版只运行 `node --import tsx tools/capture.mjs --shot first-tower --seed 61 --t 101 --input idle --frames 20 --repeat 2 --require-gpu --out outputs/B-MOBA-HEADLESS-GPU-001`。它新建独占 run 目录、验证服务 bundle 字节、以 `__shotNext(frame)` 推进；不用鼠标／键盘模拟。
5. 保默认新版 headless Chromium、`chromiumSandbox:true`、精确移除默认 `--enable-unsafe-swiftshader`。不加 `--headed`、`--check-live`、`--software` 或自选浏览器覆盖；不关闭 sandbox、不加不安全 GPU 参数、不改浏览器／账号／系统安全设置。先核实际启动 argv；实际配置不符即停止本次自有调用。只生成画布全图，无浏览器 chrome／桌面截图。
6. 每版保 `report.json`、全部 PNG／逐帧 JSON，额外在该 run 根生成 `manifest.json`：来源 SHA、bundle 摘要、相对文件名、SHA-256、shot／seed／input／请求与实际时间／frame／virtualFrame／simTick／stateHash／camera／viewport，以及 renderer 原串、vendor、version、unmasked、`rendererClass` 和同值 `class`。保原三分法；software／unknown 原样记录但不能通过 GPU 门槛。不重标图、不删失败记录。
7. 指定比较帧为 `frame=16`：`virtualFrame=6076`、`simTick=3038`、`t=simTime=101.26666666666667`、`stateHash=019550cb1f074a83`、`contentVersion=11`、`warmupFrames=12`、`alpha=0`。相机位置 `(-28,24,18)`／目标 `(-28,0,0)`／FOV45，1280×720、pixelRatio1；这些来自原软件实帧，仅作状态基线，不作 GPU 品质结论。
8. 成功、异常和取消都只关闭本次新建 browser/context/page 与 preview，复核其自有进程／监听退出后，才以 owner token 释放本卡锁；不能证明退出则保锁、回 blocked，保全部产物。单元最多两小时；不修改接收端脚本、计划任务、其他卡或用户进程，不新建 Codex／automation。缺权限或明确拒绝只停该动作，记录准确目标、原因和恢复条件，不换入口绕过。

## 写入范围
产品只新增 `docs/quality/captures/B-MOBA-HEADLESS-GPU-001/`：收集 before／after 各独占 run 的完整文件及简短 `result.md`；临时构建、锁和必要任务包装脚本只在本任务私有运行空间，绝不进 Git。构建前后固定 source checkout 保干净；收集到结果分支在拍摄结束后做，不影响 sourceDirty。
a1dbv 只回写本卡状态／当前结果；不改 TASKS、其他任务、游戏源码／资产／物理／默认分支或 Sites。结果只快进推指定 relay 分支，不用 accept:auto；商业参照图、原始启动日志、私人路径／会话／账户资料不提交。实际 argv 只回传允许的 flag 与核验结论。

## 怎样算做成
两个完整 report 都 passed、4 张 frame16 全图齐全，manifest 的 class 均 gpu 且 unmasked=true；两版同一原始 renderer、浏览器版本、相机、状态与分辨率。各版两次的20帧 RGBA／stateHash／camera／time逐帧相等；改前对改后仅比较同状态，不要求两版像素相等。检查 PNG 可解码及实际像素尺寸、文件哈希和 manifest 引用均可复核。
非作者核对原始产物与上述条件，按原生 build Workflow 审查；结果用原始值分清通过／失败／未执行，不把 GPU 拍摄通过写成灯光盲判或玩家手感通过。失败仍交有用的真实记录与恢复条件，回 blocked，不反复空跑。
提交前跑适用 check_repo、check_public、空白检查，人工检查实际文件和图片；使用 noreply 身份，提交后扫描新提交身份，只快进推结果分支。回固定提交和产物链接为 review_ready；dot-B 收图后独立盲判，另定是否采用。
