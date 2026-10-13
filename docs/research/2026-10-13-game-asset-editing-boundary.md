主线：二、三；G1 资产处理
改变的建议：游戏README/01：撤回“必须官方Agent接口”，按源码、文本和二进制资产选路径，默认用Editor API；游戏03区分规格设置与有损网格处理
新证据：Unity同版本官方冲突文档、.meta机制、Unreal API/二进制说明及Rider历史失引用原帖；补trellis2mlx固定清理机制、回归与作者产物记录，未测引擎

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

## 生成网格：有损后处理不等于规格设置

2026-10-13 补充；改变游戏 03 §1.1 第 3 项：命名、明确单位换算与有损几何处理分开。**🧪 复用现成清理路线做受限试验**，不据此采用整套模型为正式资产方案；这一反例不否定常规批量设置。**[经验：采用判断]**

- 固定 `lyonsno/trellis2mlx@c0e66f782ac86f86212e049cf029478602b0e8d2` 的 [mesh_cleanup.py](https://github.com/lyonsno/trellis2mlx/blob/c0e66f782ac86f86212e049cf029478602b0e8d2/trellmlx/mesh_cleanup.py#L16-L98) 将小连通块过滤移到非流形边拆分之前；[generate.py](https://github.com/lyonsno/trellis2mlx/blob/c0e66f782ac86f86212e049cf029478602b0e8d2/generate.py#L790-L809) 在后续清理中禁用再次过滤，避免把已拆开的细薄表面误当碎屑。这是局部保留策略，不是与参考 CUDA 路线完全一致的保证。**[一手：源码阅读]**
- 同版本 [合成回归](https://github.com/lyonsno/trellis2mlx/blob/c0e66f782ac86f86212e049cf029478602b0e8d2/tests/test_mesh_cleanup.py#L71-L132) 包含相连细片及独立碎屑：新顺序要求保留前四面、删除碎屑，旧顺序对照要求结果为空；另覆盖反复清理与补洞开关。**本轮仅阅读，未执行上游测试或拆分算法。** **[一手：测试阅读]**
- [作者验证记录](https://github.com/lyonsno/trellis2mlx/blob/c0e66f782ac86f86212e049cf029478602b0e8d2/docs/validation.md) 报告 warrior 保存输入恢复此前误删的 207,391 面；补洞使最终面数从 961,732 增至 1,662,604，说明简化目标不是导出面数硬上限。数字为作者产物报告，不是本轮资产复测，也不是游戏通用预算线。**[一手：作者实验报告]**
- [产物清单](https://github.com/lyonsno/trellis2mlx/blob/c0e66f782ac86f86212e049cf029478602b0e8d2/docs/examples.json) 含参数、GLB 哈希和展示路线；本轮实际查看 bear 正面截图，文件 SHA256 与清单一致。完整固定 Git 树未包含对应 GLB 或原始网格，无法独立检查面数与修复前后差异；清单里的哈希不是已验证的 GLB，截图也不证明没有人工修补。**[一手：清单与截图；研究：本轮检查边界]**

**剩余边界**：未核实真实游戏采用或 Unity / Unreal 中的发布质量；展示渲染不替代目标硬件、相机距离、动画与资产预算验证。此例支持先区分生成缺陷与后处理损伤，不支持任何美术风格天然更适合 AI，也不证明风格一致性或完整无美术流程。未安装、运行上游软件或生成新资产；上述离线入口通过记录属于先前编辑边界修订，不是这项上游修复的复现。**[研究：范围；经验：外推限制]**
