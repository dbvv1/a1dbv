# 并行工作目录：Worktrunk 的价值在管理

> 核实时间：2026-10-12。🧪 试用；未安装或执行 Git 变更。
> 发布快照：[v0.80.0](https://github.com/max-sixty/worktrunk/releases/tag/v0.80.0)，**2026-09-27**。**[一手：release]**

## 原生基线与适用人群

Codex 已支持 worktree、并行聊天与 Local/Worktree Handoff；[官方文档](https://learn.chatgpt.com/docs/environments/git-worktrees) 说明其底层 Git 工作树共享部分元数据，不能当安全沙箱。只在应用里跑一两项任务，原生通常足够。**[一手；经验：判断]**

经常跨终端、IDE、Codex、Claude Code 切换，目录多到容易开错时，再试 [Worktrunk](https://github.com/max-sixty/worktrunk/blob/main/README.md)：分支名寻址、工作树状态列表、创建/切换/移除与 Hook。它改善管理，不创造新的 Git 隔离保证。**[一手；经验：采用判断]**

## 有价值的用户反馈也包含代价

[#3454](https://github.com/max-sixty/worktrunk/issues/3454) 使用者称状态列表让十多棵工作树更好管理，同时指出迁移后的配置与 Hook 困惑；核实时仍开放。这是单人反馈，不是全体生产力结论。**[社区：原帖单例]**

[0.73.0](https://github.com/max-sixty/worktrunk/releases/tag/v0.73.0) 记录陈旧注册路径被其他仓库占用时的误删修复；[0.80.0](https://github.com/max-sixty/worktrunk/releases/tag/v0.80.0) 又修复被 ignore 设置隐藏的脏子模块可能遭清理的问题。两项是历史修复记录，不表示当前仍必现，也不是本轮复测成功；清理安全比省几次输入更重要。**[一手：changelog；经验：判断]**

## 许可、额外执行与 Windows

[LICENSE](https://github.com/max-sixty/worktrunk/blob/main/LICENSE) 为 MIT 或 Apache-2.0 双许可。普通 Git 管理与调用模型生成提交信息分别计成本；0.80.0 说明首次接受 Codex 提示还会创建专用提交指令文件。安装后额外配置和模型调用仍需逐项审查。**[一手：LICENSE/release；经验：边界]**

[#3355](https://github.com/max-sixty/worktrunk/issues/3355) 有 Windows Defender 拦截报告，机器人回复称误报，不等于独立安全鉴定。不得据此直接关闭防护或添加排除；先核验官方资产及上游处理。Windows 资产存在，不代表 PowerShell、Git Bash、WSL 混用都已验证。**[社区：单例；经验：安全边界]**

## 最小试用与退出

以下为待执行设计 **[经验：设计]**：
- 一次性测试仓库，先无自定义 Hook 地列出/切换，再测试未提交文件、脏子模块、目录重命名、残留注册和异常中断。
- 记录中文/空格路径、盘符、Git 来源和 shell；验证原生 Git 可接管。
- 每个工作树仍要隔离端口、测试数据库和服务；复制 `.env` 不是无风险便利操作。
- Hook 是命令执行：读清内容与目录后再考虑安装依赖、启动服务或复制配置。
- 不自动删除无法解释的目录；两套管理器互相影响生命周期、维护成本高于收益时，退回 Codex/Git 原生。

[返回模块](README.md) · 并行设计见 [08](../08-multi-agent.md)
