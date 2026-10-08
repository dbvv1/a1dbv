# Unreal 项目模板

在 [templates/generic](../../../../templates/generic/) 的基础上，增加 Unreal 专用的部分。

```
templates/
├── AGENTS.md                      # UE 项目指令骨架（引擎源码位置、编译方式、二进制资产禁区、UObject 约定、试玩接口）
├── CLAUDE.md                      # 导入 AGENTS.md，加上 Claude Code 专属约定（unreal-mcp 用法、编译方式选择）
├── .mcp.json.example              # Unreal MCP 的默认地址；正式文件用编辑器命令生成
└── .claude/
    ├── settings.json              # 启用 Epic 官方插件；放行编译和测试脚本；不读 Binaries/Intermediate/DDC
    ├── protected-paths.txt        # .uasset/.umap 禁止文本编辑；Config、.uproject、Target.cs 需确认
    ├── hooks/protect-paths.sh     # 与 generic 相同的通用 Hook
    ├── agents/
    │   └── ue-code-reviewer.md    # UObject 生命周期与 GC、网络同步、Tick 与热路径、模块依赖
    └── skills/
        ├── ue-build/              # UBT 命令行编译；识别 Live Coding 冲突；提取 MSVC/clang/UHT/链接错误
        └── ue-run-tests/          # UnrealEditor-Cmd 运行自动化测试；解析 index.json
```

## 安装

```bash
# 1. 先装通用模板，再用 Unreal 模板覆盖
cp -r templates/generic/{AGENTS.md,CLAUDE.md,.claude} <UE项目>/
cp -r domains/game-dev/unreal/templates/{AGENTS.md,CLAUDE.md,.claude} <UE项目>/
chmod +x <UE项目>/.claude/hooks/*.sh <UE项目>/.claude/skills/*/scripts/*.sh

# 2. UE 5.8+：编辑器中启用 Unreal MCP 和 All Toolsets，然后在控制台执行
#    ModelContextProtocol.GenerateClientConfig ClaudeCode      （生成 .mcp.json）

# 3. 填写 AGENTS.md 中的 TODO，尤其是“引擎头文件位置”
```

## 脚本依赖与环境变量

- bash（Windows 用 Git Bash）、python3（解析测试报告）。
- 引擎自动查找顺序：`UE_ENGINE_ROOT` → 项目所在的源码工作区 → `.uproject` 中 `EngineAssociation` 对应的启动器安装目录。找不到时设置 `UE_ENGINE_ROOT`。
- 也可以直接指定 `UE_BUILD_SCRIPT`（Build.bat / Build.sh）和 `UE_EDITOR`（UnrealEditor-Cmd）。
- WSL 中调用 Windows 版引擎需要自己包一层 `cmd.exe /c`，脚本没有处理这种情况。

## 已验证

两个脚本都用伪造的引擎（假的 `Build.sh` 和假的 `UnrealEditor`）测试过各个退出码分支。尚未在真实引擎上运行，第一次使用时请留意 Build.bat 参数和测试报告格式是否与你的引擎版本一致。
