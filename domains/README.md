# 领域分支

主干文档（`docs/`）讲通用的 AI coding 方法；这里讲**具体领域**怎么落地：领域专用的工具链、项目约定、坑，以及可以直接拷贝的配置模板。

| 领域 | 状态 | 内容 |
|---|---|---|
| [game-dev-unity](game-dev-unity/README.md) | ✅ 已整理 | 大型 Unity 项目：Unity CLI / 官方插件 / 社区 MCP、落地指南、AI 资产生成、模板 |

## 新增领域的结构约定

```
domains/<领域名>/
├── README.md                 # 一页纸推荐方案 + 目录
├── 01-toolchain.md           # 领域专用的 Agent、Skill、MCP 工具链（带评级和证据）
├── 02-*-guide.md             # 落地指南：禁区、验证闭环、适合和不适合交给 AI 的任务
└── templates/                # 在 templates/generic 基础上增加的领域配置
```

原则：**通用的东西放主干，领域分支只写增量。**
