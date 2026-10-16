主线：G1 引擎资产接入；主线三“第二次修改仍可靠”
改变的建议：01/unity/unreal 从接口接通转为复用导入器、明确覆盖策略、验证语义身份；撤回旧 Unity AI MCP 并列推荐
新证据：2026-10-16 UTC 补核 Unity 6.3 批量暂停、嵌套释放、单项返回与导入回调契约及既有固定源码（§12）；2026-10-15 UTC 补核 UnityGLTF 跨资产 remap 冷导入失败、固定修复及 2.22.0 标签（§3.4）；§11 官方安装／最少工具集、UnrealClaude 固定版本和双层权限及作者兼容答复；§10 官方 Pipeline 失联／桌面截图回退、beta.13 异步结果修复与 Coplay 固定测试作业实现；§9 不同作者的迁移代价与官方观测入口对照；§8 Assistant 2.20.0-pre.2 的版本前提、生成／替换边界及逐 job 计费

# WP9：第二次重生成应更新哪一个资产

## 当前结论摘要（2026-10-16 UTC）

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

### 4.3 修复链与反例，不能抹平到“最新版已好”

1. [UE-253996](https://issues.unrealengine.com/issue/UE-253996)报告 5.5 自动 import 转 reimport 后旧材料参数保留，即使调用侧设置 ApplyPipelineProperties 等也未按预期更新。状态是 **By Design**，页面另写 Target Fix 5.6；不能据“Target Fix”称已修复，更不能把报告者强行跳过 reimport 的 workaround 推荐给所有资产。[一手：官方问题记录，含用户报告]
2. [5.8 release notes](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes)仍列 reimport 时误删已有纹理、USD reimport 后旧资产仍被引用、骨骼 LOD 绑定更新等修复；这只证明维护方修复声明。本轮未读 Epic 授权引擎完整源码、未跑对应回归。[一手]

Importer 切换／引擎升级与普通替换分开；核对旧名称、骨架、材质槽后再决定沿用 legacy 或迁到 Interchange。[经验]

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

核实：2026-10-14 UTC。独立读取 `e08dcbc` 的 [Unity README](https://github.com/dbvv1/a1dbv/blob/e08dcbc25ec2896a5faa9157e20b715381e47d7b/domains/game-dev/unity/README.md#L16-L27) 后确认：按 Unity 版本叠加官方插件、Pipeline、LSP、全套模板，以及旧版默认社区 MCP 的入口确实与本记录“现有能力够用则沿用”的条件判断不一致。[一手：仓库原文；研究：反证成立]

本次重新读取[官方迁移页](https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli)，仍区分直接 shell 与 MCP 客户端需求、运行中编辑器的 Unity 6.0 LTS+ 前提及未被弃用的第三方 MCP；它支持按接口能力分支，不能推导所有项目必须安装整栈。[一手＋研究] 因此只将入口改成“代码编译/测试、资产操作、缺编辑器连接、缺语义导航、复用模板”五个任务条件，撤回 LSP/社区 MCP/全部模板的默认安装建议。已有脚本能完成任务时不增加连接；需新增连接时另行按项目授权处理。[经验]

与两端模板的接口前提复核见 [WP13 §4](2026-10-14-game-wp13-agent-config.md#4-f1-复核入口必须按已配置能力分支)。这是新增入口及指令链的只读对照，不重做资产研究、不改变 WP9 的固定源码证据；未运行引擎、Agent 或模型，不据此宣称成本、成功率或工时改善。[研究]

## 8. Unity 原生生成器补核：原型集成不等于发行管线

核实：2026-10-14 UTC。主线二／三；改变 01 的“生成结果如何接入并再次替换”建议。在既有原型／许可结论上，新增核对 Assistant 2.20.0-pre.2、最低 Editor 前提、Object Picker 与 Promote 区别、逐 generation job 计费；原 Personal 标价并非本轮新涨价。只读官方网页和文档；未登录、接受协议、安装包、生成资产或运行引擎。本节不是为补品牌而新增的工具名单。[一手／研究]

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
| beta 生产资格 | Evaluation＋具体点击条款，须区分 Software／Online Services 与文档例外；未核具体账户点击文本 | [FAQ](https://unity.com/features/ai)／[ToS §13](https://unity.com/legal/terms-of-service) | 2026-11-14；生产使用前 |
| 供应商／输出范围 | Unity 输出归属声明与供应商／模型限制并存；原则页限定 6.7 及以下，不外推后续 Editor | [原则](https://unity.com/legal/unityai-guiding-principles)／[目录](https://unity.com/legal/third-party-ai-terms)／[Scenario](https://www.scenario.com/terms-and-conditions)／[Layer](https://layer.ai/terms-of-service) | 2026-11-14；改模型／Editor／发行前 |

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
