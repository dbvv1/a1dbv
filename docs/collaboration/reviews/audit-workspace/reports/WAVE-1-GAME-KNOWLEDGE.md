# Wave 1 审计报告：游戏知识与 AI 制作链

## 1. 元数据
- 波次／席位：Wave 1／W1-GAME
- 审计者：GPT 专业聊天 02（独立只读审计）
- 仓库：dbvv1/a1dbv
- main 基线：07b43c50057e5367fc902214e0ec8a2b2a01e396（2026-11-04 10:11:12 UTC，本轮读取到的最新提交）
- 日期：2026-11-04（UTC+8）
- 边界：只读；未修改生产代码、正式规范或 main。报告在独立分支提交。

## 2. 总体判断与成熟度

**总体判断：方向和知识架构已经成形，明显强于普通工具清单／教程型知识库；但“单人开发者借助 AI，从概念到可发布游戏”的关键承诺，尚未由一条真实引擎端到端生产链证明。** 当前最扎实的是玩法／模拟层、网页案例验证、资产源与二改边界研究、质量验收思想；最薄弱的是 Unity／Unreal 原生工作流实际采用、AI 生成资产进入真实引擎后的可编辑性与质量，以及完整作品的目标设备和玩家体验证据。

| 子领域 | 当前判断 | 证据与边界 |
|---|---|---|
| 方向、路线图 | 可用，结构较强 | 单人程序、无人工美术修补、许可先行、第二次需求修改等约束明确；路线图不等于整条路线实证。 |
| 游戏核心模块 | 可用；部分网页案例证实 | 固定步长、模拟与渲染分离、技能／AI／存档有实现和回归记录；不能外推为原生引擎能力。 |
| 资产制作链 | 研究较深，采用成熟度不均 | 2D 有源结构与二改研究；AI 生成 3D 尚未进入作品；动画生成未形成完整采用；材质画面未验；音频听感待人工验收。 |
| 引擎与 Agent 接入 | 文档可用，前沿差距待复核 | 已有 Unity 优先、Unreal 对照和 Editor API／MCP；Unity 官方 Agent 插件／CLI MCP、Unreal 5.8 官方实验 MCP 应逐项映射并实测。 |
| Skills／模板 | 可用，执行规格较好 | 内容生产、质量验收 Skill 已覆盖清单、许可、归一、固定机位、盲评；尚未证明能在原生引擎中稳定重复执行。 |
| 案例反哺 | 部分成立 | FPS、MOBA、Star-Rush 有真实仓库、测试、部署和局部采用证据；仍有硬件画面、音频、手感和完整体验未验项。 |

建议保留 README 的“案例证实（网页）／可用／研究中”分层，并进一步区分**网页案例证实**与**原生引擎证实**，避免读者误把模块机制可用理解为引擎制作链已验证。

## 3. 证据与审计范围

已读取：AGENTS.md、CLAUDE.md、docs/collaboration/game-taskbook.md、TASKS.md、inbox.md、domains/game-dev/README.md、06-indie-roadmap.md、03-generative-ai-in-games.md、04-client-modules.md、05-gameplay-architecture.md、08-level-design-and-encounters.md、2D／3D／材质／动画／音频专题、game-content-production 与 game-quality-pass Skills、质量标准及 2D 研究记录。

本轮为仓库文档和公开来源静态审阅；没有运行案例仓库、Unity／Unreal 编辑器、生成模型、Blender GUI 或真实 GPU 工作流，也没有进行新的真人试玩、画面盲评或音频试听。报告不把仓库记录中的既有测试描述成我本轮亲自执行。

