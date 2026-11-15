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
