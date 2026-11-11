# B-STAR-QUALITY-CAPTURE-20261106 · 两版海岸同机位品质对照
id: B-STAR-QUALITY-CAPTURE-20261106
owner: dot-B
kind: build
status: accepted
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 7e87d4c32d5014612fcb7a8af8bc49d266d7238c
result_branch: relay/b-star-quality-capture-20261106

## 目标
仅排本张：前版与整层地形版各三机位双拍，交12张同状态真实图给后台非作者盲评，再更新 Star 记分卡。出图、脚本通过或认领都不代表品质提升；完成条件仍是记分卡带同机位图的分数变化。
前版 `811646e8a69bf9803a1de2218b882ab28b4b1f42`，tree `f11e318d3fc19785db094fd18b4e3160f22c6827`；整层版如 base_ref，tree `66fe4f58e9c69e8a7a511ec888e4243e197d9681`。两版都用 `environment=coast-space-v1`，不启 power-tires，不与默认场景混比。

## 按哪个 Skill／规格
按[游戏细则§7](../game-taskbook.md#7-下发本机模型的游戏任务)、[拍摄规格](../../../domains/game-dev/templates/.claude/skills/game-quality-pass/references/capture.md)、固定源 docs/capture.md/capture-presets.mjs 与本卡[捕获包完整合同](../../../experiments/star-quality-capture/README.md)。本包替代原 tests/capture.mjs 执行：原脚本不读 starSideStatus，不能发现候选回退；新增观测/退出/比较脚本先经 CPU 正常、失败、缺输入测试，不修改游戏源码。
1. 开工先读最新卡、同卡原调用与产物、接收端可合法读取的真实队列/回执。旧 Star 修复已交回，MOBA 固定卡 blocked 不恢复；整轮只能本卡占拍摄槽。ready/running 仅静态认领，不证明本机空闲。当前活跃调用、相关工具未结、归属/输出冲突或状态 unknown 时保留排队/blocked，不自行启动第二张、不重试被明确拒绝的核查或换渠道绕过。不复用已取消旧任务、不清未知锁/进程。
2. 仅既有 Node24、Python3、Chrome for Testing156.0.8078.4、两锁匹配依赖；缺项交回，不安装/升级本机软件。版本只读 VersionInfo/SHA-256；禁 chrome --version、可见窗口、探测浏览器。首次实际浏览器内核版本与原始 renderer 必须落盘，SwiftShader 固定，不换 GPU/D3D11 或二进制重试。
3. 按捕获包顺序核冻结源码及原始 LF 字节、跑 CPU 预检、设置两档相同默认构建环境，使用经测的 windows-hide preload 执行真实构建。所有子命令隐藏窗口，包/输出位于源码 worktree 外；源码不变与生成目录差异分开记。必须匹配已重建的固定 bundle/Worker SHA-256，候选不得复用前版 dist。
4. ROOT 固定为 `outputs/B-STAR-QUALITY-CAPTURE-20261106`，须此前不存在；允许新建父目录及 ROOT 一次。两档目录为 `811646e8`、`7e87d4c3`，子目录为下表机位；六个子目录仅由 capture 创建，禁止覆盖或换根第二轮。依次拍完前版三个机位，确保该命令/浏览器/预览退出，再拍整层版三个机位；第一机位首次失败即停所有后续。

| 顺序／机位 | 每档完整路径与查询（接各自实际 BASE） | 固定状态／相机 |
|---|---|---|
| 1 coast-chase | `/road?environment=coast-space-v1&shot=coast-chase&seed=73121&t=28&frames=1&input=road-tour` | tick1680；原追尾 camMode0，后距8.5m/高4.5m，FOV62° |
| 2 coast-full-bend | `/road?environment=coast-space-v1&shot=coast-full-bend&seed=73121&t=28&frames=1&input=road-tour` | tick1680；样条 eye(480,130,100)、target(460,-55,0)，FOV58° |
| 3 academy-depth | `/road?environment=coast-space-v1&shot=academy-depth&seed=95276&t=14&frames=1&input=road-tour` | tick840；原追尾 camMode0，后距8.5m/高4.5m，FOV62° |

样条坐标为沿路/横向/道路以上米数。统一1280×720/DPR1、高画质、Mint Comet、road-v2、练习circuit、无幽灵、静音；60Hz虚拟时钟、原120Hz物理、12次不推进状态预热。两追尾沿原前馈/阻尼，保留实际eye/target/origin，不改车或相机。academy 的 space 开关仍为true，但海岸地形不应用于训练场，是跨档像素回归控制。
5. 每条用 `node --import TOOL/windows-hide.mjs TOOL/capture.mjs SOURCE OUTPUT SHOT COMMIT`，按捕获包替换实际固定值。只开独立 headless Chromium，保留 Playwright 默认参数及 `--no-sandbox --enable-unsafe-swiftshader --use-angle=swiftshader --enable-automation`；不改变外层沙箱。独占 loopback preview 用实际 origin，不接生产/用户浏览器，不用桌面或页面键鼠，不播放音频，不跑实时 smoke。
6. 每拍断言真实 starSideStatus：space=true、power=false、warnings=[]、backend=webgl2；缺失/回退即失败，不能用 URL 或 PNG存在代替。双拍/150ms静置状态与像素一致；车、镜头、seed/t/tick/input、renderer跨档同机位一致。12图落盘解码，非背景且1280×720；错误为空。每条监督 wait 落 receiver-exit.json，记录真实 Node exit；BrowserServer exit/preview close不可由Workflow完成或PID消失推断。
7. 每条 PNG、JSON、原始错误/退出先保留；首次失败/中断/退出 unknown 停剩余，安全关闭本轮确知资源，不补拍或启动诊断实例。先回拍摄结束/失败和清理事实，再整理产物。最后运行 compare.mjs，核全部哈希、跨档状态及 academy像素不变；独立审查只读原图/JSON，不另启浏览器。

## 写入范围
只允许独立构建输出、本卡 ROOT 的捕获/进程证据；源、配置、锁文件和正式素材只读。不改 master、不部署、不动旧任务/失败目录。结果分支仅新增 `docs/quality/capture/B-STAR-QUALITY-CAPTURE-20261106/` 的12原图、逐拍JSON、report、receiver退出脱敏副本、manifest、comparison与README；附实际捕获包文件摘要和构建记录。公开副本按捕获包去本机路径/用户名/完整argv/调试端点，保留原始renderer/vendor/version、参数、SHA、真实退出码与unknown，注明脱敏。

## 怎样算做成
12张实图、六条命令都真实 exit0、WebGL2软件档/双拍/错误/退出/跨档状态门槛全部通过；manifest逐图列固定commit/tree、bundle/Worker与served摘要、URL参数、seed/t/tick、camera/player、sideStatus、renderer、浏览器版本、文件/RGBA摘要及UTC。capturePassed、cleanExitBaseline、父Node退出分开报告。图交后台非作者做盲评前不写品质分、不改默认版；硬件画面/手感/听感仍进待人工验收。
按本卡既有Workflow只读独审、适用公开扫描、diff空白、noreply身份检查，只快进推结果分支后回 review_ready。任何拒绝只停相应动作并保留证据，不换入口代发。

## 负责人接收决定

- 已在产品 master [`ce7b870`](https://github.com/dbvv1/Star-Rush-Reborn/commit/ce7b87083f48c8e8b3bf538148bfa1349d7efa29) 接收原12图、逐拍退出收据与[双非作者盲评](https://github.com/dbvv1/Star-Rush-Reborn/blob/ce7b87083f48c8e8b3bf538148bfa1349d7efa29/docs/quality/capture/B-STAR-QUALITY-CAPTURE-20261106/review/README.md)。三机位探索分均2→2，正式目标／锚图仍缺，内容0/43不变；候选实现未合入或部署，品质完成条件未达成。
- 本卡的固定材料已接收，不据逐拍 Node／BrowserServer exit0或归档包装结果认定外层原调用结束、拍摄槽空闲或解除隔离。原 Workflow 的 implement_agent_failed／reviewed=false 仍保留；后续独立接收不改写其历史状态。
- 11-11 [候选工具02c10a1](https://github.com/dbvv1/Star-Rush-Reborn/commit/02c10a1c6ecacdfd601490b933cabc638cf0e78d)已补显式Windows headless D3D11档，保留SwiftShader默认，硬件档保Chrome sandbox并需独立renderer证据；拒绝headful、混档和软件冒充GPU，失败先保存原始renderer。仅CPU工具准备，本卡冻结包/源码/旧输出均不改，未启动浏览器。恢复仍先核外层退出、未结工具和槽位，再冻结新一组同档源码与完整拍摄合同；不把本工具准备当本卡重新ready或硬件可用。
- 下方是接收端的历史交回，“盲评尚未做”及“带 retryNote 重派”不再作为当前下一步。只沿原ID核对外层调用、未结工具和槽位；未确认前不重派、不重拍、不清锁、不新占拍摄槽，也不重试已拒绝的核查。独立工作照常推进。

## 当前结果

- Workflow wf_cb172de8-072 的 build 实施代理被中断后重试遇到 ECONNRESET，返回 error=implement_agent_failed、reviewed=false，Review/Fix 未运行；git 核对显示仅 README.md 有 +15/-1 未提交改动（新增“交付前独立核验”一节，属允许范围），无其他改动。该改动未经独立审查，本单元未完成。openIssues：缺少三视角审查结论；后台非作者盲评与 Star 记分卡更新仍未做，任务完成条件未达成。未运行：npm test（本卡未要求，游戏源码未改）、硬件 GPU、手感与听感。
- 产物：[05db763](https://github.com/dbvv1/Star-Rush-Reborn/commit/05db7632af46f34473fa999d90520d2059838ad8)，分支 `relay/b-star-quality-capture-20261106`。
- 检查：check_public（文件与新提交身份） 通过；独立审查未通过或未完成。
- 下一步：负责人先核对 README 新增“交付前独立核验”内容与实际产物是否一致，再决定接受并补做三视角审查，或带 retryNote 重派该单元；随后仍需后台盲评并更新 Star 记分卡。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 11-11 产物去向结清

本卡接收已入master `ce7b870`的12原图、逐拍收据和双非作者判断，原Workflow失败保留。后续dot-B已在[6d7cb5b](https://github.com/dbvv1/Star-Rush-Reborn/commit/6d7cb5b62411ae417bf724e30a695a78e1618797)将等同实拍源的整层代码合入原开关，本卡不重开；当前默认前图、完整smoke／帧耗仍缺，未换默认。本卡accepted只表示固定材料去向，不证明原调用退出；原终态unknown与相关隔离保留，不重派、清锁或重试被拒入口。
