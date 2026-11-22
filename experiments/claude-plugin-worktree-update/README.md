# 多 worktree 更新插件：核当前路径的安装记录与缓存

**Claude Code 2.1.325 中，linked worktree 的 `plugin update` 报 latest，不能证明该 worktree 的插件记录已升级。** 本地真实 CLI 对 `local`、`project` 两种 scope 都复现；主 checkout 与独立仓库的对照正确更新。
**重复 `plugin install` 也没有修复本例旧记录。** 不把安装命令成功作为团队插件更新完成的验收，应在目标目录核其 `projectPath` 对应的版本、缓存内容，再验原任务。
本例只检查管理命令和磁盘产物；没有启动模型、重启会话或验证实际会话加载，更没有替用户改现有插件。

## 实跑结果

以同一合成 marketplace 的版本标记从 `1.0.0 / ONE` 改成 `1.1.0 / TWO`，每种 scope 单独使用全新 HOME 与 config：

| 目录 | update 返回 | 该目录记录／对应缓存文件 |
|---|---|---|
| 主 checkout | updated，1.0.0 → 1.1.0 | 1.1.0 / TWO |
| 它的 linked worktree | up_to_date，1.1.0 → 1.1.0 | **仍为 1.0.0 / ONE** |
| 独立 Git 仓库 | updated，1.0.0 → 1.1.0 | 1.1.0 / TWO |

随后只在 linked worktree 重跑同 scope 的 `plugin install`，返回 ok，记录与缓存仍为 `1.0.0 / ONE`。两种 scope 的结果见 [results.json](results.json)。没有测试卸载再装、手改缓存或手改登记文件，不给出这些恢复建议。

<a id="21330复验"></a>

## 2.1.330 复验：组件清单与旧登记不一致（2026-11-22）

另用官方 2.1.330 Linux x86_64 CLI、独立 HOME 与本地合成 marketplace，将 Skill 标记 ONE 升至 TWO。分别用全 `local`、全 `project` 同 scope 在主 checkout、linked worktree 和独立仓库顺次 `plugin update`。两组均只有 linked worktree 的精确登记、缓存 manifest 和 Skill 文件仍是 1.0.0／ONE；它的更新报 1.1.0 `up_to_date`，同一目录的新 `plugin details` 也已列 1.1.0／TWO。另在 local 与混合组每次更新后立即查清单：只更新主 checkout 时，linked 和不相关的独立仓库已经显示新版组件，精确登记及缓存仍为旧版；独立仓库稍后仍能明确执行一次更新。因此组件清单不证明目标目录的安装，也不证明会话加载。

另组主 checkout 用已跟踪的 `project` 设置、linked worktree 用 `local` 安装，两个目录的记录和缓存都确实升到新版。这组不是推荐切换 scope 或修复现有项目；不验证会话实际加载，也没改动真实项目或账号。现实症状见[用户归并问题 #99631](https://github.com/anthropics/claude-code/issues/99631)，以上为不同合成环境中的组件与记录对照。

## 核对自己的目标目录（只读）

已经遇到同一症状时，先在**实际使用插件的 worktree 根目录**核下面三项，不再反复 install：当前路径和 scope 的安装记录版本、缓存 manifest 版本，以及一个本次升级确实改变的文件的 SHA-256。使用运行 Claude 时的配置目录；默认是 `$HOME/.claude`，设置过 `CLAUDE_CONFIG_DIR` 就用其值。命令只读取明确选定的插件，不修改登记或执行插件代码。

```sh
CONFIG_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
PLUGIN='your-plugin@your-marketplace'
SCOPE='local' # 项目共享安装改为 project
CHANGED_FILE='commands/example.md' # 改成此次升级确实变化的插件内文件
python3 - "$CONFIG_DIR/plugins/installed_plugins.json" "$PLUGIN" "$SCOPE" "$(pwd -P)" "$CHANGED_FILE" <<'PYTHON'
import hashlib, json, sys
from pathlib import Path
registry, plugin, scope, project, changed_file = sys.argv[1:]
entries = json.loads(Path(registry).read_text())["plugins"].get(plugin, [])
selected = [e for e in entries if e.get("scope") == scope
            and e.get("projectPath") == project]
if len(selected) != 1:
    raise SystemExit("未找到唯一的当前目录记录；核对配置目录、插件名、scope 与安装时路径，不推断已升级。")
entry = selected[0]
cache = Path(entry["installPath"])
manifest = json.loads((cache / ".claude-plugin/plugin.json").read_text())
print(json.dumps({"record_version": entry["version"],
                  "manifest_version": manifest.get("version"),
                  "changed_file_sha256": hashlib.sha256(
                      (cache / changed_file).read_bytes()).hexdigest()}, indent=2))
PYTHON
```

将两个版本与期望版本比较，并将哈希与可信新版本中的**同一个文件**比较。缺记录、缺文件或读取错误都不能算通过；升级本来就没改该文件时，其哈希不具区分力。此处字段来自 2.1.325 的实际安装记录，未来版本改变格式时应重新核对，不据此手改登记。

本节命令已用于上方真实 CLI 夹具：两种 scope 下，主 checkout／独立仓库均读到 1.1.0，linked worktree 均读到 1.0.0，manifest 与记录一致，变更文件哈希也分别对应 TWO／ONE。它能定位“管理命令成功但目标目录记录未更新”，**不能证明会话实际加载哪个版本**；记录与缓存满足期望后，仍须在目标会话完成原插件任务。恢复方式尚未验证，不建议手改缓存或卸载重装。

## 复跑

先通过官方渠道准备 **2.1.325 原生 CLI**，把它的绝对路径传给：

```sh
python3 experiments/claude-plugin-worktree-update/probe.py --claude "$CLAUDE_BINARY"
```

[probe.py](probe.py) 要求 Python 3.11+、Git 与 Linux 上可运行的官方原生二进制。只创建临时 Git 仓库、marketplace 和 Markdown 标记插件；不含 Hook、MCP、外部命令或模型调用。CLI 环境使用白名单及独立 HOME/config，插件安装只读本地来源。程序最终清理自己创建的临时夹具，结果以不含路径的 JSON 输出；未来版本修复后，当前复现断言可能失败，须读实际差异而非把失败当新故障。

## 来源与边界

- [原始用户 #108929](https://github.com/anthropics/claude-code/issues/108929) 报 macOS、git-hosted marketplace 的 local scope 问题；[两条原帖评论](https://github.com/anthropics/claude-code/issues/108929#issuecomment-6881368882)补充 project scope、2.1.325 以及普通子目录的报告。
- [官方插件清单参考](https://code.claude.com/docs/en/plugins-reference)：版本及标准目录；命令参数另外以本次官方二进制 `plugin --help`、`install --help`、`marketplace add --help` 核对。
- 本次是 **Linux、磁盘路径 marketplace、同一进程环境的串行管理命令**，不等于复现 git-hosted 更新拉取、macOS、并发写、普通子目录、会话真实执行或全部插件行为。没有向子进程传入真实账号凭据或原有配置路径，没有安装到原有用户目录；未做系统调用级文件访问／网络审计。

来源核实与实测：2026-11-15 UTC。此独立消费者结果只供既有插件路线接收，不升级地图状态、改默认或声称已完成新读者实做。
