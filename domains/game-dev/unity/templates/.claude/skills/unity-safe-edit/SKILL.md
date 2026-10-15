---
name: unity-safe-edit
description: 修改 Unity 场景(.unity)、Prefab、ScriptableObject(.asset)、.meta 文件、ProjectSettings 或移动/重命名/删除 Assets 下文件前必读的安全操作规范。
user-invocable: false
---

# Unity 资源安全修改规范

## 判断走哪条路

1. **编辑器已打开且有 Unity MCP / Unity CLI 可用** → 用编辑器 API 修改（最安全）。例如 `unity command eval --caller plugin --skill unity-safe-edit '<C#>'`。改完后在编辑器里保存场景或资源，再用 `git diff` 确认变化。
2. **可以写编辑器脚本** → 写一个 `Editor/` 下的一次性菜单脚本（`[MenuItem]`），用 `PrefabUtility`、`EditorSceneManager`、`AssetDatabase`、`SerializedObject` 修改，再让用户执行或通过 MCP 执行。
3. **只能改文本** → 先确认属于项目已批准且验证过的受限路径；接口缺失或字段简单都不自动授权文本修改，不满足前提就报告缺口。例外仅限修改简单标量字段（数字、布尔、字符串），并且：
   - 不新增/删除 YAML 文档块（`--- !u!`）
   - 不改动任何 `fileID`、`guid`
   - 修改前后用 `git diff` 确认只改了预期行
   - 在目标引擎核对引用与相关行为；缺少验证入口时报告未验证，不扩大例外

## 移动 / 重命名 / 删除

- 移动或重命名：`git mv Foo.cs Bar.cs && git mv Foo.cs.meta Bar.cs.meta`（文件夹同理，文件夹也有 .meta）。
- 重命名 MonoBehaviour/ScriptableObject 类时，**文件名必须与类名一致**；保留 GUID 只是必要条件，还须回读组件脚本绑定与序列化数据，不能据此保证所有引用不丢。
- 删除：同时删除 `.meta`；删除前用 Grep 在 `*.unity`、`*.prefab`、`*.asset` 中搜索其 GUID，确认没有引用。

```bash
guid=$(grep -m1 '^guid:' Assets/Path/Foo.cs.meta | awk '{print $2}')
grep -rl "$guid" Assets --include='*.unity' --include='*.prefab' --include='*.asset'
```

## 重生成 / 重导入已有资源

- 先读取目标 GUID、子资产身份与语义名称、pivot、单位和下游 Prefab/动画/Addressables 键；复用项目已有 Preset/AssetPostprocessor，声明生成字段和需要保留的调整，不删 `.meta` 后重建。
- Sprite 重排不能仅凭 Smart 的矩形重叠推断动作身份；Prefab 覆盖会按名称匹配，同名子物体或同物体多个同类型组件可能匹配不唯一。无法唯一映射就停止自动替换，先明确迁移。
- 工具 success 不等于导入完成；`SaveAsPrefabAsset` 在 `StartAssetEditing` 批次内即使保存成功也可返回 null。结合 success、日志，结束批次并导入后回读，不因 null 盲目创建副本。
- 回读实际使用点的子资产、材质槽、挂点和加载键，确认仍代表同一动作/道具；GUID 存在或无 Missing 不够。重复导入不得额外生成 `_1` 或覆盖未声明字段。
- 若使用 UnityGLTF 跨资产材质 remap，获准实测后，在保留源文件与 `.meta` 的干净工程副本中，对照冷缓存全量导入与暖缓存单资产重导入，复用上述实际使用点检查，核对 Renderer 各材质槽指向的外部材质资产／子资产。Inspector 映射正确或暖导入成功不能代替冷导入验收；回落到内部同名材质仍算失败，不删除工作工程 `Library`。

## 序列化字段改名

```csharp
[FormerlySerializedAs("oldName")]
[SerializeField] private float _newName;
```
否则所有场景/Prefab 中该字段的值会丢失。

## ProjectSettings / Packages

- 修改前向用户说明影响范围并获得确认。
- 包版本升级后提示用户在编辑器中验证编译与导入。
