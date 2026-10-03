# AGENTS.md

<!-- 跨工具通用的项目指令。Claude Code 通过 CLAUDE.md 中的 @AGENTS.md 导入；Codex、Cursor、Copilot 等直接读取本文件。
     原则：只写 Agent 猜不到、猜错代价大的内容。保持精简（建议 < 200 行），细节放 docs/ 并引用。 -->

## 项目概况

- 项目：TODO（游戏名 / 类型 / 目标平台）
- Unity 版本：TODO（见 `ProjectSettings/ProjectVersion.txt`）
- 渲染管线：TODO（URP / HDRP / Built-in）
- 关键包：TODO（Input System、Addressables、UniTask、Netcode…）

## 目录结构

```
Assets/
  _Project/            # TODO：本项目代码与资源根目录
    Scripts/
      Runtime/         # 运行时代码（按模块分 asmdef）
      Editor/          # 编辑器扩展
      Tests/           # EditMode / PlayMode 测试
  _Generated/          # AI 生成的占位资源（需记录来源）
  Plugins/             # 第三方，只读
Packages/manifest.json # 包依赖（改动需确认）
```

TODO：列出主要模块（asmdef）及依赖方向，例如 `Core ← Gameplay ← UI`，禁止反向引用。

## 常用命令

| 目的 | 命令 |
|---|---|
| 快速编译检查 | `.claude/skills/unity-compile-check/scripts/compile_check.sh --dotnet` |
| 完整编译（需关闭编辑器） | `.claude/skills/unity-compile-check/scripts/compile_check.sh` |
| EditMode 测试 | `.claude/skills/unity-run-tests/scripts/run_tests.sh EditMode` |
| PlayMode 测试 | `.claude/skills/unity-run-tests/scripts/run_tests.sh PlayMode` |

## 硬性规则

1. **不要读写** `Library/`、`Temp/`、`obj/`、`Logs/`、`UserSettings/`。
2. **不要删除或手写 `.meta`**；移动/重命名资源时 `.meta` 必须一起移动（`git mv`）。新建 C# 文件让 Unity 生成 `.meta`。
3. **不要手改** `.unity` / `.prefab` / `.asset` 的 YAML，除非是简单的数值字段且已说明风险；优先用编辑器 API / Unity MCP。
4. 修改 `ProjectSettings/`、`Packages/manifest.json`、`Assets/Plugins/` 前先征求同意。
5. 每次修改 C# 后必须通过编译检查；修改逻辑后运行相关测试。

## 代码约定

- 命名：TODO（例：类型/方法 PascalCase，私有字段 `_camelCase`，常量 PascalCase）
- 序列化字段用 `[SerializeField] private`，不暴露 public 字段。
- 不要对 `UnityEngine.Object` 使用 `?.` / `??`（Unity 重载了 null 判定）。
- 热路径（`Update`/`FixedUpdate`/`LateUpdate`）禁止：GC 分配、LINQ、`GetComponent`/`Find*`、字符串拼接、装箱。
- 业务逻辑尽量写在纯 C# 类中（便于 EditMode 测试），MonoBehaviour 只做胶水。
- 异步：TODO（UniTask / Awaitable / 协程，统一一种）。
- 注释与文档：TODO（中文/英文）。

## 提交约定

- TODO（如 Conventional Commits：`feat(combat): ...`）
- 提交前：编译通过 + 相关测试通过；不要提交生成物和本地设置。
