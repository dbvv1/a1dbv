主线：二／三／四；游戏 G1/G2 的历史覆盖盘点
改变的建议：[研究] 继承已做摸底，优先补授权、2D 与成套一致性判断；以下缺口和 WP 排序属于基线，不代表当前未交付事项
新证据：[一手] 基线 f3726c673db57b1b6c24003503a01b28a516448d 的 38 文件及 BACKLOG 对照；仅仓库覆盖证据，无模型效果或引擎实测，现行推进按长期计划

# WP0：游戏方向盘点与缺口归属

> 历史盘点：2026-10-14（UTC+8），以下保留实施前基线的缺口、依赖与检查。现行协作和验收按 [长期计划](../collaboration/LONG-TERM-PLAN.md)，不沿用当时的“待云端评审”门槛。原依据为 [任务书](../collaboration/game-taskbook.md)、[方向锚点](../../AGENTS.md)和 [BACKLOG 游戏方向](BACKLOG.md#游戏开发方向)。**[一手：仓库文件；研究：覆盖判断]**

## 1. 会改变什么决定

**✅ 采用既有摸底作为起点，先补授权与资产生产判断，不再从工具名单起步。** 基线的 12 个领域入口/专题页面已有引擎、编译、验证和基础知识；另有 26 个模板文件，但完整的零手修资源分档建议、跨资源成套生产和从概念到发布的质量线尚未成形。BACKLOG 已把具体候选、固定 SHA、许可提醒、真实采用证据不足和可验证行为列出来，下一轮应补这些判断所缺的证据，而不是重复统计项目。**[研究：以下逐页映射；“已有”不表示已验收]**

本轮对 README 的实质修订：

- 研究起点明确为单人程序员、没有美术和音频人员；“美术把关风格”改为程序员验收并选择、重生成或程序化调整
- 保留已有引擎与验证入口，新增覆盖全部 14 个 WP 的现有/缺口/优先级表
- 将 WP1 作为资产 WP 待评审前的持续授权门槛；资源有限时优先 WP2 与 WP8，其余按任务书依赖并行；BACKLOG 的提前实测建议服从新任务书“后续阶段暂不执行”
- 保留旧引擎版本的核实日期，不把本次盘点日期包装成官方版本重核

**不采用的做法**：先建齐 assets/ 与 04–06 的空壳、继续新增泛化工具榜、把现有案例和模板模拟回归记作“零手修商用已通过”。现有证据更适合支持条件化建议，不能替代同任务资产质量或主动工时测量。**[研究：任务书依赖与证据边界]**

## 2. 逐页盘点

以下路径相对 `domains/game-dev/`，固定于实施前基线；全部只读。后续 WP 已补内容须读对应记录，不能以本表判定其当前仍未交付。**[一手：本仓库；研究：WP 归属]**

### 2.1 领域与引擎页面：12 页

| 页面 | 已有内容，可继承什么 | WP 归属与尚缺判断 |
|---|---|---|
| [README.md](../../domains/game-dev/README.md) | 环节全景、资产/源码区别、引擎入口 | WP0/12；原无完整工作包缺口表，“美术把关”人员假设与新基准冲突，本轮修正 |
| [01-engine-integration.md](../../domains/game-dev/01-engine-integration.md) | Editor API 默认路径、GUID/fileID、二进制资产边界；Unity/Unreal/Roblox/Blender 接入对照 | WP9；批量导入、稳定命名、替换/回退和目标版本重核不足；不重写已核资产格式边界 |
| [02-verification-and-playtesting.md](../../domains/game-dev/02-verification-and-playtesting.md) | L0–L6、状态/输入/时间/fixture 接口、作者试玩案例、人判断手感 | WP10/11/12；按具体模块落验收行为；旧“最关键”与能力绝对化表述待相应 WP 依据校准，不把案例推广为普遍效果 |
| [03-generative-ai-in-games.md](../../domains/game-dev/03-generative-ai-in-games.md) | 隔离/来源/规格与有损处理分开、缺陷分流、静态与动画分开；运行时 AI 与外部约束 | WP1–8；尚缺全资源授权、质量/性价比/本地免费三档和成套生产；运行时 AI 仅在玩法需要时保留，不据此新增路线 |
| [unity/README.md](../../domains/game-dev/unity/README.md) | 工具链/大型项目/基础/模板导航及编译、帧推进警告 | WP9/13；旧一页纸默认叠加插件/LSP，后续按任务需要和实际版本复核 |
| [unity/01-toolchain.md](../../domains/game-dev/unity/01-toolchain.md) | CLI、官方 Skill、Unity AI/社区 MCP 的条件与失败表现 | WP9；继承来源入口，不把 2026-10-05 的版本、价格、数量视作新核；需连到具体导入替换任务 |
| [unity/02-large-project-guide.md](../../domains/game-dev/unity/02-large-project-guide.md) | 工程禁区、编译/测试/Play、版本控制、性能输入和项目约定 | WP9/10/13；大型项目默认流程要按单人规模缩减；资源所有权、存档迁移等跨模块验收未展开 |
| [unity/03-engine-fundamentals.md](../../domains/game-dev/unity/03-engine-fundamentals.md) | 生命周期、序列化、资源、渲染、输入/UI、性能、测试与 Agent 错误提示 | WP10/11；知识地图不是模块最低配置；缺动画、物理、音频、存档、本地化/发布的完整取舍及成熟例子的适配判断 |
| [unreal/README.md](../../domains/game-dev/unreal/README.md) | MCP/C++/编译与打包试玩导航、Unity 对照 | WP9/13；同一问题作 Unreal 对照，不为了并列覆盖而复制 Unity 研究；版本需另核 |
| [unreal/01-toolchain.md](../../domains/game-dev/unreal/01-toolchain.md) | MCP/工具搜索、Python/C++、插件、实验性与无认证边界 | WP9；缺 Interchange 与重生成替换契约；引擎官方状态、API、版本与费用不能由本次盘点确认 |
| [unreal/02-large-project-guide.md](../../domains/game-dev/unreal/02-large-project-guide.md) | 二进制资产、Live Coding/UBT、测试、PIE/打包、性能与权限 | WP9/10/13；从“能编译/能调用”延伸到引用和跨模块行为，收窄面向大型团队的默认结构 |
| [unreal/03-engine-fundamentals.md](../../domains/game-dev/unreal/03-engine-fundamentals.md) | Gameplay Framework、反射/GC、GAS/StateTree、网络、资源/渲染 | WP10/11；GAS、ECS/大世界等需要单人项目采用条件；相机、关卡、事件/战斗架构及版本固定样例尚缺 |

### 2.2 模板里的 Markdown：14 页

模板是供其他项目复制的示例，不是当前会话指令或已安装配置。表中“有”只陈述文件内容。**[一手：模板原文]**

| 页面 | 已有内容 | WP13 后续使用边界 |
|---|---|---|
| [unity/templates/README.md](../../domains/game-dev/unity/templates/README.md) | 空目录复制/非空手动合并、安全范围与模拟测试声明 | 保留不覆盖既有配置、安装另授权、模拟不等于真引擎 |
| [unity/templates/AGENTS.md](../../domains/game-dev/unity/templates/AGENTS.md) | 版本/渲染管线/包、试玩 TODO、GUID 与序列化约束 | 按 G1/G2 结论补目标设备、来源与资源替换规则；本轮不编辑 |
| [unity/templates/CLAUDE.md](../../domains/game-dev/unity/templates/CLAUDE.md) | 编译/测试、安全编辑、按需评审、帧推进 | 与具体项目可用接口匹配，不默认有模板中的能力 |
| [unity/templates/.claude/agents/unity-code-reviewer.md](../../domains/game-dev/unity/templates/.claude/agents/unity-code-reviewer.md) | 生命周期、序列化、取消、静态状态、架构评审 | 可承接 WP10 的跨模块契约，但静态评审不替代运行 |
| [unity/templates/.claude/agents/unity-perf-auditor.md](../../domains/game-dev/unity/templates/.claude/agents/unity-perf-auditor.md) | GC/查找、池化、材质、资源释放疑点 | 已声明需 Profiler；后续按设备预算补具体输入 |
| [unity/templates/.claude/skills/unity-compile-check/SKILL.md](../../domains/game-dev/unity/templates/.claude/skills/unity-compile-check/SKILL.md) | editor/dotnet/batch 选择、Safe Mode、过时 csproj | 保留“快速检查不等于最终 Unity 编译” |
| [unity/templates/.claude/skills/unity-run-tests/SKILL.md](../../domains/game-dev/unity/templates/.claude/skills/unity-run-tests/SKILL.md) | EditMode/PlayMode、报告解析与异常 | 新模块需真实测试内容，已有入口不代表已有资产测试 |
| [unity/templates/.claude/skills/unity-safe-edit/SKILL.md](../../domains/game-dev/unity/templates/.claude/skills/unity-safe-edit/SKILL.md) | Editor API/脚本/标量补丁、移动 meta、字段迁移 | 01 的“经项目验证的受限例外”比这里条件更完整，WP13 应对齐；本轮不扩大直改许可 |
| [unreal/templates/README.md](../../domains/game-dev/unreal/templates/README.md) | 模板合并、Hook 边界、依赖与假引擎测试说明 | 同 Unity；不能把 bash 示例视作 Windows/UE 已验证 |
| [unreal/templates/AGENTS.md](../../domains/game-dev/unreal/templates/AGENTS.md) | 模块、API 来源、编译方式、二进制禁区、试玩 TODO | 由 WP10/11 决定必要结构，网络/GAS 等不因模板存在就启用 |
| [unreal/templates/CLAUDE.md](../../domains/game-dev/unreal/templates/CLAUDE.md) | 工具发现、串行、PIE、编译、按需评审 | 用 WP9 核实的版本/能力替换假设，不把插件默认存在当事实 |
| [unreal/templates/.claude/agents/ue-code-reviewer.md](../../domains/game-dev/unreal/templates/.claude/agents/ue-code-reviewer.md) | GC/反射、异步、网络、热路径与模块 | 后续增加项目真正涉及的行为契约，避免为单机默认扩大网络范围 |
| [unreal/templates/.claude/skills/ue-build/SKILL.md](../../domains/game-dev/unreal/templates/.claude/skills/ue-build/SKILL.md) | Live Coding/完整编译、退出码、UHT/链接问题 | 只提供执行入口，非引擎兼容保证 |
| [unreal/templates/.claude/skills/ue-run-tests/SKILL.md](../../domains/game-dev/unreal/templates/.claude/skills/ue-run-tests/SKILL.md) | 测试过滤、报告、纯逻辑/World 测试取舍 | 要和模块及发行目标对齐，不能只凭有报告说玩法可用 |

### 2.3 配置与脚本：12 个文件

以下路径仍相对 `domains/game-dev/`；全部属于 WP13，命令与解析也涉及 WP9。脚本本轮没有修改。**[一手：配置/源码阅读；非运行结果]**

| 文件 | 现有内容及可继承边界 |
|---|---|
| `unity/templates/.claude/settings.json` | generic 权限基线、Unity 查询/编译/测试放行与编辑 Hook |
| `unity/templates/.claude/protected-paths.txt` | GUID/meta 禁写、序列化资产/项目设置确认；按首条匹配 |
| `unity/templates/.claude/hooks/protect-paths.sh` | JSON 解析、路径词法规范化、ask/deny；不覆盖 Bash/MCP，不是沙箱 |
| `unity/templates/.claude/skills/unity-compile-check/scripts/compile_check.sh` | 三档编译分流、日志提取、环境/锁判断 |
| `unity/templates/.claude/skills/unity-run-tests/scripts/run_tests.sh` | CLI/原生进程与 NUnit 报告联合判断，清旧报告、拒绝零测试/未完成 |
| `unity/templates/.mcp.json.example` | Context7/GitHub 配置示例；不自动安装或证明 Unity 连接 |
| `unreal/templates/.claude/settings.json` | generic 基线、UE 编译/测试放行与 Hook |
| `unreal/templates/.claude/protected-paths.txt` | 二进制资产/生成目录禁写、配置与第三方确认 |
| `unreal/templates/.claude/hooks/protect-paths.sh` | 与 Unity Hook 字节一致，本轮以 cmp 确认；只证明文件相同 |
| `unreal/templates/.claude/skills/ue-build/scripts/build.sh` | 查找项目/引擎、分平台 UBT、Live Coding 冲突与错误归类 |
| `unreal/templates/.claude/skills/ue-run-tests/scripts/run_tests.sh` | 新报告与进程联合判断、JSON 结构/重复字段/未完成验证 |
| `unreal/templates/.mcp.json.example` | 回环地址的 UE MCP 示例；不代表已启用或可达 |

盘点数：12 个正文/入口 + 14 个模板 Markdown + 12 个配置/脚本 = 38 个文件；模板总计 26 个。未发现 `assets/`、`04-client-modules.md`、`05-gameplay-architecture.md`、`06-indie-roadmap.md`。这只是基线文件覆盖计数，不是研究质量或通过率。**[研究：文件清单核对]**

## 3. 吸收已做摸底，不重复调查

下表全部继承 [BACKLOG 游戏段](BACKLOG.md#游戏开发方向)已有固定 SHA 与调查边界；WP0 没有重新访问上游、核实最新版本或许可证。列出对象是为确定后续增量归属，不是新推荐榜。后续 WP 须核对其需要的版本/条款变化、补商业对照和直接产物，最终用“采用/改造/不用”回答具体需求。**[一手：已有调查记录；研究：去重映射]**

| 承接 WP | 继承的摸底与既有证据 | 下一增量，避免重做什么 |
|---|---|---|
| WP1 | 各候选代码许可、Hunyuan/HY-Motion 地域与 Output、GVHMR/TangoFlux 非商用、LTX 营收条件、Steam 原文未重读的明确缺口 | 补三层授权与商业服务/套餐、平台原文，不把代码许可代替模型与资产权利 |
| WP2/8 | Qwen-Image 不同路径与多图编辑边界；ComfyUI/官方 workflow；固定视角/有限配色是待证条件 | 不重复“有哪些图像模型”；补参考/控制方法、逐帧与静态区别、成套一致性及三档采用条件 |
| WP3 | TRELLIS.2 导出预算/透明提示；Hunyuan3D 的商用门槛；既有网格处理记录 | 不重复能导出 GLB 的发现；判断从源资产到道具/角色所缺步骤与不可程序修补的失败 |
| WP4 | SkinTokens 批量/已有骨架/后处理入口；HY-Motion、GVHMR 限制；既有锁骨重定向案例 | 分清绑定、动作生成和重定向，补首尾/脚滑/root motion、2D 路线与商用可选方案 |
| WP5 | Material Maker 参数/导出 profile 回退；TRELLIS.2 texturing；Effekseer 及 Unity 集成/采用线索 | 不把支持导出等同 PBR 一致、不把采用页等同零手修；补生成与程序化、原生效果与 flipbook 的选择 |
| WP6 | jsfxr 参数化声音、TangoFlux 权利限制、ACE-Step 音乐、Qwen3-TTS 声音克隆边界 | 分音效/音乐/配音，补商业方案、循环/状态与改台词一致性，不重述演示速度宣传 |
| WP7 | Wan2.2、LTX 路径；烘焙视频重制成本与可跳过状态问题 | 先与引擎内镜头/静态图比较是否需要，再考虑质量档位，不因有视频模型就安排过场 |
| WP9 | 既有 Editor API 与格式边界研究；Unity/Unreal 工具来源 | 只补批量导入、规格/命名/替换契约与目标版本；不重做“专用 Agent 接口非必需”调查 |
| WP10 | UniTask/Awaitable、Addressables-Sample、Input System、ink/The Intercept、性能预算候选 | 按生命周期/存档/暂停/设备预算组织模块；旧样例与游戏采用缺口保留，不把库契约当模型出错频率 |
| WP11 | UnityHFSM、ink、The Intercept、已停止开发的 Chop Chop | 比较小组件与整套底座，补单人适配、游戏循环/事件/相机/关卡；Lyra 尚需后续按任务核实，不说已摸底 |
| WP12/13 | 2D 小资产二次修改试验设计、现有模板与模拟检查 | WP12 可先搭有内容的骨架，待其余 WP 后定稿；WP13 依赖 WP9–11；试验登记不授予提前引擎/模型运行，也不增加新的测评平台 |

既有 [资产边界记录](2026-10-13-game-asset-editing-boundary.md)中的 Unity 官方表述冲突、trellis2mlx 源码、corosolto GLB 确定性计算、2D 角色回退/静态肖像采用应直接引用。WP0 只核对其在正文和工作包中的位置，没有重新运行、取得新视觉评价或补全缺失的原始/淘汰资产。**[研究：继承证据的界限]**

## 4. 优先级、并行依赖与停止边界

[研究] 历史依赖：WP0 后 WP1、WP2–7、WP9–11 可并行；资产 WP 待评审前补 WP1 授权。WP8 在 WP2 初稿后开始、待 2D／3D 结论定稿；WP12 骨架无依赖、定稿依赖其余 WP；WP13 依赖 WP9–11。资源有限时先 WP2／8，再 WP3／4／6／5／7，这是取舍而非硬依赖；当前排期以长期计划为准。

- 历史组织约束：资产详情先在 03 形成可用建议，再按任务书授权拆页；WP5／6 各保留一份研究记录，同题追加
- 新增 04／05 须给“做到哪、可省什么、AI 风险、怎样验证”，06 不预建空壳
- 引擎、模型、垂直切片及成本实测留给后续授权；本盘点不授权提前执行

**反证与剩余问题**：现有材料并非空白，也并非全部过时；资产编辑、局部返工和静态/动画用途已有具体建议，WP0 没有撤回它们。另一方面，已有模板数量不能证明 G2 已完成，固定 SHA 的开源摸底不能证明商业分档或成套资产质量；诸多官方版本、命令和二手效果表述仍须在对应 WP 用一手资料重核。**[研究：避免两种误读]**

## 5. 实际检查与交付状态

- 历史盘点：逐页核对基线、任务书与 BACKLOG；两个 Hook 的 `cmp` 字节一致，38 项与 14 个 WP 对应、相对链接存在
- 历史检查：完整 `python3 scripts/check_offline.py` 14 阶段及 `git diff --check` 通过；当时未取得云端评审，不能反写为已取得，现行验收按长期计划
- 未运行：模型、引擎、外部项目或资产生成；覆盖计数和离线检查不证明质量／成本／hosted CI
- 延续原则：新增候选先补授权行，已有来源足够时不追加同义记录
