主线：G1 引擎资产接入；主线三“第二次修改仍可靠”
改变的建议：01/unity/unreal 从接口接通转为复用导入器、明确覆盖策略、验证语义身份；源层级联动与引擎组件保留分别选，解耦后显式同步；撤回旧 Unity AI MCP 并列推荐
新证据：2026-10-22（UTC+8）补整页八组选择、内嵌宿主、依赖批次与旧序列化状态、修改后画面及恢复范围（§15）；整页独立复评登记差距1，无引擎／模型实测；此前补构建引用链与消费者查询的语义反例；2026-10-21补代码—资产影响范围同题比较与索引负结果边界（§14），无引擎／模型实测；2026-10-20补同作赛道源／共享定义／九图消费者与两轮继承包（§13），仅静态核对；2026-10-20（UTC+8）补旧骨骼FBX跨导入器二改的路由回退、原用户有限回执及5.7旧入口反例（§4.3）；2026-10-17（UTC+8） 补 Unity 官方同源 FBX 前后对照／6.3 解包合同与 UE5.8 FBX Scene 层级重建边界（§3.2／4.2）；补核 Spine 用户材质删除、固定修复与同用户回执，区分保护用户资产与自动同步（§3.6）；2026-10-16 UTC 补核 FBX 显式 clip 列表与新增 take 脱节、固定参考源码及 UUM-130850 仅新增通知的修复（§3.5）；同日补核 Unity 6.3 批量暂停、嵌套释放、单项返回与导入回调契约及既有固定源码（§12）；2026-10-15 UTC 补核 UnityGLTF 跨资产 remap 冷导入失败、固定修复及 2.22.0 标签（§3.4）；§11 官方安装／最少工具集、UnrealClaude 固定版本和双层权限及作者兼容答复；§10 官方 Pipeline 失联／桌面截图回退、beta.13 异步结果修复与 Coplay 固定测试作业实现；§9 不同作者的迁移代价与官方观测入口对照；§8 Assistant 2.20.0-pre.2 的版本前提、生成／替换边界及逐 job 计费

# WP9：第二次重生成应更新哪一个资产

## 当前结论摘要（2026-10-22）

- **✅ 接收完整编译批次与旧组件当前值，不只接收源码补丁**；互引新脚本不逐文件硬闯预检，已序列化字段须另行迁移、保留非目标覆盖。新增整页比较与第三方桥厂商自测复盘见§15。[研究]
- **✅ 修改版本、保存重开、恢复引用与新画面分别核对**；revision／preview／恢复计划是能力候选，不是换桥理由；恢复actor不等于恢复其全部消费者。§15保当前最佳未知，整页主要选择比较后登记差距1。[研究]

- **✅ 改共享资产前用已有查询列消费者，反复追踪才评估索引**；零结果不当未使用，建库、刷新和核漏计入成本。§14比较近期候选，最佳未知，不据资料自动调低差距分。[研究]

- **✅ 整组地图二改交源／派生／共享定义与全部消费者的继承包**；显式覆盖、导航／圈进度及旧记录分验。§13新增固定同作链与九图静态复算，不代表游戏运行通过（2026-10-20补）。[研究]

- **✅ 源结构仍是权威时保留联动；引擎组件结构是权威时接受显式迁移成本**。稳定外层不代表内部不再跟随源层级；解耦也不代表新网格／节点自动接好。Unity／UE 的具体选择见 §3.2／4.2。[一手／研究]

- **✅ 用户材质被删，先恢复并查 importer 的清理责任**；重绑引用不能恢复实体，保护自定义列表可能要求手动同步 atlas 页，见 §3.6。[一手／社区／经验]

- **✅ Unity FBX 保留旧 clip 设置与发现新动作分开验收**；只补预期新条目，不整体重置列表；Fixed 通知不等于自动合并，见 §3.5。[一手／经验]

- **✅ Unity 批量写入后再消费新资产**；scope 内不依赖完整导入结果，最外层释放后核相关资产；逐项失败与异常分别检查，不把批量控制当原子回滚，见 §12。[一手／经验]

- **✅ 安装／配置／执行／验收分开**；先核已有入口，按缺口补组件，UnrealClaude 不外推 UE 5.5／5.6，脚本审批不代表宿主全局审批，见 §11。[一手／研究]

- **✅ 官方 Unity CLI／MCP 按客户端能力选，不当故障回退**；同一 Pipeline 未加载时先修复目标工程，异步启动与桌面截图回退都不算验收通过，见 §10。[一手／研究]
- **✅ 已有工程不为 Agent 熟悉度或文本格式迁移引擎**；先补所需状态读取与验证。三位开发者的迁移记录及官方接口反证见 §9，不构成模型能力排名。[一手／研究]
- **✅ 复用已有 importer／Editor API**；只在缺连接时补 CLI／MCP，不默认安装全栈。身份、子资产语义和下游行为分开验收。[经验]
- Unity 官方旧 AI Assistant MCP 已弃用；`unity mcp` 仍支持。所查 Coplay 同名导入只新增，move 返回值存在源码层潜在误报，均未实测。[一手／研究：§1–2]
- **🧪 原生生成器只作小批原型对照**。现核 Assistant 2.20.0-pre.2；安装要求 6000.0.76f1、6.3 或更新，3D 限简单单部件且不含绑定／动画。[一手：§8]
- Promote 是当前资产替换入口，Object Picker 是新建并赋到原字段；二者都不证明 GUID／fileID、pivot 和旧使用点完整稳定。[一手／研究：§8.2]
- **👀 商业生产须另过 Unity 点击条款、具体供应商／模型、输入权利与渠道门槛**；输出归用户不等于生产资格。Personal 试用转 US$10/月，批量 job 逐个扣 credits，不外推全部套餐。[一手／研究：§8.3–8.4]
- 理论结论已可采用；账户点击文本留到执行前核验。没有安装、付费、引擎／模型实测或用户电脑操作，不主张合格率或节省工时。[研究]

初始契约核实于 2026-10-13 UTC，生成器补核于 2026-10-14 UTC。已有[资产编辑边界](2026-10-13-game-asset-editing-boundary.md)维护 Editor API／YAML／.meta 的一般原则；本记录维护具体替换行为及其反证。质量档不按 MCP 价格排序：本地 API＋复用规则可不调用 LLM，模型／引擎／分发费用另计。[研究／经验]

## 1. Unity 官方入口：撤回旧 MCP 并列推荐

### 1.1 当前契约

[官方迁移说明](https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli)明确：`com.unity.ai.assistant` 中的 in-Editor MCP server 已弃用；`unity mcp` 使用 Pipeline，是替代路线且继续支持。能执行 shell 的 Agent 可直接用 `unity command` / `unity eval`，不能可靠执行 shell 时选 MCP。运行中编辑器接入要求 Unity 6.0 LTS+；CLI 可本地离线驱动，免费，不需 Unity AI 订阅。若同时保留 AI Assistant，官方注明 2.13+ 修复与 CLI 的冲突。[一手]

