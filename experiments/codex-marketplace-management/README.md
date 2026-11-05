# Codex marketplace 移除与插件卸载：管理状态对照

**卸载已装插件时，不把 `plugin list` 空列表当成完成凭据。** 本次 Linux `codex-cli 0.167.0-alpha.4` 合成本地插件实测：移除 marketplace 后列表为空，但插件启用配置和一份缓存 Skill 仍在；按已知 `plugin@marketplace` ID 执行 `plugin remove` 后，三处才同时清除。适合核查插件回滚的管理面，尚未验证运行时是否继续加载。

## 可复跑入口

需要 Python 3.11+ 和已安装、可信的 Codex CLI；脚本不下载依赖。传入现有可执行文件：

```sh
python3 experiments/codex-marketplace-management/replay.py --codex "$(command -v codex)"
```

脚本在新临时目录设置独立 HOME、CODEX_HOME 和 XDG 目录，只安装自己生成的无动作本地插件。依次执行添加 marketplace、安装插件、列出、移除 marketplace、再列出、显式卸载、最终列出共七条管理命令。读入的 TOML 仅是该临时配置；输出只有状态、版本和可执行文件 SHA-256，不输出配置、缓存正文或绝对路径。结束自动清理该临时目录。任何命令非零或超时立即失败，不自动重试；缺少 CLI、安装前置状态不成立、卸载未清理也不能通过。

`results.json` 是实际运行的结构化结果，七条管理命令均退出 0：

| 检查点 | 列表包含插件 | 启用配置 | 缓存 Skill 数 |
|---|---|---|---|
| 安装后 | 是 | 是 | 1 |
| 移除 marketplace 后 | 否 | 是 | 1 |
| 显式卸载后 | 否 | 否 | 0 |

脚本对安装与卸载控制做硬断言，对 marketplace 移除后的状态做观察，方便后续版本显示不同结果；一次脚本退出 0 不代表继续复现此差异。测试版本及二进制哈希见结果文件，不把本 alpha 二进制等同于当前 main 源码或所有发布版。

## 未完成的运行时观察

较早一次独立探测尝试 `debug prompt-input`，退出 1：

```text
Error: failed to load AGENTS.md instructions for environment `local`: fs sandbox helper failed with status exit status: 1: error building bubblewrap command: app-server socket directory must be a user-owned directory with mode 0700
```

这是运行环境的安全前置阻断，不能当成 Skill 加载或不加载的证据。该动作已停止，未调整 socket 权限、沙箱设置或换入口重试；本可复跑脚本不包含 prompt、会话或模型调用。因此结果只支持管理状态不一致，不能独立确认“隐藏插件仍活跃”，也不提出安全影响结论。没有使用用户配置或账号数据。

## 与已有报告的关系

社区 issue #59689 原文在本地构建的 0.166.0 上报告了列表、配置和 prompt 的完整差异；同帖后续评论还报告官方 `rust-v0.166.0` Linux musl 发布版九条命令通过。它们是报告者证据，不是本实验的复跑结果。本次窄增量是另一个已安装 alpha 二进制上的管理状态与显式卸载控制，不冒充完整 issue 复现或新增上游缺陷。源码只用于确认本地 marketplace 结构，未由该源码构建本次二进制。

来源（2026-11-05 核实）：[社区 issue #59689](https://github.com/openai/codex/issues/59689)；[发布版补充报告](https://github.com/openai/codex/issues/59689#issuecomment-6663103699)；官方固定源码 [marketplace 添加测试](https://github.com/openai/codex/blob/49f0c6022596c361fe676a5c4738fb2be34e3a93/codex-rs/cli/tests/marketplace_add.rs)与[移除测试](https://github.com/openai/codex/blob/49f0c6022596c361fe676a5c4738fb2be34e3a93/codex-rs/cli/tests/marketplace_remove.rs)。
