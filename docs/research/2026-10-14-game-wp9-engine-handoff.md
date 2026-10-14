主线：G1 引擎资产接入；主线三“第二次修改仍可靠”
改变的建议：01/unity/unreal 从接口接通转为复用导入器、明确覆盖策略、验证语义身份；撤回旧 Unity AI MCP 并列推荐
新证据：官方迁移与资产身份契约、固定源码；2026-10-14 补核 Assistant 2.20.0-pre.2 的版本前提、生成／替换边界及逐 job 计费

# WP9：第二次重生成应更新哪一个资产

## 当前结论摘要（2026-10-14 UTC）

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

## 4. Unreal：显式覆盖策略，不强依赖 MCP

### 4.1 MCP 与 Python 的分工

[官方 Unreal MCP 文档](https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor?lang=zh-CN)仍标实验性、API 可能变；默认本机、无认证。MCP 提供发现／调用工具入口，实际导入仍由引擎 importer/pipeline 执行。[一手]

固定 Epic 技能 [`a6aa73ada02a9fb1f5415bec491f9942c519b297`](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin/blob/a6aa73ada02a9fb1f5415bec491f9942c519b297/skills/unreal-mcp/SKILL.md)（2026-09-17，提交说明版本 3.1.1）允许工具支持时的安全独立并发；异步工具能重叠，请求顺序不保证执行／完成顺序，依赖调用及影响同一资产／编辑器状态的修改串行。不能把“游戏线程同步 dispatch”误写成整个异步操作不会重叠，也不要将放宽规则解释为同一资产可以多 Agent 并写。[一手＋研究]

官方页面仍不建议重叠请求，与较新 Skill 口径不同；共享资产写入串行，工具明确支持才并行独立调用。[一手＋经验]

[Editor Python](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python)为成熟编辑器自动化基础；不是打包游戏 Python 运行时。已有 Python 导入脚本满足需求时不必再包装 MCP，也不必为了自动化升级引擎。[一手＋经验]

Epic 技能仓库 [LICENSE](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin/blob/a6aa73ada02a9fb1f5415bec491f9942c519b297/LICENSE)为 MIT；它不把 Unreal Engine 或引擎内所有插件重新授权为 MIT。[一手＋经验]

### 4.2 Interchange 已有的契约比 replace=true 更细

[5.8 UAssetImportTask](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Editor/UnrealEd/UAssetImportTask)分别提供 bReplaceExisting 与 bReplaceExistingSettings；DestinationName 在走 Interchange 时应由 pipeline 指定，该 task 字段被忽略。异步必须等 IsAsyncImportComplete，再读 GetObjects／ImportedObjectPaths，不能把“没有对话框”当导入完成。[一手]

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
