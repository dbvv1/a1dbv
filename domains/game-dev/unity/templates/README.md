# Unity 项目模板

在 [templates/generic](../../../../templates/generic/) 的基础上，增加 Unity 专用的部分。

```
templates/
├── AGENTS.md                      # Unity 项目指令骨架（命令、禁区、C# 约定）
├── CLAUDE.md                      # 导入 AGENTS.md，加上 Claude Code 专属约定
├── .mcp.json.example
└── .claude/
    ├── settings.json              # 放行 Unity CLI 只读和测试命令；不读 Library/Temp/obj
    ├── protected-paths.txt        # Unity 规则：Library、.meta 禁止编辑；场景、Prefab、ProjectSettings 需确认
    ├── hooks/protect-paths.sh     # 与 generic 相同的通用 Hook
    ├── agents/
    │   ├── unity-code-reviewer.md # 生命周期、序列化、Unity null 语义、asmdef 依赖
    │   └── unity-perf-auditor.md  # 热路径分配、GetComponent/Find、渲染与资源
    └── skills/
        ├── unity-compile-check/   # --editor（unity recompile）/ --dotnet / --batch
        ├── unity-run-tests/       # 优先 `unity test`，否则 -runTests batchmode；解析 NUnit XML
        └── unity-safe-edit/       # 改场景、Prefab、.meta、移动资源前的规范
```

## 安装

```bash
# 1. 先装通用模板，再用 Unity 模板覆盖
cp -r templates/generic/{AGENTS.md,CLAUDE.md,.claude} <Unity项目>/
cp -r domains/game-dev/unity/templates/{AGENTS.md,CLAUDE.md,.claude} <Unity项目>/
chmod +x <Unity项目>/.claude/hooks/*.sh <Unity项目>/.claude/skills/*/scripts/*.sh

# 2. 官方插件与 LSP（在 Claude Code 中）
/plugin marketplace add Unity-Technologies/unity-agent-plugin
/plugin install unity@unity-agent-plugin
/plugin install csharp-lsp@claude-plugins-official

# 3. Unity 6+：让 Agent 能驱动编辑器
unity pipeline install
```

## 依赖

- `bash`（Windows 用 Git Bash）；`jq` 或 `python3`（Hook 用来解析 JSON，测试汇总需要 python3）
- 推荐安装 Unity CLI；没装时脚本会根据 `ProjectSettings/ProjectVersion.txt` 到 Unity Hub 的默认路径找编辑器，或通过 `UNITY_EDITOR` 环境变量指定
- `dotnet` SDK（`--dotnet` 快速编译检查用）

## 测试情况

两个脚本都用伪造的 Unity CLI 和伪造的编辑器跑过以下场景：编译错误、Safe Mode、项目被锁、测试失败解析、参数错误、`--help`。**还没有在真实的 Unity 项目上验证过**，首次使用时请留意输出是否符合预期。
