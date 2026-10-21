主线：二／三；G1 引擎接入与 G2 模板接管、第二次修改
改变的建议：[研究] 默认原生 Agent＋现有工程；按需拆借模板／同 build 验证，不因生成分数整套迁移；原身份、取消、实例与旧档检查保留
新证据：[作者报告／研究] §7补Play2Code H、RSIGame F.2和Spec2Game评价覆盖对照，改变低增益反馈与真人换用；原工程契约保留，未运行模型或引擎

# WP13：把已证实的边界带进现有游戏模板

核实：2026-10-13 UTC（2026-10-14 UTC+8）。[一手] 为本轮重新读取的官方契约；[研究] 为本地模板对照与采用判断。当前仍是理论阶段，未运行引擎、模型、付费工具或安装插件。

## 当前最高水平卡：二改之后，旧玩法与资产是否还成立？

核实：2026-10-21（UTC+8）；只读论文、作者实践和公开实现，未复跑其模型／引擎实验。问题是同一工程经过内容、资产和规则的后续修改，怎样选择可信的验收，而不是选一次生成分数最高的工具。[研究]

| 层次 | 当前证据与本仓选择 |
|---|---|
| 当前最高水平 | **完整G1二改的最高水平未知。** 近期标尺包括Kun Chen等（中科院／腾讯等）[GameXpert-Bench，2026-08-22](https://arxiv.org/html/2608.21833v1#S6)的累积需求；Yixu Huang等（复旦／小红书等）[Play2Code v2，2026-10-02](https://arxiv.org/html/2605.28258v2)的试玩与裁判分离；Wenyi Wu等[RSIGame，2026-09-30](https://arxiv.org/html/2609.39045v1#A3.SS2)的候选／保留版本成对重放。任务、预算和评价目标不同，不据此选全流程赢家。[作者报告／研究] |
| 近期实践标尺 | Thomas Ricouard的[Building games with Astra，2026-09-04](https://developers.openai.com/blog/how-to-build-games-with-astra)：美术参照贯穿程序化世界修改，用命名场景定位，再以真实操作走着陆、步行、存档重载与起飞；作者继续判断外观／手感。这是具体作者实践，不是最优性或普遍提效证明。[一手：作者报告] |
| 主流 | 采用率未知；不把论文新近、实现开源或演示可玩称为主流。沿用已有工程测试、运行观测、人工试玩作为比较基线。[研究] |
| 可行 | Xiuhui Zhang等（蚂蚁／北航／港科大）[GameASG-Bench，2026-09-18](https://arxiv.org/html/2609.21293v1#S2)把合法前置情境、玩家动作、可见结果与真实状态联系起来；其[固定公开实现](https://github.com/areal-project/GameASG-Bench/tree/6427cb6517ce11ff350ec45fcae17b67c5aec245)可供借鉴。单HTML生成和从原需求重开的尝试不证明连续二改。[一手／研究] |
| 本仓推荐 | **有针对性证据的可行层，不声称当前最好。** 保原生Agent＋现有工程；规则回归与玩家路径互相校验，GUI Agent发现遗漏／给复现步骤，人判可读性与手感。缺状态观察才补窄接口，不迁整套管线、不以总分抵消旧玩法失败。[研究] |

前沿比较限于累积需求、试玩／裁判分离与旧行为保留的证据边界，不代表完整G1制作链已比较完毕；B0→B1→B2仍为待执行设计。[研究]

## 1. 改哪里，为什么不加 Hook

**[研究] 采用现有 AGENTS、按需 Skill 和代码 reviewer，改造其中错误或缺失的具体契约，不新建配置层。** 路径保护 Hook 不能证明 Sprite 是否仍代表原动作、取消后是否串线、旧档奖励是否正确；把这些判断变成更多路径拦截只会给出错误安全感。因此本轮不改脚本、settings、MCP 配置或 Hook，也不迁移异步框架。

| 现有位置 | 对照发现 | 采取的窄修改 |
|---|---|---|
| Unity safe-edit | “GUID 保持不变则引用不丢”过强；无二次导入语义检查 | 回读脚本绑定/数据；Sprite 子身份、Prefab 名称匹配、pivot 和运行时加载键分别验证；停止歧义自动替换 |
| Unity AGENTS | “异步统一一种”会抹平 Coroutine/Awaitable/Task 契约 | 保留现有边界及版本；唯一句柄所有者、预取消、旧请求收尾；禁重复 await 池化 Awaitable |
| Unreal AGENTS | 返回不明确直接当失败，容易在已部分修改后重试 | 停写并回读；success 之后仍验证目标与引用；明确重导入覆盖/保留字段 |
| 两端 AGENTS | 只有代码风格，没有定义/实例、结算、旧档所有者 | 填现有实现与夹具位置；只改涉及系统，允许删去无关项；不新增状态机/GAS/存档框架 |
| 两端 code-reviewer | 取消仅检查对象销毁，存档/实例边界缺失 | 检查重复结算、池复用旧目标、失败覆盖唯一档、内容迁移；Unity 加 Disable 同步取消回调 |
| UE code-reviewer | 同步加载/硬引用一律要求改软引用 | 以实际帧时间问题与驻留需求为依据，小型常驻资源不自动判错 |

初次 WP13 改五文件；当时以 CLAUDE 已导入 AGENTS 为由未同步其具体指令，F1 已纠正该遗漏，见 §4。导入细节归 Unity safe-edit／UE AGENTS；版本由项目填写，不要求升级到研究快照。[研究]

## 2. 证据和反证

### 本轮重新读的一手来源

- [Unity 6.3 SaveAsPrefabAsset](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/PrefabUtility.SaveAsPrefabAsset.html)：覆盖时按 GameObject 名称匹配；同名对象或同类型多组件不可预测。StartAssetEditing 批次中即使保存成功也可返回 null。本轮将“查 success/日志，导入后回读，不盲建副本”写进 safe-edit。[一手]
- [Unity 6.3 Awaitable introduction](https://docs.unity3d.com/6000.3/Documentation/Manual/async-awaitable-introduction.html)：Awaitable 池化，不能重复等待同一实例；它不应按可共享 Task 的约定重写。模板统一所有权，不统一底层 API 语义。[一手＋研究]
- [UE 5.8 FStreamableHandle](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/FStreamableHandle)：除 CancelHandle/ReleaseHandle 区别外，本轮补读到 GetLoadedCount 把失败资产也计为 loaded；HasLoadCompleted 可以早于延迟完成回调，失败资产仍为 null。因此 UE 模板另要求核结果资产齐全，完成标志和计数不是成功证明。[一手＋研究]

### 延用已完成研究，不能冒充本轮实测

- [WP9](2026-10-14-game-wp9-engine-handoff.md)：官方 Sprite Smart 空间匹配、Interchange 覆盖策略、Coplay 移动返回边界支持“源身份/目标身份/语义分别检查”。并非所有同名导入都会失败，不禁用成熟 importer；无法唯一映射时才停止自动替换。[研究]
- [WP10](2026-10-14-game-wp10-client-modules.md)：固定 UniTask 取消/池复用路径、UE-207209、Input System Disable 重入、旧档语义支持新增的生命周期判断。业务 generation guard 不能修复库内错结果；官方 issue 的目标修复版不代表已发布修复。模板不全面禁用 UniTask，不把平台所有版本判为有缺陷。[研究]
- [WP11](2026-10-14-game-wp11-gameplay-architecture.md)：定义/实例、GAS Commit/End、事件重复提交、旧档 ID 支持具体状态契约；同一份定义生成两个实例，只改一个，不应污染另一个。这里只借边界，不搬整个 Chop Chop/Lyra 或自建技能框架。[研究]

## 3. 验证范围和撤回条件

[研究] 文本契约只能减少上下文歧义。下一阶段应在目标项目做“重生成且重排子资产”和“蓄力可打断且检查点重开”的第二次修改，观察真实引用、取消结果身份、每次获取释放、两实例隔离、旧档进度/奖励。若重复已有项目约定，则删去重复模板项并指向已有实现；适配器版本修复经目标引擎验证后，可简化相应警示。没有 Agent 对照运行，不主张成功率、性能或工时改善。

- 历史初稿：五文件对照和三页官方契约；待项目决定退款／暂停时钟、旧档回退、玩法和设备
- 历史检查：完整离线 14 阶段（非空无 skip）、`git diff --check`、新增页 UTF-8／空白通过；当时 AGENTS 为 86／82 行，不代表当前文件规模
- 无 Agent 对照或引擎实测，不能量化采用收益

## 4. F1 复核：入口必须按已配置能力分支

核实：2026-10-14 UTC。逐项重读 `e08dcbc` 的两端 CLAUDE、AGENTS、模板说明，以及编译/测试 Skill 和脚本实现；没有把评审意见当作事实来源。[研究]

### 新证据与修订范围

- [原 UE CLAUDE](https://github.com/dbvv1/a1dbv/blob/e08dcbc25ec2896a5faa9157e20b715381e47d7b/domains/game-dev/unreal/templates/CLAUDE.md#L7-L10)无条件要求 `unreal-mcp`、`AgentSkillToolset.ListSkills` 和 MCP Live Coding，与模板 README 中“可选接入、复制不会安装”直接冲突。`@AGENTS.md` 导入不会删除这些具体指令。[一手：仓库原文；研究：指令冲突]
- 原 Unity CLAUDE 将三个 Skill、Unity CLI 运行时观测列为固定操作，文档查询举例也未给插件缺失时的分支；两端 AGENTS 命令表没有区分“示例文件存在”与“项目真实可用”。已改为先确认现有入口，已采用的 Skill 才使用；缺 Skill 沿用项目命令，缺验证结果仍报告未验证。[一手：本地前后文本；研究]
- 顺着 UE 编译调用链发现既有 [ue-build Skill](../../domains/game-dev/unreal/templates/.claude/skills/ue-build/SKILL.md)也在函数体分支无条件要求 MCP。因此同步补该文档的前提与无 MCP 分支；否则只改顶层仍会重新读到冲突指令。`build.sh` 的退出码 3 提示仍含 MCP 名称，Skill 明确它不是能力探测或安装要求，没有相应入口就请用户关闭编辑器后走既有完整构建。[一手：脚本/Skill 对照；研究]
- 重新读取 [Epic Live Coding 官方说明](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-live-coding-to-recompile-unreal-engine-applications-at-runtime)：引擎/IDE 自身即有调用入口，并非依赖 MCP。本文保留更保守的项目边界：只有函数体改动且现有入口可用时才用 Live Coding；头文件、反射、新类/模块仍关闭编辑器后完整构建，不把官方对象重实例能力当作放宽模板边界的理由。[一手＋经验]

本次改动是 Unity README、两端 CLAUDE/AGENTS、既有 ue-build Skill 六个文档，以及本记录与 [WP9 §7](2026-10-14-game-wp9-engine-handoff.md#7-f1-复核把接口选择落实到-unity-入口)的复核追加。没有修改脚本、权限配置、Hook、MCP 配置或安装流程。[研究]

### 两种配置的只读走查

假设修改任务分别需要代码编译/逻辑测试和资产操作；只读取文件、跟随条件分支，不调用任何引擎接口。模板使用者须填入现有项目命令，以下并非对空 TODO 可执行性的承诺。[研究]

| 引擎与已有配置 | 编译与测试分支 | 资产与运行时验证分支 | 判定 |
|---|---|---|---|
| Unity：已接入 MCP；不假定同时有 CLI | 用实际暴露的编译/Test Runner 工具或已有脚本；`--editor` 仅在 CLI/Pipeline 确实可用时选；测试脚本不用于已打开同项目的编辑器 | 用既有 MCP/Editor API 并回读；没有 CLI 时用已有状态进度/测试证据，不强行调用 `unity status` | 指令链一致，不为 MCP 场景另装 CLI/LSP |
| Unity：仅已有 Editor 脚本、编译/测试入口 | 沿用项目命令；已采用模板时，`.sln` + dotnet 仅作快检，编辑器关闭后可通过现有引擎走 batchmode；编辑器开着且无可调用入口时请用户关闭后再验证 | 用已有 Editor 脚本；缺安全资产入口停写，缺运行时观测标未验证；不通过 YAML 或新安装绕过 | 能做部分继续；必要操作缺失是明确阻塞，不被解释为必须安装 MCP |
| Unreal：已接入 MCP；不假定所有 toolset 存在 | 函数体 + 现有支持 Live Coding 的入口才用；缺该工具时走已有 UBT，必要时请用户关闭编辑器；头文件/反射仍完整构建 | MCP 使用实际签名并串行、存盘、回读；`ListSkills` 仅暴露时调用，不以缺该工具阻塞其他现有能力 | MCP 存在不再推出 ListSkills/Live Coding 必然存在 |
| Unreal：仅已有 Editor Python、UBT/测试入口 | 跳过 MCP、ListSkills；用已有构建/Automation 入口；已采用 ue-build 的退出码 3 分支也可走关闭编辑器后的完整构建 | 已有 Editor Python 保持相同资产禁区、存盘和回读要求；没有运行时接口就用已有测试并报告观测缺口 | 无 MCP 分支完整，不要求安装官方插件或新工具集 |

反向检查：两端仍要求代码编译与逻辑测试；Unity `.meta`/序列化资产和 UE 二进制资产禁区未因接口缺失放宽；配置、依赖和受保护操作仍须确认。原试玩接口段改为只填写现有工具，没有接口可删除占位节而不要求新建框架。沿用现有 reviewer 可选策略，不把本次修订扩成配置层。[研究]

[研究] 历史 F1 检查：完整离线 14 阶段，测试 97／26／10／13／14 项、非空无 skip，`git diff --check` 通过。仅确认所走查静态分支一致，不证明引擎／原生 OS 行为或全部来源已补核。

## 5. P32：原生入口、拆借模板还是整套游戏管线

**默认保留原生 Agent＋现有工程；新建 Phaser 原型可拆借模板，暂不把专用管线当完整游戏工厂。** 2026-10-20 重新核对的证据支持借用生命周期、资产单写者和同 build 验证，但不足以证明整套接入比同模型、同预算的原生入口更省事。Unity／Unreal 项目不因浏览器游戏分数而迁移引擎。本节交付资料采用／撤回包，不是已运行的游戏或二次修改成果。[源码／作者报告／研究]

### 5.1 三路选择与 AI 的实际边界

- **原生入口**：默认沿当前工程构建、资产键与测试，AI 实现派生玩法；人定体验与放行，缺观察补窄接口。
- **拆借模板**：仅在引擎／类型相符时采用；AI 补接线，人核合法资产、测试与版本。需要大改基类或补缺成本超过收益，就退回现有工程。
- **整套管线**：反复出现资产写冲突、陈旧证据误放行才候选；先借窄机制，供应商与维护成本超过收益时不整套接入。

**AI 承担比例、节省工时与二改成功率未知。** 本轮只读源码／作者报告，未安装或运行模型／引擎；离线检查不能证明制作效果。[研究]

### 5.2 OpenGame：能借生命周期，不能照目录说明当现成游戏

**固定版本确有可复用的基础逻辑，但仍需要完成资产和关卡接线。** 核对 [OpenGame c9bea377](https://github.com/leigest519/OpenGame/tree/c9bea37786af524bf3bbe802f2b67d23816fa5c0/agent-test/templates) 的完整公开树：core 使用 Phaser 3.90.0；`main.ts` 注册 Preloader、标题与 UI，具体关卡仍待接入；`LevelManager` 默认首关为 `Level1Scene`。注册 key、关卡构造 key 和顺序表必须一致，改其中一处不等于完成关卡交付。[源码]

**资产生成阶段不能省略或被 README 中的目录示意替代。** [Preloader](https://github.com/leigest519/OpenGame/blob/c9bea37786af524bf3bbe802f2b67d23816fa5c0/agent-test/templates/core/src/scenes/Preloader.ts) 实际加载 `assets/asset-pack.json`，但公开 templates 树没有该文件或 `animations.json`；platformer 文档声称随带空 animations 文件，与树不一致。这不证明整个生成流程无法产出它们，只说明拷贝模板不是完整可运行资产包。[源码／研究]

**二改应优先落在派生关卡，而非重写底层生命周期。** [BaseLevelScene](https://github.com/leigest519/OpenGame/blob/c9bea37786af524bf3bbe802f2b67d23816fa5c0/agent-test/templates/modules/platformer/src/scenes/BaseLevelScene.ts) 实现重置、前置 hook、地图、对象组、装饰／玩家／敌人、摄像机／输入、碰撞、UI 和后置 hook；[_TemplateLevel](https://github.com/leigest519/OpenGame/blob/c9bea37786af524bf3bbe802f2b67d23816fa5c0/agent-test/templates/modules/platformer/src/scenes/_TemplateLevel.ts) 仍含地图／贴图键占位、敌人示例注释和玩家占位实现。保留基类不是禁止修 bug，而是先确认改动属于内容还是共享机制。[源码／研究]

**测试命令存在不代表已有玩法回归。** core 配置了 Vitest，但本次公开模板树没有 `.test`／`.spec` 测试实体；[测试 helper](https://github.com/leigest519/OpenGame/blob/c9bea37786af524bf3bbe802f2b67d23816fa5c0/agent-test/templates/core/src/test/helpers/phaser.ts) 提供 HEADLESS、禁音频与场景推进辅助，不能验证视觉和音频质量。生成提示词要求 build／test，仍不是这些命令已执行的回执。[源码]

**复用前另核组件许可。** 仓库根 LICENSE 为 Apache-2.0，core README 末尾却写 MIT，模板树未见独立 LICENSE；本轮仅分析，不提取分发。不能用根代码许可推定生成素材权利，或把说明不一致解释为全部可按 MIT 再分发。[源码：[根许可](https://github.com/leigest519/OpenGame/blob/c9bea37786af524bf3bbe802f2b67d23816fa5c0/LICENSE)、[core README](https://github.com/leigest519/OpenGame/blob/c9bea37786af524bf3bbe802f2b67d23816fa5c0/agent-test/templates/core/README.md)]

**官方最小模板是更小的起点，不是同版本替换件。** [Phaser template-vite-ts d1d7d58a](https://github.com/phaserjs/template-vite-ts/tree/d1d7d58acfcf47f97642bcb8b4967071b85f8db9) 有 bg／logo 及启动→菜单→Game→GameOver 接线，Game 仍是占位，无测试脚本；实际依赖 Phaser 4.0.0，与 OpenGame 3.90.0 不同。默认 dev／build 调用日志脚本，另有 nolog 入口，本轮均未执行。代码 MIT 不替代资产权利检查，也不能混用版本后把差异归因于 Agent。[源码／研究]

### 5.3 GCA：采用证据绑定机制，不把配置通过当全面放行

**先拆借单写者资产收敛机制，而不是照搬整套多 Agent 流程。** [GCA ac0f18b9 的 SKILL](https://github.com/Tencent/Game-Creation-Agents/blob/ac0f18b9e3a362f4171e2b7d48c3337a0bdcf824/.claude/skills/game-pipeline/SKILL.md) 规定场景串行、素材并行后 join，这是 Agent 操作契约；实际 [finalize_asset_manifest](https://github.com/Tencent/Game-Creation-Agents/blob/ac0f18b9e3a362f4171e2b7d48c3337a0bdcf824/gca-mcp/src/gca_mcp/tools/asset_tools.py#L2141-L2475) 才是持锁核静态资产尺寸／hash／来源 sidecar 后原子更新 manifest 的代码。文字编排不等于已有自动调度器；记录 provenance 也不等于法律权利已核实。[源码／研究]

**同 build 证据链可以防陈旧报告，但不能封印整个运行环境。** [digest 实现](https://github.com/Tencent/Game-Creation-Agents/blob/ac0f18b9e3a362f4171e2b7d48c3337a0bdcf824/gca-mcp/src/gca_mcp/evidence.py#L912-L989) 覆盖入口、GDD、manifest 引用素材／metadata／sidecar、src／levels／design／tests／inputs 和配置；[验证实现](https://github.com/Tencent/Game-Creation-Agents/blob/ac0f18b9e3a362f4171e2b7d48c3337a0bdcf824/gca-mcp/src/gca_mcp/tools/verify_tools.py#L2656) 绑定 pipeline／build／verify 身份、URL 与运行回执，并有 checkpoint。改构建须重验证；依赖环境和覆盖之外的文件不能仅凭 digest 推断未变。[源码]

**默认视觉服务失败允许警告放行，不能把 ready_to_ship 翻译成视觉已通过。** [配置](https://github.com/Tencent/Game-Creation-Agents/blob/ac0f18b9e3a362f4171e2b7d48c3337a0bdcf824/gca.config.yaml#L45-L82) 的 `unavailable_policy: warn` 以及非必需 stress，与 [release gate](https://github.com/Tencent/Game-Creation-Agents/blob/ac0f18b9e3a362f4171e2b7d48c3337a0bdcf824/gca-mcp/src/gca_mcp/runners/verify/gates/verify.mjs#L869-L1080) 的证据新鲜度检查是两回事。接入者须读取降级项、未覆盖项和实际报告，而不只取一个布尔状态；原有输入、画面、音频、性能和真人检查仍适用。[源码／研究]

**完整接入会新增运行与维护成本。** MCP／hooks 适配、Python／Node／浏览器／ffmpeg、manifest/schema、运行埋点及回执生命周期都要维护；生成路线另依赖供应商接口资格与额度。代码／skills 的 Apache-2.0、内含 Phaser Skills 的 MIT 不授权模型或素材；配置注明可选 RMBG-2.0 的非商用限制，默认 color-key 不需该模型。这里不安装、不申请接口，也不从源码可见推定真实采用效果。[源码：[配置与依赖](https://github.com/Tencent/Game-Creation-Agents/tree/ac0f18b9e3a362f4171e2b7d48c3337a0bdcf824)、[许可](https://github.com/Tencent/Game-Creation-Agents/blob/ac0f18b9e3a362f4171e2b7d48c3337a0bdcf824/LICENSE)]

### 5.4 分数不能代替接管成本与二改证据

**OpenGame 的结果支持研究结构约束，不足以量化接入收益。** 作者用 150 个提示、每项三个种子，主结果平均有效运行，管线错误另计；固定 Sonnet 4.6 的消融支持其组件有作用，但不是“原生 Agent＋同模板＋相同预算”的接管成本实验。生成时调试也不是交付后新增需求的回归验证。[作者报告：[实验](https://arxiv.org/html/2604.18394v1#S4)]

**GCA 的评审分母是筛选后的产物与评分，不能写成独立生成成功率。** 作者从 32 项中取双方产物和测试覆盖满足条件的 20 项，40 份产物各三次形成最终 120 次有效评分；另六次早期 Solitaire 测量因解析缺陷排除，由有效运行替代，不从 120 中扣除。统一评分条件不等于生成模型／token／时间预算匹配；作者的外部评估流程也不等于第三方复现。[作者报告：[评估](https://arxiv.org/html/2610.16776v1#S5)]

**同模型对照也要付出更多预算，且任务形态不同。** [GameForge 固定报告](https://github.com/AlbusChen/GameForge-Harness/blob/7c2e63f374621d935349edca47f7c880c8b3d6a6/docs/gamedevbench-full332-evaluation-2026-08-21.md) 用同 GPT-5.6-Sol medium、同 Godot／评估器，在预先剔除 gold 校验失败的一项后，报告 213／332 对 184／332，同时平均 token 多 52.8%、solver 时间多 33.3%。这是作者本地报告，不是本仓重跑或净提效证明；[GameDevBench](https://github.com/waynchi/gamedevbench) 的既有 Godot 工程修改，不能与从零生成 Phaser 游戏直接横排。[作者报告／研究]

### 5.5 可接手的二改边界与撤回

**先保留已经认可的版本，再用一次明确新需求检查复用是否真省事。** 以 OpenGame 派生关卡“新增第二关并改变一种敌人”为后续验证设计：保留首关、基类和共享行为；改派生关卡／敌人配置及合法资产键，逐一核对 main 注册、构造 key、LEVEL_ORDER 和动画键。新增需求若必须改变共享生命周期，先列受影响旧关卡，不把改基类隐去为普通内容修改。[研究：设计，尚无产物]

**验收同时看新需求和旧体验。** 需留下同版本的构建／测试实体与结果、首关和第二关进入／结束／重开、标题往返与 UI 清理、资产引用、连续画面／听验以及目标玩家反馈；其中 HEADLESS 只承担可覆盖的规则。沿用原项目的输入、存档、取消、实例隔离、目标设备检查，不因本例只加关卡而删除总入口仍适用的检查。缺资产或测试就标缺项，不补造成功记录。[研究]

**同需求、模型与预算下总成本可接受，才扩大采用。** 计接入、重试、人工核对、维护和二改成本；供应商降级、合法资产不足或旧行为退化时撤回整套管线，保留有效窄机制。本次无真实二改或 hosted CI 效果证据。[研究]

### 5.6 从同build证据，推进到真实路径与旧需求保留

**同build还须证明玩家经过了关键路径。** 测试场景可准备合法前置条件，不能直接设出待验动作的结果。状态接口须连接可见游戏的同一份状态，实际输入、运行痕迹与画面／音频核对，而不是让生成代码自行返回“成功”。[固定Armor Alley契约](https://github.com/areal-project/GameASG-Bench/blob/6427cb6517ce11ff350ec45fcae17b67c5aec245/task/armor-alley/tdd.md)禁止测试平行状态；[真实指针用例](https://github.com/areal-project/GameASG-Bench/blob/6427cb6517ce11ff350ec45fcae17b67c5aec245/tests/armor-alley/checks.js#L345-L377)通过浏览器输入检查方向，但仍读自报snapshot，不证明全面防伪。这是借用GameASG的接口设计，不要求照抄四个方法或另造试玩平台；仍保§5.5及02总入口适用的通用检查。[研究，依据见最高水平卡]

**持续改进、累积新需求和旧功能保留，不是同一个证据。** GameXpert的17条六轮链沿自己的上一版继续，但所有要求在最终版评；轮次与内容混杂，不能推出逐轮保留率。Play2Code的后续轮次默认不重做资产生成，故其试玩提升不能直接证明换资产后的身份／风格保留；试玩者与最终裁判隔离值得借用，不能据此让试玩者自己宣布放行。[作者报告：上述两论文；研究]

**保留版本规则也可能允许退步。** RSIGame只比较双方重放都展示的条件，候选的原任务部分归一化分数可下降不超过0.05；这不是每条旧行为零回归。对读者明确要求保留的首关、旧档或资产身份，应单独列不可退步条件，不能让美术总分上涨抵消它们。[作者报告：[采用规则](https://arxiv.org/html/2609.39045v1#A3.SS2)；研究]

**可交接的是同一作品的整条二改验收，不是新机制清单。** 沿用§5.5示例，下面为尚未执行的设计：[研究]

| 版本／需求 | 必须留下的产物与判断 |
|---|---|
| B0已认可 | 冻结工程／合法资产及引用；保进入→完成或失败→重开→标题的动作轨迹与状态／画面／音频；列原有输入、取消、实例、旧档和目标设备条件，不把基线已有缺陷算新回归 |
| B1加内容 | 第二关＋一种敌人及动作／音频接线；从B0接着改，分别验证新关可达、首关及共享行为仍成立；只加载第二关不算验收 |
| B2改需求 | 从B1改变该敌人的预警／打断，并替换对应动作和音效；先写允许改变的规则、必须保留的身份和旧关行为，再做差异；不重新生成整工程 |
| B2放行 | 新需求逐项满足，B0／B1仍适用条件逐项复验；运行中的动作与资产反馈一致。未触达或仅接口自报的条目标缺观察，不以总分通过；人决定预警是否清楚、节奏是否值得采用 |

**GUI失败先分原因，再决定改游戏还是改测试。** Play2Code保留了操作延迟与平台跳跃难度无法区分的例子，不将每个低分都算游戏坏了；其GPT-5.4同骨干、随机10%任务抽样估算约17美元／游戏，对照OpenGame约12美元，不是实时价格或本仓成本。资源、重试、人工判定和维护必须计入选择。[作者报告：[附录C／E](https://arxiv.org/html/2605.28258v2#A5)；研究]

**先借判据，不因有代码就整套接入。** [RSIGame固定README](https://github.com/WenyiWU0111/RSIGame/blob/1214b342fce22e97fe19bfc56be189d06f44634b/README.md)要求另接打补丁的GameCraft-Bench、OpenGame分支与运行依赖；默认`live=false`跑满预算后分析停止点，不能记为实际早停省费。README现已链接表中基线／评分版本，旧coming soon文字不能再解释为基线全未公开；未核完整逐轮可重建链，不把终版下载等同二改复现。[一手：README；研究]

**可用性与最高水平分别判断。** GameXpert[固定公开树](https://github.com/Kwen-Chen/GameXpert-Bench/tree/90d41e31d0c97c13981e65c3ba4a76a3c82add53)仍是发布骨架，本文不把论文协议写成可直接运行的工具。GameASG提供可读任务／测试，但其逐次重开协议不是本表的继承链。[一手／研究]

本单元改变的是§5.5的接手验收：新增需求、保留条件、真实路径和缺失观察分开交付。Agent可写／维护回归、整理差异与复现步骤；没有真实二改运行，不能给承担比例或节省工时。总投入超过收益或旧玩法／身份退化时，回到已认可版本并定向修补，不为追逐评分迁移管线。[研究]

## 6. P53：探索发现与修复验收分账

**选择：保现有测试，把已确认发现固化为旧策略／动作回归；撤回“再次探索未报错即可放行”。** 本轮最高水平卡的问题是生产中的发现→人工归因→修复→下一轮验收。工业领先候选为EA RAID，LLM工业参照为较早的TITAN，独立制作可行例为Deckhand；没有同题完整链与成本比较，最高水平仍未知。既有引擎测试、脚本和人工试玩作主流参照，不声称采用率；本仓推荐为可行层。[研究]

### 决定性证据与条件

- **EA／Florian Fuchs等，RAID，2026-07-08 v1**：[§IV-C／V](https://arxiv.org/html/2607.07498v1#S4.SS3)。NHL26旧预发行版，SAC强化学习而非LLM；团队规模／引擎未披露。开发团队判断策略是否属于漏洞；六条匹配人工已知漏洞，不是新发现六个。4090＋Threadripper PRO7975WX上，30轮48小时、10轮14小时。修后重搜或旧policy失效均不足以证明修复，仍由试玩者模仿旧策略核验。公开论文／视频不是可接入工具包；不默认自建RL。[作者报告]
- **Meeka Interactive／Deckhand，2026-08-08**：[作者复盘](https://itch.io/devlog/1621363/the-harness-came-first-how-this-game-came-to-be.amp)。Godot＋Claude Code，作者裁决及真人试玩；具体模型、团队规模和费用未知。参数错误曾使测试点到(0,0)却报成功，制造假阻塞，后来补测试器validator。作者用同seed／动作校验浏览器与模拟状态，并分别测确定性和批次隔离；发现经裁决转测试或保留决定。秒级浏览器／毫秒级模拟为自报，非总成本。[作品页](https://meeka-interactive.itch.io/deckhand)列HTML5 alpha及deckhand-alpha-dacbd82.zip，未下载运行；无公开源码／逐次回执核验，文件名不是已核SHA。[作者报告／一手页面]
- **Chengjia Wang／NetEase Fuxi等，TITAN，2025-09-26 v1**：[§3.5／4／6](https://arxiv.org/html/2509.22170v1)。GPT-4o在两款匿名商业MMORPG评估，作者称部署八条QA管线；团队规模、引擎和持续修复回执缺失。30% false alarm主要来自状态抽象适配，报告供人工审阅。它已超近一年窗口约一个月、非当前模型，只保留适配／分诊机制参照，不升级为当前最优或采用率。[作者报告]
- **Second Chance，2026-08-22**：[复盘](https://secondchancegame.com/devlog/2026-08-22-playtest-with-an-agent-reading-every-frame)。单人UE5.8 Blueprint、Claude Code Opus5、双MCP、RTX5060 8GB；人玩、Agent读帧，三次误诊被引擎回读推翻。该篇明确尚未修复，不能补写回归通过；它支持观察与根因分开，不证明自动试玩闭环。[作者报告]

**采用边界：先校验测试器，再改游戏。** 保存动作／拒绝原因／状态与版本；人确认预期后，Agent可写对应回归。脚本无法保留时序或真实输入，就留运行时／人工复验，不为可重放另造游戏逻辑。算入适配、推理／训练、误报排查及维护，成本超过收益则退回既有回归与真人探索。没有承担比例、净省时或本仓效果实测。[研究]

### P51使用回执与来源冻结

采用[提示词](../collaboration/prompts/2026-10-21-exploration-self-use.md)的cbbb996版本；基线cda12a9。2026-10-21 11:33:08 UTC开始，11:33:37检索前冻结，11:35:08后冻结证据；墙钟约两分钟，等待／独立复核未单独计量。先按Riot／Ubisoft／EA／King找作者材料，再追失败机制；没有发现更完整闭环，不等于这些团队未采用。[研究]

直接查验N=9、相关正文F=7（7/9）；决定性D=5、FD=5（上列RAID、Deckhand复盘与作品页、TITAN、Second Chance）。另两份已读为[SMART v1](https://arxiv.org/html/2512.12706v1)及[Second Chance索引](https://secondchancegame.com/devlog/)：前者模拟增量任务不是发行修复链，后者仅核近期活动。两份读取不足为[Meeka主页](https://meeka-interactive.itch.io/)（薄页面）与[RAID视频](https://www.youtube.com/watch?v=59JllQFV9I0)（仅确认官方出口跳转，未读视频内容）；无访问拒绝。未打开搜索线索不混入直接查验分母。[研究]

本轮来源均为自主新发现；GameXpert／Play2Code／RSIGame、Unity AI／Insight、Epic插件、Roblox MCP、VoidExplorer／Crossword Dungeon、Supergiant／Cronin、Last Pirate与Sanctuary为输入已知，不重计新发现。独立参照尚未冻结，漏检率无可计算分母。未安装、运行引擎或模型；既有G02审计只作选题输入，不能当冻结后的盲测。[研究]

## 7. 自动反馈何时转真人：整页验证选择校准

**默认：先核操作器与观察，再决定是否追加独立试玩；评分分歧先对齐问项。** 本卡在2026-10-22（UTC+8）复用校准审计线索并阅读三篇原文相应章节；不重复搜索或运行模型。主流采用率、完整品质闭环最优方案未知；近期领先候选如下，推荐为有比较依据的可行组合，不是排行榜。[研究]

| 最高水平候选、日期与任务 | 决定性比较／反例 | 转化与成本边界 |
|---|---|---|
| Huang等[Play2Code v2](https://arxiv.org/html/2605.28258v2)，2026-10-02，GUI试玩驱动至多五轮游戏修订；主实验有GPT-5.4／Sonnet4.6／KimiK2.5 | H从200任务事后筛出50个moderate-gain任务，5名有软件／休闲游戏经验的研究生，每任务一人；真人自由反馈后期rubric成绩更高。C.3的50条人工检查轨迹有46条成功，但漏小控件与操作时序也会造成假失败 | 基础复现保GUI；细微交互和低增益追加定向真人观察。H不证明所有任务／模型均需真人；真人总投入未报告，不能用既有自动调用成本推算节省 |
| Wu等[RSIGame](https://arxiv.org/html/2609.39045v1)，2026-09-30，C.3／F.2六款收敛游戏的独立director简报；模型director为Claude Opus5 | 人／模型／无简报分支从同一检查点比较。AlleyBrawlers暴露原闭环未解决的不可胜问题；BlockCascade对照也达到相同分数，仅较晚。第二份简报分支与后续开发passes均从stage1 champion出发，不能串成一条累计收益链 | 保留champion后补目标／优先事项／保留条件，避免总分掩盖玩法缺陷。director上限60动作、2次重置；不推出人人优于模型，人工和维护总成本未知 |
| Cai等[Spec2Game](https://arxiv.org/html/2610.04253)，2026-10-03，§4–5的小型Pygame开环生成；文本／视觉裁判为Qwen3-235B-A22B-2507／Qwen3-VL-235B-A22B-Instruct | 人工复核涉及585项目；D2相关性N243、D4 N295。D4问项覆盖对齐后Spearman由.564到.692（同295）；呈现维度明确不测乐趣。它没有运行反馈修订链 | 分开启动、规格、下一动作可理解与乐趣；先对齐问项再换裁判。不把相关性当人类替代或迁移到引擎二改；人工总投入未知 |

**整页保留理由。** 规则用可确定的预期；运行时核同一可见状态；输入、焦点、取消走实际路由；存档、重启和热会话按风险分验；视听看连续过程，性能和设备查目标环境。这些问题不是三篇生成评分实验的替代对象。已有RAID等探索／修复比较和GameXpert等需求保留比较继续有效，GUI反馈与独立裁判也不合成同一个自评者。[研究]

**未覆盖而不冒领效果。** 长期乐趣、完整外设延迟、所有目标设备与总维护成本仍未知；本卡不据此否定条件采用，也不降低项目验收要求。若反馈缺新信息或投入不值，就撤回新增回路，保留有效回归和原型期真人试玩。与公开作者实验、源码证据分开：本仓没有进行模型／引擎／玩家实验。[研究]
