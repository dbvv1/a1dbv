# Unreal 项目模板

核实时间：2026-10-10（本地配置与临时目录回归；未验证真实引擎或 Claude Code 运行时）

在 [templates/generic](../../../../templates/generic/) 的基础上，增加 Unreal 专用的部分。

```
templates/
├── AGENTS.md                      # UE 项目指令骨架（引擎源码位置、编译方式、二进制资产禁区、UObject 约定、试玩接口）
├── CLAUDE.md                      # 导入 AGENTS.md，加上 Claude Code 专属约定（unreal-mcp 用法、编译方式选择）
├── .mcp.json.example              # Unreal MCP 的默认地址；正式文件用编辑器命令生成
└── .claude/
    ├── settings.json              # 保留 generic 权限基线；放行编译和测试脚本；不读 Binaries/Intermediate/DDC
    ├── protected-paths.txt        # .uasset/.umap 禁止文本编辑；Config、.uproject、Target.cs 需确认
    ├── hooks/protect-paths.sh     # 与 generic 相同的通用 Hook
    ├── agents/
    │   └── ue-code-reviewer.md    # UObject 生命周期与 GC、网络同步、Tick 与热路径、模块依赖
    └── skills/
        ├── ue-build/              # UBT 命令行编译；识别 Live Coding 冲突；提取 MSVC/clang/UHT/链接错误
        └── ue-run-tests/          # UnrealEditor-Cmd 运行自动化测试；解析 index.json
```

## 安装

[经验] 🧪 试用：适合愿意审阅模板的新项目；已有项目必须手动合并，不能直接覆盖。这里的 `.claude/settings.json` 与 `protected-paths.txt` 是 **generic 基线 + Unreal 增量的完整文件**，不是可直接叠加的补丁。回归测试会检查基线未丢失。

### 空目录：生成待审阅的项目模板

在本知识库根目录运行，先把环境变量 `TARGET` 设置为你选定的**空目录**路径。下方命令会拒绝未设置的目标、目标或父目录中的符号链接和任何非空目录，包括已有 `.git` 的项目。重复执行会拒绝写入，保留第一次生成的内容。先读命令与源文件；只想预览时不要执行，先比较 generic 与领域文件。

<!-- empty-project-recipe -->
```bash
(
  set -eu
  : "${TARGET:?请先设置 TARGET 为新的空目录路径}"
  # 去掉末尾分隔符，再检查每个现有路径分量；不解析或穿过符号链接。
  case "$TARGET" in /*) ;; *) TARGET="./$TARGET" ;; esac
  while [ "$TARGET" != / ] && [ "${TARGET%/}" != "$TARGET" ]; do
    TARGET=${TARGET%/}
  done
  probe=$TARGET
  while :; do
    if [ -L "$probe" ]; then
      printf '%s\n' '拒绝符号链接目标或父目录；请手动审阅路径' >&2
      exit 1
    fi
    parent=$(dirname "$probe")
    [ "$parent" != "$probe" ] || break
    probe=$parent
  done
  mkdir -p "$TARGET"
  contents=$(find "$TARGET" -mindepth 1 -print -quit)
  if [ -n "$contents" ]; then
    printf '%s\n' '目标非空：停止，先备份并手动合并；不覆盖已有配置' >&2
    exit 1
  fi
  base=templates/generic
  domain=domains/game-dev/unreal/templates
  cp -R "$base/.claude" "$TARGET/"
  # 仅在刚刚确认的空目标中，使用包含通用基线的完整领域配置。
  cp -R "$domain/.claude/." "$TARGET/.claude/"
  cp "$base/REVIEW.md" "$TARGET/REVIEW.md"
  for file in AGENTS.md CLAUDE.md; do
    cat "$base/$file" > "$TARGET/$file"
    printf '\n\n' >> "$TARGET/$file"
    # CLAUDE 的 AGENTS 导入只保留通用版本的一次。
    sed '/^@AGENTS.md$/d' "$domain/$file" >> "$TARGET/$file"
  done
  chmod +x "$TARGET"/.claude/hooks/*.sh "$TARGET"/.claude/skills/*/scripts/*.sh
)
```

[经验] 启用前逐项填写 TODO，整理拼接后的重复标题、命令占位符与项目约定；保留通用的任务记录、范围控制、验证和交接要求。`REVIEW.md` 已复制，但复制不等于工具会自动读取，审查时需明确指定它。通用和领域 agents/skills 都保留。

### 已有项目：备份后手动合并

[经验] 不对非空项目执行上述复制，也不要去掉目录检查或改成强制覆盖。先在项目外备份现有 `AGENTS.md`、`CLAUDE.md`、`REVIEW.md`、整个 `.claude/` 和已有 `.mcp.json`（含未跟踪文件）；检查备份完整后，在另一个空目录生成候选模板，用 diff 只读比较，再逐项人工合并：

- 项目指令：保留原有约定；将通用与领域增量纳入现有结构。冲突由项目负责人决定，不用整文件替换
- `settings.json`：按 `permissions.allow/ask/deny` 分别审阅并去重，保留现有自定义字段、Hook 和更严格的限制；检查是否出现放宽权限。不要把数组或整个 JSON 当作浅层覆盖
- `protected-paths.txt`：保留通用及现有规则，检查新增规则的顺序；第一条匹配生效，不能盲目把较宽松规则放在前面
- agents/skills/Hook：仅加入已审阅内容；同名文件先比较，再决定如何合并。完成后检查差异并执行项目自己的验证

[经验] Hook 只约束它匹配的编辑工具，不覆盖 Bash、引擎 CLI/MCP 等其他写入路径；不是安全隔离边界。“只读”工作意图不等于运行时权限限制，编译和测试会写入产物与日志。实际隔离要依靠工具权限、沙箱和受限凭证；这里仅复用 generic 的既有权限语法，离线测试不证明 CLI 版本兼容。

### 可选插件与编辑器接入

[经验] 上述流程不会复制 `.mcp.json`、启用插件或安装软件。另行审阅所需插件、MCP 的权限与来源，再按项目授权配置；不要覆盖现有连接配置。

Epic 官方插件与 Unreal MCP 是可选接入；若需要，单独审阅并启用，不随模板复制自动开启。

## 脚本依赖与环境变量

- bash（Windows 用 Git Bash）、python3（解析测试报告）。
- 引擎自动查找顺序：`UE_ENGINE_ROOT` → 项目所在的源码工作区 → `.uproject` 中 `EngineAssociation` 对应的启动器安装目录。找不到时设置 `UE_ENGINE_ROOT`。
- 也可以直接指定 `UE_BUILD_SCRIPT`（Build.bat / Build.sh）和 `UE_EDITOR`（UnrealEditor-Cmd）。
- WSL 中调用 Windows 版引擎需要自己包一层 `cmd.exe /c`，脚本没有处理这种情况。

## 已验证

两个脚本都用伪造的引擎（假的 `Build.sh` 和假的 `UnrealEditor`）测试过各个退出码分支。尚未在真实引擎上运行，第一次使用时请留意 Build.bat 参数和测试报告格式是否与你的引擎版本一致。
