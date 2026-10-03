---
name: unity-safe-edit
description: 修改 Unity 场景(.unity)、Prefab、ScriptableObject(.asset)、.meta 文件、ProjectSettings 或移动/重命名/删除 Assets 下文件前必读的安全操作规范。
user-invocable: false
---

# Unity 资源安全修改规范

## 判断走哪条路

1. **编辑器已打开且有 Unity MCP / Unity CLI 可用** → 用编辑器 API 修改（最安全）。
2. **可以写编辑器脚本** → 写一个 `Editor/` 下的一次性菜单脚本（`[MenuItem]`），用 `PrefabUtility`、`EditorSceneManager`、`AssetDatabase`、`SerializedObject` 修改，再让用户执行或通过 MCP 执行。
3. **只能改文本** → 仅限修改简单标量字段（数字、布尔、字符串），并且：
   - 不新增/删除 YAML 文档块（`--- !u!`）
   - 不改动任何 `fileID`、`guid`
   - 修改前后用 `git diff` 确认只改了预期行

## 移动 / 重命名 / 删除

- 移动或重命名：`git mv Foo.cs Bar.cs && git mv Foo.cs.meta Bar.cs.meta`（文件夹同理，文件夹也有 .meta）。
- 重命名 MonoBehaviour/ScriptableObject 类时，**文件名必须与类名一致**；GUID 保持不变则引用不丢。
- 删除：同时删除 `.meta`；删除前用 Grep 在 `*.unity`、`*.prefab`、`*.asset` 中搜索其 GUID，确认没有引用。

```bash
guid=$(grep -m1 '^guid:' Assets/Path/Foo.cs.meta | awk '{print $2}')
grep -rl "$guid" Assets --include='*.unity' --include='*.prefab' --include='*.asset'
```

## 序列化字段改名

```csharp
[FormerlySerializedAs("oldName")]
[SerializeField] private float _newName;
```
否则所有场景/Prefab 中该字段的值会丢失。

## ProjectSettings / Packages

- 修改前向用户说明影响范围并获得确认。
- 包版本升级后提示用户在编辑器中验证编译与导入。
