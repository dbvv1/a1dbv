# 游戏资产编辑：引擎 API 不等于专用 Agent 接口

> 核实时间：2026-10-13（UTC+8）。本轮只读官方文档与公开 issue；未运行 Unity、Unreal 或模型。**[一手：官方文档；社区：原始报告；经验：采用判断]**

**✅ 采用最小修正。** 撤回“编辑器操作必须走官方 Agent 接口”，按源码、文本序列化与二进制资产选择路径；资产默认经引擎 Editor API 修改。直接编辑 Unity 文本资产只作为项目验证过的受限例外，不反向承诺任意 YAML 修改安全。正文只修游戏 README/01 的对应表述，不重验其中所有工具版本。

## Unity：可读文本不等于安全写入契约

- [Unity 6.0 Text-based scene files](https://docs.unity3d.com/6000.0/Documentation/Manual/TextSceneFormat.html) 将工具生成/解析文本场景列为用途；同版本 [Prefab YAML](https://docs.unity3d.com/6000.0/Documentation/Manual/yaml-prefab-serialization.html) 明确提到手工解决合并冲突与编辑器外脚本，并说明 PrefabInstance、override、stripped object 和跨文件 GUID/fileID 的关联。**[一手]**
- 但同版本 [UnityYAML](https://docs.unity3d.com/6000.0/Documentation/Manual/UnityYAML.html) 又写明：“You cannot externally produce or edit UnityYAML files.” 并指出其实现不支持完整 YAML 规范。三页原文在本轮读取时存在直接冲突，不能只选支持直改的一页，宣称官方保证安全。**[一手；研究：交叉核对]**
- [Asset Serialization 设置](https://docs.unity3d.com/6000.0/Documentation/Manual/class-EditorManager.html#asset-serialization) 列出 Mixed、Force Binary、Force Text，后者为默认值；这个设置不是外部写入正确性的保证。**[一手；经验：采用边界]**
- [Asset metadata](https://docs.unity3d.com/6000.0/Documentation/Manual/AssetMetadata.html) 说明 `.meta` 保存唯一 ID 与导入设置；在 Unity 外移动或重命名资产时必须同步处理对应 `.meta`。丢失它会产生新的资产身份并断开已有引用。源码内容编辑与文件改名/移动因此不是同一风险。**[一手]**

**实用边界**：C# 源码按编码流程编辑；确需局部文本补丁时，范围应已在项目中验证，保留 GUID/fileID 与结构关系，审阅差异并在目标引擎中重导入/打开、核对引用。复杂 Prefab 结构修改优先交给引擎序列化；通用 YAML 解析成功不代替引擎验收。这些是保守建议，本次没有验证一组跨版本通用的“安全补丁”。**[经验]**

## Editor API 已能操作资产，无须推导为 MCP 必选

- [Unity 6.0 PrefabUtility.LoadPrefabContents](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/PrefabUtility.LoadPrefabContents.html) 官方示例用 C# 加载隔离 Prefab、修改、`SaveAsPrefabAsset` 保存并卸载，明确适用于批处理。它提供引擎内的修改路径，不要求专用 Agent 接口。**[一手]**
- [Epic Python Editor scripting](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python) 提供编辑器对象/属性操作；`set_editor_property` 会触发 pre/post edit 处理，直接赋 Python 属性不一定如此。API 能力取决于暴露范围与版本，Python 环境仅在 Editor 可用，不能推成打包游戏脚本能力。**[一手]**
- [Epic Perforce 文档](https://dev.epicgames.com/documentation/unreal-engine/using-perforce-as-source-control-for-unreal-engine) 明确 `.uasset` / `.umap` 是二进制，不能文本合并。普通 Agent 工作流应经匹配版本的编辑器/API 做语义修改与保存；C++ 源码不受此二进制边界约束。这不是宣称所有外部二进制处理工具在技术上都不可能。**[一手；经验：推荐范围]**

## 真实失败反例与证据限度

[JetBrains/resharper-unity #1461](https://github.com/JetBrains/resharper-unity/issues/1461)，2019-12-13 的原始报告：在 Rider 的 Unity Explorer 重命名 ScriptableObject 资产，没有同步重命名 `.meta`，随后 Unity 丢失该资产引用。issue 已关闭，本次未复现，也未推断当前 Rider 仍有该问题。它支持保留资产身份与配对的要求，不支持“所有外部编辑都不安全”。**[社区：历史报告；一手：机制与 Unity metadata 文档吻合]**

## 验证范围

已核对上述原文、同一 Unity 6000.0 版本的冲突措辞，以及仓库四处绝对化表述。未安装或运行引擎、上游项目或模型；离线文档/夹具检查不能证明真实资产修改成功。若今后取得目标项目的引擎加载、引用检查与运行结果，才据其范围扩展直接文本修改的例外。**[研究：本轮范围]**

本轮 `python3 scripts/check_offline.py` 全部 14 阶段通过，非空测试套件、无 skip；`git diff --check` 通过。这只验证仓库离线入口，不构成真实引擎或 hosted CI 通过。**[研究：本仓库运行]**
