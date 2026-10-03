# 配置模板

| 目录 | 用途 | 拷贝到 |
|---|---|---|
| [`unity/`](unity/) | Unity 项目的 AI 协作配置 | 你的 Unity 项目根目录 |
| [`global/`](global/) | 个人全局偏好 | `~/.claude/CLAUDE.md` 等 |

## Unity 模板内容

```
unity/
├── CLAUDE.md                     # Claude Code 项目指令（导入 AGENTS.md + Claude 专属内容）
├── AGENTS.md                     # 跨工具通用项目指令（Codex / Cursor / Copilot 等也读）
├── .mcp.json.example             # 项目级 MCP 配置示例
└── .claude/
    ├── settings.json             # 权限规则 + Hooks 注册
    ├── hooks/
    │   └── guard-unity-files.sh  # 拦截对 Library/、.meta、场景/Prefab 等的危险编辑
    ├── agents/
    │   ├── unity-code-reviewer.md   # Unity 代码评审子 Agent
    │   └── unity-perf-auditor.md    # 性能审计子 Agent
    └── skills/
        ├── unity-compile-check/  # 命令行编译检查（dotnet build / Unity batchmode）
        ├── unity-run-tests/      # 运行 EditMode/PlayMode 测试并解析结果
        └── unity-safe-edit/      # 安全修改场景/Prefab/meta 的操作规范
```

## 使用步骤

1. 拷贝：`cp -r templates/unity/{CLAUDE.md,AGENTS.md,.claude} <你的Unity项目>/`
2. 编辑 `AGENTS.md` 中所有 `TODO` 项（项目名、Unity 版本、模块说明、命名约定）。
3. 给脚本加执行权限：`chmod +x .claude/hooks/*.sh .claude/skills/*/scripts/*.sh`
4. 依赖：`bash`（Windows 用 Git Bash）、`jq` 或 `python3`（Hook 解析 JSON 用）。
5. 可选：设置环境变量 `UNITY_EDITOR` 指向 Unity 可执行文件（否则脚本按 `ProjectVersion.txt` 去 Unity Hub 默认路径查找）。
6. 启动 `claude`，运行 `/context` 确认指令与 Skills 已加载。
