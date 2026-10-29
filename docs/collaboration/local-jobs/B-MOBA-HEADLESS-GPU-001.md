# B-MOBA-HEADLESS-GPU-001 · 首塔灯光同机位 GPU 对比
id: B-MOBA-HEADLESS-GPU-001
owner: dot-B
kind: build
status: cancelled
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 069b74bc410eec318a1effb0a05a7acc619b5bcc
result_branch: relay/b-moba-headless-gpu-001

## 修改要求（本轮只补既有安全回执）
本轮覆盖下方原拍摄执行步骤：只补原验收遗漏，不新建浏览器／GUI／GPU调用、不重拍、不模拟键鼠、不改代码、重复阈值或 stateHash 基线。原 65 张 PNG、3 份失败报告及 manifest 全部保留，拍摄门槛仍失败，不升级为品质通过。
1. 只读本次既有任务元数据与原始记录，补三次 run 及额外诊断的实际 UTC 顺序、目的、关联 PID／进程启动身份；分清领取、预检、浏览器启动、结束。没有旧记录就明确未证明，不补造时间或把现在的检查当历史证据。
2. 补当时“我方唯一 GPU 任务”预检与原锁的获取／owner 匹配／释放情况；仅任务级锁就如实写明。只读原 argv 的安全相关 flags，明确实际 headless、sandbox、是否含 `--no-sandbox`／`--disable-setuid-sandbox`／`--enable-unsafe-swiftshader`／自选 executable；保报告 requested options 与实际 argv 证据的区别，不上传完整命令行、用户路径或私有日志。
3. 对每次拍摄及诊断自有 browser／preview 链，以已记录 PID、启动 UTC／身份、父子关联与任务归属复核实际退出、对应监听消失／是否被别人接管；不能仅靠脚本 finally、exit code 或 blocked 标签认定已退出。用户的 Edge／桌面／其他任务不在范围。
4. 若仍存在且可确证本任务自有的进程，仅沿原安全清理入口定点结束，再复核身份与退出／监听；不得按进程名或浏览器种类批杀、不停止归属未明对象、不扩大进程树。归属或权限不明就原样保留并报 blocked。
5. 仅 owner token 匹配且本任务资源确证退出后释放原锁；不抢锁、不覆盖／删除不明旧锁，不改接收端配置。若从未有锁／记录缺失，照实写缺口，不能事后创建锁冒充当时执行。
6. 只在原结果分支的既有 `result.md` 补上述公开安全回执，另回写本卡；快进保留 `56b52f8d6e534ac17732d59e656a73706ca26d69` 全部产物。回明确已退出／仍存活／未知、检查 UTC、还缺什么；拍摄复现失败与安全退出分别判定。无新增 GPU 执行；有不明对象或缺证时保持 blocked，不循环空跑。

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

## 当前结果

- 已在 result.md 末尾补完 91 行“安全回执”：重建领取/预检/拍摄/退出的 UTC 顺序，三次拍摄浏览器均有 exitCode=0 与 ownPidsRemaining=[] 的直接退出证据，实际 argv 无 --no-sandbox/--enable-unsafe-swiftshader 等 flag，当前检查未见本任务自有的 browser/preview/锁。整体仍 blocked：三次 report.passed=false、仅有 3 张 frame16 全图，frame16 stateHash 4a4767ad53dba0d9 与卡面 019550cb1f074a83 不符；审查有 1 项未关闭（openIssues：第114/151行把预检 #1 与 #2 的锁证据混写，把 #2 也可推得的 owner PID/token 比较计入缺口）。
- 产物：[3fce7a9](https://github.com/dbvv1/MOBA-Like/commit/3fce7a90fa66da3cce726db8534c02e6a4974a1a)，分支 `relay/b-moba-headless-gpu-001`。
- 检查：check_public（文件与新提交身份） 通过；独立审查未通过或未完成。
- 下一步：先修正 result.md 第114、151行对预检 #1/#2 锁证据的区分；再另派代码卡修复逐文档初始化/绘制顺序并核对 stateHash 基线后按原命令重跑拍摄。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

- 已取消（2026-10-29）：用户决定游戏画面拍摄和浏览器 smoke 全部改在 dot 云端用 headless 浏览器跑（6de4e11a），本机不再续跑；已有结果保留，后续由 dot-B 在云端接续。
