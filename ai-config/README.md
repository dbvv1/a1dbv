# 个人 AI 配置导出区

核实时间：2026-10-10。🧪 试用：适合人工挑选少量可公开配置；不适合整目录备份或无人值守发布。[一手：本仓库脚本与合成回归测试]

本仓库是 **public**。检测通过不代表没有秘密、内部地址、公司项目名或个人信息。必须逐文件人工审阅，不能让另一个 Agent 的“通过”替代你的发布决定。

## 安全契约

`../scripts/export-ai-config.sh` 需要 Bash 和 Python 3 标准库，不需要 jq、网络或额外安装。[一手：脚本实现]

- 没有默认源目录；必须显式指定源、文件清单和输出目录，不自动读取个人配置
- `stage` 只创建仓库外暂存目录，扫描成功之前不写文件；`promote` 必须另行调用
- 每个 `--include` 是**一个完整相对文件名**，不是目录或 glob；未列出的嵌套文件永远不复制
- 所选文件及路径祖先中的符号链接均拒绝；不执行导出的脚本
- 仅支持 UTF-8 文本，每文件最多 1 MiB、快照合计最多 10 MiB；拒绝二进制和未知类型
- README 与其他文本使用同一检测，不豁免；错误仅报告文件序号、行号、类别，不输出匹配值或源路径
- 输出必须是新目录，父目录必须存在；重复运行拒绝覆盖，不混入旧文件，也不删除已有快照
- `promote` 校验人工审阅标识、每文件哈希、完整文件集合，再重新扫描；修改、添加或缺失文件都需要重新暂存和审阅
- 不执行 git add、commit、push；不会自动公开上传

这些规则是本地误操作防护，不是对抗恶意并发进程的沙箱。操作期间不要让其他程序修改源、暂存目录或输出目录。Git 工作树识别基于祖先 `.git` 文件或 `.git/HEAD` 标记；非 Git 同步/发布目录不会被自动识别，也不要用来暂存。[一手：脚本实现；经验：使用边界]

## 文件白名单

| 路径（`--include`） | 允许内容 |
|---|---|
| `claude/CLAUDE.md` | 全局指令 |
| `claude/settings.json` | 仅下面三个通过类型校验的字段 |
| `claude/agents/**/*.md`、`claude/commands/**/*.md`、`claude/output-styles/**/*.md` | 显式选择的 Markdown；也允许各目录直接子文件 |
| `claude/skills/**` | 显式选择的 `.md`、`.sh`、`.py` 文本 |
| `claude/hooks/**` | 显式选择的 `.sh`、`.py` 文本 |
| `codex/AGENTS.md`、`gemini/GEMINI.md` | 全局指令 |

表中的 `**` 仅描述允许的目录位置，命令行不会展开清单中的通配符。隐藏路径、`..`、重复条目均拒绝。[一手：脚本实现]

`settings.json` 必须是合法 JSON 对象，无重复键。脚本重新构建对象，仅保留 `alwaysThinkingEnabled`、`includeCoAuthoredBy`（布尔值）、`cleanupPeriodDays`（0–3650 的整数）。其他字段全部丢弃，包括 env、MCP、权限、命令、URL；允许字段类型错误则失败。这是保守导出选择，**不是厂商完整配置 schema，也不保证当前工具版本支持这些字段**。恢复前查阅所用工具的版本说明。[一手：脚本实现]

## 两步导出

以下命令只演示操作；源目录需要你自己选择。先建立仓库外私有工作目录（不要放在自动同步位置），`snapshot` 本身必须尚不存在：

```bash
umask 077
STAGE_PARENT=$(mktemp -d)
STAGE_PARENT=$(cd "$STAGE_PARENT" && pwd -P)
./scripts/export-ai-config.sh stage \
  --source "claude=$HOME/.claude" \
  --source "codex=$HOME/.codex" \
  --include claude/CLAUDE.md \
  --include claude/settings.json \
  --include codex/AGENTS.md \
  --output "$STAGE_PARENT/snapshot"
```

`pwd -P` 将临时目录转为物理路径，避免 macOS 的 `/var` 或某些 Linux 环境中的 `/tmp` 是符号链接而被拒绝。源目录和输出父目录也必须使用不经过符号链接的物理路径；不要关闭符号链接检查。按实际存在且要公开的文件修改参数。缺失文件或目录是错误，不会静默沿用旧文件。失败时修复源后使用新的暂存目录重跑。[一手：脚本实现]

1. 在本地编辑器中审阅 `snapshot/export-manifest.json` 和其中**每个文件的完整内容**，不要仅看 diff
2. 检查秘密、私有主机/域名、公司名、个人信息、机器路径、脚本行为与权限；不要把原始暂存内容贴到共享日志
3. 若需修改内容，回到源文件修复，重新暂存并重新审阅；记录脚本输出的 manifest SHA-256
4. 人工确认后显式提升到一个新的快照目录；把下面标识替换成实际审阅过的值

```bash
./scripts/export-ai-config.sh promote \
  --stage "$STAGE_PARENT/snapshot" \
  --reviewed MANIFEST_SHA256_FROM_REVIEW \
  --output ai-config/snapshot-reviewed

git status --short --untracked-files=all -- ai-config/
git diff -- ai-config/
```

`git diff` 不显示未跟踪文件的内容；请继续用编辑器逐个打开 `git status` 列出的新文件（包括清单）。所有清单路径均相对快照根目录，哈希记录本次实际导出的字节，不记录源绝对路径。旧快照不会自动删除；发布前自行决定保留哪个版本，不要误把历史文件当作最新配置。[一手：脚本实现]

检测只覆盖有限的 token 形状、私钥头、疑似秘密赋值和部分本机路径，会误报也会漏报。不存在“全自动脱敏”或“检测即安全”保证。[一手：脚本检测规则；经验：边界]

## 恢复与禁区

这是选择性公开快照，不是可一键恢复的完整备份。恢复时逐文件审阅、备份目标并手动合并，尤其不要覆盖完整 settings 或自动启用 hooks。[经验]

不要选择登录文件、`settings.local.json`、会话历史、项目代码、MCP 凭据、Codex `auth.json` / `config.toml` 或其他私有内容。这些不在白名单中；即使秘密藏在允许的 Markdown 或脚本里，也仍由你负责审阅。[一手：白名单；经验：发布责任]

## 离线回归

```bash
python3 -m unittest discover -s tests -p test_config_export.py -v
```

测试仅使用临时合成目录和假秘密，覆盖正常暂存/提升、README 与嵌套文件泄漏、设置字段过滤、非法 JSON、符号链接、路径冲突、缺失源/依赖、过大/二进制文件、旧目标、重复运行与暂存篡改。通过这些测试不代表验证过真实个人配置或所有凭据格式。[一手：测试范围]
