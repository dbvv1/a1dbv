# CLAUDE.md

本文件为 Claude Code 在此仓库中工作时提供指引。

## 仓库性质

这是一个**知识库 + 配置模板**仓库：收集整理 AI / AI Coding 相关的工具、Agent、Skill、MCP、工作流，
并以“本地大型 Unity 项目”为重点落地分支。目前没有可构建的程序代码。

## 目录

- `docs/`：通用 AI coding 知识（编号表示阅读顺序）
- `unity/`：Unity × AI 分支
- `templates/`：可直接拷贝到其他项目的配置（`templates/unity/.claude/` 是给 Unity 项目用的，**不是本仓库自身的配置**）
- `ai-config/`：个人本地配置的脱敏导出
- `scripts/`：辅助脚本

## 编写约定

- 文档使用中文；工具名、命令、代码保持原文。
- 新增工具信息时附**来源链接**，并在文档头部更新“核实时间”。不确定的信息标注「待验证」，或放进 `docs/09-resources.md` 的 Backlog。
- 优先写“怎么选、怎么用、坑在哪”，而不是堆砌链接。
- 修改 `templates/` 下的脚本后，要用模拟输入实际跑一遍（Hook 用伪造的 JSON stdin，Unity 脚本用伪造的 Unity 可执行文件）。
- 文本文件统一 UTF-8、LF 换行、2 空格缩进（见 `.editorconfig`、`.gitattributes`）。

## 安全

- 本仓库是 **public**：禁止提交密钥、token、内部地址、公司项目代码或本机绝对路径。
- 导出个人配置必须经过 `scripts/export-ai-config.sh` 扫描 + 人工审查。