[CLI release notes](https://docs.unity.com/en-us/unity-cli/release-notes)当前顶部是 **2026-10-07，1.0.0-beta.13**；现有 Unity 页写“目前最新 beta.12”需修。不要把“始终更新最新”写成重导入质量保证，项目应记录 CLI、Pipeline、Editor、Importer 版本后受控更新。[一手＋经验]

[当前官方 FAQ](https://unity.com/features/ai)将 CLI/MCP/插件列为免费，Assistant 消耗点数；付费不代表二次替换更可靠。[一手＋经验]

### 1.2 官方技能仍不能识别“这一格代表谁”

固定 [Unity-Technologies/unity-agent-plugin@cf6b2da24e424b0a60d560a57f39f676cb6f79f3](https://github.com/Unity-Technologies/unity-agent-plugin/tree/cf6b2da24e424b0a60d560a57f39f676cb6f79f3)，提交日期 2026-10-06。[sprite-editor 技能](https://github.com/Unity-Technologies/unity-agent-plugin/blob/cf6b2da24e424b0a60d560a57f39f676cb6f79f3/skills/sprite-editor/SKILL.md)要求 capability checks，经 ISpriteEditorDataProvider 修改，编辑器不可达就停；它的不用 AssetPostprocessor 是该一次性 snippet 技能的局部选择，不是引擎禁令。[一手＋研究]

[GenerateNewSpriteRects.cs L73–112、L133–145、L157–197](https://github.com/Unity-Technologies/unity-agent-plugin/blob/cf6b2da24e424b0a60d560a57f39f676cb6f79f3/skills/sprite-editor/scripts/GenerateNewSpriteRects.cs#L73-L112)表明：

- Smart 按矩形重叠找旧 SpriteRect，修改 rect 后复用它；bestFit 也是几何重叠比，不是动作／道具语义匹配。
- Safe 留下旧表，只加不重叠的新矩形；适合受限追加，不会自动理解替换后内容。
- DeleteAll 创建新 SpriteRect，不应当作已被场景、Tile、clip 引用资产的默认二次操作。

**采用边界**：原布局原语义、仅替换同格像素时，可以复用机制；若 attack 与 idle 对调格子，重叠位置没变，保留旧对象仍可指错内容。这是源码支持的风险推论，不是已在 Unity 复现。稳定 source key／动作标签应由源数据提供，无法证明对应关系时要求明确映射，不让 Agent 猜。[经验]

许可：[固定 LICENSE.md](https://github.com/Unity-Technologies/unity-agent-plugin/blob/cf6b2da24e424b0a60d560a57f39f676cb6f79f3/LICENSE.md)是 Unity Companion License、Unity-dependent projects；不能标为通用 MIT 工具或把示例照搬成引擎无关商业库。[一手]

### 1.3 Aseprite源项目：复用兼容导入器，不扩大UUID保证

[官方FAQ](https://docs.unity3d.com/Packages/com.unity.2d.aseprite@3.0/manual/ImporterFAQ.html#enable-uuid-for-layers)要求源文件启用层UUID；所查[UPM公开镜像快照](https://github.com/needle-mirror/com.unity.2d.aseprite/blob/5d8b44801f295f1bc0df7dd71dfff1943ba92ffe/Editor/AsepriteImporter.cs#L552-L615)按层身份合并，但层内cell仍按序复用spriteId。[pivot合并分支](https://github.com/needle-mirror/com.unity.2d.aseprite/blob/5d8b44801f295f1bc0df7dd71dfff1943ba92ffe/Editor/AsepriteImporter.cs#L905-L978)在尺寸/布局/设置变更时重写数据，不能承诺任何插帧、重排和手调pivot都存活。镜像不是Unity官方托管；7.0.1要求6000.7.0a5，只用来查机制，不推荐为本文升级工程。许可是[Unity Companion](https://github.com/needle-mirror/com.unity.2d.aseprite/blob/5d8b44801f295f1bc0df7dd71dfff1943ba92ffe/LICENSE.md)，不是跨引擎MIT。**[一手：官方FAQ；研究：包镜像固定源码阅读，非引擎测试]**

早期[AnimationImporter](https://github.com/talecrafter/AnimationImporter/blob/d706b26638cd9ad6fb2959f9203decb2ea0ab3e8/Assets/AnimationImporter/Editor/ImportedData/ImportedAnimationSheet.cs#L274-L316)按数组位置保ID，[旧设置](https://github.com/talecrafter/AnimationImporter/blob/d706b26638cd9ad6fb2959f9203decb2ea0ab3e8/Assets/AnimationImporter/Editor/Config/PreviousImportSettings.cs#L41-L88)将第一帧pivot复制给整表；[#58使用者复验](https://github.com/talecrafter/AnimationImporter/issues/58#issuecomment-1475431233)支持一次ID修复，不证明任意重排安全。其[自定义许可](https://github.com/talecrafter/AnimationImporter/blob/d706b26638cd9ad6fb2959f9203decb2ea0ab3e8/README.md#license)限制独立销售。**[一手／社区]** 这些是此前已取得、在WP9归并的证据；推荐的是兼容已有源格式的官方能力，普通PNG无需为了导入器换格式或另装工具。**[经验]**

## 2. Coplay：新增导入不是安全替换

选两个快照避免把默认分支与稳定发布混淆：

- main：[`aa5fc638d623f56178d50329d9ad8c541a57fe66`](https://github.com/CoplayDev/unity-mcp/tree/aa5fc638d623f56178d50329d9ad8c541a57fe66)，2026-10-04，package **10.3.0**
- API 默认分支最新：[`142ea0af4890337f0ff6658df61db23982313717`](https://github.com/CoplayDev/unity-mcp/tree/142ea0af4890337f0ff6658df61db23982313717)，2026-10-08，package **10.3.1-beta.7**

package 两者均声明最低 Unity 2021.3；这是包要求，非本轮全版本兼容实测。main 的[许可](https://github.com/CoplayDev/unity-mcp/blob/aa5fc638d623f56178d50329d9ad8c541a57fe66/LICENSE)为 MIT。近期提交说明仍在维护；没有因此认定真实游戏发布闭环或二次替换已经验证。[一手＋研究]

### 2.1 import_model_file 是避免覆盖的新增路线

两个快照均有同一核心分支：[ImportModelFile.cs L24–64、L76–99](https://github.com/CoplayDev/unity-mcp/blob/aa5fc638d623f56178d50329d9ad8c541a57fe66/MCPForUnity/Editor/Tools/AssetGen/ImportModelFile.cs#L76-L99)。HandleCommand 检查本地 source 存在且后缀受支持，取 name 或源文件名，调用 StageUnderAssets；若目标文件已存在，while 循环生成 `name_1.ext`、`name_2.ext`，随后 File.Copy。所读处理器**没有 overwrite 参数／分支**。此结论只针对该工具，不针对插件所有 import 功能。[一手]

采用：同名两次调用可以各获有效 GUID，旧 Prefab 却仍引用第一件；此工具用于新增候选，不作默认更新。[经验]

另 [ManageAsset.cs L141–161](https://github.com/CoplayDev/unity-mcp/blob/aa5fc638d623f56178d50329d9ad8c541a57fe66/MCPForUnity/Editor/Tools/ManageAsset.cs#L141-L161)：`action=import` 对已知 Assets 路径调用 `AssetDatabase.ImportAsset`。它不负责写新源内容或保证子资产／自定义字段。[一手]

[ModelImportPipeline.cs](https://github.com/CoplayDev/unity-mcp/blob/aa5fc638d623f56178d50329d9ad8c541a57fe66/MCPForUnity/Editor/Services/AssetGen/Import/ModelImportPipeline.cs)会设置文件缩放、材质导入与 animationType（缺省 None），并可能自动归一化尺寸；已有单位、rig、remap 约定时不能盲接默认值。[一手＋经验]

### 2.2 源码层发现 MoveAsset 返回值潜在误报，未实测

main 与最新默认分支 [ManageAsset.cs L594–619](https://github.com/CoplayDev/unity-mcp/blob/142ea0af4890337f0ff6658df61db23982313717/MCPForUnity/Editor/Tools/ManageAsset.cs#L594-L619)都直接调用 `UnityEditor.AssetDatabase.MoveAsset`，变量名为 guid；非空就构造 SuccessResponse，空则 ErrorResponse。Unity 官方 [MoveAsset 契约](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/AssetDatabase.MoveAsset.html)恰为成功返回空字符串、失败返回错误消息。[一手；研究：契约对照]

进一步查了外围，避免只看变量名下判断：

- [Response.cs](https://github.com/CoplayDev/unity-mcp/blob/aa5fc638d623f56178d50329d9ad8c541a57fe66/MCPForUnity/Editor/Helpers/Response.cs)明确定义 ErrorResponse.Success=false，SuccessResponse.Success=true
- [TransportCommandDispatcher.cs L406–416](https://github.com/CoplayDev/unity-mcp/blob/aa5fc638d623f56178d50329d9ad8c541a57fe66/MCPForUnity/Editor/Services/Transport/TransportCommandDispatcher.cs#L406-L416)将处理器 result 放进外层 status=success，ErrorResponse 影响日志但未替它改正资产语义
- [Python manage_asset 包装](https://github.com/CoplayDev/unity-mcp/blob/aa5fc638d623f56178d50329d9ad8c541a57fe66/Server/src/services/tools/manage_asset.py)返回 transport 的 dict；所读这条路径未见重新按 old/new 路径验证后修正结果

因此只能报告**源码层潜在误报**：按官方返回契约，成功移动可能已改状态却报失败；发生在 ValidateMoveAsset 之后的非空错误也可能进入成功分支。未在 Unity/客户端复现，未向上游报告；不能称实测故障。[研究]

采用：不明确返回先按原 GUID 回查路径和引用；这两个快照的 move/rename 暂停无人值守使用，修正判定并通过目标引擎回归后再采用。[经验]

### 2.3 上游测试证明到哪

[ImportModelFileHandlerTests.cs](https://github.com/CoplayDev/unity-mcp/blob/aa5fc638d623f56178d50329d9ad8c541a57fe66/TestProjects/UnityMCPTests/Assets/Tests/EditMode/AssetGen/ImportModelFileHandlerTests.cs)有缺失源、不支持后缀、OBJ 首次导入获得 GUID、路径越界防护的真实 Editor 测试源码；所读文件没有二次同名替换、旧引用、pivot 或材质语义检查。不能据一个文件声称整个项目都没测试。本轮没运行上游。[一手＋研究]


## 3. Unity 成熟能力的复用边界

### 3.1 Presets 与 AssetPostprocessor

[官方按文件夹应用 Preset 示例](https://docs.unity3d.com/6000.0/Documentation/Manual/DefaultPresetsByFolder.html)已有初始规则与带依赖的扩展两版：父目录先应用，靠近资产的设置最后覆盖；扩展使用 DependsOnArtifact、DependsOnCustomDependency，处理 preset 新增／移除／移动，并在 domain reload 重建依赖。[一手]

采用顺序：首次规格用 Preset Manager；持续规则才加 AssetPostprocessor；规则修改影响旧资产时复用官方依赖示例，先核目标 API 兼容性。[经验]

官方 [Presets 技术文章原帖](https://discussions.unity.com/t/automate-your-asset-import-configuration-with-presets/1712640)提醒默认预设不自动作用于已有资产／仅移动目录；帖子还给出删除 .meta 的替代办法。**后者不采用到已有引用的项目**：与 [Asset metadata 契约](https://docs.unity3d.com/6000.0/Documentation/Manual/AssetMetadata.html)的身份保留要求冲突。官方教程里的便捷动作也要受当前任务不变量约束。[一手＋经验]

pivot、outline、remap 和状态机只有明确归 source/pipeline 管理时才重建；保留上次设置与应用新规范是两种要求。[经验]

### 3.2 Prefab 的官方 API 也不是任意重建无损

[SaveAsPrefabAsset](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/PrefabUtility.SaveAsPrefabAsset.html)覆盖已有 Prefab 时尝试保留引用，但按 GameObject 名称匹配；同名子对象、同物体上多个同类型组件会有不可预测匹配。batch editing 中返回 null 也不必然等于保存失败，需看 success 等结果。[一手]

采用：加载并局部更新已有 Prefab；把 gameplay 脚本、碰撞代理、握持点／脚底锚点放在稳定外层，生成 mesh/sprite 为可换的子资源。需要整体重建时保证唯一语义名称并检查外部子对象引用，不能只保住 Prefab 顶层 GUID。[经验]

**源层级的二改，另选联动或解耦。** [Unity 官方 2024-07-15 对照](https://unity.com/blog/author-scenes-and-prefabs-with-verson-control)的“FBX and prefabs”用同一模型的删除、重命名、材质和父级变更比较两条路线：Model Prefab 跟随源结构；完全解包后创建的普通 Prefab 保留自己的对象／组件，却可能留下 missing mesh、旧材质和旧父子关系。保住组件与接入新视觉是两个结果；这是作者的历史演示，不是本仓库的当前版本运行结果。[一手]

[Unity 6.3 解包合同](https://docs.unity3d.com/6000.3/Documentation/Manual/UnpackingPrefabInstances.html)进一步区分：Unpack 保留嵌套 Prefab 实例，variant 还可能成为 base Prefab 的实例；Unpack Completely 才把这些关系一并解除。这里只说明操作边界，不建议为省事把整个 gameplay 外层与所有嵌套资源全部解包。[一手／研究]

**采用／撤回：** 源驱动装饰或需要持续接收源节点增删的视觉层，先保留 Model Prefab 联动，把玩法职责留在稳定外层。引擎内复杂组件必须保留、视觉结构由程序维护时，可针对该视觉实例选择解耦并另建普通 Prefab；随后按源身份显式更新网格、材质和新节点。新源结构应自动进入游戏时，一律解包反而新增同步负担；对应关系不清或组件无法迁移时先保留旧版本，不能以“对象没消失”放行。本文补的是原稳定外层建议内部尚未确定的结构权威，不替代已有引用验收，也不承诺解包保住所有外部引用。[研究]

### 3.3 Addressables 管加载，不负责识别“同一个动作”

[Addressables 2.9.1 AssetReference 契约](https://docs.unity3d.com/Packages/com.unity.addressables@2.9/api/UnityEngine.AddressableAssets.AssetReference.html)同时有 AssetGUID、SubObjectName、SubObjectGUID（适用 SpriteAtlas）。编辑器主资产可加载，不等于运行时子资产正确。[一手]

已有远端分发需求时，[官方更新构建流程](https://docs.unity3d.com/Packages/com.unity.addressables@2.9/manual/content-update-builds-overview.html)要求保留每个平台、每个发布基线的 addressables_content_state.bin；使用内容限制检查和 Update a Previous Build。源文件重导入与对旧 Player 发布内容更新是两回事；小项目不为重生成强加 CDN。[一手＋经验]

### 3.4 UnityGLTF：材质映射设置正确，不代表冷导入结果正确

2026-10-15 UTC 核实。**✅ UnityGLTF 跨资产材质 remap 的二改验收增加干净副本全量导入，检查 Renderer 实际材质，而非只检查映射设置。** 本案例是相同源文件重建导入产物时失败；把它纳入第二次源替换的验收属于研究推论，不是已完成源替换实验。[研究／经验]

- **失败与恢复条件不同。** [#914 原始报告](https://github.com/KhronosGroup/UnityGLTF/issues/914)使用 Unity 6000.0、URP 17.3.0、UnityGLTF 2.18.5、Windows：`Settlement.glb` 将材质 remap 到 `Materials.glb` 的共享材质。初次导入正常；清除导入缓存后全量重导入，Inspector 映射仍正确，Renderer 却使用自身 GLB 的内部同名材质，贴图消失；随后仅重导入 `Settlement.glb` 又正常。因此暖缓存单文件复验不能覆盖冷导入依赖问题。这是报告者的复现记录，本轮未复现。[社区]
- **修复的是导入产物依赖。** [PR #915](https://github.com/KhronosGroup/UnityGLTF/pull/915)于 2026-09-30 合并；固定 [`41cb963` 的 GLTFImporter.cs L270–286](https://github.com/KhronosGroup/UnityGLTF/blob/41cb963dec3e76615b11db63bab9633f23496b0e/Editor/Scripts/GLTFImporter.cs#L270-L286)从 external-object remap 取得目标资产路径，排除空路径／自身后调用 `DependsOnArtifact`；[L633–651](https://github.com/KhronosGroup/UnityGLTF/blob/41cb963dec3e76615b11db63bab9633f23496b0e/Editor/Scripts/GLTFImporter.cs#L633-L651)另将映射应用到 Renderer 的 `sharedMaterials`。设置表与实际使用点是两层状态。[一手：固定源码；研究：机制归纳]
- **官方契约与采用回执。** [Unity 6.0 DependsOnArtifact](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/AssetImporters.AssetImportContext.DependsOnArtifact.html)规定依赖另一资产的导入结果；该资产改变后，依赖方在它导入后重新导入；尚未导入的依赖也会登记。[维护者审阅](https://github.com/KhronosGroup/UnityGLTF/pull/915#issuecomment-5857066989)要求不用手读 `.meta` 的初稿，改用资产数据库；[报告者回执](https://github.com/KhronosGroup/UnityGLTF/pull/915#issuecomment-5858947741)确认修改解决问题。PR 正文附修复后全量重导入截图，但只改一个生产源码文件、未附自动回归测试，不写成测试套件已通过。[一手／社区]
- **不是当前版本仍坏。** [`release/2.22.0` 对应 `8b793b8` 的 changelog](https://github.com/KhronosGroup/UnityGLTF/blob/8b793b883f8ae1dfd0f6f09bcf13e1842c000060/CHANGELOG.md#L7-L29)已将 #915 列为修复，记录日期 2026-10-02；[发布标签对象](https://api.github.com/repos/KhronosGroup/UnityGLTF/git/tags/64a3e4056a980cbdca58e569c0bed546b469692e)于 2026-10-05 创建并指向该提交。本轮也核对该版本源码包含修复；这不代表目标工程验证通过，不据此要求无条件升级。固定代码为 [MIT](https://github.com/KhronosGroup/UnityGLTF/blob/41cb963dec3e76615b11db63bab9633f23496b0e/LICENSE)，不推及 issue 示例资产的复用许可。[一手／研究]

**最小验收与停止线。** 后续获得引擎实测授权后，在保留源文件与 `.meta` 的干净副本中比较暖缓存单资产导入与全量导入的“Renderer → 材质槽 → 外部材质资产／子资产”对应；映射表看似正确但实际回落到内部材质仍失败。不要删除工作工程 `Library` 来掩盖问题，也不自建通用依赖框架；优先沿用包含修复的兼容导入器，再验目标工程。本轮仅只读证据核查，未安装、运行引擎或上游测试；不外推为所有导入器、节点重排或任意用户编辑都能保全，也不构造 Unreal 等价 API。[研究／经验]

### 3.5 FBX：保留旧 clip 设置不代表发现新增动作

2026-10-16 UTC 核实；改变 01 §5 的新增子资产验收。**✅ 保留已有 clip 调整，同时核对预期新增动作是否进入导入列表**；源 take 集合、显式 clip 列表与实际导入产物分别检查，不以旧引用正常代替新增内容完整。[经验]

- **版本文档明确保留列表的代价。** [Unity 6.3 Animation tab](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AnimationClip.html#ClipSelectionList)说明，修改 imported clip 属性后，源资产新增动画不会自动进入 clip 列表，需加入新 Source Take；[6.4 同页](https://docs.unity3d.com/6000.4/Documentation/Manual/class-AnimationClip.html#ClipSelectionList)仍有这条说明。源 take 可拆成多个裁剪 clip，不能简单要求两边数量相等。[一手；经验：验收含义]
- **固定源码区分默认与显式列表。** 既有 [UnityCsReference `0c7f0bf`，ModelImporterClipEditor.cs L303–368](https://github.com/Unity-Technologies/UnityCsReference/blob/0c7f0bfc4f9b21d3d84fffc9ee9001ad82f0fbc4/Modules/AssetPipelineEditor/ImportSettings/ModelImporterClipEditor.cs#L303-L368)按 importedTakeInfos 建默认列表，编辑时转为显式设置；[DeserializeClips L1171–1182](https://github.com/Unity-Technologies/UnityCsReference/blob/0c7f0bfc4f9b21d3d84fffc9ee9001ad82f0fbc4/Modules/AssetPipelineEditor/ImportSettings/ModelImporterClipEditor.cs#L1171-L1182)仅在显式列表为空时建立默认项。这是 6000.0.84f1 的 Inspector 参考实现，不是 6.4 修复或 native 导入器全实现；[许可](https://github.com/Unity-Technologies/UnityCsReference/blob/0c7f0bfc4f9b21d3d84fffc9ee9001ad82f0fbc4/LICENSE.md)为 Unity Reference Only，只据此解释机制，不复制成项目工具。[一手：固定源码；研究：范围]
- **真实替换记录与修复不能混读。** [UUM-130850](https://issuetracker.unity.com/issues/21902/missing-new-animations-in-clips-section-when-replacing-fbx-file-with-loop-time-enabled)记录改过 Loop Time 后替换 FBX，预期 4 clips、实际 3，新动画仍在 Source Take 下拉框；复现版本包括 6000.0.64f1、6000.3.2f1，仅测 Windows。当前状态列 6.0／6.3 Open，6.4.3f1、6.5.0b4、6.6.0a2 Fixed；但 [6000.4.3f1 release notes](https://unity.com/releases/editor/whats-new/6000.4.3f1)对该编号仅声明新增“take 未被任何 clip 使用”的 UI 通知。不能据 Fixed 推断自动补齐，更不能写全部 6.3 补丁都已复现或升级即可免验。[一手：官方复现与修复声明；研究：交叉核对]

**采用与停止线。** 沿用已有 importer，先核新增 take 与需求对应，再通过现有 Animation 面板或目标版本 Editor API 补需要的 clip，保留旧裁剪、事件与循环设置；不为发现新动作删除 `.meta`、整体重置列表或升级引擎。只要求需求内的 take 被正确使用，不自动导入所有未用 take；同一 take 的多段裁剪、重命名或对应不唯一时显式确认映射。后续获准实测时，比较“旧 clip 已调循环／事件，源文件追加动作”的前后列表、旧设置与下游引用，再验证新动作可用。[经验／研究：仅预注册]

只读官方文档、复现记录、修复说明与固定源码；未运行引擎、下载示例资产或复测修复，没有修复后使用者回执，不能保证任意 importer／引擎版本保全设置，也不把 Unity 机制映射到 Unreal。[研究]

### 3.6 Spine：先保用户材质，再查导入器清理责任

2026-10-17（UTC+8） 核实；补充 01 §5 的“修改导入规则”选择：除字段覆盖，还须确认导入器是否把用户资产当成可删除产物。[经验]

- **原始故障与回执。** [原帖](https://en.esotericsoftware.com/forum/d/28225-spine-atlas-asset-deletes-materials-when-material-content-updates)报告 Unity 6000.0.32f1、spine-unity-4.2-2024-09-12：把自建材质放入 Atlas 的 Materials 后，改 PNG 设置会删除材质实体并换回默认材质。作者先称更新仍失败，但未报新包号，且该回复在维护者宣布修复之前；随后维护者确认复现、发布修复，同一作者确认恢复。Spinebot 的导入后重绑脚本只是建议，没有用户实施或成功证据。[社区；一手：维护者复现／修复声明]
- **责任落在清理路径。** 官方 [#2793](https://github.com/EsotericSoftware/spine-runtimes/issues/2793)确认误将自定义材质视为过期产物。2025-03-24 的固定修复 [`8a250575`](https://github.com/EsotericSoftware/spine-runtimes/commit/8a25057510d7bd8dd1ebf30eb8119471dbc3ad22)把包版本 4.2.99 改为 4.2.100：旧逻辑先把旧 materials 全列为待清理，生成／复用时移除仍用的项，再用生成表替换并 DeleteAsset 删除残余；补丁检测到自定义材质时跳过列表替换及这段删除。页数与保留列表长度不符时，只警告手动更新 Materials。[一手：固定补丁及源码]
- **保护范围有限。** 固定 [AssetUtility.cs L630–782](https://github.com/EsotericSoftware/spine-runtimes/blob/8a25057510d7bd8dd1ebf30eb8119471dbc3ad22/spine-unity/Assets/Spine/Editor/spine-unity/Editor/Utility/AssetUtility.cs#L630-L782)的检测只比较第一个旧材质名称与预期默认名，不能据此保证任意混合列表或同名自定义材质安全；生成材质的循环仍会执行，也不是全导入无写入。这里只核历史修复机制，不推荐安装历史版本或承诺当前包所有路径都已安全。[研究：源码范围]

**采用与撤回。** 出现实体删除先暂停重导入、从恢复点找回资产，再核目标包是否包含适用修复与用户资产保护逻辑；不要先叠重绑脚本掩盖删除。后续获准实测时，分别验材质实体仍在、Atlas 指向正确及 atlas 页变更后的列表同步；保留用户调整并不保证新内容自动接入。未运行引擎、安装包或复测修复，不外推 Unreal；只解释机制，不复制受 [Spine Runtimes License](https://github.com/EsotericSoftware/spine-runtimes/blob/8a25057510d7bd8dd1ebf30eb8119471dbc3ad22/LICENSE)约束的实现。[经验／研究]

## 4. Unreal：显式覆盖策略，不强依赖 MCP

### 4.1 MCP 与 Python 的分工

[官方 Unreal MCP 文档](https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor?lang=zh-CN)仍标实验性、API 可能变；默认本机、无认证。MCP 提供发现／调用工具入口，实际导入仍由引擎 importer/pipeline 执行。[一手]

固定 Epic 技能 [`a6aa73ada02a9fb1f5415bec491f9942c519b297`](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin/blob/a6aa73ada02a9fb1f5415bec491f9942c519b297/skills/unreal-mcp/SKILL.md)（2026-09-17，提交说明版本 3.1.1）允许工具支持时的安全独立并发；异步工具能重叠，请求顺序不保证执行／完成顺序，依赖调用及影响同一资产／编辑器状态的修改串行。不能把“游戏线程同步 dispatch”误写成整个异步操作不会重叠，也不要将放宽规则解释为同一资产可以多 Agent 并写。[一手＋研究]

官方页面仍不建议重叠请求，与较新 Skill 口径不同；共享资产写入串行，工具明确支持才并行独立调用。[一手＋经验]

[Editor Python](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python)为成熟编辑器自动化基础；不是打包游戏 Python 运行时。已有 Python 导入脚本满足需求时不必再包装 MCP，也不必为了自动化升级引擎。[一手＋经验]

Epic 技能仓库 [LICENSE](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin/blob/a6aa73ada02a9fb1f5415bec491f9942c519b297/LICENSE)为 MIT；它不把 Unreal Engine 或引擎内所有插件重新授权为 MIT。[一手＋经验]

### 4.2 Interchange 已有的契约比 replace=true 更细

[5.8 UAssetImportTask](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Editor/UnrealEd/UAssetImportTask)分别提供 bReplaceExisting 与 bReplaceExistingSettings；DestinationName 在走 Interchange 时应由 pipeline 指定，该 task 字段被忽略。异步可先查 IsAsyncImportComplete，结果就绪后再读 GetObjects／ImportedObjectPaths；不能把“没有对话框”当导入完成。另核 [Python 5.6 AssetImportTask](https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/AssetImportTask?application_version=5.6)：直接 `get_objects()` 会阻塞到异步结果就绪，`is_async_import_complete()` 提供非阻塞查询，故不要求所有调用都先轮询；这条阻塞行为仅按所读 5.6 契约记录。[一手；2026-10-16 补核]

[5.8 FImportAssetParameters](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/InterchangeEngine/FImportAssetParameters)另有 ReimportAsset、ReimportSourceIndex、OverridePipelines、bFollowRedirectors 和完成回调。不要把不同类型的同名字段混成一份通用参数表；它自身也有 DestinationName，不应从 UAssetImportTask 的限制推论这个类型也忽略它。[一手＋研究]

[EReimportStrategyFlags](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/InterchangeCore/EReimportStrategyFlags)的三种策略直接对应所有权选择：

- ApplyNoProperties：换源数据，不重应用属性
- ApplyPipelineProperties：重应用 pipeline 指定属性
- ApplyEditorChangedProperties：应用 pipeline，但保留上次导入以来编辑器改过的属性

采用建议：纯机器拥有的参数用 pipeline 权威；程序员在引擎里调整过的资产先采用保留 editor-changed 的策略并回读。**该枚举不是任意材质／骨架变更无损合并保证**，也不能代替特定 importer 对源节点／名称的匹配。[一手＋经验]

[Interchange 当前导入说明](https://dev.epicgames.com/documentation/unreal-engine/importing-assets-using-interchange-in-unreal-engine?lang=en-US)提供现成 pipeline stack、Python 示例和材料／骨架冲突预览。优先改已有 pipeline 参数；只补项目缺失的窄步骤。该页仍把 FBX 支持标 Experimental，不能因 UE 版本较新就宣称所有格式同样生产就绪。[一手]

**FBX Scene Import 的层级重建不是上述属性枚举。** [UE5.8 FBX Scene Import](https://dev.epicgames.com/documentation/unreal-engine/fbx-scene-import-in-unreal-engine?lang=en-US)针对 Import Into Level：完整场景重导入要求输出为单个 Blueprint；该模式开启 Reimport Hierarchy 会覆盖 Blueprint Components 列表里的编辑，但保留 node graph 编辑。该页同时说明不会覆盖项目里已有的 Materials。保留图表、材料与组件层级是不同承诺，不能统一概括为“自定义修改保留”。[一手]

**条件选择：** 已有组件层级需保留时，不为更新网格而默认重建层级；需要接受新源结构时，先列出待迁移的组件修改，并验证图表仍引用正确组件。另一条选择是不重建源层级、按预期差异显式同步，代价是自己承担新增／删除节点的映射。此判断严格限该 FBX Scene 路径，不扩展为 Interchange／Datasmith 或所有 Blueprint 的行为，也不把关闭一个选项当任意引用无损保证。[研究]

**共同第二改验收：** 分别核结构、组件配置、资源引用和玩法使用点；纯网格更新与源节点改名／增删分开。Unity 官方对照支持同步与保留的代价，UE 文档提供另一管线的明确覆盖边界；本次未运行引擎、未测真实生产返工／工时，不据此宣称自动化质量提高。[研究]

### 4.3 修复链与反例，不能抹平到“最新版已好”

1. [UE-253996](https://issues.unrealengine.com/issue/UE-253996)报告 5.5 自动 import 转 reimport 后旧材料参数保留，即使调用侧设置 ApplyPipelineProperties 等也未按预期更新。状态是 **By Design**，页面另写 Target Fix 5.6；不能据“Target Fix”称已修复，更不能把报告者强行跳过 reimport 的 workaround 推荐给所有资产。[一手：官方问题记录，含用户报告]
2. [5.8 release notes](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes)仍列 reimport 时误删已有纹理、USD reimport 后旧资产仍被引用、骨骼 LOD 绑定更新等修复；这只证明维护方修复声明。本轮未读 Epic 授权引擎完整源码、未跑对应回归。[一手]

**旧骨骼二改失败：先比较导入路线，再决定是否改源资产。** 核实2026-10-20（UTC+8）；本节补的不是新Importer名单，而是避免把跨入口故障误判为美术必须重做，也避免为单一FBX绕行停掉整个Interchange插件。[研究]

- **同源二改与失败。** [UE-325794](https://issues.unrealengine.com/issue/UE-325794)复现旧入口首导骨骼资产，切Interchange后用新增骨骼的FBX重导，出现Failed to merge bones；Yes／No均未得到legacy路径的同样层级。该记录影响5.5、状态Fixed、Target Fix 5.7、修复编号46318776。它支持排查这一路径，不证明任意骨骼报错都是引擎缺陷，也不证明5.8仍有该错。[一手：官方复现／状态，非本仓运行]
- **原绕行与更小替代。** [对应原帖](https://forums.unrealengine.com/t/fbx-reimport-issue-with-interchange-framework/2665455)的5.4→5.5报告者原先禁用插件、重导、再启用，称增加迭代时间。维护方建议把 `Interchange.FeatureFlags.Import.FBX` 设false即可选legacy，不必禁整个插件；原报告者随后谨慎表示认为解决了问题。这是较窄绕行的有限使用回执，没有精确工时、完整动画复测或5.7修复版复测，不扩大成普遍成功率。[一手／用户报告]
- **回退也有失败版本。** [UE-349466](https://issues.unrealengine.com/issue/UE-349466)记录5.7中因Interchange问题而用legacy，重导同层级259骨骼FBX仍可能错乱；其临时删建Skeleton、替换引用办法也并非每次有效，不推荐照抄。状态Fixed、目标5.7.2、修复编号48869729；[2026-01-21官方5.7.2热修公告](https://forums.unrealengine.com/t/5-7-2-hotfix-released/2693914)明确列入UE-349466。说明旧入口并非永久安全基线，不能把一个历史workaround设成所有新项目默认。[一手：官方记录／发布声明]

| 当前条件 | 先选的动作 | 代价与撤回 |
|---|---|---|
| 仍受325794影响，旧资产需继续二改 | 保留资产／引用，局部回退FBX路径；先用同源修改核旧层级及新增骨骼 | 多维护一条导入路线；旧入口也失败时停止批量重导，不反复确认弹窗或破坏性重建 |
| 项目可用对应修复版本或需要Interchange能力 | 优先验证修复后的同源重导，再迁一组代表资产 | 官方Fixed不是项目验收；层级、动画／挂点、材料与调用侧引用不符时保留旧产物，继续定位 |
| 两路都不满足，或源层级本就有意改变 | 回到源结构／内容兼容需求，明确迁移范围 | 此时才决定改源、映射或缩范围；不能以路由切换替代必要美术或动画修订 |

以上是普通Skeletal Mesh FBX重导选择，不套到Import Into Level的Blueprint层级规则，不要求Unity有同名开关。原有材料／骨架冲突预览、异步完成回读、真实引用和玩法使用点验收仍全部适用。未下载附带复现资产、未读需授权的Epic引擎修复源码、未运行UE；修复编号是公开记录而非源码审查。现有证据足以选择较小绕行和补丁比较，不足以承诺新版本、legacy或Interchange之一无损。[研究：范围／验证边界]

[Redirectors](https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-redirectors-in-unreal-engine)可帮助资产移动后的引用，不能修复原路径变成另一语义资产。既有 .uasset 保持路径与对象身份，改名必须用 Editor API 并检查引用；不要把 Unity .meta GUID 规则原样套给 Unreal。[一手＋经验]

## 5. 采用／改造／不用与最小验收

| 场景 | 判断 | 最小边界 |
|---|---|---|
| Unity 6+ Agent 入口 | ✅ 官方 CLI/Pipeline；MCP 按客户端需要 | 替代弃用的包内 MCP；版本固定、回读目标工程 |
| Unity 批量导入 | ✅ Presets；🧪 小型 AssetPostprocessor | 需要持续规则才加依赖追踪，不自建管线服务 |
| Sprite / Prefab 替换 | 🧪 保留正确子资产与局部修改 | 不用位置／数组下标／重复名称充当语义身份 |
| 旧版 Unity 社区桥 | 🧪 固定版本、逐工具评估 | 不用所查 Coplay move/rename 做无人值守写入；import_model_file 只作新增 |
| Addressables | ✅ 按加载／分发需求采用 | 不把它当引用修复器，小项目不为重生成强迁移 |
| Unreal 批处理 | ✅ Editor Python；🧪 格式匹配的 Interchange | MCP 可选，替换对象与覆盖设置分开 |

以下约定放进已有资产登记／源数据／ScriptableObject 或 DataAsset，缺什么补什么，不先建服务。[经验]

1. **身份**：旧 GUID/对象路径＋稳定语义 key；Sprite/动画/材质槽有明确旧新映射。目标缺失、多候选或对应关系不唯一，停止自动覆盖。
2. **规格与归属**：记录源画布／单位／轴、PPU、pivot 坐标空间；明确哪些字段归 source/pipeline，哪些归程序员。归一化 pivot 数字不变不代表改尺寸后脚底不变；玩法挂点放稳定外层。
3. **操作**：生成输入先暂存，验规格后更新既有 source；Unity 保留正确 .meta，UE 指定已有对象／source index。新增工具产生 `_1`、结构或骨架改变时转迁移，不悄悄删建。
4. **结果**：导入完成再回读真实路径、子资产、字段与旧使用点。响应不明先读状态，不盲重试；无 Missing 却换动作／锚点移位仍算失败。
5. **真实门槛**：后续获准用目标引擎做原位更新、插帧重排、尺寸变化、名称／槽变化的第二次修改，检查 Prefab/Blueprint/clip/运行时加载。纯脚本映射模拟不能替代引擎验证。

## 6. 证据与停止边界

已核对当前官方文档、固定源码及所述包装／测试文件；没取得所有工具的真实游戏采用或发布闭环证据，活跃维护与已有 Editor 测试源码不等于本轮运行通过。Coplay 仅报告源码潜在误报，Epic 修复仅为维护方声明，UE-253996 保持 By Design。[研究]

Epic 5.8 Python 单类页读取失败，已读同版本 C++ API；未读完整引擎源码，未测真实引擎质量、性能或工时收益。[研究]

初版修订四篇专题并建立本记录，彼时独立复核、完整离线 14 阶段与补丁检查通过；这是历史检查，不覆盖后续改动，也不等于 hosted CI 或引擎测试。后续获准后再在具体工程检验第二次替换，不新建框架。[研究＋经验]

## 7. F1 复核：把接口选择落实到 Unity 入口

**入口按任务缺口选接口，不按Unity版本叠加整栈。** 2026-10-14只读复核发现，固定[e08dcbc的Unity入口](https://github.com/dbvv1/a1dbv/blob/e08dcbc25ec2896a5faa9157e20b715381e47d7b/domains/game-dev/unity/README.md#L16-L27)默认叠加官方插件、Pipeline、LSP、全套模板及旧版社区MCP，与已有能力够用则沿用冲突，因此撤回默认安装建议。[一手／研究]

[官方迁移页](https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli)区分直接shell与MCP客户端、运行编辑器的Unity 6.0 LTS+前提及未弃用的第三方MCP。入口据此按编译／测试、资产操作、编辑器连接、语义导航、模板复用分支；已有脚本满足就不加连接，新增连接另获授权。模板对应见[WP13 §4](2026-10-14-game-wp13-agent-config.md#4-f1-复核入口必须按已配置能力分支)。未运行引擎／Agent／模型，不证明成本或成功率改善。[一手／研究]

## 8. Unity 原生生成器补核：原型集成不等于发行管线

核实：2026-10-14 UTC。主线二／三；改变 01 的“生成结果如何接入并再次替换”建议。在既有原型／许可结论上，新增核对 Assistant 2.20.0-pre.2、最低 Editor 前提、Object Picker 与 Promote 区别、逐 generation job 计费；原 Personal 标价并非本轮新涨价。只读官方网页和文档；未登录、接受协议、安装包、生成资产或运行引擎。本节不是为补品牌而新增的工具名单。[一手／研究]

采用前先查[§8.4版本与计费](#84-动态事实表)和[§8.3生产资格](#83-授权输出权利与-beta-使用资格分开)，条件满足后再选[§8.2替换范围](#82-修改后引用有替换入口没有完整身份保证)。AI可核请求、真实产物路径和引用差异；质量、权利与未知点击条款仍由人放行，不从生成成功自动推定。[研究／经验]

### 8.1 何时值得加入原生流程

**🧪 已有 Unity 项目的少量原型缺口值得对照；正式批量资产暂不替换既有默认。** Object Picker／Assistant 的就地生成、候选应用和设置复用，有减少导出、选择和赋值步骤的机制依据；没有同题通过率或主动工时实测。[经验]

[Unity 6.3 包目录](https://docs.unity.com/en-us/engine/6000.3/manual/packages-list/packages-all/pack-safe/com-unity-ai-assistant)当前列 **Assistant 2.20.0-pre.2**；以下用该版替换先前 2.3.0-pre.2 的能力引用，不据此建议升级工程。[视觉资产文档](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/Sprite/visual-assets.html)覆盖 Sprite／spritesheet、贴图、材质、Cubemap、3D 与地形层；[3D 文档](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/3d-terrain/3d-generator-overview.html)明确仅适合简单单部件道具，不含独立活动部件、绑定或动画；[Animation 文档](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/Animation/animation-overview.html)另有文本／视频生成 `.anim`。这些入口并存不证明能自动拼成合格可动角色。[一手／研究]


[官方 Sprite Generator 工作流](https://unity.com/blog/unity-ai-sprite-generator)（2026-04-28）明确定位为原型占位，预期在发行前换最终人工资产；这是与本项目“无人美术修补做到发行”的直接适用性反证，不是法律禁令。其 spritesheet 由五秒视频均匀抽帧成 4×4 表，不保证动作接触点或脚底稳定；Inpaint／Recolor 介绍含手绘遮罩／调色。**这些手绘步骤不纳入零手修收益，不能用它们兜底生成失败。** [一手＋研究]

[声音生成文档](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/Sound/sound-generate-prompt.html)在 **2.20.0-pre.2** 版本中列 Duration、批量变体和 seed，仍称只有一个 Text to Sound 模型，参考时长十秒效果最佳。这仅支持少量 SFX 候选，不证明音乐分层或角色长期补录能力。[声音编辑文档](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/Sound/sound-edit.html)中的 Loop 是重复播放；裁剪／包络控件不构成生成无缝循环保证。这只是所读版本的生成契约；计费页列出音乐／TTS 品类，不能反推这个 Sound Generator 已提供相应的分层／长期角色管线。[一手＋研究]

外部 API 与原生生成器不必二选一：已合格的外部资源继续经现有 importer；缺少的小批候选才试原生入口。需要固定模型快照、批量资产记录或跨引擎输出时，先保留已有可控管线；这属于架构判断，尚未测出哪条更便宜。[经验]

### 8.2 修改后引用：有替换入口，没有完整身份保证

[Sprite 管理文档](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/Sprite/manage-sprite.html)区分 `Promote to current asset`（替换当前）和 `Promote to new asset`（新建），允许复用 model、prompt、references；生成并应用后才加 `UnityAI` 标签。[声音管理文档](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/Sound/sound-manage.html)给出 WAV、`Promote to asset`、生成记录与设置复用。[一手：上述均为 Assistant 2.20.0-pre.2 文档]

[Object Picker 文档](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/assets/asset-picker.html)明确为**新建资产并赋回发起操作的字段**，不能当作更新所有旧使用点的替换操作。声音生成页称原始候选保留在工程根 `GeneratedAssets`，管理页描述 `Assets` 中的 WAV；前者不应仅因磁盘存在就算可交付。回读被引用的真实项目路径，保留候选／正式产物的来源对应。[一手；研究：导入边界]

**采用这些原生能力，不另建候选管理服务；已有引用仍按第 5 节验收。** 文档没有承诺 GUID、Sprite 子资产 fileID、切片、pivot、动画事件或运行时 key 全部稳定。本轮没取得该替换路径的官方源码级证明，不能把“原生”写成“第二次修改无损”。新建候选与更新既有身份必须分清；生成记录说明来源，不代表相同模型永远可用或位级重现。[研究＋经验]

### 8.3 授权：输出权利与 beta 使用资格分开

[现行产品 FAQ](https://unity.com/features/ai)仍称 beta，指向 Evaluation、特定点击条款及 Guiding Principles；[ToS §13](https://unity.com/legal/terms-of-service)（2026-06-30）对 Software Evaluation 默认限非商业内部评估，允许文档／附加条款例外，Online Services Evaluation 则另按适用条款与文档。**不能因 beta 一词笼统断言所有输出禁商用，也不能因付费或官方入口直接放行生产。** 未登录查看具体点击条款；将其明确留作执行前置，不以反复读取同一公开网页替代账户／包版本核验。[一手＋研究]

[Unity Guiding Principles](https://unity.com/legal/unityai-guiding-principles)（2026-08-19，页首限定 Editor 6.7 及以下）称输入输出归用户，同时保留变更供应商／模型的可能，要求开发者核最终内容权利。[第三方目录](https://unity.com/legal/third-party-ai-terms)（2026-07-28）明确生成器还受供应商条款约束。[Scenario §4.3](https://www.scenario.com/terms-and-conditions)允许合规生成资产商用；[Layer §7.2](https://layer.ai/terms-of-service)（2026-10-08）附合规、付费及模型许可限制。这些是“全体禁商用”的反证，却不能替代 Unity 接入条款；不把供应商直接订阅的套餐资格推定给 Unity 用户。[一手＋研究]

因此当前评级为 **🧪 原型候选；👀 商业生产须逐项核准后评估**。正式发行前分别保留：Unity 当前使用资格、实际模型／供应商的输出许可、输入权利与平台披露记录。Sprite 官方原型定位影响质量选型，不作为版权或商用法律结论。[经验]

### 8.4 动态事实表

以下仅维护本节实际采用的动态事实；下次复核日期是文档维护点，不是已建立的自动监控。条款、包或套餐发生变更时提前复核。[经验]

| 动态事实 | 2026-10-14 核实结论 | 一手来源 | 下次复核／触发点 |
|---|---|---|---|
| 总体版本与连接 | 官方入口为 Unity 6.0+，需安装 AI 包并连接 Unity Cloud；不是引擎安装后默认已有全部生成能力 | [入门](https://unity.com/blog/unity-ai-how-to-get-started)／[FAQ](https://unity.com/features/ai) | 2026-11-14；选定工程／包前 |
| 包级前提 | Unity 6.3 目录当前列 Assistant 2.20.0-pre.2；该版安装要求 6000.0.76f1、6.3 或更新，不沿用旧 2.3 的 6000.0.60f1 门槛 | [包目录](https://docs.unity.com/en-us/engine/6000.3/manual/packages-list/packages-all/pack-safe/com-unity-ai-assistant)／[安装文档](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/install/install-chat.html) | 2026-11-14；包版本变更 |
| Personal 试用／订阅 | Personal 入门页为 14 天、1,000 credits；FAQ 明示试用转 US$10/月。这是此前标价补明续费，不是新涨价；付费席位包含访问／额度不等于无限生成 | [入门](https://unity.com/blog/unity-ai-how-to-get-started)／[FAQ](https://unity.com/features/ai) | 2026-11-14；启用试用／付费前 |
| 生成计量 | image 1–6、SFX 1–5 仅示例；一次多变体按各 generation job 累加。实际用量查 Dashboard；余额为零暂停，月度不结转 | [Credits 文档](https://docs.unity.com/en-us/ai/credits/credits-about) | 2026-11-14；估算／执行批次前 |
| credits 购买约束 | 一般不退款、到期不结转，追加 credits 亦按适用订阅期；以购买时例外和当地法律为准 | [AI Credits Beta Terms](https://unity.com/legal/unity-ai-credits-terms)（2026-07-28） | 2026-11-14；购买前 |
| 接入与生成收费分离 | CLI／MCP／官方插件免费，第三方 Agent 经 Gateway 不扣 Unity credits；不能推出资产生成免费 | [FAQ](https://unity.com/features/ai) | 2026-11-14；改变接入方式 |
| beta 生产资格 | [§8.3](#83-授权输出权利与-beta-使用资格分开)统一维护Evaluation／点击条款及未核账户范围 | 同节FAQ／ToS §13 | 2026-11-14；生产使用前 |
| 供应商／输出范围 | [§8.3](#83-授权输出权利与-beta-使用资格分开)统一维护Editor范围、供应商限制及输出归属 | 同节原则／目录／供应商合同 | 2026-11-14；改模型／Editor／发行前 |

成本比较需纳入全部重试、淘汰、后处理、credits 和主动工时；当前资料不足以把 credits 示例换算成每件合格资产的美元成本。没有发现足以证明原生生成器在本基准下优于外部 API 的同题两轮发布闭环，本次不更换 WP2／WP6 的默认推荐；开测前固定版本、许可、续费、候选数及导入对照，见 [G2 前置](2026-10-14-game-wp12-indie-roadmap.md#g2-开测前置原生生成器与外部导入)。[研究]


## 9. 引擎选择补核：可读代码不等于值得迁移

核实：2026-10-14 UTC；主线二／GB。改变 01 §3 的引擎选择：撤回无同题基准的模型熟悉度高低、“纯代码最省事”和按 C++ 比例判断 AI 化程度；已有工程先维持、缺什么补什么，新项目另评估。以下是历史作者报告与当前文档核查，不是 AI 迁移效果实验。[研究]

### 9.1 不同项目的迁移理由与代价

- **Mega Crit，内容密集的卡牌项目**：[Casey Yano 2023-10-17 原文](https://caseyyano.com/on-evaluating-godot-b35ea86e8cf4)把 Unity 当年的条款／信任问题作为转向背景；评价 Godot 时先调查，再做 Dancing Duelists 小游戏。作者已有 content-as-code 习惯，但仍希望引擎提供资源、字体与显示服务，不想重造；框架搭建耗去 jam 大部分时间。文章没有给 Slay the Spire 2 完整迁移成本，不能把三周 jam 当迁移工期或通用生产验证。这里也不把 2023 收费争议当现行收费事实。[一手：作者自述]
- **Road to Vostok，3D FPS**：[作者 2023-10-14 周报](https://www.patreon.com/roadtovostok/posts/godot-port-2-90960806)记录约 175h Godot 使用、迁移进度约 15%，当时库存／AI 等仍待迁。作者认为已迁内容总体顺利，同时报告武器 rig 从 FBX 转 glTF 后的着色调查、导入／导出规则与控制器差异，并自建类型相关测试场景。175h 是当时作者口径，不是总工期或纯返工量；涉及承包者协作，不能充当“无美术修补”的成功证据。[一手：作者自述]
- **White Giant／Last Dream 2，同引擎大版本迁移**：[Andrew Walker 的迁移记录](https://whitegiantrpg.com/godot-4-migration-getting-started/)以性能和现代图形平台为升级动机；自动转换后九宫格、窗口缩放、字体和布局仍需修复，作者选择逐菜单手修，称每个可需数小时。它反驳“文本格式／转换器存在就不用返工”，不证明当前 Godot 版本仍有相同缺陷，也不推定只有程序员能完成全部修复。[一手：作者自述]

三例的团队、类型与迁移范围不同，不能比较工时排名；Mega Crit 是选型／jam 报告，Vostok 是进行中周报，White Giant 是升级初期记录，均不冒充本仓库复现。共同能支持的判断只到：迁移须有具体需求，并计入现成管线、行为和交付路径的保留成本，不能用代码语料或文件格式替代。[研究]

### 9.2 当前工具能观察什么

- **Unity**：[CLI 官方入口](https://docs.unity.com/en-us/unity-cli)明确控制 Editor 需要 Pipeline 包；代码文件读取与 Editor 状态不是同一个能力。已具备 Editor API／测试的工程先复用，不用以全量重构换取文本可见；具体资源身份风险沿用本记录 §1–5。[一手／经验]
- **Unreal**：本轮重新读取 [Epic 官方 unreal-mcp Skill](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin/blob/main/skills/unreal-mcp/SKILL.md)，其发现／分发机制与既有[固定版本](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin/blob/a6aa73ada02a9fb1f5415bec491f9942c519b297/skills/unreal-mcp/SKILL.md)相符：工具覆盖蓝图等编辑器状态，先 describe 再调用，并检查编译返回。它足以反驳“蓝图天然不可见”；但本轮未连接引擎读取真实 schema，不承诺每种节点、图和运行状态都有完整观察／编辑覆盖。缺所需读回时收窄任务，而非先转 C++。[一手：官方技能；研究／经验：适用范围]
- **Godot**：[4.5 官方 CLI](https://docs.godotengine.org/en/4.5/tutorials/editor/command_line_tutorial.html)已提供 headless、场景运行、脚本、导入和导出；`--check-only` 是配合 `--script` 的解析检查，不是玩法验收。项目断言与测试框架另选，不将引擎自身 `--test` 误作游戏全套测试。stable 页面本轮读取失败，改读明确 4.5 版本，不声称它是当前最新版或本机已装能力。[一手／研究]
- **Bevy**：[0.16→0.17 官方迁移指南](https://bevy.org/learn/migration-guides/0-16-to-0-17/#functionality)明确 Entity 位表示／序列化变动会使旧数据失效甚至崩溃，场景可跨版本破坏。这里只作指定版本、指定机制的维护反例；不据此否定 Bevy，也不推广到 Web、自研或全部代码优先框架。[一手／研究]

[Godot 官方大版本迁移说明](https://docs.godotengine.org/en/stable/tutorials/migrating/index.html)也一般不建议开发中尤其长期工程跨 major 升级，但承认新功能等可能值得迁移。因此“维持”不是永久冻结版本：真实平台／许可／功能阻塞可重新打开选择；先验证受影响流程，再比较迁移成本。[一手／经验]

### 9.3 交付与撤回条件

采用：已有工程补任务所需接口、目标版本 API 来源与反馈；缺蓝图／序列化／运行状态读取时，明确只完成代码层部分。新项目按需求和现成生态选候选，代码可读性只是一个因素。[经验]

不采用：根据没有同题证据的模型熟悉度排名迁移；只因 `.tscn` 或全部源码可读就承诺低成本维护；为 Agent 批量改写现有蓝图、MonoBehaviour 或内容资产。[研究／经验]

重新评估条件：原引擎存在影响交付的具体阻塞，候选在目标平台和代表性资产／UI／物理／存档流程上有可核查优势，并能承担迁移和后续维护。当前只预注册后续验证；未安装、运行引擎／模型、改动游戏工程或测量迁移收益。[经验／研究]


## 10. 入口可调用不等于编辑与验证闭环

2026-10-14 UTC 补核；改变 01 §2.1 与 unity/01 的采用方式，不全量重核各引擎工具表，也不重复 §9 迁移判断。[研究]

### 10.1 官方 Unity：共用依赖与不等价的回退

[官方迁移契约](https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli)区分管理 Editor 版本与控制运行中 Editor：后者依赖 Unity 6.0 LTS+ 的 Pipeline。能可靠执行 shell 的 Agent 直接用 CLI；不能时用其 MCP，并非另一个独立恢复后端。[一手]

固定 [`unity-agent-plugin@cf6b2da`](https://github.com/Unity-Technologies/unity-agent-plugin/blob/cf6b2da24e424b0a60d560a57f39f676cb6f79f3/skills/unity-cli/references/integration-advanced.md)的以下契约本轮已阅读全文相关段落：

- **MCP**：服务器在没有 Editor 时也能启动；Editor 添加命令后才出现对应工具，支持目录变更通知。`capture_game_view`／`capture_scene_view` 在 Editor 主线程不及时响应（如 modal）时可回退 OS 整桌面截图，结果附说明。这既改变截图的证据对象，也可能包含其他窗口内容；应核回退标记，保护无关隐私，不把收到图片视为游戏在推进。[一手／经验]
- **Safe Mode**：项目编译错误使 Pipeline 不加载，`command`、`list`、`status` 与 MCP 均不可连接。恢复是依据窄范围 Editor 日志修复 `.cs`，再恢复 Editor 并确认可达；并非失联的 Pipeline 自己执行修复。资产修改仍暂停。[一手／经验]
- **状态与权限**：domain reload 后可等目标实例 ready；沙箱可能遮蔽真实运行中的实例，固定 Skill 明确反对静默另起 headless Editor 来近似原任务。本文不采纳任何绕过访问限制的建议；有权限阻塞就由操作者处理。[一手／经验]
- **扩展边界**：项目可注册静态 `[CliCommand]`，重新编译并 `list` 确认；不要求等待 CLI 发版。只有任务确实缺某个操作、且能用目标版本 Editor API 读回结果时才补窄命令。工具声明、文档存在不证明编译后已注册或该工程能用。[一手／经验]

这些是固定官方 Skill 的契约阅读，CLI／Pipeline 二进制实现和真实 Editor 未运行。第三方 MCP 有自己的包、transport 与生命周期，不能从这里推出它们共享全部故障模式。[研究]

### 10.2 beta.13：修复启动呈现，不等于测试自动闭环

[CLI 发布说明](https://docs.unity.com/en-us/unity-cli/release-notes)顶部仍是 2026-10-07 的 1.0.0-beta.13。本轮只新增两个有关采用的事实：`status` 对阻塞对话框给出 `STATUS_BLOCKED_BY_DIALOG`／`blockedBy`；异步 `unity command run_tests --async_tests true` 启动时不再把尚未完成的任务显示成“0/0 passed”，而提示轮询 `test_status`。这是维护方修复声明，不是本仓库复现旧缺陷或验证新版本。[一手]

采用：区分命令受理、作业终态与测试断言；取得终态后核实际执行数量、模式／筛选和失败／跳过范围。外层成功或零测试都不足以完成预期验收。这里的异步 Editor 命令不是批处理 `unity test`，不能直接套它的退出码判定。[经验]

### 10.3 不同实现对照：Coplay 的等待超时仍可返回 running

本轮只读同一既有快照 [`CoplayDev/unity-mcp@aa5fc638`](https://github.com/CoplayDev/unity-mcp/tree/aa5fc638d623f56178d50329d9ad8c541a57fe66)，不新增桥的采用推荐。[研究]

- [`Server/src/services/tools/run_tests.py`](https://github.com/CoplayDev/unity-mcp/blob/aa5fc638d623f56178d50329d9ad8c541a57fe66/Server/src/services/tools/run_tests.py)：`run_tests` 返回 `job_id`；`get_test_job` 在 `succeeded`／`failed`／`cancelled` 才结束为终态，`wait_timeout` 到期也会返回当前 `GetTestJobResponse`，而不是自动判测试失败。调用成功与 `data.status`、`result.summary` 必须分开读。[一手：源码]
- [`test_test_job_focus_policy.py`](https://github.com/CoplayDev/unity-mcp/blob/aa5fc638d623f56178d50329d9ad8c541a57fe66/Server/tests/test_test_job_focus_policy.py)使用 `AsyncMock` 替代真实 transport／桌面激活；包含终态取消 nudge、晚到 running 回复不重建预算、外部轮询与等待路径共享策略等用例。它证明上游有这些合成契约检查的源码，不证明真实 Editor 不会卡住，也不能称本轮已跑过测试。[一手／研究]

由两种实现可支持的共同建议仅是：先读所选工具的完成协议；等待超时／连接异常时保留未决状态并核原作业，不直接再启动一份测试。缺最终结果时回到已有可观察的测试入口，或报告尚未验证；不把官方工具或社区测试数量当成可无人值守闭环的证据。[经验]

本轮未安装客户端、运行引擎／模型、激活桌面、执行上游测试或测量采用收益；只增加官方契约与固定源码／测试阅读。后续真实验证仍按当前阶段预注册，不在此执行。[研究]

## 11. 接入采用门槛：版本、安装与权限分别确认

核实：2026-10-14 UTC。本组改变的选择：已有项目先只读核可用入口，缺连接／知识／工具集才添加对应组件；撤回 Unity／Unreal 工具页的整栈默认，以及 UnrealClaude 可覆盖 UE 5.5–5.7 的暗示。不是对全表新闻或所有社区桥重审。[研究]

### 11.1 许可先行，然后区分组件

- Unity 官方 Skill 的[固定许可](https://github.com/Unity-Technologies/unity-agent-plugin/blob/cf6b2da24e424b0a60d560a57f39f676cb6f79f3/LICENSE.md)是 Unity Companion、Unity-dependent projects；CLI 免费不把 Skill 或引擎变成通用 MIT 组件。[一手]
- Epic [固定 Skill 许可](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin/blob/a6aa73ada02a9fb1f5415bec491f9942c519b297/LICENSE)为 MIT，范围不扩到 Unreal Engine；UnrealClaude 的[插件许可](https://github.com/Natfii/UnrealClaude/blob/1f978379f0ff9d3af2b3e4032131cc003fa04dcb/UnrealClaude/LICENSE)与其锁定子模块 [ue5-mcp-bridge 许可](https://github.com/Natfii/ue5-mcp-bridge/blob/e7c96c617143f43070d47e41d3783a449d2519a4/LICENSE)分别核查：插件为 MIT；桥自称 MIT License with Attribution Requirement，额外要求可见署名（项目名、原库链接、作者），用于其他 MCP／AI 集成时须在文档披露，不应简写为标准 MIT。不能用代码许可代替引擎或 Claude 服务条件。[一手／经验]
- Coplay 的固定 MIT 与最低 2021.3 声明已在 §2 核过，本轮不重复；那是包声明，不是各版本、平台及每个工具均获实测保证。已有旧版工程不为官方桥升级引擎。[研究／经验]

### 11.2 Unity：加载 Skill、装 Pipeline 与执行命令不是同一步

[官方 CLI 入口](https://docs.unity.com/en-us/unity-cli)当前明确标为 experimental；[Pipeline 安装文档](https://docs.unity.com/en-us/unity-cli/unity-pipeline/unity-pipeline-package)要求 Editor 6.0+，安装步骤包含登录、装包及依赖、等待重新编译，再用 `pipeline list` 核查。列出 Editor 命令另用 `unity command`，多实例指定工程。[一手]

[固定 unity-cli Skill](https://github.com/Unity-Technologies/unity-agent-plugin/blob/cf6b2da24e424b0a60d560a57f39f676cb6f79f3/skills/unity-cli/SKILL.md#L44-L63)含 CLI 缺失时的安装流程；[官方插件 README](https://github.com/Unity-Technologies/unity-agent-plugin)也说明 Skill 可自动选用并直接修改项目。因而“安装知识插件”不能在本仓库推荐中被写成“已具备编辑器入口”，更不能代替对后续软件安装、项目包变更与任意 C# 执行的授权。[一手／经验]

采用顺序：已有命令／Editor 脚本 → 只读确认工程、版本、可用操作与回读能力 → 缺实时连接才评估 CLI/Pipeline（或同一 CLI 的 MCP）→ 缺领域知识才加 Skill。安装／更新在受控步骤中处理，不放入常规只读 preflight；不把“本机权限相同”解释为 Agent 已获任意操作授权。[经验]

### 11.3 Unreal：最少工具集；旧版桥按作者声明收窄

[Epic 官方配置说明](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor)的 Enable the plugins 段明确允许单独启用所需工具集，`AllToolsets` 是加载全部默认工具的便利入口；Auto Start 默认 false，可按需启动。现有工具页的安装步骤此前仍默认全开，和横向页“按需启用”冲突，现统一为缺入口才启用最少组件。[一手／研究]

UnrealClaude 固定源码为 [`1f978379f0ff9d3af2b3e4032131cc003fa04dcb`](https://github.com/Natfii/UnrealClaude/tree/1f978379f0ff9d3af2b3e4032131cc003fa04dcb)，本轮读取 GitHub API 与原始文件，没有构建或运行：

- [`.uplugin`](https://github.com/Natfii/UnrealClaude/blob/1f978379f0ff9d3af2b3e4032131cc003fa04dcb/UnrealClaude/UnrealClaude.uplugin)声明 VersionName 1.5.1、EngineVersion 5.7.0、Win64／Linux／Mac；[README](https://github.com/Natfii/UnrealClaude/blob/1f978379f0ff9d3af2b3e4032131cc003fa04dcb/README.md)把 macOS 支持收窄到 Apple Silicon，并要求按平台和引擎自行构建，无随附预编译二进制。不是核实了 1.5.1 发布包，更不是 UE 5.5–5.8 兼容认证。[一手／研究]
- [作者对 UE 5.5 请求的答复](https://github.com/Natfii/UnrealClaude/issues/38#issuecomment-4450203842)明确只支持其使用的 5.7，移植需核工具并重写版本上下文。故撤回 5.5／5.6 的默认候选暗示，保留既有 Editor Python／编译测试，不把一个桥的版本缺口泛化成引擎不可用。[一手／经验]
- [真实采用反例 #20](https://github.com/Natfii/UnrealClaude/issues/20)：用户称启用插件后 cook/package 失败，作者[承认此前主要验证 Editor builds](https://github.com/Natfii/UnrealClaude/issues/20#issuecomment-4016330571)。该 issue 已关闭，本轮未定位修复或复测，不能写成当前未修故障；它支持编辑器成功与打包闭环须分别验收。[社区／一手：作者回复]

### 11.4 不能用一个权限开关代表整个入口

UnrealClaude 的 [UnrealClaudeSettings.h](https://github.com/Natfii/UnrealClaude/blob/1f978379f0ff9d3af2b3e4032131cc003fa04dcb/UnrealClaude/Source/UnrealClaude/Public/UnrealClaudeSettings.h#L23-L39)把脚本自动批准默认为 false；但 [ClaudeSubsystem.cpp L97–100](https://github.com/Natfii/UnrealClaude/blob/1f978379f0ff9d3af2b3e4032131cc003fa04dcb/UnrealClaude/Source/UnrealClaude/Private/ClaudeSubsystem.cpp#L97-L100)启动内置聊天时设置 `bSkipPermissions = true`，允许 Read／Write／Edit／Grep／Glob／Bash。[ClaudeCodeRunner.cpp L331–335](https://github.com/Natfii/UnrealClaude/blob/1f978379f0ff9d3af2b3e4032131cc003fa04dcb/UnrealClaude/Source/UnrealClaude/Private/ClaudeCodeRunner.cpp#L331-L335)进一步把该配置变成 `--dangerously-skip-permissions` 参数。这是两个不同权限层，脚本弹窗不等于宿主文件／shell 操作都逐次批准。[一手：固定源码]

因此仅在确需面板／实时桥、能承担构建维护且目标快照权限满足项目约束时评估；若不能保留所需审批，就不采用该入口，继续已有脚本和通用客户端。不提供绕过批准的接入配方，也不声称外部客户端路径自动安全。[经验]

局限：这里只读核查许可证、版本声明、安装契约、权限配置和历史采用反例；没有实测安装、真实客户端权限弹窗、当前引擎兼容或打包结果，不能据此升级为 L4。[研究]


### 11.5 读者入口不能省掉观测与隔离前提

2026-10-15（UTC+8）复核：Unity 官方插件固定 [`cf6b2da`](https://github.com/Unity-Technologies/unity-agent-plugin/blob/cf6b2da24e424b0a60d560a57f39f676cb6f79f3/skills/unity-cli/references/integration-advanced.md#status) 的 status 契约明确，Play 模式帧字段只有已安装 `com.unity.pipeline` 上报时才存在。因此“装了 CLI”不等于有 `frameCount`／`playerLoopTicking`，缺字段不能诊断停帧。入口、工具链、工程指南与提示模板统一为先用可得的帧／时间进度，否则记录未验证，不要求为取得字段自动升级或安装。帧推进仍不证明玩法断言或玩家体验成立。**[一手：固定文档；研究：选择与范围]**

Unreal 的[官方 MCP 契约](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor)允许运行时托管，但须 `AddTool` 显式注册，服务器没有认证，不应暴露本机之外。打包版只有缺必要观察／动作入口时才评估开发或测试版窄工具，不将其写成所有项目的验证前置；注册成功也不证明真实输入与体验。编辑器内容试错不能替代版本控制历史与恢复点。**[一手；研究：采用边界]**

仅公开文档及跨页一致性核查，未安装、运行引擎、测试帧字段或验证网络安全。

## 12. 批量写入与消费新资产分两段

2026-10-16 UTC 核实；改变 01 §5 的批处理顺序与失败处理，不新增管线或 Agent 桥。[研究]

### 12.1 暂停导入期间，不消费尚未完整导入的新资产

[Unity 6.3 StartAssetEditing](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetDatabase.StartAssetEditing.html)明确：暂停期间新建资产尚未在数据库中完整建立，部分 API 不会按预期工作；批内只做不依赖完整导入结果的操作。Start／Stop 采用嵌套计数，调用数量配平才恢复导入。因此把复制／移动／导入与随后加载、赋引用分开；内层 helper 返回或调用一次 Stop，不足以保证外层暂停已结束。[一手／经验]

[AssetEditingScope](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetDatabase.AssetEditingScope.html)用 `using` 自动 Dispose；直接配对调用则用 `try/finally` 保证释放。既有固定 [UnityCsReference 6000.0.84f1，`0c7f0bf` 的 AssetDatabase.bindings.cs L192–242](https://github.com/Unity-Technologies/UnityCsReference/blob/0c7f0bfc4f9b21d3d84fffc9ee9001ad82f0fbc4/Modules/AssetDatabase/Editor/ScriptBindings/AssetDatabase.bindings.cs#L192-L242)显示：构造调用 Start，显式 Dispose 调用 Stop；终结器仅告警，不从终结器线程调用 Stop。不能以等待垃圾回收代替释放。该源码是所标 6.0 快照的托管包装，不冒充 6.3 native 实现。[一手：版本文档／固定源码；经验：采用方式]

### 12.2 释放不是整批成功，也未承诺原子回滚

[6.3 CopyAsset](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetDatabase.CopyAsset.html)在部分过程失败时返回 false，并将错误／警告写入日志；[MoveAsset](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetDatabase.MoveAsset.html)成功返回空字符串，否则返回错误消息。因此只捕获异常会漏掉这些单项失败；应核每项返回，再于相关导入完成后回读实际资产。[一手／经验]

本次所读批量 API 契约未承诺原子回滚。固定托管 scope 仅包装 Start／Stop，底层是 native extern；这不证明任意失败时底层必定保留或撤销哪些写入。异常后先核已发生的变化，再依项目恢复点处理，不能把 `finally`／Dispose 执行成功写成“整批已恢复”。恢复范围仍需目标项目实测，不新造事务服务。[研究：证据范围；经验：失败处理]

### 12.3 回调可回读，但首次回调不代表预期集合全部完成

[6.3 OnPostprocessAllAssets](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetPostprocessor.OnPostprocessAllAssets.html)在导入完成后调用，允许加载等资产操作；但对多个独立资产的 bulk 操作可能逐资产调用，回调中触发新导入还会再次调用。已有回调入口应按本次预期资产集合核结果，不把第一次回调当整批完成，也不无条件再次导入。这里只收窄已有回读方式，不要求所有批处理新建回调系统。[一手／经验]

Unreal 沿用 §4.2 的任务结果接口，补明已核 Python 5.6 的非阻塞查询与阻塞回读两条路径，不将 Unity 的 scope／计数规则映射过去。公开契约不足以确定两端任意部分失败的写入保留与回滚范围，本轮不作保证。[研究]

验证范围：只读官方版本文档、固定参考源码与现有正文；未运行 Unity／Unreal、故障注入或性能测试，不声称吞吐、成功率或恢复效果提升。[研究]

## 13. 整组赛道二改：共享源变了，哪些消费者必须一起验

**✅ 保已有制作链，交源／派生／共享定义／全部消费者的继承包。** 2026-10-20（UTC+8），P30／GB、GD。仅同作静态证据，非两轮实验：仅核公开文本地图，未获取二进制美术源、生成PNG或运行游戏／导入器／模型。AI可清点依赖、拟窄适配与回归；瓶颈是视觉／手感与传播遗漏，承担比例及净工时未知，不填P19产物缺口。[研究]

### 13.1 两轮修订，不冒充因果实验

- **R0→R1：** Pixel Wheels [PR487][p30-r1]于2025-06-17合入`2a819cf9a359c0543d7859c0f011ffc46caf1f46`，起点`7bfe5f5953f5e2d560d0c1dfacaa001cb0c1583e`。改`country.ase`、`country.tsx`及country／river／flood三图；作者说明新增水面、树／草垛共享障碍。`.ase`仅核变更元数据。[一手]
- **迁共享定义须清旧对象：** [fbccb303][p30-r1-diff]改river图块并删Obstacles矩形81／82。R0→R1三图Sections／Waypoints／BonusSpots及country／flood的Obstacles未变；只证源记录保留。[一手／离线]
- **R2：** [PR526][p30-r2]于2026-04-03合入`df7103abad8e058c94ec426e4284fe40dadfe805`；补丁`b80b0c034c79acc66935f42dea0426a3fcac4a48`基于1.0.1／`de6a692f3b6f2ade9e914982e0aeadb4aa2b1de3`。city的local tile 68／100、country的36／52圆半径0.5→0.6，snow的60／90为0.45→0.6；country 61仍0.5。作者称避免两树间卡车，未验效果。[一手]
- R1是1.0.0／1.0.1祖先；固定树CHANGELOG将乡村改版列于2025-07-14的1.0.0-rc.1，R2仍unreleased。R1至R2补丁间**94个提交**含country再修及[restitution接入][p30-restitution]，不能归因R1导致卡住或估算收益；两PR无评论／review。[一手／研究]

### 13.2 同作源→派生→共享定义→玩法边界

路径相对[Pixel Wheels R2固定树][p30-pw]；运行代码根为`core/src/com/agateau/pixelwheels/`。`docs/map-format.md`说明TMX／TSX是作者输入，不是美术图自动生成。[一手]

| 边界／路径 | 决策证据 |
|---|---|
| `core/assets-src/maps/country.ase`→`core/assets-src/Makefile`、`tools/pad-map-tiles`→`android/assets/maps/country.png` | 配方经asesplit、指定色透明替换、64px瓦片各边填2px；未执行。TSX margin 2／spacing 4、图像尺寸须匹配。`.gitignore`排除地图PNG与`core/assets/`，未跟踪不等于漏交，但不能只拿TMX声称重建画面。 |
| `android/assets/maps/{country,city,snow}.tsx`→各TMX | PNG引用、材料、障碍JSON分层；R2不改视觉源，只改上述六种圆。R1 river清旧障碍不授权删全部局部墙／可动物。 |
| `map/Track.java`、`obstacles/tiled/{TiledObstacleCreator,CircleDef}.java` | 载入纹理／地图，分读材料、起点、圈进度与路点。障碍只从首个tileset建定义再遍历全部tile layer；圆用cell、origin、tileSize、UNIT_FOR_PIXEL，不消费cell翻转／旋转。不能推广任意多tileset／变换，也未复现该边界bug。 |
| `map/{LapPositionTableIO,WaypointStore}.java` | Sections名须唯一数字、线两点、相邻段成凸四边形；单一路点折线须在圈进度表内且距离递增，救援用投影。源层未改不证新通道／障碍下可驾驶。 |
| `core/assets-src/ui/map-icons/<map-name>.ase` | 独立源；有MapScreenshotGenerator不证图标更新。 |
| `android/assets/championships/{0,1,2}.xml`、`stats/{GameStatsImpl,JsonGameStatsImplIO}.java` | 检查点间未改。成绩键为难度＋track ID，冠军排名键为难度＋championship ID；写version 2，旧version 1按HARD读，CPU默认成绩不写玩家记录。只证身份／结构保留，未测旧档；改版成绩是否保留／重置／标记须另决。 |

### 13.3 九图实际影响，不以改动文件数代替

对b80固定树复算每个tile layer：CSV整数或base64＋zlib／uint32 little-endian，GID与`0x0fffffff`去标志后减firstgid（本组均1）。下列为**对应两种local tile的单元格数，非运行碰撞体数**；发布端复算一致，独审重读地图被拒后未复跑。[离线]

| 共享TSX／local ID | 正式地图：两种计数（均在`android/assets/maps/`） |
|---|---|
| country／36、52 | country.tmx：36／11；river.tmx：23／49；flood.tmx：5／12 |
| snow／60、90 | race.tmx：12／5；snow2.tmx：24／42；snow3.tmx：68／74 |
| city／68、100 | be.tmx：58／15；tiny-sur-mer.tmx：10／0；city3.tmx：40／47 |

`tiny-sur-mer`第二种为0，不能要求全变。`country-rules.tmx`、`country-templates.tmx`及双tileset的`city-templates.tmx`另属制作依赖，不计入九图，也不由上述计数证明运行支持。[研究]

### 13.4 Unity窄适配与不迁移的条件

固定[SuperTiled2Unity源码][p30-st]为`1861abd9ee0f8ec5cd545841a6243135132bfd87`，包仍标2.4.0、最低Unity 2020.3；不冒充2025-07-02发布包或Unity 6兼容认证。下列路径相对`SuperTiled2Unity/Packages/com.seanba.super-tiled2unity/Editor/`。[一手]

- **依赖可追，不等于项目语义已支持：** `Importers/TmxAssetImporter.cs`的RequestDependencyAssetAtPath取得外部tileset，`Importers/SuperImporter.cs`登记依赖，`AssetTypes/SuperAsset.cs`注册SourceAsset与Artifact；[Unity契约][p30-dep]支持依赖产物变更后重导。CustomTmxImporter可补窄语义，但Pixel Wheels的obstacle JSON、圈进度和存档并非现成标准格式。[一手／研究]
- **默认变，局部覆盖应保留：** `Importers/TiledAssetImporter.cs`先local→tile→object type，同名不区分大小写且不覆盖已有值。`Settings/ST2USettingsProvider.cs`全量Reimport的Apply Default Settings会重设PPU／ellipse参数；不要为同步默认顺手抹掉每图设置。[一手]
- **元数据反例：** [#302][p30-302]使用者Aseprite扩图后TSX尺寸仍旧，Tiled可摆而Unity缺tile，重开tileset解决。须查源图→输出图→TSX。[社区]
- **class范围：** [#300定位／他人修复][p30-300]与`Importers/TmxAssetImporter.TileLayer.cs`未传typeName、基础重载传null相符：不能依赖此tile-layer路径自动带入class默认。不是全部属性失效；同帖isTrigger指控因漏配XML撤回。项目必需且未验修复时，改显式数据层或保原生。[一手／社区]
- **替代也有代价：** Unity原生Tilemap／Collider、[Rule Override Tile][p30-rule]可保留，但原Rule Tile换sprite可能使旧override引用失配。UE的[Tiled JSON入口][p30-ue]只承诺纹理、Tile Sets／Map，不承诺本例玩法或Unity式依赖机制。已有Actor／组件则保原路径，大量Tiled源才比较转换维护收益。[一手／研究]

### 13.5 接收与拒收，分清静态包和可发布游戏

历史链验九图；Unity另拟两共享图、一覆盖图、一无关对照。[研究]

1. R1交源、工具版本、配方、生成图与TSX尺寸／可寻址范围；只换PNG／凭预览拒收。迁共享障碍时查river81／82式重复责任。
2. R2枚举所有消费者及制作模板；只验三份TSX拒收。分别验变化tile、不变61、零计数负项、显式override与每图PPU；“全变成默认”是越界写，不是成功。
3. 路点／Sections、圈序、AI／救援、奖励点和可驾驶区必须行为验；ID与旧记录迁移政策另验。
4. 目标冷导入与增量结果不同、例外膨胀或反复手补生成物时，保旧可用产物并定位生成／依赖层；缩小共享范围或回原生，仍验比例、材质、碰撞、预算与目标设备。[研究]

**局部回归：** [#511][p30-stuck]报告Android 1.0.0-rc1特定附件构建的小车高速卡Tiny-sur-mer起点缝，作者称已修，[46cf815][p30-localfix]改地图并列入1.0.0说明。保小车／墙缝回归，不归因R1或否定R2。[作者／使用者]

**许可与收益边界：** 固定树README区分Pixel Wheels逻辑GPL-3.0-or-later、Apache辅助代码与CC-BY-SA资产；ST2U代码MIT不放行输入素材。仅列机制／聚合结果，不复制素材。制作方式未核，不证AI零手修、可发布或净收益。[一手／研究]

[p30-pw]: https://github.com/agateau/pixelwheels/tree/df7103abad8e058c94ec426e4284fe40dadfe805
[p30-r1]: https://github.com/agateau/pixelwheels/pull/487
[p30-r1-diff]: https://github.com/agateau/pixelwheels/commit/fbccb303727ccc818515eed06ee480fc364ae9c4
[p30-r2]: https://github.com/agateau/pixelwheels/pull/526
[p30-restitution]: https://github.com/agateau/pixelwheels/commit/c0a44b998a883f056e61af664675c9558f26a605
[p30-st]: https://github.com/Seanba/SuperTiled2Unity/tree/1861abd9ee0f8ec5cd545841a6243135132bfd87
[p30-dep]: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/AssetImporters.AssetImportContext.DependsOnArtifact.html
[p30-302]: https://github.com/Seanba/SuperTiled2Unity/issues/302
[p30-300]: https://github.com/Seanba/SuperTiled2Unity/issues/300#issuecomment-3380805247
[p30-rule]: https://docs.unity3d.com/Packages/com.unity.2d.tilemap.extras@4.0/manual/RuleOverrideTile.html
[p30-ue]: https://dev.epicgames.com/documentation/en-us/unreal-engine/import-sprites-in-unreal-engine
[p30-stuck]: https://github.com/agateau/pixelwheels/issues/511
[p30-localfix]: https://github.com/agateau/pixelwheels/commit/46cf8153b6b061f7acc6250f0f5b8ddcc075fb62


## 14. P53：改共享资产前先查消费者

2026-10-21 UTC。问题／默认在检索前冻结：普通文件搜索＋已有 Editor API 能否覆盖代码到资产消费者，何时值得增加索引？Unity AI／Insight、Epic 插件、Unity CLI／Pipeline、Roblox MCP、GameXpert／Play2Code／RSIGame、VoidExplorer、CrosswordDungeon、Cronin／Supergiant、Last Pirate／Sanctuary 及本记录旧来源均属输入已知，不算自主发现。[研究]

**最高水平卡：最佳未知。** 领先候选为实时编辑器＋增量代码—资产图；主流参照为原生查询与人审，可行基线为文件搜索＋已有 Editor API。本轮确认基线，修正为先交消费者清单，再评估索引。证据支持机制比较，不支持当前代际质量胜出，也不自动满足差距≤1。[研究]

### 14.1 决定性比较与生产条件

| 来源／读取位置 | 支持与缺口 |
|---|---|
| 新读：[NVIDIA Paul Logan，2026-03-10][p53-nv]，团队／企业段；[TomNVIDIA 同日指南][p53-nv-guide]，Scope／§I | 内部部署为 Windows／UE5 C++，代码检索不覆盖 Blueprint／反射元数据；保留调试及人审。团队、模型、代码规模未知，无质量／成本对照；厂商相关建议，不证明最佳。 |
| 新读：[Hades README][p53-hades]、[comparison][p53-hades-compare]、[LIMITATIONS][p53-hades-limit] | 单维护者称一个大型 Unity 生产项目试用，规模／模型／审查未披露。对照却是 v1.2、Opus4.8 high、CC2.1.169 的小型 arena 单题双臂，工具和指导同时改变；当前v2待重测。v2不发旧置信／健康字段，变体／嵌套与运行时关系可漏；零引用不证明未使用。动态main，发布日期／固定SHA未核。 |
| 已知重读：[Unity Insight v1，Gu等，2026-09-23][p53-insight]，§2–3 | 静态代码—资产图；两游戏28问每臂一次，型号未披露，只计成本，重建在计时外；无正确率评分。作者称已集成Codely，不证明生产修订成功率。 |
| 新读：[Epic5.8 Semantic Search][p53-semantic]，支持类型／索引 | 未索引或不支持资产不出现在语义结果，缓存外资产需描述与embedding请求；相似发现不等于引用遍历。 |
| 新核：[Unity6.3 GetDependencies][p53-dep]；[UE GetReferencers][p53-refs]／[Registry][p53-reg] | Unity返回正向资产依赖而非消费者；UE引用只覆盖磁盘，初始扫描可能未齐。原生也须说明方向／范围／状态，非全集保证。 |

以上相关正文已读，Hades未看录像或运行；官方版本页日期未显示，均以本次核读日标记。补充生产对照：[LoopedInGames，2026-06-19][p53-void]自述单人Unity6 URP2D／Opus（代际未知），173脚本约29k C#行、全人审，通过MCP读场景与组件；无索引对照，且文章由AI协助写作，不验证产量／质量。[一手：作者自报／文档；研究：适用范围]

### 14.2 决定与撤回

先用已有API列直接／继承消费者，Agent清点、人确认动态加载及验收范围；索引只在重复跨资产追踪昂贵时评估。对照基类／变体／嵌套及改名后的结果，计初建、刷新与核漏成本。索引过期、关键漏项或总投入不优于原生时撤回，不凭零结果删资产。未安装、运行引擎／模型或测净收益。[研究]

### 14.3 冻结回执

提示词`2026-10-21-exploration-self-use.md`；基线`cda12a9`；11:32:52–11:35:30 UTC约158秒墙钟，研究／等待净时不可分。按原始页面去重N=13、相关正文F=12（92.3%），D=10、FD=10；已知重读1、新读11。D为上表10页；非D为Void博客、同站[workflow][p53-workflow]和未读到正文的[NVIDIA GTC会话][p53-gtc]。同站页面不是独立团队；旧仓内复用不计F。GitHub元数据web不可访问、公开HTTPS返回403，两个raw镜像Cache miss；不重复计原页面，未绕限制。审计G01已在输入读取，不能当独立盲测；漏检尚无可计算分母。[研究]

[p53-nv]: https://developer.nvidia.com/blog/?p=113547
[p53-nv-guide]: https://forums.developer.nvidia.com/t/cursors-ai-visual-studio-a-powerful-ue5-c-hybrid-workflow/362681
[p53-hades]: https://github.com/TheArcForge/Hades
[p53-hades-compare]: https://github.com/TheArcForge/Hades/blob/main/Documentation/comparison.md
[p53-hades-limit]: https://github.com/TheArcForge/Hades/blob/main/LIMITATIONS.md
[p53-insight]: https://arxiv.org/html/2609.27585v1
[p53-semantic]: https://dev.epicgames.com/documentation/unreal-engine/semantic-search-in-unreal-enigne
[p53-dep]: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AssetDatabase.GetDependencies.html
[p53-refs]: https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/AssetRegistry/GetReferencers_Message
[p53-reg]: https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-registry-in-unreal-engine
[p53-void]: https://www.loopedin.games/blog/how-i-built-void-balls-using-ai
[p53-workflow]: https://www.loopedin.games/workflow
[p53-gtc]: https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-s82356/

### P53补查：构建引用链不能替代完整消费者查询

2026-10-22（UTC+8）补核。**用构建归因工具交叉核消费者时，先确认链端点与对象身份；零链不直接批准删除或判断无影响。** 原最高水平卡及推荐不变：代码—资产图仍是领先候选，原生查询是可行基线，两者都要核范围；本例不证明谁的正确率更高。[研究]

[UnityDataTools #121](https://github.com/Unity-Technologies/UnityDataTools/issues/121)由SkowronskiAndrew于2026-07-24提交，报告读取源码并测试v2.1.0：find-refs只报告通往显式包含资产／Loadable的链，显式根资产本身和缺端点的Player数据库都可能输出零链；按名称命中多个对象还可能把前一对象结果带到后面。核读时问题仍开放。这是提交者的一手故障报告，不是Unity官方确认、本仓源码复核或复现，也不是AssetDatabase.GetDependencies的缺陷。[一手：问题报告]

据此比较的是“构建中为什么包含”与“编辑器里谁依赖它”两种查询，不混用结果。Agent先辨数据库类型、输入范围和精确对象，再决定是否需要受支持的编辑器查询；人核动态加载与关键消费者。未支持的范围或无法解释的空链不能用于破坏性修改。此项提供反例，但没有独立索引／原生同题正确率及刷新总投入比较，**该局部补查当时保留差距2；整页现由§15复评为1**。本轮读取回执合计见[WP11补查](2026-10-14-game-wp11-gameplay-architecture.md#p53补查共享能力修复怎样进入旧游戏)，不重复计数。[研究]


## 15. 整页接入比较：从改代码到接收当前编辑器状态

2026-10-22（UTC+8）。**问题**：已有工程如何接收Agent修改后的持久状态？复用§1–14和来源名册，补近期工程反例，不新增探针或资产选型。[研究]

**最高水平卡**：当前完整最优未知。领先候选是Editor上下文／引用图、版本约束修改与视觉／运行接收；Unity Insight、StraySpark近期工程文与GameDevBench分别覆盖一部分。主流参照及本仓默认仍是已有Editor API、编译测试和人审，按缺口借机制，不声称组合已实测或现有桥最好。[一手／研究]

### 15.1 整页比较与来源角色

整页八项选择的推荐表只在[01正文](../../domains/game-dev/01-engine-integration.md#当前最高水平接通改对与恢复分开选择)维护。证据角色如下，避免把工具商、学术评估与官方接口混成独立生产胜例：[研究]

| 来源／范围 | 本轮用途与边界 |
|---|---|
| §9迁移记录、§10–11入口、§14索引 | 继承不同作者的代价／接口／负结果；保已有引擎与原生查询，不重复计新发现 |
| [Unity AI gateway2.20.0-pre.2][g01-gateway]正文 | 新核内嵌宿主；捆绑Codex／Gemini可能不同于本机版本，不隐去版本与权限 |
| [GameDevBench作者页][g01-bench]／README | 补直接读取；Godot333题、最佳反馈／harness配置，不是跨引擎或单一工具因果对照 |
| StraySpark两篇工程文、Unity6.3 override契约 | 新核编译批次、旧序列化状态、恢复与视觉边界，详§15.2–3；两文同团队 |
| §3–4／12–13导入、§8生成器 | 继承源／引擎权威与原型／生产取舍，不扩到资产质量排名；完整身份与净成本优胜仍未知 |

**GameDevBench两种证据分开**：当前代榜单采用各模型最佳反馈／harness；视觉反馈同模型例子仍为GPT-5.4，不能称当前代因果收益或Unity／UE迁移证据。[作者报告／研究]

作者链接的[Astra运行说明][g01-bench-run]本轮已直接核读：2026-09-07、Codex0.153.4、Godot4.4.1、runtime-video开启而screenshot MCP关闭，229／333通过；基础设施重试与验证失败分开。成本使用generic fallback，不能当已核账单；不同harness版本不能抹去。它不证明必须装截图MCP。[一手：作者运行说明；研究]

**只借机制，不搬整栈。** [GCA既有证据](2026-10-14-game-wp13-agent-config.md#53-gca采用证据绑定机制不把配置通过当全面放行)支持借单写者／当前build接收，不支持Phaser流程替换Unity／UE。[AutoUE v2][g01-autoue]已读方法／实验，但2026-04-08的Qwen-Plus／20题仅作原生PCG辅助参照，不是当前代最佳或维护性证明。[一手／研究]

### 15.2 编译批次与序列化状态必须一起接收

[StraySpark 2026-10-21 Unity复盘][g01-unity]是在Unity6.5／Windows的自有测试关卡，预写Python发工具调用，无模型现场选调用。它报告互引新脚本逐文件预编译失败后，改成按assembly共同预检；另报告源码默认值改变而旧场景组件仍保序列化值。这是桥契约反例，**不是模型自主或付费桥优胜证明**。[一手：工具商自报]

**采用**：Agent列同批依赖与应变实例，选成组入口或已有文件／编译流程，等完整编译结果；不删引用或放弃检查过门。按需求改Prefab源或实例值，保其他覆盖。这是案例推导的默认，非跨项目保证。[研究]

[Unity6.3 RecordPrefabInstancePropertyModifications][g01-prefab]正文与示例明确推荐SerializedObject／SerializedProperty，以记录修改并纳入Undo；直接写实例需相应记录，示例另处理场景保存，否则重开可能回到原值。**接收**：代码通过、内存回读、正确记录override与保存重开分开；不把“能Undo”当已保存，也不把实例更改自动Apply到整个Prefab。这里核官方契约，没有运行目标桥或验证任意属性都可持久化。[一手／研究]

### 15.3 修改后画面和恢复范围不是一个成功状态

[StraySpark UE v5工程文（2026-09-12）][g01-ue]提出修改时核expected revision、真正只读preview、修改后新绘制帧与actor计划恢复。公开边界是恢复不包含运行时组件层级及其他actor持有引用；另有视觉宿主／soak等未完成验证。它是Win64 beta厂商自报，不是完整独立采用证明。[一手]

**同题决定**：保已有Editor API＋恢复点，按需用现有版本检查／预览，不另搭平台。版本不匹配重读，未知结果先查副作用；Agent核恢复后的组件、外部引用和使用点，人核画面／行为。actor回执不覆盖整库，候选幂等不证明原入口可盲重试。[研究]

**视觉回读**：操作结束后取目标面板／Game View新画面；截图不等于视觉正确。字段对而画面错时修需求／属性映射，不重复调用。复用已有图像／视频，完整玩法门槛仍由02维护。[研究]

### 15.4 读取边界与剩余差距

- 来源范围见§15.1；名册既有证据不计新发现，StraySpark两篇只计同一团队。[研究]
- StraySpark深层[Patches and Plans][g01-locked]显示需有效license，正文未读，停止该读取；Prefab snap-back关联页为cache miss。公开工程文可按作者自报引用，不能写成源码核实。GameDevBench运行链接首次读取失败后，已从作者链接成功核读。[研究]
- 全新上下文整页复评确认八类主要接入选择已有近期领先机制与独立证据，**登记gap1**。真实Unity／UE工程的当前代二改、完整恢复与总投入效果仍未知；该未知限制效果声称，不等于主要选择未比较。[研究]
- 未安装、付费、运行模型／引擎、访问用户电脑、创建测试脚本或发布；本文比较不是实际修改与恢复通过。资料页的链接／静态检查另报。[研究]

[g01-gateway]: https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/integration/ai-gateway-intro.html
[g01-bench]: https://waynechi.com/gamedevbench/
[g01-bench-run]: https://github.com/waynchi/gamedevbench/tree/main/results/gpt6_astra_codex_runtime_video_high_full_333
[g01-autoue]: https://arxiv.org/html/2603.07106
[g01-unity]: https://www.strayspark.studio/blog/unity-level-built-1344-mcp-tool-calls
[g01-prefab]: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/PrefabUtility.RecordPrefabInstancePropertyModifications.html
[g01-ue]: https://www.strayspark.studio/blog/unreal-mcp-server-v5-verified-editing-ue58
[g01-locked]: https://www.strayspark.studio/docs/unreal-mcp-server/patches-and-plans
