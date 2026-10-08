# 领域分支

主干文档（`docs/`）讲通用的 AI coding 方法；这里讲**具体领域**怎么落地：领域专用的工具链、项目约定、坑，以及可以直接拷贝的配置模板。

| 领域 | 状态 | 内容 |
|---|---|---|
| [game-dev](game-dev/README.md) | ✅ 已整理 | 游戏开发：行业数据与态度、引擎工具链对比（Unity / Unreal / Roblox / Godot / Blender）、验证与 AI 试玩、资产管线、运行时 AI |
| [game-dev/unity](game-dev/unity/README.md) | ✅ 已整理 | 大型 Unity 项目：Unity CLI / 官方插件 / 社区 MCP、落地指南、配置模板 |
| [game-dev/unreal](game-dev/unreal/README.md) | ✅ 已整理 | 大型 Unreal 项目：UE 5.8 官方 MCP / Epic 插件、Live Coding 与 UBT、自动化测试、配置模板 |

## 新增领域的结构约定

```
domains/<领域名>/
├── README.md                 # 一页纸结论 + 目录
├── 0N-*.md                   # 领域环境、工具链、验证闭环、领域特有问题（带评级和证据）
└── <子领域>/                 # 如 game-dev/unity/：具体技术栈的落地指南和 templates/
```

原则：**通用的东西放主干，领域分支只写增量；跨技术栈的放领域根目录，特定技术栈的放子目录。**