### 外部强参照（2026-11-04 核对）
1. **Unity 官方 Agent 工作流已进入引擎正式产品入口。** Unity 6.3 文档列出 Editor 内 AI Assistant／Generators，官方提供面向 Claude Code、Codex、Grok 的插件，以及 Unity CLI／MCP 接入。应核对现有 Unity 主线是否完整覆盖这些官方路径。[Unity 6.3 Unity AI](https://docs.unity.com/en-us/engine/6000.3/manual/unity-ai)；[Unity AI 总览](https://docs.unity.com/en-us/ai)；[Unity 官方插件与 CLI/MCP](https://unity.com/features/ai)。
2. **Unreal MCP 有 Epic 官方 5.8 文档，但仍是 Experimental。** MCP 在编辑器进程内运行，默认仅本机连接、无认证层；工具调用在 Game Thread 串行执行，并依赖 AllToolsets。应作为实验性接入，不作为稳定生产默认。[Epic Unreal MCP](https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor)；[Epic：PCG 与 LLM 工作流](https://dev.epicgames.com/documentation/unreal-engine/working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine)。
3. **AI 生成 3D 的首稿速度不等于资产可编辑和引擎可用。** 2026 年一项场景对照研究报告 Hunyuan 辅助流程首稿更快，但生成场景存在高三角面数、碎片化 UV、材质编辑限制、摆放穿插和减面后纹理损失。支持将拓扑、UV、材质、碰撞、LOD、引擎导入和二改列为硬验收。[Begemann & Hutson, 2026, Prompted Props, Human Pipelines](https://doi.org/10.55677/ijhrsss/15-2026-Vol03I06)。
4. **生成工作流的可复现性正在产品化。** Comfy API 将工作流、节点、模型、LoRA、Python 依赖和 ComfyUI 版本打包为不可变 Build，再通过 Release／Deployment 发布；可作为配方版本锁定的参照，但不证明美术质量或商业许可。[Comfy API](https://support.comfy.org/articles/2703236295-comfy-api-deploy-your-comfyui-workflow-as-an-api)；[Workflow API 格式](https://github.com/Comfy-Org/docs/blob/main/development/api-development/workflow-api-format.mdx)。

## 4. 关键发现

### F1 — 最大差距是缺少经原生引擎验证的完整 AI 制作闭环（最高优先级）
README 标明 AI 生成 3D 尚未进作品；材质旁置已接但画面未验；动画生成和视频尚未进入作品；三案仍有硬件画面、音频、手感和完整体验待验。路线图也明确网页案例不能证明编辑器／场景序列化、导入设置、动画状态机、材质光照、引擎物理、构建与剖析。

读者能得到丰富的“应该怎么做”，却无法确认一名程序员能否用现有 Agent＋Skill 把生成资源导入 Unity、修改第二版、保持引用和风格、在目标设备运行并达到可发布标准。应优先完成一个小而完整的原生引擎垂直切片，而非继续扩展工具清单。先盘点现有暂停的 Unity 源准备、三案内容接入和待人工验收，避免重复开卡。

### F2 — Unity 官方 Agent 接入有潜在版本／覆盖缺口；Unreal 应明确标实验性质
仓库已有引擎接入、Unity／Unreal 子目录和 Editor API／MCP 说明；官方 Unity 入口已包括 CLI、Agent 插件和 Unity 6.3 Editor AI。Epic Unreal MCP 5.8 则是实验特性，存在本机无认证、Game Thread 串行等限制。建议逐项对照 01-engine-integration.md、unity/、unreal/ 的版本、能力、权限／连接边界和可复现入口，只补实际缺失，不另建平行专题。

### F3 — AI 资产链的“来源与修改边界”研究较好，但实际引擎消费证据薄
2D 专题详细区分源结构、图集、动作、地形连接和二改；3D 专题明确 AI 生成资产未进入作品；材质、音频、动画分别保留画面／听感／动作未验项。建议只选一个小资产族，固定源、模型、配方、许可、导入设置和目标设备，完成导入、材质／碰撞／LOD、Prefab、运行时消费和第二次修改。失败即回退，不以生成数量或首稿视觉评分代替验收。

### F4 — 案例双向流动机制是优势，但测试／部署容易被误读成品质通过
README 已区分部署与画面／听感／盲评通过，TASKS 列有未验项；game-taskbook 规定旁置发布、回放一致、整局 smoke、同机位图和盲评。建议不新建仪表盘，沿用现有 quality／TASKS，把证据层级明确区分为源码／单测、无画面模拟、浏览器／软件渲染、硬件引擎画面、人工体验。只在现有记录不足以区分时补字段。

### F5 — 制作配方的复现与资产溯源应成为统一生产契约
现有 Skills 已要求来源与许可、可重跑归一脚本、固定机位、模型／版本和输出记录；Comfy API 展示了工作流、依赖和模型版本打包。建议先在现有 game-content-production Skill 中验证最小 manifest：输入源与权利、工具／模型／版本、参数／seed、依赖锁、处理脚本版本、输出 hash、目标引擎／导入设置、验收记录。只有真实二改证明缺少这些信息导致复现失败，再推广。

## 5. 已有成果处理建议

| 处理 | 内容 | 理由 |
|---|---|---|
| 保留 | 单人程序、无人工美术修补、许可先行、先玩法后资产、第二次需求修改 | 防止把生成成功包装成可发布生产能力。 |
| 保留 | G1／G2、模块地图、路线图、研究记录与专题正文分工 | 方向、决策和证据各有归属。 |
| 保留 | 网页模拟层与原生引擎验证边界 | 不把网页玩法证据冒充编辑器／渲染／发布证据。 |
| 修复 | Unity 官方 CLI、MCP、Agent 插件和 Editor AI 的版本化映射 | 官方工作流已演进，核对后补实际差异。 |
| 修复 | Unreal MCP 实验状态、安全限制和监督式工作流 | Epic 明确标 Experimental。 |
| 合并 | 资产生成、归一、许可、复现和引擎导入共同字段 | 先在现有 Skill 验证最小 manifest，不新建平行管线。 |
| 暂缓 | 仅按工具热度扩充候选、没有引擎消费或二改证据的“采用”结论 | 不能提高读者生产能力，保留为未试候选即可。 |

## 6. 任务候选（已对照 TASKS／inbox，均未接受或派发）

| ID | 优先级 | 候选目标与写入范围 | 验收标准 | 依赖／风险 |
|---|---|---|---|---|
| GAME-W1-01 | P0 | 盘点现有 Unity 源准备、内容接入和三案验收，选定一个原生引擎垂直切片；写入现有 TASKS/local-jobs，不另建任务系统 | 同一切片完成 Agent 改动、引擎导入、构建、运行、第二次需求修改；保存前后证据和失败回退 | 复用现有任务；需本机 Unity 环境。 |
| GAME-W1-02 | P1 | 对照并补齐 Unity 官方 CLI／MCP／Agent 插件／Editor AI 的现有接入页 | 固定 Unity 版本，完成一项真实 Editor 操作、保存重开、构建与回归；写明能力和权限边界 | 先核正文是否已覆盖；避免重复 Unity 源准备任务。 |
| GAME-W1-03 | P1 | 在 Unreal 接入页标注 5.8 MCP 实验边界并做窄任务试用 | 明确本机连接、无认证、串行调用、插件依赖；完成一次可撤回的编辑器任务及失败记录 | 不作为生产默认；与 Unity 主线相比优先级较低。 |
| GAME-W1-04 | P1 | 在现有 game-content-production Skill 试做单资产族 manifest | 在另一机器／干净环境复跑同一资产；核对权利、版本、参数、输出 hash、导入设置和二改结果 | 先用现有 3D 内容卡；不要先建设通用资产平台。 |
| GAME-W1-05 | P1 | 统一三案例当前验收证据层级，补齐最影响玩家体验的未验项 | 每案能区分测试、浏览器、硬件画面、真人体验；现有待人工验收有明确证据回执 | 复用现有 TASKS／quality；不新建仪表盘。 |

去重说明：TASKS 已有 Unity 源准备暂停项、三案内容接入、固定机位出图／smoke、音频试听和案例人工验收；以上候选优先要求盘点、复用或补验，不应复制成平行任务。TASKS 当前 B 工作线仍在推进三案与内容／模块任务，本报告未更改其状态。

## 7. 未验证事项与证据缺口
- 本轮未运行 Unity／Unreal、Blender、生成模型、真实 GPU 或案例工程。
- 未对当前 Unity／Unreal 接入正文逐段完成官方文档版本差异审计；F2 是待核缺口，不是已证实的正文错误。
- 未进行玩家试玩、画面盲评、音频试听或目标设备性能测量。
- 2026 3D 资产研究为单一场景比较，不构成工具全榜或所有资产类型结论。
- 未测最小 manifest 的跨机器复现收益；F5 是有依据的候选方向，不是已证实缺陷。

## 8. 下一次审计触发条件
- 一个原生 Unity／Unreal 垂直切片完成第二次需求修改后，复核引擎导入、可编辑性、画面／性能和总返工成本。
- Unity／Unreal 官方 Agent 接入出现稳定版、权限或 API 变化。
- AI 生成资产首次进入任一案例默认内容，并完成目标设备和人工质量验收。
- 任一案例完成关键人工试玩／盲评／音频验收，或现有任务状态出现实质变化。

---
本报告是证据与候选建议，不代表 Dot-B 已接受任务；只有责任人接受后，才进入现有 TASKS/local-jobs。
