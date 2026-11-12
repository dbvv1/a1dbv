# 前沿收件箱

> 用户在 X、linux.do、技术群等处看到的 AI coding 项目、帖子、做法，直接把链接贴在下面（一行一条，可附一句话说明为什么觉得有意思）；dot-A 每周扫描发现的候选也记在这里，标明来源。只贴公开链接，不贴私聊截图或账号信息。dot-A 在 24 小时内处理：写明它对应本仓哪个任务或使用中的问题，能转化的进试用，只是值得一试的新工具进 [13 前沿雷达](../13-frontier-radar.md)“值得一试”表，一行两句以内；处理后在行尾标 ✅ 和去向，本仓此前已收录的标“已有”。规则见[运行手册 §3](LONG-TERM-PLAN.md#3-怎么探索)。

## 待处理

### 2026-11-10：源动画正确，动作起点仍可能选错

FPS [100d104e](https://github.com/dbvv1/FPS-Like/commit/100d104e98ac41d364374bdc4907b9dd6a8a787b)修正原生快照候选：Knight瞄准不再停在举枪首帧，射击从与稳定瞄准匹配的8/30秒开始，保持源速度。真实源复现及非作者41骨复算通过；457测试、构建退出0。沿原候选，不改默认；握枪/过渡画面和View仍未验，0/77不变。做法回写animation.md，不将这次CPU修正计作品质提升。

### 2026-11-10：已拥有的枪械先分离，不另搜资产

FPS [RX24接收](https://github.com/dbvv1/FPS-Like/commit/841386e0f584b0989106c369831f0ba3efcbe17e)保留原枪体、独立弹匣/枪栓与语义挂点，非作者逐点核5874顶点误差0；修复源/输出别名会损坏素材及普通发布失败的保旧问题。仅静态资产与配方接收，主手挂接/游戏同框/风格未验，0/77和网站不变；方法回流animation.md，不把导出称角色持枪完成。

### 2026-11-10：先有被握物件，再接持枪场景

FPS [2e6559f9](https://github.com/dbvv1/FPS-Like/commit/2e6559f9d8f4bfcd1e9f6c34f8d3c386128bd69f)实查固定Knight完整库存和15姿态，未识别出步枪/独立弹匣；运动源无网格。三项测试/typecheck及非作者真实手位复算通过，接触距离保留null。停止把无配套枪的原生动作直接接场景；已定型复用项目RX24独立导出卡，非新资产搜索。知识回流animation.md；未渲染、未部署、覆盖0/77不变。

### 2026-11-10：FPS原生动作从手动采样接到真实快照

[9a5e7d8](https://github.com/dbvv1/FPS-Like/commit/9a5e7d814895bf20b0583c2f65c3de588a708790)沿既有候选接静止步枪的原生瞄准/开火/换弹，不新增来源或旁置。444测试、构建、固定GLB实际Game快照与独审通过；切枪不复活旧射击，重复快照不改变姿态/模拟。未接View/浏览器，0/77与网站不变；知识回流animation.md的接受事件/快照消费。

### 2026-11-10：Star路肩颜色接入整层，默认与评分不动

[候选de3116dd](https://github.com/dbvv1/Star-Rush-Reborn/commit/de3116dd0364fdc40e62f7f87fad4fa6ff7aef20)接收路肩产物4b2a887：沙灰肩面/肩壁与已有墙面同族，仅指定原表面RGB改变；已缓存chunk关闭和晚失败按原字节恢复。非作者代码审查通过；真实GPU、完整smoke和同机位双盲仍未验，2→2、0/43与网站不变。已回流[语义表面配色](../../domains/game-dev/assets/materials.md#semantic-shoulder-palette)，不把顶点色称纹理。

### 2026-11-10：先用固定角色已有动作，不等另一个完整包

FPS[候选afb6fec](https://github.com/dbvv1/FPS-Like/commit/afb6fec462dacfb5854cd6e1b387bbfd77e1d72e)已消费固定Knight原生瞄准/开火/换弹；443测试、构建及真实GLB CPU检查通过，非作者复核。来源卡7992f4c仅部分接收：原包库存可核，274条广搜自报、第三方许可结论不整体采纳；另包清单未取回不阻止消费现有原生动作。默认/网站/0/77未变；枪弹匣接触/实际姿态/过渡未验。方法回流[动画原生动作](../../domains/game-dev/assets/animation.md#native-ranged-first)。

### 2026-11-10：Star 围栏采用到消费者，不把离线位置当已上屏

[固定候选7fc22e86](https://github.com/dbvv1/Star-Rush-Reborn/commit/7fc22e86bc2796f997bfb2b78c86fb00461fae08)已接13件围栏，拒绝27件；完整旧布景包络、当前地形重算、真实chunk矩阵及失败撤回已作CPU验证。三案分数/覆盖与网站不变；本机16件方案缺完整净空未采用。方法已回流[刚体落地](../../domains/game-dev/assets/3d.md#rigid-prop-grounding)，真实画面/盲评待原拍摄槽核清后验，不另排拍摄。


### 2026-11-05：Ruff 清理生成导入，回实际消费者验收

🧪 **Agent 清理生成代码时，别只接收 F401 的“全部修复”。** [Ruff 0.17.3／OpenAI SDK 3.46.0 三组消费者](../../experiments/ruff-import-consumer/README.md)：原文件正常；从模块副本的 `__all__` 删除兼容 alias 后，自动清理退出 0 却删掉仍被使用的原名，实际导入失败；分开 import 的对照恢复本例消费者，另跑 F821 也能抓住错误。导出删除是受控前置修改，不是原版 SDK 故障；未验完整 SDK／真实 API，现有上游 PR 尚未合入，不重复投稿。先读 diff、核导出契约并运行项目消费者，不升统一门禁。实测：2026-11-05。✅ 已回流[自动清理的消费者验收](../decisions/verification.md#自动清理导入导出报告归零后再跑原消费者)。


### 2026-11-05：unused export 自动修复，复扫归零还要验消费者

🧪 **已用 Knip 清理导出时，给 Agent 同时交“公开导出”和“局部绑定”的保留边界，修后运行原消费者，不以空报告验收。** [已发布的真实用户最小复现与独立复跑](../../experiments/knip-workspace-entry/export-fix/README.md)：固定 Knip 6.44.1 正确报告 `localOnly` 未被外部导入，但 `--fix --fix-type exports` 删除了仍被模块内部函数使用的解构绑定；修复命令和复扫均退出 0，消费者却退出 1、报 `ReferenceError`。保留局部解构、仅单独导出仍需公开的名称，消费者恢复输出 `44`，Knip 仍为 0、空报告。它与[旧 workspace 入口误报](../../experiments/knip-workspace-entry/README.md)不同，不靠补 entry 或 ignore 解决。

只在确认没有外部调用方需要该导出时采用这项局部改法；公开包的消费者未必在本地分析图中。材料是用户公开最小复现，不是完整产品事故；未验其他解构、Bun、模型收益或上游修复 PR，不新增默认门禁。**依据**：[用户 #2298](https://github.com/webpro-nl/knip/issues/2298)、[固定输入、官方实现与消费者命令](../../experiments/knip-workspace-entry/export-fix/README.md#来源与状态)。原实跑及来源核实 2026-11-05。✅ 11-08 新读者照[验证页](../decisions/verification.md#自动清理导入导出报告归零后再跑原消费者)完成此公开复现副本的清理，三阶段消费者与最终导出另经复验；已回流答案，不把原轮复跑倒算为读者验收。

### 2026-11-05：Rust API 变更，用下游编译核 lint，不把 warning 当破坏

🧪 **让 Agent 修改发布库的公开 API 时，先跑 cargo-semver-checks 定位，再用同一消费者对照旧版与新版。** [librouting 固定历史实试与复跑材料](../../experiments/rust-semver-consumer/README.md)：0.51.0 报 1 fail、1 warn；23 分支消费者旧版编译退出 0、新版退出 101（E0004），确认新增枚举分支破坏穷尽匹配。但 PartialOrd 的位置警告没有证明旧值排序改变：全部 278 个旧值的 77,284 个有序对两版输出一致，显式 discriminant 不能按源码位置推断。仅测一个 crate 与固定版本，31 条检查跳过，未验完整工作区、所有 feature 组合或运行时；不升默认。已有来源条目的过强排序结论已纠正，原合成类型变更设想未执行。✅ 已回流[公开 API 迁移的消费者验收](../decisions/migrations.md#公开-api库能构建旧调用方仍可能坏)；沿用 11-05 实测，未补称新读者执行。


### 2026-11-05：改包导出与发布内容，验真正 tarball 的消费者

👀 **让 Agent 修改 npm 包的 `exports`、`types`、`files`、构建或 launcher 时，按实际发布产物接收，不只验工作区。** 先检查项目正式构建与打包脚本；若构建已接入 prepack，由 `npm pack --pack-destination <绝对临时目录>` 触发，否则先运行项目要求的 build 再 pack，避免重复执行 prepack；在仓库外新 consumer 中用 `npm install <返回的 tgz 绝对路径> --no-audit --no-fund` 安装，运行承诺的 CLI、import 或 types 消费。依赖与生命周期脚本沿项目已批准策略，不以 workspace 链接或 `npm link` 代替；声明修复不能用 `skipLibCheck` 掩盖。普通内部逻辑改动继续相关测试，无需统一增加打包门禁。

**已发布版本的报告，先查对应包，不用 main 构建结果代答。** 本轮 `npm pack miniflare@5.20260903.0-alpha --ignore-scripts --json` 取回官方历史包：186 个条目中，`dist/src/index.d.ts` 第 25 行导入 `./shared`，但没有 `dist/src/shared` 前缀文件。包 SHA256 为 `a806aa9dd11a8377f050aba82a2771ad487f9b6ae213e8a6435cc33f80d50008`。随后在仓库外临时消费者安装同版发布包与 TypeScript 6.0.3，以 `typeof import("miniflare")`、`skipLibCheck:false` 和 `noEmit:true` 执行 `node node_modules/typescript/bin/tsc --pretty false`：安装退出 0，编译退出 2，复现第 25 行找不到 `./shared` 的 TS2307；另 34 条诊断完整保留，未归因。安装声明与该 tgz 逐字节相同，锁文件 integrity 一致；非作者复跑通过。这次历史包运行仅验证声明消费，未验 Miniflare 运行时或模型收益。本次下载与声明消费者安装使用 `--ignore-scripts`，未验需要生命周期脚本的运行时；本地打包若依赖 prepack，跳过它会改变验收内容。

**11-05 已补当前发布渠道的真实消费者。** [固定版本、锁文件与复跑入口](../../experiments/miniflare-release-consumer/README.md)：当时 npm `latest` 为 4.20260730.0、`beta` 为 5.20261103.0-beta，独立消费者安装均退出 0，原 TypeScript 6.0.3 检查均退出 2，分别在 3／1 处复现 `./shared` TS2307；另 49／34 条诊断未归因。两版 tgz 均无 shared 前缀文件，声明与安装内容逐字节一致。需要库声明检查时，这两版仍未满足该消费者门槛，不能据稳定版标签或 main 构建成功宣称已修；未验其他 TypeScript、运行时或未来版本，不据此推荐降级或开启 `skipLibCheck` 掩盖错误。

**先核脚本测了什么。** QMD 固定 `package-smoke` 构建并运行工作区 dist／wrapper，没有打包安装；这不代表其整套 CI 没有其他检查。pi-quiver 的实际测试则 pack→临时安装→运行已安装 bin，并验版本与文档转换；本仓未运行这两套测试。`--dry-run` 清单与 help 成功都不等于完整消费者验证。✅ 11-08 新读者在独立云端照完整验证页完成固定 beta 的 pack→安装→声明消费，负责人另验包身份并重跑；已回流[按真实发布包验收](../decisions/verification.md#npm-包交付安装实际-tarball再验调用方)。本机 Windows、本地 prepack 与运行时仍未验，不提升地图或新增统一门禁。

**依据**：[npm pack 官方契约](https://docs.npmjs.com/cli/v11/commands/npm-pack/)、[生命周期文档](https://docs.npmjs.com/cli/v11/using-npm/scripts/)；[Cloudflare 用户报告与源码构建／发布包复核分歧 #15377](https://github.com/cloudflare/workers-sdk/issues/15377)；[QMD 固定脚本](https://github.com/tobi/qmd/blob/86d2365d17fc682e491c2c53d1e4a884aee8682a/scripts/package-smoke.mjs)、[pi-quiver 固定产物消费测试](https://github.com/jjuraszek/pi-quiver/blob/ec46ad942df2010cf887270a980446b0a513fda3/test/packed-install.test.ts)。核实、固定发布物静态检查与真实 TypeScript 消费复现：2026-11-05。

### 2026-11-05：偶发失败回原环境验收，别提前取消复现

👀 **本地没复现的偶发失败，不凭本地绿灯验收修补；先保住仍在采集的远端失败证据，再回已复现环境验证。** 可交办：`核版本、平台、目标测试 ID 和失败特征，确认目标测试确实运行完成。记录完成次数与同类失败次数；未复现的修补标为推测。若后续提交或运行会取消尚需的复现任务，先等证据收集完成。` 本地能复现就优先本地迭代；没有取消机制或已有足够证据，不增加等待所有 CI 的门禁。

Chrome DevTools 已落库的 `fix-tests` Skill 按上述环境选择复验，并要求本地未复现时等 stressor 完成再上传，以免提前取消。测试文档提供真实 bot 入口，但重复运行依赖该项目的测试包装，构建模式和平台也须匹配；不照搬双 Agent、三平台、固定分钟数或运行次数。有限次未失败不保证以后不再失败。

**未试用，不升默认。** 本仓当前 workflow 只有 `workflow_dispatch`，同 ref 并发组设有 `cancel-in-progress: true`；普通 push 不会触发这个 workflow，同 ref 再次手动 dispatch 才需注意取消关系。当前没有匹配的远端偶发任务，未运行上游工具、bot 或 hosted CI，不改本仓工作流；落库指导不等于已证明 Agent 收益，当前最佳未知。

**依据**：[一手：DevTools 固定 Skill](https://github.com/ChromeDevTools/devtools-frontend/blob/e1df1f10d345d52b88827564aa71ec3ea8462151/.agents/skills/fix-tests/SKILL.md)、[同版测试文档](https://github.com/ChromeDevTools/devtools-frontend/blob/e1df1f10d345d52b88827564aa71ec3ea8462151/test/README.md)及[扩展至 stressor 的提交](https://chromium.googlesource.com/devtools/devtools-frontend/+/54cb677a3e2e5c905776cefbf165c2a676daa9c2)；[本仓实际配置](../../.github/workflows/repository-checks.yml)。核实：2026-11-05。

### 2026-11-05：缩减真实复现，别换成同报错的另一问题

👀 **让 Agent 处理大型失败输入时，从原样本逐步删减，每步确认仍是原触发原因；回归问题同时重跑固定旧版与新版。** 可直接交办：`保留原件和最近能复现的版本；逐步删除，每步记录目标失败的证据。交付原样本出处、版本与命令、两版实际行为及可读的缩减输入；相同报错文字不能代替同因核对。` 已经短小清楚就直接修；依赖身份、导入路径、并发或平台正是触发条件时，不为自包含而删掉它们，也不要求穷尽所有缩减。

Ruff 的 AGENTS 已把生态差异调查路由到对应 Skill，明确从真实源码约简、每步对照两版，相同诊断或显示类型不代表同因；V8 已落库的 Skill 同样要求保留原件、逐步验证，并选择可读性而非最少行数。**不能照搬 V8 的辅助检测脚本**：它丢弃输出、把任意非零退出计作复现，缺命令也会假阳性，退出 0 的错误输出又会漏检；应按目标诊断、断言或输出判断。有限次重复运行只记命中次数，不照搬“加循环到 100%”的保证。

**未试用，当前最佳未知。** 本轮没有真实待缩减输入，不制造合成案例或新增默认门禁。仓库配置只证明指导已落库；V8 提交作者称多次使用成功，缺逐次独立验证，尚不能量化 Agent 的错因、返工或时间改善。候选去向是已有调试入口，遇到真实大型复现再比较。

**依据**：[一手：Ruff 固定 Skill](https://github.com/astral-sh/ruff/blob/75793d7b70a25ffd95a0089c776180dfdacbff0c/.agents/skills/minimizing-ty-ecosystem-changes/SKILL.md)及[实际路由](https://github.com/astral-sh/ruff/blob/75793d7b70a25ffd95a0089c776180dfdacbff0c/AGENTS.md)；[V8 固定 Skill](https://github.com/v8/v8/blob/e89d4303ebb1706430f6c8d92c989aa7b436b637/agents/skills/minimize-reproducer/SKILL.md)、[辅助脚本](https://github.com/v8/v8/blob/e89d4303ebb1706430f6c8d92c989aa7b436b637/agents/skills/minimize-reproducer/scripts/repro_check.sh)及[作者引入提交](https://chromium.googlesource.com/v8/v8/+/0af8d6c1adcf252ba51be74a222eb50f1a1c9d12)。核实：2026-11-05。

### 2026-11-04：让 Agent 优化真实瓶颈，不追另一个指标

👀 **已有可复现慢场景时，给 Agent 同一输入、正确性要求和目标指标，先读 profile、一次改一个主要热点，再回原场景验收。** 可直接交办：`记录版本、输入、工具链、线程配置与指标；定位热点后提出一项修改，保留正确性与其他受影响场景。计量版本或执行条件变了，先重建可比基线；最终用原先用户关心的指标复核。` 已有 profiler 就借方法，不必迁移服务；没有已确认瓶颈，不启动全仓优化。

**CodSpeed 官方 Skill 的可借部分是优化闭环，不是统一换工具。** 固定源码 `229413f0` 提供 MIT／Apache-2.0 许可文件，要求 benchmark、profile、单项修改和正确性检查，并用 walltime 复核；SWC 确实提交同名 Skill，但文件存在不证明采用收益。该 Skill 要求 CodSpeed 认证、上传和 MCP，本轮未安装或调用。其 Go simulation 示例与当前 CPU 文档仅支持 Go walltime 的说明存在冲突，语言命令须按当前支持矩阵核实，不照抄。

**稳定分数可能换了测量对象。** CPU simulation 的总分不含系统调用耗时，不能单独验收 I/O、接口延迟或游戏帧时间；v5 改过周期估计公式，旧结果不可直接比较，应重建基线。真实 pixtuoid #1843 为处理内存波动给 memory 场景绑单核，`available_parallelism()` 随之为 1、映射改走 inline，simulation 仍多线程。此为源码／配置支持的机制判断；该 PR 同时改工具链等多项设置，不能据此断言波动消失或单因归因，更不能证明生产并行路径变快。其内存工作流还关闭物理 RSS 跟踪，不把报告等同实际驻留内存。

**本仓已在真实固定树扫描中采用“先定位、再按原指标验收”。** [批量读取补丁](https://github.com/dbvv1/a1dbv/commit/0ea64fc93d85326fbafe33e32a8a19663d156ab4)先用 Python cProfile 定位逐对象 Git 子进程开销，再改为有数量和字节预算的批量读取。同一固定 `d247a234` 树、Linux 环境下交替跑旧／新实现各三次，walltime 中位数从 4.074 秒降至 1.585 秒，Git 调用从 1,446 次降至 31 次；六次 JSON 输出逐字相同。观测最大 RSS 从 44,248–44,436 KiB 变为 45,288–45,396 KiB，不能把提速说成更省内存。56 项回归与两位非作者检查通过，补丁已入 main；扫描仍有 43 个跳过项、退出 2，不是全树清关。

这是原生 profiler 与 walltime 的本地实做，不是 CodSpeed 产品试用或模型收益对照，不外推其他负载。游戏开发者原帖与回复支持“具体场景＋引擎 profiler”这一需求，其自报加速缺可复跑产物，不作效果证据。当前最佳未知，不新增模板或默认门禁。实做与接收：2026-11-05。

**依据**：[一手：官方优化 Skill](https://github.com/CodSpeedHQ/codspeed/blob/229413f0ff5e8c4dfbac6b397ed89971d064dc9f/skills/codspeed-optimize/SKILL.md)、[CPU 指标与语言支持](https://codspeed.io/docs/instruments/cpu)、[2026-08-03 v5 计量变更](https://codspeed.io/changelog)；[真实配置：SWC](https://github.com/swc-project/swc/blob/c5ad386b65b9607a53c4626244c66d10bccbccaa/.agents/skills/codspeed-optimize/SKILL.md)、[pixtuoid 原 PR](https://github.com/pixtuoid/pixtuoid/pull/1843)及[固定工作流](https://github.com/pixtuoid/pixtuoid/blob/70b393be9192489a909952a7fcac3511b6cc36b5/.github/workflows/codspeed.yml)；[社区原帖与回复](https://www.reddit.com/r/aigamedev/comments/1vi9fwz/tips_on_getting_your_agent_to_make_your_game/)。定向核实：2026-11-04 UTC；未完成领域广扫。

### 2026-11-04：连续 UI 改版交可运行原型和本轮变化

👀 **已有可运行界面、设计与实现分开维护时，可试把原型、设计规则、角色／状态入口及逐版 changelog 一起交给 Agent。** 指定已确认的原型版本和生产代码基线，列出本轮要改与保留的行为，让 Agent 对应到已有组件、真实路由，再用相同角色、数据和视口核对实现。原型缺失的异常、空、加载状态要先澄清，不能让模型凭截图补意图。若生产组件已能直接评审，沿用该入口；小改动不另建平行原型，精细素材与资产库也不必离开现有设计工具。

**Cisco 的增量是“传本轮变化”，不只是传一张设计图。** 11-02 PubHub 团队复盘：已有端到端 UI，但设计不合要求；HTML 往返 Figma 时丢失部分交互、重建开销大且版本不清，遂直接迭代 HTML，随原型交设计规范、persona 切换与 changelog，再让 Agent 更新实际项目。团队仍保留 Figma 的素材与细节用途。属于内部项目作者自述，不外推为所有 Figma 工作流都慢，也不把可运行原型当生产接线完成。

**指向原型不保证 Agent 真正采用。** Grape Up 10-26 的三个月项目已做浏览器场景检查、截图和人工验收，但从第一周就写入 CLAUDE.md 的原型仓库仍偶有漏用、靠返修补齐；作者计划新增的是**对照原型的视觉检查**，不是已经验证的新机制。本文未提供公开可复跑材料，其耗时数字也明确为估计。本轮未试用：当前没有真实设计改版任务，不为凑验证造新 UI，不增加默认流程。

**依据**：[一手：Cisco 设计交接复盘](https://blogs.cisco.com/cisco-devnet/design-to-code-ai-handoff-workflow)、[独立团队：Grape Up 实践及拟改进项](https://grapeup.com/blog/ai-development-workflow-claude-code)；[实践者与读者反馈：关键状态截图、流程录制及同条件前后对照](https://timdeschryver.dev/blog/let-your-ai-agent-capture-its-changes-with-the-playwright-cli)。最后一项提供评审方式参照，不复制其绕过 CSP／证书校验或身份配置，也不把编辑过等待时间的录像当性能证据。定向核实：2026-11-04 UTC；无同题收益对照，最佳流程未知，未完成领域广扫。

### 2026-11-04：旧规则回放先核任务完成，不自动删提示

👀 **模型或客户端升级后，要清理某条冗余工作提示，可用原失败任务做隔离对照；几次未出错不等于可以删规则。** 固定同一任务、输入与成功验收，只改变待评估提示，并确认两组都完成任务、都经过原失败的触发机会。提前退出、缺少输出和未触发应单列，不能算成功；保留结果供人工判断，不自动删除提示，不借此撤掉安全、权限或保护检查。本仓尚无对应真实回放，现有长期规则不变。

**一手研究给了方法，也给了反例。** 10-23 预印本在一个私人 Markdown 仓库回放五类失败，每条件三次；其中标点场景两组仍有文字禁令，危险命令场景没有走到触发动作，估时场景受宿主日期与旧截止日期干扰而拒绝任务。论文已明确这些限制，不能把“三类未复现”说成三条保护已无用。原仓库及会话不公开，匿名材料需向作者索取；公开 divan 是架构模板，不是原始实验数据。

**本轮只实测公开模板的评分入口，不是模型回放。** 官方 MIT 源码固定 `ada59273`：`judge` 对 exit 124、空答案且被检文件缺失的合成记录返回 `ok`；exit 0 但缺输出也为 `ok`，错误内容阳性对照为 `failed`，明确 focus-guard 且无命令为 `declined`。给 `summary` 两组各 10 条、共 20 条 exit 124 但 verdict=ok 的合成行，它会提出 `RETIRE CANDIDATE`；独立复核仅 10 条 A、没有 B 也可得到该建议。此分支仅针对 kind=rule，lint／hook 保留；建议本身不自动删除文件。**当前汇总不能独立证明任务完成或对照成立**，不直接采用其退役建议，也不以此断言论文原结果错误。没有运行 setup、hooks、完整 runner 或付费模型。

**依据**：[一手：论文方法与有效性限制](https://arxiv.org/html/2610.32578v1)、[作者公开模板评分与汇总](https://github.com/avtak/divan/blob/ada59273da269166eb3854b21db3bf706a76387f/scripts/replay.py)、[模板说明与研究关系](https://github.com/avtak/divan/blob/ada59273da269166eb3854b21db3bf706a76387f/README.md)。定向核实及评分函数合成试验：2026-11-04 UTC；未找到独立使用者的回放效果评价，未完成领域广扫。只补充既有验收方法的研究参照，不新增工具测试系列或通用默认。

### 2026-11-04：用复制边界检查 Agent 绕过模块接口

🧪 **已经明确实现归属、担心 Agent 复制函数绕开接口时，试 jscpd 5.4.2 的 boundaries；不把全仓重复率变成重构目标。** 导入检查看不到没有 import 的副本，这类规则可指定受保护代码、禁止出现的目标层及明确允许的副本。尚不清楚归属时，先看普通重复报告、读命中两侧，再决定是否共享实现。可复制模板、独立夹具与刻意隔离的代码应保留合理重复。

**有界试用起点。** 在隔离环境从官方 PyPI 安装 `jscpd==5.4.2`（MIT），配置的 `boundaries` 项可从 `{"name":"combat","code":["core"],"notIn":["ui/**"],"disable":["semantic"]}` 改起；从配置所在目录运行 `jscpd --config config.json --no-colors .`，覆盖源和目标。只有明确许可的副本才加入 `allow`。禁用 semantic 后本例不需嵌入模型或远程 API，其他结构比较仍可运行；不等于只查完全相同文本。未安装 Skill 或 MCP，不改本仓默认门禁。

**正式包的 7 个合成场景符合预期，包括成功复现的反例：** 普通报告发现 2 clones、exit 0；禁止 UI 副本得到 1 violation、exit 1；精确 allow 该副本且保留其他目标文件，0 violation、无边界空集警告、exit 0；allow 排空目标、受保护路径不存在、只扫描 core 漏掉 UI，这三项均 exit 0 但警告未覆盖；`notIn: []` 为配置错误、exit 1。夹具是无 import 的 11 行相同函数，显式设 5 行／30 token 只为这个小例，不是推荐阈值；未测改名、语义改写、真实游戏接线或模型编码收益。

**不能只用 exit code 判覆盖完成。** 本轮断言只识别实际见到的 `protects no code of this scan` 和 `keeps copies out of no file of this scan` 两段警告，不是通用 warning 检测器；其他警告、升级后的措辞与扫描范围仍要核对。只读扫描本仓 `49352d7c` 的 generic／Unity／Unreal 三份 `protect-paths.sh` 得到 2 clones、66.7% 重复，但它们需独立复制到项目，未强制抽象。命中只提供位置，不证明行为等价；改代码仍须行为测试。

**外部取舍。** dsh-watcher 把导入 boundaries 与 jscpd duplicates 分开运行，未证明其采用了本次复制边界功能；HN 使用者自报把质量报告交给模型判断、允许保留合理重复；REA 维护者实际停止按指标继续拆分，以免制造跨层抽象。没有跨检测器同题对照，最佳工具未知，当前只收有界试用候选。

**依据**：[官方 5.4.2 发布](https://github.com/kucherenko/jscpd/releases/tag/v5.4.2)、[固定边界实现](https://github.com/kucherenko/jscpd/blob/db415b5d7cc34d72a324fe5eae2147646dc3558b/rust/crates/cpd/src/boundaries/check.rs)、[配置说明](https://github.com/kucherenko/jscpd/blob/db415b5d7cc34d72a324fe5eae2147646dc3558b/docs/rust.md#boundaries)、[官方重构 Skill](https://github.com/kucherenko/jscpd/blob/db415b5d7cc34d72a324fe5eae2147646dc3558b/skills/dry-refactoring/SKILL.md)；[真实项目配置](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/package.json)、[HN 原帖与回复](https://news.ycombinator.com/item?id=49742634)、[REA 维护者取舍](https://github.com/morluto/rea/issues/151)。本轮源码检出 HEAD 为 `cbd5423`，已核相关实现与上述 tag `db415b5` 无差异，不声称整个 checkout 固定在 tag。定向核实与实跑：2026-11-04 UTC，未完成领域广扫。

### 2026-11-04：常驻 Agent 的冷唤醒，试验从当前文件重建上下文

👀 **自建常驻 Claude Code Agent、经常隔数小时接着工作时，试验在缓存失效后的唤醒边界重建上下文。** Raft 不再把整段历史一直接回：首轮放记忆索引、近期消息、当前文件、最近动作和本次唤醒消息。值得借的是**重新读当前文件，旧文件只留指针；过去的失败不自动成为本次待办**。仍在连续编码、缓存可能未失效或后台工作未结束时，继续原生恢复，不按固定时钟重开。

**先试一条真实续接，再决定是否采用。** 留下当前任务、最新约束、已完成结果与下一步；在自然空闲后比较原生恢复和重建输入，核第一次行动是否接住新消息、是否重复已成功动作、是否把旧状态当现状，并记录总用量与等待时间。状态读不到就恢复原会话。本文是[上下文管理](../decisions/context-management.md)候选，不改现有默认；最佳阈值和本仓真实任务收益未知。

**版本和配置会改变能否生效。** 固定源码 `db5e399f`（release `v1.21.23-source.1`，daemon 1.0.49）要求服务端 `constructedWakeContext=true`；仅设 `RAFT_WAKE_RECYCLE=1` 无效。默认条件是空闲**超过**一小时且上下文**大于** 128K；它来自作者负载，不是通用推荐。runtime 列表虽有 Codex，事实读取只实现 Claude，其他 runtime 仍因未知状态而恢复旧会话。源码还核后台任务及 sidecar 活跃情况。Raft 是 **FSL-1.1-ALv2 source-available**，含竞争用途限制，不把源码当当前 Apache 代码复制进通用模板。

本轮逐字提取固定源码的配置／纯决策函数，**9 个边界断言通过**，包括精确阈值、未知状态、显式恢复、profile 变化及开关优先级；输入渲染为替身，未运行完整 daemon、后台停止或真实模型。作者报告全流量每请求成本下降 29%，属于其团队按标价的前后对照，不是本仓实测；社区原帖反映 Raft 的 Hermes 适配需求，未验证这套重建方法的效果。

**依据**：[一手：作者方法与对照](https://raft.build/resources/blog/constructed-initial-context/)、[固定配置与决策](https://github.com/botiverse/raft-source/blob/db5e399f017d584e49597e3a28757645d6807893/packages/daemon/src/wakeSessionRecycle.ts#L95-L253)、[后台工作筛选](https://github.com/botiverse/raft-source/blob/db5e399f017d584e49597e3a28757645d6807893/packages/daemon/src/wakeSessionRecycle.ts#L359-L406)、[文件与近期动作策略](https://github.com/botiverse/raft-source/blob/db5e399f017d584e49597e3a28757645d6807893/packages/daemon/src/wakeBriefingPanel.ts#L24-L53)、[许可](https://github.com/botiverse/raft-source/blob/db5e399f017d584e49597e3a28757645d6807893/LICENSE)；[社区：真实使用者及回复](https://linux.do/t/topic/2974021)。定向核实与组件试验：2026-11-04 UTC；未完成领域广扫，未找到独立同题效果验证。

**压缩结果也要核实际工具类型。** 同轮直接运行 Python Agent Framework 1.24.0 发布包与固定 main `230a3aa0`：合成 hosted shell 的 stdout／stderr／exit code 在旧组压缩后变成 `no results`，普通 function result 对照仍保留。`keep_last_tool_call_groups=1` 只保护最新组，不是修复。已用该 SDK 的读者，应检查实际 content type 的压缩后结果和下一次请求，不凭函数正常返回判定信息保留。候选修复 #9887 已关闭且未合并，这不排除其他修复；本轮没有验证修复版本，也未跑模型或完整套件。不为此迁移整个框架。

**反例依据**：[真实报告 #9886](https://github.com/microsoft/agent-framework/issues/9886)、[候选修复 #9887](https://github.com/microsoft/agent-framework/pull/9887)、[本轮实际运行的固定源码](https://github.com/microsoft/agent-framework/blob/230a3aa0bba19b6bf5a7b4f427bcb25cb16c7105/python/packages/core/agent_framework/_compaction.py#L1904-L2040)。两个来源各 3 个合成场景断言通过；PR 状态按最新 API 复核，核实：2026-11-04 UTC。

### 2026-10-31：AGENT-CONFIG 已回线索的核源与取舍

先看两个真实项目的维护机制：**Zeppelin 按完整指令链减重，Next.js 将生成内容与团队正文分开管理**。本轮只核已返回目录中的少量线索，未把全目录接收为已核成果；SKILL-MCP、MULTIAGENT-LONG、VERIFY-REVIEW 尚无正式回传、可接收的来源产物，下面的四领域补充仍等各卡结果回来后去重合并，不重开采集。

- **累计预算看整链，不看每份文件是否合格。** Zeppelin 已把架构、通信与 E2E 详情移到 `.agents/` 引用页，加载入口留下必要规则与按需阅读指向；本轮按固定源码复算最长根→E2E 链为 **29,026 UTF-8 bytes**（文件内容之和，未计加载器分隔符）。这是本仓已有 32 KiB 说明的实际采用样本，不是新的预算发现；可供长指令仓库试用，尚未运行 Codex 验证遵守效果。依据：[已合入 PR #5531](https://github.com/apache/zeppelin/pull/5531)、[固定改动 a46011e9](https://github.com/apache/zeppelin/commit/a46011e93e41d899a180644ee01fd226d3fc71bf)，合入 2026-10-05，核实 2026-10-31。
- **生成器只拥有托管块，团队保留块外正文。** Next.js 已将自动维护入口统一到 AGENTS.md；固定生成器只替换标记块，保留前后正文，没有标记时追加。这比人工同步两份说明更值得借鉴，但项目删除 CLAUDE 兼容入口的决定不能替其他环境证明加载已生效；本仓仍沿用[共享指令页](../decisions/instruction-files.md)的实读确认。依据：[已合入 PR #99043](https://github.com/vercel/next.js/pull/99043)、[固定生成器 L252–292](https://github.com/vercel/next.js/blob/43f54d52f8092499d2e9b57e93651129cce5f0d3/packages/next/src/server/lib/generate-agent-files.ts#L252-L292)，合入 2026-09-22，核实 2026-10-31；本轮未运行生成器。
- **Claude 的旧 Bash-first 报告要按版本和命令形态读。** 官方 changelog 已记录 2.1.288 的 Edit/Write 加载修复及 2.1.293 的单文件 Bash 读取修复，不能沿用“只有 Read 能加载”。#90450 后续仍有复杂 Bash 的缺口自报；#92271 是报告者自行关闭，不是厂商修复证明。规则加载与匹配工具名的 Hook 是不同机制，加载修复不能证明 Hook 已覆盖所有文件操作。依据：[固定 CHANGELOG](https://github.com/anthropics/claude-code/blob/d4dfed4e1c578cfea8bd6e64873e4f5e5b7e36f0/CHANGELOG.md)、[原报告及后续 #90450](https://github.com/anthropics/claude-code/issues/90450)、[#92271](https://github.com/anthropics/claude-code/issues/92271)，核实 2026-10-31；未独立复现复杂命令。
- **Skill 的参考文件也可能被客户端当全局规则加载。** Cursor 官方支持人员确认，Skill 目录中的 AGENTS.md 会自动应用，符号链接还会重复带入；建议将仅供 Skill 引用的文件改为 REFERENCE.md 并同步 SKILL.md。另一建议 `.cursorignore` 可能同时阻碍 Skill 读取，不宜盲用。公开报告环境是 Cursor 3.27.14／macOS，尚无本轮独立复现或已发版修复证据。依据：[原帖](https://forum.cursor.com/t/176473)、[10-28 官方回复](https://forum.cursor.com/t/176473/8)，核实 2026-10-31。
- **两种静态检查只适合补盲点，不能替实际加载和命令试跑。** `agents-md-lint` v0.1.0 已[实际检查本仓根指令](../../experiments/instruction-file-lint/README.md)：26 个引用、4 条均为示例误报，缺输入仍可能 exit 0，暂缓默认 CI；它只核路径和首个可执行程序，不执行命令或验证参数。`dropped` 固定版逐文件对照静态字节上限，不重建 Codex 的根→cwd 累计链，也不读取项目预算配置。后者全部通过仍可能漏掉上面的整链超限。`dropped` 仍未试用，不加入默认门禁。依据：[agents-md-lint 固定检查实现](https://github.com/openintelligence-labs/agents-md-lint/blob/9f852cf5b970cd9f283a61ef4ae6308cb4aeb047/src/agents_md_lint/check.py#L130-L155)、[命令提取](https://github.com/openintelligence-labs/agents-md-lint/blob/9f852cf5b970cd9f283a61ef4ae6308cb4aeb047/src/agents_md_lint/refs.py#L132-L174)、[dropped 逐文件循环](https://github.com/phrypy/dropped/blob/06536a1ee332f14073df87fdd0a628a61c6ebf5c/main.go#L73-L117)、[静态限额](https://github.com/phrypy/dropped/blob/06536a1ee332f14073df87fdd0a628a61c6ebf5c/limits.toml#L12-L20)，核实 2026-10-31。

### 2026-10-30：四领域云端来源补充（供自然续接与接收时参考）

这份材料不改四张广扫卡的状态、范围或已启动输入，也不另派任务。仅后续 fetch 并实际读取时可见；当前调用是否已读，须由结果引用或回执确认。未被本机自然续接采用的，云端接收结果时补核，不为读材料重跑整轮。两张已取消旧卡的未覆盖来源仍[待纳入 MULTIAGENT-LONG](local-jobs/A-PARALLEL-REVIEW-SOURCES-20261028.md)，其 [OpenCode 恢复调查](local-jobs/A-RESUME-CONTRACT-SOURCES-20261028.md)同样保留待办，本节不替代任务规格更新。

- **AGENT-CONFIG｜历史反例，不计近期发现**：[2026-03-03 HN 评论](https://news.ycombinator.com/item?id=47230336)自报 deny list 曾被绕过、未跟踪目录被删除；加“不要绕过”提示后暂未再遇到。缺故障轨迹、版本与受控比较，只作核对权限约束究竟在哪层执行的线索，不据此推荐提示词可替代执行层限制。
- **SKILL-MCP｜已有基线，不重复入候选**：[V2EX 2026-07-14 首帖](https://www.v2ex.com/t/1227194)的[第 7 楼](https://www.v2ex.com/t/1227194#r_17864294)自报小任务流程成本过高，[第 28 楼](https://www.v2ex.com/t/1227194#r_17865748)质疑归因；[第 18 楼](https://www.v2ex.com/t/1227194#r_17864982)和[第 22 楼](https://www.v2ex.com/t/1227194#r_17865165)主张先明确大功能边界。沿用[已有按需流程判断](../research/2026-10-22-frontier-trials.md#代表机制的采用证据与边界)，不把跨任务、模型与流程的自报耗时写成插件胜负。
- **MULTIAGENT-LONG｜历史取舍＋未试用候选**：[2026-03-02 使用者](https://news.ycombinator.com/item?id=47222472)因集成漂移、冲突和审查负担退回以单 Agent 为主；[原作者回复](https://news.ycombinator.com/item?id=47222888)承认代价但仍选择并行，双方都是自报。近期另有 [Foremerge 09-21 作者实践](https://news.ycombinator.com/item?id=49789356)：编辑前声明意图与操作范围，提前暴露冲突；[09-22 限制说明](https://news.ycombinator.com/item?id=49795854)须与下述固定源码一起读，不作最新版结论。
- **VERIFY-REVIEW｜已有事故自报＋历史意见**：[linux.do 2026-07-10 首帖](https://linux.do/t/topic/2560865/1)称调用 Playwright CLI 后角色仍不能移动，已在 [13](../13-frontier-radar.md)用作“工具调用后仍须验实际行为”的反例；没有公开补丁，不计新增运行验证。[HN 2025-03-20 评论](https://news.ycombinator.com/item?id=43422232)担忧修复循环删断言或改测试输入，是观点而非已发生事故，也不计近期发现。

**Foremerge 候选的准确边界**：固定 `553d252d`（源码包版本 0.6.0）已记录真实 base→candidate 的二进制 diff 哈希，并在接收时核干净工作树、受验指纹、HEAD 与依赖祖先；不能再笼统写“不读实际 diff”。这些检查固定的是受验版本；最终代码是否兑现原意图，仍要对照实际 diff、项目检查和消费者结果。符号提示只作轻量线索，意图声明仍可能漏项；已有最终 diff／消费者验收要保留。CLI 有显式 `work watch` 轮询事件，不等于向已运行的 Agent 主动注入通知。

**怎么取舍｜🧪 0.6.0 仅试用落地内容核对，默认仍用 worktree＋明确写域。** 对已有受验候选、实际发布生成了非后代新提交的任务，可试用 0.6.0 记录落地；0.5.1 不适用于本例。编辑前的意图声明与冲突暴露仍是未试用候选，不替换本仓接收端，也不能解决当前调用是否读到补充材料的问题。

**实际接收结果**：Linux 上用本仓刚交付的两文件重放 CLI，受验候选与连接器实际落地提交同树、同父但互不为祖先。0.5.1 对实际落地返回 `TARGET_DIVERGED`；0.6.0 按内容核为 `COMMITTED`，`integration.method=content`、核 2 个路径。部分落地只保留 README 时，0.6.0 明确报告缺 `results.json`；0.5.1 也拒绝，但只因非祖先，不代表它检查了缺文件。首次驱动漏 claim／start 导致的 `INVALID_TRANSITION` 及修正经过保留在输入中。新读者接回这份已完成试验，未重跑有效实验，判断不足以改变现有协调默认。

Foremerge 核对的是调用方给定提交包含已接受内容，**不验证目标分支或远端状态**；发布后仍独立回读。本例云端原记录已回读 main 和两文件，读者本地只另核内容、blob 与祖先一致。回放不是实际 GitHub squash／rebase 操作，只覆盖单写者、两文件与 `check_repo` 命名检查；并发协调、消费者行为、其他 OS 与 hosted CI 均未验证，不据此宣称协作收益。

**试验依据**：[issue #38](https://github.com/naw103/foremerge/issues/38)、[修复 #51](https://github.com/naw103/foremerge/pull/51)、[0.6.0 固定落地契约](https://github.com/naw103/foremerge/blob/364319f968ccb3ee56ce316331ba0f5945655913/docs/git-integration.md)、[真实输入与结果](local-jobs/artifacts/A-LONG-ROUTE-FOREMERGE-READER-20261101/result.md)、[实际落地](https://github.com/dbvv1/a1dbv/commit/c735c8ed27334f2d4cc9218fece214fa8f83c41b)，试验与接收 2026-11-01。

**依据与核读范围**：[固定 Git 差异记录](https://github.com/naw103/foremerge/blob/553d252d113b773ae31433818b0db987cc9385b4/docs/git-integration.md#L97-L145)、[接收时的版本核对](https://github.com/naw103/foremerge/blob/553d252d113b773ae31433818b0db987cc9385b4/src/service.rs#L2184-L2224)、[事件轮询实现](https://github.com/naw103/foremerge/blob/553d252d113b773ae31433818b0db987cc9385b4/src/cli.rs#L1318-L1334)。本轮以云端 curl 读取 HN Algolia 原始条目、V2EX 正文／四条回复和 linux.do 首帖 JSON，并核 Foremerge 官方源码；核实 2026-10-30。X 前次 curl 只有 JS 壳，无正文，本轮未重试；Reddit 已知访问拦截未重试，保留原帖缺口。


- 👀 **Node `pg` 连接池或约束迁移先查原生文档，Supabase Postgres Skill 按条核对后再试**：固定 `c9be0e93` 的[连接池配方](https://github.com/supabase/agent-skills/blob/c9be0e931b7930f7d02126d04774d904c381e7d7/skills/supabase-postgres-best-practices/references/conn-prepared-statements.md#L42)仍建议不存在的 `{ prepare: false }`，而 [pg 源码](https://github.com/brianc/node-postgres/blob/2a5850fb0db18f5e40a642bbb4a4743de412ab54/packages/pg/lib/query.js#L8-L55)／[官方用法](https://node-postgres.com/features/queries#prepared-statements)以 query `name` 启用命名缓存；[约束配方](https://github.com/supabase/agent-skills/blob/c9be0e931b7930f7d02126d04774d904c381e7d7/skills/supabase-postgres-best-practices/references/schema-constraints.md#L38-L63)后两个存在性检查未限定表，可能因别表同名约束而漏建（[Postgres 目录说明](https://www.postgresql.org/docs/current/catalog-pg-constraint.html)）。[实际采用者 #83](https://github.com/supabase/agent-skills/issues/83)亦报这两项，本仓已核当前源码；11-05 用 [PGlite 真实 SQL 消费者](../../experiments/constraint-scope-consumer/README.md)补验约束配方：别表同名时原 CHECK／外键迁移成功却漏约束，非法数据可插入；限定目标表后分别以 23514／23503 拒绝，重复迁移仍只有一项约束。8 组缺陷与对照断言通过，不等于原配方安全。使用 WASM PostgreSQL，原生服务、Supabase 托管与并发迁移未验；未安装整个 Skill，其余规则未作全面评价（资料核实 2026-10-28；约束实测 2026-11-05）。 **同日补[pg 驱动真实消费者](../../experiments/pg-prepare-consumer/README.md)**：pg 8.23.1＋PGlite 0.5.15 四组对照中，Client／query 均设 `prepare:false` 仍保留命名语句；移除 query 的 `name` 后无命名缓存，但两次参数查询仍各有未命名 Parse。保留 `$1`／`values`，不要改拼接 SQL。独立复跑结果一致；官方适配器模拟握手，SQL 由 WASM PostgreSQL 执行，未验真实网络、认证或 PgBouncer／Supavisor，不据此泛称池化兼容。

- 👀 **Ruff：让实际命令体现环境前提**——[维护者反馈](https://github.com/astral-sh/ruff/pull/29190)旁注未阻止 Codex 先跑不适用的监听测试，遂[把过滤写进命令](https://github.com/astral-sh/ruff/commit/7c6f8fc8fc5655dfa47e125b05453007b9e7a6c7)；仅不提供所需 OS 事件的环境适用，涉及监听行为的改动须在支持环境另验。本仓只在独立真实发布中预选既有授权的连接器入口以避开已知 CLI 缺写认证（不适用于权限拒绝）；路径依据执行回执而非 Git 提交，Ruff 命令未试用，未作同题对照，作为[共享指令](../decisions/instruction-files.md)候选（核实 2026-10-28）。

- 👀 2026-10-28 核读：[Max Nardit 的 AGENTS 提示实验](https://max.nardit.com/articles/agents-md-viral-lines-tested)（10-25，Claude Code 2.1.310／Opus 5.5、Sonnet 5.5；两个小任务、90 次运行，每个条件单元 5 次），作者观察到删辅助文案连带删掉输入检查。race／security 防护“先解释再等批准”的提示未被有效检验：任务本已注明单线程、各组很少加锁，且 print 模式无人回应审批；本仓未试用，仅作 Codex 过度工程的来源候选，不新增默认。

<a id="cline-image-token-estimate"></a>
### 2026-10-28：Cline 读图后过早压缩，先分清内部估算与服务端用量

🧪 **Cline 读过截图或 PDF 页面图后提前压缩，先核客户端版本，再按同一次请求对照内部估算与服务端 usage。** 旧版把图片 base64 按文本的 3 字符／token 计入估算；#14520 已修复，并进入 **4.1.24 发布源码**。遇相符症状，优先使用含修复的版本，不凭压缩提示认定窗口耗尽，也不先关闭自动压缩。

修复在正常序列化路径让请求与消息两处估算排除图片 payload，另加 **1600 token／图的内部定额**；这不是服务端计费上限或所有视觉模型的真实成本。#14512 使用者在 4.1.20 报告的 `288.3k` 压缩前估算，与当时在途请求的 `12,397` 服务端计数没有同请求配对证据，不能直接相除当作实测误差倍数。

**离线试验已验证这处估算修复。** 本仓直接导入 v4.1.20／v4.1.24 未改动的固定源码，给两版相同文本与合成 PNG：192×128、73,944 bytes 的单图请求估算为 **32,926 → 1,662**；纯文本 **45 → 45**；九张同图 **295,974 → 14,598**。三种图片大小、两种图片字段形状的对照支持正常路径不再随 base64 长度增长；定额也会让 16×16 小图的请求估算由 440 升至 1,662。人为加入 BigInt 触发请求序列化 fallback 时，单张中图仍为 **32,931 → 32,931**，该分支继续计入 base64；这不说明它在真实会话中的发生频率。

**图片修复不等于文本估算已校准，扩展与 CLI 也要分开。** #14979 的 1.2–1.5 倍高估来自带图片补丁的自编译 VS Code 扩展 4.1.21，不是 stock 4.1.24 复测；维护者确认字符估算与只向上修正的机制仍会提前触发。作者 10-28 补回 CLI 3.0.73 的两条记录，`requestInputTokens / apiInputTokens` 分别约 **1.08／1.04**；这是不同会话的用户自报，不是同负载客户端胜负比较。自然复现时核客户端、同请求口径和缓存字段，别把扩展的误差倍数套到 CLI 调预算。本条仍为[上下文管理](../decisions/context-management.md)候选。

**依据与范围**：[使用者原始报告 #14512](https://github.com/cline/cline/issues/14512)、[已合入 #14520](https://github.com/cline/cline/pull/14520)、[4.1.24 官方发布说明](https://github.com/cline/cline/releases/tag/v4.1.24)、[4.1.20 基线请求估算](https://github.com/cline/cline/blob/254f40c4b592d1e662b84f2ba06fe45dca77cab3/sdk/packages/shared/src/llms/tokens.ts)、4.1.24 的[请求估算](https://github.com/cline/cline/blob/ed469c753a0d7a0d41f906cf3fc75a983cd766ac/sdk/packages/shared/src/llms/tokens.ts)与[消息估算](https://github.com/cline/cline/blob/ed469c753a0d7a0d41f906cf3fc75a983cd766ac/sdk/packages/core/src/extensions/context/compaction-shared.ts#L198-L231)、[后续 #14979](https://github.com/cline/cline/issues/14979)及[维护者说明](https://github.com/cline/cline/issues/14979#issuecomment-6124810061)。4.1.24 原版 `tokens.test.ts` 离线 6／6 通过；逐字提取的 `createTokenEstimator` 测试块，基线 2／2、修复版 4／4 通过；非作者独立复跑并核对上游源码一致。未运行完整套件、客户端或端到端压缩，未调用模型，结果仅为内部估算而非计费、性能或真实用量。核实与离线试验：2026-10-28 UTC；2026-10-31 补核[原使用者的 CLI 回执](https://github.com/cline/cline/issues/14979#issuecomment-6473972321)，未重跑客户端或模型。

<a id="vscode-terminal-main-memory"></a>
### 2026-10-28：VS Code 多 Agent 终端越跑越占内存，先查主进程与修复版本

👀 **多个编码 Agent 的 TUI 长时间刷新、VS Code 整体崩溃时，先核增长的是主进程（main／browser）还是 Agent 进程，再查实际版本。** 终端输出被主进程缓存的已知泄漏由 #323980 修复，已进入 **1.138.0 稳定版（2026-09-16）**；旧版遇相符症状，优先升级到含修复的版本。衍生编辑器另核是否纳入补丁，不能套用 VS Code 的版本结论。

使用者在 macOS arm64、1.136.1 的多个 tmux／Claude Code 终端中报告：`terminal.integrated.scrollback: 1`、关闭 shell integration 后仍持续增长。其堆快照把终端输出追到 `LocalPty` 中无人消费的 `Event.buffer`；**缩小滚动缓冲不等于限制这层内存**。作者随后撤回了增大 `--max-old-space-size` 的缓解建议；最终合入补丁只取消未消费的进程事件缓冲，保留宿主生命周期事件缓冲。

这是[17 排障](../17-troubleshooting.md#28-在同一个错误上打转)的候选案例：按进程和版本定位，不把编辑器 OOM 当成模型上下文问题。仅凭内存上涨或全部窗口退出仍不能确诊；自然复现时保留相同输出负载，对照主进程增长与堆中保留链。本仓未运行 VS Code、未试用，当前客户端是否受影响未知。

**依据与范围**：[使用者原始报告 #334837](https://github.com/microsoft/vscode/issues/334837)、[作者撤回堆参数建议](https://github.com/microsoft/vscode/issues/334837#issuecomment-5620838511)、[已合入 #323980 的最终改法](https://github.com/microsoft/vscode/pull/323980#issuecomment-5668798568)、[官方 1.138 发布说明](https://code.visualstudio.com/updates/v1_138)。仅核公开讨论、最终补丁与官方发布记录；核实：2026-10-28 UTC。

<a id="goose-litellm-vision-payload"></a>
### 2026-10-28：LiteLLM 别名丢图，先验实际请求与配置优先级

🧪 **Goose 经 LiteLLM 代理别名看不到图片时，先核安装版本是否含官方修复；仍失败再让 Agent 读实际 completion HTTP payload，追 vision 配置进入 formatter 的路径。** `/model/info` 返回 `supports_vision: true` 不代表图片已经发出：同时检查直接附图和工具返回图片、首次与缓存后的请求。修补应保留传入配置的 `true`／`false`（包括 canonical 已填入的值），只在未定时按精确别名读取布尔元数据，并在格式化前补入；不能只补字段解析。

本仓在 Goose 1.57.0 固定源码上用真实回环 HTTP／Wiremock 调用原 provider：**基线 9 项中，JSON／SSE 别名两项失败、7 项对照通过**，这两项的首次和缓存后请求均丢了直接图和工具图。本地候选扩展到 **18 项全部通过**（含串行复跑），覆盖显式优先级、关闭 prompt cache、错误元数据与无关别名；非作者源码审查未发现必改项。这是本地排障试验，尚未接真实 LiteLLM 代理／模型，不作为性能比较、工具推荐或读者照做通过记录。

**判断 payload 证据，先核断言读的是当次请求还是录制旧值。** 本次 Wiremock 的 `received_requests()` 读取本轮实际 HTTP body。Pydantic AI #8023 的作者变异检查报告：只断言 cassette 请求、又不匹配 body 时，payload 改坏仍可绿；其 #7653 用 `request_capture` 断言当前 body，录制响应另核历史 HTTP 200。

**当前处理：停止旧实现投稿，保留历史回归。** 另一作者的 [#13239](https://github.com/aaif-goose/goose/pull/13239) 已于 10-30 合入 `f131ff7e`，并关闭 #13158。固定主干 `090dedb7` 已在格式化前补未指定的 vision、保留显式布尔值并精确匹配别名，覆盖旧候选的核心生产语义；实现抽取了共用查询 helper，不是同一份补丁。**已接收11-01在固定上游 `b23d21ca` 的真实补验**：[原18项 HTTP 控制及上游7项 provider 单测](../../experiments/candidate-reset-recovery/README.md#goose-旧候选已被上游替代)全部通过，仅移植旧测试，未叠加旧 provider 补丁；[逐项运行回执](../../experiments/candidate-reset-recovery/goose/upstream-results.json)记录36个当次 completion body。覆盖两图、JSON／SSE、首次／即时缓存后及显式优先级，不覆盖逐消息图片身份、最终流文本、缓存并发或完整工作区；此处接收既有回执，不是11-05重新执行。

**主干合入与用户装到的版本分开看。** 截至11-05再次核官方 latest，最新正式版仍为 **v1.57.0**，其 provider 文件与旧基线字节相同，尚不含该修复。使用时核安装版本对应源码是否包含 `f131ff7e`，不要因 issue 已关闭就认定当前安装已修好。未定 vision 的首次请求仍可能等待元数据发现；源码沿用 5 秒发现超时、60 秒失败缓存，真实代理／模型及超时／并发效果未另验。

本次状态与源码核对：[#13239 合并记录](https://github.com/aaif-goose/goose/pull/13239)、[固定主干 provider](https://github.com/aaif-goose/goose/blob/090dedb7625c8aadb9bb05d68028fd00f36b429e/crates/goose/src/providers/litellm.rs)、[正式版](https://github.com/aaif-goose/goose/releases/tag/v1.57.0)与 [v1.57.0 provider](https://github.com/aaif-goose/goose/blob/v1.57.0/crates/goose/src/providers/litellm.rs)；2026-10-30。

**依据与范围**：[使用者原始问题 #13158](https://github.com/aaif-goose/goose/issues/13158)、固定基线的[元数据解析](https://github.com/aaif-goose/goose/blob/8a16788137c8af25f9d6d17ee87bbedb53ea9325/crates/goose/src/providers/litellm.rs#L164-L179)、[先格式化后查缓存能力](https://github.com/aaif-goose/goose/blob/8a16788137c8af25f9d6d17ee87bbedb53ea9325/crates/goose/src/providers/litellm.rs#L300-L321)、[formatter 缺省行为](https://github.com/aaif-goose/goose/blob/8a16788137c8af25f9d6d17ee87bbedb53ea9325/crates/goose-provider-types/src/formats/openai.rs#L1714)、[发现缓存与超时](https://github.com/aaif-goose/goose/blob/8a16788137c8af25f9d6d17ee87bbedb53ea9325/crates/goose/src/providers/litellm.rs#L32-L33)及[贡献门槛](https://github.com/aaif-goose/goose/blob/8a16788137c8af25f9d6d17ee87bbedb53ea9325/AGENTS.md#L5-L17)。对照：[Pydantic AI 固定测试指引](https://github.com/pydantic/pydantic-ai/blob/9019ebd7971452630f0b4dd882ab006a32d18b67/tests/AGENTS.md)、[#8023 作者报告](https://github.com/pydantic/pydantic-ai/issues/8023)、[#7653 修正说明与补丁](https://github.com/pydantic/pydantic-ai/pull/7653#discussion_r3836929679)；Pydantic 部分已于11-05补做[原生 fixture 三臂实测](../../experiments/pydantic-request-capture/README.md)：固定修复2项通过，仅还原旧 provider 后2项失败（另有 snapshot teardown 错误），改为读取历史录制请求后2项假绿。回放使用历史响应，不调用真实服务；不证明当前服务支持参数或模型效果。原 issue、固定源码、本地 HTTP 记录与非作者审查：2026-10-28 UTC；Goose补验回执：11-01；本段接收与正式版核查：11-05。✅ 已入 [13 候选表](../13-frontier-radar.md#值得一试近4周的新项目与做法)。

<a id="flutter-native-rule-loading"></a>
### 2026-10-27：Flutter 热重载没触发，先核指令有没有加载

👀 **Flutter 改完代码、运行中的应用却没更新时，先核当前客户端实际加载的项目规则与 Dart MCP instructions，再考虑增加长 Skill。** 沿客户端支持的原生指令入口确认加载，在下一次真实 `lib/**/*.dart` 修改中观察 DTD 发现、MCP 调用与应用更新；已有入口能完成就沿用，不凭规则文件存在判定已生效。

维护者 8-3 报告在 Antigravity 尝试 Skill、server description／instructions 与 `GEMINI.md`，只有后者自动起效；明确要求读取 server instructions 后也成功。8-19 使用者复测 Antigravity／Cursor，报告已恢复正常；8-21 维护者认为可能来自更新的工具名称／描述，也可能来自已有插件规则，未隔离原因。issue 于 10-8 关闭；9-2 才合入的 #228 不能作为 8-19 改善的因果证据。

**只在适用的 Flutter 项目参考热重载规则。** 固定版本限定 `lib/` 下 Dart 改动，跳过测试目录及纯注释／空白变化；UI／`build` 方法等走 reload，涉及 `initState`、全局／静态状态、`main()` 等需重新初始化时再选 restart，不因改了 stateful widget 就一律重启。实际调用读当前 MCP schema，不照搬旧帖参数。本仓未安装、未试用；这是[已有加载排障](../03-context-engineering.md#21-各工具的加载规则一手)的真实案例补充，不新增通用默认或 Skill。

**依据与范围**：[维护者尝试](https://github.com/dart-lang/ai/issues/498#issuecomment-5168550633)、[显式加载后的结果](https://github.com/dart-lang/ai/issues/498#issuecomment-5168595577)、[使用者 8-19 复测](https://github.com/dart-lang/ai/issues/498#issuecomment-5347423544)、[维护者 8-21 归因保留](https://github.com/dart-lang/ai/issues/498#issuecomment-5374304451)、[issue 关闭状态](https://github.com/dart-lang/ai/issues/498)；[已合入 #228](https://github.com/flutter/agent-plugins/pull/228)与[固定规则](https://github.com/flutter/agent-plugins/blob/90fa51dc9d1bd6694cee226397e08ec8193e9e69/rules/flutter-hot-reload.md)。仅核公开讨论、PR 与源码，未验证当前客户端行为；核实：2026-10-27 UTC。✅ 已入 [13 候选表](../13-frontier-radar.md#值得一试近4周的新项目与做法)。

<a id="stryker-vitest5-test-selection"></a>
### 2026-10-27：mutation 分数骤降，先核 runner 是否真的执行测试

🧪 **已有 Stryker、升级到 Vitest 5 后分数骤降时，先让 Agent 查逐项状态、`testsCompleted` 和诊断，再决定补断言。** 若旧 runner 10.0.0 把有覆盖的变异报为 `Survived`，却完成零测试，优先核测试名过滤：旧版用空格连接名称，Vitest 5 用 ` > `。保留原覆盖率与 mutation 阈值，将已用的 Stryker core／Vitest runner／TypeScript checker 一起升级到含修复的 10.1.1，Vitest 与覆盖率包保持配套，再跑同范围验证。

真实采用者 openclaw-atif 的 #35 于 10-24 合入。**作者报告**早先 Vitest 5.0.5＋Stryker 10.0.0 的 354 项普通测试通过，但十个 survivor 执行零测试；升级后的 CI 报告为 **11 killed＋17 errors**，不是 28 killed。#6210 还含静态变异误归类和 DEBUG 配置序列化故障的反馈，不能把所有异常都归因于名称分隔符。

**10-30 已补[真实项目重放与 errors 分类](../../experiments/stryker-report-triage.md)。** 固定当前源码的 358 项普通测试通过；原 mutation 范围得到 11 Killed、17 CompileError，后者均用原 TypeScript 编译器单独重现，分母是 11 而非 28。无需为这 17 项关 checker 或硬补断言；`testsCompleted` 缺失不能当零测试 survivor，静态变异 `coveredBy` 为空也可能已执行并被杀。新文给出原命令＋JSON 查看入口，未复跑旧错误组合。

**依据与范围**：[真实采用 PR #35](https://github.com/openclaw/openclaw-atif/pull/35)；[上游 #6214](https://github.com/stryker-mutator/stryker-js/pull/6214)于 10-23 合入，补丁让覆盖键与测试 ID 共用分隔符；[10.1.0 发布说明](https://github.com/stryker-mutator/stryker-js/releases/tag/v10.1.0)列出该修复，[10.1.1](https://github.com/stryker-mutator/stryker-js/releases/tag/v10.1.1)因发布 provenance 问题重发；[其他使用者反馈 #6210](https://github.com/stryker-mutator/stryker-js/issues/6210)。原文与补丁核实：2026-10-27；10-30 定向回核 #35／#6214 并完成上述云端 Linux 实测，未独立复跑 hosted CI 或完整发布门禁。✅ 已入 [13 候选表](../13-frontier-radar.md#值得一试近4周的新项目与做法)。

### 2026-10-28：Vitest 先选原生 reporter，不叠两份终端输出

👀 **已有 Vitest、测试输出太吵时，先核原生 `minimal`（别名 `agent`），不要在 `default` 旁再叠一个。** 在已安装 5.0.5 的项目可单次试 `pnpm exec vitest run <原测试路径> --reporter=minimal`；保留原 config／project 参数和验证范围。未自定义 reporters 时已有 Agent 自动选择；显式列表会替换默认列表，项目需要的 CI／JUnit 等消费者继续保留。

本仓合成命令探针中，minimal 保留失败断言、退出码和最终 passed／failed／skipped 计数；default＋agent 则重复统计与错误报告。负责人复跑失败输入也观察到一份变两份。**11-05 已补[真实发布脚本的历史诊断回放](../../experiments/vitest-reporter-release/README.md)**：GenomeSpy 原上游回归在旧源码上12过／2失败，agent 输出给出期待／实际差异及定位行；只补脚本后仍有包级 changelog 折行失败，补齐同提交的格式配置后完整14项通过。全程未换 reporter、未改断言，筛选时12项 skipped单列；成功输出仍含子进程日志。不是原创修复、盲评或 reporter 效率比较，不据此声称省成本；社区关于安静输出导致 verbose 重跑的反馈仍保留。

**依据**：[官方默认选择](https://vitest.dev/guide/reporters#default-configuration)、[5.0.5 固定实现](https://github.com/vitest-dev/vitest/blob/7a825db43e2beca0b219d2eadaec334cb81af0c7/packages/vitest/src/node/reporters/minimal.ts)；[GenomeSpy 实际 Agent 指令](https://github.com/genome-spy/genome-spy/blob/91ce56e30eeb08f30e63fca518935d386e7f00f1/AGENTS.md#L79-L88)；[Cloudflare vinext 的组合配置](https://github.com/cloudflare/vinext/blob/a3b6b4df4f53a66d574ee86f42150e85d250196c/vite.config.ts#L146-L149)是借鉴前须实跑的反例，未运行其业务测试；[Reddit 原帖与正反评论](https://www.reddit.com/r/node/comments/1vrwxw5/should_node_test_runners_have_a_silentonsuccess/)。核实与合成探针：2026-10-27 UTC。

### 2026-10-27：灯光 Skill 先核材质受光路径

✅ [game-quality-pass 灯光细则](../../domains/game-dev/templates/.claude/skills/game-quality-pass/references/lighting.md)已补材质边界，不以 HDRI＋AO 为通用起点。Three 0.186.1 原生 MeshToon 不接 scene.environment；方向光阴影先衰减 direct，Ambient／Hemisphere 独立进入 indirect，Toon ramp 保不住全遮挡的直接光。先核 shader 直接／间接受光，再按缺口选环境源与 AO；Toon 不强接 PMREM。源码结论保留；后续候选的视觉收益按 [§4](../../domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md#4-同机位对比非作者判定)验收。

**依据**：Three 官方固定源码 [环境接入](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/webgl/WebGLPrograms.js#L56-L64)、[阴影与间接光](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/shaders/ShaderChunk/lights_fragment_begin.glsl.js#L181-L244)、[Toon 合光](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/shaders/ShaderChunk/lights_toon_pars_fragment.glsl.js#L10-L25)；与已安装 0.186.1 对应文件逐字节一致，核实 2026-10-27。

### 2026-10-27：游戏拍摄边界已按新决定对齐

✅ **需要 WebGL2 的拍摄与 smoke 按 11-04 决定下发本机，其余浏览器检查留在云端**；本条 10-27 的云端安排已被[游戏细则§7](game-taskbook.md#7-下发本机模型的游戏任务)替代。默认版本验收按 [game-quality-pass §4](../../domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md#4-同机位对比非作者判定)，[capture.md](../../domains/game-dev/templates/.claude/skills/game-quality-pass/references/capture.md)保留 gpu／software／unknown 分类、每轮独占目录与 manifest。原调用 unknown 或拍摄槽未核空时不另派；既有 cancelled 卡不恢复，明确拒绝不重试或换入口。

### 2026-10-28：MCP 迁移，先固定消费者再读接口差异

👀 **升级 MCP SDK／协议时，先比两版服务实际暴露的工具、schema、能力与资源，再用固定旧／新协议客户端验真实调用；本仓未试用。** 官方 servers 的 [interface-diff 脚本](https://github.com/modelcontextprotocol/servers/blob/1a9554d1ad252bc834f1fce9a7048ccc321ec980/scripts/interface-diff.mjs)已在 [#4975](https://github.com/modelcontextprotocol/servers/pull/4975)合入，入口为 `npm run interface-diff -- --base <ref> --report-dir <dir>`，需在该项目构建并启动两版服务。差异留给审阅，构建或探测失败报错；普通重命名继续项目原生测试。

**先读差异报告采用的协议与能力。** 真实迁移 [#5131](https://github.com/modelcontextprotocol/servers/pull/5131)的客户端自动协商最新协议，实际比较旧版 `initialize` 与新版 `server/discover`；旧消费者兼容另由 Inspector 的 `--protocol-era legacy`／`modern` 和 SDK 客户端验证。其 Claude Code 实测只覆盖协商后的现代协议。维护者和工具作者的[原始采用讨论](https://github.com/modelcontextprotocol/servers/issues/4860)指向该交付；这是一份运行时协议迁移的接收做法，当前本仓没有匹配的自然迁移任务。核实：2026-10-27 UTC。

**客户端所见声明也要单独核。** Codex 用户 [#42283](https://github.com/openai/codex/issues/42283)复现了根 `oneOf` 旁的字段在客户端转换后丢失；[0.162.0 固定源码](https://github.com/openai/codex/blob/c1382380de69521303b416720a52f42d51af6248/codex-rs/code-mode-protocol/src/json_schema_types.rs#L111-L165)支持这个具体机制，[社区使用者](https://www.reddit.com/r/mcp/comments/1x2bnc5/claude_code_and_codex_break_on_different_mcp/)自报已增加逐客户端清单核对。自然接入或 schema 变更时，分开验服务暴露清单、客户端所见名称／参数、实际调用。当前 [Serena 实跑](../../experiments/serena-vue-implementation/README.md#真实-mcp-stdio-入口)覆盖 SDK／服务路径，Claude／Codex 的声明转换与模型调用待验；上述用户复现与固定源码也不泛指最新版。核实：2026-10-27 UTC。 10-31 已补[当前原包离线复现](../../experiments/codex-mcp-schema/README.md)：固定 `67f0994b` 的 43 项原库测试通过，真实声明入口仍丢根级 `oneOf` 旁的字段；新增诊断 1 通过／2 失败。只在声明转换层定位，服务端约束保留；按 Codex 当前贡献规则只准备诊断，不准备外部代码 PR。

### 2026-10-27：OSS Verify，把已有 fuzz 性质交给独立证明检查器

👀 **维护有明确性质的 C/C++ 库时，可从一份公开证明起步，再决定是否让 Agent 准备自己的 fuzz target；本仓未试用。** 在固定源码中选 `coturn/FuzzStunClient`，按 [checking](https://github.com/theorem-labs/oss-verify-proofs/blob/1045cd75d83eacd942040cb611c98305f33dea59/docs/checking.md)／[proving](https://github.com/theorem-labs/oss-verify-proofs/blob/1045cd75d83eacd942040cb611c98305f33dea59/docs/proving.md) 准备 Docker／Rocq checker，`./oft fetch coturn` 取项目产物，再在固定镜像、断网容器内运行 `./oft check coturn/FuzzStunClient --parts statements,proofs`。10-27 文档已补至少 1 GiB 硬栈上限；该固定版本 README 尚未同步，官方称后续 release 补齐。外部用户两核运行 34 分钟后主动停止，尚无该用户复验通过的回执。

**入项目 Skill 可借的是把“正确”写成真正会失败的性质。** 它要求 seed 覆盖见证和可触发失败的修改；C/C++ 的 `assert` 可能被 `NDEBUG` 删除，性质失败应触发 `abort()`，而非普通 `return -1`。接收时核实际 harness：公开 LZO 示例只比较成功码与长度，内容相等须另有检查，该条目仍是待证明 statement。已发布证明的范围以对应 theorem 和编译产物为准；普通应用测试继续沿用原生回归与差分测试。

**依据**：[官方研究](https://www.anthropic.com/research/formal-verification)、[固定公开证明](https://github.com/theorem-labs/oss-verify-proofs/tree/1045cd75d83eacd942040cb611c98305f33dea59)、[固定入项目 Skill](https://github.com/theorem-labs/oss-verify/blob/1bfa50204b14e6bdddde765e851afdb954314ba8/.claude/skills/add-project/SKILL.md)、[LZO harness 与状态](https://github.com/theorem-labs/oss-verify-proofs/blob/1045cd75d83eacd942040cb611c98305f33dea59/projects/lzo/lzo_compress_target/harness.yaml)、[真实复验反馈](https://github.com/theorem-labs/oss-verify-proofs/issues/2)。10-27 核实；公开快照 61 入口／26 库是已发布子集，研究样本为 239 入口／123 库，不混计。

### 2026-10-27：摘要树与按需回读，先保留原生压缩

👀 **已经使用 Pi、且长任务反复丢失必要旧细节时，可评估 pi-optchat 的摘要树＋`zoom`；普通 Claude Code／Codex 使用者继续原生压缩。** [0.10.0 固定实现](https://github.com/jonaslsaa/pi-optchat/tree/2714a3f4167ba41ea1868b51d715e680ac5f095d)用额外模型构建摘要视图，保留原文供回读，是替换主代理压缩而非“不压缩”。已有[非作者集成反馈](https://github.com/jonaslsaa/pi-optchat/issues/165)，[作者的 40 对摘要评估](https://github.com/jonaslsaa/pi-optchat/issues/153)未公开完整数据，也不是与原生压缩对照；选择时要计摘要调用、回读、质量和总成本。截至 10-27 本仓未安装、未试用；[原帖反馈与源码核对](local-jobs/artifacts/A-CONTEXT-COMMUNITY-FOLLOWTHROUGH-20261027/sources.md)未支持固定 token 数重开或只给目标。核实：2026-10-27。

**同时使用 pi-subagents 时，先核“后台完成通知能否启动父回合”。** [使用者 #225](https://github.com/jonaslsaa/pi-optchat/pull/225)报告成功通知以隐藏消息发出，OptChat 却报 `OptChat has no current user message`，父回合中断。当前 [pi-subagents 通知生产路径](https://github.com/nicobailon/pi-subagents/blob/a37a28853822d470d15ae1764c97aed258087699/src/runs/background/notify.ts#L674-L699)仍对普通异步成功使用 `display: false`；[OptChat 0.11.0](https://github.com/jonaslsaa/pi-optchat/blob/45585d215694a49f489c5cf38e85d37a8496e649/src/transcript.ts)仍用当前 user 输入作判断。已有 [PR #256](https://github.com/jonaslsaa/pi-optchat/pull/256)按真正触发消息的身份区分通知与补充上下文，尚未合并；作者的真实 Pi／确定性 provider 回归用的是通知夹具，未加载真实 pi-subagents，不能视作两扩展已兼容。

本仓尝试接真实通知模块与父回合包装到 Pi 1.4.0／OptChat 0.11.0，固定源码与官方依赖已准备；隔离 profile 的 `lock.sock` 在启动时返回 `listen EPERM`，因而**尚未投递通知或验证该兼容问题**，PR 对照也未运行。运行已停止，未绕开锁或移除原生生命周期；该组合验收未完成，不推荐为了摘要树改变现有稳定入口。源码与 PR 核实、启动尝试：2026-10-31；没有调用付费模型、导入个人历史或另提重复补丁。

### 2026-10-27：沿真实启动链补测试，而非叠加审查轮次

👀 **接入外部程序时，先跑真实宿主的最短路径，再让回归覆盖宿主的启动包装和环境差异。** Calyx 作者在 [DEV 复盘](https://dev.to/yuu1ch13/seven-rounds-of-ai-code-review-in-one-day-2048-tests-green-and-the-feature-had-never-started-once-1lb8)中自报多轮 AI 审查与大量绿测仍漏掉无法启动的窗格；[公开修复](https://github.com/yuuichieguchi/Calyx/commit/cd89aab20be8ac34d342e852d646d6fd88a7f267)可核：真实 Ghostty 会再包一层 `exec`，原测试只执行裸命令，修复去掉自身多余的 `exec`，测试改为经过宿主包装，并用不同的环境 HOME 检查显式配置确实生效。本仓只读核实、未在 macOS 运行；保留这个实际失效机制，不据作者轮次或测试数量推荐更多审查。核实：2026-10-27。

### 2026-10-27：先检查判官，再改生成提示

👀 **评测突然判出大量错误时，先人工读失败样本，再决定改提示词还是改判据。** 中文实践者在 [ai-study-helper-v2 切片 030](https://github.com/lipeidonggz/ai-study-helper-v2/blob/325956ced3eaece484eb91a7a0c576e45794100e/docs/development/slices/030-agent-claim-strength-fidelity.md)记录：50 次尝试后发现原判据误伤保留转折的近义转述，否决原归因并撤回一次提示修改。它是作者的真实项目复盘，逐次 trace 未公开；本仓未试用，也不引入其审批或提交门禁。[原始材料与公开提交核对](local-jobs/artifacts/A-COMMUNITY-PRACTICE-SCAN-20261027/sources.md#dot-a-接收后的关键核对)。核实：2026-10-27。

### 2026-10-27：本机广扫接收后的选择

👀 **公共 API 改动先找项目自己的生成与兼容检查，不另搭通用审查框架。** Effect 已用 [`api-diff` 与迁移注解](https://github.com/Effect-TS/effect/pull/9971)持续刷新消费端迁移指导；Biome 把“变更类型→codegen 命令”写进 [AGENTS](https://github.com/biomejs/biome/blob/e2e5a36e1be8581419742a85268ad82f020da62e/AGENTS.md)，[真实规则 PR](https://github.com/biomejs/biome/pull/12580)由 CI 补齐遗漏的生成内容。适合已有多包或生成链的项目，本仓当前没有匹配的自然改动，未试用；不为试工具新造迁移。[四组原始材料与消费者](local-jobs/artifacts/A-FRONTIER-SOURCE-COLLECTION-20261027/sources.md)保留 Nx、Rust 兼容检查的取舍入口。

🧪 **Nx 已有项目，交付受影响项目和实际执行任务两份清单。** [Capture Workbench #291 真实重构复核](../../experiments/nx-affected-review/README.md)：Nx 24.0.3 返回 7 个 affected 项目，实际 `typecheck` 只跑 UI、app、tools 三任务且全部通过；desktop 的目标叫 `typecheck-scripts`，e2e 无同名目标，runtime 虽有同名目标但本次未被任务 inputs 选择。直接反查 UI 也只得 app，不能代替传递下游。独立复跑一致；构建、浏览器 e2e、desktop 和其他 feature 未验，不把绿色命令当全下游验收，也不为此迁移非 Nx 仓库。✅ 实试回流，2026-11-05。

⛔ **Entire：本仓保留 Git 交接与决策记录，不导入真实会话。** 它将提示与 transcript 放进旁路 Git refs，默认随 push 同步；公开仓采用前必须先决定这些会话是否可以公开，默认脱敏会跳过路径字段和图片/base64 对象。只有确需回看会话且材料允许保存、分享时再评估，当前未安装、未试用。依据：[存储与同步](https://docs.entire.com/guides/checkpoints/checkpoint-storage)、[0.12.2 脱敏实现](https://github.com/entireio/cli/blob/b6900cf9f71bfbebc68b88860892e8ae5bad30b8/redact/redact.go#L2522-L2535)、[HN 使用者采用](https://news.ycombinator.com/item?id=50251718)与[已有规格足够的反馈](https://news.ycombinator.com/item?id=50255682)。

**Cursor Agent SDK 先按当前文档核包名。** [官方 quickstart](https://cursor.com/docs/agent-sdk/quickstart.md)使用 `@grok/agent-sdk`（原 `@cursor/bdk`），[发布博客](https://cursor.com/blog/agent-sdk)的 `@cursor/agent-sdk` 在核实日 registry 返回 404；当前包为 0.3.0。本仓未安装或运行，不新增默认。[广扫来源、正反反馈与未覆盖范围](local-jobs/artifacts/A-FRONTIER-WIDE-SCAN-20261027/sources.md)。本节核实：2026-10-27。


### 2026-10-27：只补测试契约审查，不装整套评审循环

👀 **下一次真实脚本改动担心失败路径没测到时，可单独试官方 pr-review-toolkit 的 `pr-test-analyzer`；原生审查已能接住就沿用。** 这是插件子代理，提示它审“哪些具体契约违约仍能让测试变绿”，并明确 PR 或已确认的 base/head、源码和测试清单。即使测试文件没改也按行为判断是否需要它，不默认启动六角色。

官方包装仍以裸 `git diff --name-only` 起步；本仓干净工作树读到 0 文件，而两份真实已提交差量分别有 2／1 文件。实际用户日志也显示 Agent 可能自行补查 PR diff，因此这里要求显式范围，未把提示缺口写成必然漏审。OME 已在 reconciliation 重试评审中接入；CPace 组合评审后补了错误透传与分类测试，效果不能单归此角色。**本仓未安装、未运行该插件，当前没有未结的匹配脚本任务**，不重开已接收改动制造试用。

**依据**：[固定角色](https://github.com/anthropics/claude-plugins-official/blob/41f619d61b999adec1a1c8deb97d1a5b6ac35bb6/plugins/pr-review-toolkit/agents/pr-test-analyzer.md)、[命令范围与角色选择](https://github.com/anthropics/claude-plugins-official/blob/41f619d61b999adec1a1c8deb97d1a5b6ac35bb6/plugins/pr-review-toolkit/commands/review-pr.md#L29-L43)、[真实调用日志 #319](https://github.com/anthropics/claude-plugins-official/issues/319)、[OME 接入](https://github.com/ome-projects/ome/commit/5e2466e331be8a28a0ca7ce6828b67fc842e1fb6)、[CPace 已合入评审与补测](https://github.com/the-sarge/cpace/pull/78)；[同类范围修订 #459](https://github.com/anthropics/claude-plugins-official/pull/459)因外部贡献范围关闭、未合入，当前不另投同类 PR；核实 2026-10-27。

### 2026-10-27：dotagents 的项目级 Skill 分发

👀 **多个客户端确实要共享同一组 Skill 时，可评估 dotagents；少量本地 Skill 继续直接维护。** 已有 `agents.toml`，且来源、MCP／Hook 声明与目标客户端均已审过时，在项目内刷新：

```bash
npx @sentry/dotagents@3.4.0 --project install
```

Git 来源的 `ref` 填已审完整 commit SHA，每条项目命令都保留 `--project`：3.4.0 的 `agents.lock` 记录来源但不冻结安装，`--frozen` 已被忽略，无作用域参数则操作全局配置。Sentry JavaScript 已把共享 Skill 与声明入 Git；其提交的 dotagents Skill 较旧。**本仓未安装、未试用**，当前模板没有待解决的跨客户端分发任务，先不增加管理层。

**依据**：[3.4.0 发布](https://github.com/getsentry/dotagents/releases/tag/3.4.0)、[固定 Skill 的作用域](https://github.com/getsentry/dotagents/blob/46558ca1670e823aa3f92d811309c81720babb53/plugins/dotagents/skills/dotagents/SKILL.md#L9-L17)、[忽略 `--frozen` 的实现](https://github.com/getsentry/dotagents/blob/46558ca1670e823aa3f92d811309c81720babb53/packages/dotagents/src/cli/commands/install.ts#L98-L115)、[锁文件契约](https://github.com/getsentry/dotagents/blob/46558ca1670e823aa3f92d811309c81720babb53/docs/src/content/docs/security.mdx#L72-L126)；[实际消费者配置](https://github.com/getsentry/sentry-javascript/blob/c125a5da2e6b7d916a5880f65876cddfee96c56d/agents.toml)、[其旧版锁定](https://github.com/getsentry/sentry-javascript/blob/c125a5da2e6b7d916a5880f65876cddfee96c56d/agents.lock#L12-L17)；[HN 使用者自报](https://news.ycombinator.com/item?id=47544018#47545728)，没有收益对照；核实 2026-10-27。

### 2026-10-27：SDK 迁移与按改动构建

- 🧪 **Anthropic SDK 从 0.x 升 2.x，要同时迁移 HTTP 类型与实际请求契约。** [真实 Hermes adapter 对照](../../experiments/anthropic-sdk-migration/README.md)：0.125.0 原依赖通过；只换 2.3.0，构造先因 `httpx`／`httpx2.Timeout` 不兼容失败；独立检查后续调用，采样参数在发送前抛错，删参数后旧 `Authorization: Omit()` 又使 API-key 路由两种认证头都没有。用对应 SDK 的原生内存 transport 捕获当次请求，七项回归覆盖复制客户端与正对照。暂缓只改依赖的补丁，先核 v1、v2 两份迁移；应用源码／pin 未改，模型与真实网关未调用（实测 2026-10-30）。

  **依据**：[官方迁移指南](https://platform.claude.com/docs/en/api/migration-2026-10-21)、[Python 2.0 发布](https://github.com/anthropics/anthropic-sdk-python/releases/tag/v2.0.0)、[Bedrock 用户对照](https://github.com/anthropics/anthropic-sdk-python/issues/2031)、[Hermes 迁移待办](https://github.com/NousResearch/hermes-agent/issues/142796)；核实 2026-10-27。

- 👀 **维护 Next.js 框架源码时，按源码变化和现有产物决定构建，不因新 worktree 就跑 `build-all`。** Next.js 于 10-22 将 AGENTS 与 backport Skill 改为：仅核心 JS 用 `pnpm --filter=next build`，跨 JS 包用 `pnpm build`，Rust／Turbopack 用 `pnpm build-all`，仅改测试且框架产物有效则直接跑测试；切分支、pull 后产物过期仍须补构建，已发布原生绑定落后于源码且启动失败时再完整构建，本仓未试用，待真实 Next.js 框架维护任务采用，不改变本仓门禁。

  **依据**：[已合入的 AGENTS／Skill 修改](https://github.com/vercel/next.js/commit/9ff761f2ceb2f38751578ba17bd2b3b9077c35f1)、[10-26 固定 AGENTS](https://github.com/vercel/next.js/blob/6f98e9fcedf6420658f0039376ef15d358e4cf1a/AGENTS.md#L105-L107)；核实 2026-10-27。

### 2026-10-27：用户带入 GPT-6.1 Terra

- 👀 **官方模型资料与 Artificial Analysis 六档 effort 评测已核，已收录进 [02 模型与成本](../02-models-and-cost.md#terra-effort-evidence)**，用于区分能力分数、单价与每题成本；本仓未调用模型实测。带入渠道为本 ChatGPT 对话，本次记 1 项漏检；公开来源、首次核实日期与发现时差边界见[校准记录](../research/2026-10-15-exploration-evidence.md#2026-10-27用户带入-gpt-61-terra-漏检)。

<a id="portless-worktree-urls"></a>
### 2026-10-27：Portless 命名开发入口

🧪 **多个 worktree 频繁切换时，可试 Portless，让 Agent 和浏览器引用稳定 URL；现有端口安排已清楚就沿用。** 运行现有开发命令时用 `portless run --name myapp <原开发命令>`，再在同一 worktree 用 `portless get myapp` 取得入口，交给已有测试配置；`get` 只构造 URL，就绪仍须请求应用的真实路由。试用选择高端口 HTTP：代理与应用统一设置 `PORTLESS_PORT=1355`、`PORTLESS_HTTPS=0`、`PORTLESS_SYNC_HOSTS=0`、`PORTLESS_LAN=0`、`PORTLESS_TLD=localhost`，先确认既有代理配置一致；默认 HTTPS／443 与 hosts 路径涉及系统配置，先不选。10-27 仅核源码 0.15.12，Apache-2.0、Node.js 24+；真实 UI 工作流仍待采用。

**10-31 已完成 [#521 原 CLI 实试与隔离做法](../../experiments/portless-state-isolation/README.md)。** 正式包与固定主干都会在同目录显式启第二端口时覆盖 PID，随后停止 A 却停到 B；独立状态目录的停止控制通过。多 worktree 通常共用一个代理，确需独立代理才分开 `PORTLESS_STATE_DIR`；窄补丁仅本地验证，不当成上游已修或完整并发安全。

**实际采用提醒：稳定 URL 也要接进测试。** state-in-url 已用 0.15.5 承载八个示例应用与 CI，但 E2E 仍写死主检出的 URL，工作树前缀会令测试找错入口；不复制其 `--force`，该选项会终止同名路由的现有进程。其脚本采用高端口 HTTP，却没有关闭 hosts 同步，不能据说明认定不改系统文件。浏览器会话仍按 Cookie 与存储作用域分别验收。

**依据**：[一手：固定源码] [官方 Skill／配置](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/skills/portless/SKILL.md)、[`get` 实现](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/packages/portless/src/cli.ts#L2463-L2471)、[hosts 开关](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/packages/portless/src/hosts.ts#L64-L70)、[`--force` 实现](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/packages/portless/src/routes.ts#L223-L255)；[一手：实际消费者] [启动脚本](https://github.com/asmyshlyaev177/state-in-url/blob/cf2bc0f854ae6eda4a8234c9cd5e0a1a22a8cfaf/scripts/portless.sh)、[锁定 0.15.5](https://github.com/asmyshlyaev177/state-in-url/blob/cf2bc0f854ae6eda4a8234c9cd5e0a1a22a8cfaf/pnpm-lock.yaml#L188-L190)、[E2E 入口与使用限制](https://github.com/asmyshlyaev177/state-in-url/blob/cf2bc0f854ae6eda4a8234c9cd5e0a1a22a8cfaf/AGENTS.md#demo-app-urls)；[社区] [OpenCode 使用者自报](https://www.reddit.com/r/opencodeCLI/comments/1rqtxn3/portless_cli_for_consistent_dev_urls_makes/)、[V2EX 多 Agent 工作台仍需配端口](https://www.v2ex.com/t/1250974)（后者未采用 Portless）；核实 2026-10-27。

### 2026-10-26 广扫补入：三个实际任务候选

- 🧪 **Sentry：先核原 job，再复用 CI 选择的测试。** [已回流调试路线](../15-task-playbooks.md#ci-报红先找实际失败再决定让-agent-重跑什么)：#130857 的实际 merge checkout、17个选择文件与74个分片 items 分开核；多项失败同指缺失 proto API，作者补依赖后改跑30个全量分片。不能拿后继同编号绿 job 代替原失败 nodeid 结果。[原 AGENTS](https://github.com/getsentry/sentry/blob/eb0125b95bc8569b340b5025a9aaade909e4a52f/AGENTS.md#L53-L59)的 artifact 选择路线仍需保留原命令与配置；未在本地跑完整 Sentry。核实2026-11-12。

- 👀 **agent-browser 0.39.4：按版本读 Skill，增量看网页。** 真实 UI 任务需反复观察时，可比较已装 CLI 的 `skills get core` → `snapshot -i --delta`（丢失上下文用 `--full`），核关键状态与返回文本量；[官方配方](https://github.com/vercel-labs/agent-browser/blob/04ba5264dade678062c3cdcce0f4f293e748249f/skill-data/core/SKILL.md)的 WebMCP 调用不能替代 UI 输入路径。[当前启动实现](https://github.com/vercel-labs/agent-browser/blob/04ba5264dade678062c3cdcce0f4f293e748249f/cli/src/native/cdp/chrome.rs#L1597-L1637)在 root／CI／容器自动关闭 Chrome 沙箱，[多 worktree 用户](https://github.com/vercel-labs/agent-browser/issues/2214)还报告本地安装覆盖全局命令，因此本轮只收录，浏览器对照待保留沙箱的获准环境；未安装或试用。

- 🧪 **opensrc：包内已有源码时先读包；需要仓库历史再固定 Git。** [agent-browser 的真实配置](https://github.com/vercel-labs/agent-browser/blob/04ba5264dade678062c3cdcce0f4f293e748249f/AGENTS.md#L146-L168)已采用；多依赖反复读实现可试[官方 Skill](https://github.com/vercel-labs/opensrc/blob/b51de60867e806da1839b33dd29c29424f12521b/skills/opensrc/SKILL.md)。固定基线遇到不存在的仓库 ref 会回退默认分支；[已审补丁](../../experiments/opensrc-ref-integrity/source-ref-integrity.patch)改为失败并支持完整 commit SHA，[本地实测与复用](../../experiments/opensrc-ref-integrity/README.md)使用合成已解析元数据、真实 Git 和真实 CLI 缓存读取，未覆盖冷启动 registry HTTP。包版本缺 tag 的回退不在原补丁范围；上游 [PR #57](https://github.com/vercel-labs/opensrc/pull/57)已关闭未合并，旧缓存不重验、不迁移，试用使用独立 `OPENSRC_HOME`。[原用户 #61](https://github.com/vercel-labs/opensrc/issues/61)实际遇到历史版本的 string repository 使 registry 解码失败；[11-11 原生 npm 实做](../../experiments/opensrc-ref-integrity/npm-source/README.md)已直接从指定发布包读到实现和类型，保留精确版本／完整性核验，不为此安装辅助取源工具。需要包外历史再固定完整 Git SHA 并核 `git rev-parse HEAD`；新结果是取源与阅读，不是认证运行或 opensrc 修复。

### 2026-10-26 固定来源扫描

读者是用 Agent 维护脚本、知识库和多 Agent 长任务的开发者。本轮增量是把“少送输出”“保留原始证据”“自动记忆”分开选，不按 star 或节省百分比全装插件。试用线能据下列入口在本仓选一个真实读改任务，取得原段、保住决定性限制并交成修改，才算用上；下表均未试用；show-me 写法、context-mode 与 Hippo 组件的已接收结果在本页“已处理”。

| 候选／来源 | 当前选择、试用状态与下一步 | 解决什么、谁在用与社区评价 |
|---|---|---|
| 👀 [Archify 3.2](https://github.com/tt-a1i/archify/releases/tag/v3.2.0)，awesome-claude-code 线索；[SpecDev 作者采用](https://github.com/tt-a1i/archify/discussions/952)、[导出缺说明卡反馈](https://github.com/tt-a1i/archify/discussions/721)；固定 `81c6be8d`，Apache-2.0 | **只在本仓读者需要点击固定源码／连续更图时才选它**，与 show-me／Mermaid 比较，当前未运行浏览器／插件。出现这类真实解释需求才试，两者不用为凑数都装。root 下 browser-check 会请求 `--no-sandbox`，不得照跑或为此改安全设置。 | 从真实源码形成带位置的可交互解释；SpecDev 作者自报 Windows 集成使用，导出用户提醒 PNG/PDF 不一定带上 HTML 说明。源码位置校验不等于解释语义正确。 |
| 👀 [anymd](https://github.com/SylphxAI/anymd)，[AgentIndex 10-07 清单](https://agentindex.app/zh/guides/new-tools-2026-10/)补入；[真实 OpenCode 用户 #881](https://github.com/SylphxAI/anymd/issues/881)；固定 `71fb95b5`，MIT 本地核心 | **下一次本仓论文／文档研究需要本地 PDF 时选**：`read`→`search`→按页核原文，基线是原生 PDF 抽取＋页图；当前未试用。若只是偶尔读一页，继续用原生抽取，不拿作者速度榜作结论。实际选用须含 8.5.5 后续修复并核有效目录配置；CLI 默认不限预算，须显式给 `--max-tokens`，不运行改所有客户端的 `setup`；付费 cite-check 不在本次选择内，不称已运行或完整安全认证。 | 文档转 Markdown，带页码、预算与续读 cursor；用户报告原始 stdio 可读，但严格客户端因 nullable 字段错误列为 required 而拒绝，说明“服务能跑”不等于 Agent 能用。该 schema 历史修复见固定源码与 8.5.3 changelog（见 [04 接入](../04-mcp.md#裸-stdio-可用客户端却拒绝参数)与 [10 安全](../10-security.md#本地只读-mcp目录验收覆盖可调用的兼容入口)）。 |
| ⛔ [AOCI-CODE](https://github.com/aoci-spec/aoci-code)，同一清单补入；[用户 #114 与维护者回应](https://github.com/aoci-spec/aoci-code/issues/114)、[性能反馈 #127](https://github.com/aoci-spec/aoci-code/issues/127)；固定 `7351c9de`，FSL-1.1-MIT 源码可用许可 | **本仓先不加全量索引**，按任务读源码，当前未试用。出现跨文件、全仓索引的真实需求再比较，否则继续 `rg` 按段读取；索引放不下时不能以调小 chunk 当修好。该索引压缩后仍要求完整 Overview，早期清单“未识别许可证”已过时，也不当 MIT 当前版。 | Git 版本化的仓库认知索引；有用户认可用途却报告慢，另有完整索引未读完即压缩、恢复又全量读的循环。维护者确认分块只降单次输出，不降累计上下文。 |
| ⛔ [Jevmem](https://github.com/Avinash-jetwani/jevmem)，[O’Reilly 10-06 雷达](https://www.oreilly.com/radar/radar-trends-to-watch-october-2026/)补入；MIT 代码 | **本仓不接账号、付费或导入会话**，当前未试用。只保留“新规则取代旧规则但留历史”的机制参照；已有 Git 交接足够时不增加服务，出现真实跨会话决策记忆需求再核数据路径。 | 保存决策与失败路径并退役旧事实；作者自测手写 `CLAUDE.md` 做得相近，尚无独立采用效果。MIT 代码不等于纯离线产品：当前接入需 TypeSafe API，消息、相邻轮次和记忆会送出。 |
| ⛔ [Google AX](https://github.com/google/ax)，同一 O’Reilly 雷达补入 | **暂不另建 Kubernetes＋Agent Substrate 集群**，已有宿主与 worktree 能接住本仓任务，当前未部署。需要自管大规模执行面时再核恢复和隔离契约。 | 声明式编排 Task／Workspace／Model，分离任务、工作区与模型配置。官方明确仍重度开发、稳定版前可能破坏性变更，独立生产使用成效未知。 |
| 👀 [lights-on-software-factory](https://github.com/gojko/lights-on-software-factory)，[上周 HN 原帖](https://news.ycombinator.com/item?id=50160198)补入；固定 `7e8ee8b4`，MIT | **本仓不选，保已有完成卡／版本门禁**：没有它的 progress 协议产物，当前未试用。不手工翻译现有日志制造采用，也不装整套权限、hooks 或读取真实会话。同 step 编号改了需求不能沿用 done：完成判定沿用原 run／group 记录、不比对新规格，须按新规格重新验收；[生成器](https://github.com/gojko/lights-on-software-factory/blob/7e8ee8b4dcd9857da48845b187540e3e1891c70f/workspace/.claude/workflow/src/generator/build-run-shape.js#L27-L34)仍按编号跳过已完成步骤，这是源码契约核对，未运行复现。 | 把计划依赖、同阶段写入冲突、分组门禁与恢复判定交给确定性程序；Votito 作者自用抽出，省费约 80% 仅作者口径，评论问隔离和凭据，并无独立收益验证。源码的完成判定要求末次 worker 完成、所属运行组 gate 绿且后续无反驳。 |
| ⛔ [agent-usage-guard](https://github.com/rbartoli/agent-usage-guard)，[上周 HN 原帖与讨论](https://news.ycombinator.com/item?id=50198936)补入；固定 `8e9f9131`，MIT | **当前宿主不接该 mod，先用原生额度／并发控制**；当前未试用。出现真实失控消费再评估宿主适配。core 判定与宿主适配分开；跨机器、独立终端队友及无前置事件的 fork 有覆盖边界，失败通常放行，不是硬预算安全边界。 | Claude Code mod 在代理启动、重上下文和重复失败前询问／拦截，合并本机多会话计数。作者报告旧 hooks 降 burst 但 lockout 仍增加，默认绝对阈值按自己的 Max 5x 调，不能推广。 |

收件箱只记待选与判断，不把本轮补录当成已试用；上周固定 10 条参照见 [25 周校准](../25-ai-exploration.md#2026-10-26上周-hn-样本校准)，另有 [13 项冷启动历史补充](../25-ai-exploration.md#2026-10-26冷启动历史补充)。

### 2026-10-26 历史目录三项补核

这三项解决的是首次目录对照留下的“待核”，不是再跑一次周扫描。读者先分清本地 adapter、远端检索与自托管数据平台；能说出实际数据路径、原生替代和不装条件才算补全判断，以下均未试用。

| 候选／来源 | 当前选择、试用状态与重开条件 | 解决什么、谁在用与社区评价 |
|---|---|---|
| ⛔ [Ref Tools MCP](https://github.com/ref-tools/ref-tools-mcp)，[官方安装](https://docs.ref.tools/context/install/index)；[自托管疑问 #10](https://github.com/ref-tools/ref-tools-mcp/issues/10)、[项目文档用户 #32](https://github.com/ref-tools/ref-tools-mcp/issues/32)；固定 `f5feb829`，MIT | **保官方原文／已有 Context7，不因 adapter 开源就称无需账号、离线或可自托管**；当前未试用。只有现有入口确实漏必要文档且服务接入已获相应授权，才比较完整检索任务。当前官方接入需 API key 或 OAuth；未核当前价格，不引用历史免费额度，不开户或导入文档。 | 按检索历史筛文档，减少重复结果；真实用户用它查手册、希望保存项目材料，后者不能当自动笔记已发布。MIT 仓是 legacy stdio adapter，固定源码的搜索／读取仍请求 Ref 服务；历史维护者也明确索引不在本地。 |
| ⛔ [PipesHub](https://github.com/pipeshub-ai/pipeshub-ai)，[作者帖与资源／模型问答](https://www.reddit.com/r/LocalLLaMA/comments/1waobyi/an_opensource_context_layer_for_building_ai_on/) | **本仓公共文件没有跨组织撤权／连接器需求，保 `rg` 或显式索引**；当前未试用。出现真实多权限消费者后，再核撤权与引用版本；此前不部署多服务、不创建 PAT、不接公司资料。只读官方部署与可见问答，未核完整实现／权限传播；不把“自托管”写成离线或数据不外发。 | 把企业多源资料变成保源权限、带引用的 Agent 上下文；作者称测试过本地模型，评论追问小模型关系抽取与 slim 部署成本，不是独立采用证明。slim 不等于零模型／embedding 成本；按阶段选模型在该问答里仍是计划。 |
| 👀 [crw／fastcrw](https://github.com/fastcrw/crw)，[MCP 模式文档](https://docs.fastcrw.com/mcp/)；[真实 SDK 字段遗漏 #557](https://github.com/fastcrw/crw/issues/557)；固定 `dc1a5968`／0.39.0，AGPL-3.0 | **只在真实、已获准的网页格式转换需求下选它，先保原生网页读取**；当前未运行。MCP 的 `CRW_LOCAL` 分支强制本地引擎，不代表其他子命令也忽略远端配置；搜索还需 backend，本地模式会尝试发现／启动浏览器，Auto 按已配置后端回退，代理需另配。Chrome 启动代码含 `--no-sandbox`，本轮不走该入口；未核纯 HTTP／离线入口前不运行，既有 403 更不能拿来试抓取。 | 抓取／转换、站点映射与搜索接口。用户的 sitemap 不是“包没更新”，而是服务字段被 SDK 丢掉；维护者报告 0.36.0 发布后核过，两者不等于本仓复测。 |

### 2026-10-26 按生产问题补入

- 👀 [Humanizer 3.1.0](https://github.com/blader/humanizer/blob/8c307f367c91bd974002f10f2be2965d642c13df/SKILL.md)（MIT，固定 `8c307f367c91bd974002f10f2be2965d642c13df`）：**可辅助精简新稿，保留事实复核。** 10-27 手工按 Skill 编辑新增 mutmut 候选时，首稿缩短却弱化了“零执行不能当通过”，经非作者读者核对后恢复；未安装插件，不做批量改写，净收益仍待观察。[Akita 自用](https://akitaonrails.github.io/en/2026/09/17/talking-about-my-ai-skills/)的是定制 3.0；历史[添事实 #187](https://github.com/blader/humanizer/issues/187)与[删排名／同时性 #212](https://github.com/blader/humanizer/issues/212)已有修订，仍须逐稿核语义。

## 已处理

| 候选／来源 | 实际结果与去向 | 解决什么、谁在用与社区评价 |
|---|---|---|
| ✅ [HumanLayer show-me](https://github.com/humanlayer/skills/tree/653b6411c1f70c275a18e37673b042ff99f67ceb/plugins/show-me)，GitHub 清单线索；[真实组合需求 #12](https://github.com/humanlayer/skills/issues/12)；固定 `653b6411`，MIT | **[最小结构 diff 已用于真实补丁交接](../../experiments/show-me-symlink-handoff.md)**：显式读 Skill 后应用表达形状，熟悉补丁的接收者据 26 行交接正确定位四类分支与测试，原 diff 为 212 行；这只是材料量和定位结果，未测提速。复杂分支交接可借用，简单 diff 直接审；插件未安装／调用，不装整套 HumanLayer 循环。 | 给代码交接选最小表达：调用树、结构 diff、Mermaid，复杂时才用 HTML；发帖者称 Matt Pocock 的 PR Skill 已复制其形式，也准备借给 PR review Skill。禁止隐式调用仍是组合限制，不是发帖者已完成采用或自动触发已解决。 |
| ✅ [Hippo](https://github.com/kitfunso/hippo-memory)，[AgentIndex 10-07 清单](https://agentindex.app/zh/guides/new-tools-2026-10/)补入；[外部测试提议 #346](https://github.com/kitfunso/hippo-memory/issues/346)；固定 `4d078af8` | **[组件试用已独审](../../experiments/hippo-public-guidance-retrieval.md)**：组件已试，不是整插件采用；手动退役保留旧行并过滤当前召回，但四个中文问题丢失词项后返回同样前五条，新的主引擎／发布段未取出，替代行来源元数据仍指旧段。本仓指导继续用 Git 原文＋`rg` 并引用回源；只有出现跨客户端记忆且新段可被召回的真实需求才重开，未接全局记忆或私人会话。 | 跨编码客户端的本地记忆，区分 pinned、superseded 与 outcome。外部关注的是旧事实退役后是否仍被召回；该 issue 是测试提议，不是完成的独立效果证明。 |
| ✅ [context-mode](https://github.com/mksglu/context-mode)，GitHub 清单线索；[Pi 使用者讨论](https://www.reddit.com/r/PiCodingAgent/comments/1ugk8hi/contextmode_is_adding_15k_tokens_to_every_request/)、[中文原帖](https://linux.do/t/topic/2305228?tl=en)；固定 `8b74cbba`，Elastic-2.0 | **[组件试用记录](../../experiments/context-mode-retrieval.md)已获非作者接收**：组件已试，不是整插件采用，去向 [13 值得一试](../13-frontier-radar.md#值得一试近4周的新项目与做法)。已有路径仍用 `rg`＋按段读取；反复多源查阅才试显式索引，不声称提效。全插件启动会修用户 hooks/settings，独立 server 也有旧库清理／会话索引，先不启两者；不要把同名托管 gateway 当成本地项目，完整原段取不回就保原法。 | 把大输出存入索引，需要时取回原块，而非只留模型摘要。8 份公开本仓文件／344 块，18 个返回块逐字存在；两个完整中文问题无结果，改关键词／限定来源才补齐，入库时间不能当核实日。Pi 用户有保留长任务用法，也有报告额外提示、重复加载工具和临时交接丢失；版本未明确，不能直接套成当前故障率。 |
